(function() {
  $(function() {
    var AllDone, createFileRef, id, parm, table_name, uploadFile, v_crud;
    Vue.directive('model-checkbox', {
      twoWay: true,
      bind: function(value) {
        this.checkboxChange = (function() {
          var dataContainer, dataKey, dataKeys, i, _i, _j, _k, _len, _len1, _len2, _newValuesStr, _value, _values, _valuesStr;
          if (this.el.checked) {
            dataKeys = this.raw.split(".");
            dataContainer = this.vm.$data;
            i = 0;
            for (_i = 0, _len = dataKeys.length; _i < _len; _i++) {
              dataKey = dataKeys[_i];
              if (!dataContainer[dataKey] && (i + 1) !== dataKeys.length) {
                dataContainer[dataKey] = {};
              }
              if ((i + 1) !== dataKeys.length) {
                dataContainer = dataContainer[dataKey];
              }
              i++;
            }
            if (dataContainer[dataKeys[dataKeys.length - 1]]) {
              return dataContainer[dataKeys[dataKeys.length - 1]] = dataContainer[dataKeys[dataKeys.length - 1]] + "," + this.el.value;
            } else {
              return dataContainer[dataKeys[dataKeys.length - 1]] = this.el.value;
            }
          } else {
            dataKeys = this.raw.split(".");
            dataContainer = this.vm.$data;
            i = 0;
            for (_j = 0, _len1 = dataKeys.length; _j < _len1; _j++) {
              dataKey = dataKeys[_j];
              if ((i + 1) !== dataKeys.length) {
                dataContainer = dataContainer[dataKey];
              }
              i++;
            }
            _valuesStr = dataContainer[dataKeys[dataKeys.length - 1]];
            if (!_valuesStr) {
              return;
            }
            _values = _valuesStr.split(",");
            _newValuesStr = "";
            for (_k = 0, _len2 = _values.length; _k < _len2; _k++) {
              _value = _values[_k];
              if (_value !== this.el.value) {
                if (_newValuesStr === "") {
                  _newValuesStr = _value;
                } else {
                  _newValuesStr = _newValuesStr + "," + _value;
                }
              }
            }
            return dataContainer[dataKeys[dataKeys.length - 1]] = _newValuesStr;
          }
        }).bind(this);
        this.el.addEventListener('change', this.checkboxChange);
        return this.checkboxChange();
      },
      update: function(value) {
        var _checkedValues;
        _checkedValues = this.vm.$data.record.sex;
        if (_checkedValues && _checkedValues.indexOf(this.el.value) !== -1) {
          return this.el.checked = true;
        }
      },
      unbind: function() {
        return this.el.removeEventListener('change', this.checkboxChange);
      }
    });
    v_crud = new Vue({
      el: '#v_crud',
      data: {
        editable: true,
        record: {},
        loading: false,
        oper: '',
        table_desc: '',
        files: []
      },
      methods: {
        toggleEdit: function() {
          if (this.$data.editable) {
            return this.$data.editable = false;
          } else {
            return this.$data.editable = true;
          }
        },
        getTableName: function() {
          var parm;
          parm = window.bz.getUrlParm();
          return parm[2];
        },
        jump2List: function() {
          var path;
          path = '/crud_list/' + this.getTableName();
          return location.pathname = path;
        },
        save: function() {
          var data, table_name;
          data = this.$data;
          data.loading = true;
          table_name = this.getTableName();
          return $.post('/crud_api', JSON.stringify({
            table_name: table_name,
            record: data.record
          })).done(function(result) {
            if (result.error !== '0') {
              window.bz.showError5(result.error);
              return log(result.error);
            } else if (result.error === void 0) {
              return data.error_info = '未知错误';
            } else if (data.files.length > 0) {
              return uploadFile(data.files);
            } else {
              return AllDone(result);
            }
          });
        }
      }
    });
    AllDone = function(d) {
      v_crud.$set("loading", false);
      if (d.error === "0") {
        return window.bz.showSuccess5('提交成功...正在返回列表');
      } else {
        return window.bz.showError5(d);
      }
    };
    uploadFile = function(files) {
      return files.forEach(function(file) {
        if (file.temp.fd) {
          return $.ajax({
            url: "/file_upload",
            type: "POST",
            data: file.temp.fd,
            processData: false,
            contentType: false
          }).done(function(d) {
            return createFileRef(file, d);
          });
        } else {
          return $.post("/file_ref", JSON.stringify({
            "remove_files": file.temp.remove_files
          })).done(function(d) {
            return createFileRef(file);
          });
        }
      });
    };
    createFileRef = function(file, data) {
      var params;
      if (!file) {
        AllDone();
        return;
      } else if (!data) {
        params = {
          "remove_files": file.temp.remove_files
        };
      } else {
        params = {
          "column": file.column,
          "append_files": data.results,
          "remove_files": file.temp.remove_files,
          "table_name": table_name,
          "record_id": id
        };
      }
      return $.post("/file_ref", JSON.stringify(params)).done(AllDone);
    };
    table_name = v_crud.getTableName();
    parm = window.bz.getHashParms();
    id = parm[0].replace('#', '');
    parm = {
      table_name: table_name
    };
    if (id !== '') {
      v_crud.$data.oper = '编辑';
      parm.id = id;
    } else {
      v_crud.$data.oper = '新增';
    }
    return $.post('/crud', JSON.stringify(parm)).done(function(result) {
      var f, field, record, _i, _len, _ref, _results;
      if (result.error !== '0') {
        return window.bz.showError5(result.error);
      } else {
        v_crud.$data.table_desc = result.table_desc;
        if (result.data.length > 0) {
          record = result.data[0];
          for (field in record) {
            if (record[field] !== null && typeof record[field] === "object") {
              record[field] = JSON.stringify(record[field]);
            }
          }
          v_crud.$data.record = result.data[0];
          v_crud.$data.record.id = id;
        } else if (id !== '') {
          window.bz.showError5('未找到这条数据!');
        }
        if (result.all_files.length > 0) {
          _ref = result.all_files;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            f = _ref[_i];
            v_crud.$set(f.column, {
              "fd": null,
              "all_files": f.files,
              "remove_files": []
            });
            _results.push(v_crud.$data.files.push({
              "column": f.column,
              "temp": v_crud.$data[f.column]
            }));
          }
          return _results;
        }
      }
    });
  });

}).call(this);

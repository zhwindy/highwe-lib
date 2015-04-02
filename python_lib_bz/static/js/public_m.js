(function() {
  var getOptions, getValue, setWatch;

  Vue.config.delimiters = ['(%', '%)'];

  window.log = function(parm) {
    return console.log(parm);
  };

  window.delay = function(ms, func) {
    return setTimeout(func, ms);
  };

  setWatch = function(vm, arg, table_name, column_name, el) {
    return vm.$watch(arg, function(new_value) {
      if ($(el).is("select")) {
        return getOptions(table_name, column_name, new_value, function(options) {
          var hide, i, str;
          hide = $(el).hasClass("hide");
          if (options) {
            $(el).removeClass("hide");
            str = "<option value='' disabled='true' selected>--请选择--</option>";
            i = 0;
            while (i < options.length) {
              str += "<option value='" + options[i].value + "'>" + options[i].text + "</option>";
              i++;
            }
            return $(el).html(str);
          } else if (hide) {
            return $(el).addClass("hide");
          }
        });
      } else {
        return getValue(table_name, column_name, new_value, function(data) {
          return $(el).val(data[0].value);
        });
      }
    }, false, false);
  };

  getOptions = function(table_name, column_name, key, callback) {
    var str;
    if (!key) {
      return;
    }
    str = [table_name, column_name, key].join("/");
    return $.get("/cascade/options/" + str, function(data) {
      if (!data.error === "0") {
        return window.bz.showError5("获取数据失败，请刷新重试。");
      } else {
        return callback(data.options);
      }
    });
  };

  getValue = function(table_name, column_name, key, callback) {
    var str;
    if (!key) {
      return;
    }
    str = [table_name, column_name, key].join("/");
    return $.get("/cascade/value/" + str, function(data) {
      if (!data.error === "0") {
        return window.bz.showError5("获取数据失败，请刷新重试。");
      } else {
        return callback(data.options);
      }
    });
  };

  Vue.directive("cascade", function() {
    var column_name, parms, table_name;
    parms = this.expression.split(".");
    table_name = parms[0];
    column_name = parms[1];
    return setWatch(this.vm, this.arg, table_name, column_name, this.el);
  });

  Vue.directive('dateformat', function(value) {
    var date_str, el, mask;
    if (value) {
      el = $(this.el);
      mask = this.arg;
      date_str = window.bz.dateFormat(value, mask);
      return el.html(date_str);
    }
  });

  Vue.directive('ellipsis', function(str) {
    var el, len;
    if (str) {
      el = $(this.el);
      len = this.arg;
      if (len < str.length) {
        return el.html(str.substring(0, len) + "...");
      } else {
        return el.html(str);
      }
    }
  });

  Vue.directive('btn-loading', function(value) {
    var el;
    el = $(this.el);
    if (!!value) {
      el.children().hide();
      return el.prepend("<i class='fa fa-spin fa-spinner'></i>");
    } else {
      el.children(".fa.fa-spin.fa-spinner").remove();
      return el.children().show();
    }
  });

  Vue.directive('datepicker', {
    bind: function(value) {
      var _this, datepicker;
      _this = this;
      datepicker = $(this.el);
      datepicker.datepicker({
        format: "yyyy-mm-dd",
        language: "zh-CN",
        autoclose: true,
        forceParse: true,
        clearBtn: true
      }).on("changeDate", function(e) {
        var d_handle, d_str, j, l, len1, levels;
        levels = _this.raw.split(".");
        d_str = "";
        if (e.date) {
          d_str = e.date.valueOf();
        }
        console.log(_this.vm.$data);
        for (j = 0, len1 = levels.length; j < len1; j++) {
          l = levels[j];
          console.log(l, _this.vm.$data[l]);
          d_handle = _this.vm.$data[l];
        }
        return d_handle = d_str;
      }).siblings(".input-group-addon").on("click", function() {
        return datepicker.datepicker("show");
      });
      if (isNaN(value)) {
        return datepicker.datepicker('update', value);
      } else if (value) {
        return datepicker.datepicker('update', new Date(value));
      }
    },
    update: function(value) {
      if (value) {
        return $(this.el).datepicker('update', new Date(value));
      }
    },
    unbind: function() {
      return console.log("unbind");
    }
  });

  Vue.directive("process-icon", {
    update: function(value) {
      var img, path, src;
      if (value) {
        src = "";
        if (/^QQ/.test(value)) {
          src = "qq.png";
        } else if (/^Google Chrome/.test(value)) {
          src = "chrome.png";
        } else if (/^WeChat/.test(value)) {
          src = "weixin.png";
        } else if (/^iTerm/.test(value)) {
          src = "iterm2.png";
        } else if (/^node/.test(value)) {
          src = "nodejs.png";
        } else if (/python/.test(value) || /Python/.test(value)) {
          src = "python.png";
        } else if (/^nginx/.test(value)) {
          src = "nginx.png";
        } else if (/postgres/.test(value)) {
          src = "postgresql.png";
        } else if (/apache2/.test(value)) {
          src = "apache.png";
        } else if (/mysqld/.test(value)) {
          src = "mysql.png";
        } else if (/^java/.test(value)) {
          src = "java.png";
        } else {
          src = "default.png";
        }
        img = '<img src="/static/favicons/ico/' + src + '" height="16" style="margin-right: 4px;" width="16">';
        path = "";
        if (/dropbox/.test(value)) {
          path = "dropbox.ico";
        }
        if (path !== "") {
          img = '<img src="/static/favicons/' + path + '" height="16" style="margin-right: 4px;" width="16">';
        }
        if (value.length > 80) {
          value = value.substr(0, 80) + "+";
        }
        return $(this.el).html(img + value);
      }
    }
  });

  Vue.directive('a-active', {
    bind: function() {
      var href, path;
      href = $(this.el).attr('href');
      href = encodeURI(href);
      path = window.location.pathname;
      if (path.search(href) !== -1) {
        return $(this.el).addClass("active");
      }
    }
  });

  Vue.directive("release-icon", {
    update: function(value) {
      var file_name;
      file_name = 'hold.svg';
      if (value) {
        if (value.search("Windows") !== -1) {
          file_name = "windows8.svg";
        }
        if (value.search('Fedora') !== -1) {
          file_name = "fedora.svg";
        }
        if (value.search('Ubuntu') !== -1) {
          file_name = "ubuntu.svg";
        }
        if (value.search("CentOS") !== -1) {
          file_name = "centos.svg";
        }
        if (value.search('Windows XP') !== -1) {
          file_name = "windows.svg";
        }
        if (value.search('Windows 7') !== -1) {
          file_name = "windows.svg";
        }
        if (value.search('Windows 8.1') !== -1) {
          file_name = "windows8.svg";
        }
        if (value.search('Darwin') !== -1) {
          file_name = "osx.svg";
        }
        return this.el.src = "/static/images/system_icon/" + file_name;
      }
    }
  });

  Vue.directive('disable', function(value) {
    return this.el.disabled = !!value;
  });

  Vue.directive('active', function(value) {
    if (!!value) {
      return $(this.el).addClass("active");
    } else {
      return $(this.el).removeClass("active");
    }
  });

  $().toastmessage({
    sticky: false,
    position: 'top-right',
    stayTime: 5000
  });

  window.bz = {
    timeLen: function(that_time) {
      var day, desc, hour, interval, minute, month, now, second, year;
      second = 1000;
      minute = second * 60;
      hour = minute * 60;
      day = hour * 24;
      month = day * 30;
      year = month * 12;
      now = Date.now();
      interval = now - that_time;
      if (interval < minute) {
        desc = parseInt(interval / second) + "秒前";
      } else if (interval < hour) {
        desc = parseInt(interval / minute) + "分钟前";
      } else if (interval < day) {
        desc = parseInt(interval / hour) + "小时前";
      } else if (interval < month) {
        desc = parseInt(interval / day) + "天前";
      } else if (interval < year) {
        desc = parseInt(interval / month) + "个月前";
      } else {
        desc = parseInt(interval / year) + "年前";
      }
      return desc;
    },
    getLastParm: function() {
      var parms;
      parms = window.location.pathname.split('/');
      return parms[parms.length - 1];
    },
    getUrlParm: function() {
      var parms;
      parms = window.location.pathname.split('/');
      return parms;
    },
    getHashParms: function() {
      var parms;
      parms = window.location.hash.split('/');
      return parms;
    },
    showSuccess5: function(message) {
      var successToast;
      return successToast = $().toastmessage('showSuccessToast', message);
    },
    showNotice5: function(message) {
      var myToast;
      return myToast = $().toastmessage('showNoticeToast', message);
    },
    showWarning5: function(message) {
      var warningToast;
      return warningToast = $().toastmessage('showNoticeToast', message);
    },
    showError5: function(message) {
      var errorToast;
      return errorToast = $().toastmessage('showErrorToast', message);
    },
    preZero: function(num, len) {
      var a, numStr;
      numStr = num.toString();
      if (len < numStr.length) {
        return numStr;
      } else {
        a = new Array(len + 1).join("0") + numStr;
        return a.substr(a.length - len, a.length - 1);
      }
    },
    HTMLEncode: function(value) {
      return $("<div/>").html(value).text();
    },
    HTMLDecode: function(value) {
      return $("<div/>").text(value).html();
    },
    dateFormat: function(timestramp, mask) {
      var _this, date, matched_array, o, regStr, res;
      date = new Date(timestramp);
      _this = this;
      o = {
        "y+": function(len) {
          return _this.preZero(date.getFullYear(), len);
        },
        "M+": function(len) {
          return _this.preZero(date.getMonth() + 1, len);
        },
        "d+": function(len) {
          return _this.preZero(date.getDate(), len);
        },
        "h+": function(len) {
          return _this.preZero(date.getHours(), len);
        },
        "m+": function(len) {
          return _this.preZero(date.getMinutes(), len);
        },
        "s+": function(len) {
          return _this.preZero(date.getSeconds(), len);
        }
      };
      for (regStr in o) {
        matched_array = mask.match(new RegExp(regStr));
        if (matched_array) {
          res = o[regStr](matched_array[0].length);
          mask = mask.replace(matched_array[0], res);
        }
      }
      return mask;
    },
    formatUnit: function(value) {
      var desc, g, m, t;
      value = parseFloat(value);
      m = 1024;
      g = m * 1024;
      t = g * 1024;
      if (value > t) {
        desc = (value / t).toFixed(2) + 'TB';
      } else if (value > g) {
        desc = (value / g).toFixed(2) + 'GB';
      } else if (value > m) {
        desc = (value / m).toFixed(2) + 'MB';
      } else {
        desc = value + 'KB';
      }
      return desc;
    }
  };

}).call(this);

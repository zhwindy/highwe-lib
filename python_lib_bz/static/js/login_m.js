(function() {
  $(function() {
    var hash, v_login;
    v_login = new Vue({
      el: '#v_login',
      data: {
        error_info: false,
        loading: false
      },
      methods: {
        submit: function() {
          var data;
          data = this.$data;
          data.error_info = false;
          if (data.user_name === '' || data.user_name === void 0) {
            data.error_info = '请输入用户名';
            return;
          }
          if (data.password === '' || data.password === void 0) {
            data.error_info = '请输入用密码';
            return;
          }
          data.loading = true;
          return $.post('/login', JSON.stringify({
            user_name: data.user_name,
            password: data.password,
            email: data.email,
            type: 'login'
          }), function(result, done) {
            data.loading = false;
            if (result.error !== '0') {
              return data.error_info = result.error;
            } else if (result.error === void 0) {
              return data.error_info = '未知错误';
            } else {
              return location.pathname = '/';
            }
          });
        },
        signup: function() {
          var data;
          data = this.$data;
          if (data.password !== data.repassword) {
            data.error_info = '两次密码不一致';
            return;
          }
          return this.submit();
        },
        forget: function() {
          var data;
          data = this.$data;
          if (data.email === '' || data.email === void 0) {
            data.error_info = '请输入邮箱';
            return;
          }
          data.loading = true;
          $.post('/login', JSON.stringify({
            email: data.email,
            type: 'forget'
          }), function(result, done) {
            log(result);
            data.loading = false;
            if (result.error !== '' && result.error !== void 0) {
              if (result.error === 0) {
                return data.error_info = '您输入的邮箱不存在，请重试';
              } else {
                return data.error_info = '系统错误，请联系管理员';
              }
            } else {
              return data.error_info = '确认邮件已发送到您的邮箱中，请查收并设置新密码';
            }
          });
        },
        setPassword: function() {
          var data;
          data = this.$data;
          if (data.password_set !== data.repassword_set) {
            data.error_info = '两次输入的密码不一致';
            return;
          }
          data.loading = true;
          return $.post('/login', JSON.stringify({
            token: hash[1],
            password: data.password_set,
            type: 'setPassword'
          }), function(result, done) {
            if (result.error !== '' && result.error !== void 0) {
              return data.error_info = '您的链接已失效，请重新获取邮件';
            } else {
              return data.error_info = '设置成功，请重新登录';
            }
          });
        },
        cleanError: function() {
          return this.$data.error_info = false;
        }
      }
    });
    hash = window.bz.getHashParms();
    if (hash[0] === "#token") {
      return $('#tab a').tab('show');
    }
  });

}).call(this);

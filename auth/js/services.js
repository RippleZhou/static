!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User;
    var queryParams = Utils.queryParams;

    var Services = window.Services = {};
    //判断是否在微信浏览器中
   User.weichatAuth();

    Services.login = function (params) {
        params.appversion = 'lastest';

        return Utils.ajax.post('/IbabyWebService/3/Patient/FastSignIn', params);
    };

    Services.register = function (params) {
        params.appversion = 'lastest';

        return Utils.ajax.post('/IbabyWebService/3/Patient/FastSignUp', params);
    };

    Services.sendSMSCode = function (mobile, desc) {
        var params = {
            mobile: mobile,
            desc: desc,
            captchacode:$('#captchacode').val()
        };
        return Utils.ajax.post('/IbabyWebService/3/SendVerificationCode', params).then(function (rel) {
            document.getElementById('imgcode').style.display = 'none';
            document.getElementById('send-box').style.display = 'block';
            document.getElementById('loginbtn').style.display = 'block';
        },function (rel) {
            aid.tip.show(rel||'验证码有误');
        })

    };

})(window, $);

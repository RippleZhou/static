var Utils = window.Utils, queryParams = Utils.queryParams;
if (Utils.storage.get('textforlogin')){
    $('#inner-login #banner').html(Utils.storage.get('textforlogin'));
    $('#inner-login #banner').addClass('has');
    window.localStorage.removeItem('textforlogin');
}
User.setUser('');
//刷新图形验证码
function reimage() {
    //获取当前的时间作为参数，无具体意义
    var timenow = new Date().getTime();
    $('#reloadimage').attr("src", "/IbabyWebService/3/captcha?date" + timenow);
}

$('.framework-loading').remove();
(function () {
    var smsCode = {
        timer: null,
        countdown: 0,
        originalCountdown: 120
    };

    $('#loginForm').on('submit', login);
    $('#registerForm').on('submit', register);
    $('#sendSmsCode').on('click', showimgcode);
    $('#checkcode').on('click',sendSmsCode);

    function showimgcode() {
        document.getElementById('imgcode').style.display = 'block';
        document.getElementById('send-box').style.display = 'none';
        document.getElementById('loginbtn').style.display = 'none';
    }

    function clearTimer() {
        if (smsCode.timer) {
            clearTimeout(smsCode.timer);
            smsCode.timer = null;
        }
    }

    //login 1st
    function login(evt) {
        evt.preventDefault();

        var $mobile = $('#mobile');
        var $code = $('#code');
        if (!input_check.phone($mobile.val())) {
            aid.tip.show('手机号码格式不对~');
            return;
        }
        if (!$mobile.val() || !$code.val()) {
            aid.tip.show('请填写登录信息！');
            return;
        }

        Services.login({
            mobile: $mobile.val(),
            code: $code.val()
        }).then(function (result) {
            if (result) {
                loginSuccess(result);
            } else { // new user
                if (queryParams.openid) { // 微信中，直接取微信名为用户名，替用户完成注册
                    $('#username').val(queryParams.nickname);
                    window.localStorage.removeItem('textfornewuser');
                    register(evt);
                } else { // 弹出用户名，输入框，方便完成后续注册
                    $('#loginForm').css('display', 'none');
                    $('#registerForm').css('display','block');
                    if(Utils.storage.get('textfornewuser')){
                        $('#inner-login #banner').html(Utils.storage.get('textfornewuser'));
                        $('#inner-login #banner').addClass('has');
                        window.localStorage.removeItem('textfornewuser');
                        $('#registerForm').css('display', 'block');
                    }
                }
            }
        });
    }

    function loginSuccess(user) { //登录成功后
        var queryParams = Utils.queryParams;
        var params = {};
        if (queryParams.openid) { //微信中，绑定微信信息
            params.patientid = user.patientid;
            params.openid = queryParams.openid;
            params.wechatname = queryParams.nickname;
            params.headimgurl = queryParams.headimgurl;
            params.sex = queryParams.sex;
            params.city = queryParams.city;
            params.province = queryParams.province;
            user.openid = queryParams.openid;
            user.wechatname = queryParams.nickname;
            user.headimgurl = queryParams.headimgurl;
            user.sex = queryParams.sex;
            user.city = queryParams.city;
            user.province = queryParams.province;
            Utils.ajax.post('/IbabyWebService/Weixin/PatientBindOpenid', params).then(function (rel) {
                User.setUser(user);
                $('#inner-login').fadeOut(1000);

                // 登陆成功之后执行的函数,可在父页面写
                try {
                    loginSuccessThenDo();
                }catch(err) {

                }
            });
        } else {
            User.setUser(user);
            $('#inner-login').fadeOut(1000);
            // 登陆成功之后执行的函数,可在父页面写
            try {
                loginSuccessThenDo();
            }catch(err) {

            }
        }
    }

    function register(evt) { //新用户输入用户名后提交
        evt.preventDefault();

        var $mobile = $('#mobile');
        var $username = $('#username');

        if (!$mobile.val() || !$username.val()) {
            aid.tip.show('请填写个性昵称！');
            return;
        }
        //过滤emoji
        var ranges = [
            '\ud83c[\udf00-\udfff]',
            '\ud83d[\udc00-\ude4f]',
            '\ud83d[\ude80-\udeff]'
        ];
        var username=$username.val();
        //username = username.replace(new RegExp(ranges.join('|'), 'g'), '');
        Services.register({
            mobile: $mobile.val(),
            username: username,
            captchacode:$('#captchacode').val()
        }).then(loginSuccess);
    }

    function sendSmsCode() { //发送手机验证码
        var $mobile = $('#mobile');

        if (!$mobile.val()) {
            aid.tip.show('请填写手机号！');
            return false;
        }
        if (!$('#captchacode').val()) {
            aid.tip.show('请填图中验证码！');
            return false;
        }

        Services.sendSMSCode($mobile.val(), '快速登录');

        startCountdown();

    }

    function startCountdown() { //发送验证码倒计时
        smsCode.countdown = smsCode.originalCountdown;
        $('#sendSmsCode').attr('disabled', true);

        countdown();

        function countdown() {
            clearTimer();

            smsCode.countdown -= 1;
            if (smsCode.countdown > 0) {
                $('#sendSmsCode').text(smsCode.countdown + '后重新发送');
                smsCode.timer = setTimeout(countdown, 1000);
            }
            else {
                $('#sendSmsCode').text('发送验证码').attr('disabled', false);
            }
        }
    }
})();

var input_check = {
    emptyText: '填写完全部信息,再提交~',
    check: function (str, text, reg) {
        if (str) {
            return (!(reg.test(str)) ? (diyalert(text, 1000)) : true);
        } else {
            diyalert(input_check.emptyText, 1000);
            return false;
        }
    },
    //只能输入汉字
    name: function (str, text) {
        var text = text ? text : '请输入正确的姓名!';
        var reg = /^[\u4e00-\u9fa5]{1,}$/;
        return input_check.check(str, text, reg);
    },
    phone: function (str, text) {
        text = text ? text : '手机号码有误,请重新输入!';
        var reg = /^1[3|4|5|7|8]\d{9}$/;
        return input_check.check(str, text, reg);
    },
    //只能输入数字、字母、下划线,且必须字母开头
    password: function (str, text) {
        var reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        text = text ? text : '密码有误';
        return input_check.check(str, text, reg);
    },
    null: function (str, text) {
        text = text ? text : '请输入内容';
        if (str && str != '') {
            return true;
        } else {
            diyalert(text, 1000);
            return false;
        }
    }
}
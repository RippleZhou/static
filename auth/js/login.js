wechat.share();

//刷新图形验证码
function reimage() {
    //获取当前的时间作为参数，无具体意义
    var timenow = new Date().getTime();
    $('#reloadimage').attr("src", "/IbabyWebService/3/captcha?date" + timenow);
}

(function () {
    var smsCode = {
        timer: null,
        countdown: 0,
        originalCountdown: 120
    };

    if (User.getUser()) {
        gotoLoginSuccessPage();
        return;
    }

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

    function gotoLoginSuccessPage() {
        var queryParams = Utils.queryParams;
        var params = {};
        if (queryParams.openid) {
            var user = User.getUser();
            params.patientid = user.patientid;
            params.openid = queryParams.openid;
            params.wechatname = queryParams.nickname;
            params.headimgurl = queryParams.headimgurl;
            params.sex = queryParams.sex;
            params.city = queryParams.city;
            params.province = queryParams.province;
            Utils.ajax.post('/IbabyWebService/Weixin/PatientBindOpenid', params).then(function (rel) {
                var returnUrl = Utils.storage.get('returnUrl');
                location.href = returnUrl || '/static/user/user-center.html';
            });
        } else {
            var returnUrl = Utils.storage.get('returnUrl');
            location.href = returnUrl || '/static/user/user-center.html';
        }
    }

    function login(evt) {
        evt.preventDefault();

        var $mobile = $('#mobile');
        var $code = $('#code');

        if (!input_check.phone($mobile.val())){
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
            }
            else {
                $('#loginForm').css('display', 'none');
                $('#registerForm').css('display', 'block');
            }
        });
    }

    function loginSuccess(user) {
        User.setUser(user);

        aid.tip.show('登录成功！', gotoLoginSuccessPage);
    }

    function register(evt) {
        evt.preventDefault();

        var $mobile = $('#mobile');
        var $username = $('#username');

        if (!$mobile.val() || !$username.val()) {
            aid.tip.show('请填写个性昵称！');
            return;
        }

        Services.register({
            mobile: $mobile.val(),
            username: $username.val()
        }).then(loginSuccess);
    }
    function sendSmsCode() {
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


    function startCountdown() {
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
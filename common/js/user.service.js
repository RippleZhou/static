!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User = {};

    var queryParams = Utils.queryParams;

    var STORAGE_USER = 'USER';
    var _user = Utils.storage.get(STORAGE_USER);

    var ua = window.navigator.userAgent.toLowerCase();

    //内嵌登陆
    User.innerlogin = function (textforlogin, textfornewuser) {
        try {
            Utils.storage.set('textforlogin', textforlogin);
            Utils.storage.set('textfornewuser', textfornewuser);
        } catch (err) {
        }
        $('body').append('<div id="innerlogin"></div>');
        $('#innerlogin').load("/static/auth/innerlogin.html?v1.021");
    }

    User.getUser = function () {
        if (!_user) {
            _user = Utils.storage.get(STORAGE_USER);
        }

        return _user;
    };

    //微信页面，需要微信授权;
    /* 授权之后的url过长，简化
     if (ua.match(/MicroMessenger/i) == 'micromessenger'){
     if (queryParams.openid) {
     Utils.storage.set('wechatinfor',queryParams);
     history.pushState('','',location.href.split('?')[0]+Utils.storage.get('thisbaseurl'));
     Utils.queryParams = Utils.getQueryParams();
     Utils.storage.remove('thisbaseurl')
     }
     }
     */
    User.weichatAuth = function () {
        //微信授权相关参数
        var wechat = {};
        wechat.appid = 'wx4adefaa3ed78a2ba';
        wechat.redirect_uri = 'http%3a%2f%2fdev.ibaby-plan.org%2faiding-web%2fapi%2fweLogin';
        if (!queryParams.openid) {
            Utils.storage.set('befor_auth_params', queryParams);
        }
        if (ua.match(/MicroMessenger/i) == 'micromessenger' && !queryParams.openid) {
            if (User.getUser()) {
                if (!User.getUser().openid) {
                    location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechat.appid + '&redirect_uri='
                        + wechat.redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=' +
                        location.href.split('#')[0].split('?')[0] + '&connect_redirect=1#wechat_redirect');
                    return;
                }
            } else {
                location.replace('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + wechat.appid + '&redirect_uri='
                    +wechat.redirect_uri + '&response_type=code&scope=snsapi_userinfo&state=' +
                    location.href.split('#')[0].split('?')[0] + '&connect_redirect=1#wechat_redirect');
                return;
            }
        }
    }

    User.setUser = function (user) {
        if (user) {
            if (!_user) {
                _user = user;
            }
            else {
                var token = user.token || _user.token;
                $.extend(_user, user, {token: token}); // 只有登录时才会返回token
            }

            if (_user.birthday) {
                _user.age = new Date().getFullYear() - _user.birthday;
            }

            if (_user.readyforpregnancydate) {
                _user.pregnancyDuration = Math.round(Date.duration(_user.readyforpregnancydate).month);
            }

            Utils.storage.set(STORAGE_USER, _user);
        }
        else {
            _user = null;
            Utils.storage.remove(STORAGE_USER);
        }

        return User;
    };


    User.redirectToLoginPage = function (returnUrl) {
        var loginPageUrl = '/static/auth/login.html';

        if (!returnUrl) {
            returnUrl = location.href;
        }
        Utils.storage.set('returnUrl', returnUrl);
        location.href = loginPageUrl + '?returnUrl=' + encodeURIComponent(returnUrl);
    };

    User.initChannelUser = (function () {
        var isIniting = false;
        var callbacks = [];

        if (!queryParams.channel || !queryParams.openid) {
            return $.Deferred().reject();
        }

        if (isIniting) {
            var deferred = $.Deferred();

            callbacks.push(function (user) {
                deferred.resolve(user);
            });

            return deferred.promise();
        }

        isIniting = true;

        var url = '/IbabyWebService/3/Patient/ChannelSignUp';

        var params = {
            appkey: queryParams.appkey,
            channel: queryParams.channel,
            nickname: queryParams.nickname,
            openid: queryParams.openid,
            timestamp: queryParams.timestamp,
        };

        return Utils.ajax.post(url, params).then(loginSuccess);
        function loginSuccess(user) {
            user.channel = queryParams.channel;
            User.setUser(user);

            while (callbacks.length) {
                callbacks.pop()(user);
            }

            isIniting = false;

            return user;
        }
    });

    // 在App中打开页面特别逻辑：获取"inapp"、"token"和"userid"
    var SESSION_IS_IN_APP = 'IN_APP';
    var SESSION_TOKEN = 'TOKEN';
    var SESSION_USER_ID = 'USER_ID';

    var _isInApp = Utils.IS_IN_APP;
    var _token = queryParams.token;
    var _userid = queryParams.userid;

    if (_isInApp != 'undefined' && _isInApp != null) {
        Utils.session.set(SESSION_IS_IN_APP, _isInApp);
    }
    else {
        _isInApp = Utils.session.get(SESSION_IS_IN_APP);
    }
    User.IS_IN_APP = _isInApp;

    if (_userid) {
        Utils.session.set(SESSION_USER_ID, _userid);
    }
    else {
        _userid = Utils.session.get(SESSION_USER_ID);
    }

    if (_token) {
        Utils.session.set(SESSION_TOKEN, _token);
    }
    else {
        _token = Utils.session.get(SESSION_TOKEN);
    }

    // 页面跳转需要发送请求通知App
    User.notifyAppWebViewNavChange = notifyAppWebViewNavChange;

    if (_isInApp && _token && _userid) {
        getUserById(_userid, _token);
        notifyAppWebViewNavChange();
    }
    else if (_user) {
        if (queryParams.channel && queryParams.openid) {
            // 渠道用户必须清空 storage 中用户信息，并以 initChannelUser 开始
            User.setUser(null);
        }
        else {
            /*
             getUserById(_user.patientid, _user.token);
             */
        }
    }

    function getUserById(userid, token) {
        if (!userid || !token) {
            return $.Deferred().reject();
        }

        var params = {token: token};

        return Utils.ajax.get('/IbabyWebService/3/Patient/PatientInfo/' + userid, params).then(setUser);

        function setUser(result) {
            if (!_isInApp && !_user) {
                // 用户在网页中访问时，token失效之后会清除用户信息，此时不再更新
                return null;
            }

            if (result && !result.token) {
                result.token = token;
            }

            User.setUser(result);
            return result;
        }
    }

    function notifyAppWebViewNavChange(title, url) {
        if (!_isInApp || !_userid) {
            return $.Deferred().reject();
        }

        var params = {
            title: title || document.title,
            url: url,
            patientid: _userid,
        };

        return Utils.ajax.post('/IbabyWebService/App/patient/webviewnav', params);
    }

})(window, $);

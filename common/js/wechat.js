(function (window, $) {
    var IS_IN_WECHAT = window.navigator.userAgent && window.navigator.userAgent.match(/micromessenger/i);

    var IS_ONLINE = window.location.href.search('127.0.0.1') === -1 && window.location.href.search('localhost') === -1 && window.location.href.search('192.168.') === -1;
    var SERVER_URL = IS_ONLINE ? window.location.origin : 'http://ibaby-plan.org:8180';

    var encode = window.encodeURIComponent;

    var _defaultShareOptions = {
        appid: '',
        title: '爱丁助孕服务',
        desc: '爱丁备孕助孕服务为您提供优质、轻奢、舒适的医疗体验',
        imgUrl: 'http://www.ibabycenter.com/front/images/300.png'
    };

    var Service = {};

    Service.get = function (url) {
        return $.get(SERVER_URL + url).then(function (result) {
            if (result.status === 0) {
                return result.content;
            }
            else {
                console.error(result.errmsg);
                return $.Deferred().reject(result.errmsg);
            }
        });
    };

    Service.auth = function (code) {
        return Service.get('/static/servicemall/api/wxjsapiauth.php?code=' + encode(code));
    };

    Service.authRefresh = function (token) {
        return Service.get('/static/servicemall/api/wxjsapiauthrefresh.php?refresh_token=' + encode(token));
    };

    Service.signature = function () {
        var url = window.location.href.split('#')[0];
        return Service.get('/static/servicemall/api/wxjsapisign.php?url=' + encode(url));
    };

    Service.clearTicket = function (url) {
        return Service.get('/static/servicemall/api/cleartoken');
    };

    var wechat = function () {
        var wx = window.wx;

        var isScriptLoaded = !!wx;
        var isWxReady = false;

        var ready = function (callback) {
            if(!$ || !$.get || !$.getScript) {
                throw 'Error jquery library';
            }

            if (typeof callback !== 'function') {
                callback = noop;
            }

            if(isScriptLoaded) {
                callback();
            }
            else {
                $.getScript('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', function () {
                    isScriptLoad = true;
                    wx = window.wx;
                    callback();
                });
            }
        };

        var config = function (options, callback) {
            if (typeof options !== 'object') {
                throw 'Error wechat config options';
            }

            if (typeof callback !== 'function') {
                callback = noop;
            }

            if (!_defaultShareOptions.appid) {
                _defaultShareOptions.appid = options.appId;
            }

            wx.config({
                debug: !!(window.location.href.match(/\?.*debug=([^&]*)/)),
                appId: options.appId,
                nonceStr: options.nonceStr,
                timestamp: options.timestamp,
                signature: options.signature,
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo']
            });

            wx.ready(function () {
                isWxReady = true;
                callback();
            });

            wx.error(function (reason) {
                if(reason == 'invalid signature') {
                    Service.clearTicket();
                }
            });
        }

        var signature = function (callback) {
            if (typeof callback !== 'function') {
                callback = noop;
            }

            if (isWxReady) {
                callback();
            }
            else {
                ready(function () {
                    Service.signature().then(function (result) {
                        config(result, callback);
                    });
                });
            }
        };

        var share = function (options) {
            if (typeof options !== 'object') {
                throw 'Error wechat share options';
            }

            signature(function () {
                wx.onMenuShareTimeline({
                    title: options.title,
                    link: options.link,
                    imgUrl: options.imgUrl,
                    fail: function (err) {
                        console.error(err);
                    }
                });

                wx.onMenuShareAppMessage({
                    title: options.title,
                    desc: options.desc,
                    link: options.link,
                    imgUrl: options.imgUrl,
                    success: function (err) {
                        console.log(err);
                    },
                    fail: function (err) {
                        console.error(err);
                    }
                });

                wx.onMenuShareQQ({
                    title: options.title,
                    desc: options.desc,
                    link: options.link,
                    imgUrl: options.imgUrl,
                    fail: function (err) {
                        console.error(err);
                    }
                });

                wx.onMenuShareWeibo({
                    title: options.title,
                    link: options.link,
                    imgUrl: options.imgUrl,
                    fail: function (err) {
                        console.error(err);
                    }
                });
            });
        };

        var auth = function (callback) {
            ready(function () {
                var code = getQueryParams().code;

                var REFRESH_TOKEN = 'REFRESH_TOKEN';

                if(code) {
                    Service.auth(code).then(function (result) {
                        window.localStorage.setItem(REFRESH_TOKEN, result.refresh_token);
                        callback(result);
                    });
                }
                else {
                    var refreshToken = window.localStorage.getItem(REFRESH_TOKEN);

                    if(refreshToken) {
                        Service.authRefresh(refreshToken).then(callback, function () {
                            window.localStorage.removeItem(REFRESH_TOKEN);
                            redirectToAuthPage();
                        });
                    }
                    else {
                        redirectToAuthPage();
                    }
                }
            });
        };

        return {
            share: function (options) {
                if(!IS_IN_WECHAT) return;

                if (!options) {
                    options = {};
                }

                if (!options.link) {
                    options.link = window.location.href;
                }
                options.link = options.link.replace(/(_username=[^&]+)|(_password=[^&]+)/g, '');

                if (!options.title) {
                    options.title = _defaultShareOptions.title || window.document.title;
                }

                if (!options.imgUrl) {
                    options.imgUrl = _defaultShareOptions.imgUrl;
                }
                if (options.imgUrl.search(/^http/) === -1) {
                    options.imgUrl = window.location.origin + options.imgUrl;
                }

                if (!options.desc) {
                    options.desc = _defaultShareOptions.desc;
                }

                share(options);
            },
            auth: function (callback) {
                if(typeof callback !== 'function') {
                    callback = noop;
                }

                var urlParams = getQueryParams();

                if(urlParams._username && urlParams._password) {
                    callback({
                        username: urlParams._username,
                        password: urlParams._password
                    });
                }
                else if(IS_IN_WECHAT) {
                    auth(callback);
                }
                else if (urlParams.debug) {
                    callback({
                        username: 'admin',
                        password: '21232f297a57a5a743894a0e4a801fc3'
                    });
                }
            }
        };
    };

    function getQueryParams() {
        var params = {};
        var queryString = window.location.search.replace(/^\?/, '').split('&');
        var param;

        queryString.forEach(function (d, i) {
            if (d) {
                param = d.split('=');
                params[param[0]] = window.decodeURIComponent(param[1]);
            }
        });

        return params;
    }

    function noop() {}

    function redirectToAuthPage() {
        var queryString = toQueryString({
            appid: _defaultShareOptions.appid,
            redirect_uri: window.location.href,
            response_type: 'code',
            scope: 'snsapi_userinfo',
            state: 'STATE#wechat_redirect'
        });

        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + queryString;
    }

    function toQueryString(params) {
        if(typeof params !== 'object') {
            return params;
        }

        var str = '';

        for(var key in params) {
            if (params.hasOwnProperty(key)) {
                str += '&' + key + '=' + window.encodeURIComponent(params[key]);
            }
        }

        return str.slice(1);
    }

    window.wechat = wechat();

})(window, window.$);

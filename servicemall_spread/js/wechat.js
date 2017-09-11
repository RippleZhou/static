
(function (window, $) {
    var userAgent = window.navigator.userAgent;

    var isInWechat = userAgent && userAgent.match(/micromessenger/i);

    var IS_ONLINE = window.location.href.search('127.0.0.1') === -1 && window.location.href.search('localhost') === -1 && window.location.href.search('192.168.') === -1;
    var SERVER_URL = IS_ONLINE ? window.location.origin : 'http://ibaby-plan.org:8180';

    var serviceUrls = {
        auth: SERVER_URL + '/static/servicemall/api/wxjsapiauth.php?code=:code',
        authRefresh: SERVER_URL + '/servicemall/api/wxjsapiauthrefresh.php?refresh_token=:refresh_token',
        signature: SERVER_URL + '/servicemall/api/wxjsapisign.php?url=:url',
        cleartoken: SERVER_URL + '/servicemall/api/cleartoken'
    };

    var defaults = {
        appid: 'APP_ID',
        title: '爱丁助孕服务',
        desc: '爱丁备孕助孕服务为您提供优质、轻奢、舒适的医疗体验',
        imgUrl: 'http://www.ibabycenter.com/front/images/300.png'
    };

    var wechat = function () {
        var wx = window.wx;

        var ready = function (callback) {
            if(wx) {
                callback();
            }
            else {
                var jssdkUrl = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js';

                if(typeof define == 'function') {
                    require([jssdkUrl], function (_wx) {
                        wx = _wx;
                        callback();
                    });
                }
                else if($) {
                    $.getScript(jssdkUrl, function () {
                        wx = window.wx;
                        callback();
                    });
                }
                else {
                    throw 'Please load jquery first';
                }
            }

        };

        var signature = function (url, callback) {
            ready(function () {
                $.get(serviceUrls.signature.replace(':url', encodeURIComponent(url))).then(function (result) {
                    if(result.status === 0) {
                        wx.config({
                            debug: !!(window.location.href.match(/\?.*debug=([^&]*)/)),
                            appId: result.content.appId,
                            nonceStr: result.content.nonceStr,
                            timestamp: result.content.timestamp,
                            signature: result.content.signature,
                            jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo']
                        });

                        wx.ready(callback);

                        wx.error(function (reason) {
                            if(reason == 'invalid signature') {
                                $.get(serviceUrls.cleartoken);
                            }
                        });

                    }
                    else {
                        console.error(result.errmsg);
                    }
                });
            });

        };

        var share = function (options) {
            options.link = options.shareLink?options.shareLink:options.link;
            wx.onMenuShareTimeline({
                title: options.title,
                link: options.link,
                imgUrl: options.imgUrl,
                fail: function (err) {
                    console.log(err);
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
                    console.log(err);
                }
            });

            wx.onMenuShareQQ({
                title: options.title,
                desc: options.desc,
                link: options.link,
                imgUrl: options.imgUrl,
                fail: function (err) {
                    console.log(err);
                }
            });

            wx.onMenuShareWeibo({
                title: options.title,
                link: options.link,
                imgUrl: options.imgUrl,
                fail: function (err) {
                    console.log(err);
                }
            });

        };

        var auth = function (callback) {
            var urlParams = window.location.href.match(/\?.*code=([^&]*)/);

            var code = urlParams && urlParams[1];

            if(code) {
                window.$.get(serviceUrls.auth.replace(':code', code), function (result) {
                    if(result.status === 0) {
                        var user = result.content;

                        window.localStorage.setItem('REFRESH_TOKEN', user.refresh_token);
                        callback(user);
                    }
                });

            }
            else {
                var refresh_token = window.localStorage.getItem('REFRESH_TOKEN');

                if(refresh_token) {
                    $.get(serviceUrls.authRefresh.replace(':refresh_token', refresh_token)).then(function (result) {
                        if(result.status === 0) {
                            callback(result.content);
                        }
                        else {
                            window.localStorage.removeItem('REFRESH_TOKEN');
                            redirectToAuthPage();
                        }
                    });
                }
                else {
                    redirectToAuthPage();
                }

            }

        };

        return {
            share: function (options) {
                if(!isInWechat) return;

                !options && (options = {});
                !options.link && (options.link = window.location.href.split('#')[0]);
                !options.title && (options.title = defaults.title || window.document.title);
                !options.imgUrl && (options.imgUrl = defaults.imgUrl);
                !options.desc && (options.desc = defaults.desc);

                if (options.imgUrl.search(/^http/) === -1) {
                    options.imgUrl = window.location.origin + options.imgUrl;
                }

                options.link = options.link.replace(/(_username=[^&]+)|(_password=[^&]+)/g, '');

                signature(options.link, function () {
                    share(options);
                });

            },
            auth: function (callback) {
                if(typeof callback !== 'function') {
                    throw 'callback must be function';
                }

                var urlParams = getQueryParams();

                if(urlParams._username && urlParams._password) {
                    callback({
                        username: urlParams._username,
                        password: urlParams._password
                    });
                }
                else if(isInWechat) {
                    ready(function () {
                        auth(callback);
                    });
                }

            },
            checkUser: function (isReturnQueryString, callback) {
                if(typeof isReturnQueryString == 'function') {
                    callback = isReturnQueryString;
                    isReturnQueryString = false;
                }

                if(typeof callback !== 'function') {
                    throw 'callback must be function';
                }

                var _callback = callback;

                callback = function (user) {
                    if(isReturnQueryString) {
                        _callback(user ? '?' + '_username=' + user.username + '&_password=' + user.password : '');
                    }
                    else {
                        _callback(user || {});
                    }
                };

                var urlParams = getQueryParams();

                if(urlParams._username && urlParams._password) {
                    callback({
                        username: urlParams._username,
                        password: urlParams._password
                    });
                }
                else if(isInWechat) {
                    ready(function () {
                        var refresh_token = window.localStorage.getItem('REFRESH_TOKEN');

                        if(refresh_token) {
                            window.$.get(serviceUrls.authRefresh.replace(':refresh_token', refresh_token), function (result) {
                                if(result.status === 0) {
                                    callback(result.content);
                                }
                                else {
                                    callback();
                                }
                            });
                        }
                        else {
                            callback();
                        }
                    });
                }
                else {
                    callback({
                        // username: 'admin',
                        // password: '21232f297a57a5a743894a0e4a801fc3'
                    });
                }

            }
        };
    };

    function redirectToAuthPage() {
        window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?' + toQueryString({
            appid: defaults.appid,
            redirect_uri: window.encodeURIComponent(window.location.href),
            response_type: 'code',
            scope: 'snsapi_userinfo',
            state: 'STATE#wechat_redirect'
        });
    }

    function toQueryString(params) {
        if(typeof params !== 'object') {
            return params;
        }

        var str = '';

        for(var key in params) {
            str += '&' + key + '=' + params[key];
        }

        return str.slice(1);
    }

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

    window.wechat = wechat();

})(window, window.$);

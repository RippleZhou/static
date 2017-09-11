!(function (window, $) {
    //var IS_ONLINE = window.location.href.search('127.0.0.1') === -1 && window.location.href.search('localhost') === -1 && window.location.href.search('192.168.') === -1;
    var IS_ONLINE=true;
    var SERVER_URL = IS_ONLINE ? window.location.origin : 'http://ibaby-plan.org:8180';

    var Utils = window.Utils = {};

    Utils.IS_IN_APP = getQueryParams().inapp == '1';
    Utils.IS_ONLINE = IS_ONLINE;
    Utils.SERVER_URL = SERVER_URL;

    // common
    Utils.queryParams = getQueryParams();
    Utils.getQueryParams = getQueryParams;

    function getQueryParams() {
        var params = {};
        var queryString = window.location.search.replace(/^\?/, '').split('&');
        var param;

        queryString.forEach(function (d, i) {
            if (d) {
                param = d.split('=');
                params[param[0]] = decodeURIComponent(param[1]);
            }
        });

        // 如果有aid-开头的参数，就覆盖掉不带aid-的参数，以此来防止所需channel等参数和第三方需要参数重名
        for (var key in params) {
            if (params.hasOwnProperty(key) && params['aid-' + key]) {
                params[key] = params['aid-' + key];
            }
        }

        return params;
    }


    // storage
    Utils.storage = {};

    Utils.storage.set = function (key, data) {
        try {
            data = window.JSON.stringify(data);
        }
        catch (ex) {
        }

        return window.localStorage.setItem(key, data);
    };

    Utils.storage.get = function (key) {
        var data;

        try {
            data = window.JSON.parse(window.localStorage.getItem(key));
        }
        catch (ex) {
        }

        return data;
    };

    Utils.storage.remove = function (key) {
        return window.localStorage.removeItem(key);
    };


    // session
    Utils.session = {};

    Utils.session.set = function (key, data) {
        try {
            data = window.JSON.stringify(data);
        }
        catch (ex) {
        }

        return window.sessionStorage.setItem(key, data);
    };

    Utils.session.get = function (key) {
        var data;

        try {
            data = window.JSON.parse(window.sessionStorage.getItem(key));
        }
        catch (ex) {
        }

        return data;
    };

    Utils.session.remove = function (key) {
        return window.sessionStorage.removeItem(key);
    };


    // ajax
    Utils.ajax = {
        getFullUrl: getFullUrl,
        silent: {},
    };

    if (!IS_ONLINE) {
        $.ajaxSettings.beforeSend = function (xhr, req) {
            // console.log(req);
            console.log(req.type + ': ' + req.url);

            if (req.data) {
                console.log(decodeURIComponent(req.data));
            }
        };
    }

    var methods = {
        get: function (onlineUrl, params, offlineUrl) {
            return $.get(getFullUrl(onlineUrl, offlineUrl), params);
        },
        post: function (url, params) {
            return $.post(getFullUrl(url), params);
        },
        postForm: function (url, params) {
            return $.ajax({
                type: 'POST',
                url: getFullUrl(url),
                data: params,
                contentType: false,
            });
        },
        postJSON: function (url, params) {
            return $.ajax({
                type: 'POST',
                url: getFullUrl(url),
                data: JSON.stringify(params),
                contentType: 'application/json;charset=UTF-8',
            });
        },
        put: function (url, params) {
            return $.ajax({
                type: 'PUT',
                url: getFullUrl(url),
                data: params,
            });
        },
        delete: function (url) {
            return $.ajax({
                type: 'DELETE',
                url: getFullUrl(url),
            });
        },
        upload: function (url, params) {
            return $.ajax({
                type: 'POST',
                url: getFullUrl(url),
                data: params,
                cache: false,
                contentType: false,
                processData: false,
            })
        }
    };

    $.each(methods, function (type, fn) {
        Utils.ajax[type] = function () {
            $.ajaxSettings.headers = getAjaxHeaders();

            showLoading();

            var promise = fn.apply(null, arguments);

            var timer = setTimeout(function () {
                promise.abort();
            }, 15000);

            promise.always(fnAjaxAlways);

            return promise.then(fnAjaxSuccess, fnAjaxError);

            function fnAjaxAlways() {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }

                hideLoading();
            }

            function fnAjaxError(xhr, type) {
                var errmsg;

                switch (type) {
                    case 'abort':
                        errmsg = '请求超时，请稍后重试！';
                        break;
                    default:
                        errmsg = '发送请求失败，请稍后重试！';
                        break;
                }

                showTip(errmsg);
                return $.Deferred().reject(errmsg);
            }
        };

        Utils.ajax.silent[type] = function () {
            $.ajaxSettings.headers = getAjaxHeaders();

            return fn.apply(null, arguments).then(fnAjaxSuccess, fnAjaxError);

            function fnAjaxError() {
                return $.Deferred().reject();
            }
        };
    });

    function fnAjaxSuccess(result) {
        if (result.status === undefined) {
            return result;
        }

        if (result.status === 0) {
            return result.content;
        }

        var callback;

        if (result.status === 20 && window.User) {
            window.User.setUser(null);

            callback = function () {
                window.User.redirectToLoginPage();
            };
        }

        var errmsg = result.errmsg;
        showTip(errmsg, callback);

        return $.Deferred().reject(errmsg);
    }

    function getAjaxHeaders(headers) {
        if (!headers) {
            headers = {};
        }

        var user = window.User && window.User.getUser();

        headers.appversion = 'lastest';
        headers.channel = 'services-wap';

        if (user) {
            headers.token = user.token;
            headers.uuid = user.uuid;
        }

        return headers;
    }

    function getFullUrl(onlineUrl, offlineUrl) {
        var url;

        if (onlineUrl && onlineUrl.search('http') === -1) {
            onlineUrl = SERVER_URL + onlineUrl;
        }

        if (onlineUrl && offlineUrl) {
            url = IS_ONLINE ? onlineUrl : offlineUrl;
        }
        else {
            url = onlineUrl || offlineUrl;
        }

        return url || '';
    }

    function showLoading() {
        if (window.aid && window.aid.loading) {
            window.aid.loading.show();
        }
    }

    function hideLoading(delay) {
        if (window.aid && window.aid.loading) {
            window.aid.loading.hide(delay);
        }
    }

    function showTip(msg, callback) {
        if (window.aid && window.aid.tip) {
            window.aid.tip.show(msg, callback);
        }
    }

})(window, $);

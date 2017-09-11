!(function (window, $) {

    var IS_ONLINE = window.location.href.search(/\/servicemall\//) > -1;
    var SERVER_URL = IS_ONLINE ? window.location.origin : 'http://ibaby-plan.org:8180';

    var Services = window.Services = {};


    // utils
    Services.getQueryParams = function () {
        var params = {};
        var queryString = window.location.search.replace(/^\?/, '').split('&');
        var param;

        queryString.forEach(function (d, i) {
            if (d) {
                param = d.split('=');
                params[param[0]] = decodeURIComponent(param[1]);
            }
        });

        return params;
    };

    Services.setStorage = function (key, data) {
        try {
            data = window.JSON.stringify(data);
        }
        catch (ex) {}

        return window.localStorage.setItem(key, data);
    };

    Services.getStorage = function (key) {
        var data;

        try {
            data = window.JSON.parse(window.localStorage.getItem(key));
        }
        catch (ex) {}

        return data;
    };

    Services.removeStorage = function (key) {
        return window.localStorage.removeItem(key);
    };


    // global
    var STORAGE_TID = 'RECOMMEND_TID';
    var STORAGE_USER = 'USER';
    var _tid = Services.getStorage(STORAGE_TID);
    var _user = Services.getStorage(STORAGE_USER);

    Services.getUser = function () {
        if (!_user) {
            _user = Services.getStorage(STORAGE_USER);
        }

        return _user;
    };

    Services.setUser = function (user) {
        if (user) {
            if (!_user) {
                _user = user;
            }
            else {
                $.extend(_user, user);
            }
            Services.setStorage(STORAGE_USER, _user);
        }
        else {
            _user = null;
            Services.removeStorage(STORAGE_USER);
        }

        return Services;
    };

    Services.getTid = function () {
        if (!_tid) {
            _tid = Services.getStorage(STORAGE_TID);
        }

        return _tid;
    };

    Services.setTid = function (tid) {
        if (tid) {
            _tid = tid;
            Services.setStorage(STORAGE_TID, _tid);
        }
        else {
            _tid = null;
            Services.removeStorage(STORAGE_TID);
        }

        return Services;
    };

    Services.isRecommended = function () {
        return !!Services.getQueryParams().tid;
    };


    // services
    Services.getAjaxPromise = function (method, onlineUrl, offlineUrl, params) {
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

        if (!url) {
            throw 'Unexcept "url"';
        }

        $.ajaxPrefilter(function (opt) {
            opt.headers = {
                token: _user ? _user.token : null,
                uuid: _user ? _user.uuid : null,
                channel: 'services-wap',
                version: 'lastest'
            };
        });

        return $[method](url, params);
    };

    Services.login = function (params) {
        return Services.getAjaxPromise('post', '/IbabyWebService/3/Patient/SignIn', null, params);
    };

    Services.register = function (params) {
        return Services.getAjaxPromise('post', '/IbabyWebService/3/Patient/SignUp', null, params);
    };

    Services.sendSMSCode = function (params) {
        return Services.getAjaxPromise('post', '/IbabyWebService/3/SendVerificationCode', null, params);
    };

    Services.getOrders = function () {
        return Services.getAjaxPromise('getJSON', '/k2/index.php?g=servicemall&m=serviceorder&a=userorders&userid=' + _user.patientid, '/json/myservers.json');
    };

    Services.getCategorys = function () {
        return Services.getAjaxPromise('getJSON', '/servicemall/api/serviceManifest.php', '/json/categorys.json');
    };

    Services.getCategorysBookingAmounts = function () {
        return Services.getAjaxPromise('getJSON', '/k2/index.php?g=servicemall&m=service&a=count', '/json/bookingAmount.json');
    };

    Services.getService = function () {
        var params = Services.getQueryParams();

        if (params.tid) {
            Services.setTid(params.tid);
        }

        return Services.getAjaxPromise('getJSON', '/static/servicemall_spread/json/services/' + params.pcode + '.json', '/static/servicemall_spread/json/services/' + params.pcode + '.json');
    };

    Services.getDoctor = function () {
        var params = Services.getQueryParams();
        return Services.getAjaxPromise('getJSON', '/servicemall/api/serviceDoctor.php?doctorkey=' + params.doctor, '/json/doctors/' + params.doctor + '.json');
    };

    Services.getServiceAvaliableTimes = function () {
        var params = Services.getQueryParams();
        return Services.getAjaxPromise('getJSON', '/k2/index.php?g=servicemall&m=service&a=aservice&pcode=' + params.pcode, '/json/avaliableTimes.json');
    };

    Services.book = function (params) {
        if (_tid) {
            params.tid = _tid;
        }

        return Services.getAjaxPromise('post', '/k2/index.php?g=servicemall&m=serviceorder&a=apply', null, params);
    };

    $(function () {
        $('body').on('click', '.book', function () {
            if (!Services.getUser()) {
                var authUrl = '../../views/' + (Services.getTid() ? 'register.html' : 'login.html');
                var returnUrl = $(this).attr('href').replace(/^..\/..\//, '../');

                location.href = authUrl + '?returnUrl=' + encodeURIComponent(returnUrl);
                return false;
            }

            return true;
        });
    });

})(window, jQuery);

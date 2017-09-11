!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User;

    var Services = window.Services = {};

    var queryParams = Utils.getQueryParams();
var user = User.getUser();
            if(user==null){
                User.redirectToLoginPage(location.href);
            }
    Services.getOrders = function () {
        var params = {
            g: 'servicemall',
            m: 'serviceorder',
            a: 'userorders',
            userid: User.getUser().patientid
        };

        return Utils.ajax.get('/k2/index.php', params);
    };

    Services.getCategorys = function () {
        return Utils.ajax.get('/static/servicemall/api/serviceManifest.php', null, '/static/servicemall/json/categorys.json').then(appendChannel);

        function appendChannel(result) {
            if (_channel) {
                $.each(result, function (pcode, category) {
                    category.channel = _channel;
                });

                result.C.services = result.C.services.filter(function (d) {
                    return Array.isArray(d.channels) && d.channels.indexOf(_channel) > -1;
                });
            }

            return result;
        }
    };

    Services.getCategorysBookingAmounts = function () {
        var params = {
            g: 'servicemall',
            m: 'service',
            a: 'count'
        };

        return Utils.ajax.get('/k2/index.php', params, '/static/servicemall/json/bookingAmount.json');
    };

    Services.getService = function () {
        var params = {
            pcode: queryParams.pcode
        };

        return Utils.ajax.get('/static/servicemall/api/serviceContentDetail.php', params, '/static/servicemall/json/services/' + params.pcode + '.json').then(appendChannel);

        function appendChannel(result) {
            if (result && _channel) {
                result.channel = _channel;
            }

            return result;
        }
    };

    Services.getDoctor = function () {
        var params = {
            doctorkey: queryParams.doctor
        };

        return Utils.ajax.get('/static/servicemall/api/serviceDoctor.php', params, '/static/servicemall/json/doctors/' + params.doctorkey + '.json');
    };

    Services.getServiceAvaliableTimes = function () {
        var params = {
            g: 'servicemall',
            m: 'service',
            a: 'aservice',
            pcode: queryParams.pcode
        };

        return Utils.ajax.get('/k2/index.php', params);
    };

    Services.book = function (params) {
        if (Services.getTid()) { // 推荐信息
            params.tid = Services.getTid();
        }

        if (_channel && _channerUser) { // 渠道信息
            params.channel = _channel;
            params.openid = _channerUser.openid;
        }
        else {
            params.userid = User.getUser().patientid;
        }

        return Utils.ajax.post('/k2/index.php?g=servicemall&m=serviceorder&a=apply', params).then(pushOrderToChannel);

        function pushOrderToChannel(result) {
            if (_channel && _channerUser) {// 预订成功后将订单反馈给渠道
                params.orderid = result.orderid;
                Services.pushOrderToChannel(params);

                return {isFromChannel: true};
            }

            return result;
        }
    };


    // 推荐逻辑
    var STORAGE_TID = 'RECOMMEND_TID';
    var _tid = Utils.storage.get(STORAGE_TID);

    Services.getTid = function () {
        if (!_tid) {
            _tid = Utils.storage.get(STORAGE_TID);
        }

        return _tid;
    };

    Services.setTid = function (tid) {
        if (tid) {
            _tid = tid;
            Utils.storage.set(STORAGE_TID, _tid);
        }
        else {
            _tid = null;
            Utils.storage.remove(STORAGE_TID);
        }

        return Services;
    };

    Services.isRecommended = function () {
        return !!queryParams.tid;
    };

    if (queryParams.tid) {
        Services.setTid(queryParams.tid);
    }


    // 渠道逻辑（仅“康大预诊”）
    var _channels = {
        KDYZ: {
            APPID: 'ibabysdk',
            SECRET: 'wozhegebushixiapaidea',
            SERVER_URL: Utils.IS_ONLINE ? '/KDYZ' : '/KDYZ/weitao'
            // SERVER_URL: Utils.IS_ONLINE ? 'http://open.kangda.cn/' : 'http://www.kangda.love/weitao'
        }
    };

    var _channel = _channels[queryParams.channel] ? queryParams.channel : null;
    var _channelOptions = _channels[_channel];

    var STORAGE_CHANNEL_USER = 'USER-' + (_channel ? _channel.toUpperCase() : 'UNKNOWN');
    var _channerUser = Utils.storage.get(STORAGE_CHANNEL_USER);

    Services.getChannelUser = function () {
        if (!_channerUser) {
            _channerUser = Utils.storage.get(STORAGE_CHANNEL_USER);
        }

        return _channerUser;
    };

    Services.setChannelUser = function (user) {
        if (user) {
            if (!_channerUser) {
                _channerUser = user;
            }
            else {
                $.extend(_channerUser, user);
            }
            Utils.storage.set(STORAGE_CHANNEL_USER, _channerUser);
        }
        else {
            _channerUser = null;
            Utils.storage.remove(STORAGE_CHANNEL_USER);
        }

        return Services;
    };

    Services.channelAjax = {};

    ['get', 'post'].forEach(function (type) {
        Services.channelAjax[type] = function (url, params) {
            if (!_channel) {
                aid.alert.show('未知的渠道，请联系爱丁医生！', function () {
                    location.href = '/static/servicemall/'
                });
                return $.Deferred().reject();
            }

            url = Utils.ajax.getFullUrl(_channelOptions.SERVER_URL + url);
            params = getChannelAjaxParams(params);

            showLoading();
            hideLoading(10000); // 10秒之后强制隐藏loading

            return $[type](url, params, {crossDomain: true}).then(fnAjaxSuccess, fnAjaxError);
        };
    });

    function getChannelAjaxParams(params) {
        if (!params) {
            params = {};
        }

        if (window.md5) {
            var signature = 'appId' + _channelOptions.APPID;

            Object.keys(params).sort(function (a, b) {
                return a > b ? 1 : -1;
            }).forEach(function (key) {
                signature += key + params[key];
            });

            signature += 'secret' + _channelOptions.SECRET;
            params.signature = window.md5(signature).toLowerCase();
        }

        params.appId = _channelOptions.APPID;

        return params;
    }

    function fnAjaxError() {
        hideLoading();

        var errmsg = '发送请求失败，请稍后重试！';
        showTip(errmsg);

        return $.Deferred().reject(errmsg);
    }

    function fnAjaxSuccess(result) {
        if (result.code === 0) {
            return result.data;
        }

        var errmsg = result._msg;
        showTip(errmsg);

        return $.Deferred().reject(errmsg);
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

    function showTip(msg) {
        if (window.aid && window.aid.tip) {
            window.aid.tip.show(msg);
        }
    }

    Services.initChannelUser = function () {
        if (!queryParams.openid) {
            return $.Deferred().reject();
        }

        var params = {
            openid: getQueryParams.openid
        };

        return Services.channelAjax.post('/ibaby/user_info.json', params).then(saveUser);

        function saveUser(result) {
            Services.setChannelUser({
                openid: result.user.openid,
                realname: result.user.nickname,
                mobilenum: result.user.mobile,
            });

            return result;
        }
    };

    Services.pushOrderToChannel = function (params) {
        var params = {
            orderid: params.orderid,
            openid: _channerUser.openid,
            mobile: params.phone,
            nickname: params.name,
            pcode: params.pcode,
            pname: params.pname,
            sway: params.sway,
            price: toJavaFloat(params.price),
            address: params.addr,
            date: params.time ? params.time.split(' ')[0] : null,
            time: params.time ? params.time.split(' ')[1] : null,
            commitTime: Date.now(),
            memos: '[]',
        };

        return Services.channelAjax.post('/ibaby/order_commit_success.json', params);
    };

    if (_channel) {
        if (window.md5) {
            Services.initChannelUser();
        }
        else {
            $.getScript('/static/common/lib/md5.min.js', Services.initChannelUser);
        }
    }


    $(function () {
        $('body').on('click', '#book', function () {
            if (!Services.getChannelUser() && !User.getUser()) {
                User.redirectToLoginPage($(this).prop('href'));
                return false;
            }

            return true;
        });
    });

    function toJavaFloat(value) {
        return $.isNumeric(value) ? value == parseInt(value) ? value + '.0' : value.toFixed(2) : '0.0';
    }

    // $.each(Services, function (name, fn) {
    //     var originFn = fn;

    //     Services[name] = function () {
    //         var args = [].slice.call(arguments, 0);

    //         if (User.getUser()) {
    //             return originFn.apply(null, args);
    //         }
    //         else {
    //             return User.initChannelUser().then(function () {
    //                 return originFn.apply(null, args);
    //             }, function () {
    //                 return $.Deferred().reject();
    //             });
    //         }
    //     };
    // });

})(window, $);

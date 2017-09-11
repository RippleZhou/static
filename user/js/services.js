!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User;

    var Services = window.Services = {};

    Services.upload = function (formdata) {
        return Utils.ajax.upload('/IbabyWebService/File/Upload', formdata);
    };

    Services.update = function (params) {
        return Utils.ajax.postJSON('/IbabyWebService/3/Patient/Update', params);
    };

    Services.suggest = function (params) {
        return Utils.ajax.post('/IbabyWebService/3/SaveFeedback', params);
    };

})(window, $);

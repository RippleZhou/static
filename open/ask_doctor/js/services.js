!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User;

    var Services = window.Services = {};

    var queryParams = Utils.getQueryParams();

    try {
        if (queryParams.channel == 'ghy') { //修改提示语
            $('#duration-select').css('z-index','-111');
            $('textarea').attr('placeholder','请您详细描述您的问题，爱丁医生会给您提供最专业的解答。拍照上传检查报告、用药资料会让医生更快的了解您的问题。');
            document.title = '爱丁宫寒咨询';
            $('#dit_title').html('今日提问');
        }
    } catch (err) {
    }
    Services.getSummary = function () {
        var url = '/IbabyWebService/3/Question/MyQuestionSummary';

        var params = {
            channel: queryParams.channel,
            patientid: User.getUser().patientid,
        };

        return Utils.ajax.get(url, params);
    };

    Services.createQuestion = function (params) {
        var uid = User.getUser().patientid;

        var durationUnit = 30 * 24 * 3600 * 1000;

        var user = {
            patientid: uid,
            birthday: new Date().getFullYear() - params.age,
            readyforpregnancydate: new Date(Date.now() - params.duration * durationUnit).format('YYYY-MM-DD')
        };

        params.patientid = uid;
        params.channel = queryParams.channel;

        aid.loading.show();

        return $.when(
            Utils.ajax.silent.post('/IbabyWebService/3/Question/Patient/AddQuestion', params),
            Utils.ajax.silent.postJSON('/IbabyWebService/3/Patient/Update', user)
        ).always(function () {
            aid.loading.hide();
        }).then(function (question) {
            User.setUser(user);

            return question;
        });
    };

    Services.getQuestions = function (params) {
        var uid = User.getUser().patientid;
        var url = '/IbabyWebService/3/Question/Patient/QuestionList/' + uid;

        return Utils.ajax.get(url, params);
    };

    $.each(Services, function (name, fn) {
        var originFn = fn;

        Services[name] = function () {
            var args = [].slice.call(arguments, 0);

            if (User.getUser()) {
                return originFn.apply(null, args);
            }
            else {
                return User.initChannelUser().then(function () {
                    return originFn.apply(null, args);
                }, function () {
                    aid.tip.show('获取渠道用户失败！');
                    return $.Deferred().reject();
                });
            }
        };
    });

})(window, $);

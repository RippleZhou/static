!(function (window, $) {

    var Utils = window.Utils;
    var User = window.User;

    var Services = window.Services = {};

    var queryParams = Utils.getQueryParams();

    Services.comment = function (params) {
        var url = '/IbabyWebService/3/Question/Patient/RateQuestion';

        params.patientid = User.getUser().patientid;
        params.questionid = queryParams.questionid;

        return Utils.ajax.post(url, params);
    };

    Services.create = function (params) {
        var uid = User.getUser().patientid;
        var url = '/IbabyWebService/3/Question/Patient/AddQuestion';

        params.patientid = uid;
        params.channel = queryParams.channel || 'empty';

        return Utils.ajax.post(url, params);
    };

    // Services.formatMessage = function (d) {
    //     if (d.type == 2) {
    //         d.$record = getRecordBySchema(d.content);
    //     }
    //     else if (d.type == 3) {
    //         d.$knowledge = getObjectFromJSONContent(d.content);
    //     }
    //     else if (d.type == 4) {
    //         d.$link = getObjectFromJSONContent(d.content);
    //     }
    // };

    Services.get = function (params) {
        var user = User.getUser();
        var url = '/IbabyWebService/3/Question/GetQuestionDetail/';

        params.patientid = user.patientid;
        params.questionid = queryParams.questionid;

        return Utils.ajax.get(url + params.questionid, params).then(formatServerData);

        function formatServerData(result) {
            // 好孕妈渠道逻辑
            if (user.channel === 'haoyunma') {
                result.list = result.list.filter(function (d) {
                    return d.type !== 2 && d.type !== 3;
                });

                if (params.offset + params.limit >= result.total) {
                    var firstMessage = result.list[result.list.length - 1];

                    result.list.push({
                        content: JSON.stringify({
                            title: '亲爱的姐妹，我是爱丁医生，来自爱丁专业备孕助孕机构，特约为好孕妈用户提供备孕问题解答。<span>更多了解，点击查看>></span>',
                            url: '../common/about-us.html'
                        }),
                        createtime: firstMessage && firstMessage.createtime,
                        questionid: params.questionid,
                        role: 0,
                        type: 4
                    })
                }
            }

            $.each(result.list, function (i, d) {
                formatMessage(d);
            });

            return result;
        }
    };

    Services.getQuestions = function (params) {
        var uid = User.getUser().patientid;
        var url = '/IbabyWebService/3/Question/Patient/QuestionList/' + uid;
        return Utils.ajax.get(url, params);
    };

    Services.getRealtime = function () {
        var qid = queryParams.questionid;
        var uid = User.getUser().patientid;
        var url = '/IbabyWebService/HttpBind/Patient/' + uid + '?timestamp=' + Date.now();

        return Utils.ajax.silent.get(url).then(formatServerData);

        function formatServerData(result) {
            if (result.type == 'QUESTION' && result.payload.questionid == qid) {
                return formatMessage(result.payload);
            }

            return null;
        }
    };

    Services.getComment = function () {
        var url = '/IbabyWebService/3/Question/Patient/RateInfo/' + queryParams.questionid;

        return Utils.ajax.get(url, null);
    };

    Services.read = function () {
        var url = '/IbabyWebService/3/Question/Patient/Command/read';
        var params = {
            patientid: User.getUser().patientid,
            questionid: queryParams.questionid,
        };

        return Utils.ajax.post(url, params);
    };

    Services.reply = function (params) {
        var url = '/IbabyWebService/3/Question/Patient/PostQuestion';

        params.role = 1;
        params.patientid = User.getUser().patientid;
        params.questionid = queryParams.questionid;
        params.createtime = new Date().format('YYYY-MM-DD HH:mm:ss');

        return Utils.ajax.post(url, params).then(function () {
            return params;
        });
    };

    Services.replyMessage = function (message) {
        return Services.reply({type: 0, content: message});
    };

    Services.replyPhoto = function (photo) {
        return Services.upload(photo).then(function (result) {
            return Services.reply({type: 1, content: result});
        });
    };

    Services.upload = function (file) {
        var formData = new FormData();
        formData.append('file', file);

        return Utils.ajax.upload('/IbabyWebService/File/Upload', formData);
    };

    var user = User.getUser();

    var records = [
        {
            key: 'menses',
            label: '月经记录',
            viewAnalyticsKey: 'MenstruationData',
            url: '/static/record-data/menstruation_data.html'
        },
        {
            key: 'temperature',
            label: '体温数据',
            viewAnalyticsKey: 'TempData',
            url: '/static/temperature-chart/index.html'
        },
        {
            key: 'ovulatory',
            label: '试纸数据',
            viewAnalyticsKey: 'LHData',
            url: '/static/record-data/dipstick_data.html'
        },
        {
            key: 'bultrasonicinspection',
            label: 'B超数据',
            viewAnalyticsKey: 'UltrasoundData',
            url: '/static/record-data/bultrasound_data.html'
        },
        {
            key: 'leukorrhea',
            label: '白带数据',
            viewAnalyticsKey: 'LeukorrheaData',
            url: '/static/record-data/leucorrhea-data.html'
        },
        {
            key: 'daily',
            label: '身体状况',
            viewAnalyticsKey: 'DiaryData',
            url: '/static/record-data/physiclal-status.html'
        },
        {
            key: 'doctoradvice',
            label: '医嘱数据',
            viewAnalyticsKey: 'DiaryData',
            url: '/static/record-data/doctor-advice.html'
        },
        {
            key: 'memorabilia',
            label: '诊疗记录',
            viewAnalyticsKey: 'TreatData',
            url: '/resources/weixin/patient_timeline/index.html?patientId=' + (user && user.patientid || ''),
        },
    ];

    function formatMessage(message) {
        if (message.type == 2) {
            message.$record = getRecordBySchema(message.content);
        }
        else if (message.type == 3) {
            message.$knowledge = getObjectFromJSONContent(message.content);
        }
        else if (message.type == 4) {
            message.$link = getObjectFromJSONContent(message.content);
        }
        else if (message.type == 5) {
            message.$media = getObjectFromJSONContent(message.content);
        }
        return message;
    }

    function getRecordBySchema(schema) {
        var key = schema.replace('aiding://record/', '');

        for (var i = records.length - 1; i >= 0; i--) {
            if (key == records[i].key) {
                return records[i];
            }
        }

        return {};
    }

    function getObjectFromJSONContent(content) {
        try {
            return JSON.parse(content);
        }
        catch (ex) {}

        return {};
    }

    if (!Date.prototype.format) {
        Date.prototype.format = function (format) {
            format = format || 'YYYY-MM-DD HH:mm:ss';

            var date = this;

            var o = {
                'M+': date.getMonth() + 1,
                'D+': date.getDate(),
                'H+': date.getHours(),
                'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
                'm+': date.getMinutes(),
                's+': date.getSeconds(),
                'q+': Math.floor((date.getMonth() + 3) / 3),
                'S': date.getMilliseconds(),
                'E+': '日一二三四五六七'.split('')[date.getDay()]
            };

            if(/(Y+)/.test(format)) {
                format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }

            for(var k in o) {
                if(new RegExp("("+ k +")").test(format)) {
                    format = format.replace(RegExp.$1,  RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
                }
            }

            return format;
        };
    }

})(window, $);

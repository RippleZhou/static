var Utils = window.Utils, User = window.User, ua = window.navigator.userAgent.toLowerCase(), queryParams = Utils.queryParams, nthpage = 1;
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    if (!queryParams.openid) {
        if (Utils.queryParams.none == 1) { //不需要 登陆
        } else {
            User.weichatAuth();
        }
    }
}
getquestion('E011');
var evaluteAnswers = [];
function getquestion(code) {
    Utils.ajax.get('/IbabyWebService/3/Evalute/GetQuestionList?code=' + code).then(function (rel) {
        var mainQuestions = rel;
        var html = template('qhtml', mainQuestions);
        document.querySelector('#questions').innerHTML = html;
    })
}
window.wechat.share({
    title: '健康自测丨你被"宫寒"偷袭了吗？',
    desc: '是不是"宫寒"，一测便知！',
    imgUrl: 'http://ibaby-plan.org/static/evaluate/E/E011/img/share.jpeg'
})
function submit() {
    if (Utils.queryParams.none == 1) {
        var params = {
            evaluteAnswers: JSON.stringify(evaluteAnswers),
            patientid: 227415,
            code: 'E011'
        }
        Utils.ajax.post('/IbabyWebService/3/Evalute/CommitEvaluteAnswer', params).then(function (rel) {
            location.href = 'result.html?none=1';
        })
    } else {
        if (!User.getUser()) {
            User.innerlogin();
            return false;
        } else {
            var params = {
                evaluteAnswers: JSON.stringify(evaluteAnswers),
                patientid: User.getUser().patientid,
                code: 'E011'
            }
            Utils.ajax.post('/IbabyWebService/3/Evalute/CommitEvaluteAnswer', params).then(function (rel) {
                location.href = 'result.html';
            })
        }
    }
}
function check() {
    var alength = $('.answers:not(:hidden)').length;
    $('.answers:not(:hidden)').each(function () {
        if ($(this).find('.selected').length == 0) {
            $('#nofinish').show();
            setTimeout("$('#nofinish').fadeOut(1000)", 1000);
            return false;
        } else {
            alength--;
        }
        if (alength == 0) {
            for (var i = 0; i < $('.selected:not(:hidden)').length; i++) {
                evaluteAnswers.push({
                    questionid: $('.selected:not(:hidden)').eq(i).attr('questionid'),
                    optionid: $('.selected:not(:hidden)').eq(i).attr('optionid')
                });
            }
            submit();
        }
    });
}
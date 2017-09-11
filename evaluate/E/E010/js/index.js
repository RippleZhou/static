//判断是否在微信浏览器中
var nthpage = 1, User = window.User, Utils =window.Utils;
User.weichatAuth();
getquestion('E010');
var evaluteAnswers = [];
function getquestion(code) {
    Utils.ajax.get('/IbabyWebService/3/Evalute/GetQuestionList?code=' + code).then(function (rel) {
        var mainQuestions = rel;
        var html = template('qhtml', mainQuestions);
        document.querySelector('#questions').innerHTML = html;
    })
}
function nextquestion() {
    $('#introduce').hide();
    document.body.scrollTop = 0;
    if (nthpage == 2) {
        $('#next').hide();
        $('#btn').show();
    }
    if (nthpage != 3) {
        var eleml = '.type' + nthpage;
        $(eleml).hide();
    }
    nthpage++;
    var elem = '.type' + nthpage;
    $(elem).fadeIn(1000);
}
function submit() {
    if (!User.getUser()) {
        User.innerlogin("填写您的信息完成问卷", "填写您的昵称");
        return false;
    } else {
        var params = {
            evaluteAnswers: JSON.stringify(evaluteAnswers),
            patientid: User.getUser().patientid,
            code: 'E010'
        }
        Utils.ajax.post('/IbabyWebService/3/Evalute/CommitEvaluteAnswer', params).then(function (rel) {
            location.href = 'result.html';
        })
    }
}
function check(code) {
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
            if (code) {
                nextquestion();
            } else {
                submit();
            }
        }
    });
}
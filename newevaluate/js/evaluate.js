/**
 * Created by rvM on 2017/1/21.
 */
(function () {
    var Utils = window.Utils, User = window.User;
    Evalate = function () {
        this.desc = '评测系统';
    }
    Evalate.prototype.getlist = function () { //获取列表数据
        Utils.ajax.get('/IbabyWebService/neweva/list').then(function (rel) {
            var data = {};
            data.list = rel;
            var html = template('templist',data);
            document.getElementById('container').innerHTML = html;
        })
    }
    Evalate.prototype.getdetail = function () { //获取详情数据
        ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) != 'micromessenger') {
            document.write('请在微信中打开此页面，谢谢配合！');
            return
        } else {
            User.weichatAuth();
            var evaid = Utils.storage.get('befor_auth_params').evaid;
            Utils.ajax.get('/IbabyWebService/neweva/' + evaid).then(function (rel) {
                rel.content = JSON.parse(rel.content).questions;
                Evalate.prototype.detaildata = rel;
                var html = template('tempdetail', rel);
                document.getElementById('container').innerHTML = html;
                window.wechat.share({
                    title: rel.title,
                    desc: '爱丁邀您一起做测评',
                    link: location.href.split('?')[0]+'?evaid='+evaid
                })
            })
        }
    }
    Evalate.prototype.submit = function () { //提交评测结果
        var answers = Evalate.prototype.detaildata.content;
        var questions = $('.questions');
        var allscore = 0;
        var evaluteAnswers = [];
        for (var i= 0; i < answers.length; i++) { //评分
            var selected = questions.eq(i).find('input:checked');
            var correct = questions.eq(i).find('input.y');
            if (selected.length > 0) { //确认每一题都选了
                /*
                 * 判断得分
                 * 只有全部答对才能得分
                 * */
                var thescore = true;
                for (var j=0; j<correct.length;j++) { //确认每一个正确答案都被选择
                    if(selected.eq(j).is(correct.eq(j))) {
                    } else {
                        thescore =false
                    }
                    evaluteAnswers.push({
                        questionid: parseInt(selected.eq(j).attr('name')),
                        optionid: parseInt(selected.eq(j).attr('value'))
                    })
                }
                if (thescore == true) { //得分
                    allscore = allscore + Number(answers[i].score);
                }
            } else {
                $('.action').html('第'+'<font class="color-red">'+(i+1)+'</font>'+'题，还没有做哦~');
                setTimeout("$('.action').html('')",2000);
                return;
            }
        }
        var params = {
            openid: Utils.queryParams.openid||User.getUser().openid,
            evaid: Utils.storage.get('befor_auth_params').evaid,
            score: allscore,
            answer: JSON.stringify(evaluteAnswers)
        }
        Utils.ajax.post('/IbabyWebService/neweva/submitanswer/',params).then(function (rel) {
            rel.score = allscore;
            var html = template('tempresult',rel);
            $('body').append(html);
            $('.submit').attr('onclick',"a.togglemask()").val('查 看 分 数');
        },function (err) {
            console.log(err);
            var rel = {};
            rel.score = allscore;
            var html = template('tempresult',rel);
            $('body').append(html);
            $('.submit').attr('onclick',"a.togglemask()").val('查 看 分 数');
        })

    }
    Evalate.prototype.togglemask = function () { //控制成绩卡得显示
        $('.mask').toggleClass('hide');
    }
    Evalate.prototype.checkResult = function () { //查看正确答案
        Evalate.prototype.togglemask();
        $('.y-label').addClass('y-background');
        $('input[type=checkbox],input[type=radio]').attr('disabled','true');
    }
})();
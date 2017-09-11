var Utils = window.Utils, queryParams = Utils.queryParams, clock = window.clock, list_offset = 0, t = true, maindata = new Object();
//任务信息
var reflesh_time = setInterval('retimeout()', 1000); //倒计时
User.weichatAuth();
var urlparams = Utils.storage.get('befor_auth_params');
if (!User.getUser()) {
    User.innerlogin();
} else {
    loginSuccessThenDo();
}

//get  task infor
function loginSuccessThenDo() {
    try {
        $.get('/IbabyWebService/camp/task/detail?campid=' + urlparams.campid + '&taskid=' + urlparams.taskid + '&patientid=' + User.getUser().patientid, function (rel) {
            if (rel.status == 1) {
                document.write('您没有权限查看该任务，请确认您加入了该营');
            } else {
                timeout(rel.content);
                getrole();
                gettalklist(5);
            }
        })
    } catch (err) {
    }
}

//获取用户role
function getrole() {
    Utils.ajax.get('/IbabyWebService/camp/member/detail?patientid=' + User.getUser().patientid + '&campid=' + urlparams.campid).then(function (rel) {
        maindata.role = rel.type;
    })
    //判断当前是否可以打卡,能否评论
    $('.foot').append('<img src="img/cream.svg" alt=""><span>上传图证打卡</span>');
    $('body').append('<div class="bottom-anwer flex"> <input type="text" class="flex-1"> <span id="submit"  class="pointer">发送</span> </div>');
}

//下拉刷新
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).height() - $(this).scrollTop() - $(this).height() <= 0) {
            if (t == true) {
                gettalklist(5);
            }
        }
    });
});

//任务信息
function timeout(rel) {
    maindata = rel;
    try{
        maindata.campid = urlparams.campid;
        maindata.taskid = urlparams.taskid;
    } catch (err) {

    }
    clock.setstorage('taskinfor',maindata);
    try {
        var endtime = new Date(maindata.endtime.replace(/-/g, '/'));
        var nowtime = new Date();
        var endTime = (Date.parse(endtime)) / 1000;
        var nowTime = (Date.parse(nowtime)) / 1000;
        var lasttime = endTime - nowTime;
        if (lasttime > 0) {
            maindata.time_s = lasttime % 60;
            maindata.time_min = (lasttime - maindata.time_s) / 60 % 60;
            maindata.time_hour = ((lasttime - maindata.time_s) / 60 - maindata.time_min) / 60 % 24;
            maindata.time_day = (((lasttime - maindata.time_s) / 60 - maindata.time_min) / 60 - maindata.time_hour) / 24;
        }
    } catch (err) {

    }
    var html = template('temp1', rel);
    $('.missions').append(html);
    if (lasttime > 0) {
        reflesh_time;
    } else {
        $('#timeout').html('已经结束');
    }
}

//倒计时
function retimeout() {
    try {
        var t = maindata;
        if (t.time_s > 0) {
            t.time_s--
            $('#timeout>font:nth-last-of-type(1)').html(t.time_s + '秒');
        } else if (t.time_min > 0) {
            t.time_min--;
            t.time_s = 59;
            $('#timeout>font:nth-last-of-type(1)').html(t.time_s + '秒');
            $('#timeout>font:nth-last-of-type(2)').html(t.time_min + '分钟');
        } else if (t.time_hour > 0) {
            t.time_hour--;
            t.time_s = 59;
            t.time_min = 59;
            $('#timeout>font:nth-last-of-type(1)').html(t.time_s + '秒');
            $('#timeout>font:nth-last-of-type(2)').html(t.time_min + '分钟');
            $('#timeout>font:nth-last-of-type(3)').html(t.time_hour + '小时');
        } else if (t.time_day > 0) {
            t.time_day--;
            t.time_s = 59;
            t.time_min = 59;
            t.time_hour = 59;
            $('#timeout>font:nth-last-of-type(1)').html(t.time_s + '秒');
            $('#timeout>font:nth-last-of-type(2)').html(t.time_min + '分钟');
            $('#timeout>font:nth-last-of-type(3)').html(t.time_hour + '小时');
            $('#timeout>font:nth-last-of-type(4)').html(t.time_day + '天');
        } else {
            $('#timeout').html('已经结束');
            clearInterval(reflesh_time);
        }
        if (t.time_day == 0) {
            $('#timeout>font:nth-last-of-type(4)').remove();
            if (t.time_hour == 0) {
                $('#timeout>font:nth-last-of-type(3)').remove();
                if (t.time_min == 0) {
                    $('#timeout>font:nth-last-of-type(2)').remove();
                    if (t.time_s == 0) {
                        $('#timeout').html('已经结束');
                        clearInterval(reflesh_time);
                    }
                }
            }
        }
    } catch (err) {
        $('#timeout').html('已经结束');
        clearInterval(reflesh_time);
    }
}



//任务评论列表
function gettalklist(limit) {
    var patientid = User.getUser().patientid;
    if (t) {
        Utils.ajax.get('/IbabyWebService/camp/taskcommentlist?taskid=' + urlparams.taskid + '&patientid=' + patientid +
            '&campid=' + urlparams.campid + '&offset=' + list_offset + '&limit=' + limit + '&firstPageSize=2').then(function (rel) {
            var html = template('temp2', rel);
            $('#content>.comments').append(html);
            if (rel.total > list_offset + limit) {
                t = true;
                list_offset = list_offset + limit;
            } else {
                t = false;
                if ($('.action-text').length == 0) {
                    $('.detail').append('<p class="action-text">评论有限，到底了~</p>');
                }
            }
        })
    }
}

//点赞
$('#content').delegate('.good', 'click', function () {
    var patientid = User.getUser().patientid;
    if ($(this).hasClass('once')) {
        var img = $(this).find('img'), font = $(this).find('font');
        $(this).removeClass('once');
        img.attr('src', 'img/good-a.svg');
        $.get('/IbabyWebService/camp/favourcomment?patientid=' + patientid + '&commentid=' + img.attr('cid'));
        font.css('color', '#5ABCF1');
        font.html(Number(font.html()) + 1);
    }
})

//打卡发布
$('#content').delegate('.foot', 'click', function () {
    try {
        if (maindata.finished == 0) {
            aid.tip.show('您已经打过卡，或者任务已经结束');
        } else {
            location.href = 'submit.html';
        }
    } catch (err) {
        location.href = 'submit.html';
    }

})

//图片预览
$('#content').delegate('.imgs>img', 'click', function () {
    clock.imgEnlarge($(this));
})

//调出回复框&&对打卡进行评论
$('#content').delegate('span.write', 'click', function () {
    if (maindata.role != 0) {
        $('.bottom-anwer').css('z-index', '1');
        $('.comment').removeClass('totalk');
        $(this).parents('.comment').addClass('totalk');
        return false;
    } else {
        aid.tip.show('目前回复功能只对教练和管理人员开放')
    }
})
//评论
$('body').delegate('#submit','touchend',function () {
    var patientid = User.getUser().patientid;
    var todata = $('.totalk').attr('maindata');
    todata = todata.split('|');
    if ($('.bottom-anwer input').val().length > 0) {
        var params = {
            touserid: todata[0],
            torole: todata[1],
            parentcommentid: todata[2],
            patientid: patientid,
            campid: urlparams.campid,
            taskid: maindata.taskid,
            userid: patientid,
            role: 1,
            content: $('.bottom-anwer input').val()
        }
        Utils.ajax.post('/IbabyWebService/camp/comment/submit', params).then(function (rel) {
            var tdemo = '<p><span class="bont">' + User.getUser().wechatname + '：</span><span>' + $('.bottom-anwer input').val() + '</span></p>'
            if ($('.totalk').find('.comment-title').length > 0) {
                $('.totalk').find('.comment-title').append(tdemo);
            } else {
                var lastdemo = '<div class="flex flex-vertical comment-title">' + tdemo + '</div>';
                $('.totalk').append(lastdemo);
            }
            $('.bottom-anwer input').val('');
        });
        $('.bottom-anwer').css('z-index', '-1');
    } else {
        aid.tip.show('请输入您所想说的话');
    }
})
$('#content').click(function () {
    $('.bottom-anwer').css('z-index', '-1');
})

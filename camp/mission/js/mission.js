var Utils = window.Utils,
    User = window.User,
    ua = window.navigator.userAgent.toLowerCase(),
    queryParams = Utils.queryParams,
    t = true,
    list_offset = 0;

//微信授权，用户登录
User.weichatAuth();
if (!User.getUser()) {
    User.innerlogin();
} else {
    loginSuccessThenDo();
}

//get userinfor
//2、获取用户加入的营列表
function loginSuccessThenDo() {
    var patientid = User.getUser().patientid;
    //1、获取用户头像和名称
    Utils.ajax.get('/IbabyWebService/camp/memberjoinedcamps?patientid=' + patientid).then(function (rel2) {
        var val = new Object();
        val.rel2 = rel2;
        val.camp_selected = Utils.storage.get("mission_last_camp_selected")|0;
        var html3 = template('temp2', val);
        var html = template('tempf', val);
        $('body').append(html);
        Utils.ajax.get('/IbabyWebService/camp/member/detail?patientid=' + patientid + '&campid='+rel2[val.camp_selected].campid ).then(function (rel) {
            if (rel==null) {
                document.write('<h4>你当前没有加入任何营，请加入营后，再来查看任务</h4>');
            } else {
                var html = template('temp1', rel);
                $('#per-infor').append(html);
                $('#per-infor').append(html3);
                var html = template('temp3', rel);
                $('#camplist').append(html);
            }
            getlist(rel2[val.camp_selected].campid);
        })
    })
}

//获取营积分和任务列表
var getlist = function (campid) {
    var patientid = User.getUser().patientid;
    getrwlist(5, campid);
}

//切换营
$('body').delegate('#fixedselect>p', 'touchend', function () {
    if (!$(this).hasClass('active')) {
        $('#fixedselect>p').removeClass('active');
        $(this).addClass('active');
        Utils.storage.set('mission_last_camp_selected',$(this).index("#fixedselect>p"))
        $('#camplist>span').eq(0).attr('id', $(this).attr('sid'));
        $('#camplist>span').eq(0).html($(this).html());
        $('#fixedselectbox').addClass('none');
        relist($('#camplist>span').eq(0).attr('id'));
        return false;
    } else {
        $('#fixedselectbox').addClass('none');
        return false;
    }
    return false;
})
$('body').delegate('#fixedselectbox', 'touchend', function () {
    $('#fixedselectbox').addClass('none')
    return false;
})

//加载更多
$(document).ready(function () {
    $(window).scroll(function () {
        if ($(document).height() - $(this).scrollTop() - $(this).height() <= 0) {
            if (t == true) {
                getrwlist(5, $('#camplist>span:first-of-type').attr('id'));
            }
        }
    });
});
//获取任务列表
function getrwlist(limit, campid) {
    if (t = true) {
        Utils.ajax.get('/IbabyWebService/camp/tasklist?patientid=' + User.getUser().patientid + '&campid=' + campid + '&offset=' + list_offset + '&limit=' + limit).then(function (rel3) {
            rel3.list.role = $('#headimg').attr('type');
            for (var i = 0; i < rel3.list.length; i++) {
                var endtime = new Date(rel3.list[i].endtime.replace(/-/g,'/'));
                var nowtime = new Date();
                var endTime = (Date.parse(endtime)) / 1000;
                var nowTime = (Date.parse(nowtime)) / 1000;
                if (endTime < nowTime) {
                    rel3.list[i].ended = 'true';
                }
            }
            var html = template('temp4', rel3);
            $('#content').append(html);
            if (rel3.total > list_offset + limit) {
                t = true;
                list_offset = list_offset + limit;
            } else {
                t = false;
                if ($('.action-text').length == 0) {
                    $('body').append('<p class="action-text">任务有限，到底了~</p>');
                }
            }
        })
    }
}
//refresh list
var relist = function (campid) {
    list_offset = 0;
    $('.missions').remove();
    $('.action-text').remove();
    var patientid = User.getUser().patientid;
    //根据营号获取用户积分
    Utils.ajax.get('/IbabyWebService/camp/member/detail?patientid=' + patientid + '&campid='+campid  ).then(function (rel) {
        if (rel==null) {
            document.write('<h4>你当前没有加入任何营，请加入营后，再来查看任务</h4>');
        } else {
            $("#headimg").attr('type',rel.type);
            $('#camplist b').html(rel.score);
        }
        getrwlist(5, campid);
    })
}


//打卡任务，跳转页面
$('#content').delegate('.btnB', 'click', function () {
    var pe = $(this).parents('.missions');
    location.href = 'missiondetail.html?campid='+$('#camplist>span').eq(0).attr('id')+'&taskid='+pe.attr('id');
})

//阅读任务，打卡
$('#content').delegate('.btnA', 'click', function () {
    if ($(this).hasClass('disable') || $(this).find('p').eq(0).html() == '已完成') {
        location.href = $(this).attr('href');
    } else {
        try {
            var pe = $(this).parents('.missions');
            var params = {
                role: $('#per-infor #headimg').attr('type'),
                campid: $('#camplist>span').eq(0).attr('id'),
                taskid: pe.attr('id'),
                patientid: User.getUser().patientid,
                userid: User.getUser().patientid
            }
            Utils.ajax.post('/IbabyWebService/camp/comment/submit', params).then(function (rel) {
                location.href = $(this).attr('href');
            })
        } catch (err) {
            location.href = $(this).attr('href');
        }
    }
})

//点击发布任务，更改分享描述
function btnA(name, stime, etime, type, taskid, url) {
    var campid = $('#camplist>span').eq(0).attr('id');
    if (type == 1) {
        var desc = '时间：' + stime + '~' + etime + '参与人：所有学员   任务形式：上传图证';
        var link = 'http://ibaby-plan.org/static/camp/mission/missiondetail.html?campid='+campid+'&taskid='+taskid;
    } else if (type == 2) {
        var desc = '时间：' + stime + '~' + etime + '参与人：所有学员   任务形式：阅读';
        var link = 'http://ibaby-plan.org/static/camp/mission/transfer_to_read.html?campid='+campid+'&taskid='+taskid+'&url='+url;
    }
    window.wechat.share({
        title: '任务：' + name,
        desc: desc,
        link: link
    })
    aid.tip.show('成功发布任务，点击右上角"分享到微信群"');
}

//照片查看
$('#content').delegate('.imgs>img', 'click', function () {
    clock.imgEnlarge($(this));
})
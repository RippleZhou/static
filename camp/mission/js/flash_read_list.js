var User = window.User, Utils = window.Utils, ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != 'micromessenger') { //发布任务，需要使用微信分享
    document.write('请在微信中打开此页面，谢谢配合！')
} else {
    User.weichatAuth();
    if (!User.getUser() || !User.getUser().openid) {
        User.innerlogin();
    } else {
        loginSuccessThenDo();
    }
}

function loginSuccessThenDo() {
    //获取任务列表
    Utils.ajax.get("/IbabyWebService/camp/flashread/list").then(function (rel) {
        for (var i = 0; i < rel.list.length; i++) {
            var thislist = rel.list[i];
            var endtime = new Date(thislist.endtime.replace(/-/g, '/'));
            var nowtime = new Date();
            var endTime = (Date.parse(endtime)) / 1000;
            var nowTime = (Date.parse(nowtime)) / 1000;
            var lasttime = endTime - nowTime;
            if ( lasttime > 0 ) {
                thislist.time_s = lasttime % 60;
                thislist.time_min = (lasttime - thislist.time_s) / 60 % 60;
                thislist.time_hour = ((lasttime - thislist.time_s) / 60 - thislist.time_min) / 60 % 24;
                thislist.time_day = (((lasttime - thislist.time_s) / 60 - thislist.time_min) / 60 - thislist.time_hour) / 24;
            } else {
                thislist.timeover = 0;
            }
        }
        var html = template('tasklist',rel);
        $('body').append(html);
    },function (rel) {
        document.write(rel);
    })
}

function  share(ele) {
    $('.bottom button').removeClass('selected');
    ele.className = 'selected';
    var selected_task =  $('button.selected').parents('.task');
    window.wechat.share({
        title: selected_task.find('.title').html(),
        desc: selected_task.find('.desc').html(),
        link: location.origin + selected_task.find('.taskurl').attr('href'),
        imgUrl: selected_task.attr('shareimg')
    })
    aid.tip.show('点击微信右上角分享按钮，发布任务');
    return false;
}
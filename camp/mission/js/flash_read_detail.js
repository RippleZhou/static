var User = window.User, Utils = window.Utils;
User.weichatAuth();
var urlparams = Utils.storage.get('befor_auth_params');
if (!User.getUser()) {
    User.innerlogin();
} else {
    loginSuccessThenDo();
}
function loginSuccessThenDo() {
    var patientid = User.getUser().patientid;
    var taskid = urlparams.taskid;
    //获取任务信息，并展示给用户看
    var geturl1 = "/IbabyWebService/camp/flashread/"+taskid+'/'+patientid;
    var geturl2 = "/IbabyWebService/camp/flashread/read/"+taskid+'/'+patientid;
    Utils.ajax.get(geturl1).then(function (rel) {
        var thislist = rel;
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
            var data = new Object();
            data.err = '任务超时，无法查看';
            var html = template('errtemp',data);
            $('body').html(html);
            $('.full-content p').html(err);

        }
        if (rel.type == 1) {
            var html = template('main',rel);
        } else if (rel.type == 2) {
            var html = template('mainv',rel);
        }
        var $body = $('body');
        $body.append(html);

        document.title = rel.title;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico"></iframe>');
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);

        setTimeout(function () {  //用户阅读次数+1
            $.get(geturl2,function (rel) {
                console.log(rel)
            })
        },3000)
        window.wechat.share({
            title: rel.title,
            desc: rel.description,
            link: location.href.split('?')[0]+"?taskid="+rel.id,
            imgUrl: rel.thumbnail
        })
    },function (err) {
        var data = new Object();
        data.err = err;
        var html = template('errtemp',data);
        $('body').html(html);
        $('.full-content p').html(err);
    })
}
function removeaction(ele) {
    document.body.removeChild(ele.parentNode.parentNode);
}
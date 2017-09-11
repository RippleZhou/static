var User = window.User, Utils = window.Utils,queryParams = Utils.queryParams, ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != 'micromessenger') {
    document.write('请在微信中打开此页面，谢谢配合！')
} else {
    User.weichatAuth();
    var campid = Utils.storage.get('befor_auth_params').campid;
    Utils.ajax.get('/IbabyWebService/camp/detail?campid=' + campid).then(function (rel) {
        document.title = rel.name;
        var html = template('content-list', rel);
        $('.only_box_1').append(html);
        window.wechat.share({
            title: document.title + '登记',
            desc: $('#infor #text').html().split('</b>')[1],
            link: location.href.split('?')[0] + '?campid=' + campid
        })
    })
    Utils.ajax.get('/IbabyWebService/camp/recentjoin').then(function (rel) {
        var html = template('user_history', rel);
        $('.only_box_2').append(html);
    })

}
function booked(campid) {
    if (!User.getUser() || !User.getUser().openid) {
        User.innerlogin();
    } else {
        loginSuccessThenDo();
    }
}
function showall() {
    $('#infor #text').addClass('auto');
}
function loginSuccessThenDo() {
    Utils.ajax.get('/IbabyWebService/camp/join?campid=' + campid + '&patientid=' + User.getUser().patientid).then(function (rel) {
        $('button#booked>p:first-of-type').html('成功');
        Utils.ajax.get('/IbabyWebService/camp/recentjoin').then(function (rel) {
            var html = template('user_history', rel);
            $('.only_box_2').html(html);
        })
    })
}
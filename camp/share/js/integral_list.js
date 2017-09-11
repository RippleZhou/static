var Utils = window.Utils, User = window.User, ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != 'micromessenger') {
    document.body.innerHTML = '请在微信中打开此页面，谢谢配合！';
} else {
    if (!User.getUser()) {
        User.innerlogin();
    } else {
        loginSuccessThenDo();
    }
}
function  loginSuccessThenDo() {
    var infor = User.getUser();
    var html = template('self',infor);
    $('.myinfo').html(html);
    //个人积分
    $.get('/IbabyWebService/DServiceCooper/getPatientPromoteScore?patientid='+infor.patientid,function (rel) {
        var html_score = template('score',rel);
        $('#scorenth>span:first-of-type').html(html_score);
    })
    //积分排行
    var get_url = '/IbabyWebService/DServiceCooper/getPatientPromoteScoreRank?patientid='+infor.patientid;
    Utils.ajax.get(get_url).then(function (list) {
        var html = template('list',list);
        $('#chart').append(html);
        var html_rank = template('rank',list);
        $('#scorenth>span:last-of-type').html(html_rank);
    },function (err) {
        $('#chart').append('<p style="font-size: 0.11rem">'+err+'</p>')
    })
}
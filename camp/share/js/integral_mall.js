var wechat = window.wechat, http = window.HTTP, user = window.User, utils = window.Utils, ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != 'micromessenger') {
    document.body.innerHTML = '请在微信中打开此页面，谢谢配合！';
} else {
    user.weichatAuth();
    if (!user.getUser()) {
        user.innerlogin()
    } else {
        loginSuccessThenDo();
    }

    function loginSuccessThenDo() {
        //获取用户积分和基本信息
        var infor = user.getUser();
        var html = template('infor',infor);
        $('.infor').append(html);
        $.get('/IbabyWebService/DServiceCooper/getPatientPromoteScore?patientid='+infor.patientid,function (rel) {
            var html = template('pnum',rel);
            $('.infor').append(html);
        })
    }
//积分兑换商品列表
    http.get('/static/json/integral_system/integral_mall.json',function (urldata) {
        var html = template('goods', urldata);
        document.querySelector('.list').innerHTML = html;
    })
    wechat.share({
        desc: '爱丁优生助孕健康传播大使积分兑换'
    });
}
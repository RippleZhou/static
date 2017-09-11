var Pay = window.Pay,
    wechat = window.wechat;
var serviceid = Utils.getQueryParams().serviceid;

var goToWeShop = false; //是否前往微店
if(serviceid == 10||serviceid == 4) { //使用美恰客服
    wechat.share({
        title: '爱丁多囊生活管理',
        desc: '爱丁多囊生活管理报名入口'
    });
    $('#gotobuy').html('立即报名');
}
//get service information 获取商品信息
var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;
Utils.ajax.get(url).then(function (infodata) {
    var $body = $('body');
    document.title = infodata.name;
    // hack在微信等webview中无法修改document.title的情况
    var $iframe = $('<iframe src="/favicon.ico"></iframe>');
    $iframe.on('load',function() {
        setTimeout(function() {
            $iframe.off('load').remove();
        }, 0);
    }).appendTo($body);

    //多囊减脂营，移除商品价格信息
    if (infodata.name != '多囊减脂备孕营') {
        var html = template('infodata', infodata);
        $('#infor').append(html);
    } else {
        $('#infor').remove();
    }

    var formhtml = template('form_info', infodata);
    $('header>span').html(infodata.name);
    document.getElementById('bannerimg').src = infodata.pic;
    $('#forminfo').append(formhtml);

    
    //是否展示咨询按钮
    if (infodata.showconsult != 1){
        $('#link-advice').remove();
    }
})
//get comments list 获取评价列表
var url = '/IbabyWebService/DServiceCooper/ServiceComments?serviceid=' + serviceid;
Utils.ajax.get(url).then(function (rel) {
    var pldata = rel;
    var html = template('pldata', pldata);
    $('#comment').append(html);
    $('#link #ask').html('评论（'+rel.total+'）');
})
try { //判断是否有form表单缓存
    var form = Utils.storage.get('formlist');
    $('#name').val(form.uname);
    $('#phone').val(form.uphone);
    $('#wxphone').val(form.wxphone);
} catch (err) {
}
var toggle = { //控制form出现与否
    form: function () {
        if (goToWeShop == true) { //是否前往微店支付
            location.href = 'https://weidian.com/cart/order/wxpay.php?weipay_id=2107117&sign=05cec76ae6d7b1710a5c5bb3631e3d5d&wfr=wx'
        } else  {
            $('#form').slideToggle(500);
            $('#fullForm').fadeToggle(500);
        }
    }
}
console.log( User.getUser());
// 跳转提单页面
function toorder() {
    //记录用户填写的资料
    var uname = $('#name').val();
    var uphone = $('#phone').val();
    var wxphone=$('#wxphone').val();
    var formlist = {
        uname: uname,
        uphone: uphone,
        wxphone:wxphone
    }
    Utils.storage.set('formlist', formlist); //缓存form内容
    if (!input_check.name(uname) || !input_check.phone(uphone)||wxphone=="") {
        return false;
    }
    var patient = User.getUser();
    if (patient == null || patient == 'undefined') {
        User.redirectToLoginPage(location.href); //登陆
    }else {
        var orderparams = new Object();
        /*
         * returnurl,为支付成功后跳转的页面
         * imgsrc为展示图链接
         * business 表示订单源
         * */
        orderparams = {
            patientid: User.getUser().patientid,
            name: uname,
            mobile: uphone,
            wxphone:wxphone,
            serviceid: Utils.queryParams.serviceid,
            servicename: $('header>span').html(),
            returnurl: location.href,
            imgsrc: $('#bannerimg').attr('src'),
            business: 'market'
        };
        //带参前往订单页面
        location.href = "/static/common/pay/order.html?serviceid="+orderparams.serviceid+"&servicename="+
            orderparams.servicename+'&name='+orderparams.name+"&mobile="+orderparams.mobile+"&wxphone="+orderparams.wxphone+'&totalfee='+
            $('#orderprice').html()+'&patientid='+orderparams.patientid+'&imgsrc='+orderparams.imgsrc+
            '&business='+orderparams.business+'&returnurl='+orderparams.returnurl;
    }
}

//查看我的订单
function myorderlist() {
    var patient = User.getUser();
    if (patient == null || patient == 'undefined') {
        diyalert('请登陆~', 1000);
        User.redirectToLoginPage(location.href);
    } else {
        location.href = 'order.html';
    }
}

$('#link dd').click(function () {
    var i = $(this).index('#link dd');
    if (i == 0) {
        $('#link dd').eq(0).addClass('active');
        $('#link dd').eq(1).removeClass('active');
        $('#comment').fadeOut();
        $('#comment-a').fadeIn();
    } else {
        $('#link dd').eq(1).addClass('active');
        $('#link dd').eq(0).removeClass('active');
        $('#comment-a').fadeOut();
        $('#comment').fadeIn();
    }
})
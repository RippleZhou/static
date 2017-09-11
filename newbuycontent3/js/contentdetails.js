/**
 * Created by Administrator on 2017/5/31 0031.
 */
var Utils = window.Utils;
var  logisticstatus;

var tool=function(){

    var Pay = window.Pay;
    var serviceid = Utils.getQueryParams().serviceid;
    var Services = window.Services = {};

//get service information 获取商品信息
    var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;

    Utils.ajax.get(url).then(function (infodata) {

        var $form_info = $('#form-info');
        logisticstatus=infodata.logisticstatus;

        //动态改变title的信息
        var $body = $('body');
        document.title =infodata.name;
        var $iframe = $('<iframe src="/favicon.ico"></iframe>');//空的
        $iframe.on('load',function() {
            setTimeout(function() {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);

        var html = template('contentform', infodata);
        $form_info.append(html);

        var formhtml = template('form_info', infodata);
        $('#forminfo').append(formhtml);

        //跳转首页
        // var paramsall = Utils.storage.get('paramsinit');
        $('.adiv').click(function(){
            // var goodsNo=paramsall.goodsNo;
            // location.href="content-frist.html?id="+1+"&goodsNo="+goodsNo;
            location.href="content-frist.html";
        })

        //是否展示咨询按钮
        if (infodata.showconsult != 1){
            $('#link-advice').remove();
        }
        //购买数量
        var i=1;
        var Unit= $('.totalprice').html();
        $('.add').click(function(){
            i++;
            // if(i>1){
            //     var sum=Unit*i* infodata.discount;
            // }else{
                var sum=Unit*i;
            // }

            $('.totalprice').html(sum.toFixed(2));
            $('.picre').html(i);
        })

        $('.reduce').click(function(){
            i--;
            if(i<=1){
                i=1
                var sum=Unit*i;
            }else{
                console.log(infodata.discount)
                var sum=Unit*i* infodata.discount;
            }

            $('.totalprice').html(sum.toFixed(2));
            $('.picre').html(i);
        })

    })

}

var paramsall = Utils.storage.get('paramsinit');
console.log(paramsall);
if(paramsall!==null&&paramsall.patientid!==null){
    tool()
}else{
    var Utils = window.Utils;
    var newWechat = window.NewWechat;
    newWechat.author();
    var params = Utils.queryParams;
    // var goodsNo = Utils.getQueryParams().goodsNo;//获取url地址的参数goodsNo的值
    var urls='/IbabyWebService/3/Patient/getPatientInfoByOpenId/'+params.openid
    Utils.ajax.get(urls).then(function (rel) {
        var patientid = rel;
        console.log(patientid)
        var  paramsform={
            openid:params.openid,
            nickname:params.nickname,
            headimgurl:params.headimgurl,
            patientid:patientid,
            goodsNo:'4026bc7d29fbe5204a25ae87afbd661d',
        }
        Utils.storage.set('paramsinit', paramsform);
        tool()
    })

}

var count=Utils.storage.get('count'); ///计算商品数量
if(count){
    var coun=count;
    document.querySelector('.iclass').innerHTML=coun;
}else{
    var coun=0;
    document.querySelector('.iclass').innerHTML=coun;
}

//加入购物车
$('.gocar').click(function(){
    var patientid=paramsall.patientid;
    var serviceid = Utils.getQueryParams().serviceid;
    var urla="/IbabyWebService/DServiceCooper/addServiceByCrat?patientid="+patientid+"&serviceid="+serviceid+"&count="+1
    Utils.ajax.get(urla).then(function (rel) {
        diyalert('已加入购物车', 1000);
        coun++;
        document.querySelector('.iclass').innerHTML=coun;
        Utils.storage.set('count', coun); ///计算商品数量
    })

})

var goToWeShop = false; //是否前往微店
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

// 跳转提单页面
function toorder() {
    //记录用户填写的资料
    var uname = $('#name').val();
    var uphone = $('#phone').val();
    var wxphone = $('#wxphone').val();
    var formlist = {
        uname: uname,
        uphone: uphone,
        wxphone: wxphone
    }
    Utils.storage.set('formlist', formlist); //缓存form内容
    if (uname=="" && uphone=="" && wxphone == "") {
        aid.alert.show('提示：请填写个人信息~');
    }else if(uname==""){
        aid.alert.show('提示：请填写姓名~');
    }else if(uphone==""){
        aid.alert.show('提示：请填写手机号码~');
    }else if(wxphone == ""){
        aid.alert.show('提示：请填写微信号~');
    }
    var paramsall = Utils.storage.get('paramsinit');

        var orderparams = new Object();
        orderparams = {
            patientid: paramsall.patientid,
            name: uname,
            mobile: uphone,
            wxphone: wxphone,
            serviceid: Utils.queryParams.serviceid,
            servicename: $('.commodity p').html(),
            returnurl: location.href,
            imgsrc: $('#bannerimg').attr('src'),
            business: 'market',
            ordercount:$('.picre').html(),
            logisticstatus:logisticstatus,
            price:$("#priceid").html(),
            count:$('.picre').html()
        };
        location.href = "/static/newbuycontent/pay/order.html?serviceid=" + orderparams.serviceid + "&servicename=" +
            orderparams.servicename+"&price="+orderparams.price +"&count="+"x"+orderparams.count+ '&name=' + orderparams.name + "&mobile=" + orderparams.mobile + "&wxphone=" + orderparams.wxphone + '&totalfee=' +
            $('.totalprice').html() + '&patientid=' + orderparams.patientid + '&imgsrc=' + orderparams.imgsrc +
            '&business=' + orderparams.business + '&returnurl=' + orderparams.returnurl+'&ordercount='+orderparams.ordercount+"&logisticstatus="+orderparams.logisticstatus;

}


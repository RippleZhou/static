var Pay = window.Pay = {};
Pay.paymethod = {}, Pay.wechat = {}, Pay.wechat.onePrePay = true;
/**
 * 微信支付
 **/
Pay.paymethod.wechat = function (orderid) {


    var pramas = {
        orderid: orderid,
        payMethod: 'wxpay'
    }

    if (Pay.wechat.onePrePay) { //预支付，判断是否是第一次调取预支付
        Utils.ajax.post('/IbabyWebService/Pay/PrePay', pramas).then(function (rel) {
            wxparams = $.parseJSON(rel);
            Pay.wechat.onePrePay = false;

            payed();
        })
    } else {
        payed();
    }

    //支付结果回调函数
    function onBridgeReady() {
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            wxparams,
            function (res) {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // location.replace('/static/newbuycontent/pay/success.html?serviceid='+Utils.queryParams.serviceid)
                    location.replace('/static/newbuycontent/myorder.html')
                } else {
                    diyalert('支付失败', 1000);
                }
            }
        );
    }
    //支付
    function payed() {

        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
            }
        } else {
            onBridgeReady();
        }
    }
}
/**
 * 线下支付（服务大厅），这里的orderid不需要带business
 * **/
Pay.paymethod.offline = function (orderid,message,retrunurl) {
    var orderid = orderid.split('_')[0];
    var geturl = '/IbabyWebService/servicemall/chooseofflinepay?orderid='+orderid;
    $.get(geturl,function (rel) {
        var resulturl = '/static/newbuycontent/pay/offline-result.html?message='+message+'&retrunurl='+retrunurl;
        location.replace(resulturl);
    })
}
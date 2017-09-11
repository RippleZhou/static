/**
 * Created by rvM on 2017/1/13.
 */
var queryparams =Utils.getQueryParams();
var Pay = window.Pay;
var html = template('list',  Utils.queryParams);
$('ul').append(html);


//支付
function prepay() {
    var payway = $('ul.paytype>li.active').attr('id');
    if (payway == 'wechatpay') { //微信支付
        Pay.paymethod.wechat(queryparams.orderid);
    } else if (payway == 'offline') { //线下支付
        Pay.paymethod.offline(queryparams.orderid, queryparams.message, queryparams.returnurl)
    }
}

//切换支付方式
$('ul.paytype>li').click(function () {
    $('ul.paytype>li').removeClass('active');
    $(this).addClass('active');
})

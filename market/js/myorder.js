/**
 * Created by rvM on 2017/1/10.
 */
form = function (serviceid) {
    $('#form').slideToggle(500);
    window.serviceid = serviceid;
}

//提交评论
function submit() {
    if (!input_check.null($('#text').val())) {
        return false;
    }
    var serviceid = window.serviceid;
    var content = $('#text').val();
    var params = {
        patientid: user.patientid,
        serviceid: serviceid,
        content: content
    }
    var url = '/IbabyWebService/DServiceCooper/SubmitComment';
    Utils.ajax.post(url, params).then(function (rel) {
        $('#form').slideToggle(500);
        diyalert('提交评论成功', 1000);
    })
}

//订单列表
var user = User.getUser();
var patientid = user.patientid;
var url = '/IbabyWebService/DServiceCooper/MyOrderList?patientid=' + patientid;
Utils.ajax.get(url).then(function (rel) {
    var orderdata = rel;
    var html = template('orderdata', orderdata);
    $('body').append(html);
    if (rel.total == '0') {
        $('.nototle').css('display', 'block');
    }
})
/*
 * 已有订单进行支付处理
 * 产品名称servicename,费用totalfee，订单号orderid，imgsrc展示图
 * */
function pay(name, price, id, img, serviceid) {
    var orderid = id + '_rebate';
    location.href = '/static/common/pay/pay.html?totalfee='+price+'&orderid='+orderid+'&serviceid='+serviceid+'&returnurl='+location.href;
}

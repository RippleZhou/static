/**
 * Created by rvM on 2017/1/13.
 */
// 展示商品信息
var Utils = window.Utils;
var addressall = Utils.storage.get('addressall');//地址缓存

//购物车页面进入订单页
if(Utils.queryParams.servicenameother){
    Utils.queryParams.anothername=Utils.queryParams.servicenameother;
    Utils.queryParams.servicenameother = Utils.queryParams.servicenameother.split(",");
    Utils.queryParams.cartIds=Utils.queryParams.cartIds.split(",");

    var coun=Utils.queryParams.servicenameother.length/4;
    var better=[];

    for(var i=0;i<coun;i++){
        var values=Utils.queryParams.servicenameother.splice(0,4);
        var list=["servicename","imgsrc","count","price"];
        var result={};

        for(var j=0;j<list.length;j++) {
            if (values) {
                result[list[j]] = values[j];
            }
        }

        better.push(result);
    }

    Utils.queryParams.servicenameother=better;
}


if(addressall){
    //地址缓存存在
    console.log(addressall)
    addressall.nameadd=Utils.queryParams.name;
    addressall.phoneadd=Utils.queryParams.mobile;
    var html = template('listA',  addressall);
    $('ul').append(html);
}else{
    //地址缓存不存在
    var html = template('listA',  Utils.queryParams);
    $('ul').append(html);
}

var html = template('list',  Utils.queryParams);
console.log(Utils.queryParams)
$('ul').append(html);

/*
* 生成订单
* 对不同来源需要分别处理
* */
var logisticstatus=Utils.queryParams.logisticstatus;

if(logisticstatus==1){
    $('.address').hide();
}else if(logisticstatus==2){
    $('.address').show();
}

function pay() {
    if(logisticstatus==1){
        order();
    }else if(logisticstatus==2){
        if (addressall) {
            var content =addressall.address ;
            console.log(content)
            order(content);
        }else{
            aid.alert.show('提示：请添加收货地址~');
        }
    }else{
        console.log(1)
    }
}

function adds() {
    var queryparams = Utils.queryParams;
    if (queryparams.servicenameother) {
        location.replace( "/static/newbuycontent/pay/add.html?patientid=" + queryparams.patientid + "&servicenameother=" +
            queryparams.anothername+ '&name=' + queryparams.name + "&mobile=" + queryparams.mobile + "&wxphone=" + queryparams.wxphone + '&totalfee=' +
            queryparams.totalfee + '&patientid=' + queryparams.patientid  +
        '&business=' + queryparams.business + '&returnurl=' + queryparams.returnurl+"&logisticstatus="+queryparams.logisticstatus+"&cartIds="+queryparams.cartIds);

    }else{
        location.replace( "/static/newbuycontent/pay/add.html?serviceid=" + queryparams.serviceid + "&servicename=" + queryparams.servicename +"&price="+queryparams.price+"&count="+queryparams.count+ "&name=" + queryparams.name + "&mobile=" + queryparams.mobile + "&wxphone=" + queryparams.wxphone + "&totalfee=" + queryparams.totalfee + "&patientid=" + queryparams.patientid + "&imgsrc=" + queryparams.imgsrc + "&business=" + queryparams.business + "&returnurl=" + queryparams.returnurl + "&ordercount=" + queryparams.ordercount + "&logisticstatus=" + queryparams.logisticstatus);

    }
}


var order=function(content) {
    var queryparams = Utils.queryParams;
    console.log(queryparams.cartIds)
    var cartIds=JSON.stringify(queryparams.cartIds)
    if (queryparams.business == 'market') {  //来自商城系统的订单

        if (queryparams.servicenameother) {
          var  orderparams={
                name: queryparams.name,
                mobile: queryparams.mobile,
                wxno: queryparams.wxphone,
                patientid: queryparams.patientid,
                address:content,
                cartIds:cartIds
            }
            var postUrl = '/IbabyWebService/DServiceCooper/clearCart';

            var otherpay = 1;  //多囊营提示提示其他咨询方式
            if (queryparams.serviceid == 4) {
                otherpay = 0;
            }
            Utils.ajax.postJSON(postUrl, orderparams).then(function (rel) {
                location.replace('/static/newbuycontent/pay/pay.html?orderid=' + rel.orderid + '&totalfee=' + queryparams.totalfee +
                    '&returnurl=' + queryparams.returnurl + '&otherpay=' + otherpay);
            })

        } else {
        var postUrl = '/IbabyWebService/DServiceCooper/SubmitOrder';
        var  orderparams = {
            serviceid: queryparams.serviceid,
            name: queryparams.name,
            mobile: queryparams.mobile,
            wxno: queryparams.wxphone,
            patientid: queryparams.patientid,
            ordercount: queryparams.ordercount,
            address: content,
            channel: 1
        }

            var otherpay = 1;  //多囊营提示提示其他咨询方式
            if (queryparams.serviceid == 4) {
                otherpay = 0;
            }
            Utils.ajax.post(postUrl, orderparams).then(function (rel) {
                location.replace('/static/newbuycontent/pay/pay.html?orderid=' + rel.orderid + '&totalfee=' + rel.totalfee +
                    '&returnurl=' + queryparams.returnurl + '&otherpay=' + otherpay);
            })

    }



    } else if (queryparams.business == 'servicemall') { //来自服务大厅的订单,订单号需要加上'_servicemall'
        Services.book(queryparams).then(function (result) {

            if (result.isFromChannel) {  //其他渠道过来的
                aid.alert.show('预约成功！');
            }
            else if (result.isInApp) { //app中过来的
                aid.alert.show('预约成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。');
            }
            else if (result.orderstatus == 2) { //选择前往支付
                location.replace('/static/newbuycontent/pay/pay.html?orderid=' + result.orderid + '_servicemall' + '&totalfee=' +
                    queryparams.totalfee + '&returnurl=' + queryparams.returnurl + '&isonline=' + queryparams.isonline +
                    '&message=' + queryparams.message + '&business=' + queryparams.business)

            }
            else {
                aid.alert.show('预约成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。', function () {
                    location.href = '../';
                });
            }
        });
    }

}

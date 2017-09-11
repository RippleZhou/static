/**
 * Created by rvM on 2017/1/13.
 */
// 展示商品信息
var html = template('list',  Utils.queryParams);
$('ul').append(html);
/*
* 生成订单
* 对不同来源需要分别处理
* */
function pay() {
    var queryparams = Utils.queryParams;
    if(queryparams.business == 'market'){  //来自商城系统的订单
        var postUrl = '/IbabyWebService/DServiceCooper/SubmitOrder';
        var orderparams = {};
        orderparams = {
            serviceid: queryparams.serviceid,
            name: queryparams.name,
            mobile: queryparams.mobile,
            wxno:queryparams.wxphone,
            patientid: queryparams.patientid,
        }

        var otherpay = 1;  //多囊营提示提示其他咨询方式
        if (queryparams.serviceid == 4) {
            otherpay = 0;
        }
        Utils.ajax.post(postUrl, orderparams).then(function (rel) {

            location.replace('/static/common/pay/pay.html?orderid='+rel.orderid+'&totalfee='+rel.totalfee+
                '&returnurl='+queryparams.returnurl+'&otherpay='+otherpay+'&serviceid='+orderparams.serviceid);
        })
    } else if (queryparams.business == 'servicemall') { //来自服务大厅的订单,订单号需要加上'_servicemall'
        Services.book(queryparams).then(function (result) {

            if (result.isFromChannel) {  //其他渠道过来的
                aid.alert.show('预约成功！');
            }
            else if (result.isInApp) { //app中过来的
                aid.alert.show('预约成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。');
            }
            else if (result.orderstatus == 2) { //选择前往支付
                location.replace('/static/common/pay/pay.html?orderid='+result.orderid+'_servicemall'+'&totalfee='+
                    queryparams.totalfee+ '&returnurl='+queryparams.returnurl+'&isonline='+queryparams.isonline+
                    '&message='+queryparams.message+'&business='+queryparams.business)

            }
            else {
                aid.alert.show('预约成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。', function () {
                    location.href = '../';
                });
            }
        });
    }
}
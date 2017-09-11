/**
 * Created by Administrator on 2017/6/1 0001.
 */

$(function(){
    //没用的js
    var Utils = window.Utils;
    var paramsall = Utils.storage.get('paramsinit');
    if(paramsall==null||paramsall.patientid==null){
        //无缓存数据时 经过授权 获取缓存数据 并放入缓存
        var newWechat = window.NewWechat;
        newWechat.author();

        var Utils = window.Utils;
        var params = Utils.queryParams;

        var urls='/IbabyWebService/3/Patient/getPatientInfoByOpenId/'+params.openid
        Utils.ajax.get(urls).then(function (rel) {
            var patientid = rel;
            var  paramsform={
                openid:params.openid,
                nickname:params.nickname,
                headimgurl:params.headimgurl,
                patientid:patientid,
                goodsNo:'4026bc7d29fbe5204a25ae87afbd661d',//商品表标识写死，换商品时更改
            }
            Utils.storage.set('paramsinit', paramsform);
            myorder()
        })
    }else{
        myorder()
    }
})


form = function () {
    // $('#form').slideToggle(500);
    $("#form").fadeToggle(500) ;
}

//提交评论
// function submit() {
//     if (!input_check.null($('#text').val())) {
//         return false;
//     }
//     var serviceid = window.serviceid;
//     var content = $('#text').val();
//     var formlist=Utils.storage.get('paramsinit');
//     var  patientid=formlist.patientid;
//     var params = {
//         patientid: patientid,
//         serviceid: serviceid,
//         content: content
//     }
//     var url = '/IbabyWebService/DServiceCooper/SubmitComment';
//     Utils.ajax.post(url, params).then(function (rel) {
//         $('#form').slideToggle(500);
//         diyalert('提交评论成功', 1000);
//     })
// }
//订单列表函数，在上面调用
var myorder=function(){

    var lastupdatetime = Utils.storage.get('lastupdatetime');
    if(lastupdatetime){
        var  lastupdatetime=lastupdatetime
    }else{
        // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
        var date = new Date();
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        var lastupdatetime=Y+M+D+h+m+s
        console.log(Y+M+D+h+m+s);
// 输出结果：2014-04-23 18:55:49
    }

    var formlist=Utils.storage.get('paramsinit');
    var  patientid=formlist.patientid;
    var url = '/IbabyWebService/DServiceCooper/ordersByServiceMall?patientid=' + patientid+'&offset='+0+"&limit"+10+"&lastupdatetime"+lastupdatetime
    Utils.ajax.get(url).then(function (rel) {
        var orderdata = rel;

        for(var i=0;i<orderdata.list.length;i++){
            orderdata.list[i].createtime = orderdata.list[i].createtime.slice(0, orderdata.list[i].createtime.length - 8)//去掉时间的秒
        }
        console.log(orderdata.list)
        var html = template('orderdata', orderdata);
        $('body').append(html);
        if (rel.total == '0') {
            $('.nototle').css('display', 'block');
        }

        var evaluateserviceId=[];
        var evaluate=document.querySelectorAll(".evaluate");
        for(var i=0;i<evaluate.length;i++){
            evaluate[i].addEventListener("click",function(){
                $('#form').slideToggle(500);
                var evaluateserviceId=[];
                for(var j=0;j<rel.list[i].goods.length;j++){
                    evaluateserviceId.push( rel.list[i].goods[j].serviceId);
                }
            })
        }

        var submit=document.querySelector('#submit');
        submit.addEventListener("click",function(){
            if (!input_check.null($('#text').val())) {
                return false;
            }
            // var serviceid = window.serviceid;
            var content = $('#text').val();
            var formlist=Utils.storage.get('paramsinit');
            var  patientid=formlist.patientid;
            for(var a=0;a<evaluateserviceId.length;a++){
                //每个serviceid都要走一遍接口
                var params = {
                    patientid: patientid,
                    serviceid: evaluateserviceId[a],
                    content: content
                }

                var url = '/IbabyWebService/DServiceCooper/SubmitComment';
                Utils.ajax.post(url, params).then(function (rel) {
                    if(a==evaluateserviceId.length-1){
                        // $('#form').slideToggle(500);
                        $("#form").fadeToggle(500) ;
                        diyalert('提交评论成功', 1000);
                    }

                })

            }


        })




    })
}





/*
 * 已有订单进行支付处理
 * 产品名称servicename,费用totalfee，订单号orderid，imgsrc展示图
 * */
function pay(name, price, id, img, serviceid) {
    var orderid = id + '_rebate';
    location.href = '/static/newbuycontent/pay/pay.html?totalfee='+price+'&orderid='+orderid+'&serviceid='+serviceid+'&returnurl='+location.href;
}
function logisticsall(logisticbusiness,logisticno){

    // location.href='https://m.kuaidi100.com/index_all.html?&type='+logisticbusiness+'&postid='+logisticno+'&callbackurl='+'https://ibaby-plan.org/static/newbuycontent/myorder.html'
    location.href='https://m.kuaidi100.com/index_all.html?&type='+logisticbusiness+'&postid='+logisticno+'&callbackurl='+location.href.split('?')[0]

}

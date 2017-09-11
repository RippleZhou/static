/**
 * Created by Administrator on 2017/6/27 0027.
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
                goodsNo:'aca0548d67be2c48a2e6c56dac66efa7',//商品表标识写死，换商品时更改
            }
            Utils.storage.set('paramsinit', paramsform);
                console.log(1)
            })
    } 
})



 
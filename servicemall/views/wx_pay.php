<?php
	session_start();
	$_SESSION['weixin']='1';
	ini_set('date.timezone','Asia/Shanghai');
	require '../inc/path.php';
	require "../inc/database.php";
	$con = mysql_connect("192.168.200.5",'aidingdb','Aa123456');
	mysql_query("SET NAMES UTF8");
	mysql_select_db("ibabyplan");
	$result=mysql_query("SELECT * FROM t_service_serviceorder WHERE id={$_SESSION['orderid']}");
	$row=mysql_fetch_array($result,MYSQL_ASSOC);
	$serviceid=$row['serviceid'];
	$_SESSION['serviceid']=$serviceid;
	$stype=$row['stype'];
	$result=mysql_query("SELECT s.*, c.categorytype FROM t_service_servicedetail s left join t_service_category c
		on s.categoryid=c.categoryid
		WHERE s.id='$serviceid'");
	$row=mysql_fetch_array($result,MYSQL_ASSOC);
	$ways;
	$way;
	if($row['categorytype']=="A" || $row['categorytype']=="B" ){
		$ways=json_decode($row['ways'],true);
	}else if($row['categorytype']=="C"  || $row['categorytype']=="E" ){
		$ways=json_decode($row['suppliers'],true);
	}
	foreach($ways as $w){
			if($w['scode'] == $stype){
				$way = $w;
				break;
			}
		}
	$priceArray=explode('元',$way['price']); 
	$price=(int)((double)$priceArray[0]*100);
	if($way['payway']=='ONLINE'){
		$_SESSION['noOffline']=1;
	}
	else{
		$_SESSION['noOffline']=0;
	}
	$_SESSION['serviceFee']=$price;
	$_SESSION['serviceName']=$row['servicename'];

	include '../inc/jssdk.php';
	$jssdk = new JSSDK("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
	$signPackage = $jssdk->GetSignPackage();
	$jsApiParameters='{}';
	$tradeno=gettimeofday();
	$tradeno=round($tradeno['usec']/1000);
	$tradeno='wx'.date("YmdHis").$tradeno;
	if(stripos($_SERVER['HTTP_USER_AGENT'],'micromessenger')!==false){
		require_once "../inc/WxPay.Api.php";
		$tools = new JsApiPay();
		$openId = $tools->GetOpenid();
		$input = new WxPayUnifiedOrder();
		$input->SetBody($_SESSION['serviceName']);
		$input->SetAttach($_SESSION['serviceName']);
		$input->SetOut_trade_no($tradeno);
		$input->SetTotal_fee($price);
		$input->SetTime_start(date("YmdHis"));
		$input->SetTime_expire(date("YmdHis", time() + 600));
		$input->SetGoods_tag($_SESSION['serviceName']);
		$input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
		$input->SetTrade_type("JSAPI");
		$input->SetOpenid($openId);
		$order = WxPayApi::unifiedOrder($input);
		$jsApiParameters = $tools->GetJsApiParameters($order);
	}
?>
<!doctype html>
<html>
<head>
	<meta charset='utf-8' />
	<meta name="viewport" content="initial-scale=1.0,minimum-scale=1.0,width=device-width,user-scalable=no" />
	<title>支付-爱丁服务</title>
	<link rel="stylesheet" type="text/css" href="http://www.ibabycenter.com/wwwfront/css/unify.css">
	<style>
		.touchFeedback,.touchFeedback.allDes *,.touchFeedback.allDes *:before,.touchFeedback.allDes *:after,.touchFeedback .traDes,.touchFeedback .traDes.allDes *,.touchFeedback .traDes.allDes *:before,.touchFeedback .traDes.allDes *:after{transition:all 111ms}
		.touchFeedback.tc,.touchFeedback.tc.allDes *,.touchFeedback.tc.allDes *:before,.touchFeedback.tc.allDes *:after,.touchFeedback.tc .traDes,.touchFeedback.tc .traDes.allDes *,.touchFeedback.tc .traDes.allDes *:before,.touchFeedback.tc .traDes.allDes *:after{transition:none}
		.have-a-rest{position: absolute;top: 0;left: 0;bottom: 0;right: 0;display: -webkit-box;display: box;-webkit-box-pack:center;box-pack:center;-webkit-box-align:center;box-align:center;display: -webkit-flex;display: flex;-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;opacity: 0;touch-action:none;z-index: 9999}
		.have-a-rest.see{opacity: 1;transition:opacity 1111ms}
		.have-a-rest>div{-webkit-animation: rest 1s infinite linear;animation: rest 1s infinite linear;width: 22px;height: 22px;border: 3px solid rgba(48,163,197,.5);border-top-color: rgb(48,163,197);border-radius: 50%}
		@-webkit-keyframes rest{
			0% {-webkit-transform: rotate(0deg);transform: rotate(0deg)}
			100% {-webkit-transform: rotate(360deg);transform: rotate(360deg)}
		}
		@keyframes rest{
			0% {-webkit-transform: rotate(0deg);transform: rotate(0deg)}
			100% {-webkit-transform: rotate(360deg);transform: rotate(360deg)}
		}
		.evil-tip{position:absolute;top:0;bottom:0;left:0;right:0;opacity:0;transition:opacity 555ms;display: -webkit-box;display: box;-webkit-box-align:center;box-align:center;-webkit-box-pack:center;box-pack:center;display: -webkit-flex;display: flex;-webkit-justify-content: center;justify-content:center;-webkit-align-items: center;align-items: center}
		.evil-tip.see{opacity:1;transition:none}
		.evil-tip div{background:#000;text-align:center;color:#fff;line-height:1.3;border-radius:3px;box-shadow: 0 0 5px rgba(0,0,0,.3);max-width: 280px;padding: 9px;font-size: 14px}
		.evil-alert{position:absolute;top:0;bottom:0;left:0;right:0;opacity:.000001;transition:opacity 333ms;display: -webkit-box;display: box;-webkit-box-align:center;box-align:center;-webkit-box-pack:center;box-pack:center;display: -webkit-flex;display: flex;-webkit-justify-content: center;justify-content:center;-webkit-align-items: center;align-items: center;background:rgba(0,0,0,.5);touch-action:none;z-index: 9999}
		.evil-alert.see{opacity:1}
		.evil-alert div{background:#fff;border-radius:3px;width:222px;transition:all 333ms;-webkit-transform:scale(.1);transform:scale(.1)}
		.evil-alert.see div{-webkit-transform:scale(1);transform:scale(1)}
		.evil-alert p{padding:15px;display: -webkit-box;display: box;-webkit-box-pack:center;box-pack:center;display: -webkit-flex;display: flex;-webkit-justify-content: center;justify-content:center;word-break:break-all;font-size:14px}
		.evil-alert span{display:block;text-align:center;color:#46c6fe;height:33px;line-height:33px;border-top:1px solid #ccc;border-bottom-left-radius:inherit;border-bottom-right-radius:inherit;font-size:16px}
		.evil-alert span.tc{background:#ddd}
		@font-face {
			font-family: 'aiding';
			src:url('http://www.ibabycenter.com/front/font/aiding/fonts/aiding.eot?dj7j9f');
			src:url('http://www.ibabycenter.com/front/font/aiding/fonts/aiding.eot?#iefixdj7j9f') format('embedded-opentype'),
			url('http://www.ibabycenter.com/front/font/aiding/fonts/aiding.woff?dj7j9f') format('woff'),
			url('http://www.ibabycenter.com/front/font/aiding/fonts/aiding.ttf?dj7j9f') format('truetype'),
			url('http://www.ibabycenter.com/front/font/aiding/fonts/aiding.svg?dj7j9f#aiding') format('svg');
			font-weight: normal;
			font-style: normal;
		}
		body{background:#efeff4}
		ul{padding-left:15px;background:#fff}
		li{height:48px;line-height:48px;padding-left:31px;position:relative;padding-right:50px}
		li:not(:last-child){border-bottom:1px solid #d6d7dc}
		li.select:after{display:block;content:'\e60c';height:20px;width:20px;line-height:20px;text-align:center;background:#f90;color:#fff;position:absolute;right:15px;top:50%;margin-top:-11px;border-radius:50%;font-family:aiding}
		i{position:absolute;top:50%;margin-top:-12px;left:0;height:25px;width:25px;border-radius:50%;background:#eee no-repeat center;background-size:cover}
		footer{height:48px;line-height:48px;color:#fff;margin:0 15px;background:#46c6fe;border-radius:24px;font-size:18px;position:fixed;left:15px;right:15px;bottom:10px;text-align:center}
		footer.tc{opacity:.5}
	</style>
</head>

<body>
<ul></ul>
<footer class="touchFeedback">确定</footer>
<script src="http://www.ibabycenter.com/wwwfront/js/third/jquery-2.1.1.min.js"></script>
<script src="http://www.ibabycenter.com/wwwfront/js/third/Tcc.min.js"></script>
<script src="http://www.ibabycenter.com/front/js/lib.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script>
	(function(){
		noOffline=<?php echo $_SESSION['noOffline'];?>==1?true:false
		isWeixin=navigator.userAgent.toLowerCase().indexOf('micromessenger')!= -1
		serviceName='<?php echo $_SESSION['serviceName'];?>'
		fee=<?php echo $_SESSION['serviceFee'];?>;
		pcode='<?php echo $_SESSION['pcode'];?>'
		wxtradeno='<?php echo $tradeno;?>';
		chooseWXPayPackage=<?php echo $jsApiParameters;?>;
		chooseWXPayPackage.timestamp=chooseWXPayPackage.timeStamp
		evilResources.haveARest.init()
		evilResources.tip.init()
		evilResources.alert.init()
		payMethodList=[
			{
				code:'offline',
				icon:'pay_xianxia.jpg',
				title:'线下支付',
				available:true
			},
			{
				code:'zhifubao',
				icon:'pay_zhifubao.jpg',
				title:'支付宝支付',
				available:true
			},
			{
				code:'weixin',
				icon:'pay_weixin.jpg',
				title:'微信支付',
				available:true
			}
		]
		if(isWeixin){
			payMethodList[1].available=false
			payMethodList[2].available=true
			payMethod='weixin'
			wx.config({
				appId:'<?php echo $signPackage["appId"];?>',
				timestamp:<?php echo $signPackage["timestamp"];?>,
				nonceStr:'<?php echo $signPackage["nonceStr"];?>',
				signature:'<?php echo $signPackage["signature"];?>',
				jsApiList:[
					'chooseWXPay'
				]
			})
			wx.ready(function(){
				chooseWXPayPackage.success=function(){
					$('footer').off('click')
					recordPay('weixin',orderno,fee,function(){
						evilResources.alert.alert('支付成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。',goHome)
					})
				}
			})
		}
		else{
			payMethodList[1].available=true
			payMethodList[2].available=false
			payMethod='zhifubao'
		}
		if(noOffline){
			payMethodList[0].available=false
		}
		else{
			payMethod='offline'
		}
		html=''
		for(var i=0;i<payMethodList.length;i++){
			if(payMethodList[i].available){
				html+='\
					<li id="'+payMethodList[i].code+'">\
						<i style="background-image:url(../img/'+payMethodList[i].icon+')"></i>\
						<div>'+payMethodList[i].title+'</div>\
					</li>\
				'
			}
		}
		$('ul').html(html)
		$li_selected=$(document.getElementById(payMethod)).addClass('select')
		$('li').each(function(i){
			$(this).on('tap',function(){
				$li_selected.removeClass('select')
				$li_selected=$(this).addClass('select')
				payMethod=this.id
			})
		})
		$('footer').on('click',function(){
			if(payMethod=='offline'){
				recordPay('offline','','',function(){
					evilResources.alert.alert('预约成功！请到您选择的地点完成支付并体验服务。',goHome)
				})
			}
			else if(payMethod=='zhifubao'){
				orderno='tb'+(new Date().getFullYear())+(new Date().getMonth()+1)+(new Date().getDate())+(new Date().getHours())+(new Date().getMinutes())+(new Date().getSeconds())+(new Date().getMilliseconds())
				recordPay('zhifubao',orderno,fee,function(){
					postpayload=JSON.stringify({
						order:{
							orderno:orderno,
							title:serviceName,
							amount:fee,
							description:serviceName,
							paymethod:"alipay"
						},
						params:{
							show_url:'http://ibaby-plan.org:8180/static/servicemall/views/categorys/'+pcode.charAt(0)+'.html?pcode='+pcode
						}
					})
					$.post('proxy.php',{json:postpayload},function(res){
						$('body').append(res)
					}).fail(function(){
						evilResources.tip.say('失败')
					})
				})
			}
			else if(payMethod=='weixin'){
				wx.chooseWXPay(chooseWXPayPackage)
			}
		})
		function recordPay(payplatform,tradeno,fee,cb){
			evilResources.haveARest.haveARest()
			$.post('../api/record_pay.php',{payplatform:payplatform,tradeno:tradeno,fee:fee},function(res){
				evilResources.haveARest.well()
				if(res.status==0){
					cb()
				}
				else{
					evilResources.alert.alert('预约成功，但爱丁医生未确认请求，请联系爱丁医生确认',goHome)
				}
			},'json').fail(function(){
				evilResources.haveARest.well()
				evilResources.alert.alert('预约成功，但爱丁医生未确认请求，请联系爱丁医生确认',goHome)
			})
		}
		function goHome(){
		    window.history.back(-1);
		}
	})()
</script>
<script src="http://www.ibabycenter.com/front/js/framework.js"></script>
</body>
</html>

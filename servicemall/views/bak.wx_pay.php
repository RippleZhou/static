<?php
	session_start();
	$_SESSION['weixin']='1';
	ini_set('date.timezone','Asia/Shanghai');
	require '../inc/path.php';
	require "../inc/database.php";

	$con = mysql_connect("192.168.200.5",'aidingdb','Aa123456');
	mysql_query("SET NAMES UTF8");
	mysql_select_db("adactivity");
	$result=mysql_query("SELECT * FROM service_order WHERE id=$_SESSION[orderid]");
	$row=mysql_fetch_array($result,MYSQL_ASSOC);
	$pcode=$row['sprogram'];
	$_SESSION['pcode']=$pcode;
	$stype=$row['stype'];
	$result=mysql_query("SELECT * FROM service_appointment_config WHERE pcode='$pcode' AND waycode='$stype'");
	$row=mysql_fetch_array($result,MYSQL_ASSOC);
	$price=$row['price'];
	if($row['payway']=='ONLINE'){
		$_SESSION['noOffline']=1;
	}
	else{
		$_SESSION['noOffline']=0;
	}
	$_SESSION['serviceFee']=$price;
	$result=mysql_query("SELECT * FROM service_program WHERE pcode='$pcode'");
	$row=mysql_fetch_array($result,MYSQL_ASSOC);
	$sname=$row['description'];
	$_SESSION['serviceName']=$sname;

	include '../inc/jssdk.php';
	$jssdk = new JSSDK("http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");
	$signPackage = $jssdk->GetSignPackage();
	require_once "../inc/WxPay.Api.php";
	$tools = new JsApiPay();
	$openId = $tools->GetOpenid();
	$input = new WxPayUnifiedOrder();
	$input->SetBody($_SESSION['serviceName']);
	$input->SetAttach($_SESSION['serviceName']);
	$input->SetOut_trade_no(WxPayConfig::MCHID.date("YmdHis"));
	$input->SetTotal_fee($_SESSION['serviceFee']);
	$input->SetTime_start(date("YmdHis"));
	$input->SetTime_expire(date("YmdHis", time() + 600));
	$input->SetGoods_tag($_SESSION['serviceName']);
	$input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
	$input->SetTrade_type("JSAPI");
	$input->SetOpenid($openId);
	$order = WxPayApi::unifiedOrder($input);
	$jsApiParameters = $tools->GetJsApiParameters($order);
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
<ul>
	<li>
		<i style="background-image:url(../img/pay_xianxia.jpg)"></i>
		<div>线下支付</div>
	</li>
	<li>
		<i style="background-image:url(../img/pay_zhifubao.jpg)"></i>
		<div>支付宝支付</div>
	</li>
	<li>
		<i style="background-image:url(../img/pay_weixin.jpg)"></i>
		<div>微信支付</div>
	</li>
</ul>
<footer class="touchFeedback">确定</footer>
<script src="http://www.ibabycenter.com/wwwfront/js/third/jquery-2.1.1.min.js"></script>
<script src="http://www.ibabycenter.com/wwwfront/js/third/Tcc.min.js"></script>
<script src="http://www.ibabycenter.com/front/js/lib.js"></script>
<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script>
	(function(){
		payMethod=0
		$li=$('li')
				<?php
		if($_SESSION['noOffline']=='1'){
			echo 'payMethod=2;$li.eq(0).hide();';
		}
		?>
		// $li.eq(1).hide()
		$li_selected=$li.eq(payMethod).addClass('select')
		$li.each(function(i){
			$(this).on('tap',function(){
				$li_selected.removeClass('select')
				$li_selected=$(this).addClass('select')
				payMethod=i
			})
		})
		chooseWXPayPackage=<?php echo $jsApiParameters;?>

		chooseWXPayPackage.timestamp=chooseWXPayPackage.timeStamp
		evilResources.haveARest.init()
		evilResources.tip.init()
		evilResources.alert.init()
		chooseWXPayPackage.success=function(){
			$('footer').off('click')
			recordPay('微信支付金额<?php echo intval($_SESSION['serviceFee'])/100;?>元','支付成功！为保证服务质量，爱丁医生稍后将与您联系，向您解释服务细节。')
		}
		wx.config({
			appId: '<?php echo $signPackage["appId"];?>',
			timestamp: <?php echo $signPackage["timestamp"];?>,
			nonceStr: '<?php echo $signPackage["nonceStr"];?>',
			signature: '<?php echo $signPackage["signature"];?>',
			jsApiList: [
				'chooseWXPay'
			]
		})
		wx.ready(function(){
			$('footer').on('click',function(){
				if(payMethod==0){
					recordPay('用户选择线下支付','预约成功！请到您选择的地点完成支付并体验服务。')
					return
				}
				if(payMethod==1){
					evilResources.tip.say('暂不支持支付宝支付')
					return
				}
				wx.chooseWXPay(chooseWXPayPackage)
			})
		})
		function recordPay(msg,tip){
			evilResources.haveARest.haveARest()
			$.post('../api/record_pay.php',{paymessage:msg,tradeno:'<?php echo $input->GetOut_trade_no();?>'},function(res){
				evilResources.haveARest.well()
				if(res.status==0){
					evilResources.alert.alert(tip,goHome)
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
			location.replace('/static/servicemall/')
		}
	})()
</script>
<script src="http://www.ibabycenter.com/front/js/framework.js"></script>
</body>
</html>

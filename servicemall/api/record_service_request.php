<?php
ini_set('display_errors','On');
error_reporting(E_ALL);

header("Content-type:application/json;charset=utf8");
set_error_handler('errorHandler');
function errorHandler($enum,$estr){
	die('{"status":'.$enum.',"errmsg":"'.$estr.'"}');
}
set_exception_handler('exceptionHandler');
function exceptionHandler($e){
	die('{"status":'.$e->getCode().',"errmsg":"'.$e->getMessage().'"}');
}

require '../path.php';
require "../database.php";

session_start();
$_SESSION['phone']=$_POST['phone'];
$_SESSION['createtime']=$_SERVER['REQUEST_TIME'];
$_SESSION['serviceName']=$_POST['sname'];
$_SESSION['serviceFee']=$_POST['serviceFee'];

local_connect();
mysql_select_db("adactivity");
switch($_POST['sname']){
	case '个性化备孕指导':$sname='pregnancyguide';break;
	case 'B超排卵监测':$sname='bchao';break;
	case '试管婴儿咨询':$sname='shiguan';break;
	case '超声下子宫输卵管检查':$sname='chaosheng';break;
	case '多囊卵巢综合征全面诊疗计划':$sname='duonang';break;
	case '试管婴儿怀孕计划':$sname='huaiyjihua';break;
	case '夫妻孕前体检':$sname='fuqitijian';break;
	default:$sname='unknown';
}
switch($_POST['sway']){
	case '电话咨询':$sway='phone';$_SESSION['noOffline']='1';break;
	case '实体门诊':$sway='clinic';$_SESSION['noOffline']='0';break;
	case '远程指导':$sway='remoteguide';$_SESSION['noOffline']='1';break;
	case '优先门诊':$sway='youxian';$_SESSION['noOffline']='1';break;
	case '专业陪诊':$sway='peizhen';$_SESSION['noOffline']='0';break;
}
$sql="INSERT INTO service_order (sprogram,name,phone,email,stype,appointmenttime,createtime,saddress,payonline,patientid) VALUES ('$sname','$_POST[name]','$_POST[phone]','none@none.none','$sway','$_POST[time]','$_SERVER[REQUEST_TIME]','$_POST[addr]','用户未支付',$_POST[addr])";
if (!mysql_query($sql)){
	die('{"status":-3,"errmsg":"'.mysql_error().'"}');
}

$json='{"status":0,"errmsg":"预约成功"}';
if(!json_decode($json)){
	die('{"status":-9,"errmsg":"json_decode NULL"}');
}
echo $json;
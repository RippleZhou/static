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

require '../inc/path.php';
require "../inc/database.php";

session_start();
if(!isset($_SESSION['weixin'])){
	die('{"status":-11,"errmsg":"未授权支付"}');
}

$con = mysql_connect("192.168.200.5",'aidingdb','Aa123456');
mysql_query("SET NAMES UTF8");
mysql_select_db("adactivity");
$paymessage = $_POST['payplatform']."支付".$_POST['fee']."元";
if($_POST['paymessage']=='用户选择线下支付'){
	$sql="UPDATE service_order SET payonline='$paymessage',status=4 WHERE id=$_SESSION[orderid]";
}
else{
	$sql="UPDATE service_order SET payonline='$paymessage',tradeno='$_POST[tradeno]',status=4 WHERE id=$_SESSION[orderid]";
}
if (!mysql_query($sql)){
	die('{"status":-3,"errmsg":"'.mysql_error().'"}');
}

$json='{"status":0,"errmsg":"预约成功"}';
if(!json_decode($json)){
	die('{"status":-9,"errmsg":"json_decode NULL"}');
}
echo $json;
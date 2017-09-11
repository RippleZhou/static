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

include '../inc/jssdk.php';
$jssdk = new JSSDK($_REQUEST['url']);
$signPackage = $jssdk->GetSignPackage();
unset($signPackage['url']);
unset($signPackage['rawString']);
$json='{"status":0,"errmsg":"成功","content":'.json_encode($signPackage).'}';

if(!json_decode($json)){
	die('{"status":-9,"errmsg":"json_decode NULL"}');
}
echo $json;
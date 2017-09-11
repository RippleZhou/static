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
local_connect();
mysql_select_db("adactivity");
$sql="INSERT INTO service_share_survey (tid,program,shareurl,shareto,sharetime) VALUES ('$_POST[tid]','$_POST[program]','$_POST[shareurl]','$_POST[shareto]',$_SERVER[REQUEST_TIME])";

if (!mysql_query($sql)){
	die('{"status":-3,"errmsg":"'.mysql_error().'"}');
}

$json='{"status":0,"errmsg":"success"}';
if(!json_decode($json)){
	die('{"status":-9,"errmsg":"json_decode NULL"}');
}
echo $json;
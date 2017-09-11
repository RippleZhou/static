<?php
ini_set('display_errors','On');
error_reporting(E_ALL ^ E_DEPRECATED);

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
require '../pojo/ResponseModel.php';

local_connect();
mysql_select_db("ibabyplan");

$response = new ResponseModel();
$service_doctor_sql = "select id,name,title,role,hospital,profile,year,people,intro,headicon from t_service_doctor where id = ".$_GET["doctorkey"];
$service_doctor_result = mysql_query($service_doctor_sql);
$content = mysql_fetch_array($service_doctor_result,MYSQL_ASSOC);

mysql_close();
$response->setStatus(0);
$response->setSuccess(true);
$response->setContent($content);
echo json_encode($response);
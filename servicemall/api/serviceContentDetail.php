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
$content=array();

$service_detail_sql = "select d.*,c.categorytype  from t_service_servicedetail d LEFT JOIN t_service_category c ON c.categoryid  = d.categoryid where d.id = " . $_GET['id'];
$service_detail_result = mysql_query($service_detail_sql);
$service  = mysql_fetch_array($service_detail_result,MYSQL_ASSOC);
if($service["doctors"] != null ){
	$service_doctor_sql = "select * from t_service_doctor WHERE id = ".$service["providerid"];
	$service_doctor_result = mysql_query($service_doctor_sql);
	$doctor = mysql_fetch_array($service_doctor_result);
	$service["doctors"] = $doctor;
}

$content=$service;
mysql_close();
$response->setStatus(0);
$response->setSuccess(true);
$response->setContent($content);
echo json_encode($response);
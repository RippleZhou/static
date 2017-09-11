<?php
ini_set('display_errors','On');
error_reporting(E_ALL);

header("Content-type:application/json;charset=utf8");
set_error_handler('errorHandler');
function errorHandler($enum,$estr,$efile,$eline){
	die('{"status":'.$enum.',"errmsg":"'.$estr.' '.$efile.' '.$eline.'"}');
}
set_exception_handler('exceptionHandler');
function exceptionHandler($e){
	die('{"status":'.$e->getCode().',"errmsg":"'.$e->getMessage().'"}');
}

function getStatus($paystate){
	$statusMsg = 0;
	switch ($paystate) {
		case 'pending':
			$statusMsg = 2;
			break;
		case 'success':
			$statusMsg = 1;
			break;
		case 'finished':
			$statusMsg = 1;
			break;
		case 'closed':
			$statusMsg = 2;
			break;
		case 'cancelled':
			$statusMsg = 3;
		default:
			# code...
			break;
	}

	return $statusMsg;
}



require '../inc/path.php';
require "../inc/database.php";

session_start();
local_connect();
mysql_select_db("adactivity");

//获取orderno
$orderno = $_GET['orderno'];

//获取paystate
$paystate = $_GET['paystate'];

if ($paystate == 'success') {

	$sql = 'update service_order set status=' .getStatus($paystate) . ' where orderno = ' . $orderno;
	$query = mysql_query($sql);
}

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

require '../inc/path.php';
require "../inc/database.php";

session_start();
local_connect();
mysql_select_db("adactivity");

// 获取医生的id
$tid = $_POST['tid'];

// 获取总的预订数目和完成服务的数目 已预约:status=4 / 已完成:status=1
$data=array();
$sql = "select count, status from(
select count(*) as count,status,tid from service_order where status = 4 
union select count(*) as count,status , tid from service_order where status = 1) as ta where ta.tid = " . $tid;
$query = mysql_query($sql);
if($query&&mysql_num_rows($query)){
	while($row = mysql_fetch_assoc($query)){
		$data[] = $row;
	}
}
$bookedOrders = 0;
$finishedOrders = 0;

foreach($data as $value){
	if($value['status'] == 4){
		$bookedOrders = $value['count'];
	}
	if($value['status'] == 1){
		$finishedOrders = $value['count'];
	}
}

$total = $bookedOrders + $finishedOrders;

$totaljson = '{"booked":'.$bookedOrders .',"finished":'.$finishedOrders . '}';
$sql = " select td.description as program, tc.bookedOrders, tc.orders  , tc.tid from 
(select ta.sprogram, ta.bookedOrders ,ta.tid ,case When tb.finishedOrders  IS NULL THEN 0 END as Orders  from(
select sprogram, count(*) as bookedOrders , tid, date_format(from_unixtime(createtime),'%Y-%m') as month, status


 from service_order where date_format(from_unixtime(createtime),'%Y-%m') = date_format(NOW(), '%Y-%m') group by sprogram ) as ta left outer join 
 
 (select sprogram, count(*) as finishedOrders ,date_format(from_unixtime(createtime),'%Y-%m') as month, status


 from service_order where date_format(from_unixtime(createtime),'%Y-%m') = date_format(NOW(), '%Y-%m') and status=1 group by sprogram ) as tb
 on  ta.sprogram = tb.sprogram) as tc, service_program as td where tc.sprogram = td.pcode and tc.tid =
 " . $tid;
$query = mysql_query($sql);
unset($data);
$data=array();
if($query&&mysql_num_rows($query)){
	while($row = mysql_fetch_assoc($query)){
		$data[] = $row;
	}
}
$json = json_encode($data);
// foreach($data as $value){
// 		$bookedOrders = $value['bookedOrders'];
	
// 		$finishedOrders = $value['Orders'];
	
// 	$json = $json . '{"program":'.$value['sprogram'].',booked":'.$bookedOrders .',"finished":'.$finishedOrders . '}';
// }

$json='{"status":0,"errmsg":"success", "total": '. $totaljson.  ', "thismonth":  ' . $json . '}';


echo $json;
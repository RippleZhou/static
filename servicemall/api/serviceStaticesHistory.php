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

// 获取时间列表

$sql = " select td.description as program, tc.bookedOrders as total, tc.orders as finished  , tc.tid ,tc.month from 
(select ta.sprogram, ta.bookedOrders ,ta.tid ,ta. month , case When tb.finishedOrders  IS NULL THEN 0 END as orders  from(
select sprogram, count(*) as bookedOrders , tid, date_format(from_unixtime(createtime),'%Y-%m') as month, status


 from service_order where date_format(from_unixtime(createtime),'%Y-%m') <> date_format(NOW(), '%Y-%m') group by sprogram ) as ta left outer join 
 
 (select sprogram, count(*) as finishedOrders ,date_format(from_unixtime(createtime),'%Y-%m') as month, status


 from service_order where date_format(from_unixtime(createtime),'%Y-%m') <> date_format(NOW(), '%Y-%m') and status=1 group by sprogram ) as tb
 on  ta.sprogram = tb.sprogram) as tc, service_program as td where tc.sprogram = td.pcode and tc.tid =  " . $tid  ;
$query = mysql_query($sql);
$data = array();
$timelist = array();
if($query&&mysql_num_rows($query)){
	while($row = mysql_fetch_assoc($query)){
		$data[] = $row;
		$timelist[] = $row['month'];
	}
}

$timelist = array_unique($timelist);
$history = "";
$json = "";
foreach($timelist as $time){
		$json = "";
		$target = array();
		foreach ($data as $value) {
			if($value['month'] == $time){
				$target[] = $value;
			}
		}

		$json = '{ "' . $time . '": ' .json_encode($target) . '}';
		$history = $history . $json;
		
}

 $json='{"status":0,"errmsg":"success", "history": ' . $history . '}';


echo $json;
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

function getStatus($status){
	$statusMsg = '';
	switch ($status) {
		case 1:
			$statusMsg = '已完成';
			break;
		case 2:
			$statusMsg = '待付款';
			break;
		case 3:
			$statusMsg = '已取消';
			break;
		case 4:
			$statusMsg = '已预约';
			break;

		default:
			# code...
			break;
	}

	return $statusMsg;
}

function getSway($sway){
	$swayMsg = '';
	switch ($sway) {
		case 'phone':
			$swayMsg = '电话咨询';
			break;
		case 'clinic':
			$swayMsg = '实体门诊';
			break;
		case 'remoteguide':
			$swayMsg = '远程指导';
			break;
		case 'youxian':
			$swayMsg = '优先门诊';
			break;
		case 'peizhen':
			$swayMsg = '专业陪诊';
			break;

		default:
			# code...
			break;
	}

	return $swayMsg;
}

require '../inc/path.php';
require "../inc/database.php";

session_start();
local_connect();
mysql_select_db("adactivity");

$limit = 10;
if (isset($_POST['limit'])) {
	$limit = $_POST['limit'];
}

$offset = 0;
if (isset($_POST['offset'])) {
	$offset = $_POST['offset'];
}

// 获取channel
if (!isset($_POST['channel']) ) {
	$json='{"status":-1,"errmsg":"channel cannot be empty!", "content": null}';
	die($json);
} else if(!strcmp($_POST['channel'],'kdyz') == 0 ){
	$json='{"status":-2,"errmsg":"invalid channel", "content": null}';
	die($json);
}

$channel = $_POST['channel'];

// 获取Authorization


$sql = "select * from 
(select from_unixtime(a.createtime) as commitTime,a.id as orderid, a.phone as mobile, a.name as nickname, a.sprogram as pcode, b.description as pname, a.stype as sway, a.saddress as address, a.appointmenttime, a.status as status, a.comment as comment from service_order a , service_program b where a.sprogram = b.pcode  and  a.channel = '" . $channel . "') t limit " .$limit . " offset " .$offset;
$query = mysql_query($sql);
$data = array();
if($query&&mysql_num_rows($query)){
	while($row = mysql_fetch_assoc($query)){
		$item = array();
		$item['orderid'] = $row['orderid'];
		$item['mobile'] = $row['mobile'];
		$item['nickname'] = $row['nickname'];
		$item['pname'] = $row['pname'];
		$item['pcode'] = $row['pcode'];
		$item['orderid'] = $row['orderid'];
		$item['sway'] = getSway($row['sway']);
		$item['address'] = $row['address'];
		$datetime = explode(" ", $row['appointmenttime']);
		$item['date'] = $datetime[0];
		$item['time'] = $datetime[1];
		$item['commitTime'] = $row['commitTime'];
		$item['memos'] = $row['comment'];
		$item['status'] = getStatus($row['status']);
		$data[] = $item;
	}
}

$json = json_encode($data);

 $json='{"status":0,"errmsg":"success", "content": ' . $json . '}';


echo $json;
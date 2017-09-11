<?php 
	require_once('connect.php');

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


	$sql = "select * from t_service_one_to_one ";

	$query = mysql_query($sql);
	$item = array();
	if($query&&mysql_num_rows($query)){
		while($row = mysql_fetch_assoc($query)){
			$item['title'] = $row['title'];
			$item['content'] = $row['content'];
			$item['icon'] = $row['icon'];
			$item['url'] = $row['url'];
			$item['createtime'] = $row['createtime'];
			$item['updatetime'] = $row['updatetime'];
		}
	}

$json = json_encode($item);

//开关
//$json='{"status":0,"errmsg":"success", "content": ' . $json . '}';

  $json='{"status":0,"errmsg":"success", "content": null}';


echo $json;

	
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


	$sql = "select a.id,a.servicename,c.categoryname,c.categorytype,a.cover,a.introduction from t_service_servicedetail as a , t_service_serviceonlist as b, t_service_category as c where a.id = b.serviceid and find_in_set('1', b.servicechannel) and a.categoryid = c.categoryid ";

	$query = mysql_query($sql);
	$data = array();

	if($query&&mysql_num_rows($query)){
		while($row = mysql_fetch_assoc($query)){
			$item = array();
			$item['categoryname'] = $row['categoryname'];
			$item['categorytype'] = $row['categorytype'];
			//$item['pcode'] = $row['pcode'];
			$item['id'] = $row['id'];
			$item['servicename'] = $row['servicename'];
			$item['introduction'] = $row['introduction'];
			$item['cover'] = $row['cover'];
			$data[] = $item;
		}
	}

$json = json_encode($data);

 $json='{"status":0,"errmsg":"success", "content": ' . $json . '}';


echo $json;

	
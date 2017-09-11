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
require '../pojo/ServiceCategory.php';
require '../pojo/ServiceDetail.php';

local_connect();
mysql_select_db("ibabyplan");

/*$response = new ResponseModel();
$content = array();
$service_category_sql="SELECT categoryid, categoryname as cat,categorytype as type,description as 'desc' FROM t_service_category ORDER BY orderid";
$service_detail_sql="select categoryid,pcode,servicename as name,introduction as 'desc' from t_service_servicedetail";
$service_category_result=mysql_query($service_category_sql);
$service_detail_result=mysql_query($service_detail_sql);
echo "result".json_encode($service_detail_result);
while($obj = mysql_fetch_object($service_category_result)){
    $serviceCategory = new ServiceCategory($obj->cat,$obj->desc,findServices($obj->categoryid,$service_detail_result));
    echo json_encode($serviceCategory);
    $content[$obj->type] = $serviceCategory;
}

function findServices($categoryid,$service_detail_result){
    echo "categoryid".$categoryid;
    $services=array();
    while($obj = mysql_fetch_object($service_detail_result)){
        if($obj->categoryid == $categoryid){
            array_push($services,new ServiceDetail($obj->name,$obj->desc,$obj->pcode));
        }
    }
    return $services;
}*/


$response = new ResponseModel();
$content = array();
$showAll = 0;
if(isset($_GET['showAll'])){
    $showAll=$_GET['showAll'];
}
$service_category_sql="SELECT categoryid, categoryname as cat,categorytype as type,description as 'desc' FROM t_service_category ORDER BY orderid";
$service_category_result=mysql_query($service_category_sql);
while($obj = mysql_fetch_object($service_category_result)){
    $service_detail_sql=null;
    if($showAll == "1"){
        $service_detail_sql="SELECT s.id,s.categoryid,s.servicename AS name,s.description AS 'desc',s.cover,s.icon FROM t_service_servicedetail s WHERE s.categoryid=".$obj->categoryid;
    }else {
        $service_detail_sql="SELECT s.id,s.categoryid,s.servicename AS name,s.description AS 'desc',s.cover,s.icon  FROM t_service_serviceonlist o JOIN t_service_servicedetail s ON o.serviceid = s.id WHERE o.servicechannel = 1 and s.categoryid = ".$obj->categoryid;
    }


    $service_detail_result = mysql_query($service_detail_sql);
    //获得该分类下的所有服务
    $service_detail_list = array();
    if($service_detail_result != null){
        while($obj2 = mysql_fetch_object($service_detail_result)){
            array_push($service_detail_list,$obj2);
        }
    }
    $serviceCategory = new ServiceCategory($obj->categoryid,$obj->cat,$obj->desc,$service_detail_list,$obj->type);
    //$content[$obj->type] = $serviceCategory;
    array_push($content,$serviceCategory);
}

mysql_close();
$response->setStatus(0);
$response->setSuccess(true);
$response->setContent($content);
echo json_encode($response);

?>
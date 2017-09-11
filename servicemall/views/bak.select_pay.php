<?php
	session_start();
	$_SESSION['orderid']=$_GET['orderid'];
	header("Location:http://ibaby-plan.org:8180/static/servicemall/views/wx_pay.php");

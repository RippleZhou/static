<?php
	session_start();
	$_SESSION['orderid']=$_GET['orderid'];
	header("Location:/static/servicemall/views/wx_pay.php");
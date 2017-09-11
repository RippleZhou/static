<?php
error_reporting(E_ALL ^ E_DEPRECATED);
function local_connect(){
	$con = mysql_connect("192.168.200.5",DATABASE_USERNAME,DATABASE_PASSWORD);
	if (!$con){
		die('{"status":-3,"errmsg":"'.mysql_error().'"}');
	}
	mysql_query("SET NAMES UTF8");
}
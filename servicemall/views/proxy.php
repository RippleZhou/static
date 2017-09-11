<?php
$a=file_get_contents('http://ibaby-plan.org:8180/IbabyWebService/Pay/PrePay',false,stream_context_create(array(
	'http'=>array(
		'method'=>'POST',
		'header'=>'Content-type:application/Json',
		'content'=>"$_POST[json]"
	)
)));

echo $a;
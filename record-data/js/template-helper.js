template.helper('date_ymd', function(date) {
	if (date) {
		return new Date(date.replace(/-/g, '/')).Format("yyyy/MM/dd");
	}else{
		return '';
	};
    
});

template.helper('date_hm', function(date) {
	if (date) {
		return new Date(date.replace(/-/g, '/')).Format("hh:mm");
	}else{
		return '';
	};
    
});

template.helper('date_ymd', function(date) {
    return new Date(date.replace(/-/g, '/')).Format("yyyy/MM/dd");
});

template.helper('date_hm', function(date) {
    return new Date(date.replace(/-/g, '/')).Format("hh:mm");
});

template.helper('date_ymdhm', function(date) {
	return new Date(date.replace(/-/g, '/')).Format("yyyy-MM-dd hh:mm");
});

template.helper('get_answer', function(data, order) {
	var newdata = data.shift();
	for (var i=0; i<data.length; i++) {
		if(data[i].order == order) {
			return data[i].answer;
		}else{
			return '';
		}
	}
})

Utils.ajax.get('/IbabyWebService/camp/memberrank?campid='+Utils.queryParams.campid).then(function (list) {
    var listdata = new Object();
    listdata.list = list;
    var html = template('list',listdata);
    $('#chart').append(html);
})
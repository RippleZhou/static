var Utils = window.Utils;
getlist();
window.wechat.share({
    title:'爱丁训练营丨列表'
})

//获取营列表
function getlist() {
    Utils.ajax.get('/IbabyWebService/camp/list').then(function (rel) {
        for (var i = 0; i < rel.length; i++) {
            var endtime = new Date(rel[i].endtime.replace(/-/g, '/'));
            var nowtime = new Date();
            var endTime = (Date.parse(endtime)) / 1000;
            var nowTime = (Date.parse(nowtime)) / 1000;
            if (endTime <= nowTime) {
                var html = template('list',rel[i]);
                $('#camped ul').append(html);
            } else {
                var lasttime = endTime - nowTime;
                console.log(lasttime/(60*60*24));
                rel[i].ended = Math.ceil(lasttime/(60*60*24));
                var html = template('list',rel[i]);
                $('#camping ul').append(html);
            }
        }
    })
}
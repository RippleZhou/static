//goods.js
var http = window.HTTP;
http.get('/static/json/integral_system/integral_mall.json',function (goodsdata) {
    var urlparams = getqueryParams();
    var id = urlparams.id;
    var html = template('goods', goodsdata.goods[id])
    document.querySelector('#desc').innerHTML = html;
})

function getqueryParams() { //url参数 => object
    var params = {};
    var queryString = window.location.search.replace(/^\?/, '').split('&');
    var param;

    queryString.forEach(function (d, i) {
        if (d) {
            param = d.split('=');
            params[param[0]] = decodeURIComponent(param[1]);
        }
    });
    return params;
}
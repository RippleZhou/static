/**
 * Created by Administrator on 2017/6/2 0002.
 */


//   此页面微信授权操作
$(function () {

    var count=Utils.storage.get('count'); ///计算商品数量
    if(count){
        var coun=count;
        document.querySelector('.iclass').innerHTML=coun;
    }else{
        var coun=0;
        document.querySelector('.iclass').innerHTML=coun;
    }

    var paramsall = Utils.storage.get('paramsinit');
    $('.adiv').click(function(){
        // var goodsNo=paramsall.goodsNo;
        // location.href="content-frist.html?&goodsNo="+goodsNo;
        location.href="content-frist.html"
        // location.href="content-frist.html?id="+1;
    })
    var html=template('infousername',paramsall);
    $('#info').append(html);

})

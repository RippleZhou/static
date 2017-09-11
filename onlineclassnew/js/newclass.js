$(function () {
    var newWechat = window.NewWechat;
    newWechat.author();
    var Utils = window.Utils;
    var params = Utils.queryParams;


    //计算输入个数
    // showLen(document.getElementById("reviewww"));
    // function showLen(obj){
    //     document.getElementById('sumuser').innerHTML = obj.value.length;
    // }


    lockopen=function(){
        document.body.style.backgroundColor='#000';
        document.querySelector(".box").style.opacity="0.5";
        document.querySelector(".Bomb").style.display="block";
    }

    var close=document.querySelector(".close");
    close.addEventListener("click",function(){
        document.body.style.backgroundColor="#fff"
        document.querySelector(".box").style.opacity="1";
        document.querySelector(".Bomb").style.display="none";
    })
    fromcontent=function(){
        $(".contentbottom").toggle(500)
    }


    var sendcomment=document.querySelector(".sendcomment");
    sendcomment.addEventListener("click",function(){
        $("<img alt=''>").attr("src",params.headimgurl)
            .css({
                "position":"absolute",
                "width":"30px",
                "height":"30px",
                "left":$(window).width()+"px",
                "top":"50px",
                "border-radius":"20px",
                "overflow":"hidden",
                "z-index":1,
            })
            .animate({"left":"-300px"}, 6000, "linear", function () {
                $(this).remove();
            })
            .appendTo(".imgboxcontent");
        $("<p></p>")
            .text(document.getElementById('reviewww').value)
            .css({
                "position":"absolute",
                "background-color":"#fff",
                 "height":"30px",
                "opacity":"0.5",
                "left":$(window).width()+"px",
                "top":"50px",
                "border-radius":"10px",
                "overflow":"hidden",
                "line-height":"30px",
                "padding-left":"35px",
                "padding-right":"10px",
            })
            .animate({"left":"-300px"}, 6000, "linear", function () {
                $(this).remove();
            })
            .appendTo(".imgboxcontent");

        document.getElementById('reviewww').value="";
    })
})
function size(par) {
    if (par.value.length <21){
        document.getElementById("sumuser").innerHTML = par.value.length.toString();
    }
}



var imglist,imgnum=0;
var maindata = clock.getstorage('taskinfor');
$('input:file').localResizeIMG({
    width: 720,
    quality: 0.6,
    success: function (result) {
        var img = document.createElement('img');
        img.className = 'preimg';
        img.src = result.base64;
        if (imgnum<3){
            if(!imglist) {
                imglist = result.base64+'@@@@@@@@@@';
            }else {
                imglist = imglist + result.base64+'@@@@@@@@@@';
            }
            imgnum++;
            document.querySelector('#add-img').appendChild(img);
        } else {
            aid.tip.show('最多添加3张图片');
        }
    }
});
$('#submit').delegate('.preimg', 'click', function () {
    clock.imgEnlarge($(this));
})
$('.foot').click(function () {
    if ($('textarea').val().length<=0){
        aid.tip.show('打卡留言不能为空！');
        return false;
    }
    /*
    if (!imglist){
        aid.tip.show('最少配一张图片！');
        return false;
    }
    */
    var params = {
        campid:maindata.campid,
        taskid:maindata.taskid,
        patientid:User.getUser().patientid,
        userid:User.getUser().patientid,
        role:maindata.role,
        content:$('textarea').val(),
        imglist:imglist
    }
    Utils.ajax.post('/IbabyWebService/camp/comment/submit',params).then(function (rel) {
        $('.back.num1').fadeIn(500);
    },function () {
        $('.back.num2').fadeIn(500);
    })
})
function goback() {
    location.replace('/static/camp/mission/missiondetail.html?campid='+maindata.campid+'&taskid='+maindata.taskid);
}
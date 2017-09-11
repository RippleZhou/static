$(function(){
    var count=Utils.storage.get('count'); ///计算商品数量
    if(count){
        var coun=count;
        document.querySelector('.iclass').innerHTML=coun;
    }else{
        var coun=0;
        document.querySelector('.iclass').innerHTML=coun;
    }
    common()
    fromshow()
    checkout()


})

//form表单
function fromshow(){
    //判断是否有form表单缓存
    var form = Utils.storage.get('formlist');
    if(form){
        $('#name').val(form.uname);
        $('#phone').val(form.uphone);
        $('#wxphone').val(form.wxphone);
    }else{
    }
    //结算按钮
    var Toggle = document.querySelector('.Toggle');
    Toggle.addEventListener('click', function(){
        var ppp=document.querySelector("#price")
        var ss=ppp.innerHTML//总价钱
        if(ss>0){
            $('#form').slideToggle(500);
            $('#fullForm').fadeToggle(500);
        }else{
            diyalert('请选择商品', 1000);
        }
    })


}


//点击删除重新加载页面
function deletebutton(cartid){
    var cartId=cartid;
    var urldelete="/IbabyWebService/DServiceCooper/deleteCart?cartId="+cartId
    Utils.ajax.get(urldelete).then(function (res){
        common()

    })
}

//二个全选按钮
function checkout() {
    // 获取全选按钮
    // var checkAll = document.querySelector('.checkAll');
    //需求 ：全选
//     checkAll.addEventListener('click', function () {
//         this.classList.toggle('checked');
//         var init = this.querySelector('input');
//
//         // 判断当前的全选按钮是否被勾选上，如果勾选上，将checkList全部选择上
//
// //获取主体对象
//         var cartB = document.querySelector('.cart-m-b');
//
//         //获取除了全选按钮的所有checkbox
//         var checkList = cartB.querySelectorAll('.checkbox-wrap');
//         // 获取除了全选按钮的所有checkbox里面的复选框
//         var inputAll = cartB.querySelectorAll('input[type="checkbox"]');
//         var Allcheck = document.querySelector('#Allcheck');//另一个全选按钮
//         var Allinput=Allcheck.querySelector('input')
//         if(init.checked){
//             Allcheck.classList.add('checked');//另一个全选按钮
//             Allinput.checked=true;
//             for (var i = 0; i < checkList.length; i++) {
//                 checkList[i].classList.add('checked');
//                 // 让所有的复选框被选中
//                 inputAll[i].checked = true;
//             }
//         } else {
//
//             Allcheck.classList.remove('checked')//另一个全选按钮
//
//             Allinput.checked=false;
//
//             for (var i = 0; i < checkList.length; i++) {
//                 checkList[i].classList.remove('checked');
//                 // 让所有的复选框取消选中
//                 inputAll[i].checked = false;
//             }
//         }
//
//         var b = 0.0;
//         var arrA = [];
//         $(".carcard  input[type='checkbox']").each(function (index) {
//             if (this.checked == true) {
//                 var serviceid = this.dataset.serviceid;
//                 var cartId = this.dataset.cartid; //商品iD
//                 var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;
//                 Utils.ajax.get(url).then(function (infodata) {
//
//                     var picre = document.querySelectorAll('.picre');
//                     var count = picre[index].innerHTML;
//                     infodata.count = count;
//                     infodata.cartId = cartId;
//                     arrA.push(infodata)
//
//                     var arrfrom = {
//                         list: arrA
//                     }
//
//                     var html = template('arrform', arrfrom);
//                     $('#forminfo').html("");
//                     $('#forminfo').append(html);
//
//                     //切换显示form
//                     var Toggleclose = document.querySelector('.Toggleclose')
//                     Toggleclose.addEventListener('click', function () {
//                         $('#form').slideToggle(1000);
//                         $('#fullForm').fadeToggle(1000);
//                     })
//
//                 })
//
//                 var id = "total_price" + this.dataset.index;//价格id属性
//                 var idsum = "sum_price" + this.dataset.index;//数量id属性
//                 b += $("#" + id).text() * $("#" + idsum).text();
//             }
//         })
//         $("#price").text(b.toFixed(2));
//
//     })

    var Allcheck = document.querySelector('#Allcheck');//另一个全选按钮
//另一个全选按钮
    Allcheck.addEventListener('click', function () {
        this.classList.toggle('checked');
        var initB = this.querySelector('input');
        console.log(initB.checked)
        // 判断当前的全选按钮是否被勾选上，如果勾选上，将checkList全部选择上
        // 获取全选按钮
        var checkAll = document.querySelector('.checkAll');
//获取主体对象
        var cartB = document.querySelector('.cart-m-b');

        //获取除了全选按钮的所有checkbox
        var checkList = cartB.querySelectorAll('.checkbox-wrap');
        // 获取除了全选按钮的所有checkbox里面的复选框
        var inputAll = cartB.querySelectorAll('input[type="checkbox"]');

        if (initB.checked) {
            console.log('haha')
            // checkAll.classList.add('checked');//另一个全选按钮
            for (var i = 0; i < checkList.length; i++) {
                console.log(666)
                checkList[i].classList.add('checked');
                // 让所有的复选框被选中
                inputAll[i].checked = true;
            }
        } else {
            // checkAll.classList.remove('checked')//另一个全选按钮
            for (var i = 0; i < checkList.length; i++) {
                checkList[i].classList.remove('checked');
                // 让所有的复选框取消选中
                inputAll[i].checked = false;
            }
        }

        var a = 0.0;
        var arrB = [];
        $(".carcard  input[type='checkbox']").each(function (index) {
            if (this.checked == true) {
                var serviceid = this.dataset.serviceid;
                var cartId = this.dataset.cartid; //商品iD
                var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;

                Utils.ajax.get(url).then(function (infodata) {

                    var picre = document.querySelectorAll('.picre');
                    var count = picre[index].innerHTML;
                    infodata.count = count;
                    infodata.cartId = cartId;
                    arrB.push(infodata)

                    var arrfrom = {
                        list: arrB
                    }

                    var html = template('arrform', arrfrom);
                    $('#forminfo').html("");
                    $('#forminfo').append(html);

                    //切换显示form
                    var Toggleclose = document.querySelector('.Toggleclose')
                    Toggleclose.addEventListener('click', function () {
                        $('#form').slideToggle(1000);
                        $('#fullForm').fadeToggle(1000);
                    })

                })


                var id = "total_price" + this.dataset.index;//价格id属性
                var idsum = "sum_price" + this.dataset.index;//数量id属性

                // if($("#"+idsum).text()>1){
                //     a += $("#" + id).text() * $("#" + idsum).text()*this.dataset.discounts;
                // }else{
                    a += $("#" + id).text() * $("#" + idsum).text();
                // }
            }
        })
        $("#price").text(a.toFixed(2));

    })

}


function common(){

    var lastupdatetime = Utils.storage.get('lastupdatetime');
    if(lastupdatetime){
        var  lastupdatetime=lastupdatetime
    }else{
        // 比如需要这样的格式 yyyy-MM-dd hh:mm:ss
        var date = new Date();
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate() + ' ';
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        var lastupdatetime=Y+M+D+h+m+s
        console.log(Y+M+D+h+m+s);
// 输出结果：2014-04-23 18:55:49
    }
    var paramsall = Utils.storage.get('paramsinit');
    var patientid=paramsall.patientid;
    var url='/IbabyWebService/DServiceCooper/cratServiceByUser?patientid='+patientid+'&offset='+0+'&limit='+10+'&lastupdatetime='+lastupdatetime
    Utils.ajax.get(url).then(function (rel) {

        //计算商品数量
        var sum=0;
        for(var i=0;i<rel.list.length;i++){
            sum+=rel.list[i].count;
        }
        var count=document.querySelector('.iclass').innerHTML
        if(sum==count){

        }else{

            document.querySelector('.iclass').innerHTML=sum;
            Utils.storage.set('count', sum); ///计算商品数量
        }
        console.log(rel.list);
        if(rel.list.length==0){
            document.querySelector(".carguanguang").style.display="block";
            document.querySelector(".footer-box").style.display="none";
        }else{
            document.querySelector(".footer-box").style.display="block";
        }

        // var checkAll = document.querySelector('.checkAll');
        // var inputAll=checkAll.querySelector('input');

        var  Allcheck = document.querySelector('#Allcheck');//另一个全选按钮
        var Allinput=Allcheck.querySelector('input')

        // checkAll.classList.remove('checked');
        // inputAll.checked=false;
        Allcheck.classList.remove('checked');
        Allinput.checked=false;

        $("#price").text(0);


        var html=template('cards',rel);
        $('.cart-m-b').html("");
        $('.cart-m-b').append(html);
        var lastupdatetimes=rel.lastupdatetime;
        Utils.storage.set('lastupdatetime', lastupdatetimes); //缓存form内容

        // 获取全选按钮
        var checkAll = document.querySelector('.checkAll');
//获取主体对象
        var cartB = document.querySelector('.cart-m-b');
// 获取除了全选按钮的所有checkbox里面的复选框
        var inputAll = cartB.querySelectorAll('input[type="checkbox"]');

        var  Allcheck = document.querySelector('#Allcheck');//另一个全选按钮

// 点击checkbox实现切换效果

        var checkboxWrap = cartB.querySelectorAll('.checkbox-wrap');

        for(var i = 0; i < checkboxWrap.length; i++){
            checkboxWrap[i].addEventListener('click', function(){
                // 点击谁就让谁切换checked类
                this.classList.toggle('checked');
                var init=this.querySelector('input');
                console.log(init.checked);

                var num=checkboxWrap.length;//所有子复选框的个数

                // var checkAll = document.querySelector('.checkAll');
                // var inputAll=checkAll.querySelector('input');

                var  Allcheck = document.querySelector('#Allcheck');//另一个全选按钮
                var Allinput=Allcheck.querySelector('input');

                var all=$(".cart-m-b input[type='checkbox']:checked").length//input选中checked的个数

                if(num==all){
                    // checkAll.classList.add('checked');
                    // inputAll.checked=true;
                    Allcheck.classList.add('checked')
                    Allinput.checked=true;
                }else{
                    // checkAll.classList.remove('checked');
                    // inputAll.checked=false;
                    Allcheck.classList.remove('checked')
                    Allinput.checked=false;
                }

                var s =  0.0;
                var arr=[];
                $(".cart-m-b input").each(function (index) {
                    if(this.checked == true){

                        var serviceid=this.dataset.serviceid;
                        var cartId=this.dataset.cartid; //商品iD
                        var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;

                        Utils.ajax.get(url).then(function (infodata) {

                            var picre = document.querySelectorAll('.picre');
                            var count=picre[index].innerHTML;
                            infodata.count=count;
                            infodata.cartId=cartId;
                            arr.push(infodata)

                            var arrfrom={
                                list:arr
                            }

                            var html=template('arrform',arrfrom);
                            $('#forminfo').html("");
                            $('#forminfo').append(html);

                            //切换显示form
                            var Toggleclose=document.querySelector('.Toggleclose')
                            Toggleclose.addEventListener('click', function(){
                                $('#form').slideToggle(1000);
                                $('#fullForm').fadeToggle(1000);
                            })

                        })

                        var id  = "total_price"+this.dataset.index;//价格id属性
                        var idsum="sum_price"+this.dataset.index;//数量id属性
                        // if($("#"+idsum).text()>1){
                        //     console.log(this.dataset.discounts)
                        //     s +=$("#"+id).text()*$("#"+idsum).text()*this.dataset.discounts;
                        // }else{
                            s +=$("#"+id).text()*$("#"+idsum).text();
                        // }

                    }

                })
                $("#price").text(s.toFixed(2));
            })
        }

//购买数量

        var add=document.querySelectorAll('.add');
        var reduce=document.querySelectorAll('.reduce');

        //点击++
        $('.add').each(function(indexs){
            this.addEventListener('click', function(){
                var p=this.previousElementSibling.innerHTML//获取上一个兄弟元素
                p++;
                this.previousElementSibling.innerHTML=p;
                //计算总数量
                var count = document.querySelectorAll('.picre');
                var addsum=0;
                for(var i=0;i<count.length;i++){
                     addsum+=count[i].innerHTML-0;
                }
                document.querySelector('.iclass').innerHTML=addsum;
                Utils.storage.set('count', addsum); ///计算商品数量

                var cartId=this.dataset.cartid; //商品iD
                var urladd="/IbabyWebService/DServiceCooper/addCart?cartId="+cartId+'&count='+1
                Utils.ajax.get(urladd).then(function (res){
                    if(inputAll[indexs].checked==true){
                        var c=0.0;
                        var arradd=[];
                        $(".carcard  input[type='checkbox']").each(function (index) {
                            if(this.checked == true){
                                var id  = "total_price"+this.dataset.index;//价格id属性
                                var idsum="sum_price"+this.dataset.index;//数量id属性

                                // if($("#"+idsum).text()>1){
                                //     c +=$("#"+id).text()*$("#"+idsum).text()*this.dataset.discounts;
                                // }else{
                                    c+=$("#"+id).text()*$("#"+idsum).text();
                                // }


                                var serviceid=this.dataset.serviceid;
                                var cartId=this.dataset.cartid; //商品iD
                                var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;

                                Utils.ajax.get(url).then(function (infodata) {

                                    var picre = document.querySelectorAll('.picre');
                                    var count=picre[index].innerHTML;
                                    infodata.count=count;
                                    infodata.cartId=cartId;
                                    arradd.push(infodata)

                                    var arrfrom={
                                        list:arradd
                                    }

                                    var html=template('arrform',arrfrom);
                                    $('#forminfo').html("");
                                    $('#forminfo').append(html);

                                    //切换显示form
                                    var Toggleclose=document.querySelector('.Toggleclose')
                                    Toggleclose.addEventListener('click', function(){
                                        $('#form').slideToggle(1000);
                                        $('#fullForm').fadeToggle(1000);
                                    })

                                })
                            }
                        })
                        $("#price").text(c.toFixed(2));
                    }
                })
            })
        })
        //点击--
        $('.reduce').each(function(indexs){
            this.addEventListener('click', function(){
                var p=this.nextElementSibling.innerHTML//获取下一个兄弟元素
                p--;
                if(p<1){
                    p=1
                }
                this.nextElementSibling.innerHTML=p;

                //计算总数量
                var count = document.querySelectorAll('.picre');
                var addsum=0;
                for(var i=0;i<count.length;i++){
                    addsum+=count[i].innerHTML-0;
                }
                document.querySelector('.iclass').innerHTML=addsum;
                Utils.storage.set('count', addsum); ///计算商品数量

                var cartIdurlreduce=this.dataset.cartid; //商品iD
                var urlreduce="/IbabyWebService/DServiceCooper/minusCart?cartId="+cartIdurlreduce+'&count='+1
                Utils.ajax.get(urlreduce).then(function (res){
                    if(inputAll[indexs].checked==true){
                        var d=0.0;
                        var arrreduce=[];
                        $(".carcard  input[type='checkbox']").each(function (index) {
                            if(this.checked == true){
                                var serviceid=this.dataset.serviceid;
                                var cartId=this.dataset.cartid; //商品iD
                                var url = '/IbabyWebService/DServiceCooper/ServiceDetail?id=' + serviceid;

                                Utils.ajax.get(url).then(function (infodata) {

                                    var picre = document.querySelectorAll('.picre');
                                    var count=picre[index].innerHTML;
                                    infodata.count=count;
                                    infodata.cartId=cartId;
                                    arrreduce.push(infodata)

                                    var arrfrom={
                                        list:arrreduce
                                    }

                                    var html=template('arrform',arrfrom);
                                    $('#forminfo').html("");
                                    $('#forminfo').append(html);

                                    //切换显示form
                                    var Toggleclose=document.querySelector('.Toggleclose')
                                    Toggleclose.addEventListener('click', function(){
                                        $('#form').slideToggle(1000);
                                        $('#fullForm').fadeToggle(1000);
                                    })

                                })

                                var id  = "total_price"+this.dataset.index;//价格id属性
                                var idsum="sum_price"+this.dataset.index;//数量id属性
                                // if($("#"+idsum).text()>1){
                                //     d +=$("#"+id).text()*$("#"+idsum).text()*this.dataset.discounts;
                                // }else{
                                    d+=$("#"+id).text()*$("#"+idsum).text();
                                // }


                            }
                        })
                        $("#price").text(d.toFixed(2));
                    }
                })
            })
        })

        //滑动删除
        $(document).ready(function(e) {
            // 设定每一行的宽度=屏幕宽度+按钮宽度
            $(".line-scroll-wrapper").width($(".line-wrapper").width() + $(".line-btn-delete").width());
            // 设定常规信息区域宽度=屏幕宽度
            $(".line-normal-wrapper").width($(".line-wrapper").width());

            // 获取所有行，对每一行设置监听
            var lines = $(".line-normal-wrapper");
            var len = lines.length;
            var lastX, lastXForMobile;

            // 用于记录被按下的对象
            var pressedObj;  // 当前左滑的对象
            var lastLeftObj; // 上一个左滑的对象

            // 用于记录按下的点
            var start;

            // 网页在移动端运行时的监听
            for (var i = 0; i < len; ++i) {
                lines[i].addEventListener('touchstart', function(e){
                    lastXForMobile = e.changedTouches[0].pageX;
                    pressedObj = this; // 记录被按下的对象

                    // 记录开始按下时的点
                    var touches = event.touches[0];
                    start = {
                        x: touches.pageX, // 横坐标
                        y: touches.pageY  // 纵坐标
                    };
                });

                lines[i].addEventListener('touchmove',function(e){
                    // 计算划动过程中x和y的变化量
                    var touches = event.touches[0];
                    delta = {
                        x: touches.pageX - start.x,
                        y: touches.pageY - start.y
                    };

                    // 横向位移大于纵向位移，阻止纵向滚动
                    if (Math.abs(delta.x) > Math.abs(delta.y)) {
                        event.preventDefault();
                    }
                });

                lines[i].addEventListener('touchend', function(e){
                    if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                        $(lastLeftObj).animate({marginLeft:"0"}, 500); // 右滑
                        lastLeftObj = null; // 清空上一个左滑的对象
                    }
                    var diffX = e.changedTouches[0].pageX - lastXForMobile;
                    if (diffX < -30) {
                        $(pressedObj).animate({marginLeft:"-100px"}, 500); // 左滑
                        lastLeftObj && lastLeftObj != pressedObj &&
                        $(lastLeftObj).animate({marginLeft:"0"}, 500); // 已经左滑状态的按钮右滑
                        lastLeftObj = pressedObj; // 记录上一个左滑的对象
                    } else if (diffX > 30) {
                        if (pressedObj == lastLeftObj) {
                            $(pressedObj).animate({marginLeft:"0"}, 500); // 右滑
                            lastLeftObj = null; // 清空上一个左滑的对象
                        }
                    }
                });
            }

            //网页在PC浏览器中运行时的监听
            for (var i = 0; i < len; ++i) {
                $(lines[i]).bind('mousedown', function(e){
                    lastX = e.clientX;
                    pressedObj = this; // 记录被按下的对象
                });

                $(lines[i]).bind('mouseup', function(e){
                    if (lastLeftObj && pressedObj != lastLeftObj) { // 点击除当前左滑对象之外的任意其他位置
                        $(lastLeftObj).animate({marginLeft:"0"}, 500); // 右滑
                        lastLeftObj = null; // 清空上一个左滑的对象
                    }
                    var diffX = e.clientX - lastX;
                    if (diffX < -30) {
                        $(pressedObj).animate({marginLeft:"-100px"}, 500); // 左滑
                        lastLeftObj && lastLeftObj != pressedObj &&
                        $(lastLeftObj).animate({marginLeft:"0"}, 500); // 已经左滑状态的按钮右滑
                        lastLeftObj = pressedObj; // 记录上一个左滑的对象
                    } else if (diffX > 30) {
                        if (pressedObj == lastLeftObj) {
                            $(pressedObj).animate({marginLeft:"0"}, 500); // 右滑
                            lastLeftObj = null; // 清空上一个左滑的对象
                        }
                    }
                });
            }

        });

        // 跳转提单页面
        $(".toorder").click(function(){
            //记录用户填写的资料
            var uname = $('#name').val();
            var uphone = $('#phone').val();
            var wxphone = $('#wxphone').val();
            var formlist = {
                uname: uname,
                uphone: uphone,
                wxphone: wxphone
            }
            Utils.storage.set('formlist', formlist); //缓存form内容
            if (uname=="" && uphone=="" && wxphone == "") {
                aid.alert.show('提示：请填写个人信息~');
            }else if(uname==""){
                aid.alert.show('提示：请填写姓名~');
            }else if(uphone==""){
                aid.alert.show('提示：请填写手机号码~');
            }else if(wxphone == ""){
                aid.alert.show('提示：请填写微信号~');
            }

            var ppp=document.querySelector("#price")
            var ss=ppp.innerHTML//总价钱

            var paramsall = Utils.storage.get('paramsinit');
            var ordername =document.querySelectorAll('#ordername');
            var iconpic =document.querySelectorAll('#icon');
            var totalprice=document.querySelectorAll('.totalprice');
            var countsum=document.querySelectorAll('#countsum');

            var arrname=[];
            var iconpicall=[];
            var cartIds=[];
            var counts=[];
            var price=[];

            for(var i=0;i<ordername.length;i++){
                arrname.push(ordername[i].innerHTML)
            }
            for(var i=0;i<iconpic.length;i++){
                iconpicall.push(iconpic[i].currentSrc);
                cartIds.push(iconpic[i].dataset.cartid);
            }
            for(var i=0;i<countsum.length;i++){
                counts.push(countsum[i].innerHTML)
            }
            for(var i=0;i<totalprice.length;i++){
                price.push(totalprice[i].innerHTML)
            }
            console.log(cartIds)//cartId集合数组

            var arraycount=[]
            for(var i=0;i<arrname.length;i++){
                arraycount.push(arrname[i],iconpicall[i],counts[i],price[i])
            }
            console.log(arraycount)

            var orderparams = new Object();
            orderparams = {
                patientid: paramsall.patientid,
                name: uname,
                mobile: uphone,
                wxphone: wxphone,
                servicenameother:arraycount,//商品列表
                returnurl: location.href,
                business: 'market',
                ordercount:ss,//总价钱
                logisticstatus:2,
                cartIds:cartIds
            };
            location.href = "/static/newbuycontent/pay/order.html?patientid=" + orderparams.patientid + "&servicenameother=" +
                orderparams.servicenameother + '&name=' + orderparams.name + "&mobile=" + orderparams.mobile + "&wxphone=" + orderparams.wxphone + '&totalfee=' +
                orderparams.ordercount + '&patientid=' + orderparams.patientid  +
                '&business=' + orderparams.business + '&returnurl=' + orderparams.returnurl+"&logisticstatus="+orderparams.logisticstatus+"&cartIds="+orderparams.cartIds;

        })

    })
}




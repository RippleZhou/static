/**
 * Created by rvM on 2016/11/9.
 */
!(function (window, $) {
    var clock = window.clock = {};
    clock.book = function () {
        var id = User.getUser().patientid;
        alert(id);
    }
    //图片放大预览
    clock.imgEnlarge = function (element) {
            var div = document.createElement('div'), img = document.createElement('img');
            div.className = 'pre_big_img_box pre_big';
            img.className = 'pre_big_img pre_big';
            var imgstyle = {
                width: '100%',
                maxWidth: '480px',
                display: 'none',
                position: 'fixed',
                margin: 'auto',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0'
            }, divstyle = {
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: '0',
                left: '0',
                background: '#000',
                opacity: '0.6'
            }
            img.onclick = div.onclick = function () {
                $('.pre_big_img_box').remove();
                $('.pre_big_img').remove();
            }
            for (var styleA in imgstyle) {
                img.style[styleA] = imgstyle[styleA];
            }
            for (var styleB in divstyle) {
                div.style[styleB] = divstyle[styleB];
            }
            img.src = element.attr('src');
            $('body').append(div).append(img);
            $('.pre_big_img').fadeIn(1000);
    }


    //storage set
    clock.setstorage = function (key,val) {
        try {
            var data = window.JSON.stringify(val);
        }
        catch (ex) {
        }
        window.localStorage.setItem(key,data);
    }
    //storage get and clear this
    clock.getstorageOnce = function (key) {
        try {
            var data = window.JSON.parse(window.localStorage.getItem(key));
            window.localStorage.removeItem(key);
            return data;
        }
        catch (ex) {
        }
    }
    //storage get
    clock.getstorage = function (key) {
        try {
             var data = window.JSON.parse(window.localStorage.getItem(key));
             return data;
        }
        catch (ex) {
        }
    }
})(window, $);
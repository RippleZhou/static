(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
})(jQuery);

function loadURL(url) {
    var iFrame = document.createElement("iFrame");
    iFrame.setAttribute("src", url);
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
};

var ajax_url = "/IbabyWebService/3";

var Toast = function(config) {
    this.context = config.context == null ? $('body') : config.context; //上下文  
    this.message = config.message; //显示内容  
    this.time = config.time == null ? 2000 : config.time; //持续时间  
    this.left = config.left; //距容器左边的距离  
    this.top = config.top; //距容器上方的距离  
    this.init();
}
var msgEntity;
Toast.prototype = {
    //初始化显示的位置内容等  
    init: function() {
        $("#toastMessage").remove();
        //设置消息体  
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span>' + this.message + '</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //设置消息样式  
        var left = this.left == null ? this.context.width() / 2 - msgEntity.find('span').width() / 2 : this.left;
        var top = this.top == null ? '100px' : this.top;
        msgEntity.css({
            position: 'absolute',
            top: top,
            'z-index': '9999',
            left: left,
            'background-color': 'black',
            color: 'white',
            'font-size': '12px',
            padding: '10px',
            margin: '10px',
            'border-radius': '4px',
        });
        msgEntity.hide();
    },
    //显示动画  
    show: function() {
        msgEntity.fadeIn(this.time / 2);
        setTimeout("msgEntity.fadeOut(1000)", 2000)
            // msgEntity.fadeOut(this.time/4);  
    }
}

Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var base_data = {
        "100001": {
            "name": "减压引导",
            "background": "class1-background.jpg",
            "information": "爱丁i-MLP备孕心灵课程，让我们从减压开始，迎接一段全程好孕。",
            "audio_or_video": "http://7xqenb.com1.z0.glb.clouddn.com/CLS100001.mp3",
            "share_img": "class1-share.jpg",
            "share_link": "http://ibaby-plan.org:8180/static/onlineclass/init_online_class.html",
        },
        "100002": {
            "name": "拥抱正能量",
            "background": "class2-background.jpg",
            "information": "爱丁i-MLP备孕心灵课程，缓解备孕期女性心灵压力，拥抱正能量，在课程引导中，为优孕提供心灵力量。",
            "audio_or_video": "http://7xqenb.com1.z0.glb.clouddn.com/CLS100001.mp3",
            "share_img": "class1-share.jpg",
        },
        "100003": {
            "name": "自我接纳",
            "background": "class3-background.jpg",
            "information": "爱丁i-MLP备孕心灵课程，缓解备孕期女性心灵压力，通过自我接纳，为优孕提供心灵力量。",
            "audio_or_video": "http://7xqenb.com1.z0.glb.clouddn.com/CLS100001.mp3",
            "share_img": "class1-share.jpg",
        },
        "100004": {
            "name": "减压引导",
            "background": "class4-background.jpg",
            "information": "爱丁i-MLP备孕心灵课程，让我们从减压开始，迎接一段全程好孕。",
            "audio_or_video": "http://7xqenb.com1.z0.glb.clouddn.com/CLS100001.mp3",
            "share_img": "class1-share.jpg",
        },
        "100005": {
            "name": "减压引导",
            "background": "class5-background.jpg",
            "information": "爱丁i-MLP备孕心灵课程，让我们从减压开始，迎接一段全程好孕。",
            "audio_or_video": "http://7xqenb.com1.z0.glb.clouddn.com/CLS100001.mp3",
            "share_img": "class1-share.jpg",
        }
    }
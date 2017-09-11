!(function(window){
    var http = window.HTTP = new Object();
    //http_get
    http.get = function(url,callback,element) {
        var xmlHttp = http.getxmlhttp();
        if (callback)
            http.callback(callback,element);
        xmlHttp.open("GET",url,true);
        setTimeout('http.checkstatus()',10000);
        xmlHttp.send();
    }

    //http_post
    http.post = function(url,params,callback,element){
        var xmlHttp = http.getxmlhttp();
        if (callback) {
            http.callback(callback,element);
        }
        xmlHttp.open("POST", url, true);
        xmlHttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        //post方式，如果无参，则传null
        if (params) {
            var str ='';
            for ( var item in params) {
               if (str=='') {
                   str = str + item + '=' + params[item];
               } else {
                   str = str + '&' + item + '=' + params[item];
               }
            }
            xmlHttp.send( str);
        } else {
            xmlHttp.send(null);
        }
    };

    //xml_http
    http.getxmlhttp = function () {
        var xmlHttp = null;

        try {
            // Firefox, Opera 8.0+, Safari
            xmlHttp = new XMLHttpRequest();
        } catch (e) {
            // Internet Explorer
            try {
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }

        //check_http 检测浏览器对http请求的支持情况
        if ( xmlHttp == null ) {
            alert ("Browser does not support HTTP Request");
            return;
        }

        //xml_http -> callback   数据请求,回调函数
        var load =  dom.create('h1','Loadding...')
        load.id = "load" + Math.random();
        var loadstyle = { textAlign : 'center', color : '#999', fontSize : '12px', lineHeight : '30px'}
        dom.addstyle(load,loadstyle);
        http.callback = function (callback,element) {
            xmlHttp.onreadystatechange=function() {
                if (xmlHttp.readyState == 1) {
                    if (element) {
                        element.appendChild(load);
                    } else {
                        var loadstyle = { position : 'fixed', top : '0', bottom : '0', width : '100%', margin : 'auto', height : '30px'}
                        dom.addstyle(load,loadstyle);
                        document.body.appendChild(load);
                    }
                }
                //请求成功后执行回调函数
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    try {
                        callback(JSON.parse(xmlHttp.responseText));
                    } catch (e) {
                        console.log(e);
                    }
                    try {
                        var ele = document.getElementById(load.id);
                        ele.parentNode.removeChild(ele);
                    } catch (e) {
                    }
                }
            }
        }
        //check_status  请求超时处理
        http.checkstatus = function () {
            if( xmlHttp.readyState != 4 ) {
                xmlHttp.abort();
                alert('连接超时被中断');
            }
        }
        return xmlHttp
    }

    // create dom
    var dom = window.dom = new Object();
    dom.create = function (tagname,textnode) {
        var tag = document.createElement(tagname);
        if (textnode) {
            tag.appendChild(document.createTextNode(textnode));
        }
        return tag;
    }
    dom.addstyle = function (tag,params) {
        if (typeof (params) == "object") {
            for ( var i in params) {
                try {
                    tag.style[i] = params[i];
                    tag[i] = params[i];
                } catch (e) {
                }

            }
        } else {
            console.log('this style must be object');
        }
    }


})(window);
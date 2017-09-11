/**
 * Created by rvM on 16/9/19.
 */
/**
 * diy弹窗提示
 * 样式更改,请于css中寻找#layer
 * text即弹窗显示内容
 */
var layer = document.createElement("div");
layer.id = "layer";
var layerbox = document.createElement("div");
layerbox.id = "layerbox";
function diyalert(text, time) {
    if (document.getElementById("layer") == null) {
        document.body.appendChild(layer);
        document.body.appendChild(layerbox);
        var styleA = {
            position: 'fixed',
            textAlign: 'center',
            color: '#fff',
            fontSize: '14px',
            zIndex: '10',
            width: '250px',
            lineHeight: '24px',
            padding: '10px 20px',
            background: '#333',
            margin: 'auto',
            top: '200px',
            left: '0',
            right: '0',
            boxShadow: '0 0 5px 0 #fff'
        }
        var styleB = {
            position: 'fixed',
            width: '100%',
            height: '100%',
            background: '#333',
            opacity: '0.6',
            zIndex: '2',
            top: '0'
        }
        for (var i in styleA)
            layer.style[i] = styleA[i];
        for (var i in styleB)
            layerbox.style[i] = styleB[i];
        layer.innerHTML = text;
        if (time) {
            setTimeout("document.body.removeChild(layerbox);document.body.removeChild(layer)", time);
        }
    }
}
/**
 * location.search后的参数分开
 * getparam(name),即获得name对应的参数值
 */
function getparam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}
/*
 * 表单验证
 */
var input_check = {
    emptyText: '填写完全部信息,再提交~',
    check: function (str, text, reg) {
        if (str) {
            return (!(reg.test(str)) ? (diyalert(text, 1000)) : true);
        } else {
            diyalert(input_check.emptyText, 1000);
            return false;
        }
    },
    //只能输入汉字
    name: function (str, text) {
        var text = text ? text : '请输入正确的姓名!';
        var reg = /^[\u4e00-\u9fa5]{1,}$/;
        return input_check.check(str, text, reg);
    },
    phone: function (str, text) {
        text = text ? text : '手机号码有误,请重新输入!';
        var reg = /^1[3|4|5|7|8]\d{9}$/;
        return input_check.check(str, text, reg);
    },
    //只能输入数字、字母、下划线,且必须字母开头
    password: function (str, text) {
        var reg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        text = text ? text : '密码有误';
        return input_check.check(str, text, reg);
    },
    qqNum: function (str, text) {
        text = text ? text : 'QQ号码有误,请重新输入!';
        var reg = /[1-9]\d{4,}/;
        return input_check.check(str, text, reg);
    },
    email: function (str, text) {
        text = text ? text : '邮箱的格式不对~';
        var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
        return input_check.check(str, text, reg);
    },
    null: function (str, text) {
        text = text ? text : '请输入内容';
        if (str && str != '') {
            return true;
        } else {
            diyalert(text, 1000);
            return false;
        }
    }
}
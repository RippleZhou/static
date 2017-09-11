var Utils = window.Utils, User = window.User, ua = window.navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) != 'micromessenger') {
    document.body.innerHTML = '请在微信中打开此页面，谢谢配合！';
} else {
    if (!User.getUser()) {
        User.innerlogin();
    } else {
        loginSuccessThenDo();
    }
}

function  loginSuccessThenDo() {
    var userinfor = User.getUser();
    var html = template('main',userinfor);
    document.body.innerHTML = html;
}
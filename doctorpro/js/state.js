/**
 * Created by rvM on 16/9/21.
 */
/**
 * 检测登陆状态
 * 如果不是登陆状态,跳转登陆页面
 * 并不是所有页面都需要,如修改密码、注册页面
 */
var baseInfor = window.localStorage.getItem('baseInfor');
if (!baseInfor){
    location.href = 'login.html';
}
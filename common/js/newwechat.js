/**
 * Created by rvM on 2017/4/12.
 */
//新的微信
!(function (window, $) {
    var utils = window.Utils;
    var newWechat = window.NewWechat = {};

    var data =  {
        author: {
            appid: 'wx4adefaa3ed78a2ba',
            redirect_uri: 'http%3a%2f%2fdev.ibaby-plan.org%2faiding-web%2fapi%2fweLogin'
        }
    }
    newWechat.author = function () {
        if (!utils.queryParams.openid){
            utils.storage.set('urlParam',utils.queryParams); //把授权之前页面的参数暂时保存起来
            var state = location.href.split('?')[0];
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?'
                + 'appid=' + data.author.appid
                + '&redirect_uri=' + data.author.redirect_uri
                + '&response_type=code'
                + '&scope=snsapi_userinfo'
                + '&state=' + state
                + '#wechat_redirect'
        } else {
            var urlparams = utils.storage.get('urlParam'); //授权之前的参数
            if (urlparams) {
                var url_end = '';
                for ( var  key in urlparams ) {
                    // url_end = '&' + url_end + key + '=' + urlparams[key];拼接错得
                    url_end = url_end +'&' + key + '=' + urlparams[key];
                }
                utils.storage.remove('urlParam'); //清除缓存
                location.replace(location.href + url_end);
            }
        }
    }
})(window, $);
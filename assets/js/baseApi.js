
// 开发环境服务器地址
var baseUrl = "http://ajax.frontend.itheima.net";
//拦截所有ajax请求 post/get/ajax  处理参数
$.ajaxPrefilter(function (params) {
    // 拼接对应环境服务器地址
    params.url = baseUrl + params.url;
    // 对需要权限的接口配置头信息
    // 必须以my开头才行
    if (params.url.indexOf("/my/") !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token") || ""
        }
    };
    // 拦截所有响应,判断身份认证信息
    params.complete = function (res) {
        console.log(res.responseJSON);
        var obj = res.responseJSON;  
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            // 清除缓存的token
            localStorage.removeItem("token");
            // 页面跳转
            location.href = "/login.html";
        }
    }
})
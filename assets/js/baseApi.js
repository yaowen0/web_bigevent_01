
// 开发环境服务器地址
var baseUrl = "http://ajax.frontend.itheima.net";
//拦截所有ajax请求 post/get/ajax  处理参数
$.ajaxPrefilter(function (params) {
    // 拼接对应环境服务器地址
    params.url = baseUrl + params.url;
})
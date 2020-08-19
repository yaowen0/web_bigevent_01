$(function () {
    getUserInof();
    $("#btnLogout").on('click', function () {
        //eg1
        var layer = layui.layer;
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 清除缓存的token
            localStorage.removeItem("token");
            // 页面跳转
            location.href = "/login.html";
            layer.close(index);
        });
    })
});
// 全局函数 后面其他页面也要用
function getUserInof() {
    // 发送ajax
    $.ajax({
        url: "/my/userinfo",
        // headers: {
        //     // 重新登录,因为token12小时过期
        //     Authorization: localStorage.getItem("token") || ""
        // },
        success: function (res) {
            // 判断状态码
            if (res.status != 0) {
                return layui.layer.msg(res.massage)
            }
            renderAvatar(res.data);
        }
    })
};
// 封装用户头像渲染函数
function renderAvatar(user) {
    // 用户名(昵称优先,没有用username)
    var name = user.nickname || user.username;
    $('#welcome').html("欢迎&nbsp;&nbsp;" + name);
    // 用户头像
    if (user.user_pic !== null) {
        // 有头像的情况:
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".user-avatar").hide();
    }
    else {
        // 没有头像的情况:
        $(".layui-nav-img").hide();
        // 取name的首字 大写 添加进span user-avatar
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text);
    }
}
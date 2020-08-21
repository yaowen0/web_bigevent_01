$(function () {
    var form = layui.form;
    form.verify({
        // 自定义nickname 昵称验证
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为 1~6位之间!"
            }
        }
    });
    // 用户渲染
    initUserInfo();
    // 导出layer
    var layer = layui.layer;
    // 封装函数获取更新后台数据
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    // 未成功 layer.msg 原因
                    return layer.msg(res.massage)
                }
                // 成功后渲染 把res.data的数据 添加到formUserInfo上
                form.val("formUserInfo", res.data)
            }
        })
    }
    // 点击重置事件
    $("#btnReset").on("click", function (e) {
        // 阻止默认重置
        e.preventDefault();
        // 重新渲染 获取后台数据
        initUserInfo()
    })
    $(".layui-form").on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                // 成功
                layer.msg("恭喜您,修改用户信息成功");
                // 调用父框架全局方法
                window.parent.getUserInof()
            }
        })
    })
})
// 鼠标点击a 切换登录 注册页面
$(function () {
    $("#link_reg").on("click", function () {
        $('.login_box').hide();
        $(".reg_box").show()
    })
    $("#link_login").on("click", function () {
        $('.login_box').show();
        $(".reg_box").hide()
    })
    // 自定义规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, "密码必须6-16位,且不能输入空格"
        ],
        repwd: function (value) {
            var pwd = $(".reg_box [name = password]").val();
            if (pwd !== value) {
                return "两次密码输入不一致!"
            }
        }
    })
    var layer = layui.layer;
    // 监听注册表单
    $("#form_reg").on("submit", function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "post",
            url: "/api/reguser",
            data: {
                username: $(".reg_box [name=username]").val(),
                password: $(".reg_box [name=password]").val(),

            },
            success: function (res) {
                // 返回状态判断
                if (res.status !== 0) return layer.msg(res.message)
                // 提交成功后处理代码
                layer.msg("注册成功,请登录");
                // 手动切换到登录表单
                $('#link_login').click();
                // 重置form表单
                $("#form_reg")[0].reset()
            }
        })
    })
    // 登录表单
    $("#form_login").submit(function (e) {
        // 阻止表单提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "post",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                // 检验返回状态
                if (res.status !== 0) {
                   return layer.msg(res.message);
                }
                // 提示信息,保存token
                layer.msg("恭喜您,登录成功");
                localStorage.setItem("token", res.token);
                // 跳转
                location.href="/index.html"
            }

        })
    })
})
$(function () {
    // 自定义规则
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, "密码必须6-16位,且不能输入空格"
        ],
        repwd: function (value) {
            if ($("[name=newPwd]").val() !== value) {
                return "两次新密码输入不一致!"
            }
        },
        samepwd: function (value) {
            if ($("[name=oldPwd]").val() == value) {
                return "原密码和新密码不能相同!"
            }
        },
    })
    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.massage)
                }
                layui.layer.msg("修改密码成功!");
                $('.layui-form')[0].reset();
            }
        })
    })
})
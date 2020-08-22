$(function () {
    // 设置表单信息
    // 用=切割取后面的值 为id
    function initForm() {
        var id = location.search.split("=")[1];
        $.ajax({
            method: "get",
            url: "/my/article/" + id,
            success: function (res) {
                // 失败判断
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染到form表单中
                form.val("form-edit", res.data);
                tinyMCE.activeEditor.setContent(res.data.content);
                // 图片
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传封面")
                }
                var newImgURL = baseUrl + res.data.cover_img;
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区
            }
        })
    }





    var layer = layui.layer;
    var form = layui.form;
    // 调用
    initCate();
    // 封装
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("res.message")
                }
                // 赋值
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render()
                // 文章分类渲染完毕再调用,初始化form的方法
                initForm()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 点击上传图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click()
    })
    // 设置图片
    $("#coverFile").on("change", function (e) {
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 非空校验
        // if (file.length === undefined) {
        //     return
        // }
        // 根据选择的文件 创建一个对应的url地址
        var newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区
    })
    // 设置状态 点击情况
    var state;
    $("#btnSave1").on("click", function () {
        state = "已发布"
        // $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        //         width: 400,
        //         height: 280
        //     })
        //     .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        //         // 得到文件对象后，进行后续的操作
        //     })
    })
    $("#btnSave2").on("click", function () {
        state = "草稿"
    })
    // 添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(this);
        fd.append("state", state);
        $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append("cover_img", blob);
                publishArticle(fd)
            })
    })
    function publishArticle(fd) {
        $.ajax({
            method: "post",
            url: "/my/article/edit",
            data: fd,
            // FormData类型数据ajax提交 需要设置2个false
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 跳转
                layer.msg("恭喜你,修改文章成功")
                setTimeout(function () {
                    window.parent.document.getElementById("art_list").click()
                }, 1500)
            }
        })
    }
})
$(function () {
    var layer = layui.layer
    initArtCateList()
    // 1.封装文章类别渲染
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                var htmlStr = template('tpl-art-cate', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    //2.点击添加文章分类列表
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        //编辑弹出层
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-add').html(),
        });
    })
    //3.通过代理事件为form提交表单
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // alert($(this).serialize())
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message)
                }
                initArtCateList()
                layer.msg('恭喜您，添加成功')
                layer.close(indexAdd)
            }
        })
    })
    // 4.修改
    var idnexEdit = null
    var form = layui.form
    $('body').on('click', '.btn-edit', function (e) {
        // 4.1利用框架代码，显示提示添加文章类别
        idnexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $('#dialog-edit').html(),
        });
        // 4.2获取id发送ajax数据，渲染到页面
        var id = $(this).attr('data-id')
        // console.log(id);
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data)
            }
        })
    })
    //5.提交修改后的ajax数据，渲染到页面
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您，更新成功')
                initArtCateList()
                layer.close(idnexEdit)
            }
        })
    })
    var form = layui.form
    $('tbody').on('click', '.btn-delete', function () {
        // 4.2获取id发送ajax数据，渲染到页面
        var id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('是否确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg("恭喜你,文章类别删除成功")
                    layer.close(index);
                }
            })
        });
    })
})
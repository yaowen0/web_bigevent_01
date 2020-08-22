$(function () {
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss

    }
    function padZero(res) {
        return res > 9 ? res : "0" + res
    }
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                var str = template("tpl-table", res);
                $('tbody').html(str);
                renderPage(res.total)
            }
        })
    }
    var form = layui.form;
    initCata();
    function initCata() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取分类数据失败")
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render()
            }
        })
    }
    // 为筛选表单添加submit事件
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        var cate_id = $("[name=cate_id]").val();
        var state = $("[name=state]").val();
        q.cate_id = cate_id;
        q.state = state;
        initTable()

    })
    var laypage = layui.laypage;
    // 定义渲染分页
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox',//注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置被选中的分页
            // 分页模块设置,显示哪些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],//每页显示多少条数据的选择器
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        });
    }
    // 删除
    var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function () {
        var Id = $(this).attr("data-id");
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "get",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜你,删除成功");
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})
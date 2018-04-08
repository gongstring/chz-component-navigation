$(function(){

    // init date tables
    var confTable = $("#group_list").dataTable({
        "deferRender": true,
        "processing" : true,
        "serverSide": true,
        "searching": false,
        "ordering": false,
        "iDisplayLength":10,
        //"scrollX": true,	// X轴滚动条，取消自适应
        "columns": [
            { "data": 'id', "visible" : true},
            { "data": 'groupCode', "visible" : true},
            { "data": 'groupName', "visible" : true},
            { "data": 'remark', "visible" : true},
            { "data": '操作' ,
                "render": function ( data, type, row ) {
                    return function(){
                        // html
                        var html = '<p id="'+ row.id +'" '+
                            ' groupCode="'+ row.groupCode +'" '+
                            ' groupName="'+ row.groupName +'" '+
                            ' remark="'+ row.remark +'" '+
                            '>'+
                            '<button class="btn btn-warning btn-xs update" type="button">编辑</button>  '+
                            '<button class="btn btn-danger btn-xs delete" type="button">删除</button>  '+
                            '</p>';

                        return html;
                    };
                }
            }
        ],
        "language" : {
            "sProcessing" : "处理中...",
            "sLengthMenu" : "每页 _MENU_ 条记录",
            "sZeroRecords" : "没有匹配结果",
            "sInfo" : "第 _PAGE_ 页 ( 总共  _TOTAL_ 条记录 )",
            "sInfoEmpty" : "无记录",
            "sInfoFiltered" : "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix" : "",
            "sSearch" : "搜索:",
            "sUrl" : "",
            "sEmptyTable" : "表中数据为空",
            "sLoadingRecords" : "载入中...",
            "sInfoThousands" : ",",
            "oPaginate" : {
                "sFirst" : "首页",
                "sPrevious" : "上页",
                "sNext" : "下页",
                "sLast" : "末页"
            },
            "oAria" : {
                "sSortAscending" : ": 以升序排列此列",
                "sSortDescending" : ": 以降序排列此列"
            }
        },
        "fnServerData":function(sSource, aoData, fnCallback, oSettings){

            var obj = {};
            var customDatas = {};
            customDatas.txtKey = $('#txtKey').val();
            obj.customDatas = customDatas;

            var page = {};
            page.pageNo = oSettings._iDisplayStart/oSettings._iDisplayLength + 1;
            page.pageSize = oSettings._iDisplayLength;
            obj.page = page;

            oSettings.jqXHR = $.ajax({
                url: ctxPath + "/apiConfig/group/list",
                type:"post",
                contentType : 'application/json;charset=utf-8',
                dataType: "json",
                data : JSON.stringify(obj),
                success: function(json){
                    var pageJson = {};

                    pageJson.sEcho = oSettings.sEcho +1;//操作+1，页面刷新用
                    if(json.data != null && json.data.length > 0){
                        pageJson.data = json.data;
                    }else{
                        pageJson.data = {};
                    }
                    pageJson.recordsTotal = json.page.totalCount;//总记录数
                    pageJson.recordsFiltered = json.page.totalCount;//总记录数
                    pageJson.draw = json.page.pageNo;
                    fnCallback(pageJson);
                }
            });
        }
    });

    $("#searchBtn").click(function(){
        confTable.fnDraw();
    });

    $("#group_list").on('click', '.tecTips',function() {
        var tips = $(this).attr("tips");
        ComAlertTec.show(tips);
    });

    // 删除
    $("#group_list").on('click', '.delete',function() {
        var id = $(this).parent('p').attr("id");
        var groupName = $(this).parent('p').attr("groupName");
        ComConfirm.show("确定要删除：" + groupName, function(){
            $.get(
                ctxPath + "/apiConfig/group/del/"+id,
                function(data, status) {
                    if (data.code == "1") {
                        ComAlert.show(1, "删除成功", function(){
                            confTable.fnDraw();
                        });
                    } else {
                        ComAlert.show(2, data.msg);
                    }
                }
            );
        });
    });

    // jquery.validate 自定义校验 “英文字母开头，只含有英文字母、数字和下划线”
    jQuery.validator.addMethod("myValid01", function(value, element) {
        var length = value.length;
        var valid = /^[a-z][a-z0-9_]*$/;
        return this.optional(element) || valid.test(value);
    }, "KEY只能由小写字母、数字和.组成,须以小写字母开头");

    // 新增
    $("#add").click(function(){
        $('#addModal').modal('show');
    });
    var addModalValidate = $("#addModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            groupCode : {
                required : true ,
                minlength: 4,
                maxlength: 100,
                myValid01: true
            },
            groupName : {
                required : true
            },
            remark : {
                required : false
            }
        },
        messages : {
            groupCode : {
                required :'请输入"环境编码".'  ,
                minlength:'"编码"不应低于4位',
                maxlength:'"编码"不应超过100位'
            },
            groupName : {	},
            remark : {	}
        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {
            var data = {};
            data.groupCode = $("#addModal").find("input[name='groupCode']").val();
            data.groupName = $("#addModal").find("input[name='groupName']").val();
            data.remark = $("#addModal").find("textarea[name='remark']").val();

            $.ajax({
                type: 'POST',
                url: ctxPath + "/apiConfig/group/create",
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(json) {
                    if (json.code == "1") {
                        ComAlert.show(1, "新增成功", function(){
                            confTable.fnDraw();
                            $('#addModal').modal('hide');
                        });
                    } else {
                        ComAlert.show(2, json.msg);
                    }
                }
            });
        }
    });
    $("#addModal").on('hide.bs.modal', function () {
        $("#addModal .form")[0].reset()
    });

    // 更新
    $("#group_list").on('click', '.update',function() {

        $("#updateModal .form input[name='id']").val( $(this).parent('p').attr("id") );
        $("#updateModal .form input[name='groupCode']").val( $(this).parent('p').attr("groupCode") );
        $("#updateModal .form input[name='groupName']").val( $(this).parent('p').attr("groupName") );
        $("#updateModal .form textarea[name='remark']").val( $(this).parent('p').attr("remark") );

        $('#updateModal').modal('show');
    });
    var updateModalValidate = $("#updateModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            groupCode : {
                required : true ,
                minlength: 4,
                maxlength: 100
            },
            groupName : {
                required : true
            },
            remark : {
                required : false
            }
        },
        messages : {
            groupCode : {
                required :'请输入"编码".'  ,
                minlength:'"编码"不应低于4位',
                maxlength:'"编码"不应超过100位'
            },
            groupName : {	},
            remark : {	}
        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {

            var data = {};
            data.groupCode = $("#updateModal").find("input[name='groupCode']").val();
            data.groupName = $("#updateModal").find("input[name='groupName']").val();
            data.remark = $("#updateModal").find("textarea[name='remark']").val();

            $.ajax({
                type: 'POST',
                url: ctxPath + "/apiConfig/group/modify/"+$("#updateModal").find("input[name='id']").val(),
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function(json) {
                    if (json.code == "1") {
                        ComAlert.show(1, "修改成功", function(){
                            confTable.fnDraw();
                            $('#updateModal').modal('hide');
                        });
                    } else {
                        ComAlert.show(2, json.msg);
                    }
                }
            });
        }
    });
    $("#updateModal").on('hide.bs.modal', function () {
        $("#updateModal .form")[0].reset()
    });

});
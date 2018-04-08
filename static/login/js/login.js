
$().ready(function(){
    if(top.location!=self.location)
        top.location = self.location;
    removeAccessToken();

    $("#lg-submit").on("click",function(){
        login();
    });
    document.onkeydown = function(e){
        var ev = document.all ? window.event : e;
        if(ev.keyCode==13) {
            login();
        }
    };
});
function login(){
    $("#errorMsg").hide();
    var params = {};
    params.username = $("#loginName").val();
    params.passwd =  $("#loginPwd").val();
    var datas = new reqBean(params);
    ajaxInfo(ctxPath + "/apiUser/auth/doLogin","user",JSON.stringify(datas),loginSuccess);
}

function loginSuccess(json){
    //处理登录成功
    if(json.code == "1"){
        if(json.data.token != null)
            setAccessToken(json.data.token);

        if(json.data.callback != null)
            location.href=json.data.callback;
        else
            location.href = appDatas.mainUrl;
    }else{
        $("#errorMsg").show();
        $("#errorMsg").html("登录失败："+json.msg);
        return;
    }

}
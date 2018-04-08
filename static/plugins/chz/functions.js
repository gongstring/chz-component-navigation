var appDatas = {};
appDatas.accessToken = "accessToken";
appDatas.doLoginUrl=ctxPath + "/apiUser/auth/doLogin";
appDatas.logOutUrl=ctxPath + "/apiUser/auth/logOut";
appDatas.loginUrl="/login.html";
appDatas.mainUrl="/main.html";
appDatas.userSource = "user";

function ajaxAsyncInfo(url,source,datas,isAsync,successFun){
    if(isAsync == null)
        isAsync = true;

    var accessToken = getAccessToken();
    $.ajax({
        type: 'POST',
        url: url,
        async:isAsync,
        beforeSend: function(xhr){
            xhr.setRequestHeader('source', source);
            if(accessToken != null)
                xhr.setRequestHeader(appDatas.accessToken, accessToken);
        },
        contentType: "application/json",
        data: datas,
        success: function(json) {
            if(json.code == "3"){
                logOut();//尚未登录
            }

            if(successFun != null)
                successFun(json);
        }
    });
}

/**token信息
 * 获取
 * @returns {*}
 */
function getAccessToken(){
    return $.cookie(appDatas.accessToken);
}

/**
 * 设置token信息
 * @param token
 */
function setAccessToken(token){
    $.cookie(appDatas.accessToken, token , { expires: 2 });
}

/**
 * 清空登陆信息
 */
function removeAccessToken(){
    var accessToken = getAccessToken();
    if(accessToken != null)
        ajaxAsyncInfo(appDatas.logOutUrl,appDatas.userSource,"",true,null);//提交退出登陆请求
    $.cookie(appDatas.accessToken,'', { expires: -1 });
}

/**
 * 退出登陆
 */
function logOut(){
    removeAccessToken();
    location.href=appDatas.loginUrl;
}

/**
 * 发送ajax请求（异步）
 * @param url
 * @param source
 * @param datas
 * @param successFun
 */
function ajaxInfo(url,source,datas,successFun){
    ajaxAsyncInfo(url,source,datas,true,successFun);
}

function reqBean(pageNo,pageSize,datas){
    var page = {};
    page.pageNo = pageNo;
    page.pageSize = pageSize;
    this.page = page;
    this.datas = datas;

}

function reqBean(datas){
    this.datas = datas;
}
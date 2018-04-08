/**
 * Created by qianbi on 2018/1/29.
 */
$(document).ready(function(){
    loadcontent("/config/profile.html",$("a.loadfirst"));
    
});
function loadcontent(fileurl,e){
    $(".content-wrapper").load(fileurl);
    $("li.treeview").removeClass("active");
    $("ul.treeview-menu li").removeClass("active");
    $(e).parent().addClass("active");
    $(e).parents("li.treeview").addClass("active");

    // var this_page = $(e).text().trim();
    // switch (this_page){
    //     case "运行环境" :{
    //        
    //     }
    // }
}
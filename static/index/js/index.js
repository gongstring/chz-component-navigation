/**
 * Created by qianbi on 2018/1/25.
 */
$(document).ready(function(){
    $(".in-content-item").css("height",$(".in-list-item").length * 100 + "px");
    $(".in-list-item").hover(function () {
        $(".in-list-item").removeClass("active");
        $(this).addClass("active");
    });
    $(".in-list-item").mouseover(function () {
       $(".in-content-item").hide();
        $(".in-content-item").eq($(this).attr("data-tab-id")).show();
    });
});
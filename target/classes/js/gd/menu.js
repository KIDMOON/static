$("#mall_header").load("header.html", function () {
    // 累计开箱等统计过
    $.gdAjax({
        url : "header/stat",
        type : "GET",
        success : function(data) {
            var list = data.result;
            var totalOpenedCounter = list[0];
            var totalUsersCounter = list[1];
            var dropCounter = list[2];
            var onLineCount = list[3];
            if ($.isBlank(onLineCount) || onLineCount == "0") {
                onLineCount = "1";
            }
            $("#total-opened-counter").text(totalOpenedCounter);
            $("#total-users-counter").text(totalUsersCounter);
            $("#drop-counter").text(dropCounter);
            $("#onLineCount").text("（在线人数：" + onLineCount + "）");
        }
    });
});
$("#mall_footer").load("footer.html", function () {
});
$("#mall_popup").load("popup.html", function () {
});
$("#help_menu").load("help000.html", function () {
});
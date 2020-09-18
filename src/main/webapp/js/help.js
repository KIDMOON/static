$("#help_menu>ul>li").click(function () {
	$("#help_menu>ul>li .ivu-menu").hide();
	$(this).find("ul").show();
});
$("#help_menu a").each(function () {
	if (window.location.href.indexOf($(this).attr("href")) != -1) {
		$("#help_menu a").removeClass("ivu-menu-item-active").removeClass("ivu-menu-item-selected");
		$("#help_menu>ul>li>ul").hide();
		$(this).addClass("ivu-menu-item-active").addClass("ivu-menu-item-selected");
		$(this).parent().show();
	}
});
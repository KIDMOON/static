$(function() {
	getContent();
	bindAction()
});
function bindAction() {
	$("#btn-save").on("click", modifyConfigValue)
}
function getContent() {
	$.gdAjax({
		url : "config/list",
		type: "POST",
		success : function(c) {
			initHtmlContent(c)
		}
	})
}
function initHtmlContent(b) {
	var d = "";
	for (var a = 0; a < b.result.length; a++) {
		var c = b.result[a];
		d += "<div class='form-group'>";
		d += "    <lable class='col-sm-4 control-label'>" + c.comment + "：</lable>";
		d += "    <div class='col-sm-7'>";
		d += "        <input type='text' class='form-control' id='"
				+ c.configCode + "' value='" + c.configValue + "'/>";
		d += "    </div>";
		d += " </div>"
	}
	$(".form-horizontal").append(d)
}
function modifyConfigValue() {
	var c = checkConfig();
	if (c) {
		var a = new Object();
		var b = new Array();
		$("#configInputValue").find("input").each(function() {
			var e = new Object();
			var d = $(this).attr("id");
			var f = $(this).val();
			e.configCode = d;
			e.configValue = f;
			b.push(e)
		});
		a.param = b;
		$.gdAjax({
			url : "config/modify",
			type: "POST",
			data : a,
			success : function(d) {
				$.alertSuccess("保存成功！");
			}
		})
	}
}
function checkConfig() {
//	var a = true;
//	$("#configInputValue").find("input").each(function(b, c) {
//		if (!c.value) {
//			a = false
//		}
//	});
//	if (a == false) {
//		$.alertInfo("输入值不能为空！");
//		return
//	}
//	return a
	return true;
};
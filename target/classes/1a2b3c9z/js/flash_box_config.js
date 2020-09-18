var region = new Object();

/**
 * 初始化
 */
$(function() {
	
	// 加载
	getContentList();
	
	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		region.endTimeString = $.trim($("#txt_endTime").val());
		var data = new Object();
		data.pageIndex = 0;
		data.param = region;
		$.gdAjax({
			url   :"region/save",
			data : data,
			type : "POST",
			success : function(data) {
				getContentList();
			}
		});
	});
});

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = 0;
	$.gdAjax({
		url : "region/list",
		type : "POST",
		data : data,
		success : function(data) {
			var list = data.result;
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				if (entity.field02 == "7") {
					region = entity;
					if (!$.isBlank(entity.endTime)) {
						$("#txt_endTime").val(new Date(entity.endTime).Format("YYYY-MM-DD HH"));
					}
				}
			}
		}
	});
}
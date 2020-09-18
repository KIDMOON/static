/**
 * 初始化
 */
$(function() {
	
	// 新增
	$("#add_btn").click(function () {
		saveNewModal();
	});

	// 新增保存
	$("#modal_add_btn").click(function () {
		saveOrUpdateInfo(null);
	});
	
	// 修改保存
	$("#modal_edit_btn").click(function () {
		saveOrUpdateInfo($("#hid_editId").val());
	});

	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});

	//上传图片
	$("#btn-pictureSave, #btn-pictureUpdate").click(function() {
		var that = this;
		$.uploadImage({
			success: function(result) {
				uploadImageAfter(that, result);
			}
		})
	});
});

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	var notice = new Object();
	notice.noticeContent = $.trim($("#text_noticeContent").val());
	data.param = notice;
	$.gdAjax({
		url : "notice/list",
		data : data,
		type : "POST",
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 加载table内容
 */
function initHtmlData(data) {
	$(".table-bordered>tbody").html("");
	var htmlContent = "";
	for (var i in data.result) {
		var info = data.result[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;' >" + (info.noticeTitle == null ? "" : info.noticeTitle) + "</td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += (info.field01 == null ? "" : ("<img style='height: 180px;' src='" + info.field01 + "'><br>"));
		htmlContent += (info.noticeContent == null ? "" : info.noticeContent);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td>" + 
		               "        <a href='#' onclick=\"editInfo('" + info.noticeId + "')\">编辑</a> " +
		               "        <a href='#' onclick=\"delInfo('" + info.noticeId + "')\">删除</a>" + 
		               "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
 * 修改
 * @param primaryId
 */
function editInfo(primaryId) {
	$("#hid_editId").val(primaryId);
	$.gdAjax({
		url : "notice/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
					$(".uploadimages").remove();
					$("#btn-pictureSave, #btn-pictureUpdate").show();
                	$("#update_NoticeId").clearTip();
                	$("#update_NoticeId").val(data.result.noticeId);
                	$("#update_NoticeTitle").clearTip();
                	$("#update_NoticeTitle").val(data.result.noticeTitle);
                	$("#update_NoticeContent").clearTip();
                	$("#update_NoticeContent").val(data.result.noticeContent);
					uploadImageAfter($("#btn-pictureUpdate"), data.result.field01);
                }
            });
		}
	});
}

/**
 * 删除
 * @param primaryId
 */
function delInfo(primaryId) {
	Modal.confirm({ message: "确定执行删除操作吗？" }).on(function (isOK) {
		if (isOK) {
			var data = new Object();
			var entity = new Object();
			var ids = new Array();
			ids.push(primaryId);
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			data.param = entity;
			$.gdAjax({
				url   :"notice/del",
				data : data,
				type : "POST",
				success : function(data) {
					initHtmlData(data);
				}
			});
		}
	});
}

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
}

/**
 * 添加模态框
 */
function saveNewModal() {
	Modal.dialog({ 
		modalId: "add_modal", 
		onReady : function () {
            $("#save_NoticeId").clearTip();
            $("#save_NoticeId").val('');
            $("#save_NoticeTitle").clearTip();
            $("#save_NoticeTitle").val('');
            $("#save_NoticeContent").clearTip();
            $("#save_NoticeContent").val('');
			$(".uploadimages").remove();
			$("#btn-pictureSave, #btn-pictureUpdate").show();
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	var entity = new Object();
    entity.noticeId = primaryId;
    
    entity.noticeId = (primaryId == null ? $.trim($("#save_NoticeId").val()) : $.trim($("#update_NoticeId").val()));
    entity.noticeTitle = (primaryId == null ? $.trim($("#save_NoticeTitle").val()) : $.trim($("#update_NoticeTitle").val()));
    entity.noticeContent = (primaryId == null ? $.trim($("#save_NoticeContent").val()) : $.trim($("#update_NoticeContent").val()));
    if (primaryId == null) {
		entity.field01 = $.trim($("#div_pictureSave img[name='uploadPicture']").attr("data-url"));
	} else {
		entity.field01 = $.trim($("#div_pictureUpdate img[name='uploadPicture']").attr("data-url"));
	}
    
    if ($.isBlank(entity.noticeContent) && $.isBlank(entity.field01)) {
    	$.alertInfo("公告图片和公告内容至少有一项不能为空！");
    	return;
    }
	
	$.gdAjax({
		url   :"notice/save",
		data : entity,
		type : "POST",
		success : function(data) {
			if ($.isBlank(primaryId)) {
				$("#close_save_btn").click();
			} else {
				$("#close_update_btn").click();
			}
			// 加载数据
			getContentList();
		}
	});
}

/**
 * 图片上传后显示
 */
function uploadImageAfter(obj, url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + url
		+ "\"name=\"uploadPicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this));'>删除</a>";
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$(obj).before(pictureHtml);
	$(obj).hide();
}

/**
 * 图片删除
 * @param object
 */
function delPicture(object){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#btn-pictureSave, #btn-pictureUpdate").show();
}

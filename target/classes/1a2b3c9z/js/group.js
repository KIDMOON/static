/**
 * 初始化
 */
$(function() {
	
	getRegionList();
	
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
	
	//上传图片
	$("#btn-pictureSave, #btn-pictureUpdate").click(function() {
		var that = this;
		$.uploadImage({
			success: function(result) {
				uploadImageAfter(that, result.replace(serverAddress.file, ''));
			}
		})
	});	

	// 加载数据
	getContentList();
});

/**
 * 箱子图片上传后显示
 */
function uploadImageAfter(obj, url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
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

/**
 * 查询数据
 */
function getRegionList() {
	var data = new Object();
	data.pageIndex = 0;
	$.gdAjax({
		url : "region/list",
		type : "POST",
		data : data,
		success : function(data) {
			var htmlContent = "";
			htmlContent += "<option value=''>请选择</option>";
			for(var i in data.result)	{
				var info = data.result[i];
				htmlContent += "<option value='" + info.regionId + "'>" + info.regionName + "</option>";	
			}	
			$("#update_RegionId, #save_RegionId").html(htmlContent);
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		url : "group/list",
		type : "POST",
		data : data,
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
	for ( var i in data.result) {
		var info = data.result[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.groupId == null ? "" : info.groupId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.regionName == null ? "" : info.regionName) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.groupName == null ? "" : info.groupName) + "</td>";
		htmlContent += "	<td scope='row'  >" + ($.isBlank(info.groupIcon) ? "" : "<img style='height: 60px;' src='" + serverAddress.file + info.groupIcon + "'>") + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field01 == null ? "" : info.field01) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field03 == null ? "" : info.field03) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.groupId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.groupId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.groupId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.groupId + "')\">删除</a>" +
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
		url : "group/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$(".uploadimages").remove();
                	$("#btn-pictureSave, #btn-pictureUpdate").show();
                	$("#update_GroupId").clearTip();
                	$("#update_GroupId").val(data.result.groupId);
                	$("#update_GroupName").clearTip();
                	$("#update_GroupName").val(data.result.groupName);
                	uploadImageAfter($("#btn-pictureUpdate"), data.result.groupIcon);
                	$("#update_RegionId").clearTip();
                	$("#update_RegionId").val(data.result.regionId);
                	$("#update_Field01").clearTip();
                	$("#update_Field01").val(data.result.field01);
                	$("#update_Field02").clearTip();
                	$("#update_Field02").val(data.result.field02);
                	$("#update_Field03").clearTip();
                	$("#update_Field03").val(data.result.field03);
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
				url   :"group/del",
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
            $("#save_GroupId").clearTip();
            $("#save_GroupName").clearTip();
            $("#save_RegionId").clearTip();
            $("#save_Field01").clearTip();
            $("#save_Field02").clearTip();
            $("#save_Field03").clearTip();
            $("#save_GroupId").val('');
            $("#save_GroupName").val('');
            $("#save_RegionId").val('');
            $("#save_Field01").val('');
            $("#save_Field02").val('');
            $("#save_Field03").val('');
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
    entity.groupId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.groupId = $.trim($("#save_GroupId").val());
    	entity.groupName = $.trim($("#save_GroupName").val());
    	entity.groupIcon = $.trim($("#div_pictureSave img[name='uploadPicture']").attr("data-url"));
    	entity.regionId = $.trim($("#save_RegionId").val());
    	entity.field01 = $.trim($("#save_Field01").val());
    	entity.field02 = $.trim($("#save_Field02").val());
    	entity.field03 = $.trim($("#save_Field03").val());
	}
	else {
		// 编辑保存
		entity.groupId = $.trim($("#update_GroupId").val());
    	entity.groupName = $.trim($("#update_GroupName").val());
    	entity.groupIcon = $.trim($("#div_pictureUpdate img[name='uploadPicture']").attr("data-url"));
    	entity.regionId = $.trim($("#update_RegionId").val());
    	entity.field01 = $.trim($("#update_Field01").val());
    	entity.field02 = $.trim($("#update_Field02").val());
    	entity.field03 = $.trim($("#update_Field03").val());
	}
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"group/save",
		data : data,
		type : "POST",
		success : function(data) {
			if ($.isBlank(primaryId)) {
				$("#close_save_btn").click();
			} else {
				$("#close_update_btn").click();
			}
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：降序
 * @param groupId
 */
function down(groupId) {
	var data = new Object();
	var group = new Object();
	group.groupId = groupId;
	data.param = group;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "group/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param groupId
 */
function up(groupId) {
	var data = new Object();
	var group = new Object();
	group.groupId = groupId;
	data.param = group;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "group/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
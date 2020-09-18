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
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		url : "region/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.regionId == null ? "" : info.regionId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.regionName == null ? "" : info.regionName) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field01 == null ? "" : info.field01) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.field03 == null ? "" : info.field03) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.regionId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.regionId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.regionId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.regionId + "')\">删除</a>" +
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
		url : "region/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$(".uploadimages").remove();
                	$("#btn-pictureSave, #btn-pictureUpdate").show();
                	$("#update_RegionId").clearTip();
                	$("#update_RegionId").val(data.result.regionId);
                	$("#update_RegionName").clearTip();
                	$("#update_RegionName").val(data.result.regionName);
                	uploadImageAfter($("#btn-pictureUpdate"), data.result.field01);
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
				url   :"region/del",
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
            $("#save_RegionId").clearTip();
            $("#save_RegionName").clearTip();
            $("#save_Field02").clearTip();
            $("#save_Field03").clearTip();
            $("#save_RegionId").val('');
            $("#save_RegionName").val('');
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
    entity.regionId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.regionId = $.trim($("#save_RegionId").val());
    	entity.regionName = $.trim($("#save_RegionName").val());
    	entity.field01 = $.trim($("#div_pictureSave img[name='uploadPicture']").attr("data-url"));
    	entity.field02 = $.trim($("#save_Field02").val());
    	entity.field03 = $.trim($("#save_Field03").val());
	}
	else {
		// 编辑保存
		entity.regionId = $.trim($("#update_RegionId").val());
    	entity.regionName = $.trim($("#update_RegionName").val());
    	entity.field01 = $.trim($("#div_pictureUpdate img[name='uploadPicture']").attr("data-url"));
    	entity.field02 = $.trim($("#update_Field02").val());
    	entity.field03 = $.trim($("#update_Field03").val());
	}
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"region/save",
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
 * @param regionId
 */
function down(regionId) {
	var data = new Object();
	var region = new Object();
	region.regionId = regionId;
	data.param = region;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "region/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param regionId
 */
function up(regionId) {
	var data = new Object();
	var region = new Object();
	region.regionId = regionId;
	data.param = region;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "region/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
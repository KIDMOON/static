/**
 * 初始化
 */
$(function() {
	
	// 加载下拉
	getBoxList();
	
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
});

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		url : "userRechargeLevel/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.rechargeLevelId == null ? "" : info.rechargeLevelId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.levelPrice == null ? "" : info.levelPrice) + "</td>";
		if (info.box == null) {
			htmlContent += "	<td scope='row'  >";
			htmlContent += "	</td>";
		}
		else {
			htmlContent += "	<td scope='row'  >";
			htmlContent += 			(info.box.boxPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.apiUrl + info.box.boxPicture + "'>"));
			htmlContent += "&nbsp; " + (info.box.boxName == null ? "" : info.box.boxName);
			htmlContent += "	</td>";
		}
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.rechargeLevelId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.rechargeLevelId + "')\">删除</a>" +
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
		url : "userRechargeLevel/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_RechargeLevelId").clearTip();
                	$("#update_RechargeLevelId").val(data.result.rechargeLevelId);
                	$("#update_LevelPrice").clearTip();
                	$("#update_LevelPrice").val(data.result.levelPrice);
                	$("#update_BoxId").clearTip();
                	$("#update_BoxId").val(data.result.boxId);
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
				url   :"userRechargeLevel/del",
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
            $("#save_RechargeLevelId").clearTip();
            $("#save_LevelPrice").clearTip();
            $("#save_BoxId").clearTip();
            $("#save_RechargeLevelId").val('');
            $("#save_LevelPrice").val('');
            $("#save_BoxId").val('');
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	var entity = new Object();
    entity.rechargeLevelId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.rechargeLevelId = $.trim($("#save_RechargeLevelId").val());
    	entity.levelPrice = $.trim($("#save_LevelPrice").val());
    	entity.boxId = $.trim($("#save_BoxId").val());
	}
	else {
		// 编辑保存
		entity.rechargeLevelId = $.trim($("#update_RechargeLevelId").val());
		entity.levelPrice = $.trim($("#update_LevelPrice").val());
    	entity.boxId = $.trim($("#update_BoxId").val());
	}
	
	var data = new Object();
	data.param = entity;
	$.gdAjax({
		url   :"userRechargeLevel/save",
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
 * 加载箱子下拉
 */
function getBoxList(){
	var data = new Object();
	data.param = "5";
	$.gdAjax({
		url : "box/listallbytype",
		type: "POST",
		data:data,
		success:function(data) {
			var _html = "<option value=''>请选择</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.boxId + "'>" + info.boxName + "</option>";
			} 
			$("#save_BoxId").html(_html);
			$("#update_BoxId").html(_html);
		}
	});
}

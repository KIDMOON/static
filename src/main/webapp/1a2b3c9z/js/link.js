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
});

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		url : "link/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.linkId == null ? "" : info.linkId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.linkName == null ? "" : info.linkName) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field01 == null ? "" : info.field01) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.linkId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.linkId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.linkId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.linkId + "')\">删除</a>" +
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
		url : "link/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_LinkId").clearTip();
                	$("#update_LinkId").val(data.result.linkId);
                	$("#update_LinkName").clearTip();
                	$("#update_LinkName").val(data.result.linkName);
                	$("#update_Field01").clearTip();
                	$("#update_Field01").val(data.result.field01);
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
				url   :"link/del",
				data : data,
				type : "POST",
				success : function(data) {
					initHtmlData(data);
				}
			});
		}
	});
}

/**
 * 添加模态框
 */
function saveNewModal() {
	Modal.dialog({ 
		modalId: "add_modal", 
		onReady : function () {
            $("#save_LinkId").clearTip();
            $("#save_LinkName").clearTip();
            $("#save_Field01").clearTip();
            $("#save_LinkId").val('');
            $("#save_LinkName").val('');
            $("#save_Field01").val('');
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	var entity = new Object();
    entity.linkId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.linkName = $.trim($("#save_LinkName").val());
    	entity.field01 = $.trim($("#save_Field01").val());
	}
	else {
		// 编辑保存
		entity.linkId = $.trim($("#update_LinkId").val());
    	entity.linkName = $.trim($("#update_LinkName").val());
    	entity.field01 = $.trim($("#update_Field01").val());
	}
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"link/save",
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
 * @param linkId
 */
function down(linkId) {
	var data = new Object();
	var link = new Object();
	link.linkId = linkId;
	data.param = link;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "link/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param linkId
 */
function up(linkId) {
	var data = new Object();
	var link = new Object();
	link.linkId = linkId;
	data.param = link;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "link/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
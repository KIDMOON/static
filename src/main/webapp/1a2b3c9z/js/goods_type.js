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
		url : "goodsType/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.boxId == null ? "" : info.boxId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.boxName == null ? "" : info.boxName) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.boxId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.boxId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.boxId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.boxId + "')\">删除</a>" +
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
		url : "goodsType/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_BoxId").clearTip();
                	$("#update_BoxId").val(data.result.boxId);
                	$("#update_BoxName").clearTip();
                	$("#update_BoxName").val(data.result.boxName);
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
				url   :"goodsType/del",
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
            $("#save_BoxId").clearTip();
            $("#save_BoxName").clearTip();
            $("#save_BoxId").val('');
            $("#save_BoxName").val('');
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	var entity = new Object();
    entity.boxId = primaryId;
    entity.field02 = '1';
    
	if (primaryId == null) {
		// 添加保存
    	entity.boxId = $.trim($("#save_BoxId").val());
    	entity.boxName = $.trim($("#save_BoxName").val());
	}
	else {
		// 编辑保存
		entity.boxId = $.trim($("#update_BoxId").val());
    	entity.boxName = $.trim($("#update_BoxName").val());
	}
	
	$.gdAjax({
		url   :"goodsType/save",
		data : entity,
		type : "POST",
		success : function(data) {
			if ($.isBlank(primaryId)) {
				$("#close_save_btn").click();
			} else {
				$("#close_update_btn").click();
			}
			getContentList();
		}
	});
}

/**
 * 更新商品分类顺序：降序
 * @param boxId
 */
function down(boxId) {
	var data = new Object();
	var goodsType = new Object();
	goodsType.boxId = boxId;
	data.param = goodsType;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "goodsType/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param boxId
 */
function up(boxId) {
	var data = new Object();
	var goodsType = new Object();
	goodsType.boxId = boxId;
	data.param = goodsType;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "goodsType/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
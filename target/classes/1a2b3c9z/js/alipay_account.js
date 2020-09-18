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
		url : "alipayAccount/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.alipayAccountId == null ? "" : info.alipayAccountId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.appId == null ? "" : info.appId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field01 == null ? "" : info.field01) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"down('"+info.alipayAccountId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"up('"+info.alipayAccountId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.alipayAccountId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.alipayAccountId + "')\">删除</a>" +
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
		url : "alipayAccount/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_AlipayAccountId").clearTip();
                	$("#update_AlipayAccountId").val(data.result.alipayAccountId);
                	$("#update_AppId").clearTip();
                	$("#update_AppId").val(data.result.appId);
                	$("#update_MerchantPrivateKey").clearTip();
                	$("#update_MerchantPrivateKey").val(data.result.merchantPrivateKey);
                	$("#update_AlipayPublicKey").clearTip();
                	$("#update_AlipayPublicKey").val(data.result.alipayPublicKey);
                	$("#update_Field01").clearTip();
                	$("#update_Field01").val(data.result.Field01);
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
				url   :"alipayAccount/del",
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
            $("#save_AlipayAccountId").clearTip();
            $("#save_AlipayAccountId").val('');
            $("#save_AppId").clearTip();
            $("#save_AppId").val('');
            $("#save_MerchantPrivateKey").clearTip();
            $("#save_MerchantPrivateKey").val('');
            $("#save_AlipayPublicKey").clearTip();
            $("#save_AlipayPublicKey").val('');
            $("#save_Field01").clearTip();
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
    entity.alipayAccountId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.alipayAccountId = $.trim($("#save_AlipayAccountId").val());
    	entity.appId = $.trim($("#save_AppId").val());
    	entity.merchantPrivateKey = $.trim($("#save_MerchantPrivateKey").val());
    	entity.alipayPublicKey = $.trim($("#save_AlipayPublicKey").val());
    	entity.field01 = $.trim($("#save_Field01").val());
	}
	else {
		// 编辑保存
		entity.alipayAccountId = $.trim($("#update_AlipayAccountId").val());
    	entity.appId = $.trim($("#update_AppId").val());
    	entity.merchantPrivateKey = $.trim($("#update_MerchantPrivateKey").val());
    	entity.alipayPublicKey = $.trim($("#update_AlipayPublicKey").val());
    	entity.field01 = $.trim($("#update_Field01").val());
	}
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"alipayAccount/save",
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
 * 更新顺序：降序
 * @param alipayAccountId
 */
function down(alipayAccountId) {
	var data = new Object();
	var alipayAccount = new Object();
	alipayAccount.alipayAccountId = alipayAccountId;
	data.param = alipayAccount;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "alipayAccount/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新顺序：升序
 * @param alipayAccountId
 */
function up(alipayAccountId) {
	var data = new Object();
	var alipayAccount = new Object();
	alipayAccount.alipayAccountId = alipayAccountId;
	data.param = alipayAccount;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "alipayAccount/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
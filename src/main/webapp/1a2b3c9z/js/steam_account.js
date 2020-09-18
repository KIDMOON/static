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
		url : "steamAccount/list",
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
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.steamAccountId == null ? "" : info.steamAccountId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.steamId == null ? "" : info.steamId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field03 == null ? "" : info.field03) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.count == null ? "" : info.count) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field05 == null ? "" : info.field05) + "</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.steamAccountId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.steamAccountId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
			           "        <a href='#' onclick=\"editInfo('" + info.steamAccountId + "')\">编辑</a> " +
			           "        <a href='#' onclick=\"delInfo('" + info.steamAccountId + "')\">删除</a>" +
						"        <a href='#' onclick=\"showInfo('" + info.steamId + "')\">查看库存</a>" +
						"        <a href='#' onclick=\"clearInfo('" + info.steamAccountId + "')\">清空失败</a>" +
			           "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
 * 查看库存
 * @param primaryId
 */
function showInfo(steamId) {
	$.gdAjax({
		url : "config/023/",
		success : function(data) {
			window.open("http://" + data.result.configValue + "/steam/getInventory/" + steamId);
		}
	});
}

/**
 * 修改
 * @param primaryId
 */
function editInfo(primaryId) {
	$("#hid_editId").val(primaryId);
	$.gdAjax({
		url : "steamAccount/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_SteamAccountId").clearTip();
                	$("#update_SteamAccountId").val(data.result.steamAccountId);
                	$("#update_SteamID").clearTip();
                	$("#update_SteamID").val(data.result.steamId);
                	$("#update_DeviceId").clearTip();
                	$("#update_DeviceId").val(data.result.deviceId);
                	$("#update_IdentitySecret").clearTip();
                	$("#update_IdentitySecret").val(data.result.identitySecret);
                	$("#update_ApiKey").clearTip();
                	$("#update_ApiKey").val(data.result.apiKey);
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
				url   :"steamAccount/del",
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
 * 清空
 * @param primaryId
 */
function clearInfo(primaryId) {
	Modal.confirm({ message: "确定执行清空消息操作吗？" }).on(function (isOK) {
		if (isOK) {
			$.gdAjax({
				url   :"steamAccount/clear/" + primaryId,
				success : function(data) {
					getContentList();
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
            $("#save_SteamAccountId").clearTip();
            $("#save_SteamID").clearTip();
            $("#save_DeviceId").clearTip();
            $("#save_IdentitySecret").clearTip();
            $("#save_ApiKey").clearTip();
			$("#save_Field01").clearTip();
			$("#save_Field02").clearTip();
			$("#save_Field03").clearTip();
            $("#save_SteamAccountId").val('');
            $("#save_SteamID").val('');
            $("#save_DeviceId").val('');
            $("#save_IdentitySecret").val('');
            $("#save_ApiKey").val('');
			$("#save_Field01").val('');
			$("#save_Field02").val('');
			$("#save_Field03").val('');
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	var entity = new Object();
    entity.steamAccountId = primaryId;
    
	if (primaryId == null) {
		// 添加保存
    	entity.steamAccountId = $.trim($("#save_SteamAccountId").val());
    	entity.steamId = $.trim($("#save_SteamID").val());
    	entity.deviceId = $.trim($("#save_DeviceId").val());
    	entity.identitySecret = $.trim($("#save_IdentitySecret").val());
    	entity.apiKey = $.trim($("#save_ApiKey").val());
		entity.field01 = $.trim($("#save_Field01").val());
		entity.field02 = $.trim($("#save_Field02").val());
		entity.field03 = $.trim($("#save_Field03").val());
	}
	else {
		// 编辑保存
		entity.steamAccountId = $.trim($("#update_SteamAccountId").val());
    	entity.steamId = $.trim($("#update_SteamID").val());
    	entity.deviceId = $.trim($("#update_DeviceId").val());
    	entity.identitySecret = $.trim($("#update_IdentitySecret").val());
    	entity.apiKey = $.trim($("#update_ApiKey").val());
		entity.field01 = $.trim($("#update_Field01").val());
		entity.field02 = $.trim($("#update_Field02").val());
		entity.field03 = $.trim($("#update_Field03").val());
	}

	for (var entityKey in entity) {
		if (entityKey != "steamAccountId" && $.isBlank(entity[entityKey])) {
			$.alertError("所有的输入项都不能为空");
			return;
		}
	}
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"steamAccount/save",
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
 * @param steamAccountId
 */
function down(steamAccountId) {
	var data = new Object();
	var steamAccount = new Object();
	steamAccount.steamAccountId = steamAccountId;
	data.param = steamAccount;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "steamAccount/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param steamAccountId
 */
function up(steamAccountId) {
	var data = new Object();
	var steamAccount = new Object();
	steamAccount.steamAccountId = steamAccountId;
	data.param = steamAccount;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "steamAccount/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}
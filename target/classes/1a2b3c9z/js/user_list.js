/**
 * 初始化
 */
$(function() {
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});
	
	$("#modal_edit_btn").click(function () {
		saveOrUpdateInfo();
	});
	
	// 主播设置保存
	$("#modal_editcode_btn").click(function () {
		saveOrUpdateCodeInfo();
	});
	
	$("#modal_edit_partnerCode_btn").click(function () {
		saveOrUpdatePartnerCodeInfo();
	});
	
	$("#modal_editpercent_btn").click(function () {
		saveOrUpdatePartnerGivePercentInfo();
	});
});

/**
 * 加载主播推广码
 * @param data
 */
function initUserCode(data) {
	var htmlContent = "";
	htmlContent += "<option value=''>请选择</option>";
	for(var i in data.result)	{
		var info = data.result[i];
		htmlContent += "<option value='" + info.promoCodeId + "'>" + info.promoCodeNum + "</option>";	
	}	
	$("#user_field04").html(htmlContent);
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	var nickName = $.trim($("#text_nickName").val());
	var partnerCode = $.trim($("#text_partnerCode").val());
	obj.nickName = nickName;
	obj.partnerCode = partnerCode;
	obj.robotFlag = false;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "user/list",
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
	for ( var i in data.result) {
		var info = data.result[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.userId == null ? "" : info.userId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>")) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.nickName == null ? "" : info.nickName) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;' >" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field04 == "1" ? ("主播推广赠送" + info.partnerGivePercent + "%") : "") + "</td>";
		htmlContent += "	<td scope='row'  >推广人数 " + (info.partnerStat == null ? "0人" : info.partnerStat.partnerCount) + "人<br />本周获得回扣$" 
					+ (info.partnerStat == null ? "0.00" : info.partnerStat.partnerMoneyWeek) + "<br />累计获得回扣$" 
					+ (info.partnerStat == null ? "0.00" : info.partnerStat.partnerMoneySum) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.partnerCode == null ? "" : info.partnerCode) + "</td>";
		htmlContent += "	<td scope='row'  >$ " + (info.userMoney.moneyFirstAll == null ? "" : info.userMoney.moneyFirstAll) + "</td>";
		htmlContent += "	<td scope='row'  >$ " + (info.userMoney.moneyFirstLeft == null ? "" : info.userMoney.moneyFirstLeft) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td style=' text-align:center;'>";
		htmlContent += "        <a href='#' onclick=\"editInfo('" + info.userId + "')\">修改  </a>";
		if (info.field04 == "1") {
			htmlContent += "        <a href='#' onclick=\"cancelInfo('" + info.userId + "')\">取消主播  </a>";
		}
		else {
			htmlContent += "        <a href='#' onclick=\"settingInfo('" + info.userId + "')\">设置主播  </a>";
		}
		htmlContent += "        <a href='#' onclick=\"editCode('" + info.userId + "', '" + info.partnerCode + "')\">设置推广码</a>";
		if (info.delFlag == "1") {
			htmlContent += "        <a href='#' onclick=\"delInfo('" + info.userId + "', false)\">移出黑名单</a>";
		}
		else {
			htmlContent += "        <a href='#' onclick=\"delInfo('" + info.userId + "', true)\">加入黑名单</a>";
		}
		htmlContent += "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
 * 设置推广码
 * @param primaryId
 * @param partnerCode
 */
function editCode(primaryId, partnerCode) {
	if ($.isBlank(partnerCode)) {
		partnerCode = "";
	}
	Modal.dialog({ 
        modalId: "update_partnerCode_modal", 
        onReady : function () {
        	$("#update_partnerCode").clearTip();
        	$("#update_partnerCode").val(partnerCode);
        	$("#update_partnerCode_UserId").val(primaryId);
        }
    });
}

/**
 * 设置推广码
 */
function saveOrUpdatePartnerCodeInfo() {
	$("#update_partnerCode").clearTip();
	var partnerCode = $.trim($("#update_partnerCode").val());
	if ($.isBlank(partnerCode)) {
		$("#update_partnerCode").tipError("推广码不能为空！");
		return;
	}
	if (partnerCode.length != 6) {
		$("#update_partnerCode").tipError("推广码长度必须为6位！");
		return;
	}
	var entity = new Object();
    // 编辑保存
	entity.userId = $("#update_partnerCode_UserId").val();
	entity.partnerCode = partnerCode;
	$.gdAjax({
		url   :"user/savePartnerCode",
		data : entity,
		type : "POST",
		success : function(data) {
			$("#close_update_partnerCode_btn").click();
			getContentList();
		}
	});
}

/**
 * 设置主播
 * @param primaryId
 */
function settingInfo(primaryId, givePercent) {
	/*$.gdAjax({
		loading : false,
		url : "promocode/unUsedlist",
		type : "POST", 
		success : function(data) {
			initUserCode(data);
			Modal.dialog({ 
                modalId: "updatecode_modal", 
                onReady : function () {
                	$("#update_code_UserId").clearTip();
                	$("#update_code_UserId").val(primaryId);
                	$("#user_field04").clearTip();
                }
            });
		}
	});*/
	Modal.dialog({
        modalId: "update_partnerPercent_modal", 
        onReady : function () {
        	$("#partner_give_percent").clearTip();
        	$("#partner_give_percent").val(givePercent);
        	$("#update_partnerPercent_UserId").val(primaryId);
        }
    });
}

/**
 * 更新主播
 */
function saveOrUpdatePartnerGivePercentInfo() {
	$("#partner_give_percent").clearTip();
	var givePercent = $.trim($("#partner_give_percent").val());
	if ($.isBlank(givePercent)) {
		$("#partner_give_percent").tipError("主播推广额外赠送%不能为空！");
		return;
	}
	if (isNaN(givePercent)) {
		$("#partner_give_percent").tipError("主播推广额外赠送%只能输入数字！");
		return;
	}
	var entity = new Object();
    // 编辑保存
	entity.userId = $("#update_partnerPercent_UserId").val();
	entity.field04 = "1";
	entity.partnerGivePercent = givePercent;
	$.gdAjax({
		url   :"user/saveCode",
		data : entity,
		type : "POST",
		success : function(data) {
			$("#close_updatepercent_btn").click();
			getContentList();
		}
	});
}

/**
 * 取消主播
 * @param primaryId
 */
function cancelInfo(primaryId) {
	var entity = new Object();
    // 编辑保存
	entity.userId = primaryId;
	entity.field04 = "0";
	entity.partnerGivePercent = "0";
	$.gdAjax({
		url   :"user/saveCode",
		data : entity,
		type : "POST",
		success : function(data) {
			getContentList();
		}
	});
}

/**
 * 修改
 * @param primaryId
 */
function editInfo(primaryId) {
	$.gdAjax({
		url : "user/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_UserId").clearTip();
                	$("#update_UserId").val(data.result.userMoney.userId);
                	$("#update_MoneyFirstLeft").clearTip();
                	$("#update_MoneyFirstLeft").val(data.result.userMoney.moneyFirstLeft);
                	$("#update_MoneySecondLeft").clearTip();
                	$("#update_MoneySecondLeft").val(data.result.userMoney.moneySecondLeft);
                	$("#update_MoneyThirdLeft").clearTip();
                	$("#update_MoneyThirdLeft").val(data.result.userMoney.moneyThirdLeft);
                	$("#update_Version").val(data.result.userMoney.version);
                }
            });
		}
	});
}

/**
 * 编辑保存
 */
function saveOrUpdateInfo() {
	var entity = new Object();
    // 编辑保存
	entity.userId = $.trim($("#update_UserId").val());
	entity.moneyFirstLeft = $.trim($("#update_MoneyFirstLeft").val());
	entity.moneySecondLeft = $.trim($("#update_MoneySecondLeft").val());
	entity.moneyThirdLeft = $.trim($("#update_MoneyThirdLeft").val());
	entity.version = $.trim($("#update_Version").val());
	
	$.gdAjax({
		url   :"user/save",
		data : entity,
		type : "POST",
		success : function(data) {
			getContentList();
			$("#close_update_btn").click();
		}
	});
}

/**
 * 编辑保存主播
 */
function saveOrUpdateCodeInfo() {
	var entity = new Object();
    // 编辑保存
	entity.userId = $.trim($("#update_code_UserId").val());
	entity.field04 = $.trim($("#user_field04").find("option:selected").text());
	if (entity.field04 === "请选择") {
		entity.field04 = "";
	}
	
	$.gdAjax({
		url   :"user/saveCode",
		data : entity,
		type : "POST",
		success : function(data) {
			getContentList();
			$("#close_updatecode_btn").click();
		}
	});
}

/**
 * 黑名单
 * @param primaryId
 */
function delInfo(primaryId, delFlag) {
	var text = "确定将此用户吗加入黑名单吗？";
	if (!delFlag) {
		text = "确定将此用户吗移出黑名单吗？";
	}
	Modal.confirm({ message: text }).on(function (isOK) {
		if (isOK) {
			var data = new Object();
			var entity = new Object();
			var ids = new Array();
			ids.push(primaryId);
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			entity.robotFlag = false;
			entity.delFlag = delFlag;
			data.param = entity;
			$.gdAjax({
				url   :"user/del",
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
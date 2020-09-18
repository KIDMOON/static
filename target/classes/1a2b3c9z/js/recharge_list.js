/**
 * 初始化
 */
$(function() {
	
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});
});

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	var searchContent = $.trim($("#text_content").val());
	obj.field01 = searchContent;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "recharge/list",
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
	if ($.isBlank(data.result)) {
		return;
	}
	$("#amount-div").text("充值合计：" + data.result.amount);
	$(".table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result.recordList) {
		var info = data.result.recordList[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>"));
		htmlContent += "&nbsp; " + (info.nickName == null ? "" : info.nickName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + info.userId + "</td>";
		htmlContent += "	<td scope='row'  style='display: none;'>" + info.loginName + "</td>";
		htmlContent += "	<td scope='row'  >" + info.amountRecordId + "</td>";
		var desc = "";
		if (info.type == "1") {
			desc = "充值";
		} else if (info.type == "2") {
			desc = "充值赠送";
		} else if (info.type == "3") {
			desc = "推广赠送";
		}
		var rechargeType = "";
		if (info.field01 == '1') {
			rechargeType = "支付宝";
		} else if (info.field01 == '2') {
			rechargeType = "微信";
		} else if (info.field01 == '3') {
			rechargeType = "人工";
		} else if (info.field01 == '4') {
			rechargeType = "充值卡";
		}
		htmlContent += "	<td scope='row'  >" + rechargeType + desc + "</td>";
		htmlContent += "	<td scope='row'  >$" + (info.amount == null ? "" : info.amount) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field03 == null ? "" : info.field03) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
}
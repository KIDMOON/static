var code = "";
/**
 * 初始化
 */
$(function() {
	
	// 条件初始化
	var params = $.getArgs();
	// 箱子ID
	code = params["code"];
	if ($.isBlank(code)) {
		return;
	}
	// 加载数据
	getContentList(code);
	
	$("#btn-search").click(function () {
		getContentList(code);
	});
});

/**
 * 查询数据
 */
function getContentList(code) {
	var data = new Object();
	var obj = new Object();
	var searchContent = $.trim($("#text_content").val());
	obj.field01 = searchContent;
	obj.field02 = code;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "recharge/outlist",
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
		htmlContent += "	<td scope='row' style='display: none;' >" + info.loginName + "</td>";
		htmlContent += "	<td scope='row'  >" + info.amountRecordId + "</td>";
		htmlContent += "	<td scope='row'  >" + info.field01 + ((info.type == "1") ? "充值" : "充值赠送") + "</td>";
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
	getContentList(code);
}
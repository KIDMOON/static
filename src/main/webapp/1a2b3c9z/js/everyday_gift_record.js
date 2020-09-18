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
	var nickName = $.trim($("#text_nickName").val());
	var goodsName = $.trim($("#text_goodsName").val());
	obj.nickName = nickName;
	obj.goodsName = goodsName;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "everygiftrecord/list",
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
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>"));
		htmlContent += "&nbsp; " + (info.nickName == null ? "" : info.nickName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + (info.rechargeMoneySum == null ? "" : ("$" + info.rechargeMoneySum)) + "</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsWearName = (info.goodsWearName == null ? "" : (" | " + info.goodsWearName));
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
		htmlContent += "&nbsp; " + _goodsName + _goodsWearName;
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >$" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
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

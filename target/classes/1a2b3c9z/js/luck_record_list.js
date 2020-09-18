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
	var createDataParam = $.trim($("#text_field01").val());
	obj.createDataParam = createDataParam;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "luckManager/recordlist",
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
		var _luckContent = "";
		if (info.luckType == 0) {
			_luckContent = "谢谢参与";
		} else if (info.luckType == 1) {
			_luckContent = "$ " + info.luckMoney;
		} else if (info.luckType == 2) {
			_luckContent = info.goodsName + "（$ " + info.goodsPrice + "）";
		}
		htmlContent += "	<td scope='row'>" + _luckContent + "</td>";
		htmlContent += "	<td scope='row'>" + (info.luckWeight == null ? "" : (info.luckWeight + "%")) + "</td>";
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

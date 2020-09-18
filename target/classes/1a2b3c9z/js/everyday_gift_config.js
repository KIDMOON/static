/**
 * 初始化
 */
$(function() {

	initConfigInfo();

	getGoodsType01();
	getGoodsLevel();
	getGoodsWear();

	$("#btn-search").click(function () {
		getContentList();
	});

	// 加载数据
	getContentList();
});

/**
 * 装备等级列表
 */
function getGoodsLevel(){
	$.gdAjax({
		loading : false,
		url : "code/list/001",
		type : "GET",
		success : function(data) {
			var goodsLevelArray = data.result;
			var html = "";
			html += "			<option value=''>装备等级</option>"
			for (var i in goodsLevelArray) {
				var entity = goodsLevelArray[i];
				html += "		<option value='" + entity.decodeId + "'>" + entity.decodeValue + "</option>";
			}
			$("#save_GoodsLevel, #update_GoodsLevel, #search_GoodsLevel").html(html);
		}
	});
}

/**
 * 装备类型01
 */
function getGoodsType01(){
	$.gdAjax({
		loading : false,
		url : "code/list/004",
		type : "GET",
		success : function(data) {
			var goodsType01Array = data.result;
			var html = "";
			html += "			<option value=''>装备父类型</option>"
			for (var i in goodsType01Array) {
				var entity = goodsType01Array[i];
				html += "		<option value='" + entity.decodeId + "'>" + entity.decodeValue + "</option>";
			}
			$("#save_GoodsType01, #update_GoodsType01, #search_GoodsType01").html(html);
			$("#save_GoodsType01, #update_GoodsType01, #search_GoodsType01").change(function () {
				getGoodsType02(this, "");
			});
		}
	});
}

/**
 * 装备类型02
 */
function getGoodsType02(obj, defaultVal){
	var type01SelectValue = $(obj).val();
	if ($.isBlank(type01SelectValue)) {
		$("#" + $(obj).attr("id").replace("01", "02")).html("<option value=''>装备子类型</option>");
		return;
	}
	$.gdAjax({
		loading : false,
		url : "code/list/" + type01SelectValue,
		type : "GET",
		success : function(data) {
			var goodsType02Array = data.result;
			var html = "";
			html += "			<option value=''>装备子类型</option>"
			for (var i in goodsType02Array) {
				var entity = goodsType02Array[i];
				if (defaultVal == entity.decodeId) {
					html += "		<option value='" + entity.decodeId + "' selected='selected'>" + entity.decodeValue + "</option>";
				} else {
					html += "		<option value='" + entity.decodeId + "'>" + entity.decodeValue + "</option>";
				}
			}
			$("#" + $(obj).attr("id").replace("01", "02")).html(html);
		}
	});
}

/**
 * 装备磨损度
 */
function getGoodsWear(){
	$.gdAjax({
		loading : false,
		url : "code/list/003",
		type : "GET",
		success : function(data) {
			var goodsWearArray = data.result;
			var html = "";
			html += "			<option value=''>装备磨损度</option>"
			for (var i in goodsWearArray) {
				var entity = goodsWearArray[i];
				html += "		<option value='" + entity.decodeId + "'>" + entity.decodeValue + "</option>";
			}
			$("#save_GoodsWear, #update_GoodsWear, #search_GoodsWear").html(html);
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	obj.goodsName = $.trim($("#search_GoodsName").val());
	obj.goodsType01 = $.trim($("#search_GoodsType01").val());
	obj.goodsType02 = $.trim($("#search_GoodsType02").val());
	obj.goodsLevel = $.trim($("#search_GoodsLevel").val());
	obj.goodsWear = $.trim($("#search_GoodsWear").val());
	obj.statTrakFlag = $.trim($("#search_StatTrakFlag").val());
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "goodsManager/list/12",
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
		htmlContent += "<td scope='row' style=' text-align:center; '>" +
			(Number(i)+1) +
			"</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsType = (info.goodsType01Name == null ? "" : info.goodsType01Name) + " | " + (info.goodsType02Name == null ? "" : info.goodsType02Name);
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
		htmlContent += "&nbsp; " + _goodsName;
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + _goodsType + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.goodsLevelName == null ? "" : info.goodsLevelName) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.goodsWearName == null ? "" : info.goodsWearName) + "</td>";
		htmlContent += "	<td scope='row'  >" + ((info.statTrakFlag == null || !info.statTrakFlag) ? "" : "StatTrak") + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td>" +
			"        <a href='#' onclick=\"chooseInfo('" + info.goodsId + "')\">选择</a> " +
			"    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
 * 加载信息
 */
function initConfigInfo(){
	$.gdAjax({
		url:"everydayGift/findConfig",
		type:"GET",
		success:function(data) {
			var info = data.result;
			if (!$.isBlank(info)) {
				var htmlContent = "";
				var _goodsName = (info.goodsName == null ? "" : info.goodsName);
				htmlContent += 	(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
				htmlContent += "&nbsp; " + _goodsName;
				$("#chooseGoods").html(htmlContent);
			}
		}
	});
}

/**
 * 保存配置
 * @param primaryId
 */
function chooseInfo(primaryId) {
	var info = new Object();
	info.goodsId = primaryId;
	$.gdAjax({
		url:"everydayGift/saveConfig",
		data:info,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
			initConfigInfo();
		}
	});
}

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
}

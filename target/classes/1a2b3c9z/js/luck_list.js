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
	
	getGoodsType01();
	getGoodsLevel();
	getGoodsWear();
	
	// 选择商品
	$("#save_GoodsChoose_Btn, #update_GoodsChoose_Btn").click(function () {
		chooseGoods();
	});
	
	$("#chooseGoods-btn-search").click(function () {
		getChooseGoodsList();
	});
	
	// 选择
	$("#save_LuckType").change(function () {
		saveChangeStat();
	});
	$("#update_LuckType").change(function () {
		updateChangeStat();
	});
});

/**
 * 更新视图
 */
function saveChangeStat() {
	var val = $("#save_LuckType").val();
	if (val == "0") {
		$("#save_GoodsId_div").hide();
		$("#save_LuckMoney_div").hide();
	} else if (val == "1") {
		$("#save_GoodsId_div").hide();
		$("#save_LuckMoney_div").show();
	} else if (val == "2") {
		$("#save_GoodsId_div").show();
		$("#save_LuckMoney_div").hide();
	}
}

/**
 * 更新视图
 */
function updateChangeStat() {
	var val = $("#update_LuckType").val();
	if (val == "0") {
		$("#update_GoodsId_div").hide();
		$("#update_LuckMoney_div").hide();
	} else if (val == "1") {
		$("#update_GoodsId_div").hide();
		$("#update_LuckMoney_div").show();
	} else if (val == "2") {
		$("#update_GoodsId_div").show();
		$("#update_LuckMoney_div").hide();
	}
}

/**
 * 查询数据
 */
function getContentList() {
	$.gdAjax({
		url : "luckManager/list",
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
	var weightSum = 0;
	$(".table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result) {
		var info = data.result[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		var _luckContent = "";
		if (info.luckType == 0) {
			_luckContent = "谢谢参与";
		} else if (info.luckType == 1) {
			_luckContent = "$ " + info.luckMoney;
		} else if (info.luckType == 2) {
			_luckContent = info.goodsName + "（$ " + info.goodsPrice + "）";
		}
		htmlContent += "	<td scope='row'  >" + _luckContent + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.luckWeight == null ? "" : (info.luckWeight + "%")) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td>" + 
		               "        <a href='#' onclick=\"editInfo('" + info.luckId + "')\">编辑</a> " +
		               "        <a href='#' onclick=\"delInfo('" + info.luckId + "')\">删除</a>" + 
		               "    </td>";
		htmlContent += "</tr>";
		weightSum += Number(info.luckWeight == null ? "0" : info.luckWeight);
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
	$("#weightSum").text("权重（" + weightSum + "%）");
}

/**
 * 修改
 * @param primaryId
 */
function editInfo(primaryId) {
	$("#hid_editId").val(primaryId);
	$.gdAjax({
		url : "luckManager/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_LuckId").val(data.result.luckId);
                	$("#update_LuckType").val(data.result.luckType);
                	$("#update_GoodsId").val(data.result.goodsId);
                	$("#update_GoodsName").text(data.result.goodsName);
                	$("#update_LuckMoney").clearTip();
                	$("#update_LuckMoney").val(data.result.luckMoney);
                	$("#update_LuckWeight").clearTip();
                	$("#update_LuckWeight").val(data.result.luckWeight);
                	updateChangeStat();
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
				url   :"luckManager/del",
				data : data,
				type : "POST",
				success : function(data) {
					getContentList();
				}
			});
		}
	});
}

function page_go(pageIndex){
	// 主页面table
	if ($("#choose_modal").is(':hidden')) {
		$("#hid_pageIndex").val(pageIndex);
		getContentList();
	}
	// 选择商品table
	else {
		$("#hid_goodsChoose_pageIndex").val(pageIndex);
		getChooseGoodsList();
	}
	
}

/**
 * 添加模态框
 */
function saveNewModal() {
	Modal.dialog({ 
		modalId: "add_modal", 
		onReady : function () {
			$("#save_LuckId").val('');
        	$("#save_LuckType").val('0');
        	$("#save_GoodsId").val('');
        	$("#save_GoodsName").text('');
        	$("#save_LuckMoney").clearTip();
        	$("#save_LuckMoney").val('');
        	$("#save_LuckWeight").clearTip();
        	$("#save_LuckWeight").val('');
        	saveChangeStat();
		}
	});
}

/**
 * 添加或者编辑保存
 * @param primaryId
 */
function saveOrUpdateInfo(primaryId) {
	
	//验证 
	if ($.isBlank(primaryId)) {
		if(!validateSaveValue()){
			return;
		}
	}
	else {
		if(!validateUpdateValue()){
			return;
		}
	}
	
	var entity = new Object();
	entity.luckId = (primaryId == null ? $.trim($("#save_LuckId").val()) : $.trim($("#update_LuckId").val()));
	entity.luckType = (primaryId == null ? $.trim($("#save_LuckType").val()) : $.trim($("#update_LuckType").val()));
	if ($.isBlank(primaryId)) {
		if($("#save_LuckType").val() == "1"){
			entity.luckMoney = $.trim($("#save_LuckMoney").val());
		}
		else if($("#save_LuckType").val() == "2"){
			entity.goodsId = $.trim($("#save_GoodsId").val());
		}
	}
	else {
		if($("#update_LuckType").val() == "1"){
			entity.luckMoney = $.trim($("#update_LuckMoney").val());
		}
		else if($("#update_LuckType").val() == "2"){
			entity.goodsId = $.trim($("#update_GoodsId").val());
		}
	}
    entity.luckWeight = (primaryId == null ? $.trim($("#save_LuckWeight").val()) : $.trim($("#update_LuckWeight").val()));
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"luckManager/save",
		data : data,
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
 * 验证
 */
function validateSaveValue() {
	if($.isBlank($("#save_LuckWeight").val())){
		$("#save_LuckWeight").tipError("抽中权重不能为空！");
		return false;
	}
	if($("#save_LuckType").val() == "1" && $.isBlank($("#save_LuckMoney").val())){
		$("#save_LuckMoney").tipError("赠送金额不能为空！");
		return false;
	}
	if($("#save_LuckType").val() == "2" && $.isBlank($("#save_GoodsId").val())){
		$.alertError("请先选择装备！");
		return false;
	}
	return true;
}

/**
 * 验证
 */
function validateUpdateValue() {
	if($.isBlank($("#update_LuckWeight").val())){
		$("#update_LuckWeight").tipError("抽中权重不能为空！");
		return false;
	}
	if($("#update_LuckType").val() == "1" && $.isBlank($("#update_LuckMoney").val())){
		$("#update_LuckMoney").tipError("赠送金额不能为空！");
		return false;
	}
	if($("#update_LuckType").val() == "2" && $.isBlank($("#update_GoodsId").val())){
		$.alertError("请先选择装备！");
		return false;
	}
	return true;
}

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
			$("#search_GoodsLevel").html(html);
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
			$("#search_GoodsType01").html(html);
			$("#search_GoodsType01").change(function () {
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
			$("#search_GoodsWear").html(html);
		}
	});
}

/**
 * 选择装备
 */
function chooseGoods() {
	getChooseGoodsList();
	Modal.dialog({ 
        modalId: "choose_modal", 
        onReady : function () {
        }
    });
}

/**
 * 查询数据
 */
function getChooseGoodsList() {
	var data = new Object();
	var obj = new Object();
	obj.goodsName = $.trim($("#search_GoodsName").val());
	obj.goodsType01 = $.trim($("#search_GoodsType01").val());
	obj.goodsType02 = $.trim($("#search_GoodsType02").val());
	obj.goodsLevel = $.trim($("#search_GoodsLevel").val());
	obj.goodsWear = $.trim($("#search_GoodsWear").val());
	obj.statTrakFlag = $.trim($("#search_StatTrakFlag").val());
	data.pageIndex = parseFloat($("#hid_goodsChoose_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "goodsManager/list/8",
		data : data,
		type : "POST",
		success : function(data) {
			initChooseGoodsHtmlData(data);
		}
	});
}

/**
 * 加载table内容
 */
function initChooseGoodsHtmlData(data) {
	$("#choose_modal .table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result) {
		var info = data.result[i];
		
		htmlContent += "<tr onclick=\"chooseClick(this, '" + dealVal(info.goodsId) + "', '" + dealVal(info.goodsName) + "')\">";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsType = (info.goodsType01Name == null ? "" : info.goodsType01Name) + " | " + (info.goodsType02Name == null ? "" : info.goodsType02Name);
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 50px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
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
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$("#choose_modal .table-bordered").initTable(data);
}

function dealVal(val) {
	if ($.isBlank(val)) {
		return "";
	}
	return val;
}

/**
 * 选中tr
 * @param obj
 */
function chooseClick(obj, goodsId, goodsName) {
	$("#save_GoodsId, #update_GoodsId").val(goodsId);
	$("#save_GoodsName, #update_GoodsName").text(goodsName);
	$("#close_ok_btn").click();
}

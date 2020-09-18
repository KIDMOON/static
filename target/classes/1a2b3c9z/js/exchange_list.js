/**
 * 初始化
 */
$(function() {
	
	getGoodsType();
	
	$("#btn-search").click(function () {
		getContentList();
	});
	
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
	
	//上传图片
	$("#btn-pictureUpload-save").click(function() {
		$.uploadImage({
			success: function(result) {
				uploadImageAfterSave(result.replace(serverAddress.file, ''));
			}
		})
	});	
	
	//上传图片
	$("#btn-pictureUpload-update").click(function() {
		$.uploadImage({
			success: function(result) {
				uploadImageAfterUpdate(result.replace(serverAddress.file, ''));
			}
		})
	});
	
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
});

/**
 * 兑换分类
 */
function getGoodsType(){
	$.gdAjax({
		loading : false,
		url : "goodsType/list",
		type : "POST", 
		data: new Object(),
		success : function(data) {
			var goodsTypeArray = data.result;
			var html = ""; 
			html += "			<option value=''>兑换分类</option>";
			for (var i in goodsTypeArray) {
				var entity = goodsTypeArray[i];
				html += "		<option value='" + entity.boxId + "'>" + entity.boxName + "</option>";
			}
			$("#select_boxId, #save_BoxId, #update_BoxId").html(html);
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	var goodsName = $.trim($("#text_goodsName").val());
	obj.boxId = $.trim($("#select_boxId").val());
	obj.goodsName = goodsName;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "exchangeManager/list",
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
		htmlContent += "	<td scope='row' >" + info.boxName + "</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsWearName = (info.goodsWearName == null ? "" : (" | " + info.goodsWearName));
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
		htmlContent += "&nbsp; " + _goodsName + _goodsWearName;
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.goodsLevelName == null ? "" : info.goodsLevelName) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.exchangeId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.exchangeId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
		               "        <a href='#' onclick=\"editInfo('" + info.exchangeId + "')\">编辑</a> " +
		               "        <a href='#' onclick=\"delInfo('" + info.exchangeId + "')\">删除</a>" + 
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
		url : "exchangeManager/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_ExchangeId").val(data.result.exchangeId);
                	$("#update_GoodsId").val(data.result.goodsId);
                	$("#update_GoodsName").text(data.result.goodsName);
                	$("#update_BoxId").clearTip();
                	$("#update_BoxId").val(data.result.boxId);
                	$("#update_Field02").clearTip();
                	$("#update_Field02").val(data.result.field02);
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
				url   :"exchangeManager/del",
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
			$("#save_ExchangeId").val('');
            $("#save_GoodsId").val('');
            $("#save_BoxId").clearTip();
            $("#save_BoxId").val('');
            $("#save_GoodsName").text('');
            $("#save_Field02").clearTip();
            $("#save_Field02").val('');
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
	entity.exchangeId = (primaryId == null ? $.trim($("#save_ExchangeId").val()) : $.trim($("#update_ExchangeId").val()));
    entity.goodsId = (primaryId == null ? $.trim($("#save_GoodsId").val()) : $.trim($("#update_GoodsId").val()));
    entity.boxId = (primaryId == null ? $.trim($("#save_BoxId").val()) : $.trim($("#update_BoxId").val()));
    entity.field02 = (primaryId == null ? $.trim($("#save_Field02").val()) : $.trim($("#update_Field02").val()));
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"exchangeManager/save",
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
	if($.isBlank($("#save_BoxId").val())){
		$("#save_BoxId").tipError("兑换分类不能为空！");
		return false;
	}
	if($.isBlank($("#save_GoodsId").val())){
		$.alertError("请先选择装备！");
		return false;
	}
	if($.isBlank($("#save_Field02").val())){
		$("#save_Field02").tipError("装备库存不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#save_Field02").val())){
		$("#save_Field02").tipError("装备库存格式不正确！");
		return false;
	} 
	return true;
}

/**
 * 验证
 */
function validateUpdateValue() {
	if($.isBlank($("#update_BoxId").val())){
		$("#update_BoxId").tipError("兑换分类不能为空！");
		return false;
	}
	if($.isBlank($("#update_GoodsId").val())){
		$.alertError("请先选择装备！");
		return false;
	}
	if($.isBlank($("#update_Field02").val())){
		$("#update_Field02").tipError("装备库存不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#update_Field02").val())){
		$("#update_Field02").tipError("装备库存格式不正确！");
		return false;
	} 
	return true;
}

/**
 * 更新商品分类顺序：降序
 * @param exchangeId
 */
function down(exchangeId) {
	var data = new Object();
	var goods = new Object();
	goods.exchangeId = exchangeId;
	var goodsName = $.trim($("#text_goodsName").val());
	goods.goodsName = goodsName;
	goods.boxId = $.trim($("#select_boxId").val());
	data.param = goods;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "exchangeManager/downOrder",
		data : data,
		success : function(data) {
			getContentList();
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param exchangeId
 */
function up(exchangeId) {
	var data = new Object();
	var goods = new Object();
	goods.exchangeId = exchangeId;
	var goodsName = $.trim($("#text_goodsName").val());
	goods.goodsName = goodsName;
	goods.boxId = $.trim($("#select_boxId").val());
	data.param = goods;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "exchangeManager/upOrder",
		data : data,
		success : function(data) {
			getContentList();
		}
	});
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

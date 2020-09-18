/**
 * 初始化
 */
$(function() {
	
	getGoodsType01();
	getGoodsLevel();
	getGoodsWear();
	
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
	
	//全选checkbox
	$("#selectAll").click(function(){		
		$("input[name='PId']").checkAll($("input[id='selectAll']").is(':checked'));	
	});
	
	// 批量删除
	$("#btn_multiDelete").click(function(){
		var ids = getCheckedBox();		
		multiInfo(ids);	
	});
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
							"<input name='PId' value='"+ info.goodsId +"' type='checkbox'>" +
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
		htmlContent += "	<td scope='row'  >" + ((info.field01 == null || !info.field01) ? "" : info.field01) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "<td>";
		htmlContent += "<a href='#' onclick=\"up('"+info.goodsId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.goodsId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"
		htmlContent += "	<td>" + 
		               "        <a href='#' onclick=\"editInfo('" + info.goodsId + "')\">编辑</a> " +
		               "        <a href='#' onclick=\"delInfo('" + info.goodsId + "')\">删除</a>" + 
		               "        <a href='#' onclick=\"copyInfo('" + info.goodsId + "')\">复制</a>" + 
		               "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
* 复制
*/
function copyInfo(primaryId) {
	$("#hid_editId").val("");
	$.gdAjax({
		url : "goodsManager/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "add_modal", 
                onReady : function () {
                	$("#save_GoodsName").clearTip();
                	$("#save_GoodsName").val(data.result.goodsName);
                	$("#save_GoodsType01").clearTip();
                	$("#save_GoodsType01").val(data.result.goodsType01);
                	$("#save_GoodsType02").clearTip();
                	getGoodsType02($("#save_GoodsType01"), data.result.goodsType02);
                	$(".uploadimages").remove();
                	uploadImageAfterSave(data.result.goodsPicture);
                	$("#save_GoodsPrice").clearTip();
                	$("#save_GoodsPrice").val(data.result.goodsPrice);
                	$("#save_GoodsLevel").clearTip();
                	$("#save_GoodsLevel").val(data.result.goodsLevel);
                	$("#save_GoodsWear").clearTip();
                	$("#save_GoodsWear").val(data.result.goodsWear);
                	$("#save_StatTrakFlag").clearTip();
                    $("#save_StatTrakFlag").val(data.result.statTrakFlag + "");
					$("#save_Field01").clearTip();
					$("#save_Field01").val(data.result.field01);
                }
            });
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
		url : "goodsManager/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	$("#update_GoodsId").val(data.result.goodsId);
                	$("#update_GoodsName").clearTip();
                	$("#update_GoodsName").val(data.result.goodsName);
                	$("#update_GoodsType01").clearTip();
                	$("#update_GoodsType01").val(data.result.goodsType01);
                	$("#update_GoodsType02").clearTip();
                	getGoodsType02($("#update_GoodsType01"), data.result.goodsType02);
                	$(".uploadimages").remove();
                	uploadImageAfterUpdate(data.result.goodsPicture);
                	$("#update_GoodsPrice").clearTip();
                	$("#update_GoodsPrice").val(data.result.goodsPrice);
                	$("#update_GoodsLevel").clearTip();
                	$("#update_GoodsLevel").val(data.result.goodsLevel);
                	$("#update_GoodsWear").clearTip();
                	$("#update_GoodsWear").val(data.result.goodsWear);
                	$("#update_StatTrakFlag").clearTip();
                    $("#update_StatTrakFlag").val(data.result.statTrakFlag + "");
					$("#update_Field01").clearTip();
					$("#update_Field01").val(data.result.field01);
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
            $("#save_GoodsId").val('');
            $("#save_GoodsName").clearTip();
            $("#save_GoodsName").val('');
            $("#save_GoodsType01").clearTip();
            $("#save_GoodsType01").val('');
            $("#save_GoodsType02").clearTip();
            $("#save_GoodsType02").val('');
            $(".uploadimages").remove();
        	$("#div_pictureUpload_save").show();
            $("#save_GoodsPicture").val('');
            $("#save_GoodsPrice").clearTip();
            $("#save_GoodsPrice").val('');
            $("#save_GoodsLevel").clearTip();
            $("#save_GoodsLevel").val('');
            $("#save_GoodsWear").clearTip();
            $("#save_GoodsWear").val('');
            $("#save_StatTrakFlag").clearTip();
            $("#save_StatTrakFlag").val('false');
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
    entity.goodsId = primaryId;
    entity.goodsName = (primaryId == null ? $.trim($("#save_GoodsName").val()) : $.trim($("#update_GoodsName").val()));
    entity.goodsType01 = (primaryId == null ? $.trim($("#save_GoodsType01").val()) : $.trim($("#update_GoodsType01").val()));
    entity.goodsType02 = (primaryId == null ? $.trim($("#save_GoodsType02").val()) : $.trim($("#update_GoodsType02").val()));
    entity.goodsPicture = (primaryId == null ? $.trim($("#goodsPictureSave").attr("data-url")) : $.trim($("#goodsPictureUpdate").attr("data-url")));
    entity.goodsPrice = (primaryId == null ? $.trim($("#save_GoodsPrice").val()) : $.trim($("#update_GoodsPrice").val()));
    entity.goodsLevel = (primaryId == null ? $.trim($("#save_GoodsLevel").val()) : $.trim($("#update_GoodsLevel").val()));
    entity.goodsWear = (primaryId == null ? $.trim($("#save_GoodsWear").val()) : $.trim($("#update_GoodsWear").val()));
    entity.statTrakFlag = (primaryId == null ? $.trim($("#save_StatTrakFlag").val()) : $.trim($("#update_StatTrakFlag").val()));
	entity.field01 = (primaryId == null ? $.trim($("#save_Field01").val()) : $.trim($("#update_Field01").val()));
	
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = entity;
	$.gdAjax({
		url   :"goodsManager/save",
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
	if($.isBlank($("#save_GoodsName").val())){
		$("#save_GoodsName").tipError("装备名称不能为空！");
		return false;
	}
	if($.isBlank($("#save_GoodsType01").val())){
		$("#save_GoodsType01").tipError("请选择装备父类型！");
		return false;
	}
	if($.isBlank($("#save_GoodsType02").val())){
		$("#save_GoodsType02").tipError("请选择装备子类型！");
		return false;
	}
	if($.isBlank($("#goodsPictureSave").attr("data-url"))){
		$.alertError("请上传装备图片！");
		return false;
	}
	if($.isBlank($("#save_GoodsPrice").val())){
		$("#save_GoodsPrice").tipError("装备价格不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#save_GoodsPrice").val())){
		$("#save_GoodsPrice").tipError("装备价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test($("#save_GoodsPrice").val())){
		$("#save_GoodsPrice").tipError("装备价格格式不正确，小数位最大为两位！");
		return false;
	}
	if($.isBlank($("#save_GoodsLevel").val())){
		$("#save_GoodsLevel").tipError("请选择装备等级！");
		return false;
	}
	if($.isBlank($("#save_GoodsWear").val())){
		$("#save_GoodsWear").tipError("请选择装备磨损度！");
		return false;
	}
	return true;
}

/**
 * 验证
 */
function validateUpdateValue() {
	if($.isBlank($("#update_GoodsName").val())){
		$("#update_GoodsName").tipError("装备名称不能为空！");
		return false;
	}
	if($.isBlank($("#update_GoodsType01").val())){
		$("#update_GoodsType01").tipError("请选择装备父类型！");
		return false;
	}
	if($.isBlank($("#update_GoodsType02").val())){
		$("#update_GoodsType02").tipError("请选择装备子类型！");
		return false;
	}
	if($.isBlank($("#goodsPictureUpdate").attr("data-url"))){
		$.alertError("请上传装备图片！");
		return false;
	}
	if($.isBlank($("#update_GoodsPrice").val())){
		$("#update_GoodsPrice").tipError("装备价格不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#update_GoodsPrice").val())){
		$("#update_GoodsPrice").tipError("装备价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test($("#update_GoodsPrice").val())){
		$("#update_GoodsPrice").tipError("装备价格格式不正确，小数位最大为两位！");
		return false;
	}
	if($.isBlank($("#update_GoodsLevel").val())){
		$("#update_GoodsLevel").tipError("请选择装备等级！");
		return false;
	}
	if($.isBlank($("#update_GoodsWear").val())){
		$("#update_GoodsWear").tipError("请选择装备磨损度！");
		return false;
	}
	return true;
}

/**
 * 图片上传后显示
 */
function uploadImageAfterSave(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
					+ "\"id=\"goodsPictureSave\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this), \"_save\");'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureUpload_save").before(pictureHtml);
	$("#div_pictureUpload_save").hide();
}

/**
 * 图片上传后显示
 */
function uploadImageAfterUpdate(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
					+ "\"id=\"goodsPictureUpdate\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this), \"_update\");'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureUpload_update").before(pictureHtml);
	$("#div_pictureUpload_update").hide();
}

/**
 * 图片删除
 * @param object
 */
function delPicture(object, type){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#div_pictureUpload" + type).show();
}

/**
 * 更新商品分类顺序：降序
 * @param goodsId
 */
function down(goodsId) {
	var data = new Object();
	var goods = new Object();
	goods.goodsId = goodsId;
	data.param = goods;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "goodsManager/downOrder",
		data : data,
		success : function(data) {
			getContentList();
		}
	});
}

/**
 * 更新商品分类顺序：升序
 * @param goodsId
 */
function up(goodsId) {
	var data = new Object();
	var goods = new Object();
	goods.goodsId = goodsId;
	data.param = goods;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "goodsManager/upOrder",
		data : data,
		success : function(data) {
			getContentList();
		}
	});
}

/**
 * 获取被选中的复选框id
 */
function getCheckedBox(){
	//判断是否有选中
	var b = false; 
	// 记录所有选中的id
	var ids = new Array();
	$(".table-bordered>tbody input:checkbox").each(function(){
		if($(this).is(":checked")) {
			b = true;
			ids.push($.trim($(this).val()));
		}
    });
    if(!b) {
    	$.alertInfo("请至少选择一条记录操作！");
    	return null;
    }
    return ids;
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
				url   :"goodsManager/del",
				data : data,
				type : "POST",
				success : function(data) {
					getContentList();
				}
			});
		}
	});
}

/**
 * 批量删除
 */
function multiInfo(ids){	
	if(ids == null){
		return;
	}
	Modal.confirm({ message: "确定执行删除操作吗？" }).on(function (isOK) {
		if (isOK) {
			var data = new Object();
			var entity = new Object();
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			data.param = entity;
			$.gdAjax({
				url   :"goodsManager/del",
				data : data,
				type : "POST",
				success : function(data) {
					getContentList();
				}
			});
		}
	});	
}

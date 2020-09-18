var goodsLevelArray = new Array();
var chooseGoodsArray = new Array();

/**
 * 初始化
 */
$(function() {
	// 条件初始化
	var params = $.getArgs();
	// ROLLID
	var rollId = params["rollId"];
	
	if(!$.isBlank(rollId)){
		$("#hid_rollId").val(rollId);
	}

	//获取装备等级array
	getGoodsLevelArray();
	
	//ROLL标题验证
	$("#txt_RollTitile").blur(function () {
		if (validateRollTitile()) {
			$(this).clearTip();
		}
	});

	//ROLL子标题验证
	$("#txt_RollSub").blur(function () {
		if (validateRollSub()) {
			$(this).clearTip();
		}
	});

	//门槛充值验证
	$("#txt_rechargeMoney").blur(function () {
		if (validateRechargeMoney()) {
			$(this).clearTip();
		}
	});
	
	// 添加装备
	$("#btn_goods_add").click(function() {
		chooseGoods();
	});
	
	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		//保存装备信息
		saveDetailData();
	});
	
	//返回
	$("#btn-detail-return").click(function() {
		Modal.confirm({ message: "确定放弃修改，返回吗？" }).on(function (isOK) {
			if (isOK) {
				window.location.href = "roll_list.html";
			}
		});
	});
	
	//上传图片
	$("#btn-pictureUpload").click(function() {
		$.uploadImage({
			success: function(result) {
				uploadImageAfter(result.replace(serverAddress.file, ''));
			}
		})
	});	
	
	//上传图片
	$("#btn-pictureBgUpload").click(function() {
		$.uploadImage({
			success: function(result) {
				uploadBgImageAfter(result.replace(serverAddress.file, ''));
			}
		})
	});	
	
	getGoodsType01();
	getGoodsLevel();
	getGoodsWear();
	
	// 选择商品
	$("#btn-search").click(function () {
		getContentList();
	});
	
	// 选中商品确认
	$("#modal_ok_btn").click(function () {
		chooseGoodOk();
	});
});

/**
 * 排序
 */
function pageSort() {
	var arr = $("#table-spec>tbody>tr");
	for(i=0;i<arr.length-1;i++){
        for(j=0;j<arr.length-1-i;j++){
        	var nowValue = parseFloat($(arr).eq(j).find("[name='goodsPrice']").text());
        	var nextValue = parseFloat($(arr).eq(j+1).find("[name='goodsPrice']").text());
            if(nowValue<nextValue){
            	$(arr).eq(j+1).after($(arr).eq(j));
            	arr = $("#table-spec>tbody>tr");
            }
        }
    }
}

/**
 * ROLL图片上传后显示
 */
function uploadImageAfter(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
					+ "\"id=\"rollPicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this));'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureUpload").before(pictureHtml);
	$("#div_pictureUpload").hide();
}

/**
 * ROLL背景图片上传后显示
 */
function uploadBgImageAfter(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
					+ "\"id=\"boxBgPicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delBgPicture($(this));'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureBgUpload").before(pictureHtml);
	$("#div_pictureBgUpload").hide();
	
	if ($.isBlank(url)) {
		delBgPicture($("#div_bg_pictures .actions"));
	}
}

/**
 * 加载ROLL信息
 */
function initRollInfo(){
	var rollId = $("#hid_rollId").val();
	if($.isBlank(rollId)){
		return;
	}
	$.gdAjax({
		url:"roll/edit/" + $("#hid_rollId").val(),
		type:"GET",
		success:function(data) {
			var info = data.result;
			$("#txt_rollTitile").val(info.rollTitile);
			$("#txt_rollSub").val(info.rollSub);
			$("#txt_rollStartTime").val(new Date(info.rollStartTime).Format("YYYY-MM-DD HH"));
			$("#txt_rollEndTime").val(new Date(info.rollEndTime).Format("YYYY-MM-DD HH"));
			uploadImageAfter(info.rollPicture);
			$("#txt_rechargeMoney").val(info.rechargeMoney);
			var infoGoodsArray = info.rollGoodsList;
			for (var i in infoGoodsArray) {
				goodsAdd(infoGoodsArray[i]);
			}
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	//验证 
	if(!validateRollTitile() || !validateRollSub() || !validateBoxPicture() || !validateRechargeMoney()
			|| !validateEndTime() || !validateEndTime() || !validateGoodsContent()){
		return;
	}
	// 排序
	pageSort();
	
	var info = new Object();
	// 判断是不是复制
	var copy = params["copy"];
	if (copy == "1") {
		var rollId = "";
	}
	else {
		var rollId = $("#hid_rollId").val();
	}
	if(!$.isBlank(rollId)) {
		info.rollId = rollId;
	}
	info.rollTitile = $("#txt_rollTitile").val();
	info.rollSub = $("#txt_rollSub").val();
	info.rollStartTimeString = $("#txt_rollStartTime").val();
	info.rollEndTimeString = $("#txt_rollEndTime").val();
	info.rollPicture = "";
	if (!$.isBlank($("#rollPicture").attr("data-url"))) {
		info.rollPicture = $("#rollPicture").attr("data-url");
	}
	info.rechargeMoney = $("#txt_rechargeMoney").val();
	var infoGoodsArray = new Array();
	var contentSize = $("#table-spec>tbody>tr").length;
	var rollGoodsCount = 0;
	var rollGoodsPrice = 0;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		if (i == 0) {
			info.field01 = $(trObj).find("td[data-level]").attr("data-level");
			info.field02 = $(trObj).find("td[data-pictrue]").attr("data-pictrue");
		}
		var infoGoods = new Object();
		infoGoods.goodsId = $(trObj).find("[name='chooseGoodsIdHidden']").val();
		infoGoods.rollGoodsIndex = i;
		infoGoodsArray.push(infoGoods);
		rollGoodsCount++;
		rollGoodsPrice += Number($(trObj).find("[name='goodsPrice']").text());
	}
	info.rollGoodsCount = rollGoodsCount;
	info.rollGoodsPrice = rollGoodsPrice;
	info.rollGoodsList = infoGoodsArray;
	$.gdAjax({
		url:"roll/save",
		data:info,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
			window.location.href = "roll_list.html";
		}
	});
}

/**
 * 装备等级列表
 */
function getGoodsLevelArray(){
	$.gdAjax({
		loading : false,
		url : "code/list/001",
		type : "GET", 
		success : function(data) {
			goodsLevelArray = data.result;
			initRollInfo();
		}
	});
}

/**
 * 增加一个装备
 */
function goodsAdd(info){
	
	// 如果此装备已添加，则不需要再重复添加
	var isExist = false;
	$("#table-spec input[name='chooseGoodsIdHidden']").each(function () {
		if ($(this).val() == info.goodsId) {
			isExist = true;
		}
	});
	if (isExist) {
		return;
	}
	
	var html = "<tr>";
	//计数器
	$("#tr_num").val(parseInt($("#tr_num").val()) + 1);
	var trNum = $("#tr_num").val();
	
	html += "<td class='text-center' name='goodsNo'><input name='chooseGoodsIdHidden' value='"+ info.goodsId +"' type='hidden'>";
	html += trNum;
	html += "</td>";
	var _goodsName = (info.goodsName == null ? "" : info.goodsName);
	var _goodsType = (info.goodsType01Name == null ? "" : info.goodsType01Name) + " | " + (info.goodsType02Name == null ? "" : info.goodsType02Name);
	html += "	<td scope='row' data-pictrue='" + info.goodsPicture + "'>";
	html += 			(info.goodsPicture == null ? "" : ("<img style='height: 50px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
	html += "&nbsp; " + _goodsName;
	html += "	</td>";
	html += "	<td scope='row'  >" + _goodsType + "</td>";
	html += "	<td scope='row' name='goodsPrice'>" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
	html += "	<td scope='row' data-level='" + info.goodsLevel + "'>" + (info.goodsLevelName == null ? "" : info.goodsLevelName) + "</td>";
	html += "	<td scope='row'  >" + (info.goodsWearName == null ? "" : info.goodsWearName) + "</td>";
	html += "	<td scope='row'  >" + ((info.statTrakFlag == null || !info.statTrakFlag) ? "" : "StatTrak") + "</td>";
	html += "	<td scope='row'  >" + ((info.marketHashName == null || !info.marketHashName) ? "" : info.marketHashName) + "</td>";
	html += "<td class='text-center'>";
	html += "	<a href='javascript:void(0)' onclick=\"removeSpec($(this), '" + info.goodsId + "');\">";
	html += "		<img src='media/images/spec-del.gif' border='0'>";
	html += "	</a>";
	html += "</td>";
	html += "</tr>";
	if($("#table-spec>tbody tr").length == 0){//第一次增加
		$("#table-spec>tbody").append(html);
	}else{
		$("#table-spec>tbody tr:last").after(html);
	}
}

/**
 * 装备图片上传
 * @param object
 */
function goodsPictureUpload(object) {
	$.uploadImage({
		success: function(result) {
			$(object).attr("data-url", result.replace(serverAddress.file, ''));
			$(object).text("重新上传");
		}
	})
}

/**
 * 移除table中一行规格
 * @param specObject
 * @param goodsId
 */
function removeSpec(specObject, goodsId){
	Modal.confirm({ message: "确定移除吗？" }).on(function (isOK) {
		if (isOK) {
			// 删除数据
			for (var index in chooseGoodsArray) {
				if (chooseGoodsArray[index].goodsId == goodsId) {
					if (index > -1) {
						chooseGoodsArray.splice(index, 1);
					}
				}
			}
			// 删除该行
			specObject.parent().parent().remove();
		}
	});
}

/**
 * 标题验证
 * @returns {Boolean}
 */
function validateRollTitile() {
	if($.isBlank($("#txt_rollTitile").val())){
		$("#txt_rollTitile").tipError("ROLL标题不能为空！");
		return false;
	}
	if($("#txt_rollTitile").val().length > 100){
		$("#txt_rollTitile").tipError("ROLL标题长度不能超过100！");
		return false;
	}
	return true;
}

/**
 * 子标题验证
 * @returns {Boolean}
 */
function validateRollSub() {
	if($.isBlank($("#txt_rollSub").val())){
		$("#txt_rollSub").tipError("ROLL子标题不能为空！");
		return false;
	}
	if($("#txt_rollSub").val().length > 100){
		$("#txt_rollSub").tipError("ROLL子标题长度不能超过100！");
		return false;
	}
	return true;
}

/**
 * validateStartTime验证
 */
function validateStartTime() {
	if($.isBlank($("#txt_rollStartTime").val())){
		$.alertError("ROLL开始时间不能为空！")
		return false;
	}
	return true;
}

/**
 * validateEndTime验证
 */
function validateEndTime() {
	if($.isBlank($("#txt_rollEndTime").val())){
		$.alertError("ROLL结束时间不能为空！")
		return false;
	}
	return true;
}



/**
 * ROLL图片验证
 * @returns {Boolean}
 */
function validateBoxPicture() {
	if($.isBlank($("#rollPicture").attr("data-url"))){
		$.alertError("ROLL图片不能为空！");
		return false;
	}
	return true;
}

/**
 * 门槛充值额:只能是数字(包括小数)
 * @returns {Boolean}
 */
function validateRechargeMoney(){
	if($.isBlank($("#txt_rechargeMoney").val())){
		$("#txt_rechargeMoney").tipError("门槛充值额不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#txt_rechargeMoney").val())){
		$("#txt_rechargeMoney").tipError("门槛充值额格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test($("#txt_rechargeMoney").val())){
		$("#txt_rechargeMoney").tipError("门槛充值额格式不正确，小数位最大为两位！");
		return false;
	}
	return true;
}

/**
 * ROLL内容检测
 */
function validateGoodsContent(){
	var contentSize = $("#table-spec>tbody>tr").length;
	if(contentSize == 0){
		$.alertError("ROLL内容至少有一件装备，请添加装备！");
		return false;
	}
	return true;
}

/**
 * 图片删除
 * @param object
 */
function delPicture(object){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#div_pictureUpload").show();
}

/**
 * 图片删除
 * @param object
 */
function delBgPicture(object){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#div_pictureBgUpload").show();
}

/**
 * 选择装备
 */
function chooseGoods() {
	getContentList();
	Modal.dialog({ 
        modalId: "choose_modal", 
        onReady : function () {
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
	obj.orderType = $.trim($("#search_Order").val());
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "goodsManager/list/8",
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
	$("#choose_modal .table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result) {
		var info = data.result[i];
		
		// 给选中的tr附上class
		var trClass = "";
		for (var index in chooseGoodsArray) {
			if (chooseGoodsArray[index].goodsId == info.goodsId) {
				trClass = "chooseTr";
			}
		}
		
		htmlContent += "<tr " + (!$.isBlank(trClass) ? "class=chooseTr" : "") + " onclick=\"chooseClick(this, '" + dealVal(info.goodsId) + "', '" + dealVal(info.goodsName) + "'" +
				", '" + dealVal(info.goodsPicture) + "', '" + dealVal(info.goodsType01Name) + "', '" + dealVal(info.goodsType02Name) + 
				"', '" + dealVal(info.goodsPrice) + "', '" + dealVal(info.goodsLevel) + "', '" + dealVal(info.goodsLevelName) + "', '" + dealVal(info.goodsWearName)  +
				"', '" + dealVal(info.statTrakFlag) + "', '" + dealVal(info.field01) + "')\">";
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
		htmlContent += "	<td scope='row'  >" + ((info.field01 == null || !info.field01) ? "" : info.field01) + "</td>";
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

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
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
 * 选中tr
 * @param obj
 */
function chooseClick(obj, goodsId, goodsName, goodsPicture, goodsType01Name
		, goodsType02Name, goodsPrice, goodsLevel, goodsLevelName, goodsWearName, statTrakFlag, marketHashName) {
	var entity = new Object();
	entity.goodsId = goodsId;
	entity.goodsName = goodsName;
	entity.goodsPicture = goodsPicture;
	entity.goodsType01Name = goodsType01Name;
	entity.goodsType02Name = goodsType02Name;
	entity.goodsPrice = goodsPrice;
	entity.goodsLevel = goodsLevel;
	entity.goodsLevelName = goodsLevelName;
	entity.goodsWearName = goodsWearName;
	entity.statTrakFlag = statTrakFlag;
	entity.marketHashName = marketHashName;
	if ($(obj).hasClass("chooseTr")) {
		$(obj).removeClass("chooseTr");
		for (var index in chooseGoodsArray) {
			if (chooseGoodsArray[index].goodsId == goodsId) {
				chooseGoodsArray.splice(index, 1);
				break;
			}
		}
	}
	else {
		$(obj).addClass("chooseTr");
		chooseGoodsArray.push(entity);
	}
}

/**
 * 选中商品后确认
 */
function chooseGoodOk() {
	for (var index in chooseGoodsArray) {
		goodsAdd(chooseGoodsArray[index]);
	}
	$("#close_ok_btn").click();
}
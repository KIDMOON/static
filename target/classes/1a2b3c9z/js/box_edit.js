var goodsLevelArray = new Array();
var chooseGoodsArray = new Array();

/**
 * 初始化
 */
$(function() {
	// 条件初始化
	var params = $.getArgs();
	// 箱子ID
	var boxId = params["boxId"];
	
	if(!$.isBlank(boxId)){
		$("#hid_boxId").val(boxId);
	}
	
	//获取所属列表
	getRegionList();
	
	//箱子名称验证
	$("#txt_boxName").blur(function () {
		if (validateBoxName()) {
			$(this).clearTip();
		}
	}); 
	
	//箱子价格验证
	$("#txt_boxPrice").blur(function () {
		if (validateBoxPrice()) {
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
				window.location.href = "box_list.html";
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
	
	// 自动分配权重
	$("#autoWeight").click(function () {
		// 排序
		pageSort();
		
		// 生成排序后的数组
		var dataArray00 = new Array();
		var dataArray01 = new Array();
		var contentSize = $("#table-spec>tbody>tr").length;
		for (var z=0; z<contentSize; z++) {
			var trObj = $("#table-spec>tbody>tr").eq(z);
			var _price = parseFloat($(trObj).find("[name='goodsPrice']").text());
			var _weight00IsZero = false;
			if (!$.isBlank($(trObj).find("[name='goodsWeight']").val()) && parseFloat($(trObj).find("[name='goodsWeight']").val()) == 0) {
				_weight00IsZero = true;
			}
			var _weight01IsZero = false;
			if (!$.isBlank($(trObj).find("[name='goodsWeight01']").val()) && parseFloat($(trObj).find("[name='goodsWeight01']").val()) == 0) {
				_weight01IsZero = true;
			}
			if (!_weight00IsZero) {
				dataArray00.push(_price);
			}
			if (!_weight01IsZero) {
				dataArray01.push(_price);
			}
		}
		
		// 验证
		if (!validateBoxCost()) {
			return;
		}
		if (!validateBoxContent(false)) {
			return;
		}
		
		// 1.预计会员成本价格分配权重
		var expectPrice = parseFloat($.trim($("#txt_field01").val()));
		var data = new Object();
		data.dataList = dataArray00;
		data.expectPrice = expectPrice;
		$.gdAjax({
			url:"box/calcWeight",
			type:"POST",
			data: data,
			success:function(data) {
				var result = data.result;
				for (var z=0,index = 0; z<result.length; z++,index++) {
					var _data = result[z];
					var weight00Obj = $("#table-spec>tbody>tr").eq(index).find("[name='goodsWeight']");
					if (!$.isBlank($(weight00Obj).val()) && parseFloat($(weight00Obj).val()) == 0) {
						z--;
					}
					else {
						$(weight00Obj).val((_data * 100).toFixed(5));
					}
				}
				goodsWeightChange();
			}
		});
		// 2.预计主播成本价格分配权重
		var expectPrice01 = parseFloat($.trim($("#txt_field04").val()));
		var data = new Object();
		data.dataList = dataArray01;
		data.expectPrice = expectPrice01;
		$.gdAjax({
			url:"box/calcWeight",
			type:"POST",
			data: data,
			success:function(data) {
				var result = data.result;
				for (var z=0,index = 0; z<result.length; z++,index++) {
					var _data = result[z];
					var weight01Obj = $("#table-spec>tbody>tr").eq(index).find("[name='goodsWeight01']");
					if (!$.isBlank($(weight01Obj).val()) && parseFloat($(weight01Obj).val()) == 0) {
						z--;
					}
					else {
						$(weight01Obj).val((_data * 100).toFixed(5));
					}
				}
				goodsWeightChange();
			}
		});
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
 * 箱子图片上传后显示
 */
function uploadImageAfter(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url) 
					+ "\"id=\"boxPicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this));'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureUpload").before(pictureHtml);
	$("#div_pictureUpload").hide();
}

/**
 * 箱子背景图片上传后显示
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
 * 加载箱子信息
 */
function initBoxInfo(){
	var boxId = $("#hid_boxId").val();
	if($.isBlank(boxId)){
		return;
	}
	$.gdAjax({
		url:"box/edit/" + $("#hid_boxId").val(),
		type:"GET",
		success:function(data) {
			var box = data.result;
			$("#box_region").val(box.regionId);
			showColumByRegion();
			$("#txt_boxName").val(box.boxName);
			uploadImageAfter(box.boxPicture);
			uploadBgImageAfter(box.field03);
			$("#txt_boxPrice").val(box.boxPrice);
			$("#txt_field01").val(box.field01);
			$("#txt_field04").val(box.field04);
			if ($("#txt_field05").is(':visible')) {
				$("#txt_field05").val(box.field05);
			}
			var boxGoodsArray = box.boxGoodsList;
			for (var i in boxGoodsArray) {
				goodsAdd(boxGoodsArray[i]);
			}
			goodsWeightChange();
			initGroupData(box.groupId);
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	//验证 
	if(!validateBoxName() || !validateBoxPicture() || !validateBoxPrice() || !validateBoxCost() 
			|| !validateField05() || !validateBoxContent(true)){
		return;
	}
	// 排序
	pageSort();
	
	var box = new Object();
	// 判断是不是复制
	var copy = params["copy"];
	if (copy == "1") {
		var boxId = "";
	}
	else {
		var boxId = $("#hid_boxId").val();
	}
	if(!$.isBlank(boxId)) {
		box.boxId = boxId;
	}
	box.regionId = $("#box_region").val();
	box.groupId = $("#box_group").val();
	box.boxName = $("#txt_boxName").val();
	box.boxPicture = "";
	box.field02 = "0";
	if (!$.isBlank($("#boxPicture").attr("data-url"))) {
		box.boxPicture = $("#boxPicture").attr("data-url");
	}
	box.boxPrice = $("#txt_boxPrice").val();
	box.field01 = $("#txt_field01").val();
	box.field03 = "";
	if (!$.isBlank($("#boxBgPicture").attr("data-url"))) {
		box.field03 = $("#boxBgPicture").attr("data-url");
	}
	box.field04 = $("#txt_field04").val();
	if ($("#txt_field05").is(':visible')) {
		box.field05 = $("#txt_field05").val();
	}
	var boxGoodsArray = new Array();
	var contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var boxGoods = new Object();
		boxGoods.goodsId = $(trObj).find("[name='chooseGoodsIdHidden']").val();
		boxGoods.goodsWeight = $(trObj).find("[name='goodsWeight']").val();
		boxGoods.goodsWeight01 = $(trObj).find("[name='goodsWeight01']").val();
		boxGoodsArray.push(boxGoods);
	}
	box.boxGoodsList = boxGoodsArray;
	$.gdAjax({
		url:"box/save",
		data:box,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
			window.location.href = "box_list.html";
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
			initBoxInfo();
		}
	});
}

/**
 * 装备类型列表
 */
function getRegionList(){
	$.gdAjax({
		loading : false,
		url : "region/list",
		type : "POST", 
		success : function(data) {
			initRegionHtml(data);
			//获取装备等级array
			getGoodsLevelArray();
		}
	});
}

/**
 * 加载装备类型列表
 * @param data
 */
function initRegionHtml(data) {
	var htmlContent = "";
	htmlContent += "<option value=''>请选择</option>";
	for(var i in data.result)	{
		var info = data.result[i];
		htmlContent += "<option value='" + info.regionId + "' data-type='" + info.field02 + "'>" + info.regionName + "</option>";	
	}	
	$("#box_region").html(htmlContent);
	//区域下拉change
	$("#box_region").change(function () {
		initGroupData("");
		showColumByRegion();
	})
}

/**
 * 根据选中属于，决定显示隐藏字段
 */
function showColumByRegion() {
	var regionType = $("#box_region option:selected").attr("data-type");
	if (regionType == '7') {
		$(".flash_box").addClass("flash_box_show");
	}
	else {
		$(".flash_box").removeClass("flash_box_show");
	}
}

/**
 * 动态加载group下拉
 */
function initGroupData(defaultVal) {
	if ($("#box_region").val() === "") {
		$("#box_group").val("");
		$("#box_group").hide();
		return;
	}
	$.gdAjax({
		url : "group/list",
		type : "POST",
		loading: true,
		success : function(data) {
			htmlContent = "";
			htmlContent += "<option value=''>请选择</option>";
			var num = 0;
			for(var i in data.result)	{
				var info = data.result[i];
				if (info.regionId === $("#box_region").val()) {
					num++;
					htmlContent += "<option value='" + info.groupId + "'>" + info.groupName + "</option>";	
				}
			}	
			$("#box_group").html(htmlContent);
			if (num > 0) {
				$("#box_group").val(defaultVal);
				$("#box_group").show();
			} else {
				$("#box_group").val("");
				$("#box_group").hide();
			}
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
	html += "	<td scope='row'  >";
	html += 			(info.goodsPicture == null ? "" : ("<img style='height: 50px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
	html += "&nbsp; " + _goodsName;
	html += "	</td>";
	html += "	<td scope='row'  >" + _goodsType + "</td>";
	html += "	<td scope='row' name='goodsPrice'>" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
	html += "	<td scope='row'  >" + (info.goodsLevelName == null ? "" : info.goodsLevelName) + "</td>";
	html += "	<td scope='row'  >" + (info.goodsWearName == null ? "" : info.goodsWearName) + "</td>";
	html += "	<td scope='row'  >" + ((info.statTrakFlag == null || !info.statTrakFlag) ? "" : "StatTrak") + "</td>";
	html += "	<td scope='row'  >" + ((info.marketHashName == null || !info.marketHashName) ? "" : info.marketHashName) + "</td>";
	html += "<td class='text-center'>";
	html += "		<input type='text' name='goodsWeight' class='form-control input-sm' value='" 
			+ ((info == null || info.goodsWeight == null) ? "" : info.goodsWeight) + "' onkeyup='goodsWeightChange();'>";
	html += "</td>";
	html += "<td class='text-center'>";
	html += "		<input type='text' name='goodsWeight01' class='form-control input-sm' value='" 
			+ ((info == null || info.goodsWeight01 == null) ? "" : info.goodsWeight01) + "' onkeyup='goodsWeightChange();'>";
	html += "</td>";
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
 * 计算中奖权重
 */
function goodsWeightChange() {
	
	var sum = 0;
	var price = 0;
	var contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var val_weight = parseFloat($(trObj).find("[name='goodsWeight']").val());
		var val_price = parseFloat($(trObj).find("[name='goodsPrice']").text());
		sum += val_weight;
		price += val_price * val_weight / 100;
	}
	$("#goodsWeightSum").html(sum.toFixed(2) + '%' + "<br />会员成本价:$" + price.toFixed(2));
	
	sum = 0;
	price = 0;
	contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var val_weight = parseFloat($(trObj).find("[name='goodsWeight01']").val());
		var val_price = parseFloat($(trObj).find("[name='goodsPrice']").text());
		sum += val_weight;
		price += val_price * val_weight / 100;
	}
	$("#goodsWeight01Sum").html(sum.toFixed(2) + '%' + "<br />主播成本价:$" + price.toFixed(2));
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
 * 装备名称验证
 * @returns {Boolean}
 */
function validateBoxName() {
	if($.isBlank($("#txt_boxName").val())){
		$("#txt_boxName").tipError("箱子名称不能为空！");
		return false;
	}
	if($("#txt_boxName").val().length > 60){
		$("#txt_boxName").tipError("箱子名称长度不能超过60！");
		return false;
	}
	return true;
}

/**
 * 箱子图片验证
 * @returns {Boolean}
 */
function validateBoxPicture() {
	if($.isBlank($("#boxPicture").attr("data-url"))){
		$.alertError("箱子图片不能为空！");
		return false;
	}
	return true;
}

/**
 * 箱子价格:只能是数字(包括小数)
 * @returns {Boolean}
 */
function validateBoxPrice(){
	if($.isBlank($("#txt_boxPrice").val())){
		$("#txt_boxPrice").tipError("箱子价格不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test($("#txt_boxPrice").val())){
		$("#txt_boxPrice").tipError("箱子价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test($("#txt_boxPrice").val())){
		$("#txt_boxPrice").tipError("箱子价格格式不正确，小数位最大为两位！");
		return false;
	}
	return true;
}

/**
 * 预计成本价格检查
 */
function validateBoxCost() {
	var expectPrice = parseFloat($.trim($("#txt_field01").val()));
	if ($.isBlank(expectPrice)) {
		$("#txt_field01").tipError("预计会员成本价格不能为空！");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test(expectPrice)){
		$("#txt_field01").tipError("预计会员成本价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test(expectPrice)){
		$("#txt_field01").tipError("预计会员成本价格格式不正确，小数位最大为两位！");
		return false;
	}
	
	var expectPrice01 = parseFloat($.trim($("#txt_field04").val()));
	if ($.isBlank(expectPrice01)) {
		$("#txt_field04").tipError("预计主播成本价格不能为空！");
		return false;
	}
	reg = /^\d+(\.\d+)?$/;
	if(!reg.test(expectPrice01)){
		$("#txt_field04").tipError("预计主播成本价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test(expectPrice01)){
		$("#txt_field04").tipError("预计主播成本价格格式不正确，小数位最大为两位！");
		return false;
	}
	return true;
}

/**
 * 奖池大小:只能是数字(包括小数)
 * @returns {Boolean}
 */
function validateField05(){
	if (!$("#txt_field05").is(':visible')) {
		return true;
	}
	if($.isBlank($("#txt_field05").val())){
		$("#txt_field05").tipError("库存不能为空！");
		return false;
	}
	if(Number($("#txt_field05").val())%1 !== 0){
		$("#txt_field05").tipError("库存格式不正确！");
		return false;
	} 
	return true;
}

/**
 * 箱子内容检测
 * @returns {Boolean}
 */
function validateBoxContent(checkWeight){
	var contentSize = $("#table-spec>tbody>tr").length;
	if(contentSize == 0){
		$.alertError("箱子内容至少有一件装备，请添加装备！");
		return false;
	}
	if (checkWeight && $("#goodsWeightSum").text().indexOf("100.00%") == -1) {
		$.alertError("箱子内容的所有装备的权重合应该为100%！");
		return false;
	}
	// 是否有奖池箱子-中奖装备
	var poolGoodsNum = 0;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		if($(trObj).find("[name='goodsField01']").is(':checked')) {
			poolGoodsNum++;
		}
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
				"', '" + dealVal(info.goodsPrice) + "', '" + dealVal(info.goodsLevelName) + "', '" + dealVal(info.goodsWearName)  +
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
		, goodsType02Name, goodsPrice, goodsLevelName, goodsWearName, statTrakFlag, marketHashName) {
	var entity = new Object();
	entity.goodsId = goodsId;
	entity.goodsName = goodsName;
	entity.goodsPicture = goodsPicture;
	entity.goodsType01Name = goodsType01Name;
	entity.goodsType02Name = goodsType02Name;
	entity.goodsPrice = goodsPrice;
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
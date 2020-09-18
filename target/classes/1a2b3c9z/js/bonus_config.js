/**
 * 初始化
 */
$(function() {

	initBonusInfo();

	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		//保存装备信息
		saveDetailData();
	});

	// 添加装备
	$("#btn_bonus_add").click(function() {
		bonusAdd(new Object());
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
			var _price = parseFloat($(trObj).find("[name='bonusPrice']").val());
			var _weight00IsZero = false;
			if (!$.isBlank($(trObj).find("[name='bonusWeight']").val()) && parseFloat($(trObj).find("[name='bonusWeight']").val()) == 0) {
				_weight00IsZero = true;
			}
			var _weight01IsZero = false;
			if (!$.isBlank($(trObj).find("[name='bonusWeight01']").val()) && parseFloat($(trObj).find("[name='bonusWeight01']").val()) == 0) {
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
		if (!validateBonusCost()) {
			return;
		}
		if (!validateBonusContent(false)) {
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
					var weight00Obj = $("#table-spec>tbody>tr").eq(index).find("[name='bonusWeight']");
					if (!$.isBlank($(weight00Obj).val()) && parseFloat($(weight00Obj).val()) == 0) {
						z--;
					}
					else {
						$(weight00Obj).val((_data * 100).toFixed(5));
					}
				}
				bonusWeightChange();
			}
		});
		// 2.预计主播成本价格分配权重
		var expectPrice01 = parseFloat($.trim($("#txt_field02").val()));
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
					var weight01Obj = $("#table-spec>tbody>tr").eq(index).find("[name='bonusWeight01']");
					if (!$.isBlank($(weight01Obj).val()) && parseFloat($(weight01Obj).val()) == 0) {
						z--;
					}
					else {
						$(weight01Obj).val((_data * 100).toFixed(5));
					}
				}
				bonusWeightChange();
			}
		});
	});

});

/**
 * 排序
 */
function pageSort() {
	var arr = $("#table-spec>tbody>tr");
	for(i=0;i<arr.length-1;i++){
        for(j=0;j<arr.length-1-i;j++){
        	var nowValue = parseFloat($(arr).eq(j).find("[name='bonusPrice']").val());
        	var nextValue = parseFloat($(arr).eq(j+1).find("[name='bonusPrice']").val());
            if(nowValue<nextValue){
            	$(arr).eq(j+1).after($(arr).eq(j));
            	arr = $("#table-spec>tbody>tr");
            }
        }
    }
}

/**
 * 加载奖金信息
 */
function initBonusInfo(){
	$.gdAjax({
		url:"bonusConfig/edit/",
		type:"GET",
		success:function(data) {
			var bonusConfig = data.result;
			if (bonusConfig == null) {
				return;
			}
			$("#txt_cycleHour").val(bonusConfig.cycleHour);
			$("#txt_field01").val(bonusConfig.field01);
			$("#txt_field02").val(bonusConfig.field02);
			var bonusConfigDetailList = bonusConfig.bonusConfigDetailList;
			for (var i in bonusConfigDetailList) {
				bonusAdd(bonusConfigDetailList[i]);
			}
			bonusWeightChange();
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	//验证 
	if(!validateCycleHour() || !validateBonusCost()|| !validateBonusContent(true)){
		return;
	}
	// 排序
	pageSort();
	
	var bonusConfig = new Object();
	bonusConfig.cycleHour = $("#txt_cycleHour").val();
	bonusConfig.field01 = $("#txt_field01").val();
	bonusConfig.field02 = $("#txt_field02").val();
	var bonusConfigDetailList = new Array();
	var contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var bonusConfigGoods = new Object();
		bonusConfigGoods.bonusPrice = $(trObj).find("[name='bonusPrice']").val();
		bonusConfigGoods.bonusWeight = $(trObj).find("[name='bonusWeight']").val();
		bonusConfigGoods.bonusWeight01 = $(trObj).find("[name='bonusWeight01']").val();
		bonusConfigDetailList.push(bonusConfigGoods);
	}
	bonusConfig.bonusConfigDetailList = bonusConfigDetailList;
	$.gdAjax({
		url:"bonusConfig/save",
		data:bonusConfig,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
		}
	});
}

/**
 * 增加一行
 */
function bonusAdd(info){
	
	var html = "<tr>";
	//计数器
	$("#tr_num").val(parseInt($("#tr_num").val()) + 1);
	var trNum = $("#tr_num").val();
	
	html += "<td class='text-center' name='bonusNo'>";
	html += trNum;
	html += "</td>";
	html += "<td class='text-center'>";
	html += "		<input type='text' name='bonusPrice' class='form-control input-sm' value='"
		+ ((info == null || info.bonusPrice == null) ? "" : info.bonusPrice) + "' onkeyup='bonusWeightChange();'>";
	html += "</td>";
	html += "<td class='text-center'>";
	html += "		<input type='text' name='bonusWeight' class='form-control input-sm' value='" 
			+ ((info == null || info.bonusWeight == null) ? "" : info.bonusWeight) + "' onkeyup='bonusWeightChange();'>";
	html += "</td>";
	html += "<td class='text-center'>";
	html += "		<input type='text' name='bonusWeight01' class='form-control input-sm' value='" 
			+ ((info == null || info.bonusWeight01 == null) ? "" : info.bonusWeight01) + "' onkeyup='bonusWeightChange();'>";
	html += "</td>";
	html += "<td class='text-center'>";
	html += "	<a href='javascript:void(0)' onclick=\"removeSpec($(this), '" + info.bonusId + "');\">";
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
 * 计算中奖权重
 */
function bonusWeightChange() {
	
	var sum = 0;
	var price = 0;
	var contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var val_weight = parseFloat($(trObj).find("[name='bonusWeight']").val());
		var val_price = parseFloat($(trObj).find("[name='bonusPrice']").val());
		sum += val_weight;
		price += val_price * val_weight / 100;
	}
	$("#bonusWeightSum").html(sum.toFixed(2) + '%' + "<br />会员成本价:$" + price.toFixed(2));
	
	sum = 0;
	price = 0;
	contentSize = $("#table-spec>tbody>tr").length;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		var val_weight = parseFloat($(trObj).find("[name='bonusWeight01']").val());
		var val_price = parseFloat($(trObj).find("[name='bonusPrice']").text());
		sum += val_weight;
		price += val_price * val_weight / 100;
	}
	$("#bonusWeight01Sum").html(sum.toFixed(2) + '%' + "<br />主播成本价:$" + price.toFixed(2));
}

/**
 * 移除table中一行规格
 * @param specObject
 * @param bonusId
 */
function removeSpec(specObject, bonusId){
	Modal.confirm({ message: "确定移除吗？" }).on(function (isOK) {
		if (isOK) {
			// 删除该行
			specObject.parent().parent().remove();
		}
	});
}

/**
 * 预计成本价格检查
 */
function validateBonusCost() {
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
	
	var expectPrice01 = parseFloat($.trim($("#txt_field02").val()));
	if ($.isBlank(expectPrice01)) {
		$("#txt_field02").tipError("预计主播成本价格不能为空！");
		return false;
	}
	reg = /^\d+(\.\d+)?$/;
	if(!reg.test(expectPrice01)){
		$("#txt_field02").tipError("预计主播成本价格格式不正确！");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test(expectPrice01)){
		$("#txt_field02").tipError("预计主播成本价格格式不正确，小数位最大为两位！");
		return false;
	}
	return true;
}

/**
 * 奖金周期
 * @returns {Boolean}
 */
function validateCycleHour(){
	if($.isBlank($("#txt_cycleHour").val())){
		$("#txt_cycleHour").tipError("奖金周期不能为空！");
		return false;
	}
	if(Number($("#txt_cycleHour").val())%1 !== 0){
		$("#txt_cycleHour").tipError("奖金周期格式不正确！");
		return false;
	} 
	return true;
}

/**
 * 奖金内容检测
 * @returns {Boolean}
 */
function validateBonusContent(checkWeight){
	var contentSize = $("#table-spec>tbody>tr").length;
	if(contentSize == 0){
		$.alertError("奖金内容至少有一件，请添加！");
		return false;
	}
	if (checkWeight && $("#bonusWeightSum").text().indexOf("100.00%") == -1) {
		$.alertError("奖金内容的所有的权重合应该为100%！");
		return false;
	}
	// 是否有奖池奖金-中奖装备
	var poolGoodsNum = 0;
	for (var i=0; i<contentSize; i++) {
		var trObj = $("#table-spec>tbody>tr").eq(i);
		if($(trObj).find("[name='bonusField01']").is(':checked')) {
			poolGoodsNum++;
		}
	}
	return true;
}

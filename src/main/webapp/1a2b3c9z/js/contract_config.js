/**
 * 初始化
 */
$(function() {
	
	initConfigInfo();
	
	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		//保存装备信息
		saveDetailData();
	});
});

/**
 * 加载信息
 */
function initConfigInfo(){
	$.gdAjax({
		url:"contractManager/findConfig",
		type:"GET",
		success:function(data) {
			var info = data.result;
			$("#txt_weight01").val(info.weight01);
			$("#txt_weight02").val(info.weight02);
			$("#txt_weight03").val(info.weight03);
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	var info = new Object();
	info.weight01 = $("#txt_weight01").val();
	info.weight02 = $("#txt_weight02").val();
	info.weight03 = $("#txt_weight03").val();
	//验证 
	if(!validateWeight(info.weight01, "50-100倍数权重") || !validateWeight(info.weight02, "100-200倍数权重") 
			|| !validateWeight(info.weight03, "200-300倍数权重")){
		return;
	}
	if ((Number(info.weight01) + Number(info.weight02) + Number(info.weight03)) != 100) {
		$.alertError("三个区间区间加起来必须为100");
		return;
	}
	info.openFlag = (info.openFlag == "1"?true:false);
	$.gdAjax({
		url:"contractManager/saveConfig",
		data:info,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
		}
	});
}

/**
 * check
 * @returns {Boolean}
 */
function validateWeight(val, txt){
	if($.isBlank(val)){
		$.alertError(txt + "不能为空");
		return false;
	}
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test(val)){
		$.alertError(txt + "格式不正确");
		return false;
	} 
	var txt_poolWeight = Number(val);
	if(txt_poolWeight > 100 || txt_poolWeight < 0){
		$.alertError(txt + "只能输入0-100的数字");
		return false;
	}
	return true;
}

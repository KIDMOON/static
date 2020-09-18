var goodsLevelArray = new Array();

/**
 * 初始化
 */
$(function() {
	
	// 加载下拉
	getBoxList();
	
	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		//保存装备信息
		saveDetailData();
	});
});

/**
 * 加载箱子下拉
 */
function getBoxList(){
	var data = new Object();
	data.param = "5";
	$.gdAjax({
		url : "box/listallbytype",
		type: "POST",
		data:data,
		success:function(data) {
			var _html = "<option value=''>请选择</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.boxId + "'>" + info.boxName + "</option>";
			} 
			$("#save_boxId01, #save_boxId02, #save_boxId03").html(_html);
			
			initConfigInfo();
		}
	});
}

/**
 * 加载信息
 */
function initConfigInfo(){
	$.gdAjax({
		url:"everydayFreebox/findConfig",
		type:"GET",
		success:function(data) {
			var infoList = data.result;
			if (!$.isBlank(infoList)) {
				for (var i in infoList) {
					var info = infoList[i];
					if (info.field01 === "0") {
						$("#save_boxId01").val(info.boxId);
					}
					else if (info.field01 === "1") {
						$("#save_boxId02").val(info.boxId);
					}
					else if (info.field01 === "2") {
						$("#txt_rechargeMoney").val(info.rechargeMoney);
						$("#save_boxId03").val(info.boxId);
					}
				}
			}
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	var infoList = new Array();

	var info01 = new Object();
	info01.boxId = $("#save_boxId01").val();
	info01.field01 = "0";
	infoList.push(info01);

	var info02 = new Object();
	info02.boxId = $("#save_boxId02").val();
	info02.field01 = "1";
	infoList.push(info02);

	var info03 = new Object();
	info03.rechargeMoney = $("#txt_rechargeMoney").val();
	info03.field01 = "2";
	info03.boxId = $("#save_boxId03").val();
	infoList.push(info03);

	//验证 
	if(!validateTxt(info01.boxId, "赠送箱子")){
		return;
	}
	if(!validateTxt(info02.boxId, "赠送箱子")){
		return;
	}
	if(!validateTxt(info03.rechargeMoney, "充值满")){
		return;
	}
	if(!validateTxt(info03.boxId, "赠送箱子")){
		return;
	}
	$.gdAjax({
		url:"everydayFreebox/saveConfig",
		data:infoList,
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
function validateTxt(val, txt) {
	if($.isBlank(val)){
		$.alertError(txt + "不能为空");
		return false;
	}
	return true;
}

/**
 * check
 * @returns {Boolean}
 */
function validatePrice(val, txt){
	if($.isBlank(val)){
		$.alertError(txt + "不能为空");
		return false;
	}
	val = val.replace("-", "");
	var reg = /^\d+(\.\d+)?$/;
	if(!reg.test(val)){
		$.alertError(txt + "格式不正确");
		return false;
	} 
	reg = /^[0-9]+(.[0-9]{0,2})?$/;
	//最多包含两位小数
	if(!reg.test(val)){
		$.alertError(txt + "格式不正确，小数位最大为两位");
		return false;
	}
	return true;
}

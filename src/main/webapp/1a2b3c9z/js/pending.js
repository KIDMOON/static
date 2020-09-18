var type = 0;
/**
 * 初始化
 */
$(function() {
	
	// 条件初始化
	var params = $.getArgs();
	type = params["type"];
	
	// 加载查询条件
	initSearchCondition();
	
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});
	
	$("#modal_edit_btn").click(function () {
		var steamcode = $.trim($("#update_Field03").val());
		if ($.isBlank(steamcode)) {
			$("#update_Field03").tipError("Steam充值码不能为空！");
			return;
		}
		var param = new Object();
		param.userGoodsId = $("#update_UserGoodsId").val();
		param.field03 = steamcode;
		$.gdAjax({
			url : "usergoods/deliverySteam",
			type : "POST",
			data: param,
			success : function(data) {
				$.alertSuccess("发货成功！");
				// 加载数据
				getContentList();
				$("#close_update_btn").click();
			}
		});
	});
	
	// 批量发货
	$("#btn_multiDelivery").click(function(){
		var ids = getCheckedBox();		
		multiDelivery(ids);	
	});
	
	//全选checkbox
	$("#selectAll").click(function(){		
		$("input[name='PId']").checkAll($("input[id='selectAll']").is(':checked'));	
	});
});

/**
 * 获取区域下拉查询条件
 */
function initSearchCondition() {
	$.gdAjax({
		url : "region/list",
		type : "POST", 
		success : function(data) {
			var _html = "<option value=''>属于</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.regionId + "'>" + info.regionName + "</option>";
			} 
			$("#select_regionId").html(_html);
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	var regionId = $.trim($("#select_regionId").val());
	var nickName = $.trim($("#text_nickName").val());
	var boxName = $.trim($("#text_boxName").val());
	var goodsName = $.trim($("#text_goodsName").val());
	obj.regionId = regionId;
	obj.nickName = nickName;
	obj.boxName = boxName;
	obj.goodsName = goodsName;
	obj.field01 = $("#select_status").val();
	obj.stat = true;
	obj.type = type;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "usergoods/list",
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
	if (data.result == null) {
		$("#amount-div").text("待发货合计：0");
		$(".table-bordered>tbody").html("");
		data.htmlContent = "";
		$(".table-bordered").initTable(data);
		return;
	}
	$("#amount-div").text("待发货合计：" + data.result.amount);
	$(".table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result.recordList) {
		var info = data.result.recordList[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style=' text-align:center; '><input name='PId' value='"+ info.userGoodsId +"' type='checkbox'></td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>"));
		htmlContent += "&nbsp; " + (info.nickName == null ? "" : info.nickName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >累计充值$" + (info.moneyFirstAll == null ? "0.00" : info.moneyFirstAll) + "<br />总发货$" 
						+ (info.goods002SumPrice == null ? "0.00" : info.goods002SumPrice) + "<br />等待发货$" 
						+ (info.goods001SumPrice == null ? "0.00" : info.goods001SumPrice) + "<br>背包$" 
						+ (info.goods000SumPrice == null ? "0.00" : info.goods000SumPrice) + "</td>";
		var belong = "";
		if (info.userGoodsType == "0") {
			belong = info.regionName;
		}
		else if (info.userGoodsType == "1") {
			belong = "兑换专区";
		}
		else if (info.userGoodsType == "2") {
			belong = "积分抽奖";
		}
		else if (info.userGoodsType == "3") {
			belong = "淘汰合同";
		}
		htmlContent += "	<td scope='row'  >" + belong + "</td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.boxPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.boxPicture + "'>"));
		htmlContent += "&nbsp; " + (info.boxName == null ? "" : info.boxName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + (info.boxPrice == null ? "" : ("$" + info.boxPrice)) + "</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsWearName = (info.goodsWearName == null ? "" : (" | " + info.goodsWearName));
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
		htmlContent += "&nbsp; " + _goodsName + _goodsWearName;
		if (!$.isBlank(info.field03)) {
			htmlContent += "（兑换码" + info.field03 + "）";
		}
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >$" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.field02 == null ? "" : info.field02) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.contact == null ? "" : info.contact) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";

		htmlContent += "	<td>";
		if (info.field03 == "0") {
			htmlContent += "机器人发货中(排队执行中)";
		} else if (info.field03 == "11") {
			htmlContent += "机器人发货中(提交报价中)";
		} else if (info.field03 == "12") {
			htmlContent += "机器人发货中(报价发起成功)";
		} else if (info.field03 == "13") {
			htmlContent += "机器人发货中(等待客户接收报价)";
		} else if (info.field03 == "2") {
			htmlContent += "机器人发货失败(可能未打开隐私)";
		}
		htmlContent	+= "	</td>";

		htmlContent += "	<td>";
		if (info.field01 == '001') {
			htmlContent += "		<a href='#' onclick=\"delivery('" + info.userGoodsId + "')\">手动发货  </a><br />";
			htmlContent += "		<a href='#' onclick=\"robotSend('" + info.userId + "', '" + info.userGoodsId + "')\">机器人发货  </a><br />";
			htmlContent += "		<a href='#' onclick=\"deleteUserGoods('" + info.userGoodsId + "')\">删除</a>";
		}

		htmlContent += "	</td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
}

function deleteUserGoods(id) {
	Modal.confirm({ message: "确定删除吗？" }).on(function (isOK) {
		if (isOK) {
			var ids = new Array();
			ids.push(id);
			var object = new Object();
			object.ids = ids;
			$.gdAjax({
				url : "usergoods/del/",
				type : "POST",
				data: object,
				success : function(data) {
					$.alertSuccess("删除成功！");
					// 加载数据
					getContentList();
				}
			});
		}
	});	
}

function deliverySteam(id) {
	Modal.dialog({ 
        modalId: "update_modal", 
        onReady : function () {
        	$("#update_UserGoodsId").clearTip();
        	$("#update_UserGoodsId").val(id);
        	$("#update_Field03").clearTip();
        }
    });
}

function delivery(id) {
	Modal.confirm({ message: "确定手动发货吗？" }).on(function (isOK) {
		if (isOK) {
			$.gdAjax({
				url : "usergoods/delivery/" + id,
				type : "GET",
				success : function(data) {
					if (!$.isBlank(data.message)) {
						$.alertSuccess(data.message);
					}
					// 加载数据
					getContentList();
				},
				faild : function(data) {
					// 加载数据
					getContentList();
				}
			});
		}
	});	
}

function robotSend(userId, id) {
	Modal.confirm({ message: "确定执行机器人发货吗？" }).on(function (isOK) {
		if (isOK) {
			$.gdAjax({
				url : "usergoods/robotSend/" + userId + "/" + id,
				type : "GET",
				success : function(data) {
					if (!$.isBlank(data.message)) {
						$.alertSuccess(data.message);
					}
					// 加载数据
					getContentList();
				},
				faild : function(data) {
					// 加载数据
					getContentList();
				}
			});
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
 * 批量发货
 */
function multiDelivery(ids){	
	if(ids == null){
		return;
	}
	Modal.confirm({ message: "确定执行批量发货操作吗？" }).on(function (isOK) {
		if (isOK) {
			var data = new Object();
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			data.param = new Object();
			$.gdAjax({
				url : "usergoods/delivery",
				type: "POST",
				data : data,
				success : function(data) {
					if (!$.isBlank(data.message)) {
						$.alertSuccess(data.message);
					}
					// 加载数据
					getContentList();
				},
				faild : function(data) {
					// 加载数据
					getContentList();
				}
			});
		}
	});	
}
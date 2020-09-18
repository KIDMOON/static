/**
 * 初始化
 */
$(function() {
	
	// 加载查询条件
	initSearchCondition();
	
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});
	
	// 新增
	$("#btn_add").click(function () {
		saveNewModal();
	});
	
	// 保存
	$("#modal_add_btn").click(function () {
		saveUserGoods();
	});
	
});

/**
 * 加载用户下拉
 */
function getUserList() {
	var data = new Object();
	var obj = new Object();
	obj.nickName = "";
	data.param = obj;
	$.gdAjax({
		url : "user/listall",
		data : data,
		type : "POST",
		success : function(data) {
			var _html = "<option value=''>请选择</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.userId + "'>" 
						+ ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) 
						+ " | "
						+ info.nickName + "</option>";
			} 
			$("#save_UserId").html(_html);
		}
	});
}

/**
 * 加载箱子下拉
 */
function getBoxList(){
	var save_RegionId = $("#save_RegionId").val();
	if ($.isBlank(save_RegionId)) {
		return;
	}
	var data = new Object();
	var object = new Object();
	object.regionId = save_RegionId;
	data.param = object;
	$.gdAjax({
		url : "box/listall",
		type: "POST",
		data:data,
		success:function(data) {
			var _html = "<option value=''>请选择</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.boxId + "'>" + info.boxName + "</option>";
			} 
			$("#save_BoxId").html(_html);
			$("#save_BoxId").change(function () {
				getGoodsList();
			});
		}
	});
}

/**
 * 加载装备下拉
 */
function getGoodsList(){
	var save_BoxId = $("#save_BoxId").val();
	if($.isBlank(save_BoxId)){
		return;
	}
	$.gdAjax({
		url:"box/edit/" + save_BoxId,
		type:"GET",
		success:function(data) {
			var box = data.result;
			var goodsArray = box.goodsList;
			var _html = "<option value=''>请选择</option>";
			for ( var i in goodsArray) {
				var info = goodsArray[i];
				_html += "<option value='" + info.goodsId + "'>" + info.goodsName + "</option>";
			} 
			$("#save_GoodsId").html(_html);
		}
	});
}

/**
 * 添加模态框
 */
function saveNewModal() {
	getUserList();
	Modal.dialog({ 
		modalId: "add_modal", 
		onReady : function () {
            $("#save_UserId").val('');
            $("#save_UserId").clearTip();
            $("#save_RegionId").val('');
            $("#save_RegionId").clearTip();
            $("#save_BoxId").val('');
            $("#save_BoxId").clearTip();
            $("#save_GoodsId").val('');
            $("#save_GoodsId").clearTip();
            $("#save_BoxId").html("<option value=''>请选择</option>");
            $("#save_GoodsId").html("<option value=''>请选择</option>");
		}
	});
}

/**
 * 保存数据
 */
function saveUserGoods() {
	var data = new Object();
	var save_UserId = $.trim($("#save_UserId").val());
	var save_RegionId = $.trim($("#save_RegionId").val());
	var save_BoxId = $.trim($("#save_BoxId").val());
	var save_GoodsId = $.trim($("#save_GoodsId").val());
	
	if($.isBlank(save_UserId)){
		$("#save_UserId").tipError("用户不能为空！");
		return;
	}
	if($.isBlank(save_RegionId)){
		$("#save_RegionId").tipError("属于不能为空！");
		return;
	}
	if($.isBlank(save_BoxId)){
		$("#save_BoxId").tipError("箱子不能为空！");
		return;
	}
	if($.isBlank(save_GoodsId)){
		$("#save_GoodsId").tipError("装备不能为空！");
		return;
	}
	
	data.userId = save_UserId;
	data.boxId = save_BoxId;
	data.goodsId = save_GoodsId;
	data.field01 = "000";
	$.gdAjax({
		url : "usergoods/save",
		data : data,
		type : "POST",
		success : function(data) {
			getContentList();
			$("#close_save_btn").click();
		}
	});
}

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
			$("#select_regionId, #save_RegionId").html(_html);
			$("#save_RegionId").change(function (){
				$("#save_BoxId").html("<option value=''>请选择</option>");
	            $("#save_GoodsId").html("<option value=''>请选择</option>");
				getBoxList();
			})
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
	$(".table-bordered>tbody").html("");
	var htmlContent = "";
	for ( var i in data.result.recordList) {
		var info = data.result.recordList[i];
		htmlContent += "<tr>";
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>"));
		htmlContent += "&nbsp; " + (info.nickName == null ? "" : info.nickName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + (info.regionName == null ? "" : info.regionName) + "</td>";
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.boxPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.boxPicture + "'>"));
		htmlContent += "&nbsp; " + (info.boxName == null ? info.keyName : info.boxName);
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >" + (info.boxPrice == null ? "" : ("$" + info.boxPrice)) + "</td>";
		var _goodsName = (info.goodsName == null ? "" : info.goodsName);
		var _goodsWearName = (info.goodsWearName == null ? "" : (" | " + info.goodsWearName));
		htmlContent += "	<td scope='row'  >";
		htmlContent += 			(info.goodsPicture == null ? "" : ("<img style='height: 60px;' src='" + serverAddress.file + info.goodsPicture + "'>"));
		htmlContent += "&nbsp; " + _goodsName + _goodsWearName;
		htmlContent += "	</td>";
		htmlContent += "	<td scope='row'  >$" + (info.goodsPrice == null ? "" : info.goodsPrice) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getContentList();
}

/**
 * 初始化
 */
$(function() {
	
	// 点击生成
	$("#add_btn").click(function () {
		saveNewModal();
	});

	// 生成
	$("#modal_add_btn").click(function () {
		generate();
	});
	
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});

	//全选checkbox
	$("#selectAll").click(function(){
		$("input[name='PId']").checkAll($("input[id='selectAll']").is(':checked'));
	});

	// 复制
	$("#copy_btn").click(function(){
		var ids = getCheckedBox();
		if (ids == null) {
			return;
		}
		var _text = "";
		$(".table-bordered>tbody tr").each(function(){
			if($(this).find("input:checkbox").is(":checked")) {
				_text += $(this).find("td[class='recharge_card']").text() + "\r\n";
			}
		});
		$("#copy_btn").attr("data-clipboard-text", _text);
		var clipboard = new ClipboardJS("#copy_btn");
		clipboard.on('success', function(e) {
			$.alertSuccess("复制成功");
		});
		clipboard.on('error', function(e) {
			$.alertError("复制失败");
		});
	});

	// 批量删除
	$("#btn_multiDelete").click(function(){
		var ids = getCheckedBox();
		multiInfo(ids);
	});
});

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
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	var obj = new Object();
	var useFlagStr = $("#select_use_flag").val();
	if (!$.isBlank(useFlagStr)) {
		obj.useFlag = useFlagStr == "1" ? true : false;
	}
	data.param = obj;
	
	$.gdAjax({
		url : "rechargeCard/list",
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
			"<input name='PId' value='"+ info.rechargeCardId +"' type='checkbox'>" +
			"</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.rechargeCardId == null ? "" : info.rechargeCardId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.rechargeCardAmount == null ? "" : info.rechargeCardAmount) + "</td>";
		htmlContent += "	<td scope='row' class='recharge_card'>" + (info.rechargeCardContent == null ? "" : info.rechargeCardContent) + "</td>";
		htmlContent += "	<td scope='row'  >" + ((info.useFlag == null || !info.useFlag) ? "未使用" : "已使用") + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.useUserId == null ? "" : ("<img style='height: 60px;' src='" + info.useUserAvatar + "'>&nbsp; " + (info.useUserNickName == null ? "" : info.useUserNickName))) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td>";
		if (info.useFlag == null || !info.useFlag) {
			htmlContent += "        <a href='#' onclick=\"delInfo('" + info.rechargeCardId + "')\">删除</a>";
		}
		htmlContent += "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
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
				url   :"rechargeCard/del",
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
				url   :"rechargeCard/del",
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
            $("#save_RechargeCardAmount").val('');
            $("#save_RechargeCardAmount").clearTip();
            $("#save_Count").val('');
            $("#save_Count").clearTip();
		}
	});
}

/**
 * 生成
 */
function generate() {
	var rechargeCardAmount = $("#save_RechargeCardAmount").val();
	var count = $("#save_Count").val();
	$.gdAjax({
		url   :"rechargeCard/generate/" + rechargeCardAmount + "/" + count,
		type : "POST",
		success : function(data) {
			$("#close_save_btn").click();
			getContentList();
		}
	});
}

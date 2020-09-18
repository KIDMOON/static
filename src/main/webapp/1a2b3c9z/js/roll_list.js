/**
 * 初始化
 */
$().ready(function (){
	// 条件初始化
	var params = $.getArgs();
	var pageIndex = params["pageIndex"];
	if (!$.isBlank(pageIndex)) {
		$("#hid_pageIndex").val(parseFloat(pageIndex));
	}
	
	// 加载列表记录
	getRollList();
	
	//查询
	$("#btn-search").click(function() {
		//根据条件查询数据
		getRollList();
	});
	
	$("#btn_add").click(function () {
		addInfo();
	})
	
	//全选checkroll
	$("#selectAll").click(function(){		
		$("input[name='PId']").checkAll($("input[id='selectAll']").is(':checked'));	
	});
	
	// 批量删除
	$("#btn_multiDelete").click(function(){
		var ids = getCheckedRoll();		
		multiInfo(ids);	
	});

});

/**
 * 获取数据列表
 */
function getRollList(){
	var data = new Object();
	var object = new Object();
	object.rollTitile = $.trim($("#text_rollTitile").val())
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = object;
	$.gdAjax({
		url : "roll/list",
		type: "POST",
		data:data,
		success:function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 加载数据列表
 * @param data
 */
function initHtmlData(data) {
	// 清空table内容
	$(".table-bordered>tbody").html("");
	var htmlContent = "";

	for (var i in data.result) {
		var info = data.result[i];
		htmlContent += "<tr>";
		htmlContent += "<td scope='row' style=' text-align:center; '>" +
							"<input name='PId' value='"+ info.rollId +"' type='checkbox'>" +
						"</td>";
		
		htmlContent += "<td scope='row'>";
		htmlContent += "<span>"+info.rollTitile+"</span>";
		htmlContent += "</td>";
		
		htmlContent += "<td scope='row'>";
		htmlContent += "<span>"+info.rollSub+"</span>";
		htmlContent	+= "</td>";
		
		htmlContent += "<td scope='row'>";
		htmlContent += "<span>"+ ($.isBlank(info.rollStartTime)?"":new Date(info.rollStartTime).Format("YYYY-MM-DD HH:mm:SS"))
			+ "~" + ($.isBlank(info.rollEndTime)?"":new Date(info.rollEndTime).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent += "</td>";
		
		htmlContent += "<td scope='row'>";
		if (info.rechargeMoney == 0) {
			htmlContent += "<span>无门槛</span>";
		} else {
			htmlContent += "<span>充值满$"+info.rechargeMoney+"</span>";
		}
		htmlContent	+= "</td>";

		htmlContent += "<td scope='row'>";
		htmlContent += "<span>" + info.rollGoodsCount + "件,价值$" + info.rollGoodsPrice +"</span>";
		htmlContent	+= "</td>";
		
		htmlContent += "<td scope='row'>";
		htmlContent += "<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "</td>";

		htmlContent += "<td scope='row'>";
		if (info.field03 == "-1") {
			htmlContent += "<span>未开始</span>";
		} else if (info.field03 == "0") {
			htmlContent += "<span>进行中</span>";
		} else if (info.field03 == "1") {
			htmlContent += "<span>已结束</span>";
		}
		htmlContent	+= "</td>";
		
		htmlContent += "<td style='text-align: center;'>";
		htmlContent += "<a href='#' onclick=\"up('"+info.rollId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.rollId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"

		htmlContent += "<td scope='row' style=' text-align:center;'>";
		htmlContent += "<a style='margin-left:3px;' href='javascript:void(0);' onclick=\"editInfo('" + info.rollId + "')\">编辑</a>";
		htmlContent += "<a style='margin-left:3px;' href='javascript:void(0);' onclick=\"deleteInfo('" + info.rollId + "')\">删除</a>";
		htmlContent += "</td></tr>";
		
	}
	
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}


/**
 * 删除信息
 */
function deleteInfo(id){
	Modal.confirm({ message: "确定执行删除操作吗？" }).on(function (isOK) {
		if (isOK) {
			var data = new Object();
			var ids = new Array();
			ids.push(id);
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			data.param = new Object();
			$.gdAjax({
				url : "roll/del",
				type: "POST",
				data : data,
				success : function(data) {
					getRollList();
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
			data.ids = ids;
			data.pageIndex = parseFloat($("#hid_pageIndex").val());
			data.param = new Object();
			$.gdAjax({
				url : "roll/del",
				type: "POST",
				data : data,
				success : function(data) {
					getRollList();
				}
			});
		}
	});	
}

/**
 * 获取被选中的复选框id
 */
function getCheckedRoll(){
	//判断是否有选中
	var b = false; 
	// 记录所有选中的id
	var ids = new Array();
	$(".table-bordered>tbody input:checkroll").each(function(){
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
 * 分页跳转
 */
function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getRollList();
}

/**
* 添加
*/
function addInfo(){
	window.location.href = "roll_edit.html?b=roll_list";
}

/**
* 编辑
*/
function editInfo(id) {
	window.location.href = "roll_edit.html?rollId=" + id + "&b=roll_list";
}

/**
 * 更新顺序：降序
 * @param rollId
 */
function down(rollId) {
	var data = new Object();
	var roll = new Object();
	roll.rollId = rollId;
	roll.regionId = $.trim($("#select_regionId").val())
	roll.rollName = $.trim($("#text_rollName").val())
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = roll;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "roll/downOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

/**
 * 更新顺序：升序
 * @param rollId
 */
function up(rollId) {
	var data = new Object();
	var roll = new Object();
	roll.rollId = rollId;
	roll.regionId = $.trim($("#select_regionId").val())
	roll.rollName = $.trim($("#text_rollName").val())
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = roll;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "roll/upOrder",
		data : data,
		success : function(data) {
			initHtmlData(data);
		}
	});
}

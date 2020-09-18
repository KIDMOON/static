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
	getList();

	//查询
	$("#btn-search").click(function() {
		//根据条件查询数据
		getList();
	});

	$("#btn_add").click(function () {
		addInfo();
	})

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
 * 获取数据列表
 */
function getList(){
	var data = new Object();
	var object = new Object();
	object.titleFirst = $.trim($("#text_titleFirst").val())
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = object;
	$.gdAjax({
		url : "article/list",
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
			"<input name='PId' value='"+ info.articleId +"' type='checkbox'>" +
			"</td>";

		htmlContent += "<td scope='row'>";
		htmlContent += "<span>"+info.articleCategoryName+"</span>";
		htmlContent += "</td>";

		htmlContent += "<td scope='row'>";
		htmlContent += "<span>"+info.titleFirst+"</span>";
		htmlContent	+= "</td>";

		htmlContent += "<td scope='row'>";
		htmlContent += "<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "</td>";

		htmlContent += "<td style='text-align: center;'>";
		htmlContent += "<a href='#' onclick=\"up('"+info.articleId+"')\">";
		htmlContent += "	<image src=\"media/images/down.gif\" alt=\"down\" /></a>";
		htmlContent += "<a href='#' onclick=\"down('"+info.articleId+"')\">";
		htmlContent += "	<image src=\"media/images/up.gif\" alt=\"up\" /></a>";
		htmlContent += "</td>"

		htmlContent += "<td scope='row' style=' text-align:center;'>";
		htmlContent += "<a style='margin-left:3px;' href='javascript:void(0);' onclick=\"editInfo('" + info.articleId + "')\">编辑</a>";
		htmlContent += "<a style='margin-left:3px;' href='javascript:void(0);' onclick=\"deleteInfo('" + info.articleId + "')\">删除</a>";
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
				url : "article/del",
				type: "POST",
				data : data,
				success : function(data) {
					getList();
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
				url : "article/del",
				type: "POST",
				data : data,
				success : function(data) {
					getList();
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
 * 分页跳转
 */
function page_go(pageIndex){
	$("#hid_pageIndex").val(pageIndex);
	getList();
}

/**
 * 添加
 */
function addInfo(){
	window.location.href = "article_edit.html";
}

/**
 * 编辑
 */
function editInfo(id) {
	window.location.href = "article_edit.html?articleId=" + id;
}

/**
 * 更新顺序：降序
 * @param articleId
 */
function down(articleId) {
	var data = new Object();
	var article = new Object();
	article.articleId = articleId;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = article;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "article/downOrder",
		data : data,
		success : function(data) {
            getList();
		}
	});
}

/**
 * 更新顺序：升序
 * @param articleId
 */
function up(articleId) {
	var data = new Object();
	var article = new Object();
	article.articleId = articleId;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = article;
	$.gdAjax({
		loading:false,
		type : "POST",
		url : "article/upOrder",
		data : data,
		success : function(data) {
            getList();
		}
	});
}

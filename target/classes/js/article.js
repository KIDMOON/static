var pageIndex = 0;
/**
 * 初始化
 */
$().ready(function () {
	var params = $.getArgs();
	var type = params["type"];

	initCategory(type);
	// 加载数据
	initArticleList(type);

	initLatestList();
	initMostReadList();
	getLinkList();
});

/**
 * 加载list
 */
function initArticleList(type) {
	var data = new Object();
	var obj = new Object();
	if (!$.isBlank(type)) {
		obj.articleCategoryId = type;
	}
	data.pageIndex = pageIndex;
	data.param = obj;
	$.gdAjax({
		url : "article/list",
		data : data,
		type : "POST",
		success : function(data) {
			var list = data.result;
			var _html = "";
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				_html += "<li class=\"ui-repeater-item\"> " +
					"        <a class=\"pic\" href=\"article_detail.html?id=" + entity.articleId + "\" target=\"_blank\"> " +
					"         <img src=\"" + serverAddress.file + entity.picture + "\"> " +
					"         <span class=\"tags tags--red\">" + entity.tips + "</span> " +
					"        </a> " +
					"        <p class=\"info\"> " +
					"         <a class=\"title\" href=\"article_detail.html?id=" + entity.articleId + "\" target=\"_blank\">" + entity.titleFirst + "</a> " +
					"         <span class=\"introduction\">" + entity.titleSecond + "</span> " +
					"         <span class=\"time\"><i></i>" + ($.isBlank(entity.createDate)?"":new Date(entity.createDate).Format("YYYY-MM-DD")) + "</span> " +
					"        </p> " +
					"       </li>";
			}

			$("#article-list").html(_html);

			//分页设置
			doPagination(data);
		}
	});
}

/**
 * 加载分类
 */
function initCategory(type) {
	$.gdAjax({
		url : "article/getCategory",
		type : "GET",
		success : function(data) {
			var list = data.result;
			var _html = "";
			var menuName = "";
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				_html += "<li class=\"ui-repeater-item nav-subitem\"> " +
					"       <a class=\"ico-04\" href=\"article.html?type=" + entity.articleCategoryId + "\"> " +
					"        <span class=\"cn\">" + entity.articleCategoryName + "<i class='menu-icon' style='background-image: url(" + serverAddress.file + entity.articleCategoryIcon + ");'></i></span> " +
					"        <span class=\"en\">" + entity.field01 + "</span> " +
					"       </a> " +
					"      </li>";
				if (type == entity.articleCategoryId) {
					menuName = entity.articleCategoryName + entity.field01;
				}
			}
			if ($.isBlank(menuName)) {
				menuName = list[0].articleCategoryName + list[0].field01;
			}
			$("#menu-name").text(menuName);

			$("#article-menu").html(_html);
		}
	});
}

/**
 * 分页
 * @param data
 */
function doPagination(data) {
	if(data.pager.recordSize != null) {
		var pageCount = parseInt((data.pager.recordSize + data.pager.pageSize - 1) / data.pager.pageSize);
		pageCount = (pageCount <= 0) ? 1 : pageCount;
	}
	var current = ($.isBlank(data.pager.pageIndex)? 0 : data.pager.pageIndex) + 1;
	var options = {
		bootstrapMajorVersion: 3,//bootstrap版本
		currentPage: current,//当前页
		totalPages: pageCount,//总页数
		numberOfPages: 10,//显示几个分页按钮（在ul里面生成5个li）
		itemTexts: function (type, page, current) {//设置显示的样式，默认是箭头
			switch (type) {
				case "first":
					return "<<";
				case "prev":
					return "<";
				case "next":
					return ">";
				case "last":
					return ">>";
				case "page":
					return page;
			}
		},
		onPageClicked:  function(event, originalEvent, type, page) {//li点击事件
			pageIndex = page - 1;

			var activeId = $("#drops-mode-btns .active").attr("id");
			if (activeId != "moneyRecord") {
				getContentList();
			} else {
				moneyRecrodList();
			}
		}
	}
	$("#pagination ul").bootstrapPaginator(options);
}

/**
 * 加载
 */
function initLatestList() {
	$.gdAjax({
		url : "/article/latestList",
		type : "GET",
		success : function(data) {
			var list = data.result;
			var _html = "";
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				_html += "<li class=\"ui-repeater-item\"> " +
					"     <a href=\"article_detail.html?id=" + entity.articleId + "\" title=\"" + entity.titleFirst + "\" target=\"_blank\"> " +
					"      <span class=\"pic\"><img src=\"" + serverAddress.file + entity.picture + "\" alt=\"" + entity.titleFirst + "\" title=\"" + entity.titleFirst + "\"></span> " +
					"      <span class=\"name\">" + entity.titleFirst + "</span> " +
					"     </a> " +
					"     </li>";
			}
			$("#latest-article").html(_html);
		}
	});
}

/**
 * 加载
 */
function initMostReadList() {
	$.gdAjax({
		url : "/article/mostReadList",
		type : "GET",
		success : function(data) {
			var list = data.result;
			var _html = "";
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				_html += "<li class=\"ui-repeater-item\"> " +
					"     <a href=\"article_detail.html?id=" + entity.articleId + "\" target=\"_blank\" class=\"pic\" title=\"" + entity.titleFirst + "\">" +
					"		<img src=\"" + serverAddress.file + entity.picture + "\" alt=\"" + entity.titleFirst + "\" title=\"" + entity.titleFirst + "\"></a> " +
					"     <div class=\"name\"><div class=\"name-inner\">" +
					"		<a href=\"article_detail.html?id=" + entity.articleId + "\" target=\"_blank\" title=\"" + entity.titleFirst + "\">" + entity.titleFirst + "</a></div></div> " +
					"     </li>";
			}

			var count = parseInt((list.length+1)/2);
			$(".md-hotarticle").css("margin-top", 170*count+ "px");

			$("#mostread-article").html(_html);
		}
	});
}

/**
 * 查询数据
 */
function getLinkList() {
	$.gdAjax({
		url : "link/list",
		type : "POST",
		success : function(data) {
			var list = data.result;
			var _html = "";
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				_html += "<li class=\"ui-repeater-item\">\n" +
					"      <p><a href=\"" + entity.field01 + "\" title=\"" + entity.linkName + "\">" + entity.linkName + "</a></p>\n" +
					"     </li>";
			}
			$("#link-list").html(_html);
		}
	});
}
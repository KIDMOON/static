var pageIndex = 0;
/**
 * 初始化
 */
$().ready(function () {
	var params = $.getArgs();
	var type = params["type"];
	var id = params["id"];

	initCategory(type);
	// 加载数据
	initArticleDetail(id);

	initLatestList();
	initMostReadList();
});

/**
 * 加载
 */
function initArticleDetail(id) {
	$.gdAjax({
		url : "/article/get/" + id,
		type : "GET",
		success : function(data) {
			var result = data.result;
			$("#article-title, #article-title-span").text(result.titleFirst);
			$("#article_body").html(result.content);
			$("#article-time").text($.isBlank(result.createDate)?"":new Date(result.createDate).Format("YYYY-MM-DD HH:mm:SS"));

			$("*[name='description']").attr("content", result.description);
			$("*[name='keywords']").attr("content", result.keywords);
			$("title").text(result.titleFirst);
		}
	});
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
			$("#mostread-article").html(_html);
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

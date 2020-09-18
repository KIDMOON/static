//定义百度编辑器
var ueditor;

/**
 * 图片上传后显示
 */
function uploadImageAfter(url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + (serverAddress.file + url)
		+ "\"id=\"articlePicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this));'>删除</a>";
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$("#div_pictureUpload").before(pictureHtml);
	$("#div_pictureUpload").hide();
}

/**
 * 初始化
 */
$(function() {
	// 条件初始化
	var params = $.getArgs();
	// ID
	var articleId = params["articleId"];
	if(!$.isBlank(articleId)){
		$("#hid_articleId").val(articleId);
	}

	//返回
	$("#btn-detail-return").click(function() {
		Modal.confirm({ message: "确定放弃修改，返回吗？" }).on(function (isOK) {
			if (isOK) {
				window.location.href = "article_list.html";
			}
		});
	});

	//上传图片
	$("#btn-pictureUpload").click(function() {
		$.uploadImage({
			success: function(result) {
				uploadImageAfter(result.replace(serverAddress.file, ''));
			}
		})
	});

	//初始化编辑器
	ueditor = UE.getEditor('ueditor', {
		autoHeight: true,
		//initialFrameWidth:429,//初始化宽度
		initialFrameHeight:400,//初始化高度
	});

	//编辑器内容改变触发
	ueditor.addListener("ready", function () {
		ueditor.addListener( 'selectionchange', function() {
			$(".exit-shop-info").html(ueditor.getContent());
			$(".exit-shop-info p img").each(function(){
				$(this).addClass("img-size");
			});
		});
	});

	//保存按钮Click
	$("#btn-detail-edit").click(function() {
		saveDetailData();
	});

	//返回
	$("#btn-detail-return").click(function() {
		Modal.confirm({ message: "确定放弃修改，返回吗？" }).on(function (isOK) {
			if (isOK) {
				window.location.href = "article_list.html";
			}
		});
	});

	ueditor.ready(function () {
		//获取所属列表
		getCategoryList();
	});
});

/**
 * 加载信息
 */
function initArticleInfo(){
	var articleId = $("#hid_articleId").val();
	if($.isBlank(articleId)){
		return;
	}
	$.gdAjax({
		url:"article/edit/" + $("#hid_articleId").val(),
		type:"GET",
		success:function(data) {
			var article = data.result;
			$("#select_articleCategory").val(article.articleCategoryId);
			$("#txt_titleFirst").val(article.titleFirst);
			$("#txt_titleSecond").val(article.titleSecond);
			$("#txt_keywords").val(article.keywords);
			$("#txt_description").val(article.description);
			$("#txt_tips").val(article.tips);
			uploadImageAfter(article.picture);
			UE.getEditor('ueditor').setContent(article.content, true);
		}
	});
}

/*
 * 保存
 */
function saveDetailData() {
	//验证
	if($.isBlank($("#select_articleCategory").val())){
		$("#select_articleCategory").tipError("请选择所属！");
		return;
	}
	if($.isBlank($("#articlePicture").attr("data-url"))){
		$.alertError("图片不能为空！");
		return;
	}
	if($.isBlank($("#txt_titleFirst").val())){
		$("#txt_titleFirst").tipError("标题不能为空！");
		return;
	}
	var txtTips = $("#txt_tips").val();
	if(!$.isBlank(txtTips) && txtTips.length > 20){
		$("#txt_tips").tipError("标签最多只能输入20个字！");
		return;
	}

	var article = new Object();
	var articleId = $("#hid_articleId").val();
	if(!$.isBlank(articleId)) {
		article.articleId = articleId;
	}
	article.articleCategoryId = $("#select_articleCategory").val();
	article.titleFirst = $("#txt_titleFirst").val();
	article.titleSecond = $("#txt_titleSecond").val();
	article.keywords = $("#txt_keywords").val();
	article.description = $("#txt_description").val();
	article.tips = $("#txt_tips").val();
	article.picture = "";
	if (!$.isBlank($("#articlePicture").attr("data-url"))) {
		article.picture = $("#articlePicture").attr("data-url");
	}
	article.content = UE.getEditor('ueditor').getContent();

	$.gdAjax({
		url:"article/save",
		data:article,
		type:"POST",
		success:function(data) {
			$.alertSuccess("保存成功！");
			window.location.href = "article_list.html";
		}
	});
}

/**
 * 根据选中属于，决定显示隐藏字段
 */
function showColumByRegion() {
	var regionType = $("#article_region option:selected").attr("data-type");
	if (regionType == '4') {
		$(".pool_article").addClass("pool_article_show");
	}
	else {
		$(".pool_article").removeClass("pool_article_show");
	}
}

/**
 * 图片删除
 * @param object
 */
function delPicture(object){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#div_pictureUpload").show();
}

/**
 * 分类
 */
function getCategoryList(){
	$.gdAjax({
		loading : false,
		url : "articleCategory/list",
		type : "POST",
		success : function(data) {
			var _html = "<option value=''>请选择</option>";
			for ( var i in data.result) {
				var info = data.result[i];
				_html += "<option value='" + info.articleCategoryId + "'>"
					+ info.articleCategoryName + "</option>";
			}
			$("#select_articleCategory").html(_html);
			initArticleInfo();
		}
	});
}
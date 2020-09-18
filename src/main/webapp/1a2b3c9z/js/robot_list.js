/**
 * 初始化
 */
$(function() {
	// 加载数据
	getContentList();
	
	$("#btn-search").click(function () {
		getContentList();
	});
	
	// 新增
	$("#btn_add").click(function () {
		saveNewModal();
	});
	
	// 新增保存
	$("#modal_add_btn").click(function () {
		saveOrUpdateInfo(true);
	});
	
	// 修改保存
	$("#modal_edit_btn").click(function () {
		saveOrUpdateInfo(false);
	});
	
	//上传图片
	$("#btn-pictureSave, #btn-pictureUpdate").click(function() {
		var that = this;
		$.uploadImage({
			success: function(result) {
				uploadImageAfter(that, result);
			}
		})
	});

	// 生成
	$("#btn_gen").click(function () {
		$.gdAjax({
			url   :"user/generateUer",
			type : "POST",
			success : function(data) {
				getContentList();
			}
		});
	});
});

/**
 * 添加模态框
 */
function saveNewModal() {
	Modal.dialog({ 
		modalId: "save_modal", 
		onReady : function () {
            $("#save_UserId").clearTip();
            $("#save_NickName").clearTip();
            $("#save_UserId").val('');
            $("#save_NickName").val('');
            $(".uploadimages").remove();
            $("#btn-pictureSave, #btn-pictureUpdate").show();
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var data = new Object();
	var obj = new Object();
	var nickName = $.trim($("#text_nickName").val());
	obj.nickName = nickName;
	obj.robotFlag = true;
	data.pageIndex = parseFloat($("#hid_pageIndex").val());
	data.param = obj;
	$.gdAjax({
		url : "user/list",
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
		htmlContent += "	<td scope='row' style='text-align: center;'>" + (parseInt(i) + 1) + "</td>";
		htmlContent += "	<td scope='row' style='display: none;'>" + (info.userId == null ? "" : info.userId) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.avatar == null ? "" : ("<img style='height: 60px;' src='" + info.avatar + "'>")) + "</td>";
		htmlContent += "	<td scope='row'  >" + (info.nickName == null ? "" : info.nickName) + "</td>";
		htmlContent += "	<td scope='row'  >$ " + (info.userMoney.moneyFirstLeft == null ? "" : info.userMoney.moneyFirstLeft) + "</td>";
		htmlContent += "	<td scope='row'>";
		htmlContent += "		<span>" + ($.isBlank(info.createDate)?"":new Date(info.createDate).Format("YYYY-MM-DD HH:mm:SS")) +"</span>";
		htmlContent	+= "	</td>";
		htmlContent += "	<td style=' text-align:center;'>";
		htmlContent += "        <a href='#' onclick=\"editInfo('" + info.userId + "')\">修改  </a>";
		htmlContent += "        <a href='#' onclick=\"delInfo('" + info.userId + "')\">删除</a>";
		htmlContent += "    </td>";
		htmlContent += "</tr>";
	}
	data.htmlContent = htmlContent;
	$(".table-bordered").initTable(data);
}

/**
 * 修改
 * @param primaryId
 */
function editInfo(primaryId) {
	$.gdAjax({
		url : "user/edit/" + primaryId,
		success : function(data) {
			Modal.dialog({ 
                modalId: "update_modal", 
                onReady : function () {
                	
                	$(".uploadimages").remove();
                	$("#btn-pictureSave, #btn-pictureUpdate").show();
                	$("#update_UserId").clearTip();
                	$("#update_UserId").val(data.result.userId);
                	uploadImageAfter($("#btn-pictureUpdate"), data.result.avatar);
                	$("#update_NickName").clearTip();
                	$("#update_NickName").val(data.result.nickName);
                	$("#update_MoneyFirstLeft").clearTip();
                	$("#update_MoneyFirstLeft").val(data.result.userMoney.moneyFirstLeft);
                	$("#update_UserMoneyVersion").val(data.result.userMoney.version);
                }
            });
		}
	});
}

/**
 * 编辑保存
 */
function saveOrUpdateInfo(isSave) {
	
	var entity = new Object();
	var userMoney = new Object();
    entity.robotFlag = 1;
	if (isSave) {
		// 添加保存
    	entity.nickName = $.trim($("#save_NickName").val());
    	entity.avatar = $.trim($("#div_pictureSave img[name='uploadPicture']").attr("data-url"));
    	userMoney.moneyFirstLeft = $("#save_MoneyFirstLeft").val();
    	userMoney.version = 0;
	}
	else {
		// 编辑保存
		entity.userId = $.trim($("#update_UserId").val());
    	entity.nickName = $.trim($("#update_NickName").val());
    	entity.avatar = $.trim($("#div_pictureUpdate img[name='uploadPicture']").attr("data-url"));
    	userMoney.moneyFirstLeft = $("#update_MoneyFirstLeft").val();
    	userMoney.version = $("#update_UserMoneyVersion").val();
	}
	entity.userMoney = userMoney;
	
	$.gdAjax({
		url   :"user/saveInfo",
		data : entity,
		type : "POST",
		success : function(data) {
			getContentList();
			if (isSave) {
				$("#close_save_btn").click();
			} else {
				$("#close_update_btn").click();
			}
		}
	});
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
			var nickName = $.trim($("#text_nickName").val());
			entity.nickName = nickName;
			entity.robotFlag = true;
			entity.delFlag = true;
			data.param = entity;
			$.gdAjax({
				url   :"user/del",
				data : data,
				type : "POST",
				success : function(data) {
					initHtmlData(data);
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
 * 图片上传后显示
 */
function uploadImageAfter(obj, url) {
	var pictureHtml = "";
	pictureHtml += "<div class=\"uploadimages\">";
	pictureHtml += "	<div class=\"preview\">";
	pictureHtml += "		<img style=\"width: 85px; height: 85px;\" src=\"" + url
					+ "\"name=\"uploadPicture\" data-url=\"" + url + "\">";
	pictureHtml += "	</div>";
	pictureHtml += "	<div class=\"actionBox\">";
	pictureHtml += "		<a href=\"javascript:void(0);\" class=\"actions\" onclick='delPicture($(this));'>删除</a>"; 
	pictureHtml += "	</div>";
	pictureHtml += "</div>";
	$(obj).before(pictureHtml);
	$(obj).hide();
}

/**
 * 图片删除
 * @param object
 */
function delPicture(object){
	var currentObject = object.parents(".uploadimages");
	currentObject.remove();
	$("#btn-pictureSave, #btn-pictureUpdate").show();
}
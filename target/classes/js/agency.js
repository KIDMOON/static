var pageIndex = 0;
/**
 * 初始化
 */
$().ready(function (){
	var params = $.getArgs();
	getUserInfo();
	getUserPartnerStat();
	getCommissionRate();

	$('form').submit(function () {
		return false;
	});

	// 复制
	$("#partner_url").click(function(){
		$("#partner_url").attr("data-clipboard-text", $("#partner_url").text());
		var clipboard = new ClipboardJS("#partner_url");
		clipboard.on('success', function(e) {
			$.alertSuccess("复制成功");
		});
		clipboard.on('error', function(e) {
			$.alertError("复制失败");
		});
	});
}); 

/**
 * 查询用户统计信息
 */
function getUserPartnerStat() {
	$.gdAjax({
		url : "usercenter/partnerstat",
		type : "GET",
		success : function(data) {
			var partnerStat = data.result;
			$("#partnerstat_count").text(partnerStat.partnerCount);
			$("#partnerstat_week").text($.toCoin(partnerStat.partnerMoneyWeek));
			$("#partnerstat_sum").text($.toCoin(partnerStat.partnerMoneySum));
		}
	});
}

/**
 * 查询用户数据
 */
function getUserInfo() {
	$.gdAjax({
		url : "usercenter/userdetail",
		type : "GET",
		success : function(data) {
			var user = data.result;
			$("#user_avter").attr("src", user.avatar);
			$("#user_nickName").text(user.nickName);
			if (!$.isBlank(user.field01)) {
				$("#trade_url").val(user.field01);
			}
			if (!$.isBlank(user.contact) && $("#contact_txt")) {
				$("#contact_txt").val(user.contact);
			}
			if (!user.partnerCodeModifyFlag) {
				$("#partner_code").removeAttr("readonly");
				$("#modifiedPartnerCode").removeClass("code-disable");
			}
			$("#partner_code").val(user.partnerCode);
			$("#partner_url").text(serverAddress.pageUrl + "index.html?promo=" + user.partnerCode);
			var _money1 = $.toCoin(user.userMoney.moneyFirstLeft.toString());
			$("#userFirstMoney").text(_money1);
			var _money3 = user.userMoney.moneyThirdLeft.toString() + " 点";
			$("#userThirdMoney").text(_money3);
			$("#_money1").text(_money1);
			$("#_money1").attr("data-money", user.userMoney.moneyFirstLeft);
		}
	});
}

function getCommissionRate() {
	$.gdAjax({
		url : "header/getCommissionRate",
		type : "GET",
		success : function(data) {
			$("#c1").text(data.result.c1 + "%");
			$("#c2").text(data.result.c2 + "%");
			$("#c3").text(data.result.c3 + "%");
			$("#c4").text(data.result.c4 + "%");
		}
	});
}

/**
 * 修改推广码
 */
function modifiedPartnerCode() {
	var newPartnerCode = $.trim($("#partner_code").val());
	if ($.isBlank(newPartnerCode)) {
		$.alertError("请输入推广码");
		return;
	}
	var data = new Object();
	var obj = new Object();
	obj.partnerCode = newPartnerCode;
	data.param = obj;
	$.gdAjax({
		url : "usercenter/modifiedPartnerCode",
		type : "POST",
		data : data,
		success : function(data) {
			$.alertSuccess("修改成功");
			getUserInfo();
		}
	});
	return;
}

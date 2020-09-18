var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
if("ActiveXObject" in window || isIE || isEdge) {
	alert("IE浏览器不能正常访问此网站，建议使用chrome谷歌浏览器");
	window.close();
}

var payType = 2;
var position_LD;
document.onkeydown = function(e) {
	var ev = document.all?window.event:e;
	if(ev.keyCode == 13) {
		if ($("#popup-login").css('display') === 'block') {
			clickLogin();
		}
		else if ($("#popup-rigister").css('display') === 'block') {
			clickRigister();
		}
	}
}

// 默认充值300
if ($("#default-money-li")) {
	$("#default-money-li").click();
}

getNowBoxRecord();
setInterval("getNowBoxRecord()", 13000);

function loginGraySmartOver() {
	$("#loginGraySmart").show();
}

function loginGraySmartOut() {
	$("#loginGraySmart").hide();
}

// code确认
function clickCodeOk() {
	$("#codeOkMsg").text("");
	$("#recharge-contact").hide();
	var rechargeMoney = $("#recharge-money").val();
	rechargeMoney = rechargeMoney.replace(/\D/g,'');
	$("#recharge-money").val(rechargeMoney);

	$("#recharge-contact").show();
	var rechargePromoCode = $("#recharge-promo-code").val();
	if (rechargePromoCode != "" && rechargePromoCode.length != 6) {
		return;
	}
	if (rechargeMoney === "") {
		$.alertInfo("请选择充值的金额");
		return;
	}
	if (Number(rechargeMoney) < 5) {
		$.alertInfo("最小支持充值$5");
		$("#recharge-money").val(5);
		return;
	}
	if (Number(rechargeMoney) > 300) {
		$.alertInfo("单笔充值最大$300，建议分多笔充值");
		$("#recharge-money").val(300);
		return;
	}
	$.gdAjax({
		url : "header/checkCode?price=" + rechargeMoney + "&promoCode=" + $.trim($("#recharge-promo-code").val()),
		type : "POST",
		success : function(data) {
			var calcMoney = data.result;
			var msgTxt = "";
			if (payType == 1 || payType == 2) {
				msgTxt += "预计需要充值" + calcMoney.rateMoney + "元，";
			}
			else if (payType == 3) {
				msgTxt = "成功充值得" + rechargeMoney + "K币，";
			}
			if (rechargePromoCode != "") {
				msgTxt += "此推广码有效，";
			}
			$("#codeOkMsg").text(msgTxt + "充值成功额外赠送" + $.toCoin(calcMoney.money));
		}
	});
	showMoneyText();
}

// 退出
function logout() {
	$.gdAjax({
		url : "login/logout/",
		type : "GET",
		success : function(data) {
			$("#loginli").hide();
			$("#logoutli").show();
		}
	});
	// 阻止冒泡
	event.cancelBubble = true;
	event.stopPropagation();
	event.preventDefault(); 
	return false;
}
// 充值
function recharge() {
	$.gdAjax({
		url : "header/getPayType",
		type : "POST",
		success : function(data) {
			_payConfig = data.result;

			// 如果设置的为不为空，过滤充值方式
			if (!$.isBlank(_payConfig)) {
				var _payConfigs = _payConfig.split(",");
				var _payOptionHtml = "";
				for (var i=0; i<_payConfigs.length; i++) {
					if (_payConfigs[i] == "1") {
						_payOptionHtml += "<option value='1'>支付宝</option>";
					} else if (_payConfigs[i] == "2") {
						_payOptionHtml += "<option value='2'>微信</option>";
					} else if (_payConfigs[i] == "3") {
						_payOptionHtml += "<option value='3'>充值卡</option>";
					}
					$("#payTypeSelect").html(_payOptionHtml);
				}
			}
			$("#payTypeSelect option[style*='block']").first().attr("selected", true);
			$("#open-card-url").attr("data-link", _buyCardUrl);
			$("#codeOkMsg").text("");
			paychoose();
		}
	});

	if (_loadUser != null && $.isBlank(_loadUser.parentUserId)) {
		$("#recharge-promo-code").css("visibility", "visible");
	}

	// 默认选中
	moneychoose(30);
	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".recharge_wnd").css("display", "block");
	$(".wnd_bg").css("display", "block");
	$(".page").css("filter", "blur(5px)");
	
	paychoose();
	clickCodeOk();
	
	// 阻止冒泡
	event.cancelBubble = true;
	event.stopPropagation();
	event.preventDefault(); 
	return false;
}
// 关闭充值窗口
function closed_wnd() {
	clickOtherMoney();
	closedWindow();
}
//关闭窗口
function closedWindow() {
	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".page").css("filter", "blur(0px)");
	$("#noticePictureWnd").css("display", "none");
}
// 跳转个人中心
function gotousercenter() {
	location.href = "user.html";
}
// 选择充值
function paychoose() {
	payType = $("#payTypeSelect").val();
	$("#button-recharge").attr("data-status", "0");

	$("#rechargeWnd .fast_input").show();
	$("#rechargeWnd").removeClass("wnd-card");
	$("#recharge-card-content").hide();

	if (payType == 1 || payType == 2) {
		$("#open-card-url").hide();
		$("#recharge-money").show();
	}
	else if (payType == 3) {
		$("#open-card-url").show();
		$("#recharge-money").hide();
		$.gdAjax({
			url : "header/getCardPayUrl",
			type : "POST",
			success : function(data) {
				$("#codeOkMsg").text("");
				if ($.isBlank(data.result)) {
					$.alertError("充值卡支付暂停使用，请选择其他支付方式");
					return;
				}
				$("#open-card-url").attr("data-link", data.result);
			}
		})
	}
	showMoneyText();
	clickCodeOk();
}
// 选择金额
function moneychoose(chooseMoney) {
	$("#rechargeWnd .fast_input").each(function () {
		$(this).removeClass("active");
		if ($(this).attr("data-money") == chooseMoney) {
			$(this).addClass("active");
		}
	});
	$("#recharge-money").val(chooseMoney);
	showMoneyText();
	clickCodeOk();
}
// 充值跳转
var _orderId = "";
var interval_checkpay = null;
function clickRecharge() {
	if ($("#button-recharge").attr("data-status") == "1") {
		return;
	}
	// 支付宝充值或者微信充值
	if (payType == 1 || payType == 2) {
		if ($("#recharge-money").val() === "") {
			$.alertInfo("请选择充值的金额");
			$("#button-recharge").attr("data-status", "0");
			return;
		}
		var userContract = $.trim($("#recharge-contact").val());
		$("#button-recharge").attr("data-status", "1");
		if ($.isMobile() && payType == 1) {
			$.gdAjax({
				url : "pay/h5pay?price=" + $("#recharge-money").val() + "&payType=" + payType + "&contact=" + userContract + "&promoCode=" + $.trim($("#recharge-promo-code").val()),
				type : "POST",
				success : function(data) {
					window.location.href = data.result;
				}
			})
        } else {
            $.gdAjax({
                url : "pay/pay?price=" + $("#recharge-money").val() + "&payType=" + payType + "&contact=" + userContract + "&promoCode=" + $.trim($("#recharge-promo-code").val()),
                type : "POST",
                success : function(data) {
                    if (payType == 1){
                        $("#r_pay_type").text("支付宝充值");
                    } else if (payType == 2){
                        $("#r_pay_type").text("微信充值");
                    }
                    var jsonResult = data.result;
                    _orderId = jsonResult.orderId;
                    $("#alipayMoeny").text(Number(jsonResult.money) / 100 + "元");
                    $("#alipayCode").html("");
                    $("#alipayCode").qrcode({
                        render: "table",
                        fill: '#FFF',
                        size: 220,
                        text: jsonResult.qrCodeUrl
                    });
                    $("#chooseMoenyDiv").hide();
                    $("#alipayCodeDiv").show();
                    if (interval_checkpay == null) {
                        interval_checkpay = setInterval("checkPayStatus()", 3000);
                    }
                }
            })
        }
	}
	else if (payType == 3) {

		// 如果金额选择是隐藏，则是输入卡号画面
		if($("#rechargeWnd .fast_input").is(':hidden')){
			$("#button-recharge").attr("data-status", "1");
			$.gdAjax({
				url : "rechargecard/pay?card=" + $.trim($("#recharge-card-content").val()) + "&promoCode=" + $.trim($("#recharge-promo-code").val()),
				type : "POST",
				success : function(data) {
					var _text = "充值成功";
					if (!$.isBlank(data.result)) {
						_text += "，额外获取积分" + data.result + "点";
					}
					$.alertSuccess(_text, 2000, function() {
						window.location.href = "index.html";
					});
				},
				done: function(data) {
					$("#button-recharge").attr("data-status", "0");
				}
			})
		} else {
			$("#rechargeWnd .fast_input").hide();
			$("#rechargeWnd").addClass("wnd-card");
			$("#recharge-card-content").show();
			$("#recharge-money").hide();
			$("#open-card-url").hide();
		}
	}
}
// 购买充值卡
function goBuyCard() {
    $("#rechargeWnd .fast_input").hide();
    $("#rechargeWnd").addClass("wnd-card");
    $("#recharge-card-content").show();
    $("#recharge-money").hide();
    $("#open-card-url").hide();

	var openUrl = $("#rechargeWnd .active").eq(0).attr("data-link");
	if ($.isBlank(openUrl)) {
		openUrl = $("#open-card-url").attr("data-link");
	}
	window.open(openUrl);
}
// 重新选择其他金额
function clickOtherMoney() {
	$("#alipayCodeDiv").hide();
	clearInterval(interval_checkpay);
	interval_checkpay = null;
	$("#chooseMoenyDiv").show();
	$("#button-recharge").attr("data-status", "0");
}
// 显示按钮文字
function showMoneyText() {
	if ($("#payTypeSelect").val() == "3") {
		$("#button-recharge").text("立即兑换");
	}
	else {
		var chooseMoney = $("#recharge-money").val();
		$("#button-recharge").text("立即支付 $ " + chooseMoney.toString().formatMoney(2));
	}
}
// 检查是否支付过
function checkPayStatus() {
	if (_orderId == "") {
		return;
	}
	$.gdAjax({
		url : "pay/checkPay?orderid=" + _orderId,
		type : "GET",
		success : function(data) {
			var autopay = document.getElementById('audio_pay');
			if (autopay) {
				autopay.play();
			}
			var _text = "支付成功";
			if (!$.isBlank(data.result)) {
				_text += "，额外获取积分" + data.result + "点";
			}
			$.alertInfo(_text);
			$("#alipayMoeny").text(_text);
			setTimeout(function () {
				window.location.href = "index.html";
			}, 1000);
		}
	})
}

// 得到实时开箱记录
function getNowBoxRecord() {
	if ($("#open") && ($("#open").attr("data-status") == "1")) {
		return;
	}
	var userGoodsId = "0";
	var liObj = $("#livefeed>div");
	if (liObj.length > 0) {
		userGoodsId = $(liObj).eq(0).attr("data-id");
	}
	$.gdAjax({
		url : "header/goodsrecordlist/" + userGoodsId,
		type : "GET",
		success : function(data) {
			var _html = "";
			var _count = 0;
			var _bgclass = "live-drop-item1-000";
			var _divWidth = 155;
			for (var index in data.result) {
				_count++;
				var _obj = data.result[index];

				_html += "<div class='item' data-id='" + _obj.userGoodsId + "'>";
				if (_obj.userGoodsType == '8') {
					_html += "	<img class='type' src='images/items/types/001.png'>";
					_html += "	<img class='img_item' src='images/other/bonus03.png'>";
				} else {
					_html += "	<img class='type' src='images/items/types/" + _obj.goodsLevel + ".png'>";
					_html += "	<img class='img_item' src='" + serverAddress.file + _obj.goodsPicture + "'>";
				}
				_html += "	<div class='info'>";
				_html += "		<div class='item_name'>" + (_obj.userGoodsType == '8' ? _obj.keyName : _obj.goodsName) + "</div>";
				_html += "		<div class='user_name'>" + _obj.nickName + "</div>";
				_html += "		<div class='case_name'>" + _obj.keyName + "</div>";
				_html += "	</div>";
				_html += "</div>";
			}
			
			$("#livefeed").prepend(_html);
			
			// 添加鼠标移动事件
			for (var i=0; i<_count; i++) {
				$("#livefeed>div").hover(
					function () {
						$("#livefeed").css("overflow", "unset");
						$('.info', this).fadeIn(100);
					}, 
					function () {
						$("#livefeed").css("overflow", "hidden");
						$('.info', this).fadeOut(100);
					}
				);
			}
			
			if (_count > 0 && userGoodsId != "0") {
				$(".live_drops .items .row .item").css("transition", "");
				$(".live_drops .items .row .item").css("transform", "translate3d(" + _divWidth * -_count + "px, 0, 0)");
			}
			setTimeout("moveAnimate()", 2000);
			
			// 板子浮动
			if (userGoodsId == "0") {
				position_LD = $(".live_drops").offset();
				if ($(this).scrollTop() > position_LD['top']) {
					$(".live_drops").addClass("live_drop_fixed");
				}else{
					$(".live_drops").removeClass("live_drop_fixed");
				}
			}
		}
	});
}

// 板子浮动
$(window).scroll(function() {
    if ($(this).scrollTop() > position_LD['top']) {
        $(".live_drops").addClass("live_drop_fixed");
    }else{
		$(".live_drops").removeClass("live_drop_fixed");
	}
});

// 执行动画
function moveAnimate() {
	$(".live_drops .items .row .item").css("transition", "all 1s linear");
	$(".live_drops .items .row .item").css("transform", "translate3d(0, 0, 0)");
}

// 得到region list
// uuid
var _uuid = _getCookie("_uuid");
if ($.isBlank(_uuid)) {
	_setCookie("_uuid", $.uuid());
}
$.gdAjax({
	url : "index/regionlist?uuid=" + _uuid,
	type : "GET",
	success : function(data) {
		// 菜单
//		var regionList = data.result.regionList;
//		var _html = "";
//		for (var index in regionList) {
//			_html += "<div class='chosen-div-region chosen-container chosen-container-single count-roulette ";
//			_html += " chosen-container-single-nosearch chosen-container-active ' data-option-url='" + regionList[index].field03 + "'>";
//			_html += " <a class='chosen-single' style='background-image:url(" 
//					+ serverAddress.file + regionList[index].field01 
//					+ ")'></a>";
//			_html += "</div>";
//		}
//		$("#headRegion").html(_html);
//		
//		// 显示标题
//		$("#title_content").text($(".chosen-region-bg span").text());
//		
//		// 绑定事件
//		$("#headRegion .chosen-div-region").click(function () {
//			var _regionUrl = $.trim($(this).attr("data-option-url"));
//			window.location.href = _regionUrl;
//		}).mouseover(function() {
//			  $(this).addClass("chosen-region-mouseover");
//		}).mouseout(function() {
//			  $(this).removeClass("chosen-region-mouseover");
//		});
		
		// 公告
		//var logoOff = $(".btn-login").offset().left;
		var noticeList = data.result.noticeList;
		_html = "<ul>";
		for (var index in noticeList) {
			_html += "<li>" + noticeList[index].noticeContent + "</li'>";
		}
		_html += "</ul>";
		$("#scrollBox").html(_html);
		$("#notice-result").html(_html);
		new Dron_ScrollBox("scrollBox").init();
		// 加载通知弹出框内容
		var _noticeHtml = "";
		for (var index in noticeList) {
			_noticeHtml += "<div class='notice'>" +
				"<div class='time'>" + new Date(noticeList[index].createDate).Format("YYYY-MM-DD HH:mm:SS") + "</div>" +
				"<div class='text'>" + noticeList[index].noticeContent;
			if (!$.isBlank(noticeList[index].field01)) {
				_noticeHtml += "<a href=\"javascript:showNoticeImg('" + noticeList[index].field01 + "', '" + noticeList[index].noticeContent + "')\"> [查看]</a>";
			}
			_noticeHtml += "</div></div>";
		}
		$("#noticewndbody").append(_noticeHtml);
		$("#noticewndbody").mCustomScrollbar();
		// 显示通知，一天显示一次
		var isTodayShow = $.cookie(new Date().Format("YYYY-MM-DD"));
		if (isTodayShow != null) {
			closeNotice();
		}

		// 显示图片公告
		var _noticeId = _getCookie("_noticeId");
		for (var index in noticeList) {
			if (!$.isBlank(noticeList[index].field01)) {
				if (_noticeId != noticeList[index].noticeId) {
					showNoticeImg(noticeList[index].field01, noticeList[index].noticeContent);
					_setCookie("_noticeId", noticeList[index].noticeId);
				}
				break;
			}
		}
	}
});
function showNoticeImg(url, noticeContent) {
	closedWindow();
	$("#noticePictureWnd").show();
	$("#noticePictureImg").attr("src", url);
	$("#noticePictureContent").text(noticeContent);
}

// 公告滚动
function Dron_ScrollBox(uid) {  
    this.scrollBox = document.getElementById(uid);  
    this.scrollBoxHeight = this.scrollBox.clientHeight;  
    this.scrollBoxInner = this.scrollBox.innerHTML;  
    this.scrollCol = this.scrolln = 0;  
    this.setScroll = function () {  
        this.scrollBox.scrollTop = this.scrollCol + this.scrolln;  
        if (this.scrolln == this.scrollBoxHeight)  
            return this.addScroll()  
        else  
            this.scrolln++;  
        var o = this;  
        function m() { o.setScroll(); }  
        setTimeout(m, 40);  
    }  
    this.addScroll = function () {  
        this.scrollBox.innerHTML += "<br />" + this.scrollBoxInner;  
        this.scrollCol = this.scrollBox.scrollTop;  
        this.scrolln = 0;  
        var o = this;  
        function m() { o.setScroll(); }  
        setTimeout(m, 2000);  
    }  
    this.init = this.addScroll;  
}

// 显示通知
function showNotice() {
	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".notice_wnd").css("display", "block");
	$(".wnd_bg").css("display", "block");
	$(".page").css("filter", "blur(5px)");
}
function closeNotice() {
	$(".notice_announce").css("display", "none");
	$.cookie(new Date().Format("YYYY-MM-DD"), "1");
	// 阻止冒泡
	event.cancelBubble = true;
	event.stopPropagation();
	event.preventDefault(); 
	return false;
}

// 打开注册
function goRegister() {
	$("#registerPromoCode").val(_getCookie("_promo"));
	$(".login_wnd").css("display", "none");
	$(".register_wnd").css("display", "block");
	$(".page").css("filter", "blur(5px)");
}

// 验证密码
function checkInputValue() {
	$("#popup-rigister").clearAllTips();
	var newMail = $.trim($("#newMail").val());
	var newPassword = $.trim($("#newPassword").val());
	var confirmPassword = $.trim($("#confirmPassword").val());

	// 验证账号
	if (newMail.length < 1) {
		$.alertError("登录账号不能为空")
		return false;
	}

	// 密码长度不够
	if (newPassword.length < 6) {
		$.alertError("密码长度至少6位")
		return false;
	}
	// 新密码长度过长
	if (newPassword.length > 20) {
		$.alertError("密码长度不能超过20位")
		return false;
	}

	// 两次输入不一致
	if (!(newPassword===confirmPassword)) {
		$.alertError("两次输入的密码不一致")
		return false;
	}
	return true;
}

// 注册
function clickRigister() {
	if(checkInputValue()) {
		var param = new Object();
		param.field02 = $.trim($("#newMail").val());
		param.nickName = $.trim($("#newNickName").val());
		param.field03 = $.trim($("#newPassword").val());
		param.avatar = $.trim($("#avatarPicture").attr("data-url"));
		$.gdAjax({
			url : "login/regisiter",
			data: param,
			type : "POST",
			success : function(data) {
				$.alertSuccess("注册邮件已发送，请查收验证码");
			}
		});
		$(".register_wnd").css("display", "none");
		$(".register_done_wnd").css("display", "block");
	}
}

// 注册完成
var clickRigisterFlag = false;
function clickRigisterDone() {
	if (clickRigisterFlag) {
		return;
	}
	clickRigisterFlag = true;
	// 验证邮箱验证码
	var newPasscode = $.trim($("#newPasscode").val());
	if ($.isBlank(newPasscode)) {
		$.alertError("请输入邮箱验证码")
		clickRigisterFlag = false;
		return false;
	}
	var param = new Object();
	param.field02 = $.trim($("#newMail").val());
	param.field03 = newPasscode;
	$.gdAjax({
		url : "login/regisiterDone?promo=" + $.trim($("#registerPromoCode").val()),
		data: param,
		type : "POST",
		success : function(data) {
			$.alertSuccess("注册成功");
			var _url = serverAddress.pageUrl + "index.html" + data.result.url;
			window.location.href = _url;
		}, done: function () {
			clickRigisterFlag = false;
		}
	});
}

// 打开登录
function goLogin() {
	$("#loginMail").val('');
	$("#loginPassword").val('');
	$(".login_wnd").css("display", "block");
	$(".page").css("filter", "blur(5px)");
}

// 登录
function clickLogin() {
	$("#popup-login").clearAllTips();
	var loginMail = $.trim($("#loginMail").val());
	var loginPassword = $.trim($("#loginPassword").val());
	if (loginMail === '') {
		$.alertError("请输入账号");
		return false;
	}
	if (loginPassword === '') {
		$.alertError("请输入密码");
		return false;
	}

	$.gdAjax({
		url : "login/accountlogin?email=" + loginMail + "&password=" + loginPassword,
		type : "POST",
		success : function(data) {
			var _url = serverAddress.pageUrl + "index.html" + data.result.url;
			window.location.href = _url;
		}
	});
}

// 登录
function toQQLogin() {
	var promo = _promo;
	if(_promo == "undefined" || _promo == null || _promo == ""){
		promo = "";
	}
	window.location.href = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101843266&redirect_uri=http://kxcsgo.com/app/login/qqreturn?promo=" + promo;
}

// 登录
function toSteamLogin() {
	var promo = _promo;
	if(_promo == "undefined" || _promo == null || _promo == ""){
		promo = "";
	}
	window.location.href = serverAddress.apiUrl + "login/streamLogin?promo=" + promo;
}

// 点击忘记密码
function goForgetPwd() {
	$("#popup-login").clearAllTips();
	var loginMail = $.trim($("#loginMail").val());
	if (loginMail === '') {
		$.alertError("请输入忘记密码的邮箱账号");
		return false;
	}
	$.gdAjax({
		url : "login/forgetPwd?email=" + loginMail,
		type : "GET",
		success : function(data) {
			$(".login_wnd").css("display", "none");
			$(".forget_pwd_wnd").css("display", "block");
		}, done: function (data) {
			$.alertSuccess(data.message);
		}
	});
}

// 修改密码
function clickEditPwd() {
	$("#popup-forget-pwd").clearAllTips();
	var loginMail = $.trim($("#loginMail").val());
	var forgetVcode = $.trim($("#forget-vcode").val());
	var forgetNewPassword = $.trim($("#forget-newPassword").val());
	var forgetConfirmPassword = $.trim($("#forget-confirmPassword").val());
	if (loginMail === '') {
		$.alertError("请输入忘记密码的邮箱账号");
		return false;
	}
	// 验证code
	if (forgetVcode.length < 1) {
		$.alertError("验证码不能为空");
		return false;
	}
	// 密码长度不够
	if (forgetNewPassword.length < 6) {
		$.alertError("密码长度至少6位");
		return false;
	}
	// 新密码长度过长
	if (forgetNewPassword.length > 20) {
		$.alertError("密码长度不能超过20位");
		return false;
	}
	// 两次输入不一致
	if (!(forgetNewPassword===forgetConfirmPassword)) {
		$.alertError("两次输入的密码不一致");
		return false;
	}

	$.gdAjax({
		url : "login/editForgetPwd?email=" + loginMail + "&vcode=" + forgetVcode + "&password=" + forgetNewPassword,
		type : "POST",
		success : function(data) {
			var _url = serverAddress.pageUrl + "index.html";
			window.location.href = _url;
		}, done: function (data) {
			$.alertSuccess(data.message);
		}
	});
}

// 向上
function setTop() {
	$("html,body").animate({
		scrollTop: 0,
		screenLeft: 0,
	}, 400);
}

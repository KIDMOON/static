var _u = $.cookie('_u');
var _payConfig = 0;
var _buyCardUrl = "";
var _loadUser = null;
if (!$.isBlank(_u)) {
	_check();
}

function _check() {
	$.gdAjax({
		url : "login/check",
		type : "GET",
		success : function(data) {
			$("#logoutli").hide();
			$("#loginli").css("display", "flex");
			$("#uesrname").text(data.result.nickName);
			if (!$.isBlank(data.result.avatar)) {
				$("#userpicture").attr("src", data.result.avatar);
			}
			$("#_money1").text(data.result.userMoney.moneyFirstLeft.toString().formatMoney(2));
			$("#_money1").attr("data-money", data.result.userMoney.moneyFirstLeft);
			if ($("#_money3")) {
				$("#_money3").text(data.result.userMoney.moneyThirdLeft.toString());
				$("#_money3").attr("data-money", data.result.userMoney.moneyThirdLeft);
			}
			// // 如果充值成功，money1的发生变化，此次关闭充值窗口
			// if (data.result.userMoney.moneyFirstLeft != $("#_money1").attr("data-money")) {
			// 	closeRechargeDialog();
			// }
			_loadUser = data.result;
			if ($("#recharge-promo-code")) {
				if ($.isBlank(data.result.parentUserId)) {
					$("#recharge-promo-code").css("visibility", "visible");
				}
			}
		}
	});
}

$(document).ready(function(){
	
	// open and closed navigation
	var nav_visible = 0;
	$(".open_navigation").click(function(event){
		if(nav_visible == 0){
			$(".nav_content").css("right", "0px");
			$(".open_navigation").addClass("closed_navigation");
			nav_visible = 1;
		}
		else{
			$(".nav_content").removeAttr("style");
			$(".open_navigation").removeClass("closed_navigation");
			nav_visible = 0;
		}
	});
	
	// open and closed game modes
	var game_mode_visible = 0;	
	if(game_mode_visible == 0)
		$(".game_modes .game_modes_block").slideUp(0);
	
	$(".game_modes .open_game_modes").click(function(event){
		if(game_mode_visible == 0){
			$(".game_modes .game_modes_block").slideDown(300,function() {$(this).css({display: "flex"})});
			
			$(".game_modes .open_game_modes").css("transform", "scale(1,-1)");
			$(".game_modes .text").html("收起");
			game_mode_visible = 1;
		}
		else{
			$(".game_modes .game_modes_block").slideUp(300);
			
			$(".game_modes .open_game_modes").css("transform", "scale(1,1)");
			$(".game_modes .text").html("更多");
			game_mode_visible = 0;
		}
	});
	
	// visible info item in live drops
//	$('.live_drops .items .row .item').hover(
//		function () {
//			$('.info', this).fadeIn(100);
//		}, 
//		function () {	
//			$('.info', this).fadeOut(100);			
//		}
//	);
	
	// open toggle user page
	var toggle_visible = 0;
	$(".user_panel .user_settings .toggle").click(function(event){
		if(toggle_visible == 0){
			$(".user_panel .user_settings .toggle .toggle_text").slideDown(300);
			toggle_visible = 1;
		}
		else{
			$(".user_panel .user_settings .toggle .toggle_text").slideUp(300);
			toggle_visible = 0;
		}
	});
	
	//hiddenLdItem();
});

//$(window).resize(function(){
//	hiddenLdItem();
//});

//var position_LD = $(".live_drops").offset();
//$(document).ready(function(){
//	if ($(this).scrollTop() > position_LD['top']) {
//		$(".live_drops").addClass("live_drop_fixed");
//	}else{
//		$(".live_drops").removeClass("live_drop_fixed");
//	}
//});
//$(window).scroll(function() {
//    if ($(this).scrollTop() > position_LD['top']) {
//        $(".live_drops").addClass("live_drop_fixed");
//    }else{
//		$(".live_drops").removeClass("live_drop_fixed");
//	}
//});
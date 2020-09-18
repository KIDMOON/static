
/**
 * 初始化
 */
$().ready(function (){
	var params = $.getArgs();
	//订单号
	var orderId = $.trim(params["orderId"]);
	
	//支付方式动作初始化
	payInitAction();
	
	//选中事件
	$("#payment ul li").click(function(){
		$("#payment ul").find("li").css("border","1px solid #dddddd");
		$(this).css("border","1px solid #da1f33");
	});
	
	$(".btn-confirm").click(function(){
		//支付类型
		var payType = $("input[name='pay']:checked").val();
		//画面ID
		var menuId = "";
		switch(payType){
			case "01"://微信支付
				menuId = "wechatspanpay.html";
				break;
//				$.gdAjax({
//					module:"order",
//					type:"POST",
//					url:"orderpayment/wechatpayReturn",
//					success:function(data) {
//						
//					}
//				});
//				break;
			case "02"://支付宝支付
				menuId = "pcalipay.html";
				break;
			default://网银支付
				menuId = "billpay.html"
		}
		
		
		//--------------TEST--------------
//		if(payType == "01"){
//			return;
//		}
		//--------------TEST--------------
		
		
		
		if(payType == "01" || payType == "02"){
			window.open(menuId + "?orderId=" + orderId) ;
		}else{
			window.open(menuId + "?orderId=" + orderId + "&bankId=" + payType);
		}		
		
		
	});
});

/**
 * 支付方式动作初始化
 */
function payInitAction(){
	//图片滑入设置样式
	$("#payment ul li").hover(function(){
		$(this).css("border","1px solid #da1f33");
		},function(){
			if(!$(this).find("input[name='pay']").is(':checked')){
				$(this).css("border","1px solid #dddddd");
			}		    
		 }
	);
}
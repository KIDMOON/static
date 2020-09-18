/**
 * 初始化
 */
$().ready(function (){
	var params = $.getArgs();
	//订单号
	var amount = $.trim(params["amount"]);
	//订单支付
	getAlipayPayForm(amount);
});

/**
 * 订单支付
 */
function getAlipayPayForm(amount){
	$.gdAjax({
		url:"payment/alipayPayDirect?amount=" + amount,
		success:function(data) {
			$("body").append(data.result);
		}
	});
}
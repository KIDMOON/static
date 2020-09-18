var interval;
var amount;
/**
 * 初始化
 */
$().ready(function (){
	var params = $.getArgs();
	//订单号
	amount = $.trim(params["amount"]);
	//订单支付
	getAlipayPayForm(amount);
});

/**
 * 订单支付
 */
function getAlipayPayForm(amount){
	$.gdAjax({
		url:"payment/uniformOrder?amount=" + amount,
		success:function(data) {
			if(!$.isBlank(data.result)){
				$('.pw-box-hd img').remove();
				$('.pw-box-hd').qrcode({
					 render: "canvas",//渲染方式可选择canvas或table，默认是canvas，canvas方式还支持右键图片下载
					 size: 300,//大小，默认是256 window.location.
					 text: data.result,//二维码包含的内容
					 background  : "#ffffff",   
				     foreground  : "#000000"
				});
				// PC端扫码支付监听是否已支付
				IntervalPayState(orderId);
			}
		}
	});
}

function IntervalPayState(orderId) {
	 interval = setInterval("listenToPayState(orderId)", 5000);
}

function listenToPayState(amountRecordId) {
	$.gdAjax({
		url:"payment/listenToOrder?amountRecordId=" + amountRecordId,
		success:function(data) {
			clearInterval(interval);
			$.alertSuccess("支付订单成功！");
			setTimeout("enterOrderDetail()",3000);
		}
	});
}

/**
 * 跳转
 * @param orderId
 */
function enterOrderDetail() {
	window.location.href = "index.html";
}

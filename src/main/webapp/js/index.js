/**
 * 初始化
 */
$().ready(function () {
	var params = $.getArgs();
	
	// 加载数据
	initBoxList();
	
	if ($.cookie("_agreen") == "0") {
		$("#agreen-dialog-body").height((window.screen.availHeight-240) + "px");
		$("#agreen-dialog").modal('show');
	}
});

function clickAgree() {
	$("#agreen-dialog").modal('hide');
	_setCookie("_agreen", "1");
}

/**
 * 加载箱子list
 */
function initBoxList() {
	$.gdAjax({
		url : "index/boxlist",
		type : "GET",
		success : function(data) {
			var list = data.result;
			for (var i = 0; i < list.length; i++) {
				var entity = list[i];
				var endTime = entity.endTime;
				if (!$.isBlank(endTime)) {
					var nowTime=new Date();
					var year = nowTime.getFullYear();
					var month = nowTime.getMonth() + 1;
					var day = nowTime.getDate();
					var hour = nowTime.getHours();
					var info = data.result;
					var nexTime=new Date(endTime);
					var leftTime = (nexTime) - (nowTime); //计算剩余的毫秒数
					var days = parseInt(leftTime / 1000 / 60 / 60 / 24 , 10); //计算多少天
					var hours = parseInt(leftTime / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
					var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟
					if (days < 0) {
						days = 0;
					}
					if (hours < 0) {
						hours = 0;
					}
					if (minutes < 0) {
						minutes = 0;
					}
					entity.days = checked(days);
					entity.hours = checked(hours);
					entity.minutes = checked(minutes);
				}
			}

			$("#boxInfo").tmpl(data).insertAfter('#mall_header');
			$("#index_empty").remove();
		}
	});
}

function comingsoon() {
	$.alertInfo("敬请期待");
}

function initTime(endTime) {



	var _html = "<div class=\"time-wrap\" _ss8=\"\" _ss7=\"\" style=\"position: absolute;right: 0;\">" +
		"     <div class=\"time-item\" _ss8=\"\">" +
		"      <div class=\"time-half time-up up1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-day\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-day\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-up up2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-day\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-day\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"     </div>" +
		"     <div class=\"time-dot\" _ss8=\"\">" +
		"      天" +
		"     </div>" +
		"     <div class=\"time-item\" _ss8=\"\">" +
		"      <div class=\"time-half time-up up1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-hour\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-hour\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-up up2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-hour\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-hour\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"     </div>" +
		"     <div class=\"time-dot\" _ss8=\"\">" +
		"      时" +
		"     </div>" +
		"     <div class=\"time-item toggle\" _ss8=\"\">" +
		"      <div class=\"time-half time-up up1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-minute\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down1\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-minute\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-up up2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-minute\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"      <div class=\"time-half time-down down2\" _ss8=\"\">" +
		"       <div class=\"time-num time-num-minute\" _ss8=\"\">" +
		"        00" +
		"       </div>" +
		"      </div>" +
		"     </div>" +
		"     <div class=\"time-dot\" _ss8=\"\">" +
		"      分" +
		"     </div>" +
		"    </div>";
}

function checked(j){
	if(j<10)
		j='0'+j;
	return j;
}

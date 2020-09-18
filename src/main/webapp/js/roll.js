var index = 0;
/**
 * 初始化
 */
$().ready(function () {
	var params = $.getArgs();
	if (!$.isBlank(params["index"])) {
		index = params["index"];
	}
	$(".roll_c a").removeClass("active");
	$(".roll_c a").eq(index).addClass("active");

	// 加载数据
	initRollList();
});

/**
 * 加载list
 */
function initRollList() {
	$.gdAjax({
		url : "roll/getByTab" + index,
		type : "POST",
		success : function(data) {
			var nowTime=new Date();
			var year = nowTime.getFullYear();
			var month = nowTime.getMonth() + 1;
			var day = nowTime.getDate();
			var hour = nowTime.getHours();
			var infos = data.result;
			var _html = "";
			for (var infosKey in infos) {
				var info = infos[infosKey];
				var nexTime=new Date(info.rollEndTime);
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
				_html += "<div class='rp-i' _ss8='' onclick=\"javascript:location.href = 'rolldetail.html?id=" + info.rollId + "'\">" +
					"     <div class='rpi-h' _ss8=''>" +
					"      <div class='rpih-img' _ss8='' style='background-image: url(" + serverAddress.file + info.rollPicture + ");'></div>" +
					"      <div class='txt' _ss8=''>" +
							info.rollTitile +
					"      </div>";
					if (info.field03 == "1") {
						_html += "<img src='images/other/roll_over.png' width='80' _ss8=''>";
					} else if (info.inFlag) {
						_html += "<img src='images/other/roll_in.png' width='80' _ss8=''>";
					}
				_html += "</div>" +
					"     <div class='rpi-b' _ss8=''>" +
					"      <div class='left' _ss8=''>" +
					"       <div class='row' _ss8=''>" +
					"        <img src='images/other/roll1.png' width='16' _ss8='' /> 共" + info.rollGoodsCount + "件，价值：" +
					"        <span _ss8=''>&nbsp;<b _ss8=''>" + info.rollGoodsPrice + "</b> K币</span>" +
					"       </div>" +
					"       <div class='row' _ss8=''>" +
					"        <img src='images/other/roll2.png' width='16' _ss8='' /> " + info.rollUserCount + "人已参与" +
					"       </div>" +
					"       <div class='time-wrap' _ss8=''>" +
					"        <div class='time-item' _ss8=''>" +
					"         <div class='time-half time-up up1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(days) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(days) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-up up2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(days) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(days) +
					"          </div>" +
					"         </div>" +
					"        </div>" +
					"        <div class='time-dot' _ss8=''>" +
					"         天" +
					"        </div>" +
					"        <div class='time-item' _ss8=''>" +
					"         <div class='time-half time-up up1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(hours) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(hours) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-up up2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(hours) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(hours) +
					"          </div>" +
					"         </div>" +
					"        </div>" +
					"        <div class='time-dot' _ss8=''>" +
					"         时" +
					"        </div>" +
					"        <div class='time-item' _ss8=''>" +
					"         <div class='time-half time-up up1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(minutes) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down1' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(minutes) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-up up2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(minutes) +
					"          </div>" +
					"         </div>" +
					"         <div class='time-half time-down down2' _ss8=''>" +
					"          <div class='time-num' _ss8=''>" +
					checked(minutes) +
					"          </div>" +
					"         </div>" +
					"        </div>" +
					"        <div class='time-dot' _ss8=''>" +
					"         分" +
					"        </div>" +
					"       </div>" +
					"      </div>" +
					"      <div class='right' _ss8=''>" +
					"       <div class='arm' _ss8='' style='background-image: url(images/items/types/" + info.field01 + ".png);'>" +
					"        <div class='img' _ss8='' style='background-image: url(" + serverAddress.file + info.field02 + ");'></div>" +
					"       </div>" +
					"      </div>" +
					"     </div>" +
					"     <div class='rpi-bt' _ss8=''>" +
					"      <a></a>" +
					"      <a class='yellow_button' target='_blank' _ss8='' style='font-size: 20px;'>" + ((info.field03 == "1")?"查看结果":"立即参加") + "</a>" +
					"     </div>" +
					"    </div>";
			}
			$("#roll-content").html(_html);
		}
	});
}

function checked(j){
	if(j<10)
		j='0'+j;
	return j;
}


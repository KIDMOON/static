var id = 0;
var pageIndex = 0;
/**
 * 初始化
 */
$().ready(function () {
	var params = $.getArgs();
	id = params["id"];

	// 加载数据
	initDetail();
	initRollUser();
});

/**
 * 加载箱子list
 */
function initDetail() {
	$.gdAjax({
		url : "roll/get/"+id,
		type : "GET",
		success : function(data) {
			var nowTime=new Date();
			var year = nowTime.getFullYear();
			var month = nowTime.getMonth() + 1;
			var day = nowTime.getDate();
			var hour = nowTime.getHours();
			var info = data.result;
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
			$(".time-num-day").text(checked(days));
			$(".time-num-hour").text(checked(hours));
			$(".time-num-minute").text(checked(minutes));

			$("#rollPicture").css("background-image", "url(" + serverAddress.file + info.rollPicture + ")");
			$("#rollTitle").text(info.rollTitile);
			var _sub = info.rollSub;
			if (info.rechargeMoney != 0) {
				_sub += "<br>" + "参与条件：";
				_sub += new Date(info.rollStartTime).Format("MM月DD日HH:mm") + " ~ " + new Date(info.rollEndTime).Format("MM月DD日HH:mm") + "充值满" + $.toCoin(info.rechargeMoney) + "即可参加";
			}
			$("#rollSub").html(_sub);
			$("#rollEndTime").text(new Date(info.rollEndTime).Format("YYYY-MM-DD HH:mm"));
			$("#rollGoodsCount").text(info.rollGoodsCount);
			$("#rollGoodsPrice").text(info.rollGoodsPrice);

			if (info.inFlag) {
				$(".seal-img").show();
			} else {
				$("#join-btn").show();
			}

			// 饰品List
			var rollGoods = info.rollGoodsList;
			var goodsHtml = "";
			for (var index in rollGoods) {
				var goodsInfo = rollGoods[index];
				if (index == 0) {
					goodsHtml += "<div class='prize-items prize-items-0' _ss7=''> ";
				} else {
					goodsHtml += "<div class='prize-items' _ss7=''> ";
				}
				goodsHtml += "      <div class='exter' _ss7=''> " +
						goodsInfo.goodsWearName +
					"      </div> " +
					"      <div class='arm-item' _ss7=''> " +
					"       <div class='arm' _ss7='' style='background-image: url(" + serverAddress.file + goodsInfo.goodsPicture + ");'></div> " +
					"      </div> " +
					"      <div class='arm-name' _ss7=''> " +
						goodsInfo.goodsName +
					"      </div> " +
					"      <div class='arm-price' _ss7=''> " +
						goodsInfo.goodsPrice +
					"       <span class='f12' _ss7=''>KB</span> " +
					"      </div> " +
					"     </div>";
			}
			$("#rollGoods").html(goodsHtml);

			// 获奖者
			if (info.field03 == "1") {
				var winHtml = "";
				for (var index in rollGoods) {
					var goodsInfo = rollGoods[index];
					if($.isBlank(goodsInfo.winUserId)) {
						continue;
					}
					winHtml += "<div class='roster-items roster-items-" + (Number(index)+1) + "' _ss7=''>";
						if (index == 1) {
							winHtml += "<img class='roster-icon' src='images/other/win2.png' _ss7=''>";
						} else if (index == 2) {
							winHtml += "<img class='roster-icon' src='images/other/win3.png' _ss7=''>";
						}
					winHtml += "<div class='avatar' _ss7='' style='background-image: url(" + goodsInfo.avatar + ");'></div>" +
						"      <div _ss7=''>" +
						"       <div class='nickname' _ss7=''>" + goodsInfo.nickName + "</div>" +
						"       <div class='bottom' _ss7=''>" +
						"        <div class='arm-item' _ss7='' style='background-image: url(images/items/types/" + goodsInfo.goodsLevel + ".png);'>" +
						"         <div class='arm' _ss7='' style='background-image: url(" + serverAddress.file + goodsInfo.goodsPicture + ");'></div>" +
						"        </div>" +
						"        <div class='arm-price' _ss7=''>" +
							goodsInfo.goodsPrice +
						"         <span class='f12' _ss7=''>KB</span></div>" +
						"       </div>" +
						"      </div>" +
						"     </div>";
				}
				$("#win_user_div").show();
				$("#win_user").html(winHtml);
			}
		}
	});
}

/**
 * 参加用户
 */
function initRollUser() {
	var data = new Object();
	var obj = new Object();
	obj.rollId = id;
	data.pageIndex = pageIndex;
	data.param = obj;
	$.gdAjax({
		url : "roll/userlist",
		data : data,
		type : "POST",
		success : function(data) {
			var _html = "";
			for (var index in data.result) {
				var e = data.result[index];
				_html += "<div class='user-items' _ss7=''>" +
					"      <div class='user-avatar' _ss7='' style='background-image: url(" + e.userAvatar + ");'></div>" +
					"      <div class='user-name' _ss7=''>" +
						e.userNickName +
					"      </div>" +
					"     </div>";
			}
			$("#rollUserList").html(_html);
			$("#rollUserCount").text(data.pager.recordSize + " ");
			//分页设置
			doPagination(data);
		}
	});
}

/**
 * 立即参加
 */
function join() {
	$.gdAjax({
		url : "roll/join/"+id,
		type : "POST",
		success : function(data) {
			$.alertSuccess("参加活动成功");
			$("#join-btn").hide();
			$(".seal-img").show();
			initRollUser();
		}
	});
}

/**
 * 分页
 * @param data
 */
function doPagination(data) {
	if(data.pager.recordSize != null) {
		var pageCount = parseInt((data.pager.recordSize + data.pager.pageSize - 1) / data.pager.pageSize);
		pageCount = (pageCount <= 0) ? 1 : pageCount;
	}
	var current = ($.isBlank(data.pager.pageIndex)? 0 : data.pager.pageIndex) + 1;
	var options = {
		bootstrapMajorVersion: 3,//bootstrap版本
		currentPage: current,//当前页
		totalPages: pageCount,//总页数
		numberOfPages: 10,//显示几个分页按钮（在ul里面生成5个li）
		itemTexts: function (type, page, current) {//设置显示的样式，默认是箭头
			switch (type) {
				case "first":
					return "<<";
				case "prev":
					return "<";
				case "next":
					return ">";
				case "last":
					return ">>";
				case "page":
					return page;
			}
		},
		onPageClicked:  function(event, originalEvent, type, page) {//li点击事件
			pageIndex = page - 1;
			initRollUser();
		}
	}
	$("#pagination ul").bootstrapPaginator(options);
}

function checked(j){
	if(j<10)
		j='0'+j;
	return j;
}


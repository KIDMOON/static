var pageIndex = 0;
// 所有的奖金
var allBonusArray;
// 抽中的奖金
var resultBonusList;
// 抽奖每个cell的width
var cellWidth = 170;
// 抽奖移动的速度0.15
var cellSpeed = 0.15;
var moveTime = 7;
// 为了抽奖商品重复的倍数
var repeatCount = 0;
//计数是否所有的都滚完
var allCount = 0;
// 最大的开箱个数
var maxNum = 5;
var auto001;
var auto002;
var auto003f;
var auto003w;
var transInterval;
var laster = 0;
// 抽奖框大小
var tapeWidth = 0;
// 离 最大的抽奖框中间指针的误差
var deviateWidth = 0;
// bonus
var bonusConfig;
/**
 * 初始化
 */
$().ready(function (){
	
	tapeWidth = $("#tapeBox").width();
	deviateWidth = (1220 - tapeWidth) / 2;
	
	// 加载数据
	getBonusInfo();
	
	// 声音
	auto001 = document.getElementById('audio_001');
	auto002 = document.getElementById('audio_002');
	auto003f = document.getElementById('audio_003_f');
	auto003w = document.getElementById('audio_003_w');

	// 打开动作
	$("#open").click(function () {
		if ($("#open").attr("data-status") == "1") {
			return;
		}
		$("#open").text("打开中...");
		$("#open").attr("data-status", "1");
		// 复原状态
		$("#tapeBox>.rolling_items>.items").removeAttr("style");
		$(".multiple-win-item").remove();
		allCount = 0;
		var tapeBorderObj = $("#tapeBox .rolling_items");
		$.gdAjax({
			url : "bonus/open",
			type : "GET",
			success : function(data) {
				// 数据处理
				resultBonusList = new Array();
				resultBonusList.push(data.result);
				for (var i in resultBonusList) {
					var resultBonus = resultBonusList[i];
					var boxs = $("#tapeBox>.rolling_items>").eq(i);

					// 在前面随机生成5个装备,删除之前添加的随机5个
					$(boxs).find(".item[data-id='front']").remove();
					var _contents = "";
					var frontBonusArray = getRandom({'arry':allBonusArray, 'range':5});
					for (var j=0; j<frontBonusArray.length; j++) {
						_contents += genTapeCell(frontBonusArray[j], "front");
					}
					$(boxs).prepend(_contents);

					// 计算动画
					var openBonusObj = $(tapeBorderObj).eq(i).find(".item[data-id='" + resultBonus.bonusConfigDetailId + "']").eq(repeatCount - 1);
					var c = $(tapeBorderObj).eq(i).find(".item").index(openBonusObj) - 3;

					$(boxs).css("transition", "all " + c * cellSpeed + "s cubic-bezier(0,.81,.01,1)");
					var cWidth = "-" + ((c * cellWidth) + ((Math.random()-0.5) * 150) + deviateWidth) + "px";
					$(boxs).css("transform", "translate3d(" + cWidth + ", 0, 0)");
				}
				//　播放音乐
				auto001.play();
				transInterval = setInterval(playsound, 100);
			},
			faild : function(data) {
				showOpenPrice();
			}
		});
	});
	
	// 全部收下
	$("#multi-all-tack").click(function () {
		$.alertSuccess("收下成功！");
		closedWindow();
	});
	
	// 查看中奖概率
	$("#showPrize").click(function () {
		$(".wnd").css("display", "none");
		$(".wnd_bg").css("display", "none");
		$(".inside_wnd").css("display", "block");
		$(".wnd_bg").css("display", "block");
		$(".page").css("filter", "blur(5px)");
	});
	$(".closed_wnd").click(function(event){
		closedWindow();
	});
});

/**
 * 连续播放声音
 */
function playsound() {
	var boxs = $("#tapeBox>.rolling_items>").eq(0);
	var transformval = $(boxs).css("transform");
	if (transformval) {
		var transformvals = transformval.split(",");
		if (transformvals && transformvals.length > 5) {
			var currentPosition = -(Number(transformvals[4])) - 85;
			var current = parseInt(currentPosition / 170);
			if (current > laster) {
				auto002.currentTime = 0.0;
				auto002.play();
			}
			laster = current;
		}
	}
}

/**
 * 显示打开的金额
 */
function showOpenPrice() {
	$("#open").attr("data-status", "0");
	if ($("#open").attr("class") == "gray_button") {
		$("#open").text("即将开启");
	} else {
		$("#open").text("免费开启");
	}
}

/**
 * 收下商品
 */
function tokeById(id) {
	$(".multiple-win-item[data-id='" + id + "']").remove();
	$.alertSuccess("收下成功！");

	if ($(".multiple-win-item:visible").length == 0) {
		$("#multi-win").modal('hide');
	}
}

/**
*查询数据
*/
function getBonusInfo() {
	$.gdAjax({
		url : "bonus/info",
		type : "GET",
		success : function(data) {
			bonusConfig = data.result;

			var _html = "";
			allBonusArray = bonusConfig.bonusConfigDetailList;
			var goodsArray = allBonusArray;

			$("#detailBonusSum").text("共 " + goodsArray.length + " 个物品");
			$("#detailBonus").tmpl(goodsArray).appendTo("#detailBonusDiv");
			var prizehtml = $("#detailPrize").tmpl(goodsArray);
			$("#prizeDiv>div").after(prizehtml);
			$("#prizeDiv").mCustomScrollbar();
			
			// 生成抽奖模块的html
			var _all = "";
			for (var i=0; i<maxNum; i++) {
				var _contents = genTapeList();
				_contents = "<div class='rolling_items' style='display: none;'><div class='items'>"+ _contents + "</div></div>";
				_all += _contents;
			}
			$("#tapeBox .marker").after(_all);
			$("#tapeBox>.rolling_items").first().show();
			$("#box-goods-div").html(_html);

			bindTransitionendEvent();

			// 获取用户抽取历史
			getUserBonusInfo();
		}
	});
}

/**
 *查询数据
 */
function getUserBonusInfo() {
	var data = new Object();
	var obj = new Object();
	data.pageIndex = pageIndex;
	data.param = obj;
	$.gdAjax({
		url : "bonus/openRecord",
		data : data,
		type : "POST",
		success : function(data) {
			var _html = "<div class='mitem'>";
			_html += "		<div class='mitem1'>奖金</div>";
			_html += "		<div class='mitem2'>开奖时间</div>";
			_html += "	</div>";

			for ( var index in data.result) {
				var e = data.result[index];

				// 最新的打开记录
				if (index == 0) {
					var cycleHour = bonusConfig.cycleHour;
					var nowTime=new Date();
					var nextOpenTime=new Date(e.createDate);
					nextOpenTime.setHours(nextOpenTime.getHours() + cycleHour);
					if (nowTime < nextOpenTime) {
						$("#open").text("即将开启");
						$("#open").attr("class", "gray_button");

						var leftTime = (nextOpenTime) - (nowTime); //计算剩余的毫秒数
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
						$("#open-left-time").css("display", "flex");
					}
				}

				var bonusPrice = $.toCoin(e.bonusPrice.toString());

				_html += "<div class='mitem'>";
				_html += "	<div class='mitem1'>";

				_html += "		<img src='images/other/bonus02.png'>";
				_html += "		<span>" + bonusPrice + "</span>";

				_html += "	</div>"
				_html += "	<div class='mitem2'>" + ($.isBlank(e.createDate)?"":new Date(e.createDate).Format("YYYY-MM-DD HH:mm:SS")) + "</div>";
				_html += "</div>";
			}
			$("#mybonusdiv").html(_html);
			//分页设置
			doPagination(data);
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
			getUserBonusInfo();
		}
	}
	$("#pagination ul").bootstrapPaginator(options);
}

/**
 * 随机生成抽奖模块html
 * @returns {String}
 */
function genTapeList() {
	repeatCount = 0;
	var _content = "";
	// 抽奖内容随机打乱
	var randomBonusArray = getRandom({'arry':allBonusArray, 'range':allBonusArray.length});
	for (var i in randomBonusArray) {
		// 抽奖内容
		_content += genTapeCell(randomBonusArray[i], null);
	}
	
	// 计算需要添加多少个_content
	var bonusSize = allBonusArray.length;
	// 计算得到所有的商品走一圈需要多久
	var cellMoveTime = bonusSize * cellSpeed;
	// 计算需要走几圈，才能达到moveTime的时长
	var _contents = "";
	for (var z=0; z<100; z++) {
		if (cellMoveTime * (z+1) > moveTime) {
			break;
		}
		repeatCount++;
		_contents += _content;
	}
	// 如果repeatCount<2，则补全2
	if (repeatCount < 2) {
		var size = 2-repeatCount;
		for (var z=0; z<size; z++) {
			repeatCount++;
			_contents += _content;
		}
	}
	
	// 在最后再添加随机4个商品，保证最后不空！
	var lastBonusArray = getRandom({'arry':allBonusArray, 'range':4});
	for (var i=0; i<lastBonusArray.length; i++) {
		_contents += genTapeCell(lastBonusArray[i], "last");
	}
	
	// 在前面随机生成5个装备
	var frontBonusArray = getRandom({'arry':allBonusArray, 'range':5});
	for (var i=0; i<frontBonusArray.length; i++) {
		_contents = genTapeCell(frontBonusArray[i], "front") + _contents;
	}
	return _contents;
}

/**
 * 生成抽奖中每个cell
 * @param bonusObj
 * @param flag 如果是空则插入id，否则插入flag
 */
function genTapeCell(bonusObj, flag) {
	var _content = "";
	_content += "<div class='item' data-id='" + ($.isBlank(flag) ? bonusObj.bonusConfigDetailId : flag) + "'>";
	_content += "	<img class='item_img' src='images/other/bonus01.png'>";
	_content += "	<div class='name'>" + bonusObj.bonusPrice + " KB</div>";
	_content += "</div>"
	return _content;
}

/**
 * 绑定动画事件
 */
function bindTransitionendEvent() {
	var boxs = $("#tapeBox>.rolling_items");
	$(boxs).bind("transitionend", function () {
		clearInterval(transInterval);
		transInterval = null;
		laster = 0;
		// 延迟执行弹出框
		setTimeout("showWinModal()", 500);
	});
}

/**
 * 显示抽中的弹出框
 */
function showWinModal() {
	showOpenPrice();
	
	var _html = "";
	var _price = resultBonusList[0].bonusPrice;
	_html += "<div class='win_item'>";
	_html += "	<img class='win_item_item' src='images/other/bonus01.png' alt=''>";
	_html += "	<div class='win_item_price'>" + $.toCoin(resultBonusList[0].bonusPrice) + "</div>";
	_html += "</div>";
	$("#multi-win .win_items").html(_html);

	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".winning_wnd").css("display", "block");
	$(".wnd_bg").css("display", "block");
	$(".page").css("filter", "blur(5px)");

	auto003w.play();

	// 获取用户抽取历史
	getUserBonusInfo();

	// 刷新金额
	_check();
}

/**
 * 得到array中随机5个商品
 * @param opt
 */
function getRandom(opt) {
	var old_arry = opt.arry,
    range = opt.range;
	//防止超过数组的长度
	range = range > old_arry.length?old_arry.length:range;
	var newArray = [].concat(old_arry), //拷贝原数组进行操作就不会破坏原数组
	    valArray = [];
	for (var n = 0; n < range; n++) {
	    var r = Math.floor(Math.random() * (newArray.length));
	    valArray.push(newArray[r]);
	    //在原数组删掉，然后在下轮循环中就可以避免重复获取
	    newArray.splice(r, 1);
	}
	return valArray;
}

function checked(j){
	if(j<10)
		j='0'+j;
	return j;
}

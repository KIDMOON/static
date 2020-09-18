var boxId = '';
var boxPrice = 0;
// 所有的装备
var allGoodsArray;
// 抽中的装备
var resultGoodsList;
var count = 1;
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
// 箱子类型
var boxType = 0;
// 库存
var flashCount = 0;
// 抽奖框大小
var tapeWidth = 0;
// 离 最大的抽奖框中间指针的误差
var deviateWidth = 0;
/**
 * 初始化
 */
$().ready(function (){
	
	tapeWidth = $("#tapeBox").width();
	deviateWidth = (1220 - tapeWidth) / 2;
	
	var params = $.getArgs();
	// 箱子ID
	boxId = params["id"];
	// 加载数据
	getBoxInfo();
	
	// 声音
	auto001 = document.getElementById('audio_001');
	auto002 = document.getElementById('audio_002');
	auto003f = document.getElementById('audio_003_f');
	auto003w = document.getElementById('audio_003_w');
	
	// 箱子个数下拉点击动作
	$("#open-box-div-left a").click(function () {
		var _num = parseFloat($.trim($(this).text()));
		// 显示内容
		for (var i=0; i<_num; i++) {
			$("#tapeBox>.rolling_items").eq(i+1).show();
		}
		for (var i=_num-1; i<maxNum; i++) {
			$("#tapeBox>.rolling_items").eq(i+1).hide();
		}
		// 显示价格
		$("#boxPriceSpan").text($.toCoin((boxPrice * _num).toString()));
		$("#open-box-div-left a").removeClass("active");
		$(this).addClass("active");
	});
	
	// 打开箱子动作
	$("#open").click(function () {
		if ($("#open").attr("data-status") == "1") {
			return;
		}
		$("#open").text("打开中...");
		$("#open-box-div-left").css("visibility", "hidden");
		$("#open").attr("data-status", "1");
		// 复原状态
		$("#tapeBox>.rolling_items>.items").removeAttr("style");
		$(".multiple-win-item").remove();
		count = parseFloat($.trim($(".count_opening .active>.page").text()));
		allCount = 0;
		var tapeBorderObj = $("#tapeBox .rolling_items");
		$.gdAjax({
			url : "index/boxopen/" + boxId + "/" + count,
			type : "GET",
			success : function(data) {
				// 数据处理
				resultGoodsList = data.result;
				for (var i in resultGoodsList) {
					var resultGoods = resultGoodsList[i];
					var boxs = $("#tapeBox>.rolling_items>").eq(i);
					
					// 在前面随机生成5个装备,删除之前添加的随机5个
					$(boxs).find(".item[data-id='front']").remove();
					var _contents = "";
					var frontGoodsArray = getRandom({'arry':allGoodsArray, 'range':5});
					for (var j=0; j<frontGoodsArray.length; j++) {
						_contents += genTapeCell(frontGoodsArray[j], "front");
					}
					$(boxs).prepend(_contents);
					
					// 计算动画
					var openGoodsObj = $(tapeBorderObj).eq(i).find(".item[data-id='" + resultGoods.goodsId + "']").eq(repeatCount - 1);
					var c = $(tapeBorderObj).eq(i).find(".item").index(openGoodsObj) - 3;
					
					$(boxs).css("transition", "all " + c * cellSpeed + "s cubic-bezier(0,.81,.01,1)");
					var cWidth = "-" + ((c * cellWidth) + ((Math.random()-0.5) * 150) + deviateWidth) + "px";
					$(boxs).css("transform", "translate3d(" + cWidth + ", 0, 0)");
				}
				// 扣钱显示
				var currentmoney1 = parseFloat($("#_money1").attr("data-money"));
				var _num = parseFloat($.trim($(".count_opening .active>.page").text()));
				var money1 = currentmoney1 - (boxPrice * _num);
				$("#_money1").text("$ " + money1.toString().formatMoney(2));
				$("#_money1").attr("data-money", money1);
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
	
	// 全部出售
	$("#multi-all-sell").click(function () {
		var ids = new Array();
		$("#multi-win .win_item").each(function () {
			ids.push($(this).attr("data-id")); 
		});
		var allPrice = parseFloat($("#multi-all-sell").attr("data-price"));
		sellById(ids, allPrice);
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
	var _num = Number($(".count_opening .active>.page").text());
	// 显示价格
	$("#boxPriceSpan").text($.toCoin((boxPrice * _num).toString()));
	if (boxType == "7") {
		flashCount = flashCount - count;
		$("#open").text("开启(剩余" + flashCount + ")");
	} else {
		$("#open").text("立即打开");
	}
	$("#open-box-div-left").css("visibility", "visible");
}

/**
 * 收下商品
 */
function tokeById(id) {
	$(".multiple-win-item[data-id='" + id + "']").remove();
	$.alertSuccess("收下成功！");
	refshAllPrice();
	
	if ($(".multiple-win-item:visible").length == 0) {
		$("#multi-win").modal('hide');
	}
}

/**
 * 出售商品
 */
function sellById(id, price) {
	var data = new Object();
	var ids = new Array();
	if (id instanceof Array) {
		ids = id;
	} else {
		ids.push(id);
	}
	data.ids = ids;
	data.param = new Object();
	$.gdAjax({
		url : "usercenter/sellgoods",
		type: "POST",
		data : data,
		success : function(data) {
			$.alertSuccess("出售成功！");
			closedWindow();
			var currentmoney1 = parseFloat($("#_money1").attr("data-money"));
			var money1 = currentmoney1 + price;
			$("#_money1").text("$ " + money1.toString().formatMoney(2));
			$("#_money1").attr("data-money", money1);
		}
	});
}

/**
*查询数据
*/
function getBoxInfo() {
	$.gdAjax({
		url : "index/boxdetail/" + boxId,
		type : "GET",
		success : function(data) {
			var box = data.result;
			$("#boxNameEle").text(box.boxName);
			boxPrice = box.boxPrice;
			$("#boxPriceSpan").text($.toCoin(box.boxPrice.toString()));
			$("#total_price").css("visibility", "visible");
			$(".boxPriceSpan").text($.toCoin(box.boxPrice.toString()));
			boxType = box.regionType;
			if (boxType == "7") {
				flashCount = Number(box.field05);
				$("#open").text("开启(剩余" + flashCount + ")");
			}

			var _html = "";
			allGoodsArray = box.boxGoodsList;
			
			// goodsArray = getRandom({'arry':allGoodsArray, 'range':allGoodsArray.length});
			goodsArray = allGoodsArray;
			
			var addGoodsArray = new Array();
			
			// 按照装备等级排序
			var compare = function (x, y) {//比较函数
			    if (x.goodsLevel > y.goodsLevel) {
			        return 1;
			    } else if (x.goodsLevel < y.goodsLevel) {
			        return -1;
			    } else {
			        return 0;
			    }
			}
			goodsArray.sort(compare);
			
			$("#detailGoodsSum").text("共 " + goodsArray.length + " 个物品");
			$("#detailGoods").tmpl(goodsArray).appendTo("#detailGoodsDiv");
			var prizehtml = $("#detailPrize").tmpl(goodsArray);
			$("#prizeDiv>div").after(prizehtml);
			$("#prizeDiv").mCustomScrollbar();
			
			for (var i in goodsArray) {
				// 重复的名称，不展示
//				if (addGoodsArray.indexOf(goodsArray[i].goodsName) == -1) {
//					addGoodsArray.push(goodsArray[i].goodsName);
//					// 箱子内容
//					_html += "<span class='wearon-item wearon extraordinary weapon-list gloves'>";
//					_html += "	<div class='topname'><span>";
//					_html += (goodsArray[i].statTrak? "StatTrak™" : "");
//					_html += "	</span></div>"
//					_html += "	<div class='detail_cell_bg' style='background-image: url(media/images/open" + goodsArray[i].goodsLevel + ".png);'></div>";
//					if (goodsArray[i].goodsPrice >= box.boxPrice * 3) {
//						_html += "	<div class='detail_cell_fire'><span class='tooltiptext'>箱子价格三倍以上！</span></div>";
//					}
//					_html += "	<div class='img'>";
//					_html += "  	<img src='" + serverAddress.apiUrl + goodsArray[i].goodsPicture + "'>";
//					_html += "	</div>";
//					_html += "	<div class='name'>";
//					_html += "		<span>" + goodsArray[i].goodsName + "</span>";
//					_html += "		<span class='subname'>" + goodsArray[i].goodsWearName + "</span>";
//					_html += "	</div>";
//					_html += "</span>";
//				}
				
				// 抽奖概率
				//_prize += "<tr><td>" + goodsArray[i].goodsName + "|" + goodsArray[i].goodsWearName + "</td>";
				//_prize += "<td>" + goodsArray[i].goodsWeight01 + "%</td></tr>";
			}
			
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
			//$("#result-winning").html(_prize);
			
			bindTransitionendEvent();
		}
	});
}

/**
 * 随机生成抽奖模块html
 * @returns {String}
 */
function genTapeList() {
	repeatCount = 0;
	var _content = "";
	// 抽奖内容随机打乱
	var randomGoodsArray = getRandom({'arry':allGoodsArray, 'range':allGoodsArray.length});
	for (var i in randomGoodsArray) {
		// 抽奖内容
		_content += genTapeCell(randomGoodsArray[i], null);
	}
	
	// 计算需要添加多少个_content
	var goodsSize = allGoodsArray.length;
	// 计算得到所有的商品走一圈需要多久
	var cellMoveTime = goodsSize * cellSpeed;
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
	var lastGoodsArray = getRandom({'arry':allGoodsArray, 'range':4});
	for (var i=0; i<lastGoodsArray.length; i++) {
		_contents += genTapeCell(lastGoodsArray[i], "last");
	}
	
	// 在前面随机生成5个装备
	var frontGoodsArray = getRandom({'arry':allGoodsArray, 'range':5});
	for (var i=0; i<frontGoodsArray.length; i++) {
		_contents = genTapeCell(frontGoodsArray[i], "front") + _contents;
	}
	return _contents;
}

/**
 * 生成抽奖中每个cell
 * @param goodsObj
 * @param flag 如果是空则插入id，否则插入flag
 */
function genTapeCell(goodsObj, flag) {
	var _content = "";
	_content += "<div class='item' data-id='" + ($.isBlank(flag) ? goodsObj.goodsId : flag) + "'>";
	_content += "	<img class='type_img' src='images/items/types/inner_" + goodsObj.goodsLevel + ".png' alt=''>";
	_content += "	<img class='item_img' src='" + serverAddress.file + goodsObj.goodsPicture + "'>";
	_content += "	<div class='name'>" + goodsObj.goodsName + "</div>";
	_content += "</div>"
	return _content;
}

/**
 * 绑定动画事件
 */
function bindTransitionendEvent() {
	var boxs = $("#tapeBox>.rolling_items");
	$(boxs).bind("transitionend", function () {
		allCount++;
		if (allCount == count) {
			clearInterval(transInterval);
			transInterval = null;
			laster = 0;
			// 延迟执行弹出框
			setTimeout("showWinModal()", 500);
		}
	});
}

/**
 * 显示抽中的弹出框
 */
function showWinModal() {
	showOpenPrice();
	
	var _html = "";
	var _price = 0;
	var _points = 0;
	for (var j in resultGoodsList) {
		var _goods = resultGoodsList[j];
		_price += _goods.goodsPrice;
		_points += _goods.extraPoints;
		_html += "<div class='win_item' data-id='" + _goods.userGoodsId + "' data-price='" + _goods.goodsPrice + "'>";
		_html += "	<img class='win_item_type' src='images/items/types/inner_" + _goods.goodsLevel + ".png' alt=''>";
		_html += "	<img class='win_item_item' src='" + serverAddress.file + _goods.goodsPicture + "' alt=''>";
		_html += "	<div class='win_item_name'>" + _goods.goodsName + "</div>";
		_html += "	<div class='win_item_price'>$ " + _goods.goodsPrice + "</div>";
		_html += "</div>";
	}
	$("#multi-win .win_items").html(_html);
	$("#multi-all-sell").text("出售 $ " + _price.toString().formatMoney(2));
	$("#multi-all-sell").attr("data-price", _price);
	$("#multi-win .win_item_credit").text("额外获得: " + _points + " 积分");

	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".winning_wnd").css("display", "block");
	$(".wnd_bg").css("display", "block");
	$(".page").css("filter", "blur(5px)");
	
	if (_price < resultGoodsList.length * boxPrice) {
		auto003f.play();
	}
	else {
		auto003w.play();
	}
	
//		_html += "<div class='multiple-win-item' data-id='" + _goods.userGoodsId + "' data-price='" + _goods.goodsPrice + "'>";
//		_html += "	<img class='win-bg-img' src='media/images/goods_detail_bg_hover_" + _goods.goodsLevel + ".png'>";
//		_html += "	<div class='win-item-imgdiv'>";
//		_html += "		<img src='" + serverAddress.apiUrl + _goods.goodsPicture + "'>";
//		_html += "	</div>";
//		_html += "	<div class='win-name-div'>" + _goods.goodsName + "</div>";
//		_html += "	<div class='win-wear-div'>" + _goods.goodsWearName + "</div>";
//		_html += "	<div class='goods-title-div'>";
//		//_html += "		<img src='media/images/12-2.png'>";
//		_html += "		<div class='goods-title user_goods_hover_button_" + _goods.goodsLevel + "'>$ " + _goods.goodsPrice + "</div>";
//		_html += "	</div>";
//		_html += "	<div style='position: absolute; top: 560px;'>";
//		_html += "		<button class='multi-button multi-button-one user_goods_hover_button_" 
//			+ _goods.goodsLevel + "' onclick=\"tokeById('" + _goods.userGoodsId + "')\">收下</button>&nbsp;&nbsp;";
//		_html += "		<button class='multi-button multi-button-two user_goods_hover_button_" 
//			+ _goods.goodsLevel + "' onclick=\"sellById('" + _goods.userGoodsId + "', " + _goods.goodsPrice + ")\">出售</button>";
//		_html += "	</div>";
//		_html += "	<div class='win-points'>额外获得：" + _goods.extraPoints + " 积分</div>";
//		_html += "</div>";
//		_price += _goods.goodsPrice * 100;
//	}
//	
//	$("#multi-all-sell").text("全部出售($ " + (_price / 100) + ")");
//	$("#multi-all-sell").attr("data-price", (_price / 100));
//	$("#open-box-result").html(_html);
//	$("#multi-win").modal('show');
//	$("#multi-win .multiple-win").css("width", (300 * count + 100) + "px");
//	
//	if (count == 1) {
//		$('#multi-win .modal-footer').hide();
//	} else {
//		$('#multi-win .modal-footer').show();
//	}
}

/**
 * 加载箱子list
 * @param obj
 */
function initBoxList(obj) {
	var regionId = $(obj).attr("id");
	// 选中li
	$("#menuZoon li.active").removeClass("active");
	$(obj).addClass("active");
	// title显示
	$("#regionNameSpan").text($(obj).find("img").attr("alt"));
	$.gdAjax({
		url : "index/boxlist/" + regionId,
		type : "GET",
		success : function(data) {
			var _html = "";
			for (var index in data.result) {
				var entity = data.result[index];
				_html += "<a href='/case/luxury' class='wearon-item wearon closed' id='" + entity.boxId + "'>";
				_html += "	<div class='price'>";
				_html += "	  <svg viewBox='-2 -2 90 78' class='pricebox'>";
				_html += "		<polygon points='0,37 22,0 64,0 86,37 64,74 22,74'></polygon>";
				_html += "	  </svg>";
				_html += "	  <span><i class='fa fa-rmb'></i> " + entity.boxPrice + "</span>";
				_html += "	</div>";
				_html += "	<svg viewBox='0 0 146 127' class='sotabox'>";
				_html += "	  <polygon points='0,63 37,0 109,0 146,63 109,127 37,127'></polygon>";
				_html += "  </svg>";
				_html += "  <div class='img'>";
				_html += "    <img src='" + serverAddress.apiUrl + entity.boxPicture + "'>";
				_html += "  </div>";
				_html += "  <div class='name'>";
				_html += "    <span>" + entity.boxName + "</span>";
				_html += "  </div>";
				_html += "  <div class='sprite absent'></div>";
				_html += "  <div class='sprite icon-closed'></div>";
				_html += "  </a>";
			}
			$("#boxdiv").html(_html);
		}
	});
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

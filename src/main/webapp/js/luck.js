var _i = 1;
var _time = 100;
var index;
var isStop = true;
$().ready(function () {

    //获取全部奖品
    getContent();
    
    $("#open-luck-button").on("click", startDraw);

    $("#luck-win-tack").click(function () {
    	closedWindow();
    });
});

//获取全部奖品
function getContent() {
	$.gdAjax({
		url:"luck/list",
		type: "POST",
		success:function(data) {
			initHtmlData(data);
		}
	});
}

//加载内容
function initHtmlData(data) {
	
	if (data.result == null) {
		return;
	}
	// 抽奖内容随机打乱
	var randomArray = getRandom({'arry':data.result, 'range':data.result.length});
	
	var randomNum = (1 + Math.round(3 * Math.random()));
	// 抽奖内容
	for(var i in randomArray) {
		var info = randomArray[i];
		$("#cell" + i).attr("data-id", info.luckId);
		$("#cell" + i).attr("data-type", type);
		var type = info.luckType;
		if (type == "0") {
			$("#cell" + i + (">.name")).html("谢谢参与");
			$("#cell" + i).attr("data-text", "谢谢参与");
		}
		else if (type == "1") {
			$("#cell" + i + (">.luckMoney")).html(info.luckMoney);
			$("#cell" + i + (">.item_img")).attr("src", "images/other/bonus01.png");
			$("#cell" + i + (">.price")).html("$ " + info.luckMoney);
			$("#cell" + i + (">.price")).css("margin-top", "12px");
			$("#cell" + i).attr("data-text", "$ " + info.luckMoney);
		}
		else if (type == "2") {
			$("#cell" + i + (">.name")).html(info.goodsName);
			$("#cell" + i + (">.price")).html("$ " + info.goodsPrice);
			$("#cell" + i + (">.item_img")).attr("src", serverAddress.file + info.goodsPicture);
			$("#cell" + i).attr("data-text", info.goodsName);
		}
		
	    $("#cell" + i + (">.type_img")).attr("src", "images/items/types/inner_00" + randomNum + ".png");
	}
	
}

//开始抽奖
function startDraw() {
	$.gdAjax({
		url:"luck/go",
		type: "POST",
		success:function(data) {
			$("#_money3").text((Number($("#_money3").attr("data-money")) - 50).toString());
			startRun(data);
		}
	});
}

function startRun(data) {
	
	if (!isStop) {
		return;
	}
	
	_i = 1;
	_time = 100;
	index = 0;
	isStop = false;
	
    $(".luckContent-start").off("click");
    var luckId = data.result.luckId;
    $(".my_credit_block .item").each(function() {
    	if ($(this).attr("data-id") == luckId) {
    		index = Number($(this).attr("id").replace("cell", ""));
    	}
    })
    
    setTimeout('nextStep()', _time);
}

function nextStep() {
    $(".type_img").removeClass("draw-active");
    $("#cell" + _i % 14 + " .type_img").addClass("draw-active");
    if (_i > 30 & _i % 14 == index) {
        setTimeout(function () {
        	isStop = true;
            $(".body-container").addClass("showBlur");
            $(".modal-div").addClass("showDialog");
            if ($("#cell" + _i % 14 + ">div").text() == "谢谢参与") {
                //$(".modal-div > div > div:first-child").text("谢谢参与");
            } else {
            	$("#luck-win .win_item_item").attr("src", $("#cell" + _i % 14 + " .item_img").attr("src"));
            	$("#luck-win .win_item_name").text($("#cell" + _i % 14).attr("data-text"));
            	$("#luck-win .win_item_price").text($("#cell" + _i % 14 + " .price").text());
            	
            	$(".wnd").css("display", "none");
            	$(".wnd_bg").css("display", "none");
            	$(".winning_wnd").css("display", "block");
            	$(".wnd_bg").css("display", "block");
            	$(".page").css("filter", "blur(5px)");
                //$(".modal-div > div > div:first-child").text("恭喜您，获得了" + $("#cell" + _i % 14).attr("data-text"));
            }
            // 更新积分
            _check();
        }, 600);
    } else {
        _i++;
        // 到最后速度慢下来
        if (_i > 28) {
        	_time = _time + _i;
        }
        setTimeout('nextStep()', _time);
    }
}

/**
 * 得到array中随机
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

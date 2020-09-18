var pageIndex = 0;
var goodsArray;
var exchangeId = 0;
var exchangeGoodsPrice = 0;
/**
 * 初始化
 */
$().ready(function (){
	initGoodsTypeList();
	
	$("#exchange-no").click(function () {
		$("#exchange-confirm .win_item_type").attr("src", "");
		$("#exchange-confirm .win_item_item").attr("src", "");
		$("#exchange-confirm .win_item_name").text("");
		$("#exchange-confirm .win_item_price").text("");
		$("#exchange-confirm .win_item_credit").text("");
		closedWindow();
	});
	$("#exchange-yes").click(function () {
		if (exchangeId == 0) {
			return;
		}
		var data = new Object();
		var ids = new Array();
		ids.push(exchangeId);
		data.ids = ids;
		data.param = new Object();
		$.gdAjax({
			url : "usercenter/exchangegoods",
			type: "POST",
			data : data,
			success : function(data) {
				$.alertSuccess("兑换成功，等待发货！");
				$("#exchange-confirm .win_item_type").attr("src", "");
				$("#exchange-confirm .win_item_item").attr("src", "");
				$("#exchange-confirm .win_item_name").text("");
				$("#exchange-confirm .win_item_price").text("");
				$("#exchange-confirm .win_item_credit").text("");
				closedWindow();
				var currentmoney2 = parseFloat($("#_money2").attr("data-money"));
				var money2 = currentmoney2 - exchangeGoodsPrice;
				$("#_money2").text("$ " + money2.toString().formatMoney(2));
				// 刷新
				initBoxDetail();
			}
		});
	});
	
	// 商品名称搜索
	$("#icon-search").click(function () {
		pageIndex = 0;
		initBoxDetail();
	})
	
	/**
	 * 回车事件
	 */
	document.onkeydown = function(e) {
		var ev = document.all?window.event:e;
		if(ev.keyCode == 13) {
			pageIndex = 0;
			initBoxDetail();
		}
	}
}); 

/**
 * 加载分类
 */
function initGoodsTypeList() {
	$.gdAjax({
		url : "exchange/boxlist",
		type : "GET",
		success : function(data) {
			var _html = "";
			for (var index in data.result) {
				var entity = data.result[index];
				_html += "<option value='" + entity.boxId + "' onclick=\"goodTypeClick(this)\">" + entity.boxName + "</option>";
			}
			$("#goodsType").html(_html);
			$("#goodsType>option").first().attr("selected", true);
			initBoxDetail();
		}
	});
}

/**
 * 加载商品
 */
function initBoxDetail() {
	var boxId = $("#goodsType").val();
	var data = new Object();
	var obj = new Object();
	var goodsName = $.trim($("#text_goodsName").val());
	obj.boxId = $.trim(boxId);
	obj.goodsName = goodsName;
	obj.order = $("#goodsOrder").val();
	data.pageIndex = pageIndex;
	data.param = obj;
	
	$.gdAjax({
		url : "exchange/list",
		type : "POST",
		data : data,
		success : function(data) {
			
			goodsArray = data.result;
			if (goodsArray == null || goodsArray.length == 0) {
				$("#exchangediv").html("");
				$("#pagination>ul").html("");
				return;
			}
			
			$("#exchangediv").empty();
			$("#exchange_list_scrpit").tmpl(goodsArray).appendTo("#exchangediv");
			
			$("#exchangediv .item").click(function () {
				exchange($("#exchangediv .item").index($(this)));
			});
			
			//分页设置
			doPagination(data);
		}
	});
}

/**
 * 兑换
 * @param goods
 */
function exchange(i) {
	$(".exchange-dialog").remove();
	var goods = goodsArray[i];
	exchangeId = goods.exchangeId;
	exchangeGoodsPrice = goods.goodsPrice;
	
	$("#exchange-confirm .win_item_type").attr("src", "images/items/types/inner_" + goods.goodsLevel + ".png");
	$("#exchange-confirm .win_item_item").attr("src", serverAddress.apiUrl + goods.goodsPicture);
	$("#exchange-confirm .win_item_name").text(goods.goodsName);
	$("#exchange-confirm .win_item_price").text(goods.goodsPrice + " 碎片");
	if (goods.field02 == "0") {
		$("#exchange-confirm .win_item_credit").text("此件已无库存，如果继续兑换，将等待8天！");
	}
	
	$(".wnd").css("display", "none");
	$(".wnd_bg").css("display", "none");
	$(".winning_wnd").css("display", "block");
	$(".wnd_bg").css("display", "block");
	$(".page").css("filter", "blur(5px)");
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
			initBoxDetail();
		}													
	}			
	$("#pagination ul").bootstrapPaginator(options);													
}	

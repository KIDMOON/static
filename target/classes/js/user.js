var pageIndex = 0;
/**
 * 初始化
 */
$().ready(function (){
	var params = $.getArgs();
	getUserInfo();
	// 加载数据
	getContentList("000");
	// 切换数据列
	$("#showActiveDrops, #showDropsHistory, #showOnRolad").click(function () {
		pageIndex = 0;
		$("#drops-mode-btns a").removeClass("active");
		$(this).addClass("active");
		getContentList();
	});
	// 充值记录
	$("#moneyRecord").click(function () {
		pageIndex = 0;
		$("#drops-mode-btns a").removeClass("active");
		$(this).addClass("active");
		moneyRecrodList();
	});
	// 出售所选
	$("#multipleSell1").click(function () {
		if ($("#mypackagediv .selected").length <= 0) {
			$.alertInfo("请选择需要出售的装备！");
			return;
		}
		var ids = new Array();
		$("#mypackagediv .selected").each(function () {
			ids.push($(this).attr("data-id"));
		});
		sellByIds(ids);
	});
	
	// 取回
	$("#wantPick").click(function () {
		if ($("#mypackagediv .selected").length <= 0) {
			$.alertInfo("请选择需要取回的一件装备！");
			return;
		}
		if ($("#mypackagediv .selected").length > 1) {
			$.alertInfo("一次只能取回一件装备！");
			return;
		}
		var id = $("#mypackagediv .selected").attr("data-id");
		wantById(id);
	});
	
	getUserPartnerStat();

	// 复制
	$("#partner_url").click(function(){
		$("#partner_url").attr("data-clipboard-text", $("#partner_url").text());
		var clipboard = new ClipboardJS("#partner_url");
		clipboard.on('success', function(e) {
			$.alertSuccess("复制成功");
		});
		clipboard.on('error', function(e) {
			$.alertError("复制失败");
		});
	});

	$('form').submit(function () {
		return false;
	});
}); 

/**
 * 查询用户统计信息
 */
function getUserPartnerStat() {
	$.gdAjax({
		url : "usercenter/partnerstat",
		type : "GET",
		success : function(data) {
			var partnerStat = data.result;
			$("#partnerstat_count").text(partnerStat.partnerCount);
			//$("#partnerstat_sum").text("获得回扣：$ " + partnerStat.partnerMoney);
		}
	});
}

/**
 * 查询用户数据
 */
function getUserInfo() {
	$.gdAjax({
		url : "usercenter/userdetail",
		type : "GET",
		success : function(data) {
			var user = data.result;
			$("#user_avter").attr("src", user.avatar);
			$("#user_nickName").text(user.nickName);
			if (!$.isBlank(user.field01)) {
				$("#trade_url").val(user.field01);
			}
			if (!$.isBlank(user.contact) && $("#contact_txt")) {
				$("#contact_txt").val(user.contact);
			}
			//$("#partner_code").val(user.partnerCode);
			$("#partner_url").text(serverAddress.pageUrl + "index.html?promo=" + user.partnerCode);
			var _money1 = $.toCoin(user.userMoney.moneyFirstLeft.toString());
			$("#userFirstMoney").text(_money1);
			var _money3 = user.userMoney.moneyThirdLeft.toString() + " 点";
			$("#userThirdMoney").text(_money3);
			$("#_money1").text(_money1);
			$("#_money1").attr("data-money", user.userMoney.moneyFirstLeft);
		}
	});
}

/**
 * 保存交易地址
 */
function saveTradeUrl() {
	if ($.isBlank($("#trade_url").val())) {
		$.alertError("请输入交易地址！");
		return;
	}
	if ($("#trade_url").val().indexOf("steamcommunity.com/tradeoffer/new/?partner=") == -1) {
		$.alertError("请输入正确的交易报价链接！");
		return;
	}
	var data = new Object();
	var obj = new Object();
	obj.field01 = $("#trade_url").val();
	data.param = obj;
	$.gdAjax({
		url : "usercenter/saveTradeUrl",
		data : data,
		type : "POST",
		success : function(data) {
			$.alertSuccess("保存成功！");
		}
	});
}

/**
 * 保存联系方式
 */
function saveContact() {
	if ($.isBlank($("#contact_txt").val())) {
		$.alertError("请输入联系方式！");
		return;
	}
	var data = new Object();
	var obj = new Object();
	obj.contact = $("#contact_txt").val();
	data.param = obj;
	$.gdAjax({
		url : "usercenter/saveContact",
		data : data,
		type : "POST",
		success : function(data) {
			$.alertSuccess("保存成功！");
		}
	});
}

/**
 * 查询数据
 */
function getContentList() {
	var status = $("#drops-mode-btns .active").attr("data-status");
	var data = new Object();
	var obj = new Object();
	obj.field01 = status;
	data.pageIndex = pageIndex;
	data.param = obj;
	$.gdAjax({
		url : "usercenter/list",
		data : data,
		type : "POST",
		success : function(data) {
			
			var _html = "";
			for ( var index in data.result) {
				var e = data.result[index];
				_html += "<div class='item' data-id='" + e.userGoodsId + "' data-price='" + e.goodsPrice + "' data-code='" + e.field01 + "'>";
				// 显示免费tag
				if (e.userGoodsType === "5") {
					_html += "	<div class='drop-free-info'>免费</div>";
				}
				if (e.userGoodsType === "8") {
					_html += "	<img class='item_img' src='images/other/bonus03.png'>";
					_html += "	<div class='name'>奖金</div>";
				} else {
					_html += "	<img class='type_img' src='images/items/types/inner_" + e.goodsLevel + ".png' alt=''>";
					_html += "	<img class='item_img' src='" + serverAddress.file + e.goodsPicture + "'>";
					_html += "	<div class='name'>" + e.goodsName + "</div>";
				}
				_html += "	<div class='price'>";
				if (status == "" || status == "001006") {
					if (e.field01 == "000") {
						if (e.field03 == "2") {
							_html += "机器人发货失败(可能未打开隐私)";
						} else {
							_html += "在背包";
						}
					} else if (e.field01 == "001" || e.field01 == "006") {
						if (e.field03 == "0") {
							_html += "机器人发货中(排队执行中)";
						} else if (e.field03 == "11") {
							_html += "机器人发货中(提交报价中)";
						} else if (e.field03 == "12") {
							_html += "机器人发货中(报价发起成功)";
						} else if (e.field03 == "13") {
							_html += "机器人发货中(等待客户接收报价)";
						} else {
							_html += "取回中";
						}
					} else if (e.field01 == "002") {
						_html += "已发货";
					} else if (e.field01 == "003") {
						_html += "已兑换 K币";
					}
				} else {
					if (e.field03 == "2") {
						_html += "机器人发货失败(可能未打开隐私)";
					} else {
						_html += $.toCoin(e.goodsPrice);
					}
				}
				_html += "	</div>";

				_html += "</div>";
			}

			$("#mypackagediv").html(_html);

			//分页设置
			doPagination(data);
			// 绑定事件
			if (status != "" && status != "001") {
				$("#mypackagediv .item").click(function () {
					$(this).toggleClass("selected");
					// 计算所选合计价格和数量
					var checkedCount = 0;
					var checkedPrice = 0;
					$("#mypackagediv .selected").each(function () {
						checkedCount++;
						checkedPrice += parseFloat($(this).attr("data-price"));
					});
					$("#countSelected").text(checkedCount);
					$("#itemsSelectedPrice").text(checkedPrice.toString().formatMoney(2));
				});
				getUserGoodsPrice();
			}
		}
	});
}

/**
 * 充值记录
 */
function moneyRecrodList() {
	var data = new Object();
	var obj = new Object();
	data.pageIndex = pageIndex;
	data.param = obj;
	$.gdAjax({
		url : "usercenter/moneyList",
		data : data,
		type : "POST",
		success : function(data) {
			var _html = "<div class='mitem'>";
			_html += "		<div class='mitem1'>充值</div>";
			_html += "		<div class='mitem2'>充值方式</div>";
			_html += "		<div class='mitem3'>充值时间</div>";
			_html += "	</div>";
			
			for ( var index in data.result) {
				var e = data.result[index];
				var recordMoney = "$ " + e.amount.toString().formatMoney(2);
				var desc = "";
				if (e.type == "1") {
					desc = "充值";
				} else if (e.type == "2") {
					desc = "充值赠送";
				} else if (e.type == "3") {
					desc = "推广赠送";
				}
				var rechargeType = "";
				if (e.field01 == '1') {
					rechargeType = "支付宝";
				} else if (e.field01 == '2') {
					rechargeType = "微信";
				} else if (e.field01 == '3') {
					rechargeType = "人工";
				} else if (e.field01 == '4') {
					rechargeType = "充值卡";
				}
				_html += "<div class='mitem'>";
				_html += "	<div class='mitem1'>" + rechargeType + desc + recordMoney + "</div>";
				_html += "	<div class='mitem2'>";

				_html += "		<img src='images/custom/" + e.field01 + ".png'>";
				_html += "		<span>" + rechargeType + "支付</span>";

				_html += "	</div>"
				_html += "	<div class='mitem3'>" + ($.isBlank(e.createDate)?"":new Date(e.createDate).Format("YYYY-MM-DD HH:mm:SS")) + "</div>";
				_html += "</div>";
			}
			$("#mypackagediv").html(_html);
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
			
			var activeId = $("#drops-mode-btns .active").attr("id");
			if (activeId != "moneyRecord") {
				getContentList();
			} else {
				moneyRecrodList();
			}
		}													
	}			
	$("#pagination ul").bootstrapPaginator(options);													
}	

/**
 * 获取可出售的商品的所有价格合
 */
function getUserGoodsPrice() {
	$.gdAjax({
		url : "usercenter/userGoodsPrice",
		type : "GET",
		success : function(data) {
			if (!$.isBlank(data.result)) {
				var sumPrice = data.result.toString();
				$("#allitemsPrice").text("" + sumPrice.formatMoney(2) + "");
			}
		}
	});
}

/**
 * 出售商品
 */
function sellById(id) {
	var ids = new Array();
	ids.push(id);
	sellByIds(ids);
}

/**
 * 出售商品
 */
function sellByIds(ids) {
	if ($("#multipleSell1").attr("data-status") == "1") {
		return;
	}
	var _text = $("#multipleSell1").text();
	$("#multipleSell1").attr("data-status", "1");
	$("#multipleSell1").text("出售中...");
	var data = new Object();
	data.ids = ids;
	data.param = new Object();
	$.gdAjax({
		url : "usercenter/sellgoods",
		type: "POST",
		data : data,
		success : function(data) {
			$.alertSuccess("出售成功！");
			$("#countSelected, #itemsSelectedPrice").text("0");
			getUserInfo();
			getContentList();
		},
		done : function(data) {
			$("#multipleSell1").attr("data-status", "0");
			$("#multipleSell1").text(_text);
		}
	});
}

/**
 * 取回商品
 */
function wantById(id) {

	var _text = $("#wantPick").text();
	$("#wantPick").attr("data-status", "1");
	$("#wantPick").text("取回中...");

	var data = new Object();
	var ids = new Array();
	ids.push(id);
	data.ids = ids;
	data.param = new Object();
	$.gdAjax({
		url : "usercenter/wantgoods",
		type: "POST",
		data : data,
		success : function(data) {
			$.alertSuccess(data.message);
			$("#countSelected").text("0");
			$("#itemsSelectedPrice").text("$ 0");
			getContentList();
		},
		done : function(data) {
			$("#wantPick").attr("data-status", "0");
			$("#wantPick").text(_text);
			getUserGoodsPrice();
		}
	});
}

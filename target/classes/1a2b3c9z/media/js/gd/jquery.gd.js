/**
 * js replaceAll
 * @param s1
 * @param s2
 * @returns
 */
String.prototype.replaceAll = function(s1,s2) { 
	return this.replace(new RegExp(s1,"gm"),s2);
}
//--------------------------------------------------- 
// 日期格式化 
// 格式 YYYY/yyyy/YY/yy 表示年份 
// MM/M 月份 
// W/w 星期 
// dd/DD/d/D 日期 
// hh/HH/h/H 时间 
// mm/m 分钟 
// ss/SS/s/S 秒 
//--------------------------------------------------- 
Date.prototype.Format = function(formatStr) { 
	var str = formatStr; 
	var Week = ['日','一','二','三','四','五','六']; 
	
	str=str.replace(/yyyy|YYYY/,this.getFullYear()); 
	str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));
	 
	var _month = this.getMonth() + 1;
	str=str.replace(/MM/,_month>9?_month.toString():'0' + _month);
	str=str.replace(/M/g,_month); 
	
	str=str.replace(/w|W/g,Week[this.getDay()]); 
	
	str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
	str=str.replace(/d|D/g,this.getDate()); 
	
	str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
	str=str.replace(/h|H/g,this.getHours()); 
	str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
	str=str.replace(/m/g,this.getMinutes()); 
	
	str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
	str=str.replace(/s|S/g,this.getSeconds()); 
	
	return str; 
} 

String.prototype.format = function() {
	var date= new Date(Date.parse(this.replace(/-/g,   "/")));
	return date;
}
String.prototype.startWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substr(0,str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
}  
String.prototype.endWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substring(this.length-str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
}

/**
 * 格式化金钱
 * 12345格式化为12,345.00 
 * @param n 保留小数点位数
 * @returns {String}
 */
String.prototype.formatMoney = function(n) { 
	n = n > 0 && n <= 20 ? n : 2;
	var s = parseFloat((this + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
	var l = s.split(".")[0].split("").reverse(),
	r = s.split(".")[1];
	t = "";
	for(i = 0; i < l.length; i ++ )
	{
		t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
	}
	return t.split("").reverse().join("") + "." + r;
}


jQuery.fn.extend({
	// 分页生成V2
	initTable: function (data) {
		// table内容
		var _htmlContent = "";
		if (data.htmlContent != undefined) {
			_htmlContent = data.htmlContent;
		}
		// Td count
		var _tdCount = $(this).find("thead>tr>th").length;
		// 赋值html
		$(this).find("tbody").html(_htmlContent);
		// 生成分页
		if (data.pager!= null && data.pager.recordSize != null) {
			var _pageContent = "" +
					"<tr class='trPagerStyle'><td align='left' colspan='" + _tdCount + "'>" +
						"<table cellspacing='0' cellpadding='0' border='0' style='width: 100%;'>";
			if (data.pager.recordSize == 0) {
				_pageContent += "" +
						"<tr class='trPagerStyle'>" +
							"<td align='left'>没有查询到任何记录！</td>" +
						"</tr>";
			} else {
				_pageContent += "" +
						"<tr class='trPagerStyle'>" +
							"<td align='left'><div style='float:left;'>共&nbsp;" + data.pager.recordSize + "&nbsp;条记录,&nbsp;每页&nbsp;" + 
								data.pager.pageSize + "&nbsp;条,&nbsp;转到</div>" +
								"<div style='height: 27px; line-height: 27px; float: left;'>" +
								"<select class='form-control input-sm' style='height: 27px; line-height: 27px; width: 50px; margin-top: -3px;' " +
									"onchange='page_go(this.value - 1)'>";
				var pageCount = parseInt((data.pager.recordSize + data.pager.pageSize - 1) / data.pager.pageSize);
				for(var z=1; z<=pageCount; z++) {
					if (data.pager.pageIndex == z-1) {
						_pageContent += "<option value='" + z + "' selected='selected'>" + z + "/" + pageCount + "</option>";
					} else {
						_pageContent += "<option value='" + z + "'>" + z + "/" + pageCount + "</option>";
					}
				}
				_pageContent += "" +
								"</select></div>" +
				        	 "页</td>" +
				        	 "<td align='right'>";
				if (data.pager.pageIndex != 0) {
					_pageContent += "<a href='javascript:page_go(0);'>首 页</a>&nbsp;|&nbsp;<a href='javascript:page_go(" + 
						(data.pager.pageIndex - 1) + ");'>上一页</a>";
				} else {
					_pageContent += "首 页&nbsp;|&nbsp;上一页";
				}
				if (data.pager.pageIndex == pageCount-1) {
					_pageContent += "&nbsp;|&nbsp;下一页&nbsp;|&nbsp;末 页";
				} else {
					_pageContent += "&nbsp;|&nbsp;<a href='javascript:page_go(" + (data.pager.pageIndex + 1) + ");'>下一页</a>&nbsp;|&nbsp;"
					_pageContent += "<a href='javascript:page_go(" + Math.floor((data.pager.recordSize - 1) / data.pager.pageSize) + ");'>末 页</a>";
				}
				_pageContent += "</td>" +
						"</tr>" +
						"</table>" + 
					"</td></tr>";
			}
			$(this).find("tfoot").html(_pageContent);
		}
	},
	// checkbox全选
	checkAll: function (isCheck) {
		if(isCheck) {
			$(this).each(function(){
				$(this).prop("checked",true);
		    });
		}
		else {
			$(this).each(function(){
				$(this).prop("checked",false);
		    });
		}
	},
	// 得到画面中隐藏字段的值
	getAllHiddenAttrToUrl: function () {
		var url = "";
		$(this).each(function () {
			url += "&" + $(this).attr("name") + "=" + $(this).val();
		});
		return url;
	}
});

jQuery.extend({
	/**
	 * 得到当前屏幕宽度、长度信息
	 * @returns 当前屏幕宽度、长度信息
	 */
	getPageSize: function () {
	    var cWidth,cHeight,sWidth,sHeight,sLeft,sTop;
	    var pageSize = new Array();
		if (document.compatMode == "BackCompat") {
		   cWidth = document.body.clientWidth;
		   cHeight = document.body.clientHeight;
		   sWidth = document.body.scrollWidth;
		   sHeight = document.body.scrollHeight;
		   sLeft = document.body.scrollLeft;
		   sTop = document.body.scrollTop;
		}else { //document.compatMode == "CSS1Compat"
		   cWidth = document.documentElement.clientWidth;
		   cHeight = document.documentElement.clientHeight;
		   sWidth = document.documentElement.scrollWidth;
		   sHeight = document.documentElement.scrollHeight;
		   sLeft = document.documentElement.scrollLeft == 0 ? document.body.scrollLeft : document.documentElement.scrollLeft;
		   sTop = document.documentElement.scrollTop == 0 ? document.body.scrollTop : document.documentElement.scrollTop;
		}
		pageSize[0]=cWidth;
		pageSize[1]=cHeight;
		pageSize[2]=sWidth;
		pageSize[3]=sHeight;
		pageSize[4]=sLeft;
		pageSize[5]=sTop;
	    return pageSize;
	},
	/**
	 * 得到URL参数
	 */
	getArgs: function() { 
	    var args = {};
        var query = location.search.substring(1);
        // Get query string
	    var pairs = query.split("&"); 
	    // Break at ampersand
	    for(var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            // Look for "name=value"
            if (pos == -1) continue;
            // If not found, skip
            var argname = pairs[i].substring(0,pos);// Extract the name
            var value = pairs[i].substring(pos+1);// Extract the value
            value = decodeURIComponent(value);// Decode it, if needed
            args[argname] = value;
            // Store as a property
        }
	    return args;// Return the object 
	},
	/**
	 * 是否是空
	 */
	isBlank: function(val) {
		if (val == null || typeof val == "undefined" || val == "" || $.trim(val) == "") {
			return true;
		}
		return false;
	},
	/**
	 * 转换
	 */
	convertNullToEmpty: function(val) {
		if ($.isBlank(val)) {
			return "";
		}
		return $.trim(val);
	},
	/**
	 * 格式化金额
	 */
	formatMoney: function(object, precision) {
		var money = "0";
		if (object != null && object !="undefined") {
			money = object.toString();
		}
		return money.formatMoney(precision);
	},
	/**
	 * 格式化%率
	 * 2格式化为2.00
	 * @param object 数值, precision 保留小数点位数
	 */
	formatPercent: function(object, precision) {
		var percent = "0";
		if (object != null && object !="undefined") {
			percent = object.toString();
		}
		return parseFloat(percent).toFixed(precision) + "";
	},
	/**
	 * loading转圈
	 */
	showLoading: function() {
		var loadingHtml = "<div class='loading'>" +
			"<div class='loading-center'>" +
			"<div class='loading-center-absolute'>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"<div class='object'></div>" +
			"</div>" +
			"</div>" +
			"</div>";
		$("body").append(loadingHtml);
	},
	hideLoading: function() {
		$(".loading").remove();
	},
	/**
	 * 异步请求
	 */
	gdAjax: function(param) {
		var serverUrl = serverAddress.apiUrl;
		if (param.loading != false) {
			$.showLoading();
		}
		if (param.type == null) {
			param.type = "GET";
		}
		
		// encrypt
		var tempName = serverUrl.endWith("/") ? serverUrl.substring(0, serverUrl.length - 1) : serverUrl;
		var tempNames = tempName.split("/");
		var projectName = tempNames[tempNames.length - 1];
        var _token = sessionStorage.getItem("r_token");
        _token = $.isBlank(_token) ? "" : _token;
        param.url += param.url.indexOf("?") == -1 ? ("?token=" + _token) : ("&token=" + _token);
        param.url += "&key=com.my.admin";
		param.url += "&timestamp=" + new Date().getTime();
		// 请求相对路径
		var requestURI = param.url.split("?")[0];
		requestURI = param.url.startWith("/") ? requestURI : "/" + requestURI;
		requestURI = param.url.endWith("/") ? requestURI.substring(0, requestURI.length - 1) : requestURI;
		// 请求参数
		var args = new Array();
        var query = param.url.split("?")[1];
	    var pairs = query.split("&"); 
	    for(var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);
            value = decodeURIComponent(value);
            var arg = new Object();
            arg.key = argname;
            arg.value = value;
            args.push(arg);
        }
	    args = args.sort(function (a, b) {
	    	return a.key> b.key?1:-1;
	    });
	    var paramstring = "";
	    for (var index in args) {
	    	paramstring += args[index].key + args[index].value;
		}
        // 非get方法的body添加
        var _body = ""
        if("GET" != param.type && param.data) {
            _body = JSON.stringify(param.data)
        }
	    var _secret = serverAddress.secret;
	    var sign = hex_hmac_md5(_secret, "/" + projectName + requestURI + paramstring + _body);
		
		$.ajax({  
	        data:JSON.stringify(param.data),
	        type:param.type, 
	        dataType:"json",  
	        contentType: "application/json",
	        url:serverUrl + param.url + "&sign=" + sign,
	        success:function(data){  
	        	if (data.code == 200) {
	        		param.success(data);
	        	}
	        	else {
					if (data.code == 150) {
						$.alertInfo("登录超时，请重新登录");
						window.location.href = "../1a2b3c9z/login.html";
					}
	        		var _message = data.message;
	        		if (!$.isBlank(data.message)) {
	        			$.alertInfo(_message);
	        		}
	        		if (param.faild) {
	        			param.faild(data);
	        		}
	        	}
	        	
	        	if (param.loading != false) {
	        		$.hideLoading();
        		}
	        } 
		});
	},
	/**
	 * result.loadingImageId定义loading图片
	 * 上传图片 result.success(returnVal) result.faild(returnVal)
	 */
	uploadImage: function (result) {
		$(".upload_div_content").remove();
		var _num = Math.floor(Math.random()*1000+1);
		var _html = "<div class='upload_div_content'>" +
						"<input id='uploaderimage_file_" + _num + "' type='file' accept='image/jpg,image/jpeg,image/png' name='upfile'></input>" +
					"</div>";
		$("body").append(_html);

		$("#uploaderimage_file_" + _num).change(function () {
			if (result.loadingImageId) {
				$("#" + result.loadingImageId).attr("src", "../media/images/loading.gif");
			}

			var _formData = new FormData();
			// 获取第文件的内容
			_formData.append("file", $('#uploaderimage_file_' + _num).get(0).files[0]);

			$.ajax({
				url: serverAddress.file + 'frame/fileupload',
				processData: false,  // 这个必须为false，不转换的信息
				contentType: false, // 这个必须为false，不指定发送信息的编码类型
				data: _formData,
				type: "POST",
				success: function (data) {
					if (data.code == 200) {
						// 将返回的图片路径处理为http绝对路径
						result.success(serverAddress.file + "frame/files/" + data.result);
					}
					else {
						$.alertError("上传图片失败！");
						if (result.faild) {
							result.faild(serverAddress.file + "frame/files/" + data.result);
						}
					}
				}
			});
		});
		$("#uploaderimage_file_" + _num).click();
	},
	/**
	 * 图片预加载
	 * option.images 图片数组
	 * option.done() 执行结束后回调
	 */
	preloadimages: function(option){
		var newimages=[];
	    var images = option.images;
	    for (var i = 0; i < images.length; i++){
	        newimages[i] = new Image();
	        newimages[i].src = images[i];
	    }
	    if (option.done) {
			option.done(newimages);
		}
	}
});

jQuery.extend({
	/**
	 * 根据code查询服务器地址
	 */
	getServerUrlByCode: function(serverCode, returnvalfun) {
		var _url = "";
		if(window.localStorage) {
			var _serverData = localStorage.easyServerAddressList;
			if (_serverData != undefined) {
				var serverList = JSON.parse(_serverData);
				for (var i in serverList) {
					if (serverList[i].servercode == serverCode) {
						_url = serverList[i].serveraddress;
					}
				}
			}
		}
		if (_url == "") {
			$.gdAjax({
				url:"../../../serveraddress/findAllList",
				success:function(data) {
					// 写入服务器地址一览
		    		if(window.localStorage){
		    			localStorage.easyServerAddressList = JSON.stringify(data.list);
		    		}
		    		for (var i in data.list) {
						if (data.list[i].servercode == serverCode) {
							_url = data.list[i].serveraddress;
						}
					}
		    		returnvalfun(_url);
				}
			});
		}
		else {
			returnvalfun(_url);
		}
	}
})

jQuery.fn.extend({
	/**
	 * 请求codelist
	 * param -> param.codeid, param.firstOption.name, param.firstOption.value, param.selectValue, param.success
	 */
	getTypeDecodeList: function(param) {
		var _data = new Object();
		_data.codeid = param.codeid;
		var _codeElem = $(this);
		$.getServerUrlByCode(webConfig.serverCode.CBEC_LIVE_WEB, function (_url) {
			$.gdAjax({
				data:_data,
				url:_url + "code/findCodeById",
				success:function(data) {
					// 给select添加option
					var _htmlStateContent = "";
					// 第一个option定义
					if (param.firstOption !== false) {
						var _firstOptionName = param.firstOption == undefined ? '全部' : param.firstOption.name;
						var _firstOptionValue = param.firstOption == undefined ? '' : param.firstOption.value;
						_htmlStateContent += "<option value='" + _firstOptionValue + "'>" + _firstOptionName + "</option>";
					}
					for(var i in data.list)	{
						_htmlStateContent += "<option value='" + data.list[i].decodeId + "'>" + data.list[i].decodeValue + "</option>";	
					}
					$(_codeElem).html(_htmlStateContent);
					
					// 初始化赋值
		        	if($.isBlank(param.selectValue)){
		        		$(_codeElem).find("option").first().attr("selected", "selected");
		        	}else{
		        		$(_codeElem).find("option[value='" + param.selectValue + "']").attr("selected", "selected");
		        	}
		        	
		        	// 回调
		        	param.success(data);
				}
			});
		});
	}
});
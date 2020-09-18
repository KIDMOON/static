$("#top_nav").load(serverAddress.pageUrl + "1a2b3c9z/top.html", function () {
	// 加载数据
	$.ajax({  
        data:{}, 
        type:"POST",  
        dataType:"json",  
        url:serverAddress.apiUrl + "main/module",  
        contentType:"application/json;charset=UTF-8",
        success:function(data){  
        	var moduleList = data.moduleList;
        	var menuHtml = "";
        	for (var i in moduleList) {
        		menuHtml += "<li data-id=\"" + moduleList[i].moduleCode 
        			+ "\"><a href=\"" + serverAddress.pageUrl + "1a2b3c9z/main.html?code=" 
        			+ moduleList[i].moduleCode + "\">" + moduleList[i].moduleName + "</a></li>";
        	}
        	$("#navbar").html(menuHtml);
        	
        	// 默认赋值
        	var defaultNav = $("#navbar li").eq(0);
        	var params = $.getArgs();
        	var moduleCode = params["code"];
        	if ($.isBlank(moduleCode)) {
        		moduleCode = $.cookie('_sysCode'); 
        	}
        	$("#navbar li").each(function () {
        		if (moduleCode == $(this).attr("data-id")) {
        			defaultNav = $(this);
        		}
        	});
        	$(defaultNav).addClass("active");
        	
        	$("#navbar li").click(function () {
        		$.cookie('_sysCode', $(this).attr("data-id"), { expires: 7, path: '/' });
        	})
        	
        	//加载左侧菜单
        	$("#left_menu").load(serverAddress.pageUrl + "1a2b3c9z/left.html", function () {
        		// 加载数据
        		var data = new Object();
        		var moduleCode = $("#navbar li").eq(0).attr("data-id");
        		if ($("#navbar li.active").length > 0) {
        			moduleCode = $("#navbar li.active").attr("data-id");
        		}
        		data.moduleCode = moduleCode;
        		$.ajax({  
        	        data:JSON.stringify(data), 
        	        type:"POST",  
        	        dataType:"json",  
        	        url:serverAddress.apiUrl + "main/menu",  
        	        contentType:"application/json;charset=UTF-8",
        	        success:function(data){  
        	        	// 加载菜单list
        	        	var menuList = data.menuList;
        	        	var menuHtml = "";
        	        	for (var i in menuList) {
        	        		if (menuList[i].parentMenuId == null || menuList[i].parentMenuId == 0) {
        	        			menuHtml += "<li data-id=\"" + menuList[i].menuId + "\">";
        	        			menuHtml += "<a href=\"#\"><i class=\"fa fa-cog\"></i>" + menuList[i].menuName + "</a>";
        	        			menuHtml += "<ul class=\"submenu\">";
        		        		for (var j in menuList) {
        		        			if (menuList[j].parentMenuId == menuList[i].menuId) {
        		        				menuHtml += "<li data-id=\"" + menuList[j].menuId + "\"><a href=\"" 
        		        					+ serverAddress.pageUrl + menuList[j].redirectUrl 
        		        					+ "\">" + menuList[j].menuName + "</a></li>";
        		        			}
        		        		}
        		        		menuHtml += "</ul>";
        		        		menuHtml += "</li>";
        	        		}
        	        	}
        	        	$("#menu-list").html(menuHtml);
        	        	
        	        	$("#jquery-accordion-menu").jqueryAccordionMenu();
        	        	//顶部导航切换
        	        	$("#menu-list li").click(function(){
        	        		$("#menu-list li.active").removeClass("active")
        	        		$(this).addClass("active");
        	        	})
        	        	
        	        	// 默认赋值
        	        	var currentUrl = window.location.href;
        	        	var currentHtmlUrl = currentUrl.substring(0, currentUrl.lastIndexOf(".html"));
        	        	var chooseObj = null;
        	        	// 第一次循环，优先选择最后一个.html之前一样的
        	        	$(".submenu li").each(function () {
        	        		var menuUrl = $(this).find("a").attr("href");
        	        		var htmlUrl = menuUrl.substring(0, menuUrl.lastIndexOf(".html"));
        	        		var keyUrl = htmlUrl.substring(htmlUrl.lastIndexOf("/") + 1);
        	        		if (currentUrl.indexOf(keyUrl) != -1) {
        	        			chooseObj = this;
        	        		}
        	        	})
        	        	// 如果第一次循环未找到对象，则进行第二次循环，选择最后一个/之前一样的
        	        	if (chooseObj == null) {
	        	        	var currentRootUrl = currentUrl.substring(0, currentUrl.lastIndexOf("/"));
	        	        	$(".submenu li").each(function () {
	        	        		var menuUrl = $(this).find("a").attr("href");
	        	        		var rootUrl = menuUrl.substring(0, menuUrl.lastIndexOf("/"));
	        	        		if (currentRootUrl == rootUrl) {
	        	        			chooseObj = this;
	        	        		}
	        	        	})
        	        	}
        	        	// 附上默认值
        	        	if (chooseObj != null) {
        	        		$(chooseObj).addClass("active");
        	        		$(chooseObj).parents("li").addClass("active");
        	        		$(chooseObj).parents("li").find("a").eq(0).addClass("submenu-indicator-minus");
        	        		$(chooseObj).parent("ul").css("display", "block");
        	        	}
        	        	
        	        	// 如果未选中任何菜单，则默认展开第一个菜单
        	        	if (chooseObj == null) {
        	        		$("#menu-list>li").first().addClass("active");
        	        		$("#menu-list>li>a").first().addClass("submenu-indicator-minus");
    	        			$("#menu-list .submenu").first().css("display", "block");
        	        	}
        	        }  
        		}); 
        	});
        }
	}); 
});

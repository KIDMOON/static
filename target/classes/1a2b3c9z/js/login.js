/**
 * 初始化
 */
$().ready(function (){
	
	// 加载验证码
	changeVcode();

	/**
	 * 回车事件
	 */
	document.onkeydown = function(e) {
		var ev = document.all?window.event:e;
		if(ev.keyCode == 13) {
			document.getElementById("btn_login").click();
		}
	}
	
	$("#img_vcode").click(function () {
		changeVcode();
	})
	
	/**
	 * 登录
	 */
	$("#btn_login").click(function () {
		$(".errorBase").not("#lab_oper_message").remove();
		// 验证
		if ($.trim($("#txt_login_name").val()) == "") {
			$("#lab_oper_message").text("用户名不能为空！");
			return;
		}
		else if ($.trim($("#txt_login_password").val()) == "") {
			$("#lab_oper_message").text("密码不能为空！");
			return;
		} 
		else if ($.trim($("#txt_image_code").val()) == "") {
			$("#lab_oper_message").text("验证码不能为空！");
			return;
		} 
		
		$.ajax({
			url:serverAddress.apiUrl + "adminlogin/adminLogin",
			type: 'post',
			data:JSON.stringify({"userName":$.trim($("#txt_login_name").val()),
                "password":$.trim($("#txt_login_password").val()),
                "key":$.trim($("#hid_vcode_key").val()),
                "vcode":$.trim($("#txt_image_code").val())}),
            dataType: "json",
            contentType:"application/json;charset=UTF-8",
            success: function(map){
            	if(map.success==200){
            		var _params = $.getArgs();
            		var r_token = map.token;
					var r_userName = map.userName;
					sessionStorage.setItem("r_token", r_token);
					sessionStorage.setItem("r_userName", r_userName);
					var _redirectUrl = _params["redirectUrl"];
            		if(!$.isBlank(_redirectUrl)) {
						window.location.href = decodeURIComponent(_redirectUrl);
					}
					else {	
						window.location.href = serverAddress.pageUrl + map.url;  
					}
            	}else{
            		$("#lab_oper_message").text(map.message);	  
            	}
            },	
            error:function(map){
            }
		})
	})
	
	/**
	 * 重置
	 */
	$("#btn_reset").click(function () {
		$("#txt_login_name").val("");
		$("#txt_login_password").val("");
		$("#txt_image_code").val("");
	})
	
	$("#loginName").focus();
});

/**
 * 更新验证码
 * @param obj
 */
function changeVcode(obj){
	var key = new Date().getTime() + "" + Math.floor(Math.random()*10000);
	$("#hid_vcode_key").val(key);
	$("#img_vcode").attr("src", serverAddress.apiUrl + "adminlogin/vcode?key="+key);
}
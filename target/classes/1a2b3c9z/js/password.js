/**
 * 初始化
 */
$(function() {
	var params = $.getArgs();
	var id = params["id"];
	
	//绑定动作
	bindAction();

});

/**
 * 绑定动作
 */
function bindAction(){
	//next按钮
	$("#modifypw").on("click",modifyPassword);
}

/**
 * 验证原密码
 */
function modifyPassword(){
	if(checkPassword()){
		var originalPassword = $("#originalPassword").val();
		var newpassword = $("#newPassword").val();
		var data = new Object();
		var user = new Object();
		userId=$.cookie("adminid");
		user.adminUserId = userId;
		user.password = $("#originalPassword").val();
		user.newpassword =$("#newPassword").val();
		data.param = user;
		$.gdAjax({   
			loading : false,
			data:data,
			type: 'POST',
			url:"main/updateuserpassword?newpassword="+newpassword,
			success:function(data) {
				$.alertSuccess("修改密码成功！");
			}
		});
	}
}

/**
 * 验证密码
 * 
 * @param obj
 * @returns {Boolean}
 */
function checkPassword() {
	var newPassword = $("#newPassword").val();
	var confirmPassword = $("#confirmPassword").val();

	// 新密码长度不够
	if (newPassword.length < 6) {
		$("#newPassword").tipError("密码长度不能小于6位！");
		return false;
	}
	// 新密码长度过长
	if (newPassword.length > 20) {
		$("#newPassword").tipError("密码长度不能大于20位！");
		return false;
	}

	// 两次输入不一致
	if (!(newPassword===confirmPassword)) {
		$("#confirmPassword").tipError("两次密码输入不一致！");
		return false;
	}
	return true;
}


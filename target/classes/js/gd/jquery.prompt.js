jQuery.fn.extend({
			// 清除所有Tip
			clearAllTips : function() {
				$(this).find("div.form-group").each(
						function() {
							$(this).removeClass("has-error").removeClass("has-feedback");
							$(this).find("label.error-tip").remove();
							$(this).find("span.glyphicon").remove();
						});
			},
			// 清除单个Tip
			clearTip : function() {
				$(this).parents("div.form-group").removeClass("has-error")
						.removeClass("has-feedback");
				$(this).siblings("label.error-tip").remove();
				$(this).siblings("span.glyphicon").remove();
			},
			// 生成error tip提示
			tipError : function(message) {
				if ($(this).siblings("label.error-tip").length == 0) {
					$(this).after("<label class=\"error-tip define-error\">" + message + "</label>");
					$(this).after("<span class=\"glyphicon glyphicon-remove form-control-feedback\"></span>");
					//$(this).parents("div.form-group").addClass("has-error").addClass("has-feedback");
				}
			}
		});

jQuery.extend({
	/**
	 * 弹出成功消息
	 */
	alertSuccess: function (message, time, callback) {
		var width = 660;
		var offsetWidth = document.body.offsetWidth * 0.8;
		if (offsetWidth < width) {
			width = offsetWidth;
		}
		$(".alert-div").remove();
		var _html = "<div class='modal-dialog alert-div' style='margin-top: 50px; " + 
					"position: fixed; right: 30px; bottom: 0; z-index:9999; width: " + width + "px; font-size: 20px;'>" + 
						"<div class='alert alert-success' role='alert'>" + 
							"<button type='button' class='close' data-dismiss='alert'>" +
							"<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>" +
							"<strong>成功：</strong>" + message + 
						"</div>" + 
					"</div>";
		$("body").append(_html);
		var t = 5000;
		if (time) {
			t = time;
		}
		$(".alert-div").fadeOut(t, function() {
			if (callback) {
				callback();
			}
		});
	},
	/**
	 * 弹出消息
	 */
	alertInfo: function (message) {
		var width = 660;
		var offsetWidth = document.body.offsetWidth * 0.8;
		if (offsetWidth < width) {
			width = offsetWidth;
		}
		$(".alert-div").remove();
		var _html = "<div class='modal-dialog alert-div' style='margin-top: 50px; " + 
					"position: fixed; right: 30px; bottom: 0; z-index:9999; width: " + width + "px; font-size: 20px;'>" + 
						"<div class='alert alert-info' role='alert'>" + 
							"<button type='button' class='close' data-dismiss='alert'>" +
							"<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>" +
							"<strong>消息：</strong>" + message + 
						"</div>" + 
					"</div>";
		$("body").append(_html);
		$(".alert-div").fadeOut(5000);
	},
	/**
	 * 弹出警告消息
	 */
	alertWarning: function (message) {
		var width = 660;
		var offsetWidth = document.body.offsetWidth * 0.8;
		if (offsetWidth < width) {
			width = offsetWidth;
		}
		$(".alert-div").remove();
		var _html = "<div class='modal-dialog alert-div' style='margin-top: 50px; " + 
					"position: fixed; right: 30px; bottom: 0; z-index:9999; width: " + width + "px; font-size: 20px;'>" + 
						"<div class='alert alert-warning' role='alert'>" + 
							"<button type='button' class='close' data-dismiss='alert'>" +
							"<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>" +
							"<strong>警告：</strong>" + message + 
						"</div>" + 
					"</div>";
		$("body").append(_html);
		$(".alert-div").fadeOut(5000);
	},
	/**
	 * 弹出错误消息
	 */
	alertError: function (message) {
		var width = 660;
		var offsetWidth = document.body.offsetWidth * 0.8;
		if (offsetWidth < width) {
			width = offsetWidth;
		}
		$(".alert-div").remove();
		var _html = "<div class='modal-dialog alert-div' style='margin-top: 50px; " + 
					"position: fixed; right: 30px; bottom: 0; z-index:9999; width: " + width + "px; font-size: 20px;'>" + 
						"<div class='alert alert-danger' role='alert'>" + 
							"<button type='button' class='close' data-dismiss='alert'>" +
							"<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>" +
							"<strong>失败：</strong>" + message + 
						"</div>" + 
					"</div>";
		$("body").append(_html);
		$(".alert-div").fadeOut(5000);
	}
	
});

(function($) {
	window.Modal = function() {
		var html = '<div id="[Id]" class="modal fade" role="dialog" aria-labelledby="modalLabel">'
				+ '<div class="modal-dialog modal-sm">'
				+ '<div class="modal-content">'
				+ '<div class="modal-header">'
				+ '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>'
				+ '<h4 class="modal-title" id="modalLabel">[Title]</h4>'
				+ '</div>'
				+ '<div class="modal-body">'
				+ '<p>[Message]</p>'
				+ '</div>'
				+ '<div class="modal-footer">'
				+ '<button type="button" class="btn btn-default cancel" data-dismiss="modal">[BtnCancel]</button>'
				+ '<button type="button" class="btn btn-primary ok" data-dismiss="modal">[BtnOk]</button>'
				+ '</div>' + '</div>' + '</div>' + '</div>';
		var reg = new RegExp("\\[([^\\[\\]]*?)\\]", 'igm');
		var generateId = function() {
			var date = new Date();
			return 'mdl' + date.valueOf();
		}
		var init = function(options) {
			options = $.extend({}, {
				title : "操作提示",
				message : "提示内容",
				btnok : "确定",
				btncl : "取消",
				width : 200,
				auto : false
			}, options || {});
			var modalId = generateId();
			var content = html.replace(reg, function(node, key) {
				return {
					Id : modalId,
					Title : options.title,
					Message : options.message,
					BtnOk : options.btnok,
					BtnCancel : options.btncl
				}[key];
			});
			$('body').append(content);
			$('#' + modalId).modal();
			$('#' + modalId).on('hide.bs.modal', function(e) {
				$('body').find('#' + modalId).remove();
			});
			return modalId;
		}

		return {
			alert : function(options) {
				if (typeof options == 'string') {
					options = {
						message : options
					};
				}
				var id = init(options);
				var modal = $('#' + id);
				modal.find('.ok').removeClass('btn-success').addClass(
						'btn-primary');
				modal.find('.cancel').hide();

				return {
					id : id,
					on : function(callback) {
						if (callback && callback instanceof Function) {
							modal.find('.ok').click(function() {
								callback(true);
							});
						}
					},
					hide : function(callback) {
						if (callback && callback instanceof Function) {
							modal.on('hide.bs.modal', function(e) {
								callback(e);
							});
						}
					}
				};
			},
			confirm : function(options) {
				var id = init(options);
				var modal = $('#' + id);
				modal.find('.ok').removeClass('btn-primary').addClass(
						'btn-success');
				modal.find('.cancel').show();
				return {
					id : id,
					on : function(callback) {
						if (callback && callback instanceof Function) {
							modal.find('.ok').click(function() {
								callback(true);
							});
							modal.find('.cancel').click(function() {
								callback(false);
							});
						}
					},
					hide : function(callback) {
						if (callback && callback instanceof Function) {
							modal.on('hide.bs.modal', function(e) {
								callback(e);
							});
						}
					}
				};
			},
			dialog : function(options) {
				options = $.extend({}, {
					onReady : function() {
					}
				}, options || {});

				var target = $('#' + options.modalId);
				if (options.onReady())
					options.onReady.call(target);
				target.modal();
			}
		}
	}();
})(jQuery);
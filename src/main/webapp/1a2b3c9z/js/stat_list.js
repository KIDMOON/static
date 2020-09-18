$(function() {

	$("#txt_startTime, #txt_endTime").val(new Date().Format("YYYY-MM-DD"));
	getStat();
	$("#btn-search").click(function () {
		getStat();
	});
});
function getStat() {
	$.gdAjax({
		url : "stat/get?start=" + $("#txt_startTime").val() + "&end=" + $("#txt_endTime").val(),
		type: "GET",
		success : function(data) {
			$("#s1").text(convertNullTo0(data.result.s1));
			$("#s2").text(convertNullTo0(data.result.s2));
			$("#s3").text(convertNullTo0(data.result.s3));
			$("#s4").text(convertNullTo0(data.result.s4));
			$("#s5").text(convertNullTo0(data.result.s5));
			$("#s6").text(convertNullTo0(data.result.s6));
			$("#s7").text(convertNullTo0(data.result.s7));
			$("#s8").text(convertNullTo0(data.result.s8));
			$("#s9").text(convertNullTo0(data.result.s9));
		}
	})
}
function convertNullTo0(val) {
	if ($.isBlank(val)) {
		return 0;
	}
	return val;
}

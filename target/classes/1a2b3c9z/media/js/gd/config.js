var _url = window.location.href;
var serverAddress = new Object();
// if (_url.indexOf("http://kxcsgo.com") != -1) {
// 	_url = _url.replace("http://kxcsgo.com", "http://kxcsgo.com");
// 	window.location.href = _url;
// }
if(_url.indexOf("localhost") != -1) {
	serverAddress = {
		domain: "localhost",
		pageUrl: "http://localhost:63342/static/",
		apiUrl: "http://localhost/admin/",
		file: "http://localhost/",
		secret: "psaddbpi0spjk0c2mea7r88u3th4qrt8"
	}
}
else {
	serverAddress = {
		domain: "kxcsgo.com",
		pageUrl: "http://kxcsgo.com/",
		apiUrl: "http://kxcsgo.com/admin/",
		file: "http://kxcsgo.com/",
		secret: "psaddbpi0spjk0c2mea7r88u3th4qrt8"
	}
}

function _getCookie(name) {
	var arr,reg=new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr=document.cookie.match(reg))
		return unescape(arr[2]).replace(/\"/g, "");
	else
		return null;
}
function _setCookie(name, value) {
	var exp = new Date();
	exp.setTime(exp.getTime() + 24*60*60*1000);
	document.cookie = name + "="+ escape (value) + ";path=/;expires=" + exp.toGMTString();
}
function _getArgs(){
	var args = {};
	var query = location.search.substring(1);
	var pairs = query.split("&"); 
	for(var i = 0; i < pairs.length; i++) {
	    var pos = pairs[i].indexOf('=');
	    if (pos == -1) continue;
	    var argname = pairs[i].substring(0,pos);
	    var value = pairs[i].substring(pos+1);
	    value = decodeURIComponent(value);
	    args[argname] = value;
	}
	return args;
}
var params = _getArgs();
var _u = params["u"];
var _uc = _getCookie("_u");
var urlHas = true;
if(_u == "undefined" || _u == null || _u == ""){
	urlHas = false;
	//当前URL没有_u,从cookie中取
	_u = _uc;
}
else {
	// 如果URL有，则把cookie的值覆盖掉
	if (_u != _uc) {
		_setCookie("_u", _u);
	}
}
var _url = window.location.href;
var serverAddress = new Object();
//if (_url.indexOf("localhost") == -1 && _url.indexOf("www") == -1) {
//	_url = _url.replace("http://", "http://www.");
//	window.location.href = _url;
//}

//if (_url.indexOf("http://mygamesky.info") != -1) {
//	_url = _url.replace("http://mygamesky.info", "http://kxcsgo.com");
//	window.location.href = _url;
//}
//if (_url.indexOf("http://kxcsgo.com") != -1) {
//	_url = _url.replace("http://kxcsgo.com", "http://kxcsgo.com");
//	window.location.href = _url;
//}
if(_url.indexOf("localhost") != -1) {
	serverAddress = {
		domain: "localhost",
		pageUrl: "http://localhost:63342/static/",
		apiUrl: "http://localhost:8080/app/",
		file: "http://localhost:8080/",
		secret: "f45djdgs1nh1vhj2jsz3va6uzqx4lbnn"
	}
}
else {
	serverAddress = {
		domain: "kxcsgo.com",
		pageUrl: "http://kxcsgo.com/",
		apiUrl: "http://kxcsgo.com/app/",
		file: "http://kxcsgo.com/",
		secret: "f45djdgs1nh1vhj2jsz3va6uzqx4lbnn"
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
var _s = params["s"];
var _uc = _getCookie("_u");
var _sc = _getCookie("_s");
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
	if (_s != _sc) {
		_setCookie("_s", _s);
	}
}
var _promo = params["promo"];
var _promoc = _getCookie("_promo");
if(_promo == "undefined" || _promo == null || _promo == ""){
	//当前URL没有_u,从cookie中取
	_promo = _promoc;
}
else {
	// 如果URL有，则把cookie的值覆盖掉
	if (_promo != _promoc) {
		_setCookie("_promo", _promo);
	}
}

var _agreen = params["agreen"];
var _agreenc = _getCookie["_agreen"];
if ((_agreenc == "undefined" || _agreenc == null || _agreenc == "")
		&& (_agreen != "undefined" && _agreen != null && _agreen != "")) {
	_setCookie("_agreen", _agreen);
}
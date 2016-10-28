'use strict';

//原生ajax
function json2url(json){
	json.t=Math.random();
	var arr = [];
	for(var i in json){
		arr.push(i+'='+encodeURIComponent(json[i]));
	}
	return arr.join('&');
}
function ajax(json){
	json=json||{};
	if(!json.url)return;
	json.data=json.data||{};
	json.type=json.type||'get';
	
	if(window.XMLHttpRequest){
		var oAjax = new XMLHttpRequest();
	}else{
		var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	}
	switch(json.type.toLowerCase()){
		case 'get':
			oAjax.open('GET',json.url+'?'+json2url(json.data),true);
			oAjax.send();
		break;
		case 'post':
			oAjax.open('POST',json.url,true);
			oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
			oAjax.send(json2url(json.data));
		break;
	}
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				json.success&&json.success(oAjax.responseText);
			}else{
				json.error&&json.error(oAjax.status);
			}
		}
	};
}

//原生设置cookie
function addCookie(sName,sValue,iDay){
	if(iDay){
		var oDate = new Date();
		oDate.setDate(oDate.getDate()+iDay);
		document.cookie=sName+'='+sValue+'; PATH=/; EXPIRES='+oDate.toGMTString();
	}else{
		document.cookie=sName+'='+sValue+'; PATH=/';
	}
}

//原生获取cookie
function getCookie(sName){
	var arr = document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2 = arr[i].split('=');
		if(arr2[0]==sName){
			return arr2[1];
		}
	}
}

//原生删除cookie
function removeCookie(sName){
	addCookie(sName,1,-1);
}

//鼠标滚轮
function addEvent(obj,sEv,fn){
    if (obj.addEventListener){
        obj.addEventListener(sEv,fn,false);
    }else{
        obj.attachEvent('on'+sEv,fn);
    }
}
function addWheel(obj,fn){
    function fnWheel(ev){
        var oEvent = ev||event;
        var bDown = true;
        bDown=oEvent.wheelDelta?oEvent.wheelDelta<0:oEvent.detail>0;
        fn(bDown,oEvent);
        oEvent.preventDefault&&oEvent.preventDefault();
        return false;
    }
    if (window.navigator.userAgent.indexOf('Firefox')!=-1){
        obj.addEventListener('DOMMouseScroll',fnWheel,false);
    }else{
        addEvent(obj,'mousewheel',fnWheel);
    }
}

//设置随机整数,最小为n，最大为m-1
function rnd(n,m){
  return parseInt(n+Math.random()*(m-n));
}
//设置随机小数,最小为n，最大不超过m
function rnd_f(n,m){
  return (n+Math.random()*(m-n));
}

//获取非行间样式
function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}

//运动框架
function startMove(obj,json,options){
	options = options||{};
	options.time=options.time||700;
	options.type=options.type||'ease-out';
	var start = {};
	var dis = {};
	for(var name in json){
		start[name] = parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'top':
					start[name]=obj.offsetTop;
					break;
				case 'left':
					start[name]=obj.offsetLeft;
					break;
				case 'width':
					start[name]=obj.offsetWidth;
					break;
				case 'height':
					start[name]=obj.offsetHeight;
					break;
				case 'opacity':
					start[name]=1;
					break;
				case 'borderWidth':
					start[name]=0;
					break;
			}
		}
		dis[name]=json[name]-start[name];
	}
	var count = Math.floor(options.time/30);
	var n =0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			switch(options.type){
				case 'linear':
					var cur = start[name]+dis[name]*n/count;
					break;
				case 'ease-in':
					var a = n/count;
					var cur = start[name]+dis[name]*Math.pow(a,3);
					break;
				case 'ease-out':
					var a = 1-n/count;
					var cur = start[name]+dis[name]*(1-Math.pow(a,3));
					break;
			}
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.end&&options.end();
		}
	},30);
}


//设置CSS3的transition
function transition(a,b){
	b = b||{};
  b.time = b.time||'1s';
	b.style = b.style||'all';
	b.type = b.type||'linear';
	a.style.WebkitTransition = b.time +' '+b.style+' '+b.type;
	a.style.MozTransition = b.time +' '+b.style+' '+b.type;
	a.style.MsTransition = b.time +' '+b.style+' '+b.type;
	a.style.OTransition = b.time +' '+b.style+' '+b.type;
}

//取反操作
function opposite(a,b,c,d){
  if(a.style[b] == c){
	  a.style[b] = d;
	}else {
	  a.style[b] = c;
	}
}

//批量设置元素样式
function setStyles(a,b){
	if(a.length&&(a.length>1)){
		for(var _i=0; _i<a.length; _i++){
			for(var c in b){
				a[_i].style[c] = b[c];
			}
		}
	}else{
		for(var c in b){
			a.style[c] = b[c];
		}
	}
}

//批量控制class
function setClassName(a,b){
  if(a.length > 1){
	  for(var _i = 0, c = a.length; _i < c; _i++){
		  a[_i].className = b;
		}
	}else {
	  a.className = b;
	}
}

//单选框类名控制反选
function selection(a,b,c){
  if(a.className == b){
		a.className = c;
	}else {
		a.className = b;
	}
}

//通过class获取元素
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,fn,false);
	}else{
		obj.attachEvent('on'+sEv,fn);
	}
}
function findInArr(arr,item){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==item){
			return true;
		}
	}
	return false;
}
function getByClass(obj,sClass){
	var aResult = [];
	if(obj.getElementsByClassName){
		aResult = obj.getElementsByClassName(sClass);
	}else{
		var aEle = obj.getElementsByTagName('*');
		for(var i=0;i<aEle.length;i++){
			var aClass = aEle[i].className.split(' ');
			if(findInArr(aClass,sClass)){
				aResult.push(aEle[i]);
			}
		}
	}
	return aResult;
}

//设置指定ID元素的value,并且需要有页面显示内容
function fn_value(a,b,c){
  var aaaa = document.getElementById(a);
  aaaa.value = c.innerHTML;
	setStyles(b,{color:'#4a4a4a'});
  b.innerHTML = c.innerHTML;
}

//发送短信验证
function note_verify(a){
  if(a.b)return;
	a.b = true;
	var c = null;
	var d = 60;
	//setStyles(a,{color:'#ccc',borderColor:'#ccc'});
	setStyles(a,{background: '#ccc'});
	a.innerHTML = d + 's后重新发送';
	c = setInterval(function(){
		d--;
		if(d == 0){
			a.b = false;
			clearInterval(c);
			//setStyles(obj,{color:'#dbab64',borderColor:'#dbab64'});
			
			setStyles(a,{background: '#ffbc00'});
			a.innerHTML = '重新发送验证码';
		}else {
			a.innerHTML = d + 's后重新发送';
		}
	},1000);
}

//倒计时
function count_down(obj,oY,oM,oD,oH,oMi,oS){
	var a = {};
	var oDate = new Date();
	oDate.setFullYear(oY);
	oDate.setMonth(oM-1);
	oDate.setDate(oD);
	oDate.setHours(oH);
	oDate.setMinutes(oMi);
	oDate.setSeconds(oS);
	var nTimer_ = new Date().getTime();
	var nSetTimer_ = oDate.getTime();
	var nDisTime_ = nSetTimer_ - nTimer_;
	if(nDisTime_ <= 0){
		nDisTime_=0;
		clearInterval(obj.timer);
	}
	a.nD = parseInt(nDisTime_/86400000);
	nDisTime_ %= 86400000;
	a.nH = parseInt(nDisTime_/3600000);
	nDisTime_ %= 3600000;
	a.nM = parseInt(nDisTime_/60000);
	nDisTime_ %= 60000;
	a.nS = parseInt(nDisTime_/1000);
	return a;
}

//角度转换成弧度
function d2a(n){
  return n*Math.PI/180;
}

//百分比转换
function fn_percent(a) {
	return parseInt(a.innerHTML) * 3.6;
}

//圆弧
function svg_bow(obj,dug){
	dug = fn_percent(dug)||0;
  var cx = 30,cy = 30;
	var r = 19;
	var ang = dug;
	var x = cx + Math.sin(d2a(ang))*r;
	var y = cy - Math.cos(d2a(ang))*r;
	var _i = 0;
	if(ang == 360){
	  x = 29.99;
	}
	obj.setAttribute(
	  'd',
		[
		  'M', cx, cy-r,
			'A', r, r, 0, (ang>180?1:0), 1, x, y
		].join(' ')
	);
}

//banner效果
function fn_banner_roll(a,b,c){
  var d = document.getElementById(a);
  var e = document.getElementById(b);
	var f = e.children;
	var _g = document.getElementById(c);
	var _e = _g.children;
	var _c = 0,_d = 0,_f = 0;
	var w = null;
	setStyles(_g,{width:(_g.children.length*_g.children[0].offsetWidth - 15)+'px'});
	setStyles(_g,{marginLeft:-_g.offsetWidth/2 + 'px'});
	for(var i=0,num=_e.length; i<num; i++){
	  _e[i].index = i;
		_e[i].onclick = function(){
			_f = this.index;
		  y();
		};
	}
	d.onmouseover = function(){
	  clearInterval(w);
	};
	d.onmouseout = function(){
	  clearInterval(w);
	  w = setInterval(z,3000);
	};
	clearInterval(w);
	w = setInterval(z,3000);
	function z(){
	  _f = _f + 1;
		_f %= _e.length;
		y();
	}
	function y(){
		if(!e.x){
			e.x = true;
			_c = _f;
			setClassName(_e,'pull-left');
			if(_c > _d){
				for(var j=0,nm=_e.length; j<nm; j++){
					if(_e[j].index != _d){
						setStyles(f[j],{left:e.offsetWidth + 'px',index:0});
						setStyles(f[_c],{zIndex:1});
						startMove(f[_c],{left:0},{type:'linear'});
						startMove(f[_d],{left:-e.offsetWidth},{type:'linear',end:function(){
							setStyles(f[_d],{zIndex:0});
							e.x = false;
						}});
					}
				}
			}else if(_c < _d){
				for(var j=0,nm=_e.length; j<nm; j++){
					if(_e[j].index != _d){
						setStyles(f[j],{left:-e.offsetWidth + 'px',index:0});
						setStyles(f[_c],{zIndex:1});
						startMove(f[_c],{left:0},{type:'linear'});
						startMove(f[_d],{left:e.offsetWidth},{type:'linear',end:function(){
							setStyles(f[_d],{zIndex:0});
							e.x = false;
						}});
					}
				}
			}
			setClassName(_e[_c],'pull-left active');
			_d = _c;
		}
	}
}

//左右拖拽
function drag(a,b){
	var a = document.getElementById(a);
	var b = document.getElementById(b);
	a.onmousedown = function(ev){
		var oEvent = ev||event;
	  var oStart = {x: oEvent.clientX};
		var oF_l = a.offsetLeft;
		document.onmousemove = function(ev){
			a.c_lick = true;
			if(a.offsetWidth <= b.offsetWidth)return;
			var oEvent = ev||event;
			var oDis_x = oEvent.clientX - oStart.x;
			if(-oDis_x > (a.offsetWidth - b.offsetWidth + oF_l)&&oDis_x<0){
				oDis_x = b.offsetWidth - a.offsetWidth - oF_l;
			}else if(oDis_x > -oF_l&&oDis_x > 0){
				oDis_x = -oF_l;
			}
			setStyles(a,{left: oDis_x + oF_l + 'px'});
		};
		document.onmouseup = function(){
			setTimeout(function(){
			  a.c_lick = false;
			},1);
		  document.onmousemove = null;
			document.onmouseup = null;
		};
		a.setCapture&&a.setCapture();
		return false;
	};
}

//底部文字滚动
function fn_footer_news(a,b){
	var b = a.offsetLeft;
	if(a.children[0].offsetWidth <= a.parentNode.offsetWidth)return;
	clearInterval(a.timer);
	a.timer = setInterval(function(){
		if(Math.abs(b) >= a.children[0].offsetWidth)b = 0;
		b--;
		setStyles(a,{left: b + 'px'});
	},30);
}
function f_footer_news(c,b){
  var a = document.getElementById(c);
	if(a.children[0].offsetWidth > a.parentNode.offsetWidth){
		a.innerHTML += a.innerHTML;
		setStyles(a,{width: a.children[0].offsetWidth*2 + 'px'});
		fn_footer_news(a,b);
		a.addEventListener('mouseover',function(){
			clearInterval(a.timer);
		});
		a.addEventListener('mouseout',function(){
			clearInterval(a.timer);
			fn_footer_news(a,b);
		});
	}
}

//自定义滚动条及鼠标滑轮滚动
function fn_roll_drag(b,a,c){
	var d = document.getElementById(a);
	var e = document.getElementById(c);
	var oHeight = {
	  ct: d.offsetHeight,
		ct_box: d.parentNode.offsetHeight,
	};
	if(oHeight.ct <= oHeight.ct_box){
	  return false;
	}else {
		setStyles(e,{display:'block'});
	}
	var f = document.getElementById(b);
	var g = e.children[0];
	var h = oHeight.ct_box*e.offsetHeight/oHeight.ct;
	setStyles(g,{height: h + 'px'});
	f.addEventListener('mouseover',function(){
		startMove(e,{opacity:1},{type:'linear',time:70});
	});
	f.addEventListener('mouseout',function(){
		startMove(e,{opacity:0},{type:'linear',time:70});
	});
	fn_roll_drag_wheel(d,g,e,oHeight);
	g.onmousedown = function(ev){
		var oEvent = ev||event;
	  var oStart = {
			start: g.offsetTop,
			scale: g.offsetTop/(e.offsetHeight - g.offsetHeight),
			clientY: oEvent.clientY
		};
		document.onmousemove = function(ev){
		  var oEvent = ev||event;
			var z = oEvent.clientY - oStart.clientY;
			if(z > (e.offsetHeight - g.offsetHeight - oStart.start)){
			  z = e.offsetHeight - g.offsetHeight - oStart.start;
			}else if(z < -oStart.start){
			  z = -oStart.start;
			}
			oStart.scale = (oStart.start + z)/(e.offsetHeight - g.offsetHeight);
			setStyles(g,{top: oStart.start + z + 'px'});
			setStyles(d,{top: oStart.scale*(oHeight.ct_box - oHeight.ct) + 'px'});
		};
		document.onmouseup = function(){
		  document.onmousemove = null;
			document.onmouseup = null;
		};
		g.setCapture&&g.setCapture();
		return false;
	};
}
function fn_roll_drag_wheel(d,g,e,oHeight){
  addWheel(d,function(down){
	  if(oHeight.ct <= oHeight.ct_box) return;
		var j = d.offsetTop;
		if(down){
		  j -= 10;
		}else {
		  j += 10;
		}
		if(j > 0){
		  j = 0;
		}else if(j < oHeight.ct_box - oHeight.ct){
		  j = oHeight.ct_box - oHeight.ct;
		}
		setStyles(d,{top: j + 'px'});
		setStyles(g,{top: j/(oHeight.ct_box - oHeight.ct)*(e.offsetHeight - g.offsetHeight) + 'px'});
	});
}
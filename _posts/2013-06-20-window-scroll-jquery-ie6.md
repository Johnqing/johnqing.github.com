---
layout: post
title: jquery返回顶部插件遇到的问题？
---

最近在做首页的改版*（吐槽下。。尼玛真心难看）*在调用同事的返回顶部jquery插件时，**ie6下页面会非常卡**。  

看了下京东和其他几个网站的返回顶部都没有这个问题。

那就是代码的问题，先上一个原代码:

<pre>
;(function($){
	$.fn.gbackTop = function(o) {
		var def = { 
			st:100,/*滚动距离*/
			box:"fixed"/*容器*/
			};
		var o=$.extend(def,o),
			t = o.st,
			b = o.box;
		return this.each(function(){
			var top =$(window).scrollTop();
			if(top>t){
				$(b).show();
			};
			$(window).scroll(function () {
				if ($(this).scrollTop() > t) {
					$(b).show();
				} else {
					$(b).hide();
				};
			});
		});
	};
})(jQuery)
</pre>

翻看了下上面这段代码，发现有以下几个点，需要优化（这里讨论的是严重影响性能代码）：

<pre>
this.each();
</pre>

这段代码每次调用gbackTop函数都要循环一次this


<pre>
var top =$(window).scrollTop();
if(top>t){
	$(b).show();
};
</pre>

这段其实完全没有必要，因为刷新页面时window.onscroll肯定会执行

<pre>
if ($(this).scrollTop() > t) {
	$(b).show();
} else {
	$(b).hide();
};
</pre>

这段可以优化为：

<pre>
if ($(this).scrollTop() > t) {
	$(b).show();
	return;
};
$(b).hide();
</pre>


**ie6获取scrollTop并且修改top值会无限触发reflow**

好了，附上我重构过的代码，（参数没有重构掉）

<pre>
;(function($){
	$.fn.gbackTop = function(opts) {
		var def = { 
			st:100,/*滚动距离*/
			box:"fixed"/*容器*/
		},
		timer = null;
		opts = $.extend({}, def, opts);
		
		$(window).bind('scroll',function () {
			if(timer){
				clearTimeout(timer);
			}
			var that = $(this);
			timer = setTimeout(function(){
				elDisplay(that);	
			},100);			
		});
		function elDisplay(el){
			el = el || $(window);
			if (el.scrollTop() > opts.st) {
				$(opts.box).show();
				return;
			};
			$(opts.box).hide();
		}
	};
})(jQuery);
</pre>

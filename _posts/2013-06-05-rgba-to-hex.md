---
layout: post
title: raba 和 hex互相转换
category: js
---


代码如下：

color 需为 十六进制**#ffffff**格式

透明度 需为 **0.1**格式


{% highlight lua %}
toHex = function (color, ap) {
  ap = (Math.round((ap*100)*255/100)).toString(16);
  color = color.indexOf('#') < 0 ? ('#' + ap + color) : ('#'+ ap + color.substring(1, color.length));
  return color;
},
toRgba = function(color, ap){
  var sColor = color.toLowerCase();
  var sColorChange = [];
  for(var i=1; i<7; i+=2){
      sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
  }
  return 'rgba(' + sColorChange.join(',') + ','+ap+')';
};
{% endhighlight %}

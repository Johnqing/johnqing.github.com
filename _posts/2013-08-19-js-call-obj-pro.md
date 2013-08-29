---
layout: post
title: js中链式调用和对象的处理
---

> 很多同学比较迷糊，类似于jquery/n.js中链式调用是如何实现的？倒是他的类数组对象是存在什么地方的？

##链式调用##

链式的实现有很多种，在这里我只阐述原型的方式是如何实现的，老规矩先上代码:

{% highlight html %}
var Base = function(id){
	this[0] = document.getElementById(id);
	return this;	 
}
var Ajs = function(id){
  return new Base(id);
}
 
Base.prototype = {
	html: function(str){
		this[0].innerHTML = str;
		return this;
	},
	addClass: function(str){
		this[0].className += ' '+str;
		return this;
	}
}
 
 
var obj = Ajs('test');
obj.html('111').addClass('xxx');
{% endhighlight %}

细心的同学肯定会发现 每一个 函数中都有一个手动写好的 返回值（大部分都是this）

其实链式的秘密就在于 这个 this 的应用

因为 在我们实例化一个对象的时候 this 始终指向 你实例化的对象，我们调用实例化上的方法时，都会查询当前原型链上 是否有该方法，因为每一个方法都返回this，所以嘛。。

##类数组对象##

很多人都知道，在使用jquery的时候 操作的一个 jquery对象，到底什么是jquery对象呢？看代码：

我们改造一下上面的代码

{% highlight html %}
var Base = function(obj){
	this.length = 0;
	for(var i=0; i &lt; obj.length; i++){
		this[this.length++] = obj[i];
	}
	return this;	 
}
var Ajs = function(tag){	  
  var obj = document.getElementsByTagName(tag);
  return new Base(obj);
}
 
Base.prototype = {
	html: function(str){
		for(var i=0; i &lt; obj.length; i++){
			this[i].innerHTML = str;
		}
		return this;
	},
	addClass: function(str){
		this[0].className += ' '+str;
		return this;
	}
}
 
 
var obj = Ajs('li');
obj.html('xxxx').addClass('xxx');
{% endhighlight %}

好了，解析一下代码。前提 我们这里是获取一组li，并且给li的html替换为指定值，然后第一个li的的className添加为指定值

Ajs传入了一个li字符串，并在Ajs中获取了li的nodeList，给Base类传入li的nodeList，返回一个实例化的 Base类。

说到这里发现Ajs其实没啥特殊的。好了接着往下看

Base类里干了什么呢？

首先，要了解 this 是没有length属性的。

所以在Base类中就要手动创建一个length属性（因为this是一个对象，所以可以随便创建属性）

循环传入的nodeList，并且给this按顺序插入每一个对象，this.length++使this的length属性一直叠加到循环结束，保证了我们可以正常循环this来取出相应的nodeList

然后返回 我们已经改变的this。

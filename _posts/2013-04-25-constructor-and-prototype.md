---
layout: post
title: 类、构造函数、原型
category: js
---

> js中类的构建，并不像java、c++等拥有正在的类，而是多数通过构造器和原型方式模拟出来的。

##构造函数##

上代码:

<pre>
var a = function(n){
	this.n = n;
	this.b = function(){
		console.log(this.n);
	}
}
var c = new a(1);
var d = new a(2);
c.b();//1
d.b();//2
</pre>

**构造函数会重复生成函数，为每个对象创建独立的函数版本。**

##原型方式##

上代码：

<pre>
var a = function(){}
a.prototype.n = [1,2];
a.prototype.b = function(){
	console.log(this.n);
}

var c = new a(1);
var d = new a(2);

c.n.push(3);

c.b();//[1, 2, 3]
d.b();//[1, 2, 3]
</pre>

这里a的2个实例都指向了同一个数组。so，这里的a类的prototype可以认为开了一个共享空间，大家（实例）都可以从这读取数据和方法。

什么样的方法最合理呢？嘿嘿，就不告诉你，恩恩！！！
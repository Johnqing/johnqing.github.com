---
layout: post
title: javascript 函数嵌套的性能问题
---

##函数嵌套的性能##

开发者们经常会写出如下代码：

{% highlight ruby %}
function a(x, y){
  function b(){
    return x+y;
  }
  return b();
}
{% endhighlight %}

上面的a中嵌入了b，当a运行的时候，就会调用b。

javascript引擎不会创建b函数，直到外部引用了a，随着a的运行结束，b也会销毁。

当多次运行a的时候，javascript引擎就要在每次的运行a时创建b函数，而每次a结束就要销毁b函数，大家都知道回收是一个很费时的操作。

那么为什么我们不把b函数拿出来，做为一个独立的函数，它在a外部只被创建一次，而不是多次。

改进代码：

{% highlight ruby %}
function a(x, y){
  return b(x, y);
}
function b(x, y){
  return x+y;
}
{% endhighlight %}

##构造函数和prototype##

开发者们在写面向对象的时候，常常会写出以下代码：

{% highlight ruby %}
function A(x, y){
  this.h = x;
  this.w = y;
  
  this.get = function(){
    return this.h + this.w;
  }
}
var x = new A(1, 2);
var y = new A(3, 4);
{% endhighlight %}

这段代码定义了一个A类，get方法在实例化对象的时候 都不相同。所以x.get的返回值不等于y.get的返回值。

不过在js中拥有prototype关键字，prototype的属性是实例化后的对象所共有的属性，所以上面的代码可以通过prototype改写成下面的方式:

{% highlight ruby %}
function A(x, y){
  this.h = x;
  this.w = y;
}
A.prototype.get = function(){
  return this.h + thisw;
}
var x = new A(1, 2);
var y = new A(3, 4);
{% endhighlight %}

经过测试第二种方法要比第一种方法在效率上面快了18%~96%。

##注意##
这篇文章不是推荐大家必须使用这些方法，只是在多次函数调用的时候注意这些东西

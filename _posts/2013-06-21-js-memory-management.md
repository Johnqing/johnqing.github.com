---
layout: post
title: javascript内存管理
---

> 最近总是碰到性能上的问题，顺便也思考了下JS垃圾回收的问题

垃圾回收，肯定是涉及内存的分配、读写、释放几个部分

js属于高级语言，所以内存的管理都是自动完成的。

##分配##

###值的初始化##

{% highlight javascript %}
var obj = {a:1}//为对象分配内存
var n = 1; //为数字分配内存
var s = 'string'; //为字符串分配内存
var arr = [1,2]; //为数组分配内存
//为函数分配内存
function a(){
  return 1;
}
{% endhighlight %}

在为变量赋值的时候，js会自动完成内存的分配工作。

一些方法也会分配内存：
{% highlight javascript %}
var a = [1,2,3];
var b = a.slice(1);//slice方法生成一个新的数组

var dom = document.getElementById('body'); //分配一个对象的空间
{% endhighlight %}

##读写##

{% highlight javascript %}
var a = '';
a = {1,2}
{% endhighlight %}

这些操作对变量或者对象的属性进行读写操作，或者向函数传递参数。

##释放##

垃圾收集判定内存是否被需要，在不再需要的时候执行资源释放操作。
他只能获得一个近似值，因为判断一个内存是否被需要，这是个不确定的问题（不能通过一种算法解决）。

###垃圾回收###

垃圾收集机制主要判断变量释放内存空间的方法有两个：

1. 标记清除法
2. 引用计数法

####标记清除法####

当变量进入环境时，就将这个变量标记为“进入环境”。
从 逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到它们。
而当变量离开环境时，则将其标记为“离开环境”。

垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记（当然，可以使用任何标记方式）。
然后，它会去掉环境中的变量以及被环境中的变量引用 的变量的标记。
而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。
最后，垃圾收集器完成内存清除工作， 销毁那些带标记的值并回收他们所占用的内存空间。

####引用计数法####

跟踪记录每个值被引用的次数。

当声明了一个变量并将一个引用类型值赋给该变量时，则这个值的引用次数就是1。

如果同 一个值又被赋给另一个变量，则该值的引用次数加1。

相反，如果包含对这个引用的变量取得了另外一个值，则这个值的引用次数减1。

当这个值的引用次数变成 0时，则说明没有办法再访问这个值了，因而就可以将其占用的内存空间收回来。

这样当垃圾回收器下次再运行时，它就会释放那些引用次数为零的值所占用的内存。

**循环引用：对象A中包含一个指向对象B的指针，而对象B中也包含一个指向对象A的引用。**如下：
{% highlight javascript %}
(function(){
  var a = {};
  var b = {};
  a.x=b;
  b.y=a;
})();
{% endhighlight %}
---
layout: post
title: javascript中apply和call详解
---

> 

**apply和call是js中Function.protype的一个方法**所以每一个Function实例都会拥有这2个实例

说到这个不得不说说什么是上下文？

####上下文####
上下文是通过变量this工作。变量this总是引用代码当前所在的那个对象。记住全局对象实际上是window对象的属性。

这意味着即使是在全局上下文里，this 变量仍然引用一个对象。

*上面这段代码比较拗口，下面我详细讲解下*

**执行上下文的建立过程**

每当调用一个函数时，一个新的执行上下文就会被创建出来。
然而，在javascript引擎内部，这个上下文的创建过程具体分为两个阶段:

1. 建立阶段(发生在当调用一个函数时，但是在执行函数体内的具体代码以前)  
  * 建立变量，函数，arguments对象，参数
  * 建立作用域链
  * 确定this的值
2. 代码执行阶段:  
变量赋值，函数引用，执行其它代码

模拟一下执行上下文:

{% highlight javascript %}
  executionContextObj = {
    variableObject: { 
      /* 函数中的arguments对象, 参数, 内部的变量以及函数声明 */ 
    },
    scopeChain: { 
      /* variableObject 以及所有父执行上下文中的variableObject */
    },
    this: {}
  }
{% endhighlight %}

上下文对象（上述的executionContextObj）是在函数被调用时，但是在函数体被真正执行以前所创建的。
函数被调用时，就是我上述所描述的两个阶段中的第一个阶段 – 建立阶段。
这个时刻，引擎会检查函数中的参数，声明的变量以及内部函数，然后基于这些信息建立执行上下文对象（executionContextObj）。
在这个阶段，variableObject对象，作用域链，以及this所指向的对象都会被确定。

*言归正传，说说apply和call*

怎么说呢？

apply 和 call 这俩货在作用上完全一样，只是在使用上略有不同

所以这里我只说call吧~

老习惯，上代码

{% highlight javascript %}
var a = function(){
    console.log(this.name+'，你妈喊你回家吃饭!');
    this.age = 18;
}
var b = {
  name: '贾xx'
}
a.call(b);
console.log(b.age);
{% endhighlight %}

不懂？

再来一段代码

{% highlight javascript %}
var a = function(name){
    this.name = name
    this.say = function(){
        console.log(this.name + '，喊你回家吃饭！');
    }
}
var b = function(name, age){
    a.call(this, name);

    this.age = age;

    this.sayAge = function(){
        console.log('我的年龄:' + this.age);
    }
}

var c = new b('贾xx', 18);

c.say();
c.sayAge();
{% endhighlight %}

很明显 这里的b中是没有say方法和name属性的，我们需要借用a中的say方法和name属性

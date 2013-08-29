---
layout: post
title: js中的Prototype(原型)
---


##prototype到底是个啥？##

*每一个构造函数都有一个属性叫做原型(prototype)。这个属性非常有用：为一个特定类声明通用的变量或者函数。*

每个javascript对象在定义或者实例化的时候都会添加一个属性（__proto__）。这个属性不是所有的浏览器都暴露出来。

哎，木有办法还是得上代码：

<pre>
var xObj = function(){
    this.n = 1;
}
xObj.prototype = {
    getNumber: function(){
        console.log(n);
    }
}
var x = new xObj();
x.getNumber();
</pre>

一步一步来分解上面的代码

**创建xObj的时候，定义了一个Function类型的对象**

在js引擎中有类似代码:

<pre>
Function.prototype = {
    arguments: null,
    length: 0,
    ...
}
</pre>

**当定义xObj后，查看Function的length，值为1。这是为什么呢？**

这里的xObj其实是Function的一个实例。

当一个对象的实例创建后，__proto__属性将被更新然后指向构建器(constructor)的prototype，这里是Funciton。

**当我们实例化xObj的时候，__proto__将会指向xObj.prototype做为新的实例的构造器。**

这样我们就可以访问xObj的getNumber方法，以及Function的aruments等方法和属性

##为毛要用原型的方式？##

我擦 你难倒我了！ 还是上代码吧！

来个假设：

我们需要N个对象，这些对象都有自己的属性，但是方法相同。

<pre>
var obj = {
    a: 1,
    b: 2,
    c: 3,
    .....
    get: function(){
        console.log(this.a);
    }
}
</pre>

尼玛，创建10000次。。。

发现问题了么？会在内存中创建10000个对象，并且所有的属性、方法都是分开定义。这样的代码会直接导致浏览器爆掉。

##使用prototype的好处##

发现了么？prototype相当于开辟了一个共享空间，当我们需要某些方法或者属性的时候可以在共享空间内随意摘取。

##修改本地对象的prototype##

上代码

<pre>
String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
};
</pre>

> 总的来说，不推荐修改本地对象的原型。原因是当本地对象支持该方法的时候，出现众多让人措手不及的事情。

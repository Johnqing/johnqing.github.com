---
layout: post
title: 再谈前端性能优化
category: f2e
---

> 最近一直在面试，其中最常见的问题就是前端性能优化的问题。

通过Yslow、page speed可以抓取当前页面需要优化的项目：

##减少http请求##

在浏览器(客户端)和服务器发生通信时，就已经消耗了大量的时间，尤其是在网络情况比较糟糕的时候，这个问题尤其的突出。

一个正常HTTP请求的流程简述：如在浏览器中输入"www.xxxxxx.com"并按下回车，浏览器再与这个URL指向的服务器建立连接，然后浏览器才能向服务器发送请求信息，服务器在接受到请求的信息后再返回相应的信息，浏览器接收到来自服务器的应答信息后，对这些数据解释执行。

而当我们请求的网页文件中有很多图片、CSS、JS甚至音乐等信息时，将会频繁的与服务器建立连接，与释放连接，这必定会造成资源的浪费，且每个HTTP请求都会对服务器和浏览器产生性能负担。

网速相同的条件下，下载一个100KB的图片比下载两个50KB的图片要快。所以，请减少HTTP请求。

**解决办法：**

合并图片(css sprites)，合并CSS和JS文件;图片较多的页面也可以使用 lazyLoad 等技术进行优化。

需要js大块模板拼接的，可以使用js模板引擎。

##重绘和重排##

重绘：一个元素的外观被改变（颜色、visibility），而布局未被影响的情况（宽高）。

重排：DOM元素的变化影响到了布局（宽高），浏览器重新计算元素的属性。

**解决办法：**

通过设置class来切换样式，减少重排次数。

##减少dom操作##

在《高性能JavaScript》中这么比喻：“把DOM看成一个岛屿，把JavaScript(ECMAScript)看成另一个岛屿，两者之间以一座收费桥连接”。
所以每次访问DOM都会教一个过桥费，而访问的次数越多，交的费用也就越多。所以一般建议尽量减少过桥次数。

**解决办法：**

减少对Dom元素的查询和修改，缓存DOM元素。

ie中：hover会降低响应速度。

##使用json来进行数据交换##

相对于xml，json数据的体积会小很多。

**解决办法：**

尽量使用json进行数据交换。

##使用CDN加速##

##cookie大小控制##

合理的使用cookie

##使用Gzip压缩##

减小体积和传输速度

##样式放在页面顶端##

##js文件放在页尾##

##避免使用css表达式##

----------

> 继续上面的

##缓存DOM##

<pre>
var obj = obj.name;
obj.attr();
obj.css();
</pre>

##减少不必要的对象创建##

其实对象的创建代价并不是太大。但是由于垃圾回收算法有时候略2，所以还是减少不必要的消耗。

##循环优化##

采用Duff策略：

<pre>
for(var i = 0, len = aValue.length; i<len; i++){
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
    fDoSomething(aValues[i++]);
}
</pre>

经过测试8次为最佳。

未完待续。。
---
layout: post
title: css3是个独立的ui线程
category: f2e
---

原文地址[点击查看](http://www.phpied.com/css-animations-off-the-ui-thread/)

####  css3是一个独立的ui线程

[This excellent Google I/O talk](http://www.youtube.com/watch?v=hAzhayTnhEI)中提到，Android移动版的Chrome浏览器的CSS动画的UI线程，没错，这是一个伟大的想法。看看我在使用它的时候发现了什么：

+ 浏览器支持：Desktop Safari / IOS Safari / Android Chrome 
+ 你需要使用CSS transforms。动画的常规属性不工作。

**更新**(见评论)证实IE10支持。据说Firefox OS也支持，但是我没有确认过。

更多细节在下面

####  单线程

正如你知道的浏览器是单线程的。使用ECMAScript可能会使浏览器性能消耗严重（这句是译者理解）

译者添加：  
把DOM看成一个岛屿，把JavaScript（ECMAScript）看成另一个岛屿，两者之间以一座收费桥连接（参见John Hrvatin，微软，MIX09，http://videos.visitmix.com/MIX09/T53F）。每次ECMAScript需要访问DOM时，你需要过桥，交一次“过桥费”。你操作DOM次数越多，费用就越高。一般的建议是尽量减少过桥次数，努力停留在ECMAScript岛上。

####  大体的思路

应该排出“一切”可能冻结css动画的因素

####  测试页

这个[测试页](http://www.phpied.com/files/css-thread/thread.html)里有一些动画。点击按钮，看看会发生什么。

&lt;iframe src="http://www.phpied.com/files/css-thread/thread.html" allowfullscreen="allowfullscreen" width="600px" height="250px"&gt;&lt;/iframe&gt;

####  动画

红色方块旋转动画，如下：

<pre>.spin {
  animation: 3s rotate linear infinite;
}
 
@keyframes rotate {
  from {transform: rotate(0deg);}
  to {transform: rotate(360deg);}
}</pre>

绿色方块变换动画，如下：

<pre>.walkabout-new-school {
  animation: 3s slide-transform linear infinite;
}
 
@keyframes slide-transform {
  from {transform: translatex(0);}
  50% {transform: translatex(300px);}
  to {transform: translatex(0);}
}</pre>

蓝色方块动画使用margin-left，而不是变换，如下：

<pre>.walkabout-old-school {
  animation: 3s slide-margin linear infinite;
}
 
@keyframes slide-margin {
  from {margin-left: 0;}
  50% {margin-left: 100%;}
  to {margin-left: 0;}
}</pre>

#### Kill 开关

点击kill按钮2秒钟时，看好CPU变化：

<pre>function kill() {
  var start = +new Date;
  while (+new Date - start &lt; 2000){}
}</pre>

#### 结果

在不支持的浏览器，会杀掉所有动画。

在支持的浏览器（All Safaris and Andriod Chrome）点击按钮只会影响蓝色方块，因为它使用了css的一个属性，而不是css变换。使用变换的动画正常运行。

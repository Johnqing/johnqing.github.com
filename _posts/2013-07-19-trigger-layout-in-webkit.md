---
layout: post
title: webkit下触发重新布局
---

> 大多数Web开发人员都知道，大量的脚步执行时间都花费在DOM操作上，而不是脚本的执行上。这面里面有一个代价很高的布局操作 - 
构建渲染树和DOM树的过程。复杂的DOM操作中，代价会更高。

保证一个页面看起来不是那么单调的一个重要技术实现就是通过批量的操作DOM实现的，我们可以从这些操作里分析。例如：

{% highlight html %}
//不理想，导致2次重新布局
var newWidth = aDiv.offsetWidth + 10; //读取
aDiv.style.width = newWidth + 'px'; //写入
var newHeight = aDiv.offsetHeight + 10; //读取
aDiv.style.Height = newHeight + 'px'; //写入

//好的方式，只有一次布局
var newWidth = aDiv.offsetWidth + 10; //读取
var newHeight = aDiv.offsetHeight + 10; //读取
aDiv.style.width = newWidth + 'px'; //写入
aDiv.style.Height = newHeight + 'px'; //写入
{% endhighlight %}

Stoyan Stefanov的[这篇文章](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)提供了很好的解释

开发者们经常会想：是什么触发了重新布局？为了好理解，下面给出属性和方法的列表：

###Element###

clientHeight, clientLeft, clientTop, clientWidth, focus(), getBoundingClientRect(), getClientRects(), innerText, offsetHeight, offsetLeft, offsetParent, offsetTop, offsetWidth, outerText, scrollByLines(), scrollByPages(), scrollHeight, scrollIntoView(), scrollIntoViewIfNeeded(), scrollLeft, scrollTop, scrollWidth

###Frame, Image###

height, width

###Range###

getBoundingClientRect(), getClientRects()

###SVGLocatable###

computeCTM(), getBBox()

###SVGTextContent###

getCharNumAtPosition(), getComputedTextLength(), getEndPositionOfChar(), getExtentOfChar(), getNumberOfChars(), getRotationOfChar(), getStartPositionOfChar(), getSubStringLength(), selectSubString()

###SVGUse###

instanceRoot

###window###

getComputedStyle(), scrollBy(), scrollTo(), scrollX, scrollY, webkitConvertPointFromNodeToPage(), webkitConvertPointFromPageToNode()

这个名单肯定是不完整的，如有其它知晓的请留言。
以上布局最好的检查方法是在Chrome或Safari浏览器的时间轴面板查看。

---
layout: post
title: ie8下innerHTML报未知的运行时错误
category: f2e
---

> 在n.js中有一段代码是创建了一个p元素，然后innerHTML插入字符串到p中，今天在ie8中发现会报一个未知运行错误的bug

模拟其中的代码如下：

`
var pNode = document.createElement('p');
pNode.innerHTML = '<li>1111</li>';
`

在ie的debug工具中查看了下，发现原因如下:

**IE在对innerHTML进行写操作的时候会检查element是否具备做为这些内容中html对象容器的要求**

解决方案为使用 `div` 包裹插入的元素



---
layout: post
title: js带var变量和不带var变量区别
category: f2e
---

> 常被人问到var a=1和a=1的区别在哪里？今天就写篇文章说说这事。

<pre>var a=1;
b=1;
delete a;
delete b;
console.log(a);
console.log(b);
</pre>

其实 a 为全局变量，b为全局对象的一个属性

2者的区别在于：  
a是在当前作用域内声明变量。  
b是对属性赋值操作。它会首先查找当前作用域链的b，如果有给b赋值，如果没有在全局对象中创建b并且赋值

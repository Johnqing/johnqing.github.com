---
layout: post
title: 前端“三板斧”解耦俩三句
---

## css html

你有没有写过这样的代码？

```html
<style>
.item{
	font-size: 12px;
}
.item button{
	height: 100px;
}
</style>
<div class="item"><button></button></div>
```

写这样代码的人，也许考虑到html css的分离，但是你会当某一天，产品找到你，告诉你需要调整需求，按钮需要放在div外面，css的样式就需要完全重写。

但是假如 我们这样呢？

```html
<style>
.save-btn{font-size: 12px;height: 100px;}
</style>
<div class="item"><button class="save-btn"></button></div>
```

需求变化，我们只需要把按钮拿出就ok了。

## javascript

js的话，咱就拿jQuery说事吧！（对不起啊！）

你是否写过这样的代码：

```javascript
$('body .item .savebtn').css('color', '#f00');
```

突然有一天某人，找到你说：哥，按钮点了没用了！

你着急忙慌的，爬到电脑前按下F12，发现我擦 竟然报错了，结构被改动了！尼玛，谁动了爷的结构，导致js报错

想想那不堪回首的苦逼日子吧！

肿么解决呢？好办，看这里：

```javascript
$('[data-js="saveBtn"]').css('color', '#f00');
```

这样只要偷偷改你结构的某人不是把这个按钮弄没了 咱的代码 就不会有问题了

## 总结篇

其实这里，我想表达的是，尽量的减少html css js的耦合度并不一定是最优方案。我们要从后期的可维护性上触发，减少代码的耦合度。

可维护代码是开发者可以容易并且很自信地编写代码分，而不需担心这些修改会无意中影响到其它不相关部分。

阻止这样后果的最佳方式之一是，通过一组能够表达其义的，任何开发者碰到时能想出它的用途的，可预测的类选择器和自定义属性。

 

为了不让我们苦逼：

1. 在CSS和JavaScript里，优先考虑类选择器/自定义属性，而不是复杂的CSS选择器。
2. 命名组件要基于它们是什么，而不是它们在哪
3. 样式类选择器，行为可以使用自定义属性。或者样式和行为使用不同的类选择器



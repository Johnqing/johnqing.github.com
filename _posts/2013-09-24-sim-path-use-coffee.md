---
layout: post
title: 模拟Path导航效果
---

> 群里的某同学提到的一个小效果（一堆圈圈围绕一个圈圈的动画）

[Path模拟代码仓库](https://github.com/Johnqing/simPath)

俺用coffee写的。。大家忍忍凑合看吧。。

## 准备工作

+ jquery 一份
+ easing 一份（算法不好的孩子伤不起）

## api生成

那些东西要动起来，肯定是需要的

既然是设计到圆，当然要有弧度啊、角度啊、半径啊、神马的。。。

事件肯定是必不可少的

当然还有基本的速度

通过上面 整理出可用接口

+ menu 要动起来的元素
+ radius 半径
+ radian 弧度
+ event 事件
+ speed 速率


当然 还有调用方法的大圈圈，这个可用通过获取jq中的this取到

## 开写

写开个jq插件的头

{% highlight python %}
$.fn.paht = (opts) ->
	opts = $.extend {}, defaultConfig, opts
	# 没有按钮 直接返回
	if not opts.menu
		return @
	return
{% endhighlight %}

上面的就不解释了。。不同的 自切小jj吧！

下面需要缓存下 `$(this)` 和 `$(opts.menu)`

easArr 是用来存储缓动公式键名的，后面要用到

{% highlight python %}
pathItem = $(@)
menus = $ opts.menu
easArr = []
for k of $.easing
	easArr.push(k)
{% endhighlight %}

准备工作搞完了。。终于要进入正题了

{% highlight python %}
# 角度转弧度
radians = Math.PI/180

# 参数赋值
radius = opts.radius
radian = opts.radian
{% endhighlight %}

角度转弧度公式 是高中数学里的一个算法

{% highlight python %}
pathItem.on opts.event, ->
	return
{% endhighlight %}

如果在点击的时候有正在执行动画的元素，就不执行点击（防止重复点击bug）

{% highlight python %}
if $(opts.menu + ':animated').length
	return
speed = opts.speed
{% endhighlight %}

当弧度 不是360度的时候，改变算法，要在原来的length上减去1，这样才能保证位置的正确性，不然还是会环绕一周 

{% highlight python %}
len = len - 1 if radian isnt 360
len = menus.length
{% endhighlight %}

接下来 就是遍历这些要动起来的元素了和执行位置变化了，可以直接查看注释

{% highlight python %}
menus.each (i)->
	item = $(@)
	# 单个元素弧度算法 索引 * 传入的弧度 * 元素的个数 * 半径
	rd = i * radian / len * radians
	x = radius * Math.cos(rd) + 35
	y = radius * Math.sin(rd) + 35 

	# 随机不同效果
	rdNum = Math.floor(Math.random() * easArr.length)
	# 动画延时
	speed += i * 10

	# 旋转
	item.rotate()

	if item.is ':hidden'
		item.show().animate(
			top: [y, easArr[rdNum]]
			left: [x, easArr[rdNum]]
		, speed)
		return
	else 
		item.animate(
			top: [y, easArr[rdNum]]
			left: [x, easArr[rdNum]]
		)
		.animate(
			top: [35, easArr[rdNum]]
			left: [35, easArr[rdNum]]
		, speed, ->
			item.hide()
			return
		)
		return
{% endhighlight %}


---
layout: post
title: coffeescript 总结
---

## 注释

**三个 `#` 编译后会生成js里的多行注释 **

```python
# 你好

###
你好啊
###
```

## 变量定义

**全局变量可以通过 `global=@` 来获取，在顶级作用越中，this 相当与全局对象.**

{% highlight python %}
number   = 42
opposite = true
{% endhighlight %}

## 条件语句

{% highlight python %}
number = 100 if conditions

if conditions
	console.log true

else if conditions
	console.log 'else if'
else
	console.log false

{% endhighlight %}

### 三目运行

{% highlight python %}
number = if conditions then 0 else 1
{% endhighlight %}

## 函数

{% highlight python %}
func = ->
  2 * 2
{% endhighlight %}

### 带参数函数

{% highlight python %}
func = (x) ->
	x * x
{% endhighlight %}

> 我喜欢把函数里的内容换行显示，当然你也可以使他在一行显示

{% highlight python %}
func = (x) -> x * x
{% endhighlight %}

## Arrays

{% highlight python %}
# [1,2,3,4,5]
arr = [1...6]
{% endhighlight %}

你也可以这样：

{% highlight python %}
arr = [
	1
	2
	3
	4
	5
]
{% endhighlight %}


## Object

{% highlight python %}
obj = 
	k: 1
	k2: 2
	k3: 3
{% endhighlight %}

## 循环语句

1. 使用 for x in array
{% highlight python %}
for name in ['tom', 'jack', 'marry']
	console.log name
{% endhighlight %}
2. 循环加入索引
{% highlight python %}
for name in ['tom', 'jack', 'marry']
	console.log "#{name} - #{i}"
{% endhighlight %}
3. 数组循环的过滤
{% highlight python %}
for name, i in ['tom', 'jack', 'marry'] when i < 2
	console.log "#{name} - #{i}"
{% endhighlight %}
4. 使用 of 替代 in 关键字来迭代对象的全部属性，像 Ruby 中的 hash 迭代一样
{% highlight python %}
names =
	tom: 'man'
	marry: 'woman'

for name, sex of names
	alert "#{name} - #{sex}"
{% endhighlight %}

## 不允许编译

{% highlight python %}
`console.log(123)`
{% endhighlight %}

## 用=>来明确绑定好this，预防callback等方法导致this变换

{% highlight python %}
Account = (customer, cart) ->
	@customer = customer
	@cart = cart

	$('.shopping_cart').bind 'click', (event) =>
		# 这里的@customer会自动绑定上面的this
		@customer.purchase @cart 
{% endhighlight %}

## 使string保留源缩进, 多行string

{% highlight python %}
html = """
	<strong>
		cup of coffeescript
	</strong>
	"""
{% endhighlight %}

## 使用::可以让你直接接触类的prototype(可以编写类变量或者类方法,实例方法)

{% highlight python %}
# 位String类添加一个静态方法
String::dasherize = -> 
	this.replace /_/g, "-"
{% endhighlight %}
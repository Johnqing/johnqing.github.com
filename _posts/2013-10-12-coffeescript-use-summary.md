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

```python
number   = 42
opposite = true
```

## 条件语句

```python
number = 100 if conditions

if conditions
	console.log true

else if conditions
	console.log 'else if'
else
	console.log false

```

### 三目运行

```python
number = if conditions then 0 else 1
```

## 函数

```python
func = ->
  2 * 2
```

### 带参数函数

```python
func = (x) ->
	x * x
```

> 我喜欢把函数里的内容换行显示，当然你也可以使他在一行显示

```python
func = (x) -> x * x
```

## Arrays

```python
# [1,2,3,4,5]
arr = [1...6]
```

你也可以这样：

```python
arr = [
	1
	2
	3
	4
	5
]
```


## Object

```python
obj = 
	k: 1
	k2: 2
	k3: 3
```

## 循环语句

1. 使用 for x in array

```python
for name in ['tom', 'jack', 'marry']
	console.log name
```

2. 循环加入索引

```python
for name in ['tom', 'jack', 'marry']
	console.log "#{name} - #{i}"
```

3. 数组循环的过滤

```python
for name, i in ['tom', 'jack', 'marry'] when i < 2
	console.log "#{name} - #{i}"
```

4. 使用 of 替代 in 关键字来迭代对象的全部属性，像 Ruby 中的 hash 迭代一样

```python
names =
	tom: 'man'
	marry: 'woman'

for name, sex of names
	alert "#{name} - #{sex}"
```

## 不允许编译

```python
`console.log(123)`
```

## 用=>来明确绑定好this，预防callback等方法导致this变换

```python
Account = (customer, cart) ->
	@customer = customer
	@cart = cart

	$('.shopping_cart').bind 'click', (event) =>
		# 这里的@customer会自动绑定上面的this
		@customer.purchase @cart 
```

## 使string保留源缩进, 多行string

```python
html = """
	<strong>
		cup of coffeescript
	</strong>
	"""
```

## 使用::可以让你直接接触类的prototype(可以编写类变量或者类方法,实例方法)

```python
# 位String类添加一个静态方法
String::dasherize = -> 
	this.replace /_/g, "-"
```
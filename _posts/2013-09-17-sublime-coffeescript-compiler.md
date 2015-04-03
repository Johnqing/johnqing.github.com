---
layout: post
title: sublime配置coffeescript编译 
---

## 前提

保证以下工具已经安装成功

+ 保证nodejs安装成功
+ 保证npm安装成功

## 安装coffeescript

运行以下命令：

```
npm install coffee-script -g
``` 

## 安装sublime插件

使用 `ctrl + shift + p` 然后 `install package` 写入 `coffeescript` 回车结束

## 修改插件默认配置

工具栏中找到 `Preference -> Browse Package` 点击进入

在其中找到 coffeescript文件夹，并找到 `CoffeeScript.sublime-build` 文件，修改其为：

{% highlight json %}
{
    "cmd": ["coffee.cmd","-c","$file"],
    "file_regex": "^(*?):([0-9]*):?([0-9]*)",
    "selector": "source.coffee"
}
{% endhighlight %}
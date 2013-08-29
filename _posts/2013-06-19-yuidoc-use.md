---
layout: post
title: 如何使用YUIdoc生成api文档
---

> 鉴于本人java水平太差，而且jsdoc文档众多，还有就是最近项目中准备使用yuidoc，so...

来个大前提，俺们的机器都是windows，所以只能介绍windows下yuico的使用

####前提####
* 必须安装nodejs
* 必须安装npm

*木有安装可以用么？*

*滚！！！！*

####安装####

{% highlight html %}
npm -g install yuidocjs
{% endhighlight %}

时间略久!

####语法参考####

[YUIdoc语法参考](http://yui.github.io/yuidoc/syntax/index.html)

[YUIdoc文档整理](https://github.com/Johnqing/johnqing.github.com/wiki/yuidoc%E6%96%87%E6%A1%A3)

####Go####

cmd进入项目中：

**一次生成**
{% highlight html %}
yuidoc .
{% endhighlight %}

**实时生成**

在团队协作的时候，如果你懒得去配置本地服务器，
为了可以让其他成员方便的看到你的文档，可以使用YUIDoc快速构建webserver，
其他人就可以通过浏览器访问到你的API文档了，具体操作是在你使用前面提到的命令生成文档后，然后执行以下命令：
{% highlight html %}
cd out
yuidoc . --server 3000
{% endhighlight %}
上面的命令，首先是在cmd里把当前目录切换到out目录下，然后使用YUIDoc构建webserver监听端口7777，这里的端口可以是任意未被其他进程占用的端口，后面的操作就是防火墙为此端口放行，这样其他人就可以通过访问你的ip:端口看到你的API文档了。

####扩展阅读####
用yuidoc.json配置你的YUIDoc：http://yui.github.io/yuidoc/args/index.html#json

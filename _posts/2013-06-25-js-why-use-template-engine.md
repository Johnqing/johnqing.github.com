---
layout: post
title: 为什么使用JS模板引擎？
---

> 上一篇中介绍了，我自己开发的NTpl模板引擎。这篇主要介绍为什么要使用模板引擎？

##扯淡篇##

笔者：*你写过或者维护过大量的js么？*

某人：*木有*

笔者：*边上旁听去，下一个！*

某人2：*恩！*

笔者：*你是否碰到这样的问题，使用json和js拼接dom结构，来输出一小段模板，渲染页面？*

某人2：*有的*

笔者：*这段脚本有没有在不停的需求迭代中，越来越难维护？*

某人2：*嗯，非常烦躁！文件越来越大，维护起来越来越困难！*

笔者：*那你怎么不使用NTpl！*

某人2：*那是什么？*

笔者：*一个轻量级的js模板引擎*

##用例篇##

现在有这样一段json数据：

{% highlight css %}
var data = {
    name: 'NTpl.js',
    author: 'johnqing'
}
{% endhighlight %}

安装常规的思路拼接模板：

{% highlight css %}
var tpl = '&lt;h1&gt;'+data.name+'&lt;/h1&gt;&lt;span&gt;'+data.author+'&lt;/span&gt;';
{% endhighlight %}

现在看起来没有什么，加入有更复杂的呢？

而且维护在同一个js文件中，后期数据或者结构发生变化，需要重新修改这个js文件。

最早的时候某位大大，想到了使用一个方法去拆分数据、结构和核心代码:

数据：

{% highlight css %}
var data = {
    name: 'NTpl.js',
    author: 'johnqing'
}
{% endhighlight %}

结构

{% highlight css %}
var tpl = '<div>{name},blog:{author}</div>';
{% endhighlight %}

核心代码

{% highlight css %}
function tplCom(tpl, data){
    tpl = tpl.replace(/{(.*?)}/g,function($,$1){
        return data[$1] ? data[$1] : $;
    });
    return tpl;
}
console.log(tplCom(tpl, data));
{% endhighlight %}

但是这个实在太简陋了，看看俺的NTpl.js是如何实现的：

只要你调用NTpl.tpl填入模板和数据就会自动返回拼接完成的数据，快捷方便，自动化

{% highlight css %}
var res = NTpl.tpl(tpl, data);
console.log(res);
{% endhighlight %}

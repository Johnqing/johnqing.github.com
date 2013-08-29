---
layout: post
title: 你知道nodejs么？
category: f2e
---

来自：[Understanding node.js](http://debuggable.com/posts/understanding-node-js:4bd98440-45e4-4a9a-8ef7-0f7ecbdd56cb)

最近越来越多的听到大家讨论nodejs了，而且在招聘网站上也看到对node的要求，粗略看了一篇写的很好的文章。决定翻译一下，希望他能帮助你理解node.js：

我介绍Node.js给人们时通常有两种反应：或者立即理解，或者十分困惑。

你如果也是第二种，我尝试解释一下node.js：

1. 它是一个命令行工具。你下载了源代码，编译，安装。
2. 它让你执行JavaScript项目通过在你的后端上输入'node my_app.js'.
3. JS 通过 V8 javascript 引擎(http://code.google.com/p/v8/ 使得chrome浏览器如此之快的东西)执行 .
4. Node提供了一个JavaScript API访问网络和文件系统。

**"但我可以用ruby, python, php, java, … !"做我需要的一切**

我听到了。嗯，你是对的。抱歉，Node不是仙女会帮解决你所有的工作。它仅仅是一个工具，而且它可能还不能替代你现在的工具，至少现在不行。

**"说重点!"**

好的。当你需要同时处理几件事情时Node 将很有用。你曾经有没有写过一些代码，并且说“我想这段代码并行”?好的，在node里，所有的东西都是并行的，除了你的代码。

**"神马?"**

是的，你没听错。所有的东西都是并发运行，除了你的代码。为了理解这点，将您想象为国王，而node是国王的佣人群。

一切起始于，一个佣人唤醒国王，并且询问国王他是否需要什么。国王给这个佣人一个任务列表，然后回去多睡一会儿。佣人现在分发这些任务给他的伙计，他们开始工作了。

一旦一个佣人完成一项任务，他就在国王门外排队报告。国王一次见一位佣人，听他报告的事情。有时，国王会给这位佣人更多的任务。

感觉很棒，因为国王的佣人并发执行他所有的任务。但一次仅报告一个结果，所以国王做事情能更加专注。(简单的暗喻, 现实中很难给非阻塞找到合适的概念。)

**"这很棒, 但你能不能不要给我这么幼稚的解释?"**

当然，一个node程序的例子，如下：

<pre>
var fs = require('fs')
, sys = require('sys');
fs.readFile('treasure-chamber-report.txt', function(report) {
    sys.puts("oh, look at all my money: "+report);
});
fs.writeFile('letter-to-princess.txt', '...', function() {
    sys.puts("can't wait to hear back from her!");
});
</pre>

你的代码给node两项任务：读和写文件，然后它休眠。一旦node完成一项任务，它的回调函数就会被触发。但是一次只能触发一个回调函数，直到回调函数执行完毕了，所有其它回调函数都在排队.除了这点，不能保证下一步触发哪个回调函数。

**"所以，我不用担心代码同时访问同一个数据结构吗?"**

对的!这正是JavaScript 单线程/事件循环设计的美妙之处。

**"很好, 但我为什么要用它?"**

一个原因是效率。在web应用中，你主要的response开销，通常是执行数据库查询时间的总和。用node，你能执行立即所有的查询，response时间减少为最慢查询的时间。

另一个原因是JavaScript。使用node，你能在浏览器和后端之间分享代码。JavaScript也变成真正通用的语言了。不管你过去用python,ruby,java,php… 你一路上都拾起了一些JS，对不?

最后一个原因是原始速度。在这个星球上最快的动态语言中，V8不断刷新纪录。我想不起来其它语言像JavaScript一样不停提升速度。除了这点，node的I/O 工具非常轻量级， 尽可能让你更贴近你系统的完整I/O能力。

**"所以你是说我从今往后应该用node写我的apps了?"**

是也不是。一旦你舞起node铁锤， 所有事情都迎刃而解(像变成了钉子)。但如果正赶工期处理一些事情，你可能需要考虑一下：

低响应时间/高并发重要吗?node很善于处理这些。

项目有多大?小项目没有问题。大项目应该谨慎衡量一下。(修复bug或上游等等，可用的库，资源).

**"node在windows上能运行吗?"**

可以，目前最新的node可以直接下载安装到windows上。(注：作者原文发稿时，还不行)

**"在node中我能访问DOM吗?"**

好问题!不行，DOM是浏览器的东西，node的JS引擎(V8)幸好和这些东西是完全分离的。但是，有人在实现 the DOM as a node module, 它有可能开启让人兴奋的局面，例如单元测试客户端代码。

**"事件驱动程序真的很难吗? 理解node.js的事件驱动么"**

那就看你的水平。如果你已经学会如何在浏览器中调用AJAX，和用户事件，使用node应该不成问题。

不管怎么样，用可维护设计，测试驱动开发能真的帮助你开始。

**"谁在用它?"**

有一个小型未完成列表：

node wiki ("Companies using Node"下拉框). URL.http://wiki.github.com/ry/node
Yahoo给YUI实验node. URL.http://www.yuiblog.com/blog/2010/04/09/node-js-yui-3-dom-manipulation-oh-my/
Plurk 用于 massive comet. URL.http://www.plurk.com/
Paul Bakaus (jQuery UI fame) 建立 mind-blowing game engine 后端有部分采用node. URL.http://ajaxian.com/archives/aves-game-engine
Joyent 雇用了 Ryan Dahl (node的创建人) 而且大量赞助开发. URL.http://www.joyent.com/
对了，Heroku 宣称 (实验性) hosting 也支持 node.js.
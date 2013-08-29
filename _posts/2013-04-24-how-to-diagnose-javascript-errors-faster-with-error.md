---
layout: post
title: （转）如何更快的诊断 JavaScript 错误
category: js
---

英文原文：[How to diagnose JavaScript Errors Faster with Error](http://www.codeproject.com/Articles/541695/How-to-diagnose-JavaScript-Errors-Faster-with-Erro)

> 就如IE10一样的大多数最新的浏览器，都支持允许Web开发者更快地诊断和修正bug的错误栈功能，尤其是对那些较难重现的bug。开发者可以使用现在新浏览器强大的Web平台兼容性开发出和Windows8里面的app一样充满惊喜的APP。APP的强大和复杂的增长意味着开发者需要更好的工具来处理错误和诊断bug，如错误栈。在这篇文章里，我会演示一些简单的调试技术以帮助你节省时间。

##调试程序##

在Javascript中，结构化的异常处理通常可以通过异常的抛出和try/catch (开发人员可以定义一个错误，并通过一个控制程序处理这个错误)。当一个异常被抛出的时候，IE8的Javascript引擎Chakra可以捕捉到出错的位置和一系列的调用链，通常也被称为调用栈，如果一个错误对象被抛出（或者是一个原型链导致错误的函数）, Chakra会为这个错误对象建立一个可读性比较好的列表来表现这个调用栈，这个栈包含了出错信息，函数名称以及在源文件中出错的行数。这些信息可以帮助开发人员可以通过查看被调用的函数快速的诊断程序中的缺陷，甚至可以直接看出哪行是有问题的代码，比如它可以指出传入某个函数中的参数是一个空值或者无效参数。

让我们来看下一个简单的示例脚本：计算（0,2）和（12,10）两点之间的距离：

<pre>
(function () {
    'use strict';
    function squareRoot(n) {
        if (n < 0)
            throw new Error('Cannot take square root of negative number.');
        return Math.sqrt(n);
    }

    function square(n) {
        return n * n;
    }

    function pointDistance(pt1, pt2) {
        return squareRoot((pt1.x - pt2.x) + (pt1.y - pt2.y));
    }

    function sample() {
        var pt1 = { x: 0, y: 2 };
        var pt2 = { x: 12, y: 10 };

        console.log('Distance is: ' + pointDistance(pt1, pt2));
    }
    try {
        sample();
    }
    catch (e) {
        console.log(e.stack);
    }
})();
</pre>

![queue](http://static.oschina.net/uploads/img/201302/14085513_P540.png)

这段脚本有一个bug，它忘记了计算两个不同坐标之间差的平方。对于一些点的输入，函数pointDistance会返回错误的结果；其次，它会导致一个错误。要理解栈跟踪，我们在浏览器的开发者工具（F12激活）中的脚本标签中检查：

栈跟踪信息会在catch子句中记录到控制台中，同时，因为它是栈的最上方，它很容易就能看出来错误来源是在函数squareRoot。要调试这个问题，开发者一般不会在栈跟踪中挖得太深；函数squareRoot的前置条件已经违反了，同时往上一层看调用栈，它已经很清楚的表明：在调用squareRoot的子表达式同时需要是函数square的参数。

当调试的时候，通过在栈里设置一些断点能够帮助分析代码。请记住，还有其他方法去观察调用栈：举例来说，如果你设置了脚本调试器“在捕获异常时停止”模式，你就可以使用调试器来检查调用栈。对于已经发布了的程序，你可能考虑到把可能有问题的代码封装到try/catch块里，以便于捕获错误的调用，同时吧错误信息记录到你的服务器中。然后开发者能够观察调用栈信息来帮助隔离问题的区域。

##DOM 异常和错误栈##

我前面提到过一个对象存在抛出时必须是有一个错误或者是一个可以追溯错误的原型链，这是有意为之的。javascript支持任何对象甚至是原型对象做为一个异常抛出，当这些对象都可以被捕获或者检查时，他们并非都是带有专门设计的包含错误或者特征信息的对象，因此，当抛出异常时，只有错误异常才会更新一个堆栈的属性。

虽然DOM异常也是对象，但他们没有追溯错误的原型链，因此他们就没有一个堆栈属性。当你执行DOM操作并且想显示出javascript兼容性的一些错误时，你可以在DOM操作代码上使用try/catch代码块，然后在catch语句内抛出一个新的异常:

<pre>
function causesDomError() {
    try {
        var div = document.createElement('div');
        div.appendChild(div);

    } catch (e) {

    throw new Error(e.toString());

    }
}
</pre>

然而，你可能考虑你是否想用这种模式，它可能适用于那些通用库的开发；尤其是，考虑到你的代码意图是否想隐藏DOM的操作，或者是简单的执行一个任务。如果是隐藏DOM的操作，包裹操作部分并且抛出错误可能是最好的方式吧。

##性能考虑##

当错误对象被抛出时，开始堆栈跟踪的构造；这样做需要追踪到当前执行的堆栈。为了防止在遍历一个大堆栈（或许是一个递归堆栈）时的性能问题，默认的情况下IE只收集前十的堆栈帧，当然这个设置可以配置，你可以设置静态属性Error.stackTraceLimitto为其他的值。这个配置是全局的，并且必须在错误抛出之前设置，否则它不会产生跟踪堆栈的效果。

##异步的异常##

当一个堆栈跟踪产生于一个异步的回调时（比如，timeout,interval, 或者XMLHttpRequest），异步调用，而不是在调用堆栈的底部创建异步调用的代码。这里存在一些跟踪问题代码的潜在影响：如果你对于多个异步回调使用相同的回调函数，你或许会发现很难查找出某一个单独的回调引起的错误。让我们稍微修改下之前的例子，替换直接调用simple()，采用timeout函数回调方法调用：

<pre>
(function () {
    'use strict';
    function squareRoot(n) {
        if (n < 0)
            throw new Error('Cannot take square root of negative number.');

        return Math.sqrt(n);
    }

    function square(n) {
        return n * n;
    }

    function pointDistance(pt1, pt2) {
        return squareRoot((pt1.x - pt2.x) + (pt1.y - pt2.y));
    }

    function sample() {
       var pt1 = { x: 0, y: 2 };
       var pt2 = { x: 12, y: 10 };

       console.log('Distance is: ' + pointDistance(pt1, pt2));
    }

    setTimeout(function () {
        try {
            sample();
        }
        catch (e) {
            console.log(e.stack);
        }
    }, 2500);
})();
</pre>

在执行这段代码时，你会看到堆栈跟踪稍微有些延迟，这次你也会看到堆栈的底层不是全局的代码而是一个匿名函数。实际上，它们不是使用同一个匿名函数，而是回调函数传递给setTimeout，由于你失去了回调的上下文环境，你也就无法确认哪个回调被调用了。如果你考虑这样的一个场景，一个回调被注册到多个不同按钮的点击事件上，你将无法确认引用的是哪个注册的回调。那就是说，这个限制只是次要的，因为在大多数情况下，堆栈顶部会突出问题区域。

##探索测试驱动例子##

![queue](http://static.oschina.net/uploads/img/201302/14085515_GwkS.png)

在windows8系统下使用IE10检查这个测试例子Test Drive demo。你可以使用eval执行代码，如果发生了错误，你能及时检查到它。如果你在IE10下运行它，当你把鼠标放在错误堆栈上时，错误代码行会突出显示。你可以在代码区自己输入代码，或者在列表中例子里选择一个。你也可以在运行示例代码时设置Error.stackTraceLimitvalue。

作为参考资料，你可以浏览MSDN关于 Error.stack 和 stackTraceLimit的文档。

这篇文章作者是Rob Paveza. Rob是IE团队的一个项目经理，主要研究Chakra，一个新型的javascript运行引擎。

[原文地址](http://www.oschina.net/translate/how-to-diagnose-javascript-errors-faster-with-error)
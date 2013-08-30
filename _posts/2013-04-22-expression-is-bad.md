---
layout: post
title: expression到底多影响性能
---

> 很多人不理解为什么expression会影响性能？给出一个曾经写的测试的例子。

请在低版本IE测试：[Demo](http://johnqing.github.io/demo/expression.html)

代码如下：

**CSS:**

<pre>
body {
    font-size:12px;
    font-family:Verdana;
    line-height:1.9
}
div a {
    display:block;
    border:1px solid #FF3366;
    width:expression(
        test()
    );
}
</pre>

**HTML：**

<pre>
计算了<input id="c" />次
<div>
    <ul>
        <li><a href="#">测试</a></li>
        <li><a href="#">测试</a></li>
        <li><a href="#">测试</a></li>
        <li><a href="#">测试</a></li>
    </ul>
</div>
</pre>

**JS：**

<pre>
var k = 0;
function test() {
    k++;
    document.getElementById('c').value = k;
    return;
}
</pre>
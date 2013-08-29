---
layout: post
title: expression到底多影响性能
category: css
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
计算了&lt;input id="c" /&gt;次
&lt;div&gt;
    &lt;ul&gt;
        &lt;li&gt;&lt;a href="#"&gt;测试&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="#"&gt;测试&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="#"&gt;测试&lt;/a&gt;&lt;/li&gt;
        &lt;li&gt;&lt;a href="#"&gt;测试&lt;/a&gt;&lt;/li&gt;
    &lt;/ul&gt;
&lt;/div&gt;
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
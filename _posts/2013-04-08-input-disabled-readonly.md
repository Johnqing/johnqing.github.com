---
layout: post
title: input disabled和readonly区别
category: f2e
---

> 很多人疑惑disabled和readonly有什么区别？

<pre>&lt;form action=""&gt;
&lt;input type="text" disabled name="us" value="1"&gt;
&lt;input type="submit" value="click"&gt;
&lt;/form&gt;
</pre>

点击click会提交表单，在input有disabled属性的时候，提交数据为空。  
去掉后显示正常。

<pre>&lt;form action=""&gt;
&lt;input type="text" readonly name="us" value="1"&gt;
&lt;input type="submit" value="click"&gt;
&lt;/form&gt;
</pre>

点击click提交表单，显示正常。

**总结**


1. disabled：value 不会在 Form 提交时发送出去。外观为灰色。  
2. readonly：value 会在 Form 提交时被发送出去。外观显示正常。

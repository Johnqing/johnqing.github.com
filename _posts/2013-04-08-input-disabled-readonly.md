---
layout: post
title: input disabled和readonly区别
---

> 很多人疑惑disabled和readonly有什么区别？

{% highlight javascript %}<form action="">
<input type="text" disabled name="us" value="1">
<input type="submit" value="click">
</form>
{% endhighlight %}

点击click会提交表单，在input有disabled属性的时候，提交数据为空。  
去掉后显示正常。

{% highlight javascript %}<form action="">
<input type="text" readonly name="us" value="1">
<input type="submit" value="click">
</form>
{% endhighlight %}

点击click提交表单，显示正常。

**总结**


1. disabled：value 不会在 Form 提交时发送出去。外观为灰色。  
2. readonly：value 会在 Form 提交时被发送出去。外观显示正常。

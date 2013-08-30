---
layout: post
title: git push重复输入password的解决方案
---

> 在使用github push文件时，总是出现重复输入用户名 密码，不胜其烦。

解决方案如下：

1. 配置环境变量：    
![配置环境变量](https://f.cloud.github.com/assets/2571697/1013749/2df9eccc-0b98-11e3-9b88-3ed1087c25b5.jpg)
2. 在用户文件夹，如C:\Users\johnqing下新建一个名为 `_netrc` 的文件。(该文件无法手动建立，需在命令行中输入 `edit _netrc` )
3. 在其中写入：    
{% highlight javascript %}
machine github.com
login yourUserName
password yourPWD
{% endhighlight %}

###注意###

由于用户名/密码都是明文保存，请注意密码泄露。

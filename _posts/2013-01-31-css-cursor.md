---
layout: post
title: css cursor自定义
category: css
---

<pre>cursor:url(http://localhost/d2/matches.cur),url(http://localhost/d2/matches.cur),n-resize;
</pre>

>cur文件必须为32*32，否则个浏览器表现差异很大

1. IE6也支持cursor属性的URL值，然而，IE只支持CUR和ANI的格式。
2. IE不支持CSS3的坐标。这时候光标图片将被忽略。
3. Firefox1.5 (Gecko1.8), Windows and Linux和Safari3.0 (Webkit522-523)支持.cur | .png | .gif | .jpg和xy坐标值。
4. Firefox4.0 (Gecko2.0)支持.cur | .png | .gif | .jpg | .svg，(Gecko 2.0)支持xy坐标值。
5. opera不支持.

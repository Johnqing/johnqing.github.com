---
layout: post
title: getBoundingClientRect
---

getBoundingClientRect获取元素相对于浏览器视窗的位置，其中包含：height, width, left, bottom, right, top

关于兼容性MDN上是这么写的：

>  In IE8 and below, the TextRectangle object returned by getBoundingClientRect() lacks height and width properties. Also, additional properties (including height and width) cannot be added onto these TextRectangle objects.

大概意思是ie8以下不会返回width/height

我们写个简单的demo做下测试：

```
<!DOCTYPE html>
<!--[if lt IE 7 ]><html class="ie6" lang="zh-cn"><![endif]-->
<!--[if IE 7 ]><html class="ie7" lang="zh-cn"><![endif]-->
<!--[if IE 8 ]><html class="ie8" lang="zh-cn"><![endif]-->
<!--[if IE 9 ]><html class="ie9" lang="zh-cn"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><html class="" lang="zh-cn"><!--<![endif]-->
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>test</title>
</head>
<body>
<div id="text"></div>
<script>
var obj = document.getElementById('text');
var rect = obj.getBoundingClientRect();
var a = [];
for(var i in rect){
  a.push(i + ':' + rect[i]);
}
document.write(a.join('<br>'));
</script>

</body>
</html>

```

#### chrome：
```
height:0
width:1215
left:8
bottom:8
right:1223
top:8
```

#### ie9:
```
bottom:8
height:0
left:8
right:1912
top:8
width:1904 
```

#### ie8:
```
right:1908
top:8
bottom:8
left:8
```

#### ie7:
```
right:1891
top:17
bottom:17
left:12 
```

#### ie6:
```
right:1662
top:17
bottom:17
left:12 
```


# 得到结论：

MDN给出的答案是正确的

但是我们还要考虑在定位的情况下回出现神马情况？

由于本人太懒就不发测试代码以及结果啦！

答案：
在ie6下`position`都按照木有定位的情况返回，其他浏览器正常

---
layout: post
title: 跨域iframe高度自适应
---

> 好久没写了，今天来写一遍关于前段时间遇到的一个关于iframe跨域高度自适应的问题

## 前提
+ a嵌套b
+ 有 a,b 2个域
+ a、b 2个域均可操作

## 开始

+ a页面中写入iframe
+ 在a页面的同域下，创建一个`proxy.html`，用来做代理页面,代码如下：

```html
<!DOCTYPE html>
<html>
<head>
<title>proxy</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
<body>
<script>
(function() {
    var getReq = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)","i"),
                r = window.location.search.substr(1).match(reg);
            return (r!=null)?  unescape(r[2]) : null;
        },
        height = getReq("data-frameheight");
    try {
        var el = window.top.document.getElementById(getReq("data-frameid"));
        if (!el) return;
        el.style.height = height + 'px';
    }
    catch (e) {
        //
    }
})();
</script>
</body>
</html>
```

+ 在b域中引入一段脚本,代码如下

```javascript
(function() {
  var IframeProxy, body, ctFrame, doc, getConf, getReq, onBind, scriptNode, scripts, window;

  window = this;

  doc = window.document;

  body = doc.body;

  ctFrame = function() {
    var el;
    el = doc.createElement('iframe');
    el.style.display = 'none';
    el.name = 'qPay-proxy';
    return el;
  };

  onBind = function(evType, callback) {
    if (doc.addEventListener) {
      window.addEventListener(evType, callback, false);
      return;
    }
    window.attachEvent("on" + evType, callback);
  };

  getReq = function(param) {
    var regArr, rgx;
    rgx = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    regArr = window.location.search.substr(1).match(rgx);
    if (regArr !== null) {
      return unescape(regArr[2]);
    } else {
      return null;
    }
  };

  scripts = doc.getElementsByTagName('script');

  scriptNode = scripts[scripts.length - 1];

  getConf = function(param) {
    var pm;
    pm = scriptNode.getAttribute(param);
    if (pm) {
      return pm;
    } else {
      return getReq(param);
    }
  };

  IframeProxy = function() {
    this.height = 0;
    this.frameId = getConf('data-frameid');
    this.time = getConf('data-time');
    this.proxyPath = getConf('data-proxy');
    this.proxyIframe = ctFrame();
  };

  IframeProxy.prototype = {
    init: function() {
      var self, _init;
      self = this;
      _init = function() {
        body.appendChild(self.proxyIframe);
        self.reSetHeight();
        if (self.time) {
          self.time = self.time < 500 ? 500 : self.time;
          return window.setInterval(function() {
            if (body.offsetHeight !== self.height) {
              return self.reSetHeight();
            }
          }, self.time);
        }
      };
      return onBind('load', _init);
    },
    /*
    * 重设高度
    */

    reSetHeight: function() {
      var self;
      self = this;
      self.height = body.offsetHeight;
      self.proxyIframe.src = self.proxyPath + '?data-frameid=' + self.frameId + '&data-frameheight=' + (self.height + 40);
    }
  };

  (new IframeProxy()).init();

}).call(this);
```

刷新页面即可

## 原理 

+ a页面和proxy.html 属同域，也就是说 proxy.html 内的脚本可以操作 a页面中的iframe
+ b页面中引入的脚本获取b页面的高度后，在页面中插入一个iframe引入proxy.html并带参数（http://a.com/proxy.html?height=100）
+ proxy.html通过获取url中的高度来修改a页面的高度

> 当然嵌入的页面，也有不可控的

## 不可控第三方页面 高度修改
可以通过服务端获取html dom，这里我使用熟悉的php

```php
<?php
	$url = 'http://www.liuqing.pw';
	$doc = new DOMDocument();
	$doc->loadHTMLFile($url);
	 
	$dom_excontent = $doc->getElementById('home');
	 
	$newdoc = new DOMDocument();
	$cloned = $dom_excontent->cloneNode(TRUE);
	$newdoc->appendChild($newdoc->importNode($cloned,TRUE));
	echo $newdoc->saveHTML();
?>
```

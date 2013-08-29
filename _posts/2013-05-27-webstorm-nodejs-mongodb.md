---
layout: post
title: 使用webstorm搭建nodejs+mongodb环境
category: f2e
---

> 你还在为启动n个cmd窗口烦恼么？使用webstorm搭建nodejs+mongodb环境，轻松帮你解决。

*nodejs是神马？*

*靠！去[这里看](http://johnqing.github.io/posts/nodejs-01.html)*

*明白了，mongodb是啥？*

*。。。[这里，这里](http://johnqing.github.io/posts/nodejs-05.html)*

*webstorm是啥？*

*滚！*

##webstorm + nodejs##
*请大家打开webstorm*

*擦，快点。。打开半小时了！*

*额，好吧。。*

项目中创建一个**test.html**

<pre>
//导入http模块
var http = require('http');

http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('Node');
    res.end('hello world');
}).listen(8080);

console.log('success');
</pre>

webstorm中设置，上图：

![-1](https://f.cloud.github.com/assets/2571697/566237/a6df29e0-c679-11e2-9fb1-0af71407fe09.jpg)
![222](https://f.cloud.github.com/assets/2571697/566240/f593a76e-c679-11e2-9a81-d4798705a33b.jpg)

这里选择**Node.js**

![3333](https://f.cloud.github.com/assets/2571697/566254/850dce4c-c67a-11e2-8950-3350343f69c9.jpg)

这里选择的是启动文件，我们选择上面创建好的**test.js**,保存后，可以看到一个播放按钮和爬虫，点击播放按钮，启动程序

打开浏览器，并输入127.0.0.1:8080

##webstorm + mongodb##

+ ctrl+alt+s打开setting菜单
+ 找到external tools
+ 点+号，在tool setting里填空

program -> 外部命令所在位置，填入mongodb的完整路径**注意这里选择mongod.exe**

parameters -> 参数，这里设为 $Prompt$运行命令时表示弹个窗口让你输入

最后给这个命令起个名字，叫mongod保存完事，在顶部菜单找到tools就可以看到刚保存的mongod。

点击它就会弹出个窗口，输入**--dbpath d://xx**试试吧。

##快捷键绑定##

+ ctrl+alt+s打开setting菜单
+ 找到keymap
+ 找到external tools
+ 找到mongod，点击右键绑定快捷键


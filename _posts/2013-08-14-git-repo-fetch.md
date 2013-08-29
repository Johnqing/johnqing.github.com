---
layout: post
title: github fork项目后，代码更新
---

##协助约定##

1. 每个人都可以fork一份自己的repo，所有的修改都在自己私有的repo上进行；
2. 修改完成，测试通过后通过给主repo发pull request请求合并；
3. 主repo（Johnqing/n.js）的管理团队收到pull request请求后，review代码，合并进来；
4. 个人的repo需及时和主repo保持同步；

##第1步：fork一份自己的repo##

打开Johnqing/n.js在Github上的主页（https://github.com/Johnqing/n.js)，在右上角点击“fork”就可以fork一份自己的repo，现在我们就有了一份自己的repo，接下里我们的操作都是基于自己的repo

##第2步：clone自己的repo##

上面我们fork了自己的repo，接着就可以clone下来了，先到自己的repo主页（https://github.com/ispxin/n.js），找到repo的git地址，诸如这样 https://github.com/ispxin/n.js.git,然后clone到本地

<pre>
	git clone https://github.com/ispxin/n.js.git
</pre>

##第3步：查看和添加远程分支##

我们接着cd到项目里，看下当前的git远程仓库，如下

<pre>
	cd n.js
	git remote -v
</pre>

可以看到当前的项目里有一个叫'origin'的远程仓库（就是我们刚刚clone的时候加入的），
为了能很好的和主仓库（Johnqing/n.js）保持代码同步，我们需要添加一个主仓库的远程仓库，命令如下

<pre>
	git remote add Johnqing https://github.com/Johnqing/n.js.git
	git remote  -v
</pre>

好了，到这里仓库就添加完成了，为了保持和主仓库的代码一致，我们接着需要获取下主仓库的最新代码。

##第4步：获取主仓库最新代码##

<pre>
	git fetch Johnqing
</pre>

##第5步：合并到自己的分支里##

<pre>
	git merge Johnqing/master
</pre>

##第6步：本地修改代码，提交到自己的repo##
修改完后
<pre>
	git add .
	git commit -m "本次修改描述"
</pre>

最后我把本次修改提交到自己的远程仓库（ispxin/n.js）中，操作如下

<pre>
	git push origin master
</pre>

##第7步：给主repo发pull request##

提交到自己repo后，就可以给主repo发一个请求合并的pull request，操作步骤是这样的:

打开https://github.com/ispxin/n.js，点击“pull request”的界面，添加详细的描述信息后

##第8步：主repo收到pull request后，可以merge进来##

这个可以review修改，如果没问题就可以直接“Merge pull requst”，merge后就可以在主仓库看到了
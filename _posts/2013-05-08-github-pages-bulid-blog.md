---
layout: post
title: 使用github pages构建自己的blog
---

##前提##

+ 熟悉markdown语法（博文全部是靠markdown书写）
+ 你要创建自己的github账号，并且邮箱验证通过
+ 本地安装[git](http://johnqing.github.com/soft/Git-1.8.1.2-preview20130201.exe)

##开始##

1. 在登录状态下点击右上角**Create a new repo**
2. 在**Repository name**内输入**&lt;user-id&gt;.github.com**，user-id为你的用户名
3. **Initialize this repository with a README**记得勾选上哦~
4. 点击**Create repository**按钮
5. 运行git bash输入 **git clone https://github.com/&lt;user-id&gt;/&lt;user-id&gt;.github.com.git
6. 继续运行 **cd &lt;user-id&gt;.github.com**
7. 运行 **explorer .** 打开当前文件夹
8. 创建index.html
9. git bash 里运行 **git add .**
10. 运行 **git commit -m "这里写注释"**
11. 运行**git push origin master**，接着输入用户名、密码
12. 访问**&lt;user-id&gt;.github.com**

##使用jekyll##

*这里只教大家使用博主使用的jekyll模板*

1. git bash 下，运行**git clone https://github.com/Johnqing/johnqing.github.com.git**
2. 运行 **cd johnqing.github.com**
3. 运行 **explorer .** 打开当前文件夹
4. 删除隐藏文件**.git**
5. 删除**_post**下的所有文件
6. 全选所有文件
7. 复制到你自己的**&lt;user-id&gt;.github.com**文件夹
8. 找到**_config.yml**修改相应内容
9. 执行*开始*步骤的9、10、11、12

##简单介绍##

1. **_post**文件夹内是博文文件，必须是markdown格式文件
2. 博文文件头部必须有分类、描述等
{% highlight html %}
---
layout: post
title: 标题
category: 分类
---
{% endhighlight %}
3. **_config.yml**是配置文件，所有相关配置都在这里
4. **_layout**文件夹是模板文件
5. **category**文件夹是分类列表模板文件
6. **assets**文件夹是静态资源文件

##域名绑定##

根目录下创建**CNAME**文件，写入你的域名

> 有问题可以留言给我~

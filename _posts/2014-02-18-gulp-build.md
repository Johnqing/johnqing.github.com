---
layout: post
title: gulp使用说明
---

> grunt 是目前最流行的前端构建工具，但是学习成本一直让很多人望而却步。如果你也是come on baby~来学习gulp吧！

##如何安装gulp？##

```
npm install -g gulp
```

想要使用Gulp.js构建您的工程，需要在工程目录中安装Gulp.js的依赖

```
npm install --save-dev gulp gulp-util
```

--save-dev 命令配置，可以自动在工程目录的package.json文件内生成包依赖信息，比如：

```
{
  "devDependencies": {
    "gulp-util": "~2.2.14",
    "gulp": "~3.5.2"
  }
}
```

##如何配置包？##

package.json是npm的包配置文件，可以通过以下命令构建（当然一定要安装node）：

```
npm init
```

运行上面的命令，会提示你一步一步构建完整的package项。

package中比较重要的属性解释：

+ name：模块名
+ description：模块描述
+ version：当前模块的版本号
+ author：模块作者信息
+ contributors：贡献者人员信息
+ dependencies：依赖的模块，NPM就是通过这个属性来解决模块之间的依赖问题的
+ devDependencies：同上，不过这里的依赖的模块要多些
+ keywords：模块关键字，方便你使用npm search查找到它
+ repository：模块文件保存地址，那些贡献者们就能下载到它的源码了
+ main：其中”main”: “index”,表示Node.js在调用某个模块的时候，将寻找main指向的路径作为模块的接口，在这里Node将寻找同目录下的index文件，并尝试从它那加载模块；如果没有main，Node还是会尝试寻找index.js或者index.node作为包的接口。
+ bin：模块的可执行文件路径
+ scripts：这个不清楚作什么用？
+ dist：模块的指纹，可用来验证模块的完全性

##如何构建gulp##

首先说一下我的目录结构：

```
js
  a
    a.js
    b.js
  c
    c.js
    main.js
```

第二步，在根目录下构建package.json和gulpfile.js：

+ package.json使用默认构建完成是没有devDependencies这个属性的，手动添加下面代码块内容，并且运行npm install命令
{% highlight json %}
"devDependencies": {
    "gulp": "*",
    "gulp-uglify": "*",
    "gulp-concat": "*",
    "gulp-imagemin": "*"
}
{% endhighlight %}
+ gulpfile.js：Gulp 仅有 5 个方法就能组合出你需要的任务流程：task, run, watch, src, dest。

##如何配置gulpfile.js？##

继续重复烦人的话，gulp是基于nodejs，语法也类似于nodejs，所以gulpfile中，需要载入需要的模块：

```javascript
var gulp = require('gulp');
// 依赖
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
```

上面就是最基本的配置了。

**任务篇**

做为一个以美著称的职位，所以我把需要编译的文件整理到一个对象里（强迫症啊）：

```javascript
var paths = {
  scripts: ['js/**/*.js'],
  images: 'img/**/*'
};

```

写完这些还要神马呢？

对了，需要任务嘛！！

```javascript
gulp.task(name,[deps], fn);
```

小插曲：

`gulp.task`，支持三个参数：

+ name 任务名 （这个不填的请靠墙切jj去）
+ deps 依赖 类型:数组  可以不靠别人的~~~
+ fn   任务执行函数 这个不填 gulp就蛋疼了。。


```javascript
gulp.task('scripts', function(){

  return gulp.src(paths.scripts) //src 目录机构
      .pipe(uglify())            //js压缩
      .pipe(concat('all.min.js')) // js合并
      .pipe(gulp.dest('dest/js')) // 文件生成目录
});


gulp.task('images', function() {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({optimizationLevel: 5})) // optimizationLevel图片压缩级别
    .pipe(gulp.dest('dest/img'));
});
``` 

最后，调用这些任务：

```javascript
gulp.task('default', ['scripts', 'images']);
```

当然最后要运行起来

```
gulp
```

+ [demo地址](https://github.com/Johnqing/gulp-demo)
+ [gulp官网](http://gulpjs.com/)
+ [gulp拓展](http://gulpjs.com/plugins/)
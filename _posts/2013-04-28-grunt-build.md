---
layout: post
title: grunt构建工具使用说明
category: f2e
---

*Grunt 是一个基于任务的 JavaScript 项目命令行构建工具，运行于 Node.js 平台。Grunt 能够从模板快速创建项目，合并、压缩和校验 CSS & JS 文件，运行单元测试以及启动静态服务器。*

##如何安装grunt？##

[点击查看](https://gist.github.com/Johnqing/5140671)

##如何配置包？##

package.json是npm的包配置文件，可以通过以下命令构建（当然一定要安装node）：

<pre>
npm init
</pre>

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

##如何构建grunt##

首先说一下我的目录结构：

<pre>
assets //资源文件目录
    seajs
    init //模块文件
    common
</pre>

第二步，在assets下构建package.json和Gruntfile.js：

+ package.json使用默认构建完成是没有devDependencies这个属性的，手动添加下面代码块内容，并且运行npm install命令
<pre>
"devDependencies": {
    "grunt": "~0.4.1",
    "grunt-cmd-transport": "~0.2.0",
    "grunt-cmd-concat": "~0.2.0",
    "grunt-contrib-uglify": "~0.2.0",
    "grunt-contrib-clean": "~0.4.0"
}
</pre>
+ Gruntfile.js：注意这里的G必须是大写，这个文件才是grunt的真正的配置文件。

##如何配置Gruntfile.js？##

继续重复烦人的话，grunt是基于nodejs，所以需要使用如下代码：
<pre>
module.exports = function(grunt) {

}
</pre>

*怎么还没到Gruntfile啊，你妹！* *知道了，知道了*

<pre>
module.exports = function(grunt) {
    //项目初始化配置
    grunt.initConfig({
        //读取package.json文件（为了以后任务打好基础）
        pkg: grunt.file.readJSON('package.json')
    });
}
</pre>

上面就是最基本的配置了。

**任务篇**

首先给package.json里添加

<pre>
"spm": {
    "alias": {
        "jquery": "common/jquery-1.9.1.min.js",
        "highcharts" : "highcharts",
        "kalendae" : "kalendae"
    }
}
</pre>

Gruntfile.js完整配置：

<pre>
 module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //提取模块中的依赖关系
    transport: {
       options: {
        paths:['.'],
        alias : '<%= pkg.spm.alias %>'
       },
       //模块整理
       init : {
          options : {
            idleading : 'dist/init/'
          }
          ,files : [
           {
              cwd : 'init'
             ,src : '*'
             ,filter : 'isFile'
             ,dest : '.build/init/'
           }
         ]
       }
    },
    //打包
    concat: {
        options : {
          paths : ['.'],
          include : 'relative'
        },
        index : {
          options : {
            include : 'relative'
          }
          //打包为2个文件，并且生成到dist文件夹下
         ,files : {
            'dist/main.js' : ['.build/init/main.js'],
            'dist/main-debug.js' : ['.build/init/main.js']
         }
       }
    }
  });
//加载依赖包
  grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-cmd-concat');
//注册任务。注意：直接使用grunt这里的build必须是define
  grunt.registerTask('build', ['transport', 'concat']);
};
</pre>

命令行运行：grunt build
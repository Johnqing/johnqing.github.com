---
layout: post
title: grunt 任务配置
category: f2e
---

> 这篇文章主要介绍如何使用grunt的任务，其他不做太详细的讲解。安装等请移步[这里](http://johnqing.github.io/posts/grunt-build.html)

该示例都是通过打包博主自己的类库[n.js](https://github.com/Johnqing/n.js)来做介绍的，详细配置查看请移步[这里](https://github.com/Johnqing/n.js)

##concat##

<pre>
module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			base: {
			    options:{
			      banner: '/* <%= pkg.name || pk.title %> - v<%= pkg.version %> - <%= pkg.homepage  %> - <%= grunt.template.today("yyyy-mm-dd") %> <%= pkg.author.name %>*/\n' 
			    },
			    src: [
			      "src/n.js",
			      "src/n.selector.js",
			      "src/n.data.js",
			      "src/n.dom.js",
			      "src/n.event.js",
			      "src/n.browser.js",
			      "src/n.ajax.js",
			      "src/n.ready.js",
			      "src/n.class.js"
			    ],
			    dest: 'dist/n.debug.js'
			},
			extras: {
				src: [
				  "extras/n.encode.js",
				  "extras/n.cookie.js",
				  "extras/n.template.js",
				  "extras/n.animate.js",
				  "extras/n.random.js"
				],
				dest: 'dist/n.extras-debug.js'
			}
		}
	})
	grunt.loadNpmTasks("grunt-contrib-concat");

  	grunt.registerTask("default",["concat"]);
}
</pre>

*其他模块的使用和cancat模块大同小异，请自己简单调试*

<pre>
	module.exports = function(grunt){}
</pre>

是nodejs中添加一个模块的方法

<pre>
	grunt.initConfig
</pre>

是grunt的配置项

<pre>
	pkg: grunt.file.readJSON("package.json"),
</pre>

为读取package.json

<pre>
	concat: {}
</pre>

是当前的任务

<pre>
	base: {}
	extras: {}
</pre>

base和extras都是自定义的任务名（可定义多个合并任务）

<pre>
	options: {}
	src: []
	dest: ''
</pre>

上面的三个key，不可更改

options是当前任务的配置项

src 是需要合并的文件列表

dest 是合并后的文件路径

##自定义任务##

在[n.js](https://github.com/Johnqing/n.js)构建中有这样一个需求，需要自动生成版本信息和文件更改时间，代码如下:

<pre>
//自动给文件添加版本号和修改时间
grunt.registerTask("post-concat", function() {
	//当前需要修改的文件地址
	var filepath = "dist/n.debug.js";
	//在配置文件的pkg中提取版本信息
	var version = grunt.config("pkg.version");
	//通过template来获取文件修改时间
	var released = grunt.template.today("yyyy-mm-dd");

	//读取当前文件
	var code = grunt.file.read(filepath);
	//替换代码中的字符
	code = code.replace(/@VERSION/g, version);
	code = code.replace(/@RELEASED/g, released);
	//写入到原来的地址中
	grunt.file.write(filepath, code);
	//打印log
	grunt.log.writeln('"@VERSION" is replaced to "' + version + '".');
})
</pre>

下面代码中，taskName为任务名/任务id，第二个参数为任务描述，taskList为需要执行的任务

<pre>
	grunt.registerTask(taskName, [description, ], taskList);
</pre>

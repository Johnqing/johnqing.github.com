---
layout: post
title: bower 来自twitter的包管理工具
---

## 包管理

模块化的 javascript 可以打成一个包，所以需要提供一个工具来管理这些包。

### 功能
+ 注册机制：每个包需要确定一个唯一的 ID 使得搜索和下载的时候能够正确匹配，所以包管理工具需要维护注册信息，可以依赖其他平台。
+ 文件存储：确定文件存放的位置，下载的时候可以找到，当然这个地址在网络上是可访问的。
+ 上传下载：这是工具的主要功能，能提高包使用的便利性。比如想用 `jquery` 只需要 `install` 一下就可以了，不用到处找下载。上传并不是必备的，根据文件存储的位置而定，但需要有一定的机制保障。
+ 依赖分析：这也是包管理工具主要解决的问题之一，既然包之间是有联系的，那么下载的时候就需要处理他们之间的依赖。下载一个包的时候也需要下载依赖的包。

## 使用

```
npm install bower -g
```

查看帮助

```
bower -help
```

bower命令如下：

```
Usage:
    bower  [] []
Commands:
    cache                   Manage bower cache  缓存管理
    help                    Display help information about Bower  显示Bower命令的帮助信息
    home                    Opens a package homepage into your favorite browser  通过浏览器打开一个包的github发布页
    info                    Info of a particular package  查看包的信息
    init                    Interactively create a bower.json file  创建bower.json文件
    install                 Install a package locally  安装包到项目
    link                    Symlink a package folder  在本地bower库建立一个项目链接
    list                    List local packages  列出项目已安装的包
    lookup                  Look up a package URL by name  根据包名查询包的URL
    prune                   Removes local extraneous packages  删除项目无关的包
    register                Register a package  注册一个包
    search                  Search for a package by name  搜索包
    update                  Update a local package  更新项目的包
    uninstall               Remove a local package  删除项目的包
Options:
    -f, --force             Makes various commands more forceful
    -j, --json              Output consumable JSON  
    -l, --log-level         What level of logs to report
    -o, --offline           Do not hit the network
    -q, --quiet             Only output important information
    -s, --silent            Do not output anything, besides errors
    -V, --verbose           Makes output more verbose
    --allow-root            Allows running commands as root
See 'bower help ' for more information on a specific command.
```

## 安装包及其依赖的包

Bower提供了几种方式用于安装包：

```
# Using the dependencies listed in the current directory's bower.json
bower install
# Using a local or remote package
bower install <package>
# Using a specific Git-tagged version from a remote package
bower install <package>#<version>
```

所有包都将默认安装到components目录中。 不建议直接修改此目录中的内容。

执行 `bower list` 命令可以列出所有本地安装的包。


### 安装包

```
bower install jquery
```

安装成功内容如下：

```
bower jquery#*              not-cached git://github.com/components/jquery.git#*
bower jquery#*                 resolve git://github.com/components/jquery.git#*
bower jquery#*                download https://github.com/components/jquery/archive/2.0.3.tar.gz
bower jquery#*                 extract archive.tar.gz
bower jquery#*                resolved git://github.com/components/jquery.git#2.0.3
bower jquery#~2.0.3            install jquery#2.0.3

jquery#2.0.3 bower_components\jquery
```

安装bootstrap，并查看依赖

```
bower install bootstrap
bower list
```

查看

```
bower check-new     Checking for new versions of the project dependencies..
nodejs-bower#0.0.0 D:\workspace\javascript\nodejs-bower
├─┬ bootstrap#3.0.0-rc1 extraneous
│ └── jquery#2.0.3
├── d3#3.2.8
└── jquery#2.0.3
```



删除jQuery库，破坏依赖关系

```
bower uninstall jquery
```

提示内容如下：

```
bower conflict      bootstrap depends on jquery
Continue anyway? (y/n) y
bower uninstall     jquery
```

通过 `list` 查看

```
bower list
```

会提示相关的依赖：

```
bower check-new     Checking for new versions of the project dependencies..
nodejs-bower#0.0.0 D:\workspace\javascript\nodejs-bower
├─┬ bootstrap#3.0.0-rc1 extraneous
│ └── jquery missing
├── d3#3.2.8
└── jquery missing
```


PS: 为了篇幅，其他命令请自己尝试


### 构建自己的bower包

1、必须在项目的根目录下创建一个JSON文件 -- 默认是bower.json，然后指定所有的依赖。这和 Node所使用的package.json文件很类似，并且有助于锁定项目的依赖关系。

还可以通过以下命令，进入交互式界面创建一个bower.json文件：

```
bower init
```

`bower.json` 文件定义了几个参数：

+ name (required): The name of your package.
+ version: A semantic version number (see semver).
+ main [string|array]: The primary endpoints of your package.
+ ignore [array]: An array of paths not needed in production that you want Bower to ignore when installing your package.
+ dependencies [hash]: Packages your package depends upon in production.
+ devDependencies [hash]: Development dependencies.

```
{
  "name": "my-project",
  "version": "1.0.0",
  "main": "path/to/base.css",
  "ignore": [
  "**/*.bak",
  "node_modules"
  ],
  "dependencies": {
    "<name>": "<version>",
    "<name>": "<folder>",
    "<name>": "<package>"
  },
  "devDependencies": {
    "<test-framework-name>": "<version>"
  }
}
```

2、在github创建一个资源库：project-bower，并且 push到github

3、注册到bower官方类库

```
bower register project-bower git@github.com:myGithubId/project-bower.git
```

4、查询包

```
bower search project-bower
```

5、安装包

```
bower install project-bower
```

## API

Bower提供了一套强大、易用的API。所有命令都可以通过bower.commands 对象访问。

```
var bower = require('bower');

bower.commands
.install(['jquery'], { save: true }, { /* custom config */ })
.on('end', function (installed) {
    console.log(installed);
});

bower.commands
.search('jquery', {})
.on('end', function (results) {
    console.log(results);
});
```
所有命令只会触发四种类型的事件（event）：

+ log       记录状态/进度的日志
+ prompt    用户需要被提示时执行
+ end       当命令结束时执行
+ error     只有在发生错误时执行

默认bower情况下， prompt是被禁用的。
你可以通过 `interactive: true` 开启，不过你需要监听 `prompt` 事件，来提示。
你可以使用npm模块 `inquirer` 来简化操作:

```
var inquirer =  require('inquirer');

bower.commands
.install(['jquery'], { save: true }, { interactive: true })
// ..
.on('prompt', function (prompts, callback) {
    inquirer.prompt(prompts, callback);
});
```


## 总结

bower提供了一种理想中的web包管理方式。
借助了npm的很多的思想，应该说npm是一种非常理想的包管理工具，nodejs在很早的时候提出包管理的工具，制定nodejs包规范，对于整个生态圈的建设非常有意义。















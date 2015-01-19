---
layout: default
title: Liu Qing
---

# 个人信息

 - 刘卿/男 
 - 专科/北京建设大学
 - 工作年限：6年
 - 微博：[@jonery](http://weibo.com/jonery) 
 - 技术博客：http://liuqing.pw
 - Github: http://github.com/johnqing
 
 - 期望职位：前端开发
 - 期望薪资：面议
 - 期望城市：北京  

---

# 联系方式
- 手机：18611995375
- Email：staridea@sina.com

---

# 技能
 
 - 语言：HTML/CSS/JS/NodeJs/PHP
 - 版本管理：Svn/Git
 - 其他：jQuery/Express/Grunt/Gulp/Bower/Less/Browserify/Coffeescript等

---


# 开源项目和作品

## 近期开源项目

 - [NT](https://github.com/Johnqing/Ntpl.js) : NT 是一个高效、轻量的前端 (Javascript) 模板引擎，使用 NT 可以使你的代码实现数据和视图模型的分离(MVC)。
 - [Mucuna](https://github.com/Johnqing/Mucuna) : 一套简单的前端编译平台

---


# 工作经历

## 360-支付平台 （ 2013年8月 ~ 至今 ）

### 360充值中心([pay.360.cn](https://pay.360.cn)) 
负责前端开发工作，由于早期团队没有前端人员，所以存在以下问题：

 - 同一个页面中，重复出现多次同一个库
 - 所有脚本都写在HTML中
 - 脚本重复度很高，并且不能满足现有需求
 - 所有css没有模块化，无法剔除已经不用的
 - img没有sprite，请求太多
 - 兼容性太差
 - ...

初期解决如下问题：

 - 统一使用jQuery，因为用户中心使用该库
 - 根据需求，提炼出UI组件
 - 重构HTML，切分模块
 - 脚本模块化，方便拆分
 - css使用Less，使用变量、函数等功能，提供模块化，并可统一配置
 - css sprite
 - 上线前打包/编译模块文件

由于现有的上线工具不能完全的满足需求，只能基于Nodejs开放了一个简单的构建工具，用来编译less，合并模块。

### 360理财宝 ([8.360.cn](https://8.360.cn)) 
这是一个全新的项目。

 - 由于登录是用户中心的，所以jquery是必须要调用的
 - 使用充值中心的UI组件，对该组件进行优化，添加写的插件
 - 现有的构建工具，不能满足需求。使用Gulp进行构建
 - 现有的Gulp组件中，缺少符合整个项目的合并工具，所以开发了[gulp-file-concat](https://www.npmjs.com/package/gulp-file-concat)
 - 测试环境中的代码都是合并过的，调试的时候很麻烦，所以开发了[fe-proxy](https://www.npmjs.com/package/fe-proxy)


### 其他
前端接口人
 
## 京东-ued （ 2013年2月 ~ 2013年8月 ）

### 首页 
该次改版中，我负责重构tab组件，并且已经投入使用。


### 支付流程 
负责结算页面的改版，并且增加产品延保的功能。


### 其他
倡导并分享了less预编译工具、前端代码风格指南等

## 悦淘街 （ 2011年1月 ~ 2013年2月 ）
主导并负责前后端接口制定、js类库开发、组件开发、页面性能优化、前端人员培训

## 今典集团 （ 2008年12月 ~ 2010年12月 ）
参与[红树林官网](http://www.mymhotel.com/)/[猫喂猫电影超市](http://www.movmall.com/)的页面制作，及其前端组件的开发

## 搜狐 （ 2007年12月 ~ 2008年12月 ）
[奥运官方网站](http://www.beijing2008.cn)以及残奥官网 火炬传递 各专题的设计与制作



# 致谢
感谢您花时间阅读我的简历，期待能有机会和您共事。

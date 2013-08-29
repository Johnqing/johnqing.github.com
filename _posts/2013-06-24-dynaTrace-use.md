---
layout: post
title: dynaTrace Ajax 使用说明
category: f2e
---

> dynaTrace Ajax 可以通过分析页面渲染时间、DOM方法执行时间、 JavaScript代码的解析时间来进行性能检查。
它可以深入分析JavaScript，可以跟踪JavaScript从执行开始、经过本地的XMLHttpRequest、发送网络请求、再到请求返回的全过程。

###优势###

1. 支持IE浏览器，Yslow是只用于firefox浏览器的。
2. 有独一无二跟踪页面JS执行的能力，还能跟踪到浏览器的DOM，获取方法的参数和返回值。
3. 可以通过视图来分析JS执行的性能，并可以看到实际的JS代	。
4. 可以非常清晰地通过时间轴视图显示了时间的花费情况。

##页面追踪##

1. 直接通过工具启动，点击浏览器旁边的下拉按钮进入 “Manage Run Configurations” 或直接点击 “New Run Configuration” 添加所要跟踪的URL。
由于它可以运行在多页面的工作流之下，可以先输入起始网址，然后导航到其他网页，dynaTrace 会在后台监视一切。 
2. 从浏览器启动 dynaTrace: 先打开浏览器，进入需要跟踪的界面，再点击浏览器工具栏的按钮,Connected/not Connected 用以表示当前的追踪状态

##Performance Report( 性能报告视图 )##

从 Cockpit 面板中打开 Performance Report 视图。

性能报告视图中记录了所有访问的网页的详细信息，从这个视图当中我们可以得到以下信息：

+ 载入页面所消耗的时间 ：OnLoad Time[ms] 显示从页面开始载入到浏览器派发 onload 事件所经历的时间；Total Load Time[ms] 显示页面全部 load 完总共消耗的时间
+ JavaScript 执行时间 ：On Client[ms] 通过 JS API 或库执行的所有 JavaScript 函数所消耗的总时间
+ 网络请求花了多长时间： 从 Remark 中可看到总共有多少请求数，其中有多少 XHR 请求等信息
+ 服务器端所消耗时间： On Server[ms] 指客户端发出的所有请求在服务器过了多长时间开始响应所消耗的总时间
+ 从右下方的各个面板中可以得到总体的性能分析报告（更详细的信息可查看 Cockpit 面板中的相应节点），例如：  
  + NetWork 中可看出有多少资源是从浏览器缓存中读取的，有多少的 HTTP 转发请求消耗了不必要的网络传输时间；合并同一个 domain 中的 CSS、JS 的请求可节省多长网络传输时间。  
  + TimeLine 中显示了页面的生命周期：该图反映了页面进程中网络资源下载，JavaScript 执行，页面发生渲染，CPU 使用情况，以及发生了哪些事件，例如：Load 事件、XMLHttpRequest 等信息。


##Timeline( 时间轴视图） - 页面生命周期##

时间轴视图可以通过双击 Cockpit 面板中的 TimeLine 节点打开或者在 Performance Report 中通过在某个 URL 上点击右键，选择“DrillDown-TimeLine ”打开。
根据 性能报告视图 打开耗时比较长的 URL 的 TimeLine, 通过工具栏或右键菜单，可以打开更多选项，比如内容类型和 JavaScript 触发器的颜色值，或者显示更多事件，比如鼠标移动、点击和键盘事件。

在此视图下，我们可观测到：

+ CPU 占用率可显示 JavaScript 的执行导致浏览器占用 CPU 的时间
+ JavaScript 执行所占用的时间：从上图中观察到右边蓝色块的那一段耗时比较长，鼠标悬停在这段上可以看到是由于 load event on 触发的，耗时将近 13 秒 的时间
+ 浏览器 Rendering，悬停上去可发现大部分是由于在计算 layout 所需要的时间，一般在 IE 上面执行相对会比较明显
+ 网络请求并行下载耗时，一方面来自请求的数目太多，其中一个比较明显的就是有一个 XMLHttpRequest 花在 Server 的处理耗时将近 7 秒的时间
+ Event 轴显示了鼠标点击事件，XMLHttpRequest 事件和 OnLoad 事件

##PurePath( 路径视图 ) ##

通过双击 Cockpit 面板中的 PurePath 节点打开也可以选中时间轴上的一段右键选择“Drill Down to Timeframe ”来到 PurePath 视图，进一步进入每个动作去观察哪些事件触发执行了 JavaScript 和哪些函数的执行耗时比较长。

从详细信息栏我们可观察到

+ Start : 一个活动的开始时间
+ Duration[ms] : 活动的持续时间，包含子树的活动时间
+ JS[ms] :JavaScript 执行总的耗时，包括异步的子树执行时间但不包括等待时间
+ Total[ms] ：活动本身从开始到结束的持续时间 , 不包含子活动的执行时间
+ Exec[ms] ：活动本身执行时间，不包括其子活动的需要的时间
+ Size : 树中总的节点数，包含所有子活动的节点数。

##HotSpot( 热点视图 ) - 哪些地方降低了性能##

从 PurePath-->Drill Down 进入该视图，也可以从面板中直接打开 HotSpot 视图来分析浏览中访问过的所有 JavaScript、DOM 和页面渲染操作

从上图中可以看到每个方法的调用次数，JS 的执行时间以及总的执行时间等信息：

+ Back Traces 栏显示了由谁调用了这个函数，调用了几次，从上图可看到该方法被 Dojo 的 <return-closure> 调用了 2 次，而方法本身调用的执行时间很短只有 3ms(Exec[ms])
+ Forward Traces 栏显示了这个方法又调用了哪些函数，Invocations 表示该方法总共被调用了几次；活动总耗时 12.7s(Total[ms]),Exec[ms] 表示方法本身执行所需要的时间，JS[ms] 总的 JavaScript 的执行时间。
+ 界面底部显示了在 Back Traces 树或 Forward Traces 树中选中的 JavaScript 的源码

##Network（网络视图）##

通过双击左侧 Cockpit 面板中的 Network 节点，或从 Summary 视图中某个 URL 上右键选择“Drill Down – Network”进入到 Network 视图，该图显示了所有网络请求

Network 视图高亮标记出超慢的请求以及连接等待时间。

这个视图下会用颜色标记每个请求，并且用红色高亮标记出耗时最长的下载请求。
默认情况下会以 TimeLine 上的发生顺序来排列，您可以点击任何一列来进行排序。
对于每个请求我们可以看到资源是否来自浏览器缓存（Cached 栏），请求类型（Network 或 Ajax），HTTP 状态，Mime 类型，大小，在 DNS、网络连接、服务器响应、网络传输和等待上消耗的时间。
界面底部显示了 HTTP 请求和响应头以及返回的实际内容。



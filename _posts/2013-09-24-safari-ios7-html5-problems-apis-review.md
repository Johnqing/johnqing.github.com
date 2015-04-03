---
layout: post
title: iOS 7 的 Safari 和 HTML5：问题，变化和新 API
---

> 原文：[Safari on iOS 7 and HTML5: problems, changes and new APIs ](http://www.mobilexweb.com/blog/safari-ios7-html5-problems-apis-review)
> 译者：[涂鸦码龙](http://jinlong.github.io/blog/2013/09/23/safari-ios7-html5-problems-apis-review)

![javascript-function-base](http://jinlong.github.io/images/post/ios7/safari.png)
这些天 Apple 已经推出了 iOS 7 以及 iPhone 5S 和 iPhone 5C 。Apple 面向 web 开发者仅仅发布了 10% 的所需信息，我可以说这是自 1.0 以来，bug 最多的 Safari 版本嘛。文本我将介绍新的 API 和特性，以及如果你有网站或 webapp ，马上需要处理的大多数问题。

## 简而言之

没有时间读这篇长文？

+ **UI 变化：** 工具栏色彩，新的全屏导航问题，新的主屏图标尺寸；iPhone 未使用 `<title>` ；可能与新手势冲突。
+ **新设备：** 对 web 开发者而言没有任何新东西，跟 iPhone 5 相同。
+ **HTML 5 标签：** 视频追踪，`<progress>` ，移除对 `input type=datetime` 的支持。
+ **HTML 5 API ：** Page Visibility（页面可见性），AirPlay API，canvas 增强，移除对共享 Workers 的支持，Web Speech 综合 API， 无前缀的 Web Audio 和 Animation Timing， Mutation Observer 和其它小调整。WebSQL 使用超过 5Mb 的大问题。
+ **CSS ：** Regions，Sticky 定位， FlexBox，ClipPath，无前缀的 Transitions 和 其它优化。
+ **主屏 webapps ：** 一些严重的问题（比如，不支持 alert ！）
+ **原生 webapps ：** Web View 分页，原生 app 的 JavaScript 运行时，以及视频播放新功能。

## 新浏览器

Safari ，像其它原生应用一样，在用户界面和体验方面已经迎来大幅更新。这些变化会影响用户与网站的交互，以及 webapp 的反应。

### 工具栏色彩

Safari 的工具栏已经着色（iPhone 上的 URL 条和底部工具条），颜色基于： 

1. 加载页面时的背景色 
2. 当滚动页面时，工具条后面的当前主色

如果你想“hack”初始颜色，与 body 背景不同，并不需要往 HTML 里面加无用的东西（比如新容器），仅需使用下面的 CSS hack:

{% highlight css %}
body {
	background-color: blue; /* 用于着色 */
	background-image: linear-gradient(to bottom, green 0%, green 100%); /* 用于 body */
}
{% endhighlight %}

我们定义了背景色和背景图像；内容将用图像（本例是渐变，也可以是 data URI 1px 图像）。以下例子，前两个用了同样的颜色（仅用背景），最后一个工具栏颜色和 body 颜色不同。 

![tint](http://jinlong.github.io/images/post/ios7/tint.png)

### 全屏和 HTML 5 应用、游戏的大问题

如今 iPhone 和 iPod touch 上的网页浏览总是全屏。当用户在垂直模式（portrait ）滚动页面时，底部工具栏将消失，URL 栏变成一个小的半透明的条出现在顶部。水平模式（landscape），用户滚动页面底部工具栏和主域名栏同时消失，变成完整的全屏模式。

工具栏和完整的 URL 栏将再次出现： 

1. 用户轻击页面顶部，或者 
2. 用户把页面滚回顶部

下面图片显示了水平和垂直模式，滚动页面前后的 UI 变化： 

![fullscreen2](http://jinlong.github.io/images/post/ios7/fullscreen2.png)

问题是：

+ 当工具栏出现/消失时，`resize` 事件不会触发
+ 我们无法探测 JavaScript 或者 `media queries` 的变化
+ 老技巧 `window.scrollTo` 隐藏地址栏不再工作；因此，没有用户介入滚动页面，没有办法隐藏地址栏或工具栏了。
+ 如果没有使用原生的滚动，会遇到问题（细节见下面）。
+ 9月19日更新: canvas 底部无法交互（细节如下）

如果你使用“非原生”的滚动布局，比如 iframe，`overflow:scroll` ，或者基于 JavaScript 的滚动组件，工具栏永远不会隐藏。更大的问题是，用户一旦进入全屏模式，将无法返回正常模式。比如，以水平模式看 Twitter 网站（使用 `overflow:scroll` ），滚动区域少于屏幕的 50%时，工具栏再也不会消失。

![twitter](http://jinlong.github.io/images/post/ios7/twitter-300x171.png)

说实话，如果你从垂直模式切换到水平模式，有时会变成全屏无法滚动，但是你无法避免。你需要测试它们找到解决办法。

滚动出现工具栏的问题同样出现在 HTML5 游戏。Beta 1 期间, Apple 论坛就有许多人反馈这个问题，比如：

+ **Richard Davey：** 对我们而言这的确是个问题，我们 BBC 网站上的所有游戏显示都出了问题（试下上面的[所有例子](http://www.bbc.co.uk/cbeebies/)）。移除了全屏按钮，废弃了’hack’，我们无法让游戏全屏。游戏挤在 iPhone 浏览器中间的一个小窗口。(…) 水平模式打开页面，仅有 2/3 的屏幕可用，控制区域占用了 1/3 的屏幕。(…)
+ **TheFlashGuy：** 在水平模式，我们需要控制浏览器工具栏的显示/隐藏。用户点击屏幕顶部或底部，太容易进入这个模式了，此模式破坏了许多网站和 web app，因为它们主要的 ui 导航元素习惯放在内容区域的顶部或底部。

> “你的网站无法获得真正的全屏体验。这点反而成了 iOS 6 喜人的一面了，失去这点是主要的倒退。Richard Davey”

![catchme](http://jinlong.github.io/images/post/ios7/catchme.png)

## 底部工具栏和交互元素（9月19日 更新 ）

一旦进入全屏模式，页面底部就不可交互。此问题影响到全屏模式（滚动以后）视口底部的任何工具栏，链接或者表单项。比如，底部固定的工具栏。

当你点击视口的这部分，仅仅触发了全屏驳回动作。因此，Safari 工具栏出现，需要再次点击交互项触发动作，因此两次点击才触发一个按钮。可以在[这](http://view.jquerymobile.com/master/demos/widgets/fixed-toolbars/footer-persist-a.php)测试，滚动然后点击底部工具栏。

比如，你想点击相册下一张图片，仅仅打开了 Safari 工具栏，你需要再次点击相册执行相应操作。 

![bottom-toolbar](http://jinlong.github.io/images/post/ios7/bottom-toolbar.png)

### 标题

下一个巨大的变化是 iPhone 的 Safari UI 的 title 标题区域。iPhone 的页面标题被当前的域名取代（见下图），页面标题只在浏览选项卡时可用。 

![page-title](http://jinlong.github.io/images/post/ios7/page-title.png)

> “在 iPhone iOS 7 上，当用户浏览网页时，页面的 `<title>` 将被忽略。”

iPad 没有全屏模式；工具栏和标题栏总是可见。

### 添加到主页按钮

![share](http://jinlong.github.io/images/post/ios7/share.png)

整个 UI 已经改变，包括新图标取代 **分享图标** ，因此每个网站都推荐用户添加到书签，或者添加到主屏，它们需要更新图标。

### 手势

操作系统和 Safari 如今提供新的手势，如果你自己检测手势的话，新手势可能影响你的网站。

1. **控制中心：** 当你从屏幕底部向上滑时出现。这一版，由于全屏，屏幕底部可能是网站的一部分，而不是 Safari 工具栏。因此，**建议用户从 canvas 的底部向上滑时，需要多加小心。** 
2. **历史手势：** 第二个可能有问题的手势是从边界左滑，右滑；Safari 将触发浏览历史的后退和前进动作，像 Windows 8 模式的 IE。如果你引导用户左滑或右滑，并且边缘没有一点边距的话，历史手势可能与网站手势发送冲突（不过说实话，Chrome 存在同样的问题）。

在单页 webapp （Safari 内）中，当使用 History API 或者 hash 技术管理应用状态时，此问题相当严重。当用户使用后退手势时，他将看到同一应用的两个图像，可是用户在同一个应用中。当你使用 side-by-side （并排）滚动手势时，比如 Yahoo! 主页，如果用户从边界触发手势（它甚至触发了 touch 事件），可能有使用问题 ：

![gestures](http://jinlong.github.io/images/post/ios7/gestures.png)

当用户手势返回时，手势和回退动画（向右滑）也会跟一些 UI 框架发送冲突，比如 jQuery Mobile 或者 Sencha Touch，两种动画都会渲染（浏览器动画，然后是框架动画）。此外，当前一页在左侧并滚动到特定位置，滑动动画的快照是正常的，但是页面从顶部加载，并未保持原来的滚动位置。

没有办法阻止这些手势，因为它们是由 OS （操作系统）或者浏览器自身管理的。

非常希望，历史手势在主屏 webapp 或 UIWebViews （比如 PhoneGap 应用）上是禁用的。

### 图标尺寸

在 7.0 中，新的系统图标比前一版本大 5% ，比如在 Retina iPhone 设备用 120x120 代替先前的 114x114 。如今，系统图标也变成扁平化，不再需要闪亮的效果，因此我们可能想更新图标匹配新设计。我们可以用同样的带新尺寸的 `apple-touch-icon` link 。

**apple-touch-icon precomposed** 版仍旧支持，只不过图标没有闪亮的效果了。如果我们定义两种，precomposed 版优先。

iOS 7 可用的图标尺寸是： 

* iPhone / iPod Touch 视网膜屏: 120x120 
* iPad 非视网膜屏（iPad 2 和 iPad mini）: 76x76 
* iPad 视网膜屏: 152x152

我们需要记住所有非视网膜屏的 iPhone-因子设备无法使用 iOS 7 。如果我们没提供新的图标尺寸，设备还会用 iOS 6 相关的图标。如果我们想覆盖所有可能的 iOS 图标，使用下面的代码：

{% highlight html %}
<!-- 非视网膜 iPhone 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon57.png" sizes="57x57">
<!-- 非视网膜 iPad 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon72.png" sizes="72x72">
<!-- 非视网膜 iPad iOS 7 -->
<link rel="apple-touch-icon" href="icon76.png" sizes="76x76">
<!-- 视网膜 iPhone 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon114.png" sizes="114x114">
<!-- 视网膜 iPhone iOS 7 -->
<link rel="apple-touch-icon" href="icon120.png" sizes="120x120">
<!-- 视网膜 iPad 低于 iOS 7 -->
<link rel="apple-touch-icon" href="icon144.png" sizes="144x144">
<!-- 视网膜 iPad iOS 7 -->
<link rel="apple-touch-icon" href="icon152.png" sizes="152x152">
{% endhighlight %}

### 书签和收藏夹

书签也用了新图标（看下面左侧的图），貌似无法修改这些图标和文字。

当你点击地址栏时出现收藏夹（下面右侧图），看起来像是用了 **apple-touch-icon** link ，但是没有遵循任何尺寸原则，并且我发现了怪异现象，比如一些带正确的 link 元素的网站，收藏夹却不显示图标。XXXX

![favorites](http://jinlong.github.io/images/post/ios7/favorites2.png)

## 新设备

过几天，iPhone 5S 和 iPhone 5C 就可以在市场上买到了，从 web 开发的观点看，好消息是它们确实跟 iPhone 5 一模一样。同样的屏幕尺寸，同样的像素密度，同样的功能。它们也许快一些，但是从编码的角度，完全不必担心。

新的 Touch ID 特性（指纹识别），网站还无法使用，以 JavaScript 开发者的观点看，64位 CPU 不会改变什么。也就是说，iOS 模拟器有能力模拟 64位 CPU。

## HTML5 标记支持

### 视频追踪

video HTML5 元素现在支持 **track** （追踪）subtitles （字幕）或者关闭 captions （解说字幕）。支持多语言，视频播放器将出现一个选择器选择它。用户可以改变语言，或者在追踪选择器禁用 captions （解说字幕）。

![cc1](http://jinlong.github.io/images/post/ios7/cc1.png)

对于所有可能的追踪类型（ `kind` 属性），仅支持 captions 和 subtitles ，我们必须在 `srclang` 属性用 [ISO](http://en.wikipedia.org/wiki/ISO_639-1) 格式 （比如 English 是 en）定义语言。当用户可以听到声音但不理解语言时，字幕非常有用。当用户无法听到声音时，解说字幕很有用，它包含了当前发生情况的额外信息（比如背景音乐正在播放）。

![cc2ch](http://jinlong.github.io/images/post/ios7/cc2ch.png)

定义追踪的 `label` 属性毫无价值，因为 iOS 忽略它，如果 kind 值使用 captions 代替 subtitles ，菜单中带有可选的 CC 后缀的语言名取代了 label。

{% highlight html %}
<video>
<source src="myvideo.mp4">
<track kind="captions" src="my-captions-en.vtt" srclang="en">
<track kind="subtitles" src="my-captions-fr.vtt" srclang="fr">
</video>
{% endhighlight %}

可以通过 JavaScript API 实现追踪，我们可以遍历所有追踪文件。这点可能仅对 iPad 有用，在 iPad 上，我们可以在 web canvas 里真正嵌入一段视频，iPhone 上永远是全屏模式。

track 元素遵循跨域策略，默认情况，视频和 track 必须是同源。使用 JavaScript 可以探测 track 是否可用，用到 webkitHasClosedCaptions ：

{% highlight javascript %}
var hasCC = document.querySelector("video").webkitHasClosedCaptions;
{% endhighlight %}

还可以通过 `webkitClosedCaptionsVisible` （布尔属性）改变每个 video 元素的 captions （解说字幕）的可见性。

字幕样式

iOS 7 支持新的 `::cue` 伪元素，我们仅可以改变 text-shadow, opacity 和 outline。所有其它属性比如颜色和字体样式被忽略。

{% highlight css %}
::cue { opacity: 0.8 }
{% endhighlight %}

更多关于 [Track 元素和 API](http://www.html5rocks.com/en/tutorials/track/basics/) （记住 Safari 并非支持所有 API）。

### PROGRESS 和 OUTPUT 元素

已支持 `<progress>` 元素，基于 max 和 value 创建进度条。如同其它浏览器，不支持模糊进度，当我们知道明确的进度值时才适用。

{% highlight html %}
<progress max="100" value="40">
{% endhighlight %}

已支持 `<output>` 元素，没感觉有什么特别 :) 。

貌似支持 `<meter>` ，所有内容会被忽略，我感觉有 bug 。

### 移除：datetime input type

追随 Google Chrome ，iOS Safari 不再支持 datetime 的 input 类型，它将退化成 text 。这个类型将被标准废弃，标准赞成使用两个 input ， date 和 time 达到同样的目的。问题是 datetime 兼容 iOS 5.0 至 iOS 6.1 ；如果使用它要多加小心！

week input 类型仍没支持，回退成 text 类型，渲染成一个不可交互的控件。

![datetime](http://jinlong.github.io/images/post/ios7/datetime.png)

> “如果你正在使用 input type=’datetime’ ，你应该马上采取行动，因为它被渲染成 text 类型。”

### 无缝 iframe

在 iOS 7 上，新的布尔属性 `seamless` 用于创建无边界的 iframe 。iframe 将没有滚动条，默认情况，它会取到内部内容的高度，作为 DOM 中其它块级元素的使用空间。

{% highlight html %}
<iframe seamless src="mypage.html"></iframe>
{% endhighlight %}

## HTML5 JavaScript API

先以坏新闻开头：**未支持 WebGL，FullScreen，WebRTC， getUserMedia 或者 IndexedDB 。**

可用的新 API ：

+ Page Visibility API
+ XHR 2.0 完全实现
+ Video tracks API (已覆盖)
+ AirPlay API
+ CSS Regions API
+ Canvas 增强
+ 移除对 Shared Workers （共享 Workers ） 的支持
+ WebSpeech 合成 API

iOS 7 的 Page Visibility API 带有 -webkit- 前缀，用于探测 tab 标签在前台还是后台。你可以测试[这个 demo ](http://mobilexweb.com/ts/api/page.html)。

XMLHttpRequest 2.0 规范完全兼容意味着我们可以把 ’blob’ 作为响应。

Video tracks API 已经快速覆盖，意味着我们可以检索和导航所有媒体元素的所有追踪内容。

CSS Regions API 作为 CSS Regions 规范的一部分，主要带前缀的 webkitGetFlowByName 函数对每个 DOM 元素都可用。

Canvas 2D Drawing API，canvas context 现在有 `globalCompositeOperation` 属性，当绘制不同的层时，我们可以定义混合模式（比如正片叠底）。已有新的 Path 构造器，在 canvas context 绘制的路径可以保存，用于后期使用，避免直接画在画布上。

### AirPlay API

AirPlay API 需要解释。AirPlay 是 Apple 的无线流媒体解决方案，可以在不同设备间传递流媒体内容，Apple TV 已经使用。Safari 已经支持 `x-webkit-airplay` HTML 属性，用于定义是否使用 AirPlay ，之前我们无法通过 HTML5 定制体验。

API 可以通过 AirPlay 定制播放器，获取流的内容和事件。每个 video 元素都有 `webkitplaybacktargetavailabilitychanged` 和 `webkitcurrentplaybacktargetiswirelesschanged`  。让我们见识下不用下划线，驼峰或者其它方式命名事件有多可怕 :S 。当新的 AirPlay 对象（比如 Apple TV）启用，或者禁用，第一个事件触发；当重放状态改变时，第二个事件触发。

> “我认为 **webkitcurrentplaybacktargetiswirelesschanged** 创造了记录：迄今最长的 JavaScript 事件名。”

如果有个流对象可用，我们可以提供一个按钮，选择后调用视频的 `webkitShowPlaybackTargetPicker` 函数。

仍旧没有官方的 API 文档，你可以看这视频 [‘What’s New in Safari and WebKit for Web Developers’](https://developer.apple.com/wwdc/videos/index.php?id=600) ，WWDC 会议的视频提到了这个话题。

### 后台执行

有几个后台执行的用例：

+ 如果用户切换了 tab （标签选择屏），你的代码仍旧执行，但是图像静止了
+ 如果用户切换了应用（多任务模式），你的代码仍旧执行，图像更新
+ 如果 Safari 在前台，你的网站在后端标签，你的代码冻结，Safari 有最新执行的快照用于 UI 显示
+ Safari 在后台你的代码冻结

### WebSpeech 合成 API

9月19日更新：API 能起作用，因此是官方支持。

WebSpeech API 可以让网站记录和转录音频，还可以把文字合成到声音中，使用操作系统内部声音播放。

iOS Safari 仅包含合成 API（文字到语音），没有从麦克风听音频的 API 。使用 `speechSynthesis.getVoices()` ，你可以在一个真实设备，查询所有不同语言的可用声音，它返回 36 种声音（有时刷新页面返回 0，感觉像 bug ）。在英语方面，使用 `en-US` 是女声，使用 `en-GB` 是男声。在语音识别方面我不是专家，但是感觉声音 API 不同于 Siri ，iOS 7 的 Siri 听起来更自然。

让 JavaScript 通过你的网站开口说话，可以使用默认语言的快捷版，或者定义不同的属性像以下例子：

{% highlight javascript %}
speechSynthesis.speak(new SpeechSynthesisUtterance("Hello, this is my voice on a webpage"));
{% endhighlight %}

{% highlight javascript %}
var speech = new SpeechSynthesisUtterance();
speech.text = "Hello";
speech.volume = 1; // 0 to 1
speech.rate = 1; // 0.1 to 9
speech.pitch = 1; // 0 to 2, 1=normal
speech.lang = "en-US";
speechSynthesis.speak(speech);
{% endhighlight %}

通过 `SpeechSynthesisUtterance` 对象可以绑定一些事件，比如 start 和 end ，但是不要在事件内部用 alert ，你的 Safari 将未响应（不要问我为什么）。

可以说出来的字符串可以是无格式的文本，标准也支持 [SSML 格式（语音合成标记语言）](http://www.w3.org/TR/speech-synthesis/) 的 XML 文档，iOS Safari 仅阅读 XML :) 。

记住 **Speech 合成 API 仅作用于用户明确的行为** ，比如点击一个按钮，因此你不能在 onload 或者基于时间坐标发起语音。用 iOS 7 设备试试这个[在线 demo](http://mobilexweb.com/ts/api/speech.html) 。

### 其它变化

+ MutationObserver
+ 无前缀的 Animation Timing API （也被称为 requestAnimationFrame）
+ 无前缀的 transitionend 事件名
+ 无前缀 URL
+ 无前缀 WebAudio API 及新的高级功能
+ 新的 DOM 属性 `hidden` 和 `visibilityState`
+ 支持 window.doNotTrack

### WebSQL bug

使用 WebSQL API ，当创建的数据库大于 5Mb 时，会有大问题（DOMException）。先前版本，用户许可限制是 50Mb。因为 bug ，仅仅使用 5Mb ，用户将收到许可对话框。尽管用户给予权限占用更多容量，但它的确是一个很大的 bug。

9月19日更新: 根据纽约时报的 tarobomb ，当你首次创建数据库，如果请求容量小于 5Mb，然后想存更多数据（大于 50Mb）时，合适的确认框出现（首次 10Mb，然后 25Mb，最终 50Mb），你最终能储存超过 5Mb 的数据。

## CSS 支持

支持新的规范（大部分有 webkit 前缀）：

+ Sticky 定位
+ CSS Regions
+ CSS Grid Layout (not working)
+ CSS FlexBox
+ 动态字体类型

### Sticky 定位

Sticky 定位是新的实验特性，可以在视口中固定一个元素，当它的父容器移出可视区域时消失（通常在滚动操作后触发）。它像是混合定位：当 static 定位元素移出视口时变成 position: fixed 。如果有多个 sticky 元素，它们会聚集到同一区域（定义同样位置属性的话），当滚动到类似原生 UITableView 部分时，可以做个不错的效果。

9月19日更新：[一些报告](https://twitter.com/zachleat/status/362588551847755776) 显示这一特性在 6.1 就可用了（但是在社区没有找到资料，因此我在这提一下）。

{% highlight css %}
h1 {
	position: -webkit-sticky;
	top: 10px;
}
{% endhighlight %}


![sticky1](http://jinlong.github.io/images/post/ios7/sticky1.png)

### CSS Regions

[CSS Regions](http://dev.w3.org/csswg/css-regions/) 规范是 Adobe 提的，我们可以创建类似杂志设计，通过不同的容器排版内容。由于屏幕尺寸的性质，针对 iPad 网站和 webapp，我们将使用新的流原理。

在 iOS 上，选择不同区域的内容是不允许的。CSS Exclusions 可以定义区域的形状，通常情况下，它和 CSS Regions 是好伙伴，但它还不可用。

你可以试试这些[在线 demo ](http://codepen.io/collection/jabto)。


### CSS Grid Layout

[CSS Grid Layout](http://dev.w3.org/csswg/css-grid/) 是 W3C 的新布局规范（由微软提出，IE 10 已经实现）。所有新的 CSS 属性（-webkit-grid-X）都可用，但我无法使用 display: grid 或者 display: -webkit-grid 。我不确定是否有其它方式启用它，或者它未完全实现。

### CSS FlexBox

CSS FlexBox 的最终规范出来了，水平/垂直定位元素时，我们可以不用浮动和清除浮动了。使用时我们应该给容器加个 display: -webkit-flex，然后应用不同的属性。

### 动态字体

iOS 7 支持动态字体这种新字体类型，用于调整粗细，字间距和行距，基于当前字体提升易读性。我们可以把此新特性用于 HTML，使用新的 -apple- 前缀（也许因为 webkit 将来不打算使用前缀？）。有一长串的常量，比如 -apple-system-headline1，-apple-system-body 和 -apple-system-caption1 。

{% highlight css %}
h1 { font: -apple-system-headline1 }
p { font: -apple-system-body }
{% endhighlight %}

### 其它 CSS 改进

media queries 的 resolution 属性还是没支持，有些新东西，比如可以查询 min-color-index 和 max-color-index ，虽然没什么用吧 :)

还有一些次要更新，包括：

+ 无前缀的 CSS Transitions （和 `transitionend` 事件）
+ CSS Clip Path 基于形状剪裁内容，包括圆形，矩形和多边形
+ 字体的 Kerning 和 Ligatures 默认启用
+ Background 背景属性更兼容不同的值
+ box-decoration-break: slice/clone
+ tab-size 样式
+ overflow-wrap: normal/hypernate/break-word
+ 支持 ch 和 vmax 单位
+ mask-type: alpha
+ 新的伪元素 ::cue 在 video 追踪部分已提到
+ -webkit-background-composite 属性（但是我试了不起作用）

## 主屏 webapp

> “如果你正在用主屏 webapp ，有个不幸的消息：此平台的此版本有太多 bug 了。”

唯一的好消息是，当全屏时，貌似没有 WebSQL 存储限制了；不需要用户的许可。

大问题 主屏 webapp 有不少大问题：

+ **标准的对话框无法使用了** ，比如 `alert`, `confirm` 或 `prompt` 。
+ **webapp 无法打开外部的 URI** ，比如 Safari 里的网站，打电话，打开 AppStore 等。任何 URI 都会忽略。
+ **如果安装超过4个 app ，主屏会发生奇怪的事情** ，比如一个 webapp 取代了另一个。你会看到同样 webapp 的副本。同一时间打开不同的 webapp 时也发生同样的事情。在你的设备试试访问 app.ft.com，安装 webapp ；到 pattern.dk/sun，安装 webapp ；重复操作几次，你会发现主屏乱了。重启设备貌似可以解决问题。
+ 垂直模式输入文本，select 或者 日期控件获得焦点，media queries 将把方向变成水平，resize 事件触发。此情况出现在主屏 webapp 和 Web Views ，Safari 没事（bug?）。
+ 9月19日更新：如果使用 Application Cache ，通过 hash 或其它技术管理状态，历史对象将不保存你的导航历史，因此 `history.back()` 将不起作用，`history.length` 永远是 1 。（多谢 10+ 以上的人报告此问题！）
+ 9月19日更新：当你安装图标到主屏，你的网站和 webapp 之间的 Cookies 无法互通（出于身份验证的目的）。直到 6.1 才有的功能现在没有了。（感谢 Joseph Pearson 报告此问题；[测试用例在此](http://test.monoclejs.com/test/bugs/ios-cookies/) ）

### 状态栏

如果你没有提供 `apple-mobile-web-app-status-bar-style` meta 标签，或者你提供了一个默认值，状态栏将变黑，因此… 屏幕仅有个黑色区域（一些设备仅有电池图标）。用户无法看到状态栏的时钟和其它图标。

黑色值并不是 iOS 7 全屏模式的新样式，如果你定义 `apple-mobile-web-app-status-bar-style` 的值为 `black-translucent` ，它不再是黑的，遵循 app 全屏模式，它变得完全透明。不幸的是， 貌似没有办法定义背景清除还是黑色，因此我们需要测试图标和时间跟背景好不好区分。更新：文字貌似总是白的。

下面的图片可以看到默认状态栏，black 值和 black-translucent 值在 iOS 7 的效果。 

![statusbar2](http://jinlong.github.io/images/post/ios7/statusbar2.png)

### 启动图片和多任务管理

新的多任务系统，有个主屏 webapp 时，系统用白色图片，而不是启动图片，并不是 app 当前状态的预览。唯一例外是，当 webapp 仍旧是激活 app ，你可以看右边的快照。以下例子，我们可以看到 Financial Times webapp 有白色快照，只有当它是激活状态时才有正确的启动图片

![multitask](http://jinlong.github.io/images/post/ios7/multitask.png)

幸运的是 iPhone 5 的主屏 webapp 没 bug ，它们是 letterboxing 应用（它被发现后的一年）。我们不再需要视口讨巧解决方案了。

## 原生 webapp 开发

如果你开发 hybrid 混合（原生 webapp ），比如 Apache Cordova (PhoneGap) 应用，有一些消息告诉你。首先，还没有 Nitro 引擎。

### Paginate （随意翻阅）模式

当在原生应用中，使用 UIWebView 实现丰富内容时，或者对于原生 webapp （hybrid ），我们可以为了电子书阅读体验使用 Paginate （随意翻阅）特性，避免垂直滚动条（类似 Windows 8 应用体验）。如果应用显示动态内容，这一特性是完美的，我们不能预先优化分页。有不同的 Objective-C 属性配置分页过程。要启用它，需要这么做：

<pre>
myWebView.paginationMode = UIWebPaginationModeLeftToRight;
myWebView.paginationBreakingMode = UIWebPaginationBreakingModePage;
myWebView.gapBetweenPages = 50;
</pre>

这些属性将把 web view 的 HTML 文档转换成分页模式（分成水平方向页面）。

### 其它改进

+ 对于原生开发（不一定使用 Web View），iOS SDK 现在包含了 JavaScript 运行时：JavaScript Core 框架，把 Objective-C 包装成标准的 JavaScript 对象。我们可以用这个框架运行 JavaScript 代码，解析 JSON 。
+ Web View 新属性，HTML 5 视频现在有了内联回放模式，代替默认的全屏模式。
+ Web View 新属性，在原生 webapp 里，可以启用视频自动播放。
+ iOS 7 也有 SafariServices 框架，以编程方式添加 URL 到 Safari 阅读列表比较有用。


## 远程调试

如果你有 MacOS 就可以和 iOS 远程调试，必须更新 Safari 到 6.1 ，iTunes 到 11.1 ，才能和 iOS 7 设备通讯。写此文时，Safari 6.1 仅仅是[预览版 ](https://developer.apple.com/downloads/index.action?name=Safari%206.1)。

内部调试的功能和先前版本一致，用户界面变了许多，设计更简洁。 

![/Screen-Shot](http://jinlong.github.io/images/post/ios7/Screen-Shot-2013-09-18-at-4.02.56-PM.png)

## 还没有

列表很庞大，既然这样我列举一些 Mac 版 Safari 7 揭晓的特性，但是 iOS Safari 没有的特性：

+ Web Speech API （它存在，可是在 iOS 不起作用）
+ 网站推送通知。对 iOS 而言将是很好的补充，但是仅有 Mac OS 支持。
+ 背景混合模式
+ Grid Layout （栅格布局）（它存在，可是在 iOS 不起作用）
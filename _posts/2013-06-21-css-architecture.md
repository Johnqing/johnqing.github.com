---
layout: post
title: CSS架构目标：预测、重用、扩展、维护
---

来自：[张红月](http://www.csdn.net/article/2012-11-30/2812325-CSS-Architecture)

> 摘要：Philip Walton 在AppFolio担任前端工程师，他在Santa Barbara on Rails的聚会上提出了CSS架构和一些最佳实践，并且在工作中一直沿用。

对于想踏入前端开发的工程师来说，通晓CSS（Cascading Style Sheets）则是最基本的要求。而擅长CSS的Web开发人员不仅可以从视觉上复制实物原型，还可以用代码进行完美的呈现。无需使用表格、尽可能少的使用图片。如果你是个名副其实的高手，你可以快速把最新和最伟大的技术应用到你的项目中，比如媒体查询、过渡、滤镜、转换等。虽然这些都是一个真正的CSS高手所具备的，但CSS很少被人单独拿出来讨论，或者用它去评估某个人的技能。

有趣的是，我们很少这样去评价其他语言。Rails开发人员并不会因为其代码比较规范，就认为他是一名优秀的开发人员。这仅仅是个基准。当然，他的代码得必须规范。另外，还需集合其他方面考虑，比如代码是否可读？是否容易修改或扩展……

这都是些很自然的问题，CSS和它们并没有什么不同之处。今天的Web应用程序要比以往更加庞大。一个缺乏深思熟虑的CSS架构往往会削弱发展，是时候像评估其他语言那样，来评估一下CSS架构了，这些都不应该放在“事后”考虑或者单单属于设计师们的事情。

![queue](http://cms.csdnimg.cn/articlev1/uploads/allimg/121129/156_121129143019_1.jpg)

##1.良好的CSS架构目标##

在CSS社区，很难提出某个最佳实践已经成为大家的普遍共识。纯粹地从[Hacker News的评论](http://news.ycombinator.com/item?id=2658948)上判断和开发者们对[CSS Lint](http://csslint.net/)发布后的反应来看，大多数人对基本的CSS东西是持反对意见的。所以，并不是为自己的最佳实践奠定一套基本的论据，而应该确定真正的目标。

好的CSS架构目标并不同于开发一个好的应用程序，它必须是可预测、可重用、可维护和可伸缩的。

###可预测###

可预测意味着可以像预期的那样规范自己的行为。当你添加或者修改某个规则时，它并不会影响到没有指定的部分。对于一个小网站来说，一些微乎其微的改变并不算什么。而对于拥有成千上万个页面的大网站来说，可预测却是必须的。

###可重用###

CSS规则应具备抽象和解耦性，这样你就可以在现有的基础上快速构建新的组件，无需重新修改编码模式。

###可维护###

当把新组件放置到网站上，并且执行添加、修改或者重新设计操作时，无需重构现有CSS，并且新添加的X并不会打破原有页面的Y组件。

###可扩展###

当网站发展到一定规模后，都需要进行维护和扩展。可扩展的CSS意味着网站的CSS架构可以由个人或者团队轻易地管理，无需花费太多的学习成本。

##2.常见的错误实践##

在实现良好的CSS架构目标之前，我们来看一些常见的错误做法，这对我们达成目标是有好处的。

下面的这些例子虽然都可以很好的执行，但却会给你带来很多烦恼，尽管我们的意图和愿望都是美好的，但是这些开发模式会让你头疼。

几乎在每个网站上，都会有一个特定的虚拟元素看起来与其他页面是完全一样的，然而只有一个页面除外。当面对这样一种情况时，几乎每个新手CSS开发人员（甚至是经验丰富的）都会以同样的方式来修改。你应该为该页面找出些与众不同之处（或者自己创建），然后再写一个新规则去操作。

###基于父组件来修改组件###

<pre>
.widget {  
  background: yellow;  
  border: 1px solid black;  
  color: black;  
  width: 50%;  
}  
 
#sidebar .widget {  
  width: 200px;  
}  
 
body.homepage .widget {  
  background: white;  
} 
</pre>

初看，这绝对是段无害的代码，但让我们来看看它是否达到了我们所设置的目标。

首先，widget在examle是不可预见的。当这些小部件出现在页面两侧或者主页面时，开发人员期望它们以某种特定的方式显示出来，且又不失特色。另外，它也是不可重用或不可扩展的。

另外，它也比较难维护。一旦这个widget需要重新设计，那么你不得不修改其他几个CSS样式。想象一下，如果这段代码是使用其他语言编写的，它基本就是一个类定义，然后在代码的另一部分使用该类定义并做出扩展。这直接违反了软件开发的开放/闭合（open/close）原则。

**软件实体（类，模块，函数等）应对扩展开放，对修改闭合。**

####过于复杂的选择器####

偶尔，会有些文章介绍CSS选择器对整个网站的展示起着非常重要的作用，并且宣称无需使用任何类选择器或者ID选择器。

但伴随着越深入的开发，我越会远离这种复杂的选择器。一个选择器越复杂，与HTML就越耦合。依靠HTML标签和组合器可以保持HTML代码干干净净，但却让CSS更加毛重和凌乱。

<pre>
#main-nav ul li ul li div { }  
#content article h1:first-child { }  
#sidebar > div > h3 + p { } 
</pre>

对上面代码进行简单的理解。第一个可能是对下拉菜单进行样式化；第二个想说明文章的主标题应该与其他页面的H1元素不同；最后一个表示在第一段的侧边栏区域添加一些额外的空间。

如果这个HTML是永远不变的，那就无可说之处，但这根本毫不现实。过于复杂的选择器会让人印象深刻，它可以让HTML摆脱掉表面上的复杂，但对于实现良好的CSS架构目标却毫无用处。

上面提到的例子都是不具备可预测性、可重用、可扩展和可维护这四大特性的。例如第一个选择器（下来菜单）例子，如果一个外观非常相似的下拉列表需要用在不同的页面上，并且#main-nav并不属于内部元素，那么你是否需要重新设计？假设开发者想要修改第三个例子里div里面部分标记，那么整个规则都会被打破。

###过于通用的类名###

当创建可重用的设计组件时，在组件的类选择器中覆盖附件的子元素是很常见的现象。例如：

<pre>
<div class="widget">  
  <h3 class="title">...</h3>  
  <div class="contents">  
    Lorem ipsum dolor sit amet, consectetur adipiscing elit.  
    In condimentum justo et est dapibus sit amet euismod ligula ornare.  
    Vivamus elementum accumsan dignissim.  
    <button class="action">Click Me!</button>  
  </div>  
</div> 

<style>
.widget {}  
.widget .title {}  
.widget .contents {}  
.widget .action {} 
</style>
</pre>

像.title、.contents、.action这些子元素类选择器可以被安全地进行样式命名，无需担心这些样式会蔓延到拥有相同类名的其他元素中。这是千真万确的。但它并没有阻止相同样式类名称会蔓延到这个组件上。

在一些大型项目上，像.title这样的名称很有可能会被用在另外一个页面或者本身。如果这样的情况发生，那么整个标题部分明显会和预期的不一样。

过于通用的类选择器名称会导致许多不可预测的CSS样式发生。

###一个规则做太多事###

有时，你要在网站的左上角区域做一个20pixels的可视化组件。

<pre>
.widget {  
  position: absolute;  
  top: 20px;  
  left: 20px;  
  background-color: red;  
  font-size: 1.5em;  
  text-transform: uppercase;  
} 
</pre>

下面，你需要在网站的其他区域使用该组件，那么上面的这个代码明显是错误的，不可重用的。

问题的关键是你让.widget这个选择器做的事情太多，不仅对该组件的位置进行了规定，还对它的外观和感觉方面进行了样式。外观和感觉可以通用，而位置是不可以的。有时候，把它们整合起来使用反而会大打折扣。

虽然这些看起来并无害处，对一些缺乏经验的CSS程序员来说，复制和粘贴已经成为一种习惯。如果一个新团队需要一个特定组件，比如.infobox，他们会尝试使用这个类选择器。但如果该信息框没有按照期望的那样，在每个需要的地方正确显示出来。这时，你认为他们会怎么做？以我的经验来看，他们会打破可重用这一规则，相反，他们会简单地把这些代码复制粘贴到每个需要的地方。做些不必要的重复工作。

##3.原因##

上面列举的这些常规错误实践都有一个相似性，CSS样式承担过多。

对这样的说法你会感到奇怪，毕竟，它是一个样式表，难道不应该承担大多数（如果不是全部）的样式吗？那不正是我们想要的吗？

的确。但是通常来讲，事情并没有那么简单。内容与表现（presentation）相分离是件好事，但CSS从HTML中独立出来并不意味着内容也需要从表现中分离。换句话说，如果CSS请求深入分析HTML架构，那么从HTML中分拆所有的显示代码并不一定会实现所有的目标。

此外，HTML很少会只包含内容，也表示整体框架。通常，架构是会包含container元素，允许CSS隔离一些固定元素。即使没有表象类（presentational classes），也能混合HTML清晰地把内容展示出来。

我相信，鉴于当前的HTML和CSS状态，把HTML和CSS明智地结合起来，当做表现层是非常需要的。而通过模板和局部模板（partials）也可以把内容层进行分离。 

##4.解决方案。##

如果把HTML和CSS结合起来，作为一个Web应用程序的表现层，那么它们需要采取一些方式更好地促进优秀CSS架构的形成。

最好的方法是CSS中尽可能少的包含HTML架构。CSS则是应该定义元素的视觉效果，无论该视觉元素在哪里。如果有一些特定的组件需要在不同的场合显示不同的效果，那么应该赋予不同的名称。例如，CSS通过.button类选择器定义了一个按钮组件。如果HTML想要一个特定的元素看起来像按钮，那么就可以使用.button。如果这里有特殊要求，这里的按钮与其他的有所不同（有可能更大和宽些），那么CSS需要定义一个新的类，HTML可以使用新的类来赋予该元素新的视觉效果。

CSS赋予元素的外在特征，HTML在页面上进行调用。更少的CSS能被更多的HTML架构调用是最好的。

准确地在HTML中声明元素不仅可以清晰表达设计意图，其他开发者也可以清晰地查看标记并且知道元素将呈现的样子。如果没有这种实践，它很难区分一个元素的外观设置是有意或无意的，这样很容易导致团队混乱。

在标记中填入大量的类(classes)是种常见缺陷，这样做往往需要花费额外的精力。一个CSS样式可以给一个特定组件引用上千次。那么，为了在标记里面进行显示声明，就真的值得去重复编写这样的类吗？

虽然这种担心是有效的，但它可能会产生误导。言下之意就是无论你在CSS中使用一个父选择器还是亲手编写上千个Class，这里都会有些额外的选择。在Rails或者其他框架里查看同级别抽象很大程度上可以在HTML中保持很好的视觉外观，并且无需在类中一遍又一遍地编写相同的类。

##5.最佳实践。##

针对上面的种种错误，我进行了很好地总结，并且根据自身经验提出了一些建议，希望它们能帮助您更好地实现良好的CSS架构目标。

###专注###

确保选择器对一些元素不进行无关样式的最好方法是不给它们机会。例如像#main-nav ul li ul li div这样的选择器可能很容易地应用于不想要的元素上。另一方面，像.subnav这样的选择器就不会给它们任何机会。把类选择器直接应用于你想要的元素上是最好的方式，并且可以保持元素的可预测性。

<pre>
/* Grenade */ 
#main-nav ul li ul { }  
 
/* Sniper Rifle */ 
.subnav { } 
</pre>

###模块化###

一个组织结构良好的组件层可以帮助解决HTML架构与CSS那种松散的耦合性。此外，CSS组件本身应该是模块化的。组件应该知道如何进行样式和更好地工作，但是关于布局、定位以及它们与周围元素的关系不应该做太多的假设。

一般而言，CSS要定义的应该是组件的外观，而不是布局或者位置。同样在使用background、color和font这些属性时也要遵循原则使用。

布局和位置应当由一个单独的布局类或者单独的容器元素构成（请记住，有效地把内容与展示进行分离其实就是把内容与容器进行分离）。

###给类进行命名空间###

我们已经检查出为什么父选择器不能在封闭和防止交叉样式污染上面发挥100%的功效。而一个更好的解决方案就是在类上应用命名空间。如果一个元素是可视化组件的一员，那么该元素的每个子元素都应该使用基于命名空间的组件。

<pre>
/* High risk of style cross-contamination */ 
.widget { }  
.widget .title { }  
 
/* Low risk of style cross-contamination */ 
.widget { }  
.widget-title { } 
</pre>

给类进行命名空间可以保持组件独立性和模块化。它可以把现有类冲突降至最小并且减少子元素的一些特殊要求。

###创建修饰符类来扩展组件###

当一个现有组件需要在一个特定的语境中有所不同时，可以创建一个修饰符类（modifier class）来扩展它。

<pre>
/* Bad */ 
.widget { }  
#sidebar .widget { }  
 
/* Good */ 
.widget { }  
.widget-sidebar { } 
</pre>

正如我们看到的，基于父元素的缺点对组件进行修改，需要重申：一个修饰符类可以在任何地方使用。基于位置的覆盖只能被用在一个特定的位置，修饰符类也可以根据需要被多次使用。显然，修饰符类是符合HTML开发者需求的。

###把CSS组织成逻辑结构###

[Jonathan Snook](http://snook.ca/)在其非常优秀的《[SMACSS](http://smacss.com/)》书中提到，CSS可以被分成四个不同的类：基础（base）、布局（layout）、模块（modules）和状态（state）。基础包括了复位原则和元素缺省值；布局是对站点范围内的元素进行定位以及像网格系统那样作为一种通用布局助手；模块即是可重用的视觉元素；状态即指样式，可以通过JavaScript进行开启或关闭。

组件是一个独立的视觉元素。模板在另一方面则是构建块。模板很少独自站在自己的角度去描述视觉和感觉，相反，它们是单一的、可重用的模式，可以放在一起形成组件。

为了提供更详细的例子，一个组件可能就是一个模式对话框。该模式可能在头部包含渐变的网站签名、或者在周围会有阴影、在右上角会有关闭按钮、位置固定在垂直与水平线中间。这四个模式可能被网站重复多次使用，所以在每次使用的时候，你都很少会想到重新编码与设计。这些所有的模板即形成了一个模块组件。

###因样式和风格使用类###

有过大型网站建设的人可能有个这样的经验，一个拥有类的HTML元素可能完全不知道其用途。你想删除它，但是又犹豫不决，因为它的作用你可能还未意识到。一旦这样的事情一遍又一遍发生的时候，随着时间的推移，项目中将会有越来越多这样的类，只因为团队成员都不敢删除。

在Web前端开发中，类承担了太多的责任，因此才会产生这样的问题。样式化HTML元素、扮演着JavaScript hook角色、功能检测、自动化测试等。当这么多应用程序在使用类时，让你从HTML中删除它们将会变的非常艰难。

然而，使用一些成熟的约定（惯例）即可完全避免这种问题。当在HTML中看到一个类时，你应该立即明白它的目的。我建议在前面使用前缀，例如用于JavaScript的在前面加.js，表示Modernizr classes可以在前面加.supports，没有加前缀的即用于表示样式。

这样来发现未使用的类和从HTML中移除它们将会变得非常简单。你甚至可以自动完成这一个过程，在JavaScript中通过交叉引用HTML中的document.styleSheets对象。如果在document.styleSheets中没有发现该类，即可安全移除。

一般来说，最佳做法是把内容与演示相分离，另外把功能分离开来也同样重要。使用样式类像JavaScript hook在某种程度上可以加深CSS与JavaScript之间的耦合，但在不打破功能性的前提下很难或者根本不可能更改外观。 

###有逻辑的命名类###

大多数写CSS的人喜欢使用连字符来分隔命名词，但连字符并不足以区分不同类型之间的类。

[Nicolas Gallagher](http://nicolasgallagher.com/)最近针对遇到的问题写了一个[解决方案](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/)，并且取得了巨大的成功（略有改动），为了说明命名约定，可以考虑以下格式：

<pre>
/* A component */ 
.button-group { }  
 
/* A component modifier (modifying .button) */ 
.button-primary { }  
 
/* A component sub-object (lives within .button) */ 
.button-icon { }  
 
/* Is this a component class or a layout class? */ 
.header { } 
</pre>

从上述类中可以发现其很难正确区分类型规则。这不但会困惑，而且连自动测试CSS和HTML也变的很难。一个结构化的命名约定应该是初看就能够知道其类名与其他类之间的关系，并且知道它出现在HTML中的位置——使命名更加简单和容易测试。

<pre>
/* Templates Rules (using Sass placeholders) */ 
%template-name  
%template-name--modifier-name  
%template-name__sub-object  
%template-name__sub-object--modifier-name  
 
/* Component Rules */ 
.component-name  
.component-name--modifier-name  
.component-name__sub-object  
.component-name__sub-object--modifier-name  
 
/* Layout Rules */ 
.l-layout-method  
.grid  
 
/* State Rules */ 
.is-state-type  
 
/* Non-styled JavaScript Hooks */ 
.js-action-name 
</pre>

重做第一个例子：

<pre>
/* A component */ 
.button-group { }  
 
/* A component modifier (modifying .button) */ 
.button--primary { }  
 
/* A component sub-object (lives within .button) */ 
.button__icon { }  
 
/* A layout class */ 
.l-header { } 
</pre>

##6.工具##

维护一个高效且组织良好的CSS架构是非常困难的，尤其是在大型团队中。下面向大家推荐几款很好的工具来帮你管理网站CSS架构。

###CSS Preprocessor###

CSS预处理器采用PHP5编写，有预处理器的常见功能，可以帮你快速编写CSS。另外有些号称“功能”的预处理器实际上并不会对CSS架构产生良好作用。下面我提供一个列表，在使用时一定要避免：

切勿纯粹为了组织代码来嵌套规则。只有当输出你真正想要的CSS时才可以。
在无需传递参数的时候切勿使用mixin，不带参数的mixin更适合用作模板，易扩展。
切勿在选择器上使用@extend，它不是个单一的类。从设计角度来看是毫无意义的，它会膨胀编译过的CSS。
在运用组件修饰符规则时，切勿使用@extend UI组件，这样会失去基础链。
@extend和%placeholder是预处理器里面非常好的两个功能。它们可以帮你轻松管理CSS抽象并且无需添加bloat和大量的基类到CSS和HTML里，否则将会很难管理。

当你初次使用@extend时，常会与修饰符类一起使用，例如：

<pre>
.button {  
  /* button styles */ 
}  
 
/* Bad */ 
.button--primary {  
  @extend .button;  
  /* modification styles */ 
} 
</pre>

这样做会让你在HTML中失去继承链。很难使用JavaScript选择所有的按钮实例。

作为一般规则，很少去扩展UI组件或者在知道类型后做些什么。这是区分模板和组件的一种方式，模板无需参与到应用程序的逻辑，并且可以使用预处理器进行安全扩展。

下面是一个引用上面的模式例子：

<pre>
.modal {  
  @extend %dialog;  
  @extend %drop-shadow;  
  @extend %statically-centered;  
  /* other modal styles */ 
}  
 
.modal__close {  
  @extend %dialog__close;  
  /* other close button styles */ 
}  
 
.modal__header {  
  @extend %background-gradient;  
  /* other modal header styles */ 
} 
</pre>

###CSS Lint###

[CSS Lint](http://csslint.net/)是由[Nicole Sullivan](http://www.stubbornella.org/)和[Nicholas Zakas](http://www.nczonline.net/)编写的一款代码质量检测工具，帮助CSS开发人员写出更好的代码。他们的网站上是这样介绍CSS Lint的：

CSS Lint是一个用来帮你找出CSS代码中问题的工具，它可做基本的语法检查以及使用一套预设的规则来检查代码中的问题，规则是可以扩展的。

使用CSS Lint建议：

* 不要在选择器中出现ID。
* 在多部分规则中，不要使用非语义（non-semantic）类型选择器，例如DIV、SPAN等。
* 在一个选择器中使用的连接符（combinator）不要超过2个。
* 任何类名都不要以“js-”开始。
* 如果在非“I-”前缀规则里经常使用布局和定位应给予警告
* 如果一个类定义后被重新定义成子类，也应给予警告。

##总结##

CSS不仅仅是视觉设计，也不要因为你编写CSS就随便抛出编程的最佳实践。像OOP、DRY、打开/闭合、与内容分离等这些规则应该应用到CSS里面。无论你如何组织代码，都要确保方法真正帮助到你，并且使你的开发更加容易和可维护的。

来自：[Appfolio Engineering Technical Blog](http://engineering.appfolio.com/2012/11/16/css-architecture/)

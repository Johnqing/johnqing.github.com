---
layout: post
title: Javascript 中的内存管理
---

来自：[http://blog.xiaoba.me/garbage-collection-in-javascript.html](http://blog.xiaoba.me/garbage-collection-in-javascript.html)

##简介##
在底层语言中，比如C，有专门的内存管理机制，比如malloc() 和 free()。而Javascript是有垃圾回收（garbage collection）机制的，也就是说JS解释器会自动分配和回收内存。这样就有人觉得，我用的是高级语言，就不用关心内存管理了，其实这是不对的。

##内存的生命周期##
尽管语言不尽相同，而每种语言中内存的生命周期都是相似的:

1. 当需要的时候分配内存

2. 对内存进行读写操作

3. 当上面分配的内存不再需要的时候，将他们释放掉

对于1,2两步，几乎所有语言操作起来都是明确地或者说很直观，没什么好说的。而在像Javascript一样的高级语言中，第三步操作就显得不那么直观。

##Javascript中分配内存空间##

##变量初始化##

当变量初始化的时候，Javascript会自动分配相应的内存空间（注：这里MDN上关于这里用的是Value initialization，到底是声明，还是在赋值时候分配空间，还要再学习一下）

<pre>
var n = 123; //  为数字分配空间
var s = "azerty"; // 字符串

var o = {
  a: 1,
  b: null
}; // 为对象和它包含的属性分配内存空间

var a = [1, null, "abra"]; // （类似对象）给数组和它里面的元素分配空间

function f(a){
  return a + 2;
} // 为函数分配空间

//  函数有时也会为分配对象空间
someElement.addEventListener('click', function(){
  someElement.style.backgroundColor = 'blue'; //个人补充，未考证，这里会为someElement分配空间，如注释所说，为对象分配空间
}, false);
</pre>

##函数调用时候分配空间##
有的函数调用，会产生上面说的那种 为对象分配空间

<pre>
var d = new Date();
var e = document.createElement('div'); // allocates an DOM element
</pre>

还有下面这种

<pre>
var s = "azerty";
var s2 = s.substr(0, 3); // s2 is a new string
// 由于Javascript中字符串是不可变的，所以Javascript也许并没有为s2中的字符串分配新空间，而是只存了[0, 3]的区间（用来索引）

var a = ["ouais ouais", "nan nan"];
var a2 = ["generation", "nan nan"];
var a3 = a.concat(a2); // 新的空间来存储数组a3
</pre>

##操作变量值##
没什么好说的，读、写、函数调用。

##内存不再被使用时，将它们释放掉##
许多内存管理机制的问题都出现在这里。最麻烦的问题是确认“这块内存空间已经不需要了”。这往往需要程序员告知，这个程序中，这块内存已经不需要了，你们回收吧。

而高级语言解释器中嵌入了一个叫做“垃圾回收（garbage collector）”的工具，用来跟踪内存分配和使用情况，以便在它们不需要的时候将其自动回收。然而有个问题，一块内存空间是不是还有用，是具有不确定性的，也就是说，这个是没法用算法精确算出来的。

##垃圾回收##
如上所述原因，垃圾回收机制采取了一种有限的解决方案来处理上面的不确定性问题。下面介绍集中垃圾回收算法的思想以及相应的局限:

##引用##
这种方法，用到了一种引用的思想。当a能访问A时，就说A引用了a（不论是直接还是间接的）。比如，一个Javascript对象会引用他的原型（间接引用）和它的各个属性（直接引用）。

这种情形下，对象就被扩展的更广义了，在原生对象的基础上，还包含了函数的作用域链（或者全局的词法作用域）。

##引用计数##
这种方法是最拿衣服（naive）的垃圾回收算法。它把“可以回收”的标准定义为“没有其他人引用这个对象”（原文：This algorithm reduces the definition of "an object is not needed anymore" to "an object has no other object referencing to it"）。也就是说，只有当对象没有被引用的时候，才会被当作垃圾回收掉。

##举个栗子##

<pre>
var o = { // 称之为外层对象
  a: { //称之为内层对象
    b:2
  }
}; //  创建了两个对象 内层对象作为外层对象的属性而被引用
// 而外层对象被变量o引用
// 显然，没有人会被垃圾回收

var o2 = o; // o2也引用了上面说的外层对象。好现在外层对象的引用计数为‘2’ (被o和o2引用)
o = 1; //  现在o不再引用外层对象，只有o2在引用，引用计数为 ‘1’

var oa = o2.a; // oa 引用内层对象
//  现在内层对象同时被作为外层对象的属性引用和被oa引用，引用计数为‘2’

o2 = "yo"; //  好，现在o2也不引用外层对象了，外层对象引用计数为“0”
// 意味着外层对象可以被“垃圾回收”了
// 然而，内层对象还被oa引用着，因此还是没有被回收 （个人注释：这里有一点闭包的意味）

oa = null; //  现在oa不引用内层对象了
// 内层对象也被垃圾回收
</pre>

##局限：循环引用##
看下面代码：

<pre>
function f(){
  var o = {};
  var o2 = {};
  o.a = o2; // o 引用 o2
  o2.a = o; // o2 引用 o

  return "azerty";
}

f();
// o o2两个对象构成了循环引用 
// 当函数执行完毕的时候，他们就被关在了f的作用域里面，没有外面的人可以使用他们
// 所以按理说，他们已经没有存在价值了，需要被垃圾回收，释放内存
// 然而，他们的引用计数都不为“0”
// 所以在这种引用计数的机制下，他们没有被回收
</pre>

##实际例子##
在IE6,7版本的浏览器中，就是使用的引用计数机制。因此，下面的代码在IE6,7中可以稳稳地发生内存泄漏

<pre>
var div = document.createElement("div");
div.onclick = function(){
  doSomething();
}; // div的onclick属性，会引用 function
// 然而这个 function 反过来又引用了这个div，因为div在handler的作用域里面。
// 造成上述循环引用，导致内存泄漏。 
</pre>

##标记清除算法##
这种算法把“可以回收”定义成“对象不可达”，即访问不到。

这种算法，会定义一个“根”，并且定期地从“根”出发，找出“根”下面的所有对象，看能不能从“根”找到一条路径引用到这个对象。从不同的“根”出发，垃圾回收程序就可以区分所有对象是不是“不可达”的，当对象“不可达”时候，便被回收。

这种算法比引用计数算法要好些。因为 “一个对象的引用计数是0”可以推出“这个对象不可达”，逆命题则为假。也就是说这种算法扩充了垃圾回收的范围。

##循环引用不再是困扰##
在上面的循环引用例子中，当函数返回时，o 和 o2都已经不再被任何人引用，也就是“不可达”了，便顺理成章地被垃圾回收掉了。

##局限：对象需要明确的“不可达”##
虽然说是局限，然而这种情况在实际当中很少发生，因此很少有人关注这一点。

原文：

> Although this is marked as a limitation, it is one that is rarely reached in practice which is why no one usually cares that much about garbage collection.

受英语水平限制，这一点没太理解，还是把原文搬过来好了。

##参考##
[IBM article on "Memory leak patterns in JavaScript" (2007)](http://www.ibm.com/developerworks/web/library/wa-memleak/)

[Kangax article on how to register event handler and avoid memory leaks (2010)](http://msdn.microsoft.com/en-us/magazine/ff728624.aspx)

##说明##
以上大部分文字来自Memory Management。尽量在保证不出错的前提下，加上了一些个人的注释和理解。虽然被MDN标注了 This article is in need of a technical review.，但是对于理解垃圾回收还是有一点帮助的吧。

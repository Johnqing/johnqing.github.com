---
layout: post
title: Object.create和深度拷贝的区别
category: f2e
---

今天在群里和 氧气桑一起扯淡引发的问题：

我的实现方案：

<pre>
var a = {x:1}
var b = copyObj(a);
console.log(a);

var k = b;
k.x = 2;
console.log(k);
console.log(b);

function copyObj(obj){
    var temp = {};
    for(var i in obj){
        if (obj.hasOwnProperty(i)) {
            temp[i] = copyObj(obj[i]);
        };
    }
    return temp;
}
</pre>

氧气桑的实现方案：

<pre>
var a = {x:1}
var b = copyObj2(a);
console.log(a);

var k = b;
k.x = 2;
console.log(k);
console.log(b);

function copyObj2(o){
    function F(){}
    F.prototype = o;
    return new F();
}
</pre>

总结：

+ 氧气桑的实现方案有以下几个问题
拷贝的对象会赋值给_proto_，2次赋值给x时，x没有被改掉
查找时会搜索到原型上，影响性能

+ 我的实现方案使用了递归性能有考研

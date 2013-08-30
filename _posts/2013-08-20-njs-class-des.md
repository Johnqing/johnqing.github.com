---
layout: post
title: n.js中类的包装器的设计思路
---

> n.class.js是n.js关于类的包装器，接口为 n.Class();

n.Class(parentClass, data)主要实现了2个接口：

1. parentClass为父类，该参数如果不传入，自身为基类
2. data该参数是 当前类的构造器、共有方法集合、私有方法集合的对象集合。共有三个参数Init,Public,Private

n.class.js主要是借鉴了，java的类的实现模式。通过构造器（Init）、共有函数（Public）和 私有函数 （Private）三块完成了整个类的构建

内部通过klass私有方法 来完成类的解析构建

当有父类传入的时候 内部私有方法 klass把 父类的prototype 复制后 合并到该当前klass的 prototype上，然后合并到 this上

通过拆分data上的 三个参数 来 构建 构造器 、 共有函数 、私有函数，并改变 他们的上下文

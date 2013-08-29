---
layout: post
title:  "Java线程的中止方法"
tags: 线程
---
java 线程中止是不能直接调用stop的，而是用一个中止标志，中止操作时先将其设置为true，接着调用interupt方法。

比如在一个线程执行体中循环读取网络输入流时，interrupt触发后，根据中止标志位的值就可以判断是否退出循环操作了。


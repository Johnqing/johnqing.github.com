---
layout: post
title: js栈和队列
category: js
---

先来一段百度百科：

> 堆栈（英文：stack），也可直接称栈。台湾作堆叠，在计算机科学中，是一种特殊的串行形式的数据结构，它的特殊之处在于只能允许在链结串行或阵列的一端（称为堆栈顶端指标，英文为top）进行加入资料（push）和输出资料（pop）的运算。另外堆栈也可以用一维阵列或连结串行的形式来完成。堆栈的另外一个相对的操作方式称为伫列。

> 队列是一种特殊的线性表，它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作。进行插入操作的端称为队尾，进行删除操作的端称为队头。队列中没有元素时，称为空队列。
 在队列这种数据结构中，最先插入的元素将是最先被删除的元素；反之最后插入的元素将是最后被删除的元素，因此队列又称为“先进先出”（FIFO—first in first out）的线性表。
 队列空的条件：front=rear
 队列满的条件： rear = MAXSIZE

> 图片示例：黑色箭头表示进入，红色表示弹出

栈就是后进先出

![stack](https://f.cloud.github.com/assets/2571697/365730/55adecfe-a258-11e2-9b59-59eb94a61a61.png)

队列就是先进先出

![queue](https://f.cloud.github.com/assets/2571697/365732/631f7678-a258-11e2-9322-d1e8895ba36f.png)

#### 数组栈模拟
<pre>var arrStack = [];
 arrStack.push(1);
 arrStack.push(2);
 arrStack.push(3);
 console.log(arrStack);

 var x = arrStack.pop();
 console.log(x);

 console.log(arrStack);
</pre>

#### 数组队列模拟
<pre>var arrQueue = [];
 arrQueue.push(1);
 arrQueue.push(2);
 arrQueue.push(3);
 console.log(arrQueue);

 var x = arrQueue.shift();
 console.log(x);

 console.log(arrQueue);
</pre>


有了上面的例子，我们可以简单的做一下封装：

**栈：**
<pre>
(function(win){
    var Stack = function(){
        this.arr = [];
    }
    Stack.prototype = {
        push: function(){
            var arg = arguments;
            if(arg.length <= 0){
                return this;
            }
            if(arg.length === 1 &&  arg[0] === "Array"){
                this.arr = arg[0];
                return;
            }
            for(var i = 0, len = arg.length; i < len; i++){
                this.arr.push(arg[i]);
            }
        },
        pop: function(){
            if(this.arr.length <= 0){
                return;
            }
            return this.arr.pop();
        },
        getSize: function(){
            return this.arr.length;
        },
        getArr: function(){
            return this.arr;
        },
        setEmpty: function(){
            this.arr.length = 0;
        }
    }
    win.stack = new Stack();
}(this))
stack.push(1,2,3,4)
console.log(stack.getArr());
var x = stack.pop();
console.log(x);
console.log(stack.getArr());
</pre>

**队列：**
<pre>
(function(win){
    var Queue = function(){
        this.arr = [];
    }
    Queue.prototype = {
        push: function(){
            var arg = arguments;
            if(arg.length <= 0){
                return this;
            }
            if(arg.length === 1 &&  arg[0] === "Array"){
                this.arr = arg[0];
                return;
            }
            for(var i = 0, len = arg.length; i < len; i++){
                this.arr.push(arg[i]);
            }
        },
        shift: function(){
            if(this.arr.length <= 0){
                return;
            }
            return this.arr.shift();
        },
        getSize: function(){
            return this.arr.length;
        },
        getArr: function(){
            return this.arr;
        },
        setEmpty: function(){
            this.arr.length = 0;
        }
    }
    win.queue = new Queue();
}(this))
queue.push(1,2,3,4)
console.log(queue.getArr());
var x = queue.shift();
console.log(x);
console.log(queue.getArr());
</pre>
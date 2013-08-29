---
layout: post
title: 观察者模式
category: js
---

> 观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听一个主题对象。
这个主题对象在状态上发生变化时，会通知所有观察者，使它们能够自动更新自己。

###使用观察者模式的好处：###

+ 支持简单的广播通信，自动通知所有已经订阅过的对象。
+ 页面载入后目标对象很容易与观察者存在一种动态关联，增加了灵活性。
+ 目标对象与观察者之间的抽象耦合关系能够单独扩展以及重用。

<pre>
var events = {

    /*
    * 添加 name 对应的 事件callback，保存在this._events里
    */
    on: function( name, callback ){
        this._events || (this._events = {});    //确保this._events存在
        this._events[name] = this._events[name] || [];//确保this._events[name]存在
        this._events[name].push({ callback: callback });//将callback 添加到 this._events[name] 内
    },

    /*
    * 执行已经保存在this._events里的 name 对应的事件
    */
    trigger : function( name ){
        //将参数中除 name 外的其它参数取出来
        var args = Array.prototype.slice.call( arguments, 1 );
        //确保 this._events[name] 存在
        if( this._events && this._events[name] ){
            //循环执行里面的callback
            for( var i = 0; i < this._events[name].length; i++){
                //将步骤一取出的值作用callback的参数
                this._events[name][i].callback.apply( this, args );
            }
        }
    },

    /*
    * 删除this._events里 name 对应的事件
    */
    off: function( name ){
        if( this._events ){
            //删除  this._events[name]
            delete this._events[name];
        }
    }
}

var Company = function(opts){
    this.jobContent = opts.jobContent;
}

Company.prototype = events;
Company.prototype.setJobConten = function(job){
    this.trigger('setJobConten', job);
    this.jobContent = job;
    return this;
}
/**
 * 实例化
 */
var apple = new Company({'jobContent': '业务员'});

apple.on('setJobConten', function( job ){
    console.log('执行一次 __ ' + job );
});

apple.on('setJobConten', function( job ){
    console.log('执行二次 __ ' + job );
});
/*
* 测试
*/
apple.setJobConten('程序员');
apple.setJobConten('xx官员');
apple.off('setJobConten');
apple.setJobConten('某特殊行业');
</pre>








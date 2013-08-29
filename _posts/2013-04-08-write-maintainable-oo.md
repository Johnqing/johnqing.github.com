---
layout: post
title: （译）如何编写可维护的面向对象javascript
category: js
---


原文地址：[How to Write Maintainable OO JavaScript Code](http://msdn.microsoft.com/en-US/scriptjunkie/gg602402.aspx?utm_source=javascriptweekly&utm_medium=email)

利用面向对象的方法编写javascript能帮你省钱，而且也会让你的代码看起来更酷。不相信？要么你或者别人会回来维护你的代码。而容易维护的代码更容易节省如金钱般宝贵的时间。也会让你在团队中更受欢迎，因为你刚刚让他们从头疼中解脱出来。在我们写面向对象代码之前，需要先大致了解一下什么是OO。如果你觉得你对OO已经足够了解，可以直接跳过这段。

####什么是OO

面向对象编程可以比较基本地展现你代码中抽象自现实物质的对象。在代码中创建一个对象，我们需要先创建一个类。类几乎可以表示任何东西：账户，雇员，导航菜单，车辆，植物，广告，饮料，等等。然后，每次你创建一个对象，你要从一个类中继承下来。换句话说，你创建了类的一个实例，从而提供了一个可以操作的对象。实际上，使用对象的最佳时机就是当你要应付多个食物。否则，一个简单的函数型程序也会表现的一样好。对象本质上是一个数据的容器。比如在雇员的对象中，你可以存进他们的雇工号，名字，起始时间，头衔，薪资，特权等等…对象也包括了一些函数（也叫做方法）去操作数据。方法也可以用来充当一个中间人来确保数据完整。这个中间人通常用来在存储前转换数据。比如，一个方法可以接受一个任意格式的数据然后把这个数据转换成标准数据并存储进去。最后类可以继承自其他类。继承机制允许你去重用其他类的代码。比如，银行账户类和影音商店帐号类可以都继承自一个基础帐号类，这个基础帐号的类可以提供一些配置信息，帐号创建时间，分支信息等等。然后，每一个继承出来的类都可以定义自己的汇报和租金，控制数据结构和方法。

####注意：javascript OO是不同于其他语言的OO的

在前一节我已经指出了一个基于类的面向对象编程的基本特点。我把它成为基于类的编程，因为javascript并不遵守这些规则。javascript类是以函数的形式表现，继承方法是用基于原型的方式实现。原型继承和其他类的继承有很大的区别，他们是继承自含有原型属性的对象。

####对象的实例化

这里有一个实例化对象的例子。

<pre>// Define the Employee class
function Employee(num, fname, lname) {
    this.getFullName = function () {
        return fname + " " + lname;
    }
};
 
// Instantiate an Employee object
var john = new Employee("4815162342", "John", "Doe");
alert("The employee's full name is " + john.getFullName());
</pre>

有一些地方必须得注意一下：

1. 我将类名的首字母大写了。这个重要的区别可以让人们知道这是一个用来实例化的类，而不是作为一个普通方法来调用的。
2. 我使用”new”操作符来实例化类。如果在实例化的时候忘了写上new会导致直接执行这个函数。
3. getFullName这个方法是对外开放的，因为这个方法是注册在this对象上的，而fname和lname是私有的变量，不对外开放。Employee函数创建的闭包允许getFullName函数去访问fname和lname，而让其他方法都无法直接访问到fname和lname。

####原型继承

这里有一个原型继承的例子

<pre>// Define Human class
function Human() {
    this.setName = function (fname, lname) {
        this.fname = fname;
        this.lname = lname;
    }
    this.getFullName = function () {
        return this.fname + " " + this.lname;
    }
}
 
// Define the Employee class
function Employee(num) {
    this.getNum = function () {
        return num;
    }
};
// Let Employee inherit from Human
Employee.prototype = new Human();
 
// Instantiate an Employee object
var john = new Employee("4815162342");
    john.setName("John", "Doe");
alert(john.getFullName() + "'s employee number is " + john.getNum());
</pre>

我创建了一个Human类，里面包括了一些人类应该有的属性–我也在Human类里设置了fname和lname，因为所有的人类，不仅仅是雇员才有名字。然后我让雇员类的原型指向Human对象，这样就扩展了雇员类的属性。

####通过继承的方式重用代码

在前一个例子里，我将原来的Employee类分割成两个。我把所有一个人类应该有的属性都转移到Human类里，然后让Employee类去继承Human类的属性。这样的话，Human类里有的属性可以继承给其他对象，比如Student, Client, Citizen, Visitor等等。这是一个非常棒的方式去重用代码，这样我们就不用重复地给每一个对象设置重复的属性。而且如果我们想增加一个属性，比如say，或者middle name，那么我们只需要修改一次就可以让所有的继承自Human类的类都拥有这个属性。相反，如果我们只想增加一个middle name属性给一个对象，我们可以直接修改这个对象，而不用去修改Human

####公有和私有属性

我比较喜欢去提及类里的公有和私有变量。根据你对数据不同的操作，你会想把数据分为公有数据和私有数据。一个私有的属性并不代表其他人不想访问，只是你希望别人能通过你提供的一个方法来操作数据。

####只读属性

有时候，你只想让一个值在对象被创建的时候只定义一次。这个值定义之后，你不想任何人来修改这个值。为了做到这个，你可以创建一个私有变量，然后在实例化这个类的时候设置它的值

<pre>function Animal(type) {
    var data = [];
    data['type'] = type;
    this.getType = function () {
        return data['type'];
    }
}

var fluffy = new Animal('dog');
fluffy.getType(); // returns 'dog'
</pre>

在这个例子里，我在Animal类里创建了一个数组data。当一个Animal对象被实例化的时候，type的值会传进来，然后设置data的值。这个值不能被重写，因为他是Animal类私有的。读取type值的唯一一个方式就是实例化之后调用你提供getType方法。因为getType是在Animal类内部定义的，它可以访问data。这样，人们就可以读取这个对象的type值，但是不能修改。

但是有一点很重要，这个让类内部值只读的方法在另外一个对象继承其之后会失效。每一个对象的实例都可以共享这些只读的变量，然后对其进行重写。最简单的解决方法就干脆让这个属性都变成公有属性算了。如果你一定要让它们保持私有，你可以用Philippe的方法

####公有方法

有些时候，你希望一些属性能够被读取，也能被修改。那么，你需要通过这样的方法来让属性开放出来

<pre>function Animal() {
    this.mood = '';
}
 
var fluffy = new Animal();
fluffy.mood = 'happy';
fluffy.mood; // returns 'happy'
</pre>

现在在我们的Animal类里开放了一个叫做mood的属性，它可以被读取也可以被修改。你可以分配一个函数去操作这个属性。小心不要让一个值指向属性，不然你会因为你设置的值而破坏这个属性。

####完全私有

最终，你或许也发现在某个时候，你需要一个完全私有的局部变量。这种情况下，你可以使用像第一个例子那样，不过不需要创建公有方法。

<pre>function Animal() {
    var secret = "You'll never know!"
}
 
var fluffy = new Animal();
</pre>

####写出一个灵活的API

现在我们已经把类的创建讲完了，我们需要对其进行进一步修改，这样我们就可以跟进项目的需求变化。如果你修改了任意一个项目，或者长期维护一个产品，你会经常遇到项目需求的变化。这是现实工作中肯定存在的。有时候，你还在写代码的时候可能就会因为需求变化而让代码都作废了。你可能突然会需要给标签表单一个动画，或者通过Ajax调用抓取数据。虽然不可能预测到未来的变化，但是我们仍然需要努力去写出能够尽量适应未来可能需求的代码。

####Saner参数列表

有一个为未来作准备的方法就是设计参数列表。这是一个很重要的方法来解决那些不确定的需求。你需要避免这样的参数列表：

<pre>function Person(employeeId, fname, lname, tel, fax, email, email2, dob) {
};
</pre>

这样一个类是非常脆弱的。如果你在代码已经发布之后想添加一个middle name参数。因为次序的问题，你不得不在列表的最后来加入这个。这样做显得非常笨拙。如果你并没每一个参数的值，那么，传递参数会很麻烦。比如：

<pre>var ara = new Person(1234, "Ara", "Pehlivanian", "514-555-1234", null, null, null, "1976-05-17");</pre>

一个更加整洁，更加灵活的方式去传递参数的方式是这样的：

<pre>function Person(employeeId, data) {
};</pre>

第一个参数保留，因为它是必须的。剩下的都可以整到一个对象里，这样就灵活多了

<pre>var ara = new Person(1234, {
    fname: "Ara",
    lname: "Pehlivanian",
    tel: "514-555-1234",
    dob: "1976-05-17"
});</pre>


这个方法的优异之处在于易于读取数据，而且也非常灵活。我们可以注意到fax,email和email2都完全被移除。因为对象不需要特地的顺序，所以添加一个middle name参数只需要直接把它扔进去。

<pre>var ara = new Person(1234, {
    fname: "Ara",
    mname: "Chris",
    lname: "Pehlivanian",
    tel: "514-555-1234",
    dob: "1976-05-17"
});
</pre>

类内部的代码也不需要考虑参数的顺序，因为我们是这样调用的：

<pre>function Person(employeeId, data) {
this.fname = data['fname'];
};
</pre>

如果data['fname']返回一个值，那么它就被赋值了。否则，它就没有被赋值。

####让类插件化

随着时间的推进，产品需求或许会是要在类里添加特定的行为。而这个行为经常和你的类核心方法没有关系。也有可能只有一个实施类的需求，比如当抓取外部数据时，让tab标签对应的内容消失。你也许可以试着把这些功能放进你的类，但是他们并不属于这个类。一个tab效果的职责去管理tab标签。动画效果和数据抓取完全是两个分离开来的方法。需要在tab之外维护。唯一一个方法去让你的tab适应未来需求，让临时方法调用自外部，就是允许人们去在你的代码中添加插件。换句话说，允许人们去挂载行为， 就像onTabChange, afterTabChange, onShowPanel, afterShowPanel等等。这样的话，他们就可以很简单的挂载你的onShowPanel事件，写一个控制方法来让一块内容渐渐消失，而且也减轻了大家的压力。javascript库可以让你非常轻松的完成这件事情，不过你自己来完成也不会太难。这里有一个基于YUI3的简单例子：

<pre>&lt;script type="text/javascript" src="http://yui.yahooapis.com/combo?3.2.0/build/yui/yui-min.js"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
    YUI().use('event', function (Y) {
 
        function TabStrip() {
            this.showPanel = function () {
                this.fire('onShowPanel');
 
                // Code to show the panel
 
                this.fire('afterShowPanel');
            };
        };
 
        // Give TabStrip the ability to fire custom events
        Y.augment(TabStrip, Y.EventTarget);
 
        var ts = new TabStrip();
 
        // Set up custom event handlers for this instance of TabStrip
        ts.on('onShowPanel', function () {
            //Do something before showing panel
        });
        ts.on('onShowPanel', function () {
            //Do something else before showing panel
        });
        ts.on('afterShowPanel', function () {
            //Do something after showing panel
        });
 
        ts.showPanel();
    });
&lt;/script&gt;</pre>


这个例子有一个简单的含有showPanel方法的TabStrip类。这个方法会绑定了两个事件，onShowPanel和afterShowPanel。将Y.EventTarget合并到你的类中就可以实现这样的绑定。完成之后，我们实例一个TabStrip对象，然后分配一个对应事件控制方法。这就是一个典型的代码，用于控制实例中独特的行为，也不会污染目前的类。

####总结

如果你有计划在同一页面，同一站点或者多个项目中重用代码，想要通过类的形式将其整理和组织。面向对象的javascript非常自然地提供了更加好的组织和重用能力。只要你稍微深谋远虑一下，你就可以确定你的代码在长期内都是足够灵活的。写出可重用，适应未来的javascript会节约你，你的团队和你的公司的事件和金钱。它当然也能让你变的更酷

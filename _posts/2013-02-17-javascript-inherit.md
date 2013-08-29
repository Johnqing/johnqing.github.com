---
layout: post
title: javascript继承
category: js
---


继承是面向对象编程中很重要的一个工具，但是JavaScript不像其他语言那样显式的支持继承，而是使用一种叫做原型的东西来支持继承。

<pre>function Person(name){
  this.name = name;
}
var person1 = new Person("liMing");
</pre>

如上所示，这是一个最基本的构造函数，JavaScript中的函数用new执行时，会返回一个新的对象，函数体中的this就指代这个即将产生的新对象。

现在我们可以通过Person来产生很多代表人的对象，但我还想加一个属性species物种，表示人只不过是个动物而已，所以不要把人想的太高级。

这个属性所有的人都是一样的，如果放在Person里this.species="animal" 每生成一个对象就赋值一次的话就产生了重复。

所以JavaScript就用一种东西来存放一类对象共有的属性或者方法Person.prototype.species="animal" 实际上，每一个函数创建时都会产生一个指针prototype指向一个叫做原型对象的东西，而当构造函数产生新实例的时，新实例也有一个指针[[prototype]]指向这个原型对象。

执行person1.species时，会先在实例本身上查找有没有species属性，如果有，则返回之，如果没有，就通过[[prototype]]找到原型对象，在它上查找有没有需要的属性，如果还没有，继续通过原型指针往下一个对象查找。这就是原型链。

实际上，JavaScript所有对象都是Object的实例，所以最后都会查找到Object.prototype,有很多有用的函数都是定义在这里的。

通过上面的查找顺序可知，当在实例上找到属性时就不会再向上原型中查找，<span style="color:#f00">所以实例中的同名属性会屏蔽原型链中的属性。</span>

<pre>function Person(name,friends){
  this.name = name;
  this.friends = friends;
}
Person.prototype = {constructor:Person,  //constructor在这里不重要，请自行搜索
                  species:"animal",
  	  characteristic:["selfish"]};
</pre>

这样我们就有了一个不错的抽象，实例各自不同的属性在构造函数中，共有的属性或方法在它的原型对象中。接下来我们实现继承，创建一个Chinese类，最直接的想法就是

<pre>function Chinese(name,friends){
	Person.apply(this,arguments);//调用父类的构造函数,apply第一个参数是上下文，第二个是参数
	this.nationality = "china";
}
Chinese.prototype = Person.prototype;
</pre>

让我们试一试var c = new Chinese("baoQiang",["xuZheng"]);，貌似不错的完成了继承，既有国籍属性，也有自私等等。。。但是这种方法有一个问题:

子类的原型对象直接指向父类的原型对象，如果我们给子类在prototype上加一点方法比如中国特色社会主义，那么父类的实例也能访问到了，这明显是不对的，万恶的美帝怎么可能理解中国特色社会主义呢，所以我们要加以改进。

将最后一行改成: Chinese.prototype = new Person(); 因为这里Chinese的原型指向了一个新的对象，所以修改它不会影响到父类的原型。

而且name，friends属性也成为了原型中的属性，由于我们在构造函数中又重复生成了实例属性name，friends，所以屏蔽了原型中的，不会影响使用。这种继承方法是现在最流行的实现。
但是也存在问题，调用了2次父类的构造函数导致在子类实例和原型中有重复的属性，虽然不影响使用，但是不优雅。有洁癖的人们就想出了另一种方法。

<pre>function clone(o){
  function F(){}
  F.prototype = o;
  return new F();
}
Chinese.prototype = clone(Person.prototype);
</pre>

首先，在clone函数中，使用了一个临时的构造函数F加入了一层隔离开了，使子类原型不会影响到父类原型。

其次，这个F的实例只有父类Person的原型属性，没有实例私有属性，所以是一个洁净的实例对象，则不会在子类Chinese的原型中产生重复的属性。

<div>总结：用原型链继承共享的属性和方法，而通过构造函数继承实例属性。</div>
{% include references.md %}

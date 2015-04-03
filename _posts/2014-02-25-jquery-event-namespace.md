---
layout: post
title: jQuery事件命名空间
---

> 今天群里的同学突然很疑惑的问：`this.$element.on('keyup.dismiss.bs.modal',function{})` 这段代码里的 `keyup.dismiss.bs.modal` 是啥？

## 命名空间
*复制一份*维基百科的说法：

命名空间（英语：Namespace）表示标识符（identifier）的可见范围。一个标识符可在多个命名空间中定义，它在不同命名空间中的含义是互不相干的。这样，在一个新的命名空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其它命名空间中。

简单点说：

假如网吧里有好多人，都没有名字的话，你妈妈喊你回家吃饭的时候，该怎么叫谁呢？
所以聪明的妈妈，给你起了一个名字，下次妈妈只需要站在门口大喊一声“xx，回家吃饭了！”


## jQuery命名空间的出现

> 注意这里说的只是jquery1.7，因为它推荐大家使用 `on` 代替以前的 `bind`，使用 `off` 代替以前的 `unbind`。因为所有的事件都是通过 `on` 来绑定的。

好嘞！绑一个试试

```javascript
$(document).on('click', function(){
  ....
});
```

挺好用，为了不让它多次触发，我要解绑掉

```javascript
$(document).off('click')
```

细心的同学可能已经发现了，如果我只想解绑某个特定的事件，就比较蛋疼了，举个栗子！

```javascript
$(document).on('click', function(){
  console.log(1111);
});
$(document).on('click', function(){
  console.log(222);
});
$(document).on('click', function(){
  console.log(333);
});
```

我觉得 打印出111的比较不合群，想踢出去，这时候会不会很无语呢？

聪明的你马上想到 我可以这样啊！

```javascript
function a(){
  console.log(1111);  
}

$(document).on('click', a);
$(document).off('click', a);
```

是滴！ 你可以这样！但是你不觉得很麻烦么？

我们可以这样

```javascript
$(document).on('click.a', function(){
  console.log(123);
})
$(document).off('click.a');
```

该方法最早出现在[jQuery1.3.2](http://code.jquery.com/jquery-1.3.2.js)中

代码实现如下（1.3.2中的实现）：

```javascript
// Namespaced event handlers
var namespaces = type.split(".");
type = namespaces.shift();
handler.type = namespaces.slice().sort().join(".");

// Get the current list of functions bound to this event
var handlers = events[type];

if ( jQuery.event.specialAll[type] )
  jQuery.event.specialAll[type].setup.call(elem, data, namespaces);

// Init the event handler queue
if (!handlers) {
  handlers = events[type] = {};

  // Check for a special event handler
  // Only use addEventListener/attachEvent if the special
  // events handler returns false
  if ( !jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem, data, namespaces) === false ) {
    // Bind the global event handler to the element
    if (elem.addEventListener)
      elem.addEventListener(type, handle, false);
    else if (elem.attachEvent)
      elem.attachEvent("on" + type, handle);
  }
}
```

## 命名空间配合trigger的使用

```javascript
$(document).on('click.a', funciton(){
  console.log(111);  
});
$(document).on('click', funciton(){
  console.log(222);  
});

$(document).trigger('click.a');

//output: 111

```

还可以这样

```javascript
$(document).on('click.a', funciton(){
  console.log(111);  
});
$(document).on('click', funciton(){
  console.log(222);  
});

$(document).trigger('click!');

//output: 222

```

### 注意：

`!` 在jquery1.9之后被删除相应实现


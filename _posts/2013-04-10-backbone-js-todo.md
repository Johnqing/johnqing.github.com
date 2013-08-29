---
layout: post
title: （转）backbone.js实例Todo阅读笔记
category: js
---

> 来源：[小强](http://www.xiaoqiang.org/javascript/backbone-js-todo.html)

<pre>// 一个backbone的实例，作者：
     // [Jérôme Gravel-Niquet](http://jgn.me/). 这个demo使用了
     // [LocalStorage adapter](backbone-localstorage.js)
     // 你可以在浏览器中演示它.

     //当DOM载入完之后加载应用:
     $(function() {

         // Todo Model
         // 基础 **Todo** model 拥有 `title`, `order`, 和 `done` 属性.
         var Todo = Backbone.Model.extend({

             // todo的默认属性.
             defaults : {
                 title : "empty todo...",
                 done : false
             },

             // 保证每个model创建的时候都有`title`.
             initialize : function() {
                 if(!this.get("title")) {
                     this.set({
                         "title" : this.defaults.title
                     });
                 }
             },
             // 切换`done`状态.
             toggle : function() {
                 this.save({
                     done : !this.get("done")
                 });
             },
             // 将Todo从*localStorage*和视图中删除.
             clear : function() {
                 this.destroy();
             }
         });

         // Todo 列表
         // ---------------

         // 列表存储在*localStorage*中，代替存储在服务器中
         var TodoList = Backbone.Collection.extend({

             // 关联列表的 model.
             model : Todo,

             // 以`"todos"`名字空间保存所有Todo.
             localStorage : new Store("todos-backbone"),

             // 过滤已完成的Todo.
             done : function() {
                 return this.filter(function(todo) {
                     return todo.get('done');
                 });
             },
             // 过滤列表，保留未完成的Todo.
             remaining : function() {
                 return this.without.apply(this, this.done());
             },
             // 尽管我们在localStorage中是无序存储的，但是我们还是按顺序读取和保存的
             nextOrder : function() {
                 if(!this.length)
                     return 1;
                 return this.last().get('order') + 1;
             },
             // 按照原来的顺序保存.
             comparator : function(todo) {
                 return todo.get('order');
             }
         });

         // 创建一个全局列表 **Todos**.
         var Todos = new TodoList;

         // Todo Item View
         // --------------

         // todo item的DOM元素
         var TodoView = Backbone.View.extend({

             //列表标签.
             tagName : "li",

             // 为单个元素缓存模板.
             template : _.template($('#item-template').html()),

             // 单个元素的DOM事件.
             events : {
                 "click .toggle" : "toggleDone",
                 "dblclick .view" : "edit",
                 "click a.destroy" : "clear",
                 "keypress .edit" : "updateOnEnter",
                 "blur .edit" : "close"
             },

             // TodoView视图监听 model的事件变化,重新渲染, **Todo** 和 **TodoView** 成一一对应的关系.
             initialize : function() {
                 this.model.bind('change', this.render, this);
                 this.model.bind('destroy', this.remove, this);
             },
             // 重新渲染单条todo的title.
             render : function() {
                 var $el = $(this.el);
                 $el.html(this.template(this.model.toJSON()));
                 $el.toggleClass('done', this.model.get('done'));

                 this.input = this.$('.edit');
                 return this;
             },
             // 切换model的`"done"`状态.
             toggleDone : function() {
                 this.model.toggle();
             },
             // 切换视图为`"editing"`,显示输入框.
             edit : function() {
                 $(this.el).addClass("editing");
                 this.input.focus();
             },
             // 关闭`"editing"`视图, 保存改变数据到Todo.
             close : function() {
                 var value = this.input.val().trim();

                 if(!value)
                     this.clear();

                 this.model.save({
                     title : value
                 });
                 $(this.el).removeClass("editing");
             },
             // 如果输入 `enter`回车键, 保存编辑项目.
             updateOnEnter : function(e) {
                 if(e.keyCode == 13)
                     this.close();
             },
             // 移除单条Todo，销毁model.
             clear : function() {
                 this.model.clear();
             }
         });

         // The Application
         // ---------------

         // **AppView**是最外层层UI.
         var AppView = Backbone.View.extend({

             // 使用页面上已有的HTML结构.
             el : $("#todoapp"),

             // app底部统计的模板.
             statsTemplate : _.template($('#stats-template').html()),

             // 为新建Todo和清除已完成Todo创建事件代理.
             events : {
                 "keypress #new-todo" : "createOnEnter",
                 "click #clear-completed" : "clearCompleted",
                 "click #toggle-all" : "toggleAllComplete"
             },

             // 初始化的时候绑定 `Todos`列表的事件，add事件会添加到 *localStorage*.
             initialize : function() {

                 this.input = this.$("#new-todo");
                 this.allCheckbox = this.$("#toggle-all")[0];

                 Todos.bind('add', this.addOne, this);
                 Todos.bind('reset', this.addAll, this);
                 Todos.bind('all', this.render, this);

                 this.$footer = this.$('footer');
                 this.$main = $('#main');

                 Todos.fetch();
             },
             // 重新渲染只是刷新统计，其他不变.
             render : function() {
                 var done = Todos.done().length;
                 var remaining = Todos.remaining().length;

                 if(Todos.length) {
                     this.$main.show();
                     this.$footer.show();

                     this.$footer.html(this.statsTemplate({
                         done : done,
                         remaining : remaining
                     }));
                 } else {
                     this.$main.hide();
                     this.$footer.hide();
                 }

                 this.allCheckbox.checked = !remaining;
             },
             // 添加一个Todo项，并插入到`<ul>`中.
             addOne : function(todo) {
                 var view = new TodoView({
                     model : todo
                 });
                 this.$("#todo-list").append(view.render().el);
             },
             // 一次把所有的Todo添加到 **Todos** 列表中.
             addAll : function() {
                 Todos.each(this.addOne);
             },
             // 新建一个Todo赋予属性.
             newAttributes : function() {
                 return {
                     title : this.input.val().trim(),
                     order : Todos.nextOrder(),
                     done : false
                 };
             },
             // 在input中按回车键会新建一个**Todo** model并且保存到*localStorage*.
             createOnEnter : function(e) {
                 if(e.keyCode != 13)
                     return;
                 if(!this.input.val().trim())
                     return;

                 Todos.create(this.newAttributes());
                 this.input.val('');
             },
             // 清除所有已完成Todo models.
             clearCompleted : function() {
                 _.each(Todos.done(), function(todo) {
                     todo.clear();
                 });
                 return false;
             },
             toggleAllComplete : function() {
                 var done = this.allCheckbox.checked;
                 Todos.each(function(todo) {
                     todo.save({
                         'done' : done
                     });
                 });
             }
         });

         // 创建一个 **App**.
         var App = new AppView;
     });</pre>
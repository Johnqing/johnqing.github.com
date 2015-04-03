---
layout: post
title: NTpl模板引擎使用
---

> NTpl模板引擎是博主自己开发的一款轻量级的模板引擎

##描述##

提供一套模板解析语法，用户可以写一个模板块，每次根据传入的数据，
生成对应数据产生的HTML片段，渲染不同的效果。


##优势##

1. 使用Javascript原生语法，学习成本低
2. 变量未定义自动输出为undefined,方便用户调试
3. 分隔符可自定义

##用法##

1. 引入nTpl.js是必须的
2. 可以使用任何容器存储模板片段(示例中使用textarea作为容器)
{% highlight html %}
<!--textarea作为容器的好处是浏览器不会解析-->
<textarea id="tpl" style="display:none">
    <h1>title:<%= title %></h1>
        <% if(list.length>1) { %>
            <h2>输出list，共有<%= list.length %>个元素</h2>
            <ul>
                <% for(var i=0;i<5;i++){ %>
                    <li><%= list[i] %></li>
                <% } %>
            </ul>
        <% }else{ %>
            <h2>没有list数据</h2>
        <% } %>
</textarea>
{% endhighlight %}
3. 模板也可以直接存储在一个变量中（下面的例子：可以在[这里](https://github.com/Johnqing/SocialCard/blob/master/assets/js/controller.js)找到）
{% highlight javascript %}
 var tpl = '<% for(var i=0; i<data.length; i++){ %>'+
              '<div class="familyName">'+
                  '<span><%= data[i].name %></span>'+
                  '<dl>'+
                  '<% for(var j=0, family=data[i].family; j<family.length; j++){ %>'+
                      '<dd class="<%= family[j].type %>"><%= family[j].name %></dd>'+
                  '<% } %>'+
                  '</dl>'+
              '</div>'+
          '<% } %>';
{% endhighlight %}

##调用##

1. 数据
{% highlight javascript %}
var data={
    "title":'啊哦~这是标题',
    "list":[
        'test1:这是内容',
        'test2:2',
        'test3:3',
        'test4:第五项未定义，模板系统会输出空'
    ]
};
{% endhighlight %}

2. NTpl是该模板引擎的命名空间
{% highlight javascript %}
NTpl.tpl
{% endhighlight %}
3. tpl接收容器id
{% highlight javascript %}
NTpl.tpl('id', data);
{% endhighlight %}
4. tpl也接收字符串
{% highlight javascript %}
NTpl.tpl('<div><%= name %></div>', data);
{% endhighlight %}
5. 插入容器
{% highlight javascript %}
document.getElementById('result').innerHTML = res;
{% endhighlight %}

##模板语法##

###分隔符为<%%>（可自定义）###

####自定义实例如下####

模板
{% highlight html %}
<h1>title:<#= title #></h1>
<# if(list.length>1) { #>
    <h2>输出list，共有<#= list.length #>个元素</h2>
    <ul>
        <# for(var i=0;i<5;i++){ #>
            <li><#= list[i] #></li>
        <# } #>
    </ul>
<# }else{ #>
    <h2>没有list数据</h2>
<# } #>
{% endhighlight %}

调用
{% highlight javascript %}
NTpl.leftDelimiter = "<#";
NTpl.rightDelimiter = "#>";
var data={
    "title":'啊哦~这是标题',
    "list":[
        'test1:这是内容',
        'test2:2',
        'test3:3',
        'test4:第五项未定义，模板系统会输出空'
    ]
};
var res = NTpl.tpl('tpl',data);
document.getElementById('result').innerHTML = res;
{% endhighlight %}


####判断语句：####

{% highlight html %}
<% if(list.length){ %>
    <h2><%= list.length %></h2>
<% }else{ %>
    <h2> list长度为0 <h2>
<% } %>
{% endhighlight %}

####循环语句：####

{% highlight html %}
<% for(var i=0;i<5;i++){ %>
    <li><%= list[i] %></li>
<% } %>
{% endhighlight %}

####一个比较复杂的实例####

{% highlight javascript %}
//字体渲染
var fontFamily = {
    tpl: function(){
        var tpl = '<% for(var i=0; i<data.length; i++){ %>'+
                '<div class="familyName">'+
                    '<span><%= data[i].name %></span>'+
                    '<dl>'+
                    '<% for(var j=0, family=data[i].family; j<family.length; j++){ %>'+
                        '<dd class="<%= family[j].type %>"><%= family[j].name %></dd>'+
                    '<% } %>'+
                    '</dl>'+
                '</div>'+
            '<% } %>';
        return tpl;
    },
    data: [
        {
            name: '姓名',
            family: [
                {
                    name: '宋体',
                    type: '宋体'
                },
                {
                    name: '宋体+粗',
                    type: '宋体 bold'
                },
                {
                    name: '微软雅黑',
                    type: '微软雅黑'
                },
                {
                    name: 'Arial',
                    type: 'Arial'
                },
                {
                    name:  'Arial Bold',
                    type: 'Arial bold'
                },
                {
                    name: 'Arial Bold Italic',
                    type: 'Arial bold italic'
                },
                {
                    name: 'Arial Italic',
                    type: 'Arial italic'
                }
            ]
        }
    ]
};
var familyTpl = NTpl.tpl(fontFamily.tpl(),fontFamily);
document.getElementById('result').innerHTML = familyTpl;
{% endhighlight %}



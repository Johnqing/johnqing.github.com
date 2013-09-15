---
layout: post
title: 如何开发 Sublime Text 2 的插件
---

Sublime Text 2是一个高度可定制的文本编辑器，一直以来对希望有一个快速强大现代的编辑工具的的程序员保持着持续的吸引力。现在，我们将创建自己的一个Sublime plugin，实现用Nettuts+ Prefixr API处理CSS实现跨浏览器CSS的目的。
当完成时，你会深入的明了如何创建一个 Sublime Prefixr plugin，并且有能力去写你自己的编辑器插件。

##前言：术语和参考资料

> The extension model for Sublime Text 2 is fairly full-featured.

Sublime Text 2的扩展模型是相当的功能全面。你可以改变语法高亮，实际的编辑器外观，以及所有的菜单项。此外，还可以创建新的build环境，自动补全，语言定义，代码区段，宏，键绑定，鼠标绑定以及插件。所有这些不同形式的改装都是用组织在package中的文件来实现的。

所谓pacakage就是一个存储在你的Packages目录中的文件夹。你可以点击Preferences > Browse Packages… 菜单进入你的Packages目录。也可以通过创建一个zip文件并且把扩展名改为.sublime-package来实现把pacakage打包成一个单独文件。我们将在本教程中讨论一点怎么打包。

Sublime绑定了很多不同的package。大不多数绑定的都是和特定语言相关的package，包括语言定义，自动补全以及build环境。除了语言相关的package，还有两个Default和User package。Defaultpackage包含了所有的标准键绑定，菜单定义，文件设置和一大堆用python写的插件。

> During the process of writing a plugin, the   Sublime Text 2 API reference will be essential.

要写一个插件， [Sublime Text 2 API reference](http://www.sublimetext.com/docs/2/api_reference.html)是根本。此外，Defaultpackage对于怎么做我们的工作也是一个很好的参考。编辑器的大部分功能都是通过commans命令来实现，除了敲入字符之外的所有操作都可以通过commans完成。查看Preferences > Key Bindings – Defaultmenu ，你可以找到很多有用的内建的功能。
现在，pacakge和插件的区别已经清楚了，可以开始写我们的插件了。

## 第一步 - 起步

Sublime有一个功能可以产生一个简单插件所需要的Python代码框架。选择Tools > New Plugin…菜单，可以打开一个新的文件，带有下面的样式：

{% highlight python %}
import sublime, sublime_plugin

class ExampleCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.insert(edit, 0, "Hello, World!")
{% endhighlight %}

可以看到，引入了两个Sublime Python的模块，使得我们可以访问其API并且创建一个新的类。在开始编辑创建我们自己的插件之前，请先保存这个文件。


要保存这个文件我们需要创建一个package来保存它。 按下 `ctrl+s(Windows/Linux)` or `cmd+s (OS X) `来保存文件。保存对话框默认打开Userpackage，不要把我们的文件存在那里，而是创建一个新的文件夹，命名为Prefixr。

<pre>
Packages/
…
- OCaml/
- Perl/
- PHP/
- Prefixr/
- Python/
- R/
- Rails/
…
</pre>

现在，把我们的文件保存在Prefixr文件夹中，命名为Prefixr.py。其实文件名并不重要，只要以.py为扩展名就可以。但方便起见，还是用我们的插件的名字吧。

现在，插件已经做了保存。我们可以试着运行了。输入 `ctrl+``打开Sublime的控制台，这是一个可以访问API的Python控制台。输入下面的Python代码来测试我们的新插件：

{% highlight python %}
view.run_command('example')
{% endhighlight %}

你将看到Hello World被插入到了我们的插件文件的开头。接下来继续之前先Undo掉这个新的插入。 

## 第二步 - Command的类型和名字

对于一个插件，Sublime提供了三种类型的command。

+ Text commands 提供通过一个View对象访问被选定的文件或者buffer的内的能力
+ Window commands 提供一个Window对象，可引用当前的窗口
+ Application commands 没有引用任何特定的窗口，文件或者buffer，很少使用。

因为我们要用我们的插件来操作CSS文件或者buffer里面的内容，所以我们要使用 sublime_plugin.TextCommand 类作为我们定制的Prefixr命令的基类。这时，我们就需要命名我们命令的类名了。

在我们的代码框架中，你可以看到下面的类：

{% highlight python %}
class ExampleCommand(sublime_plugin.TextCommand):
{% endhighlight %}

在我们运行命令时，在控制台中执行的是下面的代码：

{% highlight python %}
view.run_command('example')
{% endhighlight %}

Sublime将把继承自任意一个 sublime_plugin类 
(TextCommand,WindowCommand or ApplicationCommand)的类的名字的Command后缀去掉，并且用下划线符号命名替换驼峰式命名。 

这样一来，为创建一个名字是prefixr的command，类名就必须是PrefixrCommand。 

{% highlight python %}
class PrefixrCommand(sublime_plugin.TextCommand):
{% endhighlight %}

## 第三步 - 选定文本

Sublime最有用的功能之一就是具备多行选定的功能

现在，我们已经正式命名了我们的插件，可以开始从当前的buffer中获取CSS并且发送到Prefixr API上了。Sublime最有用的功能之一就是具备多行选定的功能。由于要获取选定的文件，我们需要把所有选定的行放入我们的插件中处理，而不仅仅是第一个选定的。

由于我们写的是一个文本命令，所以可以通过self.view访问当前view。view对象的self()方法将返回一个当前选定内容的iterable Region集合，我们可以通过花括号扫描到这些内容。若找不到花括号，可以扩大选定内容到周围的括号，以保证整个块有一个括号前缀。选定内容中是否包含花括号还将有利于我们后面对Prefixr API返回的内容作空白调整和格式调整。

{% highlight python %}
braces = False
sels = self.view.sel()
for sel in sels:
    if self.view.substr(sel).find('{') != -1:
        braces = True
{% endhighlight %}

用这几行代码替换框架中的run()方法中的代码。 

若未找到任何的花括号，我们需要循环检测每一个选定区段，把每一个区段和后括弧关联起来。之后，用带有to参数设置为 brackets的内建命令 expand_selectionl来确保获取了每个CSS块的完整内容。

{% highlight python %}
if not braces:
    new_sels = []
    for sel in sels:
        new_sels.append(self.view.find('\}', sel.end()))
    sels.clear()
    for sel in new_sels:
        sels.add(sel)
    self.view.run_command("expand_selection", {"to": "brackets"})
{% endhighlight %}

若果你想再检查一次你的代码，你可以和源代码zip文件中的Prefixr1.py文件对比一下。

## 第四步 - 线程

> 为防止糟糕的连接破坏其他正常工作，我们需要确保在后台完成Prefixr API调用。

此时，选定的文本已经扩展到了能抓取每个CSS块的完整内容。现在，我们需要把他们发送打牌Prefixr API上。这只需要一个简单的HTTP请求，用urllib和urllib2模块就可以实现。但是，在发起请求之前，需要想想一个潜在的web请求延迟会对编辑器性能造成的影响。如因为某些原因，用户处在一个很慢的连接环境下，对Prefixr API的请求很可能需要好几秒钟乃至更多。

为防止糟糕的连接破坏其他正常工作，我们需要确保在后台完成Prefixr API调用。若你不了解线程，很基础的一种解释就是，线程是使你的程序的多个代码块在同一时间运行的机制。这在我们的插件环境中是很重要的，因为这样做可以避免在向Prefixr发送数据和等待响应的过程中Sublime处于不可用状态。

## 第五步 - 创建线程

我们将使用Python threading 模块来创建线程。要使用该模块，需要创建一个继承threading的新类。Thread包含一个所有线程代码都在其中执行的run()方法。

{% highlight python %}
class PrefixrApiCall(threading.Thread):
    def __init__(self, sel, string, timeout):
        self.sel = sel
        self.original = string
        self.timeout = timeout
        self.result = None
        threading.Thread.__init__(self)

    def run(self):
        try:
            data = urllib.urlencode({'css': self.original})
            request = urllib2.Request('http://prefixr.com/api/index.php', data,
                headers={"User-Agent": "Sublime Prefixr"})
            http_file = urllib2.urlopen(request, timeout=self.timeout)
            self.result = http_file.read()
            return

        except (urllib2.HTTPError) as (e):
            err = '%s: HTTP error %s contacting API' % (__name__, str(e.code))
        except (urllib2.URLError) as (e):
            err = '%s: URL error %s contacting API' % (__name__, str(e.reason))

        sublime.error_message(err)
        self.result = False
{% endhighlight %}


这里，我们使用thread的__init__()方法来设置所有的在web请求中需要的数据变量。run()方法包含所有的设置代码和执行向Prefixr API 的http请求的代码。由于线程并发的执行，所以直接返回值是不可行的，取而代之的我们设置self.result作为调用的结果。

鉴于我们在我们的插件中开始使用其他一些模块，我们必须在程序顶端增加import语句。

{% highlight python %}
import urllib
import urllib2
import threading
{% endhighlight %}

现在我们有了一个线程类来执行HTTP请求，我们需要为每一个selection块创建一个线程。为此，回到我们的PrefixrCommand类的run方法中，使用下面的循环:

{% highlight python %}
threads = []
for sel in sels:
    string = self.view.substr(sel)
    thread = PrefixrApiCall(sel, string, 5)
    threads.append(thread)
    thread.start()
{% endhighlight %}

我们记录了每一个我们创建的线程，然后调用start()方法开启每一个线程。如果想再次检查你的工作，对比源代码文件zip文件中的filePrefixr1.py文件。

## 第六步 - 准备结果

现在，我们已经开始了实际的Prefixr API请求，在处理HTTP相应之前，我们需要处理最后几个问题。

首先，我们清楚所有的selection，因为之前我们修改了他们。稍后将把他们设置成一个更合理的状态。

{% highlight python %}
self.view.sel().clear()
{% endhighlight %}

此外，我们开启一个新的Edit对象，把undo和redo操作组织在一起。我们指定我们在为prefix命令创建一个这样的组。

{% highlight python %}
edit = self.view.begin_edit('prefixr')
{% endhighlight %}

作为最后一步，我们调用下面的方法来处理API的相应结果。

## 第七步 - 处理线程

此时，我们的线程已经在运行了，认知已经运行结束了。下一次，我们需要完成刚刚调用的handle_threads()方法。这一方法将循环处理线程列表并且寻找不再运行的线程。

{% highlight python %}
def handle_threads(self, edit, threads, braces, offset=0, i=0, dir=1):
    next_threads = []
    for thread in threads:
        if thread.is_alive():
            next_threads.append(thread)
            continue
        if thread.result == False:
            continue
        offset = self.replace(edit, thread, braces, offset)
    threads = next_threads
{% endhighlight %}

如果线程仍然运行着，我们将其加入线程列表以便后面再检测。如果result是False，则忽略它。然后，对于返回正确的结果，再调用一个马上就要说到的replace()方法。

** 上面的翻译来自：[青崖白鹿](http://www.oschina.net/translate/how-to-create-a-sublime-text-2-plugin) **

## 第八步- 执行替换

正如前面提到的 `replace()` 方法， 在线程处理中，我们只需要用Prefixr API 返回的结果替换掉原来的css代码。

这个方法接受多个参数，包括撤销用的Edit对象、Prefixr API返回的结果，如果原来的选择包含括号，则选择选区的偏移量。

{% highlight python %}
def replace(self, edit, thread, braces, offset):  
    sel = thread.sel  
    original = thread.original  
    result = thread.result  
  
    # Here we adjust each selection for any text we have already inserted  
    if offset:  
        sel = sublime.Region(sel.begin() + offset,  
            sel.end() + offset)  
{% endhighlight %}

偏移量使我们在使用的时候有多余的选择。当一个功能块包含要替换的css和带css前缀的，该块的长度将增加。
偏移量确保把正确的内容替换为后续选择的文本位置。

下一个步骤是准备替换前对Prefixr API的结果进行格式化。其中包含处理下空格，结束符等。

{% highlight python %}
result = self.normalize_line_endings(result)  
(prefix, main, suffix) = self.fix_whitespace(original, result, sel,  
    braces)  
self.view.replace(edit, sel, prefix + main + suffix)  
{% endhighlight %}

最后一步，我们将根据用户的选择，把选区扩展到新插入的CSS代码最后一个行的末尾，并返回调整后的位置。

{% highlight python %}
end_point = sel.begin() + len(prefix) + len(main)  
self.view.sel().add(sublime.Region(end_point, end_point))  
  
return offset + len(prefix + main + suffix) - len(original)   
{% endhighlight %}

如果想检查到不前为止的工作，请比较源文件在源代码中的zip文件 Prefixr-4.py。

## 第九步- 处理空白


## 第十步- 键盘绑定



## 第十一步- 修改菜单



## 第十二步- 发布你的插件包




英文原文来自：[这里](http://net.tutsplus.com/tutorials/python-tutorials/how-to-create-a-sublime-text-2-plugin/)
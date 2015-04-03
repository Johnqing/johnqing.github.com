---
layout: post
title: sublime自定义
---

多年来，我已经用了很多的代码编辑器，从Windows上的“记事本”到Mac上的Espresso ，TextMate和Sublime Text。最终，一直使用Sublime Text 2，因为它是如此的简单易用，可定制的。

在大量的开发中，每个人的个人喜好可以对速度和生产力的造成不同的影响。我研究颇有几分提高我的工作流程，并建立了我SublimeText偏好文件，对于大多数人来说，是一个非常坚实的起点。

在大量的开发中，每个人的个人喜好可以对速度和生产力的造成不同的影响。我研究了关于改进我的工作流，并且构建我的 SublimeText 偏好文件，对于大多数人来说这是一个不错的起点。

##我最喜欢的代码片段##

`Close_windows_when_empty` — 如果打开的是一个空的选项卡，按`Ctrl + w`关闭

{% highlight json %}
"close_windows_when_empty": true
{% endhighlight %}

`Color_scheme` — 设置要使用一个自定义的下载的主题，比如 [Appealr](https://github.com/manikrathee/appealr) 。

{% highlight json %}
"color_scheme": "Packages/Appealr Color Scheme/appealr-color-scheme.tmTheme"
{% endhighlight %}

`Folder_exclude_patterns` — 设置需要排除的文件夹

{% highlight json %}
"folder_exclude_patterns":[
	".git",
	".bundle",
	".sass-cache",
	".svn",
	".hg"
]
{% endhighlight %}

`Font_` — 设置可读的类型。如源代码等宽字体，[Adobe是最好的](http://blogs.adobe.com/typblography/2012/09/source-code-pro.html)。

{% highlight json %}
"font_face": "Source Code Pro",
"font_size": 12.0
{% endhighlight %}

`Highlight_lin` - 突出显示您的主题中的样式所基于的当前所选的线。如果您使用[多窗格布局](https://a248.e.akamai.net/camo.github.com/d15ec3fd5cce53bb1e95d738ab1fe81a4f5e91ac/687474703a2f2f662e636c2e6c792f6974656d732f31783175304e336a32553356334f33493031316c2f53637265656e25323053686f74253230323031332d30342d3233253230617425323031312e35372e3039253230414d2e706e67)非常有用。

{% highlight json %}
"highlight_line": true
{% endhighlight %}

`Highlight_modified_tabs` — 另一种基于主题的偏好，但仍然有用。如果您有多个选项卡打开，一个未保存的更改将突出显示。

{% highlight json %}
"highlight_modified_tabs": true
{% endhighlight %}

`Match_` — On creation of an opening bracket/brace/etc, a closing one is inserted.

{% highlight json %}
"match_brackets": true,
"match_brackets_angle": true,
"match_brackets_braces": true,
"match_brackets_content": true,
"match_brackets_square": true,
{% endhighlight %}


`Scroll_` — 允许你滚过一个文件的结尾，如果你讨厌像我这样在一个文件的末尾添加多余的空行。如果你烦透了大文件，`scroll_speed`设置为2也是有帮助的。

{% highlight json %}
"scroll_past_end": true,
"scroll_speed": 2,
{% endhighlight %}

`Translate_tabs_to_spaces` — 简单。添加它，在您的代码中如果你还在使用的选项卡，退出它。

{% highlight json %}
"translate_tabs_to_spaces": true
{% endhighlight %}

##Complete Preferences:##

我把[完整的配置方案](https://github.com/manikrathee/sublime-text)放在了Github上. 
我的[Sublime配色方案，Appealr](https://github.com/manikrathee/appealr)，也都在Github上。

{% highlight json %}
{
  "bold_folder_labels": true,
  "caret_style": "phase",
  "close_windows_when_empty": true,
  "color_scheme": "Packages/Appealr Color Scheme/appealr-color-scheme.tmTheme",
  "draw_indent_guides": true,
  "draw_white_space": "selection",
  "file_exclude_patterns":
  [
    ".DS_Store",
    "*.lib",
    "*.log"
  ],
  "folder_exclude_patterns":
  [
    ".git",
    ".bundle",
    ".sass-cache",
    ".svn",
    ".hg"
  ],
  "font_face": "Source Code Pro",
  "font_size": 12.0,
  "highlight_line": true,
  "highlight_modified_tabs": true,
  "ignored_packages":
  [
    "Vintage",
    "SublimeLinter"
  ],
  "line_padding_bottom": 3,
  "line_padding_top": 3,
  "match_brackets": true,
  "match_brackets_angle": true,
  "match_brackets_braces": true,
  "match_brackets_content": true,
  "match_brackets_square": true,
  "open_files_in_new_window": false,
  "remember_open_files": true,
  "remember_open_folders": true,
  "scroll_past_end": true,
  "scroll_speed": 2,
  "show_full_path": true,
  "tab_size": 2,
  "theme": "Nil.sublime-theme",
  "translate_tabs_to_spaces": true,
  "use_simple_full_screen": true,
  "wide_caret": true,
  "word_wrap": true
}
{% endhighlight %}


译文:[这里](http://blog.manikrathee.com/posts/2013/07/27/sublime-text.html)
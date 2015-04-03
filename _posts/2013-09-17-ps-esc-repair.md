---
layout: post
title: photoshop esc键失效修复
---

最近碰到一个问题，我的photoshop打开之后，esc键就不能使用了，对于我这样一个习惯用esc键快速关闭窗口的人来说简直无法忍受！

具体解决方案如下：

photoshop安装目录下找到 `增效工具` 文件夹，删除目录下：

<pre>
自动 > 脚本支持.8li
扩展 > FastCore.8BX
	 > MMXCore.8BX
	 > 多处理器扩展功能.8BX
测量
</pre>

完好如初~
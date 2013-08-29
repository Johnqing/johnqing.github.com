---
layout: post
title: javascript 冒泡排序法
---

> 今天一个哥们面试说被问到冒泡排序，我也一直对算法不感冒。特意查了下什么是冒泡排序，发现也不难特贡献代码一份


冒泡排序算法：

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

这种缩放就像鱼吐水泡，越小的越来越浮到最上层

code：

{% highlight ruby %}
function bubbleSort(arr){
	var tmp;
	for (var i = arr.length - 1; i &gt;= 0; i--) {
		for (var j = 0; j &lt; i; j++) {
			if (arr[j] &gt; arr[j+1]) {
				tmp = arr[j];
				arr[j] = arr[j+1];
				arr[j+1] = tmp;
			};
		};
	};
	return arr;
}
var arr = [3,2,4,9,1,5,7,6,8];
var arrSorted = bubbleSort(arr);
console.log(arrSorted);
{% endhighlight %}

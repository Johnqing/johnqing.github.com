n(function(){
	var articleNodes = n('.article');
	n.each(articleNodes, function(k, v){
		n(k).addClass('color' + (0 | Math.random() * 11));
	});
	//初始化
	var t8 = 800;
	setTimeout(function(){
		n('body').append('<div class="body_bg"></div>');
		n('#loading').fadeOut(500, function(){
			n('#header').animate({top: 0, opacity: 1}, t8,function(){
				n('.logo a').animate({left: 55, opacity: 1}, t8,function(){
					n('.main').css('display','block').fadeIn(300, function(){
						setPost();
					});
					setTime(n('#timer'));
					setTimeout(function(){
						n('.body_bg').fadeIn(1000);	
					},1500)			
				})

			})
		});
	}, 1000);	
	//菜单呼出手势
	n('#menu').mouseover(function(){
		n(this).css('right', 0);
	});
	n('#menu').mouseout(function(){
		n(this).css('right', -88);
	});
});
var j = 0,
	actiLen = n('.article').length;
	
function setPost(){
	n('.main .article').eq(j++).addClass('show');
	if(j < actiLen){
		setTimeout("setPost()", 100);
	}else{
		j = 0;
	}
}
//日期设置
function setTime(timeNode){
	var _month, _day,
		now = new Date(),
		hours = now.getHours(),
		minutes = now.getMinutes(),
		month = now.getMonth(),
		date = now.getDate(),
		day = now.getDay(),
		week = ['天','一','二','三','四','五','六'],
		dayArr = ['','一','二','三','四','五','六','七','八','九','十'];
	//月份
	_month = month > 10 ? ('十' + dayArr[month - 10]) : dayArr[month+1];
	//
	_day = date > 10 ? (date < 20 ? '十' + dayArr[date%10] : dayArr[parseInt(date/10)] +'十'+ dayArr[date%10]) : dayArr[date];

	hours = hours < 10 ? ('0' + hours) : hours;
	minutes = minutes < 10 ? ('0' + minutes) : minutes;

	timeNode.find('.w').html('星期' + week[day]);
	timeNode.find('.d').html(_month + '月' + _day + '日');
	timeNode.find('.t').html(hours + ':' + minutes);
	timeNode.animate({left: 20}, 500);
};
/**
 * 统计
 */
(function(){
	n.loadScript(tongji.URL, function(){});	
})();

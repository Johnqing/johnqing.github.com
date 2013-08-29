---
layout: post
title:  "PHP学习入门级练习"
tags: [PHP,服务器,Mysql]
---
**一、PHP基础操作**

1,基本语法：
{% highlight php %}
<?php
	echo '---------------start--------------';
	echo "<br/>";
	echo __FILE__;
	echo "<br/>";//打印预定义常量
	
	echo "Hello world";//一般打印
	echo "<br/>";
	
	define('SCHOOL',"YANTZE UNIVERSITY");//定义常量
	echo SCHOOL;//打印常量
	echo "<br/>";
	
	$name="savant";//name
	$age=28;
	echo 'name='.$name.',age='.$age;//打印变量，字符串连接
	echo "<br/>";
	
	$array=array('name'=>'allthelucky','age'=>28);//定义数组
	echo json_encode($array);//转成json输出
	echo "<br/>";
	
	$array=array(array("id"=>'1',"name"=>'hello'),array("id"=>'2',"name"=>'world'));
	echo json_encode($array);//转成jsonarray输出
	echo "<br/>";
	
	$array=array('this','is','php','test');//定义数组
	echo($array[0]);//打印第一个元素
	echo "<br/>";
	print_r($array);//全打印
	echo "<br/>";
	
	$have=true;//定义boolean
	echo($have);
	echo "<br/>";
	
	function show($result) {//定义函数
		echo 'result is:'.$result;
	}
	$result='number 1';
	show($result);//调用函数
	echo "<br/>";

	function mult($a, $b) {//定义带返回值函数
		return $a*$b;
	}
	$a=10;
	$b=20;
	echo 'result='.mult($a,$b);//调用函数
	echo "<br/>";
	
	$c=20;
	if ($c == 20) {//if else 语句
		echo 'yes';
	} else {
		echo 'no';
	}
	echo "<br/>";
	
	$num=1;
	while($num < 10) {//while循环
		echo 'num='.$num;
		echo "<br/>";
		$num+=1;
	}
	
	$array=array('1'=>'hellsf','2'=>'sadfadfsd','3'=>'asdfasdfasdfsdf');
	foreach($array as $key=>$value) {//foreach 语句，输出key,value
		echo $key.'='.$value."<br/>";
	}
	foreach($array as $value) {//foreach语句，只输出值 
		echo $value."<br/>";
	}
	print_r($array);
	
	$str = ' asdf safsd ';
	echo trim($str);//trim函数
	echo "<br/>";
	echo strlen($str);//strlen函数
	echo "<br/>";
	
	echo md5($str);//md5加密
	echo "<br/>";
	echo sha1($str);//sha1加密
	
	class User {//使用类
		public $name="savant";
		public $age ="age";
		
		public function __construct($name, $age) {//构造方法
		$this->name=$name;
		$this->age=$age;
		}
		
		public function show() {//成员函数
		echo 'name='.$this->name.',age='.$this->age;
		}
	}
	$user = new User('hello world', 26);
	$user->show();
	echo "<br/>";
	echo '---------------end--------------';
?>
{% endhighlight %}

2,表单操作
{% highlight php %}
<?php	
	echo '---------------start--------------';
	echo "<br/>";
	echo 'name'.$_GET['name'];//get参数
	echo "<br/>";
	echo 'age'.$_GET['age'];
	
	echo 'name='.$_POST['name'];//post参数
	echo "<br/>";
	echo 'password='.$_POST['password'];
	echo "<br/>";
	echo 'desc='.$_POST['desc'];
	echo "<br/>";
	$path='./upfiles'.$_FILES['pic']['name'];
	move_uploaded_file($_FILES['pic']['temp'],$path);
	echo $_POST['pic'];
	echo "<br/>";
	echo '---------------end--------------';
?>
<html>
<body>
<form name="data" method="post" action="test.php" enctype="multipart/form-data" >
	<br/>
	name:<input name="name" type="text" value=""></input>
	<br/>
	password:<input name="password" type="password" value=""></input>
	<br/>
	desc:<textarea name="desc"></textarea>
	<br/>
	pic:<input name="pic" type="file" value=""></input>
	<br/>
	<input name="submit" type="submit"></input>
</form>
</body>
</html>
{% endhighlight %}

**二、数据库MySql简单操作练习**

1,MySql服务启动和停止
{% highlight bash %}
net start mysql
net stop mysql
{% endhighlight %}

2,数据库操作
{% highlight bash %}
create database USER_DB;//创建数据库
show databases;//查看数据库
use USER_DB;//选择数据库
drop database DBNAME;//删除数据库
{% endhighlight %}

3,表格操作
{% highlight bash %}
create table if not exists USER(id int auto_increment primary key, user varchar(20) not null, password varchar(40) not null, createtime datetime);//创建表格
rename table USER to USERS;//改表格名
drop table if exists USER;//删除表格
show tables;//表出表格 
describe USER;//显示表结构
insert into admin(user,password) values("pan","123456");//添加记录到表格 
select * from USER;//查询表格记录
update USER set passowrd="111111";//更新表格记录
delete from USER where user="abc";//删除记录
{% endhighlight %}

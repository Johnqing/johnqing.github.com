(function(){
	var dialog = new Dialog({
		container: '.ui-dialog-box'
	});

	function pop(msg){
		dialog.set({
			hasBtns: false,
			content: msg,
			btns: [
				{name: '确定', className: 'ui-btns-ok'}
			]
		});
		dialog.show();
	}

	var src = 'pcw_pay';
	QHPass.mShowLogin(function(data){
		PUSH({
			url: 'result.html',
			transition: "slide-in"
		});
	},{
		doms:{
			account:'qt_account',
			password:'qt_password',
			phrase:'qt_phrase',
			isAutologin:'qtis_autologin',
			globalTips:'qt_global_text',
			phraseImg: 'qt_phrasecode'
		},
		extFun:{
			init: function(){
				var userName = $('#qt_account'),
					self = this,
					pwd = $('#qt_password');

				//提交
				$("#qt_btn").on('click', function(){
					$(this).text('提交中...');
					QHPass.loginUtils.submit();
				});
				//验证码刷新绑定
				$('.phrase-code').on('click',function() {
					QHPass.loginUtils.setPhrase();
				});
			},
			phrase: function() {
				$(".m-phrase-box").show();
				$('#qt_phrase').focus();
				QHPass.loginUtils.setPhrase();
			},
			error:function(data){
				pop(data.msg);
				$("#qt_btn").text('登录');
			},
			correct:function(data){
			},
			before: function(){},
			loading: function(){},
			after: function() {}
		},
		phraseTime: 'center',
		src: src
	});

	QHPass.mShowReg(function() {
		alert("注册成功");
		location.reload(true);
	}, {
		doms: {
			globalTips: "qt_global_text",
			smsCode: 'qt_phrase',
			phone: 'qt_phone',
			password: 'qt_password',
			isAgree: 'qtis_agree'
		},
		extFun: {
			init: function() {
				//手机号实时检测
				$("#validPhone").click(function() {
					QHPass.regUtils.checkPhone(true)
				});
				var pwdNode = $('#qt_password');
				var repassword = $('#qt_repassword');
				//提交
				$("#qt_reg_btn").click(function() {

					if(repassword.val() != pwdNode.val()){
						pop('密码不一致，请重新输入');
						return;
					}
					$(this).text('提交中...');
					QHPass.regUtils.submit();
				});

				$("#qt_fetch_code").on('click', function() {
					var $el = $(this),
						disabled = "u-fm-btn-disable";
					$el.hasClass(disabled) || QHPass.regUtils.getSmsCode(function(data) {
						if (data.errno == 0) {
							$el.addClass(disabled);
							var r = 120,
								timer = null;
							timer = setInterval(function() {
								$el.text(r + "秒后重发");
								r--;
								if(r < 1){
									clearInterval(timer);
									$el.text("获取校验码").removeClass(disabled)
								}
							}, 1000);
						}
					});
				});
			},
			error: function(data) {
				pop(data.msg);
				$("#qt_btn").text('注册');
			},
			correct: function(data) {
				$('#errorTips').css('top', '-34px');
			},
			before: function() {
			},
			loading: function() {
			},
			after: function() {
			}
		},
		regway: 'phone',
		postCharset: 'utf-8',
		domainList: ['360'],
		src: src
	});
})();
/**
 * 充值
 */
(function(){
	var node = $('#amount');
	var btn = $('#recBtn');
	if(!node.length) return
	var dialog = new Dialog({
		container: '.ui-dialog-box'
	});

	function pop(msg){
		dialog.set({
			hasBtns: false,
			content: msg,
			btns: [
				{name: '确定', className: 'ui-btns-ok'}
			]
		});
		dialog.show();
	}

	$('.m-list').on('click', 'li', function(){
		var $el = $(this);
		var text = $el.attr('data-num');
		$el.addClass('active').siblings().removeClass('active');
		btn.removeClass('hide');
		node.val(text);
	});

	btn.click(function(){
		var v = node.val();
		if(!v)
			return pop('请输入购买金额');
		$(this).text('提交中...');
	});

})();
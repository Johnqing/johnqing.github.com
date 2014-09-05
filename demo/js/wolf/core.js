(function(window, $, template){
	/**
	 * 基础方法
	 */
	var _wolf = window.wolf;
	_wolf = _wolf || {
		version: '0.0.1',
		$: $,
		$fn: function(el, fnName, context, param){
			var fn = el[fnName];
			if(w.isFunction(fn))
				fn.apply(context || el, param);
		},
		$id: function(id){
			return w.$('#'+ id);
		},
		$c: function(html){
			return w.$(html);
		},
		template: template,
		ui: {}
	};
	window.w = _wolf;

	var ArrayProto = Array.prototype,
		ObjProto = Object.prototype,
		FuncProto = Function.prototype;

	var push             = ArrayProto.push,
		slice            = ArrayProto.slice,
		concat           = ArrayProto.concat,
		toString         = ObjProto.toString,
		hasOwnProperty   = ObjProto.hasOwnProperty;

	var nativeIndexOf      = ArrayProto.indexOf;

	/**
	 * 类型检查
	 * @param type
	 * @returns {Function}
	 * @private
	 */
	var _isType = function(type){
		return function(obj){
			return Object.prototype.toString.call(obj).slice(8, -1) === type;
		}
	}

	w.isFunction = _isType('Function');
	w.isObject = _isType('Object');
	w.isArray = _isType('Array');
	/**
	 * 继承
	 * @param obj
	 * @returns {*}
	 */
	w.extend = function(obj){
		if (!w.isObject(obj)) return obj;
		var source, prop;
		for (var i = 1, length = arguments.length; i < length; i++) {
			source = arguments[i];
			for (prop in source) {
				if (hasOwnProperty.call(source, prop)) {
					obj[prop] = source[prop];
				}
			}
		}
		return obj;
	}

	/**
	 * 获取唯一id
	 * @param prefix
	 * @returns {string}
	 */
	w.uniqueId = function(){
		var idCounter = 0;
		return function(prefix){
			var id = ++idCounter + '';
			return prefix ? prefix + id : id;
		}
	}();
	/**
	 * 检查obj中是否包含target
	 * @param obj
	 * @param target
	 * @returns {boolean}
	 */
	w.contains = function(obj, target){
		if(obj == null) return false;
		if(nativeIndexOf && obj.indexOf === nativeIndexOf)
			return obj.indexOf(target) != -1;
		return w.each(obj, function(item){
			return item === target;
		})
	}
	/**
	 * 剔除某项
	 * @param arr
	 * @returns {Array}
	 */
	w.without = function(arr){
		var args = slice.call(arguments, 1);
		var arr_temp = [];
		arr.forEach(function(item){
			args.forEach(function(item2){
				if(item == item2) return;
				arr_temp.push(item)
			})
		});
		return arr_temp;
	}

	/**
	 * 继承
	 * @param fn
	 * @param context
	 * @param params
	 * @returns {*}
	 */
	w.extendMethod = function(fn, context, params){
		context = context || this;
		if(w.isFunction(fn))
			return w.isArray(params) ? fn.apply(context, params) : fn.call(context, params);
		return false;
	}
	/**
	 *
	 * @param func
	 * @returns {Function}
	 */
	w.partial = function(func) {
		var boundArgs = slice.call(arguments, 1);
		return function() {
			var position = 0;
			var args = boundArgs.slice();
			for (var i = 0, length = args.length; i < length; i++) {
				if (args[i] === w) args[i] = arguments[position++];
			}
			while (position < arguments.length) args.push(arguments[position++]);
			return func.apply(this, args);
		};
	};
	/**
	 * 获取context中的 fn
	 * @param key
	 * @param context
	 * @returns {*}
	 */
	w.getConFn = function(key, context){
		context = context || window;

		if(w.isFunction(key))
			return key;

		if(w.isFunction(context[key]))
			return context[key];

		return function(){};

	}
	/**
	 * fn前后执行的函数
	 * @param fn
	 * @param bef
	 * @param aft
	 * @param context
	 * @returns {*}
	 */
	w.wrap = function(fn, bef, aft, context){
		context = context || this;

		var action = w.partial(function(){
			w.getConFn(bef, context).call(context);
			fn.call(context);
			w.getConFn(aft, context).call(context);
		}, fn);

		return action.call(context);
	}

// 补丁
	if(!ArrayProto.forEach){
		var breaker = {};
		ArrayProto.forEach = function(iterator, context){
			var obj = this;
			for (var i = 0, length = obj.length; i < length; i++) {
				if (iterator.call(context, obj[i], i, obj) === breaker) return;
			}
			return obj;
		}
	}


	/**
	 * 遍历
	 * @param obj
	 * @param iterator
	 * @param context
	 * @returns {void|*}
	 */
	w.each = function(obj, iterator, context){

		if (obj.length === +obj.length) {
			return obj.forEach(iterator, context);
		}

		for(var key in obj){
			var item = obj[key];
			if (iterator.call(context, item, key, obj)) return;
		}

		return obj;
	}
	/**
	 *
	 * @param object
	 * @param property
	 * @returns {*}
	 */
	w.result = function(object, property) {
		if (object == null) return null;
		var value = object[property];
		return w.isFunction(value) ? value.call(object) : value;
	};


	if (!FuncProto.bind) {
		FuncProto.bind = function (oThis) {
			if (typeof this !== "function") {
				// closest thing possible to the ECMAScript 5 internal IsCallable function
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}

			var aArgs = ArrayProto.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis || window,
						aArgs.concat(ArrayProto.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
})(this, $, NT.tpl);
(function(window){
	var arr = [];
	var slice = arr.slice;

	w.inherit = function(){
		// 参数只支持 1-2位
		if(arguments.length === 0 || arguments.length > 2)
			throw new Error('参数错误！');

		// 参数数组化
		var properties = slice.call(arguments);

		var parentClass = null;
		// 第一个参数 如果是类，取出
		if(typeof properties[0] === 'function'){
			parentClass = properties.shift();
		}

		properties = properties[0];

		// new class
		function _class(){
			if(w.isFunction(this.initialize))
				this.initialize.apply(this, arguments);

		}
		// 赋值父类
		_class.$super = parentClass;

		// 防止构造函数执行
		if(parentClass){
			var subclass = function(){};
			subclass.prototype = parentClass.prototype;
			_class.prototype = new subclass();
		}

		var ancestor = _class.$super && _class.$super.prototype;

		for(var key in properties){
			var value = properties[key];

			//满足条件就重写
			if (ancestor && typeof value == 'function') {
				var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(value.toString())[1].replace(/\s/i, '').split(',');
				//只有在第一个参数为$super情况下才需要处理（是否具有重复方法需要用户自己决定）
				if (argslist[0] === '$super' && ancestor[key]) {
					value = (function (methodName, fn) {
						return function () {
							var scope = this;
							var args = [function () {
								return ancestor[methodName].apply(scope, arguments);
							} ];
							return fn.apply(this, args.concat(slice.call(arguments)));
						};
					})(key, value);
				}
			}


			//此处对对象进行扩展，当前原型链已经存在该对象，便进行扩展
			if (w.isObject(_class.prototype[key]) && w.isObject(value) && (typeof _class.prototype[key] != 'function' && typeof value != 'fuction')) {
				//原型链是共享的，这里不好办
				var temp = {};
				w.extend(temp, _class.prototype[key]);
				w.extend(temp, value);
				_class.prototype[key] = temp;
			}else{
				_class.prototype[key] = value;
			}
		}


		if(!_class.prototype.initialize){
			_class.prototype.initialize = function () { };
		}

		_class.prototype.constructor = _class;

		return _class;

	}




})(this);
(function(window){
	/**
	 * Event模块
	 */
	var eventRegx = /^(\S+)\s*(.*)$/;
	w.event = {
		parse: function(evts, context){
			var evtArr = [];

			w.each(evts, function(method, key){
				if(!method) return;

				if(!w.isFunction(method))
					method = context[method];

				var match = key.match(eventRegx);
				var eventName = match[1];
				var selector = match[2];

				method = method.bind(context);

				eventName += '.delegateEvents'+ context.view.view_id;

				evtArr.push({
					target: selector,
					event: eventName,
					callback: method
				})

			});

			return evtArr;
		},
		on: function(evts, el, context){
			return function(){
				var eventsList = w.event.parse(evts, context);
				eventsList.forEach(function(item){
					w.event.core(el, 'on', item.event, item.callback, context, item.target == '' ? undefined : item.target);
				});
			}
		},
		/**
		 *  事件绑定
		 * @param obj           绑定元素
		 * @param methodName    方法名
		 * @param eventName     事件名
		 * @param callback      回调
		 * @param context       上下文
		 * @param subObj        子级
		 */
		core: function(obj, methodName, eventName, callback, context, subObj){
			/**
			 * 事件代理|事件消除 如果有父元素就代理到父元素
			 * @returns {*}
			 */
			var onOrOff = function(name){
				return function(){
					if(subObj)
						return obj[name](eventName, subObj, callback);
					obj[name](eventName, callback);
				}
			}
			/**
			 * 事件触发
			 * @returns {*}
			 */
			var trigger = function(){
				if(subObj)
					return obj.find(subObj).trigger(eventName);
				obj.trigger(eventName);
			}

			/**
			 * 支持的事件列表
			 * @type {{on: delegate, delegate: delegate, off: *, undelegate: *}}
			 */
			var maps = {
				on: onOrOff('on'),
				bind: onOrOff('on'),
				off: onOrOff('off'),
				unbind: onOrOff('off'),
				trigger: trigger,
				fire: trigger
			};

			// 不支持的事件，抛弃
			if(w.isFunction(maps[methodName])){
				maps[methodName]();
			}
		}
	}
})(this);
(function(window){
	/**
	 * View层封装
	 */
	w.View = w.inherit({
		/**
		 * 构造函数入口
		 * @param options
		 */
		initialize: function(options){
			this._initialize();
			this.handleOption(options);
		},
		/**
		 * view类的默认设置
		 * @private
		 */
		_initialize: function(){
			// 模板
//		this.setTemplate = {};
//		// 状态机
//		this.setStatus = {};
			// 包裹
			this.default_container_template = '<div class="wolf-view" id="<%= view_id %>"><%= html %></div>';
			// 设置view的唯一id
			this.view_id = w.uniqueId('wolf-view-');
		},
		/**
		 * 参数传入
		 * @param options
		 */
		handleOption: function(options){
			if(w.isObject(options))
				w.extend(this, options);
		},
		/**
		 * 通过 data 和 status来渲染页面
		 * @param status
		 * @param data
		 * @param callback
		 * @returns {boolean}
		 */
		render: function(status, data, callback){
			var tmp = this.setTemplate[status];

			if(tmp){

				var template = w.template(tmp, data);

				// 容器包裹
				this.html = w.template(this.default_container_template, {
					view_id: this.view_id,
					html: template
				});

				this.currentStatus = status;

				callback && callback.call(this);

				return true;
			}
		},
		/**
		 * 数据和状态发生变化时，重新渲染模板
		 * @param status
		 * @param data
		 * @returns {boolean}
		 */
		update: function(status, data){
			if(!this.currentStatus || this.currentStatus !== status)
				return this.render(status, data);

			this.onUpdate && _this.onUpdate.call(this);
		}
	});
})(this);
(function(window){
	/**
	 * Model层
	 */
	w.Model = w.inherit({
		/**
		 * 构造函数入口
		 * @param options
		 */
		initialize: function(options){
			this._initialize();
			this.handleOption(options);
		},
		/**
		 * view类的默认设置
		 * @private
		 */
		_initialize: function(){
			// 观察者
			this.observers = [];
			// 原始数据模型
			this.data_model = {};
			// view需要的数据
			this.view_model = {};
		},
		/**
		 * 参数设置
		 * @param options
		 */
		handleOption: function(options){
			// 从形参中获取key和value绑定在this上
			if(w.isObject(options))
				w.extend(this, options);
		},
		/**
		 * 配置数据
		 * @param origin
		 * @returns {{}|*}
		 */
		format: function(origin){
			this.data_model = origin;
			this.view_model = this.parse(origin);
			return this.view_model;
		},
		/**
		 * 用来将origin转为view_model，该方法需要被重写
		 * @param origin
		 * @returns {*}
		 */
		parse: function(origin){
			return origin;
		},
		/**
		 * controller注册
		 * @param controller
		 */
		register: function(controller){
			// 如果队列中没有，插入到队列
			if(!w.contains(this.observers, controller))
				this.observers.push(controller);
		},
		unregister: function(controller){
			this.observers = w.without(this.observers, controller);
		},
		/**
		 * 数据变化更新
		 */
		notifyDataChanged: function(){
			var data = this.format(this.data_model);

			w.each(this.observers, function(controller){
				if(w.isObject(controller))
					controller.update && controller.update.apply(controller, [data]);
			})

		}
	})
})(this);
(function(window){
	/**
	 * Controller层
	 */
	w.Controller = w.inherit({
		initialize: function(options){
			this.handleOption(options);
			this.create();
		},
		handleOption: function(options){
			// 绑定到this
			if(w.isObject(options))
				w.extend(this, options);
		},
		update: function(data){
			this.hide.call(this);

			if(!w.extendMethod(this.onViewUpdate, this, [data]))
				this.render();

			this.show.call(this);
		},
		render: function(){
			// ... 重写
		},
		create: function(){
			var el = w.$id(this.view.view_id);
			if(el && el.length){
				this.reCreate.call(this);
			}

			w.wrap(this._create, 'onViewCreateBefore', 'onViewCreateAfter', this);
		},
		_create: function(){
			this.render();
		},
		reCreate: function(){
			w.wrap(this._reCreate, 'onViewCreateBefore', 'onViewCreateAfter', this);
		},
		_reCreate: function(){
			this.update();
		},
		/**
		 * 隐藏view
		 * @private
		 */
		_hide: function(){
			var el = w.$id(this.view.view_id);
			w.$fn(el, 'hide');
		},
		hide: function(){
			w.wrap(this._hide, 'onViewHideBefore', 'onViewHideAfter', this);
			// 解绑，方式内存泄露
			this.off();
		},
		/**
		 * 解除事件绑定
		 * @private
		 */
		_off: function(){
			var el = w.$id(this.view.view_id);
			w.$fn(el, 'off');
		},
		off: function(){
			w.wrap(this._off, 'onViewOffBefore', 'onViewOffAfter', this);
		},
		/**
		 * 展示dom
		 * @private
		 */
		_show: function(){
			var el = w.$id(this.view.view_id);

			var container = w.$(this.container);
			w.$fn(container, 'html', null, [this.view_content]);

			w.$fn(el, 'show');
		},
		/**
		 * view模板生成，并绑定事件
		 */
		show: function(){
			// 模板生成
			this.view_content = w.$c(this.view.html);
			// 事件绑定
			this.bind();

			w.wrap(this._show, 'onViewShowBefore', 'onViewShowAfter', this);
		},
		/**
		 * 绑定事件
		 */
		bind: function(){
			w.wrap(w.event.on(this.events, this.view_content, this), 'onViewBindBefore', 'onViewBindAfter', this);
		}
	});
})(this);

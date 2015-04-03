(function(window){
	/**
	 * UI dialog
	 */
	var View = w.inherit(w.View, {
			setTemplate: {
				0: 'template-dialog'
			},
			setStatus: {
				STATUS_INIT: 0
			}
		});

	var Model = w.inherit(w.Model, {});

	var view = new View();
	var model = new Model();

	window.Dialog = w.inherit(w.Controller, {
		_initialize: function(){
			this.view = view;
			this.model = model;

			this.originDate = {
				title: '',
				content: '',
				btns: [
					{name: 'cancel', className: 'ui-btns-cancel'},
					{name: 'ok', className: 'ui-btns-ok'}
				]
			}

			this._init();
		},
		initialize: function($super, opts){
			this._initialize();
			$super(opts);
		},
		_init: function(){
			this.model.format(this.originDate);
			this.model.register(this);
			this.view_status = this.view.setStatus.STATUS_INIT;
		},
		render: function(){
			var data = this.model.view_model;
			this.view.render(this.view_status, data);
		},
		set: function(options){
			w.extend(this.model.data_model, options);
			this.model.notifyDataChanged();
		},
		events: {
			'click .ui-btns-ok': 'okAction',
			'click .ui-btns-cancel': 'cancelAction'
		},
		cancelAction: function(){
			var btnClick = this.onCancelBtnClick;
			btnClick && btnClick();
			this.hide();
		},
		okAction: function(){
			var btnClick = this.onOkBtnClick;
			btnClick && btnClick();
			this.hide();
		},
		onViewShowAfter: function(){
			var el = w.$id(this.view.view_id);
			var dialog = el.find('.ui-dialog');
			var height = dialog.height();
			dialog.css({
				'margin-left': -($(dialog).width() / 2) + 'px',
				'margin-top': -($(dialog).height() / 2) + 'px'
			});
		}
	});


})(this);

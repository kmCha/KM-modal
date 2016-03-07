var Modal = (function(){
	var _modals = document.querySelectorAll(".modal-wrap");	// 读取页面中所有modal，多处会用到

	function _Modal(conf) {
		this.buttons = document.querySelectorAll("[data-toggle=modal]");	// 获得所有与modal关联的按钮
		this.cancels = document.querySelectorAll("[data-dismiss=modal]");	// 获得所有关闭modal的按钮
		this.conf = conf;	// 配置信息对象
		this.options = {	// 配置信息对应的选项的执行函数
			close: function() {
				var crosses = _addCrossToHeader();
				_bindCancelHandler(crosses);
			},
			animation: function() {
				_addOpenAnimationToModal();
				_addCloseAnimationBeforeDismiss();
			},
			shadowClose: function() {
				_bindShadowClick();
			}
		};
	}
	_Modal.prototype.init = function() {
		var count = 0;

		return function() {
			var _self = this,
				actualInit = function() {
					var buttons = _self.buttons,
						cancels = _self.cancels,
						conf = _self.conf,
						options = _self.options;

					_runOptions(options, conf);
					_bindEscHandler();
					_bindCancelHandler(cancels);
					_bindOpenHandler(buttons);
					_setStatusToModals();			// 设置模态框初始状态"close"

					count++;
				},
				errorMsg = function() {
					console.log("init函数只能执行一次，不然会出错");
				};


			if(count === 0) {
				return actualInit();
			}
			return errorMsg();
		};
	}();
	_Modal.prototype.open = function(id) {
		var shadow = _createShadow(),
			modal = document.getElementById(id),
			content = modal.querySelector(".modal-content"),
			i,
			l = _modals.length;
		for(i = l - 1; i >= 0; i--) {
			if(_modals[i]._status === "open") {
				return console.log("同时只能打开一个模态框");
			}
		}
		_openModal(modal, shadow, content);
	};
	_Modal.prototype.dismiss = function() {
		var shadow = _createShadow(),
			i,
			l = _modals.length;
		for(i = l - 1; i >= 0; i--) {
			if(_modals[i]._status === "open") {
				return _dismissModal(_modals[i], shadow, _modals[i].querySelector(".modal-content"));
			}
		}
		return console.log("没有打开的模态框");
	};


	var _createShadow = (function() {	// 返回一个shadow单例
		var _shadow = null,	// 缓存shadow元素
			init = function() {	// 第一次创建shadow元素
				_shadow = document.createElement("div");
				_shadow.classList.add("modal-shadow");
				bindResize();
				return _shadow;
			},
			bindResize = function() {
				var timer;
				window.onresize = function() {
					clearTimeout(timer);
					timer = setTimeout(function() {
						// console.log(1);
						_shadow.style.height = window.innerHeight + "px";
						_shadow.style.width = window.innerWidth + "px";
					}, 20);
				};
			};

		return function() {
			_shadow = _shadow || init();
			_shadow.style.height = window.innerHeight + "px";
			_shadow.style.width = window.innerWidth + "px";
			return _shadow;
		};
	})();

	function _setStatusToModals() {
		var l = _modals.length,
			i;
		for(i = l - 1; i >=0; i--) {
			_modals[i]._status = "close";    // 每个模态框的初始状态为"close"
		}
	}

	function _runOptions(options, config) {
		for(var i in options) {
			if(config && (i in config) && !config[i]) {
				continue;
			}
			options[i]();
		}
	}

	function _bindShadowClick() {
		_createShadow().onclick = function(event) {	// 绑定点击关闭模态框的事件处理程序
			if(event.target !== this) {
				return;
			}
			var shadow = this,
				content = shadow.querySelector(".modal-content"),
				modal = shadow.parentElement;

			_dismissModal(modal, shadow, content);
		};
	}

	function _addOpenAnimationToModal() {
		var i,
			l = _modals.length;

		for(i = l - 1; i >=0; i--) {
			_modals[i].classList.add("openAnimation");
		}
	}

	function _addCloseAnimationBeforeDismiss() {
		_dismissModal = (function(old) {	// 给关闭模态框函数添加动画功能
			return function(modal, shadow, content) {
				var args = arguments,
					shadowClick = shadow.onclick || null,
					closeHandler = function(event) {
						old.apply(this, args);
						document.body.removeEventListener("animationend", closeHandler);	// 动画结束之后取消绑定在body上的事件处理程序
						modal.classList.remove("closeAnimation");
						shadow.onclick = shadowClick;	// 动画结束后还原shadow点击事件
					};
				shadow.onclick = null;	// 动画开始后先清空shadow上的点击事件以免重复点击
				document.body.addEventListener("animationend", closeHandler);	// IE9+
				modal.classList.add("closeAnimation");
			};
		})(_dismissModal);
	}

	function _openModal(modal, shadow, content) {
		if(modal._status === "open") {
			return console.log(modal.id + "已经打开");
		}
		modal.removeChild(content);
		shadow.appendChild(content);	// 在modal-wrap和modal-content之间插入modal-shadow
		modal.appendChild(shadow);
		modal.classList.add("modal-show");
		modal._status = "open";
	}

	function _dismissModal(modal, shadow, content) {
		if(modal._status === "close") {
			return console.log(modal.id + "已经关闭");
		}
		shadow.removeChild(content);
		modal.removeChild(shadow);
		modal.appendChild(content);
		modal.classList.remove("modal-show");
		modal._status = "close";
	}

	function _addCrossToHeader() {
		var link = document.createElement("link"),
			headers = document.querySelectorAll(".modal-header"),
			i,
			cross;

		// 加载font-awesome库
		link.rel = "stylesheet";
		link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
		document.head.appendChild(link);

		for(i = headers.length - 1; i >= 0; i--) {
			cross = document.createElement("i");
			cross.classList.add("fa", "fa-times", "modal-header-cross");
			// cross.innerHTML = 1;
			headers[i].appendChild(cross);
		}
		return document.querySelectorAll(".modal-header-cross");
	}

	function _bindOpenHandler(buttons) {
		for(var i = buttons.length - 1; i >= 0; i--) {
			buttons[i].onclick = function() {
				var _modalId = this.getAttribute("data-target"),
					modal = document.querySelector("#" + _modalId),
					shadow = _createShadow(),
					content = modal.querySelector(".modal-content");

				_openModal(modal, shadow, content);

				if(shadow.offsetHeight < content.offsetHeight - 40) {	// 获得content的计算样式然后获得height
					shadow.classList.add("block");
				}
				else {
					shadow.classList.remove("block");
				}
				this.blur();
				content.focus();
			};
		}
	}

	function _getModalFromInside(elem) {
		if(elem && elem.classList.contains("modal-wrap")) {
			return elem;
		}
		return _getModalFromInside(elem.parentElement);
	}

	function _bindCancelHandler(cancels) {
		for(var i = cancels.length - 1; i >= 0; i--) {
			cancels[i].onclick = function() {
				var modal = _getModalFromInside(this),
					shadow = modal.querySelector(".modal-shadow"),
					content = shadow.querySelector(".modal-content");

				_dismissModal(modal, shadow, content);
			};
		}
	}

	function _bindEscHandler() {
		var contents = document.querySelectorAll(".modal-content"),
			i;
		for(i = contents.length - 1; i >= 0; i--) {
			contents[i].setAttribute("tabIndex", "1");
			contents[i].onkeydown = function(event) {
				var content = this,
					shadow = this.parentElement,
					modal = _getModalFromInside(this),
					code = event.charCode || event.keyCode;

				if(code === 27) {
					_dismissModal(modal, shadow, content);
				}
			};
		}
	}

	return _Modal;
})();
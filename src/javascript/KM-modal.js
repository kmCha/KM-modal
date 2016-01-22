var Modal = function(conf) {
	this.buttons = document.querySelectorAll("[data-toggle=modal]");	// 获得所有与modal关联的按钮
	this.cancels = document.querySelectorAll("[data-dismiss=modal]");	// 获得所有关闭modal的按钮
	this.conf = conf;	// 配置信息对象
};
Modal.prototype.init = function() {
	var buttons = this.buttons,
		cancels = this.cancels,
		conf = this.conf;

	if(conf && conf.close) {
		var crosses = _addCrossToHeader();
		_bindCancelHandler(crosses);
	}
	if(conf && conf.animation) {
		_addOpenAnimationToModal();
		_addCloseAnimationBeforeDismiss();
	}
	if(conf && conf.shadowClose) {
		_bindShadowClick();
	}
	_bindEscHandler();
	_bindCancelHandler(cancels);
	_bindOpenHandler(buttons);
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
	var modals = document.querySelectorAll(".modal-wrap"),
		i;

	for(i = modals.length - 1; i >=0; i--) {
		(function(i) {
			modals[i].classList.add("openAnimation");
		})(i);
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
			modal.classList.add("closeAnimation");
			document.body.addEventListener("animationend", closeHandler);	// IE9+
		};
	})(_dismissModal);
}

function _openModal(modal, shadow, content) {
	modal.removeChild(content);
	shadow.appendChild(content);	// 在modal-wrap和modal-content之间插入modal-shadow
	modal.appendChild(shadow);
	modal.classList.add("modal-show");
}

function _dismissModal(modal, shadow, content) {
	shadow.removeChild(content);
	modal.removeChild(shadow);
	modal.appendChild(content);
	modal.classList.remove("modal-show");
}

function _addCrossToHeader() {
	var link = document.createElement("link"),
		headers = document.querySelectorAll(".modal-header"),
		i;

	// 加载font-awesome库
	link.rel = "stylesheet";
	link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
	document.head.appendChild(link);

	for(i = headers.length - 1; i >= 0; i--) {
		(function(i) {
			var cross = document.createElement("i");
			cross.classList.add("fa", "fa-times", "modal-header-cross");
			// cross.innerHTML = 1;
			headers[i].appendChild(cross);
		})(i);
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

function _before(old, fn) {
	return function() {
		fn.apply(this, arguments);
		return old.apply(this, arguments);
	};
}

function _after(old, fn) {
	return function() {
		var ret = old.apply(this, arguments);
		fn.apply(this, arguments);
		return ret;
	};
}
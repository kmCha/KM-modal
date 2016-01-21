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
	_bindEscHandler();
	_bindCancelHandler(cancels);
	_bindOpenHandler(buttons);
};

var _createShadow = (function() {	// 返回一个shadow单例
	var _shadow = null,	// 缓存shadow元素
		init = function() {	// 第一次创建shadow元素
			_shadow = document.createElement("div");
			_shadow.classList.add("modal-shadow");
			bindClick();
			bindResize();
			return _shadow;
		},
		bindClick = function() {
			_shadow.onclick = function(event) {	// 绑定点击关闭模态框的事件处理程序
				if(event.target !== this) {
					return;
				}
				var content = this.firstElementChild,
					wrap = this.parentElement;
				this.removeChild(content);
				wrap.removeChild(this);
				wrap.appendChild(content);
				wrap.classList.toggle("modal-show");
			};
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
		headers = document.querySelectorAll(".modal-header");

	// 加载font-awesome库
	link.rel = "stylesheet";
	link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css";
	document.head.appendChild(link);

	for(var i = headers.length - 1; i >= 0; i--) {
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
	var contents = document.querySelectorAll(".modal-content");
	for(var i = contents.length - 1; i >= 0; i--) {
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
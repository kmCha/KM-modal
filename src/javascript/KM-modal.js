var Modal = function() {
	this.buttons = document.querySelectorAll("[data-toggle=modal]");	// 获得所有与modal关联的按钮
	this.cancels = document.querySelectorAll("[data-dismiss=modal]");	// 获得所有关闭modal的按钮
};
Modal.prototype.init = function() {
	var buttons = this.buttons,
		cancels = this.cancels;

	_bindCloseHandler(cancels);
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
					console.log(1);
					_shadow.style.height = window.innerHeight + "px";
					_shadow.style.width = window.innerWidth + "px";
				}, 200);
			};
		};

	return function() {
		_shadow = _shadow || init();
		_shadow.style.height = window.innerHeight + "px";
		_shadow.style.width = window.innerWidth + "px";
		return _shadow;
	};
})();

function _bindOpenHandler(buttons) {
	for(var i = buttons.length - 1; i >= 0; i--) {
		buttons[i].onclick = function() {
			var _targetId = this.getAttribute("data-target"),
				target = document.querySelector("#" + _targetId),
				shadow = _createShadow(),
				content = target.firstElementChild;
			target.removeChild(content);
			shadow.appendChild(content);	// 在modal-wrap和modal-content之间插入modal-shadow
			target.appendChild(shadow);
			target.classList.toggle("modal-show");
		};
	}
}

function _bindCloseHandler(cancels) {
	var getModal = function(elem) {
		if(elem && elem.classList.contains("modal-wrap")) {
			return elem;
		}
		return getModal(elem.parentElement);
	};
	for(var i = cancels.length - 1; i >= 0; i--) {
		cancels[i].onclick = function() {
			var modal = getModal(this),
				shadow = modal.querySelector(".modal-shadow"),
				content = shadow.querySelector(".modal-content");
			shadow.removeChild(content);
			modal.removeChild(shadow);
			modal.appendChild(content);
			modal.classList.toggle("modal-show");
		};
	}
}
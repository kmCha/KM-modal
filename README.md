# KM-modal（模态框插件）

轻量级自适应居中模态框，无任何依赖库，使用简单，[demo](http://45.33.80.77:3000/#/demos/km-modal)

# 使用方法

首先在html文件中加载`css`和`js`文件：
```html
<link rel="stylesheet" type="text/css" href="dist/css/KM-modal.min.css">
<script type="text/javascript" src="dist/javascript/KM-modal.min.js"></script>
```
然后以下列**格式**书写模态框标签：
```html
<div id="modal1" class="modal-wrap">	// 模态框组件
	<div class="modal-content">			// 模态框框体
		<div class="modal-header">		// 模态框标题
			<h3>modal-1</h3>
		</div>
		<div class="modal-body">		// 模态框内容
			<div class="modal-group">	// 模态框中的输入元素组（同行）
				文本输入：<input type="text" value="lalala">
			</div>
			<div class="modal-group">
				单选框组：<input type="radio" name="lala">哈哈
						<input type="radio" name="lala">呵呵
			</div>
			<p>这是一个段落但是我真的不知道写些啥所以只能刷屏了：查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥查马纠西是帅哥</p>
			<span>“我是span元素”</span>
			<span>“这么巧我也是”</span>
		</div>
		<div class="modal-footer">		// 模态框footer
			<button>确定</button>
			<button data-dismiss="modal">取消</button>
		</div>
	</div>
</div>
```
其中需要注意，`id`是**必需**的，他会跟触发他的按钮绑定。其中的取消按钮指定了`data-dismiss="modal"`特性，能够关闭模态框。如果有输入组件，需要将其分组放在`<div class="modal-group"></div>`中，每一组会横竖居中显示在一行。

接下来需要加上一个触发模态框的按钮：
```html
<button data-toggle="modal" data-target="modal1">modal1</button>
```
注意其中的**必需的**`data-toggle="modal"`和`data-target="modal1"`特性，其中`data-target`的值为模态框的`id`。

然后只需要两行代码即可开始使用：
```javascript
window.onload = function() {
	var modal = new Modal();
	modal.init();	// 初始化模态框
};
```
## 支持的配置

在创建`modal`实例的时候传入配置对象：
```javascript
var modal = new Modal({
	close: true,			// 右上角的叉叉
	animation: true,		// 动画效果
	shadowClose: true		// 启用点击阴影处关闭模态框功能
});
modal.init();
```
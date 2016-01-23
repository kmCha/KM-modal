# KM-modal（模态框插件）

轻量级自适应居中模态框，无任何依赖库，使用简单，[demo](http://assignmentrecorder.com/demos/km-modal)

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
除了写`html`按钮来打开模态框之外，还可以用javascript来打开模态框：
```javascript
	modal.open(id);
```
只需传入模态框也就是`.modal-wrap`类元素的`id`字符串进入`modal`实例的`open()`方法即可打开指定的模态框。
**注意**，页面中只能有一个模态框打开，如果在有模态框是打开的情况下调用`open()`方法，将不会有任何反应，为了照顾不喜欢看文档的同学，我在代码中的这个情况下在`console`中输出了错误信息。

## 支持的配置

在创建`modal`实例的时候，如果不传入任何参数，则是默认模式，默认模式下所有功能都是启用了的，如果想关闭某项功能，可以传入配置对象指定要关闭的功能的值为`false`：
```javascript
var modal = new Modal({
	close: false,			// 隐藏右上角的叉叉
	animation: false,		// 关闭动画效果
	shadowClose: false		// 关闭点击阴影处关闭模态框功能
});
modal.init();
```
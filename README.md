# KM-modal

模态框插件

## 用法

	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>KM-modal</title>
		<link rel="stylesheet" type="text/css" href="src/css/KM-modal.css">
	</head>
	<body>
		<div id="modal1" class="modal-wrap">	// 模态框组件
			<div class="modal-content">	// 模态框框体
				<div class="modal-header">modal-1</div>	// 模态框标题
				<div class="modal-body">	// 模态框内容
					<input type="text" value="lalala">
					<input type="text" value="lalala">
				</div>
				<div class="modal-footer">	// 模态框footer
					<button>确定</button>
					<button data-dismiss="modal">取消</button>
				</div>
			</div>
		</div>

		<button data-toggle="modal" data-target="modal1">toggle modal1</button>	// 触发模态框的按钮

		<script type="text/javascript" src="src/javascript/KM-modal.js"></script>
		<script type="text/javascript">
			window.onload = function() {
				var modal = new Modal();
				modal.init();	// 初始化模态框
			};
		</script>
	</body>
	</html>

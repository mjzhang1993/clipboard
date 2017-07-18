'use strict';

// index.html 主页样式

// 设置数据
var jsonDate = [{
	description: ['this is description 0'],
	title: 'this is title 0',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 1'],
	title: 'this is title 1',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 2'],
	title: 'this is title 2',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 3'],
	title: 'this is title 3',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 4'],
	title: 'this is title 4',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 5'],
	title: 'this is title 5',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}, {
	description: ['this is description 6'],
	title: 'this is title 6',
	link: ['http://ask.csdn.net/questions?type=unsolved pwd: 111111', 'http://ask.csdn.net/questions?type=unsolved pwd: 111111']
}];
// alert(jsonDate.length);

window.onload = function () {

	// 创建列表类
	function CardList(data) {
		this.data = data;
	}

	CardList.prototype.createCard = function (item, idx) {
		var description = item.description,
		    title = item.title;

		var retVal = '\n\t\t\t<div class="card">\n\t\t\t\t<h4>' + title + '</h4>\n\t\t\t\t<p class="describe">' + description + '</p>\n\t\t\t\t<div class="trigger">\n\t\t\t\t\t<button class="link" data-clipboard-text="' + idx + '">\n\t\t\t\t\t\tcopy link\n\t\t\t\t\t</button>\n\t\t\t\t\t<button class="text" data-clipboard-text="' + idx + '">\n\t\t\t\t\t\tcopy description\n\t\t\t\t\t</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';
		return retVal;
	};

	CardList.prototype.init = function (wrap) {
		var _this = this;

		this.data.forEach(function (item, i) {
			wrap.innerHTML += _this.createCard(item, i);
		});
	};

	// 创建剪切类
	function Clip(type) {
		this.type = type;
		this.clipBoard = null;
	}
	Clip.prototype.formateType = function () {
		var selector = void 0,
		    attr = void 0;

		switch (this.type) {
			case 'link':
				selector = '.link';
				attr = 'link';
				break;
			case 'text':
				selector = '.text';
				attr = 'description';
				break;
			default:
				selector = '.text';
				attr = 'description';
		}

		return { selector: selector, attr: attr };
	};

	Clip.prototype.init = function (data) {
		var _formateType = this.formateType(),
		    selector = _formateType.selector,
		    attr = _formateType.attr;

		this.clipBoard = new Clipboard(selector, {
			text: function text(trigger) {
				var idx = trigger.dataset.clipboardText;
				var retVal = data[Number(idx)][attr].join('\n');

				console.log(retVal);
				return retVal;
			}
		});
	};

	Clip.prototype.success = function (callbackFn) {
		this.clipBoard.on('success', callbackFn);
	};

	// 创建弹窗对象
	function Pop() {
		this.popEle = null;
	}
	Pop.prototype.init = function (popEle) {
		this.popEle = popEle;
		this.popEle.className = 'pop-hide-1';

		return this;
	};

	Pop.prototype.setInfo = function (newTitle, newType) {
		var title = this.popEle.getElementsByClassName('title')[0];
		var type = this.popEle.getElementsByClassName('type')[0];

		title.innerHTML = newTitle;
		type.innerHTML = newType;

		return this;
	};

	Pop.prototype.show = function (cbFn) {
		var _this2 = this;

		this.popEle.className = 'pop-bg pop-hide-0';

		var showTimer = setTimeout(function () {
			_this2.popEle.className = 'pop-bg';
			clearTimeout(showTimer);
			showTimer = null;

			cbFn && cbFn();
		}, 0);
	};

	Pop.prototype.hide = function () {
		var _this3 = this;

		this.popEle.className = 'pop-bg pop-hide-0';

		var hideTimer = setTimeout(function () {
			_this3.popEle.className = 'pop-hide-1';
			clearTimeout(hideTimer);
			hideTimer = null;
		}, 300);
	};

	/* ======= ======= ====== ======= ======= ======= =======*/

	// 实例化列表
	var cardList = new CardList(jsonDate);
	var wrap = document.getElementsByClassName('home-container')[0];
	cardList.init(wrap);

	// 弹窗初始化
	var pop = new Pop();
	var popNode = document.getElementById('pop-container');
	var a = pop.init(popNode);
	console.log(a);

	// 复制方法对象创建
	var linkClipboard = new Clip('link');
	var textClipboard = new Clip('text');

	// 初始化复制规则
	linkClipboard.init(jsonDate);
	textClipboard.init(jsonDate);

	// 复制后的回调
	linkClipboard.success(function (e) {
		// 复制成功后改变弹窗内容
		var title = jsonDate[Number(e.trigger.dataset.clipboardText)].title;
		pop.setInfo(title, '网盘链接');
		// 显示弹窗
		var keepTimer = void 0;
		pop.show(function () {
			keepTimer = setTimeout(function () {
				pop.hide();
				clearTimeout(keepTimer);
				keepTimer = null;
			}, 1500);
		});
	});

	textClipboard.success(function (e) {
		// 复制成功后改变弹窗内容
		var title = jsonDate[Number(e.trigger.dataset.clipboardText)].title;
		pop.setInfo(title, '资源描述');
		// 显示弹窗
		var keepTimer = void 0;
		pop.show(function () {
			keepTimer = setTimeout(function () {
				pop.hide();
				clearTimeout(keepTimer);
				keepTimer = null;
			}, 1500);
		});
	});
};
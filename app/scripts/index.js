// index.html 主页样式

// 设置数据
const jsonDate = [
	{
		description: ['this is description 0'],
		title: 'this is title 0',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 1'],
		title: 'this is title 1',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 2'],
		title: 'this is title 2',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 3'],
		title: 'this is title 3',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 4'],
		title: 'this is title 4',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 5'],
		title: 'this is title 5',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	},
	{
		description: ['this is description 6'],
		title: 'this is title 6',
		link: [
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111',
			'http://ask.csdn.net/questions?type=unsolved pwd: 111111'
		]
	}
];
// alert(jsonDate.length);

window.onload = function () {

	// 创建列表类
	function CardList(data) {
		this.data = data;
	}

	CardList.prototype.createCard = function (item, idx) {
		const {description, title} = item;
		const retVal = `
			<div class="card">
				<h4>${title}</h4>
				<p class="describe">${description}</p>
				<div class="trigger">
					<button class="link" data-clipboard-text="${idx}">
						copy link
					</button>
					<button class="text" data-clipboard-text="${idx}">
						copy description
					</button>
				</div>
			</div>
		`
		return retVal;
	}

	CardList.prototype.init = function (wrap) {
		this.data.forEach((item, i) => {
			wrap.innerHTML += this.createCard(item, i);
		});
	}

	// 创建剪切类
	function Clip(type) {
		this.type = type;
		this.clipBoard = null;
	}
	Clip.prototype.formateType = function () {
		let selector, attr;

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

		return {selector, attr};
	}

	Clip.prototype.init = function (data) {
		const {selector, attr} = this.formateType();

		this.clipBoard = new Clipboard(selector, {
			text: function (trigger) {
				const idx = trigger.dataset.clipboardText;
				const retVal = data[Number(idx)][attr].join('\n');

				console.log(retVal);
				return retVal;
			}
		});
	}

	Clip.prototype.success = function (callbackFn) {
		this.clipBoard.on('success', callbackFn)
	}

	// 创建弹窗对象
	function Pop() {
		this.popEle = null;
	}
	Pop.prototype.init = function (popEle) {
		this.popEle = popEle;
		this.popEle.className = 'pop-hide-1';

		return this;
	}

	Pop.prototype.setInfo = function (newTitle, newType) {
		const title = this.popEle.getElementsByClassName('title')[0];
		const type = this.popEle.getElementsByClassName('type')[0];

		title.innerHTML = newTitle;
		type.innerHTML = newType;

		return this;
	}

	Pop.prototype.show = function (cbFn) {
		this.popEle.className = 'pop-bg pop-hide-0';

		let showTimer = setTimeout(() => {
			this.popEle.className = 'pop-bg';
			clearTimeout(showTimer);
			showTimer = null;

			cbFn && cbFn();
		}, 0)
	}

	Pop.prototype.hide = function () {
		this.popEle.className = 'pop-bg pop-hide-0';

		let hideTimer = setTimeout(() => {
			this.popEle.className = 'pop-hide-1';
			clearTimeout(hideTimer);
			hideTimer = null;
		}, 300)
	}


	/* ======= ======= ====== ======= ======= ======= =======*/

	// 实例化列表
	const cardList = new CardList(jsonDate);
	const wrap = document.getElementsByClassName('home-container')[0];
	cardList.init(wrap);

	// 弹窗初始化
	const pop = new Pop();
	const popNode = document.getElementById('pop-container');
	const a = pop.init(popNode);
	console.log(a);

	// 复制方法对象创建
	const linkClipboard = new Clip('link');
	const textClipboard = new Clip('text');

	// 初始化复制规则
	linkClipboard.init(jsonDate);
	textClipboard.init(jsonDate);

	// 复制后的回调
	linkClipboard.success(function (e) {
		// 复制成功后改变弹窗内容
		const title = jsonDate[Number(e.trigger.dataset.clipboardText)].title;
		pop.setInfo(title, '网盘链接');
		// 显示弹窗
		let keepTimer;
		pop.show(function () {
			keepTimer = setTimeout(function () {
				pop.hide();
				clearTimeout(keepTimer);
				keepTimer = null;
			}, 1500)
		});

	})

	textClipboard.success(function (e) {
		// 复制成功后改变弹窗内容
		const title = jsonDate[Number(e.trigger.dataset.clipboardText)].title;
		pop.setInfo(title, '资源描述');
		// 显示弹窗
		let keepTimer;
		pop.show(function () {
			keepTimer = setTimeout(function () {
				pop.hide();
				clearTimeout(keepTimer);
				keepTimer = null;
			}, 1500)
		});

	})

}

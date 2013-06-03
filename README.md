# ScrollTrigger

----

这是一个单例。当页面元素进入某个区域内可触发指定的方法。运行该触发器时，位于显示区域的元素对应的方法会被触发。使用记录式的方法来进行管理，主要用于延迟显示页面内容，以减少页面初始化时的加载内容。运行于 [AraleJS](https://github.com/aralejs) 框架。

[API 文档](http://arale.alizoo.com/scroll-trigger/) | [Demo 示例](http://arale.alizoo.com/scroll-trigger/examples/)

----


## 配置说明

### delay `number`

延迟处理时间，整数。


## 方法说明

### start()

运行触发器。

### stop()

停止触发器。

### add(options)

登记触发器及其事件。`options` 结构如下：

* element `element` jQuery 对象。
* distance `number` 距离敏感度，整数，默认为 0。
* onRouse `function` 触发时调用的方法，方法内的 this 指向 element。
* options `object` 方法调用的参数。
* oneoff `boolean` 是否一次性触发（默认为 false）。

### remove(options)

销毁触发器及其事件。`options` 结构如下：

* element `element` jQuery 对象。

### activateAll()

激活所有登记的节点，如果节点在屏幕范围内则触发相应的事件。


## 最佳实践

1. 简单用法

	```js
	seajs.use(['$', 'js/6v/lib/icbu/scroll-trigger/scroll-trigger.js'], function($, ScrollTrigger) {

		// 在 id 为 lamp-1 的对象上注册触发器。
		ScrollTrigger.add({
			element: $('#lamp-1'),
			onRouse: function(args) {
				console.log('1 号灯器');
			}
		});

	});
	```

2. 激活带参，一次性的

	```js
	seajs.use(['$', 'js/6v/lib/icbu/scroll-trigger/scroll-trigger.js'], function($, ScrollTrigger) {

		// 在 id 为 lamp-2 的对象上注册触发器，触发距离为 200，并且只触发一次。
		ScrollTrigger.add({
			element: $('#lamp-2'),
			distance: 200, // 触发距离为 200
			onRouse: function(args) {
				console.log(args.text);
			},
			options: {text: '2 号灯器'},
			oneoff: true
		});

	});
	```
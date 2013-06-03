 define(function(require, exports, module) {
	var $ = require('$'),
		Base = require('base'),
		ScrollTrigger;

	/**
	 * 当页面元素进入某个区域内可触发指定的方法
	 * 运行该触发器时, 位于显示区域的元素对应的方法会被触发, 使用记录式的方法来进行管理.
	 * 主要用于延迟显示页面内容, 以减少页面初始化时的加载内容.
	 *
	 * @extends Base
	 * @param {object} config 配置.
	 * @param {number} config.delay 延迟处理时间.
	 */
	ScrollTrigger = Base.extend({
		attrs: {
			// 延迟触发时间
			delay: {
				value: 400
			}
		},

		/**
		 * 变量
		 */
		registers: {}, // 记录器, 登记的触发项
		registerIndex: 0, // 记录序号
		threadId: null, // 线程 ID
		lock: false, // 运行锁, 不能多次被运行

		/**
		 * 初始化即运行
		 */
		initialize: function() {
			// 开始运行
			this.start();
		},

		/**
		 * 运行触发器
		 */
		start: function() {
			var _self = this;

			// 为避免重复重复执行, 如果已经锁上, 则停止处理
			if(this.lock) {
				return;
			}

			// 加运行锁
			this.lock = true;

			// 激活一次
			this.activateAll();

			// 绑定滚动处理
			$(window).bind('scroll.scrollTrigger', function() {
				_self._scroll();
			});

			// 绑定修改窗口宽度处理
			$(window).bind('resize.scrollTrigger', function() {
				_self._scroll();
			});
		},

		/**
		 * 停止触发器
		 */
		stop: function() {
			// 注销滚动处理
			$(window).unbind('scroll.scrollTrigger');

			// 注销修改窗口宽度处理
			$(window).unbind('resize.scrollTrigger');

			// 解运行锁
			this.lock = false;
		},

		/**
		 * 添加触发器及其事件
		 *
		 * @param {object} options 配置.
		 * @param {jquery object} options.element jQuery 对象.
		 * @param {number} options.distance 距离敏感度.
		 * @param {function} options.onRouse 触发时调用的方法, 方法内的 this 指向 element.
		 * @param {object} options.options 方法调用的参数.
		 * @param {boolean} options.oneoff (选填) 是否一次性触发, 默认为 false.
		 */
		add: function(options) {
			var _self = this;

			$(options.element).each(function() {
				var element = $(this);
				var key = _self.registerIndex++;
				element.data('scrollTrigger', key);

				_self.registers[key] = {
					element: element, // 处理对象
					distance: options.distance || 0, // 距离敏感度 (默认 0, 选填)
					onRouse: options.onRouse, // 记录项方法
					options: options.options || null, // 记录项参数 (默认为空, 选填)
					oneoff: options.oneoff || false // 是否是一次性的 (默认非一次性, 选填)
				};

				// 添加后立即执行一次
				_self._activate(_self.registers[key]);
			});
		},

		/**
		 * 移除触发器及其事件
		 *
		 * @param {object} options 配置.
		 * @param {jquery object} options.element jQuery 对象.
		 */
		remove: function(options) {
			var _self = this;

			var elementArray = $(options.element);
			elementArray.each(function() {
				var element = $(this);
				var key = element.data('scrollTrigger');
				delete _self.registers[key];
			});
		},

		/**
		 * 激活所有登记的节点
		 */
		activateAll: function() {
			// 如果记录器内没有需要触发的对象, 则不做任何事情
			if($.isEmptyObject(this.registers)) {
				return;
			}

			// 循环所有记录项
			for(var key in this.registers) {
				this._activate(this.registers[key]);
			}
		},

		/**
		 * 激活登记的节点
		 */
		_activate: function(register) {
			// 执行所有在范围内元素对应的事件
			if(this._isOnScreen(register.element, register.distance)) {
				register.onRouse.apply(register.element, [register.options]);

				// 如果这个元素的方法只能触发一次, 则记录为可销毁的对象
				if(register.oneoff) {
					// 注意: 因为元素对应的事件有可能是外部的销毁, 所以这些方法需要放在最后执行
					this.remove({element: register.element});
				}
			}
		},

		/**
		 * 滚动事件
		 */
		_scroll: function() {
			var _self = this;

			clearTimeout(this.threadId);
			_self.threadId = setTimeout(function() {
				_self.activateAll();
				clearTimeout(_self.threadId);
			}, _self.get('delay'));
		},

		/**
		 * 判断元素是否在页面显示区域上
		 *
		 * @param {jquery object} element 元素的 jQuery 对象.
		 * @param {number} distance 距离敏感度.
		 */
		_isOnScreen: function(element, distance) {
			var screenRect = getScreenRect();
			var elementRect = getElementRect(element);

			// 如果元素的下边在显示区域之上, 则表示不在显示区域之内
			if(elementRect.bottom < screenRect.top - distance) {
				return false;
			}

			// 如果元素的左边在显示区域之右, 则表示不在显示区域之内
			if(elementRect.left > screenRect.right + distance) {
				return false;
			}

			// 如果元素的上边在显示区域之下, 则表示不在显示区域之内
			if(elementRect.top > screenRect.bottom + distance) {
				return false;
			}

			// 如果元素的右边在显示区域之左, 则表示不在显示区域之内
			if(elementRect.right < screenRect.left - distance) {
				return false;
			}

			return true;
		}
	});

	module.exports = new ScrollTrigger();

	//--------------------helper-------------------//
	/**
	 * 获取元素的矩形
	 *
	 * @param {jquery object} element 元素的 jQuery 对象.
	 */
	function getElementRect(element) {
		var rect = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		var offset = element.offset();

		rect.top = offset.top;
		rect.right = offset.left + element.width();
		rect.bottom = offset.top + element.height();
		rect.left = offset.left;

		return rect;
	}

	/**
	 * 获取页面显示区域的矩形
	 */
	function getScreenRect() {
		var rect = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		var scrollPos = getScrollPos();

		rect.top = scrollPos.top;
		rect.right = scrollPos.left + $(window).width();
		rect.bottom = scrollPos.top + $(window).height();
		rect.left = scrollPos.left;

		return rect;
	}

	/**
	 * 获取页面滚动位置
	 */
	function getScrollPos() {
		var viewport = $(window);
		var pos = {
			left: viewport.scrollLeft(),
			top: viewport.scrollTop()
		};

		return pos;
	}
});

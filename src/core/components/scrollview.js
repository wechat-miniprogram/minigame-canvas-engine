import View                from './view.js';
import {Scroller} from 'scroller';

export default class ScrollView extends View {
  constructor({
    styleInit = {},
    styleActive = {},
    styleDarkInit = {},
    styleDarkActive = {},
    props = {},
    dataset = {},
    idName = '',
    className = '',
  }) {
    super({
      props,
      dataset,
      idName,
      className,
      styleInit,
      styleActive,
      styleDarkInit,
      styleDarkActive,
    });

    this.type = 'ScrollView';

    // 当前列表滚动的值
    this.scrollTop = 0;
    this.scrollLeft = 0;

    // 滚动处理器
    /*this.touch           = new Touch();*/

    this.hasEventBind = false;
    this.currentEvent = null;
  }

  _active() {
    if (this.scrollerObj) {
      this.scrollActive = true;
    }
  }

  _deactive() {
    if (this.scrollerObj) {
      this.scrollActive = false;
    }
  }

  destroySelf() {
    this.isDestroyed = true;
    this.children = null;
    this.currentEvent = null;

    this.off('touchstart')
    this.off('touchmove')
    this.root && this.root.off('touchend');

    this.scrollerObj = null;

    this._scrollerOption = Object.create(null);
  }

  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */
  get scrollHeight() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    const last = this.children[this.children.length - 1];

    return last.layoutBox.top + last.layoutBox.height;
  }

  get scrollWidth() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    const last = this.children[this.children.length - 1];

    return last.layoutBox.left + last.layoutBox.width;
  }

  get scrollerOption() {
    return Object.assign({
      scrollingY: !!(this.scrollHeight > this.layoutBox.height),
      scrollingX: !!(this.scrollWidth > this.layoutBox.width)
    }, this._scrollerOption);
  }

  set scrollerOption(value = {}) {
    this._scrollerOption = value;

    if (this.scrollerObj) {
      Object.assign(this.scrollerObj.options, this.scrollerOption);
    }
  }

  updateRenderPort() {
    if (this.hasEventBind) {
      return;
    }

    this.hasEventBind = true;

    this.root.scrollview = this;

    this.scrollerObj = new Scroller((left, top) => {
      // 可能被销毁了或者节点树还没准备好
      if (this.scrollActive && !this.isDestroyed) {
        this.traverseToChangeGlRect(this, left, top);
        this.root.repaint(false);

        if (this.currentEvent) {
          this.currentEvent.type = 'scroll';
          this.currentEvent.currentTarget = this;
          this.emit('scroll', this.currentEvent);
        }
      }
    }, this.scrollerOpt);

    this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);

    this.scrollActive = false;
    this.on('touchstart', (e) => {
      this.scrollActive = true;
      this.scrollerObj.doTouchStart(e.touches, e.timeStamp);
      this.currentEvent = e;
    });

    this.on('touchmove', (e) => {
      this.scrollerObj.doTouchMove(e.touches, e.timeStamp);
      this.currentEvent = e;
    });

    // 这里不应该是监听scrollview的touchend事件而是屏幕的touchend事件
    this.root.on('touchend', (e) => {
      this.scrollerObj.doTouchEnd(e.timeStamp);
      this.currentEvent = e;
    });
  }

  /**
   *
   * @param {*} node
   * @param {*} x
   * @param {*} y
   */
  traverseToChangeGlRect(node, x = 0, y = 0) {
    const glRect = node.glRect;
    if (node.type !== "ScrollView" && glRect) {
      glRect.x = glRect.originX - x;
      glRect.y = glRect.originY - y;

      if (node.type === 'Text') {
        glRect.text.style.drawX = glRect.text.style.originDrawX - x;
        glRect.text.style.drawY = glRect.text.style.originDrawY - y;
      }
    } else {
      this.scrollTop = y;
      this.scrollLeft = x;
    }

    // @TODO: 多个scrollview嵌套的情况
    node.children.forEach(child => {
      this.traverseToChangeGlRect(child, x, y);
    });
  }
}

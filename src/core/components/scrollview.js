import View                from './view.js';
import Touch               from '../common/touch.js';
import {throttle, createCanvas} from '../common/util.js';

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

    this.type            = 'ScrollView';

    // 当前列表滚动的值
    this.scrollTop = 0;
    this.scrollLeft = 0;
    
    // 滚动处理器
    this.touch           = new Touch();

    this.requestID = null;

    this.sharedTexture = false;

    this._enableTouch = true;

    this.hasEventBind = false;
  }

  get enableTouch() {
    return this._enableTouch;
  }

  set enableTouch(value) {
    this._enableTouch = value;

    if (this._enableTouch) {
      this.touch.enable();
    } else {
      this.touch.disable();
    }
  }

  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */
  get scrollHeight() {
    // scrollview为空的情况
    if (!this.childNodes.length) {
      return 0;
    }

    const last = this.childNodes[this.childNodes.length - 1];

    return last.layoutBox.top + last.layoutBox.height;
  }

  get scrollWidth() {
    // scrollview为空的情况
    if (!this.childNodes.length) {
      return 0;
    }

    const last = this.childNodes[this.childNodes.length - 1];

    return last.layoutBox.left + last.layoutBox.width;
  }

  /**
   * 与主canvas的尺寸保持一致
   */
  updateRenderPort(renderport) {
    if (this.hasEventBind) {
      console.log('has binded')
      return;
    }

    this.hasEventBind = true;
    
    this.root.scrollview = this;

    if ( this.scrollHeight > this.layoutBox.height ) {
      this.touch.setTouchRange(
        -(this.scrollHeight - this.layoutBox.height),
        0,
        this.scrollRender.bind(this)
      );

      // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理
      this.on('touchstart', this.touch.startFunc);
      this.on('touchmove',  this.touch.moveFunc);
      this.on('touchend',   this.touch.endFunc);
    } else if (this.scrollWidth > this.layoutBox.width) {
      this.touch.setTouchRange(
        -(this.scrollWidth - this.layoutBox.width),
        0,
        this.scrollRender.bind(this)
      );

      // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理
      this.on('touchstart', this.touch.startFunc);
      this.on('touchmove',  this.touch.moveFunc);
      this.on('touchend',   this.touch.endFunc);
    }
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
    }
    
    node.childNodes.forEach(child => {
      this.traverseToChangeGlRect(child, x, y);
    })
  }

  scrollRender(top, event) {
    this.scrollLeft = -top;

    this.traverseToChangeGlRect(this, this.scrollLeft, 0);

    event.type = 'scroll';
    event.currentTarget = this;

    this.emit('scroll', event);
    this.root.repaint(false);
  }
}
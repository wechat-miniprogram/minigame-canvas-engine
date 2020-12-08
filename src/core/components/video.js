import {
  nextTick
} from '../common/util.js';
import Block from './block.js';

const toEventName = (event, id) => {
  return `element-${id}-${event}`;
}

export default class Video extends Block {
  constructor(opts) {
    super(opts);
    this.src = opts.src;
    this.type = 'Video';
    this.started = false;
    this.paused = true;
    this.muted = !!opts.muted;
    this.loop = !!opts.loop;
    this.currentTime = 0;
    this.duration = 0;
    this.ended = false;

    nextTick(() => {
      this.bindEvents();
    })
  }
  _hideChilds() {
    if (this._childsHided) {
      return
    }
    setTimeout(() => {
      if (this._poster_) {
        this._poster_.style.display = 'none';
      }
      if (this._play_) {
        this._play_.style.display = 'none';
      }
    }, 0);
    this._childsHided = true;
  }
  _showChilds() {
    if (!this._childsHided) {
      return
    }
    setTimeout(() => {
      if (this._poster_) {
        this._poster_.style.display = 'count'; // hack yoga_wasm display: none, count, flex
      }
      if (this._play_) {
        this._play_.style.display = 'count';
      }
    }, 0);
    this._childsHided = false;
  }
  bindEvents() {
    WeixinCore.native.addEventListener('message', ({
      target,
      data
    }) => {
      if (target !== `context://client/${this.root.canvasContext.canvas.id}`) {
        return;
      }
      if (data.type === 'video-event') {
        if (data.name === 'timeupdate') {
          this._hideChilds();
          this.currentTime = data.payload;
        }
        if (data.name === 'ended') {
          if (this.loop) {
            this.play();
          } else {
            this._showChilds();
          }
        }
        if (data.name === 'release') {
          this._showChilds();
          return;
        }
        this.emit(data.name, data.payload);
      }
    })
  }
  play() {
    if (!this.layoutBox) {
      return Promise.resolve();
    }
    this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
      type: 'video-ctrl',
      data: {
        id: this.id,
        source: this.src,
        muted: this.muted,
        op: 'play'
      }
    })
  }
  mute() {
    this.muted = true;
    this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
      type: 'video-ctrl',
      data: {
        id: this.id,
        op: 'mute'
      }
    });
  }
  unmute() {
    this.muted = false;
    this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
      type: 'video-ctrl',
      data: {
        id: this.id,
        op: 'unmute'
      }
    });
  }
  pause() {
    this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
      type: 'video-ctrl',
      data: {
        id: this.id,
        op: 'pause'
      }
    });
    this._showChilds();
  }
  on(event, callback) {
    super.on(event, callback)
    this.EE.on(toEventName(event, this.id), callback)
  }
  updateRenderData(computedStyle) {
    if (!this.layoutBox) {
      return;
    }
    const renderer = this.root.renderContext;
    if (!this.glRect) {
      this.glRect = renderer.createRoundRect(this.id, this.type);
    }
    this.glRect.reset();
    const {
      width,
      height,
      absoluteX,
      absoluteY
    } = this.layoutBox;
    // 设置渲染区域数据
    this.glRect.updateContours([absoluteX, absoluteY, width, height]);
    // 设置背景色数据
    if (computedStyle.backgroundColor) {
      this.glRect.setBackgroundColor(computedStyle.backgroundColor);
    }
    // 设置边框数据
    if (computedStyle.borderWidth) {
      this.glRect.setBorder(computedStyle.borderWidth, computedStyle.borderColor);
    }
    // 设置圆角数据
    const radius = this.getRadius(computedStyle);
    this.glRect.setRadius(radius);
    this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
      type: 'video-pos',
      data: {
        size: {
          x: absoluteX,
          y: absoluteY,
          width: width,
          height: height
        }
      }
    })
  }
}

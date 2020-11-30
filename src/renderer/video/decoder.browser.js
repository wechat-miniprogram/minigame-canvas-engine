import Emitter from 'tiny-emitter';

const noop = () => {};

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
export default class VideoDecoder extends Emitter {
  constructor() {
    super();
    this.video = document.createElement('video');
    this.video.onended = () => {
      this.emit('ended');
    };
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }
  get width() {
    return this.video.videoWidth;
  }
  get height() {
    return this.video.videoHeight;
  }
  start(opts, cb = noop) {
    if (this._start) {
      this.video.currentTime = opts.startStamp || 0;
      this.video.play();
      cb();
      return;
    }
    this._start = true;
    this.video.onloadeddata = () => {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.video.play();
      cb(null, this.video);
    };
    this.video.onerror = cb;
    this.video.src = opts.source;
    this.video.crossOrigin = 'anonymous';
    this.video.muted = true;
  }
  wait(w, cb = noop) {
    w ? this.stop() : this.video.play();
    cb();
  }
  stop(cb = noop) {
    this.video.pause();
    cb();
  }
  remove(cb = noop) {
    this.video = null;
    cb();
  }
  getFrameData() {
    const { canvas } = this;
    const { ctx } = this;
    ctx.drawImage(this.video, 0, 0);
    return {
      width: canvas.width,
      height: canvas.height,
      pkPts: Math.round(this.video.currentTime * 1000),
      data: ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
    };
  }
  updateVolume(volumn, cb = noop) {
    cb();
  }
  addAudioSource(cb = noop) {
    cb();
  }
  removeAudioSource(cb = noop) {
    cb();
  }
}

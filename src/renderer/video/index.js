import Emitter from 'tiny-emitter';

const noop = () => {};

export default class Video extends Emitter {
  constructor({ source, muted, cachePath, repaint }) {
    super();
    this.source = source;
    this.muted = !!muted;
    this.started = false;
    this.paused = true;
    this.currentTime = 0;
    this.duration = 0;
    this.ended = false;
    this.released = true;
    this.cachePath = cachePath;
    this.repaint = repaint;
  }
  initDecoder() {
    this.decoder = new Video.Decoder();
    this.decoder.on('ended', () => {
      this.ended = true
      this.stop(() => {
        this.emit('ended');
      });
    });
    this.released = false;
  }
  releaseDecoder() {
    if (!this.decoder || this._releasing) {
      return;
    }
    this.released = true;
    this.started = false;

    let decoder = this.decoder;
    Video.cancelAnimationFrame(this.raf);
    this._releasing = true;
    decoder.stop(() => {
      decoder.off('ended');
      decoder.remove();
      decoder = null;
      if (!this.started) {
        this.iData = this.firstFrameData;
        this.repaint && this.repaint();
      }
      this._releasing = false;
    });
  }
  play(cb = noop) {
    if (this.released) {
      this.initDecoder();
    }
    if (this.started && !this.paused) {
      cb();
      return;
    }
    this._playCbs = this._playCbs || [];
    this._playCbs.push(cb);
    if (!this._playInitiating) {
      const onPlayStart = (err, video) => {
        this._playInitiating = false;
        if (err) {
          this.started = false;
          if (this.ended || !this.started) {
            this.stop();
          } else {
            this.decoder.wait(true);
          }
          console.log(err && err.errDesc);
          this.emit('error', err);
          this._playCbs.forEach(fn => fn(err));
          this._playCbs.splice(0, this._playCbs.length);
          return;
        }
        console.log('MediaToolKit video start play!');
        let frameCount = 0;
        let last = Date.now()
        this.ended = false;
        this.paused = false;
        this.started = true;
        this.startPlayTime = last;
        if (video) {
          this.duration = video.duration;
        }

        this.sampleTime = (this.duration / 4) * 1000 || 3000; // 帧率采样只采4个点

        const render = () => {
          if (this.paused) {
            return
          }
          this.renderFrame()

          this.raf = Video.requestAnimationFrame(render);
          frameCount++
          const now = Date.now()
          if (now - last >= this.sampleTime) {
            console.log(`FrameRate: ${Math.round((frameCount * 1000) / (now - last))}fps`)
            frameCount = 0
            last = now
          }
        }
        render();
        this._playCbs.forEach(fn => fn());
        this._playCbs.splice(0, this._playCbs.length);
      };

      this._playInitiating = true;
      if (this.ended || !this.started) {
        this.start({
          source: this.source,
          startStamp: this.ended ? 0 : this.currentTime,
          cachePath: this.cachePath }, onPlayStart);
      } else {
        this.decoder.wait(false, onPlayStart);
      }
    }
  }
  mute(cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    this.muted = true;
    if (!this.started) {
      cb();
      return;
    }
    this.decoder.updateVolume(0, cb);
  }
  unmute(cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    this.muted = false;
    if (!this.started) {
      cb();
      return;
    }
    return this.decoder.updateVolume(1, cb);
  }
  pause(cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    Video.cancelAnimationFrame(this.raf);
    this.decoder.wait(true, (err) => {
      if (err) {
        cb(err);
        return;
      }
      this.paused = true;
      cb();
    });
  }
  start(opts, cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    this.decoder.start(opts, (err) => {
      if (err) {
        cb(err);
        return;
      }
      if (this.muted) {
        this.decoder.updateVolume(0, () => {
          this.decoder.addAudioSource(cb);
        });
      } else {
        this.decoder.addAudioSource(cb);
      }
    });
  }
  stop(cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    Video.cancelAnimationFrame(this.raf);
    this.decoder.stop((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.started = false;
      cb();
    });
  }
  reset(cb = noop) {
    if (!this.decoder) {
      cb('decoder not exist!');
      return;
    }
    Video.cancelAnimationFrame(this.raf);
    this.decoder.stop((err) => {
      this.ended = false;
      this.started = false;
      this.currentTime = 0;
      cb();
    });
  }
  renderFrame() {
    if (!this.decoder) {
      return;
    }
    const frameData = this.decoder.getFrameData()
    if (frameData && frameData.data) {
      if (frameData.pkPts) {
        this.currentTime = frameData.pkPts;
        this.emit('timeupdate', this.currentTime);
      }
      if (!this.iData) {
        this.vWidth = frameData.width;
        this.vHeight = frameData.height;
      }

      if (!this.firstFrameData) {
        this.firstFrameData = new Uint8Array(frameData.data);
      }

      this.iData = new Uint8Array(frameData.data);
      this.repaint && this.repaint();
    }
  }
}

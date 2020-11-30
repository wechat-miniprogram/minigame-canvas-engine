/* global __weixinrenderclient,NativeGlobal */
import Emitter from 'tiny-emitter';
import AudioPlayer from './audio.js';

let globalAudio = null;
const noop = () => {};

/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
export default class VideoDecoder extends Emitter {
  constructor() {
    super();
    this.id = null;
    this.width = 0;
    this.height = 0;
    this.buffer = null;
    this.audioPlayer = globalAudio || (globalAudio = new AudioPlayer());
    this.mediaToolKit = null;
    this._playerReady = function (cb = noop) {
      if (this.id) {
        cb();
        return;
      }
      if (this._playerCreating) {
        this._playerReadyCbs.push(cb);
        return;
      }

      this._playerCreating = true;
      this._playerReadyCbs = this._playerReadyCbs || [];
      this._playerReadyCbs.push(cb);

      this.getMediaToolKit().playerCreate({}, (res) => {
        console.log('MediaToolKit.playerCreate, res', JSON.stringify(res));

        this._playerCreating = false;

        if (res.errCode !== 0) {
          this._playerReadyCbs.forEach(fn => fn(res));
          this._playerReadyCbs.splice(0, this._playerReadyCbs.length);
          return;
        }

        this.id = res.containerId;
        this._playerReadyCbs.forEach(fn => fn());
        this._playerReadyCbs.splice(0, this._playerReadyCbs.length);
      });
    };
    this.bindEvents();
  }
  getMediaToolKit() {
    if (!this.mediaToolKit) {
      this.mediaToolKit = process.env.PLATFORM === 'ios' ? __weixinrenderclient.MediaToolKit : NativeGlobal.MediaToolKit;
    }
    return this.mediaToolKit;
  }
  bindEvents() {
    this.getMediaToolKit().addEventListener('onPlayerPlayEnd', () => {
      this.emit('ended');
    });
  }
  start(option = {}, cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.audioPlayer.start((e) => {
        if (e) {
          cb(e);
          return;
        }
        const params = {
          containerId: this.id,
          filePath: option.source,
          cachePath: option.cachePath || '',
          mode: typeof option.mode !== 'undefined' ? option.mode : 0,
          videoFormat: option.videoFormat || 55,
          startStamp: option.startStamp || 0,
        };
        console.log('MediaToolKit.playerStart, params', JSON.stringify(params));
        this.getMediaToolKit().playerStart(params, (res) => {
          console.log('MediaToolKit.playerStart, res', JSON.stringify(res));

          if (res.errCode !== 0) {
            cb(res);
            return;
          }

          const { video } = res;
          this.width = video.width;
          this.height = video.height;
          this.buffer = new ArrayBuffer(this.width * this.height * 4);
          cb(null, video);
          this.emit('start', video);
        });
      });
    });
  }
  stop(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }

      this.audioPlayer.stop((e) => {
        if (e) {
          cb(e);
          return;
        }
        this.getMediaToolKit().playerStop({
          containerId: this.id,
        }, (res) => {
          console.log('MediaToolKit.playerStop, res', JSON.stringify(res));
          if (res.errCode !== 0) {
            cb(res);
            return;
          }
          cb();
          this.emit('stop');
        });
      });
    });
  }
  wait(wait, cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().playerWait({
        containerId: this.id,
        wait,
      }, (res) => {
        console.log('MediaToolKit.playerWait, res', JSON.stringify(res));
        if (res.errCode !== 0) {
          cb(res);
          return;
        }
        cb();
      });
    });
  }
  remove(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().playerRemove({
        containerId: this.id,
      }, (res) => {
        if (res.errCode !== 0) {
          cb(res);
          return;
        }
        cb();
      });
    });
  }
  addAudioSource(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.audioPlayer.addAudioSource({ id: this.id }, cb);
    });
  }
  removeAudioSource(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.audioPlayer.removeAudioSource({ id: this.id }, cb);
    });
  }
  getFrameData() {
    let buffer;
    let pts;
    let pkPts;
    let dts;
    let pkDts;

    this.getMediaToolKit().playerGetFrame({
      containerId: this.id,
      buffer: this.buffer,
    }, (res) => {
      // console.log('MediaToolKit.playerGetFrame, res', JSON.stringify(res));

      if (res.got) {
        buffer = this.buffer;
      }

      pts = res.pts;
      pkPts = res.pk_pts;
      dts = res.dts;
      pkDts = res.pk_dts;
    });

    return buffer ? {
      width: this.width,
      height: this.height,
      data: buffer,
      pts,
      pkPts,
      dts,
      pkDts,
    } : null;
  }
  updateVolume(volume, cb) {
    this.audioPlayer.updateVolume(volume, cb);
  }
}

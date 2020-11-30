const noop = () => {};

export default class AudioPlayer {
  constructor() {
    this.id = null;
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

      this.getMediaToolKit().audioCreate({}, (res) => {
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
    }
  }
  getMediaToolKit() {
    if (!this.mediaToolKit) {
      this.mediaToolKit = process.env.PLATFORM === 'ios' ? __weixinrenderclient.MediaToolKit : NativeGlobal.MediaToolKit;
    }
    return this.mediaToolKit;
  }
  start(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioStart({
        containerId: this.id
      }, function (res) {
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      });
    })
  }
  addAudioSource(source, cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioAddTask({
        containerId: this.id,
        taskId: source.id
      }, function (res) {
        console.log(`MediaToolKit.audioAddTask res: ${JSON.stringify(res)}`)
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      });
    })
  }
  removeAudioSource(source, cb) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioDelTask({
        containerId: this.id,
        taskId: source.id
      }, function (res) {
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      });
    });
  }
  updateVolume(audioVolume, cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioUpdate({
        containerId: this.id,
        audioVolume
      }, function (res) {
        console.log('MediaToolKit audioUpdate res', JSON.stringify(res));
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      })
    });
  }
  stop(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioStop({
        containerId: this.id
      }, function (res) {
        console.log('MediaToolKit audioStop res', JSON.stringify(res));
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      });
    });
  }
  remove(cb = noop) {
    this._playerReady((err) => {
      if (err) {
        cb(err);
        return;
      }
      this.getMediaToolKit().audioRemove({
        containerId: this.id
      }, function (res) {
        if (res.errCode === 0) {
          cb(null, res);
        } else {
          cb(res);
        }
      });
    });
  }
}

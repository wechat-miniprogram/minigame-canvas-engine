var _frameRate = 60;
cc.game.setFrameRate = function (frameRate) {
    _frameRate = frameRate;
    if (wx.setPreferredFramesPerSecond) {
        wx.setPreferredFramesPerSecond(frameRate);
    }
    else {
        if (this._intervalId) {
            window.cancelAnimFrame(this._intervalId);
        }
        this._intervalId = 0;
        this._paused = true;
        this._setAnimFrame();
        this._runMainLoop();
    }
};

cc.game._setAnimFrame = function () {
    this._lastTime = performance.now();
    this._frameTime = 1000 / _frameRate;

    if (_frameRate !== 60 && _frameRate !== 30) {
        window.requestAnimFrame = this._stTime;
        window.cancelAnimFrame = this._ctTime;
    }
    else {
        window.requestAnimFrame = window.requestAnimationFrame || this._stTime;
        window.cancelAnimFrame = window.cancelAnimationFrame || this._ctTime;
    }
};

cc.game.getFrameRate = function () {
    return _frameRate;
};

cc.game._runMainLoop = function () {
    var self = this, callback, config = self.config,
        director = cc.director,
        skip = true, frameRate = config.frameRate;

    cc.debug.setDisplayStats(config.showFPS);

    callback = function () {
        if (!self._paused) {
            self._intervalId = window.requestAnimFrame(callback);
            if (frameRate === 30) {
                if (skip = !skip) {
                    return;
                }
            }
            director.mainLoop();
        }
    };

    self._intervalId = window.requestAnimFrame(callback);
    self._paused = false;
};
// wechat game platform not support this api
cc.game.end = function () {};
/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

(function () {
    if (!(cc && cc.VideoPlayer && cc.VideoPlayer.Impl)) {
        return;
    }

    var math = cc.vmath;
    var _mat4_temp = math.mat4.create();
    const PLAY_INTERVAL = 10;
    var playTimer = null;

    var _impl = cc.VideoPlayer.Impl;
    var _p = cc.VideoPlayer.Impl.prototype;

    cc.VideoPlayer.prototype._updateVideoSource = function _updateVideoSource() {
        let url = '';
        if (this.resourceType === cc.VideoPlayer.ResourceType.REMOTE) {
            url = this.remoteURL;
        }
        else if (this._clip) {
            url = this._clip._nativeAsset || '';
        }
        this._impl.setURL(url, this._mute || this._volume === 0);
    };

    _p._bindEvent = function () {
        let video = this._video,
            self = this;

        if (!video) {
            return;
        }

        video.onPlay(function () {
            if (self._video !== video) return;
            self._playing = true;
            self._dispatchEvent(_impl.EventType.PLAYING);
        });
        video.onEnded(function () {
            if (self._video !== video) return;
            self._playing = false;
            self._currentTime = self._duration;  // ensure currentTime is at the end of duration
            self._dispatchEvent(_impl.EventType.COMPLETED);
        });
        video.onPause(function () {
            if (self._video !== video) return;
            self._playing = false;
            self._dispatchEvent(_impl.EventType.PAUSED);
        });
        video.onTimeUpdate(function (res) {
            self._duration = res.duration;
            self._currentTime = res.position;
        });
        // onStop not supported, implemented in promise returned by video.stop call.
    };

    _p._unbindEvent = function () {
        let video = this._video;
        if (!video) {
            return;
        }

        // BUG: video.offPlay(cb) is invalid
        video.offPlay();
        video.offEnded();
        video.offPause();
        video.offTimeUpdate();
        // offStop not supported        
    };

    _p.setVisible = function (value) {
        let video = this._video;
        if (!video || this._visible === value) {
            return;
        }
        if (value) {
            video.width = this._actualWidth || 0;
        }
        else {
            video.width = 0;  // hide video
        }
        this._visible = value;
    };

    _p.createDomElementIfNeeded = function () {
        if (!wx.createVideo) {
            cc.warn('VideoPlayer not supported');
            return;
        }

        if (!this._video) {
            this._video = wx.createVideo();
            this._video.showCenterPlayBtn = false;
            this._video.controls = false;
            this._duration = -1;
            this._currentTime = -1;
            this._loaded = false;
            this.setVisible(false);
            this._bindEvent();
        }
    };

    _p.setURL = function (path) {
        let video = this._video;
        if (!video || video.src === path) {
            return;
        }
        if (wx.getSystemInfoSync().platform === 'devtools') {
            video.src = path;
        }
        else {
            video.stop();
            this._unbindEvent();
            video.src = path;
            video.muted = true;
            let self = this;
            this._loaded = false;
            function loadedCallback () {
                video.offPlay();
                self._bindEvent();
                video.stop();
                video.muted = false;
                self._loaded = true;
                self._playing = false;
                self._currentTime = 0;
                self._dispatchEvent(_impl.EventType.READY_TO_PLAY);
                if (playTimer) {
                    clearInterval(playTimer);
                    playTimer = null;
                }
            }
            video.onPlay(loadedCallback);

            // HACK: keep playing till video loaded
            video.play();
            if (!playTimer) {
                playTimer = setInterval(function () {
                    video.play();
                }, PLAY_INTERVAL);
            }
        }
    };

    _p.getURL = function() {
        let video = this._video;
        if (!video) {
            return '';
        }
        
        return video.src;
    };

    _p.play = function () {
        let video = this._video;
        if (!video || !this._visible || this._playing) return;

        video.play();
    };

    _p.pause = function () {
        let video = this._video;
        if (!this._playing || !video) return;

        video.pause();
    };

    _p.resume = function () {
        let video = this._video;
        if (this._playing || !video) return;

        video.play();
    };

    _p.stop = function () {
        let self = this;
        let video = this._video;
        if (!video || !this._visible) return;

        video.stop().then(function (res) {
            if (res.errMsg && !res.errMsg.includes('ok')) {
                console.error('failed to stop video player');
                return;
            }
            self._currentTime = 0;
            video.seek(0);  // ensure to set currentTime by 0 when video is stopped
            self._playing = false;
            self._dispatchEvent(_impl.EventType.STOPPED);
        });
    };

    _p.setVolume = function (volume) {
        // wx not support setting video volume
    };


    _p.seekTo = function (time) {
        let video = this._video;
        if (!video || !this._loaded) return;
        
        video.seek(time);
    };

    _p.isPlaying = function () {
        return this._playing;
    };

    _p.duration = function () {
        return this._duration;
    };

    _p.currentTime = function () {        
        return this._currentTime;
    };

    _p.setKeepAspectRatioEnabled = function (isEnabled) {
        console.warn('On wechat game videoPlayer is always keep the aspect ratio');
    };

    _p.isKeepAspectRatioEnabled = function () {
        return true;
    };

    _p.isFullScreenEnabled = function () {
        return this._fullScreenEnabled;
    };

    _p.setFullScreenEnabled = function (enable) {
        let video = this._video;
        if (!video || this._fullScreenEnabled === enable) {
            return;
        }
        if (enable) {
            video.requestFullScreen();
        }
        else {
            video.exitFullScreen();
        }
        this._fullScreenEnabled = enable;
    };

    _p.enable = function () {
        this.setVisible(true);
    };

    _p.disable = function () {
        this.setVisible(false);
    };

    _p.destroy = function () {
        this.disable();
        this._unbindEvent();
        if (this._video) {
            this._video.destroy();
            this._video = undefined;
        }
    };

    _p.updateMatrix = function (node) {
        if (!this._video || !this._visible) return;

        node.getWorldMatrix(_mat4_temp);

        let renderCamera = cc.Camera._findRendererCamera(node);
        if (renderCamera) {
            renderCamera.worldMatrixToScreen(_mat4_temp, _mat4_temp, cc.visibleRect.width, cc.visibleRect.height);
        }

        if (!this._forceUpdate &&
            this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 &&
            this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 &&
            this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 &&
            this._w === node._contentSize.width && this._h === node._contentSize.height) {
            return;
        }

        // update matrix cache
        this._m00 = _mat4_temp.m00;
        this._m01 = _mat4_temp.m01;
        this._m04 = _mat4_temp.m04;
        this._m05 = _mat4_temp.m05;
        this._m12 = _mat4_temp.m12;
        this._m13 = _mat4_temp.m13;
        this._w = node._contentSize.width;
        this._h = node._contentSize.height;

        let scaleX = cc.view._scaleX, scaleY = cc.view._scaleY;
        let dpr = cc.view._devicePixelRatio;
        scaleX /= dpr;
        scaleY /= dpr;
 
        let w = this._w * scaleX;
        let h = this._h * scaleY;
        let appx = (w * _mat4_temp.m00) * node._anchorPoint.x;
        let appy = (h * _mat4_temp.m05) * (1 - node._anchorPoint.y);  // original point of video is (0, 1)
        let tx = _mat4_temp.m12 * scaleX - appx, ty = _mat4_temp.m13 * scaleY - appy;
        // calculate scale
        w *= _mat4_temp.m00;
        h *= _mat4_temp.m05;

        this._video.x = tx;
        this._video.y = ty;
        this._actualWidth = this._video.width = w;
        this._video.height = h;
    };
})();

(function () {
    if (!cc || !cc.Audio) {
        return;
    }

    if (cc.sys.os !== cc.sys.OS_ANDROID) {
        return;
    }

    cc.Audio.prototype.stop = function () {
        if (!this._element) return;
        // 由于 web 端没有 stop 接口，是通过 pause + currentTime = 0 的方式进行 stop 的
        // 但是在微信小游戏安卓平台上，pause 后是无法设置 currentTime 为 0 的，从而进行适配
        this._element.currentTime = 0;
        this._element.stop();
        this._unbindEnded();
        this.emit('stop');
        this._state = cc.Audio.State.STOPPED;
    };
})();
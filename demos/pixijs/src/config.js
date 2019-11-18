
export function getDeviceInfo() {
    let info = {};
    let defaultInfo = {
        devicePixelRatio: 2,
        windowWidth     : 375, windowHeight    : 667
    }

    if ( typeof wx !== 'undefined' ) {
        try {
            info = wx.getSystemInfoSync();
        } catch (e) {
            info = defaultInfo
        }
    } else {
        info = defaultInfo;
    }

    return info;
}

const deviceinfo = getDeviceInfo();

export default {
    debug       : true,

    dpr         : deviceinfo.devicePixelRatio,
    windowWidth : deviceinfo.windowWidth,
    windowHeight: deviceinfo.windowHeight,
    GAME_HEIGHT : deviceinfo.windowHeight * deviceinfo.devicePixelRatio,
    GAME_WIDTH  : deviceinfo.windowWidth * deviceinfo.devicePixelRatio,

    pixiOptions: {
        backgroundColor: 0xf5f5f5,
        antialias      : false,
        sharedTicker   : true,
        view           : canvas,
    },

    deviceinfo,
}

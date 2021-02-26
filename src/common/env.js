
const isMiniGamePlugin  = !!( typeof pluginEnv !== "undefined" );
const isMiniGame = !!( typeof wx !== "undefined" ) || isMiniGamePlugin;

let isIOS = false;
let isAndroid = false;
let isDevtools = false;
let wx;

if (isMiniGame) {
  wx = isMiniGamePlugin ? pluginEnv.customEnv.wx : wx;
  try {
    let info = wx.getSystemInfoSync() || {};

    if (info.platform == "devtools") {
      isDevtools = true;
    } else if (info.platform == "ios") {
      isIOS = true;
    } else if (info.platform == "android") {
      isAndroid = true;
    }
  } catch(e) {
    console.error(e);
  }
}

let env = {
  isMiniGamePlugin,
  isMiniGame,
  isIOS,
  isAndroid,
  isDevtools,
}

if (wx) {
  env.wx = wx;
}

export default env;

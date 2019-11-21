require('libs/weapp-adapter/index');
var Parser = require('libs/xmldom/dom-parser');
window.DOMParser = Parser.DOMParser;
require('libs/wx-downloader.js');
require('src/settings');
var settings = window._CCSettings;
require('main');

// Will be replaced with cocos2d-js path in editor
require('cocos/cocos2d-js-min.js');

require('./libs/engine/index.js');

// Adjust devicePixelRatio
cc.view._maxPixelRatio = 3;

wxDownloader.REMOTE_SERVER_ROOT = "";
wxDownloader.SUBCONTEXT_ROOT = "";
var pipeBeforeDownloader = cc.loader.subPackPipe || cc.loader.md5Pipe || cc.loader.assetLoader;
cc.loader.insertPipeAfter(pipeBeforeDownloader, wxDownloader);

if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
    var _WECHAT_SUBDOMAIN_DATA = require('src/subdomain.json.js');
    cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
        cc.Pipeline.Downloader.PackDownloader._doPreload("WECHAT_SUBDOMAIN", _WECHAT_SUBDOMAIN_DATA);
    });

    require('./libs/sub-context-adapter');
}
else {
    // Release Image objects after uploaded gl texture
    cc.macro.CLEANUP_IMAGE_CACHE = true;
}
wxDownloader.init();
window.boot();
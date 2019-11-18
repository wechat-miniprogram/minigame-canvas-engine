import * as PIXI   from '../libs/pixi.js';
import config      from './config.js';

let sys = wx.getSystemInfoSync();
let dpr = sys.pixelRatio;

const postTypeMap = {
    init          : -1,
    best          : 0,
    friendRank    : 2,
    groupRank     : 3,
    report        : 4,
    setTitle      : 5,
    setUnit       : 6,
    setSort       : 7,
    setPeriod     : 8,
    close         : 9,
    updateViewPort: 10,
};

class SubContext {
    constructor() {
        this.gameid = 'test';
    }

    setRender(renderer) {
        this.renderer = renderer;
        this.stage    = this.renderer.stage;
    }

    init(renderer) {
        this.sys = sys;
        this.setRender(renderer);

        this.friendRankShow = false;

        this.openDataContext = wx.getOpenDataContext();
        this.sharedCanvas    = this.openDataContext.canvas;

        // 中间挖了个坑用填充排行榜
        this.sharedCanvas.width  = 640;
        this.sharedCanvas.height = 960;

        // 子域初始化
        this.openDataContext.postMessage({
            postType  : postTypeMap.init,
            gameid    : this.gameid,
        });

        const realWidth  = this.sharedCanvas.width / config.GAME_WIDTH * sys.windowWidth * ( dpr / 2);
        const realHeight = this.sharedCanvas.height / config.GAME_HEIGHT * sys.windowHeight * ( dpr / 2);

        this.openDataContext.postMessage({
            postType  : postTypeMap.updateViewPort,
            box       : {
                width  : realWidth,
                height : realHeight,
                x      : ( sys.windowWidth - realWidth ) / 2,
                y      : ( sys.windowHeight - realHeight ) / 2,
            }
        });
    }

    preFriendRank() {
        /**
         * 排行榜已经展示的情况不能重复刷新子域不然页面会闪烁
         */
        if ( this.friendRankShow ) {
            return;
        }

        this.openDataContext.postMessage({
            postType  : postTypeMap.friendRank,
            gameid    : this.gameid,
        });

        this.friendRankShow = true;
    }

    clearFriendRank() {
        this.stage.removeChild(this.bg);

        let sub = this.stage.getChildByName('shared');
        if ( sub ) {
            this.stage.removeChild(sub);
        }

        let close = this.stage.getChildByName('friendRankClose');
        if ( close ) {
            this.stage.removeChild(close);
        }
    }

    renderFriendRank() {
        let texture = PIXI.Texture.fromCanvas(this.sharedCanvas);
        texture.update();
        let shared = new PIXI.Sprite(texture);
        shared.name = 'shared';

        /**
         * 根据dpr改变子域展示区域的大小
         * 记得要更新真实渲染位置的大小
         */
        shared.width  *= ( dpr / 2);
        shared.height *= ( dpr / 2);
 
        shared.x = config.GAME_WIDTH / 2 - shared.width / 2;
        shared.y = config.GAME_HEIGHT / 2 - shared.height / 2;

        this.stage.addChild(shared);

        let close = new PIXI.Sprite.fromImage('img/close.png');

        close.width       = 40 * dpr;
        close.height      = 40 * dpr;
        close.x           = config.GAME_WIDTH / 2 - close.width / 2;
        close.y           = config.GAME_HEIGHT - 250;
        close.interactive = true;
        this.stage.addChild(close);

        close.on('pointerdown', () => {
            this.friendRankShow = false;
            this.openDataContext.postMessage({
                postType  : postTypeMap.close,
                gameid    : this.gameid,
            });
            this.renderer.stage.removeChild(close);

            close = null;

        });

        close.name = 'friendRankClose';
    }

    reportScore(value) {
        this.openDataContext.postMessage({
            postType  : postTypeMap.report,
            gameid    : this.gameid,
            score     : value,
        });
    }

    showRank() {
        this.preFriendRank();
    }
}

export default new SubContext();

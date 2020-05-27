import * as PIXI   from '../libs/pixi.js';

const info        = wx.getSystemInfoSync();
const scale       = 3;
const GAME_WIDTH  = info.windowWidth * scale;
const GAME_HEIGHT = info.windowHeight * scale;

export default class App extends PIXI.Application {
    constructor() {
        super(GAME_WIDTH, GAME_HEIGHT, {
            backgroundColor: 0xf5f5f5,
            antialias      : false,
            sharedTicker   : true,
            view           : canvas,
        });

        // 适配小游戏的触摸事件
        this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
            point.x = x * info.devicePixelRatio;
            point.y = y * info.devicePixelRatio;
        };

        this.aniId    = null;
        this.bindLoop = this.loop.bind(this);

        this.init();
    }

    init() {
        this.timer = +new Date();
        this.aniId = window.requestAnimationFrame(this.bindLoop);

        let icon = this.createBtn({
            img    : 'http://wximg.qq.com/wxgame/tmp/zimyuan/gamebtn.png',
            x      : GAME_WIDTH / 2,
            y      : GAME_HEIGHT / 2,
            text   : '',
            onclick: () => {
                this.showRank();
            }
        });
        this.stage.addChild(icon);

        this.initShareCanvas();

        setTimeout(()=> {
            this.showRank();
        }, 30)
    }

    showRank() {
        if ( this.friendRankShow ) {
            return;
        }

        this.openDataContext.postMessage({
            event: 'showFriendRank',
        });

        this.friendRankShow = true;
    }

    initShareCanvas() {
        this.friendRankShow  = false;
        this.openDataContext = wx.getOpenDataContext();
        this.sharedCanvas    = this.openDataContext.canvas;

        // 中间挖了个坑用填充排行榜
        this.sharedCanvas.width  = 960;
        this.sharedCanvas.height = 1410;

        const realWidth  = this.sharedCanvas.width / GAME_WIDTH * info.windowWidth;
        const realHeight = this.sharedCanvas.height / GAME_HEIGHT * info.windowHeight;

        this.openDataContext.postMessage({
            event: 'updateViewPort',
            box       : {
                width  : realWidth,
                height : realHeight,
                x      : ( info.windowWidth - realWidth ) / 2,
                y      : ( info.windowHeight - realHeight ) / 2,
            }
        });
    }

    createBtn(options) {
        let { img, text, x, y, onclick, width, height, style } = options;

        let btn = PIXI.Sprite.from(img);
        btn.anchor.set(.5);
        btn.x = x;
        btn.y = y;

        if ( width ) {
            btn.width = width;
        }
        if ( height ) {
            btn.height = height;
        }

        if ( onclick && typeof onclick === 'function' ) {
            btn.interactive = true;
            btn.on('pointerdown', onclick);
        }

        let _text = new PIXI.Text(text, style || {fontSize: 32, align: 'center'});
        _text.anchor.set(0.5);

        btn.addChild(_text);

        return btn;
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
        shared.width  *= 1.2;
        shared.height *= 1.2;

        shared.x = GAME_WIDTH / 2 - shared.width / 2;
        shared.y = GAME_HEIGHT / 2 - shared.height / 2;

        this.stage.addChild(shared);
    }

    _update(dt) {
        // 每一帧都先清除子域
        let sub = this.stage.getChildByName('shared');
        if ( sub ) {
            this.stage.removeChild(sub);
        }

        // 如果需要展示好友排行榜，将最新的子域绘制出来
        if ( this.friendRankShow ) {
            this.renderFriendRank();
        }
    }

    loop() {
        let time = +new Date();
        this._update(time - this.timer);
        this.timer = time;
        this.renderer.render(this.stage);
        this.aniId = window.requestAnimationFrame(this.bindLoop);
    }
}


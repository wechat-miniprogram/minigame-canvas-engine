import * as PIXI   from '../libs/pixi.js';
import config      from './config.js';
import subContext from './subcontext.js';

export default class App extends PIXI.Application {
    constructor() {
        super(config.GAME_WIDTH, config.GAME_HEIGHT, config.pixiOptions);

        // 适配小游戏的触摸事件
        this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
            point.x = x * config.dpr;
            point.y = y * config.dpr;
        };

        subContext.init(this);

        subContext.reportScore(1);
        subContext.showRank();

        this.aniId    = null;
        this.bindLoop = this.loop.bind(this);

        this.init();
    }

    init() {
        this.timer = +new Date();
        this.aniId = window.requestAnimationFrame(this.bindLoop);

        let icon = this.createBtn({
            img    : 'http://wximg.qq.com/wxgame/tmp/zimyuan/gamebtn.png',
            x      : config.GAME_WIDTH / 2,
            y      : config.GAME_HEIGHT / 2,
            text   : '',
            onclick: () => {
                subContext.reportScore(1);
                subContext.showRank();
            }
        })
        this.stage.addChild(
            icon
        );
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

    _update(dt) {
        // 每一帧都先清除子域
        subContext.clearFriendRank();

        // 如果需要展示好友排行榜，将最新的子域绘制出来
        if ( subContext.sharedCanvas && subContext.friendRankShow ) {
            subContext.renderFriendRank();
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


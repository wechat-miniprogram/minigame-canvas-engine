import * as PIXI from '../libs/pixi.js';

import tplFn from './render/tplfn.js';
import style from './render/style.js';
import Layout from '../libs/engine.js';

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
            point.x = x * 3 * (375 / window.innerWidth);
            point.y = y * 3 * (667 / window.innerHeight);
        };


        this.aniId = null;
        this.bindLoop = this.loop.bind(this);

        this.init();
    }

    init() {
        this.timer = +new Date();
        this.aniId = window.requestAnimationFrame(this.bindLoop);

        // 创建mock数据
        let item = {
            nickname: "zim",
            rankScore: 1,
            avatarUrl: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
            avatarUrl: 'img/close.png',
            starSum: 1,
        };
        let datasource =  {
            data     :[],
            selfIndex: 0,
            self     : item
        }
        for ( let i = 0; i < 20;i++ ) {
            var cp = JSON.parse(JSON.stringify(item));
            cp.rankScore = Math.floor(Math.random()*1000+1)
            cp.starSum   = i + 1;
            datasource.data.push(cp);
        }

        let resultText = tplFn(datasource);
        let canvas = wx.createCanvas();
        let context = canvas.getContext('2d');

        // 设置canvas的尺寸和样式的container比例一致
        canvas.width  = 960;
        canvas.height = 1410;

        const realWidth  = canvas.width / GAME_WIDTH * info.windowWidth;
        const realHeight = canvas.height / GAME_HEIGHT * info.windowHeight;

        Layout.clear();
        Layout.init(resultText, style);
        Layout.updateViewPort({
            width  : realWidth,
            height : realHeight,
            x      : ( info.windowWidth - realWidth ) / 2,
            y      : ( info.windowHeight - realHeight ) / 2,
        });

        Layout.layout(context);

        let texture = PIXI.Texture.fromCanvas(canvas);
        texture.update();

        let sp = new PIXI.Sprite(texture);
        sp.name = 'rank';
        sp.x = GAME_WIDTH / 2 - sp.width / 2;
        sp.y = GAME_HEIGHT / 2 - sp.height / 2;
        this.stage.addChild(sp);

        this.texture = texture;
    }

    _update(dt) {
        // 每一帧都先清除子域
        let rank = this.stage.getChildByName('rank');
        if ( rank ) {
            this.stage.removeChild(rank);
        }

        // 如果需要展示好友排行榜，将最新的子域绘制出来
        if ( this.texture ) {
            this.texture.update();
            let sp = new PIXI.Sprite(this.texture);
            sp.name = 'rank';
            sp.x = GAME_WIDTH / 2 - sp.width / 2;
            sp.y = GAME_HEIGHT / 2 - sp.height / 2;
            this.stage.addChild(sp);
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

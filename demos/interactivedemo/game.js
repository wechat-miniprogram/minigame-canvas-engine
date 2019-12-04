import './libs/adapter/index';
import * as PIXI   from './libs/pixi.js';

const info        = wx.getSystemInfoSync();
const scale       = 3;
const GAME_WIDTH  = info.windowWidth * scale;
const GAME_HEIGHT = info.windowHeight * scale;

class App extends PIXI.Application {
    constructor() {
        super(GAME_WIDTH, GAME_HEIGHT, {
            backgroundColor: 0xf5f5f5,
            antialias      : false,
            sharedTicker   : true,
            view           : canvas,
        });

        // 适配小游戏的触摸事件
        this.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => { point.x = x * info.devicePixelRatio;
            point.y = y * info.devicePixelRatio;
        };

        this.aniId    = null;
        this.bindLoop = this.loop.bind(this);

        this.init();
    }

    init() {
        this.initWxEvents();
        this.initUI();

        this.timer = +new Date();
        this.aniId = window.requestAnimationFrame(this.bindLoop);

        this.initShareCanvas();
    }

    initUI() {
        let btn = PIXI.Sprite.from('imgs/refresh.png');
        btn.width  = 258;
        btn.height =  100;
        btn.x      = (GAME_WIDTH - btn.width) / 2;
        btn.y      = GAME_HEIGHT - 300;

        btn.interactive = true;
        btn.on('pointerdown', () => {
            this.openDataContext.postMessage({
                event: 'refreshData',
            });
        });

        this.stage.addChild(btn);
    }

    initWxEvents() {
        // 设置定向分享参数（这里假设1代表的是邀请新玩家场景值）
        wx.setMessageToFriendQuery({
            shareMessageToFriendScene: 1
        });

        // 初始化云函数
        wx.cloud.init();

        // 如果是从定向分享冷启动游戏，告诉子域更新邀请逻辑
        wx.onShow((options) => {
            console.log('onShow options', options);

            // 玩家通过被邀请的卡片进入，向子域发送消息，要求修改开放数据域消息
            if (options && options.query.shareMessageToFriendScene === '1' ) {
                this.openDataContext.postMessage({
                    event: 'reciveInvite',
                });
            }
        });

        // 通过云函数拿到openid
        wx.cloud.callFunction({
            name: 'getOpenId',
        }).then(({result}) => {

            this.openDataContext.postMessage({
                event: 'getOpenId',
                value: result.openid
            });

            // 拿到openid之后子域会请求并渲染数据，主域同步渲染子域
            this.showPotentialFriend();
        });

        // 获取用户的加密交互数据
        wx.getUserInteractiveStorage({
            keyList: ['2'],
            success: (res) => {
                console.log('getUserInteractiveStorage', res);
                let {encryptedData, iv, cloudID} = res;

                wx.cloud.callFunction({
                    name: 'getUserInteractiveStorage',
                    data: {
                        userInteractive: wx.cloud.CloudID(cloudID),
                    }
                }).then(res => {
                    console.log('cloud getUserInteractiveStorage', res);
                });
            }
        });

        // 监听到邀请成功事件
        wx.onInteractiveStorageModified(key => {
            wx.showToast({
                title: '成功接收好友的邀请加入游戏',
                icon: 'none',
                duration: 2000
            });
        });
    }

    showPotentialFriend() {
        if ( this.friendRankShow ) {
            return;
        }

        this.friendRankShow = true;
    }

    initShareCanvas() {
        this.friendRankShow  = false;
        this.openDataContext = wx.getOpenDataContext();
        this.sharedCanvas    = this.openDataContext.canvas;

        let width  = 960;
        let height = 1410;

        this.renderWidth  = GAME_WIDTH * 0.9;
        this.renderHeight = this.renderWidth * ( height / width);

        // 中间挖了个坑用填充排行榜
        this.sharedCanvas.width  = width;
        this.sharedCanvas.height = height;

        const realWidth  = this.renderWidth / GAME_WIDTH * info.windowWidth;
        const realHeight = realWidth * ( this.renderHeight / this.renderWidth );

        this.openDataContext.postMessage({
            event: 'updateViewPort',
            box       : {
                width  : realWidth,
                height : realHeight,
                x      : ( info.windowWidth - realWidth ) / 2,
                y      : ( info.windowHeight - realHeight ) / 2,
            }
        });

        this.sharedTexture = PIXI.Texture.fromCanvas(this.sharedCanvas);
    }

    renderFriendRank() {
        this.sharedTexture.update();

        let shared = new PIXI.Sprite(this.sharedTexture);
        shared.name = 'shared';

        shared.width = this.renderWidth;
        shared.height = this.renderHeight;

        shared.x = GAME_WIDTH / 2 - this.renderWidth / 2;
        shared.y = GAME_HEIGHT / 2 - this.renderHeight / 2;

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

new App();


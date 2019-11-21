import style    from 'render/style.js';
import tplFn    from 'render/tplfn.js';
import Layout   from './engine.js'

import {
    getFriendData,
    setUserRecord,
    getUserInfo,
    findSelf,
    injectSelfToList,
    replaceSelfDataInList,
} from 'data.js';

let postType;
let userinfo;
let selfData;
let key             = 'rankScore';
let currentMaxScore = 0;
let cacheRankData   = [];

let sharedCanvas  = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');
function draw(data = []) {
    let template = tplFn({
        data,
        self     : data[0],
        selfIndex: 1,
    });

    Layout.init(template, style);
    Layout.layout(sharedContext);
}

function loadFriendDataAndRender(key, info, needRender = true) {
    getFriendData(key, (data) => {
        let find = findSelf(data, info);
        selfData = find.self;

        /**
         * 拉取排行榜的时候无法确定排行榜中是否有自己，或者即便有自己分数也是旧的
         * 如果拉取排行榜之前先调用setUserCloudStorage来上报分数再拉取排行榜
         * 那么第一次渲染排行榜会非常之慢。针对这种场景需要根据情况处理：
         * 1. 如果拉取排行榜之前有调用分数上报接口，将每次上报的分数缓存起来，然后插入或者替换排行榜中的自己
         * 2. 如果拉取排行榜之前没有调用分数上报接口，忽略1的逻辑
         */
        if ( !selfData && currentMaxScore !== undefined ) {
            injectSelfToList(data, info, currentMaxScore);
        } else if ( selfData && currentMaxScore !== undefined ) {
            // 替换自己的分数
            replaceSelfDataInList(data, info, currentMaxScore);
        }

        // 缓存数据，加速下次渲染
        cacheRankData = data;

        // mock
         for ( let i = 0; i < 20; i++ ) {
             data[i] = JSON.parse(JSON.stringify(data[0]));
             data[i].rank = i;
             data[i].rankScore = Math.floor(Math.random()*1000+1)
        }

        if ( needRender ) {
            draw(data, selfData, currentMaxScore);
        }

        let btnList = Layout.getElementsByClassName('giftBtn');
        for (let i = 0;i < btnList.length;i ++) {
            btnList[i].on('click',(e) => {
                let img = Layout.getElementsById('img' + i);
                img[0].src = img[0].src === "sub/Buffet_icon_GiftPlate_0.png" ? "sub/Buffet_icon_GiftPlate.png":  "sub/Buffet_icon_GiftPlate_0.png"
            });
        }
    });
}

function updateViewPort(data) {
    let sys = wx.getSystemInfoSync();
    let { box, winSize } = data;

    /**
    * 设置子域绘制的真实物理尺寸
    * 子域不理解主域用的引擎，又需要独立进行事件处理，需要将真实的物理尺寸传给渲染引擎
    */
    let offsetX = sys.screenWidth * (box.x / winSize.width);
    let offsetY = sys.screenHeight * (box.y / winSize.height);

    const renderW = sys.screenWidth * (box.width / winSize.width);
    const renderH = sys.screenHeight * (box.height / winSize.height);

    // console.log('oneMessageData', data)
    // console.log('viewPort', offsetX, offsetY, renderW, renderH);

    Layout.updateViewPort({
        width : renderW,
        height: renderH,
        x     : offsetX,
        y     : offsetY,
    });
}

function init() {
    currentMaxScore = 0;
    cacheRankData   = [];

    wx.onMessage(data => {
        console.log('onMessage', data);
        if ( data.event === 'updateViewPort' ) {
            updateViewPort(data);
            getUserInfo((info) => {
                userinfo = info;
                loadFriendDataAndRender(key, info)
            });
        }
    });
}

function showFriendRank() {
    if ( cacheRankData && cacheRankData.length ) {
        // 更新缓存数据
        if ( userinfo && currentMaxScore ) {
            replaceSelfDataInList(cacheRankData, userinfo, currentMaxScore);
        }

        draw(cacheRankData, selfData, currentMaxScore);
    }

    /**
     * 用户信息会在子域初始化的时候去拉取
     * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
     */
    if ( !userinfo ) {
        getUserInfo((info) => {
            userinfo = info;
            loadFriendDataAndRender(key, info);
        });
    } else {
        loadFriendDataAndRender(key, userinfo);
    }
}

init();


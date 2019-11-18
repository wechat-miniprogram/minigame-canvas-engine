import config from 'common/config.js';
import render from './render.js';
import {
    getFriendData,
    setUserRecord,
    getUserInfo,
    findSelf,
    injectSelfToList,
    replaceSelfDataInList,
} from 'common/data.js';

let postTypeMap = config.postTypeMap;
let postType;
let userinfo;
let selfData;
let key             = 'score';
let currentMaxScore = 0;
let cacheRankData   = [];

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

        console.log(data)

        // mock
         for ( let i = 0; i< 20; i++ ) {
             data[i] = JSON.parse(JSON.stringify(data[0]));
             data[i].rank = i;
             data[i].score = i;
         }

        if ( needRender ) {
            render.draw(data, selfData, currentMaxScore);
        }
    });
}

/**
 * 在初始化阶段先把用户信息和排行榜数据拉取一份
 * 在第一次点击排行榜按钮的时候就能实现秒开的效果
 */
function init() {
    currentMaxScore = 0;
    cacheRankData   = [];
    getUserInfo((info) => {
        userinfo = info;
        loadFriendDataAndRender(key, info, false)
    });
}

function showFriendRank() {
    if ( cacheRankData && cacheRankData.length ) {
        // 更新缓存数据
        if ( userinfo && currentMaxScore ) {
            replaceSelfDataInList(cacheRankData, userinfo, currentMaxScore);
        }

        render.draw(cacheRankData, selfData, currentMaxScore);
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

/**
 * 监听主域消息，派发相应指令
 */
wx.onMessage(userData => {
    postType = userData.postType;
    key      = userData.key || key;

    let value = userData.value;

    switch(postType) {
        case postTypeMap.init:
            init();
            break;
        case postTypeMap.friendRank:
            showFriendRank();
            break;
        case postTypeMap.report:
            currentMaxScore = userData.score;
            setUserRecord(key, userData, render.startTime);
            break;
        case postTypeMap.setTitle:
            render.setTitle(value);
            break;
        case postTypeMap.setUnit:
            render.setUnit(value);
            break;
        case postTypeMap.setSort:
            render.setSort(value);
            break;
        case postTypeMap.setPeriod:
            render.setPeriod(value);
            break;
        case postTypeMap.close:
            render.disable();
            break;
        case postTypeMap.updateViewPort:
            render.updateViewPort(userData.box);
            break;
    }
});

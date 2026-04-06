import { style } from 'render/style.js';
import { tplFn } from 'render/tplfn.js';
const Layout = requirePlugin('Layout').default;
import { showLoading } from './loading';
import { showInvite } from './invite';

import {
  getFriendData,
  getUserInfo,
  findSelf,
  injectSelfToList,
  replaceSelfDataInList,
} from 'data.js';

let userinfo;
let selfData;
let key = 'rankScore';
let currentMaxScore = 0;
let cacheRankData = [];

let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext('2d');

// ─── 核心绘制流程 ──────────────────────────────────────────────────────────────

function draw(data = []) {
  const template = tplFn({ data, self: data[0], selfIndex: 1 });
  Layout.clear();
  Layout.init(template, style);
  Layout.layout(sharedContext);
}

function loadFriendDataAndRender(key, info, needRender = true) {
  getFriendData(key, (data) => {
    let find = findSelf(data, info);
    selfData = find.self;

    if (!selfData && currentMaxScore !== undefined) {
      injectSelfToList(data, info, currentMaxScore);
    } else if (selfData && currentMaxScore !== undefined) {
      replaceSelfDataInList(data, info, currentMaxScore);
    }

    cacheRankData = data;

    // mock 50 条数据
    for (let i = 0; i < 50; i++) {
      data[i] = JSON.parse(JSON.stringify(data[0]));
      data[i].rank = i;
      data[i].rankScore = Math.floor(Math.random() * 1000 + 1);
      if (i % 2 === 1) {
        data[i].nickname = '这是一个很长的玩家昵称，他会自动换行';
      }
    }

    if (needRender) {
      draw(data);
    }
  });
}

// ─── 初始化 ───────────────────────────────────────────────────────────────────

function init() {
  currentMaxScore = 0;
  cacheRankData = [];

  wx.onMessage(data => {
    console.log('onMessage', data);
    if (data.event === 'updateViewPort') {
      Layout.updateViewPort(data.box);
      showLoading();
      getUserInfo((info) => {
        userinfo = info;
        loadFriendDataAndRender(key, info);
      });
    } else if (data.event === 'showInvite') {
      Layout.updateViewPort(data.box);
      showInvite();
    } else if (data.event === 'close') {
      Layout.clear();
    }
  });
}

function showFriendRank() {
  if (cacheRankData && cacheRankData.length) {
    if (userinfo && currentMaxScore) {
      replaceSelfDataInList(cacheRankData, userinfo, currentMaxScore);
    }
    draw(cacheRankData);
  }

  if (!userinfo) {
    getUserInfo((info) => {
      userinfo = info;
      loadFriendDataAndRender(key, info);
    });
  } else {
    loadFriendDataAndRender(key, userinfo);
  }
}

init();

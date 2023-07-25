import style from "render/style.js";
import tplFn from "render/tplfn.js";
import { showLoading } from './loading.js';

import Layout from "./engine.js";
// const Layout = requirePlugin('Layout').default;

import {
  getFriendData,
  getUserInfo,
  findSelf,
} from "./data.js";

let key = "rankScore";
// 个人信息
let userInfo = null;

let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext("2d");

function draw(data = []) {
  const selfInfo = findSelf(data, userInfo);
  let template = tplFn({
    data,
    self: selfInfo.self,
    selfIndex: selfInfo.index,
  });
  Layout.clear();
  Layout.init(template, style);
  Layout.layout(sharedContext);

  // 打印一些调试信息
  Layout.ticker.next(() => {
    console.log(Layout.debugInfo)
  });
}

function loadFriendDataAndRender(key) {
  getFriendData(key, (data) => {
    // mock
    for (let i = data.length; i < 50; i++) {
      data[i] = JSON.parse(JSON.stringify(data[0]));
      data[i].rank = i;
      data[i].rankScore = Math.floor(Math.random() * 1000 + 1);
    }

    draw(data);
  });
}

function init() {
  wx.onMessage((data) => {
    console.log("onMessage", data);
    if (data.event === "updateViewPort") {
      Layout.updateViewPort(data.box);
    } else if (data.event === 'showFriendRank') {
      showLoading();
      getUserInfo((info) => {
        // 缓存个人信息
        userInfo = info;
        loadFriendDataAndRender(key);
      });
    } else if (data.event === 'close') {
      Layout.clear();
    }
  });
}

init();

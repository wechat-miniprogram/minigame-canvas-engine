import style from "render/style.js";
import tplFn from "render/tplfn.js";
const TWEEN = require('./tween.js');

// import Layout from "./engine.js";
const Layout = requirePlugin('Layout').default;
console.log(TWEEN)

import {
  getFriendData,
  setUserRecord,
  getUserInfo,
  findSelf,
  injectSelfToList,
  replaceSelfDataInList,
} from "data.js";

let postType;
let userinfo;
let selfData;
let key = "rankScore";
let currentMaxScore = 0;
let cacheRankData = [];

let sharedCanvas = wx.getSharedCanvas();
let sharedContext = sharedCanvas.getContext("2d");

function draw(data = []) {
  let template = tplFn({
    data,
    self: data[0],
    selfIndex: 1,
  });
  Layout.clear();
  Layout.init(template, style);
  Layout.layout(sharedContext);

  // listItem.forEach(item => {
  //   list.appendChild(Layout.cloneNode(item))
  // });

  // 获取 ScrollView
  // const list = Layout.getElementsByClassName('list')[0];

  // // 对列表第一项进行深度拷贝
  // const listItem = Layout.getElementsByClassName('listItem');
  // const listItem1 = listItem[0];
  // const newListItem1 = Layout.cloneNode(listItem1);

  // // 针对拷贝后的子节点做一些魔改
  // const listItemNum = newListItem1.getElementsByClassName('listItemNum')[0];
  // listItemNum.value = 2;
  // const listItemName = newListItem1.getElementsByClassName('listItemName')[0];
  // listItemName.value = 'zim test';
  // const listItemScore = newListItem1.getElementsByClassName('listItemScore')[0];
  // listItemScore.value = '100';

  // // 将拷贝后的节点也添加到滚动列表
  // list.appendChild(newListItem1);

  // const newListItem = Layout.cloneNode(listItem);


  Layout.ticker.next(() => {
    console.log(Layout.debugInfo)
  });

  /**
   * tween不直接作用于节点，否则一个列表大量的节点都执行tween操作性能必然会差
   * 因此维护一个与节点无关的 globalTween，每帧检查是 globalTween 应该作用于哪些节点
   * 每次 Layout.clear 记得清理或者重置 globalTween
   */
  let globalStyle = { width: 90, height: 90 }
  new TWEEN.Tween(globalStyle).to({
    width: 70,
    height: 70
  }).repeat(Infinity).yoyo(true).easing(TWEEN.Easing.Bounce.Out).start();

  const scrollList = Layout.getElementsByClassName('list')[0];
  const listItems = Layout.getElementsByClassName('listHeadImg');
  const scrollRect = scrollList.getBoundingClientRect();

  listItems.forEach((item) => {
    const height = item.style.height;
    const width = item.style.height;
    item.on('touchstart', () => {
      item.style.width = width * 0.9;
      item.style.height = height * 0.9;
    });

    item.on('touchend', () => {
      item.style.height = height;
      item.style.width = width;
    });

    item.on('touchcancel', () => {
      item.style.height = height;
      item.style.width = width;
    });
  });

  // 将缓动系统的 update 逻辑加入 Layout 的帧循环
  Layout.ticker.add(() => {
    TWEEN.update();
  });
  function manualTween() {
    listItems.forEach((item) => {
      if (scrollRect.intersects(item.getBoundingClientRect())) {
        item.style.height = globalStyle.height;
      }
    });
  }

  // window.manualTween = manualTween;
  // Layout.ticker.add(manualTween);

  // listItems.forEach(item => {
  //   let globalStyle = { width: 90, height: 90 }
  //   new Layout.TWEEN.Tween(item.style).to({
  //     width: 70,
  //     height: 70
  //   }).repeat(Infinity).yoyo(true).easing(Layout.TWEEN.Easing.Bounce.Out).start();
  // })
  
  // 记得在必要的时候执行 Layout.ticker.remove(manualTween)，比如每次 Layout.init 之前
  // Layout.ticker.add(manualTween);

  // setInterval(() => {
  //   console.log(Layout.debugInfo)
  // }, 3000)

  // setTimeout(() => {
  //   Layout.clear();
  //   Layout.init(template, style);
  //   Layout.layout(sharedContext);
  //   // console.log(Layout);
  // }, 3000)

  // const listItems = Layout.getElementsByClassName('listHeadImg');
  // setTimeout(() => {
  //   listItems[0].src = listItems[1].src;
  // }, 3000)

  // Setup the animation loop.
  // function animate(time) {
  //   requestAnimationFrame(animate)
  //   TWEEN.update()
  // }
  // requestAnimationFrame(animate)

  // listItem.on('click', () => {
  //   console.log('click')
  //   let target = listItem.style.height === 150 ? 300 : 150;
  //   listItem.style.top = 0
  //   new Layout.TWEEN.Tween(listItem.style)
  //   .to({ top: -150 }, 1000)
  //   .easing(Layout.TWEEN.Easing.Bounce.Out)
  //   .onUpdate(() => {
  //   }).onComplete(() => {
  //     // console.log(Layout)
  //   }).start();
  // });
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
    if (!selfData && currentMaxScore !== undefined) {
      injectSelfToList(data, info, currentMaxScore);
    } else if (selfData && currentMaxScore !== undefined) {
      // 替换自己的分数
      replaceSelfDataInList(data, info, currentMaxScore);
    }

    // 缓存数据，加速下次渲染
    cacheRankData = data;

    // data.length = 3;
    // mock
    for (let i = data.length; i < 50; i++) {
      data[i] = JSON.parse(JSON.stringify(data[0]));
      data[i].rank = i;
      // data[i].nickname = ''
      data[i].rankScore = Math.floor(Math.random() * 1000 + 1);
    }

    if (needRender) {
      draw(data, selfData, currentMaxScore);
    }
  });
}

function init() {
  currentMaxScore = 0;
  cacheRankData = [];

  wx.onMessage((data) => {
    console.log("onMessage", data);
    if (data.event === "updateViewPort") {
      Layout.updateViewPort(data.box);
    } else if (data.event === 'showFriendRank') {
      getUserInfo((info) => {
        userinfo = info;
        loadFriendDataAndRender(key, info);
      });
    } else if (data.event === 'close') {
      Layout.clear();
      console.log(Layout)
    }
  });
}

function showFriendRank() {
  if (cacheRankData && cacheRankData.length) {
    // 更新缓存数据
    if (userinfo && currentMaxScore) {
      replaceSelfDataInList(cacheRankData, userinfo, currentMaxScore);
    }

    draw(cacheRankData, selfData, currentMaxScore);
  }

  /**
   * 用户信息会在子域初始化的时候去拉取
   * 但是存在用户信息还没有拉取完成就要求渲染排行榜的情况，这时候再次发起用信息请求再拉取排行榜
   */
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

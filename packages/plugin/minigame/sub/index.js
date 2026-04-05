import { style } from 'render/style.js';
import { tplFn } from 'render/tplfn.js';
const Layout = requirePlugin('Layout').default;
import { showLoading } from './loading';

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

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

/**
 * 给 scrollview 所有 listItem 绑定点击：
 * 点击后 display:none，期间仍操作子节点（验证隐藏期间节点树操作），5 秒后自动恢复。
 */
function bindListItemClickForNoneTest(scrollView) {
  if (!scrollView) return;

  scrollView.children.forEach((item, index) => {
    if (!item.className || !item.className.includes('listItem')) return;

    item.on('click', () => {
      if (item.style.display === 'none') return;

      console.log(`[DisplayNone] 点击第 ${index + 1} 条 → display:none`);
      item.style.display = 'none';

      // 边界1：隐藏期间修改子节点 style，验证恢复后是否正确渲染
      const nameText = item.children.find(c => c.className && c.className.includes('listItemName'));
      if (nameText) {
        nameText.style.color = '#ff4444';
        console.log(`[DisplayNone] 隐藏期间修改子节点颜色 → #ff4444`);
      }

      // 边界2：隐藏期间修改子节点 value
      const scoreText = item.children.find(c => c.className && c.className.includes('listItemScore'));
      if (scoreText) {
        scoreText.value = '???';
        console.log(`[DisplayNone] 隐藏期间修改分数 → ???`);
      }

      // 5 秒后恢复，验证改动是否正确呈现
      // 注意：若期间执行了 Layout.clear()，item.isDestroyed 为 true，节点已销毁，直接跳过
      setTimeout(() => {
        if (item.isDestroyed) {
          console.log(`[DisplayNone] 第 ${index + 1} 条：节点已销毁（Layout.clear 触发），跳过恢复`);
          return;
        }
        item.style.display = 'flex';
        console.log(`[DisplayNone] 第 ${index + 1} 条恢复，color=${nameText && nameText.style.color}，score=${scoreText && scoreText.value}`);
      }, 5000);
    });
  });
}

/**
 * 随机克隆一条榜单条目并插入到 scrollview 的随机位置。
 * 克隆节点初始为 display:none，200ms 后切为 display:flex（边界：克隆后立即隐藏再恢复）。
 */
function cloneAndInsertRandom(scrollView) {
  if (!scrollView || !scrollView.children.length) {
    console.warn('[Clone] scrollView 无子节点');
    return;
  }

  const items = scrollView.children.filter(
    c => c.className && c.className.includes('listItem') && c.style.display !== 'none'
  );
  if (!items.length) {
    console.warn('[Clone] 所有条目均为 display:none，无可克隆节点');
    return;
  }

  const srcIndex = Math.floor(Math.random() * items.length);
  const cloned = Layout.cloneNode(items[srcIndex], true);

  // 给克隆节点加显眼背景色，方便肉眼区分
  cloned.style.backgroundColor = '#ffe066';

  // 边界3：克隆后先以 display:none 插入，200ms 后再显示
  cloned.style.display = 'none';

  // 随机目标位置，用 appendChild + splice 实现（Layout 暂无 insertBefore）
  const insertPos = Math.floor(Math.random() * (scrollView.children.length + 1));
  scrollView.appendChild(cloned);
  const lastIdx = scrollView.children.length - 1;
  if (insertPos < lastIdx) {
    scrollView.children.splice(lastIdx, 1);
    scrollView.children.splice(insertPos, 0, cloned);
    scrollView.setDirty();
  }
  console.log(`[Clone] 克隆第 ${srcIndex + 1} 条，插入位置 ${insertPos}，初始 display:none`);

  setTimeout(() => {
    if (cloned.isDestroyed) return;
    cloned.style.display = 'flex';
    console.log(`[Clone] 克隆节点 display:flex`);
    // 克隆节点同样支持点击隐藏测试
    cloned.on('click', () => {
      if (cloned.style.display === 'none') return;
      cloned.style.display = 'none';
      setTimeout(() => { cloned.style.display = 'flex'; }, 5000);
    });
  }, 200);
}

/**
 * 批量隐藏所有 listItem，验证 scrollHeight 变为 0，然后逐条恢复（每 300ms 一条）。
 */
function batchHideAndRestore(scrollView) {
  if (!scrollView) return;
  const items = scrollView.children.filter(
    c => c.className && c.className.includes('listItem')
  );
  items.forEach(item => { item.style.display = 'none'; });

  // 边界4：全部隐藏时 scrollHeight 应接近 0
  console.log(`[Batch] 全部隐藏(${items.length}条)，scrollHeight=${scrollView.scrollHeight}（期望≈0）`);

  items.forEach((item, i) => {
    setTimeout(() => {
      item.style.display = 'flex';
      console.log(`[Batch] 恢复第 ${i + 1} 条，scrollHeight=${scrollView.scrollHeight}`);
    }, (i + 1) * 300);
  });
}

/**
 * 给 scrollview 所有 listItem 绑定点击：
 * 点击后随机选择 display:none 或 visibility:hidden 来隐藏，5 秒后自动恢复。
 * 这样可以直观对比两种隐藏方式的差异：
 *   - display:none 后周围元素会填充空隙（不占空间）
 *   - visibility:hidden 后位置留空白但不塌陷（仍占空间）
 */
function bindListItemClickForRandomHideTest(scrollView) {
  if (!scrollView) return;

  scrollView.children.forEach((item, index) => {
    if (!item.className || !item.className.includes('listItem')) return;

    item.on('click', () => {
      if (item.style.display === 'none' || item.style.visibility === 'hidden') return;

      const useVisibility = Math.random() > 0.5;

      if (useVisibility) {
        console.log(`[RandomHide] 点击第 ${index + 1} 条 → visibility:hidden（占位保留）`);
        item.style.visibility = 'hidden';
      } else {
        console.log(`[RandomHide] 点击第 ${index + 1} 条 → display:none（不占空间）`);
        item.style.display = 'none';
      }

      // 隐藏期间修改子节点，验证恢复后是否正确渲染
      const nameText = item.children.find(c => c.className && c.className.includes('listItemName'));
      if (nameText) {
        nameText.style.color = useVisibility ? '#9b59b6' : '#ff4444';
        console.log(`[RandomHide] 隐藏期间修改颜色 → ${nameText.style.color}`);
      }

      setTimeout(() => {
        if (item.isDestroyed) {
          console.log(`[RandomHide] 第 ${index + 1} 条：节点已销毁，跳过恢复`);
          return;
        }
        if (useVisibility) {
          item.style.visibility = 'visible';
        } else {
          item.style.display = 'flex';
        }
        console.log(`[RandomHide] 第 ${index + 1} 条已恢复`);
      }, 2000);
    });
  });
}

/**
 * 批量将所有 listItem 设为 visibility:hidden，验证：
 *   1. scrollHeight 不变（因为仍然占空间）
 *   2. 节点不可见、不响应事件
 * 然后逐条恢复（每 300ms 一条）
 */
function batchVisibilityHideAndRestore(scrollView) {
  if (!scrollView) return;
  const items = scrollView.children.filter(
    c => c.className && c.className.includes('listItem')
  );

  const heightBefore = scrollView.scrollHeight;
  items.forEach(item => { item.style.visibility = 'hidden'; });
  const heightAfter = scrollView.scrollHeight;

  console.log(`[BatchVisibility] 全部 hidden(${items.length}条)，scrollHeight: ${heightBefore} → ${heightAfter}（期望不变）`);

  items.forEach((item, i) => {
    setTimeout(() => {
      if (item.isDestroyed) return;
      item.style.visibility = 'visible';
      console.log(`[BatchVisibility] 恢复第 ${i + 1} 条`);
    }, (i + 1) * 300);
  });
}

/**
 * 混合测试：奇数条 display:none，偶数条 visibility:hidden，3 秒后全部恢复。
 * 可以直观对比两种方式对布局的影响差异。
 */
function mixedHideTest(scrollView) {
  if (!scrollView) return;
  const items = scrollView.children.filter(
    c => c.className && c.className.includes('listItem')
  );

  items.forEach((item, i) => {
    if (i % 2 === 0) {
      item.style.visibility = 'hidden';
      console.log(`[MixedHide] 第 ${i + 1} 条 → visibility:hidden`);
    } else {
      item.style.display = 'none';
      console.log(`[MixedHide] 第 ${i + 1} 条 → display:none`);
    }
  });

  console.log(`[MixedHide] 混合隐藏后 scrollHeight=${scrollView.scrollHeight}（display:none 的不占空间，visibility:hidden 的仍占空间）`);

  setTimeout(() => {
    items.forEach((item, i) => {
      if (item.isDestroyed) return;
      if (i % 2 === 0) {
        item.style.visibility = 'visible';
      } else {
        item.style.display = 'flex';
      }
    });
    console.log(`[MixedHide] 全部恢复，scrollHeight=${scrollView.scrollHeight}`);
  }, 3000);
}

/**
 * 子节点覆盖父节点 hidden 测试（符合 CSS 规范）：
 * 将父容器（listItem）设为 visibility:hidden，然后将其中的「分数」子节点单独设为 visibility:visible。
 * 预期行为：
 *   - 父容器整体不可见（背景色、序号、头像、昵称都消失）
 *   - 但「分数」子节点单独可见（因为显式设了 visible 覆盖了继承的 hidden）
 *   - 布局不变，占位保留
 * 5 秒后恢复。
 */
function childOverrideParentHiddenTest(scrollView) {
  if (!scrollView) return;
  const items = scrollView.children.filter(
    c => c.className && c.className.includes('listItem')
  );

  items.forEach((item, i) => {
    // 父容器 hidden
    item.style.visibility = 'hidden';

    // 分数子节点显式 visible，覆盖父级 hidden
    const scoreText = item.children.find(c => c.className && c.className.includes('listItemScore'));
    if (scoreText) {
      scoreText.style.visibility = 'visible';
    }

    console.log(`[ChildOverride] 第 ${i + 1} 条：父 hidden，分数子节点 visible`);
  });

  console.log(`[ChildOverride] scrollHeight=${scrollView.scrollHeight}（期望不变，布局仍占位）`);

  setTimeout(() => {
    items.forEach((item, i) => {
      if (item.isDestroyed) return;
      item.style.visibility = 'visible';
      // 子节点恢复删除显式设置，跟随父节点
      const scoreText = item.children.find(c => c.className && c.className.includes('listItemScore'));
      if (scoreText) {
        delete scoreText.style.visibility;
      }
      console.log(`[ChildOverride] 第 ${i + 1} 条恢复`);
    });
  }, 5000);
}

// ─── 核心绘制流程 ──────────────────────────────────────────────────────────────

function draw(data = []) {
  const template = tplFn({ data, self: data[0], selfIndex: 1 });
  Layout.clear();
  Layout.init(template, style);
  Layout.layout(sharedContext);

  const scrollView = Layout.getElementsByClassName('list')[0];

  // 绑定榜单条目点击 → 随机 display:none 或 visibility:hidden 测试
  bindListItemClickForRandomHideTest(scrollView);

  // 绑定测试按钮（节点已在模板里，直接查询绑定）
  let cloneCount = 0;
  const cloneBtn     = Layout.getElementsById('cloneInsertBtn')[0];
  const batchBtn     = Layout.getElementsById('batchHideBtn')[0];
  const batchVisBtn  = Layout.getElementsById('batchVisibilityBtn')[0];
  const mixedBtn     = Layout.getElementsById('mixedHideBtn')[0];
  const childOverrideBtn = Layout.getElementsById('childOverrideBtn')[0];
  const statusText   = Layout.getElementsById('testStatusText')[0];

  cloneBtn && cloneBtn.on('click', () => {
    cloneCount++;
    cloneAndInsertRandom(scrollView);
    if (statusText) statusText.value = `已克隆插入 ${cloneCount} 条`;
  });

  batchBtn && batchBtn.on('click', () => {
    if (statusText) statusText.value = '批量 display:none 中...';
    batchHideAndRestore(scrollView);
    const total = scrollView ? scrollView.children.filter(
      c => c.className && c.className.includes('listItem')
    ).length : 0;
    setTimeout(() => {
      if (statusText) statusText.value = `恢复完毕（${total}条）`;
    }, total * 300 + 500);
  });

  batchVisBtn && batchVisBtn.on('click', () => {
    if (statusText) statusText.value = '批量 visibility:hidden 中...';
    batchVisibilityHideAndRestore(scrollView);
    const total = scrollView ? scrollView.children.filter(
      c => c.className && c.className.includes('listItem')
    ).length : 0;
    setTimeout(() => {
      if (statusText) statusText.value = `visibility 恢复完毕（${total}条）`;
    }, total * 300 + 500);
  });

  mixedBtn && mixedBtn.on('click', () => {
    if (statusText) statusText.value = '混合隐藏测试中...';
    mixedHideTest(scrollView);
    setTimeout(() => {
      if (statusText) statusText.value = '混合隐藏已恢复';
    }, 3500);
  });

  childOverrideBtn && childOverrideBtn.on('click', () => {
    if (statusText) statusText.value = '子覆盖父hidden中(只显示分数)';
    childOverrideParentHiddenTest(scrollView);
    setTimeout(() => {
      if (statusText) statusText.value = '子覆盖父hidden已恢复';
    }, 5500);
  });

  // 原有礼物按钮逻辑（保留）
  const btnList = Layout.getElementsByClassName('giftBtn');
  for (let i = 0; i < btnList.length; i++) {
    btnList[i].on('click', () => {
      const img = Layout.getElementsById('img' + i);
      img[0].src = img[0].src === 'sub/Buffet_icon_GiftPlate_0.png'
        ? 'sub/Buffet_icon_GiftPlate.png'
        : 'sub/Buffet_icon_GiftPlate_0.png';
    });
  }
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

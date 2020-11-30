/**
 * 伪类处理器
 */
const activeNodeMap = {};
const innerStyleMap = {};

function getAlpha(rgba) {
  const rgb = rgba.match(/(\d(\.\d+)?)+/g);
  if (!rgb[3]) { // 如果省略alpha参数，默认为1
    rgb[3] === 1;
  } else if (rgba[3].indexOf('.') === 0) { // 如果省略0，要补一个
    rgb[3] = `0${rgb[3]}`;
  }
  return rgb[3] * 1;
}

function changeStateTrans(item, activeStyle) {
  // const id = item.id;
  // const allNode = activeNodeMap[id];
  // if (allNode) {
  //   for (let i = 0; i < allNode.length; i++) {
  //     const n = allNode[i];
  //     n.style.backgroundColor = color;
  //     n.repaint();
  //   }
  // }
  // console.log('changeState', Date.now());
  // console.log(color);
  console.log('changeStateTrans', item);

  // 先保存_innerStyle中的状态，方便clear的时候恢复
  innerStyleMap[item.id] = Object.assign({}, item._innerStyle);
  // console.log('test123', item.className);
  // console.log('test123', item.styleActive);
  // console.log('test123', item.styleDarkActive);
  if (activeStyle.backgroundColor) {
    item.computedStyle.backgroundColor = activeStyle.backgroundColor;
    // 改了backgroundColor后，需要更新下glRect的内容
    item.glRect.setBackgroundColor(activeStyle.backgroundColor);
  }
  if (activeStyle.color) {
    item.computedStyle.color = activeStyle.backgroundColor;
  }
  item.root.forceUpdate();
  if (
    activeStyle.backgroundColor
    && !(activeStyle.backgroundColor.indexOf('rgba') > -1
      && getAlpha(activeStyle.backgroundColor) !== 1)) {
    if (item.childNodes) {
      for (let i = 0; i < item.childNodes.length; i++) {
        item.childNodes[i].repaint();
        // item.root.reLayout();
        // changeStateTrans(item.childNodes[i], activeStyle);
      }
    }
  }
}

function clearActiveStateTrans(item, isDarkMode) {
  // console.log('clearActiveStateTrans call');
  // 直接从innerStyleMap中恢复就好了，不需要任何操作
  const innerStyle = innerStyleMap[item.id] || {};
  item._innerStyle = Object.assign({}, innerStyle);

  const computedStyle = isDarkMode
  ? Object.assign({}, item.styleInit, item.styleDarkInit, item.styleProp, item._innerStyle)
  : Object.assign({}, item.styleInit, item.styleProp, item._innerStyle);
  item.updateRenderData && item.updateRenderData(computedStyle);
  // let backgroundColor = item.styleInit.backgroundColor;
  // let color = item.styleInit.color;
  // if (item.root.isDarkMode()) {
  //   backgroundColor = item.styleDarkInit.backgroundColor || item.styleInit.backgroundColor;
  //   color = item.styleDarkInit.color || item.styleInit.color
  // }
  // item.computedStyle.backgroundColor = backgroundColor;
  // item.computedStyle.color = color;
  // item.repaint();
  // if (item.children) {
  //   for (let key in item.children) {
  //     clearActiveStateTrans(item.children[key]);
  //   }
  // }
}

function getNodeAll(node) {
  let ret = [node];
  if (node.children) {
    for (const key in node.children) {
      ret = ret.concat(getNodeAll(node.children[key]));
    }
  }
  return ret;
}

function getNodeFromRoot(node) {
  const res = [];
  let n = node;
  while (n !== null) {
    res.push(n);
    n = n.parent;
  }
  // console.log(res);
  return res.reverse();
}

/**
 * 伪类的处理不应该直接操作computedStyle，需要节点映射前后的样式
 */
class PseudoClassManager {
  constructor(layout) {
    this.activeNode = []; // 定义了active伪类的节点
    this.layout = layout;
    // this.activeNodeMap = {};
  }
  addActiveState(node) {
    // const allNodes = getNodeFromRoot(node); // touchstart的时候得到从root到点击元素的所有节点
    // let activeBackgroundColor = null;
    // let needActive = false;
    // for (let i = 0; i < allNodes.length; i++) {
    //   const node = allNodes[i];
    //   if (node.hasActiveStyle) {
    //     activeBackgroundColor = node.styleActive.backgroundColor;
    //     needActive = true;
    //   }
    //   if (needActive) {
    //     // node.style.backgroundColor = activeBackgroundColor;
    //     // node.repaint();
    //     changeStateTrans(node, activeBackgroundColor);
    //   }
    // }
    // console.log('addActiveState');
    if (node === null) {
      return;
    }
    // console.log(node.className, node.hasActiveStyle);
    if (this.layout.isDarkMode()) { // darkmode的时候
      if (node.hasActiveStyle || node.hasDarkActiveStyle) {
        let styleActive = node.styleActive || {};
        if (node.hasDarkActiveStyle) {
          styleActive = Object.assign({}, styleActive, node.styleDarkActive);
        }
        // console.log('======================isActive true');
        // console.log(node.className);
        node.isActive = true;
        changeStateTrans(node, styleActive);
      }
    } else { // 非darkmode的时候，直接拿active的样式出来处理
      if (node.hasActiveStyle) {
        // console.log('======================isActive true');
        // console.log(node.className);
        node.isActive = true;
        changeStateTrans(node, node.styleActive);
      }
    }
    this.addActiveState(node.parent);
  }
  clearActiveState(node) { // 清除active状态，还原成init的时候的style
    console.log('clearActiveState call');
    const isDarkMode = this.layout.isDarkMode();
    if (node) {
      clearActiveStateTrans(node, isDarkMode);
      // console.log('======================isActive false');
      node.isActive = false;
      return
    }
    const nodes = this.activeNode;
    let needForceUpdate = false;
    // console.log('nodes.length ' + nodes.length);
    for (let i = 0; i < nodes.length; i++) {
      // console.log(`nodes_${i}`, nodes[i].isActive);
      // console.log('clearActiveState');
      // changeStateTrans(nodes[i], nodes[i].styleInit.backgroundColor);
      if (nodes[i].isActive) {
        console.log('node is active', nodes[i].className);
        clearActiveStateTrans(nodes[i], isDarkMode);
        // console.log('======================isActive false');
        nodes[i].isActive = false;
        needForceUpdate = true;
      }
    }
    if (needForceUpdate) { // 有节点从active发生了改变，才执行重新渲染
      this.layout.forceUpdate();
    }
  }
  addActiveNode(node) {
    this.activeNode.push(node);
    activeNodeMap[node.id] = getNodeAll(node);
    // console.log(activeNodeMap[node.id]);
  }
}

export default PseudoClassManager;

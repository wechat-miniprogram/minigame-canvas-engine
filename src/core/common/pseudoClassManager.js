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
 
  console.log('changeStateTrans', item);

  // 先保存_innerStyle中的状态，方便clear的时候恢复
  innerStyleMap[item.id] = Object.assign({}, item._innerStyle);

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
    if (item.children) {
      for (let i = 0; i < item.children.length; i++) {
        item.children[i].repaint();
      }
    }
  }
}

function clearActiveStateTrans(item, isDarkMode) {
  const innerStyle = innerStyleMap[item.id] || {};
  item._innerStyle = Object.assign({}, innerStyle);

  const computedStyle = isDarkMode
  ? Object.assign({}, item.styleInit, item.styleDarkInit, item.styleProp, item._innerStyle)
  : Object.assign({}, item.styleInit, item.styleProp, item._innerStyle);
  item.updateRenderData && item.updateRenderData(computedStyle);
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

/**
 * 伪类的处理不应该直接操作computedStyle，需要节点映射前后的样式
 */
class PseudoClassManager {
  constructor(layout) {
    this.activeNode = []; // 定义了active伪类的节点
    this.layout = layout;
  }
  addActiveState(node) {
    if (node === null) {
      return;
    }
    if (this.layout.isDarkMode()) { // darkmode的时候
      if (node.hasActiveStyle || node.hasDarkActiveStyle) {
        let styleActive = node.styleActive || {};
        if (node.hasDarkActiveStyle) {
          styleActive = Object.assign({}, styleActive, node.styleDarkActive);
        }
        node.isActive = true;
        changeStateTrans(node, styleActive);
      }
    } else { // 非darkmode的时候，直接拿active的样式出来处理
      if (node.hasActiveStyle) {
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
      node.isActive = false;
      return
    }
    const nodes = this.activeNode;
    let needForceUpdate = false;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].isActive) {
        console.log('node is active', nodes[i].className);
        clearActiveStateTrans(nodes[i], isDarkMode);
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
  }
}

export default PseudoClassManager;

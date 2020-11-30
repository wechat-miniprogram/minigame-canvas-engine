// import yoga, { Node } from 'yoga-layout';
import yoga, { Node } from '../../../3rd/entry-browser.js';

const defaultNode = Node.create();

export function adaptor(tree) {
  const s = Date.now();
  const yogaTree = getYogaTree(tree); // 获得一棵yoga虚拟树
  // yogaTree.calculateLayout(undefined, undefined);
  console.log(`calculateLayout ${Date.now() - s}`);
  updateLayout(tree);
}

// export function compare(tree1, tree2) {
//   console.log('xxxx ' + tree1.className, tree1.layout);
//   console.log('yoga ' + tree2.className, tree2.layout);

//   for (let i = 0; i < tree1.children.length; i++) {
//     compare(tree1.children[i], tree2.children[i]);
//   }
// }

function getYogaTree(node) {
  // const yogaNode = Node.create();
  let yogaNode = null;

  if (node.yogaNode) {
    yogaNode = node.yogaNode;
    yogaNode.copyStyle(defaultNode);
  } else {
    yogaNode = Node.create();
    node.yogaNode = yogaNode;
  }

  // const style = node.style;
  // const style = node.computedStyle;
  let isDarkMode = false;
  if (node.root) {
    isDarkMode = node.root.isDarkMode();
  } else {
    isDarkMode = node.isDarkMode();
  }
  let style = {};
  if (isDarkMode) {
    style = Object.assign({}, node.styleInit, node.styleDarkInit, node.styleProp, node._innerStyle);
  } else {
    style = Object.assign({}, node.styleInit, node.styleProp, node._innerStyle);
  }

  // 处理宽度
  if (style.width === 'auto') {
    yogaNode.setWidthAuto();
  } else if (typeof style.width === 'string' && style.width.endsWith('%')) {
    yogaNode.setWidthPercent(parseFloat(style.width));
  } else if (typeof style.width !== 'undefined') {
    yogaNode.setWidth(style.width);
  } else {
    yogaNode.setWidthAuto();
  }

  // 处理最大宽度
  if (typeof style.maxWidth === 'string' && style.maxWidth.endsWith('%')) {
    yogaNode.setMaxWidthPercent(parseFloat(style.maxWidth));
  } else if (typeof style.maxWidth !== 'undefined') {
    yogaNode.setMaxWidth(style.maxWidth);
  }

  // 处理最小宽度
  if (typeof style.minWidth === 'string' && style.minWidth.endsWith('%')) {
    yogaNode.setMinWidthPercent(parseFloat(style.minWidth));
  } else if (typeof style.minWidth !== 'undefined') {
    yogaNode.setMinWidth(style.minWidth);
  }

  // 处理高度
  if (style.height === 'auto') {
    yogaNode.setHeightAuto();
  } else if (typeof style.height === 'string' && style.height.endsWith('%')) {
    yogaNode.setHeightPercent(parseFloat(style.height));
  } else if (typeof style.height !== 'undefined') {
    yogaNode.setHeight(style.height);
  } else {
    yogaNode.setHeightAuto();
  }

  // 处理最大高度
  if (typeof style.maxHeight === 'string' && style.maxHeight.endsWith('%')) {
    yogaNode.setMaxHeightPercent(parseFloat(style.maxHeight));
  } else if (typeof style.maxHeight !== 'undefined') {
    yogaNode.setMaxHeight(style.maxHeight);
  }

  // 处理最小高度
  if (typeof style.minHeight === 'string' && style.minHeight.endsWith('%')) {
    yogaNode.setMinHeightPercent(parseFloat(style.minHeight));
  } else if (typeof style.minHeight !== 'undefined') {
    yogaNode.setMinHeight(style.minHeight);
  }

  // 处理padding/margin/border
  for (const styleName of [
    'padding',
    'margin',
    'borderWidth'
  ]) {
    const fnName = `set${styleName.charAt(0).toUpperCase()}${styleName.slice(1)}`.replace('Width', '');
    if (typeof style[styleName] === 'number') {
      yogaNode[fnName](yoga.EDGE_TOP, style[styleName]);
      yogaNode[fnName](yoga.EDGE_BOTTOM, style[styleName]);
      yogaNode[fnName](yoga.EDGE_LEFT, style[styleName]);
      yogaNode[fnName](yoga.EDGE_RIGHT, style[styleName]);
    } else if (typeof style[styleName] === 'string') {
      const s = style[styleName].split(' '); // 根据空格分割出padding的不同参数
      if (s.length === 1) {
        yogaNode[fnName](yoga.EDGE_TOP, style[styleName]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, style[styleName]);
        yogaNode[fnName](yoga.EDGE_LEFT, style[styleName]);
        yogaNode[fnName](yoga.EDGE_RIGHT, style[styleName]);
      } else if (s.length === 2) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[0]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[1]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
      } else if (s.length === 3) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[1]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[2]);
      } else if (s.length === 4) {
        yogaNode[fnName](yoga.EDGE_TOP, s[0]);
        yogaNode[fnName](yoga.EDGE_RIGHT, s[1]);
        yogaNode[fnName](yoga.EDGE_BOTTOM, s[2]);
        yogaNode[fnName](yoga.EDGE_LEFT, s[3]);
      }
    }

    for (const direction of [
      'Top',
      'Bottom',
      'Left',
      'Right'
    ]) {
      const name = `${styleName}${direction}`;
      if (typeof style[name] !== 'undefined') {
        yogaNode[fnName](yoga[`EDGE_${direction.toUpperCase()}`], style[name]);
      }
    }
  }

  for (const styleName of [
    'overflow',
    'display',
  ]) {
    const s = style[styleName];
    const fnName = `set${styleName.charAt(0).toUpperCase()}${styleName.slice(1)}`;
    if (typeof s !== 'undefined') {
      yogaNode[fnName](yoga[`${styleName.toUpperCase()}_${s.toUpperCase()}`]);
    }
  }

  for (const styleName of [
    'flexBasis'
  ]) {
    const s = style[styleName];
    const fnName = `set${styleName.charAt(0).toUpperCase()}${styleName.slice(1)}`;
    if (typeof s === 'number') {
      yogaNode[fnName](s);
    } else if (s === 'auto') {
      yogaNode[fnName](yoga.UNIT_AUTO);
    }
  }

  for (const styleName of [
    'flexGrow',
    'flexShrink'
  ]) {
    const s = style[styleName];
    const fnName = `set${styleName.charAt(0).toUpperCase()}${styleName.slice(1)}`;
    if (typeof s === 'number') {
      yogaNode[fnName](s);
    }
  }

  for (const styleName of [
    'alignContent',
    'alignItems',
    'alignSelf',
  ]) {
    const s = style[styleName];
    const fnName = `set${styleName.charAt(0).toUpperCase()}${styleName.slice(1)}`;
    if (typeof s !== 'undefined') {
      yogaNode[fnName](yoga[`ALIGN_${s.toUpperCase().replace('-', '_')}`]);
    }
  }

  for (const styleName of [
    'top',
    'bottom',
    'right',
    'left'
  ]) {
    const s = style[styleName];
    if (typeof s !== 'undefined') {
      yogaNode.setPosition(yoga[`EDGE_${styleName.toUpperCase()}`], s);
    }
  }

  if (typeof style.position !== 'undefined') {
    yogaNode.setPositionType(yoga[`POSITION_TYPE_${style.position.toUpperCase()}`]);
  }

  if (typeof style.flex === 'number') {
    yogaNode.setFlex(style.flex);
  } else if (typeof style.flex !== 'undefined') {
    const f = style.flex.split(' ');
    if (f.length === 1) {
      if (f[0] === 'auto') {
        yogaNode.setFlexGrow(1);
        yogaNode.setFlexShrink(1);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      } else if (f[0] === 'none') {
        yogaNode.setFlexGrow(0);
        yogaNode.setFlexShrink(0);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      } else if (f[0] === 'initial') {
        yogaNode.setFlexGrow(0);
        yogaNode.setFlexShrink(1);
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      }
    } else {
      yogaNode.setFlexGrow(f[0] * 1);
      yogaNode.setFlexShrink(f[1] * 1);
      if (f[2] === 'auto') {
        yogaNode.setFlexBasis(yoga.UNIT_AUTO);
      }
    }
  }

  if (typeof style.flexDirection !== 'undefined') {
    yogaNode.setFlexDirection(yoga[`FLEX_DIRECTION_${style.flexDirection.toUpperCase().replace('-', '_')}`]);
  }
  if (typeof style.flexWrap !== 'undefined') {
    yogaNode.setFlexWrap(yoga[`WRAP_${style.flexWrap.toUpperCase().replace('-', '_')}`]);
  }
  if (typeof style.justifyContent !== 'undefined') {
    yogaNode.setJustifyContent(yoga[`JUSTIFY_${style.justifyContent.toUpperCase().replace('-', '_')}`]);
  }

  // yogaNode.setAspectRatio(aspectRatio: number): void,
  // yogaNode.setMeasureFunc(measureFunc: ?Function): void,
  // console.log('yogaNode', yogaNode);

  // for (let i = 0; i < node.children.length; i++) {
  //   yogaNode.insertChild(getYogaTree(node.children[i]), i);
  // }
  const childCount = yogaNode.getChildCount();
  for (let i = 0; i < node.childNodes.length; i++) {
    const childYogaNode = getYogaTree(node.childNodes[i]);
    if (childCount * 1 === 0) {
      yogaNode.insertChild(childYogaNode, i);
    }
  }

  yogaNode.calculateLayout();

  // if (node.className === 'item_content_title') {
  //   console.log('item_content_title', yogaNode.getComputedLayout());
  // }

  // const layout = yogaNode.getComputedLayout();
  // console.log(layout);
  // node.layout = {
  //   width: layout.width,
  //   height: layout.height,
  //   top: layout.top,
  //   left: layout.left,
  //   right: layout.right,
  //   bottom: layout.bottom,
  // };
  // node.yogaNode = yogaNode;
  // node.layout = layout;
  return yogaNode;
}

export function updateLayout(node) {
  // const yogaNode = node.yogaNode;
  if (node.type === 'Text' && isNaN(node.yogaNode.getComputedWidth())) { // todo 临时fix文本节点
    node.yogaNode.calculateLayout();
  }
  const layout = node.yogaNode.getComputedLayout();
  // node.layout = {
  //   width: layout.width,
  //   height: layout.height,
  //   top: layout.top,
  //   left: layout.left,
  //   right: layout.right,
  //   bottom: layout.bottom,
  // };
  // for (let i = 0; i < node.children.length; i++) {
  //   updateLayout(node.children[i]);
  // }
  node.layoutBox = {
    width: layout.width,
    height: layout.height,
    top: layout.top,
    left: layout.left,
    right: layout.right,
    bottom: layout.bottom,
  }
  // console.log(node.layoutBox);
  // console.log(node.className, node.style, node.className);
  // if (node.id > 0)
  //   node.layout = node.layoutBox;
  for (let i = 0; i < node.childNodes.length; i++) {
    updateLayout(node.childNodes[i]);
  }
}

export function calculateDirtyNode(node) {
  for (let i = 0; i < node.childNodes.length; i++) {
    calculateDirtyNode(node.childNodes[i]);
  }
  if (node.yogaNode.isDirty()) {
    node.yogaNode.calculateLayout();
  }
}

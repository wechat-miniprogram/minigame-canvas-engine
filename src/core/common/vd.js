// components
import {
  View, Text, Image, ScrollView
} from '../components/index.js'

import { getElementStyle } from './util';
import { dash2camel } from './util.js';

const constructorMap = {
  view: View,
  text: Text,
  image: Image,
  scrollview: ScrollView,
  // video: Video
}

/**
 * 节点初始化
 * @param {*} node 节点
 * @param {*} style 节点lightmode样式
 * @param {*} styleDark 节点darkmode样式
 * @param {*} isDarkMode 是否darkmode
 * @param {*} fontSize 字体大小
 */
export function create (node, style, styleDark = {}, isDarkMode, fontSize) {
  const _constructor = constructorMap[node.name];

  const children = node.children || [];

  const attr = node.attr || {};
  const id = attr.id || '';

  const args = Object.keys(attr).reduce((obj, key) => {
    const value = attr[key];
    const attribute = key;

    if (key === 'id') { // 有id的话，记录下这个id对应的style和:active伪类的style
      obj.styleInit = Object.assign(obj.styleInit || {}, style[id] || {});
      if (style[`${id}:active`]) { // 支持下active伪类
        obj.styleActive = Object.assign(obj.styleActive || {}, style[`${id}:active`] || {});
      }
      if (styleDark[id]) { // 支持下darkmode
        obj.styleDarkInit = Object.assign(obj.styleDarkInit || {}, styleDark[id] || {});
      }
      if (styleDark[`${id}:active`]) { // 支持下darkmode的active伪类
        obj.styleDarkActive = Object.assign(obj.styleDarkActive || {}, styleDark[`${id}:active`] || {});
      }
      return obj;
    }

    if (key === 'class') { // 有class的话，记录下这个class对应的style和:active伪类的style
      value.split(/\s+/).forEach((oneClass) => {
        obj.styleInit = Object.assign((obj.styleInit || {}), style[oneClass]);
        if (style[`${oneClass}:active`]) {
          obj.styleActive = Object.assign((obj.styleActive || {}), style[`${oneClass}:active`]);
        }
        if (styleDark[oneClass]) {
          obj.styleDarkInit = Object.assign((obj.styleDarkInit || {}), styleDark[oneClass]);
        }
        if (styleDark[`${oneClass}:active`]) {
          obj.styleDarkActive = Object.assign((obj.styleDarkActive || {}), styleDark[`${oneClass}:active`]);
        }
      });
      return obj;
    }

    if (key === 'style') {
      return obj;
    }

    if (/^data-/.test(key)) {
      const datakey = dash2camel(key.substring(5))
      !obj.dataset ? obj.dataset = { [datakey]: value } : obj.dataset[datakey] = value
    }

    if (value === 'true') {
      obj[attribute] = true
    } else if (value === 'false') {
      obj[attribute] = false
    } else {
      obj[attribute] = value
    }

    return obj;
  }, {});

  // 用于后续元素查询
  args.idName = id;
  args.className = attr.class || '';

  const element = new _constructor(args);
  ['onclick', 'ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'].forEach((evtName) => {
    if (attr[evtName]) {
      const invokeMatches = args[evtName].match(/([a-zA-Z0-9]+)\((.+)\)/);
      const funcName = invokeMatches ? invokeMatches[1] : args[evtName];
      let funcParams = invokeMatches ? invokeMatches[2].split(',') : [];
      if (typeof this._methods[funcName] === 'function') {
        const func = this._methods[funcName];
        element.on(evtName.substring(2), (e) => {
          funcParams = funcParams.map(p => {
            if (p === '$event') {
              return e
            }
            return eval(p)
          })
          func.apply(this, !funcParams.length ? [e] : funcParams)
        })
      } else {
        console.warn(`${args[evtName]} is not a function`)
      }
    }
  })
  element.root = this;

  const s = getElementStyle.call(element, isDarkMode, false);

  if (element.type === 'Text') {
    if (typeof s.height === 'undefined') {
      element.computedStyle.height = s.lineHeight || s.fontSize;
      element.noWrapHeight = s.lineHeight || s.fontSize;
    } else {
      element.computedStyle.height = s.height;
      element.noWrapHeight = s.height;
    }
    if (typeof s.width === 'undefined') {
      element.computedStyle.width = this._getTextWidth(s, element.valueInit, fontSize);
    }
    const computedStyle = getElementStyle.call(element, isDarkMode);
    element.noWrapWidth = computedStyle.width;
  }

  children.forEach(childNode => {
    const childElement = create.call(this, childNode, style, styleDark, isDarkMode, fontSize);
    element.add(childElement);
  });

  // 创建新节点的时候，搜集下文本节点
  if (element.type === 'Text') {
    this.textManager.addTextNode(element);
  }

  // if (element.type === 'Video') {
  //   this._videos.push(element);
  //   if (attr.poster) {
  //     const poster = create.call(this, {
  //       name: 'image',
  //       attr: {
  //         src: attr.poster,
  //         styleInit: element.styleInit
  //       }
  //     }, {}, {}, isDarkMode, fontSize);
  //     element.add(poster);
  //     element._poster_ = poster;
  //   }
  //   const play = create.call(this, {
  //     name: 'view',
  //     attr: {
  //       styleInit: {
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: 'rgba(0,0,0,0)'
  //       }
  //     }
  //   })
  //   const icon = create.call(this, {
  //     name: 'image',
  //     attr: {
  //       src: 'common/assets/play.png',
  //       styleInit: {
  //         width: 38,
  //         height: 38,
  //       },
  //       styleActive: {
  //         width: 38,
  //         height: 38,
  //       }
  //     }
  //   })

  //   icon.on('touchstart', () => { });
  //   icon.on('click', () => { });
  //   icon.on('touchend', function (e) {
  //     element.play();
  //     e.stopPropagation();
  //   });
  //   play.add(icon);
  //   element.add(play);
  //   element._play_ = play;
  // }

  const keys = [];
  const keysDark = [];
  for (const key in args.styleActive) {
    keys.push(key);
  }
  for (const key in args.styleDarkActive) {
    keysDark.push(key);
  }
  if (keys.length > 0 || keysDark.length > 0) {
    if (keys.length > 0) {
      element.hasActiveStyle = true; // 节点是否有active的style
    }
    if (keysDark.length > 0) {
      element.hasDarkActiveStyle = true; // 节点是否有darkmode下active的style
    }
    element.isActive = false; // 节点是否active了
    this.pseudoClassManager.addActiveNode(element);
  }

  return element;
}


/**
 * 格式化渲染相关的数据
 * @param {Array} children 子节点
 * @param {Boolean} isDarkMode 是否暗黑模式
 * @param {Number} fontSize 字体大小
 * @param {Array} webGLRenderData
 */
export function layoutChildren(children, isDarkMode, fontSize, webGLRenderData) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    const style = getElementStyle.call(child, isDarkMode);
    const computedStyle = getElementStyle.call(child, isDarkMode);
   
    child.realLayoutBox = child.realLayoutBox || {};

    ['left', 'top', 'width', 'height'].forEach((prop) => {
      child.realLayoutBox[prop] = child.layoutBox[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
      // child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      // child.realLayoutBox.realY = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top;
      // child.realLayoutBox.realX = child.realLayoutBox.left;
      // child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;

    if (child.type === 'ScrollView') { // 滚动列表的画板尺寸和主画板保持一致
      child.updateRenderPort(this.renderport);
    } else if (child.type === 'Text') { // 文本节点处理下ellipsis
      const width = child.layoutBox.width > child.parent.layoutBox.width
        ? child.parent.layoutBox.width
        : child.layoutBox.width;

      const textWidth = this._getTextWidth(style, child.valueInit);
      if (
        style.textOverflow === 'ellipsis'
        && style.whiteSpace === 'nowrap'
        && width + 0.5 < textWidth // todo hardcode处理，由于yoga会取整，这里我再加0.5的宽度
      ) {
        child.valueShow = this._parseText(style, child.valueInit, width, fontSize);
      } else if (
        style.textOverflow === 'ellipsis'
        && style.whiteSpace === 'nowrap'
        && width + 0.5 >= textWidth
        && child.valueShow !== child.valueInit
      ) {
        child.valueShow = child.valueInit;
      }
    }

    if (child.glRect) {
      child.glRect = null;
    }
    if (computedStyle.display === 'none') {
      continue;
    }
    // 子节点的updateRenderData会收集渲染相关的数据
    child.updateRenderData && child.updateRenderData(computedStyle);
    layoutChildren.call(this, child.childNodes, isDarkMode, fontSize, webGLRenderData);
  }
}

export function updateRealLayout(children, scale) {
  children.forEach((child) => {
    child.realLayoutBox = child.realLayoutBox || {};

    ['left', 'top', 'width', 'height'].forEach(prop => {
      // child.realLayoutBox[prop] = data.layout[prop] * scale;
      child.realLayoutBox[prop] = child.layoutBox[prop] * scale;
    });

    if ( child.parent ) {
      // child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      Object.defineProperty(child.realLayoutBox, 'realX', {
        configurable: true,
        enumerable  : true,
        get: () => {
          let res = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;

          /**
           * 滚动列表事件处理
           */
          if ( child.parent && child.parent.type === 'ScrollView' ) {
            res -= (child.parent.scrollLeft * scale);
          }

          return res;
        },
      });

      Object.defineProperty(child.realLayoutBox, 'realY', {
        configurable: true,
        enumerable  : true,
        get: () => {
          let res = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;

          /**
           * 滚动列表事件处理
           */
          if ( child.parent && child.parent.type === 'ScrollView' ) {
            res -= (child.parent.scrollTop * scale);
          }

          return res;
        },
      });
    } else {
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    updateRealLayout(child.childNodes, scale);
  });
}


/**
 * 获取节点需要缓存的数据
 * @param {Array} childNodes
 */
function getNodeData(childNodes) {
  const layoutData = [];
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    layoutData[i] = {
      layoutBox: child.layoutBox, // 布局信息
      type: child.type, // 节点信息
      id: child.id, // 每个节点都有个id
      styleInit: child.styleInit,
      styleProp: child.styleProp,
      styleDarkInit: child.styleDarkInit,
      computedStyle: JSON.parse(JSON.stringify(child.computedStyle))
    }
    if (child.type === 'Text') { // 文本节点还要存下文本内容信息
      layoutData[i]['value'] = child.value;
      layoutData[i]['valueBreak'] = child.valueBreak;
    }
    if (child.childNodes && child.childNodes.length) {
      layoutData[i].childNodes = getNodeData(child.childNodes);
    } else {
      layoutData[i].childNodes = [];
    }
  }
  return layoutData;
}

// 恢复布局数据，需要保证节点树、节点样式完全一致
export function restoreLayoutTree(childNodes, layoutNodes) {
  let ret = true;
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    const node = layoutNodes[i];
    if (
      child.type === node.type
      && JSON.stringify(child.styleInit) === JSON.stringify(node.styleInit)
      && JSON.stringify(child.styleProp) === JSON.stringify(node.styleProp)
      && JSON.stringify(child.styleDarkInit) === JSON.stringify(node.styleDarkInit)
    ) {
      child.layoutBox = node.layoutBox;
      if (child.type === 'text') {
        child.valueBreak = node.valueBreak;
      }
      if (child.childNodes.length !== node.childNodes.length) {
        ret = false;
      } else {
        ret = restoreLayoutTree(child.childNodes, node.childNodes);
      }
      if (!ret) break;
    } else {
      ret = false;
      break;
    }
  }
  return ret;
}

export function _getElementById(tree, id) {
  let result = null;
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    if (child.idName === id) {
      result = child;
      break;
    } else if (child.childNodes.length) {
      result = _getElementById(child, id);
      if (result) break;
    }
  }
  return result;
}

export function _getElementsByClassName(tree, list = [], className) {
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }
    if (child.childNodes.length) {
      _getElementsByClassName(child, list, className);
    }
  }

  return list;
}

export function _getChildsByPos(tree, x, y, list = []) {
  let ret = [];
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    const box = child.realLayoutBox;
    if ((box.realX <= x && x <= box.realX + box.width)
      && (box.realY <= y && y <= box.realY + box.height)
      && child.computedStyle.display !== 'none') {
      if (child.childNodes.length) {
        ret = _getChildsByPos(child, x, y, list);
      } else {
        list.push(child);
        ret.push(child);
      }
    }
  }

  if (ret.length === 0 && tree.computedStyle.display !== 'none') { // 子节点都没有，就是点击了tree
    list.push(tree);
    ret.push(tree);
  }
  return list;
}

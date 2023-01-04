/* eslint-disable no-param-reassign */
// components
import { View, Text, Image, ScrollView, BitMapText } from '../components/index.js';

const constructorMap = {
  view: View,
  text: Text,
  image: Image,
  scrollview: ScrollView,
  bitmaptext: BitMapText,
};

function isPercent(data) {
  return typeof data === 'string' && /\d+(?:\.\d+)?%/.test(data);
}

function convertPercent(data, parentData) {
  if (typeof data === 'number') {
    return data;
  }
  const matchData = data.match(/(\d+(?:\.\d+)?)%/)[1];
  if (matchData) {
    return parentData * matchData * 0.01;
  }
}

export function create(node, style, parent) {
  const Constructor = constructorMap[node.name];

  const children = node.children || [];

  const attr = node.attr || {};
  const dataset = {};
  const id = attr.id || '';

  const args = Object.keys(attr)
    .reduce((obj, key) => {
      const value = attr[key];
      const attribute = key;

      if (key === 'id') {
        obj.style = Object.assign(obj.style || {}, style[id] || {});

        return obj;
      }

      if (key === 'class') {
        obj.style = value.split(/\s+/).reduce((res, oneClass) => Object.assign(res, style[oneClass]), obj.style || {});

        return obj;
      }

      // if (/\{\{.+\}\}/.test(value)) {

      // }
      if (value === 'true') {
        obj[attribute] = true;
      } else if (value === 'false') {
        obj[attribute] = false;
      } else {
        obj[attribute] = value;
      }

      if (attribute.startsWith('data-')) {
        const dataKey = attribute.substring(5);

        dataset[dataKey] = value;
      }

      obj.dataset = dataset;

      return obj;
    }, {});

  // 用于后续元素查询
  args.idName = id;
  this.eleCount += 1;
  args.id = this.eleCount;
  args.className = attr.class || '';

  const thisStyle = args.style;
  if (thisStyle) {
    let parentStyle;
    if (parent) {
      parentStyle = parent.style;
    } else if (typeof sharedCanvas !== 'undefined') {
      parentStyle = sharedCanvas;
    } else if (typeof __env !== 'undefined') {
      parentStyle = __env.getSharedCanvas();
    } else {
      parentStyle = {
        width: 300,
        height: 150,
      };
    }
    if (isPercent(thisStyle.width)) {
      thisStyle.width = parentStyle.width ? convertPercent(thisStyle.width, parentStyle.width) : 0;
    }
    if (isPercent(thisStyle.height)) {
      thisStyle.height = parentStyle.height ? convertPercent(thisStyle.height, parentStyle.height) : 0;
    }
  }

  const element = new Constructor(args);
  element.root = this;

  children.forEach((childNode) => {
    const childElement = create.call(this, childNode, style, args);

    element.add(childElement);
  });

  return element;
}

export function renderChildren(children, context, needRender = true) {
  children.forEach((child) => {
    child.shouldUpdate = false;
    child.isDirty = false;
    /**
     * ScrollView的子节点渲染交给ScrollView自己，不支持嵌套ScrollView
     * TODO: 这里感觉还有优化空间
     */
    if (child.type === 'ScrollView') {
      child.insert(context, needRender);

      return renderChildren(child.children, context, false);
    }

    child.insert(context, needRender);
    return renderChildren(child.children, context, needRender);
  });
}

/**
 * 将布局树的布局信息加工赋值到渲染树
 */
export function layoutChildren(element) {
  element.children.forEach((child) => {
    child.layoutBox = child.layoutBox || {};

    ['left', 'top', 'width', 'height'].forEach((prop) => {
      child.layoutBox[prop] = child.layout[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top;
    }

    // if (typeof child.layoutBox.scrollTop !== 'undefined') {
    //   child.layoutBox.absoluteY -= child.layoutBox.scrollTop;
    // }

    // if (typeof child.layoutBox.scrollLeft !== 'undefined') {
    //   child.layoutBox.absoluteX -= child.layoutBox.scrollLeft;
    // }

    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;
    child.layoutBox.originalAbsoluteX = child.layoutBox.absoluteX;


    layoutChildren.call(this, child);
  });
}

export function updateRealLayout(element, scale) {
  element.children.forEach((child) => {
    child.realLayoutBox = child.realLayoutBox || {};

    ['left', 'top', 'width', 'height'].forEach((prop) => {
      child.realLayoutBox[prop] = child.layout[prop] * scale;
    });

    if (child.parent) {
      // Scrollview支持横向滚动和纵向滚动，realX和realY需要动态计算
      Object.defineProperty(child.realLayoutBox, 'realX', {
        configurable: true,
        enumerable: true,
        get: () => {
          let res = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;

          /**
           * 滚动列表事件处理
           */
          if (child.parent && child.parent.type === 'ScrollView') {
            res -= (child.parent.scrollLeft * scale);
          }

          return res;
        },
      });

      Object.defineProperty(child.realLayoutBox, 'realY', {
        configurable: true,
        enumerable: true,
        get: () => {
          let res = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;

          /**
           * 滚动列表事件处理
           */
          if (child.parent && child.parent.type === 'ScrollView') {
            res -= (child.parent.scrollTop * scale);
          }

          return res;
        },
      });
    } else {
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    updateRealLayout(child, scale);
  });
}

function none() { }
export function iterateTree(element, callback = none) {
  callback(element);

  element.children.forEach((child) => {
    iterateTree(child, callback);
  });
}

export function getElementsById(tree, list = [], id) {
  Object.keys(tree.children).forEach((key) => {
    const child = tree.children[key];

    if (child.idName === id) {
      list.push(child);
    }

    if (Object.keys(child.children).length) {
      getElementsById(child, list, id);
    }
  });

  return list;
}

export function getElementsByClassName(tree, list = [], className) {
  Object.keys(tree.children).forEach((key) => {
    const child = tree.children[key];

    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }

    if (Object.keys(child.children).length) {
      getElementsByClassName(child, list, className);
    }
  });

  return list;
}

export const repaintChildren = (children) => {
  children.forEach((child) => {
    child.repaint();

    if (child.type !== 'ScrollView') {
      repaintChildren(child.children);
    }
  });
};

export const repaintTree = (tree) => {
  tree.repaint();

  tree.children.forEach((child) => {
    child.repaint();

    repaintTree(child);
  });
};

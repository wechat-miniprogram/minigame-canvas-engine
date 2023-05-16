/* eslint-disable no-param-reassign */
// components
import { View, Text, Image, ScrollView, BitMapText, Canvas, RichText } from '../components/index.js';

const constructorMap = {
  view: View,
  text: Text,
  image: Image,
  scrollview: ScrollView,
  bitmaptext: BitMapText,
  canvas: Canvas,
  richtext: RichText,
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
    return parentData * matchData * 0.01;q
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

  // console.log(args);
  const element = new Constructor(args);
  element.root = this;
  element.tagName = node.name;

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
    child.insert(context, needRender);

    // ScrollView的子节点渲染交给ScrollView自己，不支持嵌套ScrollView
    return renderChildren(child.children, context,  child.type === 'ScrollView' ? false : needRender);
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

    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;
    child.layoutBox.originalAbsoluteX = child.layoutBox.absoluteX;


    layoutChildren.call(this, child);
  });
}

function none() { }
export function iterateTree(element, callback = none) {
  callback(element);

  element.children.forEach((child) => {
    iterateTree(child, callback);
  });
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

export function clone(element, deep = true, parent) {
  const Constructor = constructorMap[element.tagName];
  this.eleCount += 1;

  const args = {
    style: Object.assign({}, element.style),
    idName: element.idName,
    className: element.className,
    id: this.eleCount,
    dataset: Object.assign({}, element.dataset),
  };

  if (element instanceof Image) {
    args.src = element.src;
  } else if (element instanceof Text || element instanceof BitMapText) {
    args.value = element.value;
  }

  const newElemenet = new Constructor(args);
  newElemenet.root = this;
  newElemenet.insert(this.renderContext, false);
  newElemenet.observeStyleAndEvent();

  if (parent) {
    parent.add(newElemenet);
  }

  if (deep) {
    element.children.forEach((child) => {
      clone.call(this, child, deep, newElemenet);
    });
  }

  return newElemenet;
}


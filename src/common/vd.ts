/* eslint-disable no-param-reassign */
// components
import { View, Text, Image, ScrollView, BitMapText, Canvas, Element } from '../components/index';
import { IStyle } from '../components/style';

import { ILayout, ILayoutBox } from '../components/elements'

interface Constructor {
  new (...args: any[]): any;
}

interface TreeNode {
  name: string;
  attr: Record<string, string>;
  children: TreeNode[];
}

const constructorMap: { [key: string]: Constructor } = {
  view: View,
  text: Text,
  image: Image,
  scrollview: ScrollView,
  bitmaptext: BitMapText,
  canvas: Canvas,
};

export function registerComponent(name: string, Constructor: Constructor) {
  constructorMap[name] = Constructor;
}

function isPercent(data: string | number) {
  return typeof data === 'string' && /\d+(?:\.\d+)?%/.test(data);
}

function convertPercent(data: string | number, parentData: number) {
  if (typeof data === 'number' || data === null) {
    return data;
  }

  const matchData = data.match(/(\d+(?:\.\d+)?)%/);
  if (matchData && matchData[1]) {
    return parentData * parseFloat(matchData[1]) * 0.01;
  }
}

export function create(node: TreeNode, style: Record<string, IStyle>, parent?: Record<string, any>) {
  const Constructor = constructorMap[node.name];

  if (!Constructor) {
    console.error(`[Layout] 不支持组件 ${node.name}`);
    return null;
  }

  const children = node.children || [];

  const attr = node.attr || {};
  const dataset: Record<string, string> = {};
  const id = attr.id || '';

  const args: Record<string, any> = Object.keys(attr).reduce((obj, key: string) => {
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
    }, {} as Record<string, any>);

  // 用于后续元素查询
  args.idName = id;
  // @ts-ignore
  this.eleCount += 1;
  // @ts-ignore
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
  // @ts-ignore
  element.root = this;
  element.tagName = node.name;

  children.forEach((childNode: TreeNode) => {
    // @ts-ignore
    const childElement = create.call(this, childNode, style, args);

    if (childElement) {
      element.add(childElement);
    }
  });

  return element;
}

export function renderChildren(children: Element[], context: CanvasRenderingContext2D, needRender = true) {
  children.forEach((child) => {
    // child.shouldUpdate = false;
    child.isDirty = false;
    child.insert(context, needRender);

    // ScrollView的子节点渲染交给ScrollView自己，不支持嵌套ScrollView
    return renderChildren(child.children, context,  child.type === 'ScrollView' ? false : needRender);
  });
}

/**
 * 将布局树的布局信息加工赋值到渲染树
 */
export function layoutChildren(element: Element) {
  element.children.forEach((child: Element) => {
    child.layoutBox = child.layoutBox || {};

    ['left', 'top', 'width', 'height'].forEach((prop: string) => {
      // @ts-ignore
      child.layoutBox[prop as keyof ILayoutBox] = child.layout?.[prop as keyof ILayout] as number;
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


    layoutChildren(child);
  });
}

type Callback = (...args: any[]) => void;

function none() { }
export function iterateTree(element: Element, callback: Callback = none) {
  callback(element);

  element.children.forEach((child: Element) => {
    iterateTree(child, callback);
  });
}

export const repaintChildren = (children: Element[]) => {
  children.forEach((child: Element) => {
    child.repaint();

    if (child.type !== 'ScrollView') {
      repaintChildren(child.children);
    }
  });
};

export const repaintTree = (tree: Element) => {
  tree.repaint();

  tree.children.forEach((child: Element) => {
    child.repaint();

    repaintTree(child);
  });
};

interface ElementArgs {
  style: object;
  idName: string;
  className: string;
  id: number;
  dataset: object;
  src?: string;
  value?: string;
}

export function clone<T extends Element>(root: T, element: Element, deep = true, parent?: Element) {
  const Constructor = constructorMap[element.tagName as string];
  // @ts-ignore
  root.eleCount += 1;

  const args: ElementArgs = {
    style: Object.assign({}, element.style),
    idName: element.idName,
    className: element.className,
    // @ts-ignore
    id: root.eleCount,
    dataset: Object.assign({}, element.dataset),
  };

  if (element instanceof Image) {
    args.src = element.src;
  } else if (element instanceof Text || element instanceof BitMapText) {
    args.value = element.value;
  }

  const newElemenet = new Constructor(args);
  newElemenet.root = root;
  // @ts-ignore
  newElemenet.insert(root.renderContext, false);
  newElemenet.observeStyleAndEvent();

  if (parent) {
    parent.add(newElemenet);
  }

  if (deep) {
    element.children.forEach((child) => {
      clone(root, child, deep, newElemenet);
    });
  }

  return newElemenet;
}


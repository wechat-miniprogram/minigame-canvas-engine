

export function adaptor(node) {
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
	// if (style.width === 'auto') {
	// 	yogaNode.setWidthAuto();
	// } else if (typeof style.width === 'string' && style.width.endsWith('%')) {
	// 	yogaNode.setWidthPercent(parseFloat(style.width));
	// } else if (typeof style.width !== 'undefined') {
	// 	yogaNode.setWidth(style.width);
	// } else {
	// 	yogaNode.setWidthAuto();
  // }
  // TODO 百分比的情况和auto情况处理

  if (typeof style.minWidth === 'string' && style.minWidth.endsWith('%')) {
    style.minWidth = node.parent.style.width * parseFloat(style.minWidth);
  }

   // 处理最大高度
   if (typeof style.maxHeight === 'string' && style.maxHeight.endsWith('%')) {
    style.minHeight = node.parent.style.height * parseFloat(style.minHeight);
  }

  // 处理高度
  if (style.height === 'auto') {
    // 处理高度为auto的情况
  } else if (typeof style.height === 'string' && style.height.endsWith('%')) {
    style.height = node.parent.style.height * parseFloat(style.height);
  }

  // 处理padding/margin/border
  for (const styleName of [
    'padding',
    'margin',
    'borderWidth'
  ]) {
    if (typeof style[styleName] === 'number') {
      style[styleName + "Top"] = style[styleName];
      style[styleName + "Bottom"] = style[styleName];
      style[styleName + "Left"] = style[styleName];
      style[styleName + "Right"] = style[styleName];
    } else if (typeof style[styleName] === 'string') {
      const s = style[styleName].split(' '); // 根据空格分割出padding的不同参数
      if (s.length === 1) {
        style[styleName + "Top"] = style[styleName];
        style[styleName + "Bottom"] = style[styleName];
        style[styleName + "Left"] = style[styleName];
        style[styleName + "Right"] = style[styleName];
      } else if (s.length === 2) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[0];
        style[styleName + "Left"] = s[1];
        style[styleName + "Right"] = s[1];
      } else if (s.length === 3) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[1];
        style[styleName + "Left"] = s[1];
        style[styleName + "Right"] = s[2];
      } else if (s.length === 4) {
        style[styleName + "Top"] = s[0];
        style[styleName + "Bottom"] = s[1];
        style[styleName + "Left"] = s[2];
        style[styleName + "Right"] = s[3];
      }
    }
  }

  node.style = style;

  node.children.forEach(child => {
    adaptor(child);
  });

  return node;
}

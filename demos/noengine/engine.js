/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-layout/dist/css-layout.js":
/*!****************************************************!*\
  !*** ./node_modules/css-layout/dist/css-layout.js ***!
  \****************************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// UMD (Universal Module Definition)
// See https://github.com/umdjs/umd for reference
//
// This file uses the following specific UMD implementation:
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  /**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var computeLayout = (function() {

  var CSS_UNDEFINED;

  var CSS_DIRECTION_INHERIT = 'inherit';
  var CSS_DIRECTION_LTR = 'ltr';
  var CSS_DIRECTION_RTL = 'rtl';

  var CSS_FLEX_DIRECTION_ROW = 'row';
  var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
  var CSS_FLEX_DIRECTION_COLUMN = 'column';
  var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

  var CSS_JUSTIFY_FLEX_START = 'flex-start';
  var CSS_JUSTIFY_CENTER = 'center';
  var CSS_JUSTIFY_FLEX_END = 'flex-end';
  var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
  var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

  var CSS_ALIGN_FLEX_START = 'flex-start';
  var CSS_ALIGN_CENTER = 'center';
  var CSS_ALIGN_FLEX_END = 'flex-end';
  var CSS_ALIGN_STRETCH = 'stretch';

  var CSS_POSITION_RELATIVE = 'relative';
  var CSS_POSITION_ABSOLUTE = 'absolute';

  var leading = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var trailing = {
    'row': 'right',
    'row-reverse': 'left',
    'column': 'bottom',
    'column-reverse': 'top'
  };
  var pos = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var dim = {
    'row': 'width',
    'row-reverse': 'width',
    'column': 'height',
    'column-reverse': 'height'
  };

  // When transpiled to Java / C the node type has layout, children and style
  // properties. For the JavaScript version this function adds these properties
  // if they don't already exist.
  function fillNodes(node) {
    if (!node.layout || node.isDirty) {
      node.layout = {
        width: undefined,
        height: undefined,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
    }

    // console.log('fillNodes', node.layout, node.isDirty, node)

    if (!node.style) {
      node.style = {};
    }

    if (!node.children) {
      node.children = [];
    }
    node.children.forEach(fillNodes);
    return node;
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isRowDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_ROW ||
           flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
  }

  function isColumnDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
           flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
  }

  function getLeadingMargin(node, axis) {
    if (node.style.marginStart !== undefined && isRowDirection(axis)) {
      return node.style.marginStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginLeft;   break;
      case 'row-reverse':    value = node.style.marginRight;  break;
      case 'column':         value = node.style.marginTop;    break;
      case 'column-reverse': value = node.style.marginBottom; break;
    }

    if (value !== undefined) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getTrailingMargin(node, axis) {
    if (node.style.marginEnd !== undefined && isRowDirection(axis)) {
      return node.style.marginEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginRight;  break;
      case 'row-reverse':    value = node.style.marginLeft;   break;
      case 'column':         value = node.style.marginBottom; break;
      case 'column-reverse': value = node.style.marginTop;    break;
    }

    if (value != null) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getLeadingPadding(node, axis) {
    if (node.style.paddingStart !== undefined && node.style.paddingStart >= 0
        && isRowDirection(axis)) {
      return node.style.paddingStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingLeft;   break;
      case 'row-reverse':    value = node.style.paddingRight;  break;
      case 'column':         value = node.style.paddingTop;    break;
      case 'column-reverse': value = node.style.paddingBottom; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getTrailingPadding(node, axis) {
    if (node.style.paddingEnd !== undefined && node.style.paddingEnd >= 0
        && isRowDirection(axis)) {
      return node.style.paddingEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingRight;  break;
      case 'row-reverse':    value = node.style.paddingLeft;   break;
      case 'column':         value = node.style.paddingBottom; break;
      case 'column-reverse': value = node.style.paddingTop;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getLeadingBorder(node, axis) {
    if (node.style.borderStartWidth !== undefined && node.style.borderStartWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderStartWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderLeftWidth;   break;
      case 'row-reverse':    value = node.style.borderRightWidth;  break;
      case 'column':         value = node.style.borderTopWidth;    break;
      case 'column-reverse': value = node.style.borderBottomWidth; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getTrailingBorder(node, axis) {
    if (node.style.borderEndWidth !== undefined && node.style.borderEndWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderEndWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderRightWidth;  break;
      case 'row-reverse':    value = node.style.borderLeftWidth;   break;
      case 'column':         value = node.style.borderBottomWidth; break;
      case 'column-reverse': value = node.style.borderTopWidth;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getLeadingPaddingAndBorder(node, axis) {
    return getLeadingPadding(node, axis) + getLeadingBorder(node, axis);
  }

  function getTrailingPaddingAndBorder(node, axis) {
    return getTrailingPadding(node, axis) + getTrailingBorder(node, axis);
  }

  function getBorderAxis(node, axis) {
    return getLeadingBorder(node, axis) + getTrailingBorder(node, axis);
  }

  function getMarginAxis(node, axis) {
    return getLeadingMargin(node, axis) + getTrailingMargin(node, axis);
  }

  function getPaddingAndBorderAxis(node, axis) {
    return getLeadingPaddingAndBorder(node, axis) +
        getTrailingPaddingAndBorder(node, axis);
  }

  function getJustifyContent(node) {
    if (node.style.justifyContent) {
      return node.style.justifyContent;
    }
    return 'flex-start';
  }

  function getAlignContent(node) {
    if (node.style.alignContent) {
      return node.style.alignContent;
    }
    return 'flex-start';
  }

  function getAlignItem(node, child) {
    if (child.style.alignSelf) {
      return child.style.alignSelf;
    }
    if (node.style.alignItems) {
      return node.style.alignItems;
    }
    return 'stretch';
  }

  function resolveAxis(axis, direction) {
    if (direction === CSS_DIRECTION_RTL) {
      if (axis === CSS_FLEX_DIRECTION_ROW) {
        return CSS_FLEX_DIRECTION_ROW_REVERSE;
      } else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
        return CSS_FLEX_DIRECTION_ROW;
      }
    }

    return axis;
  }

  function resolveDirection(node, parentDirection) {
    var direction;
    if (node.style.direction) {
      direction = node.style.direction;
    } else {
      direction = CSS_DIRECTION_INHERIT;
    }

    if (direction === CSS_DIRECTION_INHERIT) {
      direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
    }

    return direction;
  }

  function getFlexDirection(node) {
    if (node.style.flexDirection) {
      return node.style.flexDirection;
    }
    return CSS_FLEX_DIRECTION_COLUMN;
  }

  function getCrossFlexDirection(flexDirection, direction) {
    if (isColumnDirection(flexDirection)) {
      return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
    } else {
      return CSS_FLEX_DIRECTION_COLUMN;
    }
  }

  function getPositionType(node) {
    if (node.style.position) {
      return node.style.position;
    }
    return 'relative';
  }

  function isFlex(node) {
    return (
      getPositionType(node) === CSS_POSITION_RELATIVE &&
      node.style.flex > 0
    );
  }

  function isFlexWrap(node) {
    return node.style.flexWrap === 'wrap';
  }

  function getDimWithMargin(node, axis) {
    return node.layout[dim[axis]] + getMarginAxis(node, axis);
  }

  function isDimDefined(node, axis) {
    return node.style[dim[axis]] !== undefined && node.style[dim[axis]] >= 0;
  }

  function isPosDefined(node, pos) {
    return node.style[pos] !== undefined;
  }

  function isMeasureDefined(node) {
    return node.style.measure !== undefined;
  }

  function getPosition(node, pos) {
    if (node.style[pos] !== undefined) {
      return node.style[pos];
    }
    return 0;
  }

  function boundAxis(node, axis, value) {
    var min = {
      'row': node.style.minWidth,
      'row-reverse': node.style.minWidth,
      'column': node.style.minHeight,
      'column-reverse': node.style.minHeight
    }[axis];

    var max = {
      'row': node.style.maxWidth,
      'row-reverse': node.style.maxWidth,
      'column': node.style.maxHeight,
      'column-reverse': node.style.maxHeight
    }[axis];

    var boundValue = value;
    if (max !== undefined && max >= 0 && boundValue > max) {
      boundValue = max;
    }
    if (min !== undefined && min >= 0 && boundValue < min) {
      boundValue = min;
    }
    return boundValue;
  }

  function fmaxf(a, b) {
    if (a > b) {
      return a;
    }
    return b;
  }

  // When the user specifically sets a value for width or height
  function setDimensionFromStyle(node, axis) {
    // The parent already computed us a width or height. We just skip it
    if (node.layout[dim[axis]] !== undefined) {
      return;
    }
    // We only run if there's a width or height defined
    if (!isDimDefined(node, axis)) {
      return;
    }

    // The dimensions can never be smaller than the padding and border
    node.layout[dim[axis]] = fmaxf(
      boundAxis(node, axis, node.style[dim[axis]]),
      getPaddingAndBorderAxis(node, axis)
    );
  }

  function setTrailingPosition(node, child, axis) {
    child.layout[trailing[axis]] = node.layout[dim[axis]] -
        child.layout[dim[axis]] - child.layout[pos[axis]];
  }

  // If both left and right are defined, then use left. Otherwise return
  // +left or -right depending on which is defined.
  function getRelativePosition(node, axis) {
    if (node.style[leading[axis]] !== undefined) {
      return getPosition(node, leading[axis]);
    }
    return -getPosition(node, trailing[axis]);
  }

  function layoutNodeImpl(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
    var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

    // Handle width and height style attributes
    setDimensionFromStyle(node, mainAxis);
    setDimensionFromStyle(node, crossAxis);

    // Set the resolved resolution in the node's layout
    node.layout.direction = direction;

    // The position is set by the parent, but we need to complete it with a
    // delta composed of the margin and left/top/right/bottom
    node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);
    node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);

    // Inline immutable values from the target node to avoid excessive method
    // invocations during the layout calculation.
    var/*int*/ childCount = node.children.length;
    var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);

    if (isMeasureDefined(node)) {
      var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

      var/*float*/ width = CSS_UNDEFINED;
      if (isDimDefined(node, resolvedRowAxis)) {
        width = node.style.width;
      } else if (isResolvedRowDimDefined) {
        width = node.layout[dim[resolvedRowAxis]];
      } else {
        width = parentMaxWidth -
          getMarginAxis(node, resolvedRowAxis);
      }
      width -= paddingAndBorderAxisResolvedRow;

      // We only need to give a dimension for the text if we haven't got any
      // for it computed yet. It can either be from the style attribute or because
      // the element is flexible.
      var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
      var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
        isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

      // Let's not measure the text if we already know both dimensions
      if (isRowUndefined || isColumnUndefined) {
        var/*css_dim_t*/ measureDim = node.style.measure(
          /*(c)!node->context,*/
          /*(java)!layoutContext.measureOutput,*/
          width
        );
        if (isRowUndefined) {
          node.layout.width = measureDim.width +
            paddingAndBorderAxisResolvedRow;
        }
        if (isColumnUndefined) {
          node.layout.height = measureDim.height +
            getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);
        }
      }
      if (childCount === 0) {
        return;
      }
    }

    var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

    var/*css_justify_t*/ justifyContent = getJustifyContent(node);

    var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
    var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
    var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
    var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

    var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
    var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
    var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

    var/*int*/ i;
    var/*int*/ ii;
    var/*css_node_t**/ child;
    var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

    var/*css_node_t**/ firstAbsoluteChild = null;
    var/*css_node_t**/ currentAbsoluteChild = null;

    var/*float*/ definedMainDim = CSS_UNDEFINED;
    if (isMainDimDefined) {
      definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
    }

    // We want to execute the next two loops one per line with flex-wrap
    var/*int*/ startLine = 0;
    var/*int*/ endLine = 0;
    // var/*int*/ nextOffset = 0;
    var/*int*/ alreadyComputedNextLayout = 0;
    // We aggregate the total dimensions of the container in those two variables
    var/*float*/ linesCrossDim = 0;
    var/*float*/ linesMainDim = 0;
    var/*int*/ linesCount = 0;
    while (endLine < childCount) {
      // <Loop A> Layout non flexible children and count children by type

      // mainContentDim is accumulation of the dimensions and margin of all the
      // non flexible children. This will be used in order to either set the
      // dimensions of the node if none already exist, or to compute the
      // remaining space left for the flexible children.
      var/*float*/ mainContentDim = 0;

      // There are three kind of children, non flexible, flexible and absolute.
      // We need to know how many there are in order to distribute the space.
      var/*int*/ flexibleChildrenCount = 0;
      var/*float*/ totalFlexible = 0;
      var/*int*/ nonFlexibleChildrenCount = 0;

      // Use the line loop to position children in the main axis for as long
      // as they are using a simple stacking behaviour. Children that are
      // immediately stacked in the initial loop will not be touched again
      // in <Loop C>.
      var/*bool*/ isSimpleStackMain =
          (isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
          (!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
      var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

      // Use the initial line loop to position children in the cross axis for
      // as long as they are relatively positioned with alignment STRETCH or
      // FLEX_START. Children that are immediately stacked in the initial loop
      // will not be touched again in <Loop D>.
      var/*bool*/ isSimpleStackCross = true;
      var/*int*/ firstComplexCross = childCount;

      var/*css_node_t**/ firstFlexChild = null;
      var/*css_node_t**/ currentFlexChild = null;

      var/*float*/ mainDim = leadingPaddingAndBorderMain;
      var/*float*/ crossDim = 0;

      var/*float*/ maxWidth;
      for (i = startLine; i < childCount; ++i) {
        child = node.children[i];
        child.lineIndex = linesCount;

        child.nextAbsoluteChild = null;
        child.nextFlexChild = null;

        var/*css_align_t*/ alignItem = getAlignItem(node, child);

        // Pre-fill cross axis dimensions when the child is using stretch before
        // we call the recursive layout pass
        if (alignItem === CSS_ALIGN_STRETCH &&
            getPositionType(child) === CSS_POSITION_RELATIVE &&
            isCrossDimDefined &&
            !isDimDefined(child, crossAxis)) {
          child.layout[dim[crossAxis]] = fmaxf(
            boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
              paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(child, crossAxis)
          );
        } else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
          // Store a private linked list of absolutely positioned children
          // so that we can efficiently traverse them later.
          if (firstAbsoluteChild === null) {
            firstAbsoluteChild = child;
          }
          if (currentAbsoluteChild !== null) {
            currentAbsoluteChild.nextAbsoluteChild = child;
          }
          currentAbsoluteChild = child;

          // Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
          // left and right or top and bottom).
          for (ii = 0; ii < 2; ii++) {
            axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
            if (!isUndefined(node.layout[dim[axis]]) &&
                !isDimDefined(child, axis) &&
                isPosDefined(child, leading[axis]) &&
                isPosDefined(child, trailing[axis])) {
              child.layout[dim[axis]] = fmaxf(
                boundAxis(child, axis, node.layout[dim[axis]] -
                  getPaddingAndBorderAxis(node, axis) -
                  getMarginAxis(child, axis) -
                  getPosition(child, leading[axis]) -
                  getPosition(child, trailing[axis])),
                // You never want to go smaller than padding
                getPaddingAndBorderAxis(child, axis)
              );
            }
          }
        }

        var/*float*/ nextContentDim = 0;

        // It only makes sense to consider a child flexible if we have a computed
        // dimension for the node.
        if (isMainDimDefined && isFlex(child)) {
          flexibleChildrenCount++;
          totalFlexible += child.style.flex;

          // Store a private linked list of flexible children so that we can
          // efficiently traverse them later.
          if (firstFlexChild === null) {
            firstFlexChild = child;
          }
          if (currentFlexChild !== null) {
            currentFlexChild.nextFlexChild = child;
          }
          currentFlexChild = child;

          // Even if we don't know its exact size yet, we already know the padding,
          // border and margin. We'll use this partial information, which represents
          // the smallest possible size for the child, to compute the remaining
          // available space.
          nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
            getMarginAxis(child, mainAxis);

        } else {
          maxWidth = CSS_UNDEFINED;
          if (!isMainRowDirection) {
            if (isDimDefined(node, resolvedRowAxis)) {
              maxWidth = node.layout[dim[resolvedRowAxis]] -
                paddingAndBorderAxisResolvedRow;
            } else {
              maxWidth = parentMaxWidth -
                getMarginAxis(node, resolvedRowAxis) -
                paddingAndBorderAxisResolvedRow;
            }
          }

          // This is the main recursive call. We layout non flexible children.
          if (alreadyComputedNextLayout === 0) {
            layoutNode(/*(java)!layoutContext, */child, maxWidth, direction);
          }

          // Absolute positioned elements do not take part of the layout, so we
          // don't use them to compute mainContentDim
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            nonFlexibleChildrenCount++;
            // At this point we know the final size and margin of the element.
            nextContentDim = getDimWithMargin(child, mainAxis);
          }
        }

        // The element we are about to add would make us go to the next line
        if (isNodeFlexWrap &&
            isMainDimDefined &&
            mainContentDim + nextContentDim > definedMainDim &&
            // If there's only one element, then it's bigger than the content
            // and needs its own line
            i !== startLine) {
          nonFlexibleChildrenCount--;
          alreadyComputedNextLayout = 1;
          break;
        }

        // Disable simple stacking in the main axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop C>.
        if (isSimpleStackMain &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
          isSimpleStackMain = false;
          firstComplexMain = i;
        }

        // Disable simple stacking in the cross axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop D>.
        if (isSimpleStackCross &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE ||
                (alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
                isUndefined(child.layout[dim[crossAxis]]))) {
          isSimpleStackCross = false;
          firstComplexCross = i;
        }

        if (isSimpleStackMain) {
          child.layout[pos[mainAxis]] += mainDim;
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          mainDim += getDimWithMargin(child, mainAxis);
          crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
        }

        if (isSimpleStackCross) {
          child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }

        alreadyComputedNextLayout = 0;
        mainContentDim += nextContentDim;
        endLine = i + 1;
      }

      // <Loop B> Layout flexible children and allocate empty space

      // In order to position the elements in the main axis, we have two
      // controls. The space between the beginning and the first element
      // and the space between each two elements.
      var/*float*/ leadingMainDim = 0;
      var/*float*/ betweenMainDim = 0;

      // The remaining available space that needs to be allocated
      var/*float*/ remainingMainDim = 0;
      if (isMainDimDefined) {
        remainingMainDim = definedMainDim - mainContentDim;
      } else {
        remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
      }

      // If there are flexible children in the mix, they are going to fill the
      // remaining space
      if (flexibleChildrenCount !== 0) {
        var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
        var/*float*/ baseMainDim;
        var/*float*/ boundMainDim;

        // If the flex share of remaining space doesn't meet min/max bounds,
        // remove this child from flex calculations.
        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          baseMainDim = flexibleMainDim * currentFlexChild.style.flex +
              getPaddingAndBorderAxis(currentFlexChild, mainAxis);
          boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

          if (baseMainDim !== boundMainDim) {
            remainingMainDim -= boundMainDim;
            totalFlexible -= currentFlexChild.style.flex;
          }

          currentFlexChild = currentFlexChild.nextFlexChild;
        }
        flexibleMainDim = remainingMainDim / totalFlexible;

        // The non flexible children can overflow the container, in this case
        // we should just assume that there is no space available.
        if (flexibleMainDim < 0) {
          flexibleMainDim = 0;
        }

        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          // At this point we know the final size of the element in the main
          // dimension
          currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
            flexibleMainDim * currentFlexChild.style.flex +
                getPaddingAndBorderAxis(currentFlexChild, mainAxis)
          );

          maxWidth = CSS_UNDEFINED;
          if (isDimDefined(node, resolvedRowAxis)) {
            maxWidth = node.layout[dim[resolvedRowAxis]] -
              paddingAndBorderAxisResolvedRow;
          } else if (!isMainRowDirection) {
            maxWidth = parentMaxWidth -
              getMarginAxis(node, resolvedRowAxis) -
              paddingAndBorderAxisResolvedRow;
          }

          // And we recursively call the layout algorithm for this child
          layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, direction);

          child = currentFlexChild;
          currentFlexChild = currentFlexChild.nextFlexChild;
          child.nextFlexChild = null;
        }

      // We use justifyContent to figure out how to allocate the remaining
      // space available
      } else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
        if (justifyContent === CSS_JUSTIFY_CENTER) {
          leadingMainDim = remainingMainDim / 2;
        } else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
          leadingMainDim = remainingMainDim;
        } else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
          remainingMainDim = fmaxf(remainingMainDim, 0);
          if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
            betweenMainDim = remainingMainDim /
              (flexibleChildrenCount + nonFlexibleChildrenCount - 1);
          } else {
            betweenMainDim = 0;
          }
        } else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
          // Space on the edges is half of the space between elements
          betweenMainDim = remainingMainDim /
            (flexibleChildrenCount + nonFlexibleChildrenCount);
          leadingMainDim = betweenMainDim / 2;
        }
      }

      // <Loop C> Position elements in the main axis and compute dimensions

      // At this point, all the children have their dimensions set. We need to
      // find their position. In order to do that, we accumulate data in
      // variables that are also useful to compute the total dimensions of the
      // container!
      mainDim += leadingMainDim;

      for (i = firstComplexMain; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[mainAxis])) {
          // In case the child is position absolute and has left/top being
          // defined, we override the position to whatever the user said
          // (and margin/border).
          child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
            getLeadingBorder(node, mainAxis) +
            getLeadingMargin(child, mainAxis);
        } else {
          // If the child is position absolute (without top/left) or relative,
          // we put it at the current accumulated offset.
          child.layout[pos[mainAxis]] += mainDim;

          // Define the trailing position accordingly.
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          // Now that we placed the element, we need to update the variables
          // We only need to do that for relative elements. Absolute elements
          // do not take part in that phase.
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            // The main dimension is the sum of all the elements dimension plus
            // the spacing.
            mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
            // The cross dimension is the max of the elements dimension since there
            // can only be one element in that cross dimension.
            crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
          }
        }
      }

      var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
      if (!isCrossDimDefined) {
        containerCrossAxis = fmaxf(
          // For the cross dim, we add both sides at the end because the value
          // is aggregate via a max function. Intermediate negative values
          // can mess this computation otherwise
          boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
          paddingAndBorderAxisCross
        );
      }

      // <Loop D> Position elements in the cross axis
      for (i = firstComplexCross; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[crossAxis])) {
          // In case the child is absolutely positionned and has a
          // top/left/bottom/right being set, we override all the previously
          // computed positions to set it correctly.
          child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
            getLeadingBorder(node, crossAxis) +
            getLeadingMargin(child, crossAxis);

        } else {
          var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

          // For a relative children, we're either using alignItems (parent) or
          // alignSelf (child) in order to determine the position in the cross axis
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            /*eslint-disable */
            // This variable is intentionally re-defined as the code is transpiled to a block scope language
            var/*css_align_t*/ alignItem = getAlignItem(node, child);
            /*eslint-enable */
            if (alignItem === CSS_ALIGN_STRETCH) {
              // You can only stretch if the dimension has not already been set
              // previously.
              if (isUndefined(child.layout[dim[crossAxis]])) {
                child.layout[dim[crossAxis]] = fmaxf(
                  boundAxis(child, crossAxis, containerCrossAxis -
                    paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
                  // You never want to go smaller than padding
                  getPaddingAndBorderAxis(child, crossAxis)
                );
              }
            } else if (alignItem !== CSS_ALIGN_FLEX_START) {
              // The remaining space between the parent dimensions+padding and child
              // dimensions+margin.
              var/*float*/ remainingCrossDim = containerCrossAxis -
                paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

              if (alignItem === CSS_ALIGN_CENTER) {
                leadingCrossDim += remainingCrossDim / 2;
              } else { // CSS_ALIGN_FLEX_END
                leadingCrossDim += remainingCrossDim;
              }
            }
          }

          // And we apply the position
          child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

          // Define the trailing position accordingly.
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }
      }

      linesCrossDim += crossDim;
      linesMainDim = fmaxf(linesMainDim, mainDim);
      linesCount += 1;
      startLine = endLine;
    }

    // <Loop E>
    //
    // Note(prenaux): More than one line, we need to layout the crossAxis
    // according to alignContent.
    //
    // Note that we could probably remove <Loop D> and handle the one line case
    // here too, but for the moment this is safer since it won't interfere with
    // previously working code.
    //
    // See specs:
    // http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
    // section 9.4
    //
    if (linesCount > 1 && isCrossDimDefined) {
      var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
          paddingAndBorderAxisCross;
      var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

      var/*float*/ crossDimLead = 0;
      var/*float*/ currentLead = leadingPaddingAndBorderCross;

      var/*css_align_t*/ alignContent = getAlignContent(node);
      if (alignContent === CSS_ALIGN_FLEX_END) {
        currentLead += remainingAlignContentDim;
      } else if (alignContent === CSS_ALIGN_CENTER) {
        currentLead += remainingAlignContentDim / 2;
      } else if (alignContent === CSS_ALIGN_STRETCH) {
        if (nodeCrossAxisInnerSize > linesCrossDim) {
          crossDimLead = (remainingAlignContentDim / linesCount);
        }
      }

      var/*int*/ endIndex = 0;
      for (i = 0; i < linesCount; ++i) {
        var/*int*/ startIndex = endIndex;

        // compute the line's height and find the endIndex
        var/*float*/ lineHeight = 0;
        for (ii = startIndex; ii < childCount; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }
          if (child.lineIndex !== i) {
            break;
          }
          if (!isUndefined(child.layout[dim[crossAxis]])) {
            lineHeight = fmaxf(
              lineHeight,
              child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
            );
          }
        }
        endIndex = ii;
        lineHeight += crossDimLead;

        for (ii = startIndex; ii < endIndex; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }

          var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
          if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
          } else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
            child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
          } else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
            var/*float*/ childHeight = child.layout[dim[crossAxis]];
            child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
          } else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
            // TODO(prenaux): Correctly set the height of items with undefined
            //                (auto) crossAxis dimension.
          }
        }

        currentLead += lineHeight;
      }
    }

    var/*bool*/ needsMainTrailingPos = false;
    var/*bool*/ needsCrossTrailingPos = false;

    // If the user didn't specify a width or height, and it has not been set
    // by the container, then we set it via the children.
    if (!isMainDimDefined) {
      node.layout[dim[mainAxis]] = fmaxf(
        // We're missing the last padding at this point to get the final
        // dimension
        boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
        // We can never assign a width smaller than the padding and borders
        paddingAndBorderAxisMain
      );

      if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsMainTrailingPos = true;
      }
    }

    if (!isCrossDimDefined) {
      node.layout[dim[crossAxis]] = fmaxf(
        // For the cross dim, we add both sides at the end because the value
        // is aggregate via a max function. Intermediate negative values
        // can mess this computation otherwise
        boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
        paddingAndBorderAxisCross
      );

      if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsCrossTrailingPos = true;
      }
    }

    // <Loop F> Set trailing position if necessary
    if (needsMainTrailingPos || needsCrossTrailingPos) {
      for (i = 0; i < childCount; ++i) {
        child = node.children[i];

        if (needsMainTrailingPos) {
          setTrailingPosition(node, child, mainAxis);
        }

        if (needsCrossTrailingPos) {
          setTrailingPosition(node, child, crossAxis);
        }
      }
    }

    // <Loop G> Calculate dimensions for absolutely positioned elements
    currentAbsoluteChild = firstAbsoluteChild;
    while (currentAbsoluteChild !== null) {
      // Pre-fill dimensions when using absolute position and both offsets for
      // the axis are defined (either both left and right or top and bottom).
      for (ii = 0; ii < 2; ii++) {
        axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

        if (!isUndefined(node.layout[dim[axis]]) &&
            !isDimDefined(currentAbsoluteChild, axis) &&
            isPosDefined(currentAbsoluteChild, leading[axis]) &&
            isPosDefined(currentAbsoluteChild, trailing[axis])) {
          currentAbsoluteChild.layout[dim[axis]] = fmaxf(
            boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
              getBorderAxis(node, axis) -
              getMarginAxis(currentAbsoluteChild, axis) -
              getPosition(currentAbsoluteChild, leading[axis]) -
              getPosition(currentAbsoluteChild, trailing[axis])
            ),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(currentAbsoluteChild, axis)
          );
        }

        if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
            !isPosDefined(currentAbsoluteChild, leading[axis])) {
          currentAbsoluteChild.layout[leading[axis]] =
            node.layout[dim[axis]] -
            currentAbsoluteChild.layout[dim[axis]] -
            getPosition(currentAbsoluteChild, trailing[axis]);
        }
      }

      child = currentAbsoluteChild;
      currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
      child.nextAbsoluteChild = null;
    }
  }

  function layoutNode(node, parentMaxWidth, parentDirection) {
    node.shouldUpdate = true;

    var direction = node.style.direction || CSS_DIRECTION_LTR;
    var skipLayout =
      !node.isDirty &&
      node.lastLayout &&
      node.lastLayout.requestedHeight === node.layout.height &&
      node.lastLayout.requestedWidth === node.layout.width &&
      node.lastLayout.parentMaxWidth === parentMaxWidth &&
      node.lastLayout.direction === direction;

    // console.log('skipLayout', skipLayout, node)
    if (skipLayout) {
      node.layout.width = node.lastLayout.width;
      node.layout.height = node.lastLayout.height;
      node.layout.top = node.lastLayout.top;
      node.layout.left = node.lastLayout.left;
    } else {
      if (!node.lastLayout) {
        node.lastLayout = {};
      }

      node.lastLayout.requestedWidth = node.layout.width;
      node.lastLayout.requestedHeight = node.layout.height;
      node.lastLayout.parentMaxWidth = parentMaxWidth;
      node.lastLayout.direction = direction;

      // Reset child layouts
      node.children.forEach(function(child) {
        child.layout.width = undefined;
        child.layout.height = undefined;
        child.layout.top = 0;
        child.layout.left = 0;
      });

      layoutNodeImpl(node, parentMaxWidth, parentDirection);

      node.lastLayout.width = node.layout.width;
      node.lastLayout.height = node.layout.height;
      node.lastLayout.top = node.layout.top;
      node.lastLayout.left = node.layout.left;
    }
  }

  return {
    layoutNodeImpl: layoutNodeImpl,
    computeLayout: layoutNode,
    fillNodes: fillNodes
  };
})();

// This module export is only used for the purposes of unit testing this file. When
// the library is packaged this file is included within css-layout.js which forms
// the public API.
if (true) {
  module.exports = computeLayout;
}


  return function(node) {
    /*eslint-disable */
    // disabling ESLint because this code relies on the above include
    computeLayout.fillNodes(node);
    computeLayout.computeLayout(node);
    /*eslint-enable */
  };
}));


/***/ }),

/***/ "./node_modules/tiny-emitter/index.js":
/*!********************************************!*\
  !*** ./node_modules/tiny-emitter/index.js ***!
  \********************************************/
/***/ ((module) => {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;


/***/ }),

/***/ "./src/common/bitMapFont.ts":
/*!**********************************!*\
  !*** ./src/common/bitMapFont.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _imageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageManager */ "./src/common/imageManager.ts");

var Emitter = __webpack_require__(/*! tiny-emitter */ "./node_modules/tiny-emitter/index.js");
/**
 * http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
var BitMapFont = /** @class */ (function () {
    // pool的实现放到类里面实现并不优雅，先去掉了
    function BitMapFont(name, src, config) {
        var _this = this;
        this.ready = false;
        this.config = config;
        this.chars = this.parseConfig(config);
        this.event = new Emitter();
        this.texture = _imageManager__WEBPACK_IMPORTED_MODULE_0__["default"].loadImage(src, function (texture, fromCache) {
            if (fromCache) {
                _this.texture = texture;
            }
            _this.ready = true;
            _this.event.emit('text__load__done');
        });
    }
    BitMapFont.prototype.parseConfig = function (fntText) {
        fntText = fntText.split('\r\n').join('\n');
        var lines = fntText.split('\n');
        var linesParsed = lines.map(function (line) { return line.trim().split(' '); });
        var charsLine = this.getConfigByLineName(linesParsed, 'chars');
        var charsCount = this.getConfigByKeyInOneLine(charsLine.line, 'count');
        var commonLine = this.getConfigByLineName(linesParsed, 'common');
        this.lineHeight = this.getConfigByKeyInOneLine(commonLine.line, 'lineHeight');
        var infoLine = this.getConfigByLineName(linesParsed, 'info');
        this.fontSize = this.getConfigByKeyInOneLine(infoLine.line, 'size');
        // 接卸 kernings
        var kerningsLine = this.getConfigByLineName(linesParsed, 'kernings');
        var kerningsCount = 0;
        var kerningsStart = -1;
        if (kerningsLine.line) {
            kerningsCount = this.getConfigByKeyInOneLine(kerningsLine.line, 'count');
            kerningsStart = kerningsLine.index + 1;
        }
        var chars = {};
        for (var i = 4; i < 4 + charsCount; i++) {
            var charText = lines[i];
            var letter = String.fromCharCode(this.getConfigByKeyInOneLine(charText, 'id'));
            var c = {
                x: this.getConfigByKeyInOneLine(charText, 'x'),
                y: this.getConfigByKeyInOneLine(charText, 'y'),
                w: this.getConfigByKeyInOneLine(charText, 'width'),
                h: this.getConfigByKeyInOneLine(charText, 'height'),
                offX: this.getConfigByKeyInOneLine(charText, 'xoffset'),
                offY: this.getConfigByKeyInOneLine(charText, 'yoffset'),
                xadvance: this.getConfigByKeyInOneLine(charText, 'xadvance'),
                kerning: {}
            };
            chars[letter] = c;
        }
        // parse kernings
        if (kerningsCount) {
            for (var i = kerningsStart; i <= kerningsStart + kerningsCount; i++) {
                var line = linesParsed[i];
                var first = String.fromCharCode(this.getConfigByKeyInOneLine(line, 'first'));
                var second = String.fromCharCode(this.getConfigByKeyInOneLine(line, 'second'));
                var amount = this.getConfigByKeyInOneLine(line, 'amount');
                if (chars[second]) {
                    chars[second].kerning[first] = amount;
                }
            }
        }
        return chars;
    };
    BitMapFont.prototype.getConfigByLineName = function (linesParsed, lineName) {
        if (lineName === void 0) { lineName = ''; }
        var index = -1;
        var line = [];
        var len = linesParsed.length;
        for (var i = 0; i < len; i++) {
            var item = linesParsed[i];
            if (item[0] === lineName) {
                index = i;
                line = item;
            }
        }
        return {
            line: line,
            index: index,
        };
    };
    BitMapFont.prototype.getConfigByKeyInOneLine = function (configText, key) {
        var itemConfigTextList = Array.isArray(configText) ? configText : configText.split(' ');
        for (var i = 0, length_1 = itemConfigTextList.length; i < length_1; i++) {
            var itemConfigText = itemConfigTextList[i];
            if (key === itemConfigText.substring(0, key.length)) {
                var value = itemConfigText.substring(key.length + 1);
                return parseInt(value);
            }
        }
        return 0;
    };
    return BitMapFont;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BitMapFont);


/***/ }),

/***/ "./src/common/debugInfo.ts":
/*!*********************************!*\
  !*** ./src/common/debugInfo.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var DebugInfo = /** @class */ (function () {
    function DebugInfo() {
        this.info = {};
        this.totalStart = 0;
        this.totalCost = 0;
        this.reset();
    }
    DebugInfo.prototype.start = function (name, isInner) {
        if (isInner === void 0) { isInner = false; }
        if (this.totalStart === 0) {
            this.totalStart = Date.now();
        }
        this.info[name] = {
            start: Date.now(),
            isInner: isInner,
        };
    };
    DebugInfo.prototype.end = function (name) {
        if (this.info[name]) {
            this.info[name].end = Date.now();
            this.info[name].cost = this.info[name].end - this.info[name].start;
            this.totalCost = this.info[name].end - this.totalStart;
        }
    };
    DebugInfo.prototype.reset = function () {
        this.info = {};
        this.totalStart = 0;
        this.totalCost = 0;
    };
    DebugInfo.prototype.log = function (needInner) {
        var _this = this;
        if (needInner === void 0) { needInner = false; }
        var logInfo = 'Layout debug info: \n';
        logInfo += Object.keys(this.info).reduce(function (sum, curr) {
            if (_this.info[curr].isInner && !needInner) {
                return sum;
            }
            sum += "".concat(curr, ": ").concat(_this.info[curr].cost, "\n");
            return sum;
        }, '');
        logInfo += "totalCost: ".concat(this.totalCost, "\n");
        return logInfo;
    };
    return DebugInfo;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DebugInfo);


/***/ }),

/***/ "./src/common/imageManager.ts":
/*!************************************!*\
  !*** ./src/common/imageManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pool */ "./src/common/pool.ts");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/common/util.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env */ "./src/env.ts");



var ImageManager = /** @class */ (function () {
    function ImageManager() {
        this.imgPool = new _pool__WEBPACK_IMPORTED_MODULE_0__["default"]('imgPool');
    }
    ImageManager.prototype.getRes = function (src) {
        return this.imgPool.get(src);
    };
    ImageManager.prototype.loadImagePromise = function (src) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadImage(src, resolve, reject);
        });
    };
    ImageManager.prototype.loadImage = function (src, success, fail) {
        if (success === void 0) { success = _util__WEBPACK_IMPORTED_MODULE_1__.none; }
        if (fail === void 0) { fail = _util__WEBPACK_IMPORTED_MODULE_1__.none; }
        if (!src) {
            return null;
        }
        var img;
        var cache = this.getRes(src);
        // 图片已经被加载过，直接返回图片并且执行回调
        if (cache && cache.loadDone) {
            img = cache.img;
            success(img, true);
        }
        else if (cache && !cache.loadDone) {
            // 图片正在加载过程中，返回图片并且等待图片加载完成执行回调
            img = cache.img;
            cache.onloadcbks.push(success);
            cache.onerrorcbks.push(fail);
        }
        else {
            // 创建图片，将回调函数推入回调函数栈
            img = _env__WEBPACK_IMPORTED_MODULE_2__["default"].createImage();
            var newCache_1 = {
                img: img,
                loadDone: false,
                onloadcbks: [success],
                onerrorcbks: [fail],
            };
            this.imgPool.set(src, newCache_1);
            img.onload = function () {
                newCache_1.loadDone = true;
                newCache_1.onloadcbks.forEach(function (fn) { return fn(img, false); });
                newCache_1.onloadcbks = [];
                newCache_1.onerrorcbks = [];
            };
            img.onerror = function () {
                newCache_1.onerrorcbks.forEach(function (fn) { return fn(img, false); });
                newCache_1.onerrorcbks = [];
                newCache_1.onloadcbks = [];
            };
            img.src = src;
        }
        return img;
    };
    return ImageManager;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new ImageManager());


/***/ }),

/***/ "./src/common/pool.ts":
/*!****************************!*\
  !*** ./src/common/pool.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var pools = [];
var Pool = /** @class */ (function () {
    function Pool(name) {
        if (name === void 0) { name = 'pool'; }
        this.name = 'pool';
        this.pool = {};
        var curr = pools.find(function (item) { return item.name === name; });
        if (curr) {
            return curr;
        }
        this.name = name;
        this.pool = {};
        pools.push(this);
    }
    Pool.prototype.get = function (key) {
        return this.pool[key];
    };
    Pool.prototype.set = function (key, value) {
        this.pool[key] = value;
    };
    Pool.prototype.clear = function () {
        this.pool = {};
    };
    Pool.prototype.getList = function () {
        return Object.values(this.pool);
    };
    return Pool;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pool);


/***/ }),

/***/ "./src/common/rect.ts":
/*!****************************!*\
  !*** ./src/common/rect.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Rect = /** @class */ (function () {
    function Rect(left, top, width, height) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.width = 0;
        this.height = 0;
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        this.set(left, top, width, height);
    }
    Rect.prototype.set = function (left, top, width, height) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };
    /**
     * 判断两个矩形是否相交
     * 原理可见: https://zhuanlan.zhihu.com/p/29704064
     */
    Rect.prototype.intersects = function (rect) {
        return !(this.right < rect.left || rect.right < this.left || this.bottom < rect.top || rect.bottom < this.top);
    };
    return Rect;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rect);


/***/ }),

/***/ "./src/common/ticker.ts":
/*!******************************!*\
  !*** ./src/common/ticker.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var Ticker = /** @class */ (function () {
    function Ticker() {
        var _this = this;
        this.count = 0;
        this.started = false;
        this.animationId = null;
        this.cbs = [];
        this.innerCbs = [];
        this.nextCbs = [];
        this.innerNextCbs = [];
        this.update = function () {
            var time = Date.now();
            var deltaTime = time - _this.lastTime;
            _this.lastTime = time;
            // console.log(dt)
            // 优先执行业务的ticker回调，因为有可能会触发reflow
            _this.cbs.forEach(function (cb) {
                cb(deltaTime);
            });
            _this.innerCbs.forEach(function (cb) {
                cb(deltaTime);
            });
            if (_this.innerNextCbs.length) {
                _this.innerNextCbs.forEach(function (cb) { return cb(deltaTime); });
                _this.innerNextCbs = [];
            }
            if (_this.nextCbs.length) {
                _this.nextCbs.forEach(function (cb) { return cb(deltaTime); });
                _this.nextCbs = [];
            }
            _this.count += 1;
            _this.animationId = requestAnimationFrame(_this.update);
        };
    }
    Ticker.prototype.cancelIfNeed = function () {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    };
    Ticker.prototype.add = function (cb, isInner) {
        if (isInner === void 0) { isInner = false; }
        if (typeof cb === 'function' && this.cbs.indexOf(cb) === -1) {
            isInner ? this.innerCbs.push(cb) : this.cbs.push(cb);
        }
    };
    Ticker.prototype.next = function (cb, isInner) {
        if (isInner === void 0) { isInner = false; }
        if (typeof cb === 'function') {
            isInner ? this.innerNextCbs.push(cb) : this.nextCbs.push(cb);
        }
    };
    Ticker.prototype.removeInner = function () {
        this.innerCbs = [];
        this.innerNextCbs = [];
    };
    Ticker.prototype.remove = function (cb, isInner) {
        if (isInner === void 0) { isInner = false; }
        if (cb === undefined) {
            this.cbs = [];
            this.innerCbs = [];
            this.nextCbs = [];
            this.innerNextCbs = [];
        }
        if (typeof cb === 'function' && (this.cbs.indexOf(cb) > -1 || this.innerCbs.indexOf(cb) > -1)) {
            var list = isInner ? this.innerCbs : this.cbs;
            list.splice(this.cbs.indexOf(cb), 1);
        }
        if (!this.cbs.length && !this.innerCbs.length) {
            this.cancelIfNeed();
        }
    };
    Ticker.prototype.start = function () {
        if (!this.started) {
            this.started = true;
            this.lastTime = Date.now();
            if (this.animationId === null && (this.cbs.length || this.innerCbs.length)) {
                this.animationId = requestAnimationFrame(this.update);
            }
        }
    };
    Ticker.prototype.stop = function () {
        if (this.started) {
            this.started = false;
            this.cancelIfNeed();
        }
    };
    return Ticker;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ticker);


/***/ }),

/***/ "./src/common/util.ts":
/*!****************************!*\
  !*** ./src/common/util.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   STATE: () => (/* binding */ STATE),
/* harmony export */   clamp: () => (/* binding */ clamp),
/* harmony export */   clearCanvas: () => (/* binding */ clearCanvas),
/* harmony export */   copyTouchArray: () => (/* binding */ copyTouchArray),
/* harmony export */   isClick: () => (/* binding */ isClick),
/* harmony export */   isGameTouchEvent: () => (/* binding */ isGameTouchEvent),
/* harmony export */   lerp: () => (/* binding */ lerp),
/* harmony export */   none: () => (/* binding */ none)
/* harmony export */ });
/* istanbul ignore next */
function none() { }
/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */
function isClick(touchMsg) {
    var start = touchMsg.touchstart;
    var end = touchMsg.touchend;
    if (!start
        || !end
        || !start.timeStamp
        || !end.timeStamp
        || start.pageX === undefined
        || start.pageY === undefined
        || end.pageX === undefined
        || end.pageY === undefined) {
        return false;
    }
    var startPosX = start.pageX;
    var startPosY = start.pageY;
    var endPosX = end.pageX;
    var endPosY = end.pageY;
    var touchTimes = end.timeStamp - start.timeStamp;
    return !!(Math.abs(endPosY - startPosY) < 30
        && Math.abs(endPosX - startPosX) < 30
        && touchTimes < 300);
}
var STATE;
(function (STATE) {
    STATE["UNINIT"] = "UNINIT";
    STATE["INITED"] = "INITED";
    STATE["RENDERED"] = "RENDERED";
    STATE["CLEAR"] = "CLEAR";
})(STATE || (STATE = {}));
;
function clearCanvas(ctx) {
    ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function copyTouchArray(touches) {
    return touches.map(function (touch) { return ({
        identifier: touch.identifier,
        pageX: touch.pageX,
        pageY: touch.pageY,
        clientX: touch.clientX,
        clientY: touch.clientY,
    }); });
}
function isGameTouchEvent(e) {
    return 'touches' in e;
}
/**
 * 取最小值和最大值之间的区间限定值
 * @param {number} number 需要被处理的数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}
/**
 * 两个数之间的线性插值。
 */
function lerp(from, to, ratio) {
    return from + (to - from) * ratio;
}


/***/ }),

/***/ "./src/common/vd.ts":
/*!**************************!*\
  !*** ./src/common/vd.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clone: () => (/* binding */ clone),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   iterateTree: () => (/* binding */ iterateTree),
/* harmony export */   layoutChildren: () => (/* binding */ layoutChildren),
/* harmony export */   registerComponent: () => (/* binding */ registerComponent),
/* harmony export */   renderChildren: () => (/* binding */ renderChildren),
/* harmony export */   repaintChildren: () => (/* binding */ repaintChildren),
/* harmony export */   repaintTree: () => (/* binding */ repaintTree)
/* harmony export */ });
/* harmony import */ var _components_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/index */ "./src/components/index.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env */ "./src/env.ts");
/* eslint-disable no-param-reassign */
// components


var constructorMap = {
    view: _components_index__WEBPACK_IMPORTED_MODULE_0__.View,
    text: _components_index__WEBPACK_IMPORTED_MODULE_0__.Text,
    image: _components_index__WEBPACK_IMPORTED_MODULE_0__.Image,
    scrollview: _components_index__WEBPACK_IMPORTED_MODULE_0__.ScrollView,
    bitmaptext: _components_index__WEBPACK_IMPORTED_MODULE_0__.BitMapText,
    canvas: _components_index__WEBPACK_IMPORTED_MODULE_0__.Canvas,
    button: _components_index__WEBPACK_IMPORTED_MODULE_0__.Button,
};
function registerComponent(name, Constructor) {
    constructorMap[name] = Constructor;
}
function isPercent(data) {
    return typeof data === 'string' && /\d+(?:\.\d+)?%/.test(data);
}
function convertPercent(data, parentData) {
    if (typeof data === 'number' || data === null) {
        return data;
    }
    var matchData = data.match(/(\d+(?:\.\d+)?)%/);
    if (matchData && matchData[1]) {
        return parentData * parseFloat(matchData[1]) * 0.01;
    }
}
function create(node, style, parent) {
    var _this = this;
    var Constructor = constructorMap[node.name];
    if (!Constructor) {
        console.error("[Layout] \u4E0D\u652F\u6301\u7EC4\u4EF6 ".concat(node.name));
        return null;
    }
    var children = node.children || [];
    var attr = node.attr || {};
    var dataset = {};
    var id = attr.id || '';
    var args = Object.keys(attr).reduce(function (obj, key) {
        var value = attr[key];
        var attribute = key;
        if (key === 'id') {
            obj.style = Object.assign(obj.style || {}, style[id] || {});
            return obj;
        }
        if (key === 'class') {
            obj.style = value.split(/\s+/).reduce(function (res, oneClass) { return Object.assign(res, style[oneClass]); }, obj.style || {});
            return obj;
        }
        if (value === 'true') {
            obj[attribute] = true;
        }
        else if (value === 'false') {
            obj[attribute] = false;
        }
        else {
            obj[attribute] = value;
        }
        if (attribute.startsWith('data-')) {
            var dataKey = attribute.substring(5);
            dataset[dataKey] = value;
        }
        obj.dataset = dataset;
        return obj;
    }, {});
    // 用于后续元素查询
    args.idName = id;
    // @ts-ignore
    this.eleCount += 1;
    // @ts-ignore
    args.id = this.eleCount;
    args.className = attr.class || '';
    var thisStyle = args.style;
    if (thisStyle) {
        var parentStyle = void 0;
        if (parent) {
            parentStyle = parent.style;
        }
        else {
            parentStyle = _env__WEBPACK_IMPORTED_MODULE_1__["default"].getRootCanvasSize();
        }
        if (isPercent(thisStyle.width)) {
            thisStyle.width = parentStyle.width ? convertPercent(thisStyle.width, parentStyle.width) : 0;
        }
        if (isPercent(thisStyle.height)) {
            thisStyle.height = parentStyle.height ? convertPercent(thisStyle.height, parentStyle.height) : 0;
        }
        if (typeof thisStyle.opacity === 'undefined') {
            thisStyle.opacity = 1;
        }
        if (parentStyle.opacity !== 1 && typeof parentStyle.opacity === 'number') {
            thisStyle.opacity = parentStyle.opacity * thisStyle.opacity;
        }
    }
    // console.log(args);
    var element = new Constructor(args);
    // @ts-ignore
    element.root = this;
    element.tagName = node.name;
    element.afterCreate();
    children.forEach(function (childNode) {
        // @ts-ignore
        var childElement = create.call(_this, childNode, style, args);
        if (childElement) {
            element.add(childElement);
        }
    });
    return element;
}
function renderChildren(children, context, needRender) {
    if (needRender === void 0) { needRender = true; }
    children.forEach(function (child) {
        // child.shouldUpdate = false;
        child.isDirty = false;
        child.insert(context, needRender);
        // ScrollView的子节点渲染交给ScrollView自己，不支持嵌套ScrollView
        return renderChildren(child.children, context, child.type === 'ScrollView' ? false : needRender);
    });
}
/**
 * 将布局树的布局信息加工赋值到渲染树
 */
function layoutChildren(element) {
    element.children.forEach(function (child) {
        child.layoutBox = child.layoutBox || {};
        ['left', 'top', 'width', 'height'].forEach(function (prop) {
            var _a;
            // @ts-ignore
            child.layoutBox[prop] = (_a = child.layout) === null || _a === void 0 ? void 0 : _a[prop];
        });
        if (child.parent) {
            child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
            child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
        }
        else {
            child.layoutBox.absoluteX = child.layoutBox.left;
            child.layoutBox.absoluteY = child.layoutBox.top;
        }
        child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;
        child.layoutBox.originalAbsoluteX = child.layoutBox.absoluteX;
        layoutChildren(child);
    });
}
function none() { }
function iterateTree(element, callback) {
    if (callback === void 0) { callback = none; }
    callback(element);
    element.children.forEach(function (child) {
        iterateTree(child, callback);
    });
}
var repaintChildren = function (children) {
    children.forEach(function (child) {
        child.repaint();
        if (child.type !== 'ScrollView') {
            repaintChildren(child.children);
        }
    });
};
var repaintTree = function (tree) {
    tree.repaint();
    tree.children.forEach(function (child) {
        child.repaint();
        repaintTree(child);
    });
};
function clone(root, element, deep, parent) {
    if (deep === void 0) { deep = true; }
    var Constructor = constructorMap[element.tagName];
    // @ts-ignore
    root.eleCount += 1;
    var args = {
        style: Object.assign({}, element.style),
        idName: element.idName,
        className: element.className,
        // @ts-ignore
        id: root.eleCount,
        dataset: Object.assign({}, element.dataset),
        name: element.tagName,
    };
    if (element instanceof _components_index__WEBPACK_IMPORTED_MODULE_0__.Image) {
        args.src = element.src;
    }
    else if (element instanceof _components_index__WEBPACK_IMPORTED_MODULE_0__.Text || element instanceof _components_index__WEBPACK_IMPORTED_MODULE_0__.BitMapText) {
        args.value = element.value;
    }
    var newElemenet = new Constructor(args);
    newElemenet.root = root;
    // @ts-ignore
    newElemenet.insert(root.renderContext, false);
    newElemenet.observeStyleAndEvent();
    if (parent) {
        parent.add(newElemenet);
    }
    if (deep) {
        element.children.forEach(function (child) {
            clone(root, child, deep, newElemenet);
        });
    }
    return newElemenet;
}


/***/ }),

/***/ "./src/components/bitmaptext.ts":
/*!**************************************!*\
  !*** ./src/components/bitmaptext.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _common_pool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/pool */ "./src/common/pool.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var bitMapPool = new _common_pool__WEBPACK_IMPORTED_MODULE_1__["default"]('bitMapPool');
var BitMapText = /** @class */ (function (_super) {
    __extends(BitMapText, _super);
    function BitMapText(opts) {
        var _this = this;
        var _a = opts.style, style = _a === void 0 ? {} : _a, _b = opts.idName, idName = _b === void 0 ? '' : _b, _c = opts.className, className = _c === void 0 ? '' : _c, _d = opts.value, value = _d === void 0 ? '' : _d, _e = opts.font, font = _e === void 0 ? '' : _e, dataset = opts.dataset;
        _this = _super.call(this, {
            idName: idName,
            className: className,
            style: style,
            dataset: dataset,
        }) || this;
        _this.type = 'BitMapText';
        _this.ctx = null;
        _this.valuesrc = value;
        _this.font = bitMapPool.get(font);
        if (!_this.font) {
            console.error("Missing BitmapFont \"".concat(font, "\", please invoke API \"registBitMapFont\" before using \"BitMapText\""));
        }
        return _this;
    }
    Object.defineProperty(BitMapText.prototype, "value", {
        get: function () {
            return this.valuesrc;
        },
        set: function (newValue) {
            if (newValue !== this.valuesrc) {
                this.valuesrc = newValue;
                this.emit('repaint');
            }
        },
        enumerable: false,
        configurable: true
    });
    BitMapText.prototype.repaint = function () {
        this.render();
    };
    BitMapText.prototype.destroySelf = function () {
        this.root = null;
    };
    BitMapText.prototype.render = function () {
        var _this = this;
        if (!this.font) {
            return;
        }
        if (this.font.ready) {
            this.renderText(this.ctx);
        }
        else {
            this.font.event.on('text__load__done', function () {
                if (!_this.isDestroyed) {
                    _this.renderText(_this.ctx);
                }
            });
        }
    };
    BitMapText.prototype.getTextBounds = function () {
        var style = this.style;
        var _a = style.letterSpacing, letterSpacing = _a === void 0 ? 0 : _a;
        var width = 0;
        for (var i = 0, len = this.value.length; i < len; i++) {
            var char = this.value[i];
            var cfg = this.font.chars[char];
            if (cfg) {
                width += cfg.w;
                if (i < len - 1) {
                    width += letterSpacing;
                }
            }
        }
        return { width: width, height: this.font.lineHeight };
    };
    BitMapText.prototype.renderText = function (ctx) {
        var bounds = this.getTextBounds();
        var defaultLineHeight = this.font.lineHeight;
        ctx.save();
        var _a = this.baseRender(), needStroke = _a.needStroke, originX = _a.originX, originY = _a.originY, drawX = _a.drawX, drawY = _a.drawY;
        var style = this.style;
        var _b = style.width, width = _b === void 0 ? 0 : _b, // 没有设置采用计算出来的宽度
        _c = style.height, // 没有设置采用计算出来的宽度
        height = _c === void 0 ? 0 : _c, // 没有设置则采用计算出来的宽度
        textAlign = style.textAlign, // 文字左右对齐方式
        verticalAlign = style.verticalAlign, _d = style.letterSpacing, letterSpacing = _d === void 0 ? 0 : _d;
        // 没有设置则采用计算出来的高度
        var lineHeight = (style.lineHeight || defaultLineHeight);
        var scaleY = lineHeight / defaultLineHeight;
        var realWidth = scaleY * bounds.width;
        // 如果文字的渲染区域高度小于盒子高度，采用对齐方式
        if (lineHeight < height) {
            if (verticalAlign === 'middle') {
                drawY += (height - lineHeight) / 2;
            }
            else if (verticalAlign === 'bottom') {
                drawY = drawY + height - lineHeight;
            }
        }
        if (width > realWidth) {
            if (textAlign === 'center') {
                drawX += (width - realWidth) / 2;
            }
            else if (textAlign === 'right') {
                drawY += (width - realWidth);
            }
        }
        // 记录上一个字符，方便处理 kerning
        var prevCharCode = null;
        for (var i = 0; i < this.value.length; i++) {
            var char = this.value[i];
            var cfg = this.font.chars[char];
            if (prevCharCode && cfg.kerning[prevCharCode]) {
                drawX += cfg.kerning[prevCharCode];
            }
            if (cfg) {
                ctx.drawImage(this.font.texture, cfg.x, cfg.y, cfg.w, cfg.h, drawX + cfg.offX * scaleY - originX, drawY + cfg.offY * scaleY - originY, cfg.w * scaleY, cfg.h * scaleY);
                drawX += (cfg.xadvance * scaleY + letterSpacing);
                prevCharCode = char;
            }
        }
        if (needStroke) {
            ctx.stroke();
        }
        ctx.translate(-originX, -originY);
        ctx.restore();
    };
    return BitMapText;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BitMapText);


/***/ }),

/***/ "./src/components/button.ts":
/*!**********************************!*\
  !*** ./src/components/button.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./text */ "./src/components/text.ts");
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view */ "./src/components/view.ts");
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/util */ "./src/common/util.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};



/**
 * 按钮的过度类型枚举
 */
var Transition;
(function (Transition) {
    Transition[Transition["NONE"] = 0] = "NONE";
    Transition[Transition["COLOR"] = 1] = "COLOR";
    Transition[Transition["SCALE"] = 2] = "SCALE";
    Transition[Transition["IMAGE"] = 3] = "IMAGE";
})(Transition || (Transition = {}));
var DEFAULTCOLOR = 'rgba(52, 161, 35, 1)';
var PRESSEDCOLOR = 'rgba(52, 161, 35, 0.7)';
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var _this = _super.call(this, {
            idName: idName,
            className: className,
            style: __assign(__assign({ width: 300, height: 60, borderRadius: 10, backgroundColor: '#34a123', justifyContent: 'center', alignItems: 'center' }, style), { ':active': {
                    transform: 'scale(1.05, 1.05)',
                } }),
            dataset: dataset,
        }) || this;
        // 按钮当前是否可点击
        _this.interactableInner = true;
        // 按钮点击交互行为
        _this.transitionInner = Transition.SCALE;
        // 按钮的交互操作为颜色切换
        _this.normalColorInner = DEFAULTCOLOR;
        _this.pressedColorInner = PRESSEDCOLOR;
        // 按钮的交互操作为缩放
        _this.normalScaleInner = 1;
        _this.pressedScaleInner = 0.95;
        // 缩放动画的时长
        _this.scaleDuration = 100;
        // 当前缩放动画是否播放完毕
        _this.scaleDone = true;
        // 缩放动画开始的时间
        _this.timeClick = 0;
        // 缩放动画的 scale 初始值，这并不是固定不变的，当点击结束，可能需要从大到小变换
        _this.fromScale = 1;
        // 缩放动画的 scale 目标值
        _this.toScale = 1;
        // 按钮的交互操作为图片切换
        _this.normalImageInner = '';
        _this.pressedImageInner = '';
        _this.touchstartHandler = function () {
            if (!_this.interactable || _this.transition === Transition.NONE) {
                return;
            }
            if (_this.transition === Transition.SCALE) {
                _this.fromScale = _this.normalScaleInner;
                _this.toScale = _this.pressedScaleInner;
                _this.timeClick = 0;
                _this.scaleDone = false;
            }
            else if (_this.transition === Transition.COLOR) {
                _this.style.backgroundColor = _this.pressedColorInner;
            }
        };
        _this.touchendHandler = function () {
            if (!_this.interactable || _this.transition === Transition.NONE) {
                return;
            }
            if (_this.transition === Transition.SCALE) {
                _this.fromScale = _this.renderForLayout.scaleX || 1; // 当前的缩放值
                _this.toScale = _this.normalScaleInner;
                _this.timeClick = 0;
                _this.scaleDone = false;
            }
            else if (_this.transition === Transition.COLOR) {
                _this.style.backgroundColor = _this.normalColorInner;
            }
        };
        _this.update = function (dt) {
            if (_this.scaleDone) {
                return;
            }
            _this.timeClick += dt;
            var ratio = 1;
            ratio = _this.timeClick / _this.scaleDuration;
            if (ratio > 1) {
                ratio = 1;
            }
            var scale = (0,_common_util__WEBPACK_IMPORTED_MODULE_2__.lerp)(_this.fromScale, _this.toScale, ratio);
            var transform = "scale(".concat(scale, ", ").concat(scale, ")");
            _this.style.transform = transform;
            _this.label.style.transform = transform;
            if (ratio === 1) {
                _this.scaleDone = true;
            }
        };
        _this.label = new _text__WEBPACK_IMPORTED_MODULE_0__["default"]({
            style: {
                color: style.color || '#ffffff',
                fontSize: style.fontSize || 30,
            },
            value: value || 'button',
        });
        _this.appendChild(_this.label);
        return _this;
        // 绑定默认的事件处理程序
        // this.on('touchstart', this.touchstartHandler);
        // this.on('touchend', this.touchendHandler);
    }
    /**
     * Button 对伪类的 transform 属性做了特殊处理，具备动效
     */
    Button.prototype.activeHandler = function (e) {
        if (this.style[':active']) {
            console.log(this.style[':active']);
            this.cacheStyle = Object.assign({}, this.style);
            // Object.assign(this.style, this.style[':active']);
            var activeStyle = this.style[':active'];
            Object.assign(this.style, activeStyle);
            // if (activeStyle.transform) {
            //   let res = parseTransform(activeStyle.transform);
            //   console.log('transform', res);
            //   if (res.scaleX !== undefined || res.scaleY !== undefined) {
            //     this.fromScale = this.renderForLayout.scaleX || 1;
            //     this.toScale = res.scaleX || res.scaleY || 1;
            //     this.timeClick = 0;
            //     this.scaleDone = false;
            //   }
            // }
        }
    };
    Button.prototype.deactiveHandler = function (e) {
        var _this = this;
        console.log(11, JSON.stringify(this.cacheStyle));
        if (this.style[':active']) {
            var activeStyle = this.style[':active'];
            Object.keys(activeStyle).forEach(function (key) {
                if (_this.cacheStyle[key]) {
                    // @ts-ignore
                    _this.style[key] = _this.cacheStyle[key];
                }
                else {
                    delete _this.style[key];
                }
            });
        }
    };
    Button.prototype.afterCreate = function () {
        this.label.root = this.root;
        // @ts-ignore
        this.root.ticker.add(this.update);
    };
    Button.prototype.destroySelf = function () {
        // @ts-ignore
        this.root.ticker.remove(this.update);
        this.isDestroyed = true;
        this.children = [];
        this.root = null;
    };
    Object.defineProperty(Button.prototype, "interactable", {
        /**
         * 当前按钮是否可交互，如果不可交互，点击没反应
         */
        get: function () {
            return this.interactableInner;
        },
        set: function (val) {
            this.interactable = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "transition", {
        get: function () {
            return this.transitionInner;
        },
        set: function (val) {
            this.transitionInner = val;
        },
        enumerable: false,
        configurable: true
    });
    return Button;
}(_view__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Button);


/***/ }),

/***/ "./src/components/canvas.ts":
/*!**********************************!*\
  !*** ./src/components/canvas.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env */ "./src/env.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Canvas = /** @class */ (function (_super) {
    __extends(Canvas, _super);
    function Canvas(opts) {
        var _this = this;
        var _a = opts.style, style = _a === void 0 ? {} : _a, _b = opts.idName, idName = _b === void 0 ? '' : _b, _c = opts.className, className = _c === void 0 ? '' : _c, dataset = opts.dataset, _d = opts.width, width = _d === void 0 ? 100 : _d, _e = opts.height, height = _e === void 0 ? 100 : _e, _f = opts.autoCreateCanvas, autoCreateCanvas = _f === void 0 ? false : _f;
        _this = _super.call(this, {
            idName: idName,
            className: className,
            dataset: dataset,
            style: style,
        }) || this;
        _this.canvasInstance = null;
        /**
         * 微信小游戏场景下，sharedCanvas 实例不方便自动创建，提供 setter 手动设置
         */
        if (autoCreateCanvas) {
            _this.canvasInstance = _env__WEBPACK_IMPORTED_MODULE_1__["default"].createCanvas();
            _this.canvasInstance.width = Number(width);
            _this.canvasInstance.height = Number(height);
        }
        return _this;
    }
    Object.defineProperty(Canvas.prototype, "canvas", {
        get: function () {
            return this.canvasInstance;
        },
        set: function (cvs) {
            this.canvasInstance = cvs;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.update = function () {
        this.root.emit('repaint');
    };
    Canvas.prototype.repaint = function () {
        this.render();
    };
    // 子类填充实现
    Canvas.prototype.destroySelf = function () {
        this.isDestroyed = true;
        this.root = null;
        this.canvasInstance = null;
    };
    Canvas.prototype.render = function () {
        if (!this.canvasInstance) {
            return;
        }
        var ctx = this.ctx;
        ctx.save();
        var _a = this.baseRender(), needStroke = _a.needStroke, originX = _a.originX, originY = _a.originY, drawX = _a.drawX, drawY = _a.drawY, width = _a.width, height = _a.height;
        // 自定义渲染逻辑 开始
        ctx.drawImage(this.canvasInstance, drawX - originX, drawY - originY, width, height);
        // 自定义渲染逻辑 结束
        if (needStroke) {
            ctx.stroke();
        }
        if (this.renderForLayout.rotate) {
            ctx.translate(-originX, -originY);
        }
        ctx.restore();
    };
    return Canvas;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Canvas);


/***/ }),

/***/ "./src/components/elements.ts":
/*!************************************!*\
  !*** ./src/components/elements.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getElementById: () => (/* binding */ getElementById),
/* harmony export */   getElementsByClassName: () => (/* binding */ getElementsByClassName),
/* harmony export */   getElementsById: () => (/* binding */ getElementsById),
/* harmony export */   setDirty: () => (/* binding */ setDirty)
/* harmony export */ });
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style */ "./src/components/style.ts");
/* harmony import */ var _common_rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/rect */ "./src/common/rect.ts");
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/imageManager */ "./src/common/imageManager.ts");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tiny-emitter */ "./node_modules/tiny-emitter/index.js");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _styleParser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styleParser */ "./src/components/styleParser.ts");
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/* eslint-disable no-param-reassign */





function getElementsById(tree, list, id) {
    if (list === void 0) { list = []; }
    tree.children.forEach(function (child) {
        if (child.idName === id) {
            list.push(child);
        }
        if (child.children.length) {
            getElementsById(child, list, id);
        }
    });
    return list;
}
function getElementById(tree, id) {
    var list = getElementsById(tree, [], id);
    return (list === null || list === void 0 ? void 0 : list[0]) || null;
}
function getElementsByClassName(tree, list, className) {
    if (list === void 0) { list = []; }
    tree.children.forEach(function (child) {
        if ((child.classNameList || child.className.split(/\s+/)).indexOf(className) > -1) {
            list.push(child);
        }
        if (child.children.length) {
            getElementsByClassName(child, list, className);
        }
    });
    return list;
}
/**
 * 将当前节点置脏，Layout 的 ticker 会根据这个标记位执行 reflow
 */
function setDirty(ele, reason) {
    // for debug
    // console.log('[Layout] trigger reflow cause', ele, reason);
    ele.isDirty = true;
    var parent = ele.parent;
    while (parent) {
        parent.isDirty = true;
        parent = parent.parent;
    }
}
// 全局事件管道
var EE = new (tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default())();
var uuid = 0;
var toEventName = function (event, id) {
    var elementEvent = [
        'click',
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
    ];
    if (elementEvent.indexOf(event) !== -1) {
        return "element-".concat(id, "-").concat(event);
    }
    return "element-".concat(id, "-").concat(event);
};
;
var Element = /** @class */ (function () {
    function Element(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.id, id = _e === void 0 ? uuid += 1 : _e, _f = _a.dataset, dataset = _f === void 0 ? {} : _f;
        /**
         * 子节点列表
         */
        this.children = [];
        /**
         * 当前节点的父节点
         */
        this.parent = null;
        /**
         * 当前节点所在节点树的根节点，指向 Layout
         */
        this.root = null;
        // public EE: any;
        /**
         * 用于标识当前节点是否已经执行销毁逻辑，销毁之后原先的功能都会异常，一般业务侧不用关心这个
         */
        this.isDestroyed = false;
        this.ctx = null;
        /**
         * 置脏标记位，目前当修改会影响布局属性的时候，会自动置脏
         */
        this.isDirty = false;
        /**
         * css-layout 节点属性，业务侧无需关心
         */
        this.shouldUpdate = false;
        this.renderForLayout = {};
        this.id = id;
        this.idName = idName;
        this.className = className;
        this.layoutBox = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            absoluteX: 0,
            absoluteY: 0,
            originalAbsoluteX: 0,
            originalAbsoluteY: 0,
        };
        this.dataset = dataset;
        if (typeof style.backgroundImage === 'string') {
            this.backgroundImageSetHandler(style.backgroundImage);
        }
        if (typeof style.transform === 'string') {
            this.renderForLayout = (0,_styleParser__WEBPACK_IMPORTED_MODULE_4__.parseTransform)(style.transform);
        }
        this.originStyle = style;
        this.style = style;
        this.rect = null;
        this.classNameList = null;
    }
    Element.prototype.styleChangeHandler = function (prop, val) {
    };
    Element.prototype.backgroundImageSetHandler = function (backgroundImage) {
        var _this = this;
        var url = (0,_styleParser__WEBPACK_IMPORTED_MODULE_4__.backgroundImageParser)(backgroundImage);
        if (url) {
            _common_imageManager__WEBPACK_IMPORTED_MODULE_2__["default"].loadImage(url, function (img) {
                if (!_this.isDestroyed) {
                    _this.backgroundImage = img;
                    // 当图片加载完成，实例可能已经被销毁了
                    _this.root && _this.root.emit('repaint');
                }
            });
        }
    };
    /**
     * 监听属性的变化判断是否需要执行 reflow、repaint 操作
     * 经过测试，Object.defineProperty 是一个比较慢的方法， 特别是属性比较多的时候
     * 因此会先判断是否支持 Proxy，iMac (Retina 5K, 27-inch, 2017)测试结果
     * 总共 312 个节点，observeStyleAndEvent总耗时为：
     * Proxy: 3ms
     * Object.defineProperty: 20ms
     */
    Element.prototype.observeStyleAndEvent = function () {
        var _this = this;
        if (typeof Proxy === 'function') {
            var ele_1 = this;
            this.style = new Proxy(this.originStyle, {
                get: function (target, prop, receiver) {
                    return Reflect.get(target, prop, receiver);
                },
                set: function (target, prop, val, receiver) {
                    var _a, _b;
                    var oldVal = Reflect.get(target, prop, receiver);
                    if (typeof prop === 'string' && oldVal !== val) {
                        ele_1.styleChangeHandler(prop, val);
                        if (prop === 'transform') {
                            ele_1.renderForLayout = (0,_styleParser__WEBPACK_IMPORTED_MODULE_4__.parseTransform)(val);
                            (_a = ele_1.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
                        }
                        if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(prop) > -1) {
                            setDirty(ele_1, "change prop ".concat(prop, " from ").concat(oldVal, " to ").concat(val));
                        }
                        else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(prop) > -1) {
                            (_b = ele_1.root) === null || _b === void 0 ? void 0 : _b.emit('repaint');
                        }
                        else if (prop === 'backgroundImage') {
                            ele_1.backgroundImageSetHandler(val);
                        }
                    }
                    return Reflect.set(target, prop, val, receiver);
                },
            });
        }
        else {
            var innerStyle_1 = Object.assign({}, this.style);
            _style__WEBPACK_IMPORTED_MODULE_0__.allStyles.forEach(function (key) {
                Object.defineProperty(_this.style, key, {
                    configurable: true,
                    enumerable: true,
                    get: function () { return innerStyle_1[key]; },
                    set: function (value) {
                        var _a;
                        if (value !== innerStyle_1[key]) {
                            innerStyle_1[key] = value;
                            if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(key) > -1) {
                                setDirty(_this, "change prop ".concat(key, " to ").concat(value));
                            }
                            else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(key) > -1) {
                                (_a = _this.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
                            }
                            else if (key === 'backgroundImage') {
                                _this.backgroundImageSetHandler(value);
                            }
                        }
                    },
                });
            });
        }
        // 事件冒泡逻辑
        ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach(function (eventName) {
            _this.on(eventName, function (e, touchMsg) {
                // 处理伪类逻辑
                if (eventName === 'touchstart') {
                    _this.activeHandler(e);
                }
                else if (eventName === 'touchend' || eventName === 'touchcancel') {
                    _this.deactiveHandler(e);
                }
                _this.parent && _this.parent.emit(eventName, e, touchMsg);
            });
        });
        this.classNameList = this.className.split(/\s+/);
    };
    Element.prototype.activeHandler = function (e) {
        if (this.style[':active']) {
            console.log(this.style[':active']);
            Object.assign(this.style, this.style[':active']);
        }
    };
    Element.prototype.deactiveHandler = function (e) {
    };
    /**
     * 节点重绘接口，子类填充实现
     */
    Element.prototype.repaint = function () { };
    /**
     * 节点渲染接口子类填充实现
     */
    Element.prototype.render = function () { };
    /**
     * 节点构造函数初始化后调用的方法，子类填充实现
     */
    Element.prototype.afterCreate = function () { };
    /**
     * 参照 Web 规范：https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
     */
    Element.prototype.getBoundingClientRect = function () {
        if (!this.rect) {
            this.rect = new _common_rect__WEBPACK_IMPORTED_MODULE_1__["default"](this.layoutBox.absoluteX, this.layoutBox.absoluteY, this.layoutBox.width, this.layoutBox.height);
        }
        this.rect.set(this.layoutBox.absoluteX, this.layoutBox.absoluteY, this.layoutBox.width, this.layoutBox.height);
        return this.rect;
    };
    /**
     * 查询当前节点树下，idName 为给定参数的的节点
     * 节点的 id 唯一性 Layout 并不保证，但这里只返回符合条件的第一个节点
     */
    Element.prototype.getElementById = function (id) {
        return getElementById(this, id);
    };
    /**
     * 查询当前节点树下，idName 为给定参数的的节点
     * 节点的 id 唯一性 Layout 并不保证，这里返回符合条件的节点集合
     */
    Element.prototype.getElementsById = function (id) {
        return getElementsById(this, [], id);
    };
    /**
     * 查询当前节点树下，className 包含给定参数的的节点集合
     */
    Element.prototype.getElementsByClassName = function (className) {
        return getElementsByClassName(this, [], className);
    };
    /**
     * 布局计算完成，准备执行渲染之前执行的操作，不同的子类有不同的行为
     * 比如 ScrollView 在渲染之前还需要初始化滚动相关的能力
     *
     */
    Element.prototype.insert = function (ctx, needRender) {
        this.shouldUpdate = false;
        this.ctx = ctx;
        if (needRender) {
            this.render();
        }
    };
    /**
     * 节点解除事件绑定
     */
    Element.prototype.unBindEvent = function () {
        var _this = this;
        [
            'touchstart',
            'touchmove',
            'touchcancel',
            'touchend',
            'click',
            'repaint',
        ].forEach(function (eventName) {
            _this.off(eventName);
        });
    };
    /**
     * 将节点从当前节点树中删除
     */
    Element.prototype.remove = function () {
        var parent = this.parent;
        if (!parent) {
            return;
        }
        var index = parent.children.indexOf(this);
        if (index !== -1) {
            parent.children.splice(index, 1);
            this.unBindEvent();
            setDirty(this, "remove");
            this.parent = null;
            this.ctx = null;
        }
        else {
            console.warn('[Layout] this element has been removed');
        }
    };
    Element.prototype.setDirty = function () {
        setDirty(this);
    };
    // 子类填充实现
    Element.prototype.destroySelf = function () {
    };
    // 子类填充实现
    Element.prototype.destroy = function () {
        this.unBindEvent();
        this.isDestroyed = true;
        // this.EE = null;
        this.parent = null;
        this.ctx = null;
        // element 在画布中的位置和尺寸信息
        // this.layoutBox = null;
        // this.style = null;
        this.className = '';
        this.classNameList = null;
    };
    Element.prototype.add = function (element) {
        element.parent = this;
        // element.parentId = this.id;
        this.children.push(element);
    };
    /**
     * 将一个节点添加作为当前节点的子节点
     */
    Element.prototype.appendChild = function (element) {
        this.add(element);
        setDirty(this, "appendChild ".concat(element));
    };
    /**
     * 移除给定的子节点，只有一级节点能够移除
     */
    Element.prototype.removeChild = function (element) {
        var index = this.children.indexOf(element);
        if (index !== -1) {
            element.remove();
            setDirty(this, "removeChild ".concat(element));
        }
        else {
            console.warn('[Layout] the element to be removed is not a child of this element');
        }
    };
    Element.prototype.emit = function (event) {
        var theArgs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            theArgs[_i - 1] = arguments[_i];
        }
        EE.emit.apply(EE, __spreadArray([toEventName(event, this.id)], theArgs, false));
    };
    Element.prototype.on = function (event, callback) {
        EE.on(toEventName(event, this.id), callback);
    };
    Element.prototype.once = function (event, callback) {
        EE.once(toEventName(event, this.id), callback);
    };
    Element.prototype.off = function (event, callback) {
        EE.off(toEventName(event, this.id), callback);
    };
    /**
     * 渲染 border 相关能力抽象，子类可按需调用
     * 由于支持了rotate特性，所以所有的渲染都需要方向减去transform的中间点
     */
    Element.prototype.renderBorder = function (ctx, originX, originY) {
        if (originX === void 0) { originX = 0; }
        if (originY === void 0) { originY = 0; }
        var style = this.style || {};
        var radius = style.borderRadius || 0;
        var _a = style.borderWidth, borderWidth = _a === void 0 ? 0 : _a;
        var tlr = style.borderTopLeftRadius || radius;
        var trr = style.borderTopRightRadius || radius;
        var bbr = style.borderBottomLeftRadius || radius;
        var brr = style.borderBottomRightRadius || radius;
        var box = this.layoutBox;
        var _b = style.borderColor, borderColor = _b === void 0 ? '' : _b;
        var x = box.absoluteX;
        var y = box.absoluteY;
        var width = box.width, height = box.height;
        var hasRadius = radius || tlr || trr || bbr || brr;
        // borderWidth 和 radius 都没有，不需要执行后续逻辑，提升性能
        if (!borderWidth && !hasRadius) {
            return { needClip: false, needStroke: false };
        }
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        // 左上角的点
        ctx.beginPath();
        ctx.moveTo(x + tlr - originX, y - originY);
        ctx.lineTo(x + width - trr - originX, y - originY);
        // 右上角的圆角
        ctx.arcTo(x + width - originX, y - originY, x + width - originX, y + trr - originY, trr);
        // 右下角的点
        ctx.lineTo(x + width - originX, y + height - brr - originY);
        // 右下角的圆角
        ctx.arcTo(x + width - originX, y + height - originY, x + width - brr - originX, y + height - originY, brr);
        // 左下角的点
        ctx.lineTo(x + bbr - originX, y + height - originY);
        // 左下角的圆角
        ctx.arcTo(x - originX, y + height - originY, x - originX, y + height - bbr - originY, bbr);
        // 左上角的点
        ctx.lineTo(x - originX, y + tlr - originY);
        // 左上角的圆角
        ctx.arcTo(x - originX, y - originY, x + tlr - originX, y - originY, tlr);
        ctx.closePath();
        return { needClip: !!hasRadius, needStroke: !!borderWidth };
    };
    /**
     * 每个子类都会有自己的渲染逻辑，但他们都有些通用的处理，比如透明度、旋转和border的处理，baseRender 用于处理通用的渲染逻辑
     */
    Element.prototype.baseRender = function (type) {
        var ctx = this.ctx;
        var style = this.style;
        var box = this.layoutBox;
        var drawX = box.absoluteX, drawY = box.absoluteY, width = box.width, height = box.height;
        if (style.opacity !== undefined) {
            ctx.globalAlpha = style.opacity;
        }
        var originX = 0;
        var originY = 0;
        if (this.renderForLayout.rotate !== undefined || this.renderForLayout.scaleX !== undefined || this.renderForLayout.scaleY !== undefined) {
            originX = drawX + box.width / 2;
            originY = drawY + box.height / 2;
            ctx.translate(originX, originY);
        }
        /**
         * 请注意，这里暂时仅支持没有子节点的元素发生旋转，如果父节点旋转了子节点并不会跟着旋转
         * 要实现父节点带动子节点旋转的能力，需要引入矩阵库，对代码改动也比较大，暂时不做改造。
         */
        if (this.renderForLayout.rotate !== undefined) {
            ctx.rotate(this.renderForLayout.rotate);
        }
        if (this.renderForLayout.scaleX !== undefined || this.renderForLayout.scaleY !== undefined) {
            // console.log(this.renderForLayout.rotate, this.renderForLayout.scaleX !== undefined ? this.renderForLayout.scaleX : 1 , this.renderForLayout.scaleY !== undefined ? this.renderForLayout.scaleY : 1)
            ctx.scale(this.renderForLayout.scaleX !== undefined ? this.renderForLayout.scaleX : 1, this.renderForLayout.scaleY !== undefined ? this.renderForLayout.scaleY : 1);
        }
        if (style.borderColor) {
            ctx.strokeStyle = style.borderColor;
        }
        ctx.lineWidth = style.borderWidth || 0;
        // for clip
        var _a = this.renderBorder(ctx, originX, originY), needClip = _a.needClip, needStroke = _a.needStroke;
        if (needClip) {
            ctx.clip();
        }
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
        }
        return { needStroke: needStroke, needClip: needClip, originX: originX, originY: originY, drawX: drawX, drawY: drawY, width: width, height: height };
    };
    return Element;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Element);


/***/ }),

/***/ "./src/components/image.ts":
/*!*********************************!*\
  !*** ./src/components/image.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/imageManager */ "./src/common/imageManager.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var Image = /** @class */ (function (_super) {
    __extends(Image, _super);
    function Image(opts) {
        var _this = this;
        var _a = opts.style, style = _a === void 0 ? {} : _a, _b = opts.idName, idName = _b === void 0 ? '' : _b, _c = opts.className, className = _c === void 0 ? '' : _c, _d = opts.src, src = _d === void 0 ? '' : _d, dataset = opts.dataset;
        _this = _super.call(this, {
            idName: idName,
            className: className,
            dataset: dataset,
            style: style,
        }) || this;
        _this.type = 'Image';
        _this.imgsrc = src;
        _this.img = _common_imageManager__WEBPACK_IMPORTED_MODULE_1__["default"].loadImage(_this.src, function (img, fromCache) {
            var _a;
            if (fromCache) {
                _this.img = img;
            }
            else {
                if (!_this.isDestroyed) {
                    _this.img = img;
                    // 当图片加载完成，实例可能已经被销毁了
                    (_a = _this.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
                }
            }
        });
        return _this;
    }
    Object.defineProperty(Image.prototype, "src", {
        get: function () {
            return this.imgsrc;
        },
        set: function (newValue) {
            var _this = this;
            if (newValue !== this.imgsrc) {
                this.imgsrc = newValue;
                _common_imageManager__WEBPACK_IMPORTED_MODULE_1__["default"].loadImage(this.src, function (img) {
                    var _a;
                    if (!_this.isDestroyed) {
                        _this.img = img;
                        // 当图片加载完成，实例可能已经被销毁了
                        (_a = _this.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
                    }
                });
            }
        },
        enumerable: false,
        configurable: true
    });
    Image.prototype.repaint = function () {
        this.render();
    };
    // 子类填充实现
    Image.prototype.destroySelf = function () {
        this.isDestroyed = true;
        this.img = null;
        this.src = '';
        this.root = null;
    };
    Image.prototype.render = function () {
        var _a;
        if (!this.img || !((_a = this.img) === null || _a === void 0 ? void 0 : _a.complete)) {
            return;
        }
        var ctx = this.ctx;
        ctx.save();
        var _b = this.baseRender(), needStroke = _b.needStroke, needClip = _b.needClip, originX = _b.originX, originY = _b.originY, drawX = _b.drawX, drawY = _b.drawY, width = _b.width, height = _b.height;
        // 自定义渲染逻辑 开始
        ctx.drawImage(this.img, drawX - originX, drawY - originY, width, height);
        // 自定义渲染逻辑 结束
        if (needClip) {
            this.renderBorder(ctx, originX, originY);
        }
        if (needStroke) {
            ctx.stroke();
        }
        ctx.translate(-originX, -originY);
        ctx.restore();
    };
    return Image;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);


/***/ }),

/***/ "./src/components/index.ts":
/*!*********************************!*\
  !*** ./src/components/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BitMapText: () => (/* reexport safe */ _bitmaptext__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Button: () => (/* reexport safe */ _button__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   Canvas: () => (/* reexport safe */ _canvas__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   Element: () => (/* reexport safe */ _elements__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   Image: () => (/* reexport safe */ _image__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   ScrollView: () => (/* reexport safe */ _scrollview__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   Text: () => (/* reexport safe */ _text__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   View: () => (/* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/components/view.ts");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image */ "./src/components/image.ts");
/* harmony import */ var _text__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./text */ "./src/components/text.ts");
/* harmony import */ var _scrollview__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scrollview */ "./src/components/scrollview.ts");
/* harmony import */ var _bitmaptext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./bitmaptext */ "./src/components/bitmaptext.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./canvas */ "./src/components/canvas.ts");
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./button */ "./src/components/button.ts");











/***/ }),

/***/ "./src/components/scrollbar.ts":
/*!*************************************!*\
  !*** ./src/components/scrollbar.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScrollBarDirection: () => (/* binding */ ScrollBarDirection),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/components/view.ts");
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/util */ "./src/common/util.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var ScrollBarDirection;
(function (ScrollBarDirection) {
    ScrollBarDirection[ScrollBarDirection["Vertival"] = 0] = "Vertival";
    ScrollBarDirection[ScrollBarDirection["Horizontal"] = 1] = "Horizontal";
})(ScrollBarDirection || (ScrollBarDirection = {}));
/**
 * 根据滚动条的尺寸、ScrollView 视口和滚动窗口尺寸、滚动防线信息确认滚动条的样式信息
 */
function updateStyleFromDimensions(width, direction, dimensions) {
    var isVertical = direction === ScrollBarDirection.Vertival;
    var scrollWidth = dimensions.width, scrollHeight = dimensions.height, contentWidth = dimensions.contentWidth, contentHeight = dimensions.contentHeight;
    return {
        width: isVertical ? width : scrollWidth * (scrollWidth / contentWidth),
        height: isVertical ? scrollHeight * (scrollHeight / contentHeight) : width,
        left: isVertical ? scrollWidth - width : 0,
        top: isVertical ? 0 : scrollHeight - width,
    };
}
function checkNeedHideScrollBar(direction, dimensions) {
    return !!(direction === ScrollBarDirection.Vertival && dimensions.maxScrollTop === 0
        || direction === ScrollBarDirection.Horizontal && dimensions.maxScrollLeft === 0);
}
/**
 * 滚动组件的滚动条组件，滚动条本身也是Layout的一个节点
 */
var ScrollBar = /** @class */ (function (_super) {
    __extends(ScrollBar, _super);
    function ScrollBar(_a) {
        var _this = this;
        var direction = _a.direction, dimensions = _a.dimensions, _b = _a.backgroundColor, backgroundColor = _b === void 0 ? 'rgba(162, 162, 162, 1)' : _b, _c = _a.width, width = _c === void 0 ? 16 : _c;
        var style = Object.assign({
            backgroundColor: backgroundColor,
            position: 'absolute',
            borderRadius: width / 2,
            opacity: 0,
        }, updateStyleFromDimensions(width, direction, dimensions));
        _this = _super.call(this, {
            style: style,
        }) || this;
        // 滚动完毕后一段时间后自动隐藏
        _this.autoHide = true;
        // 滚动完毕后自动隐藏时间
        _this.autoHideTime = 2000;
        _this.autoHideDelayTime = 1500;
        _this.autoHideRemainingTime = 0;
        _this.innerWidth = 16;
        _this.isHide = false;
        _this.currLeft = 0;
        _this.currTop = 0;
        _this.update = function (dt) {
            if (!_this.autoHide || _this.autoHideRemainingTime <= 0 || _this.isHide) {
                return;
            }
            _this.autoHideRemainingTime -= dt;
            if (_this.autoHideRemainingTime <= _this.autoHideTime) {
                _this.autoHideRemainingTime = Math.max(0, _this.autoHideRemainingTime);
                _this.style.opacity = _this.style.opacity * (_this.autoHideRemainingTime / _this.autoHideTime);
            }
        };
        _this.direction = direction;
        _this.dimensions = dimensions;
        _this.innerWidth = width;
        if (checkNeedHideScrollBar(direction, dimensions)) {
            _this.hide();
        }
        return _this;
    }
    Object.defineProperty(ScrollBar.prototype, "width", {
        get: function () {
            return this.innerWidth;
        },
        /**
         * 滚动条的粗细，因为要兼容横竖滚动，所以 style.width 在不同模式下代表的意思不一样
         * 因此通过单独的 width 属性来代表滚动条的粗细
         */
        set: function (value) {
            if (value !== this.innerWidth) {
                this.innerWidth = value;
            }
            this.style.borderRadius = this.innerWidth / 2;
            this.setDimensions(this.dimensions);
        },
        enumerable: false,
        configurable: true
    });
    ScrollBar.prototype.init = function () {
        var _this = this;
        if (!this.root) {
            console.warn('[Layout]: please set root for scrollbar');
        }
        else {
            // @ts-ignore
            this.root.ticker.add(this.update, true);
            this.root.on('before_reflow', function () {
                // console.log('before_reflow')
                var _a = _this.calculteScrollValue(_this.currLeft, _this.currTop), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
                // console.log(this, scrollLeft, scrollTop)
                if (_this.direction === ScrollBarDirection.Vertival) {
                    _this.style.top = scrollTop;
                }
                else {
                    _this.style.left = scrollLeft;
                }
            });
        }
    };
    ScrollBar.prototype.hide = function () {
        this.isHide = true;
        this.style.opacity = 0;
    };
    ScrollBar.prototype.show = function () {
        this.isHide = false;
        this.style.opacity = 1;
    };
    /**
     * 根据 ScrollView 容器宽高和实际内容宽高决定滚动条的位置和尺寸信息
     * 但核心需要考虑的情况是：
     * 1. 在不断地 reflow 过程中，ScrollBar 也会存在需要切换展示和隐藏的情况
     * 2. reflow 之后，ScrollBar 的位置不是简单的设置为 ScrollView 顶部和左边，还可能是滚动了一段距离后执行的 reflow
     */
    ScrollBar.prototype.setDimensions = function (dimensions) {
        var style = updateStyleFromDimensions(this.width, this.direction, dimensions);
        Object.assign(this.style, style);
        if (checkNeedHideScrollBar(this.direction, dimensions)) {
            this.hide();
        }
        else if (this.isHide) {
            this.show();
        }
        this.dimensions = dimensions;
        // 已经滚动过一段距离的情况，重新计算新的滚动位置
        var _a = this.calculteScrollValue(dimensions.scrollLeft, dimensions.scrollTop), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
        if (this.direction === ScrollBarDirection.Vertival) {
            this.style.top = scrollTop;
        }
        else {
            this.style.left = scrollLeft;
        }
        this.autoHideRemainingTime = this.autoHideTime + this.autoHideDelayTime;
    };
    ScrollBar.prototype.calculteScrollValue = function (left, top) {
        var scrollLeft = 0;
        var scrollTop = 0;
        if (this.direction === ScrollBarDirection.Vertival) {
            var canScrollPercent = 1 - this.dimensions.height / this.dimensions.contentHeight;
            // 滚动条最大滚动高度
            var scrollBarMaxScrollTop = this.dimensions.height * canScrollPercent;
            var percent = top / this.dimensions.maxScrollTop;
            var percentTop = scrollBarMaxScrollTop * percent;
            scrollTop = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.clamp)(percentTop, 0, scrollBarMaxScrollTop);
        }
        else {
            var canScrollPercent = 1 - this.dimensions.width / this.dimensions.contentWidth;
            var scrollBarMaxScrollLeft = this.dimensions.width * canScrollPercent;
            var percent = left / this.dimensions.maxScrollLeft;
            scrollLeft = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.clamp)(scrollBarMaxScrollLeft * percent, 0, scrollBarMaxScrollLeft);
        }
        return { scrollLeft: scrollLeft, scrollTop: scrollTop };
    };
    ScrollBar.prototype.onScroll = function (left, top) {
        if (this.isHide) {
            return;
        }
        this.currLeft = left;
        this.currTop = top;
        var _a = this.calculteScrollValue(left, top), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
        if (this.direction === ScrollBarDirection.Vertival) {
            this.layoutBox.absoluteY = this.parent.layoutBox.originalAbsoluteY + scrollTop;
        }
        else {
            this.layoutBox.absoluteX = this.parent.layoutBox.originalAbsoluteX + scrollLeft;
        }
        if (this.autoHide) {
            // this.autoHideRemainingTime = this.autoHideTime;
            this.autoHideRemainingTime = this.autoHideTime + this.autoHideDelayTime;
        }
        this.style.opacity = 1;
    };
    ScrollBar.prototype.destroySelf = function () {
        // @ts-ignore
        this.root.ticker.remove(this.update, true);
        this.isDestroyed = true;
        this.root = null;
    };
    return ScrollBar;
}(_view__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollBar);


/***/ }),

/***/ "./src/components/scrollview.ts":
/*!**************************************!*\
  !*** ./src/components/scrollview.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view */ "./src/components/view.ts");
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/util */ "./src/common/util.ts");
/* harmony import */ var _libs_scroller_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../libs/scroller/index.js */ "./src/libs/scroller/index.js");
/* harmony import */ var _common_vd__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/vd */ "./src/common/vd.ts");
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _scrollbar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./scrollbar */ "./src/components/scrollbar.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../env */ "./src/env.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */







var dpr = _env__WEBPACK_IMPORTED_MODULE_6__["default"].getDevicePixelRatio();
;
var ScrollView = /** @class */ (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, scrollX = _a.scrollX, scrollY = _a.scrollY, dataset = _a.dataset;
        var _this = _super.call(this, {
            style: style,
            idName: idName,
            dataset: dataset,
            className: className,
        }) || this;
        _this.scrollTop = 0;
        _this.scrollLeft = 0;
        _this.hasEventBind = false;
        _this.currentEvent = null;
        _this.type = 'ScrollView';
        _this.vertivalScrollbar = null;
        _this.horizontalScrollbar = null;
        _this.scrollYProp = scrollY;
        _this.innerScrollerOption = {
            scrollingX: !!scrollX,
            scrollingY: !!scrollY,
        };
        return _this;
    }
    Object.defineProperty(ScrollView.prototype, "scrollHeight", {
        /**
         * 获取滚动列表内所有元素的高度和
         * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
         */
        get: function () {
            var maxHeight = 0;
            this.children.forEach(function (item) {
                if (!(item instanceof _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"])) {
                    maxHeight = Math.max(maxHeight, item.layoutBox.top + item.layoutBox.height);
                }
            });
            return maxHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollWidth", {
        get: function () {
            var maxWidth = 0;
            this.children.forEach(function (item) {
                if (!(item instanceof _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"])) {
                    maxWidth = Math.max(maxWidth, item.layoutBox.left + item.layoutBox.width);
                }
            });
            return maxWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollX", {
        get: function () {
            return this.innerScrollerOption.scrollingX;
        },
        set: function (value) {
            this.scrollerObj.scrollTo(0, this.scrollTop, true, 1);
            this.scrollerOption = {
                scrollingX: value,
            };
            this.updateScrollBar('scrollX', 'horizontalScrollbar');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollY", {
        get: function () {
            return this.innerScrollerOption.scrollingY;
        },
        set: function (value) {
            if (value !== this.scrollY) {
                this.scrollerObj.scrollTo(this.scrollLeft, 0, true, 1);
                this.scrollerOption = {
                    scrollingY: value,
                };
                this.scrollerObj && this.updateScrollBar('scrollY', 'vertivalScrollbar');
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollerOption", {
        get: function () {
            return this.innerScrollerOption;
        },
        set: function (value) {
            Object.assign(this.innerScrollerOption, value);
            if (this.scrollerObj) {
                Object.assign(this.scrollerObj.options, this.scrollerOption);
            }
        },
        enumerable: false,
        configurable: true
    });
    ScrollView.prototype.repaint = function () {
        this.scrollRender();
    };
    ScrollView.prototype.destroySelf = function () {
        // this.touch = null;
        this.isDestroyed = true;
        this.ctx = null;
        this.children = [];
        this.root.off('touchend');
        this.root = null;
    };
    ScrollView.prototype.renderTreeWithTop = function (tree) {
        var _this = this;
        if (!(tree instanceof _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"])) {
            tree.render();
        }
        tree.children.forEach(function (child) {
            _this.renderTreeWithTop(child);
        });
    };
    ScrollView.prototype.clear = function () {
        var box = this.layoutBox;
        this.ctx.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
    };
    ScrollView.prototype.scrollRender = function () {
        var _this = this;
        var _a, _b;
        var box = this.layoutBox;
        var startX = box.absoluteX, startY = box.absoluteY, width = box.width, height = box.height;
        var ctx = this.ctx;
        // 根据滚动值获取裁剪区域
        var endX = startX + width;
        var endY = startY + height;
        // ScrollView 作为容器本身的渲染
        this.render();
        /**
         * 开始裁剪，只有仔 ScrollView layoutBox 区域内的元素才是可见的
         * 这样 ScrollView 不用单独占用一个 canvas，内存合渲染都会得到优化
         */
        ctx.save();
        ctx.beginPath();
        ctx.rect(startX, startY, width, height);
        ctx.clip();
        this.children.forEach(function (child) {
            var _a = child.layoutBox, width = _a.width, height = _a.height, absoluteX = _a.absoluteX, absoluteY = _a.absoluteY;
            // 判断处于可视窗口内的子节点，递归渲染该子节点
            if (absoluteY + height >= startY && absoluteY <= endY
                && absoluteX + width >= startX && absoluteX <= endX) {
                _this.renderTreeWithTop(child);
            }
        });
        // 上面的渲染应该先跳过滚动条，否则可能出现渲染顺序问题，ScrollView的节点反而把滚动条盖住了
        (_a = this.vertivalScrollbar) === null || _a === void 0 ? void 0 : _a.render();
        (_b = this.horizontalScrollbar) === null || _b === void 0 ? void 0 : _b.render();
        ctx.restore();
    };
    ScrollView.prototype.scrollHandler = function (left, top) {
        var _this = this;
        var _a, _b;
        // 可能被销毁了或者节点树还没准备好
        if (!this.isDestroyed && !this.isFirstScroll) {
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this && !(ele instanceof _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"])) {
                    ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - top;
                    ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - left;
                }
            });
            // 这里要把滚动状态保存起来，因为在reflow的时候需要做重置，渲染并不依赖这两个信息
            this.scrollTop = top;
            this.scrollLeft = left;
            (_a = this.vertivalScrollbar) === null || _a === void 0 ? void 0 : _a.onScroll(left, top);
            (_b = this.horizontalScrollbar) === null || _b === void 0 ? void 0 : _b.onScroll(left, top);
            this.root.emit('repaint');
            if (this.currentEvent) {
                this.emit('scroll', this.currentEvent);
            }
        }
        if (this.isFirstScroll) {
            this.isFirstScroll = false;
        }
    };
    /**
     * 当执行reflow之后，滚动列表的高度可能发生了变化，滚动条也需要同步进行更新
     */
    ScrollView.prototype.updateScrollBar = function (scrollProp, scrollBarName) {
        var _this = this;
        var dimensions = {
            width: this.layoutBox.width,
            height: this.layoutBox.height,
            contentWidth: this.scrollerObj.__contentWidth,
            contentHeight: this.scrollerObj.__contentHeight,
            maxScrollLeft: this.scrollerObj.__maxScrollLeft,
            maxScrollTop: this.scrollerObj.__maxScrollTop,
            scrollLeft: this.scrollerObj.__scrollLeft,
            scrollTop: this.scrollerObj.__scrollTop,
        };
        // console.log('updateScrollBar', JSON.stringify(dimensions))
        // 非第一次创建的情况，一般是 reflow 执行到这里
        if (this[scrollProp]) {
            if (this[scrollBarName]) {
                this[scrollBarName].setDimensions(dimensions);
            }
            else {
                var scrollBar = new _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"]({
                    dimensions: dimensions,
                    direction: scrollProp === 'scrollY' ? _scrollbar__WEBPACK_IMPORTED_MODULE_5__.ScrollBarDirection.Vertival : _scrollbar__WEBPACK_IMPORTED_MODULE_5__.ScrollBarDirection.Horizontal,
                });
                // this.appendChild(scrollbar);
                scrollBar.root = this.root;
                scrollBar.init();
                // @ts-ignore
                scrollBar.insert(this.root.renderContext, true);
                scrollBar.observeStyleAndEvent();
                this.add(scrollBar);
                (0,_elements__WEBPACK_IMPORTED_MODULE_4__.setDirty)(scrollBar, 'appendToScrollView');
                // @ts-ignore
                this[scrollBarName] = scrollBar;
                // @ts-ignore
                this.root.ticker.next(function () {
                    var _a, _b;
                    // @ts-ignore
                    (_a = _this[scrollBarName]) === null || _a === void 0 ? void 0 : _a.onScroll(_this.scrollerObj.__scrollLeft, _this.scrollerObj.__scheduledTop);
                    (_b = _this.root) === null || _b === void 0 ? void 0 : _b.emit('repaint');
                }, true);
            }
        }
        else {
            // 当不再需要纵向滚动的时候销毁纵向滚动条
            if (this[scrollBarName]) {
                var scrollBar = this[scrollBarName];
                scrollBar.remove();
                scrollBar.destroy();
                scrollBar.destroySelf();
                // @ts-ignore
                this[scrollBarName] = null;
            }
        }
    };
    ScrollView.prototype.insert = function (context) {
        var _this = this;
        this.shouldUpdate = false;
        this.ctx = context;
        /**
         * 这里有个非常特殊的兼容逻辑，在低版本没有重构 ScrollView之前，并没有提供单独的 ScrollX 和 ScrollY 属性
         * 而是判断 scrollHeiht 大于容器高度的时候自动实现了纵向滚动（且没有横向滚动能力）
         * 因此这里做一个兼容逻辑，如果 scrollHeight > this.layoutBox.height 自动开启纵向滚动
         */
        if (this.scrollHeight > this.layoutBox.height && typeof this.scrollYProp === 'undefined') {
            console.log("[Layout] \u81EA\u52A8\u5F00\u542F scrollY");
            this.scrollY = true;
        }
        if (this.hasEventBind) {
            // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
            if (this.layoutBox.width !== this.scrollerObj.__clientWidth
                || this.layoutBox.height !== this.scrollerObj.__clientHeight
                || this.scrollWidth !== this.scrollerObj.__contentWidth
                || this.scrollHeight !== this.scrollerObj.__contentHeight) {
                this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
                /**
                 * 这里之所以要延迟一帧是因为这里的变动来自 reflow 之后，正在做 reflow 之后的后续事情
                 * 如果立即修改滚动条的样式，实际上并不会生效。
                 */
                // @ts-ignore
                this.root.ticker.next(function () {
                    _this.updateScrollBar('scrollY', 'vertivalScrollbar');
                    _this.updateScrollBar('scrollX', 'horizontalScrollbar');
                }, true);
            }
            // reflow 之后，会从 csslayout 同步布局信息，原先的滚动信息会丢失，这里需要一个复位的操作
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this && !(ele instanceof _scrollbar__WEBPACK_IMPORTED_MODULE_5__["default"])) {
                    ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - _this.scrollTop;
                    ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - _this.scrollLeft;
                }
            });
            return;
        }
        this.hasEventBind = true;
        this.isFirstScroll = true;
        // @ts-ignore
        this.scrollerObj = new _libs_scroller_index_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.scrollHandler.bind(this), this.scrollerOption);
        this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
        // @ts-ignore
        this.root.ticker.next(function () {
            _this.updateScrollBar('scrollY', 'vertivalScrollbar');
            _this.updateScrollBar('scrollX', 'horizontalScrollbar');
        }, true);
        this.on('touchstart', function (e) {
            if (!e.touches) {
                e.touches = [e];
            }
            var touches = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.copyTouchArray)(e.touches);
            touches.forEach(function (touch) {
                if (dpr !== 1) {
                    touch.pageX *= dpr;
                    touch.pageY *= dpr;
                }
            });
            _this.scrollerObj.doTouchStart(touches, e.timeStamp);
            _this.currentEvent = e;
        });
        this.on('touchmove', function (e) {
            if (!e.touches) {
                e.touches = [e];
            }
            var touches = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.copyTouchArray)(e.touches);
            touches.forEach(function (touch) {
                if (dpr !== 1) {
                    touch.pageX *= dpr;
                    touch.pageY *= dpr;
                }
            });
            _this.scrollerObj.doTouchMove(touches, e.timeStamp, undefined);
            _this.currentEvent = e;
        });
        // 这里不应该是监听scrollview的touchend事件而是屏幕的touchend事件
        this.root.on('touchend', function (e) {
            _this.scrollerObj.doTouchEnd(e.timeStamp);
            _this.currentEvent = e;
        });
    };
    ScrollView.prototype.scrollTo = function (left, top, animate) {
        if (left === void 0) { left = 0; }
        if (top === void 0) { top = 0; }
        if (animate === void 0) { animate = true; }
        this.scrollerObj.scrollTo(left, top, animate, 1);
    };
    return ScrollView;
}(_view__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ScrollView);


/***/ }),

/***/ "./src/components/style.ts":
/*!*********************************!*\
  !*** ./src/components/style.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allStyles: () => (/* binding */ allStyles),
/* harmony export */   reflowAffectedStyles: () => (/* binding */ reflowAffectedStyles),
/* harmony export */   repaintAffectedStyles: () => (/* binding */ repaintAffectedStyles)
/* harmony export */ });
var reflowAffectedStyles = [
    'width', 'height',
    'minWidth', 'minHeight',
    'maxWidth', 'maxHeight',
    'left', 'right', 'top', 'bottom',
    'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
    'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
    'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth',
    'flexDirection',
    'flexShrink',
    'flexGrow',
    'justifyContent',
    'alignItems', 'alignSelf',
    'flex',
    'flexWrap',
    'position',
    'fontWeight',
];
var repaintAffectedStyles = [
    'fontSize',
    'lineHeight',
    'textAlign',
    'verticalAlign',
    'color',
    'backgroundColor',
    'textOverflow',
    'letterSpacing',
    'borderRadius',
    'borderColor',
    'opacity',
    'transform',
    'textStrokeColor',
    'textStrokeWidth',
    'textShadow',
];
var allStyles = reflowAffectedStyles.concat(repaintAffectedStyles);



/***/ }),

/***/ "./src/components/styleParser.ts":
/*!***************************************!*\
  !*** ./src/components/styleParser.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   backgroundImageParser: () => (/* binding */ backgroundImageParser),
/* harmony export */   isValidTextShadow: () => (/* binding */ isValidTextShadow),
/* harmony export */   parseTransform: () => (/* binding */ parseTransform)
/* harmony export */ });
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
// 背景图正则表达式
var isValidUrlPropReg = /\s*url\((.*?)\)\s*/;
// 解析背景图片
function backgroundImageParser(val) {
    if (typeof val === 'string') {
        var list = val.match(isValidUrlPropReg);
        if (list) {
            var url = list[1].replace(/('|")/g, '');
            return url;
        }
    }
    console.error("[Layout]: ".concat(val, " is not a valid backgroundImage"));
    return null;
}
var textShadowReg = /^(\d+px\s){2}\d+px\s[a-zA-Z]+(,\s*(\d+px\s){2}\d+px\s[a-zA-Z]+)*$/;
function isValidTextShadow(textShadow) {
    return textShadowReg.test(textShadow);
}
function isValidTransformValue(value) {
    // 使用正则表达式验证数字或逗号分隔的数字，后面可以跟可选的角度单位（deg）
    return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*$/.test(value);
}
var transformRegex = /(\w+)\(([^)]+)\)/g;
function parseTransform(transform) {
    var result = {};
    var match;
    while ((match = transformRegex.exec(transform))) {
        var name_1 = match[1], value = match[2];
        if (!isValidTransformValue(value)) {
            throw new Error("[Layout]: invalid value for ".concat(name_1, ": ").concat(value));
        }
        var values = value
            .split(',')
            .map(function (val) { return val.trim().replace('deg', ''); })
            .map(Number);
        switch (name_1) {
            case 'rotate':
                result.rotate = degreesToRadians(values[0]);
                break;
            case 'scale':
                result.scaleX = values[0];
                result.scaleY = values[1] || values[0];
                break;
            default:
                break;
        }
    }
    return result;
}


/***/ }),

/***/ "./src/components/text.ts":
/*!********************************!*\
  !*** ./src/components/text.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env */ "./src/env.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


var DEFAULT_FONT_FAMILY = 'sans-serif';
var context = null;
var getContext = function () {
    if (context) {
        return context;
    }
    var canvas = _env__WEBPACK_IMPORTED_MODULE_1__["default"].createCanvas();
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d');
    return context;
};
function getTextWidth(style, value) {
    var context = getContext();
    context.font = "".concat(style.fontWeight || 'normal', " ").concat(style.fontSize || 12, "px ").concat(style.fontFamily || DEFAULT_FONT_FAMILY);
    return context.measureText(value).width || 0;
}
function getTextWidthWithoutSetFont(value) {
    return getContext().measureText(value).width || 0;
}
function parseText(style, value) {
    value = String(value);
    var maxWidth = style.width;
    var wordWidth = getTextWidth(style, value);
    // 对文字溢出的处理，默认用...
    var textOverflow = style.textOverflow || 'ellipsis';
    // 文字最大长度不超限制
    if (wordWidth <= maxWidth) {
        return value;
    }
    // 对于用点点点处理的情况，先将最大宽度减去...的宽度
    if (textOverflow === 'ellipsis') {
        maxWidth -= getTextWidthWithoutSetFont('...');
    }
    var length = value.length - 1;
    var str = value.substring(0, length);
    while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
        length -= 1;
        str = value.substring(0, length);
    }
    return (length && textOverflow === 'ellipsis'
        ? "".concat(str, "...")
        : str);
}
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(_a) {
        var _this = this;
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var originStyleWidth = style.width;
        // 没有设置宽度的时候通过canvas计算出文字宽度
        if (originStyleWidth === undefined) {
            style.width = getTextWidth(style, value);
        }
        else if (style.textOverflow === 'ellipsis') {
            value = parseText(style, value);
        }
        if (style.height === undefined) {
            style.height = style.lineHeight || style.fontSize || 12;
        }
        _this = _super.call(this, {
            idName: idName,
            className: className,
            style: style,
            dataset: dataset,
        }) || this;
        _this.valuesrc = '';
        _this.textBaseline = 'bottom';
        _this.font = '';
        _this.textAlign = 'left';
        _this.fillStyle = '#000000';
        _this.type = 'Text';
        _this.ctx = null;
        _this.valuesrc = value;
        _this.originStyleWidth = originStyleWidth;
        if (style.textShadow) {
            _this.parseTextShadow(style.textShadow);
        }
        return _this;
    }
    Text.prototype.styleChangeHandler = function (prop, val) {
        if (prop === 'textShadow') {
            this.parseTextShadow(val);
        }
    };
    Text.prototype.parseTextShadow = function (textShadow) {
        // if (!isValidTextShadow(textShadow)) {
        //   console.error(`[Layout]: ${textShadow} is not a valid textShadow`);
        // } else {
        // 解析 text-shadow 字符串
        this.textShadows = textShadow.split(',').map(function (shadow) {
            var parts = shadow.trim().split(/\s+/);
            var offsetX = parseFloat(parts[0]);
            var offsetY = parseFloat(parts[1]);
            var blurRadius = parseFloat(parts[2]);
            var color = parts[3];
            return { offsetX: offsetX, offsetY: offsetY, blurRadius: blurRadius, color: color };
        });
        // }
    };
    Object.defineProperty(Text.prototype, "value", {
        get: function () {
            return this.valuesrc;
        },
        set: function (newValue) {
            if (newValue !== this.valuesrc) {
                if (this.originStyleWidth === undefined) {
                    this.style.width = getTextWidth(this.style, newValue);
                }
                else if (this.style.textOverflow === 'ellipsis') {
                    newValue = parseText(this.style, newValue);
                }
                this.valuesrc = newValue;
                this.isDirty = true;
                var parent_1 = this.parent;
                while (parent_1) {
                    parent_1.isDirty = true;
                    parent_1 = parent_1.parent;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Text.prototype.toCanvasData = function () {
        var style = this.style || {};
        this.fontSize = style.fontSize || 12;
        this.textBaseline = 'top';
        this.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize || 12, "px ").concat(style.fontFamily || DEFAULT_FONT_FAMILY);
        this.textAlign = style.textAlign || 'left';
        this.fillStyle = style.color || '#000';
    };
    Text.prototype.repaint = function () {
        this.render();
    };
    Text.prototype.destroySelf = function () {
        this.root = null;
    };
    Text.prototype.insert = function (ctx, needRender) {
        this.ctx = ctx;
        this.shouldUpdate = false;
        this.toCanvasData();
        if (needRender) {
            this.render();
        }
    };
    Text.prototype.render = function () {
        var _this = this;
        var style = this.style;
        var ctx = this.ctx;
        ctx.save();
        var _a = this.baseRender('test'), needStroke = _a.needStroke, originX = _a.originX, originY = _a.originY, drawX = _a.drawX, drawY = _a.drawY, width = _a.width, height = _a.height;
        ctx.textBaseline = this.textBaseline;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        if (needStroke) {
            ctx.stroke();
        }
        ctx.fillStyle = this.fillStyle;
        if (this.textAlign === 'center') {
            drawX += width / 2;
        }
        else if (this.textAlign === 'right') {
            drawX += width;
        }
        if (style.lineHeight) {
            ctx.textBaseline = 'middle';
            drawY += style.lineHeight / 2;
        }
        // 纹理文字描边
        if (style.textStrokeColor) {
            ctx.lineWidth = style.textStrokeWidth || 1;
            ctx.strokeStyle = style.textStrokeColor;
            ctx.strokeText(this.value, drawX - originX, drawY - originY);
        }
        // 处理文字阴影
        if (this.textShadows) {
            this.textShadows.forEach(function (_a) {
                var offsetX = _a.offsetX, offsetY = _a.offsetY, blurRadius = _a.blurRadius, color = _a.color;
                ctx.shadowOffsetX = offsetX;
                ctx.shadowOffsetY = offsetY;
                ctx.shadowBlur = blurRadius;
                ctx.shadowColor = color;
                ctx.fillText(_this.value, drawX - originX, drawY - originY);
            });
        }
        else {
            ctx.fillText(this.value, drawX - originX, drawY - originY);
        }
        ctx.translate(-originX, -originY);
        ctx.restore();
    };
    return Text;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Text);


/***/ }),

/***/ "./src/components/view.ts":
/*!********************************!*\
  !*** ./src/components/view.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _elements__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./elements */ "./src/components/elements.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

var View = /** @class */ (function (_super) {
    __extends(View, _super);
    function View(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, dataset = _a.dataset;
        var _this = _super.call(this, {
            idName: idName,
            className: className,
            style: style,
            dataset: dataset,
        }) || this;
        _this.type = 'View';
        _this.ctx = null;
        return _this;
    }
    View.prototype.destroySelf = function () {
        this.isDestroyed = true;
        this.children = [];
        this.root = null;
    };
    View.prototype.render = function () {
        var ctx = this.ctx;
        ctx.save();
        var _a = this.baseRender(), needStroke = _a.needStroke, needClip = _a.needClip, originX = _a.originX, originY = _a.originY;
        if (needStroke) {
            ctx.stroke();
        }
        ctx.translate(-originX, -originY);
        ctx.restore();
    };
    View.prototype.repaint = function () {
        this.render();
    };
    return View;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (View);


/***/ }),

/***/ "./src/env.ts":
/*!********************!*\
  !*** ./src/env.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
if (typeof GameGlobal !== 'undefined') {
    GameGlobal.__env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
}
var domEventMap = {
    touchstart: 'mousedown',
    touchmove: 'mousemove',
    touchend: 'mouseup',
    touchcancel: 'mouseleave',
};
var eventType;
(function (eventType) {
    eventType["on"] = "on";
    eventType["off"] = "off";
})(eventType || (eventType = {}));
function genDomTouchEvent(event, type) {
    if (typeof document !== 'undefined') {
        return function (listener) {
            type === eventType.on ?
                document.addEventListener(event, listener, false)
                : document.removeEventListener(event, listener, false);
        };
    }
}
function getOnTouchHandler(event, type) {
    if (typeof GameGlobal !== 'undefined') {
        return GameGlobal.__env["".concat(type).concat(event)];
    }
    else {
        return genDomTouchEvent(domEventMap[event.toLowerCase()], type);
    }
}
/**
 * Layout 可能用在不用的平台，而Layout会依赖平台下面的一些方法来实现具体的功能，比如创建图片
 * 为了更好做平台适配，统一封装 env 模块，不同平台要做适配，替换 env 的具体方法即可
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    // 监听触摸相关事件
    onTouchStart: getOnTouchHandler('TouchStart', eventType.on),
    onTouchMove: getOnTouchHandler('TouchMove', eventType.on),
    onTouchEnd: getOnTouchHandler('TouchEnd', eventType.on),
    onTouchCancel: getOnTouchHandler('TouchCancel', eventType.on),
    // 取消监听触摸相关事件
    offTouchStart: getOnTouchHandler('TouchStart', eventType.off),
    offTouchMove: getOnTouchHandler('TouchMove', eventType.off),
    offTouchEnd: getOnTouchHandler('TouchEnd', eventType.off),
    offTouchCancel: getOnTouchHandler('TouchCancel', eventType.off),
    // Layout 支持百分比样式，如果根节点样式设置为 100%，直接取 Canvas 的尺寸，不同平台的取法不一样，因此单独提供函数
    getRootCanvasSize: function () {
        if (typeof __env !== 'undefined' && __env.getSharedCanvas) {
            var cvs = __env.getSharedCanvas();
            return {
                width: cvs.width,
                height: cvs.height,
            };
        }
        else {
            return {
                width: 300,
                height: 150,
            };
        }
    },
    // 取当前设备的 devicePixelRatio，不同平台的取法不一样
    getDevicePixelRatio: function () {
        if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
            return __env.getSystemInfoSync().devicePixelRatio;
        }
        else if (window.devicePixelRatio) {
            return window.devicePixelRatio;
        }
        else {
            return 1;
        }
    },
    // 创建Canvas
    createCanvas: function () {
        if (typeof __env !== 'undefined') {
            return __env.createCanvas();
        }
        return document.createElement('canvas');
    },
    // 创建图片
    createImage: function () {
        if (typeof __env !== 'undefined') {
            return __env.createImage();
        }
        return document.createElement('img');
    }
});


/***/ }),

/***/ "./src/libs/fast-xml-parser/node2json.js":
/*!***********************************************!*\
  !*** ./src/libs/fast-xml-parser/node2json.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(/*! ./util */ "./src/libs/fast-xml-parser/util.js");
var convertToJson = function (node, options) {
    var jObj = {
        name: node.tagname
    };
    //when no child node or attr is present
    if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
        return util.isExist(node.val) && !!node.val ? node.val : jObj;
    }
    else {
        //otherwise create a textnode if node has some text
        if (util.isExist(node.val)) {
            if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
                if (options.arrayMode === "strict") {
                    jObj[options.textNodeName] = [node.val];
                }
                else {
                    jObj[options.textNodeName] = node.val;
                }
            }
        }
    }
    util.merge(jObj, node.attrsMap, options.arrayMode);
    jObj.children = [];
    node.children.forEach(function (child) {
        jObj.children.push(convertToJson(child, options));
    });
    //add value
    return jObj;
};
exports.convertToJson = convertToJson;


/***/ }),

/***/ "./src/libs/fast-xml-parser/parser.js":
/*!********************************************!*\
  !*** ./src/libs/fast-xml-parser/parser.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var nodeToJson = __webpack_require__(/*! ./node2json */ "./src/libs/fast-xml-parser/node2json.js");
var xmlToNodeobj = __webpack_require__(/*! ./xmlstr2xmlnode */ "./src/libs/fast-xml-parser/xmlstr2xmlnode.js");
var x2xmlnode = __webpack_require__(/*! ./xmlstr2xmlnode */ "./src/libs/fast-xml-parser/xmlstr2xmlnode.js");
var buildOptions = (__webpack_require__(/*! ./util */ "./src/libs/fast-xml-parser/util.js").buildOptions);
var validator = __webpack_require__(/*! ./validator */ "./src/libs/fast-xml-parser/validator.js");
exports.parse = function (xmlData, options, validationOption) {
    if (validationOption) {
        if (validationOption === true)
            validationOption = {};
        var result = validator.validate(xmlData, validationOption);
        if (result !== true) {
            throw Error(result.err.msg);
        }
    }
    options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
    return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};


/***/ }),

/***/ "./src/libs/fast-xml-parser/util.js":
/*!******************************************!*\
  !*** ./src/libs/fast-xml-parser/util.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

var getAllMatches = function (string, regex) {
    var matches = [];
    var match = regex.exec(string);
    while (match) {
        var allmatches = [];
        var len = match.length;
        for (var index = 0; index < len; index++) {
            allmatches.push(match[index]);
        }
        matches.push(allmatches);
        match = regex.exec(string);
    }
    return matches;
};
var doesMatch = function (string, regex) {
    var match = regex.exec(string);
    return !(match === null || typeof match === 'undefined');
};
var doesNotMatch = function (string, regex) {
    return !doesMatch(string, regex);
};
exports.isExist = function (v) {
    return typeof v !== 'undefined';
};
exports.isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0;
};
/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
exports.merge = function (target, a, arrayMode) {
    if (a) {
        var keys = Object.keys(a); // will return an array of own properties
        var len = keys.length; //don't make it inline
        for (var i = 0; i < len; i++) {
            if (arrayMode === 'strict') {
                target[keys[i]] = [a[keys[i]]];
            }
            else {
                target[keys[i]] = a[keys[i]];
            }
        }
    }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */
exports.getValue = function (v) {
    if (exports.isExist(v)) {
        return v;
    }
    else {
        return '';
    }
};
// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};
exports.buildOptions = function (options, defaultOptions, props) {
    var newOptions = {};
    if (!options) {
        return defaultOptions; //if there are not options
    }
    for (var i = 0; i < props.length; i++) {
        if (options[props[i]] !== undefined) {
            newOptions[props[i]] = options[props[i]];
        }
        else {
            newOptions[props[i]] = defaultOptions[props[i]];
        }
    }
    return newOptions;
};
exports.doesMatch = doesMatch;
exports.doesNotMatch = doesNotMatch;
exports.getAllMatches = getAllMatches;


/***/ }),

/***/ "./src/libs/fast-xml-parser/validator.js":
/*!***********************************************!*\
  !*** ./src/libs/fast-xml-parser/validator.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(/*! ./util */ "./src/libs/fast-xml-parser/util.js");
var defaultOptions = {
    allowBooleanAttributes: false,
    localeRange: 'a-zA-Z',
};
var props = ['allowBooleanAttributes', 'localeRange'];
//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function (xmlData, options) {
    options = util.buildOptions(options, defaultOptions, props);
    //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
    //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
    //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
    var tags = [];
    var tagFound = false;
    if (xmlData[0] === '\ufeff') {
        // check for byte order mark (BOM)
        xmlData = xmlData.substr(1);
    }
    var regxAttrName = new RegExp('^[_w][\\w\\-.:]*$'.replace('_w', '_' + options.localeRange));
    var regxTagName = new RegExp('^([w]|_)[\\w.\\-_:]*'.replace('([w', '([' + options.localeRange));
    for (var i = 0; i < xmlData.length; i++) {
        if (xmlData[i] === '<') {
            //starting of tag
            //read until you reach to '>' avoiding any '>' in attribute value
            i++;
            if (xmlData[i] === '?') {
                i = readPI(xmlData, ++i);
                if (i.err) {
                    return i;
                }
            }
            else if (xmlData[i] === '!') {
                i = readCommentAndCDATA(xmlData, i);
                continue;
            }
            else {
                var closingTag = false;
                if (xmlData[i] === '/') {
                    //closing tag
                    closingTag = true;
                    i++;
                }
                //read tagname
                var tagName = '';
                for (; i < xmlData.length &&
                    xmlData[i] !== '>' &&
                    xmlData[i] !== ' ' &&
                    xmlData[i] !== '\t' &&
                    xmlData[i] !== '\n' &&
                    xmlData[i] !== '\r'; i++) {
                    tagName += xmlData[i];
                }
                tagName = tagName.trim();
                //console.log(tagName);
                if (tagName[tagName.length - 1] === '/') {
                    //self closing tag without attributes
                    tagName = tagName.substring(0, tagName.length - 1);
                    continue;
                }
                if (!validateTagName(tagName, regxTagName)) {
                    return { err: { code: 'InvalidTag', msg: 'Tag ' + tagName + ' is an invalid name.' } };
                }
                var result = readAttributeStr(xmlData, i);
                if (result === false) {
                    return { err: { code: 'InvalidAttr', msg: 'Attributes for "' + tagName + '" have open quote.' } };
                }
                var attrStr = result.value;
                i = result.index;
                if (attrStr[attrStr.length - 1] === '/') {
                    //self closing tag
                    attrStr = attrStr.substring(0, attrStr.length - 1);
                    var isValid = validateAttributeString(attrStr, options, regxAttrName);
                    if (isValid === true) {
                        tagFound = true;
                        //continue; //text may presents after self closing tag
                    }
                    else {
                        return isValid;
                    }
                }
                else if (closingTag) {
                    if (!result.tagClosed) {
                        return {
                            err: { code: 'InvalidTag', msg: 'closing tag "' + tagName + "\" don't have proper closing." },
                        };
                    }
                    else if (attrStr.trim().length > 0) {
                        return {
                            err: { code: 'InvalidTag', msg: 'closing tag "' + tagName + "\" can't have attributes or invalid starting." },
                        };
                    }
                    else {
                        var otg = tags.pop();
                        if (tagName !== otg) {
                            return {
                                err: { code: 'InvalidTag', msg: 'closing tag ' + otg + ' is expected inplace of ' + tagName + '.' },
                            };
                        }
                    }
                }
                else {
                    var isValid = validateAttributeString(attrStr, options, regxAttrName);
                    if (isValid !== true) {
                        return isValid;
                    }
                    tags.push(tagName);
                    tagFound = true;
                }
                //skip tag text value
                //It may include comments and CDATA value
                for (i++; i < xmlData.length; i++) {
                    if (xmlData[i] === '<') {
                        if (xmlData[i + 1] === '!') {
                            //comment or CADATA
                            i++;
                            i = readCommentAndCDATA(xmlData, i);
                            continue;
                        }
                        else {
                            break;
                        }
                    }
                } //end of reading tag text value
                if (xmlData[i] === '<') {
                    i--;
                }
            }
        }
        else {
            if (xmlData[i] === ' ' || xmlData[i] === '\t' || xmlData[i] === '\n' || xmlData[i] === '\r') {
                continue;
            }
            return { err: { code: 'InvalidChar', msg: 'char ' + xmlData[i] + ' is not expected .' } };
        }
    }
    if (!tagFound) {
        return { err: { code: 'InvalidXml', msg: 'Start tag expected.' } };
    }
    else if (tags.length > 0) {
        return {
            err: { code: 'InvalidXml', msg: 'Invalid ' + JSON.stringify(tags, null, 4).replace(/\r?\n/g, '') + ' found.' },
        };
    }
    return true;
};
/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */
function readPI(xmlData, i) {
    var start = i;
    for (; i < xmlData.length; i++) {
        if (xmlData[i] == '?' || xmlData[i] == ' ') {
            //tagname
            var tagname = xmlData.substr(start, i - start);
            if (i > 5 && tagname === 'xml') {
                return { err: { code: 'InvalidXml', msg: 'XML declaration allowed only at the start of the document.' } };
            }
            else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
                //check if valid attribut string
                i++;
                break;
            }
            else {
                continue;
            }
        }
    }
    return i;
}
function readCommentAndCDATA(xmlData, i) {
    if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
        //comment
        for (i += 3; i < xmlData.length; i++) {
            if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
                i += 2;
                break;
            }
        }
    }
    else if (xmlData.length > i + 8 &&
        xmlData[i + 1] === 'D' &&
        xmlData[i + 2] === 'O' &&
        xmlData[i + 3] === 'C' &&
        xmlData[i + 4] === 'T' &&
        xmlData[i + 5] === 'Y' &&
        xmlData[i + 6] === 'P' &&
        xmlData[i + 7] === 'E') {
        var angleBracketsCount = 1;
        for (i += 8; i < xmlData.length; i++) {
            if (xmlData[i] === '<') {
                angleBracketsCount++;
            }
            else if (xmlData[i] === '>') {
                angleBracketsCount--;
                if (angleBracketsCount === 0) {
                    break;
                }
            }
        }
    }
    else if (xmlData.length > i + 9 &&
        xmlData[i + 1] === '[' &&
        xmlData[i + 2] === 'C' &&
        xmlData[i + 3] === 'D' &&
        xmlData[i + 4] === 'A' &&
        xmlData[i + 5] === 'T' &&
        xmlData[i + 6] === 'A' &&
        xmlData[i + 7] === '[') {
        for (i += 8; i < xmlData.length; i++) {
            if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
                i += 2;
                break;
            }
        }
    }
    return i;
}
var doubleQuote = '"';
var singleQuote = "'";
/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */
function readAttributeStr(xmlData, i) {
    var attrStr = '';
    var startChar = '';
    var tagClosed = false;
    for (; i < xmlData.length; i++) {
        if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
            if (startChar === '') {
                startChar = xmlData[i];
            }
            else if (startChar !== xmlData[i]) {
                //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
                continue;
            }
            else {
                startChar = '';
            }
        }
        else if (xmlData[i] === '>') {
            if (startChar === '') {
                tagClosed = true;
                break;
            }
        }
        attrStr += xmlData[i];
    }
    if (startChar !== '') {
        return false;
    }
    return { value: attrStr, index: i, tagClosed: tagClosed };
}
/**
 * Select all the attributes whether valid or invalid.
 */
var validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');
//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""
function validateAttributeString(attrStr, options, regxAttrName) {
    //console.log("start:"+attrStr+":end");
    //if(attrStr.trim().length === 0) return true; //empty string
    var matches = util.getAllMatches(attrStr, validAttrStrRegxp);
    var attrNames = {};
    for (var i = 0; i < matches.length; i++) {
        //console.log(matches[i]);
        if (matches[i][1].length === 0) {
            //nospace before attribute name: a="sd"b="saf"
            return { err: { code: 'InvalidAttr', msg: 'attribute ' + matches[i][2] + ' has no space in starting.' } };
        }
        else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
            //independent attribute: ab
            return { err: { code: 'InvalidAttr', msg: 'boolean attribute ' + matches[i][2] + ' is not allowed.' } };
        }
        /* else if(matches[i][6] === undefined){//attribute without value: ab=
                        return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                    } */
        var attrName = matches[i][2];
        if (!validateAttrName(attrName, regxAttrName)) {
            return { err: { code: 'InvalidAttr', msg: 'attribute ' + attrName + ' is an invalid name.' } };
        }
        /*if (!attrNames.hasOwnProperty(attrName)) {*/
        if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
            //check for duplicate attribute.
            attrNames[attrName] = 1;
        }
        else {
            return { err: { code: 'InvalidAttr', msg: 'attribute ' + attrName + ' is repeated.' } };
        }
    }
    return true;
}
// const validAttrRegxp = /^[_a-zA-Z][\w\-.:]*$/;
function validateAttrName(attrName, regxAttrName) {
    // const validAttrRegxp = new RegExp(regxAttrName);
    return util.doesMatch(attrName, regxAttrName);
}
//const startsWithXML = new RegExp("^[Xx][Mm][Ll]");
//  startsWith = /^([a-zA-Z]|_)[\w.\-_:]*/;
function validateTagName(tagname, regxTagName) {
    /*if(util.doesMatch(tagname,startsWithXML)) return false;
      else*/
    return !util.doesNotMatch(tagname, regxTagName);
}


/***/ }),

/***/ "./src/libs/fast-xml-parser/xmlNode.js":
/*!*********************************************!*\
  !*** ./src/libs/fast-xml-parser/xmlNode.js ***!
  \*********************************************/
/***/ ((module) => {

"use strict";

module.exports = function (tagname, parent, val) {
    this.tagname = tagname;
    this.parent = parent;
    this.child = {}; //child tags
    this.attrsMap = {}; //attributes map
    this.children = [];
    this.val = val; //text only
    this.addChild = function (child) {
        this.children.push(child);
        if (Array.isArray(this.child[child.tagname])) {
            //already presents
            this.child[child.tagname].push(child);
        }
        else {
            this.child[child.tagname] = [child];
        }
    };
};


/***/ }),

/***/ "./src/libs/fast-xml-parser/xmlstr2xmlnode.js":
/*!****************************************************!*\
  !*** ./src/libs/fast-xml-parser/xmlstr2xmlnode.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(/*! ./util */ "./src/libs/fast-xml-parser/util.js");
var buildOptions = (__webpack_require__(/*! ./util */ "./src/libs/fast-xml-parser/util.js").buildOptions);
var xmlNode = __webpack_require__(/*! ./xmlNode */ "./src/libs/fast-xml-parser/xmlNode.js");
var TagType = { OPENING: 1, CLOSING: 2, SELF: 3, CDATA: 4 };
var regx = '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|(([\\w:\\-._]*:)?([\\w:\\-._]+))([^>]*)>|((\\/)(([\\w:\\-._]*:)?([\\w:\\-._]+))\\s*>))([^<]*)';
//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");
//polyfill
if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
}
var defaultOptions = {
    attributeNamePrefix: '@_',
    attrNodeName: false,
    textNodeName: '#text',
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    //ignoreRootElement : false,
    parseNodeValue: true,
    parseAttributeValue: false,
    arrayMode: false,
    trimValues: true,
    cdataTagName: false,
    cdataPositionChar: '\\c',
    localeRange: '',
    tagValueProcessor: function (a) {
        return a;
    },
    attrValueProcessor: function (a) {
        return a;
    },
    stopNodes: []
    //decodeStrict: false,
};
exports.defaultOptions = defaultOptions;
var props = [
    'attributeNamePrefix',
    'attrNodeName',
    'textNodeName',
    'ignoreAttributes',
    'ignoreNameSpace',
    'allowBooleanAttributes',
    'parseNodeValue',
    'parseAttributeValue',
    'arrayMode',
    'trimValues',
    'cdataTagName',
    'cdataPositionChar',
    'localeRange',
    'tagValueProcessor',
    'attrValueProcessor',
    'parseTrueNumberOnly',
    'stopNodes'
];
exports.props = props;
var getTraversalObj = function (xmlData, options) {
    options = buildOptions(options, defaultOptions, props);
    //xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line
    xmlData = xmlData.replace(/<!--[\s\S]*?-->/g, ''); //Remove  comments
    var xmlObj = new xmlNode('!xml');
    var currentNode = xmlObj;
    regx = regx.replace(/\[\\w/g, '[' + options.localeRange + '\\w');
    var tagsRegx = new RegExp(regx, 'g');
    var tag = tagsRegx.exec(xmlData);
    var nextTag = tagsRegx.exec(xmlData);
    while (tag) {
        var tagType = checkForTagType(tag);
        if (tagType === TagType.CLOSING) {
            //add parsed data to parent node
            if (currentNode.parent && tag[14]) {
                currentNode.parent.val = util.getValue(currentNode.parent.val) + '' + processTagValue(tag, options, currentNode.parent.tagname);
            }
            if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
                currentNode.child = [];
                if (currentNode.attrsMap == undefined) {
                    currentNode.attrsMap = {};
                }
                currentNode.val = xmlData.substr(currentNode.startIndex + 1, tag.index - currentNode.startIndex - 1);
            }
            currentNode = currentNode.parent;
        }
        else if (tagType === TagType.CDATA) {
            if (options.cdataTagName) {
                //add cdata node
                var childNode = new xmlNode(options.cdataTagName, currentNode, tag[3]);
                childNode.attrsMap = buildAttributesMap(tag[8], options);
                currentNode.addChild(childNode);
                //for backtracking
                currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
                //add rest value to parent node
                if (tag[14]) {
                    currentNode.val += processTagValue(tag, options);
                }
            }
            else {
                currentNode.val = (currentNode.val || '') + (tag[3] || '') + processTagValue(tag, options);
            }
        }
        else if (tagType === TagType.SELF) {
            if (currentNode && tag[14]) {
                currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(tag, options);
            }
            var childNode = new xmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, '');
            if (tag[8] && tag[8].length > 0) {
                tag[8] = tag[8].substr(0, tag[8].length - 1);
            }
            childNode.attrsMap = buildAttributesMap(tag[8], options);
            currentNode.addChild(childNode);
        }
        else {
            //TagType.OPENING
            var childNode = new xmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, processTagValue(tag, options));
            if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
                childNode.startIndex = tag.index + tag[1].length;
            }
            childNode.attrsMap = buildAttributesMap(tag[8], options);
            currentNode.addChild(childNode);
            currentNode = childNode;
        }
        tag = nextTag;
        nextTag = tagsRegx.exec(xmlData);
    }
    return xmlObj;
};
function processTagValue(parsedTags, options, parentTagName) {
    var tagName = parsedTags[7] || parentTagName;
    var val = parsedTags[14];
    if (val) {
        if (options.trimValues) {
            val = val.trim();
        }
        val = options.tagValueProcessor(val, tagName);
        val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
    }
    return val;
}
function checkForTagType(match) {
    if (match[4] === ']]>') {
        return TagType.CDATA;
    }
    else if (match[10] === '/') {
        return TagType.CLOSING;
    }
    else if (typeof match[8] !== 'undefined' && match[8].substr(match[8].length - 1) === '/') {
        return TagType.SELF;
    }
    else {
        return TagType.OPENING;
    }
}
function resolveNameSpace(tagname, options) {
    if (options.ignoreNameSpace) {
        var tags = tagname.split(':');
        var prefix = tagname.charAt(0) === '/' ? '/' : '';
        if (tags[0] === 'xmlns') {
            return '';
        }
        if (tags.length === 2) {
            tagname = prefix + tags[1];
        }
    }
    return tagname;
}
function parseValue(val, shouldParse, parseTrueNumberOnly) {
    if (shouldParse && typeof val === 'string') {
        var parsed = void 0;
        if (val.trim() === '' || isNaN(val)) {
            parsed = val === 'true' ? true : val === 'false' ? false : val;
        }
        else {
            if (val.indexOf('0x') !== -1) {
                //support hexa decimal
                parsed = Number.parseInt(val, 16);
            }
            else if (val.indexOf('.') !== -1) {
                parsed = Number.parseFloat(val);
            }
            else {
                parsed = Number.parseInt(val, 10);
            }
            if (parseTrueNumberOnly) {
                parsed = String(parsed) === val ? parsed : val;
            }
        }
        return parsed;
    }
    else {
        if (util.isExist(val)) {
            return val;
        }
        else {
            return '';
        }
    }
}
//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
var attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');
function buildAttributesMap(attrStr, options) {
    if (!options.ignoreAttributes && typeof attrStr === 'string') {
        attrStr = attrStr.replace(/\r?\n/g, ' ');
        //attrStr = attrStr || attrStr.trim();
        var matches = util.getAllMatches(attrStr, attrsRegx);
        var len = matches.length; //don't make it inline
        var attrs = {};
        for (var i = 0; i < len; i++) {
            var attrName = resolveNameSpace(matches[i][1], options);
            if (attrName.length) {
                if (matches[i][4] !== undefined) {
                    if (options.trimValues) {
                        matches[i][4] = matches[i][4].trim();
                    }
                    matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
                    attrs[options.attributeNamePrefix + attrName] = parseValue(matches[i][4], options.parseAttributeValue, options.parseTrueNumberOnly);
                }
                else if (options.allowBooleanAttributes) {
                    attrs[options.attributeNamePrefix + attrName] = true;
                }
            }
        }
        if (!Object.keys(attrs).length) {
            return;
        }
        if (options.attrNodeName) {
            var attrCollection = {};
            attrCollection[options.attrNodeName] = attrs;
            return attrCollection;
        }
        return attrs;
    }
}
exports.getTraversalObj = getTraversalObj;


/***/ }),

/***/ "./src/libs/scroller/animate.js":
/*!**************************************!*\
  !*** ./src/libs/scroller/animate.js ***!
  \**************************************/
/***/ (function(module, exports) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */
/**
 * Generic animation class with support for dropped frames both optional easing and duration.
 *
 * Optional duration is useful when the lifetime is defined by another condition than time
 * e.g. speed of an animating object, etc.
 *
 * Dropped frame logic allows to keep using the same updater logic independent from the actual
 * rendering. This eases a lot of cases where it might be pretty complex to break down a state
 * based on the pure time difference.
 */
(function (root, factory) {
    if (true) {
        // AMD. Register as an anonymous module.
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else {}
}(this, function (exports) {
    var global = typeof window === 'undefined' ? this : window;
    var time = Date.now || function () {
        return +new Date();
    };
    var desiredFrames = 60;
    var millisecondsPerSecond = 1000;
    var running = {};
    var counter = 1;
    /**
     * Stops the given animation.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation was stopped (aka, was running before)
     */
    exports.stop = function (id) {
        var cleared = (running[id] !== null);
        if (cleared) {
            running[id] = null;
        }
        return cleared;
    };
    /**
     * Whether the given animation is still running.
     *
     * @param id {Integer} Unique animation ID
     * @return {Boolean} Whether the animation is still running
     */
    exports.isRunning = function (id) {
        return running[id] !== null;
    };
    /**
     * Start the animation.
     *
     * @param stepCallback {Function} Pointer to function which is executed on every step.
     *   Signature of the method should be `function(percent, now, virtual) { return continueWithAnimation; }`
     * @param verifyCallback {Function} Executed before every animation step.
     *   Signature of the method should be `function() { return continueWithAnimation; }`
     * @param completedCallback {Function}
     *   Signature of the method should be `function(droppedFrames, finishedAnimation, optional wasFinished) {}`
     * @param duration {Integer} Milliseconds to run the animation
     * @param easingMethod {Function} Pointer to easing function
     *   Signature of the method should be `function(percent) { return modifiedValue; }`
     * @param root {Element} Render root. Used for internal usage of requestAnimationFrame.
     * @return {Integer} Identifier of animation. Can be used to stop it any time.
     */
    exports.start = function (stepCallback, verifyCallback, completedCallback, duration, easingMethod, root) {
        var start = time();
        var lastFrame = start;
        var percent = 0;
        var dropCounter = 0;
        var id = counter++;
        // Compacting running db automatically every few new animations
        if (id % 20 === 0) {
            var newRunning = {};
            for (var usedId in running) {
                newRunning[usedId] = true;
            }
            running = newRunning;
        }
        // This is the internal step method which is called every few milliseconds
        var step = function (virtual) {
            // Normalize virtual value
            var render = virtual !== true;
            // Get current time
            var now = time();
            // Verification is executed before next animation step
            if (!running[id] || (verifyCallback && !verifyCallback(id))) {
                running[id] = null;
                completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, false);
                return;
            }
            // For the current rendering to apply let's update omitted steps in memory.
            // This is important to bring internal state variables up-to-date with progress in time.
            if (render) {
                var droppedFrames = Math.round((now - lastFrame) / (millisecondsPerSecond / desiredFrames)) - 1;
                for (var j = 0; j < Math.min(droppedFrames, 4); j++) {
                    step(true);
                    dropCounter++;
                }
            }
            // Compute percent value
            if (duration) {
                percent = (now - start) / duration;
                if (percent > 1) {
                    percent = 1;
                }
            }
            // Execute step callback, then...
            var value = easingMethod ? easingMethod(percent) : percent;
            if ((stepCallback(value, now, render) === false || percent === 1) && render) {
                running[id] = null;
                completedCallback(desiredFrames - (dropCounter / ((now - start) / millisecondsPerSecond)), id, percent === 1 || duration === undefined);
            }
            else if (render) {
                lastFrame = now;
                requestAnimationFrame(step, root);
            }
        };
        // Mark as running
        running[id] = true;
        // Init first step
        requestAnimationFrame(step, root);
        // Return unique animation ID
        return id;
    };
}));


/***/ }),

/***/ "./src/libs/scroller/index.js":
/*!************************************!*\
  !*** ./src/libs/scroller/index.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _animate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./animate */ "./src/libs/scroller/animate.js");
/* harmony import */ var _animate__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_animate__WEBPACK_IMPORTED_MODULE_0__);
/*
 * Scroller
 * http://github.com/zynga/scroller
 *
 * Copyright 2011, Zynga Inc.
 * Licensed under the MIT License.
 * https://raw.github.com/zynga/scroller/master/MIT-LICENSE.txt
 *
 * Based on the work of: Unify Project (unify-project.org)
 * http://unify-project.org
 * Copyright 2011, Deutsche Telekom AG
 * License: MIT + Apache (V2)
 */

var NOOP = function () { };
// Easing Equations (c) 2003 Robert Penner, all rights reserved.
// Open source under the BSD License.
/**
 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
 **/
var easeOutCubic = function (pos) {
    return (Math.pow((pos - 1), 3) + 1);
};
/**
 * @param pos {Number} position between 0 (start of effect) and 1 (end of effect)
 **/
var easeInOutCubic = function (pos) {
    if ((pos /= 0.5) < 1) {
        return 0.5 * Math.pow(pos, 3);
    }
    return 0.5 * (Math.pow((pos - 2), 3) + 2);
};
/**
 * A pure logic 'component' for 'virtual' scrolling/zooming.
 */
var Scroller = /** @class */ (function () {
    function Scroller(callback, options) {
        /*
         ---------------------------------------------------------------------------
         INTERNAL FIELDS :: STATUS
         ---------------------------------------------------------------------------
       */
        /** {Boolean} Whether only a single finger is used in touch handling */
        this.__isSingleTouch = false;
        /** {Boolean} Whether a touch event sequence is in progress */
        this.__isTracking = false;
        /** {Boolean} Whether a deceleration animation went to completion. */
        this.__didDecelerationComplete = false;
        /**
         * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
         * a gesturestart event happens. This has higher priority than dragging.
         */
        this.__isGesturing = false;
        /**
         * {Boolean} Whether the user has moved by such a distance that we have enabled
         * dragging mode. Hint = It's only enabled after some pixels of movement t;
         * not interrupt with clicks etc.
         */
        this.__isDragging = false;
        /**
         * {Boolean} Not touching and dragging anymore, and smoothly animating the
         * touch sequence using deceleration.
         */
        this.__isDecelerating = false;
        /**
         * {Boolean} Smoothly animating the currently configured change
         */
        this.__isAnimating = false;
        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DIMENSIONS
          ---------------------------------------------------------------------------
        */
        /** {Integer} Viewport left boundary */
        this.__clientLeft = 0;
        /** {Integer} Viewport right boundary */
        this.__clientTop = 0;
        /** {Integer} Viewport width */
        this.__clientWidth = 0;
        /** {Integer} Viewport height */
        this.__clientHeight = 0;
        /** {Integer} Full content's width */
        this.__contentWidth = 0;
        /** {Integer} Full content's height */
        this.__contentHeight = 0;
        /** {Integer} Snapping width for content */
        this.__snapWidth = 100;
        /** {Integer} Snapping height for content */
        this.__snapHeight = 100;
        /** {Number} Zoom level */
        this.__zoomLevel = 1;
        /** {Number} Scroll position on x-axis */
        this.__scrollLeft = 0;
        /** {Number} Scroll position on y-axis */
        this.__scrollTop = 0;
        /** {Integer} Maximum allowed scroll position on x-axis */
        this.__maxScrollLeft = 0;
        /** {Integer} Maximum allowed scroll position on y-axis */
        this.__maxScrollTop = 0;
        /* {Number} Scheduled left position (final position when animating) */
        this.__scheduledLeft = 0;
        /* {Number} Scheduled top position (final position when animating) */
        this.__scheduledTop = 0;
        /* {Number} Scheduled zoom level (final scale when animating) */
        this.__scheduledZoom = 0;
        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: LAST POSITIONS
          ---------------------------------------------------------------------------
        */
        /** {Number} Left position of finger at start */
        this.__lastTouchLeft = null;
        /** {Number} Top position of finger at start */
        this.__lastTouchTop = null;
        /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
        this.__lastTouchMove = null;
        /** {Array} List of positions, uses three indexes for each state = left, top, timestamp *;
        __positions = null;
      
      
      
        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS : = DECELERATION SUPPOR;
          ---------------------------------------------------------------------------
        */
        /** {Integer} Minimum left scroll position during deceleration */
        this.__minDecelerationScrollLeft = null;
        /** {Integer} Minimum top scroll position during deceleration */
        this.__minDecelerationScrollTop = null;
        /** {Integer} Maximum left scroll position during deceleration */
        this.__maxDecelerationScrollLeft = null;
        /** {Integer} Maximum top scroll position during deceleration */
        this.__maxDecelerationScrollTop = null;
        /** {Number} Current factor to modify horizontal scroll position with on every step */
        this.__decelerationVelocityX = null;
        /** {Number} Current factor to modify vertical scroll position with on every step */
        this.__decelerationVelocityY = null;
        this.__callback = callback;
        this.options = {
            /** Enable scrolling on x-axis */
            scrollingX: true,
            /** Enable scrolling on y-axis */
            scrollingY: true,
            /** Enable animations for deceleration, snap back, zooming and scrolling */
            animating: true,
            /** duration for animations triggered by scrollTo/zoomTo */
            animationDuration: 250,
            /** Enable bouncing (content can be slowly moved outside and jumps back after releasing) */
            bouncing: true,
            /** Enable locking to the main axis if user moves only slightly on one of them at start */
            locking: true,
            /** Enable pagination mode (switching between full page content panes) */
            paging: false,
            /** Enable snapping of content to a configured pixel grid */
            snapping: false,
            /** Enable zooming of content via API, fingers and mouse wheel */
            zooming: false,
            /** Minimum zoom level */
            minZoom: 0.5,
            /** Maximum zoom level */
            maxZoom: 3,
            /** Multiply or decrease scrolling speed **/
            speedMultiplier: 1,
            /** Callback that is fired on the later of touch end or deceleration end,
                provided that another scrolling action has not begun. Used to know
                when to fade out a scrollbar. */
            scrollingComplete: NOOP,
            /** This configures the amount of change applied to deceleration when reaching boundaries  **/
            penetrationDeceleration: 0.03,
            /** This configures the amount of change applied to acceleration when reaching boundaries  **/
            penetrationAcceleration: 0.08
        };
        for (var key in options) {
            this.options[key] = options[key];
        }
    }
    /*
      ---------------------------------------------------------------------------
      PUBLIC API
      ---------------------------------------------------------------------------
    */
    /**
     * Configures the dimensions of the client (outer) and content (inner) elements.
     * Requires the available space for the outer element and the outer size of the inner element.
     * All values which are falsy (null or zero etc.) are ignored and the old value is kept.
     *
     * @param clientWidth {Integer ? null} Inner width of outer element
     * @param clientHeight {Integer ? null} Inner height of outer element
     * @param contentWidth {Integer ? null} Outer width of inner element
     * @param contentHeight {Integer ? null} Outer height of inner element
     */
    Scroller.prototype.setDimensions = function (clientWidth, clientHeight, contentWidth, contentHeight) {
        // Only update values which are defined
        if (clientWidth !== null) {
            this.__clientWidth = clientWidth;
        }
        if (clientHeight !== null) {
            this.__clientHeight = clientHeight;
        }
        if (contentWidth !== null) {
            this.__contentWidth = contentWidth;
        }
        if (contentHeight !== null) {
            this.__contentHeight = contentHeight;
        }
        // Refresh maximums
        this.__computeScrollMax();
        // Refresh scroll position
        this.scrollTo(this.__scrollLeft, this.__scrollTop, false);
    };
    /**
     * Sets the client coordinates in relation to the document.
     *
     * @param left {Integer ? 0} Left position of outer element
     * @param top {Integer ? 0} Top position of outer element
     */
    Scroller.prototype.setPosition = function (left, top) {
        this.__clientLeft = left || 0;
        this.__clientTop = top || 0;
    };
    /**
     * Configures the snapping (when snapping is active)
     *
     * @param width {Integer} Snapping width
     * @param height {Integer} Snapping height
     */
    Scroller.prototype.setSnapSize = function (width, height) {
        this.__snapWidth = width;
        this.__snapHeight = height;
    };
    /**
     * Returns the scroll position and zooming values
     *
     * @return {Map} `left` and `top` scroll position and `zoom` level
     */
    Scroller.prototype.getValues = function () {
        return {
            left: this.__scrollLeft,
            top: this.__scrollTop,
            right: this.__scrollLeft + this.__clientWidth / this.__zoomLevel,
            bottom: this.__scrollTop + this.__clientHeight / this.__zoomLevel,
            zoom: this.__zoomLevel
        };
    };
    /**
     * Get point in in content space from scroll coordinates.
     */
    Scroller.prototype.getPoint = function (scrollLeft, scrollTop) {
        var values = this.getValues();
        return {
            left: scrollLeft / values.zoom,
            top: scrollTop / values.zoom
        };
    };
    /**
     * Returns the maximum scroll values
     *
     * @return {Map} `left` and `top` maximum scroll values
     */
    Scroller.prototype.getScrollMax = function () {
        return {
            left: this.__maxScrollLeft,
            top: this.__maxScrollTop
        };
    };
    /**
     * Zooms to the given level. Supports optional animation. Zooms
     * the center when no coordinates are given.
     *
     * @param level {Number} Level to zoom to
     * @param isAnimated {Boolean ? false} Whether to use animation
     * @param fixedLeft {Number ? undefined} Stationary point's left coordinate (vector in client space)
     * @param fixedTop {Number ? undefined} Stationary point's top coordinate (vector in client space)
     * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
     */
    Scroller.prototype.zoomTo = function (level, isAnimated, fixedLeft, fixedTop, callback) {
        if (!this.options.zooming) {
            throw new Error("Zooming is not enabled!");
        }
        // Add callback if exists
        if (callback) {
            this.__zoomComplete = callback;
        }
        // Stop deceleration
        if (this.__isDecelerating) {
            _animate__WEBPACK_IMPORTED_MODULE_0___default().stop(this.__isDecelerating);
            this.__isDecelerating = false;
        }
        var oldLevel = this.__zoomLevel;
        // Normalize fixed point to center of viewport if not defined
        if (fixedLeft === undefined) {
            fixedLeft = this.__clientWidth / 2;
        }
        if (fixedTop === undefined) {
            fixedTop = this.__clientHeight / 2;
        }
        // Limit level according to configuration
        level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom);
        // Recompute maximum values while temporary tweaking maximum scroll ranges
        this.__computeScrollMax(level);
        // Recompute left and top scroll positions based on new zoom level.
        // Choosing the new viewport so that the origin's position remains
        // fixed, we have central dilation about the origin.
        // * Fixed point, $F$, remains stationary in content space and in the
        // viewport.
        // * Initial scroll position, $S_i$, in content space.
        // * Final scroll position, $S_f$, in content space.
        // * Initial scaling factor, $k_i$.
        // * Final scaling factor, $k_f$.
        //
        // * $S_i \mapsto S_f$.
        // * $(S_i - F) k_i = (S_f - F) k_f$.
        // * $(S_i - F) k_i/k_f = (S_f - F)$.
        // * $S_f = F + (S_i - F) k_i/k_f$.
        //
        // Fixed point location, $\vector{f} = (F - S_i) k_i$.
        // * $F = S_i + \vector{f}/k_i$.
        // * $S_f = S_i + \vector{f}/k_i + (S_i - S_i - \vector{f}/k_i) k_i/k_f$.
        // * $S_f = S_i + \vector{f}/k_i - \vector{f}/k_f$.
        // * $S_f k_f = S_i k_f + (k_f/k_i - 1)\vector{f}$.
        // * $S_f k_f = (k_f/k_i)(S_i k_i) + (k_f/k_i - 1) \vector{f}$.
        var k = level / oldLevel;
        var left = k * (this.__scrollLeft + fixedLeft) - fixedLeft;
        var top = k * (this.__scrollTop + fixedTop) - fixedTop;
        // Limit x-axis
        if (left > this.__maxScrollLeft) {
            left = this.__maxScrollLeft;
        }
        else if (left < 0) {
            left = 0;
        }
        // Limit y-axis
        if (top > this.__maxScrollTop) {
            top = this.__maxScrollTop;
        }
        else if (top < 0) {
            top = 0;
        }
        // Push values out
        this.__publish(left, top, level, isAnimated);
    };
    /**
     * Zooms the content by the given factor.
     *
     * @param factor {Number} Zoom by given factor
     * @param isAnimated {Boolean ? false} Whether to use animation
     * @param originLeft {Number ? 0} Zoom in at given left coordinate
     * @param originTop {Number ? 0} Zoom in at given top coordinate
     * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
     */
    Scroller.prototype.zoomBy = function (factor, isAnimated, originLeft, originTop, callback) {
        this.zoomTo(this.__zoomLevel * factor, isAnimated, originLeft, originTop, callback);
    };
    /**
     * Scrolls to the given position. Respect limitations and snapping automatically.
     *
     * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
     * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
     * @param isAnimated {Boolean?false} Whether the scrolling should happen using an animation
     * @param zoom {Number} [1.0] Zoom level to go to
     */
    Scroller.prototype.scrollTo = function (left, top, isAnimated, zoom) {
        // Stop deceleration
        if (this.__isDecelerating) {
            _animate__WEBPACK_IMPORTED_MODULE_0___default().stop(this.__isDecelerating);
            this.__isDecelerating = false;
        }
        // Correct coordinates based on new zoom level
        if (zoom !== undefined && zoom !== this.__zoomLevel) {
            if (!this.options.zooming) {
                throw new Error("Zooming is not enabled!");
            }
            left *= zoom;
            top *= zoom;
            // Recompute maximum values while temporary tweaking maximum scroll ranges
            this.__computeScrollMax(zoom);
        }
        else {
            // Keep zoom when not defined
            zoom = this.__zoomLevel;
        }
        if (!this.options.scrollingX) {
            left = this.__scrollLeft;
        }
        else {
            if (this.options.paging) {
                left = Math.round(left / this.__clientWidth) * this.__clientWidth;
            }
            else if (this.options.snapping) {
                left = Math.round(left / this.__snapWidth) * this.__snapWidth;
            }
        }
        if (!this.options.scrollingY) {
            top = this.__scrollTop;
        }
        else {
            if (this.options.paging) {
                top = Math.round(top / this.__clientHeight) * this.__clientHeight;
            }
            else if (this.options.snapping) {
                top = Math.round(top / this.__snapHeight) * this.__snapHeight;
            }
        }
        // Limit for allowed ranges
        left = Math.max(Math.min(this.__maxScrollLeft, left), 0);
        top = Math.max(Math.min(this.__maxScrollTop, top), 0);
        // Don't animate when no change detected, still call publish to make sure
        // that rendered position is really in-sync with internal data
        if (left === this.__scrollLeft && top === this.__scrollTop) {
            isAnimated = false;
        }
        // Publish new values
        this.__publish(left, top, zoom, isAnimated);
    };
    /**
     * Scroll by the given offset
     *
     * @param left {Number ? 0} Scroll x-axis by given offset
     * @param top {Number ? 0} Scroll x-axis by given offset
     * @param isAnimated {Boolean ? false} Whether to animate the given change
     */
    Scroller.prototype.scrollBy = function (left, top, isAnimated) {
        var startLeft = this.__isAnimating ? this.__scheduledLeft : this.__scrollLeft;
        var startTop = this.__isAnimating ? this.__scheduledTop : this.__scrollTop;
        this.scrollTo(startLeft + (left || 0), startTop + (top || 0), isAnimated);
    };
    /*
      ---------------------------------------------------------------------------
      EVENT CALLBACKS
      ---------------------------------------------------------------------------
    */
    /**
     * Mouse wheel handler for zooming support
     */
    Scroller.prototype.doMouseZoom = function (wheelDelta, timeStamp, pageX, pageY) {
        var change = wheelDelta > 0 ? 0.97 : 1.03;
        return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
    };
    /**
     * Touch start handler for scrolling support
     */
    Scroller.prototype.doTouchStart = function (touches, timeStamp) {
        // Array-like check is enough here
        if (touches.length === undefined) {
            throw new Error("Invalid touch list: " + touches);
        }
        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
        }
        if (typeof timeStamp !== "number") {
            throw new Error("Invalid timestamp value: " + timeStamp);
        }
        // Reset interruptedAnimation flag
        this.__interruptedAnimation = true;
        // Stop deceleration
        if (this.__isDecelerating) {
            _animate__WEBPACK_IMPORTED_MODULE_0___default().stop(this.__isDecelerating);
            this.__isDecelerating = false;
            this.__interruptedAnimation = true;
        }
        // Stop animation
        if (this.__isAnimating) {
            _animate__WEBPACK_IMPORTED_MODULE_0___default().stop(this.__isAnimating);
            this.__isAnimating = false;
            this.__interruptedAnimation = true;
        }
        // Use center point when dealing with two fingers
        var currentTouchLeft, currentTouchTop;
        var isSingleTouch = touches.length === 1;
        if (isSingleTouch) {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
        }
        else {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
        }
        // Store initial positions
        this.__initialTouchLeft = currentTouchLeft;
        this.__initialTouchTop = currentTouchTop;
        // Store current zoom level
        this.__zoomLevelStart = this.__zoomLevel;
        // Store initial touch positions
        this.__lastTouchLeft = currentTouchLeft;
        this.__lastTouchTop = currentTouchTop;
        // Store initial move time stamp
        this.__lastTouchMove = timeStamp;
        // Reset initial scale
        this.__lastScale = 1;
        // Reset locking flags
        this.__enableScrollX = !isSingleTouch && this.options.scrollingX;
        this.__enableScrollY = !isSingleTouch && this.options.scrollingY;
        // Reset tracking flag
        this.__isTracking = true;
        // Reset deceleration complete flag
        this.__didDecelerationComplete = false;
        // Dragging starts directly with two fingers, otherwise lazy with an offset
        this.__isDragging = !isSingleTouch;
        // Some features are disabled in multi touch scenarios
        this.__isSingleTouch = isSingleTouch;
        // Clearing data structure
        this.__positions = [];
    };
    /**
     * Touch move handler for scrolling support
     * @param {Number} [1.0] scale - ....
     */
    Scroller.prototype.doTouchMove = function (touches, timeStamp, scale) {
        // Array-like check is enough here
        if (touches.length === undefined) {
            throw new Error("Invalid touch list: " + touches);
        }
        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
        }
        if (typeof timeStamp !== "number") {
            throw new Error("Invalid timestamp value: " + timeStamp);
        }
        // Ignore event when tracking is not enabled (event might be outside of element)
        if (!this.__isTracking) {
            return;
        }
        var currentTouchLeft, currentTouchTop;
        // Compute move based around of center of fingers
        if (touches.length === 2) {
            currentTouchLeft = Math.abs(touches[0].pageX + touches[1].pageX) / 2;
            currentTouchTop = Math.abs(touches[0].pageY + touches[1].pageY) / 2;
        }
        else {
            currentTouchLeft = touches[0].pageX;
            currentTouchTop = touches[0].pageY;
        }
        var positions = this.__positions;
        // Are we already is dragging mode?
        if (this.__isDragging) {
            // Compute move distance
            var moveX = currentTouchLeft - this.__lastTouchLeft;
            var moveY = currentTouchTop - this.__lastTouchTop;
            // Read previous scroll position and zooming
            var scrollLeft = this.__scrollLeft;
            var scrollTop = this.__scrollTop;
            var level = this.__zoomLevel;
            // Work with scaling
            if (scale !== undefined && this.options.zooming) {
                var oldLevel = level;
                // Recompute level based on previous scale and new scale
                level = level / this.__lastScale * scale;
                // Limit level according to configuration
                level = Math.max(Math.min(level, this.options.maxZoom), this.options.minZoom);
                // Only do further compution when change happened
                if (oldLevel !== level) {
                    // Compute relative event position to container
                    var currentTouchLeftRel = currentTouchLeft - this.__clientLeft;
                    var currentTouchTopRel = currentTouchTop - this.__clientTop;
                    // Recompute left and top coordinates based on new zoom level
                    scrollLeft = ((currentTouchLeftRel + scrollLeft) * level / oldLevel) - currentTouchLeftRel;
                    scrollTop = ((currentTouchTopRel + scrollTop) * level / oldLevel) - currentTouchTopRel;
                    // Recompute max scroll values
                    this.__computeScrollMax(level);
                }
            }
            if (this.__enableScrollX) {
                scrollLeft -= moveX * this.options.speedMultiplier;
                var maxScrollLeft = this.__maxScrollLeft;
                if (scrollLeft > maxScrollLeft || scrollLeft < 0) {
                    // Slow down on the edges
                    if (this.options.bouncing) {
                        scrollLeft += (moveX / 2 * this.options.speedMultiplier);
                    }
                    else if (scrollLeft > maxScrollLeft) {
                        scrollLeft = maxScrollLeft;
                    }
                    else {
                        scrollLeft = 0;
                    }
                }
            }
            // Compute new vertical scroll position
            if (this.__enableScrollY) {
                scrollTop -= moveY * this.options.speedMultiplier;
                // console.log(moveY)
                var maxScrollTop = this.__maxScrollTop;
                if (scrollTop > maxScrollTop || scrollTop < 0) {
                    // Slow down on the edges
                    if (this.options.bouncing) {
                        scrollTop += (moveY / 2 * this.options.speedMultiplier);
                    }
                    else if (scrollTop > maxScrollTop) {
                        scrollTop = maxScrollTop;
                    }
                    else {
                        scrollTop = 0;
                    }
                }
            }
            // Keep list from growing infinitely (holding min 10, max 20 measure points)
            if (positions.length > 60) {
                positions.splice(0, 30);
            }
            // Track scroll movement for decleration
            positions.push(scrollLeft, scrollTop, timeStamp);
            // Sync scroll position
            this.__publish(scrollLeft, scrollTop, level);
            // Otherwise figure out whether we are switching into dragging mode now.
        }
        else {
            var minimumTrackingForScroll = this.options.locking ? 3 : 0;
            var minimumTrackingForDrag = 5;
            var distanceX = Math.abs(currentTouchLeft - this.__initialTouchLeft);
            var distanceY = Math.abs(currentTouchTop - this.__initialTouchTop);
            this.__enableScrollX = this.options.scrollingX && distanceX >= minimumTrackingForScroll;
            this.__enableScrollY = this.options.scrollingY && distanceY >= minimumTrackingForScroll;
            positions.push(this.__scrollLeft, this.__scrollTop, timeStamp);
            this.__isDragging = (this.__enableScrollX || this.__enableScrollY) && (distanceX >= minimumTrackingForDrag || distanceY >= minimumTrackingForDrag);
            if (this.__isDragging) {
                this.__interruptedAnimation = false;
            }
        }
        // Update last touch positions and time stamp for next event
        this.__lastTouchLeft = currentTouchLeft;
        this.__lastTouchTop = currentTouchTop;
        this.__lastTouchMove = timeStamp;
        this.__lastScale = scale;
    };
    /**
     * Touch end handler for scrolling support
     */
    Scroller.prototype.doTouchEnd = function (timeStamp) {
        if (timeStamp instanceof Date) {
            timeStamp = timeStamp.valueOf();
        }
        if (typeof timeStamp !== "number") {
            throw new Error("Invalid timestamp value: " + timeStamp);
        }
        // Ignore event when tracking is not enabled (no touchstart event on element)
        // This is required as this listener ('touchmove') sits on the document and not on the element itself.
        if (!this.__isTracking) {
            return;
        }
        // Not touching anymore (when two finger hit the screen there are two touch end events)
        this.__isTracking = false;
        // Be sure to reset the dragging flag now. Here we also detect whether
        // the finger has moved fast enough to switch into a deceleration animation.
        if (this.__isDragging) {
            // Reset dragging flag
            this.__isDragging = false;
            // Start deceleration
            // Verify that the last move detected was in some relevant time frame
            if (this.__isSingleTouch && this.options.animating && (timeStamp - this.__lastTouchMove) <= 100) {
                // Then figure out what the scroll position was about 100ms ago
                var positions = this.__positions;
                var endPos = positions.length - 1;
                var startPos = endPos;
                // Move pointer to position measured 100ms ago
                for (var i = endPos; i > 0 && positions[i] > (this.__lastTouchMove - 100); i -= 3) {
                    startPos = i;
                }
                // If start and stop position is identical in a 100ms timeframe,
                // we cannot compute any useful deceleration.
                if (startPos !== endPos) {
                    // Compute relative movement between these two points
                    var timeOffset = positions[endPos] - positions[startPos];
                    var movedLeft = this.__scrollLeft - positions[startPos - 2];
                    var movedTop = this.__scrollTop - positions[startPos - 1];
                    // Based on 50ms compute the movement to apply for each render step
                    this.__decelerationVelocityX = movedLeft / timeOffset * (1000 / 60);
                    this.__decelerationVelocityY = movedTop / timeOffset * (1000 / 60);
                    // How much velocity is required to start the deceleration
                    var minVelocityToStartDeceleration = this.options.paging || this.options.snapping ? 4 : 1;
                    // Verify that we have enough velocity to start deceleration
                    if (Math.abs(this.__decelerationVelocityX) > minVelocityToStartDeceleration || Math.abs(this.__decelerationVelocityY) > minVelocityToStartDeceleration) {
                        this.__startDeceleration(timeStamp);
                    }
                }
                else {
                    this.options.scrollingComplete();
                }
            }
            else if ((timeStamp - this.__lastTouchMove) > 100) {
                this.options.scrollingComplete();
            }
        }
        // If this was a slower move it is per default non decelerated, but this
        // still means that we want snap back to the bounds which is done here.
        // This is placed outside the condition above to improve edge case stability
        // e.g. touchend fired without enabled dragging. This should normally do not
        // have modified the scroll positions or even showed the scrollbars though.
        if (!this.__isDecelerating) {
            if (this.__interruptedAnimation || this.__isDragging) {
                this.options.scrollingComplete();
            }
            this.scrollTo(this.__scrollLeft, this.__scrollTop, true, this.__zoomLevel);
        }
        // Fully cleanup list
        this.__positions.length = 0;
    };
    /*
      ---------------------------------------------------------------------------
      PRIVATE API
      ---------------------------------------------------------------------------
    */
    /**
     * Applies the scroll position to the content element
     *
     * @param left {Number} Left scroll position
     * @param top {Number} Top scroll position
     * @param isAnimated {Boolean?false} Whether animation should be used to move to the new coordinates
     */
    Scroller.prototype.__publish = function (left, top, zoom, isAnimated) {
        // Remember whether we had an animation, then we try to continue
        // based on the current "drive" of the animation.
        var wasAnimating = this.__isAnimating;
        if (wasAnimating) {
            _animate__WEBPACK_IMPORTED_MODULE_0___default().stop(wasAnimating);
            this.__isAnimating = false;
        }
        if (isAnimated && this.options.animating) {
            // Keep scheduled positions for scrollBy/zoomBy functionality.
            this.__scheduledLeft = left;
            this.__scheduledTop = top;
            this.__scheduledZoom = zoom;
            var oldLeft = this.__scrollLeft;
            var oldTop = this.__scrollTop;
            var oldZoom = this.__zoomLevel;
            var diffLeft = left - oldLeft;
            var diffTop = top - oldTop;
            var diffZoom = zoom - oldZoom;
            var step = function (percent, now, render) {
                if (render) {
                    this.__scrollLeft = oldLeft + (diffLeft * percent);
                    this.__scrollTop = oldTop + (diffTop * percent);
                    this.__zoomLevel = oldZoom + (diffZoom * percent);
                    // Push values out
                    if (this.__callback) {
                        this.__callback(this.__scrollLeft, this.__scrollTop, this.__zoomLevel);
                    }
                }
            }.bind(this);
            var verify = function (id) {
                return this.__isAnimating === id;
            }.bind(this);
            var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
                if (animationId === this.__isAnimating) {
                    this.__isAnimating = false;
                }
                if (this.__didDecelerationComplete || wasFinished) {
                    this.options.scrollingComplete();
                }
                if (this.options.zooming) {
                    this.__computeScrollMax();
                    if (this.__zoomComplete) {
                        this.__zoomComplete();
                        this.__zoomComplete = null;
                    }
                }
            }.bind(this);
            // When continuing based on previous animation we choose an ease-out animation instead of ease-in-out
            this.__isAnimating = _animate__WEBPACK_IMPORTED_MODULE_0___default().start(step, verify, completed, this.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);
        }
        else {
            this.__scheduledLeft = this.__scrollLeft = left;
            this.__scheduledTop = this.__scrollTop = top;
            this.__scheduledZoom = this.__zoomLevel = zoom;
            // Push values out
            if (this.__callback) {
                this.__callback(left, top, zoom);
            }
            // Fix max scroll ranges
            if (this.options.zooming) {
                this.__computeScrollMax();
                if (this.__zoomComplete) {
                    this.__zoomComplete();
                    this.__zoomComplete = null;
                }
            }
        }
    };
    /**
     * Recomputes scroll minimum values based on client dimensions and content dimensions.
     */
    Scroller.prototype.__computeScrollMax = function (zoomLevel) {
        if (zoomLevel === undefined) {
            zoomLevel = this.__zoomLevel;
        }
        this.__maxScrollLeft = Math.max(this.__contentWidth * zoomLevel - this.__clientWidth, 0);
        this.__maxScrollTop = Math.max(this.__contentHeight * zoomLevel - this.__clientHeight, 0);
    };
    /*
      ---------------------------------------------------------------------------
      ANIMATION (DECELERATION) SUPPORT
      ---------------------------------------------------------------------------
    */
    /**
     * Called when a touch sequence end and the speed of the finger was high enough
     * to switch into deceleration mode.
     */
    Scroller.prototype.__startDeceleration = function (timeStamp) {
        if (this.options.paging) {
            var scrollLeft = Math.max(Math.min(this.__scrollLeft, this.__maxScrollLeft), 0);
            var scrollTop = Math.max(Math.min(this.__scrollTop, this.__maxScrollTop), 0);
            var clientWidth = this.__clientWidth;
            var clientHeight = this.__clientHeight;
            // We limit deceleration not to the min/max values of the allowed range, but to the size of the visible client area.
            // Each page should have exactly the size of the client area.
            this.__minDecelerationScrollLeft = Math.floor(scrollLeft / clientWidth) * clientWidth;
            this.__minDecelerationScrollTop = Math.floor(scrollTop / clientHeight) * clientHeight;
            this.__maxDecelerationScrollLeft = Math.ceil(scrollLeft / clientWidth) * clientWidth;
            this.__maxDecelerationScrollTop = Math.ceil(scrollTop / clientHeight) * clientHeight;
        }
        else {
            this.__minDecelerationScrollLeft = 0;
            this.__minDecelerationScrollTop = 0;
            this.__maxDecelerationScrollLeft = this.__maxScrollLeft;
            this.__maxDecelerationScrollTop = this.__maxScrollTop;
        }
        // Wrap class method
        var step = function (percent, now, render) {
            this.__stepThroughDeceleration(render);
        }.bind(this);
        // How much velocity is required to keep the deceleration running
        var minVelocityToKeepDecelerating = this.options.snapping ? 4 : 0.1;
        // Detect whether it's still worth to continue animating steps
        // If we are already slow enough to not being user perceivable anymore, we stop the whole process here.
        var verify = function () {
            var shouldContinue = Math.abs(this.__decelerationVelocityX) >= minVelocityToKeepDecelerating || Math.abs(this.__decelerationVelocityY) >= minVelocityToKeepDecelerating;
            if (!shouldContinue) {
                this.__didDecelerationComplete = true;
            }
            return shouldContinue;
        }.bind(this);
        var completed = function (renderedFramesPerSecond, animationId, wasFinished) {
            this.__isDecelerating = false;
            if (this.__didDecelerationComplete) {
                this.options.scrollingComplete();
            }
            // Animate to grid when snapping is active, otherwise just fix out-of-boundary positions
            this.scrollTo(this.__scrollLeft, this.__scrollTop, this.options.snapping);
        }.bind(this);
        // Start animation and switch on flag
        this.__isDecelerating = _animate__WEBPACK_IMPORTED_MODULE_0___default().start(step, verify, completed);
    };
    /**
     * Called on every step of the animation
     *
     * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
     */
    Scroller.prototype.__stepThroughDeceleration = function (render) {
        //
        // COMPUTE NEXT SCROLL POSITION
        //
        // Add deceleration to scroll position
        var scrollLeft = this.__scrollLeft + this.__decelerationVelocityX;
        var scrollTop = this.__scrollTop + this.__decelerationVelocityY;
        //
        // HARD LIMIT SCROLL POSITION FOR NON BOUNCING MODE
        //
        if (!this.options.bouncing) {
            var scrollLeftFixed = Math.max(Math.min(this.__maxDecelerationScrollLeft, scrollLeft), this.__minDecelerationScrollLeft);
            if (scrollLeftFixed !== scrollLeft) {
                scrollLeft = scrollLeftFixed;
                this.__decelerationVelocityX = 0;
            }
            var scrollTopFixed = Math.max(Math.min(this.__maxDecelerationScrollTop, scrollTop), this.__minDecelerationScrollTop);
            if (scrollTopFixed !== scrollTop) {
                scrollTop = scrollTopFixed;
                this.__decelerationVelocityY = 0;
            }
        }
        //
        // UPDATE SCROLL POSITION
        //
        if (render) {
            this.__publish(scrollLeft, scrollTop, this.__zoomLevel);
        }
        else {
            this.__scrollLeft = scrollLeft;
            this.__scrollTop = scrollTop;
        }
        //
        // SLOW DOWN
        //
        // Slow down velocity on every iteration
        if (!this.options.paging) {
            // This is the factor applied to every iteration of the animation
            // to slow down the process. This should emulate natural behavior where
            // objects slow down when the initiator of the movement is removed
            var frictionFactor = 0.95;
            this.__decelerationVelocityX *= frictionFactor;
            this.__decelerationVelocityY *= frictionFactor;
        }
        //
        // BOUNCING SUPPORT
        //
        if (this.options.bouncing) {
            var scrollOutsideX = 0;
            var scrollOutsideY = 0;
            // This configures the amount of change applied to deceleration/acceleration when reaching boundaries
            var penetrationDeceleration = this.options.penetrationDeceleration;
            var penetrationAcceleration = this.options.penetrationAcceleration;
            // Check limits
            if (scrollLeft < this.__minDecelerationScrollLeft) {
                scrollOutsideX = this.__minDecelerationScrollLeft - scrollLeft;
            }
            else if (scrollLeft > this.__maxDecelerationScrollLeft) {
                scrollOutsideX = this.__maxDecelerationScrollLeft - scrollLeft;
            }
            if (scrollTop < this.__minDecelerationScrollTop) {
                scrollOutsideY = this.__minDecelerationScrollTop - scrollTop;
            }
            else if (scrollTop > this.__maxDecelerationScrollTop) {
                scrollOutsideY = this.__maxDecelerationScrollTop - scrollTop;
            }
            // Slow down until slow enough, then flip back to snap position
            if (scrollOutsideX !== 0) {
                if (scrollOutsideX * this.__decelerationVelocityX <= 0) {
                    this.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                }
                else {
                    this.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                }
            }
            if (scrollOutsideY !== 0) {
                if (scrollOutsideY * this.__decelerationVelocityY <= 0) {
                    this.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                }
                else {
                    this.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                }
            }
        }
    };
    return Scroller;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Scroller);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EE: () => (/* binding */ EE),
/* harmony export */   Layout: () => (/* binding */ Layout),
/* harmony export */   "default": () => (/* binding */ layout),
/* harmony export */   env: () => (/* reexport safe */ _env__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env */ "./src/env.ts");
/* harmony import */ var _components_elements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/elements */ "./src/components/elements.ts");
/* harmony import */ var _common_pool__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/pool */ "./src/common/pool.ts");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tiny-emitter */ "./node_modules/tiny-emitter/index.js");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! css-layout */ "./node_modules/css-layout/dist/css-layout.js");
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(css_layout__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/util */ "./src/common/util.ts");
/* harmony import */ var _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./libs/fast-xml-parser/parser.js */ "./src/libs/fast-xml-parser/parser.js");
/* harmony import */ var _common_bitMapFont__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/bitMapFont */ "./src/common/bitMapFont.ts");
/* harmony import */ var _common_debugInfo__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/debugInfo */ "./src/common/debugInfo.ts");
/* harmony import */ var _common_ticker__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./common/ticker */ "./src/common/ticker.ts");
/* harmony import */ var _common_vd__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/vd */ "./src/common/vd.ts");
/* harmony import */ var _common_rect__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/rect */ "./src/common/rect.ts");
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./common/imageManager */ "./src/common/imageManager.ts");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components */ "./src/components/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};














// 全局事件管道
var EE = new (tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default())();
var imgPool = new _common_pool__WEBPACK_IMPORTED_MODULE_2__["default"]('imgPool');
var bitMapPool = new _common_pool__WEBPACK_IMPORTED_MODULE_2__["default"]('bitMapPool');
var debugInfo = new _common_debugInfo__WEBPACK_IMPORTED_MODULE_8__["default"]();
/**
 * 默认暴露 Layout 的实例，但在某些场景下，可能需要多个 Layout 实例，因此 Layout 类也暴露出去
 * const myLayout = new Layout({
 *   style: {
 *      width: 0,
 *      height: 0,
 *   },
 *  name: 'myLayoutName',
 * });
 */
var Layout = /** @class */ (function (_super) {
    __extends(Layout, _super);
    function Layout(_a) {
        var style = _a.style;
        var _this = _super.call(this, {
            style: style,
            id: 0,
        }) || this;
        /**
         * 当前 Layout 版本，一般跟小游戏插件版本对齐
         */
        _this.version = '1.0.8';
        _this.env = _env__WEBPACK_IMPORTED_MODULE_0__["default"];
        /**
         * Layout 渲染的目标画布对应的 2d context
         */
        _this.renderContext = null;
        _this.renderport = {
            width: 0,
            height: 0,
        };
        _this.viewport = {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
        /**
         * 画布尺寸和实际被渲染到屏幕的物理尺寸比
         */
        _this.viewportScale = 1;
        /**
         * 用于标识updateViewPort方法是否被调用过了，这在小游戏环境非常重要
         */
        _this.hasViewPortSet = false;
        /**
         * 最终渲染到屏幕的左上角物理坐标
         */
        _this.realLayoutBox = {
            realX: 0,
            realY: 0,
        };
        _this.bitMapFonts = [];
        _this.eleCount = 0;
        _this.state = _common_util__WEBPACK_IMPORTED_MODULE_5__.STATE.UNINIT;
        /**
         * 用于在 ticker 的循环里面标识当前帧是否需要重绘
         * 重绘一般是图片加载完成、文字修改等场景
         */
        _this.isNeedRepaint = false;
        _this.ticker = new _common_ticker__WEBPACK_IMPORTED_MODULE_9__["default"]();
        _this.tickerFunc = function () {
            if (_this.isDirty) {
                // console.log('before_reflow')
                _this.emit('before_reflow', '');
                _this.reflow();
            }
            else if (_this.isNeedRepaint) {
                _this.repaint();
            }
        };
        _this.eventHandler = function (eventName) {
            return function (e) {
                var touch;
                if ((0,_common_util__WEBPACK_IMPORTED_MODULE_5__.isGameTouchEvent)(e)) {
                    touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
                }
                else {
                    touch = e;
                }
                // const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
                if (!touch || !touch.pageX || !touch.pageY) {
                    return;
                }
                if (!touch.timeStamp) {
                    // @ts-ignore
                    touch.timeStamp = e.timeStamp;
                }
                var list = [];
                if (touch) {
                    _this.getChildByPos(_this, touch.pageX, touch.pageY, list);
                }
                if (!list.length) {
                    list.push(_this);
                }
                var item = list[list.length - 1];
                item && item.emit(eventName, e);
                if (eventName === 'touchstart' || eventName === 'touchend') {
                    _this.eventHandlerData.touchMsg[eventName] = touch;
                }
                if (eventName === 'touchend' && (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.isClick)(_this.eventHandlerData.touchMsg)) {
                    item && item.emit('click', e);
                }
            };
        };
        /**
         * 将组件挂到Layout
         */
        _this.Element = _components_elements__WEBPACK_IMPORTED_MODULE_1__["default"];
        _this.View = _components__WEBPACK_IMPORTED_MODULE_13__.View;
        _this.Text = _components__WEBPACK_IMPORTED_MODULE_13__.Text;
        _this.Image = _components__WEBPACK_IMPORTED_MODULE_13__.Image;
        _this.ScrollView = _components__WEBPACK_IMPORTED_MODULE_13__.ScrollView;
        _this.BitMapText = _components__WEBPACK_IMPORTED_MODULE_13__.BitMapText;
        _this.Canvas = _components__WEBPACK_IMPORTED_MODULE_13__.Canvas;
        _this.Button = _components__WEBPACK_IMPORTED_MODULE_13__.Button;
        _this.registerComponent = _common_vd__WEBPACK_IMPORTED_MODULE_10__.registerComponent;
        _this.eventHandlerData = {
            hasEventBind: false,
            touchMsg: {},
            handlers: {
                touchStart: _this.eventHandler('touchstart').bind(_this),
                touchMove: _this.eventHandler('touchmove').bind(_this),
                touchEnd: _this.eventHandler('touchend').bind(_this),
                touchCancel: _this.eventHandler('touchcancel').bind(_this),
            },
        };
        /**
         * 对于不会影响布局的改动，比如图片只是改个地址、加个背景色之类的改动，会触发 Layout 的 repaint 操作
         * 触发的方式是给 Layout 抛个 `repaint` 的事件，为了性能，每次接收到 repaint 请求不会执行真正的渲染
         * 而是执行一个置脏操作，ticker 每一次执行 update 会检查这个标记位，进而执行真正的重绘操作
         */
        _this.on('repaint', function () {
            _this.isNeedRepaint = true;
        });
        /**
         * 将 Tween 挂载到 Layout，对于 Tween 的使用完全遵循 Tween.js 的文档
         * https://github.com/tweenjs/tween.js/
         * 只不过当 Tween 改动了节点会触发 repaint、reflow 的属性时，Layout 会执行相应的操作
         * 业务侧不用感知到 repaint 和 reflow
         */
        // this.TWEEN = TWEEN;
        console.log("[Layout] v".concat(_this.version));
        return _this;
    }
    Object.defineProperty(Layout.prototype, "debugInfo", {
        // 与老版本兼容
        get: function () {
            var info = debugInfo.log();
            info += "elementCount: ".concat(this.eleCount, "\n");
            return info;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
     * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
     * 的绝对尺寸和位置信息更新到本渲染引擎。
     * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
     * y坐标
     */
    Layout.prototype.updateViewPort = function (box) {
        this.viewport.width = box.width || 0;
        this.viewport.height = box.height || 0;
        this.viewport.x = box.x || 0;
        this.viewport.y = box.y || 0;
        this.realLayoutBox = {
            realX: this.viewport.x,
            realY: this.viewport.y,
        };
        this.hasViewPortSet = true;
    };
    Layout.prototype.init = function (template, style, attrValueProcessor) {
        debugInfo.start('init');
        var parseConfig = {
            attributeNamePrefix: '',
            attrNodeName: 'attr',
            textNodeName: '#text',
            ignoreAttributes: false,
            ignoreNameSpace: true,
            allowBooleanAttributes: true,
            parseNodeValue: false,
            parseAttributeValue: false,
            trimValues: true,
            parseTrueNumberOnly: false,
            alwaysCreateTextNode: true,
        };
        if (attrValueProcessor && typeof attrValueProcessor === 'function') {
            // @ts-ignore
            parseConfig.attrValueProcessor = attrValueProcessor;
        }
        debugInfo.start('init_xmlParse');
        // 将xml字符串解析成xml节点树
        var jsonObj = _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6__.parse(template, parseConfig, true);
        // console.log(jsonObj)
        debugInfo.end('init_xmlParse');
        var xmlTree = jsonObj.children[0];
        // XML树生成渲染树
        debugInfo.start('init_xml2Layout');
        var layoutTree = _common_vd__WEBPACK_IMPORTED_MODULE_10__.create.call(this, xmlTree, style);
        debugInfo.end('init_xml2Layout');
        this.add(layoutTree);
        this.state = _common_util__WEBPACK_IMPORTED_MODULE_5__.STATE.INITED;
        this.ticker.add(this.tickerFunc, true);
        this.ticker.start();
        debugInfo.end('init');
    };
    Layout.prototype.reflow = function (isFirst) {
        if (isFirst === void 0) { isFirst = false; }
        if (!isFirst) {
            debugInfo.reset();
        }
        debugInfo.start('layout_reflow');
        /**
         * 计算布局树
         * 经过 Layout 计算，节点树带上了 layout、lastLayout、shouldUpdate 布局信息
         * Layout本身并不作为布局计算，只是作为节点树的容器
         */
        debugInfo.start('computeLayout', true);
        css_layout__WEBPACK_IMPORTED_MODULE_4___default()(this.children[0]);
        debugInfo.end('computeLayout');
        var rootEle = this.children[0];
        if (rootEle.style.width === undefined || rootEle.style.height === undefined) {
            console.error('[Layout] Please set width and height property for root element');
        }
        else {
            this.renderport.width = rootEle.style.width;
            this.renderport.height = rootEle.style.height;
        }
        // 将布局树的布局信息加工赋值到渲染树
        debugInfo.start('layoutChildren', true);
        (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.layoutChildren)(this);
        debugInfo.end('layoutChildren');
        this.viewportScale = this.viewport.width / this.renderport.width;
        (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.clearCanvas)(this.renderContext);
        // 遍历节点树，依次调用节点的渲染接口实现渲染
        debugInfo.start('renderChildren', true);
        (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.renderChildren)(this.children, this.renderContext, false);
        debugInfo.end('renderChildren');
        debugInfo.start('repaint', true);
        this.repaint();
        debugInfo.end('repaint');
        this.isDirty = false;
        // iterateTree(this.children[0], (ele) => {
        //   console.log(ele.props);
        // });
        debugInfo.end('layout_reflow');
    };
    /**
     * init阶段核心仅仅是根据xml和css创建了节点树
     * 要实现真正的渲染，需要调用 layout 函数，之所以将 layout 单独抽象为一个函数，是因为 layout 应当是可以重复调用的
     * 比如改变了一个元素的尺寸，实际上节点树是没变的，仅仅是需要重新计算布局，然后渲染
     * 一个完整的 layout 分成下面的几步：
     * 1. 执行画布清理，因为布局变化页面需要重绘，这里没有做很高级的剔除等操作，一律清除重画，实际上性能已经很好
     * 2. 节点树都含有 style 属性，css-layout 能够根据这些信息计算出最终布局，详情可见 https://www.npmjs.com/package/css-layout
     * 3. 经过 Layout 计算，节点树带上了 layout、lastLayout、shouldUpdate 布局信息，但这些信息并不是能够直接用的
     *    比如 layout.top 是指在一个父容器内的 top，最终要实现渲染，实际上要递归加上复容器的 top
     *    这样每次 repaint 的时候只需要直接使用计算好的值即可，不需要每次都递归计算
     *    这一步称为 layoutChildren，目的在于将 css-layout 进一步处理为可以渲染直接用的布局信息
     * 4. renderChildren：执行渲染
     * 5. bindEvents：执行事件绑定
     */
    // @ts-ignore
    Layout.prototype.layout = function (context) {
        this.renderContext = context;
        if (!this.hasViewPortSet) {
            console.error('[Layout] Please invoke method `updateViewPort` before method `layout`');
        }
        debugInfo.start('layout');
        this.reflow(true);
        debugInfo.start('layout_other');
        this.bindEvents();
        debugInfo.start('layout_observeStyleAndEvent', true);
        (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.iterateTree)(this.children[0], function (element) { return element.observeStyleAndEvent(); });
        debugInfo.end('layout_observeStyleAndEvent');
        this.state = _common_util__WEBPACK_IMPORTED_MODULE_5__.STATE.RENDERED;
        debugInfo.end('layout');
        debugInfo.end('layout_other');
    };
    /**
     * 执行节点数的重绘制，一般业务侧无需调用该方法
     */
    Layout.prototype.repaint = function () {
        (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.clearCanvas)(this.renderContext);
        this.isNeedRepaint = false;
        (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.repaintChildren)(this.children);
    };
    /**
     * 返回一个节点在屏幕中的位置和尺寸信息，前提是正确调用updateViewPort。
     */
    Layout.prototype.getElementViewportRect = function (element) {
        var _a = this, realLayoutBox = _a.realLayoutBox, viewportScale = _a.viewportScale;
        var _b = element.layoutBox, absoluteX = _b.absoluteX, absoluteY = _b.absoluteY, width = _b.width, height = _b.height;
        var realX = absoluteX * viewportScale + realLayoutBox.realX;
        var realY = absoluteY * viewportScale + realLayoutBox.realY;
        var realWidth = width * viewportScale;
        var realHeight = height * viewportScale;
        return new _common_rect__WEBPACK_IMPORTED_MODULE_11__["default"](realX, realY, realWidth, realHeight);
    };
    Layout.prototype.getChildByPos = function (tree, x, y, itemList) {
        var _this = this;
        tree.children.forEach(function (ele) {
            var _a = ele.layoutBox, absoluteX = _a.absoluteX, absoluteY = _a.absoluteY, width = _a.width, height = _a.height;
            var realX = absoluteX * _this.viewportScale + _this.realLayoutBox.realX;
            var realY = absoluteY * _this.viewportScale + _this.realLayoutBox.realY;
            var realWidth = width * _this.viewportScale;
            var realHeight = height * _this.viewportScale;
            if ((realX <= x && x <= realX + realWidth) && (realY <= y && y <= realY + realHeight)) {
                /**
                 * 相关issue：https://github.com/wechat-miniprogram/minigame-canvas-engine/issues/17
                 * 这里只要满足条件的都要记录，否则可能出现 issue 里面提到的问题
                 */
                itemList.push(ele);
                if (ele.children.length) {
                    _this.getChildByPos(ele, x, y, itemList);
                }
            }
        });
    };
    /**
     * 执行全局的事件绑定逻辑
     */
    Layout.prototype.bindEvents = function () {
        if (this.eventHandlerData.hasEventBind) {
            return;
        }
        this.eventHandlerData.hasEventBind = true;
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchStart(this.eventHandlerData.handlers.touchStart);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchMove(this.eventHandlerData.handlers.touchMove);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchEnd(this.eventHandlerData.handlers.touchEnd);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchCancel(this.eventHandlerData.handlers.touchCancel);
    };
    /**
     * 全局事件解绑
     */
    Layout.prototype.unBindEvents = function () {
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].offTouchStart(this.eventHandlerData.handlers.touchStart);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].offTouchMove(this.eventHandlerData.handlers.touchMove);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].offTouchEnd(this.eventHandlerData.handlers.touchEnd);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].offTouchCancel(this.eventHandlerData.handlers.touchCancel);
        this.eventHandlerData.hasEventBind = false;
    };
    Layout.prototype.emit = function (event, data) {
        EE.emit(event, data);
    };
    Layout.prototype.on = function (event, callback) {
        EE.on(event, callback);
    };
    Layout.prototype.once = function (event, callback) {
        EE.once(event, callback);
    };
    Layout.prototype.off = function (event, callback) {
        EE.off(event, callback);
    };
    Layout.prototype.destroyAll = function (tree) {
        var _this = this;
        var children = tree.children;
        children.forEach(function (child) {
            child.destroy();
            _this.destroyAll(child);
            child.destroySelf && child.destroySelf();
        });
    };
    /**
     * 清理画布，之前的计算出来的渲染树也会一并清理，此时可以再次执行init和layout方法渲染界面。
     */
    Layout.prototype.clear = function (options) {
        if (options === void 0) { options = {}; }
        var _a = options.removeTicker, removeTicker = _a === void 0 ? true : _a;
        debugInfo.reset();
        this.destroyAll(this);
        // this.elementTree = null;
        this.children = [];
        this.state = _common_util__WEBPACK_IMPORTED_MODULE_5__.STATE.CLEAR;
        this.isDirty = false;
        (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.clearCanvas)(this.renderContext);
        this.eleCount = 0;
        this.unBindEvents();
        if (removeTicker) {
            this.ticker.remove();
            this.ticker.stop();
        }
        else {
            // inner的应该默认都移除，否则前后两次初始化会导致前后状态有问题
            this.ticker.removeInner();
        }
    };
    Layout.prototype.clearPool = function () {
        imgPool.clear();
    };
    /**
     * 比起 Layout.clear 更彻底的清理，会清空图片对象池，减少内存占用。
     */
    Layout.prototype.clearAll = function () {
        this.clear();
        this.clearPool();
    };
    /**
     * 对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验
     * 通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
     */
    Layout.prototype.loadImgs = function (arr) {
        if (arr === void 0) { arr = []; }
        return Promise.all(arr.map(function (src) { return _common_imageManager__WEBPACK_IMPORTED_MODULE_12__["default"].loadImagePromise(src); }));
    };
    /**
     * 注册 bitmaptext 可用的字体。
     */
    Layout.prototype.registBitMapFont = function (name, src, config) {
        if (!bitMapPool.get(name)) {
            var font = new _common_bitMapFont__WEBPACK_IMPORTED_MODULE_7__["default"](name, src, config);
            this.bitMapFonts.push(font);
            bitMapPool.set(name, font);
        }
    };
    /**
     * 克隆节点，克隆后的节点可以添加到 Layout 的某个节点中
     * 该方法可以在数据有变化的时候避免重新执行 Layout.init 流程。
     */
    Layout.prototype.cloneNode = function (element, deep) {
        if (deep === void 0) { deep = true; }
        return (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.clone)(this, element, deep);
    };
    /**
     * 安装给定的插件
     */
    Layout.prototype.use = function (plugin) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        if (Layout.installedPlugins.includes(plugin)) {
            console.warn('[Layout] 该插件已安装.');
            return;
        }
        plugin.install.apply(plugin, __spreadArray([this], options, false));
        Layout.installedPlugins.push(plugin);
        // console.log(`[Layout] 插件 ${plugin.name || ''} 已安装`)
    };
    /**
     * 卸载给定插件
     */
    Layout.prototype.unUse = function (plugin) {
        var options = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            options[_i - 1] = arguments[_i];
        }
        var pluginIndex = Layout.installedPlugins.indexOf(plugin);
        if (pluginIndex === -1) {
            console.warn('[Layout] This plugin is not installed.');
            return;
        }
        if (plugin.uninstall) {
            plugin.uninstall.apply(plugin, __spreadArray([this], options, false));
        }
        // console.log(`[Layout] 插件 ${plugin.name || ''} 已卸载`)
        Layout.installedPlugins.splice(pluginIndex, 1);
    };
    Layout.installedPlugins = [];
    return Layout;
}(_components_elements__WEBPACK_IMPORTED_MODULE_1__["default"]));
var layout = new Layout({
    style: {
        width: 0,
        height: 0,
    },
    name: 'layout',
});


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGVtb3Mvbm9lbmdpbmUvZW5naW5lLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FB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R0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLFFBQVE7UUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzVELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRyxRQUFRO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0YsUUFBUTtRQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pFLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVoQixPQUFPLEVB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QkFBa0IsQ0FBQyxDQUFDO1lBQ2pDLE9BQU87U0FDUjtRQUVELE1BQU0sQ0FBQyxPQUFPLE9BQWQsTUFBTSxpQkFBUyxJQUFJLEdBQUssT0FBTyxVQUFFO1FBQ2pDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckMsc0RBQXNEO0lBQ3hELENBQUM7SUFFRDs7T0FFRztJQUNILHNCQUFLLEdBQUwsVUFBTSxNQUF1QjtRQUFFLGlCQUFpQjthQUFqQixVQUFpQixFQUFqQixxQkFBaUIsRUFBakIsSUFBaUI7WUFBakIsZ0NBQWlCOztRQUM5QyxJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTVELElBQUksV0FBVyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3RCLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUN2RCxPQUFPO1NBQ1I7UUFFRCxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDcEIsTUFBTSxDQUFDLFNBQVMsT0FBaEIsTUFBTSxpQkFBVyxJQUFJLEdBQUssT0FBTyxVQUFFO1NBQ3BDO1FBRUQsc0RBQXNEO1FBQ3RELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFqQ2MsdUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztJQWtDMUQsYUFBQztDQUFBLENBM2hCb0IsNERBQU8sR0EyaEIzQjtBQUVELElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxDQUFDO0FBT0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL2Nzcy1sYXlvdXQvZGlzdC9jc3MtbGF5b3V0LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2JpdE1hcEZvbnQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vZGVidWdJbmZvLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2ltYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9wb29sLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3JlY3QudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdGlja2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3V0aWwudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdmQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2JpdG1hcHRleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2J1dHRvbi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvY2FudmFzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9lbGVtZW50cy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW1hZ2UudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2luZGV4LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGxiYXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbHZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZVBhcnNlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2Vudi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL25vZGUyanNvbi5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxOb2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sc3RyMnhtbG5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2FuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZCBmb3IgcmVmZXJlbmNlXG4vL1xuLy8gVGhpcyBmaWxlIHVzZXMgdGhlIGZvbGxvd2luZyBzcGVjaWZpYyBVTUQgaW1wbGVtZW50YXRpb246XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LmNvbXB1dGVMYXlvdXQgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxudmFyIGNvbXB1dGVMYXlvdXQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIENTU19VTkRFRklORUQ7XG5cbiAgdmFyIENTU19ESVJFQ1RJT05fSU5IRVJJVCA9ICdpbmhlcml0JztcbiAgdmFyIENTU19ESVJFQ1RJT05fTFRSID0gJ2x0cic7XG4gIHZhciBDU1NfRElSRUNUSU9OX1JUTCA9ICdydGwnO1xuXG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XID0gJ3Jvdyc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgPSAncm93LXJldmVyc2UnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiA9ICdjb2x1bW4nO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFID0gJ2NvbHVtbi1yZXZlcnNlJztcblxuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19KVVNUSUZZX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTiA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0FST1VORCA9ICdzcGFjZS1hcm91bmQnO1xuXG4gIHZhciBDU1NfQUxJR05fRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19BTElHTl9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19BTElHTl9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfQUxJR05fU1RSRVRDSCA9ICdzdHJldGNoJztcblxuICB2YXIgQ1NTX1BPU0lUSU9OX1JFTEFUSVZFID0gJ3JlbGF0aXZlJztcbiAgdmFyIENTU19QT1NJVElPTl9BQlNPTFVURSA9ICdhYnNvbHV0ZSc7XG5cbiAgdmFyIGxlYWRpbmcgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgdHJhaWxpbmcgPSB7XG4gICAgJ3Jvdyc6ICdyaWdodCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ2xlZnQnLFxuICAgICdjb2x1bW4nOiAnYm90dG9tJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAndG9wJ1xuICB9O1xuICB2YXIgcG9zID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIGRpbSA9IHtcbiAgICAncm93JzogJ3dpZHRoJyxcbiAgICAncm93LXJldmVyc2UnOiAnd2lkdGgnLFxuICAgICdjb2x1bW4nOiAnaGVpZ2h0JyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnaGVpZ2h0J1xuICB9O1xuXG4gIC8vIFdoZW4gdHJhbnNwaWxlZCB0byBKYXZhIC8gQyB0aGUgbm9kZSB0eXBlIGhhcyBsYXlvdXQsIGNoaWxkcmVuIGFuZCBzdHlsZVxuICAvLyBwcm9wZXJ0aWVzLiBGb3IgdGhlIEphdmFTY3JpcHQgdmVyc2lvbiB0aGlzIGZ1bmN0aW9uIGFkZHMgdGhlc2UgcHJvcGVydGllc1xuICAvLyBpZiB0aGV5IGRvbid0IGFscmVhZHkgZXhpc3QuXG4gIGZ1bmN0aW9uIGZpbGxOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmxheW91dCB8fCBub2RlLmlzRGlydHkpIHtcbiAgICAgIG5vZGUubGF5b3V0ID0ge1xuICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdmaWxsTm9kZXMnLCBub2RlLmxheW91dCwgbm9kZS5pc0RpcnR5LCBub2RlKVxuXG4gICAgaWYgKCFub2RlLnN0eWxlKSB7XG4gICAgICBub2RlLnN0eWxlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmaWxsTm9kZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm93RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbkVuZCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5FbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdTdGFydCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ0VuZCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ0VuZCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSArXG4gICAgICAgIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEp1c3RpZnlDb250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmFsaWduQ29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25Db250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnN0eWxlLmFsaWduU2VsZikge1xuICAgICAgcmV0dXJuIGNoaWxkLnN0eWxlLmFsaWduU2VsZjtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25JdGVtcykge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25JdGVtcztcbiAgICB9XG4gICAgcmV0dXJuICdzdHJldGNoJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVBeGlzKGF4aXMsIGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fUlRMKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVykge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbikge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgaWYgKG5vZGUuc3R5bGUuZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gQ1NTX0RJUkVDVElPTl9JTkhFUklUO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fSU5IRVJJVCkge1xuICAgICAgZGlyZWN0aW9uID0gKHBhcmVudERpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gQ1NTX0RJUkVDVElPTl9MVFIgOiBwYXJlbnREaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGbGV4RGlyZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENyb3NzRmxleERpcmVjdGlvbihmbGV4RGlyZWN0aW9uLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvblR5cGUobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLnBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuICdyZWxhdGl2ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXgobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRQb3NpdGlvblR5cGUobm9kZSkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgbm9kZS5zdHlsZS5mbGV4ID4gMFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXhXcmFwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4V3JhcCA9PT0gJ3dyYXAnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGltV2l0aE1hcmdpbihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gKyBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZVtkaW1bYXhpc11dID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Bvc0RlZmluZWQobm9kZSwgcG9zKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZWFzdXJlRGVmaW5lZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUubWVhc3VyZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24obm9kZSwgcG9zKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvdW5kQXhpcyhub2RlLCBheGlzLCB2YWx1ZSkge1xuICAgIHZhciBtaW4gPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5taW5IZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbkhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgbWF4ID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWF4SGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhIZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIGJvdW5kVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgbWF4ID49IDAgJiYgYm91bmRWYWx1ZSA+IG1heCkge1xuICAgICAgYm91bmRWYWx1ZSA9IG1heDtcbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkICYmIG1pbiA+PSAwICYmIGJvdW5kVmFsdWUgPCBtaW4pIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtaW47XG4gICAgfVxuICAgIHJldHVybiBib3VuZFZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm1heGYoYSwgYikge1xuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzcGVjaWZpY2FsbHkgc2V0cyBhIHZhbHVlIGZvciB3aWR0aCBvciBoZWlnaHRcbiAgZnVuY3Rpb24gc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGF4aXMpIHtcbiAgICAvLyBUaGUgcGFyZW50IGFscmVhZHkgY29tcHV0ZWQgdXMgYSB3aWR0aCBvciBoZWlnaHQuIFdlIGp1c3Qgc2tpcCBpdFxuICAgIGlmIChub2RlLmxheW91dFtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV2Ugb25seSBydW4gaWYgdGhlcmUncyBhIHdpZHRoIG9yIGhlaWdodCBkZWZpbmVkXG4gICAgaWYgKCFpc0RpbURlZmluZWQobm9kZSwgYXhpcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGltZW5zaW9ucyBjYW4gbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJcbiAgICBub2RlLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICBib3VuZEF4aXMobm9kZSwgYXhpcywgbm9kZS5zdHlsZVtkaW1bYXhpc11dKSxcbiAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGF4aXMpIHtcbiAgICBjaGlsZC5sYXlvdXRbdHJhaWxpbmdbYXhpc11dID0gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dIC0gY2hpbGQubGF5b3V0W3Bvc1theGlzXV07XG4gIH1cblxuICAvLyBJZiBib3RoIGxlZnQgYW5kIHJpZ2h0IGFyZSBkZWZpbmVkLCB0aGVuIHVzZSBsZWZ0LiBPdGhlcndpc2UgcmV0dXJuXG4gIC8vICtsZWZ0IG9yIC1yaWdodCBkZXBlbmRpbmcgb24gd2hpY2ggaXMgZGVmaW5lZC5cbiAgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbbGVhZGluZ1theGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGdldFBvc2l0aW9uKG5vZGUsIGxlYWRpbmdbYXhpc10pO1xuICAgIH1cbiAgICByZXR1cm4gLWdldFBvc2l0aW9uKG5vZGUsIHRyYWlsaW5nW2F4aXNdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCAvKmNzc19kaXJlY3Rpb25fdCovcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyLypjc3NfZGlyZWN0aW9uX3QqLyBkaXJlY3Rpb24gPSByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIG1haW5BeGlzID0gcmVzb2x2ZUF4aXMoZ2V0RmxleERpcmVjdGlvbihub2RlKSwgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gY3Jvc3NBeGlzID0gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKG1haW5BeGlzLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyByZXNvbHZlZFJvd0F4aXMgPSByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuXG4gICAgLy8gSGFuZGxlIHdpZHRoIGFuZCBoZWlnaHQgc3R5bGUgYXR0cmlidXRlc1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBtYWluQXhpcyk7XG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBTZXQgdGhlIHJlc29sdmVkIHJlc29sdXRpb24gaW4gdGhlIG5vZGUncyBsYXlvdXRcbiAgICBub2RlLmxheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgc2V0IGJ5IHRoZSBwYXJlbnQsIGJ1dCB3ZSBuZWVkIHRvIGNvbXBsZXRlIGl0IHdpdGggYVxuICAgIC8vIGRlbHRhIGNvbXBvc2VkIG9mIHRoZSBtYXJnaW4gYW5kIGxlZnQvdG9wL3JpZ2h0L2JvdHRvbVxuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbbWFpbkF4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1ttYWluQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFtsZWFkaW5nW2Nyb3NzQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBJbmxpbmUgaW1tdXRhYmxlIHZhbHVlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZSB0byBhdm9pZCBleGNlc3NpdmUgbWV0aG9kXG4gICAgLy8gaW52b2NhdGlvbnMgZHVyaW5nIHRoZSBsYXlvdXQgY2FsY3VsYXRpb24uXG4gICAgdmFyLyppbnQqLyBjaGlsZENvdW50ID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3cgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuXG4gICAgaWYgKGlzTWVhc3VyZURlZmluZWQobm9kZSkpIHtcbiAgICAgIHZhci8qYm9vbCovIGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSk7XG5cbiAgICAgIHZhci8qZmxvYXQqLyB3aWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLnN0eWxlLndpZHRoO1xuICAgICAgfSBlbHNlIGlmIChpc1Jlc29sdmVkUm93RGltRGVmaW5lZCkge1xuICAgICAgICB3aWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoIC09IHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBnaXZlIGEgZGltZW5zaW9uIGZvciB0aGUgdGV4dCBpZiB3ZSBoYXZlbid0IGdvdCBhbnlcbiAgICAgIC8vIGZvciBpdCBjb21wdXRlZCB5ZXQuIEl0IGNhbiBlaXRoZXIgYmUgZnJvbSB0aGUgc3R5bGUgYXR0cmlidXRlIG9yIGJlY2F1c2VcbiAgICAgIC8vIHRoZSBlbGVtZW50IGlzIGZsZXhpYmxlLlxuICAgICAgdmFyLypib29sKi8gaXNSb3dVbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykgJiYgIWlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkO1xuICAgICAgdmFyLypib29sKi8gaXNDb2x1bW5VbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pICYmXG4gICAgICAgIGlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OXV0pO1xuXG4gICAgICAvLyBMZXQncyBub3QgbWVhc3VyZSB0aGUgdGV4dCBpZiB3ZSBhbHJlYWR5IGtub3cgYm90aCBkaW1lbnNpb25zXG4gICAgICBpZiAoaXNSb3dVbmRlZmluZWQgfHwgaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgdmFyLypjc3NfZGltX3QqLyBtZWFzdXJlRGltID0gbm9kZS5zdHlsZS5tZWFzdXJlKFxuICAgICAgICAgIC8qKGMpIW5vZGUtPmNvbnRleHQsKi9cbiAgICAgICAgICAvKihqYXZhKSFsYXlvdXRDb250ZXh0Lm1lYXN1cmVPdXRwdXQsKi9cbiAgICAgICAgICB3aWR0aFxuICAgICAgICApO1xuICAgICAgICBpZiAoaXNSb3dVbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC53aWR0aCA9IG1lYXN1cmVEaW0ud2lkdGggK1xuICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBtZWFzdXJlRGltLmhlaWdodCArXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIGlzTm9kZUZsZXhXcmFwID0gaXNGbGV4V3JhcChub2RlKTtcblxuICAgIHZhci8qY3NzX2p1c3RpZnlfdCovIGp1c3RpZnlDb250ZW50ID0gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSk7XG5cbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIHZhci8qYm9vbCovIGlzTWFpbkRpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzQ3Jvc3NEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNNYWluUm93RGlyZWN0aW9uID0gaXNSb3dEaXJlY3Rpb24obWFpbkF4aXMpO1xuXG4gICAgdmFyLyppbnQqLyBpO1xuICAgIHZhci8qaW50Ki8gaWk7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGNoaWxkO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBheGlzO1xuXG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcblxuICAgIHZhci8qZmxvYXQqLyBkZWZpbmVkTWFpbkRpbSA9IENTU19VTkRFRklORUQ7XG4gICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIGRlZmluZWRNYWluRGltID0gbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gLSBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW47XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBleGVjdXRlIHRoZSBuZXh0IHR3byBsb29wcyBvbmUgcGVyIGxpbmUgd2l0aCBmbGV4LXdyYXBcbiAgICB2YXIvKmludCovIHN0YXJ0TGluZSA9IDA7XG4gICAgdmFyLyppbnQqLyBlbmRMaW5lID0gMDtcbiAgICAvLyB2YXIvKmludCovIG5leHRPZmZzZXQgPSAwO1xuICAgIHZhci8qaW50Ki8gYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgLy8gV2UgYWdncmVnYXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZSBjb250YWluZXIgaW4gdGhvc2UgdHdvIHZhcmlhYmxlc1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc0Nyb3NzRGltID0gMDtcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNNYWluRGltID0gMDtcbiAgICB2YXIvKmludCovIGxpbmVzQ291bnQgPSAwO1xuICAgIHdoaWxlIChlbmRMaW5lIDwgY2hpbGRDb3VudCkge1xuICAgICAgLy8gPExvb3AgQT4gTGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgY291bnQgY2hpbGRyZW4gYnkgdHlwZVxuXG4gICAgICAvLyBtYWluQ29udGVudERpbSBpcyBhY2N1bXVsYXRpb24gb2YgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbiBvZiBhbGwgdGhlXG4gICAgICAvLyBub24gZmxleGlibGUgY2hpbGRyZW4uIFRoaXMgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGVpdGhlciBzZXQgdGhlXG4gICAgICAvLyBkaW1lbnNpb25zIG9mIHRoZSBub2RlIGlmIG5vbmUgYWxyZWFkeSBleGlzdCwgb3IgdG8gY29tcHV0ZSB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZSBsZWZ0IGZvciB0aGUgZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkNvbnRlbnREaW0gPSAwO1xuXG4gICAgICAvLyBUaGVyZSBhcmUgdGhyZWUga2luZCBvZiBjaGlsZHJlbiwgbm9uIGZsZXhpYmxlLCBmbGV4aWJsZSBhbmQgYWJzb2x1dGUuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGhlcmUgYXJlIGluIG9yZGVyIHRvIGRpc3RyaWJ1dGUgdGhlIHNwYWNlLlxuICAgICAgdmFyLyppbnQqLyBmbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIHRvdGFsRmxleGlibGUgPSAwO1xuICAgICAgdmFyLyppbnQqLyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuXG4gICAgICAvLyBVc2UgdGhlIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgbWFpbiBheGlzIGZvciBhcyBsb25nXG4gICAgICAvLyBhcyB0aGV5IGFyZSB1c2luZyBhIHNpbXBsZSBzdGFja2luZyBiZWhhdmlvdXIuIENoaWxkcmVuIHRoYXQgYXJlXG4gICAgICAvLyBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3Agd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpblxuICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrTWFpbiA9XG4gICAgICAgICAgKGlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgKCFpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9DRU5URVIpO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhNYWluID0gKGlzU2ltcGxlU3RhY2tNYWluID8gY2hpbGRDb3VudCA6IHN0YXJ0TGluZSk7XG5cbiAgICAgIC8vIFVzZSB0aGUgaW5pdGlhbCBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIGNyb3NzIGF4aXMgZm9yXG4gICAgICAvLyBhcyBsb25nIGFzIHRoZXkgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCB3aXRoIGFsaWdubWVudCBTVFJFVENIIG9yXG4gICAgICAvLyBGTEVYX1NUQVJULiBDaGlsZHJlbiB0aGF0IGFyZSBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3BcbiAgICAgIC8vIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW4gaW4gPExvb3AgRD4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSB0cnVlO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhDcm9zcyA9IGNoaWxkQ291bnQ7XG5cbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluO1xuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltID0gMDtcblxuICAgICAgdmFyLypmbG9hdCovIG1heFdpZHRoO1xuICAgICAgZm9yIChpID0gc3RhcnRMaW5lOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgY2hpbGQubGluZUluZGV4ID0gbGluZXNDb3VudDtcblxuICAgICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuXG4gICAgICAgIC8vIFByZS1maWxsIGNyb3NzIGF4aXMgZGltZW5zaW9ucyB3aGVuIHRoZSBjaGlsZCBpcyB1c2luZyBzdHJldGNoIGJlZm9yZVxuICAgICAgICAvLyB3ZSBjYWxsIHRoZSByZWN1cnNpdmUgbGF5b3V0IHBhc3NcbiAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiZcbiAgICAgICAgICAgIGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgICAgICAgaXNDcm9zc0RpbURlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGNyb3NzQXhpcykpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUpIHtcbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNoaWxkcmVuXG4gICAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RBYnNvbHV0ZUNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aFxuICAgICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSxcbiAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBheGlzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhci8qZmxvYXQqLyBuZXh0Q29udGVudERpbSA9IDA7XG5cbiAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBjb25zaWRlciBhIGNoaWxkIGZsZXhpYmxlIGlmIHdlIGhhdmUgYSBjb21wdXRlZFxuICAgICAgICAvLyBkaW1lbnNpb24gZm9yIHRoZSBub2RlLlxuICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCAmJiBpc0ZsZXgoY2hpbGQpKSB7XG4gICAgICAgICAgZmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgdG90YWxGbGV4aWJsZSArPSBjaGlsZC5zdHlsZS5mbGV4O1xuXG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGZsZXhpYmxlIGNoaWxkcmVuIHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RGbGV4Q2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBrbm93IGl0cyBleGFjdCBzaXplIHlldCwgd2UgYWxyZWFkeSBrbm93IHRoZSBwYWRkaW5nLFxuICAgICAgICAgIC8vIGJvcmRlciBhbmQgbWFyZ2luLiBXZSdsbCB1c2UgdGhpcyBwYXJ0aWFsIGluZm9ybWF0aW9uLCB3aGljaCByZXByZXNlbnRzXG4gICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNpemUgZm9yIHRoZSBjaGlsZCwgdG8gY29tcHV0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAgICAgLy8gYXZhaWxhYmxlIHNwYWNlLlxuICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBtYWluQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBtYWluIHJlY3Vyc2l2ZSBjYWxsLiBXZSBsYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgICAgIGlmIChhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID09PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFic29sdXRlIHBvc2l0aW9uZWQgZWxlbWVudHMgZG8gbm90IHRha2UgcGFydCBvZiB0aGUgbGF5b3V0LCBzbyB3ZVxuICAgICAgICAgIC8vIGRvbid0IHVzZSB0aGVtIHRvIGNvbXB1dGUgbWFpbkNvbnRlbnREaW1cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBhbmQgbWFyZ2luIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGVsZW1lbnQgd2UgYXJlIGFib3V0IHRvIGFkZCB3b3VsZCBtYWtlIHVzIGdvIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgICAgaWYgKGlzTm9kZUZsZXhXcmFwICYmXG4gICAgICAgICAgICBpc01haW5EaW1EZWZpbmVkICYmXG4gICAgICAgICAgICBtYWluQ29udGVudERpbSArIG5leHRDb250ZW50RGltID4gZGVmaW5lZE1haW5EaW0gJiZcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZWxlbWVudCwgdGhlbiBpdCdzIGJpZ2dlciB0aGFuIHRoZSBjb250ZW50XG4gICAgICAgICAgICAvLyBhbmQgbmVlZHMgaXRzIG93biBsaW5lXG4gICAgICAgICAgICBpICE9PSBzdGFydExpbmUpIHtcbiAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQtLTtcbiAgICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBtYWluIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4gJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHwgaXNGbGV4KGNoaWxkKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrTWFpbiA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleE1haW4gPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIGNyb3NzIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEQ+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8XG4gICAgICAgICAgICAgICAgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiYgYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAgICAgICBpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhDcm9zcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4pIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1haW5EaW0gKz0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgICAgIG1haW5Db250ZW50RGltICs9IG5leHRDb250ZW50RGltO1xuICAgICAgICBlbmRMaW5lID0gaSArIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEI+IExheW91dCBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgYWxsb2NhdGUgZW1wdHkgc3BhY2VcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gcG9zaXRpb24gdGhlIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMsIHdlIGhhdmUgdHdvXG4gICAgICAvLyBjb250cm9scy4gVGhlIHNwYWNlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIGFuZCB0aGUgc3BhY2UgYmV0d2VlbiBlYWNoIHR3byBlbGVtZW50cy5cbiAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nTWFpbkRpbSA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gYmV0d2Vlbk1haW5EaW0gPSAwO1xuXG4gICAgICAvLyBUaGUgcmVtYWluaW5nIGF2YWlsYWJsZSBzcGFjZSB0aGF0IG5lZWRzIHRvIGJlIGFsbG9jYXRlZFxuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ01haW5EaW0gPSAwO1xuICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGRlZmluZWRNYWluRGltIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYobWFpbkNvbnRlbnREaW0sIDApIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBmbGV4aWJsZSBjaGlsZHJlbiBpbiB0aGUgbWl4LCB0aGV5IGFyZSBnb2luZyB0byBmaWxsIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlXG4gICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICE9PSAwKSB7XG4gICAgICAgIHZhci8qZmxvYXQqLyBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJhc2VNYWluRGltO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYm91bmRNYWluRGltO1xuXG4gICAgICAgIC8vIElmIHRoZSBmbGV4IHNoYXJlIG9mIHJlbWFpbmluZyBzcGFjZSBkb2Vzbid0IG1lZXQgbWluL21heCBib3VuZHMsXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGNoaWxkIGZyb20gZmxleCBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICBiYXNlTWFpbkRpbSA9IGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBib3VuZE1haW5EaW0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsIGJhc2VNYWluRGltKTtcblxuICAgICAgICAgIGlmIChiYXNlTWFpbkRpbSAhPT0gYm91bmRNYWluRGltKSB7XG4gICAgICAgICAgICByZW1haW5pbmdNYWluRGltIC09IGJvdW5kTWFpbkRpbTtcbiAgICAgICAgICAgIHRvdGFsRmxleGlibGUgLT0gY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG5cbiAgICAgICAgLy8gVGhlIG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBjYW4gb3ZlcmZsb3cgdGhlIGNvbnRhaW5lciwgaW4gdGhpcyBjYXNlXG4gICAgICAgIC8vIHdlIHNob3VsZCBqdXN0IGFzc3VtZSB0aGF0IHRoZXJlIGlzIG5vIHNwYWNlIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGZsZXhpYmxlTWFpbkRpbSA8IDApIHtcbiAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbWFpblxuICAgICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubGF5b3V0W2RpbVttYWluQXhpc11dID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLFxuICAgICAgICAgICAgZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIHJlY3Vyc2l2ZWx5IGNhbGwgdGhlIGxheW91dCBhbGdvcml0aG0gZm9yIHRoaXMgY2hpbGRcbiAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY3VycmVudEZsZXhDaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICBjaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UganVzdGlmeUNvbnRlbnQgdG8gZmlndXJlIG91dCBob3cgdG8gYWxsb2NhdGUgdGhlIHJlbWFpbmluZ1xuICAgICAgLy8gc3BhY2UgYXZhaWxhYmxlXG4gICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB7XG4gICAgICAgIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfQ0VOVEVSKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9FTkQpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW07XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4pIHtcbiAgICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYocmVtYWluaW5nTWFpbkRpbSwgMCk7XG4gICAgICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEgIT09IDApIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EKSB7XG4gICAgICAgICAgLy8gU3BhY2Ugb24gdGhlIGVkZ2VzIGlzIGhhbGYgb2YgdGhlIHNwYWNlIGJldHdlZW4gZWxlbWVudHNcbiAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCk7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSBiZXR3ZWVuTWFpbkRpbSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQz4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcyBhbmQgY29tcHV0ZSBkaW1lbnNpb25zXG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIGFsbCB0aGUgY2hpbGRyZW4gaGF2ZSB0aGVpciBkaW1lbnNpb25zIHNldC4gV2UgbmVlZCB0b1xuICAgICAgLy8gZmluZCB0aGVpciBwb3NpdGlvbi4gSW4gb3JkZXIgdG8gZG8gdGhhdCwgd2UgYWNjdW11bGF0ZSBkYXRhIGluXG4gICAgICAvLyB2YXJpYWJsZXMgdGhhdCBhcmUgYWxzbyB1c2VmdWwgdG8gY29tcHV0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGVcbiAgICAgIC8vIGNvbnRhaW5lciFcbiAgICAgIG1haW5EaW0gKz0gbGVhZGluZ01haW5EaW07XG5cbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleE1haW47IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgYW5kIGhhcyBsZWZ0L3RvcCBiZWluZ1xuICAgICAgICAgIC8vIGRlZmluZWQsIHdlIG92ZXJyaWRlIHRoZSBwb3NpdGlvbiB0byB3aGF0ZXZlciB0aGUgdXNlciBzYWlkXG4gICAgICAgICAgLy8gKGFuZCBtYXJnaW4vYm9yZGVyKS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgKHdpdGhvdXQgdG9wL2xlZnQpIG9yIHJlbGF0aXZlLFxuICAgICAgICAgIC8vIHdlIHB1dCBpdCBhdCB0aGUgY3VycmVudCBhY2N1bXVsYXRlZCBvZmZzZXQuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UgcGxhY2VkIHRoZSBlbGVtZW50LCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFyaWFibGVzXG4gICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGRvIHRoYXQgZm9yIHJlbGF0aXZlIGVsZW1lbnRzLiBBYnNvbHV0ZSBlbGVtZW50c1xuICAgICAgICAgIC8vIGRvIG5vdCB0YWtlIHBhcnQgaW4gdGhhdCBwaGFzZS5cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvLyBUaGUgbWFpbiBkaW1lbnNpb24gaXMgdGhlIHN1bSBvZiBhbGwgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBwbHVzXG4gICAgICAgICAgICAvLyB0aGUgc3BhY2luZy5cbiAgICAgICAgICAgIG1haW5EaW0gKz0gYmV0d2Vlbk1haW5EaW0gKyBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgICAvLyBUaGUgY3Jvc3MgZGltZW5zaW9uIGlzIHRoZSBtYXggb2YgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBzaW5jZSB0aGVyZVxuICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIGVsZW1lbnQgaW4gdGhhdCBjcm9zcyBkaW1lbnNpb24uXG4gICAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmZsb2F0Ki8gY29udGFpbmVyQ3Jvc3NBeGlzID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICBjb250YWluZXJDcm9zc0F4aXMgPSBmbWF4ZihcbiAgICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGNyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBEPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4Q3Jvc3M7IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIGFic29sdXRlbHkgcG9zaXRpb25uZWQgYW5kIGhhcyBhXG4gICAgICAgICAgLy8gdG9wL2xlZnQvYm90dG9tL3JpZ2h0IGJlaW5nIHNldCwgd2Ugb3ZlcnJpZGUgYWxsIHRoZSBwcmV2aW91c2x5XG4gICAgICAgICAgLy8gY29tcHV0ZWQgcG9zaXRpb25zIHRvIHNldCBpdCBjb3JyZWN0bHkuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdDcm9zc0RpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgICAgICAvLyBGb3IgYSByZWxhdGl2ZSBjaGlsZHJlbiwgd2UncmUgZWl0aGVyIHVzaW5nIGFsaWduSXRlbXMgKHBhcmVudCkgb3JcbiAgICAgICAgICAvLyBhbGlnblNlbGYgKGNoaWxkKSBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIHBvc2l0aW9uIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgLy8gVGhpcyB2YXJpYWJsZSBpcyBpbnRlbnRpb25hbGx5IHJlLWRlZmluZWQgYXMgdGhlIGNvZGUgaXMgdHJhbnNwaWxlZCB0byBhIGJsb2NrIHNjb3BlIGxhbmd1YWdlXG4gICAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgLy8gWW91IGNhbiBvbmx5IHN0cmV0Y2ggaWYgdGhlIGRpbWVuc2lvbiBoYXMgbm90IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgICAgICAgICAgLy8gcHJldmlvdXNseS5cbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIHNwYWNlIGJldHdlZW4gdGhlIHBhcmVudCBkaW1lbnNpb25zK3BhZGRpbmcgYW5kIGNoaWxkXG4gICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnMrbWFyZ2luLlxuICAgICAgICAgICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQ3Jvc3NEaW0gPSBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW0gLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDU1NfQUxJR05fRkxFWF9FTkRcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgYXBwbHkgdGhlIHBvc2l0aW9uXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ0Nyb3NzRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmVzQ3Jvc3NEaW0gKz0gY3Jvc3NEaW07XG4gICAgICBsaW5lc01haW5EaW0gPSBmbWF4ZihsaW5lc01haW5EaW0sIG1haW5EaW0pO1xuICAgICAgbGluZXNDb3VudCArPSAxO1xuICAgICAgc3RhcnRMaW5lID0gZW5kTGluZTtcbiAgICB9XG5cbiAgICAvLyA8TG9vcCBFPlxuICAgIC8vXG4gICAgLy8gTm90ZShwcmVuYXV4KTogTW9yZSB0aGFuIG9uZSBsaW5lLCB3ZSBuZWVkIHRvIGxheW91dCB0aGUgY3Jvc3NBeGlzXG4gICAgLy8gYWNjb3JkaW5nIHRvIGFsaWduQ29udGVudC5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb3VsZCBwcm9iYWJseSByZW1vdmUgPExvb3AgRD4gYW5kIGhhbmRsZSB0aGUgb25lIGxpbmUgY2FzZVxuICAgIC8vIGhlcmUgdG9vLCBidXQgZm9yIHRoZSBtb21lbnQgdGhpcyBpcyBzYWZlciBzaW5jZSBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aFxuICAgIC8vIHByZXZpb3VzbHkgd29ya2luZyBjb2RlLlxuICAgIC8vXG4gICAgLy8gU2VlIHNwZWNzOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTIvQ1ItY3NzMy1mbGV4Ym94LTIwMTIwOTE4LyNsYXlvdXQtYWxnb3JpdGhtXG4gICAgLy8gc2VjdGlvbiA5LjRcbiAgICAvL1xuICAgIGlmIChsaW5lc0NvdW50ID4gMSAmJiBpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgdmFyLypmbG9hdCovIG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3M7XG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQWxpZ25Db250ZW50RGltID0gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSAtIGxpbmVzQ3Jvc3NEaW07XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbUxlYWQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGN1cnJlbnRMZWFkID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudCA9IGdldEFsaWduQ29udGVudChub2RlKTtcbiAgICAgIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyAyO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgIGlmIChub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID4gbGluZXNDcm9zc0RpbSkge1xuICAgICAgICAgIGNyb3NzRGltTGVhZCA9IChyZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyBsaW5lc0NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmludCovIGVuZEluZGV4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lc0NvdW50OyArK2kpIHtcbiAgICAgICAgdmFyLyppbnQqLyBzdGFydEluZGV4ID0gZW5kSW5kZXg7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbGluZSdzIGhlaWdodCBhbmQgZmluZCB0aGUgZW5kSW5kZXhcbiAgICAgICAgdmFyLypmbG9hdCovIGxpbmVIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBjaGlsZENvdW50OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoaWxkLmxpbmVJbmRleCAhPT0gaSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSBmbWF4ZihcbiAgICAgICAgICAgICAgbGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSArIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuZEluZGV4ID0gaWk7XG4gICAgICAgIGxpbmVIZWlnaHQgKz0gY3Jvc3NEaW1MZWFkO1xuXG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGVuZEluZGV4OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50QWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBsaW5lSGVpZ2h0IC0gZ2V0VHJhaWxpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykgLSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICB2YXIvKmZsb2F0Ki8gY2hpbGRIZWlnaHQgPSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgKGxpbmVIZWlnaHQgLSBjaGlsZEhlaWdodCkgLyAyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICAgIC8vIFRPRE8ocHJlbmF1eCk6IENvcnJlY3RseSBzZXQgdGhlIGhlaWdodCBvZiBpdGVtcyB3aXRoIHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGF1dG8pIGNyb3NzQXhpcyBkaW1lbnNpb24uXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExlYWQgKz0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBuZWVkc01haW5UcmFpbGluZ1BvcyA9IGZhbHNlO1xuICAgIHZhci8qYm9vbCovIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZnkgYSB3aWR0aCBvciBoZWlnaHQsIGFuZCBpdCBoYXMgbm90IGJlZW4gc2V0XG4gICAgLy8gYnkgdGhlIGNvbnRhaW5lciwgdGhlbiB3ZSBzZXQgaXQgdmlhIHRoZSBjaGlsZHJlbi5cbiAgICBpZiAoIWlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIFdlJ3JlIG1pc3NpbmcgdGhlIGxhc3QgcGFkZGluZyBhdCB0aGlzIHBvaW50IHRvIGdldCB0aGUgZmluYWxcbiAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBtYWluQXhpcywgbGluZXNNYWluRGltICsgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKSksXG4gICAgICAgIC8vIFdlIGNhbiBuZXZlciBhc3NpZ24gYSB3aWR0aCBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlcnNcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluXG4gICAgICApO1xuXG4gICAgICBpZiAobWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNNYWluVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGxpbmVzQ3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgKTtcblxuICAgICAgaWYgKGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBGPiBTZXQgdHJhaWxpbmcgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zIHx8IG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBHPiBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzXG4gICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBmaXJzdEFic29sdXRlQ2hpbGQ7XG4gICAgd2hpbGUgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3JcbiAgICAgIC8vIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aCBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgIWlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbbGVhZGluZ1theGlzXV0gPVxuICAgICAgICAgICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQ7XG4gICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGUobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbikge1xuICAgIG5vZGUuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblxuICAgIHZhciBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbiB8fCBDU1NfRElSRUNUSU9OX0xUUjtcbiAgICB2YXIgc2tpcExheW91dCA9XG4gICAgICAhbm9kZS5pc0RpcnR5ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPT09IG5vZGUubGF5b3V0LmhlaWdodCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID09PSBub2RlLmxheW91dC53aWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID09PSBwYXJlbnRNYXhXaWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uO1xuXG4gICAgLy8gY29uc29sZS5sb2coJ3NraXBMYXlvdXQnLCBza2lwTGF5b3V0LCBub2RlKVxuICAgIGlmIChza2lwTGF5b3V0KSB7XG4gICAgICBub2RlLmxheW91dC53aWR0aCA9IG5vZGUubGFzdExheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG5vZGUubGFzdExheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxheW91dC50b3AgPSBub2RlLmxhc3RMYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXlvdXQubGVmdCA9IG5vZGUubGFzdExheW91dC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW5vZGUubGFzdExheW91dCkge1xuICAgICAgICBub2RlLmxhc3RMYXlvdXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID0gcGFyZW50TWF4V2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgICAvLyBSZXNldCBjaGlsZCBsYXlvdXRzXG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgY2hpbGQubGF5b3V0LndpZHRoID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQuaGVpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQudG9wID0gMDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmxlZnQgPSAwO1xuICAgICAgfSk7XG5cbiAgICAgIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pO1xuXG4gICAgICBub2RlLmxhc3RMYXlvdXQud2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5oZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQudG9wID0gbm9kZS5sYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmxlZnQgPSBub2RlLmxheW91dC5sZWZ0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGF5b3V0Tm9kZUltcGw6IGxheW91dE5vZGVJbXBsLFxuICAgIGNvbXB1dGVMYXlvdXQ6IGxheW91dE5vZGUsXG4gICAgZmlsbE5vZGVzOiBmaWxsTm9kZXNcbiAgfTtcbn0pKCk7XG5cbi8vIFRoaXMgbW9kdWxlIGV4cG9ydCBpcyBvbmx5IHVzZWQgZm9yIHRoZSBwdXJwb3NlcyBvZiB1bml0IHRlc3RpbmcgdGhpcyBmaWxlLiBXaGVuXG4vLyB0aGUgbGlicmFyeSBpcyBwYWNrYWdlZCB0aGlzIGZpbGUgaXMgaW5jbHVkZWQgd2l0aGluIGNzcy1sYXlvdXQuanMgd2hpY2ggZm9ybXNcbi8vIHRoZSBwdWJsaWMgQVBJLlxuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbXB1dGVMYXlvdXQ7XG59XG5cblxuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAvLyBkaXNhYmxpbmcgRVNMaW50IGJlY2F1c2UgdGhpcyBjb2RlIHJlbGllcyBvbiB0aGUgYWJvdmUgaW5jbHVkZVxuICAgIGNvbXB1dGVMYXlvdXQuZmlsbE5vZGVzKG5vZGUpO1xuICAgIGNvbXB1dGVMYXlvdXQuY29tcHV0ZUxheW91dChub2RlKTtcbiAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgfTtcbn0pKTtcbiIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xubW9kdWxlLmV4cG9ydHMuVGlueUVtaXR0ZXIgPSBFO1xuIiwiaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2ltYWdlTWFuYWdlcic7XG5jb25zdCBFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMudGV4dHVyZSA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2Uoc3JjLCAodGV4dHVyZSwgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICB9XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXZlbnQuZW1pdCgndGV4dF9fbG9hZF9fZG9uZScpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2VDb25maWcoZm50VGV4dDogc3RyaW5nKSB7XG4gICAgZm50VGV4dCA9IGZudFRleHQuc3BsaXQoJ1xcclxcbicpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IGZudFRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS50cmltKCkuc3BsaXQoJyAnKSk7XG5cbiAgICBjb25zdCBjaGFyc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY2hhcnMnKTtcbiAgICBjb25zdCBjaGFyc0NvdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJzTGluZS5saW5lLCAnY291bnQnKTtcblxuICAgIGNvbnN0IGNvbW1vbkxpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY29tbW9uJyk7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjb21tb25MaW5lLmxpbmUsICdsaW5lSGVpZ2h0Jyk7XG5cbiAgICBjb25zdCBpbmZvTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdpbmZvJyk7XG4gICAgdGhpcy5mb250U2l6ZSA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoaW5mb0xpbmUubGluZSwgJ3NpemUnKTtcblxuICAgIC8vIOaOpeWNuCBrZXJuaW5nc1xuICAgIGNvbnN0IGtlcm5pbmdzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdrZXJuaW5ncycpO1xuICAgIGxldCBrZXJuaW5nc0NvdW50ID0gMDtcbiAgICBsZXQga2VybmluZ3NTdGFydCA9IC0xO1xuICAgIGlmIChrZXJuaW5nc0xpbmUubGluZSkge1xuICAgICAga2VybmluZ3NDb3VudCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoa2VybmluZ3NMaW5lLmxpbmUsICdjb3VudCcpO1xuICAgICAga2VybmluZ3NTdGFydCA9IGtlcm5pbmdzTGluZS5pbmRleCArIDE7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcnM6IENoYXJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDQ7IGkgPCA0ICsgY2hhcnNDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyVGV4dDogc3RyaW5nID0gbGluZXNbaV07XG4gICAgICBjb25zdCBsZXR0ZXI6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2lkJykpO1xuXG4gICAgICBjb25zdCBjOiBDaGFyRGF0YSA9IHtcbiAgICAgICAgeDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3gnKSxcbiAgICAgICAgeTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3knKSxcbiAgICAgICAgdzogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3dpZHRoJyksXG4gICAgICAgIGg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdoZWlnaHQnKSxcbiAgICAgICAgb2ZmWDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hvZmZzZXQnKSxcbiAgICAgICAgb2ZmWTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3lvZmZzZXQnKSxcbiAgICAgICAgeGFkdmFuY2U6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4YWR2YW5jZScpLFxuICAgICAgICBrZXJuaW5nOiB7fVxuICAgICAgfTtcbiAgICAgIGNoYXJzW2xldHRlcl0gPSBjO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIGtlcm5pbmdzXG4gICAgaWYgKGtlcm5pbmdzQ291bnQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBrZXJuaW5nc1N0YXJ0OyBpIDw9IGtlcm5pbmdzU3RhcnQgKyBrZXJuaW5nc0NvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcbiAgICAgICAgY29uc3QgZmlyc3Q6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnZmlyc3QnKSk7XG4gICAgICAgIGNvbnN0IHNlY29uZDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdzZWNvbmQnKSk7XG4gICAgICAgIGNvbnN0IGFtb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnYW1vdW50Jyk7XG5cbiAgICAgICAgaWYgKGNoYXJzW3NlY29uZF0pIHtcbiAgICAgICAgICBjaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJzO1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZDogc3RyaW5nW11bXSwgbGluZU5hbWUgPSAnJyk6IENvbmZpZ0xpbmVEYXRhIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGluZTogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBsZW4gPSBsaW5lc1BhcnNlZC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuXG4gICAgICBpZiAoaXRlbVswXSA9PT0gbGluZU5hbWUpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBsaW5lID0gaXRlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZSxcbiAgICAgIGluZGV4LFxuICAgIH07XG4gIH1cblxuICBnZXRDb25maWdCeUtleUluT25lTGluZShjb25maWdUZXh0OiBzdHJpbmdbXSB8IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtQ29uZmlnVGV4dExpc3QgPSBBcnJheS5pc0FycmF5KGNvbmZpZ1RleHQpID8gY29uZmlnVGV4dCA6IGNvbmZpZ1RleHQuc3BsaXQoJyAnKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gaXRlbUNvbmZpZ1RleHRMaXN0OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0ID0gaXRlbUNvbmZpZ1RleHRMaXN0W2ldO1xuICAgICAgaWYgKGtleSA9PT0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKDAsIGtleS5sZW5ndGgpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKGtleS5sZW5ndGggKyAxKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufVxuIiwiaW50ZXJmYWNlIERlYnVnSW5mb0l0ZW0ge1xuICBzdGFydDogbnVtYmVyO1xuICBpc0lubmVyOiBib29sZWFuO1xuICBlbmQ/OiBudW1iZXI7XG4gIGNvc3Q/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlYnVnSW5mbyB7XG4gIHB1YmxpYyBpbmZvOiB7IFtrZXk6IHN0cmluZ106IERlYnVnSW5mb0l0ZW0gfSA9IHt9O1xuICBwdWJsaWMgdG90YWxTdGFydDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvdGFsQ29zdDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBzdGFydChuYW1lOiBzdHJpbmcsIGlzSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLnRvdGFsU3RhcnQgPT09IDApIHtcbiAgICAgIHRoaXMudG90YWxTdGFydCA9IERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmZvW25hbWVdID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBpc0lubmVyLFxuICAgIH07XG4gIH1cblxuICBlbmQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaW5mb1tuYW1lXSkge1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmVuZCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uY29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLmluZm9bbmFtZV0uc3RhcnQ7XG4gICAgICB0aGlzLnRvdGFsQ29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLnRvdGFsU3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbmZvID0ge307XG4gICAgdGhpcy50b3RhbFN0YXJ0ID0gMDtcbiAgICB0aGlzLnRvdGFsQ29zdCA9IDA7XG4gIH1cblxuICBsb2cobmVlZElubmVyOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBsb2dJbmZvID0gJ0xheW91dCBkZWJ1ZyBpbmZvOiBcXG4nO1xuICAgIGxvZ0luZm8gKz0gT2JqZWN0LmtleXModGhpcy5pbmZvKS5yZWR1Y2UoKHN1bSwgY3VycikgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5mb1tjdXJyXS5pc0lubmVyICYmICFuZWVkSW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBgJHtjdXJyfTogJHt0aGlzLmluZm9bY3Vycl0uY29zdH1cXG5gO1xuICAgICAgcmV0dXJuIHN1bTtcbiAgICB9LCAnJyk7XG5cbiAgICBsb2dJbmZvICs9IGB0b3RhbENvc3Q6ICR7dGhpcy50b3RhbENvc3R9XFxuYDtcblxuICAgIHJldHVybiBsb2dJbmZvO1xuICB9XG59XG4iLCJpbXBvcnQgUG9vbCBmcm9tICcuL3Bvb2wnO1xuaW1wb3J0IHsgbm9uZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBmcm9tQ2FjaGU6IGJvb2xlYW4pID0+IHZvaWQ7XG5pbnRlcmZhY2UgSW1hZ2VDYWNoZSB7XG4gIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgbG9hZERvbmU6IGJvb2xlYW47XG4gIG9ubG9hZGNia3M6IENhbGxiYWNrW107XG4gIG9uZXJyb3JjYmtzOiBDYWxsYmFja1tdO1xufVxuXG5jbGFzcyBJbWFnZU1hbmFnZXIge1xuICBwcml2YXRlIGltZ1Bvb2wgPSBuZXcgUG9vbDxJbWFnZUNhY2hlPignaW1nUG9vbCcpO1xuICBcbiAgZ2V0UmVzKHNyYzogc3RyaW5nKTogSW1hZ2VDYWNoZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1nUG9vbC5nZXQoc3JjKTtcbiAgfVxuXG4gIGxvYWRJbWFnZVByb21pc2Uoc3JjOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9hZEltYWdlKHNyYywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZShzcmM6IHN0cmluZywgc3VjY2VzczogQ2FsbGJhY2sgPSBub25lLCBmYWlsOiBDYWxsYmFjayA9IG5vbmUpOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbCB7XG4gICAgaWYgKCFzcmMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLmdldFJlcyhzcmMpO1xuXG4gICAgLy8g5Zu+54mH5bey57uP6KKr5Yqg6L296L+H77yM55u05o6l6L+U5Zue5Zu+54mH5bm25LiU5omn6KGM5Zue6LCDXG4gICAgaWYgKGNhY2hlICYmIGNhY2hlLmxvYWREb25lKSB7XG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG4gICAgICBzdWNjZXNzKGltZywgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChjYWNoZSAmJiAhY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIC8vIOWbvueJh+ato+WcqOWKoOi9vei/h+eoi+S4re+8jOi/lOWbnuWbvueJh+W5tuS4lOetieW+heWbvueJh+WKoOi9veWujOaIkOaJp+ihjOWbnuiwg1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuXG4gICAgICBjYWNoZS5vbmxvYWRjYmtzLnB1c2goc3VjY2Vzcyk7XG4gICAgICBjYWNoZS5vbmVycm9yY2Jrcy5wdXNoKGZhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDliJvlu7rlm77niYfvvIzlsIblm57osIPlh73mlbDmjqjlhaXlm57osIPlh73mlbDmoIhcbiAgICAgIGltZyA9IGVudi5jcmVhdGVJbWFnZSgpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHtcbiAgICAgICAgaW1nLFxuICAgICAgICBsb2FkRG9uZTogZmFsc2UsXG4gICAgICAgIG9ubG9hZGNia3M6IFtzdWNjZXNzXSxcbiAgICAgICAgb25lcnJvcmNia3M6IFtmYWlsXSxcbiAgICAgIH1cbiAgICAgXG4gICAgICB0aGlzLmltZ1Bvb2wuc2V0KHNyYywgbmV3Q2FjaGUpO1xuXG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5sb2FkRG9uZSA9IHRydWU7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbWFnZU1hbmFnZXIoKTtcbiIsImNvbnN0IHBvb2xzOiBQb29sPGFueT5bXSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sPFQ+IHtcbiAgcHVibGljIG5hbWUgPSAncG9vbCdcbiAgcHVibGljIHBvb2w6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG5cbiAgY29uc3RydWN0b3IobmFtZSA9ICdwb29sJykge1xuICAgIGNvbnN0IGN1cnIgPSBwb29scy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmIChjdXJyKSB7XG4gICAgICByZXR1cm4gY3VycjtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuXG4gICAgcG9vbHMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldChrZXk6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLnBvb2xba2V5XTtcbiAgfVxuXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQpIHtcbiAgICB0aGlzLnBvb2xba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5wb29sID0ge307XG4gIH1cblxuICBnZXRMaXN0KCk6IFRbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5wb29sKTtcbiAgfVxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIHdpZHRoID0gMDtcbiAgcHVibGljIGhlaWdodCA9IDA7XG4gIHB1YmxpYyBsZWZ0ID0gMDtcbiAgcHVibGljIHJpZ2h0ID0gMDtcbiAgcHVibGljIHRvcCA9IDA7XG4gIHB1YmxpYyBib3R0b20gPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLnNldChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgc2V0KGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIHRoaXMucmlnaHQgPSB0aGlzLmxlZnQgKyB0aGlzLndpZHRoO1xuICAgIHRoaXMuYm90dG9tID0gdGhpcy50b3AgKyB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiDliKTmlq3kuKTkuKrnn6nlvaLmmK/lkKbnm7jkuqRcbiAgICog5Y6f55CG5Y+v6KeBOiBodHRwczovL3podWFubGFuLnpoaWh1LmNvbS9wLzI5NzA0MDY0XG4gICAqL1xuICBpbnRlcnNlY3RzKHJlY3Q6IFJlY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISh0aGlzLnJpZ2h0IDwgcmVjdC5sZWZ0IHx8IHJlY3QucmlnaHQgPCB0aGlzLmxlZnQgfHwgdGhpcy5ib3R0b20gPCByZWN0LnRvcCB8fCByZWN0LmJvdHRvbSA8IHRoaXMudG9wKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2VyIHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBzdGFydGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYW5pbWF0aW9uSWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgY2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJDYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBuZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJOZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG5cbiAgcHJpdmF0ZSBsYXN0VGltZSE6IG51bWJlcjtcblxuICBwcml2YXRlIHVwZGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkZWx0YVRpbWUgPSB0aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICB0aGlzLmxhc3RUaW1lID0gdGltZTtcbiAgICAvLyBjb25zb2xlLmxvZyhkdClcbiAgICAvLyDkvJjlhYjmiafooYzkuJrliqHnmoR0aWNrZXLlm57osIPvvIzlm6DkuLrmnInlj6/og73kvJrop6blj5FyZWZsb3dcbiAgICB0aGlzLmNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlubmVyQ2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoZGVsdGFUaW1lKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmlubmVyTmV4dENicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG4gICAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm5leHRDYnMuZm9yRWFjaChjYiA9PiBjYihkZWx0YVRpbWUpKTtcblxuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICB9XG5cbiAgY2FuY2VsSWZOZWVkKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbklkKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jYnMuaW5kZXhPZihjYikgPT09IC0xKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lckNicy5wdXNoKGNiKSA6IHRoaXMuY2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIG5leHQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lck5leHRDYnMucHVzaChjYikgOiB0aGlzLm5leHRDYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlSW5uZXIoKSB7XG4gICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gIH1cblxuICByZW1vdmUoY2I/OiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKGNiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY2JzID0gW107XG4gICAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiAodGhpcy5jYnMuaW5kZXhPZihjYikgPiAtMSB8fCB0aGlzLmlubmVyQ2JzLmluZGV4T2YoY2IpID4gLTEpKSB7XG4gICAgICBjb25zdCBsaXN0ID0gaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMgOiB0aGlzLmNicztcbiAgICAgIGxpc3Quc3BsaWNlKHRoaXMuY2JzLmluZGV4T2YoY2IpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2JzLmxlbmd0aCAmJiAhdGhpcy5pbm5lckNicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMubGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5hbmltYXRpb25JZCA9PT0gbnVsbCAmJiAodGhpcy5jYnMubGVuZ3RoIHx8IHRoaXMuaW5uZXJDYnMubGVuZ3RoKSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBmdW5jdGlvbiBub25lKCkgeyB9XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBUb3VjaE1zZyB7XG4gIHRvdWNoc3RhcnQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB0b3VjaGVuZD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG59XG5cbi8qKlxuICog5qC55o2u6Kem5pG45pe26ZW/5ZKM6Kem5pG45L2N572u5Y+Y5YyW5p2l5Yik5pat5piv5ZCm5bGe5LqO54K55Ye75LqL5Lu2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWNrKHRvdWNoTXNnOiBUb3VjaE1zZykge1xuICBjb25zdCBzdGFydCA9IHRvdWNoTXNnLnRvdWNoc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHRvdWNoTXNnLnRvdWNoZW5kO1xuXG4gIGlmICghc3RhcnRcbiAgICB8fCAhZW5kXG4gICAgfHwgIXN0YXJ0LnRpbWVTdGFtcFxuICAgIHx8ICFlbmQudGltZVN0YW1wXG4gICAgfHwgc3RhcnQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IHN0YXJ0LnBhZ2VZID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0UG9zWCA9IHN0YXJ0LnBhZ2VYO1xuICBjb25zdCBzdGFydFBvc1kgPSBzdGFydC5wYWdlWTtcblxuICBjb25zdCBlbmRQb3NYID0gZW5kLnBhZ2VYO1xuICBjb25zdCBlbmRQb3NZID0gZW5kLnBhZ2VZO1xuXG4gIGNvbnN0IHRvdWNoVGltZXMgPSBlbmQudGltZVN0YW1wIC0gc3RhcnQudGltZVN0YW1wO1xuXG4gIHJldHVybiAhIShNYXRoLmFicyhlbmRQb3NZIC0gc3RhcnRQb3NZKSA8IDMwXG4gICAgJiYgTWF0aC5hYnMoZW5kUG9zWCAtIHN0YXJ0UG9zWCkgPCAzMFxuICAgICYmIHRvdWNoVGltZXMgPCAzMDApO1xufVxuXG5leHBvcnQgZW51bSBTVEFURSB7XG4gIFVOSU5JVCA9ICdVTklOSVQnLFxuICBJTklURUQgPSAnSU5JVEVEJyxcbiAgUkVOREVSRUQgPSAnUkVOREVSRUQnLFxuICBDTEVBUiA9ICdDTEVBUicsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDYW52YXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4ICYmIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvdWNoQXJyYXkodG91Y2hlczogR2FtZVRvdWNoW10pIHtcbiAgcmV0dXJuIHRvdWNoZXMubWFwKHRvdWNoID0+ICh7XG4gICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcbiAgICBwYWdlWDogdG91Y2gucGFnZVgsXG4gICAgcGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG4gICAgY2xpZW50WTogdG91Y2guY2xpZW50WSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lVG91Y2hFdmVudChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpOiBlIGlzIEdhbWVUb3VjaEV2ZW50IHtcbiAgcmV0dXJuICd0b3VjaGVzJyBpbiBlO1xufVxuXG4vKipcbiAqIOWPluacgOWwj+WAvOWSjOacgOWkp+WAvOS5i+mXtOeahOWMuumXtOmZkOWumuWAvFxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciDpnIDopoHooqvlpITnkIbnmoTmlbDlrZdcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4g5pyA5bCP5YC8XG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IOacgOWkp+WAvFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtYmVyOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG51bWJlciwgbWF4KSk7XG59XG5cbi8qKlxuICog5Lik5Liq5pWw5LmL6Ze055qE57q/5oCn5o+S5YC844CCXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZXJwKGZyb206IG51bWJlciwgdG86IG51bWJlciwgcmF0aW86IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBmcm9tICsgKHRvIC0gZnJvbSkgKiByYXRpbztcbn0iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLy8gY29tcG9uZW50c1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgRWxlbWVudCwgQnV0dG9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IElMYXlvdXQsIElMYXlvdXRCb3ggfSBmcm9tICcuLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogYW55O1xufVxuXG5pbnRlcmZhY2UgVHJlZU5vZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIGF0dHI6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGNoaWxkcmVuOiBUcmVlTm9kZVtdO1xufVxuXG5jb25zdCBjb25zdHJ1Y3Rvck1hcDogeyBba2V5OiBzdHJpbmddOiBDb25zdHJ1Y3RvciB9ID0ge1xuICB2aWV3OiBWaWV3LFxuICB0ZXh0OiBUZXh0LFxuICBpbWFnZTogSW1hZ2UsXG4gIHNjcm9sbHZpZXc6IFNjcm9sbFZpZXcsXG4gIGJpdG1hcHRleHQ6IEJpdE1hcFRleHQsXG4gIGNhbnZhczogQ2FudmFzLFxuICBidXR0b246IEJ1dHRvbixcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lOiBzdHJpbmcsIENvbnN0cnVjdG9yOiBDb25zdHJ1Y3Rvcikge1xuICBjb25zdHJ1Y3Rvck1hcFtuYW1lXSA9IENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBpc1BlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgL1xcZCsoPzpcXC5cXGQrKT8lLy50ZXN0KGRhdGEpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIsIHBhcmVudERhdGE6IG51bWJlcikge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoRGF0YSA9IGRhdGEubWF0Y2goLyhcXGQrKD86XFwuXFxkKyk/KSUvKTtcbiAgaWYgKG1hdGNoRGF0YSAmJiBtYXRjaERhdGFbMV0pIHtcbiAgICByZXR1cm4gcGFyZW50RGF0YSAqIHBhcnNlRmxvYXQobWF0Y2hEYXRhWzFdKSAqIDAuMDE7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShub2RlOiBUcmVlTm9kZSwgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIHBhcmVudD86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgY29uc3QgQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvck1hcFtub2RlLm5hbWVdO1xuXG4gIGlmICghQ29uc3RydWN0b3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XSDkuI3mlK/mjIHnu4Tku7YgJHtub2RlLm5hbWV9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4gfHwgW107XG5cbiAgY29uc3QgYXR0ciA9IG5vZGUuYXR0ciB8fCB7fTtcbiAgY29uc3QgZGF0YXNldDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBpZCA9IGF0dHIuaWQgfHwgJyc7XG5cbiAgY29uc3QgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IE9iamVjdC5rZXlzKGF0dHIpLnJlZHVjZSgob2JqLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyW2tleV07XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBrZXk7XG5cbiAgICAgIGlmIChrZXkgPT09ICdpZCcpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gT2JqZWN0LmFzc2lnbihvYmouc3R5bGUgfHwge30sIHN0eWxlW2lkXSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBvYmouc3R5bGUgPSB2YWx1ZS5zcGxpdCgvXFxzKy8pLnJlZHVjZSgocmVzLCBvbmVDbGFzcykgPT4gT2JqZWN0LmFzc2lnbihyZXMsIHN0eWxlW29uZUNsYXNzXSksIG9iai5zdHlsZSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJpYnV0ZS5zdGFydHNXaXRoKCdkYXRhLScpKSB7XG4gICAgICAgIGNvbnN0IGRhdGFLZXkgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKDUpO1xuXG4gICAgICAgIGRhdGFzZXRbZGF0YUtleV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgb2JqLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4pO1xuXG4gIC8vIOeUqOS6juWQjue7reWFg+e0oOafpeivolxuICBhcmdzLmlkTmFtZSA9IGlkO1xuICAvLyBAdHMtaWdub3JlXG4gIHRoaXMuZWxlQ291bnQgKz0gMTtcbiAgLy8gQHRzLWlnbm9yZVxuICBhcmdzLmlkID0gdGhpcy5lbGVDb3VudDtcbiAgYXJncy5jbGFzc05hbWUgPSBhdHRyLmNsYXNzIHx8ICcnO1xuXG4gIGNvbnN0IHRoaXNTdHlsZSA9IGFyZ3Muc3R5bGU7XG4gIGlmICh0aGlzU3R5bGUpIHtcbiAgICBsZXQgcGFyZW50U3R5bGU7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50U3R5bGUgPSBwYXJlbnQuc3R5bGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFN0eWxlID0gZW52LmdldFJvb3RDYW52YXNTaXplKCk7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLndpZHRoKSkge1xuICAgICAgdGhpc1N0eWxlLndpZHRoID0gcGFyZW50U3R5bGUud2lkdGggPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUud2lkdGgsIHBhcmVudFN0eWxlLndpZHRoKSA6IDA7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLmhlaWdodCkpIHtcbiAgICAgIHRoaXNTdHlsZS5oZWlnaHQgPSBwYXJlbnRTdHlsZS5oZWlnaHQgPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0LCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXNTdHlsZS5vcGFjaXR5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnRTdHlsZS5vcGFjaXR5ICE9PSAxICYmIHR5cGVvZiBwYXJlbnRTdHlsZS5vcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSBwYXJlbnRTdHlsZS5vcGFjaXR5ICogdGhpc1N0eWxlLm9wYWNpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2coYXJncyk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIC8vIEB0cy1pZ25vcmVcbiAgZWxlbWVudC5yb290ID0gdGhpcztcbiAgZWxlbWVudC50YWdOYW1lID0gbm9kZS5uYW1lO1xuXG4gIGVsZW1lbnQuYWZ0ZXJDcmVhdGUoKTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGNyZWF0ZS5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgc3R5bGUsIGFyZ3MpO1xuXG4gICAgaWYgKGNoaWxkRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW46IEVsZW1lbnRbXSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyID0gdHJ1ZSkge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIC8vIGNoaWxkLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGNoaWxkLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjaGlsZC5pbnNlcnQoY29udGV4dCwgbmVlZFJlbmRlcik7XG5cbiAgICAvLyBTY3JvbGxWaWV355qE5a2Q6IqC54K55riy5p+T5Lqk57uZU2Nyb2xsVmlld+iHquW3se+8jOS4jeaUr+aMgeW1jOWll1Njcm9sbFZpZXdcbiAgICByZXR1cm4gcmVuZGVyQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGNvbnRleHQsICBjaGlsZC50eXBlID09PSAnU2Nyb2xsVmlldycgPyBmYWxzZSA6IG5lZWRSZW5kZXIpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dENoaWxkcmVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLmxheW91dEJveCA9IGNoaWxkLmxheW91dEJveCB8fCB7fTtcblxuICAgIFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZC5sYXlvdXRCb3hbcHJvcCBhcyBrZXlvZiBJTGF5b3V0Qm94XSA9IGNoaWxkLmxheW91dD8uW3Byb3AgYXMga2V5b2YgSUxheW91dF0gYXMgbnVtYmVyO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWCB8fCAwKSArIGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWSB8fCAwKSArIGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH1cblxuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVk7XG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWDtcblxuXG4gICAgbGF5b3V0Q2hpbGRyZW4oY2hpbGQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbm9uZSgpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVUcmVlKGVsZW1lbnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiBDYWxsYmFjayA9IG5vbmUpIHtcbiAgY2FsbGJhY2soZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGl0ZXJhdGVUcmVlKGNoaWxkLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcmVwYWludENoaWxkcmVuID0gKGNoaWxkcmVuOiBFbGVtZW50W10pID0+IHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1Njcm9sbFZpZXcnKSB7XG4gICAgICByZXBhaW50Q2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVwYWludFRyZWUgPSAodHJlZTogRWxlbWVudCkgPT4ge1xuICB0cmVlLnJlcGFpbnQoKTtcblxuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgcmVwYWludFRyZWUoY2hpbGQpO1xuICB9KTtcbn07XG5cbmludGVyZmFjZSBFbGVtZW50QXJncyB7XG4gIHN0eWxlOiBvYmplY3Q7XG4gIGlkTmFtZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgZGF0YXNldDogb2JqZWN0O1xuICBzcmM/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VCBleHRlbmRzIEVsZW1lbnQ+KHJvb3Q6IFQsIGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlLCBwYXJlbnQ/OiBFbGVtZW50KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbZWxlbWVudC50YWdOYW1lIGFzIHN0cmluZ107XG4gIC8vIEB0cy1pZ25vcmVcbiAgcm9vdC5lbGVDb3VudCArPSAxO1xuXG4gIGNvbnN0IGFyZ3M6IEVsZW1lbnRBcmdzID0ge1xuICAgIHN0eWxlOiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LnN0eWxlKSxcbiAgICBpZE5hbWU6IGVsZW1lbnQuaWROYW1lLFxuICAgIGNsYXNzTmFtZTogZWxlbWVudC5jbGFzc05hbWUsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlkOiByb290LmVsZUNvdW50LFxuICAgIGRhdGFzZXQ6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuZGF0YXNldCksXG4gICAgbmFtZTogZWxlbWVudC50YWdOYW1lLFxuICB9O1xuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICBhcmdzLnNyYyA9IGVsZW1lbnQuc3JjO1xuICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBUZXh0IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBCaXRNYXBUZXh0KSB7XG4gICAgYXJncy52YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBjb25zdCBuZXdFbGVtZW5ldCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgbmV3RWxlbWVuZXQucm9vdCA9IHJvb3Q7XG4gIC8vIEB0cy1pZ25vcmVcbiAgbmV3RWxlbWVuZXQuaW5zZXJ0KHJvb3QucmVuZGVyQ29udGV4dCwgZmFsc2UpO1xuICBuZXdFbGVtZW5ldC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuYWRkKG5ld0VsZW1lbmV0KTtcbiAgfVxuXG4gIGlmIChkZWVwKSB7XG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2xvbmUocm9vdCwgY2hpbGQsIGRlZXAsIG5ld0VsZW1lbmV0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXdFbGVtZW5ldDtcbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi4vY29tbW9uL3Bvb2wnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIGZvbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnQml0TWFwVGV4dCc7XG4gIHByaXZhdGUgdmFsdWVzcmM6IHN0cmluZztcbiAgcHVibGljIGZvbnQ6IEJpdE1hcEZvbnQ7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUJpdE1hcFRleHRPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICB2YWx1ZSA9ICcnLFxuICAgICAgZm9udCA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuXG4gICAgdGhpcy5mb250ID0gYml0TWFwUG9vbC5nZXQoZm9udCk7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE1pc3NpbmcgQml0bWFwRm9udCBcIiR7Zm9udH1cIiwgcGxlYXNlIGludm9rZSBBUEkgXCJyZWdpc3RCaXRNYXBGb250XCIgYmVmb3JlIHVzaW5nIFwiQml0TWFwVGV4dFwiYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JlcGFpbnQnKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9udC5yZWFkeSkge1xuICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9udC5ldmVudC5vbigndGV4dF9fbG9hZF9fZG9uZScsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFRleHRCb3VuZHMoKSB7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHsgbGV0dGVyU3BhY2luZyA9IDAgfSA9IHN0eWxlO1xuICAgIGxldCB3aWR0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIHdpZHRoICs9IGNmZy53O1xuXG4gICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgIHdpZHRoICs9IGxldHRlclNwYWNpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0OiB0aGlzLmZvbnQubGluZUhlaWdodCB9O1xuICB9XG5cbiAgcmVuZGVyVGV4dChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0VGV4dEJvdW5kcygpO1xuICAgIGNvbnN0IGRlZmF1bHRMaW5lSGVpZ2h0ID0gdGhpcy5mb250LmxpbmVIZWlnaHQgYXMgbnVtYmVyO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGxldCB7IG5lZWRTdHJva2UsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qge1xuICAgICAgd2lkdGggPSAwLCAvLyDmsqHmnInorr7nva7ph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIGhlaWdodCA9IDAsIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgdGV4dEFsaWduLCAvLyDmloflrZflt6blj7Plr7npvZDmlrnlvI9cbiAgICAgIHZlcnRpY2FsQWxpZ24sXG4gICAgICBsZXR0ZXJTcGFjaW5nID0gMCxcbiAgICB9ID0gc3R5bGU7XG4gICAgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE6auY5bqmXG4gICAgY29uc3QgbGluZUhlaWdodCA9IChzdHlsZS5saW5lSGVpZ2h0IHx8IGRlZmF1bHRMaW5lSGVpZ2h0KSBhcyBudW1iZXJcblxuICAgIGNvbnN0IHNjYWxlWSA9IGxpbmVIZWlnaHQgLyBkZWZhdWx0TGluZUhlaWdodDtcbiAgICBjb25zdCByZWFsV2lkdGggPSBzY2FsZVkgKiBib3VuZHMud2lkdGg7XG5cbiAgICAvLyDlpoLmnpzmloflrZfnmoTmuLLmn5PljLrln5/pq5jluqblsI/kuo7nm5LlrZDpq5jluqbvvIzph4fnlKjlr7npvZDmlrnlvI9cbiAgICBpZiAobGluZUhlaWdodCA8IGhlaWdodCkge1xuICAgICAgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdtaWRkbGUnKSB7XG4gICAgICAgIGRyYXdZICs9IChoZWlnaHQgLSBsaW5lSGVpZ2h0KSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdib3R0b20nKSB7XG4gICAgICAgIGRyYXdZID0gZHJhd1kgKyBoZWlnaHQgLSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aWR0aCA+IHJlYWxXaWR0aCkge1xuICAgICAgaWYgKHRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgZHJhd1ggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBkcmF3WSArPSAod2lkdGggLSByZWFsV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOiusOW9leS4iuS4gOS4quWtl+espu+8jOaWueS+v+WkhOeQhiBrZXJuaW5nXG4gICAgbGV0IHByZXZDaGFyQ29kZSA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuXG4gICAgICBpZiAocHJldkNoYXJDb2RlICYmIGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV0pIHtcbiAgICAgICAgZHJhd1ggKz0gY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNmZykge1xuICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgIHRoaXMuZm9udC50ZXh0dXJlIGFzIEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgICAgICAgY2ZnLngsXG4gICAgICAgICAgY2ZnLnksXG4gICAgICAgICAgY2ZnLncsXG4gICAgICAgICAgY2ZnLmgsXG4gICAgICAgICAgZHJhd1ggKyBjZmcub2ZmWCAqIHNjYWxlWSAtIG9yaWdpblgsXG4gICAgICAgICAgZHJhd1kgKyBjZmcub2ZmWSAqIHNjYWxlWSAtIG9yaWdpblksXG4gICAgICAgICAgY2ZnLncgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLmggKiBzY2FsZVksXG4gICAgICAgICk7XG5cbiAgICAgICAgZHJhd1ggKz0gKGNmZy54YWR2YW5jZSAqIHNjYWxlWSArIGxldHRlclNwYWNpbmcpO1xuXG4gICAgICAgIHByZXZDaGFyQ29kZSA9IGNoYXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xyXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcclxuaW1wb3J0IHsgbGVycCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJ1xyXG5pbXBvcnQgeyBwYXJzZVRyYW5zZm9ybSB9IGZyb20gJy4vc3R5bGVQYXJzZXInO1xyXG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcclxuaW50ZXJmYWNlIElCdXR0b25Qcm9wcyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XHJcbiAgdmFsdWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmjInpkq7nmoTov4fluqbnsbvlnovmnprkuL5cclxuICovXHJcbmVudW0gVHJhbnNpdGlvbiB7XHJcbiAgTk9ORSxcclxuICBDT0xPUixcclxuICBTQ0FMRSxcclxuICBJTUFHRSxcclxufVxyXG5cclxuY29uc3QgREVGQVVMVENPTE9SID0gJ3JnYmEoNTIsIDE2MSwgMzUsIDEpJztcclxuY29uc3QgUFJFU1NFRENPTE9SID0gJ3JnYmEoNTIsIDE2MSwgMzUsIDAuNyknO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgVmlldyB7XHJcbiAgLy8g5oyJ6ZKu55qE5paH5pys5a6e5L6LXHJcbiAgcHVibGljIGxhYmVsOiBUZXh0O1xyXG5cclxuICAvLyDmjInpkq7lvZPliY3mmK/lkKblj6/ngrnlh7tcclxuICBwcml2YXRlIGludGVyYWN0YWJsZUlubmVyID0gdHJ1ZTtcclxuXHJcbiAgLy8g5oyJ6ZKu54K55Ye75Lqk5LqS6KGM5Li6XHJcbiAgcHJpdmF0ZSB0cmFuc2l0aW9uSW5uZXIgPSBUcmFuc2l0aW9uLlNDQUxFO1xyXG5cclxuICAvLyDmjInpkq7nmoTkuqTkupLmk43kvZzkuLrpopzoibLliIfmjaJcclxuICBwcml2YXRlIG5vcm1hbENvbG9ySW5uZXIgPSBERUZBVUxUQ09MT1I7XHJcbiAgcHJpdmF0ZSBwcmVzc2VkQ29sb3JJbm5lciA9IFBSRVNTRURDT0xPUjtcclxuXHJcbiAgLy8g5oyJ6ZKu55qE5Lqk5LqS5pON5L2c5Li657yp5pS+XHJcbiAgcHJpdmF0ZSBub3JtYWxTY2FsZUlubmVyID0gMTtcclxuICBwcml2YXRlIHByZXNzZWRTY2FsZUlubmVyID0gMC45NTtcclxuICAvLyDnvKnmlL7liqjnlLvnmoTml7bplb9cclxuICBwdWJsaWMgc2NhbGVEdXJhdGlvbiA9IDEwMDtcclxuICAvLyDlvZPliY3nvKnmlL7liqjnlLvmmK/lkKbmkq3mlL7lrozmr5VcclxuICBwcml2YXRlIHNjYWxlRG9uZSA9IHRydWU7XHJcbiAgLy8g57yp5pS+5Yqo55S75byA5aeL55qE5pe26Ze0XHJcbiAgcHJpdmF0ZSB0aW1lQ2xpY2sgPSAwO1xyXG4gIC8vIOe8qeaUvuWKqOeUu+eahCBzY2FsZSDliJ3lp4vlgLzvvIzov5nlubbkuI3mmK/lm7rlrprkuI3lj5jnmoTvvIzlvZPngrnlh7vnu5PmnZ/vvIzlj6/og73pnIDopoHku47lpKfliLDlsI/lj5jmjaJcclxuICBwcml2YXRlIGZyb21TY2FsZSA9IDE7XHJcbiAgLy8g57yp5pS+5Yqo55S755qEIHNjYWxlIOebruagh+WAvFxyXG4gIHByaXZhdGUgdG9TY2FsZSA9IDE7XHJcblxyXG4gIC8vIOaMiemSrueahOS6pOS6kuaTjeS9nOS4uuWbvueJh+WIh+aNolxyXG4gIHByaXZhdGUgbm9ybWFsSW1hZ2VJbm5lciA9ICcnO1xyXG4gIHByaXZhdGUgcHJlc3NlZEltYWdlSW5uZXIgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3Ioe1xyXG4gICAgc3R5bGUgPSB7fSxcclxuICAgIGlkTmFtZSA9ICcnLFxyXG4gICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICB2YWx1ZSA9ICcnLFxyXG4gICAgZGF0YXNldCxcclxuICB9OiBJQnV0dG9uUHJvcHMpIHtcclxuICAgIHN1cGVyKHtcclxuICAgICAgaWROYW1lLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICBoZWlnaHQ6IDYwLFxyXG4gICAgICAgIGJvcmRlclJhZGl1czogMTAsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzM0YTEyMycsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIC4uLnN0eWxlLFxyXG4gICAgICAgICc6YWN0aXZlJzoge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wNSwgMS4wNSknLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGFzZXQsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gbmV3IFRleHQoe1xyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGNvbG9yOiBzdHlsZS5jb2xvciB8fCAnI2ZmZmZmZicsXHJcbiAgICAgICAgZm9udFNpemU6IHN0eWxlLmZvbnRTaXplIHx8IDMwLFxyXG4gICAgICB9LFxyXG4gICAgICB2YWx1ZTogdmFsdWUgfHwgJ2J1dHRvbicsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG5cclxuICAgIC8vIOe7keWumum7mOiupOeahOS6i+S7tuWkhOeQhueoi+W6j1xyXG4gICAgLy8gdGhpcy5vbigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hzdGFydEhhbmRsZXIpO1xyXG4gICAgLy8gdGhpcy5vbigndG91Y2hlbmQnLCB0aGlzLnRvdWNoZW5kSGFuZGxlcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhY2hlU3R5bGUhOiBJU3R5bGU7XHJcblxyXG4gIC8qKlxyXG4gICAqIEJ1dHRvbiDlr7nkvKrnsbvnmoQgdHJhbnNmb3JtIOWxnuaAp+WBmuS6hueJueauiuWkhOeQhu+8jOWFt+Wkh+WKqOaViFxyXG4gICAqL1xyXG4gIGFjdGl2ZUhhbmRsZXIoZTogYW55KSB7XHJcbiAgICBpZiAodGhpcy5zdHlsZVsnOmFjdGl2ZSddKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3R5bGVbJzphY3RpdmUnXSlcclxuXHJcbiAgICAgIHRoaXMuY2FjaGVTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3R5bGUpO1xyXG4gICAgICBcclxuICAgICAgLy8gT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCB0aGlzLnN0eWxlWyc6YWN0aXZlJ10pO1xyXG4gICAgICBjb25zdCBhY3RpdmVTdHlsZSA9IHRoaXMuc3R5bGVbJzphY3RpdmUnXTtcclxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBhY3RpdmVTdHlsZSk7XHJcblxyXG4gICAgICAvLyBpZiAoYWN0aXZlU3R5bGUudHJhbnNmb3JtKSB7XHJcbiAgICAgIC8vICAgbGV0IHJlcyA9IHBhcnNlVHJhbnNmb3JtKGFjdGl2ZVN0eWxlLnRyYW5zZm9ybSk7XHJcblxyXG4gICAgICAvLyAgIGNvbnNvbGUubG9nKCd0cmFuc2Zvcm0nLCByZXMpO1xyXG5cclxuICAgICAgLy8gICBpZiAocmVzLnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHJlcy5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAvLyAgICAgdGhpcy5mcm9tU2NhbGUgPSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggfHwgMTtcclxuICAgICAgLy8gICAgIHRoaXMudG9TY2FsZSA9IHJlcy5zY2FsZVggfHwgcmVzLnNjYWxlWSB8fCAxO1xyXG4gICAgICAvLyAgICAgdGhpcy50aW1lQ2xpY2sgPSAwO1xyXG4gICAgICAvLyAgICAgdGhpcy5zY2FsZURvbmUgPSBmYWxzZTtcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGRlYWN0aXZlSGFuZGxlcihlOiBhbnkpIHtcclxuICAgIGNvbnNvbGUubG9nKDExLCBKU09OLnN0cmluZ2lmeSh0aGlzLmNhY2hlU3R5bGUpKVxyXG4gICAgaWYgKHRoaXMuc3R5bGVbJzphY3RpdmUnXSkge1xyXG4gICAgICBjb25zdCBhY3RpdmVTdHlsZSA9IHRoaXMuc3R5bGVbJzphY3RpdmUnXTtcclxuXHJcbiAgICAgIE9iamVjdC5rZXlzKGFjdGl2ZVN0eWxlKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5jYWNoZVN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdKSB7XHJcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICB0aGlzLnN0eWxlW2tleV0gPSB0aGlzLmNhY2hlU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuc3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvdWNoc3RhcnRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCB0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uTk9ORSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSkge1xyXG4gICAgICB0aGlzLmZyb21TY2FsZSA9IHRoaXMubm9ybWFsU2NhbGVJbm5lcjtcclxuICAgICAgdGhpcy50b1NjYWxlID0gdGhpcy5wcmVzc2VkU2NhbGVJbm5lcjtcclxuICAgICAgdGhpcy50aW1lQ2xpY2sgPSAwO1xyXG4gICAgICB0aGlzLnNjYWxlRG9uZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcclxuICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLnByZXNzZWRDb2xvcklubmVyO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdG91Y2hlbmRIYW5kbGVyID0gKCkgPT4ge1xyXG4gICAgaWYgKCF0aGlzLmludGVyYWN0YWJsZSB8fCB0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uTk9ORSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5TQ0FMRSkge1xyXG4gICAgICB0aGlzLmZyb21TY2FsZSA9IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCB8fCAxOyAvLyDlvZPliY3nmoTnvKnmlL7lgLxcclxuICAgICAgdGhpcy50b1NjYWxlID0gdGhpcy5ub3JtYWxTY2FsZUlubmVyO1xyXG4gICAgICB0aGlzLnRpbWVDbGljayA9IDA7XHJcbiAgICAgIHRoaXMuc2NhbGVEb25lID0gZmFsc2U7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMudHJhbnNpdGlvbiA9PT0gVHJhbnNpdGlvbi5DT0xPUikge1xyXG4gICAgICB0aGlzLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMubm9ybWFsQ29sb3JJbm5lcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFmdGVyQ3JlYXRlKCkge1xyXG4gICAgdGhpcy5sYWJlbC5yb290ID0gdGhpcy5yb290O1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5yb290LnRpY2tlci5hZGQodGhpcy51cGRhdGUpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveVNlbGYoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLnJvb3QudGlja2VyLnJlbW92ZSh0aGlzLnVwZGF0ZSk7XHJcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcclxuICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUgPSAoZHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2NhbGVEb25lKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMudGltZUNsaWNrICs9IGR0O1xyXG5cclxuICAgIGxldCByYXRpbyA9IDE7XHJcblxyXG4gICAgcmF0aW8gPSB0aGlzLnRpbWVDbGljayAvIHRoaXMuc2NhbGVEdXJhdGlvbjtcclxuXHJcbiAgICBpZiAocmF0aW8gPiAxKSB7XHJcbiAgICAgIHJhdGlvID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2NhbGUgPSBsZXJwKHRoaXMuZnJvbVNjYWxlLCB0aGlzLnRvU2NhbGUsIHJhdGlvKTtcclxuICAgIGxldCB0cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZX0sICR7c2NhbGV9KWA7XHJcbiAgICB0aGlzLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuICAgIHRoaXMubGFiZWwuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG5cclxuICAgIGlmIChyYXRpbyA9PT0gMSkge1xyXG4gICAgICB0aGlzLnNjYWxlRG9uZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiDlvZPliY3mjInpkq7mmK/lkKblj6/kuqTkupLvvIzlpoLmnpzkuI3lj6/kuqTkupLvvIzngrnlh7vmsqHlj43lupRcclxuICAgKi9cclxuICBnZXQgaW50ZXJhY3RhYmxlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJhY3RhYmxlSW5uZXI7XHJcbiAgfVxyXG5cclxuICBzZXQgaW50ZXJhY3RhYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5pbnRlcmFjdGFibGUgPSB2YWw7XHJcbiAgfVxyXG5cclxuICBnZXQgdHJhbnNpdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Jbm5lcjtcclxuICB9XHJcblxyXG4gIHNldCB0cmFuc2l0aW9uKHZhbDogVHJhbnNpdGlvbikge1xyXG4gICAgdGhpcy50cmFuc2l0aW9uSW5uZXIgPSB2YWw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuaW50ZXJmYWNlIElDYW52YXNPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgYXV0b0NyZWF0ZUNhbnZhcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGNhbnZhc0luc3RhbmNlOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iob3B0czogSUNhbnZhc09wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgICB3aWR0aCA9IDEwMCxcbiAgICAgIGhlaWdodCA9IDEwMCxcbiAgICAgIGF1dG9DcmVhdGVDYW52YXMgPSBmYWxzZSxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeWwj+a4uOaIj+WcuuaZr+S4i++8jHNoYXJlZENhbnZhcyDlrp7kvovkuI3mlrnkvr/oh6rliqjliJvlu7rvvIzmj5Dkvpsgc2V0dGVyIOaJi+WKqOiuvue9rlxuICAgICAqL1xuICAgIGlmIChhdXRvQ3JlYXRlQ2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gZW52LmNyZWF0ZUNhbnZhcygpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS53aWR0aCA9IE51bWJlcih3aWR0aCk7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLmhlaWdodCA9IE51bWJlcihoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjYW52YXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzSW5zdGFuY2U7XG4gIH1cblxuICBzZXQgY2FudmFzKGN2czogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsKSB7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGN2cztcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5jYW52YXNJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOW8gOWni1xuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXNJbnN0YW5jZSwgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSkge1xuICAgICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5pbXBvcnQgeyBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIsIHBhcnNlVHJhbnNmb3JtLCBJUmVuZGVyRm9yTGF5b3V0IH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGlkOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZCh0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RGlydHkoZWxlOiBFbGVtZW50LCByZWFzb24/OiBzdHJpbmcpIHtcbiAgLy8gZm9yIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKCdbTGF5b3V0XSB0cmlnZ2VyIHJlZmxvdyBjYXVzZScsIGVsZSwgcmVhc29uKTtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICByaWdodDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQge1xuICAvKipcbiAgICog5a2Q6IqC54K55YiX6KGoXG4gICAqL1xuICBwdWJsaWMgY2hpbGRyZW46IEVsZW1lbnRbXSA9IFtdO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE54i26IqC54K5XG4gICAqL1xuICBwdWJsaWMgcGFyZW50OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLy8g5Ly85LmO5rKh5LuA5LmI55So77yM5YWI5rOo6YeKXG4gIC8vIHB1YmxpYyBwYXJlbnRJZCA9IDA7XG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoRpZO+8jOS4gOiIrOaYr+eUsSBMYXlvdXQg57uf5LiA5YiG6YWN55qE6Ieq5aKeIGlkXG4gICAqL1xuICBwdWJsaWMgaWQ6IG51bWJlcjtcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgaWQg5bGe5oCn77yM5LiA6Iis55So5LqO6IqC54K55p+l6K+iXG4gICAqL1xuICBwdWJsaWMgaWROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGNsYXNzIOWxnuaAp++8jOS4gOiIrOeUqOS6juaooeadv+aPkuS7tlxuICAgKi9cbiAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG5cbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwcml2YXRlIG9yaWdpblN0eWxlOiBJU3R5bGU7XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvckxheW91dDogSVJlbmRlckZvckxheW91dCA9IHt9O1xuXG4gIHByb3RlY3RlZCBzdHlsZUNoYW5nZUhhbmRsZXIocHJvcDogc3RyaW5nLCB2YWw6IGFueSkge1xuXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBpZCA9IHV1aWQgKz0gMSxcbiAgICBkYXRhc2V0ID0ge30sXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmlkTmFtZSA9IGlkTmFtZTtcbiAgICB0aGlzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB0aGlzLmxheW91dEJveCA9IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGFic29sdXRlWDogMCxcbiAgICAgIGFic29sdXRlWTogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVYOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVk6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlLmJhY2tncm91bmRJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3R5bGUudHJhbnNmb3JtID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQgPSBwYXJzZVRyYW5zZm9ybShzdHlsZS50cmFuc2Zvcm0pO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihiYWNrZ3JvdW5kSW1hZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHVybCA9IGJhY2tncm91bmRJbWFnZVBhcnNlcihiYWNrZ3JvdW5kSW1hZ2UpO1xuXG4gICAgaWYgKHVybCkge1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290ICYmIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnm5HlkKzlsZ7mgKfnmoTlj5jljJbliKTmlq3mmK/lkKbpnIDopoHmiafooYwgcmVmbG9344CBcmVwYWludCDmk43kvZxcbiAgICog57uP6L+H5rWL6K+V77yMT2JqZWN0LmRlZmluZVByb3BlcnR5IOaYr+S4gOS4quavlOi+g+aFoueahOaWueazle+8jCDnibnliKvmmK/lsZ7mgKfmr5TovoPlpJrnmoTml7blgJlcbiAgICog5Zug5q2k5Lya5YWI5Yik5pat5piv5ZCm5pSv5oyBIFByb3h577yMaU1hYyAoUmV0aW5hIDVLLCAyNy1pbmNoLCAyMDE3Kea1i+ivlee7k+aenFxuICAgKiDmgLvlhbEgMzEyIOS4quiKgueCue+8jG9ic2VydmVTdHlsZUFuZEV2ZW505oC76ICX5pe25Li677yaXG4gICAqIFByb3h5OiAzbXNcbiAgICogT2JqZWN0LmRlZmluZVByb3BlcnR5OiAyMG1zXG4gICAqL1xuICBvYnNlcnZlU3R5bGVBbmRFdmVudCgpIHtcbiAgICBpZiAodHlwZW9mIFByb3h5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBlbGUgPSB0aGlzO1xuICAgICAgXG4gICAgICB0aGlzLnN0eWxlID0gbmV3IFByb3h5KHRoaXMub3JpZ2luU3R5bGUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJyAmJiBvbGRWYWwgIT09IHZhbCkge1xuXG4gICAgICAgICAgICBlbGUuc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3AsIHZhbCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAndHJhbnNmb3JtJykge1xuICAgICAgICAgICAgICBlbGUucmVuZGVyRm9yTGF5b3V0ID0gcGFyc2VUcmFuc2Zvcm0odmFsKTtcblxuICAgICAgICAgICAgICBlbGUucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHNldERpcnR5KGVsZSwgYGNoYW5nZSBwcm9wICR7cHJvcH0gZnJvbSAke29sZFZhbH0gdG8gJHt2YWx9YCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgZWxlLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdHlsZSkgYXMgSVN0eWxlO1xuICAgICAgYWxsU3R5bGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zdHlsZSwga2V5LCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdLFxuICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAgICAgaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNldERpcnR5KHRoaXMsIGBjaGFuZ2UgcHJvcCAke2tleX0gdG8gJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kSW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8g5LqL5Lu25YaS5rOh6YC76L6RXG4gICAgWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGNhbmNlbCcsICd0b3VjaGVuZCcsICdjbGljayddLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5vbihldmVudE5hbWUsIChlLCB0b3VjaE1zZykgPT4ge1xuICAgICAgICAvLyDlpITnkIbkvKrnsbvpgLvovpFcbiAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoc3RhcnQnKSB7XG4gICAgICAgICAgdGhpcy5hY3RpdmVIYW5kbGVyKGUpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudE5hbWUgPT09ICd0b3VjaGNhbmNlbCcpIHtcbiAgICAgICAgICB0aGlzLmRlYWN0aXZlSGFuZGxlcihlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5lbWl0KGV2ZW50TmFtZSwgZSwgdG91Y2hNc2cpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSB0aGlzLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuICB9XG5cbiAgYWN0aXZlSGFuZGxlcihlOiBhbnkpIHtcbiAgICBpZiAodGhpcy5zdHlsZVsnOmFjdGl2ZSddKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0eWxlWyc6YWN0aXZlJ10pXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHRoaXMuc3R5bGVbJzphY3RpdmUnXSk7XG4gICAgfVxuICB9XG4gIFxuICBkZWFjdGl2ZUhhbmRsZXIoZTogYW55KSB7XG4gICAgXG4gIH1cblxuICAvKipcbiAgICog6IqC54K56YeN57uY5o6l5Y+j77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZXBhaW50KCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCuea4suafk+aOpeWPo+WtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVuZGVyKCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCueaehOmAoOWHveaVsOWIneWni+WMluWQjuiwg+eUqOeahOaWueazle+8jOWtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgYWZ0ZXJDcmVhdGUoKSB7fVxuXG4gIC8qKlxuICAgKiDlj4LnhacgV2ViIOinhOiMg++8mmh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEJvdW5kaW5nQ2xpZW50UmVjdFxuICAgKi9cbiAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6IFJlY3Qge1xuICAgIGlmICghdGhpcy5yZWN0KSB7XG4gICAgICB0aGlzLnJlY3QgPSBuZXcgUmVjdChcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVksXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMucmVjdC5zZXQoXG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVksXG4gICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMucmVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxpZE5hbWUg5Li657uZ5a6a5Y+C5pWw55qE55qE6IqC54K5XG4gICAqIOiKgueCueeahCBpZCDllK/kuIDmgKcgTGF5b3V0IOW5tuS4jeS/neivge+8jOS9hui/memHjOWPqui/lOWbnuespuWQiOadoeS7tueahOesrOS4gOS4quiKgueCuSBcbiAgICovXG4gIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRCeUlkKHRoaXMsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxpZE5hbWUg5Li657uZ5a6a5Y+C5pWw55qE55qE6IqC54K5XG4gICAqIOiKgueCueeahCBpZCDllK/kuIDmgKcgTGF5b3V0IOW5tuS4jeS/neivge+8jOi/memHjOi/lOWbnuespuWQiOadoeS7tueahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUlkKGlkOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5SWQodGhpcywgW10sIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxjbGFzc05hbWUg5YyF5ZCr57uZ5a6a5Y+C5pWw55qE55qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZTogc3RyaW5nKTogKEVsZW1lbnQgfCBudWxsKVtdIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLCBbXSwgY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDluIPlsYDorqHnrpflrozmiJDvvIzlh4blpIfmiafooYzmuLLmn5PkuYvliY3miafooYznmoTmk43kvZzvvIzkuI3lkIznmoTlrZDnsbvmnInkuI3lkIznmoTooYzkuLpcbiAgICog5q+U5aaCIFNjcm9sbFZpZXcg5Zyo5riy5p+T5LmL5YmN6L+Y6ZyA6KaB5Yid5aeL5YyW5rua5Yqo55u45YWz55qE6IO95YqbXG4gICAqICBcbiAgICovXG4gIGluc2VydChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5jdHggPSBjdHg7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56Kej6Zmk5LqL5Lu257uR5a6aXG4gICAqL1xuICB1bkJpbmRFdmVudCgpIHtcbiAgICBbXG4gICAgICAndG91Y2hzdGFydCcsXG4gICAgICAndG91Y2htb3ZlJyxcbiAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAndG91Y2hlbmQnLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgICdyZXBhaW50JyxcbiAgICBdLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5vZmYoZXZlbnROYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIboioLngrnku47lvZPliY3oioLngrnmoJHkuK3liKDpmaRcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICBjb25zdCB7IHBhcmVudCB9ID0gdGhpcztcblxuICAgIGlmICghcGFyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcbiAgICAgIHNldERpcnR5KHRoaXMsIGByZW1vdmVgKTtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHNldERpcnR5KCkge1xuICAgIHNldERpcnR5KHRoaXMpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuXG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG5cbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyB0aGlzLkVFID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuXG4gICAgLy8gZWxlbWVudCDlnKjnlLvluIPkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICAvLyB0aGlzLmxheW91dEJveCA9IG51bGw7XG4gICAgLy8gdGhpcy5zdHlsZSA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWUgPSAnJztcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYWRkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XG4gICAgLy8gZWxlbWVudC5wYXJlbnRJZCA9IHRoaXMuaWQ7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG5LiA5Liq6IqC54K55re75Yqg5L2c5Li65b2T5YmN6IqC54K555qE5a2Q6IqC54K5XG4gICAqL1xuICBhcHBlbmRDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5hZGQoZWxlbWVudCk7XG5cbiAgICBzZXREaXJ0eSh0aGlzLCBgYXBwZW5kQ2hpbGQgJHtlbGVtZW50fWApO1xuICB9XG5cbiAgLyoqXG4gICAqIOenu+mZpOe7meWumueahOWtkOiKgueCue+8jOWPquacieS4gOe6p+iKgueCueiDveWkn+enu+mZpCBcbiAgICovXG4gIHJlbW92ZUNoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZUNoaWxkICR7ZWxlbWVudH1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqIOeUseS6juaUr+aMgeS6hnJvdGF0ZeeJueaAp++8jOaJgOS7peaJgOacieeahOa4suafk+mDvemcgOimgeaWueWQkeWHj+WOu3RyYW5zZm9ybeeahOS4remXtOeCuVxuICAgKi9cbiAgcmVuZGVyQm9yZGVyKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvcmlnaW5YOiBudW1iZXIgPSAwLCBvcmlnaW5ZOiBudW1iZXIgPSAwKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IHJhZGl1cyA9IHN0eWxlLmJvcmRlclJhZGl1cyB8fCAwO1xuICAgIGNvbnN0IHsgYm9yZGVyV2lkdGggPSAwIH0gPSBzdHlsZTtcbiAgICBjb25zdCB0bHIgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCB0cnIgPSBzdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYmJyID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYnJyID0gc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgYm9yZGVyQ29sb3IgPSAnJyB9ID0gc3R5bGU7XG4gICAgY29uc3QgeCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgeSA9IGJveC5hYnNvbHV0ZVk7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG5cbiAgICBjb25zdCBoYXNSYWRpdXMgPSByYWRpdXMgfHwgdGxyIHx8IHRyciB8fCBiYnIgfHwgYnJyO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gdHJyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIHRyciAtIG9yaWdpblksIHRycik7XG4gICAgLy8g5Y+z5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gYnJyIC0gb3JpZ2luWSk7XG4gICAgLy8g5Y+z5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCB4ICsgd2lkdGggLSBicnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgYnJyKTtcbiAgICAvLyDlt6bkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyBiYnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSk7XG4gICAgLy8g5bem5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgeCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBiYnIgLSBvcmlnaW5ZLCBiYnIpO1xuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCAtIG9yaWdpblgsIHkgKyB0bHIgLSBvcmlnaW5ZKTtcbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHRscik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cblxuICAvKipcbiAgICog5q+P5Liq5a2Q57G76YO95Lya5pyJ6Ieq5bex55qE5riy5p+T6YC76L6R77yM5L2G5LuW5Lus6YO95pyJ5Lqb6YCa55So55qE5aSE55CG77yM5q+U5aaC6YCP5piO5bqm44CB5peL6L2s5ZKMYm9yZGVy55qE5aSE55CG77yMYmFzZVJlbmRlciDnlKjkuo7lpITnkIbpgJrnlKjnmoTmuLLmn5PpgLvovpFcbiAgICovXG4gIGJhc2VSZW5kZXIodHlwZT86IHN0cmluZykge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcblxuICAgIGNvbnN0IHsgYWJzb2x1dGVYOiBkcmF3WCwgYWJzb2x1dGVZOiBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgaWYgKHN0eWxlLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gc3R5bGUub3BhY2l0eSBhcyBudW1iZXI7XG4gICAgfVxuXG4gICAgbGV0IG9yaWdpblggPSAwO1xuICAgIGxldCBvcmlnaW5ZID0gMDtcbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9yaWdpblggPSBkcmF3WCArIGJveC53aWR0aCAvIDI7XG4gICAgICBvcmlnaW5ZID0gZHJhd1kgKyBib3guaGVpZ2h0IC8gMjtcblxuICAgICAgY3R4LnRyYW5zbGF0ZShvcmlnaW5YLCBvcmlnaW5ZKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog6K+35rOo5oSP77yM6L+Z6YeM5pqC5pe25LuF5pSv5oyB5rKh5pyJ5a2Q6IqC54K555qE5YWD57Sg5Y+R55Sf5peL6L2s77yM5aaC5p6c54i26IqC54K55peL6L2s5LqG5a2Q6IqC54K55bm25LiN5Lya6Lef552A5peL6L2sXG4gICAgICog6KaB5a6e546w54i26IqC54K55bim5Yqo5a2Q6IqC54K55peL6L2s55qE6IO95Yqb77yM6ZyA6KaB5byV5YWl55+p6Zi15bqT77yM5a+55Luj56CB5pS55Yqo5Lmf5q+U6L6D5aSn77yM5pqC5pe25LiN5YGa5pS56YCg44CCXG4gICAgICovXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjdHgucm90YXRlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYIDogMSAsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZIDogMSlcbiAgICAgIGN0eC5zY2FsZSh0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCA/IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCA6IDEgLCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCA/IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSA6IDEpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5ib3JkZXJDb2xvcikge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG5cbiAgICAvLyBmb3IgY2xpcFxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCwgb3JpZ2luWCwgb3JpZ2luWSk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUltYWdlT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNyYz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBpbWdzcmM6IHN0cmluZztcbiAgcHVibGljIHR5cGUgPSAnSW1hZ2UnO1xuICBwdWJsaWMgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJSW1hZ2VPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBzcmMgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmltZ3NyYyA9IHNyYztcblxuICAgIHRoaXMuaW1nID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZywgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzcmMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gIH1cblxuICBzZXQgc3JjKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW1nID0gbnVsbDtcblxuICAgIHRoaXMuc3JjID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuaW1nIHx8ICF0aGlzLmltZz8uY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg5byA5aeLXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuXG5leHBvcnQge1xuICBFbGVtZW50LFxuICBWaWV3LFxuICBJbWFnZSxcbiAgVGV4dCxcbiAgU2Nyb2xsVmlldyxcbiAgQml0TWFwVGV4dCxcbiAgQ2FudmFzLFxuICBCdXR0b24sXG59O1xuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY2xhbXAgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIFNjcm9sbEJhckRpcmVjdGlvbiB7XG4gIFZlcnRpdmFsLFxuICBIb3Jpem9udGFsLFxufVxuXG5pbnRlcmZhY2UgSURpbWVuc2lvbnMge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgY29udGVudFdpZHRoOiBudW1iZXI7XG4gIGNvbnRlbnRIZWlnaHQ6IG51bWJlcjtcblxuICBtYXhTY3JvbGxMZWZ0OiBudW1iZXI7XG4gIG1heFNjcm9sbFRvcDogbnVtYmVyO1xuXG4gIHNjcm9sbExlZnQ6IG51bWJlcjtcbiAgc2Nyb2xsVG9wOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJU2Nyb2xsQmFyT3B0aW9ucyB7XG4gIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcbn1cblxuLyoqXG4gKiDmoLnmja7mu5rliqjmnaHnmoTlsLrlr7jjgIFTY3JvbGxWaWV3IOinhuWPo+WSjOa7muWKqOeql+WPo+WwuuWvuOOAgea7muWKqOmYsue6v+S/oeaBr+ehruiupOa7muWKqOadoeeahOagt+W8j+S/oeaBr1xuICovXG5mdW5jdGlvbiB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICBjb25zdCBpc1ZlcnRpY2FsID0gZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWw7XG4gIGNvbnN0IHsgd2lkdGg6IHNjcm9sbFdpZHRoLCBoZWlnaHQ6IHNjcm9sbEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0IH0gPSBkaW1lbnNpb25zO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGlzVmVydGljYWwgPyB3aWR0aCA6IHNjcm9sbFdpZHRoICogKHNjcm9sbFdpZHRoIC8gY29udGVudFdpZHRoKSxcbiAgICBoZWlnaHQ6IGlzVmVydGljYWwgPyBzY3JvbGxIZWlnaHQgKiAoc2Nyb2xsSGVpZ2h0IC8gY29udGVudEhlaWdodCkgOiB3aWR0aCxcbiAgICBsZWZ0OiBpc1ZlcnRpY2FsID8gc2Nyb2xsV2lkdGggLSB3aWR0aCA6IDAsXG4gICAgdG9wOiBpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbEhlaWdodCAtIHdpZHRoLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjaGVja05lZWRIaWRlU2Nyb2xsQmFyKGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICByZXR1cm4gISEoZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxUb3AgPT09IDBcbiAgICB8fCBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5Ib3Jpem9udGFsICYmIGRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdCA9PT0gMCk7XG59XG5cbi8qKlxuICog5rua5Yqo57uE5Lu255qE5rua5Yqo5p2h57uE5Lu277yM5rua5Yqo5p2h5pys6Lqr5Lmf5pivTGF5b3V055qE5LiA5Liq6IqC54K5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbEJhciBleHRlbmRzIFZpZXcge1xuICAvLyDlvZPliY3mu5rliqjmnaHmmK/lsZ7kuo7mqKrlkJHov5jmmK/nurXlkJFcbiAgcHVibGljIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuXG4gIHB1YmxpYyBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcblxuICAvLyDmu5rliqjlrozmr5XlkI7kuIDmrrXml7bpl7TlkI7oh6rliqjpmpDol49cbiAgcHVibGljIGF1dG9IaWRlID0gdHJ1ZTtcblxuICAvLyDmu5rliqjlrozmr5XlkI7oh6rliqjpmpDol4/ml7bpl7RcbiAgcHVibGljIGF1dG9IaWRlVGltZSA9IDIwMDA7XG5cbiAgcHVibGljIGF1dG9IaWRlRGVsYXlUaW1lID0gMTUwMDtcblxuICBwcml2YXRlIGF1dG9IaWRlUmVtYWluaW5nVGltZSA9IDA7XG5cbiAgcHJpdmF0ZSBpbm5lcldpZHRoID0gMTY7XG5cbiAgcHJpdmF0ZSBpc0hpZGUgPSBmYWxzZTtcblxuICBwcml2YXRlIGN1cnJMZWZ0ID0gMDtcbiAgcHJpdmF0ZSBjdXJyVG9wID0gMDtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgZGlyZWN0aW9uLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMTYyLCAxNjIsIDE2MiwgMSknLFxuICAgIHdpZHRoID0gMTYsXG4gIH06IElTY3JvbGxCYXJPcHRpb25zKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYm9yZGVyUmFkaXVzOiB3aWR0aCAvIDIsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgIH0sIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGgsIGRpcmVjdGlvbiwgZGltZW5zaW9ucykpO1xuXG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgIHRoaXMuaW5uZXJXaWR0aCA9IHdpZHRoO1xuXG4gICAgaWYgKGNoZWNrTmVlZEhpZGVTY3JvbGxCYXIoZGlyZWN0aW9uLCBkaW1lbnNpb25zKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHdpZHRoKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyV2lkdGg7XG4gIH1cblxuICAvKipcbiAgICog5rua5Yqo5p2h55qE57KX57uG77yM5Zug5Li66KaB5YW85a655qiq56uW5rua5Yqo77yM5omA5LulIHN0eWxlLndpZHRoIOWcqOS4jeWQjOaooeW8j+S4i+S7o+ihqOeahOaEj+aAneS4jeS4gOagt1xuICAgKiDlm6DmraTpgJrov4fljZXni6znmoQgd2lkdGgg5bGe5oCn5p2l5Luj6KGo5rua5Yqo5p2h55qE57KX57uGXG4gICAqL1xuICBzZXQgd2lkdGgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5pbm5lcldpZHRoKSB7XG4gICAgICB0aGlzLmlubmVyV2lkdGggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0eWxlLmJvcmRlclJhZGl1cyA9IHRoaXMuaW5uZXJXaWR0aCAvIDI7XG4gICAgdGhpcy5zZXREaW1lbnNpb25zKHRoaXMuZGltZW5zaW9ucyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIGlmICghdGhpcy5yb290KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdOiBwbGVhc2Ugc2V0IHJvb3QgZm9yIHNjcm9sbGJhcicpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICB0aGlzLnJvb3QudGlja2VyLmFkZCh0aGlzLnVwZGF0ZSwgdHJ1ZSk7XG5cbiAgICAgIHRoaXMucm9vdC5vbignYmVmb3JlX3JlZmxvdycsICgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2JlZm9yZV9yZWZsb3cnKVxuICAgICAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKHRoaXMuY3VyckxlZnQsIHRoaXMuY3VyclRvcCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcywgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKVxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgICAgIHRoaXMuc3R5bGUudG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5pc0hpZGUgPSB0cnVlO1xuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDA7XG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuaXNIaWRlID0gZmFsc2U7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmoLnmja4gU2Nyb2xsVmlldyDlrrnlmajlrr3pq5jlkozlrp7pmYXlhoXlrrnlrr3pq5jlhrPlrprmu5rliqjmnaHnmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICog5L2G5qC45b+D6ZyA6KaB6ICD6JmR55qE5oOF5Ya15piv77yaXG4gICAqIDEuIOWcqOS4jeaWreWcsCByZWZsb3cg6L+H56iL5Lit77yMU2Nyb2xsQmFyIOS5n+S8muWtmOWcqOmcgOimgeWIh+aNouWxleekuuWSjOmakOiXj+eahOaDheWGtVxuICAgKiAyLiByZWZsb3cg5LmL5ZCO77yMU2Nyb2xsQmFyIOeahOS9jee9ruS4jeaYr+eugOWNleeahOiuvue9ruS4uiBTY3JvbGxWaWV3IOmhtumDqOWSjOW3pui+ue+8jOi/mOWPr+iDveaYr+a7muWKqOS6huS4gOautei3neemu+WQjuaJp+ihjOeahCByZWZsb3dcbiAgICovXG4gIHNldERpbWVuc2lvbnMoZGltZW5zaW9uczogSURpbWVuc2lvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnModGhpcy53aWR0aCwgdGhpcy5kaXJlY3Rpb24sIGRpbWVuc2lvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBzdHlsZSk7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcih0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucykpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cblxuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG5cbiAgICAvLyDlt7Lnu4/mu5rliqjov4fkuIDmrrXot53nprvnmoTmg4XlhrXvvIzph43mlrDorqHnrpfmlrDnmoTmu5rliqjkvY3nva5cbiAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKGRpbWVuc2lvbnMuc2Nyb2xsTGVmdCwgZGltZW5zaW9ucy5zY3JvbGxUb3ApO1xuXG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIHRoaXMuc3R5bGUudG9wID0gc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0eWxlLmxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIH1cblxuICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICB9XG5cbiAgY2FsY3VsdGVTY3JvbGxWYWx1ZShsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgbGV0IHNjcm9sbExlZnQgPSAwO1xuICAgIGxldCBzY3JvbGxUb3AgPSAwO1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudEhlaWdodDtcblxuICAgICAgLy8g5rua5Yqo5p2h5pyA5aSn5rua5Yqo6auY5bqmXG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgPSB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0ICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IHRvcCAvIHRoaXMuZGltZW5zaW9ucy5tYXhTY3JvbGxUb3A7XG4gICAgICBjb25zdCBwZXJjZW50VG9wID0gc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wICogcGVyY2VudDtcblxuICAgICAgc2Nyb2xsVG9wID0gY2xhbXAocGVyY2VudFRvcCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2FuU2Nyb2xsUGVyY2VudCA9IDEgLSB0aGlzLmRpbWVuc2lvbnMud2lkdGggLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudFdpZHRoO1xuICAgICAgY29uc3Qgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCA9IHRoaXMuZGltZW5zaW9ucy53aWR0aCAqIGNhblNjcm9sbFBlcmNlbnQ7XG5cbiAgICAgIGNvbnN0IHBlcmNlbnQgPSBsZWZ0IC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbExlZnQ7XG5cbiAgICAgIHNjcm9sbExlZnQgPSBjbGFtcChzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ICogcGVyY2VudCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH07XG4gIH1cblxuICBvblNjcm9sbChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNIaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyTGVmdCA9IGxlZnQ7XG4gICAgdGhpcy5jdXJyVG9wID0gdG9wO1xuICBcbiAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQsIHRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSArIHNjcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCArIHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcbiAgICAgIC8vIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWU7XG4gICAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IHRoaXMuYXV0b0hpZGVUaW1lICsgdGhpcy5hdXRvSGlkZURlbGF5VGltZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIucmVtb3ZlKHRoaXMudXBkYXRlLCB0cnVlKTtcblxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICB1cGRhdGUgPSAoZHQ6IG51bWJlcikgPT4ge1xuICAgIGlmICghdGhpcy5hdXRvSGlkZSB8fCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSAwIHx8IHRoaXMuaXNIaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgLT0gZHQ7XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPD0gdGhpcy5hdXRvSGlkZVRpbWUpIHtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gTWF0aC5tYXgoMCwgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUpO1xuICAgICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gdGhpcy5zdHlsZS5vcGFjaXR5IGFzIG51bWJlciAqICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAvIHRoaXMuYXV0b0hpZGVUaW1lKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCB7IGNvcHlUb3VjaEFycmF5IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IFNjcm9sbGVyIGZyb20gJy4uL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMnXG5pbXBvcnQgeyBpdGVyYXRlVHJlZSB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgRWxlbWVudCwgeyBzZXREaXJ0eSB9IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgU2Nyb2xsQmFyLCB7IFNjcm9sbEJhckRpcmVjdGlvbiB9IGZyb20gJy4vc2Nyb2xsYmFyJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuXG5jb25zdCBkcHIgPSBlbnYuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuXG5pbnRlcmZhY2UgSVNjcm9sbFZpZXdPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc2Nyb2xsWD86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHNjcm9sbFk/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xufVxuXG5pbnRlcmZhY2UgSUlubmVyU2Nyb2xsZXJPcHRpb24ge1xuICBzY3JvbGxpbmdYPzogYm9vbGVhbjtcbiAgc2Nyb2xsaW5nWT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBzY3JvbGxUb3AgPSAwO1xuICBwdWJsaWMgc2Nyb2xsTGVmdCA9IDA7XG4gIHB1YmxpYyBoYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgcHVibGljIGN1cnJlbnRFdmVudCA9IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ1Njcm9sbFZpZXcnO1xuXG4gIHByaXZhdGUgc2Nyb2xsWVByb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgaW5uZXJTY3JvbGxlck9wdGlvbjogSUlubmVyU2Nyb2xsZXJPcHRpb247XG5cbiAgcHJpdmF0ZSBzY3JvbGxlck9iaj86IFNjcm9sbGVyO1xuICBwcml2YXRlIGlzRmlyc3RTY3JvbGw/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgdmVydGl2YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhvcml6b250YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHNjcm9sbFgsXG4gICAgc2Nyb2xsWSxcbiAgICBkYXRhc2V0LFxuICB9OiBJU2Nyb2xsVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBjbGFzc05hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjcm9sbFlQcm9wID0gc2Nyb2xsWTtcblxuICAgIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6ICEhc2Nyb2xsWCxcbiAgICAgIHNjcm9sbGluZ1k6ICEhc2Nyb2xsWSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlua7muWKqOWIl+ihqOWGheaJgOacieWFg+e0oOeahOmrmOW6puWSjFxuICAgKiDov5nph4zkuI3og73nroDljZXlsIbmiYDmnInlrZDlhYPntKDnmoTpq5jluqbntK/liqDvvIzlm6DkuLrmr4/kuKrlhYPntKDkuYvpl7Tlj6/og73mmK/mnInnqbrpmpnnmoRcbiAgICovXG4gIGdldCBzY3JvbGxIZWlnaHQoKSB7XG4gICAgbGV0IG1heEhlaWdodCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhIZWlnaHQgPSBNYXRoLm1heChtYXhIZWlnaHQsIGl0ZW0ubGF5b3V0Qm94LnRvcCArIGl0ZW0ubGF5b3V0Qm94LmhlaWdodCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1heEhlaWdodDtcbiAgfVxuXG4gIGdldCBzY3JvbGxXaWR0aCgpIHtcbiAgICBsZXQgbWF4V2lkdGggPSAwO1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbTogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgbWF4V2lkdGggPSBNYXRoLm1heChtYXhXaWR0aCwgaXRlbS5sYXlvdXRCb3gubGVmdCArIGl0ZW0ubGF5b3V0Qm94LndpZHRoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXhXaWR0aDtcbiAgfVxuXG4gIGdldCBzY3JvbGxYKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWDtcbiAgfVxuXG4gIHNldCBzY3JvbGxYKHZhbHVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8oMCwgdGhpcy5zY3JvbGxUb3AsIHRydWUsIDEpO1xuICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdYOiB2YWx1ZSxcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdZO1xuICB9XG5cbiAgc2V0IHNjcm9sbFkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuc2Nyb2xsWSkge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8odGhpcy5zY3JvbGxMZWZ0LCAwLCB0cnVlLCAxKTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICAgIHNjcm9sbGluZ1k6IHZhbHVlLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5zY3JvbGxlck9iaiAmJiB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzY3JvbGxlck9wdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uO1xuICB9XG5cbiAgc2V0IHNjcm9sbGVyT3B0aW9uKHZhbHVlOiBJSW5uZXJTY3JvbGxlck9wdGlvbikge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLCB2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxlck9iaikge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnNjcm9sbGVyT2JqLm9wdGlvbnMsIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5zY3JvbGxSZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIC8vIHRoaXMudG91Y2ggPSBudWxsO1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QhLm9mZigndG91Y2hlbmQnKTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyVHJlZVdpdGhUb3AodHJlZTogRWxlbWVudCkge1xuICAgIGlmICghKHRyZWUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICB0cmVlLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgdGhpcy5jdHghLmNsZWFyUmVjdChib3guYWJzb2x1dGVYLCBib3guYWJzb2x1dGVZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICB9XG5cbiAgc2Nyb2xsUmVuZGVyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IHN0YXJ0WCwgYWJzb2x1dGVZOiBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvLyDmoLnmja7mu5rliqjlgLzojrflj5boo4HliarljLrln59cbiAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgd2lkdGg7XG4gICAgY29uc3QgZW5kWSA9IHN0YXJ0WSArIGhlaWdodDtcblxuICAgIC8vIFNjcm9sbFZpZXcg5L2c5Li65a655Zmo5pys6Lqr55qE5riy5p+TXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIOW8gOWni+ijgeWJqu+8jOWPquacieS7lCBTY3JvbGxWaWV3IGxheW91dEJveCDljLrln5/lhoXnmoTlhYPntKDmiY3mmK/lj6/op4HnmoRcbiAgICAgKiDov5nmoLcgU2Nyb2xsVmlldyDkuI3nlKjljZXni6zljaDnlKjkuIDkuKogY2FudmFz77yM5YaF5a2Y5ZCI5riy5p+T6YO95Lya5b6X5Yiw5LyY5YyWXG4gICAgICovXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgucmVjdChzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmNsaXAoKTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgYWJzb2x1dGVYLCBhYnNvbHV0ZVkgfSA9IGNoaWxkLmxheW91dEJveDtcblxuICAgICAgLy8g5Yik5pat5aSE5LqO5Y+v6KeG56qX5Y+j5YaF55qE5a2Q6IqC54K577yM6YCS5b2S5riy5p+T6K+l5a2Q6IqC54K5XG4gICAgICBpZiAoYWJzb2x1dGVZICsgaGVpZ2h0ID49IHN0YXJ0WSAmJiBhYnNvbHV0ZVkgPD0gZW5kWVxuICAgICAgICAmJiBhYnNvbHV0ZVggKyB3aWR0aCA+PSBzdGFydFggJiYgYWJzb2x1dGVYIDw9IGVuZFgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDkuIrpnaLnmoTmuLLmn5PlupTor6XlhYjot7Pov4fmu5rliqjmnaHvvIzlkKbliJnlj6/og73lh7rnjrDmuLLmn5Ppobrluo/pl67popjvvIxTY3JvbGxWaWV355qE6IqC54K55Y+N6ICM5oqK5rua5Yqo5p2h55uW5L2P5LqGXG4gICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ucmVuZGVyKCk7XG4gICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBzY3JvbGxIYW5kbGVyKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICAvLyDlj6/og73ooqvplIDmr4HkuobmiJbogIXoioLngrnmoJHov5jmsqHlh4blpIflpb1cbiAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQgJiYgIXRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6L+Z6YeM6KaB5oqK5rua5Yqo54q25oCB5L+d5a2Y6LW35p2l77yM5Zug5Li65ZyocmVmbG9355qE5pe25YCZ6ZyA6KaB5YGa6YeN572u77yM5riy5p+T5bm25LiN5L6d6LWW6L+Z5Lik5Liq5L+h5oGvXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IGxlZnQ7XG5cbiAgICAgIHRoaXMudmVydGl2YWxTY3JvbGxiYXI/Lm9uU2Nyb2xsKGxlZnQsIHRvcCk7XG4gICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/Lm9uU2Nyb2xsKGxlZnQsIHRvcCk7XG5cbiAgICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50RXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzY3JvbGwnLCB0aGlzLmN1cnJlbnRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOW9k+aJp+ihjHJlZmxvd+S5i+WQju+8jOa7muWKqOWIl+ihqOeahOmrmOW6puWPr+iDveWPkeeUn+S6huWPmOWMlu+8jOa7muWKqOadoeS5n+mcgOimgeWQjOatpei/m+ihjOabtOaWsFxuICAgKi9cbiAgdXBkYXRlU2Nyb2xsQmFyKHNjcm9sbFByb3A6IHN0cmluZywgc2Nyb2xsQmFyTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgY29udGVudFdpZHRoOiB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aCxcbiAgICAgIGNvbnRlbnRIZWlnaHQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudEhlaWdodCxcbiAgICAgIG1heFNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgIG1heFNjcm9sbFRvcDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxUb3AsXG5cbiAgICAgIHNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fc2Nyb2xsTGVmdCxcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxUb3AsXG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZVNjcm9sbEJhcicsIEpTT04uc3RyaW5naWZ5KGRpbWVuc2lvbnMpKVxuXG4gICAgLy8g6Z2e56ys5LiA5qyh5Yib5bu655qE5oOF5Ya177yM5LiA6Iis5pivIHJlZmxvdyDmiafooYzliLDov5nph4xcbiAgICBpZiAodGhpc1tzY3JvbGxQcm9wIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICBpZiAodGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XS5zZXREaW1lbnNpb25zKGRpbWVuc2lvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gbmV3IFNjcm9sbEJhcih7XG4gICAgICAgICAgZGltZW5zaW9ucyxcbiAgICAgICAgICBkaXJlY3Rpb246IHNjcm9sbFByb3AgPT09ICdzY3JvbGxZJyA/IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCA6IFNjcm9sbEJhckRpcmVjdGlvbi5Ib3Jpem9udGFsLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLmFwcGVuZENoaWxkKHNjcm9sbGJhcik7XG4gICAgICAgIHNjcm9sbEJhci5yb290ID0gdGhpcy5yb290O1xuICAgICAgICBzY3JvbGxCYXIuaW5pdCgpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHNjcm9sbEJhci5pbnNlcnQodGhpcy5yb290LnJlbmRlckNvbnRleHQsIHRydWUpO1xuICAgICAgICBzY3JvbGxCYXIub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKTtcbiAgICAgICAgdGhpcy5hZGQoc2Nyb2xsQmFyKTtcblxuICAgICAgICBzZXREaXJ0eShzY3JvbGxCYXIsICdhcHBlbmRUb1Njcm9sbFZpZXcnKVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXSA9IHNjcm9sbEJhcjtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZV0/Lm9uU2Nyb2xsKHRoaXMuc2Nyb2xsZXJPYmohLl9fc2Nyb2xsTGVmdCwgdGhpcy5zY3JvbGxlck9iaiEuX19zY2hlZHVsZWRUb3ApO1xuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5b2T5LiN5YaN6ZyA6KaB57q15ZCR5rua5Yqo55qE5pe25YCZ6ZSA5q+B57q15ZCR5rua5Yqo5p2hXG4gICAgICBpZiAodGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbEJhciA9IHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XTtcbiAgICAgICAgc2Nyb2xsQmFyLnJlbW92ZSgpO1xuICAgICAgICBzY3JvbGxCYXIuZGVzdHJveSgpO1xuICAgICAgICBzY3JvbGxCYXIuZGVzdHJveVNlbGYoKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5jdHggPSBjb250ZXh0O1xuXG4gICAgLyoqXG4gICAgICog6L+Z6YeM5pyJ5Liq6Z2e5bi454m55q6K55qE5YW85a656YC76L6R77yM5Zyo5L2O54mI5pys5rKh5pyJ6YeN5p6EIFNjcm9sbFZpZXfkuYvliY3vvIzlubbmsqHmnInmj5DkvpvljZXni6znmoQgU2Nyb2xsWCDlkowgU2Nyb2xsWSDlsZ7mgKdcbiAgICAgKiDogIzmmK/liKTmlq0gc2Nyb2xsSGVpaHQg5aSn5LqO5a655Zmo6auY5bqm55qE5pe25YCZ6Ieq5Yqo5a6e546w5LqG57q15ZCR5rua5Yqo77yI5LiU5rKh5pyJ5qiq5ZCR5rua5Yqo6IO95Yqb77yJXG4gICAgICog5Zug5q2k6L+Z6YeM5YGa5LiA5Liq5YW85a656YC76L6R77yM5aaC5p6cIHNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCDoh6rliqjlvIDlkK/nurXlkJHmu5rliqhcbiAgICAgKi9cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQgJiYgdHlwZW9mIHRoaXMuc2Nyb2xsWVByb3AgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g6Ieq5Yqo5byA5ZCvIHNjcm9sbFlgKTtcbiAgICAgIHRoaXMuc2Nyb2xsWSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXZlbnRCaW5kKSB7XG4gICAgICAvLyByZWZsb3cg6auY5bqm5Y+v6IO95Lya5Y+Y5YyW77yM5Zug5q2k6ZyA6KaB5omn6KGMIHNldERpbWVuc2lvbnMg5Yi35paw5Y+v5rua5Yqo5Yy65Z+fXG4gICAgICBpZiAodGhpcy5sYXlvdXRCb3gud2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudEhlaWdodFxuICAgICAgICB8fCB0aGlzLnNjcm9sbFdpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnMoXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGgsXG4gICAgICAgICAgdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOi/memHjOS5i+aJgOS7peimgeW7tui/n+S4gOW4p+aYr+WboOS4uui/memHjOeahOWPmOWKqOadpeiHqiByZWZsb3cg5LmL5ZCO77yM5q2j5Zyo5YGaIHJlZmxvdyDkuYvlkI7nmoTlkI7nu63kuovmg4VcbiAgICAgICAgICog5aaC5p6c56uL5Y2z5L+u5pS55rua5Yqo5p2h55qE5qC35byP77yM5a6e6ZmF5LiK5bm25LiN5Lya55Sf5pWI44CCXG4gICAgICAgICAqL1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFknLCAndmVydGl2YWxTY3JvbGxiYXInKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyByZWZsb3cg5LmL5ZCO77yM5Lya5LuOIGNzc2xheW91dCDlkIzmraXluIPlsYDkv6Hmga/vvIzljp/lhYjnmoTmu5rliqjkv6Hmga/kvJrkuKLlpLHvvIzov5nph4zpnIDopoHkuIDkuKrlpI3kvY3nmoTmk43kvZxcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcyAmJiAhKGVsZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0aGlzLnNjcm9sbFRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSB0aGlzLnNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IHRydWU7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5zY3JvbGxlck9iaiA9IG5ldyBTY3JvbGxlcih0aGlzLnNjcm9sbEhhbmRsZXIuYmluZCh0aGlzKSwgdGhpcy5zY3JvbGxlck9wdGlvbik7XG5cbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zZXREaW1lbnNpb25zKHRoaXMubGF5b3V0Qm94LndpZHRoLCB0aGlzLmxheW91dEJveC5oZWlnaHQsIHRoaXMuc2Nyb2xsV2lkdGgsIHRoaXMuc2Nyb2xsSGVpZ2h0KTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnJvb3QudGlja2VyLm5leHQoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFknLCAndmVydGl2YWxTY3JvbGxiYXInKTtcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHRoaXMub24oJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoU3RhcnQodG91Y2hlcywgZS50aW1lU3RhbXApO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigndG91Y2htb3ZlJywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaE1vdmUodG91Y2hlcywgZS50aW1lU3RhbXAsIHVuZGVmaW5lZCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICAvLyDov5nph4zkuI3lupTor6XmmK/nm5HlkKxzY3JvbGx2aWV355qEdG91Y2hlbmTkuovku7bogIzmmK/lsY/luZXnmoR0b3VjaGVuZOS6i+S7tlxuICAgIHRoaXMucm9vdCEub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hFbmQoZS50aW1lU3RhbXApO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuICB9XG5cbiAgc2Nyb2xsVG8obGVmdCA9IDAsIHRvcCA9IDAsIGFuaW1hdGUgPSB0cnVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8obGVmdCwgdG9wLCBhbmltYXRlLCAxKTtcbiAgfVxufVxuIiwiY29uc3QgcmVmbG93QWZmZWN0ZWRTdHlsZXMgPSBbXG4gICd3aWR0aCcsICdoZWlnaHQnLFxuICAnbWluV2lkdGgnLCAnbWluSGVpZ2h0JyxcbiAgJ21heFdpZHRoJywgJ21heEhlaWdodCcsXG4gICdsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nLFxuICAnbWFyZ2luJywgJ21hcmdpbkxlZnQnLCAnbWFyZ2luUmlnaHQnLCAnbWFyZ2luVG9wJywgJ21hcmdpbkJvdHRvbScsXG4gICdwYWRkaW5nJywgJ3BhZGRpbmdMZWZ0JywgJ3BhZGRpbmdSaWdodCcsICdwYWRkaW5nVG9wJywgJ3BhZGRpbmdCb3R0b20nLFxuICAnYm9yZGVyV2lkdGgnLCAnYm9yZGVyTGVmdFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLCAnYm9yZGVyVG9wV2lkdGgnLCAnYm9yZGVyQm90dG9tV2lkdGgnLFxuICAnZmxleERpcmVjdGlvbicsXG4gICdmbGV4U2hyaW5rJyxcbiAgJ2ZsZXhHcm93JyxcbiAgJ2p1c3RpZnlDb250ZW50JyxcbiAgJ2FsaWduSXRlbXMnLCAnYWxpZ25TZWxmJyxcbiAgJ2ZsZXgnLFxuICAnZmxleFdyYXAnLFxuICAncG9zaXRpb24nLFxuICAnZm9udFdlaWdodCcsXG5dO1xuXG5jb25zdCByZXBhaW50QWZmZWN0ZWRTdHlsZXMgPSBbXG4gICdmb250U2l6ZScsXG4gICdsaW5lSGVpZ2h0JyxcbiAgJ3RleHRBbGlnbicsXG4gICd2ZXJ0aWNhbEFsaWduJyxcbiAgJ2NvbG9yJyxcbiAgJ2JhY2tncm91bmRDb2xvcicsXG4gICd0ZXh0T3ZlcmZsb3cnLFxuICAnbGV0dGVyU3BhY2luZycsXG4gICdib3JkZXJSYWRpdXMnLFxuICAnYm9yZGVyQ29sb3InLFxuICAnb3BhY2l0eScsXG4gICd0cmFuc2Zvcm0nLFxuICAndGV4dFN0cm9rZUNvbG9yJyxcbiAgJ3RleHRTdHJva2VXaWR0aCcsXG4gICd0ZXh0U2hhZG93Jyxcbl07XG5cbmNvbnN0IGFsbFN0eWxlcyA9IHJlZmxvd0FmZmVjdGVkU3R5bGVzLmNvbmNhdChyZXBhaW50QWZmZWN0ZWRTdHlsZXMpO1xuXG5pbnRlcmZhY2UgSVN0eWxlIHtcbiAgLy8gcmVmbG93QWZmZWN0ZWRTdHlsZXNcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgbWluV2lkdGg/OiBudW1iZXI7XG4gIG1pbkhlaWdodD86IG51bWJlcjtcbiAgbWF4V2lkdGg/OiBudW1iZXI7XG4gIG1heEhlaWdodD86IG51bWJlcjtcbiAgbGVmdD86IG51bWJlcjtcbiAgcmlnaHQ/OiBudW1iZXI7XG4gIHRvcD86IG51bWJlcjtcbiAgYm90dG9tPzogbnVtYmVyO1xuICBtYXJnaW4/OiBudW1iZXI7XG4gIG1hcmdpbkxlZnQ/OiBudW1iZXI7XG4gIG1hcmdpblJpZ2h0PzogbnVtYmVyO1xuICBtYXJnaW5Ub3A/OiBudW1iZXI7XG4gIG1hcmdpbkJvdHRvbT86IG51bWJlcjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgcGFkZGluZ0xlZnQ/OiBudW1iZXI7XG4gIHBhZGRpbmdSaWdodD86IG51bWJlcjtcbiAgcGFkZGluZ1RvcD86IG51bWJlcjtcbiAgcGFkZGluZ0JvdHRvbT86IG51bWJlcjtcbiAgYm9yZGVyV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckxlZnRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyUmlnaHRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyVG9wV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVdpZHRoPzogbnVtYmVyO1xuXG4gIGJvcmRlclRvcExlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlclRvcFJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21SaWdodFJhZGl1cz86IG51bWJlcjtcblxuICBmbGV4RGlyZWN0aW9uPzogJ2NvbHVtbicgfCAncm93JztcbiAgZmxleFNocmluaz86IG51bWJlcjtcbiAgZmxleEdyb3c/OiBudW1iZXI7XG4gIGZsZXhXcmFwPzogJ3dyYXAnIHwgJ25vd3JhcCc7XG4gIGp1c3RpZnlDb250ZW50PzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3NwYWNlLWJldHdlZW4nIHwgJ3NwYWNlLWFyb3VuZCc7XG4gIGFsaWduSXRlbXM/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIGFsaWduU2VsZj86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgcG9zaXRpb24/OiBzdHJpbmc7XG5cbiAgLy8gcmVwYWludEFmZmVjdGVkU3R5bGVzXG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBsaW5lSGVpZ2h0PzogbnVtYmVyIHwgJ3N0cmluZyc7XG4gIHRleHRBbGlnbj86ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbiAgdmVydGljYWxBbGlnbj86ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgdGV4dE92ZXJmbG93PzogJ2VsbGlwc2lzJyB8ICdjbGlwJztcbiAgbGV0dGVyU3BhY2luZz86IG51bWJlcjtcbiAgYm9yZGVyUmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyVG9wQ29sb3I/OiBzdHJpbmc7XG5cbiAgYmFja2dyb3VuZEltYWdlPzogc3RyaW5nO1xuICBib3JkZXJCb3R0b21Db2xvcj86IHN0cmluZztcbiAgYm9yZGVyTGVmdENvbG9yPzogc3RyaW5nO1xuICBib3JkZXJSaWdodENvbG9yPzogc3RyaW5nO1xuXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG5cbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuXG4gIC8vIOaWh+Wtl+aPj+i+ueeahOWuveW6pu+8jOm7mOiupOS4jeaPj+i+uVxuICB0ZXh0U3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIC8vIOaWh+Wtl+aPj+i+ueeahOminOiJsu+8jOWmguaenOaMh+WumuS6huaPj+i+ueminOiJsuS9huaYr+ayoeacieaMh+WumuaPj+i+ueWuveW6pu+8jOaPj+i+ueWuveW6pum7mOiupOiuvue9ruS4ujFcbiAgdGV4dFN0cm9rZUNvbG9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDmloflrZfpmLTlvbHmlYjmnpzvvIx0ZXh0U2hhZG9355qE5qC85byP5bm25LiN5piv5Lil5qC855qEQ1NT5qC85byP77yM5LuF5pSv5oyB5Lik56eN5qC85byPXG4gICAqIHRleHRTaGFkb3c6IDFweCAxcHggMnB4IHBpbmtcbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcmVkLCAwIDAgMXB4IGJsdWUsIDAgMCAxcHggYmx1ZSwgMXB4IDFweCAycHggcmVkXG4gICAqIOS5n+WwseaYr+aUr+aMgeS7u+aEj+aVsOmHj+eahOmYtOW9seaViOaenO+8jOavj+S4qumYtOW9seaViOaenOeUseWbm+S4quWAvOaMh+Wumu+8jOWIhuWIq+aYryBzaGFkb3dPZmZzZXRYLCBzaGFkb3dPZmZzZXRZLCBzaGFkb3dCbHVyLCBzaGFkb3dDb2xvclxuICAgKi9cbiAgdGV4dFNoYWRvdz86IHN0cmluZztcblxuICAnOmFjdGl2ZSc/OiBJU3R5bGU7XG59XG5cbmV4cG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIGFsbFN0eWxlcywgSVN0eWxlIH07XG4iLCJcbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlczogbnVtYmVyKSB7XG4gIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcbn1cblxuLy8g6IOM5pmv5Zu+5q2j5YiZ6KGo6L6+5byPXG5jb25zdCBpc1ZhbGlkVXJsUHJvcFJlZyA9IC9cXHMqdXJsXFwoKC4qPylcXClcXHMqLztcblxuLy8g6Kej5p6Q6IOM5pmv5Zu+54mHXG5leHBvcnQgZnVuY3Rpb24gYmFja2dyb3VuZEltYWdlUGFyc2VyKHZhbDogc3RyaW5nKSB7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGxpc3QgPSB2YWwubWF0Y2goaXNWYWxpZFVybFByb3BSZWcpO1xuXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGNvbnN0IHVybCA9IGxpc3RbMV0ucmVwbGFjZSgvKCd8XCIpL2csICcnKTtcblxuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XTogJHt2YWx9IGlzIG5vdCBhIHZhbGlkIGJhY2tncm91bmRJbWFnZWApO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCB0ZXh0U2hhZG93UmVnID0gL14oXFxkK3B4XFxzKXsyfVxcZCtweFxcc1thLXpBLVpdKygsXFxzKihcXGQrcHhcXHMpezJ9XFxkK3B4XFxzW2EtekEtWl0rKSokLztcbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkVGV4dFNoYWRvdyh0ZXh0U2hhZG93OiBzdHJpbmcpIHtcbiAgcmV0dXJuIHRleHRTaGFkb3dSZWcudGVzdCh0ZXh0U2hhZG93KTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFRyYW5zZm9ybVZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcbiAgLy8g5L2/55So5q2j5YiZ6KGo6L6+5byP6aqM6K+B5pWw5a2X5oiW6YCX5Y+35YiG6ZqU55qE5pWw5a2X77yM5ZCO6Z2i5Y+v5Lul6Lef5Y+v6YCJ55qE6KeS5bqm5Y2V5L2N77yIZGVn77yJXG4gIHJldHVybiAvXigtP1xcZCsoXFwuXFxkKyk/KShkZWcpPygsXFxzKigtP1xcZCsoXFwuXFxkKyk/KShkZWcpPykqJC8udGVzdCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckZvckxheW91dCB7XG4gIHJvdGF0ZT86IG51bWJlcjsgLy8gdHJhbnNmb3JtIHJvdGF0Zeino+aekOS5i+WQjuW+l+WIsOeahOW8p+W6puWItlxuICBzY2FsZVg/OiBudW1iZXI7XG4gIHNjYWxlWT86IG51bWJlcjtcbn1cblxuY29uc3QgdHJhbnNmb3JtUmVnZXggPSAvKFxcdyspXFwoKFteKV0rKVxcKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdDogSVJlbmRlckZvckxheW91dCA9IHt9O1xuXG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdHJhbnNmb3JtUmVnZXguZXhlYyh0cmFuc2Zvcm0pKSkge1xuICAgIGNvbnN0IFssIG5hbWUsIHZhbHVlXSA9IG1hdGNoO1xuXG4gICAgaWYgKCFpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFtMYXlvdXRdOiBpbnZhbGlkIHZhbHVlIGZvciAke25hbWV9OiAke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgodmFsKSA9PiB2YWwudHJpbSgpLnJlcGxhY2UoJ2RlZycsICcnKSlcbiAgICAgIC5tYXAoTnVtYmVyKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgcmVzdWx0LnJvdGF0ZSA9IGRlZ3JlZXNUb1JhZGlhbnModmFsdWVzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzY2FsZSc6XG4gICAgICAgIHJlc3VsdC5zY2FsZVggPSB2YWx1ZXNbMF07XG4gICAgICAgIHJlc3VsdC5zY2FsZVkgPSB2YWx1ZXNbMV0gfHwgdmFsdWVzWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2VudidcblxuY29uc3QgREVGQVVMVF9GT05UX0ZBTUlMWSA9ICdzYW5zLXNlcmlmJztcbmxldCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcblxuY29uc3QgZ2V0Q29udGV4dCA9ICgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPT4ge1xuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gZW52LmNyZWF0ZUNhbnZhcygpO1xuICBjYW52YXMud2lkdGggPSAxO1xuICBjYW52YXMuaGVpZ2h0ID0gMTtcbiAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICByZXR1cm4gY29udGV4dDtcbn07XG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCk7XG5cbiAgY29udGV4dC5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnbm9ybWFsJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuXG4gIHJldHVybiBjb250ZXh0Lm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCh2YWx1ZTogc3RyaW5nKSB7XG4gIHJldHVybiBnZXRDb250ZXh0KCkubWVhc3VyZVRleHQodmFsdWUpLndpZHRoIHx8IDA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGV4dChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXG4gIGxldCBtYXhXaWR0aCA9IHN0eWxlLndpZHRoIGFzIG51bWJlcjtcbiAgY29uc3Qgd29yZFdpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG5cbiAgLy8g5a+55paH5a2X5rqi5Ye655qE5aSE55CG77yM6buY6K6k55SoLi4uXG4gIGNvbnN0IHRleHRPdmVyZmxvdyA9IHN0eWxlLnRleHRPdmVyZmxvdyB8fCAnZWxsaXBzaXMnO1xuXG4gIC8vIOaWh+Wtl+acgOWkp+mVv+W6puS4jei2hemZkOWItlxuICBpZiAod29yZFdpZHRoIDw9IG1heFdpZHRoKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLy8g5a+55LqO55So54K554K554K55aSE55CG55qE5oOF5Ya177yM5YWI5bCG5pyA5aSn5a695bqm5YeP5Y67Li4u55qE5a695bqmXG4gIGlmICh0ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICBtYXhXaWR0aCAtPSBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCgnLi4uJyk7XG4gIH1cblxuICBsZXQgbGVuZ3RoID0gdmFsdWUubGVuZ3RoIC0gMTtcbiAgbGV0IHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuXG4gIHdoaWxlIChnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udChzdHIpID4gbWF4V2lkdGggJiYgbGVuZ3RoID4gMCkge1xuICAgIGxlbmd0aCAtPSAxO1xuICAgIHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIChsZW5ndGggJiYgdGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnXG4gICAgPyBgJHtzdHJ9Li4uYFxuICAgIDogc3RyKTtcbn1cblxuaW50ZXJmYWNlIElUZXh0UHJvcHMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIElUZXh0U2hhZG93IHtcbiAgb2Zmc2V0WDogbnVtYmVyO1xuICBvZmZzZXRZOiBudW1iZXI7XG4gIGJsdXJSYWRpdXM6IG51bWJlcjtcbiAgY29sb3I6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIHZhbHVlc3JjID0gJyc7XG4gIHByaXZhdGUgb3JpZ2luU3R5bGVXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZSA9ICdib3R0b20nO1xuICBwdWJsaWMgZm9udCA9ICcnO1xuICBwdWJsaWMgdGV4dEFsaWduOiBDYW52YXNUZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHB1YmxpYyBmaWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgcHVibGljIHRleHRTaGFkb3dzITogbnVsbCB8IElUZXh0U2hhZG93W107XG4gIFxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICB2YWx1ZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElUZXh0UHJvcHMpIHtcbiAgICBsZXQgb3JpZ2luU3R5bGVXaWR0aCA9IHN0eWxlLndpZHRoO1xuICAgIC8vIOayoeacieiuvue9ruWuveW6pueahOaXtuWAmemAmui/h2NhbnZhc+iuoeeul+WHuuaWh+Wtl+WuveW6plxuICAgIGlmIChvcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VUZXh0KHN0eWxlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS5oZWlnaHQgPSBzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlciB8fCBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICB9XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1RleHQnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG4gICAgdGhpcy5vcmlnaW5TdHlsZVdpZHRoID0gb3JpZ2luU3R5bGVXaWR0aDtcblxuICAgIGlmIChzdHlsZS50ZXh0U2hhZG93KSB7XG4gICAgICB0aGlzLnBhcnNlVGV4dFNoYWRvdyhzdHlsZS50ZXh0U2hhZG93KTtcbiAgICB9XG4gIH1cblxuICBzdHlsZUNoYW5nZUhhbmRsZXIocHJvcDogc3RyaW5nLCB2YWw6IGFueSkge1xuICAgIGlmIChwcm9wID09PSAndGV4dFNoYWRvdycpIHtcbiAgICAgIHRoaXMucGFyc2VUZXh0U2hhZG93KHZhbCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRleHRTaGFkb3codGV4dFNoYWRvdzogc3RyaW5nKSB7XG4gICAgLy8gaWYgKCFpc1ZhbGlkVGV4dFNoYWRvdyh0ZXh0U2hhZG93KSkge1xuICAgIC8vICAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dGV4dFNoYWRvd30gaXMgbm90IGEgdmFsaWQgdGV4dFNoYWRvd2ApO1xuICAgIC8vIH0gZWxzZSB7XG4gICAgICAvLyDop6PmnpAgdGV4dC1zaGFkb3cg5a2X56ym5LiyXG4gICAgICB0aGlzLnRleHRTaGFkb3dzID0gdGV4dFNoYWRvdy5zcGxpdCgnLCcpLm1hcChzaGFkb3cgPT4ge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHNoYWRvdy50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHBhcnNlRmxvYXQocGFydHNbMF0pO1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gcGFyc2VGbG9hdChwYXJ0c1sxXSk7XG4gICAgICAgIGNvbnN0IGJsdXJSYWRpdXMgPSBwYXJzZUZsb2F0KHBhcnRzWzJdKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBwYXJ0c1szXTtcblxuICAgICAgICByZXR1cm4geyBvZmZzZXRYLCBvZmZzZXRZLCBibHVyUmFkaXVzLCBjb2xvciB9O1xuICAgICAgfSk7XG4gICAgLy8gfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICBpZiAodGhpcy5vcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gcGFyc2VUZXh0KHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xuICAgICAgbGV0IHsgcGFyZW50IH0gPSB0aGlzO1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQuaXNEaXJ0eSA9IHRydWU7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9DYW52YXNEYXRhKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcblxuICAgIHRoaXMuZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICB0aGlzLnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIHRoaXMuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJyd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcbiAgICB0aGlzLnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbiB8fCAnbGVmdCc7XG4gICAgdGhpcy5maWxsU3R5bGUgPSBzdHlsZS5jb2xvciB8fCAnIzAwMCc7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudG9DYW52YXNEYXRhKCk7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBsZXQgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigndGVzdCcpO1xuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSB0aGlzLnRleHRCYXNlbGluZTtcbiAgICBjdHguZm9udCA9IHRoaXMuZm9udDtcbiAgICBjdHgudGV4dEFsaWduID0gdGhpcy50ZXh0QWxpZ247XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxTdHlsZTtcblxuICAgIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgIGRyYXdYICs9IHdpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICBkcmF3WCArPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUubGluZUhlaWdodCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgZHJhd1kgKz0gKHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyKSAvIDI7XG4gICAgfVxuXG4gICAgLy8g57q555CG5paH5a2X5o+P6L65XG4gICAgaWYgKHN0eWxlLnRleHRTdHJva2VDb2xvcikge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLnRleHRTdHJva2VXaWR0aCB8fCAxO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUudGV4dFN0cm9rZUNvbG9yIGFzIHN0cmluZztcblxuICAgICAgY3R4LnN0cm9rZVRleHQoXG4gICAgICAgIHRoaXMudmFsdWUsXG4gICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyDlpITnkIbmloflrZfpmLTlvbFcbiAgICBpZiAodGhpcy50ZXh0U2hhZG93cykge1xuICAgICAgdGhpcy50ZXh0U2hhZG93cy5mb3JFYWNoKCh7IG9mZnNldFgsIG9mZnNldFksIGJsdXJSYWRpdXMsIGNvbG9yIH0pID0+IHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSBvZmZzZXRYO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IG9mZnNldFk7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gYmx1clJhZGl1cztcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gY29sb3I7XG4gICAgICAgIGN0eC5maWxsVGV4dChcbiAgICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7ICBcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdWaWV3JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblkgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgR2FtZUdsb2JhbC5fX2VudiA9IEdhbWVHbG9iYWwud3ggfHwgR2FtZUdsb2JhbC50dCB8fCBHYW1lR2xvYmFsLnN3YW47XG59XG5cbmNvbnN0IGRvbUV2ZW50TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICB0b3VjaHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgdG91Y2htb3ZlOiAnbW91c2Vtb3ZlJyxcbiAgdG91Y2hlbmQ6ICdtb3VzZXVwJyxcbiAgdG91Y2hjYW5jZWw6ICdtb3VzZWxlYXZlJyxcbn1cblxuZW51bSBldmVudFR5cGUge1xuICBvbiA9ICdvbicsXG4gIG9mZiA9ICdvZmYnLFxufVxuXG5mdW5jdGlvbiBnZW5Eb21Ub3VjaEV2ZW50KGV2ZW50OiBzdHJpbmcsIHR5cGU6IGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAobGlzdGVuZXI6IENhbGxiYWNrKSB7XG4gICAgICB0eXBlID09PSBldmVudFR5cGUub24gP1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgICAgIDogZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRPblRvdWNoSGFuZGxlcihldmVudDogc3RyaW5nLCB0eXBlOiBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBHYW1lR2xvYmFsLl9fZW52W2Ake3R5cGV9JHtldmVudH1gXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZW5Eb21Ub3VjaEV2ZW50KGRvbUV2ZW50TWFwW2V2ZW50LnRvTG93ZXJDYXNlKCldLCB0eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIExheW91dCDlj6/og73nlKjlnKjkuI3nlKjnmoTlubPlj7DvvIzogIxMYXlvdXTkvJrkvp3otZblubPlj7DkuIvpnaLnmoTkuIDkupvmlrnms5XmnaXlrp7njrDlhbfkvZPnmoTlip/og73vvIzmr5TlpoLliJvlu7rlm77niYdcbiAqIOS4uuS6huabtOWlveWBmuW5s+WPsOmAgumFje+8jOe7n+S4gOWwgeijhSBlbnYg5qih5Z2X77yM5LiN5ZCM5bmz5Y+w6KaB5YGa6YCC6YWN77yM5pu/5o2iIGVudiDnmoTlhbfkvZPmlrnms5XljbPlj69cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvLyDnm5HlkKzop6bmkbjnm7jlhbPkuovku7ZcbiAgb25Ub3VjaFN0YXJ0OiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hTdGFydCcsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hNb3ZlOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hNb3ZlJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaENhbmNlbDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoQ2FuY2VsJywgZXZlbnRUeXBlLm9uKSxcbiAgLy8g5Y+W5raI55uR5ZCs6Kem5pG455u45YWz5LqL5Lu2XG4gIG9mZlRvdWNoU3RhcnQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaFN0YXJ0JywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoTW92ZTogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoTW92ZScsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoQ2FuY2VsOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hDYW5jZWwnLCBldmVudFR5cGUub2ZmKSxcblxuICAvLyBMYXlvdXQg5pSv5oyB55m+5YiG5q+U5qC35byP77yM5aaC5p6c5qC56IqC54K55qC35byP6K6+572u5Li6IDEwMCXvvIznm7TmjqXlj5YgQ2FudmFzIOeahOWwuuWvuO+8jOS4jeWQjOW5s+WPsOeahOWPluazleS4jeS4gOagt++8jOWboOatpOWNleeLrOaPkOS+m+WHveaVsFxuICBnZXRSb290Q2FudmFzU2l6ZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTaGFyZWRDYW52YXMpIHtcbiAgICAgIGNvbnN0IGN2cyA9IF9fZW52LmdldFNoYXJlZENhbnZhcygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGN2cy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjdnMuaGVpZ2h0LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IDE1MCxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8g5Y+W5b2T5YmN6K6+5aSH55qEIGRldmljZVBpeGVsUmF0aW/vvIzkuI3lkIzlubPlj7DnmoTlj5bms5XkuI3kuIDmoLdcbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgICAgcmV0dXJuIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKCkuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG4gICAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfSxcblxuICAvLyDliJvlu7pDYW52YXNcbiAgY3JlYXRlQ2FudmFzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICB9LFxuXG4gIC8vIOWIm+W7uuWbvueJh1xuICBjcmVhdGVJbWFnZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gICAgfVxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGNvbnZlcnRUb0pzb24gPSBmdW5jdGlvbihub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGpPYmogPSB7XG4gICAgbmFtZTogbm9kZS50YWduYW1lXG4gIH07XG5cbiAgLy93aGVuIG5vIGNoaWxkIG5vZGUgb3IgYXR0ciBpcyBwcmVzZW50XG4gIGlmICgoIW5vZGUuY2hpbGQgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuY2hpbGQpKSAmJiAoIW5vZGUuYXR0cnNNYXAgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuYXR0cnNNYXApKSkge1xuICAgIHJldHVybiB1dGlsLmlzRXhpc3Qobm9kZS52YWwpICYmICEhbm9kZS52YWwgPyBub2RlLnZhbCA6IGpPYmo7XG4gIH0gZWxzZSB7XG4gICAgLy9vdGhlcndpc2UgY3JlYXRlIGEgdGV4dG5vZGUgaWYgbm9kZSBoYXMgc29tZSB0ZXh0XG4gICAgaWYgKHV0aWwuaXNFeGlzdChub2RlLnZhbCkpIHtcbiAgICAgIGlmICghKHR5cGVvZiBub2RlLnZhbCA9PT0gJ3N0cmluZycgJiYgKG5vZGUudmFsID09PSAnJyB8fCBub2RlLnZhbCA9PT0gb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcikpKSB7XG4gICAgICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSBcInN0cmljdFwiKXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IFsgbm9kZS52YWwgXTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBub2RlLnZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdXRpbC5tZXJnZShqT2JqLCBub2RlLmF0dHJzTWFwLCBvcHRpb25zLmFycmF5TW9kZSk7XG5cbiAgak9iai5jaGlsZHJlbiA9IFtdO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goIGNoaWxkID0+IHtcbiAgICBqT2JqLmNoaWxkcmVuLnB1c2goY29udmVydFRvSnNvbihjaGlsZCwgb3B0aW9ucykpXG4gIH0pO1xuXG4gIC8vYWRkIHZhbHVlXG4gIHJldHVybiBqT2JqO1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9Kc29uID0gY29udmVydFRvSnNvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgbm9kZVRvSnNvbiA9IHJlcXVpcmUoJy4vbm9kZTJqc29uJyk7XG5jb25zdCB4bWxUb05vZGVvYmogPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCB4MnhtbG5vZGUgPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucywgdmFsaWRhdGlvbk9wdGlvbikge1xuICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICBpZih2YWxpZGF0aW9uT3B0aW9uID09PSB0cnVlKSB2YWxpZGF0aW9uT3B0aW9uID0ge31cblxuICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUoeG1sRGF0YSwgdmFsaWRhdGlvbk9wdGlvbik7XG4gICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICB0aHJvdyBFcnJvciggcmVzdWx0LmVyci5tc2cpXG4gICAgIH1cbiAgIH1cbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCB4MnhtbG5vZGUuZGVmYXVsdE9wdGlvbnMsIHgyeG1sbm9kZS5wcm9wcyk7XG4gIHJldHVybiBub2RlVG9Kc29uLmNvbnZlcnRUb0pzb24oeG1sVG9Ob2Rlb2JqLmdldFRyYXZlcnNhbE9iaih4bWxEYXRhLCBvcHRpb25zKSwgb3B0aW9ucyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxtYXRjaGVzID0gW107XG4gICAgY29uc3QgbGVuID0gbWF0Y2gubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIGFsbG1hdGNoZXMucHVzaChtYXRjaFtpbmRleF0pO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goYWxsbWF0Y2hlcyk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5jb25zdCBkb2VzTWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmNvbnN0IGRvZXNOb3RNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuICFkb2VzTWF0Y2goc3RyaW5nLCByZWdleCk7XG59O1xuXG5leHBvcnRzLmlzRXhpc3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBDb3B5IGFsbCB0aGUgcHJvcGVydGllcyBvZiBhIGludG8gYi5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0XG4gKiBAcGFyYW0geyp9IGFcbiAqL1xuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgYSwgYXJyYXlNb2RlKSB7XG4gIGlmIChhKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGEpOyAvLyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBvd24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYoYXJyYXlNb2RlID09PSAnc3RyaWN0Jyl7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IFsgYVtrZXlzW2ldXSBdO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IGFba2V5c1tpXV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuLyogZXhwb3J0cy5tZXJnZSA9ZnVuY3Rpb24gKGIsYSl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGIsYSk7XG59ICovXG5cbmV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbih2KSB7XG4gIGlmIChleHBvcnRzLmlzRXhpc3QodikpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8vIGNvbnN0IGZha2VDYWxsID0gZnVuY3Rpb24oYSkge3JldHVybiBhO307XG4vLyBjb25zdCBmYWtlQ2FsbE5vUmV0dXJuID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpIHtcbiAgdmFyIG5ld09wdGlvbnMgPSB7fTtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRpb25zOyAvL2lmIHRoZXJlIGFyZSBub3Qgb3B0aW9uc1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IG9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59O1xuXG5leHBvcnRzLmRvZXNNYXRjaCA9IGRvZXNNYXRjaDtcbmV4cG9ydHMuZG9lc05vdE1hdGNoID0gZG9lc05vdE1hdGNoO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICBsb2NhbGVSYW5nZTogJ2EtekEtWicsXG59O1xuXG5jb25zdCBwcm9wcyA9IFsnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsICdsb2NhbGVSYW5nZSddO1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHV0aWwuYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuXG4gIGNvbnN0IHRhZ3MgPSBbXTtcbiAgbGV0IHRhZ0ZvdW5kID0gZmFsc2U7XG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIGNvbnN0IHJlZ3hBdHRyTmFtZSA9IG5ldyBSZWdFeHAoJ15bX3ddW1xcXFx3XFxcXC0uOl0qJCcucmVwbGFjZSgnX3cnLCAnXycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGNvbnN0IHJlZ3hUYWdOYW1lID0gbmV3IFJlZ0V4cCgnXihbd118XylbXFxcXHcuXFxcXC1fOl0qJy5yZXBsYWNlKCcoW3cnLCAnKFsnICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAvL3N0YXJ0aW5nIG9mIHRhZ1xuICAgICAgLy9yZWFkIHVudGlsIHlvdSByZWFjaCB0byAnPicgYXZvaWRpbmcgYW55ICc+JyBpbiBhdHRyaWJ1dGUgdmFsdWVcblxuICAgICAgaSsrO1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc/Jykge1xuICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgIGlmIChpLmVycikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIDtcbiAgICAgICAgICBpIDwgeG1sRGF0YS5sZW5ndGggJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnPicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnICcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFx0JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXG4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xccic7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIHRhZ05hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50cmltKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGFnTmFtZSk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYXR0cmlidXRlc1xuICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cmluZygwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGVUYWdOYW1lKHRhZ05hbWUsIHJlZ3hUYWdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdUYWcgJyArIHRhZ05hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnQXR0cmlidXRlcyBmb3IgXCInICsgdGFnTmFtZSArICdcIiBoYXZlIG9wZW4gcXVvdGUuJ319O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyU3RyID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICAgIGlmIChhdHRyU3RyW2F0dHJTdHIubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGF0dHJTdHIgPSBhdHRyU3RyLnN1YnN0cmluZygwLCBhdHRyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsb3NpbmdUYWcpIHtcbiAgICAgICAgICBpZighcmVzdWx0LnRhZ0Nsb3NlZCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgZG9uJ3QgaGF2ZSBwcm9wZXIgY2xvc2luZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1lbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgY2FuJ3QgaGF2ZSBhdHRyaWJ1dGVzIG9yIGludmFsaWQgc3RhcnRpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3RnID0gdGFncy5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSBvdGcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnICcgKyBvdGcgKyAnIGlzIGV4cGVjdGVkIGlucGxhY2Ugb2YgJyArIHRhZ05hbWUgKyAnLid9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3MucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NraXAgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgLy9JdCBtYXkgaW5jbHVkZSBjb21tZW50cyBhbmQgQ0RBVEEgdmFsdWVcbiAgICAgICAgZm9yIChpKys7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaSArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgLy9jb21tZW50IG9yIENBREFUQVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcgJyB8fCB4bWxEYXRhW2ldID09PSAnXFx0JyB8fCB4bWxEYXRhW2ldID09PSAnXFxuJyB8fCB4bWxEYXRhW2ldID09PSAnXFxyJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRDaGFyJywgbXNnOiAnY2hhciAnICsgeG1sRGF0YVtpXSArICcgaXMgbm90IGV4cGVjdGVkIC4nfX07XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdTdGFydCB0YWcgZXhwZWN0ZWQuJ319O1xuICB9IGVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ0ludmFsaWQgJyArIEpTT04uc3RyaW5naWZ5KHRhZ3MsIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpICsgJyBmb3VuZC4nfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlYWQgUHJvY2Vzc2luZyBpbnNzdHJ1Y3Rpb25zIGFuZCBza2lwXG4gKiBAcGFyYW0geyp9IHhtbERhdGFcbiAqIEBwYXJhbSB7Kn0gaVxuICovXG5mdW5jdGlvbiByZWFkUEkoeG1sRGF0YSwgaSkge1xuICB2YXIgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgdmFyIHRhZ25hbWUgPSB4bWxEYXRhLnN1YnN0cihzdGFydCwgaSAtIHN0YXJ0KTtcbiAgICAgIGlmIChpID4gNSAmJiB0YWduYW1lID09PSAneG1sJykge1xuICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnWE1MIGRlY2xhcmF0aW9uIGFsbG93ZWQgb25seSBhdCB0aGUgc3RhcnQgb2YgdGhlIGRvY3VtZW50Lid9fTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG52YXIgZG91YmxlUXVvdGUgPSAnXCInO1xudmFyIHNpbmdsZVF1b3RlID0gXCInXCI7XG5cbi8qKlxuICogS2VlcCByZWFkaW5nIHhtbERhdGEgdW50aWwgJzwnIGlzIGZvdW5kIG91dHNpZGUgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5mdW5jdGlvbiByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpIHtcbiAgbGV0IGF0dHJTdHIgPSAnJztcbiAgbGV0IHN0YXJ0Q2hhciA9ICcnO1xuICBsZXQgdGFnQ2xvc2VkID0gZmFsc2U7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSBkb3VibGVRdW90ZSB8fCB4bWxEYXRhW2ldID09PSBzaW5nbGVRdW90ZSkge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgc3RhcnRDaGFyID0geG1sRGF0YVtpXTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnRDaGFyICE9PSB4bWxEYXRhW2ldKSB7XG4gICAgICAgIC8vaWYgdmF1ZSBpcyBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZSB0aGVuIHNpbmdsZSBxdW90ZXMgYXJlIGFsbG93ZWQgaW5zaWRlIHRoZSB2YWx1ZSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHt2YWx1ZTogYXR0clN0ciwgaW5kZXg6IGksIHRhZ0Nsb3NlZDogdGFnQ2xvc2VkfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgYWxsIHRoZSBhdHRyaWJ1dGVzIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZC5cbiAqL1xuY29uc3QgdmFsaWRBdHRyU3RyUmVneHAgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKShbXlxcXFxzPV0rKShcXFxccyo9KT8oXFxcXHMqKFtcXCdcIl0pKChbXFxcXHNcXFxcU10pKj8pXFxcXDUpPycsICdnJyk7XG5cbi8vYXR0ciwgPVwic2RcIiwgYT1cImFtaXQnc1wiLCBhPVwic2RcImI9XCJzYWZcIiwgYWIgIGNkPVwiXCJcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vY29uc29sZS5sb2cobWF0Y2hlc1tpXSk7XG5cbiAgICBpZiAobWF0Y2hlc1tpXVsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vbm9zcGFjZSBiZWZvcmUgYXR0cmlidXRlIG5hbWU6IGE9XCJzZFwiYj1cInNhZlwiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLid9fTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gPT09IHVuZGVmaW5lZCAmJiAhb3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAvL2luZGVwZW5kZW50IGF0dHJpYnV0ZTogYWJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYm9vbGVhbiBhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGlzIG5vdCBhbGxvd2VkLid9fTtcbiAgICB9XG4gICAgLyogZWxzZSBpZihtYXRjaGVzW2ldWzZdID09PSB1bmRlZmluZWQpey8vYXR0cmlidXRlIHdpdGhvdXQgdmFsdWU6IGFiPVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IHsgY29kZTpcIkludmFsaWRBdHRyXCIsbXNnOlwiYXR0cmlidXRlIFwiICsgbWF0Y2hlc1tpXVsyXSArIFwiIGhhcyBubyB2YWx1ZSBhc3NpZ25lZC5cIn19O1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICBjb25zdCBhdHRyTmFtZSA9IG1hdGNoZXNbaV1bMl07XG4gICAgaWYgKCF2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpKSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgfVxuICAgIC8qaWYgKCFhdHRyTmFtZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7Ki9cbiAgICBpZiAoICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck5hbWVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyByZXBlYXRlZC4nfX07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gL15bX2EtekEtWl1bXFx3XFwtLjpdKiQvO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpIHtcbiAgLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSBuZXcgUmVnRXhwKHJlZ3hBdHRyTmFtZSk7XG4gIHJldHVybiB1dGlsLmRvZXNNYXRjaChhdHRyTmFtZSwgcmVneEF0dHJOYW1lKTtcbn1cblxuLy9jb25zdCBzdGFydHNXaXRoWE1MID0gbmV3IFJlZ0V4cChcIl5bWHhdW01tXVtMbF1cIik7XG4vLyAgc3RhcnRzV2l0aCA9IC9eKFthLXpBLVpdfF8pW1xcdy5cXC1fOl0qLztcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKSB7XG4gIC8qaWYodXRpbC5kb2VzTWF0Y2godGFnbmFtZSxzdGFydHNXaXRoWE1MKSkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UqL1xuICByZXR1cm4gIXV0aWwuZG9lc05vdE1hdGNoKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YWduYW1lLCBwYXJlbnQsIHZhbCkge1xuICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5jaGlsZCA9IHt9OyAvL2NoaWxkIHRhZ3NcbiAgdGhpcy5hdHRyc01hcCA9IHt9OyAvL2F0dHJpYnV0ZXMgbWFwXG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy52YWwgPSB2YWw7IC8vdGV4dCBvbmx5XG4gIHRoaXMuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSkpIHtcbiAgICAgIC8vYWxyZWFkeSBwcmVzZW50c1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXS5wdXNoKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSA9IFtjaGlsZF07XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgeG1sTm9kZSA9IHJlcXVpcmUoJy4veG1sTm9kZScpO1xuY29uc3QgVGFnVHlwZSA9IHtPUEVOSU5HOiAxLCBDTE9TSU5HOiAyLCBTRUxGOiAzLCBDREFUQTogNH07XG5sZXQgcmVneCA9XG4gICc8KCghXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KShdXT4pKXwoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpKFtePl0qKT58KChcXFxcLykoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpXFxcXHMqPikpKFtePF0qKSc7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbi8vcG9seWZpbGxcbmlmICghTnVtYmVyLnBhcnNlSW50ICYmIHdpbmRvdy5wYXJzZUludCkge1xuICBOdW1iZXIucGFyc2VJbnQgPSB3aW5kb3cucGFyc2VJbnQ7XG59XG5pZiAoIU51bWJlci5wYXJzZUZsb2F0ICYmIHdpbmRvdy5wYXJzZUZsb2F0KSB7XG4gIE51bWJlci5wYXJzZUZsb2F0ID0gd2luZG93LnBhcnNlRmxvYXQ7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnQF8nLFxuICBhdHRyTm9kZU5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGlnbm9yZU5hbWVTcGFjZTogZmFsc2UsXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZU5vZGVWYWx1ZTogdHJ1ZSxcbiAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gIGFycmF5TW9kZTogZmFsc2UsXG4gIHRyaW1WYWx1ZXM6IHRydWUsIC8vVHJpbSBzdHJpbmcgdmFsdWVzIG9mIHRhZyBhbmQgYXR0cmlidXRlc1xuICBjZGF0YVRhZ05hbWU6IGZhbHNlLFxuICBjZGF0YVBvc2l0aW9uQ2hhcjogJ1xcXFxjJyxcbiAgbG9jYWxlUmFuZ2U6ICcnLFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgc3RvcE5vZGVzOiBbXVxuICAvL2RlY29kZVN0cmljdDogZmFsc2UsXG59O1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmNvbnN0IHByb3BzID0gW1xuICAnYXR0cmlidXRlTmFtZVByZWZpeCcsXG4gICdhdHRyTm9kZU5hbWUnLFxuICAndGV4dE5vZGVOYW1lJyxcbiAgJ2lnbm9yZUF0dHJpYnV0ZXMnLFxuICAnaWdub3JlTmFtZVNwYWNlJyxcbiAgJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLFxuICAncGFyc2VOb2RlVmFsdWUnLFxuICAncGFyc2VBdHRyaWJ1dGVWYWx1ZScsXG4gICdhcnJheU1vZGUnLFxuICAndHJpbVZhbHVlcycsXG4gICdjZGF0YVRhZ05hbWUnLFxuICAnY2RhdGFQb3NpdGlvbkNoYXInLFxuICAnbG9jYWxlUmFuZ2UnLFxuICAndGFnVmFsdWVQcm9jZXNzb3InLFxuICAnYXR0clZhbHVlUHJvY2Vzc29yJyxcbiAgJ3BhcnNlVHJ1ZU51bWJlck9ubHknLFxuICAnc3RvcE5vZGVzJ1xuXTtcbmV4cG9ydHMucHJvcHMgPSBwcm9wcztcblxuY29uc3QgZ2V0VHJhdmVyc2FsT2JqID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvXFxyP1xcbi9nLCBcIiBcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIHhtbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLzwhLS1bXFxzXFxTXSo/LS0+L2csICcnKTsgLy9SZW1vdmUgIGNvbW1lbnRzXG5cbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuXG4gIHJlZ3ggPSByZWd4LnJlcGxhY2UoL1xcW1xcXFx3L2csICdbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UgKyAnXFxcXHcnKTtcbiAgY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKHJlZ3gsICdnJyk7XG4gIGxldCB0YWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICBsZXQgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIHdoaWxlICh0YWcpIHtcbiAgICBjb25zdCB0YWdUeXBlID0gY2hlY2tGb3JUYWdUeXBlKHRhZyk7XG5cbiAgICBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DTE9TSU5HKSB7XG4gICAgICAvL2FkZCBwYXJzZWQgZGF0YSB0byBwYXJlbnQgbm9kZVxuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudCAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnBhcmVudC52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnBhcmVudC52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zLCBjdXJyZW50Tm9kZS5wYXJlbnQudGFnbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGN1cnJlbnROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmNoaWxkID0gW11cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmF0dHJzTWFwID09IHVuZGVmaW5lZCkgeyBjdXJyZW50Tm9kZS5hdHRyc01hcCA9IHt9fVxuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB4bWxEYXRhLnN1YnN0cihjdXJyZW50Tm9kZS5zdGFydEluZGV4ICsgMSwgdGFnLmluZGV4IC0gY3VycmVudE5vZGUuc3RhcnRJbmRleCAtIDEpXG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0RBVEEpIHtcbiAgICAgIGlmIChvcHRpb25zLmNkYXRhVGFnTmFtZSkge1xuICAgICAgICAvL2FkZCBjZGF0YSBub2RlXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuY2RhdGFUYWdOYW1lLCBjdXJyZW50Tm9kZSwgdGFnWzNdKTtcbiAgICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIC8vZm9yIGJhY2t0cmFja2luZ1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyO1xuICAgICAgICAvL2FkZCByZXN0IHZhbHVlIHRvIHBhcmVudCBub2RlXG4gICAgICAgIGlmICh0YWdbMTRdKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUudmFsICs9IHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSAoY3VycmVudE5vZGUudmFsIHx8ICcnKSArICh0YWdbM10gfHwgJycpICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLlNFTEYpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLCBjdXJyZW50Tm9kZSwgJycpO1xuICAgICAgaWYgKHRhZ1s4XSAmJiB0YWdbOF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdbOF0gPSB0YWdbOF0uc3Vic3RyKDAsIHRhZ1s4XS5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UYWdUeXBlLk9QRU5JTkdcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKFxuICAgICAgICBvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpXG4gICAgICApO1xuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjaGlsZE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY2hpbGROb2RlLnN0YXJ0SW5kZXg9dGFnLmluZGV4ICsgdGFnWzFdLmxlbmd0aFxuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjaGlsZE5vZGU7XG4gICAgfVxuXG4gICAgdGFnID0gbmV4dFRhZztcbiAgICBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgfVxuXG4gIHJldHVybiB4bWxPYmo7XG59O1xuXG5mdW5jdGlvbiBwcm9jZXNzVGFnVmFsdWUocGFyc2VkVGFncywgb3B0aW9ucywgcGFyZW50VGFnTmFtZSkge1xuICBjb25zdCB0YWdOYW1lID0gcGFyc2VkVGFnc1s3XSB8fCBwYXJlbnRUYWdOYW1lO1xuICBsZXQgdmFsID0gcGFyc2VkVGFnc1sxNF07XG4gIGlmICh2YWwpIHtcbiAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgIH1cbiAgICB2YWwgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHZhbCwgdGFnTmFtZSk7XG4gICAgdmFsID0gcGFyc2VWYWx1ZSh2YWwsIG9wdGlvbnMucGFyc2VOb2RlVmFsdWUsIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seSk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclRhZ1R5cGUobWF0Y2gpIHtcbiAgaWYgKG1hdGNoWzRdID09PSAnXV0+Jykge1xuICAgIHJldHVybiBUYWdUeXBlLkNEQVRBO1xuICB9IGVsc2UgaWYgKG1hdGNoWzEwXSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0xPU0lORztcbiAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbOF0gIT09ICd1bmRlZmluZWQnICYmIG1hdGNoWzhdLnN1YnN0cihtYXRjaFs4XS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuU0VMRjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVGFnVHlwZS5PUEVOSU5HO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYW1lU3BhY2UodGFnbmFtZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGxldCBwYXJzZWQ7XG4gICAgaWYgKHZhbC50cmltKCkgPT09ICcnIHx8IGlzTmFOKHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IHZhbCA9PT0gJ3RydWUnID8gdHJ1ZSA6IHZhbCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsLmluZGV4T2YoJzB4JykgIT09IC0xKSB7XG4gICAgICAgIC8vc3VwcG9ydCBoZXhhIGRlY2ltYWxcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTYpO1xuICAgICAgfSBlbHNlIGlmICh2YWwuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgICAgICAgcGFyc2VkID0gU3RyaW5nKHBhcnNlZCkgPT09IHZhbCA/IHBhcnNlZCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKC4qPylcXFxcMyk/JywgJ2cnKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMgJiYgdHlwZW9mIGF0dHJTdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgYXR0clN0ciA9IGF0dHJTdHIucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIC8vYXR0clN0ciA9IGF0dHJTdHIgfHwgYXR0clN0ci50cmltKCk7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIGF0dHJzUmVneCk7XG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gcmVzb2x2ZU5hbWVTcGFjZShtYXRjaGVzW2ldWzFdLCBvcHRpb25zKTtcbiAgICAgIGlmIChhdHRyTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1hdGNoZXNbaV1bNF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBtYXRjaGVzW2ldWzRdLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG9wdGlvbnMuYXR0clZhbHVlUHJvY2Vzc29yKG1hdGNoZXNbaV1bNF0sIGF0dHJOYW1lKTtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSBwYXJzZVZhbHVlKFxuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXR0ck5vZGVOYW1lKSB7XG4gICAgICBjb25zdCBhdHRyQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgYXR0ckNvbGxlY3Rpb25bb3B0aW9ucy5hdHRyTm9kZU5hbWVdID0gYXR0cnM7XG4gICAgICByZXR1cm4gYXR0ckNvbGxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxufVxuXG5leHBvcnRzLmdldFRyYXZlcnNhbE9iaiA9IGdldFRyYXZlcnNhbE9iajtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuXG4vKipcbiAqIEdlbmVyaWMgYW5pbWF0aW9uIGNsYXNzIHdpdGggc3VwcG9ydCBmb3IgZHJvcHBlZCBmcmFtZXMgYm90aCBvcHRpb25hbCBlYXNpbmcgYW5kIGR1cmF0aW9uLlxuICpcbiAqIE9wdGlvbmFsIGR1cmF0aW9uIGlzIHVzZWZ1bCB3aGVuIHRoZSBsaWZldGltZSBpcyBkZWZpbmVkIGJ5IGFub3RoZXIgY29uZGl0aW9uIHRoYW4gdGltZVxuICogZS5nLiBzcGVlZCBvZiBhbiBhbmltYXRpbmcgb2JqZWN0LCBldGMuXG4gKlxuICogRHJvcHBlZCBmcmFtZSBsb2dpYyBhbGxvd3MgdG8ga2VlcCB1c2luZyB0aGUgc2FtZSB1cGRhdGVyIGxvZ2ljIGluZGVwZW5kZW50IGZyb20gdGhlIGFjdHVhbFxuICogcmVuZGVyaW5nLiBUaGlzIGVhc2VzIGEgbG90IG9mIGNhc2VzIHdoZXJlIGl0IG1pZ2h0IGJlIHByZXR0eSBjb21wbGV4IHRvIGJyZWFrIGRvd24gYSBzdGF0ZVxuICogYmFzZWQgb24gdGhlIHB1cmUgdGltZSBkaWZmZXJlbmNlLlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KU1xuICAgICAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KChyb290LmFuaW1hdGUgPSB7fSkpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICB2YXIgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93XG4gICAgdmFyIHRpbWUgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiArbmV3IERhdGUoKTtcbiAgICB9O1xuICAgIHZhciBkZXNpcmVkRnJhbWVzID0gNjA7XG4gICAgdmFyIG1pbGxpc2Vjb25kc1BlclNlY29uZCA9IDEwMDA7XG4gICAgdmFyIHJ1bm5pbmcgPSB7fTtcbiAgICB2YXIgY291bnRlciA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgZ2l2ZW4gYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIHdhcyBzdG9wcGVkIChha2EsIHdhcyBydW5uaW5nIGJlZm9yZSlcbiAgICAgKi9cbiAgICBleHBvcnRzLnN0b3AgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmFyIGNsZWFyZWQgPSAocnVubmluZ1tpZF0gIT09IG51bGwpO1xuICAgICAgICBpZiAoY2xlYXJlZCkge1xuICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFyZWQ7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgZ2l2ZW4gYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZ1xuICAgICAqL1xuICAgIGV4cG9ydHMuaXNSdW5uaW5nID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBydW5uaW5nW2lkXSAhPT0gbnVsbDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0ZXBDYWxsYmFjayB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZnVuY3Rpb24gd2hpY2ggaXMgZXhlY3V0ZWQgb24gZXZlcnkgc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCwgbm93LCB2aXJ0dWFsKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIHZlcmlmeUNhbGxiYWNrIHtGdW5jdGlvbn0gRXhlY3V0ZWQgYmVmb3JlIGV2ZXJ5IGFuaW1hdGlvbiBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gY29tcGxldGVkQ2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihkcm9wcGVkRnJhbWVzLCBmaW5pc2hlZEFuaW1hdGlvbiwgb3B0aW9uYWwgd2FzRmluaXNoZWQpIHt9YFxuICAgICAqIEBwYXJhbSBkdXJhdGlvbiB7SW50ZWdlcn0gTWlsbGlzZWNvbmRzIHRvIHJ1biB0aGUgYW5pbWF0aW9uXG4gICAgICogQHBhcmFtIGVhc2luZ01ldGhvZCB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZWFzaW5nIGZ1bmN0aW9uXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQpIHsgcmV0dXJuIG1vZGlmaWVkVmFsdWU7IH1gXG4gICAgICogQHBhcmFtIHJvb3Qge0VsZW1lbnR9IFJlbmRlciByb290LiBVc2VkIGZvciBpbnRlcm5hbCB1c2FnZSBvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gSWRlbnRpZmllciBvZiBhbmltYXRpb24uIENhbiBiZSB1c2VkIHRvIHN0b3AgaXQgYW55IHRpbWUuXG4gICAgICovXG4gICAgZXhwb3J0cy5zdGFydCA9IGZ1bmN0aW9uIChzdGVwQ2FsbGJhY2ssIHZlcmlmeUNhbGxiYWNrLCBjb21wbGV0ZWRDYWxsYmFjaywgZHVyYXRpb24sIGVhc2luZ01ldGhvZCwgcm9vdCkge1xuICAgICAgICB2YXIgc3RhcnQgPSB0aW1lKCk7XG4gICAgICAgIHZhciBsYXN0RnJhbWUgPSBzdGFydDtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSAwO1xuICAgICAgICB2YXIgZHJvcENvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgaWQgPSBjb3VudGVyKys7XG5cbiAgICAgICAgLy8gQ29tcGFjdGluZyBydW5uaW5nIGRiIGF1dG9tYXRpY2FsbHkgZXZlcnkgZmV3IG5ldyBhbmltYXRpb25zXG4gICAgICAgIGlmIChpZCAlIDIwID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgbmV3UnVubmluZyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgdXNlZElkIGluIHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBuZXdSdW5uaW5nW3VzZWRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVubmluZyA9IG5ld1J1bm5pbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBpbnRlcm5hbCBzdGVwIG1ldGhvZCB3aGljaCBpcyBjYWxsZWQgZXZlcnkgZmV3IG1pbGxpc2Vjb25kc1xuICAgICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uICh2aXJ0dWFsKSB7XG5cbiAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSB2aXJ0dWFsIHZhbHVlXG4gICAgICAgICAgICB2YXIgcmVuZGVyID0gdmlydHVhbCAhPT0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gR2V0IGN1cnJlbnQgdGltZVxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUoKTtcblxuICAgICAgICAgICAgLy8gVmVyaWZpY2F0aW9uIGlzIGV4ZWN1dGVkIGJlZm9yZSBuZXh0IGFuaW1hdGlvbiBzdGVwXG4gICAgICAgICAgICBpZiAoIXJ1bm5pbmdbaWRdIHx8ICh2ZXJpZnlDYWxsYmFjayAmJiAhdmVyaWZ5Q2FsbGJhY2soaWQpKSkge1xuXG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgdGhlIGN1cnJlbnQgcmVuZGVyaW5nIHRvIGFwcGx5IGxldCdzIHVwZGF0ZSBvbWl0dGVkIHN0ZXBzIGluIG1lbW9yeS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IHRvIGJyaW5nIGludGVybmFsIHN0YXRlIHZhcmlhYmxlcyB1cC10by1kYXRlIHdpdGggcHJvZ3Jlc3MgaW4gdGltZS5cbiAgICAgICAgICAgIGlmIChyZW5kZXIpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkcm9wcGVkRnJhbWVzID0gTWF0aC5yb3VuZCgobm93IC0gbGFzdEZyYW1lKSAvIChtaWxsaXNlY29uZHNQZXJTZWNvbmQgLyBkZXNpcmVkRnJhbWVzKSkgLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTWF0aC5taW4oZHJvcHBlZEZyYW1lcywgNCk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBzdGVwKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBkcm9wQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21wdXRlIHBlcmNlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAobm93IC0gc3RhcnQpIC8gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXhlY3V0ZSBzdGVwIGNhbGxiYWNrLCB0aGVuLi4uXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBlYXNpbmdNZXRob2QgPyBlYXNpbmdNZXRob2QocGVyY2VudCkgOiBwZXJjZW50O1xuICAgICAgICAgICAgaWYgKChzdGVwQ2FsbGJhY2sodmFsdWUsIG5vdywgcmVuZGVyKSA9PT0gZmFsc2UgfHwgcGVyY2VudCA9PT0gMSkgJiYgcmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgcGVyY2VudCA9PT0gMSB8fCBkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgbGFzdEZyYW1lID0gbm93O1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXJrIGFzIHJ1bm5pbmdcbiAgICAgICAgcnVubmluZ1tpZF0gPSB0cnVlO1xuXG4gICAgICAgIC8vIEluaXQgZmlyc3Qgc3RlcFxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIHVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59KSk7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cbmltcG9ydCBhbmltYXRlIGZyb20gJy4vYW5pbWF0ZSc7XG52YXIgTk9PUCA9IGZ1bmN0aW9uICgpIHsgfTtcblxuLy8gRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDMpICsgMSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VJbk91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge1xuICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsIDMpO1xuICB9XG5cbiAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksIDMpICsgMik7XG59O1xuXG5cbi8qKlxuICogQSBwdXJlIGxvZ2ljICdjb21wb25lbnQnIGZvciAndmlydHVhbCcgc2Nyb2xsaW5nL3pvb21pbmcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHgtYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWDogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geS1heGlzICovXG4gICAgICBzY3JvbGxpbmdZOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGFuaW1hdGlvbnMgZm9yIGRlY2VsZXJhdGlvbiwgc25hcCBiYWNrLCB6b29taW5nIGFuZCBzY3JvbGxpbmcgKi9cbiAgICAgIGFuaW1hdGluZzogdHJ1ZSxcblxuICAgICAgLyoqIGR1cmF0aW9uIGZvciBhbmltYXRpb25zIHRyaWdnZXJlZCBieSBzY3JvbGxUby96b29tVG8gKi9cbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAyNTAsXG5cbiAgICAgIC8qKiBFbmFibGUgYm91bmNpbmcgKGNvbnRlbnQgY2FuIGJlIHNsb3dseSBtb3ZlZCBvdXRzaWRlIGFuZCBqdW1wcyBiYWNrIGFmdGVyIHJlbGVhc2luZykgKi9cbiAgICAgIGJvdW5jaW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGxvY2tpbmcgdG8gdGhlIG1haW4gYXhpcyBpZiB1c2VyIG1vdmVzIG9ubHkgc2xpZ2h0bHkgb24gb25lIG9mIHRoZW0gYXQgc3RhcnQgKi9cbiAgICAgIGxvY2tpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgcGFnaW5hdGlvbiBtb2RlIChzd2l0Y2hpbmcgYmV0d2VlbiBmdWxsIHBhZ2UgY29udGVudCBwYW5lcykgKi9cbiAgICAgIHBhZ2luZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgc25hcHBpbmcgb2YgY29udGVudCB0byBhIGNvbmZpZ3VyZWQgcGl4ZWwgZ3JpZCAqL1xuICAgICAgc25hcHBpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHpvb21pbmcgb2YgY29udGVudCB2aWEgQVBJLCBmaW5nZXJzIGFuZCBtb3VzZSB3aGVlbCAqL1xuICAgICAgem9vbWluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBNaW5pbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1pblpvb206IDAuNSxcblxuICAgICAgLyoqIE1heGltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWF4Wm9vbTogMyxcblxuICAgICAgLyoqIE11bHRpcGx5IG9yIGRlY3JlYXNlIHNjcm9sbGluZyBzcGVlZCAqKi9cbiAgICAgIHNwZWVkTXVsdGlwbGllcjogMSxcblxuICAgICAgLyoqIENhbGxiYWNrIHRoYXQgaXMgZmlyZWQgb24gdGhlIGxhdGVyIG9mIHRvdWNoIGVuZCBvciBkZWNlbGVyYXRpb24gZW5kLFxuICAgICAgICAgIHByb3ZpZGVkIHRoYXQgYW5vdGhlciBzY3JvbGxpbmcgYWN0aW9uIGhhcyBub3QgYmVndW4uIFVzZWQgdG8ga25vd1xuICAgICAgICAgIHdoZW4gdG8gZmFkZSBvdXQgYSBzY3JvbGxiYXIuICovXG4gICAgICBzY3JvbGxpbmdDb21wbGV0ZTogTk9PUCxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25EZWNlbGVyYXRpb246IDAuMDMsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBhY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uOiAwLjA4XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICBJTlRFUk5BTCBGSUVMRFMgOjogU1RBVFVTXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBvbmx5IGEgc2luZ2xlIGZpbmdlciBpcyB1c2VkIGluIHRvdWNoIGhhbmRsaW5nICovXG4gIF9faXNTaW5nbGVUb3VjaCA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIHRvdWNoIGV2ZW50IHNlcXVlbmNlIGlzIGluIHByb2dyZXNzICovXG4gIF9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24gd2VudCB0byBjb21wbGV0aW9uLiAqL1xuICBfX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIGEgZ2VzdHVyZSB6b29tL3JvdGF0ZSBldmVudCBpcyBpbiBwcm9ncmVzcy4gQWN0aXZhdGVzIHdoZW5cbiAgICogYSBnZXN0dXJlc3RhcnQgZXZlbnQgaGFwcGVucy4gVGhpcyBoYXMgaGlnaGVyIHByaW9yaXR5IHRoYW4gZHJhZ2dpbmcuXG4gICAqL1xuICBfX2lzR2VzdHVyaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIHRoZSB1c2VyIGhhcyBtb3ZlZCBieSBzdWNoIGEgZGlzdGFuY2UgdGhhdCB3ZSBoYXZlIGVuYWJsZWRcbiAgICogZHJhZ2dpbmcgbW9kZS4gSGludCA9IEl0J3Mgb25seSBlbmFibGVkIGFmdGVyIHNvbWUgcGl4ZWxzIG9mIG1vdmVtZW50IHQ7XG4gICAqIG5vdCBpbnRlcnJ1cHQgd2l0aCBjbGlja3MgZXRjLlxuICAgKi9cbiAgX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBOb3QgdG91Y2hpbmcgYW5kIGRyYWdnaW5nIGFueW1vcmUsIGFuZCBzbW9vdGhseSBhbmltYXRpbmcgdGhlXG4gICAqIHRvdWNoIHNlcXVlbmNlIHVzaW5nIGRlY2VsZXJhdGlvbi5cbiAgICovXG4gIF9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFNtb290aGx5IGFuaW1hdGluZyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgY2hhbmdlXG4gICAqL1xuICBfX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IERJTUVOU0lPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGxlZnQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHJpZ2h0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50VG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHdpZHRoICovXG4gIF9fY2xpZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgaGVpZ2h0ICovXG4gIF9fY2xpZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIHdpZHRoICovXG4gIF9fY29udGVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIGhlaWdodCAqL1xuICBfX2NvbnRlbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGggZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwV2lkdGggPSAxMDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHQgZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwSGVpZ2h0ID0gMTAwO1xuXG4gIC8qKiB7TnVtYmVyfSBab29tIGxldmVsICovXG4gIF9fem9vbUxldmVsID0gMTtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX3Njcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fc2Nyb2xsVG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fbWF4U2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX21heFNjcm9sbFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIGxlZnQgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZExlZnQgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB0b3AgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHpvb20gbGV2ZWwgKGZpbmFsIHNjYWxlIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFpvb20gPSAwO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBMQVNUIFBPU0lUSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7TnVtYmVyfSBMZWZ0IHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaExlZnQgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBUb3AgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoVG9wID0gbnVsbDtcblxuICAvKioge0RhdGV9IFRpbWVzdGFtcCBvZiBsYXN0IG1vdmUgb2YgZmluZ2VyLiBVc2VkIHRvIGxpbWl0IHRyYWNraW5nIHJhbmdlIGZvciBkZWNlbGVyYXRpb24gc3BlZWQuICovXG4gIF9fbGFzdFRvdWNoTW92ZSA9IG51bGw7XG5cbiAgLyoqIHtBcnJheX0gTGlzdCBvZiBwb3NpdGlvbnMsIHVzZXMgdGhyZWUgaW5kZXhlcyBmb3IgZWFjaCBzdGF0ZSA9IGxlZnQsIHRvcCwgdGltZXN0YW1wICo7XG4gIF9fcG9zaXRpb25zID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOiA9IERFQ0VMRVJBVElPTiBTVVBQT1I7XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBVQkxJQyBBUElcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgY2xpZW50IChvdXRlcikgYW5kIGNvbnRlbnQgKGlubmVyKSBlbGVtZW50cy5cbiAgICogUmVxdWlyZXMgdGhlIGF2YWlsYWJsZSBzcGFjZSBmb3IgdGhlIG91dGVyIGVsZW1lbnQgYW5kIHRoZSBvdXRlciBzaXplIG9mIHRoZSBpbm5lciBlbGVtZW50LlxuICAgKiBBbGwgdmFsdWVzIHdoaWNoIGFyZSBmYWxzeSAobnVsbCBvciB6ZXJvIGV0Yy4pIGFyZSBpZ25vcmVkIGFuZCB0aGUgb2xkIHZhbHVlIGlzIGtlcHQuXG4gICAqXG4gICAqIEBwYXJhbSBjbGllbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IElubmVyIHdpZHRoIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNsaWVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IElubmVyIGhlaWdodCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBPdXRlciB3aWR0aCBvZiBpbm5lciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgaGVpZ2h0IG9mIGlubmVyIGVsZW1lbnRcbiAgICovXG4gIHNldERpbWVuc2lvbnMoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0KSB7XG4gICAgLy8gT25seSB1cGRhdGUgdmFsdWVzIHdoaWNoIGFyZSBkZWZpbmVkXG4gICAgaWYgKGNsaWVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50V2lkdGggPSBjbGllbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY2xpZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50SGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChjb250ZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50V2lkdGggPSBjb250ZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50SGVpZ2h0ID0gY29udGVudEhlaWdodDtcbiAgICB9XG5cbiAgICAvLyBSZWZyZXNoIG1heGltdW1zXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcblxuICAgIC8vIFJlZnJlc2ggc2Nyb2xsIHBvc2l0aW9uXG4gICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgZmFsc2UpO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqL1xuICBzZXRQb3NpdGlvbihsZWZ0LCB0b3ApIHtcbiAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICB0aGlzLl9fY2xpZW50VG9wID0gdG9wIHx8IDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAqXG4gICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAqL1xuICBzZXRTbmFwU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fX3NuYXBXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAqL1xuICBnZXRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fc2Nyb2xsVG9wLFxuICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoIC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIGJvdHRvbTogdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19jbGllbnRIZWlnaHQgLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFBvaW50KHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgIHRvcDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICovXG4gIGdldFNjcm9sbE1heCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAqXG4gICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbVRvKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjYWxsYmFjayBpZiBleGlzdHNcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICBpZiAoZml4ZWRMZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkVG9wID0gdGhpcy5fX2NsaWVudEhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBzY3JvbGwgcG9zaXRpb25zIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsLlxuICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAvLyAqIEZpeGVkIHBvaW50LCAkRiQsIHJlbWFpbnMgc3RhdGlvbmFyeSBpbiBjb250ZW50IHNwYWNlIGFuZCBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydC5cbiAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEZpbmFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfZiQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAvL1xuICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pL2tfZiA9IChTX2YgLSBGKSQuXG4gICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAvL1xuICAgIC8vIEZpeGVkIHBvaW50IGxvY2F0aW9uLCAkXFx2ZWN0b3J7Zn0gPSAoRiAtIFNfaSkga19pJC5cbiAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgLSBcXHZlY3RvcntmfS9rX2YkLlxuICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgdmFyIGsgPSBsZXZlbCAvIG9sZExldmVsO1xuICAgIHZhciBsZWZ0ID0gayAqICh0aGlzLl9fc2Nyb2xsTGVmdCArIGZpeGVkTGVmdCkgLSBmaXhlZExlZnQ7XG4gICAgdmFyIHRvcCA9IGsgKiAodGhpcy5fX3Njcm9sbFRvcCArIGZpeGVkVG9wKSAtIGZpeGVkVG9wO1xuXG4gICAgLy8gTGltaXQgeC1heGlzXG4gICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgIGxlZnQgPSAwO1xuICAgIH1cblxuICAgIC8vIExpbWl0IHktYXhpc1xuICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIGxldmVsLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbUJ5KGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICovXG4gIHNjcm9sbFRvKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgfVxuXG4gICAgICBsZWZ0ICo9IHpvb207XG4gICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19zbmFwSGVpZ2h0KSAqIHRoaXMuX19zbmFwSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgIHRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxUb3AsIHRvcCksIDApO1xuXG4gICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgaWYgKGxlZnQgPT09IHRoaXMuX19zY3JvbGxMZWZ0ICYmIHRvcCA9PT0gdGhpcy5fX3Njcm9sbFRvcCkge1xuICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICovXG4gIHNjcm9sbEJ5KGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIHZhciBzdGFydFRvcCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRUb3AgOiB0aGlzLl9fc2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBFVkVOVCBDQUxMQkFDS1NcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogTW91c2Ugd2hlZWwgaGFuZGxlciBmb3Igem9vbWluZyBzdXBwb3J0XG4gICAqL1xuICBkb01vdXNlWm9vbSh3aGVlbERlbHRhLCB0aW1lU3RhbXAsIHBhZ2VYLCBwYWdlWSkge1xuICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hTdGFydCh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaW50ZXJydXB0ZWRBbmltYXRpb24gZmxhZ1xuICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG4gICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHRvdWNoIHBvc2l0aW9uc1xuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBtb3ZlIHRpbWUgc3RhbXBcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gMTtcblxuICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1k7XG5cbiAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgLy8gUmVzZXQgZGVjZWxlcmF0aW9uIGNvbXBsZXRlIGZsYWdcbiAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgIHRoaXMuX19pc0RyYWdnaW5nID0gIWlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBDbGVhcmluZyBkYXRhIHN0cnVjdHVyZVxuICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIG1vdmUgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFsxLjBdIHNjYWxlIC0gLi4uLlxuICAgKi9cbiAgZG9Ub3VjaE1vdmUodG91Y2hlcywgdGltZVN0YW1wLCBzY2FsZSkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuXG4gICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAvLyBBcmUgd2UgYWxyZWFkeSBpcyBkcmFnZ2luZyBtb2RlP1xuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGRpc3RhbmNlXG4gICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAvLyBSZWFkIHByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZ1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIGxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdFJlbCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fY2xpZW50TGVmdDtcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICBzY3JvbGxMZWZ0ID0gKChjdXJyZW50VG91Y2hMZWZ0UmVsICsgc2Nyb2xsTGVmdCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaExlZnRSZWw7XG4gICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmVZKVxuICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcblxuICAgICAgICBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wIHx8IHNjcm9sbFRvcCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGxpc3QgZnJvbSBncm93aW5nIGluZmluaXRlbHkgKGhvbGRpbmcgbWluIDEwLCBtYXggMjAgbWVhc3VyZSBwb2ludHMpXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFjayBzY3JvbGwgbW92ZW1lbnQgZm9yIGRlY2xlcmF0aW9uXG4gICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIGxldmVsKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMoY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0KTtcbiAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSAmJiBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoRW5kKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgLy8gQmUgc3VyZSB0byByZXNldCB0aGUgZHJhZ2dpbmcgZmxhZyBub3cuIEhlcmUgd2UgYWxzbyBkZXRlY3Qgd2hldGhlclxuICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICBpZiAodGhpcy5fX2lzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZyAmJiAodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpIDw9IDEwMCkge1xuICAgICAgICAvLyBUaGVuIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHdhcyBhYm91dCAxMDBtcyBhZ29cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG4gICAgICAgIHZhciBlbmRQb3MgPSBwb3NpdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICAgIC8vIE1vdmUgcG9pbnRlciB0byBwb3NpdGlvbiBtZWFzdXJlZCAxMDBtcyBhZ29cbiAgICAgICAgZm9yICh2YXIgaSA9IGVuZFBvczsgaSA+IDAgJiYgcG9zaXRpb25zW2ldID4gKHRoaXMuX19sYXN0VG91Y2hNb3ZlIC0gMTAwKTsgaSAtPSAzKSB7XG4gICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gcG9zaXRpb25zW2VuZFBvc10gLSBwb3NpdGlvbnNbc3RhcnRQb3NdO1xuICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgIC8vIEJhc2VkIG9uIDUwbXMgY29tcHV0ZSB0aGUgbW92ZW1lbnQgdG8gYXBwbHkgZm9yIGVhY2ggcmVuZGVyIHN0ZXBcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIHN0YXJ0IHRoZSBkZWNlbGVyYXRpb25cbiAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPiAxMDApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAvLyBUaGlzIGlzIHBsYWNlZCBvdXRzaWRlIHRoZSBjb25kaXRpb24gYWJvdmUgdG8gaW1wcm92ZSBlZGdlIGNhc2Ugc3RhYmlsaXR5XG4gICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgIGlmICghdGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfVxuXG4gICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgdGhpcy5fX3Bvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQUklWQVRFIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgKi9cbiAgX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAvLyBiYXNlZCBvbiB0aGUgY3VycmVudCBcImRyaXZlXCIgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgIHZhciBvbGRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgdmFyIGRpZmZMZWZ0ID0gbGVmdCAtIG9sZExlZnQ7XG4gICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21MZXZlbCA9IG9sZFpvb20gKyAoZGlmZlpvb20gKiBwZXJjZW50KTtcblxuICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pc0FuaW1hdGluZyA9PT0gaWQ7XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sobGVmdCwgdG9wLCB6b29tKTtcbiAgICAgIH1cblxuICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgKi9cbiAgX19jb21wdXRlU2Nyb2xsTWF4KHpvb21MZXZlbCkge1xuICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICB0aGlzLl9fbWF4U2Nyb2xsTGVmdCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50V2lkdGggKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgIHRoaXMuX19tYXhTY3JvbGxUb3AgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudEhlaWdodCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICovXG4gIF9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX21heFNjcm9sbFRvcCksIDApO1xuICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgIC8vIFdlIGxpbWl0IGRlY2VsZXJhdGlvbiBub3QgdG8gdGhlIG1pbi9tYXggdmFsdWVzIG9mIHRoZSBhbGxvd2VkIHJhbmdlLCBidXQgdG8gdGhlIHNpemUgb2YgdGhlIHZpc2libGUgY2xpZW50IGFyZWEuXG4gICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguZmxvb3Ioc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBjbGFzcyBtZXRob2RcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgdGhpcy5fX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcik7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICB2YXIgbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgPSB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMC4xO1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmltYXRlIHRvIGdyaWQgd2hlbiBzbmFwcGluZyBpcyBhY3RpdmUsIG90aGVyd2lzZSBqdXN0IGZpeCBvdXQtb2YtYm91bmRhcnkgcG9zaXRpb25zXG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgKi9cbiAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpIHtcblxuICAgIC8vXG4gICAgLy8gQ09NUFVURSBORVhUIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYO1xuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgLy9cbiAgICAvLyBIQVJEIExJTUlUIFNDUk9MTCBQT1NJVElPTiBGT1IgTk9OIEJPVU5DSU5HIE1PREVcbiAgICAvL1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgIGlmIChzY3JvbGxMZWZ0Rml4ZWQgIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnRGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgaWYgKHNjcm9sbFRvcEZpeGVkICE9PSBzY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wRml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSAwO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFNMT1cgRE9XTlxuICAgIC8vXG5cbiAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgLy8gdG8gc2xvdyBkb3duIHRoZSBwcm9jZXNzLiBUaGlzIHNob3VsZCBlbXVsYXRlIG5hdHVyYWwgYmVoYXZpb3Igd2hlcmVcbiAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAvL1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVYID0gMDtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICB2YXIgcGVuZXRyYXRpb25EZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgaWYgKHNjcm9sbExlZnQgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9wIDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfVxuXG4gICAgICAvLyBTbG93IGRvd24gdW50aWwgc2xvdyBlbm91Z2gsIHRoZW4gZmxpcCBiYWNrIHRvIHNuYXAgcG9zaXRpb25cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICs9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKz0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZW52IGZyb20gJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBCdXR0b24gfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQsIENhbGxiYWNrIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcbmNvbnN0IGltZ1Bvb2wgPSBuZXcgUG9vbCgnaW1nUG9vbCcpO1xuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sKCdiaXRNYXBQb29sJyk7XG5jb25zdCBkZWJ1Z0luZm8gPSBuZXcgRGVidWdJbmZvKCk7XG5cbmludGVyZmFjZSBJVmlld1BvcnQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElWaWV3UG9ydEJveCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIEV2ZW50SGFuZGxlckRhdGEge1xuICBoYXNFdmVudEJpbmQ6IGJvb2xlYW47XG4gIHRvdWNoTXNnOiB7XG4gICAgW2tleTogc3RyaW5nXTogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgfTtcbiAgaGFuZGxlcnM6IHtcbiAgICB0b3VjaFN0YXJ0OiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoTW92ZTogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaEVuZDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaENhbmNlbDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIElQbHVnaW48VD4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGluc3RhbGw6IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xuICB1bmluc3RhbGw/OiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiDpu5jorqTmmrTpnLIgTGF5b3V0IOeahOWunuS+i++8jOS9huWcqOafkOS6m+WcuuaZr+S4i++8jOWPr+iDvemcgOimgeWkmuS4qiBMYXlvdXQg5a6e5L6L77yM5Zug5q2kIExheW91dCDnsbvkuZ/mmrTpnLLlh7rljrtcbiAqIGNvbnN0IG15TGF5b3V0ID0gbmV3IExheW91dCh7XG4gKiAgIHN0eWxlOiB7XG4gKiAgICAgIHdpZHRoOiAwLFxuICogICAgICBoZWlnaHQ6IDAsXG4gKiAgIH0sXG4gKiAgbmFtZTogJ215TGF5b3V0TmFtZScsXG4gKiB9KTtcbiAqL1xuY2xhc3MgTGF5b3V0IGV4dGVuZHMgRWxlbWVudCB7XG4gIC8qKlxuICAgKiDlvZPliY0gTGF5b3V0IOeJiOacrO+8jOS4gOiIrOi3n+Wwj+a4uOaIj+aPkuS7tueJiOacrOWvuem9kFxuICAgKi9cbiAgcHVibGljIHZlcnNpb24gPSAnMS4wLjgnO1xuXG4gIGVudiA9IGVudjtcbiAgXG4gIC8qKlxuICAgKiBMYXlvdXQg5riy5p+T55qE55uu5qCH55S75biD5a+55bqU55qEIDJkIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZW5kZXJDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHJlbmRlcnBvcnQ6IElWaWV3UG9ydCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydDogSVZpZXdQb3J0Qm94ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gIH07XG5cbiAgLyoqXG4gICAqIOeUu+W4g+WwuuWvuOWSjOWunumZheiiq+a4suafk+WIsOWxj+W5leeahOeJqeeQhuWwuuWvuOavlFxuICAgKi9cbiAgcHVibGljIHZpZXdwb3J0U2NhbGUgPSAxO1xuICAvKipcbiAgICog55So5LqO5qCH6K+GdXBkYXRlVmlld1BvcnTmlrnms5XmmK/lkKbooqvosIPnlKjov4fkuobvvIzov5nlnKjlsI/muLjmiI/njq/looPpnZ7luLjph43opoFcbiAgICovXG4gIHB1YmxpYyBoYXNWaWV3UG9ydFNldCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDmnIDnu4jmuLLmn5PliLDlsY/luZXnmoTlt6bkuIrop5LniannkIblnZDmoIdcbiAgICovXG4gIHB1YmxpYyByZWFsTGF5b3V0Qm94OiB7XG4gICAgcmVhbFg6IG51bWJlcjtcbiAgICByZWFsWTogbnVtYmVyO1xuICB9ID0ge1xuICAgICAgcmVhbFg6IDAsXG4gICAgICByZWFsWTogMCxcbiAgICB9O1xuXG4gIHB1YmxpYyBiaXRNYXBGb250czogQml0TWFwRm9udFtdID0gW107XG4gIHB1YmxpYyBlbGVDb3VudCA9IDA7XG4gIHB1YmxpYyBzdGF0ZTogU1RBVEUgPSBTVEFURS5VTklOSVQ7XG5cbiAgLyoqXG4gICAqIOeUqOS6juWcqCB0aWNrZXIg55qE5b6q546v6YeM6Z2i5qCH6K+G5b2T5YmN5bin5piv5ZCm6ZyA6KaB6YeN57uYXG4gICAqIOmHjee7mOS4gOiIrOaYr+WbvueJh+WKoOi9veWujOaIkOOAgeaWh+Wtl+S/ruaUueetieWcuuaZr1xuICAgKi9cbiAgcHVibGljIGlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgcHVibGljIHRpY2tlcjogVGlja2VyID0gbmV3IFRpY2tlcigpO1xuICBwdWJsaWMgdGlja2VyRnVuYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZV9yZWZsb3cnLCAnJyk7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc05lZWRSZXBhaW50KSB7XG4gICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJEYXRhOiBFdmVudEhhbmRsZXJEYXRhO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgaGFzRXZlbnRCaW5kOiBmYWxzZSxcbiAgICAgIHRvdWNoTXNnOiB7fSxcbiAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgIHRvdWNoU3RhcnQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaHN0YXJ0JykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hNb3ZlOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2htb3ZlJykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hFbmQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGVuZCcpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoQ2FuY2VsOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hjYW5jZWwnKS5iaW5kKHRoaXMpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog5a+55LqO5LiN5Lya5b2x5ZON5biD5bGA55qE5pS55Yqo77yM5q+U5aaC5Zu+54mH5Y+q5piv5pS55Liq5Zyw5Z2A44CB5Yqg5Liq6IOM5pmv6Imy5LmL57G755qE5pS55Yqo77yM5Lya6Kem5Y+RIExheW91dCDnmoQgcmVwYWludCDmk43kvZxcbiAgICAgKiDop6blj5HnmoTmlrnlvI/mmK/nu5kgTGF5b3V0IOaKm+S4qiBgcmVwYWludGAg55qE5LqL5Lu277yM5Li65LqG5oCn6IO977yM5q+P5qyh5o6l5pS25YiwIHJlcGFpbnQg6K+35rGC5LiN5Lya5omn6KGM55yf5q2j55qE5riy5p+TXG4gICAgICog6ICM5piv5omn6KGM5LiA5Liq572u6ISP5pON5L2c77yMdGlja2VyIOavj+S4gOasoeaJp+ihjCB1cGRhdGUg5Lya5qOA5p+l6L+Z5Liq5qCH6K6w5L2N77yM6L+b6ICM5omn6KGM55yf5q2j55qE6YeN57uY5pON5L2cXG4gICAgICovXG4gICAgdGhpcy5vbigncmVwYWludCcsICgpID0+IHtcbiAgICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlsIYgVHdlZW4g5oyC6L295YiwIExheW91dO+8jOWvueS6jiBUd2VlbiDnmoTkvb/nlKjlrozlhajpgbXlvqogVHdlZW4uanMg55qE5paH5qGjXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvXG4gICAgICog5Y+q5LiN6L+H5b2TIFR3ZWVuIOaUueWKqOS6huiKgueCueS8muinpuWPkSByZXBhaW5044CBcmVmbG93IOeahOWxnuaAp+aXtu+8jExheW91dCDkvJrmiafooYznm7jlupTnmoTmk43kvZxcbiAgICAgKiDkuJrliqHkvqfkuI3nlKjmhJ/nn6XliLAgcmVwYWludCDlkowgcmVmbG93XG4gICAgICovXG4gICAgLy8gdGhpcy5UV0VFTiA9IFRXRUVOO1xuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSB2JHt0aGlzLnZlcnNpb259YCk7XG4gIH1cblxuICAvLyDkuI7ogIHniYjmnKzlhbzlrrlcbiAgZ2V0IGRlYnVnSW5mbygpIHtcbiAgICBsZXQgaW5mbyA9IGRlYnVnSW5mby5sb2coKTtcblxuICAgIGluZm8gKz0gYGVsZW1lbnRDb3VudDogJHt0aGlzLmVsZUNvdW50fVxcbmA7XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrDooqvnu5jliLZjYW52YXPnmoTnqpflj6Pkv6Hmga/vvIzmnKzmuLLmn5PlvJXmk47lubbkuI3lhbPlv4PmmK/lkKbkvJrlkozlhbbku5bmuLjmiI/lvJXmk47lhbHlkIzkvb/nlKhcbiAgICog6ICM5pys6Lqr5Y+I6ZyA6KaB5pSv5oyB5LqL5Lu25aSE55CG77yM5Zug5q2k77yM5aaC5p6c6KKr5riy5p+T5YaF5a655piv57uY5Yi25Yiw56a75bGPY2FudmFz77yM6ZyA6KaB5bCG5pyA57uI57uY5Yi25Zyo5bGP5bmV5LiKXG4gICAqIOeahOe7neWvueWwuuWvuOWSjOS9jee9ruS/oeaBr+abtOaWsOWIsOacrOa4suafk+W8leaTjuOAglxuICAgKiDlhbbkuK3vvIx3aWR0aOS4uueJqeeQhuWDj+e0oOWuveW6pu+8jGhlaWdodOS4uueJqeeQhuWDj+e0oOmrmOW6pu+8jHjkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKB45Z2Q5qCH77yMeeS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oFxuICAgKiB55Z2Q5qCHXG4gICAqL1xuICB1cGRhdGVWaWV3UG9ydChib3g6IElWaWV3UG9ydEJveCkge1xuICAgIHRoaXMudmlld3BvcnQud2lkdGggPSBib3gud2lkdGggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IGJveC5oZWlnaHQgfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnggPSBib3gueCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueSA9IGJveC55IHx8IDA7XG5cbiAgICB0aGlzLnJlYWxMYXlvdXRCb3ggPSB7XG4gICAgICByZWFsWDogdGhpcy52aWV3cG9ydC54LFxuICAgICAgcmVhbFk6IHRoaXMudmlld3BvcnQueSxcbiAgICB9O1xuXG4gICAgdGhpcy5oYXNWaWV3UG9ydFNldCA9IHRydWU7XG4gIH1cblxuICBpbml0KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBhdHRyVmFsdWVQcm9jZXNzb3I6IENhbGxiYWNrKSB7XG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0Jyk7XG4gICAgY29uc3QgcGFyc2VDb25maWcgPSB7XG4gICAgICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnJyxcbiAgICAgIGF0dHJOb2RlTmFtZTogJ2F0dHInLCAvLyBkZWZhdWx0IGlzICdmYWxzZSdcbiAgICAgIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgaWdub3JlTmFtZVNwYWNlOiB0cnVlLFxuICAgICAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIHBhcnNlTm9kZVZhbHVlOiBmYWxzZSxcbiAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICAgICAgdHJpbVZhbHVlczogdHJ1ZSxcbiAgICAgIHBhcnNlVHJ1ZU51bWJlck9ubHk6IGZhbHNlLFxuICAgICAgYWx3YXlzQ3JlYXRlVGV4dE5vZGU6IHRydWUsXG4gICAgfTtcblxuICAgIGlmIChhdHRyVmFsdWVQcm9jZXNzb3IgJiYgdHlwZW9mIGF0dHJWYWx1ZVByb2Nlc3NvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGFyc2VDb25maWcuYXR0clZhbHVlUHJvY2Vzc29yID0gYXR0clZhbHVlUHJvY2Vzc29yO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWxQYXJzZScpO1xuICAgIC8vIOWwhnhtbOWtl+espuS4suino+aekOaIkHhtbOiKgueCueagkVxuICAgIGNvbnN0IGpzb25PYmogPSBwYXJzZXIucGFyc2UodGVtcGxhdGUsIHBhcnNlQ29uZmlnLCB0cnVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyhqc29uT2JqKVxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sUGFyc2UnKTtcblxuICAgIGNvbnN0IHhtbFRyZWUgPSBqc29uT2JqLmNoaWxkcmVuWzBdO1xuXG4gICAgLy8gWE1M5qCR55Sf5oiQ5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0X3htbDJMYXlvdXQnKTtcbiAgICBjb25zdCBsYXlvdXRUcmVlID0gY3JlYXRlLmNhbGwodGhpcywgeG1sVHJlZSwgc3R5bGUpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sMkxheW91dCcpO1xuXG4gICAgdGhpcy5hZGQobGF5b3V0VHJlZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuSU5JVEVEO1xuXG4gICAgdGhpcy50aWNrZXIuYWRkKHRoaXMudGlja2VyRnVuYywgdHJ1ZSk7XG4gICAgdGhpcy50aWNrZXIuc3RhcnQoKTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXQnKTtcbiAgfVxuXG4gIHJlZmxvdyhpc0ZpcnN0ID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzRmlyc3QpIHtcbiAgICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X3JlZmxvdycpO1xuICAgIC8qKlxuICAgICAqIOiuoeeul+W4g+WxgOagkVxuICAgICAqIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGvXG4gICAgICogTGF5b3V05pys6Lqr5bm25LiN5L2c5Li65biD5bGA6K6h566X77yM5Y+q5piv5L2c5Li66IqC54K55qCR55qE5a655ZmoXG4gICAgICovXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdjb21wdXRlTGF5b3V0JywgdHJ1ZSk7XG4gICAgY29tcHV0ZUxheW91dCh0aGlzLmNoaWxkcmVuWzBdKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdjb21wdXRlTGF5b3V0Jyk7XG5cbiAgICBjb25zdCByb290RWxlID0gdGhpcy5jaGlsZHJlblswXTtcblxuICAgIGlmIChyb290RWxlLnN0eWxlLndpZHRoID09PSB1bmRlZmluZWQgfHwgcm9vdEVsZS5zdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIHNldCB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnR5IGZvciByb290IGVsZW1lbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LndpZHRoID0gcm9vdEVsZS5zdHlsZS53aWR0aDtcbiAgICAgIHRoaXMucmVuZGVycG9ydC5oZWlnaHQgPSByb290RWxlLnN0eWxlLmhlaWdodDtcbiAgICB9XG5cbiAgICAvLyDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dENoaWxkcmVuJywgdHJ1ZSk7XG4gICAgbGF5b3V0Q2hpbGRyZW4odGhpcyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Q2hpbGRyZW4nKTtcblxuICAgIHRoaXMudmlld3BvcnRTY2FsZSA9IHRoaXMudmlld3BvcnQud2lkdGggLyB0aGlzLnJlbmRlcnBvcnQud2lkdGg7XG5cbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIC8vIOmBjeWOhuiKgueCueagke+8jOS+neasoeiwg+eUqOiKgueCueeahOa4suafk+aOpeWPo+WunueOsOa4suafk1xuICAgIGRlYnVnSW5mby5zdGFydCgncmVuZGVyQ2hpbGRyZW4nLCB0cnVlKTtcbiAgICByZW5kZXJDaGlsZHJlbih0aGlzLmNoaWxkcmVuLCB0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBmYWxzZSk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVuZGVyQ2hpbGRyZW4nKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgncmVwYWludCcsIHRydWUpO1xuICAgIHRoaXMucmVwYWludCgpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlcGFpbnQnKTtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcblxuICAgIC8vIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIChlbGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVsZS5wcm9wcyk7XG4gICAgLy8gfSk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfcmVmbG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdOmYtuauteaguOW/g+S7heS7heaYr+agueaNrnhtbOWSjGNzc+WIm+W7uuS6huiKgueCueagkVxuICAgKiDopoHlrp7njrDnnJ/mraPnmoTmuLLmn5PvvIzpnIDopoHosIPnlKggbGF5b3V0IOWHveaVsO+8jOS5i+aJgOS7peWwhiBsYXlvdXQg5Y2V54us5oq96LGh5Li65LiA5Liq5Ye95pWw77yM5piv5Zug5Li6IGxheW91dCDlupTlvZPmmK/lj6/ku6Xph43lpI3osIPnlKjnmoRcbiAgICog5q+U5aaC5pS55Y+Y5LqG5LiA5Liq5YWD57Sg55qE5bC65a+477yM5a6e6ZmF5LiK6IqC54K55qCR5piv5rKh5Y+Y55qE77yM5LuF5LuF5piv6ZyA6KaB6YeN5paw6K6h566X5biD5bGA77yM54S25ZCO5riy5p+TXG4gICAqIOS4gOS4quWujOaVtOeahCBsYXlvdXQg5YiG5oiQ5LiL6Z2i55qE5Yeg5q2l77yaXG4gICAqIDEuIOaJp+ihjOeUu+W4g+a4heeQhu+8jOWboOS4uuW4g+WxgOWPmOWMlumhtemdoumcgOimgemHjee7mO+8jOi/memHjOayoeacieWBmuW+iOmrmOe6p+eahOWJlOmZpOetieaTjeS9nO+8jOS4gOW+i+a4hemZpOmHjeeUu++8jOWunumZheS4iuaAp+iDveW3sue7j+W+iOWlvVxuICAgKiAyLiDoioLngrnmoJHpg73lkKvmnIkgc3R5bGUg5bGe5oCn77yMY3NzLWxheW91dCDog73lpJ/moLnmja7ov5nkupvkv6Hmga/orqHnrpflh7rmnIDnu4jluIPlsYDvvIzor6bmg4Xlj6/op4EgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvY3NzLWxheW91dFxuICAgKiAzLiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr++8jOS9hui/meS6m+S/oeaBr+W5tuS4jeaYr+iDveWkn+ebtOaOpeeUqOeahFxuICAgKiAgICDmr5TlpoIgbGF5b3V0LnRvcCDmmK/mjIflnKjkuIDkuKrniLblrrnlmajlhoXnmoQgdG9w77yM5pyA57uI6KaB5a6e546w5riy5p+T77yM5a6e6ZmF5LiK6KaB6YCS5b2S5Yqg5LiK5aSN5a655Zmo55qEIHRvcFxuICAgKiAgICDov5nmoLfmr4/mrKEgcmVwYWludCDnmoTml7blgJnlj6rpnIDopoHnm7TmjqXkvb/nlKjorqHnrpflpb3nmoTlgLzljbPlj6/vvIzkuI3pnIDopoHmr4/mrKHpg73pgJLlvZLorqHnrpdcbiAgICogICAg6L+Z5LiA5q2l56ew5Li6IGxheW91dENoaWxkcmVu77yM55uu55qE5Zyo5LqO5bCGIGNzcy1sYXlvdXQg6L+b5LiA5q2l5aSE55CG5Li65Y+v5Lul5riy5p+T55u05o6l55So55qE5biD5bGA5L+h5oGvXG4gICAqIDQuIHJlbmRlckNoaWxkcmVu77ya5omn6KGM5riy5p+TXG4gICAqIDUuIGJpbmRFdmVudHPvvJrmiafooYzkuovku7bnu5HlrppcbiAgICovXG4gIC8vIEB0cy1pZ25vcmVcbiAgbGF5b3V0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMucmVuZGVyQ29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAoIXRoaXMuaGFzVmlld1BvcnRTZXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBpbnZva2UgbWV0aG9kIGB1cGRhdGVWaWV3UG9ydGAgYmVmb3JlIG1ldGhvZCBgbGF5b3V0YCcpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Jyk7XG5cbiAgICB0aGlzLnJlZmxvdyh0cnVlKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X290aGVyJyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcsIHRydWUpO1xuICAgIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIGVsZW1lbnQgPT4gZWxlbWVudC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5SRU5ERVJFRDtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dCcpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vdGhlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOiKgueCueaVsOeahOmHjee7mOWItu+8jOS4gOiIrOS4muWKoeS+p+aXoOmcgOiwg+eUqOivpeaWueazlVxuICAgKi9cbiAgcmVwYWludCgpIHtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICAgIHJlcGFpbnRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDov5Tlm57kuIDkuKroioLngrnlnKjlsY/luZXkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga/vvIzliY3mj5DmmK/mraPnoa7osIPnlKh1cGRhdGVWaWV3UG9ydOOAglxuICAgKi9cbiAgZ2V0RWxlbWVudFZpZXdwb3J0UmVjdChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgeyByZWFsTGF5b3V0Qm94LCB2aWV3cG9ydFNjYWxlIH0gPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIGFic29sdXRlWCxcbiAgICAgIGFic29sdXRlWSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgIH0gPSBlbGVtZW50LmxheW91dEJveDtcblxuICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWTtcbiAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHZpZXdwb3J0U2NhbGU7XG4gICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHZpZXdwb3J0U2NhbGU7XG5cbiAgICByZXR1cm4gbmV3IFJlY3QoXG4gICAgICByZWFsWCxcbiAgICAgIHJlYWxZLFxuICAgICAgcmVhbFdpZHRoLFxuICAgICAgcmVhbEhlaWdodCxcbiAgICApO1xuICB9XG5cbiAgZ2V0Q2hpbGRCeVBvcyh0cmVlOiBMYXlvdXQgfCBFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgaXRlbUxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYWJzb2x1dGVYLFxuICAgICAgICBhYnNvbHV0ZVksXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICB9ID0gZWxlLmxheW91dEJveDtcbiAgICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHRoaXMudmlld3BvcnRTY2FsZTtcbiAgICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG5cbiAgICAgIGlmICgocmVhbFggPD0geCAmJiB4IDw9IHJlYWxYICsgcmVhbFdpZHRoKSAmJiAocmVhbFkgPD0geSAmJiB5IDw9IHJlYWxZICsgcmVhbEhlaWdodCkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOebuOWFs2lzc3Vl77yaaHR0cHM6Ly9naXRodWIuY29tL3dlY2hhdC1taW5pcHJvZ3JhbS9taW5pZ2FtZS1jYW52YXMtZW5naW5lL2lzc3Vlcy8xN1xuICAgICAgICAgKiDov5nph4zlj6ropoHmu6HotrPmnaHku7bnmoTpg73opoHorrDlvZXvvIzlkKbliJnlj6/og73lh7rnjrAgaXNzdWUg6YeM6Z2i5o+Q5Yiw55qE6Zeu6aKYXG4gICAgICAgICAqL1xuICAgICAgICBpdGVtTGlzdC5wdXNoKGVsZSk7XG4gICAgICAgIGlmIChlbGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKGVsZSwgeCwgeSwgaXRlbUxpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBldmVudEhhbmRsZXIgPSAoZXZlbnROYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4ge1xuICAgICAgbGV0IHRvdWNoOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuXG4gICAgICBpZiAoaXNHYW1lVG91Y2hFdmVudChlKSkge1xuICAgICAgICB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdWNoID0gZTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnN0IHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pIHx8IGU7XG4gICAgICBpZiAoIXRvdWNoIHx8ICF0b3VjaC5wYWdlWCB8fCAhdG91Y2gucGFnZVkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRvdWNoLnRpbWVTdGFtcCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRvdWNoLnRpbWVTdGFtcCA9IGUudGltZVN0YW1wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSA9IFtdO1xuICAgICAgaWYgKHRvdWNoKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyh0aGlzLCB0b3VjaC5wYWdlWCwgdG91Y2gucGFnZVksIGxpc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KGV2ZW50TmFtZSwgZSk7XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaHN0YXJ0JyB8fCBldmVudE5hbWUgPT09ICd0b3VjaGVuZCcpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnW2V2ZW50TmFtZV0gPSB0b3VjaDtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJyAmJiBpc0NsaWNrKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZykpIHtcbiAgICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoJ2NsaWNrJywgZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzlhajlsYDnmoTkuovku7bnu5HlrprpgLvovpEgXG4gICAqL1xuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgZW52Lm9uVG91Y2hNb3ZlKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmUpO1xuICAgIGVudi5vblRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlhajlsYDkuovku7bop6Pnu5EgXG4gICAqL1xuICB1bkJpbmRFdmVudHMoKSB7XG4gICAgZW52Lm9mZlRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgIGVudi5vZmZUb3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9mZlRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIEVFLmVtaXQoZXZlbnQsIGRhdGEpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZShldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9mZihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveUFsbCh0cmVlOiBMYXlvdXQgfCBFbGVtZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgfSA9IHRyZWU7XG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5kZXN0cm95QWxsKGNoaWxkKTtcbiAgICAgIGNoaWxkLmRlc3Ryb3lTZWxmICYmIGNoaWxkLmRlc3Ryb3lTZWxmKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5riF55CG55S75biD77yM5LmL5YmN55qE6K6h566X5Ye65p2l55qE5riy5p+T5qCR5Lmf5Lya5LiA5bm25riF55CG77yM5q2k5pe25Y+v5Lul5YaN5qyh5omn6KGMaW5pdOWSjGxheW91dOaWueazlea4suafk+eVjOmdouOAglxuICAgKi9cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW5uZXLnmoTlupTor6Xpu5jorqTpg73np7vpmaTvvIzlkKbliJnliY3lkI7kuKTmrKHliJ3lp4vljJbkvJrlr7zoh7TliY3lkI7nirbmgIHmnInpl67pophcbiAgICAgIHRoaXMudGlja2VyLnJlbW92ZUlubmVyKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJQb29sKCkge1xuICAgIGltZ1Bvb2wuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr5TotbcgTGF5b3V0LmNsZWFyIOabtOW9u+W6leeahOa4heeQhu+8jOS8mua4heepuuWbvueJh+WvueixoeaxoO+8jOWHj+WwkeWGheWtmOWNoOeUqOOAglxuICAgKi9cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlr7nkuo7lm77niYfotYTmupDvvIzlpoLmnpzkuI3mj5DliY3liqDovb3vvIzmuLLmn5Pov4fnqIvkuK3lj6/og73lh7rnjrDmjKjkuKrlh7rnjrDlm77niYfmlYjmnpzvvIzlvbHlk43kvZPpqoxcbiAgICog6YCa6L+HTGF5b3V0LmxvYWRJbWdz5Y+v5Lul6aKE5Yqg6L295Zu+54mH6LWE5rqQ77yM5Zyo6LCD55SoTGF5b3V0LmxheW91dOeahOaXtuWAmea4suafk+aAp+iDveabtOWlve+8jOS9k+mqjOabtOS9s+OAglxuICAgKi9cbiAgbG9hZEltZ3MoYXJyOiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDms6jlhowgYml0bWFwdGV4dCDlj6/nlKjnmoTlrZfkvZPjgIIgXG4gICAqL1xuICByZWdpc3RCaXRNYXBGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgaWYgKCFiaXRNYXBQb29sLmdldChuYW1lKSkge1xuICAgICAgY29uc3QgZm9udCA9IG5ldyBCaXRNYXBGb250KG5hbWUsIHNyYywgY29uZmlnKTtcbiAgICAgIHRoaXMuYml0TWFwRm9udHMucHVzaChmb250KTtcbiAgICAgIGJpdE1hcFBvb2wuc2V0KG5hbWUsIGZvbnQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWFi+mahuiKgueCue+8jOWFi+mahuWQjueahOiKgueCueWPr+S7pea3u+WKoOWIsCBMYXlvdXQg55qE5p+Q5Liq6IqC54K55LitXG4gICAqIOivpeaWueazleWPr+S7peWcqOaVsOaNruacieWPmOWMlueahOaXtuWAmemBv+WFjemHjeaWsOaJp+ihjCBMYXlvdXQuaW5pdCDmtYHnqIvjgIJcbiAgICovXG4gIGNsb25lTm9kZShlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSkge1xuICAgIHJldHVybiBjbG9uZTxMYXlvdXQ+KHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhue7hOS7tuaMguWIsExheW91dFxuICAgKi9cbiAgRWxlbWVudCA9IEVsZW1lbnQ7XG4gIFZpZXcgPSBWaWV3O1xuICBUZXh0ID0gVGV4dDtcbiAgSW1hZ2UgPSBJbWFnZTtcbiAgU2Nyb2xsVmlldyA9IFNjcm9sbFZpZXc7XG4gIEJpdE1hcFRleHQgPSBCaXRNYXBUZXh0O1xuICBDYW52YXMgPSBDYW52YXM7XG4gIEJ1dHRvbiA9IEJ1dHRvbjtcblxuICByZWdpc3RlckNvbXBvbmVudCA9IHJlZ2lzdGVyQ29tcG9uZW50O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbGxlZFBsdWdpbnM6IElQbHVnaW48TGF5b3V0PltdID0gW107XG4gIC8qKlxuICAgKiDlronoo4Xnu5nlrprnmoTmj5Lku7YgXG4gICAqL1xuICB1c2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgaWYgKExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0g6K+l5o+S5Lu25bey5a6J6KOFLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5a6J6KOFYClcbiAgfVxuXG4gIC8qKlxuICAgKiDljbjovb3nu5nlrprmj5Lku7YgXG4gICAqL1xuICB1blVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBjb25zdCBwbHVnaW5JbmRleCA9IExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluZGV4T2YocGx1Z2luKTtcblxuICAgIGlmIChwbHVnaW5JbmRleCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gVGhpcyBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnVuaW5zdGFsbCkge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWNuOi9vWApXG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuc3BsaWNlKHBsdWdpbkluZGV4LCAxKTtcbiAgfVxufVxuXG5jb25zdCBsYXlvdXQgPSBuZXcgTGF5b3V0KHtcbiAgc3R5bGU6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH0sXG4gIG5hbWU6ICdsYXlvdXQnLFxufSk7XG5cbmV4cG9ydCB7XG4gIGxheW91dCBhcyBkZWZhdWx0LFxuICBMYXlvdXQsXG4gIGVudixcbiAgRUUsXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
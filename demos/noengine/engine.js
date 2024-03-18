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
            style: __assign({ width: 300, height: 60, borderRadius: 10, backgroundColor: '#34a123', justifyContent: 'center', alignItems: 'center', transform: 'scale(1.2, 1.2)' }, style),
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
        // 绑定默认的事件处理程序
        _this.on('touchstart', _this.touchstartHandler);
        _this.on('touchend', _this.touchendHandler);
        console.log(_this.renderForLayout);
        return _this;
    }
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
    console.log('[Layout] trigger reflow cause', ele, reason);
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
                // if (eventName !== 'touchmove') {
                // console.log(this, eventName)
                // }
                _this.parent && _this.parent.emit(eventName, e, touchMsg);
            });
        });
        this.classNameList = this.className.split(/\s+/);
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
/* harmony export */   parseTransform: () => (/* binding */ parseTransform),
/* harmony export */   rotateParser: () => (/* binding */ rotateParser)
/* harmony export */ });
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}
// 旋转的正则表达式
var rotateReg = /rotate\((\d+)deg\)/;
// 背景图正则表达式
var isValidUrlPropReg = /\s*url\((.*?)\)\s*/;
function rotateParser(val) {
    var match = val.match(rotateReg);
    if (match) {
        return degreesToRadians(parseInt(match[1]));
    }
    console.error("[Layout]: ".concat(val, " is not a valid transform rotate"));
    return null;
}
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
    // const result = {
    // rotate: 0,
    // scaleX: 1,
    // scaleY: 1,
    // translateX: 0,
    // translateY: 0,
    // };
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
            // case 'translate':
            //   result.translateX = values[0];
            //   result.translateY = values[1] || 0;
            //   break;
            default:
                break;
        }
    }
    return result;
}
parseTransform('rotate(45)');
parseTransform('rotate(360deg)');
parseTransform('xxxx');
parseTransform('scale(3,4)');


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
            // console.log( this.value,
            //   drawX - originX,
            //   drawY - originY,)
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
                console.log('before_reflow');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGVtb3Mvbm9lbmdpbmUvZW5naW5lLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FB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QUM7Q0FBQSxDQTNoQm9CLDREQUFPLEdBMmhCM0I7QUFFRCxJQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUN4QixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sRUFBRSxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEVBQUUsUUFBUTtDQUNmLENBQUMsQ0FBQztBQU9GIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9idXR0b24udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvZWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2ltYWdlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbmRleC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsYmFyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGx2aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGVQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3RleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3ZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9lbnYudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9ub2RlMmpzb24uanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci91dGlsLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sTm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbHN0cjJ4bWxub2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9hbmltYXRlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQgZm9yIHJlZmVyZW5jZVxuLy9cbi8vIFRoaXMgZmlsZSB1c2VzIHRoZSBmb2xsb3dpbmcgc3BlY2lmaWMgVU1EIGltcGxlbWVudGF0aW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5jb21wdXRlTGF5b3V0ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbnZhciBjb21wdXRlTGF5b3V0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDU1NfVU5ERUZJTkVEO1xuXG4gIHZhciBDU1NfRElSRUNUSU9OX0lOSEVSSVQgPSAnaW5oZXJpdCc7XG4gIHZhciBDU1NfRElSRUNUSU9OX0xUUiA9ICdsdHInO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9SVEwgPSAncnRsJztcblxuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA9ICdyb3cnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFID0gJ3Jvdy1yZXZlcnNlJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gPSAnY29sdW1uJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSA9ICdjb2x1bW4tcmV2ZXJzZSc7XG5cbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfSlVTVElGWV9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4gPSAnc3BhY2UtYmV0d2Vlbic7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQgPSAnc3BhY2UtYXJvdW5kJztcblxuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfQUxJR05fQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfQUxJR05fRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0FMSUdOX1NUUkVUQ0ggPSAnc3RyZXRjaCc7XG5cbiAgdmFyIENTU19QT1NJVElPTl9SRUxBVElWRSA9ICdyZWxhdGl2ZSc7XG4gIHZhciBDU1NfUE9TSVRJT05fQUJTT0xVVEUgPSAnYWJzb2x1dGUnO1xuXG4gIHZhciBsZWFkaW5nID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIHRyYWlsaW5nID0ge1xuICAgICdyb3cnOiAncmlnaHQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdsZWZ0JyxcbiAgICAnY29sdW1uJzogJ2JvdHRvbScsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ3RvcCdcbiAgfTtcbiAgdmFyIHBvcyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciBkaW0gPSB7XG4gICAgJ3Jvdyc6ICd3aWR0aCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3dpZHRoJyxcbiAgICAnY29sdW1uJzogJ2hlaWdodCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2hlaWdodCdcbiAgfTtcblxuICAvLyBXaGVuIHRyYW5zcGlsZWQgdG8gSmF2YSAvIEMgdGhlIG5vZGUgdHlwZSBoYXMgbGF5b3V0LCBjaGlsZHJlbiBhbmQgc3R5bGVcbiAgLy8gcHJvcGVydGllcy4gRm9yIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZXNlIHByb3BlcnRpZXNcbiAgLy8gaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LlxuICBmdW5jdGlvbiBmaWxsTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5sYXlvdXQgfHwgbm9kZS5pc0RpcnR5KSB7XG4gICAgICBub2RlLmxheW91dCA9IHtcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygnZmlsbE5vZGVzJywgbm9kZS5sYXlvdXQsIG5vZGUuaXNEaXJ0eSwgbm9kZSlcblxuICAgIGlmICghbm9kZS5zdHlsZSkge1xuICAgICAgbm9kZS5zdHlsZSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtdO1xuICAgIH1cbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZmlsbE5vZGVzKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Jvd0RpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cgfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpblN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpblN0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5FbmQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdFbmQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdFbmQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ0VuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykgK1xuICAgICAgICBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRKdXN0aWZ5Q29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25Db250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduQ29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduSXRlbShub2RlLCBjaGlsZCkge1xuICAgIGlmIChjaGlsZC5zdHlsZS5hbGlnblNlbGYpIHtcbiAgICAgIHJldHVybiBjaGlsZC5zdHlsZS5hbGlnblNlbGY7XG4gICAgfVxuICAgIGlmIChub2RlLnN0eWxlLmFsaWduSXRlbXMpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduSXRlbXM7XG4gICAgfVxuICAgIHJldHVybiAnc3RyZXRjaCc7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlQXhpcyhheGlzLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX1JUTCkge1xuICAgICAgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgICAgIH0gZWxzZSBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBheGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIGlmIChub2RlLnN0eWxlLmRpcmVjdGlvbikge1xuICAgICAgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdGlvbiA9IENTU19ESVJFQ1RJT05fSU5IRVJJVDtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX0lOSEVSSVQpIHtcbiAgICAgIGRpcmVjdGlvbiA9IChwYXJlbnREaXJlY3Rpb24gPT09IHVuZGVmaW5lZCA/IENTU19ESVJFQ1RJT05fTFRSIDogcGFyZW50RGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RmxleERpcmVjdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24oZmxleERpcmVjdGlvbiwgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb25UeXBlKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wb3NpdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucG9zaXRpb247XG4gICAgfVxuICAgIHJldHVybiAncmVsYXRpdmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4KG5vZGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZ2V0UG9zaXRpb25UeXBlKG5vZGUpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgIG5vZGUuc3R5bGUuZmxleCA+IDBcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4V3JhcChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleFdyYXAgPT09ICd3cmFwJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERpbVdpdGhNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLmxheW91dFtkaW1bYXhpc11dICsgZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRGltRGVmaW5lZChub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGVbZGltW2F4aXNdXSA+PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQb3NEZWZpbmVkKG5vZGUsIHBvcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWVhc3VyZURlZmluZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLm1lYXN1cmUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uKG5vZGUsIHBvcykge1xuICAgIGlmIChub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBib3VuZEF4aXMobm9kZSwgYXhpcywgdmFsdWUpIHtcbiAgICB2YXIgbWluID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWluSGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5IZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIG1heCA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1heEhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4SGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBib3VuZFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkICYmIG1heCA+PSAwICYmIGJvdW5kVmFsdWUgPiBtYXgpIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtYXg7XG4gICAgfVxuICAgIGlmIChtaW4gIT09IHVuZGVmaW5lZCAmJiBtaW4gPj0gMCAmJiBib3VuZFZhbHVlIDwgbWluKSB7XG4gICAgICBib3VuZFZhbHVlID0gbWluO1xuICAgIH1cbiAgICByZXR1cm4gYm91bmRWYWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZtYXhmKGEsIGIpIHtcbiAgICBpZiAoYSA+IGIpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHVzZXIgc3BlY2lmaWNhbGx5IHNldHMgYSB2YWx1ZSBmb3Igd2lkdGggb3IgaGVpZ2h0XG4gIGZ1bmN0aW9uIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBheGlzKSB7XG4gICAgLy8gVGhlIHBhcmVudCBhbHJlYWR5IGNvbXB1dGVkIHVzIGEgd2lkdGggb3IgaGVpZ2h0LiBXZSBqdXN0IHNraXAgaXRcbiAgICBpZiAobm9kZS5sYXlvdXRbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFdlIG9ubHkgcnVuIGlmIHRoZXJlJ3MgYSB3aWR0aCBvciBoZWlnaHQgZGVmaW5lZFxuICAgIGlmICghaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGRpbWVuc2lvbnMgY2FuIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyXG4gICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgYm91bmRBeGlzKG5vZGUsIGF4aXMsIG5vZGUuc3R5bGVbZGltW2F4aXNdXSksXG4gICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBheGlzKSB7XG4gICAgY2hpbGQubGF5b3V0W3RyYWlsaW5nW2F4aXNdXSA9IG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtIGNoaWxkLmxheW91dFtwb3NbYXhpc11dO1xuICB9XG5cbiAgLy8gSWYgYm90aCBsZWZ0IGFuZCByaWdodCBhcmUgZGVmaW5lZCwgdGhlbiB1c2UgbGVmdC4gT3RoZXJ3aXNlIHJldHVyblxuICAvLyArbGVmdCBvciAtcmlnaHQgZGVwZW5kaW5nIG9uIHdoaWNoIGlzIGRlZmluZWQuXG4gIGZ1bmN0aW9uIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlW2xlYWRpbmdbYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBnZXRQb3NpdGlvbihub2RlLCBsZWFkaW5nW2F4aXNdKTtcbiAgICB9XG4gICAgcmV0dXJuIC1nZXRQb3NpdGlvbihub2RlLCB0cmFpbGluZ1theGlzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgLypjc3NfZGlyZWN0aW9uX3QqL3BhcmVudERpcmVjdGlvbikge1xuICAgIHZhci8qY3NzX2RpcmVjdGlvbl90Ki8gZGlyZWN0aW9uID0gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBtYWluQXhpcyA9IHJlc29sdmVBeGlzKGdldEZsZXhEaXJlY3Rpb24obm9kZSksIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGNyb3NzQXhpcyA9IGdldENyb3NzRmxleERpcmVjdGlvbihtYWluQXhpcywgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gcmVzb2x2ZWRSb3dBeGlzID0gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcblxuICAgIC8vIEhhbmRsZSB3aWR0aCBhbmQgaGVpZ2h0IHN0eWxlIGF0dHJpYnV0ZXNcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgbWFpbkF4aXMpO1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gU2V0IHRoZSByZXNvbHZlZCByZXNvbHV0aW9uIGluIHRoZSBub2RlJ3MgbGF5b3V0XG4gICAgbm9kZS5sYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgLy8gVGhlIHBvc2l0aW9uIGlzIHNldCBieSB0aGUgcGFyZW50LCBidXQgd2UgbmVlZCB0byBjb21wbGV0ZSBpdCB3aXRoIGFcbiAgICAvLyBkZWx0YSBjb21wb3NlZCBvZiB0aGUgbWFyZ2luIGFuZCBsZWZ0L3RvcC9yaWdodC9ib3R0b21cbiAgICBub2RlLmxheW91dFtsZWFkaW5nW21haW5BeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbbWFpbkF4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1tjcm9zc0F4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW2Nyb3NzQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gSW5saW5lIGltbXV0YWJsZSB2YWx1ZXMgZnJvbSB0aGUgdGFyZ2V0IG5vZGUgdG8gYXZvaWQgZXhjZXNzaXZlIG1ldGhvZFxuICAgIC8vIGludm9jYXRpb25zIGR1cmluZyB0aGUgbGF5b3V0IGNhbGN1bGF0aW9uLlxuICAgIHZhci8qaW50Ki8gY2hpbGRDb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93ID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcblxuICAgIGlmIChpc01lYXN1cmVEZWZpbmVkKG5vZGUpKSB7XG4gICAgICB2YXIvKmJvb2wqLyBpc1Jlc29sdmVkUm93RGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0pO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gd2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5zdHlsZS53aWR0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZXNvbHZlZFJvd0RpbURlZmluZWQpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG4gICAgICB9XG4gICAgICB3aWR0aCAtPSBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZ2l2ZSBhIGRpbWVuc2lvbiBmb3IgdGhlIHRleHQgaWYgd2UgaGF2ZW4ndCBnb3QgYW55XG4gICAgICAvLyBmb3IgaXQgY29tcHV0ZWQgeWV0LiBJdCBjYW4gZWl0aGVyIGJlIGZyb20gdGhlIHN0eWxlIGF0dHJpYnV0ZSBvciBiZWNhdXNlXG4gICAgICAvLyB0aGUgZWxlbWVudCBpcyBmbGV4aWJsZS5cbiAgICAgIHZhci8qYm9vbCovIGlzUm93VW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpICYmICFpc1Jlc29sdmVkUm93RGltRGVmaW5lZDtcbiAgICAgIHZhci8qYm9vbCovIGlzQ29sdW1uVW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKSAmJlxuICAgICAgICBpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl1dKTtcblxuICAgICAgLy8gTGV0J3Mgbm90IG1lYXN1cmUgdGhlIHRleHQgaWYgd2UgYWxyZWFkeSBrbm93IGJvdGggZGltZW5zaW9uc1xuICAgICAgaWYgKGlzUm93VW5kZWZpbmVkIHx8IGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgIHZhci8qY3NzX2RpbV90Ki8gbWVhc3VyZURpbSA9IG5vZGUuc3R5bGUubWVhc3VyZShcbiAgICAgICAgICAvKihjKSFub2RlLT5jb250ZXh0LCovXG4gICAgICAgICAgLyooamF2YSkhbGF5b3V0Q29udGV4dC5tZWFzdXJlT3V0cHV0LCovXG4gICAgICAgICAgd2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGlzUm93VW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBtZWFzdXJlRGltLndpZHRoICtcbiAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbWVhc3VyZURpbS5oZWlnaHQgK1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZENvdW50ID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBpc05vZGVGbGV4V3JhcCA9IGlzRmxleFdyYXAobm9kZSk7XG5cbiAgICB2YXIvKmNzc19qdXN0aWZ5X3QqLyBqdXN0aWZ5Q29udGVudCA9IGdldEp1c3RpZnlDb250ZW50KG5vZGUpO1xuXG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbiA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcyA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbiA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICB2YXIvKmJvb2wqLyBpc01haW5EaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc0Nyb3NzRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzTWFpblJvd0RpcmVjdGlvbiA9IGlzUm93RGlyZWN0aW9uKG1haW5BeGlzKTtcblxuICAgIHZhci8qaW50Ki8gaTtcbiAgICB2YXIvKmludCovIGlpO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjaGlsZDtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gYXhpcztcblxuICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IG51bGw7XG5cbiAgICB2YXIvKmZsb2F0Ki8gZGVmaW5lZE1haW5EaW0gPSBDU1NfVU5ERUZJTkVEO1xuICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBkZWZpbmVkTWFpbkRpbSA9IG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dIC0gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgbmV4dCB0d28gbG9vcHMgb25lIHBlciBsaW5lIHdpdGggZmxleC13cmFwXG4gICAgdmFyLyppbnQqLyBzdGFydExpbmUgPSAwO1xuICAgIHZhci8qaW50Ki8gZW5kTGluZSA9IDA7XG4gICAgLy8gdmFyLyppbnQqLyBuZXh0T2Zmc2V0ID0gMDtcbiAgICB2YXIvKmludCovIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgIC8vIFdlIGFnZ3JlZ2F0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGUgY29udGFpbmVyIGluIHRob3NlIHR3byB2YXJpYWJsZXNcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNDcm9zc0RpbSA9IDA7XG4gICAgdmFyLypmbG9hdCovIGxpbmVzTWFpbkRpbSA9IDA7XG4gICAgdmFyLyppbnQqLyBsaW5lc0NvdW50ID0gMDtcbiAgICB3aGlsZSAoZW5kTGluZSA8IGNoaWxkQ291bnQpIHtcbiAgICAgIC8vIDxMb29wIEE+IExheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4gYW5kIGNvdW50IGNoaWxkcmVuIGJ5IHR5cGVcblxuICAgICAgLy8gbWFpbkNvbnRlbnREaW0gaXMgYWNjdW11bGF0aW9uIG9mIHRoZSBkaW1lbnNpb25zIGFuZCBtYXJnaW4gb2YgYWxsIHRoZVxuICAgICAgLy8gbm9uIGZsZXhpYmxlIGNoaWxkcmVuLiBUaGlzIHdpbGwgYmUgdXNlZCBpbiBvcmRlciB0byBlaXRoZXIgc2V0IHRoZVxuICAgICAgLy8gZGltZW5zaW9ucyBvZiB0aGUgbm9kZSBpZiBub25lIGFscmVhZHkgZXhpc3QsIG9yIHRvIGNvbXB1dGUgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2UgbGVmdCBmb3IgdGhlIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgdmFyLypmbG9hdCovIG1haW5Db250ZW50RGltID0gMDtcblxuICAgICAgLy8gVGhlcmUgYXJlIHRocmVlIGtpbmQgb2YgY2hpbGRyZW4sIG5vbiBmbGV4aWJsZSwgZmxleGlibGUgYW5kIGFic29sdXRlLlxuICAgICAgLy8gV2UgbmVlZCB0byBrbm93IGhvdyBtYW55IHRoZXJlIGFyZSBpbiBvcmRlciB0byBkaXN0cmlidXRlIHRoZSBzcGFjZS5cbiAgICAgIHZhci8qaW50Ki8gZmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyB0b3RhbEZsZXhpYmxlID0gMDtcbiAgICAgIHZhci8qaW50Ki8gbm9uRmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcblxuICAgICAgLy8gVXNlIHRoZSBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIG1haW4gYXhpcyBmb3IgYXMgbG9uZ1xuICAgICAgLy8gYXMgdGhleSBhcmUgdXNpbmcgYSBzaW1wbGUgc3RhY2tpbmcgYmVoYXZpb3VyLiBDaGlsZHJlbiB0aGF0IGFyZVxuICAgICAgLy8gaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW5cbiAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja01haW4gPVxuICAgICAgICAgIChpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICghaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfQ0VOVEVSKTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4TWFpbiA9IChpc1NpbXBsZVN0YWNrTWFpbiA/IGNoaWxkQ291bnQgOiBzdGFydExpbmUpO1xuXG4gICAgICAvLyBVc2UgdGhlIGluaXRpYWwgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBjcm9zcyBheGlzIGZvclxuICAgICAgLy8gYXMgbG9uZyBhcyB0aGV5IGFyZSByZWxhdGl2ZWx5IHBvc2l0aW9uZWQgd2l0aCBhbGlnbm1lbnQgU1RSRVRDSCBvclxuICAgICAgLy8gRkxFWF9TVEFSVC4gQ2hpbGRyZW4gdGhhdCBhcmUgaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wXG4gICAgICAvLyB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluIGluIDxMb29wIEQ+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja0Nyb3NzID0gdHJ1ZTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4Q3Jvc3MgPSBjaGlsZENvdW50O1xuXG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkRpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbjtcbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbSA9IDA7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYXhXaWR0aDtcbiAgICAgIGZvciAoaSA9IHN0YXJ0TGluZTsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgIGNoaWxkLmxpbmVJbmRleCA9IGxpbmVzQ291bnQ7XG5cbiAgICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcblxuICAgICAgICAvLyBQcmUtZmlsbCBjcm9zcyBheGlzIGRpbWVuc2lvbnMgd2hlbiB0aGUgY2hpbGQgaXMgdXNpbmcgc3RyZXRjaCBiZWZvcmVcbiAgICAgICAgLy8gd2UgY2FsbCB0aGUgcmVjdXJzaXZlIGxheW91dCBwYXNzXG4gICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIICYmXG4gICAgICAgICAgICBnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgICAgICAgIGlzQ3Jvc3NEaW1EZWZpbmVkICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBjcm9zc0F4aXMpKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFKSB7XG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGFic29sdXRlbHkgcG9zaXRpb25lZCBjaGlsZHJlblxuICAgICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0QWJzb2x1dGVDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvciB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGhcbiAgICAgICAgICAvLyBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSksXG4gICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgYXhpcylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIvKmZsb2F0Ki8gbmV4dENvbnRlbnREaW0gPSAwO1xuXG4gICAgICAgIC8vIEl0IG9ubHkgbWFrZXMgc2Vuc2UgdG8gY29uc2lkZXIgYSBjaGlsZCBmbGV4aWJsZSBpZiB3ZSBoYXZlIGEgY29tcHV0ZWRcbiAgICAgICAgLy8gZGltZW5zaW9uIGZvciB0aGUgbm9kZS5cbiAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQgJiYgaXNGbGV4KGNoaWxkKSkge1xuICAgICAgICAgIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgIHRvdGFsRmxleGlibGUgKz0gY2hpbGQuc3R5bGUuZmxleDtcblxuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBmbGV4aWJsZSBjaGlsZHJlbiBzbyB0aGF0IHdlIGNhblxuICAgICAgICAgIC8vIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0RmxleENoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIEV2ZW4gaWYgd2UgZG9uJ3Qga25vdyBpdHMgZXhhY3Qgc2l6ZSB5ZXQsIHdlIGFscmVhZHkga25vdyB0aGUgcGFkZGluZyxcbiAgICAgICAgICAvLyBib3JkZXIgYW5kIG1hcmdpbi4gV2UnbGwgdXNlIHRoaXMgcGFydGlhbCBpbmZvcm1hdGlvbiwgd2hpY2ggcmVwcmVzZW50c1xuICAgICAgICAgIC8vIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBzaXplIGZvciB0aGUgY2hpbGQsIHRvIGNvbXB1dGUgdGhlIHJlbWFpbmluZ1xuICAgICAgICAgIC8vIGF2YWlsYWJsZSBzcGFjZS5cbiAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgbWFpbkF4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVGhpcyBpcyB0aGUgbWFpbiByZWN1cnNpdmUgY2FsbC4gV2UgbGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgICAgICBpZiAoYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9PT0gMCkge1xuICAgICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2NoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBYnNvbHV0ZSBwb3NpdGlvbmVkIGVsZW1lbnRzIGRvIG5vdCB0YWtlIHBhcnQgb2YgdGhlIGxheW91dCwgc28gd2VcbiAgICAgICAgICAvLyBkb24ndCB1c2UgdGhlbSB0byBjb21wdXRlIG1haW5Db250ZW50RGltXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgYW5kIG1hcmdpbiBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBlbGVtZW50IHdlIGFyZSBhYm91dCB0byBhZGQgd291bGQgbWFrZSB1cyBnbyB0byB0aGUgbmV4dCBsaW5lXG4gICAgICAgIGlmIChpc05vZGVGbGV4V3JhcCAmJlxuICAgICAgICAgICAgaXNNYWluRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgbWFpbkNvbnRlbnREaW0gKyBuZXh0Q29udGVudERpbSA+IGRlZmluZWRNYWluRGltICYmXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG9ubHkgb25lIGVsZW1lbnQsIHRoZW4gaXQncyBiaWdnZXIgdGhhbiB0aGUgY29udGVudFxuICAgICAgICAgICAgLy8gYW5kIG5lZWRzIGl0cyBvd24gbGluZVxuICAgICAgICAgICAgaSAhPT0gc3RhcnRMaW5lKSB7XG4gICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50LS07XG4gICAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgbWFpbiBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8IGlzRmxleChjaGlsZCkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja01haW4gPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhNYWluID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBjcm9zcyBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBEPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcyAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fFxuICAgICAgICAgICAgICAgIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9TVFJFVENIICYmIGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgICAgICAgaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja0Nyb3NzID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4Q3Jvc3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYWluRGltICs9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcykge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgICAgICBtYWluQ29udGVudERpbSArPSBuZXh0Q29udGVudERpbTtcbiAgICAgICAgZW5kTGluZSA9IGkgKyAxO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBCPiBMYXlvdXQgZmxleGlibGUgY2hpbGRyZW4gYW5kIGFsbG9jYXRlIGVtcHR5IHNwYWNlXG5cbiAgICAgIC8vIEluIG9yZGVyIHRvIHBvc2l0aW9uIHRoZSBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzLCB3ZSBoYXZlIHR3b1xuICAgICAgLy8gY29udHJvbHMuIFRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBiZWdpbm5pbmcgYW5kIHRoZSBmaXJzdCBlbGVtZW50XG4gICAgICAvLyBhbmQgdGhlIHNwYWNlIGJldHdlZW4gZWFjaCB0d28gZWxlbWVudHMuXG4gICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ01haW5EaW0gPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGJldHdlZW5NYWluRGltID0gMDtcblxuICAgICAgLy8gVGhlIHJlbWFpbmluZyBhdmFpbGFibGUgc3BhY2UgdGhhdCBuZWVkcyB0byBiZSBhbGxvY2F0ZWRcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdNYWluRGltID0gMDtcbiAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBkZWZpbmVkTWFpbkRpbSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKG1haW5Db250ZW50RGltLCAwKSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgZmxleGlibGUgY2hpbGRyZW4gaW4gdGhlIG1peCwgdGhleSBhcmUgZ29pbmcgdG8gZmlsbCB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZVxuICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCAhPT0gMCkge1xuICAgICAgICB2YXIvKmZsb2F0Ki8gZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG4gICAgICAgIHZhci8qZmxvYXQqLyBiYXNlTWFpbkRpbTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJvdW5kTWFpbkRpbTtcblxuICAgICAgICAvLyBJZiB0aGUgZmxleCBzaGFyZSBvZiByZW1haW5pbmcgc3BhY2UgZG9lc24ndCBtZWV0IG1pbi9tYXggYm91bmRzLFxuICAgICAgICAvLyByZW1vdmUgdGhpcyBjaGlsZCBmcm9tIGZsZXggY2FsY3VsYXRpb25zLlxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgYmFzZU1haW5EaW0gPSBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgYm91bmRNYWluRGltID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLCBiYXNlTWFpbkRpbSk7XG5cbiAgICAgICAgICBpZiAoYmFzZU1haW5EaW0gIT09IGJvdW5kTWFpbkRpbSkge1xuICAgICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSAtPSBib3VuZE1haW5EaW07XG4gICAgICAgICAgICB0b3RhbEZsZXhpYmxlIC09IGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuXG4gICAgICAgIC8vIFRoZSBub24gZmxleGlibGUgY2hpbGRyZW4gY2FuIG92ZXJmbG93IHRoZSBjb250YWluZXIsIGluIHRoaXMgY2FzZVxuICAgICAgICAvLyB3ZSBzaG91bGQganVzdCBhc3N1bWUgdGhhdCB0aGVyZSBpcyBubyBzcGFjZSBhdmFpbGFibGUuXG4gICAgICAgIGlmIChmbGV4aWJsZU1haW5EaW0gPCAwKSB7XG4gICAgICAgICAgZmxleGlibGVNYWluRGltID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgb2YgdGhlIGVsZW1lbnQgaW4gdGhlIG1haW5cbiAgICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyxcbiAgICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9IGVsc2UgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSByZWN1cnNpdmVseSBjYWxsIHRoZSBsYXlvdXQgYWxnb3JpdGhtIGZvciB0aGlzIGNoaWxkXG4gICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2N1cnJlbnRGbGV4Q2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgY2hpbGQgPSBjdXJyZW50RmxleENoaWxkO1xuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIGp1c3RpZnlDb250ZW50IHRvIGZpZ3VyZSBvdXQgaG93IHRvIGFsbG9jYXRlIHRoZSByZW1haW5pbmdcbiAgICAgIC8vIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkge1xuICAgICAgICBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0NFTlRFUikge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIDI7XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOKSB7XG4gICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKHJlbWFpbmluZ01haW5EaW0sIDApO1xuICAgICAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxICE9PSAwKSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0FST1VORCkge1xuICAgICAgICAgIC8vIFNwYWNlIG9uIHRoZSBlZGdlcyBpcyBoYWxmIG9mIHRoZSBzcGFjZSBiZXR3ZWVuIGVsZW1lbnRzXG4gICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQpO1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gYmV0d2Vlbk1haW5EaW0gLyAyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEM+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMgYW5kIGNvbXB1dGUgZGltZW5zaW9uc1xuXG4gICAgICAvLyBBdCB0aGlzIHBvaW50LCBhbGwgdGhlIGNoaWxkcmVuIGhhdmUgdGhlaXIgZGltZW5zaW9ucyBzZXQuIFdlIG5lZWQgdG9cbiAgICAgIC8vIGZpbmQgdGhlaXIgcG9zaXRpb24uIEluIG9yZGVyIHRvIGRvIHRoYXQsIHdlIGFjY3VtdWxhdGUgZGF0YSBpblxuICAgICAgLy8gdmFyaWFibGVzIHRoYXQgYXJlIGFsc28gdXNlZnVsIHRvIGNvbXB1dGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlXG4gICAgICAvLyBjb250YWluZXIhXG4gICAgICBtYWluRGltICs9IGxlYWRpbmdNYWluRGltO1xuXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhNYWluOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlIGFuZCBoYXMgbGVmdC90b3AgYmVpbmdcbiAgICAgICAgICAvLyBkZWZpbmVkLCB3ZSBvdmVycmlkZSB0aGUgcG9zaXRpb24gdG8gd2hhdGV2ZXIgdGhlIHVzZXIgc2FpZFxuICAgICAgICAgIC8vIChhbmQgbWFyZ2luL2JvcmRlcikuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlICh3aXRob3V0IHRvcC9sZWZ0KSBvciByZWxhdGl2ZSxcbiAgICAgICAgICAvLyB3ZSBwdXQgaXQgYXQgdGhlIGN1cnJlbnQgYWNjdW11bGF0ZWQgb2Zmc2V0LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE5vdyB0aGF0IHdlIHBsYWNlZCB0aGUgZWxlbWVudCwgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuICAgICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBkbyB0aGF0IGZvciByZWxhdGl2ZSBlbGVtZW50cy4gQWJzb2x1dGUgZWxlbWVudHNcbiAgICAgICAgICAvLyBkbyBub3QgdGFrZSBwYXJ0IGluIHRoYXQgcGhhc2UuXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLy8gVGhlIG1haW4gZGltZW5zaW9uIGlzIHRoZSBzdW0gb2YgYWxsIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gcGx1c1xuICAgICAgICAgICAgLy8gdGhlIHNwYWNpbmcuXG4gICAgICAgICAgICBtYWluRGltICs9IGJldHdlZW5NYWluRGltICsgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgICAgLy8gVGhlIGNyb3NzIGRpbWVuc2lvbiBpcyB0aGUgbWF4IG9mIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gc2luY2UgdGhlcmVcbiAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBlbGVtZW50IGluIHRoYXQgY3Jvc3MgZGltZW5zaW9uLlxuICAgICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLypmbG9hdCovIGNvbnRhaW5lckNyb3NzQXhpcyA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgY29udGFpbmVyQ3Jvc3NBeGlzID0gZm1heGYoXG4gICAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBjcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgRD4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleENyb3NzOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBhYnNvbHV0ZWx5IHBvc2l0aW9ubmVkIGFuZCBoYXMgYVxuICAgICAgICAgIC8vIHRvcC9sZWZ0L2JvdHRvbS9yaWdodCBiZWluZyBzZXQsIHdlIG92ZXJyaWRlIGFsbCB0aGUgcHJldmlvdXNseVxuICAgICAgICAgIC8vIGNvbXB1dGVkIHBvc2l0aW9ucyB0byBzZXQgaXQgY29ycmVjdGx5LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nQ3Jvc3NEaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICAgICAgLy8gRm9yIGEgcmVsYXRpdmUgY2hpbGRyZW4sIHdlJ3JlIGVpdGhlciB1c2luZyBhbGlnbkl0ZW1zIChwYXJlbnQpIG9yXG4gICAgICAgICAgLy8gYWxpZ25TZWxmIChjaGlsZCkgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHRoZSBwb3NpdGlvbiBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgIC8vIFRoaXMgdmFyaWFibGUgaXMgaW50ZW50aW9uYWxseSByZS1kZWZpbmVkIGFzIHRoZSBjb2RlIGlzIHRyYW5zcGlsZWQgdG8gYSBibG9jayBzY29wZSBsYW5ndWFnZVxuICAgICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICAgIC8vIFlvdSBjYW4gb25seSBzdHJldGNoIGlmIHRoZSBkaW1lbnNpb24gaGFzIG5vdCBhbHJlYWR5IGJlZW4gc2V0XG4gICAgICAgICAgICAgIC8vIHByZXZpb3VzbHkuXG4gICAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBzcGFjZSBiZXR3ZWVuIHRoZSBwYXJlbnQgZGltZW5zaW9ucytwYWRkaW5nIGFuZCBjaGlsZFxuICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zK21hcmdpbi5cbiAgICAgICAgICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0Nyb3NzRGltID0gY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltIC8gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gQ1NTX0FMSUdOX0ZMRVhfRU5EXG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIGFwcGx5IHRoZSBwb3NpdGlvblxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdDcm9zc0RpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaW5lc0Nyb3NzRGltICs9IGNyb3NzRGltO1xuICAgICAgbGluZXNNYWluRGltID0gZm1heGYobGluZXNNYWluRGltLCBtYWluRGltKTtcbiAgICAgIGxpbmVzQ291bnQgKz0gMTtcbiAgICAgIHN0YXJ0TGluZSA9IGVuZExpbmU7XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRT5cbiAgICAvL1xuICAgIC8vIE5vdGUocHJlbmF1eCk6IE1vcmUgdGhhbiBvbmUgbGluZSwgd2UgbmVlZCB0byBsYXlvdXQgdGhlIGNyb3NzQXhpc1xuICAgIC8vIGFjY29yZGluZyB0byBhbGlnbkNvbnRlbnQuXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgd2UgY291bGQgcHJvYmFibHkgcmVtb3ZlIDxMb29wIEQ+IGFuZCBoYW5kbGUgdGhlIG9uZSBsaW5lIGNhc2VcbiAgICAvLyBoZXJlIHRvbywgYnV0IGZvciB0aGUgbW9tZW50IHRoaXMgaXMgc2FmZXIgc2luY2UgaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGhcbiAgICAvLyBwcmV2aW91c2x5IHdvcmtpbmcgY29kZS5cbiAgICAvL1xuICAgIC8vIFNlZSBzcGVjczpcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDEyL0NSLWNzczMtZmxleGJveC0yMDEyMDkxOC8jbGF5b3V0LWFsZ29yaXRobVxuICAgIC8vIHNlY3Rpb24gOS40XG4gICAgLy9cbiAgICBpZiAobGluZXNDb3VudCA+IDEgJiYgaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIHZhci8qZmxvYXQqLyBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzO1xuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0FsaWduQ29udGVudERpbSA9IG5vZGVDcm9zc0F4aXNJbm5lclNpemUgLSBsaW5lc0Nyb3NzRGltO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW1MZWFkID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBjdXJyZW50TGVhZCA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnQgPSBnZXRBbGlnbkNvbnRlbnQobm9kZSk7XG4gICAgICBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICBpZiAobm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA+IGxpbmVzQ3Jvc3NEaW0pIHtcbiAgICAgICAgICBjcm9zc0RpbUxlYWQgPSAocmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gbGluZXNDb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLyppbnQqLyBlbmRJbmRleCA9IDA7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGluZXNDb3VudDsgKytpKSB7XG4gICAgICAgIHZhci8qaW50Ki8gc3RhcnRJbmRleCA9IGVuZEluZGV4O1xuXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIGxpbmUncyBoZWlnaHQgYW5kIGZpbmQgdGhlIGVuZEluZGV4XG4gICAgICAgIHZhci8qZmxvYXQqLyBsaW5lSGVpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgY2hpbGRDb3VudDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjaGlsZC5saW5lSW5kZXggIT09IGkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICBsaW5lSGVpZ2h0ID0gZm1heGYoXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gKyBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbmRJbmRleCA9IGlpO1xuICAgICAgICBsaW5lSGVpZ2h0ICs9IGNyb3NzRGltTGVhZDtcblxuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBlbmRJbmRleDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudEFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgbGluZUhlaWdodCAtIGdldFRyYWlsaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpIC0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgdmFyLypmbG9hdCovIGNoaWxkSGVpZ2h0ID0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIChsaW5lSGVpZ2h0IC0gY2hpbGRIZWlnaHQpIC8gMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgICAvLyBUT0RPKHByZW5hdXgpOiBDb3JyZWN0bHkgc2V0IHRoZSBoZWlnaHQgb2YgaXRlbXMgd2l0aCB1bmRlZmluZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChhdXRvKSBjcm9zc0F4aXMgZGltZW5zaW9uLlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRMZWFkICs9IGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gbmVlZHNNYWluVHJhaWxpbmdQb3MgPSBmYWxzZTtcbiAgICB2YXIvKmJvb2wqLyBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSBmYWxzZTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGRpZG4ndCBzcGVjaWZ5IGEgd2lkdGggb3IgaGVpZ2h0LCBhbmQgaXQgaGFzIG5vdCBiZWVuIHNldFxuICAgIC8vIGJ5IHRoZSBjb250YWluZXIsIHRoZW4gd2Ugc2V0IGl0IHZpYSB0aGUgY2hpbGRyZW4uXG4gICAgaWYgKCFpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBXZSdyZSBtaXNzaW5nIHRoZSBsYXN0IHBhZGRpbmcgYXQgdGhpcyBwb2ludCB0byBnZXQgdGhlIGZpbmFsXG4gICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICBib3VuZEF4aXMobm9kZSwgbWFpbkF4aXMsIGxpbmVzTWFpbkRpbSArIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcykpLFxuICAgICAgICAvLyBXZSBjYW4gbmV2ZXIgYXNzaWduIGEgd2lkdGggc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJzXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpblxuICAgICAgKTtcblxuICAgICAgaWYgKG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBsaW5lc0Nyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICk7XG5cbiAgICAgIGlmIChjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRj4gU2V0IHRyYWlsaW5nIHBvc2l0aW9uIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1BvcyB8fCBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRz4gQ2FsY3VsYXRlIGRpbWVuc2lvbnMgZm9yIGFic29sdXRlbHkgcG9zaXRpb25lZCBlbGVtZW50c1xuICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gZmlyc3RBYnNvbHV0ZUNoaWxkO1xuICAgIHdoaWxlIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yXG4gICAgICAvLyB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGggbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICFpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2xlYWRpbmdbYXhpc11dID1cbiAgICAgICAgICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZDtcbiAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICBub2RlLnNob3VsZFVwZGF0ZSA9IHRydWU7XG5cbiAgICB2YXIgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb24gfHwgQ1NTX0RJUkVDVElPTl9MVFI7XG4gICAgdmFyIHNraXBMYXlvdXQgPVxuICAgICAgIW5vZGUuaXNEaXJ0eSAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID09PSBub2RlLmxheW91dC5oZWlnaHQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9PT0gbm9kZS5sYXlvdXQud2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9PT0gcGFyZW50TWF4V2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPT09IGRpcmVjdGlvbjtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdza2lwTGF5b3V0Jywgc2tpcExheW91dCwgbm9kZSlcbiAgICBpZiAoc2tpcExheW91dCkge1xuICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBub2RlLmxhc3RMYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXlvdXQudG9wID0gbm9kZS5sYXN0TGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGF5b3V0LmxlZnQgPSBub2RlLmxhc3RMYXlvdXQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFub2RlLmxhc3RMYXlvdXQpIHtcbiAgICAgICAgbm9kZS5sYXN0TGF5b3V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgLy8gUmVzZXQgY2hpbGQgbGF5b3V0c1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLmxheW91dC53aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LnRvcCA9IDA7XG4gICAgICAgIGNoaWxkLmxheW91dC5sZWZ0ID0gMDtcbiAgICAgIH0pO1xuXG4gICAgICBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKTtcblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LndpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnRvcCA9IG5vZGUubGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGFzdExheW91dC5sZWZ0ID0gbm9kZS5sYXlvdXQubGVmdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxheW91dE5vZGVJbXBsOiBsYXlvdXROb2RlSW1wbCxcbiAgICBjb21wdXRlTGF5b3V0OiBsYXlvdXROb2RlLFxuICAgIGZpbGxOb2RlczogZmlsbE5vZGVzXG4gIH07XG59KSgpO1xuXG4vLyBUaGlzIG1vZHVsZSBleHBvcnQgaXMgb25seSB1c2VkIGZvciB0aGUgcHVycG9zZXMgb2YgdW5pdCB0ZXN0aW5nIHRoaXMgZmlsZS4gV2hlblxuLy8gdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQgdGhpcyBmaWxlIGlzIGluY2x1ZGVkIHdpdGhpbiBjc3MtbGF5b3V0LmpzIHdoaWNoIGZvcm1zXG4vLyB0aGUgcHVibGljIEFQSS5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlTGF5b3V0O1xufVxuXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgLy8gZGlzYWJsaW5nIEVTTGludCBiZWNhdXNlIHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGFib3ZlIGluY2x1ZGVcbiAgICBjb21wdXRlTGF5b3V0LmZpbGxOb2Rlcyhub2RlKTtcbiAgICBjb21wdXRlTGF5b3V0LmNvbXB1dGVMYXlvdXQobm9kZSk7XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH07XG59KSk7XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbm1vZHVsZS5leHBvcnRzLlRpbnlFbWl0dGVyID0gRTtcbiIsImltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9pbWFnZU1hbmFnZXInO1xuY29uc3QgRW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xuXG5pbnRlcmZhY2UgQ2hhckRhdGEge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdzogbnVtYmVyO1xuICBoOiBudW1iZXI7XG4gIG9mZlg6IG51bWJlcjtcbiAgb2ZmWTogbnVtYmVyO1xuICB4YWR2YW5jZTogbnVtYmVyO1xuICBrZXJuaW5nOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xufVxuXG5pbnRlcmZhY2UgQ2hhcnMge1xuICBba2V5OiBzdHJpbmddOiBDaGFyRGF0YTtcbn1cblxudHlwZSBDb25maWdMaW5lRGF0YSA9IHtcbiAgbGluZTogc3RyaW5nW107XG4gIGluZGV4OiBudW1iZXI7XG59O1xuXG5cbi8qKlxuICogaHR0cDovL3d3dy5hbmdlbGNvZGUuY29tL3Byb2R1Y3RzL2JtZm9udC9kb2MvZmlsZV9mb3JtYXQuaHRtbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBGb250IHtcbiAgcHJpdmF0ZSBjb25maWc6IHN0cmluZztcbiAgcHVibGljIGV2ZW50OiBhbnk7XG5cbiAgcHVibGljIGNoYXJzOiBDaGFycztcblxuICBwdWJsaWMgcmVhZHkgPSBmYWxzZTtcbiAgcHVibGljIHRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuICBwdWJsaWMgbGluZUhlaWdodD86IG51bWJlcjtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuXG5cbiAgLy8gcG9vbOeahOWunueOsOaUvuWIsOexu+mHjOmdouWunueOsOW5tuS4jeS8mOmbhe+8jOWFiOWOu+aOieS6hlxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY2hhcnMgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgdGhpcy5ldmVudCA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnRleHR1cmUgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHNyYywgKHRleHR1cmUsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmV2ZW50LmVtaXQoJ3RleHRfX2xvYWRfX2RvbmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ29uZmlnKGZudFRleHQ6IHN0cmluZykge1xuICAgIGZudFRleHQgPSBmbnRUZXh0LnNwbGl0KCdcXHJcXG4nKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBmbnRUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsaW5lc1BhcnNlZDogc3RyaW5nW11bXSA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUudHJpbSgpLnNwbGl0KCcgJykpO1xuXG4gICAgY29uc3QgY2hhcnNMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NoYXJzJyk7XG4gICAgY29uc3QgY2hhcnNDb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyc0xpbmUubGluZSwgJ2NvdW50Jyk7XG5cbiAgICBjb25zdCBjb21tb25MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NvbW1vbicpO1xuICAgIHRoaXMubGluZUhlaWdodCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29tbW9uTGluZS5saW5lLCAnbGluZUhlaWdodCcpO1xuXG4gICAgY29uc3QgaW5mb0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnaW5mbycpO1xuICAgIHRoaXMuZm9udFNpemUgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGluZm9MaW5lLmxpbmUsICdzaXplJyk7XG5cbiAgICAvLyDmjqXljbgga2VybmluZ3NcbiAgICBjb25zdCBrZXJuaW5nc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAna2VybmluZ3MnKTtcbiAgICBsZXQga2VybmluZ3NDb3VudCA9IDA7XG4gICAgbGV0IGtlcm5pbmdzU3RhcnQgPSAtMTtcbiAgICBpZiAoa2VybmluZ3NMaW5lLmxpbmUpIHtcbiAgICAgIGtlcm5pbmdzQ291bnQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGtlcm5pbmdzTGluZS5saW5lLCAnY291bnQnKTtcbiAgICAgIGtlcm5pbmdzU3RhcnQgPSBrZXJuaW5nc0xpbmUuaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJzOiBDaGFycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgNCArIGNoYXJzQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgY2hhclRleHQ6IHN0cmluZyA9IGxpbmVzW2ldO1xuICAgICAgY29uc3QgbGV0dGVyOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdpZCcpKTtcblxuICAgICAgY29uc3QgYzogQ2hhckRhdGEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4JyksXG4gICAgICAgIHk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5JyksXG4gICAgICAgIHc6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd3aWR0aCcpLFxuICAgICAgICBoOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaGVpZ2h0JyksXG4gICAgICAgIG9mZlg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4b2Zmc2V0JyksXG4gICAgICAgIG9mZlk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5b2Zmc2V0JyksXG4gICAgICAgIHhhZHZhbmNlOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneGFkdmFuY2UnKSxcbiAgICAgICAga2VybmluZzoge31cbiAgICAgIH07XG4gICAgICBjaGFyc1tsZXR0ZXJdID0gYztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBrZXJuaW5nc1xuICAgIGlmIChrZXJuaW5nc0NvdW50KSB7XG4gICAgICBmb3IgKGxldCBpID0ga2VybmluZ3NTdGFydDsgaSA8PSBrZXJuaW5nc1N0YXJ0ICsga2VybmluZ3NDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGZpcnN0OiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2ZpcnN0JykpO1xuICAgICAgICBjb25zdCBzZWNvbmQ6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnc2Vjb25kJykpO1xuICAgICAgICBjb25zdCBhbW91bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2Ftb3VudCcpO1xuXG4gICAgICAgIGlmIChjaGFyc1tzZWNvbmRdKSB7XG4gICAgICAgICAgY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQ6IHN0cmluZ1tdW10sIGxpbmVOYW1lID0gJycpOiBDb25maWdMaW5lRGF0YSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGVuID0gbGluZXNQYXJzZWQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcblxuICAgICAgaWYgKGl0ZW1bMF0gPT09IGxpbmVOYW1lKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgbGluZSA9IGl0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmUsXG4gICAgICBpbmRleCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29uZmlnVGV4dDogc3RyaW5nW10gfCBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbUNvbmZpZ1RleHRMaXN0ID0gQXJyYXkuaXNBcnJheShjb25maWdUZXh0KSA/IGNvbmZpZ1RleHQgOiBjb25maWdUZXh0LnNwbGl0KCcgJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGl0ZW1Db25maWdUZXh0TGlzdDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtQ29uZmlnVGV4dCA9IGl0ZW1Db25maWdUZXh0TGlzdFtpXTtcbiAgICAgIGlmIChrZXkgPT09IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZyhrZXkubGVuZ3RoICsgMSk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsImludGVyZmFjZSBEZWJ1Z0luZm9JdGVtIHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgaXNJbm5lcjogYm9vbGVhbjtcbiAgZW5kPzogbnVtYmVyO1xuICBjb3N0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z0luZm8ge1xuICBwdWJsaWMgaW5mbzogeyBba2V5OiBzdHJpbmddOiBEZWJ1Z0luZm9JdGVtIH0gPSB7fTtcbiAgcHVibGljIHRvdGFsU3RhcnQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0b3RhbENvc3Q6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RhcnQobmFtZTogc3RyaW5nLCBpc0lubmVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50b3RhbFN0YXJ0ID09PSAwKSB7XG4gICAgICB0aGlzLnRvdGFsU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5mb1tuYW1lXSA9IHtcbiAgICAgIHN0YXJ0OiBEYXRlLm5vdygpLFxuICAgICAgaXNJbm5lcixcbiAgICB9O1xuICB9XG5cbiAgZW5kKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmluZm9bbmFtZV0pIHtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5lbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmNvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy5pbmZvW25hbWVdLnN0YXJ0O1xuICAgICAgdGhpcy50b3RhbENvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy50b3RhbFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5mbyA9IHt9O1xuICAgIHRoaXMudG90YWxTdGFydCA9IDA7XG4gICAgdGhpcy50b3RhbENvc3QgPSAwO1xuICB9XG5cbiAgbG9nKG5lZWRJbm5lcjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgbG9nSW5mbyA9ICdMYXlvdXQgZGVidWcgaW5mbzogXFxuJztcbiAgICBsb2dJbmZvICs9IE9iamVjdC5rZXlzKHRoaXMuaW5mbykucmVkdWNlKChzdW0sIGN1cnIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluZm9bY3Vycl0uaXNJbm5lciAmJiAhbmVlZElubmVyKSB7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgICBzdW0gKz0gYCR7Y3Vycn06ICR7dGhpcy5pbmZvW2N1cnJdLmNvc3R9XFxuYDtcbiAgICAgIHJldHVybiBzdW07XG4gICAgfSwgJycpO1xuXG4gICAgbG9nSW5mbyArPSBgdG90YWxDb3N0OiAke3RoaXMudG90YWxDb3N0fVxcbmA7XG5cbiAgICByZXR1cm4gbG9nSW5mbztcbiAgfVxufVxuIiwiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcbmltcG9ydCB7IG5vbmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG50eXBlIENhbGxiYWNrID0gKGltZzogSFRNTEltYWdlRWxlbWVudCwgZnJvbUNhY2hlOiBib29sZWFuKSA9PiB2b2lkO1xuaW50ZXJmYWNlIEltYWdlQ2FjaGUge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGxvYWREb25lOiBib29sZWFuO1xuICBvbmxvYWRjYmtzOiBDYWxsYmFja1tdO1xuICBvbmVycm9yY2JrczogQ2FsbGJhY2tbXTtcbn1cblxuY2xhc3MgSW1hZ2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBpbWdQb29sID0gbmV3IFBvb2w8SW1hZ2VDYWNoZT4oJ2ltZ1Bvb2wnKTtcbiAgXG4gIGdldFJlcyhzcmM6IHN0cmluZyk6IEltYWdlQ2FjaGUge1xuICAgIHJldHVybiB0aGlzLmltZ1Bvb2wuZ2V0KHNyYyk7XG4gIH1cblxuICBsb2FkSW1hZ2VQcm9taXNlKHNyYzogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRJbWFnZShzcmMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcsIHN1Y2Nlc3M6IENhbGxiYWNrID0gbm9uZSwgZmFpbDogQ2FsbGJhY2sgPSBub25lKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGlmICghc3JjKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5nZXRSZXMoc3JjKTtcblxuICAgIC8vIOWbvueJh+W3sue7j+iiq+WKoOi9vei/h++8jOebtOaOpei/lOWbnuWbvueJh+W5tuS4lOaJp+ihjOWbnuiwg1xuICAgIGlmIChjYWNoZSAmJiBjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuICAgICAgc3VjY2VzcyhpbWcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoY2FjaGUgJiYgIWNhY2hlLmxvYWREb25lKSB7XG4gICAgICAvLyDlm77niYfmraPlnKjliqDovb3ov4fnqIvkuK3vvIzov5Tlm57lm77niYflubbkuJTnrYnlvoXlm77niYfliqDovb3lrozmiJDmiafooYzlm57osINcbiAgICAgIGltZyA9IGNhY2hlLmltZztcblxuICAgICAgY2FjaGUub25sb2FkY2Jrcy5wdXNoKHN1Y2Nlc3MpO1xuICAgICAgY2FjaGUub25lcnJvcmNia3MucHVzaChmYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Yib5bu65Zu+54mH77yM5bCG5Zue6LCD5Ye95pWw5o6o5YWl5Zue6LCD5Ye95pWw5qCIXG4gICAgICBpbWcgPSBlbnYuY3JlYXRlSW1hZ2UoKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7XG4gICAgICAgIGltZyxcbiAgICAgICAgbG9hZERvbmU6IGZhbHNlLFxuICAgICAgICBvbmxvYWRjYmtzOiBbc3VjY2Vzc10sXG4gICAgICAgIG9uZXJyb3JjYmtzOiBbZmFpbF0sXG4gICAgICB9XG4gICAgIFxuICAgICAgdGhpcy5pbWdQb29sLnNldChzcmMsIG5ld0NhY2hlKTtcblxuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUubG9hZERvbmUgPSB0cnVlO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW1hZ2VNYW5hZ2VyKCk7XG4iLCJjb25zdCBwb29sczogUG9vbDxhbnk+W10gPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbDxUPiB7XG4gIHB1YmxpYyBuYW1lID0gJ3Bvb2wnXG4gIHB1YmxpYyBwb29sOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUgPSAncG9vbCcpIHtcbiAgICBjb25zdCBjdXJyID0gcG9vbHMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG5cbiAgICBpZiAoY3Vycikge1xuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcblxuICAgIHBvb2xzLnB1c2godGhpcyk7XG4gIH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5wb29sW2tleV07XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5wb29sW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICB9XG5cbiAgZ2V0TGlzdCgpOiBUW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMucG9vbCk7XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyB3aWR0aCA9IDA7XG4gIHB1YmxpYyBoZWlnaHQgPSAwO1xuICBwdWJsaWMgbGVmdCA9IDA7XG4gIHB1YmxpYyByaWdodCA9IDA7XG4gIHB1YmxpYyB0b3AgPSAwO1xuICBwdWJsaWMgYm90dG9tID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5zZXQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNldChsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICB0aGlzLnJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm55u45LqkXG4gICAqIOWOn+eQhuWPr+ingTogaHR0cHM6Ly96aHVhbmxhbi56aGlodS5jb20vcC8yOTcwNDA2NFxuICAgKi9cbiAgaW50ZXJzZWN0cyhyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5yaWdodCA8IHJlY3QubGVmdCB8fCByZWN0LnJpZ2h0IDwgdGhpcy5sZWZ0IHx8IHRoaXMuYm90dG9tIDwgcmVjdC50b3AgfHwgcmVjdC5ib3R0b20gPCB0aGlzLnRvcCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tlciB7XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGFuaW1hdGlvbklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyQ2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgbmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyTmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuXG4gIHByaXZhdGUgbGFzdFRpbWUhOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZGVsdGFUaW1lID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgLy8gY29uc29sZS5sb2coZHQpXG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pbm5lck5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmlubmVyTmV4dENicy5mb3JFYWNoKGNiID0+IGNiKGRlbHRhVGltZSkpO1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiB0aGlzLmNicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KGNiOiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJOZXh0Q2JzLnB1c2goY2IpIDogdGhpcy5uZXh0Q2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUlubmVyKCkge1xuICAgIHRoaXMuaW5uZXJDYnMgPSBbXTtcbiAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgKHRoaXMuY2JzLmluZGV4T2YoY2IpID4gLTEgfHwgdGhpcy5pbm5lckNicy5pbmRleE9mKGNiKSA+IC0xKSkge1xuICAgICAgY29uc3QgbGlzdCA9IGlzSW5uZXIgPyB0aGlzLmlubmVyQ2JzIDogdGhpcy5jYnM7XG4gICAgICBsaXN0LnNwbGljZSh0aGlzLmNicy5pbmRleE9mKGNiKSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNicy5sZW5ndGggJiYgIXRoaXMuaW5uZXJDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmxhc3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPT09IG51bGwgJiYgKHRoaXMuY2JzLmxlbmd0aCB8fCB0aGlzLmlubmVyQ2JzLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gbm9uZSgpIHsgfVxuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGVudW0gU1RBVEUge1xuICBVTklOSVQgPSAnVU5JTklUJyxcbiAgSU5JVEVEID0gJ0lOSVRFRCcsXG4gIFJFTkRFUkVEID0gJ1JFTkRFUkVEJyxcbiAgQ0xFQVIgPSAnQ0xFQVInLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eCAmJiBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUb3VjaEFycmF5KHRvdWNoZXM6IEdhbWVUb3VjaFtdKSB7XG4gIHJldHVybiB0b3VjaGVzLm1hcCh0b3VjaCA9PiAoe1xuICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXG4gICAgcGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIHBhZ2VZOiB0b3VjaC5wYWdlWSxcbiAgICBjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuICAgIGNsaWVudFk6IHRvdWNoLmNsaWVudFksXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR2FtZVRvdWNoRXZlbnQoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KTogZSBpcyBHYW1lVG91Y2hFdmVudCB7XG4gIHJldHVybiAndG91Y2hlcycgaW4gZTtcbn1cblxuLyoqXG4gKiDlj5bmnIDlsI/lgLzlkozmnIDlpKflgLzkuYvpl7TnmoTljLrpl7TpmZDlrprlgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIg6ZyA6KaB6KKr5aSE55CG55qE5pWw5a2XXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIOacgOWwj+WAvFxuICogQHBhcmFtIHtudW1iZXJ9IG1heCDmnIDlpKflgLxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bWJlcjogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihudW1iZXIsIG1heCkpO1xufVxuXG4vKipcbiAqIOS4pOS4quaVsOS5i+mXtOeahOe6v+aAp+aPkuWAvOOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHJhdGlvOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogcmF0aW87XG59IiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbi8vIGNvbXBvbmVudHNcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMsIEVsZW1lbnQsIEJ1dHRvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBJTGF5b3V0LCBJTGF5b3V0Qm94IH0gZnJvbSAnLi4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52JztcblxuaW50ZXJmYWNlIENvbnN0cnVjdG9yIHtcbiAgbmV3ICguLi5hcmdzOiBhbnlbXSk6IGFueTtcbn1cblxuaW50ZXJmYWNlIFRyZWVOb2RlIHtcbiAgbmFtZTogc3RyaW5nO1xuICBhdHRyOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBjaGlsZHJlbjogVHJlZU5vZGVbXTtcbn1cblxuY29uc3QgY29uc3RydWN0b3JNYXA6IHsgW2tleTogc3RyaW5nXTogQ29uc3RydWN0b3IgfSA9IHtcbiAgdmlldzogVmlldyxcbiAgdGV4dDogVGV4dCxcbiAgaW1hZ2U6IEltYWdlLFxuICBzY3JvbGx2aWV3OiBTY3JvbGxWaWV3LFxuICBiaXRtYXB0ZXh0OiBCaXRNYXBUZXh0LFxuICBjYW52YXM6IENhbnZhcyxcbiAgYnV0dG9uOiBCdXR0b24sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gaXNQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIC9cXGQrKD86XFwuXFxkKyk/JS8udGVzdChkYXRhKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IGVudi5nZXRSb290Q2FudmFzU2l6ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQZXJjZW50KHRoaXNTdHlsZS53aWR0aCkpIHtcbiAgICAgIHRoaXNTdHlsZS53aWR0aCA9IHBhcmVudFN0eWxlLndpZHRoID8gY29udmVydFBlcmNlbnQodGhpc1N0eWxlLndpZHRoLCBwYXJlbnRTdHlsZS53aWR0aCkgOiAwO1xuICAgIH1cbiAgICBpZiAoaXNQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQpKSB7XG4gICAgICB0aGlzU3R5bGUuaGVpZ2h0ID0gcGFyZW50U3R5bGUuaGVpZ2h0ID8gY29udmVydFBlcmNlbnQodGhpc1N0eWxlLmhlaWdodCwgcGFyZW50U3R5bGUuaGVpZ2h0KSA6IDA7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzU3R5bGUub3BhY2l0eSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNTdHlsZS5vcGFjaXR5ID0gMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50U3R5bGUub3BhY2l0eSAhPT0gMSAmJiB0eXBlb2YgcGFyZW50U3R5bGUub3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXNTdHlsZS5vcGFjaXR5ID0gcGFyZW50U3R5bGUub3BhY2l0eSAqIHRoaXNTdHlsZS5vcGFjaXR5O1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3MpO1xuICBjb25zdCBlbGVtZW50ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICAvLyBAdHMtaWdub3JlXG4gIGVsZW1lbnQucm9vdCA9IHRoaXM7XG4gIGVsZW1lbnQudGFnTmFtZSA9IG5vZGUubmFtZTtcblxuICBlbGVtZW50LmFmdGVyQ3JlYXRlKCk7XG5cbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlOiBUcmVlTm9kZSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjaGlsZEVsZW1lbnQgPSBjcmVhdGUuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIHN0eWxlLCBhcmdzKTtcblxuICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuYWRkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuKGNoaWxkcmVuOiBFbGVtZW50W10sIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlciA9IHRydWUpIHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAvLyBjaGlsZC5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICBjaGlsZC5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2hpbGQuaW5zZXJ0KGNvbnRleHQsIG5lZWRSZW5kZXIpO1xuXG4gICAgLy8gU2Nyb2xsVmlld+eahOWtkOiKgueCuea4suafk+S6pOe7mVNjcm9sbFZpZXfoh6rlt7HvvIzkuI3mlK/mjIHltYzlpZdTY3JvbGxWaWV3XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBjb250ZXh0LCAgY2hpbGQudHlwZSA9PT0gJ1Njcm9sbFZpZXcnID8gZmFsc2UgOiBuZWVkUmVuZGVyKTtcbiAgfSk7XG59XG5cbi8qKlxuICog5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXRDaGlsZHJlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5sYXlvdXRCb3ggPSBjaGlsZC5sYXlvdXRCb3ggfHwge307XG5cbiAgICBbJ2xlZnQnLCAndG9wJywgJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGQubGF5b3V0Qm94W3Byb3AgYXMga2V5b2YgSUxheW91dEJveF0gPSBjaGlsZC5sYXlvdXQ/Lltwcm9wIGFzIGtleW9mIElMYXlvdXRdIGFzIG51bWJlcjtcbiAgICB9KTtcblxuICAgIGlmIChjaGlsZC5wYXJlbnQpIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVggfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVkgfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9XG5cbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZO1xuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVg7XG5cblxuICAgIGxheW91dENoaWxkcmVuKGNoaWxkKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vbmUoKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlVHJlZShlbGVtZW50OiBFbGVtZW50LCBjYWxsYmFjazogQ2FsbGJhY2sgPSBub25lKSB7XG4gIGNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpdGVyYXRlVHJlZShjaGlsZCwgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRDaGlsZHJlbiA9IChjaGlsZHJlbjogRWxlbWVudFtdKSA9PiB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgaWYgKGNoaWxkLnR5cGUgIT09ICdTY3JvbGxWaWV3Jykge1xuICAgICAgcmVwYWludENoaWxkcmVuKGNoaWxkLmNoaWxkcmVuKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRUcmVlID0gKHRyZWU6IEVsZW1lbnQpID0+IHtcbiAgdHJlZS5yZXBhaW50KCk7XG5cbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIHJlcGFpbnRUcmVlKGNoaWxkKTtcbiAgfSk7XG59O1xuXG5pbnRlcmZhY2UgRWxlbWVudEFyZ3Mge1xuICBzdHlsZTogb2JqZWN0O1xuICBpZE5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGRhdGFzZXQ6IG9iamVjdDtcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQgZXh0ZW5kcyBFbGVtZW50Pihyb290OiBULCBlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSwgcGFyZW50PzogRWxlbWVudCkge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW2VsZW1lbnQudGFnTmFtZSBhcyBzdHJpbmddO1xuICAvLyBAdHMtaWdub3JlXG4gIHJvb3QuZWxlQ291bnQgKz0gMTtcblxuICBjb25zdCBhcmdzOiBFbGVtZW50QXJncyA9IHtcbiAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5zdHlsZSksXG4gICAgaWROYW1lOiBlbGVtZW50LmlkTmFtZSxcbiAgICBjbGFzc05hbWU6IGVsZW1lbnQuY2xhc3NOYW1lLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogcm9vdC5lbGVDb3VudCxcbiAgICBkYXRhc2V0OiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LmRhdGFzZXQpLFxuICAgIG5hbWU6IGVsZW1lbnQudGFnTmFtZSxcbiAgfTtcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgYXJncy5zcmMgPSBlbGVtZW50LnNyYztcbiAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgVGV4dCB8fCBlbGVtZW50IGluc3RhbmNlb2YgQml0TWFwVGV4dCkge1xuICAgIGFyZ3MudmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgY29uc3QgbmV3RWxlbWVuZXQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIG5ld0VsZW1lbmV0LnJvb3QgPSByb290O1xuICAvLyBAdHMtaWdub3JlXG4gIG5ld0VsZW1lbmV0Lmluc2VydChyb290LnJlbmRlckNvbnRleHQsIGZhbHNlKTtcbiAgbmV3RWxlbWVuZXQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKTtcblxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LmFkZChuZXdFbGVtZW5ldCk7XG4gIH1cblxuICBpZiAoZGVlcCkge1xuICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNsb25lKHJvb3QsIGNoaWxkLCBkZWVwLCBuZXdFbGVtZW5ldCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3RWxlbWVuZXQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4uL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2w8Qml0TWFwRm9udD4oJ2JpdE1hcFBvb2wnKTtcblxuaW50ZXJmYWNlIElCaXRNYXBUZXh0T3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBmb250Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ0JpdE1hcFRleHQnO1xuICBwcml2YXRlIHZhbHVlc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBmb250OiBCaXRNYXBGb250O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElCaXRNYXBUZXh0T3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgdmFsdWUgPSAnJyxcbiAgICAgIGZvbnQgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIHRoaXMuZm9udCA9IGJpdE1hcFBvb2wuZ2V0KGZvbnQpO1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBNaXNzaW5nIEJpdG1hcEZvbnQgXCIke2ZvbnR9XCIsIHBsZWFzZSBpbnZva2UgQVBJIFwicmVnaXN0Qml0TWFwRm9udFwiIGJlZm9yZSB1c2luZyBcIkJpdE1hcFRleHRcImApO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5lbWl0KCdyZXBhaW50Jyk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnQucmVhZHkpIHtcbiAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvbnQuZXZlbnQub24oJ3RleHRfX2xvYWRfX2RvbmUnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRUZXh0Qm91bmRzKCkge1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7IGxldHRlclNwYWNpbmcgPSAwIH0gPSBzdHlsZTtcbiAgICBsZXQgd2lkdGggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuICAgICAgaWYgKGNmZykge1xuICAgICAgICB3aWR0aCArPSBjZmcudztcblxuICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICB3aWR0aCArPSBsZXR0ZXJTcGFjaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodDogdGhpcy5mb250LmxpbmVIZWlnaHQgfTtcbiAgfVxuXG4gIHJlbmRlclRleHQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFRleHRCb3VuZHMoKTtcbiAgICBjb25zdCBkZWZhdWx0TGluZUhlaWdodCA9IHRoaXMuZm9udC5saW5lSGVpZ2h0IGFzIG51bWJlcjtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBsZXQgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1kgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoID0gMCwgLy8g5rKh5pyJ6K6+572u6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICBoZWlnaHQgPSAwLCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIHRleHRBbGlnbiwgLy8g5paH5a2X5bem5Y+z5a+56b2Q5pa55byPXG4gICAgICB2ZXJ0aWNhbEFsaWduLFxuICAgICAgbGV0dGVyU3BhY2luZyA9IDAsXG4gICAgfSA9IHN0eWxlO1xuICAgIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAoc3R5bGUubGluZUhlaWdodCB8fCBkZWZhdWx0TGluZUhlaWdodCkgYXMgbnVtYmVyXG5cbiAgICBjb25zdCBzY2FsZVkgPSBsaW5lSGVpZ2h0IC8gZGVmYXVsdExpbmVIZWlnaHQ7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gc2NhbGVZICogYm91bmRzLndpZHRoO1xuXG4gICAgLy8g5aaC5p6c5paH5a2X55qE5riy5p+T5Yy65Z+f6auY5bqm5bCP5LqO55uS5a2Q6auY5bqm77yM6YeH55So5a+56b2Q5pa55byPXG4gICAgaWYgKGxpbmVIZWlnaHQgPCBoZWlnaHQpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnbWlkZGxlJykge1xuICAgICAgICBkcmF3WSArPSAoaGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnYm90dG9tJykge1xuICAgICAgICBkcmF3WSA9IGRyYXdZICsgaGVpZ2h0IC0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2lkdGggPiByZWFsV2lkdGgpIHtcbiAgICAgIGlmICh0ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgIGRyYXdYICs9ICh3aWR0aCAtIHJlYWxXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgZHJhd1kgKz0gKHdpZHRoIC0gcmVhbFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcblxuICAgICAgaWYgKHByZXZDaGFyQ29kZSAmJiBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdKSB7XG4gICAgICAgIGRyYXdYICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICB0aGlzLmZvbnQudGV4dHVyZSBhcyBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICAgIGNmZy54LFxuICAgICAgICAgIGNmZy55LFxuICAgICAgICAgIGNmZy53LFxuICAgICAgICAgIGNmZy5oLFxuICAgICAgICAgIGRyYXdYICsgY2ZnLm9mZlggKiBzY2FsZVkgLSBvcmlnaW5YLFxuICAgICAgICAgIGRyYXdZICsgY2ZnLm9mZlkgKiBzY2FsZVkgLSBvcmlnaW5ZLFxuICAgICAgICAgIGNmZy53ICogc2NhbGVZLFxuICAgICAgICAgIGNmZy5oICogc2NhbGVZLFxuICAgICAgICApO1xuXG4gICAgICAgIGRyYXdYICs9IChjZmcueGFkdmFuY2UgKiBzY2FsZVkgKyBsZXR0ZXJTcGFjaW5nKTtcblxuICAgICAgICBwcmV2Q2hhckNvZGUgPSBjaGFyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcclxuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XHJcbmltcG9ydCB7IGxlcnAgfSBmcm9tICcuLi9jb21tb24vdXRpbCdcclxuaW50ZXJmYWNlIElCdXR0b25Qcm9wcyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XHJcbiAgdmFsdWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmjInpkq7nmoTov4fluqbnsbvlnovmnprkuL5cclxuICovXHJcbmVudW0gVHJhbnNpdGlvbiB7XHJcbiAgTk9ORSxcclxuICBDT0xPUixcclxuICBTQ0FMRSxcclxuICBJTUFHRSxcclxufVxyXG5cclxuY29uc3QgREVGQVVMVENPTE9SID0gJ3JnYmEoNTIsIDE2MSwgMzUsIDEpJztcclxuY29uc3QgUFJFU1NFRENPTE9SID0gJ3JnYmEoNTIsIDE2MSwgMzUsIDAuNyknO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgVmlldyB7XHJcbiAgLy8g5oyJ6ZKu55qE5paH5pys5a6e5L6LXHJcbiAgcHVibGljIGxhYmVsOiBUZXh0O1xyXG5cclxuICAvLyDmjInpkq7lvZPliY3mmK/lkKblj6/ngrnlh7tcclxuICBwcml2YXRlIGludGVyYWN0YWJsZUlubmVyID0gdHJ1ZTtcclxuXHJcbiAgLy8g5oyJ6ZKu54K55Ye75Lqk5LqS6KGM5Li6XHJcbiAgcHJpdmF0ZSB0cmFuc2l0aW9uSW5uZXIgPSBUcmFuc2l0aW9uLlNDQUxFO1xyXG5cclxuICAvLyDmjInpkq7nmoTkuqTkupLmk43kvZzkuLrpopzoibLliIfmjaJcclxuICBwcml2YXRlIG5vcm1hbENvbG9ySW5uZXIgPSBERUZBVUxUQ09MT1I7XHJcbiAgcHJpdmF0ZSBwcmVzc2VkQ29sb3JJbm5lciA9IFBSRVNTRURDT0xPUjtcclxuXHJcbiAgLy8g5oyJ6ZKu55qE5Lqk5LqS5pON5L2c5Li657yp5pS+XHJcbiAgcHJpdmF0ZSBub3JtYWxTY2FsZUlubmVyID0gMTtcclxuICBwcml2YXRlIHByZXNzZWRTY2FsZUlubmVyID0gMC45NTtcclxuICAvLyDnvKnmlL7liqjnlLvnmoTml7bplb9cclxuICBwdWJsaWMgc2NhbGVEdXJhdGlvbiA9IDEwMDtcclxuICAvLyDlvZPliY3nvKnmlL7liqjnlLvmmK/lkKbmkq3mlL7lrozmr5VcclxuICBwcml2YXRlIHNjYWxlRG9uZSA9IHRydWU7XHJcbiAgLy8g57yp5pS+5Yqo55S75byA5aeL55qE5pe26Ze0XHJcbiAgcHJpdmF0ZSB0aW1lQ2xpY2sgPSAwO1xyXG4gIC8vIOe8qeaUvuWKqOeUu+eahCBzY2FsZSDliJ3lp4vlgLzvvIzov5nlubbkuI3mmK/lm7rlrprkuI3lj5jnmoTvvIzlvZPngrnlh7vnu5PmnZ/vvIzlj6/og73pnIDopoHku47lpKfliLDlsI/lj5jmjaJcclxuICBwcml2YXRlIGZyb21TY2FsZSA9IDE7XHJcbiAgLy8g57yp5pS+5Yqo55S755qEIHNjYWxlIOebruagh+WAvFxyXG4gIHByaXZhdGUgdG9TY2FsZSA9IDE7XHJcblxyXG4gIC8vIOaMiemSrueahOS6pOS6kuaTjeS9nOS4uuWbvueJh+WIh+aNolxyXG4gIHByaXZhdGUgbm9ybWFsSW1hZ2VJbm5lciA9ICcnO1xyXG4gIHByaXZhdGUgcHJlc3NlZEltYWdlSW5uZXIgPSAnJztcclxuXHJcbiAgY29uc3RydWN0b3Ioe1xyXG4gICAgc3R5bGUgPSB7fSxcclxuICAgIGlkTmFtZSA9ICcnLFxyXG4gICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICB2YWx1ZSA9ICcnLFxyXG4gICAgZGF0YXNldCxcclxuICB9OiBJQnV0dG9uUHJvcHMpIHtcclxuICAgIHN1cGVyKHtcclxuICAgICAgaWROYW1lLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICBoZWlnaHQ6IDYwLFxyXG4gICAgICAgIGJvcmRlclJhZGl1czogMTAsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzM0YTEyMycsXHJcbiAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxyXG4gICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxyXG4gICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMiwgMS4yKScsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGFzZXQsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmxhYmVsID0gbmV3IFRleHQoe1xyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIGNvbG9yOiBzdHlsZS5jb2xvciB8fCAnI2ZmZmZmZicsXHJcbiAgICAgICAgZm9udFNpemU6IHN0eWxlLmZvbnRTaXplIHx8IDMwLFxyXG4gICAgICB9LFxyXG4gICAgICB2YWx1ZTogdmFsdWUgfHwgJ2J1dHRvbicsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG5cclxuICAgIC8vIOe7keWumum7mOiupOeahOS6i+S7tuWkhOeQhueoi+W6j1xyXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIHRoaXMudG91Y2hzdGFydEhhbmRsZXIpO1xyXG4gICAgdGhpcy5vbigndG91Y2hlbmQnLCB0aGlzLnRvdWNoZW5kSGFuZGxlcik7XHJcblxyXG4gICAgY29uc29sZS5sb2codGhpcy5yZW5kZXJGb3JMYXlvdXQpXHJcbiAgfVxyXG5cclxuICB0b3VjaHN0YXJ0SGFuZGxlciA9ICgpID0+IHtcclxuICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgdGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLk5PTkUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU0NBTEUpIHtcclxuICAgICAgdGhpcy5mcm9tU2NhbGUgPSB0aGlzLm5vcm1hbFNjYWxlSW5uZXI7XHJcbiAgICAgIHRoaXMudG9TY2FsZSA9IHRoaXMucHJlc3NlZFNjYWxlSW5uZXI7XHJcbiAgICAgIHRoaXMudGltZUNsaWNrID0gMDtcclxuICAgICAgdGhpcy5zY2FsZURvbmUgPSBmYWxzZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLkNPTE9SKSB7XHJcbiAgICAgIHRoaXMuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5wcmVzc2VkQ29sb3JJbm5lcjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHRvdWNoZW5kSGFuZGxlciA9ICgpID0+IHtcclxuICAgIGlmICghdGhpcy5pbnRlcmFjdGFibGUgfHwgdGhpcy50cmFuc2l0aW9uID09PSBUcmFuc2l0aW9uLk5PTkUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uU0NBTEUpIHtcclxuICAgICAgdGhpcy5mcm9tU2NhbGUgPSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggfHwgMTsgLy8g5b2T5YmN55qE57yp5pS+5YC8XHJcbiAgICAgIHRoaXMudG9TY2FsZSA9IHRoaXMubm9ybWFsU2NhbGVJbm5lcjtcclxuICAgICAgdGhpcy50aW1lQ2xpY2sgPSAwO1xyXG4gICAgICB0aGlzLnNjYWxlRG9uZSA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnRyYW5zaXRpb24gPT09IFRyYW5zaXRpb24uQ09MT1IpIHtcclxuICAgICAgdGhpcy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLm5vcm1hbENvbG9ySW5uZXI7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhZnRlckNyZWF0ZSgpIHtcclxuICAgIHRoaXMubGFiZWwucm9vdCA9IHRoaXMucm9vdDtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3lTZWxmKCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUpO1xyXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XHJcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlID0gKGR0OiBudW1iZXIpID0+IHtcclxuICAgIGlmICh0aGlzLnNjYWxlRG9uZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnRpbWVDbGljayArPSBkdDtcclxuXHJcbiAgICBsZXQgcmF0aW8gPSAxO1xyXG5cclxuICAgIHJhdGlvID0gdGhpcy50aW1lQ2xpY2sgLyB0aGlzLnNjYWxlRHVyYXRpb247XHJcblxyXG4gICAgaWYgKHJhdGlvID4gMSkge1xyXG4gICAgICByYXRpbyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNjYWxlID0gbGVycCh0aGlzLmZyb21TY2FsZSwgdGhpcy50b1NjYWxlLCByYXRpbyk7XHJcbiAgICBsZXQgdHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGV9LCAke3NjYWxlfSlgO1xyXG4gICAgdGhpcy5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcbiAgICB0aGlzLmxhYmVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuXHJcbiAgICBpZiAocmF0aW8gPT09IDEpIHtcclxuICAgICAgdGhpcy5zY2FsZURvbmUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICog5b2T5YmN5oyJ6ZKu5piv5ZCm5Y+v5Lqk5LqS77yM5aaC5p6c5LiN5Y+v5Lqk5LqS77yM54K55Ye75rKh5Y+N5bqUXHJcbiAgICovXHJcbiAgZ2V0IGludGVyYWN0YWJsZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmludGVyYWN0YWJsZUlubmVyO1xyXG4gIH1cclxuXHJcbiAgc2V0IGludGVyYWN0YWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaW50ZXJhY3RhYmxlID0gdmFsO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRyYW5zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uSW5uZXI7XHJcbiAgfVxyXG5cclxuICBzZXQgdHJhbnNpdGlvbih2YWw6IFRyYW5zaXRpb24pIHtcclxuICAgIHRoaXMudHJhbnNpdGlvbklubmVyID0gdmFsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJQ2FudmFzT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGF1dG9DcmVhdGVDYW52YXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBjYW52YXNJbnN0YW5jZTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElDYW52YXNPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgICAgd2lkdGggPSAxMDAsXG4gICAgICBoZWlnaHQgPSAxMDAsXG4gICAgICBhdXRvQ3JlYXRlQ2FudmFzID0gZmFsc2UsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HlsI/muLjmiI/lnLrmma/kuIvvvIxzaGFyZWRDYW52YXMg5a6e5L6L5LiN5pa55L6/6Ieq5Yqo5Yib5bu677yM5o+Q5L6bIHNldHRlciDmiYvliqjorr7nva5cbiAgICAgKi9cbiAgICBpZiAoYXV0b0NyZWF0ZUNhbnZhcykge1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGVudi5jcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzSW5zdGFuY2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg57uT5p2fXG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpIHtcbiAgICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBSZWN0IGZyb20gJy4uL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnO1xuaW1wb3J0IHsgYmFja2dyb3VuZEltYWdlUGFyc2VyLCByb3RhdGVQYXJzZXIsIHBhcnNlVHJhbnNmb3JtIH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGlkOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZCh0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RGlydHkoZWxlOiBFbGVtZW50LCByZWFzb24/OiBzdHJpbmcpIHtcbiAgLy8gZm9yIGRlYnVnXG4gIGNvbnNvbGUubG9nKCdbTGF5b3V0XSB0cmlnZ2VyIHJlZmxvdyBjYXVzZScsIGVsZSwgcmVhc29uKTtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckZvckxheW91dCB7XG4gIHJvdGF0ZT86IG51bWJlcjsgLy8gdHJhbnNmb3JtIHJvdGF0Zeino+aekOS5i+WQjuW+l+WIsOeahOW8p+W6puWItlxuICBzY2FsZVg/OiBudW1iZXI7XG4gIHNjYWxlWT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIHJpZ2h0OiBudW1iZXI7XG4gIGJvdHRvbTogbnVtYmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudCB7XG4gIC8qKlxuICAgKiDlrZDoioLngrnliJfooahcbiAgICovXG4gIHB1YmxpYyBjaGlsZHJlbjogRWxlbWVudFtdID0gW107XG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTniLboioLngrlcbiAgICovXG4gIHB1YmxpYyBwYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvLyDkvLzkuY7msqHku4DkuYjnlKjvvIzlhYjms6jph4pcbiAgLy8gcHVibGljIHBhcmVudElkID0gMDtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahGlk77yM5LiA6Iis5piv55SxIExheW91dCDnu5/kuIDliIbphY3nmoToh6rlop4gaWRcbiAgICovXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBpZCDlsZ7mgKfvvIzkuIDoiKznlKjkuo7oioLngrnmn6Xor6JcbiAgICovXG4gIHB1YmxpYyBpZE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgY2xhc3Mg5bGe5oCn77yM5LiA6Iis55So5LqO5qih5p2/5o+S5Lu2XG4gICAqL1xuICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueaJgOWcqOiKgueCueagkeeahOagueiKgueCue+8jOaMh+WQkSBMYXlvdXRcbiAgICovXG4gIHB1YmxpYyByb290OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8vIHB1YmxpYyBFRTogYW55O1xuXG4gIC8qKlxuICAgKiDnlKjkuo7moIfor4blvZPliY3oioLngrnmmK/lkKblt7Lnu4/miafooYzplIDmr4HpgLvovpHvvIzplIDmr4HkuYvlkI7ljp/lhYjnmoTlip/og73pg73kvJrlvILluLjvvIzkuIDoiKzkuJrliqHkvqfkuI3nlKjlhbPlv4Pov5nkuKpcbiAgICovXG4gIHB1YmxpYyBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDnsbvkvLwgV2ViIOerr+WunueOsO+8jOe7meiKgueCueaMguS4gOS6m+iDveWkn+ivu+WGmeeahOWxnuaAp+mbhuWQiFxuICAgKiDlnKggeG1sIOWPr+S7pei/meagt+WjsOaYjuWxnuaAp++8mjx2aWV3IGNsYXNzPVwieHh4XCIgZGF0YS1mb289XCJiYXJcIj5cbiAgICog5ZyoIGpzIOS+p+WPr+S7pei/meS5iOivu+WGmeWxnuaAp++8mlxuICAgKiBjb25zb2xlLmxvZyhlbGVtZW50LmRhdGFzZXQuZm9vKTsgLy8g5o6n5Yi25Y+w6L6T5Ye6IFwiYmFyXCI7XG4gICAqIGVsZW1lbnQuZGF0YXNldC5mb28gPSBcImJhcjJcIjtcbiAgICovXG4gIHB1YmxpYyBkYXRhc2V0OiBJRGF0YXNldDtcblxuICAvKipcbiAgICog6IqC54K555qE5qC35byP5YiX6KGo77yM5ZyoIExheW91dC5pbml0IOS8muS8oOWFpeagt+W8j+mbhuWQiO+8jOS8muiHquWKqOaMkemAieWHuui3n+iKgueCueacieWFs+eahOagt+W8j+e7n+S4gCBtZXJnZSDliLAgc3R5bGUg5a+56LGh5LiKXG4gICAqL1xuICBwdWJsaWMgc3R5bGU6IElTdHlsZTtcblxuICAvKipcbiAgICog5omn6KGMIGdldEJvdW5kaW5nQ2xpZW50UmVjdCDnmoTnu5PmnpznvJPlrZjvvIzlpoLmnpzkuJrliqHpq5jpopHosIPnlKjvvIzlj6/ku6Xlh4/lsJEgR0NcbiAgICovXG4gIHByaXZhdGUgcmVjdDogUmVjdCB8IG51bGw7XG4gIHB1YmxpYyBjbGFzc05hbWVMaXN0OiBzdHJpbmdbXSB8IG51bGw7XG4gIHB1YmxpYyBsYXlvdXRCb3g6IElMYXlvdXRCb3g7XG4gIHB1YmxpYyBiYWNrZ3JvdW5kSW1hZ2U6IGFueTtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGxcblxuICAvKipcbiAgICog572u6ISP5qCH6K6w5L2N77yM55uu5YmN5b2T5L+u5pS55Lya5b2x5ZON5biD5bGA5bGe5oCn55qE5pe25YCZ77yM5Lya6Ieq5Yqo572u6ISPXG4gICAqL1xuICBwdWJsaWMgaXNEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBjc3MtbGF5b3V0IOiKgueCueWxnuaAp++8jOS4muWKoeS+p+aXoOmcgOWFs+W/g1xuICAgKi9cbiAgcHJvdGVjdGVkIHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTlkI3np7DvvIzmr5TlpoJcIiBJbWFnZVxuICAgKi9cbiAgcHVibGljIHR5cGU/OiBzdHJpbmc7XG4gIC8vIHB1YmxpYyBsYXlvdXQ/OiBJTGF5b3V0O1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnlnKggeG1sIOeahOagh+etvuWQjeensO+8jOavlOWmgiBpbWFnZeOAgXZpZXdcbiAgICovXG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgb3JpZ2luU3R5bGU6IElTdHlsZTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyRm9yTGF5b3V0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHZhbDogYW55KSB7XG5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGlkID0gdXVpZCArPSAxLFxuICAgIGRhdGFzZXQgPSB7fSxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaWROYW1lID0gaWROYW1lO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIHRoaXMubGF5b3V0Qm94ID0ge1xuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgYWJzb2x1dGVYOiAwLFxuICAgICAgYWJzb2x1dGVZOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVg6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgIGlmICh0eXBlb2Ygc3R5bGUuYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHN0eWxlLmJhY2tncm91bmRJbWFnZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzdHlsZS50cmFuc2Zvcm0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnJlbmRlckZvckxheW91dCA9IHBhcnNlVHJhbnNmb3JtKHN0eWxlLnRyYW5zZm9ybSk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5TdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnJlY3QgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBiYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKGJhY2tncm91bmRJbWFnZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdXJsID0gYmFja2dyb3VuZEltYWdlUGFyc2VyKGJhY2tncm91bmRJbWFnZSk7XG5cbiAgICBpZiAodXJsKSB7XG4gICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHVybCwgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3QgJiYgdGhpcy5yb290LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOebkeWQrOWxnuaAp+eahOWPmOWMluWIpOaWreaYr+WQpumcgOimgeaJp+ihjCByZWZsb3fjgIFyZXBhaW50IOaTjeS9nFxuICAgKiDnu4/ov4fmtYvor5XvvIxPYmplY3QuZGVmaW5lUHJvcGVydHkg5piv5LiA5Liq5q+U6L6D5oWi55qE5pa55rOV77yMIOeJueWIq+aYr+WxnuaAp+avlOi+g+WkmueahOaXtuWAmVxuICAgKiDlm6DmraTkvJrlhYjliKTmlq3mmK/lkKbmlK/mjIEgUHJveHnvvIxpTWFjIChSZXRpbmEgNUssIDI3LWluY2gsIDIwMTcp5rWL6K+V57uT5p6cXG4gICAqIOaAu+WFsSAzMTIg5Liq6IqC54K577yMb2JzZXJ2ZVN0eWxlQW5kRXZlbnTmgLvogJfml7bkuLrvvJpcbiAgICogUHJveHk6IDNtc1xuICAgKiBPYmplY3QuZGVmaW5lUHJvcGVydHk6IDIwbXNcbiAgICovXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICB0aGlzLnN0eWxlID0gbmV3IFByb3h5KHRoaXMub3JpZ2luU3R5bGUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJyAmJiBvbGRWYWwgIT09IHZhbCkge1xuICAgICAgICAgICAgZWxlLnN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wLCB2YWwpO1xuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ3RyYW5zZm9ybScpIHtcbiAgICAgICAgICAgICAgZWxlLnJlbmRlckZvckxheW91dCA9IHBhcnNlVHJhbnNmb3JtKHZhbCk7XG5cbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHJlZmxvd0FmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICAgICAgICBzZXREaXJ0eShlbGUsIGBjaGFuZ2UgcHJvcCAke3Byb3B9IGZyb20gJHtvbGRWYWx9IHRvICR7dmFsfWApO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIGVsZS5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICdiYWNrZ3JvdW5kSW1hZ2UnKSB7XG4gICAgICAgICAgICAgIGVsZS5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5uZXJTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3R5bGUpIGFzIElTdHlsZTtcbiAgICAgIGFsbFN0eWxlcy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMuc3R5bGUsIGtleSwge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogKCkgPT4gaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSxcbiAgICAgICAgICBzZXQ6ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHZhbHVlICE9PSBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdKSB7XG4gICAgICAgICAgICAgIGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBzZXREaXJ0eSh0aGlzLCBgY2hhbmdlIHByb3AgJHtrZXl9IHRvICR7dmFsdWV9YCk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOS6i+S7tuWGkuazoemAu+i+kVxuICAgIFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hjYW5jZWwnLCAndG91Y2hlbmQnLCAnY2xpY2snXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub24oZXZlbnROYW1lLCAoZSwgdG91Y2hNc2cpID0+IHtcbiAgICAgICAgLy8gaWYgKGV2ZW50TmFtZSAhPT0gJ3RvdWNobW92ZScpIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCBldmVudE5hbWUpXG4gICAgICAgIC8vIH1cbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZW1pdChldmVudE5hbWUsIGUsIHRvdWNoTXNnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnph43nu5jmjqXlj6PvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlcGFpbnQoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55riy5p+T5o6l5Y+j5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZW5kZXIoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55p6E6YCg5Ye95pWw5Yid5aeL5YyW5ZCO6LCD55So55qE5pa55rOV77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICBhZnRlckNyZWF0ZSgpIHt9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQodGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQoaWQ6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlJZCh0aGlzLCBbXSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGNsYXNzTmFtZSDljIXlkKvnu5nlrprlj4LmlbDnmoTnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy51bkJpbmRFdmVudCgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZWApO1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoaXMgZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGlydHkoKSB7XG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG5cbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95KCkge1xuICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcblxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIC8vIHRoaXMuRUUgPSBudWxsO1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLmN0eCA9IG51bGw7XG5cbiAgICAvLyBlbGVtZW50IOWcqOeUu+W4g+S4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgIC8vIHRoaXMubGF5b3V0Qm94ID0gbnVsbDtcbiAgICAvLyB0aGlzLnN0eWxlID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBhZGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcbiAgICAvLyBlbGVtZW50LnBhcmVudElkID0gdGhpcy5pZDtcblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbkuIDkuKroioLngrnmt7vliqDkvZzkuLrlvZPliY3oioLngrnnmoTlrZDoioLngrlcbiAgICovXG4gIGFwcGVuZENoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICB0aGlzLmFkZChlbGVtZW50KTtcblxuICAgIHNldERpcnR5KHRoaXMsIGBhcHBlbmRDaGlsZCAke2VsZW1lbnR9YCk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkIFxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBzZXREaXJ0eSh0aGlzLCBgcmVtb3ZlQ2hpbGQgJHtlbGVtZW50fWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyBlbGVtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi50aGVBcmdzOiBhbnlbXSkge1xuICAgIEVFLmVtaXQodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCAuLi50aGVBcmdzKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICog5riy5p+TIGJvcmRlciDnm7jlhbPog73lipvmir3osaHvvIzlrZDnsbvlj6/mjInpnIDosIPnlKhcbiAgICog55Sx5LqO5pSv5oyB5LqGcm90YXRl54m55oCn77yM5omA5Lul5omA5pyJ55qE5riy5p+T6YO96ZyA6KaB5pa55ZCR5YeP5Y67dHJhbnNmb3Jt55qE5Lit6Ze054K5XG4gICAqL1xuICByZW5kZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG9yaWdpblg6IG51bWJlciA9IDAsIG9yaWdpblk6IG51bWJlciA9IDApIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgcmFkaXVzID0gc3R5bGUuYm9yZGVyUmFkaXVzIHx8IDA7XG4gICAgY29uc3QgeyBib3JkZXJXaWR0aCA9IDAgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHRsciA9IHN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IHRyciA9IHN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBiYnIgPSBzdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBicnIgPSBzdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciA9ICcnIH0gPSBzdHlsZTtcbiAgICBjb25zdCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCB5ID0gYm94LmFic29sdXRlWTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGNvbnN0IGhhc1JhZGl1cyA9IHJhZGl1cyB8fCB0bHIgfHwgdHJyIHx8IGJiciB8fCBicnI7XG5cbiAgICAvLyBib3JkZXJXaWR0aCDlkowgcmFkaXVzIOmDveayoeacie+8jOS4jemcgOimgeaJp+ihjOWQjue7remAu+i+ke+8jOaPkOWNh+aAp+iDvVxuICAgIGlmICghYm9yZGVyV2lkdGggJiYgIWhhc1JhZGl1cykge1xuICAgICAgcmV0dXJuIHsgbmVlZENsaXA6IGZhbHNlLCBuZWVkU3Ryb2tlOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBib3JkZXJXaWR0aDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBib3JkZXJDb2xvcjtcblxuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHggKyB0bHIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB0cnIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSk7XG4gICAgLy8g5Y+z5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgdHJyIC0gb3JpZ2luWSwgdHJyKTtcbiAgICAvLyDlj7PkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBicnIgLSBvcmlnaW5ZKTtcbiAgICAvLyDlj7PkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIHggKyB3aWR0aCAtIGJyciAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCBicnIpO1xuICAgIC8vIOW3puS4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIGJiciAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZKTtcbiAgICAvLyDlt6bkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCB4IC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIGJiciAtIG9yaWdpblksIGJicik7XG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4IC0gb3JpZ2luWCwgeSArIHRsciAtIG9yaWdpblkpO1xuICAgIC8vIOW3puS4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4IC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHggKyB0bHIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgdGxyKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICByZXR1cm4geyBuZWVkQ2xpcDogISFoYXNSYWRpdXMsIG5lZWRTdHJva2U6ICEhYm9yZGVyV2lkdGggfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr4/kuKrlrZDnsbvpg73kvJrmnInoh6rlt7HnmoTmuLLmn5PpgLvovpHvvIzkvYbku5bku6zpg73mnInkupvpgJrnlKjnmoTlpITnkIbvvIzmr5TlpoLpgI/mmI7luqbjgIHml4vovazlkoxib3JkZXLnmoTlpITnkIbvvIxiYXNlUmVuZGVyIOeUqOS6juWkhOeQhumAmueUqOeahOa4suafk+mAu+i+kVxuICAgKi9cbiAgYmFzZVJlbmRlcih0eXBlPzogc3RyaW5nKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IGRyYXdYLCBhYnNvbHV0ZVk6IGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG5cbiAgICBpZiAoc3R5bGUub3BhY2l0eSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSBzdHlsZS5vcGFjaXR5IGFzIG51bWJlcjtcbiAgICB9XG5cbiAgICBsZXQgb3JpZ2luWCA9IDA7XG4gICAgbGV0IG9yaWdpblkgPSAwO1xuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3JpZ2luWCA9IGRyYXdYICsgYm94LndpZHRoIC8gMjtcbiAgICAgIG9yaWdpblkgPSBkcmF3WSArIGJveC5oZWlnaHQgLyAyO1xuXG4gICAgICBjdHgudHJhbnNsYXRlKG9yaWdpblgsIG9yaWdpblkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDor7fms6jmhI/vvIzov5nph4zmmoLml7bku4XmlK/mjIHmsqHmnInlrZDoioLngrnnmoTlhYPntKDlj5HnlJ/ml4vovazvvIzlpoLmnpzniLboioLngrnml4vovazkuoblrZDoioLngrnlubbkuI3kvJrot5/nnYDml4vovaxcbiAgICAgKiDopoHlrp7njrDniLboioLngrnluKbliqjlrZDoioLngrnml4vovaznmoTog73lipvvvIzpnIDopoHlvJXlhaXnn6npmLXlupPvvIzlr7nku6PnoIHmlLnliqjkuZ/mr5TovoPlpKfvvIzmmoLml7bkuI3lgZrmlLnpgKDjgIJcbiAgICAgKi9cbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGN0eC5yb3RhdGUodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggOiAxICwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgOiAxKVxuICAgICAgY3R4LnNjYWxlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYIDogMSAsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZIDogMSk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIC8vIGZvciBjbGlwXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJSW1hZ2VPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc3JjPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZSBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGltZ3NyYzogc3RyaW5nO1xuICBwdWJsaWMgdHlwZSA9ICdJbWFnZSc7XG4gIHB1YmxpYyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElJbWFnZU9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHNyYyA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1nc3JjID0gc3JjO1xuXG4gICAgdGhpcy5pbWcgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNyYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgfVxuXG4gIHNldCBzcmMobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5pbWdzcmMpIHtcbiAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5pbWcgPSBudWxsO1xuXG4gICAgdGhpcy5zcmMgPSAnJztcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5pbWcgfHwgIXRoaXMuaW1nPy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOe7k+adn1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICB0aGlzLnJlbmRlckJvcmRlcihjdHgsIG9yaWdpblgsIG9yaWdpblkpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgSW1hZ2UgZnJvbSAnLi9pbWFnZSc7XG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuaW1wb3J0IFNjcm9sbFZpZXcgZnJvbSAnLi9zY3JvbGx2aWV3JztcbmltcG9ydCBCaXRNYXBUZXh0IGZyb20gJy4vYml0bWFwdGV4dCc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5cbmV4cG9ydCB7XG4gIEVsZW1lbnQsXG4gIFZpZXcsXG4gIEltYWdlLFxuICBUZXh0LFxuICBTY3JvbGxWaWV3LFxuICBCaXRNYXBUZXh0LFxuICBDYW52YXMsXG4gIEJ1dHRvbixcbn07XG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcblxuZXhwb3J0IGVudW0gU2Nyb2xsQmFyRGlyZWN0aW9uIHtcbiAgVmVydGl2YWwsXG4gIEhvcml6b250YWwsXG59XG5cbmludGVyZmFjZSBJRGltZW5zaW9ucyB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBjb250ZW50V2lkdGg6IG51bWJlcjtcbiAgY29udGVudEhlaWdodDogbnVtYmVyO1xuXG4gIG1heFNjcm9sbExlZnQ6IG51bWJlcjtcbiAgbWF4U2Nyb2xsVG9wOiBudW1iZXI7XG5cbiAgc2Nyb2xsTGVmdDogbnVtYmVyO1xuICBzY3JvbGxUb3A6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElTY3JvbGxCYXJPcHRpb25zIHtcbiAgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xufVxuXG4vKipcbiAqIOagueaNrua7muWKqOadoeeahOWwuuWvuOOAgVNjcm9sbFZpZXcg6KeG5Y+j5ZKM5rua5Yqo56qX5Y+j5bC65a+444CB5rua5Yqo6Ziy57q/5L+h5oGv56Gu6K6k5rua5Yqo5p2h55qE5qC35byP5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbDtcbiAgY29uc3QgeyB3aWR0aDogc2Nyb2xsV2lkdGgsIGhlaWdodDogc2Nyb2xsSGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQgfSA9IGRpbWVuc2lvbnM7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogaXNWZXJ0aWNhbCA/IHdpZHRoIDogc2Nyb2xsV2lkdGggKiAoc2Nyb2xsV2lkdGggLyBjb250ZW50V2lkdGgpLFxuICAgIGhlaWdodDogaXNWZXJ0aWNhbCA/IHNjcm9sbEhlaWdodCAqIChzY3JvbGxIZWlnaHQgLyBjb250ZW50SGVpZ2h0KSA6IHdpZHRoLFxuICAgIGxlZnQ6IGlzVmVydGljYWwgPyBzY3JvbGxXaWR0aCAtIHdpZHRoIDogMCxcbiAgICB0b3A6IGlzVmVydGljYWwgPyAwIDogc2Nyb2xsSGVpZ2h0IC0gd2lkdGgsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoZWNrTmVlZEhpZGVTY3JvbGxCYXIoZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIHJldHVybiAhIShkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCAmJiBkaW1lbnNpb25zLm1heFNjcm9sbFRvcCA9PT0gMFxuICAgIHx8IGRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxMZWZ0ID09PSAwKTtcbn1cblxuLyoqXG4gKiDmu5rliqjnu4Tku7bnmoTmu5rliqjmnaHnu4Tku7bvvIzmu5rliqjmnaHmnKzouqvkuZ/mmK9MYXlvdXTnmoTkuIDkuKroioLngrlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsQmFyIGV4dGVuZHMgVmlldyB7XG4gIC8vIOW9k+WJjea7muWKqOadoeaYr+WxnuS6juaoquWQkei/mOaYr+e6teWQkVxuICBwdWJsaWMgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG5cbiAgcHVibGljIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuS4gOauteaXtumXtOWQjuiHquWKqOmakOiXj1xuICBwdWJsaWMgYXV0b0hpZGUgPSB0cnVlO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuiHquWKqOmakOiXj+aXtumXtFxuICBwdWJsaWMgYXV0b0hpZGVUaW1lID0gMjAwMDtcblxuICBwdWJsaWMgYXV0b0hpZGVEZWxheVRpbWUgPSAxNTAwO1xuXG4gIHByaXZhdGUgYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gMDtcblxuICBwcml2YXRlIGlubmVyV2lkdGggPSAxNjtcblxuICBwcml2YXRlIGlzSGlkZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY3VyckxlZnQgPSAwO1xuICBwcml2YXRlIGN1cnJUb3AgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBkaXJlY3Rpb24sXG4gICAgZGltZW5zaW9ucyxcbiAgICBiYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgxNjIsIDE2MiwgMTYyLCAxKScsXG4gICAgd2lkdGggPSAxNixcbiAgfTogSVNjcm9sbEJhck9wdGlvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3JkZXJSYWRpdXM6IHdpZHRoIC8gMixcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgfSwgdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh3aWR0aCwgZGlyZWN0aW9uLCBkaW1lbnNpb25zKSk7XG5cbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgdGhpcy5pbm5lcldpZHRoID0gd2lkdGg7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcihkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmu5rliqjmnaHnmoTnspfnu4bvvIzlm6DkuLropoHlhbzlrrnmqKrnq5bmu5rliqjvvIzmiYDku6Ugc3R5bGUud2lkdGgg5Zyo5LiN5ZCM5qih5byP5LiL5Luj6KGo55qE5oSP5oCd5LiN5LiA5qC3XG4gICAqIOWboOatpOmAmui/h+WNleeLrOeahCB3aWR0aCDlsZ7mgKfmnaXku6Pooajmu5rliqjmnaHnmoTnspfnu4ZcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyV2lkdGgpIHtcbiAgICAgIHRoaXMuaW5uZXJXaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gdGhpcy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLnNldERpbWVuc2lvbnModGhpcy5kaW1lbnNpb25zKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF06IHBsZWFzZSBzZXQgcm9vdCBmb3Igc2Nyb2xsYmFyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlLCB0cnVlKTtcblxuICAgICAgdGhpcy5yb290Lm9uKCdiZWZvcmVfcmVmbG93JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUodGhpcy5jdXJyTGVmdCwgdGhpcy5jdXJyVG9wKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmlzSGlkZSA9IHRydWU7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5pc0hpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIOagueaNriBTY3JvbGxWaWV3IOWuueWZqOWuvemrmOWSjOWunumZheWGheWuueWuvemrmOWGs+Wumua7muWKqOadoeeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgKiDkvYbmoLjlv4PpnIDopoHogIPomZHnmoTmg4XlhrXmmK/vvJpcbiAgICogMS4g5Zyo5LiN5pat5ZywIHJlZmxvdyDov4fnqIvkuK3vvIxTY3JvbGxCYXIg5Lmf5Lya5a2Y5Zyo6ZyA6KaB5YiH5o2i5bGV56S65ZKM6ZqQ6JeP55qE5oOF5Ya1XG4gICAqIDIuIHJlZmxvdyDkuYvlkI7vvIxTY3JvbGxCYXIg55qE5L2N572u5LiN5piv566A5Y2V55qE6K6+572u5Li6IFNjcm9sbFZpZXcg6aG26YOo5ZKM5bem6L6577yM6L+Y5Y+v6IO95piv5rua5Yqo5LqG5LiA5q616Led56a75ZCO5omn6KGM55qEIHJlZmxvd1xuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh0aGlzLndpZHRoLCB0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucyk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHN0eWxlKTtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKHRoaXMuZGlyZWN0aW9uLCBkaW1lbnNpb25zKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSGlkZSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcblxuICAgIC8vIOW3sue7j+a7muWKqOi/h+S4gOautei3neemu+eahOaDheWGte+8jOmHjeaWsOiuoeeul+aWsOeahOa7muWKqOS9jee9rlxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUoZGltZW5zaW9ucy5zY3JvbGxMZWZ0LCBkaW1lbnNpb25zLnNjcm9sbFRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZSArIHRoaXMuYXV0b0hpZGVEZWxheVRpbWU7XG4gIH1cblxuICBjYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIGNvbnN0IGNhblNjcm9sbFBlcmNlbnQgPSAxIC0gdGhpcy5kaW1lbnNpb25zLmhlaWdodCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50SGVpZ2h0O1xuXG4gICAgICAvLyDmu5rliqjmnaHmnIDlpKfmu5rliqjpq5jluqZcbiAgICAgIGNvbnN0IHNjcm9sbEJhck1heFNjcm9sbFRvcCA9IHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgKiBjYW5TY3JvbGxQZXJjZW50O1xuXG4gICAgICBjb25zdCBwZXJjZW50ID0gdG9wIC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbFRvcDtcbiAgICAgIGNvbnN0IHBlcmNlbnRUb3AgPSBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgKiBwZXJjZW50O1xuXG4gICAgICBzY3JvbGxUb3AgPSBjbGFtcChwZXJjZW50VG9wLCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxUb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy53aWR0aCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50V2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ID0gdGhpcy5kaW1lbnNpb25zLndpZHRoICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IGxlZnQgLyB0aGlzLmRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdDtcblxuICAgICAgc2Nyb2xsTGVmdCA9IGNsYW1wKHNjcm9sbEJhck1heFNjcm9sbExlZnQgKiBwZXJjZW50LCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfTtcbiAgfVxuXG4gIG9uU2Nyb2xsKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJMZWZ0ID0gbGVmdDtcbiAgICB0aGlzLmN1cnJUb3AgPSB0b3A7XG4gIFxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUobGVmdCwgdG9wKTtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVkgPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZICsgc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVggPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYICsgc2Nyb2xsTGVmdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xuICAgICAgLy8gdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZTtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUsIHRydWUpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZSA9IChkdDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKCF0aGlzLmF1dG9IaWRlIHx8IHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IDAgfHwgdGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAtPSBkdDtcblxuICAgIGlmICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSB0aGlzLmF1dG9IaWRlVGltZSkge1xuICAgICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSBNYXRoLm1heCgwLCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSk7XG4gICAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyICogKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC8gdGhpcy5hdXRvSGlkZVRpbWUpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY29weVRvdWNoQXJyYXkgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgU2Nyb2xsZXIgZnJvbSAnLi4vbGlicy9zY3JvbGxlci9pbmRleC5qcydcbmltcG9ydCB7IGl0ZXJhdGVUcmVlIH0gZnJvbSAnLi4vY29tbW9uL3ZkJztcbmltcG9ydCBFbGVtZW50LCB7IHNldERpcnR5IH0gZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBTY3JvbGxCYXIsIHsgU2Nyb2xsQmFyRGlyZWN0aW9uIH0gZnJvbSAnLi9zY3JvbGxiYXInO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IGRwciA9IGVudi5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBJSW5uZXJTY3JvbGxlck9wdGlvbiB7XG4gIHNjcm9sbGluZ1g/OiBib29sZWFuO1xuICBzY3JvbGxpbmdZPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgcHVibGljIHNjcm9sbFRvcCA9IDA7XG4gIHB1YmxpYyBzY3JvbGxMZWZ0ID0gMDtcbiAgcHVibGljIGhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICBwdWJsaWMgY3VycmVudEV2ZW50ID0gbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnU2Nyb2xsVmlldyc7XG5cbiAgcHJpdmF0ZSBzY3JvbGxZUHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbm5lclNjcm9sbGVyT3B0aW9uOiBJSW5uZXJTY3JvbGxlck9wdGlvbjtcblxuICBwcml2YXRlIHNjcm9sbGVyT2JqPzogU2Nyb2xsZXI7XG4gIHByaXZhdGUgaXNGaXJzdFNjcm9sbD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB2ZXJ0aXZhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaG9yaXpvbnRhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgc2Nyb2xsWCxcbiAgICBzY3JvbGxZLFxuICAgIGRhdGFzZXQsXG4gIH06IElTY3JvbGxWaWV3T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWROYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGl0ZW06IEVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgaXRlbS5sYXlvdXRCb3gudG9wICsgaXRlbS5sYXlvdXRCb3guaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWF4SGVpZ2h0O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhXaWR0aCA9IE1hdGgubWF4KG1heFdpZHRoLCBpdGVtLmxheW91dEJveC5sZWZ0ICsgaXRlbS5sYXlvdXRCb3gud2lkdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1heFdpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbygwLCB0aGlzLnNjcm9sbFRvcCwgdHJ1ZSwgMSk7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6IHZhbHVlLFxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gIH1cblxuICBnZXQgc2Nyb2xsWSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1k7XG4gIH1cblxuICBzZXQgc2Nyb2xsWSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5zY3JvbGxZKSB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyh0aGlzLnNjcm9sbExlZnQsIDAsIHRydWUsIDEpO1xuICAgICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNjcm9sbGVyT2JqICYmIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgaWYgKCEodHJlZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgIHRyZWUucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5yZWN0KHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBhYnNvbHV0ZVgsIGFic29sdXRlWSB9ID0gY2hpbGQubGF5b3V0Qm94O1xuXG4gICAgICAvLyDliKTmlq3lpITkuo7lj6/op4bnqpflj6PlhoXnmoTlrZDoioLngrnvvIzpgJLlvZLmuLLmn5Por6XlrZDoioLngrlcbiAgICAgIGlmIChhYnNvbHV0ZVkgKyBoZWlnaHQgPj0gc3RhcnRZICYmIGFic29sdXRlWSA8PSBlbmRZXG4gICAgICAgICYmIGFic29sdXRlWCArIHdpZHRoID49IHN0YXJ0WCAmJiBhYnNvbHV0ZVggPD0gZW5kWCkge1xuICAgICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIOS4iumdoueahOa4suafk+W6lOivpeWFiOi3s+i/h+a7muWKqOadoe+8jOWQpuWImeWPr+iDveWHuueOsOa4suafk+mhuuW6j+mXrumimO+8jFNjcm9sbFZpZXfnmoToioLngrnlj43ogIzmiormu5rliqjmnaHnm5bkvY/kuoZcbiAgICB0aGlzLnZlcnRpdmFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcbiAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/LnJlbmRlcigpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgIShlbGUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5b2T5omn6KGMcmVmbG935LmL5ZCO77yM5rua5Yqo5YiX6KGo55qE6auY5bqm5Y+v6IO95Y+R55Sf5LqG5Y+Y5YyW77yM5rua5Yqo5p2h5Lmf6ZyA6KaB5ZCM5q2l6L+b6KGM5pu05pawXG4gICAqL1xuICB1cGRhdGVTY3JvbGxCYXIoc2Nyb2xsUHJvcDogc3RyaW5nLCBzY3JvbGxCYXJOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICBjb250ZW50V2lkdGg6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoLFxuICAgICAgY29udGVudEhlaWdodDogdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0LFxuICAgICAgbWF4U2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgbWF4U2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX21heFNjcm9sbFRvcCxcblxuICAgICAgc2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbFRvcCxcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlU2Nyb2xsQmFyJywgSlNPTi5zdHJpbmdpZnkoZGltZW5zaW9ucykpXG5cbiAgICAvLyDpnZ7nrKzkuIDmrKHliJvlu7rnmoTmg4XlhrXvvIzkuIDoiKzmmK8gcmVmbG93IOaJp+ihjOWIsOi/memHjFxuICAgIGlmICh0aGlzW3Njcm9sbFByb3AgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddLnNldERpbWVuc2lvbnMoZGltZW5zaW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFyKHtcbiAgICAgICAgICBkaW1lbnNpb25zLFxuICAgICAgICAgIGRpcmVjdGlvbjogc2Nyb2xsUHJvcCA9PT0gJ3Njcm9sbFknID8gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsIDogU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuYXBwZW5kQ2hpbGQoc2Nyb2xsYmFyKTtcbiAgICAgICAgc2Nyb2xsQmFyLnJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHNjcm9sbEJhci5pbml0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2Nyb2xsQmFyLmluc2VydCh0aGlzLnJvb3QucmVuZGVyQ29udGV4dCwgdHJ1ZSk7XG4gICAgICAgIHNjcm9sbEJhci5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuICAgICAgICB0aGlzLmFkZChzY3JvbGxCYXIpO1xuXG4gICAgICAgIHNldERpcnR5KHNjcm9sbEJhciwgJ2FwcGVuZFRvU2Nyb2xsVmlldycpXG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdID0gc2Nyb2xsQmFyO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXT8ub25TY3JvbGwodGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LCB0aGlzLnNjcm9sbGVyT2JqIS5fX3NjaGVkdWxlZFRvcCk7XG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPkuI3lho3pnIDopoHnurXlkJHmu5rliqjnmoTml7blgJnplIDmr4HnurXlkJHmu5rliqjmnaFcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddO1xuICAgICAgICBzY3JvbGxCYXIucmVtb3ZlKCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95KCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95U2VsZigpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDoh6rliqjlvIDlkK8gc2Nyb2xsWWApO1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6L+Z6YeM5LmL5omA5Lul6KaB5bu26L+f5LiA5bin5piv5Zug5Li66L+Z6YeM55qE5Y+Y5Yqo5p2l6IeqIHJlZmxvdyDkuYvlkI7vvIzmraPlnKjlgZogcmVmbG93IOS5i+WQjueahOWQjue7reS6i+aDhVxuICAgICAgICAgKiDlpoLmnpznq4vljbPkv67mlLnmu5rliqjmnaHnmoTmoLflvI/vvIzlrp7pmYXkuIrlubbkuI3kvJrnlJ/mlYjjgIJcbiAgICAgICAgICovXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxvdyDkuYvlkI7vvIzkvJrku44gY3NzbGF5b3V0IOWQjOatpeW4g+WxgOS/oeaBr++8jOWOn+WFiOeahOa7muWKqOS/oeaBr+S8muS4ouWkse+8jOi/memHjOmcgOimgeS4gOS4quWkjeS9jeeahOaTjeS9nFxuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRoaXMuc2Nyb2xsVG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gdHJ1ZTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnModGhpcy5sYXlvdXRCb3gud2lkdGgsIHRoaXMubGF5b3V0Qm94LmhlaWdodCwgdGhpcy5zY3JvbGxXaWR0aCwgdGhpcy5zY3JvbGxIZWlnaHQpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG4gICdvcGFjaXR5JyxcbiAgJ3RyYW5zZm9ybScsXG4gICd0ZXh0U3Ryb2tlQ29sb3InLFxuICAndGV4dFN0cm9rZVdpZHRoJyxcbiAgJ3RleHRTaGFkb3cnLFxuXTtcblxuY29uc3QgYWxsU3R5bGVzID0gcmVmbG93QWZmZWN0ZWRTdHlsZXMuY29uY2F0KHJlcGFpbnRBZmZlY3RlZFN0eWxlcyk7XG5cbmludGVyZmFjZSBJU3R5bGUge1xuICAvLyByZWZsb3dBZmZlY3RlZFN0eWxlc1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgbWluSGVpZ2h0PzogbnVtYmVyO1xuICBtYXhXaWR0aD86IG51bWJlcjtcbiAgbWF4SGVpZ2h0PzogbnVtYmVyO1xuICBsZWZ0PzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgdG9wPzogbnVtYmVyO1xuICBib3R0b20/OiBudW1iZXI7XG4gIG1hcmdpbj86IG51bWJlcjtcbiAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gIG1hcmdpblRvcD86IG51bWJlcjtcbiAgbWFyZ2luQm90dG9tPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nQm90dG9tPzogbnVtYmVyO1xuICBib3JkZXJXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyTGVmdFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJSaWdodFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJUb3BXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tV2lkdGg/OiBudW1iZXI7XG5cbiAgYm9yZGVyVG9wTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuXG4gIGZsZXhEaXJlY3Rpb24/OiAnY29sdW1uJyB8ICdyb3cnO1xuICBmbGV4U2hyaW5rPzogbnVtYmVyO1xuICBmbGV4R3Jvdz86IG51bWJlcjtcbiAgZmxleFdyYXA/OiAnd3JhcCcgfCAnbm93cmFwJztcbiAganVzdGlmeUNvbnRlbnQ/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3BhY2UtYmV0d2VlbicgfCAnc3BhY2UtYXJvdW5kJztcbiAgYWxpZ25JdGVtcz86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgYWxpZ25TZWxmPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBwb3NpdGlvbj86IHN0cmluZztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcblxuICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG5cbiAgLy8g5paH5a2X5o+P6L6555qE5a695bqm77yM6buY6K6k5LiN5o+P6L65XG4gIHRleHRTdHJva2VXaWR0aD86IG51bWJlcjtcbiAgLy8g5paH5a2X5o+P6L6555qE6aKc6Imy77yM5aaC5p6c5oyH5a6a5LqG5o+P6L656aKc6Imy5L2G5piv5rKh5pyJ5oyH5a6a5o+P6L655a695bqm77yM5o+P6L655a695bqm6buY6K6k6K6+572u5Li6MVxuICB0ZXh0U3Ryb2tlQ29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOaWh+Wtl+mYtOW9seaViOaenO+8jHRleHRTaGFkb3fnmoTmoLzlvI/lubbkuI3mmK/kuKXmoLznmoRDU1PmoLzlvI/vvIzku4XmlK/mjIHkuKTnp43moLzlvI9cbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcGlua1xuICAgKiB0ZXh0U2hhZG93OiAxcHggMXB4IDJweCByZWQsIDAgMCAxcHggYmx1ZSwgMCAwIDFweCBibHVlLCAxcHggMXB4IDJweCByZWRcbiAgICog5Lmf5bCx5piv5pSv5oyB5Lu75oSP5pWw6YeP55qE6Zi05b2x5pWI5p6c77yM5q+P5Liq6Zi05b2x5pWI5p6c55Sx5Zub5Liq5YC85oyH5a6a77yM5YiG5Yir5pivIHNoYWRvd09mZnNldFgsIHNoYWRvd09mZnNldFksIHNoYWRvd0JsdXIsIHNoYWRvd0NvbG9yXG4gICAqL1xuICB0ZXh0U2hhZG93Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9O1xuIiwiXG5mdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXM6IG51bWJlcikge1xuICByZXR1cm4gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XG59XG5cbi8vIOaXi+i9rOeahOato+WImeihqOi+vuW8j1xuY29uc3Qgcm90YXRlUmVnID0gL3JvdGF0ZVxcKChcXGQrKWRlZ1xcKS87XG5cbi8vIOiDjOaZr+Wbvuato+WImeihqOi+vuW8j1xuY29uc3QgaXNWYWxpZFVybFByb3BSZWcgPSAvXFxzKnVybFxcKCguKj8pXFwpXFxzKi87XG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVQYXJzZXIodmFsOiBzdHJpbmcpIHtcbiAgY29uc3QgbWF0Y2ggPSB2YWwubWF0Y2gocm90YXRlUmVnKTtcblxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZGVncmVlc1RvUmFkaWFucyhwYXJzZUludChtYXRjaFsxXSkpO1xuICB9XG5cbiAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dmFsfSBpcyBub3QgYSB2YWxpZCB0cmFuc2Zvcm0gcm90YXRlYCk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIOino+aekOiDjOaZr+WbvueJh1xuZXhwb3J0IGZ1bmN0aW9uIGJhY2tncm91bmRJbWFnZVBhcnNlcih2YWw6IHN0cmluZykge1xuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBsaXN0ID0gdmFsLm1hdGNoKGlzVmFsaWRVcmxQcm9wUmVnKTtcblxuICAgIGlmIChsaXN0KSB7XG4gICAgICBjb25zdCB1cmwgPSBsaXN0WzFdLnJlcGxhY2UoLygnfFwiKS9nLCAnJyk7XG5cbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dmFsfSBpcyBub3QgYSB2YWxpZCBiYWNrZ3JvdW5kSW1hZ2VgKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgdGV4dFNoYWRvd1JlZyA9IC9eKFxcZCtweFxccyl7Mn1cXGQrcHhcXHNbYS16QS1aXSsoLFxccyooXFxkK3B4XFxzKXsyfVxcZCtweFxcc1thLXpBLVpdKykqJC87XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdzogc3RyaW5nKSB7XG4gIHJldHVybiB0ZXh0U2hhZG93UmVnLnRlc3QodGV4dFNoYWRvdyk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gIC8vIOS9v+eUqOato+WImeihqOi+vuW8j+mqjOivgeaVsOWtl+aIlumAl+WPt+WIhumalOeahOaVsOWtl++8jOWQjumdouWPr+S7pei3n+WPr+mAieeahOinkuW6puWNleS9je+8iGRlZ++8iVxuICByZXR1cm4gL14oLT9cXGQrKFxcLlxcZCspPykoZGVnKT8oLFxccyooLT9cXGQrKFxcLlxcZCspPykoZGVnKT8pKiQvLnRlc3QodmFsdWUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZW5kZXJGb3JMYXlvdXQge1xuICByb3RhdGU/OiBudW1iZXI7IC8vIHRyYW5zZm9ybSByb3RhdGXop6PmnpDkuYvlkI7lvpfliLDnmoTlvKfluqbliLZcbiAgc2NhbGVYPzogbnVtYmVyO1xuICBzY2FsZVk/OiBudW1iZXI7XG59XG5cblxuY29uc3QgdHJhbnNmb3JtUmVnZXggPSAvKFxcdyspXFwoKFteKV0rKVxcKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gIC8vIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAvLyByb3RhdGU6IDAsXG4gICAgLy8gc2NhbGVYOiAxLFxuICAgIC8vIHNjYWxlWTogMSxcbiAgICAvLyB0cmFuc2xhdGVYOiAwLFxuICAgIC8vIHRyYW5zbGF0ZVk6IDAsXG4gIC8vIH07XG5cbiAgY29uc3QgcmVzdWx0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgbGV0IG1hdGNoO1xuXG4gIHdoaWxlICgobWF0Y2ggPSB0cmFuc2Zvcm1SZWdleC5leGVjKHRyYW5zZm9ybSkpKSB7XG4gICAgY29uc3QgWywgbmFtZSwgdmFsdWVdID0gbWF0Y2g7XG5cbiAgICBpZiAoIWlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgW0xheW91dF06IGludmFsaWQgdmFsdWUgZm9yICR7bmFtZX06ICR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVzID0gdmFsdWVcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKCh2YWwpID0+IHZhbC50cmltKCkucmVwbGFjZSgnZGVnJywgJycpKVxuICAgICAgLm1hcChOdW1iZXIpO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICByZXN1bHQucm90YXRlID0gZGVncmVlc1RvUmFkaWFucyh2YWx1ZXNbMF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgcmVzdWx0LnNjYWxlWCA9IHZhbHVlc1swXTtcbiAgICAgICAgcmVzdWx0LnNjYWxlWSA9IHZhbHVlc1sxXSB8fCB2YWx1ZXNbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY2FzZSAndHJhbnNsYXRlJzpcbiAgICAgIC8vICAgcmVzdWx0LnRyYW5zbGF0ZVggPSB2YWx1ZXNbMF07XG4gICAgICAvLyAgIHJlc3VsdC50cmFuc2xhdGVZID0gdmFsdWVzWzFdIHx8IDA7XG4gICAgICAvLyAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxucGFyc2VUcmFuc2Zvcm0oJ3JvdGF0ZSg0NSknKTtcbnBhcnNlVHJhbnNmb3JtKCdyb3RhdGUoMzYwZGVnKScpO1xucGFyc2VUcmFuc2Zvcm0oJ3h4eHgnKTtcbnBhcnNlVHJhbnNmb3JtKCdzY2FsZSgzLDQpJyk7IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnc2Fucy1zZXJpZic7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG5cbmNvbnN0IGdldENvbnRleHQgPSAoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0+IHtcbiAgaWYgKGNvbnRleHQpIHtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIGNvbnN0IGNhbnZhcyA9IGVudi5jcmVhdGVDYW52YXMoKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IDE7XG4gIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmludGVyZmFjZSBJVGV4dFByb3BzIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJVGV4dFNoYWRvdyB7XG4gIG9mZnNldFg6IG51bWJlcjtcbiAgb2Zmc2V0WTogbnVtYmVyO1xuICBibHVyUmFkaXVzOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSB2YWx1ZXNyYyA9ICcnO1xuICBwcml2YXRlIG9yaWdpblN0eWxlV2lkdGg6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuICBwdWJsaWMgdGV4dEJhc2VsaW5lOiBDYW52YXNUZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcbiAgcHVibGljIGZvbnQgPSAnJztcbiAgcHVibGljIHRleHRBbGlnbjogQ2FudmFzVGV4dEFsaWduID0gJ2xlZnQnO1xuICBwdWJsaWMgZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuXG4gIHB1YmxpYyB0ZXh0U2hhZG93cyE6IG51bGwgfCBJVGV4dFNoYWRvd1tdO1xuICBcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVGV4dFByb3BzKSB7XG4gICAgbGV0IG9yaWdpblN0eWxlV2lkdGggPSBzdHlsZS53aWR0aDtcbiAgICAvLyDmsqHmnInorr7nva7lrr3luqbnmoTml7blgJnpgJrov4djYW52YXPorqHnrpflh7rmloflrZflrr3luqZcbiAgICBpZiAob3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlVGV4dChzdHlsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgfHwgc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdUZXh0JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuICAgIHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9IG9yaWdpblN0eWxlV2lkdGg7XG5cbiAgICBpZiAoc3R5bGUudGV4dFNoYWRvdykge1xuICAgICAgdGhpcy5wYXJzZVRleHRTaGFkb3coc3R5bGUudGV4dFNoYWRvdyk7XG4gICAgfVxuICB9XG5cbiAgc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3A6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgICBpZiAocHJvcCA9PT0gJ3RleHRTaGFkb3cnKSB7XG4gICAgICB0aGlzLnBhcnNlVGV4dFNoYWRvdyh2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICAgIC8vIGlmICghaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdykpIHtcbiAgICAvLyAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3RleHRTaGFkb3d9IGlzIG5vdCBhIHZhbGlkIHRleHRTaGFkb3dgKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8g6Kej5p6QIHRleHQtc2hhZG93IOWtl+espuS4slxuICAgICAgdGhpcy50ZXh0U2hhZG93cyA9IHRleHRTaGFkb3cuc3BsaXQoJywnKS5tYXAoc2hhZG93ID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBzaGFkb3cudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBwYXJzZUZsb2F0KHBhcnRzWzBdKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHBhcnNlRmxvYXQocGFydHNbMV0pO1xuICAgICAgICBjb25zdCBibHVyUmFkaXVzID0gcGFyc2VGbG9hdChwYXJ0c1syXSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gcGFydHNbM107XG5cbiAgICAgICAgcmV0dXJuIHsgb2Zmc2V0WCwgb2Zmc2V0WSwgYmx1clJhZGl1cywgY29sb3IgfTtcbiAgICAgIH0pO1xuICAgIC8vIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgaWYgKHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgICBuZXdWYWx1ZSA9IHBhcnNlVGV4dCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIGxldCB7IHBhcmVudCB9ID0gdGhpcztcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvQ2FudmFzRGF0YSgpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG5cbiAgICB0aGlzLmZvbnRTaXplID0gc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB0aGlzLmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICcnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7c3R5bGUuZm9udEZhbWlseSB8fCBERUZBVUxUX0ZPTlRfRkFNSUxZfWA7XG4gICAgdGhpcy50ZXh0QWxpZ24gPSBzdHlsZS50ZXh0QWxpZ24gfHwgJ2xlZnQnO1xuICAgIHRoaXMuZmlsbFN0eWxlID0gc3R5bGUuY29sb3IgfHwgJyMwMDAnO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIGluc2VydChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgbGV0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoJ3Rlc3QnKTtcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gdGhpcy50ZXh0QmFzZWxpbmU7XG4gICAgY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgY3R4LnRleHRBbGlnbiA9IHRoaXMudGV4dEFsaWduO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG5cbiAgICBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBkcmF3WCArPSB3aWR0aCAvIDI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgZHJhd1ggKz0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIC8vIOe6ueeQhuaWh+Wtl+aPj+i+uVxuICAgIGlmIChzdHlsZS50ZXh0U3Ryb2tlQ29sb3IpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS50ZXh0U3Ryb2tlV2lkdGggfHwgMTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLnRleHRTdHJva2VDb2xvciBhcyBzdHJpbmc7XG5cbiAgICAgIGN0eC5zdHJva2VUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8g5aSE55CG5paH5a2X6Zi05b2xXG4gICAgaWYgKHRoaXMudGV4dFNoYWRvd3MpIHtcbiAgICAgIHRoaXMudGV4dFNoYWRvd3MuZm9yRWFjaCgoeyBvZmZzZXRYLCBvZmZzZXRZLCBibHVyUmFkaXVzLCBjb2xvciB9KSA9PiB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gb2Zmc2V0WDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBvZmZzZXRZO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IGJsdXJSYWRpdXM7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IGNvbG9yO1xuICAgICAgICBjdHguZmlsbFRleHQoXG4gICAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCB0aGlzLnZhbHVlLFxuICAgICAgLy8gICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAvLyAgIGRyYXdZIC0gb3JpZ2luWSwpXG4gICAgICBjdHguZmlsbFRleHQoXG4gICAgICAgIHRoaXMudmFsdWUsXG4gICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgKTsgIFxuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1ZpZXcnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBHYW1lR2xvYmFsLl9fZW52ID0gR2FtZUdsb2JhbC53eCB8fCBHYW1lR2xvYmFsLnR0IHx8IEdhbWVHbG9iYWwuc3dhbjtcbn1cblxuY29uc3QgZG9tRXZlbnRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIHRvdWNoc3RhcnQ6ICdtb3VzZWRvd24nLFxuICB0b3VjaG1vdmU6ICdtb3VzZW1vdmUnLFxuICB0b3VjaGVuZDogJ21vdXNldXAnLFxuICB0b3VjaGNhbmNlbDogJ21vdXNlbGVhdmUnLFxufVxuXG5lbnVtIGV2ZW50VHlwZSB7XG4gIG9uID0gJ29uJyxcbiAgb2ZmID0gJ29mZicsXG59XG5cbmZ1bmN0aW9uIGdlbkRvbVRvdWNoRXZlbnQoZXZlbnQ6IHN0cmluZywgdHlwZTogZXZlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsaXN0ZW5lcjogQ2FsbGJhY2spIHtcbiAgICAgIHR5cGUgPT09IGV2ZW50VHlwZS5vbiA/XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSlcbiAgICAgICAgOiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE9uVG91Y2hIYW5kbGVyKGV2ZW50OiBzdHJpbmcsIHR5cGU6IGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIEdhbWVHbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIEdhbWVHbG9iYWwuX19lbnZbYCR7dHlwZX0ke2V2ZW50fWBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdlbkRvbVRvdWNoRXZlbnQoZG9tRXZlbnRNYXBbZXZlbnQudG9Mb3dlckNhc2UoKV0sIHR5cGUpO1xuICB9XG59XG5cbi8qKlxuICogTGF5b3V0IOWPr+iDveeUqOWcqOS4jeeUqOeahOW5s+WPsO+8jOiAjExheW91dOS8muS+nei1luW5s+WPsOS4i+mdoueahOS4gOS6m+aWueazleadpeWunueOsOWFt+S9k+eahOWKn+iDve+8jOavlOWmguWIm+W7uuWbvueJh1xuICog5Li65LqG5pu05aW95YGa5bmz5Y+w6YCC6YWN77yM57uf5LiA5bCB6KOFIGVudiDmqKHlnZfvvIzkuI3lkIzlubPlj7DopoHlgZrpgILphY3vvIzmm7/mjaIgZW52IOeahOWFt+S9k+aWueazleWNs+WPr1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIOebkeWQrOinpuaRuOebuOWFs+S6i+S7tlxuICBvblRvdWNoU3RhcnQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaFN0YXJ0JywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaE1vdmU6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaE1vdmUnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoRW5kOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hFbmQnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoQ2FuY2VsOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hDYW5jZWwnLCBldmVudFR5cGUub24pLFxuICAvLyDlj5bmtojnm5HlkKzop6bmkbjnm7jlhbPkuovku7ZcbiAgb2ZmVG91Y2hTdGFydDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoU3RhcnQnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hNb3ZlOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hNb3ZlJywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoRW5kOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hFbmQnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hDYW5jZWw6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaENhbmNlbCcsIGV2ZW50VHlwZS5vZmYpLFxuXG4gIC8vIExheW91dCDmlK/mjIHnmb7liIbmr5TmoLflvI/vvIzlpoLmnpzmoLnoioLngrnmoLflvI/orr7nva7kuLogMTAwJe+8jOebtOaOpeWPliBDYW52YXMg55qE5bC65a+477yM5LiN5ZCM5bmz5Y+w55qE5Y+W5rOV5LiN5LiA5qC377yM5Zug5q2k5Y2V54us5o+Q5L6b5Ye95pWwXG4gIGdldFJvb3RDYW52YXNTaXplKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnICYmIF9fZW52LmdldFNoYXJlZENhbnZhcykge1xuICAgICAgY29uc3QgY3ZzID0gX19lbnYuZ2V0U2hhcmVkQ2FudmFzKCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogY3ZzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGN2cy5oZWlnaHQsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvLyDlj5blvZPliY3orr7lpIfnmoQgZGV2aWNlUGl4ZWxSYXRpb++8jOS4jeWQjOW5s+WPsOeahOWPluazleS4jeS4gOagt1xuICBnZXREZXZpY2VQaXhlbFJhdGlvKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnICYmIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKSB7XG4gICAgICByZXR1cm4gX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMoKS5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0gZWxzZSBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcbiAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9LFxuXG4gIC8vIOWIm+W7ukNhbnZhc1xuICBjcmVhdGVDYW52YXMoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBfX2Vudi5jcmVhdGVDYW52YXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIH0sXG5cbiAgLy8g5Yib5bu65Zu+54mHXG4gIGNyZWF0ZUltYWdlKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX19lbnYuY3JlYXRlSW1hZ2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgY29udmVydFRvSnNvbiA9IGZ1bmN0aW9uKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgak9iaiA9IHtcbiAgICBuYW1lOiBub2RlLnRhZ25hbWVcbiAgfTtcblxuICAvL3doZW4gbm8gY2hpbGQgbm9kZSBvciBhdHRyIGlzIHByZXNlbnRcbiAgaWYgKCghbm9kZS5jaGlsZCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5jaGlsZCkpICYmICghbm9kZS5hdHRyc01hcCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5hdHRyc01hcCkpKSB7XG4gICAgcmV0dXJuIHV0aWwuaXNFeGlzdChub2RlLnZhbCkgJiYgISFub2RlLnZhbCA/IG5vZGUudmFsIDogak9iajtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSBjcmVhdGUgYSB0ZXh0bm9kZSBpZiBub2RlIGhhcyBzb21lIHRleHRcbiAgICBpZiAodXRpbC5pc0V4aXN0KG5vZGUudmFsKSkge1xuICAgICAgaWYgKCEodHlwZW9mIG5vZGUudmFsID09PSAnc3RyaW5nJyAmJiAobm9kZS52YWwgPT09ICcnIHx8IG5vZGUudmFsID09PSBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyKSkpIHtcbiAgICAgICAgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IFwic3RyaWN0XCIpe1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gWyBub2RlLnZhbCBdO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IG5vZGUudmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICB1dGlsLm1lcmdlKGpPYmosIG5vZGUuYXR0cnNNYXAsIG9wdGlvbnMuYXJyYXlNb2RlKTtcblxuICBqT2JqLmNoaWxkcmVuID0gW107XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCggY2hpbGQgPT4ge1xuICAgIGpPYmouY2hpbGRyZW4ucHVzaChjb252ZXJ0VG9Kc29uKGNoaWxkLCBvcHRpb25zKSlcbiAgfSk7XG5cbiAgLy9hZGQgdmFsdWVcbiAgcmV0dXJuIGpPYmo7XG59O1xuXG5leHBvcnRzLmNvbnZlcnRUb0pzb24gPSBjb252ZXJ0VG9Kc29uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBub2RlVG9Kc29uID0gcmVxdWlyZSgnLi9ub2RlMmpzb24nKTtcbmNvbnN0IHhtbFRvTm9kZW9iaiA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IHgyeG1sbm9kZSA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdG9yJyk7XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zLCB2YWxpZGF0aW9uT3B0aW9uKSB7XG4gICBpZiggdmFsaWRhdGlvbk9wdGlvbil7XG4gICAgIGlmKHZhbGlkYXRpb25PcHRpb24gPT09IHRydWUpIHZhbGlkYXRpb25PcHRpb24gPSB7fVxuXG4gICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRvci52YWxpZGF0ZSh4bWxEYXRhLCB2YWxpZGF0aW9uT3B0aW9uKTtcbiAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgIHRocm93IEVycm9yKCByZXN1bHQuZXJyLm1zZylcbiAgICAgfVxuICAgfVxuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIHgyeG1sbm9kZS5kZWZhdWx0T3B0aW9ucywgeDJ4bWxub2RlLnByb3BzKTtcbiAgcmV0dXJuIG5vZGVUb0pzb24uY29udmVydFRvSnNvbih4bWxUb05vZGVvYmouZ2V0VHJhdmVyc2FsT2JqKHhtbERhdGEsIG9wdGlvbnMpLCBvcHRpb25zKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZ2V0QWxsTWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHdoaWxlIChtYXRjaCkge1xuICAgIGNvbnN0IGFsbG1hdGNoZXMgPSBbXTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgYWxsbWF0Y2hlcy5wdXNoKG1hdGNoW2luZGV4XSk7XG4gICAgfVxuICAgIG1hdGNoZXMucHVzaChhbGxtYXRjaGVzKTtcbiAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbmNvbnN0IGRvZXNNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHJldHVybiAhKG1hdGNoID09PSBudWxsIHx8IHR5cGVvZiBtYXRjaCA9PT0gJ3VuZGVmaW5lZCcpO1xufTtcblxuY29uc3QgZG9lc05vdE1hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICByZXR1cm4gIWRvZXNNYXRjaChzdHJpbmcsIHJlZ2V4KTtcbn07XG5cbmV4cG9ydHMuaXNFeGlzdCA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJztcbn07XG5cbmV4cG9ydHMuaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG4vKipcbiAqIENvcHkgYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGEgaW50byBiLlxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEBwYXJhbSB7Kn0gYVxuICovXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBhLCBhcnJheU1vZGUpIHtcbiAgaWYgKGEpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYSk7IC8vIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIG93biBwcm9wZXJ0aWVzXG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZihhcnJheU1vZGUgPT09ICdzdHJpY3QnKXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gWyBhW2tleXNbaV1dIF07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gYVtrZXlzW2ldXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4vKiBleHBvcnRzLm1lcmdlID1mdW5jdGlvbiAoYixhKXtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYixhKTtcbn0gKi9cblxuZXhwb3J0cy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgaWYgKGV4cG9ydHMuaXNFeGlzdCh2KSkge1xuICAgIHJldHVybiB2O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLy8gY29uc3QgZmFrZUNhbGwgPSBmdW5jdGlvbihhKSB7cmV0dXJuIGE7fTtcbi8vIGNvbnN0IGZha2VDYWxsTm9SZXR1cm4gPSBmdW5jdGlvbigpIHt9O1xuXG5leHBvcnRzLmJ1aWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcykge1xuICB2YXIgbmV3T3B0aW9ucyA9IHt9O1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gZGVmYXVsdE9wdGlvbnM7IC8vaWYgdGhlcmUgYXJlIG5vdCBvcHRpb25zXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9wdGlvbnNbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gb3B0aW9uc1twcm9wc1tpXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gZGVmYXVsdE9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3T3B0aW9ucztcbn07XG5cbmV4cG9ydHMuZG9lc01hdGNoID0gZG9lc01hdGNoO1xuZXhwb3J0cy5kb2VzTm90TWF0Y2ggPSBkb2VzTm90TWF0Y2g7XG5leHBvcnRzLmdldEFsbE1hdGNoZXMgPSBnZXRBbGxNYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9BIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIGxvY2FsZVJhbmdlOiAnYS16QS1aJyxcbn07XG5cbmNvbnN0IHByb3BzID0gWydhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJywgJ2xvY2FsZVJhbmdlJ107XG5cbi8vY29uc3QgdGFnc1BhdHRlcm4gPSBuZXcgUmVnRXhwKFwiPFxcXFwvPyhbXFxcXHc6XFxcXC1fXFwuXSspXFxcXHMqXFwvPz5cIixcImdcIik7XG5leHBvcnRzLnZhbGlkYXRlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gdXRpbC5idWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcblxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sXCJcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKF5cXHMqPFxcP3htbC4qP1xcPz4pL2csXCJcIik7Ly9SZW1vdmUgWE1MIHN0YXJ0aW5nIHRhZ1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyg8IURPQ1RZUEVbXFxzXFx3XFxcIlxcLlxcL1xcLVxcOl0rKFxcWy4qXFxdKSpcXHMqPikvZyxcIlwiKTsvL1JlbW92ZSBET0NUWVBFXG5cbiAgY29uc3QgdGFncyA9IFtdO1xuICBsZXQgdGFnRm91bmQgPSBmYWxzZTtcbiAgaWYgKHhtbERhdGFbMF0gPT09ICdcXHVmZWZmJykge1xuICAgIC8vIGNoZWNrIGZvciBieXRlIG9yZGVyIG1hcmsgKEJPTSlcbiAgICB4bWxEYXRhID0geG1sRGF0YS5zdWJzdHIoMSk7XG4gIH1cbiAgY29uc3QgcmVneEF0dHJOYW1lID0gbmV3IFJlZ0V4cCgnXltfd11bXFxcXHdcXFxcLS46XSokJy5yZXBsYWNlKCdfdycsICdfJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgY29uc3QgcmVneFRhZ05hbWUgPSBuZXcgUmVnRXhwKCdeKFt3XXxfKVtcXFxcdy5cXFxcLV86XSonLnJlcGxhY2UoJyhbdycsICcoWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgIC8vc3RhcnRpbmcgb2YgdGFnXG4gICAgICAvL3JlYWQgdW50aWwgeW91IHJlYWNoIHRvICc+JyBhdm9pZGluZyBhbnkgJz4nIGluIGF0dHJpYnV0ZSB2YWx1ZVxuXG4gICAgICBpKys7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJz8nKSB7XG4gICAgICAgIGkgPSByZWFkUEkoeG1sRGF0YSwgKytpKTtcbiAgICAgICAgaWYgKGkuZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJyEnKSB7XG4gICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjbG9zaW5nVGFnID0gZmFsc2U7XG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLycpIHtcbiAgICAgICAgICAvL2Nsb3NpbmcgdGFnXG4gICAgICAgICAgY2xvc2luZ1RhZyA9IHRydWU7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVhZCB0YWduYW1lXG4gICAgICAgIGxldCB0YWdOYW1lID0gJyc7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgO1xuICAgICAgICAgIGkgPCB4bWxEYXRhLmxlbmd0aCAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICc+JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICcgJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHQnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcbicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxyJztcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFnTmFtZSArPSB4bWxEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRyaW0oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0YWdOYW1lKTtcblxuICAgICAgICBpZiAodGFnTmFtZVt0YWdOYW1lLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWcgd2l0aG91dCBhdHRyaWJ1dGVzXG4gICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUuc3Vic3RyaW5nKDAsIHRhZ05hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0ZVRhZ05hbWUodGFnTmFtZSwgcmVneFRhZ05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ1RhZyAnICsgdGFnTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdBdHRyaWJ1dGVzIGZvciBcIicgKyB0YWdOYW1lICsgJ1wiIGhhdmUgb3BlbiBxdW90ZS4nfX07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF0dHJTdHIgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGkgPSByZXN1bHQuaW5kZXg7XG5cbiAgICAgICAgaWYgKGF0dHJTdHJbYXR0clN0ci5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgYXR0clN0ciA9IGF0dHJTdHIuc3Vic3RyaW5nKDAsIGF0dHJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vY29udGludWU7IC8vdGV4dCBtYXkgcHJlc2VudHMgYWZ0ZXIgc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xvc2luZ1RhZykge1xuICAgICAgICAgIGlmKCFyZXN1bHQudGFnQ2xvc2VkKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBkb24ndCBoYXZlIHByb3BlciBjbG9zaW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfWVsc2UgaWYgKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBjYW4ndCBoYXZlIGF0dHJpYnV0ZXMgb3IgaW52YWxpZCBzdGFydGluZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdGcgPSB0YWdzLnBvcCgpO1xuICAgICAgICAgICAgaWYgKHRhZ05hbWUgIT09IG90Zykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgJyArIG90ZyArICcgaXMgZXhwZWN0ZWQgaW5wbGFjZSBvZiAnICsgdGFnTmFtZSArICcuJ30sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkICE9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFncy5wdXNoKHRhZ05hbWUpO1xuICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2tpcCB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICAvL0l0IG1heSBpbmNsdWRlIGNvbW1lbnRzIGFuZCBDREFUQSB2YWx1ZVxuICAgICAgICBmb3IgKGkrKzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICchJykge1xuICAgICAgICAgICAgICAvL2NvbW1lbnQgb3IgQ0FEQVRBXG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vZW5kIG9mIHJlYWRpbmcgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJyAnIHx8IHhtbERhdGFbaV0gPT09ICdcXHQnIHx8IHhtbERhdGFbaV0gPT09ICdcXG4nIHx8IHhtbERhdGFbaV0gPT09ICdcXHInKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZENoYXInLCBtc2c6ICdjaGFyICcgKyB4bWxEYXRhW2ldICsgJyBpcyBub3QgZXhwZWN0ZWQgLid9fTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRhZ0ZvdW5kKSB7XG4gICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1N0YXJ0IHRhZyBleHBlY3RlZC4nfX07XG4gIH0gZWxzZSBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnSW52YWxpZCAnICsgSlNPTi5zdHJpbmdpZnkodGFncywgbnVsbCwgNCkucmVwbGFjZSgvXFxyP1xcbi9nLCAnJykgKyAnIGZvdW5kLid9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVhZCBQcm9jZXNzaW5nIGluc3N0cnVjdGlvbnMgYW5kIHNraXBcbiAqIEBwYXJhbSB7Kn0geG1sRGF0YVxuICogQHBhcmFtIHsqfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRQSSh4bWxEYXRhLCBpKSB7XG4gIHZhciBzdGFydCA9IGk7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09ICc/JyB8fCB4bWxEYXRhW2ldID09ICcgJykge1xuICAgICAgLy90YWduYW1lXG4gICAgICB2YXIgdGFnbmFtZSA9IHhtbERhdGEuc3Vic3RyKHN0YXJ0LCBpIC0gc3RhcnQpO1xuICAgICAgaWYgKGkgPiA1ICYmIHRhZ25hbWUgPT09ICd4bWwnKSB7XG4gICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdYTUwgZGVjbGFyYXRpb24gYWxsb3dlZCBvbmx5IGF0IHRoZSBzdGFydCBvZiB0aGUgZG9jdW1lbnQuJ319O1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09ICc/JyAmJiB4bWxEYXRhW2kgKyAxXSA9PSAnPicpIHtcbiAgICAgICAgLy9jaGVjayBpZiB2YWxpZCBhdHRyaWJ1dCBzdHJpbmdcbiAgICAgICAgaSsrO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxuZnVuY3Rpb24gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKSB7XG4gIGlmICh4bWxEYXRhLmxlbmd0aCA+IGkgKyA1ICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICctJykge1xuICAgIC8vY29tbWVudFxuICAgIGZvciAoaSArPSAzOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOCAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ08nICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1knICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdQJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnRSdcbiAgKSB7XG4gICAgbGV0IGFuZ2xlQnJhY2tldHNDb3VudCA9IDE7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50LS07XG4gICAgICAgIGlmIChhbmdsZUJyYWNrZXRzQ291bnQgPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA5ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdbJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdbJ1xuICApIHtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnXScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGk7XG59XG5cbnZhciBkb3VibGVRdW90ZSA9ICdcIic7XG52YXIgc2luZ2xlUXVvdGUgPSBcIidcIjtcblxuLyoqXG4gKiBLZWVwIHJlYWRpbmcgeG1sRGF0YSB1bnRpbCAnPCcgaXMgZm91bmQgb3V0c2lkZSB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICogQHBhcmFtIHtzdHJpbmd9IHhtbERhdGFcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSkge1xuICBsZXQgYXR0clN0ciA9ICcnO1xuICBsZXQgc3RhcnRDaGFyID0gJyc7XG4gIGxldCB0YWdDbG9zZWQgPSBmYWxzZTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09IGRvdWJsZVF1b3RlIHx8IHhtbERhdGFbaV0gPT09IHNpbmdsZVF1b3RlKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICBzdGFydENoYXIgPSB4bWxEYXRhW2ldO1xuICAgICAgfSBlbHNlIGlmIChzdGFydENoYXIgIT09IHhtbERhdGFbaV0pIHtcbiAgICAgICAgLy9pZiB2YXVlIGlzIGVuY2xvc2VkIHdpdGggZG91YmxlIHF1b3RlIHRoZW4gc2luZ2xlIHF1b3RlcyBhcmUgYWxsb3dlZCBpbnNpZGUgdGhlIHZhbHVlIGFuZCB2aWNlIHZlcnNhXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRDaGFyID0gJyc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHRhZ0Nsb3NlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhdHRyU3RyICs9IHhtbERhdGFbaV07XG4gIH1cbiAgaWYgKHN0YXJ0Q2hhciAhPT0gJycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge3ZhbHVlOiBhdHRyU3RyLCBpbmRleDogaSwgdGFnQ2xvc2VkOiB0YWdDbG9zZWR9O1xufVxuXG4vKipcbiAqIFNlbGVjdCBhbGwgdGhlIGF0dHJpYnV0ZXMgd2hldGhlciB2YWxpZCBvciBpbnZhbGlkLlxuICovXG5jb25zdCB2YWxpZEF0dHJTdHJSZWd4cCA9IG5ldyBSZWdFeHAoJyhcXFxccyopKFteXFxcXHM9XSspKFxcXFxzKj0pPyhcXFxccyooW1xcJ1wiXSkoKFtcXFxcc1xcXFxTXSkqPylcXFxcNSk/JywgJ2cnKTtcblxuLy9hdHRyLCA9XCJzZFwiLCBhPVwiYW1pdCdzXCIsIGE9XCJzZFwiYj1cInNhZlwiLCBhYiAgY2Q9XCJcIlxuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpIHtcbiAgLy9jb25zb2xlLmxvZyhcInN0YXJ0OlwiK2F0dHJTdHIrXCI6ZW5kXCIpO1xuXG4gIC8vaWYoYXR0clN0ci50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTsgLy9lbXB0eSBzdHJpbmdcblxuICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIHZhbGlkQXR0clN0clJlZ3hwKTtcbiAgY29uc3QgYXR0ck5hbWVzID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9jb25zb2xlLmxvZyhtYXRjaGVzW2ldKTtcblxuICAgIGlmIChtYXRjaGVzW2ldWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy9ub3NwYWNlIGJlZm9yZSBhdHRyaWJ1dGUgbmFtZTogYT1cInNkXCJiPVwic2FmXCJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBoYXMgbm8gc3BhY2UgaW4gc3RhcnRpbmcuJ319O1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlc1tpXVszXSA9PT0gdW5kZWZpbmVkICYmICFvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgIC8vaW5kZXBlbmRlbnQgYXR0cmlidXRlOiBhYlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdib29sZWFuIGF0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaXMgbm90IGFsbG93ZWQuJ319O1xuICAgIH1cbiAgICAvKiBlbHNlIGlmKG1hdGNoZXNbaV1bNl0gPT09IHVuZGVmaW5lZCl7Ly9hdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZTogYWI9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVycjogeyBjb2RlOlwiSW52YWxpZEF0dHJcIixtc2c6XCJhdHRyaWJ1dGUgXCIgKyBtYXRjaGVzW2ldWzJdICsgXCIgaGFzIG5vIHZhbHVlIGFzc2lnbmVkLlwifX07XG4gICAgICAgICAgICAgICAgfSAqL1xuICAgIGNvbnN0IGF0dHJOYW1lID0gbWF0Y2hlc1tpXVsyXTtcbiAgICBpZiAoIXZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkpIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICB9XG4gICAgLyppZiAoIWF0dHJOYW1lcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHsqL1xuICAgIGlmICggIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhdHRyTmFtZXMsIGF0dHJOYW1lKSkge1xuICAgICAgLy9jaGVjayBmb3IgZHVwbGljYXRlIGF0dHJpYnV0ZS5cbiAgICAgIGF0dHJOYW1lc1thdHRyTmFtZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIHJlcGVhdGVkLid9fTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSAvXltfYS16QS1aXVtcXHdcXC0uOl0qJC87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkge1xuICAvLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IG5ldyBSZWdFeHAocmVneEF0dHJOYW1lKTtcbiAgcmV0dXJuIHV0aWwuZG9lc01hdGNoKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpO1xufVxuXG4vL2NvbnN0IHN0YXJ0c1dpdGhYTUwgPSBuZXcgUmVnRXhwKFwiXltYeF1bTW1dW0xsXVwiKTtcbi8vICBzdGFydHNXaXRoID0gL14oW2EtekEtWl18XylbXFx3LlxcLV86XSovO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVRhZ05hbWUodGFnbmFtZSwgcmVneFRhZ05hbWUpIHtcbiAgLyppZih1dGlsLmRvZXNNYXRjaCh0YWduYW1lLHN0YXJ0c1dpdGhYTUwpKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSovXG4gIHJldHVybiAhdXRpbC5kb2VzTm90TWF0Y2godGFnbmFtZSwgcmVneFRhZ05hbWUpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhZ25hbWUsIHBhcmVudCwgdmFsKSB7XG4gIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB0aGlzLmNoaWxkID0ge307IC8vY2hpbGQgdGFnc1xuICB0aGlzLmF0dHJzTWFwID0ge307IC8vYXR0cmlidXRlcyBtYXBcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB0aGlzLnZhbCA9IHZhbDsgLy90ZXh0IG9ubHlcbiAgdGhpcy5hZGRDaGlsZCA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdKSkge1xuICAgICAgLy9hbHJlYWR5IHByZXNlbnRzXG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdLnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdID0gW2NoaWxkXTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB4bWxOb2RlID0gcmVxdWlyZSgnLi94bWxOb2RlJyk7XG5jb25zdCBUYWdUeXBlID0ge09QRU5JTkc6IDEsIENMT1NJTkc6IDIsIFNFTEY6IDMsIENEQVRBOiA0fTtcbmxldCByZWd4ID1cbiAgJzwoKCFcXFxcW0NEQVRBXFxcXFsoW1xcXFxzXFxcXFNdKj8pKF1dPikpfCgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSkoW14+XSopPnwoKFxcXFwvKSgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSlcXFxccyo+KSkoW148XSopJztcblxuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvP1tcXFxcdzpcXFxcLVxcLl9dKykoW14+XSopPihcXFxccypcIitjZGF0YVJlZ3grXCIpKihbXjxdKyk/XCIsXCJnXCIpO1xuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvPykoKFxcXFx3KjopPyhbXFxcXHc6XFxcXC1cXC5fXSspKShbXj5dKik+KFtePF0qKShcIitjZGF0YVJlZ3grXCIoW148XSopKSooW148XSspP1wiLFwiZ1wiKTtcblxuLy9wb2x5ZmlsbFxuaWYgKCFOdW1iZXIucGFyc2VJbnQgJiYgd2luZG93LnBhcnNlSW50KSB7XG4gIE51bWJlci5wYXJzZUludCA9IHdpbmRvdy5wYXJzZUludDtcbn1cbmlmICghTnVtYmVyLnBhcnNlRmxvYXQgJiYgd2luZG93LnBhcnNlRmxvYXQpIHtcbiAgTnVtYmVyLnBhcnNlRmxvYXQgPSB3aW5kb3cucGFyc2VGbG9hdDtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICdAXycsXG4gIGF0dHJOb2RlTmFtZTogZmFsc2UsXG4gIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgaWdub3JlQXR0cmlidXRlczogdHJ1ZSxcbiAgaWdub3JlTmFtZVNwYWNlOiBmYWxzZSxcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vYSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICAvL2lnbm9yZVJvb3RFbGVtZW50IDogZmFsc2UsXG4gIHBhcnNlTm9kZVZhbHVlOiB0cnVlLFxuICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgYXJyYXlNb2RlOiBmYWxzZSxcbiAgdHJpbVZhbHVlczogdHJ1ZSwgLy9UcmltIHN0cmluZyB2YWx1ZXMgb2YgdGFnIGFuZCBhdHRyaWJ1dGVzXG4gIGNkYXRhVGFnTmFtZTogZmFsc2UsXG4gIGNkYXRhUG9zaXRpb25DaGFyOiAnXFxcXGMnLFxuICBsb2NhbGVSYW5nZTogJycsXG4gIHRhZ1ZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIGF0dHJWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBzdG9wTm9kZXM6IFtdXG4gIC8vZGVjb2RlU3RyaWN0OiBmYWxzZSxcbn07XG5cbmV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcblxuY29uc3QgcHJvcHMgPSBbXG4gICdhdHRyaWJ1dGVOYW1lUHJlZml4JyxcbiAgJ2F0dHJOb2RlTmFtZScsXG4gICd0ZXh0Tm9kZU5hbWUnLFxuICAnaWdub3JlQXR0cmlidXRlcycsXG4gICdpZ25vcmVOYW1lU3BhY2UnLFxuICAnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsXG4gICdwYXJzZU5vZGVWYWx1ZScsXG4gICdwYXJzZUF0dHJpYnV0ZVZhbHVlJyxcbiAgJ2FycmF5TW9kZScsXG4gICd0cmltVmFsdWVzJyxcbiAgJ2NkYXRhVGFnTmFtZScsXG4gICdjZGF0YVBvc2l0aW9uQ2hhcicsXG4gICdsb2NhbGVSYW5nZScsXG4gICd0YWdWYWx1ZVByb2Nlc3NvcicsXG4gICdhdHRyVmFsdWVQcm9jZXNzb3InLFxuICAncGFyc2VUcnVlTnVtYmVyT25seScsXG4gICdzdG9wTm9kZXMnXG5dO1xuZXhwb3J0cy5wcm9wcyA9IHByb3BzO1xuXG5jb25zdCBnZXRUcmF2ZXJzYWxPYmogPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC9cXHI/XFxuL2csIFwiIFwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgeG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvPCEtLVtcXHNcXFNdKj8tLT4vZywgJycpOyAvL1JlbW92ZSAgY29tbWVudHNcblxuICBjb25zdCB4bWxPYmogPSBuZXcgeG1sTm9kZSgnIXhtbCcpO1xuICBsZXQgY3VycmVudE5vZGUgPSB4bWxPYmo7XG5cbiAgcmVneCA9IHJlZ3gucmVwbGFjZSgvXFxbXFxcXHcvZywgJ1snICsgb3B0aW9ucy5sb2NhbGVSYW5nZSArICdcXFxcdycpO1xuICBjb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAocmVneCwgJ2cnKTtcbiAgbGV0IHRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIGxldCBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgd2hpbGUgKHRhZykge1xuICAgIGNvbnN0IHRhZ1R5cGUgPSBjaGVja0ZvclRhZ1R5cGUodGFnKTtcblxuICAgIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNMT1NJTkcpIHtcbiAgICAgIC8vYWRkIHBhcnNlZCBkYXRhIHRvIHBhcmVudCBub2RlXG4gICAgICBpZiAoY3VycmVudE5vZGUucGFyZW50ICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUucGFyZW50LnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUucGFyZW50LnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMsIGN1cnJlbnROb2RlLnBhcmVudC50YWduYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY3VycmVudE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY3VycmVudE5vZGUuY2hpbGQgPSBbXVxuICAgICAgICBpZiAoY3VycmVudE5vZGUuYXR0cnNNYXAgPT0gdW5kZWZpbmVkKSB7IGN1cnJlbnROb2RlLmF0dHJzTWFwID0ge319XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHhtbERhdGEuc3Vic3RyKGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggKyAxLCB0YWcuaW5kZXggLSBjdXJyZW50Tm9kZS5zdGFydEluZGV4IC0gMSlcbiAgICAgIH1cbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50O1xuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DREFUQSkge1xuICAgICAgaWYgKG9wdGlvbnMuY2RhdGFUYWdOYW1lKSB7XG4gICAgICAgIC8vYWRkIGNkYXRhIG5vZGVcbiAgICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5jZGF0YVRhZ05hbWUsIGN1cnJlbnROb2RlLCB0YWdbM10pO1xuICAgICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgLy9mb3IgYmFja3RyYWNraW5nXG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArIG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXI7XG4gICAgICAgIC8vYWRkIHJlc3QgdmFsdWUgdG8gcGFyZW50IG5vZGVcbiAgICAgICAgaWYgKHRhZ1sxNF0pIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS52YWwgKz0gcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IChjdXJyZW50Tm9kZS52YWwgfHwgJycpICsgKHRhZ1szXSB8fCAnJykgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuU0VMRikge1xuICAgICAgaWYgKGN1cnJlbnROb2RlICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sIGN1cnJlbnROb2RlLCAnJyk7XG4gICAgICBpZiAodGFnWzhdICYmIHRhZ1s4XS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRhZ1s4XSA9IHRhZ1s4XS5zdWJzdHIoMCwgdGFnWzhdLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1RhZ1R5cGUuT1BFTklOR1xuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUoXG4gICAgICAgIG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLFxuICAgICAgICBjdXJyZW50Tm9kZSxcbiAgICAgICAgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucylcbiAgICAgICk7XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGNoaWxkTm9kZS50YWduYW1lKSkge1xuICAgICAgICBjaGlsZE5vZGUuc3RhcnRJbmRleD10YWcuaW5kZXggKyB0YWdbMV0ubGVuZ3RoXG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZTtcbiAgICB9XG5cbiAgICB0YWcgPSBuZXh0VGFnO1xuICAgIG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHhtbE9iajtcbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3NUYWdWYWx1ZShwYXJzZWRUYWdzLCBvcHRpb25zLCBwYXJlbnRUYWdOYW1lKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBwYXJzZWRUYWdzWzddIHx8IHBhcmVudFRhZ05hbWU7XG4gIGxldCB2YWwgPSBwYXJzZWRUYWdzWzE0XTtcbiAgaWYgKHZhbCkge1xuICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgfVxuICAgIHZhbCA9IG9wdGlvbnMudGFnVmFsdWVQcm9jZXNzb3IodmFsLCB0YWdOYW1lKTtcbiAgICB2YWwgPSBwYXJzZVZhbHVlKHZhbCwgb3B0aW9ucy5wYXJzZU5vZGVWYWx1ZSwgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5KTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yVGFnVHlwZShtYXRjaCkge1xuICBpZiAobWF0Y2hbNF0gPT09ICddXT4nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0RBVEE7XG4gIH0gZWxzZSBpZiAobWF0Y2hbMTBdID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DTE9TSU5HO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaFs4XSAhPT0gJ3VuZGVmaW5lZCcgJiYgbWF0Y2hbOF0uc3Vic3RyKG1hdGNoWzhdLmxlbmd0aCAtIDEpID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5TRUxGO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBUYWdUeXBlLk9QRU5JTkc7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hbWVTcGFjZSh0YWduYW1lLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSkge1xuICAgIGNvbnN0IHRhZ3MgPSB0YWduYW1lLnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgcHJlZml4ID0gdGFnbmFtZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIGlmICh0YWdzWzBdID09PSAneG1sbnMnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICh0YWdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGFnbmFtZSA9IHByZWZpeCArIHRhZ3NbMV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YWduYW1lO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbCwgc2hvdWxkUGFyc2UsIHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgaWYgKHNob3VsZFBhcnNlICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgbGV0IHBhcnNlZDtcbiAgICBpZiAodmFsLnRyaW0oKSA9PT0gJycgfHwgaXNOYU4odmFsKSkge1xuICAgICAgcGFyc2VkID0gdmFsID09PSAndHJ1ZScgPyB0cnVlIDogdmFsID09PSAnZmFsc2UnID8gZmFsc2UgOiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWwuaW5kZXhPZignMHgnKSAhPT0gLTEpIHtcbiAgICAgICAgLy9zdXBwb3J0IGhleGEgZGVjaW1hbFxuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxNik7XG4gICAgICB9IGVsc2UgaWYgKHZhbC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUZsb2F0KHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyc2VUcnVlTnVtYmVyT25seSkge1xuICAgICAgICBwYXJzZWQgPSBTdHJpbmcocGFyc2VkKSA9PT0gdmFsID8gcGFyc2VkIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9IGVsc2Uge1xuICAgIGlmICh1dGlsLmlzRXhpc3QodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufVxuXG4vL1RPRE86IGNoYW5nZSByZWdleCB0byBjYXB0dXJlIE5TXG4vL2NvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoXCIoW1xcXFx3XFxcXC1cXFxcLlxcXFw6XSspXFxcXHMqPVxcXFxzKihbJ1xcXCJdKSgoLnxcXG4pKj8pXFxcXDJcIixcImdtXCIpO1xuY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cCgnKFteXFxcXHM9XSspXFxcXHMqKD1cXFxccyooW1xcJ1wiXSkoLio/KVxcXFwzKT8nLCAnZycpO1xuXG5mdW5jdGlvbiBidWlsZEF0dHJpYnV0ZXNNYXAoYXR0clN0ciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAmJiB0eXBlb2YgYXR0clN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICBhdHRyU3RyID0gYXR0clN0ci5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgLy9hdHRyU3RyID0gYXR0clN0ciB8fCBhdHRyU3RyLnRyaW0oKTtcblxuICAgIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgYXR0cnNSZWd4KTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGNvbnN0IGF0dHJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSByZXNvbHZlTmFtZVNwYWNlKG1hdGNoZXNbaV1bMV0sIG9wdGlvbnMpO1xuICAgICAgaWYgKGF0dHJOYW1lLmxlbmd0aCkge1xuICAgICAgICBpZiAobWF0Y2hlc1tpXVs0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG1hdGNoZXNbaV1bNF0udHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gb3B0aW9ucy5hdHRyVmFsdWVQcm9jZXNzb3IobWF0Y2hlc1tpXVs0XSwgYXR0ck5hbWUpO1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHBhcnNlVmFsdWUoXG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZUF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdHRyTm9kZU5hbWUpIHtcbiAgICAgIGNvbnN0IGF0dHJDb2xsZWN0aW9uID0ge307XG4gICAgICBhdHRyQ29sbGVjdGlvbltvcHRpb25zLmF0dHJOb2RlTmFtZV0gPSBhdHRycztcbiAgICAgIHJldHVybiBhdHRyQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG59XG5cbmV4cG9ydHMuZ2V0VHJhdmVyc2FsT2JqID0gZ2V0VHJhdmVyc2FsT2JqO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5cbi8qKlxuICogR2VuZXJpYyBhbmltYXRpb24gY2xhc3Mgd2l0aCBzdXBwb3J0IGZvciBkcm9wcGVkIGZyYW1lcyBib3RoIG9wdGlvbmFsIGVhc2luZyBhbmQgZHVyYXRpb24uXG4gKlxuICogT3B0aW9uYWwgZHVyYXRpb24gaXMgdXNlZnVsIHdoZW4gdGhlIGxpZmV0aW1lIGlzIGRlZmluZWQgYnkgYW5vdGhlciBjb25kaXRpb24gdGhhbiB0aW1lXG4gKiBlLmcuIHNwZWVkIG9mIGFuIGFuaW1hdGluZyBvYmplY3QsIGV0Yy5cbiAqXG4gKiBEcm9wcGVkIGZyYW1lIGxvZ2ljIGFsbG93cyB0byBrZWVwIHVzaW5nIHRoZSBzYW1lIHVwZGF0ZXIgbG9naWMgaW5kZXBlbmRlbnQgZnJvbSB0aGUgYWN0dWFsXG4gKiByZW5kZXJpbmcuIFRoaXMgZWFzZXMgYSBsb3Qgb2YgY2FzZXMgd2hlcmUgaXQgbWlnaHQgYmUgcHJldHR5IGNvbXBsZXggdG8gYnJlYWsgZG93biBhIHN0YXRlXG4gKiBiYXNlZCBvbiB0aGUgcHVyZSB0aW1lIGRpZmZlcmVuY2UuXG4gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3RvcnkoKHJvb3QuYW5pbWF0ZSA9IHt9KSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3dcbiAgICB2YXIgdGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgdmFyIGRlc2lyZWRGcmFtZXMgPSA2MDtcbiAgICB2YXIgbWlsbGlzZWNvbmRzUGVyU2Vjb25kID0gMTAwMDtcbiAgICB2YXIgcnVubmluZyA9IHt9O1xuICAgIHZhciBjb3VudGVyID0gMTtcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRoZSBnaXZlbiBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gd2FzIHN0b3BwZWQgKGFrYSwgd2FzIHJ1bm5pbmcgYmVmb3JlKVxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RvcCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgY2xlYXJlZCA9IChydW5uaW5nW2lkXSAhPT0gbnVsbCk7XG4gICAgICAgIGlmIChjbGVhcmVkKSB7XG4gICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xlYXJlZDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBnaXZlbiBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nXG4gICAgICovXG4gICAgZXhwb3J0cy5pc1J1bm5pbmcgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHJ1bm5pbmdbaWRdICE9PSBudWxsO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RlcENhbGxiYWNrIHtGdW5jdGlvbn0gUG9pbnRlciB0byBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZCBvbiBldmVyeSBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50LCBub3csIHZpcnR1YWwpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gdmVyaWZ5Q2FsbGJhY2sge0Z1bmN0aW9ufSBFeGVjdXRlZCBiZWZvcmUgZXZlcnkgYW5pbWF0aW9uIHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRDYWxsYmFjayB7RnVuY3Rpb259XG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKGRyb3BwZWRGcmFtZXMsIGZpbmlzaGVkQW5pbWF0aW9uLCBvcHRpb25hbCB3YXNGaW5pc2hlZCkge31gXG4gICAgICogQHBhcmFtIGR1cmF0aW9uIHtJbnRlZ2VyfSBNaWxsaXNlY29uZHMgdG8gcnVuIHRoZSBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0gZWFzaW5nTWV0aG9kIHtGdW5jdGlvbn0gUG9pbnRlciB0byBlYXNpbmcgZnVuY3Rpb25cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCkgeyByZXR1cm4gbW9kaWZpZWRWYWx1ZTsgfWBcbiAgICAgKiBAcGFyYW0gcm9vdCB7RWxlbWVudH0gUmVuZGVyIHJvb3QuIFVzZWQgZm9yIGludGVybmFsIHVzYWdlIG9mIHJlcXVlc3RBbmltYXRpb25GcmFtZS5cbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBJZGVudGlmaWVyIG9mIGFuaW1hdGlvbi4gQ2FuIGJlIHVzZWQgdG8gc3RvcCBpdCBhbnkgdGltZS5cbiAgICAgKi9cbiAgICBleHBvcnRzLnN0YXJ0ID0gZnVuY3Rpb24gKHN0ZXBDYWxsYmFjaywgdmVyaWZ5Q2FsbGJhY2ssIGNvbXBsZXRlZENhbGxiYWNrLCBkdXJhdGlvbiwgZWFzaW5nTWV0aG9kLCByb290KSB7XG4gICAgICAgIHZhciBzdGFydCA9IHRpbWUoKTtcbiAgICAgICAgdmFyIGxhc3RGcmFtZSA9IHN0YXJ0O1xuICAgICAgICB2YXIgcGVyY2VudCA9IDA7XG4gICAgICAgIHZhciBkcm9wQ291bnRlciA9IDA7XG4gICAgICAgIHZhciBpZCA9IGNvdW50ZXIrKztcblxuICAgICAgICAvLyBDb21wYWN0aW5nIHJ1bm5pbmcgZGIgYXV0b21hdGljYWxseSBldmVyeSBmZXcgbmV3IGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlkICUgMjAgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBuZXdSdW5uaW5nID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciB1c2VkSWQgaW4gcnVubmluZykge1xuICAgICAgICAgICAgICAgIG5ld1J1bm5pbmdbdXNlZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5uaW5nID0gbmV3UnVubmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGludGVybmFsIHN0ZXAgbWV0aG9kIHdoaWNoIGlzIGNhbGxlZCBldmVyeSBmZXcgbWlsbGlzZWNvbmRzXG4gICAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHZpcnR1YWwpIHtcblxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHZpcnR1YWwgdmFsdWVcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSB2aXJ0dWFsICE9PSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudCB0aW1lXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSgpO1xuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gaXMgZXhlY3V0ZWQgYmVmb3JlIG5leHQgYW5pbWF0aW9uIHN0ZXBcbiAgICAgICAgICAgIGlmICghcnVubmluZ1tpZF0gfHwgKHZlcmlmeUNhbGxiYWNrICYmICF2ZXJpZnlDYWxsYmFjayhpZCkpKSB7XG5cbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciB0aGUgY3VycmVudCByZW5kZXJpbmcgdG8gYXBwbHkgbGV0J3MgdXBkYXRlIG9taXR0ZWQgc3RlcHMgaW4gbWVtb3J5LlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gYnJpbmcgaW50ZXJuYWwgc3RhdGUgdmFyaWFibGVzIHVwLXRvLWRhdGUgd2l0aCBwcm9ncmVzcyBpbiB0aW1lLlxuICAgICAgICAgICAgaWYgKHJlbmRlcikge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRyb3BwZWRGcmFtZXMgPSBNYXRoLnJvdW5kKChub3cgLSBsYXN0RnJhbWUpIC8gKG1pbGxpc2Vjb25kc1BlclNlY29uZCAvIGRlc2lyZWRGcmFtZXMpKSAtIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNYXRoLm1pbihkcm9wcGVkRnJhbWVzLCA0KTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGRyb3BDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgcGVyY2VudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IChub3cgLSBzdGFydCkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHN0ZXAgY2FsbGJhY2ssIHRoZW4uLi5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVhc2luZ01ldGhvZCA/IGVhc2luZ01ldGhvZChwZXJjZW50KSA6IHBlcmNlbnQ7XG4gICAgICAgICAgICBpZiAoKHN0ZXBDYWxsYmFjayh2YWx1ZSwgbm93LCByZW5kZXIpID09PSBmYWxzZSB8fCBwZXJjZW50ID09PSAxKSAmJiByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBwZXJjZW50ID09PSAxIHx8IGR1cmF0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0RnJhbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcmsgYXMgcnVubmluZ1xuICAgICAgICBydW5uaW5nW2lkXSA9IHRydWU7XG5cbiAgICAgICAgLy8gSW5pdCBmaXJzdCBzdGVwXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcblxuICAgICAgICAvLyBSZXR1cm4gdW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn0pKTtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcbnZhciBOT09QID0gZnVuY3Rpb24gKCkgeyB9O1xuXG4vLyBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFJvYmVydCBQZW5uZXIsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZU91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZUluT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIGlmICgocG9zIC89IDAuNSkgPCAxKSB7XG4gICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywgMyk7XG4gIH1cblxuICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwgMykgKyAyKTtcbn07XG5cblxuLyoqXG4gKiBBIHB1cmUgbG9naWMgJ2NvbXBvbmVudCcgZm9yICd2aXJ0dWFsJyBzY3JvbGxpbmcvem9vbWluZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIHRoaXMuX19jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geC1heGlzICovXG4gICAgICBzY3JvbGxpbmdYOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB5LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1k6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgYW5pbWF0aW9ucyBmb3IgZGVjZWxlcmF0aW9uLCBzbmFwIGJhY2ssIHpvb21pbmcgYW5kIHNjcm9sbGluZyAqL1xuICAgICAgYW5pbWF0aW5nOiB0cnVlLFxuXG4gICAgICAvKiogZHVyYXRpb24gZm9yIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIGJ5IHNjcm9sbFRvL3pvb21UbyAqL1xuICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDI1MCxcblxuICAgICAgLyoqIEVuYWJsZSBib3VuY2luZyAoY29udGVudCBjYW4gYmUgc2xvd2x5IG1vdmVkIG91dHNpZGUgYW5kIGp1bXBzIGJhY2sgYWZ0ZXIgcmVsZWFzaW5nKSAqL1xuICAgICAgYm91bmNpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgbG9ja2luZyB0byB0aGUgbWFpbiBheGlzIGlmIHVzZXIgbW92ZXMgb25seSBzbGlnaHRseSBvbiBvbmUgb2YgdGhlbSBhdCBzdGFydCAqL1xuICAgICAgbG9ja2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBwYWdpbmF0aW9uIG1vZGUgKHN3aXRjaGluZyBiZXR3ZWVuIGZ1bGwgcGFnZSBjb250ZW50IHBhbmVzKSAqL1xuICAgICAgcGFnaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSBzbmFwcGluZyBvZiBjb250ZW50IHRvIGEgY29uZmlndXJlZCBwaXhlbCBncmlkICovXG4gICAgICBzbmFwcGluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgem9vbWluZyBvZiBjb250ZW50IHZpYSBBUEksIGZpbmdlcnMgYW5kIG1vdXNlIHdoZWVsICovXG4gICAgICB6b29taW5nOiBmYWxzZSxcblxuICAgICAgLyoqIE1pbmltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWluWm9vbTogMC41LFxuXG4gICAgICAvKiogTWF4aW11bSB6b29tIGxldmVsICovXG4gICAgICBtYXhab29tOiAzLFxuXG4gICAgICAvKiogTXVsdGlwbHkgb3IgZGVjcmVhc2Ugc2Nyb2xsaW5nIHNwZWVkICoqL1xuICAgICAgc3BlZWRNdWx0aXBsaWVyOiAxLFxuXG4gICAgICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBmaXJlZCBvbiB0aGUgbGF0ZXIgb2YgdG91Y2ggZW5kIG9yIGRlY2VsZXJhdGlvbiBlbmQsXG4gICAgICAgICAgcHJvdmlkZWQgdGhhdCBhbm90aGVyIHNjcm9sbGluZyBhY3Rpb24gaGFzIG5vdCBiZWd1bi4gVXNlZCB0byBrbm93XG4gICAgICAgICAgd2hlbiB0byBmYWRlIG91dCBhIHNjcm9sbGJhci4gKi9cbiAgICAgIHNjcm9sbGluZ0NvbXBsZXRlOiBOT09QLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjogMC4wMyxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGFjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25BY2NlbGVyYXRpb246IDAuMDhcbiAgICB9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIElOVEVSTkFMIEZJRUxEUyA6OiBTVEFUVVNcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIG9ubHkgYSBzaW5nbGUgZmluZ2VyIGlzIHVzZWQgaW4gdG91Y2ggaGFuZGxpbmcgKi9cbiAgX19pc1NpbmdsZVRvdWNoID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgdG91Y2ggZXZlbnQgc2VxdWVuY2UgaXMgaW4gcHJvZ3Jlc3MgKi9cbiAgX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbiB3ZW50IHRvIGNvbXBsZXRpb24uICovXG4gIF9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgYSBnZXN0dXJlIHpvb20vcm90YXRlIGV2ZW50IGlzIGluIHByb2dyZXNzLiBBY3RpdmF0ZXMgd2hlblxuICAgKiBhIGdlc3R1cmVzdGFydCBldmVudCBoYXBwZW5zLiBUaGlzIGhhcyBoaWdoZXIgcHJpb3JpdHkgdGhhbiBkcmFnZ2luZy5cbiAgICovXG4gIF9faXNHZXN0dXJpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHVzZXIgaGFzIG1vdmVkIGJ5IHN1Y2ggYSBkaXN0YW5jZSB0aGF0IHdlIGhhdmUgZW5hYmxlZFxuICAgKiBkcmFnZ2luZyBtb2RlLiBIaW50ID0gSXQncyBvbmx5IGVuYWJsZWQgYWZ0ZXIgc29tZSBwaXhlbHMgb2YgbW92ZW1lbnQgdDtcbiAgICogbm90IGludGVycnVwdCB3aXRoIGNsaWNrcyBldGMuXG4gICAqL1xuICBfX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IE5vdCB0b3VjaGluZyBhbmQgZHJhZ2dpbmcgYW55bW9yZSwgYW5kIHNtb290aGx5IGFuaW1hdGluZyB0aGVcbiAgICogdG91Y2ggc2VxdWVuY2UgdXNpbmcgZGVjZWxlcmF0aW9uLlxuICAgKi9cbiAgX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gU21vb3RobHkgYW5pbWF0aW5nIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBjaGFuZ2VcbiAgICovXG4gIF9faXNBbmltYXRpbmcgPSBmYWxzZTtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogRElNRU5TSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgbGVmdCBib3VuZGFyeSAqL1xuICBfX2NsaWVudExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgcmlnaHQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgd2lkdGggKi9cbiAgX19jbGllbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBoZWlnaHQgKi9cbiAgX19jbGllbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3Mgd2lkdGggKi9cbiAgX19jb250ZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3MgaGVpZ2h0ICovXG4gIF9fY29udGVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBXaWR0aCA9IDEwMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBIZWlnaHQgPSAxMDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFpvb20gbGV2ZWwgKi9cbiAgX196b29tTGV2ZWwgPSAxO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fc2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19zY3JvbGxUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fbWF4U2Nyb2xsVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgbGVmdCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkTGVmdCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHRvcCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgem9vbSBsZXZlbCAoZmluYWwgc2NhbGUgd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkWm9vbSA9IDA7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IExBU1QgUE9TSVRJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtOdW1iZXJ9IExlZnQgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IFRvcCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hUb3AgPSBudWxsO1xuXG4gIC8qKiB7RGF0ZX0gVGltZXN0YW1wIG9mIGxhc3QgbW92ZSBvZiBmaW5nZXIuIFVzZWQgdG8gbGltaXQgdHJhY2tpbmcgcmFuZ2UgZm9yIGRlY2VsZXJhdGlvbiBzcGVlZC4gKi9cbiAgX19sYXN0VG91Y2hNb3ZlID0gbnVsbDtcblxuICAvKioge0FycmF5fSBMaXN0IG9mIHBvc2l0aW9ucywgdXNlcyB0aHJlZSBpbmRleGVzIGZvciBlYWNoIHN0YXRlID0gbGVmdCwgdG9wLCB0aW1lc3RhbXAgKjtcbiAgX19wb3NpdGlvbnMgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6ID0gREVDRUxFUkFUSU9OIFNVUFBPUjtcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgUFVCTElDIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBjbGllbnQgKG91dGVyKSBhbmQgY29udGVudCAoaW5uZXIpIGVsZW1lbnRzLlxuICAgKiBSZXF1aXJlcyB0aGUgYXZhaWxhYmxlIHNwYWNlIGZvciB0aGUgb3V0ZXIgZWxlbWVudCBhbmQgdGhlIG91dGVyIHNpemUgb2YgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAqIEFsbCB2YWx1ZXMgd2hpY2ggYXJlIGZhbHN5IChudWxsIG9yIHplcm8gZXRjLikgYXJlIGlnbm9yZWQgYW5kIHRoZSBvbGQgdmFsdWUgaXMga2VwdC5cbiAgICpcbiAgICogQHBhcmFtIGNsaWVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgd2lkdGggb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY2xpZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgaGVpZ2h0IG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IE91dGVyIHdpZHRoIG9mIGlubmVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBPdXRlciBoZWlnaHQgb2YgaW5uZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB2YWx1ZXMgd2hpY2ggYXJlIGRlZmluZWRcbiAgICBpZiAoY2xpZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRXaWR0aCA9IGNsaWVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjbGllbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRIZWlnaHQgPSBjbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRXaWR0aCA9IGNvbnRlbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRIZWlnaHQgPSBjb250ZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIFJlZnJlc2ggbWF4aW11bXNcbiAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuXG4gICAgLy8gUmVmcmVzaCBzY3JvbGwgcG9zaXRpb25cbiAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCBmYWxzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjbGllbnQgY29vcmRpbmF0ZXMgaW4gcmVsYXRpb24gdG8gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7SW50ZWdlciA/IDB9IExlZnQgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gdG9wIHtJbnRlZ2VyID8gMH0gVG9wIHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICovXG4gIHNldFBvc2l0aW9uKGxlZnQsIHRvcCkge1xuICAgIHRoaXMuX19jbGllbnRMZWZ0ID0gbGVmdCB8fCAwO1xuICAgIHRoaXMuX19jbGllbnRUb3AgPSB0b3AgfHwgMDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHNuYXBwaW5nICh3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSlcbiAgICpcbiAgICogQHBhcmFtIHdpZHRoIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aFxuICAgKiBAcGFyYW0gaGVpZ2h0IHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHRcbiAgICovXG4gIHNldFNuYXBTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLl9fc25hcFdpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5fX3NuYXBIZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB6b29taW5nIHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtNYXB9IGBsZWZ0YCBhbmQgYHRvcGAgc2Nyb2xsIHBvc2l0aW9uIGFuZCBgem9vbWAgbGV2ZWxcbiAgICovXG4gIGdldFZhbHVlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX3Njcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19zY3JvbGxUb3AsXG4gICAgICByaWdodDogdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fY2xpZW50V2lkdGggLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgYm90dG9tOiB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2NsaWVudEhlaWdodCAvIHRoaXMuX196b29tTGV2ZWwsXG4gICAgICB6b29tOiB0aGlzLl9fem9vbUxldmVsXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldCBwb2ludCBpbiBpbiBjb250ZW50IHNwYWNlIGZyb20gc2Nyb2xsIGNvb3JkaW5hdGVzLlxuICAgKi9cbiAgZ2V0UG9pbnQoc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogc2Nyb2xsTGVmdCAvIHZhbHVlcy56b29tLFxuICAgICAgdG9wOiBzY3JvbGxUb3AgLyB2YWx1ZXMuem9vbVxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgKi9cbiAgZ2V0U2Nyb2xsTWF4KCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgIHRvcDogdGhpcy5fX21heFNjcm9sbFRvcFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBab29tcyB0byB0aGUgZ2l2ZW4gbGV2ZWwuIFN1cHBvcnRzIG9wdGlvbmFsIGFuaW1hdGlvbi4gWm9vbXNcbiAgICogdGhlIGNlbnRlciB3aGVuIG5vIGNvb3JkaW5hdGVzIGFyZSBnaXZlbi5cbiAgICpcbiAgICogQHBhcmFtIGxldmVsIHtOdW1iZXJ9IExldmVsIHRvIHpvb20gdG9cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBmaXhlZExlZnQge051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIGxlZnQgY29vcmRpbmF0ZSAodmVjdG9yIGluIGNsaWVudCBzcGFjZSlcbiAgICogQHBhcmFtIGZpeGVkVG9wIHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyB0b3AgY29vcmRpbmF0ZSAodmVjdG9yIGluIGNsaWVudCBzcGFjZSlcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbiA/IG51bGx9IEEgY2FsbGJhY2sgdGhhdCBnZXRzIGZpcmVkIHdoZW4gdGhlIHpvb20gaXMgY29tcGxldGUuXG4gICAqL1xuICB6b29tVG8obGV2ZWwsIGlzQW5pbWF0ZWQsIGZpeGVkTGVmdCwgZml4ZWRUb3AsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWm9vbWluZyBpcyBub3QgZW5hYmxlZCFcIik7XG4gICAgfVxuXG4gICAgLy8gQWRkIGNhbGxiYWNrIGlmIGV4aXN0c1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb2xkTGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgLy8gTm9ybWFsaXplIGZpeGVkIHBvaW50IHRvIGNlbnRlciBvZiB2aWV3cG9ydCBpZiBub3QgZGVmaW5lZFxuICAgIGlmIChmaXhlZExlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZml4ZWRMZWZ0ID0gdGhpcy5fX2NsaWVudFdpZHRoIC8gMjtcbiAgICB9XG5cbiAgICBpZiAoZml4ZWRUb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZml4ZWRUb3AgPSB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvLyBMaW1pdCBsZXZlbCBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG5cbiAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIHNjcm9sbCBwb3NpdGlvbnMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWwuXG4gICAgLy8gQ2hvb3NpbmcgdGhlIG5ldyB2aWV3cG9ydCBzbyB0aGF0IHRoZSBvcmlnaW4ncyBwb3NpdGlvbiByZW1haW5zXG4gICAgLy8gZml4ZWQsIHdlIGhhdmUgY2VudHJhbCBkaWxhdGlvbiBhYm91dCB0aGUgb3JpZ2luLlxuICAgIC8vICogRml4ZWQgcG9pbnQsICRGJCwgcmVtYWlucyBzdGF0aW9uYXJ5IGluIGNvbnRlbnQgc3BhY2UgYW5kIGluIHRoZVxuICAgIC8vIHZpZXdwb3J0LlxuICAgIC8vICogSW5pdGlhbCBzY3JvbGwgcG9zaXRpb24sICRTX2kkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgIC8vICogRmluYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19mJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEluaXRpYWwgc2NhbGluZyBmYWN0b3IsICRrX2kkLlxuICAgIC8vICogRmluYWwgc2NhbGluZyBmYWN0b3IsICRrX2YkLlxuICAgIC8vXG4gICAgLy8gKiAkU19pIFxcbWFwc3RvIFNfZiQuXG4gICAgLy8gKiAkKFNfaSAtIEYpIGtfaSA9IChTX2YgLSBGKSBrX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kva19mID0gKFNfZiAtIEYpJC5cbiAgICAvLyAqICRTX2YgPSBGICsgKFNfaSAtIEYpIGtfaS9rX2YkLlxuICAgIC8vXG4gICAgLy8gRml4ZWQgcG9pbnQgbG9jYXRpb24sICRcXHZlY3RvcntmfSA9IChGIC0gU19pKSBrX2kkLlxuICAgIC8vICogJEYgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kkLlxuICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSArIChTX2kgLSBTX2kgLSBcXHZlY3RvcntmfS9rX2kpIGtfaS9rX2YkLlxuICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSAtIFxcdmVjdG9ye2Z9L2tfZiQuXG4gICAgLy8gKiAkU19mIGtfZiA9IFNfaSBrX2YgKyAoa19mL2tfaSAtIDEpXFx2ZWN0b3J7Zn0kLlxuICAgIC8vICogJFNfZiBrX2YgPSAoa19mL2tfaSkoU19pIGtfaSkgKyAoa19mL2tfaSAtIDEpIFxcdmVjdG9ye2Z9JC5cbiAgICB2YXIgayA9IGxldmVsIC8gb2xkTGV2ZWw7XG4gICAgdmFyIGxlZnQgPSBrICogKHRoaXMuX19zY3JvbGxMZWZ0ICsgZml4ZWRMZWZ0KSAtIGZpeGVkTGVmdDtcbiAgICB2YXIgdG9wID0gayAqICh0aGlzLl9fc2Nyb2xsVG9wICsgZml4ZWRUb3ApIC0gZml4ZWRUb3A7XG5cbiAgICAvLyBMaW1pdCB4LWF4aXNcbiAgICBpZiAobGVmdCA+IHRoaXMuX19tYXhTY3JvbGxMZWZ0KSB7XG4gICAgICBsZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgfSBlbHNlIGlmIChsZWZ0IDwgMCkge1xuICAgICAgbGVmdCA9IDA7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgeS1heGlzXG4gICAgaWYgKHRvcCA+IHRoaXMuX19tYXhTY3JvbGxUb3ApIHtcbiAgICAgIHRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfSBlbHNlIGlmICh0b3AgPCAwKSB7XG4gICAgICB0b3AgPSAwO1xuICAgIH1cblxuICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgbGV2ZWwsIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdGhlIGNvbnRlbnQgYnkgdGhlIGdpdmVuIGZhY3Rvci5cbiAgICpcbiAgICogQHBhcmFtIGZhY3RvciB7TnVtYmVyfSBab29tIGJ5IGdpdmVuIGZhY3RvclxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICogQHBhcmFtIG9yaWdpbkxlZnQge051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gbGVmdCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBvcmlnaW5Ub3Age051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gdG9wIGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbiA/IG51bGx9IEEgY2FsbGJhY2sgdGhhdCBnZXRzIGZpcmVkIHdoZW4gdGhlIHpvb20gaXMgY29tcGxldGUuXG4gICAqL1xuICB6b29tQnkoZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjayk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRvIHRoZSBnaXZlbiBwb3NpdGlvbi4gUmVzcGVjdCBsaW1pdGF0aW9ucyBhbmQgc25hcHBpbmcgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlcj9udWxsfSBIb3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXI/bnVsbH0gVmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRoZSBzY3JvbGxpbmcgc2hvdWxkIGhhcHBlbiB1c2luZyBhbiBhbmltYXRpb25cbiAgICogQHBhcmFtIHpvb20ge051bWJlcn0gWzEuMF0gWm9vbSBsZXZlbCB0byBnbyB0b1xuICAgKi9cbiAgc2Nyb2xsVG8obGVmdCwgdG9wLCBpc0FuaW1hdGVkLCB6b29tKSB7XG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIENvcnJlY3QgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkICYmIHpvb20gIT09IHRoaXMuX196b29tTGV2ZWwpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWm9vbWluZyBpcyBub3QgZW5hYmxlZCFcIik7XG4gICAgICB9XG5cbiAgICAgIGxlZnQgKj0gem9vbTtcbiAgICAgIHRvcCAqPSB6b29tO1xuXG4gICAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoem9vbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEtlZXAgem9vbSB3aGVuIG5vdCBkZWZpbmVkXG4gICAgICB6b29tID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdYKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fY2xpZW50V2lkdGgpICogdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIHRoaXMuX19zbmFwV2lkdGgpICogdGhpcy5fX3NuYXBXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdZKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19jbGllbnRIZWlnaHQpICogdGhpcy5fX2NsaWVudEhlaWdodDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX3NuYXBIZWlnaHQpICogdGhpcy5fX3NuYXBIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGltaXQgZm9yIGFsbG93ZWQgcmFuZ2VzXG4gICAgbGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxMZWZ0LCBsZWZ0KSwgMCk7XG4gICAgdG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbFRvcCwgdG9wKSwgMCk7XG5cbiAgICAvLyBEb24ndCBhbmltYXRlIHdoZW4gbm8gY2hhbmdlIGRldGVjdGVkLCBzdGlsbCBjYWxsIHB1Ymxpc2ggdG8gbWFrZSBzdXJlXG4gICAgLy8gdGhhdCByZW5kZXJlZCBwb3NpdGlvbiBpcyByZWFsbHkgaW4tc3luYyB3aXRoIGludGVybmFsIGRhdGFcbiAgICBpZiAobGVmdCA9PT0gdGhpcy5fX3Njcm9sbExlZnQgJiYgdG9wID09PSB0aGlzLl9fc2Nyb2xsVG9wKSB7XG4gICAgICBpc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUHVibGlzaCBuZXcgdmFsdWVzXG4gICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNjcm9sbCBieSB0aGUgZ2l2ZW4gb2Zmc2V0XG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXIgPyAwfSBTY3JvbGwgeC1heGlzIGJ5IGdpdmVuIG9mZnNldFxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXIgPyAwfSBTY3JvbGwgeC1heGlzIGJ5IGdpdmVuIG9mZnNldFxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIGFuaW1hdGUgdGhlIGdpdmVuIGNoYW5nZVxuICAgKi9cbiAgc2Nyb2xsQnkobGVmdCwgdG9wLCBpc0FuaW1hdGVkKSB7XG4gICAgdmFyIHN0YXJ0TGVmdCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRMZWZ0IDogdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgdmFyIHN0YXJ0VG9wID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZFRvcCA6IHRoaXMuX19zY3JvbGxUb3A7XG5cbiAgICB0aGlzLnNjcm9sbFRvKHN0YXJ0TGVmdCArIChsZWZ0IHx8IDApLCBzdGFydFRvcCArICh0b3AgfHwgMCksIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIEVWRU5UIENBTExCQUNLU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBNb3VzZSB3aGVlbCBoYW5kbGVyIGZvciB6b29taW5nIHN1cHBvcnRcbiAgICovXG4gIGRvTW91c2Vab29tKHdoZWVsRGVsdGEsIHRpbWVTdGFtcCwgcGFnZVgsIHBhZ2VZKSB7XG4gICAgdmFyIGNoYW5nZSA9IHdoZWVsRGVsdGEgPiAwID8gMC45NyA6IDEuMDM7XG5cbiAgICByZXR1cm4gdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGNoYW5nZSwgZmFsc2UsIHBhZ2VYIC0gdGhpcy5fX2NsaWVudExlZnQsIHBhZ2VZIC0gdGhpcy5fX2NsaWVudFRvcCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBzdGFydCBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIHRpbWVTdGFtcCkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBpbnRlcnJ1cHRlZEFuaW1hdGlvbiBmbGFnXG4gICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcblxuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBhbmltYXRpb25cbiAgICBpZiAodGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzQW5pbWF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBVc2UgY2VudGVyIHBvaW50IHdoZW4gZGVhbGluZyB3aXRoIHR3byBmaW5nZXJzXG4gICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcbiAgICB2YXIgaXNTaW5nbGVUb3VjaCA9IHRvdWNoZXMubGVuZ3RoID09PSAxO1xuICAgIGlmIChpc1NpbmdsZVRvdWNoKSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHBvc2l0aW9uc1xuICAgIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgY3VycmVudCB6b29tIGxldmVsXG4gICAgdGhpcy5fX3pvb21MZXZlbFN0YXJ0ID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIFN0b3JlIGluaXRpYWwgdG91Y2ggcG9zaXRpb25zXG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIG1vdmUgdGltZSBzdGFtcFxuICAgIHRoaXMuX19sYXN0VG91Y2hNb3ZlID0gdGltZVN0YW1wO1xuXG4gICAgLy8gUmVzZXQgaW5pdGlhbCBzY2FsZVxuICAgIHRoaXMuX19sYXN0U2NhbGUgPSAxO1xuXG4gICAgLy8gUmVzZXQgbG9ja2luZyBmbGFnc1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1g7XG4gICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWTtcblxuICAgIC8vIFJlc2V0IHRyYWNraW5nIGZsYWdcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IHRydWU7XG5cbiAgICAvLyBSZXNldCBkZWNlbGVyYXRpb24gY29tcGxldGUgZmxhZ1xuICAgIHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gICAgLy8gRHJhZ2dpbmcgc3RhcnRzIGRpcmVjdGx5IHdpdGggdHdvIGZpbmdlcnMsIG90aGVyd2lzZSBsYXp5IHdpdGggYW4gb2Zmc2V0XG4gICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAhaXNTaW5nbGVUb3VjaDtcblxuICAgIC8vIFNvbWUgZmVhdHVyZXMgYXJlIGRpc2FibGVkIGluIG11bHRpIHRvdWNoIHNjZW5hcmlvc1xuICAgIHRoaXMuX19pc1NpbmdsZVRvdWNoID0gaXNTaW5nbGVUb3VjaDtcblxuICAgIC8vIENsZWFyaW5nIGRhdGEgc3RydWN0dXJlXG4gICAgdGhpcy5fX3Bvc2l0aW9ucyA9IFtdO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggbW92ZSBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKiBAcGFyYW0ge051bWJlcn0gWzEuMF0gc2NhbGUgLSAuLi4uXG4gICAqL1xuICBkb1RvdWNoTW92ZSh0b3VjaGVzLCB0aW1lU3RhbXAsIHNjYWxlKSB7XG4gICAgLy8gQXJyYXktbGlrZSBjaGVjayBpcyBlbm91Z2ggaGVyZVxuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvdWNoIGxpc3Q6IFwiICsgdG91Y2hlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChldmVudCBtaWdodCBiZSBvdXRzaWRlIG9mIGVsZW1lbnQpXG4gICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBDb21wdXRlIG1vdmUgYmFzZWQgYXJvdW5kIG9mIGNlbnRlciBvZiBmaW5nZXJzXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICB9XG5cbiAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcblxuICAgIC8vIEFyZSB3ZSBhbHJlYWR5IGlzIGRyYWdnaW5nIG1vZGU/XG4gICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAvLyBDb21wdXRlIG1vdmUgZGlzdGFuY2VcbiAgICAgIHZhciBtb3ZlWCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fbGFzdFRvdWNoTGVmdDtcbiAgICAgIHZhciBtb3ZlWSA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19sYXN0VG91Y2hUb3A7XG5cbiAgICAgIC8vIFJlYWQgcHJldmlvdXMgc2Nyb2xsIHBvc2l0aW9uIGFuZCB6b29taW5nXG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgICB2YXIgbGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICAvLyBXb3JrIHdpdGggc2NhbGluZ1xuICAgICAgaWYgKHNjYWxlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdmFyIG9sZExldmVsID0gbGV2ZWw7XG5cbiAgICAgICAgLy8gUmVjb21wdXRlIGxldmVsIGJhc2VkIG9uIHByZXZpb3VzIHNjYWxlIGFuZCBuZXcgc2NhbGVcbiAgICAgICAgbGV2ZWwgPSBsZXZlbCAvIHRoaXMuX19sYXN0U2NhbGUgKiBzY2FsZTtcblxuICAgICAgICAvLyBMaW1pdCBsZXZlbCBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgICAgICAvLyBPbmx5IGRvIGZ1cnRoZXIgY29tcHV0aW9uIHdoZW4gY2hhbmdlIGhhcHBlbmVkXG4gICAgICAgIGlmIChvbGRMZXZlbCAhPT0gbGV2ZWwpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIGV2ZW50IHBvc2l0aW9uIHRvIGNvbnRhaW5lclxuICAgICAgICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0UmVsID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19jbGllbnRMZWZ0O1xuICAgICAgICAgIHZhciBjdXJyZW50VG91Y2hUb3BSZWwgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fY2xpZW50VG9wO1xuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgICAgICAgIHNjcm9sbExlZnQgPSAoKGN1cnJlbnRUb3VjaExlZnRSZWwgKyBzY3JvbGxMZWZ0KSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoTGVmdFJlbDtcbiAgICAgICAgICBzY3JvbGxUb3AgPSAoKGN1cnJlbnRUb3VjaFRvcFJlbCArIHNjcm9sbFRvcCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaFRvcFJlbDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBtYXggc2Nyb2xsIHZhbHVlc1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fX2VuYWJsZVNjcm9sbFgpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCAtPSBtb3ZlWCAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIHZhciBtYXhTY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG5cbiAgICAgICAgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0IHx8IHNjcm9sbExlZnQgPCAwKSB7XG4gICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgKz0gKG1vdmVYIC8gMiAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBtYXhTY3JvbGxMZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICBpZiAodGhpcy5fX2VuYWJsZVNjcm9sbFkpIHtcbiAgICAgICAgc2Nyb2xsVG9wIC09IG1vdmVZICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW92ZVkpXG4gICAgICAgIHZhciBtYXhTY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3AgfHwgc2Nyb2xsVG9wIDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgKz0gKG1vdmVZIC8gMiAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSBtYXhTY3JvbGxUb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEtlZXAgbGlzdCBmcm9tIGdyb3dpbmcgaW5maW5pdGVseSAoaG9sZGluZyBtaW4gMTAsIG1heCAyMCBtZWFzdXJlIHBvaW50cylcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gNjApIHtcbiAgICAgICAgcG9zaXRpb25zLnNwbGljZSgwLCAzMCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRyYWNrIHNjcm9sbCBtb3ZlbWVudCBmb3IgZGVjbGVyYXRpb25cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgLy8gU3luYyBzY3JvbGwgcG9zaXRpb25cbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgbGV2ZWwpO1xuXG4gICAgICAvLyBPdGhlcndpc2UgZmlndXJlIG91dCB3aGV0aGVyIHdlIGFyZSBzd2l0Y2hpbmcgaW50byBkcmFnZ2luZyBtb2RlIG5vdy5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbCA9IHRoaXMub3B0aW9ucy5sb2NraW5nID8gMyA6IDA7XG4gICAgICB2YXIgbWluaW11bVRyYWNraW5nRm9yRHJhZyA9IDU7XG5cbiAgICAgIHZhciBkaXN0YW5jZVggPSBNYXRoLmFicyhjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2luaXRpYWxUb3VjaExlZnQpO1xuICAgICAgdmFyIGRpc3RhbmNlWSA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19pbml0aWFsVG91Y2hUb3ApO1xuXG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYICYmIGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZICYmIGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCB8fCB0aGlzLl9fZW5hYmxlU2Nyb2xsWSkgJiYgKGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnIHx8IGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnKTtcbiAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbGFzdCB0b3VjaCBwb3NpdGlvbnMgYW5kIHRpbWUgc3RhbXAgZm9yIG5leHQgZXZlbnRcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gc2NhbGU7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBlbmQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hFbmQodGltZVN0YW1wKSB7XG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChubyB0b3VjaHN0YXJ0IGV2ZW50IG9uIGVsZW1lbnQpXG4gICAgLy8gVGhpcyBpcyByZXF1aXJlZCBhcyB0aGlzIGxpc3RlbmVyICgndG91Y2htb3ZlJykgc2l0cyBvbiB0aGUgZG9jdW1lbnQgYW5kIG5vdCBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdCB0b3VjaGluZyBhbnltb3JlICh3aGVuIHR3byBmaW5nZXIgaGl0IHRoZSBzY3JlZW4gdGhlcmUgYXJlIHR3byB0b3VjaCBlbmQgZXZlbnRzKVxuICAgIHRoaXMuX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgICAvLyBCZSBzdXJlIHRvIHJlc2V0IHRoZSBkcmFnZ2luZyBmbGFnIG5vdy4gSGVyZSB3ZSBhbHNvIGRldGVjdCB3aGV0aGVyXG4gICAgLy8gdGhlIGZpbmdlciBoYXMgbW92ZWQgZmFzdCBlbm91Z2ggdG8gc3dpdGNoIGludG8gYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uLlxuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gUmVzZXQgZHJhZ2dpbmcgZmxhZ1xuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gU3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgbGFzdCBtb3ZlIGRldGVjdGVkIHdhcyBpbiBzb21lIHJlbGV2YW50IHRpbWUgZnJhbWVcbiAgICAgIGlmICh0aGlzLl9faXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nICYmICh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPD0gMTAwKSB7XG4gICAgICAgIC8vIFRoZW4gZmlndXJlIG91dCB3aGF0IHRoZSBzY3JvbGwgcG9zaXRpb24gd2FzIGFib3V0IDEwMG1zIGFnb1xuICAgICAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcbiAgICAgICAgdmFyIGVuZFBvcyA9IHBvc2l0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSBlbmRQb3M7XG5cbiAgICAgICAgLy8gTW92ZSBwb2ludGVyIHRvIHBvc2l0aW9uIG1lYXN1cmVkIDEwMG1zIGFnb1xuICAgICAgICBmb3IgKHZhciBpID0gZW5kUG9zOyBpID4gMCAmJiBwb3NpdGlvbnNbaV0gPiAodGhpcy5fX2xhc3RUb3VjaE1vdmUgLSAxMDApOyBpIC09IDMpIHtcbiAgICAgICAgICBzdGFydFBvcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBzdGFydCBhbmQgc3RvcCBwb3NpdGlvbiBpcyBpZGVudGljYWwgaW4gYSAxMDBtcyB0aW1lZnJhbWUsXG4gICAgICAgIC8vIHdlIGNhbm5vdCBjb21wdXRlIGFueSB1c2VmdWwgZGVjZWxlcmF0aW9uLlxuICAgICAgICBpZiAoc3RhcnRQb3MgIT09IGVuZFBvcykge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgbW92ZW1lbnQgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXG4gICAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBwb3NpdGlvbnNbZW5kUG9zXSAtIHBvc2l0aW9uc1tzdGFydFBvc107XG4gICAgICAgICAgdmFyIG1vdmVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0IC0gcG9zaXRpb25zW3N0YXJ0UG9zIC0gMl07XG4gICAgICAgICAgdmFyIG1vdmVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDFdO1xuXG4gICAgICAgICAgLy8gQmFzZWQgb24gNTBtcyBjb21wdXRlIHRoZSBtb3ZlbWVudCB0byBhcHBseSBmb3IgZWFjaCByZW5kZXIgc3RlcFxuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBtb3ZlZExlZnQgLyB0aW1lT2Zmc2V0ICogKDEwMDAgLyA2MCk7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG1vdmVkVG9wIC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuXG4gICAgICAgICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8gc3RhcnQgdGhlIGRlY2VsZXJhdGlvblxuICAgICAgICAgIHZhciBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGFnaW5nIHx8IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAxO1xuXG4gICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgd2UgaGF2ZSBlbm91Z2ggdmVsb2NpdHkgdG8gc3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA+IDEwMCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIHdhcyBhIHNsb3dlciBtb3ZlIGl0IGlzIHBlciBkZWZhdWx0IG5vbiBkZWNlbGVyYXRlZCwgYnV0IHRoaXNcbiAgICAvLyBzdGlsbCBtZWFucyB0aGF0IHdlIHdhbnQgc25hcCBiYWNrIHRvIHRoZSBib3VuZHMgd2hpY2ggaXMgZG9uZSBoZXJlLlxuICAgIC8vIFRoaXMgaXMgcGxhY2VkIG91dHNpZGUgdGhlIGNvbmRpdGlvbiBhYm92ZSB0byBpbXByb3ZlIGVkZ2UgY2FzZSBzdGFiaWxpdHlcbiAgICAvLyBlLmcuIHRvdWNoZW5kIGZpcmVkIHdpdGhvdXQgZW5hYmxlZCBkcmFnZ2luZy4gVGhpcyBzaG91bGQgbm9ybWFsbHkgZG8gbm90XG4gICAgLy8gaGF2ZSBtb2RpZmllZCB0aGUgc2Nyb2xsIHBvc2l0aW9ucyBvciBldmVuIHNob3dlZCB0aGUgc2Nyb2xsYmFycyB0aG91Z2guXG4gICAgaWYgKCF0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGlmICh0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gfHwgdGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0cnVlLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9XG5cbiAgICAvLyBGdWxseSBjbGVhbnVwIGxpc3RcbiAgICB0aGlzLl9fcG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBSSVZBVEUgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byB0aGUgY29udGVudCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXJ9IExlZnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB0b3Age051bWJlcn0gVG9wIHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciBhbmltYXRpb24gc2hvdWxkIGJlIHVzZWQgdG8gbW92ZSB0byB0aGUgbmV3IGNvb3JkaW5hdGVzXG4gICAqL1xuICBfX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKSB7XG4gICAgLy8gUmVtZW1iZXIgd2hldGhlciB3ZSBoYWQgYW4gYW5pbWF0aW9uLCB0aGVuIHdlIHRyeSB0byBjb250aW51ZVxuICAgIC8vIGJhc2VkIG9uIHRoZSBjdXJyZW50IFwiZHJpdmVcIiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgIHZhciB3YXNBbmltYXRpbmcgPSB0aGlzLl9faXNBbmltYXRpbmc7XG4gICAgaWYgKHdhc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHdhc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbmltYXRlZCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nKSB7XG4gICAgICAvLyBLZWVwIHNjaGVkdWxlZCBwb3NpdGlvbnMgZm9yIHNjcm9sbEJ5L3pvb21CeSBmdW5jdGlvbmFsaXR5LlxuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSBsZWZ0O1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gem9vbTtcblxuICAgICAgdmFyIG9sZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBvbGRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIG9sZFpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICB2YXIgZGlmZkxlZnQgPSBsZWZ0IC0gb2xkTGVmdDtcbiAgICAgIHZhciBkaWZmVG9wID0gdG9wIC0gb2xkVG9wO1xuICAgICAgdmFyIGRpZmZab29tID0gem9vbSAtIG9sZFpvb207XG5cbiAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICAgIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IG9sZExlZnQgKyAoZGlmZkxlZnQgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gb2xkVG9wICsgKGRpZmZUb3AgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fem9vbUxldmVsID0gb2xkWm9vbSArIChkaWZmWm9vbSAqIHBlcmNlbnQpO1xuXG4gICAgICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fX2NhbGxiYWNrKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2lzQW5pbWF0aW5nID09PSBpZDtcbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25JZCA9PT0gdGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSB8fCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIC8vIFdoZW4gY29udGludWluZyBiYXNlZCBvbiBwcmV2aW91cyBhbmltYXRpb24gd2UgY2hvb3NlIGFuIGVhc2Utb3V0IGFuaW1hdGlvbiBpbnN0ZWFkIG9mIGVhc2UtaW4tb3V0XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24sIHdhc0FuaW1hdGluZyA/IGVhc2VPdXRDdWJpYyA6IGVhc2VJbk91dEN1YmljKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB0aGlzLl9fem9vbUxldmVsID0gem9vbTtcblxuICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX19jYWxsYmFjayhsZWZ0LCB0b3AsIHpvb20pO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXggbWF4IHNjcm9sbCByYW5nZXNcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlY29tcHV0ZXMgc2Nyb2xsIG1pbmltdW0gdmFsdWVzIGJhc2VkIG9uIGNsaWVudCBkaW1lbnNpb25zIGFuZCBjb250ZW50IGRpbWVuc2lvbnMuXG4gICAqL1xuICBfX2NvbXB1dGVTY3JvbGxNYXgoem9vbUxldmVsKSB7XG4gICAgaWYgKHpvb21MZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB6b29tTGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIHRoaXMuX19tYXhTY3JvbGxMZWZ0ID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRXaWR0aCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRXaWR0aCwgMCk7XG4gICAgdGhpcy5fX21heFNjcm9sbFRvcCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50SGVpZ2h0ICogem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudEhlaWdodCwgMCk7XG4gIH1cblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBBTklNQVRJT04gKERFQ0VMRVJBVElPTikgU1VQUE9SVFxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIHRvdWNoIHNlcXVlbmNlIGVuZCBhbmQgdGhlIHNwZWVkIG9mIHRoZSBmaW5nZXIgd2FzIGhpZ2ggZW5vdWdoXG4gICAqIHRvIHN3aXRjaCBpbnRvIGRlY2VsZXJhdGlvbiBtb2RlLlxuICAgKi9cbiAgX19zdGFydERlY2VsZXJhdGlvbih0aW1lU3RhbXApIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX21heFNjcm9sbExlZnQpLCAwKTtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fbWF4U2Nyb2xsVG9wKSwgMCk7XG4gICAgICB2YXIgY2xpZW50V2lkdGggPSB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB2YXIgY2xpZW50SGVpZ2h0ID0gdGhpcy5fX2NsaWVudEhlaWdodDtcblxuICAgICAgLy8gV2UgbGltaXQgZGVjZWxlcmF0aW9uIG5vdCB0byB0aGUgbWluL21heCB2YWx1ZXMgb2YgdGhlIGFsbG93ZWQgcmFuZ2UsIGJ1dCB0byB0aGUgc2l6ZSBvZiB0aGUgdmlzaWJsZSBjbGllbnQgYXJlYS5cbiAgICAgIC8vIEVhY2ggcGFnZSBzaG91bGQgaGF2ZSBleGFjdGx5IHRoZSBzaXplIG9mIHRoZSBjbGllbnQgYXJlYS5cbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5mbG9vcihzY3JvbGxMZWZ0IC8gY2xpZW50V2lkdGgpICogY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5mbG9vcihzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmNlaWwoc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IDA7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gMDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGNsYXNzIG1ldGhvZFxuICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICB0aGlzLl9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBrZWVwIHRoZSBkZWNlbGVyYXRpb24gcnVubmluZ1xuICAgIHZhciBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyA9IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAwLjE7XG5cbiAgICAvLyBEZXRlY3Qgd2hldGhlciBpdCdzIHN0aWxsIHdvcnRoIHRvIGNvbnRpbnVlIGFuaW1hdGluZyBzdGVwc1xuICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IHNsb3cgZW5vdWdoIHRvIG5vdCBiZWluZyB1c2VyIHBlcmNlaXZhYmxlIGFueW1vcmUsIHdlIHN0b3AgdGhlIHdob2xlIHByb2Nlc3MgaGVyZS5cbiAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNob3VsZENvbnRpbnVlID0gTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmc7XG4gICAgICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgICAgIHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hvdWxkQ29udGludWU7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFuaW1hdGUgdG8gZ3JpZCB3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSwgb3RoZXJ3aXNlIGp1c3QgZml4IG91dC1vZi1ib3VuZGFyeSBwb3NpdGlvbnNcbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMub3B0aW9ucy5zbmFwcGluZyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gU3RhcnQgYW5pbWF0aW9uIGFuZCBzd2l0Y2ggb24gZmxhZ1xuICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2FsbGVkIG9uIGV2ZXJ5IHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxuICAgKlxuICAgKiBAcGFyYW0gaW5NZW1vcnkge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdG8gbm90IHJlbmRlciB0aGUgY3VycmVudCBzdGVwLCBidXQga2VlcCBpdCBpbiBtZW1vcnkgb25seS4gVXNlZCBpbnRlcm5hbGx5IG9ubHkhXG4gICAqL1xuICBfX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcikge1xuXG4gICAgLy9cbiAgICAvLyBDT01QVVRFIE5FWFQgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIC8vIEFkZCBkZWNlbGVyYXRpb24gdG8gc2Nyb2xsIHBvc2l0aW9uXG4gICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVg7XG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZO1xuXG5cbiAgICAvL1xuICAgIC8vIEhBUkQgTElNSVQgU0NST0xMIFBPU0lUSU9OIEZPUiBOT04gQk9VTkNJTkcgTU9ERVxuICAgIC8vXG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnRGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0LCBzY3JvbGxMZWZ0KSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpO1xuICAgICAgaWYgKHNjcm9sbExlZnRGaXhlZCAhPT0gc2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdEZpeGVkO1xuICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHNjcm9sbFRvcEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCwgc2Nyb2xsVG9wKSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCk7XG4gICAgICBpZiAoc2Nyb2xsVG9wRml4ZWQgIT09IHNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxUb3AgPSBzY3JvbGxUb3BGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFVQREFURSBTQ1JPTEwgUE9TSVRJT05cbiAgICAvL1xuXG4gICAgaWYgKHJlbmRlcikge1xuICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gU0xPVyBET1dOXG4gICAgLy9cblxuICAgIC8vIFNsb3cgZG93biB2ZWxvY2l0eSBvbiBldmVyeSBpdGVyYXRpb25cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZhY3RvciBhcHBsaWVkIHRvIGV2ZXJ5IGl0ZXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uXG4gICAgICAvLyB0byBzbG93IGRvd24gdGhlIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGVtdWxhdGUgbmF0dXJhbCBiZWhhdmlvciB3aGVyZVxuICAgICAgLy8gb2JqZWN0cyBzbG93IGRvd24gd2hlbiB0aGUgaW5pdGlhdG9yIG9mIHRoZSBtb3ZlbWVudCBpcyByZW1vdmVkXG4gICAgICB2YXIgZnJpY3Rpb25GYWN0b3IgPSAwLjk1O1xuXG4gICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gQk9VTkNJTkcgU1VQUE9SVFxuICAgIC8vXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsT3V0c2lkZVggPSAwO1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVZID0gMDtcblxuICAgICAgLy8gVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uL2FjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXNcbiAgICAgIHZhciBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgIHZhciBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcblxuICAgICAgLy8gQ2hlY2sgbGltaXRzXG4gICAgICBpZiAoc2Nyb2xsTGVmdCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxUb3AgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9XG5cbiAgICAgIC8vIFNsb3cgZG93biB1bnRpbCBzbG93IGVub3VnaCwgdGhlbiBmbGlwIGJhY2sgdG8gc25hcCBwb3NpdGlvblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKz0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgIT09IDApIHtcbiAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSArPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBlbnYgZnJvbSAnLi9lbnYnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4vY29tbW9uL3Bvb2wnO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgY29tcHV0ZUxheW91dCBmcm9tICdjc3MtbGF5b3V0JztcbmltcG9ydCB7IGlzQ2xpY2ssIFNUQVRFLCBjbGVhckNhbnZhcywgaXNHYW1lVG91Y2hFdmVudCB9IGZyb20gJy4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyc7XG5pbXBvcnQgQml0TWFwRm9udCBmcm9tICcuL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCBEZWJ1Z0luZm8gZnJvbSAnLi9jb21tb24vZGVidWdJbmZvJztcbmltcG9ydCBUaWNrZXIgZnJvbSAnLi9jb21tb24vdGlja2VyJztcbmltcG9ydCB7IGNyZWF0ZSwgcmVuZGVyQ2hpbGRyZW4sIGxheW91dENoaWxkcmVuLCByZXBhaW50Q2hpbGRyZW4sIGl0ZXJhdGVUcmVlLCBjbG9uZSwgcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbW1vbi92ZCc7XG5pbXBvcnQgUmVjdCBmcm9tICcuL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMsIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cyc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL2NvbXBvbmVudHMvc3R5bGUnO1xuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCwgQ2FsbGJhY2sgfSBmcm9tICcuL3R5cGVzL2luZGV4JztcblxuLy8g5YWo5bGA5LqL5Lu2566h6YGTXG5jb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuY29uc3QgaW1nUG9vbCA9IG5ldyBQb29sKCdpbWdQb29sJyk7XG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2woJ2JpdE1hcFBvb2wnKTtcbmNvbnN0IGRlYnVnSW5mbyA9IG5ldyBEZWJ1Z0luZm8oKTtcblxuaW50ZXJmYWNlIElWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVZpZXdQb3J0Qm94IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVyRGF0YSB7XG4gIGhhc0V2ZW50QmluZDogYm9vbGVhbjtcbiAgdG91Y2hNc2c6IHtcbiAgICBba2V5OiBzdHJpbmddOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB9O1xuICBoYW5kbGVyczoge1xuICAgIHRvdWNoU3RhcnQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hNb3ZlOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoRW5kOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoQ2FuY2VsOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgSVBsdWdpbjxUPiB7XG4gIG5hbWU6IHN0cmluZztcbiAgaW5zdGFsbDogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG4gIHVuaW5zdGFsbD86IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIOm7mOiupOaatOmcsiBMYXlvdXQg55qE5a6e5L6L77yM5L2G5Zyo5p+Q5Lqb5Zy65pmv5LiL77yM5Y+v6IO96ZyA6KaB5aSa5LiqIExheW91dCDlrp7kvovvvIzlm6DmraQgTGF5b3V0IOexu+S5n+aatOmcsuWHuuWOu1xuICogY29uc3QgbXlMYXlvdXQgPSBuZXcgTGF5b3V0KHtcbiAqICAgc3R5bGU6IHtcbiAqICAgICAgd2lkdGg6IDAsXG4gKiAgICAgIGhlaWdodDogMCxcbiAqICAgfSxcbiAqICBuYW1lOiAnbXlMYXlvdXROYW1lJyxcbiAqIH0pO1xuICovXG5jbGFzcyBMYXlvdXQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOW9k+WJjSBMYXlvdXQg54mI5pys77yM5LiA6Iis6Lef5bCP5ri45oiP5o+S5Lu254mI5pys5a+56b2QXG4gICAqL1xuICBwdWJsaWMgdmVyc2lvbiA9ICcxLjAuOCc7XG5cbiAgZW52ID0gZW52O1xuICBcbiAgLyoqXG4gICAqIExheW91dCDmuLLmn5PnmoTnm67moIfnlLvluIPlr7nlupTnmoQgMmQgY29udGV4dFxuICAgKi9cbiAgcHVibGljIHJlbmRlckNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgcmVuZGVycG9ydDogSVZpZXdQb3J0ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfTtcbiAgcHVibGljIHZpZXdwb3J0OiBJVmlld1BvcnRCb3ggPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgfTtcblxuICAvKipcbiAgICog55S75biD5bC65a+45ZKM5a6e6ZmF6KKr5riy5p+T5Yiw5bGP5bmV55qE54mp55CG5bC65a+45q+UXG4gICAqL1xuICBwdWJsaWMgdmlld3BvcnRTY2FsZSA9IDE7XG4gIC8qKlxuICAgKiDnlKjkuo7moIfor4Z1cGRhdGVWaWV3UG9ydOaWueazleaYr+WQpuiiq+iwg+eUqOi/h+S6hu+8jOi/meWcqOWwj+a4uOaIj+eOr+Wig+mdnuW4uOmHjeimgVxuICAgKi9cbiAgcHVibGljIGhhc1ZpZXdQb3J0U2V0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOacgOe7iOa4suafk+WIsOWxj+W5leeahOW3puS4iuinkueJqeeQhuWdkOagh1xuICAgKi9cbiAgcHVibGljIHJlYWxMYXlvdXRCb3g6IHtcbiAgICByZWFsWDogbnVtYmVyO1xuICAgIHJlYWxZOiBudW1iZXI7XG4gIH0gPSB7XG4gICAgICByZWFsWDogMCxcbiAgICAgIHJlYWxZOiAwLFxuICAgIH07XG5cbiAgcHVibGljIGJpdE1hcEZvbnRzOiBCaXRNYXBGb250W10gPSBbXTtcbiAgcHVibGljIGVsZUNvdW50ID0gMDtcbiAgcHVibGljIHN0YXRlOiBTVEFURSA9IFNUQVRFLlVOSU5JVDtcblxuICAvKipcbiAgICog55So5LqO5ZyoIHRpY2tlciDnmoTlvqrnjq/ph4zpnaLmoIfor4blvZPliY3luKfmmK/lkKbpnIDopoHph43nu5hcbiAgICog6YeN57uY5LiA6Iis5piv5Zu+54mH5Yqg6L295a6M5oiQ44CB5paH5a2X5L+u5pS5562J5Zy65pmvXG4gICAqL1xuICBwdWJsaWMgaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICBwdWJsaWMgdGlja2VyOiBUaWNrZXIgPSBuZXcgVGlja2VyKCk7XG4gIHB1YmxpYyB0aWNrZXJGdW5jID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmlzRGlydHkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdiZWZvcmVfcmVmbG93JylcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlX3JlZmxvdycsICcnKTtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTmVlZFJlcGFpbnQpIHtcbiAgICAgIHRoaXMucmVwYWludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGV2ZW50SGFuZGxlckRhdGE6IEV2ZW50SGFuZGxlckRhdGE7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlLFxuICB9OiB7XG4gICAgc3R5bGU/OiBJU3R5bGU7XG4gICAgbmFtZT86IHN0cmluZztcbiAgfSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWQ6IDAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEgPSB7XG4gICAgICBoYXNFdmVudEJpbmQ6IGZhbHNlLFxuICAgICAgdG91Y2hNc2c6IHt9LFxuICAgICAgaGFuZGxlcnM6IHtcbiAgICAgICAgdG91Y2hTdGFydDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoc3RhcnQnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaE1vdmU6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaG1vdmUnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaEVuZDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoZW5kJykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hDYW5jZWw6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGNhbmNlbCcpLmJpbmQodGhpcyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDlr7nkuo7kuI3kvJrlvbHlk43luIPlsYDnmoTmlLnliqjvvIzmr5TlpoLlm77niYflj6rmmK/mlLnkuKrlnLDlnYDjgIHliqDkuKrog4zmma/oibLkuYvnsbvnmoTmlLnliqjvvIzkvJrop6blj5EgTGF5b3V0IOeahCByZXBhaW50IOaTjeS9nFxuICAgICAqIOinpuWPkeeahOaWueW8j+aYr+e7mSBMYXlvdXQg5oqb5LiqIGByZXBhaW50YCDnmoTkuovku7bvvIzkuLrkuobmgKfog73vvIzmr4/mrKHmjqXmlLbliLAgcmVwYWludCDor7fmsYLkuI3kvJrmiafooYznnJ/mraPnmoTmuLLmn5NcbiAgICAgKiDogIzmmK/miafooYzkuIDkuKrnva7ohI/mk43kvZzvvIx0aWNrZXIg5q+P5LiA5qyh5omn6KGMIHVwZGF0ZSDkvJrmo4Dmn6Xov5nkuKrmoIforrDkvY3vvIzov5vogIzmiafooYznnJ/mraPnmoTph43nu5jmk43kvZxcbiAgICAgKi9cbiAgICB0aGlzLm9uKCdyZXBhaW50JywgKCkgPT4ge1xuICAgICAgdGhpcy5pc05lZWRSZXBhaW50ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOWwhiBUd2VlbiDmjILovb3liLAgTGF5b3V077yM5a+55LqOIFR3ZWVuIOeahOS9v+eUqOWujOWFqOmBteW+qiBUd2Vlbi5qcyDnmoTmlofmoaNcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qcy9cbiAgICAgKiDlj6rkuI3ov4flvZMgVHdlZW4g5pS55Yqo5LqG6IqC54K55Lya6Kem5Y+RIHJlcGFpbnTjgIFyZWZsb3cg55qE5bGe5oCn5pe277yMTGF5b3V0IOS8muaJp+ihjOebuOW6lOeahOaTjeS9nFxuICAgICAqIOS4muWKoeS+p+S4jeeUqOaEn+efpeWIsCByZXBhaW50IOWSjCByZWZsb3dcbiAgICAgKi9cbiAgICAvLyB0aGlzLlRXRUVOID0gVFdFRU47XG4gICAgY29uc29sZS5sb2coYFtMYXlvdXRdIHYke3RoaXMudmVyc2lvbn1gKTtcbiAgfVxuXG4gIC8vIOS4juiAgeeJiOacrOWFvOWuuVxuICBnZXQgZGVidWdJbmZvKCkge1xuICAgIGxldCBpbmZvID0gZGVidWdJbmZvLmxvZygpO1xuXG4gICAgaW5mbyArPSBgZWxlbWVudENvdW50OiAke3RoaXMuZWxlQ291bnR9XFxuYDtcblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIOabtOaWsOiiq+e7mOWItmNhbnZhc+eahOeql+WPo+S/oeaBr++8jOacrOa4suafk+W8leaTjuW5tuS4jeWFs+W/g+aYr+WQpuS8muWSjOWFtuS7lua4uOaIj+W8leaTjuWFseWQjOS9v+eUqFxuICAgKiDogIzmnKzouqvlj4jpnIDopoHmlK/mjIHkuovku7blpITnkIbvvIzlm6DmraTvvIzlpoLmnpzooqvmuLLmn5PlhoXlrrnmmK/nu5jliLbliLDnprvlsY9jYW52YXPvvIzpnIDopoHlsIbmnIDnu4jnu5jliLblnKjlsY/luZXkuIpcbiAgICog55qE57ud5a+55bC65a+45ZKM5L2N572u5L+h5oGv5pu05paw5Yiw5pys5riy5p+T5byV5pOO44CCXG4gICAqIOWFtuS4re+8jHdpZHRo5Li654mp55CG5YOP57Sg5a695bqm77yMaGVpZ2h05Li654mp55CG5YOP57Sg6auY5bqm77yMeOS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oHjlnZDmoIfvvIx55Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgXG4gICAqIHnlnZDmoIdcbiAgICovXG4gIHVwZGF0ZVZpZXdQb3J0KGJveDogSVZpZXdQb3J0Qm94KSB7XG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IGJveC53aWR0aCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQuaGVpZ2h0ID0gYm94LmhlaWdodCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueCA9IGJveC54IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC55ID0gYm94LnkgfHwgMDtcblxuICAgIHRoaXMucmVhbExheW91dEJveCA9IHtcbiAgICAgIHJlYWxYOiB0aGlzLnZpZXdwb3J0LngsXG4gICAgICByZWFsWTogdGhpcy52aWV3cG9ydC55LFxuICAgIH07XG5cbiAgICB0aGlzLmhhc1ZpZXdQb3J0U2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXQodGVtcGxhdGU6IHN0cmluZywgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIGF0dHJWYWx1ZVByb2Nlc3NvcjogQ2FsbGJhY2spIHtcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXQnKTtcbiAgICBjb25zdCBwYXJzZUNvbmZpZyA9IHtcbiAgICAgIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICcnLFxuICAgICAgYXR0ck5vZGVOYW1lOiAnYXR0cicsIC8vIGRlZmF1bHQgaXMgJ2ZhbHNlJ1xuICAgICAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICBpZ25vcmVOYW1lU3BhY2U6IHRydWUsXG4gICAgICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgcGFyc2VOb2RlVmFsdWU6IGZhbHNlLFxuICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gICAgICB0cmltVmFsdWVzOiB0cnVlLFxuICAgICAgcGFyc2VUcnVlTnVtYmVyT25seTogZmFsc2UsXG4gICAgICBhbHdheXNDcmVhdGVUZXh0Tm9kZTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgaWYgKGF0dHJWYWx1ZVByb2Nlc3NvciAmJiB0eXBlb2YgYXR0clZhbHVlUHJvY2Vzc29yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwYXJzZUNvbmZpZy5hdHRyVmFsdWVQcm9jZXNzb3IgPSBhdHRyVmFsdWVQcm9jZXNzb3I7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0X3htbFBhcnNlJyk7XG4gICAgLy8g5bCGeG1s5a2X56ym5Liy6Kej5p6Q5oiQeG1s6IqC54K55qCRXG4gICAgY29uc3QganNvbk9iaiA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZSwgcGFyc2VDb25maWcsIHRydWUpO1xuICAgIC8vIGNvbnNvbGUubG9nKGpzb25PYmopXG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdF94bWxQYXJzZScpO1xuXG4gICAgY29uc3QgeG1sVHJlZSA9IGpzb25PYmouY2hpbGRyZW5bMF07XG5cbiAgICAvLyBYTUzmoJHnlJ/miJDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sMkxheW91dCcpO1xuICAgIGNvbnN0IGxheW91dFRyZWUgPSBjcmVhdGUuY2FsbCh0aGlzLCB4bWxUcmVlLCBzdHlsZSk7XG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdF94bWwyTGF5b3V0Jyk7XG5cbiAgICB0aGlzLmFkZChsYXlvdXRUcmVlKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5JTklURUQ7XG5cbiAgICB0aGlzLnRpY2tlci5hZGQodGhpcy50aWNrZXJGdW5jLCB0cnVlKTtcbiAgICB0aGlzLnRpY2tlci5zdGFydCgpO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdCcpO1xuICB9XG5cbiAgcmVmbG93KGlzRmlyc3QgPSBmYWxzZSkge1xuICAgIGlmICghaXNGaXJzdCkge1xuICAgICAgZGVidWdJbmZvLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfcmVmbG93Jyk7XG4gICAgLyoqXG4gICAgICog6K6h566X5biD5bGA5qCRXG4gICAgICog57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga9cbiAgICAgKiBMYXlvdXTmnKzouqvlubbkuI3kvZzkuLrluIPlsYDorqHnrpfvvIzlj6rmmK/kvZzkuLroioLngrnmoJHnmoTlrrnlmahcbiAgICAgKi9cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2NvbXB1dGVMYXlvdXQnLCB0cnVlKTtcbiAgICBjb21wdXRlTGF5b3V0KHRoaXMuY2hpbGRyZW5bMF0pO1xuICAgIGRlYnVnSW5mby5lbmQoJ2NvbXB1dGVMYXlvdXQnKTtcblxuICAgIGNvbnN0IHJvb3RFbGUgPSB0aGlzLmNoaWxkcmVuWzBdO1xuXG4gICAgaWYgKHJvb3RFbGUuc3R5bGUud2lkdGggPT09IHVuZGVmaW5lZCB8fCByb290RWxlLnN0eWxlLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2Ugc2V0IHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydHkgZm9yIHJvb3QgZWxlbWVudCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQud2lkdGggPSByb290RWxlLnN0eWxlLndpZHRoO1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LmhlaWdodCA9IHJvb3RFbGUuc3R5bGUuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIOWwhuW4g+WxgOagkeeahOW4g+WxgOS/oeaBr+WKoOW3pei1i+WAvOWIsOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICBsYXlvdXRDaGlsZHJlbih0aGlzKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRDaGlsZHJlbicpO1xuXG4gICAgdGhpcy52aWV3cG9ydFNjYWxlID0gdGhpcy52aWV3cG9ydC53aWR0aCAvIHRoaXMucmVuZGVycG9ydC53aWR0aDtcblxuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgLy8g6YGN5Y6G6IqC54K55qCR77yM5L6d5qyh6LCD55So6IqC54K555qE5riy5p+T5o6l5Y+j5a6e546w5riy5p+TXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZW5kZXJDaGlsZHJlbicsIHRydWUpO1xuICAgIHJlbmRlckNoaWxkcmVuKHRoaXMuY2hpbGRyZW4sIHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZhbHNlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZW5kZXJDaGlsZHJlbicpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZXBhaW50JywgdHJ1ZSk7XG4gICAgdGhpcy5yZXBhaW50KCk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVwYWludCcpO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuXG4gICAgLy8gaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgKGVsZSkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coZWxlLnByb3BzKTtcbiAgICAvLyB9KTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9yZWZsb3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml06Zi25q615qC45b+D5LuF5LuF5piv5qC55o2ueG1s5ZKMY3Nz5Yib5bu65LqG6IqC54K55qCRXG4gICAqIOimgeWunueOsOecn+ato+eahOa4suafk++8jOmcgOimgeiwg+eUqCBsYXlvdXQg5Ye95pWw77yM5LmL5omA5Lul5bCGIGxheW91dCDljZXni6zmir3osaHkuLrkuIDkuKrlh73mlbDvvIzmmK/lm6DkuLogbGF5b3V0IOW6lOW9k+aYr+WPr+S7pemHjeWkjeiwg+eUqOeahFxuICAgKiDmr5TlpoLmlLnlj5jkuobkuIDkuKrlhYPntKDnmoTlsLrlr7jvvIzlrp7pmYXkuIroioLngrnmoJHmmK/msqHlj5jnmoTvvIzku4Xku4XmmK/pnIDopoHph43mlrDorqHnrpfluIPlsYDvvIznhLblkI7muLLmn5NcbiAgICog5LiA5Liq5a6M5pW055qEIGxheW91dCDliIbmiJDkuIvpnaLnmoTlh6DmraXvvJpcbiAgICogMS4g5omn6KGM55S75biD5riF55CG77yM5Zug5Li65biD5bGA5Y+Y5YyW6aG16Z2i6ZyA6KaB6YeN57uY77yM6L+Z6YeM5rKh5pyJ5YGa5b6I6auY57qn55qE5YmU6Zmk562J5pON5L2c77yM5LiA5b6L5riF6Zmk6YeN55S777yM5a6e6ZmF5LiK5oCn6IO95bey57uP5b6I5aW9XG4gICAqIDIuIOiKgueCueagkemDveWQq+aciSBzdHlsZSDlsZ7mgKfvvIxjc3MtbGF5b3V0IOiDveWkn+agueaNrui/meS6m+S/oeaBr+iuoeeul+WHuuacgOe7iOW4g+WxgO+8jOivpuaDheWPr+ingSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9jc3MtbGF5b3V0XG4gICAqIDMuIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGv77yM5L2G6L+Z5Lqb5L+h5oGv5bm25LiN5piv6IO95aSf55u05o6l55So55qEXG4gICAqICAgIOavlOWmgiBsYXlvdXQudG9wIOaYr+aMh+WcqOS4gOS4queItuWuueWZqOWGheeahCB0b3DvvIzmnIDnu4jopoHlrp7njrDmuLLmn5PvvIzlrp7pmYXkuIropoHpgJLlvZLliqDkuIrlpI3lrrnlmajnmoQgdG9wXG4gICAqICAgIOi/meagt+avj+asoSByZXBhaW50IOeahOaXtuWAmeWPqumcgOimgeebtOaOpeS9v+eUqOiuoeeul+WlveeahOWAvOWNs+WPr++8jOS4jemcgOimgeavj+asoemDvemAkuW9kuiuoeeul1xuICAgKiAgICDov5nkuIDmraXnp7DkuLogbGF5b3V0Q2hpbGRyZW7vvIznm67nmoTlnKjkuo7lsIYgY3NzLWxheW91dCDov5vkuIDmraXlpITnkIbkuLrlj6/ku6XmuLLmn5Pnm7TmjqXnlKjnmoTluIPlsYDkv6Hmga9cbiAgICogNC4gcmVuZGVyQ2hpbGRyZW7vvJrmiafooYzmuLLmn5NcbiAgICogNS4gYmluZEV2ZW50c++8muaJp+ihjOS6i+S7tue7keWumlxuICAgKi9cbiAgLy8gQHRzLWlnbm9yZVxuICBsYXlvdXQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0ID0gY29udGV4dDtcblxuICAgIGlmICghdGhpcy5oYXNWaWV3UG9ydFNldCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIGludm9rZSBtZXRob2QgYHVwZGF0ZVZpZXdQb3J0YCBiZWZvcmUgbWV0aG9kIGBsYXlvdXRgJyk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXQnKTtcblxuICAgIHRoaXMucmVmbG93KHRydWUpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb3RoZXInKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50JywgdHJ1ZSk7XG4gICAgaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgZWxlbWVudCA9PiBlbGVtZW50Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCkpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlJFTkRFUkVEO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Jyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X290aGVyJyk7XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM6IqC54K55pWw55qE6YeN57uY5Yi277yM5LiA6Iis5Lia5Yqh5L6n5peg6ZyA6LCD55So6K+l5pa55rOVXG4gICAqL1xuICByZXBhaW50KCkge1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgdGhpcy5pc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gICAgcmVwYWludENoaWxkcmVuKHRoaXMuY2hpbGRyZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOi/lOWbnuS4gOS4quiKgueCueWcqOWxj+W5leS4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr++8jOWJjeaPkOaYr+ato+ehruiwg+eUqHVwZGF0ZVZpZXdQb3J044CCXG4gICAqL1xuICBnZXRFbGVtZW50Vmlld3BvcnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7IHJlYWxMYXlvdXRCb3gsIHZpZXdwb3J0U2NhbGUgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgYWJzb2x1dGVYLFxuICAgICAgYWJzb2x1dGVZLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfSA9IGVsZW1lbnQubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWDtcbiAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdmlld3BvcnRTY2FsZTtcbiAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdmlld3BvcnRTY2FsZTtcblxuICAgIHJldHVybiBuZXcgUmVjdChcbiAgICAgIHJlYWxYLFxuICAgICAgcmVhbFksXG4gICAgICByZWFsV2lkdGgsXG4gICAgICByZWFsSGVpZ2h0LFxuICAgICk7XG4gIH1cblxuICBnZXRDaGlsZEJ5UG9zKHRyZWU6IExheW91dCB8IEVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpdGVtTGlzdDogKExheW91dCB8IEVsZW1lbnQpW10pIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBhYnNvbHV0ZVgsXG4gICAgICAgIGFic29sdXRlWSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgIH0gPSBlbGUubGF5b3V0Qm94O1xuICAgICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWTtcbiAgICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdGhpcy52aWV3cG9ydFNjYWxlO1xuICAgICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHRoaXMudmlld3BvcnRTY2FsZTtcblxuICAgICAgaWYgKChyZWFsWCA8PSB4ICYmIHggPD0gcmVhbFggKyByZWFsV2lkdGgpICYmIChyZWFsWSA8PSB5ICYmIHkgPD0gcmVhbFkgKyByZWFsSGVpZ2h0KSkge1xuICAgICAgICAvKipcbiAgICAgICAgICog55u45YWzaXNzdWXvvJpodHRwczovL2dpdGh1Yi5jb20vd2VjaGF0LW1pbmlwcm9ncmFtL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvaXNzdWVzLzE3XG4gICAgICAgICAqIOi/memHjOWPquimgea7oei2s+adoeS7tueahOmDveimgeiusOW9le+8jOWQpuWImeWPr+iDveWHuueOsCBpc3N1ZSDph4zpnaLmj5DliLDnmoTpl67pophcbiAgICAgICAgICovXG4gICAgICAgIGl0ZW1MaXN0LnB1c2goZWxlKTtcbiAgICAgICAgaWYgKGVsZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmdldENoaWxkQnlQb3MoZWxlLCB4LCB5LCBpdGVtTGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV2ZW50SGFuZGxlciA9IChldmVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBsZXQgdG91Y2g6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG5cbiAgICAgIGlmIChpc0dhbWVUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgIHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG91Y2ggPSBlO1xuICAgICAgfVxuICAgICAgLy8gY29uc3QgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkgfHwgZTtcbiAgICAgIGlmICghdG91Y2ggfHwgIXRvdWNoLnBhZ2VYIHx8ICF0b3VjaC5wYWdlWSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gudGltZVN0YW1wKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdG91Y2gudGltZVN0YW1wID0gZS50aW1lU3RhbXA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdID0gW107XG4gICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKHRoaXMsIHRvdWNoLnBhZ2VYLCB0b3VjaC5wYWdlWSwgbGlzdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoZXZlbnROYW1lLCBlKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2dbZXZlbnROYW1lXSA9IHRvdWNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnICYmIGlzQ2xpY2sodGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnKSkge1xuICAgICAgICBpdGVtICYmIGl0ZW0uZW1pdCgnY2xpY2snLCBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOWFqOWxgOeahOS6i+S7tue7keWumumAu+i+kSBcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcbiAgICBlbnYub25Ub3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICBlbnYub25Ub3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgZW52Lm9uVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICBlbnYub25Ub3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWFqOWxgOS6i+S7tuino+e7kSBcbiAgICovXG4gIHVuQmluZEV2ZW50cygpIHtcbiAgICBlbnYub2ZmVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICBlbnYub2ZmVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICBlbnYub2ZmVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgRUUuZW1pdChldmVudCwgZGF0YSk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95QWxsKHRyZWU6IExheW91dCB8IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGlsZHJlbixcbiAgICB9ID0gdHJlZTtcblxuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmRlc3Ryb3lBbGwoY2hpbGQpO1xuICAgICAgY2hpbGQuZGVzdHJveVNlbGYgJiYgY2hpbGQuZGVzdHJveVNlbGYoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmuIXnkIbnlLvluIPvvIzkuYvliY3nmoTorqHnrpflh7rmnaXnmoTmuLLmn5PmoJHkuZ/kvJrkuIDlubbmuIXnkIbvvIzmraTml7blj6/ku6Xlho3mrKHmiafooYxpbml05ZKMbGF5b3V05pa55rOV5riy5p+T55WM6Z2i44CCXG4gICAqL1xuICBjbGVhcihvcHRpb25zOiB7IHJlbW92ZVRpY2tlcj86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgeyByZW1vdmVUaWNrZXIgPSB0cnVlIH0gPSBvcHRpb25zO1xuXG4gICAgZGVidWdJbmZvLnJlc2V0KCk7XG4gICAgdGhpcy5kZXN0cm95QWxsKHRoaXMpO1xuICAgIC8vIHRoaXMuZWxlbWVudFRyZWUgPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuQ0xFQVI7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgdGhpcy5lbGVDb3VudCA9IDA7XG4gICAgdGhpcy51bkJpbmRFdmVudHMoKTtcblxuICAgIGlmIChyZW1vdmVUaWNrZXIpIHtcbiAgICAgIHRoaXMudGlja2VyLnJlbW92ZSgpO1xuICAgICAgdGhpcy50aWNrZXIuc3RvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbm5lcueahOW6lOivpem7mOiupOmDveenu+mZpO+8jOWQpuWImeWJjeWQjuS4pOasoeWIneWni+WMluS8muWvvOiHtOWJjeWQjueKtuaAgeaciemXrumimFxuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlSW5uZXIoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclBvb2woKSB7XG4gICAgaW1nUG9vbC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOavlOi1tyBMYXlvdXQuY2xlYXIg5pu05b275bqV55qE5riF55CG77yM5Lya5riF56m65Zu+54mH5a+56LGh5rGg77yM5YeP5bCR5YaF5a2Y5Y2g55So44CCXG4gICAqL1xuICBjbGVhckFsbCgpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNsZWFyUG9vbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWvueS6juWbvueJh+i1hOa6kO+8jOWmguaenOS4jeaPkOWJjeWKoOi9ve+8jOa4suafk+i/h+eoi+S4reWPr+iDveWHuueOsOaMqOS4quWHuueOsOWbvueJh+aViOaenO+8jOW9seWTjeS9k+mqjFxuICAgKiDpgJrov4dMYXlvdXQubG9hZEltZ3Plj6/ku6XpooTliqDovb3lm77niYfotYTmupDvvIzlnKjosIPnlKhMYXlvdXQubGF5b3V055qE5pe25YCZ5riy5p+T5oCn6IO95pu05aW977yM5L2T6aqM5pu05L2z44CCXG4gICAqL1xuICBsb2FkSW1ncyhhcnI6IHN0cmluZ1tdID0gW10pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXJyLm1hcChzcmMgPT4gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZVByb21pc2Uoc3JjKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOazqOWGjCBiaXRtYXB0ZXh0IOWPr+eUqOeahOWtl+S9k+OAgiBcbiAgICovXG4gIHJlZ2lzdEJpdE1hcEZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJpdE1hcFBvb2wuZ2V0KG5hbWUpKSB7XG4gICAgICBjb25zdCBmb250ID0gbmV3IEJpdE1hcEZvbnQobmFtZSwgc3JjLCBjb25maWcpO1xuICAgICAgdGhpcy5iaXRNYXBGb250cy5wdXNoKGZvbnQpO1xuICAgICAgYml0TWFwUG9vbC5zZXQobmFtZSwgZm9udClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWL6ZqG6IqC54K577yM5YWL6ZqG5ZCO55qE6IqC54K55Y+v5Lul5re75Yqg5YiwIExheW91dCDnmoTmn5DkuKroioLngrnkuK1cbiAgICog6K+l5pa55rOV5Y+v5Lul5Zyo5pWw5o2u5pyJ5Y+Y5YyW55qE5pe25YCZ6YG/5YWN6YeN5paw5omn6KGMIExheW91dC5pbml0IOa1geeoi+OAglxuICAgKi9cbiAgY2xvbmVOb2RlKGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNsb25lPExheW91dD4odGhpcywgZWxlbWVudCwgZGVlcCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG57uE5Lu25oyC5YiwTGF5b3V0XG4gICAqL1xuICBFbGVtZW50ID0gRWxlbWVudDtcbiAgVmlldyA9IFZpZXc7XG4gIFRleHQgPSBUZXh0O1xuICBJbWFnZSA9IEltYWdlO1xuICBTY3JvbGxWaWV3ID0gU2Nyb2xsVmlldztcbiAgQml0TWFwVGV4dCA9IEJpdE1hcFRleHQ7XG4gIENhbnZhcyA9IENhbnZhcztcbiAgQnV0dG9uID0gQnV0dG9uO1xuXG4gIHJlZ2lzdGVyQ29tcG9uZW50ID0gcmVnaXN0ZXJDb21wb25lbnQ7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFsbGVkUGx1Z2luczogSVBsdWdpbjxMYXlvdXQ+W10gPSBbXTtcbiAgLyoqXG4gICAqIOWuieijhee7meWumueahOaPkuS7tiBcbiAgICovXG4gIHVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBpZiAoTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuaW5jbHVkZXMocGx1Z2luKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSDor6Xmj5Lku7blt7Llronoo4UuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGx1Z2luLmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMucHVzaChwbHVnaW4pO1xuXG4gICAgLy8gY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Llronoo4VgKVxuICB9XG5cbiAgLyoqXG4gICAqIOWNuOi9vee7meWumuaPkuS7tiBcbiAgICovXG4gIHVuVXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGNvbnN0IHBsdWdpbkluZGV4ID0gTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pO1xuXG4gICAgaWYgKHBsdWdpbkluZGV4ID09PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSBUaGlzIHBsdWdpbiBpcyBub3QgaW5zdGFsbGVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwbHVnaW4udW5pbnN0YWxsKSB7XG4gICAgICBwbHVnaW4udW5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5Y246L29YClcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5zcGxpY2UocGx1Z2luSW5kZXgsIDEpO1xuICB9XG59XG5cbmNvbnN0IGxheW91dCA9IG5ldyBMYXlvdXQoe1xuICBzdHlsZToge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfSxcbiAgbmFtZTogJ2xheW91dCcsXG59KTtcblxuZXhwb3J0IHtcbiAgbGF5b3V0IGFzIGRlZmF1bHQsXG4gIExheW91dCxcbiAgZW52LFxuICBFRSxcbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
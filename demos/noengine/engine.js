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
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tiny-emitter */ "./node_modules/tiny-emitter/index.js");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_1__);


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
        this.event = new (tiny_emitter__WEBPACK_IMPORTED_MODULE_1___default().TinyEmitter)();
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
/* harmony export */   convertPercent: () => (/* binding */ convertPercent),
/* harmony export */   copyTouchArray: () => (/* binding */ copyTouchArray),
/* harmony export */   isClick: () => (/* binding */ isClick),
/* harmony export */   isGameTouchEvent: () => (/* binding */ isGameTouchEvent),
/* harmony export */   isPercent: () => (/* binding */ isPercent),
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
function convertPercent(data, parentData) {
    if (typeof data === 'number' || data === null) {
        return data;
    }
    var matchData = data.match(/(\d+(?:\.\d+)?)%/);
    if (matchData && matchData[1]) {
        return parentData * parseFloat(matchData[1]) * 0.01;
    }
}
function isPercent(data) {
    return typeof data === 'string' && /\d+(?:\.\d+)?%/.test(data);
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
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./src/common/util.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env */ "./src/env.ts");
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
            parentStyle = _env__WEBPACK_IMPORTED_MODULE_2__["default"].getRootCanvasSize();
        }
        if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isPercent)(thisStyle.width)) {
            thisStyle.width = parentStyle.width ? (0,_util__WEBPACK_IMPORTED_MODULE_1__.convertPercent)(thisStyle.width, parentStyle.width) : 0;
        }
        if ((0,_util__WEBPACK_IMPORTED_MODULE_1__.isPercent)(thisStyle.height)) {
            thisStyle.height = parentStyle.height ? (0,_util__WEBPACK_IMPORTED_MODULE_1__.convertPercent)(thisStyle.height, parentStyle.height) : 0;
        }
        if (typeof thisStyle.opacity === 'undefined') {
            thisStyle.opacity = 1;
        }
        if (parentStyle && parentStyle.opacity !== 1 && typeof parentStyle.opacity === 'number') {
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
        // 记录上一个字符，方便处理 kerning
        var prevCharCode = null;
        for (var i = 0, len = this.value.length; i < len; i++) {
            var char = this.value[i];
            var cfg = this.font.chars[char];
            if (cfg) {
                if (prevCharCode && cfg.kerning[prevCharCode]) {
                    width += cfg.kerning[prevCharCode];
                }
                width += cfg.xadvance;
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
                drawX += (width - realWidth);
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


var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var _this = _super.call(this, {
            idName: idName,
            className: className,
            style: __assign(__assign({ width: 300, height: 60, lineHeight: 60, fontSize: 30, borderRadius: 10, backgroundColor: '#34a123', color: '#ffffff', textAlign: 'center' }, style), { ':active': __assign({ transform: 'scale(1.05, 1.05)' }, style[':active']) }),
            value: value,
            dataset: dataset,
        }) || this;
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
            var scale = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.lerp)(_this.fromScale, _this.toScale, ratio);
            var transform = "scale(".concat(scale, ", ").concat(scale, ")");
            _this.style.transform = transform;
            if (ratio === 1) {
                _this.scaleDone = true;
            }
        };
        return _this;
    }
    Button.prototype.afterCreate = function () {
        // @ts-ignore
        this.root.ticker.add(this.update);
    };
    Button.prototype.destroySelf = function () {
        // @ts-ignore
        this.root.ticker.remove(this.update);
        this.isDestroyed = true;
        this.root = null;
    };
    return Button;
}(_text__WEBPACK_IMPORTED_MODULE_0__["default"]));
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
/* harmony export */   StyleOpType: () => (/* binding */ StyleOpType),
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
/* harmony import */ var _common_util__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/util */ "./src/common/util.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../env */ "./src/env.ts");
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
        if (child.classList.contains(className)) {
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
var EE = new (tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default().TinyEmitter)();
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
var StyleOpType;
(function (StyleOpType) {
    StyleOpType[StyleOpType["Set"] = 0] = "Set";
    StyleOpType[StyleOpType["Delete"] = 1] = "Delete";
})(StyleOpType || (StyleOpType = {}));
var ElementClassList = /** @class */ (function () {
    function ElementClassList(ele, initialTokens) {
        this.element = ele;
        this.tokens = new Set(initialTokens || []);
    }
    Object.defineProperty(ElementClassList.prototype, "length", {
        get: function () {
            return this.tokens.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ElementClassList.prototype, "value", {
        get: function () {
            return Array.from(this.tokens).join(' ');
        },
        enumerable: false,
        configurable: true
    });
    ElementClassList.prototype.changeHandler = function () {
        var ele = this.element;
        var oldStyle = Object.assign({}, ele.style);
        // 根据 className 从样式表中算出当前应该作用的样式
        // @ts-ignore
        var newStyle = Array.from(this.tokens).reduce(function (res, oneClass) { return Object.assign(res, ele.root.styleSheet[oneClass]); }, {});
        // console.log('newStyle', newStyle)
        var parentStyle;
        if (ele.parent) {
            parentStyle = ele.parent.style;
        }
        else {
            parentStyle = _env__WEBPACK_IMPORTED_MODULE_6__["default"].getRootCanvasSize();
        }
        if (typeof newStyle.opacity === 'undefined') {
            newStyle.opacity = 1;
        }
        Object.keys(newStyle).concat(Object.keys(oldStyle)).forEach(function (key) {
            // 手动通过this.style设置过的样式认为是内联样式，优先级最高，也就是 className 的属性不影响
            if (!Reflect.has(ele.innerStyle, key)) {
                // 根据 className 计算出来的新增或者修改的样式
                if (Reflect.has(newStyle, key)) {
                    /**
                     * 新增的样式，需要区分出是 className 导致的还是开发者手动修改的
                     * 临时占位，因为后续的 reflow 和 repaint 逻辑在 style Proxy 处理，这样做在 style Proxy 也不会认为是开发者手动设置的样式
                     */
                    if (!Reflect.has(oldStyle, key)) {
                        Reflect.set(ele.originStyle, key, undefined);
                    }
                    // @ts-ignore
                    var newValue = newStyle[key];
                    if (key === 'width') {
                        newValue = parentStyle.width ? (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.convertPercent)(newValue, parentStyle.width) : 0;
                    }
                    if (key === 'height') {
                        newValue = parentStyle.height ? (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.convertPercent)(newValue, parentStyle.height) : 0;
                    }
                    if (key === 'opacity' && parentStyle && parentStyle.opacity !== 1 && typeof parentStyle.opacity === 'number') {
                        newValue = parentStyle.opacity * newValue;
                    }
                    // @ts-ignore
                    // 根据 className 计算出的样式覆盖当前样式
                    ele.style[key] = newValue;
                }
                else {
                    // console.log('del', key)
                    // 不在内联样式，根据 className 计算出的样式又没有，认为这些样式都应该删除了
                    delete ele.style[key];
                }
            }
        });
    };
    // 添加一个令牌
    ElementClassList.prototype.add = function (token) {
        this.tokens.add(token);
        this.changeHandler();
    };
    // 检查列表中是否存在指定的令牌
    ElementClassList.prototype.contains = function (token) {
        return this.tokens.has(token);
    };
    // 删除一个令牌
    ElementClassList.prototype.remove = function (token) {
        this.tokens.delete(token);
        this.changeHandler();
    };
    return ElementClassList;
}());
var Element = /** @class */ (function () {
    function Element(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.id, id = _e === void 0 ? uuid += 1 : _e, _f = _a.dataset, dataset = _f === void 0 ? {} : _f;
        var _this = this;
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
        /**
         * 有些 style 属性并不能直接用来渲染，需要经过解析之后才能进行渲染，这些值不会存储在 style 上
         * 比如 style.transform，如果每次都解析性能太差了
         */
        this.renderForLayout = {};
        this.innerStyle = {};
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
        _style__WEBPACK_IMPORTED_MODULE_0__.renderAffectStyles.forEach(function (prop) {
            var val = style[prop];
            if (typeof val !== 'undefined') {
                _this.calculateRenderForLayout(true, prop, StyleOpType.Set, val);
            }
        });
        this.originStyle = style;
        this.style = style;
        this.rect = null;
        // this.classNameList = null;
        var initialTokens = className.split(/\s+/).filter(function (item) { return !!item; });
        initialTokens.push(idName);
        this.classList = new ElementClassList(this, initialTokens);
    }
    Element.prototype.styleChangeHandler = function (prop, styleOpType, val) {
    };
    Element.prototype.calculateRenderForLayout = function (init, prop, styleOpType, val) {
        var _this = this;
        var _a;
        if (!init) {
            this.styleChangeHandler(prop, styleOpType, val);
        }
        if (styleOpType === StyleOpType.Set) {
            switch (prop) {
                case 'backgroundImage':
                    var url = (0,_styleParser__WEBPACK_IMPORTED_MODULE_4__.backgroundImageParser)(val);
                    if (url) {
                        _common_imageManager__WEBPACK_IMPORTED_MODULE_2__["default"].loadImage(url, function (img) {
                            var _a;
                            if (!_this.isDestroyed) {
                                _this.renderForLayout.backgroundImage = img;
                                // 当图片加载完成，实例可能已经被销毁了
                                (_a = _this.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
                            }
                        });
                    }
                    break;
                case 'transform':
                    delete this.renderForLayout.scaleX;
                    delete this.renderForLayout.scaleY;
                    delete this.renderForLayout.rotate;
                    Object.assign(this.renderForLayout, (0,_styleParser__WEBPACK_IMPORTED_MODULE_4__.parseTransform)(val));
                    break;
            }
        }
        else {
            switch (prop) {
                case 'backgroundImage':
                    this.renderForLayout.backgroundImage = undefined;
                    break;
                case 'transform':
                    delete this.renderForLayout.scaleX;
                    delete this.renderForLayout.scaleY;
                    delete this.renderForLayout.rotate;
                    break;
            }
        }
        // 初始化的逻辑不需要做这些判断
        if (!init) {
            if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(prop) > -1) {
                // setDirty(this, `change prop ${prop} from ${oldVal} to ${val}`);
                setDirty(this);
            }
            else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(prop) > -1) {
                (_a = this.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
            }
        }
    };
    Element.prototype.observeStyleAndEvent = function () {
        var _this = this;
        if (typeof Proxy === 'function') {
            var ele_1 = this;
            var innerStyle_1 = this.innerStyle;
            this.style = new Proxy(this.originStyle, {
                get: function (target, prop, receiver) {
                    return Reflect.get(target, prop, receiver);
                },
                set: function (target, prop, val, receiver) {
                    // 判断初始化的className是否包含该属性
                    var isSetForInnerStyle = !Reflect.has(target, prop);
                    var oldVal = Reflect.get(target, prop, receiver);
                    if (typeof prop === 'string' && oldVal !== val) {
                        // console.log('set', prop, oldVal, val)
                        ele_1.calculateRenderForLayout(false, prop, StyleOpType.Set, val);
                    }
                    if (isSetForInnerStyle) {
                        // console.log('set innerStyle', prop, val)
                        // 将私有属性同步一份到 innerStyle
                        Reflect.set(innerStyle_1, prop, val);
                    }
                    return Reflect.set(target, prop, val, receiver);
                },
                deleteProperty: function (target, prop) {
                    ele_1.calculateRenderForLayout(false, prop, StyleOpType.Delete);
                    return Reflect.deleteProperty(target, prop);
                },
            });
        }
        // 事件冒泡逻辑
        ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach(function (eventName) {
            _this.on(eventName, function (e, touchMsg) {
                // 处理伪类逻辑
                if (eventName === 'touchstart') {
                    _this.activeHandler(e);
                    if (_this !== _this.root) {
                        // @ts-ignore
                        _this.root.activeElements.push(_this);
                    }
                }
                else if (eventName === 'touchend' || eventName === 'touchcancel') {
                    _this.deactiveHandler(e);
                    // @ts-ignore
                    var index = _this.root.activeElements.indexOf(_this);
                    if (index > -1) {
                        // @ts-ignore
                        _this.root.activeElements.splice(index, 1);
                    }
                }
                _this.parent && _this.parent.emit(eventName, e, touchMsg);
            });
        });
        // this.classNameList = this.innerClassName.split(/\s+/);
    };
    Element.prototype.activeHandler = function (e) {
        var activeStyle = this.style[':active'];
        if (activeStyle) {
            // 将当前的style缓存起来，在 active 取消的时候重置回去
            this.cacheStyle = Object.assign({}, this.style);
            Object.assign(this.style, activeStyle);
        }
    };
    Element.prototype.deactiveHandler = function (e) {
        var _this = this;
        var activeStyle = this.style[':active'];
        if (activeStyle) {
            Object.keys(activeStyle).forEach(function (key) {
                if (!_this.cacheStyle) {
                    return;
                }
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
        // this.classNameList = null;
    };
    Element.prototype.add = function (element) {
        element.parent = this;
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
        if (this.renderForLayout.backgroundImage) {
            ctx.drawImage(this.renderForLayout.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
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
        var direction = _a.direction, dimensions = _a.dimensions, _b = _a.backgroundColor, backgroundColor = _b === void 0 ? 'rgba(162, 162, 162, 0.7)' : _b, _c = _a.width, width = _c === void 0 ? 10 : _c;
        var _this = this;
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
        _this.innerWidth = 10;
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
/* harmony export */   reflowAffectedStyles: () => (/* binding */ reflowAffectedStyles),
/* harmony export */   renderAffectStyles: () => (/* binding */ renderAffectStyles),
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
var renderAffectStyles = [
    'textShadow',
    'transform',
    'backgroundImage',
];



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
var textShadowReg = /^(\d+px\s){2}\d+px\s(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6})(,\s*(\d+px\s){2}\d+px\s(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))*$/;
function isValidTextShadow(textShadow) {
    return textShadowReg.test(textShadow);
}
function isValidTransformValue(value) {
    // 使用正则表达式验证数字或逗号分隔的数字，后面可以跟可选的角度单位（deg）
    return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*$/.test(value);
    // return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*(,\s*(true|false))?$/.test(value);
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
/* harmony import */ var _styleParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styleParser */ "./src/components/styleParser.ts");
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
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var _this = this;
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
        _this.renderForLayout = {};
        _this.type = 'Text';
        _this.ctx = null;
        _this.valuesrc = value;
        _this.originStyleWidth = originStyleWidth;
        if (style.textShadow) {
            _this.parseTextShadow(style.textShadow);
        }
        return _this;
    }
    Text.prototype.styleChangeHandler = function (prop, styleOpType, val) {
        if (prop === 'textShadow') {
            if (styleOpType === _elements__WEBPACK_IMPORTED_MODULE_0__.StyleOpType.Set) {
                this.parseTextShadow(val);
            }
            else {
                this.renderForLayout.textShadows = null;
            }
        }
    };
    Text.prototype.parseTextShadow = function (textShadow) {
        if (!(0,_styleParser__WEBPACK_IMPORTED_MODULE_2__.isValidTextShadow)(textShadow)) {
            console.error("[Layout]: ".concat(textShadow, " is not a valid textShadow"));
        }
        else {
            // 解析 text-shadow 字符串
            this.renderForLayout.textShadows = textShadow.split(',').map(function (shadow) {
                var parts = shadow.trim().split(/\s+/);
                var offsetX = parseFloat(parts[0]);
                var offsetY = parseFloat(parts[1]);
                var blurRadius = parseFloat(parts[2]);
                var color = parts[3];
                return { offsetX: offsetX, offsetY: offsetY, blurRadius: blurRadius, color: color };
            });
        }
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
                (0,_elements__WEBPACK_IMPORTED_MODULE_0__.setDirty)(this, 'value change');
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
        // this.toCanvasData();
        if (needRender) {
            this.render();
        }
    };
    Text.prototype.render = function () {
        var _this = this;
        var style = this.style;
        var ctx = this.ctx;
        ctx.save();
        this.toCanvasData();
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
        if (this.renderForLayout.textShadows) {
            this.renderForLayout.textShadows.forEach(function (_a) {
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
    allowBooleanAttributes: false, //A tag can have attributes without any value
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
    allowBooleanAttributes: false, //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseNodeValue: true,
    parseAttributeValue: false,
    arrayMode: false,
    trimValues: true, //Trim string values of tag and attributes
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
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BitMapText: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.BitMapText),
/* harmony export */   Button: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.Button),
/* harmony export */   Canvas: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.Canvas),
/* harmony export */   EE: () => (/* binding */ EE),
/* harmony export */   Element: () => (/* reexport safe */ _components_elements__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   Image: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.Image),
/* harmony export */   Layout: () => (/* binding */ Layout),
/* harmony export */   ScrollView: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.ScrollView),
/* harmony export */   Text: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.Text),
/* harmony export */   View: () => (/* reexport safe */ _components__WEBPACK_IMPORTED_MODULE_13__.View),
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
var EE = new (tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default().TinyEmitter)();
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
        _this.version = '1.0.13';
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
        _this.styleSheet = {};
        _this.activeElements = [];
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
        var elementArray = this.insertElementArray(template, style, attrValueProcessor, true);
        this.add(elementArray[0]);
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
        var _this = this;
        if (this.eventHandlerData.hasEventBind) {
            return;
        }
        this.eventHandlerData.hasEventBind = true;
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchStart(this.eventHandlerData.handlers.touchStart);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchMove(this.eventHandlerData.handlers.touchMove);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchEnd(this.eventHandlerData.handlers.touchEnd);
        _env__WEBPACK_IMPORTED_MODULE_0__["default"].onTouchCancel(this.eventHandlerData.handlers.touchCancel);
        /**
         * 当触发 touchstart 事件的时候，如果手指移除元素外，不会触发 touchend，这就导致 deactiveHandler 不能触发
         * 要做到比较完善，事件系统要做较大改用，目前比较好的做法就是根节点在监听到 touchend 和 touchcancel 的时候兜底
         * 触发下 deactiveHandler
         */
        this.on('touchend', function () {
            _this.activeElements.forEach(function (ele) {
                ele.deactiveHandler();
            });
            _this.activeElements = [];
        });
        this.on('touchcancel', function () {
            _this.activeElements.forEach(function (ele) {
                ele.deactiveHandler();
            });
            _this.activeElements = [];
        });
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
        this.activeElements = [];
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
     * 创建节点，创建之后会返回Element列表，可以传入parent立刻插入节点，也可以稍后主动appendChild到需要的节点下
     */
    Layout.prototype.insertElement = function (template, style, parent) {
        var elementArray = this.insertElementArray(template, style);
        elementArray.forEach(function (it) {
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.iterateTree)(it, function (element) { return element.observeStyleAndEvent(); });
            if (parent) {
                parent.appendChild(it);
            }
        });
        return elementArray;
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
    /**
     * 创建节点，创建之后会返回Element列表
     */
    Layout.prototype.insertElementArray = function (template, style, attrValueProcessor, onlyFirst) {
        var _this = this;
        // 样式表存到全局
        this.styleSheet = Object.assign(this.styleSheet, style);
        var parseConfig = {
            attributeNamePrefix: '',
            attrNodeName: 'attr', // default is 'false'
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
        debugInfo.start('insert_xmlParse');
        // 将xml字符串解析成xml节点树
        var jsonObj = _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6__.parse(template, parseConfig, true);
        // console.log(jsonObj)
        debugInfo.end('insert_xmlParse');
        var getElements = [];
        jsonObj.children.forEach(function (xmlTree, index) {
            if (onlyFirst && index > 0) {
                return;
            }
            // XML树生成渲染树
            debugInfo.start('insert_xml2Layout');
            var layoutTree = _common_vd__WEBPACK_IMPORTED_MODULE_10__.create.call(_this, xmlTree, _this.styleSheet);
            debugInfo.end('insert_xml2Layout');
            getElements.push(layoutTree);
        });
        return getElements;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGVtb3Mvbm9lbmdpbmUvZW5naW5lLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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QUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUNuRCxTQUFTO1FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLFFBQVE7UUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzVELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRyxRQUFRO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0YsUUFBUTtRQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFH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TyxHQUFHLGtFQUFZLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRCx1QkFBdUI7UUFDdkIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBRWpDLElBQU0sV0FBVyxHQUFjLEVBQUUsQ0FBQztRQUNsQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQWlCLEVBQUUsS0FBYTtZQUN4RCxJQUFJLFNBQVMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzNCLE9BQU87WUFDVCxDQUFDO1lBQ0QsWUFBWTtZQUNaLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNyQyxJQUFNLFVBQVUsR0FBRywrQ0FBTSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRCxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFoRmMsdUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztJQWlGMUQsYUFBQztDQUFBLENBdmxCb0IsNERBQU8sR0F1bEIzQjtBQUVELElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxDQUFDO0FBZ0JGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9idXR0b24udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvZWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2ltYWdlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbmRleC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsYmFyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGx2aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGVQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3RleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3ZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9lbnYudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9ub2RlMmpzb24uanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci91dGlsLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sTm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbHN0cjJ4bWxub2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9hbmltYXRlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQgZm9yIHJlZmVyZW5jZVxuLy9cbi8vIFRoaXMgZmlsZSB1c2VzIHRoZSBmb2xsb3dpbmcgc3BlY2lmaWMgVU1EIGltcGxlbWVudGF0aW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5jb21wdXRlTGF5b3V0ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbnZhciBjb21wdXRlTGF5b3V0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDU1NfVU5ERUZJTkVEO1xuXG4gIHZhciBDU1NfRElSRUNUSU9OX0lOSEVSSVQgPSAnaW5oZXJpdCc7XG4gIHZhciBDU1NfRElSRUNUSU9OX0xUUiA9ICdsdHInO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9SVEwgPSAncnRsJztcblxuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA9ICdyb3cnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFID0gJ3Jvdy1yZXZlcnNlJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gPSAnY29sdW1uJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSA9ICdjb2x1bW4tcmV2ZXJzZSc7XG5cbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfSlVTVElGWV9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4gPSAnc3BhY2UtYmV0d2Vlbic7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQgPSAnc3BhY2UtYXJvdW5kJztcblxuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfQUxJR05fQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfQUxJR05fRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0FMSUdOX1NUUkVUQ0ggPSAnc3RyZXRjaCc7XG5cbiAgdmFyIENTU19QT1NJVElPTl9SRUxBVElWRSA9ICdyZWxhdGl2ZSc7XG4gIHZhciBDU1NfUE9TSVRJT05fQUJTT0xVVEUgPSAnYWJzb2x1dGUnO1xuXG4gIHZhciBsZWFkaW5nID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIHRyYWlsaW5nID0ge1xuICAgICdyb3cnOiAncmlnaHQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdsZWZ0JyxcbiAgICAnY29sdW1uJzogJ2JvdHRvbScsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ3RvcCdcbiAgfTtcbiAgdmFyIHBvcyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciBkaW0gPSB7XG4gICAgJ3Jvdyc6ICd3aWR0aCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3dpZHRoJyxcbiAgICAnY29sdW1uJzogJ2hlaWdodCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2hlaWdodCdcbiAgfTtcblxuICAvLyBXaGVuIHRyYW5zcGlsZWQgdG8gSmF2YSAvIEMgdGhlIG5vZGUgdHlwZSBoYXMgbGF5b3V0LCBjaGlsZHJlbiBhbmQgc3R5bGVcbiAgLy8gcHJvcGVydGllcy4gRm9yIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZXNlIHByb3BlcnRpZXNcbiAgLy8gaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LlxuICBmdW5jdGlvbiBmaWxsTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5sYXlvdXQgfHwgbm9kZS5pc0RpcnR5KSB7XG4gICAgICBub2RlLmxheW91dCA9IHtcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuc3R5bGUpIHtcbiAgICAgIG5vZGUuc3R5bGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZpbGxOb2Rlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNSb3dEaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5TdGFydCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5TdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luRW5kICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbkVuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nRW5kICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nRW5kID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdFbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpICtcbiAgICAgICAgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduQ29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25Db250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQuc3R5bGUuYWxpZ25TZWxmKSB7XG4gICAgICByZXR1cm4gY2hpbGQuc3R5bGUuYWxpZ25TZWxmO1xuICAgIH1cbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkl0ZW1zKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkl0ZW1zO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmV0Y2gnO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUF4aXMoYXhpcywgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9SVEwpIHtcbiAgICAgIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gICAgICB9IGVsc2UgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSkge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICBpZiAobm9kZS5zdHlsZS5kaXJlY3Rpb24pIHtcbiAgICAgIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSBDU1NfRElSRUNUSU9OX0lOSEVSSVQ7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9JTkhFUklUKSB7XG4gICAgICBkaXJlY3Rpb24gPSAocGFyZW50RGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBDU1NfRElSRUNUSU9OX0xUUiA6IHBhcmVudERpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZsZXhEaXJlY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24sIGRpcmVjdGlvbikge1xuICAgIGlmIChpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uVHlwZShub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gJ3JlbGF0aXZlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleChub2RlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGdldFBvc2l0aW9uVHlwZShub2RlKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICBub2RlLnN0eWxlLmZsZXggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleFdyYXAobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhXcmFwID09PSAnd3JhcCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREaW1XaXRoTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSArIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0RpbURlZmluZWQobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlW2RpbVtheGlzXV0gPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUG9zRGVmaW5lZChub2RlLCBwb3MpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lYXN1cmVEZWZpbmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5tZWFzdXJlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbihub2RlLCBwb3MpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc107XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gYm91bmRBeGlzKG5vZGUsIGF4aXMsIHZhbHVlKSB7XG4gICAgdmFyIG1pbiA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1pbkhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluSGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBtYXggPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5tYXhIZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1heEhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgYm91bmRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCAmJiBtYXggPj0gMCAmJiBib3VuZFZhbHVlID4gbWF4KSB7XG4gICAgICBib3VuZFZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBpZiAobWluICE9PSB1bmRlZmluZWQgJiYgbWluID49IDAgJiYgYm91bmRWYWx1ZSA8IG1pbikge1xuICAgICAgYm91bmRWYWx1ZSA9IG1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmbWF4ZihhLCBiKSB7XG4gICAgaWYgKGEgPiBiKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB1c2VyIHNwZWNpZmljYWxseSBzZXRzIGEgdmFsdWUgZm9yIHdpZHRoIG9yIGhlaWdodFxuICBmdW5jdGlvbiBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgYXhpcykge1xuICAgIC8vIFRoZSBwYXJlbnQgYWxyZWFkeSBjb21wdXRlZCB1cyBhIHdpZHRoIG9yIGhlaWdodC4gV2UganVzdCBza2lwIGl0XG4gICAgaWYgKG5vZGUubGF5b3V0W2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXZSBvbmx5IHJ1biBpZiB0aGVyZSdzIGEgd2lkdGggb3IgaGVpZ2h0IGRlZmluZWRcbiAgICBpZiAoIWlzRGltRGVmaW5lZChub2RlLCBheGlzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBkaW1lbnNpb25zIGNhbiBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlclxuICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgIGJvdW5kQXhpcyhub2RlLCBheGlzLCBub2RlLnN0eWxlW2RpbVtheGlzXV0pLFxuICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcylcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgYXhpcykge1xuICAgIGNoaWxkLmxheW91dFt0cmFpbGluZ1theGlzXV0gPSBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLSBjaGlsZC5sYXlvdXRbcG9zW2F4aXNdXTtcbiAgfVxuXG4gIC8vIElmIGJvdGggbGVmdCBhbmQgcmlnaHQgYXJlIGRlZmluZWQsIHRoZW4gdXNlIGxlZnQuIE90aGVyd2lzZSByZXR1cm5cbiAgLy8gK2xlZnQgb3IgLXJpZ2h0IGRlcGVuZGluZyBvbiB3aGljaCBpcyBkZWZpbmVkLlxuICBmdW5jdGlvbiBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtsZWFkaW5nW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZ2V0UG9zaXRpb24obm9kZSwgbGVhZGluZ1theGlzXSk7XG4gICAgfVxuICAgIHJldHVybiAtZ2V0UG9zaXRpb24obm9kZSwgdHJhaWxpbmdbYXhpc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIC8qY3NzX2RpcmVjdGlvbl90Ki9wYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIvKmNzc19kaXJlY3Rpb25fdCovIGRpcmVjdGlvbiA9IHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gbWFpbkF4aXMgPSByZXNvbHZlQXhpcyhnZXRGbGV4RGlyZWN0aW9uKG5vZGUpLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBjcm9zc0F4aXMgPSBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24obWFpbkF4aXMsIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIHJlc29sdmVkUm93QXhpcyA9IHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG5cbiAgICAvLyBIYW5kbGUgd2lkdGggYW5kIGhlaWdodCBzdHlsZSBhdHRyaWJ1dGVzXG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIG1haW5BeGlzKTtcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIFNldCB0aGUgcmVzb2x2ZWQgcmVzb2x1dGlvbiBpbiB0aGUgbm9kZSdzIGxheW91dFxuICAgIG5vZGUubGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgIC8vIFRoZSBwb3NpdGlvbiBpcyBzZXQgYnkgdGhlIHBhcmVudCwgYnV0IHdlIG5lZWQgdG8gY29tcGxldGUgaXQgd2l0aCBhXG4gICAgLy8gZGVsdGEgY29tcG9zZWQgb2YgdGhlIG1hcmdpbiBhbmQgbGVmdC90b3AvcmlnaHQvYm90dG9tXG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1ttYWluQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW21haW5BeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1tjcm9zc0F4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIElubGluZSBpbW11dGFibGUgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBub2RlIHRvIGF2b2lkIGV4Y2Vzc2l2ZSBtZXRob2RcbiAgICAvLyBpbnZvY2F0aW9ucyBkdXJpbmcgdGhlIGxheW91dCBjYWxjdWxhdGlvbi5cbiAgICB2YXIvKmludCovIGNoaWxkQ291bnQgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG5cbiAgICBpZiAoaXNNZWFzdXJlRGVmaW5lZChub2RlKSkge1xuICAgICAgdmFyLypib29sKi8gaXNSZXNvbHZlZFJvd0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dKTtcblxuICAgICAgdmFyLypmbG9hdCovIHdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICB3aWR0aCA9IG5vZGUuc3R5bGUud2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuICAgICAgfVxuICAgICAgd2lkdGggLT0gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcblxuICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGdpdmUgYSBkaW1lbnNpb24gZm9yIHRoZSB0ZXh0IGlmIHdlIGhhdmVuJ3QgZ290IGFueVxuICAgICAgLy8gZm9yIGl0IGNvbXB1dGVkIHlldC4gSXQgY2FuIGVpdGhlciBiZSBmcm9tIHRoZSBzdHlsZSBhdHRyaWJ1dGUgb3IgYmVjYXVzZVxuICAgICAgLy8gdGhlIGVsZW1lbnQgaXMgZmxleGlibGUuXG4gICAgICB2YXIvKmJvb2wqLyBpc1Jvd1VuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAmJiAhaXNSZXNvbHZlZFJvd0RpbURlZmluZWQ7XG4gICAgICB2YXIvKmJvb2wqLyBpc0NvbHVtblVuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTikgJiZcbiAgICAgICAgaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW0NTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5dXSk7XG5cbiAgICAgIC8vIExldCdzIG5vdCBtZWFzdXJlIHRoZSB0ZXh0IGlmIHdlIGFscmVhZHkga25vdyBib3RoIGRpbWVuc2lvbnNcbiAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCB8fCBpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICB2YXIvKmNzc19kaW1fdCovIG1lYXN1cmVEaW0gPSBub2RlLnN0eWxlLm1lYXN1cmUoXG4gICAgICAgICAgLyooYykhbm9kZS0+Y29udGV4dCwqL1xuICAgICAgICAgIC8qKGphdmEpIWxheW91dENvbnRleHQubWVhc3VyZU91dHB1dCwqL1xuICAgICAgICAgIHdpZHRoXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbWVhc3VyZURpbS53aWR0aCArXG4gICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG1lYXN1cmVEaW0uaGVpZ2h0ICtcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gaXNOb2RlRmxleFdyYXAgPSBpc0ZsZXhXcmFwKG5vZGUpO1xuXG4gICAgdmFyLypjc3NfanVzdGlmeV90Ki8ganVzdGlmeUNvbnRlbnQgPSBnZXRKdXN0aWZ5Q29udGVudChub2RlKTtcblxuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW4gPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3MgPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBjcm9zc0F4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW4gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgdmFyLypib29sKi8gaXNNYWluRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNDcm9zc0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc01haW5Sb3dEaXJlY3Rpb24gPSBpc1Jvd0RpcmVjdGlvbihtYWluQXhpcyk7XG5cbiAgICB2YXIvKmludCovIGk7XG4gICAgdmFyLyppbnQqLyBpaTtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY2hpbGQ7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGF4aXM7XG5cbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEFic29sdXRlQ2hpbGQgPSBudWxsO1xuXG4gICAgdmFyLypmbG9hdCovIGRlZmluZWRNYWluRGltID0gQ1NTX1VOREVGSU5FRDtcbiAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgZGVmaW5lZE1haW5EaW0gPSBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSAtIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbjtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIGV4ZWN1dGUgdGhlIG5leHQgdHdvIGxvb3BzIG9uZSBwZXIgbGluZSB3aXRoIGZsZXgtd3JhcFxuICAgIHZhci8qaW50Ki8gc3RhcnRMaW5lID0gMDtcbiAgICB2YXIvKmludCovIGVuZExpbmUgPSAwO1xuICAgIC8vIHZhci8qaW50Ki8gbmV4dE9mZnNldCA9IDA7XG4gICAgdmFyLyppbnQqLyBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAvLyBXZSBhZ2dyZWdhdGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlIGNvbnRhaW5lciBpbiB0aG9zZSB0d28gdmFyaWFibGVzXG4gICAgdmFyLypmbG9hdCovIGxpbmVzQ3Jvc3NEaW0gPSAwO1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc01haW5EaW0gPSAwO1xuICAgIHZhci8qaW50Ki8gbGluZXNDb3VudCA9IDA7XG4gICAgd2hpbGUgKGVuZExpbmUgPCBjaGlsZENvdW50KSB7XG4gICAgICAvLyA8TG9vcCBBPiBMYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBjb3VudCBjaGlsZHJlbiBieSB0eXBlXG5cbiAgICAgIC8vIG1haW5Db250ZW50RGltIGlzIGFjY3VtdWxhdGlvbiBvZiB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2luIG9mIGFsbCB0aGVcbiAgICAgIC8vIG5vbiBmbGV4aWJsZSBjaGlsZHJlbi4gVGhpcyB3aWxsIGJlIHVzZWQgaW4gb3JkZXIgdG8gZWl0aGVyIHNldCB0aGVcbiAgICAgIC8vIGRpbWVuc2lvbnMgb2YgdGhlIG5vZGUgaWYgbm9uZSBhbHJlYWR5IGV4aXN0LCBvciB0byBjb21wdXRlIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlIGxlZnQgZm9yIHRoZSBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluQ29udGVudERpbSA9IDA7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSB0aHJlZSBraW5kIG9mIGNoaWxkcmVuLCBub24gZmxleGlibGUsIGZsZXhpYmxlIGFuZCBhYnNvbHV0ZS5cbiAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyBob3cgbWFueSB0aGVyZSBhcmUgaW4gb3JkZXIgdG8gZGlzdHJpYnV0ZSB0aGUgc3BhY2UuXG4gICAgICB2YXIvKmludCovIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gdG90YWxGbGV4aWJsZSA9IDA7XG4gICAgICB2YXIvKmludCovIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG5cbiAgICAgIC8vIFVzZSB0aGUgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBtYWluIGF4aXMgZm9yIGFzIGxvbmdcbiAgICAgIC8vIGFzIHRoZXkgYXJlIHVzaW5nIGEgc2ltcGxlIHN0YWNraW5nIGJlaGF2aW91ci4gQ2hpbGRyZW4gdGhhdCBhcmVcbiAgICAgIC8vIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcCB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluXG4gICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tNYWluID1cbiAgICAgICAgICAoaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAoIWlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0NFTlRFUik7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleE1haW4gPSAoaXNTaW1wbGVTdGFja01haW4gPyBjaGlsZENvdW50IDogc3RhcnRMaW5lKTtcblxuICAgICAgLy8gVXNlIHRoZSBpbml0aWFsIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgY3Jvc3MgYXhpcyBmb3JcbiAgICAgIC8vIGFzIGxvbmcgYXMgdGhleSBhcmUgcmVsYXRpdmVseSBwb3NpdGlvbmVkIHdpdGggYWxpZ25tZW50IFNUUkVUQ0ggb3JcbiAgICAgIC8vIEZMRVhfU1RBUlQuIENoaWxkcmVuIHRoYXQgYXJlIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcFxuICAgICAgLy8gd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpbiBpbiA8TG9vcCBEPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tDcm9zcyA9IHRydWU7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleENyb3NzID0gY2hpbGRDb3VudDtcblxuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0RmxleENoaWxkID0gbnVsbDtcbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgdmFyLypmbG9hdCovIG1haW5EaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW47XG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW0gPSAwO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWF4V2lkdGg7XG4gICAgICBmb3IgKGkgPSBzdGFydExpbmU7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZC5saW5lSW5kZXggPSBsaW5lc0NvdW50O1xuXG4gICAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG5cbiAgICAgICAgLy8gUHJlLWZpbGwgY3Jvc3MgYXhpcyBkaW1lbnNpb25zIHdoZW4gdGhlIGNoaWxkIGlzIHVzaW5nIHN0cmV0Y2ggYmVmb3JlXG4gICAgICAgIC8vIHdlIGNhbGwgdGhlIHJlY3Vyc2l2ZSBsYXlvdXQgcGFzc1xuICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCAmJlxuICAgICAgICAgICAgZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICAgICAgICBpc0Nyb3NzRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgY3Jvc3NBeGlzKSkge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSkge1xuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2hpbGRyZW5cbiAgICAgICAgICAvLyBzbyB0aGF0IHdlIGNhbiBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEFic29sdXRlQ2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3IgdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoXG4gICAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpLFxuICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGF4aXMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyLypmbG9hdCovIG5leHRDb250ZW50RGltID0gMDtcblxuICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGNvbnNpZGVyIGEgY2hpbGQgZmxleGlibGUgaWYgd2UgaGF2ZSBhIGNvbXB1dGVkXG4gICAgICAgIC8vIGRpbWVuc2lvbiBmb3IgdGhlIG5vZGUuXG4gICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkICYmIGlzRmxleChjaGlsZCkpIHtcbiAgICAgICAgICBmbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICB0b3RhbEZsZXhpYmxlICs9IGNoaWxkLnN0eWxlLmZsZXg7XG5cbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgZmxleGlibGUgY2hpbGRyZW4gc28gdGhhdCB3ZSBjYW5cbiAgICAgICAgICAvLyBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEZsZXhDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBFdmVuIGlmIHdlIGRvbid0IGtub3cgaXRzIGV4YWN0IHNpemUgeWV0LCB3ZSBhbHJlYWR5IGtub3cgdGhlIHBhZGRpbmcsXG4gICAgICAgICAgLy8gYm9yZGVyIGFuZCBtYXJnaW4uIFdlJ2xsIHVzZSB0aGlzIHBhcnRpYWwgaW5mb3JtYXRpb24sIHdoaWNoIHJlcHJlc2VudHNcbiAgICAgICAgICAvLyB0aGUgc21hbGxlc3QgcG9zc2libGUgc2l6ZSBmb3IgdGhlIGNoaWxkLCB0byBjb21wdXRlIHRoZSByZW1haW5pbmdcbiAgICAgICAgICAvLyBhdmFpbGFibGUgc3BhY2UuXG4gICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIG1haW5BeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gcmVjdXJzaXZlIGNhbGwuIFdlIGxheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICAgICAgaWYgKGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPT09IDApIHtcbiAgICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWJzb2x1dGUgcG9zaXRpb25lZCBlbGVtZW50cyBkbyBub3QgdGFrZSBwYXJ0IG9mIHRoZSBsYXlvdXQsIHNvIHdlXG4gICAgICAgICAgLy8gZG9uJ3QgdXNlIHRoZW0gdG8gY29tcHV0ZSBtYWluQ29udGVudERpbVxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIGFuZCBtYXJnaW4gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZWxlbWVudCB3ZSBhcmUgYWJvdXQgdG8gYWRkIHdvdWxkIG1ha2UgdXMgZ28gdG8gdGhlIG5leHQgbGluZVxuICAgICAgICBpZiAoaXNOb2RlRmxleFdyYXAgJiZcbiAgICAgICAgICAgIGlzTWFpbkRpbURlZmluZWQgJiZcbiAgICAgICAgICAgIG1haW5Db250ZW50RGltICsgbmV4dENvbnRlbnREaW0gPiBkZWZpbmVkTWFpbkRpbSAmJlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBvbmx5IG9uZSBlbGVtZW50LCB0aGVuIGl0J3MgYmlnZ2VyIHRoYW4gdGhlIGNvbnRlbnRcbiAgICAgICAgICAgIC8vIGFuZCBuZWVkcyBpdHMgb3duIGxpbmVcbiAgICAgICAgICAgIGkgIT09IHN0YXJ0TGluZSkge1xuICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudC0tO1xuICAgICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIG1haW4gYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbiAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fCBpc0ZsZXgoY2hpbGQpKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tNYWluID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4TWFpbiA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgY3Jvc3MgYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgRD4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MgJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHxcbiAgICAgICAgICAgICAgICAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fU1RSRVRDSCAmJiBhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICAgICAgIGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tDcm9zcyA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleENyb3NzID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbikge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWFpbkRpbSArPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAgICAgbWFpbkNvbnRlbnREaW0gKz0gbmV4dENvbnRlbnREaW07XG4gICAgICAgIGVuZExpbmUgPSBpICsgMTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQj4gTGF5b3V0IGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBhbGxvY2F0ZSBlbXB0eSBzcGFjZVxuXG4gICAgICAvLyBJbiBvcmRlciB0byBwb3NpdGlvbiB0aGUgZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcywgd2UgaGF2ZSB0d29cbiAgICAgIC8vIGNvbnRyb2xzLiBUaGUgc3BhY2UgYmV0d2VlbiB0aGUgYmVnaW5uaW5nIGFuZCB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gYW5kIHRoZSBzcGFjZSBiZXR3ZWVuIGVhY2ggdHdvIGVsZW1lbnRzLlxuICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdNYWluRGltID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBiZXR3ZWVuTWFpbkRpbSA9IDA7XG5cbiAgICAgIC8vIFRoZSByZW1haW5pbmcgYXZhaWxhYmxlIHNwYWNlIHRoYXQgbmVlZHMgdG8gYmUgYWxsb2NhdGVkXG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nTWFpbkRpbSA9IDA7XG4gICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZGVmaW5lZE1haW5EaW0gLSBtYWluQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihtYWluQ29udGVudERpbSwgMCkgLSBtYWluQ29udGVudERpbTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGZsZXhpYmxlIGNoaWxkcmVuIGluIHRoZSBtaXgsIHRoZXkgYXJlIGdvaW5nIHRvIGZpbGwgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2VcbiAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgIT09IDApIHtcbiAgICAgICAgdmFyLypmbG9hdCovIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYmFzZU1haW5EaW07XG4gICAgICAgIHZhci8qZmxvYXQqLyBib3VuZE1haW5EaW07XG5cbiAgICAgICAgLy8gSWYgdGhlIGZsZXggc2hhcmUgb2YgcmVtYWluaW5nIHNwYWNlIGRvZXNuJ3QgbWVldCBtaW4vbWF4IGJvdW5kcyxcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgY2hpbGQgZnJvbSBmbGV4IGNhbGN1bGF0aW9ucy5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGJhc2VNYWluRGltID0gZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGJvdW5kTWFpbkRpbSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcywgYmFzZU1haW5EaW0pO1xuXG4gICAgICAgICAgaWYgKGJhc2VNYWluRGltICE9PSBib3VuZE1haW5EaW0pIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gLT0gYm91bmRNYWluRGltO1xuICAgICAgICAgICAgdG90YWxGbGV4aWJsZSAtPSBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcblxuICAgICAgICAvLyBUaGUgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGNhbiBvdmVyZmxvdyB0aGUgY29udGFpbmVyLCBpbiB0aGlzIGNhc2VcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGp1c3QgYXNzdW1lIHRoYXQgdGhlcmUgaXMgbm8gc3BhY2UgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoZmxleGlibGVNYWluRGltIDwgMCkge1xuICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIG9mIHRoZSBlbGVtZW50IGluIHRoZSBtYWluXG4gICAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsXG4gICAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgbGF5b3V0IGFsZ29yaXRobSBmb3IgdGhpcyBjaGlsZFxuICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jdXJyZW50RmxleENoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgIGNoaWxkID0gY3VycmVudEZsZXhDaGlsZDtcbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFdlIHVzZSBqdXN0aWZ5Q29udGVudCB0byBmaWd1cmUgb3V0IGhvdyB0byBhbGxvY2F0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAvLyBzcGFjZSBhdmFpbGFibGVcbiAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9DRU5URVIpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX0VORCkge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbTtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTikge1xuICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihyZW1haW5pbmdNYWluRGltLCAwKTtcbiAgICAgICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSAhPT0gMCkge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQpIHtcbiAgICAgICAgICAvLyBTcGFjZSBvbiB0aGUgZWRnZXMgaXMgaGFsZiBvZiB0aGUgc3BhY2UgYmV0d2VlbiBlbGVtZW50c1xuICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50KTtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IGJldHdlZW5NYWluRGltIC8gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBDPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzIGFuZCBjb21wdXRlIGRpbWVuc2lvbnNcblxuICAgICAgLy8gQXQgdGhpcyBwb2ludCwgYWxsIHRoZSBjaGlsZHJlbiBoYXZlIHRoZWlyIGRpbWVuc2lvbnMgc2V0LiBXZSBuZWVkIHRvXG4gICAgICAvLyBmaW5kIHRoZWlyIHBvc2l0aW9uLiBJbiBvcmRlciB0byBkbyB0aGF0LCB3ZSBhY2N1bXVsYXRlIGRhdGEgaW5cbiAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGFyZSBhbHNvIHVzZWZ1bCB0byBjb21wdXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZVxuICAgICAgLy8gY29udGFpbmVyIVxuICAgICAgbWFpbkRpbSArPSBsZWFkaW5nTWFpbkRpbTtcblxuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4TWFpbjsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSBhbmQgaGFzIGxlZnQvdG9wIGJlaW5nXG4gICAgICAgICAgLy8gZGVmaW5lZCwgd2Ugb3ZlcnJpZGUgdGhlIHBvc2l0aW9uIHRvIHdoYXRldmVyIHRoZSB1c2VyIHNhaWRcbiAgICAgICAgICAvLyAoYW5kIG1hcmdpbi9ib3JkZXIpLlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSAod2l0aG91dCB0b3AvbGVmdCkgb3IgcmVsYXRpdmUsXG4gICAgICAgICAgLy8gd2UgcHV0IGl0IGF0IHRoZSBjdXJyZW50IGFjY3VtdWxhdGVkIG9mZnNldC5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSBwbGFjZWQgdGhlIGVsZW1lbnQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZG8gdGhhdCBmb3IgcmVsYXRpdmUgZWxlbWVudHMuIEFic29sdXRlIGVsZW1lbnRzXG4gICAgICAgICAgLy8gZG8gbm90IHRha2UgcGFydCBpbiB0aGF0IHBoYXNlLlxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBtYWluIGRpbWVuc2lvbiBpcyB0aGUgc3VtIG9mIGFsbCB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHBsdXNcbiAgICAgICAgICAgIC8vIHRoZSBzcGFjaW5nLlxuICAgICAgICAgICAgbWFpbkRpbSArPSBiZXR3ZWVuTWFpbkRpbSArIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICAgIC8vIFRoZSBjcm9zcyBkaW1lbnNpb24gaXMgdGhlIG1heCBvZiB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHNpbmNlIHRoZXJlXG4gICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgZWxlbWVudCBpbiB0aGF0IGNyb3NzIGRpbWVuc2lvbi5cbiAgICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjb250YWluZXJDcm9zc0F4aXMgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgIGNvbnRhaW5lckNyb3NzQXhpcyA9IGZtYXhmKFxuICAgICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgY3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEQ+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhDcm9zczsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgYWJzb2x1dGVseSBwb3NpdGlvbm5lZCBhbmQgaGFzIGFcbiAgICAgICAgICAvLyB0b3AvbGVmdC9ib3R0b20vcmlnaHQgYmVpbmcgc2V0LCB3ZSBvdmVycmlkZSBhbGwgdGhlIHByZXZpb3VzbHlcbiAgICAgICAgICAvLyBjb21wdXRlZCBwb3NpdGlvbnMgdG8gc2V0IGl0IGNvcnJlY3RseS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ0Nyb3NzRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgICAgIC8vIEZvciBhIHJlbGF0aXZlIGNoaWxkcmVuLCB3ZSdyZSBlaXRoZXIgdXNpbmcgYWxpZ25JdGVtcyAocGFyZW50KSBvclxuICAgICAgICAgIC8vIGFsaWduU2VsZiAoY2hpbGQpIGluIG9yZGVyIHRvIGRldGVybWluZSB0aGUgcG9zaXRpb24gaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAvLyBUaGlzIHZhcmlhYmxlIGlzIGludGVudGlvbmFsbHkgcmUtZGVmaW5lZCBhcyB0aGUgY29kZSBpcyB0cmFuc3BpbGVkIHRvIGEgYmxvY2sgc2NvcGUgbGFuZ3VhZ2VcbiAgICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgICAgLyplc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgICAvLyBZb3UgY2FuIG9ubHkgc3RyZXRjaCBpZiB0aGUgZGltZW5zaW9uIGhhcyBub3QgYWxyZWFkeSBiZWVuIHNldFxuICAgICAgICAgICAgICAvLyBwcmV2aW91c2x5LlxuICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSByZW1haW5pbmcgc3BhY2UgYmV0d2VlbiB0aGUgcGFyZW50IGRpbWVuc2lvbnMrcGFkZGluZyBhbmQgY2hpbGRcbiAgICAgICAgICAgICAgLy8gZGltZW5zaW9ucyttYXJnaW4uXG4gICAgICAgICAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdDcm9zc0RpbSA9IGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENTU19BTElHTl9GTEVYX0VORFxuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSBhcHBseSB0aGUgcG9zaXRpb25cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nQ3Jvc3NEaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZXNDcm9zc0RpbSArPSBjcm9zc0RpbTtcbiAgICAgIGxpbmVzTWFpbkRpbSA9IGZtYXhmKGxpbmVzTWFpbkRpbSwgbWFpbkRpbSk7XG4gICAgICBsaW5lc0NvdW50ICs9IDE7XG4gICAgICBzdGFydExpbmUgPSBlbmRMaW5lO1xuICAgIH1cblxuICAgIC8vIDxMb29wIEU+XG4gICAgLy9cbiAgICAvLyBOb3RlKHByZW5hdXgpOiBNb3JlIHRoYW4gb25lIGxpbmUsIHdlIG5lZWQgdG8gbGF5b3V0IHRoZSBjcm9zc0F4aXNcbiAgICAvLyBhY2NvcmRpbmcgdG8gYWxpZ25Db250ZW50LlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHdlIGNvdWxkIHByb2JhYmx5IHJlbW92ZSA8TG9vcCBEPiBhbmQgaGFuZGxlIHRoZSBvbmUgbGluZSBjYXNlXG4gICAgLy8gaGVyZSB0b28sIGJ1dCBmb3IgdGhlIG1vbWVudCB0aGlzIGlzIHNhZmVyIHNpbmNlIGl0IHdvbid0IGludGVyZmVyZSB3aXRoXG4gICAgLy8gcHJldmlvdXNseSB3b3JraW5nIGNvZGUuXG4gICAgLy9cbiAgICAvLyBTZWUgc3BlY3M6XG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMi9DUi1jc3MzLWZsZXhib3gtMjAxMjA5MTgvI2xheW91dC1hbGdvcml0aG1cbiAgICAvLyBzZWN0aW9uIDkuNFxuICAgIC8vXG4gICAgaWYgKGxpbmVzQ291bnQgPiAxICYmIGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICB2YXIvKmZsb2F0Ki8gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcztcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gPSBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplIC0gbGluZXNDcm9zc0RpbTtcblxuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltTGVhZCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gY3VycmVudExlYWQgPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50ID0gZ2V0QWxpZ25Db250ZW50KG5vZGUpO1xuICAgICAgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgaWYgKG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPiBsaW5lc0Nyb3NzRGltKSB7XG4gICAgICAgICAgY3Jvc3NEaW1MZWFkID0gKHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIGxpbmVzQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qaW50Ki8gZW5kSW5kZXggPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIvKmludCovIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcblxuICAgICAgICAvLyBjb21wdXRlIHRoZSBsaW5lJ3MgaGVpZ2h0IGFuZCBmaW5kIHRoZSBlbmRJbmRleFxuICAgICAgICB2YXIvKmZsb2F0Ki8gbGluZUhlaWdodCA9IDA7XG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGNoaWxkQ291bnQ7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQubGluZUluZGV4ICE9PSBpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgbGluZUhlaWdodCA9IGZtYXhmKFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dICsgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW5kSW5kZXggPSBpaTtcbiAgICAgICAgbGluZUhlaWdodCArPSBjcm9zc0RpbUxlYWQ7XG5cbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgZW5kSW5kZXg7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGxpbmVIZWlnaHQgLSBnZXRUcmFpbGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSAtIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgIHZhci8qZmxvYXQqLyBjaGlsZEhlaWdodCA9IGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyAobGluZUhlaWdodCAtIGNoaWxkSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgICAgLy8gVE9ETyhwcmVuYXV4KTogQ29ycmVjdGx5IHNldCB0aGUgaGVpZ2h0IG9mIGl0ZW1zIHdpdGggdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoYXV0bykgY3Jvc3NBeGlzIGRpbWVuc2lvbi5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50TGVhZCArPSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gZmFsc2U7XG4gICAgdmFyLypib29sKi8gbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gZmFsc2U7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhIHdpZHRoIG9yIGhlaWdodCwgYW5kIGl0IGhhcyBub3QgYmVlbiBzZXRcbiAgICAvLyBieSB0aGUgY29udGFpbmVyLCB0aGVuIHdlIHNldCBpdCB2aWEgdGhlIGNoaWxkcmVuLlxuICAgIGlmICghaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gV2UncmUgbWlzc2luZyB0aGUgbGFzdCBwYWRkaW5nIGF0IHRoaXMgcG9pbnQgdG8gZ2V0IHRoZSBmaW5hbFxuICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIG1haW5BeGlzLCBsaW5lc01haW5EaW0gKyBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpKSxcbiAgICAgICAgLy8gV2UgY2FuIG5ldmVyIGFzc2lnbiBhIHdpZHRoIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyc1xuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW5cbiAgICAgICk7XG5cbiAgICAgIGlmIChtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgbWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc01haW5UcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgbGluZXNDcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICApO1xuXG4gICAgICBpZiAoY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEY+IFNldCB0cmFpbGluZyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcbiAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MgfHwgbmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEc+IENhbGN1bGF0ZSBkaW1lbnNpb25zIGZvciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudHNcbiAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGZpcnN0QWJzb2x1dGVDaGlsZDtcbiAgICB3aGlsZSAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvclxuICAgICAgLy8gdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcblxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAhaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtsZWFkaW5nW2F4aXNdXSA9XG4gICAgICAgICAgICBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZDtcbiAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQ7XG4gICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZShub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgbm9kZS5zaG91bGRVcGRhdGUgPSB0cnVlO1xuXG4gICAgdmFyIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uIHx8IENTU19ESVJFQ1RJT05fTFRSO1xuICAgIHZhciBza2lwTGF5b3V0ID1cbiAgICAgICFub2RlLmlzRGlydHkgJiZcbiAgICAgIG5vZGUubGFzdExheW91dCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9PT0gbm9kZS5sYXlvdXQuaGVpZ2h0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPT09IG5vZGUubGF5b3V0LndpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPT09IHBhcmVudE1heFdpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID09PSBkaXJlY3Rpb247XG5cbiAgICBpZiAoc2tpcExheW91dCkge1xuICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBub2RlLmxhc3RMYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXlvdXQudG9wID0gbm9kZS5sYXN0TGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGF5b3V0LmxlZnQgPSBub2RlLmxhc3RMYXlvdXQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFub2RlLmxhc3RMYXlvdXQpIHtcbiAgICAgICAgbm9kZS5sYXN0TGF5b3V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgLy8gUmVzZXQgY2hpbGQgbGF5b3V0c1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLmxheW91dC53aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LnRvcCA9IDA7XG4gICAgICAgIGNoaWxkLmxheW91dC5sZWZ0ID0gMDtcbiAgICAgIH0pO1xuXG4gICAgICBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKTtcblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LndpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnRvcCA9IG5vZGUubGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGFzdExheW91dC5sZWZ0ID0gbm9kZS5sYXlvdXQubGVmdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxheW91dE5vZGVJbXBsOiBsYXlvdXROb2RlSW1wbCxcbiAgICBjb21wdXRlTGF5b3V0OiBsYXlvdXROb2RlLFxuICAgIGZpbGxOb2RlczogZmlsbE5vZGVzXG4gIH07XG59KSgpO1xuXG4vLyBUaGlzIG1vZHVsZSBleHBvcnQgaXMgb25seSB1c2VkIGZvciB0aGUgcHVycG9zZXMgb2YgdW5pdCB0ZXN0aW5nIHRoaXMgZmlsZS4gV2hlblxuLy8gdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQgdGhpcyBmaWxlIGlzIGluY2x1ZGVkIHdpdGhpbiBjc3MtbGF5b3V0LmpzIHdoaWNoIGZvcm1zXG4vLyB0aGUgcHVibGljIEFQSS5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlTGF5b3V0O1xufVxuXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgLy8gZGlzYWJsaW5nIEVTTGludCBiZWNhdXNlIHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGFib3ZlIGluY2x1ZGVcbiAgICBjb21wdXRlTGF5b3V0LmZpbGxOb2Rlcyhub2RlKTtcbiAgICBjb21wdXRlTGF5b3V0LmNvbXB1dGVMYXlvdXQobm9kZSk7XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH07XG59KSk7XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbm1vZHVsZS5leHBvcnRzLlRpbnlFbWl0dGVyID0gRTtcbiIsImltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IFRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnRleHR1cmUgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHNyYywgKHRleHR1cmUsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmV2ZW50LmVtaXQoJ3RleHRfX2xvYWRfX2RvbmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ29uZmlnKGZudFRleHQ6IHN0cmluZykge1xuICAgIGZudFRleHQgPSBmbnRUZXh0LnNwbGl0KCdcXHJcXG4nKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBmbnRUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsaW5lc1BhcnNlZDogc3RyaW5nW11bXSA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUudHJpbSgpLnNwbGl0KCcgJykpO1xuXG4gICAgY29uc3QgY2hhcnNMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NoYXJzJyk7XG4gICAgY29uc3QgY2hhcnNDb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyc0xpbmUubGluZSwgJ2NvdW50Jyk7XG5cbiAgICBjb25zdCBjb21tb25MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NvbW1vbicpO1xuICAgIHRoaXMubGluZUhlaWdodCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29tbW9uTGluZS5saW5lLCAnbGluZUhlaWdodCcpO1xuXG4gICAgY29uc3QgaW5mb0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnaW5mbycpO1xuICAgIHRoaXMuZm9udFNpemUgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGluZm9MaW5lLmxpbmUsICdzaXplJyk7XG5cbiAgICAvLyDmjqXljbgga2VybmluZ3NcbiAgICBjb25zdCBrZXJuaW5nc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAna2VybmluZ3MnKTtcbiAgICBsZXQga2VybmluZ3NDb3VudCA9IDA7XG4gICAgbGV0IGtlcm5pbmdzU3RhcnQgPSAtMTtcbiAgICBpZiAoa2VybmluZ3NMaW5lLmxpbmUpIHtcbiAgICAgIGtlcm5pbmdzQ291bnQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGtlcm5pbmdzTGluZS5saW5lLCAnY291bnQnKTtcbiAgICAgIGtlcm5pbmdzU3RhcnQgPSBrZXJuaW5nc0xpbmUuaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJzOiBDaGFycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgNCArIGNoYXJzQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgY2hhclRleHQ6IHN0cmluZyA9IGxpbmVzW2ldO1xuICAgICAgY29uc3QgbGV0dGVyOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdpZCcpKTtcblxuICAgICAgY29uc3QgYzogQ2hhckRhdGEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4JyksXG4gICAgICAgIHk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5JyksXG4gICAgICAgIHc6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd3aWR0aCcpLFxuICAgICAgICBoOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaGVpZ2h0JyksXG4gICAgICAgIG9mZlg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4b2Zmc2V0JyksXG4gICAgICAgIG9mZlk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5b2Zmc2V0JyksXG4gICAgICAgIHhhZHZhbmNlOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneGFkdmFuY2UnKSxcbiAgICAgICAga2VybmluZzoge31cbiAgICAgIH07XG4gICAgICBjaGFyc1tsZXR0ZXJdID0gYztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBrZXJuaW5nc1xuICAgIGlmIChrZXJuaW5nc0NvdW50KSB7XG4gICAgICBmb3IgKGxldCBpID0ga2VybmluZ3NTdGFydDsgaSA8PSBrZXJuaW5nc1N0YXJ0ICsga2VybmluZ3NDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGZpcnN0OiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2ZpcnN0JykpO1xuICAgICAgICBjb25zdCBzZWNvbmQ6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnc2Vjb25kJykpO1xuICAgICAgICBjb25zdCBhbW91bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2Ftb3VudCcpO1xuXG4gICAgICAgIGlmIChjaGFyc1tzZWNvbmRdKSB7XG4gICAgICAgICAgY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQ6IHN0cmluZ1tdW10sIGxpbmVOYW1lID0gJycpOiBDb25maWdMaW5lRGF0YSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGVuID0gbGluZXNQYXJzZWQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcblxuICAgICAgaWYgKGl0ZW1bMF0gPT09IGxpbmVOYW1lKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgbGluZSA9IGl0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmUsXG4gICAgICBpbmRleCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29uZmlnVGV4dDogc3RyaW5nW10gfCBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbUNvbmZpZ1RleHRMaXN0ID0gQXJyYXkuaXNBcnJheShjb25maWdUZXh0KSA/IGNvbmZpZ1RleHQgOiBjb25maWdUZXh0LnNwbGl0KCcgJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGl0ZW1Db25maWdUZXh0TGlzdDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtQ29uZmlnVGV4dCA9IGl0ZW1Db25maWdUZXh0TGlzdFtpXTtcbiAgICAgIGlmIChrZXkgPT09IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZyhrZXkubGVuZ3RoICsgMSk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsImludGVyZmFjZSBEZWJ1Z0luZm9JdGVtIHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgaXNJbm5lcjogYm9vbGVhbjtcbiAgZW5kPzogbnVtYmVyO1xuICBjb3N0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z0luZm8ge1xuICBwdWJsaWMgaW5mbzogeyBba2V5OiBzdHJpbmddOiBEZWJ1Z0luZm9JdGVtIH0gPSB7fTtcbiAgcHVibGljIHRvdGFsU3RhcnQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0b3RhbENvc3Q6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RhcnQobmFtZTogc3RyaW5nLCBpc0lubmVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50b3RhbFN0YXJ0ID09PSAwKSB7XG4gICAgICB0aGlzLnRvdGFsU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5mb1tuYW1lXSA9IHtcbiAgICAgIHN0YXJ0OiBEYXRlLm5vdygpLFxuICAgICAgaXNJbm5lcixcbiAgICB9O1xuICB9XG5cbiAgZW5kKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmluZm9bbmFtZV0pIHtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5lbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmNvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy5pbmZvW25hbWVdLnN0YXJ0O1xuICAgICAgdGhpcy50b3RhbENvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy50b3RhbFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5mbyA9IHt9O1xuICAgIHRoaXMudG90YWxTdGFydCA9IDA7XG4gICAgdGhpcy50b3RhbENvc3QgPSAwO1xuICB9XG5cbiAgbG9nKG5lZWRJbm5lcjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgbG9nSW5mbyA9ICdMYXlvdXQgZGVidWcgaW5mbzogXFxuJztcbiAgICBsb2dJbmZvICs9IE9iamVjdC5rZXlzKHRoaXMuaW5mbykucmVkdWNlKChzdW0sIGN1cnIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluZm9bY3Vycl0uaXNJbm5lciAmJiAhbmVlZElubmVyKSB7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgICBzdW0gKz0gYCR7Y3Vycn06ICR7dGhpcy5pbmZvW2N1cnJdLmNvc3R9XFxuYDtcbiAgICAgIHJldHVybiBzdW07XG4gICAgfSwgJycpO1xuXG4gICAgbG9nSW5mbyArPSBgdG90YWxDb3N0OiAke3RoaXMudG90YWxDb3N0fVxcbmA7XG5cbiAgICByZXR1cm4gbG9nSW5mbztcbiAgfVxufVxuIiwiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcbmltcG9ydCB7IG5vbmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG50eXBlIENhbGxiYWNrID0gKGltZzogSFRNTEltYWdlRWxlbWVudCwgZnJvbUNhY2hlOiBib29sZWFuKSA9PiB2b2lkO1xuaW50ZXJmYWNlIEltYWdlQ2FjaGUge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGxvYWREb25lOiBib29sZWFuO1xuICBvbmxvYWRjYmtzOiBDYWxsYmFja1tdO1xuICBvbmVycm9yY2JrczogQ2FsbGJhY2tbXTtcbn1cblxuY2xhc3MgSW1hZ2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBpbWdQb29sID0gbmV3IFBvb2w8SW1hZ2VDYWNoZT4oJ2ltZ1Bvb2wnKTtcbiAgXG4gIGdldFJlcyhzcmM6IHN0cmluZyk6IEltYWdlQ2FjaGUge1xuICAgIHJldHVybiB0aGlzLmltZ1Bvb2wuZ2V0KHNyYyk7XG4gIH1cblxuICBsb2FkSW1hZ2VQcm9taXNlKHNyYzogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRJbWFnZShzcmMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcsIHN1Y2Nlc3M6IENhbGxiYWNrID0gbm9uZSwgZmFpbDogQ2FsbGJhY2sgPSBub25lKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGlmICghc3JjKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5nZXRSZXMoc3JjKTtcblxuICAgIC8vIOWbvueJh+W3sue7j+iiq+WKoOi9vei/h++8jOebtOaOpei/lOWbnuWbvueJh+W5tuS4lOaJp+ihjOWbnuiwg1xuICAgIGlmIChjYWNoZSAmJiBjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuICAgICAgc3VjY2VzcyhpbWcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoY2FjaGUgJiYgIWNhY2hlLmxvYWREb25lKSB7XG4gICAgICAvLyDlm77niYfmraPlnKjliqDovb3ov4fnqIvkuK3vvIzov5Tlm57lm77niYflubbkuJTnrYnlvoXlm77niYfliqDovb3lrozmiJDmiafooYzlm57osINcbiAgICAgIGltZyA9IGNhY2hlLmltZztcblxuICAgICAgY2FjaGUub25sb2FkY2Jrcy5wdXNoKHN1Y2Nlc3MpO1xuICAgICAgY2FjaGUub25lcnJvcmNia3MucHVzaChmYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Yib5bu65Zu+54mH77yM5bCG5Zue6LCD5Ye95pWw5o6o5YWl5Zue6LCD5Ye95pWw5qCIXG4gICAgICBpbWcgPSBlbnYuY3JlYXRlSW1hZ2UoKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7XG4gICAgICAgIGltZyxcbiAgICAgICAgbG9hZERvbmU6IGZhbHNlLFxuICAgICAgICBvbmxvYWRjYmtzOiBbc3VjY2Vzc10sXG4gICAgICAgIG9uZXJyb3JjYmtzOiBbZmFpbF0sXG4gICAgICB9XG4gICAgIFxuICAgICAgdGhpcy5pbWdQb29sLnNldChzcmMsIG5ld0NhY2hlKTtcblxuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUubG9hZERvbmUgPSB0cnVlO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW1hZ2VNYW5hZ2VyKCk7XG4iLCJjb25zdCBwb29sczogUG9vbDxhbnk+W10gPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbDxUPiB7XG4gIHB1YmxpYyBuYW1lID0gJ3Bvb2wnXG4gIHB1YmxpYyBwb29sOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUgPSAncG9vbCcpIHtcbiAgICBjb25zdCBjdXJyID0gcG9vbHMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG5cbiAgICBpZiAoY3Vycikge1xuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcblxuICAgIHBvb2xzLnB1c2godGhpcyk7XG4gIH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5wb29sW2tleV07XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5wb29sW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICB9XG5cbiAgZ2V0TGlzdCgpOiBUW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMucG9vbCk7XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyB3aWR0aCA9IDA7XG4gIHB1YmxpYyBoZWlnaHQgPSAwO1xuICBwdWJsaWMgbGVmdCA9IDA7XG4gIHB1YmxpYyByaWdodCA9IDA7XG4gIHB1YmxpYyB0b3AgPSAwO1xuICBwdWJsaWMgYm90dG9tID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5zZXQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNldChsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICB0aGlzLnJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm55u45LqkXG4gICAqIOWOn+eQhuWPr+ingTogaHR0cHM6Ly96aHVhbmxhbi56aGlodS5jb20vcC8yOTcwNDA2NFxuICAgKi9cbiAgaW50ZXJzZWN0cyhyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5yaWdodCA8IHJlY3QubGVmdCB8fCByZWN0LnJpZ2h0IDwgdGhpcy5sZWZ0IHx8IHRoaXMuYm90dG9tIDwgcmVjdC50b3AgfHwgcmVjdC5ib3R0b20gPCB0aGlzLnRvcCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tlciB7XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGFuaW1hdGlvbklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyQ2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgbmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyTmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuXG4gIHByaXZhdGUgbGFzdFRpbWUhOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZGVsdGFUaW1lID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgLy8gY29uc29sZS5sb2coZHQpXG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pbm5lck5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmlubmVyTmV4dENicy5mb3JFYWNoKGNiID0+IGNiKGRlbHRhVGltZSkpO1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiB0aGlzLmNicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KGNiOiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJOZXh0Q2JzLnB1c2goY2IpIDogdGhpcy5uZXh0Q2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUlubmVyKCkge1xuICAgIHRoaXMuaW5uZXJDYnMgPSBbXTtcbiAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgKHRoaXMuY2JzLmluZGV4T2YoY2IpID4gLTEgfHwgdGhpcy5pbm5lckNicy5pbmRleE9mKGNiKSA+IC0xKSkge1xuICAgICAgY29uc3QgbGlzdCA9IGlzSW5uZXIgPyB0aGlzLmlubmVyQ2JzIDogdGhpcy5jYnM7XG4gICAgICBsaXN0LnNwbGljZSh0aGlzLmNicy5pbmRleE9mKGNiKSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNicy5sZW5ndGggJiYgIXRoaXMuaW5uZXJDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmxhc3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPT09IG51bGwgJiYgKHRoaXMuY2JzLmxlbmd0aCB8fCB0aGlzLmlubmVyQ2JzLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gbm9uZSgpIHsgfVxuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGVudW0gU1RBVEUge1xuICBVTklOSVQgPSAnVU5JTklUJyxcbiAgSU5JVEVEID0gJ0lOSVRFRCcsXG4gIFJFTkRFUkVEID0gJ1JFTkRFUkVEJyxcbiAgQ0xFQVIgPSAnQ0xFQVInLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eCAmJiBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUb3VjaEFycmF5KHRvdWNoZXM6IEdhbWVUb3VjaFtdKSB7XG4gIHJldHVybiB0b3VjaGVzLm1hcCh0b3VjaCA9PiAoe1xuICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXG4gICAgcGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIHBhZ2VZOiB0b3VjaC5wYWdlWSxcbiAgICBjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuICAgIGNsaWVudFk6IHRvdWNoLmNsaWVudFksXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR2FtZVRvdWNoRXZlbnQoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KTogZSBpcyBHYW1lVG91Y2hFdmVudCB7XG4gIHJldHVybiAndG91Y2hlcycgaW4gZTtcbn1cblxuLyoqXG4gKiDlj5bmnIDlsI/lgLzlkozmnIDlpKflgLzkuYvpl7TnmoTljLrpl7TpmZDlrprlgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIg6ZyA6KaB6KKr5aSE55CG55qE5pWw5a2XXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIOacgOWwj+WAvFxuICogQHBhcmFtIHtudW1iZXJ9IG1heCDmnIDlpKflgLxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bWJlcjogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihudW1iZXIsIG1heCkpO1xufVxuXG4vKipcbiAqIOS4pOS4quaVsOS5i+mXtOeahOe6v+aAp+aPkuWAvOOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHJhdGlvOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogcmF0aW87XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0UGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIsIHBhcmVudERhdGE6IG51bWJlcikge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoRGF0YSA9IGRhdGEubWF0Y2goLyhcXGQrKD86XFwuXFxkKyk/KSUvKTtcbiAgaWYgKG1hdGNoRGF0YSAmJiBtYXRjaERhdGFbMV0pIHtcbiAgICByZXR1cm4gcGFyZW50RGF0YSAqIHBhcnNlRmxvYXQobWF0Y2hEYXRhWzFdKSAqIDAuMDE7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiAvXFxkKyg/OlxcLlxcZCspPyUvLnRlc3QoZGF0YSk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLy8gY29tcG9uZW50c1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgRWxlbWVudCwgQnV0dG9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IElMYXlvdXQsIElMYXlvdXRCb3ggfSBmcm9tICcuLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCB7IENhbGxiYWNrLCBUcmVlTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGNvbnZlcnRQZXJjZW50LCBpc1BlcmNlbnQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogYW55O1xufVxuXG5jb25zdCBjb25zdHJ1Y3Rvck1hcDogeyBba2V5OiBzdHJpbmddOiBDb25zdHJ1Y3RvciB9ID0ge1xuICB2aWV3OiBWaWV3LFxuICB0ZXh0OiBUZXh0LFxuICBpbWFnZTogSW1hZ2UsXG4gIHNjcm9sbHZpZXc6IFNjcm9sbFZpZXcsXG4gIGJpdG1hcHRleHQ6IEJpdE1hcFRleHQsXG4gIGNhbnZhczogQ2FudmFzLFxuICBidXR0b246IEJ1dHRvbixcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lOiBzdHJpbmcsIENvbnN0cnVjdG9yOiBDb25zdHJ1Y3Rvcikge1xuICBjb25zdHJ1Y3Rvck1hcFtuYW1lXSA9IENvbnN0cnVjdG9yO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKG5vZGU6IFRyZWVOb2RlLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgcGFyZW50PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW25vZGUubmFtZV07XG5cbiAgaWYgKCFDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdIOS4jeaUr+aMgee7hOS7tiAke25vZGUubmFtZX1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbiB8fCBbXTtcblxuICBjb25zdCBhdHRyID0gbm9kZS5hdHRyIHx8IHt9O1xuICBjb25zdCBkYXRhc2V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGlkID0gYXR0ci5pZCB8fCAnJztcblxuICBjb25zdCBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gT2JqZWN0LmtleXMoYXR0cikucmVkdWNlKChvYmosIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGF0dHJba2V5XTtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGtleTtcblxuICAgICAgaWYgKGtleSA9PT0gJ2lkJykge1xuICAgICAgICBvYmouc3R5bGUgPSBPYmplY3QuYXNzaWduKG9iai5zdHlsZSB8fCB7fSwgc3R5bGVbaWRdIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IHZhbHVlLnNwbGl0KC9cXHMrLykucmVkdWNlKChyZXMsIG9uZUNsYXNzKSA9PiBPYmplY3QuYXNzaWduKHJlcywgc3R5bGVbb25lQ2xhc3NdKSwgb2JqLnN0eWxlIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cmlidXRlLnN0YXJ0c1dpdGgoJ2RhdGEtJykpIHtcbiAgICAgICAgY29uc3QgZGF0YUtleSA9IGF0dHJpYnV0ZS5zdWJzdHJpbmcoNSk7XG5cbiAgICAgICAgZGF0YXNldFtkYXRhS2V5XSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBvYmouZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgYW55Pik7XG5cbiAgLy8g55So5LqO5ZCO57ut5YWD57Sg5p+l6K+iXG4gIGFyZ3MuaWROYW1lID0gaWQ7XG4gIC8vIEB0cy1pZ25vcmVcbiAgdGhpcy5lbGVDb3VudCArPSAxO1xuICAvLyBAdHMtaWdub3JlXG4gIGFyZ3MuaWQgPSB0aGlzLmVsZUNvdW50O1xuICBhcmdzLmNsYXNzTmFtZSA9IGF0dHIuY2xhc3MgfHwgJyc7XG5cbiAgY29uc3QgdGhpc1N0eWxlID0gYXJncy5zdHlsZTtcbiAgaWYgKHRoaXNTdHlsZSkge1xuICAgIGxldCBwYXJlbnRTdHlsZTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IHBhcmVudC5zdHlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSBlbnYuZ2V0Um9vdENhbnZhc1NpemUoKTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpc1N0eWxlLm9wYWNpdHkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFN0eWxlICYmIHBhcmVudFN0eWxlLm9wYWNpdHkgIT09IDEgJiYgdHlwZW9mIHBhcmVudFN0eWxlLm9wYWNpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IHBhcmVudFN0eWxlLm9wYWNpdHkgKiB0aGlzU3R5bGUub3BhY2l0eTtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhhcmdzKTtcbiAgY29uc3QgZWxlbWVudCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbGVtZW50LnJvb3QgPSB0aGlzO1xuICBlbGVtZW50LnRhZ05hbWUgPSBub2RlLm5hbWU7XG5cbiAgZWxlbWVudC5hZnRlckNyZWF0ZSgpO1xuXG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkTm9kZTogVHJlZU5vZGUpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgY2hpbGRFbGVtZW50ID0gY3JlYXRlLmNhbGwodGhpcywgY2hpbGROb2RlLCBzdHlsZSwgYXJncyk7XG5cbiAgICBpZiAoY2hpbGRFbGVtZW50KSB7XG4gICAgICBlbGVtZW50LmFkZChjaGlsZEVsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJDaGlsZHJlbihjaGlsZHJlbjogRWxlbWVudFtdLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXIgPSB0cnVlKSB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgLy8gY2hpbGQuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgY2hpbGQuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNoaWxkLmluc2VydChjb250ZXh0LCBuZWVkUmVuZGVyKTtcblxuICAgIC8vIFNjcm9sbFZpZXfnmoTlrZDoioLngrnmuLLmn5PkuqTnu5lTY3JvbGxWaWV36Ieq5bex77yM5LiN5pSv5oyB5bWM5aWXU2Nyb2xsVmlld1xuICAgIHJldHVybiByZW5kZXJDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgY29udGV4dCwgIGNoaWxkLnR5cGUgPT09ICdTY3JvbGxWaWV3JyA/IGZhbHNlIDogbmVlZFJlbmRlcik7XG4gIH0pO1xufVxuXG4vKipcbiAqIOWwhuW4g+WxgOagkeeahOW4g+WxgOS/oeaBr+WKoOW3pei1i+WAvOWIsOa4suafk+agkVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5b3V0Q2hpbGRyZW4oZWxlbWVudDogRWxlbWVudCkge1xuICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQubGF5b3V0Qm94ID0gY2hpbGQubGF5b3V0Qm94IHx8IHt9O1xuXG4gICAgWydsZWZ0JywgJ3RvcCcsICd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKChwcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNoaWxkLmxheW91dEJveFtwcm9wIGFzIGtleW9mIElMYXlvdXRCb3hdID0gY2hpbGQubGF5b3V0Py5bcHJvcCBhcyBrZXlvZiBJTGF5b3V0XSBhcyBudW1iZXI7XG4gICAgfSk7XG5cbiAgICBpZiAoY2hpbGQucGFyZW50KSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gKGNoaWxkLnBhcmVudC5sYXlvdXRCb3guYWJzb2x1dGVYIHx8IDApICsgY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gKGNoaWxkLnBhcmVudC5sYXlvdXRCb3guYWJzb2x1dGVZIHx8IDApICsgY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfVxuXG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWTtcbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYO1xuXG5cbiAgICBsYXlvdXRDaGlsZHJlbihjaGlsZCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBub25lKCkgeyB9XG5leHBvcnQgZnVuY3Rpb24gaXRlcmF0ZVRyZWUoZWxlbWVudDogRWxlbWVudCwgY2FsbGJhY2s6IENhbGxiYWNrID0gbm9uZSkge1xuICBjYWxsYmFjayhlbGVtZW50KTtcblxuICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaXRlcmF0ZVRyZWUoY2hpbGQsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCByZXBhaW50Q2hpbGRyZW4gPSAoY2hpbGRyZW46IEVsZW1lbnRbXSkgPT4ge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIGlmIChjaGlsZC50eXBlICE9PSAnU2Nyb2xsVmlldycpIHtcbiAgICAgIHJlcGFpbnRDaGlsZHJlbihjaGlsZC5jaGlsZHJlbik7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXBhaW50VHJlZSA9ICh0cmVlOiBFbGVtZW50KSA9PiB7XG4gIHRyZWUucmVwYWludCgpO1xuXG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICByZXBhaW50VHJlZShjaGlsZCk7XG4gIH0pO1xufTtcblxuaW50ZXJmYWNlIEVsZW1lbnRBcmdzIHtcbiAgc3R5bGU6IG9iamVjdDtcbiAgaWROYW1lOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBpZDogbnVtYmVyO1xuICBkYXRhc2V0OiBvYmplY3Q7XG4gIHNyYz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUIGV4dGVuZHMgRWxlbWVudD4ocm9vdDogVCwgZWxlbWVudDogRWxlbWVudCwgZGVlcCA9IHRydWUsIHBhcmVudD86IEVsZW1lbnQpIHtcbiAgY29uc3QgQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvck1hcFtlbGVtZW50LnRhZ05hbWUgYXMgc3RyaW5nXTtcbiAgLy8gQHRzLWlnbm9yZVxuICByb290LmVsZUNvdW50ICs9IDE7XG5cbiAgY29uc3QgYXJnczogRWxlbWVudEFyZ3MgPSB7XG4gICAgc3R5bGU6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuc3R5bGUpLFxuICAgIGlkTmFtZTogZWxlbWVudC5pZE5hbWUsXG4gICAgY2xhc3NOYW1lOiBlbGVtZW50LmNsYXNzTmFtZSxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWQ6IHJvb3QuZWxlQ291bnQsXG4gICAgZGF0YXNldDogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5kYXRhc2V0KSxcbiAgICBuYW1lOiBlbGVtZW50LnRhZ05hbWUsXG4gIH07XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIGFyZ3Muc3JjID0gZWxlbWVudC5zcmM7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEJpdE1hcFRleHQpIHtcbiAgICBhcmdzLnZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld0VsZW1lbmV0ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICBuZXdFbGVtZW5ldC5yb290ID0gcm9vdDtcbiAgLy8gQHRzLWlnbm9yZVxuICBuZXdFbGVtZW5ldC5pbnNlcnQocm9vdC5yZW5kZXJDb250ZXh0LCBmYWxzZSk7XG4gIG5ld0VsZW1lbmV0Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGQobmV3RWxlbWVuZXQpO1xuICB9XG5cbiAgaWYgKGRlZXApIHtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjbG9uZShyb290LCBjaGlsZCwgZGVlcCwgbmV3RWxlbWVuZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld0VsZW1lbmV0O1xufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgQml0TWFwRm9udCBmcm9tICcuLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sPEJpdE1hcEZvbnQ+KCdiaXRNYXBQb29sJyk7XG5cbmludGVyZmFjZSBJQml0TWFwVGV4dE9wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbiAgZm9udD86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0TWFwVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdCaXRNYXBUZXh0JztcbiAgcHJpdmF0ZSB2YWx1ZXNyYzogc3RyaW5nO1xuICBwdWJsaWMgZm9udDogQml0TWFwRm9udDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQml0TWFwVGV4dE9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHZhbHVlID0gJycsXG4gICAgICBmb250ID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgIH0gPSBvcHRzO1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG5cbiAgICB0aGlzLmZvbnQgPSBiaXRNYXBQb29sLmdldChmb250KTtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgY29uc29sZS5lcnJvcihgTWlzc2luZyBCaXRtYXBGb250IFwiJHtmb250fVwiLCBwbGVhc2UgaW52b2tlIEFQSSBcInJlZ2lzdEJpdE1hcEZvbnRcIiBiZWZvcmUgdXNpbmcgXCJCaXRNYXBUZXh0XCJgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZW1pdCgncmVwYWludCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250LnJlYWR5KSB7XG4gICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb250LmV2ZW50Lm9uKCd0ZXh0X19sb2FkX19kb25lJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dEJvdW5kcygpIHtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgeyBsZXR0ZXJTcGFjaW5nID0gMCB9ID0gc3R5bGU7XG4gICAgbGV0IHdpZHRoID0gMDtcblxuICAgIC8vIOiusOW9leS4iuS4gOS4quWtl+espu+8jOaWueS+v+WkhOeQhiBrZXJuaW5nXG4gICAgbGV0IHByZXZDaGFyQ29kZSA9IG51bGw7XG5cblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcblxuICAgICAgaWYgKGNmZykge1xuICAgICAgICBpZiAocHJldkNoYXJDb2RlICYmIGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV0pIHtcbiAgICAgICAgICB3aWR0aCArPSBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdO1xuICAgICAgICB9XG4gIFxuICAgICAgICB3aWR0aCArPSBjZmcueGFkdmFuY2U7XG5cbiAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgd2lkdGggKz0gbGV0dGVyU3BhY2luZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQ6IHRoaXMuZm9udC5saW5lSGVpZ2h0IH07XG4gIH1cblxuICByZW5kZXJUZXh0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRUZXh0Qm91bmRzKCk7XG4gICAgY29uc3QgZGVmYXVsdExpbmVIZWlnaHQgPSB0aGlzLmZvbnQubGluZUhlaWdodCBhcyBudW1iZXI7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgbGV0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZIH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCA9IDAsIC8vIOayoeacieiuvue9rumHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgaGVpZ2h0ID0gMCwgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICB0ZXh0QWxpZ24sIC8vIOaWh+Wtl+W3puWPs+Wvuem9kOaWueW8j1xuICAgICAgdmVydGljYWxBbGlnbixcbiAgICAgIGxldHRlclNwYWNpbmcgPSAwLFxuICAgIH0gPSBzdHlsZTtcbiAgICAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gKHN0eWxlLmxpbmVIZWlnaHQgfHwgZGVmYXVsdExpbmVIZWlnaHQpIGFzIG51bWJlclxuXG4gICAgY29uc3Qgc2NhbGVZID0gbGluZUhlaWdodCAvIGRlZmF1bHRMaW5lSGVpZ2h0O1xuXG4gICAgY29uc3QgcmVhbFdpZHRoID0gc2NhbGVZICogYm91bmRzLndpZHRoO1xuXG4gICAgLy8g5aaC5p6c5paH5a2X55qE5riy5p+T5Yy65Z+f6auY5bqm5bCP5LqO55uS5a2Q6auY5bqm77yM6YeH55So5a+56b2Q5pa55byPXG4gICAgaWYgKGxpbmVIZWlnaHQgPCBoZWlnaHQpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnbWlkZGxlJykge1xuICAgICAgICBkcmF3WSArPSAoaGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnYm90dG9tJykge1xuICAgICAgICBkcmF3WSA9IGRyYXdZICsgaGVpZ2h0IC0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2lkdGggPiByZWFsV2lkdGgpIHtcbiAgICAgIGlmICh0ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgIGRyYXdYICs9ICh3aWR0aCAtIHJlYWxXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgZHJhd1ggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcblxuICAgICAgaWYgKHByZXZDaGFyQ29kZSAmJiBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdKSB7XG4gICAgICAgIGRyYXdYICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICB0aGlzLmZvbnQudGV4dHVyZSBhcyBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICAgIGNmZy54LFxuICAgICAgICAgIGNmZy55LFxuICAgICAgICAgIGNmZy53LFxuICAgICAgICAgIGNmZy5oLFxuICAgICAgICAgIGRyYXdYICsgY2ZnLm9mZlggKiBzY2FsZVkgLSBvcmlnaW5YLFxuICAgICAgICAgIGRyYXdZICsgY2ZnLm9mZlkgKiBzY2FsZVkgLSBvcmlnaW5ZLFxuICAgICAgICAgIGNmZy53ICogc2NhbGVZLFxuICAgICAgICAgIGNmZy5oICogc2NhbGVZLFxuICAgICAgICApO1xuXG4gICAgICAgIGRyYXdYICs9IChjZmcueGFkdmFuY2UgKiBzY2FsZVkgKyBsZXR0ZXJTcGFjaW5nKTtcblxuICAgICAgICBwcmV2Q2hhckNvZGUgPSBjaGFyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFRleHQsIHsgSVRleHRQcm9wcyB9IGZyb20gJy4vdGV4dCc7XHJcbmltcG9ydCB7IGxlcnAgfSBmcm9tICcuLi9jb21tb24vdXRpbCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbiBleHRlbmRzIFRleHQge1xyXG4gIC8vIOe8qeaUvuWKqOeUu+eahOaXtumVv1xyXG4gIHB1YmxpYyBzY2FsZUR1cmF0aW9uID0gMTAwO1xyXG4gIC8vIOW9k+WJjee8qeaUvuWKqOeUu+aYr+WQpuaSreaUvuWujOavlVxyXG4gIHByaXZhdGUgc2NhbGVEb25lID0gdHJ1ZTtcclxuICAvLyDnvKnmlL7liqjnlLvlvIDlp4vnmoTml7bpl7RcclxuICBwcml2YXRlIHRpbWVDbGljayA9IDA7XHJcbiAgLy8g57yp5pS+5Yqo55S755qEIHNjYWxlIOWIneWni+WAvO+8jOi/meW5tuS4jeaYr+WbuuWumuS4jeWPmOeahO+8jOW9k+eCueWHu+e7k+adn++8jOWPr+iDvemcgOimgeS7juWkp+WIsOWwj+WPmOaNolxyXG4gIHByaXZhdGUgZnJvbVNjYWxlID0gMTtcclxuICAvLyDnvKnmlL7liqjnlLvnmoQgc2NhbGUg55uu5qCH5YC8XHJcbiAgcHJpdmF0ZSB0b1NjYWxlID0gMTtcclxuXHJcbiAgY29uc3RydWN0b3Ioe1xyXG4gICAgc3R5bGUgPSB7fSxcclxuICAgIGlkTmFtZSA9ICcnLFxyXG4gICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICB2YWx1ZSA9ICcnLFxyXG4gICAgZGF0YXNldCxcclxuICB9OiBJVGV4dFByb3BzKSB7XHJcbiAgICBzdXBlcih7XHJcbiAgICAgIGlkTmFtZSxcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgICAgaGVpZ2h0OiA2MCxcclxuICAgICAgICBsaW5lSGVpZ2h0OiA2MCxcclxuICAgICAgICBmb250U2l6ZTogMzAsXHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMzRhMTIzJyxcclxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXHJcbiAgICAgICAgLi4uc3R5bGUsXHJcbiAgICAgICAgJzphY3RpdmUnOiB7XHJcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjA1LCAxLjA1KScsXHJcbiAgICAgICAgICAuLi5zdHlsZVsnOmFjdGl2ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHZhbHVlLFxyXG4gICAgICBkYXRhc2V0LFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhZnRlckNyZWF0ZSgpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlKTtcclxuICB9XHJcblxyXG4gIGRlc3Ryb3lTZWxmKCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUpO1xyXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XHJcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlID0gKGR0OiBudW1iZXIpID0+IHtcclxuICAgIGlmICh0aGlzLnNjYWxlRG9uZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLnRpbWVDbGljayArPSBkdDtcclxuXHJcbiAgICBsZXQgcmF0aW8gPSAxO1xyXG5cclxuICAgIHJhdGlvID0gdGhpcy50aW1lQ2xpY2sgLyB0aGlzLnNjYWxlRHVyYXRpb247XHJcblxyXG4gICAgaWYgKHJhdGlvID4gMSkge1xyXG4gICAgICByYXRpbyA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHNjYWxlID0gbGVycCh0aGlzLmZyb21TY2FsZSwgdGhpcy50b1NjYWxlLCByYXRpbyk7XHJcbiAgICBsZXQgdHJhbnNmb3JtID0gYHNjYWxlKCR7c2NhbGV9LCAke3NjYWxlfSlgO1xyXG4gICAgdGhpcy5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XHJcblxyXG4gICAgaWYgKHJhdGlvID09PSAxKSB7XHJcbiAgICAgIHRoaXMuc2NhbGVEb25lID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2VudidcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUNhbnZhc09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBhdXRvQ3JlYXRlQ2FudmFzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgY2FudmFzSW5zdGFuY2U6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQ2FudmFzT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHdpZHRoID0gMTAwLFxuICAgICAgaGVpZ2h0ID0gMTAwLFxuICAgICAgYXV0b0NyZWF0ZUNhbnZhcyA9IGZhbHNlLFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5bCP5ri45oiP5Zy65pmv5LiL77yMc2hhcmVkQ2FudmFzIOWunuS+i+S4jeaWueS+v+iHquWKqOWIm+W7uu+8jOaPkOS+myBzZXR0ZXIg5omL5Yqo6K6+572uXG4gICAgICovXG4gICAgaWYgKGF1dG9DcmVhdGVDYW52YXMpIHtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBlbnYuY3JlYXRlQ2FudmFzKCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLndpZHRoID0gTnVtYmVyKHdpZHRoKTtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UuaGVpZ2h0ID0gTnVtYmVyKGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNhbnZhcygpIHtcbiAgICByZXR1cm4gdGhpcy5jYW52YXNJbnN0YW5jZTtcbiAgfVxuXG4gIHNldCBjYW52YXMoY3ZzOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwpIHtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gY3ZzO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmNhbnZhc0luc3RhbmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCB7IG5lZWRTdHJva2UsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg5byA5aeLXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhc0luc3RhbmNlLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOe7k+adn1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlKSB7XG4gICAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIHJlbmRlckFmZmVjdFN0eWxlcywgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgUmVjdCBmcm9tICcuLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgeyBJRGF0YXNldCwgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgYmFja2dyb3VuZEltYWdlUGFyc2VyLCBwYXJzZVRyYW5zZm9ybSwgSVJlbmRlckZvckxheW91dCB9IGZyb20gJy4vc3R5bGVQYXJzZXInO1xuaW1wb3J0IHsgY29udmVydFBlcmNlbnQgfSBmcm9tICcuLi9jb21tb24vdXRpbCdcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlJZDxUIGV4dGVuZHMgRWxlbWVudD4odHJlZTogRWxlbWVudCwgbGlzdDogKEVsZW1lbnQgfCBUKVtdID0gW10sIGlkOiBzdHJpbmcpOiBUW10ge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKGNoaWxkLmlkTmFtZSA9PT0gaWQpIHtcbiAgICAgIGxpc3QucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgZ2V0RWxlbWVudHNCeUlkKGNoaWxkLCBsaXN0LCBpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdCBhcyBUW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZDxUIGV4dGVuZHMgRWxlbWVudD4odHJlZTogRWxlbWVudCwgaWQ6IHN0cmluZyk6IFQge1xuICBjb25zdCBsaXN0ID0gZ2V0RWxlbWVudHNCeUlkKHRyZWUsIFtdLCBpZCk7XG5cbiAgcmV0dXJuIGxpc3Q/LlswXSB8fCBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTxUIGV4dGVuZHMgRWxlbWVudD4odHJlZTogRWxlbWVudCwgbGlzdDogKEVsZW1lbnQgfCBUKVtdID0gW10sIGNsYXNzTmFtZTogc3RyaW5nKTogVFtdIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTsgICAgICBcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3QgYXMgVFtdO1xufVxuXG4vKipcbiAqIOWwhuW9k+WJjeiKgueCuee9ruiEj++8jExheW91dCDnmoQgdGlja2VyIOS8muagueaNrui/meS4quagh+iusOS9jeaJp+ihjCByZWZsb3dcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldERpcnR5KGVsZTogRWxlbWVudCwgcmVhc29uPzogc3RyaW5nKSB7XG4gIC8vIGZvciBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZygnW0xheW91dF0gdHJpZ2dlciByZWZsb3cgY2F1c2UnLCBlbGUsIHJlYXNvbik7XG4gIGVsZS5pc0RpcnR5ID0gdHJ1ZTtcbiAgbGV0IHsgcGFyZW50IH0gPSBlbGU7XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuaXNEaXJ0eSA9IHRydWU7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxufVxuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyKCk7XG5cbmxldCB1dWlkID0gMDtcblxuY29uc3QgdG9FdmVudE5hbWUgPSAoZXZlbnQ6IHN0cmluZywgaWQ6IG51bWJlcikgPT4ge1xuICBjb25zdCBlbGVtZW50RXZlbnQgPSBbXG4gICAgJ2NsaWNrJyxcbiAgICAndG91Y2hzdGFydCcsXG4gICAgJ3RvdWNobW92ZScsXG4gICAgJ3RvdWNoZW5kJyxcbiAgICAndG91Y2hjYW5jZWwnLFxuICBdO1xuXG4gIGlmIChlbGVtZW50RXZlbnQuaW5kZXhPZihldmVudCkgIT09IC0xKSB7XG4gICAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbiAgfVxuXG4gIHJldHVybiBgZWxlbWVudC0ke2lkfS0ke2V2ZW50fWA7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElMYXlvdXRCb3gge1xuICBsZWZ0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWJzb2x1dGVYOiBudW1iZXI7XG4gIGFic29sdXRlWTogbnVtYmVyO1xuICBvcmlnaW5hbEFic29sdXRlWDogbnVtYmVyO1xuICBvcmlnaW5hbEFic29sdXRlWTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMYXlvdXQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgcmlnaHQ6IG51bWJlcjtcbiAgYm90dG9tOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZW51bSBTdHlsZU9wVHlwZSB7XG4gIFNldCxcbiAgRGVsZXRlLFxufVxuXG5jbGFzcyBFbGVtZW50Q2xhc3NMaXN0IHtcbiAgcHVibGljIHRva2VuczogU2V0PHN0cmluZz5cbiAgcHJpdmF0ZSBlbGVtZW50OiBFbGVtZW50O1xuXG4gIGNvbnN0cnVjdG9yKGVsZTogRWxlbWVudCwgaW5pdGlhbFRva2Vuczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGU7XG4gICAgdGhpcy50b2tlbnMgPSBuZXcgU2V0KGluaXRpYWxUb2tlbnMgfHwgW10pXG4gIH1cblxuICBnZXQgbGVuZ3RoKCkge1xuICAgIHJldHVybiB0aGlzLnRva2Vucy5zaXplO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMudG9rZW5zKS5qb2luKCcgJyk7XG4gIH1cblxuICBwdWJsaWMgY2hhbmdlSGFuZGxlcigpIHtcbiAgICBjb25zdCBlbGUgPSB0aGlzLmVsZW1lbnRcbiAgICBjb25zdCBvbGRTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIGVsZS5zdHlsZSk7XG4gICAgLy8g5qC55o2uIGNsYXNzTmFtZSDku47moLflvI/ooajkuK3nrpflh7rlvZPliY3lupTor6XkvZznlKjnmoTmoLflvI9cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgbmV3U3R5bGU6IElTdHlsZSA9IEFycmF5LmZyb20odGhpcy50b2tlbnMpLnJlZHVjZSgocmVzLCBvbmVDbGFzcykgPT4gT2JqZWN0LmFzc2lnbihyZXMsIGVsZS5yb290LnN0eWxlU2hlZXQhW29uZUNsYXNzXSksIHt9KTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCduZXdTdHlsZScsIG5ld1N0eWxlKVxuXG4gICAgbGV0IHBhcmVudFN0eWxlOiBJU3R5bGVcbiAgICBpZiAoZWxlLnBhcmVudCkge1xuICAgICAgcGFyZW50U3R5bGUgPSBlbGUucGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IGVudi5nZXRSb290Q2FudmFzU2l6ZSgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmV3U3R5bGUub3BhY2l0eSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5ld1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKG5ld1N0eWxlKS5jb25jYXQoT2JqZWN0LmtleXMob2xkU3R5bGUpKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIC8vIOaJi+WKqOmAmui/h3RoaXMuc3R5bGXorr7nva7ov4fnmoTmoLflvI/orqTkuLrmmK/lhoXogZTmoLflvI/vvIzkvJjlhYjnuqfmnIDpq5jvvIzkuZ/lsLHmmK8gY2xhc3NOYW1lIOeahOWxnuaAp+S4jeW9seWTjVxuICAgICAgaWYgKCFSZWZsZWN0LmhhcyhlbGUuaW5uZXJTdHlsZSwga2V5KSkge1xuICAgICAgICAvLyDmoLnmja4gY2xhc3NOYW1lIOiuoeeul+WHuuadpeeahOaWsOWinuaIluiAheS/ruaUueeahOagt+W8j1xuICAgICAgICBpZiAoUmVmbGVjdC5oYXMobmV3U3R5bGUsIGtleSkpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiDmlrDlop7nmoTmoLflvI/vvIzpnIDopoHljLrliIblh7rmmK8gY2xhc3NOYW1lIOWvvOiHtOeahOi/mOaYr+W8gOWPkeiAheaJi+WKqOS/ruaUueeahFxuICAgICAgICAgICAqIOS4tOaXtuWNoOS9je+8jOWboOS4uuWQjue7reeahCByZWZsb3cg5ZKMIHJlcGFpbnQg6YC76L6R5ZyoIHN0eWxlIFByb3h5IOWkhOeQhu+8jOi/meagt+WBmuWcqCBzdHlsZSBQcm94eSDkuZ/kuI3kvJrorqTkuLrmmK/lvIDlj5HogIXmiYvliqjorr7nva7nmoTmoLflvI9cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoIVJlZmxlY3QuaGFzKG9sZFN0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgICBSZWZsZWN0LnNldChlbGUub3JpZ2luU3R5bGUsIGtleSwgdW5kZWZpbmVkKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBuZXdTdHlsZVtrZXldXG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3dpZHRoJykge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KG5ld1ZhbHVlLCBwYXJlbnRTdHlsZS53aWR0aCkgOiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChrZXkgPT09ICdoZWlnaHQnKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KG5ld1ZhbHVlLCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoa2V5ID09PSAnb3BhY2l0eScgJiYgcGFyZW50U3R5bGUgJiYgcGFyZW50U3R5bGUub3BhY2l0eSAhPT0gMSAmJiB0eXBlb2YgcGFyZW50U3R5bGUub3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gcGFyZW50U3R5bGUub3BhY2l0eSAqIG5ld1ZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAvLyDmoLnmja4gY2xhc3NOYW1lIOiuoeeul+WHuueahOagt+W8j+imhuebluW9k+WJjeagt+W8j1xuICAgICAgICAgIGVsZS5zdHlsZVtrZXldID0gbmV3VmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZGVsJywga2V5KVxuICAgICAgICAgIC8vIOS4jeWcqOWGheiBlOagt+W8j++8jOagueaNriBjbGFzc05hbWUg6K6h566X5Ye655qE5qC35byP5Y+I5rKh5pyJ77yM6K6k5Li66L+Z5Lqb5qC35byP6YO95bqU6K+l5Yig6Zmk5LqGXG4gICAgICAgICAgZGVsZXRlIGVsZS5zdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIC8vIOa3u+WKoOS4gOS4quS7pOeJjFxuICBhZGQodG9rZW46IHN0cmluZykge1xuICAgIHRoaXMudG9rZW5zLmFkZCh0b2tlbik7XG4gICAgdGhpcy5jaGFuZ2VIYW5kbGVyKCk7XG4gIH1cblxuICAvLyDmo4Dmn6XliJfooajkuK3mmK/lkKblrZjlnKjmjIflrprnmoTku6TniYxcbiAgY29udGFpbnModG9rZW46IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLnRva2Vucy5oYXModG9rZW4pO1xuICB9XG5cbiAgLy8g5Yig6Zmk5LiA5Liq5Luk54mMXG4gIHJlbW92ZSh0b2tlbjogc3RyaW5nKSB7XG4gICAgdGhpcy50b2tlbnMuZGVsZXRlKHRva2VuKTtcbiAgICB0aGlzLmNoYW5nZUhhbmRsZXIoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG5cbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICAvLyBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwdWJsaWMgY2xhc3NMaXN0OiBFbGVtZW50Q2xhc3NMaXN0XG5cbiAgcHVibGljIG9yaWdpblN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGNsYXNzIOWxnuaAp++8jOS4gOiIrOeUqOS6juaooeadv+aPkuS7tlxuICAgKi9cbiAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDmnInkupsgc3R5bGUg5bGe5oCn5bm25LiN6IO955u05o6l55So5p2l5riy5p+T77yM6ZyA6KaB57uP6L+H6Kej5p6Q5LmL5ZCO5omN6IO96L+b6KGM5riy5p+T77yM6L+Z5Lqb5YC85LiN5Lya5a2Y5YKo5ZyoIHN0eWxlIOS4ilxuICAgKiDmr5TlpoIgc3R5bGUudHJhbnNmb3Jt77yM5aaC5p6c5q+P5qyh6YO96Kej5p6Q5oCn6IO95aSq5beu5LqGXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVuZGVyRm9yTGF5b3V0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHN0eWxlT3BUeXBlOiBTdHlsZU9wVHlwZSwgdmFsPzogYW55KSB7XG5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGlkID0gdXVpZCArPSAxLFxuICAgIGRhdGFzZXQgPSB7fSxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaWROYW1lID0gaWROYW1lO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIHRoaXMubGF5b3V0Qm94ID0ge1xuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgYWJzb2x1dGVYOiAwLFxuICAgICAgYWJzb2x1dGVZOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVg6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhc2V0ID0gZGF0YXNldDtcbiAgICBcbiAgICByZW5kZXJBZmZlY3RTdHlsZXMuZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICBsZXQgdmFsID0gc3R5bGVbcHJvcCBhcyBrZXlvZiBJU3R5bGVdO1xuICAgICAgaWYgKHR5cGVvZiB2YWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlUmVuZGVyRm9yTGF5b3V0KHRydWUsIHByb3AsIFN0eWxlT3BUeXBlLlNldCwgdmFsKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICAvLyB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuXG4gICAgY29uc3QgaW5pdGlhbFRva2VucyA9IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmZpbHRlcihpdGVtID0+ICEhaXRlbSlcbiAgICBpbml0aWFsVG9rZW5zLnB1c2goaWROYW1lKVxuICAgIHRoaXMuY2xhc3NMaXN0ID0gbmV3IEVsZW1lbnRDbGFzc0xpc3QodGhpcywgaW5pdGlhbFRva2VucylcbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlUmVuZGVyRm9yTGF5b3V0KGluaXQ6IGJvb2xlYW4sIHByb3A6IHN0cmluZywgc3R5bGVPcFR5cGU6IFN0eWxlT3BUeXBlLCB2YWw/OiBhbnkpIHtcbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIHRoaXMuc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3AsIHN0eWxlT3BUeXBlLCB2YWwpO1xuICAgIH1cbiAgXG4gICAgaWYgKHN0eWxlT3BUeXBlID09PSBTdHlsZU9wVHlwZS5TZXQpIHtcbiAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICBjYXNlICdiYWNrZ3JvdW5kSW1hZ2UnOlxuICAgICAgICAgIGNvbnN0IHVybCA9IGJhY2tncm91bmRJbWFnZVBhcnNlcih2YWwpO1xuXG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlID0gaW1nO1xuICAgICAgICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlICd0cmFuc2Zvcm0nOlxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVg7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5yZW5kZXJGb3JMYXlvdXQsIHBhcnNlVHJhbnNmb3JtKHZhbCkpO1xuICAgICAgICAgIGJyZWFrOyBcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgIGNhc2UgJ2JhY2tncm91bmRJbWFnZSc6XG4gICAgICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSAndHJhbnNmb3JtJzpcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDliJ3lp4vljJbnmoTpgLvovpHkuI3pnIDopoHlgZrov5nkupvliKTmlq1cbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgLy8gc2V0RGlydHkodGhpcywgYGNoYW5nZSBwcm9wICR7cHJvcH0gZnJvbSAke29sZFZhbH0gdG8gJHt2YWx9YCk7XG4gICAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgfSAgXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlubmVyU3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4gPSB7fVxuXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gdGhpcy5pbm5lclN0eWxlXG4gICAgICBcbiAgICAgIHRoaXMuc3R5bGUgPSBuZXcgUHJveHkodGhpcy5vcmlnaW5TdHlsZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcikge1xuICAgICAgICAgIC8vIOWIpOaWreWIneWni+WMlueahGNsYXNzTmFtZeaYr+WQpuWMheWQq+ivpeWxnuaAp1xuICAgICAgICAgIGNvbnN0IGlzU2V0Rm9ySW5uZXJTdHlsZSA9ICFSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApXG4gICAgICAgICAgbGV0IG9sZFZhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgb2xkVmFsICE9PSB2YWwpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZXQnLCBwcm9wLCBvbGRWYWwsIHZhbClcblxuICAgICAgICAgICAgZWxlLmNhbGN1bGF0ZVJlbmRlckZvckxheW91dChmYWxzZSwgcHJvcCwgU3R5bGVPcFR5cGUuU2V0LCB2YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1NldEZvcklubmVyU3R5bGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZXQgaW5uZXJTdHlsZScsIHByb3AsIHZhbClcbiAgICAgICAgICAgIC8vIOWwhuengeacieWxnuaAp+WQjOatpeS4gOS7veWIsCBpbm5lclN0eWxlXG4gICAgICAgICAgICBSZWZsZWN0LnNldChpbm5lclN0eWxlLCBwcm9wLCB2YWwpOyAgIFxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3A6IHN0cmluZykge1xuICAgICAgICAgIGVsZS5jYWxjdWxhdGVSZW5kZXJGb3JMYXlvdXQoZmFsc2UsIHByb3AgYXMgc3RyaW5nLCBTdHlsZU9wVHlwZS5EZWxldGUpO1xuXG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOS6i+S7tuWGkuazoemAu+i+kVxuICAgIFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hjYW5jZWwnLCAndG91Y2hlbmQnLCAnY2xpY2snXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub24oZXZlbnROYW1lLCAoZSwgdG91Y2hNc2cpID0+IHtcbiAgICAgICAgLy8g5aSE55CG5Lyq57G76YC76L6RXG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlcihlKTtcbiAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpcy5yb290KSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWN0aXZlRWxlbWVudHMucHVzaCh0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoY2FuY2VsJykge1xuICAgICAgICAgIHRoaXMuZGVhY3RpdmVIYW5kbGVyKGUpO1xuXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucm9vdC5hY3RpdmVFbGVtZW50cy5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWN0aXZlRWxlbWVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZW1pdChldmVudE5hbWUsIGUsIHRvdWNoTXNnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGFzc05hbWVMaXN0ID0gdGhpcy5pbm5lckNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNhY2hlU3R5bGUhOiBJU3R5bGU7XG5cbiAgYWN0aXZlSGFuZGxlcihlPzogYW55KSB7XG4gICAgY29uc3QgYWN0aXZlU3R5bGUgPSB0aGlzLnN0eWxlWyc6YWN0aXZlJ107XG5cbiAgICBpZiAoYWN0aXZlU3R5bGUpIHtcbiAgICAgIC8vIOWwhuW9k+WJjeeahHN0eWxl57yT5a2Y6LW35p2l77yM5ZyoIGFjdGl2ZSDlj5bmtojnmoTml7blgJnph43nva7lm57ljrtcbiAgICAgIHRoaXMuY2FjaGVTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3R5bGUpO1xuICAgICAgXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIGFjdGl2ZVN0eWxlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGRlYWN0aXZlSGFuZGxlcihlPzogYW55KSB7XG4gICAgY29uc3QgYWN0aXZlU3R5bGUgPSB0aGlzLnN0eWxlWyc6YWN0aXZlJ107XG5cbiAgICBpZiAoYWN0aXZlU3R5bGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKGFjdGl2ZVN0eWxlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlU3R5bGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSkge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICB0aGlzLnN0eWxlW2tleV0gPSB0aGlzLmNhY2hlU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5zdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCuemHjee7mOaOpeWPo++8jOWtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVwYWludCgpIHsgfVxuXG4gIC8qKlxuICAgKiDoioLngrnmuLLmn5PmjqXlj6PlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlbmRlcigpIHsgfVxuXG4gIC8qKlxuICAgKiDoioLngrnmnoTpgKDlh73mlbDliJ3lp4vljJblkI7osIPnlKjnmoTmlrnms5XvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIGFmdGVyQ3JlYXRlKCkge31cblxuICAvKipcbiAgICog5Y+C54WnIFdlYiDop4TojIPvvJpodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICovXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOiBSZWN0IHtcbiAgICBpZiAoIXRoaXMucmVjdCkge1xuICAgICAgdGhpcy5yZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY3Quc2V0KFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzkvYbov5nph4zlj6rov5Tlm57nrKblkIjmnaHku7bnmoTnrKzkuIDkuKroioLngrkgXG4gICAqL1xuICBnZXRFbGVtZW50QnlJZDxUIGV4dGVuZHMgRWxlbWVudD4oaWQ6IHN0cmluZyk6IFQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQ8VD4odGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQ8VCBleHRlbmRzIEVsZW1lbnQ+KGlkOiBzdHJpbmcpOiAoVCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5SWQ8VD4odGhpcywgW10sIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxjbGFzc05hbWUg5YyF5ZCr57uZ5a6a5Y+C5pWw55qE55qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lPFQgZXh0ZW5kcyBFbGVtZW50PihjbGFzc05hbWU6IHN0cmluZyk6IChUIHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlDbGFzc05hbWU8VD4odGhpcywgW10sIGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICog5biD5bGA6K6h566X5a6M5oiQ77yM5YeG5aSH5omn6KGM5riy5p+T5LmL5YmN5omn6KGM55qE5pON5L2c77yM5LiN5ZCM55qE5a2Q57G75pyJ5LiN5ZCM55qE6KGM5Li6XG4gICAqIOavlOWmgiBTY3JvbGxWaWV3IOWcqOa4suafk+S5i+WJjei/mOmcgOimgeWIneWni+WMlua7muWKqOebuOWFs+eahOiDveWKm1xuICAgKiAgXG4gICAqL1xuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCueino+mZpOS6i+S7tue7keWumlxuICAgKi9cbiAgdW5CaW5kRXZlbnQoKSB7XG4gICAgW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICdjbGljaycsXG4gICAgICAncmVwYWludCcsXG4gICAgXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5bCG6IqC54K55LuO5b2T5YmN6IqC54K55qCR5Lit5Yig6ZmkXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG4gICAgICBzZXREaXJ0eSh0aGlzLCBgcmVtb3ZlYCk7XG4gICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gdGhpcyBlbGVtZW50IGhhcyBiZWVuIHJlbW92ZWQnKTtcbiAgICB9XG4gIH1cblxuICBzZXREaXJ0eSgpIHtcbiAgICBzZXREaXJ0eSh0aGlzKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcblxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy51bkJpbmRFdmVudCgpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgLy8gdGhpcy5FRSA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcblxuICAgIC8vIGVsZW1lbnQg5Zyo55S75biD5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGvXG4gICAgLy8gdGhpcy5sYXlvdXRCb3ggPSBudWxsO1xuICAgIC8vIHRoaXMuc3R5bGUgPSBudWxsO1xuICAgIC8vIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBhZGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbkuIDkuKroioLngrnmt7vliqDkvZzkuLrlvZPliY3oioLngrnnmoTlrZDoioLngrlcbiAgICovXG4gIGFwcGVuZENoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICB0aGlzLmFkZChlbGVtZW50KTtcblxuICAgIHNldERpcnR5KHRoaXMsIGBhcHBlbmRDaGlsZCAke2VsZW1lbnR9YCk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkXG4gICAqL1xuICByZW1vdmVDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHNldERpcnR5KHRoaXMsIGByZW1vdmVDaGlsZCAke2VsZW1lbnR9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gdGhlIGVsZW1lbnQgdG8gYmUgcmVtb3ZlZCBpcyBub3QgYSBjaGlsZCBvZiB0aGlzIGVsZW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIC4uLnRoZUFyZ3M6IGFueVtdKSB7XG4gICAgRUUuZW1pdCh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIC4uLnRoZUFyZ3MpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24odG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBDYWxsYmFjaykge1xuICAgIEVFLm9mZih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmuLLmn5MgYm9yZGVyIOebuOWFs+iDveWKm+aKveixoe+8jOWtkOexu+WPr+aMiemcgOiwg+eUqFxuICAgKiDnlLHkuo7mlK/mjIHkuoZyb3RhdGXnibnmgKfvvIzmiYDku6XmiYDmnInnmoTmuLLmn5Ppg73pnIDopoHmlrnlkJHlh4/ljrt0cmFuc2Zvcm3nmoTkuK3pl7TngrlcbiAgICovXG4gIHJlbmRlckJvcmRlcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgb3JpZ2luWDogbnVtYmVyID0gMCwgb3JpZ2luWTogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCByYWRpdXMgPSBzdHlsZS5ib3JkZXJSYWRpdXMgfHwgMDtcbiAgICBjb25zdCB7IGJvcmRlcldpZHRoID0gMCB9ID0gc3R5bGU7XG4gICAgY29uc3QgdGxyID0gc3R5bGUuYm9yZGVyVG9wTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgdHJyID0gc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJiciA9IHN0eWxlLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJyciA9IHN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yID0gJycgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IHkgPSBib3guYWJzb2x1dGVZO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgY29uc3QgaGFzUmFkaXVzID0gcmFkaXVzIHx8IHRsciB8fCB0cnIgfHwgYmJyIHx8IGJycjtcblxuICAgIC8vIGJvcmRlcldpZHRoIOWSjCByYWRpdXMg6YO95rKh5pyJ77yM5LiN6ZyA6KaB5omn6KGM5ZCO57ut6YC76L6R77yM5o+Q5Y2H5oCn6IO9XG4gICAgaWYgKCFib3JkZXJXaWR0aCAmJiAhaGFzUmFkaXVzKSB7XG4gICAgICByZXR1cm4geyBuZWVkQ2xpcDogZmFsc2UsIG5lZWRTdHJva2U6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IGJvcmRlcldpZHRoO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGJvcmRlckNvbG9yO1xuXG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHRsciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZKTtcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIHRyciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZKTtcbiAgICAvLyDlj7PkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyB0cnIgLSBvcmlnaW5ZLCB0cnIpO1xuICAgIC8vIOWPs+S4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIGJyciAtIG9yaWdpblkpO1xuICAgIC8vIOWPs+S4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgeCArIHdpZHRoIC0gYnJyIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIGJycik7XG4gICAgLy8g5bem5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgYmJyIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblkpO1xuICAgIC8vIOW3puS4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4IC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIHggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gYmJyIC0gb3JpZ2luWSwgYmJyKTtcbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggLSBvcmlnaW5YLCB5ICsgdGxyIC0gb3JpZ2luWSk7XG4gICAgLy8g5bem5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgeCArIHRsciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB0bHIpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHJldHVybiB7IG5lZWRDbGlwOiAhIWhhc1JhZGl1cywgbmVlZFN0cm9rZTogISFib3JkZXJXaWR0aCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOavj+S4quWtkOexu+mDveS8muacieiHquW3seeahOa4suafk+mAu+i+ke+8jOS9huS7luS7rOmDveacieS6m+mAmueUqOeahOWkhOeQhu+8jOavlOWmgumAj+aYjuW6puOAgeaXi+i9rOWSjGJvcmRlcueahOWkhOeQhu+8jGJhc2VSZW5kZXIg55So5LqO5aSE55CG6YCa55So55qE5riy5p+T6YC76L6RXG4gICAqL1xuICBiYXNlUmVuZGVyKHR5cGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogZHJhd1gsIGFic29sdXRlWTogZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGlmIChzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyO1xuICAgIH1cblxuICAgIGxldCBvcmlnaW5YID0gMDtcbiAgICBsZXQgb3JpZ2luWSA9IDA7XG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcmlnaW5YID0gZHJhd1ggKyBib3gud2lkdGggLyAyO1xuICAgICAgb3JpZ2luWSA9IGRyYXdZICsgYm94LmhlaWdodCAvIDI7XG5cbiAgICAgIGN0eC50cmFuc2xhdGUob3JpZ2luWCwgb3JpZ2luWSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOivt+azqOaEj++8jOi/memHjOaaguaXtuS7heaUr+aMgeayoeacieWtkOiKgueCueeahOWFg+e0oOWPkeeUn+aXi+i9rO+8jOWmguaenOeItuiKgueCueaXi+i9rOS6huWtkOiKgueCueW5tuS4jeS8mui3n+edgOaXi+i9rFxuICAgICAqIOimgeWunueOsOeItuiKgueCueW4puWKqOWtkOiKgueCueaXi+i9rOeahOiDveWKm++8jOmcgOimgeW8leWFpeefqemYteW6k++8jOWvueS7o+eggeaUueWKqOS5n+avlOi+g+Wkp++8jOaaguaXtuS4jeWBmuaUuemAoOOAglxuICAgICAqL1xuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LnJvdGF0ZSh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LnNjYWxlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYIDogMSAsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZIDogMSk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIC8vIGZvciBjbGlwXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUltYWdlT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNyYz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBpbWdzcmM6IHN0cmluZztcbiAgcHVibGljIHR5cGUgPSAnSW1hZ2UnO1xuICBwdWJsaWMgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJSW1hZ2VPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBzcmMgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmltZ3NyYyA9IHNyYztcblxuICAgIHRoaXMuaW1nID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZywgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzcmMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gIH1cblxuICBzZXQgc3JjKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW1nID0gbnVsbDtcblxuICAgIHRoaXMuc3JjID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuaW1nIHx8ICF0aGlzLmltZz8uY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg5byA5aeLXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuXG5leHBvcnQge1xuICBFbGVtZW50LFxuICBWaWV3LFxuICBJbWFnZSxcbiAgVGV4dCxcbiAgU2Nyb2xsVmlldyxcbiAgQml0TWFwVGV4dCxcbiAgQ2FudmFzLFxuICBCdXR0b24sXG59O1xuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY2xhbXAgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIFNjcm9sbEJhckRpcmVjdGlvbiB7XG4gIFZlcnRpdmFsLFxuICBIb3Jpem9udGFsLFxufVxuXG5pbnRlcmZhY2UgSURpbWVuc2lvbnMge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgY29udGVudFdpZHRoOiBudW1iZXI7XG4gIGNvbnRlbnRIZWlnaHQ6IG51bWJlcjtcblxuICBtYXhTY3JvbGxMZWZ0OiBudW1iZXI7XG4gIG1heFNjcm9sbFRvcDogbnVtYmVyO1xuXG4gIHNjcm9sbExlZnQ6IG51bWJlcjtcbiAgc2Nyb2xsVG9wOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJU2Nyb2xsQmFyT3B0aW9ucyB7XG4gIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcbn1cblxuLyoqXG4gKiDmoLnmja7mu5rliqjmnaHnmoTlsLrlr7jjgIFTY3JvbGxWaWV3IOinhuWPo+WSjOa7muWKqOeql+WPo+WwuuWvuOOAgea7muWKqOmYsue6v+S/oeaBr+ehruiupOa7muWKqOadoeeahOagt+W8j+S/oeaBr1xuICovXG5mdW5jdGlvbiB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICBjb25zdCBpc1ZlcnRpY2FsID0gZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWw7XG4gIGNvbnN0IHsgd2lkdGg6IHNjcm9sbFdpZHRoLCBoZWlnaHQ6IHNjcm9sbEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0IH0gPSBkaW1lbnNpb25zO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGlzVmVydGljYWwgPyB3aWR0aCA6IHNjcm9sbFdpZHRoICogKHNjcm9sbFdpZHRoIC8gY29udGVudFdpZHRoKSxcbiAgICBoZWlnaHQ6IGlzVmVydGljYWwgPyBzY3JvbGxIZWlnaHQgKiAoc2Nyb2xsSGVpZ2h0IC8gY29udGVudEhlaWdodCkgOiB3aWR0aCxcbiAgICBsZWZ0OiBpc1ZlcnRpY2FsID8gc2Nyb2xsV2lkdGggLSB3aWR0aCA6IDAsXG4gICAgdG9wOiBpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbEhlaWdodCAtIHdpZHRoLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjaGVja05lZWRIaWRlU2Nyb2xsQmFyKGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICByZXR1cm4gISEoZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxUb3AgPT09IDBcbiAgICB8fCBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5Ib3Jpem9udGFsICYmIGRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdCA9PT0gMCk7XG59XG5cbi8qKlxuICog5rua5Yqo57uE5Lu255qE5rua5Yqo5p2h57uE5Lu277yM5rua5Yqo5p2h5pys6Lqr5Lmf5pivTGF5b3V055qE5LiA5Liq6IqC54K5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbEJhciBleHRlbmRzIFZpZXcge1xuICAvLyDlvZPliY3mu5rliqjmnaHmmK/lsZ7kuo7mqKrlkJHov5jmmK/nurXlkJFcbiAgcHVibGljIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuXG4gIHB1YmxpYyBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcblxuICAvLyDmu5rliqjlrozmr5XlkI7kuIDmrrXml7bpl7TlkI7oh6rliqjpmpDol49cbiAgcHVibGljIGF1dG9IaWRlID0gdHJ1ZTtcblxuICAvLyDmu5rliqjlrozmr5XlkI7oh6rliqjpmpDol4/ml7bpl7RcbiAgcHVibGljIGF1dG9IaWRlVGltZSA9IDIwMDA7XG5cbiAgcHVibGljIGF1dG9IaWRlRGVsYXlUaW1lID0gMTUwMDtcblxuICBwcml2YXRlIGF1dG9IaWRlUmVtYWluaW5nVGltZSA9IDA7XG5cbiAgcHJpdmF0ZSBpbm5lcldpZHRoID0gMTA7XG5cbiAgcHJpdmF0ZSBpc0hpZGUgPSBmYWxzZTtcblxuICBwcml2YXRlIGN1cnJMZWZ0ID0gMDtcbiAgcHJpdmF0ZSBjdXJyVG9wID0gMDtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgZGlyZWN0aW9uLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMTYyLCAxNjIsIDE2MiwgMC43KScsXG4gICAgd2lkdGggPSAxMCxcbiAgfTogSVNjcm9sbEJhck9wdGlvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3JkZXJSYWRpdXM6IHdpZHRoIC8gMixcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgfSwgdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh3aWR0aCwgZGlyZWN0aW9uLCBkaW1lbnNpb25zKSk7XG5cbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgdGhpcy5pbm5lcldpZHRoID0gd2lkdGg7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcihkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmu5rliqjmnaHnmoTnspfnu4bvvIzlm6DkuLropoHlhbzlrrnmqKrnq5bmu5rliqjvvIzmiYDku6Ugc3R5bGUud2lkdGgg5Zyo5LiN5ZCM5qih5byP5LiL5Luj6KGo55qE5oSP5oCd5LiN5LiA5qC3XG4gICAqIOWboOatpOmAmui/h+WNleeLrOeahCB3aWR0aCDlsZ7mgKfmnaXku6Pooajmu5rliqjmnaHnmoTnspfnu4ZcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyV2lkdGgpIHtcbiAgICAgIHRoaXMuaW5uZXJXaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gdGhpcy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLnNldERpbWVuc2lvbnModGhpcy5kaW1lbnNpb25zKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF06IHBsZWFzZSBzZXQgcm9vdCBmb3Igc2Nyb2xsYmFyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlLCB0cnVlKTtcblxuICAgICAgdGhpcy5yb290Lm9uKCdiZWZvcmVfcmVmbG93JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUodGhpcy5jdXJyTGVmdCwgdGhpcy5jdXJyVG9wKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmlzSGlkZSA9IHRydWU7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5pc0hpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIOagueaNriBTY3JvbGxWaWV3IOWuueWZqOWuvemrmOWSjOWunumZheWGheWuueWuvemrmOWGs+Wumua7muWKqOadoeeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgKiDkvYbmoLjlv4PpnIDopoHogIPomZHnmoTmg4XlhrXmmK/vvJpcbiAgICogMS4g5Zyo5LiN5pat5ZywIHJlZmxvdyDov4fnqIvkuK3vvIxTY3JvbGxCYXIg5Lmf5Lya5a2Y5Zyo6ZyA6KaB5YiH5o2i5bGV56S65ZKM6ZqQ6JeP55qE5oOF5Ya1XG4gICAqIDIuIHJlZmxvdyDkuYvlkI7vvIxTY3JvbGxCYXIg55qE5L2N572u5LiN5piv566A5Y2V55qE6K6+572u5Li6IFNjcm9sbFZpZXcg6aG26YOo5ZKM5bem6L6577yM6L+Y5Y+v6IO95piv5rua5Yqo5LqG5LiA5q616Led56a75ZCO5omn6KGM55qEIHJlZmxvd1xuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh0aGlzLndpZHRoLCB0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucyk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHN0eWxlKTtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKHRoaXMuZGlyZWN0aW9uLCBkaW1lbnNpb25zKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSGlkZSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcblxuICAgIC8vIOW3sue7j+a7muWKqOi/h+S4gOautei3neemu+eahOaDheWGte+8jOmHjeaWsOiuoeeul+aWsOeahOa7muWKqOS9jee9rlxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUoZGltZW5zaW9ucy5zY3JvbGxMZWZ0LCBkaW1lbnNpb25zLnNjcm9sbFRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZSArIHRoaXMuYXV0b0hpZGVEZWxheVRpbWU7XG4gIH1cblxuICBjYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIGNvbnN0IGNhblNjcm9sbFBlcmNlbnQgPSAxIC0gdGhpcy5kaW1lbnNpb25zLmhlaWdodCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50SGVpZ2h0O1xuXG4gICAgICAvLyDmu5rliqjmnaHmnIDlpKfmu5rliqjpq5jluqZcbiAgICAgIGNvbnN0IHNjcm9sbEJhck1heFNjcm9sbFRvcCA9IHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgKiBjYW5TY3JvbGxQZXJjZW50O1xuXG4gICAgICBjb25zdCBwZXJjZW50ID0gdG9wIC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbFRvcDtcbiAgICAgIGNvbnN0IHBlcmNlbnRUb3AgPSBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgKiBwZXJjZW50O1xuXG4gICAgICBzY3JvbGxUb3AgPSBjbGFtcChwZXJjZW50VG9wLCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxUb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy53aWR0aCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50V2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ID0gdGhpcy5kaW1lbnNpb25zLndpZHRoICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IGxlZnQgLyB0aGlzLmRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdDtcblxuICAgICAgc2Nyb2xsTGVmdCA9IGNsYW1wKHNjcm9sbEJhck1heFNjcm9sbExlZnQgKiBwZXJjZW50LCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfTtcbiAgfVxuXG4gIG9uU2Nyb2xsKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJMZWZ0ID0gbGVmdDtcbiAgICB0aGlzLmN1cnJUb3AgPSB0b3A7XG4gIFxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUobGVmdCwgdG9wKTtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVkgPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZICsgc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVggPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYICsgc2Nyb2xsTGVmdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xuICAgICAgLy8gdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZTtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUsIHRydWUpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZSA9IChkdDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKCF0aGlzLmF1dG9IaWRlIHx8IHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IDAgfHwgdGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAtPSBkdDtcblxuICAgIGlmICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSB0aGlzLmF1dG9IaWRlVGltZSkge1xuICAgICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSBNYXRoLm1heCgwLCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSk7XG4gICAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyICogKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC8gdGhpcy5hdXRvSGlkZVRpbWUpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY29weVRvdWNoQXJyYXkgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgU2Nyb2xsZXIgZnJvbSAnLi4vbGlicy9zY3JvbGxlci9pbmRleC5qcydcbmltcG9ydCB7IGl0ZXJhdGVUcmVlIH0gZnJvbSAnLi4vY29tbW9uL3ZkJztcbmltcG9ydCBFbGVtZW50LCB7IHNldERpcnR5IH0gZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBTY3JvbGxCYXIsIHsgU2Nyb2xsQmFyRGlyZWN0aW9uIH0gZnJvbSAnLi9zY3JvbGxiYXInO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IGRwciA9IGVudi5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBJSW5uZXJTY3JvbGxlck9wdGlvbiB7XG4gIHNjcm9sbGluZ1g/OiBib29sZWFuO1xuICBzY3JvbGxpbmdZPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgcHVibGljIHNjcm9sbFRvcCA9IDA7XG4gIHB1YmxpYyBzY3JvbGxMZWZ0ID0gMDtcbiAgcHVibGljIGhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICBwdWJsaWMgY3VycmVudEV2ZW50ID0gbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnU2Nyb2xsVmlldyc7XG5cbiAgcHJpdmF0ZSBzY3JvbGxZUHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbm5lclNjcm9sbGVyT3B0aW9uOiBJSW5uZXJTY3JvbGxlck9wdGlvbjtcblxuICBwcml2YXRlIHNjcm9sbGVyT2JqPzogU2Nyb2xsZXI7XG4gIHByaXZhdGUgaXNGaXJzdFNjcm9sbD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB2ZXJ0aXZhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaG9yaXpvbnRhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgc2Nyb2xsWCxcbiAgICBzY3JvbGxZLFxuICAgIGRhdGFzZXQsXG4gIH06IElTY3JvbGxWaWV3T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWROYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGl0ZW06IEVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgaXRlbS5sYXlvdXRCb3gudG9wICsgaXRlbS5sYXlvdXRCb3guaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWF4SGVpZ2h0O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhXaWR0aCA9IE1hdGgubWF4KG1heFdpZHRoLCBpdGVtLmxheW91dEJveC5sZWZ0ICsgaXRlbS5sYXlvdXRCb3gud2lkdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1heFdpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbygwLCB0aGlzLnNjcm9sbFRvcCwgdHJ1ZSwgMSk7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6IHZhbHVlLFxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gIH1cblxuICBnZXQgc2Nyb2xsWSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1k7XG4gIH1cblxuICBzZXQgc2Nyb2xsWSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5zY3JvbGxZKSB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyh0aGlzLnNjcm9sbExlZnQsIDAsIHRydWUsIDEpO1xuICAgICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNjcm9sbGVyT2JqICYmIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgaWYgKCEodHJlZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgIHRyZWUucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5yZWN0KHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBhYnNvbHV0ZVgsIGFic29sdXRlWSB9ID0gY2hpbGQubGF5b3V0Qm94O1xuXG4gICAgICAvLyDliKTmlq3lpITkuo7lj6/op4bnqpflj6PlhoXnmoTlrZDoioLngrnvvIzpgJLlvZLmuLLmn5Por6XlrZDoioLngrlcbiAgICAgIGlmIChhYnNvbHV0ZVkgKyBoZWlnaHQgPj0gc3RhcnRZICYmIGFic29sdXRlWSA8PSBlbmRZXG4gICAgICAgICYmIGFic29sdXRlWCArIHdpZHRoID49IHN0YXJ0WCAmJiBhYnNvbHV0ZVggPD0gZW5kWCkge1xuICAgICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIOS4iumdoueahOa4suafk+W6lOivpeWFiOi3s+i/h+a7muWKqOadoe+8jOWQpuWImeWPr+iDveWHuueOsOa4suafk+mhuuW6j+mXrumimO+8jFNjcm9sbFZpZXfnmoToioLngrnlj43ogIzmiormu5rliqjmnaHnm5bkvY/kuoZcbiAgICB0aGlzLnZlcnRpdmFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcbiAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/LnJlbmRlcigpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgIShlbGUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5b2T5omn6KGMcmVmbG935LmL5ZCO77yM5rua5Yqo5YiX6KGo55qE6auY5bqm5Y+v6IO95Y+R55Sf5LqG5Y+Y5YyW77yM5rua5Yqo5p2h5Lmf6ZyA6KaB5ZCM5q2l6L+b6KGM5pu05pawXG4gICAqL1xuICB1cGRhdGVTY3JvbGxCYXIoc2Nyb2xsUHJvcDogc3RyaW5nLCBzY3JvbGxCYXJOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICBjb250ZW50V2lkdGg6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoLFxuICAgICAgY29udGVudEhlaWdodDogdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0LFxuICAgICAgbWF4U2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgbWF4U2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX21heFNjcm9sbFRvcCxcblxuICAgICAgc2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbFRvcCxcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlU2Nyb2xsQmFyJywgSlNPTi5zdHJpbmdpZnkoZGltZW5zaW9ucykpXG5cbiAgICAvLyDpnZ7nrKzkuIDmrKHliJvlu7rnmoTmg4XlhrXvvIzkuIDoiKzmmK8gcmVmbG93IOaJp+ihjOWIsOi/memHjFxuICAgIGlmICh0aGlzW3Njcm9sbFByb3AgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddLnNldERpbWVuc2lvbnMoZGltZW5zaW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFyKHtcbiAgICAgICAgICBkaW1lbnNpb25zLFxuICAgICAgICAgIGRpcmVjdGlvbjogc2Nyb2xsUHJvcCA9PT0gJ3Njcm9sbFknID8gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsIDogU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuYXBwZW5kQ2hpbGQoc2Nyb2xsYmFyKTtcbiAgICAgICAgc2Nyb2xsQmFyLnJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHNjcm9sbEJhci5pbml0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2Nyb2xsQmFyLmluc2VydCh0aGlzLnJvb3QucmVuZGVyQ29udGV4dCwgdHJ1ZSk7XG4gICAgICAgIHNjcm9sbEJhci5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuICAgICAgICB0aGlzLmFkZChzY3JvbGxCYXIpO1xuXG4gICAgICAgIHNldERpcnR5KHNjcm9sbEJhciwgJ2FwcGVuZFRvU2Nyb2xsVmlldycpXG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdID0gc2Nyb2xsQmFyO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXT8ub25TY3JvbGwodGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LCB0aGlzLnNjcm9sbGVyT2JqIS5fX3NjaGVkdWxlZFRvcCk7XG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPkuI3lho3pnIDopoHnurXlkJHmu5rliqjnmoTml7blgJnplIDmr4HnurXlkJHmu5rliqjmnaFcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddO1xuICAgICAgICBzY3JvbGxCYXIucmVtb3ZlKCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95KCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95U2VsZigpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDoh6rliqjlvIDlkK8gc2Nyb2xsWWApO1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6L+Z6YeM5LmL5omA5Lul6KaB5bu26L+f5LiA5bin5piv5Zug5Li66L+Z6YeM55qE5Y+Y5Yqo5p2l6IeqIHJlZmxvdyDkuYvlkI7vvIzmraPlnKjlgZogcmVmbG93IOS5i+WQjueahOWQjue7reS6i+aDhVxuICAgICAgICAgKiDlpoLmnpznq4vljbPkv67mlLnmu5rliqjmnaHnmoTmoLflvI/vvIzlrp7pmYXkuIrlubbkuI3kvJrnlJ/mlYjjgIJcbiAgICAgICAgICovXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxvdyDkuYvlkI7vvIzkvJrku44gY3NzbGF5b3V0IOWQjOatpeW4g+WxgOS/oeaBr++8jOWOn+WFiOeahOa7muWKqOS/oeaBr+S8muS4ouWkse+8jOi/memHjOmcgOimgeS4gOS4quWkjeS9jeeahOaTjeS9nFxuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRoaXMuc2Nyb2xsVG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gdHJ1ZTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnModGhpcy5sYXlvdXRCb3gud2lkdGgsIHRoaXMubGF5b3V0Qm94LmhlaWdodCwgdGhpcy5zY3JvbGxXaWR0aCwgdGhpcy5zY3JvbGxIZWlnaHQpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG4gICdvcGFjaXR5JyxcbiAgJ3RyYW5zZm9ybScsXG4gICd0ZXh0U3Ryb2tlQ29sb3InLFxuICAndGV4dFN0cm9rZVdpZHRoJyxcbiAgJ3RleHRTaGFkb3cnLFxuXTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckFmZmVjdFN0eWxlcyA9IFtcbiAgJ3RleHRTaGFkb3cnLFxuICAndHJhbnNmb3JtJyxcbiAgJ2JhY2tncm91bmRJbWFnZScsXG5dXG5cbmludGVyZmFjZSBJU3R5bGUge1xuICAvLyByZWZsb3dBZmZlY3RlZFN0eWxlc1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgbWluSGVpZ2h0PzogbnVtYmVyO1xuICBtYXhXaWR0aD86IG51bWJlcjtcbiAgbWF4SGVpZ2h0PzogbnVtYmVyO1xuICBsZWZ0PzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgdG9wPzogbnVtYmVyO1xuICBib3R0b20/OiBudW1iZXI7XG4gIG1hcmdpbj86IG51bWJlcjtcbiAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gIG1hcmdpblRvcD86IG51bWJlcjtcbiAgbWFyZ2luQm90dG9tPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nQm90dG9tPzogbnVtYmVyO1xuICBib3JkZXJXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyTGVmdFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJSaWdodFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJUb3BXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tV2lkdGg/OiBudW1iZXI7XG5cbiAgYm9yZGVyVG9wTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuXG4gIGZsZXhEaXJlY3Rpb24/OiAnY29sdW1uJyB8ICdyb3cnO1xuICBmbGV4U2hyaW5rPzogbnVtYmVyO1xuICBmbGV4R3Jvdz86IG51bWJlcjtcbiAgZmxleFdyYXA/OiAnd3JhcCcgfCAnbm93cmFwJztcbiAganVzdGlmeUNvbnRlbnQ/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3BhY2UtYmV0d2VlbicgfCAnc3BhY2UtYXJvdW5kJztcbiAgYWxpZ25JdGVtcz86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgYWxpZ25TZWxmPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBwb3NpdGlvbj86IHN0cmluZztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcblxuICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG5cbiAgLy8g5paH5a2X5o+P6L6555qE5a695bqm77yM6buY6K6k5LiN5o+P6L65XG4gIHRleHRTdHJva2VXaWR0aD86IG51bWJlcjtcbiAgLy8g5paH5a2X5o+P6L6555qE6aKc6Imy77yM5aaC5p6c5oyH5a6a5LqG5o+P6L656aKc6Imy5L2G5piv5rKh5pyJ5oyH5a6a5o+P6L655a695bqm77yM5o+P6L655a695bqm6buY6K6k6K6+572u5Li6MVxuICB0ZXh0U3Ryb2tlQ29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOaWh+Wtl+mYtOW9seaViOaenO+8jHRleHRTaGFkb3fnmoTmoLzlvI/lubbkuI3mmK/kuKXmoLznmoRDU1PmoLzlvI/vvIzku4XmlK/mjIHkuKTnp43moLzlvI9cbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcGlua1xuICAgKiB0ZXh0U2hhZG93OiAxcHggMXB4IDJweCByZWQsIDAgMCAxcHggYmx1ZSwgMCAwIDFweCBibHVlLCAxcHggMXB4IDJweCByZWRcbiAgICog5Lmf5bCx5piv5pSv5oyB5Lu75oSP5pWw6YeP55qE6Zi05b2x5pWI5p6c77yM5q+P5Liq6Zi05b2x5pWI5p6c55Sx5Zub5Liq5YC85oyH5a6a77yM5YiG5Yir5pivIHNoYWRvd09mZnNldFgsIHNoYWRvd09mZnNldFksIHNoYWRvd0JsdXIsIHNoYWRvd0NvbG9yXG4gICAqL1xuICB0ZXh0U2hhZG93Pzogc3RyaW5nO1xuXG4gICc6YWN0aXZlJz86IElTdHlsZTtcbn1cblxuZXhwb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgSVN0eWxlIH07XG4iLCJcbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlczogbnVtYmVyKSB7XG4gIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcbn1cblxuLy8g6IOM5pmv5Zu+5q2j5YiZ6KGo6L6+5byPXG5jb25zdCBpc1ZhbGlkVXJsUHJvcFJlZyA9IC9cXHMqdXJsXFwoKC4qPylcXClcXHMqLztcblxuLy8g6Kej5p6Q6IOM5pmv5Zu+54mHXG5leHBvcnQgZnVuY3Rpb24gYmFja2dyb3VuZEltYWdlUGFyc2VyKHZhbDogc3RyaW5nKSB7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGxpc3QgPSB2YWwubWF0Y2goaXNWYWxpZFVybFByb3BSZWcpO1xuXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGNvbnN0IHVybCA9IGxpc3RbMV0ucmVwbGFjZSgvKCd8XCIpL2csICcnKTtcblxuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XTogJHt2YWx9IGlzIG5vdCBhIHZhbGlkIGJhY2tncm91bmRJbWFnZWApO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCB0ZXh0U2hhZG93UmVnID0gL14oXFxkK3B4XFxzKXsyfVxcZCtweFxccyg/OlthLXpBLVpdK3wjWzAtOWEtZkEtRl17Myw2fSkoLFxccyooXFxkK3B4XFxzKXsyfVxcZCtweFxccyg/OlthLXpBLVpdK3wjWzAtOWEtZkEtRl17Myw2fSkpKiQvO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICByZXR1cm4gdGV4dFNoYWRvd1JlZy50ZXN0KHRleHRTaGFkb3cpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAvLyDkvb/nlKjmraPliJnooajovr7lvI/pqozor4HmlbDlrZfmiJbpgJflj7fliIbpmpTnmoTmlbDlrZfvvIzlkI7pnaLlj6/ku6Xot5/lj6/pgInnmoTop5LluqbljZXkvY3vvIhkZWfvvIlcbiAgcmV0dXJuIC9eKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KCxcXHMqKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KSokLy50ZXN0KHZhbHVlKTtcbiAgLy8gcmV0dXJuIC9eKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KCxcXHMqKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KSooLFxccyoodHJ1ZXxmYWxzZSkpPyQvLnRlc3QodmFsdWUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZW5kZXJGb3JMYXlvdXQge1xuICByb3RhdGU/OiBudW1iZXI7IC8vIHN0eWxlLnRyYW5zZm9ybSByb3RhdGXop6PmnpDkuYvlkI7lvpfliLDnmoTlvKfluqbliLZcbiAgc2NhbGVYPzogbnVtYmVyOyAvLyBzdHlsZS50cmFuc2Zvcm0g6Kej5p6Q5LmL5ZCO5b6X5Yiw55qE5qiq5ZCR57yp5pS+5YC8XG4gIHNjYWxlWT86IG51bWJlcjsgLy8gc3R5bGUudHJhbnNmb3JtIOino+aekOS5i+WQjuW+l+WIsOeahOe6teWQkee8qeaUvuWAvFxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBIVE1MSW1hZ2VFbGVtZW50OyAvLyBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Ug6Kej5p6Q5bm25Yqg6L295LmL5ZCO5b6X5Yiw55qE5Zu+54mH5a6e5L6LXG59XG5cbmludGVyZmFjZSBJVGV4dFNoYWRvdyB7XG4gIG9mZnNldFg6IG51bWJlcjtcbiAgb2Zmc2V0WTogbnVtYmVyO1xuICBibHVyUmFkaXVzOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRleHRSZW5kZXJGb3JMYXlvdXQgZXh0ZW5kcyBJUmVuZGVyRm9yTGF5b3V0IHtcbiAgdGV4dFNoYWRvd3M/OiBudWxsIHwgSVRleHRTaGFkb3dbXTtcbn1cblxuY29uc3QgdHJhbnNmb3JtUmVnZXggPSAvKFxcdyspXFwoKFteKV0rKVxcKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdDogSVJlbmRlckZvckxheW91dCA9IHt9O1xuXG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdHJhbnNmb3JtUmVnZXguZXhlYyh0cmFuc2Zvcm0pKSkge1xuICAgIGNvbnN0IFssIG5hbWUsIHZhbHVlXSA9IG1hdGNoO1xuXG4gICAgaWYgKCFpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFtMYXlvdXRdOiBpbnZhbGlkIHZhbHVlIGZvciAke25hbWV9OiAke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgodmFsKSA9PiB2YWwudHJpbSgpLnJlcGxhY2UoJ2RlZycsICcnKSlcbiAgICAgIC5tYXAoTnVtYmVyKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgcmVzdWx0LnJvdGF0ZSA9IGRlZ3JlZXNUb1JhZGlhbnModmFsdWVzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzY2FsZSc6XG4gICAgICAgIHJlc3VsdC5zY2FsZVggPSB2YWx1ZXNbMF07XG4gICAgICAgIHJlc3VsdC5zY2FsZVkgPSB2YWx1ZXNbMV0gfHwgdmFsdWVzWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCwgeyBTdHlsZU9wVHlwZSwgc2V0RGlydHkgfSBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2VudidcbmltcG9ydCB7IGlzVmFsaWRUZXh0U2hhZG93LCBJVGV4dFJlbmRlckZvckxheW91dCB9IGZyb20gJy4vc3R5bGVQYXJzZXInO1xuXG5jb25zdCBERUZBVUxUX0ZPTlRfRkFNSUxZID0gJ3NhbnMtc2VyaWYnO1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuXG5jb25zdCBnZXRDb250ZXh0ID0gKCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9PiB7XG4gIGlmIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBjb25zdCBjYW52YXMgPSBlbnYuY3JlYXRlQ2FudmFzKCk7XG4gIGNhbnZhcy53aWR0aCA9IDE7XG4gIGNhbnZhcy5oZWlnaHQgPSAxO1xuICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoKHN0eWxlOiBJU3R5bGUsIHZhbHVlOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoKTtcblxuICBjb250ZXh0LmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICdub3JtYWwnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7c3R5bGUuZm9udEZhbWlseSB8fCBERUZBVUxUX0ZPTlRfRkFNSUxZfWA7XG5cbiAgcmV0dXJuIGNvbnRleHQubWVhc3VyZVRleHQodmFsdWUpLndpZHRoIHx8IDA7XG59XG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KHZhbHVlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGdldENvbnRleHQoKS5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUZXh0KHN0eWxlOiBJU3R5bGUsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG5cbiAgbGV0IG1heFdpZHRoID0gc3R5bGUud2lkdGggYXMgbnVtYmVyO1xuICBjb25zdCB3b3JkV2lkdGggPSBnZXRUZXh0V2lkdGgoc3R5bGUsIHZhbHVlKTtcblxuICAvLyDlr7nmloflrZfmuqLlh7rnmoTlpITnkIbvvIzpu5jorqTnlKguLi5cbiAgY29uc3QgdGV4dE92ZXJmbG93ID0gc3R5bGUudGV4dE92ZXJmbG93IHx8ICdlbGxpcHNpcyc7XG5cbiAgLy8g5paH5a2X5pyA5aSn6ZW/5bqm5LiN6LaF6ZmQ5Yi2XG4gIGlmICh3b3JkV2lkdGggPD0gbWF4V2lkdGgpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvLyDlr7nkuo7nlKjngrnngrnngrnlpITnkIbnmoTmg4XlhrXvvIzlhYjlsIbmnIDlpKflrr3luqblh4/ljrsuLi7nmoTlrr3luqZcbiAgaWYgKHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgIG1heFdpZHRoIC09IGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KCcuLi4nKTtcbiAgfVxuXG4gIGxldCBsZW5ndGggPSB2YWx1ZS5sZW5ndGggLSAxO1xuICBsZXQgc3RyID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG5cbiAgd2hpbGUgKGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KHN0cikgPiBtYXhXaWR0aCAmJiBsZW5ndGggPiAwKSB7XG4gICAgbGVuZ3RoIC09IDE7XG4gICAgc3RyID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gKGxlbmd0aCAmJiB0ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcydcbiAgICA/IGAke3N0cn0uLi5gXG4gICAgOiBzdHIpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElUZXh0UHJvcHMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIHZhbHVlc3JjID0gJyc7XG4gIHByaXZhdGUgb3JpZ2luU3R5bGVXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZSA9ICdib3R0b20nO1xuICBwdWJsaWMgZm9udCA9ICcnO1xuICBwdWJsaWMgdGV4dEFsaWduOiBDYW52YXNUZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHB1YmxpYyBmaWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvckxheW91dDogSVRleHRSZW5kZXJGb3JMYXlvdXQgPSB7fTtcbiAgXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHZhbHVlID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSVRleHRQcm9wcykge1xuICAgIGxldCBvcmlnaW5TdHlsZVdpZHRoID0gc3R5bGUud2lkdGg7XG4gICAgLy8g5rKh5pyJ6K6+572u5a695bqm55qE5pe25YCZ6YCa6L+HY2FudmFz6K6h566X5Ye65paH5a2X5a695bqmXG4gICAgaWYgKG9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgoc3R5bGUsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgdmFsdWUgPSBwYXJzZVRleHQoc3R5bGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyIHx8IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIH1cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVGV4dCc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcbiAgICB0aGlzLm9yaWdpblN0eWxlV2lkdGggPSBvcmlnaW5TdHlsZVdpZHRoO1xuXG4gICAgaWYgKHN0eWxlLnRleHRTaGFkb3cpIHtcbiAgICAgIHRoaXMucGFyc2VUZXh0U2hhZG93KHN0eWxlLnRleHRTaGFkb3cpO1xuICAgIH1cbiAgfVxuXG4gIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHN0eWxlT3BUeXBlOiBTdHlsZU9wVHlwZSwgdmFsPzogYW55KSB7XG4gICAgaWYgKHByb3AgPT09ICd0ZXh0U2hhZG93Jykge1xuICAgICAgaWYgKHN0eWxlT3BUeXBlID09PSBTdHlsZU9wVHlwZS5TZXQpIHtcbiAgICAgICAgdGhpcy5wYXJzZVRleHRTaGFkb3codmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0LnRleHRTaGFkb3dzID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGV4dFNoYWRvdyh0ZXh0U2hhZG93OiBzdHJpbmcpIHtcbiAgICBpZiAoIWlzVmFsaWRUZXh0U2hhZG93KHRleHRTaGFkb3cpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XTogJHt0ZXh0U2hhZG93fSBpcyBub3QgYSB2YWxpZCB0ZXh0U2hhZG93YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOino+aekCB0ZXh0LXNoYWRvdyDlrZfnrKbkuLJcbiAgICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0LnRleHRTaGFkb3dzID0gdGV4dFNoYWRvdy5zcGxpdCgnLCcpLm1hcChzaGFkb3cgPT4ge1xuICAgICAgICBjb25zdCBwYXJ0cyA9IHNoYWRvdy50cmltKCkuc3BsaXQoL1xccysvKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IHBhcnNlRmxvYXQocGFydHNbMF0pO1xuICAgICAgICBjb25zdCBvZmZzZXRZID0gcGFyc2VGbG9hdChwYXJ0c1sxXSk7XG4gICAgICAgIGNvbnN0IGJsdXJSYWRpdXMgPSBwYXJzZUZsb2F0KHBhcnRzWzJdKTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBwYXJ0c1szXTtcblxuICAgICAgICByZXR1cm4geyBvZmZzZXRYLCBvZmZzZXRZLCBibHVyUmFkaXVzLCBjb2xvciB9O1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICBpZiAodGhpcy5vcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gcGFyc2VUZXh0KHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICBzZXREaXJ0eSh0aGlzLCAndmFsdWUgY2hhbmdlJyk7XG4gICAgfVxuICB9XG5cbiAgdG9DYW52YXNEYXRhKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcblxuICAgIHRoaXMuZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICB0aGlzLnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIHRoaXMuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJyd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcbiAgICB0aGlzLnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbiB8fCAnbGVmdCc7XG4gICAgdGhpcy5maWxsU3R5bGUgPSBzdHlsZS5jb2xvciB8fCAnIzAwMCc7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAgIC8vIHRoaXMudG9DYW52YXNEYXRhKCk7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgdGhpcy50b0NhbnZhc0RhdGEoKTtcblxuICAgIGxldCB7IG5lZWRTdHJva2UsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCd0ZXN0Jyk7XG4gICAgY3R4LnRleHRCYXNlbGluZSA9IHRoaXMudGV4dEJhc2VsaW5lO1xuICAgIGN0eC5mb250ID0gdGhpcy5mb250O1xuICAgIGN0eC50ZXh0QWxpZ24gPSB0aGlzLnRleHRBbGlnbjtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuXG4gICAgaWYgKHRoaXMudGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgZHJhd1ggKz0gd2lkdGggLyAyO1xuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgIGRyYXdYICs9IHdpZHRoO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5saW5lSGVpZ2h0KSB7XG4gICAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgICBkcmF3WSArPSAoc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIpIC8gMjtcbiAgICB9XG5cbiAgICAvLyDnurnnkIbmloflrZfmj4/ovrlcbiAgICBpZiAoc3R5bGUudGV4dFN0cm9rZUNvbG9yKSB7XG4gICAgICBjdHgubGluZVdpZHRoID0gc3R5bGUudGV4dFN0cm9rZVdpZHRoIHx8IDE7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS50ZXh0U3Ryb2tlQ29sb3IgYXMgc3RyaW5nO1xuXG4gICAgICBjdHguc3Ryb2tlVGV4dChcbiAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgZHJhd1ggLSBvcmlnaW5YLFxuICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIOWkhOeQhuaWh+Wtl+mYtOW9sVxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cykge1xuICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQudGV4dFNoYWRvd3MuZm9yRWFjaCgoeyBvZmZzZXRYLCBvZmZzZXRZLCBibHVyUmFkaXVzLCBjb2xvciB9KSA9PiB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gb2Zmc2V0WDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBvZmZzZXRZO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IGJsdXJSYWRpdXM7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IGNvbG9yO1xuICAgICAgICBjdHguZmlsbFRleHQoXG4gICAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5maWxsVGV4dChcbiAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgZHJhd1ggLSBvcmlnaW5YLFxuICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICApOyAgXG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJRWxlbWVudE9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVmlldyc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZIH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pZiAodHlwZW9mIEdhbWVHbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gIEdhbWVHbG9iYWwuX19lbnYgPSBHYW1lR2xvYmFsLnd4IHx8IEdhbWVHbG9iYWwudHQgfHwgR2FtZUdsb2JhbC5zd2FuO1xufVxuXG5jb25zdCBkb21FdmVudE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgdG91Y2hzdGFydDogJ21vdXNlZG93bicsXG4gIHRvdWNobW92ZTogJ21vdXNlbW92ZScsXG4gIHRvdWNoZW5kOiAnbW91c2V1cCcsXG4gIHRvdWNoY2FuY2VsOiAnbW91c2VsZWF2ZScsXG59XG5cbmVudW0gZXZlbnRUeXBlIHtcbiAgb24gPSAnb24nLFxuICBvZmYgPSAnb2ZmJyxcbn1cblxuZnVuY3Rpb24gZ2VuRG9tVG91Y2hFdmVudChldmVudDogc3RyaW5nLCB0eXBlOiBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpc3RlbmVyOiBDYWxsYmFjaykge1xuICAgICAgdHlwZSA9PT0gZXZlbnRUeXBlLm9uID9cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxuICAgICAgICA6IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0T25Ub3VjaEhhbmRsZXIoZXZlbnQ6IHN0cmluZywgdHlwZTogZXZlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gR2FtZUdsb2JhbC5fX2VudltgJHt0eXBlfSR7ZXZlbnR9YF1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2VuRG9tVG91Y2hFdmVudChkb21FdmVudE1hcFtldmVudC50b0xvd2VyQ2FzZSgpXSwgdHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBMYXlvdXQg5Y+v6IO955So5Zyo5LiN55So55qE5bmz5Y+w77yM6ICMTGF5b3V05Lya5L6d6LWW5bmz5Y+w5LiL6Z2i55qE5LiA5Lqb5pa55rOV5p2l5a6e546w5YW35L2T55qE5Yqf6IO977yM5q+U5aaC5Yib5bu65Zu+54mHXG4gKiDkuLrkuobmm7Tlpb3lgZrlubPlj7DpgILphY3vvIznu5/kuIDlsIHoo4UgZW52IOaooeWdl++8jOS4jeWQjOW5s+WPsOimgeWBmumAgumFje+8jOabv+aNoiBlbnYg55qE5YW35L2T5pa55rOV5Y2z5Y+vXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8g55uR5ZCs6Kem5pG455u45YWz5LqL5Lu2XG4gIG9uVG91Y2hTdGFydDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoU3RhcnQnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoTW92ZTogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoTW92ZScsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hFbmQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaEVuZCcsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hDYW5jZWw6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaENhbmNlbCcsIGV2ZW50VHlwZS5vbiksXG4gIC8vIOWPlua2iOebkeWQrOinpuaRuOebuOWFs+S6i+S7tlxuICBvZmZUb3VjaFN0YXJ0OiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hTdGFydCcsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaE1vdmU6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaE1vdmUnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hFbmQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaEVuZCcsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaENhbmNlbDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoQ2FuY2VsJywgZXZlbnRUeXBlLm9mZiksXG5cbiAgLy8gTGF5b3V0IOaUr+aMgeeZvuWIhuavlOagt+W8j++8jOWmguaenOagueiKgueCueagt+W8j+iuvue9ruS4uiAxMDAl77yM55u05o6l5Y+WIENhbnZhcyDnmoTlsLrlr7jvvIzkuI3lkIzlubPlj7DnmoTlj5bms5XkuI3kuIDmoLfvvIzlm6DmraTljZXni6zmj5Dkvpvlh73mlbBcbiAgZ2V0Um9vdENhbnZhc1NpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcgJiYgX19lbnYuZ2V0U2hhcmVkQ2FudmFzKSB7XG4gICAgICBjb25zdCBjdnMgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBjdnMud2lkdGgsXG4gICAgICAgIGhlaWdodDogY3ZzLmhlaWdodCxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IDMwMCxcbiAgICAgICAgaGVpZ2h0OiAxNTAsXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIOWPluW9k+WJjeiuvuWkh+eahCBkZXZpY2VQaXhlbFJhdGlv77yM5LiN5ZCM5bmz5Y+w55qE5Y+W5rOV5LiN5LiA5qC3XG4gIGdldERldmljZVBpeGVsUmF0aW8oKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcgJiYgX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMpIHtcbiAgICAgIHJldHVybiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYygpLmRldmljZVBpeGVsUmF0aW87XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH0sXG5cbiAgLy8g5Yib5bu6Q2FudmFzXG4gIGNyZWF0ZUNhbnZhcygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9fZW52LmNyZWF0ZUNhbnZhcygpO1xuICAgIH1cblxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgfSxcblxuICAvLyDliJvlu7rlm77niYdcbiAgY3JlYXRlSW1hZ2UoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBfX2Vudi5jcmVhdGVJbWFnZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBjb252ZXJ0VG9Kc29uID0gZnVuY3Rpb24obm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBqT2JqID0ge1xuICAgIG5hbWU6IG5vZGUudGFnbmFtZVxuICB9O1xuXG4gIC8vd2hlbiBubyBjaGlsZCBub2RlIG9yIGF0dHIgaXMgcHJlc2VudFxuICBpZiAoKCFub2RlLmNoaWxkIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmNoaWxkKSkgJiYgKCFub2RlLmF0dHJzTWFwIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmF0dHJzTWFwKSkpIHtcbiAgICByZXR1cm4gdXRpbC5pc0V4aXN0KG5vZGUudmFsKSAmJiAhIW5vZGUudmFsID8gbm9kZS52YWwgOiBqT2JqO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlIGNyZWF0ZSBhIHRleHRub2RlIGlmIG5vZGUgaGFzIHNvbWUgdGV4dFxuICAgIGlmICh1dGlsLmlzRXhpc3Qobm9kZS52YWwpKSB7XG4gICAgICBpZiAoISh0eXBlb2Ygbm9kZS52YWwgPT09ICdzdHJpbmcnICYmIChub2RlLnZhbCA9PT0gJycgfHwgbm9kZS52YWwgPT09IG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXIpKSkge1xuICAgICAgICBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBbIG5vZGUudmFsIF07XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gbm9kZS52YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHV0aWwubWVyZ2Uoak9iaiwgbm9kZS5hdHRyc01hcCwgb3B0aW9ucy5hcnJheU1vZGUpO1xuXG4gIGpPYmouY2hpbGRyZW4gPSBbXTtcbiAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCBjaGlsZCA9PiB7XG4gICAgak9iai5jaGlsZHJlbi5wdXNoKGNvbnZlcnRUb0pzb24oY2hpbGQsIG9wdGlvbnMpKVxuICB9KTtcblxuICAvL2FkZCB2YWx1ZVxuICByZXR1cm4gak9iajtcbn07XG5cbmV4cG9ydHMuY29udmVydFRvSnNvbiA9IGNvbnZlcnRUb0pzb247XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5vZGVUb0pzb24gPSByZXF1aXJlKCcuL25vZGUyanNvbicpO1xuY29uc3QgeG1sVG9Ob2Rlb2JqID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgeDJ4bWxub2RlID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMsIHZhbGlkYXRpb25PcHRpb24pIHtcbiAgIGlmKCB2YWxpZGF0aW9uT3B0aW9uKXtcbiAgICAgaWYodmFsaWRhdGlvbk9wdGlvbiA9PT0gdHJ1ZSkgdmFsaWRhdGlvbk9wdGlvbiA9IHt9XG5cbiAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yLnZhbGlkYXRlKHhtbERhdGEsIHZhbGlkYXRpb25PcHRpb24pO1xuICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgdGhyb3cgRXJyb3IoIHJlc3VsdC5lcnIubXNnKVxuICAgICB9XG4gICB9XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgeDJ4bWxub2RlLmRlZmF1bHRPcHRpb25zLCB4MnhtbG5vZGUucHJvcHMpO1xuICByZXR1cm4gbm9kZVRvSnNvbi5jb252ZXJ0VG9Kc29uKHhtbFRvTm9kZW9iai5nZXRUcmF2ZXJzYWxPYmooeG1sRGF0YSwgb3B0aW9ucyksIG9wdGlvbnMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRBbGxNYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgd2hpbGUgKG1hdGNoKSB7XG4gICAgY29uc3QgYWxsbWF0Y2hlcyA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCsrKSB7XG4gICAgICBhbGxtYXRjaGVzLnB1c2gobWF0Y2hbaW5kZXhdKTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGFsbG1hdGNoZXMpO1xuICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB9XG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuY29uc3QgZG9lc01hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgcmV0dXJuICEobWF0Y2ggPT09IG51bGwgfHwgdHlwZW9mIG1hdGNoID09PSAndW5kZWZpbmVkJyk7XG59O1xuXG5jb25zdCBkb2VzTm90TWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIHJldHVybiAhZG9lc01hdGNoKHN0cmluZywgcmVnZXgpO1xufTtcblxuZXhwb3J0cy5pc0V4aXN0ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgIT09ICd1bmRlZmluZWQnO1xufTtcblxuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbi8qKlxuICogQ29weSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYSBpbnRvIGIuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHBhcmFtIHsqfSBhXG4gKi9cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIGEsIGFycmF5TW9kZSkge1xuICBpZiAoYSkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhKTsgLy8gd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Ygb3duIHByb3BlcnRpZXNcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmKGFycmF5TW9kZSA9PT0gJ3N0cmljdCcpe1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBbIGFba2V5c1tpXV0gXTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBhW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbi8qIGV4cG9ydHMubWVyZ2UgPWZ1bmN0aW9uIChiLGEpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihiLGEpO1xufSAqL1xuXG5leHBvcnRzLmdldFZhbHVlID0gZnVuY3Rpb24odikge1xuICBpZiAoZXhwb3J0cy5pc0V4aXN0KHYpKSB7XG4gICAgcmV0dXJuIHY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vLyBjb25zdCBmYWtlQ2FsbCA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gYTt9O1xuLy8gY29uc3QgZmFrZUNhbGxOb1JldHVybiA9IGZ1bmN0aW9uKCkge307XG5cbmV4cG9ydHMuYnVpbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKSB7XG4gIHZhciBuZXdPcHRpb25zID0ge307XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybiBkZWZhdWx0T3B0aW9uczsgLy9pZiB0aGVyZSBhcmUgbm90IG9wdGlvbnNcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1twcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBvcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBkZWZhdWx0T3B0aW9uc1twcm9wc1tpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdPcHRpb25zO1xufTtcblxuZXhwb3J0cy5kb2VzTWF0Y2ggPSBkb2VzTWF0Y2g7XG5leHBvcnRzLmRvZXNOb3RNYXRjaCA9IGRvZXNOb3RNYXRjaDtcbmV4cG9ydHMuZ2V0QWxsTWF0Y2hlcyA9IGdldEFsbE1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL0EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgbG9jYWxlUmFuZ2U6ICdhLXpBLVonLFxufTtcblxuY29uc3QgcHJvcHMgPSBbJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLCAnbG9jYWxlUmFuZ2UnXTtcblxuLy9jb25zdCB0YWdzUGF0dGVybiA9IG5ldyBSZWdFeHAoXCI8XFxcXC8/KFtcXFxcdzpcXFxcLV9cXC5dKylcXFxccypcXC8/PlwiLFwiZ1wiKTtcbmV4cG9ydHMudmFsaWRhdGUgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB1dGlsLmJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIlwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXlxccyo8XFw/eG1sLio/XFw/PikvZyxcIlwiKTsvL1JlbW92ZSBYTUwgc3RhcnRpbmcgdGFnXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKDwhRE9DVFlQRVtcXHNcXHdcXFwiXFwuXFwvXFwtXFw6XSsoXFxbLipcXF0pKlxccyo+KS9nLFwiXCIpOy8vUmVtb3ZlIERPQ1RZUEVcblxuICBjb25zdCB0YWdzID0gW107XG4gIGxldCB0YWdGb3VuZCA9IGZhbHNlO1xuICBpZiAoeG1sRGF0YVswXSA9PT0gJ1xcdWZlZmYnKSB7XG4gICAgLy8gY2hlY2sgZm9yIGJ5dGUgb3JkZXIgbWFyayAoQk9NKVxuICAgIHhtbERhdGEgPSB4bWxEYXRhLnN1YnN0cigxKTtcbiAgfVxuICBjb25zdCByZWd4QXR0ck5hbWUgPSBuZXcgUmVnRXhwKCdeW193XVtcXFxcd1xcXFwtLjpdKiQnLnJlcGxhY2UoJ193JywgJ18nICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBjb25zdCByZWd4VGFnTmFtZSA9IG5ldyBSZWdFeHAoJ14oW3ddfF8pW1xcXFx3LlxcXFwtXzpdKicucmVwbGFjZSgnKFt3JywgJyhbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgLy9zdGFydGluZyBvZiB0YWdcbiAgICAgIC8vcmVhZCB1bnRpbCB5b3UgcmVhY2ggdG8gJz4nIGF2b2lkaW5nIGFueSAnPicgaW4gYXR0cmlidXRlIHZhbHVlXG5cbiAgICAgIGkrKztcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPycpIHtcbiAgICAgICAgaSA9IHJlYWRQSSh4bWxEYXRhLCArK2kpO1xuICAgICAgICBpZiAoaS5lcnIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnIScpIHtcbiAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsb3NpbmdUYWcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcvJykge1xuICAgICAgICAgIC8vY2xvc2luZyB0YWdcbiAgICAgICAgICBjbG9zaW5nVGFnID0gdHJ1ZTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWFkIHRhZ25hbWVcbiAgICAgICAgbGV0IHRhZ05hbWUgPSAnJztcbiAgICAgICAgZm9yIChcbiAgICAgICAgICA7XG4gICAgICAgICAgaSA8IHhtbERhdGEubGVuZ3RoICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJz4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJyAnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcdCcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxuJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHInO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICB0YWdOYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUudHJpbSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRhZ05hbWUpO1xuXG4gICAgICAgIGlmICh0YWdOYW1lW3RhZ05hbWUubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZyB3aXRob3V0IGF0dHJpYnV0ZXNcbiAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHJpbmcoMCwgdGFnTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbGlkYXRlVGFnTmFtZSh0YWdOYW1lLCByZWd4VGFnTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnVGFnICcgKyB0YWdOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ0F0dHJpYnV0ZXMgZm9yIFwiJyArIHRhZ05hbWUgKyAnXCIgaGF2ZSBvcGVuIHF1b3RlLid9fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0clN0ciA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaSA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgICBpZiAoYXR0clN0clthdHRyU3RyLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICBhdHRyU3RyID0gYXR0clN0ci5zdWJzdHJpbmcoMCwgYXR0clN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgLy9jb250aW51ZTsgLy90ZXh0IG1heSBwcmVzZW50cyBhZnRlciBzZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjbG9zaW5nVGFnKSB7XG4gICAgICAgICAgaWYoIXJlc3VsdC50YWdDbG9zZWQpe1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGRvbid0IGhhdmUgcHJvcGVyIGNsb3NpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9ZWxzZSBpZiAoYXR0clN0ci50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGNhbid0IGhhdmUgYXR0cmlidXRlcyBvciBpbnZhbGlkIHN0YXJ0aW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG90ZyA9IHRhZ3MucG9wKCk7XG4gICAgICAgICAgICBpZiAodGFnTmFtZSAhPT0gb3RnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyAnICsgb3RnICsgJyBpcyBleHBlY3RlZCBpbnBsYWNlIG9mICcgKyB0YWdOYW1lICsgJy4nfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWdzLnB1c2godGFnTmFtZSk7XG4gICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9za2lwIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIC8vSXQgbWF5IGluY2x1ZGUgY29tbWVudHMgYW5kIENEQVRBIHZhbHVlXG4gICAgICAgIGZvciAoaSsrOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICAgIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgICAgIC8vY29tbWVudCBvciBDQURBVEFcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy9lbmQgb2YgcmVhZGluZyB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnICcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcdCcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcbicgfHwgeG1sRGF0YVtpXSA9PT0gJ1xccicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQ2hhcicsIG1zZzogJ2NoYXIgJyArIHhtbERhdGFbaV0gKyAnIGlzIG5vdCBleHBlY3RlZCAuJ319O1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGFnRm91bmQpIHtcbiAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnU3RhcnQgdGFnIGV4cGVjdGVkLid9fTtcbiAgfSBlbHNlIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdJbnZhbGlkICcgKyBKU09OLnN0cmluZ2lmeSh0YWdzLCBudWxsLCA0KS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKSArICcgZm91bmQuJ30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWFkIFByb2Nlc3NpbmcgaW5zc3RydWN0aW9ucyBhbmQgc2tpcFxuICogQHBhcmFtIHsqfSB4bWxEYXRhXG4gKiBAcGFyYW0geyp9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZFBJKHhtbERhdGEsIGkpIHtcbiAgdmFyIHN0YXJ0ID0gaTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT0gJz8nIHx8IHhtbERhdGFbaV0gPT0gJyAnKSB7XG4gICAgICAvL3RhZ25hbWVcbiAgICAgIHZhciB0YWduYW1lID0geG1sRGF0YS5zdWJzdHIoc3RhcnQsIGkgLSBzdGFydCk7XG4gICAgICBpZiAoaSA+IDUgJiYgdGFnbmFtZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1hNTCBkZWNsYXJhdGlvbiBhbGxvd2VkIG9ubHkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudC4nfX07XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT0gJz8nICYmIHhtbERhdGFbaSArIDFdID09ICc+Jykge1xuICAgICAgICAvL2NoZWNrIGlmIHZhbGlkIGF0dHJpYnV0IHN0cmluZ1xuICAgICAgICBpKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpO1xufVxuXG5mdW5jdGlvbiByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpIHtcbiAgaWYgKHhtbERhdGEubGVuZ3RoID4gaSArIDUgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJy0nKSB7XG4gICAgLy9jb21tZW50XG4gICAgZm9yIChpICs9IDM7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA4ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnTycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnWScgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ1AnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdFJ1xuICApIHtcbiAgICBsZXQgYW5nbGVCcmFja2V0c0NvdW50ID0gMTtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQtLTtcbiAgICAgICAgaWYgKGFuZ2xlQnJhY2tldHNDb3VudCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDkgJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ1snICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ1snXG4gICkge1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaTtcbn1cblxudmFyIGRvdWJsZVF1b3RlID0gJ1wiJztcbnZhciBzaW5nbGVRdW90ZSA9IFwiJ1wiO1xuXG4vKipcbiAqIEtlZXAgcmVhZGluZyB4bWxEYXRhIHVudGlsICc8JyBpcyBmb3VuZCBvdXRzaWRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30geG1sRGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKSB7XG4gIGxldCBhdHRyU3RyID0gJyc7XG4gIGxldCBzdGFydENoYXIgPSAnJztcbiAgbGV0IHRhZ0Nsb3NlZCA9IGZhbHNlO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gZG91YmxlUXVvdGUgfHwgeG1sRGF0YVtpXSA9PT0gc2luZ2xlUXVvdGUpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9IHhtbERhdGFbaV07XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0Q2hhciAhPT0geG1sRGF0YVtpXSkge1xuICAgICAgICAvL2lmIHZhdWUgaXMgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGUgdGhlbiBzaW5nbGUgcXVvdGVzIGFyZSBhbGxvd2VkIGluc2lkZSB0aGUgdmFsdWUgYW5kIHZpY2UgdmVyc2FcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydENoYXIgPSAnJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgdGFnQ2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGF0dHJTdHIgKz0geG1sRGF0YVtpXTtcbiAgfVxuICBpZiAoc3RhcnRDaGFyICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7dmFsdWU6IGF0dHJTdHIsIGluZGV4OiBpLCB0YWdDbG9zZWQ6IHRhZ0Nsb3NlZH07XG59XG5cbi8qKlxuICogU2VsZWN0IGFsbCB0aGUgYXR0cmlidXRlcyB3aGV0aGVyIHZhbGlkIG9yIGludmFsaWQuXG4gKi9cbmNvbnN0IHZhbGlkQXR0clN0clJlZ3hwID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoW15cXFxccz1dKykoXFxcXHMqPSk/KFxcXFxzKihbXFwnXCJdKSgoW1xcXFxzXFxcXFNdKSo/KVxcXFw1KT8nLCAnZycpO1xuXG4vL2F0dHIsID1cInNkXCIsIGE9XCJhbWl0J3NcIiwgYT1cInNkXCJiPVwic2FmXCIsIGFiICBjZD1cIlwiXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSkge1xuICAvL2NvbnNvbGUubG9nKFwic3RhcnQ6XCIrYXR0clN0citcIjplbmRcIik7XG5cbiAgLy9pZihhdHRyU3RyLnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlOyAvL2VtcHR5IHN0cmluZ1xuXG4gIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgdmFsaWRBdHRyU3RyUmVneHApO1xuICBjb25zdCBhdHRyTmFtZXMgPSB7fTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NvbnNvbGUubG9nKG1hdGNoZXNbaV0pO1xuXG4gICAgaWYgKG1hdGNoZXNbaV1bMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAvL25vc3BhY2UgYmVmb3JlIGF0dHJpYnV0ZSBuYW1lOiBhPVwic2RcImI9XCJzYWZcIlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGhhcyBubyBzcGFjZSBpbiBzdGFydGluZy4nfX07XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzW2ldWzNdID09PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgLy9pbmRlcGVuZGVudCBhdHRyaWJ1dGU6IGFiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2Jvb2xlYW4gYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBpcyBub3QgYWxsb3dlZC4nfX07XG4gICAgfVxuICAgIC8qIGVsc2UgaWYobWF0Y2hlc1tpXVs2XSA9PT0gdW5kZWZpbmVkKXsvL2F0dHJpYnV0ZSB3aXRob3V0IHZhbHVlOiBhYj1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiB7IGNvZGU6XCJJbnZhbGlkQXR0clwiLG1zZzpcImF0dHJpYnV0ZSBcIiArIG1hdGNoZXNbaV1bMl0gKyBcIiBoYXMgbm8gdmFsdWUgYXNzaWduZWQuXCJ9fTtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgY29uc3QgYXR0ck5hbWUgPSBtYXRjaGVzW2ldWzJdO1xuICAgIGlmICghdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSkge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgIH1cbiAgICAvKmlmICghYXR0ck5hbWVzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkgeyovXG4gICAgaWYgKCAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJOYW1lcywgYXR0ck5hbWUpKSB7XG4gICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGUgYXR0cmlidXRlLlxuICAgICAgYXR0ck5hbWVzW2F0dHJOYW1lXSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgcmVwZWF0ZWQuJ319O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IC9eW19hLXpBLVpdW1xcd1xcLS46XSokLztcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSB7XG4gIC8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gbmV3IFJlZ0V4cChyZWd4QXR0ck5hbWUpO1xuICByZXR1cm4gdXRpbC5kb2VzTWF0Y2goYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSk7XG59XG5cbi8vY29uc3Qgc3RhcnRzV2l0aFhNTCA9IG5ldyBSZWdFeHAoXCJeW1h4XVtNbV1bTGxdXCIpO1xuLy8gIHN0YXJ0c1dpdGggPSAvXihbYS16QS1aXXxfKVtcXHcuXFwtXzpdKi87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVGFnTmFtZSh0YWduYW1lLCByZWd4VGFnTmFtZSkge1xuICAvKmlmKHV0aWwuZG9lc01hdGNoKHRhZ25hbWUsc3RhcnRzV2l0aFhNTCkpIHJldHVybiBmYWxzZTtcbiAgICBlbHNlKi9cbiAgcmV0dXJuICF1dGlsLmRvZXNOb3RNYXRjaCh0YWduYW1lLCByZWd4VGFnTmFtZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFnbmFtZSwgcGFyZW50LCB2YWwpIHtcbiAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuY2hpbGQgPSB7fTsgLy9jaGlsZCB0YWdzXG4gIHRoaXMuYXR0cnNNYXAgPSB7fTsgLy9hdHRyaWJ1dGVzIG1hcFxuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMudmFsID0gdmFsOyAvL3RleHQgb25seVxuICB0aGlzLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0pKSB7XG4gICAgICAvL2FscmVhZHkgcHJlc2VudHNcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0gPSBbY2hpbGRdO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHhtbE5vZGUgPSByZXF1aXJlKCcuL3htbE5vZGUnKTtcbmNvbnN0IFRhZ1R5cGUgPSB7T1BFTklORzogMSwgQ0xPU0lORzogMiwgU0VMRjogMywgQ0RBVEE6IDR9O1xubGV0IHJlZ3ggPVxuICAnPCgoIVxcXFxbQ0RBVEFcXFxcWyhbXFxcXHNcXFxcU10qPykoXV0+KSl8KChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKShbXj5dKik+fCgoXFxcXC8pKChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKVxcXFxzKj4pKShbXjxdKiknO1xuXG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/W1xcXFx3OlxcXFwtXFwuX10rKShbXj5dKik+KFxcXFxzKlwiK2NkYXRhUmVneCtcIikqKFtePF0rKT9cIixcImdcIik7XG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/KSgoXFxcXHcqOik/KFtcXFxcdzpcXFxcLVxcLl9dKykpKFtePl0qKT4oW148XSopKFwiK2NkYXRhUmVneCtcIihbXjxdKikpKihbXjxdKyk/XCIsXCJnXCIpO1xuXG4vL3BvbHlmaWxsXG5pZiAoIU51bWJlci5wYXJzZUludCAmJiB3aW5kb3cucGFyc2VJbnQpIHtcbiAgTnVtYmVyLnBhcnNlSW50ID0gd2luZG93LnBhcnNlSW50O1xufVxuaWYgKCFOdW1iZXIucGFyc2VGbG9hdCAmJiB3aW5kb3cucGFyc2VGbG9hdCkge1xuICBOdW1iZXIucGFyc2VGbG9hdCA9IHdpbmRvdy5wYXJzZUZsb2F0O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYXR0cmlidXRlTmFtZVByZWZpeDogJ0BfJyxcbiAgYXR0ck5vZGVOYW1lOiBmYWxzZSxcbiAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICBpZ25vcmVBdHRyaWJ1dGVzOiB0cnVlLFxuICBpZ25vcmVOYW1lU3BhY2U6IGZhbHNlLFxuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9hIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIC8vaWdub3JlUm9vdEVsZW1lbnQgOiBmYWxzZSxcbiAgcGFyc2VOb2RlVmFsdWU6IHRydWUsXG4gIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICBhcnJheU1vZGU6IGZhbHNlLFxuICB0cmltVmFsdWVzOiB0cnVlLCAvL1RyaW0gc3RyaW5nIHZhbHVlcyBvZiB0YWcgYW5kIGF0dHJpYnV0ZXNcbiAgY2RhdGFUYWdOYW1lOiBmYWxzZSxcbiAgY2RhdGFQb3NpdGlvbkNoYXI6ICdcXFxcYycsXG4gIGxvY2FsZVJhbmdlOiAnJyxcbiAgdGFnVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgYXR0clZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIHN0b3BOb2RlczogW11cbiAgLy9kZWNvZGVTdHJpY3Q6IGZhbHNlLFxufTtcblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5jb25zdCBwcm9wcyA9IFtcbiAgJ2F0dHJpYnV0ZU5hbWVQcmVmaXgnLFxuICAnYXR0ck5vZGVOYW1lJyxcbiAgJ3RleHROb2RlTmFtZScsXG4gICdpZ25vcmVBdHRyaWJ1dGVzJyxcbiAgJ2lnbm9yZU5hbWVTcGFjZScsXG4gICdhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJyxcbiAgJ3BhcnNlTm9kZVZhbHVlJyxcbiAgJ3BhcnNlQXR0cmlidXRlVmFsdWUnLFxuICAnYXJyYXlNb2RlJyxcbiAgJ3RyaW1WYWx1ZXMnLFxuICAnY2RhdGFUYWdOYW1lJyxcbiAgJ2NkYXRhUG9zaXRpb25DaGFyJyxcbiAgJ2xvY2FsZVJhbmdlJyxcbiAgJ3RhZ1ZhbHVlUHJvY2Vzc29yJyxcbiAgJ2F0dHJWYWx1ZVByb2Nlc3NvcicsXG4gICdwYXJzZVRydWVOdW1iZXJPbmx5JyxcbiAgJ3N0b3BOb2Rlcydcbl07XG5leHBvcnRzLnByb3BzID0gcHJvcHM7XG5cbmNvbnN0IGdldFRyYXZlcnNhbE9iaiA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoL1xccj9cXG4vZywgXCIgXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICB4bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC88IS0tW1xcc1xcU10qPy0tPi9nLCAnJyk7IC8vUmVtb3ZlICBjb21tZW50c1xuXG4gIGNvbnN0IHhtbE9iaiA9IG5ldyB4bWxOb2RlKCcheG1sJyk7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHhtbE9iajtcblxuICByZWd4ID0gcmVneC5yZXBsYWNlKC9cXFtcXFxcdy9nLCAnWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlICsgJ1xcXFx3Jyk7XG4gIGNvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChyZWd4LCAnZycpO1xuICBsZXQgdGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgbGV0IG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB3aGlsZSAodGFnKSB7XG4gICAgY29uc3QgdGFnVHlwZSA9IGNoZWNrRm9yVGFnVHlwZSh0YWcpO1xuXG4gICAgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0xPU0lORykge1xuICAgICAgLy9hZGQgcGFyc2VkIGRhdGEgdG8gcGFyZW50IG5vZGVcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnQgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS5wYXJlbnQudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucywgY3VycmVudE5vZGUucGFyZW50LnRhZ25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjdXJyZW50Tm9kZS50YWduYW1lKSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5jaGlsZCA9IFtdXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5hdHRyc01hcCA9PSB1bmRlZmluZWQpIHsgY3VycmVudE5vZGUuYXR0cnNNYXAgPSB7fX1cbiAgICAgICAgY3VycmVudE5vZGUudmFsID0geG1sRGF0YS5zdWJzdHIoY3VycmVudE5vZGUuc3RhcnRJbmRleCArIDEsIHRhZy5pbmRleCAtIGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggLSAxKVxuICAgICAgfVxuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNEQVRBKSB7XG4gICAgICBpZiAob3B0aW9ucy5jZGF0YVRhZ05hbWUpIHtcbiAgICAgICAgLy9hZGQgY2RhdGEgbm9kZVxuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmNkYXRhVGFnTmFtZSwgY3VycmVudE5vZGUsIHRhZ1szXSk7XG4gICAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAvL2ZvciBiYWNrdHJhY2tpbmdcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcjtcbiAgICAgICAgLy9hZGQgcmVzdCB2YWx1ZSB0byBwYXJlbnQgbm9kZVxuICAgICAgICBpZiAodGFnWzE0XSkge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnZhbCArPSBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gKGN1cnJlbnROb2RlLnZhbCB8fCAnJykgKyAodGFnWzNdIHx8ICcnKSArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5TRUxGKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSwgY3VycmVudE5vZGUsICcnKTtcbiAgICAgIGlmICh0YWdbOF0gJiYgdGFnWzhdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFnWzhdID0gdGFnWzhdLnN1YnN0cigwLCB0YWdbOF0ubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVGFnVHlwZS5PUEVOSU5HXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShcbiAgICAgICAgb3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sXG4gICAgICAgIGN1cnJlbnROb2RlLFxuICAgICAgICBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY2hpbGROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGNoaWxkTm9kZS5zdGFydEluZGV4PXRhZy5pbmRleCArIHRhZ1sxXS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlID0gY2hpbGROb2RlO1xuICAgIH1cblxuICAgIHRhZyA9IG5leHRUYWc7XG4gICAgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIH1cblxuICByZXR1cm4geG1sT2JqO1xufTtcblxuZnVuY3Rpb24gcHJvY2Vzc1RhZ1ZhbHVlKHBhcnNlZFRhZ3MsIG9wdGlvbnMsIHBhcmVudFRhZ05hbWUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IHBhcnNlZFRhZ3NbN10gfHwgcGFyZW50VGFnTmFtZTtcbiAgbGV0IHZhbCA9IHBhcnNlZFRhZ3NbMTRdO1xuICBpZiAodmFsKSB7XG4gICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgdmFsID0gdmFsLnRyaW0oKTtcbiAgICB9XG4gICAgdmFsID0gb3B0aW9ucy50YWdWYWx1ZVByb2Nlc3Nvcih2YWwsIHRhZ05hbWUpO1xuICAgIHZhbCA9IHBhcnNlVmFsdWUodmFsLCBvcHRpb25zLnBhcnNlTm9kZVZhbHVlLCBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JUYWdUeXBlKG1hdGNoKSB7XG4gIGlmIChtYXRjaFs0XSA9PT0gJ11dPicpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DREFUQTtcbiAgfSBlbHNlIGlmIChtYXRjaFsxMF0gPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLkNMT1NJTkc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzhdICE9PSAndW5kZWZpbmVkJyAmJiBtYXRjaFs4XS5zdWJzdHIobWF0Y2hbOF0ubGVuZ3RoIC0gMSkgPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLlNFTEY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuT1BFTklORztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlTmFtZVNwYWNlKHRhZ25hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlKSB7XG4gICAgY29uc3QgdGFncyA9IHRhZ25hbWUuc3BsaXQoJzonKTtcbiAgICBjb25zdCBwcmVmaXggPSB0YWduYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgaWYgKHRhZ3NbMF0gPT09ICd4bWxucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICB0YWduYW1lID0gcHJlZml4ICsgdGFnc1sxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhZ25hbWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsLCBzaG91bGRQYXJzZSwgcGFyc2VUcnVlTnVtYmVyT25seSkge1xuICBpZiAoc2hvdWxkUGFyc2UgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBsZXQgcGFyc2VkO1xuICAgIGlmICh2YWwudHJpbSgpID09PSAnJyB8fCBpc05hTih2YWwpKSB7XG4gICAgICBwYXJzZWQgPSB2YWwgPT09ICd0cnVlJyA/IHRydWUgOiB2YWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbC5pbmRleE9mKCcweCcpICE9PSAtMSkge1xuICAgICAgICAvL3N1cHBvcnQgaGV4YSBkZWNpbWFsXG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDE2KTtcbiAgICAgIH0gZWxzZSBpZiAodmFsLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gICAgICAgIHBhcnNlZCA9IFN0cmluZyhwYXJzZWQpID09PSB2YWwgPyBwYXJzZWQgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHV0aWwuaXNFeGlzdCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59XG5cbi8vVE9ETzogY2hhbmdlIHJlZ2V4IHRvIGNhcHR1cmUgTlNcbi8vY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cChcIihbXFxcXHdcXFxcLVxcXFwuXFxcXDpdKylcXFxccyo9XFxcXHMqKFsnXFxcIl0pKCgufFxcbikqPylcXFxcMlwiLFwiZ21cIik7XG5jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKCcoW15cXFxccz1dKylcXFxccyooPVxcXFxzKihbXFwnXCJdKSguKj8pXFxcXDMpPycsICdnJyk7XG5cbmZ1bmN0aW9uIGJ1aWxkQXR0cmlidXRlc01hcChhdHRyU3RyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIHR5cGVvZiBhdHRyU3RyID09PSAnc3RyaW5nJykge1xuICAgIGF0dHJTdHIgPSBhdHRyU3RyLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICAvL2F0dHJTdHIgPSBhdHRyU3RyIHx8IGF0dHJTdHIudHJpbSgpO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCBhdHRyc1JlZ3gpO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoZXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgY29uc3QgYXR0cnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IHJlc29sdmVOYW1lU3BhY2UobWF0Y2hlc1tpXVsxXSwgb3B0aW9ucyk7XG4gICAgICBpZiAoYXR0ck5hbWUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldWzRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gbWF0Y2hlc1tpXVs0XS50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBvcHRpb25zLmF0dHJWYWx1ZVByb2Nlc3NvcihtYXRjaGVzW2ldWzRdLCBhdHRyTmFtZSk7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gcGFyc2VWYWx1ZShcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0sXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlQXR0cmlidXRlVmFsdWUsXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFPYmplY3Qua2V5cyhhdHRycykubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF0dHJOb2RlTmFtZSkge1xuICAgICAgY29uc3QgYXR0ckNvbGxlY3Rpb24gPSB7fTtcbiAgICAgIGF0dHJDb2xsZWN0aW9uW29wdGlvbnMuYXR0ck5vZGVOYW1lXSA9IGF0dHJzO1xuICAgICAgcmV0dXJuIGF0dHJDb2xsZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbn1cblxuZXhwb3J0cy5nZXRUcmF2ZXJzYWxPYmogPSBnZXRUcmF2ZXJzYWxPYmo7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuLyoqXG4gKiBHZW5lcmljIGFuaW1hdGlvbiBjbGFzcyB3aXRoIHN1cHBvcnQgZm9yIGRyb3BwZWQgZnJhbWVzIGJvdGggb3B0aW9uYWwgZWFzaW5nIGFuZCBkdXJhdGlvbi5cbiAqXG4gKiBPcHRpb25hbCBkdXJhdGlvbiBpcyB1c2VmdWwgd2hlbiB0aGUgbGlmZXRpbWUgaXMgZGVmaW5lZCBieSBhbm90aGVyIGNvbmRpdGlvbiB0aGFuIHRpbWVcbiAqIGUuZy4gc3BlZWQgb2YgYW4gYW5pbWF0aW5nIG9iamVjdCwgZXRjLlxuICpcbiAqIERyb3BwZWQgZnJhbWUgbG9naWMgYWxsb3dzIHRvIGtlZXAgdXNpbmcgdGhlIHNhbWUgdXBkYXRlciBsb2dpYyBpbmRlcGVuZGVudCBmcm9tIHRoZSBhY3R1YWxcbiAqIHJlbmRlcmluZy4gVGhpcyBlYXNlcyBhIGxvdCBvZiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBwcmV0dHkgY29tcGxleCB0byBicmVhayBkb3duIGEgc3RhdGVcbiAqIGJhc2VkIG9uIHRoZSBwdXJlIHRpbWUgZGlmZmVyZW5jZS5cbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSgocm9vdC5hbmltYXRlID0ge30pKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgdmFyIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvd1xuICAgIHZhciB0aW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gICAgfTtcbiAgICB2YXIgZGVzaXJlZEZyYW1lcyA9IDYwO1xuICAgIHZhciBtaWxsaXNlY29uZHNQZXJTZWNvbmQgPSAxMDAwO1xuICAgIHZhciBydW5uaW5nID0ge307XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGdpdmVuIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiB3YXMgc3RvcHBlZCAoYWthLCB3YXMgcnVubmluZyBiZWZvcmUpXG4gICAgICovXG4gICAgZXhwb3J0cy5zdG9wID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBjbGVhcmVkID0gKHJ1bm5pbmdbaWRdICE9PSBudWxsKTtcbiAgICAgICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGVhcmVkO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdpdmVuIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgKi9cbiAgICBleHBvcnRzLmlzUnVubmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gcnVubmluZ1tpZF0gIT09IG51bGw7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGVwQ2FsbGJhY2sge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkIG9uIGV2ZXJ5IHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQsIG5vdywgdmlydHVhbCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSB2ZXJpZnlDYWxsYmFjayB7RnVuY3Rpb259IEV4ZWN1dGVkIGJlZm9yZSBldmVyeSBhbmltYXRpb24gc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZENhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oZHJvcHBlZEZyYW1lcywgZmluaXNoZWRBbmltYXRpb24sIG9wdGlvbmFsIHdhc0ZpbmlzaGVkKSB7fWBcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24ge0ludGVnZXJ9IE1pbGxpc2Vjb25kcyB0byBydW4gdGhlIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmdNZXRob2Qge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGVhc2luZyBmdW5jdGlvblxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50KSB7IHJldHVybiBtb2RpZmllZFZhbHVlOyB9YFxuICAgICAqIEBwYXJhbSByb290IHtFbGVtZW50fSBSZW5kZXIgcm9vdC4gVXNlZCBmb3IgaW50ZXJuYWwgdXNhZ2Ugb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IElkZW50aWZpZXIgb2YgYW5pbWF0aW9uLiBDYW4gYmUgdXNlZCB0byBzdG9wIGl0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RhcnQgPSBmdW5jdGlvbiAoc3RlcENhbGxiYWNrLCB2ZXJpZnlDYWxsYmFjaywgY29tcGxldGVkQ2FsbGJhY2ssIGR1cmF0aW9uLCBlYXNpbmdNZXRob2QsIHJvb3QpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGltZSgpO1xuICAgICAgICB2YXIgbGFzdEZyYW1lID0gc3RhcnQ7XG4gICAgICAgIHZhciBwZXJjZW50ID0gMDtcbiAgICAgICAgdmFyIGRyb3BDb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGlkID0gY291bnRlcisrO1xuXG4gICAgICAgIC8vIENvbXBhY3RpbmcgcnVubmluZyBkYiBhdXRvbWF0aWNhbGx5IGV2ZXJ5IGZldyBuZXcgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaWQgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIG5ld1J1bm5pbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHVzZWRJZCBpbiBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3UnVubmluZ1t1c2VkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBuZXdSdW5uaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RlcCBtZXRob2Qgd2hpY2ggaXMgY2FsbGVkIGV2ZXJ5IGZldyBtaWxsaXNlY29uZHNcbiAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAodmlydHVhbCkge1xuXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgdmlydHVhbCB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IHZpcnR1YWwgIT09IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWVcbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lKCk7XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBpcyBleGVjdXRlZCBiZWZvcmUgbmV4dCBhbmltYXRpb24gc3RlcFxuICAgICAgICAgICAgaWYgKCFydW5uaW5nW2lkXSB8fCAodmVyaWZ5Q2FsbGJhY2sgJiYgIXZlcmlmeUNhbGxiYWNrKGlkKSkpIHtcblxuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBjdXJyZW50IHJlbmRlcmluZyB0byBhcHBseSBsZXQncyB1cGRhdGUgb21pdHRlZCBzdGVwcyBpbiBtZW1vcnkuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byBicmluZyBpbnRlcm5hbCBzdGF0ZSB2YXJpYWJsZXMgdXAtdG8tZGF0ZSB3aXRoIHByb2dyZXNzIGluIHRpbWUuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHJvcHBlZEZyYW1lcyA9IE1hdGgucm91bmQoKG5vdyAtIGxhc3RGcmFtZSkgLyAobWlsbGlzZWNvbmRzUGVyU2Vjb25kIC8gZGVzaXJlZEZyYW1lcykpIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGgubWluKGRyb3BwZWRGcmFtZXMsIDQpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBwZXJjZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKG5vdyAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgc3RlcCBjYWxsYmFjaywgdGhlbi4uLlxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWFzaW5nTWV0aG9kID8gZWFzaW5nTWV0aG9kKHBlcmNlbnQpIDogcGVyY2VudDtcbiAgICAgICAgICAgIGlmICgoc3RlcENhbGxiYWNrKHZhbHVlLCBub3csIHJlbmRlcikgPT09IGZhbHNlIHx8IHBlcmNlbnQgPT09IDEpICYmIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIHBlcmNlbnQgPT09IDEgfHwgZHVyYXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgIGxhc3RGcmFtZSA9IG5vdztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyayBhcyBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmdbaWRdID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbml0IGZpcnN0IHN0ZXBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuXG4gICAgICAgIC8vIFJldHVybiB1bmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5pbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xudmFyIE5PT1AgPSBmdW5jdGlvbiAoKSB7IH07XG5cbi8vIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcbiAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcbiAgfVxuXG4gIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLCAzKSArIDIpO1xufTtcblxuXG4vKipcbiAqIEEgcHVyZSBsb2dpYyAnY29tcG9uZW50JyBmb3IgJ3ZpcnR1YWwnIHNjcm9sbGluZy96b29taW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB4LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1g6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHktYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWTogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBhbmltYXRpb25zIGZvciBkZWNlbGVyYXRpb24sIHNuYXAgYmFjaywgem9vbWluZyBhbmQgc2Nyb2xsaW5nICovXG4gICAgICBhbmltYXRpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBkdXJhdGlvbiBmb3IgYW5pbWF0aW9ucyB0cmlnZ2VyZWQgYnkgc2Nyb2xsVG8vem9vbVRvICovXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogMjUwLFxuXG4gICAgICAvKiogRW5hYmxlIGJvdW5jaW5nIChjb250ZW50IGNhbiBiZSBzbG93bHkgbW92ZWQgb3V0c2lkZSBhbmQganVtcHMgYmFjayBhZnRlciByZWxlYXNpbmcpICovXG4gICAgICBib3VuY2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBsb2NraW5nIHRvIHRoZSBtYWluIGF4aXMgaWYgdXNlciBtb3ZlcyBvbmx5IHNsaWdodGx5IG9uIG9uZSBvZiB0aGVtIGF0IHN0YXJ0ICovXG4gICAgICBsb2NraW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHBhZ2luYXRpb24gbW9kZSAoc3dpdGNoaW5nIGJldHdlZW4gZnVsbCBwYWdlIGNvbnRlbnQgcGFuZXMpICovXG4gICAgICBwYWdpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHNuYXBwaW5nIG9mIGNvbnRlbnQgdG8gYSBjb25maWd1cmVkIHBpeGVsIGdyaWQgKi9cbiAgICAgIHNuYXBwaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSB6b29taW5nIG9mIGNvbnRlbnQgdmlhIEFQSSwgZmluZ2VycyBhbmQgbW91c2Ugd2hlZWwgKi9cbiAgICAgIHpvb21pbmc6IGZhbHNlLFxuXG4gICAgICAvKiogTWluaW11bSB6b29tIGxldmVsICovXG4gICAgICBtaW5ab29tOiAwLjUsXG5cbiAgICAgIC8qKiBNYXhpbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1heFpvb206IDMsXG5cbiAgICAgIC8qKiBNdWx0aXBseSBvciBkZWNyZWFzZSBzY3JvbGxpbmcgc3BlZWQgKiovXG4gICAgICBzcGVlZE11bHRpcGxpZXI6IDEsXG5cbiAgICAgIC8qKiBDYWxsYmFjayB0aGF0IGlzIGZpcmVkIG9uIHRoZSBsYXRlciBvZiB0b3VjaCBlbmQgb3IgZGVjZWxlcmF0aW9uIGVuZCxcbiAgICAgICAgICBwcm92aWRlZCB0aGF0IGFub3RoZXIgc2Nyb2xsaW5nIGFjdGlvbiBoYXMgbm90IGJlZ3VuLiBVc2VkIHRvIGtub3dcbiAgICAgICAgICB3aGVuIHRvIGZhZGUgb3V0IGEgc2Nyb2xsYmFyLiAqL1xuICAgICAgc2Nyb2xsaW5nQ29tcGxldGU6IE5PT1AsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uOiAwLjAzLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjogMC4wOFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgLypcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgSU5URVJOQUwgRklFTERTIDo6IFNUQVRVU1xuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgb25seSBhIHNpbmdsZSBmaW5nZXIgaXMgdXNlZCBpbiB0b3VjaCBoYW5kbGluZyAqL1xuICBfX2lzU2luZ2xlVG91Y2ggPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSB0b3VjaCBldmVudCBzZXF1ZW5jZSBpcyBpbiBwcm9ncmVzcyAqL1xuICBfX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uIHdlbnQgdG8gY29tcGxldGlvbi4gKi9cbiAgX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciBhIGdlc3R1cmUgem9vbS9yb3RhdGUgZXZlbnQgaXMgaW4gcHJvZ3Jlc3MuIEFjdGl2YXRlcyB3aGVuXG4gICAqIGEgZ2VzdHVyZXN0YXJ0IGV2ZW50IGhhcHBlbnMuIFRoaXMgaGFzIGhpZ2hlciBwcmlvcml0eSB0aGFuIGRyYWdnaW5nLlxuICAgKi9cbiAgX19pc0dlc3R1cmluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgdXNlciBoYXMgbW92ZWQgYnkgc3VjaCBhIGRpc3RhbmNlIHRoYXQgd2UgaGF2ZSBlbmFibGVkXG4gICAqIGRyYWdnaW5nIG1vZGUuIEhpbnQgPSBJdCdzIG9ubHkgZW5hYmxlZCBhZnRlciBzb21lIHBpeGVscyBvZiBtb3ZlbWVudCB0O1xuICAgKiBub3QgaW50ZXJydXB0IHdpdGggY2xpY2tzIGV0Yy5cbiAgICovXG4gIF9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gTm90IHRvdWNoaW5nIGFuZCBkcmFnZ2luZyBhbnltb3JlLCBhbmQgc21vb3RobHkgYW5pbWF0aW5nIHRoZVxuICAgKiB0b3VjaCBzZXF1ZW5jZSB1c2luZyBkZWNlbGVyYXRpb24uXG4gICAqL1xuICBfX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBTbW9vdGhseSBhbmltYXRpbmcgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIGNoYW5nZVxuICAgKi9cbiAgX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBESU1FTlNJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBsZWZ0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50TGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCByaWdodCBib3VuZGFyeSAqL1xuICBfX2NsaWVudFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCB3aWR0aCAqL1xuICBfX2NsaWVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodCAqL1xuICBfX2NsaWVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyB3aWR0aCAqL1xuICBfX2NvbnRlbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyBoZWlnaHQgKi9cbiAgX19jb250ZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoIGZvciBjb250ZW50ICovXG4gIF9fc25hcFdpZHRoID0gMTAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0IGZvciBjb250ZW50ICovXG4gIF9fc25hcEhlaWdodCA9IDEwMDtcblxuICAvKioge051bWJlcn0gWm9vbSBsZXZlbCAqL1xuICBfX3pvb21MZXZlbCA9IDE7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19zY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX21heFNjcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCBsZWZ0IHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRMZWZ0ID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgdG9wIHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB6b29tIGxldmVsIChmaW5hbCBzY2FsZSB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRab29tID0gMDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogTEFTVCBQT1NJVElPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge051bWJlcn0gTGVmdCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hMZWZ0ID0gbnVsbDtcblxuICAvKioge051bWJlcn0gVG9wIHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaFRvcCA9IG51bGw7XG5cbiAgLyoqIHtEYXRlfSBUaW1lc3RhbXAgb2YgbGFzdCBtb3ZlIG9mIGZpbmdlci4gVXNlZCB0byBsaW1pdCB0cmFja2luZyByYW5nZSBmb3IgZGVjZWxlcmF0aW9uIHNwZWVkLiAqL1xuICBfX2xhc3RUb3VjaE1vdmUgPSBudWxsO1xuXG4gIC8qKiB7QXJyYXl9IExpc3Qgb2YgcG9zaXRpb25zLCB1c2VzIHRocmVlIGluZGV4ZXMgZm9yIGVhY2ggc3RhdGUgPSBsZWZ0LCB0b3AsIHRpbWVzdGFtcCAqO1xuICBfX3Bvc2l0aW9ucyA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDogPSBERUNFTEVSQVRJT04gU1VQUE9SO1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IGhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQVUJMSUMgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNsaWVudCAob3V0ZXIpIGFuZCBjb250ZW50IChpbm5lcikgZWxlbWVudHMuXG4gICAqIFJlcXVpcmVzIHRoZSBhdmFpbGFibGUgc3BhY2UgZm9yIHRoZSBvdXRlciBlbGVtZW50IGFuZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICogQWxsIHZhbHVlcyB3aGljaCBhcmUgZmFsc3kgKG51bGwgb3IgemVybyBldGMuKSBhcmUgaWdub3JlZCBhbmQgdGhlIG9sZCB2YWx1ZSBpcyBrZXB0LlxuICAgKlxuICAgKiBAcGFyYW0gY2xpZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBJbm5lciB3aWR0aCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjbGllbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBJbm5lciBoZWlnaHQgb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgd2lkdGggb2YgaW5uZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IE91dGVyIGhlaWdodCBvZiBpbm5lciBlbGVtZW50XG4gICAqL1xuICBzZXREaW1lbnNpb25zKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHZhbHVlcyB3aGljaCBhcmUgZGVmaW5lZFxuICAgIGlmIChjbGllbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudFdpZHRoID0gY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNsaWVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudEhlaWdodCA9IGNsaWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudFdpZHRoID0gY29udGVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudEhlaWdodCA9IGNvbnRlbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gUmVmcmVzaCBtYXhpbXVtc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG5cbiAgICAvLyBSZWZyZXNoIHNjcm9sbCBwb3NpdGlvblxuICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIGZhbHNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNsaWVudCBjb29yZGluYXRlcyBpbiByZWxhdGlvbiB0byB0aGUgZG9jdW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtJbnRlZ2VyID8gMH0gTGVmdCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSB0b3Age0ludGVnZXIgPyAwfSBUb3AgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0UG9zaXRpb24obGVmdCwgdG9wKSB7XG4gICAgdGhpcy5fX2NsaWVudExlZnQgPSBsZWZ0IHx8IDA7XG4gICAgdGhpcy5fX2NsaWVudFRvcCA9IHRvcCB8fCAwO1xuICB9XG5cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgc25hcHBpbmcgKHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlKVxuICAgKlxuICAgKiBAcGFyYW0gd2lkdGgge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoXG4gICAqIEBwYXJhbSBoZWlnaHQge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodFxuICAgKi9cbiAgc2V0U25hcFNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX19zbmFwV2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLl9fc25hcEhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmcgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBzY3JvbGwgcG9zaXRpb24gYW5kIGB6b29tYCBsZXZlbFxuICAgKi9cbiAgZ2V0VmFsdWVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLl9fc2Nyb2xsTGVmdCxcbiAgICAgIHRvcDogdGhpcy5fX3Njcm9sbFRvcCxcbiAgICAgIHJpZ2h0OiB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19jbGllbnRXaWR0aCAvIHRoaXMuX196b29tTGV2ZWwsXG4gICAgICBib3R0b206IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIHpvb206IHRoaXMuX196b29tTGV2ZWxcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogR2V0IHBvaW50IGluIGluIGNvbnRlbnQgc3BhY2UgZnJvbSBzY3JvbGwgY29vcmRpbmF0ZXMuXG4gICAqL1xuICBnZXRQb2ludChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApIHtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBzY3JvbGxMZWZ0IC8gdmFsdWVzLnpvb20sXG4gICAgICB0b3A6IHNjcm9sbFRvcCAvIHZhbHVlcy56b29tXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtNYXB9IGBsZWZ0YCBhbmQgYHRvcGAgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqL1xuICBnZXRTY3JvbGxNYXgoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fbWF4U2Nyb2xsVG9wXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRvIHRoZSBnaXZlbiBsZXZlbC4gU3VwcG9ydHMgb3B0aW9uYWwgYW5pbWF0aW9uLiBab29tc1xuICAgKiB0aGUgY2VudGVyIHdoZW4gbm8gY29vcmRpbmF0ZXMgYXJlIGdpdmVuLlxuICAgKlxuICAgKiBAcGFyYW0gbGV2ZWwge051bWJlcn0gTGV2ZWwgdG8gem9vbSB0b1xuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICogQHBhcmFtIGZpeGVkTGVmdCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgbGVmdCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gZml4ZWRUb3Age051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIHRvcCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21UbyhsZXZlbCwgaXNBbmltYXRlZCwgZml4ZWRMZWZ0LCBmaXhlZFRvcCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgY2FsbGJhY2sgaWYgZXhpc3RzXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvbGRMZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBOb3JtYWxpemUgZml4ZWQgcG9pbnQgdG8gY2VudGVyIG9mIHZpZXdwb3J0IGlmIG5vdCBkZWZpbmVkXG4gICAgaWYgKGZpeGVkTGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZExlZnQgPSB0aGlzLl9fY2xpZW50V2lkdGggLyAyO1xuICAgIH1cblxuICAgIGlmIChmaXhlZFRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZFRvcCA9IHRoaXMuX19jbGllbnRIZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcblxuICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3Agc2Nyb2xsIHBvc2l0aW9ucyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbC5cbiAgICAvLyBDaG9vc2luZyB0aGUgbmV3IHZpZXdwb3J0IHNvIHRoYXQgdGhlIG9yaWdpbidzIHBvc2l0aW9uIHJlbWFpbnNcbiAgICAvLyBmaXhlZCwgd2UgaGF2ZSBjZW50cmFsIGRpbGF0aW9uIGFib3V0IHRoZSBvcmlnaW4uXG4gICAgLy8gKiBGaXhlZCBwb2ludCwgJEYkLCByZW1haW5zIHN0YXRpb25hcnkgaW4gY29udGVudCBzcGFjZSBhbmQgaW4gdGhlXG4gICAgLy8gdmlld3BvcnQuXG4gICAgLy8gKiBJbml0aWFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfaSQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBGaW5hbCBzY3JvbGwgcG9zaXRpb24sICRTX2YkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgIC8vICogSW5pdGlhbCBzY2FsaW5nIGZhY3RvciwgJGtfaSQuXG4gICAgLy8gKiBGaW5hbCBzY2FsaW5nIGZhY3RvciwgJGtfZiQuXG4gICAgLy9cbiAgICAvLyAqICRTX2kgXFxtYXBzdG8gU19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pID0gKFNfZiAtIEYpIGtfZiQuXG4gICAgLy8gKiAkKFNfaSAtIEYpIGtfaS9rX2YgPSAoU19mIC0gRikkLlxuICAgIC8vICogJFNfZiA9IEYgKyAoU19pIC0gRikga19pL2tfZiQuXG4gICAgLy9cbiAgICAvLyBGaXhlZCBwb2ludCBsb2NhdGlvbiwgJFxcdmVjdG9ye2Z9ID0gKEYgLSBTX2kpIGtfaSQuXG4gICAgLy8gKiAkRiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pICsgKFNfaSAtIFNfaSAtIFxcdmVjdG9ye2Z9L2tfaSkga19pL2tfZiQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pIC0gXFx2ZWN0b3J7Zn0va19mJC5cbiAgICAvLyAqICRTX2Yga19mID0gU19pIGtfZiArIChrX2Yva19pIC0gMSlcXHZlY3RvcntmfSQuXG4gICAgLy8gKiAkU19mIGtfZiA9IChrX2Yva19pKShTX2kga19pKSArIChrX2Yva19pIC0gMSkgXFx2ZWN0b3J7Zn0kLlxuICAgIHZhciBrID0gbGV2ZWwgLyBvbGRMZXZlbDtcbiAgICB2YXIgbGVmdCA9IGsgKiAodGhpcy5fX3Njcm9sbExlZnQgKyBmaXhlZExlZnQpIC0gZml4ZWRMZWZ0O1xuICAgIHZhciB0b3AgPSBrICogKHRoaXMuX19zY3JvbGxUb3AgKyBmaXhlZFRvcCkgLSBmaXhlZFRvcDtcblxuICAgIC8vIExpbWl0IHgtYXhpc1xuICAgIGlmIChsZWZ0ID4gdGhpcy5fX21heFNjcm9sbExlZnQpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICB9IGVsc2UgaWYgKGxlZnQgPCAwKSB7XG4gICAgICBsZWZ0ID0gMDtcbiAgICB9XG5cbiAgICAvLyBMaW1pdCB5LWF4aXNcbiAgICBpZiAodG9wID4gdGhpcy5fX21heFNjcm9sbFRvcCkge1xuICAgICAgdG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9IGVsc2UgaWYgKHRvcCA8IDApIHtcbiAgICAgIHRvcCA9IDA7XG4gICAgfVxuXG4gICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCBsZXZlbCwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBab29tcyB0aGUgY29udGVudCBieSB0aGUgZ2l2ZW4gZmFjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gZmFjdG9yIHtOdW1iZXJ9IFpvb20gYnkgZ2l2ZW4gZmFjdG9yXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gb3JpZ2luTGVmdCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiBsZWZ0IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIG9yaWdpblRvcCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiB0b3AgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21CeShmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdG8gdGhlIGdpdmVuIHBvc2l0aW9uLiBSZXNwZWN0IGxpbWl0YXRpb25zIGFuZCBzbmFwcGluZyBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyP251bGx9IEhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAqIEBwYXJhbSB0b3Age051bWJlcj9udWxsfSBWZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdGhlIHNjcm9sbGluZyBzaG91bGQgaGFwcGVuIHVzaW5nIGFuIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gem9vbSB7TnVtYmVyfSBbMS4wXSBab29tIGxldmVsIHRvIGdvIHRvXG4gICAqL1xuICBzY3JvbGxUbyhsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQsIHpvb20pIHtcbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQ29ycmVjdCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgIGlmICh6b29tICE9PSB1bmRlZmluZWQgJiYgem9vbSAhPT0gdGhpcy5fX3pvb21MZXZlbCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICAgIH1cblxuICAgICAgbGVmdCAqPSB6b29tO1xuICAgICAgdG9wICo9IHpvb207XG5cbiAgICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCh6b29tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gS2VlcCB6b29tIHdoZW4gbm90IGRlZmluZWRcbiAgICAgIHpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1gpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIHRoaXMuX19jbGllbnRXaWR0aCkgKiB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX3NuYXBXaWR0aCkgKiB0aGlzLl9fc25hcFdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kpIHtcbiAgICAgIHRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX2NsaWVudEhlaWdodCkgKiB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fc25hcEhlaWdodCkgKiB0aGlzLl9fc25hcEhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMaW1pdCBmb3IgYWxsb3dlZCByYW5nZXNcbiAgICBsZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbExlZnQsIGxlZnQpLCAwKTtcbiAgICB0b3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsVG9wLCB0b3ApLCAwKTtcblxuICAgIC8vIERvbid0IGFuaW1hdGUgd2hlbiBubyBjaGFuZ2UgZGV0ZWN0ZWQsIHN0aWxsIGNhbGwgcHVibGlzaCB0byBtYWtlIHN1cmVcbiAgICAvLyB0aGF0IHJlbmRlcmVkIHBvc2l0aW9uIGlzIHJlYWxseSBpbi1zeW5jIHdpdGggaW50ZXJuYWwgZGF0YVxuICAgIGlmIChsZWZ0ID09PSB0aGlzLl9fc2Nyb2xsTGVmdCAmJiB0b3AgPT09IHRoaXMuX19zY3JvbGxUb3ApIHtcbiAgICAgIGlzQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQdWJsaXNoIG5ldyB2YWx1ZXNcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xsIGJ5IHRoZSBnaXZlbiBvZmZzZXRcbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSB0b3Age051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgZ2l2ZW4gY2hhbmdlXG4gICAqL1xuICBzY3JvbGxCeShsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQpIHtcbiAgICB2YXIgc3RhcnRMZWZ0ID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZExlZnQgOiB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB2YXIgc3RhcnRUb3AgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkVG9wIDogdGhpcy5fX3Njcm9sbFRvcDtcblxuICAgIHRoaXMuc2Nyb2xsVG8oc3RhcnRMZWZ0ICsgKGxlZnQgfHwgMCksIHN0YXJ0VG9wICsgKHRvcCB8fCAwKSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgRVZFTlQgQ0FMTEJBQ0tTXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIE1vdXNlIHdoZWVsIGhhbmRsZXIgZm9yIHpvb21pbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Nb3VzZVpvb20od2hlZWxEZWx0YSwgdGltZVN0YW1wLCBwYWdlWCwgcGFnZVkpIHtcbiAgICB2YXIgY2hhbmdlID0gd2hlZWxEZWx0YSA+IDAgPyAwLjk3IDogMS4wMztcblxuICAgIHJldHVybiB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogY2hhbmdlLCBmYWxzZSwgcGFnZVggLSB0aGlzLl9fY2xpZW50TGVmdCwgcGFnZVkgLSB0aGlzLl9fY2xpZW50VG9wKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIHN0YXJ0IGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoU3RhcnQodG91Y2hlcywgdGltZVN0YW1wKSB7XG4gICAgLy8gQXJyYXktbGlrZSBjaGVjayBpcyBlbm91Z2ggaGVyZVxuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvdWNoIGxpc3Q6IFwiICsgdG91Y2hlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGludGVycnVwdGVkQW5pbWF0aW9uIGZsYWdcbiAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBTdG9wIGFuaW1hdGlvblxuICAgIGlmICh0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFVzZSBjZW50ZXIgcG9pbnQgd2hlbiBkZWFsaW5nIHdpdGggdHdvIGZpbmdlcnNcbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuICAgIHZhciBpc1NpbmdsZVRvdWNoID0gdG91Y2hlcy5sZW5ndGggPT09IDE7XG4gICAgaWYgKGlzU2luZ2xlVG91Y2gpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluaXRpYWwgcG9zaXRpb25zXG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19pbml0aWFsVG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBTdG9yZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICB0aGlzLl9fem9vbUxldmVsU3RhcnQgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCB0b3VjaCBwb3NpdGlvbnNcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGluaXRpYWwgbW92ZSB0aW1lIHN0YW1wXG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG5cbiAgICAvLyBSZXNldCBpbml0aWFsIHNjYWxlXG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IDE7XG5cbiAgICAvLyBSZXNldCBsb2NraW5nIGZsYWdzXG4gICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWDtcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZO1xuXG4gICAgLy8gUmVzZXQgdHJhY2tpbmcgZmxhZ1xuICAgIHRoaXMuX19pc1RyYWNraW5nID0gdHJ1ZTtcblxuICAgIC8vIFJlc2V0IGRlY2VsZXJhdGlvbiBjb21wbGV0ZSBmbGFnXG4gICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgICAvLyBEcmFnZ2luZyBzdGFydHMgZGlyZWN0bHkgd2l0aCB0d28gZmluZ2Vycywgb3RoZXJ3aXNlIGxhenkgd2l0aCBhbiBvZmZzZXRcbiAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICFpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gU29tZSBmZWF0dXJlcyBhcmUgZGlzYWJsZWQgaW4gbXVsdGkgdG91Y2ggc2NlbmFyaW9zXG4gICAgdGhpcy5fX2lzU2luZ2xlVG91Y2ggPSBpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gQ2xlYXJpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICB0aGlzLl9fcG9zaXRpb25zID0gW107XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBtb3ZlIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbMS4wXSBzY2FsZSAtIC4uLi5cbiAgICovXG4gIGRvVG91Y2hNb3ZlKHRvdWNoZXMsIHRpbWVTdGFtcCwgc2NhbGUpIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKGV2ZW50IG1pZ2h0IGJlIG91dHNpZGUgb2YgZWxlbWVudClcbiAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIENvbXB1dGUgbW92ZSBiYXNlZCBhcm91bmQgb2YgY2VudGVyIG9mIGZpbmdlcnNcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cblxuICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuXG4gICAgLy8gQXJlIHdlIGFscmVhZHkgaXMgZHJhZ2dpbmcgbW9kZT9cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIENvbXB1dGUgbW92ZSBkaXN0YW5jZVxuICAgICAgdmFyIG1vdmVYID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19sYXN0VG91Y2hMZWZ0O1xuICAgICAgdmFyIG1vdmVZID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2xhc3RUb3VjaFRvcDtcblxuICAgICAgLy8gUmVhZCBwcmV2aW91cyBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmdcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBsZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgIC8vIFdvcmsgd2l0aCBzY2FsaW5nXG4gICAgICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB2YXIgb2xkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAvLyBSZWNvbXB1dGUgbGV2ZWwgYmFzZWQgb24gcHJldmlvdXMgc2NhbGUgYW5kIG5ldyBzY2FsZVxuICAgICAgICBsZXZlbCA9IGxldmVsIC8gdGhpcy5fX2xhc3RTY2FsZSAqIHNjYWxlO1xuXG4gICAgICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgICAgIC8vIE9ubHkgZG8gZnVydGhlciBjb21wdXRpb24gd2hlbiBjaGFuZ2UgaGFwcGVuZWRcbiAgICAgICAgaWYgKG9sZExldmVsICE9PSBsZXZlbCkge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgZXZlbnQgcG9zaXRpb24gdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnRSZWwgPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2NsaWVudExlZnQ7XG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaFRvcFJlbCA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19jbGllbnRUb3A7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgICAgICAgc2Nyb2xsTGVmdCA9ICgoY3VycmVudFRvdWNoTGVmdFJlbCArIHNjcm9sbExlZnQpICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hMZWZ0UmVsO1xuICAgICAgICAgIHNjcm9sbFRvcCA9ICgoY3VycmVudFRvdWNoVG9wUmVsICsgc2Nyb2xsVG9wKSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoVG9wUmVsO1xuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIG1heCBzY3JvbGwgdmFsdWVzXG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCkge1xuICAgICAgICBzY3JvbGxMZWZ0IC09IG1vdmVYICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQgfHwgc2Nyb2xsTGVmdCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCArPSAobW92ZVggLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IG1heFNjcm9sbExlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb21wdXRlIG5ldyB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWSkge1xuICAgICAgICBzY3JvbGxUb3AgLT0gbW92ZVkgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtb3ZlWSlcbiAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCB8fCBzY3JvbGxUb3AgPCAwKSB7XG4gICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCArPSAobW92ZVkgLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IG1heFNjcm9sbFRvcDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gS2VlcCBsaXN0IGZyb20gZ3Jvd2luZyBpbmZpbml0ZWx5IChob2xkaW5nIG1pbiAxMCwgbWF4IDIwIG1lYXN1cmUgcG9pbnRzKVxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPiA2MCkge1xuICAgICAgICBwb3NpdGlvbnMuc3BsaWNlKDAsIDMwKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHJhY2sgc2Nyb2xsIG1vdmVtZW50IGZvciBkZWNsZXJhdGlvblxuICAgICAgcG9zaXRpb25zLnB1c2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICAvLyBTeW5jIHNjcm9sbCBwb3NpdGlvblxuICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCBsZXZlbCk7XG5cbiAgICAgIC8vIE90aGVyd2lzZSBmaWd1cmUgb3V0IHdoZXRoZXIgd2UgYXJlIHN3aXRjaGluZyBpbnRvIGRyYWdnaW5nIG1vZGUgbm93LlxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsID0gdGhpcy5vcHRpb25zLmxvY2tpbmcgPyAzIDogMDtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnID0gNTtcblxuICAgICAgdmFyIGRpc3RhbmNlWCA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCk7XG4gICAgICB2YXIgZGlzdGFuY2VZID0gTWF0aC5hYnMoY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2luaXRpYWxUb3VjaFRvcCk7XG5cbiAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1ggJiYgZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcbiAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kgJiYgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcblxuICAgICAgcG9zaXRpb25zLnB1c2godGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gKHRoaXMuX19lbmFibGVTY3JvbGxYIHx8IHRoaXMuX19lbmFibGVTY3JvbGxZKSAmJiAoZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcgfHwgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcpO1xuICAgICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsYXN0IHRvdWNoIHBvc2l0aW9ucyBhbmQgdGltZSBzdGFtcCBmb3IgbmV4dCBldmVudFxuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuICAgIHRoaXMuX19sYXN0VG91Y2hNb3ZlID0gdGltZVN0YW1wO1xuICAgIHRoaXMuX19sYXN0U2NhbGUgPSBzY2FsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIGVuZCBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Ub3VjaEVuZCh0aW1lU3RhbXApIHtcbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKG5vIHRvdWNoc3RhcnQgZXZlbnQgb24gZWxlbWVudClcbiAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGFzIHRoaXMgbGlzdGVuZXIgKCd0b3VjaG1vdmUnKSBzaXRzIG9uIHRoZSBkb2N1bWVudCBhbmQgbm90IG9uIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90IHRvdWNoaW5nIGFueW1vcmUgKHdoZW4gdHdvIGZpbmdlciBoaXQgdGhlIHNjcmVlbiB0aGVyZSBhcmUgdHdvIHRvdWNoIGVuZCBldmVudHMpXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAgIC8vIEJlIHN1cmUgdG8gcmVzZXQgdGhlIGRyYWdnaW5nIGZsYWcgbm93LiBIZXJlIHdlIGFsc28gZGV0ZWN0IHdoZXRoZXJcbiAgICAvLyB0aGUgZmluZ2VyIGhhcyBtb3ZlZCBmYXN0IGVub3VnaCB0byBzd2l0Y2ggaW50byBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24uXG4gICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAvLyBSZXNldCBkcmFnZ2luZyBmbGFnXG4gICAgICB0aGlzLl9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICAvLyBTdGFydCBkZWNlbGVyYXRpb25cbiAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBsYXN0IG1vdmUgZGV0ZWN0ZWQgd2FzIGluIHNvbWUgcmVsZXZhbnQgdGltZSBmcmFtZVxuICAgICAgaWYgKHRoaXMuX19pc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5hbmltYXRpbmcgJiYgKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA8PSAxMDApIHtcbiAgICAgICAgLy8gVGhlbiBmaWd1cmUgb3V0IHdoYXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB3YXMgYWJvdXQgMTAwbXMgYWdvXG4gICAgICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuICAgICAgICB2YXIgZW5kUG9zID0gcG9zaXRpb25zLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IGVuZFBvcztcblxuICAgICAgICAvLyBNb3ZlIHBvaW50ZXIgdG8gcG9zaXRpb24gbWVhc3VyZWQgMTAwbXMgYWdvXG4gICAgICAgIGZvciAodmFyIGkgPSBlbmRQb3M7IGkgPiAwICYmIHBvc2l0aW9uc1tpXSA+ICh0aGlzLl9fbGFzdFRvdWNoTW92ZSAtIDEwMCk7IGkgLT0gMykge1xuICAgICAgICAgIHN0YXJ0UG9zID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHN0YXJ0IGFuZCBzdG9wIHBvc2l0aW9uIGlzIGlkZW50aWNhbCBpbiBhIDEwMG1zIHRpbWVmcmFtZSxcbiAgICAgICAgLy8gd2UgY2Fubm90IGNvbXB1dGUgYW55IHVzZWZ1bCBkZWNlbGVyYXRpb24uXG4gICAgICAgIGlmIChzdGFydFBvcyAhPT0gZW5kUG9zKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBtb3ZlbWVudCBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcbiAgICAgICAgICB2YXIgdGltZU9mZnNldCA9IHBvc2l0aW9uc1tlbmRQb3NdIC0gcG9zaXRpb25zW3N0YXJ0UG9zXTtcbiAgICAgICAgICB2YXIgbW92ZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAyXTtcbiAgICAgICAgICB2YXIgbW92ZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wIC0gcG9zaXRpb25zW3N0YXJ0UG9zIC0gMV07XG5cbiAgICAgICAgICAvLyBCYXNlZCBvbiA1MG1zIGNvbXB1dGUgdGhlIG1vdmVtZW50IHRvIGFwcGx5IGZvciBlYWNoIHJlbmRlciBzdGVwXG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG1vdmVkTGVmdCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbW92ZWRUb3AgLyB0aW1lT2Zmc2V0ICogKDEwMDAgLyA2MCk7XG5cbiAgICAgICAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBzdGFydCB0aGUgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgdmFyIG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wYWdpbmcgfHwgdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDE7XG5cbiAgICAgICAgICAvLyBWZXJpZnkgdGhhdCB3ZSBoYXZlIGVub3VnaCB2ZWxvY2l0eSB0byBzdGFydCBkZWNlbGVyYXRpb25cbiAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX19zdGFydERlY2VsZXJhdGlvbih0aW1lU3RhbXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpID4gMTAwKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoaXMgd2FzIGEgc2xvd2VyIG1vdmUgaXQgaXMgcGVyIGRlZmF1bHQgbm9uIGRlY2VsZXJhdGVkLCBidXQgdGhpc1xuICAgIC8vIHN0aWxsIG1lYW5zIHRoYXQgd2Ugd2FudCBzbmFwIGJhY2sgdG8gdGhlIGJvdW5kcyB3aGljaCBpcyBkb25lIGhlcmUuXG4gICAgLy8gVGhpcyBpcyBwbGFjZWQgb3V0c2lkZSB0aGUgY29uZGl0aW9uIGFib3ZlIHRvIGltcHJvdmUgZWRnZSBjYXNlIHN0YWJpbGl0eVxuICAgIC8vIGUuZy4gdG91Y2hlbmQgZmlyZWQgd2l0aG91dCBlbmFibGVkIGRyYWdnaW5nLiBUaGlzIHNob3VsZCBub3JtYWxseSBkbyBub3RcbiAgICAvLyBoYXZlIG1vZGlmaWVkIHRoZSBzY3JvbGwgcG9zaXRpb25zIG9yIGV2ZW4gc2hvd2VkIHRoZSBzY3JvbGxiYXJzIHRob3VnaC5cbiAgICBpZiAoIXRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgaWYgKHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiB8fCB0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgIH1cblxuICAgIC8vIEZ1bGx5IGNsZWFudXAgbGlzdFxuICAgIHRoaXMuX19wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgUFJJVkFURSBBUElcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBjb250ZW50IGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlcn0gTGVmdCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyfSBUb3Agc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIGFuaW1hdGlvbiBzaG91bGQgYmUgdXNlZCB0byBtb3ZlIHRvIHRoZSBuZXcgY29vcmRpbmF0ZXNcbiAgICovXG4gIF9fcHVibGlzaChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpIHtcbiAgICAvLyBSZW1lbWJlciB3aGV0aGVyIHdlIGhhZCBhbiBhbmltYXRpb24sIHRoZW4gd2UgdHJ5IHRvIGNvbnRpbnVlXG4gICAgLy8gYmFzZWQgb24gdGhlIGN1cnJlbnQgXCJkcml2ZVwiIG9mIHRoZSBhbmltYXRpb24uXG4gICAgdmFyIHdhc0FuaW1hdGluZyA9IHRoaXMuX19pc0FuaW1hdGluZztcbiAgICBpZiAod2FzQW5pbWF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3Aod2FzQW5pbWF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0FuaW1hdGVkICYmIHRoaXMub3B0aW9ucy5hbmltYXRpbmcpIHtcbiAgICAgIC8vIEtlZXAgc2NoZWR1bGVkIHBvc2l0aW9ucyBmb3Igc2Nyb2xsQnkvem9vbUJ5IGZ1bmN0aW9uYWxpdHkuXG4gICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdG9wO1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB6b29tO1xuXG4gICAgICB2YXIgb2xkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgdmFyIG9sZFRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgICB2YXIgb2xkWm9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgIHZhciBkaWZmTGVmdCA9IGxlZnQgLSBvbGRMZWZ0O1xuICAgICAgdmFyIGRpZmZUb3AgPSB0b3AgLSBvbGRUb3A7XG4gICAgICB2YXIgZGlmZlpvb20gPSB6b29tIC0gb2xkWm9vbTtcblxuICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgICAgaWYgKHJlbmRlcikge1xuICAgICAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gb2xkTGVmdCArIChkaWZmTGVmdCAqIHBlcmNlbnQpO1xuICAgICAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBvbGRUb3AgKyAoZGlmZlRvcCAqIHBlcmNlbnQpO1xuICAgICAgICAgIHRoaXMuX196b29tTGV2ZWwgPSBvbGRab29tICsgKGRpZmZab29tICogcGVyY2VudCk7XG5cbiAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9fY2FsbGJhY2sodGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9faXNBbmltYXRpbmcgPT09IGlkO1xuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbklkID09PSB0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlIHx8IHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICAgIGlmICh0aGlzLl9fem9vbUNvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgLy8gV2hlbiBjb250aW51aW5nIGJhc2VkIG9uIHByZXZpb3VzIGFuaW1hdGlvbiB3ZSBjaG9vc2UgYW4gZWFzZS1vdXQgYW5pbWF0aW9uIGluc3RlYWQgb2YgZWFzZS1pbi1vdXRcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQsIHRoaXMub3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbiwgd2FzQW5pbWF0aW5nID8gZWFzZU91dEN1YmljIDogZWFzZUluT3V0Q3ViaWMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgPSBsZWZ0O1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHRoaXMuX196b29tTGV2ZWwgPSB6b29tO1xuXG4gICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fX2NhbGxiYWNrKGxlZnQsIHRvcCwgem9vbSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpeCBtYXggc2Nyb2xsIHJhbmdlc1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgIGlmICh0aGlzLl9fem9vbUNvbXBsZXRlKSB7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVjb21wdXRlcyBzY3JvbGwgbWluaW11bSB2YWx1ZXMgYmFzZWQgb24gY2xpZW50IGRpbWVuc2lvbnMgYW5kIGNvbnRlbnQgZGltZW5zaW9ucy5cbiAgICovXG4gIF9fY29tcHV0ZVNjcm9sbE1heCh6b29tTGV2ZWwpIHtcbiAgICBpZiAoem9vbUxldmVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHpvb21MZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgdGhpcy5fX21heFNjcm9sbExlZnQgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudFdpZHRoICogem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudFdpZHRoLCAwKTtcbiAgICB0aGlzLl9fbWF4U2Nyb2xsVG9wID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRIZWlnaHQgKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50SGVpZ2h0LCAwKTtcbiAgfVxuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIEFOSU1BVElPTiAoREVDRUxFUkFUSU9OKSBTVVBQT1JUXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgdG91Y2ggc2VxdWVuY2UgZW5kIGFuZCB0aGUgc3BlZWQgb2YgdGhlIGZpbmdlciB3YXMgaGlnaCBlbm91Z2hcbiAgICogdG8gc3dpdGNoIGludG8gZGVjZWxlcmF0aW9uIG1vZGUuXG4gICAqL1xuICBfX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fbWF4U2Nyb2xsTGVmdCksIDApO1xuICAgICAgdmFyIHNjcm9sbFRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX19tYXhTY3JvbGxUb3ApLCAwKTtcbiAgICAgIHZhciBjbGllbnRXaWR0aCA9IHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIHZhciBjbGllbnRIZWlnaHQgPSB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuXG4gICAgICAvLyBXZSBsaW1pdCBkZWNlbGVyYXRpb24gbm90IHRvIHRoZSBtaW4vbWF4IHZhbHVlcyBvZiB0aGUgYWxsb3dlZCByYW5nZSwgYnV0IHRvIHRoZSBzaXplIG9mIHRoZSB2aXNpYmxlIGNsaWVudCBhcmVhLlxuICAgICAgLy8gRWFjaCBwYWdlIHNob3VsZCBoYXZlIGV4YWN0bHkgdGhlIHNpemUgb2YgdGhlIGNsaWVudCBhcmVhLlxuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmZsb29yKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmZsb29yKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguY2VpbChzY3JvbGxMZWZ0IC8gY2xpZW50V2lkdGgpICogY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5jZWlsKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gMDtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIFdyYXAgY2xhc3MgbWV0aG9kXG4gICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgIHRoaXMuX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIGtlZXAgdGhlIGRlY2VsZXJhdGlvbiBydW5uaW5nXG4gICAgdmFyIG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nID0gdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDAuMTtcblxuICAgIC8vIERldGVjdCB3aGV0aGVyIGl0J3Mgc3RpbGwgd29ydGggdG8gY29udGludWUgYW5pbWF0aW5nIHN0ZXBzXG4gICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgc2xvdyBlbm91Z2ggdG8gbm90IGJlaW5nIHVzZXIgcGVyY2VpdmFibGUgYW55bW9yZSwgd2Ugc3RvcCB0aGUgd2hvbGUgcHJvY2VzcyBoZXJlLlxuICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hvdWxkQ29udGludWUgPSBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+PSBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+PSBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZztcbiAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaG91bGRDb250aW51ZTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQW5pbWF0ZSB0byBncmlkIHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlLCBvdGhlcndpc2UganVzdCBmaXggb3V0LW9mLWJvdW5kYXJ5IHBvc2l0aW9uc1xuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5vcHRpb25zLnNuYXBwaW5nKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBTdGFydCBhbmltYXRpb24gYW5kIHN3aXRjaCBvbiBmbGFnXG4gICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDYWxsZWQgb24gZXZlcnkgc3RlcCBvZiB0aGUgYW5pbWF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBpbk1lbW9yeSB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0byBub3QgcmVuZGVyIHRoZSBjdXJyZW50IHN0ZXAsIGJ1dCBrZWVwIGl0IGluIG1lbW9yeSBvbmx5LiBVc2VkIGludGVybmFsbHkgb25seSFcbiAgICovXG4gIF9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKSB7XG5cbiAgICAvL1xuICAgIC8vIENPTVBVVEUgTkVYVCBTQ1JPTEwgUE9TSVRJT05cbiAgICAvL1xuXG4gICAgLy8gQWRkIGRlY2VsZXJhdGlvbiB0byBzY3JvbGwgcG9zaXRpb25cbiAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WDtcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVk7XG5cblxuICAgIC8vXG4gICAgLy8gSEFSRCBMSU1JVCBTQ1JPTEwgUE9TSVRJT04gRk9SIE5PTiBCT1VOQ0lORyBNT0RFXG4gICAgLy9cblxuICAgIGlmICghdGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsTGVmdEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQsIHNjcm9sbExlZnQpLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCk7XG4gICAgICBpZiAoc2Nyb2xsTGVmdEZpeGVkICE9PSBzY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0Rml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2Nyb2xsVG9wRml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wLCBzY3JvbGxUb3ApLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKTtcbiAgICAgIGlmIChzY3JvbGxUb3BGaXhlZCAhPT0gc2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHNjcm9sbFRvcEZpeGVkO1xuICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gMDtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gVVBEQVRFIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICBpZiAocmVuZGVyKSB7XG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBTTE9XIERPV05cbiAgICAvL1xuXG4gICAgLy8gU2xvdyBkb3duIHZlbG9jaXR5IG9uIGV2ZXJ5IGl0ZXJhdGlvblxuICAgIGlmICghdGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gZXZlcnkgaXRlcmF0aW9uIG9mIHRoZSBhbmltYXRpb25cbiAgICAgIC8vIHRvIHNsb3cgZG93biB0aGUgcHJvY2Vzcy4gVGhpcyBzaG91bGQgZW11bGF0ZSBuYXR1cmFsIGJlaGF2aW9yIHdoZXJlXG4gICAgICAvLyBvYmplY3RzIHNsb3cgZG93biB3aGVuIHRoZSBpbml0aWF0b3Igb2YgdGhlIG1vdmVtZW50IGlzIHJlbW92ZWRcbiAgICAgIHZhciBmcmljdGlvbkZhY3RvciA9IDAuOTU7XG5cbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBCT1VOQ0lORyBTVVBQT1JUXG4gICAgLy9cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWCA9IDA7XG4gICAgICB2YXIgc2Nyb2xsT3V0c2lkZVkgPSAwO1xuXG4gICAgICAvLyBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24vYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllc1xuICAgICAgdmFyIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgdmFyIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuXG4gICAgICAvLyBDaGVjayBsaW1pdHNcbiAgICAgIGlmIChzY3JvbGxMZWZ0IDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbFRvcCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxUb3AgPiB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIH1cblxuICAgICAgLy8gU2xvdyBkb3duIHVudGlsIHNsb3cgZW5vdWdoLCB0aGVuIGZsaXAgYmFjayB0byBzbmFwIHBvc2l0aW9uXG4gICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggIT09IDApIHtcbiAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCArPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZICs9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGVudiBmcm9tICcuL2Vudic7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2NvbXBvbmVudHMvZWxlbWVudHMnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCBjb21wdXRlTGF5b3V0IGZyb20gJ2Nzcy1sYXlvdXQnO1xuaW1wb3J0IHsgaXNDbGljaywgU1RBVEUsIGNsZWFyQ2FudmFzLCBpc0dhbWVUb3VjaEV2ZW50IH0gZnJvbSAnLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgcGFyc2VyIGZyb20gJy4vbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IERlYnVnSW5mbyBmcm9tICcuL2NvbW1vbi9kZWJ1Z0luZm8nO1xuaW1wb3J0IFRpY2tlciBmcm9tICcuL2NvbW1vbi90aWNrZXInO1xuaW1wb3J0IHsgY3JlYXRlLCByZW5kZXJDaGlsZHJlbiwgbGF5b3V0Q2hpbGRyZW4sIHJlcGFpbnRDaGlsZHJlbiwgaXRlcmF0ZVRyZWUsIGNsb25lLCByZWdpc3RlckNvbXBvbmVudCB9IGZyb20gJy4vY29tbW9uL3ZkJztcbmltcG9ydCBSZWN0IGZyb20gJy4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50LCBDYWxsYmFjaywgVHJlZU5vZGUgfSBmcm9tICcuL3R5cGVzL2luZGV4JztcblxuLy8g5YWo5bGA5LqL5Lu2566h6YGTXG5jb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlci5UaW55RW1pdHRlcigpO1xuY29uc3QgaW1nUG9vbCA9IG5ldyBQb29sKCdpbWdQb29sJyk7XG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2woJ2JpdE1hcFBvb2wnKTtcbmNvbnN0IGRlYnVnSW5mbyA9IG5ldyBEZWJ1Z0luZm8oKTtcblxuaW50ZXJmYWNlIElWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVZpZXdQb3J0Qm94IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVyRGF0YSB7XG4gIGhhc0V2ZW50QmluZDogYm9vbGVhbjtcbiAgdG91Y2hNc2c6IHtcbiAgICBba2V5OiBzdHJpbmddOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB9O1xuICBoYW5kbGVyczoge1xuICAgIHRvdWNoU3RhcnQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hNb3ZlOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoRW5kOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoQ2FuY2VsOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgSVBsdWdpbjxUPiB7XG4gIG5hbWU6IHN0cmluZztcbiAgaW5zdGFsbDogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG4gIHVuaW5zdGFsbD86IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIOm7mOiupOaatOmcsiBMYXlvdXQg55qE5a6e5L6L77yM5L2G5Zyo5p+Q5Lqb5Zy65pmv5LiL77yM5Y+v6IO96ZyA6KaB5aSa5LiqIExheW91dCDlrp7kvovvvIzlm6DmraQgTGF5b3V0IOexu+S5n+aatOmcsuWHuuWOu1xuICogY29uc3QgbXlMYXlvdXQgPSBuZXcgTGF5b3V0KHtcbiAqICAgc3R5bGU6IHtcbiAqICAgICAgd2lkdGg6IDAsXG4gKiAgICAgIGhlaWdodDogMCxcbiAqICAgfSxcbiAqICBuYW1lOiAnbXlMYXlvdXROYW1lJyxcbiAqIH0pO1xuICovXG5jbGFzcyBMYXlvdXQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOW9k+WJjSBMYXlvdXQg54mI5pys77yM5LiA6Iis6Lef5bCP5ri45oiP5o+S5Lu254mI5pys5a+56b2QXG4gICAqL1xuICBwdWJsaWMgdmVyc2lvbiA9ICcxLjAuMTMnO1xuXG4gIGVudiA9IGVudjtcblxuICAvKipcbiAgICogTGF5b3V0IOa4suafk+eahOebruagh+eUu+W4g+WvueW6lOeahCAyZCBjb250ZXh0XG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZW5kZXJwb3J0OiBJVmlld1BvcnQgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnQ6IElWaWV3UG9ydEJveCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuXG4gIC8qKlxuICAgKiDnlLvluIPlsLrlr7jlkozlrp7pmYXooqvmuLLmn5PliLDlsY/luZXnmoTniannkIblsLrlr7jmr5RcbiAgICovXG4gIHB1YmxpYyB2aWV3cG9ydFNjYWxlID0gMTtcbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhnVwZGF0ZVZpZXdQb3J05pa55rOV5piv5ZCm6KKr6LCD55So6L+H5LqG77yM6L+Z5Zyo5bCP5ri45oiP546v5aKD6Z2e5bi46YeN6KaBXG4gICAqL1xuICBwdWJsaWMgaGFzVmlld1BvcnRTZXQgPSBmYWxzZTtcblxuICAvKipcbiAgICog5pyA57uI5riy5p+T5Yiw5bGP5bmV55qE5bem5LiK6KeS54mp55CG5Z2Q5qCHXG4gICAqL1xuICBwdWJsaWMgcmVhbExheW91dEJveDoge1xuICAgIHJlYWxYOiBudW1iZXI7XG4gICAgcmVhbFk6IG51bWJlcjtcbiAgfSA9IHtcbiAgICAgIHJlYWxYOiAwLFxuICAgICAgcmVhbFk6IDAsXG4gICAgfTtcblxuICBwdWJsaWMgYml0TWFwRm9udHM6IEJpdE1hcEZvbnRbXSA9IFtdO1xuICBwdWJsaWMgZWxlQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhdGU6IFNUQVRFID0gU1RBVEUuVU5JTklUO1xuXG4gIC8qKlxuICAgKiDnlKjkuo7lnKggdGlja2VyIOeahOW+queOr+mHjOmdouagh+ivhuW9k+WJjeW4p+aYr+WQpumcgOimgemHjee7mFxuICAgKiDph43nu5jkuIDoiKzmmK/lm77niYfliqDovb3lrozmiJDjgIHmloflrZfkv67mlLnnrYnlnLrmma9cbiAgICovXG4gIHB1YmxpYyBpc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gIHB1YmxpYyB0aWNrZXI6IFRpY2tlciA9IG5ldyBUaWNrZXIoKTtcbiAgcHVibGljIHRpY2tlckZ1bmMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuaXNEaXJ0eSkge1xuICAgICAgLy8gY29uc29sZS5sb2coJ2JlZm9yZV9yZWZsb3cnKVxuICAgICAgdGhpcy5lbWl0KCdiZWZvcmVfcmVmbG93JywgJycpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNOZWVkUmVwYWludCkge1xuICAgICAgdGhpcy5yZXBhaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHB1YmxpYyBzdHlsZVNoZWV0OiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+ID0ge31cblxuICBwcml2YXRlIGV2ZW50SGFuZGxlckRhdGE6IEV2ZW50SGFuZGxlckRhdGE7XG5cbiAgcHJvdGVjdGVkIGFjdGl2ZUVsZW1lbnRzOiBFbGVtZW50W10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUsXG4gIH06IHtcbiAgICBzdHlsZT86IElTdHlsZTtcbiAgICBuYW1lPzogc3RyaW5nO1xuICB9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgICBpZDogMCxcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YSA9IHtcbiAgICAgIGhhc0V2ZW50QmluZDogZmFsc2UsXG4gICAgICB0b3VjaE1zZzoge30sXG4gICAgICBoYW5kbGVyczoge1xuICAgICAgICB0b3VjaFN0YXJ0OiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hzdGFydCcpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoTW92ZTogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNobW92ZScpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoRW5kOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hlbmQnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaENhbmNlbDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoY2FuY2VsJykuYmluZCh0aGlzKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOWvueS6juS4jeS8muW9seWTjeW4g+WxgOeahOaUueWKqO+8jOavlOWmguWbvueJh+WPquaYr+aUueS4quWcsOWdgOOAgeWKoOS4quiDjOaZr+iJsuS5i+exu+eahOaUueWKqO+8jOS8muinpuWPkSBMYXlvdXQg55qEIHJlcGFpbnQg5pON5L2cXG4gICAgICog6Kem5Y+R55qE5pa55byP5piv57uZIExheW91dCDmipvkuKogYHJlcGFpbnRgIOeahOS6i+S7tu+8jOS4uuS6huaAp+iDve+8jOavj+asoeaOpeaUtuWIsCByZXBhaW50IOivt+axguS4jeS8muaJp+ihjOecn+ato+eahOa4suafk1xuICAgICAqIOiAjOaYr+aJp+ihjOS4gOS4que9ruiEj+aTjeS9nO+8jHRpY2tlciDmr4/kuIDmrKHmiafooYwgdXBkYXRlIOS8muajgOafpei/meS4quagh+iusOS9je+8jOi/m+iAjOaJp+ihjOecn+ato+eahOmHjee7mOaTjeS9nFxuICAgICAqL1xuICAgIHRoaXMub24oJ3JlcGFpbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5bCGIFR3ZWVuIOaMgui9veWIsCBMYXlvdXTvvIzlr7nkuo4gVHdlZW4g55qE5L2/55So5a6M5YWo6YG15b6qIFR3ZWVuLmpzIOeahOaWh+aho1xuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL1xuICAgICAqIOWPquS4jei/h+W9kyBUd2VlbiDmlLnliqjkuoboioLngrnkvJrop6blj5EgcmVwYWludOOAgXJlZmxvdyDnmoTlsZ7mgKfml7bvvIxMYXlvdXQg5Lya5omn6KGM55u45bqU55qE5pON5L2cXG4gICAgICog5Lia5Yqh5L6n5LiN55So5oSf55+l5YiwIHJlcGFpbnQg5ZKMIHJlZmxvd1xuICAgICAqL1xuICAgIC8vIHRoaXMuVFdFRU4gPSBUV0VFTjtcbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0gdiR7dGhpcy52ZXJzaW9ufWApO1xuICB9XG5cbiAgLy8g5LiO6ICB54mI5pys5YW85a65XG4gIGdldCBkZWJ1Z0luZm8oKSB7XG4gICAgbGV0IGluZm8gPSBkZWJ1Z0luZm8ubG9nKCk7XG5cbiAgICBpbmZvICs9IGBlbGVtZW50Q291bnQ6ICR7dGhpcy5lbGVDb3VudH1cXG5gO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICAvKipcbiAgICog5pu05paw6KKr57uY5Yi2Y2FudmFz55qE56qX5Y+j5L+h5oGv77yM5pys5riy5p+T5byV5pOO5bm25LiN5YWz5b+D5piv5ZCm5Lya5ZKM5YW25LuW5ri45oiP5byV5pOO5YWx5ZCM5L2/55SoXG4gICAqIOiAjOacrOi6q+WPiOmcgOimgeaUr+aMgeS6i+S7tuWkhOeQhu+8jOWboOatpO+8jOWmguaenOiiq+a4suafk+WGheWuueaYr+e7mOWItuWIsOemu+Wxj2NhbnZhc++8jOmcgOimgeWwhuacgOe7iOe7mOWItuWcqOWxj+W5leS4ilxuICAgKiDnmoTnu53lr7nlsLrlr7jlkozkvY3nva7kv6Hmga/mm7TmlrDliLDmnKzmuLLmn5PlvJXmk47jgIJcbiAgICog5YW25Lit77yMd2lkdGjkuLrniannkIblg4/ntKDlrr3luqbvvIxoZWlnaHTkuLrniannkIblg4/ntKDpq5jluqbvvIx45Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgeOWdkOagh++8jHnkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKBcbiAgICogeeWdkOagh1xuICAgKi9cbiAgdXBkYXRlVmlld1BvcnQoYm94OiBJVmlld1BvcnRCb3gpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gYm94LndpZHRoIHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBib3guaGVpZ2h0IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gYm94LnggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSBib3gueSB8fCAwO1xuXG4gICAgdGhpcy5yZWFsTGF5b3V0Qm94ID0ge1xuICAgICAgcmVhbFg6IHRoaXMudmlld3BvcnQueCxcbiAgICAgIHJlYWxZOiB0aGlzLnZpZXdwb3J0LnksXG4gICAgfTtcblxuICAgIHRoaXMuaGFzVmlld1BvcnRTZXQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yPzogQ2FsbGJhY2spIHtcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXQnKTtcblxuICAgIGNvbnN0IGVsZW1lbnRBcnJheSA9IHRoaXMuaW5zZXJ0RWxlbWVudEFycmF5KHRlbXBsYXRlLCBzdHlsZSwgYXR0clZhbHVlUHJvY2Vzc29yLCB0cnVlKTtcblxuICAgIHRoaXMuYWRkKGVsZW1lbnRBcnJheVswXSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuSU5JVEVEO1xuXG4gICAgdGhpcy50aWNrZXIuYWRkKHRoaXMudGlja2VyRnVuYywgdHJ1ZSk7XG4gICAgdGhpcy50aWNrZXIuc3RhcnQoKTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXQnKTtcbiAgfVxuXG4gIHJlZmxvdyhpc0ZpcnN0ID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzRmlyc3QpIHtcbiAgICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X3JlZmxvdycpO1xuICAgIC8qKlxuICAgICAqIOiuoeeul+W4g+WxgOagkVxuICAgICAqIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGvXG4gICAgICogTGF5b3V05pys6Lqr5bm25LiN5L2c5Li65biD5bGA6K6h566X77yM5Y+q5piv5L2c5Li66IqC54K55qCR55qE5a655ZmoXG4gICAgICovXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdjb21wdXRlTGF5b3V0JywgdHJ1ZSk7XG4gICAgY29tcHV0ZUxheW91dCh0aGlzLmNoaWxkcmVuWzBdKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdjb21wdXRlTGF5b3V0Jyk7XG5cbiAgICBjb25zdCByb290RWxlID0gdGhpcy5jaGlsZHJlblswXTtcblxuICAgIGlmIChyb290RWxlLnN0eWxlLndpZHRoID09PSB1bmRlZmluZWQgfHwgcm9vdEVsZS5zdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIHNldCB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnR5IGZvciByb290IGVsZW1lbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LndpZHRoID0gcm9vdEVsZS5zdHlsZS53aWR0aDtcbiAgICAgIHRoaXMucmVuZGVycG9ydC5oZWlnaHQgPSByb290RWxlLnN0eWxlLmhlaWdodDtcbiAgICB9XG5cbiAgICAvLyDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dENoaWxkcmVuJywgdHJ1ZSk7XG4gICAgbGF5b3V0Q2hpbGRyZW4odGhpcyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Q2hpbGRyZW4nKTtcblxuICAgIHRoaXMudmlld3BvcnRTY2FsZSA9IHRoaXMudmlld3BvcnQud2lkdGggLyB0aGlzLnJlbmRlcnBvcnQud2lkdGg7XG5cbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIC8vIOmBjeWOhuiKgueCueagke+8jOS+neasoeiwg+eUqOiKgueCueeahOa4suafk+aOpeWPo+WunueOsOa4suafk1xuICAgIGRlYnVnSW5mby5zdGFydCgncmVuZGVyQ2hpbGRyZW4nLCB0cnVlKTtcbiAgICByZW5kZXJDaGlsZHJlbih0aGlzLmNoaWxkcmVuLCB0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBmYWxzZSk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVuZGVyQ2hpbGRyZW4nKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgncmVwYWludCcsIHRydWUpO1xuICAgIHRoaXMucmVwYWludCgpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlcGFpbnQnKTtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcblxuICAgIC8vIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIChlbGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVsZS5wcm9wcyk7XG4gICAgLy8gfSk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfcmVmbG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdOmYtuauteaguOW/g+S7heS7heaYr+agueaNrnhtbOWSjGNzc+WIm+W7uuS6huiKgueCueagkVxuICAgKiDopoHlrp7njrDnnJ/mraPnmoTmuLLmn5PvvIzpnIDopoHosIPnlKggbGF5b3V0IOWHveaVsO+8jOS5i+aJgOS7peWwhiBsYXlvdXQg5Y2V54us5oq96LGh5Li65LiA5Liq5Ye95pWw77yM5piv5Zug5Li6IGxheW91dCDlupTlvZPmmK/lj6/ku6Xph43lpI3osIPnlKjnmoRcbiAgICog5q+U5aaC5pS55Y+Y5LqG5LiA5Liq5YWD57Sg55qE5bC65a+477yM5a6e6ZmF5LiK6IqC54K55qCR5piv5rKh5Y+Y55qE77yM5LuF5LuF5piv6ZyA6KaB6YeN5paw6K6h566X5biD5bGA77yM54S25ZCO5riy5p+TXG4gICAqIOS4gOS4quWujOaVtOeahCBsYXlvdXQg5YiG5oiQ5LiL6Z2i55qE5Yeg5q2l77yaXG4gICAqIDEuIOaJp+ihjOeUu+W4g+a4heeQhu+8jOWboOS4uuW4g+WxgOWPmOWMlumhtemdoumcgOimgemHjee7mO+8jOi/memHjOayoeacieWBmuW+iOmrmOe6p+eahOWJlOmZpOetieaTjeS9nO+8jOS4gOW+i+a4hemZpOmHjeeUu++8jOWunumZheS4iuaAp+iDveW3sue7j+W+iOWlvVxuICAgKiAyLiDoioLngrnmoJHpg73lkKvmnIkgc3R5bGUg5bGe5oCn77yMY3NzLWxheW91dCDog73lpJ/moLnmja7ov5nkupvkv6Hmga/orqHnrpflh7rmnIDnu4jluIPlsYDvvIzor6bmg4Xlj6/op4EgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvY3NzLWxheW91dFxuICAgKiAzLiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr++8jOS9hui/meS6m+S/oeaBr+W5tuS4jeaYr+iDveWkn+ebtOaOpeeUqOeahFxuICAgKiAgICDmr5TlpoIgbGF5b3V0LnRvcCDmmK/mjIflnKjkuIDkuKrniLblrrnlmajlhoXnmoQgdG9w77yM5pyA57uI6KaB5a6e546w5riy5p+T77yM5a6e6ZmF5LiK6KaB6YCS5b2S5Yqg5LiK5aSN5a655Zmo55qEIHRvcFxuICAgKiAgICDov5nmoLfmr4/mrKEgcmVwYWludCDnmoTml7blgJnlj6rpnIDopoHnm7TmjqXkvb/nlKjorqHnrpflpb3nmoTlgLzljbPlj6/vvIzkuI3pnIDopoHmr4/mrKHpg73pgJLlvZLorqHnrpdcbiAgICogICAg6L+Z5LiA5q2l56ew5Li6IGxheW91dENoaWxkcmVu77yM55uu55qE5Zyo5LqO5bCGIGNzcy1sYXlvdXQg6L+b5LiA5q2l5aSE55CG5Li65Y+v5Lul5riy5p+T55u05o6l55So55qE5biD5bGA5L+h5oGvXG4gICAqIDQuIHJlbmRlckNoaWxkcmVu77ya5omn6KGM5riy5p+TXG4gICAqIDUuIGJpbmRFdmVudHPvvJrmiafooYzkuovku7bnu5HlrppcbiAgICovXG4gIC8vIEB0cy1pZ25vcmVcbiAgbGF5b3V0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMucmVuZGVyQ29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAoIXRoaXMuaGFzVmlld1BvcnRTZXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBpbnZva2UgbWV0aG9kIGB1cGRhdGVWaWV3UG9ydGAgYmVmb3JlIG1ldGhvZCBgbGF5b3V0YCcpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Jyk7XG5cbiAgICB0aGlzLnJlZmxvdyh0cnVlKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X290aGVyJyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcsIHRydWUpO1xuICAgIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIGVsZW1lbnQgPT4gZWxlbWVudC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5SRU5ERVJFRDtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dCcpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vdGhlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOiKgueCueaVsOeahOmHjee7mOWItu+8jOS4gOiIrOS4muWKoeS+p+aXoOmcgOiwg+eUqOivpeaWueazlVxuICAgKi9cbiAgcmVwYWludCgpIHtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICAgIHJlcGFpbnRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDov5Tlm57kuIDkuKroioLngrnlnKjlsY/luZXkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga/vvIzliY3mj5DmmK/mraPnoa7osIPnlKh1cGRhdGVWaWV3UG9ydOOAglxuICAgKi9cbiAgZ2V0RWxlbWVudFZpZXdwb3J0UmVjdChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgeyByZWFsTGF5b3V0Qm94LCB2aWV3cG9ydFNjYWxlIH0gPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIGFic29sdXRlWCxcbiAgICAgIGFic29sdXRlWSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgIH0gPSBlbGVtZW50LmxheW91dEJveDtcblxuICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWTtcbiAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHZpZXdwb3J0U2NhbGU7XG4gICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHZpZXdwb3J0U2NhbGU7XG5cbiAgICByZXR1cm4gbmV3IFJlY3QoXG4gICAgICByZWFsWCxcbiAgICAgIHJlYWxZLFxuICAgICAgcmVhbFdpZHRoLFxuICAgICAgcmVhbEhlaWdodCxcbiAgICApO1xuICB9XG5cbiAgZ2V0Q2hpbGRCeVBvcyh0cmVlOiBMYXlvdXQgfCBFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgaXRlbUxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYWJzb2x1dGVYLFxuICAgICAgICBhYnNvbHV0ZVksXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICB9ID0gZWxlLmxheW91dEJveDtcbiAgICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHRoaXMudmlld3BvcnRTY2FsZTtcbiAgICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG5cbiAgICAgIGlmICgocmVhbFggPD0geCAmJiB4IDw9IHJlYWxYICsgcmVhbFdpZHRoKSAmJiAocmVhbFkgPD0geSAmJiB5IDw9IHJlYWxZICsgcmVhbEhlaWdodCkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOebuOWFs2lzc3Vl77yaaHR0cHM6Ly9naXRodWIuY29tL3dlY2hhdC1taW5pcHJvZ3JhbS9taW5pZ2FtZS1jYW52YXMtZW5naW5lL2lzc3Vlcy8xN1xuICAgICAgICAgKiDov5nph4zlj6ropoHmu6HotrPmnaHku7bnmoTpg73opoHorrDlvZXvvIzlkKbliJnlj6/og73lh7rnjrAgaXNzdWUg6YeM6Z2i5o+Q5Yiw55qE6Zeu6aKYXG4gICAgICAgICAqL1xuICAgICAgICBpdGVtTGlzdC5wdXNoKGVsZSk7XG4gICAgICAgIGlmIChlbGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKGVsZSwgeCwgeSwgaXRlbUxpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBldmVudEhhbmRsZXIgPSAoZXZlbnROYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4ge1xuICAgICAgbGV0IHRvdWNoOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuXG4gICAgICBpZiAoaXNHYW1lVG91Y2hFdmVudChlKSkge1xuICAgICAgICB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdWNoID0gZTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnN0IHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pIHx8IGU7XG4gICAgICBpZiAoIXRvdWNoIHx8ICF0b3VjaC5wYWdlWCB8fCAhdG91Y2gucGFnZVkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRvdWNoLnRpbWVTdGFtcCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRvdWNoLnRpbWVTdGFtcCA9IGUudGltZVN0YW1wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSA9IFtdO1xuICAgICAgaWYgKHRvdWNoKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyh0aGlzLCB0b3VjaC5wYWdlWCwgdG91Y2gucGFnZVksIGxpc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KGV2ZW50TmFtZSwgZSk7XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaHN0YXJ0JyB8fCBldmVudE5hbWUgPT09ICd0b3VjaGVuZCcpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnW2V2ZW50TmFtZV0gPSB0b3VjaDtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJyAmJiBpc0NsaWNrKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZykpIHtcbiAgICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoJ2NsaWNrJywgZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICAvKipcbiAgICog5omn6KGM5YWo5bGA55qE5LqL5Lu257uR5a6a6YC76L6RXG4gICAqL1xuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgZW52Lm9uVG91Y2hNb3ZlKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmUpO1xuICAgIGVudi5vblRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcblxuICAgIC8qKlxuICAgICAqIOW9k+inpuWPkSB0b3VjaHN0YXJ0IOS6i+S7tueahOaXtuWAme+8jOWmguaenOaJi+aMh+enu+mZpOWFg+e0oOWklu+8jOS4jeS8muinpuWPkSB0b3VjaGVuZO+8jOi/meWwseWvvOiHtCBkZWFjdGl2ZUhhbmRsZXIg5LiN6IO96Kem5Y+RXG4gICAgICog6KaB5YGa5Yiw5q+U6L6D5a6M5ZaE77yM5LqL5Lu257O757uf6KaB5YGa6L6D5aSn5pS555So77yM55uu5YmN5q+U6L6D5aW955qE5YGa5rOV5bCx5piv5qC56IqC54K55Zyo55uR5ZCs5YiwIHRvdWNoZW5kIOWSjCB0b3VjaGNhbmNlbCDnmoTml7blgJnlhZzlupVcbiAgICAgKiDop6blj5HkuIsgZGVhY3RpdmVIYW5kbGVyXG4gICAgICovXG4gICAgdGhpcy5vbigndG91Y2hlbmQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZUVsZW1lbnRzLmZvckVhY2goKGVsZTogRWxlbWVudCkgPT4ge1xuICAgICAgICBlbGUuZGVhY3RpdmVIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hY3RpdmVFbGVtZW50cyA9IFtdO1xuICAgIH0pO1xuICAgIHRoaXMub24oJ3RvdWNoY2FuY2VsJywgKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVFbGVtZW50cy5mb3JFYWNoKChlbGU6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlLmRlYWN0aXZlSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWN0aXZlRWxlbWVudHMgPSBbXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlhajlsYDkuovku7bop6Pnu5FcbiAgICovXG4gIHVuQmluZEV2ZW50cygpIHtcbiAgICBlbnYub2ZmVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICBlbnYub2ZmVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICBlbnYub2ZmVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgZGF0YTogYW55KSB7XG4gICAgRUUuZW1pdChldmVudCwgZGF0YSk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBkZXN0cm95QWxsKHRyZWU6IExheW91dCB8IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7XG4gICAgICBjaGlsZHJlbixcbiAgICB9ID0gdHJlZTtcblxuICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5kZXN0cm95KCk7XG4gICAgICB0aGlzLmRlc3Ryb3lBbGwoY2hpbGQpO1xuICAgICAgY2hpbGQuZGVzdHJveVNlbGYgJiYgY2hpbGQuZGVzdHJveVNlbGYoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmuIXnkIbnlLvluIPvvIzkuYvliY3nmoTorqHnrpflh7rmnaXnmoTmuLLmn5PmoJHkuZ/kvJrkuIDlubbmuIXnkIbvvIzmraTml7blj6/ku6Xlho3mrKHmiafooYxpbml05ZKMbGF5b3V05pa55rOV5riy5p+T55WM6Z2i44CCXG4gICAqL1xuICBjbGVhcihvcHRpb25zOiB7IHJlbW92ZVRpY2tlcj86IGJvb2xlYW4gfSA9IHt9KSB7XG4gICAgY29uc3QgeyByZW1vdmVUaWNrZXIgPSB0cnVlIH0gPSBvcHRpb25zO1xuXG4gICAgZGVidWdJbmZvLnJlc2V0KCk7XG4gICAgdGhpcy5kZXN0cm95QWxsKHRoaXMpO1xuICAgIC8vIHRoaXMuZWxlbWVudFRyZWUgPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuQ0xFQVI7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgdGhpcy5lbGVDb3VudCA9IDA7XG4gICAgdGhpcy51bkJpbmRFdmVudHMoKTtcblxuICAgIGlmIChyZW1vdmVUaWNrZXIpIHtcbiAgICAgIHRoaXMudGlja2VyLnJlbW92ZSgpO1xuICAgICAgdGhpcy50aWNrZXIuc3RvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbm5lcueahOW6lOivpem7mOiupOmDveenu+mZpO+8jOWQpuWImeWJjeWQjuS4pOasoeWIneWni+WMluS8muWvvOiHtOWJjeWQjueKtuaAgeaciemXrumimFxuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlSW5uZXIoKTtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnRzID0gW107XG4gIH1cblxuICBjbGVhclBvb2woKSB7XG4gICAgaW1nUG9vbC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOavlOi1tyBMYXlvdXQuY2xlYXIg5pu05b275bqV55qE5riF55CG77yM5Lya5riF56m65Zu+54mH5a+56LGh5rGg77yM5YeP5bCR5YaF5a2Y5Y2g55So44CCXG4gICAqL1xuICBjbGVhckFsbCgpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNsZWFyUG9vbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWvueS6juWbvueJh+i1hOa6kO+8jOWmguaenOS4jeaPkOWJjeWKoOi9ve+8jOa4suafk+i/h+eoi+S4reWPr+iDveWHuueOsOaMqOS4quWHuueOsOWbvueJh+aViOaenO+8jOW9seWTjeS9k+mqjFxuICAgKiDpgJrov4dMYXlvdXQubG9hZEltZ3Plj6/ku6XpooTliqDovb3lm77niYfotYTmupDvvIzlnKjosIPnlKhMYXlvdXQubGF5b3V055qE5pe25YCZ5riy5p+T5oCn6IO95pu05aW977yM5L2T6aqM5pu05L2z44CCXG4gICAqL1xuICBsb2FkSW1ncyhhcnI6IHN0cmluZ1tdID0gW10pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXJyLm1hcChzcmMgPT4gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZVByb21pc2Uoc3JjKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOazqOWGjCBiaXRtYXB0ZXh0IOWPr+eUqOeahOWtl+S9k+OAglxuICAgKi9cbiAgcmVnaXN0Qml0TWFwRm9udChuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIGlmICghYml0TWFwUG9vbC5nZXQobmFtZSkpIHtcbiAgICAgIGNvbnN0IGZvbnQgPSBuZXcgQml0TWFwRm9udChuYW1lLCBzcmMsIGNvbmZpZyk7XG4gICAgICB0aGlzLmJpdE1hcEZvbnRzLnB1c2goZm9udCk7XG4gICAgICBiaXRNYXBQb29sLnNldChuYW1lLCBmb250KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5Yib5bu66IqC54K577yM5Yib5bu65LmL5ZCO5Lya6L+U5ZueRWxlbWVudOWIl+ihqO+8jOWPr+S7peS8oOWFpXBhcmVudOeri+WIu+aPkuWFpeiKgueCue+8jOS5n+WPr+S7peeojeWQjuS4u+WKqGFwcGVuZENoaWxk5Yiw6ZyA6KaB55qE6IqC54K55LiLXG4gICAqL1xuICBpbnNlcnRFbGVtZW50KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBFbGVtZW50IHwgbnVsbCk6IEVsZW1lbnRbXSB7XG4gICAgY29uc3QgZWxlbWVudEFycmF5ID0gdGhpcy5pbnNlcnRFbGVtZW50QXJyYXkodGVtcGxhdGUsIHN0eWxlKTtcbiAgICBlbGVtZW50QXJyYXkuZm9yRWFjaChpdCA9PiB7XG4gICAgICBpdGVyYXRlVHJlZShpdCwgZWxlbWVudCA9PiBlbGVtZW50Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCkpO1xuXG4gICAgICBpZiAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChpdCk7XG4gICAgICB9XG4gICAgfSlcbiAgICBcbiAgICByZXR1cm4gZWxlbWVudEFycmF5O1xuICB9XG5cbiAgLyoqXG4gICAqIOWFi+mahuiKgueCue+8jOWFi+mahuWQjueahOiKgueCueWPr+S7pea3u+WKoOWIsCBMYXlvdXQg55qE5p+Q5Liq6IqC54K55LitXG4gICAqIOivpeaWueazleWPr+S7peWcqOaVsOaNruacieWPmOWMlueahOaXtuWAmemBv+WFjemHjeaWsOaJp+ihjCBMYXlvdXQuaW5pdCDmtYHnqIvjgIJcbiAgICovXG4gIGNsb25lTm9kZShlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSkge1xuICAgIHJldHVybiBjbG9uZTxMYXlvdXQ+KHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhue7hOS7tuaMguWIsExheW91dFxuICAgKi9cbiAgRWxlbWVudCA9IEVsZW1lbnQ7XG4gIFZpZXcgPSBWaWV3O1xuICBUZXh0ID0gVGV4dDtcbiAgSW1hZ2UgPSBJbWFnZTtcbiAgU2Nyb2xsVmlldyA9IFNjcm9sbFZpZXc7XG4gIEJpdE1hcFRleHQgPSBCaXRNYXBUZXh0O1xuICBDYW52YXMgPSBDYW52YXM7XG4gIEJ1dHRvbiA9IEJ1dHRvbjtcblxuICByZWdpc3RlckNvbXBvbmVudCA9IHJlZ2lzdGVyQ29tcG9uZW50O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbGxlZFBsdWdpbnM6IElQbHVnaW48TGF5b3V0PltdID0gW107XG4gIC8qKlxuICAgKiDlronoo4Xnu5nlrprnmoTmj5Lku7ZcbiAgICovXG4gIHVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBpZiAoTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuaW5jbHVkZXMocGx1Z2luKSkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSDor6Xmj5Lku7blt7Llronoo4UuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcGx1Z2luLmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMucHVzaChwbHVnaW4pO1xuXG4gICAgLy8gY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Llronoo4VgKVxuICB9XG5cbiAgLyoqXG4gICAqIOWNuOi9vee7meWumuaPkuS7tlxuICAgKi9cbiAgdW5Vc2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgY29uc3QgcGx1Z2luSW5kZXggPSBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmRleE9mKHBsdWdpbik7XG5cbiAgICBpZiAocGx1Z2luSW5kZXggPT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIFRoaXMgcGx1Z2luIGlzIG5vdCBpbnN0YWxsZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Lljbjovb1gKVxuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnNwbGljZShwbHVnaW5JbmRleCwgMSk7XG4gIH1cblxuICAvKipcbiAgICog5Yib5bu66IqC54K577yM5Yib5bu65LmL5ZCO5Lya6L+U5ZueRWxlbWVudOWIl+ihqFxuICAgKi9cbiAgcHJpdmF0ZSBpbnNlcnRFbGVtZW50QXJyYXkodGVtcGxhdGU6IHN0cmluZywgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIGF0dHJWYWx1ZVByb2Nlc3Nvcj86IENhbGxiYWNrLCBvbmx5Rmlyc3Q/OiBib29sZWFuKTogRWxlbWVudFtdIHtcbiAgICAvLyDmoLflvI/ooajlrZjliLDlhajlsYBcbiAgICB0aGlzLnN0eWxlU2hlZXQgPSBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGVTaGVldCwgc3R5bGUpO1xuXG4gICAgY29uc3QgcGFyc2VDb25maWcgPSB7XG4gICAgICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnJyxcbiAgICAgIGF0dHJOb2RlTmFtZTogJ2F0dHInLCAvLyBkZWZhdWx0IGlzICdmYWxzZSdcbiAgICAgIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgaWdub3JlTmFtZVNwYWNlOiB0cnVlLFxuICAgICAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIHBhcnNlTm9kZVZhbHVlOiBmYWxzZSxcbiAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICAgICAgdHJpbVZhbHVlczogdHJ1ZSxcbiAgICAgIHBhcnNlVHJ1ZU51bWJlck9ubHk6IGZhbHNlLFxuICAgICAgYWx3YXlzQ3JlYXRlVGV4dE5vZGU6IHRydWUsXG4gICAgfTtcblxuICAgIGlmIChhdHRyVmFsdWVQcm9jZXNzb3IgJiYgdHlwZW9mIGF0dHJWYWx1ZVByb2Nlc3NvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGFyc2VDb25maWcuYXR0clZhbHVlUHJvY2Vzc29yID0gYXR0clZhbHVlUHJvY2Vzc29yO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5zZXJ0X3htbFBhcnNlJyk7XG4gICAgLy8g5bCGeG1s5a2X56ym5Liy6Kej5p6Q5oiQeG1s6IqC54K55qCRXG4gICAgY29uc3QganNvbk9iaiA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZSwgcGFyc2VDb25maWcsIHRydWUpO1xuICAgIC8vIGNvbnNvbGUubG9nKGpzb25PYmopXG4gICAgZGVidWdJbmZvLmVuZCgnaW5zZXJ0X3htbFBhcnNlJyk7XG5cbiAgICBjb25zdCBnZXRFbGVtZW50czogRWxlbWVudFtdID0gW107XG4gICAganNvbk9iai5jaGlsZHJlbi5mb3JFYWNoKCh4bWxUcmVlOiBUcmVlTm9kZSwgaW5kZXg6IG51bWJlcikgPT4ge1xuICAgICAgaWYgKG9ubHlGaXJzdCAmJiBpbmRleCA+IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gWE1M5qCR55Sf5oiQ5riy5p+T5qCRXG4gICAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luc2VydF94bWwyTGF5b3V0Jyk7XG4gICAgICBjb25zdCBsYXlvdXRUcmVlID0gY3JlYXRlLmNhbGwodGhpcywgeG1sVHJlZSwgdGhpcy5zdHlsZVNoZWV0KTtcbiAgICAgIGRlYnVnSW5mby5lbmQoJ2luc2VydF94bWwyTGF5b3V0Jyk7XG4gICAgICBnZXRFbGVtZW50cy5wdXNoKGxheW91dFRyZWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGdldEVsZW1lbnRzO1xuICB9XG59XG5cbmNvbnN0IGxheW91dCA9IG5ldyBMYXlvdXQoe1xuICBzdHlsZToge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfSxcbiAgbmFtZTogJ2xheW91dCcsXG59KTtcblxuZXhwb3J0IHtcbiAgbGF5b3V0IGFzIGRlZmF1bHQsXG4gIExheW91dCxcbiAgZW52LFxuICBFRSxcbiAgSVN0eWxlLFxuICBFbGVtZW50LFxuICBWaWV3LFxuICBUZXh0LFxuICBJbWFnZSxcbiAgU2Nyb2xsVmlldyxcbiAgQml0TWFwVGV4dCxcbiAgQ2FudmFzLFxuICBCdXR0b25cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
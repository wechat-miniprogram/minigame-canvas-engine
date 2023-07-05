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
            img = (0,_util__WEBPACK_IMPORTED_MODULE_1__.createImage)();
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
        this.nextCbs = [];
        this.innerCbs = [];
        this.update = function () {
            // 优先执行业务的ticker回调，因为有可能会触发reflow
            _this.cbs.forEach(function (cb) {
                cb();
            });
            _this.innerCbs.forEach(function (cb) {
                cb();
            });
            if (_this.nextCbs.length) {
                _this.nextCbs.forEach(function (cb) { return cb(); });
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
    Ticker.prototype.next = function (cb) {
        if (typeof cb === 'function') {
            this.nextCbs.push(cb);
        }
    };
    Ticker.prototype.remove = function (cb, isInner) {
        if (isInner === void 0) { isInner = false; }
        if (cb === undefined) {
            this.cbs = [];
            this.innerCbs = [];
            this.nextCbs = [];
        }
        if (typeof cb === 'function' && this.cbs.indexOf(cb) > -1) {
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
/* harmony export */   clearCanvas: () => (/* binding */ clearCanvas),
/* harmony export */   copyTouchArray: () => (/* binding */ copyTouchArray),
/* harmony export */   createCanvas: () => (/* binding */ createCanvas),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   getDpr: () => (/* binding */ getDpr),
/* harmony export */   isClick: () => (/* binding */ isClick),
/* harmony export */   isGameTouchEvent: () => (/* binding */ isGameTouchEvent),
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
function createCanvas() {
    /* istanbul ignore if*/
    if (typeof __env !== 'undefined') {
        return __env.createCanvas();
    }
    return document.createElement('canvas');
}
function createImage() {
    /* istanbul ignore if*/
    if (typeof __env !== 'undefined') {
        return __env.createImage();
    }
    return document.createElement('img');
}
var _dpr;
// only Baidu platform need to recieve system info from main context
if (typeof swan !== 'undefined') {
    __env.onMessage(function (res) {
        if (res && res.type === 'engine') {
            if (res.event === 'systemInfo') {
                _dpr = res.systemInfo.devicePixelRatio;
            }
        }
    });
}
function getDpr() {
    // return 3;
    if (typeof _dpr !== 'undefined') {
        return _dpr;
    }
    if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
        _dpr = __env.getSystemInfoSync().devicePixelRatio;
    }
    else if (window.devicePixelRatio) {
        _dpr = window.devicePixelRatio;
    }
    else {
        console.warn('[Layout] failed to access device pixel ratio, fallback to 1');
        _dpr = 1;
    }
    return _dpr;
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
/* eslint-disable no-param-reassign */
// components

var constructorMap = {
    view: _components_index__WEBPACK_IMPORTED_MODULE_0__.View,
    text: _components_index__WEBPACK_IMPORTED_MODULE_0__.Text,
    image: _components_index__WEBPACK_IMPORTED_MODULE_0__.Image,
    scrollview: _components_index__WEBPACK_IMPORTED_MODULE_0__.ScrollView,
    bitmaptext: _components_index__WEBPACK_IMPORTED_MODULE_0__.BitMapText,
    canvas: _components_index__WEBPACK_IMPORTED_MODULE_0__.Canvas,
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
        else if (typeof sharedCanvas !== 'undefined') {
            parentStyle = sharedCanvas;
        }
        else if (typeof __env !== 'undefined') {
            parentStyle = __env.getSharedCanvas();
        }
        else {
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
    var element = new Constructor(args);
    // @ts-ignore
    element.root = this;
    element.tagName = node.name;
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
        var _a = this.renderBorder(ctx), needClip = _a.needClip, needStroke = _a.needStroke;
        if (needClip) {
            ctx.clip();
        }
        var box = this.layoutBox;
        var style = this.style;
        var _b = style.width, width = _b === void 0 ? 0 : _b, // 没有设置采用计算出来的宽度
        _c = style.height, // 没有设置采用计算出来的宽度
        height = _c === void 0 ? 0 : _c, // 没有设置则采用计算出来的宽度
        // lineHeight = defaultLineHeight, // 没有设置则采用计算出来的高度
        textAlign = style.textAlign, // 文字左右对齐方式
        verticalAlign = style.verticalAlign, _d = style.letterSpacing, letterSpacing = _d === void 0 ? 0 : _d;
        // 没有设置则采用计算出来的高度
        var lineHeight = (style.lineHeight || defaultLineHeight);
        // 元素包围盒的左上角坐标
        var x = box.absoluteX;
        var y = box.absoluteY;
        var scaleY = lineHeight / defaultLineHeight;
        var realWidth = scaleY * bounds.width;
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(x, y, box.width, box.height);
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, x, y, box.width, box.height);
        }
        // 如果文字的渲染区域高度小于盒子高度，采用对齐方式
        if (lineHeight < height) {
            if (verticalAlign === 'middle') {
                y += (height - lineHeight) / 2;
            }
            else if (verticalAlign === 'bottom') {
                y = y + height - lineHeight;
            }
        }
        if (width > realWidth) {
            if (textAlign === 'center') {
                x += (width - realWidth) / 2;
            }
            else if (textAlign === 'right') {
                x += (width - realWidth);
            }
        }
        // 记录上一个字符，方便处理 kerning
        var prevCharCode = null;
        for (var i = 0; i < this.value.length; i++) {
            var char = this.value[i];
            var cfg = this.font.chars[char];
            if (prevCharCode && cfg.kerning[prevCharCode]) {
                x += cfg.kerning[prevCharCode];
            }
            if (cfg) {
                ctx.drawImage(this.font.texture, cfg.x, cfg.y, cfg.w, cfg.h, x + cfg.offX * scaleY, y + cfg.offY * scaleY, cfg.w * scaleY, cfg.h * scaleY);
                x += (cfg.xadvance * scaleY + letterSpacing);
                prevCharCode = char;
            }
        }
        if (needStroke) {
            ctx.stroke();
        }
        ctx.restore();
    };
    return BitMapText;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BitMapText);


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
            _this.canvasInstance = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.createCanvas)();
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
        var style = this.style || {};
        var box = this.layoutBox;
        var ctx = this.ctx;
        ctx.save();
        if (style.borderColor) {
            ctx.strokeStyle = style.borderColor;
        }
        ctx.lineWidth = style.borderWidth || 0;
        var drawX = box.absoluteX;
        var drawY = box.absoluteY;
        var _a = this.renderBorder(ctx), needClip = _a.needClip, needStroke = _a.needStroke;
        if (needClip) {
            ctx.clip();
        }
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX, drawY, box.width, box.height);
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
        }
        ctx.drawImage(this.canvasInstance, drawX, drawY, box.width, box.height);
        if (needStroke) {
            ctx.stroke();
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
/* harmony export */   getElementsById: () => (/* binding */ getElementsById)
/* harmony export */ });
/* harmony import */ var _style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style */ "./src/components/style.ts");
/* harmony import */ var _common_rect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/rect */ "./src/common/rect.ts");
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/imageManager */ "./src/common/imageManager.ts");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tiny-emitter */ "./node_modules/tiny-emitter/index.js");
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_3__);
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
function setDirty(ele) {
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
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}
function getRgba(hex, opacity) {
    var rgbObj = hexToRgb(hex);
    if (opacity === undefined) {
        opacity = 1;
    }
    if (!rgbObj) {
        return null;
    }
    return "rgba(".concat(rgbObj.r, ", ").concat(rgbObj.g, ", ").concat(rgbObj.b, ", ").concat(opacity, ")");
}
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
var isValidUrlPropReg = /\s*url\((.*?)\)\s*/;
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
        if (style.opacity !== undefined
            && style.color
            && style.color.indexOf('#') > -1) {
            // 颜色解析失败，降级为 hex
            style.color = getRgba(style.color, style.opacity) || style.color;
        }
        if (style.opacity !== undefined
            && style.backgroundColor
            && style.backgroundColor.indexOf('#') > -1) {
            // 颜色解析失败，降级为 hex
            style.backgroundColor = getRgba(style.backgroundColor, style.opacity) || style.backgroundColor;
        }
        if (typeof style.backgroundImage === 'string') {
            this.backgroundImageSetHandler(style.backgroundImage);
        }
        this.originStyle = style;
        this.style = style;
        this.rect = null;
        this.classNameList = null;
    }
    Element.prototype.backgroundImageSetHandler = function (backgroundImage) {
        var _this = this;
        if (typeof backgroundImage === 'string') {
            var list = backgroundImage.match(isValidUrlPropReg);
            if (list) {
                var url = list[1].replace(/('|")/g, '');
                _common_imageManager__WEBPACK_IMPORTED_MODULE_2__["default"].loadImage(url, function (img) {
                    if (!_this.isDestroyed) {
                        _this.backgroundImage = img;
                        // 当图片加载完成，实例可能已经被销毁了
                        _this.root && _this.root.emit('repaint');
                    }
                });
            }
            else {
                console.error("[Layout]: ".concat(backgroundImage, " is not a valid backgroundImage"));
            }
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
                    var _a;
                    if (typeof prop === 'string') {
                        if (_style__WEBPACK_IMPORTED_MODULE_0__.reflowAffectedStyles.indexOf(prop) > -1) {
                            setDirty(ele_1);
                        }
                        else if (_style__WEBPACK_IMPORTED_MODULE_0__.repaintAffectedStyles.indexOf(prop) > -1) {
                            (_a = ele_1.root) === null || _a === void 0 ? void 0 : _a.emit('repaint');
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
                                setDirty(_this);
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
            setDirty(this);
            this.parent = null;
            this.ctx = null;
        }
        else {
            console.warn('[Layout] this element has been removed');
        }
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
        setDirty(this);
    };
    /**
     * 移除给定的子节点，只有一级节点能够移除
     */
    Element.prototype.removeChild = function (element) {
        var index = this.children.indexOf(element);
        if (index !== -1) {
            element.remove();
            setDirty(this);
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
     */
    Element.prototype.renderBorder = function (ctx) {
        var style = this.style || {};
        var radius = style.borderRadius || 0;
        var _a = style.borderWidth, borderWidth = _a === void 0 ? 0 : _a;
        var borderTopLeftRadius = style.borderTopLeftRadius || radius;
        var borderTopRightRadius = style.borderTopRightRadius || radius;
        var borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
        var borderBottomRightRadius = style.borderBottomRightRadius || radius;
        var box = this.layoutBox;
        var _b = style.borderColor, borderColor = _b === void 0 ? '' : _b;
        var x = box.absoluteX;
        var y = box.absoluteY;
        var width = box.width, height = box.height;
        var hasRadius = radius
            || borderTopLeftRadius || borderTopRightRadius || borderBottomLeftRadius || borderBottomRightRadius;
        // borderWidth 和 radius 都没有，不需要执行后续逻辑，提升性能
        if (!borderWidth && !hasRadius) {
            return { needClip: false, needStroke: false };
        }
        // 左上角的点
        ctx.beginPath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.moveTo(x + borderTopLeftRadius, y);
        ctx.lineTo(x + width - borderTopRightRadius, y);
        // 右上角的圆角
        ctx.arcTo(x + width, y, x + width, y + borderTopRightRadius, borderTopRightRadius);
        // 右下角的点
        ctx.lineTo(x + width, y + height - borderBottomRightRadius);
        // 右下角的圆角
        ctx.arcTo(x + width, y + height, x + width - borderBottomRightRadius, y + height, borderBottomRightRadius);
        // 左下角的点
        ctx.lineTo(x + borderBottomLeftRadius, y + height);
        // 左下角的圆角
        ctx.arcTo(x, y + height, x, y + height - borderBottomLeftRadius, borderBottomLeftRadius);
        // 左上角的点
        ctx.lineTo(x, y + borderTopLeftRadius);
        // 左上角的圆角
        ctx.arcTo(x, y, x + borderTopLeftRadius, y, borderTopLeftRadius);
        return { needClip: !!hasRadius, needStroke: !!borderWidth };
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
        // Object.defineProperty(this, 'src', {
        //   get() {
        //     return this.imgsrc;
        //   },
        //   set(newValue) {
        //     if (newValue !== this.imgsrc) {
        //       this.imgsrc = newValue;
        //       imageManager.loadImage(this.src, (img: HTMLImageElement) => {
        //         if (!this.isDestroyed) {
        //           this.img = img;
        //           // 当图片加载完成，实例可能已经被销毁了
        //           this.root.emit('repaint');
        //         }
        //       });
        //     }
        //   },
        //   enumerable: true,
        //   configurable: true,
        // });
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
        var style = this.style || {};
        var box = this.layoutBox;
        var ctx = this.ctx;
        ctx.save();
        if (style.borderColor) {
            ctx.strokeStyle = style.borderColor;
        }
        ctx.lineWidth = style.borderWidth || 0;
        var drawX = box.absoluteX;
        var drawY = box.absoluteY;
        var _b = this.renderBorder(ctx), needClip = _b.needClip, needStroke = _b.needStroke;
        if (needClip) {
            ctx.clip();
        }
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX, drawY, box.width, box.height);
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
        }
        ctx.drawImage(this.img, drawX, drawY, box.width, box.height);
        if (needStroke) {
            ctx.stroke();
        }
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




var dpr = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.getDpr)();
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
            // scrollview为空的情况
            if (!this.children.length) {
                return 0;
            }
            var last = this.children[this.children.length - 1];
            return last.layoutBox.top + last.layoutBox.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollWidth", {
        get: function () {
            // scrollview为空的情况
            if (!this.children.length) {
                return 0;
            }
            var last = this.children[this.children.length - 1];
            return last.layoutBox.left + last.layoutBox.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollX", {
        get: function () {
            return this.innerScrollerOption.scrollingX;
        },
        set: function (value) {
            this.scrollerOption = {
                scrollingX: value,
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollView.prototype, "scrollY", {
        get: function () {
            return this.innerScrollerOption.scrollingY;
        },
        set: function (value) {
            this.scrollerOption = {
                scrollingY: value,
            };
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
        tree.render();
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
        ctx.restore();
    };
    ScrollView.prototype.scrollHandler = function (left, top) {
        var _this = this;
        // 可能被销毁了或者节点树还没准备好
        if (!this.isDestroyed && !this.isFirstScroll) {
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this) {
                    ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - top;
                    ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - left;
                }
            });
            // 这里要把滚动状态保存起来，因为在reflow的时候需要做重置，渲染并不依赖这两个信息
            this.scrollTop = top;
            this.scrollLeft = left;
            this.root.emit('repaint');
            if (this.currentEvent) {
                this.emit('scroll', this.currentEvent);
            }
        }
        if (this.isFirstScroll) {
            this.isFirstScroll = false;
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
            this.scrollY = true;
        }
        if (this.hasEventBind) {
            // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
            if (this.layoutBox.width !== this.scrollerObj.__clientWidth
                || this.layoutBox.height !== this.scrollerObj.__clientHeight
                || this.scrollWidth !== this.scrollerObj.__contentWidth
                || this.scrollHeight !== this.scrollerObj.__contentHeight) {
                this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
            }
            // reflow 之后，会从 csslayout 同步布局信息，原先的滚动信息会丢失，这里需要一个复位的操作
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this) {
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
];
var allStyles = reflowAffectedStyles.concat(repaintAffectedStyles);



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


var DEFAULT_FONT_FAMILY = 'PingFangSC-Regular, sans-serif';
var context = null;
var getContext = function () {
    if (context) {
        return context;
    }
    var canvas = (0,_common_util__WEBPACK_IMPORTED_MODULE_1__.createCanvas)();
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
        _this.textBaseline = 'top';
        _this.font = '';
        _this.textAlign = 'left';
        _this.fillStyle = '#000000';
        _this.type = 'Text';
        _this.ctx = null;
        _this.valuesrc = value;
        _this.originStyleWidth = originStyleWidth;
        return _this;
    }
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
        this.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize || 12, "px ").concat(DEFAULT_FONT_FAMILY);
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
        var ctx = this.ctx;
        ctx.save();
        var box = this.layoutBox;
        var style = this.style;
        ctx.textBaseline = this.textBaseline;
        ctx.font = this.font;
        ctx.textAlign = this.textAlign;
        var drawX = box.absoluteX;
        var drawY = box.absoluteY;
        var _a = this.renderBorder(ctx), needClip = _a.needClip, needStroke = _a.needStroke;
        if (needClip) {
            ctx.clip();
        }
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX, drawY, box.width, box.height);
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
        }
        if (needStroke) {
            ctx.stroke();
        }
        ctx.fillStyle = this.fillStyle;
        if (this.textAlign === 'center') {
            drawX += box.width / 2;
        }
        else if (this.textAlign === 'right') {
            drawX += box.width;
        }
        if (style.lineHeight) {
            ctx.textBaseline = 'middle';
            drawY += style.lineHeight / 2;
        }
        ctx.fillText(this.value, drawX, drawY);
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
    // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能
    View.prototype.checkNeedRender = function () {
        var style = this.style || {};
        var borderColor = style.borderColor;
        return !!(style.backgroundColor
            || (style.borderWidth && borderColor)
            || (style.borderTopWidth && (borderColor || style.borderTopColor))
            || (style.borderBottomWidth && (borderColor || style.borderBottomColor))
            || (style.borderLeftWidth && (borderColor || style.borderLeftColor))
            || (style.borderRightWidth && (borderColor || style.borderRightColor)));
    };
    View.prototype.render = function () {
        var style = this.style || {};
        var box = this.layoutBox;
        // const { ctx } = this;
        var ctx = this.ctx;
        ctx.save();
        var borderWidth = style.borderWidth || 0;
        var drawX = box.absoluteX;
        var drawY = box.absoluteY;
        var borderLeftWidth = style.borderLeftWidth || borderWidth;
        var borderRightWidth = style.borderRightWidth || borderWidth;
        var borderTopWidth = style.borderTopWidth || borderWidth;
        var borderBottomWidth = style.borderBottomWidth || borderWidth;
        // this.renderBorder(ctx);
        var _a = this.renderBorder(ctx), needClip = _a.needClip, needStroke = _a.needStroke;
        if (needClip) {
            ctx.clip();
        }
        if (style.backgroundColor) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX + borderLeftWidth, drawY + borderRightWidth, box.width - (borderLeftWidth + borderRightWidth), box.height - (borderTopWidth + borderBottomWidth));
        }
        if (style.backgroundImage && this.backgroundImage) {
            ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
        }
        if (needStroke) {
            ctx.stroke();
        }
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
/***/ (() => {

"use strict";

if (typeof GameGlobal !== 'undefined') {
    GameGlobal.__env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
}


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
    // const keys = Object.keys(node.child);
    // for (let index = 0; index < keys.length; index++) {
    //   var tagname = keys[index];
    //   if (node.child[tagname] && node.child[tagname].length > 1) {
    //     jObj[tagname] = [];
    //     for (var tag in node.child[tagname]) {
    //       jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
    //     }
    //   } else {
    //     if(options.arrayMode === true){
    //       const result = convertToJson(node.child[tagname][0], options)
    //       if(typeof result === 'object')
    //         jObj[tagname] = [ result ];
    //       else
    //         jObj[tagname] = result;
    //     }else if(options.arrayMode === "strict"){
    //       jObj[tagname] = [convertToJson(node.child[tagname][0], options) ];
    //     }else{
    //       jObj[tagname] = convertToJson(node.child[tagname][0], options);
    //     }
    //   }
    // }
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
        this.scrollTo(this.__scrollLeft, this.__scrollTop, true);
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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env */ "./src/env.ts");
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_env__WEBPACK_IMPORTED_MODULE_0__);
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
        _this.version = '1.0.3';
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
        _this.registerComponent = _common_vd__WEBPACK_IMPORTED_MODULE_10__.registerComponent;
        _this.eventHandlerData = {
            hasEventBind: false,
            touchMsg: {},
            handlers: {
                touchStart: _this.eventHandler('touchstart'),
                touchMove: _this.eventHandler('touchmove'),
                touchEnd: _this.eventHandler('touchend'),
                touchCancel: _this.eventHandler('touchcancel'),
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
        if (typeof __env !== 'undefined') {
            __env.onTouchStart(this.eventHandlerData.handlers.touchStart);
            __env.onTouchMove(this.eventHandlerData.handlers.touchMove);
            __env.onTouchEnd(this.eventHandlerData.handlers.touchEnd);
            __env.onTouchCancel(this.eventHandlerData.handlers.touchCancel);
        }
        else {
            document.onmousedown = this.eventHandlerData.handlers.touchStart;
            document.onmousemove = this.eventHandlerData.handlers.touchMove;
            document.onmouseup = this.eventHandlerData.handlers.touchEnd;
            document.onmouseleave = this.eventHandlerData.handlers.touchCancel;
        }
    };
    /**
     * 全局事件解绑
     */
    Layout.prototype.unBindEvents = function () {
        if (typeof __env !== 'undefined') {
            __env.offTouchStart(this.eventHandlerData.handlers.touchStart);
            __env.offTouchMove(this.eventHandlerData.handlers.touchMove);
            __env.offTouchEnd(this.eventHandlerData.handlers.touchEnd);
            __env.offTouchCancel(this.eventHandlerData.handlers.touchCancel);
        }
        else {
            document.onmousedown = null;
            document.onmousemove = null;
            document.onmouseup = null;
            document.onmouseleave = null;
        }
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
        console.log("[Layout] \u63D2\u4EF6 ".concat(plugin.name || '', " \u5DF2\u5B89\u88C5"));
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
            console.warn('This plugin is not installed.');
            return;
        }
        if (plugin.uninstall) {
            plugin.uninstall.apply(plugin, __spreadArray([this], options, false));
        }
        console.log("[Layout] \u63D2\u4EF6 ".concat(plugin.name || '', " \u5DF2\u5378\u8F7D"));
        Layout.installedPlugins.splice(pluginIndex, 1);
    };
    Layout.installedPlugins = [];
    return Layout;
}(_components_elements__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new Layout({
    style: {
        width: 0,
        height: 0,
    },
    name: 'layout',
}));

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGVtb3Mvbm9lbmdpbmUvZW5naW5lLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFD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QztRQUNSLE1BQU0sRUFBRSxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEVBQUUsUUFBUTtDQUNmLENBQUMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvY3NzLWxheW91dC9kaXN0L2Nzcy1sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vYml0TWFwRm9udC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9kZWJ1Z0luZm8udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vaW1hZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcmVjdC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi90aWNrZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdXRpbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi92ZC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYml0bWFwdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvY2FudmFzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9lbGVtZW50cy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW1hZ2UudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2luZGV4LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGx2aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2Vudi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL25vZGUyanNvbi5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxOb2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sc3RyMnhtbG5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2FuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZCBmb3IgcmVmZXJlbmNlXG4vL1xuLy8gVGhpcyBmaWxlIHVzZXMgdGhlIGZvbGxvd2luZyBzcGVjaWZpYyBVTUQgaW1wbGVtZW50YXRpb246XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LmNvbXB1dGVMYXlvdXQgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxudmFyIGNvbXB1dGVMYXlvdXQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIENTU19VTkRFRklORUQ7XG5cbiAgdmFyIENTU19ESVJFQ1RJT05fSU5IRVJJVCA9ICdpbmhlcml0JztcbiAgdmFyIENTU19ESVJFQ1RJT05fTFRSID0gJ2x0cic7XG4gIHZhciBDU1NfRElSRUNUSU9OX1JUTCA9ICdydGwnO1xuXG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XID0gJ3Jvdyc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgPSAncm93LXJldmVyc2UnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiA9ICdjb2x1bW4nO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFID0gJ2NvbHVtbi1yZXZlcnNlJztcblxuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19KVVNUSUZZX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTiA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0FST1VORCA9ICdzcGFjZS1hcm91bmQnO1xuXG4gIHZhciBDU1NfQUxJR05fRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19BTElHTl9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19BTElHTl9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfQUxJR05fU1RSRVRDSCA9ICdzdHJldGNoJztcblxuICB2YXIgQ1NTX1BPU0lUSU9OX1JFTEFUSVZFID0gJ3JlbGF0aXZlJztcbiAgdmFyIENTU19QT1NJVElPTl9BQlNPTFVURSA9ICdhYnNvbHV0ZSc7XG5cbiAgdmFyIGxlYWRpbmcgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgdHJhaWxpbmcgPSB7XG4gICAgJ3Jvdyc6ICdyaWdodCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ2xlZnQnLFxuICAgICdjb2x1bW4nOiAnYm90dG9tJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAndG9wJ1xuICB9O1xuICB2YXIgcG9zID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIGRpbSA9IHtcbiAgICAncm93JzogJ3dpZHRoJyxcbiAgICAncm93LXJldmVyc2UnOiAnd2lkdGgnLFxuICAgICdjb2x1bW4nOiAnaGVpZ2h0JyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnaGVpZ2h0J1xuICB9O1xuXG4gIC8vIFdoZW4gdHJhbnNwaWxlZCB0byBKYXZhIC8gQyB0aGUgbm9kZSB0eXBlIGhhcyBsYXlvdXQsIGNoaWxkcmVuIGFuZCBzdHlsZVxuICAvLyBwcm9wZXJ0aWVzLiBGb3IgdGhlIEphdmFTY3JpcHQgdmVyc2lvbiB0aGlzIGZ1bmN0aW9uIGFkZHMgdGhlc2UgcHJvcGVydGllc1xuICAvLyBpZiB0aGV5IGRvbid0IGFscmVhZHkgZXhpc3QuXG4gIGZ1bmN0aW9uIGZpbGxOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmxheW91dCB8fCBub2RlLmlzRGlydHkpIHtcbiAgICAgIG5vZGUubGF5b3V0ID0ge1xuICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghbm9kZS5zdHlsZSkge1xuICAgICAgbm9kZS5zdHlsZSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtdO1xuICAgIH1cbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZmlsbE5vZGVzKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Jvd0RpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cgfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpblN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpblN0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5FbmQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdFbmQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdFbmQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ0VuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykgK1xuICAgICAgICBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRKdXN0aWZ5Q29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25Db250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduQ29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduSXRlbShub2RlLCBjaGlsZCkge1xuICAgIGlmIChjaGlsZC5zdHlsZS5hbGlnblNlbGYpIHtcbiAgICAgIHJldHVybiBjaGlsZC5zdHlsZS5hbGlnblNlbGY7XG4gICAgfVxuICAgIGlmIChub2RlLnN0eWxlLmFsaWduSXRlbXMpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduSXRlbXM7XG4gICAgfVxuICAgIHJldHVybiAnc3RyZXRjaCc7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlQXhpcyhheGlzLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX1JUTCkge1xuICAgICAgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgICAgIH0gZWxzZSBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBheGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIGlmIChub2RlLnN0eWxlLmRpcmVjdGlvbikge1xuICAgICAgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdGlvbiA9IENTU19ESVJFQ1RJT05fSU5IRVJJVDtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX0lOSEVSSVQpIHtcbiAgICAgIGRpcmVjdGlvbiA9IChwYXJlbnREaXJlY3Rpb24gPT09IHVuZGVmaW5lZCA/IENTU19ESVJFQ1RJT05fTFRSIDogcGFyZW50RGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RmxleERpcmVjdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24oZmxleERpcmVjdGlvbiwgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb25UeXBlKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wb3NpdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucG9zaXRpb247XG4gICAgfVxuICAgIHJldHVybiAncmVsYXRpdmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4KG5vZGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZ2V0UG9zaXRpb25UeXBlKG5vZGUpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgIG5vZGUuc3R5bGUuZmxleCA+IDBcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4V3JhcChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleFdyYXAgPT09ICd3cmFwJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERpbVdpdGhNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLmxheW91dFtkaW1bYXhpc11dICsgZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRGltRGVmaW5lZChub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGVbZGltW2F4aXNdXSA+PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQb3NEZWZpbmVkKG5vZGUsIHBvcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWVhc3VyZURlZmluZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLm1lYXN1cmUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uKG5vZGUsIHBvcykge1xuICAgIGlmIChub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBib3VuZEF4aXMobm9kZSwgYXhpcywgdmFsdWUpIHtcbiAgICB2YXIgbWluID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWluSGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5IZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIG1heCA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1heEhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4SGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBib3VuZFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkICYmIG1heCA+PSAwICYmIGJvdW5kVmFsdWUgPiBtYXgpIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtYXg7XG4gICAgfVxuICAgIGlmIChtaW4gIT09IHVuZGVmaW5lZCAmJiBtaW4gPj0gMCAmJiBib3VuZFZhbHVlIDwgbWluKSB7XG4gICAgICBib3VuZFZhbHVlID0gbWluO1xuICAgIH1cbiAgICByZXR1cm4gYm91bmRWYWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZtYXhmKGEsIGIpIHtcbiAgICBpZiAoYSA+IGIpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHVzZXIgc3BlY2lmaWNhbGx5IHNldHMgYSB2YWx1ZSBmb3Igd2lkdGggb3IgaGVpZ2h0XG4gIGZ1bmN0aW9uIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBheGlzKSB7XG4gICAgLy8gVGhlIHBhcmVudCBhbHJlYWR5IGNvbXB1dGVkIHVzIGEgd2lkdGggb3IgaGVpZ2h0LiBXZSBqdXN0IHNraXAgaXRcbiAgICBpZiAobm9kZS5sYXlvdXRbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFdlIG9ubHkgcnVuIGlmIHRoZXJlJ3MgYSB3aWR0aCBvciBoZWlnaHQgZGVmaW5lZFxuICAgIGlmICghaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGRpbWVuc2lvbnMgY2FuIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyXG4gICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgYm91bmRBeGlzKG5vZGUsIGF4aXMsIG5vZGUuc3R5bGVbZGltW2F4aXNdXSksXG4gICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBheGlzKSB7XG4gICAgY2hpbGQubGF5b3V0W3RyYWlsaW5nW2F4aXNdXSA9IG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtIGNoaWxkLmxheW91dFtwb3NbYXhpc11dO1xuICB9XG5cbiAgLy8gSWYgYm90aCBsZWZ0IGFuZCByaWdodCBhcmUgZGVmaW5lZCwgdGhlbiB1c2UgbGVmdC4gT3RoZXJ3aXNlIHJldHVyblxuICAvLyArbGVmdCBvciAtcmlnaHQgZGVwZW5kaW5nIG9uIHdoaWNoIGlzIGRlZmluZWQuXG4gIGZ1bmN0aW9uIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlW2xlYWRpbmdbYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBnZXRQb3NpdGlvbihub2RlLCBsZWFkaW5nW2F4aXNdKTtcbiAgICB9XG4gICAgcmV0dXJuIC1nZXRQb3NpdGlvbihub2RlLCB0cmFpbGluZ1theGlzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgLypjc3NfZGlyZWN0aW9uX3QqL3BhcmVudERpcmVjdGlvbikge1xuICAgIHZhci8qY3NzX2RpcmVjdGlvbl90Ki8gZGlyZWN0aW9uID0gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBtYWluQXhpcyA9IHJlc29sdmVBeGlzKGdldEZsZXhEaXJlY3Rpb24obm9kZSksIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGNyb3NzQXhpcyA9IGdldENyb3NzRmxleERpcmVjdGlvbihtYWluQXhpcywgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gcmVzb2x2ZWRSb3dBeGlzID0gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcblxuICAgIC8vIEhhbmRsZSB3aWR0aCBhbmQgaGVpZ2h0IHN0eWxlIGF0dHJpYnV0ZXNcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgbWFpbkF4aXMpO1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gU2V0IHRoZSByZXNvbHZlZCByZXNvbHV0aW9uIGluIHRoZSBub2RlJ3MgbGF5b3V0XG4gICAgbm9kZS5sYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgLy8gVGhlIHBvc2l0aW9uIGlzIHNldCBieSB0aGUgcGFyZW50LCBidXQgd2UgbmVlZCB0byBjb21wbGV0ZSBpdCB3aXRoIGFcbiAgICAvLyBkZWx0YSBjb21wb3NlZCBvZiB0aGUgbWFyZ2luIGFuZCBsZWZ0L3RvcC9yaWdodC9ib3R0b21cbiAgICBub2RlLmxheW91dFtsZWFkaW5nW21haW5BeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbbWFpbkF4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1tjcm9zc0F4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW2Nyb3NzQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gSW5saW5lIGltbXV0YWJsZSB2YWx1ZXMgZnJvbSB0aGUgdGFyZ2V0IG5vZGUgdG8gYXZvaWQgZXhjZXNzaXZlIG1ldGhvZFxuICAgIC8vIGludm9jYXRpb25zIGR1cmluZyB0aGUgbGF5b3V0IGNhbGN1bGF0aW9uLlxuICAgIHZhci8qaW50Ki8gY2hpbGRDb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93ID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcblxuICAgIGlmIChpc01lYXN1cmVEZWZpbmVkKG5vZGUpKSB7XG4gICAgICB2YXIvKmJvb2wqLyBpc1Jlc29sdmVkUm93RGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0pO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gd2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5zdHlsZS53aWR0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZXNvbHZlZFJvd0RpbURlZmluZWQpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG4gICAgICB9XG4gICAgICB3aWR0aCAtPSBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZ2l2ZSBhIGRpbWVuc2lvbiBmb3IgdGhlIHRleHQgaWYgd2UgaGF2ZW4ndCBnb3QgYW55XG4gICAgICAvLyBmb3IgaXQgY29tcHV0ZWQgeWV0LiBJdCBjYW4gZWl0aGVyIGJlIGZyb20gdGhlIHN0eWxlIGF0dHJpYnV0ZSBvciBiZWNhdXNlXG4gICAgICAvLyB0aGUgZWxlbWVudCBpcyBmbGV4aWJsZS5cbiAgICAgIHZhci8qYm9vbCovIGlzUm93VW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpICYmICFpc1Jlc29sdmVkUm93RGltRGVmaW5lZDtcbiAgICAgIHZhci8qYm9vbCovIGlzQ29sdW1uVW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKSAmJlxuICAgICAgICBpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl1dKTtcblxuICAgICAgLy8gTGV0J3Mgbm90IG1lYXN1cmUgdGhlIHRleHQgaWYgd2UgYWxyZWFkeSBrbm93IGJvdGggZGltZW5zaW9uc1xuICAgICAgaWYgKGlzUm93VW5kZWZpbmVkIHx8IGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgIHZhci8qY3NzX2RpbV90Ki8gbWVhc3VyZURpbSA9IG5vZGUuc3R5bGUubWVhc3VyZShcbiAgICAgICAgICAvKihjKSFub2RlLT5jb250ZXh0LCovXG4gICAgICAgICAgLyooamF2YSkhbGF5b3V0Q29udGV4dC5tZWFzdXJlT3V0cHV0LCovXG4gICAgICAgICAgd2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGlzUm93VW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBtZWFzdXJlRGltLndpZHRoICtcbiAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbWVhc3VyZURpbS5oZWlnaHQgK1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZENvdW50ID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBpc05vZGVGbGV4V3JhcCA9IGlzRmxleFdyYXAobm9kZSk7XG5cbiAgICB2YXIvKmNzc19qdXN0aWZ5X3QqLyBqdXN0aWZ5Q29udGVudCA9IGdldEp1c3RpZnlDb250ZW50KG5vZGUpO1xuXG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbiA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcyA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbiA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICB2YXIvKmJvb2wqLyBpc01haW5EaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc0Nyb3NzRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzTWFpblJvd0RpcmVjdGlvbiA9IGlzUm93RGlyZWN0aW9uKG1haW5BeGlzKTtcblxuICAgIHZhci8qaW50Ki8gaTtcbiAgICB2YXIvKmludCovIGlpO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjaGlsZDtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gYXhpcztcblxuICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IG51bGw7XG5cbiAgICB2YXIvKmZsb2F0Ki8gZGVmaW5lZE1haW5EaW0gPSBDU1NfVU5ERUZJTkVEO1xuICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBkZWZpbmVkTWFpbkRpbSA9IG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dIC0gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgbmV4dCB0d28gbG9vcHMgb25lIHBlciBsaW5lIHdpdGggZmxleC13cmFwXG4gICAgdmFyLyppbnQqLyBzdGFydExpbmUgPSAwO1xuICAgIHZhci8qaW50Ki8gZW5kTGluZSA9IDA7XG4gICAgLy8gdmFyLyppbnQqLyBuZXh0T2Zmc2V0ID0gMDtcbiAgICB2YXIvKmludCovIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgIC8vIFdlIGFnZ3JlZ2F0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGUgY29udGFpbmVyIGluIHRob3NlIHR3byB2YXJpYWJsZXNcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNDcm9zc0RpbSA9IDA7XG4gICAgdmFyLypmbG9hdCovIGxpbmVzTWFpbkRpbSA9IDA7XG4gICAgdmFyLyppbnQqLyBsaW5lc0NvdW50ID0gMDtcbiAgICB3aGlsZSAoZW5kTGluZSA8IGNoaWxkQ291bnQpIHtcbiAgICAgIC8vIDxMb29wIEE+IExheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4gYW5kIGNvdW50IGNoaWxkcmVuIGJ5IHR5cGVcblxuICAgICAgLy8gbWFpbkNvbnRlbnREaW0gaXMgYWNjdW11bGF0aW9uIG9mIHRoZSBkaW1lbnNpb25zIGFuZCBtYXJnaW4gb2YgYWxsIHRoZVxuICAgICAgLy8gbm9uIGZsZXhpYmxlIGNoaWxkcmVuLiBUaGlzIHdpbGwgYmUgdXNlZCBpbiBvcmRlciB0byBlaXRoZXIgc2V0IHRoZVxuICAgICAgLy8gZGltZW5zaW9ucyBvZiB0aGUgbm9kZSBpZiBub25lIGFscmVhZHkgZXhpc3QsIG9yIHRvIGNvbXB1dGUgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2UgbGVmdCBmb3IgdGhlIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgdmFyLypmbG9hdCovIG1haW5Db250ZW50RGltID0gMDtcblxuICAgICAgLy8gVGhlcmUgYXJlIHRocmVlIGtpbmQgb2YgY2hpbGRyZW4sIG5vbiBmbGV4aWJsZSwgZmxleGlibGUgYW5kIGFic29sdXRlLlxuICAgICAgLy8gV2UgbmVlZCB0byBrbm93IGhvdyBtYW55IHRoZXJlIGFyZSBpbiBvcmRlciB0byBkaXN0cmlidXRlIHRoZSBzcGFjZS5cbiAgICAgIHZhci8qaW50Ki8gZmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyB0b3RhbEZsZXhpYmxlID0gMDtcbiAgICAgIHZhci8qaW50Ki8gbm9uRmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcblxuICAgICAgLy8gVXNlIHRoZSBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIG1haW4gYXhpcyBmb3IgYXMgbG9uZ1xuICAgICAgLy8gYXMgdGhleSBhcmUgdXNpbmcgYSBzaW1wbGUgc3RhY2tpbmcgYmVoYXZpb3VyLiBDaGlsZHJlbiB0aGF0IGFyZVxuICAgICAgLy8gaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW5cbiAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja01haW4gPVxuICAgICAgICAgIChpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICghaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfQ0VOVEVSKTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4TWFpbiA9IChpc1NpbXBsZVN0YWNrTWFpbiA/IGNoaWxkQ291bnQgOiBzdGFydExpbmUpO1xuXG4gICAgICAvLyBVc2UgdGhlIGluaXRpYWwgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBjcm9zcyBheGlzIGZvclxuICAgICAgLy8gYXMgbG9uZyBhcyB0aGV5IGFyZSByZWxhdGl2ZWx5IHBvc2l0aW9uZWQgd2l0aCBhbGlnbm1lbnQgU1RSRVRDSCBvclxuICAgICAgLy8gRkxFWF9TVEFSVC4gQ2hpbGRyZW4gdGhhdCBhcmUgaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wXG4gICAgICAvLyB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluIGluIDxMb29wIEQ+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja0Nyb3NzID0gdHJ1ZTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4Q3Jvc3MgPSBjaGlsZENvdW50O1xuXG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkRpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbjtcbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbSA9IDA7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYXhXaWR0aDtcbiAgICAgIGZvciAoaSA9IHN0YXJ0TGluZTsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgIGNoaWxkLmxpbmVJbmRleCA9IGxpbmVzQ291bnQ7XG5cbiAgICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcblxuICAgICAgICAvLyBQcmUtZmlsbCBjcm9zcyBheGlzIGRpbWVuc2lvbnMgd2hlbiB0aGUgY2hpbGQgaXMgdXNpbmcgc3RyZXRjaCBiZWZvcmVcbiAgICAgICAgLy8gd2UgY2FsbCB0aGUgcmVjdXJzaXZlIGxheW91dCBwYXNzXG4gICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIICYmXG4gICAgICAgICAgICBnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgICAgICAgIGlzQ3Jvc3NEaW1EZWZpbmVkICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBjcm9zc0F4aXMpKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFKSB7XG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGFic29sdXRlbHkgcG9zaXRpb25lZCBjaGlsZHJlblxuICAgICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0QWJzb2x1dGVDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvciB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGhcbiAgICAgICAgICAvLyBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSksXG4gICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgYXhpcylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIvKmZsb2F0Ki8gbmV4dENvbnRlbnREaW0gPSAwO1xuXG4gICAgICAgIC8vIEl0IG9ubHkgbWFrZXMgc2Vuc2UgdG8gY29uc2lkZXIgYSBjaGlsZCBmbGV4aWJsZSBpZiB3ZSBoYXZlIGEgY29tcHV0ZWRcbiAgICAgICAgLy8gZGltZW5zaW9uIGZvciB0aGUgbm9kZS5cbiAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQgJiYgaXNGbGV4KGNoaWxkKSkge1xuICAgICAgICAgIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgIHRvdGFsRmxleGlibGUgKz0gY2hpbGQuc3R5bGUuZmxleDtcblxuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBmbGV4aWJsZSBjaGlsZHJlbiBzbyB0aGF0IHdlIGNhblxuICAgICAgICAgIC8vIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0RmxleENoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIEV2ZW4gaWYgd2UgZG9uJ3Qga25vdyBpdHMgZXhhY3Qgc2l6ZSB5ZXQsIHdlIGFscmVhZHkga25vdyB0aGUgcGFkZGluZyxcbiAgICAgICAgICAvLyBib3JkZXIgYW5kIG1hcmdpbi4gV2UnbGwgdXNlIHRoaXMgcGFydGlhbCBpbmZvcm1hdGlvbiwgd2hpY2ggcmVwcmVzZW50c1xuICAgICAgICAgIC8vIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBzaXplIGZvciB0aGUgY2hpbGQsIHRvIGNvbXB1dGUgdGhlIHJlbWFpbmluZ1xuICAgICAgICAgIC8vIGF2YWlsYWJsZSBzcGFjZS5cbiAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgbWFpbkF4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVGhpcyBpcyB0aGUgbWFpbiByZWN1cnNpdmUgY2FsbC4gV2UgbGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgICAgICBpZiAoYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9PT0gMCkge1xuICAgICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2NoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBYnNvbHV0ZSBwb3NpdGlvbmVkIGVsZW1lbnRzIGRvIG5vdCB0YWtlIHBhcnQgb2YgdGhlIGxheW91dCwgc28gd2VcbiAgICAgICAgICAvLyBkb24ndCB1c2UgdGhlbSB0byBjb21wdXRlIG1haW5Db250ZW50RGltXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgYW5kIG1hcmdpbiBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBlbGVtZW50IHdlIGFyZSBhYm91dCB0byBhZGQgd291bGQgbWFrZSB1cyBnbyB0byB0aGUgbmV4dCBsaW5lXG4gICAgICAgIGlmIChpc05vZGVGbGV4V3JhcCAmJlxuICAgICAgICAgICAgaXNNYWluRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgbWFpbkNvbnRlbnREaW0gKyBuZXh0Q29udGVudERpbSA+IGRlZmluZWRNYWluRGltICYmXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG9ubHkgb25lIGVsZW1lbnQsIHRoZW4gaXQncyBiaWdnZXIgdGhhbiB0aGUgY29udGVudFxuICAgICAgICAgICAgLy8gYW5kIG5lZWRzIGl0cyBvd24gbGluZVxuICAgICAgICAgICAgaSAhPT0gc3RhcnRMaW5lKSB7XG4gICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50LS07XG4gICAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgbWFpbiBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8IGlzRmxleChjaGlsZCkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja01haW4gPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhNYWluID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBjcm9zcyBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBEPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcyAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fFxuICAgICAgICAgICAgICAgIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9TVFJFVENIICYmIGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgICAgICAgaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja0Nyb3NzID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4Q3Jvc3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYWluRGltICs9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcykge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgICAgICBtYWluQ29udGVudERpbSArPSBuZXh0Q29udGVudERpbTtcbiAgICAgICAgZW5kTGluZSA9IGkgKyAxO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBCPiBMYXlvdXQgZmxleGlibGUgY2hpbGRyZW4gYW5kIGFsbG9jYXRlIGVtcHR5IHNwYWNlXG5cbiAgICAgIC8vIEluIG9yZGVyIHRvIHBvc2l0aW9uIHRoZSBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzLCB3ZSBoYXZlIHR3b1xuICAgICAgLy8gY29udHJvbHMuIFRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBiZWdpbm5pbmcgYW5kIHRoZSBmaXJzdCBlbGVtZW50XG4gICAgICAvLyBhbmQgdGhlIHNwYWNlIGJldHdlZW4gZWFjaCB0d28gZWxlbWVudHMuXG4gICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ01haW5EaW0gPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGJldHdlZW5NYWluRGltID0gMDtcblxuICAgICAgLy8gVGhlIHJlbWFpbmluZyBhdmFpbGFibGUgc3BhY2UgdGhhdCBuZWVkcyB0byBiZSBhbGxvY2F0ZWRcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdNYWluRGltID0gMDtcbiAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBkZWZpbmVkTWFpbkRpbSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKG1haW5Db250ZW50RGltLCAwKSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgZmxleGlibGUgY2hpbGRyZW4gaW4gdGhlIG1peCwgdGhleSBhcmUgZ29pbmcgdG8gZmlsbCB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZVxuICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCAhPT0gMCkge1xuICAgICAgICB2YXIvKmZsb2F0Ki8gZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG4gICAgICAgIHZhci8qZmxvYXQqLyBiYXNlTWFpbkRpbTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJvdW5kTWFpbkRpbTtcblxuICAgICAgICAvLyBJZiB0aGUgZmxleCBzaGFyZSBvZiByZW1haW5pbmcgc3BhY2UgZG9lc24ndCBtZWV0IG1pbi9tYXggYm91bmRzLFxuICAgICAgICAvLyByZW1vdmUgdGhpcyBjaGlsZCBmcm9tIGZsZXggY2FsY3VsYXRpb25zLlxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgYmFzZU1haW5EaW0gPSBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgYm91bmRNYWluRGltID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLCBiYXNlTWFpbkRpbSk7XG5cbiAgICAgICAgICBpZiAoYmFzZU1haW5EaW0gIT09IGJvdW5kTWFpbkRpbSkge1xuICAgICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSAtPSBib3VuZE1haW5EaW07XG4gICAgICAgICAgICB0b3RhbEZsZXhpYmxlIC09IGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuXG4gICAgICAgIC8vIFRoZSBub24gZmxleGlibGUgY2hpbGRyZW4gY2FuIG92ZXJmbG93IHRoZSBjb250YWluZXIsIGluIHRoaXMgY2FzZVxuICAgICAgICAvLyB3ZSBzaG91bGQganVzdCBhc3N1bWUgdGhhdCB0aGVyZSBpcyBubyBzcGFjZSBhdmFpbGFibGUuXG4gICAgICAgIGlmIChmbGV4aWJsZU1haW5EaW0gPCAwKSB7XG4gICAgICAgICAgZmxleGlibGVNYWluRGltID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgb2YgdGhlIGVsZW1lbnQgaW4gdGhlIG1haW5cbiAgICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyxcbiAgICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9IGVsc2UgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSByZWN1cnNpdmVseSBjYWxsIHRoZSBsYXlvdXQgYWxnb3JpdGhtIGZvciB0aGlzIGNoaWxkXG4gICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2N1cnJlbnRGbGV4Q2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgY2hpbGQgPSBjdXJyZW50RmxleENoaWxkO1xuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIGp1c3RpZnlDb250ZW50IHRvIGZpZ3VyZSBvdXQgaG93IHRvIGFsbG9jYXRlIHRoZSByZW1haW5pbmdcbiAgICAgIC8vIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkge1xuICAgICAgICBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0NFTlRFUikge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIDI7XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOKSB7XG4gICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKHJlbWFpbmluZ01haW5EaW0sIDApO1xuICAgICAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxICE9PSAwKSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0FST1VORCkge1xuICAgICAgICAgIC8vIFNwYWNlIG9uIHRoZSBlZGdlcyBpcyBoYWxmIG9mIHRoZSBzcGFjZSBiZXR3ZWVuIGVsZW1lbnRzXG4gICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQpO1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gYmV0d2Vlbk1haW5EaW0gLyAyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEM+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMgYW5kIGNvbXB1dGUgZGltZW5zaW9uc1xuXG4gICAgICAvLyBBdCB0aGlzIHBvaW50LCBhbGwgdGhlIGNoaWxkcmVuIGhhdmUgdGhlaXIgZGltZW5zaW9ucyBzZXQuIFdlIG5lZWQgdG9cbiAgICAgIC8vIGZpbmQgdGhlaXIgcG9zaXRpb24uIEluIG9yZGVyIHRvIGRvIHRoYXQsIHdlIGFjY3VtdWxhdGUgZGF0YSBpblxuICAgICAgLy8gdmFyaWFibGVzIHRoYXQgYXJlIGFsc28gdXNlZnVsIHRvIGNvbXB1dGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlXG4gICAgICAvLyBjb250YWluZXIhXG4gICAgICBtYWluRGltICs9IGxlYWRpbmdNYWluRGltO1xuXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhNYWluOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlIGFuZCBoYXMgbGVmdC90b3AgYmVpbmdcbiAgICAgICAgICAvLyBkZWZpbmVkLCB3ZSBvdmVycmlkZSB0aGUgcG9zaXRpb24gdG8gd2hhdGV2ZXIgdGhlIHVzZXIgc2FpZFxuICAgICAgICAgIC8vIChhbmQgbWFyZ2luL2JvcmRlcikuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlICh3aXRob3V0IHRvcC9sZWZ0KSBvciByZWxhdGl2ZSxcbiAgICAgICAgICAvLyB3ZSBwdXQgaXQgYXQgdGhlIGN1cnJlbnQgYWNjdW11bGF0ZWQgb2Zmc2V0LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE5vdyB0aGF0IHdlIHBsYWNlZCB0aGUgZWxlbWVudCwgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuICAgICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBkbyB0aGF0IGZvciByZWxhdGl2ZSBlbGVtZW50cy4gQWJzb2x1dGUgZWxlbWVudHNcbiAgICAgICAgICAvLyBkbyBub3QgdGFrZSBwYXJ0IGluIHRoYXQgcGhhc2UuXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLy8gVGhlIG1haW4gZGltZW5zaW9uIGlzIHRoZSBzdW0gb2YgYWxsIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gcGx1c1xuICAgICAgICAgICAgLy8gdGhlIHNwYWNpbmcuXG4gICAgICAgICAgICBtYWluRGltICs9IGJldHdlZW5NYWluRGltICsgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgICAgLy8gVGhlIGNyb3NzIGRpbWVuc2lvbiBpcyB0aGUgbWF4IG9mIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gc2luY2UgdGhlcmVcbiAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBlbGVtZW50IGluIHRoYXQgY3Jvc3MgZGltZW5zaW9uLlxuICAgICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLypmbG9hdCovIGNvbnRhaW5lckNyb3NzQXhpcyA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgY29udGFpbmVyQ3Jvc3NBeGlzID0gZm1heGYoXG4gICAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBjcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgRD4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleENyb3NzOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBhYnNvbHV0ZWx5IHBvc2l0aW9ubmVkIGFuZCBoYXMgYVxuICAgICAgICAgIC8vIHRvcC9sZWZ0L2JvdHRvbS9yaWdodCBiZWluZyBzZXQsIHdlIG92ZXJyaWRlIGFsbCB0aGUgcHJldmlvdXNseVxuICAgICAgICAgIC8vIGNvbXB1dGVkIHBvc2l0aW9ucyB0byBzZXQgaXQgY29ycmVjdGx5LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nQ3Jvc3NEaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICAgICAgLy8gRm9yIGEgcmVsYXRpdmUgY2hpbGRyZW4sIHdlJ3JlIGVpdGhlciB1c2luZyBhbGlnbkl0ZW1zIChwYXJlbnQpIG9yXG4gICAgICAgICAgLy8gYWxpZ25TZWxmIChjaGlsZCkgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHRoZSBwb3NpdGlvbiBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgIC8vIFRoaXMgdmFyaWFibGUgaXMgaW50ZW50aW9uYWxseSByZS1kZWZpbmVkIGFzIHRoZSBjb2RlIGlzIHRyYW5zcGlsZWQgdG8gYSBibG9jayBzY29wZSBsYW5ndWFnZVxuICAgICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICAgIC8vIFlvdSBjYW4gb25seSBzdHJldGNoIGlmIHRoZSBkaW1lbnNpb24gaGFzIG5vdCBhbHJlYWR5IGJlZW4gc2V0XG4gICAgICAgICAgICAgIC8vIHByZXZpb3VzbHkuXG4gICAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBzcGFjZSBiZXR3ZWVuIHRoZSBwYXJlbnQgZGltZW5zaW9ucytwYWRkaW5nIGFuZCBjaGlsZFxuICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zK21hcmdpbi5cbiAgICAgICAgICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0Nyb3NzRGltID0gY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltIC8gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gQ1NTX0FMSUdOX0ZMRVhfRU5EXG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIGFwcGx5IHRoZSBwb3NpdGlvblxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdDcm9zc0RpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaW5lc0Nyb3NzRGltICs9IGNyb3NzRGltO1xuICAgICAgbGluZXNNYWluRGltID0gZm1heGYobGluZXNNYWluRGltLCBtYWluRGltKTtcbiAgICAgIGxpbmVzQ291bnQgKz0gMTtcbiAgICAgIHN0YXJ0TGluZSA9IGVuZExpbmU7XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRT5cbiAgICAvL1xuICAgIC8vIE5vdGUocHJlbmF1eCk6IE1vcmUgdGhhbiBvbmUgbGluZSwgd2UgbmVlZCB0byBsYXlvdXQgdGhlIGNyb3NzQXhpc1xuICAgIC8vIGFjY29yZGluZyB0byBhbGlnbkNvbnRlbnQuXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgd2UgY291bGQgcHJvYmFibHkgcmVtb3ZlIDxMb29wIEQ+IGFuZCBoYW5kbGUgdGhlIG9uZSBsaW5lIGNhc2VcbiAgICAvLyBoZXJlIHRvbywgYnV0IGZvciB0aGUgbW9tZW50IHRoaXMgaXMgc2FmZXIgc2luY2UgaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGhcbiAgICAvLyBwcmV2aW91c2x5IHdvcmtpbmcgY29kZS5cbiAgICAvL1xuICAgIC8vIFNlZSBzcGVjczpcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDEyL0NSLWNzczMtZmxleGJveC0yMDEyMDkxOC8jbGF5b3V0LWFsZ29yaXRobVxuICAgIC8vIHNlY3Rpb24gOS40XG4gICAgLy9cbiAgICBpZiAobGluZXNDb3VudCA+IDEgJiYgaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIHZhci8qZmxvYXQqLyBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzO1xuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0FsaWduQ29udGVudERpbSA9IG5vZGVDcm9zc0F4aXNJbm5lclNpemUgLSBsaW5lc0Nyb3NzRGltO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW1MZWFkID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBjdXJyZW50TGVhZCA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnQgPSBnZXRBbGlnbkNvbnRlbnQobm9kZSk7XG4gICAgICBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICBpZiAobm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA+IGxpbmVzQ3Jvc3NEaW0pIHtcbiAgICAgICAgICBjcm9zc0RpbUxlYWQgPSAocmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gbGluZXNDb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLyppbnQqLyBlbmRJbmRleCA9IDA7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGluZXNDb3VudDsgKytpKSB7XG4gICAgICAgIHZhci8qaW50Ki8gc3RhcnRJbmRleCA9IGVuZEluZGV4O1xuXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIGxpbmUncyBoZWlnaHQgYW5kIGZpbmQgdGhlIGVuZEluZGV4XG4gICAgICAgIHZhci8qZmxvYXQqLyBsaW5lSGVpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgY2hpbGRDb3VudDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjaGlsZC5saW5lSW5kZXggIT09IGkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICBsaW5lSGVpZ2h0ID0gZm1heGYoXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gKyBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbmRJbmRleCA9IGlpO1xuICAgICAgICBsaW5lSGVpZ2h0ICs9IGNyb3NzRGltTGVhZDtcblxuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBlbmRJbmRleDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudEFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgbGluZUhlaWdodCAtIGdldFRyYWlsaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpIC0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgdmFyLypmbG9hdCovIGNoaWxkSGVpZ2h0ID0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIChsaW5lSGVpZ2h0IC0gY2hpbGRIZWlnaHQpIC8gMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgICAvLyBUT0RPKHByZW5hdXgpOiBDb3JyZWN0bHkgc2V0IHRoZSBoZWlnaHQgb2YgaXRlbXMgd2l0aCB1bmRlZmluZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChhdXRvKSBjcm9zc0F4aXMgZGltZW5zaW9uLlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRMZWFkICs9IGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gbmVlZHNNYWluVHJhaWxpbmdQb3MgPSBmYWxzZTtcbiAgICB2YXIvKmJvb2wqLyBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSBmYWxzZTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGRpZG4ndCBzcGVjaWZ5IGEgd2lkdGggb3IgaGVpZ2h0LCBhbmQgaXQgaGFzIG5vdCBiZWVuIHNldFxuICAgIC8vIGJ5IHRoZSBjb250YWluZXIsIHRoZW4gd2Ugc2V0IGl0IHZpYSB0aGUgY2hpbGRyZW4uXG4gICAgaWYgKCFpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBXZSdyZSBtaXNzaW5nIHRoZSBsYXN0IHBhZGRpbmcgYXQgdGhpcyBwb2ludCB0byBnZXQgdGhlIGZpbmFsXG4gICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICBib3VuZEF4aXMobm9kZSwgbWFpbkF4aXMsIGxpbmVzTWFpbkRpbSArIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcykpLFxuICAgICAgICAvLyBXZSBjYW4gbmV2ZXIgYXNzaWduIGEgd2lkdGggc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJzXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpblxuICAgICAgKTtcblxuICAgICAgaWYgKG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBsaW5lc0Nyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICk7XG5cbiAgICAgIGlmIChjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRj4gU2V0IHRyYWlsaW5nIHBvc2l0aW9uIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1BvcyB8fCBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRz4gQ2FsY3VsYXRlIGRpbWVuc2lvbnMgZm9yIGFic29sdXRlbHkgcG9zaXRpb25lZCBlbGVtZW50c1xuICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gZmlyc3RBYnNvbHV0ZUNoaWxkO1xuICAgIHdoaWxlIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yXG4gICAgICAvLyB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGggbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICFpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2xlYWRpbmdbYXhpc11dID1cbiAgICAgICAgICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZDtcbiAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICBub2RlLnNob3VsZFVwZGF0ZSA9IHRydWU7XG5cbiAgICB2YXIgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb24gfHwgQ1NTX0RJUkVDVElPTl9MVFI7XG4gICAgdmFyIHNraXBMYXlvdXQgPVxuICAgICAgIW5vZGUuaXNEaXJ0eSAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID09PSBub2RlLmxheW91dC5oZWlnaHQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9PT0gbm9kZS5sYXlvdXQud2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9PT0gcGFyZW50TWF4V2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPT09IGRpcmVjdGlvbjtcblxuICAgIGlmIChza2lwTGF5b3V0KSB7XG4gICAgICBub2RlLmxheW91dC53aWR0aCA9IG5vZGUubGFzdExheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG5vZGUubGFzdExheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxheW91dC50b3AgPSBub2RlLmxhc3RMYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXlvdXQubGVmdCA9IG5vZGUubGFzdExheW91dC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW5vZGUubGFzdExheW91dCkge1xuICAgICAgICBub2RlLmxhc3RMYXlvdXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID0gcGFyZW50TWF4V2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgICAvLyBSZXNldCBjaGlsZCBsYXlvdXRzXG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgY2hpbGQubGF5b3V0LndpZHRoID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQuaGVpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQudG9wID0gMDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmxlZnQgPSAwO1xuICAgICAgfSk7XG5cbiAgICAgIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pO1xuXG4gICAgICBub2RlLmxhc3RMYXlvdXQud2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5oZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQudG9wID0gbm9kZS5sYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmxlZnQgPSBub2RlLmxheW91dC5sZWZ0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGF5b3V0Tm9kZUltcGw6IGxheW91dE5vZGVJbXBsLFxuICAgIGNvbXB1dGVMYXlvdXQ6IGxheW91dE5vZGUsXG4gICAgZmlsbE5vZGVzOiBmaWxsTm9kZXNcbiAgfTtcbn0pKCk7XG5cbi8vIFRoaXMgbW9kdWxlIGV4cG9ydCBpcyBvbmx5IHVzZWQgZm9yIHRoZSBwdXJwb3NlcyBvZiB1bml0IHRlc3RpbmcgdGhpcyBmaWxlLiBXaGVuXG4vLyB0aGUgbGlicmFyeSBpcyBwYWNrYWdlZCB0aGlzIGZpbGUgaXMgaW5jbHVkZWQgd2l0aGluIGNzcy1sYXlvdXQuanMgd2hpY2ggZm9ybXNcbi8vIHRoZSBwdWJsaWMgQVBJLlxuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbXB1dGVMYXlvdXQ7XG59XG5cblxuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAvLyBkaXNhYmxpbmcgRVNMaW50IGJlY2F1c2UgdGhpcyBjb2RlIHJlbGllcyBvbiB0aGUgYWJvdmUgaW5jbHVkZVxuICAgIGNvbXB1dGVMYXlvdXQuZmlsbE5vZGVzKG5vZGUpO1xuICAgIGNvbXB1dGVMYXlvdXQuY29tcHV0ZUxheW91dChub2RlKTtcbiAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgfTtcbn0pKTtcbiIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xubW9kdWxlLmV4cG9ydHMuVGlueUVtaXR0ZXIgPSBFO1xuIiwiaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2ltYWdlTWFuYWdlcic7XG5jb25zdCBFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMudGV4dHVyZSA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2Uoc3JjLCAodGV4dHVyZSwgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICB9XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXZlbnQuZW1pdCgndGV4dF9fbG9hZF9fZG9uZScpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2VDb25maWcoZm50VGV4dDogc3RyaW5nKSB7XG4gICAgZm50VGV4dCA9IGZudFRleHQuc3BsaXQoJ1xcclxcbicpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IGZudFRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS50cmltKCkuc3BsaXQoJyAnKSk7XG5cbiAgICBjb25zdCBjaGFyc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY2hhcnMnKTtcbiAgICBjb25zdCBjaGFyc0NvdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJzTGluZS5saW5lLCAnY291bnQnKTtcblxuICAgIGNvbnN0IGNvbW1vbkxpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY29tbW9uJyk7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjb21tb25MaW5lLmxpbmUsICdsaW5lSGVpZ2h0Jyk7XG5cbiAgICBjb25zdCBpbmZvTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdpbmZvJyk7XG4gICAgdGhpcy5mb250U2l6ZSA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoaW5mb0xpbmUubGluZSwgJ3NpemUnKTtcblxuICAgIC8vIOaOpeWNuCBrZXJuaW5nc1xuICAgIGNvbnN0IGtlcm5pbmdzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdrZXJuaW5ncycpO1xuICAgIGxldCBrZXJuaW5nc0NvdW50ID0gMDtcbiAgICBsZXQga2VybmluZ3NTdGFydCA9IC0xO1xuICAgIGlmIChrZXJuaW5nc0xpbmUubGluZSkge1xuICAgICAga2VybmluZ3NDb3VudCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoa2VybmluZ3NMaW5lLmxpbmUsICdjb3VudCcpO1xuICAgICAga2VybmluZ3NTdGFydCA9IGtlcm5pbmdzTGluZS5pbmRleCArIDE7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcnM6IENoYXJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDQ7IGkgPCA0ICsgY2hhcnNDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyVGV4dDogc3RyaW5nID0gbGluZXNbaV07XG4gICAgICBjb25zdCBsZXR0ZXI6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2lkJykpO1xuXG4gICAgICBjb25zdCBjOiBDaGFyRGF0YSA9IHtcbiAgICAgICAgeDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3gnKSxcbiAgICAgICAgeTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3knKSxcbiAgICAgICAgdzogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3dpZHRoJyksXG4gICAgICAgIGg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdoZWlnaHQnKSxcbiAgICAgICAgb2ZmWDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hvZmZzZXQnKSxcbiAgICAgICAgb2ZmWTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3lvZmZzZXQnKSxcbiAgICAgICAgeGFkdmFuY2U6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4YWR2YW5jZScpLFxuICAgICAgICBrZXJuaW5nOiB7fVxuICAgICAgfTtcbiAgICAgIGNoYXJzW2xldHRlcl0gPSBjO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIGtlcm5pbmdzXG4gICAgaWYgKGtlcm5pbmdzQ291bnQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBrZXJuaW5nc1N0YXJ0OyBpIDw9IGtlcm5pbmdzU3RhcnQgKyBrZXJuaW5nc0NvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcbiAgICAgICAgY29uc3QgZmlyc3Q6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnZmlyc3QnKSk7XG4gICAgICAgIGNvbnN0IHNlY29uZDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdzZWNvbmQnKSk7XG4gICAgICAgIGNvbnN0IGFtb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnYW1vdW50Jyk7XG5cbiAgICAgICAgaWYgKGNoYXJzW3NlY29uZF0pIHtcbiAgICAgICAgICBjaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJzO1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZDogc3RyaW5nW11bXSwgbGluZU5hbWUgPSAnJyk6IENvbmZpZ0xpbmVEYXRhIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGluZTogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBsZW4gPSBsaW5lc1BhcnNlZC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuXG4gICAgICBpZiAoaXRlbVswXSA9PT0gbGluZU5hbWUpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBsaW5lID0gaXRlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZSxcbiAgICAgIGluZGV4LFxuICAgIH07XG4gIH1cblxuICBnZXRDb25maWdCeUtleUluT25lTGluZShjb25maWdUZXh0OiBzdHJpbmdbXSB8IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtQ29uZmlnVGV4dExpc3QgPSBBcnJheS5pc0FycmF5KGNvbmZpZ1RleHQpID8gY29uZmlnVGV4dCA6IGNvbmZpZ1RleHQuc3BsaXQoJyAnKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gaXRlbUNvbmZpZ1RleHRMaXN0OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0ID0gaXRlbUNvbmZpZ1RleHRMaXN0W2ldO1xuICAgICAgaWYgKGtleSA9PT0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKDAsIGtleS5sZW5ndGgpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKGtleS5sZW5ndGggKyAxKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufVxuIiwiaW50ZXJmYWNlIERlYnVnSW5mb0l0ZW0ge1xuICBzdGFydDogbnVtYmVyO1xuICBpc0lubmVyOiBib29sZWFuO1xuICBlbmQ/OiBudW1iZXI7XG4gIGNvc3Q/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlYnVnSW5mbyB7XG4gIHB1YmxpYyBpbmZvOiB7IFtrZXk6IHN0cmluZ106IERlYnVnSW5mb0l0ZW0gfSA9IHt9O1xuICBwdWJsaWMgdG90YWxTdGFydDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvdGFsQ29zdDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBzdGFydChuYW1lOiBzdHJpbmcsIGlzSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLnRvdGFsU3RhcnQgPT09IDApIHtcbiAgICAgIHRoaXMudG90YWxTdGFydCA9IERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmZvW25hbWVdID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBpc0lubmVyLFxuICAgIH07XG4gIH1cblxuICBlbmQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaW5mb1tuYW1lXSkge1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmVuZCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uY29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLmluZm9bbmFtZV0uc3RhcnQ7XG4gICAgICB0aGlzLnRvdGFsQ29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLnRvdGFsU3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbmZvID0ge307XG4gICAgdGhpcy50b3RhbFN0YXJ0ID0gMDtcbiAgICB0aGlzLnRvdGFsQ29zdCA9IDA7XG4gIH1cblxuICBsb2cobmVlZElubmVyOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBsb2dJbmZvID0gJ0xheW91dCBkZWJ1ZyBpbmZvOiBcXG4nO1xuICAgIGxvZ0luZm8gKz0gT2JqZWN0LmtleXModGhpcy5pbmZvKS5yZWR1Y2UoKHN1bSwgY3VycikgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5mb1tjdXJyXS5pc0lubmVyICYmICFuZWVkSW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBgJHtjdXJyfTogJHt0aGlzLmluZm9bY3Vycl0uY29zdH1cXG5gO1xuICAgICAgcmV0dXJuIHN1bTtcbiAgICB9LCAnJyk7XG5cbiAgICBsb2dJbmZvICs9IGB0b3RhbENvc3Q6ICR7dGhpcy50b3RhbENvc3R9XFxuYDtcblxuICAgIHJldHVybiBsb2dJbmZvO1xuICB9XG59XG4iLCJpbXBvcnQgUG9vbCBmcm9tICcuL3Bvb2wnO1xuaW1wb3J0IHsgbm9uZSwgY3JlYXRlSW1hZ2UgfSBmcm9tICcuL3V0aWwnO1xuXG50eXBlIENhbGxiYWNrID0gKGltZzogSFRNTEltYWdlRWxlbWVudCwgZnJvbUNhY2hlOiBib29sZWFuKSA9PiB2b2lkO1xuaW50ZXJmYWNlIEltYWdlQ2FjaGUge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGxvYWREb25lOiBib29sZWFuO1xuICBvbmxvYWRjYmtzOiBDYWxsYmFja1tdO1xuICBvbmVycm9yY2JrczogQ2FsbGJhY2tbXTtcbn1cblxuY2xhc3MgSW1hZ2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBpbWdQb29sID0gbmV3IFBvb2w8SW1hZ2VDYWNoZT4oJ2ltZ1Bvb2wnKTtcbiAgXG4gIGdldFJlcyhzcmM6IHN0cmluZyk6IEltYWdlQ2FjaGUge1xuICAgIHJldHVybiB0aGlzLmltZ1Bvb2wuZ2V0KHNyYyk7XG4gIH1cblxuICBsb2FkSW1hZ2VQcm9taXNlKHNyYzogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRJbWFnZShzcmMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcsIHN1Y2Nlc3M6IENhbGxiYWNrID0gbm9uZSwgZmFpbDogQ2FsbGJhY2sgPSBub25lKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGlmICghc3JjKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5nZXRSZXMoc3JjKTtcblxuICAgIC8vIOWbvueJh+W3sue7j+iiq+WKoOi9vei/h++8jOebtOaOpei/lOWbnuWbvueJh+W5tuS4lOaJp+ihjOWbnuiwg1xuICAgIGlmIChjYWNoZSAmJiBjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuICAgICAgc3VjY2VzcyhpbWcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoY2FjaGUgJiYgIWNhY2hlLmxvYWREb25lKSB7XG4gICAgICAvLyDlm77niYfmraPlnKjliqDovb3ov4fnqIvkuK3vvIzov5Tlm57lm77niYflubbkuJTnrYnlvoXlm77niYfliqDovb3lrozmiJDmiafooYzlm57osINcbiAgICAgIGltZyA9IGNhY2hlLmltZztcblxuICAgICAgY2FjaGUub25sb2FkY2Jrcy5wdXNoKHN1Y2Nlc3MpO1xuICAgICAgY2FjaGUub25lcnJvcmNia3MucHVzaChmYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Yib5bu65Zu+54mH77yM5bCG5Zue6LCD5Ye95pWw5o6o5YWl5Zue6LCD5Ye95pWw5qCIXG4gICAgICBpbWcgPSBjcmVhdGVJbWFnZSgpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHtcbiAgICAgICAgaW1nLFxuICAgICAgICBsb2FkRG9uZTogZmFsc2UsXG4gICAgICAgIG9ubG9hZGNia3M6IFtzdWNjZXNzXSxcbiAgICAgICAgb25lcnJvcmNia3M6IFtmYWlsXSxcbiAgICAgIH1cbiAgICAgXG4gICAgICB0aGlzLmltZ1Bvb2wuc2V0KHNyYywgbmV3Q2FjaGUpO1xuXG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5sb2FkRG9uZSA9IHRydWU7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbWFnZU1hbmFnZXIoKTtcbiIsImNvbnN0IHBvb2xzOiBQb29sPGFueT5bXSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sPFQ+IHtcbiAgcHVibGljIG5hbWUgPSAncG9vbCdcbiAgcHVibGljIHBvb2w6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG5cbiAgY29uc3RydWN0b3IobmFtZSA9ICdwb29sJykge1xuICAgIGNvbnN0IGN1cnIgPSBwb29scy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmIChjdXJyKSB7XG4gICAgICByZXR1cm4gY3VycjtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuXG4gICAgcG9vbHMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldChrZXk6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLnBvb2xba2V5XTtcbiAgfVxuXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQpIHtcbiAgICB0aGlzLnBvb2xba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5wb29sID0ge307XG4gIH1cblxuICBnZXRMaXN0KCk6IFRbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5wb29sKTtcbiAgfVxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIHdpZHRoID0gMDtcbiAgcHVibGljIGhlaWdodCA9IDA7XG4gIHB1YmxpYyBsZWZ0ID0gMDtcbiAgcHVibGljIHJpZ2h0ID0gMDtcbiAgcHVibGljIHRvcCA9IDA7XG4gIHB1YmxpYyBib3R0b20gPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLnNldChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgc2V0KGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIHRoaXMucmlnaHQgPSB0aGlzLmxlZnQgKyB0aGlzLndpZHRoO1xuICAgIHRoaXMuYm90dG9tID0gdGhpcy50b3AgKyB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiDliKTmlq3kuKTkuKrnn6nlvaLmmK/lkKbnm7jkuqRcbiAgICog5Y6f55CG5Y+v6KeBOiBodHRwczovL3podWFubGFuLnpoaWh1LmNvbS9wLzI5NzA0MDY0XG4gICAqL1xuICBpbnRlcnNlY3RzKHJlY3Q6IFJlY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISh0aGlzLnJpZ2h0IDwgcmVjdC5sZWZ0IHx8IHJlY3QucmlnaHQgPCB0aGlzLmxlZnQgfHwgdGhpcy5ib3R0b20gPCByZWN0LnRvcCB8fCByZWN0LmJvdHRvbSA8IHRoaXMudG9wKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2VyIHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBzdGFydGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYW5pbWF0aW9uSWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgY2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgbmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyQ2JzOiBDYWxsYmFja1tdID0gW107XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYigpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiAgdGhpcy5jYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgbmV4dChjYjogQ2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm5leHRDYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLmNicy5pbmRleE9mKGNiKSA+IC0xKSB7XG4gICAgICBjb25zdCBsaXN0ID0gaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMgOiB0aGlzLmNicztcbiAgICAgIGxpc3Quc3BsaWNlKHRoaXMuY2JzLmluZGV4T2YoY2IpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2JzLmxlbmd0aCAmJiAhdGhpcy5pbm5lckNicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbklkID09PSBudWxsICYmICh0aGlzLmNicy5sZW5ndGggfHwgdGhpcy5pbm5lckNicy5sZW5ndGgpKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vbmUoKSB7IH1cbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIFRvdWNoTXNnIHtcbiAgdG91Y2hzdGFydD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIHRvdWNoZW5kPzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbn1cblxuLyoqXG4gKiDmoLnmja7op6bmkbjml7bplb/lkozop6bmkbjkvY3nva7lj5jljJbmnaXliKTmlq3mmK/lkKblsZ7kuo7ngrnlh7vkuovku7ZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpY2sodG91Y2hNc2c6IFRvdWNoTXNnKSB7XG4gIGNvbnN0IHN0YXJ0ID0gdG91Y2hNc2cudG91Y2hzdGFydDtcbiAgY29uc3QgZW5kID0gdG91Y2hNc2cudG91Y2hlbmQ7XG5cbiAgaWYgKCFzdGFydFxuICAgIHx8ICFlbmRcbiAgICB8fCAhc3RhcnQudGltZVN0YW1wXG4gICAgfHwgIWVuZC50aW1lU3RhbXBcbiAgICB8fCBzdGFydC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgc3RhcnQucGFnZVkgPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VZID09PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRQb3NYID0gc3RhcnQucGFnZVg7XG4gIGNvbnN0IHN0YXJ0UG9zWSA9IHN0YXJ0LnBhZ2VZO1xuXG4gIGNvbnN0IGVuZFBvc1ggPSBlbmQucGFnZVg7XG4gIGNvbnN0IGVuZFBvc1kgPSBlbmQucGFnZVk7XG5cbiAgY29uc3QgdG91Y2hUaW1lcyA9IGVuZC50aW1lU3RhbXAgLSBzdGFydC50aW1lU3RhbXA7XG5cbiAgcmV0dXJuICEhKE1hdGguYWJzKGVuZFBvc1kgLSBzdGFydFBvc1kpIDwgMzBcbiAgICAmJiBNYXRoLmFicyhlbmRQb3NYIC0gc3RhcnRQb3NYKSA8IDMwXG4gICAgJiYgdG91Y2hUaW1lcyA8IDMwMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDYW52YXMoKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiovXG4gIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9fZW52LmNyZWF0ZUNhbnZhcygpO1xuICB9XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUltYWdlKCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYqL1xuICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBfX2Vudi5jcmVhdGVJbWFnZSgpO1xuICB9XG4gIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbn1cblxubGV0IF9kcHI6IG51bWJlcjtcbi8vIG9ubHkgQmFpZHUgcGxhdGZvcm0gbmVlZCB0byByZWNpZXZlIHN5c3RlbSBpbmZvIGZyb20gbWFpbiBjb250ZXh0XG5pZiAodHlwZW9mIHN3YW4gIT09ICd1bmRlZmluZWQnKSB7XG4gIF9fZW52Lm9uTWVzc2FnZSgocmVzOiBhbnkpID0+IHtcbiAgICBpZiAocmVzICYmIHJlcy50eXBlID09PSAnZW5naW5lJykge1xuICAgICAgaWYgKHJlcy5ldmVudCA9PT0gJ3N5c3RlbUluZm8nKSB7XG4gICAgICAgIF9kcHIgPSByZXMuc3lzdGVtSW5mby5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREcHIoKSB7XG4gIC8vIHJldHVybiAzO1xuICBpZiAodHlwZW9mIF9kcHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9kcHI7XG4gIH1cbiAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcgJiYgX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMpIHtcbiAgICBfZHByID0gX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMoKS5kZXZpY2VQaXhlbFJhdGlvO1xuICB9IGVsc2UgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG4gICAgX2RwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybignW0xheW91dF0gZmFpbGVkIHRvIGFjY2VzcyBkZXZpY2UgcGl4ZWwgcmF0aW8sIGZhbGxiYWNrIHRvIDEnKTtcbiAgICBfZHByID0gMTtcbiAgfVxuICByZXR1cm4gX2Rwcjtcbn1cblxuZXhwb3J0IGVudW0gU1RBVEUge1xuICBVTklOSVQgPSAnVU5JTklUJyxcbiAgSU5JVEVEID0gJ0lOSVRFRCcsXG4gIFJFTkRFUkVEID0gJ1JFTkRFUkVEJyxcbiAgQ0xFQVIgPSAnQ0xFQVInLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eCAmJiBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUb3VjaEFycmF5KHRvdWNoZXM6IEdhbWVUb3VjaFtdKSB7XG4gIHJldHVybiB0b3VjaGVzLm1hcCh0b3VjaCA9PiAoe1xuICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXG4gICAgcGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIHBhZ2VZOiB0b3VjaC5wYWdlWSxcbiAgICBjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuICAgIGNsaWVudFk6IHRvdWNoLmNsaWVudFksXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR2FtZVRvdWNoRXZlbnQoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KTogZSBpcyBHYW1lVG91Y2hFdmVudCB7XG4gIHJldHVybiAndG91Y2hlcycgaW4gZTtcbn0iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLy8gY29tcG9uZW50c1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgRWxlbWVudCB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBJTGF5b3V0LCBJTGF5b3V0Qm94IH0gZnJvbSAnLi4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzJztcblxuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogYW55O1xufVxuXG5pbnRlcmZhY2UgVHJlZU5vZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIGF0dHI6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGNoaWxkcmVuOiBUcmVlTm9kZVtdO1xufVxuXG5jb25zdCBjb25zdHJ1Y3Rvck1hcDogeyBba2V5OiBzdHJpbmddOiBDb25zdHJ1Y3RvciB9ID0ge1xuICB2aWV3OiBWaWV3LFxuICB0ZXh0OiBUZXh0LFxuICBpbWFnZTogSW1hZ2UsXG4gIHNjcm9sbHZpZXc6IFNjcm9sbFZpZXcsXG4gIGJpdG1hcHRleHQ6IEJpdE1hcFRleHQsXG4gIGNhbnZhczogQ2FudmFzLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50KG5hbWU6IHN0cmluZywgQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yKSB7XG4gIGNvbnN0cnVjdG9yTWFwW25hbWVdID0gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIGlzUGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiAvXFxkKyg/OlxcLlxcZCspPyUvLnRlc3QoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlciwgcGFyZW50RGF0YTogbnVtYmVyKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgY29uc3QgbWF0Y2hEYXRhID0gZGF0YS5tYXRjaCgvKFxcZCsoPzpcXC5cXGQrKT8pJS8pO1xuICBpZiAobWF0Y2hEYXRhICYmIG1hdGNoRGF0YVsxXSkge1xuICAgIHJldHVybiBwYXJlbnREYXRhICogcGFyc2VGbG9hdChtYXRjaERhdGFbMV0pICogMC4wMTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKG5vZGU6IFRyZWVOb2RlLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgcGFyZW50PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW25vZGUubmFtZV07XG5cbiAgaWYgKCFDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdIOS4jeaUr+aMgee7hOS7tiAke25vZGUubmFtZX1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbiB8fCBbXTtcblxuICBjb25zdCBhdHRyID0gbm9kZS5hdHRyIHx8IHt9O1xuICBjb25zdCBkYXRhc2V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGlkID0gYXR0ci5pZCB8fCAnJztcblxuICBjb25zdCBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gT2JqZWN0LmtleXMoYXR0cikucmVkdWNlKChvYmosIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGF0dHJba2V5XTtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGtleTtcblxuICAgICAgaWYgKGtleSA9PT0gJ2lkJykge1xuICAgICAgICBvYmouc3R5bGUgPSBPYmplY3QuYXNzaWduKG9iai5zdHlsZSB8fCB7fSwgc3R5bGVbaWRdIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IHZhbHVlLnNwbGl0KC9cXHMrLykucmVkdWNlKChyZXMsIG9uZUNsYXNzKSA9PiBPYmplY3QuYXNzaWduKHJlcywgc3R5bGVbb25lQ2xhc3NdKSwgb2JqLnN0eWxlIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cmlidXRlLnN0YXJ0c1dpdGgoJ2RhdGEtJykpIHtcbiAgICAgICAgY29uc3QgZGF0YUtleSA9IGF0dHJpYnV0ZS5zdWJzdHJpbmcoNSk7XG5cbiAgICAgICAgZGF0YXNldFtkYXRhS2V5XSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBvYmouZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgYW55Pik7XG5cbiAgLy8g55So5LqO5ZCO57ut5YWD57Sg5p+l6K+iXG4gIGFyZ3MuaWROYW1lID0gaWQ7XG4gIC8vIEB0cy1pZ25vcmVcbiAgdGhpcy5lbGVDb3VudCArPSAxO1xuICAvLyBAdHMtaWdub3JlXG4gIGFyZ3MuaWQgPSB0aGlzLmVsZUNvdW50O1xuICBhcmdzLmNsYXNzTmFtZSA9IGF0dHIuY2xhc3MgfHwgJyc7XG5cbiAgY29uc3QgdGhpc1N0eWxlID0gYXJncy5zdHlsZTtcbiAgaWYgKHRoaXNTdHlsZSkge1xuICAgIGxldCBwYXJlbnRTdHlsZTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IHBhcmVudC5zdHlsZTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzaGFyZWRDYW52YXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IHNoYXJlZENhbnZhcztcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gX19lbnYuZ2V0U2hhcmVkQ2FudmFzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFN0eWxlID0ge1xuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IDE1MCxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLndpZHRoKSkge1xuICAgICAgdGhpc1N0eWxlLndpZHRoID0gcGFyZW50U3R5bGUud2lkdGggPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUud2lkdGgsIHBhcmVudFN0eWxlLndpZHRoKSA6IDA7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLmhlaWdodCkpIHtcbiAgICAgIHRoaXNTdHlsZS5oZWlnaHQgPSBwYXJlbnRTdHlsZS5oZWlnaHQgPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0LCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhhcmdzKTtcbiAgY29uc3QgZWxlbWVudCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbGVtZW50LnJvb3QgPSB0aGlzO1xuICBlbGVtZW50LnRhZ05hbWUgPSBub2RlLm5hbWU7XG5cbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlOiBUcmVlTm9kZSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjaGlsZEVsZW1lbnQgPSBjcmVhdGUuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIHN0eWxlLCBhcmdzKTtcblxuICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuYWRkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuKGNoaWxkcmVuOiBFbGVtZW50W10sIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlciA9IHRydWUpIHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAvLyBjaGlsZC5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICBjaGlsZC5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2hpbGQuaW5zZXJ0KGNvbnRleHQsIG5lZWRSZW5kZXIpO1xuXG4gICAgLy8gU2Nyb2xsVmlld+eahOWtkOiKgueCuea4suafk+S6pOe7mVNjcm9sbFZpZXfoh6rlt7HvvIzkuI3mlK/mjIHltYzlpZdTY3JvbGxWaWV3XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBjb250ZXh0LCAgY2hpbGQudHlwZSA9PT0gJ1Njcm9sbFZpZXcnID8gZmFsc2UgOiBuZWVkUmVuZGVyKTtcbiAgfSk7XG59XG5cbi8qKlxuICog5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXRDaGlsZHJlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5sYXlvdXRCb3ggPSBjaGlsZC5sYXlvdXRCb3ggfHwge307XG5cbiAgICBbJ2xlZnQnLCAndG9wJywgJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGQubGF5b3V0Qm94W3Byb3AgYXMga2V5b2YgSUxheW91dEJveF0gPSBjaGlsZC5sYXlvdXQ/Lltwcm9wIGFzIGtleW9mIElMYXlvdXRdIGFzIG51bWJlcjtcbiAgICB9KTtcblxuICAgIGlmIChjaGlsZC5wYXJlbnQpIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVggfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVkgfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9XG5cbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZO1xuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVg7XG5cblxuICAgIGxheW91dENoaWxkcmVuKGNoaWxkKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vbmUoKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlVHJlZShlbGVtZW50OiBFbGVtZW50LCBjYWxsYmFjazogQ2FsbGJhY2sgPSBub25lKSB7XG4gIGNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpdGVyYXRlVHJlZShjaGlsZCwgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRDaGlsZHJlbiA9IChjaGlsZHJlbjogRWxlbWVudFtdKSA9PiB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgaWYgKGNoaWxkLnR5cGUgIT09ICdTY3JvbGxWaWV3Jykge1xuICAgICAgcmVwYWludENoaWxkcmVuKGNoaWxkLmNoaWxkcmVuKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRUcmVlID0gKHRyZWU6IEVsZW1lbnQpID0+IHtcbiAgdHJlZS5yZXBhaW50KCk7XG5cbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIHJlcGFpbnRUcmVlKGNoaWxkKTtcbiAgfSk7XG59O1xuXG5pbnRlcmZhY2UgRWxlbWVudEFyZ3Mge1xuICBzdHlsZTogb2JqZWN0O1xuICBpZE5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGRhdGFzZXQ6IG9iamVjdDtcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQgZXh0ZW5kcyBFbGVtZW50Pihyb290OiBULCBlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSwgcGFyZW50PzogRWxlbWVudCkge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW2VsZW1lbnQudGFnTmFtZSBhcyBzdHJpbmddO1xuICAvLyBAdHMtaWdub3JlXG4gIHJvb3QuZWxlQ291bnQgKz0gMTtcblxuICBjb25zdCBhcmdzOiBFbGVtZW50QXJncyA9IHtcbiAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5zdHlsZSksXG4gICAgaWROYW1lOiBlbGVtZW50LmlkTmFtZSxcbiAgICBjbGFzc05hbWU6IGVsZW1lbnQuY2xhc3NOYW1lLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogcm9vdC5lbGVDb3VudCxcbiAgICBkYXRhc2V0OiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LmRhdGFzZXQpLFxuICB9O1xuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICBhcmdzLnNyYyA9IGVsZW1lbnQuc3JjO1xuICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBUZXh0IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBCaXRNYXBUZXh0KSB7XG4gICAgYXJncy52YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBjb25zdCBuZXdFbGVtZW5ldCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgbmV3RWxlbWVuZXQucm9vdCA9IHJvb3Q7XG4gIC8vIEB0cy1pZ25vcmVcbiAgbmV3RWxlbWVuZXQuaW5zZXJ0KHJvb3QucmVuZGVyQ29udGV4dCwgZmFsc2UpO1xuICBuZXdFbGVtZW5ldC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuYWRkKG5ld0VsZW1lbmV0KTtcbiAgfVxuXG4gIGlmIChkZWVwKSB7XG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2xvbmUocm9vdCwgY2hpbGQsIGRlZXAsIG5ld0VsZW1lbmV0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXdFbGVtZW5ldDtcbn1cblxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4uL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIGZvbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnQml0TWFwVGV4dCc7XG4gIHByaXZhdGUgdmFsdWVzcmM6IHN0cmluZztcbiAgcHVibGljIGZvbnQ6IEJpdE1hcEZvbnQ7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUJpdE1hcFRleHRPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICB2YWx1ZSA9ICcnLFxuICAgICAgZm9udCA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuXG4gICAgdGhpcy5mb250ID0gYml0TWFwUG9vbC5nZXQoZm9udCk7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE1pc3NpbmcgQml0bWFwRm9udCBcIiR7Zm9udH1cIiwgcGxlYXNlIGludm9rZSBBUEkgXCJyZWdpc3RCaXRNYXBGb250XCIgYmVmb3JlIHVzaW5nIFwiQml0TWFwVGV4dFwiYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JlcGFpbnQnKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9udC5yZWFkeSkge1xuICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9udC5ldmVudC5vbigndGV4dF9fbG9hZF9fZG9uZScsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFRleHRCb3VuZHMoKSB7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHsgbGV0dGVyU3BhY2luZyA9IDAgfSA9IHN0eWxlO1xuICAgIGxldCB3aWR0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIHdpZHRoICs9IGNmZy53O1xuXG4gICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgIHdpZHRoICs9IGxldHRlclNwYWNpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0OiB0aGlzLmZvbnQubGluZUhlaWdodCB9O1xuICB9XG5cbiAgcmVuZGVyVGV4dChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0VGV4dEJvdW5kcygpO1xuICAgIGNvbnN0IGRlZmF1bHRMaW5lSGVpZ2h0ID0gdGhpcy5mb250LmxpbmVIZWlnaHQgYXMgbnVtYmVyO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoID0gMCwgLy8g5rKh5pyJ6K6+572u6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICBoZWlnaHQgPSAwLCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIC8vIGxpbmVIZWlnaHQgPSBkZWZhdWx0TGluZUhlaWdodCwgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE6auY5bqmXG4gICAgICB0ZXh0QWxpZ24sIC8vIOaWh+Wtl+W3puWPs+Wvuem9kOaWueW8j1xuICAgICAgdmVydGljYWxBbGlnbixcbiAgICAgIGxldHRlclNwYWNpbmcgPSAwLFxuICAgIH0gPSBzdHlsZTtcbiAgICAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gKHN0eWxlLmxpbmVIZWlnaHQgfHwgZGVmYXVsdExpbmVIZWlnaHQpIGFzIG51bWJlclxuXG4gICAgLy8g5YWD57Sg5YyF5Zu055uS55qE5bem5LiK6KeS5Z2Q5qCHXG4gICAgbGV0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGxldCB5ID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHNjYWxlWSA9IGxpbmVIZWlnaHQgLyBkZWZhdWx0TGluZUhlaWdodDtcbiAgICBjb25zdCByZWFsV2lkdGggPSBzY2FsZVkgKiBib3VuZHMud2lkdGg7XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgeCwgeSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmloflrZfnmoTmuLLmn5PljLrln5/pq5jluqblsI/kuo7nm5LlrZDpq5jluqbvvIzph4fnlKjlr7npvZDmlrnlvI9cbiAgICBpZiAobGluZUhlaWdodCA8IGhlaWdodCkge1xuICAgICAgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdtaWRkbGUnKSB7XG4gICAgICAgIHkgKz0gKGhlaWdodCAtIGxpbmVIZWlnaHQpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodmVydGljYWxBbGlnbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgeSA9IHkgKyBoZWlnaHQgLSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aWR0aCA+IHJlYWxXaWR0aCkge1xuICAgICAgaWYgKHRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgeCArPSAod2lkdGggLSByZWFsV2lkdGgpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICAgIHggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuXG4gICAgICBpZiAocHJldkNoYXJDb2RlICYmIGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV0pIHtcbiAgICAgICAgeCArPSBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgdGhpcy5mb250LnRleHR1cmUgYXMgSFRNTEltYWdlRWxlbWVudCxcbiAgICAgICAgICBjZmcueCxcbiAgICAgICAgICBjZmcueSxcbiAgICAgICAgICBjZmcudyxcbiAgICAgICAgICBjZmcuaCxcbiAgICAgICAgICB4ICsgY2ZnLm9mZlggKiBzY2FsZVksXG4gICAgICAgICAgeSArIGNmZy5vZmZZICogc2NhbGVZLFxuICAgICAgICAgIGNmZy53ICogc2NhbGVZLFxuICAgICAgICAgIGNmZy5oICogc2NhbGVZLFxuICAgICAgICApO1xuXG4gICAgICAgIHggKz0gKGNmZy54YWR2YW5jZSAqIHNjYWxlWSArIGxldHRlclNwYWNpbmcpO1xuXG4gICAgICAgIHByZXZDaGFyQ29kZSA9IGNoYXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZUNhbnZhcyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUNhbnZhc09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBhdXRvQ3JlYXRlQ2FudmFzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgY2FudmFzSW5zdGFuY2U6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQ2FudmFzT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHdpZHRoID0gMTAwLFxuICAgICAgaGVpZ2h0ID0gMTAwLFxuICAgICAgYXV0b0NyZWF0ZUNhbnZhcyA9IGZhbHNlLFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5bCP5ri45oiP5Zy65pmv5LiL77yMc2hhcmVkQ2FudmFzIOWunuS+i+S4jeaWueS+v+iHquWKqOWIm+W7uu+8jOaPkOS+myBzZXR0ZXIg5omL5Yqo6K6+572uXG4gICAgICovXG4gICAgaWYgKGF1dG9DcmVhdGVDYW52YXMpIHtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGlmIChzdHlsZS5ib3JkZXJDb2xvcikge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG5cbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhc0luc3RhbmNlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGlkOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZCh0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5mdW5jdGlvbiBzZXREaXJ0eShlbGU6IEVsZW1lbnQpIHtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5mdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZykge1xuICBjb25zdCByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgcmV0dXJuIHJlc3VsdFxuICAgID8ge1xuICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpLFxuICAgIH1cbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFJnYmEoaGV4OiBzdHJpbmcsIG9wYWNpdHk6IG51bWJlcikge1xuICBjb25zdCByZ2JPYmogPSBoZXhUb1JnYihoZXgpO1xuXG4gIGlmIChvcGFjaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfVxuXG4gIGlmICghcmdiT2JqKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYHJnYmEoJHtyZ2JPYmoucn0sICR7cmdiT2JqLmd9LCAke3JnYk9iai5ifSwgJHtvcGFjaXR5fSlgO1xufVxuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICByaWdodDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbn07XG5cbmNvbnN0IGlzVmFsaWRVcmxQcm9wUmVnID0gL1xccyp1cmxcXCgoLio/KVxcKVxccyovO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBjbGFzcyDlsZ7mgKfvvIzkuIDoiKznlKjkuo7mqKHmnb/mj5Lku7ZcbiAgICovXG4gIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55omA5Zyo6IqC54K55qCR55qE5qC56IqC54K577yM5oyH5ZCRIExheW91dFxuICAgKi9cbiAgcHVibGljIHJvb3Q6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLy8gcHVibGljIEVFOiBhbnk7XG5cbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhuW9k+WJjeiKgueCueaYr+WQpuW3sue7j+aJp+ihjOmUgOavgemAu+i+ke+8jOmUgOavgeS5i+WQjuWOn+WFiOeahOWKn+iDvemDveS8muW8guW4uO+8jOS4gOiIrOS4muWKoeS+p+S4jeeUqOWFs+W/g+i/meS4qlxuICAgKi9cbiAgcHVibGljIGlzRGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOexu+S8vCBXZWIg56uv5a6e546w77yM57uZ6IqC54K55oyC5LiA5Lqb6IO95aSf6K+75YaZ55qE5bGe5oCn6ZuG5ZCIXG4gICAqIOWcqCB4bWwg5Y+v5Lul6L+Z5qC35aOw5piO5bGe5oCn77yaPHZpZXcgY2xhc3M9XCJ4eHhcIiBkYXRhLWZvbz1cImJhclwiPlxuICAgKiDlnKgganMg5L6n5Y+v5Lul6L+Z5LmI6K+75YaZ5bGe5oCn77yaXG4gICAqIGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YXNldC5mb28pOyAvLyDmjqfliLblj7DovpPlh7ogXCJiYXJcIjtcbiAgICogZWxlbWVudC5kYXRhc2V0LmZvbyA9IFwiYmFyMlwiO1xuICAgKi9cbiAgcHVibGljIGRhdGFzZXQ6IElEYXRhc2V0O1xuICBcbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwcml2YXRlIG9yaWdpblN0eWxlOiBJU3R5bGU7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgaWQgPSB1dWlkICs9IDEsXG4gICAgZGF0YXNldCA9IHt9LFxuICB9OiBJRWxlbWVudE9wdGlvbnMpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5pZE5hbWUgPSBpZE5hbWU7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgdGhpcy5sYXlvdXRCb3ggPSB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBhYnNvbHV0ZVg6IDAsXG4gICAgICBhYnNvbHV0ZVk6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWDogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVZOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgaWYgKFxuICAgICAgc3R5bGUub3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAmJiBzdHlsZS5jb2xvclxuICAgICAgJiYgc3R5bGUuY29sb3IuaW5kZXhPZignIycpID4gLTFcbiAgICApIHtcbiAgICAgIC8vIOminOiJsuino+aekOWksei0pe+8jOmZjee6p+S4uiBoZXhcbiAgICAgIHN0eWxlLmNvbG9yID0gZ2V0UmdiYShzdHlsZS5jb2xvciwgc3R5bGUub3BhY2l0eSkgfHwgc3R5bGUuY29sb3I7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgc3R5bGUub3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAmJiBzdHlsZS5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICYmIHN0eWxlLmJhY2tncm91bmRDb2xvci5pbmRleE9mKCcjJykgPiAtMVxuICAgICkge1xuICAgICAgLy8g6aKc6Imy6Kej5p6Q5aSx6LSl77yM6ZmN57qn5Li6IGhleFxuICAgICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZ2V0UmdiYShzdHlsZS5iYWNrZ3JvdW5kQ29sb3IsIHN0eWxlLm9wYWNpdHkpIHx8IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlLmJhY2tncm91bmRJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihiYWNrZ3JvdW5kSW1hZ2U6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgbGlzdCA9IGJhY2tncm91bmRJbWFnZS5tYXRjaChpc1ZhbGlkVXJsUHJvcFJlZyk7XG4gICAgICBpZiAobGlzdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBsaXN0WzFdLnJlcGxhY2UoLygnfFwiKS9nLCAnJyk7XG4gICAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodXJsLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltZztcbiAgICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgICAgdGhpcy5yb290ICYmIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke2JhY2tncm91bmRJbWFnZX0gaXMgbm90IGEgdmFsaWQgYmFja2dyb3VuZEltYWdlYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOebkeWQrOWxnuaAp+eahOWPmOWMluWIpOaWreaYr+WQpumcgOimgeaJp+ihjCByZWZsb3fjgIFyZXBhaW50IOaTjeS9nFxuICAgKiDnu4/ov4fmtYvor5XvvIxPYmplY3QuZGVmaW5lUHJvcGVydHkg5piv5LiA5Liq5q+U6L6D5oWi55qE5pa55rOV77yMIOeJueWIq+aYr+WxnuaAp+avlOi+g+WkmueahOaXtuWAmVxuICAgKiDlm6DmraTkvJrlhYjliKTmlq3mmK/lkKbmlK/mjIEgUHJveHnvvIxpTWFjIChSZXRpbmEgNUssIDI3LWluY2gsIDIwMTcp5rWL6K+V57uT5p6cXG4gICAqIOaAu+WFsSAzMTIg5Liq6IqC54K577yMb2JzZXJ2ZVN0eWxlQW5kRXZlbnTmgLvogJfml7bkuLrvvJpcbiAgICogUHJveHk6IDNtc1xuICAgKiBPYmplY3QuZGVmaW5lUHJvcGVydHk6IDIwbXNcbiAgICovXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICB0aGlzLnN0eWxlID0gbmV3IFByb3h5KHRoaXMub3JpZ2luU3R5bGUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHNldERpcnR5KGVsZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgZWxlLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdHlsZSkgYXMgSVN0eWxlO1xuICAgICAgYWxsU3R5bGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zdHlsZSwga2V5LCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdLFxuICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAgICAgaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSA9IHZhbHVlO1xuICAgICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgc2V0RGlydHkodGhpcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuovku7blhpLms6HpgLvovpFcbiAgICBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoY2FuY2VsJywgJ3RvdWNoZW5kJywgJ2NsaWNrJ10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGUsIHRvdWNoTXNnKSA9PiB7XG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmVtaXQoZXZlbnROYW1lLCBlLCB0b3VjaE1zZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IHRoaXMuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56YeN57uY5o6l5Y+j77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZXBhaW50KCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCuea4suafk+aOpeWPo+WtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVuZGVyKCkgeyB9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQodGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQoaWQ6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlJZCh0aGlzLCBbXSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGNsYXNzTmFtZSDljIXlkKvnu5nlrprlj4LmlbDnmoTnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG4gICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcblxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy51bkJpbmRFdmVudCgpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgLy8gdGhpcy5FRSA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcblxuICAgIC8vIGVsZW1lbnQg5Zyo55S75biD5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGvXG4gICAgLy8gdGhpcy5sYXlvdXRCb3ggPSBudWxsO1xuICAgIC8vIHRoaXMuc3R5bGUgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gJyc7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGFkZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xuICAgIC8vIGVsZW1lbnQucGFyZW50SWQgPSB0aGlzLmlkO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuS4gOS4quiKgueCuea3u+WKoOS9nOS4uuW9k+WJjeiKgueCueeahOWtkOiKgueCuVxuICAgKi9cbiAgYXBwZW5kQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuXG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkIFxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqL1xuICByZW5kZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgcmFkaXVzID0gc3R5bGUuYm9yZGVyUmFkaXVzIHx8IDA7XG4gICAgY29uc3QgeyBib3JkZXJXaWR0aCA9IDAgfSA9IHN0eWxlO1xuICAgIGNvbnN0IGJvcmRlclRvcExlZnRSYWRpdXMgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJUb3BSaWdodFJhZGl1cyA9IHN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSBzdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciA9ICcnIH0gPSBzdHlsZTtcbiAgICBjb25zdCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCB5ID0gYm94LmFic29sdXRlWTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGNvbnN0IGhhc1JhZGl1cyA9IHJhZGl1c1xuICAgICAgfHwgYm9yZGVyVG9wTGVmdFJhZGl1cyB8fCBib3JkZXJUb3BSaWdodFJhZGl1cyB8fCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICBjdHgubW92ZVRvKHggKyBib3JkZXJUb3BMZWZ0UmFkaXVzLCB5KTtcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCB5KTtcblxuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCBib3JkZXJUb3BSaWdodFJhZGl1cyk7XG5cbiAgICAvLyDlj7PkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzKTtcblxuICAgIC8vIOWPs+S4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyhcbiAgICAgIHggKyB3aWR0aCxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICB4ICsgd2lkdGggLSBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICApO1xuXG4gICAgLy8g5bem5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgeSArIGhlaWdodCk7XG5cbiAgICAvLyDlt6bkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMsIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMpO1xuXG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4LCB5ICsgYm9yZGVyVG9wTGVmdFJhZGl1cyk7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSwgeCArIGJvcmRlclRvcExlZnRSYWRpdXMsIHksIGJvcmRlclRvcExlZnRSYWRpdXMpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUltYWdlT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNyYz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBpbWdzcmM6IHN0cmluZztcbiAgcHVibGljIHR5cGUgPSAnSW1hZ2UnO1xuICBwdWJsaWMgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJSW1hZ2VPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBzcmMgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmltZ3NyYyA9IHNyYztcblxuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnc3JjJywge1xuICAgIC8vICAgZ2V0KCkge1xuICAgIC8vICAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gICAgLy8gICB9LFxuICAgIC8vICAgc2V0KG5ld1ZhbHVlKSB7XG4gICAgLy8gICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5pbWdzcmMpIHtcbiAgICAvLyAgICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgIC8vICAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAvLyAgICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgIC8vICAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAvLyAgICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgLy8gICAgICAgICAgIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgLy8gICAgICAgICB9XG4gICAgLy8gICAgICAgfSk7XG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0sXG4gICAgLy8gICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIC8vICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIC8vIH0pO1xuXG4gICAgdGhpcy5pbWcgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNyYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgfVxuXG4gIHNldCBzcmMobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5pbWdzcmMpIHtcbiAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5pbWcgPSBudWxsO1xuXG4gICAgdGhpcy5zcmMgPSAnJztcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5pbWcgfHwgIXRoaXMuaW1nPy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIGNvbnN0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCBkcmF3WSA9IGJveC5hYnNvbHV0ZVk7XG5cbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIlxuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCBJbWFnZSBmcm9tICcuL2ltYWdlJztcbmltcG9ydCBUZXh0IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQgU2Nyb2xsVmlldyBmcm9tICcuL3Njcm9sbHZpZXcnO1xuaW1wb3J0IEJpdE1hcFRleHQgZnJvbSAnLi9iaXRtYXB0ZXh0JztcbmltcG9ydCBDYW52YXMgZnJvbSAnLi9jYW52YXMnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5cbmV4cG9ydCB7XG4gIEVsZW1lbnQsXG4gIFZpZXcsXG4gIEltYWdlLFxuICBUZXh0LFxuICBTY3JvbGxWaWV3LFxuICBCaXRNYXBUZXh0LFxuICBDYW52YXMsXG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgZ2V0RHByLCBjb3B5VG91Y2hBcnJheSB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCBTY3JvbGxlciBmcm9tICcuLi9saWJzL3Njcm9sbGVyL2luZGV4LmpzJ1xuaW1wb3J0IHsgaXRlcmF0ZVRyZWUgfSBmcm9tICcuLi9jb21tb24vdmQnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgZHByID0gZ2V0RHByKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBJSW5uZXJTY3JvbGxlck9wdGlvbiB7XG4gIHNjcm9sbGluZ1g/OiBib29sZWFuO1xuICBzY3JvbGxpbmdZPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgcHVibGljIHNjcm9sbFRvcCA9IDA7XG4gIHB1YmxpYyBzY3JvbGxMZWZ0ID0gMDtcbiAgcHVibGljIGhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICBwdWJsaWMgY3VycmVudEV2ZW50ID0gbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnU2Nyb2xsVmlldyc7XG4gIFxuICBwcml2YXRlIHNjcm9sbFlQcm9wOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGlubmVyU2Nyb2xsZXJPcHRpb246IElJbm5lclNjcm9sbGVyT3B0aW9uO1xuXG4gIHByaXZhdGUgc2Nyb2xsZXJPYmo/OiBTY3JvbGxlcjtcbiAgcHJpdmF0ZSBpc0ZpcnN0U2Nyb2xsPzogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBzY3JvbGxYLFxuICAgIHNjcm9sbFksXG4gICAgZGF0YXNldCxcbiAgfTogSVNjcm9sbFZpZXdPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgICBpZE5hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgY2xhc3NOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zY3JvbGxZUHJvcCA9IHNjcm9sbFk7XG5cbiAgICB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdYOiAhIXNjcm9sbFgsXG4gICAgICBzY3JvbGxpbmdZOiAhIXNjcm9sbFksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDojrflj5bmu5rliqjliJfooajlhoXmiYDmnInlhYPntKDnmoTpq5jluqblkoxcbiAgICog6L+Z6YeM5LiN6IO9566A5Y2V5bCG5omA5pyJ5a2Q5YWD57Sg55qE6auY5bqm57Sv5Yqg77yM5Zug5Li65q+P5Liq5YWD57Sg5LmL6Ze05Y+v6IO95piv5pyJ56m66ZqZ55qEXG4gICAqL1xuICBnZXQgc2Nyb2xsSGVpZ2h0KCkge1xuICAgIC8vIHNjcm9sbHZpZXfkuLrnqbrnmoTmg4XlhrVcbiAgICBpZiAoIXRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0ID0gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIGxhc3QubGF5b3V0Qm94LnRvcCArIGxhc3QubGF5b3V0Qm94LmhlaWdodDtcbiAgfVxuXG4gIGdldCBzY3JvbGxXaWR0aCgpIHtcbiAgICAvLyBzY3JvbGx2aWV35Li656m655qE5oOF5Ya1XG4gICAgaWYgKCF0aGlzLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcblxuICAgIHJldHVybiBsYXN0LmxheW91dEJveC5sZWZ0ICsgbGFzdC5sYXlvdXRCb3gud2lkdGg7XG4gIH1cblxuICBnZXQgc2Nyb2xsWCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1g7XG4gIH1cblxuICBzZXQgc2Nyb2xsWCh2YWx1ZSkge1xuICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdYOiB2YWx1ZSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdZO1xuICB9XG5cbiAgc2V0IHNjcm9sbFkodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgfTtcbiAgfVxuXG4gIGdldCBzY3JvbGxlck9wdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uO1xuICB9XG5cbiAgc2V0IHNjcm9sbGVyT3B0aW9uKHZhbHVlOiBJSW5uZXJTY3JvbGxlck9wdGlvbikge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLCB2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxlck9iaikge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnNjcm9sbGVyT2JqLm9wdGlvbnMsIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5zY3JvbGxSZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIC8vIHRoaXMudG91Y2ggPSBudWxsO1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QhLm9mZigndG91Y2hlbmQnKTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyVHJlZVdpdGhUb3AodHJlZTogRWxlbWVudCkge1xuICAgIHRyZWUucmVuZGVyKCk7XG5cbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIHRoaXMuY3R4IS5jbGVhclJlY3QoYm94LmFic29sdXRlWCwgYm94LmFic29sdXRlWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgfVxuXG4gIHNjcm9sbFJlbmRlcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcblxuICAgIGNvbnN0IHsgYWJzb2x1dGVYOiBzdGFydFgsIGFic29sdXRlWTogc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgLy8g5qC55o2u5rua5Yqo5YC86I635Y+W6KOB5Ymq5Yy65Z+fXG4gICAgY29uc3QgZW5kWCA9IHN0YXJ0WCArIHdpZHRoO1xuICAgIGNvbnN0IGVuZFkgPSBzdGFydFkgKyBoZWlnaHQ7XG5cbiAgICAvLyBTY3JvbGxWaWV3IOS9nOS4uuWuueWZqOacrOi6q+eahOa4suafk1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiDlvIDlp4voo4HliarvvIzlj6rmnInku5QgU2Nyb2xsVmlldyBsYXlvdXRCb3gg5Yy65Z+f5YaF55qE5YWD57Sg5omN5piv5Y+v6KeB55qEXG4gICAgICog6L+Z5qC3IFNjcm9sbFZpZXcg5LiN55So5Y2V54us5Y2g55So5LiA5LiqIGNhbnZhc++8jOWGheWtmOWQiOa4suafk+mDveS8muW+l+WIsOS8mOWMllxuICAgICAqL1xuICAgIGN0eC5zYXZlKCk7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5yZWN0KHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBhYnNvbHV0ZVgsIGFic29sdXRlWSB9ID0gY2hpbGQubGF5b3V0Qm94O1xuXG4gICAgICAvLyDliKTmlq3lpITkuo7lj6/op4bnqpflj6PlhoXnmoTlrZDoioLngrnvvIzpgJLlvZLmuLLmn5Por6XlrZDoioLngrlcbiAgICAgIGlmIChhYnNvbHV0ZVkgKyBoZWlnaHQgPj0gc3RhcnRZICYmIGFic29sdXRlWSA8PSBlbmRZXG4gICAgICAgICYmIGFic29sdXRlWCArIHdpZHRoID49IHN0YXJ0WCAmJiBhYnNvbHV0ZVggPD0gZW5kWCkge1xuICAgICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBzY3JvbGxIYW5kbGVyKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICAvLyDlj6/og73ooqvplIDmr4HkuobmiJbogIXoioLngrnmoJHov5jmsqHlh4blpIflpb1cbiAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQgJiYgIXRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5jdHggPSBjb250ZXh0O1xuXG4gICAgLyoqXG4gICAgICog6L+Z6YeM5pyJ5Liq6Z2e5bi454m55q6K55qE5YW85a656YC76L6R77yM5Zyo5L2O54mI5pys5rKh5pyJ6YeN5p6EIFNjcm9sbFZpZXfkuYvliY3vvIzlubbmsqHmnInmj5DkvpvljZXni6znmoQgU2Nyb2xsWCDlkowgU2Nyb2xsWSDlsZ7mgKdcbiAgICAgKiDogIzmmK/liKTmlq0gc2Nyb2xsSGVpaHQg5aSn5LqO5a655Zmo6auY5bqm55qE5pe25YCZ6Ieq5Yqo5a6e546w5LqG57q15ZCR5rua5Yqo77yI5LiU5rKh5pyJ5qiq5ZCR5rua5Yqo6IO95Yqb77yJXG4gICAgICog5Zug5q2k6L+Z6YeM5YGa5LiA5Liq5YW85a656YC76L6R77yM5aaC5p6cIHNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCDoh6rliqjlvIDlkK/nurXlkJHmu5rliqhcbiAgICAgKi9cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQgJiYgdHlwZW9mIHRoaXMuc2Nyb2xsWVByb3AgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnNjcm9sbFkgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0V2ZW50QmluZCkge1xuICAgICAgLy8gcmVmbG93IOmrmOW6puWPr+iDveS8muWPmOWMlu+8jOWboOatpOmcgOimgeaJp+ihjCBzZXREaW1lbnNpb25zIOWIt+aWsOWPr+a7muWKqOWMuuWfn1xuICAgICAgaWYgKHRoaXMubGF5b3V0Qm94LndpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMubGF5b3V0Qm94LmhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRIZWlnaHRcbiAgICAgICAgfHwgdGhpcy5zY3JvbGxXaWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudEhlaWdodCkge1xuICAgICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zZXREaW1lbnNpb25zKFxuICAgICAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICAgICB0aGlzLnNjcm9sbFdpZHRoLFxuICAgICAgICAgIHRoaXMuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyByZWZsb3cg5LmL5ZCO77yM5Lya5LuOIGNzc2xheW91dCDlkIzmraXluIPlsYDkv6Hmga/vvIzljp/lhYjnmoTmu5rliqjkv6Hmga/kvJrkuKLlpLHvvIzov5nph4zpnIDopoHkuIDkuKrlpI3kvY3nmoTmk43kvZxcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcykge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRoaXMuc2Nyb2xsVG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gdHJ1ZTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnModGhpcy5sYXlvdXRCb3gud2lkdGgsIHRoaXMubGF5b3V0Qm94LmhlaWdodCwgdGhpcy5zY3JvbGxXaWR0aCwgdGhpcy5zY3JvbGxIZWlnaHQpO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG5dO1xuXG5jb25zdCBhbGxTdHlsZXMgPSByZWZsb3dBZmZlY3RlZFN0eWxlcy5jb25jYXQocmVwYWludEFmZmVjdGVkU3R5bGVzKTtcblxuaW50ZXJmYWNlIElTdHlsZSB7XG4gIC8vIHJlZmxvd0FmZmVjdGVkU3R5bGVzXG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIG1pbldpZHRoPzogbnVtYmVyO1xuICBtaW5IZWlnaHQ/OiBudW1iZXI7XG4gIG1heFdpZHRoPzogbnVtYmVyO1xuICBtYXhIZWlnaHQ/OiBudW1iZXI7XG4gIGxlZnQ/OiBudW1iZXI7XG4gIHJpZ2h0PzogbnVtYmVyO1xuICB0b3A/OiBudW1iZXI7XG4gIGJvdHRvbT86IG51bWJlcjtcbiAgbWFyZ2luPzogbnVtYmVyO1xuICBtYXJnaW5MZWZ0PzogbnVtYmVyO1xuICBtYXJnaW5SaWdodD86IG51bWJlcjtcbiAgbWFyZ2luVG9wPzogbnVtYmVyO1xuICBtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmdMZWZ0PzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XG4gIHBhZGRpbmdCb3R0b20/OiBudW1iZXI7XG4gIGJvcmRlcldpZHRoPzogbnVtYmVyO1xuICBib3JkZXJMZWZ0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclJpZ2h0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclRvcFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21XaWR0aD86IG51bWJlcjtcblxuICBib3JkZXJUb3BMZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJUb3BSaWdodFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM/OiBudW1iZXI7XG5cbiAgZmxleERpcmVjdGlvbj86ICdjb2x1bW4nIHwgJ3Jvdyc7XG4gIGZsZXhTaHJpbms/OiBudW1iZXI7XG4gIGZsZXhHcm93PzogbnVtYmVyO1xuICBmbGV4V3JhcD86ICd3cmFwJyB8ICdub3dyYXAnO1xuICBqdXN0aWZ5Q29udGVudD86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzcGFjZS1iZXR3ZWVuJyB8ICdzcGFjZS1hcm91bmQnO1xuICBhbGlnbkl0ZW1zPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBhbGlnblNlbGY/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIHBvc2l0aW9uPzogJ3JlbGF0aXZlJyB8ICdhYnNvbHV0ZSc7XG5cbiAgLy8gcmVwYWludEFmZmVjdGVkU3R5bGVzXG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBsaW5lSGVpZ2h0PzogbnVtYmVyIHwgJ3N0cmluZyc7XG4gIHRleHRBbGlnbj86ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbiAgdmVydGljYWxBbGlnbj86ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgdGV4dE92ZXJmbG93PzogJ2VsbGlwc2lzJyB8ICdjbGlwJztcbiAgbGV0dGVyU3BhY2luZz86IG51bWJlcjtcbiAgYm9yZGVyUmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyVG9wQ29sb3I/OiBzdHJpbmc7XG5cbiAgYmFja2dyb3VuZEltYWdlPzogc3RyaW5nO1xuICBib3JkZXJCb3R0b21Db2xvcj86IHN0cmluZztcbiAgYm9yZGVyTGVmdENvbG9yPzogc3RyaW5nO1xuICBib3JkZXJSaWdodENvbG9yPzogc3RyaW5nO1xuXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIGFsbFN0eWxlcywgSVN0eWxlIH07XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZUNhbnZhcyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnUGluZ0ZhbmdTQy1SZWd1bGFyLCBzYW5zLXNlcmlmJztcbmxldCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcblxuY29uc3QgZ2V0Q29udGV4dCA9ICgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPT4ge1xuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gY3JlYXRlQ2FudmFzKCk7XG4gIGNhbnZhcy53aWR0aCA9IDE7XG4gIGNhbnZhcy5oZWlnaHQgPSAxO1xuICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmludGVyZmFjZSBJVGV4dFByb3BzIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSB2YWx1ZXNyYyA9ICcnO1xuICBwcml2YXRlIG9yaWdpblN0eWxlV2lkdGg6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuICBwdWJsaWMgdGV4dEJhc2VsaW5lOiBDYW52YXNUZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgcHVibGljIGZvbnQgPSAnJztcbiAgcHVibGljIHRleHRBbGlnbjogQ2FudmFzVGV4dEFsaWduID0gJ2xlZnQnO1xuICBwdWJsaWMgZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHZhbHVlID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSVRleHRQcm9wcykge1xuICAgIGxldCBvcmlnaW5TdHlsZVdpZHRoID0gc3R5bGUud2lkdGg7XG4gICAgLy8g5rKh5pyJ6K6+572u5a695bqm55qE5pe25YCZ6YCa6L+HY2FudmFz6K6h566X5Ye65paH5a2X5a695bqmXG4gICAgaWYgKG9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgoc3R5bGUsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgdmFsdWUgPSBwYXJzZVRleHQoc3R5bGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyIHx8IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIH1cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVGV4dCc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcbiAgICB0aGlzLm9yaWdpblN0eWxlV2lkdGggPSBvcmlnaW5TdHlsZVdpZHRoO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICBpZiAodGhpcy5vcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5zdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICAgIG5ld1ZhbHVlID0gcGFyc2VUZXh0KHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmlzRGlydHkgPSB0cnVlO1xuICAgICAgbGV0IHsgcGFyZW50IH0gPSB0aGlzO1xuICAgICAgd2hpbGUgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQuaXNEaXJ0eSA9IHRydWU7XG4gICAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdG9DYW52YXNEYXRhKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcblxuICAgIHRoaXMuZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICB0aGlzLnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIHRoaXMuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJyd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtERUZBVUxUX0ZPTlRfRkFNSUxZfWA7XG4gICAgdGhpcy50ZXh0QWxpZ24gPSBzdHlsZS50ZXh0QWxpZ24gfHwgJ2xlZnQnO1xuICAgIHRoaXMuZmlsbFN0eWxlID0gc3R5bGUuY29sb3IgfHwgJyMwMDAnO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIGluc2VydChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IHRoaXMudGV4dEJhc2VsaW5lO1xuICAgIGN0eC5mb250ID0gdGhpcy5mb250O1xuICAgIGN0eC50ZXh0QWxpZ24gPSB0aGlzLnRleHRBbGlnbjtcblxuICAgIGxldCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgbGV0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuXG4gICAgaWYgKHRoaXMudGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgZHJhd1ggKz0gYm94LndpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICBkcmF3WCArPSBib3gud2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIGN0eC5maWxsVGV4dChcbiAgICAgIHRoaXMudmFsdWUsXG4gICAgICBkcmF3WCxcbiAgICAgIGRyYXdZLFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdWaWV3JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIC8vIOacieS6m+iKgueCueS7heS7heS9nOS4uuWuueWZqO+8jOWunumZheS4iuS4jemcgOimgeS7u+S9lea4suafk+mAu+i+ke+8jOi/memHjOWKoOS4quWIpOaWreWPr+S7peaPkOmrmOaAp+iDvVxuICBjaGVja05lZWRSZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IHsgYm9yZGVyQ29sb3IgfSA9IHN0eWxlO1xuXG4gICAgcmV0dXJuICEhKHN0eWxlLmJhY2tncm91bmRDb2xvclxuICAgICAgfHwgKHN0eWxlLmJvcmRlcldpZHRoICYmIGJvcmRlckNvbG9yKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlclRvcFdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJUb3BDb2xvcikpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlckJvdHRvbUNvbG9yKSlcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJMZWZ0V2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlckxlZnRDb2xvcikpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyUmlnaHRDb2xvcikpKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgLy8gY29uc3QgeyBjdHggfSA9IHRoaXM7XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgYm9yZGVyV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuICAgIGNvbnN0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCBkcmF3WSA9IGJveC5hYnNvbHV0ZVk7XG5cbiAgICBjb25zdCBib3JkZXJMZWZ0V2lkdGggPSBzdHlsZS5ib3JkZXJMZWZ0V2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyUmlnaHRXaWR0aCA9IHN0eWxlLmJvcmRlclJpZ2h0V2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyVG9wV2lkdGggPSBzdHlsZS5ib3JkZXJUb3BXaWR0aCB8fCBib3JkZXJXaWR0aDtcbiAgICBjb25zdCBib3JkZXJCb3R0b21XaWR0aCA9IHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoIHx8IGJvcmRlcldpZHRoO1xuXG4gICAgLy8gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgIGRyYXdYICsgYm9yZGVyTGVmdFdpZHRoLFxuICAgICAgICBkcmF3WSArIGJvcmRlclJpZ2h0V2lkdGgsXG4gICAgICAgIGJveC53aWR0aCAtIChib3JkZXJMZWZ0V2lkdGggKyBib3JkZXJSaWdodFdpZHRoKSxcbiAgICAgICAgYm94LmhlaWdodCAtIChib3JkZXJUb3BXaWR0aCArIGJvcmRlckJvdHRvbVdpZHRoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBHYW1lR2xvYmFsLl9fZW52ID0gR2FtZUdsb2JhbC53eCB8fCBHYW1lR2xvYmFsLnR0IHx8IEdhbWVHbG9iYWwuc3dhbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBjb252ZXJ0VG9Kc29uID0gZnVuY3Rpb24obm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBqT2JqID0ge1xuICAgIG5hbWU6IG5vZGUudGFnbmFtZVxuICB9O1xuXG4gIC8vd2hlbiBubyBjaGlsZCBub2RlIG9yIGF0dHIgaXMgcHJlc2VudFxuICBpZiAoKCFub2RlLmNoaWxkIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmNoaWxkKSkgJiYgKCFub2RlLmF0dHJzTWFwIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmF0dHJzTWFwKSkpIHtcbiAgICByZXR1cm4gdXRpbC5pc0V4aXN0KG5vZGUudmFsKSAmJiAhIW5vZGUudmFsID8gbm9kZS52YWwgOiBqT2JqO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlIGNyZWF0ZSBhIHRleHRub2RlIGlmIG5vZGUgaGFzIHNvbWUgdGV4dFxuICAgIGlmICh1dGlsLmlzRXhpc3Qobm9kZS52YWwpKSB7XG4gICAgICBpZiAoISh0eXBlb2Ygbm9kZS52YWwgPT09ICdzdHJpbmcnICYmIChub2RlLnZhbCA9PT0gJycgfHwgbm9kZS52YWwgPT09IG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXIpKSkge1xuICAgICAgICBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBbIG5vZGUudmFsIF07XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gbm9kZS52YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHV0aWwubWVyZ2Uoak9iaiwgbm9kZS5hdHRyc01hcCwgb3B0aW9ucy5hcnJheU1vZGUpO1xuXG4gIGpPYmouY2hpbGRyZW4gPSBbXTtcbiAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCBjaGlsZCA9PiB7XG4gICAgak9iai5jaGlsZHJlbi5wdXNoKGNvbnZlcnRUb0pzb24oY2hpbGQsIG9wdGlvbnMpKVxuICB9KTtcblxuICAvLyBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMobm9kZS5jaGlsZCk7XG4gIC8vIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBrZXlzLmxlbmd0aDsgaW5kZXgrKykge1xuICAvLyAgIHZhciB0YWduYW1lID0ga2V5c1tpbmRleF07XG4gIC8vICAgaWYgKG5vZGUuY2hpbGRbdGFnbmFtZV0gJiYgbm9kZS5jaGlsZFt0YWduYW1lXS5sZW5ndGggPiAxKSB7XG4gIC8vICAgICBqT2JqW3RhZ25hbWVdID0gW107XG4gIC8vICAgICBmb3IgKHZhciB0YWcgaW4gbm9kZS5jaGlsZFt0YWduYW1lXSkge1xuICAvLyAgICAgICBqT2JqW3RhZ25hbWVdLnB1c2goY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdW3RhZ10sIG9wdGlvbnMpKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IHRydWUpe1xuICAvLyAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0VG9Kc29uKG5vZGUuY2hpbGRbdGFnbmFtZV1bMF0sIG9wdGlvbnMpXG4gIC8vICAgICAgIGlmKHR5cGVvZiByZXN1bHQgPT09ICdvYmplY3QnKVxuICAvLyAgICAgICAgIGpPYmpbdGFnbmFtZV0gPSBbIHJlc3VsdCBdO1xuICAvLyAgICAgICBlbHNlXG4gIC8vICAgICAgICAgak9ialt0YWduYW1lXSA9IHJlc3VsdDtcbiAgLy8gICAgIH1lbHNlIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSBcInN0cmljdFwiKXtcbiAgLy8gICAgICAgak9ialt0YWduYW1lXSA9IFtjb252ZXJ0VG9Kc29uKG5vZGUuY2hpbGRbdGFnbmFtZV1bMF0sIG9wdGlvbnMpIF07XG4gIC8vICAgICB9ZWxzZXtcbiAgLy8gICAgICAgak9ialt0YWduYW1lXSA9IGNvbnZlcnRUb0pzb24obm9kZS5jaGlsZFt0YWduYW1lXVswXSwgb3B0aW9ucyk7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy9hZGQgdmFsdWVcbiAgcmV0dXJuIGpPYmo7XG59O1xuXG5leHBvcnRzLmNvbnZlcnRUb0pzb24gPSBjb252ZXJ0VG9Kc29uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBub2RlVG9Kc29uID0gcmVxdWlyZSgnLi9ub2RlMmpzb24nKTtcbmNvbnN0IHhtbFRvTm9kZW9iaiA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IHgyeG1sbm9kZSA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdG9yJyk7XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zLCB2YWxpZGF0aW9uT3B0aW9uKSB7XG4gICBpZiggdmFsaWRhdGlvbk9wdGlvbil7XG4gICAgIGlmKHZhbGlkYXRpb25PcHRpb24gPT09IHRydWUpIHZhbGlkYXRpb25PcHRpb24gPSB7fVxuXG4gICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRvci52YWxpZGF0ZSh4bWxEYXRhLCB2YWxpZGF0aW9uT3B0aW9uKTtcbiAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgIHRocm93IEVycm9yKCByZXN1bHQuZXJyLm1zZylcbiAgICAgfVxuICAgfVxuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIHgyeG1sbm9kZS5kZWZhdWx0T3B0aW9ucywgeDJ4bWxub2RlLnByb3BzKTtcbiAgcmV0dXJuIG5vZGVUb0pzb24uY29udmVydFRvSnNvbih4bWxUb05vZGVvYmouZ2V0VHJhdmVyc2FsT2JqKHhtbERhdGEsIG9wdGlvbnMpLCBvcHRpb25zKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZ2V0QWxsTWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHdoaWxlIChtYXRjaCkge1xuICAgIGNvbnN0IGFsbG1hdGNoZXMgPSBbXTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgYWxsbWF0Y2hlcy5wdXNoKG1hdGNoW2luZGV4XSk7XG4gICAgfVxuICAgIG1hdGNoZXMucHVzaChhbGxtYXRjaGVzKTtcbiAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbmNvbnN0IGRvZXNNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHJldHVybiAhKG1hdGNoID09PSBudWxsIHx8IHR5cGVvZiBtYXRjaCA9PT0gJ3VuZGVmaW5lZCcpO1xufTtcblxuY29uc3QgZG9lc05vdE1hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICByZXR1cm4gIWRvZXNNYXRjaChzdHJpbmcsIHJlZ2V4KTtcbn07XG5cbmV4cG9ydHMuaXNFeGlzdCA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJztcbn07XG5cbmV4cG9ydHMuaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG4vKipcbiAqIENvcHkgYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGEgaW50byBiLlxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEBwYXJhbSB7Kn0gYVxuICovXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBhLCBhcnJheU1vZGUpIHtcbiAgaWYgKGEpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYSk7IC8vIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIG93biBwcm9wZXJ0aWVzXG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZihhcnJheU1vZGUgPT09ICdzdHJpY3QnKXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gWyBhW2tleXNbaV1dIF07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gYVtrZXlzW2ldXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4vKiBleHBvcnRzLm1lcmdlID1mdW5jdGlvbiAoYixhKXtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYixhKTtcbn0gKi9cblxuZXhwb3J0cy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgaWYgKGV4cG9ydHMuaXNFeGlzdCh2KSkge1xuICAgIHJldHVybiB2O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLy8gY29uc3QgZmFrZUNhbGwgPSBmdW5jdGlvbihhKSB7cmV0dXJuIGE7fTtcbi8vIGNvbnN0IGZha2VDYWxsTm9SZXR1cm4gPSBmdW5jdGlvbigpIHt9O1xuXG5leHBvcnRzLmJ1aWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcykge1xuICB2YXIgbmV3T3B0aW9ucyA9IHt9O1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gZGVmYXVsdE9wdGlvbnM7IC8vaWYgdGhlcmUgYXJlIG5vdCBvcHRpb25zXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9wdGlvbnNbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gb3B0aW9uc1twcm9wc1tpXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gZGVmYXVsdE9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3T3B0aW9ucztcbn07XG5cbmV4cG9ydHMuZG9lc01hdGNoID0gZG9lc01hdGNoO1xuZXhwb3J0cy5kb2VzTm90TWF0Y2ggPSBkb2VzTm90TWF0Y2g7XG5leHBvcnRzLmdldEFsbE1hdGNoZXMgPSBnZXRBbGxNYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9BIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIGxvY2FsZVJhbmdlOiAnYS16QS1aJyxcbn07XG5cbmNvbnN0IHByb3BzID0gWydhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJywgJ2xvY2FsZVJhbmdlJ107XG5cbi8vY29uc3QgdGFnc1BhdHRlcm4gPSBuZXcgUmVnRXhwKFwiPFxcXFwvPyhbXFxcXHc6XFxcXC1fXFwuXSspXFxcXHMqXFwvPz5cIixcImdcIik7XG5leHBvcnRzLnZhbGlkYXRlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gdXRpbC5idWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcblxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sXCJcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKF5cXHMqPFxcP3htbC4qP1xcPz4pL2csXCJcIik7Ly9SZW1vdmUgWE1MIHN0YXJ0aW5nIHRhZ1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyg8IURPQ1RZUEVbXFxzXFx3XFxcIlxcLlxcL1xcLVxcOl0rKFxcWy4qXFxdKSpcXHMqPikvZyxcIlwiKTsvL1JlbW92ZSBET0NUWVBFXG5cbiAgY29uc3QgdGFncyA9IFtdO1xuICBsZXQgdGFnRm91bmQgPSBmYWxzZTtcbiAgaWYgKHhtbERhdGFbMF0gPT09ICdcXHVmZWZmJykge1xuICAgIC8vIGNoZWNrIGZvciBieXRlIG9yZGVyIG1hcmsgKEJPTSlcbiAgICB4bWxEYXRhID0geG1sRGF0YS5zdWJzdHIoMSk7XG4gIH1cbiAgY29uc3QgcmVneEF0dHJOYW1lID0gbmV3IFJlZ0V4cCgnXltfd11bXFxcXHdcXFxcLS46XSokJy5yZXBsYWNlKCdfdycsICdfJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgY29uc3QgcmVneFRhZ05hbWUgPSBuZXcgUmVnRXhwKCdeKFt3XXxfKVtcXFxcdy5cXFxcLV86XSonLnJlcGxhY2UoJyhbdycsICcoWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgIC8vc3RhcnRpbmcgb2YgdGFnXG4gICAgICAvL3JlYWQgdW50aWwgeW91IHJlYWNoIHRvICc+JyBhdm9pZGluZyBhbnkgJz4nIGluIGF0dHJpYnV0ZSB2YWx1ZVxuXG4gICAgICBpKys7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJz8nKSB7XG4gICAgICAgIGkgPSByZWFkUEkoeG1sRGF0YSwgKytpKTtcbiAgICAgICAgaWYgKGkuZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJyEnKSB7XG4gICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjbG9zaW5nVGFnID0gZmFsc2U7XG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLycpIHtcbiAgICAgICAgICAvL2Nsb3NpbmcgdGFnXG4gICAgICAgICAgY2xvc2luZ1RhZyA9IHRydWU7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVhZCB0YWduYW1lXG4gICAgICAgIGxldCB0YWdOYW1lID0gJyc7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgO1xuICAgICAgICAgIGkgPCB4bWxEYXRhLmxlbmd0aCAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICc+JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICcgJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHQnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcbicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxyJztcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFnTmFtZSArPSB4bWxEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRyaW0oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0YWdOYW1lKTtcblxuICAgICAgICBpZiAodGFnTmFtZVt0YWdOYW1lLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWcgd2l0aG91dCBhdHRyaWJ1dGVzXG4gICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUuc3Vic3RyaW5nKDAsIHRhZ05hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0ZVRhZ05hbWUodGFnTmFtZSwgcmVneFRhZ05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ1RhZyAnICsgdGFnTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdBdHRyaWJ1dGVzIGZvciBcIicgKyB0YWdOYW1lICsgJ1wiIGhhdmUgb3BlbiBxdW90ZS4nfX07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF0dHJTdHIgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGkgPSByZXN1bHQuaW5kZXg7XG5cbiAgICAgICAgaWYgKGF0dHJTdHJbYXR0clN0ci5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgYXR0clN0ciA9IGF0dHJTdHIuc3Vic3RyaW5nKDAsIGF0dHJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vY29udGludWU7IC8vdGV4dCBtYXkgcHJlc2VudHMgYWZ0ZXIgc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xvc2luZ1RhZykge1xuICAgICAgICAgIGlmKCFyZXN1bHQudGFnQ2xvc2VkKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBkb24ndCBoYXZlIHByb3BlciBjbG9zaW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfWVsc2UgaWYgKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBjYW4ndCBoYXZlIGF0dHJpYnV0ZXMgb3IgaW52YWxpZCBzdGFydGluZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdGcgPSB0YWdzLnBvcCgpO1xuICAgICAgICAgICAgaWYgKHRhZ05hbWUgIT09IG90Zykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgJyArIG90ZyArICcgaXMgZXhwZWN0ZWQgaW5wbGFjZSBvZiAnICsgdGFnTmFtZSArICcuJ30sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkICE9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFncy5wdXNoKHRhZ05hbWUpO1xuICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2tpcCB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICAvL0l0IG1heSBpbmNsdWRlIGNvbW1lbnRzIGFuZCBDREFUQSB2YWx1ZVxuICAgICAgICBmb3IgKGkrKzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICchJykge1xuICAgICAgICAgICAgICAvL2NvbW1lbnQgb3IgQ0FEQVRBXG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vZW5kIG9mIHJlYWRpbmcgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJyAnIHx8IHhtbERhdGFbaV0gPT09ICdcXHQnIHx8IHhtbERhdGFbaV0gPT09ICdcXG4nIHx8IHhtbERhdGFbaV0gPT09ICdcXHInKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZENoYXInLCBtc2c6ICdjaGFyICcgKyB4bWxEYXRhW2ldICsgJyBpcyBub3QgZXhwZWN0ZWQgLid9fTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRhZ0ZvdW5kKSB7XG4gICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1N0YXJ0IHRhZyBleHBlY3RlZC4nfX07XG4gIH0gZWxzZSBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnSW52YWxpZCAnICsgSlNPTi5zdHJpbmdpZnkodGFncywgbnVsbCwgNCkucmVwbGFjZSgvXFxyP1xcbi9nLCAnJykgKyAnIGZvdW5kLid9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVhZCBQcm9jZXNzaW5nIGluc3N0cnVjdGlvbnMgYW5kIHNraXBcbiAqIEBwYXJhbSB7Kn0geG1sRGF0YVxuICogQHBhcmFtIHsqfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRQSSh4bWxEYXRhLCBpKSB7XG4gIHZhciBzdGFydCA9IGk7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09ICc/JyB8fCB4bWxEYXRhW2ldID09ICcgJykge1xuICAgICAgLy90YWduYW1lXG4gICAgICB2YXIgdGFnbmFtZSA9IHhtbERhdGEuc3Vic3RyKHN0YXJ0LCBpIC0gc3RhcnQpO1xuICAgICAgaWYgKGkgPiA1ICYmIHRhZ25hbWUgPT09ICd4bWwnKSB7XG4gICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdYTUwgZGVjbGFyYXRpb24gYWxsb3dlZCBvbmx5IGF0IHRoZSBzdGFydCBvZiB0aGUgZG9jdW1lbnQuJ319O1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09ICc/JyAmJiB4bWxEYXRhW2kgKyAxXSA9PSAnPicpIHtcbiAgICAgICAgLy9jaGVjayBpZiB2YWxpZCBhdHRyaWJ1dCBzdHJpbmdcbiAgICAgICAgaSsrO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxuZnVuY3Rpb24gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKSB7XG4gIGlmICh4bWxEYXRhLmxlbmd0aCA+IGkgKyA1ICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICctJykge1xuICAgIC8vY29tbWVudFxuICAgIGZvciAoaSArPSAzOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOCAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ08nICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1knICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdQJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnRSdcbiAgKSB7XG4gICAgbGV0IGFuZ2xlQnJhY2tldHNDb3VudCA9IDE7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50LS07XG4gICAgICAgIGlmIChhbmdsZUJyYWNrZXRzQ291bnQgPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA5ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdbJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdbJ1xuICApIHtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnXScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGk7XG59XG5cbnZhciBkb3VibGVRdW90ZSA9ICdcIic7XG52YXIgc2luZ2xlUXVvdGUgPSBcIidcIjtcblxuLyoqXG4gKiBLZWVwIHJlYWRpbmcgeG1sRGF0YSB1bnRpbCAnPCcgaXMgZm91bmQgb3V0c2lkZSB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICogQHBhcmFtIHtzdHJpbmd9IHhtbERhdGFcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSkge1xuICBsZXQgYXR0clN0ciA9ICcnO1xuICBsZXQgc3RhcnRDaGFyID0gJyc7XG4gIGxldCB0YWdDbG9zZWQgPSBmYWxzZTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09IGRvdWJsZVF1b3RlIHx8IHhtbERhdGFbaV0gPT09IHNpbmdsZVF1b3RlKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICBzdGFydENoYXIgPSB4bWxEYXRhW2ldO1xuICAgICAgfSBlbHNlIGlmIChzdGFydENoYXIgIT09IHhtbERhdGFbaV0pIHtcbiAgICAgICAgLy9pZiB2YXVlIGlzIGVuY2xvc2VkIHdpdGggZG91YmxlIHF1b3RlIHRoZW4gc2luZ2xlIHF1b3RlcyBhcmUgYWxsb3dlZCBpbnNpZGUgdGhlIHZhbHVlIGFuZCB2aWNlIHZlcnNhXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRDaGFyID0gJyc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHRhZ0Nsb3NlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhdHRyU3RyICs9IHhtbERhdGFbaV07XG4gIH1cbiAgaWYgKHN0YXJ0Q2hhciAhPT0gJycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge3ZhbHVlOiBhdHRyU3RyLCBpbmRleDogaSwgdGFnQ2xvc2VkOiB0YWdDbG9zZWR9O1xufVxuXG4vKipcbiAqIFNlbGVjdCBhbGwgdGhlIGF0dHJpYnV0ZXMgd2hldGhlciB2YWxpZCBvciBpbnZhbGlkLlxuICovXG5jb25zdCB2YWxpZEF0dHJTdHJSZWd4cCA9IG5ldyBSZWdFeHAoJyhcXFxccyopKFteXFxcXHM9XSspKFxcXFxzKj0pPyhcXFxccyooW1xcJ1wiXSkoKFtcXFxcc1xcXFxTXSkqPylcXFxcNSk/JywgJ2cnKTtcblxuLy9hdHRyLCA9XCJzZFwiLCBhPVwiYW1pdCdzXCIsIGE9XCJzZFwiYj1cInNhZlwiLCBhYiAgY2Q9XCJcIlxuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpIHtcbiAgLy9jb25zb2xlLmxvZyhcInN0YXJ0OlwiK2F0dHJTdHIrXCI6ZW5kXCIpO1xuXG4gIC8vaWYoYXR0clN0ci50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTsgLy9lbXB0eSBzdHJpbmdcblxuICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIHZhbGlkQXR0clN0clJlZ3hwKTtcbiAgY29uc3QgYXR0ck5hbWVzID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9jb25zb2xlLmxvZyhtYXRjaGVzW2ldKTtcblxuICAgIGlmIChtYXRjaGVzW2ldWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy9ub3NwYWNlIGJlZm9yZSBhdHRyaWJ1dGUgbmFtZTogYT1cInNkXCJiPVwic2FmXCJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBoYXMgbm8gc3BhY2UgaW4gc3RhcnRpbmcuJ319O1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlc1tpXVszXSA9PT0gdW5kZWZpbmVkICYmICFvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgIC8vaW5kZXBlbmRlbnQgYXR0cmlidXRlOiBhYlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdib29sZWFuIGF0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaXMgbm90IGFsbG93ZWQuJ319O1xuICAgIH1cbiAgICAvKiBlbHNlIGlmKG1hdGNoZXNbaV1bNl0gPT09IHVuZGVmaW5lZCl7Ly9hdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZTogYWI9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVycjogeyBjb2RlOlwiSW52YWxpZEF0dHJcIixtc2c6XCJhdHRyaWJ1dGUgXCIgKyBtYXRjaGVzW2ldWzJdICsgXCIgaGFzIG5vIHZhbHVlIGFzc2lnbmVkLlwifX07XG4gICAgICAgICAgICAgICAgfSAqL1xuICAgIGNvbnN0IGF0dHJOYW1lID0gbWF0Y2hlc1tpXVsyXTtcbiAgICBpZiAoIXZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkpIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICB9XG4gICAgLyppZiAoIWF0dHJOYW1lcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHsqL1xuICAgIGlmICggIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhdHRyTmFtZXMsIGF0dHJOYW1lKSkge1xuICAgICAgLy9jaGVjayBmb3IgZHVwbGljYXRlIGF0dHJpYnV0ZS5cbiAgICAgIGF0dHJOYW1lc1thdHRyTmFtZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIHJlcGVhdGVkLid9fTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSAvXltfYS16QS1aXVtcXHdcXC0uOl0qJC87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkge1xuICAvLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IG5ldyBSZWdFeHAocmVneEF0dHJOYW1lKTtcbiAgcmV0dXJuIHV0aWwuZG9lc01hdGNoKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpO1xufVxuXG4vL2NvbnN0IHN0YXJ0c1dpdGhYTUwgPSBuZXcgUmVnRXhwKFwiXltYeF1bTW1dW0xsXVwiKTtcbi8vICBzdGFydHNXaXRoID0gL14oW2EtekEtWl18XylbXFx3LlxcLV86XSovO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVRhZ05hbWUodGFnbmFtZSwgcmVneFRhZ05hbWUpIHtcbiAgLyppZih1dGlsLmRvZXNNYXRjaCh0YWduYW1lLHN0YXJ0c1dpdGhYTUwpKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSovXG4gIHJldHVybiAhdXRpbC5kb2VzTm90TWF0Y2godGFnbmFtZSwgcmVneFRhZ05hbWUpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhZ25hbWUsIHBhcmVudCwgdmFsKSB7XG4gIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB0aGlzLmNoaWxkID0ge307IC8vY2hpbGQgdGFnc1xuICB0aGlzLmF0dHJzTWFwID0ge307IC8vYXR0cmlidXRlcyBtYXBcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB0aGlzLnZhbCA9IHZhbDsgLy90ZXh0IG9ubHlcbiAgdGhpcy5hZGRDaGlsZCA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdKSkge1xuICAgICAgLy9hbHJlYWR5IHByZXNlbnRzXG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdLnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdID0gW2NoaWxkXTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB4bWxOb2RlID0gcmVxdWlyZSgnLi94bWxOb2RlJyk7XG5jb25zdCBUYWdUeXBlID0ge09QRU5JTkc6IDEsIENMT1NJTkc6IDIsIFNFTEY6IDMsIENEQVRBOiA0fTtcbmxldCByZWd4ID1cbiAgJzwoKCFcXFxcW0NEQVRBXFxcXFsoW1xcXFxzXFxcXFNdKj8pKF1dPikpfCgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSkoW14+XSopPnwoKFxcXFwvKSgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSlcXFxccyo+KSkoW148XSopJztcblxuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvP1tcXFxcdzpcXFxcLVxcLl9dKykoW14+XSopPihcXFxccypcIitjZGF0YVJlZ3grXCIpKihbXjxdKyk/XCIsXCJnXCIpO1xuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvPykoKFxcXFx3KjopPyhbXFxcXHc6XFxcXC1cXC5fXSspKShbXj5dKik+KFtePF0qKShcIitjZGF0YVJlZ3grXCIoW148XSopKSooW148XSspP1wiLFwiZ1wiKTtcblxuLy9wb2x5ZmlsbFxuaWYgKCFOdW1iZXIucGFyc2VJbnQgJiYgd2luZG93LnBhcnNlSW50KSB7XG4gIE51bWJlci5wYXJzZUludCA9IHdpbmRvdy5wYXJzZUludDtcbn1cbmlmICghTnVtYmVyLnBhcnNlRmxvYXQgJiYgd2luZG93LnBhcnNlRmxvYXQpIHtcbiAgTnVtYmVyLnBhcnNlRmxvYXQgPSB3aW5kb3cucGFyc2VGbG9hdDtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICdAXycsXG4gIGF0dHJOb2RlTmFtZTogZmFsc2UsXG4gIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgaWdub3JlQXR0cmlidXRlczogdHJ1ZSxcbiAgaWdub3JlTmFtZVNwYWNlOiBmYWxzZSxcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vYSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICAvL2lnbm9yZVJvb3RFbGVtZW50IDogZmFsc2UsXG4gIHBhcnNlTm9kZVZhbHVlOiB0cnVlLFxuICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgYXJyYXlNb2RlOiBmYWxzZSxcbiAgdHJpbVZhbHVlczogdHJ1ZSwgLy9UcmltIHN0cmluZyB2YWx1ZXMgb2YgdGFnIGFuZCBhdHRyaWJ1dGVzXG4gIGNkYXRhVGFnTmFtZTogZmFsc2UsXG4gIGNkYXRhUG9zaXRpb25DaGFyOiAnXFxcXGMnLFxuICBsb2NhbGVSYW5nZTogJycsXG4gIHRhZ1ZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIGF0dHJWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBzdG9wTm9kZXM6IFtdXG4gIC8vZGVjb2RlU3RyaWN0OiBmYWxzZSxcbn07XG5cbmV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcblxuY29uc3QgcHJvcHMgPSBbXG4gICdhdHRyaWJ1dGVOYW1lUHJlZml4JyxcbiAgJ2F0dHJOb2RlTmFtZScsXG4gICd0ZXh0Tm9kZU5hbWUnLFxuICAnaWdub3JlQXR0cmlidXRlcycsXG4gICdpZ25vcmVOYW1lU3BhY2UnLFxuICAnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsXG4gICdwYXJzZU5vZGVWYWx1ZScsXG4gICdwYXJzZUF0dHJpYnV0ZVZhbHVlJyxcbiAgJ2FycmF5TW9kZScsXG4gICd0cmltVmFsdWVzJyxcbiAgJ2NkYXRhVGFnTmFtZScsXG4gICdjZGF0YVBvc2l0aW9uQ2hhcicsXG4gICdsb2NhbGVSYW5nZScsXG4gICd0YWdWYWx1ZVByb2Nlc3NvcicsXG4gICdhdHRyVmFsdWVQcm9jZXNzb3InLFxuICAncGFyc2VUcnVlTnVtYmVyT25seScsXG4gICdzdG9wTm9kZXMnXG5dO1xuZXhwb3J0cy5wcm9wcyA9IHByb3BzO1xuXG5jb25zdCBnZXRUcmF2ZXJzYWxPYmogPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC9cXHI/XFxuL2csIFwiIFwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgeG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvPCEtLVtcXHNcXFNdKj8tLT4vZywgJycpOyAvL1JlbW92ZSAgY29tbWVudHNcblxuICBjb25zdCB4bWxPYmogPSBuZXcgeG1sTm9kZSgnIXhtbCcpO1xuICBsZXQgY3VycmVudE5vZGUgPSB4bWxPYmo7XG5cbiAgcmVneCA9IHJlZ3gucmVwbGFjZSgvXFxbXFxcXHcvZywgJ1snICsgb3B0aW9ucy5sb2NhbGVSYW5nZSArICdcXFxcdycpO1xuICBjb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAocmVneCwgJ2cnKTtcbiAgbGV0IHRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIGxldCBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgd2hpbGUgKHRhZykge1xuICAgIGNvbnN0IHRhZ1R5cGUgPSBjaGVja0ZvclRhZ1R5cGUodGFnKTtcblxuICAgIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNMT1NJTkcpIHtcbiAgICAgIC8vYWRkIHBhcnNlZCBkYXRhIHRvIHBhcmVudCBub2RlXG4gICAgICBpZiAoY3VycmVudE5vZGUucGFyZW50ICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUucGFyZW50LnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUucGFyZW50LnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMsIGN1cnJlbnROb2RlLnBhcmVudC50YWduYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY3VycmVudE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY3VycmVudE5vZGUuY2hpbGQgPSBbXVxuICAgICAgICBpZiAoY3VycmVudE5vZGUuYXR0cnNNYXAgPT0gdW5kZWZpbmVkKSB7IGN1cnJlbnROb2RlLmF0dHJzTWFwID0ge319XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHhtbERhdGEuc3Vic3RyKGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggKyAxLCB0YWcuaW5kZXggLSBjdXJyZW50Tm9kZS5zdGFydEluZGV4IC0gMSlcbiAgICAgIH1cbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50O1xuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DREFUQSkge1xuICAgICAgaWYgKG9wdGlvbnMuY2RhdGFUYWdOYW1lKSB7XG4gICAgICAgIC8vYWRkIGNkYXRhIG5vZGVcbiAgICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5jZGF0YVRhZ05hbWUsIGN1cnJlbnROb2RlLCB0YWdbM10pO1xuICAgICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgLy9mb3IgYmFja3RyYWNraW5nXG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArIG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXI7XG4gICAgICAgIC8vYWRkIHJlc3QgdmFsdWUgdG8gcGFyZW50IG5vZGVcbiAgICAgICAgaWYgKHRhZ1sxNF0pIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS52YWwgKz0gcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IChjdXJyZW50Tm9kZS52YWwgfHwgJycpICsgKHRhZ1szXSB8fCAnJykgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuU0VMRikge1xuICAgICAgaWYgKGN1cnJlbnROb2RlICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sIGN1cnJlbnROb2RlLCAnJyk7XG4gICAgICBpZiAodGFnWzhdICYmIHRhZ1s4XS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRhZ1s4XSA9IHRhZ1s4XS5zdWJzdHIoMCwgdGFnWzhdLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1RhZ1R5cGUuT1BFTklOR1xuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUoXG4gICAgICAgIG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLFxuICAgICAgICBjdXJyZW50Tm9kZSxcbiAgICAgICAgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucylcbiAgICAgICk7XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGNoaWxkTm9kZS50YWduYW1lKSkge1xuICAgICAgICBjaGlsZE5vZGUuc3RhcnRJbmRleD10YWcuaW5kZXggKyB0YWdbMV0ubGVuZ3RoXG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZTtcbiAgICB9XG5cbiAgICB0YWcgPSBuZXh0VGFnO1xuICAgIG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHhtbE9iajtcbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3NUYWdWYWx1ZShwYXJzZWRUYWdzLCBvcHRpb25zLCBwYXJlbnRUYWdOYW1lKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBwYXJzZWRUYWdzWzddIHx8IHBhcmVudFRhZ05hbWU7XG4gIGxldCB2YWwgPSBwYXJzZWRUYWdzWzE0XTtcbiAgaWYgKHZhbCkge1xuICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgfVxuICAgIHZhbCA9IG9wdGlvbnMudGFnVmFsdWVQcm9jZXNzb3IodmFsLCB0YWdOYW1lKTtcbiAgICB2YWwgPSBwYXJzZVZhbHVlKHZhbCwgb3B0aW9ucy5wYXJzZU5vZGVWYWx1ZSwgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5KTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yVGFnVHlwZShtYXRjaCkge1xuICBpZiAobWF0Y2hbNF0gPT09ICddXT4nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0RBVEE7XG4gIH0gZWxzZSBpZiAobWF0Y2hbMTBdID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DTE9TSU5HO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaFs4XSAhPT0gJ3VuZGVmaW5lZCcgJiYgbWF0Y2hbOF0uc3Vic3RyKG1hdGNoWzhdLmxlbmd0aCAtIDEpID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5TRUxGO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBUYWdUeXBlLk9QRU5JTkc7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hbWVTcGFjZSh0YWduYW1lLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSkge1xuICAgIGNvbnN0IHRhZ3MgPSB0YWduYW1lLnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgcHJlZml4ID0gdGFnbmFtZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIGlmICh0YWdzWzBdID09PSAneG1sbnMnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICh0YWdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGFnbmFtZSA9IHByZWZpeCArIHRhZ3NbMV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YWduYW1lO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbCwgc2hvdWxkUGFyc2UsIHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgaWYgKHNob3VsZFBhcnNlICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgbGV0IHBhcnNlZDtcbiAgICBpZiAodmFsLnRyaW0oKSA9PT0gJycgfHwgaXNOYU4odmFsKSkge1xuICAgICAgcGFyc2VkID0gdmFsID09PSAndHJ1ZScgPyB0cnVlIDogdmFsID09PSAnZmFsc2UnID8gZmFsc2UgOiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWwuaW5kZXhPZignMHgnKSAhPT0gLTEpIHtcbiAgICAgICAgLy9zdXBwb3J0IGhleGEgZGVjaW1hbFxuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxNik7XG4gICAgICB9IGVsc2UgaWYgKHZhbC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUZsb2F0KHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyc2VUcnVlTnVtYmVyT25seSkge1xuICAgICAgICBwYXJzZWQgPSBTdHJpbmcocGFyc2VkKSA9PT0gdmFsID8gcGFyc2VkIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9IGVsc2Uge1xuICAgIGlmICh1dGlsLmlzRXhpc3QodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufVxuXG4vL1RPRE86IGNoYW5nZSByZWdleCB0byBjYXB0dXJlIE5TXG4vL2NvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoXCIoW1xcXFx3XFxcXC1cXFxcLlxcXFw6XSspXFxcXHMqPVxcXFxzKihbJ1xcXCJdKSgoLnxcXG4pKj8pXFxcXDJcIixcImdtXCIpO1xuY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cCgnKFteXFxcXHM9XSspXFxcXHMqKD1cXFxccyooW1xcJ1wiXSkoLio/KVxcXFwzKT8nLCAnZycpO1xuXG5mdW5jdGlvbiBidWlsZEF0dHJpYnV0ZXNNYXAoYXR0clN0ciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAmJiB0eXBlb2YgYXR0clN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICBhdHRyU3RyID0gYXR0clN0ci5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgLy9hdHRyU3RyID0gYXR0clN0ciB8fCBhdHRyU3RyLnRyaW0oKTtcblxuICAgIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgYXR0cnNSZWd4KTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGNvbnN0IGF0dHJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSByZXNvbHZlTmFtZVNwYWNlKG1hdGNoZXNbaV1bMV0sIG9wdGlvbnMpO1xuICAgICAgaWYgKGF0dHJOYW1lLmxlbmd0aCkge1xuICAgICAgICBpZiAobWF0Y2hlc1tpXVs0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG1hdGNoZXNbaV1bNF0udHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gb3B0aW9ucy5hdHRyVmFsdWVQcm9jZXNzb3IobWF0Y2hlc1tpXVs0XSwgYXR0ck5hbWUpO1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHBhcnNlVmFsdWUoXG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZUF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdHRyTm9kZU5hbWUpIHtcbiAgICAgIGNvbnN0IGF0dHJDb2xsZWN0aW9uID0ge307XG4gICAgICBhdHRyQ29sbGVjdGlvbltvcHRpb25zLmF0dHJOb2RlTmFtZV0gPSBhdHRycztcbiAgICAgIHJldHVybiBhdHRyQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG59XG5cbmV4cG9ydHMuZ2V0VHJhdmVyc2FsT2JqID0gZ2V0VHJhdmVyc2FsT2JqO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5cbi8qKlxuICogR2VuZXJpYyBhbmltYXRpb24gY2xhc3Mgd2l0aCBzdXBwb3J0IGZvciBkcm9wcGVkIGZyYW1lcyBib3RoIG9wdGlvbmFsIGVhc2luZyBhbmQgZHVyYXRpb24uXG4gKlxuICogT3B0aW9uYWwgZHVyYXRpb24gaXMgdXNlZnVsIHdoZW4gdGhlIGxpZmV0aW1lIGlzIGRlZmluZWQgYnkgYW5vdGhlciBjb25kaXRpb24gdGhhbiB0aW1lXG4gKiBlLmcuIHNwZWVkIG9mIGFuIGFuaW1hdGluZyBvYmplY3QsIGV0Yy5cbiAqXG4gKiBEcm9wcGVkIGZyYW1lIGxvZ2ljIGFsbG93cyB0byBrZWVwIHVzaW5nIHRoZSBzYW1lIHVwZGF0ZXIgbG9naWMgaW5kZXBlbmRlbnQgZnJvbSB0aGUgYWN0dWFsXG4gKiByZW5kZXJpbmcuIFRoaXMgZWFzZXMgYSBsb3Qgb2YgY2FzZXMgd2hlcmUgaXQgbWlnaHQgYmUgcHJldHR5IGNvbXBsZXggdG8gYnJlYWsgZG93biBhIHN0YXRlXG4gKiBiYXNlZCBvbiB0aGUgcHVyZSB0aW1lIGRpZmZlcmVuY2UuXG4gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3RvcnkoKHJvb3QuYW5pbWF0ZSA9IHt9KSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3dcbiAgICB2YXIgdGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgdmFyIGRlc2lyZWRGcmFtZXMgPSA2MDtcbiAgICB2YXIgbWlsbGlzZWNvbmRzUGVyU2Vjb25kID0gMTAwMDtcbiAgICB2YXIgcnVubmluZyA9IHt9O1xuICAgIHZhciBjb3VudGVyID0gMTtcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRoZSBnaXZlbiBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gd2FzIHN0b3BwZWQgKGFrYSwgd2FzIHJ1bm5pbmcgYmVmb3JlKVxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RvcCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgY2xlYXJlZCA9IChydW5uaW5nW2lkXSAhPT0gbnVsbCk7XG4gICAgICAgIGlmIChjbGVhcmVkKSB7XG4gICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xlYXJlZDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBnaXZlbiBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nXG4gICAgICovXG4gICAgZXhwb3J0cy5pc1J1bm5pbmcgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHJ1bm5pbmdbaWRdICE9PSBudWxsO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RlcENhbGxiYWNrIHtGdW5jdGlvbn0gUG9pbnRlciB0byBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZCBvbiBldmVyeSBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50LCBub3csIHZpcnR1YWwpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gdmVyaWZ5Q2FsbGJhY2sge0Z1bmN0aW9ufSBFeGVjdXRlZCBiZWZvcmUgZXZlcnkgYW5pbWF0aW9uIHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRDYWxsYmFjayB7RnVuY3Rpb259XG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKGRyb3BwZWRGcmFtZXMsIGZpbmlzaGVkQW5pbWF0aW9uLCBvcHRpb25hbCB3YXNGaW5pc2hlZCkge31gXG4gICAgICogQHBhcmFtIGR1cmF0aW9uIHtJbnRlZ2VyfSBNaWxsaXNlY29uZHMgdG8gcnVuIHRoZSBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0gZWFzaW5nTWV0aG9kIHtGdW5jdGlvbn0gUG9pbnRlciB0byBlYXNpbmcgZnVuY3Rpb25cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCkgeyByZXR1cm4gbW9kaWZpZWRWYWx1ZTsgfWBcbiAgICAgKiBAcGFyYW0gcm9vdCB7RWxlbWVudH0gUmVuZGVyIHJvb3QuIFVzZWQgZm9yIGludGVybmFsIHVzYWdlIG9mIHJlcXVlc3RBbmltYXRpb25GcmFtZS5cbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBJZGVudGlmaWVyIG9mIGFuaW1hdGlvbi4gQ2FuIGJlIHVzZWQgdG8gc3RvcCBpdCBhbnkgdGltZS5cbiAgICAgKi9cbiAgICBleHBvcnRzLnN0YXJ0ID0gZnVuY3Rpb24gKHN0ZXBDYWxsYmFjaywgdmVyaWZ5Q2FsbGJhY2ssIGNvbXBsZXRlZENhbGxiYWNrLCBkdXJhdGlvbiwgZWFzaW5nTWV0aG9kLCByb290KSB7XG4gICAgICAgIHZhciBzdGFydCA9IHRpbWUoKTtcbiAgICAgICAgdmFyIGxhc3RGcmFtZSA9IHN0YXJ0O1xuICAgICAgICB2YXIgcGVyY2VudCA9IDA7XG4gICAgICAgIHZhciBkcm9wQ291bnRlciA9IDA7XG4gICAgICAgIHZhciBpZCA9IGNvdW50ZXIrKztcblxuICAgICAgICAvLyBDb21wYWN0aW5nIHJ1bm5pbmcgZGIgYXV0b21hdGljYWxseSBldmVyeSBmZXcgbmV3IGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlkICUgMjAgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBuZXdSdW5uaW5nID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciB1c2VkSWQgaW4gcnVubmluZykge1xuICAgICAgICAgICAgICAgIG5ld1J1bm5pbmdbdXNlZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5uaW5nID0gbmV3UnVubmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGludGVybmFsIHN0ZXAgbWV0aG9kIHdoaWNoIGlzIGNhbGxlZCBldmVyeSBmZXcgbWlsbGlzZWNvbmRzXG4gICAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHZpcnR1YWwpIHtcblxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHZpcnR1YWwgdmFsdWVcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSB2aXJ0dWFsICE9PSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudCB0aW1lXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSgpO1xuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gaXMgZXhlY3V0ZWQgYmVmb3JlIG5leHQgYW5pbWF0aW9uIHN0ZXBcbiAgICAgICAgICAgIGlmICghcnVubmluZ1tpZF0gfHwgKHZlcmlmeUNhbGxiYWNrICYmICF2ZXJpZnlDYWxsYmFjayhpZCkpKSB7XG5cbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciB0aGUgY3VycmVudCByZW5kZXJpbmcgdG8gYXBwbHkgbGV0J3MgdXBkYXRlIG9taXR0ZWQgc3RlcHMgaW4gbWVtb3J5LlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gYnJpbmcgaW50ZXJuYWwgc3RhdGUgdmFyaWFibGVzIHVwLXRvLWRhdGUgd2l0aCBwcm9ncmVzcyBpbiB0aW1lLlxuICAgICAgICAgICAgaWYgKHJlbmRlcikge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRyb3BwZWRGcmFtZXMgPSBNYXRoLnJvdW5kKChub3cgLSBsYXN0RnJhbWUpIC8gKG1pbGxpc2Vjb25kc1BlclNlY29uZCAvIGRlc2lyZWRGcmFtZXMpKSAtIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNYXRoLm1pbihkcm9wcGVkRnJhbWVzLCA0KTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGRyb3BDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgcGVyY2VudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IChub3cgLSBzdGFydCkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHN0ZXAgY2FsbGJhY2ssIHRoZW4uLi5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVhc2luZ01ldGhvZCA/IGVhc2luZ01ldGhvZChwZXJjZW50KSA6IHBlcmNlbnQ7XG4gICAgICAgICAgICBpZiAoKHN0ZXBDYWxsYmFjayh2YWx1ZSwgbm93LCByZW5kZXIpID09PSBmYWxzZSB8fCBwZXJjZW50ID09PSAxKSAmJiByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBwZXJjZW50ID09PSAxIHx8IGR1cmF0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0RnJhbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcmsgYXMgcnVubmluZ1xuICAgICAgICBydW5uaW5nW2lkXSA9IHRydWU7XG5cbiAgICAgICAgLy8gSW5pdCBmaXJzdCBzdGVwXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcblxuICAgICAgICAvLyBSZXR1cm4gdW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn0pKTtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcbnZhciBOT09QID0gZnVuY3Rpb24gKCkgeyB9O1xuXG4vLyBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFJvYmVydCBQZW5uZXIsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZU91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZUluT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIGlmICgocG9zIC89IDAuNSkgPCAxKSB7XG4gICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywgMyk7XG4gIH1cblxuICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwgMykgKyAyKTtcbn07XG5cblxuLyoqXG4gKiBBIHB1cmUgbG9naWMgJ2NvbXBvbmVudCcgZm9yICd2aXJ0dWFsJyBzY3JvbGxpbmcvem9vbWluZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIHRoaXMuX19jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geC1heGlzICovXG4gICAgICBzY3JvbGxpbmdYOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB5LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1k6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgYW5pbWF0aW9ucyBmb3IgZGVjZWxlcmF0aW9uLCBzbmFwIGJhY2ssIHpvb21pbmcgYW5kIHNjcm9sbGluZyAqL1xuICAgICAgYW5pbWF0aW5nOiB0cnVlLFxuXG4gICAgICAvKiogZHVyYXRpb24gZm9yIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIGJ5IHNjcm9sbFRvL3pvb21UbyAqL1xuICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDI1MCxcblxuICAgICAgLyoqIEVuYWJsZSBib3VuY2luZyAoY29udGVudCBjYW4gYmUgc2xvd2x5IG1vdmVkIG91dHNpZGUgYW5kIGp1bXBzIGJhY2sgYWZ0ZXIgcmVsZWFzaW5nKSAqL1xuICAgICAgYm91bmNpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgbG9ja2luZyB0byB0aGUgbWFpbiBheGlzIGlmIHVzZXIgbW92ZXMgb25seSBzbGlnaHRseSBvbiBvbmUgb2YgdGhlbSBhdCBzdGFydCAqL1xuICAgICAgbG9ja2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBwYWdpbmF0aW9uIG1vZGUgKHN3aXRjaGluZyBiZXR3ZWVuIGZ1bGwgcGFnZSBjb250ZW50IHBhbmVzKSAqL1xuICAgICAgcGFnaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSBzbmFwcGluZyBvZiBjb250ZW50IHRvIGEgY29uZmlndXJlZCBwaXhlbCBncmlkICovXG4gICAgICBzbmFwcGluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgem9vbWluZyBvZiBjb250ZW50IHZpYSBBUEksIGZpbmdlcnMgYW5kIG1vdXNlIHdoZWVsICovXG4gICAgICB6b29taW5nOiBmYWxzZSxcblxuICAgICAgLyoqIE1pbmltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWluWm9vbTogMC41LFxuXG4gICAgICAvKiogTWF4aW11bSB6b29tIGxldmVsICovXG4gICAgICBtYXhab29tOiAzLFxuXG4gICAgICAvKiogTXVsdGlwbHkgb3IgZGVjcmVhc2Ugc2Nyb2xsaW5nIHNwZWVkICoqL1xuICAgICAgc3BlZWRNdWx0aXBsaWVyOiAxLFxuXG4gICAgICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBmaXJlZCBvbiB0aGUgbGF0ZXIgb2YgdG91Y2ggZW5kIG9yIGRlY2VsZXJhdGlvbiBlbmQsXG4gICAgICAgICAgcHJvdmlkZWQgdGhhdCBhbm90aGVyIHNjcm9sbGluZyBhY3Rpb24gaGFzIG5vdCBiZWd1bi4gVXNlZCB0byBrbm93XG4gICAgICAgICAgd2hlbiB0byBmYWRlIG91dCBhIHNjcm9sbGJhci4gKi9cbiAgICAgIHNjcm9sbGluZ0NvbXBsZXRlOiBOT09QLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjogMC4wMyxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGFjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25BY2NlbGVyYXRpb246IDAuMDhcbiAgICB9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIElOVEVSTkFMIEZJRUxEUyA6OiBTVEFUVVNcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIG9ubHkgYSBzaW5nbGUgZmluZ2VyIGlzIHVzZWQgaW4gdG91Y2ggaGFuZGxpbmcgKi9cbiAgX19pc1NpbmdsZVRvdWNoID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgdG91Y2ggZXZlbnQgc2VxdWVuY2UgaXMgaW4gcHJvZ3Jlc3MgKi9cbiAgX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbiB3ZW50IHRvIGNvbXBsZXRpb24uICovXG4gIF9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgYSBnZXN0dXJlIHpvb20vcm90YXRlIGV2ZW50IGlzIGluIHByb2dyZXNzLiBBY3RpdmF0ZXMgd2hlblxuICAgKiBhIGdlc3R1cmVzdGFydCBldmVudCBoYXBwZW5zLiBUaGlzIGhhcyBoaWdoZXIgcHJpb3JpdHkgdGhhbiBkcmFnZ2luZy5cbiAgICovXG4gIF9faXNHZXN0dXJpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHVzZXIgaGFzIG1vdmVkIGJ5IHN1Y2ggYSBkaXN0YW5jZSB0aGF0IHdlIGhhdmUgZW5hYmxlZFxuICAgKiBkcmFnZ2luZyBtb2RlLiBIaW50ID0gSXQncyBvbmx5IGVuYWJsZWQgYWZ0ZXIgc29tZSBwaXhlbHMgb2YgbW92ZW1lbnQgdDtcbiAgICogbm90IGludGVycnVwdCB3aXRoIGNsaWNrcyBldGMuXG4gICAqL1xuICBfX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IE5vdCB0b3VjaGluZyBhbmQgZHJhZ2dpbmcgYW55bW9yZSwgYW5kIHNtb290aGx5IGFuaW1hdGluZyB0aGVcbiAgICogdG91Y2ggc2VxdWVuY2UgdXNpbmcgZGVjZWxlcmF0aW9uLlxuICAgKi9cbiAgX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gU21vb3RobHkgYW5pbWF0aW5nIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBjaGFuZ2VcbiAgICovXG4gIF9faXNBbmltYXRpbmcgPSBmYWxzZTtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogRElNRU5TSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgbGVmdCBib3VuZGFyeSAqL1xuICBfX2NsaWVudExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgcmlnaHQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgd2lkdGggKi9cbiAgX19jbGllbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBoZWlnaHQgKi9cbiAgX19jbGllbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3Mgd2lkdGggKi9cbiAgX19jb250ZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3MgaGVpZ2h0ICovXG4gIF9fY29udGVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBXaWR0aCA9IDEwMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBIZWlnaHQgPSAxMDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFpvb20gbGV2ZWwgKi9cbiAgX196b29tTGV2ZWwgPSAxO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fc2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19zY3JvbGxUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fbWF4U2Nyb2xsVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgbGVmdCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkTGVmdCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHRvcCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgem9vbSBsZXZlbCAoZmluYWwgc2NhbGUgd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkWm9vbSA9IDA7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IExBU1QgUE9TSVRJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtOdW1iZXJ9IExlZnQgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IFRvcCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hUb3AgPSBudWxsO1xuXG4gIC8qKiB7RGF0ZX0gVGltZXN0YW1wIG9mIGxhc3QgbW92ZSBvZiBmaW5nZXIuIFVzZWQgdG8gbGltaXQgdHJhY2tpbmcgcmFuZ2UgZm9yIGRlY2VsZXJhdGlvbiBzcGVlZC4gKi9cbiAgX19sYXN0VG91Y2hNb3ZlID0gbnVsbDtcblxuICAvKioge0FycmF5fSBMaXN0IG9mIHBvc2l0aW9ucywgdXNlcyB0aHJlZSBpbmRleGVzIGZvciBlYWNoIHN0YXRlID0gbGVmdCwgdG9wLCB0aW1lc3RhbXAgKjtcbiAgX19wb3NpdGlvbnMgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6ID0gREVDRUxFUkFUSU9OIFNVUFBPUjtcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgUFVCTElDIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBjbGllbnQgKG91dGVyKSBhbmQgY29udGVudCAoaW5uZXIpIGVsZW1lbnRzLlxuICAgKiBSZXF1aXJlcyB0aGUgYXZhaWxhYmxlIHNwYWNlIGZvciB0aGUgb3V0ZXIgZWxlbWVudCBhbmQgdGhlIG91dGVyIHNpemUgb2YgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAqIEFsbCB2YWx1ZXMgd2hpY2ggYXJlIGZhbHN5IChudWxsIG9yIHplcm8gZXRjLikgYXJlIGlnbm9yZWQgYW5kIHRoZSBvbGQgdmFsdWUgaXMga2VwdC5cbiAgICpcbiAgICogQHBhcmFtIGNsaWVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgd2lkdGggb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY2xpZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgaGVpZ2h0IG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IE91dGVyIHdpZHRoIG9mIGlubmVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBPdXRlciBoZWlnaHQgb2YgaW5uZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB2YWx1ZXMgd2hpY2ggYXJlIGRlZmluZWRcbiAgICBpZiAoY2xpZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRXaWR0aCA9IGNsaWVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjbGllbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRIZWlnaHQgPSBjbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRXaWR0aCA9IGNvbnRlbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRIZWlnaHQgPSBjb250ZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIFJlZnJlc2ggbWF4aW11bXNcbiAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuXG4gICAgLy8gUmVmcmVzaCBzY3JvbGwgcG9zaXRpb25cbiAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0cnVlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNsaWVudCBjb29yZGluYXRlcyBpbiByZWxhdGlvbiB0byB0aGUgZG9jdW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtJbnRlZ2VyID8gMH0gTGVmdCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSB0b3Age0ludGVnZXIgPyAwfSBUb3AgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0UG9zaXRpb24obGVmdCwgdG9wKSB7XG4gICAgdGhpcy5fX2NsaWVudExlZnQgPSBsZWZ0IHx8IDA7XG4gICAgdGhpcy5fX2NsaWVudFRvcCA9IHRvcCB8fCAwO1xuICB9XG5cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgc25hcHBpbmcgKHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlKVxuICAgKlxuICAgKiBAcGFyYW0gd2lkdGgge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoXG4gICAqIEBwYXJhbSBoZWlnaHQge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodFxuICAgKi9cbiAgc2V0U25hcFNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX19zbmFwV2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLl9fc25hcEhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmcgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBzY3JvbGwgcG9zaXRpb24gYW5kIGB6b29tYCBsZXZlbFxuICAgKi9cbiAgZ2V0VmFsdWVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLl9fc2Nyb2xsTGVmdCxcbiAgICAgIHRvcDogdGhpcy5fX3Njcm9sbFRvcCxcbiAgICAgIHJpZ2h0OiB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19jbGllbnRXaWR0aCAvIHRoaXMuX196b29tTGV2ZWwsXG4gICAgICBib3R0b206IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIHpvb206IHRoaXMuX196b29tTGV2ZWxcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogR2V0IHBvaW50IGluIGluIGNvbnRlbnQgc3BhY2UgZnJvbSBzY3JvbGwgY29vcmRpbmF0ZXMuXG4gICAqL1xuICBnZXRQb2ludChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApIHtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBzY3JvbGxMZWZ0IC8gdmFsdWVzLnpvb20sXG4gICAgICB0b3A6IHNjcm9sbFRvcCAvIHZhbHVlcy56b29tXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtNYXB9IGBsZWZ0YCBhbmQgYHRvcGAgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqL1xuICBnZXRTY3JvbGxNYXgoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fbWF4U2Nyb2xsVG9wXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRvIHRoZSBnaXZlbiBsZXZlbC4gU3VwcG9ydHMgb3B0aW9uYWwgYW5pbWF0aW9uLiBab29tc1xuICAgKiB0aGUgY2VudGVyIHdoZW4gbm8gY29vcmRpbmF0ZXMgYXJlIGdpdmVuLlxuICAgKlxuICAgKiBAcGFyYW0gbGV2ZWwge051bWJlcn0gTGV2ZWwgdG8gem9vbSB0b1xuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICogQHBhcmFtIGZpeGVkTGVmdCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgbGVmdCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gZml4ZWRUb3Age051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIHRvcCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21UbyhsZXZlbCwgaXNBbmltYXRlZCwgZml4ZWRMZWZ0LCBmaXhlZFRvcCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgY2FsbGJhY2sgaWYgZXhpc3RzXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvbGRMZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBOb3JtYWxpemUgZml4ZWQgcG9pbnQgdG8gY2VudGVyIG9mIHZpZXdwb3J0IGlmIG5vdCBkZWZpbmVkXG4gICAgaWYgKGZpeGVkTGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZExlZnQgPSB0aGlzLl9fY2xpZW50V2lkdGggLyAyO1xuICAgIH1cblxuICAgIGlmIChmaXhlZFRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZFRvcCA9IHRoaXMuX19jbGllbnRIZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcblxuICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3Agc2Nyb2xsIHBvc2l0aW9ucyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbC5cbiAgICAvLyBDaG9vc2luZyB0aGUgbmV3IHZpZXdwb3J0IHNvIHRoYXQgdGhlIG9yaWdpbidzIHBvc2l0aW9uIHJlbWFpbnNcbiAgICAvLyBmaXhlZCwgd2UgaGF2ZSBjZW50cmFsIGRpbGF0aW9uIGFib3V0IHRoZSBvcmlnaW4uXG4gICAgLy8gKiBGaXhlZCBwb2ludCwgJEYkLCByZW1haW5zIHN0YXRpb25hcnkgaW4gY29udGVudCBzcGFjZSBhbmQgaW4gdGhlXG4gICAgLy8gdmlld3BvcnQuXG4gICAgLy8gKiBJbml0aWFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfaSQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBGaW5hbCBzY3JvbGwgcG9zaXRpb24sICRTX2YkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgIC8vICogSW5pdGlhbCBzY2FsaW5nIGZhY3RvciwgJGtfaSQuXG4gICAgLy8gKiBGaW5hbCBzY2FsaW5nIGZhY3RvciwgJGtfZiQuXG4gICAgLy9cbiAgICAvLyAqICRTX2kgXFxtYXBzdG8gU19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pID0gKFNfZiAtIEYpIGtfZiQuXG4gICAgLy8gKiAkKFNfaSAtIEYpIGtfaS9rX2YgPSAoU19mIC0gRikkLlxuICAgIC8vICogJFNfZiA9IEYgKyAoU19pIC0gRikga19pL2tfZiQuXG4gICAgLy9cbiAgICAvLyBGaXhlZCBwb2ludCBsb2NhdGlvbiwgJFxcdmVjdG9ye2Z9ID0gKEYgLSBTX2kpIGtfaSQuXG4gICAgLy8gKiAkRiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pICsgKFNfaSAtIFNfaSAtIFxcdmVjdG9ye2Z9L2tfaSkga19pL2tfZiQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pIC0gXFx2ZWN0b3J7Zn0va19mJC5cbiAgICAvLyAqICRTX2Yga19mID0gU19pIGtfZiArIChrX2Yva19pIC0gMSlcXHZlY3RvcntmfSQuXG4gICAgLy8gKiAkU19mIGtfZiA9IChrX2Yva19pKShTX2kga19pKSArIChrX2Yva19pIC0gMSkgXFx2ZWN0b3J7Zn0kLlxuICAgIHZhciBrID0gbGV2ZWwgLyBvbGRMZXZlbDtcbiAgICB2YXIgbGVmdCA9IGsgKiAodGhpcy5fX3Njcm9sbExlZnQgKyBmaXhlZExlZnQpIC0gZml4ZWRMZWZ0O1xuICAgIHZhciB0b3AgPSBrICogKHRoaXMuX19zY3JvbGxUb3AgKyBmaXhlZFRvcCkgLSBmaXhlZFRvcDtcblxuICAgIC8vIExpbWl0IHgtYXhpc1xuICAgIGlmIChsZWZ0ID4gdGhpcy5fX21heFNjcm9sbExlZnQpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICB9IGVsc2UgaWYgKGxlZnQgPCAwKSB7XG4gICAgICBsZWZ0ID0gMDtcbiAgICB9XG5cbiAgICAvLyBMaW1pdCB5LWF4aXNcbiAgICBpZiAodG9wID4gdGhpcy5fX21heFNjcm9sbFRvcCkge1xuICAgICAgdG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9IGVsc2UgaWYgKHRvcCA8IDApIHtcbiAgICAgIHRvcCA9IDA7XG4gICAgfVxuXG4gICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCBsZXZlbCwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBab29tcyB0aGUgY29udGVudCBieSB0aGUgZ2l2ZW4gZmFjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gZmFjdG9yIHtOdW1iZXJ9IFpvb20gYnkgZ2l2ZW4gZmFjdG9yXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gb3JpZ2luTGVmdCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiBsZWZ0IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIG9yaWdpblRvcCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiB0b3AgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21CeShmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdG8gdGhlIGdpdmVuIHBvc2l0aW9uLiBSZXNwZWN0IGxpbWl0YXRpb25zIGFuZCBzbmFwcGluZyBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyP251bGx9IEhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAqIEBwYXJhbSB0b3Age051bWJlcj9udWxsfSBWZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdGhlIHNjcm9sbGluZyBzaG91bGQgaGFwcGVuIHVzaW5nIGFuIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gem9vbSB7TnVtYmVyfSBbMS4wXSBab29tIGxldmVsIHRvIGdvIHRvXG4gICAqL1xuICBzY3JvbGxUbyhsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQsIHpvb20pIHtcbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQ29ycmVjdCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgIGlmICh6b29tICE9PSB1bmRlZmluZWQgJiYgem9vbSAhPT0gdGhpcy5fX3pvb21MZXZlbCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICAgIH1cblxuICAgICAgbGVmdCAqPSB6b29tO1xuICAgICAgdG9wICo9IHpvb207XG5cbiAgICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCh6b29tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gS2VlcCB6b29tIHdoZW4gbm90IGRlZmluZWRcbiAgICAgIHpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1gpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIHRoaXMuX19jbGllbnRXaWR0aCkgKiB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX3NuYXBXaWR0aCkgKiB0aGlzLl9fc25hcFdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kpIHtcbiAgICAgIHRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX2NsaWVudEhlaWdodCkgKiB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fc25hcEhlaWdodCkgKiB0aGlzLl9fc25hcEhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMaW1pdCBmb3IgYWxsb3dlZCByYW5nZXNcbiAgICBsZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbExlZnQsIGxlZnQpLCAwKTtcbiAgICB0b3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsVG9wLCB0b3ApLCAwKTtcblxuICAgIC8vIERvbid0IGFuaW1hdGUgd2hlbiBubyBjaGFuZ2UgZGV0ZWN0ZWQsIHN0aWxsIGNhbGwgcHVibGlzaCB0byBtYWtlIHN1cmVcbiAgICAvLyB0aGF0IHJlbmRlcmVkIHBvc2l0aW9uIGlzIHJlYWxseSBpbi1zeW5jIHdpdGggaW50ZXJuYWwgZGF0YVxuICAgIGlmIChsZWZ0ID09PSB0aGlzLl9fc2Nyb2xsTGVmdCAmJiB0b3AgPT09IHRoaXMuX19zY3JvbGxUb3ApIHtcbiAgICAgIGlzQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQdWJsaXNoIG5ldyB2YWx1ZXNcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xsIGJ5IHRoZSBnaXZlbiBvZmZzZXRcbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSB0b3Age051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgZ2l2ZW4gY2hhbmdlXG4gICAqL1xuICBzY3JvbGxCeShsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQpIHtcbiAgICB2YXIgc3RhcnRMZWZ0ID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZExlZnQgOiB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB2YXIgc3RhcnRUb3AgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkVG9wIDogdGhpcy5fX3Njcm9sbFRvcDtcblxuICAgIHRoaXMuc2Nyb2xsVG8oc3RhcnRMZWZ0ICsgKGxlZnQgfHwgMCksIHN0YXJ0VG9wICsgKHRvcCB8fCAwKSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgRVZFTlQgQ0FMTEJBQ0tTXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIE1vdXNlIHdoZWVsIGhhbmRsZXIgZm9yIHpvb21pbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Nb3VzZVpvb20od2hlZWxEZWx0YSwgdGltZVN0YW1wLCBwYWdlWCwgcGFnZVkpIHtcbiAgICB2YXIgY2hhbmdlID0gd2hlZWxEZWx0YSA+IDAgPyAwLjk3IDogMS4wMztcblxuICAgIHJldHVybiB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogY2hhbmdlLCBmYWxzZSwgcGFnZVggLSB0aGlzLl9fY2xpZW50TGVmdCwgcGFnZVkgLSB0aGlzLl9fY2xpZW50VG9wKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIHN0YXJ0IGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoU3RhcnQodG91Y2hlcywgdGltZVN0YW1wKSB7XG4gICAgLy8gQXJyYXktbGlrZSBjaGVjayBpcyBlbm91Z2ggaGVyZVxuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvdWNoIGxpc3Q6IFwiICsgdG91Y2hlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGludGVycnVwdGVkQW5pbWF0aW9uIGZsYWdcbiAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBTdG9wIGFuaW1hdGlvblxuICAgIGlmICh0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFVzZSBjZW50ZXIgcG9pbnQgd2hlbiBkZWFsaW5nIHdpdGggdHdvIGZpbmdlcnNcbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuICAgIHZhciBpc1NpbmdsZVRvdWNoID0gdG91Y2hlcy5sZW5ndGggPT09IDE7XG4gICAgaWYgKGlzU2luZ2xlVG91Y2gpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluaXRpYWwgcG9zaXRpb25zXG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19pbml0aWFsVG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBTdG9yZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICB0aGlzLl9fem9vbUxldmVsU3RhcnQgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCB0b3VjaCBwb3NpdGlvbnNcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGluaXRpYWwgbW92ZSB0aW1lIHN0YW1wXG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG5cbiAgICAvLyBSZXNldCBpbml0aWFsIHNjYWxlXG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IDE7XG5cbiAgICAvLyBSZXNldCBsb2NraW5nIGZsYWdzXG4gICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWDtcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZO1xuXG4gICAgLy8gUmVzZXQgdHJhY2tpbmcgZmxhZ1xuICAgIHRoaXMuX19pc1RyYWNraW5nID0gdHJ1ZTtcblxuICAgIC8vIFJlc2V0IGRlY2VsZXJhdGlvbiBjb21wbGV0ZSBmbGFnXG4gICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgICAvLyBEcmFnZ2luZyBzdGFydHMgZGlyZWN0bHkgd2l0aCB0d28gZmluZ2Vycywgb3RoZXJ3aXNlIGxhenkgd2l0aCBhbiBvZmZzZXRcbiAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICFpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gU29tZSBmZWF0dXJlcyBhcmUgZGlzYWJsZWQgaW4gbXVsdGkgdG91Y2ggc2NlbmFyaW9zXG4gICAgdGhpcy5fX2lzU2luZ2xlVG91Y2ggPSBpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gQ2xlYXJpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICB0aGlzLl9fcG9zaXRpb25zID0gW107XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBtb3ZlIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbMS4wXSBzY2FsZSAtIC4uLi5cbiAgICovXG4gIGRvVG91Y2hNb3ZlKHRvdWNoZXMsIHRpbWVTdGFtcCwgc2NhbGUpIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKGV2ZW50IG1pZ2h0IGJlIG91dHNpZGUgb2YgZWxlbWVudClcbiAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIENvbXB1dGUgbW92ZSBiYXNlZCBhcm91bmQgb2YgY2VudGVyIG9mIGZpbmdlcnNcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cblxuICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuXG4gICAgLy8gQXJlIHdlIGFscmVhZHkgaXMgZHJhZ2dpbmcgbW9kZT9cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIENvbXB1dGUgbW92ZSBkaXN0YW5jZVxuICAgICAgdmFyIG1vdmVYID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19sYXN0VG91Y2hMZWZ0O1xuICAgICAgdmFyIG1vdmVZID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2xhc3RUb3VjaFRvcDtcblxuICAgICAgLy8gUmVhZCBwcmV2aW91cyBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmdcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBsZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgIC8vIFdvcmsgd2l0aCBzY2FsaW5nXG4gICAgICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB2YXIgb2xkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAvLyBSZWNvbXB1dGUgbGV2ZWwgYmFzZWQgb24gcHJldmlvdXMgc2NhbGUgYW5kIG5ldyBzY2FsZVxuICAgICAgICBsZXZlbCA9IGxldmVsIC8gdGhpcy5fX2xhc3RTY2FsZSAqIHNjYWxlO1xuXG4gICAgICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgICAgIC8vIE9ubHkgZG8gZnVydGhlciBjb21wdXRpb24gd2hlbiBjaGFuZ2UgaGFwcGVuZWRcbiAgICAgICAgaWYgKG9sZExldmVsICE9PSBsZXZlbCkge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgZXZlbnQgcG9zaXRpb24gdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnRSZWwgPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2NsaWVudExlZnQ7XG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaFRvcFJlbCA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19jbGllbnRUb3A7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgICAgICAgc2Nyb2xsTGVmdCA9ICgoY3VycmVudFRvdWNoTGVmdFJlbCArIHNjcm9sbExlZnQpICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hMZWZ0UmVsO1xuICAgICAgICAgIHNjcm9sbFRvcCA9ICgoY3VycmVudFRvdWNoVG9wUmVsICsgc2Nyb2xsVG9wKSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoVG9wUmVsO1xuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIG1heCBzY3JvbGwgdmFsdWVzXG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCkge1xuICAgICAgICBzY3JvbGxMZWZ0IC09IG1vdmVYICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQgfHwgc2Nyb2xsTGVmdCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCArPSAobW92ZVggLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IG1heFNjcm9sbExlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb21wdXRlIG5ldyB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWSkge1xuICAgICAgICBzY3JvbGxUb3AgLT0gbW92ZVkgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcblxuICAgICAgICBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wIHx8IHNjcm9sbFRvcCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGxpc3QgZnJvbSBncm93aW5nIGluZmluaXRlbHkgKGhvbGRpbmcgbWluIDEwLCBtYXggMjAgbWVhc3VyZSBwb2ludHMpXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFjayBzY3JvbGwgbW92ZW1lbnQgZm9yIGRlY2xlcmF0aW9uXG4gICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIGxldmVsKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMoY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0KTtcbiAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSAmJiBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoRW5kKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgLy8gQmUgc3VyZSB0byByZXNldCB0aGUgZHJhZ2dpbmcgZmxhZyBub3cuIEhlcmUgd2UgYWxzbyBkZXRlY3Qgd2hldGhlclxuICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICBpZiAodGhpcy5fX2lzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZyAmJiAodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpIDw9IDEwMCkge1xuICAgICAgICAvLyBUaGVuIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHdhcyBhYm91dCAxMDBtcyBhZ29cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG4gICAgICAgIHZhciBlbmRQb3MgPSBwb3NpdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICAgIC8vIE1vdmUgcG9pbnRlciB0byBwb3NpdGlvbiBtZWFzdXJlZCAxMDBtcyBhZ29cbiAgICAgICAgZm9yICh2YXIgaSA9IGVuZFBvczsgaSA+IDAgJiYgcG9zaXRpb25zW2ldID4gKHRoaXMuX19sYXN0VG91Y2hNb3ZlIC0gMTAwKTsgaSAtPSAzKSB7XG4gICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gcG9zaXRpb25zW2VuZFBvc10gLSBwb3NpdGlvbnNbc3RhcnRQb3NdO1xuICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgIC8vIEJhc2VkIG9uIDUwbXMgY29tcHV0ZSB0aGUgbW92ZW1lbnQgdG8gYXBwbHkgZm9yIGVhY2ggcmVuZGVyIHN0ZXBcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIHN0YXJ0IHRoZSBkZWNlbGVyYXRpb25cbiAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPiAxMDApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAvLyBUaGlzIGlzIHBsYWNlZCBvdXRzaWRlIHRoZSBjb25kaXRpb24gYWJvdmUgdG8gaW1wcm92ZSBlZGdlIGNhc2Ugc3RhYmlsaXR5XG4gICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgIGlmICghdGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfVxuXG4gICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgdGhpcy5fX3Bvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQUklWQVRFIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgKi9cbiAgX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAvLyBiYXNlZCBvbiB0aGUgY3VycmVudCBcImRyaXZlXCIgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgIHZhciBvbGRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgdmFyIGRpZmZMZWZ0ID0gbGVmdCAtIG9sZExlZnQ7XG4gICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21MZXZlbCA9IG9sZFpvb20gKyAoZGlmZlpvb20gKiBwZXJjZW50KTtcblxuICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pc0FuaW1hdGluZyA9PT0gaWQ7XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sobGVmdCwgdG9wLCB6b29tKTtcbiAgICAgIH1cblxuICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgKi9cbiAgX19jb21wdXRlU2Nyb2xsTWF4KHpvb21MZXZlbCkge1xuICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICB0aGlzLl9fbWF4U2Nyb2xsTGVmdCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50V2lkdGggKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgIHRoaXMuX19tYXhTY3JvbGxUb3AgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudEhlaWdodCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICovXG4gIF9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX21heFNjcm9sbFRvcCksIDApO1xuICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgIC8vIFdlIGxpbWl0IGRlY2VsZXJhdGlvbiBub3QgdG8gdGhlIG1pbi9tYXggdmFsdWVzIG9mIHRoZSBhbGxvd2VkIHJhbmdlLCBidXQgdG8gdGhlIHNpemUgb2YgdGhlIHZpc2libGUgY2xpZW50IGFyZWEuXG4gICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguZmxvb3Ioc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBjbGFzcyBtZXRob2RcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgdGhpcy5fX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcik7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICB2YXIgbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgPSB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMC4xO1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmltYXRlIHRvIGdyaWQgd2hlbiBzbmFwcGluZyBpcyBhY3RpdmUsIG90aGVyd2lzZSBqdXN0IGZpeCBvdXQtb2YtYm91bmRhcnkgcG9zaXRpb25zXG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgKi9cbiAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpIHtcblxuICAgIC8vXG4gICAgLy8gQ09NUFVURSBORVhUIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYO1xuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgLy9cbiAgICAvLyBIQVJEIExJTUlUIFNDUk9MTCBQT1NJVElPTiBGT1IgTk9OIEJPVU5DSU5HIE1PREVcbiAgICAvL1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgIGlmIChzY3JvbGxMZWZ0Rml4ZWQgIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnRGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgaWYgKHNjcm9sbFRvcEZpeGVkICE9PSBzY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wRml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSAwO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFNMT1cgRE9XTlxuICAgIC8vXG5cbiAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgLy8gdG8gc2xvdyBkb3duIHRoZSBwcm9jZXNzLiBUaGlzIHNob3VsZCBlbXVsYXRlIG5hdHVyYWwgYmVoYXZpb3Igd2hlcmVcbiAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAvL1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVYID0gMDtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICB2YXIgcGVuZXRyYXRpb25EZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgaWYgKHNjcm9sbExlZnQgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9wIDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfVxuXG4gICAgICAvLyBTbG93IGRvd24gdW50aWwgc2xvdyBlbm91Z2gsIHRoZW4gZmxpcCBiYWNrIHRvIHNuYXAgcG9zaXRpb25cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICs9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKz0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50LCBDYWxsYmFjayB9IGZyb20gJy4vdHlwZXMvaW5kZXgnO1xuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmV4cG9ydCBjb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuY29uc3QgaW1nUG9vbCA9IG5ldyBQb29sKCdpbWdQb29sJyk7XG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2woJ2JpdE1hcFBvb2wnKTtcbmNvbnN0IGRlYnVnSW5mbyA9IG5ldyBEZWJ1Z0luZm8oKTtcblxuaW50ZXJmYWNlIElWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVZpZXdQb3J0Qm94IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVyRGF0YSB7XG4gIGhhc0V2ZW50QmluZDogYm9vbGVhbjtcbiAgdG91Y2hNc2c6IHtcbiAgICBba2V5OiBzdHJpbmddOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB9O1xuICBoYW5kbGVyczoge1xuICAgIHRvdWNoU3RhcnQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hNb3ZlOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoRW5kOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoQ2FuY2VsOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgSVBsdWdpbjxUPiB7XG4gIG5hbWU6IHN0cmluZztcbiAgaW5zdGFsbDogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG4gIHVuaW5zdGFsbD86IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBMYXlvdXQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOW9k+WJjSBMYXlvdXQg54mI5pys77yM5LiA6Iis6Lef5bCP5ri45oiP5o+S5Lu254mI5pys5a+56b2QXG4gICAqL1xuICBwdWJsaWMgdmVyc2lvbiA9ICcxLjAuMyc7XG4gIFxuICAvKipcbiAgICogTGF5b3V0IOa4suafk+eahOebruagh+eUu+W4g+WvueW6lOeahCAyZCBjb250ZXh0XG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZW5kZXJwb3J0OiBJVmlld1BvcnQgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnQ6IElWaWV3UG9ydEJveCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuXG4gIC8qKlxuICAgKiDnlLvluIPlsLrlr7jlkozlrp7pmYXooqvmuLLmn5PliLDlsY/luZXnmoTniannkIblsLrlr7jmr5RcbiAgICovXG4gIHB1YmxpYyB2aWV3cG9ydFNjYWxlID0gMTtcbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhnVwZGF0ZVZpZXdQb3J05pa55rOV5piv5ZCm6KKr6LCD55So6L+H5LqG77yM6L+Z5Zyo5bCP5ri45oiP546v5aKD6Z2e5bi46YeN6KaBXG4gICAqL1xuICBwdWJsaWMgaGFzVmlld1BvcnRTZXQgPSBmYWxzZTtcblxuICAvKipcbiAgICog5pyA57uI5riy5p+T5Yiw5bGP5bmV55qE5bem5LiK6KeS54mp55CG5Z2Q5qCHXG4gICAqL1xuICBwdWJsaWMgcmVhbExheW91dEJveDoge1xuICAgIHJlYWxYOiBudW1iZXI7XG4gICAgcmVhbFk6IG51bWJlcjtcbiAgfSA9IHtcbiAgICAgIHJlYWxYOiAwLFxuICAgICAgcmVhbFk6IDAsXG4gICAgfTtcblxuICBwdWJsaWMgYml0TWFwRm9udHM6IEJpdE1hcEZvbnRbXSA9IFtdO1xuICBwdWJsaWMgZWxlQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhdGU6IFNUQVRFID0gU1RBVEUuVU5JTklUO1xuXG4gIC8qKlxuICAgKiDnlKjkuo7lnKggdGlja2VyIOeahOW+queOr+mHjOmdouagh+ivhuW9k+WJjeW4p+aYr+WQpumcgOimgemHjee7mFxuICAgKiDph43nu5jkuIDoiKzmmK/lm77niYfliqDovb3lrozmiJDjgIHmloflrZfkv67mlLnnrYnlnLrmma9cbiAgICovXG4gIHB1YmxpYyBpc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gIHB1YmxpYyB0aWNrZXI6IFRpY2tlciA9IG5ldyBUaWNrZXIoKTtcbiAgcHVibGljIHRpY2tlckZ1bmMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuaXNEaXJ0eSkge1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNOZWVkUmVwYWludCkge1xuICAgICAgdGhpcy5yZXBhaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyRGF0YTogRXZlbnRIYW5kbGVyRGF0YTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUsXG4gIH06IHtcbiAgICBzdHlsZT86IElTdHlsZTtcbiAgICBuYW1lPzogc3RyaW5nO1xuICB9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgICBpZDogMCxcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YSA9IHtcbiAgICAgIGhhc0V2ZW50QmluZDogZmFsc2UsXG4gICAgICB0b3VjaE1zZzoge30sXG4gICAgICBoYW5kbGVyczoge1xuICAgICAgICB0b3VjaFN0YXJ0OiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hzdGFydCcpLFxuICAgICAgICB0b3VjaE1vdmU6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaG1vdmUnKSxcbiAgICAgICAgdG91Y2hFbmQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGVuZCcpLFxuICAgICAgICB0b3VjaENhbmNlbDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoY2FuY2VsJyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDlr7nkuo7kuI3kvJrlvbHlk43luIPlsYDnmoTmlLnliqjvvIzmr5TlpoLlm77niYflj6rmmK/mlLnkuKrlnLDlnYDjgIHliqDkuKrog4zmma/oibLkuYvnsbvnmoTmlLnliqjvvIzkvJrop6blj5EgTGF5b3V0IOeahCByZXBhaW50IOaTjeS9nFxuICAgICAqIOinpuWPkeeahOaWueW8j+aYr+e7mSBMYXlvdXQg5oqb5LiqIGByZXBhaW50YCDnmoTkuovku7bvvIzkuLrkuobmgKfog73vvIzmr4/mrKHmjqXmlLbliLAgcmVwYWludCDor7fmsYLkuI3kvJrmiafooYznnJ/mraPnmoTmuLLmn5NcbiAgICAgKiDogIzmmK/miafooYzkuIDkuKrnva7ohI/mk43kvZzvvIx0aWNrZXIg5q+P5LiA5qyh5omn6KGMIHVwZGF0ZSDkvJrmo4Dmn6Xov5nkuKrmoIforrDkvY3vvIzov5vogIzmiafooYznnJ/mraPnmoTph43nu5jmk43kvZxcbiAgICAgKi9cbiAgICB0aGlzLm9uKCdyZXBhaW50JywgKCkgPT4ge1xuICAgICAgdGhpcy5pc05lZWRSZXBhaW50ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOWwhiBUd2VlbiDmjILovb3liLAgTGF5b3V077yM5a+55LqOIFR3ZWVuIOeahOS9v+eUqOWujOWFqOmBteW+qiBUd2Vlbi5qcyDnmoTmlofmoaNcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qcy9cbiAgICAgKiDlj6rkuI3ov4flvZMgVHdlZW4g5pS55Yqo5LqG6IqC54K55Lya6Kem5Y+RIHJlcGFpbnTjgIFyZWZsb3cg55qE5bGe5oCn5pe277yMTGF5b3V0IOS8muaJp+ihjOebuOW6lOeahOaTjeS9nFxuICAgICAqIOS4muWKoeS+p+S4jeeUqOaEn+efpeWIsCByZXBhaW50IOWSjCByZWZsb3dcbiAgICAgKi9cbiAgICAvLyB0aGlzLlRXRUVOID0gVFdFRU47XG4gICAgY29uc29sZS5sb2coYFtMYXlvdXRdIHYke3RoaXMudmVyc2lvbn1gKTtcbiAgfVxuXG4gIC8vIOS4juiAgeeJiOacrOWFvOWuuVxuICBnZXQgZGVidWdJbmZvKCkge1xuICAgIGxldCBpbmZvID0gZGVidWdJbmZvLmxvZygpO1xuXG4gICAgaW5mbyArPSBgZWxlbWVudENvdW50OiAke3RoaXMuZWxlQ291bnR9XFxuYDtcblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIOabtOaWsOiiq+e7mOWItmNhbnZhc+eahOeql+WPo+S/oeaBr++8jOacrOa4suafk+W8leaTjuW5tuS4jeWFs+W/g+aYr+WQpuS8muWSjOWFtuS7lua4uOaIj+W8leaTjuWFseWQjOS9v+eUqFxuICAgKiDogIzmnKzouqvlj4jpnIDopoHmlK/mjIHkuovku7blpITnkIbvvIzlm6DmraTvvIzlpoLmnpzooqvmuLLmn5PlhoXlrrnmmK/nu5jliLbliLDnprvlsY9jYW52YXPvvIzpnIDopoHlsIbmnIDnu4jnu5jliLblnKjlsY/luZXkuIpcbiAgICog55qE57ud5a+55bC65a+45ZKM5L2N572u5L+h5oGv5pu05paw5Yiw5pys5riy5p+T5byV5pOO44CCXG4gICAqIOWFtuS4re+8jHdpZHRo5Li654mp55CG5YOP57Sg5a695bqm77yMaGVpZ2h05Li654mp55CG5YOP57Sg6auY5bqm77yMeOS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oHjlnZDmoIfvvIx55Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgXG4gICAqIHnlnZDmoIdcbiAgICovXG4gIHVwZGF0ZVZpZXdQb3J0KGJveDogSVZpZXdQb3J0Qm94KSB7XG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IGJveC53aWR0aCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQuaGVpZ2h0ID0gYm94LmhlaWdodCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueCA9IGJveC54IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC55ID0gYm94LnkgfHwgMDtcblxuICAgIHRoaXMucmVhbExheW91dEJveCA9IHtcbiAgICAgIHJlYWxYOiB0aGlzLnZpZXdwb3J0LngsXG4gICAgICByZWFsWTogdGhpcy52aWV3cG9ydC55LFxuICAgIH07XG5cbiAgICB0aGlzLmhhc1ZpZXdQb3J0U2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXQodGVtcGxhdGU6IHN0cmluZywgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIGF0dHJWYWx1ZVByb2Nlc3NvcjogQ2FsbGJhY2spIHtcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXQnKTtcbiAgICBjb25zdCBwYXJzZUNvbmZpZyA9IHtcbiAgICAgIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICcnLFxuICAgICAgYXR0ck5vZGVOYW1lOiAnYXR0cicsIC8vIGRlZmF1bHQgaXMgJ2ZhbHNlJ1xuICAgICAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICBpZ25vcmVOYW1lU3BhY2U6IHRydWUsXG4gICAgICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgcGFyc2VOb2RlVmFsdWU6IGZhbHNlLFxuICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gICAgICB0cmltVmFsdWVzOiB0cnVlLFxuICAgICAgcGFyc2VUcnVlTnVtYmVyT25seTogZmFsc2UsXG4gICAgICBhbHdheXNDcmVhdGVUZXh0Tm9kZTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgaWYgKGF0dHJWYWx1ZVByb2Nlc3NvciAmJiB0eXBlb2YgYXR0clZhbHVlUHJvY2Vzc29yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwYXJzZUNvbmZpZy5hdHRyVmFsdWVQcm9jZXNzb3IgPSBhdHRyVmFsdWVQcm9jZXNzb3I7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0X3htbFBhcnNlJyk7XG4gICAgLy8g5bCGeG1s5a2X56ym5Liy6Kej5p6Q5oiQeG1s6IqC54K55qCRXG4gICAgY29uc3QganNvbk9iaiA9IHBhcnNlci5wYXJzZSh0ZW1wbGF0ZSwgcGFyc2VDb25maWcsIHRydWUpO1xuICAgIC8vIGNvbnNvbGUubG9nKGpzb25PYmopXG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdF94bWxQYXJzZScpO1xuXG4gICAgY29uc3QgeG1sVHJlZSA9IGpzb25PYmouY2hpbGRyZW5bMF07XG5cbiAgICAvLyBYTUzmoJHnlJ/miJDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sMkxheW91dCcpO1xuICAgIGNvbnN0IGxheW91dFRyZWUgPSBjcmVhdGUuY2FsbCh0aGlzLCB4bWxUcmVlLCBzdHlsZSk7XG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdF94bWwyTGF5b3V0Jyk7XG5cbiAgICB0aGlzLmFkZChsYXlvdXRUcmVlKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5JTklURUQ7XG5cbiAgICB0aGlzLnRpY2tlci5hZGQodGhpcy50aWNrZXJGdW5jLCB0cnVlKTtcbiAgICB0aGlzLnRpY2tlci5zdGFydCgpO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdCcpO1xuICB9XG5cbiAgcmVmbG93KGlzRmlyc3QgPSBmYWxzZSkge1xuICAgIGlmICghaXNGaXJzdCkge1xuICAgICAgZGVidWdJbmZvLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfcmVmbG93Jyk7XG4gICAgLyoqXG4gICAgICog6K6h566X5biD5bGA5qCRXG4gICAgICog57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga9cbiAgICAgKiBMYXlvdXTmnKzouqvlubbkuI3kvZzkuLrluIPlsYDorqHnrpfvvIzlj6rmmK/kvZzkuLroioLngrnmoJHnmoTlrrnlmahcbiAgICAgKi9cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2NvbXB1dGVMYXlvdXQnLCB0cnVlKTtcbiAgICBjb21wdXRlTGF5b3V0KHRoaXMuY2hpbGRyZW5bMF0pO1xuICAgIGRlYnVnSW5mby5lbmQoJ2NvbXB1dGVMYXlvdXQnKTtcblxuICAgIGNvbnN0IHJvb3RFbGUgPSB0aGlzLmNoaWxkcmVuWzBdO1xuXG4gICAgaWYgKHJvb3RFbGUuc3R5bGUud2lkdGggPT09IHVuZGVmaW5lZCB8fCByb290RWxlLnN0eWxlLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2Ugc2V0IHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydHkgZm9yIHJvb3QgZWxlbWVudCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQud2lkdGggPSByb290RWxlLnN0eWxlLndpZHRoO1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LmhlaWdodCA9IHJvb3RFbGUuc3R5bGUuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIOWwhuW4g+WxgOagkeeahOW4g+WxgOS/oeaBr+WKoOW3pei1i+WAvOWIsOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICBsYXlvdXRDaGlsZHJlbih0aGlzKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRDaGlsZHJlbicpO1xuXG4gICAgdGhpcy52aWV3cG9ydFNjYWxlID0gdGhpcy52aWV3cG9ydC53aWR0aCAvIHRoaXMucmVuZGVycG9ydC53aWR0aDtcblxuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgLy8g6YGN5Y6G6IqC54K55qCR77yM5L6d5qyh6LCD55So6IqC54K555qE5riy5p+T5o6l5Y+j5a6e546w5riy5p+TXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZW5kZXJDaGlsZHJlbicsIHRydWUpO1xuICAgIHJlbmRlckNoaWxkcmVuKHRoaXMuY2hpbGRyZW4sIHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZhbHNlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZW5kZXJDaGlsZHJlbicpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZXBhaW50JywgdHJ1ZSk7XG4gICAgdGhpcy5yZXBhaW50KCk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVwYWludCcpO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuXG4gICAgLy8gaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgKGVsZSkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coZWxlLnByb3BzKTtcbiAgICAvLyB9KTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9yZWZsb3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml06Zi25q615qC45b+D5LuF5LuF5piv5qC55o2ueG1s5ZKMY3Nz5Yib5bu65LqG6IqC54K55qCRXG4gICAqIOimgeWunueOsOecn+ato+eahOa4suafk++8jOmcgOimgeiwg+eUqCBsYXlvdXQg5Ye95pWw77yM5LmL5omA5Lul5bCGIGxheW91dCDljZXni6zmir3osaHkuLrkuIDkuKrlh73mlbDvvIzmmK/lm6DkuLogbGF5b3V0IOW6lOW9k+aYr+WPr+S7pemHjeWkjeiwg+eUqOeahFxuICAgKiDmr5TlpoLmlLnlj5jkuobkuIDkuKrlhYPntKDnmoTlsLrlr7jvvIzlrp7pmYXkuIroioLngrnmoJHmmK/msqHlj5jnmoTvvIzku4Xku4XmmK/pnIDopoHph43mlrDorqHnrpfluIPlsYDvvIznhLblkI7muLLmn5NcbiAgICog5LiA5Liq5a6M5pW055qEIGxheW91dCDliIbmiJDkuIvpnaLnmoTlh6DmraXvvJpcbiAgICogMS4g5omn6KGM55S75biD5riF55CG77yM5Zug5Li65biD5bGA5Y+Y5YyW6aG16Z2i6ZyA6KaB6YeN57uY77yM6L+Z6YeM5rKh5pyJ5YGa5b6I6auY57qn55qE5YmU6Zmk562J5pON5L2c77yM5LiA5b6L5riF6Zmk6YeN55S777yM5a6e6ZmF5LiK5oCn6IO95bey57uP5b6I5aW9XG4gICAqIDIuIOiKgueCueagkemDveWQq+aciSBzdHlsZSDlsZ7mgKfvvIxjc3MtbGF5b3V0IOiDveWkn+agueaNrui/meS6m+S/oeaBr+iuoeeul+WHuuacgOe7iOW4g+WxgO+8jOivpuaDheWPr+ingSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9jc3MtbGF5b3V0XG4gICAqIDMuIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGv77yM5L2G6L+Z5Lqb5L+h5oGv5bm25LiN5piv6IO95aSf55u05o6l55So55qEXG4gICAqICAgIOavlOWmgiBsYXlvdXQudG9wIOaYr+aMh+WcqOS4gOS4queItuWuueWZqOWGheeahCB0b3DvvIzmnIDnu4jopoHlrp7njrDmuLLmn5PvvIzlrp7pmYXkuIropoHpgJLlvZLliqDkuIrlpI3lrrnlmajnmoQgdG9wXG4gICAqICAgIOi/meagt+avj+asoSByZXBhaW50IOeahOaXtuWAmeWPqumcgOimgeebtOaOpeS9v+eUqOiuoeeul+WlveeahOWAvOWNs+WPr++8jOS4jemcgOimgeavj+asoemDvemAkuW9kuiuoeeul1xuICAgKiAgICDov5nkuIDmraXnp7DkuLogbGF5b3V0Q2hpbGRyZW7vvIznm67nmoTlnKjkuo7lsIYgY3NzLWxheW91dCDov5vkuIDmraXlpITnkIbkuLrlj6/ku6XmuLLmn5Pnm7TmjqXnlKjnmoTluIPlsYDkv6Hmga9cbiAgICogNC4gcmVuZGVyQ2hpbGRyZW7vvJrmiafooYzmuLLmn5NcbiAgICogNS4gYmluZEV2ZW50c++8muaJp+ihjOS6i+S7tue7keWumlxuICAgKi9cbiAgLy8gQHRzLWlnbm9yZVxuICBsYXlvdXQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0ID0gY29udGV4dDtcblxuICAgIGlmICghdGhpcy5oYXNWaWV3UG9ydFNldCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIGludm9rZSBtZXRob2QgYHVwZGF0ZVZpZXdQb3J0YCBiZWZvcmUgbWV0aG9kIGBsYXlvdXRgJyk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXQnKTtcblxuICAgIHRoaXMucmVmbG93KHRydWUpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb3RoZXInKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50JywgdHJ1ZSk7XG4gICAgaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgZWxlbWVudCA9PiBlbGVtZW50Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCkpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlJFTkRFUkVEO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Jyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X290aGVyJyk7XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM6IqC54K55pWw55qE6YeN57uY5Yi277yM5LiA6Iis5Lia5Yqh5L6n5peg6ZyA6LCD55So6K+l5pa55rOVXG4gICAqL1xuICByZXBhaW50KCkge1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgdGhpcy5pc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gICAgcmVwYWludENoaWxkcmVuKHRoaXMuY2hpbGRyZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOi/lOWbnuS4gOS4quiKgueCueWcqOWxj+W5leS4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr++8jOWJjeaPkOaYr+ato+ehruiwg+eUqHVwZGF0ZVZpZXdQb3J044CCXG4gICAqL1xuICBnZXRFbGVtZW50Vmlld3BvcnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7IHJlYWxMYXlvdXRCb3gsIHZpZXdwb3J0U2NhbGUgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgYWJzb2x1dGVYLFxuICAgICAgYWJzb2x1dGVZLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfSA9IGVsZW1lbnQubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWDtcbiAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdmlld3BvcnRTY2FsZTtcbiAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdmlld3BvcnRTY2FsZTtcblxuICAgIHJldHVybiBuZXcgUmVjdChcbiAgICAgIHJlYWxYLFxuICAgICAgcmVhbFksXG4gICAgICByZWFsV2lkdGgsXG4gICAgICByZWFsSGVpZ2h0LFxuICAgICk7XG4gIH1cblxuICBnZXRDaGlsZEJ5UG9zKHRyZWU6IExheW91dCB8IEVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpdGVtTGlzdDogKExheW91dCB8IEVsZW1lbnQpW10pIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBhYnNvbHV0ZVgsXG4gICAgICAgIGFic29sdXRlWSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgIH0gPSBlbGUubGF5b3V0Qm94O1xuICAgICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWTtcbiAgICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdGhpcy52aWV3cG9ydFNjYWxlO1xuICAgICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHRoaXMudmlld3BvcnRTY2FsZTtcblxuICAgICAgaWYgKChyZWFsWCA8PSB4ICYmIHggPD0gcmVhbFggKyByZWFsV2lkdGgpICYmIChyZWFsWSA8PSB5ICYmIHkgPD0gcmVhbFkgKyByZWFsSGVpZ2h0KSkge1xuICAgICAgICAvKipcbiAgICAgICAgICog55u45YWzaXNzdWXvvJpodHRwczovL2dpdGh1Yi5jb20vd2VjaGF0LW1pbmlwcm9ncmFtL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvaXNzdWVzLzE3XG4gICAgICAgICAqIOi/memHjOWPquimgea7oei2s+adoeS7tueahOmDveimgeiusOW9le+8jOWQpuWImeWPr+iDveWHuueOsCBpc3N1ZSDph4zpnaLmj5DliLDnmoTpl67pophcbiAgICAgICAgICovXG4gICAgICAgIGl0ZW1MaXN0LnB1c2goZWxlKTtcbiAgICAgICAgaWYgKGVsZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmdldENoaWxkQnlQb3MoZWxlLCB4LCB5LCBpdGVtTGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV2ZW50SGFuZGxlciA9IChldmVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBsZXQgdG91Y2g6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG5cbiAgICAgIGlmIChpc0dhbWVUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgIHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG91Y2ggPSBlO1xuICAgICAgfVxuICAgICAgLy8gY29uc3QgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkgfHwgZTtcbiAgICAgIGlmICghdG91Y2ggfHwgIXRvdWNoLnBhZ2VYIHx8ICF0b3VjaC5wYWdlWSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gudGltZVN0YW1wKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdG91Y2gudGltZVN0YW1wID0gZS50aW1lU3RhbXA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdID0gW107XG4gICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKHRoaXMsIHRvdWNoLnBhZ2VYLCB0b3VjaC5wYWdlWSwgbGlzdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoZXZlbnROYW1lLCBlKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2dbZXZlbnROYW1lXSA9IHRvdWNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnICYmIGlzQ2xpY2sodGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnKSkge1xuICAgICAgICBpdGVtICYmIGl0ZW0uZW1pdCgnY2xpY2snLCBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOWFqOWxgOeahOS6i+S7tue7keWumumAu+i+kSBcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vblRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgICAgX19lbnYub25Ub3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgICBfX2Vudi5vblRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vblRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2Vkb3duID0gdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQ7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmU7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQ7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbGVhdmUgPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWFqOWxgOS6i+S7tuino+e7kSBcbiAgICovXG4gIHVuQmluZEV2ZW50cygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgX19lbnYub2ZmVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgICBfX2Vudi5vZmZUb3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgICBfX2Vudi5vZmZUb3VjaEVuZCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQpO1xuICAgICAgX19lbnYub2ZmVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQub25tb3VzZWRvd24gPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZXVwID0gbnVsbDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2VsZWF2ZSA9IG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBFRS5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3lBbGwodHJlZTogTGF5b3V0IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgIH0gPSB0cmVlO1xuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZGVzdHJveUFsbChjaGlsZCk7XG4gICAgICBjaGlsZC5kZXN0cm95U2VsZiAmJiBjaGlsZC5kZXN0cm95U2VsZigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4heeQhueUu+W4g++8jOS5i+WJjeeahOiuoeeul+WHuuadpeeahOa4suafk+agkeS5n+S8muS4gOW5tua4heeQhu+8jOatpOaXtuWPr+S7peWGjeasoeaJp+ihjGluaXTlkoxsYXlvdXTmlrnms5XmuLLmn5PnlYzpnaLjgIJcbiAgICovXG4gIGNsZWFyKG9wdGlvbnM6IHsgcmVtb3ZlVGlja2VyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB7IHJlbW92ZVRpY2tlciA9IHRydWUgfSA9IG9wdGlvbnM7XG5cbiAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB0aGlzLmRlc3Ryb3lBbGwodGhpcyk7XG4gICAgLy8gdGhpcy5lbGVtZW50VHJlZSA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5DTEVBUjtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB0aGlzLmVsZUNvdW50ID0gMDtcbiAgICB0aGlzLnVuQmluZEV2ZW50cygpO1xuXG4gICAgaWYgKHJlbW92ZVRpY2tlcikge1xuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlKCk7XG4gICAgICB0aGlzLnRpY2tlci5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJQb29sKCkge1xuICAgIGltZ1Bvb2wuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr5TotbcgTGF5b3V0LmNsZWFyIOabtOW9u+W6leeahOa4heeQhu+8jOS8mua4heepuuWbvueJh+WvueixoeaxoO+8jOWHj+WwkeWGheWtmOWNoOeUqOOAglxuICAgKi9cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlr7nkuo7lm77niYfotYTmupDvvIzlpoLmnpzkuI3mj5DliY3liqDovb3vvIzmuLLmn5Pov4fnqIvkuK3lj6/og73lh7rnjrDmjKjkuKrlh7rnjrDlm77niYfmlYjmnpzvvIzlvbHlk43kvZPpqoxcbiAgICog6YCa6L+HTGF5b3V0LmxvYWRJbWdz5Y+v5Lul6aKE5Yqg6L295Zu+54mH6LWE5rqQ77yM5Zyo6LCD55SoTGF5b3V0LmxheW91dOeahOaXtuWAmea4suafk+aAp+iDveabtOWlve+8jOS9k+mqjOabtOS9s+OAglxuICAgKi9cbiAgbG9hZEltZ3MoYXJyOiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDms6jlhowgYml0bWFwdGV4dCDlj6/nlKjnmoTlrZfkvZPjgIIgXG4gICAqL1xuICByZWdpc3RCaXRNYXBGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgaWYgKCFiaXRNYXBQb29sLmdldChuYW1lKSkge1xuICAgICAgY29uc3QgZm9udCA9IG5ldyBCaXRNYXBGb250KG5hbWUsIHNyYywgY29uZmlnKTtcbiAgICAgIHRoaXMuYml0TWFwRm9udHMucHVzaChmb250KTtcbiAgICAgIGJpdE1hcFBvb2wuc2V0KG5hbWUsIGZvbnQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWFi+mahuiKgueCue+8jOWFi+mahuWQjueahOiKgueCueWPr+S7pea3u+WKoOWIsCBMYXlvdXQg55qE5p+Q5Liq6IqC54K55LitXG4gICAqIOivpeaWueazleWPr+S7peWcqOaVsOaNruacieWPmOWMlueahOaXtuWAmemBv+WFjemHjeaWsOaJp+ihjCBMYXlvdXQuaW5pdCDmtYHnqIvjgIJcbiAgICovXG4gIGNsb25lTm9kZShlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSkge1xuICAgIHJldHVybiBjbG9uZTxMYXlvdXQ+KHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhue7hOS7tuaMguWIsExheW91dFxuICAgKi9cbiAgRWxlbWVudCA9IEVsZW1lbnQ7XG4gIFZpZXcgPSBWaWV3O1xuICBUZXh0ID0gVGV4dDtcbiAgSW1hZ2UgPSBJbWFnZTtcbiAgU2Nyb2xsVmlldyA9IFNjcm9sbFZpZXc7XG4gIEJpdE1hcFRleHQgPSBCaXRNYXBUZXh0O1xuICBDYW52YXMgPSBDYW52YXM7XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQgPSByZWdpc3RlckNvbXBvbmVudDtcblxuICBwcml2YXRlIHN0YXRpYyBpbnN0YWxsZWRQbHVnaW5zOiBJUGx1Z2luPExheW91dD5bXSA9IFtdO1xuICAvKipcbiAgICog5a6J6KOF57uZ5a6a55qE5o+S5Lu2IFxuICAgKi9cbiAgdXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGlmIChMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIOivpeaPkuS7tuW3suWuieijhS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWuieijhWApXG4gIH1cblxuICAvKipcbiAgICog5Y246L2957uZ5a6a5o+S5Lu2IFxuICAgKi9cbiAgdW5Vc2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgY29uc3QgcGx1Z2luSW5kZXggPSBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmRleE9mKHBsdWdpbik7XG5cbiAgICBpZiAocGx1Z2luSW5kZXggPT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RoaXMgcGx1Z2luIGlzIG5vdCBpbnN0YWxsZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Lljbjovb1gKVxuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnNwbGljZShwbHVnaW5JbmRleCwgMSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExheW91dCh7XG4gIHN0eWxlOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9LFxuICBuYW1lOiAnbGF5b3V0Jyxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
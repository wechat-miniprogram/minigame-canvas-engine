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
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button(_a) {
        var _this = this;
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var defaultStyle = {
            width: 300,
            height: 60,
        };
        _this = _super.call(this, {
            idName: idName,
            className: className,
            style: __assign(__assign({}, defaultStyle), { borderRadius: 10, backgroundColor: '#34a123', justifyContent: 'center', alignItems: 'center' }),
            dataset: dataset,
        }) || this;
        _this.interactableInner = true;
        _this.transitionInner = Transition.COLOR;
        _this.label = new _text__WEBPACK_IMPORTED_MODULE_0__["default"]({
            style: {
                color: '#ffffff',
                fontSize: 30,
                textAlign: 'center',
            },
            value: value || 'button',
        });
        _this.appendChild(_this.label);
        console.log(_this);
        return _this;
    }
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
    Button.Transition = Transition;
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
            // if (style.transform.indexOf('rotate') > -1) {
            //   const deg = rotateParser(style.transform);
            //   if (deg) {
            //     this.renderForLayout.rotate = deg;
            //   }
            // }
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
                            // Object.assign(ele.renderForLayout, parseTransform(val));
                            // console.log(ele.renderForLayout)
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
    Element.prototype.baseRender = function () {
        var ctx = this.ctx;
        var style = this.style;
        var box = this.layoutBox;
        var drawX = box.absoluteX, drawY = box.absoluteY, width = box.width, height = box.height;
        if (style.opacity !== 1) {
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
        var _a = this.baseRender(), needStroke = _a.needStroke, originX = _a.originX, originY = _a.originY, drawX = _a.drawX, drawY = _a.drawY, width = _a.width, height = _a.height;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi5cXGRlbW9zXFxub2VuZ2luZVxcc3ViXFxlbmdpbmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUEwQztBQUNoRDtBQUNBLElBQUksaUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLGtHQUFDO0FBQ3ZCLElBQUksS0FBSyxFQVFOO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGFBQWE7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsYUFBYTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7O0FBRUE7QUFDQTtBQUNBLDhCQUE4QixpQkFBaUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUEyQjtBQUMvQjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDN3JDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBOztBQUVBLFlBQVksU0FBUztBQUNyQjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLGtDQUFrQztBQUNsQztBQUNBOztBQUVBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEVnQjtBQUMxQyxJQUFNLE9BQU8sR0FBRyxtQkFBTyxDQUFDLDBEQUFjLENBQUMsQ0FBQztBQXVCeEM7O0dBRUc7QUFDSDtJQVlFLDBCQUEwQjtJQUMxQixvQkFBWSxJQUFZLEVBQUUsR0FBVyxFQUFFLE1BQWM7UUFBckQsaUJBWUM7UUFuQk0sVUFBSyxHQUFHLEtBQUssQ0FBQztRQVFuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxPQUFPLEdBQUcscURBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQUMsT0FBTyxFQUFFLFNBQVM7WUFDNUQsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDeEI7WUFDRCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdDQUFXLEdBQVgsVUFBWSxPQUFlO1FBQ3pCLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFNLEtBQUssR0FBYSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQU0sV0FBVyxHQUFlLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBSSxJQUFJLFdBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUUxRSxJQUFNLFNBQVMsR0FBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRixJQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqRixJQUFNLFVBQVUsR0FBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTlFLElBQU0sUUFBUSxHQUFtQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEUsY0FBYztRQUNkLElBQU0sWUFBWSxHQUFtQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDckIsYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pFLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN4QztRQUVELElBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFNLFFBQVEsR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFekYsSUFBTSxDQUFDLEdBQWE7Z0JBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQztnQkFDOUMsQ0FBQyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2dCQUM5QyxDQUFDLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7Z0JBQ2xELENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztnQkFDbkQsSUFBSSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUN2RCxJQUFJLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztnQkFDNUQsT0FBTyxFQUFFLEVBQUU7YUFDWixDQUFDO1lBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUVELGlCQUFpQjtRQUNqQixJQUFJLGFBQWEsRUFBRTtZQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkUsSUFBTSxJQUFJLEdBQWEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFNLEtBQUssR0FBVyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLElBQU0sTUFBTSxHQUFXLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRXBFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztpQkFDdkM7YUFDRjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsd0NBQW1CLEdBQW5CLFVBQW9CLFdBQXVCLEVBQUUsUUFBYTtRQUFiLHdDQUFhO1FBQ3hELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QixJQUFNLElBQUksR0FBYSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUN4QixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLElBQUksR0FBRyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBRUQsT0FBTztZQUNMLElBQUk7WUFDSixLQUFLO1NBQ04sQ0FBQztJQUNKLENBQUM7SUFFRCw0Q0FBdUIsR0FBdkIsVUFBd0IsVUFBNkIsRUFBRSxHQUFXO1FBQ2hFLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFGLEtBQVMsS0FBQyxHQUFHLENBQUMsRUFBSSxRQUFNLEdBQUssa0JBQWtCLE9BQXZCLEVBQXlCLENBQUMsR0FBRyxRQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEUsSUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxHQUFHLEtBQUssY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuRCxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Y7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUlEO0lBS0U7UUFKTyxTQUFJLEdBQXFDLEVBQUUsQ0FBQztRQUM1QyxlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFHM0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELHlCQUFLLEdBQUwsVUFBTSxJQUFZLEVBQUUsT0FBd0I7UUFBeEIseUNBQXdCO1FBQzFDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO1lBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2pCLE9BQU87U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBSSxJQUFZO1FBQ2QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQseUJBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBSSxTQUEwQjtRQUE5QixpQkFhQztRQWJHLDZDQUEwQjtRQUM1QixJQUFJLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztRQUN0QyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7WUFDakQsSUFBSSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDekMsT0FBTyxHQUFHLENBQUM7YUFDWjtZQUNELEdBQUcsSUFBSSxVQUFHLElBQUksZUFBSyxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksT0FBSSxDQUFDO1lBQzVDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsT0FBTyxJQUFJLHFCQUFjLElBQUksQ0FBQyxTQUFTLE9BQUksQ0FBQztRQUU1QyxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZEeUI7QUFDSTtBQUNMO0FBVXpCO0lBQUE7UUFDVSxZQUFPLEdBQUcsSUFBSSw2Q0FBSSxDQUFhLFNBQVMsQ0FBQyxDQUFDO0lBNERwRCxDQUFDO0lBMURDLDZCQUFNLEdBQU4sVUFBTyxHQUFXO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELHVDQUFnQixHQUFoQixVQUFpQixHQUFXO1FBQTVCLGlCQUlDO1FBSEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ2pDLEtBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxnQ0FBUyxHQUFULFVBQVUsR0FBVyxFQUFFLE9BQXdCLEVBQUUsSUFBcUI7UUFBL0MsMkVBQXdCO1FBQUUscUVBQXFCO1FBQ3BFLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUixPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxHQUFxQixDQUFDO1FBQzFCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFL0Isd0JBQXdCO1FBQ3hCLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDM0IsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFDaEIsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNwQjthQUFNLElBQUksS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNuQywrQkFBK0I7WUFDL0IsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7WUFFaEIsS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDL0IsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNMLG9CQUFvQjtZQUNwQixHQUFHLEdBQUcsNENBQUcsQ0FBQyxXQUFXLEVBQXNCLENBQUM7WUFDNUMsSUFBTSxVQUFRLEdBQUc7Z0JBQ2YsR0FBRztnQkFDSCxRQUFRLEVBQUUsS0FBSztnQkFDZixVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNwQjtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFRLENBQUMsQ0FBQztZQUVoQyxHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNYLFVBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixVQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFFLElBQUksU0FBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztnQkFDbEQsVUFBUSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLFVBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQztZQUVGLEdBQUcsQ0FBQyxPQUFPLEdBQUc7Z0JBQ1osVUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBRSxJQUFJLFNBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7Z0JBQ25ELFVBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixVQUFRLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUM7WUFFRixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUNmO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDO0FBRUQsaUVBQWUsSUFBSSxZQUFZLEVBQUUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzNFbEMsSUFBTSxLQUFLLEdBQWdCLEVBQUUsQ0FBQztBQUU5QjtJQUlFLGNBQVksSUFBYTtRQUFiLG9DQUFhO1FBSGxCLFNBQUksR0FBRyxNQUFNO1FBQ2IsU0FBSSxHQUF5QixFQUFFLENBQUM7UUFHckMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFJLElBQUksV0FBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUVwRCxJQUFJLElBQUksRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVmLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELGtCQUFHLEdBQUgsVUFBSSxHQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxrQkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVE7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELG9CQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsc0JBQU8sR0FBUDtRQUNFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDRDtJQVFFLGNBQVksSUFBUSxFQUFFLEdBQU8sRUFBRSxLQUFTLEVBQUUsTUFBVTtRQUF4QywrQkFBUTtRQUFFLDZCQUFPO1FBQUUsaUNBQVM7UUFBRSxtQ0FBVTtRQVA3QyxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDVCxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsUUFBRyxHQUFHLENBQUMsQ0FBQztRQUNSLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsa0JBQUcsR0FBSCxVQUFJLElBQVEsRUFBRSxHQUFPLEVBQUUsS0FBUyxFQUFFLE1BQVU7UUFBeEMsK0JBQVE7UUFBRSw2QkFBTztRQUFFLGlDQUFTO1FBQUUsbUNBQVU7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQVUsR0FBVixVQUFXLElBQVU7UUFDbkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakgsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVCRDtJQUFBO1FBQUEsaUJBc0dDO1FBckdTLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixnQkFBVyxHQUFrQixJQUFJLENBQUM7UUFFbEMsUUFBRyxHQUFlLEVBQUUsQ0FBQztRQUNyQixhQUFRLEdBQWUsRUFBRSxDQUFDO1FBQzFCLFlBQU8sR0FBZSxFQUFFLENBQUM7UUFDekIsaUJBQVksR0FBZSxFQUFFLENBQUM7UUFJOUIsV0FBTSxHQUFHO1lBQ2YsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLElBQU0sU0FBUyxHQUFHLElBQUksR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDO1lBQ3ZDLEtBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLGtCQUFrQjtZQUNsQixpQ0FBaUM7WUFDakMsS0FBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFZO2dCQUM1QixFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEIsQ0FBQyxDQUFDLENBQUM7WUFFSCxLQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEVBQVk7Z0JBQ2pDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztZQUVILElBQUksS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFlBQUUsSUFBSSxTQUFFLENBQUMsU0FBUyxDQUFDLEVBQWIsQ0FBYSxDQUFDLENBQUM7Z0JBQy9DLEtBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO2FBQ3hCO1lBRUQsSUFBSSxLQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBRSxJQUFJLFNBQUUsQ0FBQyxTQUFTLENBQUMsRUFBYixDQUFhLENBQUMsQ0FBQztnQkFFMUMsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7YUFDbkI7WUFFRCxLQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNoQixLQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxDQUFDO0lBK0RILENBQUM7SUE3REMsNkJBQVksR0FBWjtRQUNFLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDN0Isb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELG9CQUFHLEdBQUgsVUFBSSxFQUFZLEVBQUUsT0FBZTtRQUFmLHlDQUFlO1FBQy9CLElBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzNELE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3REO0lBQ0gsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxFQUFZLEVBQUUsT0FBZTtRQUFmLHlDQUFlO1FBQ2hDLElBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQzlEO0lBQ0gsQ0FBQztJQUVELDRCQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsdUJBQU0sR0FBTixVQUFPLEVBQWEsRUFBRSxPQUFlO1FBQWYseUNBQWU7UUFDbkMsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDN0YsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdEM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUM3QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsc0JBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1lBRXBCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTNCLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUMxRSxJQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN2RDtTQUNGO0lBQ0gsQ0FBQztJQUVELHFCQUFJLEdBQUo7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFFckIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3hHRCwwQkFBMEI7QUFDbkIsU0FBUyxJQUFJLEtBQUssQ0FBQztBQVExQjs7R0FFRztBQUNJLFNBQVMsT0FBTyxDQUFDLFFBQWtCO0lBQ3hDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDbEMsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUU5QixJQUFJLENBQUMsS0FBSztXQUNMLENBQUMsR0FBRztXQUNKLENBQUMsS0FBSyxDQUFDLFNBQVM7V0FDaEIsQ0FBQyxHQUFHLENBQUMsU0FBUztXQUNkLEtBQUssQ0FBQyxLQUFLLEtBQUssU0FBUztXQUN6QixLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVM7V0FDekIsR0FBRyxDQUFDLEtBQUssS0FBSyxTQUFTO1dBQ3ZCLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUMxQjtRQUNBLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzlCLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFFOUIsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUMxQixJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0lBRTFCLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztJQUVuRCxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUU7V0FDdkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRTtXQUNsQyxVQUFVLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDekIsQ0FBQztBQUVELElBQVksS0FLWDtBQUxELFdBQVksS0FBSztJQUNmLDBCQUFpQjtJQUNqQiwwQkFBaUI7SUFDakIsOEJBQXFCO0lBQ3JCLHdCQUFlO0FBQ2pCLENBQUMsRUFMVyxLQUFLLEtBQUwsS0FBSyxRQUtoQjtBQUFBLENBQUM7QUFFSyxTQUFTLFdBQVcsQ0FBQyxHQUE2QjtJQUN2RCxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLE9BQW9CO0lBQ2pELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLElBQUksUUFBQztRQUMzQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7UUFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1FBQ2xCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztRQUNsQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO0tBQ3ZCLENBQUMsRUFOMEIsQ0FNMUIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVNLFNBQVMsZ0JBQWdCLENBQUMsQ0FBOEI7SUFDN0QsT0FBTyxTQUFTLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNJLFNBQVMsS0FBSyxDQUFDLE1BQWMsRUFBRSxHQUFXLEVBQUUsR0FBVztJQUM1RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDOUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzFFRCxzQ0FBc0M7QUFDdEMsYUFBYTtBQUM0RjtBQUloRjtBQVl6QixJQUFNLGNBQWMsR0FBbUM7SUFDckQsSUFBSSxFQUFFLG1EQUFJO0lBQ1YsSUFBSSxFQUFFLG1EQUFJO0lBQ1YsS0FBSyxFQUFFLG9EQUFLO0lBQ1osVUFBVSxFQUFFLHlEQUFVO0lBQ3RCLFVBQVUsRUFBRSx5REFBVTtJQUN0QixNQUFNLEVBQUUscURBQU07SUFDZCxNQUFNLEVBQUUscURBQU07Q0FDZixDQUFDO0FBRUssU0FBUyxpQkFBaUIsQ0FBQyxJQUFZLEVBQUUsV0FBd0I7SUFDdEUsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQztBQUNyQyxDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsSUFBcUI7SUFDdEMsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFxQixFQUFFLFVBQWtCO0lBQy9ELElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7UUFDN0MsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNqRCxJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDN0IsT0FBTyxVQUFVLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNyRDtBQUNILENBQUM7QUFFTSxTQUFTLE1BQU0sQ0FBQyxJQUFjLEVBQUUsS0FBNkIsRUFBRSxNQUE0QjtJQUFsRyxpQkFpR0M7SUFoR0MsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU5QyxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0RBQWtCLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQztJQUVyQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM3QixJQUFNLE9BQU8sR0FBMkIsRUFBRSxDQUFDO0lBQzNDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO0lBRXpCLElBQU0sSUFBSSxHQUF3QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFXO1FBQ3hFLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUM7UUFFdEIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1lBQ2hCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFFNUQsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUVELElBQUksR0FBRyxLQUFLLE9BQU8sRUFBRTtZQUNuQixHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLFFBQVEsSUFBSyxhQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBbkMsQ0FBbUMsRUFBRSxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRS9HLE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFFRCxJQUFJLEtBQUssS0FBSyxNQUFNLEVBQUU7WUFDcEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQztTQUN2QjthQUFNLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtZQUM1QixHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQ3hCO1FBRUQsSUFBSSxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ2pDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUMxQjtRQUVELEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXRCLE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQyxFQUFFLEVBQXlCLENBQUMsQ0FBQztJQUVoQyxXQUFXO0lBQ1gsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDakIsYUFBYTtJQUNiLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO0lBQ25CLGFBQWE7SUFDYixJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztJQUVsQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQzdCLElBQUksU0FBUyxFQUFFO1FBQ2IsSUFBSSxXQUFXLFVBQUM7UUFDaEIsSUFBSSxNQUFNLEVBQUU7WUFDVixXQUFXLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUM1QjthQUFNO1lBQ0wsV0FBVyxHQUFHLDRDQUFHLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUN2QztRQUNELElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5QixTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzlGO1FBQ0QsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQy9CLFNBQVMsQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEc7UUFFRCxJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sS0FBSyxXQUFXLEVBQUU7WUFDNUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7U0FDdkI7UUFFRCxJQUFJLFdBQVcsQ0FBQyxPQUFPLEtBQUssQ0FBQyxJQUFJLE9BQU8sV0FBVyxDQUFDLE9BQU8sS0FBSyxRQUFRLEVBQUU7WUFDeEUsU0FBUyxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDN0Q7S0FDRjtJQUVELHFCQUFxQjtJQUNyQixJQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxhQUFhO0lBQ2IsT0FBTyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDcEIsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBRTVCLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFtQjtRQUNuQyxhQUFhO1FBQ2IsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUUvRCxJQUFJLFlBQVksRUFBRTtZQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDO0FBRU0sU0FBUyxjQUFjLENBQUMsUUFBbUIsRUFBRSxPQUFpQyxFQUFFLFVBQWlCO0lBQWpCLDhDQUFpQjtJQUN0RyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztRQUNyQiw4QkFBOEI7UUFDOUIsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDdEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFbEMsaURBQWlEO1FBQ2pELE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BHLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOztHQUVHO0FBQ0ksU0FBUyxjQUFjLENBQUMsT0FBZ0I7SUFDN0MsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO1FBQ3RDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsSUFBSSxFQUFFLENBQUM7UUFFeEMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFZOztZQUN0RCxhQUFhO1lBQ2IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUF3QixDQUFDLEdBQUcsV0FBSyxDQUFDLE1BQU0sMENBQUcsSUFBcUIsQ0FBVyxDQUFDO1FBQzlGLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQzNGLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQzNGO2FBQU07WUFDTCxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNqRCxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztTQUNqRDtRQUVELEtBQUssQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUM7UUFDOUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUc5RCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxJQUFJLEtBQUssQ0FBQztBQUNaLFNBQVMsV0FBVyxDQUFDLE9BQWdCLEVBQUUsUUFBeUI7SUFBekIsMENBQXlCO0lBQ3JFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVsQixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWM7UUFDdEMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFTSxJQUFNLGVBQWUsR0FBRyxVQUFDLFFBQW1CO0lBQ2pELFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO1FBQzlCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVoQixJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxFQUFFO1lBQy9CLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQUVLLElBQU0sV0FBVyxHQUFHLFVBQUMsSUFBYTtJQUN2QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFZixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWM7UUFDbkMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWFLLFNBQVMsS0FBSyxDQUFvQixJQUFPLEVBQUUsT0FBZ0IsRUFBRSxJQUFXLEVBQUUsTUFBZ0I7SUFBN0Isa0NBQVc7SUFDN0UsSUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxPQUFpQixDQUFDLENBQUM7SUFDOUQsYUFBYTtJQUNiLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO0lBRW5CLElBQU0sSUFBSSxHQUFnQjtRQUN4QixLQUFLLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUN2QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07UUFDdEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1FBQzVCLGFBQWE7UUFDYixFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVE7UUFDakIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUM7UUFDM0MsSUFBSSxFQUFFLE9BQU8sQ0FBQyxPQUFPO0tBQ3RCLENBQUM7SUFFRixJQUFJLE9BQU8sWUFBWSxvREFBSyxFQUFFO1FBQzVCLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztLQUN4QjtTQUFNLElBQUksT0FBTyxZQUFZLG1EQUFJLElBQUksT0FBTyxZQUFZLHlEQUFVLEVBQUU7UUFDbkUsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQzVCO0lBRUQsSUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUMsV0FBVyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDeEIsYUFBYTtJQUNiLFdBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUM5QyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUVuQyxJQUFJLE1BQU0sRUFBRTtRQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDekI7SUFFRCxJQUFJLElBQUksRUFBRTtRQUNSLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUM3QixLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZRZ0M7QUFDQztBQUlsQyxJQUFNLFVBQVUsR0FBRyxJQUFJLG9EQUFJLENBQWEsWUFBWSxDQUFDLENBQUM7QUFPdEQ7SUFBd0MsOEJBQU87SUFNN0Msb0JBQVksSUFBd0I7UUFBcEMsaUJBdUJDO1FBckJHLFNBTUUsSUFBSSxNQU5JLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsS0FLRSxJQUFJLE9BTEssRUFBWCxNQUFNLG1CQUFHLEVBQUUsT0FDWCxLQUlFLElBQUksVUFKUSxFQUFkLFNBQVMsbUJBQUcsRUFBRSxPQUNkLEtBR0UsSUFBSSxNQUhJLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsS0FFRSxJQUFJLEtBRkcsRUFBVCxJQUFJLG1CQUFHLEVBQUUsT0FDVCxPQUFPLEdBQ0wsSUFBSSxRQURDLENBQ0E7Z0JBQ1Qsa0JBQU07WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULEtBQUs7WUFDTCxPQUFPO1NBQ1IsQ0FBQztRQWxCRyxVQUFJLEdBQUcsWUFBWSxDQUFDO1FBb0J6QixLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUV0QixLQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLEtBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUF1QixJQUFJLDJFQUFtRSxDQUFDLENBQUM7U0FDL0c7O0lBQ0gsQ0FBQztJQUVELHNCQUFJLDZCQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUVELFVBQVUsUUFBZ0I7WUFDeEIsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBRXpCLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDdEI7UUFDSCxDQUFDOzs7T0FSQTtJQVVELDRCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELGdDQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsMkJBQU0sR0FBTjtRQUFBLGlCQWNDO1FBYkMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPO1NBQ1I7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ25CLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQStCLENBQUMsQ0FBQztTQUN2RDthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFO2dCQUNyQyxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRTtvQkFDckIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsR0FBK0IsQ0FBQyxDQUFDO2lCQUN2RDtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBRUQsa0NBQWEsR0FBYjtRQUNVLFNBQUssR0FBSyxJQUFJLE1BQVQsQ0FBVTtRQUVmLFNBQXNCLEtBQUssY0FBVixFQUFqQixhQUFhLG1CQUFHLENBQUMsTUFBVztRQUNwQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFFZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNyRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xDLElBQUksR0FBRyxFQUFFO2dCQUNQLEtBQUssSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUVmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUU7b0JBQ2YsS0FBSyxJQUFJLGFBQWEsQ0FBQztpQkFDeEI7YUFDRjtTQUNGO1FBRUQsT0FBTyxFQUFFLEtBQUssU0FBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNqRCxDQUFDO0lBRUQsK0JBQVUsR0FBVixVQUFXLEdBQTZCO1FBQ3RDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNwQyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBb0IsQ0FBQztRQUV6RCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFUCxTQUFpRCxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQWhFLFVBQVUsa0JBQUUsT0FBTyxlQUFFLE9BQU8sZUFBRSxLQUFLLGFBQUUsS0FBSyxXQUFzQixDQUFDO1FBRS9ELFNBQUssR0FBSyxJQUFJLE1BQVQsQ0FBVTtRQUdyQixTQUtFLEtBQUssTUFMRSxFQUFULEtBQUssbUJBQUcsQ0FBQyxPQUFFLGdCQUFnQjtRQUMzQixLQUlFLEtBQUssT0FKRyxFQURDLGdCQUFnQjtRQUMzQixNQUFNLG1CQUFHLENBQUMsT0FBRSxpQkFBaUI7UUFDN0IsU0FBUyxHQUdQLEtBQUssVUFIRSxFQUFFLFdBQVc7UUFDdEIsYUFBYSxHQUVYLEtBQUssY0FGTSxFQUNiLEtBQ0UsS0FBSyxjQURVLEVBQWpCLGFBQWEsbUJBQUcsQ0FBQyxNQUNUO1FBQ1YsaUJBQWlCO1FBQ2pCLElBQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxDQUFDLFVBQVUsSUFBSSxpQkFBaUIsQ0FBVztRQUVwRSxJQUFNLE1BQU0sR0FBRyxVQUFVLEdBQUcsaUJBQWlCLENBQUM7UUFDOUMsSUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFeEMsMkJBQTJCO1FBQzNCLElBQUksVUFBVSxHQUFHLE1BQU0sRUFBRTtZQUN2QixJQUFJLGFBQWEsS0FBSyxRQUFRLEVBQUU7Z0JBQzlCLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDcEM7aUJBQU0sSUFBSSxhQUFhLEtBQUssUUFBUSxFQUFFO2dCQUNyQyxLQUFLLEdBQUcsS0FBSyxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUM7YUFDckM7U0FDRjtRQUVELElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRTtZQUNyQixJQUFJLFNBQVMsS0FBSyxRQUFRLEVBQUU7Z0JBQzFCLEtBQUssSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbEM7aUJBQU0sSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFO2dCQUNoQyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLENBQUM7YUFDOUI7U0FDRjtRQUVELHVCQUF1QjtRQUN2QixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFbEMsSUFBSSxZQUFZLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsRUFBRTtnQkFDN0MsS0FBSyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDcEM7WUFFRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxHQUFHLENBQUMsU0FBUyxDQUNYLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBMkIsRUFDckMsR0FBRyxDQUFDLENBQUMsRUFDTCxHQUFHLENBQUMsQ0FBQyxFQUNMLEdBQUcsQ0FBQyxDQUFDLEVBQ0wsR0FBRyxDQUFDLENBQUMsRUFDTCxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsT0FBTyxFQUNuQyxLQUFLLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEdBQUcsT0FBTyxFQUNuQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFDZCxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FDZixDQUFDO2dCQUVGLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsTUFBTSxHQUFHLGFBQWEsQ0FBQyxDQUFDO2dCQUVqRCxZQUFZLEdBQUcsSUFBSSxDQUFDO2FBQ3JCO1NBQ0Y7UUFFRCxJQUFJLFVBQVUsRUFBRTtZQUNkLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNkO1FBRUQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQUFDLENBdEt1QyxpREFBTyxHQXNLOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xMeUI7QUFFQTtBQU0xQjs7R0FFRztBQUNILElBQUssVUFLSjtBQUxELFdBQUssVUFBVTtJQUNiLDJDQUFJO0lBQ0osNkNBQUs7SUFDTCw2Q0FBSztJQUNMLDZDQUFLO0FBQ1AsQ0FBQyxFQUxJLFVBQVUsS0FBVixVQUFVLFFBS2Q7QUFFRDtJQUFvQywwQkFBSTtJQUt0QyxnQkFBWSxFQU1HO1FBTmYsaUJBb0NDO1lBbkNDLGFBQVUsRUFBVixLQUFLLG1CQUFHLEVBQUUsT0FDVixjQUFXLEVBQVgsTUFBTSxtQkFBRyxFQUFFLE9BQ1gsaUJBQWMsRUFBZCxTQUFTLG1CQUFHLEVBQUUsT0FDZCxhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsT0FBTztRQUVQLElBQUksWUFBWSxHQUFHO1lBQ2pCLEtBQUssRUFBRSxHQUFHO1lBQ1YsTUFBTSxFQUFFLEVBQUU7U0FDWDtnQkFDRCxrQkFBTTtZQUNKLE1BQU07WUFDTixTQUFTO1lBQ1QsS0FBSyx3QkFDQSxZQUFZLEtBQ2YsWUFBWSxFQUFFLEVBQUUsRUFDaEIsZUFBZSxFQUFFLFNBQVMsRUFDMUIsY0FBYyxFQUFFLFFBQVEsRUFDeEIsVUFBVSxFQUFFLFFBQVEsR0FDckI7WUFDRCxPQUFPO1NBQ1IsQ0FBQztRQWdCSSx1QkFBaUIsR0FBRyxJQUFJLENBQUM7UUFhekIscUJBQWUsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBM0J6QyxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksNkNBQUksQ0FBQztZQUNwQixLQUFLLEVBQUU7Z0JBQ0wsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLFFBQVEsRUFBRSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxRQUFRO2FBQ3BCO1lBQ0QsS0FBSyxFQUFFLEtBQUssSUFBSSxRQUFRO1NBQ3pCLENBQUMsQ0FBQztRQUVILEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxDQUFDOztJQUNuQixDQUFDO0lBT0Qsc0JBQUksZ0NBQVk7UUFIaEI7O1dBRUc7YUFDSDtZQUNFLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO1FBQ2hDLENBQUM7YUFFRCxVQUFpQixHQUFZO1lBQzNCLElBQUksQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDO1FBQzFCLENBQUM7OztPQUpBO0lBT0Qsc0JBQUksOEJBQVU7YUFBZDtZQUNFLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQztRQUM5QixDQUFDO2FBRUQsVUFBZSxHQUFlO1lBQzVCLElBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO1FBQzdCLENBQUM7OztPQUpBO0lBMURNLGlCQUFVLEdBQUcsVUFBVSxDQUFDO0lBK0RqQyxhQUFDO0NBQUEsQ0FoRW1DLDZDQUFJLEdBZ0V2QztpRUFoRW9CLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCTTtBQUNUO0FBU3hCO0lBQW9DLDBCQUFPO0lBR3pDLGdCQUFZLElBQW9CO1FBQWhDLGlCQTBCQztRQXhCRyxTQU9FLElBQUksTUFQSSxFQUFWLEtBQUssbUJBQUcsRUFBRSxPQUNWLEtBTUUsSUFBSSxPQU5LLEVBQVgsTUFBTSxtQkFBRyxFQUFFLE9BQ1gsS0FLRSxJQUFJLFVBTFEsRUFBZCxTQUFTLG1CQUFHLEVBQUUsT0FDZCxPQUFPLEdBSUwsSUFBSSxRQUpDLEVBQ1AsS0FHRSxJQUFJLE1BSEssRUFBWCxLQUFLLG1CQUFHLEdBQUcsT0FDWCxLQUVFLElBQUksT0FGTSxFQUFaLE1BQU0sbUJBQUcsR0FBRyxPQUNaLEtBQ0UsSUFBSSxpQkFEa0IsRUFBeEIsZ0JBQWdCLG1CQUFHLEtBQUssTUFDakI7Z0JBRVQsa0JBQU07WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULE9BQU87WUFDUCxLQUFLO1NBQ04sQ0FBQztRQWxCSSxvQkFBYyxHQUE2QixJQUFJO1FBb0JyRDs7V0FFRztRQUNILElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsS0FBSSxDQUFDLGNBQWMsR0FBRyw0Q0FBRyxDQUFDLFlBQVksRUFBdUIsQ0FBQztZQUM5RCxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsS0FBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzdDOztJQUNILENBQUM7SUFFRCxzQkFBSSwwQkFBTTthQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDO1FBQzdCLENBQUM7YUFFRCxVQUFXLEdBQTZCO1lBQ3RDLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxDQUFDO1FBQzVCLENBQUM7OztPQUpBO0lBTUQsdUJBQU0sR0FBTjtRQUNFLElBQUksQ0FBQyxJQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFFRCx3QkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxTQUFTO0lBQ1QsNEJBQVcsR0FBWDtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO0lBQzdCLENBQUM7SUFFRCx1QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQStCLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRUwsU0FBZ0UsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUEvRSxVQUFVLGtCQUFFLE9BQU8sZUFBRSxPQUFPLGVBQUUsS0FBSyxhQUFFLEtBQUssYUFBRSxLQUFLLGFBQUUsTUFBTSxZQUFzQixDQUFDO1FBRXhGLGFBQWE7UUFDYixHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxHQUFHLE9BQU8sRUFBRSxLQUFLLEdBQUcsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwRixhQUFhO1FBRWIsSUFBSSxVQUFVLEVBQUU7WUFDZCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZDtRQUVELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDL0IsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO1FBRUQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxDQTlFbUMsaURBQU8sR0E4RTFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RkQsc0NBQXNDO0FBQ21EO0FBQ3ZEO0FBQ2dCO0FBQ1g7QUFJNkM7QUFFN0UsU0FBUyxlQUFlLENBQUMsSUFBYSxFQUFFLElBQW9CLEVBQUUsRUFBVTtJQUFoQyxnQ0FBb0I7SUFDakUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO1FBQ25DLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7WUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsQjtRQUVELElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDekIsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLElBQWEsRUFBRSxFQUFVO0lBQ3RELElBQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBRTNDLE9BQU8sS0FBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFHLENBQUMsQ0FBQyxLQUFJLElBQUksQ0FBQztBQUMzQixDQUFDO0FBRU0sU0FBUyxzQkFBc0IsQ0FBQyxJQUFhLEVBQUUsSUFBb0IsRUFBRSxTQUFpQjtJQUF2QyxnQ0FBb0I7SUFDeEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFjO1FBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ2pGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7UUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ3pCLHNCQUFzQixDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDaEQ7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVEOztHQUVHO0FBQ0ksU0FBUyxRQUFRLENBQUMsR0FBWSxFQUFFLE1BQWU7SUFDcEQsWUFBWTtJQUNaLDZEQUE2RDtJQUM3RCxHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUNiLFVBQU0sR0FBSyxHQUFHLE9BQVIsQ0FBUztJQUNyQixPQUFPLE1BQU0sRUFBRTtRQUNiLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQztBQUVELFNBQVM7QUFDVCxJQUFNLEVBQUUsR0FBRyxJQUFJLHFEQUFXLEVBQUUsQ0FBQztBQUU3QixJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYixJQUFNLFdBQVcsR0FBRyxVQUFDLEtBQWEsRUFBRSxFQUFVO0lBQzVDLElBQU0sWUFBWSxHQUFHO1FBQ25CLE9BQU87UUFDUCxZQUFZO1FBQ1osV0FBVztRQUNYLFVBQVU7UUFDVixhQUFhO0tBQ2QsQ0FBQztJQUVGLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN0QyxPQUFPLGtCQUFXLEVBQUUsY0FBSSxLQUFLLENBQUUsQ0FBQztLQUNqQztJQUVELE9BQU8sa0JBQVcsRUFBRSxjQUFJLEtBQUssQ0FBRSxDQUFDO0FBQ2xDLENBQUMsQ0FBQztBQTBCRCxDQUFDO0FBRUY7SUEwRkUsaUJBQVksRUFNTTtZQUxoQixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsY0FBVyxFQUFYLE1BQU0sbUJBQUcsRUFBRSxPQUNYLGlCQUFjLEVBQWQsU0FBUyxtQkFBRyxFQUFFLE9BQ2QsVUFBYyxFQUFkLEVBQUUsbUJBQUcsSUFBSSxJQUFJLENBQUMsT0FDZCxlQUFZLEVBQVosT0FBTyxtQkFBRyxFQUFFO1FBOUZkOztXQUVHO1FBQ0ksYUFBUSxHQUFjLEVBQUUsQ0FBQztRQUNoQzs7V0FFRztRQUNJLFdBQU0sR0FBbUIsSUFBSSxDQUFDO1FBbUJyQzs7V0FFRztRQUNJLFNBQUksR0FBbUIsSUFBSSxDQUFDO1FBQ25DLGtCQUFrQjtRQUVsQjs7V0FFRztRQUNJLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBdUJwQixRQUFHLEdBQW9DLElBQUk7UUFFbEQ7O1dBRUc7UUFDSSxZQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXZCOztXQUVHO1FBQ08saUJBQVksR0FBRyxLQUFLLENBQUM7UUFlckIsb0JBQWUsR0FBcUIsRUFBRSxDQUFDO1FBYS9DLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLElBQUksRUFBRSxDQUFDO1lBQ1AsR0FBRyxFQUFFLENBQUM7WUFDTixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1lBQ1QsU0FBUyxFQUFFLENBQUM7WUFDWixTQUFTLEVBQUUsQ0FBQztZQUNaLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsaUJBQWlCLEVBQUUsQ0FBQztTQUNyQixDQUFDO1FBRUYsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxPQUFPLEtBQUssQ0FBQyxlQUFlLEtBQUssUUFBUSxFQUFFO1lBQzdDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7U0FDdkQ7UUFFRCxJQUFJLE9BQU8sS0FBSyxDQUFDLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyw0REFBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN2RCxnREFBZ0Q7WUFDaEQsK0NBQStDO1lBQy9DLGVBQWU7WUFDZix5Q0FBeUM7WUFDekMsTUFBTTtZQUNOLElBQUk7U0FDTDtRQUVELElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUE3Q1Msb0NBQWtCLEdBQTVCLFVBQTZCLElBQVksRUFBRSxHQUFRO0lBRW5ELENBQUM7SUE2Q0QsMkNBQXlCLEdBQXpCLFVBQTBCLGVBQXVCO1FBQWpELGlCQVlDO1FBWEMsSUFBTSxHQUFHLEdBQUcsbUVBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFbkQsSUFBSSxHQUFHLEVBQUU7WUFDUCw0REFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsVUFBQyxHQUFxQjtnQkFDaEQsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JCLEtBQUksQ0FBQyxlQUFlLEdBQUcsR0FBRyxDQUFDO29CQUMzQixxQkFBcUI7b0JBQ3JCLEtBQUksQ0FBQyxJQUFJLElBQUksS0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQ3hDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsc0NBQW9CLEdBQXBCO1FBQUEsaUJBZ0VDO1FBL0RDLElBQUksT0FBTyxLQUFLLEtBQUssVUFBVSxFQUFFO1lBQy9CLElBQU0sS0FBRyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3ZDLEdBQUcsWUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVE7b0JBQ3hCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QyxDQUFDO2dCQUNELEdBQUcsWUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFROztvQkFDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNqRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxNQUFNLEtBQUssR0FBRyxFQUFFO3dCQUM5QyxLQUFHLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUVsQyxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7NEJBQ3hCLDJEQUEyRDs0QkFDM0QsbUNBQW1DOzRCQUNuQyxLQUFHLENBQUMsZUFBZSxHQUFHLDREQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBRTFDLFdBQUcsQ0FBQyxJQUFJLDBDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzt5QkFDM0I7d0JBRUQsSUFBSSx3REFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQzNDLFFBQVEsQ0FBQyxLQUFHLEVBQUUsc0JBQWUsSUFBSSxtQkFBUyxNQUFNLGlCQUFPLEdBQUcsQ0FBRSxDQUFDLENBQUM7eUJBQy9EOzZCQUFNLElBQUkseURBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFOzRCQUNuRCxXQUFHLENBQUMsSUFBSSwwQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7eUJBQzNCOzZCQUFNLElBQUksSUFBSSxLQUFLLGlCQUFpQixFQUFFOzRCQUNyQyxLQUFHLENBQUMseUJBQXlCLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQ3BDO3FCQUNGO29CQUVELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDbEQsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFNLFlBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFXLENBQUM7WUFDM0QsNkNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO2dCQUNwQixNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO29CQUNyQyxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLEdBQUcsRUFBRSxjQUFNLG1CQUFVLENBQUMsR0FBbUIsQ0FBQyxFQUEvQixDQUErQjtvQkFDMUMsR0FBRyxFQUFFLFVBQUMsS0FBSzs7d0JBQ1QsSUFBSSxLQUFLLEtBQUssWUFBVSxDQUFDLEdBQW1CLENBQUMsRUFBRTs0QkFDN0MsWUFBVSxDQUFDLEdBQW1CLENBQUMsR0FBRyxLQUFLLENBQUM7NEJBRXhDLElBQUksd0RBQW9CLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUMxQyxRQUFRLENBQUMsS0FBSSxFQUFFLHNCQUFlLEdBQUcsaUJBQU8sS0FBSyxDQUFFLENBQUMsQ0FBQzs2QkFDbEQ7aUNBQU0sSUFBSSx5REFBcUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0NBQ2xELFdBQUksQ0FBQyxJQUFJLDBDQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQzs2QkFDNUI7aUNBQU0sSUFBSSxHQUFHLEtBQUssaUJBQWlCLEVBQUU7Z0NBQ3BDLEtBQUksQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQzs2QkFDdkM7eUJBQ0Y7b0JBQ0gsQ0FBQztpQkFDRixDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsU0FBUztRQUNULENBQUMsWUFBWSxFQUFFLFdBQVcsRUFBRSxhQUFhLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7WUFDaEYsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBQyxDQUFDLEVBQUUsUUFBUTtnQkFDN0IsS0FBSSxDQUFDLE1BQU0sSUFBSSxLQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRDs7T0FFRztJQUNILHlCQUFPLEdBQVAsY0FBWSxDQUFDO0lBRWI7O09BRUc7SUFDSCx3QkFBTSxHQUFOLGNBQVcsQ0FBQztJQUVaOztPQUVHO0lBQ0gsdUNBQXFCLEdBQXJCO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksb0RBQUksQ0FDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQ3RCLENBQUM7U0FDSDtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUNYLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUN0QixDQUFDO1FBRUYsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRDs7O09BR0c7SUFDSCxnQ0FBYyxHQUFkLFVBQWUsRUFBVTtRQUN2QixPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7T0FHRztJQUNILGlDQUFlLEdBQWYsVUFBZ0IsRUFBVTtRQUN4QixPQUFPLGVBQWUsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7T0FFRztJQUNILHdDQUFzQixHQUF0QixVQUF1QixTQUFpQjtRQUN0QyxPQUFPLHNCQUFzQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCx3QkFBTSxHQUFOLFVBQU8sR0FBNkIsRUFBRSxVQUFtQjtRQUN2RCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUVmLElBQUksVUFBVSxFQUFFO1lBQ2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Y7SUFDSCxDQUFDO0lBRUQ7O09BRUc7SUFDSCw2QkFBVyxHQUFYO1FBQUEsaUJBV0M7UUFWQztZQUNFLFlBQVk7WUFDWixXQUFXO1lBQ1gsYUFBYTtZQUNiLFVBQVU7WUFDVixPQUFPO1lBQ1AsU0FBUztTQUNWLENBQUMsT0FBTyxDQUFDLFVBQUMsU0FBUztZQUNsQixLQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0JBQU0sR0FBTjtRQUNVLFVBQU0sR0FBSyxJQUFJLE9BQVQsQ0FBVTtRQUV4QixJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBRUQsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxDQUFDLENBQUM7U0FDeEQ7SUFDSCxDQUFDO0lBRUQsMEJBQVEsR0FBUjtRQUNFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRUQsU0FBUztJQUNULDZCQUFXLEdBQVg7SUFFQSxDQUFDO0lBRUQsU0FBUztJQUNULHlCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsa0JBQWtCO1FBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBRWhCLHVCQUF1QjtRQUN2Qix5QkFBeUI7UUFDekIscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO0lBQzVCLENBQUM7SUFFRCxxQkFBRyxHQUFILFVBQUksT0FBZ0I7UUFDbEIsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDdEIsOEJBQThCO1FBRTlCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7T0FFRztJQUNILDZCQUFXLEdBQVgsVUFBWSxPQUFnQjtRQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRWxCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsc0JBQWUsT0FBTyxDQUFFLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCw2QkFBVyxHQUFYLFVBQVksT0FBZ0I7UUFDMUIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEIsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLFFBQVEsQ0FBQyxJQUFJLEVBQUUsc0JBQWUsT0FBTyxDQUFFLENBQUMsQ0FBQztTQUMxQzthQUFNO1lBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxtRUFBbUUsQ0FBQyxDQUFDO1NBQ25GO0lBQ0gsQ0FBQztJQUVELHNCQUFJLEdBQUosVUFBSyxLQUFhO1FBQUUsaUJBQWlCO2FBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQixnQ0FBaUI7O1FBQ25DLEVBQUUsQ0FBQyxJQUFJLE9BQVAsRUFBRSxpQkFBTSxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBSyxPQUFPLFVBQUU7SUFDbkQsQ0FBQztJQUVELG9CQUFFLEdBQUYsVUFBRyxLQUFhLEVBQUUsUUFBa0I7UUFDbEMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsc0JBQUksR0FBSixVQUFLLEtBQWEsRUFBRSxRQUFrQjtRQUNwQyxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxxQkFBRyxHQUFILFVBQUksS0FBYSxFQUFFLFFBQW1CO1FBQ3BDLEVBQUUsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILDhCQUFZLEdBQVosVUFBYSxHQUE2QixFQUFFLE9BQW1CLEVBQUUsT0FBbUI7UUFBeEMscUNBQW1CO1FBQUUscUNBQW1CO1FBQ2xGLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQy9CLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLElBQUksQ0FBQyxDQUFDO1FBQy9CLFNBQW9CLEtBQUssWUFBVixFQUFmLFdBQVcsbUJBQUcsQ0FBQyxNQUFXO1FBQ2xDLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxtQkFBbUIsSUFBSSxNQUFNLENBQUM7UUFDaEQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixJQUFJLE1BQU0sQ0FBQztRQUNqRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsc0JBQXNCLElBQUksTUFBTSxDQUFDO1FBQ25ELElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyx1QkFBdUIsSUFBSSxNQUFNLENBQUM7UUFDcEQsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQixTQUFxQixLQUFLLFlBQVYsRUFBaEIsV0FBVyxtQkFBRyxFQUFFLE1BQVc7UUFDbkMsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUN4QixJQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ2hCLFNBQUssR0FBYSxHQUFHLE1BQWhCLEVBQUUsTUFBTSxHQUFLLEdBQUcsT0FBUixDQUFTO1FBRTlCLElBQU0sU0FBUyxHQUFHLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFFckQsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDOUIsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQy9DO1FBRUQsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7UUFDNUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFOUIsUUFBUTtRQUNSLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUMzQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7UUFDbkQsU0FBUztRQUNULEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN6RixRQUFRO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUM1RCxTQUFTO1FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0csUUFB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UixNQUFNLEVBQUUsQ0FBQztLQUNWO0lBQ0QsSUFBSSxFQUFFLFFBQVE7Q0FDZixDQUFDLENBQUM7QUFPRiIsInNvdXJjZXMiOlsid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvY3NzLWxheW91dC9kaXN0L2Nzcy1sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vYml0TWFwRm9udC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9kZWJ1Z0luZm8udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vaW1hZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcmVjdC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi90aWNrZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdXRpbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi92ZC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYml0bWFwdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2VsZW1lbnRzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbWFnZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbGJhci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlUGFyc2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy90ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy92aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvZW52LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvbm9kZTJqc29uLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbE5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxzdHIyeG1sbm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kIGZvciByZWZlcmVuY2Vcbi8vXG4vLyBUaGlzIGZpbGUgdXNlcyB0aGUgZm9sbG93aW5nIHNwZWNpZmljIFVNRCBpbXBsZW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QuY29tcHV0ZUxheW91dCA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG52YXIgY29tcHV0ZUxheW91dCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ1NTX1VOREVGSU5FRDtcblxuICB2YXIgQ1NTX0RJUkVDVElPTl9JTkhFUklUID0gJ2luaGVyaXQnO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9MVFIgPSAnbHRyJztcbiAgdmFyIENTU19ESVJFQ1RJT05fUlRMID0gJ3J0bCc7XG5cbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1cgPSAncm93JztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSA9ICdyb3ctcmV2ZXJzZSc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OID0gJ2NvbHVtbic7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UgPSAnY29sdW1uLXJldmVyc2UnO1xuXG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0pVU1RJRllfQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOID0gJ3NwYWNlLWJldHdlZW4nO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EID0gJ3NwYWNlLWFyb3VuZCc7XG5cbiAgdmFyIENTU19BTElHTl9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0FMSUdOX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19BTElHTl9TVFJFVENIID0gJ3N0cmV0Y2gnO1xuXG4gIHZhciBDU1NfUE9TSVRJT05fUkVMQVRJVkUgPSAncmVsYXRpdmUnO1xuICB2YXIgQ1NTX1BPU0lUSU9OX0FCU09MVVRFID0gJ2Fic29sdXRlJztcblxuICB2YXIgbGVhZGluZyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciB0cmFpbGluZyA9IHtcbiAgICAncm93JzogJ3JpZ2h0JyxcbiAgICAncm93LXJldmVyc2UnOiAnbGVmdCcsXG4gICAgJ2NvbHVtbic6ICdib3R0b20nLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICd0b3AnXG4gIH07XG4gIHZhciBwb3MgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgZGltID0ge1xuICAgICdyb3cnOiAnd2lkdGgnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICd3aWR0aCcsXG4gICAgJ2NvbHVtbic6ICdoZWlnaHQnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdoZWlnaHQnXG4gIH07XG5cbiAgLy8gV2hlbiB0cmFuc3BpbGVkIHRvIEphdmEgLyBDIHRoZSBub2RlIHR5cGUgaGFzIGxheW91dCwgY2hpbGRyZW4gYW5kIHN0eWxlXG4gIC8vIHByb3BlcnRpZXMuIEZvciB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGVzZSBwcm9wZXJ0aWVzXG4gIC8vIGlmIHRoZXkgZG9uJ3QgYWxyZWFkeSBleGlzdC5cbiAgZnVuY3Rpb24gZmlsbE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUubGF5b3V0IHx8IG5vZGUuaXNEaXJ0eSkge1xuICAgICAgbm9kZS5sYXlvdXQgPSB7XG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLnN0eWxlKSB7XG4gICAgICBub2RlLnN0eWxlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmaWxsTm9kZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm93RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbkVuZCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5FbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdTdGFydCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ0VuZCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ0VuZCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSArXG4gICAgICAgIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEp1c3RpZnlDb250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmFsaWduQ29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25Db250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnN0eWxlLmFsaWduU2VsZikge1xuICAgICAgcmV0dXJuIGNoaWxkLnN0eWxlLmFsaWduU2VsZjtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25JdGVtcykge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25JdGVtcztcbiAgICB9XG4gICAgcmV0dXJuICdzdHJldGNoJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVBeGlzKGF4aXMsIGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fUlRMKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVykge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbikge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgaWYgKG5vZGUuc3R5bGUuZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gQ1NTX0RJUkVDVElPTl9JTkhFUklUO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fSU5IRVJJVCkge1xuICAgICAgZGlyZWN0aW9uID0gKHBhcmVudERpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gQ1NTX0RJUkVDVElPTl9MVFIgOiBwYXJlbnREaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGbGV4RGlyZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENyb3NzRmxleERpcmVjdGlvbihmbGV4RGlyZWN0aW9uLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvblR5cGUobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLnBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuICdyZWxhdGl2ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXgobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRQb3NpdGlvblR5cGUobm9kZSkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgbm9kZS5zdHlsZS5mbGV4ID4gMFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXhXcmFwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4V3JhcCA9PT0gJ3dyYXAnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGltV2l0aE1hcmdpbihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gKyBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZVtkaW1bYXhpc11dID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Bvc0RlZmluZWQobm9kZSwgcG9zKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZWFzdXJlRGVmaW5lZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUubWVhc3VyZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24obm9kZSwgcG9zKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvdW5kQXhpcyhub2RlLCBheGlzLCB2YWx1ZSkge1xuICAgIHZhciBtaW4gPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5taW5IZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbkhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgbWF4ID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWF4SGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhIZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIGJvdW5kVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgbWF4ID49IDAgJiYgYm91bmRWYWx1ZSA+IG1heCkge1xuICAgICAgYm91bmRWYWx1ZSA9IG1heDtcbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkICYmIG1pbiA+PSAwICYmIGJvdW5kVmFsdWUgPCBtaW4pIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtaW47XG4gICAgfVxuICAgIHJldHVybiBib3VuZFZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm1heGYoYSwgYikge1xuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzcGVjaWZpY2FsbHkgc2V0cyBhIHZhbHVlIGZvciB3aWR0aCBvciBoZWlnaHRcbiAgZnVuY3Rpb24gc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGF4aXMpIHtcbiAgICAvLyBUaGUgcGFyZW50IGFscmVhZHkgY29tcHV0ZWQgdXMgYSB3aWR0aCBvciBoZWlnaHQuIFdlIGp1c3Qgc2tpcCBpdFxuICAgIGlmIChub2RlLmxheW91dFtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV2Ugb25seSBydW4gaWYgdGhlcmUncyBhIHdpZHRoIG9yIGhlaWdodCBkZWZpbmVkXG4gICAgaWYgKCFpc0RpbURlZmluZWQobm9kZSwgYXhpcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGltZW5zaW9ucyBjYW4gbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJcbiAgICBub2RlLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICBib3VuZEF4aXMobm9kZSwgYXhpcywgbm9kZS5zdHlsZVtkaW1bYXhpc11dKSxcbiAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGF4aXMpIHtcbiAgICBjaGlsZC5sYXlvdXRbdHJhaWxpbmdbYXhpc11dID0gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dIC0gY2hpbGQubGF5b3V0W3Bvc1theGlzXV07XG4gIH1cblxuICAvLyBJZiBib3RoIGxlZnQgYW5kIHJpZ2h0IGFyZSBkZWZpbmVkLCB0aGVuIHVzZSBsZWZ0LiBPdGhlcndpc2UgcmV0dXJuXG4gIC8vICtsZWZ0IG9yIC1yaWdodCBkZXBlbmRpbmcgb24gd2hpY2ggaXMgZGVmaW5lZC5cbiAgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbbGVhZGluZ1theGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGdldFBvc2l0aW9uKG5vZGUsIGxlYWRpbmdbYXhpc10pO1xuICAgIH1cbiAgICByZXR1cm4gLWdldFBvc2l0aW9uKG5vZGUsIHRyYWlsaW5nW2F4aXNdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCAvKmNzc19kaXJlY3Rpb25fdCovcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyLypjc3NfZGlyZWN0aW9uX3QqLyBkaXJlY3Rpb24gPSByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIG1haW5BeGlzID0gcmVzb2x2ZUF4aXMoZ2V0RmxleERpcmVjdGlvbihub2RlKSwgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gY3Jvc3NBeGlzID0gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKG1haW5BeGlzLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyByZXNvbHZlZFJvd0F4aXMgPSByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuXG4gICAgLy8gSGFuZGxlIHdpZHRoIGFuZCBoZWlnaHQgc3R5bGUgYXR0cmlidXRlc1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBtYWluQXhpcyk7XG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBTZXQgdGhlIHJlc29sdmVkIHJlc29sdXRpb24gaW4gdGhlIG5vZGUncyBsYXlvdXRcbiAgICBub2RlLmxheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgc2V0IGJ5IHRoZSBwYXJlbnQsIGJ1dCB3ZSBuZWVkIHRvIGNvbXBsZXRlIGl0IHdpdGggYVxuICAgIC8vIGRlbHRhIGNvbXBvc2VkIG9mIHRoZSBtYXJnaW4gYW5kIGxlZnQvdG9wL3JpZ2h0L2JvdHRvbVxuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbbWFpbkF4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1ttYWluQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFtsZWFkaW5nW2Nyb3NzQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBJbmxpbmUgaW1tdXRhYmxlIHZhbHVlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZSB0byBhdm9pZCBleGNlc3NpdmUgbWV0aG9kXG4gICAgLy8gaW52b2NhdGlvbnMgZHVyaW5nIHRoZSBsYXlvdXQgY2FsY3VsYXRpb24uXG4gICAgdmFyLyppbnQqLyBjaGlsZENvdW50ID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3cgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuXG4gICAgaWYgKGlzTWVhc3VyZURlZmluZWQobm9kZSkpIHtcbiAgICAgIHZhci8qYm9vbCovIGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSk7XG5cbiAgICAgIHZhci8qZmxvYXQqLyB3aWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLnN0eWxlLndpZHRoO1xuICAgICAgfSBlbHNlIGlmIChpc1Jlc29sdmVkUm93RGltRGVmaW5lZCkge1xuICAgICAgICB3aWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoIC09IHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBnaXZlIGEgZGltZW5zaW9uIGZvciB0aGUgdGV4dCBpZiB3ZSBoYXZlbid0IGdvdCBhbnlcbiAgICAgIC8vIGZvciBpdCBjb21wdXRlZCB5ZXQuIEl0IGNhbiBlaXRoZXIgYmUgZnJvbSB0aGUgc3R5bGUgYXR0cmlidXRlIG9yIGJlY2F1c2VcbiAgICAgIC8vIHRoZSBlbGVtZW50IGlzIGZsZXhpYmxlLlxuICAgICAgdmFyLypib29sKi8gaXNSb3dVbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykgJiYgIWlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkO1xuICAgICAgdmFyLypib29sKi8gaXNDb2x1bW5VbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pICYmXG4gICAgICAgIGlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OXV0pO1xuXG4gICAgICAvLyBMZXQncyBub3QgbWVhc3VyZSB0aGUgdGV4dCBpZiB3ZSBhbHJlYWR5IGtub3cgYm90aCBkaW1lbnNpb25zXG4gICAgICBpZiAoaXNSb3dVbmRlZmluZWQgfHwgaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgdmFyLypjc3NfZGltX3QqLyBtZWFzdXJlRGltID0gbm9kZS5zdHlsZS5tZWFzdXJlKFxuICAgICAgICAgIC8qKGMpIW5vZGUtPmNvbnRleHQsKi9cbiAgICAgICAgICAvKihqYXZhKSFsYXlvdXRDb250ZXh0Lm1lYXN1cmVPdXRwdXQsKi9cbiAgICAgICAgICB3aWR0aFxuICAgICAgICApO1xuICAgICAgICBpZiAoaXNSb3dVbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC53aWR0aCA9IG1lYXN1cmVEaW0ud2lkdGggK1xuICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBtZWFzdXJlRGltLmhlaWdodCArXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIGlzTm9kZUZsZXhXcmFwID0gaXNGbGV4V3JhcChub2RlKTtcblxuICAgIHZhci8qY3NzX2p1c3RpZnlfdCovIGp1c3RpZnlDb250ZW50ID0gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSk7XG5cbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIHZhci8qYm9vbCovIGlzTWFpbkRpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzQ3Jvc3NEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNNYWluUm93RGlyZWN0aW9uID0gaXNSb3dEaXJlY3Rpb24obWFpbkF4aXMpO1xuXG4gICAgdmFyLyppbnQqLyBpO1xuICAgIHZhci8qaW50Ki8gaWk7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGNoaWxkO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBheGlzO1xuXG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcblxuICAgIHZhci8qZmxvYXQqLyBkZWZpbmVkTWFpbkRpbSA9IENTU19VTkRFRklORUQ7XG4gICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIGRlZmluZWRNYWluRGltID0gbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gLSBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW47XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBleGVjdXRlIHRoZSBuZXh0IHR3byBsb29wcyBvbmUgcGVyIGxpbmUgd2l0aCBmbGV4LXdyYXBcbiAgICB2YXIvKmludCovIHN0YXJ0TGluZSA9IDA7XG4gICAgdmFyLyppbnQqLyBlbmRMaW5lID0gMDtcbiAgICAvLyB2YXIvKmludCovIG5leHRPZmZzZXQgPSAwO1xuICAgIHZhci8qaW50Ki8gYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgLy8gV2UgYWdncmVnYXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZSBjb250YWluZXIgaW4gdGhvc2UgdHdvIHZhcmlhYmxlc1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc0Nyb3NzRGltID0gMDtcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNNYWluRGltID0gMDtcbiAgICB2YXIvKmludCovIGxpbmVzQ291bnQgPSAwO1xuICAgIHdoaWxlIChlbmRMaW5lIDwgY2hpbGRDb3VudCkge1xuICAgICAgLy8gPExvb3AgQT4gTGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgY291bnQgY2hpbGRyZW4gYnkgdHlwZVxuXG4gICAgICAvLyBtYWluQ29udGVudERpbSBpcyBhY2N1bXVsYXRpb24gb2YgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbiBvZiBhbGwgdGhlXG4gICAgICAvLyBub24gZmxleGlibGUgY2hpbGRyZW4uIFRoaXMgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGVpdGhlciBzZXQgdGhlXG4gICAgICAvLyBkaW1lbnNpb25zIG9mIHRoZSBub2RlIGlmIG5vbmUgYWxyZWFkeSBleGlzdCwgb3IgdG8gY29tcHV0ZSB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZSBsZWZ0IGZvciB0aGUgZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkNvbnRlbnREaW0gPSAwO1xuXG4gICAgICAvLyBUaGVyZSBhcmUgdGhyZWUga2luZCBvZiBjaGlsZHJlbiwgbm9uIGZsZXhpYmxlLCBmbGV4aWJsZSBhbmQgYWJzb2x1dGUuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGhlcmUgYXJlIGluIG9yZGVyIHRvIGRpc3RyaWJ1dGUgdGhlIHNwYWNlLlxuICAgICAgdmFyLyppbnQqLyBmbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIHRvdGFsRmxleGlibGUgPSAwO1xuICAgICAgdmFyLyppbnQqLyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuXG4gICAgICAvLyBVc2UgdGhlIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgbWFpbiBheGlzIGZvciBhcyBsb25nXG4gICAgICAvLyBhcyB0aGV5IGFyZSB1c2luZyBhIHNpbXBsZSBzdGFja2luZyBiZWhhdmlvdXIuIENoaWxkcmVuIHRoYXQgYXJlXG4gICAgICAvLyBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3Agd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpblxuICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrTWFpbiA9XG4gICAgICAgICAgKGlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgKCFpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9DRU5URVIpO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhNYWluID0gKGlzU2ltcGxlU3RhY2tNYWluID8gY2hpbGRDb3VudCA6IHN0YXJ0TGluZSk7XG5cbiAgICAgIC8vIFVzZSB0aGUgaW5pdGlhbCBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIGNyb3NzIGF4aXMgZm9yXG4gICAgICAvLyBhcyBsb25nIGFzIHRoZXkgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCB3aXRoIGFsaWdubWVudCBTVFJFVENIIG9yXG4gICAgICAvLyBGTEVYX1NUQVJULiBDaGlsZHJlbiB0aGF0IGFyZSBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3BcbiAgICAgIC8vIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW4gaW4gPExvb3AgRD4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSB0cnVlO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhDcm9zcyA9IGNoaWxkQ291bnQ7XG5cbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluO1xuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltID0gMDtcblxuICAgICAgdmFyLypmbG9hdCovIG1heFdpZHRoO1xuICAgICAgZm9yIChpID0gc3RhcnRMaW5lOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgY2hpbGQubGluZUluZGV4ID0gbGluZXNDb3VudDtcblxuICAgICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuXG4gICAgICAgIC8vIFByZS1maWxsIGNyb3NzIGF4aXMgZGltZW5zaW9ucyB3aGVuIHRoZSBjaGlsZCBpcyB1c2luZyBzdHJldGNoIGJlZm9yZVxuICAgICAgICAvLyB3ZSBjYWxsIHRoZSByZWN1cnNpdmUgbGF5b3V0IHBhc3NcbiAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiZcbiAgICAgICAgICAgIGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgICAgICAgaXNDcm9zc0RpbURlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGNyb3NzQXhpcykpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUpIHtcbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNoaWxkcmVuXG4gICAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RBYnNvbHV0ZUNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aFxuICAgICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSxcbiAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBheGlzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhci8qZmxvYXQqLyBuZXh0Q29udGVudERpbSA9IDA7XG5cbiAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBjb25zaWRlciBhIGNoaWxkIGZsZXhpYmxlIGlmIHdlIGhhdmUgYSBjb21wdXRlZFxuICAgICAgICAvLyBkaW1lbnNpb24gZm9yIHRoZSBub2RlLlxuICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCAmJiBpc0ZsZXgoY2hpbGQpKSB7XG4gICAgICAgICAgZmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgdG90YWxGbGV4aWJsZSArPSBjaGlsZC5zdHlsZS5mbGV4O1xuXG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGZsZXhpYmxlIGNoaWxkcmVuIHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RGbGV4Q2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBrbm93IGl0cyBleGFjdCBzaXplIHlldCwgd2UgYWxyZWFkeSBrbm93IHRoZSBwYWRkaW5nLFxuICAgICAgICAgIC8vIGJvcmRlciBhbmQgbWFyZ2luLiBXZSdsbCB1c2UgdGhpcyBwYXJ0aWFsIGluZm9ybWF0aW9uLCB3aGljaCByZXByZXNlbnRzXG4gICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNpemUgZm9yIHRoZSBjaGlsZCwgdG8gY29tcHV0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAgICAgLy8gYXZhaWxhYmxlIHNwYWNlLlxuICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBtYWluQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBtYWluIHJlY3Vyc2l2ZSBjYWxsLiBXZSBsYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgICAgIGlmIChhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID09PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFic29sdXRlIHBvc2l0aW9uZWQgZWxlbWVudHMgZG8gbm90IHRha2UgcGFydCBvZiB0aGUgbGF5b3V0LCBzbyB3ZVxuICAgICAgICAgIC8vIGRvbid0IHVzZSB0aGVtIHRvIGNvbXB1dGUgbWFpbkNvbnRlbnREaW1cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBhbmQgbWFyZ2luIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGVsZW1lbnQgd2UgYXJlIGFib3V0IHRvIGFkZCB3b3VsZCBtYWtlIHVzIGdvIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgICAgaWYgKGlzTm9kZUZsZXhXcmFwICYmXG4gICAgICAgICAgICBpc01haW5EaW1EZWZpbmVkICYmXG4gICAgICAgICAgICBtYWluQ29udGVudERpbSArIG5leHRDb250ZW50RGltID4gZGVmaW5lZE1haW5EaW0gJiZcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZWxlbWVudCwgdGhlbiBpdCdzIGJpZ2dlciB0aGFuIHRoZSBjb250ZW50XG4gICAgICAgICAgICAvLyBhbmQgbmVlZHMgaXRzIG93biBsaW5lXG4gICAgICAgICAgICBpICE9PSBzdGFydExpbmUpIHtcbiAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQtLTtcbiAgICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBtYWluIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4gJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHwgaXNGbGV4KGNoaWxkKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrTWFpbiA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleE1haW4gPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIGNyb3NzIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEQ+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8XG4gICAgICAgICAgICAgICAgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiYgYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAgICAgICBpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhDcm9zcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4pIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1haW5EaW0gKz0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgICAgIG1haW5Db250ZW50RGltICs9IG5leHRDb250ZW50RGltO1xuICAgICAgICBlbmRMaW5lID0gaSArIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEI+IExheW91dCBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgYWxsb2NhdGUgZW1wdHkgc3BhY2VcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gcG9zaXRpb24gdGhlIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMsIHdlIGhhdmUgdHdvXG4gICAgICAvLyBjb250cm9scy4gVGhlIHNwYWNlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIGFuZCB0aGUgc3BhY2UgYmV0d2VlbiBlYWNoIHR3byBlbGVtZW50cy5cbiAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nTWFpbkRpbSA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gYmV0d2Vlbk1haW5EaW0gPSAwO1xuXG4gICAgICAvLyBUaGUgcmVtYWluaW5nIGF2YWlsYWJsZSBzcGFjZSB0aGF0IG5lZWRzIHRvIGJlIGFsbG9jYXRlZFxuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ01haW5EaW0gPSAwO1xuICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGRlZmluZWRNYWluRGltIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYobWFpbkNvbnRlbnREaW0sIDApIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBmbGV4aWJsZSBjaGlsZHJlbiBpbiB0aGUgbWl4LCB0aGV5IGFyZSBnb2luZyB0byBmaWxsIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlXG4gICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICE9PSAwKSB7XG4gICAgICAgIHZhci8qZmxvYXQqLyBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJhc2VNYWluRGltO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYm91bmRNYWluRGltO1xuXG4gICAgICAgIC8vIElmIHRoZSBmbGV4IHNoYXJlIG9mIHJlbWFpbmluZyBzcGFjZSBkb2Vzbid0IG1lZXQgbWluL21heCBib3VuZHMsXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGNoaWxkIGZyb20gZmxleCBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICBiYXNlTWFpbkRpbSA9IGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBib3VuZE1haW5EaW0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsIGJhc2VNYWluRGltKTtcblxuICAgICAgICAgIGlmIChiYXNlTWFpbkRpbSAhPT0gYm91bmRNYWluRGltKSB7XG4gICAgICAgICAgICByZW1haW5pbmdNYWluRGltIC09IGJvdW5kTWFpbkRpbTtcbiAgICAgICAgICAgIHRvdGFsRmxleGlibGUgLT0gY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG5cbiAgICAgICAgLy8gVGhlIG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBjYW4gb3ZlcmZsb3cgdGhlIGNvbnRhaW5lciwgaW4gdGhpcyBjYXNlXG4gICAgICAgIC8vIHdlIHNob3VsZCBqdXN0IGFzc3VtZSB0aGF0IHRoZXJlIGlzIG5vIHNwYWNlIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGZsZXhpYmxlTWFpbkRpbSA8IDApIHtcbiAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbWFpblxuICAgICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubGF5b3V0W2RpbVttYWluQXhpc11dID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLFxuICAgICAgICAgICAgZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIHJlY3Vyc2l2ZWx5IGNhbGwgdGhlIGxheW91dCBhbGdvcml0aG0gZm9yIHRoaXMgY2hpbGRcbiAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY3VycmVudEZsZXhDaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICBjaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UganVzdGlmeUNvbnRlbnQgdG8gZmlndXJlIG91dCBob3cgdG8gYWxsb2NhdGUgdGhlIHJlbWFpbmluZ1xuICAgICAgLy8gc3BhY2UgYXZhaWxhYmxlXG4gICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB7XG4gICAgICAgIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfQ0VOVEVSKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9FTkQpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW07XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4pIHtcbiAgICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYocmVtYWluaW5nTWFpbkRpbSwgMCk7XG4gICAgICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEgIT09IDApIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EKSB7XG4gICAgICAgICAgLy8gU3BhY2Ugb24gdGhlIGVkZ2VzIGlzIGhhbGYgb2YgdGhlIHNwYWNlIGJldHdlZW4gZWxlbWVudHNcbiAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCk7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSBiZXR3ZWVuTWFpbkRpbSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQz4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcyBhbmQgY29tcHV0ZSBkaW1lbnNpb25zXG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIGFsbCB0aGUgY2hpbGRyZW4gaGF2ZSB0aGVpciBkaW1lbnNpb25zIHNldC4gV2UgbmVlZCB0b1xuICAgICAgLy8gZmluZCB0aGVpciBwb3NpdGlvbi4gSW4gb3JkZXIgdG8gZG8gdGhhdCwgd2UgYWNjdW11bGF0ZSBkYXRhIGluXG4gICAgICAvLyB2YXJpYWJsZXMgdGhhdCBhcmUgYWxzbyB1c2VmdWwgdG8gY29tcHV0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGVcbiAgICAgIC8vIGNvbnRhaW5lciFcbiAgICAgIG1haW5EaW0gKz0gbGVhZGluZ01haW5EaW07XG5cbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleE1haW47IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgYW5kIGhhcyBsZWZ0L3RvcCBiZWluZ1xuICAgICAgICAgIC8vIGRlZmluZWQsIHdlIG92ZXJyaWRlIHRoZSBwb3NpdGlvbiB0byB3aGF0ZXZlciB0aGUgdXNlciBzYWlkXG4gICAgICAgICAgLy8gKGFuZCBtYXJnaW4vYm9yZGVyKS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgKHdpdGhvdXQgdG9wL2xlZnQpIG9yIHJlbGF0aXZlLFxuICAgICAgICAgIC8vIHdlIHB1dCBpdCBhdCB0aGUgY3VycmVudCBhY2N1bXVsYXRlZCBvZmZzZXQuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UgcGxhY2VkIHRoZSBlbGVtZW50LCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFyaWFibGVzXG4gICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGRvIHRoYXQgZm9yIHJlbGF0aXZlIGVsZW1lbnRzLiBBYnNvbHV0ZSBlbGVtZW50c1xuICAgICAgICAgIC8vIGRvIG5vdCB0YWtlIHBhcnQgaW4gdGhhdCBwaGFzZS5cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvLyBUaGUgbWFpbiBkaW1lbnNpb24gaXMgdGhlIHN1bSBvZiBhbGwgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBwbHVzXG4gICAgICAgICAgICAvLyB0aGUgc3BhY2luZy5cbiAgICAgICAgICAgIG1haW5EaW0gKz0gYmV0d2Vlbk1haW5EaW0gKyBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgICAvLyBUaGUgY3Jvc3MgZGltZW5zaW9uIGlzIHRoZSBtYXggb2YgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBzaW5jZSB0aGVyZVxuICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIGVsZW1lbnQgaW4gdGhhdCBjcm9zcyBkaW1lbnNpb24uXG4gICAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmZsb2F0Ki8gY29udGFpbmVyQ3Jvc3NBeGlzID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICBjb250YWluZXJDcm9zc0F4aXMgPSBmbWF4ZihcbiAgICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGNyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBEPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4Q3Jvc3M7IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIGFic29sdXRlbHkgcG9zaXRpb25uZWQgYW5kIGhhcyBhXG4gICAgICAgICAgLy8gdG9wL2xlZnQvYm90dG9tL3JpZ2h0IGJlaW5nIHNldCwgd2Ugb3ZlcnJpZGUgYWxsIHRoZSBwcmV2aW91c2x5XG4gICAgICAgICAgLy8gY29tcHV0ZWQgcG9zaXRpb25zIHRvIHNldCBpdCBjb3JyZWN0bHkuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdDcm9zc0RpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgICAgICAvLyBGb3IgYSByZWxhdGl2ZSBjaGlsZHJlbiwgd2UncmUgZWl0aGVyIHVzaW5nIGFsaWduSXRlbXMgKHBhcmVudCkgb3JcbiAgICAgICAgICAvLyBhbGlnblNlbGYgKGNoaWxkKSBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIHBvc2l0aW9uIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgLy8gVGhpcyB2YXJpYWJsZSBpcyBpbnRlbnRpb25hbGx5IHJlLWRlZmluZWQgYXMgdGhlIGNvZGUgaXMgdHJhbnNwaWxlZCB0byBhIGJsb2NrIHNjb3BlIGxhbmd1YWdlXG4gICAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgLy8gWW91IGNhbiBvbmx5IHN0cmV0Y2ggaWYgdGhlIGRpbWVuc2lvbiBoYXMgbm90IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgICAgICAgICAgLy8gcHJldmlvdXNseS5cbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIHNwYWNlIGJldHdlZW4gdGhlIHBhcmVudCBkaW1lbnNpb25zK3BhZGRpbmcgYW5kIGNoaWxkXG4gICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnMrbWFyZ2luLlxuICAgICAgICAgICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQ3Jvc3NEaW0gPSBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW0gLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDU1NfQUxJR05fRkxFWF9FTkRcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgYXBwbHkgdGhlIHBvc2l0aW9uXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ0Nyb3NzRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmVzQ3Jvc3NEaW0gKz0gY3Jvc3NEaW07XG4gICAgICBsaW5lc01haW5EaW0gPSBmbWF4ZihsaW5lc01haW5EaW0sIG1haW5EaW0pO1xuICAgICAgbGluZXNDb3VudCArPSAxO1xuICAgICAgc3RhcnRMaW5lID0gZW5kTGluZTtcbiAgICB9XG5cbiAgICAvLyA8TG9vcCBFPlxuICAgIC8vXG4gICAgLy8gTm90ZShwcmVuYXV4KTogTW9yZSB0aGFuIG9uZSBsaW5lLCB3ZSBuZWVkIHRvIGxheW91dCB0aGUgY3Jvc3NBeGlzXG4gICAgLy8gYWNjb3JkaW5nIHRvIGFsaWduQ29udGVudC5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb3VsZCBwcm9iYWJseSByZW1vdmUgPExvb3AgRD4gYW5kIGhhbmRsZSB0aGUgb25lIGxpbmUgY2FzZVxuICAgIC8vIGhlcmUgdG9vLCBidXQgZm9yIHRoZSBtb21lbnQgdGhpcyBpcyBzYWZlciBzaW5jZSBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aFxuICAgIC8vIHByZXZpb3VzbHkgd29ya2luZyBjb2RlLlxuICAgIC8vXG4gICAgLy8gU2VlIHNwZWNzOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTIvQ1ItY3NzMy1mbGV4Ym94LTIwMTIwOTE4LyNsYXlvdXQtYWxnb3JpdGhtXG4gICAgLy8gc2VjdGlvbiA5LjRcbiAgICAvL1xuICAgIGlmIChsaW5lc0NvdW50ID4gMSAmJiBpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgdmFyLypmbG9hdCovIG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3M7XG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQWxpZ25Db250ZW50RGltID0gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSAtIGxpbmVzQ3Jvc3NEaW07XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbUxlYWQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGN1cnJlbnRMZWFkID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudCA9IGdldEFsaWduQ29udGVudChub2RlKTtcbiAgICAgIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyAyO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgIGlmIChub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID4gbGluZXNDcm9zc0RpbSkge1xuICAgICAgICAgIGNyb3NzRGltTGVhZCA9IChyZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyBsaW5lc0NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmludCovIGVuZEluZGV4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lc0NvdW50OyArK2kpIHtcbiAgICAgICAgdmFyLyppbnQqLyBzdGFydEluZGV4ID0gZW5kSW5kZXg7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbGluZSdzIGhlaWdodCBhbmQgZmluZCB0aGUgZW5kSW5kZXhcbiAgICAgICAgdmFyLypmbG9hdCovIGxpbmVIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBjaGlsZENvdW50OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoaWxkLmxpbmVJbmRleCAhPT0gaSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSBmbWF4ZihcbiAgICAgICAgICAgICAgbGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSArIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuZEluZGV4ID0gaWk7XG4gICAgICAgIGxpbmVIZWlnaHQgKz0gY3Jvc3NEaW1MZWFkO1xuXG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGVuZEluZGV4OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50QWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBsaW5lSGVpZ2h0IC0gZ2V0VHJhaWxpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykgLSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICB2YXIvKmZsb2F0Ki8gY2hpbGRIZWlnaHQgPSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgKGxpbmVIZWlnaHQgLSBjaGlsZEhlaWdodCkgLyAyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICAgIC8vIFRPRE8ocHJlbmF1eCk6IENvcnJlY3RseSBzZXQgdGhlIGhlaWdodCBvZiBpdGVtcyB3aXRoIHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGF1dG8pIGNyb3NzQXhpcyBkaW1lbnNpb24uXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExlYWQgKz0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBuZWVkc01haW5UcmFpbGluZ1BvcyA9IGZhbHNlO1xuICAgIHZhci8qYm9vbCovIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZnkgYSB3aWR0aCBvciBoZWlnaHQsIGFuZCBpdCBoYXMgbm90IGJlZW4gc2V0XG4gICAgLy8gYnkgdGhlIGNvbnRhaW5lciwgdGhlbiB3ZSBzZXQgaXQgdmlhIHRoZSBjaGlsZHJlbi5cbiAgICBpZiAoIWlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIFdlJ3JlIG1pc3NpbmcgdGhlIGxhc3QgcGFkZGluZyBhdCB0aGlzIHBvaW50IHRvIGdldCB0aGUgZmluYWxcbiAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBtYWluQXhpcywgbGluZXNNYWluRGltICsgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKSksXG4gICAgICAgIC8vIFdlIGNhbiBuZXZlciBhc3NpZ24gYSB3aWR0aCBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlcnNcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluXG4gICAgICApO1xuXG4gICAgICBpZiAobWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNNYWluVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGxpbmVzQ3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgKTtcblxuICAgICAgaWYgKGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBGPiBTZXQgdHJhaWxpbmcgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zIHx8IG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBHPiBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzXG4gICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBmaXJzdEFic29sdXRlQ2hpbGQ7XG4gICAgd2hpbGUgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3JcbiAgICAgIC8vIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aCBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgIWlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbbGVhZGluZ1theGlzXV0gPVxuICAgICAgICAgICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQ7XG4gICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGUobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbikge1xuICAgIG5vZGUuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblxuICAgIHZhciBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbiB8fCBDU1NfRElSRUNUSU9OX0xUUjtcbiAgICB2YXIgc2tpcExheW91dCA9XG4gICAgICAhbm9kZS5pc0RpcnR5ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPT09IG5vZGUubGF5b3V0LmhlaWdodCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID09PSBub2RlLmxheW91dC53aWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID09PSBwYXJlbnRNYXhXaWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uO1xuXG4gICAgaWYgKHNraXBMYXlvdXQpIHtcbiAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbm9kZS5sYXN0TGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXN0TGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGF5b3V0LnRvcCA9IG5vZGUubGFzdExheW91dC50b3A7XG4gICAgICBub2RlLmxheW91dC5sZWZ0ID0gbm9kZS5sYXN0TGF5b3V0LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbm9kZS5sYXN0TGF5b3V0KSB7XG4gICAgICAgIG5vZGUubGFzdExheW91dCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAgIC8vIFJlc2V0IGNoaWxkIGxheW91dHNcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBjaGlsZC5sYXlvdXQud2lkdGggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC5oZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC50b3AgPSAwO1xuICAgICAgICBjaGlsZC5sYXlvdXQubGVmdCA9IDA7XG4gICAgICB9KTtcblxuICAgICAgbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbik7XG5cbiAgICAgIG5vZGUubGFzdExheW91dC53aWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC50b3AgPSBub2RlLmxheW91dC50b3A7XG4gICAgICBub2RlLmxhc3RMYXlvdXQubGVmdCA9IG5vZGUubGF5b3V0LmxlZnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsYXlvdXROb2RlSW1wbDogbGF5b3V0Tm9kZUltcGwsXG4gICAgY29tcHV0ZUxheW91dDogbGF5b3V0Tm9kZSxcbiAgICBmaWxsTm9kZXM6IGZpbGxOb2Rlc1xuICB9O1xufSkoKTtcblxuLy8gVGhpcyBtb2R1bGUgZXhwb3J0IGlzIG9ubHkgdXNlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVuaXQgdGVzdGluZyB0aGlzIGZpbGUuIFdoZW5cbi8vIHRoZSBsaWJyYXJ5IGlzIHBhY2thZ2VkIHRoaXMgZmlsZSBpcyBpbmNsdWRlZCB3aXRoaW4gY3NzLWxheW91dC5qcyB3aGljaCBmb3Jtc1xuLy8gdGhlIHB1YmxpYyBBUEkuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcHV0ZUxheW91dDtcbn1cblxuXG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgIC8vIGRpc2FibGluZyBFU0xpbnQgYmVjYXVzZSB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBhYm92ZSBpbmNsdWRlXG4gICAgY29tcHV0ZUxheW91dC5maWxsTm9kZXMobm9kZSk7XG4gICAgY29tcHV0ZUxheW91dC5jb21wdXRlTGF5b3V0KG5vZGUpO1xuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9O1xufSkpO1xuIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG5tb2R1bGUuZXhwb3J0cy5UaW55RW1pdHRlciA9IEU7XG4iLCJpbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vaW1hZ2VNYW5hZ2VyJztcbmNvbnN0IEVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcblxuaW50ZXJmYWNlIENoYXJEYXRhIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHc6IG51bWJlcjtcbiAgaDogbnVtYmVyO1xuICBvZmZYOiBudW1iZXI7XG4gIG9mZlk6IG51bWJlcjtcbiAgeGFkdmFuY2U6IG51bWJlcjtcbiAga2VybmluZzogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbn1cblxuaW50ZXJmYWNlIENoYXJzIHtcbiAgW2tleTogc3RyaW5nXTogQ2hhckRhdGE7XG59XG5cbnR5cGUgQ29uZmlnTGluZURhdGEgPSB7XG4gIGxpbmU6IHN0cmluZ1tdO1xuICBpbmRleDogbnVtYmVyO1xufTtcblxuXG4vKipcbiAqIGh0dHA6Ly93d3cuYW5nZWxjb2RlLmNvbS9wcm9kdWN0cy9ibWZvbnQvZG9jL2ZpbGVfZm9ybWF0Lmh0bWxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0TWFwRm9udCB7XG4gIHByaXZhdGUgY29uZmlnOiBzdHJpbmc7XG4gIHB1YmxpYyBldmVudDogYW55O1xuXG4gIHB1YmxpYyBjaGFyczogQ2hhcnM7XG5cbiAgcHVibGljIHJlYWR5ID0gZmFsc2U7XG4gIHB1YmxpYyB0ZXh0dXJlOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcbiAgcHVibGljIGxpbmVIZWlnaHQ/OiBudW1iZXI7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcblxuXG4gIC8vIHBvb2znmoTlrp7njrDmlL7liLDnsbvph4zpnaLlrp7njrDlubbkuI3kvJjpm4XvvIzlhYjljrvmjonkuoZcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmNoYXJzID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xuICAgIHRoaXMuZXZlbnQgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy50ZXh0dXJlID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZShzcmMsICh0ZXh0dXJlLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5ldmVudC5lbWl0KCd0ZXh0X19sb2FkX19kb25lJyk7XG4gICAgfSk7XG4gIH1cblxuICBwYXJzZUNvbmZpZyhmbnRUZXh0OiBzdHJpbmcpIHtcbiAgICBmbnRUZXh0ID0gZm50VGV4dC5zcGxpdCgnXFxyXFxuJykuam9pbignXFxuJyk7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gZm50VGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgbGluZXNQYXJzZWQ6IHN0cmluZ1tdW10gPSBsaW5lcy5tYXAobGluZSA9PiBsaW5lLnRyaW0oKS5zcGxpdCgnICcpKTtcblxuICAgIGNvbnN0IGNoYXJzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjaGFycycpO1xuICAgIGNvbnN0IGNoYXJzQ291bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhcnNMaW5lLmxpbmUsICdjb3VudCcpO1xuXG4gICAgY29uc3QgY29tbW9uTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjb21tb24nKTtcbiAgICB0aGlzLmxpbmVIZWlnaHQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbW1vbkxpbmUubGluZSwgJ2xpbmVIZWlnaHQnKTtcblxuICAgIGNvbnN0IGluZm9MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2luZm8nKTtcbiAgICB0aGlzLmZvbnRTaXplID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShpbmZvTGluZS5saW5lLCAnc2l6ZScpO1xuXG4gICAgLy8g5o6l5Y24IGtlcm5pbmdzXG4gICAgY29uc3Qga2VybmluZ3NMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2tlcm5pbmdzJyk7XG4gICAgbGV0IGtlcm5pbmdzQ291bnQgPSAwO1xuICAgIGxldCBrZXJuaW5nc1N0YXJ0ID0gLTE7XG4gICAgaWYgKGtlcm5pbmdzTGluZS5saW5lKSB7XG4gICAgICBrZXJuaW5nc0NvdW50ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShrZXJuaW5nc0xpbmUubGluZSwgJ2NvdW50Jyk7XG4gICAgICBrZXJuaW5nc1N0YXJ0ID0ga2VybmluZ3NMaW5lLmluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFyczogQ2hhcnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBjaGFyc0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXJUZXh0OiBzdHJpbmcgPSBsaW5lc1tpXTtcbiAgICAgIGNvbnN0IGxldHRlcjogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaWQnKSk7XG5cbiAgICAgIGNvbnN0IGM6IENoYXJEYXRhID0ge1xuICAgICAgICB4OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneCcpLFxuICAgICAgICB5OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneScpLFxuICAgICAgICB3OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnd2lkdGgnKSxcbiAgICAgICAgaDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2hlaWdodCcpLFxuICAgICAgICBvZmZYOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneG9mZnNldCcpLFxuICAgICAgICBvZmZZOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneW9mZnNldCcpLFxuICAgICAgICB4YWR2YW5jZTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hhZHZhbmNlJyksXG4gICAgICAgIGtlcm5pbmc6IHt9XG4gICAgICB9O1xuICAgICAgY2hhcnNbbGV0dGVyXSA9IGM7XG4gICAgfVxuXG4gICAgLy8gcGFyc2Uga2VybmluZ3NcbiAgICBpZiAoa2VybmluZ3NDb3VudCkge1xuICAgICAgZm9yIChsZXQgaSA9IGtlcm5pbmdzU3RhcnQ7IGkgPD0ga2VybmluZ3NTdGFydCArIGtlcm5pbmdzQ291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuICAgICAgICBjb25zdCBmaXJzdDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdmaXJzdCcpKTtcbiAgICAgICAgY29uc3Qgc2Vjb25kOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ3NlY29uZCcpKTtcbiAgICAgICAgY29uc3QgYW1vdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdhbW91bnQnKTtcblxuICAgICAgICBpZiAoY2hhcnNbc2Vjb25kXSkge1xuICAgICAgICAgIGNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH1cblxuICBnZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdLCBsaW5lTmFtZSA9ICcnKTogQ29uZmlnTGluZURhdGEge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsaW5lOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IGxpbmVzUGFyc2VkLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW06IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG5cbiAgICAgIGlmIChpdGVtWzBdID09PSBsaW5lTmFtZSkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGxpbmUgPSBpdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lLFxuICAgICAgaW5kZXgsXG4gICAgfTtcbiAgfVxuXG4gIGdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbmZpZ1RleHQ6IHN0cmluZ1tdIHwgc3RyaW5nLCBrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0TGlzdCA9IEFycmF5LmlzQXJyYXkoY29uZmlnVGV4dCkgPyBjb25maWdUZXh0IDogY29uZmlnVGV4dC5zcGxpdCgnICcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBpdGVtQ29uZmlnVGV4dExpc3Q7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbUNvbmZpZ1RleHQgPSBpdGVtQ29uZmlnVGV4dExpc3RbaV07XG4gICAgICBpZiAoa2V5ID09PSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoMCwga2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoa2V5Lmxlbmd0aCArIDEpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iLCJpbnRlcmZhY2UgRGVidWdJbmZvSXRlbSB7XG4gIHN0YXJ0OiBudW1iZXI7XG4gIGlzSW5uZXI6IGJvb2xlYW47XG4gIGVuZD86IG51bWJlcjtcbiAgY29zdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVidWdJbmZvIHtcbiAgcHVibGljIGluZm86IHsgW2tleTogc3RyaW5nXTogRGVidWdJbmZvSXRlbSB9ID0ge307XG4gIHB1YmxpYyB0b3RhbFN0YXJ0OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgdG90YWxDb3N0OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHN0YXJ0KG5hbWU6IHN0cmluZywgaXNJbm5lcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMudG90YWxTdGFydCA9PT0gMCkge1xuICAgICAgdGhpcy50b3RhbFN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICB0aGlzLmluZm9bbmFtZV0gPSB7XG4gICAgICBzdGFydDogRGF0ZS5ub3coKSxcbiAgICAgIGlzSW5uZXIsXG4gICAgfTtcbiAgfVxuXG4gIGVuZChuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pbmZvW25hbWVdKSB7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5jb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMuaW5mb1tuYW1lXS5zdGFydDtcbiAgICAgIHRoaXMudG90YWxDb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMudG90YWxTdGFydDtcbiAgICB9XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmluZm8gPSB7fTtcbiAgICB0aGlzLnRvdGFsU3RhcnQgPSAwO1xuICAgIHRoaXMudG90YWxDb3N0ID0gMDtcbiAgfVxuXG4gIGxvZyhuZWVkSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgbGV0IGxvZ0luZm8gPSAnTGF5b3V0IGRlYnVnIGluZm86IFxcbic7XG4gICAgbG9nSW5mbyArPSBPYmplY3Qua2V5cyh0aGlzLmluZm8pLnJlZHVjZSgoc3VtLCBjdXJyKSA9PiB7XG4gICAgICBpZiAodGhpcy5pbmZvW2N1cnJdLmlzSW5uZXIgJiYgIW5lZWRJbm5lcikge1xuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgICAgc3VtICs9IGAke2N1cnJ9OiAke3RoaXMuaW5mb1tjdXJyXS5jb3N0fVxcbmA7XG4gICAgICByZXR1cm4gc3VtO1xuICAgIH0sICcnKTtcblxuICAgIGxvZ0luZm8gKz0gYHRvdGFsQ29zdDogJHt0aGlzLnRvdGFsQ29zdH1cXG5gO1xuXG4gICAgcmV0dXJuIGxvZ0luZm87XG4gIH1cbn1cbiIsImltcG9ydCBQb29sIGZyb20gJy4vcG9vbCc7XG5pbXBvcnQgeyBub25lIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52JztcblxudHlwZSBDYWxsYmFjayA9IChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIGZyb21DYWNoZTogYm9vbGVhbikgPT4gdm9pZDtcbmludGVyZmFjZSBJbWFnZUNhY2hlIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBsb2FkRG9uZTogYm9vbGVhbjtcbiAgb25sb2FkY2JrczogQ2FsbGJhY2tbXTtcbiAgb25lcnJvcmNia3M6IENhbGxiYWNrW107XG59XG5cbmNsYXNzIEltYWdlTWFuYWdlciB7XG4gIHByaXZhdGUgaW1nUG9vbCA9IG5ldyBQb29sPEltYWdlQ2FjaGU+KCdpbWdQb29sJyk7XG4gIFxuICBnZXRSZXMoc3JjOiBzdHJpbmcpOiBJbWFnZUNhY2hlIHtcbiAgICByZXR1cm4gdGhpcy5pbWdQb29sLmdldChzcmMpO1xuICB9XG5cbiAgbG9hZEltYWdlUHJvbWlzZShzcmM6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5sb2FkSW1hZ2Uoc3JjLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlKHNyYzogc3RyaW5nLCBzdWNjZXNzOiBDYWxsYmFjayA9IG5vbmUsIGZhaWw6IENhbGxiYWNrID0gbm9uZSk6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoIXNyYykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuZ2V0UmVzKHNyYyk7XG5cbiAgICAvLyDlm77niYflt7Lnu4/ooqvliqDovb3ov4fvvIznm7TmjqXov5Tlm57lm77niYflubbkuJTmiafooYzlm57osINcbiAgICBpZiAoY2FjaGUgJiYgY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIGltZyA9IGNhY2hlLmltZztcbiAgICAgIHN1Y2Nlc3MoaW1nLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGNhY2hlICYmICFjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgLy8g5Zu+54mH5q2j5Zyo5Yqg6L296L+H56iL5Lit77yM6L+U5Zue5Zu+54mH5bm25LiU562J5b6F5Zu+54mH5Yqg6L295a6M5oiQ5omn6KGM5Zue6LCDXG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG5cbiAgICAgIGNhY2hlLm9ubG9hZGNia3MucHVzaChzdWNjZXNzKTtcbiAgICAgIGNhY2hlLm9uZXJyb3JjYmtzLnB1c2goZmFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWIm+W7uuWbvueJh++8jOWwhuWbnuiwg+WHveaVsOaOqOWFpeWbnuiwg+WHveaVsOagiFxuICAgICAgaW1nID0gZW52LmNyZWF0ZUltYWdlKCkgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgIGNvbnN0IG5ld0NhY2hlID0ge1xuICAgICAgICBpbWcsXG4gICAgICAgIGxvYWREb25lOiBmYWxzZSxcbiAgICAgICAgb25sb2FkY2JrczogW3N1Y2Nlc3NdLFxuICAgICAgICBvbmVycm9yY2JrczogW2ZhaWxdLFxuICAgICAgfVxuICAgICBcbiAgICAgIHRoaXMuaW1nUG9vbC5zZXQoc3JjLCBuZXdDYWNoZSk7XG5cbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLmxvYWREb25lID0gdHJ1ZTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcuc3JjID0gc3JjO1xuICAgIH1cblxuICAgIHJldHVybiBpbWc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlTWFuYWdlcigpO1xuIiwiY29uc3QgcG9vbHM6IFBvb2w8YW55PltdID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvb2w8VD4ge1xuICBwdWJsaWMgbmFtZSA9ICdwb29sJ1xuICBwdWJsaWMgcG9vbDogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihuYW1lID0gJ3Bvb2wnKSB7XG4gICAgY29uc3QgY3VyciA9IHBvb2xzLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIHJldHVybiBjdXJyO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wb29sID0ge307XG5cbiAgICBwb29scy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKTogVCB7XG4gICAgcmV0dXJuIHRoaXMucG9vbFtrZXldO1xuICB9XG5cbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogVCkge1xuICAgIHRoaXMucG9vbFtrZXldID0gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgfVxuXG4gIGdldExpc3QoKTogVFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLnBvb2wpO1xuICB9XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3Qge1xuICBwdWJsaWMgd2lkdGggPSAwO1xuICBwdWJsaWMgaGVpZ2h0ID0gMDtcbiAgcHVibGljIGxlZnQgPSAwO1xuICBwdWJsaWMgcmlnaHQgPSAwO1xuICBwdWJsaWMgdG9wID0gMDtcbiAgcHVibGljIGJvdHRvbSA9IDA7XG5cbiAgY29uc3RydWN0b3IobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMuc2V0KGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBzZXQobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgdGhpcy5yaWdodCA9IHRoaXMubGVmdCArIHRoaXMud2lkdGg7XG4gICAgdGhpcy5ib3R0b20gPSB0aGlzLnRvcCArIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIOWIpOaWreS4pOS4quefqeW9ouaYr+WQpuebuOS6pFxuICAgKiDljp/nkIblj6/op4E6IGh0dHBzOi8vemh1YW5sYW4uemhpaHUuY29tL3AvMjk3MDQwNjRcbiAgICovXG4gIGludGVyc2VjdHMocmVjdDogUmVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKHRoaXMucmlnaHQgPCByZWN0LmxlZnQgfHwgcmVjdC5yaWdodCA8IHRoaXMubGVmdCB8fCB0aGlzLmJvdHRvbSA8IHJlY3QudG9wIHx8IHJlY3QuYm90dG9tIDwgdGhpcy50b3ApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrZXIge1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBhbmltYXRpb25JZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBjYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBpbm5lckNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIG5leHRDYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBpbm5lck5leHRDYnM6IENhbGxiYWNrW10gPSBbXTtcblxuICBwcml2YXRlIGxhc3RUaW1lITogbnVtYmVyO1xuXG4gIHByaXZhdGUgdXBkYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgIHRoaXMubGFzdFRpbWUgPSB0aW1lO1xuICAgIC8vIGNvbnNvbGUubG9nKGR0KVxuICAgIC8vIOS8mOWFiOaJp+ihjOS4muWKoeeahHRpY2tlcuWbnuiwg++8jOWboOS4uuacieWPr+iDveS8muinpuWPkXJlZmxvd1xuICAgIHRoaXMuY2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoZGVsdGFUaW1lKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW5uZXJDYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaW5uZXJOZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMuZm9yRWFjaChjYiA9PiBjYihkZWx0YVRpbWUpKTtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmV4dENicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubmV4dENicy5mb3JFYWNoKGNiID0+IGNiKGRlbHRhVGltZSkpO1xuXG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmNvdW50ICs9IDE7XG4gICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gIH1cblxuICBjYW5jZWxJZk5lZWQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgIT09IG51bGwpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uSWQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkKGNiOiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLmNicy5pbmRleE9mKGNiKSA9PT0gLTEpIHtcbiAgICAgIGlzSW5uZXIgPyB0aGlzLmlubmVyQ2JzLnB1c2goY2IpIDogdGhpcy5jYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgbmV4dChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlzSW5uZXIgPyB0aGlzLmlubmVyTmV4dENicy5wdXNoKGNiKSA6IHRoaXMubmV4dENicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVJbm5lcigpIHtcbiAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgfVxuXG4gIHJlbW92ZShjYj86IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAoY2IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jYnMgPSBbXTtcbiAgICAgIHRoaXMuaW5uZXJDYnMgPSBbXTtcbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmICh0aGlzLmNicy5pbmRleE9mKGNiKSA+IC0xIHx8IHRoaXMuaW5uZXJDYnMuaW5kZXhPZihjYikgPiAtMSkpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBpc0lubmVyID8gdGhpcy5pbm5lckNicyA6IHRoaXMuY2JzO1xuICAgICAgbGlzdC5zcGxpY2UodGhpcy5jYnMuaW5kZXhPZihjYiksIDEpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jYnMubGVuZ3RoICYmICF0aGlzLmlubmVyQ2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy5sYXN0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbklkID09PSBudWxsICYmICh0aGlzLmNicy5sZW5ndGggfHwgdGhpcy5pbm5lckNicy5sZW5ndGgpKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vbmUoKSB7IH1cbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIFRvdWNoTXNnIHtcbiAgdG91Y2hzdGFydD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIHRvdWNoZW5kPzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbn1cblxuLyoqXG4gKiDmoLnmja7op6bmkbjml7bplb/lkozop6bmkbjkvY3nva7lj5jljJbmnaXliKTmlq3mmK/lkKblsZ7kuo7ngrnlh7vkuovku7ZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpY2sodG91Y2hNc2c6IFRvdWNoTXNnKSB7XG4gIGNvbnN0IHN0YXJ0ID0gdG91Y2hNc2cudG91Y2hzdGFydDtcbiAgY29uc3QgZW5kID0gdG91Y2hNc2cudG91Y2hlbmQ7XG5cbiAgaWYgKCFzdGFydFxuICAgIHx8ICFlbmRcbiAgICB8fCAhc3RhcnQudGltZVN0YW1wXG4gICAgfHwgIWVuZC50aW1lU3RhbXBcbiAgICB8fCBzdGFydC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgc3RhcnQucGFnZVkgPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VZID09PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRQb3NYID0gc3RhcnQucGFnZVg7XG4gIGNvbnN0IHN0YXJ0UG9zWSA9IHN0YXJ0LnBhZ2VZO1xuXG4gIGNvbnN0IGVuZFBvc1ggPSBlbmQucGFnZVg7XG4gIGNvbnN0IGVuZFBvc1kgPSBlbmQucGFnZVk7XG5cbiAgY29uc3QgdG91Y2hUaW1lcyA9IGVuZC50aW1lU3RhbXAgLSBzdGFydC50aW1lU3RhbXA7XG5cbiAgcmV0dXJuICEhKE1hdGguYWJzKGVuZFBvc1kgLSBzdGFydFBvc1kpIDwgMzBcbiAgICAmJiBNYXRoLmFicyhlbmRQb3NYIC0gc3RhcnRQb3NYKSA8IDMwXG4gICAgJiYgdG91Y2hUaW1lcyA8IDMwMCk7XG59XG5cbmV4cG9ydCBlbnVtIFNUQVRFIHtcbiAgVU5JTklUID0gJ1VOSU5JVCcsXG4gIElOSVRFRCA9ICdJTklURUQnLFxuICBSRU5ERVJFRCA9ICdSRU5ERVJFRCcsXG4gIENMRUFSID0gJ0NMRUFSJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNhbnZhcyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICBjdHggJiYgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VG91Y2hBcnJheSh0b3VjaGVzOiBHYW1lVG91Y2hbXSkge1xuICByZXR1cm4gdG91Y2hlcy5tYXAodG91Y2ggPT4gKHtcbiAgICBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLFxuICAgIHBhZ2VYOiB0b3VjaC5wYWdlWCxcbiAgICBwYWdlWTogdG91Y2gucGFnZVksXG4gICAgY2xpZW50WDogdG91Y2guY2xpZW50WCxcbiAgICBjbGllbnRZOiB0b3VjaC5jbGllbnRZLFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dhbWVUb3VjaEV2ZW50KGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCk6IGUgaXMgR2FtZVRvdWNoRXZlbnQge1xuICByZXR1cm4gJ3RvdWNoZXMnIGluIGU7XG59XG5cbi8qKlxuICog5Y+W5pyA5bCP5YC85ZKM5pyA5aSn5YC85LmL6Ze055qE5Yy66Ze06ZmQ5a6a5YC8XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIOmcgOimgeiiq+WkhOeQhueahOaVsOWtl1xuICogQHBhcmFtIHtudW1iZXJ9IG1pbiDmnIDlsI/lgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgg5pyA5aSn5YC8XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChudW1iZXI6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obnVtYmVyLCBtYXgpKTtcbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBFbGVtZW50LCBCdXR0b24gfSBmcm9tICcuLi9jb21wb25lbnRzL2luZGV4JztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4uL2NvbXBvbmVudHMvc3R5bGUnO1xuaW1wb3J0IHsgSUxheW91dCwgSUxheW91dEJveCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWxlbWVudHMnO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmludGVyZmFjZSBUcmVlTm9kZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXR0cjogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgY2hpbGRyZW46IFRyZWVOb2RlW107XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG4gIGJ1dHRvbjogQnV0dG9uLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50KG5hbWU6IHN0cmluZywgQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yKSB7XG4gIGNvbnN0cnVjdG9yTWFwW25hbWVdID0gQ29uc3RydWN0b3I7XG59XG5cbmZ1bmN0aW9uIGlzUGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgcmV0dXJuIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJyAmJiAvXFxkKyg/OlxcLlxcZCspPyUvLnRlc3QoZGF0YSk7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlciwgcGFyZW50RGF0YTogbnVtYmVyKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgY29uc3QgbWF0Y2hEYXRhID0gZGF0YS5tYXRjaCgvKFxcZCsoPzpcXC5cXGQrKT8pJS8pO1xuICBpZiAobWF0Y2hEYXRhICYmIG1hdGNoRGF0YVsxXSkge1xuICAgIHJldHVybiBwYXJlbnREYXRhICogcGFyc2VGbG9hdChtYXRjaERhdGFbMV0pICogMC4wMTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlKG5vZGU6IFRyZWVOb2RlLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgcGFyZW50PzogUmVjb3JkPHN0cmluZywgYW55Pikge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW25vZGUubmFtZV07XG5cbiAgaWYgKCFDb25zdHJ1Y3Rvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdIOS4jeaUr+aMgee7hOS7tiAke25vZGUubmFtZX1gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gbm9kZS5jaGlsZHJlbiB8fCBbXTtcblxuICBjb25zdCBhdHRyID0gbm9kZS5hdHRyIHx8IHt9O1xuICBjb25zdCBkYXRhc2V0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGNvbnN0IGlkID0gYXR0ci5pZCB8fCAnJztcblxuICBjb25zdCBhcmdzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0gT2JqZWN0LmtleXMoYXR0cikucmVkdWNlKChvYmosIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGF0dHJba2V5XTtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGtleTtcblxuICAgICAgaWYgKGtleSA9PT0gJ2lkJykge1xuICAgICAgICBvYmouc3R5bGUgPSBPYmplY3QuYXNzaWduKG9iai5zdHlsZSB8fCB7fSwgc3R5bGVbaWRdIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAoa2V5ID09PSAnY2xhc3MnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IHZhbHVlLnNwbGl0KC9cXHMrLykucmVkdWNlKChyZXMsIG9uZUNsYXNzKSA9PiBPYmplY3QuYXNzaWduKHJlcywgc3R5bGVbb25lQ2xhc3NdKSwgb2JqLnN0eWxlIHx8IHt9KTtcblxuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgPT09ICd0cnVlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHZhbHVlID09PSAnZmFsc2UnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXR0cmlidXRlLnN0YXJ0c1dpdGgoJ2RhdGEtJykpIHtcbiAgICAgICAgY29uc3QgZGF0YUtleSA9IGF0dHJpYnV0ZS5zdWJzdHJpbmcoNSk7XG5cbiAgICAgICAgZGF0YXNldFtkYXRhS2V5XSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBvYmouZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfSwge30gYXMgUmVjb3JkPHN0cmluZywgYW55Pik7XG5cbiAgLy8g55So5LqO5ZCO57ut5YWD57Sg5p+l6K+iXG4gIGFyZ3MuaWROYW1lID0gaWQ7XG4gIC8vIEB0cy1pZ25vcmVcbiAgdGhpcy5lbGVDb3VudCArPSAxO1xuICAvLyBAdHMtaWdub3JlXG4gIGFyZ3MuaWQgPSB0aGlzLmVsZUNvdW50O1xuICBhcmdzLmNsYXNzTmFtZSA9IGF0dHIuY2xhc3MgfHwgJyc7XG5cbiAgY29uc3QgdGhpc1N0eWxlID0gYXJncy5zdHlsZTtcbiAgaWYgKHRoaXNTdHlsZSkge1xuICAgIGxldCBwYXJlbnRTdHlsZTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IHBhcmVudC5zdHlsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSBlbnYuZ2V0Um9vdENhbnZhc1NpemUoKTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpc1N0eWxlLm9wYWNpdHkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFN0eWxlLm9wYWNpdHkgIT09IDEgJiYgdHlwZW9mIHBhcmVudFN0eWxlLm9wYWNpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IHBhcmVudFN0eWxlLm9wYWNpdHkgKiB0aGlzU3R5bGUub3BhY2l0eTtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhhcmdzKTtcbiAgY29uc3QgZWxlbWVudCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbGVtZW50LnJvb3QgPSB0aGlzO1xuICBlbGVtZW50LnRhZ05hbWUgPSBub2RlLm5hbWU7XG5cbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlOiBUcmVlTm9kZSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjaGlsZEVsZW1lbnQgPSBjcmVhdGUuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIHN0eWxlLCBhcmdzKTtcblxuICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuYWRkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuKGNoaWxkcmVuOiBFbGVtZW50W10sIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlciA9IHRydWUpIHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAvLyBjaGlsZC5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICBjaGlsZC5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2hpbGQuaW5zZXJ0KGNvbnRleHQsIG5lZWRSZW5kZXIpO1xuXG4gICAgLy8gU2Nyb2xsVmlld+eahOWtkOiKgueCuea4suafk+S6pOe7mVNjcm9sbFZpZXfoh6rlt7HvvIzkuI3mlK/mjIHltYzlpZdTY3JvbGxWaWV3XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBjb250ZXh0LCAgY2hpbGQudHlwZSA9PT0gJ1Njcm9sbFZpZXcnID8gZmFsc2UgOiBuZWVkUmVuZGVyKTtcbiAgfSk7XG59XG5cbi8qKlxuICog5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXRDaGlsZHJlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5sYXlvdXRCb3ggPSBjaGlsZC5sYXlvdXRCb3ggfHwge307XG5cbiAgICBbJ2xlZnQnLCAndG9wJywgJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGQubGF5b3V0Qm94W3Byb3AgYXMga2V5b2YgSUxheW91dEJveF0gPSBjaGlsZC5sYXlvdXQ/Lltwcm9wIGFzIGtleW9mIElMYXlvdXRdIGFzIG51bWJlcjtcbiAgICB9KTtcblxuICAgIGlmIChjaGlsZC5wYXJlbnQpIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVggfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVkgfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9XG5cbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZO1xuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVg7XG5cblxuICAgIGxheW91dENoaWxkcmVuKGNoaWxkKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vbmUoKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlVHJlZShlbGVtZW50OiBFbGVtZW50LCBjYWxsYmFjazogQ2FsbGJhY2sgPSBub25lKSB7XG4gIGNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpdGVyYXRlVHJlZShjaGlsZCwgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRDaGlsZHJlbiA9IChjaGlsZHJlbjogRWxlbWVudFtdKSA9PiB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgaWYgKGNoaWxkLnR5cGUgIT09ICdTY3JvbGxWaWV3Jykge1xuICAgICAgcmVwYWludENoaWxkcmVuKGNoaWxkLmNoaWxkcmVuKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRUcmVlID0gKHRyZWU6IEVsZW1lbnQpID0+IHtcbiAgdHJlZS5yZXBhaW50KCk7XG5cbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIHJlcGFpbnRUcmVlKGNoaWxkKTtcbiAgfSk7XG59O1xuXG5pbnRlcmZhY2UgRWxlbWVudEFyZ3Mge1xuICBzdHlsZTogb2JqZWN0O1xuICBpZE5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGRhdGFzZXQ6IG9iamVjdDtcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQgZXh0ZW5kcyBFbGVtZW50Pihyb290OiBULCBlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSwgcGFyZW50PzogRWxlbWVudCkge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW2VsZW1lbnQudGFnTmFtZSBhcyBzdHJpbmddO1xuICAvLyBAdHMtaWdub3JlXG4gIHJvb3QuZWxlQ291bnQgKz0gMTtcblxuICBjb25zdCBhcmdzOiBFbGVtZW50QXJncyA9IHtcbiAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5zdHlsZSksXG4gICAgaWROYW1lOiBlbGVtZW50LmlkTmFtZSxcbiAgICBjbGFzc05hbWU6IGVsZW1lbnQuY2xhc3NOYW1lLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogcm9vdC5lbGVDb3VudCxcbiAgICBkYXRhc2V0OiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LmRhdGFzZXQpLFxuICAgIG5hbWU6IGVsZW1lbnQudGFnTmFtZSxcbiAgfTtcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgYXJncy5zcmMgPSBlbGVtZW50LnNyYztcbiAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgVGV4dCB8fCBlbGVtZW50IGluc3RhbmNlb2YgQml0TWFwVGV4dCkge1xuICAgIGFyZ3MudmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgY29uc3QgbmV3RWxlbWVuZXQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIG5ld0VsZW1lbmV0LnJvb3QgPSByb290O1xuICAvLyBAdHMtaWdub3JlXG4gIG5ld0VsZW1lbmV0Lmluc2VydChyb290LnJlbmRlckNvbnRleHQsIGZhbHNlKTtcbiAgbmV3RWxlbWVuZXQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKTtcblxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LmFkZChuZXdFbGVtZW5ldCk7XG4gIH1cblxuICBpZiAoZGVlcCkge1xuICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNsb25lKHJvb3QsIGNoaWxkLCBkZWVwLCBuZXdFbGVtZW5ldCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3RWxlbWVuZXQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4uL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2w8Qml0TWFwRm9udD4oJ2JpdE1hcFBvb2wnKTtcblxuaW50ZXJmYWNlIElCaXRNYXBUZXh0T3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBmb250Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ0JpdE1hcFRleHQnO1xuICBwcml2YXRlIHZhbHVlc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBmb250OiBCaXRNYXBGb250O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElCaXRNYXBUZXh0T3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgdmFsdWUgPSAnJyxcbiAgICAgIGZvbnQgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIHRoaXMuZm9udCA9IGJpdE1hcFBvb2wuZ2V0KGZvbnQpO1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBNaXNzaW5nIEJpdG1hcEZvbnQgXCIke2ZvbnR9XCIsIHBsZWFzZSBpbnZva2UgQVBJIFwicmVnaXN0Qml0TWFwRm9udFwiIGJlZm9yZSB1c2luZyBcIkJpdE1hcFRleHRcImApO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5lbWl0KCdyZXBhaW50Jyk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnQucmVhZHkpIHtcbiAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvbnQuZXZlbnQub24oJ3RleHRfX2xvYWRfX2RvbmUnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRUZXh0Qm91bmRzKCkge1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7IGxldHRlclNwYWNpbmcgPSAwIH0gPSBzdHlsZTtcbiAgICBsZXQgd2lkdGggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuICAgICAgaWYgKGNmZykge1xuICAgICAgICB3aWR0aCArPSBjZmcudztcblxuICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICB3aWR0aCArPSBsZXR0ZXJTcGFjaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodDogdGhpcy5mb250LmxpbmVIZWlnaHQgfTtcbiAgfVxuXG4gIHJlbmRlclRleHQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFRleHRCb3VuZHMoKTtcbiAgICBjb25zdCBkZWZhdWx0TGluZUhlaWdodCA9IHRoaXMuZm9udC5saW5lSGVpZ2h0IGFzIG51bWJlcjtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBsZXQgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1kgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoID0gMCwgLy8g5rKh5pyJ6K6+572u6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICBoZWlnaHQgPSAwLCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIHRleHRBbGlnbiwgLy8g5paH5a2X5bem5Y+z5a+56b2Q5pa55byPXG4gICAgICB2ZXJ0aWNhbEFsaWduLFxuICAgICAgbGV0dGVyU3BhY2luZyA9IDAsXG4gICAgfSA9IHN0eWxlO1xuICAgIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAoc3R5bGUubGluZUhlaWdodCB8fCBkZWZhdWx0TGluZUhlaWdodCkgYXMgbnVtYmVyXG5cbiAgICBjb25zdCBzY2FsZVkgPSBsaW5lSGVpZ2h0IC8gZGVmYXVsdExpbmVIZWlnaHQ7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gc2NhbGVZICogYm91bmRzLndpZHRoO1xuXG4gICAgLy8g5aaC5p6c5paH5a2X55qE5riy5p+T5Yy65Z+f6auY5bqm5bCP5LqO55uS5a2Q6auY5bqm77yM6YeH55So5a+56b2Q5pa55byPXG4gICAgaWYgKGxpbmVIZWlnaHQgPCBoZWlnaHQpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnbWlkZGxlJykge1xuICAgICAgICBkcmF3WSArPSAoaGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnYm90dG9tJykge1xuICAgICAgICBkcmF3WSA9IGRyYXdZICsgaGVpZ2h0IC0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2lkdGggPiByZWFsV2lkdGgpIHtcbiAgICAgIGlmICh0ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgIGRyYXdYICs9ICh3aWR0aCAtIHJlYWxXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgZHJhd1kgKz0gKHdpZHRoIC0gcmVhbFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcblxuICAgICAgaWYgKHByZXZDaGFyQ29kZSAmJiBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdKSB7XG4gICAgICAgIGRyYXdYICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICB0aGlzLmZvbnQudGV4dHVyZSBhcyBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICAgIGNmZy54LFxuICAgICAgICAgIGNmZy55LFxuICAgICAgICAgIGNmZy53LFxuICAgICAgICAgIGNmZy5oLFxuICAgICAgICAgIGRyYXdYICsgY2ZnLm9mZlggKiBzY2FsZVkgLSBvcmlnaW5YLFxuICAgICAgICAgIGRyYXdZICsgY2ZnLm9mZlkgKiBzY2FsZVkgLSBvcmlnaW5ZLFxuICAgICAgICAgIGNmZy53ICogc2NhbGVZLFxuICAgICAgICAgIGNmZy5oICogc2NhbGVZLFxuICAgICAgICApO1xuXG4gICAgICAgIGRyYXdYICs9IChjZmcueGFkdmFuY2UgKiBzY2FsZVkgKyBsZXR0ZXJTcGFjaW5nKTtcblxuICAgICAgICBwcmV2Q2hhckNvZGUgPSBjaGFyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcclxuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XHJcblxyXG5pbnRlcmZhY2UgSUJ1dHRvblByb3BzIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcclxuICB2YWx1ZT86IHN0cmluZztcclxufVxyXG5cclxuLyoqXHJcbiAqIOaMiemSrueahOi/h+W6puexu+Wei+aemuS4vlxyXG4gKi9cclxuZW51bSBUcmFuc2l0aW9uIHtcclxuICBOT05FLFxyXG4gIENPTE9SLFxyXG4gIFNDQUxFLFxyXG4gIElNQUdFLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBWaWV3IHtcclxuICBzdGF0aWMgVHJhbnNpdGlvbiA9IFRyYW5zaXRpb247XHJcblxyXG4gIHB1YmxpYyBsYWJlbDogVmlldztcclxuXHJcbiAgY29uc3RydWN0b3Ioe1xyXG4gICAgc3R5bGUgPSB7fSxcclxuICAgIGlkTmFtZSA9ICcnLFxyXG4gICAgY2xhc3NOYW1lID0gJycsXHJcbiAgICB2YWx1ZSA9ICcnLFxyXG4gICAgZGF0YXNldCxcclxuICB9OiBJQnV0dG9uUHJvcHMpIHtcclxuICAgIGxldCBkZWZhdWx0U3R5bGUgPSB7XHJcbiAgICAgIHdpZHRoOiAzMDAsXHJcbiAgICAgIGhlaWdodDogNjAsXHJcbiAgICB9XHJcbiAgICBzdXBlcih7XHJcbiAgICAgIGlkTmFtZSxcclxuICAgICAgY2xhc3NOYW1lLFxyXG4gICAgICBzdHlsZToge1xyXG4gICAgICAgIC4uLmRlZmF1bHRTdHlsZSxcclxuICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMzNGExMjMnLFxyXG4gICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcclxuICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xyXG4gICAgICB9LFxyXG4gICAgICBkYXRhc2V0LFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5sYWJlbCA9IG5ldyBUZXh0KHtcclxuICAgICAgc3R5bGU6IHtcclxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxyXG4gICAgICAgIGZvbnRTaXplOiAzMCxcclxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICB9LFxyXG4gICAgICB2YWx1ZTogdmFsdWUgfHwgJ2J1dHRvbicsXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKHRoaXMpXHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGludGVyYWN0YWJsZUlubmVyID0gdHJ1ZTtcclxuICBcclxuICAvKipcclxuICAgKiDlvZPliY3mjInpkq7mmK/lkKblj6/kuqTkupLvvIzlpoLmnpzkuI3lj6/kuqTkupLvvIzngrnlh7vmsqHlj43lupRcclxuICAgKi9cclxuICBnZXQgaW50ZXJhY3RhYmxlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW50ZXJhY3RhYmxlSW5uZXI7XHJcbiAgfVxyXG5cclxuICBzZXQgaW50ZXJhY3RhYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5pbnRlcmFjdGFibGUgPSB2YWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHRyYW5zaXRpb25Jbm5lciA9IFRyYW5zaXRpb24uQ09MT1I7XHJcbiAgZ2V0IHRyYW5zaXRpb24oKSB7XHJcbiAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uSW5uZXI7XHJcbiAgfVxyXG4gIFxyXG4gIHNldCB0cmFuc2l0aW9uKHZhbDogVHJhbnNpdGlvbikge1xyXG4gICAgdGhpcy50cmFuc2l0aW9uSW5uZXIgPSB2YWw7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuaW50ZXJmYWNlIElDYW52YXNPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgYXV0b0NyZWF0ZUNhbnZhcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGNhbnZhc0luc3RhbmNlOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iob3B0czogSUNhbnZhc09wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgICB3aWR0aCA9IDEwMCxcbiAgICAgIGhlaWdodCA9IDEwMCxcbiAgICAgIGF1dG9DcmVhdGVDYW52YXMgPSBmYWxzZSxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeWwj+a4uOaIj+WcuuaZr+S4i++8jHNoYXJlZENhbnZhcyDlrp7kvovkuI3mlrnkvr/oh6rliqjliJvlu7rvvIzmj5Dkvpsgc2V0dGVyIOaJi+WKqOiuvue9rlxuICAgICAqL1xuICAgIGlmIChhdXRvQ3JlYXRlQ2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gZW52LmNyZWF0ZUNhbnZhcygpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS53aWR0aCA9IE51bWJlcih3aWR0aCk7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLmhlaWdodCA9IE51bWJlcihoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjYW52YXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzSW5zdGFuY2U7XG4gIH1cblxuICBzZXQgY2FudmFzKGN2czogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsKSB7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGN2cztcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5jYW52YXNJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOW8gOWni1xuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXNJbnN0YW5jZSwgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSkge1xuICAgICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5pbXBvcnQgeyBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIsIHJvdGF0ZVBhcnNlciwgcGFyc2VUcmFuc2Zvcm0gfSBmcm9tICcuL3N0eWxlUGFyc2VyJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlJZCh0cmVlOiBFbGVtZW50LCBsaXN0OiBFbGVtZW50W10gPSBbXSwgaWQ6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKGNoaWxkLmlkTmFtZSA9PT0gaWQpIHtcbiAgICAgIGxpc3QucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgZ2V0RWxlbWVudHNCeUlkKGNoaWxkLCBsaXN0LCBpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKHRyZWU6IEVsZW1lbnQsIGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgbGlzdCA9IGdldEVsZW1lbnRzQnlJZCh0cmVlLCBbXSwgaWQpO1xuXG4gIHJldHVybiBsaXN0Py5bMF0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoKGNoaWxkLmNsYXNzTmFtZUxpc3QgfHwgY2hpbGQuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLykpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2hpbGQsIGxpc3QsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuLyoqXG4gKiDlsIblvZPliY3oioLngrnnva7ohI/vvIxMYXlvdXQg55qEIHRpY2tlciDkvJrmoLnmja7ov5nkuKrmoIforrDkvY3miafooYwgcmVmbG93XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXREaXJ0eShlbGU6IEVsZW1lbnQsIHJlYXNvbj86IHN0cmluZykge1xuICAvLyBmb3IgZGVidWdcbiAgLy8gY29uc29sZS5sb2coJ1tMYXlvdXRdIHRyaWdnZXIgcmVmbG93IGNhdXNlJywgZWxlLCByZWFzb24pO1xuICBlbGUuaXNEaXJ0eSA9IHRydWU7XG4gIGxldCB7IHBhcmVudCB9ID0gZWxlO1xuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbn1cblxuLy8g5YWo5bGA5LqL5Lu2566h6YGTXG5jb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuXG5sZXQgdXVpZCA9IDA7XG5cbmNvbnN0IHRvRXZlbnROYW1lID0gKGV2ZW50OiBzdHJpbmcsIGlkOiBudW1iZXIpID0+IHtcbiAgY29uc3QgZWxlbWVudEV2ZW50ID0gW1xuICAgICdjbGljaycsXG4gICAgJ3RvdWNoc3RhcnQnLFxuICAgICd0b3VjaG1vdmUnLFxuICAgICd0b3VjaGVuZCcsXG4gICAgJ3RvdWNoY2FuY2VsJyxcbiAgXTtcblxuICBpZiAoZWxlbWVudEV2ZW50LmluZGV4T2YoZXZlbnQpICE9PSAtMSkge1xuICAgIHJldHVybiBgZWxlbWVudC0ke2lkfS0ke2V2ZW50fWA7XG4gIH1cblxuICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0Qm94IHtcbiAgbGVmdDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGFic29sdXRlWDogbnVtYmVyO1xuICBhYnNvbHV0ZVk6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVg6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVuZGVyRm9yTGF5b3V0IHtcbiAgcm90YXRlPzogbnVtYmVyOyAvLyB0cmFuc2Zvcm0gcm90YXRl6Kej5p6Q5LmL5ZCO5b6X5Yiw55qE5byn5bqm5Yi2XG4gIHNjYWxlWD86IG51bWJlcjtcbiAgc2NhbGVZPzogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMYXlvdXQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgcmlnaHQ6IG51bWJlcjtcbiAgYm90dG9tOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBjbGFzcyDlsZ7mgKfvvIzkuIDoiKznlKjkuo7mqKHmnb/mj5Lku7ZcbiAgICovXG4gIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55omA5Zyo6IqC54K55qCR55qE5qC56IqC54K577yM5oyH5ZCRIExheW91dFxuICAgKi9cbiAgcHVibGljIHJvb3Q6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLy8gcHVibGljIEVFOiBhbnk7XG5cbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhuW9k+WJjeiKgueCueaYr+WQpuW3sue7j+aJp+ihjOmUgOavgemAu+i+ke+8jOmUgOavgeS5i+WQjuWOn+WFiOeahOWKn+iDvemDveS8muW8guW4uO+8jOS4gOiIrOS4muWKoeS+p+S4jeeUqOWFs+W/g+i/meS4qlxuICAgKi9cbiAgcHVibGljIGlzRGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOexu+S8vCBXZWIg56uv5a6e546w77yM57uZ6IqC54K55oyC5LiA5Lqb6IO95aSf6K+75YaZ55qE5bGe5oCn6ZuG5ZCIXG4gICAqIOWcqCB4bWwg5Y+v5Lul6L+Z5qC35aOw5piO5bGe5oCn77yaPHZpZXcgY2xhc3M9XCJ4eHhcIiBkYXRhLWZvbz1cImJhclwiPlxuICAgKiDlnKgganMg5L6n5Y+v5Lul6L+Z5LmI6K+75YaZ5bGe5oCn77yaXG4gICAqIGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YXNldC5mb28pOyAvLyDmjqfliLblj7DovpPlh7ogXCJiYXJcIjtcbiAgICogZWxlbWVudC5kYXRhc2V0LmZvbyA9IFwiYmFyMlwiO1xuICAgKi9cbiAgcHVibGljIGRhdGFzZXQ6IElEYXRhc2V0O1xuXG4gIC8qKlxuICAgKiDoioLngrnnmoTmoLflvI/liJfooajvvIzlnKggTGF5b3V0LmluaXQg5Lya5Lyg5YWl5qC35byP6ZuG5ZCI77yM5Lya6Ieq5Yqo5oyR6YCJ5Ye66Lef6IqC54K55pyJ5YWz55qE5qC35byP57uf5LiAIG1lcmdlIOWIsCBzdHlsZSDlr7nosaHkuIpcbiAgICovXG4gIHB1YmxpYyBzdHlsZTogSVN0eWxlO1xuXG4gIC8qKlxuICAgKiDmiafooYwgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IOeahOe7k+aenOe8k+WtmO+8jOWmguaenOS4muWKoemrmOmikeiwg+eUqO+8jOWPr+S7peWHj+WwkSBHQ1xuICAgKi9cbiAgcHJpdmF0ZSByZWN0OiBSZWN0IHwgbnVsbDtcbiAgcHVibGljIGNsYXNzTmFtZUxpc3Q6IHN0cmluZ1tdIHwgbnVsbDtcbiAgcHVibGljIGxheW91dEJveDogSUxheW91dEJveDtcbiAgcHVibGljIGJhY2tncm91bmRJbWFnZTogYW55O1xuICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbFxuXG4gIC8qKlxuICAgKiDnva7ohI/moIforrDkvY3vvIznm67liY3lvZPkv67mlLnkvJrlvbHlk43luIPlsYDlsZ7mgKfnmoTml7blgJnvvIzkvJroh6rliqjnva7ohI9cbiAgICovXG4gIHB1YmxpYyBpc0RpcnR5ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIGNzcy1sYXlvdXQg6IqC54K55bGe5oCn77yM5Lia5Yqh5L6n5peg6ZyA5YWz5b+DXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOWQjeensO+8jOavlOWmglwiIEltYWdlXG4gICAqL1xuICBwdWJsaWMgdHlwZT86IHN0cmluZztcbiAgLy8gcHVibGljIGxheW91dD86IElMYXlvdXQ7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueWcqCB4bWwg55qE5qCH562+5ZCN56ew77yM5q+U5aaCIGltYWdl44CBdmlld1xuICAgKi9cbiAgcHVibGljIHRhZ05hbWU/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZTogSVN0eWxlO1xuXG4gIHByb3RlY3RlZCByZW5kZXJGb3JMYXlvdXQ6IElSZW5kZXJGb3JMYXlvdXQgPSB7fTtcblxuICBwcm90ZWN0ZWQgc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3A6IHN0cmluZywgdmFsOiBhbnkpIHtcblxuICB9XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgaWQgPSB1dWlkICs9IDEsXG4gICAgZGF0YXNldCA9IHt9LFxuICB9OiBJRWxlbWVudE9wdGlvbnMpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5pZE5hbWUgPSBpZE5hbWU7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgdGhpcy5sYXlvdXRCb3ggPSB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBhYnNvbHV0ZVg6IDAsXG4gICAgICBhYnNvbHV0ZVk6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWDogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVZOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgaWYgKHR5cGVvZiBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIoc3R5bGUuYmFja2dyb3VuZEltYWdlKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlLnRyYW5zZm9ybSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0ID0gcGFyc2VUcmFuc2Zvcm0oc3R5bGUudHJhbnNmb3JtKTtcbiAgICAgIC8vIGlmIChzdHlsZS50cmFuc2Zvcm0uaW5kZXhPZigncm90YXRlJykgPiAtMSkge1xuICAgICAgLy8gICBjb25zdCBkZWcgPSByb3RhdGVQYXJzZXIoc3R5bGUudHJhbnNmb3JtKTtcbiAgICAgIC8vICAgaWYgKGRlZykge1xuICAgICAgLy8gICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSA9IGRlZztcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfVxuICAgIH1cblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihiYWNrZ3JvdW5kSW1hZ2U6IHN0cmluZykge1xuICAgIGNvbnN0IHVybCA9IGJhY2tncm91bmRJbWFnZVBhcnNlcihiYWNrZ3JvdW5kSW1hZ2UpO1xuXG4gICAgaWYgKHVybCkge1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290ICYmIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDnm5HlkKzlsZ7mgKfnmoTlj5jljJbliKTmlq3mmK/lkKbpnIDopoHmiafooYwgcmVmbG9344CBcmVwYWludCDmk43kvZxcbiAgICog57uP6L+H5rWL6K+V77yMT2JqZWN0LmRlZmluZVByb3BlcnR5IOaYr+S4gOS4quavlOi+g+aFoueahOaWueazle+8jCDnibnliKvmmK/lsZ7mgKfmr5TovoPlpJrnmoTml7blgJlcbiAgICog5Zug5q2k5Lya5YWI5Yik5pat5piv5ZCm5pSv5oyBIFByb3h577yMaU1hYyAoUmV0aW5hIDVLLCAyNy1pbmNoLCAyMDE3Kea1i+ivlee7k+aenFxuICAgKiDmgLvlhbEgMzEyIOS4quiKgueCue+8jG9ic2VydmVTdHlsZUFuZEV2ZW505oC76ICX5pe25Li677yaXG4gICAqIFByb3h5OiAzbXNcbiAgICogT2JqZWN0LmRlZmluZVByb3BlcnR5OiAyMG1zXG4gICAqL1xuICBvYnNlcnZlU3R5bGVBbmRFdmVudCgpIHtcbiAgICBpZiAodHlwZW9mIFByb3h5ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBlbGUgPSB0aGlzO1xuICAgICAgdGhpcy5zdHlsZSA9IG5ldyBQcm94eSh0aGlzLm9yaWdpblN0eWxlLCB7XG4gICAgICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgbGV0IG9sZFZhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgb2xkVmFsICE9PSB2YWwpIHtcbiAgICAgICAgICAgIGVsZS5zdHlsZUNoYW5nZUhhbmRsZXIocHJvcCwgdmFsKTtcblxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICd0cmFuc2Zvcm0nKSB7XG4gICAgICAgICAgICAgIC8vIE9iamVjdC5hc3NpZ24oZWxlLnJlbmRlckZvckxheW91dCwgcGFyc2VUcmFuc2Zvcm0odmFsKSk7XG4gICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZS5yZW5kZXJGb3JMYXlvdXQpXG4gICAgICAgICAgICAgIGVsZS5yZW5kZXJGb3JMYXlvdXQgPSBwYXJzZVRyYW5zZm9ybSh2YWwpO1xuXG4gICAgICAgICAgICAgIGVsZS5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgc2V0RGlydHkoZWxlLCBgY2hhbmdlIHByb3AgJHtwcm9wfSBmcm9tICR7b2xkVmFsfSB0byAke3ZhbH1gKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICAgICAgICBlbGUucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICBlbGUuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlubmVyU3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0eWxlKSBhcyBJU3R5bGU7XG4gICAgICBhbGxTdHlsZXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnN0eWxlLCBrZXksIHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICgpID0+IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0sXG4gICAgICAgICAgc2V0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSkge1xuICAgICAgICAgICAgICBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdID0gdmFsdWU7XG5cbiAgICAgICAgICAgICAgaWYgKHJlZmxvd0FmZmVjdGVkU3R5bGVzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgc2V0RGlydHkodGhpcywgYGNoYW5nZSBwcm9wICR7a2V5fSB0byAke3ZhbHVlfWApO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuovku7blhpLms6HpgLvovpFcbiAgICBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoY2FuY2VsJywgJ3RvdWNoZW5kJywgJ2NsaWNrJ10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGUsIHRvdWNoTXNnKSA9PiB7XG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmVtaXQoZXZlbnROYW1lLCBlLCB0b3VjaE1zZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IHRoaXMuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56YeN57uY5o6l5Y+j77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZXBhaW50KCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCuea4suafk+aOpeWPo+WtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVuZGVyKCkgeyB9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQodGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQoaWQ6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlJZCh0aGlzLCBbXSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGNsYXNzTmFtZSDljIXlkKvnu5nlrprlj4LmlbDnmoTnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy51bkJpbmRFdmVudCgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZWApO1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoaXMgZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGlydHkoKSB7XG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG5cbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95KCkge1xuICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcblxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIC8vIHRoaXMuRUUgPSBudWxsO1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLmN0eCA9IG51bGw7XG5cbiAgICAvLyBlbGVtZW50IOWcqOeUu+W4g+S4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgIC8vIHRoaXMubGF5b3V0Qm94ID0gbnVsbDtcbiAgICAvLyB0aGlzLnN0eWxlID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZSA9ICcnO1xuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBhZGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcbiAgICAvLyBlbGVtZW50LnBhcmVudElkID0gdGhpcy5pZDtcblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbkuIDkuKroioLngrnmt7vliqDkvZzkuLrlvZPliY3oioLngrnnmoTlrZDoioLngrlcbiAgICovXG4gIGFwcGVuZENoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICB0aGlzLmFkZChlbGVtZW50KTtcblxuICAgIHNldERpcnR5KHRoaXMsIGBhcHBlbmRDaGlsZCAke2VsZW1lbnR9YCk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkIFxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBzZXREaXJ0eSh0aGlzLCBgcmVtb3ZlQ2hpbGQgJHtlbGVtZW50fWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyBlbGVtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi50aGVBcmdzOiBhbnlbXSkge1xuICAgIEVFLmVtaXQodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCAuLi50aGVBcmdzKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICog5riy5p+TIGJvcmRlciDnm7jlhbPog73lipvmir3osaHvvIzlrZDnsbvlj6/mjInpnIDosIPnlKhcbiAgICog55Sx5LqO5pSv5oyB5LqGcm90YXRl54m55oCn77yM5omA5Lul5omA5pyJ55qE5riy5p+T6YO96ZyA6KaB5pa55ZCR5YeP5Y67dHJhbnNmb3Jt55qE5Lit6Ze054K5XG4gICAqL1xuICByZW5kZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG9yaWdpblg6IG51bWJlciA9IDAsIG9yaWdpblk6IG51bWJlciA9IDApIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgcmFkaXVzID0gc3R5bGUuYm9yZGVyUmFkaXVzIHx8IDA7XG4gICAgY29uc3QgeyBib3JkZXJXaWR0aCA9IDAgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHRsciA9IHN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IHRyciA9IHN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBiYnIgPSBzdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBicnIgPSBzdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciA9ICcnIH0gPSBzdHlsZTtcbiAgICBjb25zdCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCB5ID0gYm94LmFic29sdXRlWTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGNvbnN0IGhhc1JhZGl1cyA9IHJhZGl1cyB8fCB0bHIgfHwgdHJyIHx8IGJiciB8fCBicnI7XG5cbiAgICAvLyBib3JkZXJXaWR0aCDlkowgcmFkaXVzIOmDveayoeacie+8jOS4jemcgOimgeaJp+ihjOWQjue7remAu+i+ke+8jOaPkOWNh+aAp+iDvVxuICAgIGlmICghYm9yZGVyV2lkdGggJiYgIWhhc1JhZGl1cykge1xuICAgICAgcmV0dXJuIHsgbmVlZENsaXA6IGZhbHNlLCBuZWVkU3Ryb2tlOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBib3JkZXJXaWR0aDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBib3JkZXJDb2xvcjtcblxuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgubW92ZVRvKHggKyB0bHIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSk7XG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSB0cnIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSk7XG4gICAgLy8g5Y+z5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgdHJyIC0gb3JpZ2luWSwgdHJyKTtcbiAgICAvLyDlj7PkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBicnIgLSBvcmlnaW5ZKTtcbiAgICAvLyDlj7PkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIHggKyB3aWR0aCAtIGJyciAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCBicnIpO1xuICAgIC8vIOW3puS4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIGJiciAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZKTtcbiAgICAvLyDlt6bkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCB4IC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIGJiciAtIG9yaWdpblksIGJicik7XG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4IC0gb3JpZ2luWCwgeSArIHRsciAtIG9yaWdpblkpO1xuICAgIC8vIOW3puS4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4IC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHggKyB0bHIgLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgdGxyKTtcbiAgICBjdHguY2xvc2VQYXRoKCk7XG5cbiAgICByZXR1cm4geyBuZWVkQ2xpcDogISFoYXNSYWRpdXMsIG5lZWRTdHJva2U6ICEhYm9yZGVyV2lkdGggfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr4/kuKrlrZDnsbvpg73kvJrmnInoh6rlt7HnmoTmuLLmn5PpgLvovpHvvIzkvYbku5bku6zpg73mnInkupvpgJrnlKjnmoTlpITnkIbvvIzmr5TlpoLpgI/mmI7luqbjgIHml4vovazlkoxib3JkZXLnmoTlpITnkIbvvIxiYXNlUmVuZGVyIOeUqOS6juWkhOeQhumAmueUqOeahOa4suafk+mAu+i+kVxuICAgKi9cbiAgYmFzZVJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogZHJhd1gsIGFic29sdXRlWTogZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGlmIChzdHlsZS5vcGFjaXR5ICE9PSAxKSB7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSBzdHlsZS5vcGFjaXR5IGFzIG51bWJlcjtcbiAgICB9XG5cbiAgICBsZXQgb3JpZ2luWCA9IDA7XG4gICAgbGV0IG9yaWdpblkgPSAwO1xuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcmlnaW5YID0gZHJhd1ggKyBib3gud2lkdGggLyAyO1xuICAgICAgb3JpZ2luWSA9IGRyYXdZICsgYm94LmhlaWdodCAvIDI7XG5cbiAgICAgIGN0eC50cmFuc2xhdGUob3JpZ2luWCwgb3JpZ2luWSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOivt+azqOaEj++8jOi/memHjOaaguaXtuS7heaUr+aMgeayoeacieWtkOiKgueCueeahOWFg+e0oOWPkeeUn+aXi+i9rO+8jOWmguaenOeItuiKgueCueaXi+i9rOS6huWtkOiKgueCueW5tuS4jeS8mui3n+edgOaXi+i9rFxuICAgICAqIOimgeWunueOsOeItuiKgueCueW4puWKqOWtkOiKgueCueaXi+i9rOeahOiDveWKm++8jOmcgOimgeW8leWFpeefqemYteW6k++8jOWvueS7o+eggeaUueWKqOS5n+avlOi+g+Wkp++8jOaaguaXtuS4jeWBmuaUuemAoOOAglxuICAgICAqL1xuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LnJvdGF0ZSh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gY29uc29sZS5sb2codGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlLCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCA/IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCA6IDEgLCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCA/IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSA6IDEpXG4gICAgICBjdHguc2NhbGUodGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggOiAxICwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgOiAxKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgLy8gZm9yIGNsaXBcbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgsIG9yaWdpblgsIG9yaWdpblkpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9O1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuaW50ZXJmYWNlIElJbWFnZU9wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzcmM/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgaW1nc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlID0gJ0ltYWdlJztcbiAgcHVibGljIGltZzogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUltYWdlT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgc3JjID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pbWdzcmMgPSBzcmM7XG5cbiAgICB0aGlzLmltZyA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWcsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3JjKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW1nc3JjO1xuICB9XG5cbiAgc2V0IHNyYyhuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmltZ3NyYykge1xuICAgICAgdGhpcy5pbWdzcmMgPSBuZXdWYWx1ZTtcbiAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmltZyA9IG51bGw7XG5cbiAgICB0aGlzLnNyYyA9ICcnO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmltZyB8fCAhdGhpcy5pbWc/LmNvbXBsZXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOW8gOWni1xuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg57uT5p2fXG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIHRoaXMucmVuZGVyQm9yZGVyKGN0eCwgb3JpZ2luWCwgb3JpZ2luWSk7XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG5cbiIsIlxuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCBJbWFnZSBmcm9tICcuL2ltYWdlJztcbmltcG9ydCBUZXh0IGZyb20gJy4vdGV4dCc7XG5pbXBvcnQgU2Nyb2xsVmlldyBmcm9tICcuL3Njcm9sbHZpZXcnO1xuaW1wb3J0IEJpdE1hcFRleHQgZnJvbSAnLi9iaXRtYXB0ZXh0JztcbmltcG9ydCBDYW52YXMgZnJvbSAnLi9jYW52YXMnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4vYnV0dG9uJztcblxuZXhwb3J0IHtcbiAgRWxlbWVudCxcbiAgVmlldyxcbiAgSW1hZ2UsXG4gIFRleHQsXG4gIFNjcm9sbFZpZXcsXG4gIEJpdE1hcFRleHQsXG4gIENhbnZhcyxcbiAgQnV0dG9uLFxufTtcbiIsIlxuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCB7IGNsYW1wIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5leHBvcnQgZW51bSBTY3JvbGxCYXJEaXJlY3Rpb24ge1xuICBWZXJ0aXZhbCxcbiAgSG9yaXpvbnRhbCxcbn1cblxuaW50ZXJmYWNlIElEaW1lbnNpb25zIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGNvbnRlbnRXaWR0aDogbnVtYmVyO1xuICBjb250ZW50SGVpZ2h0OiBudW1iZXI7XG5cbiAgbWF4U2Nyb2xsTGVmdDogbnVtYmVyO1xuICBtYXhTY3JvbGxUb3A6IG51bWJlcjtcblxuICBzY3JvbGxMZWZ0OiBudW1iZXI7XG4gIHNjcm9sbFRvcDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVNjcm9sbEJhck9wdGlvbnMge1xuICBkaXJlY3Rpb246IFNjcm9sbEJhckRpcmVjdGlvbjtcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB3aWR0aD86IG51bWJlcjtcbiAgZGltZW5zaW9uczogSURpbWVuc2lvbnM7XG59XG5cbi8qKlxuICog5qC55o2u5rua5Yqo5p2h55qE5bC65a+444CBU2Nyb2xsVmlldyDop4blj6Plkozmu5rliqjnqpflj6PlsLrlr7jjgIHmu5rliqjpmLLnur/kv6Hmga/noa7orqTmu5rliqjmnaHnmoTmoLflvI/kv6Hmga9cbiAqL1xuZnVuY3Rpb24gdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh3aWR0aDogbnVtYmVyLCBkaXJlY3Rpb246IFNjcm9sbEJhckRpcmVjdGlvbiwgZGltZW5zaW9uczogSURpbWVuc2lvbnMpIHtcbiAgY29uc3QgaXNWZXJ0aWNhbCA9IGRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsO1xuICBjb25zdCB7IHdpZHRoOiBzY3JvbGxXaWR0aCwgaGVpZ2h0OiBzY3JvbGxIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCB9ID0gZGltZW5zaW9ucztcblxuICByZXR1cm4ge1xuICAgIHdpZHRoOiBpc1ZlcnRpY2FsID8gd2lkdGggOiBzY3JvbGxXaWR0aCAqIChzY3JvbGxXaWR0aCAvIGNvbnRlbnRXaWR0aCksXG4gICAgaGVpZ2h0OiBpc1ZlcnRpY2FsID8gc2Nyb2xsSGVpZ2h0ICogKHNjcm9sbEhlaWdodCAvIGNvbnRlbnRIZWlnaHQpIDogd2lkdGgsXG4gICAgbGVmdDogaXNWZXJ0aWNhbCA/IHNjcm9sbFdpZHRoIC0gd2lkdGggOiAwLFxuICAgIHRvcDogaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxIZWlnaHQgLSB3aWR0aCxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2hlY2tOZWVkSGlkZVNjcm9sbEJhcihkaXJlY3Rpb246IFNjcm9sbEJhckRpcmVjdGlvbiwgZGltZW5zaW9uczogSURpbWVuc2lvbnMpIHtcbiAgcmV0dXJuICEhKGRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsICYmIGRpbWVuc2lvbnMubWF4U2Nyb2xsVG9wID09PSAwXG4gICAgfHwgZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uSG9yaXpvbnRhbCAmJiBkaW1lbnNpb25zLm1heFNjcm9sbExlZnQgPT09IDApO1xufVxuXG4vKipcbiAqIOa7muWKqOe7hOS7tueahOa7muWKqOadoee7hOS7tu+8jOa7muWKqOadoeacrOi6q+S5n+aYr0xheW91dOeahOS4gOS4quiKgueCuVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxCYXIgZXh0ZW5kcyBWaWV3IHtcbiAgLy8g5b2T5YmN5rua5Yqo5p2h5piv5bGe5LqO5qiq5ZCR6L+Y5piv57q15ZCRXG4gIHB1YmxpYyBkaXJlY3Rpb246IFNjcm9sbEJhckRpcmVjdGlvbjtcblxuICBwdWJsaWMgZGltZW5zaW9uczogSURpbWVuc2lvbnM7XG5cbiAgLy8g5rua5Yqo5a6M5q+V5ZCO5LiA5q615pe26Ze05ZCO6Ieq5Yqo6ZqQ6JePXG4gIHB1YmxpYyBhdXRvSGlkZSA9IHRydWU7XG5cbiAgLy8g5rua5Yqo5a6M5q+V5ZCO6Ieq5Yqo6ZqQ6JeP5pe26Ze0XG4gIHB1YmxpYyBhdXRvSGlkZVRpbWUgPSAyMDAwO1xuXG4gIHB1YmxpYyBhdXRvSGlkZURlbGF5VGltZSA9IDE1MDA7XG5cbiAgcHJpdmF0ZSBhdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSAwO1xuXG4gIHByaXZhdGUgaW5uZXJXaWR0aCA9IDE2O1xuXG4gIHByaXZhdGUgaXNIaWRlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBjdXJyTGVmdCA9IDA7XG4gIHByaXZhdGUgY3VyclRvcCA9IDA7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIGRpcmVjdGlvbixcbiAgICBkaW1lbnNpb25zLFxuICAgIGJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDE2MiwgMTYyLCAxNjIsIDEpJyxcbiAgICB3aWR0aCA9IDE2LFxuICB9OiBJU2Nyb2xsQmFyT3B0aW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGJvcmRlclJhZGl1czogd2lkdGggLyAyLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICB9LCB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHdpZHRoLCBkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKTtcblxuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICB0aGlzLmlubmVyV2lkdGggPSB3aWR0aDtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKGRpcmVjdGlvbiwgZGltZW5zaW9ucykpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lcldpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIOa7muWKqOadoeeahOeyl+e7hu+8jOWboOS4uuimgeWFvOWuueaoquerlua7muWKqO+8jOaJgOS7pSBzdHlsZS53aWR0aCDlnKjkuI3lkIzmqKHlvI/kuIvku6PooajnmoTmhI/mgJ3kuI3kuIDmoLdcbiAgICog5Zug5q2k6YCa6L+H5Y2V54us55qEIHdpZHRoIOWxnuaAp+adpeS7o+ihqOa7muWKqOadoeeahOeyl+e7hlxuICAgKi9cbiAgc2V0IHdpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuaW5uZXJXaWR0aCkge1xuICAgICAgdGhpcy5pbm5lcldpZHRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHlsZS5ib3JkZXJSYWRpdXMgPSB0aGlzLmlubmVyV2lkdGggLyAyO1xuICAgIHRoaXMuc2V0RGltZW5zaW9ucyh0aGlzLmRpbWVuc2lvbnMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XTogcGxlYXNlIHNldCByb290IGZvciBzY3JvbGxiYXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5yb290LnRpY2tlci5hZGQodGhpcy51cGRhdGUsIHRydWUpOyAgICBcblxuICAgICAgdGhpcy5yb290Lm9uKCdiZWZvcmVfcmVmbG93JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUodGhpcy5jdXJyTGVmdCwgdGhpcy5jdXJyVG9wKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmlzSGlkZSA9IHRydWU7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5pc0hpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIOagueaNriBTY3JvbGxWaWV3IOWuueWZqOWuvemrmOWSjOWunumZheWGheWuueWuvemrmOWGs+Wumua7muWKqOadoeeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgKiDkvYbmoLjlv4PpnIDopoHogIPomZHnmoTmg4XlhrXmmK/vvJpcbiAgICogMS4g5Zyo5LiN5pat5ZywIHJlZmxvdyDov4fnqIvkuK3vvIxTY3JvbGxCYXIg5Lmf5Lya5a2Y5Zyo6ZyA6KaB5YiH5o2i5bGV56S65ZKM6ZqQ6JeP55qE5oOF5Ya1XG4gICAqIDIuIHJlZmxvdyDkuYvlkI7vvIxTY3JvbGxCYXIg55qE5L2N572u5LiN5piv566A5Y2V55qE6K6+572u5Li6IFNjcm9sbFZpZXcg6aG26YOo5ZKM5bem6L6577yM6L+Y5Y+v6IO95piv5rua5Yqo5LqG5LiA5q616Led56a75ZCO5omn6KGM55qEIHJlZmxvd1xuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh0aGlzLndpZHRoLCB0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucyk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHN0eWxlKTtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKHRoaXMuZGlyZWN0aW9uLCBkaW1lbnNpb25zKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSGlkZSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcblxuICAgIC8vIOW3sue7j+a7muWKqOi/h+S4gOautei3neemu+eahOaDheWGte+8jOmHjeaWsOiuoeeul+aWsOeahOa7muWKqOS9jee9rlxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUoZGltZW5zaW9ucy5zY3JvbGxMZWZ0LCBkaW1lbnNpb25zLnNjcm9sbFRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZSArIHRoaXMuYXV0b0hpZGVEZWxheVRpbWU7XG4gIH1cblxuICBjYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIGNvbnN0IGNhblNjcm9sbFBlcmNlbnQgPSAxIC0gdGhpcy5kaW1lbnNpb25zLmhlaWdodCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50SGVpZ2h0O1xuXG4gICAgICAvLyDmu5rliqjmnaHmnIDlpKfmu5rliqjpq5jluqZcbiAgICAgIGNvbnN0IHNjcm9sbEJhck1heFNjcm9sbFRvcCA9IHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgKiBjYW5TY3JvbGxQZXJjZW50O1xuXG4gICAgICBjb25zdCBwZXJjZW50ID0gdG9wIC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbFRvcDtcbiAgICAgIGNvbnN0IHBlcmNlbnRUb3AgPSBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgKiBwZXJjZW50O1xuXG4gICAgICBzY3JvbGxUb3AgPSBjbGFtcChwZXJjZW50VG9wLCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxUb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy53aWR0aCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50V2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ID0gdGhpcy5kaW1lbnNpb25zLndpZHRoICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IGxlZnQgLyB0aGlzLmRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdDtcblxuICAgICAgc2Nyb2xsTGVmdCA9IGNsYW1wKHNjcm9sbEJhck1heFNjcm9sbExlZnQgKiBwZXJjZW50LCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfTtcbiAgfVxuXG4gIG9uU2Nyb2xsKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJMZWZ0ID0gbGVmdDtcbiAgICB0aGlzLmN1cnJUb3AgPSB0b3A7XG4gIFxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUobGVmdCwgdG9wKTtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVkgPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZICsgc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVggPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYICsgc2Nyb2xsTGVmdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xuICAgICAgLy8gdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZTtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUsIHRydWUpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZSA9IChkdDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKCF0aGlzLmF1dG9IaWRlIHx8IHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IDAgfHwgdGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAtPSBkdDtcblxuICAgIGlmICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSB0aGlzLmF1dG9IaWRlVGltZSkge1xuICAgICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSBNYXRoLm1heCgwLCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSk7XG4gICAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyICogKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC8gdGhpcy5hdXRvSGlkZVRpbWUpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY29weVRvdWNoQXJyYXkgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgU2Nyb2xsZXIgZnJvbSAnLi4vbGlicy9zY3JvbGxlci9pbmRleC5qcydcbmltcG9ydCB7IGl0ZXJhdGVUcmVlIH0gZnJvbSAnLi4vY29tbW9uL3ZkJztcbmltcG9ydCBFbGVtZW50LCB7IHNldERpcnR5IH0gZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBTY3JvbGxCYXIsIHsgU2Nyb2xsQmFyRGlyZWN0aW9uIH0gZnJvbSAnLi9zY3JvbGxiYXInO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IGRwciA9IGVudi5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBJSW5uZXJTY3JvbGxlck9wdGlvbiB7XG4gIHNjcm9sbGluZ1g/OiBib29sZWFuO1xuICBzY3JvbGxpbmdZPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgcHVibGljIHNjcm9sbFRvcCA9IDA7XG4gIHB1YmxpYyBzY3JvbGxMZWZ0ID0gMDtcbiAgcHVibGljIGhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICBwdWJsaWMgY3VycmVudEV2ZW50ID0gbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnU2Nyb2xsVmlldyc7XG5cbiAgcHJpdmF0ZSBzY3JvbGxZUHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbm5lclNjcm9sbGVyT3B0aW9uOiBJSW5uZXJTY3JvbGxlck9wdGlvbjtcblxuICBwcml2YXRlIHNjcm9sbGVyT2JqPzogU2Nyb2xsZXI7XG4gIHByaXZhdGUgaXNGaXJzdFNjcm9sbD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB2ZXJ0aXZhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaG9yaXpvbnRhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgc2Nyb2xsWCxcbiAgICBzY3JvbGxZLFxuICAgIGRhdGFzZXQsXG4gIH06IElTY3JvbGxWaWV3T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWROYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGl0ZW06IEVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgaXRlbS5sYXlvdXRCb3gudG9wICsgaXRlbS5sYXlvdXRCb3guaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWF4SGVpZ2h0O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhXaWR0aCA9IE1hdGgubWF4KG1heFdpZHRoLCBpdGVtLmxheW91dEJveC5sZWZ0ICsgaXRlbS5sYXlvdXRCb3gud2lkdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1heFdpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbygwLCB0aGlzLnNjcm9sbFRvcCwgdHJ1ZSwgMSk7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6IHZhbHVlLFxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gIH1cblxuICBnZXQgc2Nyb2xsWSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1k7XG4gIH1cblxuICBzZXQgc2Nyb2xsWSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5zY3JvbGxZKSB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyh0aGlzLnNjcm9sbExlZnQsIDAsIHRydWUsIDEpO1xuICAgICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNjcm9sbGVyT2JqICYmIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgaWYgKCEodHJlZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgIHRyZWUucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5yZWN0KHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBhYnNvbHV0ZVgsIGFic29sdXRlWSB9ID0gY2hpbGQubGF5b3V0Qm94O1xuXG4gICAgICAvLyDliKTmlq3lpITkuo7lj6/op4bnqpflj6PlhoXnmoTlrZDoioLngrnvvIzpgJLlvZLmuLLmn5Por6XlrZDoioLngrlcbiAgICAgIGlmIChhYnNvbHV0ZVkgKyBoZWlnaHQgPj0gc3RhcnRZICYmIGFic29sdXRlWSA8PSBlbmRZXG4gICAgICAgICYmIGFic29sdXRlWCArIHdpZHRoID49IHN0YXJ0WCAmJiBhYnNvbHV0ZVggPD0gZW5kWCkge1xuICAgICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIOS4iumdoueahOa4suafk+W6lOivpeWFiOi3s+i/h+a7muWKqOadoe+8jOWQpuWImeWPr+iDveWHuueOsOa4suafk+mhuuW6j+mXrumimO+8jFNjcm9sbFZpZXfnmoToioLngrnlj43ogIzmiormu5rliqjmnaHnm5bkvY/kuoZcbiAgICB0aGlzLnZlcnRpdmFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcbiAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/LnJlbmRlcigpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgIShlbGUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5b2T5omn6KGMcmVmbG935LmL5ZCO77yM5rua5Yqo5YiX6KGo55qE6auY5bqm5Y+v6IO95Y+R55Sf5LqG5Y+Y5YyW77yM5rua5Yqo5p2h5Lmf6ZyA6KaB5ZCM5q2l6L+b6KGM5pu05pawXG4gICAqL1xuICB1cGRhdGVTY3JvbGxCYXIoc2Nyb2xsUHJvcDogc3RyaW5nLCBzY3JvbGxCYXJOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICBjb250ZW50V2lkdGg6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoLFxuICAgICAgY29udGVudEhlaWdodDogdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0LFxuICAgICAgbWF4U2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgbWF4U2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX21heFNjcm9sbFRvcCxcblxuICAgICAgc2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbFRvcCxcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlU2Nyb2xsQmFyJywgSlNPTi5zdHJpbmdpZnkoZGltZW5zaW9ucykpXG5cbiAgICAvLyDpnZ7nrKzkuIDmrKHliJvlu7rnmoTmg4XlhrXvvIzkuIDoiKzmmK8gcmVmbG93IOaJp+ihjOWIsOi/memHjFxuICAgIGlmICh0aGlzW3Njcm9sbFByb3AgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddLnNldERpbWVuc2lvbnMoZGltZW5zaW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFyKHtcbiAgICAgICAgICBkaW1lbnNpb25zLFxuICAgICAgICAgIGRpcmVjdGlvbjogc2Nyb2xsUHJvcCA9PT0gJ3Njcm9sbFknID8gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsIDogU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuYXBwZW5kQ2hpbGQoc2Nyb2xsYmFyKTtcbiAgICAgICAgc2Nyb2xsQmFyLnJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHNjcm9sbEJhci5pbml0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2Nyb2xsQmFyLmluc2VydCh0aGlzLnJvb3QucmVuZGVyQ29udGV4dCwgdHJ1ZSk7XG4gICAgICAgIHNjcm9sbEJhci5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuICAgICAgICB0aGlzLmFkZChzY3JvbGxCYXIpO1xuXG4gICAgICAgIHNldERpcnR5KHNjcm9sbEJhciwgJ2FwcGVuZFRvU2Nyb2xsVmlldycpXG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdID0gc2Nyb2xsQmFyO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXT8ub25TY3JvbGwodGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LCB0aGlzLnNjcm9sbGVyT2JqIS5fX3NjaGVkdWxlZFRvcCk7XG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPkuI3lho3pnIDopoHnurXlkJHmu5rliqjnmoTml7blgJnplIDmr4HnurXlkJHmu5rliqjmnaFcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddO1xuICAgICAgICBzY3JvbGxCYXIucmVtb3ZlKCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95KCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95U2VsZigpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDoh6rliqjlvIDlkK8gc2Nyb2xsWWApO1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6L+Z6YeM5LmL5omA5Lul6KaB5bu26L+f5LiA5bin5piv5Zug5Li66L+Z6YeM55qE5Y+Y5Yqo5p2l6IeqIHJlZmxvdyDkuYvlkI7vvIzmraPlnKjlgZogcmVmbG93IOS5i+WQjueahOWQjue7reS6i+aDhVxuICAgICAgICAgKiDlpoLmnpznq4vljbPkv67mlLnmu5rliqjmnaHnmoTmoLflvI/vvIzlrp7pmYXkuIrlubbkuI3kvJrnlJ/mlYjjgIJcbiAgICAgICAgICovXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxvdyDkuYvlkI7vvIzkvJrku44gY3NzbGF5b3V0IOWQjOatpeW4g+WxgOS/oeaBr++8jOWOn+WFiOeahOa7muWKqOS/oeaBr+S8muS4ouWkse+8jOi/memHjOmcgOimgeS4gOS4quWkjeS9jeeahOaTjeS9nFxuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRoaXMuc2Nyb2xsVG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gdHJ1ZTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnModGhpcy5sYXlvdXRCb3gud2lkdGgsIHRoaXMubGF5b3V0Qm94LmhlaWdodCwgdGhpcy5zY3JvbGxXaWR0aCwgdGhpcy5zY3JvbGxIZWlnaHQpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG4gICdvcGFjaXR5JyxcbiAgJ3RyYW5zZm9ybScsXG4gICd0ZXh0U3Ryb2tlQ29sb3InLFxuICAndGV4dFN0cm9rZVdpZHRoJyxcbiAgJ3RleHRTaGFkb3cnLFxuXTtcblxuY29uc3QgYWxsU3R5bGVzID0gcmVmbG93QWZmZWN0ZWRTdHlsZXMuY29uY2F0KHJlcGFpbnRBZmZlY3RlZFN0eWxlcyk7XG5cbmludGVyZmFjZSBJU3R5bGUge1xuICAvLyByZWZsb3dBZmZlY3RlZFN0eWxlc1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgbWluSGVpZ2h0PzogbnVtYmVyO1xuICBtYXhXaWR0aD86IG51bWJlcjtcbiAgbWF4SGVpZ2h0PzogbnVtYmVyO1xuICBsZWZ0PzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgdG9wPzogbnVtYmVyO1xuICBib3R0b20/OiBudW1iZXI7XG4gIG1hcmdpbj86IG51bWJlcjtcbiAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gIG1hcmdpblRvcD86IG51bWJlcjtcbiAgbWFyZ2luQm90dG9tPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nQm90dG9tPzogbnVtYmVyO1xuICBib3JkZXJXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyTGVmdFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJSaWdodFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJUb3BXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tV2lkdGg/OiBudW1iZXI7XG5cbiAgYm9yZGVyVG9wTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuXG4gIGZsZXhEaXJlY3Rpb24/OiAnY29sdW1uJyB8ICdyb3cnO1xuICBmbGV4U2hyaW5rPzogbnVtYmVyO1xuICBmbGV4R3Jvdz86IG51bWJlcjtcbiAgZmxleFdyYXA/OiAnd3JhcCcgfCAnbm93cmFwJztcbiAganVzdGlmeUNvbnRlbnQ/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3BhY2UtYmV0d2VlbicgfCAnc3BhY2UtYXJvdW5kJztcbiAgYWxpZ25JdGVtcz86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgYWxpZ25TZWxmPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBwb3NpdGlvbj86IHN0cmluZztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcblxuICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG5cbiAgLy8g5paH5a2X5o+P6L6555qE5a695bqm77yM6buY6K6k5LiN5o+P6L65XG4gIHRleHRTdHJva2VXaWR0aD86IG51bWJlcjtcbiAgLy8g5paH5a2X5o+P6L6555qE6aKc6Imy77yM5aaC5p6c5oyH5a6a5LqG5o+P6L656aKc6Imy5L2G5piv5rKh5pyJ5oyH5a6a5o+P6L655a695bqm77yM5o+P6L655a695bqm6buY6K6k6K6+572u5Li6MVxuICB0ZXh0U3Ryb2tlQ29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOaWh+Wtl+mYtOW9seaViOaenO+8jHRleHRTaGFkb3fnmoTmoLzlvI/lubbkuI3mmK/kuKXmoLznmoRDU1PmoLzlvI/vvIzku4XmlK/mjIHkuKTnp43moLzlvI9cbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcGlua1xuICAgKiB0ZXh0U2hhZG93OiAxcHggMXB4IDJweCByZWQsIDAgMCAxcHggYmx1ZSwgMCAwIDFweCBibHVlLCAxcHggMXB4IDJweCByZWRcbiAgICog5Lmf5bCx5piv5pSv5oyB5Lu75oSP5pWw6YeP55qE6Zi05b2x5pWI5p6c77yM5q+P5Liq6Zi05b2x5pWI5p6c55Sx5Zub5Liq5YC85oyH5a6a77yM5YiG5Yir5pivIHNoYWRvd09mZnNldFgsIHNoYWRvd09mZnNldFksIHNoYWRvd0JsdXIsIHNoYWRvd0NvbG9yXG4gICAqL1xuICB0ZXh0U2hhZG93Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9O1xuIiwiXG5mdW5jdGlvbiBkZWdyZWVzVG9SYWRpYW5zKGRlZ3JlZXM6IG51bWJlcikge1xuICByZXR1cm4gZGVncmVlcyAqIE1hdGguUEkgLyAxODA7XG59XG5cbi8vIOaXi+i9rOeahOato+WImeihqOi+vuW8j1xuY29uc3Qgcm90YXRlUmVnID0gL3JvdGF0ZVxcKChcXGQrKWRlZ1xcKS87XG5cbi8vIOiDjOaZr+Wbvuato+WImeihqOi+vuW8j1xuY29uc3QgaXNWYWxpZFVybFByb3BSZWcgPSAvXFxzKnVybFxcKCguKj8pXFwpXFxzKi87XG5cbmV4cG9ydCBmdW5jdGlvbiByb3RhdGVQYXJzZXIodmFsOiBzdHJpbmcpIHtcbiAgY29uc3QgbWF0Y2ggPSB2YWwubWF0Y2gocm90YXRlUmVnKTtcblxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZGVncmVlc1RvUmFkaWFucyhwYXJzZUludChtYXRjaFsxXSkpO1xuICB9XG5cbiAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dmFsfSBpcyBub3QgYSB2YWxpZCB0cmFuc2Zvcm0gcm90YXRlYCk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vIOino+aekOiDjOaZr+WbvueJh1xuZXhwb3J0IGZ1bmN0aW9uIGJhY2tncm91bmRJbWFnZVBhcnNlcih2YWw6IHN0cmluZykge1xuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBjb25zdCBsaXN0ID0gdmFsLm1hdGNoKGlzVmFsaWRVcmxQcm9wUmVnKTtcblxuICAgIGlmIChsaXN0KSB7XG4gICAgICBjb25zdCB1cmwgPSBsaXN0WzFdLnJlcGxhY2UoLygnfFwiKS9nLCAnJyk7XG5cbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuICB9XG5cbiAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dmFsfSBpcyBub3QgYSB2YWxpZCBiYWNrZ3JvdW5kSW1hZ2VgKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuY29uc3QgdGV4dFNoYWRvd1JlZyA9IC9eKFxcZCtweFxccyl7Mn1cXGQrcHhcXHNbYS16QS1aXSsoLFxccyooXFxkK3B4XFxzKXsyfVxcZCtweFxcc1thLXpBLVpdKykqJC87XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdzogc3RyaW5nKSB7XG4gIHJldHVybiB0ZXh0U2hhZG93UmVnLnRlc3QodGV4dFNoYWRvdyk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gIC8vIOS9v+eUqOato+WImeihqOi+vuW8j+mqjOivgeaVsOWtl+aIlumAl+WPt+WIhumalOeahOaVsOWtl++8jOWQjumdouWPr+S7pei3n+WPr+mAieeahOinkuW6puWNleS9je+8iGRlZ++8iVxuICByZXR1cm4gL14oLT9cXGQrKFxcLlxcZCspPykoZGVnKT8oLFxccyooLT9cXGQrKFxcLlxcZCspPykoZGVnKT8pKiQvLnRlc3QodmFsdWUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZW5kZXJGb3JMYXlvdXQge1xuICByb3RhdGU/OiBudW1iZXI7IC8vIHRyYW5zZm9ybSByb3RhdGXop6PmnpDkuYvlkI7lvpfliLDnmoTlvKfluqbliLZcbiAgc2NhbGVYPzogbnVtYmVyO1xuICBzY2FsZVk/OiBudW1iZXI7XG59XG5cblxuY29uc3QgdHJhbnNmb3JtUmVnZXggPSAvKFxcdyspXFwoKFteKV0rKVxcKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gIC8vIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAvLyByb3RhdGU6IDAsXG4gICAgLy8gc2NhbGVYOiAxLFxuICAgIC8vIHNjYWxlWTogMSxcbiAgICAvLyB0cmFuc2xhdGVYOiAwLFxuICAgIC8vIHRyYW5zbGF0ZVk6IDAsXG4gIC8vIH07XG5cbiAgY29uc3QgcmVzdWx0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgbGV0IG1hdGNoO1xuXG4gIHdoaWxlICgobWF0Y2ggPSB0cmFuc2Zvcm1SZWdleC5leGVjKHRyYW5zZm9ybSkpKSB7XG4gICAgY29uc3QgWywgbmFtZSwgdmFsdWVdID0gbWF0Y2g7XG5cbiAgICBpZiAoIWlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgW0xheW91dF06IGludmFsaWQgdmFsdWUgZm9yICR7bmFtZX06ICR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVzID0gdmFsdWVcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKCh2YWwpID0+IHZhbC50cmltKCkucmVwbGFjZSgnZGVnJywgJycpKVxuICAgICAgLm1hcChOdW1iZXIpO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICByZXN1bHQucm90YXRlID0gZGVncmVlc1RvUmFkaWFucyh2YWx1ZXNbMF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgcmVzdWx0LnNjYWxlWCA9IHZhbHVlc1swXTtcbiAgICAgICAgcmVzdWx0LnNjYWxlWSA9IHZhbHVlc1sxXSB8fCB2YWx1ZXNbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gY2FzZSAndHJhbnNsYXRlJzpcbiAgICAgIC8vICAgcmVzdWx0LnRyYW5zbGF0ZVggPSB2YWx1ZXNbMF07XG4gICAgICAvLyAgIHJlc3VsdC50cmFuc2xhdGVZID0gdmFsdWVzWzFdIHx8IDA7XG4gICAgICAvLyAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxucGFyc2VUcmFuc2Zvcm0oJ3JvdGF0ZSg0NSknKTtcbnBhcnNlVHJhbnNmb3JtKCdyb3RhdGUoMzYwZGVnKScpO1xucGFyc2VUcmFuc2Zvcm0oJ3h4eHgnKTtcbnBhcnNlVHJhbnNmb3JtKCdzY2FsZSgzLDQpJyk7IiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnc2Fucy1zZXJpZic7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG5cbmNvbnN0IGdldENvbnRleHQgPSAoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0+IHtcbiAgaWYgKGNvbnRleHQpIHtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIGNvbnN0IGNhbnZhcyA9IGVudi5jcmVhdGVDYW52YXMoKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IDE7XG4gIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmludGVyZmFjZSBJVGV4dFByb3BzIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBJVGV4dFNoYWRvdyB7XG4gIG9mZnNldFg6IG51bWJlcjtcbiAgb2Zmc2V0WTogbnVtYmVyO1xuICBibHVyUmFkaXVzOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSB2YWx1ZXNyYyA9ICcnO1xuICBwcml2YXRlIG9yaWdpblN0eWxlV2lkdGg6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuICBwdWJsaWMgdGV4dEJhc2VsaW5lOiBDYW52YXNUZXh0QmFzZWxpbmUgPSAnYm90dG9tJztcbiAgcHVibGljIGZvbnQgPSAnJztcbiAgcHVibGljIHRleHRBbGlnbjogQ2FudmFzVGV4dEFsaWduID0gJ2xlZnQnO1xuICBwdWJsaWMgZmlsbFN0eWxlID0gJyMwMDAwMDAnO1xuXG4gIHB1YmxpYyB0ZXh0U2hhZG93cyE6IG51bGwgfCBJVGV4dFNoYWRvd1tdO1xuICBcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVGV4dFByb3BzKSB7XG4gICAgbGV0IG9yaWdpblN0eWxlV2lkdGggPSBzdHlsZS53aWR0aDtcbiAgICAvLyDmsqHmnInorr7nva7lrr3luqbnmoTml7blgJnpgJrov4djYW52YXPorqHnrpflh7rmloflrZflrr3luqZcbiAgICBpZiAob3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlVGV4dChzdHlsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgfHwgc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdUZXh0JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuICAgIHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9IG9yaWdpblN0eWxlV2lkdGg7XG5cbiAgICBpZiAoc3R5bGUudGV4dFNoYWRvdykge1xuICAgICAgdGhpcy5wYXJzZVRleHRTaGFkb3coc3R5bGUudGV4dFNoYWRvdyk7XG4gICAgfVxuICB9XG5cbiAgc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3A6IHN0cmluZywgdmFsOiBhbnkpIHtcbiAgICBpZiAocHJvcCA9PT0gJ3RleHRTaGFkb3cnKSB7XG4gICAgICB0aGlzLnBhcnNlVGV4dFNoYWRvdyh2YWwpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICAgIC8vIGlmICghaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdykpIHtcbiAgICAvLyAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3RleHRTaGFkb3d9IGlzIG5vdCBhIHZhbGlkIHRleHRTaGFkb3dgKTtcbiAgICAvLyB9IGVsc2Uge1xuICAgICAgLy8g6Kej5p6QIHRleHQtc2hhZG93IOWtl+espuS4slxuICAgICAgdGhpcy50ZXh0U2hhZG93cyA9IHRleHRTaGFkb3cuc3BsaXQoJywnKS5tYXAoc2hhZG93ID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBzaGFkb3cudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBwYXJzZUZsb2F0KHBhcnRzWzBdKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHBhcnNlRmxvYXQocGFydHNbMV0pO1xuICAgICAgICBjb25zdCBibHVyUmFkaXVzID0gcGFyc2VGbG9hdChwYXJ0c1syXSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gcGFydHNbM107XG5cbiAgICAgICAgcmV0dXJuIHsgb2Zmc2V0WCwgb2Zmc2V0WSwgYmx1clJhZGl1cywgY29sb3IgfTtcbiAgICAgIH0pO1xuICAgIC8vIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgaWYgKHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgICBuZXdWYWx1ZSA9IHBhcnNlVGV4dCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIGxldCB7IHBhcmVudCB9ID0gdGhpcztcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvQ2FudmFzRGF0YSgpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG5cbiAgICB0aGlzLmZvbnRTaXplID0gc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB0aGlzLmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICcnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7c3R5bGUuZm9udEZhbWlseSB8fCBERUZBVUxUX0ZPTlRfRkFNSUxZfWA7XG4gICAgdGhpcy50ZXh0QWxpZ24gPSBzdHlsZS50ZXh0QWxpZ24gfHwgJ2xlZnQnO1xuICAgIHRoaXMuZmlsbFN0eWxlID0gc3R5bGUuY29sb3IgfHwgJyMwMDAnO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIGluc2VydChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cbiAgICB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgbGV0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSB0aGlzLnRleHRCYXNlbGluZTtcbiAgICBjdHguZm9udCA9IHRoaXMuZm9udDtcbiAgICBjdHgudGV4dEFsaWduID0gdGhpcy50ZXh0QWxpZ247XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmZpbGxTdHlsZTtcblxuICAgIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgIGRyYXdYICs9IHdpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICBkcmF3WCArPSB3aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUubGluZUhlaWdodCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgZHJhd1kgKz0gKHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyKSAvIDI7XG4gICAgfVxuXG4gICAgLy8g57q555CG5paH5a2X5o+P6L65XG4gICAgaWYgKHN0eWxlLnRleHRTdHJva2VDb2xvcikge1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLnRleHRTdHJva2VXaWR0aCB8fCAxO1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUudGV4dFN0cm9rZUNvbG9yIGFzIHN0cmluZztcblxuICAgICAgY3R4LnN0cm9rZVRleHQoXG4gICAgICAgIHRoaXMudmFsdWUsXG4gICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyDlpITnkIbmloflrZfpmLTlvbFcbiAgICBpZiAodGhpcy50ZXh0U2hhZG93cykge1xuICAgICAgdGhpcy50ZXh0U2hhZG93cy5mb3JFYWNoKCh7IG9mZnNldFgsIG9mZnNldFksIGJsdXJSYWRpdXMsIGNvbG9yIH0pID0+IHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSBvZmZzZXRYO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IG9mZnNldFk7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gYmx1clJhZGl1cztcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gY29sb3I7XG4gICAgICAgIGN0eC5maWxsVGV4dChcbiAgICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7ICBcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdWaWV3JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblkgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgR2FtZUdsb2JhbC5fX2VudiA9IEdhbWVHbG9iYWwud3ggfHwgR2FtZUdsb2JhbC50dCB8fCBHYW1lR2xvYmFsLnN3YW47XG59XG5cbmNvbnN0IGRvbUV2ZW50TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICB0b3VjaHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgdG91Y2htb3ZlOiAnbW91c2Vtb3ZlJyxcbiAgdG91Y2hlbmQ6ICdtb3VzZXVwJyxcbiAgdG91Y2hjYW5jZWw6ICdtb3VzZWxlYXZlJyxcbn1cblxuZW51bSBldmVudFR5cGUge1xuICBvbiA9ICdvbicsXG4gIG9mZiA9ICdvZmYnLFxufVxuXG5mdW5jdGlvbiBnZW5Eb21Ub3VjaEV2ZW50KGV2ZW50OiBzdHJpbmcsIHR5cGU6IGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAobGlzdGVuZXI6IENhbGxiYWNrKSB7XG4gICAgICB0eXBlID09PSBldmVudFR5cGUub24gP1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgICAgIDogZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRPblRvdWNoSGFuZGxlcihldmVudDogc3RyaW5nLCB0eXBlOiBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBHYW1lR2xvYmFsLl9fZW52W2Ake3R5cGV9JHtldmVudH1gXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZW5Eb21Ub3VjaEV2ZW50KGRvbUV2ZW50TWFwW2V2ZW50LnRvTG93ZXJDYXNlKCldLCB0eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIExheW91dCDlj6/og73nlKjlnKjkuI3nlKjnmoTlubPlj7DvvIzogIxMYXlvdXTkvJrkvp3otZblubPlj7DkuIvpnaLnmoTkuIDkupvmlrnms5XmnaXlrp7njrDlhbfkvZPnmoTlip/og73vvIzmr5TlpoLliJvlu7rlm77niYdcbiAqIOS4uuS6huabtOWlveWBmuW5s+WPsOmAgumFje+8jOe7n+S4gOWwgeijhSBlbnYg5qih5Z2X77yM5LiN5ZCM5bmz5Y+w6KaB5YGa6YCC6YWN77yM5pu/5o2iIGVudiDnmoTlhbfkvZPmlrnms5XljbPlj69cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvLyDnm5HlkKzop6bmkbjnm7jlhbPkuovku7ZcbiAgb25Ub3VjaFN0YXJ0OiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hTdGFydCcsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hNb3ZlOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hNb3ZlJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaENhbmNlbDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoQ2FuY2VsJywgZXZlbnRUeXBlLm9uKSxcbiAgLy8g5Y+W5raI55uR5ZCs6Kem5pG455u45YWz5LqL5Lu2XG4gIG9mZlRvdWNoU3RhcnQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaFN0YXJ0JywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoTW92ZTogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoTW92ZScsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoQ2FuY2VsOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hDYW5jZWwnLCBldmVudFR5cGUub2ZmKSxcblxuICAvLyBMYXlvdXQg5pSv5oyB55m+5YiG5q+U5qC35byP77yM5aaC5p6c5qC56IqC54K55qC35byP6K6+572u5Li6IDEwMCXvvIznm7TmjqXlj5YgQ2FudmFzIOeahOWwuuWvuO+8jOS4jeWQjOW5s+WPsOeahOWPluazleS4jeS4gOagt++8jOWboOatpOWNleeLrOaPkOS+m+WHveaVsFxuICBnZXRSb290Q2FudmFzU2l6ZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTaGFyZWRDYW52YXMpIHtcbiAgICAgIGNvbnN0IGN2cyA9IF9fZW52LmdldFNoYXJlZENhbnZhcygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGN2cy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjdnMuaGVpZ2h0LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IDE1MCxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8g5Y+W5b2T5YmN6K6+5aSH55qEIGRldmljZVBpeGVsUmF0aW/vvIzkuI3lkIzlubPlj7DnmoTlj5bms5XkuI3kuIDmoLdcbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgICAgcmV0dXJuIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKCkuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG4gICAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfSxcblxuICAvLyDliJvlu7pDYW52YXNcbiAgY3JlYXRlQ2FudmFzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICB9LFxuXG4gIC8vIOWIm+W7uuWbvueJh1xuICBjcmVhdGVJbWFnZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gICAgfVxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGNvbnZlcnRUb0pzb24gPSBmdW5jdGlvbihub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGpPYmogPSB7XG4gICAgbmFtZTogbm9kZS50YWduYW1lXG4gIH07XG5cbiAgLy93aGVuIG5vIGNoaWxkIG5vZGUgb3IgYXR0ciBpcyBwcmVzZW50XG4gIGlmICgoIW5vZGUuY2hpbGQgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuY2hpbGQpKSAmJiAoIW5vZGUuYXR0cnNNYXAgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuYXR0cnNNYXApKSkge1xuICAgIHJldHVybiB1dGlsLmlzRXhpc3Qobm9kZS52YWwpICYmICEhbm9kZS52YWwgPyBub2RlLnZhbCA6IGpPYmo7XG4gIH0gZWxzZSB7XG4gICAgLy9vdGhlcndpc2UgY3JlYXRlIGEgdGV4dG5vZGUgaWYgbm9kZSBoYXMgc29tZSB0ZXh0XG4gICAgaWYgKHV0aWwuaXNFeGlzdChub2RlLnZhbCkpIHtcbiAgICAgIGlmICghKHR5cGVvZiBub2RlLnZhbCA9PT0gJ3N0cmluZycgJiYgKG5vZGUudmFsID09PSAnJyB8fCBub2RlLnZhbCA9PT0gb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcikpKSB7XG4gICAgICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSBcInN0cmljdFwiKXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IFsgbm9kZS52YWwgXTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBub2RlLnZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdXRpbC5tZXJnZShqT2JqLCBub2RlLmF0dHJzTWFwLCBvcHRpb25zLmFycmF5TW9kZSk7XG5cbiAgak9iai5jaGlsZHJlbiA9IFtdO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goIGNoaWxkID0+IHtcbiAgICBqT2JqLmNoaWxkcmVuLnB1c2goY29udmVydFRvSnNvbihjaGlsZCwgb3B0aW9ucykpXG4gIH0pO1xuXG4gIC8vYWRkIHZhbHVlXG4gIHJldHVybiBqT2JqO1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9Kc29uID0gY29udmVydFRvSnNvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgbm9kZVRvSnNvbiA9IHJlcXVpcmUoJy4vbm9kZTJqc29uJyk7XG5jb25zdCB4bWxUb05vZGVvYmogPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCB4MnhtbG5vZGUgPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucywgdmFsaWRhdGlvbk9wdGlvbikge1xuICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICBpZih2YWxpZGF0aW9uT3B0aW9uID09PSB0cnVlKSB2YWxpZGF0aW9uT3B0aW9uID0ge31cblxuICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUoeG1sRGF0YSwgdmFsaWRhdGlvbk9wdGlvbik7XG4gICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICB0aHJvdyBFcnJvciggcmVzdWx0LmVyci5tc2cpXG4gICAgIH1cbiAgIH1cbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCB4MnhtbG5vZGUuZGVmYXVsdE9wdGlvbnMsIHgyeG1sbm9kZS5wcm9wcyk7XG4gIHJldHVybiBub2RlVG9Kc29uLmNvbnZlcnRUb0pzb24oeG1sVG9Ob2Rlb2JqLmdldFRyYXZlcnNhbE9iaih4bWxEYXRhLCBvcHRpb25zKSwgb3B0aW9ucyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxtYXRjaGVzID0gW107XG4gICAgY29uc3QgbGVuID0gbWF0Y2gubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIGFsbG1hdGNoZXMucHVzaChtYXRjaFtpbmRleF0pO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goYWxsbWF0Y2hlcyk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5jb25zdCBkb2VzTWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmNvbnN0IGRvZXNOb3RNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuICFkb2VzTWF0Y2goc3RyaW5nLCByZWdleCk7XG59O1xuXG5leHBvcnRzLmlzRXhpc3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBDb3B5IGFsbCB0aGUgcHJvcGVydGllcyBvZiBhIGludG8gYi5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0XG4gKiBAcGFyYW0geyp9IGFcbiAqL1xuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgYSwgYXJyYXlNb2RlKSB7XG4gIGlmIChhKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGEpOyAvLyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBvd24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYoYXJyYXlNb2RlID09PSAnc3RyaWN0Jyl7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IFsgYVtrZXlzW2ldXSBdO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IGFba2V5c1tpXV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuLyogZXhwb3J0cy5tZXJnZSA9ZnVuY3Rpb24gKGIsYSl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGIsYSk7XG59ICovXG5cbmV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbih2KSB7XG4gIGlmIChleHBvcnRzLmlzRXhpc3QodikpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8vIGNvbnN0IGZha2VDYWxsID0gZnVuY3Rpb24oYSkge3JldHVybiBhO307XG4vLyBjb25zdCBmYWtlQ2FsbE5vUmV0dXJuID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpIHtcbiAgdmFyIG5ld09wdGlvbnMgPSB7fTtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRpb25zOyAvL2lmIHRoZXJlIGFyZSBub3Qgb3B0aW9uc1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IG9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59O1xuXG5leHBvcnRzLmRvZXNNYXRjaCA9IGRvZXNNYXRjaDtcbmV4cG9ydHMuZG9lc05vdE1hdGNoID0gZG9lc05vdE1hdGNoO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICBsb2NhbGVSYW5nZTogJ2EtekEtWicsXG59O1xuXG5jb25zdCBwcm9wcyA9IFsnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsICdsb2NhbGVSYW5nZSddO1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHV0aWwuYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuXG4gIGNvbnN0IHRhZ3MgPSBbXTtcbiAgbGV0IHRhZ0ZvdW5kID0gZmFsc2U7XG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIGNvbnN0IHJlZ3hBdHRyTmFtZSA9IG5ldyBSZWdFeHAoJ15bX3ddW1xcXFx3XFxcXC0uOl0qJCcucmVwbGFjZSgnX3cnLCAnXycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGNvbnN0IHJlZ3hUYWdOYW1lID0gbmV3IFJlZ0V4cCgnXihbd118XylbXFxcXHcuXFxcXC1fOl0qJy5yZXBsYWNlKCcoW3cnLCAnKFsnICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAvL3N0YXJ0aW5nIG9mIHRhZ1xuICAgICAgLy9yZWFkIHVudGlsIHlvdSByZWFjaCB0byAnPicgYXZvaWRpbmcgYW55ICc+JyBpbiBhdHRyaWJ1dGUgdmFsdWVcblxuICAgICAgaSsrO1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc/Jykge1xuICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgIGlmIChpLmVycikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIDtcbiAgICAgICAgICBpIDwgeG1sRGF0YS5sZW5ndGggJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnPicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnICcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFx0JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXG4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xccic7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIHRhZ05hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50cmltKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGFnTmFtZSk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYXR0cmlidXRlc1xuICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cmluZygwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGVUYWdOYW1lKHRhZ05hbWUsIHJlZ3hUYWdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdUYWcgJyArIHRhZ05hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnQXR0cmlidXRlcyBmb3IgXCInICsgdGFnTmFtZSArICdcIiBoYXZlIG9wZW4gcXVvdGUuJ319O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyU3RyID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICAgIGlmIChhdHRyU3RyW2F0dHJTdHIubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGF0dHJTdHIgPSBhdHRyU3RyLnN1YnN0cmluZygwLCBhdHRyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsb3NpbmdUYWcpIHtcbiAgICAgICAgICBpZighcmVzdWx0LnRhZ0Nsb3NlZCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgZG9uJ3QgaGF2ZSBwcm9wZXIgY2xvc2luZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1lbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgY2FuJ3QgaGF2ZSBhdHRyaWJ1dGVzIG9yIGludmFsaWQgc3RhcnRpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3RnID0gdGFncy5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSBvdGcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnICcgKyBvdGcgKyAnIGlzIGV4cGVjdGVkIGlucGxhY2Ugb2YgJyArIHRhZ05hbWUgKyAnLid9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3MucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NraXAgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgLy9JdCBtYXkgaW5jbHVkZSBjb21tZW50cyBhbmQgQ0RBVEEgdmFsdWVcbiAgICAgICAgZm9yIChpKys7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaSArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgLy9jb21tZW50IG9yIENBREFUQVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcgJyB8fCB4bWxEYXRhW2ldID09PSAnXFx0JyB8fCB4bWxEYXRhW2ldID09PSAnXFxuJyB8fCB4bWxEYXRhW2ldID09PSAnXFxyJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRDaGFyJywgbXNnOiAnY2hhciAnICsgeG1sRGF0YVtpXSArICcgaXMgbm90IGV4cGVjdGVkIC4nfX07XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdTdGFydCB0YWcgZXhwZWN0ZWQuJ319O1xuICB9IGVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ0ludmFsaWQgJyArIEpTT04uc3RyaW5naWZ5KHRhZ3MsIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpICsgJyBmb3VuZC4nfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlYWQgUHJvY2Vzc2luZyBpbnNzdHJ1Y3Rpb25zIGFuZCBza2lwXG4gKiBAcGFyYW0geyp9IHhtbERhdGFcbiAqIEBwYXJhbSB7Kn0gaVxuICovXG5mdW5jdGlvbiByZWFkUEkoeG1sRGF0YSwgaSkge1xuICB2YXIgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgdmFyIHRhZ25hbWUgPSB4bWxEYXRhLnN1YnN0cihzdGFydCwgaSAtIHN0YXJ0KTtcbiAgICAgIGlmIChpID4gNSAmJiB0YWduYW1lID09PSAneG1sJykge1xuICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnWE1MIGRlY2xhcmF0aW9uIGFsbG93ZWQgb25seSBhdCB0aGUgc3RhcnQgb2YgdGhlIGRvY3VtZW50Lid9fTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG52YXIgZG91YmxlUXVvdGUgPSAnXCInO1xudmFyIHNpbmdsZVF1b3RlID0gXCInXCI7XG5cbi8qKlxuICogS2VlcCByZWFkaW5nIHhtbERhdGEgdW50aWwgJzwnIGlzIGZvdW5kIG91dHNpZGUgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5mdW5jdGlvbiByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpIHtcbiAgbGV0IGF0dHJTdHIgPSAnJztcbiAgbGV0IHN0YXJ0Q2hhciA9ICcnO1xuICBsZXQgdGFnQ2xvc2VkID0gZmFsc2U7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSBkb3VibGVRdW90ZSB8fCB4bWxEYXRhW2ldID09PSBzaW5nbGVRdW90ZSkge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgc3RhcnRDaGFyID0geG1sRGF0YVtpXTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnRDaGFyICE9PSB4bWxEYXRhW2ldKSB7XG4gICAgICAgIC8vaWYgdmF1ZSBpcyBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZSB0aGVuIHNpbmdsZSBxdW90ZXMgYXJlIGFsbG93ZWQgaW5zaWRlIHRoZSB2YWx1ZSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHt2YWx1ZTogYXR0clN0ciwgaW5kZXg6IGksIHRhZ0Nsb3NlZDogdGFnQ2xvc2VkfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgYWxsIHRoZSBhdHRyaWJ1dGVzIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZC5cbiAqL1xuY29uc3QgdmFsaWRBdHRyU3RyUmVneHAgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKShbXlxcXFxzPV0rKShcXFxccyo9KT8oXFxcXHMqKFtcXCdcIl0pKChbXFxcXHNcXFxcU10pKj8pXFxcXDUpPycsICdnJyk7XG5cbi8vYXR0ciwgPVwic2RcIiwgYT1cImFtaXQnc1wiLCBhPVwic2RcImI9XCJzYWZcIiwgYWIgIGNkPVwiXCJcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vY29uc29sZS5sb2cobWF0Y2hlc1tpXSk7XG5cbiAgICBpZiAobWF0Y2hlc1tpXVsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vbm9zcGFjZSBiZWZvcmUgYXR0cmlidXRlIG5hbWU6IGE9XCJzZFwiYj1cInNhZlwiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLid9fTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gPT09IHVuZGVmaW5lZCAmJiAhb3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAvL2luZGVwZW5kZW50IGF0dHJpYnV0ZTogYWJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYm9vbGVhbiBhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGlzIG5vdCBhbGxvd2VkLid9fTtcbiAgICB9XG4gICAgLyogZWxzZSBpZihtYXRjaGVzW2ldWzZdID09PSB1bmRlZmluZWQpey8vYXR0cmlidXRlIHdpdGhvdXQgdmFsdWU6IGFiPVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IHsgY29kZTpcIkludmFsaWRBdHRyXCIsbXNnOlwiYXR0cmlidXRlIFwiICsgbWF0Y2hlc1tpXVsyXSArIFwiIGhhcyBubyB2YWx1ZSBhc3NpZ25lZC5cIn19O1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICBjb25zdCBhdHRyTmFtZSA9IG1hdGNoZXNbaV1bMl07XG4gICAgaWYgKCF2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpKSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgfVxuICAgIC8qaWYgKCFhdHRyTmFtZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7Ki9cbiAgICBpZiAoICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck5hbWVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyByZXBlYXRlZC4nfX07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gL15bX2EtekEtWl1bXFx3XFwtLjpdKiQvO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpIHtcbiAgLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSBuZXcgUmVnRXhwKHJlZ3hBdHRyTmFtZSk7XG4gIHJldHVybiB1dGlsLmRvZXNNYXRjaChhdHRyTmFtZSwgcmVneEF0dHJOYW1lKTtcbn1cblxuLy9jb25zdCBzdGFydHNXaXRoWE1MID0gbmV3IFJlZ0V4cChcIl5bWHhdW01tXVtMbF1cIik7XG4vLyAgc3RhcnRzV2l0aCA9IC9eKFthLXpBLVpdfF8pW1xcdy5cXC1fOl0qLztcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKSB7XG4gIC8qaWYodXRpbC5kb2VzTWF0Y2godGFnbmFtZSxzdGFydHNXaXRoWE1MKSkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UqL1xuICByZXR1cm4gIXV0aWwuZG9lc05vdE1hdGNoKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YWduYW1lLCBwYXJlbnQsIHZhbCkge1xuICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5jaGlsZCA9IHt9OyAvL2NoaWxkIHRhZ3NcbiAgdGhpcy5hdHRyc01hcCA9IHt9OyAvL2F0dHJpYnV0ZXMgbWFwXG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy52YWwgPSB2YWw7IC8vdGV4dCBvbmx5XG4gIHRoaXMuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSkpIHtcbiAgICAgIC8vYWxyZWFkeSBwcmVzZW50c1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXS5wdXNoKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSA9IFtjaGlsZF07XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgeG1sTm9kZSA9IHJlcXVpcmUoJy4veG1sTm9kZScpO1xuY29uc3QgVGFnVHlwZSA9IHtPUEVOSU5HOiAxLCBDTE9TSU5HOiAyLCBTRUxGOiAzLCBDREFUQTogNH07XG5sZXQgcmVneCA9XG4gICc8KCghXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KShdXT4pKXwoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpKFtePl0qKT58KChcXFxcLykoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpXFxcXHMqPikpKFtePF0qKSc7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbi8vcG9seWZpbGxcbmlmICghTnVtYmVyLnBhcnNlSW50ICYmIHdpbmRvdy5wYXJzZUludCkge1xuICBOdW1iZXIucGFyc2VJbnQgPSB3aW5kb3cucGFyc2VJbnQ7XG59XG5pZiAoIU51bWJlci5wYXJzZUZsb2F0ICYmIHdpbmRvdy5wYXJzZUZsb2F0KSB7XG4gIE51bWJlci5wYXJzZUZsb2F0ID0gd2luZG93LnBhcnNlRmxvYXQ7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnQF8nLFxuICBhdHRyTm9kZU5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGlnbm9yZU5hbWVTcGFjZTogZmFsc2UsXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZU5vZGVWYWx1ZTogdHJ1ZSxcbiAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gIGFycmF5TW9kZTogZmFsc2UsXG4gIHRyaW1WYWx1ZXM6IHRydWUsIC8vVHJpbSBzdHJpbmcgdmFsdWVzIG9mIHRhZyBhbmQgYXR0cmlidXRlc1xuICBjZGF0YVRhZ05hbWU6IGZhbHNlLFxuICBjZGF0YVBvc2l0aW9uQ2hhcjogJ1xcXFxjJyxcbiAgbG9jYWxlUmFuZ2U6ICcnLFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgc3RvcE5vZGVzOiBbXVxuICAvL2RlY29kZVN0cmljdDogZmFsc2UsXG59O1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmNvbnN0IHByb3BzID0gW1xuICAnYXR0cmlidXRlTmFtZVByZWZpeCcsXG4gICdhdHRyTm9kZU5hbWUnLFxuICAndGV4dE5vZGVOYW1lJyxcbiAgJ2lnbm9yZUF0dHJpYnV0ZXMnLFxuICAnaWdub3JlTmFtZVNwYWNlJyxcbiAgJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLFxuICAncGFyc2VOb2RlVmFsdWUnLFxuICAncGFyc2VBdHRyaWJ1dGVWYWx1ZScsXG4gICdhcnJheU1vZGUnLFxuICAndHJpbVZhbHVlcycsXG4gICdjZGF0YVRhZ05hbWUnLFxuICAnY2RhdGFQb3NpdGlvbkNoYXInLFxuICAnbG9jYWxlUmFuZ2UnLFxuICAndGFnVmFsdWVQcm9jZXNzb3InLFxuICAnYXR0clZhbHVlUHJvY2Vzc29yJyxcbiAgJ3BhcnNlVHJ1ZU51bWJlck9ubHknLFxuICAnc3RvcE5vZGVzJ1xuXTtcbmV4cG9ydHMucHJvcHMgPSBwcm9wcztcblxuY29uc3QgZ2V0VHJhdmVyc2FsT2JqID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvXFxyP1xcbi9nLCBcIiBcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIHhtbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLzwhLS1bXFxzXFxTXSo/LS0+L2csICcnKTsgLy9SZW1vdmUgIGNvbW1lbnRzXG5cbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuXG4gIHJlZ3ggPSByZWd4LnJlcGxhY2UoL1xcW1xcXFx3L2csICdbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UgKyAnXFxcXHcnKTtcbiAgY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKHJlZ3gsICdnJyk7XG4gIGxldCB0YWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICBsZXQgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIHdoaWxlICh0YWcpIHtcbiAgICBjb25zdCB0YWdUeXBlID0gY2hlY2tGb3JUYWdUeXBlKHRhZyk7XG5cbiAgICBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DTE9TSU5HKSB7XG4gICAgICAvL2FkZCBwYXJzZWQgZGF0YSB0byBwYXJlbnQgbm9kZVxuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudCAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnBhcmVudC52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnBhcmVudC52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zLCBjdXJyZW50Tm9kZS5wYXJlbnQudGFnbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGN1cnJlbnROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmNoaWxkID0gW11cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmF0dHJzTWFwID09IHVuZGVmaW5lZCkgeyBjdXJyZW50Tm9kZS5hdHRyc01hcCA9IHt9fVxuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB4bWxEYXRhLnN1YnN0cihjdXJyZW50Tm9kZS5zdGFydEluZGV4ICsgMSwgdGFnLmluZGV4IC0gY3VycmVudE5vZGUuc3RhcnRJbmRleCAtIDEpXG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0RBVEEpIHtcbiAgICAgIGlmIChvcHRpb25zLmNkYXRhVGFnTmFtZSkge1xuICAgICAgICAvL2FkZCBjZGF0YSBub2RlXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuY2RhdGFUYWdOYW1lLCBjdXJyZW50Tm9kZSwgdGFnWzNdKTtcbiAgICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIC8vZm9yIGJhY2t0cmFja2luZ1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyO1xuICAgICAgICAvL2FkZCByZXN0IHZhbHVlIHRvIHBhcmVudCBub2RlXG4gICAgICAgIGlmICh0YWdbMTRdKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUudmFsICs9IHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSAoY3VycmVudE5vZGUudmFsIHx8ICcnKSArICh0YWdbM10gfHwgJycpICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLlNFTEYpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLCBjdXJyZW50Tm9kZSwgJycpO1xuICAgICAgaWYgKHRhZ1s4XSAmJiB0YWdbOF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdbOF0gPSB0YWdbOF0uc3Vic3RyKDAsIHRhZ1s4XS5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UYWdUeXBlLk9QRU5JTkdcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKFxuICAgICAgICBvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpXG4gICAgICApO1xuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjaGlsZE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY2hpbGROb2RlLnN0YXJ0SW5kZXg9dGFnLmluZGV4ICsgdGFnWzFdLmxlbmd0aFxuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjaGlsZE5vZGU7XG4gICAgfVxuXG4gICAgdGFnID0gbmV4dFRhZztcbiAgICBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgfVxuXG4gIHJldHVybiB4bWxPYmo7XG59O1xuXG5mdW5jdGlvbiBwcm9jZXNzVGFnVmFsdWUocGFyc2VkVGFncywgb3B0aW9ucywgcGFyZW50VGFnTmFtZSkge1xuICBjb25zdCB0YWdOYW1lID0gcGFyc2VkVGFnc1s3XSB8fCBwYXJlbnRUYWdOYW1lO1xuICBsZXQgdmFsID0gcGFyc2VkVGFnc1sxNF07XG4gIGlmICh2YWwpIHtcbiAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgIH1cbiAgICB2YWwgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHZhbCwgdGFnTmFtZSk7XG4gICAgdmFsID0gcGFyc2VWYWx1ZSh2YWwsIG9wdGlvbnMucGFyc2VOb2RlVmFsdWUsIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seSk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclRhZ1R5cGUobWF0Y2gpIHtcbiAgaWYgKG1hdGNoWzRdID09PSAnXV0+Jykge1xuICAgIHJldHVybiBUYWdUeXBlLkNEQVRBO1xuICB9IGVsc2UgaWYgKG1hdGNoWzEwXSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0xPU0lORztcbiAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbOF0gIT09ICd1bmRlZmluZWQnICYmIG1hdGNoWzhdLnN1YnN0cihtYXRjaFs4XS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuU0VMRjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVGFnVHlwZS5PUEVOSU5HO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYW1lU3BhY2UodGFnbmFtZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGxldCBwYXJzZWQ7XG4gICAgaWYgKHZhbC50cmltKCkgPT09ICcnIHx8IGlzTmFOKHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IHZhbCA9PT0gJ3RydWUnID8gdHJ1ZSA6IHZhbCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsLmluZGV4T2YoJzB4JykgIT09IC0xKSB7XG4gICAgICAgIC8vc3VwcG9ydCBoZXhhIGRlY2ltYWxcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTYpO1xuICAgICAgfSBlbHNlIGlmICh2YWwuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgICAgICAgcGFyc2VkID0gU3RyaW5nKHBhcnNlZCkgPT09IHZhbCA/IHBhcnNlZCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKC4qPylcXFxcMyk/JywgJ2cnKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMgJiYgdHlwZW9mIGF0dHJTdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgYXR0clN0ciA9IGF0dHJTdHIucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIC8vYXR0clN0ciA9IGF0dHJTdHIgfHwgYXR0clN0ci50cmltKCk7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIGF0dHJzUmVneCk7XG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gcmVzb2x2ZU5hbWVTcGFjZShtYXRjaGVzW2ldWzFdLCBvcHRpb25zKTtcbiAgICAgIGlmIChhdHRyTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1hdGNoZXNbaV1bNF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBtYXRjaGVzW2ldWzRdLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG9wdGlvbnMuYXR0clZhbHVlUHJvY2Vzc29yKG1hdGNoZXNbaV1bNF0sIGF0dHJOYW1lKTtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSBwYXJzZVZhbHVlKFxuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXR0ck5vZGVOYW1lKSB7XG4gICAgICBjb25zdCBhdHRyQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgYXR0ckNvbGxlY3Rpb25bb3B0aW9ucy5hdHRyTm9kZU5hbWVdID0gYXR0cnM7XG4gICAgICByZXR1cm4gYXR0ckNvbGxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxufVxuXG5leHBvcnRzLmdldFRyYXZlcnNhbE9iaiA9IGdldFRyYXZlcnNhbE9iajtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuXG4vKipcbiAqIEdlbmVyaWMgYW5pbWF0aW9uIGNsYXNzIHdpdGggc3VwcG9ydCBmb3IgZHJvcHBlZCBmcmFtZXMgYm90aCBvcHRpb25hbCBlYXNpbmcgYW5kIGR1cmF0aW9uLlxuICpcbiAqIE9wdGlvbmFsIGR1cmF0aW9uIGlzIHVzZWZ1bCB3aGVuIHRoZSBsaWZldGltZSBpcyBkZWZpbmVkIGJ5IGFub3RoZXIgY29uZGl0aW9uIHRoYW4gdGltZVxuICogZS5nLiBzcGVlZCBvZiBhbiBhbmltYXRpbmcgb2JqZWN0LCBldGMuXG4gKlxuICogRHJvcHBlZCBmcmFtZSBsb2dpYyBhbGxvd3MgdG8ga2VlcCB1c2luZyB0aGUgc2FtZSB1cGRhdGVyIGxvZ2ljIGluZGVwZW5kZW50IGZyb20gdGhlIGFjdHVhbFxuICogcmVuZGVyaW5nLiBUaGlzIGVhc2VzIGEgbG90IG9mIGNhc2VzIHdoZXJlIGl0IG1pZ2h0IGJlIHByZXR0eSBjb21wbGV4IHRvIGJyZWFrIGRvd24gYSBzdGF0ZVxuICogYmFzZWQgb24gdGhlIHB1cmUgdGltZSBkaWZmZXJlbmNlLlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KU1xuICAgICAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KChyb290LmFuaW1hdGUgPSB7fSkpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICB2YXIgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93XG4gICAgdmFyIHRpbWUgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiArbmV3IERhdGUoKTtcbiAgICB9O1xuICAgIHZhciBkZXNpcmVkRnJhbWVzID0gNjA7XG4gICAgdmFyIG1pbGxpc2Vjb25kc1BlclNlY29uZCA9IDEwMDA7XG4gICAgdmFyIHJ1bm5pbmcgPSB7fTtcbiAgICB2YXIgY291bnRlciA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgZ2l2ZW4gYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIHdhcyBzdG9wcGVkIChha2EsIHdhcyBydW5uaW5nIGJlZm9yZSlcbiAgICAgKi9cbiAgICBleHBvcnRzLnN0b3AgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmFyIGNsZWFyZWQgPSAocnVubmluZ1tpZF0gIT09IG51bGwpO1xuICAgICAgICBpZiAoY2xlYXJlZCkge1xuICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFyZWQ7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgZ2l2ZW4gYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZ1xuICAgICAqL1xuICAgIGV4cG9ydHMuaXNSdW5uaW5nID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBydW5uaW5nW2lkXSAhPT0gbnVsbDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0ZXBDYWxsYmFjayB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZnVuY3Rpb24gd2hpY2ggaXMgZXhlY3V0ZWQgb24gZXZlcnkgc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCwgbm93LCB2aXJ0dWFsKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIHZlcmlmeUNhbGxiYWNrIHtGdW5jdGlvbn0gRXhlY3V0ZWQgYmVmb3JlIGV2ZXJ5IGFuaW1hdGlvbiBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gY29tcGxldGVkQ2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihkcm9wcGVkRnJhbWVzLCBmaW5pc2hlZEFuaW1hdGlvbiwgb3B0aW9uYWwgd2FzRmluaXNoZWQpIHt9YFxuICAgICAqIEBwYXJhbSBkdXJhdGlvbiB7SW50ZWdlcn0gTWlsbGlzZWNvbmRzIHRvIHJ1biB0aGUgYW5pbWF0aW9uXG4gICAgICogQHBhcmFtIGVhc2luZ01ldGhvZCB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZWFzaW5nIGZ1bmN0aW9uXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQpIHsgcmV0dXJuIG1vZGlmaWVkVmFsdWU7IH1gXG4gICAgICogQHBhcmFtIHJvb3Qge0VsZW1lbnR9IFJlbmRlciByb290LiBVc2VkIGZvciBpbnRlcm5hbCB1c2FnZSBvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gSWRlbnRpZmllciBvZiBhbmltYXRpb24uIENhbiBiZSB1c2VkIHRvIHN0b3AgaXQgYW55IHRpbWUuXG4gICAgICovXG4gICAgZXhwb3J0cy5zdGFydCA9IGZ1bmN0aW9uIChzdGVwQ2FsbGJhY2ssIHZlcmlmeUNhbGxiYWNrLCBjb21wbGV0ZWRDYWxsYmFjaywgZHVyYXRpb24sIGVhc2luZ01ldGhvZCwgcm9vdCkge1xuICAgICAgICB2YXIgc3RhcnQgPSB0aW1lKCk7XG4gICAgICAgIHZhciBsYXN0RnJhbWUgPSBzdGFydDtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSAwO1xuICAgICAgICB2YXIgZHJvcENvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgaWQgPSBjb3VudGVyKys7XG5cbiAgICAgICAgLy8gQ29tcGFjdGluZyBydW5uaW5nIGRiIGF1dG9tYXRpY2FsbHkgZXZlcnkgZmV3IG5ldyBhbmltYXRpb25zXG4gICAgICAgIGlmIChpZCAlIDIwID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgbmV3UnVubmluZyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgdXNlZElkIGluIHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBuZXdSdW5uaW5nW3VzZWRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVubmluZyA9IG5ld1J1bm5pbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBpbnRlcm5hbCBzdGVwIG1ldGhvZCB3aGljaCBpcyBjYWxsZWQgZXZlcnkgZmV3IG1pbGxpc2Vjb25kc1xuICAgICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uICh2aXJ0dWFsKSB7XG5cbiAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSB2aXJ0dWFsIHZhbHVlXG4gICAgICAgICAgICB2YXIgcmVuZGVyID0gdmlydHVhbCAhPT0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gR2V0IGN1cnJlbnQgdGltZVxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUoKTtcblxuICAgICAgICAgICAgLy8gVmVyaWZpY2F0aW9uIGlzIGV4ZWN1dGVkIGJlZm9yZSBuZXh0IGFuaW1hdGlvbiBzdGVwXG4gICAgICAgICAgICBpZiAoIXJ1bm5pbmdbaWRdIHx8ICh2ZXJpZnlDYWxsYmFjayAmJiAhdmVyaWZ5Q2FsbGJhY2soaWQpKSkge1xuXG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgdGhlIGN1cnJlbnQgcmVuZGVyaW5nIHRvIGFwcGx5IGxldCdzIHVwZGF0ZSBvbWl0dGVkIHN0ZXBzIGluIG1lbW9yeS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IHRvIGJyaW5nIGludGVybmFsIHN0YXRlIHZhcmlhYmxlcyB1cC10by1kYXRlIHdpdGggcHJvZ3Jlc3MgaW4gdGltZS5cbiAgICAgICAgICAgIGlmIChyZW5kZXIpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkcm9wcGVkRnJhbWVzID0gTWF0aC5yb3VuZCgobm93IC0gbGFzdEZyYW1lKSAvIChtaWxsaXNlY29uZHNQZXJTZWNvbmQgLyBkZXNpcmVkRnJhbWVzKSkgLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTWF0aC5taW4oZHJvcHBlZEZyYW1lcywgNCk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBzdGVwKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBkcm9wQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21wdXRlIHBlcmNlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAobm93IC0gc3RhcnQpIC8gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXhlY3V0ZSBzdGVwIGNhbGxiYWNrLCB0aGVuLi4uXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBlYXNpbmdNZXRob2QgPyBlYXNpbmdNZXRob2QocGVyY2VudCkgOiBwZXJjZW50O1xuICAgICAgICAgICAgaWYgKChzdGVwQ2FsbGJhY2sodmFsdWUsIG5vdywgcmVuZGVyKSA9PT0gZmFsc2UgfHwgcGVyY2VudCA9PT0gMSkgJiYgcmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgcGVyY2VudCA9PT0gMSB8fCBkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgbGFzdEZyYW1lID0gbm93O1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXJrIGFzIHJ1bm5pbmdcbiAgICAgICAgcnVubmluZ1tpZF0gPSB0cnVlO1xuXG4gICAgICAgIC8vIEluaXQgZmlyc3Qgc3RlcFxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIHVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59KSk7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cbmltcG9ydCBhbmltYXRlIGZyb20gJy4vYW5pbWF0ZSc7XG52YXIgTk9PUCA9IGZ1bmN0aW9uICgpIHsgfTtcblxuLy8gRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDMpICsgMSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VJbk91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge1xuICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsIDMpO1xuICB9XG5cbiAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksIDMpICsgMik7XG59O1xuXG5cbi8qKlxuICogQSBwdXJlIGxvZ2ljICdjb21wb25lbnQnIGZvciAndmlydHVhbCcgc2Nyb2xsaW5nL3pvb21pbmcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHgtYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWDogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geS1heGlzICovXG4gICAgICBzY3JvbGxpbmdZOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGFuaW1hdGlvbnMgZm9yIGRlY2VsZXJhdGlvbiwgc25hcCBiYWNrLCB6b29taW5nIGFuZCBzY3JvbGxpbmcgKi9cbiAgICAgIGFuaW1hdGluZzogdHJ1ZSxcblxuICAgICAgLyoqIGR1cmF0aW9uIGZvciBhbmltYXRpb25zIHRyaWdnZXJlZCBieSBzY3JvbGxUby96b29tVG8gKi9cbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAyNTAsXG5cbiAgICAgIC8qKiBFbmFibGUgYm91bmNpbmcgKGNvbnRlbnQgY2FuIGJlIHNsb3dseSBtb3ZlZCBvdXRzaWRlIGFuZCBqdW1wcyBiYWNrIGFmdGVyIHJlbGVhc2luZykgKi9cbiAgICAgIGJvdW5jaW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGxvY2tpbmcgdG8gdGhlIG1haW4gYXhpcyBpZiB1c2VyIG1vdmVzIG9ubHkgc2xpZ2h0bHkgb24gb25lIG9mIHRoZW0gYXQgc3RhcnQgKi9cbiAgICAgIGxvY2tpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgcGFnaW5hdGlvbiBtb2RlIChzd2l0Y2hpbmcgYmV0d2VlbiBmdWxsIHBhZ2UgY29udGVudCBwYW5lcykgKi9cbiAgICAgIHBhZ2luZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgc25hcHBpbmcgb2YgY29udGVudCB0byBhIGNvbmZpZ3VyZWQgcGl4ZWwgZ3JpZCAqL1xuICAgICAgc25hcHBpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHpvb21pbmcgb2YgY29udGVudCB2aWEgQVBJLCBmaW5nZXJzIGFuZCBtb3VzZSB3aGVlbCAqL1xuICAgICAgem9vbWluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBNaW5pbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1pblpvb206IDAuNSxcblxuICAgICAgLyoqIE1heGltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWF4Wm9vbTogMyxcblxuICAgICAgLyoqIE11bHRpcGx5IG9yIGRlY3JlYXNlIHNjcm9sbGluZyBzcGVlZCAqKi9cbiAgICAgIHNwZWVkTXVsdGlwbGllcjogMSxcblxuICAgICAgLyoqIENhbGxiYWNrIHRoYXQgaXMgZmlyZWQgb24gdGhlIGxhdGVyIG9mIHRvdWNoIGVuZCBvciBkZWNlbGVyYXRpb24gZW5kLFxuICAgICAgICAgIHByb3ZpZGVkIHRoYXQgYW5vdGhlciBzY3JvbGxpbmcgYWN0aW9uIGhhcyBub3QgYmVndW4uIFVzZWQgdG8ga25vd1xuICAgICAgICAgIHdoZW4gdG8gZmFkZSBvdXQgYSBzY3JvbGxiYXIuICovXG4gICAgICBzY3JvbGxpbmdDb21wbGV0ZTogTk9PUCxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25EZWNlbGVyYXRpb246IDAuMDMsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBhY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uOiAwLjA4XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICBJTlRFUk5BTCBGSUVMRFMgOjogU1RBVFVTXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBvbmx5IGEgc2luZ2xlIGZpbmdlciBpcyB1c2VkIGluIHRvdWNoIGhhbmRsaW5nICovXG4gIF9faXNTaW5nbGVUb3VjaCA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIHRvdWNoIGV2ZW50IHNlcXVlbmNlIGlzIGluIHByb2dyZXNzICovXG4gIF9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24gd2VudCB0byBjb21wbGV0aW9uLiAqL1xuICBfX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIGEgZ2VzdHVyZSB6b29tL3JvdGF0ZSBldmVudCBpcyBpbiBwcm9ncmVzcy4gQWN0aXZhdGVzIHdoZW5cbiAgICogYSBnZXN0dXJlc3RhcnQgZXZlbnQgaGFwcGVucy4gVGhpcyBoYXMgaGlnaGVyIHByaW9yaXR5IHRoYW4gZHJhZ2dpbmcuXG4gICAqL1xuICBfX2lzR2VzdHVyaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIHRoZSB1c2VyIGhhcyBtb3ZlZCBieSBzdWNoIGEgZGlzdGFuY2UgdGhhdCB3ZSBoYXZlIGVuYWJsZWRcbiAgICogZHJhZ2dpbmcgbW9kZS4gSGludCA9IEl0J3Mgb25seSBlbmFibGVkIGFmdGVyIHNvbWUgcGl4ZWxzIG9mIG1vdmVtZW50IHQ7XG4gICAqIG5vdCBpbnRlcnJ1cHQgd2l0aCBjbGlja3MgZXRjLlxuICAgKi9cbiAgX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBOb3QgdG91Y2hpbmcgYW5kIGRyYWdnaW5nIGFueW1vcmUsIGFuZCBzbW9vdGhseSBhbmltYXRpbmcgdGhlXG4gICAqIHRvdWNoIHNlcXVlbmNlIHVzaW5nIGRlY2VsZXJhdGlvbi5cbiAgICovXG4gIF9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFNtb290aGx5IGFuaW1hdGluZyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgY2hhbmdlXG4gICAqL1xuICBfX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IERJTUVOU0lPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGxlZnQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHJpZ2h0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50VG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHdpZHRoICovXG4gIF9fY2xpZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgaGVpZ2h0ICovXG4gIF9fY2xpZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIHdpZHRoICovXG4gIF9fY29udGVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIGhlaWdodCAqL1xuICBfX2NvbnRlbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGggZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwV2lkdGggPSAxMDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHQgZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwSGVpZ2h0ID0gMTAwO1xuXG4gIC8qKiB7TnVtYmVyfSBab29tIGxldmVsICovXG4gIF9fem9vbUxldmVsID0gMTtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX3Njcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fc2Nyb2xsVG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fbWF4U2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX21heFNjcm9sbFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIGxlZnQgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZExlZnQgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB0b3AgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHpvb20gbGV2ZWwgKGZpbmFsIHNjYWxlIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFpvb20gPSAwO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBMQVNUIFBPU0lUSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7TnVtYmVyfSBMZWZ0IHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaExlZnQgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBUb3AgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoVG9wID0gbnVsbDtcblxuICAvKioge0RhdGV9IFRpbWVzdGFtcCBvZiBsYXN0IG1vdmUgb2YgZmluZ2VyLiBVc2VkIHRvIGxpbWl0IHRyYWNraW5nIHJhbmdlIGZvciBkZWNlbGVyYXRpb24gc3BlZWQuICovXG4gIF9fbGFzdFRvdWNoTW92ZSA9IG51bGw7XG5cbiAgLyoqIHtBcnJheX0gTGlzdCBvZiBwb3NpdGlvbnMsIHVzZXMgdGhyZWUgaW5kZXhlcyBmb3IgZWFjaCBzdGF0ZSA9IGxlZnQsIHRvcCwgdGltZXN0YW1wICo7XG4gIF9fcG9zaXRpb25zID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOiA9IERFQ0VMRVJBVElPTiBTVVBQT1I7XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBVQkxJQyBBUElcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgY2xpZW50IChvdXRlcikgYW5kIGNvbnRlbnQgKGlubmVyKSBlbGVtZW50cy5cbiAgICogUmVxdWlyZXMgdGhlIGF2YWlsYWJsZSBzcGFjZSBmb3IgdGhlIG91dGVyIGVsZW1lbnQgYW5kIHRoZSBvdXRlciBzaXplIG9mIHRoZSBpbm5lciBlbGVtZW50LlxuICAgKiBBbGwgdmFsdWVzIHdoaWNoIGFyZSBmYWxzeSAobnVsbCBvciB6ZXJvIGV0Yy4pIGFyZSBpZ25vcmVkIGFuZCB0aGUgb2xkIHZhbHVlIGlzIGtlcHQuXG4gICAqXG4gICAqIEBwYXJhbSBjbGllbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IElubmVyIHdpZHRoIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNsaWVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IElubmVyIGhlaWdodCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBPdXRlciB3aWR0aCBvZiBpbm5lciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgaGVpZ2h0IG9mIGlubmVyIGVsZW1lbnRcbiAgICovXG4gIHNldERpbWVuc2lvbnMoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0KSB7XG4gICAgLy8gT25seSB1cGRhdGUgdmFsdWVzIHdoaWNoIGFyZSBkZWZpbmVkXG4gICAgaWYgKGNsaWVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50V2lkdGggPSBjbGllbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY2xpZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50SGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChjb250ZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50V2lkdGggPSBjb250ZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50SGVpZ2h0ID0gY29udGVudEhlaWdodDtcbiAgICB9XG5cbiAgICAvLyBSZWZyZXNoIG1heGltdW1zXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcblxuICAgIC8vIFJlZnJlc2ggc2Nyb2xsIHBvc2l0aW9uXG4gICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgZmFsc2UpO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqL1xuICBzZXRQb3NpdGlvbihsZWZ0LCB0b3ApIHtcbiAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICB0aGlzLl9fY2xpZW50VG9wID0gdG9wIHx8IDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAqXG4gICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAqL1xuICBzZXRTbmFwU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fX3NuYXBXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAqL1xuICBnZXRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fc2Nyb2xsVG9wLFxuICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoIC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIGJvdHRvbTogdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19jbGllbnRIZWlnaHQgLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFBvaW50KHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgIHRvcDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICovXG4gIGdldFNjcm9sbE1heCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAqXG4gICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbVRvKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjYWxsYmFjayBpZiBleGlzdHNcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICBpZiAoZml4ZWRMZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkVG9wID0gdGhpcy5fX2NsaWVudEhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBzY3JvbGwgcG9zaXRpb25zIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsLlxuICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAvLyAqIEZpeGVkIHBvaW50LCAkRiQsIHJlbWFpbnMgc3RhdGlvbmFyeSBpbiBjb250ZW50IHNwYWNlIGFuZCBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydC5cbiAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEZpbmFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfZiQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAvL1xuICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pL2tfZiA9IChTX2YgLSBGKSQuXG4gICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAvL1xuICAgIC8vIEZpeGVkIHBvaW50IGxvY2F0aW9uLCAkXFx2ZWN0b3J7Zn0gPSAoRiAtIFNfaSkga19pJC5cbiAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgLSBcXHZlY3RvcntmfS9rX2YkLlxuICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgdmFyIGsgPSBsZXZlbCAvIG9sZExldmVsO1xuICAgIHZhciBsZWZ0ID0gayAqICh0aGlzLl9fc2Nyb2xsTGVmdCArIGZpeGVkTGVmdCkgLSBmaXhlZExlZnQ7XG4gICAgdmFyIHRvcCA9IGsgKiAodGhpcy5fX3Njcm9sbFRvcCArIGZpeGVkVG9wKSAtIGZpeGVkVG9wO1xuXG4gICAgLy8gTGltaXQgeC1heGlzXG4gICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgIGxlZnQgPSAwO1xuICAgIH1cblxuICAgIC8vIExpbWl0IHktYXhpc1xuICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIGxldmVsLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbUJ5KGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICovXG4gIHNjcm9sbFRvKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgfVxuXG4gICAgICBsZWZ0ICo9IHpvb207XG4gICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19zbmFwSGVpZ2h0KSAqIHRoaXMuX19zbmFwSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgIHRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxUb3AsIHRvcCksIDApO1xuXG4gICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgaWYgKGxlZnQgPT09IHRoaXMuX19zY3JvbGxMZWZ0ICYmIHRvcCA9PT0gdGhpcy5fX3Njcm9sbFRvcCkge1xuICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICovXG4gIHNjcm9sbEJ5KGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIHZhciBzdGFydFRvcCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRUb3AgOiB0aGlzLl9fc2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBFVkVOVCBDQUxMQkFDS1NcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogTW91c2Ugd2hlZWwgaGFuZGxlciBmb3Igem9vbWluZyBzdXBwb3J0XG4gICAqL1xuICBkb01vdXNlWm9vbSh3aGVlbERlbHRhLCB0aW1lU3RhbXAsIHBhZ2VYLCBwYWdlWSkge1xuICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hTdGFydCh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaW50ZXJydXB0ZWRBbmltYXRpb24gZmxhZ1xuICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG4gICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHRvdWNoIHBvc2l0aW9uc1xuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBtb3ZlIHRpbWUgc3RhbXBcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gMTtcblxuICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1k7XG5cbiAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgLy8gUmVzZXQgZGVjZWxlcmF0aW9uIGNvbXBsZXRlIGZsYWdcbiAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgIHRoaXMuX19pc0RyYWdnaW5nID0gIWlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBDbGVhcmluZyBkYXRhIHN0cnVjdHVyZVxuICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIG1vdmUgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFsxLjBdIHNjYWxlIC0gLi4uLlxuICAgKi9cbiAgZG9Ub3VjaE1vdmUodG91Y2hlcywgdGltZVN0YW1wLCBzY2FsZSkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuXG4gICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAvLyBBcmUgd2UgYWxyZWFkeSBpcyBkcmFnZ2luZyBtb2RlP1xuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGRpc3RhbmNlXG4gICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAvLyBSZWFkIHByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZ1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIGxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdFJlbCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fY2xpZW50TGVmdDtcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICBzY3JvbGxMZWZ0ID0gKChjdXJyZW50VG91Y2hMZWZ0UmVsICsgc2Nyb2xsTGVmdCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaExlZnRSZWw7XG4gICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmVZKVxuICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcblxuICAgICAgICBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wIHx8IHNjcm9sbFRvcCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGxpc3QgZnJvbSBncm93aW5nIGluZmluaXRlbHkgKGhvbGRpbmcgbWluIDEwLCBtYXggMjAgbWVhc3VyZSBwb2ludHMpXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFjayBzY3JvbGwgbW92ZW1lbnQgZm9yIGRlY2xlcmF0aW9uXG4gICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIGxldmVsKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMoY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0KTtcbiAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSAmJiBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoRW5kKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgLy8gQmUgc3VyZSB0byByZXNldCB0aGUgZHJhZ2dpbmcgZmxhZyBub3cuIEhlcmUgd2UgYWxzbyBkZXRlY3Qgd2hldGhlclxuICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICBpZiAodGhpcy5fX2lzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZyAmJiAodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpIDw9IDEwMCkge1xuICAgICAgICAvLyBUaGVuIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHdhcyBhYm91dCAxMDBtcyBhZ29cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG4gICAgICAgIHZhciBlbmRQb3MgPSBwb3NpdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICAgIC8vIE1vdmUgcG9pbnRlciB0byBwb3NpdGlvbiBtZWFzdXJlZCAxMDBtcyBhZ29cbiAgICAgICAgZm9yICh2YXIgaSA9IGVuZFBvczsgaSA+IDAgJiYgcG9zaXRpb25zW2ldID4gKHRoaXMuX19sYXN0VG91Y2hNb3ZlIC0gMTAwKTsgaSAtPSAzKSB7XG4gICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gcG9zaXRpb25zW2VuZFBvc10gLSBwb3NpdGlvbnNbc3RhcnRQb3NdO1xuICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgIC8vIEJhc2VkIG9uIDUwbXMgY29tcHV0ZSB0aGUgbW92ZW1lbnQgdG8gYXBwbHkgZm9yIGVhY2ggcmVuZGVyIHN0ZXBcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIHN0YXJ0IHRoZSBkZWNlbGVyYXRpb25cbiAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPiAxMDApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAvLyBUaGlzIGlzIHBsYWNlZCBvdXRzaWRlIHRoZSBjb25kaXRpb24gYWJvdmUgdG8gaW1wcm92ZSBlZGdlIGNhc2Ugc3RhYmlsaXR5XG4gICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgIGlmICghdGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfVxuXG4gICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgdGhpcy5fX3Bvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQUklWQVRFIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgKi9cbiAgX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAvLyBiYXNlZCBvbiB0aGUgY3VycmVudCBcImRyaXZlXCIgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgIHZhciBvbGRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgdmFyIGRpZmZMZWZ0ID0gbGVmdCAtIG9sZExlZnQ7XG4gICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21MZXZlbCA9IG9sZFpvb20gKyAoZGlmZlpvb20gKiBwZXJjZW50KTtcblxuICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pc0FuaW1hdGluZyA9PT0gaWQ7XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sobGVmdCwgdG9wLCB6b29tKTtcbiAgICAgIH1cblxuICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgKi9cbiAgX19jb21wdXRlU2Nyb2xsTWF4KHpvb21MZXZlbCkge1xuICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICB0aGlzLl9fbWF4U2Nyb2xsTGVmdCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50V2lkdGggKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgIHRoaXMuX19tYXhTY3JvbGxUb3AgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudEhlaWdodCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICovXG4gIF9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX21heFNjcm9sbFRvcCksIDApO1xuICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgIC8vIFdlIGxpbWl0IGRlY2VsZXJhdGlvbiBub3QgdG8gdGhlIG1pbi9tYXggdmFsdWVzIG9mIHRoZSBhbGxvd2VkIHJhbmdlLCBidXQgdG8gdGhlIHNpemUgb2YgdGhlIHZpc2libGUgY2xpZW50IGFyZWEuXG4gICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguZmxvb3Ioc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBjbGFzcyBtZXRob2RcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgdGhpcy5fX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcik7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICB2YXIgbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgPSB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMC4xO1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmltYXRlIHRvIGdyaWQgd2hlbiBzbmFwcGluZyBpcyBhY3RpdmUsIG90aGVyd2lzZSBqdXN0IGZpeCBvdXQtb2YtYm91bmRhcnkgcG9zaXRpb25zXG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgKi9cbiAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpIHtcblxuICAgIC8vXG4gICAgLy8gQ09NUFVURSBORVhUIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYO1xuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgLy9cbiAgICAvLyBIQVJEIExJTUlUIFNDUk9MTCBQT1NJVElPTiBGT1IgTk9OIEJPVU5DSU5HIE1PREVcbiAgICAvL1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgIGlmIChzY3JvbGxMZWZ0Rml4ZWQgIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnRGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgaWYgKHNjcm9sbFRvcEZpeGVkICE9PSBzY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wRml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSAwO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFNMT1cgRE9XTlxuICAgIC8vXG5cbiAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgLy8gdG8gc2xvdyBkb3duIHRoZSBwcm9jZXNzLiBUaGlzIHNob3VsZCBlbXVsYXRlIG5hdHVyYWwgYmVoYXZpb3Igd2hlcmVcbiAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAvL1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVYID0gMDtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICB2YXIgcGVuZXRyYXRpb25EZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgaWYgKHNjcm9sbExlZnQgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9wIDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfVxuXG4gICAgICAvLyBTbG93IGRvd24gdW50aWwgc2xvdyBlbm91Z2gsIHRoZW4gZmxpcCBiYWNrIHRvIHNuYXAgcG9zaXRpb25cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICs9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKz0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZW52IGZyb20gJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBCdXR0b24gfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQsIENhbGxiYWNrIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcbmNvbnN0IGltZ1Bvb2wgPSBuZXcgUG9vbCgnaW1nUG9vbCcpO1xuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sKCdiaXRNYXBQb29sJyk7XG5jb25zdCBkZWJ1Z0luZm8gPSBuZXcgRGVidWdJbmZvKCk7XG5cbmludGVyZmFjZSBJVmlld1BvcnQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElWaWV3UG9ydEJveCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIEV2ZW50SGFuZGxlckRhdGEge1xuICBoYXNFdmVudEJpbmQ6IGJvb2xlYW47XG4gIHRvdWNoTXNnOiB7XG4gICAgW2tleTogc3RyaW5nXTogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgfTtcbiAgaGFuZGxlcnM6IHtcbiAgICB0b3VjaFN0YXJ0OiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoTW92ZTogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaEVuZDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaENhbmNlbDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIElQbHVnaW48VD4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGluc3RhbGw6IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xuICB1bmluc3RhbGw/OiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiDpu5jorqTmmrTpnLIgTGF5b3V0IOeahOWunuS+i++8jOS9huWcqOafkOS6m+WcuuaZr+S4i++8jOWPr+iDvemcgOimgeWkmuS4qiBMYXlvdXQg5a6e5L6L77yM5Zug5q2kIExheW91dCDnsbvkuZ/mmrTpnLLlh7rljrtcbiAqIGNvbnN0IG15TGF5b3V0ID0gbmV3IExheW91dCh7XG4gKiAgIHN0eWxlOiB7XG4gKiAgICAgIHdpZHRoOiAwLFxuICogICAgICBoZWlnaHQ6IDAsXG4gKiAgIH0sXG4gKiAgbmFtZTogJ215TGF5b3V0TmFtZScsXG4gKiB9KTtcbiAqL1xuY2xhc3MgTGF5b3V0IGV4dGVuZHMgRWxlbWVudCB7XG4gIC8qKlxuICAgKiDlvZPliY0gTGF5b3V0IOeJiOacrO+8jOS4gOiIrOi3n+Wwj+a4uOaIj+aPkuS7tueJiOacrOWvuem9kFxuICAgKi9cbiAgcHVibGljIHZlcnNpb24gPSAnMS4wLjgnO1xuXG4gIGVudiA9IGVudjtcbiAgXG4gIC8qKlxuICAgKiBMYXlvdXQg5riy5p+T55qE55uu5qCH55S75biD5a+55bqU55qEIDJkIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZW5kZXJDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHJlbmRlcnBvcnQ6IElWaWV3UG9ydCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydDogSVZpZXdQb3J0Qm94ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gIH07XG5cbiAgLyoqXG4gICAqIOeUu+W4g+WwuuWvuOWSjOWunumZheiiq+a4suafk+WIsOWxj+W5leeahOeJqeeQhuWwuuWvuOavlFxuICAgKi9cbiAgcHVibGljIHZpZXdwb3J0U2NhbGUgPSAxO1xuICAvKipcbiAgICog55So5LqO5qCH6K+GdXBkYXRlVmlld1BvcnTmlrnms5XmmK/lkKbooqvosIPnlKjov4fkuobvvIzov5nlnKjlsI/muLjmiI/njq/looPpnZ7luLjph43opoFcbiAgICovXG4gIHB1YmxpYyBoYXNWaWV3UG9ydFNldCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDmnIDnu4jmuLLmn5PliLDlsY/luZXnmoTlt6bkuIrop5LniannkIblnZDmoIdcbiAgICovXG4gIHB1YmxpYyByZWFsTGF5b3V0Qm94OiB7XG4gICAgcmVhbFg6IG51bWJlcjtcbiAgICByZWFsWTogbnVtYmVyO1xuICB9ID0ge1xuICAgICAgcmVhbFg6IDAsXG4gICAgICByZWFsWTogMCxcbiAgICB9O1xuXG4gIHB1YmxpYyBiaXRNYXBGb250czogQml0TWFwRm9udFtdID0gW107XG4gIHB1YmxpYyBlbGVDb3VudCA9IDA7XG4gIHB1YmxpYyBzdGF0ZTogU1RBVEUgPSBTVEFURS5VTklOSVQ7XG5cbiAgLyoqXG4gICAqIOeUqOS6juWcqCB0aWNrZXIg55qE5b6q546v6YeM6Z2i5qCH6K+G5b2T5YmN5bin5piv5ZCm6ZyA6KaB6YeN57uYXG4gICAqIOmHjee7mOS4gOiIrOaYr+WbvueJh+WKoOi9veWujOaIkOOAgeaWh+Wtl+S/ruaUueetieWcuuaZr1xuICAgKi9cbiAgcHVibGljIGlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgcHVibGljIHRpY2tlcjogVGlja2VyID0gbmV3IFRpY2tlcigpO1xuICBwdWJsaWMgdGlja2VyRnVuYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZV9yZWZsb3cnLCAnJyk7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc05lZWRSZXBhaW50KSB7XG4gICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJEYXRhOiBFdmVudEhhbmRsZXJEYXRhO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgaGFzRXZlbnRCaW5kOiBmYWxzZSxcbiAgICAgIHRvdWNoTXNnOiB7fSxcbiAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgIHRvdWNoU3RhcnQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaHN0YXJ0JykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hNb3ZlOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2htb3ZlJykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hFbmQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGVuZCcpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoQ2FuY2VsOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hjYW5jZWwnKS5iaW5kKHRoaXMpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog5a+55LqO5LiN5Lya5b2x5ZON5biD5bGA55qE5pS55Yqo77yM5q+U5aaC5Zu+54mH5Y+q5piv5pS55Liq5Zyw5Z2A44CB5Yqg5Liq6IOM5pmv6Imy5LmL57G755qE5pS55Yqo77yM5Lya6Kem5Y+RIExheW91dCDnmoQgcmVwYWludCDmk43kvZxcbiAgICAgKiDop6blj5HnmoTmlrnlvI/mmK/nu5kgTGF5b3V0IOaKm+S4qiBgcmVwYWludGAg55qE5LqL5Lu277yM5Li65LqG5oCn6IO977yM5q+P5qyh5o6l5pS25YiwIHJlcGFpbnQg6K+35rGC5LiN5Lya5omn6KGM55yf5q2j55qE5riy5p+TXG4gICAgICog6ICM5piv5omn6KGM5LiA5Liq572u6ISP5pON5L2c77yMdGlja2VyIOavj+S4gOasoeaJp+ihjCB1cGRhdGUg5Lya5qOA5p+l6L+Z5Liq5qCH6K6w5L2N77yM6L+b6ICM5omn6KGM55yf5q2j55qE6YeN57uY5pON5L2cXG4gICAgICovXG4gICAgdGhpcy5vbigncmVwYWludCcsICgpID0+IHtcbiAgICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlsIYgVHdlZW4g5oyC6L295YiwIExheW91dO+8jOWvueS6jiBUd2VlbiDnmoTkvb/nlKjlrozlhajpgbXlvqogVHdlZW4uanMg55qE5paH5qGjXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvXG4gICAgICog5Y+q5LiN6L+H5b2TIFR3ZWVuIOaUueWKqOS6huiKgueCueS8muinpuWPkSByZXBhaW5044CBcmVmbG93IOeahOWxnuaAp+aXtu+8jExheW91dCDkvJrmiafooYznm7jlupTnmoTmk43kvZxcbiAgICAgKiDkuJrliqHkvqfkuI3nlKjmhJ/nn6XliLAgcmVwYWludCDlkowgcmVmbG93XG4gICAgICovXG4gICAgLy8gdGhpcy5UV0VFTiA9IFRXRUVOO1xuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSB2JHt0aGlzLnZlcnNpb259YCk7XG4gIH1cblxuICAvLyDkuI7ogIHniYjmnKzlhbzlrrlcbiAgZ2V0IGRlYnVnSW5mbygpIHtcbiAgICBsZXQgaW5mbyA9IGRlYnVnSW5mby5sb2coKTtcblxuICAgIGluZm8gKz0gYGVsZW1lbnRDb3VudDogJHt0aGlzLmVsZUNvdW50fVxcbmA7XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrDooqvnu5jliLZjYW52YXPnmoTnqpflj6Pkv6Hmga/vvIzmnKzmuLLmn5PlvJXmk47lubbkuI3lhbPlv4PmmK/lkKbkvJrlkozlhbbku5bmuLjmiI/lvJXmk47lhbHlkIzkvb/nlKhcbiAgICog6ICM5pys6Lqr5Y+I6ZyA6KaB5pSv5oyB5LqL5Lu25aSE55CG77yM5Zug5q2k77yM5aaC5p6c6KKr5riy5p+T5YaF5a655piv57uY5Yi25Yiw56a75bGPY2FudmFz77yM6ZyA6KaB5bCG5pyA57uI57uY5Yi25Zyo5bGP5bmV5LiKXG4gICAqIOeahOe7neWvueWwuuWvuOWSjOS9jee9ruS/oeaBr+abtOaWsOWIsOacrOa4suafk+W8leaTjuOAglxuICAgKiDlhbbkuK3vvIx3aWR0aOS4uueJqeeQhuWDj+e0oOWuveW6pu+8jGhlaWdodOS4uueJqeeQhuWDj+e0oOmrmOW6pu+8jHjkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKB45Z2Q5qCH77yMeeS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oFxuICAgKiB55Z2Q5qCHXG4gICAqL1xuICB1cGRhdGVWaWV3UG9ydChib3g6IElWaWV3UG9ydEJveCkge1xuICAgIHRoaXMudmlld3BvcnQud2lkdGggPSBib3gud2lkdGggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IGJveC5oZWlnaHQgfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnggPSBib3gueCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueSA9IGJveC55IHx8IDA7XG5cbiAgICB0aGlzLnJlYWxMYXlvdXRCb3ggPSB7XG4gICAgICByZWFsWDogdGhpcy52aWV3cG9ydC54LFxuICAgICAgcmVhbFk6IHRoaXMudmlld3BvcnQueSxcbiAgICB9O1xuXG4gICAgdGhpcy5oYXNWaWV3UG9ydFNldCA9IHRydWU7XG4gIH1cblxuICBpbml0KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBhdHRyVmFsdWVQcm9jZXNzb3I6IENhbGxiYWNrKSB7XG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0Jyk7XG4gICAgY29uc3QgcGFyc2VDb25maWcgPSB7XG4gICAgICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnJyxcbiAgICAgIGF0dHJOb2RlTmFtZTogJ2F0dHInLCAvLyBkZWZhdWx0IGlzICdmYWxzZSdcbiAgICAgIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgaWdub3JlTmFtZVNwYWNlOiB0cnVlLFxuICAgICAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIHBhcnNlTm9kZVZhbHVlOiBmYWxzZSxcbiAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICAgICAgdHJpbVZhbHVlczogdHJ1ZSxcbiAgICAgIHBhcnNlVHJ1ZU51bWJlck9ubHk6IGZhbHNlLFxuICAgICAgYWx3YXlzQ3JlYXRlVGV4dE5vZGU6IHRydWUsXG4gICAgfTtcblxuICAgIGlmIChhdHRyVmFsdWVQcm9jZXNzb3IgJiYgdHlwZW9mIGF0dHJWYWx1ZVByb2Nlc3NvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGFyc2VDb25maWcuYXR0clZhbHVlUHJvY2Vzc29yID0gYXR0clZhbHVlUHJvY2Vzc29yO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWxQYXJzZScpO1xuICAgIC8vIOWwhnhtbOWtl+espuS4suino+aekOaIkHhtbOiKgueCueagkVxuICAgIGNvbnN0IGpzb25PYmogPSBwYXJzZXIucGFyc2UodGVtcGxhdGUsIHBhcnNlQ29uZmlnLCB0cnVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyhqc29uT2JqKVxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sUGFyc2UnKTtcblxuICAgIGNvbnN0IHhtbFRyZWUgPSBqc29uT2JqLmNoaWxkcmVuWzBdO1xuXG4gICAgLy8gWE1M5qCR55Sf5oiQ5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0X3htbDJMYXlvdXQnKTtcbiAgICBjb25zdCBsYXlvdXRUcmVlID0gY3JlYXRlLmNhbGwodGhpcywgeG1sVHJlZSwgc3R5bGUpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sMkxheW91dCcpO1xuXG4gICAgdGhpcy5hZGQobGF5b3V0VHJlZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuSU5JVEVEO1xuXG4gICAgdGhpcy50aWNrZXIuYWRkKHRoaXMudGlja2VyRnVuYywgdHJ1ZSk7XG4gICAgdGhpcy50aWNrZXIuc3RhcnQoKTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXQnKTtcbiAgfVxuXG4gIHJlZmxvdyhpc0ZpcnN0ID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzRmlyc3QpIHtcbiAgICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X3JlZmxvdycpO1xuICAgIC8qKlxuICAgICAqIOiuoeeul+W4g+WxgOagkVxuICAgICAqIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGvXG4gICAgICogTGF5b3V05pys6Lqr5bm25LiN5L2c5Li65biD5bGA6K6h566X77yM5Y+q5piv5L2c5Li66IqC54K55qCR55qE5a655ZmoXG4gICAgICovXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdjb21wdXRlTGF5b3V0JywgdHJ1ZSk7XG4gICAgY29tcHV0ZUxheW91dCh0aGlzLmNoaWxkcmVuWzBdKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdjb21wdXRlTGF5b3V0Jyk7XG5cbiAgICBjb25zdCByb290RWxlID0gdGhpcy5jaGlsZHJlblswXTtcblxuICAgIGlmIChyb290RWxlLnN0eWxlLndpZHRoID09PSB1bmRlZmluZWQgfHwgcm9vdEVsZS5zdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIHNldCB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnR5IGZvciByb290IGVsZW1lbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LndpZHRoID0gcm9vdEVsZS5zdHlsZS53aWR0aDtcbiAgICAgIHRoaXMucmVuZGVycG9ydC5oZWlnaHQgPSByb290RWxlLnN0eWxlLmhlaWdodDtcbiAgICB9XG5cbiAgICAvLyDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dENoaWxkcmVuJywgdHJ1ZSk7XG4gICAgbGF5b3V0Q2hpbGRyZW4odGhpcyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Q2hpbGRyZW4nKTtcblxuICAgIHRoaXMudmlld3BvcnRTY2FsZSA9IHRoaXMudmlld3BvcnQud2lkdGggLyB0aGlzLnJlbmRlcnBvcnQud2lkdGg7XG5cbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIC8vIOmBjeWOhuiKgueCueagke+8jOS+neasoeiwg+eUqOiKgueCueeahOa4suafk+aOpeWPo+WunueOsOa4suafk1xuICAgIGRlYnVnSW5mby5zdGFydCgncmVuZGVyQ2hpbGRyZW4nLCB0cnVlKTtcbiAgICByZW5kZXJDaGlsZHJlbih0aGlzLmNoaWxkcmVuLCB0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBmYWxzZSk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVuZGVyQ2hpbGRyZW4nKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgncmVwYWludCcsIHRydWUpO1xuICAgIHRoaXMucmVwYWludCgpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlcGFpbnQnKTtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcblxuICAgIC8vIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIChlbGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVsZS5wcm9wcyk7XG4gICAgLy8gfSk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfcmVmbG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdOmYtuauteaguOW/g+S7heS7heaYr+agueaNrnhtbOWSjGNzc+WIm+W7uuS6huiKgueCueagkVxuICAgKiDopoHlrp7njrDnnJ/mraPnmoTmuLLmn5PvvIzpnIDopoHosIPnlKggbGF5b3V0IOWHveaVsO+8jOS5i+aJgOS7peWwhiBsYXlvdXQg5Y2V54us5oq96LGh5Li65LiA5Liq5Ye95pWw77yM5piv5Zug5Li6IGxheW91dCDlupTlvZPmmK/lj6/ku6Xph43lpI3osIPnlKjnmoRcbiAgICog5q+U5aaC5pS55Y+Y5LqG5LiA5Liq5YWD57Sg55qE5bC65a+477yM5a6e6ZmF5LiK6IqC54K55qCR5piv5rKh5Y+Y55qE77yM5LuF5LuF5piv6ZyA6KaB6YeN5paw6K6h566X5biD5bGA77yM54S25ZCO5riy5p+TXG4gICAqIOS4gOS4quWujOaVtOeahCBsYXlvdXQg5YiG5oiQ5LiL6Z2i55qE5Yeg5q2l77yaXG4gICAqIDEuIOaJp+ihjOeUu+W4g+a4heeQhu+8jOWboOS4uuW4g+WxgOWPmOWMlumhtemdoumcgOimgemHjee7mO+8jOi/memHjOayoeacieWBmuW+iOmrmOe6p+eahOWJlOmZpOetieaTjeS9nO+8jOS4gOW+i+a4hemZpOmHjeeUu++8jOWunumZheS4iuaAp+iDveW3sue7j+W+iOWlvVxuICAgKiAyLiDoioLngrnmoJHpg73lkKvmnIkgc3R5bGUg5bGe5oCn77yMY3NzLWxheW91dCDog73lpJ/moLnmja7ov5nkupvkv6Hmga/orqHnrpflh7rmnIDnu4jluIPlsYDvvIzor6bmg4Xlj6/op4EgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvY3NzLWxheW91dFxuICAgKiAzLiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr++8jOS9hui/meS6m+S/oeaBr+W5tuS4jeaYr+iDveWkn+ebtOaOpeeUqOeahFxuICAgKiAgICDmr5TlpoIgbGF5b3V0LnRvcCDmmK/mjIflnKjkuIDkuKrniLblrrnlmajlhoXnmoQgdG9w77yM5pyA57uI6KaB5a6e546w5riy5p+T77yM5a6e6ZmF5LiK6KaB6YCS5b2S5Yqg5LiK5aSN5a655Zmo55qEIHRvcFxuICAgKiAgICDov5nmoLfmr4/mrKEgcmVwYWludCDnmoTml7blgJnlj6rpnIDopoHnm7TmjqXkvb/nlKjorqHnrpflpb3nmoTlgLzljbPlj6/vvIzkuI3pnIDopoHmr4/mrKHpg73pgJLlvZLorqHnrpdcbiAgICogICAg6L+Z5LiA5q2l56ew5Li6IGxheW91dENoaWxkcmVu77yM55uu55qE5Zyo5LqO5bCGIGNzcy1sYXlvdXQg6L+b5LiA5q2l5aSE55CG5Li65Y+v5Lul5riy5p+T55u05o6l55So55qE5biD5bGA5L+h5oGvXG4gICAqIDQuIHJlbmRlckNoaWxkcmVu77ya5omn6KGM5riy5p+TXG4gICAqIDUuIGJpbmRFdmVudHPvvJrmiafooYzkuovku7bnu5HlrppcbiAgICovXG4gIC8vIEB0cy1pZ25vcmVcbiAgbGF5b3V0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMucmVuZGVyQ29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAoIXRoaXMuaGFzVmlld1BvcnRTZXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBpbnZva2UgbWV0aG9kIGB1cGRhdGVWaWV3UG9ydGAgYmVmb3JlIG1ldGhvZCBgbGF5b3V0YCcpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Jyk7XG5cbiAgICB0aGlzLnJlZmxvdyh0cnVlKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X290aGVyJyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcsIHRydWUpO1xuICAgIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIGVsZW1lbnQgPT4gZWxlbWVudC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5SRU5ERVJFRDtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dCcpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vdGhlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOiKgueCueaVsOeahOmHjee7mOWItu+8jOS4gOiIrOS4muWKoeS+p+aXoOmcgOiwg+eUqOivpeaWueazlVxuICAgKi9cbiAgcmVwYWludCgpIHtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICAgIHJlcGFpbnRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDov5Tlm57kuIDkuKroioLngrnlnKjlsY/luZXkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga/vvIzliY3mj5DmmK/mraPnoa7osIPnlKh1cGRhdGVWaWV3UG9ydOOAglxuICAgKi9cbiAgZ2V0RWxlbWVudFZpZXdwb3J0UmVjdChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgeyByZWFsTGF5b3V0Qm94LCB2aWV3cG9ydFNjYWxlIH0gPSB0aGlzO1xuICAgIGNvbnN0IHtcbiAgICAgIGFic29sdXRlWCxcbiAgICAgIGFic29sdXRlWSxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgIH0gPSBlbGVtZW50LmxheW91dEJveDtcblxuICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWTtcbiAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHZpZXdwb3J0U2NhbGU7XG4gICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHZpZXdwb3J0U2NhbGU7XG5cbiAgICByZXR1cm4gbmV3IFJlY3QoXG4gICAgICByZWFsWCxcbiAgICAgIHJlYWxZLFxuICAgICAgcmVhbFdpZHRoLFxuICAgICAgcmVhbEhlaWdodCxcbiAgICApO1xuICB9XG5cbiAgZ2V0Q2hpbGRCeVBvcyh0cmVlOiBMYXlvdXQgfCBFbGVtZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgaXRlbUxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdKSB7XG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgYWJzb2x1dGVYLFxuICAgICAgICBhYnNvbHV0ZVksXG4gICAgICAgIHdpZHRoLFxuICAgICAgICBoZWlnaHQsXG4gICAgICB9ID0gZWxlLmxheW91dEJveDtcbiAgICAgIGNvbnN0IHJlYWxYID0gYWJzb2x1dGVYICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgICAgY29uc3QgcmVhbFkgPSBhYnNvbHV0ZVkgKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgICBjb25zdCByZWFsV2lkdGggPSB3aWR0aCAqIHRoaXMudmlld3BvcnRTY2FsZTtcbiAgICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG5cbiAgICAgIGlmICgocmVhbFggPD0geCAmJiB4IDw9IHJlYWxYICsgcmVhbFdpZHRoKSAmJiAocmVhbFkgPD0geSAmJiB5IDw9IHJlYWxZICsgcmVhbEhlaWdodCkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOebuOWFs2lzc3Vl77yaaHR0cHM6Ly9naXRodWIuY29tL3dlY2hhdC1taW5pcHJvZ3JhbS9taW5pZ2FtZS1jYW52YXMtZW5naW5lL2lzc3Vlcy8xN1xuICAgICAgICAgKiDov5nph4zlj6ropoHmu6HotrPmnaHku7bnmoTpg73opoHorrDlvZXvvIzlkKbliJnlj6/og73lh7rnjrAgaXNzdWUg6YeM6Z2i5o+Q5Yiw55qE6Zeu6aKYXG4gICAgICAgICAqL1xuICAgICAgICBpdGVtTGlzdC5wdXNoKGVsZSk7XG4gICAgICAgIGlmIChlbGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKGVsZSwgeCwgeSwgaXRlbUxpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBldmVudEhhbmRsZXIgPSAoZXZlbnROYW1lOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4ge1xuICAgICAgbGV0IHRvdWNoOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuXG4gICAgICBpZiAoaXNHYW1lVG91Y2hFdmVudChlKSkge1xuICAgICAgICB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvdWNoID0gZTtcbiAgICAgIH1cbiAgICAgIC8vIGNvbnN0IHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pIHx8IGU7XG4gICAgICBpZiAoIXRvdWNoIHx8ICF0b3VjaC5wYWdlWCB8fCAhdG91Y2gucGFnZVkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRvdWNoLnRpbWVTdGFtcCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRvdWNoLnRpbWVTdGFtcCA9IGUudGltZVN0YW1wO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBsaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSA9IFtdO1xuICAgICAgaWYgKHRvdWNoKSB7XG4gICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyh0aGlzLCB0b3VjaC5wYWdlWCwgdG91Y2gucGFnZVksIGxpc3QpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWxpc3QubGVuZ3RoKSB7XG4gICAgICAgIGxpc3QucHVzaCh0aGlzKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaXRlbSA9IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcbiAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KGV2ZW50TmFtZSwgZSk7XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaHN0YXJ0JyB8fCBldmVudE5hbWUgPT09ICd0b3VjaGVuZCcpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnW2V2ZW50TmFtZV0gPSB0b3VjaDtcbiAgICAgIH1cblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJyAmJiBpc0NsaWNrKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZykpIHtcbiAgICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoJ2NsaWNrJywgZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzlhajlsYDnmoTkuovku7bnu5HlrprpgLvovpEgXG4gICAqL1xuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgZW52Lm9uVG91Y2hNb3ZlKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmUpO1xuICAgIGVudi5vblRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlhajlsYDkuovku7bop6Pnu5EgXG4gICAqL1xuICB1bkJpbmRFdmVudHMoKSB7XG4gICAgZW52Lm9mZlRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgIGVudi5vZmZUb3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9mZlRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIEVFLmVtaXQoZXZlbnQsIGRhdGEpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZShldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9mZihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveUFsbCh0cmVlOiBMYXlvdXQgfCBFbGVtZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgfSA9IHRyZWU7XG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5kZXN0cm95QWxsKGNoaWxkKTtcbiAgICAgIGNoaWxkLmRlc3Ryb3lTZWxmICYmIGNoaWxkLmRlc3Ryb3lTZWxmKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5riF55CG55S75biD77yM5LmL5YmN55qE6K6h566X5Ye65p2l55qE5riy5p+T5qCR5Lmf5Lya5LiA5bm25riF55CG77yM5q2k5pe25Y+v5Lul5YaN5qyh5omn6KGMaW5pdOWSjGxheW91dOaWueazlea4suafk+eVjOmdouOAglxuICAgKi9cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW5uZXLnmoTlupTor6Xpu5jorqTpg73np7vpmaTvvIzlkKbliJnliY3lkI7kuKTmrKHliJ3lp4vljJbkvJrlr7zoh7TliY3lkI7nirbmgIHmnInpl67pophcbiAgICAgIHRoaXMudGlja2VyLnJlbW92ZUlubmVyKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJQb29sKCkge1xuICAgIGltZ1Bvb2wuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr5TotbcgTGF5b3V0LmNsZWFyIOabtOW9u+W6leeahOa4heeQhu+8jOS8mua4heepuuWbvueJh+WvueixoeaxoO+8jOWHj+WwkeWGheWtmOWNoOeUqOOAglxuICAgKi9cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlr7nkuo7lm77niYfotYTmupDvvIzlpoLmnpzkuI3mj5DliY3liqDovb3vvIzmuLLmn5Pov4fnqIvkuK3lj6/og73lh7rnjrDmjKjkuKrlh7rnjrDlm77niYfmlYjmnpzvvIzlvbHlk43kvZPpqoxcbiAgICog6YCa6L+HTGF5b3V0LmxvYWRJbWdz5Y+v5Lul6aKE5Yqg6L295Zu+54mH6LWE5rqQ77yM5Zyo6LCD55SoTGF5b3V0LmxheW91dOeahOaXtuWAmea4suafk+aAp+iDveabtOWlve+8jOS9k+mqjOabtOS9s+OAglxuICAgKi9cbiAgbG9hZEltZ3MoYXJyOiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDms6jlhowgYml0bWFwdGV4dCDlj6/nlKjnmoTlrZfkvZPjgIIgXG4gICAqL1xuICByZWdpc3RCaXRNYXBGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgaWYgKCFiaXRNYXBQb29sLmdldChuYW1lKSkge1xuICAgICAgY29uc3QgZm9udCA9IG5ldyBCaXRNYXBGb250KG5hbWUsIHNyYywgY29uZmlnKTtcbiAgICAgIHRoaXMuYml0TWFwRm9udHMucHVzaChmb250KTtcbiAgICAgIGJpdE1hcFBvb2wuc2V0KG5hbWUsIGZvbnQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWFi+mahuiKgueCue+8jOWFi+mahuWQjueahOiKgueCueWPr+S7pea3u+WKoOWIsCBMYXlvdXQg55qE5p+Q5Liq6IqC54K55LitXG4gICAqIOivpeaWueazleWPr+S7peWcqOaVsOaNruacieWPmOWMlueahOaXtuWAmemBv+WFjemHjeaWsOaJp+ihjCBMYXlvdXQuaW5pdCDmtYHnqIvjgIJcbiAgICovXG4gIGNsb25lTm9kZShlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSkge1xuICAgIHJldHVybiBjbG9uZTxMYXlvdXQ+KHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhue7hOS7tuaMguWIsExheW91dFxuICAgKi9cbiAgRWxlbWVudCA9IEVsZW1lbnQ7XG4gIFZpZXcgPSBWaWV3O1xuICBUZXh0ID0gVGV4dDtcbiAgSW1hZ2UgPSBJbWFnZTtcbiAgU2Nyb2xsVmlldyA9IFNjcm9sbFZpZXc7XG4gIEJpdE1hcFRleHQgPSBCaXRNYXBUZXh0O1xuICBDYW52YXMgPSBDYW52YXM7XG4gIEJ1dHRvbiA9IEJ1dHRvbjtcblxuICByZWdpc3RlckNvbXBvbmVudCA9IHJlZ2lzdGVyQ29tcG9uZW50O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbGxlZFBsdWdpbnM6IElQbHVnaW48TGF5b3V0PltdID0gW107XG4gIC8qKlxuICAgKiDlronoo4Xnu5nlrprnmoTmj5Lku7YgXG4gICAqL1xuICB1c2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgaWYgKExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0g6K+l5o+S5Lu25bey5a6J6KOFLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5a6J6KOFYClcbiAgfVxuXG4gIC8qKlxuICAgKiDljbjovb3nu5nlrprmj5Lku7YgXG4gICAqL1xuICB1blVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBjb25zdCBwbHVnaW5JbmRleCA9IExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluZGV4T2YocGx1Z2luKTtcblxuICAgIGlmIChwbHVnaW5JbmRleCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gVGhpcyBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnVuaW5zdGFsbCkge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWNuOi9vWApXG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuc3BsaWNlKHBsdWdpbkluZGV4LCAxKTtcbiAgfVxufVxuXG5jb25zdCBsYXlvdXQgPSBuZXcgTGF5b3V0KHtcbiAgc3R5bGU6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH0sXG4gIG5hbWU6ICdsYXlvdXQnLFxufSk7XG5cbmV4cG9ydCB7XG4gIGxheW91dCBhcyBkZWZhdWx0LFxuICBMYXlvdXQsXG4gIGVudixcbiAgRUUsXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
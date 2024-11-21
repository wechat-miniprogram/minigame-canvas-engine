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
/* harmony export */   convertPercent: () => (/* binding */ convertPercent),
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   isPercent: () => (/* binding */ isPercent),
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
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../env */ "./src/env.ts");
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





// import { convertPercent } from '../common/vd';

function convertPercent(data, parentData) {
    if (typeof data === 'number' || data === null) {
        return data;
    }
    var matchData = data.match(/(\d+(?:\.\d+)?)%/);
    if (matchData && matchData[1]) {
        return parentData * parseFloat(matchData[1]) * 0.01;
    }
}
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
        this.innerClassName = className;
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
        this.classNameList = null;
    }
    Element.prototype.styleChangeHandler = function (prop, styleOpType, val) {
    };
    Object.defineProperty(Element.prototype, "className", {
        get: function () {
            return this.innerClassName;
        },
        set: function (value) {
            var _this = this;
            this.innerClassName = value;
            this.classNameList = this.innerClassName.split(/\s+/);
            console.log(this.innerClassName, this.classNameList);
            var oldStyle = Object.assign({}, this.style);
            // 根据 className 从样式表中算出当前应该作用的样式
            // @ts-ignore
            var newStyle = this.classNameList.reduce(function (res, oneClass) { return Object.assign(res, _this.root.styleSheet[oneClass]); }, {});
            console.log('newStyle', newStyle);
            var parentStyle;
            if (this.parent) {
                parentStyle = this.parent.style;
            }
            else {
                parentStyle = _env__WEBPACK_IMPORTED_MODULE_5__["default"].getRootCanvasSize();
            }
            if (typeof newStyle.opacity === 'undefined') {
                newStyle.opacity = 1;
            }
            Object.keys(newStyle).concat(Object.keys(oldStyle)).forEach(function (key) {
                // 手动通过this.style设置过的样式认为是内联样式，优先级最高，也就是 className 的属性不影响
                if (!Reflect.has(_this.innerStyle, key)) {
                    if (Reflect.has(newStyle, key)) {
                        // @ts-ignore
                        var newValue = newStyle[key];
                        if (key === 'width') {
                            newValue = parentStyle.width ? convertPercent(newValue, parentStyle.width) : 0;
                        }
                        if (key === 'height') {
                            newValue = parentStyle.height ? convertPercent(newValue, parentStyle.height) : 0;
                        }
                        if (key === 'opacity' && parentStyle && parentStyle.opacity !== 1 && typeof parentStyle.opacity === 'number') {
                            newValue = parentStyle.opacity * newValue;
                        }
                        // @ts-ignore
                        // 根据 className 计算出的样式覆盖当前样式
                        _this.style[key] = newValue;
                    }
                    else {
                        // 不在内联样式，根据 className 计算出的样式又没有，认为这些样式都应该删除了
                        console.log('del key', key);
                        delete _this.style[key];
                    }
                }
            });
            console.log('current style', this.style);
        },
        enumerable: false,
        configurable: true
    });
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
                        console.log('set', prop, oldVal, val);
                        ele_1.calculateRenderForLayout(false, prop, StyleOpType.Set, val);
                    }
                    if (isSetForInnerStyle) {
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
        this.classNameList = this.innerClassName.split(/\s+/);
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
        this.innerClassName = '';
        this.classNameList = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vZGlzdC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLElBQTBDO0FBQ2hEO0FBQ0EsSUFBSSxpQ0FBTyxFQUFFLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsa0dBQUM7QUFDdkIsSUFBSSxLQUFLLEVBUU47QUFDSCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEIsZ0JBQWdCO0FBQzFDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsYUFBYTtBQUM5Qzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQyxhQUFhO0FBQy9DOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QyxFQUFFLENBQUM7Z0JBQzNCLE9BQU87WUFDVCxDQUFDO1lBQ0QsWUFBWTtZQUNaLFNBQVMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNyQyxJQUFNLFVBQVUsR0FBRywrQ0FBTSxDQUFDLElBQUksQ0FBQyxLQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRCxTQUFTLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFoRmMsdUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztJQWlGMUQsYUFBQztDQUFBLENBdmxCb0IsNERBQU8sR0F1bEIzQjtBQUVELElBQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxDQUFDO0FBZ0JGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9idXR0b24udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2NhbnZhcy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvZWxlbWVudHMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2ltYWdlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbmRleC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsYmFyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGx2aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGVQYXJzZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3RleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3ZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9lbnYudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9ub2RlMmpzb24uanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci91dGlsLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sTm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbHN0cjJ4bWxub2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9hbmltYXRlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQgZm9yIHJlZmVyZW5jZVxuLy9cbi8vIFRoaXMgZmlsZSB1c2VzIHRoZSBmb2xsb3dpbmcgc3BlY2lmaWMgVU1EIGltcGxlbWVudGF0aW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5jb21wdXRlTGF5b3V0ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbnZhciBjb21wdXRlTGF5b3V0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDU1NfVU5ERUZJTkVEO1xuXG4gIHZhciBDU1NfRElSRUNUSU9OX0lOSEVSSVQgPSAnaW5oZXJpdCc7XG4gIHZhciBDU1NfRElSRUNUSU9OX0xUUiA9ICdsdHInO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9SVEwgPSAncnRsJztcblxuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA9ICdyb3cnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFID0gJ3Jvdy1yZXZlcnNlJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gPSAnY29sdW1uJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSA9ICdjb2x1bW4tcmV2ZXJzZSc7XG5cbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfSlVTVElGWV9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4gPSAnc3BhY2UtYmV0d2Vlbic7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQgPSAnc3BhY2UtYXJvdW5kJztcblxuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfQUxJR05fQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfQUxJR05fRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0FMSUdOX1NUUkVUQ0ggPSAnc3RyZXRjaCc7XG5cbiAgdmFyIENTU19QT1NJVElPTl9SRUxBVElWRSA9ICdyZWxhdGl2ZSc7XG4gIHZhciBDU1NfUE9TSVRJT05fQUJTT0xVVEUgPSAnYWJzb2x1dGUnO1xuXG4gIHZhciBsZWFkaW5nID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIHRyYWlsaW5nID0ge1xuICAgICdyb3cnOiAncmlnaHQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdsZWZ0JyxcbiAgICAnY29sdW1uJzogJ2JvdHRvbScsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ3RvcCdcbiAgfTtcbiAgdmFyIHBvcyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciBkaW0gPSB7XG4gICAgJ3Jvdyc6ICd3aWR0aCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3dpZHRoJyxcbiAgICAnY29sdW1uJzogJ2hlaWdodCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2hlaWdodCdcbiAgfTtcblxuICAvLyBXaGVuIHRyYW5zcGlsZWQgdG8gSmF2YSAvIEMgdGhlIG5vZGUgdHlwZSBoYXMgbGF5b3V0LCBjaGlsZHJlbiBhbmQgc3R5bGVcbiAgLy8gcHJvcGVydGllcy4gRm9yIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZXNlIHByb3BlcnRpZXNcbiAgLy8gaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LlxuICBmdW5jdGlvbiBmaWxsTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5sYXlvdXQgfHwgbm9kZS5pc0RpcnR5KSB7XG4gICAgICBub2RlLmxheW91dCA9IHtcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuc3R5bGUpIHtcbiAgICAgIG5vZGUuc3R5bGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZpbGxOb2Rlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNSb3dEaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5TdGFydCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5TdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luRW5kICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbkVuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nRW5kICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nRW5kID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdFbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpICtcbiAgICAgICAgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduQ29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25Db250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQuc3R5bGUuYWxpZ25TZWxmKSB7XG4gICAgICByZXR1cm4gY2hpbGQuc3R5bGUuYWxpZ25TZWxmO1xuICAgIH1cbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkl0ZW1zKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkl0ZW1zO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmV0Y2gnO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUF4aXMoYXhpcywgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9SVEwpIHtcbiAgICAgIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gICAgICB9IGVsc2UgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSkge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICBpZiAobm9kZS5zdHlsZS5kaXJlY3Rpb24pIHtcbiAgICAgIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSBDU1NfRElSRUNUSU9OX0lOSEVSSVQ7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9JTkhFUklUKSB7XG4gICAgICBkaXJlY3Rpb24gPSAocGFyZW50RGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBDU1NfRElSRUNUSU9OX0xUUiA6IHBhcmVudERpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZsZXhEaXJlY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24sIGRpcmVjdGlvbikge1xuICAgIGlmIChpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uVHlwZShub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gJ3JlbGF0aXZlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleChub2RlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGdldFBvc2l0aW9uVHlwZShub2RlKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICBub2RlLnN0eWxlLmZsZXggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleFdyYXAobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhXcmFwID09PSAnd3JhcCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREaW1XaXRoTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSArIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0RpbURlZmluZWQobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlW2RpbVtheGlzXV0gPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUG9zRGVmaW5lZChub2RlLCBwb3MpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lYXN1cmVEZWZpbmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5tZWFzdXJlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbihub2RlLCBwb3MpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc107XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gYm91bmRBeGlzKG5vZGUsIGF4aXMsIHZhbHVlKSB7XG4gICAgdmFyIG1pbiA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1pbkhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluSGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBtYXggPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5tYXhIZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1heEhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgYm91bmRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCAmJiBtYXggPj0gMCAmJiBib3VuZFZhbHVlID4gbWF4KSB7XG4gICAgICBib3VuZFZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBpZiAobWluICE9PSB1bmRlZmluZWQgJiYgbWluID49IDAgJiYgYm91bmRWYWx1ZSA8IG1pbikge1xuICAgICAgYm91bmRWYWx1ZSA9IG1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmbWF4ZihhLCBiKSB7XG4gICAgaWYgKGEgPiBiKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB1c2VyIHNwZWNpZmljYWxseSBzZXRzIGEgdmFsdWUgZm9yIHdpZHRoIG9yIGhlaWdodFxuICBmdW5jdGlvbiBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgYXhpcykge1xuICAgIC8vIFRoZSBwYXJlbnQgYWxyZWFkeSBjb21wdXRlZCB1cyBhIHdpZHRoIG9yIGhlaWdodC4gV2UganVzdCBza2lwIGl0XG4gICAgaWYgKG5vZGUubGF5b3V0W2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXZSBvbmx5IHJ1biBpZiB0aGVyZSdzIGEgd2lkdGggb3IgaGVpZ2h0IGRlZmluZWRcbiAgICBpZiAoIWlzRGltRGVmaW5lZChub2RlLCBheGlzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBkaW1lbnNpb25zIGNhbiBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlclxuICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgIGJvdW5kQXhpcyhub2RlLCBheGlzLCBub2RlLnN0eWxlW2RpbVtheGlzXV0pLFxuICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcylcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgYXhpcykge1xuICAgIGNoaWxkLmxheW91dFt0cmFpbGluZ1theGlzXV0gPSBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLSBjaGlsZC5sYXlvdXRbcG9zW2F4aXNdXTtcbiAgfVxuXG4gIC8vIElmIGJvdGggbGVmdCBhbmQgcmlnaHQgYXJlIGRlZmluZWQsIHRoZW4gdXNlIGxlZnQuIE90aGVyd2lzZSByZXR1cm5cbiAgLy8gK2xlZnQgb3IgLXJpZ2h0IGRlcGVuZGluZyBvbiB3aGljaCBpcyBkZWZpbmVkLlxuICBmdW5jdGlvbiBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtsZWFkaW5nW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZ2V0UG9zaXRpb24obm9kZSwgbGVhZGluZ1theGlzXSk7XG4gICAgfVxuICAgIHJldHVybiAtZ2V0UG9zaXRpb24obm9kZSwgdHJhaWxpbmdbYXhpc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIC8qY3NzX2RpcmVjdGlvbl90Ki9wYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIvKmNzc19kaXJlY3Rpb25fdCovIGRpcmVjdGlvbiA9IHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gbWFpbkF4aXMgPSByZXNvbHZlQXhpcyhnZXRGbGV4RGlyZWN0aW9uKG5vZGUpLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBjcm9zc0F4aXMgPSBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24obWFpbkF4aXMsIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIHJlc29sdmVkUm93QXhpcyA9IHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG5cbiAgICAvLyBIYW5kbGUgd2lkdGggYW5kIGhlaWdodCBzdHlsZSBhdHRyaWJ1dGVzXG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIG1haW5BeGlzKTtcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIFNldCB0aGUgcmVzb2x2ZWQgcmVzb2x1dGlvbiBpbiB0aGUgbm9kZSdzIGxheW91dFxuICAgIG5vZGUubGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgIC8vIFRoZSBwb3NpdGlvbiBpcyBzZXQgYnkgdGhlIHBhcmVudCwgYnV0IHdlIG5lZWQgdG8gY29tcGxldGUgaXQgd2l0aCBhXG4gICAgLy8gZGVsdGEgY29tcG9zZWQgb2YgdGhlIG1hcmdpbiBhbmQgbGVmdC90b3AvcmlnaHQvYm90dG9tXG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1ttYWluQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW21haW5BeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1tjcm9zc0F4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIElubGluZSBpbW11dGFibGUgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBub2RlIHRvIGF2b2lkIGV4Y2Vzc2l2ZSBtZXRob2RcbiAgICAvLyBpbnZvY2F0aW9ucyBkdXJpbmcgdGhlIGxheW91dCBjYWxjdWxhdGlvbi5cbiAgICB2YXIvKmludCovIGNoaWxkQ291bnQgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG5cbiAgICBpZiAoaXNNZWFzdXJlRGVmaW5lZChub2RlKSkge1xuICAgICAgdmFyLypib29sKi8gaXNSZXNvbHZlZFJvd0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dKTtcblxuICAgICAgdmFyLypmbG9hdCovIHdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICB3aWR0aCA9IG5vZGUuc3R5bGUud2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuICAgICAgfVxuICAgICAgd2lkdGggLT0gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcblxuICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGdpdmUgYSBkaW1lbnNpb24gZm9yIHRoZSB0ZXh0IGlmIHdlIGhhdmVuJ3QgZ290IGFueVxuICAgICAgLy8gZm9yIGl0IGNvbXB1dGVkIHlldC4gSXQgY2FuIGVpdGhlciBiZSBmcm9tIHRoZSBzdHlsZSBhdHRyaWJ1dGUgb3IgYmVjYXVzZVxuICAgICAgLy8gdGhlIGVsZW1lbnQgaXMgZmxleGlibGUuXG4gICAgICB2YXIvKmJvb2wqLyBpc1Jvd1VuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAmJiAhaXNSZXNvbHZlZFJvd0RpbURlZmluZWQ7XG4gICAgICB2YXIvKmJvb2wqLyBpc0NvbHVtblVuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTikgJiZcbiAgICAgICAgaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW0NTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5dXSk7XG5cbiAgICAgIC8vIExldCdzIG5vdCBtZWFzdXJlIHRoZSB0ZXh0IGlmIHdlIGFscmVhZHkga25vdyBib3RoIGRpbWVuc2lvbnNcbiAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCB8fCBpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICB2YXIvKmNzc19kaW1fdCovIG1lYXN1cmVEaW0gPSBub2RlLnN0eWxlLm1lYXN1cmUoXG4gICAgICAgICAgLyooYykhbm9kZS0+Y29udGV4dCwqL1xuICAgICAgICAgIC8qKGphdmEpIWxheW91dENvbnRleHQubWVhc3VyZU91dHB1dCwqL1xuICAgICAgICAgIHdpZHRoXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbWVhc3VyZURpbS53aWR0aCArXG4gICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG1lYXN1cmVEaW0uaGVpZ2h0ICtcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gaXNOb2RlRmxleFdyYXAgPSBpc0ZsZXhXcmFwKG5vZGUpO1xuXG4gICAgdmFyLypjc3NfanVzdGlmeV90Ki8ganVzdGlmeUNvbnRlbnQgPSBnZXRKdXN0aWZ5Q29udGVudChub2RlKTtcblxuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW4gPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3MgPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBjcm9zc0F4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW4gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgdmFyLypib29sKi8gaXNNYWluRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNDcm9zc0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc01haW5Sb3dEaXJlY3Rpb24gPSBpc1Jvd0RpcmVjdGlvbihtYWluQXhpcyk7XG5cbiAgICB2YXIvKmludCovIGk7XG4gICAgdmFyLyppbnQqLyBpaTtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY2hpbGQ7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGF4aXM7XG5cbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEFic29sdXRlQ2hpbGQgPSBudWxsO1xuXG4gICAgdmFyLypmbG9hdCovIGRlZmluZWRNYWluRGltID0gQ1NTX1VOREVGSU5FRDtcbiAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgZGVmaW5lZE1haW5EaW0gPSBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSAtIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbjtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIGV4ZWN1dGUgdGhlIG5leHQgdHdvIGxvb3BzIG9uZSBwZXIgbGluZSB3aXRoIGZsZXgtd3JhcFxuICAgIHZhci8qaW50Ki8gc3RhcnRMaW5lID0gMDtcbiAgICB2YXIvKmludCovIGVuZExpbmUgPSAwO1xuICAgIC8vIHZhci8qaW50Ki8gbmV4dE9mZnNldCA9IDA7XG4gICAgdmFyLyppbnQqLyBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAvLyBXZSBhZ2dyZWdhdGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlIGNvbnRhaW5lciBpbiB0aG9zZSB0d28gdmFyaWFibGVzXG4gICAgdmFyLypmbG9hdCovIGxpbmVzQ3Jvc3NEaW0gPSAwO1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc01haW5EaW0gPSAwO1xuICAgIHZhci8qaW50Ki8gbGluZXNDb3VudCA9IDA7XG4gICAgd2hpbGUgKGVuZExpbmUgPCBjaGlsZENvdW50KSB7XG4gICAgICAvLyA8TG9vcCBBPiBMYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBjb3VudCBjaGlsZHJlbiBieSB0eXBlXG5cbiAgICAgIC8vIG1haW5Db250ZW50RGltIGlzIGFjY3VtdWxhdGlvbiBvZiB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2luIG9mIGFsbCB0aGVcbiAgICAgIC8vIG5vbiBmbGV4aWJsZSBjaGlsZHJlbi4gVGhpcyB3aWxsIGJlIHVzZWQgaW4gb3JkZXIgdG8gZWl0aGVyIHNldCB0aGVcbiAgICAgIC8vIGRpbWVuc2lvbnMgb2YgdGhlIG5vZGUgaWYgbm9uZSBhbHJlYWR5IGV4aXN0LCBvciB0byBjb21wdXRlIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlIGxlZnQgZm9yIHRoZSBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluQ29udGVudERpbSA9IDA7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSB0aHJlZSBraW5kIG9mIGNoaWxkcmVuLCBub24gZmxleGlibGUsIGZsZXhpYmxlIGFuZCBhYnNvbHV0ZS5cbiAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyBob3cgbWFueSB0aGVyZSBhcmUgaW4gb3JkZXIgdG8gZGlzdHJpYnV0ZSB0aGUgc3BhY2UuXG4gICAgICB2YXIvKmludCovIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gdG90YWxGbGV4aWJsZSA9IDA7XG4gICAgICB2YXIvKmludCovIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG5cbiAgICAgIC8vIFVzZSB0aGUgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBtYWluIGF4aXMgZm9yIGFzIGxvbmdcbiAgICAgIC8vIGFzIHRoZXkgYXJlIHVzaW5nIGEgc2ltcGxlIHN0YWNraW5nIGJlaGF2aW91ci4gQ2hpbGRyZW4gdGhhdCBhcmVcbiAgICAgIC8vIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcCB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluXG4gICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tNYWluID1cbiAgICAgICAgICAoaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAoIWlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0NFTlRFUik7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleE1haW4gPSAoaXNTaW1wbGVTdGFja01haW4gPyBjaGlsZENvdW50IDogc3RhcnRMaW5lKTtcblxuICAgICAgLy8gVXNlIHRoZSBpbml0aWFsIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgY3Jvc3MgYXhpcyBmb3JcbiAgICAgIC8vIGFzIGxvbmcgYXMgdGhleSBhcmUgcmVsYXRpdmVseSBwb3NpdGlvbmVkIHdpdGggYWxpZ25tZW50IFNUUkVUQ0ggb3JcbiAgICAgIC8vIEZMRVhfU1RBUlQuIENoaWxkcmVuIHRoYXQgYXJlIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcFxuICAgICAgLy8gd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpbiBpbiA8TG9vcCBEPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tDcm9zcyA9IHRydWU7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleENyb3NzID0gY2hpbGRDb3VudDtcblxuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0RmxleENoaWxkID0gbnVsbDtcbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgdmFyLypmbG9hdCovIG1haW5EaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW47XG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW0gPSAwO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWF4V2lkdGg7XG4gICAgICBmb3IgKGkgPSBzdGFydExpbmU7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZC5saW5lSW5kZXggPSBsaW5lc0NvdW50O1xuXG4gICAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG5cbiAgICAgICAgLy8gUHJlLWZpbGwgY3Jvc3MgYXhpcyBkaW1lbnNpb25zIHdoZW4gdGhlIGNoaWxkIGlzIHVzaW5nIHN0cmV0Y2ggYmVmb3JlXG4gICAgICAgIC8vIHdlIGNhbGwgdGhlIHJlY3Vyc2l2ZSBsYXlvdXQgcGFzc1xuICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCAmJlxuICAgICAgICAgICAgZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICAgICAgICBpc0Nyb3NzRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgY3Jvc3NBeGlzKSkge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSkge1xuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2hpbGRyZW5cbiAgICAgICAgICAvLyBzbyB0aGF0IHdlIGNhbiBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEFic29sdXRlQ2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3IgdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoXG4gICAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpLFxuICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGF4aXMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyLypmbG9hdCovIG5leHRDb250ZW50RGltID0gMDtcblxuICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGNvbnNpZGVyIGEgY2hpbGQgZmxleGlibGUgaWYgd2UgaGF2ZSBhIGNvbXB1dGVkXG4gICAgICAgIC8vIGRpbWVuc2lvbiBmb3IgdGhlIG5vZGUuXG4gICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkICYmIGlzRmxleChjaGlsZCkpIHtcbiAgICAgICAgICBmbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICB0b3RhbEZsZXhpYmxlICs9IGNoaWxkLnN0eWxlLmZsZXg7XG5cbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgZmxleGlibGUgY2hpbGRyZW4gc28gdGhhdCB3ZSBjYW5cbiAgICAgICAgICAvLyBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEZsZXhDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBFdmVuIGlmIHdlIGRvbid0IGtub3cgaXRzIGV4YWN0IHNpemUgeWV0LCB3ZSBhbHJlYWR5IGtub3cgdGhlIHBhZGRpbmcsXG4gICAgICAgICAgLy8gYm9yZGVyIGFuZCBtYXJnaW4uIFdlJ2xsIHVzZSB0aGlzIHBhcnRpYWwgaW5mb3JtYXRpb24sIHdoaWNoIHJlcHJlc2VudHNcbiAgICAgICAgICAvLyB0aGUgc21hbGxlc3QgcG9zc2libGUgc2l6ZSBmb3IgdGhlIGNoaWxkLCB0byBjb21wdXRlIHRoZSByZW1haW5pbmdcbiAgICAgICAgICAvLyBhdmFpbGFibGUgc3BhY2UuXG4gICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIG1haW5BeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gcmVjdXJzaXZlIGNhbGwuIFdlIGxheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICAgICAgaWYgKGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPT09IDApIHtcbiAgICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWJzb2x1dGUgcG9zaXRpb25lZCBlbGVtZW50cyBkbyBub3QgdGFrZSBwYXJ0IG9mIHRoZSBsYXlvdXQsIHNvIHdlXG4gICAgICAgICAgLy8gZG9uJ3QgdXNlIHRoZW0gdG8gY29tcHV0ZSBtYWluQ29udGVudERpbVxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIGFuZCBtYXJnaW4gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZWxlbWVudCB3ZSBhcmUgYWJvdXQgdG8gYWRkIHdvdWxkIG1ha2UgdXMgZ28gdG8gdGhlIG5leHQgbGluZVxuICAgICAgICBpZiAoaXNOb2RlRmxleFdyYXAgJiZcbiAgICAgICAgICAgIGlzTWFpbkRpbURlZmluZWQgJiZcbiAgICAgICAgICAgIG1haW5Db250ZW50RGltICsgbmV4dENvbnRlbnREaW0gPiBkZWZpbmVkTWFpbkRpbSAmJlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBvbmx5IG9uZSBlbGVtZW50LCB0aGVuIGl0J3MgYmlnZ2VyIHRoYW4gdGhlIGNvbnRlbnRcbiAgICAgICAgICAgIC8vIGFuZCBuZWVkcyBpdHMgb3duIGxpbmVcbiAgICAgICAgICAgIGkgIT09IHN0YXJ0TGluZSkge1xuICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudC0tO1xuICAgICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIG1haW4gYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbiAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fCBpc0ZsZXgoY2hpbGQpKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tNYWluID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4TWFpbiA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgY3Jvc3MgYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgRD4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MgJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHxcbiAgICAgICAgICAgICAgICAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fU1RSRVRDSCAmJiBhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICAgICAgIGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tDcm9zcyA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleENyb3NzID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbikge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWFpbkRpbSArPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAgICAgbWFpbkNvbnRlbnREaW0gKz0gbmV4dENvbnRlbnREaW07XG4gICAgICAgIGVuZExpbmUgPSBpICsgMTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQj4gTGF5b3V0IGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBhbGxvY2F0ZSBlbXB0eSBzcGFjZVxuXG4gICAgICAvLyBJbiBvcmRlciB0byBwb3NpdGlvbiB0aGUgZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcywgd2UgaGF2ZSB0d29cbiAgICAgIC8vIGNvbnRyb2xzLiBUaGUgc3BhY2UgYmV0d2VlbiB0aGUgYmVnaW5uaW5nIGFuZCB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gYW5kIHRoZSBzcGFjZSBiZXR3ZWVuIGVhY2ggdHdvIGVsZW1lbnRzLlxuICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdNYWluRGltID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBiZXR3ZWVuTWFpbkRpbSA9IDA7XG5cbiAgICAgIC8vIFRoZSByZW1haW5pbmcgYXZhaWxhYmxlIHNwYWNlIHRoYXQgbmVlZHMgdG8gYmUgYWxsb2NhdGVkXG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nTWFpbkRpbSA9IDA7XG4gICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZGVmaW5lZE1haW5EaW0gLSBtYWluQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihtYWluQ29udGVudERpbSwgMCkgLSBtYWluQ29udGVudERpbTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGZsZXhpYmxlIGNoaWxkcmVuIGluIHRoZSBtaXgsIHRoZXkgYXJlIGdvaW5nIHRvIGZpbGwgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2VcbiAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgIT09IDApIHtcbiAgICAgICAgdmFyLypmbG9hdCovIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYmFzZU1haW5EaW07XG4gICAgICAgIHZhci8qZmxvYXQqLyBib3VuZE1haW5EaW07XG5cbiAgICAgICAgLy8gSWYgdGhlIGZsZXggc2hhcmUgb2YgcmVtYWluaW5nIHNwYWNlIGRvZXNuJ3QgbWVldCBtaW4vbWF4IGJvdW5kcyxcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgY2hpbGQgZnJvbSBmbGV4IGNhbGN1bGF0aW9ucy5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGJhc2VNYWluRGltID0gZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGJvdW5kTWFpbkRpbSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcywgYmFzZU1haW5EaW0pO1xuXG4gICAgICAgICAgaWYgKGJhc2VNYWluRGltICE9PSBib3VuZE1haW5EaW0pIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gLT0gYm91bmRNYWluRGltO1xuICAgICAgICAgICAgdG90YWxGbGV4aWJsZSAtPSBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcblxuICAgICAgICAvLyBUaGUgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGNhbiBvdmVyZmxvdyB0aGUgY29udGFpbmVyLCBpbiB0aGlzIGNhc2VcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGp1c3QgYXNzdW1lIHRoYXQgdGhlcmUgaXMgbm8gc3BhY2UgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoZmxleGlibGVNYWluRGltIDwgMCkge1xuICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIG9mIHRoZSBlbGVtZW50IGluIHRoZSBtYWluXG4gICAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsXG4gICAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgbGF5b3V0IGFsZ29yaXRobSBmb3IgdGhpcyBjaGlsZFxuICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jdXJyZW50RmxleENoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgIGNoaWxkID0gY3VycmVudEZsZXhDaGlsZDtcbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFdlIHVzZSBqdXN0aWZ5Q29udGVudCB0byBmaWd1cmUgb3V0IGhvdyB0byBhbGxvY2F0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAvLyBzcGFjZSBhdmFpbGFibGVcbiAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9DRU5URVIpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX0VORCkge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbTtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTikge1xuICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihyZW1haW5pbmdNYWluRGltLCAwKTtcbiAgICAgICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSAhPT0gMCkge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQpIHtcbiAgICAgICAgICAvLyBTcGFjZSBvbiB0aGUgZWRnZXMgaXMgaGFsZiBvZiB0aGUgc3BhY2UgYmV0d2VlbiBlbGVtZW50c1xuICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50KTtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IGJldHdlZW5NYWluRGltIC8gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBDPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzIGFuZCBjb21wdXRlIGRpbWVuc2lvbnNcblxuICAgICAgLy8gQXQgdGhpcyBwb2ludCwgYWxsIHRoZSBjaGlsZHJlbiBoYXZlIHRoZWlyIGRpbWVuc2lvbnMgc2V0LiBXZSBuZWVkIHRvXG4gICAgICAvLyBmaW5kIHRoZWlyIHBvc2l0aW9uLiBJbiBvcmRlciB0byBkbyB0aGF0LCB3ZSBhY2N1bXVsYXRlIGRhdGEgaW5cbiAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGFyZSBhbHNvIHVzZWZ1bCB0byBjb21wdXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZVxuICAgICAgLy8gY29udGFpbmVyIVxuICAgICAgbWFpbkRpbSArPSBsZWFkaW5nTWFpbkRpbTtcblxuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4TWFpbjsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSBhbmQgaGFzIGxlZnQvdG9wIGJlaW5nXG4gICAgICAgICAgLy8gZGVmaW5lZCwgd2Ugb3ZlcnJpZGUgdGhlIHBvc2l0aW9uIHRvIHdoYXRldmVyIHRoZSB1c2VyIHNhaWRcbiAgICAgICAgICAvLyAoYW5kIG1hcmdpbi9ib3JkZXIpLlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSAod2l0aG91dCB0b3AvbGVmdCkgb3IgcmVsYXRpdmUsXG4gICAgICAgICAgLy8gd2UgcHV0IGl0IGF0IHRoZSBjdXJyZW50IGFjY3VtdWxhdGVkIG9mZnNldC5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSBwbGFjZWQgdGhlIGVsZW1lbnQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZG8gdGhhdCBmb3IgcmVsYXRpdmUgZWxlbWVudHMuIEFic29sdXRlIGVsZW1lbnRzXG4gICAgICAgICAgLy8gZG8gbm90IHRha2UgcGFydCBpbiB0aGF0IHBoYXNlLlxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBtYWluIGRpbWVuc2lvbiBpcyB0aGUgc3VtIG9mIGFsbCB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHBsdXNcbiAgICAgICAgICAgIC8vIHRoZSBzcGFjaW5nLlxuICAgICAgICAgICAgbWFpbkRpbSArPSBiZXR3ZWVuTWFpbkRpbSArIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICAgIC8vIFRoZSBjcm9zcyBkaW1lbnNpb24gaXMgdGhlIG1heCBvZiB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHNpbmNlIHRoZXJlXG4gICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgZWxlbWVudCBpbiB0aGF0IGNyb3NzIGRpbWVuc2lvbi5cbiAgICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjb250YWluZXJDcm9zc0F4aXMgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgIGNvbnRhaW5lckNyb3NzQXhpcyA9IGZtYXhmKFxuICAgICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgY3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEQ+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhDcm9zczsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgYWJzb2x1dGVseSBwb3NpdGlvbm5lZCBhbmQgaGFzIGFcbiAgICAgICAgICAvLyB0b3AvbGVmdC9ib3R0b20vcmlnaHQgYmVpbmcgc2V0LCB3ZSBvdmVycmlkZSBhbGwgdGhlIHByZXZpb3VzbHlcbiAgICAgICAgICAvLyBjb21wdXRlZCBwb3NpdGlvbnMgdG8gc2V0IGl0IGNvcnJlY3RseS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ0Nyb3NzRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgICAgIC8vIEZvciBhIHJlbGF0aXZlIGNoaWxkcmVuLCB3ZSdyZSBlaXRoZXIgdXNpbmcgYWxpZ25JdGVtcyAocGFyZW50KSBvclxuICAgICAgICAgIC8vIGFsaWduU2VsZiAoY2hpbGQpIGluIG9yZGVyIHRvIGRldGVybWluZSB0aGUgcG9zaXRpb24gaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAvLyBUaGlzIHZhcmlhYmxlIGlzIGludGVudGlvbmFsbHkgcmUtZGVmaW5lZCBhcyB0aGUgY29kZSBpcyB0cmFuc3BpbGVkIHRvIGEgYmxvY2sgc2NvcGUgbGFuZ3VhZ2VcbiAgICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgICAgLyplc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgICAvLyBZb3UgY2FuIG9ubHkgc3RyZXRjaCBpZiB0aGUgZGltZW5zaW9uIGhhcyBub3QgYWxyZWFkeSBiZWVuIHNldFxuICAgICAgICAgICAgICAvLyBwcmV2aW91c2x5LlxuICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSByZW1haW5pbmcgc3BhY2UgYmV0d2VlbiB0aGUgcGFyZW50IGRpbWVuc2lvbnMrcGFkZGluZyBhbmQgY2hpbGRcbiAgICAgICAgICAgICAgLy8gZGltZW5zaW9ucyttYXJnaW4uXG4gICAgICAgICAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdDcm9zc0RpbSA9IGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENTU19BTElHTl9GTEVYX0VORFxuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSBhcHBseSB0aGUgcG9zaXRpb25cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nQ3Jvc3NEaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZXNDcm9zc0RpbSArPSBjcm9zc0RpbTtcbiAgICAgIGxpbmVzTWFpbkRpbSA9IGZtYXhmKGxpbmVzTWFpbkRpbSwgbWFpbkRpbSk7XG4gICAgICBsaW5lc0NvdW50ICs9IDE7XG4gICAgICBzdGFydExpbmUgPSBlbmRMaW5lO1xuICAgIH1cblxuICAgIC8vIDxMb29wIEU+XG4gICAgLy9cbiAgICAvLyBOb3RlKHByZW5hdXgpOiBNb3JlIHRoYW4gb25lIGxpbmUsIHdlIG5lZWQgdG8gbGF5b3V0IHRoZSBjcm9zc0F4aXNcbiAgICAvLyBhY2NvcmRpbmcgdG8gYWxpZ25Db250ZW50LlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHdlIGNvdWxkIHByb2JhYmx5IHJlbW92ZSA8TG9vcCBEPiBhbmQgaGFuZGxlIHRoZSBvbmUgbGluZSBjYXNlXG4gICAgLy8gaGVyZSB0b28sIGJ1dCBmb3IgdGhlIG1vbWVudCB0aGlzIGlzIHNhZmVyIHNpbmNlIGl0IHdvbid0IGludGVyZmVyZSB3aXRoXG4gICAgLy8gcHJldmlvdXNseSB3b3JraW5nIGNvZGUuXG4gICAgLy9cbiAgICAvLyBTZWUgc3BlY3M6XG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMi9DUi1jc3MzLWZsZXhib3gtMjAxMjA5MTgvI2xheW91dC1hbGdvcml0aG1cbiAgICAvLyBzZWN0aW9uIDkuNFxuICAgIC8vXG4gICAgaWYgKGxpbmVzQ291bnQgPiAxICYmIGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICB2YXIvKmZsb2F0Ki8gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcztcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gPSBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplIC0gbGluZXNDcm9zc0RpbTtcblxuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltTGVhZCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gY3VycmVudExlYWQgPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50ID0gZ2V0QWxpZ25Db250ZW50KG5vZGUpO1xuICAgICAgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgaWYgKG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPiBsaW5lc0Nyb3NzRGltKSB7XG4gICAgICAgICAgY3Jvc3NEaW1MZWFkID0gKHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIGxpbmVzQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qaW50Ki8gZW5kSW5kZXggPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIvKmludCovIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcblxuICAgICAgICAvLyBjb21wdXRlIHRoZSBsaW5lJ3MgaGVpZ2h0IGFuZCBmaW5kIHRoZSBlbmRJbmRleFxuICAgICAgICB2YXIvKmZsb2F0Ki8gbGluZUhlaWdodCA9IDA7XG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGNoaWxkQ291bnQ7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQubGluZUluZGV4ICE9PSBpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgbGluZUhlaWdodCA9IGZtYXhmKFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dICsgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW5kSW5kZXggPSBpaTtcbiAgICAgICAgbGluZUhlaWdodCArPSBjcm9zc0RpbUxlYWQ7XG5cbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgZW5kSW5kZXg7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGxpbmVIZWlnaHQgLSBnZXRUcmFpbGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSAtIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgIHZhci8qZmxvYXQqLyBjaGlsZEhlaWdodCA9IGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyAobGluZUhlaWdodCAtIGNoaWxkSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgICAgLy8gVE9ETyhwcmVuYXV4KTogQ29ycmVjdGx5IHNldCB0aGUgaGVpZ2h0IG9mIGl0ZW1zIHdpdGggdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoYXV0bykgY3Jvc3NBeGlzIGRpbWVuc2lvbi5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50TGVhZCArPSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gZmFsc2U7XG4gICAgdmFyLypib29sKi8gbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gZmFsc2U7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhIHdpZHRoIG9yIGhlaWdodCwgYW5kIGl0IGhhcyBub3QgYmVlbiBzZXRcbiAgICAvLyBieSB0aGUgY29udGFpbmVyLCB0aGVuIHdlIHNldCBpdCB2aWEgdGhlIGNoaWxkcmVuLlxuICAgIGlmICghaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gV2UncmUgbWlzc2luZyB0aGUgbGFzdCBwYWRkaW5nIGF0IHRoaXMgcG9pbnQgdG8gZ2V0IHRoZSBmaW5hbFxuICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIG1haW5BeGlzLCBsaW5lc01haW5EaW0gKyBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpKSxcbiAgICAgICAgLy8gV2UgY2FuIG5ldmVyIGFzc2lnbiBhIHdpZHRoIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyc1xuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW5cbiAgICAgICk7XG5cbiAgICAgIGlmIChtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgbWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc01haW5UcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgbGluZXNDcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICApO1xuXG4gICAgICBpZiAoY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEY+IFNldCB0cmFpbGluZyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcbiAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MgfHwgbmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEc+IENhbGN1bGF0ZSBkaW1lbnNpb25zIGZvciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudHNcbiAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGZpcnN0QWJzb2x1dGVDaGlsZDtcbiAgICB3aGlsZSAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvclxuICAgICAgLy8gdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcblxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAhaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtsZWFkaW5nW2F4aXNdXSA9XG4gICAgICAgICAgICBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZDtcbiAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQ7XG4gICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZShub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgbm9kZS5zaG91bGRVcGRhdGUgPSB0cnVlO1xuXG4gICAgdmFyIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uIHx8IENTU19ESVJFQ1RJT05fTFRSO1xuICAgIHZhciBza2lwTGF5b3V0ID1cbiAgICAgICFub2RlLmlzRGlydHkgJiZcbiAgICAgIG5vZGUubGFzdExheW91dCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9PT0gbm9kZS5sYXlvdXQuaGVpZ2h0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPT09IG5vZGUubGF5b3V0LndpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPT09IHBhcmVudE1heFdpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID09PSBkaXJlY3Rpb247XG5cbiAgICBpZiAoc2tpcExheW91dCkge1xuICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBub2RlLmxhc3RMYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXlvdXQudG9wID0gbm9kZS5sYXN0TGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGF5b3V0LmxlZnQgPSBub2RlLmxhc3RMYXlvdXQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFub2RlLmxhc3RMYXlvdXQpIHtcbiAgICAgICAgbm9kZS5sYXN0TGF5b3V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgLy8gUmVzZXQgY2hpbGQgbGF5b3V0c1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLmxheW91dC53aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LnRvcCA9IDA7XG4gICAgICAgIGNoaWxkLmxheW91dC5sZWZ0ID0gMDtcbiAgICAgIH0pO1xuXG4gICAgICBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKTtcblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LndpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnRvcCA9IG5vZGUubGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGFzdExheW91dC5sZWZ0ID0gbm9kZS5sYXlvdXQubGVmdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxheW91dE5vZGVJbXBsOiBsYXlvdXROb2RlSW1wbCxcbiAgICBjb21wdXRlTGF5b3V0OiBsYXlvdXROb2RlLFxuICAgIGZpbGxOb2RlczogZmlsbE5vZGVzXG4gIH07XG59KSgpO1xuXG4vLyBUaGlzIG1vZHVsZSBleHBvcnQgaXMgb25seSB1c2VkIGZvciB0aGUgcHVycG9zZXMgb2YgdW5pdCB0ZXN0aW5nIHRoaXMgZmlsZS4gV2hlblxuLy8gdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQgdGhpcyBmaWxlIGlzIGluY2x1ZGVkIHdpdGhpbiBjc3MtbGF5b3V0LmpzIHdoaWNoIGZvcm1zXG4vLyB0aGUgcHVibGljIEFQSS5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlTGF5b3V0O1xufVxuXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgLy8gZGlzYWJsaW5nIEVTTGludCBiZWNhdXNlIHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGFib3ZlIGluY2x1ZGVcbiAgICBjb21wdXRlTGF5b3V0LmZpbGxOb2Rlcyhub2RlKTtcbiAgICBjb21wdXRlTGF5b3V0LmNvbXB1dGVMYXlvdXQobm9kZSk7XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH07XG59KSk7XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbm1vZHVsZS5leHBvcnRzLlRpbnlFbWl0dGVyID0gRTtcbiIsImltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IFRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnRleHR1cmUgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHNyYywgKHRleHR1cmUsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmV2ZW50LmVtaXQoJ3RleHRfX2xvYWRfX2RvbmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ29uZmlnKGZudFRleHQ6IHN0cmluZykge1xuICAgIGZudFRleHQgPSBmbnRUZXh0LnNwbGl0KCdcXHJcXG4nKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBmbnRUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsaW5lc1BhcnNlZDogc3RyaW5nW11bXSA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUudHJpbSgpLnNwbGl0KCcgJykpO1xuXG4gICAgY29uc3QgY2hhcnNMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NoYXJzJyk7XG4gICAgY29uc3QgY2hhcnNDb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyc0xpbmUubGluZSwgJ2NvdW50Jyk7XG5cbiAgICBjb25zdCBjb21tb25MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NvbW1vbicpO1xuICAgIHRoaXMubGluZUhlaWdodCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29tbW9uTGluZS5saW5lLCAnbGluZUhlaWdodCcpO1xuXG4gICAgY29uc3QgaW5mb0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnaW5mbycpO1xuICAgIHRoaXMuZm9udFNpemUgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGluZm9MaW5lLmxpbmUsICdzaXplJyk7XG5cbiAgICAvLyDmjqXljbgga2VybmluZ3NcbiAgICBjb25zdCBrZXJuaW5nc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAna2VybmluZ3MnKTtcbiAgICBsZXQga2VybmluZ3NDb3VudCA9IDA7XG4gICAgbGV0IGtlcm5pbmdzU3RhcnQgPSAtMTtcbiAgICBpZiAoa2VybmluZ3NMaW5lLmxpbmUpIHtcbiAgICAgIGtlcm5pbmdzQ291bnQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGtlcm5pbmdzTGluZS5saW5lLCAnY291bnQnKTtcbiAgICAgIGtlcm5pbmdzU3RhcnQgPSBrZXJuaW5nc0xpbmUuaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJzOiBDaGFycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgNCArIGNoYXJzQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgY2hhclRleHQ6IHN0cmluZyA9IGxpbmVzW2ldO1xuICAgICAgY29uc3QgbGV0dGVyOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdpZCcpKTtcblxuICAgICAgY29uc3QgYzogQ2hhckRhdGEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4JyksXG4gICAgICAgIHk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5JyksXG4gICAgICAgIHc6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd3aWR0aCcpLFxuICAgICAgICBoOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaGVpZ2h0JyksXG4gICAgICAgIG9mZlg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4b2Zmc2V0JyksXG4gICAgICAgIG9mZlk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5b2Zmc2V0JyksXG4gICAgICAgIHhhZHZhbmNlOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneGFkdmFuY2UnKSxcbiAgICAgICAga2VybmluZzoge31cbiAgICAgIH07XG4gICAgICBjaGFyc1tsZXR0ZXJdID0gYztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBrZXJuaW5nc1xuICAgIGlmIChrZXJuaW5nc0NvdW50KSB7XG4gICAgICBmb3IgKGxldCBpID0ga2VybmluZ3NTdGFydDsgaSA8PSBrZXJuaW5nc1N0YXJ0ICsga2VybmluZ3NDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGZpcnN0OiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2ZpcnN0JykpO1xuICAgICAgICBjb25zdCBzZWNvbmQ6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnc2Vjb25kJykpO1xuICAgICAgICBjb25zdCBhbW91bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2Ftb3VudCcpO1xuXG4gICAgICAgIGlmIChjaGFyc1tzZWNvbmRdKSB7XG4gICAgICAgICAgY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQ6IHN0cmluZ1tdW10sIGxpbmVOYW1lID0gJycpOiBDb25maWdMaW5lRGF0YSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGVuID0gbGluZXNQYXJzZWQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcblxuICAgICAgaWYgKGl0ZW1bMF0gPT09IGxpbmVOYW1lKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgbGluZSA9IGl0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmUsXG4gICAgICBpbmRleCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29uZmlnVGV4dDogc3RyaW5nW10gfCBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbUNvbmZpZ1RleHRMaXN0ID0gQXJyYXkuaXNBcnJheShjb25maWdUZXh0KSA/IGNvbmZpZ1RleHQgOiBjb25maWdUZXh0LnNwbGl0KCcgJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGl0ZW1Db25maWdUZXh0TGlzdDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtQ29uZmlnVGV4dCA9IGl0ZW1Db25maWdUZXh0TGlzdFtpXTtcbiAgICAgIGlmIChrZXkgPT09IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZyhrZXkubGVuZ3RoICsgMSk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsImludGVyZmFjZSBEZWJ1Z0luZm9JdGVtIHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgaXNJbm5lcjogYm9vbGVhbjtcbiAgZW5kPzogbnVtYmVyO1xuICBjb3N0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z0luZm8ge1xuICBwdWJsaWMgaW5mbzogeyBba2V5OiBzdHJpbmddOiBEZWJ1Z0luZm9JdGVtIH0gPSB7fTtcbiAgcHVibGljIHRvdGFsU3RhcnQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0b3RhbENvc3Q6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RhcnQobmFtZTogc3RyaW5nLCBpc0lubmVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50b3RhbFN0YXJ0ID09PSAwKSB7XG4gICAgICB0aGlzLnRvdGFsU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5mb1tuYW1lXSA9IHtcbiAgICAgIHN0YXJ0OiBEYXRlLm5vdygpLFxuICAgICAgaXNJbm5lcixcbiAgICB9O1xuICB9XG5cbiAgZW5kKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmluZm9bbmFtZV0pIHtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5lbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmNvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy5pbmZvW25hbWVdLnN0YXJ0O1xuICAgICAgdGhpcy50b3RhbENvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy50b3RhbFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5mbyA9IHt9O1xuICAgIHRoaXMudG90YWxTdGFydCA9IDA7XG4gICAgdGhpcy50b3RhbENvc3QgPSAwO1xuICB9XG5cbiAgbG9nKG5lZWRJbm5lcjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgbG9nSW5mbyA9ICdMYXlvdXQgZGVidWcgaW5mbzogXFxuJztcbiAgICBsb2dJbmZvICs9IE9iamVjdC5rZXlzKHRoaXMuaW5mbykucmVkdWNlKChzdW0sIGN1cnIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluZm9bY3Vycl0uaXNJbm5lciAmJiAhbmVlZElubmVyKSB7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgICBzdW0gKz0gYCR7Y3Vycn06ICR7dGhpcy5pbmZvW2N1cnJdLmNvc3R9XFxuYDtcbiAgICAgIHJldHVybiBzdW07XG4gICAgfSwgJycpO1xuXG4gICAgbG9nSW5mbyArPSBgdG90YWxDb3N0OiAke3RoaXMudG90YWxDb3N0fVxcbmA7XG5cbiAgICByZXR1cm4gbG9nSW5mbztcbiAgfVxufVxuIiwiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcbmltcG9ydCB7IG5vbmUgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG50eXBlIENhbGxiYWNrID0gKGltZzogSFRNTEltYWdlRWxlbWVudCwgZnJvbUNhY2hlOiBib29sZWFuKSA9PiB2b2lkO1xuaW50ZXJmYWNlIEltYWdlQ2FjaGUge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGxvYWREb25lOiBib29sZWFuO1xuICBvbmxvYWRjYmtzOiBDYWxsYmFja1tdO1xuICBvbmVycm9yY2JrczogQ2FsbGJhY2tbXTtcbn1cblxuY2xhc3MgSW1hZ2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBpbWdQb29sID0gbmV3IFBvb2w8SW1hZ2VDYWNoZT4oJ2ltZ1Bvb2wnKTtcbiAgXG4gIGdldFJlcyhzcmM6IHN0cmluZyk6IEltYWdlQ2FjaGUge1xuICAgIHJldHVybiB0aGlzLmltZ1Bvb2wuZ2V0KHNyYyk7XG4gIH1cblxuICBsb2FkSW1hZ2VQcm9taXNlKHNyYzogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRJbWFnZShzcmMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcsIHN1Y2Nlc3M6IENhbGxiYWNrID0gbm9uZSwgZmFpbDogQ2FsbGJhY2sgPSBub25lKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGlmICghc3JjKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5nZXRSZXMoc3JjKTtcblxuICAgIC8vIOWbvueJh+W3sue7j+iiq+WKoOi9vei/h++8jOebtOaOpei/lOWbnuWbvueJh+W5tuS4lOaJp+ihjOWbnuiwg1xuICAgIGlmIChjYWNoZSAmJiBjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuICAgICAgc3VjY2VzcyhpbWcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoY2FjaGUgJiYgIWNhY2hlLmxvYWREb25lKSB7XG4gICAgICAvLyDlm77niYfmraPlnKjliqDovb3ov4fnqIvkuK3vvIzov5Tlm57lm77niYflubbkuJTnrYnlvoXlm77niYfliqDovb3lrozmiJDmiafooYzlm57osINcbiAgICAgIGltZyA9IGNhY2hlLmltZztcblxuICAgICAgY2FjaGUub25sb2FkY2Jrcy5wdXNoKHN1Y2Nlc3MpO1xuICAgICAgY2FjaGUub25lcnJvcmNia3MucHVzaChmYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Yib5bu65Zu+54mH77yM5bCG5Zue6LCD5Ye95pWw5o6o5YWl5Zue6LCD5Ye95pWw5qCIXG4gICAgICBpbWcgPSBlbnYuY3JlYXRlSW1hZ2UoKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7XG4gICAgICAgIGltZyxcbiAgICAgICAgbG9hZERvbmU6IGZhbHNlLFxuICAgICAgICBvbmxvYWRjYmtzOiBbc3VjY2Vzc10sXG4gICAgICAgIG9uZXJyb3JjYmtzOiBbZmFpbF0sXG4gICAgICB9XG4gICAgIFxuICAgICAgdGhpcy5pbWdQb29sLnNldChzcmMsIG5ld0NhY2hlKTtcblxuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUubG9hZERvbmUgPSB0cnVlO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW1hZ2VNYW5hZ2VyKCk7XG4iLCJjb25zdCBwb29sczogUG9vbDxhbnk+W10gPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbDxUPiB7XG4gIHB1YmxpYyBuYW1lID0gJ3Bvb2wnXG4gIHB1YmxpYyBwb29sOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUgPSAncG9vbCcpIHtcbiAgICBjb25zdCBjdXJyID0gcG9vbHMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG5cbiAgICBpZiAoY3Vycikge1xuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcblxuICAgIHBvb2xzLnB1c2godGhpcyk7XG4gIH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5wb29sW2tleV07XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5wb29sW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICB9XG5cbiAgZ2V0TGlzdCgpOiBUW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMucG9vbCk7XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyB3aWR0aCA9IDA7XG4gIHB1YmxpYyBoZWlnaHQgPSAwO1xuICBwdWJsaWMgbGVmdCA9IDA7XG4gIHB1YmxpYyByaWdodCA9IDA7XG4gIHB1YmxpYyB0b3AgPSAwO1xuICBwdWJsaWMgYm90dG9tID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5zZXQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNldChsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICB0aGlzLnJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm55u45LqkXG4gICAqIOWOn+eQhuWPr+ingTogaHR0cHM6Ly96aHVhbmxhbi56aGlodS5jb20vcC8yOTcwNDA2NFxuICAgKi9cbiAgaW50ZXJzZWN0cyhyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5yaWdodCA8IHJlY3QubGVmdCB8fCByZWN0LnJpZ2h0IDwgdGhpcy5sZWZ0IHx8IHRoaXMuYm90dG9tIDwgcmVjdC50b3AgfHwgcmVjdC5ib3R0b20gPCB0aGlzLnRvcCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tlciB7XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGFuaW1hdGlvbklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyQ2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgbmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyTmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuXG4gIHByaXZhdGUgbGFzdFRpbWUhOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZGVsdGFUaW1lID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgLy8gY29uc29sZS5sb2coZHQpXG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5pbm5lck5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmlubmVyTmV4dENicy5mb3JFYWNoKGNiID0+IGNiKGRlbHRhVGltZSkpO1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiB0aGlzLmNicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KGNiOiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJOZXh0Q2JzLnB1c2goY2IpIDogdGhpcy5uZXh0Q2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUlubmVyKCkge1xuICAgIHRoaXMuaW5uZXJDYnMgPSBbXTtcbiAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgKHRoaXMuY2JzLmluZGV4T2YoY2IpID4gLTEgfHwgdGhpcy5pbm5lckNicy5pbmRleE9mKGNiKSA+IC0xKSkge1xuICAgICAgY29uc3QgbGlzdCA9IGlzSW5uZXIgPyB0aGlzLmlubmVyQ2JzIDogdGhpcy5jYnM7XG4gICAgICBsaXN0LnNwbGljZSh0aGlzLmNicy5pbmRleE9mKGNiKSwgMSk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNicy5sZW5ndGggJiYgIXRoaXMuaW5uZXJDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuXG4gICAgICB0aGlzLmxhc3RUaW1lID0gRGF0ZS5ub3coKTtcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPT09IG51bGwgJiYgKHRoaXMuY2JzLmxlbmd0aCB8fCB0aGlzLmlubmVyQ2JzLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gbm9uZSgpIHsgfVxuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGVudW0gU1RBVEUge1xuICBVTklOSVQgPSAnVU5JTklUJyxcbiAgSU5JVEVEID0gJ0lOSVRFRCcsXG4gIFJFTkRFUkVEID0gJ1JFTkRFUkVEJyxcbiAgQ0xFQVIgPSAnQ0xFQVInLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyQ2FudmFzKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eCAmJiBjdHguY2xlYXJSZWN0KDAsIDAsIGN0eC5jYW52YXMud2lkdGgsIGN0eC5jYW52YXMuaGVpZ2h0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlUb3VjaEFycmF5KHRvdWNoZXM6IEdhbWVUb3VjaFtdKSB7XG4gIHJldHVybiB0b3VjaGVzLm1hcCh0b3VjaCA9PiAoe1xuICAgIGlkZW50aWZpZXI6IHRvdWNoLmlkZW50aWZpZXIsXG4gICAgcGFnZVg6IHRvdWNoLnBhZ2VYLFxuICAgIHBhZ2VZOiB0b3VjaC5wYWdlWSxcbiAgICBjbGllbnRYOiB0b3VjaC5jbGllbnRYLFxuICAgIGNsaWVudFk6IHRvdWNoLmNsaWVudFksXG4gIH0pKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzR2FtZVRvdWNoRXZlbnQoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KTogZSBpcyBHYW1lVG91Y2hFdmVudCB7XG4gIHJldHVybiAndG91Y2hlcycgaW4gZTtcbn1cblxuLyoqXG4gKiDlj5bmnIDlsI/lgLzlkozmnIDlpKflgLzkuYvpl7TnmoTljLrpl7TpmZDlrprlgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIg6ZyA6KaB6KKr5aSE55CG55qE5pWw5a2XXG4gKiBAcGFyYW0ge251bWJlcn0gbWluIOacgOWwj+WAvFxuICogQHBhcmFtIHtudW1iZXJ9IG1heCDmnIDlpKflgLxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKG51bWJlcjogbnVtYmVyLCBtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihudW1iZXIsIG1heCkpO1xufVxuXG4vKipcbiAqIOS4pOS4quaVsOS5i+mXtOeahOe6v+aAp+aPkuWAvOOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVycChmcm9tOiBudW1iZXIsIHRvOiBudW1iZXIsIHJhdGlvOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogcmF0aW87XG59IiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbi8vIGNvbXBvbmVudHNcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMsIEVsZW1lbnQsIEJ1dHRvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBJTGF5b3V0LCBJTGF5b3V0Qm94IH0gZnJvbSAnLi4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgeyBDYWxsYmFjaywgVHJlZU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG4gIGJ1dHRvbjogQnV0dG9uLFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyQ29tcG9uZW50KG5hbWU6IHN0cmluZywgQ29uc3RydWN0b3I6IENvbnN0cnVjdG9yKSB7XG4gIGNvbnN0cnVjdG9yTWFwW25hbWVdID0gQ29uc3RydWN0b3I7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgL1xcZCsoPzpcXC5cXGQrKT8lLy50ZXN0KGRhdGEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IGVudi5nZXRSb290Q2FudmFzU2l6ZSgpO1xuICAgIH1cbiAgICBpZiAoaXNQZXJjZW50KHRoaXNTdHlsZS53aWR0aCkpIHtcbiAgICAgIHRoaXNTdHlsZS53aWR0aCA9IHBhcmVudFN0eWxlLndpZHRoID8gY29udmVydFBlcmNlbnQodGhpc1N0eWxlLndpZHRoLCBwYXJlbnRTdHlsZS53aWR0aCkgOiAwO1xuICAgIH1cbiAgICBpZiAoaXNQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQpKSB7XG4gICAgICB0aGlzU3R5bGUuaGVpZ2h0ID0gcGFyZW50U3R5bGUuaGVpZ2h0ID8gY29udmVydFBlcmNlbnQodGhpc1N0eWxlLmhlaWdodCwgcGFyZW50U3R5bGUuaGVpZ2h0KSA6IDA7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiB0aGlzU3R5bGUub3BhY2l0eSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXNTdHlsZS5vcGFjaXR5ID0gMTtcbiAgICB9XG5cbiAgICBpZiAocGFyZW50U3R5bGUgJiYgcGFyZW50U3R5bGUub3BhY2l0eSAhPT0gMSAmJiB0eXBlb2YgcGFyZW50U3R5bGUub3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgIHRoaXNTdHlsZS5vcGFjaXR5ID0gcGFyZW50U3R5bGUub3BhY2l0eSAqIHRoaXNTdHlsZS5vcGFjaXR5O1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3MpO1xuICBjb25zdCBlbGVtZW50ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICAvLyBAdHMtaWdub3JlXG4gIGVsZW1lbnQucm9vdCA9IHRoaXM7XG4gIGVsZW1lbnQudGFnTmFtZSA9IG5vZGUubmFtZTtcblxuICBlbGVtZW50LmFmdGVyQ3JlYXRlKCk7XG5cbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlOiBUcmVlTm9kZSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjaGlsZEVsZW1lbnQgPSBjcmVhdGUuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIHN0eWxlLCBhcmdzKTtcblxuICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuYWRkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuKGNoaWxkcmVuOiBFbGVtZW50W10sIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlciA9IHRydWUpIHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAvLyBjaGlsZC5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICBjaGlsZC5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2hpbGQuaW5zZXJ0KGNvbnRleHQsIG5lZWRSZW5kZXIpO1xuXG4gICAgLy8gU2Nyb2xsVmlld+eahOWtkOiKgueCuea4suafk+S6pOe7mVNjcm9sbFZpZXfoh6rlt7HvvIzkuI3mlK/mjIHltYzlpZdTY3JvbGxWaWV3XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBjb250ZXh0LCAgY2hpbGQudHlwZSA9PT0gJ1Njcm9sbFZpZXcnID8gZmFsc2UgOiBuZWVkUmVuZGVyKTtcbiAgfSk7XG59XG5cbi8qKlxuICog5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXRDaGlsZHJlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5sYXlvdXRCb3ggPSBjaGlsZC5sYXlvdXRCb3ggfHwge307XG5cbiAgICBbJ2xlZnQnLCAndG9wJywgJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGQubGF5b3V0Qm94W3Byb3AgYXMga2V5b2YgSUxheW91dEJveF0gPSBjaGlsZC5sYXlvdXQ/Lltwcm9wIGFzIGtleW9mIElMYXlvdXRdIGFzIG51bWJlcjtcbiAgICB9KTtcblxuICAgIGlmIChjaGlsZC5wYXJlbnQpIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVggfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVkgfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9XG5cbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZO1xuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVg7XG5cblxuICAgIGxheW91dENoaWxkcmVuKGNoaWxkKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vbmUoKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlVHJlZShlbGVtZW50OiBFbGVtZW50LCBjYWxsYmFjazogQ2FsbGJhY2sgPSBub25lKSB7XG4gIGNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpdGVyYXRlVHJlZShjaGlsZCwgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRDaGlsZHJlbiA9IChjaGlsZHJlbjogRWxlbWVudFtdKSA9PiB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgaWYgKGNoaWxkLnR5cGUgIT09ICdTY3JvbGxWaWV3Jykge1xuICAgICAgcmVwYWludENoaWxkcmVuKGNoaWxkLmNoaWxkcmVuKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRUcmVlID0gKHRyZWU6IEVsZW1lbnQpID0+IHtcbiAgdHJlZS5yZXBhaW50KCk7XG5cbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIHJlcGFpbnRUcmVlKGNoaWxkKTtcbiAgfSk7XG59O1xuXG5pbnRlcmZhY2UgRWxlbWVudEFyZ3Mge1xuICBzdHlsZTogb2JqZWN0O1xuICBpZE5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGRhdGFzZXQ6IG9iamVjdDtcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQgZXh0ZW5kcyBFbGVtZW50Pihyb290OiBULCBlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSwgcGFyZW50PzogRWxlbWVudCkge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW2VsZW1lbnQudGFnTmFtZSBhcyBzdHJpbmddO1xuICAvLyBAdHMtaWdub3JlXG4gIHJvb3QuZWxlQ291bnQgKz0gMTtcblxuICBjb25zdCBhcmdzOiBFbGVtZW50QXJncyA9IHtcbiAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5zdHlsZSksXG4gICAgaWROYW1lOiBlbGVtZW50LmlkTmFtZSxcbiAgICBjbGFzc05hbWU6IGVsZW1lbnQuY2xhc3NOYW1lLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogcm9vdC5lbGVDb3VudCxcbiAgICBkYXRhc2V0OiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LmRhdGFzZXQpLFxuICAgIG5hbWU6IGVsZW1lbnQudGFnTmFtZSxcbiAgfTtcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEltYWdlKSB7XG4gICAgYXJncy5zcmMgPSBlbGVtZW50LnNyYztcbiAgfSBlbHNlIGlmIChlbGVtZW50IGluc3RhbmNlb2YgVGV4dCB8fCBlbGVtZW50IGluc3RhbmNlb2YgQml0TWFwVGV4dCkge1xuICAgIGFyZ3MudmFsdWUgPSBlbGVtZW50LnZhbHVlO1xuICB9XG5cbiAgY29uc3QgbmV3RWxlbWVuZXQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIG5ld0VsZW1lbmV0LnJvb3QgPSByb290O1xuICAvLyBAdHMtaWdub3JlXG4gIG5ld0VsZW1lbmV0Lmluc2VydChyb290LnJlbmRlckNvbnRleHQsIGZhbHNlKTtcbiAgbmV3RWxlbWVuZXQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKTtcblxuICBpZiAocGFyZW50KSB7XG4gICAgcGFyZW50LmFkZChuZXdFbGVtZW5ldCk7XG4gIH1cblxuICBpZiAoZGVlcCkge1xuICAgIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNsb25lKHJvb3QsIGNoaWxkLCBkZWVwLCBuZXdFbGVtZW5ldCk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3RWxlbWVuZXQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4uL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2w8Qml0TWFwRm9udD4oJ2JpdE1hcFBvb2wnKTtcblxuaW50ZXJmYWNlIElCaXRNYXBUZXh0T3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBmb250Pzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ0JpdE1hcFRleHQnO1xuICBwcml2YXRlIHZhbHVlc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBmb250OiBCaXRNYXBGb250O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElCaXRNYXBUZXh0T3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgdmFsdWUgPSAnJyxcbiAgICAgIGZvbnQgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIHRoaXMuZm9udCA9IGJpdE1hcFBvb2wuZ2V0KGZvbnQpO1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBNaXNzaW5nIEJpdG1hcEZvbnQgXCIke2ZvbnR9XCIsIHBsZWFzZSBpbnZva2UgQVBJIFwicmVnaXN0Qml0TWFwRm9udFwiIGJlZm9yZSB1c2luZyBcIkJpdE1hcFRleHRcImApO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5lbWl0KCdyZXBhaW50Jyk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnQucmVhZHkpIHtcbiAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvbnQuZXZlbnQub24oJ3RleHRfX2xvYWRfX2RvbmUnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRUZXh0Qm91bmRzKCkge1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7IGxldHRlclNwYWNpbmcgPSAwIH0gPSBzdHlsZTtcbiAgICBsZXQgd2lkdGggPSAwO1xuXG4gICAgLy8g6K6w5b2V5LiK5LiA5Liq5a2X56ym77yM5pa55L6/5aSE55CGIGtlcm5pbmdcbiAgICBsZXQgcHJldkNoYXJDb2RlID0gbnVsbDtcblxuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuXG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIGlmIChwcmV2Q2hhckNvZGUgJiYgY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXSkge1xuICAgICAgICAgIHdpZHRoICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICAgIH1cbiAgXG4gICAgICAgIHdpZHRoICs9IGNmZy54YWR2YW5jZTtcblxuICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICB3aWR0aCArPSBsZXR0ZXJTcGFjaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodDogdGhpcy5mb250LmxpbmVIZWlnaHQgfTtcbiAgfVxuXG4gIHJlbmRlclRleHQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFRleHRCb3VuZHMoKTtcbiAgICBjb25zdCBkZWZhdWx0TGluZUhlaWdodCA9IHRoaXMuZm9udC5saW5lSGVpZ2h0IGFzIG51bWJlcjtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBsZXQgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1kgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoID0gMCwgLy8g5rKh5pyJ6K6+572u6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICBoZWlnaHQgPSAwLCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIHRleHRBbGlnbiwgLy8g5paH5a2X5bem5Y+z5a+56b2Q5pa55byPXG4gICAgICB2ZXJ0aWNhbEFsaWduLFxuICAgICAgbGV0dGVyU3BhY2luZyA9IDAsXG4gICAgfSA9IHN0eWxlO1xuICAgIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAoc3R5bGUubGluZUhlaWdodCB8fCBkZWZhdWx0TGluZUhlaWdodCkgYXMgbnVtYmVyXG5cbiAgICBjb25zdCBzY2FsZVkgPSBsaW5lSGVpZ2h0IC8gZGVmYXVsdExpbmVIZWlnaHQ7XG5cbiAgICBjb25zdCByZWFsV2lkdGggPSBzY2FsZVkgKiBib3VuZHMud2lkdGg7XG5cbiAgICAvLyDlpoLmnpzmloflrZfnmoTmuLLmn5PljLrln5/pq5jluqblsI/kuo7nm5LlrZDpq5jluqbvvIzph4fnlKjlr7npvZDmlrnlvI9cbiAgICBpZiAobGluZUhlaWdodCA8IGhlaWdodCkge1xuICAgICAgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdtaWRkbGUnKSB7XG4gICAgICAgIGRyYXdZICs9IChoZWlnaHQgLSBsaW5lSGVpZ2h0KSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdib3R0b20nKSB7XG4gICAgICAgIGRyYXdZID0gZHJhd1kgKyBoZWlnaHQgLSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aWR0aCA+IHJlYWxXaWR0aCkge1xuICAgICAgaWYgKHRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgZHJhd1ggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBkcmF3WCArPSAod2lkdGggLSByZWFsV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOiusOW9leS4iuS4gOS4quWtl+espu+8jOaWueS+v+WkhOeQhiBrZXJuaW5nXG4gICAgbGV0IHByZXZDaGFyQ29kZSA9IG51bGw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuXG4gICAgICBpZiAocHJldkNoYXJDb2RlICYmIGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV0pIHtcbiAgICAgICAgZHJhd1ggKz0gY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNmZykge1xuICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgIHRoaXMuZm9udC50ZXh0dXJlIGFzIEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgICAgICAgY2ZnLngsXG4gICAgICAgICAgY2ZnLnksXG4gICAgICAgICAgY2ZnLncsXG4gICAgICAgICAgY2ZnLmgsXG4gICAgICAgICAgZHJhd1ggKyBjZmcub2ZmWCAqIHNjYWxlWSAtIG9yaWdpblgsXG4gICAgICAgICAgZHJhd1kgKyBjZmcub2ZmWSAqIHNjYWxlWSAtIG9yaWdpblksXG4gICAgICAgICAgY2ZnLncgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLmggKiBzY2FsZVksXG4gICAgICAgICk7XG5cbiAgICAgICAgZHJhd1ggKz0gKGNmZy54YWR2YW5jZSAqIHNjYWxlWSArIGxldHRlclNwYWNpbmcpO1xuXG4gICAgICAgIHByZXZDaGFyQ29kZSA9IGNoYXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgVGV4dCwgeyBJVGV4dFByb3BzIH0gZnJvbSAnLi90ZXh0JztcclxuaW1wb3J0IHsgbGVycCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgVGV4dCB7XHJcbiAgLy8g57yp5pS+5Yqo55S755qE5pe26ZW/XHJcbiAgcHVibGljIHNjYWxlRHVyYXRpb24gPSAxMDA7XHJcbiAgLy8g5b2T5YmN57yp5pS+5Yqo55S75piv5ZCm5pKt5pS+5a6M5q+VXHJcbiAgcHJpdmF0ZSBzY2FsZURvbmUgPSB0cnVlO1xyXG4gIC8vIOe8qeaUvuWKqOeUu+W8gOWni+eahOaXtumXtFxyXG4gIHByaXZhdGUgdGltZUNsaWNrID0gMDtcclxuICAvLyDnvKnmlL7liqjnlLvnmoQgc2NhbGUg5Yid5aeL5YC877yM6L+Z5bm25LiN5piv5Zu65a6a5LiN5Y+Y55qE77yM5b2T54K55Ye757uT5p2f77yM5Y+v6IO96ZyA6KaB5LuO5aSn5Yiw5bCP5Y+Y5o2iXHJcbiAgcHJpdmF0ZSBmcm9tU2NhbGUgPSAxO1xyXG4gIC8vIOe8qeaUvuWKqOeUu+eahCBzY2FsZSDnm67moIflgLxcclxuICBwcml2YXRlIHRvU2NhbGUgPSAxO1xyXG5cclxuICBjb25zdHJ1Y3Rvcih7XHJcbiAgICBzdHlsZSA9IHt9LFxyXG4gICAgaWROYW1lID0gJycsXHJcbiAgICBjbGFzc05hbWUgPSAnJyxcclxuICAgIHZhbHVlID0gJycsXHJcbiAgICBkYXRhc2V0LFxyXG4gIH06IElUZXh0UHJvcHMpIHtcclxuICAgIHN1cGVyKHtcclxuICAgICAgaWROYW1lLFxyXG4gICAgICBjbGFzc05hbWUsXHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgd2lkdGg6IDMwMCxcclxuICAgICAgICBoZWlnaHQ6IDYwLFxyXG4gICAgICAgIGxpbmVIZWlnaHQ6IDYwLFxyXG4gICAgICAgIGZvbnRTaXplOiAzMCxcclxuICAgICAgICBib3JkZXJSYWRpdXM6IDEwLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMzNGExMjMnLFxyXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgICAuLi5zdHlsZSxcclxuICAgICAgICAnOmFjdGl2ZSc6IHtcclxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuMDUsIDEuMDUpJyxcclxuICAgICAgICAgIC4uLnN0eWxlWyc6YWN0aXZlJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgICAgdmFsdWUsXHJcbiAgICAgIGRhdGFzZXQsXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGFmdGVyQ3JlYXRlKCkge1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy5yb290LnRpY2tlci5hZGQodGhpcy51cGRhdGUpO1xyXG4gIH1cclxuXHJcbiAgZGVzdHJveVNlbGYoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLnJvb3QudGlja2VyLnJlbW92ZSh0aGlzLnVwZGF0ZSk7XHJcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcclxuICAgIHRoaXMucm9vdCA9IG51bGw7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUgPSAoZHQ6IG51bWJlcikgPT4ge1xyXG4gICAgaWYgKHRoaXMuc2NhbGVEb25lKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMudGltZUNsaWNrICs9IGR0O1xyXG5cclxuICAgIGxldCByYXRpbyA9IDE7XHJcblxyXG4gICAgcmF0aW8gPSB0aGlzLnRpbWVDbGljayAvIHRoaXMuc2NhbGVEdXJhdGlvbjtcclxuXHJcbiAgICBpZiAocmF0aW8gPiAxKSB7XHJcbiAgICAgIHJhdGlvID0gMTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgc2NhbGUgPSBsZXJwKHRoaXMuZnJvbVNjYWxlLCB0aGlzLnRvU2NhbGUsIHJhdGlvKTtcclxuICAgIGxldCB0cmFuc2Zvcm0gPSBgc2NhbGUoJHtzY2FsZX0sICR7c2NhbGV9KWA7XHJcbiAgICB0aGlzLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybTtcclxuXHJcbiAgICBpZiAocmF0aW8gPT09IDEpIHtcclxuICAgICAgdGhpcy5zY2FsZURvbmUgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJQ2FudmFzT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGF1dG9DcmVhdGVDYW52YXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBjYW52YXNJbnN0YW5jZTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElDYW52YXNPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgICAgd2lkdGggPSAxMDAsXG4gICAgICBoZWlnaHQgPSAxMDAsXG4gICAgICBhdXRvQ3JlYXRlQ2FudmFzID0gZmFsc2UsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HlsI/muLjmiI/lnLrmma/kuIvvvIxzaGFyZWRDYW52YXMg5a6e5L6L5LiN5pa55L6/6Ieq5Yqo5Yib5bu677yM5o+Q5L6bIHNldHRlciDmiYvliqjorr7nva5cbiAgICAgKi9cbiAgICBpZiAoYXV0b0NyZWF0ZUNhbnZhcykge1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGVudi5jcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzSW5zdGFuY2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg57uT5p2fXG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpIHtcbiAgICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgcmVuZGVyQWZmZWN0U3R5bGVzLCBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBSZWN0IGZyb20gJy4uL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCB7IElEYXRhc2V0LCBDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzL2luZGV4J1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIsIHBhcnNlVHJhbnNmb3JtLCBJUmVuZGVyRm9yTGF5b3V0IH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG4vLyBpbXBvcnQgeyBjb252ZXJ0UGVyY2VudCB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbmZ1bmN0aW9uIGNvbnZlcnRQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlciwgcGFyZW50RGF0YTogbnVtYmVyKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicgfHwgZGF0YSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgY29uc3QgbWF0Y2hEYXRhID0gZGF0YS5tYXRjaCgvKFxcZCsoPzpcXC5cXGQrKT8pJS8pO1xuICBpZiAobWF0Y2hEYXRhICYmIG1hdGNoRGF0YVsxXSkge1xuICAgIHJldHVybiBwYXJlbnREYXRhICogcGFyc2VGbG9hdChtYXRjaERhdGFbMV0pICogMC4wMTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUlkPFQgZXh0ZW5kcyBFbGVtZW50Pih0cmVlOiBFbGVtZW50LCBsaXN0OiAoRWxlbWVudCB8IFQpW10gPSBbXSwgaWQ6IHN0cmluZyk6IFRbXSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoY2hpbGQuaWROYW1lID09PSBpZCkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5SWQoY2hpbGQsIGxpc3QsIGlkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBsaXN0IGFzIFRbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkPFQgZXh0ZW5kcyBFbGVtZW50Pih0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKTogVCB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lPFQgZXh0ZW5kcyBFbGVtZW50Pih0cmVlOiBFbGVtZW50LCBsaXN0OiAoRWxlbWVudCB8IFQpW10gPSBbXSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBUW10ge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3QgYXMgVFtdO1xufVxuXG4vKipcbiAqIOWwhuW9k+WJjeiKgueCuee9ruiEj++8jExheW91dCDnmoQgdGlja2VyIOS8muagueaNrui/meS4quagh+iusOS9jeaJp+ihjCByZWZsb3dcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldERpcnR5KGVsZTogRWxlbWVudCwgcmVhc29uPzogc3RyaW5nKSB7XG4gIC8vIGZvciBkZWJ1Z1xuICAvLyBjb25zb2xlLmxvZygnW0xheW91dF0gdHJpZ2dlciByZWZsb3cgY2F1c2UnLCBlbGUsIHJlYXNvbik7XG4gIGVsZS5pc0RpcnR5ID0gdHJ1ZTtcbiAgbGV0IHsgcGFyZW50IH0gPSBlbGU7XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuaXNEaXJ0eSA9IHRydWU7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxufVxuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyKCk7XG5cbmxldCB1dWlkID0gMDtcblxuY29uc3QgdG9FdmVudE5hbWUgPSAoZXZlbnQ6IHN0cmluZywgaWQ6IG51bWJlcikgPT4ge1xuICBjb25zdCBlbGVtZW50RXZlbnQgPSBbXG4gICAgJ2NsaWNrJyxcbiAgICAndG91Y2hzdGFydCcsXG4gICAgJ3RvdWNobW92ZScsXG4gICAgJ3RvdWNoZW5kJyxcbiAgICAndG91Y2hjYW5jZWwnLFxuICBdO1xuXG4gIGlmIChlbGVtZW50RXZlbnQuaW5kZXhPZihldmVudCkgIT09IC0xKSB7XG4gICAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbiAgfVxuXG4gIHJldHVybiBgZWxlbWVudC0ke2lkfS0ke2V2ZW50fWA7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIElMYXlvdXRCb3gge1xuICBsZWZ0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgYWJzb2x1dGVYOiBudW1iZXI7XG4gIGFic29sdXRlWTogbnVtYmVyO1xuICBvcmlnaW5hbEFic29sdXRlWDogbnVtYmVyO1xuICBvcmlnaW5hbEFic29sdXRlWTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElMYXlvdXQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIGxlZnQ6IG51bWJlcjtcbiAgcmlnaHQ6IG51bWJlcjtcbiAgYm90dG9tOiBudW1iZXI7XG59O1xuXG5leHBvcnQgZW51bSBTdHlsZU9wVHlwZSB7XG4gIFNldCxcbiAgRGVsZXRlLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG5cbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwcml2YXRlIG9yaWdpblN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGNsYXNzIOWxnuaAp++8jOS4gOiIrOeUqOS6juaooeadv+aPkuS7tlxuICAgKi9cbiAgcHJpdmF0ZSBpbm5lckNsYXNzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDmnInkupsgc3R5bGUg5bGe5oCn5bm25LiN6IO955u05o6l55So5p2l5riy5p+T77yM6ZyA6KaB57uP6L+H6Kej5p6Q5LmL5ZCO5omN6IO96L+b6KGM5riy5p+T77yM6L+Z5Lqb5YC85LiN5Lya5a2Y5YKo5ZyoIHN0eWxlIOS4ilxuICAgKiDmr5TlpoIgc3R5bGUudHJhbnNmb3Jt77yM5aaC5p6c5q+P5qyh6YO96Kej5p6Q5oCn6IO95aSq5beu5LqGXG4gICAqL1xuICBwcm90ZWN0ZWQgcmVuZGVyRm9yTGF5b3V0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHN0eWxlT3BUeXBlOiBTdHlsZU9wVHlwZSwgdmFsPzogYW55KSB7XG5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGlkID0gdXVpZCArPSAxLFxuICAgIGRhdGFzZXQgPSB7fSxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaWROYW1lID0gaWROYW1lO1xuICAgIHRoaXMuaW5uZXJDbGFzc05hbWUgPSBjbGFzc05hbWVcbiAgICB0aGlzLmxheW91dEJveCA9IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGFic29sdXRlWDogMCxcbiAgICAgIGFic29sdXRlWTogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVYOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVk6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG4gICAgXG4gICAgcmVuZGVyQWZmZWN0U3R5bGVzLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgbGV0IHZhbCA9IHN0eWxlW3Byb3AgYXMga2V5b2YgSVN0eWxlXTtcbiAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aGlzLmNhbGN1bGF0ZVJlbmRlckZvckxheW91dCh0cnVlLCBwcm9wLCBTdHlsZU9wVHlwZS5TZXQsIHZhbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLm9yaWdpblN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMucmVjdCA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGdldCBjbGFzc05hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJDbGFzc05hbWU7XG4gIH1cblxuICBzZXQgY2xhc3NOYW1lKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlubmVyQ2xhc3NOYW1lID0gdmFsdWVcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSB0aGlzLmlubmVyQ2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmlubmVyQ2xhc3NOYW1lLCB0aGlzLmNsYXNzTmFtZUxpc3QpXG5cbiAgICBjb25zdCBvbGRTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3R5bGUpO1xuICAgIC8vIOagueaNriBjbGFzc05hbWUg5LuO5qC35byP6KGo5Lit566X5Ye65b2T5YmN5bqU6K+l5L2c55So55qE5qC35byPXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IG5ld1N0eWxlOiBJU3R5bGUgPSB0aGlzLmNsYXNzTmFtZUxpc3QucmVkdWNlKChyZXMsIG9uZUNsYXNzKSA9PiBPYmplY3QuYXNzaWduKHJlcywgdGhpcy5yb290LnN0eWxlU2hlZXQhW29uZUNsYXNzXSksIHt9KTtcbiAgICBcbiAgICBjb25zb2xlLmxvZygnbmV3U3R5bGUnLCBuZXdTdHlsZSlcblxuICAgIGxldCBwYXJlbnRTdHlsZTogSVN0eWxlXG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IHRoaXMucGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IGVudi5nZXRSb290Q2FudmFzU2l6ZSgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmV3U3R5bGUub3BhY2l0eSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5ld1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKG5ld1N0eWxlKS5jb25jYXQoT2JqZWN0LmtleXMob2xkU3R5bGUpKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIC8vIOaJi+WKqOmAmui/h3RoaXMuc3R5bGXorr7nva7ov4fnmoTmoLflvI/orqTkuLrmmK/lhoXogZTmoLflvI/vvIzkvJjlhYjnuqfmnIDpq5jvvIzkuZ/lsLHmmK8gY2xhc3NOYW1lIOeahOWxnuaAp+S4jeW9seWTjVxuICAgICAgaWYgKCFSZWZsZWN0Lmhhcyh0aGlzLmlubmVyU3R5bGUsIGtleSkpIHtcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKG5ld1N0eWxlLCBrZXkpKSB7XG5cbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgbGV0IG5ld1ZhbHVlID0gbmV3U3R5bGVba2V5XVxuICAgICAgICAgIGlmIChrZXkgPT09ICd3aWR0aCcpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gcGFyZW50U3R5bGUud2lkdGggPyBjb252ZXJ0UGVyY2VudChuZXdWYWx1ZSwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoa2V5ID09PSAnaGVpZ2h0Jykge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBwYXJlbnRTdHlsZS5oZWlnaHQgPyBjb252ZXJ0UGVyY2VudChuZXdWYWx1ZSwgcGFyZW50U3R5bGUuaGVpZ2h0KSA6IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGtleSA9PT0gJ29wYWNpdHknICYmIHBhcmVudFN0eWxlICYmIHBhcmVudFN0eWxlLm9wYWNpdHkgIT09IDEgJiYgdHlwZW9mIHBhcmVudFN0eWxlLm9wYWNpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHBhcmVudFN0eWxlLm9wYWNpdHkgKiBuZXdWYWx1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgLy8g5qC55o2uIGNsYXNzTmFtZSDorqHnrpflh7rnmoTmoLflvI/opobnm5blvZPliY3moLflvI9cbiAgICAgICAgICB0aGlzLnN0eWxlW2tleV0gPSBuZXdWYWx1ZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIOS4jeWcqOWGheiBlOagt+W8j++8jOagueaNriBjbGFzc05hbWUg6K6h566X5Ye655qE5qC35byP5Y+I5rKh5pyJ77yM6K6k5Li66L+Z5Lqb5qC35byP6YO95bqU6K+l5Yig6Zmk5LqGXG4gICAgICAgICAgY29uc29sZS5sb2coJ2RlbCBrZXknLCBrZXkpXG4gICAgICAgICAgZGVsZXRlIHRoaXMuc3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjb25zb2xlLmxvZygnY3VycmVudCBzdHlsZScsIHRoaXMuc3R5bGUpXG4gIH1cblxuICBwcml2YXRlIGNhbGN1bGF0ZVJlbmRlckZvckxheW91dChpbml0OiBib29sZWFuLCBwcm9wOiBzdHJpbmcsIHN0eWxlT3BUeXBlOiBTdHlsZU9wVHlwZSwgdmFsPzogYW55KSB7XG4gICAgaWYgKCFpbml0KSB7XG4gICAgICB0aGlzLnN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wLCBzdHlsZU9wVHlwZSwgdmFsKTtcbiAgICB9XG4gIFxuICAgIGlmIChzdHlsZU9wVHlwZSA9PT0gU3R5bGVPcFR5cGUuU2V0KSB7XG4gICAgICBzd2l0Y2ggKHByb3ApIHtcbiAgICAgICAgY2FzZSAnYmFja2dyb3VuZEltYWdlJzpcbiAgICAgICAgICBjb25zdCB1cmwgPSBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIodmFsKTtcblxuICAgICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodXJsLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0LmJhY2tncm91bmRJbWFnZSA9IGltZztcbiAgICAgICAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSAndHJhbnNmb3JtJzpcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZTtcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMucmVuZGVyRm9yTGF5b3V0LCBwYXJzZVRyYW5zZm9ybSh2YWwpKTtcbiAgICAgICAgICBicmVhazsgXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICBjYXNlICdiYWNrZ3JvdW5kSW1hZ2UnOlxuICAgICAgICAgIHRoaXMucmVuZGVyRm9yTGF5b3V0LmJhY2tncm91bmRJbWFnZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgJ3RyYW5zZm9ybSc6XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWDtcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g5Yid5aeL5YyW55qE6YC76L6R5LiN6ZyA6KaB5YGa6L+Z5Lqb5Yik5patXG4gICAgaWYgKCFpbml0KSB7XG4gICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgIC8vIHNldERpcnR5KHRoaXMsIGBjaGFuZ2UgcHJvcCAke3Byb3B9IGZyb20gJHtvbGRWYWx9IHRvICR7dmFsfWApO1xuICAgICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgIH0gIFxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5uZXJTdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiA9IHt9XG5cbiAgb2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiBQcm94eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgZWxlID0gdGhpcztcbiAgICAgIGNvbnN0IGlubmVyU3R5bGUgPSB0aGlzLmlubmVyU3R5bGVcbiAgICAgIFxuICAgICAgdGhpcy5zdHlsZSA9IG5ldyBQcm94eSh0aGlzLm9yaWdpblN0eWxlLCB7XG4gICAgICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgLy8g5Yik5pat5Yid5aeL5YyW55qEY2xhc3NOYW1l5piv5ZCm5YyF5ZCr6K+l5bGe5oCnXG4gICAgICAgICAgY29uc3QgaXNTZXRGb3JJbm5lclN0eWxlID0gIVJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcClcbiAgICAgICAgICBsZXQgb2xkVmFsID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSAnc3RyaW5nJyAmJiBvbGRWYWwgIT09IHZhbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NldCcsIHByb3AsIG9sZFZhbCwgdmFsKVxuXG4gICAgICAgICAgICBlbGUuY2FsY3VsYXRlUmVuZGVyRm9yTGF5b3V0KGZhbHNlLCBwcm9wLCBTdHlsZU9wVHlwZS5TZXQsIHZhbCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzU2V0Rm9ySW5uZXJTdHlsZSkge1xuICAgICAgICAgICAgLy8g5bCG56eB5pyJ5bGe5oCn5ZCM5q2l5LiA5Lu95YiwIGlubmVyU3R5bGVcbiAgICAgICAgICAgIFJlZmxlY3Quc2V0KGlubmVyU3R5bGUsIHByb3AsIHZhbCkgICAgICAgICAgICBcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wOiBzdHJpbmcpIHtcbiAgICAgICAgICBlbGUuY2FsY3VsYXRlUmVuZGVyRm9yTGF5b3V0KGZhbHNlLCBwcm9wIGFzIHN0cmluZywgU3R5bGVPcFR5cGUuRGVsZXRlKTtcblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuovku7blhpLms6HpgLvovpFcbiAgICBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoY2FuY2VsJywgJ3RvdWNoZW5kJywgJ2NsaWNrJ10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGUsIHRvdWNoTXNnKSA9PiB7XG4gICAgICAgIC8vIOWkhOeQhuS8quexu+mAu+i+kVxuICAgICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcpIHtcbiAgICAgICAgICB0aGlzLmFjdGl2ZUhhbmRsZXIoZSk7XG4gICAgICAgICAgaWYgKHRoaXMgIT09IHRoaXMucm9vdCkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGhpcy5yb290LmFjdGl2ZUVsZW1lbnRzLnB1c2godGhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJyB8fCBldmVudE5hbWUgPT09ICd0b3VjaGNhbmNlbCcpIHtcbiAgICAgICAgICB0aGlzLmRlYWN0aXZlSGFuZGxlcihlKTtcblxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnJvb3QuYWN0aXZlRWxlbWVudHMuaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgdGhpcy5yb290LmFjdGl2ZUVsZW1lbnRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmVtaXQoZXZlbnROYW1lLCBlLCB0b3VjaE1zZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IHRoaXMuaW5uZXJDbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBjYWNoZVN0eWxlITogSVN0eWxlO1xuXG4gIGFjdGl2ZUhhbmRsZXIoZT86IGFueSkge1xuICAgIGNvbnN0IGFjdGl2ZVN0eWxlID0gdGhpcy5zdHlsZVsnOmFjdGl2ZSddO1xuXG4gICAgaWYgKGFjdGl2ZVN0eWxlKSB7XG4gICAgICAvLyDlsIblvZPliY3nmoRzdHlsZee8k+WtmOi1t+adpe+8jOWcqCBhY3RpdmUg5Y+W5raI55qE5pe25YCZ6YeN572u5Zue5Y67XG4gICAgICB0aGlzLmNhY2hlU3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0eWxlKTtcbiAgICAgIFxuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBhY3RpdmVTdHlsZSk7XG4gICAgfVxuICB9XG4gIFxuICBkZWFjdGl2ZUhhbmRsZXIoZT86IGFueSkge1xuICAgIGNvbnN0IGFjdGl2ZVN0eWxlID0gdGhpcy5zdHlsZVsnOmFjdGl2ZSddO1xuXG4gICAgaWYgKGFjdGl2ZVN0eWxlKSB7XG4gICAgICBPYmplY3Qua2V5cyhhY3RpdmVTdHlsZSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5jYWNoZVN0eWxlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNhY2hlU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpcy5zdHlsZVtrZXldID0gdGhpcy5jYWNoZVN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIHRoaXMuc3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnph43nu5jmjqXlj6PvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlcGFpbnQoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55riy5p+T5o6l5Y+j5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZW5kZXIoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55p6E6YCg5Ye95pWw5Yid5aeL5YyW5ZCO6LCD55So55qE5pa55rOV77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICBhZnRlckNyZWF0ZSgpIHt9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQ8VCBleHRlbmRzIEVsZW1lbnQ+KGlkOiBzdHJpbmcpOiBUIHwgbnVsbCB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRCeUlkPFQ+KHRoaXMsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxpZE5hbWUg5Li657uZ5a6a5Y+C5pWw55qE55qE6IqC54K5XG4gICAqIOiKgueCueeahCBpZCDllK/kuIDmgKcgTGF5b3V0IOW5tuS4jeS/neivge+8jOi/memHjOi/lOWbnuespuWQiOadoeS7tueahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUlkPFQgZXh0ZW5kcyBFbGVtZW50PihpZDogc3RyaW5nKTogKFQgfCBudWxsKVtdIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudHNCeUlkPFQ+KHRoaXMsIFtdLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMY2xhc3NOYW1lIOWMheWQq+e7meWumuWPguaVsOeahOeahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZTxUIGV4dGVuZHMgRWxlbWVudD4oY2xhc3NOYW1lOiBzdHJpbmcpOiAoVCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lPFQ+KHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy51bkJpbmRFdmVudCgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZWApO1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoaXMgZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkJyk7XG4gICAgfVxuICB9XG5cbiAgc2V0RGlydHkoKSB7XG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG5cbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95KCkge1xuICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcblxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIC8vIHRoaXMuRUUgPSBudWxsO1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLmN0eCA9IG51bGw7XG5cbiAgICAvLyBlbGVtZW50IOWcqOeUu+W4g+S4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgIC8vIHRoaXMubGF5b3V0Qm94ID0gbnVsbDtcbiAgICAvLyB0aGlzLnN0eWxlID0gbnVsbDtcbiAgICB0aGlzLmlubmVyQ2xhc3NOYW1lID0gJyc7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGFkZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuS4gOS4quiKgueCuea3u+WKoOS9nOS4uuW9k+WJjeiKgueCueeahOWtkOiKgueCuVxuICAgKi9cbiAgYXBwZW5kQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuXG4gICAgc2V0RGlydHkodGhpcywgYGFwcGVuZENoaWxkICR7ZWxlbWVudH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnp7vpmaTnu5nlrprnmoTlrZDoioLngrnvvIzlj6rmnInkuIDnuqfoioLngrnog73lpJ/np7vpmaRcbiAgICovXG4gIHJlbW92ZUNoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZUNoaWxkICR7ZWxlbWVudH1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqIOeUseS6juaUr+aMgeS6hnJvdGF0ZeeJueaAp++8jOaJgOS7peaJgOacieeahOa4suafk+mDvemcgOimgeaWueWQkeWHj+WOu3RyYW5zZm9ybeeahOS4remXtOeCuVxuICAgKi9cbiAgcmVuZGVyQm9yZGVyKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvcmlnaW5YOiBudW1iZXIgPSAwLCBvcmlnaW5ZOiBudW1iZXIgPSAwKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IHJhZGl1cyA9IHN0eWxlLmJvcmRlclJhZGl1cyB8fCAwO1xuICAgIGNvbnN0IHsgYm9yZGVyV2lkdGggPSAwIH0gPSBzdHlsZTtcbiAgICBjb25zdCB0bHIgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCB0cnIgPSBzdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYmJyID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYnJyID0gc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgYm9yZGVyQ29sb3IgPSAnJyB9ID0gc3R5bGU7XG4gICAgY29uc3QgeCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgeSA9IGJveC5hYnNvbHV0ZVk7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG5cbiAgICBjb25zdCBoYXNSYWRpdXMgPSByYWRpdXMgfHwgdGxyIHx8IHRyciB8fCBiYnIgfHwgYnJyO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gdHJyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIHRyciAtIG9yaWdpblksIHRycik7XG4gICAgLy8g5Y+z5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gYnJyIC0gb3JpZ2luWSk7XG4gICAgLy8g5Y+z5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCB4ICsgd2lkdGggLSBicnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgYnJyKTtcbiAgICAvLyDlt6bkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyBiYnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSk7XG4gICAgLy8g5bem5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgeCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBiYnIgLSBvcmlnaW5ZLCBiYnIpO1xuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCAtIG9yaWdpblgsIHkgKyB0bHIgLSBvcmlnaW5ZKTtcbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHRscik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cblxuICAvKipcbiAgICog5q+P5Liq5a2Q57G76YO95Lya5pyJ6Ieq5bex55qE5riy5p+T6YC76L6R77yM5L2G5LuW5Lus6YO95pyJ5Lqb6YCa55So55qE5aSE55CG77yM5q+U5aaC6YCP5piO5bqm44CB5peL6L2s5ZKMYm9yZGVy55qE5aSE55CG77yMYmFzZVJlbmRlciDnlKjkuo7lpITnkIbpgJrnlKjnmoTmuLLmn5PpgLvovpFcbiAgICovXG4gIGJhc2VSZW5kZXIodHlwZT86IHN0cmluZykge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcblxuICAgIGNvbnN0IHsgYWJzb2x1dGVYOiBkcmF3WCwgYWJzb2x1dGVZOiBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgaWYgKHN0eWxlLm9wYWNpdHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gc3R5bGUub3BhY2l0eSBhcyBudW1iZXI7XG4gICAgfVxuXG4gICAgbGV0IG9yaWdpblggPSAwO1xuICAgIGxldCBvcmlnaW5ZID0gMDtcbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG9yaWdpblggPSBkcmF3WCArIGJveC53aWR0aCAvIDI7XG4gICAgICBvcmlnaW5ZID0gZHJhd1kgKyBib3guaGVpZ2h0IC8gMjtcblxuICAgICAgY3R4LnRyYW5zbGF0ZShvcmlnaW5YLCBvcmlnaW5ZKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog6K+35rOo5oSP77yM6L+Z6YeM5pqC5pe25LuF5pSv5oyB5rKh5pyJ5a2Q6IqC54K555qE5YWD57Sg5Y+R55Sf5peL6L2s77yM5aaC5p6c54i26IqC54K55peL6L2s5LqG5a2Q6IqC54K55bm25LiN5Lya6Lef552A5peL6L2sXG4gICAgICog6KaB5a6e546w54i26IqC54K55bim5Yqo5a2Q6IqC54K55peL6L2s55qE6IO95Yqb77yM6ZyA6KaB5byV5YWl55+p6Zi15bqT77yM5a+55Luj56CB5pS55Yqo5Lmf5q+U6L6D5aSn77yM5pqC5pe25LiN5YGa5pS56YCg44CCXG4gICAgICovXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjdHgucm90YXRlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjdHguc2NhbGUodGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggOiAxICwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgOiAxKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgLy8gZm9yIGNsaXBcbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgsIG9yaWdpblgsIG9yaWdpblkpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLnJlbmRlckZvckxheW91dC5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJSW1hZ2VPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc3JjPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZSBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGltZ3NyYzogc3RyaW5nO1xuICBwdWJsaWMgdHlwZSA9ICdJbWFnZSc7XG4gIHB1YmxpYyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElJbWFnZU9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHNyYyA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1nc3JjID0gc3JjO1xuXG4gICAgdGhpcy5pbWcgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNyYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgfVxuXG4gIHNldCBzcmMobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5pbWdzcmMpIHtcbiAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5pbWcgPSBudWxsO1xuXG4gICAgdGhpcy5zcmMgPSAnJztcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5pbWcgfHwgIXRoaXMuaW1nPy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOe7k+adn1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICB0aGlzLnJlbmRlckJvcmRlcihjdHgsIG9yaWdpblgsIG9yaWdpblkpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgSW1hZ2UgZnJvbSAnLi9pbWFnZSc7XG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuaW1wb3J0IFNjcm9sbFZpZXcgZnJvbSAnLi9zY3JvbGx2aWV3JztcbmltcG9ydCBCaXRNYXBUZXh0IGZyb20gJy4vYml0bWFwdGV4dCc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5cbmV4cG9ydCB7XG4gIEVsZW1lbnQsXG4gIFZpZXcsXG4gIEltYWdlLFxuICBUZXh0LFxuICBTY3JvbGxWaWV3LFxuICBCaXRNYXBUZXh0LFxuICBDYW52YXMsXG4gIEJ1dHRvbixcbn07XG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcblxuZXhwb3J0IGVudW0gU2Nyb2xsQmFyRGlyZWN0aW9uIHtcbiAgVmVydGl2YWwsXG4gIEhvcml6b250YWwsXG59XG5cbmludGVyZmFjZSBJRGltZW5zaW9ucyB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBjb250ZW50V2lkdGg6IG51bWJlcjtcbiAgY29udGVudEhlaWdodDogbnVtYmVyO1xuXG4gIG1heFNjcm9sbExlZnQ6IG51bWJlcjtcbiAgbWF4U2Nyb2xsVG9wOiBudW1iZXI7XG5cbiAgc2Nyb2xsTGVmdDogbnVtYmVyO1xuICBzY3JvbGxUb3A6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElTY3JvbGxCYXJPcHRpb25zIHtcbiAgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xufVxuXG4vKipcbiAqIOagueaNrua7muWKqOadoeeahOWwuuWvuOOAgVNjcm9sbFZpZXcg6KeG5Y+j5ZKM5rua5Yqo56qX5Y+j5bC65a+444CB5rua5Yqo6Ziy57q/5L+h5oGv56Gu6K6k5rua5Yqo5p2h55qE5qC35byP5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbDtcbiAgY29uc3QgeyB3aWR0aDogc2Nyb2xsV2lkdGgsIGhlaWdodDogc2Nyb2xsSGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQgfSA9IGRpbWVuc2lvbnM7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogaXNWZXJ0aWNhbCA/IHdpZHRoIDogc2Nyb2xsV2lkdGggKiAoc2Nyb2xsV2lkdGggLyBjb250ZW50V2lkdGgpLFxuICAgIGhlaWdodDogaXNWZXJ0aWNhbCA/IHNjcm9sbEhlaWdodCAqIChzY3JvbGxIZWlnaHQgLyBjb250ZW50SGVpZ2h0KSA6IHdpZHRoLFxuICAgIGxlZnQ6IGlzVmVydGljYWwgPyBzY3JvbGxXaWR0aCAtIHdpZHRoIDogMCxcbiAgICB0b3A6IGlzVmVydGljYWwgPyAwIDogc2Nyb2xsSGVpZ2h0IC0gd2lkdGgsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoZWNrTmVlZEhpZGVTY3JvbGxCYXIoZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIHJldHVybiAhIShkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCAmJiBkaW1lbnNpb25zLm1heFNjcm9sbFRvcCA9PT0gMFxuICAgIHx8IGRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxMZWZ0ID09PSAwKTtcbn1cblxuLyoqXG4gKiDmu5rliqjnu4Tku7bnmoTmu5rliqjmnaHnu4Tku7bvvIzmu5rliqjmnaHmnKzouqvkuZ/mmK9MYXlvdXTnmoTkuIDkuKroioLngrlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsQmFyIGV4dGVuZHMgVmlldyB7XG4gIC8vIOW9k+WJjea7muWKqOadoeaYr+WxnuS6juaoquWQkei/mOaYr+e6teWQkVxuICBwdWJsaWMgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG5cbiAgcHVibGljIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuS4gOauteaXtumXtOWQjuiHquWKqOmakOiXj1xuICBwdWJsaWMgYXV0b0hpZGUgPSB0cnVlO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuiHquWKqOmakOiXj+aXtumXtFxuICBwdWJsaWMgYXV0b0hpZGVUaW1lID0gMjAwMDtcblxuICBwdWJsaWMgYXV0b0hpZGVEZWxheVRpbWUgPSAxNTAwO1xuXG4gIHByaXZhdGUgYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gMDtcblxuICBwcml2YXRlIGlubmVyV2lkdGggPSAxMDtcblxuICBwcml2YXRlIGlzSGlkZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY3VyckxlZnQgPSAwO1xuICBwcml2YXRlIGN1cnJUb3AgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBkaXJlY3Rpb24sXG4gICAgZGltZW5zaW9ucyxcbiAgICBiYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgxNjIsIDE2MiwgMTYyLCAwLjcpJyxcbiAgICB3aWR0aCA9IDEwLFxuICB9OiBJU2Nyb2xsQmFyT3B0aW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGJvcmRlclJhZGl1czogd2lkdGggLyAyLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICB9LCB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHdpZHRoLCBkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKTtcblxuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcbiAgICB0aGlzLmlubmVyV2lkdGggPSB3aWR0aDtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKGRpcmVjdGlvbiwgZGltZW5zaW9ucykpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCB3aWR0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lcldpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIOa7muWKqOadoeeahOeyl+e7hu+8jOWboOS4uuimgeWFvOWuueaoquerlua7muWKqO+8jOaJgOS7pSBzdHlsZS53aWR0aCDlnKjkuI3lkIzmqKHlvI/kuIvku6PooajnmoTmhI/mgJ3kuI3kuIDmoLdcbiAgICog5Zug5q2k6YCa6L+H5Y2V54us55qEIHdpZHRoIOWxnuaAp+adpeS7o+ihqOa7muWKqOadoeeahOeyl+e7hlxuICAgKi9cbiAgc2V0IHdpZHRoKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuaW5uZXJXaWR0aCkge1xuICAgICAgdGhpcy5pbm5lcldpZHRoID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHlsZS5ib3JkZXJSYWRpdXMgPSB0aGlzLmlubmVyV2lkdGggLyAyO1xuICAgIHRoaXMuc2V0RGltZW5zaW9ucyh0aGlzLmRpbWVuc2lvbnMpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XTogcGxlYXNlIHNldCByb290IGZvciBzY3JvbGxiYXInKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5yb290LnRpY2tlci5hZGQodGhpcy51cGRhdGUsIHRydWUpO1xuXG4gICAgICB0aGlzLnJvb3Qub24oJ2JlZm9yZV9yZWZsb3cnLCAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVfcmVmbG93JylcbiAgICAgICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfSA9IHRoaXMuY2FsY3VsdGVTY3JvbGxWYWx1ZSh0aGlzLmN1cnJMZWZ0LCB0aGlzLmN1cnJUb3ApO1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMsIHNjcm9sbExlZnQsIHNjcm9sbFRvcClcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgICAgICB0aGlzLnN0eWxlLnRvcCA9IHNjcm9sbFRvcDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnN0eWxlLmxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuaXNIaWRlID0gdHJ1ZTtcbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAwO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICB0aGlzLmlzSGlkZSA9IGZhbHNlO1xuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gIH1cblxuICAvKipcbiAgICog5qC55o2uIFNjcm9sbFZpZXcg5a655Zmo5a696auY5ZKM5a6e6ZmF5YaF5a655a696auY5Yaz5a6a5rua5Yqo5p2h55qE5L2N572u5ZKM5bC65a+45L+h5oGvXG4gICAqIOS9huaguOW/g+mcgOimgeiAg+iZkeeahOaDheWGteaYr++8mlxuICAgKiAxLiDlnKjkuI3mlq3lnLAgcmVmbG93IOi/h+eoi+S4re+8jFNjcm9sbEJhciDkuZ/kvJrlrZjlnKjpnIDopoHliIfmjaLlsZXnpLrlkozpmpDol4/nmoTmg4XlhrVcbiAgICogMi4gcmVmbG93IOS5i+WQju+8jFNjcm9sbEJhciDnmoTkvY3nva7kuI3mmK/nroDljZXnmoTorr7nva7kuLogU2Nyb2xsVmlldyDpobbpg6jlkozlt6bovrnvvIzov5jlj6/og73mmK/mu5rliqjkuobkuIDmrrXot53nprvlkI7miafooYznmoQgcmVmbG93XG4gICAqL1xuICBzZXREaW1lbnNpb25zKGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHRoaXMud2lkdGgsIHRoaXMuZGlyZWN0aW9uLCBkaW1lbnNpb25zKTtcblxuICAgIE9iamVjdC5hc3NpZ24odGhpcy5zdHlsZSwgc3R5bGUpO1xuXG4gICAgaWYgKGNoZWNrTmVlZEhpZGVTY3JvbGxCYXIodGhpcy5kaXJlY3Rpb24sIGRpbWVuc2lvbnMpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNIaWRlKSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9XG5cbiAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuXG4gICAgLy8g5bey57uP5rua5Yqo6L+H5LiA5q616Led56a755qE5oOF5Ya177yM6YeN5paw6K6h566X5paw55qE5rua5Yqo5L2N572uXG4gICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfSA9IHRoaXMuY2FsY3VsdGVTY3JvbGxWYWx1ZShkaW1lbnNpb25zLnNjcm9sbExlZnQsIGRpbWVuc2lvbnMuc2Nyb2xsVG9wKTtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICB0aGlzLnN0eWxlLnRvcCA9IHNjcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IHRoaXMuYXV0b0hpZGVUaW1lICsgdGhpcy5hdXRvSGlkZURlbGF5VGltZTtcbiAgfVxuXG4gIGNhbGN1bHRlU2Nyb2xsVmFsdWUobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIGxldCBzY3JvbGxMZWZ0ID0gMDtcbiAgICBsZXQgc2Nyb2xsVG9wID0gMDtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgY29uc3QgY2FuU2Nyb2xsUGVyY2VudCA9IDEgLSB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0IC8gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRIZWlnaHQ7XG5cbiAgICAgIC8vIOa7muWKqOadoeacgOWkp+a7muWKqOmrmOW6plxuICAgICAgY29uc3Qgc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wID0gdGhpcy5kaW1lbnNpb25zLmhlaWdodCAqIGNhblNjcm9sbFBlcmNlbnQ7XG5cbiAgICAgIGNvbnN0IHBlcmNlbnQgPSB0b3AgLyB0aGlzLmRpbWVuc2lvbnMubWF4U2Nyb2xsVG9wO1xuICAgICAgY29uc3QgcGVyY2VudFRvcCA9IHNjcm9sbEJhck1heFNjcm9sbFRvcCAqIHBlcmNlbnQ7XG5cbiAgICAgIHNjcm9sbFRvcCA9IGNsYW1wKHBlcmNlbnRUb3AsIDAsIHNjcm9sbEJhck1heFNjcm9sbFRvcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNhblNjcm9sbFBlcmNlbnQgPSAxIC0gdGhpcy5kaW1lbnNpb25zLndpZHRoIC8gdGhpcy5kaW1lbnNpb25zLmNvbnRlbnRXaWR0aDtcbiAgICAgIGNvbnN0IHNjcm9sbEJhck1heFNjcm9sbExlZnQgPSB0aGlzLmRpbWVuc2lvbnMud2lkdGggKiBjYW5TY3JvbGxQZXJjZW50O1xuXG4gICAgICBjb25zdCBwZXJjZW50ID0gbGVmdCAvIHRoaXMuZGltZW5zaW9ucy5tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICBzY3JvbGxMZWZ0ID0gY2xhbXAoc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCAqIHBlcmNlbnQsIDAsIHNjcm9sbEJhck1heFNjcm9sbExlZnQpO1xuICAgIH1cblxuICAgIHJldHVybiB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9O1xuICB9XG5cbiAgb25TY3JvbGwobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmlzSGlkZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY3VyckxlZnQgPSBsZWZ0O1xuICAgIHRoaXMuY3VyclRvcCA9IHRvcDtcbiAgXG4gICAgY29uc3QgeyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfSA9IHRoaXMuY2FsY3VsdGVTY3JvbGxWYWx1ZShsZWZ0LCB0b3ApO1xuXG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSA9IHRoaXMucGFyZW50IS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgKyBzY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCA9IHRoaXMucGFyZW50IS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggKyBzY3JvbGxMZWZ0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmF1dG9IaWRlKSB7XG4gICAgICAvLyB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IHRoaXMuYXV0b0hpZGVUaW1lO1xuICAgICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZSArIHRoaXMuYXV0b0hpZGVEZWxheVRpbWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnJvb3QudGlja2VyLnJlbW92ZSh0aGlzLnVwZGF0ZSwgdHJ1ZSk7XG5cbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgdXBkYXRlID0gKGR0OiBudW1iZXIpID0+IHtcbiAgICBpZiAoIXRoaXMuYXV0b0hpZGUgfHwgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPD0gMCB8fCB0aGlzLmlzSGlkZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC09IGR0O1xuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IHRoaXMuYXV0b0hpZGVUaW1lKSB7XG4gICAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IE1hdGgubWF4KDAsIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lKTtcbiAgICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IHRoaXMuc3R5bGUub3BhY2l0eSBhcyBudW1iZXIgKiAodGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgLyB0aGlzLmF1dG9IaWRlVGltZSk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBjb3B5VG91Y2hBcnJheSB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCBTY3JvbGxlciBmcm9tICcuLi9saWJzL3Njcm9sbGVyL2luZGV4LmpzJ1xuaW1wb3J0IHsgaXRlcmF0ZVRyZWUgfSBmcm9tICcuLi9jb21tb24vdmQnO1xuaW1wb3J0IEVsZW1lbnQsIHsgc2V0RGlydHkgfSBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IFNjcm9sbEJhciwgeyBTY3JvbGxCYXJEaXJlY3Rpb24gfSBmcm9tICcuL3Njcm9sbGJhcic7XG5pbXBvcnQgZW52IGZyb20gJy4uL2VudidcblxuY29uc3QgZHByID0gZW52LmdldERldmljZVBpeGVsUmF0aW8oKTtcblxuaW50ZXJmYWNlIElTY3JvbGxWaWV3T3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNjcm9sbFg/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBzY3JvbGxZPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbn1cblxuaW50ZXJmYWNlIElJbm5lclNjcm9sbGVyT3B0aW9uIHtcbiAgc2Nyb2xsaW5nWD86IGJvb2xlYW47XG4gIHNjcm9sbGluZ1k/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsVmlldyBleHRlbmRzIFZpZXcge1xuICBwdWJsaWMgc2Nyb2xsVG9wID0gMDtcbiAgcHVibGljIHNjcm9sbExlZnQgPSAwO1xuICBwdWJsaWMgaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIHB1YmxpYyBjdXJyZW50RXZlbnQgPSBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdTY3JvbGxWaWV3JztcblxuICBwcml2YXRlIHNjcm9sbFlQcm9wOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGlubmVyU2Nyb2xsZXJPcHRpb246IElJbm5lclNjcm9sbGVyT3B0aW9uO1xuXG4gIHByaXZhdGUgc2Nyb2xsZXJPYmo/OiBTY3JvbGxlcjtcbiAgcHJpdmF0ZSBpc0ZpcnN0U2Nyb2xsPzogYm9vbGVhbjtcblxuICBwcml2YXRlIHZlcnRpdmFsU2Nyb2xsYmFyOiBTY3JvbGxCYXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBob3Jpem9udGFsU2Nyb2xsYmFyOiBTY3JvbGxCYXIgfCBudWxsID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBzY3JvbGxYLFxuICAgIHNjcm9sbFksXG4gICAgZGF0YXNldCxcbiAgfTogSVNjcm9sbFZpZXdPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgICBpZE5hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgY2xhc3NOYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zY3JvbGxZUHJvcCA9IHNjcm9sbFk7XG5cbiAgICB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdYOiAhIXNjcm9sbFgsXG4gICAgICBzY3JvbGxpbmdZOiAhIXNjcm9sbFksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiDojrflj5bmu5rliqjliJfooajlhoXmiYDmnInlhYPntKDnmoTpq5jluqblkoxcbiAgICog6L+Z6YeM5LiN6IO9566A5Y2V5bCG5omA5pyJ5a2Q5YWD57Sg55qE6auY5bqm57Sv5Yqg77yM5Zug5Li65q+P5Liq5YWD57Sg5LmL6Ze05Y+v6IO95piv5pyJ56m66ZqZ55qEXG4gICAqL1xuICBnZXQgc2Nyb2xsSGVpZ2h0KCkge1xuICAgIGxldCBtYXhIZWlnaHQgPSAwO1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbTogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgbWF4SGVpZ2h0ID0gTWF0aC5tYXgobWF4SGVpZ2h0LCBpdGVtLmxheW91dEJveC50b3AgKyBpdGVtLmxheW91dEJveC5oZWlnaHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXhIZWlnaHQ7XG4gIH1cblxuICBnZXQgc2Nyb2xsV2lkdGgoKSB7XG4gICAgbGV0IG1heFdpZHRoID0gMDtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGl0ZW06IEVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgIG1heFdpZHRoID0gTWF0aC5tYXgobWF4V2lkdGgsIGl0ZW0ubGF5b3V0Qm94LmxlZnQgKyBpdGVtLmxheW91dEJveC53aWR0aCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF4V2lkdGg7XG4gIH1cblxuICBnZXQgc2Nyb2xsWCgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1g7XG4gIH1cblxuICBzZXQgc2Nyb2xsWCh2YWx1ZSkge1xuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNjcm9sbFRvKDAsIHRoaXMuc2Nyb2xsVG9wLCB0cnVlLCAxKTtcbiAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogdmFsdWUsXG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgfVxuXG4gIGdldCBzY3JvbGxZKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWTtcbiAgfVxuXG4gIHNldCBzY3JvbGxZKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLnNjcm9sbFkpIHtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNjcm9sbFRvKHRoaXMuc2Nyb2xsTGVmdCwgMCwgdHJ1ZSwgMSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgICBzY3JvbGxpbmdZOiB2YWx1ZSxcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmogJiYgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFknLCAndmVydGl2YWxTY3JvbGxiYXInKTtcbiAgICB9XG4gIH1cblxuICBnZXQgc2Nyb2xsZXJPcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbjtcbiAgfVxuXG4gIHNldCBzY3JvbGxlck9wdGlvbih2YWx1ZTogSUlubmVyU2Nyb2xsZXJPcHRpb24pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiwgdmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsZXJPYmopIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5zY3JvbGxlck9iai5vcHRpb25zLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMuc2Nyb2xsUmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyB0aGlzLnRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290IS5vZmYoJ3RvdWNoZW5kJyk7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlclRyZWVXaXRoVG9wKHRyZWU6IEVsZW1lbnQpIHtcbiAgICBpZiAoISh0cmVlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgdHJlZS5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIHRoaXMuY3R4IS5jbGVhclJlY3QoYm94LmFic29sdXRlWCwgYm94LmFic29sdXRlWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgfVxuXG4gIHNjcm9sbFJlbmRlcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcblxuICAgIGNvbnN0IHsgYWJzb2x1dGVYOiBzdGFydFgsIGFic29sdXRlWTogc3RhcnRZLCB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgLy8g5qC55o2u5rua5Yqo5YC86I635Y+W6KOB5Ymq5Yy65Z+fXG4gICAgY29uc3QgZW5kWCA9IHN0YXJ0WCArIHdpZHRoO1xuICAgIGNvbnN0IGVuZFkgPSBzdGFydFkgKyBoZWlnaHQ7XG5cbiAgICAvLyBTY3JvbGxWaWV3IOS9nOS4uuWuueWZqOacrOi6q+eahOa4suafk1xuICAgIHRoaXMucmVuZGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiDlvIDlp4voo4HliarvvIzlj6rmnInku5QgU2Nyb2xsVmlldyBsYXlvdXRCb3gg5Yy65Z+f5YaF55qE5YWD57Sg5omN5piv5Y+v6KeB55qEXG4gICAgICog6L+Z5qC3IFNjcm9sbFZpZXcg5LiN55So5Y2V54us5Y2g55So5LiA5LiqIGNhbnZhc++8jOWGheWtmOWQiOa4suafk+mDveS8muW+l+WIsOS8mOWMllxuICAgICAqL1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnJlY3Qoc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5jbGlwKCk7XG5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGFic29sdXRlWCwgYWJzb2x1dGVZIH0gPSBjaGlsZC5sYXlvdXRCb3g7XG5cbiAgICAgIC8vIOWIpOaWreWkhOS6juWPr+inhueql+WPo+WGheeahOWtkOiKgueCue+8jOmAkuW9kua4suafk+ivpeWtkOiKgueCuVxuICAgICAgaWYgKGFic29sdXRlWSArIGhlaWdodCA+PSBzdGFydFkgJiYgYWJzb2x1dGVZIDw9IGVuZFlcbiAgICAgICAgJiYgYWJzb2x1dGVYICsgd2lkdGggPj0gc3RhcnRYICYmIGFic29sdXRlWCA8PSBlbmRYKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8g5LiK6Z2i55qE5riy5p+T5bqU6K+l5YWI6Lez6L+H5rua5Yqo5p2h77yM5ZCm5YiZ5Y+v6IO95Ye6546w5riy5p+T6aG65bqP6Zeu6aKY77yMU2Nyb2xsVmlld+eahOiKgueCueWPjeiAjOaKiua7muWKqOadoeebluS9j+S6hlxuICAgIHRoaXMudmVydGl2YWxTY3JvbGxiYXI/LnJlbmRlcigpO1xuICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ucmVuZGVyKCk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgc2Nyb2xsSGFuZGxlcihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgLy8g5Y+v6IO96KKr6ZSA5q+B5LqG5oiW6ICF6IqC54K55qCR6L+Y5rKh5YeG5aSH5aW9XG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkICYmICF0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcyAmJiAhKGVsZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0b3A7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVggPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYIC0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOi/memHjOimgeaKiua7muWKqOeKtuaAgeS/neWtmOi1t+adpe+8jOWboOS4uuWcqHJlZmxvd+eahOaXtuWAmemcgOimgeWBmumHjee9ru+8jOa4suafk+W5tuS4jeS+nei1lui/meS4pOS4quS/oeaBr1xuICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0b3A7XG4gICAgICB0aGlzLnNjcm9sbExlZnQgPSBsZWZ0O1xuXG4gICAgICB0aGlzLnZlcnRpdmFsU2Nyb2xsYmFyPy5vblNjcm9sbChsZWZ0LCB0b3ApO1xuICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsYmFyPy5vblNjcm9sbChsZWZ0LCB0b3ApO1xuXG4gICAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudEV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsJywgdGhpcy5jdXJyZW50RXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDlvZPmiafooYxyZWZsb3fkuYvlkI7vvIzmu5rliqjliJfooajnmoTpq5jluqblj6/og73lj5HnlJ/kuoblj5jljJbvvIzmu5rliqjmnaHkuZ/pnIDopoHlkIzmraXov5vooYzmm7TmlrBcbiAgICovXG4gIHVwZGF0ZVNjcm9sbEJhcihzY3JvbGxQcm9wOiBzdHJpbmcsIHNjcm9sbEJhck5hbWU6IHN0cmluZykge1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB7XG4gICAgICB3aWR0aDogdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgIGNvbnRlbnRXaWR0aDogdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50V2lkdGgsXG4gICAgICBjb250ZW50SGVpZ2h0OiB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQsXG4gICAgICBtYXhTY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbGVyT2JqIS5fX21heFNjcm9sbExlZnQsXG4gICAgICBtYXhTY3JvbGxUb3A6IHRoaXMuc2Nyb2xsZXJPYmohLl9fbWF4U2Nyb2xsVG9wLFxuXG4gICAgICBzY3JvbGxMZWZ0OiB0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbExlZnQsXG4gICAgICBzY3JvbGxUb3A6IHRoaXMuc2Nyb2xsZXJPYmohLl9fc2Nyb2xsVG9wLFxuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCd1cGRhdGVTY3JvbGxCYXInLCBKU09OLnN0cmluZ2lmeShkaW1lbnNpb25zKSlcblxuICAgIC8vIOmdnuesrOS4gOasoeWIm+W7uueahOaDheWGte+8jOS4gOiIrOaYryByZWZsb3cg5omn6KGM5Yiw6L+Z6YeMXG4gICAgaWYgKHRoaXNbc2Nyb2xsUHJvcCBhcyBrZXlvZiBTY3JvbGxWaWV3XSkge1xuICAgICAgaWYgKHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XSkge1xuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10uc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyBTY3JvbGxCYXIoe1xuICAgICAgICAgIGRpbWVuc2lvbnMsXG4gICAgICAgICAgZGlyZWN0aW9uOiBzY3JvbGxQcm9wID09PSAnc2Nyb2xsWScgPyBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwgOiBTY3JvbGxCYXJEaXJlY3Rpb24uSG9yaXpvbnRhbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGhpcy5hcHBlbmRDaGlsZChzY3JvbGxiYXIpO1xuICAgICAgICBzY3JvbGxCYXIucm9vdCA9IHRoaXMucm9vdDtcbiAgICAgICAgc2Nyb2xsQmFyLmluaXQoKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzY3JvbGxCYXIuaW5zZXJ0KHRoaXMucm9vdC5yZW5kZXJDb250ZXh0LCB0cnVlKTtcbiAgICAgICAgc2Nyb2xsQmFyLm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG4gICAgICAgIHRoaXMuYWRkKHNjcm9sbEJhcik7XG5cbiAgICAgICAgc2V0RGlydHkoc2Nyb2xsQmFyLCAnYXBwZW5kVG9TY3JvbGxWaWV3JylcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZV0gPSBzY3JvbGxCYXI7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLnJvb3QudGlja2VyLm5leHQoKCkgPT4ge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdPy5vblNjcm9sbCh0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbExlZnQsIHRoaXMuc2Nyb2xsZXJPYmohLl9fc2NoZWR1bGVkVG9wKTtcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOW9k+S4jeWGjemcgOimgee6teWQkea7muWKqOeahOaXtuWAmemUgOavgee6teWQkea7muWKqOadoVxuICAgICAgaWYgKHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XSkge1xuICAgICAgICBjb25zdCBzY3JvbGxCYXIgPSB0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld107XG4gICAgICAgIHNjcm9sbEJhci5yZW1vdmUoKTtcbiAgICAgICAgc2Nyb2xsQmFyLmRlc3Ryb3koKTtcbiAgICAgICAgc2Nyb2xsQmFyLmRlc3Ryb3lTZWxmKCk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGluc2VydChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY29udGV4dDtcblxuICAgIC8qKlxuICAgICAqIOi/memHjOacieS4qumdnuW4uOeJueauiueahOWFvOWuuemAu+i+ke+8jOWcqOS9jueJiOacrOayoeaciemHjeaehCBTY3JvbGxWaWV35LmL5YmN77yM5bm25rKh5pyJ5o+Q5L6b5Y2V54us55qEIFNjcm9sbFgg5ZKMIFNjcm9sbFkg5bGe5oCnXG4gICAgICog6ICM5piv5Yik5patIHNjcm9sbEhlaWh0IOWkp+S6juWuueWZqOmrmOW6pueahOaXtuWAmeiHquWKqOWunueOsOS6hue6teWQkea7muWKqO+8iOS4lOayoeacieaoquWQkea7muWKqOiDveWKm++8iVxuICAgICAqIOWboOatpOi/memHjOWBmuS4gOS4quWFvOWuuemAu+i+ke+8jOWmguaenCBzY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQg6Ieq5Yqo5byA5ZCv57q15ZCR5rua5YqoXG4gICAgICovXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICYmIHR5cGVvZiB0aGlzLnNjcm9sbFlQcm9wID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS5sb2coYFtMYXlvdXRdIOiHquWKqOW8gOWQryBzY3JvbGxZYCk7XG4gICAgICB0aGlzLnNjcm9sbFkgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0V2ZW50QmluZCkge1xuICAgICAgLy8gcmVmbG93IOmrmOW6puWPr+iDveS8muWPmOWMlu+8jOWboOatpOmcgOimgeaJp+ihjCBzZXREaW1lbnNpb25zIOWIt+aWsOWPr+a7muWKqOWMuuWfn1xuICAgICAgaWYgKHRoaXMubGF5b3V0Qm94LndpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMubGF5b3V0Qm94LmhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRIZWlnaHRcbiAgICAgICAgfHwgdGhpcy5zY3JvbGxXaWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5zY3JvbGxIZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudEhlaWdodCkge1xuICAgICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zZXREaW1lbnNpb25zKFxuICAgICAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICAgICB0aGlzLnNjcm9sbFdpZHRoLFxuICAgICAgICAgIHRoaXMuc2Nyb2xsSGVpZ2h0LFxuICAgICAgICApO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDov5nph4zkuYvmiYDku6XopoHlu7bov5/kuIDluKfmmK/lm6DkuLrov5nph4znmoTlj5jliqjmnaXoh6ogcmVmbG93IOS5i+WQju+8jOato+WcqOWBmiByZWZsb3cg5LmL5ZCO55qE5ZCO57ut5LqL5oOFXG4gICAgICAgICAqIOWmguaenOeri+WNs+S/ruaUuea7muWKqOadoeeahOagt+W8j++8jOWunumZheS4iuW5tuS4jeS8mueUn+aViOOAglxuICAgICAgICAgKi9cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzLnJvb3QudGlja2VyLm5leHQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbG93IOS5i+WQju+8jOS8muS7jiBjc3NsYXlvdXQg5ZCM5q2l5biD5bGA5L+h5oGv77yM5Y6f5YWI55qE5rua5Yqo5L+h5oGv5Lya5Lii5aSx77yM6L+Z6YeM6ZyA6KaB5LiA5Liq5aSN5L2N55qE5pON5L2cXG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgIShlbGUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdGhpcy5zY3JvbGxUb3A7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVggPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYIC0gdGhpcy5zY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcbiAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSB0cnVlO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuc2Nyb2xsZXJPYmogPSBuZXcgU2Nyb2xsZXIodGhpcy5zY3JvbGxIYW5kbGVyLmJpbmQodGhpcyksIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuXG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyh0aGlzLmxheW91dEJveC53aWR0aCwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodCk7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gICAgfSwgdHJ1ZSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hNb3ZlKHRvdWNoZXMsIGUudGltZVN0YW1wLCB1bmRlZmluZWQpO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuXG4gICAgLy8g6L+Z6YeM5LiN5bqU6K+l5piv55uR5ZCsc2Nyb2xsdmlld+eahHRvdWNoZW5k5LqL5Lu26ICM5piv5bGP5bmV55qEdG91Y2hlbmTkuovku7ZcbiAgICB0aGlzLnJvb3QhLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoRW5kKGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjcm9sbFRvKGxlZnQgPSAwLCB0b3AgPSAwLCBhbmltYXRlID0gdHJ1ZSkge1xuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNjcm9sbFRvKGxlZnQsIHRvcCwgYW5pbWF0ZSwgMSk7XG4gIH1cbn1cbiIsImNvbnN0IHJlZmxvd0FmZmVjdGVkU3R5bGVzID0gW1xuICAnd2lkdGgnLCAnaGVpZ2h0JyxcbiAgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsXG4gICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJyxcbiAgJ21hcmdpbicsICdtYXJnaW5MZWZ0JywgJ21hcmdpblJpZ2h0JywgJ21hcmdpblRvcCcsICdtYXJnaW5Cb3R0b20nLFxuICAncGFkZGluZycsICdwYWRkaW5nTGVmdCcsICdwYWRkaW5nUmlnaHQnLCAncGFkZGluZ1RvcCcsICdwYWRkaW5nQm90dG9tJyxcbiAgJ2JvcmRlcldpZHRoJywgJ2JvcmRlckxlZnRXaWR0aCcsICdib3JkZXJSaWdodFdpZHRoJywgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlckJvdHRvbVdpZHRoJyxcbiAgJ2ZsZXhEaXJlY3Rpb24nLFxuICAnZmxleFNocmluaycsXG4gICdmbGV4R3JvdycsXG4gICdqdXN0aWZ5Q29udGVudCcsXG4gICdhbGlnbkl0ZW1zJywgJ2FsaWduU2VsZicsXG4gICdmbGV4JyxcbiAgJ2ZsZXhXcmFwJyxcbiAgJ3Bvc2l0aW9uJyxcbiAgJ2ZvbnRXZWlnaHQnLFxuXTtcblxuY29uc3QgcmVwYWludEFmZmVjdGVkU3R5bGVzID0gW1xuICAnZm9udFNpemUnLFxuICAnbGluZUhlaWdodCcsXG4gICd0ZXh0QWxpZ24nLFxuICAndmVydGljYWxBbGlnbicsXG4gICdjb2xvcicsXG4gICdiYWNrZ3JvdW5kQ29sb3InLFxuICAndGV4dE92ZXJmbG93JyxcbiAgJ2xldHRlclNwYWNpbmcnLFxuICAnYm9yZGVyUmFkaXVzJyxcbiAgJ2JvcmRlckNvbG9yJyxcbiAgJ29wYWNpdHknLFxuICAndHJhbnNmb3JtJyxcbiAgJ3RleHRTdHJva2VDb2xvcicsXG4gICd0ZXh0U3Ryb2tlV2lkdGgnLFxuICAndGV4dFNoYWRvdycsXG5dO1xuXG5leHBvcnQgY29uc3QgcmVuZGVyQWZmZWN0U3R5bGVzID0gW1xuICAndGV4dFNoYWRvdycsXG4gICd0cmFuc2Zvcm0nLFxuICAnYmFja2dyb3VuZEltYWdlJyxcbl1cblxuaW50ZXJmYWNlIElTdHlsZSB7XG4gIC8vIHJlZmxvd0FmZmVjdGVkU3R5bGVzXG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIG1pbldpZHRoPzogbnVtYmVyO1xuICBtaW5IZWlnaHQ/OiBudW1iZXI7XG4gIG1heFdpZHRoPzogbnVtYmVyO1xuICBtYXhIZWlnaHQ/OiBudW1iZXI7XG4gIGxlZnQ/OiBudW1iZXI7XG4gIHJpZ2h0PzogbnVtYmVyO1xuICB0b3A/OiBudW1iZXI7XG4gIGJvdHRvbT86IG51bWJlcjtcbiAgbWFyZ2luPzogbnVtYmVyO1xuICBtYXJnaW5MZWZ0PzogbnVtYmVyO1xuICBtYXJnaW5SaWdodD86IG51bWJlcjtcbiAgbWFyZ2luVG9wPzogbnVtYmVyO1xuICBtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmdMZWZ0PzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XG4gIHBhZGRpbmdCb3R0b20/OiBudW1iZXI7XG4gIGJvcmRlcldpZHRoPzogbnVtYmVyO1xuICBib3JkZXJMZWZ0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclJpZ2h0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclRvcFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21XaWR0aD86IG51bWJlcjtcblxuICBib3JkZXJUb3BMZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJUb3BSaWdodFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM/OiBudW1iZXI7XG5cbiAgZmxleERpcmVjdGlvbj86ICdjb2x1bW4nIHwgJ3Jvdyc7XG4gIGZsZXhTaHJpbms/OiBudW1iZXI7XG4gIGZsZXhHcm93PzogbnVtYmVyO1xuICBmbGV4V3JhcD86ICd3cmFwJyB8ICdub3dyYXAnO1xuICBqdXN0aWZ5Q29udGVudD86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzcGFjZS1iZXR3ZWVuJyB8ICdzcGFjZS1hcm91bmQnO1xuICBhbGlnbkl0ZW1zPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBhbGlnblNlbGY/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIHBvc2l0aW9uPzogc3RyaW5nO1xuXG4gIC8vIHJlcGFpbnRBZmZlY3RlZFN0eWxlc1xuICBmb250U2l6ZT86IG51bWJlcjtcbiAgbGluZUhlaWdodD86IG51bWJlciB8ICdzdHJpbmcnO1xuICB0ZXh0QWxpZ24/OiAnbGVmdCcgfCAnY2VudGVyJyB8ICdyaWdodCc7XG4gIHZlcnRpY2FsQWxpZ24/OiAndG9wJyB8ICdtaWRkbGUnIHwgJ2JvdHRvbSc7XG4gIGNvbG9yPzogc3RyaW5nO1xuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gIHRleHRPdmVyZmxvdz86ICdlbGxpcHNpcycgfCAnY2xpcCc7XG4gIGxldHRlclNwYWNpbmc/OiBudW1iZXI7XG4gIGJvcmRlclJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQ29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclRvcENvbG9yPzogc3RyaW5nO1xuXG4gIGJhY2tncm91bmRJbWFnZT86IHN0cmluZztcbiAgYm9yZGVyQm90dG9tQ29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlckxlZnRDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyUmlnaHRDb2xvcj86IHN0cmluZztcblxuICBvcGFjaXR5PzogbnVtYmVyO1xuICBmb250V2VpZ2h0Pzogc3RyaW5nO1xuICBmb250RmFtaWx5Pzogc3RyaW5nO1xuXG4gIHRyYW5zZm9ybT86IHN0cmluZztcblxuICAvLyDmloflrZfmj4/ovrnnmoTlrr3luqbvvIzpu5jorqTkuI3mj4/ovrlcbiAgdGV4dFN0cm9rZVdpZHRoPzogbnVtYmVyO1xuICAvLyDmloflrZfmj4/ovrnnmoTpopzoibLvvIzlpoLmnpzmjIflrprkuobmj4/ovrnpopzoibLkvYbmmK/msqHmnInmjIflrprmj4/ovrnlrr3luqbvvIzmj4/ovrnlrr3luqbpu5jorqTorr7nva7kuLoxXG4gIHRleHRTdHJva2VDb2xvcj86IHN0cmluZztcblxuICAvKipcbiAgICog5paH5a2X6Zi05b2x5pWI5p6c77yMdGV4dFNoYWRvd+eahOagvOW8j+W5tuS4jeaYr+S4peagvOeahENTU+agvOW8j++8jOS7heaUr+aMgeS4pOenjeagvOW8j1xuICAgKiB0ZXh0U2hhZG93OiAxcHggMXB4IDJweCBwaW5rXG4gICAqIHRleHRTaGFkb3c6IDFweCAxcHggMnB4IHJlZCwgMCAwIDFweCBibHVlLCAwIDAgMXB4IGJsdWUsIDFweCAxcHggMnB4IHJlZFxuICAgKiDkuZ/lsLHmmK/mlK/mjIHku7vmhI/mlbDph4/nmoTpmLTlvbHmlYjmnpzvvIzmr4/kuKrpmLTlvbHmlYjmnpznlLHlm5vkuKrlgLzmjIflrprvvIzliIbliKvmmK8gc2hhZG93T2Zmc2V0WCwgc2hhZG93T2Zmc2V0WSwgc2hhZG93Qmx1ciwgc2hhZG93Q29sb3JcbiAgICovXG4gIHRleHRTaGFkb3c/OiBzdHJpbmc7XG5cbiAgJzphY3RpdmUnPzogSVN0eWxlO1xufVxuXG5leHBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBJU3R5bGUgfTtcbiIsIlxuZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzOiBudW1iZXIpIHtcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG4vLyDog4zmma/lm77mraPliJnooajovr7lvI9cbmNvbnN0IGlzVmFsaWRVcmxQcm9wUmVnID0gL1xccyp1cmxcXCgoLio/KVxcKVxccyovO1xuXG4vLyDop6PmnpDog4zmma/lm77niYdcbmV4cG9ydCBmdW5jdGlvbiBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIodmFsOiBzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgbGlzdCA9IHZhbC5tYXRjaChpc1ZhbGlkVXJsUHJvcFJlZyk7XG5cbiAgICBpZiAobGlzdCkge1xuICAgICAgY29uc3QgdXJsID0gbGlzdFsxXS5yZXBsYWNlKC8oJ3xcIikvZywgJycpO1xuXG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3ZhbH0gaXMgbm90IGEgdmFsaWQgYmFja2dyb3VuZEltYWdlYCk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IHRleHRTaGFkb3dSZWcgPSAvXihcXGQrcHhcXHMpezJ9XFxkK3B4XFxzKD86W2EtekEtWl0rfCNbMC05YS1mQS1GXXszLDZ9KSgsXFxzKihcXGQrcHhcXHMpezJ9XFxkK3B4XFxzKD86W2EtekEtWl0rfCNbMC05YS1mQS1GXXszLDZ9KSkqJC87XG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdzogc3RyaW5nKSB7XG4gIHJldHVybiB0ZXh0U2hhZG93UmVnLnRlc3QodGV4dFNoYWRvdyk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gIC8vIOS9v+eUqOato+WImeihqOi+vuW8j+mqjOivgeaVsOWtl+aIlumAl+WPt+WIhumalOeahOaVsOWtl++8jOWQjumdouWPr+S7pei3n+WPr+mAieeahOinkuW6puWNleS9je+8iGRlZ++8iVxuICByZXR1cm4gL14oLT9cXGQrKFxcLlxcZCspPykoZGVnKT8oLFxccyooLT9cXGQrKFxcLlxcZCspPykoZGVnKT8pKiQvLnRlc3QodmFsdWUpO1xuICAvLyByZXR1cm4gL14oLT9cXGQrKFxcLlxcZCspPykoZGVnKT8oLFxccyooLT9cXGQrKFxcLlxcZCspPykoZGVnKT8pKigsXFxzKih0cnVlfGZhbHNlKSk/JC8udGVzdCh2YWx1ZSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckZvckxheW91dCB7XG4gIHJvdGF0ZT86IG51bWJlcjsgLy8gc3R5bGUudHJhbnNmb3JtIHJvdGF0Zeino+aekOS5i+WQjuW+l+WIsOeahOW8p+W6puWItlxuICBzY2FsZVg/OiBudW1iZXI7IC8vIHN0eWxlLnRyYW5zZm9ybSDop6PmnpDkuYvlkI7lvpfliLDnmoTmqKrlkJHnvKnmlL7lgLxcbiAgc2NhbGVZPzogbnVtYmVyOyAvLyBzdHlsZS50cmFuc2Zvcm0g6Kej5p6Q5LmL5ZCO5b6X5Yiw55qE57q15ZCR57yp5pS+5YC8XG4gIGJhY2tncm91bmRJbWFnZT86IEhUTUxJbWFnZUVsZW1lbnQ7IC8vIHN0eWxlLmJhY2tncm91bmRJbWFnZSDop6PmnpDlubbliqDovb3kuYvlkI7lvpfliLDnmoTlm77niYflrp7kvotcbn1cblxuaW50ZXJmYWNlIElUZXh0U2hhZG93IHtcbiAgb2Zmc2V0WDogbnVtYmVyO1xuICBvZmZzZXRZOiBudW1iZXI7XG4gIGJsdXJSYWRpdXM6IG51bWJlcjtcbiAgY29sb3I6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJVGV4dFJlbmRlckZvckxheW91dCBleHRlbmRzIElSZW5kZXJGb3JMYXlvdXQge1xuICB0ZXh0U2hhZG93cz86IG51bGwgfCBJVGV4dFNoYWRvd1tdO1xufVxuXG5jb25zdCB0cmFuc2Zvcm1SZWdleCA9IC8oXFx3KylcXCgoW14pXSspXFwpL2c7XG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2Zvcm0odHJhbnNmb3JtOiBzdHJpbmcpIHtcbiAgY29uc3QgcmVzdWx0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgbGV0IG1hdGNoO1xuXG4gIHdoaWxlICgobWF0Y2ggPSB0cmFuc2Zvcm1SZWdleC5leGVjKHRyYW5zZm9ybSkpKSB7XG4gICAgY29uc3QgWywgbmFtZSwgdmFsdWVdID0gbWF0Y2g7XG5cbiAgICBpZiAoIWlzVmFsaWRUcmFuc2Zvcm1WYWx1ZSh2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgW0xheW91dF06IGludmFsaWQgdmFsdWUgZm9yICR7bmFtZX06ICR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgdmFsdWVzID0gdmFsdWVcbiAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAubWFwKCh2YWwpID0+IHZhbC50cmltKCkucmVwbGFjZSgnZGVnJywgJycpKVxuICAgICAgLm1hcChOdW1iZXIpO1xuXG4gICAgc3dpdGNoIChuYW1lKSB7XG4gICAgICBjYXNlICdyb3RhdGUnOlxuICAgICAgICByZXN1bHQucm90YXRlID0gZGVncmVlc1RvUmFkaWFucyh2YWx1ZXNbMF0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NjYWxlJzpcbiAgICAgICAgcmVzdWx0LnNjYWxlWCA9IHZhbHVlc1swXTtcbiAgICAgICAgcmVzdWx0LnNjYWxlWSA9IHZhbHVlc1sxXSB8fCB2YWx1ZXNbMF07XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCBFbGVtZW50LCB7IFN0eWxlT3BUeXBlLCBzZXREaXJ0eSB9IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuaW1wb3J0IHsgaXNWYWxpZFRleHRTaGFkb3csIElUZXh0UmVuZGVyRm9yTGF5b3V0IH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnc2Fucy1zZXJpZic7XG5sZXQgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG5cbmNvbnN0IGdldENvbnRleHQgPSAoKTogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEID0+IHtcbiAgaWYgKGNvbnRleHQpIHtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIGNvbnN0IGNhbnZhcyA9IGVudi5jcmVhdGVDYW52YXMoKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IDE7XG4gIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRleHRQcm9wcyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgdmFsdWVzcmMgPSAnJztcbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZVdpZHRoOiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcbiAgcHVibGljIHRleHRCYXNlbGluZTogQ2FudmFzVGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG4gIHB1YmxpYyBmb250ID0gJyc7XG4gIHB1YmxpYyB0ZXh0QWxpZ246IENhbnZhc1RleHRBbGlnbiA9ICdsZWZ0JztcbiAgcHVibGljIGZpbGxTdHlsZSA9ICcjMDAwMDAwJztcblxuICBwcm90ZWN0ZWQgcmVuZGVyRm9yTGF5b3V0OiBJVGV4dFJlbmRlckZvckxheW91dCA9IHt9O1xuICBcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVGV4dFByb3BzKSB7XG4gICAgbGV0IG9yaWdpblN0eWxlV2lkdGggPSBzdHlsZS53aWR0aDtcbiAgICAvLyDmsqHmnInorr7nva7lrr3luqbnmoTml7blgJnpgJrov4djYW52YXPorqHnrpflh7rmloflrZflrr3luqZcbiAgICBpZiAob3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlVGV4dChzdHlsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgfHwgc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdUZXh0JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuICAgIHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9IG9yaWdpblN0eWxlV2lkdGg7XG5cbiAgICBpZiAoc3R5bGUudGV4dFNoYWRvdykge1xuICAgICAgdGhpcy5wYXJzZVRleHRTaGFkb3coc3R5bGUudGV4dFNoYWRvdyk7XG4gICAgfVxuICB9XG5cbiAgc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3A6IHN0cmluZywgc3R5bGVPcFR5cGU6IFN0eWxlT3BUeXBlLCB2YWw/OiBhbnkpIHtcbiAgICBpZiAocHJvcCA9PT0gJ3RleHRTaGFkb3cnKSB7XG4gICAgICBpZiAoc3R5bGVPcFR5cGUgPT09IFN0eWxlT3BUeXBlLlNldCkge1xuICAgICAgICB0aGlzLnBhcnNlVGV4dFNoYWRvdyh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQudGV4dFNoYWRvd3MgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICAgIGlmICghaXNWYWxpZFRleHRTaGFkb3codGV4dFNoYWRvdykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3RleHRTaGFkb3d9IGlzIG5vdCBhIHZhbGlkIHRleHRTaGFkb3dgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g6Kej5p6QIHRleHQtc2hhZG93IOWtl+espuS4slxuICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQudGV4dFNoYWRvd3MgPSB0ZXh0U2hhZG93LnNwbGl0KCcsJykubWFwKHNoYWRvdyA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gc2hhZG93LnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gcGFyc2VGbG9hdChwYXJ0c1swXSk7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBwYXJzZUZsb2F0KHBhcnRzWzFdKTtcbiAgICAgICAgY29uc3QgYmx1clJhZGl1cyA9IHBhcnNlRmxvYXQocGFydHNbMl0pO1xuICAgICAgICBjb25zdCBjb2xvciA9IHBhcnRzWzNdO1xuXG4gICAgICAgIHJldHVybiB7IG9mZnNldFgsIG9mZnNldFksIGJsdXJSYWRpdXMsIGNvbG9yIH07XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWUpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIGlmICh0aGlzLm9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBwYXJzZVRleHQodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHNldERpcnR5KHRoaXMsICd2YWx1ZSBjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICB0b0NhbnZhc0RhdGEoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuXG4gICAgdGhpcy5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdGhpcy5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuICAgIHRoaXMudGV4dEFsaWduID0gc3R5bGUudGV4dEFsaWduIHx8ICdsZWZ0JztcbiAgICB0aGlzLmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yIHx8ICcjMDAwJztcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgLy8gdGhpcy50b0NhbnZhc0RhdGEoKTtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuXG4gICAgbGV0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoJ3Rlc3QnKTtcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gdGhpcy50ZXh0QmFzZWxpbmU7XG4gICAgY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgY3R4LnRleHRBbGlnbiA9IHRoaXMudGV4dEFsaWduO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG5cbiAgICBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBkcmF3WCArPSB3aWR0aCAvIDI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgZHJhd1ggKz0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIC8vIOe6ueeQhuaWh+Wtl+aPj+i+uVxuICAgIGlmIChzdHlsZS50ZXh0U3Ryb2tlQ29sb3IpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS50ZXh0U3Ryb2tlV2lkdGggfHwgMTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLnRleHRTdHJva2VDb2xvciBhcyBzdHJpbmc7XG5cbiAgICAgIGN0eC5zdHJva2VUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8g5aSE55CG5paH5a2X6Zi05b2xXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnRleHRTaGFkb3dzKSB7XG4gICAgICB0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cy5mb3JFYWNoKCh7IG9mZnNldFgsIG9mZnNldFksIGJsdXJSYWRpdXMsIGNvbG9yIH0pID0+IHtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFggPSBvZmZzZXRYO1xuICAgICAgICBjdHguc2hhZG93T2Zmc2V0WSA9IG9mZnNldFk7XG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gYmx1clJhZGl1cztcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gY29sb3I7XG4gICAgICAgIGN0eC5maWxsVGV4dChcbiAgICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICAgIGRyYXdYIC0gb3JpZ2luWCxcbiAgICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3R4LmZpbGxUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7ICBcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IGV4dGVuZHMgRWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdWaWV3JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblkgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgudHJhbnNsYXRlKC1vcmlnaW5YLCAtb3JpZ2luWSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuL3R5cGVzXCI7XG5cbmlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgR2FtZUdsb2JhbC5fX2VudiA9IEdhbWVHbG9iYWwud3ggfHwgR2FtZUdsb2JhbC50dCB8fCBHYW1lR2xvYmFsLnN3YW47XG59XG5cbmNvbnN0IGRvbUV2ZW50TWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICB0b3VjaHN0YXJ0OiAnbW91c2Vkb3duJyxcbiAgdG91Y2htb3ZlOiAnbW91c2Vtb3ZlJyxcbiAgdG91Y2hlbmQ6ICdtb3VzZXVwJyxcbiAgdG91Y2hjYW5jZWw6ICdtb3VzZWxlYXZlJyxcbn1cblxuZW51bSBldmVudFR5cGUge1xuICBvbiA9ICdvbicsXG4gIG9mZiA9ICdvZmYnLFxufVxuXG5mdW5jdGlvbiBnZW5Eb21Ub3VjaEV2ZW50KGV2ZW50OiBzdHJpbmcsIHR5cGU6IGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBmdW5jdGlvbiAobGlzdGVuZXI6IENhbGxiYWNrKSB7XG4gICAgICB0eXBlID09PSBldmVudFR5cGUub24gP1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgICAgIDogZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRPblRvdWNoSGFuZGxlcihldmVudDogc3RyaW5nLCB0eXBlOiBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBHYW1lR2xvYmFsLl9fZW52W2Ake3R5cGV9JHtldmVudH1gXVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBnZW5Eb21Ub3VjaEV2ZW50KGRvbUV2ZW50TWFwW2V2ZW50LnRvTG93ZXJDYXNlKCldLCB0eXBlKTtcbiAgfVxufVxuXG4vKipcbiAqIExheW91dCDlj6/og73nlKjlnKjkuI3nlKjnmoTlubPlj7DvvIzogIxMYXlvdXTkvJrkvp3otZblubPlj7DkuIvpnaLnmoTkuIDkupvmlrnms5XmnaXlrp7njrDlhbfkvZPnmoTlip/og73vvIzmr5TlpoLliJvlu7rlm77niYdcbiAqIOS4uuS6huabtOWlveWBmuW5s+WPsOmAgumFje+8jOe7n+S4gOWwgeijhSBlbnYg5qih5Z2X77yM5LiN5ZCM5bmz5Y+w6KaB5YGa6YCC6YWN77yM5pu/5o2iIGVudiDnmoTlhbfkvZPmlrnms5XljbPlj69cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvLyDnm5HlkKzop6bmkbjnm7jlhbPkuovku7ZcbiAgb25Ub3VjaFN0YXJ0OiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hTdGFydCcsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hNb3ZlOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hNb3ZlJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaENhbmNlbDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoQ2FuY2VsJywgZXZlbnRUeXBlLm9uKSxcbiAgLy8g5Y+W5raI55uR5ZCs6Kem5pG455u45YWz5LqL5Lu2XG4gIG9mZlRvdWNoU3RhcnQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaFN0YXJ0JywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoTW92ZTogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoTW92ZScsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaEVuZDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoRW5kJywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoQ2FuY2VsOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hDYW5jZWwnLCBldmVudFR5cGUub2ZmKSxcblxuICAvLyBMYXlvdXQg5pSv5oyB55m+5YiG5q+U5qC35byP77yM5aaC5p6c5qC56IqC54K55qC35byP6K6+572u5Li6IDEwMCXvvIznm7TmjqXlj5YgQ2FudmFzIOeahOWwuuWvuO+8jOS4jeWQjOW5s+WPsOeahOWPluazleS4jeS4gOagt++8jOWboOatpOWNleeLrOaPkOS+m+WHveaVsFxuICBnZXRSb290Q2FudmFzU2l6ZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTaGFyZWRDYW52YXMpIHtcbiAgICAgIGNvbnN0IGN2cyA9IF9fZW52LmdldFNoYXJlZENhbnZhcygpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGN2cy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBjdnMuaGVpZ2h0LFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogMzAwLFxuICAgICAgICBoZWlnaHQ6IDE1MCxcbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgLy8g5Y+W5b2T5YmN6K6+5aSH55qEIGRldmljZVBpeGVsUmF0aW/vvIzkuI3lkIzlubPlj7DnmoTlj5bms5XkuI3kuIDmoLdcbiAgZ2V0RGV2aWNlUGl4ZWxSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgICAgcmV0dXJuIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKCkuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSB7XG4gICAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH1cbiAgfSxcblxuICAvLyDliJvlu7pDYW52YXNcbiAgY3JlYXRlQ2FudmFzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICB9LFxuXG4gIC8vIOWIm+W7uuWbvueJh1xuICBjcmVhdGVJbWFnZSgpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gICAgfVxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGNvbnZlcnRUb0pzb24gPSBmdW5jdGlvbihub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGpPYmogPSB7XG4gICAgbmFtZTogbm9kZS50YWduYW1lXG4gIH07XG5cbiAgLy93aGVuIG5vIGNoaWxkIG5vZGUgb3IgYXR0ciBpcyBwcmVzZW50XG4gIGlmICgoIW5vZGUuY2hpbGQgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuY2hpbGQpKSAmJiAoIW5vZGUuYXR0cnNNYXAgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuYXR0cnNNYXApKSkge1xuICAgIHJldHVybiB1dGlsLmlzRXhpc3Qobm9kZS52YWwpICYmICEhbm9kZS52YWwgPyBub2RlLnZhbCA6IGpPYmo7XG4gIH0gZWxzZSB7XG4gICAgLy9vdGhlcndpc2UgY3JlYXRlIGEgdGV4dG5vZGUgaWYgbm9kZSBoYXMgc29tZSB0ZXh0XG4gICAgaWYgKHV0aWwuaXNFeGlzdChub2RlLnZhbCkpIHtcbiAgICAgIGlmICghKHR5cGVvZiBub2RlLnZhbCA9PT0gJ3N0cmluZycgJiYgKG5vZGUudmFsID09PSAnJyB8fCBub2RlLnZhbCA9PT0gb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcikpKSB7XG4gICAgICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSBcInN0cmljdFwiKXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IFsgbm9kZS52YWwgXTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBub2RlLnZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdXRpbC5tZXJnZShqT2JqLCBub2RlLmF0dHJzTWFwLCBvcHRpb25zLmFycmF5TW9kZSk7XG5cbiAgak9iai5jaGlsZHJlbiA9IFtdO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goIGNoaWxkID0+IHtcbiAgICBqT2JqLmNoaWxkcmVuLnB1c2goY29udmVydFRvSnNvbihjaGlsZCwgb3B0aW9ucykpXG4gIH0pO1xuXG4gIC8vYWRkIHZhbHVlXG4gIHJldHVybiBqT2JqO1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9Kc29uID0gY29udmVydFRvSnNvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgbm9kZVRvSnNvbiA9IHJlcXVpcmUoJy4vbm9kZTJqc29uJyk7XG5jb25zdCB4bWxUb05vZGVvYmogPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCB4MnhtbG5vZGUgPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucywgdmFsaWRhdGlvbk9wdGlvbikge1xuICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICBpZih2YWxpZGF0aW9uT3B0aW9uID09PSB0cnVlKSB2YWxpZGF0aW9uT3B0aW9uID0ge31cblxuICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUoeG1sRGF0YSwgdmFsaWRhdGlvbk9wdGlvbik7XG4gICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICB0aHJvdyBFcnJvciggcmVzdWx0LmVyci5tc2cpXG4gICAgIH1cbiAgIH1cbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCB4MnhtbG5vZGUuZGVmYXVsdE9wdGlvbnMsIHgyeG1sbm9kZS5wcm9wcyk7XG4gIHJldHVybiBub2RlVG9Kc29uLmNvbnZlcnRUb0pzb24oeG1sVG9Ob2Rlb2JqLmdldFRyYXZlcnNhbE9iaih4bWxEYXRhLCBvcHRpb25zKSwgb3B0aW9ucyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxtYXRjaGVzID0gW107XG4gICAgY29uc3QgbGVuID0gbWF0Y2gubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIGFsbG1hdGNoZXMucHVzaChtYXRjaFtpbmRleF0pO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goYWxsbWF0Y2hlcyk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5jb25zdCBkb2VzTWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmNvbnN0IGRvZXNOb3RNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuICFkb2VzTWF0Y2goc3RyaW5nLCByZWdleCk7XG59O1xuXG5leHBvcnRzLmlzRXhpc3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBDb3B5IGFsbCB0aGUgcHJvcGVydGllcyBvZiBhIGludG8gYi5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0XG4gKiBAcGFyYW0geyp9IGFcbiAqL1xuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgYSwgYXJyYXlNb2RlKSB7XG4gIGlmIChhKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGEpOyAvLyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBvd24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYoYXJyYXlNb2RlID09PSAnc3RyaWN0Jyl7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IFsgYVtrZXlzW2ldXSBdO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IGFba2V5c1tpXV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuLyogZXhwb3J0cy5tZXJnZSA9ZnVuY3Rpb24gKGIsYSl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGIsYSk7XG59ICovXG5cbmV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbih2KSB7XG4gIGlmIChleHBvcnRzLmlzRXhpc3QodikpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8vIGNvbnN0IGZha2VDYWxsID0gZnVuY3Rpb24oYSkge3JldHVybiBhO307XG4vLyBjb25zdCBmYWtlQ2FsbE5vUmV0dXJuID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpIHtcbiAgdmFyIG5ld09wdGlvbnMgPSB7fTtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRpb25zOyAvL2lmIHRoZXJlIGFyZSBub3Qgb3B0aW9uc1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IG9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59O1xuXG5leHBvcnRzLmRvZXNNYXRjaCA9IGRvZXNNYXRjaDtcbmV4cG9ydHMuZG9lc05vdE1hdGNoID0gZG9lc05vdE1hdGNoO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICBsb2NhbGVSYW5nZTogJ2EtekEtWicsXG59O1xuXG5jb25zdCBwcm9wcyA9IFsnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsICdsb2NhbGVSYW5nZSddO1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHV0aWwuYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuXG4gIGNvbnN0IHRhZ3MgPSBbXTtcbiAgbGV0IHRhZ0ZvdW5kID0gZmFsc2U7XG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIGNvbnN0IHJlZ3hBdHRyTmFtZSA9IG5ldyBSZWdFeHAoJ15bX3ddW1xcXFx3XFxcXC0uOl0qJCcucmVwbGFjZSgnX3cnLCAnXycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGNvbnN0IHJlZ3hUYWdOYW1lID0gbmV3IFJlZ0V4cCgnXihbd118XylbXFxcXHcuXFxcXC1fOl0qJy5yZXBsYWNlKCcoW3cnLCAnKFsnICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAvL3N0YXJ0aW5nIG9mIHRhZ1xuICAgICAgLy9yZWFkIHVudGlsIHlvdSByZWFjaCB0byAnPicgYXZvaWRpbmcgYW55ICc+JyBpbiBhdHRyaWJ1dGUgdmFsdWVcblxuICAgICAgaSsrO1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc/Jykge1xuICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgIGlmIChpLmVycikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIDtcbiAgICAgICAgICBpIDwgeG1sRGF0YS5sZW5ndGggJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnPicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnICcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFx0JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXG4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xccic7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIHRhZ05hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50cmltKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGFnTmFtZSk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYXR0cmlidXRlc1xuICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cmluZygwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGVUYWdOYW1lKHRhZ05hbWUsIHJlZ3hUYWdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdUYWcgJyArIHRhZ05hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnQXR0cmlidXRlcyBmb3IgXCInICsgdGFnTmFtZSArICdcIiBoYXZlIG9wZW4gcXVvdGUuJ319O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyU3RyID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICAgIGlmIChhdHRyU3RyW2F0dHJTdHIubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGF0dHJTdHIgPSBhdHRyU3RyLnN1YnN0cmluZygwLCBhdHRyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsb3NpbmdUYWcpIHtcbiAgICAgICAgICBpZighcmVzdWx0LnRhZ0Nsb3NlZCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgZG9uJ3QgaGF2ZSBwcm9wZXIgY2xvc2luZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1lbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgY2FuJ3QgaGF2ZSBhdHRyaWJ1dGVzIG9yIGludmFsaWQgc3RhcnRpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3RnID0gdGFncy5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSBvdGcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnICcgKyBvdGcgKyAnIGlzIGV4cGVjdGVkIGlucGxhY2Ugb2YgJyArIHRhZ05hbWUgKyAnLid9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3MucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NraXAgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgLy9JdCBtYXkgaW5jbHVkZSBjb21tZW50cyBhbmQgQ0RBVEEgdmFsdWVcbiAgICAgICAgZm9yIChpKys7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaSArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgLy9jb21tZW50IG9yIENBREFUQVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcgJyB8fCB4bWxEYXRhW2ldID09PSAnXFx0JyB8fCB4bWxEYXRhW2ldID09PSAnXFxuJyB8fCB4bWxEYXRhW2ldID09PSAnXFxyJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRDaGFyJywgbXNnOiAnY2hhciAnICsgeG1sRGF0YVtpXSArICcgaXMgbm90IGV4cGVjdGVkIC4nfX07XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdTdGFydCB0YWcgZXhwZWN0ZWQuJ319O1xuICB9IGVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ0ludmFsaWQgJyArIEpTT04uc3RyaW5naWZ5KHRhZ3MsIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpICsgJyBmb3VuZC4nfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlYWQgUHJvY2Vzc2luZyBpbnNzdHJ1Y3Rpb25zIGFuZCBza2lwXG4gKiBAcGFyYW0geyp9IHhtbERhdGFcbiAqIEBwYXJhbSB7Kn0gaVxuICovXG5mdW5jdGlvbiByZWFkUEkoeG1sRGF0YSwgaSkge1xuICB2YXIgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgdmFyIHRhZ25hbWUgPSB4bWxEYXRhLnN1YnN0cihzdGFydCwgaSAtIHN0YXJ0KTtcbiAgICAgIGlmIChpID4gNSAmJiB0YWduYW1lID09PSAneG1sJykge1xuICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnWE1MIGRlY2xhcmF0aW9uIGFsbG93ZWQgb25seSBhdCB0aGUgc3RhcnQgb2YgdGhlIGRvY3VtZW50Lid9fTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG52YXIgZG91YmxlUXVvdGUgPSAnXCInO1xudmFyIHNpbmdsZVF1b3RlID0gXCInXCI7XG5cbi8qKlxuICogS2VlcCByZWFkaW5nIHhtbERhdGEgdW50aWwgJzwnIGlzIGZvdW5kIG91dHNpZGUgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5mdW5jdGlvbiByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpIHtcbiAgbGV0IGF0dHJTdHIgPSAnJztcbiAgbGV0IHN0YXJ0Q2hhciA9ICcnO1xuICBsZXQgdGFnQ2xvc2VkID0gZmFsc2U7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSBkb3VibGVRdW90ZSB8fCB4bWxEYXRhW2ldID09PSBzaW5nbGVRdW90ZSkge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgc3RhcnRDaGFyID0geG1sRGF0YVtpXTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnRDaGFyICE9PSB4bWxEYXRhW2ldKSB7XG4gICAgICAgIC8vaWYgdmF1ZSBpcyBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZSB0aGVuIHNpbmdsZSBxdW90ZXMgYXJlIGFsbG93ZWQgaW5zaWRlIHRoZSB2YWx1ZSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHt2YWx1ZTogYXR0clN0ciwgaW5kZXg6IGksIHRhZ0Nsb3NlZDogdGFnQ2xvc2VkfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgYWxsIHRoZSBhdHRyaWJ1dGVzIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZC5cbiAqL1xuY29uc3QgdmFsaWRBdHRyU3RyUmVneHAgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKShbXlxcXFxzPV0rKShcXFxccyo9KT8oXFxcXHMqKFtcXCdcIl0pKChbXFxcXHNcXFxcU10pKj8pXFxcXDUpPycsICdnJyk7XG5cbi8vYXR0ciwgPVwic2RcIiwgYT1cImFtaXQnc1wiLCBhPVwic2RcImI9XCJzYWZcIiwgYWIgIGNkPVwiXCJcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vY29uc29sZS5sb2cobWF0Y2hlc1tpXSk7XG5cbiAgICBpZiAobWF0Y2hlc1tpXVsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vbm9zcGFjZSBiZWZvcmUgYXR0cmlidXRlIG5hbWU6IGE9XCJzZFwiYj1cInNhZlwiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLid9fTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gPT09IHVuZGVmaW5lZCAmJiAhb3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAvL2luZGVwZW5kZW50IGF0dHJpYnV0ZTogYWJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYm9vbGVhbiBhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGlzIG5vdCBhbGxvd2VkLid9fTtcbiAgICB9XG4gICAgLyogZWxzZSBpZihtYXRjaGVzW2ldWzZdID09PSB1bmRlZmluZWQpey8vYXR0cmlidXRlIHdpdGhvdXQgdmFsdWU6IGFiPVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IHsgY29kZTpcIkludmFsaWRBdHRyXCIsbXNnOlwiYXR0cmlidXRlIFwiICsgbWF0Y2hlc1tpXVsyXSArIFwiIGhhcyBubyB2YWx1ZSBhc3NpZ25lZC5cIn19O1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICBjb25zdCBhdHRyTmFtZSA9IG1hdGNoZXNbaV1bMl07XG4gICAgaWYgKCF2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpKSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgfVxuICAgIC8qaWYgKCFhdHRyTmFtZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7Ki9cbiAgICBpZiAoICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck5hbWVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyByZXBlYXRlZC4nfX07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gL15bX2EtekEtWl1bXFx3XFwtLjpdKiQvO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpIHtcbiAgLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSBuZXcgUmVnRXhwKHJlZ3hBdHRyTmFtZSk7XG4gIHJldHVybiB1dGlsLmRvZXNNYXRjaChhdHRyTmFtZSwgcmVneEF0dHJOYW1lKTtcbn1cblxuLy9jb25zdCBzdGFydHNXaXRoWE1MID0gbmV3IFJlZ0V4cChcIl5bWHhdW01tXVtMbF1cIik7XG4vLyAgc3RhcnRzV2l0aCA9IC9eKFthLXpBLVpdfF8pW1xcdy5cXC1fOl0qLztcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKSB7XG4gIC8qaWYodXRpbC5kb2VzTWF0Y2godGFnbmFtZSxzdGFydHNXaXRoWE1MKSkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UqL1xuICByZXR1cm4gIXV0aWwuZG9lc05vdE1hdGNoKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YWduYW1lLCBwYXJlbnQsIHZhbCkge1xuICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5jaGlsZCA9IHt9OyAvL2NoaWxkIHRhZ3NcbiAgdGhpcy5hdHRyc01hcCA9IHt9OyAvL2F0dHJpYnV0ZXMgbWFwXG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy52YWwgPSB2YWw7IC8vdGV4dCBvbmx5XG4gIHRoaXMuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSkpIHtcbiAgICAgIC8vYWxyZWFkeSBwcmVzZW50c1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXS5wdXNoKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSA9IFtjaGlsZF07XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgeG1sTm9kZSA9IHJlcXVpcmUoJy4veG1sTm9kZScpO1xuY29uc3QgVGFnVHlwZSA9IHtPUEVOSU5HOiAxLCBDTE9TSU5HOiAyLCBTRUxGOiAzLCBDREFUQTogNH07XG5sZXQgcmVneCA9XG4gICc8KCghXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KShdXT4pKXwoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpKFtePl0qKT58KChcXFxcLykoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpXFxcXHMqPikpKFtePF0qKSc7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbi8vcG9seWZpbGxcbmlmICghTnVtYmVyLnBhcnNlSW50ICYmIHdpbmRvdy5wYXJzZUludCkge1xuICBOdW1iZXIucGFyc2VJbnQgPSB3aW5kb3cucGFyc2VJbnQ7XG59XG5pZiAoIU51bWJlci5wYXJzZUZsb2F0ICYmIHdpbmRvdy5wYXJzZUZsb2F0KSB7XG4gIE51bWJlci5wYXJzZUZsb2F0ID0gd2luZG93LnBhcnNlRmxvYXQ7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnQF8nLFxuICBhdHRyTm9kZU5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGlnbm9yZU5hbWVTcGFjZTogZmFsc2UsXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZU5vZGVWYWx1ZTogdHJ1ZSxcbiAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gIGFycmF5TW9kZTogZmFsc2UsXG4gIHRyaW1WYWx1ZXM6IHRydWUsIC8vVHJpbSBzdHJpbmcgdmFsdWVzIG9mIHRhZyBhbmQgYXR0cmlidXRlc1xuICBjZGF0YVRhZ05hbWU6IGZhbHNlLFxuICBjZGF0YVBvc2l0aW9uQ2hhcjogJ1xcXFxjJyxcbiAgbG9jYWxlUmFuZ2U6ICcnLFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgc3RvcE5vZGVzOiBbXVxuICAvL2RlY29kZVN0cmljdDogZmFsc2UsXG59O1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmNvbnN0IHByb3BzID0gW1xuICAnYXR0cmlidXRlTmFtZVByZWZpeCcsXG4gICdhdHRyTm9kZU5hbWUnLFxuICAndGV4dE5vZGVOYW1lJyxcbiAgJ2lnbm9yZUF0dHJpYnV0ZXMnLFxuICAnaWdub3JlTmFtZVNwYWNlJyxcbiAgJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLFxuICAncGFyc2VOb2RlVmFsdWUnLFxuICAncGFyc2VBdHRyaWJ1dGVWYWx1ZScsXG4gICdhcnJheU1vZGUnLFxuICAndHJpbVZhbHVlcycsXG4gICdjZGF0YVRhZ05hbWUnLFxuICAnY2RhdGFQb3NpdGlvbkNoYXInLFxuICAnbG9jYWxlUmFuZ2UnLFxuICAndGFnVmFsdWVQcm9jZXNzb3InLFxuICAnYXR0clZhbHVlUHJvY2Vzc29yJyxcbiAgJ3BhcnNlVHJ1ZU51bWJlck9ubHknLFxuICAnc3RvcE5vZGVzJ1xuXTtcbmV4cG9ydHMucHJvcHMgPSBwcm9wcztcblxuY29uc3QgZ2V0VHJhdmVyc2FsT2JqID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvXFxyP1xcbi9nLCBcIiBcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIHhtbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLzwhLS1bXFxzXFxTXSo/LS0+L2csICcnKTsgLy9SZW1vdmUgIGNvbW1lbnRzXG5cbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuXG4gIHJlZ3ggPSByZWd4LnJlcGxhY2UoL1xcW1xcXFx3L2csICdbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UgKyAnXFxcXHcnKTtcbiAgY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKHJlZ3gsICdnJyk7XG4gIGxldCB0YWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICBsZXQgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIHdoaWxlICh0YWcpIHtcbiAgICBjb25zdCB0YWdUeXBlID0gY2hlY2tGb3JUYWdUeXBlKHRhZyk7XG5cbiAgICBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DTE9TSU5HKSB7XG4gICAgICAvL2FkZCBwYXJzZWQgZGF0YSB0byBwYXJlbnQgbm9kZVxuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudCAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnBhcmVudC52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnBhcmVudC52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zLCBjdXJyZW50Tm9kZS5wYXJlbnQudGFnbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGN1cnJlbnROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmNoaWxkID0gW11cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmF0dHJzTWFwID09IHVuZGVmaW5lZCkgeyBjdXJyZW50Tm9kZS5hdHRyc01hcCA9IHt9fVxuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB4bWxEYXRhLnN1YnN0cihjdXJyZW50Tm9kZS5zdGFydEluZGV4ICsgMSwgdGFnLmluZGV4IC0gY3VycmVudE5vZGUuc3RhcnRJbmRleCAtIDEpXG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0RBVEEpIHtcbiAgICAgIGlmIChvcHRpb25zLmNkYXRhVGFnTmFtZSkge1xuICAgICAgICAvL2FkZCBjZGF0YSBub2RlXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuY2RhdGFUYWdOYW1lLCBjdXJyZW50Tm9kZSwgdGFnWzNdKTtcbiAgICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIC8vZm9yIGJhY2t0cmFja2luZ1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyO1xuICAgICAgICAvL2FkZCByZXN0IHZhbHVlIHRvIHBhcmVudCBub2RlXG4gICAgICAgIGlmICh0YWdbMTRdKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUudmFsICs9IHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSAoY3VycmVudE5vZGUudmFsIHx8ICcnKSArICh0YWdbM10gfHwgJycpICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLlNFTEYpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLCBjdXJyZW50Tm9kZSwgJycpO1xuICAgICAgaWYgKHRhZ1s4XSAmJiB0YWdbOF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdbOF0gPSB0YWdbOF0uc3Vic3RyKDAsIHRhZ1s4XS5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UYWdUeXBlLk9QRU5JTkdcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKFxuICAgICAgICBvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpXG4gICAgICApO1xuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjaGlsZE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY2hpbGROb2RlLnN0YXJ0SW5kZXg9dGFnLmluZGV4ICsgdGFnWzFdLmxlbmd0aFxuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjaGlsZE5vZGU7XG4gICAgfVxuXG4gICAgdGFnID0gbmV4dFRhZztcbiAgICBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgfVxuXG4gIHJldHVybiB4bWxPYmo7XG59O1xuXG5mdW5jdGlvbiBwcm9jZXNzVGFnVmFsdWUocGFyc2VkVGFncywgb3B0aW9ucywgcGFyZW50VGFnTmFtZSkge1xuICBjb25zdCB0YWdOYW1lID0gcGFyc2VkVGFnc1s3XSB8fCBwYXJlbnRUYWdOYW1lO1xuICBsZXQgdmFsID0gcGFyc2VkVGFnc1sxNF07XG4gIGlmICh2YWwpIHtcbiAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgIH1cbiAgICB2YWwgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHZhbCwgdGFnTmFtZSk7XG4gICAgdmFsID0gcGFyc2VWYWx1ZSh2YWwsIG9wdGlvbnMucGFyc2VOb2RlVmFsdWUsIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seSk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclRhZ1R5cGUobWF0Y2gpIHtcbiAgaWYgKG1hdGNoWzRdID09PSAnXV0+Jykge1xuICAgIHJldHVybiBUYWdUeXBlLkNEQVRBO1xuICB9IGVsc2UgaWYgKG1hdGNoWzEwXSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0xPU0lORztcbiAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbOF0gIT09ICd1bmRlZmluZWQnICYmIG1hdGNoWzhdLnN1YnN0cihtYXRjaFs4XS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuU0VMRjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVGFnVHlwZS5PUEVOSU5HO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYW1lU3BhY2UodGFnbmFtZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGxldCBwYXJzZWQ7XG4gICAgaWYgKHZhbC50cmltKCkgPT09ICcnIHx8IGlzTmFOKHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IHZhbCA9PT0gJ3RydWUnID8gdHJ1ZSA6IHZhbCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsLmluZGV4T2YoJzB4JykgIT09IC0xKSB7XG4gICAgICAgIC8vc3VwcG9ydCBoZXhhIGRlY2ltYWxcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTYpO1xuICAgICAgfSBlbHNlIGlmICh2YWwuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgICAgICAgcGFyc2VkID0gU3RyaW5nKHBhcnNlZCkgPT09IHZhbCA/IHBhcnNlZCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKC4qPylcXFxcMyk/JywgJ2cnKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMgJiYgdHlwZW9mIGF0dHJTdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgYXR0clN0ciA9IGF0dHJTdHIucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIC8vYXR0clN0ciA9IGF0dHJTdHIgfHwgYXR0clN0ci50cmltKCk7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIGF0dHJzUmVneCk7XG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gcmVzb2x2ZU5hbWVTcGFjZShtYXRjaGVzW2ldWzFdLCBvcHRpb25zKTtcbiAgICAgIGlmIChhdHRyTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1hdGNoZXNbaV1bNF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBtYXRjaGVzW2ldWzRdLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG9wdGlvbnMuYXR0clZhbHVlUHJvY2Vzc29yKG1hdGNoZXNbaV1bNF0sIGF0dHJOYW1lKTtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSBwYXJzZVZhbHVlKFxuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXR0ck5vZGVOYW1lKSB7XG4gICAgICBjb25zdCBhdHRyQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgYXR0ckNvbGxlY3Rpb25bb3B0aW9ucy5hdHRyTm9kZU5hbWVdID0gYXR0cnM7XG4gICAgICByZXR1cm4gYXR0ckNvbGxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxufVxuXG5leHBvcnRzLmdldFRyYXZlcnNhbE9iaiA9IGdldFRyYXZlcnNhbE9iajtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuXG4vKipcbiAqIEdlbmVyaWMgYW5pbWF0aW9uIGNsYXNzIHdpdGggc3VwcG9ydCBmb3IgZHJvcHBlZCBmcmFtZXMgYm90aCBvcHRpb25hbCBlYXNpbmcgYW5kIGR1cmF0aW9uLlxuICpcbiAqIE9wdGlvbmFsIGR1cmF0aW9uIGlzIHVzZWZ1bCB3aGVuIHRoZSBsaWZldGltZSBpcyBkZWZpbmVkIGJ5IGFub3RoZXIgY29uZGl0aW9uIHRoYW4gdGltZVxuICogZS5nLiBzcGVlZCBvZiBhbiBhbmltYXRpbmcgb2JqZWN0LCBldGMuXG4gKlxuICogRHJvcHBlZCBmcmFtZSBsb2dpYyBhbGxvd3MgdG8ga2VlcCB1c2luZyB0aGUgc2FtZSB1cGRhdGVyIGxvZ2ljIGluZGVwZW5kZW50IGZyb20gdGhlIGFjdHVhbFxuICogcmVuZGVyaW5nLiBUaGlzIGVhc2VzIGEgbG90IG9mIGNhc2VzIHdoZXJlIGl0IG1pZ2h0IGJlIHByZXR0eSBjb21wbGV4IHRvIGJyZWFrIGRvd24gYSBzdGF0ZVxuICogYmFzZWQgb24gdGhlIHB1cmUgdGltZSBkaWZmZXJlbmNlLlxuICovXG4oZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAvLyBDb21tb25KU1xuICAgICAgICBmYWN0b3J5KGV4cG9ydHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEJyb3dzZXIgZ2xvYmFsc1xuICAgICAgICBmYWN0b3J5KChyb290LmFuaW1hdGUgPSB7fSkpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgICB2YXIgZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzIDogd2luZG93XG4gICAgdmFyIHRpbWUgPSBEYXRlLm5vdyB8fCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiArbmV3IERhdGUoKTtcbiAgICB9O1xuICAgIHZhciBkZXNpcmVkRnJhbWVzID0gNjA7XG4gICAgdmFyIG1pbGxpc2Vjb25kc1BlclNlY29uZCA9IDEwMDA7XG4gICAgdmFyIHJ1bm5pbmcgPSB7fTtcbiAgICB2YXIgY291bnRlciA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBTdG9wcyB0aGUgZ2l2ZW4gYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIHdhcyBzdG9wcGVkIChha2EsIHdhcyBydW5uaW5nIGJlZm9yZSlcbiAgICAgKi9cbiAgICBleHBvcnRzLnN0b3AgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmFyIGNsZWFyZWQgPSAocnVubmluZ1tpZF0gIT09IG51bGwpO1xuICAgICAgICBpZiAoY2xlYXJlZCkge1xuICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGNsZWFyZWQ7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgZ2l2ZW4gYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZ1xuICAgICAqL1xuICAgIGV4cG9ydHMuaXNSdW5uaW5nID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiBydW5uaW5nW2lkXSAhPT0gbnVsbDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgYW5pbWF0aW9uLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0ZXBDYWxsYmFjayB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZnVuY3Rpb24gd2hpY2ggaXMgZXhlY3V0ZWQgb24gZXZlcnkgc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCwgbm93LCB2aXJ0dWFsKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIHZlcmlmeUNhbGxiYWNrIHtGdW5jdGlvbn0gRXhlY3V0ZWQgYmVmb3JlIGV2ZXJ5IGFuaW1hdGlvbiBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbigpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gY29tcGxldGVkQ2FsbGJhY2sge0Z1bmN0aW9ufVxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihkcm9wcGVkRnJhbWVzLCBmaW5pc2hlZEFuaW1hdGlvbiwgb3B0aW9uYWwgd2FzRmluaXNoZWQpIHt9YFxuICAgICAqIEBwYXJhbSBkdXJhdGlvbiB7SW50ZWdlcn0gTWlsbGlzZWNvbmRzIHRvIHJ1biB0aGUgYW5pbWF0aW9uXG4gICAgICogQHBhcmFtIGVhc2luZ01ldGhvZCB7RnVuY3Rpb259IFBvaW50ZXIgdG8gZWFzaW5nIGZ1bmN0aW9uXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQpIHsgcmV0dXJuIG1vZGlmaWVkVmFsdWU7IH1gXG4gICAgICogQHBhcmFtIHJvb3Qge0VsZW1lbnR9IFJlbmRlciByb290LiBVc2VkIGZvciBpbnRlcm5hbCB1c2FnZSBvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUuXG4gICAgICogQHJldHVybiB7SW50ZWdlcn0gSWRlbnRpZmllciBvZiBhbmltYXRpb24uIENhbiBiZSB1c2VkIHRvIHN0b3AgaXQgYW55IHRpbWUuXG4gICAgICovXG4gICAgZXhwb3J0cy5zdGFydCA9IGZ1bmN0aW9uIChzdGVwQ2FsbGJhY2ssIHZlcmlmeUNhbGxiYWNrLCBjb21wbGV0ZWRDYWxsYmFjaywgZHVyYXRpb24sIGVhc2luZ01ldGhvZCwgcm9vdCkge1xuICAgICAgICB2YXIgc3RhcnQgPSB0aW1lKCk7XG4gICAgICAgIHZhciBsYXN0RnJhbWUgPSBzdGFydDtcbiAgICAgICAgdmFyIHBlcmNlbnQgPSAwO1xuICAgICAgICB2YXIgZHJvcENvdW50ZXIgPSAwO1xuICAgICAgICB2YXIgaWQgPSBjb3VudGVyKys7XG5cbiAgICAgICAgLy8gQ29tcGFjdGluZyBydW5uaW5nIGRiIGF1dG9tYXRpY2FsbHkgZXZlcnkgZmV3IG5ldyBhbmltYXRpb25zXG4gICAgICAgIGlmIChpZCAlIDIwID09PSAwKSB7XG4gICAgICAgICAgICB2YXIgbmV3UnVubmluZyA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgdXNlZElkIGluIHJ1bm5pbmcpIHtcbiAgICAgICAgICAgICAgICBuZXdSdW5uaW5nW3VzZWRJZF0gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcnVubmluZyA9IG5ld1J1bm5pbmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGlzIGlzIHRoZSBpbnRlcm5hbCBzdGVwIG1ldGhvZCB3aGljaCBpcyBjYWxsZWQgZXZlcnkgZmV3IG1pbGxpc2Vjb25kc1xuICAgICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uICh2aXJ0dWFsKSB7XG5cbiAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSB2aXJ0dWFsIHZhbHVlXG4gICAgICAgICAgICB2YXIgcmVuZGVyID0gdmlydHVhbCAhPT0gdHJ1ZTtcblxuICAgICAgICAgICAgLy8gR2V0IGN1cnJlbnQgdGltZVxuICAgICAgICAgICAgdmFyIG5vdyA9IHRpbWUoKTtcblxuICAgICAgICAgICAgLy8gVmVyaWZpY2F0aW9uIGlzIGV4ZWN1dGVkIGJlZm9yZSBuZXh0IGFuaW1hdGlvbiBzdGVwXG4gICAgICAgICAgICBpZiAoIXJ1bm5pbmdbaWRdIHx8ICh2ZXJpZnlDYWxsYmFjayAmJiAhdmVyaWZ5Q2FsbGJhY2soaWQpKSkge1xuXG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGb3IgdGhlIGN1cnJlbnQgcmVuZGVyaW5nIHRvIGFwcGx5IGxldCdzIHVwZGF0ZSBvbWl0dGVkIHN0ZXBzIGluIG1lbW9yeS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgaW1wb3J0YW50IHRvIGJyaW5nIGludGVybmFsIHN0YXRlIHZhcmlhYmxlcyB1cC10by1kYXRlIHdpdGggcHJvZ3Jlc3MgaW4gdGltZS5cbiAgICAgICAgICAgIGlmIChyZW5kZXIpIHtcblxuICAgICAgICAgICAgICAgIHZhciBkcm9wcGVkRnJhbWVzID0gTWF0aC5yb3VuZCgobm93IC0gbGFzdEZyYW1lKSAvIChtaWxsaXNlY29uZHNQZXJTZWNvbmQgLyBkZXNpcmVkRnJhbWVzKSkgLSAxO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgTWF0aC5taW4oZHJvcHBlZEZyYW1lcywgNCk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBzdGVwKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBkcm9wQ291bnRlcisrO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb21wdXRlIHBlcmNlbnQgdmFsdWVcbiAgICAgICAgICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAobm93IC0gc3RhcnQpIC8gZHVyYXRpb247XG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnQgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHBlcmNlbnQgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRXhlY3V0ZSBzdGVwIGNhbGxiYWNrLCB0aGVuLi4uXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBlYXNpbmdNZXRob2QgPyBlYXNpbmdNZXRob2QocGVyY2VudCkgOiBwZXJjZW50O1xuICAgICAgICAgICAgaWYgKChzdGVwQ2FsbGJhY2sodmFsdWUsIG5vdywgcmVuZGVyKSA9PT0gZmFsc2UgfHwgcGVyY2VudCA9PT0gMSkgJiYgcmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgcnVubmluZ1tpZF0gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlZENhbGxiYWNrKGRlc2lyZWRGcmFtZXMgLSAoZHJvcENvdW50ZXIgLyAoKG5vdyAtIHN0YXJ0KSAvIG1pbGxpc2Vjb25kc1BlclNlY29uZCkpLCBpZCwgcGVyY2VudCA9PT0gMSB8fCBkdXJhdGlvbiA9PT0gdW5kZWZpbmVkKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgbGFzdEZyYW1lID0gbm93O1xuICAgICAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXJrIGFzIHJ1bm5pbmdcbiAgICAgICAgcnVubmluZ1tpZF0gPSB0cnVlO1xuXG4gICAgICAgIC8vIEluaXQgZmlyc3Qgc3RlcFxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIHVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59KSk7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cbmltcG9ydCBhbmltYXRlIGZyb20gJy4vYW5pbWF0ZSc7XG52YXIgTk9PUCA9IGZ1bmN0aW9uICgpIHsgfTtcblxuLy8gRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gT3BlbiBzb3VyY2UgdW5kZXIgdGhlIEJTRCBMaWNlbnNlLlxuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDMpICsgMSk7XG59O1xuXG4vKipcbiAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICoqL1xudmFyIGVhc2VJbk91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICBpZiAoKHBvcyAvPSAwLjUpIDwgMSkge1xuICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsIDMpO1xuICB9XG5cbiAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksIDMpICsgMik7XG59O1xuXG5cbi8qKlxuICogQSBwdXJlIGxvZ2ljICdjb21wb25lbnQnIGZvciAndmlydHVhbCcgc2Nyb2xsaW5nL3pvb21pbmcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbGVyIHtcbiAgY29uc3RydWN0b3IoY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICB0aGlzLl9fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHgtYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWDogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geS1heGlzICovXG4gICAgICBzY3JvbGxpbmdZOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGFuaW1hdGlvbnMgZm9yIGRlY2VsZXJhdGlvbiwgc25hcCBiYWNrLCB6b29taW5nIGFuZCBzY3JvbGxpbmcgKi9cbiAgICAgIGFuaW1hdGluZzogdHJ1ZSxcblxuICAgICAgLyoqIGR1cmF0aW9uIGZvciBhbmltYXRpb25zIHRyaWdnZXJlZCBieSBzY3JvbGxUby96b29tVG8gKi9cbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uOiAyNTAsXG5cbiAgICAgIC8qKiBFbmFibGUgYm91bmNpbmcgKGNvbnRlbnQgY2FuIGJlIHNsb3dseSBtb3ZlZCBvdXRzaWRlIGFuZCBqdW1wcyBiYWNrIGFmdGVyIHJlbGVhc2luZykgKi9cbiAgICAgIGJvdW5jaW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIGxvY2tpbmcgdG8gdGhlIG1haW4gYXhpcyBpZiB1c2VyIG1vdmVzIG9ubHkgc2xpZ2h0bHkgb24gb25lIG9mIHRoZW0gYXQgc3RhcnQgKi9cbiAgICAgIGxvY2tpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgcGFnaW5hdGlvbiBtb2RlIChzd2l0Y2hpbmcgYmV0d2VlbiBmdWxsIHBhZ2UgY29udGVudCBwYW5lcykgKi9cbiAgICAgIHBhZ2luZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgc25hcHBpbmcgb2YgY29udGVudCB0byBhIGNvbmZpZ3VyZWQgcGl4ZWwgZ3JpZCAqL1xuICAgICAgc25hcHBpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHpvb21pbmcgb2YgY29udGVudCB2aWEgQVBJLCBmaW5nZXJzIGFuZCBtb3VzZSB3aGVlbCAqL1xuICAgICAgem9vbWluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBNaW5pbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1pblpvb206IDAuNSxcblxuICAgICAgLyoqIE1heGltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWF4Wm9vbTogMyxcblxuICAgICAgLyoqIE11bHRpcGx5IG9yIGRlY3JlYXNlIHNjcm9sbGluZyBzcGVlZCAqKi9cbiAgICAgIHNwZWVkTXVsdGlwbGllcjogMSxcblxuICAgICAgLyoqIENhbGxiYWNrIHRoYXQgaXMgZmlyZWQgb24gdGhlIGxhdGVyIG9mIHRvdWNoIGVuZCBvciBkZWNlbGVyYXRpb24gZW5kLFxuICAgICAgICAgIHByb3ZpZGVkIHRoYXQgYW5vdGhlciBzY3JvbGxpbmcgYWN0aW9uIGhhcyBub3QgYmVndW4uIFVzZWQgdG8ga25vd1xuICAgICAgICAgIHdoZW4gdG8gZmFkZSBvdXQgYSBzY3JvbGxiYXIuICovXG4gICAgICBzY3JvbGxpbmdDb21wbGV0ZTogTk9PUCxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25EZWNlbGVyYXRpb246IDAuMDMsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBhY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uOiAwLjA4XG4gICAgfTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICB9XG4gIH1cblxuICAvKlxuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICBJTlRFUk5BTCBGSUVMRFMgOjogU1RBVFVTXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBvbmx5IGEgc2luZ2xlIGZpbmdlciBpcyB1c2VkIGluIHRvdWNoIGhhbmRsaW5nICovXG4gIF9faXNTaW5nbGVUb3VjaCA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIHRvdWNoIGV2ZW50IHNlcXVlbmNlIGlzIGluIHByb2dyZXNzICovXG4gIF9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24gd2VudCB0byBjb21wbGV0aW9uLiAqL1xuICBfX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIGEgZ2VzdHVyZSB6b29tL3JvdGF0ZSBldmVudCBpcyBpbiBwcm9ncmVzcy4gQWN0aXZhdGVzIHdoZW5cbiAgICogYSBnZXN0dXJlc3RhcnQgZXZlbnQgaGFwcGVucy4gVGhpcyBoYXMgaGlnaGVyIHByaW9yaXR5IHRoYW4gZHJhZ2dpbmcuXG4gICAqL1xuICBfX2lzR2VzdHVyaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBXaGV0aGVyIHRoZSB1c2VyIGhhcyBtb3ZlZCBieSBzdWNoIGEgZGlzdGFuY2UgdGhhdCB3ZSBoYXZlIGVuYWJsZWRcbiAgICogZHJhZ2dpbmcgbW9kZS4gSGludCA9IEl0J3Mgb25seSBlbmFibGVkIGFmdGVyIHNvbWUgcGl4ZWxzIG9mIG1vdmVtZW50IHQ7XG4gICAqIG5vdCBpbnRlcnJ1cHQgd2l0aCBjbGlja3MgZXRjLlxuICAgKi9cbiAgX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBOb3QgdG91Y2hpbmcgYW5kIGRyYWdnaW5nIGFueW1vcmUsIGFuZCBzbW9vdGhseSBhbmltYXRpbmcgdGhlXG4gICAqIHRvdWNoIHNlcXVlbmNlIHVzaW5nIGRlY2VsZXJhdGlvbi5cbiAgICovXG4gIF9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFNtb290aGx5IGFuaW1hdGluZyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgY2hhbmdlXG4gICAqL1xuICBfX2lzQW5pbWF0aW5nID0gZmFsc2U7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IERJTUVOU0lPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGxlZnQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHJpZ2h0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50VG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHdpZHRoICovXG4gIF9fY2xpZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgaGVpZ2h0ICovXG4gIF9fY2xpZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIHdpZHRoICovXG4gIF9fY29udGVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIGhlaWdodCAqL1xuICBfX2NvbnRlbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGggZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwV2lkdGggPSAxMDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHQgZm9yIGNvbnRlbnQgKi9cbiAgX19zbmFwSGVpZ2h0ID0gMTAwO1xuXG4gIC8qKiB7TnVtYmVyfSBab29tIGxldmVsICovXG4gIF9fem9vbUxldmVsID0gMTtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX3Njcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fc2Nyb2xsVG9wID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fbWF4U2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX21heFNjcm9sbFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIGxlZnQgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZExlZnQgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB0b3AgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFRvcCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHpvb20gbGV2ZWwgKGZpbmFsIHNjYWxlIHdoZW4gYW5pbWF0aW5nKSAqL1xuICBfX3NjaGVkdWxlZFpvb20gPSAwO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBMQVNUIFBPU0lUSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7TnVtYmVyfSBMZWZ0IHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaExlZnQgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBUb3AgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoVG9wID0gbnVsbDtcblxuICAvKioge0RhdGV9IFRpbWVzdGFtcCBvZiBsYXN0IG1vdmUgb2YgZmluZ2VyLiBVc2VkIHRvIGxpbWl0IHRyYWNraW5nIHJhbmdlIGZvciBkZWNlbGVyYXRpb24gc3BlZWQuICovXG4gIF9fbGFzdFRvdWNoTW92ZSA9IG51bGw7XG5cbiAgLyoqIHtBcnJheX0gTGlzdCBvZiBwb3NpdGlvbnMsIHVzZXMgdGhyZWUgaW5kZXhlcyBmb3IgZWFjaCBzdGF0ZSA9IGxlZnQsIHRvcCwgdGltZXN0YW1wICo7XG4gIF9fcG9zaXRpb25zID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOiA9IERFQ0VMRVJBVElPTiBTVVBQT1I7XG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBVQkxJQyBBUElcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgY2xpZW50IChvdXRlcikgYW5kIGNvbnRlbnQgKGlubmVyKSBlbGVtZW50cy5cbiAgICogUmVxdWlyZXMgdGhlIGF2YWlsYWJsZSBzcGFjZSBmb3IgdGhlIG91dGVyIGVsZW1lbnQgYW5kIHRoZSBvdXRlciBzaXplIG9mIHRoZSBpbm5lciBlbGVtZW50LlxuICAgKiBBbGwgdmFsdWVzIHdoaWNoIGFyZSBmYWxzeSAobnVsbCBvciB6ZXJvIGV0Yy4pIGFyZSBpZ25vcmVkIGFuZCB0aGUgb2xkIHZhbHVlIGlzIGtlcHQuXG4gICAqXG4gICAqIEBwYXJhbSBjbGllbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IElubmVyIHdpZHRoIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNsaWVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IElubmVyIGhlaWdodCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBPdXRlciB3aWR0aCBvZiBpbm5lciBlbGVtZW50XG4gICAqIEBwYXJhbSBjb250ZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgaGVpZ2h0IG9mIGlubmVyIGVsZW1lbnRcbiAgICovXG4gIHNldERpbWVuc2lvbnMoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0KSB7XG4gICAgLy8gT25seSB1cGRhdGUgdmFsdWVzIHdoaWNoIGFyZSBkZWZpbmVkXG4gICAgaWYgKGNsaWVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50V2lkdGggPSBjbGllbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY2xpZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY2xpZW50SGVpZ2h0ID0gY2xpZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIGlmIChjb250ZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50V2lkdGggPSBjb250ZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jb250ZW50SGVpZ2h0ID0gY29udGVudEhlaWdodDtcbiAgICB9XG5cbiAgICAvLyBSZWZyZXNoIG1heGltdW1zXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcblxuICAgIC8vIFJlZnJlc2ggc2Nyb2xsIHBvc2l0aW9uXG4gICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgZmFsc2UpO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqL1xuICBzZXRQb3NpdGlvbihsZWZ0LCB0b3ApIHtcbiAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICB0aGlzLl9fY2xpZW50VG9wID0gdG9wIHx8IDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAqXG4gICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAqL1xuICBzZXRTbmFwU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fX3NuYXBXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAqL1xuICBnZXRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fc2Nyb2xsVG9wLFxuICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoIC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIGJvdHRvbTogdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19jbGllbnRIZWlnaHQgLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFBvaW50KHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgIHRvcDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICovXG4gIGdldFNjcm9sbE1heCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAqXG4gICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbVRvKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjYWxsYmFjayBpZiBleGlzdHNcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICBpZiAoZml4ZWRMZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkVG9wID0gdGhpcy5fX2NsaWVudEhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBzY3JvbGwgcG9zaXRpb25zIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsLlxuICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAvLyAqIEZpeGVkIHBvaW50LCAkRiQsIHJlbWFpbnMgc3RhdGlvbmFyeSBpbiBjb250ZW50IHNwYWNlIGFuZCBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydC5cbiAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEZpbmFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfZiQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAvL1xuICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pL2tfZiA9IChTX2YgLSBGKSQuXG4gICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAvL1xuICAgIC8vIEZpeGVkIHBvaW50IGxvY2F0aW9uLCAkXFx2ZWN0b3J7Zn0gPSAoRiAtIFNfaSkga19pJC5cbiAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgLSBcXHZlY3RvcntmfS9rX2YkLlxuICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgdmFyIGsgPSBsZXZlbCAvIG9sZExldmVsO1xuICAgIHZhciBsZWZ0ID0gayAqICh0aGlzLl9fc2Nyb2xsTGVmdCArIGZpeGVkTGVmdCkgLSBmaXhlZExlZnQ7XG4gICAgdmFyIHRvcCA9IGsgKiAodGhpcy5fX3Njcm9sbFRvcCArIGZpeGVkVG9wKSAtIGZpeGVkVG9wO1xuXG4gICAgLy8gTGltaXQgeC1heGlzXG4gICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgIGxlZnQgPSAwO1xuICAgIH1cblxuICAgIC8vIExpbWl0IHktYXhpc1xuICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIGxldmVsLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbUJ5KGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICovXG4gIHNjcm9sbFRvKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgfVxuXG4gICAgICBsZWZ0ICo9IHpvb207XG4gICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19zbmFwSGVpZ2h0KSAqIHRoaXMuX19zbmFwSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgIHRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxUb3AsIHRvcCksIDApO1xuXG4gICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgaWYgKGxlZnQgPT09IHRoaXMuX19zY3JvbGxMZWZ0ICYmIHRvcCA9PT0gdGhpcy5fX3Njcm9sbFRvcCkge1xuICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICovXG4gIHNjcm9sbEJ5KGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIHZhciBzdGFydFRvcCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRUb3AgOiB0aGlzLl9fc2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBFVkVOVCBDQUxMQkFDS1NcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogTW91c2Ugd2hlZWwgaGFuZGxlciBmb3Igem9vbWluZyBzdXBwb3J0XG4gICAqL1xuICBkb01vdXNlWm9vbSh3aGVlbERlbHRhLCB0aW1lU3RhbXAsIHBhZ2VYLCBwYWdlWSkge1xuICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hTdGFydCh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaW50ZXJydXB0ZWRBbmltYXRpb24gZmxhZ1xuICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG4gICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHRvdWNoIHBvc2l0aW9uc1xuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBtb3ZlIHRpbWUgc3RhbXBcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gMTtcblxuICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1k7XG5cbiAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgLy8gUmVzZXQgZGVjZWxlcmF0aW9uIGNvbXBsZXRlIGZsYWdcbiAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgIHRoaXMuX19pc0RyYWdnaW5nID0gIWlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBDbGVhcmluZyBkYXRhIHN0cnVjdHVyZVxuICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIG1vdmUgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFsxLjBdIHNjYWxlIC0gLi4uLlxuICAgKi9cbiAgZG9Ub3VjaE1vdmUodG91Y2hlcywgdGltZVN0YW1wLCBzY2FsZSkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuXG4gICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAvLyBBcmUgd2UgYWxyZWFkeSBpcyBkcmFnZ2luZyBtb2RlP1xuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGRpc3RhbmNlXG4gICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAvLyBSZWFkIHByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZ1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIGxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdFJlbCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fY2xpZW50TGVmdDtcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICBzY3JvbGxMZWZ0ID0gKChjdXJyZW50VG91Y2hMZWZ0UmVsICsgc2Nyb2xsTGVmdCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaExlZnRSZWw7XG4gICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmVZKVxuICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcblxuICAgICAgICBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wIHx8IHNjcm9sbFRvcCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGxpc3QgZnJvbSBncm93aW5nIGluZmluaXRlbHkgKGhvbGRpbmcgbWluIDEwLCBtYXggMjAgbWVhc3VyZSBwb2ludHMpXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFjayBzY3JvbGwgbW92ZW1lbnQgZm9yIGRlY2xlcmF0aW9uXG4gICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIGxldmVsKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMoY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0KTtcbiAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSAmJiBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoRW5kKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgLy8gQmUgc3VyZSB0byByZXNldCB0aGUgZHJhZ2dpbmcgZmxhZyBub3cuIEhlcmUgd2UgYWxzbyBkZXRlY3Qgd2hldGhlclxuICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICBpZiAodGhpcy5fX2lzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZyAmJiAodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpIDw9IDEwMCkge1xuICAgICAgICAvLyBUaGVuIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHdhcyBhYm91dCAxMDBtcyBhZ29cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG4gICAgICAgIHZhciBlbmRQb3MgPSBwb3NpdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICAgIC8vIE1vdmUgcG9pbnRlciB0byBwb3NpdGlvbiBtZWFzdXJlZCAxMDBtcyBhZ29cbiAgICAgICAgZm9yICh2YXIgaSA9IGVuZFBvczsgaSA+IDAgJiYgcG9zaXRpb25zW2ldID4gKHRoaXMuX19sYXN0VG91Y2hNb3ZlIC0gMTAwKTsgaSAtPSAzKSB7XG4gICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gcG9zaXRpb25zW2VuZFBvc10gLSBwb3NpdGlvbnNbc3RhcnRQb3NdO1xuICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgIC8vIEJhc2VkIG9uIDUwbXMgY29tcHV0ZSB0aGUgbW92ZW1lbnQgdG8gYXBwbHkgZm9yIGVhY2ggcmVuZGVyIHN0ZXBcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIHN0YXJ0IHRoZSBkZWNlbGVyYXRpb25cbiAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPiAxMDApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAvLyBUaGlzIGlzIHBsYWNlZCBvdXRzaWRlIHRoZSBjb25kaXRpb24gYWJvdmUgdG8gaW1wcm92ZSBlZGdlIGNhc2Ugc3RhYmlsaXR5XG4gICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgIGlmICghdGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfVxuXG4gICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgdGhpcy5fX3Bvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQUklWQVRFIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgKi9cbiAgX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAvLyBiYXNlZCBvbiB0aGUgY3VycmVudCBcImRyaXZlXCIgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgIHZhciBvbGRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgdmFyIGRpZmZMZWZ0ID0gbGVmdCAtIG9sZExlZnQ7XG4gICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21MZXZlbCA9IG9sZFpvb20gKyAoZGlmZlpvb20gKiBwZXJjZW50KTtcblxuICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pc0FuaW1hdGluZyA9PT0gaWQ7XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sobGVmdCwgdG9wLCB6b29tKTtcbiAgICAgIH1cblxuICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgKi9cbiAgX19jb21wdXRlU2Nyb2xsTWF4KHpvb21MZXZlbCkge1xuICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICB0aGlzLl9fbWF4U2Nyb2xsTGVmdCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50V2lkdGggKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgIHRoaXMuX19tYXhTY3JvbGxUb3AgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudEhlaWdodCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICovXG4gIF9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX21heFNjcm9sbFRvcCksIDApO1xuICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgIC8vIFdlIGxpbWl0IGRlY2VsZXJhdGlvbiBub3QgdG8gdGhlIG1pbi9tYXggdmFsdWVzIG9mIHRoZSBhbGxvd2VkIHJhbmdlLCBidXQgdG8gdGhlIHNpemUgb2YgdGhlIHZpc2libGUgY2xpZW50IGFyZWEuXG4gICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguZmxvb3Ioc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBjbGFzcyBtZXRob2RcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgdGhpcy5fX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcik7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICB2YXIgbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgPSB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMC4xO1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmltYXRlIHRvIGdyaWQgd2hlbiBzbmFwcGluZyBpcyBhY3RpdmUsIG90aGVyd2lzZSBqdXN0IGZpeCBvdXQtb2YtYm91bmRhcnkgcG9zaXRpb25zXG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgKi9cbiAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpIHtcblxuICAgIC8vXG4gICAgLy8gQ09NUFVURSBORVhUIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYO1xuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgLy9cbiAgICAvLyBIQVJEIExJTUlUIFNDUk9MTCBQT1NJVElPTiBGT1IgTk9OIEJPVU5DSU5HIE1PREVcbiAgICAvL1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgIGlmIChzY3JvbGxMZWZ0Rml4ZWQgIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnRGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgaWYgKHNjcm9sbFRvcEZpeGVkICE9PSBzY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wRml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSAwO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFNMT1cgRE9XTlxuICAgIC8vXG5cbiAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgLy8gdG8gc2xvdyBkb3duIHRoZSBwcm9jZXNzLiBUaGlzIHNob3VsZCBlbXVsYXRlIG5hdHVyYWwgYmVoYXZpb3Igd2hlcmVcbiAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAvL1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVYID0gMDtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICB2YXIgcGVuZXRyYXRpb25EZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgaWYgKHNjcm9sbExlZnQgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9wIDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfVxuXG4gICAgICAvLyBTbG93IGRvd24gdW50aWwgc2xvdyBlbm91Z2gsIHRoZW4gZmxpcCBiYWNrIHRvIHNuYXAgcG9zaXRpb25cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICs9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKz0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgZW52IGZyb20gJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBCdXR0b24gfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQsIENhbGxiYWNrLCBUcmVlTm9kZSB9IGZyb20gJy4vdHlwZXMvaW5kZXgnO1xuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyLlRpbnlFbWl0dGVyKCk7XG5jb25zdCBpbWdQb29sID0gbmV3IFBvb2woJ2ltZ1Bvb2wnKTtcbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbCgnYml0TWFwUG9vbCcpO1xuY29uc3QgZGVidWdJbmZvID0gbmV3IERlYnVnSW5mbygpO1xuXG5pbnRlcmZhY2UgSVZpZXdQb3J0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJVmlld1BvcnRCb3gge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFdmVudEhhbmRsZXJEYXRhIHtcbiAgaGFzRXZlbnRCaW5kOiBib29sZWFuO1xuICB0b3VjaE1zZzoge1xuICAgIFtrZXk6IHN0cmluZ106IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIH07XG4gIGhhbmRsZXJzOiB7XG4gICAgdG91Y2hTdGFydDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaE1vdmU6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hFbmQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hDYW5jZWw6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIH07XG59XG5cbmludGVyZmFjZSBJUGx1Z2luPFQ+IHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnN0YWxsOiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbiAgdW5pbnN0YWxsPzogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG59XG5cbi8qKlxuICog6buY6K6k5pq06ZyyIExheW91dCDnmoTlrp7kvovvvIzkvYblnKjmn5DkupvlnLrmma/kuIvvvIzlj6/og73pnIDopoHlpJrkuKogTGF5b3V0IOWunuS+i++8jOWboOatpCBMYXlvdXQg57G75Lmf5pq06Zyy5Ye65Y67XG4gKiBjb25zdCBteUxheW91dCA9IG5ldyBMYXlvdXQoe1xuICogICBzdHlsZToge1xuICogICAgICB3aWR0aDogMCxcbiAqICAgICAgaGVpZ2h0OiAwLFxuICogICB9LFxuICogIG5hbWU6ICdteUxheW91dE5hbWUnLFxuICogfSk7XG4gKi9cbmNsYXNzIExheW91dCBleHRlbmRzIEVsZW1lbnQge1xuICAvKipcbiAgICog5b2T5YmNIExheW91dCDniYjmnKzvvIzkuIDoiKzot5/lsI/muLjmiI/mj5Lku7bniYjmnKzlr7npvZBcbiAgICovXG4gIHB1YmxpYyB2ZXJzaW9uID0gJzEuMC4xMyc7XG5cbiAgZW52ID0gZW52O1xuXG4gIC8qKlxuICAgKiBMYXlvdXQg5riy5p+T55qE55uu5qCH55S75biD5a+55bqU55qEIDJkIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZW5kZXJDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHJlbmRlcnBvcnQ6IElWaWV3UG9ydCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydDogSVZpZXdQb3J0Qm94ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gIH07XG5cbiAgLyoqXG4gICAqIOeUu+W4g+WwuuWvuOWSjOWunumZheiiq+a4suafk+WIsOWxj+W5leeahOeJqeeQhuWwuuWvuOavlFxuICAgKi9cbiAgcHVibGljIHZpZXdwb3J0U2NhbGUgPSAxO1xuICAvKipcbiAgICog55So5LqO5qCH6K+GdXBkYXRlVmlld1BvcnTmlrnms5XmmK/lkKbooqvosIPnlKjov4fkuobvvIzov5nlnKjlsI/muLjmiI/njq/looPpnZ7luLjph43opoFcbiAgICovXG4gIHB1YmxpYyBoYXNWaWV3UG9ydFNldCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDmnIDnu4jmuLLmn5PliLDlsY/luZXnmoTlt6bkuIrop5LniannkIblnZDmoIdcbiAgICovXG4gIHB1YmxpYyByZWFsTGF5b3V0Qm94OiB7XG4gICAgcmVhbFg6IG51bWJlcjtcbiAgICByZWFsWTogbnVtYmVyO1xuICB9ID0ge1xuICAgICAgcmVhbFg6IDAsXG4gICAgICByZWFsWTogMCxcbiAgICB9O1xuXG4gIHB1YmxpYyBiaXRNYXBGb250czogQml0TWFwRm9udFtdID0gW107XG4gIHB1YmxpYyBlbGVDb3VudCA9IDA7XG4gIHB1YmxpYyBzdGF0ZTogU1RBVEUgPSBTVEFURS5VTklOSVQ7XG5cbiAgLyoqXG4gICAqIOeUqOS6juWcqCB0aWNrZXIg55qE5b6q546v6YeM6Z2i5qCH6K+G5b2T5YmN5bin5piv5ZCm6ZyA6KaB6YeN57uYXG4gICAqIOmHjee7mOS4gOiIrOaYr+WbvueJh+WKoOi9veWujOaIkOOAgeaWh+Wtl+S/ruaUueetieWcuuaZr1xuICAgKi9cbiAgcHVibGljIGlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgcHVibGljIHRpY2tlcjogVGlja2VyID0gbmV3IFRpY2tlcigpO1xuICBwdWJsaWMgdGlja2VyRnVuYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICB0aGlzLmVtaXQoJ2JlZm9yZV9yZWZsb3cnLCAnJyk7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc05lZWRSZXBhaW50KSB7XG4gICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHVibGljIHN0eWxlU2hlZXQ6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4gPSB7fVxuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyRGF0YTogRXZlbnRIYW5kbGVyRGF0YTtcblxuICBwcm90ZWN0ZWQgYWN0aXZlRWxlbWVudHM6IEVsZW1lbnRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgaGFzRXZlbnRCaW5kOiBmYWxzZSxcbiAgICAgIHRvdWNoTXNnOiB7fSxcbiAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgIHRvdWNoU3RhcnQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaHN0YXJ0JykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hNb3ZlOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2htb3ZlJykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hFbmQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGVuZCcpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoQ2FuY2VsOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hjYW5jZWwnKS5iaW5kKHRoaXMpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog5a+55LqO5LiN5Lya5b2x5ZON5biD5bGA55qE5pS55Yqo77yM5q+U5aaC5Zu+54mH5Y+q5piv5pS55Liq5Zyw5Z2A44CB5Yqg5Liq6IOM5pmv6Imy5LmL57G755qE5pS55Yqo77yM5Lya6Kem5Y+RIExheW91dCDnmoQgcmVwYWludCDmk43kvZxcbiAgICAgKiDop6blj5HnmoTmlrnlvI/mmK/nu5kgTGF5b3V0IOaKm+S4qiBgcmVwYWludGAg55qE5LqL5Lu277yM5Li65LqG5oCn6IO977yM5q+P5qyh5o6l5pS25YiwIHJlcGFpbnQg6K+35rGC5LiN5Lya5omn6KGM55yf5q2j55qE5riy5p+TXG4gICAgICog6ICM5piv5omn6KGM5LiA5Liq572u6ISP5pON5L2c77yMdGlja2VyIOavj+S4gOasoeaJp+ihjCB1cGRhdGUg5Lya5qOA5p+l6L+Z5Liq5qCH6K6w5L2N77yM6L+b6ICM5omn6KGM55yf5q2j55qE6YeN57uY5pON5L2cXG4gICAgICovXG4gICAgdGhpcy5vbigncmVwYWludCcsICgpID0+IHtcbiAgICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IHRydWU7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlsIYgVHdlZW4g5oyC6L295YiwIExheW91dO+8jOWvueS6jiBUd2VlbiDnmoTkvb/nlKjlrozlhajpgbXlvqogVHdlZW4uanMg55qE5paH5qGjXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvXG4gICAgICog5Y+q5LiN6L+H5b2TIFR3ZWVuIOaUueWKqOS6huiKgueCueS8muinpuWPkSByZXBhaW5044CBcmVmbG93IOeahOWxnuaAp+aXtu+8jExheW91dCDkvJrmiafooYznm7jlupTnmoTmk43kvZxcbiAgICAgKiDkuJrliqHkvqfkuI3nlKjmhJ/nn6XliLAgcmVwYWludCDlkowgcmVmbG93XG4gICAgICovXG4gICAgLy8gdGhpcy5UV0VFTiA9IFRXRUVOO1xuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSB2JHt0aGlzLnZlcnNpb259YCk7XG4gIH1cblxuICAvLyDkuI7ogIHniYjmnKzlhbzlrrlcbiAgZ2V0IGRlYnVnSW5mbygpIHtcbiAgICBsZXQgaW5mbyA9IGRlYnVnSW5mby5sb2coKTtcblxuICAgIGluZm8gKz0gYGVsZW1lbnRDb3VudDogJHt0aGlzLmVsZUNvdW50fVxcbmA7XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrDooqvnu5jliLZjYW52YXPnmoTnqpflj6Pkv6Hmga/vvIzmnKzmuLLmn5PlvJXmk47lubbkuI3lhbPlv4PmmK/lkKbkvJrlkozlhbbku5bmuLjmiI/lvJXmk47lhbHlkIzkvb/nlKhcbiAgICog6ICM5pys6Lqr5Y+I6ZyA6KaB5pSv5oyB5LqL5Lu25aSE55CG77yM5Zug5q2k77yM5aaC5p6c6KKr5riy5p+T5YaF5a655piv57uY5Yi25Yiw56a75bGPY2FudmFz77yM6ZyA6KaB5bCG5pyA57uI57uY5Yi25Zyo5bGP5bmV5LiKXG4gICAqIOeahOe7neWvueWwuuWvuOWSjOS9jee9ruS/oeaBr+abtOaWsOWIsOacrOa4suafk+W8leaTjuOAglxuICAgKiDlhbbkuK3vvIx3aWR0aOS4uueJqeeQhuWDj+e0oOWuveW6pu+8jGhlaWdodOS4uueJqeeQhuWDj+e0oOmrmOW6pu+8jHjkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKB45Z2Q5qCH77yMeeS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oFxuICAgKiB55Z2Q5qCHXG4gICAqL1xuICB1cGRhdGVWaWV3UG9ydChib3g6IElWaWV3UG9ydEJveCkge1xuICAgIHRoaXMudmlld3BvcnQud2lkdGggPSBib3gud2lkdGggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IGJveC5oZWlnaHQgfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnggPSBib3gueCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueSA9IGJveC55IHx8IDA7XG5cbiAgICB0aGlzLnJlYWxMYXlvdXRCb3ggPSB7XG4gICAgICByZWFsWDogdGhpcy52aWV3cG9ydC54LFxuICAgICAgcmVhbFk6IHRoaXMudmlld3BvcnQueSxcbiAgICB9O1xuXG4gICAgdGhpcy5oYXNWaWV3UG9ydFNldCA9IHRydWU7XG4gIH1cblxuICBpbml0KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBhdHRyVmFsdWVQcm9jZXNzb3I/OiBDYWxsYmFjaykge1xuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdCcpO1xuXG4gICAgY29uc3QgZWxlbWVudEFycmF5ID0gdGhpcy5pbnNlcnRFbGVtZW50QXJyYXkodGVtcGxhdGUsIHN0eWxlLCBhdHRyVmFsdWVQcm9jZXNzb3IsIHRydWUpO1xuXG4gICAgdGhpcy5hZGQoZWxlbWVudEFycmF5WzBdKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5JTklURUQ7XG5cbiAgICB0aGlzLnRpY2tlci5hZGQodGhpcy50aWNrZXJGdW5jLCB0cnVlKTtcbiAgICB0aGlzLnRpY2tlci5zdGFydCgpO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnaW5pdCcpO1xuICB9XG5cbiAgcmVmbG93KGlzRmlyc3QgPSBmYWxzZSkge1xuICAgIGlmICghaXNGaXJzdCkge1xuICAgICAgZGVidWdJbmZvLnJlc2V0KCk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfcmVmbG93Jyk7XG4gICAgLyoqXG4gICAgICog6K6h566X5biD5bGA5qCRXG4gICAgICog57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga9cbiAgICAgKiBMYXlvdXTmnKzouqvlubbkuI3kvZzkuLrluIPlsYDorqHnrpfvvIzlj6rmmK/kvZzkuLroioLngrnmoJHnmoTlrrnlmahcbiAgICAgKi9cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2NvbXB1dGVMYXlvdXQnLCB0cnVlKTtcbiAgICBjb21wdXRlTGF5b3V0KHRoaXMuY2hpbGRyZW5bMF0pO1xuICAgIGRlYnVnSW5mby5lbmQoJ2NvbXB1dGVMYXlvdXQnKTtcblxuICAgIGNvbnN0IHJvb3RFbGUgPSB0aGlzLmNoaWxkcmVuWzBdO1xuXG4gICAgaWYgKHJvb3RFbGUuc3R5bGUud2lkdGggPT09IHVuZGVmaW5lZCB8fCByb290RWxlLnN0eWxlLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2Ugc2V0IHdpZHRoIGFuZCBoZWlnaHQgcHJvcGVydHkgZm9yIHJvb3QgZWxlbWVudCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQud2lkdGggPSByb290RWxlLnN0eWxlLndpZHRoO1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LmhlaWdodCA9IHJvb3RFbGUuc3R5bGUuaGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIOWwhuW4g+WxgOagkeeahOW4g+WxgOS/oeaBr+WKoOW3pei1i+WAvOWIsOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Q2hpbGRyZW4nLCB0cnVlKTtcbiAgICBsYXlvdXRDaGlsZHJlbih0aGlzKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRDaGlsZHJlbicpO1xuXG4gICAgdGhpcy52aWV3cG9ydFNjYWxlID0gdGhpcy52aWV3cG9ydC53aWR0aCAvIHRoaXMucmVuZGVycG9ydC53aWR0aDtcblxuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgLy8g6YGN5Y6G6IqC54K55qCR77yM5L6d5qyh6LCD55So6IqC54K555qE5riy5p+T5o6l5Y+j5a6e546w5riy5p+TXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZW5kZXJDaGlsZHJlbicsIHRydWUpO1xuICAgIHJlbmRlckNoaWxkcmVuKHRoaXMuY2hpbGRyZW4sIHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGZhbHNlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZW5kZXJDaGlsZHJlbicpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdyZXBhaW50JywgdHJ1ZSk7XG4gICAgdGhpcy5yZXBhaW50KCk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVwYWludCcpO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuXG4gICAgLy8gaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgKGVsZSkgPT4ge1xuICAgIC8vICAgY29uc29sZS5sb2coZWxlLnByb3BzKTtcbiAgICAvLyB9KTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9yZWZsb3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBpbml06Zi25q615qC45b+D5LuF5LuF5piv5qC55o2ueG1s5ZKMY3Nz5Yib5bu65LqG6IqC54K55qCRXG4gICAqIOimgeWunueOsOecn+ato+eahOa4suafk++8jOmcgOimgeiwg+eUqCBsYXlvdXQg5Ye95pWw77yM5LmL5omA5Lul5bCGIGxheW91dCDljZXni6zmir3osaHkuLrkuIDkuKrlh73mlbDvvIzmmK/lm6DkuLogbGF5b3V0IOW6lOW9k+aYr+WPr+S7pemHjeWkjeiwg+eUqOeahFxuICAgKiDmr5TlpoLmlLnlj5jkuobkuIDkuKrlhYPntKDnmoTlsLrlr7jvvIzlrp7pmYXkuIroioLngrnmoJHmmK/msqHlj5jnmoTvvIzku4Xku4XmmK/pnIDopoHph43mlrDorqHnrpfluIPlsYDvvIznhLblkI7muLLmn5NcbiAgICog5LiA5Liq5a6M5pW055qEIGxheW91dCDliIbmiJDkuIvpnaLnmoTlh6DmraXvvJpcbiAgICogMS4g5omn6KGM55S75biD5riF55CG77yM5Zug5Li65biD5bGA5Y+Y5YyW6aG16Z2i6ZyA6KaB6YeN57uY77yM6L+Z6YeM5rKh5pyJ5YGa5b6I6auY57qn55qE5YmU6Zmk562J5pON5L2c77yM5LiA5b6L5riF6Zmk6YeN55S777yM5a6e6ZmF5LiK5oCn6IO95bey57uP5b6I5aW9XG4gICAqIDIuIOiKgueCueagkemDveWQq+aciSBzdHlsZSDlsZ7mgKfvvIxjc3MtbGF5b3V0IOiDveWkn+agueaNrui/meS6m+S/oeaBr+iuoeeul+WHuuacgOe7iOW4g+WxgO+8jOivpuaDheWPr+ingSBodHRwczovL3d3dy5ucG1qcy5jb20vcGFja2FnZS9jc3MtbGF5b3V0XG4gICAqIDMuIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGv77yM5L2G6L+Z5Lqb5L+h5oGv5bm25LiN5piv6IO95aSf55u05o6l55So55qEXG4gICAqICAgIOavlOWmgiBsYXlvdXQudG9wIOaYr+aMh+WcqOS4gOS4queItuWuueWZqOWGheeahCB0b3DvvIzmnIDnu4jopoHlrp7njrDmuLLmn5PvvIzlrp7pmYXkuIropoHpgJLlvZLliqDkuIrlpI3lrrnlmajnmoQgdG9wXG4gICAqICAgIOi/meagt+avj+asoSByZXBhaW50IOeahOaXtuWAmeWPqumcgOimgeebtOaOpeS9v+eUqOiuoeeul+WlveeahOWAvOWNs+WPr++8jOS4jemcgOimgeavj+asoemDvemAkuW9kuiuoeeul1xuICAgKiAgICDov5nkuIDmraXnp7DkuLogbGF5b3V0Q2hpbGRyZW7vvIznm67nmoTlnKjkuo7lsIYgY3NzLWxheW91dCDov5vkuIDmraXlpITnkIbkuLrlj6/ku6XmuLLmn5Pnm7TmjqXnlKjnmoTluIPlsYDkv6Hmga9cbiAgICogNC4gcmVuZGVyQ2hpbGRyZW7vvJrmiafooYzmuLLmn5NcbiAgICogNS4gYmluZEV2ZW50c++8muaJp+ihjOS6i+S7tue7keWumlxuICAgKi9cbiAgLy8gQHRzLWlnbm9yZVxuICBsYXlvdXQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5yZW5kZXJDb250ZXh0ID0gY29udGV4dDtcblxuICAgIGlmICghdGhpcy5oYXNWaWV3UG9ydFNldCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIGludm9rZSBtZXRob2QgYHVwZGF0ZVZpZXdQb3J0YCBiZWZvcmUgbWV0aG9kIGBsYXlvdXRgJyk7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXQnKTtcblxuICAgIHRoaXMucmVmbG93KHRydWUpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb3RoZXInKTtcbiAgICB0aGlzLmJpbmRFdmVudHMoKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50JywgdHJ1ZSk7XG4gICAgaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgZWxlbWVudCA9PiBlbGVtZW50Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCkpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlJFTkRFUkVEO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Jyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X290aGVyJyk7XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM6IqC54K55pWw55qE6YeN57uY5Yi277yM5LiA6Iis5Lia5Yqh5L6n5peg6ZyA6LCD55So6K+l5pa55rOVXG4gICAqL1xuICByZXBhaW50KCkge1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgdGhpcy5pc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gICAgcmVwYWludENoaWxkcmVuKHRoaXMuY2hpbGRyZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOi/lOWbnuS4gOS4quiKgueCueWcqOWxj+W5leS4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr++8jOWJjeaPkOaYr+ato+ehruiwg+eUqHVwZGF0ZVZpZXdQb3J044CCXG4gICAqL1xuICBnZXRFbGVtZW50Vmlld3BvcnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7IHJlYWxMYXlvdXRCb3gsIHZpZXdwb3J0U2NhbGUgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgYWJzb2x1dGVYLFxuICAgICAgYWJzb2x1dGVZLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfSA9IGVsZW1lbnQubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWDtcbiAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdmlld3BvcnRTY2FsZTtcbiAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdmlld3BvcnRTY2FsZTtcblxuICAgIHJldHVybiBuZXcgUmVjdChcbiAgICAgIHJlYWxYLFxuICAgICAgcmVhbFksXG4gICAgICByZWFsV2lkdGgsXG4gICAgICByZWFsSGVpZ2h0LFxuICAgICk7XG4gIH1cblxuICBnZXRDaGlsZEJ5UG9zKHRyZWU6IExheW91dCB8IEVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpdGVtTGlzdDogKExheW91dCB8IEVsZW1lbnQpW10pIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBhYnNvbHV0ZVgsXG4gICAgICAgIGFic29sdXRlWSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgIH0gPSBlbGUubGF5b3V0Qm94O1xuICAgICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWTtcbiAgICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdGhpcy52aWV3cG9ydFNjYWxlO1xuICAgICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHRoaXMudmlld3BvcnRTY2FsZTtcblxuICAgICAgaWYgKChyZWFsWCA8PSB4ICYmIHggPD0gcmVhbFggKyByZWFsV2lkdGgpICYmIChyZWFsWSA8PSB5ICYmIHkgPD0gcmVhbFkgKyByZWFsSGVpZ2h0KSkge1xuICAgICAgICAvKipcbiAgICAgICAgICog55u45YWzaXNzdWXvvJpodHRwczovL2dpdGh1Yi5jb20vd2VjaGF0LW1pbmlwcm9ncmFtL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvaXNzdWVzLzE3XG4gICAgICAgICAqIOi/memHjOWPquimgea7oei2s+adoeS7tueahOmDveimgeiusOW9le+8jOWQpuWImeWPr+iDveWHuueOsCBpc3N1ZSDph4zpnaLmj5DliLDnmoTpl67pophcbiAgICAgICAgICovXG4gICAgICAgIGl0ZW1MaXN0LnB1c2goZWxlKTtcbiAgICAgICAgaWYgKGVsZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmdldENoaWxkQnlQb3MoZWxlLCB4LCB5LCBpdGVtTGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV2ZW50SGFuZGxlciA9IChldmVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBsZXQgdG91Y2g6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG5cbiAgICAgIGlmIChpc0dhbWVUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgIHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG91Y2ggPSBlO1xuICAgICAgfVxuICAgICAgLy8gY29uc3QgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkgfHwgZTtcbiAgICAgIGlmICghdG91Y2ggfHwgIXRvdWNoLnBhZ2VYIHx8ICF0b3VjaC5wYWdlWSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gudGltZVN0YW1wKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdG91Y2gudGltZVN0YW1wID0gZS50aW1lU3RhbXA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdID0gW107XG4gICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKHRoaXMsIHRvdWNoLnBhZ2VYLCB0b3VjaC5wYWdlWSwgbGlzdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoZXZlbnROYW1lLCBlKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2dbZXZlbnROYW1lXSA9IHRvdWNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnICYmIGlzQ2xpY2sodGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnKSkge1xuICAgICAgICBpdGVtICYmIGl0ZW0uZW1pdCgnY2xpY2snLCBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIC8qKlxuICAgKiDmiafooYzlhajlsYDnmoTkuovku7bnu5HlrprpgLvovpFcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcbiAgICBlbnYub25Ub3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICBlbnYub25Ub3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgZW52Lm9uVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICBlbnYub25Ub3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuXG4gICAgLyoqXG4gICAgICog5b2T6Kem5Y+RIHRvdWNoc3RhcnQg5LqL5Lu255qE5pe25YCZ77yM5aaC5p6c5omL5oyH56e76Zmk5YWD57Sg5aSW77yM5LiN5Lya6Kem5Y+RIHRvdWNoZW5k77yM6L+Z5bCx5a+86Ie0IGRlYWN0aXZlSGFuZGxlciDkuI3og73op6blj5FcbiAgICAgKiDopoHlgZrliLDmr5TovoPlrozlloTvvIzkuovku7bns7vnu5/opoHlgZrovoPlpKfmlLnnlKjvvIznm67liY3mr5TovoPlpb3nmoTlgZrms5XlsLHmmK/moLnoioLngrnlnKjnm5HlkKzliLAgdG91Y2hlbmQg5ZKMIHRvdWNoY2FuY2VsIOeahOaXtuWAmeWFnOW6lVxuICAgICAqIOinpuWPkeS4iyBkZWFjdGl2ZUhhbmRsZXJcbiAgICAgKi9cbiAgICB0aGlzLm9uKCd0b3VjaGVuZCcsICgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlRWxlbWVudHMuZm9yRWFjaCgoZWxlOiBFbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZS5kZWFjdGl2ZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFjdGl2ZUVsZW1lbnRzID0gW107XG4gICAgfSk7XG4gICAgdGhpcy5vbigndG91Y2hjYW5jZWwnLCAoKSA9PiB7XG4gICAgICB0aGlzLmFjdGl2ZUVsZW1lbnRzLmZvckVhY2goKGVsZTogRWxlbWVudCkgPT4ge1xuICAgICAgICBlbGUuZGVhY3RpdmVIYW5kbGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hY3RpdmVFbGVtZW50cyA9IFtdO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWFqOWxgOS6i+S7tuino+e7kVxuICAgKi9cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGVudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICBlbnYub2ZmVG91Y2hNb3ZlKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmUpO1xuICAgIGVudi5vZmZUb3VjaEVuZCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQpO1xuICAgIGVudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBFRS5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3lBbGwodHJlZTogTGF5b3V0IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgIH0gPSB0cmVlO1xuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZGVzdHJveUFsbChjaGlsZCk7XG4gICAgICBjaGlsZC5kZXN0cm95U2VsZiAmJiBjaGlsZC5kZXN0cm95U2VsZigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4heeQhueUu+W4g++8jOS5i+WJjeeahOiuoeeul+WHuuadpeeahOa4suafk+agkeS5n+S8muS4gOW5tua4heeQhu+8jOatpOaXtuWPr+S7peWGjeasoeaJp+ihjGluaXTlkoxsYXlvdXTmlrnms5XmuLLmn5PnlYzpnaLjgIJcbiAgICovXG4gIGNsZWFyKG9wdGlvbnM6IHsgcmVtb3ZlVGlja2VyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB7IHJlbW92ZVRpY2tlciA9IHRydWUgfSA9IG9wdGlvbnM7XG5cbiAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB0aGlzLmRlc3Ryb3lBbGwodGhpcyk7XG4gICAgLy8gdGhpcy5lbGVtZW50VHJlZSA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5DTEVBUjtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB0aGlzLmVsZUNvdW50ID0gMDtcbiAgICB0aGlzLnVuQmluZEV2ZW50cygpO1xuXG4gICAgaWYgKHJlbW92ZVRpY2tlcikge1xuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlKCk7XG4gICAgICB0aGlzLnRpY2tlci5zdG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlubmVy55qE5bqU6K+l6buY6K6k6YO956e76Zmk77yM5ZCm5YiZ5YmN5ZCO5Lik5qyh5Yid5aeL5YyW5Lya5a+86Ie05YmN5ZCO54q25oCB5pyJ6Zeu6aKYXG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmVJbm5lcigpO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlRWxlbWVudHMgPSBbXTtcbiAgfVxuXG4gIGNsZWFyUG9vbCgpIHtcbiAgICBpbWdQb29sLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog5q+U6LW3IExheW91dC5jbGVhciDmm7TlvbvlupXnmoTmuIXnkIbvvIzkvJrmuIXnqbrlm77niYflr7nosaHmsaDvvIzlh4/lsJHlhoXlrZjljaDnlKjjgIJcbiAgICovXG4gIGNsZWFyQWxsKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIHRoaXMuY2xlYXJQb29sKCk7XG4gIH1cblxuICAvKipcbiAgICog5a+55LqO5Zu+54mH6LWE5rqQ77yM5aaC5p6c5LiN5o+Q5YmN5Yqg6L2977yM5riy5p+T6L+H56iL5Lit5Y+v6IO95Ye6546w5oyo5Liq5Ye6546w5Zu+54mH5pWI5p6c77yM5b2x5ZON5L2T6aqMXG4gICAqIOmAmui/h0xheW91dC5sb2FkSW1nc+WPr+S7pemihOWKoOi9veWbvueJh+i1hOa6kO+8jOWcqOiwg+eUqExheW91dC5sYXlvdXTnmoTml7blgJnmuLLmn5PmgKfog73mm7Tlpb3vvIzkvZPpqozmm7TkvbPjgIJcbiAgICovXG4gIGxvYWRJbWdzKGFycjogc3RyaW5nW10gPSBbXSkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChhcnIubWFwKHNyYyA9PiBpbWFnZU1hbmFnZXIubG9hZEltYWdlUHJvbWlzZShzcmMpKSk7XG4gIH1cblxuICAvKipcbiAgICog5rOo5YaMIGJpdG1hcHRleHQg5Y+v55So55qE5a2X5L2T44CCXG4gICAqL1xuICByZWdpc3RCaXRNYXBGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgaWYgKCFiaXRNYXBQb29sLmdldChuYW1lKSkge1xuICAgICAgY29uc3QgZm9udCA9IG5ldyBCaXRNYXBGb250KG5hbWUsIHNyYywgY29uZmlnKTtcbiAgICAgIHRoaXMuYml0TWFwRm9udHMucHVzaChmb250KTtcbiAgICAgIGJpdE1hcFBvb2wuc2V0KG5hbWUsIGZvbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDliJvlu7roioLngrnvvIzliJvlu7rkuYvlkI7kvJrov5Tlm55FbGVtZW505YiX6KGo77yM5Y+v5Lul5Lyg5YWlcGFyZW5056uL5Yi75o+S5YWl6IqC54K577yM5Lmf5Y+v5Lul56iN5ZCO5Li75YqoYXBwZW5kQ2hpbGTliLDpnIDopoHnmoToioLngrnkuItcbiAgICovXG4gIGluc2VydEVsZW1lbnQodGVtcGxhdGU6IHN0cmluZywgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIHBhcmVudD86IEVsZW1lbnQgfCBudWxsKTogRWxlbWVudFtdIHtcbiAgICBjb25zdCBlbGVtZW50QXJyYXkgPSB0aGlzLmluc2VydEVsZW1lbnRBcnJheSh0ZW1wbGF0ZSwgc3R5bGUpO1xuICAgIGVsZW1lbnRBcnJheS5mb3JFYWNoKGl0ID0+IHtcbiAgICAgIGl0ZXJhdGVUcmVlKGl0LCBlbGVtZW50ID0+IGVsZW1lbnQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSk7XG5cbiAgICAgIGlmIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGl0KTtcbiAgICAgIH1cbiAgICB9KVxuICAgIFxuICAgIHJldHVybiBlbGVtZW50QXJyYXk7XG4gIH1cblxuICAvKipcbiAgICog5YWL6ZqG6IqC54K577yM5YWL6ZqG5ZCO55qE6IqC54K55Y+v5Lul5re75Yqg5YiwIExheW91dCDnmoTmn5DkuKroioLngrnkuK1cbiAgICog6K+l5pa55rOV5Y+v5Lul5Zyo5pWw5o2u5pyJ5Y+Y5YyW55qE5pe25YCZ6YG/5YWN6YeN5paw5omn6KGMIExheW91dC5pbml0IOa1geeoi+OAglxuICAgKi9cbiAgY2xvbmVOb2RlKGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNsb25lPExheW91dD4odGhpcywgZWxlbWVudCwgZGVlcCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG57uE5Lu25oyC5YiwTGF5b3V0XG4gICAqL1xuICBFbGVtZW50ID0gRWxlbWVudDtcbiAgVmlldyA9IFZpZXc7XG4gIFRleHQgPSBUZXh0O1xuICBJbWFnZSA9IEltYWdlO1xuICBTY3JvbGxWaWV3ID0gU2Nyb2xsVmlldztcbiAgQml0TWFwVGV4dCA9IEJpdE1hcFRleHQ7XG4gIENhbnZhcyA9IENhbnZhcztcbiAgQnV0dG9uID0gQnV0dG9uO1xuXG4gIHJlZ2lzdGVyQ29tcG9uZW50ID0gcmVnaXN0ZXJDb21wb25lbnQ7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFsbGVkUGx1Z2luczogSVBsdWdpbjxMYXlvdXQ+W10gPSBbXTtcbiAgLyoqXG4gICAqIOWuieijhee7meWumueahOaPkuS7tlxuICAgKi9cbiAgdXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGlmIChMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIOivpeaPkuS7tuW3suWuieijhS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWuieijhWApXG4gIH1cblxuICAvKipcbiAgICog5Y246L2957uZ5a6a5o+S5Lu2XG4gICAqL1xuICB1blVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBjb25zdCBwbHVnaW5JbmRleCA9IExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluZGV4T2YocGx1Z2luKTtcblxuICAgIGlmIChwbHVnaW5JbmRleCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gVGhpcyBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnVuaW5zdGFsbCkge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWNuOi9vWApXG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuc3BsaWNlKHBsdWdpbkluZGV4LCAxKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDliJvlu7roioLngrnvvIzliJvlu7rkuYvlkI7kvJrov5Tlm55FbGVtZW505YiX6KGoXG4gICAqL1xuICBwcml2YXRlIGluc2VydEVsZW1lbnRBcnJheSh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yPzogQ2FsbGJhY2ssIG9ubHlGaXJzdD86IGJvb2xlYW4pOiBFbGVtZW50W10ge1xuICAgIC8vIOagt+W8j+ihqOWtmOWIsOWFqOWxgFxuICAgIHRoaXMuc3R5bGVTaGVldCA9IE9iamVjdC5hc3NpZ24odGhpcy5zdHlsZVNoZWV0LCBzdHlsZSk7XG5cbiAgICBjb25zdCBwYXJzZUNvbmZpZyA9IHtcbiAgICAgIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICcnLFxuICAgICAgYXR0ck5vZGVOYW1lOiAnYXR0cicsIC8vIGRlZmF1bHQgaXMgJ2ZhbHNlJ1xuICAgICAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICAgICAgaWdub3JlQXR0cmlidXRlczogZmFsc2UsXG4gICAgICBpZ25vcmVOYW1lU3BhY2U6IHRydWUsXG4gICAgICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgcGFyc2VOb2RlVmFsdWU6IGZhbHNlLFxuICAgICAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gICAgICB0cmltVmFsdWVzOiB0cnVlLFxuICAgICAgcGFyc2VUcnVlTnVtYmVyT25seTogZmFsc2UsXG4gICAgICBhbHdheXNDcmVhdGVUZXh0Tm9kZTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgaWYgKGF0dHJWYWx1ZVByb2Nlc3NvciAmJiB0eXBlb2YgYXR0clZhbHVlUHJvY2Vzc29yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBwYXJzZUNvbmZpZy5hdHRyVmFsdWVQcm9jZXNzb3IgPSBhdHRyVmFsdWVQcm9jZXNzb3I7XG4gICAgfVxuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbnNlcnRfeG1sUGFyc2UnKTtcbiAgICAvLyDlsIZ4bWzlrZfnrKbkuLLop6PmnpDmiJB4bWzoioLngrnmoJFcbiAgICBjb25zdCBqc29uT2JqID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBwYXJzZUNvbmZpZywgdHJ1ZSk7XG4gICAgLy8gY29uc29sZS5sb2coanNvbk9iailcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbnNlcnRfeG1sUGFyc2UnKTtcblxuICAgIGNvbnN0IGdldEVsZW1lbnRzOiBFbGVtZW50W10gPSBbXTtcbiAgICBqc29uT2JqLmNoaWxkcmVuLmZvckVhY2goKHhtbFRyZWU6IFRyZWVOb2RlLCBpbmRleDogbnVtYmVyKSA9PiB7XG4gICAgICBpZiAob25seUZpcnN0ICYmIGluZGV4ID4gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBYTUzmoJHnlJ/miJDmuLLmn5PmoJFcbiAgICAgIGRlYnVnSW5mby5zdGFydCgnaW5zZXJ0X3htbDJMYXlvdXQnKTtcbiAgICAgIGNvbnN0IGxheW91dFRyZWUgPSBjcmVhdGUuY2FsbCh0aGlzLCB4bWxUcmVlLCB0aGlzLnN0eWxlU2hlZXQpO1xuICAgICAgZGVidWdJbmZvLmVuZCgnaW5zZXJ0X3htbDJMYXlvdXQnKTtcbiAgICAgIGdldEVsZW1lbnRzLnB1c2gobGF5b3V0VHJlZSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gZ2V0RWxlbWVudHM7XG4gIH1cbn1cblxuY29uc3QgbGF5b3V0ID0gbmV3IExheW91dCh7XG4gIHN0eWxlOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9LFxuICBuYW1lOiAnbGF5b3V0Jyxcbn0pO1xuXG5leHBvcnQge1xuICBsYXlvdXQgYXMgZGVmYXVsdCxcbiAgTGF5b3V0LFxuICBlbnYsXG4gIEVFLFxuICBJU3R5bGUsXG4gIEVsZW1lbnQsXG4gIFZpZXcsXG4gIFRleHQsXG4gIEltYWdlLFxuICBTY3JvbGxWaWV3LFxuICBCaXRNYXBUZXh0LFxuICBDYW52YXMsXG4gIEJ1dHRvblxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi5cXGRpc3RcXGluZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxDQUFDO0FBT0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL2Nzcy1sYXlvdXQvZGlzdC9jc3MtbGF5b3V0LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvdGlueS1lbWl0dGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2JpdE1hcEZvbnQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vZGVidWdJbmZvLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2ltYWdlTWFuYWdlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9wb29sLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3JlY3QudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdGlja2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3V0aWwudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdmQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2JpdG1hcHRleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2J1dHRvbi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvY2FudmFzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9lbGVtZW50cy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW1hZ2UudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2luZGV4LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGxiYXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbHZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZVBhcnNlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2Vudi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL25vZGUyanNvbi5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxOb2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sc3RyMnhtbG5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2FuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL3Njcm9sbGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVU1EIChVbml2ZXJzYWwgTW9kdWxlIERlZmluaXRpb24pXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZCBmb3IgcmVmZXJlbmNlXG4vL1xuLy8gVGhpcyBmaWxlIHVzZXMgdGhlIGZvbGxvd2luZyBzcGVjaWZpYyBVTUQgaW1wbGVtZW50YXRpb246XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kL2Jsb2IvbWFzdGVyL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbihyb290LCBmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgZGVmaW5lKFtdLCBmYWN0b3J5KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAvLyBOb2RlLiBEb2VzIG5vdCB3b3JrIHdpdGggc3RyaWN0IENvbW1vbkpTLCBidXRcbiAgICAvLyBvbmx5IENvbW1vbkpTLWxpa2UgZW52aXJvbm1lbnRzIHRoYXQgc3VwcG9ydCBtb2R1bGUuZXhwb3J0cyxcbiAgICAvLyBsaWtlIE5vZGUuXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICByb290LmNvbXB1dGVMYXlvdXQgPSBmYWN0b3J5KCk7XG4gIH1cbn0odGhpcywgZnVuY3Rpb24oKSB7XG4gIC8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKi9cblxudmFyIGNvbXB1dGVMYXlvdXQgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIENTU19VTkRFRklORUQ7XG5cbiAgdmFyIENTU19ESVJFQ1RJT05fSU5IRVJJVCA9ICdpbmhlcml0JztcbiAgdmFyIENTU19ESVJFQ1RJT05fTFRSID0gJ2x0cic7XG4gIHZhciBDU1NfRElSRUNUSU9OX1JUTCA9ICdydGwnO1xuXG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XID0gJ3Jvdyc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgPSAncm93LXJldmVyc2UnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiA9ICdjb2x1bW4nO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFID0gJ2NvbHVtbi1yZXZlcnNlJztcblxuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19KVVNUSUZZX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0pVU1RJRllfRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTiA9ICdzcGFjZS1iZXR3ZWVuJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0FST1VORCA9ICdzcGFjZS1hcm91bmQnO1xuXG4gIHZhciBDU1NfQUxJR05fRkxFWF9TVEFSVCA9ICdmbGV4LXN0YXJ0JztcbiAgdmFyIENTU19BTElHTl9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19BTElHTl9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfQUxJR05fU1RSRVRDSCA9ICdzdHJldGNoJztcblxuICB2YXIgQ1NTX1BPU0lUSU9OX1JFTEFUSVZFID0gJ3JlbGF0aXZlJztcbiAgdmFyIENTU19QT1NJVElPTl9BQlNPTFVURSA9ICdhYnNvbHV0ZSc7XG5cbiAgdmFyIGxlYWRpbmcgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgdHJhaWxpbmcgPSB7XG4gICAgJ3Jvdyc6ICdyaWdodCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ2xlZnQnLFxuICAgICdjb2x1bW4nOiAnYm90dG9tJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAndG9wJ1xuICB9O1xuICB2YXIgcG9zID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIGRpbSA9IHtcbiAgICAncm93JzogJ3dpZHRoJyxcbiAgICAncm93LXJldmVyc2UnOiAnd2lkdGgnLFxuICAgICdjb2x1bW4nOiAnaGVpZ2h0JyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnaGVpZ2h0J1xuICB9O1xuXG4gIC8vIFdoZW4gdHJhbnNwaWxlZCB0byBKYXZhIC8gQyB0aGUgbm9kZSB0eXBlIGhhcyBsYXlvdXQsIGNoaWxkcmVuIGFuZCBzdHlsZVxuICAvLyBwcm9wZXJ0aWVzLiBGb3IgdGhlIEphdmFTY3JpcHQgdmVyc2lvbiB0aGlzIGZ1bmN0aW9uIGFkZHMgdGhlc2UgcHJvcGVydGllc1xuICAvLyBpZiB0aGV5IGRvbid0IGFscmVhZHkgZXhpc3QuXG4gIGZ1bmN0aW9uIGZpbGxOb2Rlcyhub2RlKSB7XG4gICAgaWYgKCFub2RlLmxheW91dCB8fCBub2RlLmlzRGlydHkpIHtcbiAgICAgIG5vZGUubGF5b3V0ID0ge1xuICAgICAgICB3aWR0aDogdW5kZWZpbmVkLFxuICAgICAgICBoZWlnaHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgdG9wOiAwLFxuICAgICAgICBsZWZ0OiAwLFxuICAgICAgICByaWdodDogMCxcbiAgICAgICAgYm90dG9tOiAwXG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICghbm9kZS5zdHlsZSkge1xuICAgICAgbm9kZS5zdHlsZSA9IHt9O1xuICAgIH1cblxuICAgIGlmICghbm9kZS5jaGlsZHJlbikge1xuICAgICAgbm9kZS5jaGlsZHJlbiA9IFtdO1xuICAgIH1cbiAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZmlsbE5vZGVzKTtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Jvd0RpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cgfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpblN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpblN0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5FbmQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbjtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdFbmQgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmdFbmQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ0VuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1JpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdCb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdNYXJnaW4obm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykgK1xuICAgICAgICBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRKdXN0aWZ5Q29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25Db250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduQ29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduSXRlbShub2RlLCBjaGlsZCkge1xuICAgIGlmIChjaGlsZC5zdHlsZS5hbGlnblNlbGYpIHtcbiAgICAgIHJldHVybiBjaGlsZC5zdHlsZS5hbGlnblNlbGY7XG4gICAgfVxuICAgIGlmIChub2RlLnN0eWxlLmFsaWduSXRlbXMpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmFsaWduSXRlbXM7XG4gICAgfVxuICAgIHJldHVybiAnc3RyZXRjaCc7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlQXhpcyhheGlzLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX1JUTCkge1xuICAgICAgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1cpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgICAgIH0gZWxzZSBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBheGlzO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIgZGlyZWN0aW9uO1xuICAgIGlmIChub2RlLnN0eWxlLmRpcmVjdGlvbikge1xuICAgICAgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb247XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpcmVjdGlvbiA9IENTU19ESVJFQ1RJT05fSU5IRVJJVDtcbiAgICB9XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBDU1NfRElSRUNUSU9OX0lOSEVSSVQpIHtcbiAgICAgIGRpcmVjdGlvbiA9IChwYXJlbnREaXJlY3Rpb24gPT09IHVuZGVmaW5lZCA/IENTU19ESVJFQ1RJT05fTFRSIDogcGFyZW50RGlyZWN0aW9uKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RmxleERpcmVjdGlvbihub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleERpcmVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24oZmxleERpcmVjdGlvbiwgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb25UeXBlKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wb3NpdGlvbikge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucG9zaXRpb247XG4gICAgfVxuICAgIHJldHVybiAncmVsYXRpdmUnO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4KG5vZGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZ2V0UG9zaXRpb25UeXBlKG5vZGUpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgIG5vZGUuc3R5bGUuZmxleCA+IDBcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNGbGV4V3JhcChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUuZmxleFdyYXAgPT09ICd3cmFwJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERpbVdpdGhNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLmxheW91dFtkaW1bYXhpc11dICsgZ2V0TWFyZ2luQXhpcyhub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRGltRGVmaW5lZChub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGVbZGltW2F4aXNdXSA+PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNQb3NEZWZpbmVkKG5vZGUsIHBvcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzTWVhc3VyZURlZmluZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLm1lYXN1cmUgIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uKG5vZGUsIHBvcykge1xuICAgIGlmIChub2RlLnN0eWxlW3Bvc10gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBib3VuZEF4aXMobm9kZSwgYXhpcywgdmFsdWUpIHtcbiAgICB2YXIgbWluID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWluSGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5IZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIG1heCA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1heEhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4SGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBib3VuZFZhbHVlID0gdmFsdWU7XG4gICAgaWYgKG1heCAhPT0gdW5kZWZpbmVkICYmIG1heCA+PSAwICYmIGJvdW5kVmFsdWUgPiBtYXgpIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtYXg7XG4gICAgfVxuICAgIGlmIChtaW4gIT09IHVuZGVmaW5lZCAmJiBtaW4gPj0gMCAmJiBib3VuZFZhbHVlIDwgbWluKSB7XG4gICAgICBib3VuZFZhbHVlID0gbWluO1xuICAgIH1cbiAgICByZXR1cm4gYm91bmRWYWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZtYXhmKGEsIGIpIHtcbiAgICBpZiAoYSA+IGIpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICByZXR1cm4gYjtcbiAgfVxuXG4gIC8vIFdoZW4gdGhlIHVzZXIgc3BlY2lmaWNhbGx5IHNldHMgYSB2YWx1ZSBmb3Igd2lkdGggb3IgaGVpZ2h0XG4gIGZ1bmN0aW9uIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBheGlzKSB7XG4gICAgLy8gVGhlIHBhcmVudCBhbHJlYWR5IGNvbXB1dGVkIHVzIGEgd2lkdGggb3IgaGVpZ2h0LiBXZSBqdXN0IHNraXAgaXRcbiAgICBpZiAobm9kZS5sYXlvdXRbZGltW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIFdlIG9ubHkgcnVuIGlmIHRoZXJlJ3MgYSB3aWR0aCBvciBoZWlnaHQgZGVmaW5lZFxuICAgIGlmICghaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVGhlIGRpbWVuc2lvbnMgY2FuIG5ldmVyIGJlIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyXG4gICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgYm91bmRBeGlzKG5vZGUsIGF4aXMsIG5vZGUuc3R5bGVbZGltW2F4aXNdXSksXG4gICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKVxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBheGlzKSB7XG4gICAgY2hpbGQubGF5b3V0W3RyYWlsaW5nW2F4aXNdXSA9IG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtIGNoaWxkLmxheW91dFtwb3NbYXhpc11dO1xuICB9XG5cbiAgLy8gSWYgYm90aCBsZWZ0IGFuZCByaWdodCBhcmUgZGVmaW5lZCwgdGhlbiB1c2UgbGVmdC4gT3RoZXJ3aXNlIHJldHVyblxuICAvLyArbGVmdCBvciAtcmlnaHQgZGVwZW5kaW5nIG9uIHdoaWNoIGlzIGRlZmluZWQuXG4gIGZ1bmN0aW9uIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlW2xlYWRpbmdbYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBnZXRQb3NpdGlvbihub2RlLCBsZWFkaW5nW2F4aXNdKTtcbiAgICB9XG4gICAgcmV0dXJuIC1nZXRQb3NpdGlvbihub2RlLCB0cmFpbGluZ1theGlzXSk7XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgLypjc3NfZGlyZWN0aW9uX3QqL3BhcmVudERpcmVjdGlvbikge1xuICAgIHZhci8qY3NzX2RpcmVjdGlvbl90Ki8gZGlyZWN0aW9uID0gcmVzb2x2ZURpcmVjdGlvbihub2RlLCBwYXJlbnREaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBtYWluQXhpcyA9IHJlc29sdmVBeGlzKGdldEZsZXhEaXJlY3Rpb24obm9kZSksIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGNyb3NzQXhpcyA9IGdldENyb3NzRmxleERpcmVjdGlvbihtYWluQXhpcywgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gcmVzb2x2ZWRSb3dBeGlzID0gcmVzb2x2ZUF4aXMoQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVywgZGlyZWN0aW9uKTtcblxuICAgIC8vIEhhbmRsZSB3aWR0aCBhbmQgaGVpZ2h0IHN0eWxlIGF0dHJpYnV0ZXNcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgbWFpbkF4aXMpO1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gU2V0IHRoZSByZXNvbHZlZCByZXNvbHV0aW9uIGluIHRoZSBub2RlJ3MgbGF5b3V0XG4gICAgbm9kZS5sYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgLy8gVGhlIHBvc2l0aW9uIGlzIHNldCBieSB0aGUgcGFyZW50LCBidXQgd2UgbmVlZCB0byBjb21wbGV0ZSBpdCB3aXRoIGFcbiAgICAvLyBkZWx0YSBjb21wb3NlZCBvZiB0aGUgbWFyZ2luIGFuZCBsZWZ0L3RvcC9yaWdodC9ib3R0b21cbiAgICBub2RlLmxheW91dFtsZWFkaW5nW21haW5BeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbbWFpbkF4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBtYWluQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBtYWluQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1tjcm9zc0F4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW2Nyb3NzQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgLy8gSW5saW5lIGltbXV0YWJsZSB2YWx1ZXMgZnJvbSB0aGUgdGFyZ2V0IG5vZGUgdG8gYXZvaWQgZXhjZXNzaXZlIG1ldGhvZFxuICAgIC8vIGludm9jYXRpb25zIGR1cmluZyB0aGUgbGF5b3V0IGNhbGN1bGF0aW9uLlxuICAgIHZhci8qaW50Ki8gY2hpbGRDb3VudCA9IG5vZGUuY2hpbGRyZW4ubGVuZ3RoO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93ID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcblxuICAgIGlmIChpc01lYXN1cmVEZWZpbmVkKG5vZGUpKSB7XG4gICAgICB2YXIvKmJvb2wqLyBpc1Jlc29sdmVkUm93RGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0pO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gd2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5zdHlsZS53aWR0aDtcbiAgICAgIH0gZWxzZSBpZiAoaXNSZXNvbHZlZFJvd0RpbURlZmluZWQpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG4gICAgICB9XG4gICAgICB3aWR0aCAtPSBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuXG4gICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZ2l2ZSBhIGRpbWVuc2lvbiBmb3IgdGhlIHRleHQgaWYgd2UgaGF2ZW4ndCBnb3QgYW55XG4gICAgICAvLyBmb3IgaXQgY29tcHV0ZWQgeWV0LiBJdCBjYW4gZWl0aGVyIGJlIGZyb20gdGhlIHN0eWxlIGF0dHJpYnV0ZSBvciBiZWNhdXNlXG4gICAgICAvLyB0aGUgZWxlbWVudCBpcyBmbGV4aWJsZS5cbiAgICAgIHZhci8qYm9vbCovIGlzUm93VW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpICYmICFpc1Jlc29sdmVkUm93RGltRGVmaW5lZDtcbiAgICAgIHZhci8qYm9vbCovIGlzQ29sdW1uVW5kZWZpbmVkID0gIWlzRGltRGVmaW5lZChub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKSAmJlxuICAgICAgICBpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl1dKTtcblxuICAgICAgLy8gTGV0J3Mgbm90IG1lYXN1cmUgdGhlIHRleHQgaWYgd2UgYWxyZWFkeSBrbm93IGJvdGggZGltZW5zaW9uc1xuICAgICAgaWYgKGlzUm93VW5kZWZpbmVkIHx8IGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgIHZhci8qY3NzX2RpbV90Ki8gbWVhc3VyZURpbSA9IG5vZGUuc3R5bGUubWVhc3VyZShcbiAgICAgICAgICAvKihjKSFub2RlLT5jb250ZXh0LCovXG4gICAgICAgICAgLyooamF2YSkhbGF5b3V0Q29udGV4dC5tZWFzdXJlT3V0cHV0LCovXG4gICAgICAgICAgd2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGlzUm93VW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBtZWFzdXJlRGltLndpZHRoICtcbiAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQ29sdW1uVW5kZWZpbmVkKSB7XG4gICAgICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbWVhc3VyZURpbS5oZWlnaHQgK1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChjaGlsZENvdW50ID09PSAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBpc05vZGVGbGV4V3JhcCA9IGlzRmxleFdyYXAobm9kZSk7XG5cbiAgICB2YXIvKmNzc19qdXN0aWZ5X3QqLyBqdXN0aWZ5Q29udGVudCA9IGdldEp1c3RpZnlDb250ZW50KG5vZGUpO1xuXG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbiA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcyA9IGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbiA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIG1haW5BeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICB2YXIvKmJvb2wqLyBpc01haW5EaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc0Nyb3NzRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzTWFpblJvd0RpcmVjdGlvbiA9IGlzUm93RGlyZWN0aW9uKG1haW5BeGlzKTtcblxuICAgIHZhci8qaW50Ki8gaTtcbiAgICB2YXIvKmludCovIGlpO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjaGlsZDtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gYXhpcztcblxuICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IG51bGw7XG5cbiAgICB2YXIvKmZsb2F0Ki8gZGVmaW5lZE1haW5EaW0gPSBDU1NfVU5ERUZJTkVEO1xuICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBkZWZpbmVkTWFpbkRpbSA9IG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dIC0gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluO1xuICAgIH1cblxuICAgIC8vIFdlIHdhbnQgdG8gZXhlY3V0ZSB0aGUgbmV4dCB0d28gbG9vcHMgb25lIHBlciBsaW5lIHdpdGggZmxleC13cmFwXG4gICAgdmFyLyppbnQqLyBzdGFydExpbmUgPSAwO1xuICAgIHZhci8qaW50Ki8gZW5kTGluZSA9IDA7XG4gICAgLy8gdmFyLyppbnQqLyBuZXh0T2Zmc2V0ID0gMDtcbiAgICB2YXIvKmludCovIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgIC8vIFdlIGFnZ3JlZ2F0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGUgY29udGFpbmVyIGluIHRob3NlIHR3byB2YXJpYWJsZXNcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNDcm9zc0RpbSA9IDA7XG4gICAgdmFyLypmbG9hdCovIGxpbmVzTWFpbkRpbSA9IDA7XG4gICAgdmFyLyppbnQqLyBsaW5lc0NvdW50ID0gMDtcbiAgICB3aGlsZSAoZW5kTGluZSA8IGNoaWxkQ291bnQpIHtcbiAgICAgIC8vIDxMb29wIEE+IExheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4gYW5kIGNvdW50IGNoaWxkcmVuIGJ5IHR5cGVcblxuICAgICAgLy8gbWFpbkNvbnRlbnREaW0gaXMgYWNjdW11bGF0aW9uIG9mIHRoZSBkaW1lbnNpb25zIGFuZCBtYXJnaW4gb2YgYWxsIHRoZVxuICAgICAgLy8gbm9uIGZsZXhpYmxlIGNoaWxkcmVuLiBUaGlzIHdpbGwgYmUgdXNlZCBpbiBvcmRlciB0byBlaXRoZXIgc2V0IHRoZVxuICAgICAgLy8gZGltZW5zaW9ucyBvZiB0aGUgbm9kZSBpZiBub25lIGFscmVhZHkgZXhpc3QsIG9yIHRvIGNvbXB1dGUgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2UgbGVmdCBmb3IgdGhlIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgdmFyLypmbG9hdCovIG1haW5Db250ZW50RGltID0gMDtcblxuICAgICAgLy8gVGhlcmUgYXJlIHRocmVlIGtpbmQgb2YgY2hpbGRyZW4sIG5vbiBmbGV4aWJsZSwgZmxleGlibGUgYW5kIGFic29sdXRlLlxuICAgICAgLy8gV2UgbmVlZCB0byBrbm93IGhvdyBtYW55IHRoZXJlIGFyZSBpbiBvcmRlciB0byBkaXN0cmlidXRlIHRoZSBzcGFjZS5cbiAgICAgIHZhci8qaW50Ki8gZmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyB0b3RhbEZsZXhpYmxlID0gMDtcbiAgICAgIHZhci8qaW50Ki8gbm9uRmxleGlibGVDaGlsZHJlbkNvdW50ID0gMDtcblxuICAgICAgLy8gVXNlIHRoZSBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIG1haW4gYXhpcyBmb3IgYXMgbG9uZ1xuICAgICAgLy8gYXMgdGhleSBhcmUgdXNpbmcgYSBzaW1wbGUgc3RhY2tpbmcgYmVoYXZpb3VyLiBDaGlsZHJlbiB0aGF0IGFyZVxuICAgICAgLy8gaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW5cbiAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja01haW4gPVxuICAgICAgICAgIChpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICghaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfQ0VOVEVSKTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4TWFpbiA9IChpc1NpbXBsZVN0YWNrTWFpbiA/IGNoaWxkQ291bnQgOiBzdGFydExpbmUpO1xuXG4gICAgICAvLyBVc2UgdGhlIGluaXRpYWwgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBjcm9zcyBheGlzIGZvclxuICAgICAgLy8gYXMgbG9uZyBhcyB0aGV5IGFyZSByZWxhdGl2ZWx5IHBvc2l0aW9uZWQgd2l0aCBhbGlnbm1lbnQgU1RSRVRDSCBvclxuICAgICAgLy8gRkxFWF9TVEFSVC4gQ2hpbGRyZW4gdGhhdCBhcmUgaW1tZWRpYXRlbHkgc3RhY2tlZCBpbiB0aGUgaW5pdGlhbCBsb29wXG4gICAgICAvLyB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluIGluIDxMb29wIEQ+LlxuICAgICAgdmFyLypib29sKi8gaXNTaW1wbGVTdGFja0Nyb3NzID0gdHJ1ZTtcbiAgICAgIHZhci8qaW50Ki8gZmlyc3RDb21wbGV4Q3Jvc3MgPSBjaGlsZENvdW50O1xuXG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkRpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyTWFpbjtcbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbSA9IDA7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYXhXaWR0aDtcbiAgICAgIGZvciAoaSA9IHN0YXJ0TGluZTsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG4gICAgICAgIGNoaWxkLmxpbmVJbmRleCA9IGxpbmVzQ291bnQ7XG5cbiAgICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcblxuICAgICAgICAvLyBQcmUtZmlsbCBjcm9zcyBheGlzIGRpbWVuc2lvbnMgd2hlbiB0aGUgY2hpbGQgaXMgdXNpbmcgc3RyZXRjaCBiZWZvcmVcbiAgICAgICAgLy8gd2UgY2FsbCB0aGUgcmVjdXJzaXZlIGxheW91dCBwYXNzXG4gICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIICYmXG4gICAgICAgICAgICBnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgJiZcbiAgICAgICAgICAgIGlzQ3Jvc3NEaW1EZWZpbmVkICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBjcm9zc0F4aXMpKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFKSB7XG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGFic29sdXRlbHkgcG9zaXRpb25lZCBjaGlsZHJlblxuICAgICAgICAgIC8vIHNvIHRoYXQgd2UgY2FuIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0QWJzb2x1dGVDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvciB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGhcbiAgICAgICAgICAvLyBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICAgICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIHRyYWlsaW5nW2F4aXNdKSksXG4gICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgYXhpcylcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIvKmZsb2F0Ki8gbmV4dENvbnRlbnREaW0gPSAwO1xuXG4gICAgICAgIC8vIEl0IG9ubHkgbWFrZXMgc2Vuc2UgdG8gY29uc2lkZXIgYSBjaGlsZCBmbGV4aWJsZSBpZiB3ZSBoYXZlIGEgY29tcHV0ZWRcbiAgICAgICAgLy8gZGltZW5zaW9uIGZvciB0aGUgbm9kZS5cbiAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQgJiYgaXNGbGV4KGNoaWxkKSkge1xuICAgICAgICAgIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgIHRvdGFsRmxleGlibGUgKz0gY2hpbGQuc3R5bGUuZmxleDtcblxuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBmbGV4aWJsZSBjaGlsZHJlbiBzbyB0aGF0IHdlIGNhblxuICAgICAgICAgIC8vIGVmZmljaWVudGx5IHRyYXZlcnNlIHRoZW0gbGF0ZXIuXG4gICAgICAgICAgaWYgKGZpcnN0RmxleENoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjaGlsZDtcblxuICAgICAgICAgIC8vIEV2ZW4gaWYgd2UgZG9uJ3Qga25vdyBpdHMgZXhhY3Qgc2l6ZSB5ZXQsIHdlIGFscmVhZHkga25vdyB0aGUgcGFkZGluZyxcbiAgICAgICAgICAvLyBib3JkZXIgYW5kIG1hcmdpbi4gV2UnbGwgdXNlIHRoaXMgcGFydGlhbCBpbmZvcm1hdGlvbiwgd2hpY2ggcmVwcmVzZW50c1xuICAgICAgICAgIC8vIHRoZSBzbWFsbGVzdCBwb3NzaWJsZSBzaXplIGZvciB0aGUgY2hpbGQsIHRvIGNvbXB1dGUgdGhlIHJlbWFpbmluZ1xuICAgICAgICAgIC8vIGF2YWlsYWJsZSBzcGFjZS5cbiAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgbWFpbkF4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVGhpcyBpcyB0aGUgbWFpbiByZWN1cnNpdmUgY2FsbC4gV2UgbGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgICAgICBpZiAoYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9PT0gMCkge1xuICAgICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2NoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBYnNvbHV0ZSBwb3NpdGlvbmVkIGVsZW1lbnRzIGRvIG5vdCB0YWtlIHBhcnQgb2YgdGhlIGxheW91dCwgc28gd2VcbiAgICAgICAgICAvLyBkb24ndCB1c2UgdGhlbSB0byBjb21wdXRlIG1haW5Db250ZW50RGltXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgYW5kIG1hcmdpbiBvZiB0aGUgZWxlbWVudC5cbiAgICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBlbGVtZW50IHdlIGFyZSBhYm91dCB0byBhZGQgd291bGQgbWFrZSB1cyBnbyB0byB0aGUgbmV4dCBsaW5lXG4gICAgICAgIGlmIChpc05vZGVGbGV4V3JhcCAmJlxuICAgICAgICAgICAgaXNNYWluRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgbWFpbkNvbnRlbnREaW0gKyBuZXh0Q29udGVudERpbSA+IGRlZmluZWRNYWluRGltICYmXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG9ubHkgb25lIGVsZW1lbnQsIHRoZW4gaXQncyBiaWdnZXIgdGhhbiB0aGUgY29udGVudFxuICAgICAgICAgICAgLy8gYW5kIG5lZWRzIGl0cyBvd24gbGluZVxuICAgICAgICAgICAgaSAhPT0gc3RhcnRMaW5lKSB7XG4gICAgICAgICAgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50LS07XG4gICAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgbWFpbiBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8IGlzRmxleChjaGlsZCkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja01haW4gPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhNYWluID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBjcm9zcyBheGlzIGZvciB0aGUgY3VycmVudCBsaW5lIGFzXG4gICAgICAgIC8vIHdlIGZvdW5kIGEgbm9uLXRyaXZpYWwgY2hpbGQuIFRoZSByZW1haW5pbmcgY2hpbGRyZW4gd2lsbCBiZSBsYWlkIG91dFxuICAgICAgICAvLyBpbiA8TG9vcCBEPi5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcyAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fFxuICAgICAgICAgICAgICAgIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9TVFJFVENIICYmIGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgICAgICAgaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpKSB7XG4gICAgICAgICAgaXNTaW1wbGVTdGFja0Nyb3NzID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4Q3Jvc3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tNYWluKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYWluRGltICs9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzU2ltcGxlU3RhY2tDcm9zcykge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAwO1xuICAgICAgICBtYWluQ29udGVudERpbSArPSBuZXh0Q29udGVudERpbTtcbiAgICAgICAgZW5kTGluZSA9IGkgKyAxO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBCPiBMYXlvdXQgZmxleGlibGUgY2hpbGRyZW4gYW5kIGFsbG9jYXRlIGVtcHR5IHNwYWNlXG5cbiAgICAgIC8vIEluIG9yZGVyIHRvIHBvc2l0aW9uIHRoZSBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzLCB3ZSBoYXZlIHR3b1xuICAgICAgLy8gY29udHJvbHMuIFRoZSBzcGFjZSBiZXR3ZWVuIHRoZSBiZWdpbm5pbmcgYW5kIHRoZSBmaXJzdCBlbGVtZW50XG4gICAgICAvLyBhbmQgdGhlIHNwYWNlIGJldHdlZW4gZWFjaCB0d28gZWxlbWVudHMuXG4gICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ01haW5EaW0gPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGJldHdlZW5NYWluRGltID0gMDtcblxuICAgICAgLy8gVGhlIHJlbWFpbmluZyBhdmFpbGFibGUgc3BhY2UgdGhhdCBuZWVkcyB0byBiZSBhbGxvY2F0ZWRcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdNYWluRGltID0gMDtcbiAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBkZWZpbmVkTWFpbkRpbSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKG1haW5Db250ZW50RGltLCAwKSAtIG1haW5Db250ZW50RGltO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB0aGVyZSBhcmUgZmxleGlibGUgY2hpbGRyZW4gaW4gdGhlIG1peCwgdGhleSBhcmUgZ29pbmcgdG8gZmlsbCB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZVxuICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCAhPT0gMCkge1xuICAgICAgICB2YXIvKmZsb2F0Ki8gZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG4gICAgICAgIHZhci8qZmxvYXQqLyBiYXNlTWFpbkRpbTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJvdW5kTWFpbkRpbTtcblxuICAgICAgICAvLyBJZiB0aGUgZmxleCBzaGFyZSBvZiByZW1haW5pbmcgc3BhY2UgZG9lc24ndCBtZWV0IG1pbi9tYXggYm91bmRzLFxuICAgICAgICAvLyByZW1vdmUgdGhpcyBjaGlsZCBmcm9tIGZsZXggY2FsY3VsYXRpb25zLlxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgYmFzZU1haW5EaW0gPSBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgYm91bmRNYWluRGltID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLCBiYXNlTWFpbkRpbSk7XG5cbiAgICAgICAgICBpZiAoYmFzZU1haW5EaW0gIT09IGJvdW5kTWFpbkRpbSkge1xuICAgICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSAtPSBib3VuZE1haW5EaW07XG4gICAgICAgICAgICB0b3RhbEZsZXhpYmxlIC09IGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICB9XG4gICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuXG4gICAgICAgIC8vIFRoZSBub24gZmxleGlibGUgY2hpbGRyZW4gY2FuIG92ZXJmbG93IHRoZSBjb250YWluZXIsIGluIHRoaXMgY2FzZVxuICAgICAgICAvLyB3ZSBzaG91bGQganVzdCBhc3N1bWUgdGhhdCB0aGVyZSBpcyBubyBzcGFjZSBhdmFpbGFibGUuXG4gICAgICAgIGlmIChmbGV4aWJsZU1haW5EaW0gPCAwKSB7XG4gICAgICAgICAgZmxleGlibGVNYWluRGltID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGtub3cgdGhlIGZpbmFsIHNpemUgb2YgdGhlIGVsZW1lbnQgaW4gdGhlIG1haW5cbiAgICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcyxcbiAgICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9IGVsc2UgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcykgLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSByZWN1cnNpdmVseSBjYWxsIHRoZSBsYXlvdXQgYWxnb3JpdGhtIGZvciB0aGlzIGNoaWxkXG4gICAgICAgICAgbGF5b3V0Tm9kZSgvKihqYXZhKSFsYXlvdXRDb250ZXh0LCAqL2N1cnJlbnRGbGV4Q2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgY2hpbGQgPSBjdXJyZW50RmxleENoaWxkO1xuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgLy8gV2UgdXNlIGp1c3RpZnlDb250ZW50IHRvIGZpZ3VyZSBvdXQgaG93IHRvIGFsbG9jYXRlIHRoZSByZW1haW5pbmdcbiAgICAgIC8vIHNwYWNlIGF2YWlsYWJsZVxuICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCAhPT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkge1xuICAgICAgICBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0NFTlRFUikge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIDI7XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOKSB7XG4gICAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGZtYXhmKHJlbWFpbmluZ01haW5EaW0sIDApO1xuICAgICAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxICE9PSAwKSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0FST1VORCkge1xuICAgICAgICAgIC8vIFNwYWNlIG9uIHRoZSBlZGdlcyBpcyBoYWxmIG9mIHRoZSBzcGFjZSBiZXR3ZWVuIGVsZW1lbnRzXG4gICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQpO1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gYmV0d2Vlbk1haW5EaW0gLyAyO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEM+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMgYW5kIGNvbXB1dGUgZGltZW5zaW9uc1xuXG4gICAgICAvLyBBdCB0aGlzIHBvaW50LCBhbGwgdGhlIGNoaWxkcmVuIGhhdmUgdGhlaXIgZGltZW5zaW9ucyBzZXQuIFdlIG5lZWQgdG9cbiAgICAgIC8vIGZpbmQgdGhlaXIgcG9zaXRpb24uIEluIG9yZGVyIHRvIGRvIHRoYXQsIHdlIGFjY3VtdWxhdGUgZGF0YSBpblxuICAgICAgLy8gdmFyaWFibGVzIHRoYXQgYXJlIGFsc28gdXNlZnVsIHRvIGNvbXB1dGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlXG4gICAgICAvLyBjb250YWluZXIhXG4gICAgICBtYWluRGltICs9IGxlYWRpbmdNYWluRGltO1xuXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhNYWluOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlIGFuZCBoYXMgbGVmdC90b3AgYmVpbmdcbiAgICAgICAgICAvLyBkZWZpbmVkLCB3ZSBvdmVycmlkZSB0aGUgcG9zaXRpb24gdG8gd2hhdGV2ZXIgdGhlIHVzZXIgc2FpZFxuICAgICAgICAgIC8vIChhbmQgbWFyZ2luL2JvcmRlcikuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbbWFpbkF4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGNoaWxkIGlzIHBvc2l0aW9uIGFic29sdXRlICh3aXRob3V0IHRvcC9sZWZ0KSBvciByZWxhdGl2ZSxcbiAgICAgICAgICAvLyB3ZSBwdXQgaXQgYXQgdGhlIGN1cnJlbnQgYWNjdW11bGF0ZWQgb2Zmc2V0LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIE5vdyB0aGF0IHdlIHBsYWNlZCB0aGUgZWxlbWVudCwgd2UgbmVlZCB0byB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuICAgICAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBkbyB0aGF0IGZvciByZWxhdGl2ZSBlbGVtZW50cy4gQWJzb2x1dGUgZWxlbWVudHNcbiAgICAgICAgICAvLyBkbyBub3QgdGFrZSBwYXJ0IGluIHRoYXQgcGhhc2UuXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLy8gVGhlIG1haW4gZGltZW5zaW9uIGlzIHRoZSBzdW0gb2YgYWxsIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gcGx1c1xuICAgICAgICAgICAgLy8gdGhlIHNwYWNpbmcuXG4gICAgICAgICAgICBtYWluRGltICs9IGJldHdlZW5NYWluRGltICsgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgICAgLy8gVGhlIGNyb3NzIGRpbWVuc2lvbiBpcyB0aGUgbWF4IG9mIHRoZSBlbGVtZW50cyBkaW1lbnNpb24gc2luY2UgdGhlcmVcbiAgICAgICAgICAgIC8vIGNhbiBvbmx5IGJlIG9uZSBlbGVtZW50IGluIHRoYXQgY3Jvc3MgZGltZW5zaW9uLlxuICAgICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLypmbG9hdCovIGNvbnRhaW5lckNyb3NzQXhpcyA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgY29udGFpbmVyQ3Jvc3NBeGlzID0gZm1heGYoXG4gICAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBjcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgRD4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleENyb3NzOyBpIDwgZW5kTGluZTsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX0FCU09MVVRFICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBhYnNvbHV0ZWx5IHBvc2l0aW9ubmVkIGFuZCBoYXMgYVxuICAgICAgICAgIC8vIHRvcC9sZWZ0L2JvdHRvbS9yaWdodCBiZWluZyBzZXQsIHdlIG92ZXJyaWRlIGFsbCB0aGUgcHJldmlvdXNseVxuICAgICAgICAgIC8vIGNvbXB1dGVkIHBvc2l0aW9ucyB0byBzZXQgaXQgY29ycmVjdGx5LlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGNyb3NzQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nQ3Jvc3NEaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICAgICAgLy8gRm9yIGEgcmVsYXRpdmUgY2hpbGRyZW4sIHdlJ3JlIGVpdGhlciB1c2luZyBhbGlnbkl0ZW1zIChwYXJlbnQpIG9yXG4gICAgICAgICAgLy8gYWxpZ25TZWxmIChjaGlsZCkgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIHRoZSBwb3NpdGlvbiBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAgICAgICAgIC8vIFRoaXMgdmFyaWFibGUgaXMgaW50ZW50aW9uYWxseSByZS1kZWZpbmVkIGFzIHRoZSBjb2RlIGlzIHRyYW5zcGlsZWQgdG8gYSBibG9jayBzY29wZSBsYW5ndWFnZVxuICAgICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICAgIC8vIFlvdSBjYW4gb25seSBzdHJldGNoIGlmIHRoZSBkaW1lbnNpb24gaGFzIG5vdCBhbHJlYWR5IGJlZW4gc2V0XG4gICAgICAgICAgICAgIC8vIHByZXZpb3VzbHkuXG4gICAgICAgICAgICAgIGlmIChpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgICAgLy8gVGhlIHJlbWFpbmluZyBzcGFjZSBiZXR3ZWVuIHRoZSBwYXJlbnQgZGltZW5zaW9ucytwYWRkaW5nIGFuZCBjaGlsZFxuICAgICAgICAgICAgICAvLyBkaW1lbnNpb25zK21hcmdpbi5cbiAgICAgICAgICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0Nyb3NzRGltID0gY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcblxuICAgICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltIC8gMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy8gQ1NTX0FMSUdOX0ZMRVhfRU5EXG4gICAgICAgICAgICAgICAgbGVhZGluZ0Nyb3NzRGltICs9IHJlbWFpbmluZ0Nyb3NzRGltO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIGFwcGx5IHRoZSBwb3NpdGlvblxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gKz0gbGluZXNDcm9zc0RpbSArIGxlYWRpbmdDcm9zc0RpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsaW5lc0Nyb3NzRGltICs9IGNyb3NzRGltO1xuICAgICAgbGluZXNNYWluRGltID0gZm1heGYobGluZXNNYWluRGltLCBtYWluRGltKTtcbiAgICAgIGxpbmVzQ291bnQgKz0gMTtcbiAgICAgIHN0YXJ0TGluZSA9IGVuZExpbmU7XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRT5cbiAgICAvL1xuICAgIC8vIE5vdGUocHJlbmF1eCk6IE1vcmUgdGhhbiBvbmUgbGluZSwgd2UgbmVlZCB0byBsYXlvdXQgdGhlIGNyb3NzQXhpc1xuICAgIC8vIGFjY29yZGluZyB0byBhbGlnbkNvbnRlbnQuXG4gICAgLy9cbiAgICAvLyBOb3RlIHRoYXQgd2UgY291bGQgcHJvYmFibHkgcmVtb3ZlIDxMb29wIEQ+IGFuZCBoYW5kbGUgdGhlIG9uZSBsaW5lIGNhc2VcbiAgICAvLyBoZXJlIHRvbywgYnV0IGZvciB0aGUgbW9tZW50IHRoaXMgaXMgc2FmZXIgc2luY2UgaXQgd29uJ3QgaW50ZXJmZXJlIHdpdGhcbiAgICAvLyBwcmV2aW91c2x5IHdvcmtpbmcgY29kZS5cbiAgICAvL1xuICAgIC8vIFNlZSBzcGVjczpcbiAgICAvLyBodHRwOi8vd3d3LnczLm9yZy9UUi8yMDEyL0NSLWNzczMtZmxleGJveC0yMDEyMDkxOC8jbGF5b3V0LWFsZ29yaXRobVxuICAgIC8vIHNlY3Rpb24gOS40XG4gICAgLy9cbiAgICBpZiAobGluZXNDb3VudCA+IDEgJiYgaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIHZhci8qZmxvYXQqLyBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzO1xuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ0FsaWduQ29udGVudERpbSA9IG5vZGVDcm9zc0F4aXNJbm5lclNpemUgLSBsaW5lc0Nyb3NzRGltO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW1MZWFkID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBjdXJyZW50TGVhZCA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnQgPSBnZXRBbGlnbkNvbnRlbnQobm9kZSk7XG4gICAgICBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgY3VycmVudExlYWQgKz0gcmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICBpZiAobm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA+IGxpbmVzQ3Jvc3NEaW0pIHtcbiAgICAgICAgICBjcm9zc0RpbUxlYWQgPSAocmVtYWluaW5nQWxpZ25Db250ZW50RGltIC8gbGluZXNDb3VudCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyLyppbnQqLyBlbmRJbmRleCA9IDA7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbGluZXNDb3VudDsgKytpKSB7XG4gICAgICAgIHZhci8qaW50Ki8gc3RhcnRJbmRleCA9IGVuZEluZGV4O1xuXG4gICAgICAgIC8vIGNvbXB1dGUgdGhlIGxpbmUncyBoZWlnaHQgYW5kIGZpbmQgdGhlIGVuZEluZGV4XG4gICAgICAgIHZhci8qZmxvYXQqLyBsaW5lSGVpZ2h0ID0gMDtcbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgY2hpbGRDb3VudDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjaGlsZC5saW5lSW5kZXggIT09IGkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICBsaW5lSGVpZ2h0ID0gZm1heGYoXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQsXG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gKyBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbmRJbmRleCA9IGlpO1xuICAgICAgICBsaW5lSGVpZ2h0ICs9IGNyb3NzRGltTGVhZDtcblxuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBlbmRJbmRleDsgKytpaSkge1xuICAgICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpaV07XG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudEFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG4gICAgICAgICAgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgbGluZUhlaWdodCAtIGdldFRyYWlsaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpIC0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgdmFyLypmbG9hdCovIGNoaWxkSGVpZ2h0ID0gY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXTtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIChsaW5lSGVpZ2h0IC0gY2hpbGRIZWlnaHQpIC8gMjtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgICAvLyBUT0RPKHByZW5hdXgpOiBDb3JyZWN0bHkgc2V0IHRoZSBoZWlnaHQgb2YgaXRlbXMgd2l0aCB1bmRlZmluZWRcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgIChhdXRvKSBjcm9zc0F4aXMgZGltZW5zaW9uLlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRMZWFkICs9IGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gbmVlZHNNYWluVHJhaWxpbmdQb3MgPSBmYWxzZTtcbiAgICB2YXIvKmJvb2wqLyBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSBmYWxzZTtcblxuICAgIC8vIElmIHRoZSB1c2VyIGRpZG4ndCBzcGVjaWZ5IGEgd2lkdGggb3IgaGVpZ2h0LCBhbmQgaXQgaGFzIG5vdCBiZWVuIHNldFxuICAgIC8vIGJ5IHRoZSBjb250YWluZXIsIHRoZW4gd2Ugc2V0IGl0IHZpYSB0aGUgY2hpbGRyZW4uXG4gICAgaWYgKCFpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBXZSdyZSBtaXNzaW5nIHRoZSBsYXN0IHBhZGRpbmcgYXQgdGhpcyBwb2ludCB0byBnZXQgdGhlIGZpbmFsXG4gICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICBib3VuZEF4aXMobm9kZSwgbWFpbkF4aXMsIGxpbmVzTWFpbkRpbSArIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcykpLFxuICAgICAgICAvLyBXZSBjYW4gbmV2ZXIgYXNzaWduIGEgd2lkdGggc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJzXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpblxuICAgICAgKTtcblxuICAgICAgaWYgKG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gRm9yIHRoZSBjcm9zcyBkaW0sIHdlIGFkZCBib3RoIHNpZGVzIGF0IHRoZSBlbmQgYmVjYXVzZSB0aGUgdmFsdWVcbiAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICBib3VuZEF4aXMobm9kZSwgY3Jvc3NBeGlzLCBsaW5lc0Nyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3NcbiAgICAgICk7XG5cbiAgICAgIGlmIChjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFKSB7XG4gICAgICAgIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRj4gU2V0IHRyYWlsaW5nIHBvc2l0aW9uIGlmIG5lY2Vzc2FyeVxuICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1BvcyB8fCBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChuZWVkc01haW5UcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZWVkc0Nyb3NzVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gPExvb3AgRz4gQ2FsY3VsYXRlIGRpbWVuc2lvbnMgZm9yIGFic29sdXRlbHkgcG9zaXRpb25lZCBlbGVtZW50c1xuICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gZmlyc3RBYnNvbHV0ZUNoaWxkO1xuICAgIHdoaWxlIChjdXJyZW50QWJzb2x1dGVDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yXG4gICAgICAvLyB0aGUgYXhpcyBhcmUgZGVmaW5lZCAoZWl0aGVyIGJvdGggbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgZm9yIChpaSA9IDA7IGlpIDwgMjsgaWkrKykge1xuICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuXG4gICAgICAgIGlmICghaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2F4aXNdXSkgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICBpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICBnZXRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgLVxuICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pXG4gICAgICAgICAgICApLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgICFpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2xlYWRpbmdbYXhpc11dID1cbiAgICAgICAgICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZDtcbiAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsYXlvdXROb2RlKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pIHtcbiAgICBub2RlLnNob3VsZFVwZGF0ZSA9IHRydWU7XG5cbiAgICB2YXIgZGlyZWN0aW9uID0gbm9kZS5zdHlsZS5kaXJlY3Rpb24gfHwgQ1NTX0RJUkVDVElPTl9MVFI7XG4gICAgdmFyIHNraXBMYXlvdXQgPVxuICAgICAgIW5vZGUuaXNEaXJ0eSAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID09PSBub2RlLmxheW91dC5oZWlnaHQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9PT0gbm9kZS5sYXlvdXQud2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9PT0gcGFyZW50TWF4V2lkdGggJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPT09IGRpcmVjdGlvbjtcblxuICAgIGlmIChza2lwTGF5b3V0KSB7XG4gICAgICBub2RlLmxheW91dC53aWR0aCA9IG5vZGUubGFzdExheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG5vZGUubGFzdExheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxheW91dC50b3AgPSBub2RlLmxhc3RMYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXlvdXQubGVmdCA9IG5vZGUubGFzdExheW91dC5sZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIW5vZGUubGFzdExheW91dCkge1xuICAgICAgICBub2RlLmxhc3RMYXlvdXQgPSB7fTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkSGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID0gcGFyZW50TWF4V2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuXG4gICAgICAvLyBSZXNldCBjaGlsZCBsYXlvdXRzXG4gICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgY2hpbGQubGF5b3V0LndpZHRoID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQuaGVpZ2h0ID0gdW5kZWZpbmVkO1xuICAgICAgICBjaGlsZC5sYXlvdXQudG9wID0gMDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmxlZnQgPSAwO1xuICAgICAgfSk7XG5cbiAgICAgIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCBwYXJlbnREaXJlY3Rpb24pO1xuXG4gICAgICBub2RlLmxhc3RMYXlvdXQud2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5oZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQudG9wID0gbm9kZS5sYXlvdXQudG9wO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmxlZnQgPSBub2RlLmxheW91dC5sZWZ0O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGF5b3V0Tm9kZUltcGw6IGxheW91dE5vZGVJbXBsLFxuICAgIGNvbXB1dGVMYXlvdXQ6IGxheW91dE5vZGUsXG4gICAgZmlsbE5vZGVzOiBmaWxsTm9kZXNcbiAgfTtcbn0pKCk7XG5cbi8vIFRoaXMgbW9kdWxlIGV4cG9ydCBpcyBvbmx5IHVzZWQgZm9yIHRoZSBwdXJwb3NlcyBvZiB1bml0IHRlc3RpbmcgdGhpcyBmaWxlLiBXaGVuXG4vLyB0aGUgbGlicmFyeSBpcyBwYWNrYWdlZCB0aGlzIGZpbGUgaXMgaW5jbHVkZWQgd2l0aGluIGNzcy1sYXlvdXQuanMgd2hpY2ggZm9ybXNcbi8vIHRoZSBwdWJsaWMgQVBJLlxuaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGNvbXB1dGVMYXlvdXQ7XG59XG5cblxuICByZXR1cm4gZnVuY3Rpb24obm9kZSkge1xuICAgIC8qZXNsaW50LWRpc2FibGUgKi9cbiAgICAvLyBkaXNhYmxpbmcgRVNMaW50IGJlY2F1c2UgdGhpcyBjb2RlIHJlbGllcyBvbiB0aGUgYWJvdmUgaW5jbHVkZVxuICAgIGNvbXB1dGVMYXlvdXQuZmlsbE5vZGVzKG5vZGUpO1xuICAgIGNvbXB1dGVMYXlvdXQuY29tcHV0ZUxheW91dChub2RlKTtcbiAgICAvKmVzbGludC1lbmFibGUgKi9cbiAgfTtcbn0pKTtcbiIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xubW9kdWxlLmV4cG9ydHMuVGlueUVtaXR0ZXIgPSBFO1xuIiwiaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2ltYWdlTWFuYWdlcic7XG5jb25zdCBFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMudGV4dHVyZSA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2Uoc3JjLCAodGV4dHVyZSwgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICB9XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXZlbnQuZW1pdCgndGV4dF9fbG9hZF9fZG9uZScpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2VDb25maWcoZm50VGV4dDogc3RyaW5nKSB7XG4gICAgZm50VGV4dCA9IGZudFRleHQuc3BsaXQoJ1xcclxcbicpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IGZudFRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS50cmltKCkuc3BsaXQoJyAnKSk7XG5cbiAgICBjb25zdCBjaGFyc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY2hhcnMnKTtcbiAgICBjb25zdCBjaGFyc0NvdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJzTGluZS5saW5lLCAnY291bnQnKTtcblxuICAgIGNvbnN0IGNvbW1vbkxpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY29tbW9uJyk7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjb21tb25MaW5lLmxpbmUsICdsaW5lSGVpZ2h0Jyk7XG5cbiAgICBjb25zdCBpbmZvTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdpbmZvJyk7XG4gICAgdGhpcy5mb250U2l6ZSA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoaW5mb0xpbmUubGluZSwgJ3NpemUnKTtcblxuICAgIC8vIOaOpeWNuCBrZXJuaW5nc1xuICAgIGNvbnN0IGtlcm5pbmdzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdrZXJuaW5ncycpO1xuICAgIGxldCBrZXJuaW5nc0NvdW50ID0gMDtcbiAgICBsZXQga2VybmluZ3NTdGFydCA9IC0xO1xuICAgIGlmIChrZXJuaW5nc0xpbmUubGluZSkge1xuICAgICAga2VybmluZ3NDb3VudCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoa2VybmluZ3NMaW5lLmxpbmUsICdjb3VudCcpO1xuICAgICAga2VybmluZ3NTdGFydCA9IGtlcm5pbmdzTGluZS5pbmRleCArIDE7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcnM6IENoYXJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDQ7IGkgPCA0ICsgY2hhcnNDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyVGV4dDogc3RyaW5nID0gbGluZXNbaV07XG4gICAgICBjb25zdCBsZXR0ZXI6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2lkJykpO1xuXG4gICAgICBjb25zdCBjOiBDaGFyRGF0YSA9IHtcbiAgICAgICAgeDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3gnKSxcbiAgICAgICAgeTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3knKSxcbiAgICAgICAgdzogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3dpZHRoJyksXG4gICAgICAgIGg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdoZWlnaHQnKSxcbiAgICAgICAgb2ZmWDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hvZmZzZXQnKSxcbiAgICAgICAgb2ZmWTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3lvZmZzZXQnKSxcbiAgICAgICAgeGFkdmFuY2U6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4YWR2YW5jZScpLFxuICAgICAgICBrZXJuaW5nOiB7fVxuICAgICAgfTtcbiAgICAgIGNoYXJzW2xldHRlcl0gPSBjO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIGtlcm5pbmdzXG4gICAgaWYgKGtlcm5pbmdzQ291bnQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBrZXJuaW5nc1N0YXJ0OyBpIDw9IGtlcm5pbmdzU3RhcnQgKyBrZXJuaW5nc0NvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcbiAgICAgICAgY29uc3QgZmlyc3Q6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnZmlyc3QnKSk7XG4gICAgICAgIGNvbnN0IHNlY29uZDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdzZWNvbmQnKSk7XG4gICAgICAgIGNvbnN0IGFtb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnYW1vdW50Jyk7XG5cbiAgICAgICAgaWYgKGNoYXJzW3NlY29uZF0pIHtcbiAgICAgICAgICBjaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJzO1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZDogc3RyaW5nW11bXSwgbGluZU5hbWUgPSAnJyk6IENvbmZpZ0xpbmVEYXRhIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGluZTogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBsZW4gPSBsaW5lc1BhcnNlZC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuXG4gICAgICBpZiAoaXRlbVswXSA9PT0gbGluZU5hbWUpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBsaW5lID0gaXRlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZSxcbiAgICAgIGluZGV4LFxuICAgIH07XG4gIH1cblxuICBnZXRDb25maWdCeUtleUluT25lTGluZShjb25maWdUZXh0OiBzdHJpbmdbXSB8IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtQ29uZmlnVGV4dExpc3QgPSBBcnJheS5pc0FycmF5KGNvbmZpZ1RleHQpID8gY29uZmlnVGV4dCA6IGNvbmZpZ1RleHQuc3BsaXQoJyAnKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gaXRlbUNvbmZpZ1RleHRMaXN0OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0ID0gaXRlbUNvbmZpZ1RleHRMaXN0W2ldO1xuICAgICAgaWYgKGtleSA9PT0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKDAsIGtleS5sZW5ndGgpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKGtleS5sZW5ndGggKyAxKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufVxuIiwiaW50ZXJmYWNlIERlYnVnSW5mb0l0ZW0ge1xuICBzdGFydDogbnVtYmVyO1xuICBpc0lubmVyOiBib29sZWFuO1xuICBlbmQ/OiBudW1iZXI7XG4gIGNvc3Q/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlYnVnSW5mbyB7XG4gIHB1YmxpYyBpbmZvOiB7IFtrZXk6IHN0cmluZ106IERlYnVnSW5mb0l0ZW0gfSA9IHt9O1xuICBwdWJsaWMgdG90YWxTdGFydDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvdGFsQ29zdDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBzdGFydChuYW1lOiBzdHJpbmcsIGlzSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLnRvdGFsU3RhcnQgPT09IDApIHtcbiAgICAgIHRoaXMudG90YWxTdGFydCA9IERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmZvW25hbWVdID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBpc0lubmVyLFxuICAgIH07XG4gIH1cblxuICBlbmQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaW5mb1tuYW1lXSkge1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmVuZCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uY29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLmluZm9bbmFtZV0uc3RhcnQ7XG4gICAgICB0aGlzLnRvdGFsQ29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLnRvdGFsU3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbmZvID0ge307XG4gICAgdGhpcy50b3RhbFN0YXJ0ID0gMDtcbiAgICB0aGlzLnRvdGFsQ29zdCA9IDA7XG4gIH1cblxuICBsb2cobmVlZElubmVyOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBsb2dJbmZvID0gJ0xheW91dCBkZWJ1ZyBpbmZvOiBcXG4nO1xuICAgIGxvZ0luZm8gKz0gT2JqZWN0LmtleXModGhpcy5pbmZvKS5yZWR1Y2UoKHN1bSwgY3VycikgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5mb1tjdXJyXS5pc0lubmVyICYmICFuZWVkSW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBgJHtjdXJyfTogJHt0aGlzLmluZm9bY3Vycl0uY29zdH1cXG5gO1xuICAgICAgcmV0dXJuIHN1bTtcbiAgICB9LCAnJyk7XG5cbiAgICBsb2dJbmZvICs9IGB0b3RhbENvc3Q6ICR7dGhpcy50b3RhbENvc3R9XFxuYDtcblxuICAgIHJldHVybiBsb2dJbmZvO1xuICB9XG59XG4iLCJpbXBvcnQgUG9vbCBmcm9tICcuL3Bvb2wnO1xuaW1wb3J0IHsgbm9uZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBmcm9tQ2FjaGU6IGJvb2xlYW4pID0+IHZvaWQ7XG5pbnRlcmZhY2UgSW1hZ2VDYWNoZSB7XG4gIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgbG9hZERvbmU6IGJvb2xlYW47XG4gIG9ubG9hZGNia3M6IENhbGxiYWNrW107XG4gIG9uZXJyb3JjYmtzOiBDYWxsYmFja1tdO1xufVxuXG5jbGFzcyBJbWFnZU1hbmFnZXIge1xuICBwcml2YXRlIGltZ1Bvb2wgPSBuZXcgUG9vbDxJbWFnZUNhY2hlPignaW1nUG9vbCcpO1xuICBcbiAgZ2V0UmVzKHNyYzogc3RyaW5nKTogSW1hZ2VDYWNoZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1nUG9vbC5nZXQoc3JjKTtcbiAgfVxuXG4gIGxvYWRJbWFnZVByb21pc2Uoc3JjOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9hZEltYWdlKHNyYywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZShzcmM6IHN0cmluZywgc3VjY2VzczogQ2FsbGJhY2sgPSBub25lLCBmYWlsOiBDYWxsYmFjayA9IG5vbmUpOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbCB7XG4gICAgaWYgKCFzcmMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLmdldFJlcyhzcmMpO1xuXG4gICAgLy8g5Zu+54mH5bey57uP6KKr5Yqg6L296L+H77yM55u05o6l6L+U5Zue5Zu+54mH5bm25LiU5omn6KGM5Zue6LCDXG4gICAgaWYgKGNhY2hlICYmIGNhY2hlLmxvYWREb25lKSB7XG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG4gICAgICBzdWNjZXNzKGltZywgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChjYWNoZSAmJiAhY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIC8vIOWbvueJh+ato+WcqOWKoOi9vei/h+eoi+S4re+8jOi/lOWbnuWbvueJh+W5tuS4lOetieW+heWbvueJh+WKoOi9veWujOaIkOaJp+ihjOWbnuiwg1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuXG4gICAgICBjYWNoZS5vbmxvYWRjYmtzLnB1c2goc3VjY2Vzcyk7XG4gICAgICBjYWNoZS5vbmVycm9yY2Jrcy5wdXNoKGZhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDliJvlu7rlm77niYfvvIzlsIblm57osIPlh73mlbDmjqjlhaXlm57osIPlh73mlbDmoIhcbiAgICAgIGltZyA9IGVudi5jcmVhdGVJbWFnZSgpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHtcbiAgICAgICAgaW1nLFxuICAgICAgICBsb2FkRG9uZTogZmFsc2UsXG4gICAgICAgIG9ubG9hZGNia3M6IFtzdWNjZXNzXSxcbiAgICAgICAgb25lcnJvcmNia3M6IFtmYWlsXSxcbiAgICAgIH1cbiAgICAgXG4gICAgICB0aGlzLmltZ1Bvb2wuc2V0KHNyYywgbmV3Q2FjaGUpO1xuXG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5sb2FkRG9uZSA9IHRydWU7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbWFnZU1hbmFnZXIoKTtcbiIsImNvbnN0IHBvb2xzOiBQb29sPGFueT5bXSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sPFQ+IHtcbiAgcHVibGljIG5hbWUgPSAncG9vbCdcbiAgcHVibGljIHBvb2w6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG5cbiAgY29uc3RydWN0b3IobmFtZSA9ICdwb29sJykge1xuICAgIGNvbnN0IGN1cnIgPSBwb29scy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmIChjdXJyKSB7XG4gICAgICByZXR1cm4gY3VycjtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuXG4gICAgcG9vbHMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldChrZXk6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLnBvb2xba2V5XTtcbiAgfVxuXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQpIHtcbiAgICB0aGlzLnBvb2xba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5wb29sID0ge307XG4gIH1cblxuICBnZXRMaXN0KCk6IFRbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5wb29sKTtcbiAgfVxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIHdpZHRoID0gMDtcbiAgcHVibGljIGhlaWdodCA9IDA7XG4gIHB1YmxpYyBsZWZ0ID0gMDtcbiAgcHVibGljIHJpZ2h0ID0gMDtcbiAgcHVibGljIHRvcCA9IDA7XG4gIHB1YmxpYyBib3R0b20gPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLnNldChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgc2V0KGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIHRoaXMucmlnaHQgPSB0aGlzLmxlZnQgKyB0aGlzLndpZHRoO1xuICAgIHRoaXMuYm90dG9tID0gdGhpcy50b3AgKyB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiDliKTmlq3kuKTkuKrnn6nlvaLmmK/lkKbnm7jkuqRcbiAgICog5Y6f55CG5Y+v6KeBOiBodHRwczovL3podWFubGFuLnpoaWh1LmNvbS9wLzI5NzA0MDY0XG4gICAqL1xuICBpbnRlcnNlY3RzKHJlY3Q6IFJlY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISh0aGlzLnJpZ2h0IDwgcmVjdC5sZWZ0IHx8IHJlY3QucmlnaHQgPCB0aGlzLmxlZnQgfHwgdGhpcy5ib3R0b20gPCByZWN0LnRvcCB8fCByZWN0LmJvdHRvbSA8IHRoaXMudG9wKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2VyIHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBzdGFydGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYW5pbWF0aW9uSWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgY2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJDYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBuZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJOZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG5cbiAgcHJpdmF0ZSBsYXN0VGltZSE6IG51bWJlcjtcblxuICBwcml2YXRlIHVwZGF0ZSA9ICgpID0+IHtcbiAgICBjb25zdCB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBkZWx0YVRpbWUgPSB0aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICB0aGlzLmxhc3RUaW1lID0gdGltZTtcbiAgICAvLyBjb25zb2xlLmxvZyhkdClcbiAgICAvLyDkvJjlhYjmiafooYzkuJrliqHnmoR0aWNrZXLlm57osIPvvIzlm6DkuLrmnInlj6/og73kvJrop6blj5FyZWZsb3dcbiAgICB0aGlzLmNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlubmVyQ2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoZGVsdGFUaW1lKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmlubmVyTmV4dENicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG4gICAgICB0aGlzLmlubmVyTmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm5leHRDYnMuZm9yRWFjaChjYiA9PiBjYihkZWx0YVRpbWUpKTtcblxuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICB9XG5cbiAgY2FuY2VsSWZOZWVkKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbklkKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jYnMuaW5kZXhPZihjYikgPT09IC0xKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lckNicy5wdXNoKGNiKSA6IHRoaXMuY2JzLnB1c2goY2IpO1xuICAgIH1cbiAgfVxuXG4gIG5leHQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lck5leHRDYnMucHVzaChjYikgOiB0aGlzLm5leHRDYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlSW5uZXIoKSB7XG4gICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gIH1cblxuICByZW1vdmUoY2I/OiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKGNiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY2JzID0gW107XG4gICAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiAodGhpcy5jYnMuaW5kZXhPZihjYikgPiAtMSB8fCB0aGlzLmlubmVyQ2JzLmluZGV4T2YoY2IpID4gLTEpKSB7XG4gICAgICBjb25zdCBsaXN0ID0gaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMgOiB0aGlzLmNicztcbiAgICAgIGxpc3Quc3BsaWNlKHRoaXMuY2JzLmluZGV4T2YoY2IpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2JzLmxlbmd0aCAmJiAhdGhpcy5pbm5lckNicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMubGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5hbmltYXRpb25JZCA9PT0gbnVsbCAmJiAodGhpcy5jYnMubGVuZ3RoIHx8IHRoaXMuaW5uZXJDYnMubGVuZ3RoKSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBmdW5jdGlvbiBub25lKCkgeyB9XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBUb3VjaE1zZyB7XG4gIHRvdWNoc3RhcnQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB0b3VjaGVuZD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG59XG5cbi8qKlxuICog5qC55o2u6Kem5pG45pe26ZW/5ZKM6Kem5pG45L2N572u5Y+Y5YyW5p2l5Yik5pat5piv5ZCm5bGe5LqO54K55Ye75LqL5Lu2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWNrKHRvdWNoTXNnOiBUb3VjaE1zZykge1xuICBjb25zdCBzdGFydCA9IHRvdWNoTXNnLnRvdWNoc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHRvdWNoTXNnLnRvdWNoZW5kO1xuXG4gIGlmICghc3RhcnRcbiAgICB8fCAhZW5kXG4gICAgfHwgIXN0YXJ0LnRpbWVTdGFtcFxuICAgIHx8ICFlbmQudGltZVN0YW1wXG4gICAgfHwgc3RhcnQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IHN0YXJ0LnBhZ2VZID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0UG9zWCA9IHN0YXJ0LnBhZ2VYO1xuICBjb25zdCBzdGFydFBvc1kgPSBzdGFydC5wYWdlWTtcblxuICBjb25zdCBlbmRQb3NYID0gZW5kLnBhZ2VYO1xuICBjb25zdCBlbmRQb3NZID0gZW5kLnBhZ2VZO1xuXG4gIGNvbnN0IHRvdWNoVGltZXMgPSBlbmQudGltZVN0YW1wIC0gc3RhcnQudGltZVN0YW1wO1xuXG4gIHJldHVybiAhIShNYXRoLmFicyhlbmRQb3NZIC0gc3RhcnRQb3NZKSA8IDMwXG4gICAgJiYgTWF0aC5hYnMoZW5kUG9zWCAtIHN0YXJ0UG9zWCkgPCAzMFxuICAgICYmIHRvdWNoVGltZXMgPCAzMDApO1xufVxuXG5leHBvcnQgZW51bSBTVEFURSB7XG4gIFVOSU5JVCA9ICdVTklOSVQnLFxuICBJTklURUQgPSAnSU5JVEVEJyxcbiAgUkVOREVSRUQgPSAnUkVOREVSRUQnLFxuICBDTEVBUiA9ICdDTEVBUicsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDYW52YXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4ICYmIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvdWNoQXJyYXkodG91Y2hlczogR2FtZVRvdWNoW10pIHtcbiAgcmV0dXJuIHRvdWNoZXMubWFwKHRvdWNoID0+ICh7XG4gICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcbiAgICBwYWdlWDogdG91Y2gucGFnZVgsXG4gICAgcGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG4gICAgY2xpZW50WTogdG91Y2guY2xpZW50WSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lVG91Y2hFdmVudChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpOiBlIGlzIEdhbWVUb3VjaEV2ZW50IHtcbiAgcmV0dXJuICd0b3VjaGVzJyBpbiBlO1xufVxuXG4vKipcbiAqIOWPluacgOWwj+WAvOWSjOacgOWkp+WAvOS5i+mXtOeahOWMuumXtOmZkOWumuWAvFxuICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciDpnIDopoHooqvlpITnkIbnmoTmlbDlrZdcbiAqIEBwYXJhbSB7bnVtYmVyfSBtaW4g5pyA5bCP5YC8XG4gKiBAcGFyYW0ge251bWJlcn0gbWF4IOacgOWkp+WAvFxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xhbXAobnVtYmVyOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG51bWJlciwgbWF4KSk7XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuLy8gY29tcG9uZW50c1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgRWxlbWVudCwgQnV0dG9uIH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IElMYXlvdXQsIElMYXlvdXRCb3ggfSBmcm9tICcuLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG5pbnRlcmZhY2UgQ29uc3RydWN0b3Ige1xuICBuZXcgKC4uLmFyZ3M6IGFueVtdKTogYW55O1xufVxuXG5pbnRlcmZhY2UgVHJlZU5vZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIGF0dHI6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGNoaWxkcmVuOiBUcmVlTm9kZVtdO1xufVxuXG5jb25zdCBjb25zdHJ1Y3Rvck1hcDogeyBba2V5OiBzdHJpbmddOiBDb25zdHJ1Y3RvciB9ID0ge1xuICB2aWV3OiBWaWV3LFxuICB0ZXh0OiBUZXh0LFxuICBpbWFnZTogSW1hZ2UsXG4gIHNjcm9sbHZpZXc6IFNjcm9sbFZpZXcsXG4gIGJpdG1hcHRleHQ6IEJpdE1hcFRleHQsXG4gIGNhbnZhczogQ2FudmFzLFxuICBidXR0b246IEJ1dHRvbixcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckNvbXBvbmVudChuYW1lOiBzdHJpbmcsIENvbnN0cnVjdG9yOiBDb25zdHJ1Y3Rvcikge1xuICBjb25zdHJ1Y3Rvck1hcFtuYW1lXSA9IENvbnN0cnVjdG9yO1xufVxuXG5mdW5jdGlvbiBpc1BlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgL1xcZCsoPzpcXC5cXGQrKT8lLy50ZXN0KGRhdGEpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UGVyY2VudChkYXRhOiBzdHJpbmcgfCBudW1iZXIsIHBhcmVudERhdGE6IG51bWJlcikge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdudW1iZXInIHx8IGRhdGEgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGNvbnN0IG1hdGNoRGF0YSA9IGRhdGEubWF0Y2goLyhcXGQrKD86XFwuXFxkKyk/KSUvKTtcbiAgaWYgKG1hdGNoRGF0YSAmJiBtYXRjaERhdGFbMV0pIHtcbiAgICByZXR1cm4gcGFyZW50RGF0YSAqIHBhcnNlRmxvYXQobWF0Y2hEYXRhWzFdKSAqIDAuMDE7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShub2RlOiBUcmVlTm9kZSwgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIHBhcmVudD86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgY29uc3QgQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvck1hcFtub2RlLm5hbWVdO1xuXG4gIGlmICghQ29uc3RydWN0b3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XSDkuI3mlK/mjIHnu4Tku7YgJHtub2RlLm5hbWV9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4gfHwgW107XG5cbiAgY29uc3QgYXR0ciA9IG5vZGUuYXR0ciB8fCB7fTtcbiAgY29uc3QgZGF0YXNldDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBpZCA9IGF0dHIuaWQgfHwgJyc7XG5cbiAgY29uc3QgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IE9iamVjdC5rZXlzKGF0dHIpLnJlZHVjZSgob2JqLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyW2tleV07XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBrZXk7XG5cbiAgICAgIGlmIChrZXkgPT09ICdpZCcpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gT2JqZWN0LmFzc2lnbihvYmouc3R5bGUgfHwge30sIHN0eWxlW2lkXSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBvYmouc3R5bGUgPSB2YWx1ZS5zcGxpdCgvXFxzKy8pLnJlZHVjZSgocmVzLCBvbmVDbGFzcykgPT4gT2JqZWN0LmFzc2lnbihyZXMsIHN0eWxlW29uZUNsYXNzXSksIG9iai5zdHlsZSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJpYnV0ZS5zdGFydHNXaXRoKCdkYXRhLScpKSB7XG4gICAgICAgIGNvbnN0IGRhdGFLZXkgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKDUpO1xuXG4gICAgICAgIGRhdGFzZXRbZGF0YUtleV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgb2JqLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4pO1xuXG4gIC8vIOeUqOS6juWQjue7reWFg+e0oOafpeivolxuICBhcmdzLmlkTmFtZSA9IGlkO1xuICAvLyBAdHMtaWdub3JlXG4gIHRoaXMuZWxlQ291bnQgKz0gMTtcbiAgLy8gQHRzLWlnbm9yZVxuICBhcmdzLmlkID0gdGhpcy5lbGVDb3VudDtcbiAgYXJncy5jbGFzc05hbWUgPSBhdHRyLmNsYXNzIHx8ICcnO1xuXG4gIGNvbnN0IHRoaXNTdHlsZSA9IGFyZ3Muc3R5bGU7XG4gIGlmICh0aGlzU3R5bGUpIHtcbiAgICBsZXQgcGFyZW50U3R5bGU7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50U3R5bGUgPSBwYXJlbnQuc3R5bGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFN0eWxlID0gZW52LmdldFJvb3RDYW52YXNTaXplKCk7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLndpZHRoKSkge1xuICAgICAgdGhpc1N0eWxlLndpZHRoID0gcGFyZW50U3R5bGUud2lkdGggPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUud2lkdGgsIHBhcmVudFN0eWxlLndpZHRoKSA6IDA7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLmhlaWdodCkpIHtcbiAgICAgIHRoaXNTdHlsZS5oZWlnaHQgPSBwYXJlbnRTdHlsZS5oZWlnaHQgPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0LCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXNTdHlsZS5vcGFjaXR5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnRTdHlsZS5vcGFjaXR5ICE9PSAxICYmIHR5cGVvZiBwYXJlbnRTdHlsZS5vcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSBwYXJlbnRTdHlsZS5vcGFjaXR5ICogdGhpc1N0eWxlLm9wYWNpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2coYXJncyk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIC8vIEB0cy1pZ25vcmVcbiAgZWxlbWVudC5yb290ID0gdGhpcztcbiAgZWxlbWVudC50YWdOYW1lID0gbm9kZS5uYW1lO1xuXG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkTm9kZTogVHJlZU5vZGUpID0+IHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgY2hpbGRFbGVtZW50ID0gY3JlYXRlLmNhbGwodGhpcywgY2hpbGROb2RlLCBzdHlsZSwgYXJncyk7XG5cbiAgICBpZiAoY2hpbGRFbGVtZW50KSB7XG4gICAgICBlbGVtZW50LmFkZChjaGlsZEVsZW1lbnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJDaGlsZHJlbihjaGlsZHJlbjogRWxlbWVudFtdLCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXIgPSB0cnVlKSB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgLy8gY2hpbGQuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgY2hpbGQuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNoaWxkLmluc2VydChjb250ZXh0LCBuZWVkUmVuZGVyKTtcblxuICAgIC8vIFNjcm9sbFZpZXfnmoTlrZDoioLngrnmuLLmn5PkuqTnu5lTY3JvbGxWaWV36Ieq5bex77yM5LiN5pSv5oyB5bWM5aWXU2Nyb2xsVmlld1xuICAgIHJldHVybiByZW5kZXJDaGlsZHJlbihjaGlsZC5jaGlsZHJlbiwgY29udGV4dCwgIGNoaWxkLnR5cGUgPT09ICdTY3JvbGxWaWV3JyA/IGZhbHNlIDogbmVlZFJlbmRlcik7XG4gIH0pO1xufVxuXG4vKipcbiAqIOWwhuW4g+WxgOagkeeahOW4g+WxgOS/oeaBr+WKoOW3pei1i+WAvOWIsOa4suafk+agkVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGF5b3V0Q2hpbGRyZW4oZWxlbWVudDogRWxlbWVudCkge1xuICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQubGF5b3V0Qm94ID0gY2hpbGQubGF5b3V0Qm94IHx8IHt9O1xuXG4gICAgWydsZWZ0JywgJ3RvcCcsICd3aWR0aCcsICdoZWlnaHQnXS5mb3JFYWNoKChwcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNoaWxkLmxheW91dEJveFtwcm9wIGFzIGtleW9mIElMYXlvdXRCb3hdID0gY2hpbGQubGF5b3V0Py5bcHJvcCBhcyBrZXlvZiBJTGF5b3V0XSBhcyBudW1iZXI7XG4gICAgfSk7XG5cbiAgICBpZiAoY2hpbGQucGFyZW50KSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gKGNoaWxkLnBhcmVudC5sYXlvdXRCb3guYWJzb2x1dGVYIHx8IDApICsgY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gKGNoaWxkLnBhcmVudC5sYXlvdXRCb3guYWJzb2x1dGVZIHx8IDApICsgY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfVxuXG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWTtcbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYO1xuXG5cbiAgICBsYXlvdXRDaGlsZHJlbihjaGlsZCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBub25lKCkgeyB9XG5leHBvcnQgZnVuY3Rpb24gaXRlcmF0ZVRyZWUoZWxlbWVudDogRWxlbWVudCwgY2FsbGJhY2s6IENhbGxiYWNrID0gbm9uZSkge1xuICBjYWxsYmFjayhlbGVtZW50KTtcblxuICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaXRlcmF0ZVRyZWUoY2hpbGQsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCByZXBhaW50Q2hpbGRyZW4gPSAoY2hpbGRyZW46IEVsZW1lbnRbXSkgPT4ge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIGlmIChjaGlsZC50eXBlICE9PSAnU2Nyb2xsVmlldycpIHtcbiAgICAgIHJlcGFpbnRDaGlsZHJlbihjaGlsZC5jaGlsZHJlbik7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydCBjb25zdCByZXBhaW50VHJlZSA9ICh0cmVlOiBFbGVtZW50KSA9PiB7XG4gIHRyZWUucmVwYWludCgpO1xuXG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICByZXBhaW50VHJlZShjaGlsZCk7XG4gIH0pO1xufTtcblxuaW50ZXJmYWNlIEVsZW1lbnRBcmdzIHtcbiAgc3R5bGU6IG9iamVjdDtcbiAgaWROYW1lOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBpZDogbnVtYmVyO1xuICBkYXRhc2V0OiBvYmplY3Q7XG4gIHNyYz86IHN0cmluZztcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZTxUIGV4dGVuZHMgRWxlbWVudD4ocm9vdDogVCwgZWxlbWVudDogRWxlbWVudCwgZGVlcCA9IHRydWUsIHBhcmVudD86IEVsZW1lbnQpIHtcbiAgY29uc3QgQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvck1hcFtlbGVtZW50LnRhZ05hbWUgYXMgc3RyaW5nXTtcbiAgLy8gQHRzLWlnbm9yZVxuICByb290LmVsZUNvdW50ICs9IDE7XG5cbiAgY29uc3QgYXJnczogRWxlbWVudEFyZ3MgPSB7XG4gICAgc3R5bGU6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuc3R5bGUpLFxuICAgIGlkTmFtZTogZWxlbWVudC5pZE5hbWUsXG4gICAgY2xhc3NOYW1lOiBlbGVtZW50LmNsYXNzTmFtZSxcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgaWQ6IHJvb3QuZWxlQ291bnQsXG4gICAgZGF0YXNldDogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5kYXRhc2V0KSxcbiAgICBuYW1lOiBlbGVtZW50LnRhZ05hbWUsXG4gIH07XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIGFyZ3Muc3JjID0gZWxlbWVudC5zcmM7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEJpdE1hcFRleHQpIHtcbiAgICBhcmdzLnZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld0VsZW1lbmV0ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICBuZXdFbGVtZW5ldC5yb290ID0gcm9vdDtcbiAgLy8gQHRzLWlnbm9yZVxuICBuZXdFbGVtZW5ldC5pbnNlcnQocm9vdC5yZW5kZXJDb250ZXh0LCBmYWxzZSk7XG4gIG5ld0VsZW1lbmV0Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGQobmV3RWxlbWVuZXQpO1xuICB9XG5cbiAgaWYgKGRlZXApIHtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjbG9uZShyb290LCBjaGlsZCwgZGVlcCwgbmV3RWxlbWVuZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld0VsZW1lbmV0O1xufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgQml0TWFwRm9udCBmcm9tICcuLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sPEJpdE1hcEZvbnQ+KCdiaXRNYXBQb29sJyk7XG5cbmludGVyZmFjZSBJQml0TWFwVGV4dE9wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbiAgZm9udD86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0TWFwVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdCaXRNYXBUZXh0JztcbiAgcHJpdmF0ZSB2YWx1ZXNyYzogc3RyaW5nO1xuICBwdWJsaWMgZm9udDogQml0TWFwRm9udDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQml0TWFwVGV4dE9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHZhbHVlID0gJycsXG4gICAgICBmb250ID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgIH0gPSBvcHRzO1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG5cbiAgICB0aGlzLmZvbnQgPSBiaXRNYXBQb29sLmdldChmb250KTtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgY29uc29sZS5lcnJvcihgTWlzc2luZyBCaXRtYXBGb250IFwiJHtmb250fVwiLCBwbGVhc2UgaW52b2tlIEFQSSBcInJlZ2lzdEJpdE1hcEZvbnRcIiBiZWZvcmUgdXNpbmcgXCJCaXRNYXBUZXh0XCJgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZW1pdCgncmVwYWludCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250LnJlYWR5KSB7XG4gICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb250LmV2ZW50Lm9uKCd0ZXh0X19sb2FkX19kb25lJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dEJvdW5kcygpIHtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgeyBsZXR0ZXJTcGFjaW5nID0gMCB9ID0gc3R5bGU7XG4gICAgbGV0IHdpZHRoID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgd2lkdGggKz0gY2ZnLnc7XG5cbiAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgd2lkdGggKz0gbGV0dGVyU3BhY2luZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQ6IHRoaXMuZm9udC5saW5lSGVpZ2h0IH07XG4gIH1cblxuICByZW5kZXJUZXh0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRUZXh0Qm91bmRzKCk7XG4gICAgY29uc3QgZGVmYXVsdExpbmVIZWlnaHQgPSB0aGlzLmZvbnQubGluZUhlaWdodCBhcyBudW1iZXI7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgbGV0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZIH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCA9IDAsIC8vIOayoeacieiuvue9rumHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgaGVpZ2h0ID0gMCwgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICB0ZXh0QWxpZ24sIC8vIOaWh+Wtl+W3puWPs+Wvuem9kOaWueW8j1xuICAgICAgdmVydGljYWxBbGlnbixcbiAgICAgIGxldHRlclNwYWNpbmcgPSAwLFxuICAgIH0gPSBzdHlsZTtcbiAgICAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gKHN0eWxlLmxpbmVIZWlnaHQgfHwgZGVmYXVsdExpbmVIZWlnaHQpIGFzIG51bWJlclxuXG4gICAgY29uc3Qgc2NhbGVZID0gbGluZUhlaWdodCAvIGRlZmF1bHRMaW5lSGVpZ2h0O1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHNjYWxlWSAqIGJvdW5kcy53aWR0aDtcblxuICAgIC8vIOWmguaenOaWh+Wtl+eahOa4suafk+WMuuWfn+mrmOW6puWwj+S6juebkuWtkOmrmOW6pu+8jOmHh+eUqOWvuem9kOaWueW8j1xuICAgIGlmIChsaW5lSGVpZ2h0IDwgaGVpZ2h0KSB7XG4gICAgICBpZiAodmVydGljYWxBbGlnbiA9PT0gJ21pZGRsZScpIHtcbiAgICAgICAgZHJhd1kgKz0gKGhlaWdodCAtIGxpbmVIZWlnaHQpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodmVydGljYWxBbGlnbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgZHJhd1kgPSBkcmF3WSArIGhlaWdodCAtIGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoID4gcmVhbFdpZHRoKSB7XG4gICAgICBpZiAodGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgICBkcmF3WCArPSAod2lkdGggLSByZWFsV2lkdGgpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICAgIGRyYXdZICs9ICh3aWR0aCAtIHJlYWxXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g6K6w5b2V5LiK5LiA5Liq5a2X56ym77yM5pa55L6/5aSE55CGIGtlcm5pbmdcbiAgICBsZXQgcHJldkNoYXJDb2RlID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG5cbiAgICAgIGlmIChwcmV2Q2hhckNvZGUgJiYgY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXSkge1xuICAgICAgICBkcmF3WCArPSBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgdGhpcy5mb250LnRleHR1cmUgYXMgSFRNTEltYWdlRWxlbWVudCxcbiAgICAgICAgICBjZmcueCxcbiAgICAgICAgICBjZmcueSxcbiAgICAgICAgICBjZmcudyxcbiAgICAgICAgICBjZmcuaCxcbiAgICAgICAgICBkcmF3WCArIGNmZy5vZmZYICogc2NhbGVZIC0gb3JpZ2luWCxcbiAgICAgICAgICBkcmF3WSArIGNmZy5vZmZZICogc2NhbGVZIC0gb3JpZ2luWSxcbiAgICAgICAgICBjZmcudyAqIHNjYWxlWSxcbiAgICAgICAgICBjZmcuaCAqIHNjYWxlWSxcbiAgICAgICAgKTtcblxuICAgICAgICBkcmF3WCArPSAoY2ZnLnhhZHZhbmNlICogc2NhbGVZICsgbGV0dGVyU3BhY2luZyk7XG5cbiAgICAgICAgcHJldkNoYXJDb2RlID0gY2hhcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBUZXh0IGZyb20gJy4vdGV4dCc7XHJcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xyXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xyXG5cclxuaW50ZXJmYWNlIElCdXR0b25Qcm9wcyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XHJcbiAgdmFsdWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmjInpkq7nmoTov4fluqbnsbvlnovmnprkuL5cclxuICovXHJcbmVudW0gVHJhbnNpdGlvbiB7XHJcbiAgTk9ORSxcclxuICBDT0xPUixcclxuICBTQ0FMRSxcclxuICBJTUFHRSxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIGV4dGVuZHMgVmlldyB7XHJcbiAgc3RhdGljIFRyYW5zaXRpb24gPSBUcmFuc2l0aW9uO1xyXG5cclxuICBwdWJsaWMgbGFiZWw6IFZpZXc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHtcclxuICAgIHN0eWxlID0ge30sXHJcbiAgICBpZE5hbWUgPSAnJyxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgdmFsdWUgPSAnJyxcclxuICAgIGRhdGFzZXQsXHJcbiAgfTogSUJ1dHRvblByb3BzKSB7XHJcbiAgICBsZXQgZGVmYXVsdFN0eWxlID0ge1xyXG4gICAgICB3aWR0aDogMzAwLFxyXG4gICAgICBoZWlnaHQ6IDYwLFxyXG4gICAgfVxyXG4gICAgc3VwZXIoe1xyXG4gICAgICBpZE5hbWUsXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgc3R5bGU6IHtcclxuICAgICAgICAuLi5kZWZhdWx0U3R5bGUsXHJcbiAgICAgICAgYm9yZGVyUmFkaXVzOiAxMCxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMzRhMTIzJyxcclxuICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXHJcbiAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcidcclxuICAgICAgfSxcclxuICAgICAgZGF0YXNldCxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMubGFiZWwgPSBuZXcgVGV4dCh7XHJcbiAgICAgIHN0eWxlOiB7XHJcbiAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICBmb250U2l6ZTogMzAsXHJcbiAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcclxuICAgICAgfSxcclxuICAgICAgdmFsdWU6IHZhbHVlIHx8ICdidXR0b24nLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyh0aGlzKVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnRlcmFjdGFibGVJbm5lciA9IHRydWU7XHJcbiAgXHJcbiAgLyoqXHJcbiAgICog5b2T5YmN5oyJ6ZKu5piv5ZCm5Y+v5Lqk5LqS77yM5aaC5p6c5LiN5Y+v5Lqk5LqS77yM54K55Ye75rKh5Y+N5bqUXHJcbiAgICovXHJcbiAgZ2V0IGludGVyYWN0YWJsZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmludGVyYWN0YWJsZUlubmVyO1xyXG4gIH1cclxuXHJcbiAgc2V0IGludGVyYWN0YWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuaW50ZXJhY3RhYmxlID0gdmFsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmFuc2l0aW9uSW5uZXIgPSBUcmFuc2l0aW9uLkNPTE9SO1xyXG4gIGdldCB0cmFuc2l0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbklubmVyO1xyXG4gIH1cclxuICBcclxuICBzZXQgdHJhbnNpdGlvbih2YWw6IFRyYW5zaXRpb24pIHtcclxuICAgIHRoaXMudHJhbnNpdGlvbklubmVyID0gdmFsO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJQ2FudmFzT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGF1dG9DcmVhdGVDYW52YXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBjYW52YXNJbnN0YW5jZTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElDYW52YXNPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgICAgd2lkdGggPSAxMDAsXG4gICAgICBoZWlnaHQgPSAxMDAsXG4gICAgICBhdXRvQ3JlYXRlQ2FudmFzID0gZmFsc2UsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HlsI/muLjmiI/lnLrmma/kuIvvvIxzaGFyZWRDYW52YXMg5a6e5L6L5LiN5pa55L6/6Ieq5Yqo5Yib5bu677yM5o+Q5L6bIHNldHRlciDmiYvliqjorr7nva5cbiAgICAgKi9cbiAgICBpZiAoYXV0b0NyZWF0ZUNhbnZhcykge1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGVudi5jcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzSW5zdGFuY2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg57uT5p2fXG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpIHtcbiAgICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBSZWN0IGZyb20gJy4uL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnO1xuaW1wb3J0IHsgYmFja2dyb3VuZEltYWdlUGFyc2VyLCByb3RhdGVQYXJzZXIsIHBhcnNlVHJhbnNmb3JtIH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGlkOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZCh0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RGlydHkoZWxlOiBFbGVtZW50LCByZWFzb24/OiBzdHJpbmcpIHtcbiAgLy8gZm9yIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKCdbTGF5b3V0XSB0cmlnZ2VyIHJlZmxvdyBjYXVzZScsIGVsZSwgcmVhc29uKTtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlckZvckxheW91dCB7XG4gIHJvdGF0ZT86IG51bWJlcjsgLy8gdHJhbnNmb3JtIHJvdGF0Zeino+aekOS5i+WQjuW+l+WIsOeahOW8p+W6puWItlxuICBzY2FsZVg/OiBudW1iZXI7XG4gIHNjYWxlWT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIHJpZ2h0OiBudW1iZXI7XG4gIGJvdHRvbTogbnVtYmVyO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWxlbWVudCB7XG4gIC8qKlxuICAgKiDlrZDoioLngrnliJfooahcbiAgICovXG4gIHB1YmxpYyBjaGlsZHJlbjogRWxlbWVudFtdID0gW107XG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTniLboioLngrlcbiAgICovXG4gIHB1YmxpYyBwYXJlbnQ6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAvLyDkvLzkuY7msqHku4DkuYjnlKjvvIzlhYjms6jph4pcbiAgLy8gcHVibGljIHBhcmVudElkID0gMDtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahGlk77yM5LiA6Iis5piv55SxIExheW91dCDnu5/kuIDliIbphY3nmoToh6rlop4gaWRcbiAgICovXG4gIHB1YmxpYyBpZDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBpZCDlsZ7mgKfvvIzkuIDoiKznlKjkuo7oioLngrnmn6Xor6JcbiAgICovXG4gIHB1YmxpYyBpZE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgY2xhc3Mg5bGe5oCn77yM5LiA6Iis55So5LqO5qih5p2/5o+S5Lu2XG4gICAqL1xuICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueaJgOWcqOiKgueCueagkeeahOagueiKgueCue+8jOaMh+WQkSBMYXlvdXRcbiAgICovXG4gIHB1YmxpYyByb290OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gIC8vIHB1YmxpYyBFRTogYW55O1xuXG4gIC8qKlxuICAgKiDnlKjkuo7moIfor4blvZPliY3oioLngrnmmK/lkKblt7Lnu4/miafooYzplIDmr4HpgLvovpHvvIzplIDmr4HkuYvlkI7ljp/lhYjnmoTlip/og73pg73kvJrlvILluLjvvIzkuIDoiKzkuJrliqHkvqfkuI3nlKjlhbPlv4Pov5nkuKpcbiAgICovXG4gIHB1YmxpYyBpc0Rlc3Ryb3llZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDnsbvkvLwgV2ViIOerr+WunueOsO+8jOe7meiKgueCueaMguS4gOS6m+iDveWkn+ivu+WGmeeahOWxnuaAp+mbhuWQiFxuICAgKiDlnKggeG1sIOWPr+S7pei/meagt+WjsOaYjuWxnuaAp++8mjx2aWV3IGNsYXNzPVwieHh4XCIgZGF0YS1mb289XCJiYXJcIj5cbiAgICog5ZyoIGpzIOS+p+WPr+S7pei/meS5iOivu+WGmeWxnuaAp++8mlxuICAgKiBjb25zb2xlLmxvZyhlbGVtZW50LmRhdGFzZXQuZm9vKTsgLy8g5o6n5Yi25Y+w6L6T5Ye6IFwiYmFyXCI7XG4gICAqIGVsZW1lbnQuZGF0YXNldC5mb28gPSBcImJhcjJcIjtcbiAgICovXG4gIHB1YmxpYyBkYXRhc2V0OiBJRGF0YXNldDtcblxuICAvKipcbiAgICog6IqC54K555qE5qC35byP5YiX6KGo77yM5ZyoIExheW91dC5pbml0IOS8muS8oOWFpeagt+W8j+mbhuWQiO+8jOS8muiHquWKqOaMkemAieWHuui3n+iKgueCueacieWFs+eahOagt+W8j+e7n+S4gCBtZXJnZSDliLAgc3R5bGUg5a+56LGh5LiKXG4gICAqL1xuICBwdWJsaWMgc3R5bGU6IElTdHlsZTtcblxuICAvKipcbiAgICog5omn6KGMIGdldEJvdW5kaW5nQ2xpZW50UmVjdCDnmoTnu5PmnpznvJPlrZjvvIzlpoLmnpzkuJrliqHpq5jpopHosIPnlKjvvIzlj6/ku6Xlh4/lsJEgR0NcbiAgICovXG4gIHByaXZhdGUgcmVjdDogUmVjdCB8IG51bGw7XG4gIHB1YmxpYyBjbGFzc05hbWVMaXN0OiBzdHJpbmdbXSB8IG51bGw7XG4gIHB1YmxpYyBsYXlvdXRCb3g6IElMYXlvdXRCb3g7XG4gIHB1YmxpYyBiYWNrZ3JvdW5kSW1hZ2U6IGFueTtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGxcblxuICAvKipcbiAgICog572u6ISP5qCH6K6w5L2N77yM55uu5YmN5b2T5L+u5pS55Lya5b2x5ZON5biD5bGA5bGe5oCn55qE5pe25YCZ77yM5Lya6Ieq5Yqo572u6ISPXG4gICAqL1xuICBwdWJsaWMgaXNEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBjc3MtbGF5b3V0IOiKgueCueWxnuaAp++8jOS4muWKoeS+p+aXoOmcgOWFs+W/g1xuICAgKi9cbiAgcHJvdGVjdGVkIHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTlkI3np7DvvIzmr5TlpoJcIiBJbWFnZVxuICAgKi9cbiAgcHVibGljIHR5cGU/OiBzdHJpbmc7XG4gIC8vIHB1YmxpYyBsYXlvdXQ/OiBJTGF5b3V0O1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnlnKggeG1sIOeahOagh+etvuWQjeensO+8jOavlOWmgiBpbWFnZeOAgXZpZXdcbiAgICovXG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgb3JpZ2luU3R5bGU6IElTdHlsZTtcblxuICBwcm90ZWN0ZWQgcmVuZGVyRm9yTGF5b3V0OiBJUmVuZGVyRm9yTGF5b3V0ID0ge307XG5cbiAgcHJvdGVjdGVkIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHZhbDogYW55KSB7XG5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIGlkID0gdXVpZCArPSAxLFxuICAgIGRhdGFzZXQgPSB7fSxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuaWROYW1lID0gaWROYW1lO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIHRoaXMubGF5b3V0Qm94ID0ge1xuICAgICAgbGVmdDogMCxcbiAgICAgIHRvcDogMCxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgYWJzb2x1dGVYOiAwLFxuICAgICAgYWJzb2x1dGVZOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVg6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWTogMCxcbiAgICB9O1xuXG4gICAgdGhpcy5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgIGlmICh0eXBlb2Ygc3R5bGUuYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHN0eWxlLmJhY2tncm91bmRJbWFnZSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzdHlsZS50cmFuc2Zvcm0gPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLnJlbmRlckZvckxheW91dCA9IHBhcnNlVHJhbnNmb3JtKHN0eWxlLnRyYW5zZm9ybSk7XG4gICAgICAvLyBpZiAoc3R5bGUudHJhbnNmb3JtLmluZGV4T2YoJ3JvdGF0ZScpID4gLTEpIHtcbiAgICAgIC8vICAgY29uc3QgZGVnID0gcm90YXRlUGFyc2VyKHN0eWxlLnRyYW5zZm9ybSk7XG4gICAgICAvLyAgIGlmIChkZWcpIHtcbiAgICAgIC8vICAgICB0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgPSBkZWc7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpblN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5zdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMucmVjdCA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIoYmFja2dyb3VuZEltYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCB1cmwgPSBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIoYmFja2dyb3VuZEltYWdlKTtcblxuICAgIGlmICh1cmwpIHtcbiAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodXJsLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdCAmJiB0aGlzLnJvb3QuZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog55uR5ZCs5bGe5oCn55qE5Y+Y5YyW5Yik5pat5piv5ZCm6ZyA6KaB5omn6KGMIHJlZmxvd+OAgXJlcGFpbnQg5pON5L2cXG4gICAqIOe7j+i/h+a1i+ivle+8jE9iamVjdC5kZWZpbmVQcm9wZXJ0eSDmmK/kuIDkuKrmr5TovoPmhaLnmoTmlrnms5XvvIwg54m55Yir5piv5bGe5oCn5q+U6L6D5aSa55qE5pe25YCZXG4gICAqIOWboOatpOS8muWFiOWIpOaWreaYr+WQpuaUr+aMgSBQcm94ee+8jGlNYWMgKFJldGluYSA1SywgMjctaW5jaCwgMjAxNynmtYvor5Xnu5PmnpxcbiAgICog5oC75YWxIDMxMiDkuKroioLngrnvvIxvYnNlcnZlU3R5bGVBbmRFdmVudOaAu+iAl+aXtuS4uu+8mlxuICAgKiBQcm94eTogM21zXG4gICAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eTogMjBtc1xuICAgKi9cbiAgb2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiBQcm94eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgZWxlID0gdGhpcztcbiAgICAgIHRoaXMuc3R5bGUgPSBuZXcgUHJveHkodGhpcy5vcmlnaW5TdHlsZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcikge1xuICAgICAgICAgIGxldCBvbGRWYWwgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnICYmIG9sZFZhbCAhPT0gdmFsKSB7XG4gICAgICAgICAgICBlbGUuc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3AsIHZhbCk7XG5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAndHJhbnNmb3JtJykge1xuICAgICAgICAgICAgICAvLyBPYmplY3QuYXNzaWduKGVsZS5yZW5kZXJGb3JMYXlvdXQsIHBhcnNlVHJhbnNmb3JtKHZhbCkpO1xuICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGUucmVuZGVyRm9yTGF5b3V0KVxuICAgICAgICAgICAgICBlbGUucmVuZGVyRm9yTGF5b3V0ID0gcGFyc2VUcmFuc2Zvcm0odmFsKTtcblxuICAgICAgICAgICAgICBlbGUucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHNldERpcnR5KGVsZSwgYGNoYW5nZSBwcm9wICR7cHJvcH0gZnJvbSAke29sZFZhbH0gdG8gJHt2YWx9YCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgZWxlLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdHlsZSkgYXMgSVN0eWxlO1xuICAgICAgYWxsU3R5bGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zdHlsZSwga2V5LCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdLFxuICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAgICAgaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNldERpcnR5KHRoaXMsIGBjaGFuZ2UgcHJvcCAke2tleX0gdG8gJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kSW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8g5LqL5Lu25YaS5rOh6YC76L6RXG4gICAgWyd0b3VjaHN0YXJ0JywgJ3RvdWNobW92ZScsICd0b3VjaGNhbmNlbCcsICd0b3VjaGVuZCcsICdjbGljayddLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5vbihldmVudE5hbWUsIChlLCB0b3VjaE1zZykgPT4ge1xuICAgICAgICB0aGlzLnBhcmVudCAmJiB0aGlzLnBhcmVudC5lbWl0KGV2ZW50TmFtZSwgZSwgdG91Y2hNc2cpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSB0aGlzLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCuemHjee7mOaOpeWPo++8jOWtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVwYWludCgpIHsgfVxuXG4gIC8qKlxuICAgKiDoioLngrnmuLLmn5PmjqXlj6PlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlbmRlcigpIHsgfVxuXG4gIC8qKlxuICAgKiDlj4LnhacgV2ViIOinhOiMg++8mmh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9FbGVtZW50L2dldEJvdW5kaW5nQ2xpZW50UmVjdFxuICAgKi9cbiAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6IFJlY3Qge1xuICAgIGlmICghdGhpcy5yZWN0KSB7XG4gICAgICB0aGlzLnJlY3QgPSBuZXcgUmVjdChcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVksXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMucmVjdC5zZXQoXG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVksXG4gICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICApO1xuXG4gICAgcmV0dXJuIHRoaXMucmVjdDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxpZE5hbWUg5Li657uZ5a6a5Y+C5pWw55qE55qE6IqC54K5XG4gICAqIOiKgueCueeahCBpZCDllK/kuIDmgKcgTGF5b3V0IOW5tuS4jeS/neivge+8jOS9hui/memHjOWPqui/lOWbnuespuWQiOadoeS7tueahOesrOS4gOS4quiKgueCuSBcbiAgICovXG4gIGdldEVsZW1lbnRCeUlkKGlkOiBzdHJpbmcpOiBFbGVtZW50IHwgbnVsbCB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRCeUlkKHRoaXMsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxpZE5hbWUg5Li657uZ5a6a5Y+C5pWw55qE55qE6IqC54K5XG4gICAqIOiKgueCueeahCBpZCDllK/kuIDmgKcgTGF5b3V0IOW5tuS4jeS/neivge+8jOi/memHjOi/lOWbnuespuWQiOadoeS7tueahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUlkKGlkOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5SWQodGhpcywgW10sIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxjbGFzc05hbWUg5YyF5ZCr57uZ5a6a5Y+C5pWw55qE55qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNsYXNzTmFtZTogc3RyaW5nKTogKEVsZW1lbnQgfCBudWxsKVtdIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0aGlzLCBbXSwgY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDluIPlsYDorqHnrpflrozmiJDvvIzlh4blpIfmiafooYzmuLLmn5PkuYvliY3miafooYznmoTmk43kvZzvvIzkuI3lkIznmoTlrZDnsbvmnInkuI3lkIznmoTooYzkuLpcbiAgICog5q+U5aaCIFNjcm9sbFZpZXcg5Zyo5riy5p+T5LmL5YmN6L+Y6ZyA6KaB5Yid5aeL5YyW5rua5Yqo55u45YWz55qE6IO95YqbXG4gICAqICBcbiAgICovXG4gIGluc2VydChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlcjogYm9vbGVhbikge1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5jdHggPSBjdHg7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56Kej6Zmk5LqL5Lu257uR5a6aXG4gICAqL1xuICB1bkJpbmRFdmVudCgpIHtcbiAgICBbXG4gICAgICAndG91Y2hzdGFydCcsXG4gICAgICAndG91Y2htb3ZlJyxcbiAgICAgICd0b3VjaGNhbmNlbCcsXG4gICAgICAndG91Y2hlbmQnLFxuICAgICAgJ2NsaWNrJyxcbiAgICAgICdyZXBhaW50JyxcbiAgICBdLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5vZmYoZXZlbnROYW1lKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIboioLngrnku47lvZPliY3oioLngrnmoJHkuK3liKDpmaRcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICBjb25zdCB7IHBhcmVudCB9ID0gdGhpcztcblxuICAgIGlmICghcGFyZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5kZXggPSBwYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcbiAgICAgIHNldERpcnR5KHRoaXMsIGByZW1vdmVgKTtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHNldERpcnR5KCkge1xuICAgIHNldERpcnR5KHRoaXMpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuXG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG5cbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyB0aGlzLkVFID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuXG4gICAgLy8gZWxlbWVudCDlnKjnlLvluIPkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICAvLyB0aGlzLmxheW91dEJveCA9IG51bGw7XG4gICAgLy8gdGhpcy5zdHlsZSA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWUgPSAnJztcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYWRkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XG4gICAgLy8gZWxlbWVudC5wYXJlbnRJZCA9IHRoaXMuaWQ7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG5LiA5Liq6IqC54K55re75Yqg5L2c5Li65b2T5YmN6IqC54K555qE5a2Q6IqC54K5XG4gICAqL1xuICBhcHBlbmRDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5hZGQoZWxlbWVudCk7XG5cbiAgICBzZXREaXJ0eSh0aGlzLCBgYXBwZW5kQ2hpbGQgJHtlbGVtZW50fWApO1xuICB9XG5cbiAgLyoqXG4gICAqIOenu+mZpOe7meWumueahOWtkOiKgueCue+8jOWPquacieS4gOe6p+iKgueCueiDveWkn+enu+mZpCBcbiAgICovXG4gIHJlbW92ZUNoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2hpbGRyZW4uaW5kZXhPZihlbGVtZW50KTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpO1xuICAgICAgc2V0RGlydHkodGhpcywgYHJlbW92ZUNoaWxkICR7ZWxlbWVudH1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqIOeUseS6juaUr+aMgeS6hnJvdGF0ZeeJueaAp++8jOaJgOS7peaJgOacieeahOa4suafk+mDvemcgOimgeaWueWQkeWHj+WOu3RyYW5zZm9ybeeahOS4remXtOeCuVxuICAgKi9cbiAgcmVuZGVyQm9yZGVyKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBvcmlnaW5YOiBudW1iZXIgPSAwLCBvcmlnaW5ZOiBudW1iZXIgPSAwKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IHJhZGl1cyA9IHN0eWxlLmJvcmRlclJhZGl1cyB8fCAwO1xuICAgIGNvbnN0IHsgYm9yZGVyV2lkdGggPSAwIH0gPSBzdHlsZTtcbiAgICBjb25zdCB0bHIgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCB0cnIgPSBzdHlsZS5ib3JkZXJUb3BSaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYmJyID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYnJyID0gc3R5bGUuYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgYm9yZGVyQ29sb3IgPSAnJyB9ID0gc3R5bGU7XG4gICAgY29uc3QgeCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgeSA9IGJveC5hYnNvbHV0ZVk7XG4gICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG5cbiAgICBjb25zdCBoYXNSYWRpdXMgPSByYWRpdXMgfHwgdGxyIHx8IHRyciB8fCBiYnIgfHwgYnJyO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4Lm1vdmVUbyh4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gdHJyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblkpO1xuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIHRyciAtIG9yaWdpblksIHRycik7XG4gICAgLy8g5Y+z5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gYnJyIC0gb3JpZ2luWSk7XG4gICAgLy8g5Y+z5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBvcmlnaW5ZLCB4ICsgd2lkdGggLSBicnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgYnJyKTtcbiAgICAvLyDlt6bkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyBiYnIgLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSk7XG4gICAgLy8g5bem5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgeCAtIG9yaWdpblgsIHkgKyBoZWlnaHQgLSBiYnIgLSBvcmlnaW5ZLCBiYnIpO1xuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCAtIG9yaWdpblgsIHkgKyB0bHIgLSBvcmlnaW5ZKTtcbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB4ICsgdGxyIC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHRscik7XG4gICAgY3R4LmNsb3NlUGF0aCgpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cblxuICAvKipcbiAgICog5q+P5Liq5a2Q57G76YO95Lya5pyJ6Ieq5bex55qE5riy5p+T6YC76L6R77yM5L2G5LuW5Lus6YO95pyJ5Lqb6YCa55So55qE5aSE55CG77yM5q+U5aaC6YCP5piO5bqm44CB5peL6L2s5ZKMYm9yZGVy55qE5aSE55CG77yMYmFzZVJlbmRlciDnlKjkuo7lpITnkIbpgJrnlKjnmoTmuLLmn5PpgLvovpFcbiAgICovXG4gIGJhc2VSZW5kZXIoKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlO1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IGRyYXdYLCBhYnNvbHV0ZVk6IGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSBib3g7XG5cbiAgICBpZiAoc3R5bGUub3BhY2l0eSAhPT0gMSkge1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gc3R5bGUub3BhY2l0eSBhcyBudW1iZXI7XG4gICAgfVxuXG4gICAgbGV0IG9yaWdpblggPSAwO1xuICAgIGxldCBvcmlnaW5ZID0gMDtcblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgb3JpZ2luWCA9IGRyYXdYICsgYm94LndpZHRoIC8gMjtcbiAgICAgIG9yaWdpblkgPSBkcmF3WSArIGJveC5oZWlnaHQgLyAyO1xuXG4gICAgICBjdHgudHJhbnNsYXRlKG9yaWdpblgsIG9yaWdpblkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDor7fms6jmhI/vvIzov5nph4zmmoLml7bku4XmlK/mjIHmsqHmnInlrZDoioLngrnnmoTlhYPntKDlj5HnlJ/ml4vovazvvIzlpoLmnpzniLboioLngrnml4vovazkuoblrZDoioLngrnlubbkuI3kvJrot5/nnYDml4vovaxcbiAgICAgKiDopoHlrp7njrDniLboioLngrnluKbliqjlrZDoioLngrnml4vovaznmoTog73lipvvvIzpnIDopoHlvJXlhaXnn6npmLXlupPvvIzlr7nku6PnoIHmlLnliqjkuZ/mr5TovoPlpKfvvIzmmoLml7bkuI3lgZrmlLnpgKDjgIJcbiAgICAgKi9cbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGN0eC5yb3RhdGUodGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgfHwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggOiAxICwgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZICE9PSB1bmRlZmluZWQgPyB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgOiAxKVxuICAgICAgY3R4LnNjYWxlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYIDogMSAsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZIDogMSk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIC8vIGZvciBjbGlwXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJSW1hZ2VPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc3JjPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZSBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGltZ3NyYzogc3RyaW5nO1xuICBwdWJsaWMgdHlwZSA9ICdJbWFnZSc7XG4gIHB1YmxpYyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElJbWFnZU9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHNyYyA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1nc3JjID0gc3JjO1xuXG4gICAgdGhpcy5pbWcgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHNyYygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgfVxuXG4gIHNldCBzcmMobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy5pbWdzcmMpIHtcbiAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5pbWcgPSBudWxsO1xuXG4gICAgdGhpcy5zcmMgPSAnJztcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5pbWcgfHwgIXRoaXMuaW1nPy5jb21wbGV0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDlvIDlp4tcbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1nLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgd2lkdGgsIGhlaWdodCk7XG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOe7k+adn1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICB0aGlzLnJlbmRlckJvcmRlcihjdHgsIG9yaWdpblgsIG9yaWdpblkpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuXG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgSW1hZ2UgZnJvbSAnLi9pbWFnZSc7XG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuaW1wb3J0IFNjcm9sbFZpZXcgZnJvbSAnLi9zY3JvbGx2aWV3JztcbmltcG9ydCBCaXRNYXBUZXh0IGZyb20gJy4vYml0bWFwdGV4dCc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuL2J1dHRvbic7XG5cbmV4cG9ydCB7XG4gIEVsZW1lbnQsXG4gIFZpZXcsXG4gIEltYWdlLFxuICBUZXh0LFxuICBTY3JvbGxWaWV3LFxuICBCaXRNYXBUZXh0LFxuICBDYW52YXMsXG4gIEJ1dHRvbixcbn07XG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcblxuZXhwb3J0IGVudW0gU2Nyb2xsQmFyRGlyZWN0aW9uIHtcbiAgVmVydGl2YWwsXG4gIEhvcml6b250YWwsXG59XG5cbmludGVyZmFjZSBJRGltZW5zaW9ucyB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBjb250ZW50V2lkdGg6IG51bWJlcjtcbiAgY29udGVudEhlaWdodDogbnVtYmVyO1xuXG4gIG1heFNjcm9sbExlZnQ6IG51bWJlcjtcbiAgbWF4U2Nyb2xsVG9wOiBudW1iZXI7XG5cbiAgc2Nyb2xsTGVmdDogbnVtYmVyO1xuICBzY3JvbGxUb3A6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElTY3JvbGxCYXJPcHRpb25zIHtcbiAgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xufVxuXG4vKipcbiAqIOagueaNrua7muWKqOadoeeahOWwuuWvuOOAgVNjcm9sbFZpZXcg6KeG5Y+j5ZKM5rua5Yqo56qX5Y+j5bC65a+444CB5rua5Yqo6Ziy57q/5L+h5oGv56Gu6K6k5rua5Yqo5p2h55qE5qC35byP5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbDtcbiAgY29uc3QgeyB3aWR0aDogc2Nyb2xsV2lkdGgsIGhlaWdodDogc2Nyb2xsSGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQgfSA9IGRpbWVuc2lvbnM7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogaXNWZXJ0aWNhbCA/IHdpZHRoIDogc2Nyb2xsV2lkdGggKiAoc2Nyb2xsV2lkdGggLyBjb250ZW50V2lkdGgpLFxuICAgIGhlaWdodDogaXNWZXJ0aWNhbCA/IHNjcm9sbEhlaWdodCAqIChzY3JvbGxIZWlnaHQgLyBjb250ZW50SGVpZ2h0KSA6IHdpZHRoLFxuICAgIGxlZnQ6IGlzVmVydGljYWwgPyBzY3JvbGxXaWR0aCAtIHdpZHRoIDogMCxcbiAgICB0b3A6IGlzVmVydGljYWwgPyAwIDogc2Nyb2xsSGVpZ2h0IC0gd2lkdGgsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNoZWNrTmVlZEhpZGVTY3JvbGxCYXIoZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIHJldHVybiAhIShkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCAmJiBkaW1lbnNpb25zLm1heFNjcm9sbFRvcCA9PT0gMFxuICAgIHx8IGRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxMZWZ0ID09PSAwKTtcbn1cblxuLyoqXG4gKiDmu5rliqjnu4Tku7bnmoTmu5rliqjmnaHnu4Tku7bvvIzmu5rliqjmnaHmnKzouqvkuZ/mmK9MYXlvdXTnmoTkuIDkuKroioLngrlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsQmFyIGV4dGVuZHMgVmlldyB7XG4gIC8vIOW9k+WJjea7muWKqOadoeaYr+WxnuS6juaoquWQkei/mOaYr+e6teWQkVxuICBwdWJsaWMgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG5cbiAgcHVibGljIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuS4gOauteaXtumXtOWQjuiHquWKqOmakOiXj1xuICBwdWJsaWMgYXV0b0hpZGUgPSB0cnVlO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuiHquWKqOmakOiXj+aXtumXtFxuICBwdWJsaWMgYXV0b0hpZGVUaW1lID0gMjAwMDtcblxuICBwdWJsaWMgYXV0b0hpZGVEZWxheVRpbWUgPSAxNTAwO1xuXG4gIHByaXZhdGUgYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gMDtcblxuICBwcml2YXRlIGlubmVyV2lkdGggPSAxNjtcblxuICBwcml2YXRlIGlzSGlkZSA9IGZhbHNlO1xuXG4gIHByaXZhdGUgY3VyckxlZnQgPSAwO1xuICBwcml2YXRlIGN1cnJUb3AgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBkaXJlY3Rpb24sXG4gICAgZGltZW5zaW9ucyxcbiAgICBiYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgxNjIsIDE2MiwgMTYyLCAxKScsXG4gICAgd2lkdGggPSAxNixcbiAgfTogSVNjcm9sbEJhck9wdGlvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3JkZXJSYWRpdXM6IHdpZHRoIC8gMixcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgfSwgdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh3aWR0aCwgZGlyZWN0aW9uLCBkaW1lbnNpb25zKSk7XG5cbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgdGhpcy5pbm5lcldpZHRoID0gd2lkdGg7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcihkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmu5rliqjmnaHnmoTnspfnu4bvvIzlm6DkuLropoHlhbzlrrnmqKrnq5bmu5rliqjvvIzmiYDku6Ugc3R5bGUud2lkdGgg5Zyo5LiN5ZCM5qih5byP5LiL5Luj6KGo55qE5oSP5oCd5LiN5LiA5qC3XG4gICAqIOWboOatpOmAmui/h+WNleeLrOeahCB3aWR0aCDlsZ7mgKfmnaXku6Pooajmu5rliqjmnaHnmoTnspfnu4ZcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyV2lkdGgpIHtcbiAgICAgIHRoaXMuaW5uZXJXaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gdGhpcy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLnNldERpbWVuc2lvbnModGhpcy5kaW1lbnNpb25zKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF06IHBsZWFzZSBzZXQgcm9vdCBmb3Igc2Nyb2xsYmFyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlLCB0cnVlKTsgICAgXG5cbiAgICAgIHRoaXMucm9vdC5vbignYmVmb3JlX3JlZmxvdycsICgpID0+IHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2JlZm9yZV9yZWZsb3cnKVxuICAgICAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKHRoaXMuY3VyckxlZnQsIHRoaXMuY3VyclRvcCk7XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcywgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKVxuICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgICAgIHRoaXMuc3R5bGUudG9wID0gc2Nyb2xsVG9wO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5pc0hpZGUgPSB0cnVlO1xuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDA7XG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuaXNIaWRlID0gZmFsc2U7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmoLnmja4gU2Nyb2xsVmlldyDlrrnlmajlrr3pq5jlkozlrp7pmYXlhoXlrrnlrr3pq5jlhrPlrprmu5rliqjmnaHnmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICog5L2G5qC45b+D6ZyA6KaB6ICD6JmR55qE5oOF5Ya15piv77yaXG4gICAqIDEuIOWcqOS4jeaWreWcsCByZWZsb3cg6L+H56iL5Lit77yMU2Nyb2xsQmFyIOS5n+S8muWtmOWcqOmcgOimgeWIh+aNouWxleekuuWSjOmakOiXj+eahOaDheWGtVxuICAgKiAyLiByZWZsb3cg5LmL5ZCO77yMU2Nyb2xsQmFyIOeahOS9jee9ruS4jeaYr+eugOWNleeahOiuvue9ruS4uiBTY3JvbGxWaWV3IOmhtumDqOWSjOW3pui+ue+8jOi/mOWPr+iDveaYr+a7muWKqOS6huS4gOautei3neemu+WQjuaJp+ihjOeahCByZWZsb3dcbiAgICovXG4gIHNldERpbWVuc2lvbnMoZGltZW5zaW9uczogSURpbWVuc2lvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnModGhpcy53aWR0aCwgdGhpcy5kaXJlY3Rpb24sIGRpbWVuc2lvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBzdHlsZSk7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcih0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucykpIHtcbiAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cblxuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG5cbiAgICAvLyDlt7Lnu4/mu5rliqjov4fkuIDmrrXot53nprvnmoTmg4XlhrXvvIzph43mlrDorqHnrpfmlrDnmoTmu5rliqjkvY3nva5cbiAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKGRpbWVuc2lvbnMuc2Nyb2xsTGVmdCwgZGltZW5zaW9ucy5zY3JvbGxUb3ApO1xuXG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIHRoaXMuc3R5bGUudG9wID0gc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0eWxlLmxlZnQgPSBzY3JvbGxMZWZ0O1xuICAgIH1cblxuICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICB9XG5cbiAgY2FsY3VsdGVTY3JvbGxWYWx1ZShsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgbGV0IHNjcm9sbExlZnQgPSAwO1xuICAgIGxldCBzY3JvbGxUb3AgPSAwO1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudEhlaWdodDtcblxuICAgICAgLy8g5rua5Yqo5p2h5pyA5aSn5rua5Yqo6auY5bqmXG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgPSB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0ICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IHRvcCAvIHRoaXMuZGltZW5zaW9ucy5tYXhTY3JvbGxUb3A7XG4gICAgICBjb25zdCBwZXJjZW50VG9wID0gc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wICogcGVyY2VudDtcblxuICAgICAgc2Nyb2xsVG9wID0gY2xhbXAocGVyY2VudFRvcCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2FuU2Nyb2xsUGVyY2VudCA9IDEgLSB0aGlzLmRpbWVuc2lvbnMud2lkdGggLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudFdpZHRoO1xuICAgICAgY29uc3Qgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCA9IHRoaXMuZGltZW5zaW9ucy53aWR0aCAqIGNhblNjcm9sbFBlcmNlbnQ7XG5cbiAgICAgIGNvbnN0IHBlcmNlbnQgPSBsZWZ0IC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbExlZnQ7XG5cbiAgICAgIHNjcm9sbExlZnQgPSBjbGFtcChzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ICogcGVyY2VudCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH07XG4gIH1cblxuICBvblNjcm9sbChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNIaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jdXJyTGVmdCA9IGxlZnQ7XG4gICAgdGhpcy5jdXJyVG9wID0gdG9wO1xuICBcbiAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQsIHRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSArIHNjcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCArIHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcbiAgICAgIC8vIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWU7XG4gICAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IHRoaXMuYXV0b0hpZGVUaW1lICsgdGhpcy5hdXRvSGlkZURlbGF5VGltZTtcbiAgICB9XG5cbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIucmVtb3ZlKHRoaXMudXBkYXRlLCB0cnVlKTtcblxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICB1cGRhdGUgPSAoZHQ6IG51bWJlcikgPT4ge1xuICAgIGlmICghdGhpcy5hdXRvSGlkZSB8fCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSAwIHx8IHRoaXMuaXNIaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgLT0gZHQ7XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPD0gdGhpcy5hdXRvSGlkZVRpbWUpIHtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gTWF0aC5tYXgoMCwgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUpO1xuICAgICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gdGhpcy5zdHlsZS5vcGFjaXR5IGFzIG51bWJlciAqICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAvIHRoaXMuYXV0b0hpZGVUaW1lKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCB7IGNvcHlUb3VjaEFycmF5IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IFNjcm9sbGVyIGZyb20gJy4uL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMnXG5pbXBvcnQgeyBpdGVyYXRlVHJlZSB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgRWxlbWVudCwgeyBzZXREaXJ0eSB9IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgU2Nyb2xsQmFyLCB7IFNjcm9sbEJhckRpcmVjdGlvbiB9IGZyb20gJy4vc2Nyb2xsYmFyJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuXG5jb25zdCBkcHIgPSBlbnYuZ2V0RGV2aWNlUGl4ZWxSYXRpbygpO1xuXG5pbnRlcmZhY2UgSVNjcm9sbFZpZXdPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc2Nyb2xsWD86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHNjcm9sbFk/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xufVxuXG5pbnRlcmZhY2UgSUlubmVyU2Nyb2xsZXJPcHRpb24ge1xuICBzY3JvbGxpbmdYPzogYm9vbGVhbjtcbiAgc2Nyb2xsaW5nWT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBzY3JvbGxUb3AgPSAwO1xuICBwdWJsaWMgc2Nyb2xsTGVmdCA9IDA7XG4gIHB1YmxpYyBoYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgcHVibGljIGN1cnJlbnRFdmVudCA9IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ1Njcm9sbFZpZXcnO1xuXG4gIHByaXZhdGUgc2Nyb2xsWVByb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgaW5uZXJTY3JvbGxlck9wdGlvbjogSUlubmVyU2Nyb2xsZXJPcHRpb247XG5cbiAgcHJpdmF0ZSBzY3JvbGxlck9iaj86IFNjcm9sbGVyO1xuICBwcml2YXRlIGlzRmlyc3RTY3JvbGw/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgdmVydGl2YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhvcml6b250YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHNjcm9sbFgsXG4gICAgc2Nyb2xsWSxcbiAgICBkYXRhc2V0LFxuICB9OiBJU2Nyb2xsVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBjbGFzc05hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjcm9sbFlQcm9wID0gc2Nyb2xsWTtcblxuICAgIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6ICEhc2Nyb2xsWCxcbiAgICAgIHNjcm9sbGluZ1k6ICEhc2Nyb2xsWSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlua7muWKqOWIl+ihqOWGheaJgOacieWFg+e0oOeahOmrmOW6puWSjFxuICAgKiDov5nph4zkuI3og73nroDljZXlsIbmiYDmnInlrZDlhYPntKDnmoTpq5jluqbntK/liqDvvIzlm6DkuLrmr4/kuKrlhYPntKDkuYvpl7Tlj6/og73mmK/mnInnqbrpmpnnmoRcbiAgICovXG4gIGdldCBzY3JvbGxIZWlnaHQoKSB7XG4gICAgbGV0IG1heEhlaWdodCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhIZWlnaHQgPSBNYXRoLm1heChtYXhIZWlnaHQsIGl0ZW0ubGF5b3V0Qm94LnRvcCArIGl0ZW0ubGF5b3V0Qm94LmhlaWdodCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG1heEhlaWdodDtcbiAgfVxuXG4gIGdldCBzY3JvbGxXaWR0aCgpIHtcbiAgICBsZXQgbWF4V2lkdGggPSAwO1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbTogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgbWF4V2lkdGggPSBNYXRoLm1heChtYXhXaWR0aCwgaXRlbS5sYXlvdXRCb3gubGVmdCArIGl0ZW0ubGF5b3V0Qm94LndpZHRoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBtYXhXaWR0aDtcbiAgfVxuXG4gIGdldCBzY3JvbGxYKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWDtcbiAgfVxuXG4gIHNldCBzY3JvbGxYKHZhbHVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8oMCwgdGhpcy5zY3JvbGxUb3AsIHRydWUsIDEpO1xuICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdYOiB2YWx1ZSxcbiAgICB9O1xuXG4gICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdZO1xuICB9XG5cbiAgc2V0IHNjcm9sbFkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuc2Nyb2xsWSkge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8odGhpcy5zY3JvbGxMZWZ0LCAwLCB0cnVlLCAxKTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICAgIHNjcm9sbGluZ1k6IHZhbHVlLFxuICAgICAgfTtcblxuICAgICAgdGhpcy5zY3JvbGxlck9iaiAmJiB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBzY3JvbGxlck9wdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uO1xuICB9XG5cbiAgc2V0IHNjcm9sbGVyT3B0aW9uKHZhbHVlOiBJSW5uZXJTY3JvbGxlck9wdGlvbikge1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLCB2YWx1ZSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxlck9iaikge1xuICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnNjcm9sbGVyT2JqLm9wdGlvbnMsIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5zY3JvbGxSZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIC8vIHRoaXMudG91Y2ggPSBudWxsO1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QhLm9mZigndG91Y2hlbmQnKTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyVHJlZVdpdGhUb3AodHJlZTogRWxlbWVudCkge1xuICAgIGlmICghKHRyZWUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICB0cmVlLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgdGhpcy5jdHghLmNsZWFyUmVjdChib3guYWJzb2x1dGVYLCBib3guYWJzb2x1dGVZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICB9XG5cbiAgc2Nyb2xsUmVuZGVyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IHN0YXJ0WCwgYWJzb2x1dGVZOiBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvLyDmoLnmja7mu5rliqjlgLzojrflj5boo4HliarljLrln59cbiAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgd2lkdGg7XG4gICAgY29uc3QgZW5kWSA9IHN0YXJ0WSArIGhlaWdodDtcblxuICAgIC8vIFNjcm9sbFZpZXcg5L2c5Li65a655Zmo5pys6Lqr55qE5riy5p+TXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIOW8gOWni+ijgeWJqu+8jOWPquacieS7lCBTY3JvbGxWaWV3IGxheW91dEJveCDljLrln5/lhoXnmoTlhYPntKDmiY3mmK/lj6/op4HnmoRcbiAgICAgKiDov5nmoLcgU2Nyb2xsVmlldyDkuI3nlKjljZXni6zljaDnlKjkuIDkuKogY2FudmFz77yM5YaF5a2Y5ZCI5riy5p+T6YO95Lya5b6X5Yiw5LyY5YyWXG4gICAgICovXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgucmVjdChzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmNsaXAoKTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgYWJzb2x1dGVYLCBhYnNvbHV0ZVkgfSA9IGNoaWxkLmxheW91dEJveDtcblxuICAgICAgLy8g5Yik5pat5aSE5LqO5Y+v6KeG56qX5Y+j5YaF55qE5a2Q6IqC54K577yM6YCS5b2S5riy5p+T6K+l5a2Q6IqC54K5XG4gICAgICBpZiAoYWJzb2x1dGVZICsgaGVpZ2h0ID49IHN0YXJ0WSAmJiBhYnNvbHV0ZVkgPD0gZW5kWVxuICAgICAgICAmJiBhYnNvbHV0ZVggKyB3aWR0aCA+PSBzdGFydFggJiYgYWJzb2x1dGVYIDw9IGVuZFgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyDkuIrpnaLnmoTmuLLmn5PlupTor6XlhYjot7Pov4fmu5rliqjmnaHvvIzlkKbliJnlj6/og73lh7rnjrDmuLLmn5Ppobrluo/pl67popjvvIxTY3JvbGxWaWV355qE6IqC54K55Y+N6ICM5oqK5rua5Yqo5p2h55uW5L2P5LqGXG4gICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ucmVuZGVyKCk7XG4gICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICBzY3JvbGxIYW5kbGVyKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICAvLyDlj6/og73ooqvplIDmr4HkuobmiJbogIXoioLngrnmoJHov5jmsqHlh4blpIflpb1cbiAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQgJiYgIXRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6L+Z6YeM6KaB5oqK5rua5Yqo54q25oCB5L+d5a2Y6LW35p2l77yM5Zug5Li65ZyocmVmbG9355qE5pe25YCZ6ZyA6KaB5YGa6YeN572u77yM5riy5p+T5bm25LiN5L6d6LWW6L+Z5Lik5Liq5L+h5oGvXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IGxlZnQ7XG5cbiAgICAgIHRoaXMudmVydGl2YWxTY3JvbGxiYXI/Lm9uU2Nyb2xsKGxlZnQsIHRvcCk7XG4gICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/Lm9uU2Nyb2xsKGxlZnQsIHRvcCk7XG5cbiAgICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50RXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzY3JvbGwnLCB0aGlzLmN1cnJlbnRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNGaXJzdFNjcm9sbCkge1xuICAgICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOW9k+aJp+ihjHJlZmxvd+S5i+WQju+8jOa7muWKqOWIl+ihqOeahOmrmOW6puWPr+iDveWPkeeUn+S6huWPmOWMlu+8jOa7muWKqOadoeS5n+mcgOimgeWQjOatpei/m+ihjOabtOaWsFxuICAgKi9cbiAgdXBkYXRlU2Nyb2xsQmFyKHNjcm9sbFByb3A6IHN0cmluZywgc2Nyb2xsQmFyTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgY29udGVudFdpZHRoOiB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aCxcbiAgICAgIGNvbnRlbnRIZWlnaHQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudEhlaWdodCxcbiAgICAgIG1heFNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgIG1heFNjcm9sbFRvcDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxUb3AsXG5cbiAgICAgIHNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fc2Nyb2xsTGVmdCxcbiAgICAgIHNjcm9sbFRvcDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxUb3AsXG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ3VwZGF0ZVNjcm9sbEJhcicsIEpTT04uc3RyaW5naWZ5KGRpbWVuc2lvbnMpKVxuXG4gICAgLy8g6Z2e56ys5LiA5qyh5Yib5bu655qE5oOF5Ya177yM5LiA6Iis5pivIHJlZmxvdyDmiafooYzliLDov5nph4xcbiAgICBpZiAodGhpc1tzY3JvbGxQcm9wIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICBpZiAodGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XS5zZXREaW1lbnNpb25zKGRpbWVuc2lvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gbmV3IFNjcm9sbEJhcih7XG4gICAgICAgICAgZGltZW5zaW9ucyxcbiAgICAgICAgICBkaXJlY3Rpb246IHNjcm9sbFByb3AgPT09ICdzY3JvbGxZJyA/IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCA6IFNjcm9sbEJhckRpcmVjdGlvbi5Ib3Jpem9udGFsLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzLmFwcGVuZENoaWxkKHNjcm9sbGJhcik7XG4gICAgICAgIHNjcm9sbEJhci5yb290ID0gdGhpcy5yb290O1xuICAgICAgICBzY3JvbGxCYXIuaW5pdCgpO1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHNjcm9sbEJhci5pbnNlcnQodGhpcy5yb290LnJlbmRlckNvbnRleHQsIHRydWUpO1xuICAgICAgICBzY3JvbGxCYXIub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKTtcbiAgICAgICAgdGhpcy5hZGQoc2Nyb2xsQmFyKTtcblxuICAgICAgICBzZXREaXJ0eShzY3JvbGxCYXIsICdhcHBlbmRUb1Njcm9sbFZpZXcnKVxuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXSA9IHNjcm9sbEJhcjtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZV0/Lm9uU2Nyb2xsKHRoaXMuc2Nyb2xsZXJPYmohLl9fc2Nyb2xsTGVmdCwgdGhpcy5zY3JvbGxlck9iaiEuX19zY2hlZHVsZWRUb3ApO1xuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5b2T5LiN5YaN6ZyA6KaB57q15ZCR5rua5Yqo55qE5pe25YCZ6ZSA5q+B57q15ZCR5rua5Yqo5p2hXG4gICAgICBpZiAodGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddKSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbEJhciA9IHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XTtcbiAgICAgICAgc2Nyb2xsQmFyLnJlbW92ZSgpO1xuICAgICAgICBzY3JvbGxCYXIuZGVzdHJveSgpO1xuICAgICAgICBzY3JvbGxCYXIuZGVzdHJveVNlbGYoKTtcblxuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaW5zZXJ0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMuc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgdGhpcy5jdHggPSBjb250ZXh0O1xuXG4gICAgLyoqXG4gICAgICog6L+Z6YeM5pyJ5Liq6Z2e5bi454m55q6K55qE5YW85a656YC76L6R77yM5Zyo5L2O54mI5pys5rKh5pyJ6YeN5p6EIFNjcm9sbFZpZXfkuYvliY3vvIzlubbmsqHmnInmj5DkvpvljZXni6znmoQgU2Nyb2xsWCDlkowgU2Nyb2xsWSDlsZ7mgKdcbiAgICAgKiDogIzmmK/liKTmlq0gc2Nyb2xsSGVpaHQg5aSn5LqO5a655Zmo6auY5bqm55qE5pe25YCZ6Ieq5Yqo5a6e546w5LqG57q15ZCR5rua5Yqo77yI5LiU5rKh5pyJ5qiq5ZCR5rua5Yqo6IO95Yqb77yJXG4gICAgICog5Zug5q2k6L+Z6YeM5YGa5LiA5Liq5YW85a656YC76L6R77yM5aaC5p6cIHNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCDoh6rliqjlvIDlkK/nurXlkJHmu5rliqhcbiAgICAgKi9cbiAgICBpZiAodGhpcy5zY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQgJiYgdHlwZW9mIHRoaXMuc2Nyb2xsWVByb3AgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g6Ieq5Yqo5byA5ZCvIHNjcm9sbFlgKTtcbiAgICAgIHRoaXMuc2Nyb2xsWSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXZlbnRCaW5kKSB7XG4gICAgICAvLyByZWZsb3cg6auY5bqm5Y+v6IO95Lya5Y+Y5YyW77yM5Zug5q2k6ZyA6KaB5omn6KGMIHNldERpbWVuc2lvbnMg5Yi35paw5Y+v5rua5Yqo5Yy65Z+fXG4gICAgICBpZiAodGhpcy5sYXlvdXRCb3gud2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudEhlaWdodFxuICAgICAgICB8fCB0aGlzLnNjcm9sbFdpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnMoXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGgsXG4gICAgICAgICAgdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOi/memHjOS5i+aJgOS7peimgeW7tui/n+S4gOW4p+aYr+WboOS4uui/memHjOeahOWPmOWKqOadpeiHqiByZWZsb3cg5LmL5ZCO77yM5q2j5Zyo5YGaIHJlZmxvdyDkuYvlkI7nmoTlkI7nu63kuovmg4VcbiAgICAgICAgICog5aaC5p6c56uL5Y2z5L+u5pS55rua5Yqo5p2h55qE5qC35byP77yM5a6e6ZmF5LiK5bm25LiN5Lya55Sf5pWI44CCXG4gICAgICAgICAqL1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFknLCAndmVydGl2YWxTY3JvbGxiYXInKTtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuXG4gICAgICAvLyByZWZsb3cg5LmL5ZCO77yM5Lya5LuOIGNzc2xheW91dCDlkIzmraXluIPlsYDkv6Hmga/vvIzljp/lhYjnmoTmu5rliqjkv6Hmga/kvJrkuKLlpLHvvIzov5nph4zpnIDopoHkuIDkuKrlpI3kvY3nmoTmk43kvZxcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcyAmJiAhKGVsZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0aGlzLnNjcm9sbFRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSB0aGlzLnNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IHRydWU7XG5cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5zY3JvbGxlck9iaiA9IG5ldyBTY3JvbGxlcih0aGlzLnNjcm9sbEhhbmRsZXIuYmluZCh0aGlzKSwgdGhpcy5zY3JvbGxlck9wdGlvbik7XG5cbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zZXREaW1lbnNpb25zKHRoaXMubGF5b3V0Qm94LndpZHRoLCB0aGlzLmxheW91dEJveC5oZWlnaHQsIHRoaXMuc2Nyb2xsV2lkdGgsIHRoaXMuc2Nyb2xsSGVpZ2h0KTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnJvb3QudGlja2VyLm5leHQoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFknLCAndmVydGl2YWxTY3JvbGxiYXInKTtcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICB9LCB0cnVlKTtcblxuICAgIHRoaXMub24oJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoU3RhcnQodG91Y2hlcywgZS50aW1lU3RhbXApO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigndG91Y2htb3ZlJywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaE1vdmUodG91Y2hlcywgZS50aW1lU3RhbXAsIHVuZGVmaW5lZCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICAvLyDov5nph4zkuI3lupTor6XmmK/nm5HlkKxzY3JvbGx2aWV355qEdG91Y2hlbmTkuovku7bogIzmmK/lsY/luZXnmoR0b3VjaGVuZOS6i+S7tlxuICAgIHRoaXMucm9vdCEub24oJ3RvdWNoZW5kJywgKGUpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hFbmQoZS50aW1lU3RhbXApO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuICB9XG5cbiAgc2Nyb2xsVG8obGVmdCA9IDAsIHRvcCA9IDAsIGFuaW1hdGUgPSB0cnVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2Nyb2xsVG8obGVmdCwgdG9wLCBhbmltYXRlLCAxKTtcbiAgfVxufVxuIiwiY29uc3QgcmVmbG93QWZmZWN0ZWRTdHlsZXMgPSBbXG4gICd3aWR0aCcsICdoZWlnaHQnLFxuICAnbWluV2lkdGgnLCAnbWluSGVpZ2h0JyxcbiAgJ21heFdpZHRoJywgJ21heEhlaWdodCcsXG4gICdsZWZ0JywgJ3JpZ2h0JywgJ3RvcCcsICdib3R0b20nLFxuICAnbWFyZ2luJywgJ21hcmdpbkxlZnQnLCAnbWFyZ2luUmlnaHQnLCAnbWFyZ2luVG9wJywgJ21hcmdpbkJvdHRvbScsXG4gICdwYWRkaW5nJywgJ3BhZGRpbmdMZWZ0JywgJ3BhZGRpbmdSaWdodCcsICdwYWRkaW5nVG9wJywgJ3BhZGRpbmdCb3R0b20nLFxuICAnYm9yZGVyV2lkdGgnLCAnYm9yZGVyTGVmdFdpZHRoJywgJ2JvcmRlclJpZ2h0V2lkdGgnLCAnYm9yZGVyVG9wV2lkdGgnLCAnYm9yZGVyQm90dG9tV2lkdGgnLFxuICAnZmxleERpcmVjdGlvbicsXG4gICdmbGV4U2hyaW5rJyxcbiAgJ2ZsZXhHcm93JyxcbiAgJ2p1c3RpZnlDb250ZW50JyxcbiAgJ2FsaWduSXRlbXMnLCAnYWxpZ25TZWxmJyxcbiAgJ2ZsZXgnLFxuICAnZmxleFdyYXAnLFxuICAncG9zaXRpb24nLFxuICAnZm9udFdlaWdodCcsXG5dO1xuXG5jb25zdCByZXBhaW50QWZmZWN0ZWRTdHlsZXMgPSBbXG4gICdmb250U2l6ZScsXG4gICdsaW5lSGVpZ2h0JyxcbiAgJ3RleHRBbGlnbicsXG4gICd2ZXJ0aWNhbEFsaWduJyxcbiAgJ2NvbG9yJyxcbiAgJ2JhY2tncm91bmRDb2xvcicsXG4gICd0ZXh0T3ZlcmZsb3cnLFxuICAnbGV0dGVyU3BhY2luZycsXG4gICdib3JkZXJSYWRpdXMnLFxuICAnYm9yZGVyQ29sb3InLFxuICAnb3BhY2l0eScsXG4gICd0cmFuc2Zvcm0nLFxuICAndGV4dFN0cm9rZUNvbG9yJyxcbiAgJ3RleHRTdHJva2VXaWR0aCcsXG4gICd0ZXh0U2hhZG93Jyxcbl07XG5cbmNvbnN0IGFsbFN0eWxlcyA9IHJlZmxvd0FmZmVjdGVkU3R5bGVzLmNvbmNhdChyZXBhaW50QWZmZWN0ZWRTdHlsZXMpO1xuXG5pbnRlcmZhY2UgSVN0eWxlIHtcbiAgLy8gcmVmbG93QWZmZWN0ZWRTdHlsZXNcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgbWluV2lkdGg/OiBudW1iZXI7XG4gIG1pbkhlaWdodD86IG51bWJlcjtcbiAgbWF4V2lkdGg/OiBudW1iZXI7XG4gIG1heEhlaWdodD86IG51bWJlcjtcbiAgbGVmdD86IG51bWJlcjtcbiAgcmlnaHQ/OiBudW1iZXI7XG4gIHRvcD86IG51bWJlcjtcbiAgYm90dG9tPzogbnVtYmVyO1xuICBtYXJnaW4/OiBudW1iZXI7XG4gIG1hcmdpbkxlZnQ/OiBudW1iZXI7XG4gIG1hcmdpblJpZ2h0PzogbnVtYmVyO1xuICBtYXJnaW5Ub3A/OiBudW1iZXI7XG4gIG1hcmdpbkJvdHRvbT86IG51bWJlcjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgcGFkZGluZ0xlZnQ/OiBudW1iZXI7XG4gIHBhZGRpbmdSaWdodD86IG51bWJlcjtcbiAgcGFkZGluZ1RvcD86IG51bWJlcjtcbiAgcGFkZGluZ0JvdHRvbT86IG51bWJlcjtcbiAgYm9yZGVyV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckxlZnRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyUmlnaHRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyVG9wV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVdpZHRoPzogbnVtYmVyO1xuXG4gIGJvcmRlclRvcExlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlclRvcFJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21SaWdodFJhZGl1cz86IG51bWJlcjtcblxuICBmbGV4RGlyZWN0aW9uPzogJ2NvbHVtbicgfCAncm93JztcbiAgZmxleFNocmluaz86IG51bWJlcjtcbiAgZmxleEdyb3c/OiBudW1iZXI7XG4gIGZsZXhXcmFwPzogJ3dyYXAnIHwgJ25vd3JhcCc7XG4gIGp1c3RpZnlDb250ZW50PzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3NwYWNlLWJldHdlZW4nIHwgJ3NwYWNlLWFyb3VuZCc7XG4gIGFsaWduSXRlbXM/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIGFsaWduU2VsZj86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgcG9zaXRpb24/OiBzdHJpbmc7XG5cbiAgLy8gcmVwYWludEFmZmVjdGVkU3R5bGVzXG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBsaW5lSGVpZ2h0PzogbnVtYmVyIHwgJ3N0cmluZyc7XG4gIHRleHRBbGlnbj86ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbiAgdmVydGljYWxBbGlnbj86ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgdGV4dE92ZXJmbG93PzogJ2VsbGlwc2lzJyB8ICdjbGlwJztcbiAgbGV0dGVyU3BhY2luZz86IG51bWJlcjtcbiAgYm9yZGVyUmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyVG9wQ29sb3I/OiBzdHJpbmc7XG5cbiAgYmFja2dyb3VuZEltYWdlPzogc3RyaW5nO1xuICBib3JkZXJCb3R0b21Db2xvcj86IHN0cmluZztcbiAgYm9yZGVyTGVmdENvbG9yPzogc3RyaW5nO1xuICBib3JkZXJSaWdodENvbG9yPzogc3RyaW5nO1xuXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG5cbiAgdHJhbnNmb3JtPzogc3RyaW5nO1xuXG4gIC8vIOaWh+Wtl+aPj+i+ueeahOWuveW6pu+8jOm7mOiupOS4jeaPj+i+uVxuICB0ZXh0U3Ryb2tlV2lkdGg/OiBudW1iZXI7XG4gIC8vIOaWh+Wtl+aPj+i+ueeahOminOiJsu+8jOWmguaenOaMh+WumuS6huaPj+i+ueminOiJsuS9huaYr+ayoeacieaMh+WumuaPj+i+ueWuveW6pu+8jOaPj+i+ueWuveW6pum7mOiupOiuvue9ruS4ujFcbiAgdGV4dFN0cm9rZUNvbG9yPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDmloflrZfpmLTlvbHmlYjmnpzvvIx0ZXh0U2hhZG9355qE5qC85byP5bm25LiN5piv5Lil5qC855qEQ1NT5qC85byP77yM5LuF5pSv5oyB5Lik56eN5qC85byPXG4gICAqIHRleHRTaGFkb3c6IDFweCAxcHggMnB4IHBpbmtcbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcmVkLCAwIDAgMXB4IGJsdWUsIDAgMCAxcHggYmx1ZSwgMXB4IDFweCAycHggcmVkXG4gICAqIOS5n+WwseaYr+aUr+aMgeS7u+aEj+aVsOmHj+eahOmYtOW9seaViOaenO+8jOavj+S4qumYtOW9seaViOaenOeUseWbm+S4quWAvOaMh+Wumu+8jOWIhuWIq+aYryBzaGFkb3dPZmZzZXRYLCBzaGFkb3dPZmZzZXRZLCBzaGFkb3dCbHVyLCBzaGFkb3dDb2xvclxuICAgKi9cbiAgdGV4dFNoYWRvdz86IHN0cmluZztcbn1cblxuZXhwb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfTtcbiIsIlxuZnVuY3Rpb24gZGVncmVlc1RvUmFkaWFucyhkZWdyZWVzOiBudW1iZXIpIHtcbiAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG4vLyDml4vovaznmoTmraPliJnooajovr7lvI9cbmNvbnN0IHJvdGF0ZVJlZyA9IC9yb3RhdGVcXCgoXFxkKylkZWdcXCkvO1xuXG4vLyDog4zmma/lm77mraPliJnooajovr7lvI9cbmNvbnN0IGlzVmFsaWRVcmxQcm9wUmVnID0gL1xccyp1cmxcXCgoLio/KVxcKVxccyovO1xuXG5leHBvcnQgZnVuY3Rpb24gcm90YXRlUGFyc2VyKHZhbDogc3RyaW5nKSB7XG4gIGNvbnN0IG1hdGNoID0gdmFsLm1hdGNoKHJvdGF0ZVJlZyk7XG5cbiAgaWYgKG1hdGNoKSB7XG4gICAgcmV0dXJuIGRlZ3JlZXNUb1JhZGlhbnMocGFyc2VJbnQobWF0Y2hbMV0pKTtcbiAgfVxuXG4gIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3ZhbH0gaXMgbm90IGEgdmFsaWQgdHJhbnNmb3JtIHJvdGF0ZWApO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG4vLyDop6PmnpDog4zmma/lm77niYdcbmV4cG9ydCBmdW5jdGlvbiBiYWNrZ3JvdW5kSW1hZ2VQYXJzZXIodmFsOiBzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgbGlzdCA9IHZhbC5tYXRjaChpc1ZhbGlkVXJsUHJvcFJlZyk7XG5cbiAgICBpZiAobGlzdCkge1xuICAgICAgY29uc3QgdXJsID0gbGlzdFsxXS5yZXBsYWNlKC8oJ3xcIikvZywgJycpO1xuXG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cbiAgfVxuXG4gIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke3ZhbH0gaXMgbm90IGEgdmFsaWQgYmFja2dyb3VuZEltYWdlYCk7XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmNvbnN0IHRleHRTaGFkb3dSZWcgPSAvXihcXGQrcHhcXHMpezJ9XFxkK3B4XFxzW2EtekEtWl0rKCxcXHMqKFxcZCtweFxccyl7Mn1cXGQrcHhcXHNbYS16QS1aXSspKiQvO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICByZXR1cm4gdGV4dFNoYWRvd1JlZy50ZXN0KHRleHRTaGFkb3cpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAvLyDkvb/nlKjmraPliJnooajovr7lvI/pqozor4HmlbDlrZfmiJbpgJflj7fliIbpmpTnmoTmlbDlrZfvvIzlkI7pnaLlj6/ku6Xot5/lj6/pgInnmoTop5LluqbljZXkvY3vvIhkZWfvvIlcbiAgcmV0dXJuIC9eKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KCxcXHMqKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KSokLy50ZXN0KHZhbHVlKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVuZGVyRm9yTGF5b3V0IHtcbiAgcm90YXRlPzogbnVtYmVyOyAvLyB0cmFuc2Zvcm0gcm90YXRl6Kej5p6Q5LmL5ZCO5b6X5Yiw55qE5byn5bqm5Yi2XG4gIHNjYWxlWD86IG51bWJlcjtcbiAgc2NhbGVZPzogbnVtYmVyO1xufVxuXG5cbmNvbnN0IHRyYW5zZm9ybVJlZ2V4ID0gLyhcXHcrKVxcKChbXildKylcXCkvZztcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRyYW5zZm9ybSh0cmFuc2Zvcm06IHN0cmluZykge1xuICAvLyBjb25zdCByZXN1bHQgPSB7XG4gICAgLy8gcm90YXRlOiAwLFxuICAgIC8vIHNjYWxlWDogMSxcbiAgICAvLyBzY2FsZVk6IDEsXG4gICAgLy8gdHJhbnNsYXRlWDogMCxcbiAgICAvLyB0cmFuc2xhdGVZOiAwLFxuICAvLyB9O1xuXG4gIGNvbnN0IHJlc3VsdDogSVJlbmRlckZvckxheW91dCA9IHt9O1xuXG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdHJhbnNmb3JtUmVnZXguZXhlYyh0cmFuc2Zvcm0pKSkge1xuICAgIGNvbnN0IFssIG5hbWUsIHZhbHVlXSA9IG1hdGNoO1xuXG4gICAgaWYgKCFpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFtMYXlvdXRdOiBpbnZhbGlkIHZhbHVlIGZvciAke25hbWV9OiAke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgodmFsKSA9PiB2YWwudHJpbSgpLnJlcGxhY2UoJ2RlZycsICcnKSlcbiAgICAgIC5tYXAoTnVtYmVyKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgcmVzdWx0LnJvdGF0ZSA9IGRlZ3JlZXNUb1JhZGlhbnModmFsdWVzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzY2FsZSc6XG4gICAgICAgIHJlc3VsdC5zY2FsZVggPSB2YWx1ZXNbMF07XG4gICAgICAgIHJlc3VsdC5zY2FsZVkgPSB2YWx1ZXNbMV0gfHwgdmFsdWVzWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIGNhc2UgJ3RyYW5zbGF0ZSc6XG4gICAgICAvLyAgIHJlc3VsdC50cmFuc2xhdGVYID0gdmFsdWVzWzBdO1xuICAgICAgLy8gICByZXN1bHQudHJhbnNsYXRlWSA9IHZhbHVlc1sxXSB8fCAwO1xuICAgICAgLy8gICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnBhcnNlVHJhbnNmb3JtKCdyb3RhdGUoNDUpJyk7XG5wYXJzZVRyYW5zZm9ybSgncm90YXRlKDM2MGRlZyknKTtcbnBhcnNlVHJhbnNmb3JtKCd4eHh4Jyk7XG5wYXJzZVRyYW5zZm9ybSgnc2NhbGUoMyw0KScpOyIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52J1xuXG5jb25zdCBERUZBVUxUX0ZPTlRfRkFNSUxZID0gJ3NhbnMtc2VyaWYnO1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuXG5jb25zdCBnZXRDb250ZXh0ID0gKCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9PiB7XG4gIGlmIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBjb25zdCBjYW52YXMgPSBlbnYuY3JlYXRlQ2FudmFzKCk7XG4gIGNhbnZhcy53aWR0aCA9IDE7XG4gIGNhbnZhcy5oZWlnaHQgPSAxO1xuICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoKHN0eWxlOiBJU3R5bGUsIHZhbHVlOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udGV4dCA9IGdldENvbnRleHQoKTtcblxuICBjb250ZXh0LmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICdub3JtYWwnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7c3R5bGUuZm9udEZhbWlseSB8fCBERUZBVUxUX0ZPTlRfRkFNSUxZfWA7XG5cbiAgcmV0dXJuIGNvbnRleHQubWVhc3VyZVRleHQodmFsdWUpLndpZHRoIHx8IDA7XG59XG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KHZhbHVlOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGdldENvbnRleHQoKS5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gcGFyc2VUZXh0KHN0eWxlOiBJU3R5bGUsIHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG5cbiAgbGV0IG1heFdpZHRoID0gc3R5bGUud2lkdGggYXMgbnVtYmVyO1xuICBjb25zdCB3b3JkV2lkdGggPSBnZXRUZXh0V2lkdGgoc3R5bGUsIHZhbHVlKTtcblxuICAvLyDlr7nmloflrZfmuqLlh7rnmoTlpITnkIbvvIzpu5jorqTnlKguLi5cbiAgY29uc3QgdGV4dE92ZXJmbG93ID0gc3R5bGUudGV4dE92ZXJmbG93IHx8ICdlbGxpcHNpcyc7XG5cbiAgLy8g5paH5a2X5pyA5aSn6ZW/5bqm5LiN6LaF6ZmQ5Yi2XG4gIGlmICh3b3JkV2lkdGggPD0gbWF4V2lkdGgpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvLyDlr7nkuo7nlKjngrnngrnngrnlpITnkIbnmoTmg4XlhrXvvIzlhYjlsIbmnIDlpKflrr3luqblh4/ljrsuLi7nmoTlrr3luqZcbiAgaWYgKHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgIG1heFdpZHRoIC09IGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KCcuLi4nKTtcbiAgfVxuXG4gIGxldCBsZW5ndGggPSB2YWx1ZS5sZW5ndGggLSAxO1xuICBsZXQgc3RyID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG5cbiAgd2hpbGUgKGdldFRleHRXaWR0aFdpdGhvdXRTZXRGb250KHN0cikgPiBtYXhXaWR0aCAmJiBsZW5ndGggPiAwKSB7XG4gICAgbGVuZ3RoIC09IDE7XG4gICAgc3RyID0gdmFsdWUuc3Vic3RyaW5nKDAsIGxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gKGxlbmd0aCAmJiB0ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcydcbiAgICA/IGAke3N0cn0uLi5gXG4gICAgOiBzdHIpO1xufVxuXG5pbnRlcmZhY2UgSVRleHRQcm9wcyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgSVRleHRTaGFkb3cge1xuICBvZmZzZXRYOiBudW1iZXI7XG4gIG9mZnNldFk6IG51bWJlcjtcbiAgYmx1clJhZGl1czogbnVtYmVyO1xuICBjb2xvcjogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgdmFsdWVzcmMgPSAnJztcbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZVdpZHRoOiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcbiAgcHVibGljIHRleHRCYXNlbGluZTogQ2FudmFzVGV4dEJhc2VsaW5lID0gJ2JvdHRvbSc7XG4gIHB1YmxpYyBmb250ID0gJyc7XG4gIHB1YmxpYyB0ZXh0QWxpZ246IENhbnZhc1RleHRBbGlnbiA9ICdsZWZ0JztcbiAgcHVibGljIGZpbGxTdHlsZSA9ICcjMDAwMDAwJztcblxuICBwdWJsaWMgdGV4dFNoYWRvd3MhOiBudWxsIHwgSVRleHRTaGFkb3dbXTtcbiAgXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHZhbHVlID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSVRleHRQcm9wcykge1xuICAgIGxldCBvcmlnaW5TdHlsZVdpZHRoID0gc3R5bGUud2lkdGg7XG4gICAgLy8g5rKh5pyJ6K6+572u5a695bqm55qE5pe25YCZ6YCa6L+HY2FudmFz6K6h566X5Ye65paH5a2X5a695bqmXG4gICAgaWYgKG9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgoc3R5bGUsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKHN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgdmFsdWUgPSBwYXJzZVRleHQoc3R5bGUsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLmhlaWdodCA9IHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyIHx8IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIH1cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVGV4dCc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcbiAgICB0aGlzLm9yaWdpblN0eWxlV2lkdGggPSBvcmlnaW5TdHlsZVdpZHRoO1xuXG4gICAgaWYgKHN0eWxlLnRleHRTaGFkb3cpIHtcbiAgICAgIHRoaXMucGFyc2VUZXh0U2hhZG93KHN0eWxlLnRleHRTaGFkb3cpO1xuICAgIH1cbiAgfVxuXG4gIHN0eWxlQ2hhbmdlSGFuZGxlcihwcm9wOiBzdHJpbmcsIHZhbDogYW55KSB7XG4gICAgaWYgKHByb3AgPT09ICd0ZXh0U2hhZG93Jykge1xuICAgICAgdGhpcy5wYXJzZVRleHRTaGFkb3codmFsKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHBhcnNlVGV4dFNoYWRvdyh0ZXh0U2hhZG93OiBzdHJpbmcpIHtcbiAgICAvLyBpZiAoIWlzVmFsaWRUZXh0U2hhZG93KHRleHRTaGFkb3cpKSB7XG4gICAgLy8gICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XTogJHt0ZXh0U2hhZG93fSBpcyBub3QgYSB2YWxpZCB0ZXh0U2hhZG93YCk7XG4gICAgLy8gfSBlbHNlIHtcbiAgICAgIC8vIOino+aekCB0ZXh0LXNoYWRvdyDlrZfnrKbkuLJcbiAgICAgIHRoaXMudGV4dFNoYWRvd3MgPSB0ZXh0U2hhZG93LnNwbGl0KCcsJykubWFwKHNoYWRvdyA9PiB7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gc2hhZG93LnRyaW0oKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICBjb25zdCBvZmZzZXRYID0gcGFyc2VGbG9hdChwYXJ0c1swXSk7XG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBwYXJzZUZsb2F0KHBhcnRzWzFdKTtcbiAgICAgICAgY29uc3QgYmx1clJhZGl1cyA9IHBhcnNlRmxvYXQocGFydHNbMl0pO1xuICAgICAgICBjb25zdCBjb2xvciA9IHBhcnRzWzNdO1xuXG4gICAgICAgIHJldHVybiB7IG9mZnNldFgsIG9mZnNldFksIGJsdXJSYWRpdXMsIGNvbG9yIH07XG4gICAgICB9KTtcbiAgICAvLyB9XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWUpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIGlmICh0aGlzLm9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBwYXJzZVRleHQodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG4gICAgICBsZXQgeyBwYXJlbnQgfSA9IHRoaXM7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0NhbnZhc0RhdGEoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuXG4gICAgdGhpcy5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdGhpcy5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuICAgIHRoaXMudGV4dEFsaWduID0gc3R5bGUudGV4dEFsaWduIHx8ICdsZWZ0JztcbiAgICB0aGlzLmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yIHx8ICcjMDAwJztcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy50b0NhbnZhc0RhdGEoKTtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZTtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGxldCB7IG5lZWRTdHJva2UsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICBjdHgudGV4dEJhc2VsaW5lID0gdGhpcy50ZXh0QmFzZWxpbmU7XG4gICAgY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgY3R4LnRleHRBbGlnbiA9IHRoaXMudGV4dEFsaWduO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG5cbiAgICBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBkcmF3WCArPSB3aWR0aCAvIDI7XG4gICAgfSBlbHNlIGlmICh0aGlzLnRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgZHJhd1ggKz0gd2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIC8vIOe6ueeQhuaWh+Wtl+aPj+i+uVxuICAgIGlmIChzdHlsZS50ZXh0U3Ryb2tlQ29sb3IpIHtcbiAgICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS50ZXh0U3Ryb2tlV2lkdGggfHwgMTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLnRleHRTdHJva2VDb2xvciBhcyBzdHJpbmc7XG5cbiAgICAgIGN0eC5zdHJva2VUZXh0KFxuICAgICAgICB0aGlzLnZhbHVlLFxuICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgIGRyYXdZIC0gb3JpZ2luWSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8g5aSE55CG5paH5a2X6Zi05b2xXG4gICAgaWYgKHRoaXMudGV4dFNoYWRvd3MpIHtcbiAgICAgIHRoaXMudGV4dFNoYWRvd3MuZm9yRWFjaCgoeyBvZmZzZXRYLCBvZmZzZXRZLCBibHVyUmFkaXVzLCBjb2xvciB9KSA9PiB7XG4gICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gb2Zmc2V0WDtcbiAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBvZmZzZXRZO1xuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IGJsdXJSYWRpdXM7XG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IGNvbG9yO1xuICAgICAgICBjdHguZmlsbFRleHQoXG4gICAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgICBkcmF3WCAtIG9yaWdpblgsXG4gICAgICAgICAgZHJhd1kgLSBvcmlnaW5ZLFxuICAgICAgICApO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN0eC5maWxsVGV4dChcbiAgICAgICAgdGhpcy52YWx1ZSxcbiAgICAgICAgZHJhd1ggLSBvcmlnaW5YLFxuICAgICAgICBkcmF3WSAtIG9yaWdpblksXG4gICAgICApOyAgXG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJRWxlbWVudE9wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVmlldyc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCB7IG5lZWRTdHJva2UsIG5lZWRDbGlwLCBvcmlnaW5YLCBvcmlnaW5ZIH0gPSB0aGlzLmJhc2VSZW5kZXIoKTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tIFwiLi90eXBlc1wiO1xuXG5pZiAodHlwZW9mIEdhbWVHbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gIEdhbWVHbG9iYWwuX19lbnYgPSBHYW1lR2xvYmFsLnd4IHx8IEdhbWVHbG9iYWwudHQgfHwgR2FtZUdsb2JhbC5zd2FuO1xufVxuXG5jb25zdCBkb21FdmVudE1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgdG91Y2hzdGFydDogJ21vdXNlZG93bicsXG4gIHRvdWNobW92ZTogJ21vdXNlbW92ZScsXG4gIHRvdWNoZW5kOiAnbW91c2V1cCcsXG4gIHRvdWNoY2FuY2VsOiAnbW91c2VsZWF2ZScsXG59XG5cbmVudW0gZXZlbnRUeXBlIHtcbiAgb24gPSAnb24nLFxuICBvZmYgPSAnb2ZmJyxcbn1cblxuZnVuY3Rpb24gZ2VuRG9tVG91Y2hFdmVudChldmVudDogc3RyaW5nLCB0eXBlOiBldmVudFR5cGUpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGxpc3RlbmVyOiBDYWxsYmFjaykge1xuICAgICAgdHlwZSA9PT0gZXZlbnRUeXBlLm9uID9cbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgbGlzdGVuZXIsIGZhbHNlKVxuICAgICAgICA6IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSlcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0T25Ub3VjaEhhbmRsZXIoZXZlbnQ6IHN0cmluZywgdHlwZTogZXZlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gR2FtZUdsb2JhbC5fX2VudltgJHt0eXBlfSR7ZXZlbnR9YF1cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZ2VuRG9tVG91Y2hFdmVudChkb21FdmVudE1hcFtldmVudC50b0xvd2VyQ2FzZSgpXSwgdHlwZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBMYXlvdXQg5Y+v6IO955So5Zyo5LiN55So55qE5bmz5Y+w77yM6ICMTGF5b3V05Lya5L6d6LWW5bmz5Y+w5LiL6Z2i55qE5LiA5Lqb5pa55rOV5p2l5a6e546w5YW35L2T55qE5Yqf6IO977yM5q+U5aaC5Yib5bu65Zu+54mHXG4gKiDkuLrkuobmm7Tlpb3lgZrlubPlj7DpgILphY3vvIznu5/kuIDlsIHoo4UgZW52IOaooeWdl++8jOS4jeWQjOW5s+WPsOimgeWBmumAgumFje+8jOabv+aNoiBlbnYg55qE5YW35L2T5pa55rOV5Y2z5Y+vXG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLy8g55uR5ZCs6Kem5pG455u45YWz5LqL5Lu2XG4gIG9uVG91Y2hTdGFydDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoU3RhcnQnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoTW92ZTogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoTW92ZScsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hFbmQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaEVuZCcsIGV2ZW50VHlwZS5vbiksXG4gIG9uVG91Y2hDYW5jZWw6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaENhbmNlbCcsIGV2ZW50VHlwZS5vbiksXG4gIC8vIOWPlua2iOebkeWQrOinpuaRuOebuOWFs+S6i+S7tlxuICBvZmZUb3VjaFN0YXJ0OiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hTdGFydCcsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaE1vdmU6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaE1vdmUnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hFbmQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaEVuZCcsIGV2ZW50VHlwZS5vZmYpLFxuICBvZmZUb3VjaENhbmNlbDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoQ2FuY2VsJywgZXZlbnRUeXBlLm9mZiksXG5cbiAgLy8gTGF5b3V0IOaUr+aMgeeZvuWIhuavlOagt+W8j++8jOWmguaenOagueiKgueCueagt+W8j+iuvue9ruS4uiAxMDAl77yM55u05o6l5Y+WIENhbnZhcyDnmoTlsLrlr7jvvIzkuI3lkIzlubPlj7DnmoTlj5bms5XkuI3kuIDmoLfvvIzlm6DmraTljZXni6zmj5Dkvpvlh73mlbBcbiAgZ2V0Um9vdENhbnZhc1NpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcgJiYgX19lbnYuZ2V0U2hhcmVkQ2FudmFzKSB7XG4gICAgICBjb25zdCBjdnMgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBjdnMud2lkdGgsXG4gICAgICAgIGhlaWdodDogY3ZzLmhlaWdodCxcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IDMwMCxcbiAgICAgICAgaGVpZ2h0OiAxNTAsXG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8vIOWPluW9k+WJjeiuvuWkh+eahCBkZXZpY2VQaXhlbFJhdGlv77yM5LiN5ZCM5bmz5Y+w55qE5Y+W5rOV5LiN5LiA5qC3XG4gIGdldERldmljZVBpeGVsUmF0aW8oKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcgJiYgX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMpIHtcbiAgICAgIHJldHVybiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYygpLmRldmljZVBpeGVsUmF0aW87XG4gICAgfSBlbHNlIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykge1xuICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG4gIH0sXG5cbiAgLy8g5Yib5bu6Q2FudmFzXG4gIGNyZWF0ZUNhbnZhcygpIHtcbiAgICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIF9fZW52LmNyZWF0ZUNhbnZhcygpO1xuICAgIH1cblxuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgfSxcblxuICAvLyDliJvlu7rlm77niYdcbiAgY3JlYXRlSW1hZ2UoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBfX2Vudi5jcmVhdGVJbWFnZSgpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBjb252ZXJ0VG9Kc29uID0gZnVuY3Rpb24obm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBqT2JqID0ge1xuICAgIG5hbWU6IG5vZGUudGFnbmFtZVxuICB9O1xuXG4gIC8vd2hlbiBubyBjaGlsZCBub2RlIG9yIGF0dHIgaXMgcHJlc2VudFxuICBpZiAoKCFub2RlLmNoaWxkIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmNoaWxkKSkgJiYgKCFub2RlLmF0dHJzTWFwIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmF0dHJzTWFwKSkpIHtcbiAgICByZXR1cm4gdXRpbC5pc0V4aXN0KG5vZGUudmFsKSAmJiAhIW5vZGUudmFsID8gbm9kZS52YWwgOiBqT2JqO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlIGNyZWF0ZSBhIHRleHRub2RlIGlmIG5vZGUgaGFzIHNvbWUgdGV4dFxuICAgIGlmICh1dGlsLmlzRXhpc3Qobm9kZS52YWwpKSB7XG4gICAgICBpZiAoISh0eXBlb2Ygbm9kZS52YWwgPT09ICdzdHJpbmcnICYmIChub2RlLnZhbCA9PT0gJycgfHwgbm9kZS52YWwgPT09IG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXIpKSkge1xuICAgICAgICBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBbIG5vZGUudmFsIF07XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gbm9kZS52YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHV0aWwubWVyZ2Uoak9iaiwgbm9kZS5hdHRyc01hcCwgb3B0aW9ucy5hcnJheU1vZGUpO1xuXG4gIGpPYmouY2hpbGRyZW4gPSBbXTtcbiAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCBjaGlsZCA9PiB7XG4gICAgak9iai5jaGlsZHJlbi5wdXNoKGNvbnZlcnRUb0pzb24oY2hpbGQsIG9wdGlvbnMpKVxuICB9KTtcblxuICAvL2FkZCB2YWx1ZVxuICByZXR1cm4gak9iajtcbn07XG5cbmV4cG9ydHMuY29udmVydFRvSnNvbiA9IGNvbnZlcnRUb0pzb247XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5vZGVUb0pzb24gPSByZXF1aXJlKCcuL25vZGUyanNvbicpO1xuY29uc3QgeG1sVG9Ob2Rlb2JqID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgeDJ4bWxub2RlID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMsIHZhbGlkYXRpb25PcHRpb24pIHtcbiAgIGlmKCB2YWxpZGF0aW9uT3B0aW9uKXtcbiAgICAgaWYodmFsaWRhdGlvbk9wdGlvbiA9PT0gdHJ1ZSkgdmFsaWRhdGlvbk9wdGlvbiA9IHt9XG5cbiAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yLnZhbGlkYXRlKHhtbERhdGEsIHZhbGlkYXRpb25PcHRpb24pO1xuICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgdGhyb3cgRXJyb3IoIHJlc3VsdC5lcnIubXNnKVxuICAgICB9XG4gICB9XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgeDJ4bWxub2RlLmRlZmF1bHRPcHRpb25zLCB4MnhtbG5vZGUucHJvcHMpO1xuICByZXR1cm4gbm9kZVRvSnNvbi5jb252ZXJ0VG9Kc29uKHhtbFRvTm9kZW9iai5nZXRUcmF2ZXJzYWxPYmooeG1sRGF0YSwgb3B0aW9ucyksIG9wdGlvbnMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRBbGxNYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgd2hpbGUgKG1hdGNoKSB7XG4gICAgY29uc3QgYWxsbWF0Y2hlcyA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCsrKSB7XG4gICAgICBhbGxtYXRjaGVzLnB1c2gobWF0Y2hbaW5kZXhdKTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGFsbG1hdGNoZXMpO1xuICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB9XG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuY29uc3QgZG9lc01hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgcmV0dXJuICEobWF0Y2ggPT09IG51bGwgfHwgdHlwZW9mIG1hdGNoID09PSAndW5kZWZpbmVkJyk7XG59O1xuXG5jb25zdCBkb2VzTm90TWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIHJldHVybiAhZG9lc01hdGNoKHN0cmluZywgcmVnZXgpO1xufTtcblxuZXhwb3J0cy5pc0V4aXN0ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgIT09ICd1bmRlZmluZWQnO1xufTtcblxuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbi8qKlxuICogQ29weSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYSBpbnRvIGIuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHBhcmFtIHsqfSBhXG4gKi9cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIGEsIGFycmF5TW9kZSkge1xuICBpZiAoYSkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhKTsgLy8gd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Ygb3duIHByb3BlcnRpZXNcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmKGFycmF5TW9kZSA9PT0gJ3N0cmljdCcpe1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBbIGFba2V5c1tpXV0gXTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBhW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbi8qIGV4cG9ydHMubWVyZ2UgPWZ1bmN0aW9uIChiLGEpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihiLGEpO1xufSAqL1xuXG5leHBvcnRzLmdldFZhbHVlID0gZnVuY3Rpb24odikge1xuICBpZiAoZXhwb3J0cy5pc0V4aXN0KHYpKSB7XG4gICAgcmV0dXJuIHY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vLyBjb25zdCBmYWtlQ2FsbCA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gYTt9O1xuLy8gY29uc3QgZmFrZUNhbGxOb1JldHVybiA9IGZ1bmN0aW9uKCkge307XG5cbmV4cG9ydHMuYnVpbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKSB7XG4gIHZhciBuZXdPcHRpb25zID0ge307XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybiBkZWZhdWx0T3B0aW9uczsgLy9pZiB0aGVyZSBhcmUgbm90IG9wdGlvbnNcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1twcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBvcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBkZWZhdWx0T3B0aW9uc1twcm9wc1tpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdPcHRpb25zO1xufTtcblxuZXhwb3J0cy5kb2VzTWF0Y2ggPSBkb2VzTWF0Y2g7XG5leHBvcnRzLmRvZXNOb3RNYXRjaCA9IGRvZXNOb3RNYXRjaDtcbmV4cG9ydHMuZ2V0QWxsTWF0Y2hlcyA9IGdldEFsbE1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL0EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgbG9jYWxlUmFuZ2U6ICdhLXpBLVonLFxufTtcblxuY29uc3QgcHJvcHMgPSBbJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLCAnbG9jYWxlUmFuZ2UnXTtcblxuLy9jb25zdCB0YWdzUGF0dGVybiA9IG5ldyBSZWdFeHAoXCI8XFxcXC8/KFtcXFxcdzpcXFxcLV9cXC5dKylcXFxccypcXC8/PlwiLFwiZ1wiKTtcbmV4cG9ydHMudmFsaWRhdGUgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB1dGlsLmJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIlwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXlxccyo8XFw/eG1sLio/XFw/PikvZyxcIlwiKTsvL1JlbW92ZSBYTUwgc3RhcnRpbmcgdGFnXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKDwhRE9DVFlQRVtcXHNcXHdcXFwiXFwuXFwvXFwtXFw6XSsoXFxbLipcXF0pKlxccyo+KS9nLFwiXCIpOy8vUmVtb3ZlIERPQ1RZUEVcblxuICBjb25zdCB0YWdzID0gW107XG4gIGxldCB0YWdGb3VuZCA9IGZhbHNlO1xuICBpZiAoeG1sRGF0YVswXSA9PT0gJ1xcdWZlZmYnKSB7XG4gICAgLy8gY2hlY2sgZm9yIGJ5dGUgb3JkZXIgbWFyayAoQk9NKVxuICAgIHhtbERhdGEgPSB4bWxEYXRhLnN1YnN0cigxKTtcbiAgfVxuICBjb25zdCByZWd4QXR0ck5hbWUgPSBuZXcgUmVnRXhwKCdeW193XVtcXFxcd1xcXFwtLjpdKiQnLnJlcGxhY2UoJ193JywgJ18nICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBjb25zdCByZWd4VGFnTmFtZSA9IG5ldyBSZWdFeHAoJ14oW3ddfF8pW1xcXFx3LlxcXFwtXzpdKicucmVwbGFjZSgnKFt3JywgJyhbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgLy9zdGFydGluZyBvZiB0YWdcbiAgICAgIC8vcmVhZCB1bnRpbCB5b3UgcmVhY2ggdG8gJz4nIGF2b2lkaW5nIGFueSAnPicgaW4gYXR0cmlidXRlIHZhbHVlXG5cbiAgICAgIGkrKztcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPycpIHtcbiAgICAgICAgaSA9IHJlYWRQSSh4bWxEYXRhLCArK2kpO1xuICAgICAgICBpZiAoaS5lcnIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnIScpIHtcbiAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsb3NpbmdUYWcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcvJykge1xuICAgICAgICAgIC8vY2xvc2luZyB0YWdcbiAgICAgICAgICBjbG9zaW5nVGFnID0gdHJ1ZTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWFkIHRhZ25hbWVcbiAgICAgICAgbGV0IHRhZ05hbWUgPSAnJztcbiAgICAgICAgZm9yIChcbiAgICAgICAgICA7XG4gICAgICAgICAgaSA8IHhtbERhdGEubGVuZ3RoICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJz4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJyAnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcdCcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxuJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHInO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICB0YWdOYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUudHJpbSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRhZ05hbWUpO1xuXG4gICAgICAgIGlmICh0YWdOYW1lW3RhZ05hbWUubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZyB3aXRob3V0IGF0dHJpYnV0ZXNcbiAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHJpbmcoMCwgdGFnTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbGlkYXRlVGFnTmFtZSh0YWdOYW1lLCByZWd4VGFnTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnVGFnICcgKyB0YWdOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ0F0dHJpYnV0ZXMgZm9yIFwiJyArIHRhZ05hbWUgKyAnXCIgaGF2ZSBvcGVuIHF1b3RlLid9fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0clN0ciA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaSA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgICBpZiAoYXR0clN0clthdHRyU3RyLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICBhdHRyU3RyID0gYXR0clN0ci5zdWJzdHJpbmcoMCwgYXR0clN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgLy9jb250aW51ZTsgLy90ZXh0IG1heSBwcmVzZW50cyBhZnRlciBzZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjbG9zaW5nVGFnKSB7XG4gICAgICAgICAgaWYoIXJlc3VsdC50YWdDbG9zZWQpe1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGRvbid0IGhhdmUgcHJvcGVyIGNsb3NpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9ZWxzZSBpZiAoYXR0clN0ci50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGNhbid0IGhhdmUgYXR0cmlidXRlcyBvciBpbnZhbGlkIHN0YXJ0aW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG90ZyA9IHRhZ3MucG9wKCk7XG4gICAgICAgICAgICBpZiAodGFnTmFtZSAhPT0gb3RnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyAnICsgb3RnICsgJyBpcyBleHBlY3RlZCBpbnBsYWNlIG9mICcgKyB0YWdOYW1lICsgJy4nfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWdzLnB1c2godGFnTmFtZSk7XG4gICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9za2lwIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIC8vSXQgbWF5IGluY2x1ZGUgY29tbWVudHMgYW5kIENEQVRBIHZhbHVlXG4gICAgICAgIGZvciAoaSsrOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICAgIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgICAgIC8vY29tbWVudCBvciBDQURBVEFcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy9lbmQgb2YgcmVhZGluZyB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnICcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcdCcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcbicgfHwgeG1sRGF0YVtpXSA9PT0gJ1xccicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQ2hhcicsIG1zZzogJ2NoYXIgJyArIHhtbERhdGFbaV0gKyAnIGlzIG5vdCBleHBlY3RlZCAuJ319O1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGFnRm91bmQpIHtcbiAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnU3RhcnQgdGFnIGV4cGVjdGVkLid9fTtcbiAgfSBlbHNlIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdJbnZhbGlkICcgKyBKU09OLnN0cmluZ2lmeSh0YWdzLCBudWxsLCA0KS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKSArICcgZm91bmQuJ30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWFkIFByb2Nlc3NpbmcgaW5zc3RydWN0aW9ucyBhbmQgc2tpcFxuICogQHBhcmFtIHsqfSB4bWxEYXRhXG4gKiBAcGFyYW0geyp9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZFBJKHhtbERhdGEsIGkpIHtcbiAgdmFyIHN0YXJ0ID0gaTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT0gJz8nIHx8IHhtbERhdGFbaV0gPT0gJyAnKSB7XG4gICAgICAvL3RhZ25hbWVcbiAgICAgIHZhciB0YWduYW1lID0geG1sRGF0YS5zdWJzdHIoc3RhcnQsIGkgLSBzdGFydCk7XG4gICAgICBpZiAoaSA+IDUgJiYgdGFnbmFtZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1hNTCBkZWNsYXJhdGlvbiBhbGxvd2VkIG9ubHkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudC4nfX07XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT0gJz8nICYmIHhtbERhdGFbaSArIDFdID09ICc+Jykge1xuICAgICAgICAvL2NoZWNrIGlmIHZhbGlkIGF0dHJpYnV0IHN0cmluZ1xuICAgICAgICBpKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpO1xufVxuXG5mdW5jdGlvbiByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpIHtcbiAgaWYgKHhtbERhdGEubGVuZ3RoID4gaSArIDUgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJy0nKSB7XG4gICAgLy9jb21tZW50XG4gICAgZm9yIChpICs9IDM7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA4ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnTycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnWScgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ1AnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdFJ1xuICApIHtcbiAgICBsZXQgYW5nbGVCcmFja2V0c0NvdW50ID0gMTtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQtLTtcbiAgICAgICAgaWYgKGFuZ2xlQnJhY2tldHNDb3VudCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDkgJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ1snICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ1snXG4gICkge1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaTtcbn1cblxudmFyIGRvdWJsZVF1b3RlID0gJ1wiJztcbnZhciBzaW5nbGVRdW90ZSA9IFwiJ1wiO1xuXG4vKipcbiAqIEtlZXAgcmVhZGluZyB4bWxEYXRhIHVudGlsICc8JyBpcyBmb3VuZCBvdXRzaWRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30geG1sRGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKSB7XG4gIGxldCBhdHRyU3RyID0gJyc7XG4gIGxldCBzdGFydENoYXIgPSAnJztcbiAgbGV0IHRhZ0Nsb3NlZCA9IGZhbHNlO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gZG91YmxlUXVvdGUgfHwgeG1sRGF0YVtpXSA9PT0gc2luZ2xlUXVvdGUpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9IHhtbERhdGFbaV07XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0Q2hhciAhPT0geG1sRGF0YVtpXSkge1xuICAgICAgICAvL2lmIHZhdWUgaXMgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGUgdGhlbiBzaW5nbGUgcXVvdGVzIGFyZSBhbGxvd2VkIGluc2lkZSB0aGUgdmFsdWUgYW5kIHZpY2UgdmVyc2FcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydENoYXIgPSAnJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgdGFnQ2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGF0dHJTdHIgKz0geG1sRGF0YVtpXTtcbiAgfVxuICBpZiAoc3RhcnRDaGFyICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7dmFsdWU6IGF0dHJTdHIsIGluZGV4OiBpLCB0YWdDbG9zZWQ6IHRhZ0Nsb3NlZH07XG59XG5cbi8qKlxuICogU2VsZWN0IGFsbCB0aGUgYXR0cmlidXRlcyB3aGV0aGVyIHZhbGlkIG9yIGludmFsaWQuXG4gKi9cbmNvbnN0IHZhbGlkQXR0clN0clJlZ3hwID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoW15cXFxccz1dKykoXFxcXHMqPSk/KFxcXFxzKihbXFwnXCJdKSgoW1xcXFxzXFxcXFNdKSo/KVxcXFw1KT8nLCAnZycpO1xuXG4vL2F0dHIsID1cInNkXCIsIGE9XCJhbWl0J3NcIiwgYT1cInNkXCJiPVwic2FmXCIsIGFiICBjZD1cIlwiXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSkge1xuICAvL2NvbnNvbGUubG9nKFwic3RhcnQ6XCIrYXR0clN0citcIjplbmRcIik7XG5cbiAgLy9pZihhdHRyU3RyLnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlOyAvL2VtcHR5IHN0cmluZ1xuXG4gIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgdmFsaWRBdHRyU3RyUmVneHApO1xuICBjb25zdCBhdHRyTmFtZXMgPSB7fTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NvbnNvbGUubG9nKG1hdGNoZXNbaV0pO1xuXG4gICAgaWYgKG1hdGNoZXNbaV1bMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAvL25vc3BhY2UgYmVmb3JlIGF0dHJpYnV0ZSBuYW1lOiBhPVwic2RcImI9XCJzYWZcIlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGhhcyBubyBzcGFjZSBpbiBzdGFydGluZy4nfX07XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzW2ldWzNdID09PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgLy9pbmRlcGVuZGVudCBhdHRyaWJ1dGU6IGFiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2Jvb2xlYW4gYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBpcyBub3QgYWxsb3dlZC4nfX07XG4gICAgfVxuICAgIC8qIGVsc2UgaWYobWF0Y2hlc1tpXVs2XSA9PT0gdW5kZWZpbmVkKXsvL2F0dHJpYnV0ZSB3aXRob3V0IHZhbHVlOiBhYj1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiB7IGNvZGU6XCJJbnZhbGlkQXR0clwiLG1zZzpcImF0dHJpYnV0ZSBcIiArIG1hdGNoZXNbaV1bMl0gKyBcIiBoYXMgbm8gdmFsdWUgYXNzaWduZWQuXCJ9fTtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgY29uc3QgYXR0ck5hbWUgPSBtYXRjaGVzW2ldWzJdO1xuICAgIGlmICghdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSkge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgIH1cbiAgICAvKmlmICghYXR0ck5hbWVzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkgeyovXG4gICAgaWYgKCAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJOYW1lcywgYXR0ck5hbWUpKSB7XG4gICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGUgYXR0cmlidXRlLlxuICAgICAgYXR0ck5hbWVzW2F0dHJOYW1lXSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgcmVwZWF0ZWQuJ319O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IC9eW19hLXpBLVpdW1xcd1xcLS46XSokLztcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSB7XG4gIC8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gbmV3IFJlZ0V4cChyZWd4QXR0ck5hbWUpO1xuICByZXR1cm4gdXRpbC5kb2VzTWF0Y2goYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSk7XG59XG5cbi8vY29uc3Qgc3RhcnRzV2l0aFhNTCA9IG5ldyBSZWdFeHAoXCJeW1h4XVtNbV1bTGxdXCIpO1xuLy8gIHN0YXJ0c1dpdGggPSAvXihbYS16QS1aXXxfKVtcXHcuXFwtXzpdKi87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVGFnTmFtZSh0YWduYW1lLCByZWd4VGFnTmFtZSkge1xuICAvKmlmKHV0aWwuZG9lc01hdGNoKHRhZ25hbWUsc3RhcnRzV2l0aFhNTCkpIHJldHVybiBmYWxzZTtcbiAgICBlbHNlKi9cbiAgcmV0dXJuICF1dGlsLmRvZXNOb3RNYXRjaCh0YWduYW1lLCByZWd4VGFnTmFtZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFnbmFtZSwgcGFyZW50LCB2YWwpIHtcbiAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuY2hpbGQgPSB7fTsgLy9jaGlsZCB0YWdzXG4gIHRoaXMuYXR0cnNNYXAgPSB7fTsgLy9hdHRyaWJ1dGVzIG1hcFxuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMudmFsID0gdmFsOyAvL3RleHQgb25seVxuICB0aGlzLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0pKSB7XG4gICAgICAvL2FscmVhZHkgcHJlc2VudHNcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0gPSBbY2hpbGRdO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHhtbE5vZGUgPSByZXF1aXJlKCcuL3htbE5vZGUnKTtcbmNvbnN0IFRhZ1R5cGUgPSB7T1BFTklORzogMSwgQ0xPU0lORzogMiwgU0VMRjogMywgQ0RBVEE6IDR9O1xubGV0IHJlZ3ggPVxuICAnPCgoIVxcXFxbQ0RBVEFcXFxcWyhbXFxcXHNcXFxcU10qPykoXV0+KSl8KChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKShbXj5dKik+fCgoXFxcXC8pKChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKVxcXFxzKj4pKShbXjxdKiknO1xuXG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/W1xcXFx3OlxcXFwtXFwuX10rKShbXj5dKik+KFxcXFxzKlwiK2NkYXRhUmVneCtcIikqKFtePF0rKT9cIixcImdcIik7XG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/KSgoXFxcXHcqOik/KFtcXFxcdzpcXFxcLVxcLl9dKykpKFtePl0qKT4oW148XSopKFwiK2NkYXRhUmVneCtcIihbXjxdKikpKihbXjxdKyk/XCIsXCJnXCIpO1xuXG4vL3BvbHlmaWxsXG5pZiAoIU51bWJlci5wYXJzZUludCAmJiB3aW5kb3cucGFyc2VJbnQpIHtcbiAgTnVtYmVyLnBhcnNlSW50ID0gd2luZG93LnBhcnNlSW50O1xufVxuaWYgKCFOdW1iZXIucGFyc2VGbG9hdCAmJiB3aW5kb3cucGFyc2VGbG9hdCkge1xuICBOdW1iZXIucGFyc2VGbG9hdCA9IHdpbmRvdy5wYXJzZUZsb2F0O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYXR0cmlidXRlTmFtZVByZWZpeDogJ0BfJyxcbiAgYXR0ck5vZGVOYW1lOiBmYWxzZSxcbiAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICBpZ25vcmVBdHRyaWJ1dGVzOiB0cnVlLFxuICBpZ25vcmVOYW1lU3BhY2U6IGZhbHNlLFxuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9hIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIC8vaWdub3JlUm9vdEVsZW1lbnQgOiBmYWxzZSxcbiAgcGFyc2VOb2RlVmFsdWU6IHRydWUsXG4gIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICBhcnJheU1vZGU6IGZhbHNlLFxuICB0cmltVmFsdWVzOiB0cnVlLCAvL1RyaW0gc3RyaW5nIHZhbHVlcyBvZiB0YWcgYW5kIGF0dHJpYnV0ZXNcbiAgY2RhdGFUYWdOYW1lOiBmYWxzZSxcbiAgY2RhdGFQb3NpdGlvbkNoYXI6ICdcXFxcYycsXG4gIGxvY2FsZVJhbmdlOiAnJyxcbiAgdGFnVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgYXR0clZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIHN0b3BOb2RlczogW11cbiAgLy9kZWNvZGVTdHJpY3Q6IGZhbHNlLFxufTtcblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5jb25zdCBwcm9wcyA9IFtcbiAgJ2F0dHJpYnV0ZU5hbWVQcmVmaXgnLFxuICAnYXR0ck5vZGVOYW1lJyxcbiAgJ3RleHROb2RlTmFtZScsXG4gICdpZ25vcmVBdHRyaWJ1dGVzJyxcbiAgJ2lnbm9yZU5hbWVTcGFjZScsXG4gICdhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJyxcbiAgJ3BhcnNlTm9kZVZhbHVlJyxcbiAgJ3BhcnNlQXR0cmlidXRlVmFsdWUnLFxuICAnYXJyYXlNb2RlJyxcbiAgJ3RyaW1WYWx1ZXMnLFxuICAnY2RhdGFUYWdOYW1lJyxcbiAgJ2NkYXRhUG9zaXRpb25DaGFyJyxcbiAgJ2xvY2FsZVJhbmdlJyxcbiAgJ3RhZ1ZhbHVlUHJvY2Vzc29yJyxcbiAgJ2F0dHJWYWx1ZVByb2Nlc3NvcicsXG4gICdwYXJzZVRydWVOdW1iZXJPbmx5JyxcbiAgJ3N0b3BOb2Rlcydcbl07XG5leHBvcnRzLnByb3BzID0gcHJvcHM7XG5cbmNvbnN0IGdldFRyYXZlcnNhbE9iaiA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoL1xccj9cXG4vZywgXCIgXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICB4bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC88IS0tW1xcc1xcU10qPy0tPi9nLCAnJyk7IC8vUmVtb3ZlICBjb21tZW50c1xuXG4gIGNvbnN0IHhtbE9iaiA9IG5ldyB4bWxOb2RlKCcheG1sJyk7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHhtbE9iajtcblxuICByZWd4ID0gcmVneC5yZXBsYWNlKC9cXFtcXFxcdy9nLCAnWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlICsgJ1xcXFx3Jyk7XG4gIGNvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChyZWd4LCAnZycpO1xuICBsZXQgdGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgbGV0IG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB3aGlsZSAodGFnKSB7XG4gICAgY29uc3QgdGFnVHlwZSA9IGNoZWNrRm9yVGFnVHlwZSh0YWcpO1xuXG4gICAgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0xPU0lORykge1xuICAgICAgLy9hZGQgcGFyc2VkIGRhdGEgdG8gcGFyZW50IG5vZGVcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnQgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS5wYXJlbnQudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucywgY3VycmVudE5vZGUucGFyZW50LnRhZ25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjdXJyZW50Tm9kZS50YWduYW1lKSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5jaGlsZCA9IFtdXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5hdHRyc01hcCA9PSB1bmRlZmluZWQpIHsgY3VycmVudE5vZGUuYXR0cnNNYXAgPSB7fX1cbiAgICAgICAgY3VycmVudE5vZGUudmFsID0geG1sRGF0YS5zdWJzdHIoY3VycmVudE5vZGUuc3RhcnRJbmRleCArIDEsIHRhZy5pbmRleCAtIGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggLSAxKVxuICAgICAgfVxuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNEQVRBKSB7XG4gICAgICBpZiAob3B0aW9ucy5jZGF0YVRhZ05hbWUpIHtcbiAgICAgICAgLy9hZGQgY2RhdGEgbm9kZVxuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmNkYXRhVGFnTmFtZSwgY3VycmVudE5vZGUsIHRhZ1szXSk7XG4gICAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAvL2ZvciBiYWNrdHJhY2tpbmdcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcjtcbiAgICAgICAgLy9hZGQgcmVzdCB2YWx1ZSB0byBwYXJlbnQgbm9kZVxuICAgICAgICBpZiAodGFnWzE0XSkge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnZhbCArPSBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gKGN1cnJlbnROb2RlLnZhbCB8fCAnJykgKyAodGFnWzNdIHx8ICcnKSArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5TRUxGKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSwgY3VycmVudE5vZGUsICcnKTtcbiAgICAgIGlmICh0YWdbOF0gJiYgdGFnWzhdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFnWzhdID0gdGFnWzhdLnN1YnN0cigwLCB0YWdbOF0ubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVGFnVHlwZS5PUEVOSU5HXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShcbiAgICAgICAgb3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sXG4gICAgICAgIGN1cnJlbnROb2RlLFxuICAgICAgICBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY2hpbGROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGNoaWxkTm9kZS5zdGFydEluZGV4PXRhZy5pbmRleCArIHRhZ1sxXS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlID0gY2hpbGROb2RlO1xuICAgIH1cblxuICAgIHRhZyA9IG5leHRUYWc7XG4gICAgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIH1cblxuICByZXR1cm4geG1sT2JqO1xufTtcblxuZnVuY3Rpb24gcHJvY2Vzc1RhZ1ZhbHVlKHBhcnNlZFRhZ3MsIG9wdGlvbnMsIHBhcmVudFRhZ05hbWUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IHBhcnNlZFRhZ3NbN10gfHwgcGFyZW50VGFnTmFtZTtcbiAgbGV0IHZhbCA9IHBhcnNlZFRhZ3NbMTRdO1xuICBpZiAodmFsKSB7XG4gICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgdmFsID0gdmFsLnRyaW0oKTtcbiAgICB9XG4gICAgdmFsID0gb3B0aW9ucy50YWdWYWx1ZVByb2Nlc3Nvcih2YWwsIHRhZ05hbWUpO1xuICAgIHZhbCA9IHBhcnNlVmFsdWUodmFsLCBvcHRpb25zLnBhcnNlTm9kZVZhbHVlLCBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JUYWdUeXBlKG1hdGNoKSB7XG4gIGlmIChtYXRjaFs0XSA9PT0gJ11dPicpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DREFUQTtcbiAgfSBlbHNlIGlmIChtYXRjaFsxMF0gPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLkNMT1NJTkc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzhdICE9PSAndW5kZWZpbmVkJyAmJiBtYXRjaFs4XS5zdWJzdHIobWF0Y2hbOF0ubGVuZ3RoIC0gMSkgPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLlNFTEY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuT1BFTklORztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlTmFtZVNwYWNlKHRhZ25hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlKSB7XG4gICAgY29uc3QgdGFncyA9IHRhZ25hbWUuc3BsaXQoJzonKTtcbiAgICBjb25zdCBwcmVmaXggPSB0YWduYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgaWYgKHRhZ3NbMF0gPT09ICd4bWxucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICB0YWduYW1lID0gcHJlZml4ICsgdGFnc1sxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhZ25hbWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsLCBzaG91bGRQYXJzZSwgcGFyc2VUcnVlTnVtYmVyT25seSkge1xuICBpZiAoc2hvdWxkUGFyc2UgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBsZXQgcGFyc2VkO1xuICAgIGlmICh2YWwudHJpbSgpID09PSAnJyB8fCBpc05hTih2YWwpKSB7XG4gICAgICBwYXJzZWQgPSB2YWwgPT09ICd0cnVlJyA/IHRydWUgOiB2YWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbC5pbmRleE9mKCcweCcpICE9PSAtMSkge1xuICAgICAgICAvL3N1cHBvcnQgaGV4YSBkZWNpbWFsXG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDE2KTtcbiAgICAgIH0gZWxzZSBpZiAodmFsLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gICAgICAgIHBhcnNlZCA9IFN0cmluZyhwYXJzZWQpID09PSB2YWwgPyBwYXJzZWQgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHV0aWwuaXNFeGlzdCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59XG5cbi8vVE9ETzogY2hhbmdlIHJlZ2V4IHRvIGNhcHR1cmUgTlNcbi8vY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cChcIihbXFxcXHdcXFxcLVxcXFwuXFxcXDpdKylcXFxccyo9XFxcXHMqKFsnXFxcIl0pKCgufFxcbikqPylcXFxcMlwiLFwiZ21cIik7XG5jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKCcoW15cXFxccz1dKylcXFxccyooPVxcXFxzKihbXFwnXCJdKSguKj8pXFxcXDMpPycsICdnJyk7XG5cbmZ1bmN0aW9uIGJ1aWxkQXR0cmlidXRlc01hcChhdHRyU3RyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIHR5cGVvZiBhdHRyU3RyID09PSAnc3RyaW5nJykge1xuICAgIGF0dHJTdHIgPSBhdHRyU3RyLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICAvL2F0dHJTdHIgPSBhdHRyU3RyIHx8IGF0dHJTdHIudHJpbSgpO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCBhdHRyc1JlZ3gpO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoZXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgY29uc3QgYXR0cnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IHJlc29sdmVOYW1lU3BhY2UobWF0Y2hlc1tpXVsxXSwgb3B0aW9ucyk7XG4gICAgICBpZiAoYXR0ck5hbWUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldWzRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gbWF0Y2hlc1tpXVs0XS50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBvcHRpb25zLmF0dHJWYWx1ZVByb2Nlc3NvcihtYXRjaGVzW2ldWzRdLCBhdHRyTmFtZSk7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gcGFyc2VWYWx1ZShcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0sXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlQXR0cmlidXRlVmFsdWUsXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFPYmplY3Qua2V5cyhhdHRycykubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF0dHJOb2RlTmFtZSkge1xuICAgICAgY29uc3QgYXR0ckNvbGxlY3Rpb24gPSB7fTtcbiAgICAgIGF0dHJDb2xsZWN0aW9uW29wdGlvbnMuYXR0ck5vZGVOYW1lXSA9IGF0dHJzO1xuICAgICAgcmV0dXJuIGF0dHJDb2xsZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbn1cblxuZXhwb3J0cy5nZXRUcmF2ZXJzYWxPYmogPSBnZXRUcmF2ZXJzYWxPYmo7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuLyoqXG4gKiBHZW5lcmljIGFuaW1hdGlvbiBjbGFzcyB3aXRoIHN1cHBvcnQgZm9yIGRyb3BwZWQgZnJhbWVzIGJvdGggb3B0aW9uYWwgZWFzaW5nIGFuZCBkdXJhdGlvbi5cbiAqXG4gKiBPcHRpb25hbCBkdXJhdGlvbiBpcyB1c2VmdWwgd2hlbiB0aGUgbGlmZXRpbWUgaXMgZGVmaW5lZCBieSBhbm90aGVyIGNvbmRpdGlvbiB0aGFuIHRpbWVcbiAqIGUuZy4gc3BlZWQgb2YgYW4gYW5pbWF0aW5nIG9iamVjdCwgZXRjLlxuICpcbiAqIERyb3BwZWQgZnJhbWUgbG9naWMgYWxsb3dzIHRvIGtlZXAgdXNpbmcgdGhlIHNhbWUgdXBkYXRlciBsb2dpYyBpbmRlcGVuZGVudCBmcm9tIHRoZSBhY3R1YWxcbiAqIHJlbmRlcmluZy4gVGhpcyBlYXNlcyBhIGxvdCBvZiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBwcmV0dHkgY29tcGxleCB0byBicmVhayBkb3duIGEgc3RhdGVcbiAqIGJhc2VkIG9uIHRoZSBwdXJlIHRpbWUgZGlmZmVyZW5jZS5cbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSgocm9vdC5hbmltYXRlID0ge30pKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgdmFyIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvd1xuICAgIHZhciB0aW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gICAgfTtcbiAgICB2YXIgZGVzaXJlZEZyYW1lcyA9IDYwO1xuICAgIHZhciBtaWxsaXNlY29uZHNQZXJTZWNvbmQgPSAxMDAwO1xuICAgIHZhciBydW5uaW5nID0ge307XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGdpdmVuIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiB3YXMgc3RvcHBlZCAoYWthLCB3YXMgcnVubmluZyBiZWZvcmUpXG4gICAgICovXG4gICAgZXhwb3J0cy5zdG9wID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBjbGVhcmVkID0gKHJ1bm5pbmdbaWRdICE9PSBudWxsKTtcbiAgICAgICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGVhcmVkO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdpdmVuIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgKi9cbiAgICBleHBvcnRzLmlzUnVubmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gcnVubmluZ1tpZF0gIT09IG51bGw7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGVwQ2FsbGJhY2sge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkIG9uIGV2ZXJ5IHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQsIG5vdywgdmlydHVhbCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSB2ZXJpZnlDYWxsYmFjayB7RnVuY3Rpb259IEV4ZWN1dGVkIGJlZm9yZSBldmVyeSBhbmltYXRpb24gc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZENhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oZHJvcHBlZEZyYW1lcywgZmluaXNoZWRBbmltYXRpb24sIG9wdGlvbmFsIHdhc0ZpbmlzaGVkKSB7fWBcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24ge0ludGVnZXJ9IE1pbGxpc2Vjb25kcyB0byBydW4gdGhlIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmdNZXRob2Qge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGVhc2luZyBmdW5jdGlvblxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50KSB7IHJldHVybiBtb2RpZmllZFZhbHVlOyB9YFxuICAgICAqIEBwYXJhbSByb290IHtFbGVtZW50fSBSZW5kZXIgcm9vdC4gVXNlZCBmb3IgaW50ZXJuYWwgdXNhZ2Ugb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IElkZW50aWZpZXIgb2YgYW5pbWF0aW9uLiBDYW4gYmUgdXNlZCB0byBzdG9wIGl0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RhcnQgPSBmdW5jdGlvbiAoc3RlcENhbGxiYWNrLCB2ZXJpZnlDYWxsYmFjaywgY29tcGxldGVkQ2FsbGJhY2ssIGR1cmF0aW9uLCBlYXNpbmdNZXRob2QsIHJvb3QpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGltZSgpO1xuICAgICAgICB2YXIgbGFzdEZyYW1lID0gc3RhcnQ7XG4gICAgICAgIHZhciBwZXJjZW50ID0gMDtcbiAgICAgICAgdmFyIGRyb3BDb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGlkID0gY291bnRlcisrO1xuXG4gICAgICAgIC8vIENvbXBhY3RpbmcgcnVubmluZyBkYiBhdXRvbWF0aWNhbGx5IGV2ZXJ5IGZldyBuZXcgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaWQgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIG5ld1J1bm5pbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHVzZWRJZCBpbiBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3UnVubmluZ1t1c2VkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBuZXdSdW5uaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RlcCBtZXRob2Qgd2hpY2ggaXMgY2FsbGVkIGV2ZXJ5IGZldyBtaWxsaXNlY29uZHNcbiAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAodmlydHVhbCkge1xuXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgdmlydHVhbCB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IHZpcnR1YWwgIT09IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWVcbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lKCk7XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBpcyBleGVjdXRlZCBiZWZvcmUgbmV4dCBhbmltYXRpb24gc3RlcFxuICAgICAgICAgICAgaWYgKCFydW5uaW5nW2lkXSB8fCAodmVyaWZ5Q2FsbGJhY2sgJiYgIXZlcmlmeUNhbGxiYWNrKGlkKSkpIHtcblxuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBjdXJyZW50IHJlbmRlcmluZyB0byBhcHBseSBsZXQncyB1cGRhdGUgb21pdHRlZCBzdGVwcyBpbiBtZW1vcnkuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byBicmluZyBpbnRlcm5hbCBzdGF0ZSB2YXJpYWJsZXMgdXAtdG8tZGF0ZSB3aXRoIHByb2dyZXNzIGluIHRpbWUuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHJvcHBlZEZyYW1lcyA9IE1hdGgucm91bmQoKG5vdyAtIGxhc3RGcmFtZSkgLyAobWlsbGlzZWNvbmRzUGVyU2Vjb25kIC8gZGVzaXJlZEZyYW1lcykpIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGgubWluKGRyb3BwZWRGcmFtZXMsIDQpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBwZXJjZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKG5vdyAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgc3RlcCBjYWxsYmFjaywgdGhlbi4uLlxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWFzaW5nTWV0aG9kID8gZWFzaW5nTWV0aG9kKHBlcmNlbnQpIDogcGVyY2VudDtcbiAgICAgICAgICAgIGlmICgoc3RlcENhbGxiYWNrKHZhbHVlLCBub3csIHJlbmRlcikgPT09IGZhbHNlIHx8IHBlcmNlbnQgPT09IDEpICYmIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIHBlcmNlbnQgPT09IDEgfHwgZHVyYXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgIGxhc3RGcmFtZSA9IG5vdztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyayBhcyBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmdbaWRdID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbml0IGZpcnN0IHN0ZXBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuXG4gICAgICAgIC8vIFJldHVybiB1bmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5pbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xudmFyIE5PT1AgPSBmdW5jdGlvbiAoKSB7IH07XG5cbi8vIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcbiAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcbiAgfVxuXG4gIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLCAzKSArIDIpO1xufTtcblxuXG4vKipcbiAqIEEgcHVyZSBsb2dpYyAnY29tcG9uZW50JyBmb3IgJ3ZpcnR1YWwnIHNjcm9sbGluZy96b29taW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB4LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1g6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHktYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWTogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBhbmltYXRpb25zIGZvciBkZWNlbGVyYXRpb24sIHNuYXAgYmFjaywgem9vbWluZyBhbmQgc2Nyb2xsaW5nICovXG4gICAgICBhbmltYXRpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBkdXJhdGlvbiBmb3IgYW5pbWF0aW9ucyB0cmlnZ2VyZWQgYnkgc2Nyb2xsVG8vem9vbVRvICovXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogMjUwLFxuXG4gICAgICAvKiogRW5hYmxlIGJvdW5jaW5nIChjb250ZW50IGNhbiBiZSBzbG93bHkgbW92ZWQgb3V0c2lkZSBhbmQganVtcHMgYmFjayBhZnRlciByZWxlYXNpbmcpICovXG4gICAgICBib3VuY2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBsb2NraW5nIHRvIHRoZSBtYWluIGF4aXMgaWYgdXNlciBtb3ZlcyBvbmx5IHNsaWdodGx5IG9uIG9uZSBvZiB0aGVtIGF0IHN0YXJ0ICovXG4gICAgICBsb2NraW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHBhZ2luYXRpb24gbW9kZSAoc3dpdGNoaW5nIGJldHdlZW4gZnVsbCBwYWdlIGNvbnRlbnQgcGFuZXMpICovXG4gICAgICBwYWdpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHNuYXBwaW5nIG9mIGNvbnRlbnQgdG8gYSBjb25maWd1cmVkIHBpeGVsIGdyaWQgKi9cbiAgICAgIHNuYXBwaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSB6b29taW5nIG9mIGNvbnRlbnQgdmlhIEFQSSwgZmluZ2VycyBhbmQgbW91c2Ugd2hlZWwgKi9cbiAgICAgIHpvb21pbmc6IGZhbHNlLFxuXG4gICAgICAvKiogTWluaW11bSB6b29tIGxldmVsICovXG4gICAgICBtaW5ab29tOiAwLjUsXG5cbiAgICAgIC8qKiBNYXhpbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1heFpvb206IDMsXG5cbiAgICAgIC8qKiBNdWx0aXBseSBvciBkZWNyZWFzZSBzY3JvbGxpbmcgc3BlZWQgKiovXG4gICAgICBzcGVlZE11bHRpcGxpZXI6IDEsXG5cbiAgICAgIC8qKiBDYWxsYmFjayB0aGF0IGlzIGZpcmVkIG9uIHRoZSBsYXRlciBvZiB0b3VjaCBlbmQgb3IgZGVjZWxlcmF0aW9uIGVuZCxcbiAgICAgICAgICBwcm92aWRlZCB0aGF0IGFub3RoZXIgc2Nyb2xsaW5nIGFjdGlvbiBoYXMgbm90IGJlZ3VuLiBVc2VkIHRvIGtub3dcbiAgICAgICAgICB3aGVuIHRvIGZhZGUgb3V0IGEgc2Nyb2xsYmFyLiAqL1xuICAgICAgc2Nyb2xsaW5nQ29tcGxldGU6IE5PT1AsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uOiAwLjAzLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjogMC4wOFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgLypcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgSU5URVJOQUwgRklFTERTIDo6IFNUQVRVU1xuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgb25seSBhIHNpbmdsZSBmaW5nZXIgaXMgdXNlZCBpbiB0b3VjaCBoYW5kbGluZyAqL1xuICBfX2lzU2luZ2xlVG91Y2ggPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSB0b3VjaCBldmVudCBzZXF1ZW5jZSBpcyBpbiBwcm9ncmVzcyAqL1xuICBfX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uIHdlbnQgdG8gY29tcGxldGlvbi4gKi9cbiAgX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciBhIGdlc3R1cmUgem9vbS9yb3RhdGUgZXZlbnQgaXMgaW4gcHJvZ3Jlc3MuIEFjdGl2YXRlcyB3aGVuXG4gICAqIGEgZ2VzdHVyZXN0YXJ0IGV2ZW50IGhhcHBlbnMuIFRoaXMgaGFzIGhpZ2hlciBwcmlvcml0eSB0aGFuIGRyYWdnaW5nLlxuICAgKi9cbiAgX19pc0dlc3R1cmluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgdXNlciBoYXMgbW92ZWQgYnkgc3VjaCBhIGRpc3RhbmNlIHRoYXQgd2UgaGF2ZSBlbmFibGVkXG4gICAqIGRyYWdnaW5nIG1vZGUuIEhpbnQgPSBJdCdzIG9ubHkgZW5hYmxlZCBhZnRlciBzb21lIHBpeGVscyBvZiBtb3ZlbWVudCB0O1xuICAgKiBub3QgaW50ZXJydXB0IHdpdGggY2xpY2tzIGV0Yy5cbiAgICovXG4gIF9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gTm90IHRvdWNoaW5nIGFuZCBkcmFnZ2luZyBhbnltb3JlLCBhbmQgc21vb3RobHkgYW5pbWF0aW5nIHRoZVxuICAgKiB0b3VjaCBzZXF1ZW5jZSB1c2luZyBkZWNlbGVyYXRpb24uXG4gICAqL1xuICBfX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBTbW9vdGhseSBhbmltYXRpbmcgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIGNoYW5nZVxuICAgKi9cbiAgX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBESU1FTlNJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBsZWZ0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50TGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCByaWdodCBib3VuZGFyeSAqL1xuICBfX2NsaWVudFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCB3aWR0aCAqL1xuICBfX2NsaWVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodCAqL1xuICBfX2NsaWVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyB3aWR0aCAqL1xuICBfX2NvbnRlbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyBoZWlnaHQgKi9cbiAgX19jb250ZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoIGZvciBjb250ZW50ICovXG4gIF9fc25hcFdpZHRoID0gMTAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0IGZvciBjb250ZW50ICovXG4gIF9fc25hcEhlaWdodCA9IDEwMDtcblxuICAvKioge051bWJlcn0gWm9vbSBsZXZlbCAqL1xuICBfX3pvb21MZXZlbCA9IDE7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19zY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX21heFNjcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCBsZWZ0IHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRMZWZ0ID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgdG9wIHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB6b29tIGxldmVsIChmaW5hbCBzY2FsZSB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRab29tID0gMDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogTEFTVCBQT1NJVElPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge051bWJlcn0gTGVmdCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hMZWZ0ID0gbnVsbDtcblxuICAvKioge051bWJlcn0gVG9wIHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaFRvcCA9IG51bGw7XG5cbiAgLyoqIHtEYXRlfSBUaW1lc3RhbXAgb2YgbGFzdCBtb3ZlIG9mIGZpbmdlci4gVXNlZCB0byBsaW1pdCB0cmFja2luZyByYW5nZSBmb3IgZGVjZWxlcmF0aW9uIHNwZWVkLiAqL1xuICBfX2xhc3RUb3VjaE1vdmUgPSBudWxsO1xuXG4gIC8qKiB7QXJyYXl9IExpc3Qgb2YgcG9zaXRpb25zLCB1c2VzIHRocmVlIGluZGV4ZXMgZm9yIGVhY2ggc3RhdGUgPSBsZWZ0LCB0b3AsIHRpbWVzdGFtcCAqO1xuICBfX3Bvc2l0aW9ucyA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDogPSBERUNFTEVSQVRJT04gU1VQUE9SO1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IGhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQVUJMSUMgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNsaWVudCAob3V0ZXIpIGFuZCBjb250ZW50IChpbm5lcikgZWxlbWVudHMuXG4gICAqIFJlcXVpcmVzIHRoZSBhdmFpbGFibGUgc3BhY2UgZm9yIHRoZSBvdXRlciBlbGVtZW50IGFuZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICogQWxsIHZhbHVlcyB3aGljaCBhcmUgZmFsc3kgKG51bGwgb3IgemVybyBldGMuKSBhcmUgaWdub3JlZCBhbmQgdGhlIG9sZCB2YWx1ZSBpcyBrZXB0LlxuICAgKlxuICAgKiBAcGFyYW0gY2xpZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBJbm5lciB3aWR0aCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjbGllbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBJbm5lciBoZWlnaHQgb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgd2lkdGggb2YgaW5uZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IE91dGVyIGhlaWdodCBvZiBpbm5lciBlbGVtZW50XG4gICAqL1xuICBzZXREaW1lbnNpb25zKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHZhbHVlcyB3aGljaCBhcmUgZGVmaW5lZFxuICAgIGlmIChjbGllbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudFdpZHRoID0gY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNsaWVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudEhlaWdodCA9IGNsaWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudFdpZHRoID0gY29udGVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudEhlaWdodCA9IGNvbnRlbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gUmVmcmVzaCBtYXhpbXVtc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG5cbiAgICAvLyBSZWZyZXNoIHNjcm9sbCBwb3NpdGlvblxuICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIGZhbHNlKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGNsaWVudCBjb29yZGluYXRlcyBpbiByZWxhdGlvbiB0byB0aGUgZG9jdW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtJbnRlZ2VyID8gMH0gTGVmdCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSB0b3Age0ludGVnZXIgPyAwfSBUb3AgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0UG9zaXRpb24obGVmdCwgdG9wKSB7XG4gICAgdGhpcy5fX2NsaWVudExlZnQgPSBsZWZ0IHx8IDA7XG4gICAgdGhpcy5fX2NsaWVudFRvcCA9IHRvcCB8fCAwO1xuICB9XG5cblxuICAvKipcbiAgICogQ29uZmlndXJlcyB0aGUgc25hcHBpbmcgKHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlKVxuICAgKlxuICAgKiBAcGFyYW0gd2lkdGgge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoXG4gICAqIEBwYXJhbSBoZWlnaHQge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodFxuICAgKi9cbiAgc2V0U25hcFNpemUod2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMuX19zbmFwV2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLl9fc25hcEhlaWdodCA9IGhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmcgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBzY3JvbGwgcG9zaXRpb24gYW5kIGB6b29tYCBsZXZlbFxuICAgKi9cbiAgZ2V0VmFsdWVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLl9fc2Nyb2xsTGVmdCxcbiAgICAgIHRvcDogdGhpcy5fX3Njcm9sbFRvcCxcbiAgICAgIHJpZ2h0OiB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19jbGllbnRXaWR0aCAvIHRoaXMuX196b29tTGV2ZWwsXG4gICAgICBib3R0b206IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIHpvb206IHRoaXMuX196b29tTGV2ZWxcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogR2V0IHBvaW50IGluIGluIGNvbnRlbnQgc3BhY2UgZnJvbSBzY3JvbGwgY29vcmRpbmF0ZXMuXG4gICAqL1xuICBnZXRQb2ludChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApIHtcbiAgICB2YXIgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcblxuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBzY3JvbGxMZWZ0IC8gdmFsdWVzLnpvb20sXG4gICAgICB0b3A6IHNjcm9sbFRvcCAvIHZhbHVlcy56b29tXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtNYXB9IGBsZWZ0YCBhbmQgYHRvcGAgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqL1xuICBnZXRTY3JvbGxNYXgoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fbWF4U2Nyb2xsVG9wXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRvIHRoZSBnaXZlbiBsZXZlbC4gU3VwcG9ydHMgb3B0aW9uYWwgYW5pbWF0aW9uLiBab29tc1xuICAgKiB0aGUgY2VudGVyIHdoZW4gbm8gY29vcmRpbmF0ZXMgYXJlIGdpdmVuLlxuICAgKlxuICAgKiBAcGFyYW0gbGV2ZWwge051bWJlcn0gTGV2ZWwgdG8gem9vbSB0b1xuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICogQHBhcmFtIGZpeGVkTGVmdCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgbGVmdCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gZml4ZWRUb3Age051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIHRvcCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21UbyhsZXZlbCwgaXNBbmltYXRlZCwgZml4ZWRMZWZ0LCBmaXhlZFRvcCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICB9XG5cbiAgICAvLyBBZGQgY2FsbGJhY2sgaWYgZXhpc3RzXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBvbGRMZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBOb3JtYWxpemUgZml4ZWQgcG9pbnQgdG8gY2VudGVyIG9mIHZpZXdwb3J0IGlmIG5vdCBkZWZpbmVkXG4gICAgaWYgKGZpeGVkTGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZExlZnQgPSB0aGlzLl9fY2xpZW50V2lkdGggLyAyO1xuICAgIH1cblxuICAgIGlmIChmaXhlZFRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaXhlZFRvcCA9IHRoaXMuX19jbGllbnRIZWlnaHQgLyAyO1xuICAgIH1cblxuICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcblxuICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3Agc2Nyb2xsIHBvc2l0aW9ucyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbC5cbiAgICAvLyBDaG9vc2luZyB0aGUgbmV3IHZpZXdwb3J0IHNvIHRoYXQgdGhlIG9yaWdpbidzIHBvc2l0aW9uIHJlbWFpbnNcbiAgICAvLyBmaXhlZCwgd2UgaGF2ZSBjZW50cmFsIGRpbGF0aW9uIGFib3V0IHRoZSBvcmlnaW4uXG4gICAgLy8gKiBGaXhlZCBwb2ludCwgJEYkLCByZW1haW5zIHN0YXRpb25hcnkgaW4gY29udGVudCBzcGFjZSBhbmQgaW4gdGhlXG4gICAgLy8gdmlld3BvcnQuXG4gICAgLy8gKiBJbml0aWFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfaSQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBGaW5hbCBzY3JvbGwgcG9zaXRpb24sICRTX2YkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgIC8vICogSW5pdGlhbCBzY2FsaW5nIGZhY3RvciwgJGtfaSQuXG4gICAgLy8gKiBGaW5hbCBzY2FsaW5nIGZhY3RvciwgJGtfZiQuXG4gICAgLy9cbiAgICAvLyAqICRTX2kgXFxtYXBzdG8gU19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pID0gKFNfZiAtIEYpIGtfZiQuXG4gICAgLy8gKiAkKFNfaSAtIEYpIGtfaS9rX2YgPSAoU19mIC0gRikkLlxuICAgIC8vICogJFNfZiA9IEYgKyAoU19pIC0gRikga19pL2tfZiQuXG4gICAgLy9cbiAgICAvLyBGaXhlZCBwb2ludCBsb2NhdGlvbiwgJFxcdmVjdG9ye2Z9ID0gKEYgLSBTX2kpIGtfaSQuXG4gICAgLy8gKiAkRiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pICsgKFNfaSAtIFNfaSAtIFxcdmVjdG9ye2Z9L2tfaSkga19pL2tfZiQuXG4gICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pIC0gXFx2ZWN0b3J7Zn0va19mJC5cbiAgICAvLyAqICRTX2Yga19mID0gU19pIGtfZiArIChrX2Yva19pIC0gMSlcXHZlY3RvcntmfSQuXG4gICAgLy8gKiAkU19mIGtfZiA9IChrX2Yva19pKShTX2kga19pKSArIChrX2Yva19pIC0gMSkgXFx2ZWN0b3J7Zn0kLlxuICAgIHZhciBrID0gbGV2ZWwgLyBvbGRMZXZlbDtcbiAgICB2YXIgbGVmdCA9IGsgKiAodGhpcy5fX3Njcm9sbExlZnQgKyBmaXhlZExlZnQpIC0gZml4ZWRMZWZ0O1xuICAgIHZhciB0b3AgPSBrICogKHRoaXMuX19zY3JvbGxUb3AgKyBmaXhlZFRvcCkgLSBmaXhlZFRvcDtcblxuICAgIC8vIExpbWl0IHgtYXhpc1xuICAgIGlmIChsZWZ0ID4gdGhpcy5fX21heFNjcm9sbExlZnQpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICB9IGVsc2UgaWYgKGxlZnQgPCAwKSB7XG4gICAgICBsZWZ0ID0gMDtcbiAgICB9XG5cbiAgICAvLyBMaW1pdCB5LWF4aXNcbiAgICBpZiAodG9wID4gdGhpcy5fX21heFNjcm9sbFRvcCkge1xuICAgICAgdG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9IGVsc2UgaWYgKHRvcCA8IDApIHtcbiAgICAgIHRvcCA9IDA7XG4gICAgfVxuXG4gICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCBsZXZlbCwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBab29tcyB0aGUgY29udGVudCBieSB0aGUgZ2l2ZW4gZmFjdG9yLlxuICAgKlxuICAgKiBAcGFyYW0gZmFjdG9yIHtOdW1iZXJ9IFpvb20gYnkgZ2l2ZW4gZmFjdG9yXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gb3JpZ2luTGVmdCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiBsZWZ0IGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIG9yaWdpblRvcCB7TnVtYmVyID8gMH0gWm9vbSBpbiBhdCBnaXZlbiB0b3AgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICovXG4gIHpvb21CeShmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNjcm9sbHMgdG8gdGhlIGdpdmVuIHBvc2l0aW9uLiBSZXNwZWN0IGxpbWl0YXRpb25zIGFuZCBzbmFwcGluZyBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyP251bGx9IEhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAqIEBwYXJhbSB0b3Age051bWJlcj9udWxsfSBWZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdGhlIHNjcm9sbGluZyBzaG91bGQgaGFwcGVuIHVzaW5nIGFuIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gem9vbSB7TnVtYmVyfSBbMS4wXSBab29tIGxldmVsIHRvIGdvIHRvXG4gICAqL1xuICBzY3JvbGxUbyhsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQsIHpvb20pIHtcbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gQ29ycmVjdCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgIGlmICh6b29tICE9PSB1bmRlZmluZWQgJiYgem9vbSAhPT0gdGhpcy5fX3pvb21MZXZlbCkge1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICAgIH1cblxuICAgICAgbGVmdCAqPSB6b29tO1xuICAgICAgdG9wICo9IHpvb207XG5cbiAgICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCh6b29tKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gS2VlcCB6b29tIHdoZW4gbm90IGRlZmluZWRcbiAgICAgIHpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1gpIHtcbiAgICAgIGxlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIHRoaXMuX19jbGllbnRXaWR0aCkgKiB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX3NuYXBXaWR0aCkgKiB0aGlzLl9fc25hcFdpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kpIHtcbiAgICAgIHRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX2NsaWVudEhlaWdodCkgKiB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fc25hcEhlaWdodCkgKiB0aGlzLl9fc25hcEhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMaW1pdCBmb3IgYWxsb3dlZCByYW5nZXNcbiAgICBsZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbExlZnQsIGxlZnQpLCAwKTtcbiAgICB0b3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsVG9wLCB0b3ApLCAwKTtcblxuICAgIC8vIERvbid0IGFuaW1hdGUgd2hlbiBubyBjaGFuZ2UgZGV0ZWN0ZWQsIHN0aWxsIGNhbGwgcHVibGlzaCB0byBtYWtlIHN1cmVcbiAgICAvLyB0aGF0IHJlbmRlcmVkIHBvc2l0aW9uIGlzIHJlYWxseSBpbi1zeW5jIHdpdGggaW50ZXJuYWwgZGF0YVxuICAgIGlmIChsZWZ0ID09PSB0aGlzLl9fc2Nyb2xsTGVmdCAmJiB0b3AgPT09IHRoaXMuX19zY3JvbGxUb3ApIHtcbiAgICAgIGlzQW5pbWF0ZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBQdWJsaXNoIG5ldyB2YWx1ZXNcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xsIGJ5IHRoZSBnaXZlbiBvZmZzZXRcbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSB0b3Age051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgZ2l2ZW4gY2hhbmdlXG4gICAqL1xuICBzY3JvbGxCeShsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQpIHtcbiAgICB2YXIgc3RhcnRMZWZ0ID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZExlZnQgOiB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICB2YXIgc3RhcnRUb3AgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkVG9wIDogdGhpcy5fX3Njcm9sbFRvcDtcblxuICAgIHRoaXMuc2Nyb2xsVG8oc3RhcnRMZWZ0ICsgKGxlZnQgfHwgMCksIHN0YXJ0VG9wICsgKHRvcCB8fCAwKSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgRVZFTlQgQ0FMTEJBQ0tTXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIE1vdXNlIHdoZWVsIGhhbmRsZXIgZm9yIHpvb21pbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Nb3VzZVpvb20od2hlZWxEZWx0YSwgdGltZVN0YW1wLCBwYWdlWCwgcGFnZVkpIHtcbiAgICB2YXIgY2hhbmdlID0gd2hlZWxEZWx0YSA+IDAgPyAwLjk3IDogMS4wMztcblxuICAgIHJldHVybiB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogY2hhbmdlLCBmYWxzZSwgcGFnZVggLSB0aGlzLl9fY2xpZW50TGVmdCwgcGFnZVkgLSB0aGlzLl9fY2xpZW50VG9wKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIHN0YXJ0IGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoU3RhcnQodG91Y2hlcywgdGltZVN0YW1wKSB7XG4gICAgLy8gQXJyYXktbGlrZSBjaGVjayBpcyBlbm91Z2ggaGVyZVxuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvdWNoIGxpc3Q6IFwiICsgdG91Y2hlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IGludGVycnVwdGVkQW5pbWF0aW9uIGZsYWdcbiAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBTdG9wIGFuaW1hdGlvblxuICAgIGlmICh0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFVzZSBjZW50ZXIgcG9pbnQgd2hlbiBkZWFsaW5nIHdpdGggdHdvIGZpbmdlcnNcbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuICAgIHZhciBpc1NpbmdsZVRvdWNoID0gdG91Y2hlcy5sZW5ndGggPT09IDE7XG4gICAgaWYgKGlzU2luZ2xlVG91Y2gpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH1cblxuICAgIC8vIFN0b3JlIGluaXRpYWwgcG9zaXRpb25zXG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19pbml0aWFsVG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBTdG9yZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICB0aGlzLl9fem9vbUxldmVsU3RhcnQgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCB0b3VjaCBwb3NpdGlvbnNcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGluaXRpYWwgbW92ZSB0aW1lIHN0YW1wXG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG5cbiAgICAvLyBSZXNldCBpbml0aWFsIHNjYWxlXG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IDE7XG5cbiAgICAvLyBSZXNldCBsb2NraW5nIGZsYWdzXG4gICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWDtcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZO1xuXG4gICAgLy8gUmVzZXQgdHJhY2tpbmcgZmxhZ1xuICAgIHRoaXMuX19pc1RyYWNraW5nID0gdHJ1ZTtcblxuICAgIC8vIFJlc2V0IGRlY2VsZXJhdGlvbiBjb21wbGV0ZSBmbGFnXG4gICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgICAvLyBEcmFnZ2luZyBzdGFydHMgZGlyZWN0bHkgd2l0aCB0d28gZmluZ2Vycywgb3RoZXJ3aXNlIGxhenkgd2l0aCBhbiBvZmZzZXRcbiAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICFpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gU29tZSBmZWF0dXJlcyBhcmUgZGlzYWJsZWQgaW4gbXVsdGkgdG91Y2ggc2NlbmFyaW9zXG4gICAgdGhpcy5fX2lzU2luZ2xlVG91Y2ggPSBpc1NpbmdsZVRvdWNoO1xuXG4gICAgLy8gQ2xlYXJpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICB0aGlzLl9fcG9zaXRpb25zID0gW107XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBtb3ZlIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbMS4wXSBzY2FsZSAtIC4uLi5cbiAgICovXG4gIGRvVG91Y2hNb3ZlKHRvdWNoZXMsIHRpbWVTdGFtcCwgc2NhbGUpIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKGV2ZW50IG1pZ2h0IGJlIG91dHNpZGUgb2YgZWxlbWVudClcbiAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIENvbXB1dGUgbW92ZSBiYXNlZCBhcm91bmQgb2YgY2VudGVyIG9mIGZpbmdlcnNcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH1cblxuICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuXG4gICAgLy8gQXJlIHdlIGFscmVhZHkgaXMgZHJhZ2dpbmcgbW9kZT9cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIENvbXB1dGUgbW92ZSBkaXN0YW5jZVxuICAgICAgdmFyIG1vdmVYID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19sYXN0VG91Y2hMZWZ0O1xuICAgICAgdmFyIG1vdmVZID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2xhc3RUb3VjaFRvcDtcblxuICAgICAgLy8gUmVhZCBwcmV2aW91cyBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmdcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBsZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgIC8vIFdvcmsgd2l0aCBzY2FsaW5nXG4gICAgICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB2YXIgb2xkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAvLyBSZWNvbXB1dGUgbGV2ZWwgYmFzZWQgb24gcHJldmlvdXMgc2NhbGUgYW5kIG5ldyBzY2FsZVxuICAgICAgICBsZXZlbCA9IGxldmVsIC8gdGhpcy5fX2xhc3RTY2FsZSAqIHNjYWxlO1xuXG4gICAgICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgICAgIC8vIE9ubHkgZG8gZnVydGhlciBjb21wdXRpb24gd2hlbiBjaGFuZ2UgaGFwcGVuZWRcbiAgICAgICAgaWYgKG9sZExldmVsICE9PSBsZXZlbCkge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgZXZlbnQgcG9zaXRpb24gdG8gY29udGFpbmVyXG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnRSZWwgPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2NsaWVudExlZnQ7XG4gICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaFRvcFJlbCA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19jbGllbnRUb3A7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgICAgICAgc2Nyb2xsTGVmdCA9ICgoY3VycmVudFRvdWNoTGVmdFJlbCArIHNjcm9sbExlZnQpICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hMZWZ0UmVsO1xuICAgICAgICAgIHNjcm9sbFRvcCA9ICgoY3VycmVudFRvdWNoVG9wUmVsICsgc2Nyb2xsVG9wKSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoVG9wUmVsO1xuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIG1heCBzY3JvbGwgdmFsdWVzXG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCkge1xuICAgICAgICBzY3JvbGxMZWZ0IC09IG1vdmVYICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcblxuICAgICAgICBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQgfHwgc2Nyb2xsTGVmdCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCArPSAobW92ZVggLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IG1heFNjcm9sbExlZnQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDb21wdXRlIG5ldyB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWSkge1xuICAgICAgICBzY3JvbGxUb3AgLT0gbW92ZVkgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtb3ZlWSlcbiAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG5cbiAgICAgICAgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCB8fCBzY3JvbGxUb3AgPCAwKSB7XG4gICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCArPSAobW92ZVkgLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IG1heFNjcm9sbFRvcDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gS2VlcCBsaXN0IGZyb20gZ3Jvd2luZyBpbmZpbml0ZWx5IChob2xkaW5nIG1pbiAxMCwgbWF4IDIwIG1lYXN1cmUgcG9pbnRzKVxuICAgICAgaWYgKHBvc2l0aW9ucy5sZW5ndGggPiA2MCkge1xuICAgICAgICBwb3NpdGlvbnMuc3BsaWNlKDAsIDMwKTtcbiAgICAgIH1cblxuICAgICAgLy8gVHJhY2sgc2Nyb2xsIG1vdmVtZW50IGZvciBkZWNsZXJhdGlvblxuICAgICAgcG9zaXRpb25zLnB1c2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICAvLyBTeW5jIHNjcm9sbCBwb3NpdGlvblxuICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCBsZXZlbCk7XG5cbiAgICAgIC8vIE90aGVyd2lzZSBmaWd1cmUgb3V0IHdoZXRoZXIgd2UgYXJlIHN3aXRjaGluZyBpbnRvIGRyYWdnaW5nIG1vZGUgbm93LlxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsID0gdGhpcy5vcHRpb25zLmxvY2tpbmcgPyAzIDogMDtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnID0gNTtcblxuICAgICAgdmFyIGRpc3RhbmNlWCA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCk7XG4gICAgICB2YXIgZGlzdGFuY2VZID0gTWF0aC5hYnMoY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2luaXRpYWxUb3VjaFRvcCk7XG5cbiAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1ggJiYgZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcbiAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kgJiYgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcblxuICAgICAgcG9zaXRpb25zLnB1c2godGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gKHRoaXMuX19lbmFibGVTY3JvbGxYIHx8IHRoaXMuX19lbmFibGVTY3JvbGxZKSAmJiAoZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcgfHwgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcpO1xuICAgICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0ZSBsYXN0IHRvdWNoIHBvc2l0aW9ucyBhbmQgdGltZSBzdGFtcCBmb3IgbmV4dCBldmVudFxuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuICAgIHRoaXMuX19sYXN0VG91Y2hNb3ZlID0gdGltZVN0YW1wO1xuICAgIHRoaXMuX19sYXN0U2NhbGUgPSBzY2FsZTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIGVuZCBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Ub3VjaEVuZCh0aW1lU3RhbXApIHtcbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKG5vIHRvdWNoc3RhcnQgZXZlbnQgb24gZWxlbWVudClcbiAgICAvLyBUaGlzIGlzIHJlcXVpcmVkIGFzIHRoaXMgbGlzdGVuZXIgKCd0b3VjaG1vdmUnKSBzaXRzIG9uIHRoZSBkb2N1bWVudCBhbmQgbm90IG9uIHRoZSBlbGVtZW50IGl0c2VsZi5cbiAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gTm90IHRvdWNoaW5nIGFueW1vcmUgKHdoZW4gdHdvIGZpbmdlciBoaXQgdGhlIHNjcmVlbiB0aGVyZSBhcmUgdHdvIHRvdWNoIGVuZCBldmVudHMpXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAgIC8vIEJlIHN1cmUgdG8gcmVzZXQgdGhlIGRyYWdnaW5nIGZsYWcgbm93LiBIZXJlIHdlIGFsc28gZGV0ZWN0IHdoZXRoZXJcbiAgICAvLyB0aGUgZmluZ2VyIGhhcyBtb3ZlZCBmYXN0IGVub3VnaCB0byBzd2l0Y2ggaW50byBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24uXG4gICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAvLyBSZXNldCBkcmFnZ2luZyBmbGFnXG4gICAgICB0aGlzLl9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICAvLyBTdGFydCBkZWNlbGVyYXRpb25cbiAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBsYXN0IG1vdmUgZGV0ZWN0ZWQgd2FzIGluIHNvbWUgcmVsZXZhbnQgdGltZSBmcmFtZVxuICAgICAgaWYgKHRoaXMuX19pc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5hbmltYXRpbmcgJiYgKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA8PSAxMDApIHtcbiAgICAgICAgLy8gVGhlbiBmaWd1cmUgb3V0IHdoYXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB3YXMgYWJvdXQgMTAwbXMgYWdvXG4gICAgICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuICAgICAgICB2YXIgZW5kUG9zID0gcG9zaXRpb25zLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciBzdGFydFBvcyA9IGVuZFBvcztcblxuICAgICAgICAvLyBNb3ZlIHBvaW50ZXIgdG8gcG9zaXRpb24gbWVhc3VyZWQgMTAwbXMgYWdvXG4gICAgICAgIGZvciAodmFyIGkgPSBlbmRQb3M7IGkgPiAwICYmIHBvc2l0aW9uc1tpXSA+ICh0aGlzLl9fbGFzdFRvdWNoTW92ZSAtIDEwMCk7IGkgLT0gMykge1xuICAgICAgICAgIHN0YXJ0UG9zID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHN0YXJ0IGFuZCBzdG9wIHBvc2l0aW9uIGlzIGlkZW50aWNhbCBpbiBhIDEwMG1zIHRpbWVmcmFtZSxcbiAgICAgICAgLy8gd2UgY2Fubm90IGNvbXB1dGUgYW55IHVzZWZ1bCBkZWNlbGVyYXRpb24uXG4gICAgICAgIGlmIChzdGFydFBvcyAhPT0gZW5kUG9zKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBtb3ZlbWVudCBiZXR3ZWVuIHRoZXNlIHR3byBwb2ludHNcbiAgICAgICAgICB2YXIgdGltZU9mZnNldCA9IHBvc2l0aW9uc1tlbmRQb3NdIC0gcG9zaXRpb25zW3N0YXJ0UG9zXTtcbiAgICAgICAgICB2YXIgbW92ZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAyXTtcbiAgICAgICAgICB2YXIgbW92ZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wIC0gcG9zaXRpb25zW3N0YXJ0UG9zIC0gMV07XG5cbiAgICAgICAgICAvLyBCYXNlZCBvbiA1MG1zIGNvbXB1dGUgdGhlIG1vdmVtZW50IHRvIGFwcGx5IGZvciBlYWNoIHJlbmRlciBzdGVwXG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG1vdmVkTGVmdCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbW92ZWRUb3AgLyB0aW1lT2Zmc2V0ICogKDEwMDAgLyA2MCk7XG5cbiAgICAgICAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBzdGFydCB0aGUgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgdmFyIG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wYWdpbmcgfHwgdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDE7XG5cbiAgICAgICAgICAvLyBWZXJpZnkgdGhhdCB3ZSBoYXZlIGVub3VnaCB2ZWxvY2l0eSB0byBzdGFydCBkZWNlbGVyYXRpb25cbiAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuX19zdGFydERlY2VsZXJhdGlvbih0aW1lU3RhbXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpID4gMTAwKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIElmIHRoaXMgd2FzIGEgc2xvd2VyIG1vdmUgaXQgaXMgcGVyIGRlZmF1bHQgbm9uIGRlY2VsZXJhdGVkLCBidXQgdGhpc1xuICAgIC8vIHN0aWxsIG1lYW5zIHRoYXQgd2Ugd2FudCBzbmFwIGJhY2sgdG8gdGhlIGJvdW5kcyB3aGljaCBpcyBkb25lIGhlcmUuXG4gICAgLy8gVGhpcyBpcyBwbGFjZWQgb3V0c2lkZSB0aGUgY29uZGl0aW9uIGFib3ZlIHRvIGltcHJvdmUgZWRnZSBjYXNlIHN0YWJpbGl0eVxuICAgIC8vIGUuZy4gdG91Y2hlbmQgZmlyZWQgd2l0aG91dCBlbmFibGVkIGRyYWdnaW5nLiBUaGlzIHNob3VsZCBub3JtYWxseSBkbyBub3RcbiAgICAvLyBoYXZlIG1vZGlmaWVkIHRoZSBzY3JvbGwgcG9zaXRpb25zIG9yIGV2ZW4gc2hvd2VkIHRoZSBzY3JvbGxiYXJzIHRob3VnaC5cbiAgICBpZiAoIXRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgaWYgKHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiB8fCB0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgIH1cblxuICAgIC8vIEZ1bGx5IGNsZWFudXAgbGlzdFxuICAgIHRoaXMuX19wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgUFJJVkFURSBBUElcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBjb250ZW50IGVsZW1lbnRcbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlcn0gTGVmdCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyfSBUb3Agc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIGFuaW1hdGlvbiBzaG91bGQgYmUgdXNlZCB0byBtb3ZlIHRvIHRoZSBuZXcgY29vcmRpbmF0ZXNcbiAgICovXG4gIF9fcHVibGlzaChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpIHtcbiAgICAvLyBSZW1lbWJlciB3aGV0aGVyIHdlIGhhZCBhbiBhbmltYXRpb24sIHRoZW4gd2UgdHJ5IHRvIGNvbnRpbnVlXG4gICAgLy8gYmFzZWQgb24gdGhlIGN1cnJlbnQgXCJkcml2ZVwiIG9mIHRoZSBhbmltYXRpb24uXG4gICAgdmFyIHdhc0FuaW1hdGluZyA9IHRoaXMuX19pc0FuaW1hdGluZztcbiAgICBpZiAod2FzQW5pbWF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3Aod2FzQW5pbWF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChpc0FuaW1hdGVkICYmIHRoaXMub3B0aW9ucy5hbmltYXRpbmcpIHtcbiAgICAgIC8vIEtlZXAgc2NoZWR1bGVkIHBvc2l0aW9ucyBmb3Igc2Nyb2xsQnkvem9vbUJ5IGZ1bmN0aW9uYWxpdHkuXG4gICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdG9wO1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB6b29tO1xuXG4gICAgICB2YXIgb2xkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgdmFyIG9sZFRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgICB2YXIgb2xkWm9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgIHZhciBkaWZmTGVmdCA9IGxlZnQgLSBvbGRMZWZ0O1xuICAgICAgdmFyIGRpZmZUb3AgPSB0b3AgLSBvbGRUb3A7XG4gICAgICB2YXIgZGlmZlpvb20gPSB6b29tIC0gb2xkWm9vbTtcblxuICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgICAgaWYgKHJlbmRlcikge1xuICAgICAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gb2xkTGVmdCArIChkaWZmTGVmdCAqIHBlcmNlbnQpO1xuICAgICAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBvbGRUb3AgKyAoZGlmZlRvcCAqIHBlcmNlbnQpO1xuICAgICAgICAgIHRoaXMuX196b29tTGV2ZWwgPSBvbGRab29tICsgKGRpZmZab29tICogcGVyY2VudCk7XG5cbiAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLl9fY2FsbGJhY2sodGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9faXNBbmltYXRpbmcgPT09IGlkO1xuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbklkID09PSB0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlIHx8IHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICAgIGlmICh0aGlzLl9fem9vbUNvbXBsZXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgLy8gV2hlbiBjb250aW51aW5nIGJhc2VkIG9uIHByZXZpb3VzIGFuaW1hdGlvbiB3ZSBjaG9vc2UgYW4gZWFzZS1vdXQgYW5pbWF0aW9uIGluc3RlYWQgb2YgZWFzZS1pbi1vdXRcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQsIHRoaXMub3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbiwgd2FzQW5pbWF0aW5nID8gZWFzZU91dEN1YmljIDogZWFzZUluT3V0Q3ViaWMpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgPSBsZWZ0O1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHRoaXMuX196b29tTGV2ZWwgPSB6b29tO1xuXG4gICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fX2NhbGxiYWNrKGxlZnQsIHRvcCwgem9vbSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpeCBtYXggc2Nyb2xsIHJhbmdlc1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgIGlmICh0aGlzLl9fem9vbUNvbXBsZXRlKSB7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKipcbiAgICogUmVjb21wdXRlcyBzY3JvbGwgbWluaW11bSB2YWx1ZXMgYmFzZWQgb24gY2xpZW50IGRpbWVuc2lvbnMgYW5kIGNvbnRlbnQgZGltZW5zaW9ucy5cbiAgICovXG4gIF9fY29tcHV0ZVNjcm9sbE1heCh6b29tTGV2ZWwpIHtcbiAgICBpZiAoem9vbUxldmVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHpvb21MZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgdGhpcy5fX21heFNjcm9sbExlZnQgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudFdpZHRoICogem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudFdpZHRoLCAwKTtcbiAgICB0aGlzLl9fbWF4U2Nyb2xsVG9wID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRIZWlnaHQgKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50SGVpZ2h0LCAwKTtcbiAgfVxuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIEFOSU1BVElPTiAoREVDRUxFUkFUSU9OKSBTVVBQT1JUXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIGEgdG91Y2ggc2VxdWVuY2UgZW5kIGFuZCB0aGUgc3BlZWQgb2YgdGhlIGZpbmdlciB3YXMgaGlnaCBlbm91Z2hcbiAgICogdG8gc3dpdGNoIGludG8gZGVjZWxlcmF0aW9uIG1vZGUuXG4gICAqL1xuICBfX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fbWF4U2Nyb2xsTGVmdCksIDApO1xuICAgICAgdmFyIHNjcm9sbFRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX19tYXhTY3JvbGxUb3ApLCAwKTtcbiAgICAgIHZhciBjbGllbnRXaWR0aCA9IHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIHZhciBjbGllbnRIZWlnaHQgPSB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuXG4gICAgICAvLyBXZSBsaW1pdCBkZWNlbGVyYXRpb24gbm90IHRvIHRoZSBtaW4vbWF4IHZhbHVlcyBvZiB0aGUgYWxsb3dlZCByYW5nZSwgYnV0IHRvIHRoZSBzaXplIG9mIHRoZSB2aXNpYmxlIGNsaWVudCBhcmVhLlxuICAgICAgLy8gRWFjaCBwYWdlIHNob3VsZCBoYXZlIGV4YWN0bHkgdGhlIHNpemUgb2YgdGhlIGNsaWVudCBhcmVhLlxuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmZsb29yKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmZsb29yKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguY2VpbChzY3JvbGxMZWZ0IC8gY2xpZW50V2lkdGgpICogY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5jZWlsKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gMDtcbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSAwO1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH1cblxuICAgIC8vIFdyYXAgY2xhc3MgbWV0aG9kXG4gICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgIHRoaXMuX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIGtlZXAgdGhlIGRlY2VsZXJhdGlvbiBydW5uaW5nXG4gICAgdmFyIG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nID0gdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDAuMTtcblxuICAgIC8vIERldGVjdCB3aGV0aGVyIGl0J3Mgc3RpbGwgd29ydGggdG8gY29udGludWUgYW5pbWF0aW5nIHN0ZXBzXG4gICAgLy8gSWYgd2UgYXJlIGFscmVhZHkgc2xvdyBlbm91Z2ggdG8gbm90IGJlaW5nIHVzZXIgcGVyY2VpdmFibGUgYW55bW9yZSwgd2Ugc3RvcCB0aGUgd2hvbGUgcHJvY2VzcyBoZXJlLlxuICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc2hvdWxkQ29udGludWUgPSBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+PSBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+PSBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZztcbiAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaG91bGRDb250aW51ZTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQW5pbWF0ZSB0byBncmlkIHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlLCBvdGhlcndpc2UganVzdCBmaXggb3V0LW9mLWJvdW5kYXJ5IHBvc2l0aW9uc1xuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5vcHRpb25zLnNuYXBwaW5nKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBTdGFydCBhbmltYXRpb24gYW5kIHN3aXRjaCBvbiBmbGFnXG4gICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDYWxsZWQgb24gZXZlcnkgc3RlcCBvZiB0aGUgYW5pbWF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBpbk1lbW9yeSB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0byBub3QgcmVuZGVyIHRoZSBjdXJyZW50IHN0ZXAsIGJ1dCBrZWVwIGl0IGluIG1lbW9yeSBvbmx5LiBVc2VkIGludGVybmFsbHkgb25seSFcbiAgICovXG4gIF9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKSB7XG5cbiAgICAvL1xuICAgIC8vIENPTVBVVEUgTkVYVCBTQ1JPTEwgUE9TSVRJT05cbiAgICAvL1xuXG4gICAgLy8gQWRkIGRlY2VsZXJhdGlvbiB0byBzY3JvbGwgcG9zaXRpb25cbiAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WDtcbiAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVk7XG5cblxuICAgIC8vXG4gICAgLy8gSEFSRCBMSU1JVCBTQ1JPTEwgUE9TSVRJT04gRk9SIE5PTiBCT1VOQ0lORyBNT0RFXG4gICAgLy9cblxuICAgIGlmICghdGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsTGVmdEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQsIHNjcm9sbExlZnQpLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCk7XG4gICAgICBpZiAoc2Nyb2xsTGVmdEZpeGVkICE9PSBzY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0Rml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSAwO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2Nyb2xsVG9wRml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wLCBzY3JvbGxUb3ApLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKTtcbiAgICAgIGlmIChzY3JvbGxUb3BGaXhlZCAhPT0gc2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbFRvcCA9IHNjcm9sbFRvcEZpeGVkO1xuICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gMDtcbiAgICAgIH1cbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gVVBEQVRFIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICBpZiAocmVuZGVyKSB7XG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gc2Nyb2xsVG9wO1xuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBTTE9XIERPV05cbiAgICAvL1xuXG4gICAgLy8gU2xvdyBkb3duIHZlbG9jaXR5IG9uIGV2ZXJ5IGl0ZXJhdGlvblxuICAgIGlmICghdGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gZXZlcnkgaXRlcmF0aW9uIG9mIHRoZSBhbmltYXRpb25cbiAgICAgIC8vIHRvIHNsb3cgZG93biB0aGUgcHJvY2Vzcy4gVGhpcyBzaG91bGQgZW11bGF0ZSBuYXR1cmFsIGJlaGF2aW9yIHdoZXJlXG4gICAgICAvLyBvYmplY3RzIHNsb3cgZG93biB3aGVuIHRoZSBpbml0aWF0b3Igb2YgdGhlIG1vdmVtZW50IGlzIHJlbW92ZWRcbiAgICAgIHZhciBmcmljdGlvbkZhY3RvciA9IDAuOTU7XG5cbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBCT1VOQ0lORyBTVVBQT1JUXG4gICAgLy9cblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWCA9IDA7XG4gICAgICB2YXIgc2Nyb2xsT3V0c2lkZVkgPSAwO1xuXG4gICAgICAvLyBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24vYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllc1xuICAgICAgdmFyIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgdmFyIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuXG4gICAgICAvLyBDaGVjayBsaW1pdHNcbiAgICAgIGlmIChzY3JvbGxMZWZ0IDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbFRvcCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxUb3AgPiB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIH1cblxuICAgICAgLy8gU2xvdyBkb3duIHVudGlsIHNsb3cgZW5vdWdoLCB0aGVuIGZsaXAgYmFjayB0byBzbmFwIHBvc2l0aW9uXG4gICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggIT09IDApIHtcbiAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCArPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZICs9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IGVudiBmcm9tICcuL2Vudic7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2NvbXBvbmVudHMvZWxlbWVudHMnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCBjb21wdXRlTGF5b3V0IGZyb20gJ2Nzcy1sYXlvdXQnO1xuaW1wb3J0IHsgaXNDbGljaywgU1RBVEUsIGNsZWFyQ2FudmFzLCBpc0dhbWVUb3VjaEV2ZW50IH0gZnJvbSAnLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgcGFyc2VyIGZyb20gJy4vbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IERlYnVnSW5mbyBmcm9tICcuL2NvbW1vbi9kZWJ1Z0luZm8nO1xuaW1wb3J0IFRpY2tlciBmcm9tICcuL2NvbW1vbi90aWNrZXInO1xuaW1wb3J0IHsgY3JlYXRlLCByZW5kZXJDaGlsZHJlbiwgbGF5b3V0Q2hpbGRyZW4sIHJlcGFpbnRDaGlsZHJlbiwgaXRlcmF0ZVRyZWUsIGNsb25lLCByZWdpc3RlckNvbXBvbmVudCB9IGZyb20gJy4vY29tbW9uL3ZkJztcbmltcG9ydCBSZWN0IGZyb20gJy4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgVmlldywgVGV4dCwgSW1hZ2UsIFNjcm9sbFZpZXcsIEJpdE1hcFRleHQsIENhbnZhcywgQnV0dG9uIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50LCBDYWxsYmFjayB9IGZyb20gJy4vdHlwZXMvaW5kZXgnO1xuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyKCk7XG5jb25zdCBpbWdQb29sID0gbmV3IFBvb2woJ2ltZ1Bvb2wnKTtcbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbCgnYml0TWFwUG9vbCcpO1xuY29uc3QgZGVidWdJbmZvID0gbmV3IERlYnVnSW5mbygpO1xuXG5pbnRlcmZhY2UgSVZpZXdQb3J0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJVmlld1BvcnRCb3gge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFdmVudEhhbmRsZXJEYXRhIHtcbiAgaGFzRXZlbnRCaW5kOiBib29sZWFuO1xuICB0b3VjaE1zZzoge1xuICAgIFtrZXk6IHN0cmluZ106IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIH07XG4gIGhhbmRsZXJzOiB7XG4gICAgdG91Y2hTdGFydDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaE1vdmU6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hFbmQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hDYW5jZWw6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIH07XG59XG5cbmludGVyZmFjZSBJUGx1Z2luPFQ+IHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnN0YWxsOiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbiAgdW5pbnN0YWxsPzogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG59XG5cbi8qKlxuICog6buY6K6k5pq06ZyyIExheW91dCDnmoTlrp7kvovvvIzkvYblnKjmn5DkupvlnLrmma/kuIvvvIzlj6/og73pnIDopoHlpJrkuKogTGF5b3V0IOWunuS+i++8jOWboOatpCBMYXlvdXQg57G75Lmf5pq06Zyy5Ye65Y67XG4gKiBjb25zdCBteUxheW91dCA9IG5ldyBMYXlvdXQoe1xuICogICBzdHlsZToge1xuICogICAgICB3aWR0aDogMCxcbiAqICAgICAgaGVpZ2h0OiAwLFxuICogICB9LFxuICogIG5hbWU6ICdteUxheW91dE5hbWUnLFxuICogfSk7XG4gKi9cbmNsYXNzIExheW91dCBleHRlbmRzIEVsZW1lbnQge1xuICAvKipcbiAgICog5b2T5YmNIExheW91dCDniYjmnKzvvIzkuIDoiKzot5/lsI/muLjmiI/mj5Lku7bniYjmnKzlr7npvZBcbiAgICovXG4gIHB1YmxpYyB2ZXJzaW9uID0gJzEuMC44JztcblxuICBlbnYgPSBlbnY7XG4gIFxuICAvKipcbiAgICogTGF5b3V0IOa4suafk+eahOebruagh+eUu+W4g+WvueW6lOeahCAyZCBjb250ZXh0XG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZW5kZXJwb3J0OiBJVmlld1BvcnQgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnQ6IElWaWV3UG9ydEJveCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuXG4gIC8qKlxuICAgKiDnlLvluIPlsLrlr7jlkozlrp7pmYXooqvmuLLmn5PliLDlsY/luZXnmoTniannkIblsLrlr7jmr5RcbiAgICovXG4gIHB1YmxpYyB2aWV3cG9ydFNjYWxlID0gMTtcbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhnVwZGF0ZVZpZXdQb3J05pa55rOV5piv5ZCm6KKr6LCD55So6L+H5LqG77yM6L+Z5Zyo5bCP5ri45oiP546v5aKD6Z2e5bi46YeN6KaBXG4gICAqL1xuICBwdWJsaWMgaGFzVmlld1BvcnRTZXQgPSBmYWxzZTtcblxuICAvKipcbiAgICog5pyA57uI5riy5p+T5Yiw5bGP5bmV55qE5bem5LiK6KeS54mp55CG5Z2Q5qCHXG4gICAqL1xuICBwdWJsaWMgcmVhbExheW91dEJveDoge1xuICAgIHJlYWxYOiBudW1iZXI7XG4gICAgcmVhbFk6IG51bWJlcjtcbiAgfSA9IHtcbiAgICAgIHJlYWxYOiAwLFxuICAgICAgcmVhbFk6IDAsXG4gICAgfTtcblxuICBwdWJsaWMgYml0TWFwRm9udHM6IEJpdE1hcEZvbnRbXSA9IFtdO1xuICBwdWJsaWMgZWxlQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhdGU6IFNUQVRFID0gU1RBVEUuVU5JTklUO1xuXG4gIC8qKlxuICAgKiDnlKjkuo7lnKggdGlja2VyIOeahOW+queOr+mHjOmdouagh+ivhuW9k+WJjeW4p+aYr+WQpumcgOimgemHjee7mFxuICAgKiDph43nu5jkuIDoiKzmmK/lm77niYfliqDovb3lrozmiJDjgIHmloflrZfkv67mlLnnrYnlnLrmma9cbiAgICovXG4gIHB1YmxpYyBpc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gIHB1YmxpYyB0aWNrZXI6IFRpY2tlciA9IG5ldyBUaWNrZXIoKTtcbiAgcHVibGljIHRpY2tlckZ1bmMgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuaXNEaXJ0eSkge1xuICAgICAgdGhpcy5lbWl0KCdiZWZvcmVfcmVmbG93JywgJycpO1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNOZWVkUmVwYWludCkge1xuICAgICAgdGhpcy5yZXBhaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyRGF0YTogRXZlbnRIYW5kbGVyRGF0YTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUsXG4gIH06IHtcbiAgICBzdHlsZT86IElTdHlsZTtcbiAgICBuYW1lPzogc3RyaW5nO1xuICB9KSB7XG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgICBpZDogMCxcbiAgICB9KTtcblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YSA9IHtcbiAgICAgIGhhc0V2ZW50QmluZDogZmFsc2UsXG4gICAgICB0b3VjaE1zZzoge30sXG4gICAgICBoYW5kbGVyczoge1xuICAgICAgICB0b3VjaFN0YXJ0OiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hzdGFydCcpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoTW92ZTogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNobW92ZScpLmJpbmQodGhpcyksXG4gICAgICAgIHRvdWNoRW5kOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hlbmQnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaENhbmNlbDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoY2FuY2VsJykuYmluZCh0aGlzKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOWvueS6juS4jeS8muW9seWTjeW4g+WxgOeahOaUueWKqO+8jOavlOWmguWbvueJh+WPquaYr+aUueS4quWcsOWdgOOAgeWKoOS4quiDjOaZr+iJsuS5i+exu+eahOaUueWKqO+8jOS8muinpuWPkSBMYXlvdXQg55qEIHJlcGFpbnQg5pON5L2cXG4gICAgICog6Kem5Y+R55qE5pa55byP5piv57uZIExheW91dCDmipvkuKogYHJlcGFpbnRgIOeahOS6i+S7tu+8jOS4uuS6huaAp+iDve+8jOavj+asoeaOpeaUtuWIsCByZXBhaW50IOivt+axguS4jeS8muaJp+ihjOecn+ato+eahOa4suafk1xuICAgICAqIOiAjOaYr+aJp+ihjOS4gOS4que9ruiEj+aTjeS9nO+8jHRpY2tlciDmr4/kuIDmrKHmiafooYwgdXBkYXRlIOS8muajgOafpei/meS4quagh+iusOS9je+8jOi/m+iAjOaJp+ihjOecn+ato+eahOmHjee7mOaTjeS9nFxuICAgICAqL1xuICAgIHRoaXMub24oJ3JlcGFpbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5bCGIFR3ZWVuIOaMgui9veWIsCBMYXlvdXTvvIzlr7nkuo4gVHdlZW4g55qE5L2/55So5a6M5YWo6YG15b6qIFR3ZWVuLmpzIOeahOaWh+aho1xuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL1xuICAgICAqIOWPquS4jei/h+W9kyBUd2VlbiDmlLnliqjkuoboioLngrnkvJrop6blj5EgcmVwYWludOOAgXJlZmxvdyDnmoTlsZ7mgKfml7bvvIxMYXlvdXQg5Lya5omn6KGM55u45bqU55qE5pON5L2cXG4gICAgICog5Lia5Yqh5L6n5LiN55So5oSf55+l5YiwIHJlcGFpbnQg5ZKMIHJlZmxvd1xuICAgICAqL1xuICAgIC8vIHRoaXMuVFdFRU4gPSBUV0VFTjtcbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0gdiR7dGhpcy52ZXJzaW9ufWApO1xuICB9XG5cbiAgLy8g5LiO6ICB54mI5pys5YW85a65XG4gIGdldCBkZWJ1Z0luZm8oKSB7XG4gICAgbGV0IGluZm8gPSBkZWJ1Z0luZm8ubG9nKCk7XG5cbiAgICBpbmZvICs9IGBlbGVtZW50Q291bnQ6ICR7dGhpcy5lbGVDb3VudH1cXG5gO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICAvKipcbiAgICog5pu05paw6KKr57uY5Yi2Y2FudmFz55qE56qX5Y+j5L+h5oGv77yM5pys5riy5p+T5byV5pOO5bm25LiN5YWz5b+D5piv5ZCm5Lya5ZKM5YW25LuW5ri45oiP5byV5pOO5YWx5ZCM5L2/55SoXG4gICAqIOiAjOacrOi6q+WPiOmcgOimgeaUr+aMgeS6i+S7tuWkhOeQhu+8jOWboOatpO+8jOWmguaenOiiq+a4suafk+WGheWuueaYr+e7mOWItuWIsOemu+Wxj2NhbnZhc++8jOmcgOimgeWwhuacgOe7iOe7mOWItuWcqOWxj+W5leS4ilxuICAgKiDnmoTnu53lr7nlsLrlr7jlkozkvY3nva7kv6Hmga/mm7TmlrDliLDmnKzmuLLmn5PlvJXmk47jgIJcbiAgICog5YW25Lit77yMd2lkdGjkuLrniannkIblg4/ntKDlrr3luqbvvIxoZWlnaHTkuLrniannkIblg4/ntKDpq5jluqbvvIx45Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgeOWdkOagh++8jHnkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKBcbiAgICogeeWdkOagh1xuICAgKi9cbiAgdXBkYXRlVmlld1BvcnQoYm94OiBJVmlld1BvcnRCb3gpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gYm94LndpZHRoIHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBib3guaGVpZ2h0IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gYm94LnggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSBib3gueSB8fCAwO1xuXG4gICAgdGhpcy5yZWFsTGF5b3V0Qm94ID0ge1xuICAgICAgcmVhbFg6IHRoaXMudmlld3BvcnQueCxcbiAgICAgIHJlYWxZOiB0aGlzLnZpZXdwb3J0LnksXG4gICAgfTtcblxuICAgIHRoaXMuaGFzVmlld1BvcnRTZXQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yOiBDYWxsYmFjaykge1xuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdCcpO1xuICAgIGNvbnN0IHBhcnNlQ29uZmlnID0ge1xuICAgICAgYXR0cmlidXRlTmFtZVByZWZpeDogJycsXG4gICAgICBhdHRyTm9kZU5hbWU6ICdhdHRyJywgLy8gZGVmYXVsdCBpcyAnZmFsc2UnXG4gICAgICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgIGlnbm9yZU5hbWVTcGFjZTogdHJ1ZSxcbiAgICAgIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBwYXJzZU5vZGVWYWx1ZTogZmFsc2UsXG4gICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgIHRyaW1WYWx1ZXM6IHRydWUsXG4gICAgICBwYXJzZVRydWVOdW1iZXJPbmx5OiBmYWxzZSxcbiAgICAgIGFsd2F5c0NyZWF0ZVRleHROb2RlOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoYXR0clZhbHVlUHJvY2Vzc29yICYmIHR5cGVvZiBhdHRyVmFsdWVQcm9jZXNzb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBhcnNlQ29uZmlnLmF0dHJWYWx1ZVByb2Nlc3NvciA9IGF0dHJWYWx1ZVByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sUGFyc2UnKTtcbiAgICAvLyDlsIZ4bWzlrZfnrKbkuLLop6PmnpDmiJB4bWzoioLngrnmoJFcbiAgICBjb25zdCBqc29uT2JqID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBwYXJzZUNvbmZpZywgdHJ1ZSk7XG4gICAgLy8gY29uc29sZS5sb2coanNvbk9iailcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbFBhcnNlJyk7XG5cbiAgICBjb25zdCB4bWxUcmVlID0ganNvbk9iai5jaGlsZHJlblswXTtcblxuICAgIC8vIFhNTOagkeeUn+aIkOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWwyTGF5b3V0Jyk7XG4gICAgY29uc3QgbGF5b3V0VHJlZSA9IGNyZWF0ZS5jYWxsKHRoaXMsIHhtbFRyZWUsIHN0eWxlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbDJMYXlvdXQnKTtcblxuICAgIHRoaXMuYWRkKGxheW91dFRyZWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLklOSVRFRDtcblxuICAgIHRoaXMudGlja2VyLmFkZCh0aGlzLnRpY2tlckZ1bmMsIHRydWUpO1xuICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0Jyk7XG4gIH1cblxuICByZWZsb3coaXNGaXJzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0ZpcnN0KSB7XG4gICAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9yZWZsb3cnKTtcbiAgICAvKipcbiAgICAgKiDorqHnrpfluIPlsYDmoJFcbiAgICAgKiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr1xuICAgICAqIExheW91dOacrOi6q+W5tuS4jeS9nOS4uuW4g+WxgOiuoeeul++8jOWPquaYr+S9nOS4uuiKgueCueagkeeahOWuueWZqFxuICAgICAqL1xuICAgIGRlYnVnSW5mby5zdGFydCgnY29tcHV0ZUxheW91dCcsIHRydWUpO1xuICAgIGNvbXB1dGVMYXlvdXQodGhpcy5jaGlsZHJlblswXSk7XG4gICAgZGVidWdJbmZvLmVuZCgnY29tcHV0ZUxheW91dCcpO1xuXG4gICAgY29uc3Qgcm9vdEVsZSA9IHRoaXMuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAocm9vdEVsZS5zdHlsZS53aWR0aCA9PT0gdW5kZWZpbmVkIHx8IHJvb3RFbGUuc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBzZXQgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0eSBmb3Igcm9vdCBlbGVtZW50Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVycG9ydC53aWR0aCA9IHJvb3RFbGUuc3R5bGUud2lkdGg7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQuaGVpZ2h0ID0gcm9vdEVsZS5zdHlsZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8g5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRDaGlsZHJlbicsIHRydWUpO1xuICAgIGxheW91dENoaWxkcmVuKHRoaXMpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dENoaWxkcmVuJyk7XG5cbiAgICB0aGlzLnZpZXdwb3J0U2NhbGUgPSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gdGhpcy5yZW5kZXJwb3J0LndpZHRoO1xuXG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICAvLyDpgY3ljoboioLngrnmoJHvvIzkvp3mrKHosIPnlKjoioLngrnnmoTmuLLmn5PmjqXlj6Plrp7njrDmuLLmn5NcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlbmRlckNoaWxkcmVuJywgdHJ1ZSk7XG4gICAgcmVuZGVyQ2hpbGRyZW4odGhpcy5jaGlsZHJlbiwgdGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZmFsc2UpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlbmRlckNoaWxkcmVuJyk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlcGFpbnQnLCB0cnVlKTtcbiAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZXBhaW50Jyk7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCAoZWxlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbGUucHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X3JlZmxvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXTpmLbmrrXmoLjlv4Pku4Xku4XmmK/moLnmja54bWzlkoxjc3PliJvlu7rkuoboioLngrnmoJFcbiAgICog6KaB5a6e546w55yf5q2j55qE5riy5p+T77yM6ZyA6KaB6LCD55SoIGxheW91dCDlh73mlbDvvIzkuYvmiYDku6XlsIYgbGF5b3V0IOWNleeLrOaKveixoeS4uuS4gOS4quWHveaVsO+8jOaYr+WboOS4uiBsYXlvdXQg5bqU5b2T5piv5Y+v5Lul6YeN5aSN6LCD55So55qEXG4gICAqIOavlOWmguaUueWPmOS6huS4gOS4quWFg+e0oOeahOWwuuWvuO+8jOWunumZheS4iuiKgueCueagkeaYr+ayoeWPmOeahO+8jOS7heS7heaYr+mcgOimgemHjeaWsOiuoeeul+W4g+WxgO+8jOeEtuWQjua4suafk1xuICAgKiDkuIDkuKrlrozmlbTnmoQgbGF5b3V0IOWIhuaIkOS4i+mdoueahOWHoOatpe+8mlxuICAgKiAxLiDmiafooYznlLvluIPmuIXnkIbvvIzlm6DkuLrluIPlsYDlj5jljJbpobXpnaLpnIDopoHph43nu5jvvIzov5nph4zmsqHmnInlgZrlvojpq5jnuqfnmoTliZTpmaTnrYnmk43kvZzvvIzkuIDlvovmuIXpmaTph43nlLvvvIzlrp7pmYXkuIrmgKfog73lt7Lnu4/lvojlpb1cbiAgICogMi4g6IqC54K55qCR6YO95ZCr5pyJIHN0eWxlIOWxnuaAp++8jGNzcy1sYXlvdXQg6IO95aSf5qC55o2u6L+Z5Lqb5L+h5oGv6K6h566X5Ye65pyA57uI5biD5bGA77yM6K+m5oOF5Y+v6KeBIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Nzcy1sYXlvdXRcbiAgICogMy4g57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga/vvIzkvYbov5nkupvkv6Hmga/lubbkuI3mmK/og73lpJ/nm7TmjqXnlKjnmoRcbiAgICogICAg5q+U5aaCIGxheW91dC50b3Ag5piv5oyH5Zyo5LiA5Liq54i25a655Zmo5YaF55qEIHRvcO+8jOacgOe7iOimgeWunueOsOa4suafk++8jOWunumZheS4iuimgemAkuW9kuWKoOS4iuWkjeWuueWZqOeahCB0b3BcbiAgICogICAg6L+Z5qC35q+P5qyhIHJlcGFpbnQg55qE5pe25YCZ5Y+q6ZyA6KaB55u05o6l5L2/55So6K6h566X5aW955qE5YC85Y2z5Y+v77yM5LiN6ZyA6KaB5q+P5qyh6YO96YCS5b2S6K6h566XXG4gICAqICAgIOi/meS4gOatpeensOS4uiBsYXlvdXRDaGlsZHJlbu+8jOebrueahOWcqOS6juWwhiBjc3MtbGF5b3V0IOi/m+S4gOatpeWkhOeQhuS4uuWPr+S7pea4suafk+ebtOaOpeeUqOeahOW4g+WxgOS/oeaBr1xuICAgKiA0LiByZW5kZXJDaGlsZHJlbu+8muaJp+ihjOa4suafk1xuICAgKiA1LiBiaW5kRXZlbnRz77ya5omn6KGM5LqL5Lu257uR5a6aXG4gICAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGxheW91dChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKCF0aGlzLmhhc1ZpZXdQb3J0U2V0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2UgaW52b2tlIG1ldGhvZCBgdXBkYXRlVmlld1BvcnRgIGJlZm9yZSBtZXRob2QgYGxheW91dGAnKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dCcpO1xuXG4gICAgdGhpcy5yZWZsb3codHJ1ZSk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vdGhlcicpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnLCB0cnVlKTtcbiAgICBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCBlbGVtZW50ID0+IGVsZW1lbnQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50Jyk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuUkVOREVSRUQ7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXQnKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb3RoZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzoioLngrnmlbDnmoTph43nu5jliLbvvIzkuIDoiKzkuJrliqHkvqfml6DpnIDosIPnlKjor6Xmlrnms5VcbiAgICovXG4gIHJlcGFpbnQoKSB7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgICByZXBhaW50Q2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG4gIH1cblxuICAvKipcbiAgICog6L+U5Zue5LiA5Liq6IqC54K55Zyo5bGP5bmV5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGv77yM5YmN5o+Q5piv5q2j56Gu6LCD55SodXBkYXRlVmlld1BvcnTjgIJcbiAgICovXG4gIGdldEVsZW1lbnRWaWV3cG9ydFJlY3QoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IHsgcmVhbExheW91dEJveCwgdmlld3BvcnRTY2FsZSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBhYnNvbHV0ZVgsXG4gICAgICBhYnNvbHV0ZVksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gZWxlbWVudC5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB2aWV3cG9ydFNjYWxlO1xuICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB2aWV3cG9ydFNjYWxlO1xuXG4gICAgcmV0dXJuIG5ldyBSZWN0KFxuICAgICAgcmVhbFgsXG4gICAgICByZWFsWSxcbiAgICAgIHJlYWxXaWR0aCxcbiAgICAgIHJlYWxIZWlnaHQsXG4gICAgKTtcbiAgfVxuXG4gIGdldENoaWxkQnlQb3ModHJlZTogTGF5b3V0IHwgRWxlbWVudCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGl0ZW1MaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFic29sdXRlWCxcbiAgICAgICAgYWJzb2x1dGVZLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGVsZS5sYXlvdXRCb3g7XG4gICAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWDtcbiAgICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy52aWV3cG9ydFNjYWxlO1xuXG4gICAgICBpZiAoKHJlYWxYIDw9IHggJiYgeCA8PSByZWFsWCArIHJlYWxXaWR0aCkgJiYgKHJlYWxZIDw9IHkgJiYgeSA8PSByZWFsWSArIHJlYWxIZWlnaHQpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnm7jlhbNpc3N1Ze+8mmh0dHBzOi8vZ2l0aHViLmNvbS93ZWNoYXQtbWluaXByb2dyYW0vbWluaWdhbWUtY2FudmFzLWVuZ2luZS9pc3N1ZXMvMTdcbiAgICAgICAgICog6L+Z6YeM5Y+q6KaB5ruh6Laz5p2h5Lu255qE6YO96KaB6K6w5b2V77yM5ZCm5YiZ5Y+v6IO95Ye6546wIGlzc3VlIOmHjOmdouaPkOWIsOeahOmXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgaXRlbUxpc3QucHVzaChlbGUpO1xuICAgICAgICBpZiAoZWxlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyhlbGUsIHgsIHksIGl0ZW1MaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyID0gKGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCB0b3VjaDogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcblxuICAgICAgaWYgKGlzR2FtZVRvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3VjaCA9IGU7XG4gICAgICB9XG4gICAgICAvLyBjb25zdCB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB8fCBlO1xuICAgICAgaWYgKCF0b3VjaCB8fCAhdG91Y2gucGFnZVggfHwgIXRvdWNoLnBhZ2VZKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaC50aW1lU3RhbXApIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0b3VjaC50aW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdDogKExheW91dCB8IEVsZW1lbnQpW10gPSBbXTtcbiAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICB0aGlzLmdldENoaWxkQnlQb3ModGhpcywgdG91Y2gucGFnZVgsIHRvdWNoLnBhZ2VZLCBsaXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICBsaXN0LnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgICBpdGVtICYmIGl0ZW0uZW1pdChldmVudE5hbWUsIGUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnROYW1lID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZ1tldmVudE5hbWVdID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaGVuZCcgJiYgaXNDbGljayh0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2cpKSB7XG4gICAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KCdjbGljaycsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM5YWo5bGA55qE5LqL5Lu257uR5a6a6YC76L6RIFxuICAgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIGVudi5vblRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgIGVudi5vblRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICBlbnYub25Ub3VjaEVuZCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQpO1xuICAgIGVudi5vblRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG4gIH1cblxuICAvKipcbiAgICog5YWo5bGA5LqL5Lu26Kej57uRIFxuICAgKi9cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGVudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICBlbnYub2ZmVG91Y2hNb3ZlKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmUpO1xuICAgIGVudi5vZmZUb3VjaEVuZCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQpO1xuICAgIGVudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBFRS5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3lBbGwodHJlZTogTGF5b3V0IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgIH0gPSB0cmVlO1xuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZGVzdHJveUFsbChjaGlsZCk7XG4gICAgICBjaGlsZC5kZXN0cm95U2VsZiAmJiBjaGlsZC5kZXN0cm95U2VsZigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4heeQhueUu+W4g++8jOS5i+WJjeeahOiuoeeul+WHuuadpeeahOa4suafk+agkeS5n+S8muS4gOW5tua4heeQhu+8jOatpOaXtuWPr+S7peWGjeasoeaJp+ihjGluaXTlkoxsYXlvdXTmlrnms5XmuLLmn5PnlYzpnaLjgIJcbiAgICovXG4gIGNsZWFyKG9wdGlvbnM6IHsgcmVtb3ZlVGlja2VyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB7IHJlbW92ZVRpY2tlciA9IHRydWUgfSA9IG9wdGlvbnM7XG5cbiAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB0aGlzLmRlc3Ryb3lBbGwodGhpcyk7XG4gICAgLy8gdGhpcy5lbGVtZW50VHJlZSA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5DTEVBUjtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB0aGlzLmVsZUNvdW50ID0gMDtcbiAgICB0aGlzLnVuQmluZEV2ZW50cygpO1xuXG4gICAgaWYgKHJlbW92ZVRpY2tlcikge1xuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlKCk7XG4gICAgICB0aGlzLnRpY2tlci5zdG9wKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGlubmVy55qE5bqU6K+l6buY6K6k6YO956e76Zmk77yM5ZCm5YiZ5YmN5ZCO5Lik5qyh5Yid5aeL5YyW5Lya5a+86Ie05YmN5ZCO54q25oCB5pyJ6Zeu6aKYXG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmVJbm5lcigpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyUG9vbCgpIHtcbiAgICBpbWdQb29sLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICog5q+U6LW3IExheW91dC5jbGVhciDmm7TlvbvlupXnmoTmuIXnkIbvvIzkvJrmuIXnqbrlm77niYflr7nosaHmsaDvvIzlh4/lsJHlhoXlrZjljaDnlKjjgIJcbiAgICovXG4gIGNsZWFyQWxsKCkge1xuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIHRoaXMuY2xlYXJQb29sKCk7XG4gIH1cblxuICAvKipcbiAgICog5a+55LqO5Zu+54mH6LWE5rqQ77yM5aaC5p6c5LiN5o+Q5YmN5Yqg6L2977yM5riy5p+T6L+H56iL5Lit5Y+v6IO95Ye6546w5oyo5Liq5Ye6546w5Zu+54mH5pWI5p6c77yM5b2x5ZON5L2T6aqMXG4gICAqIOmAmui/h0xheW91dC5sb2FkSW1nc+WPr+S7pemihOWKoOi9veWbvueJh+i1hOa6kO+8jOWcqOiwg+eUqExheW91dC5sYXlvdXTnmoTml7blgJnmuLLmn5PmgKfog73mm7Tlpb3vvIzkvZPpqozmm7TkvbPjgIJcbiAgICovXG4gIGxvYWRJbWdzKGFycjogc3RyaW5nW10gPSBbXSkge1xuICAgIHJldHVybiBQcm9taXNlLmFsbChhcnIubWFwKHNyYyA9PiBpbWFnZU1hbmFnZXIubG9hZEltYWdlUHJvbWlzZShzcmMpKSk7XG4gIH1cblxuICAvKipcbiAgICog5rOo5YaMIGJpdG1hcHRleHQg5Y+v55So55qE5a2X5L2T44CCIFxuICAgKi9cbiAgcmVnaXN0Qml0TWFwRm9udChuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIGlmICghYml0TWFwUG9vbC5nZXQobmFtZSkpIHtcbiAgICAgIGNvbnN0IGZvbnQgPSBuZXcgQml0TWFwRm9udChuYW1lLCBzcmMsIGNvbmZpZyk7XG4gICAgICB0aGlzLmJpdE1hcEZvbnRzLnB1c2goZm9udCk7XG4gICAgICBiaXRNYXBQb29sLnNldChuYW1lLCBmb250KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDlhYvpmoboioLngrnvvIzlhYvpmoblkI7nmoToioLngrnlj6/ku6Xmt7vliqDliLAgTGF5b3V0IOeahOafkOS4quiKgueCueS4rVxuICAgKiDor6Xmlrnms5Xlj6/ku6XlnKjmlbDmja7mnInlj5jljJbnmoTml7blgJnpgb/lhY3ph43mlrDmiafooYwgTGF5b3V0LmluaXQg5rWB56iL44CCXG4gICAqL1xuICBjbG9uZU5vZGUoZWxlbWVudDogRWxlbWVudCwgZGVlcCA9IHRydWUpIHtcbiAgICByZXR1cm4gY2xvbmU8TGF5b3V0Pih0aGlzLCBlbGVtZW50LCBkZWVwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbnu4Tku7bmjILliLBMYXlvdXRcbiAgICovXG4gIEVsZW1lbnQgPSBFbGVtZW50O1xuICBWaWV3ID0gVmlldztcbiAgVGV4dCA9IFRleHQ7XG4gIEltYWdlID0gSW1hZ2U7XG4gIFNjcm9sbFZpZXcgPSBTY3JvbGxWaWV3O1xuICBCaXRNYXBUZXh0ID0gQml0TWFwVGV4dDtcbiAgQ2FudmFzID0gQ2FudmFzO1xuICBCdXR0b24gPSBCdXR0b247XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQgPSByZWdpc3RlckNvbXBvbmVudDtcblxuICBwcml2YXRlIHN0YXRpYyBpbnN0YWxsZWRQbHVnaW5zOiBJUGx1Z2luPExheW91dD5bXSA9IFtdO1xuICAvKipcbiAgICog5a6J6KOF57uZ5a6a55qE5o+S5Lu2IFxuICAgKi9cbiAgdXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGlmIChMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIOivpeaPkuS7tuW3suWuieijhS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICAvLyBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWuieijhWApXG4gIH1cblxuICAvKipcbiAgICog5Y246L2957uZ5a6a5o+S5Lu2IFxuICAgKi9cbiAgdW5Vc2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgY29uc3QgcGx1Z2luSW5kZXggPSBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmRleE9mKHBsdWdpbik7XG5cbiAgICBpZiAocGx1Z2luSW5kZXggPT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIFRoaXMgcGx1Z2luIGlzIG5vdCBpbnN0YWxsZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Lljbjovb1gKVxuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnNwbGljZShwbHVnaW5JbmRleCwgMSk7XG4gIH1cbn1cblxuY29uc3QgbGF5b3V0ID0gbmV3IExheW91dCh7XG4gIHN0eWxlOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9LFxuICBuYW1lOiAnbGF5b3V0Jyxcbn0pO1xuXG5leHBvcnQge1xuICBsYXlvdXQgYXMgZGVmYXVsdCxcbiAgTGF5b3V0LFxuICBlbnYsXG4gIEVFLFxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
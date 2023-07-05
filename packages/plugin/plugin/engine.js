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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vcGFja2FnZXMvcGx1Z2luL3BsdWdpbi9lbmdpbmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUEwQztBQUNoRDtBQUNBLElBQUksaUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLGtHQUFDO0FBQ3ZCLElBQUksS0FBSyxFQVFOO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGFBQWE7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsYUFBYTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGtCQUFrQixnQkFBZ0I7QUFDbEM7O0FBRUE7QUFDQTtBQUNBLDhCQUE4QixpQkFBaUI7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCLGdCQUFnQjtBQUNsQzs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUEyQjtBQUMvQjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7Ozs7O0FDN3JDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBOztBQUVBLFlBQVksU0FBUztBQUNyQjtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLGtDQUFrQztBQUNsQztBQUNBOztBQUVBO0FBQ0EseUNBQXlDLFNBQVM7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwwQkFBMEI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEVnQjtBQUMxQyxJQUFNLE9BQU8sR0FBRyxtQkFBTyxDQUFDLDBEQUFjLENBQUMsQ0FBQztBQXVCeEM7O0dBRUc7QUFDSDtJQVlFLDBCQUEwQjtJQUMxQixvQkFBWSxJQUFZLEVBQUUsR0FBVyxFQUFFLE1BQWM7UUFBckQsaUJBWUM7UUFuQk0sVUFBSyxHQUFHLEtBQUssQ0FBQztRQVFuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRTNCLElBQUksQ0FBQyxPQUFPLEdBQUcscURBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLFVBQUMsT0FBTyxFQUFFLFNBQVM7WUFDNUQsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7YUFDeEI7WUFDRCxLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUNsQixLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdDQUFXLEdBQVgsVUFBWSxPQUFlO1FBQ3pCLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFNLEtBQUssR0FBYSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLElBQU0sV0FBVyxHQUFlLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBSSxJQUFJLFdBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUUxRSxJQUFNLFNBQVMsR0FBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRixJQUFNLFVBQVUsR0FBVyxJQUFJLENBQUMsdUJBQXVCLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVqRixJQUFNLFVBQVUsR0FBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTlFLElBQU0sUUFBUSxHQUFtQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFcEUsY0FBYztRQUNkLElBQU0sWUFBWSxHQUFtQixJQUFJLENBQUMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZGLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztRQUN0QixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDckIsYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pFLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUN4QztRQUVELElBQU0sS0FBSyxHQUFVLEVBQUUsQ0FBQztRQUN4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFNLFFBQVEsR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFekYsSUFBTSxDQUFDLEdBQWE7Z0JBQ2xCLENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQztnQkFDOUMsQ0FBQyxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO2dCQUM5QyxDQUFDLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUM7Z0JBQ2xELENBQUMsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQztnQkFDbkQsSUFBSSxFQUFFLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDO2dCQUN2RCxJQUFJLEVBQUUsSUFBSSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUM7Z0JBQ3ZELFFBQVEsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQztnQkFDNUQsT0FBTyxFQUFFLEVBQUU7YUFDWixDQUFDO1lBQ0YsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUVELGlCQUFpQjtRQUNqQixJQUFJLGFBQWEsRUFBRTtZQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLGFBQWEsRUFBRSxDQUFDLElBQUksYUFBYSxHQUFHLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbkUsSUFBTSxJQUFJLEdBQWEsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxJQUFNLEtBQUssR0FBVyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDdkYsSUFBTSxNQUFNLEdBQVcsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pGLElBQU0sTUFBTSxHQUFXLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBRXBFLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNqQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztpQkFDdkM7YUFDRjtTQUNGO1FBRUQsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsd0NBQW1CLEdBQW5CLFVBQW9CLFdBQXVCLEVBQUUsUUFBYTtRQUFiLHdDQUFhO1FBQ3hELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxJQUFJLEdBQWEsRUFBRSxDQUFDO1FBQ3hCLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7UUFFL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QixJQUFNLElBQUksR0FBYSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUN4QixLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNWLElBQUksR0FBRyxJQUFJLENBQUM7YUFDYjtTQUNGO1FBRUQsT0FBTztZQUNMLElBQUk7WUFDSixLQUFLO1NBQ04sQ0FBQztJQUNKLENBQUM7SUFFRCw0Q0FBdUIsR0FBdkIsVUFBd0IsVUFBNkIsRUFBRSxHQUFXO1FBQ2hFLElBQU0sa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTFGLEtBQVMsS0FBQyxHQUFHLENBQUMsRUFBSSxRQUFNLEdBQUssa0JBQWtCLE9BQXZCLEVBQXlCLENBQUMsR0FBRyxRQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDaEUsSUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0MsSUFBSSxHQUFHLEtBQUssY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dCQUNuRCxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hCO1NBQ0Y7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDMUlEO0lBS0U7UUFKTyxTQUFJLEdBQXFDLEVBQUUsQ0FBQztRQUM1QyxlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBQ3ZCLGNBQVMsR0FBVyxDQUFDLENBQUM7UUFHM0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2YsQ0FBQztJQUVELHlCQUFLLEdBQUwsVUFBTSxJQUFZLEVBQUUsT0FBd0I7UUFBeEIseUNBQXdCO1FBQzFDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHO1lBQ2hCLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2pCLE9BQU87U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBSSxJQUFZO1FBQ2QsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQWMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUMvRSxJQUFJLENBQUMsU0FBUyxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDcEU7SUFDSCxDQUFDO0lBRUQseUJBQUssR0FBTDtRQUNFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHVCQUFHLEdBQUgsVUFBSSxTQUEwQjtRQUE5QixpQkFhQztRQWJHLDZDQUEwQjtRQUM1QixJQUFJLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQztRQUN0QyxPQUFPLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLElBQUk7WUFDakQsSUFBSSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDekMsT0FBTyxHQUFHLENBQUM7YUFDWjtZQUNELEdBQUcsSUFBSSxVQUFHLElBQUksZUFBSyxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksT0FBSSxDQUFDO1lBQzVDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRVAsT0FBTyxJQUFJLHFCQUFjLElBQUksQ0FBQyxTQUFTLE9BQUksQ0FBQztRQUU1QyxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdkR5QjtBQUNpQjtBQVUzQztJQUFBO1FBQ1UsWUFBTyxHQUFHLElBQUksNkNBQUksQ0FBYSxTQUFTLENBQUMsQ0FBQztJQTREcEQsQ0FBQztJQTFEQyw2QkFBTSxHQUFOLFVBQU8sR0FBVztRQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx1Q0FBZ0IsR0FBaEIsVUFBaUIsR0FBVztRQUE1QixpQkFJQztRQUhDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNqQyxLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsZ0NBQVMsR0FBVCxVQUFVLEdBQVcsRUFBRSxPQUF3QixFQUFFLElBQXFCO1FBQS9DLDJFQUF3QjtRQUFFLHFFQUFxQjtRQUNwRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksR0FBcUIsQ0FBQztRQUMxQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRS9CLHdCQUF3QjtRQUN4QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQzNCLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEI7YUFBTSxJQUFJLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDbkMsK0JBQStCO1lBQy9CLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBRWhCLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCO2FBQU07WUFDTCxvQkFBb0I7WUFDcEIsR0FBRyxHQUFHLGtEQUFXLEVBQXNCLENBQUM7WUFDeEMsSUFBTSxVQUFRLEdBQUc7Z0JBQ2YsR0FBRztnQkFDSCxRQUFRLEVBQUUsS0FBSztnQkFDZixVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ3JCLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQzthQUNwQjtZQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxVQUFRLENBQUMsQ0FBQztZQUVoQyxHQUFHLENBQUMsTUFBTSxHQUFHO2dCQUNYLFVBQVEsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixVQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxZQUFFLElBQUksU0FBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBZCxDQUFjLENBQUMsQ0FBQztnQkFDbEQsVUFBUSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7Z0JBQ3pCLFVBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQzVCLENBQUMsQ0FBQztZQUVGLEdBQUcsQ0FBQyxPQUFPLEdBQUc7Z0JBQ1osVUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsWUFBRSxJQUFJLFNBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUM7Z0JBQ25ELFVBQVEsQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO2dCQUMxQixVQUFRLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUMzQixDQUFDLENBQUM7WUFFRixHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztTQUNmO1FBRUQsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQUFDO0FBRUQsaUVBQWUsSUFBSSxZQUFZLEVBQUUsRUFBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzFFbEMsSUFBTSxLQUFLLEdBQWdCLEVBQUUsQ0FBQztBQUU5QjtJQUlFLGNBQVksSUFBYTtRQUFiLG9DQUFhO1FBSGxCLFNBQUksR0FBRyxNQUFNO1FBQ2IsU0FBSSxHQUF5QixFQUFFLENBQUM7UUFHckMsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFJLElBQUksV0FBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWxCLENBQWtCLENBQUMsQ0FBQztRQUVwRCxJQUFJLElBQUksRUFBRTtZQUNSLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVmLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsQ0FBQztJQUVELGtCQUFHLEdBQUgsVUFBSSxHQUFXO1FBQ2IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxrQkFBRyxHQUFILFVBQUksR0FBVyxFQUFFLEtBQVE7UUFDdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7SUFDekIsQ0FBQztJQUVELG9CQUFLLEdBQUw7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNqQixDQUFDO0lBRUQsc0JBQU8sR0FBUDtRQUNFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDRDtJQVFFLGNBQVksSUFBUSxFQUFFLEdBQU8sRUFBRSxLQUFTLEVBQUUsTUFBVTtRQUF4QywrQkFBUTtRQUFFLDZCQUFPO1FBQUUsaUNBQVM7UUFBRSxtQ0FBVTtRQVA3QyxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFNBQUksR0FBRyxDQUFDLENBQUM7UUFDVCxVQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ1YsUUFBRyxHQUFHLENBQUMsQ0FBQztRQUNSLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFHaEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRUQsa0JBQUcsR0FBSCxVQUFJLElBQVEsRUFBRSxHQUFPLEVBQUUsS0FBUyxFQUFFLE1BQVU7UUFBeEMsK0JBQVE7UUFBRSw2QkFBTztRQUFFLGlDQUFTO1FBQUUsbUNBQVU7UUFDMUMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QyxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQVUsR0FBVixVQUFXLElBQVU7UUFDbkIsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakgsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVCRDtJQUFBO1FBQUEsaUJBa0ZDO1FBakZTLFVBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsWUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixnQkFBVyxHQUFrQixJQUFJLENBQUM7UUFFbEMsUUFBRyxHQUFlLEVBQUUsQ0FBQztRQUNyQixZQUFPLEdBQWUsRUFBRSxDQUFDO1FBQ3pCLGFBQVEsR0FBZSxFQUFFLENBQUM7UUFFMUIsV0FBTSxHQUFHO1lBQ2YsaUNBQWlDO1lBQ2pDLEtBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBWTtnQkFDNUIsRUFBRSxFQUFFLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBWTtnQkFDakMsRUFBRSxFQUFFLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZCLEtBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQUUsSUFBSSxTQUFFLEVBQUUsRUFBSixDQUFJLENBQUMsQ0FBQztnQkFFakMsS0FBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7YUFDbkI7WUFFRCxLQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNoQixLQUFJLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDLEtBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RCxDQUFDO0lBdURILENBQUM7SUFyREMsNkJBQVksR0FBWjtRQUNFLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDN0Isb0JBQW9CLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELG9CQUFHLEdBQUgsVUFBSSxFQUFZLEVBQUUsT0FBZTtRQUFmLHlDQUFlO1FBQy9CLElBQUksT0FBTyxFQUFFLEtBQUssVUFBVSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQzNELE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxFQUFZO1FBQ2YsSUFBSSxPQUFPLEVBQUUsS0FBSyxVQUFVLEVBQUU7WUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRUQsdUJBQU0sR0FBTixVQUFPLEVBQWEsRUFBRSxPQUFlO1FBQWYseUNBQWU7UUFDbkMsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDbkI7UUFFRCxJQUFJLE9BQU8sRUFBRSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN6RCxJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQzdDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCxzQkFBSyxHQUFMO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFFcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQzFFLElBQUksQ0FBQyxXQUFXLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Y7SUFDSCxDQUFDO0lBRUQscUJBQUksR0FBSjtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztZQUVyQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBQ0gsYUFBQztBQUFELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwRkQsMEJBQTBCO0FBQ25CLFNBQVMsSUFBSSxLQUFLLENBQUM7QUFRMUI7O0dBRUc7QUFDSSxTQUFTLE9BQU8sQ0FBQyxRQUFrQjtJQUN4QyxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQ2xDLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFFOUIsSUFBSSxDQUFDLEtBQUs7V0FDTCxDQUFDLEdBQUc7V0FDSixDQUFDLEtBQUssQ0FBQyxTQUFTO1dBQ2hCLENBQUMsR0FBRyxDQUFDLFNBQVM7V0FDZCxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVM7V0FDekIsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTO1dBQ3pCLEdBQUcsQ0FBQyxLQUFLLEtBQUssU0FBUztXQUN2QixHQUFHLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFDMUI7UUFDQSxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUM5QixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBRTlCLElBQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7SUFDMUIsSUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUUxQixJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUM7SUFFbkQsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFO1dBQ3ZDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUU7V0FDbEMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUM7QUFFTSxTQUFTLFlBQVk7SUFDMUIsdUJBQXVCO0lBQ3ZCLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ2hDLE9BQU8sS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQzdCO0lBQ0QsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFFTSxTQUFTLFdBQVc7SUFDekIsdUJBQXVCO0lBQ3ZCLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ2hDLE9BQU8sS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQzVCO0lBQ0QsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLENBQUM7QUFFRCxJQUFJLElBQVksQ0FBQztBQUNqQixvRUFBb0U7QUFDcEUsSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLEVBQUU7SUFDL0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFDLEdBQVE7UUFDdkIsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLFlBQVksRUFBRTtnQkFDOUIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7YUFDeEM7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFTSxTQUFTLE1BQU07SUFDcEIsWUFBWTtJQUNaLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO1FBQy9CLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEVBQUU7UUFDM0QsSUFBSSxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0tBQ25EO1NBQU0sSUFBSSxNQUFNLENBQUMsZ0JBQWdCLEVBQUU7UUFDbEMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztLQUNoQztTQUFNO1FBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyw2REFBNkQsQ0FBQyxDQUFDO1FBQzVFLElBQUksR0FBRyxDQUFDLENBQUM7S0FDVjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELElBQVksS0FLWDtBQUxELFdBQVksS0FBSztJQUNmLDBCQUFpQjtJQUNqQiwwQkFBaUI7SUFDakIsOEJBQXFCO0lBQ3JCLHdCQUFlO0FBQ2pCLENBQUMsRUFMVyxLQUFLLEtBQUwsS0FBSyxRQUtoQjtBQUFBLENBQUM7QUFFSyxTQUFTLFdBQVcsQ0FBQyxHQUE2QjtJQUN2RCxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUVNLFNBQVMsY0FBYyxDQUFDLE9BQW9CO0lBQ2pELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLElBQUksUUFBQztRQUMzQixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7UUFDNUIsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLO1FBQ2xCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztRQUNsQixPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDdEIsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPO0tBQ3ZCLENBQUMsRUFOMEIsQ0FNMUIsQ0FBQyxDQUFDO0FBQ04sQ0FBQztBQUVNLFNBQVMsZ0JBQWdCLENBQUMsQ0FBOEI7SUFDN0QsT0FBTyxTQUFTLElBQUksQ0FBQyxDQUFDO0FBQ3hCLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVHRCxzQ0FBc0M7QUFDdEMsYUFBYTtBQUNvRjtBQWdCakcsSUFBTSxjQUFjLEdBQW1DO0lBQ3JELElBQUksRUFBRSxtREFBSTtJQUNWLElBQUksRUFBRSxtREFBSTtJQUNWLEtBQUssRUFBRSxvREFBSztJQUNaLFVBQVUsRUFBRSx5REFBVTtJQUN0QixVQUFVLEVBQUUseURBQVU7SUFDdEIsTUFBTSxFQUFFLHFEQUFNO0NBQ2YsQ0FBQztBQUVLLFNBQVMsaUJBQWlCLENBQUMsSUFBWSxFQUFFLFdBQXdCO0lBQ3RFLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLENBQUM7QUFDckMsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLElBQXFCO0lBQ3RDLE9BQU8sT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRSxDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBcUIsRUFBRSxVQUFrQjtJQUMvRCxJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO1FBQzdDLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDakQsSUFBSSxTQUFTLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQzdCLE9BQU8sVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDckQ7QUFDSCxDQUFDO0FBRU0sU0FBUyxNQUFNLENBQUMsSUFBYyxFQUFFLEtBQTZCLEVBQUUsTUFBNEI7SUFBbEcsaUJBZ0dDO0lBL0ZDLElBQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFOUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLGtEQUFrQixJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsQ0FBQztRQUM3QyxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7SUFFckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDN0IsSUFBTSxPQUFPLEdBQTJCLEVBQUUsQ0FBQztJQUMzQyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUV6QixJQUFNLElBQUksR0FBd0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUUsR0FBVztRQUN4RSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBRXRCLElBQUksR0FBRyxLQUFLLElBQUksRUFBRTtZQUNoQixHQUFHLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRTVELE9BQU8sR0FBRyxDQUFDO1NBQ1o7UUFFRCxJQUFJLEdBQUcsS0FBSyxPQUFPLEVBQUU7WUFDbkIsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEdBQUcsRUFBRSxRQUFRLElBQUssYUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQW5DLENBQW1DLEVBQUUsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQztZQUUvRyxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBRUQsSUFBSSxLQUFLLEtBQUssTUFBTSxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdkI7YUFBTSxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUU7WUFDNUIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN4QjthQUFNO1lBQ0wsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUN4QjtRQUVELElBQUksU0FBUyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNqQyxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDMUI7UUFFRCxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV0QixPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUMsRUFBRSxFQUF5QixDQUFDLENBQUM7SUFFaEMsV0FBVztJQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLGFBQWE7SUFDYixJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztJQUNuQixhQUFhO0lBQ2IsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7SUFFbEMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM3QixJQUFJLFNBQVMsRUFBRTtRQUNiLElBQUksV0FBVyxVQUFDO1FBQ2hCLElBQUksTUFBTSxFQUFFO1lBQ1YsV0FBVyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7U0FDNUI7YUFBTSxJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtZQUM5QyxXQUFXLEdBQUcsWUFBWSxDQUFDO1NBQzVCO2FBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7WUFDdkMsV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN2QzthQUFNO1lBQ0wsV0FBVyxHQUFHO2dCQUNaLEtBQUssRUFBRSxHQUFHO2dCQUNWLE1BQU0sRUFBRSxHQUFHO2FBQ1osQ0FBQztTQUNIO1FBQ0QsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLFNBQVMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDOUY7UUFDRCxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDL0IsU0FBUyxDQUFDLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsRztLQUNGO0lBRUQscUJBQXFCO0lBQ3JCLElBQU0sT0FBTyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RDLGFBQWE7SUFDYixPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNwQixPQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7SUFFNUIsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQW1CO1FBQ25DLGFBQWE7UUFDYixJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9ELElBQUksWUFBWSxFQUFFO1lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDM0I7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFTSxTQUFTLGNBQWMsQ0FBQyxRQUFtQixFQUFFLE9BQWlDLEVBQUUsVUFBaUI7SUFBakIsOENBQWlCO0lBQ3RHLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO1FBQ3JCLDhCQUE4QjtRQUM5QixLQUFLLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUN0QixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVsQyxpREFBaUQ7UUFDakQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEcsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQ7O0dBRUc7QUFDSSxTQUFTLGNBQWMsQ0FBQyxPQUFnQjtJQUM3QyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWM7UUFDdEMsS0FBSyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQztRQUV4QyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQVk7O1lBQ3RELGFBQWE7WUFDYixLQUFLLENBQUMsU0FBUyxDQUFDLElBQXdCLENBQUMsR0FBRyxXQUFLLENBQUMsTUFBTSwwQ0FBRyxJQUFxQixDQUFXLENBQUM7UUFDOUYsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDM0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7U0FDM0Y7YUFBTTtZQUNMLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2pELEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO1NBQ2pEO1FBRUQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztRQUM5RCxLQUFLLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBRzlELGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxTQUFTLElBQUksS0FBSyxDQUFDO0FBQ1osU0FBUyxXQUFXLENBQUMsT0FBZ0IsRUFBRSxRQUF5QjtJQUF6QiwwQ0FBeUI7SUFDckUsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxCLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztRQUN0QyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVNLElBQU0sZUFBZSxHQUFHLFVBQUMsUUFBbUI7SUFDakQsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQWM7UUFDOUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWhCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxZQUFZLEVBQUU7WUFDL0IsZUFBZSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNqQztJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUssSUFBTSxXQUFXLEdBQUcsVUFBQyxJQUFhO0lBQ3ZDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUVmLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztRQUNuQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFaEIsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBWUssU0FBUyxLQUFLLENBQW9CLElBQU8sRUFBRSxPQUFnQixFQUFFLElBQVcsRUFBRSxNQUFnQjtJQUE3QixrQ0FBVztJQUM3RSxJQUFNLFdBQVcsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLE9BQWlCLENBQUMsQ0FBQztJQUM5RCxhQUFhO0lBQ2IsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFFbkIsSUFBTSxJQUFJLEdBQWdCO1FBQ3hCLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ3ZDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtRQUN0QixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7UUFDNUIsYUFBYTtRQUNiLEVBQUUsRUFBRSxJQUFJLENBQUMsUUFBUTtRQUNqQixPQUFPLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQztLQUM1QyxDQUFDO0lBRUYsSUFBSSxPQUFPLFlBQVksb0RBQUssRUFBRTtRQUM1QixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7S0FDeEI7U0FBTSxJQUFJLE9BQU8sWUFBWSxtREFBSSxJQUFJLE9BQU8sWUFBWSx5REFBVSxFQUFFO1FBQ25FLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztLQUM1QjtJQUVELElBQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ3hCLGFBQWE7SUFDYixXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDOUMsV0FBVyxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFFbkMsSUFBSSxNQUFNLEVBQUU7UUFDVixNQUFNLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3pCO0lBRUQsSUFBSSxJQUFJLEVBQUU7UUFDUixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDN0IsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuUWdDO0FBQ0M7QUFNbEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxvREFBSSxDQUFhLFlBQVksQ0FBQyxDQUFDO0FBT3REO0lBQXdDLDhCQUFPO0lBTTdDLG9CQUFZLElBQXdCO1FBQXBDLGlCQXVCQztRQXJCRyxTQU1FLElBQUksTUFOSSxFQUFWLEtBQUssbUJBQUcsRUFBRSxPQUNWLEtBS0UsSUFBSSxPQUxLLEVBQVgsTUFBTSxtQkFBRyxFQUFFLE9BQ1gsS0FJRSxJQUFJLFVBSlEsRUFBZCxTQUFTLG1CQUFHLEVBQUUsT0FDZCxLQUdFLElBQUksTUFISSxFQUFWLEtBQUssbUJBQUcsRUFBRSxPQUNWLEtBRUUsSUFBSSxLQUZHLEVBQVQsSUFBSSxtQkFBRyxFQUFFLE9BQ1QsT0FBTyxHQUNMLElBQUksUUFEQyxDQUNBO2dCQUNULGtCQUFNO1lBQ0osTUFBTTtZQUNOLFNBQVM7WUFDVCxLQUFLO1lBQ0wsT0FBTztTQUNSLENBQUM7UUFsQkcsVUFBSSxHQUFHLFlBQVksQ0FBQztRQW9CekIsS0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDaEIsS0FBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFdEIsS0FBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBdUIsSUFBSSwyRUFBbUUsQ0FBQyxDQUFDO1NBQy9HOztJQUNILENBQUM7SUFFRCxzQkFBSSw2QkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFFRCxVQUFVLFFBQWdCO1lBQ3hCLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO2dCQUV6QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQzs7O09BUkE7SUFVRCw0QkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFBQSxpQkFjQztRQWJDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsT0FBTztTQUNSO1FBRUQsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUErQixDQUFDLENBQUM7U0FDdkQ7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxrQkFBa0IsRUFBRTtnQkFDckMsSUFBSSxDQUFDLEtBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3JCLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSSxDQUFDLEdBQStCLENBQUMsQ0FBQztpQkFDdkQ7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELGtDQUFhLEdBQWI7UUFDVSxTQUFLLEdBQUssSUFBSSxNQUFULENBQVU7UUFFZixTQUFzQixLQUFLLGNBQVYsRUFBakIsYUFBYSxtQkFBRyxDQUFDLE1BQVc7UUFDcEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBRWQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxLQUFLLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFFZixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxFQUFFO29CQUNmLEtBQUssSUFBSSxhQUFhLENBQUM7aUJBQ3hCO2FBQ0Y7U0FDRjtRQUVELE9BQU8sRUFBRSxLQUFLLFNBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELCtCQUFVLEdBQVYsVUFBVyxHQUE2QjtRQUN0QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDcEMsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQW9CLENBQUM7UUFFekQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRUwsU0FBMkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBL0MsUUFBUSxnQkFBRSxVQUFVLGdCQUEyQixDQUFDO1FBRXhELElBQUksUUFBUSxFQUFFO1lBQ1osR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ1o7UUFFRCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ25CLFNBQUssR0FBSyxJQUFJLE1BQVQsQ0FBVTtRQUdyQixTQU1FLEtBQUssTUFORSxFQUFULEtBQUssbUJBQUcsQ0FBQyxPQUFFLGdCQUFnQjtRQUMzQixLQUtFLEtBQUssT0FMRyxFQURDLGdCQUFnQjtRQUMzQixNQUFNLG1CQUFHLENBQUMsT0FBRSxpQkFBaUI7UUFDN0Isb0RBQW9EO1FBQ3BELFNBQVMsR0FHUCxLQUFLLFVBSEUsRUFBRSxXQUFXO1FBQ3RCLGFBQWEsR0FFWCxLQUFLLGNBRk0sRUFDYixLQUNFLEtBQUssY0FEVSxFQUFqQixhQUFhLG1CQUFHLENBQUMsTUFDVDtRQUNWLGlCQUFpQjtRQUNqQixJQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksaUJBQWlCLENBQVc7UUFFcEUsY0FBYztRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV0QixJQUFNLE1BQU0sR0FBRyxVQUFVLEdBQUcsaUJBQWlCLENBQUM7UUFDOUMsSUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFFeEMsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDM0M7UUFFRCxJQUFJLEtBQUssQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNqRCxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRTtRQUVELDJCQUEyQjtRQUMzQixJQUFJLFVBQVUsR0FBRyxNQUFNLEVBQUU7WUFDdkIsSUFBSSxhQUFhLEtBQUssUUFBUSxFQUFFO2dCQUM5QixDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2hDO2lCQUFNLElBQUksYUFBYSxLQUFLLFFBQVEsRUFBRTtnQkFDckMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsVUFBVSxDQUFDO2FBQzdCO1NBQ0Y7UUFFRCxJQUFJLEtBQUssR0FBRyxTQUFTLEVBQUU7WUFDckIsSUFBSSxTQUFTLEtBQUssUUFBUSxFQUFFO2dCQUMxQixDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNLElBQUksU0FBUyxLQUFLLE9BQU8sRUFBRTtnQkFDaEMsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7UUFFRCx1QkFBdUI7UUFDdkIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBR3hCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUMxQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxDLElBQUksWUFBWSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUU7Z0JBQzdDLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ2hDO1lBRUQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsR0FBRyxDQUFDLFNBQVMsQ0FDWCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQTJCLEVBQ3JDLEdBQUcsQ0FBQyxDQUFDLEVBQ0wsR0FBRyxDQUFDLENBQUMsRUFDTCxHQUFHLENBQUMsQ0FBQyxFQUNMLEdBQUcsQ0FBQyxDQUFDLEVBQ0wsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxFQUNyQixDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEVBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxFQUNkLEdBQUcsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUNmLENBQUM7Z0JBRUYsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUM7Z0JBRTdDLFlBQVksR0FBRyxJQUFJLENBQUM7YUFDckI7U0FDRjtRQUVELElBQUksVUFBVSxFQUFFO1lBQ2QsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFFRCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxDQXhMdUMsaURBQU8sR0F3TDlDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdE1nQztBQUNhO0FBUzlDO0lBQW9DLDBCQUFPO0lBR3pDLGdCQUFZLElBQW9CO1FBQWhDLGlCQTBCQztRQXhCRyxTQU9FLElBQUksTUFQSSxFQUFWLEtBQUssbUJBQUcsRUFBRSxPQUNWLEtBTUUsSUFBSSxPQU5LLEVBQVgsTUFBTSxtQkFBRyxFQUFFLE9BQ1gsS0FLRSxJQUFJLFVBTFEsRUFBZCxTQUFTLG1CQUFHLEVBQUUsT0FDZCxPQUFPLEdBSUwsSUFBSSxRQUpDLEVBQ1AsS0FHRSxJQUFJLE1BSEssRUFBWCxLQUFLLG1CQUFHLEdBQUcsT0FDWCxLQUVFLElBQUksT0FGTSxFQUFaLE1BQU0sbUJBQUcsR0FBRyxPQUNaLEtBQ0UsSUFBSSxpQkFEa0IsRUFBeEIsZ0JBQWdCLG1CQUFHLEtBQUssTUFDakI7Z0JBRVQsa0JBQU07WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULE9BQU87WUFDUCxLQUFLO1NBQ04sQ0FBQztRQWxCSSxvQkFBYyxHQUE2QixJQUFJO1FBb0JyRDs7V0FFRztRQUNILElBQUksZ0JBQWdCLEVBQUU7WUFDcEIsS0FBSSxDQUFDLGNBQWMsR0FBRywwREFBWSxFQUF1QixDQUFDO1lBQzFELEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxLQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0M7O0lBQ0gsQ0FBQztJQUVELHNCQUFJLDBCQUFNO2FBQVY7WUFDRSxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUM7UUFDN0IsQ0FBQzthQUVELFVBQVcsR0FBNkI7WUFDdEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7UUFDNUIsQ0FBQzs7O09BSkE7SUFNRCx1QkFBTSxHQUFOO1FBQ0UsSUFBSSxDQUFDLElBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQUVELHdCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVM7SUFDVCw0QkFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELHVCQUFNLEdBQU47UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixPQUFPO1NBQ1I7UUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzNCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUErQixDQUFDO1FBRWpELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVYLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNyQixHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7U0FDckM7UUFFRCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1FBRXZDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDNUIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV0QixTQUEyQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUEvQyxRQUFRLGdCQUFFLFVBQVUsZ0JBQTJCLENBQUM7UUFFeEQsSUFBSSxRQUFRLEVBQUU7WUFDWixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUVELElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN6QixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUU7UUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV4RSxJQUFJLFVBQVUsRUFBRTtZQUNkLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNkO1FBRUQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxDQWpHbUMsaURBQU8sR0FpRzFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDM0dELHNDQUFzQztBQUNtRDtBQUN2RDtBQUNnQjtBQUNYO0FBS2hDLFNBQVMsZUFBZSxDQUFDLElBQWEsRUFBRSxJQUFvQixFQUFFLEVBQVU7SUFBaEMsZ0NBQW9CO0lBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztRQUNuQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7UUFFRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ3pCLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFTSxTQUFTLGNBQWMsQ0FBQyxJQUFhLEVBQUUsRUFBVTtJQUN0RCxJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUUzQyxPQUFPLEtBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRyxDQUFDLENBQUMsS0FBSSxJQUFJLENBQUM7QUFDM0IsQ0FBQztBQUVNLFNBQVMsc0JBQXNCLENBQUMsSUFBYSxFQUFFLElBQW9CLEVBQUUsU0FBaUI7SUFBdkMsZ0NBQW9CO0lBQ3hFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztRQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUNqRixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUN6QixzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ2hEO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7R0FFRztBQUNILFNBQVMsUUFBUSxDQUFDLEdBQVk7SUFDNUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDYixVQUFNLEdBQUssR0FBRyxPQUFSLENBQVM7SUFDckIsT0FBTyxNQUFNLEVBQUU7UUFDYixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUN0QixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUN4QjtBQUNILENBQUM7QUFFRCxTQUFTO0FBQ1QsSUFBTSxFQUFFLEdBQUcsSUFBSSxxREFBVyxFQUFFLENBQUM7QUFFN0IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBRWIsU0FBUyxRQUFRLENBQUMsR0FBVztJQUMzQixJQUFNLE1BQU0sR0FBRywyQ0FBMkMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckUsT0FBTyxNQUFNO1FBQ1gsQ0FBQyxDQUFDO1lBQ0EsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQixDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7U0FDM0I7UUFDRCxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ1gsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFlO0lBQzNDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUU3QixJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDekIsT0FBTyxHQUFHLENBQUMsQ0FBQztLQUNiO0lBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxPQUFPLGVBQVEsTUFBTSxDQUFDLENBQUMsZUFBSyxNQUFNLENBQUMsQ0FBQyxlQUFLLE1BQU0sQ0FBQyxDQUFDLGVBQUssT0FBTyxNQUFHLENBQUM7QUFDbkUsQ0FBQztBQUVELElBQU0sV0FBVyxHQUFHLFVBQUMsS0FBYSxFQUFFLEVBQVU7SUFDNUMsSUFBTSxZQUFZLEdBQUc7UUFDbkIsT0FBTztRQUNQLFlBQVk7UUFDWixXQUFXO1FBQ1gsVUFBVTtRQUNWLGFBQWE7S0FDZCxDQUFDO0lBRUYsSUFBSSxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3RDLE9BQU8sa0JBQVcsRUFBRSxjQUFJLEtBQUssQ0FBRSxDQUFDO0tBQ2pDO0lBRUQsT0FBTyxrQkFBVyxFQUFFLGNBQUksS0FBSyxDQUFFLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBb0JELENBQUM7QUFFRixJQUFNLGlCQUFpQixHQUFHLG9CQUFvQixDQUFDO0FBRS9DO0lBb0ZFLGlCQUFZLEVBTU07WUFMaEIsYUFBVSxFQUFWLEtBQUssbUJBQUcsRUFBRSxPQUNWLGNBQVcsRUFBWCxNQUFNLG1CQUFHLEVBQUUsT0FDWCxpQkFBYyxFQUFkLFNBQVMsbUJBQUcsRUFBRSxPQUNkLFVBQWMsRUFBZCxFQUFFLG1CQUFHLElBQUksSUFBSSxDQUFDLE9BQ2QsZUFBWSxFQUFaLE9BQU8sbUJBQUcsRUFBRTtRQXhGZDs7V0FFRztRQUNJLGFBQVEsR0FBYyxFQUFFLENBQUM7UUFDaEM7O1dBRUc7UUFDSSxXQUFNLEdBQW1CLElBQUksQ0FBQztRQW1CckM7O1dBRUc7UUFDSSxTQUFJLEdBQW1CLElBQUksQ0FBQztRQUNuQyxrQkFBa0I7UUFFbEI7O1dBRUc7UUFDSSxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQXVCcEIsUUFBRyxHQUFvQyxJQUFJO1FBRWxEOztXQUVHO1FBQ0ksWUFBTyxHQUFHLEtBQUssQ0FBQztRQUV2Qjs7V0FFRztRQUNPLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBc0I3QixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDZixJQUFJLEVBQUUsQ0FBQztZQUNQLEdBQUcsRUFBRSxDQUFDO1lBQ04sS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztZQUNULFNBQVMsRUFBRSxDQUFDO1lBQ1osU0FBUyxFQUFFLENBQUM7WUFDWixpQkFBaUIsRUFBRSxDQUFDO1lBQ3BCLGlCQUFpQixFQUFFLENBQUM7U0FDckIsQ0FBQztRQUVGLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQ0UsS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTO2VBQ3hCLEtBQUssQ0FBQyxLQUFLO2VBQ1gsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQ2hDO1lBQ0EsaUJBQWlCO1lBQ2pCLEtBQUssQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7U0FDbEU7UUFFRCxJQUNFLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUztlQUN4QixLQUFLLENBQUMsZUFBZTtlQUNyQixLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFDMUM7WUFDQSxpQkFBaUI7WUFDakIsS0FBSyxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQztTQUNoRztRQUVELElBQUksT0FBTyxLQUFLLENBQUMsZUFBZSxLQUFLLFFBQVEsRUFBRTtZQUM3QyxJQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ3ZEO1FBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVELDJDQUF5QixHQUF6QixVQUEwQixlQUF1QjtRQUFqRCxpQkFnQkM7UUFmQyxJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRTtZQUN2QyxJQUFNLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7WUFDdEQsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzFDLDREQUFZLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFDLEdBQXFCO29CQUNoRCxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRTt3QkFDckIsS0FBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUM7d0JBQzNCLHFCQUFxQjt3QkFDckIsS0FBSSxDQUFDLElBQUksSUFBSSxLQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztxQkFDeEM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFhLGVBQWUsb0NBQWlDLENBQUMsQ0FBQzthQUM5RTtTQUNGO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxzQ0FBb0IsR0FBcEI7UUFBQSxpQkFvREM7UUFuREMsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7WUFDL0IsSUFBTSxLQUFHLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDdkMsR0FBRyxZQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUTtvQkFDeEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQzdDLENBQUM7Z0JBQ0QsR0FBRyxZQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLFFBQVE7O29CQUM3QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTt3QkFDNUIsSUFBSSx3REFBb0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7NEJBQzNDLFFBQVEsQ0FBQyxLQUFHLENBQUMsQ0FBQzt5QkFDZjs2QkFBTSxJQUFJLHlEQUFxQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTs0QkFDbkQsV0FBRyxDQUFDLElBQUksMENBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO3lCQUMzQjs2QkFBTSxJQUFJLElBQUksS0FBSyxpQkFBaUIsRUFBRTs0QkFDckMsS0FBRyxDQUFDLHlCQUF5QixDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUNwQztxQkFDRjtvQkFFRCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBTSxZQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBVyxDQUFDO1lBQzNELDZDQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztnQkFDcEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtvQkFDckMsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixHQUFHLEVBQUUsY0FBTSxtQkFBVSxDQUFDLEdBQW1CLENBQUMsRUFBL0IsQ0FBK0I7b0JBQzFDLEdBQUcsRUFBRSxVQUFDLEtBQUs7O3dCQUNULElBQUksS0FBSyxLQUFLLFlBQVUsQ0FBQyxHQUFtQixDQUFDLEVBQUU7NEJBQzdDLFlBQVUsQ0FBQyxHQUFtQixDQUFDLEdBQUcsS0FBSyxDQUFDOzRCQUN4QyxJQUFJLHdEQUFvQixDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQ0FDNUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxDQUFDOzZCQUNkO2lDQUFNLElBQUkseURBQXFCLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dDQUNsRCxXQUFJLENBQUMsSUFBSSwwQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7NkJBQzVCO2lDQUFNLElBQUksR0FBRyxLQUFLLGlCQUFpQixFQUFFO2dDQUNwQyxLQUFJLENBQUMseUJBQXlCLENBQUMsS0FBSyxDQUFDLENBQUM7NkJBQ3ZDO3lCQUNGO29CQUNILENBQUM7aUJBQ0YsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELFNBQVM7UUFDVCxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTO1lBQ2hGLEtBQUksQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQUMsQ0FBQyxFQUFFLFFBQVE7Z0JBQzdCLEtBQUksQ0FBQyxNQUFNLElBQUksS0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMxRCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCx5QkFBTyxHQUFQLGNBQVksQ0FBQztJQUViOztPQUVHO0lBQ0gsd0JBQU0sR0FBTixjQUFXLENBQUM7SUFFWjs7T0FFRztJQUNILHVDQUFxQixHQUFyQjtRQUNFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2QsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLG9EQUFJLENBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUN0QixDQUFDO1NBQ0g7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FDWCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsRUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQ3hCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FDdEIsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsZ0NBQWMsR0FBZCxVQUFlLEVBQVU7UUFDdkIsT0FBTyxjQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxpQ0FBZSxHQUFmLFVBQWdCLEVBQVU7UUFDeEIsT0FBTyxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx3Q0FBc0IsR0FBdEIsVUFBdUIsU0FBaUI7UUFDdEMsT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsd0JBQU0sR0FBTixVQUFPLEdBQTZCLEVBQUUsVUFBbUI7UUFDdkQsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFFZixJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQVcsR0FBWDtRQUFBLGlCQVdDO1FBVkM7WUFDRSxZQUFZO1lBQ1osV0FBVztZQUNYLGFBQWE7WUFDYixVQUFVO1lBQ1YsT0FBTztZQUNQLFNBQVM7U0FDVixDQUFDLE9BQU8sQ0FBQyxVQUFDLFNBQVM7WUFDbEIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILHdCQUFNLEdBQU47UUFDVSxVQUFNLEdBQUssSUFBSSxPQUFULENBQVU7UUFFeEIsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE9BQU87U0FDUjtRQUVELElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTVDLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7U0FDakI7YUFBTTtZQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsd0NBQXdDLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFRCxTQUFTO0lBQ1QsNkJBQVcsR0FBWDtJQUVBLENBQUM7SUFFRCxTQUFTO0lBQ1QseUJBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVuQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUN4QixrQkFBa0I7UUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFaEIsdUJBQXVCO1FBQ3ZCLHlCQUF5QjtRQUN6QixxQkFBcUI7UUFDckIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDcEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7SUFDNUIsQ0FBQztJQUVELHFCQUFHLEdBQUgsVUFBSSxPQUFnQjtRQUNsQixPQUFPLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN0Qiw4QkFBOEI7UUFFOUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQVcsR0FBWCxVQUFZLE9BQWdCO1FBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7T0FFRztJQUNILDZCQUFXLEdBQVgsVUFBWSxPQUFnQjtRQUMxQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoQixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hCO2FBQU07WUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxDQUFDLENBQUM7U0FDbkY7SUFDSCxDQUFDO0lBRUQsc0JBQUksR0FBSixVQUFLLEtBQWE7UUFBRSxpQkFBaUI7YUFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1lBQWpCLGdDQUFpQjs7UUFDbkMsRUFBRSxDQUFDLElBQUksT0FBUCxFQUFFLGlCQUFNLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFLLE9BQU8sVUFBRTtJQUNuRCxDQUFDO0lBRUQsb0JBQUUsR0FBRixVQUFHLEtBQWEsRUFBRSxRQUFrQjtRQUNsQyxFQUFFLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxzQkFBSSxHQUFKLFVBQUssS0FBYSxFQUFFLFFBQWtCO1FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELHFCQUFHLEdBQUgsVUFBSSxLQUFhLEVBQUUsUUFBbUI7UUFDcEMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCw4QkFBWSxHQUFaLFVBQWEsR0FBNkI7UUFDeEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDL0IsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUM7UUFDL0IsU0FBb0IsS0FBSyxZQUFWLEVBQWYsV0FBVyxtQkFBRyxDQUFDLE1BQVc7UUFDbEMsSUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsbUJBQW1CLElBQUksTUFBTSxDQUFDO1FBQ2hFLElBQU0sb0JBQW9CLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixJQUFJLE1BQU0sQ0FBQztRQUNsRSxJQUFNLHNCQUFzQixHQUFHLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxNQUFNLENBQUM7UUFDdEUsSUFBTSx1QkFBdUIsR0FBRyxLQUFLLENBQUMsdUJBQXVCLElBQUksTUFBTSxDQUFDO1FBQ3hFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDbkIsU0FBcUIsS0FBSyxZQUFWLEVBQWhCLFdBQVcsbUJBQUcsRUFBRSxNQUFXO1FBQ25DLElBQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDeEIsSUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUNoQixTQUFLLEdBQWEsR0FBRyxNQUFoQixFQUFFLE1BQU0sR0FBSyxHQUFHLE9BQVIsQ0FBUztRQUU5QixJQUFNLFNBQVMsR0FBRyxNQUFNO2VBQ25CLG1CQUFtQixJQUFJLG9CQUFvQixJQUFJLHNCQUFzQixJQUFJLHVCQUF1QixDQUFDO1FBRXRHLDBDQUEwQztRQUMxQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzlCLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUMvQztRQUVELFFBQVE7UUFDUixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFaEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7UUFDNUIsR0FBRyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFFOUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWhELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxHQUFHLG9CQUFvQixFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFFbkYsUUFBUTtRQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLHVCQUF1QixDQUFDLENBQUM7UUFFNUQsU0FBUztRQUNULEdBQUcsQ0FBQyxLQUFLLENBQ1AsQ0FBQyxHQUFHLEtBQUssRUFDVCxDQUFDLEdBQUcsTUFBTSxFQUNWLENBQUMsR0FBRyxLQUFLLEdBQUcsdUJBQXVCLEVBQ25DLENBQUMsR0FBRyxNQUFNLEVBQ1YsdUJBQXVCLENBQ3hCLENBQUM7UUFFRixRQUFRO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsc0JBQXNCLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1FBRW5ELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDLENBQUM7UUFFekYsUUFBUTtRQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDO1FBRXZDLFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLG1CQUFtQixFQUFFLENBQUMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBRWpFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQzlELENBQUM7SUFDSCxjQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2hrQmdDO0FBQ2lCO0FBT2xEO0lBQW1DLHlCQUFPO0lBS3hDLGVBQVksSUFBbUI7UUFBL0IsaUJBaURDO1FBL0NHLFNBS0UsSUFBSSxNQUxJLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsS0FJRSxJQUFJLE9BSkssRUFBWCxNQUFNLG1CQUFHLEVBQUUsT0FDWCxLQUdFLElBQUksVUFIUSxFQUFkLFNBQVMsbUJBQUcsRUFBRSxPQUNkLEtBRUUsSUFBSSxJQUZFLEVBQVIsR0FBRyxtQkFBRyxFQUFFLE9BQ1IsT0FBTyxHQUNMLElBQUksUUFEQyxDQUNBO2dCQUVULGtCQUFNO1lBQ0osTUFBTTtZQUNOLFNBQVM7WUFDVCxPQUFPO1lBQ1AsS0FBSztTQUNOLENBQUM7UUFqQkcsVUFBSSxHQUFHLE9BQU8sQ0FBQztRQW1CcEIsS0FBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFFbEIsdUNBQXVDO1FBQ3ZDLFlBQVk7UUFDWiwwQkFBMEI7UUFDMUIsT0FBTztRQUNQLG9CQUFvQjtRQUNwQixzQ0FBc0M7UUFDdEMsZ0NBQWdDO1FBQ2hDLHNFQUFzRTtRQUN0RSxtQ0FBbUM7UUFDbkMsNEJBQTRCO1FBQzVCLGtDQUFrQztRQUNsQyx1Q0FBdUM7UUFDdkMsWUFBWTtRQUNaLFlBQVk7UUFDWixRQUFRO1FBQ1IsT0FBTztRQUNQLHNCQUFzQjtRQUN0Qix3QkFBd0I7UUFDeEIsTUFBTTtRQUVOLEtBQUksQ0FBQyxHQUFHLEdBQUcsNERBQVksQ0FBQyxTQUFTLENBQUMsS0FBSSxDQUFDLEdBQUcsRUFBRSxVQUFDLEdBQUcsRUFBRSxTQUFTOztZQUN6RCxJQUFJLFNBQVMsRUFBRTtnQkFDYixLQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzthQUNoQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRTtvQkFDckIsS0FBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7b0JBQ2YscUJBQXFCO29CQUNyQixXQUFJLENBQUMsSUFBSSwwQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7aUJBQzVCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQzs7SUFDTCxDQUFDO0lBRUQsc0JBQUksc0JBQUc7YUFBUDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUNyQixDQUFDO2FBRUQsVUFBUSxRQUFnQjtZQUF4QixpQkFXQztZQVZDLElBQUksUUFBUSxLQUFLLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO2dCQUN2Qiw0REFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFVBQUMsR0FBcUI7O29CQUNyRCxJQUFJLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRTt3QkFDckIsS0FBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7d0JBQ2YscUJBQXFCO3dCQUNyQixXQUFJLENBQUMsSUFBSSwwQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQzVCO2dCQUNILENBQUMsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDOzs7T0FiQTtJQWVELHVCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELFNBQVM7SUFDVCwyQkFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQsc0JBQU0sR0FBTjs7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQUksQ0FBQyxHQUFHLDBDQUFFLFFBQVEsR0FBRTtZQUNwQyxPQUFPO1NBQ1I7UUFFRCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUMvQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzNCLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUErQixDQUFDO1FBRWpELEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUVYLElBQUksS0FBSyxDQUFDLFdBQVcsRUFBRTtZQUNyQixHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7U0FDckM7UUFFRCxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDO1FBRXZDLElBQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7UUFDNUIsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV0QixTQUEyQixJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUEvQyxRQUFRLGdCQUFFLFVBQVUsZ0JBQTJCLENBQUM7UUFFeEQsSUFBSSxRQUFRLEVBQUU7WUFDWixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDWjtRQUVELElBQUksS0FBSyxDQUFDLGVBQWUsRUFBRTtZQUN6QixHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7WUFDdEMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUU7UUFFRCxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3RCxJQUFJLFVBQVUsRUFBRTtZQUNkLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNkO1FBRUQsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxZQUFDO0FBQUQsQ0FBQyxDQWpJa0MsaURBQU8sR0FpSXpDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4SXlCO0FBQ0U7QUFDRjtBQUNZO0FBQ0E7QUFDUjtBQUNHO0FBVS9COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pCRix5Q0FBeUM7QUFDekMsc0NBQXNDO0FBQ1o7QUFDOEI7QUFDUjtBQUNMO0FBSTNDLElBQU0sR0FBRyxHQUFHLG9EQUFNLEVBQUUsQ0FBQztBQVVwQixDQUFDO0FBRUY7SUFBd0MsOEJBQUk7SUFhMUMsb0JBQVksRUFPUztZQU5uQixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsY0FBVyxFQUFYLE1BQU0sbUJBQUcsRUFBRSxPQUNYLGlCQUFjLEVBQWQsU0FBUyxtQkFBRyxFQUFFLE9BQ2QsT0FBTyxlQUNQLE9BQU8sZUFDUCxPQUFPO1FBTlQsWUFRRSxrQkFBTTtZQUNKLEtBQUs7WUFDTCxNQUFNO1lBQ04sT0FBTztZQUNQLFNBQVM7U0FDVixDQUFDLFNBUUg7UUFqQ00sZUFBUyxHQUFHLENBQUMsQ0FBQztRQUNkLGdCQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ2Ysa0JBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsa0JBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsVUFBSSxHQUFHLFlBQVksQ0FBQztRQXVCekIsS0FBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFFM0IsS0FBSSxDQUFDLG1CQUFtQixHQUFHO1lBQ3pCLFVBQVUsRUFBRSxDQUFDLENBQUMsT0FBTztZQUNyQixVQUFVLEVBQUUsQ0FBQyxDQUFDLE9BQU87U0FDdEIsQ0FBQzs7SUFDSixDQUFDO0lBTUQsc0JBQUksb0NBQVk7UUFKaEI7OztXQUdHO2FBQ0g7WUFDRSxrQkFBa0I7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFO2dCQUN6QixPQUFPLENBQUMsQ0FBQzthQUNWO1lBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVyRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO1FBQ3BELENBQUM7OztPQUFBO0lBRUQsc0JBQUksbUNBQVc7YUFBZjtZQUNFLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3pCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFFRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBRXJELE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDcEQsQ0FBQzs7O09BQUE7SUFFRCxzQkFBSSwrQkFBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDO1FBQzdDLENBQUM7YUFFRCxVQUFZLEtBQUs7WUFDZixJQUFJLENBQUMsY0FBYyxHQUFHO2dCQUNwQixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDO1FBQ0osQ0FBQzs7O09BTkE7SUFRRCxzQkFBSSwrQkFBTzthQUFYO1lBQ0UsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDO1FBQzdDLENBQUM7YUFFRCxVQUFZLEtBQUs7WUFDZixJQUFJLENBQUMsY0FBYyxHQUFHO2dCQUNwQixVQUFVLEVBQUUsS0FBSzthQUNsQixDQUFDO1FBQ0osQ0FBQzs7O09BTkE7SUFRRCxzQkFBSSxzQ0FBYzthQUFsQjtZQUNFLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ2xDLENBQUM7YUFFRCxVQUFtQixLQUEyQjtZQUM1QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUUvQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQzlEO1FBQ0gsQ0FBQzs7O09BUkE7SUFVRCw0QkFBTyxHQUFQO1FBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxnQ0FBVyxHQUFYO1FBQ0UscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1FBRXhCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFRCxzQ0FBaUIsR0FBakIsVUFBa0IsSUFBYTtRQUEvQixpQkFNQztRQUxDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVkLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBYztZQUNuQyxLQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsMEJBQUssR0FBTDtRQUNFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLEdBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFFRCxpQ0FBWSxHQUFaO1FBQUEsaUJBaUNDO1FBaENDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFbkIsSUFBVyxNQUFNLEdBQXVDLEdBQUcsVUFBMUMsRUFBYSxNQUFNLEdBQW9CLEdBQUcsVUFBdkIsRUFBRSxLQUFLLEdBQWEsR0FBRyxNQUFoQixFQUFFLE1BQU0sR0FBSyxHQUFHLE9BQVIsQ0FBUztRQUNwRSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBK0IsQ0FBQztRQUVqRCxjQUFjO1FBQ2QsSUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUM1QixJQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRTdCLHVCQUF1QjtRQUN2QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFZDs7O1dBR0c7UUFDSCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFWCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDcEIsU0FBMEMsS0FBSyxDQUFDLFNBQVMsRUFBdkQsS0FBSyxhQUFFLE1BQU0sY0FBRSxTQUFTLGlCQUFFLFNBQVMsZUFBb0IsQ0FBQztZQUVoRSx5QkFBeUI7WUFDekIsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLE1BQU0sSUFBSSxTQUFTLElBQUksSUFBSTttQkFDaEQsU0FBUyxHQUFHLEtBQUssSUFBSSxNQUFNLElBQUksU0FBUyxJQUFJLElBQUksRUFBRTtnQkFDckQsS0FBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9CO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELGtDQUFhLEdBQWIsVUFBYyxJQUFZLEVBQUUsR0FBVztRQUF2QyxpQkF1QkM7UUF0QkMsbUJBQW1CO1FBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUM1Qyx1REFBVyxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUc7Z0JBQ3BCLElBQUksR0FBRyxLQUFLLEtBQUksRUFBRTtvQkFDaEIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxHQUFHLENBQUM7b0JBQ2hFLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO2lCQUNsRTtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsNkNBQTZDO1lBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBRXZCLElBQUksQ0FBQyxJQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTNCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3hDO1NBQ0Y7UUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRUQsMkJBQU0sR0FBTixVQUFPLE9BQWlDO1FBQXhDLGlCQXFGQztRQXBGQyxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztRQUVuQjs7OztXQUlHO1FBQ0gsSUFBSSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLFdBQVcsS0FBSyxXQUFXLEVBQUU7WUFDeEYsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7UUFFRCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsOENBQThDO1lBQzlDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLFdBQVksQ0FBQyxhQUFhO21CQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsV0FBWSxDQUFDLGNBQWM7bUJBQzFELElBQUksQ0FBQyxXQUFXLEtBQUssSUFBSSxDQUFDLFdBQVksQ0FBQyxjQUFjO21CQUNyRCxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxXQUFZLENBQUMsZUFBZSxFQUFFO2dCQUM1RCxJQUFJLENBQUMsV0FBWSxDQUFDLGFBQWEsQ0FDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUNyQixJQUFJLENBQUMsV0FBVyxFQUNoQixJQUFJLENBQUMsWUFBWSxDQUNsQixDQUFDO2FBQ0g7WUFFRCx1REFBdUQ7WUFDdkQsdURBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHO2dCQUNwQixJQUFJLEdBQUcsS0FBSyxLQUFJLEVBQUU7b0JBQ2hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQztvQkFDM0UsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDO2lCQUM3RTtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFFMUIsYUFBYTtRQUNiLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSwrREFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUVwRixJQUFJLENBQUMsV0FBWSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUVsSCxJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2QsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pCO1lBRUQsSUFBTSxPQUFPLEdBQUcsNERBQWMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7Z0JBQ3BCLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtvQkFDYixLQUFLLENBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQztvQkFDbkIsS0FBSyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUM7aUJBQ3BCO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDSCxLQUFJLENBQUMsV0FBWSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3JELEtBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsVUFBQyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUNkLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtZQUVELElBQU0sT0FBTyxHQUFHLDREQUFjLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxLQUFLO2dCQUNwQixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7b0JBQ2IsS0FBSyxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUM7b0JBQ25CLEtBQUssQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDO2lCQUNwQjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLFdBQVksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0QsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFFSCwrQ0FBK0M7UUFDL0MsSUFBSSxDQUFDLElBQUssQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQztZQUMxQixLQUFJLENBQUMsV0FBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDMUMsS0FBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsNkJBQVEsR0FBUixVQUFTLElBQVEsRUFBRSxHQUFPLEVBQUUsT0FBYztRQUFqQywrQkFBUTtRQUFFLDZCQUFPO1FBQUUsd0NBQWM7UUFDeEMsSUFBSSxDQUFDLFdBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxDQS9RdUMsNkNBQUksR0ErUTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFNELElBQU0sb0JBQW9CLEdBQUc7SUFDM0IsT0FBTyxFQUFFLFFBQVE7SUFDakIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsVUFBVSxFQUFFLFdBQVc7SUFDdkIsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUTtJQUNoQyxRQUFRLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsY0FBYztJQUNsRSxTQUFTLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUUsZUFBZTtJQUN2RSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CO0lBQzNGLGVBQWU7SUFDZixZQUFZO0lBQ1osVUFBVTtJQUNWLGdCQUFnQjtJQUNoQixZQUFZLEVBQUUsV0FBVztJQUN6QixNQUFNO0lBQ04sVUFBVTtJQUNWLFVBQVU7SUFDVixZQUFZO0NBQ2IsQ0FBQztBQUVGLElBQU0scUJBQXFCLEdBQUc7SUFDNUIsVUFBVTtJQUNWLFlBQVk7SUFDWixXQUFXO0lBQ1gsZUFBZTtJQUNmLE9BQU87SUFDUCxpQkFBaUI7SUFDakIsY0FBYztJQUNkLGVBQWU7SUFDZixjQUFjO0lBQ2QsYUFBYTtDQUNkLENBQUM7QUFFRixJQUFNLFNBQVMsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQW1FSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbkd6QztBQUNhO0FBSTlDLElBQU0sbUJBQW1CLEdBQUcsZ0NBQWdDLENBQUM7QUFDN0QsSUFBSSxPQUFPLEdBQW9DLElBQUksQ0FBQztBQUVwRCxJQUFNLFVBQVUsR0FBRztJQUNqQixJQUFJLE9BQU8sRUFBRTtRQUNYLE9BQU8sT0FBTyxDQUFDO0tBQ2hCO0lBRUQsSUFBTSxNQUFNLEdBQUcsMERBQVksRUFBRSxDQUFDO0lBQzlCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBNkIsQ0FBQztJQUU5RCxPQUFPLE9BQU8sQ0FBQztBQUNqQixDQUFDLENBQUM7QUFHRixTQUFTLFlBQVksQ0FBQyxLQUFhLEVBQUUsS0FBYTtJQUNoRCxJQUFNLE9BQU8sR0FBRyxVQUFVLEVBQUUsQ0FBQztJQUU3QixPQUFPLENBQUMsSUFBSSxHQUFHLFVBQUcsS0FBSyxDQUFDLFVBQVUsSUFBSSxRQUFRLGNBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLGdCQUFNLEtBQUssQ0FBQyxVQUFVLElBQUksbUJBQW1CLENBQUUsQ0FBQztJQUV0SCxPQUFPLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsU0FBUywwQkFBMEIsQ0FBQyxLQUFhO0lBQy9DLE9BQU8sVUFBVSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7QUFDcEQsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEtBQWEsRUFBRSxLQUFhO0lBQzdDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQWUsQ0FBQztJQUNyQyxJQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRTdDLGtCQUFrQjtJQUNsQixJQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLFVBQVUsQ0FBQztJQUV0RCxhQUFhO0lBQ2IsSUFBSSxTQUFTLElBQUksUUFBUSxFQUFFO1FBQ3pCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCw2QkFBNkI7SUFDN0IsSUFBSSxZQUFZLEtBQUssVUFBVSxFQUFFO1FBQy9CLFFBQVEsSUFBSSwwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMvQztJQUVELElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRXJDLE9BQU8sMEJBQTBCLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDL0QsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUNaLEdBQUcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNsQztJQUVELE9BQU8sQ0FBQyxNQUFNLElBQUksWUFBWSxLQUFLLFVBQVU7UUFDM0MsQ0FBQyxDQUFDLFVBQUcsR0FBRyxRQUFLO1FBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQU1EO0lBQWtDLHdCQUFPO0lBU3ZDLGNBQVksRUFNQztZQUxYLGFBQVUsRUFBVixLQUFLLG1CQUFHLEVBQUUsT0FDVixjQUFXLEVBQVgsTUFBTSxtQkFBRyxFQUFFLE9BQ1gsaUJBQWMsRUFBZCxTQUFTLG1CQUFHLEVBQUUsT0FDZCxhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsT0FBTztRQUxULGlCQTZCQztRQXRCQyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbkMsMkJBQTJCO1FBQzNCLElBQUksZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1lBQ2xDLEtBQUssQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUMxQzthQUFNLElBQUksS0FBSyxDQUFDLFlBQVksS0FBSyxVQUFVLEVBQUU7WUFDNUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDakM7UUFFRCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzlCLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFVBQW9CLElBQUksS0FBSyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7U0FDbkU7Z0JBQ0Qsa0JBQU07WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULEtBQUs7WUFDTCxPQUFPO1NBQ1IsQ0FBQztRQS9CSSxjQUFRLEdBQUcsRUFBRSxDQUFDO1FBR2Ysa0JBQVksR0FBdUIsS0FBSyxDQUFDO1FBQ3pDLFVBQUksR0FBRyxFQUFFLENBQUM7UUFDVixlQUFTLEdBQW9CLE1BQU0sQ0FBQztRQUNwQyxlQUFTLEdBQUcsU0FBUyxDQUFDO1FBMkIzQixLQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUNuQixLQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNoQixLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN0QixLQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7O0lBQzNDLENBQUM7SUFFRCxzQkFBSSx1QkFBSzthQUFUO1lBQ0UsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3ZCLENBQUM7YUFFRCxVQUFVLFFBQVE7WUFDaEIsSUFBSSxRQUFRLEtBQUssSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDOUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO29CQUN2QyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDdkQ7cUJBQU0sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksS0FBSyxVQUFVLEVBQUU7b0JBQ2pELFFBQVEsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDNUM7Z0JBRUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Z0JBRXpCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO2dCQUNkLFlBQU0sR0FBSyxJQUFJLE9BQVQsQ0FBVTtnQkFDdEIsT0FBTyxRQUFNLEVBQUU7b0JBQ2IsUUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7b0JBQ3RCLFFBQU0sR0FBRyxRQUFNLENBQUMsTUFBTSxDQUFDO2lCQUN4QjthQUNGO1FBQ0gsQ0FBQzs7O09BbkJBO0lBcUJELDJCQUFZLEdBQVo7UUFDRSxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQztRQUUvQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBRyxLQUFLLENBQUMsVUFBVSxJQUFJLEVBQUUsY0FBSSxLQUFLLENBQUMsUUFBUSxJQUFJLEVBQUUsZ0JBQU0sbUJBQW1CLENBQUUsQ0FBQztRQUN6RixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDO1FBQzNDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUM7SUFDekMsQ0FBQztJQUVELHNCQUFPLEdBQVA7UUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELDBCQUFXLEdBQVg7UUFDRSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUQscUJBQU0sR0FBTixVQUFPLEdBQTZCLEVBQUUsVUFBbUI7UUFDdkQsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUxQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxVQUFVLEVBQUU7WUFDZCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFHRCxxQkFBTSxHQUFOO1FBQ0UsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQStCLENBQUM7UUFDakQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRVgsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUNuQixTQUFLLEdBQUssSUFBSSxNQUFULENBQVU7UUFFdkIsR0FBRyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQ3JDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQixHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFL0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUMxQixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRXBCLFNBQTJCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQS9DLFFBQVEsZ0JBQUUsVUFBVSxnQkFBMkIsQ0FBQztRQUV4RCxJQUFJLFFBQVEsRUFBRTtZQUNaLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN0QyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDbkQ7UUFFRCxJQUFJLEtBQUssQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNqRCxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxRTtRQUVELElBQUksVUFBVSxFQUFFO1lBQ2QsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2Q7UUFFRCxHQUFHLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFL0IsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUMvQixLQUFLLElBQUksR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFFO1lBQ3JDLEtBQUssSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3BCLEdBQUcsQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDO1lBQzVCLEtBQUssSUFBSyxLQUFLLENBQUMsVUFBcUIsR0FBRyxDQUFDLENBQUM7U0FDM0M7UUFFRCxHQUFHLENBQUMsUUFBUSxDQUNWLElBQUksQ0FBQyxLQUFLLEVBQ1YsS0FBSyxFQUNMLEtBQUssQ0FDTixDQUFDO1FBRUYsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0FBQyxDQW5KaUMsaURBQU8sR0FtSnhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6TmdDO0FBR2pDO0lBQWtDLHdCQUFPO0lBQ3ZDLGNBQVksRUFLTTtZQUpoQixhQUFVLEVBQVYsS0FBSyxtQkFBRyxFQUFFLE9BQ1YsY0FBVyxFQUFYLE1BQU0sbUJBQUcsRUFBRSxPQUNYLGlCQUFjLEVBQWQsU0FBUyxtQkFBRyxFQUFFLE9BQ2QsT0FBTztRQUpULFlBTUUsa0JBQU07WUFDSixNQUFNO1lBQ04sU0FBUztZQUNULEtBQUs7WUFDTCxPQUFPO1NBQ1IsQ0FBQyxTQUlIO1FBRkMsS0FBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsS0FBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7O0lBQ2xCLENBQUM7SUFFRCwwQkFBVyxHQUFYO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELHVDQUF1QztJQUN2Qyw4QkFBZSxHQUFmO1FBQ0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDdkIsZUFBVyxHQUFLLEtBQUssWUFBVixDQUFXO1FBRTlCLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWU7ZUFDMUIsQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQztlQUNsQyxDQUFDLEtBQUssQ0FBQyxjQUFjLElBQUksQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLGNBQWMsQ0FBQyxDQUFDO2VBQy9ELENBQUMsS0FBSyxDQUFDLGlCQUFpQixJQUFJLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO2VBQ3JFLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7ZUFDakUsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLElBQUksS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFRCxxQkFBTSxHQUFOO1FBQ0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7UUFDL0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUMzQix3QkFBd0I7UUFFeEIsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQStCLENBQUM7UUFFakQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRVgsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUM7UUFDM0MsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUM1QixJQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRTVCLElBQU0sZUFBZSxHQUFHLEtBQUssQ0FBQyxlQUFlLElBQUksV0FBVyxDQUFDO1FBQzdELElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixJQUFJLFdBQVcsQ0FBQztRQUMvRCxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsY0FBYyxJQUFJLFdBQVcsQ0FBQztRQUMzRCxJQUFNLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxXQUFXLENBQUM7UUFFakUsMEJBQTBCO1FBQ3BCLFNBQTJCLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEVBQS9DLFFBQVEsZ0JBQUUsVUFBVSxnQkFBMkIsQ0FBQztRQUV4RCxJQUFJLFFBQVEsRUFBRTtZQUNaLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO1FBRUQsSUFBSSxLQUFLLENBQUMsZUFBZSxFQUFFO1lBQ3pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztZQUN0QyxHQUFHLENBQUMsUUFBUSxDQUNWLEtBQUssR0FBRyxlQUFlLEVBQ3ZCLEtBQUssR0FBRyxnQkFBZ0IsRUFDeEIsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQyxFQUNoRCxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsY0FBYyxHQUFHLGlCQUFpQixDQUFDLENBQ2xELENBQUM7U0FDSDtRQUVELElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ2pELEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFFO1FBRUQsSUFBSSxVQUFVLEVBQUU7WUFDZCxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZDtRQUVELEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBRUQsc0JBQU8sR0FBUDtRQUNFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNoQixDQUFDO0lBQ0gsV0FBQztBQUFELENBQUMsQ0F0RmlDLGlEQUFPLEdBc0Z4Qzs7Ozs7Ozs7Ozs7Ozs7QUN6RkQsSUFBSSxPQUFPLFVBQVUsS0FBSyxXQUFXLEVBQUU7SUFDckMsVUFBVSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxFQUFFLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQztDQUN0RTs7Ozs7Ozs7Ozs7O0FDRlk7QUFFYixJQUFNLElBQUksR0FBRyxtQkFBTyxDQUFDLGtEQUFRLENBQUMsQ0FBQztBQUUvQixJQUFNLGFBQWEsR0FBRyxVQUFTLElBQUksRUFBRSxPQUFPO0lBQzFDLElBQU0sSUFBSSxHQUFHO1FBQ1gsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO0tBQ25CLENBQUM7SUFFRix1Q0FBdUM7SUFDdkMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7UUFDNUcsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQy9EO1NBQU07UUFDTCxtREFBbUQ7UUFDbkQsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsQ0FBQyxPQUFPLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFO2dCQUNsRyxJQUFHLE9BQU8sQ0FBQyxTQUFTLEtBQUssUUFBUSxFQUFDO29CQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBRSxDQUFDO2lCQUMzQztxQkFBSTtvQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7aUJBQ3ZDO2FBQ0Y7U0FDRjtLQUNGO0lBR0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUUsZUFBSztRQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQyxDQUFDO0lBRUgsd0NBQXdDO0lBQ3hDLHNEQUFzRDtJQUN0RCwrQkFBK0I7SUFDL0IsaUVBQWlFO0lBQ2pFLDBCQUEwQjtJQUMxQiw2Q0FBNkM7SUFDN0MsOEVBQThFO0lBQzlFLFFBQVE7SUFDUixhQUFhO0lBQ2Isc0NBQXNDO0lBQ3RDLHNFQUFzRTtJQUN0RSx1Q0FBdUM7SUFDdkMsc0NBQXNDO0lBQ3RDLGFBQWE7SUFDYixrQ0FBa0M7SUFDbEMsZ0RBQWdEO0lBQ2hELDJFQUEyRTtJQUMzRSxhQUFhO0lBQ2Isd0VBQXdFO0lBQ3hFLFFBQVE7SUFDUixNQUFNO0lBQ04sSUFBSTtJQUVKLFdBQVc7SUFDWCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLHFCQUFxQixHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDNUR6QjtBQUViLElBQU0sVUFBVSxHQUFHLG1CQUFPLENBQUMsNERBQWEsQ0FBQyxDQUFDO0FBQzFDLElBQU0sWUFBWSxHQUFHLG1CQUFPLENBQUMsc0VBQWtCLENBQUMsQ0FBQztBQUNqRCxJQUFNLFNBQVMsR0FBRyxtQkFBTyxDQUFDLHNFQUFrQixDQUFDLENBQUM7QUFDOUMsSUFBTSxZQUFZLEdBQUcsc0ZBQThCLENBQUM7QUFDcEQsSUFBTSxTQUFTLEdBQUcsbUJBQU8sQ0FBQyw0REFBYSxDQUFDLENBQUM7QUFFekMsYUFBYSxHQUFHLFVBQVMsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0I7SUFDeEQsSUFBSSxnQkFBZ0IsRUFBQztRQUNuQixJQUFHLGdCQUFnQixLQUFLLElBQUk7WUFBRSxnQkFBZ0IsR0FBRyxFQUFFO1FBRW5ELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDN0QsSUFBSSxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQ25CLE1BQU0sS0FBSyxDQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO1NBQzdCO0tBQ0Y7SUFDRixPQUFPLEdBQUcsWUFBWSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsY0FBYyxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzRSxPQUFPLFVBQVUsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDM0YsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7QUNuQlc7QUFFYixJQUFNLGFBQWEsR0FBRyxVQUFTLE1BQU0sRUFBRSxLQUFLO0lBQzFDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNuQixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQy9CLE9BQU8sS0FBSyxFQUFFO1FBQ1osSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3RCLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDekIsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUN4QyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN6QixLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM1QjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUVGLElBQU0sU0FBUyxHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUs7SUFDdEMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVcsQ0FBQyxDQUFDO0FBQzNELENBQUMsQ0FBQztBQUVGLElBQU0sWUFBWSxHQUFHLFVBQVMsTUFBTSxFQUFFLEtBQUs7SUFDekMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbkMsQ0FBQyxDQUFDO0FBRUYsZUFBZSxHQUFHLFVBQVMsQ0FBQztJQUMxQixPQUFPLE9BQU8sQ0FBQyxLQUFLLFdBQVcsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFRixxQkFBcUIsR0FBRyxVQUFTLEdBQUc7SUFDbEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILGFBQWEsR0FBRyxVQUFTLE1BQU0sRUFBRSxDQUFDLEVBQUUsU0FBUztJQUMzQyxJQUFJLENBQUMsRUFBRTtRQUNMLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7UUFDdEUsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLHNCQUFzQjtRQUMvQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVCLElBQUcsU0FBUyxLQUFLLFFBQVEsRUFBQztnQkFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFFLENBQUM7YUFDbEM7aUJBQUk7Z0JBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtTQUNGO0tBQ0Y7QUFDSCxDQUFDLENBQUM7QUFDRjs7SUFFSTtBQUVKLGdCQUFnQixHQUFHLFVBQVMsQ0FBQztJQUMzQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdEIsT0FBTyxDQUFDLENBQUM7S0FDVjtTQUFNO1FBQ0wsT0FBTyxFQUFFLENBQUM7S0FDWDtBQUNILENBQUMsQ0FBQztBQUVGLDRDQUE0QztBQUM1QywwQ0FBMEM7QUFFMUMsb0JBQW9CLEdBQUcsVUFBUyxPQUFPLEVBQUUsY0FBYyxFQUFFLEtBQUs7SUFDNUQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLGNBQWMsQ0FBQyxDQUFDLDBCQUEwQjtLQUNsRDtJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3JDLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsRUFBRTtZQUNuQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO0tBQ0Y7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDLENBQUM7QUFFRixpQkFBaUIsR0FBRyxTQUFTLENBQUM7QUFDOUIsb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQ3BDLHFCQUFxQixHQUFHLGFBQWEsQ0FBQzs7Ozs7Ozs7Ozs7O0FDckZ6QjtBQUViLElBQU0sSUFBSSxHQUFHLG1CQUFPLENBQUMsa0RBQVEsQ0FBQyxDQUFDO0FBRS9CLElBQU0sY0FBYyxHQUFHO0lBQ3JCLHNCQUFzQixFQUFFLEtBQUs7SUFDN0IsV0FBVyxFQUFFLFFBQVE7Q0FDdEIsQ0FBQztBQUVGLElBQU0sS0FBSyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFeEQscUVBQXFFO0FBQ3JFLGdCQUFnQixHQUFHLFVBQVMsT0FBTyxFQUFFLE9BQU87SUFDMUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUU1RCxzRUFBc0U7SUFDdEUsK0VBQStFO0lBQy9FLDZGQUE2RjtJQUU3RixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtRQUMzQixrQ0FBa0M7UUFDbEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDN0I7SUFDRCxJQUFNLFlBQVksR0FBRyxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUM5RixJQUFNLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNsRyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDdEIsaUJBQWlCO1lBQ2pCLGlFQUFpRTtZQUVqRSxDQUFDLEVBQUUsQ0FBQztZQUNKLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDdEIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDekIsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFO29CQUNULE9BQU8sQ0FBQyxDQUFDO2lCQUNWO2FBQ0Y7aUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUM3QixDQUFDLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxTQUFTO2FBQ1Y7aUJBQU07Z0JBQ0wsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO2dCQUN2QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7b0JBQ3RCLGFBQWE7b0JBQ2IsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDbEIsQ0FBQyxFQUFFLENBQUM7aUJBQ0w7Z0JBQ0QsY0FBYztnQkFDZCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ2pCLE9BRUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNO29CQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRztvQkFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUc7b0JBQ2xCLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJO29CQUNuQixPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSTtvQkFDbkIsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFDbkIsQ0FBQyxFQUFFLEVBQ0g7b0JBQ0EsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdkI7Z0JBQ0QsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDekIsdUJBQXVCO2dCQUV2QixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDdkMscUNBQXFDO29CQUNyQyxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsU0FBUztpQkFDVjtnQkFDRCxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsRUFBRTtvQkFDMUMsT0FBTyxFQUFDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLE1BQU0sR0FBRyxPQUFPLEdBQUcsc0JBQXNCLEVBQUMsRUFBQyxDQUFDO2lCQUNwRjtnQkFFRCxJQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQzVDLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtvQkFDcEIsT0FBTyxFQUFDLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxFQUFFLGtCQUFrQixHQUFHLE9BQU8sR0FBRyxvQkFBb0IsRUFBQyxFQUFDLENBQUM7aUJBQy9GO2dCQUNELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQzNCLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUVqQixJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtvQkFDdkMsa0JBQWtCO29CQUNsQixPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDbkQsSUFBTSxPQUFPLEdBQUcsdUJBQXVCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDeEUsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO3dCQUNwQixRQUFRLEdBQUcsSUFBSSxDQUFDO3dCQUNoQixzREFBc0Q7cUJBQ3ZEO3lCQUFNO3dCQUNMLE9BQU8sT0FBTyxDQUFDO3FCQUNoQjtpQkFDRjtxQkFBTSxJQUFJLFVBQVUsRUFBRTtvQkFDckIsSUFBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUM7d0JBQ25CLE9BQU87NEJBQ0wsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsZUFBZSxHQUFHLE9BQU8sR0FBRywrQkFBK0IsRUFBQzt5QkFDNUYsQ0FBQztxQkFDSDt5QkFBSyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNuQyxPQUFPOzRCQUNMLEdBQUcsRUFBRSxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLGVBQWUsR0FBRyxPQUFPLEdBQUcsK0NBQStDLEVBQUM7eUJBQzVHLENBQUM7cUJBQ0g7eUJBQU07d0JBQ0wsSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO3dCQUN2QixJQUFJLE9BQU8sS0FBSyxHQUFHLEVBQUU7NEJBQ25CLE9BQU87Z0NBQ0wsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsY0FBYyxHQUFHLEdBQUcsR0FBRywwQkFBMEIsR0FBRyxPQUFPLEdBQUcsR0FBRyxFQUFDOzZCQUNsRyxDQUFDO3lCQUNIO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLElBQU0sT0FBTyxHQUFHLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxDQUFDLENBQUM7b0JBQ3hFLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTt3QkFDcEIsT0FBTyxPQUFPLENBQUM7cUJBQ2hCO29CQUNELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ25CLFFBQVEsR0FBRyxJQUFJLENBQUM7aUJBQ2pCO2dCQUVELHFCQUFxQjtnQkFDckIseUNBQXlDO2dCQUN6QyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7d0JBQ3RCLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7NEJBQzFCLG1CQUFtQjs0QkFDbkIsQ0FBQyxFQUFFLENBQUM7NEJBQ0osQ0FBQyxHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQzs0QkFDcEMsU0FBUzt5QkFDVjs2QkFBTTs0QkFDTCxNQUFNO3lCQUNQO3FCQUNGO2lCQUNGLENBQUMsK0JBQStCO2dCQUNqQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7b0JBQ3RCLENBQUMsRUFBRSxDQUFDO2lCQUNMO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUMzRixTQUFTO2FBQ1Y7WUFDRCxPQUFPLEVBQUMsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxvQkFBb0IsRUFBQyxFQUFDLENBQUM7U0FDdkY7S0FDRjtJQUVELElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDYixPQUFPLEVBQUMsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUscUJBQXFCLEVBQUMsRUFBQyxDQUFDO0tBQ2hFO1NBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUMxQixPQUFPO1lBQ0wsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLFNBQVMsRUFBQztTQUM3RyxDQUFDO0tBQ0g7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxTQUFTLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzlCLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO1lBQzFDLFNBQVM7WUFDVCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLEVBQUU7Z0JBQzlCLE9BQU8sRUFBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSw0REFBNEQsRUFBQyxFQUFDLENBQUM7YUFDdkc7aUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFO2dCQUNyRCxnQ0FBZ0M7Z0JBQ2hDLENBQUMsRUFBRSxDQUFDO2dCQUNKLE1BQU07YUFDUDtpQkFBTTtnQkFDTCxTQUFTO2FBQ1Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDWCxDQUFDO0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUM5RSxTQUFTO1FBQ1QsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtnQkFDMUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNO2FBQ1A7U0FDRjtLQUNGO1NBQU0sSUFDTCxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUN0QjtRQUNBLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO1FBQzNCLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQ3RCLGtCQUFrQixFQUFFLENBQUM7YUFDdEI7aUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUM3QixrQkFBa0IsRUFBRSxDQUFDO2dCQUNyQixJQUFJLGtCQUFrQixLQUFLLENBQUMsRUFBRTtvQkFDNUIsTUFBTTtpQkFDUDthQUNGO1NBQ0Y7S0FDRjtTQUFNLElBQ0wsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFDdEI7UUFDQSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO2dCQUMxRSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNQLE1BQU07YUFDUDtTQUNGO0tBQ0Y7SUFFRCxPQUFPLENBQUMsQ0FBQztBQUNYLENBQUM7QUFFRCxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDdEIsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDO0FBRXRCOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDOUIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLEVBQUU7WUFDNUQsSUFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO2dCQUNwQixTQUFTLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hCO2lCQUFNLElBQUksU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDbkMsc0dBQXNHO2dCQUN0RyxTQUFTO2FBQ1Y7aUJBQU07Z0JBQ0wsU0FBUyxHQUFHLEVBQUUsQ0FBQzthQUNoQjtTQUNGO2FBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQzdCLElBQUksU0FBUyxLQUFLLEVBQUUsRUFBRTtnQkFDcEIsU0FBUyxHQUFHLElBQUksQ0FBQztnQkFDakIsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZCO0lBQ0QsSUFBSSxTQUFTLEtBQUssRUFBRSxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxJQUFNLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLHlEQUF5RCxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXJHLG1EQUFtRDtBQUVuRCxTQUFTLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWTtJQUM3RCx1Q0FBdUM7SUFFdkMsNkRBQTZEO0lBRTdELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLGlCQUFpQixDQUFDLENBQUM7SUFDL0QsSUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3ZDLDBCQUEwQjtRQUUxQixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzlCLDhDQUE4QztZQUM5QyxPQUFPLEVBQUMsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsWUFBWSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyw0QkFBNEIsRUFBQyxFQUFDLENBQUM7U0FDdkc7YUFBTSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUU7WUFDekUsMkJBQTJCO1lBQzNCLE9BQU8sRUFBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLEVBQUMsRUFBQyxDQUFDO1NBQ3JHO1FBQ0Q7O3dCQUVnQjtRQUNoQixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsRUFBRTtZQUM3QyxPQUFPLEVBQUMsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxHQUFHLEVBQUUsWUFBWSxHQUFHLFFBQVEsR0FBRyxzQkFBc0IsRUFBQyxFQUFDLENBQUM7U0FDNUY7UUFDRCw4Q0FBOEM7UUFDOUMsSUFBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDL0QsZ0NBQWdDO1lBQ2hDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDekI7YUFBTTtZQUNMLE9BQU8sRUFBQyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLEdBQUcsRUFBRSxZQUFZLEdBQUcsUUFBUSxHQUFHLGVBQWUsRUFBQyxFQUFDLENBQUM7U0FDckY7S0FDRjtJQUVELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELGlEQUFpRDtBQUVqRCxTQUFTLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFZO0lBQzlDLG1EQUFtRDtJQUNuRCxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxvREFBb0Q7QUFDcEQsMkNBQTJDO0FBRTNDLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxXQUFXO0lBQzNDO1lBQ1E7SUFDUixPQUFPLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDbEQsQ0FBQzs7Ozs7Ozs7Ozs7O0FDclVZO0FBRWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRztJQUM1QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLFlBQVk7SUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0I7SUFDcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXO0lBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBUyxLQUFLO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO1lBQzVDLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUM7Ozs7Ozs7Ozs7OztBQ2xCVztBQUViLElBQU0sSUFBSSxHQUFHLG1CQUFPLENBQUMsa0RBQVEsQ0FBQyxDQUFDO0FBQy9CLElBQU0sWUFBWSxHQUFHLHNGQUE4QixDQUFDO0FBQ3BELElBQU0sT0FBTyxHQUFHLG1CQUFPLENBQUMsd0RBQVcsQ0FBQyxDQUFDO0FBQ3JDLElBQU0sT0FBTyxHQUFHLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO0FBQzVELElBQUksSUFBSSxHQUNOLGlJQUFpSSxDQUFDO0FBRXBJLDhGQUE4RjtBQUM5RixvSEFBb0g7QUFFcEgsVUFBVTtBQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLE1BQU0sQ0FBQyxRQUFRLEVBQUU7SUFDdkMsTUFBTSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0NBQ25DO0FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLFVBQVUsRUFBRTtJQUMzQyxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7Q0FDdkM7QUFFRCxJQUFNLGNBQWMsR0FBRztJQUNyQixtQkFBbUIsRUFBRSxJQUFJO0lBQ3pCLFlBQVksRUFBRSxLQUFLO0lBQ25CLFlBQVksRUFBRSxPQUFPO0lBQ3JCLGdCQUFnQixFQUFFLElBQUk7SUFDdEIsZUFBZSxFQUFFLEtBQUs7SUFDdEIsc0JBQXNCLEVBQUUsS0FBSztJQUM3Qiw0QkFBNEI7SUFDNUIsY0FBYyxFQUFFLElBQUk7SUFDcEIsbUJBQW1CLEVBQUUsS0FBSztJQUMxQixTQUFTLEVBQUUsS0FBSztJQUNoQixVQUFVLEVBQUUsSUFBSTtJQUNoQixZQUFZLEVBQUUsS0FBSztJQUNuQixpQkFBaUIsRUFBRSxLQUFLO0lBQ3hCLFdBQVcsRUFBRSxFQUFFO0lBQ2YsaUJBQWlCLEVBQUUsVUFBUyxDQUFDO1FBQzNCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNELGtCQUFrQixFQUFFLFVBQVMsQ0FBQztRQUM1QixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFDRCxTQUFTLEVBQUUsRUFBRTtJQUNiLHNCQUFzQjtDQUN2QixDQUFDO0FBRUYsc0JBQXNCLEdBQUcsY0FBYyxDQUFDO0FBRXhDLElBQU0sS0FBSyxHQUFHO0lBQ1oscUJBQXFCO0lBQ3JCLGNBQWM7SUFDZCxjQUFjO0lBQ2Qsa0JBQWtCO0lBQ2xCLGlCQUFpQjtJQUNqQix3QkFBd0I7SUFDeEIsZ0JBQWdCO0lBQ2hCLHFCQUFxQjtJQUNyQixXQUFXO0lBQ1gsWUFBWTtJQUNaLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQixvQkFBb0I7SUFDcEIscUJBQXFCO0lBQ3JCLFdBQVc7Q0FDWixDQUFDO0FBQ0YsYUFBYSxHQUFHLEtBQUssQ0FBQztBQUV0QixJQUFNLGVBQWUsR0FBRyxVQUFTLE9BQU8sRUFBRSxPQUFPO0lBQy9DLE9BQU8sR0FBRyxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxnRUFBZ0U7SUFDaEUsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0I7SUFFckUsSUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDO0lBRXpCLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNqRSxJQUFNLFFBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkMsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqQyxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sR0FBRyxFQUFFO1FBQ1YsSUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJDLElBQUksT0FBTyxLQUFLLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDL0IsZ0NBQWdDO1lBQ2hDLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2pDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUNqSTtZQUNELElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUMvRSxXQUFXLENBQUMsS0FBSyxHQUFHLEVBQUU7Z0JBQ3RCLElBQUksV0FBVyxDQUFDLFFBQVEsSUFBSSxTQUFTLEVBQUU7b0JBQUUsV0FBVyxDQUFDLFFBQVEsR0FBRyxFQUFFO2lCQUFDO2dCQUNuRSxXQUFXLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQzthQUNyRztZQUNELFdBQVcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1NBQ2xDO2FBQU0sSUFBSSxPQUFPLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNwQyxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUU7Z0JBQ3hCLGdCQUFnQjtnQkFDaEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pFLFNBQVMsQ0FBQyxRQUFRLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUN6RCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNoQyxrQkFBa0I7Z0JBQ2xCLFdBQVcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDO2dCQUM3RSwrQkFBK0I7Z0JBQy9CLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUNYLFdBQVcsQ0FBQyxHQUFHLElBQUksZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDbEQ7YUFDRjtpQkFBTTtnQkFDTCxXQUFXLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzVGO1NBQ0Y7YUFBTSxJQUFJLE9BQU8sS0FBSyxPQUFPLENBQUMsSUFBSSxFQUFFO1lBQ25DLElBQUksV0FBVyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDMUIsV0FBVyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN2RjtZQUVELElBQU0sU0FBUyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDL0IsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDOUM7WUFDRCxTQUFTLENBQUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6RCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2pDO2FBQU07WUFDTCxpQkFBaUI7WUFDakIsSUFBTSxTQUFTLEdBQUcsSUFBSSxPQUFPLENBQzNCLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUN6QyxXQUFXLEVBQ1gsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FDOUIsQ0FBQztZQUNGLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM3RSxTQUFTLENBQUMsVUFBVSxHQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07YUFDL0M7WUFDRCxTQUFTLENBQUMsUUFBUSxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN6RCxXQUFXLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ2hDLFdBQVcsR0FBRyxTQUFTLENBQUM7U0FDekI7UUFFRCxHQUFHLEdBQUcsT0FBTyxDQUFDO1FBQ2QsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbEM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixTQUFTLGVBQWUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLGFBQWE7SUFDekQsSUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLGFBQWEsQ0FBQztJQUMvQyxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDekIsSUFBSSxHQUFHLEVBQUU7UUFDUCxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNsQjtRQUNELEdBQUcsR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlDLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDNUU7SUFFRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxTQUFTLGVBQWUsQ0FBQyxLQUFLO0lBQzVCLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssRUFBRTtRQUN0QixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUM7S0FDdEI7U0FBTSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEVBQUU7UUFDNUIsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ3hCO1NBQU0sSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtRQUMxRixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7S0FDckI7U0FBTTtRQUNMLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztLQUN4QjtBQUNILENBQUM7QUFFRCxTQUFTLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPO0lBQ3hDLElBQUksT0FBTyxDQUFDLGVBQWUsRUFBRTtRQUMzQixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNwRCxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLEVBQUU7WUFDdkIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDckIsT0FBTyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDNUI7S0FDRjtJQUNELE9BQU8sT0FBTyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLG1CQUFtQjtJQUN2RCxJQUFJLFdBQVcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7UUFDMUMsSUFBSSxNQUFNLFVBQUM7UUFDWCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sR0FBRyxHQUFHLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQ2hFO2FBQU07WUFDTCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQzVCLHNCQUFzQjtnQkFDdEIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ25DO2lCQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakM7aUJBQU07Z0JBQ0wsTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ25DO1lBQ0QsSUFBSSxtQkFBbUIsRUFBRTtnQkFDdkIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO2FBQ2hEO1NBQ0Y7UUFDRCxPQUFPLE1BQU0sQ0FBQztLQUNmO1NBQU07UUFDTCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDckIsT0FBTyxHQUFHLENBQUM7U0FDWjthQUFNO1lBQ0wsT0FBTyxFQUFFLENBQUM7U0FDWDtLQUNGO0FBQ0gsQ0FBQztBQUVELGtDQUFrQztBQUNsQyxzRkFBc0Y7QUFDdEYsSUFBTSxTQUFTLEdBQUcsSUFBSSxNQUFNLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFM0UsU0FBUyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUUsT0FBTztJQUMxQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUM1RCxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDekMsc0NBQXNDO1FBRXRDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxzQkFBc0I7UUFDbEQsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzFELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtnQkFDbkIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUFFO29CQUMvQixJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7d0JBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7cUJBQ3RDO29CQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO29CQUNwRSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxHQUFHLFVBQVUsQ0FDeEQsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNiLE9BQU8sQ0FBQyxtQkFBbUIsRUFDM0IsT0FBTyxDQUFDLG1CQUFtQixDQUM1QixDQUFDO2lCQUNIO3FCQUFNLElBQUksT0FBTyxDQUFDLHNCQUFzQixFQUFFO29CQUN6QyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDdEQ7YUFDRjtTQUNGO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzlCLE9BQU87U0FDUjtRQUNELElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtZQUN4QixJQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7WUFDMUIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDN0MsT0FBTyxjQUFjLENBQUM7U0FDdkI7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0gsQ0FBQztBQUVELHVCQUF1QixHQUFHLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7OztBQzVQMUM7Ozs7Ozs7Ozs7OztHQVlHO0FBRUg7Ozs7Ozs7OztHQVNHO0FBQ0gsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPO0lBQ3BCLElBQUksSUFBMEMsRUFBRTtRQUM1Qyx3Q0FBd0M7UUFDeEMsaUNBQU8sQ0FBQyxPQUFTLENBQUMsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQyxDQUFDO0tBQ2hDO1NBQU0sRUFNTjtBQUNMLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxPQUFPO0lBQ3JCLElBQUksTUFBTSxHQUFHLE9BQU8sTUFBTSxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNO0lBQzFELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLElBQUk7UUFDbkIsT0FBTyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDO0lBQ0YsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLElBQUkscUJBQXFCLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFFaEI7Ozs7O09BS0c7SUFDSCxPQUFPLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRTtRQUN2QixJQUFJLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLE9BQU8sRUFBRTtZQUNULE9BQU8sQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdEI7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDLENBQUM7SUFHRjs7Ozs7T0FLRztJQUNILE9BQU8sQ0FBQyxTQUFTLEdBQUcsVUFBVSxFQUFFO1FBQzVCLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLElBQUksQ0FBQztJQUNoQyxDQUFDLENBQUM7SUFHRjs7Ozs7Ozs7Ozs7Ozs7T0FjRztJQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsVUFBVSxZQUFZLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsSUFBSTtRQUNuRyxJQUFJLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUNuQixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLEVBQUUsR0FBRyxPQUFPLEVBQUUsQ0FBQztRQUVuQiwrREFBK0Q7UUFDL0QsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNmLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNwQixLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBRTtnQkFDeEIsVUFBVSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQzthQUM3QjtZQUNELE9BQU8sR0FBRyxVQUFVLENBQUM7U0FDeEI7UUFFRCwwRUFBMEU7UUFDMUUsSUFBSSxJQUFJLEdBQUcsVUFBVSxPQUFPO1lBRXhCLDBCQUEwQjtZQUMxQixJQUFJLE1BQU0sR0FBRyxPQUFPLEtBQUssSUFBSSxDQUFDO1lBRTlCLG1CQUFtQjtZQUNuQixJQUFJLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztZQUVqQixzREFBc0Q7WUFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUV6RCxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixpQkFBaUIsQ0FBQyxhQUFhLEdBQUcsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0RyxPQUFPO2FBRVY7WUFFRCwyRUFBMkU7WUFDM0Usd0ZBQXdGO1lBQ3hGLElBQUksTUFBTSxFQUFFO2dCQUVSLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsR0FBRyxhQUFhLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEcsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNqRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ1gsV0FBVyxFQUFFLENBQUM7aUJBQ2pCO2FBRUo7WUFFRCx3QkFBd0I7WUFDeEIsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsT0FBTyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDbkMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO29CQUNiLE9BQU8sR0FBRyxDQUFDLENBQUM7aUJBQ2Y7YUFDSjtZQUVELGlDQUFpQztZQUNqQyxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQzNELElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsQ0FBQyxJQUFJLE1BQU0sRUFBRTtnQkFDekUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDbkIsaUJBQWlCLENBQUMsYUFBYSxHQUFHLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcscUJBQXFCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxPQUFPLEtBQUssQ0FBQyxJQUFJLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQzthQUMzSTtpQkFBTSxJQUFJLE1BQU0sRUFBRTtnQkFDZixTQUFTLEdBQUcsR0FBRyxDQUFDO2dCQUNoQixxQkFBcUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDckM7UUFDTCxDQUFDLENBQUM7UUFFRixrQkFBa0I7UUFDbEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVuQixrQkFBa0I7UUFDbEIscUJBQXFCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRWxDLDZCQUE2QjtRQUM3QixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pLSjs7Ozs7Ozs7Ozs7O0dBWUc7QUFDNkI7QUFDaEMsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUM7QUFFM0IsZ0VBQWdFO0FBQ2hFLHFDQUFxQztBQUVyQzs7SUFFSTtBQUNKLElBQUksWUFBWSxHQUFHLFVBQVUsR0FBRztJQUM5QixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRjs7SUFFSTtBQUNKLElBQUksY0FBYyxHQUFHLFVBQVUsR0FBRztJQUNoQyxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUNwQixPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMvQjtJQUVELE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUM7QUFHRjs7R0FFRztBQUNIO0lBQ0Usa0JBQVksUUFBUSxFQUFFLE9BQU87UUF5RDdCOzs7O1NBSUM7UUFFRCx1RUFBdUU7UUFDdkUsb0JBQWUsR0FBRyxLQUFLLENBQUM7UUFFeEIsOERBQThEO1FBQzlELGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRXJCLHFFQUFxRTtRQUNyRSw4QkFBeUIsR0FBRyxLQUFLLENBQUM7UUFFbEM7OztXQUdHO1FBQ0gsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFFdEI7Ozs7V0FJRztRQUNILGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRXJCOzs7V0FHRztRQUNILHFCQUFnQixHQUFHLEtBQUssQ0FBQztRQUV6Qjs7V0FFRztRQUNILGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBSXRCOzs7O1VBSUU7UUFFRix1Q0FBdUM7UUFDdkMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFFakIsd0NBQXdDO1FBQ3hDLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLCtCQUErQjtRQUMvQixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUVsQixnQ0FBZ0M7UUFDaEMsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFFbkIscUNBQXFDO1FBQ3JDLG1CQUFjLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLHNDQUFzQztRQUN0QyxvQkFBZSxHQUFHLENBQUMsQ0FBQztRQUVwQiwyQ0FBMkM7UUFDM0MsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFFbEIsNENBQTRDO1FBQzVDLGlCQUFZLEdBQUcsR0FBRyxDQUFDO1FBRW5CLDBCQUEwQjtRQUMxQixnQkFBVyxHQUFHLENBQUMsQ0FBQztRQUVoQix5Q0FBeUM7UUFDekMsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFFakIseUNBQXlDO1FBQ3pDLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRWhCLDBEQUEwRDtRQUMxRCxvQkFBZSxHQUFHLENBQUMsQ0FBQztRQUVwQiwwREFBMEQ7UUFDMUQsbUJBQWMsR0FBRyxDQUFDLENBQUM7UUFFbkIsc0VBQXNFO1FBQ3RFLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLHFFQUFxRTtRQUNyRSxtQkFBYyxHQUFHLENBQUMsQ0FBQztRQUVuQixnRUFBZ0U7UUFDaEUsb0JBQWUsR0FBRyxDQUFDLENBQUM7UUFJcEI7Ozs7VUFJRTtRQUVGLGdEQUFnRDtRQUNoRCxvQkFBZSxHQUFHLElBQUksQ0FBQztRQUV2QiwrQ0FBK0M7UUFDL0MsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFFdEIsb0dBQW9HO1FBQ3BHLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBRXZCOzs7Ozs7Ozs7VUFTRTtRQUVGLGlFQUFpRTtRQUNqRSxnQ0FBMkIsR0FBRyxJQUFJLENBQUM7UUFFbkMsZ0VBQWdFO1FBQ2hFLCtCQUEwQixHQUFHLElBQUksQ0FBQztRQUVsQyxpRUFBaUU7UUFDakUsZ0NBQTJCLEdBQUcsSUFBSSxDQUFDO1FBRW5DLGdFQUFnRTtRQUNoRSwrQkFBMEIsR0FBRyxJQUFJLENBQUM7UUFFbEMsc0ZBQXNGO1FBQ3RGLDRCQUF1QixHQUFHLElBQUksQ0FBQztRQUUvQixvRkFBb0Y7UUFDcEYsNEJBQXVCLEdBQUcsSUFBSSxDQUFDO1FBbk03QixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztRQUUzQixJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ2IsaUNBQWlDO1lBQ2pDLFVBQVUsRUFBRSxJQUFJO1lBRWhCLGlDQUFpQztZQUNqQyxVQUFVLEVBQUUsSUFBSTtZQUVoQiwyRUFBMkU7WUFDM0UsU0FBUyxFQUFFLElBQUk7WUFFZiwyREFBMkQ7WUFDM0QsaUJBQWlCLEVBQUUsR0FBRztZQUV0QiwyRkFBMkY7WUFDM0YsUUFBUSxFQUFFLElBQUk7WUFFZCwwRkFBMEY7WUFDMUYsT0FBTyxFQUFFLElBQUk7WUFFYix5RUFBeUU7WUFDekUsTUFBTSxFQUFFLEtBQUs7WUFFYiw0REFBNEQ7WUFDNUQsUUFBUSxFQUFFLEtBQUs7WUFFZixpRUFBaUU7WUFDakUsT0FBTyxFQUFFLEtBQUs7WUFFZCx5QkFBeUI7WUFDekIsT0FBTyxFQUFFLEdBQUc7WUFFWix5QkFBeUI7WUFDekIsT0FBTyxFQUFFLENBQUM7WUFFViw0Q0FBNEM7WUFDNUMsZUFBZSxFQUFFLENBQUM7WUFFbEI7O2dEQUVvQztZQUNwQyxpQkFBaUIsRUFBRSxJQUFJO1lBRXZCLDhGQUE4RjtZQUM5Rix1QkFBdUIsRUFBRSxJQUFJO1lBRTdCLDhGQUE4RjtZQUM5Rix1QkFBdUIsRUFBRSxJQUFJO1NBQzlCLENBQUM7UUFFRixLQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtZQUN2QixJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFpSkQ7Ozs7TUFJRTtJQUVGOzs7Ozs7Ozs7T0FTRztJQUNILGdDQUFhLEdBQWIsVUFBYyxXQUFXLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhO1FBQ2xFLHVDQUF1QztRQUN2QyxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUM7U0FDbEM7UUFFRCxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUM7U0FDcEM7UUFFRCxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7WUFDekIsSUFBSSxDQUFDLGNBQWMsR0FBRyxZQUFZLENBQUM7U0FDcEM7UUFFRCxJQUFJLGFBQWEsS0FBSyxJQUFJLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxhQUFhLENBQUM7U0FDdEM7UUFFRCxtQkFBbUI7UUFDbkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsMEJBQTBCO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILDhCQUFXLEdBQVgsVUFBWSxJQUFJLEVBQUUsR0FBRztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFHRDs7Ozs7T0FLRztJQUNILDhCQUFXLEdBQVgsVUFBWSxLQUFLLEVBQUUsTUFBTTtRQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILDRCQUFTLEdBQVQ7UUFDRSxPQUFPO1lBQ0wsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQ3ZCLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVztZQUNyQixLQUFLLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxXQUFXO1lBQ2hFLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVc7WUFDakUsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXO1NBQ3ZCLENBQUM7SUFDSixDQUFDO0lBR0Q7O09BRUc7SUFDSCwyQkFBUSxHQUFSLFVBQVMsVUFBVSxFQUFFLFNBQVM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRTlCLE9BQU87WUFDTCxJQUFJLEVBQUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJO1lBQzlCLEdBQUcsRUFBRSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUk7U0FDN0IsQ0FBQztJQUNKLENBQUM7SUFHRDs7OztPQUlHO0lBQ0gsK0JBQVksR0FBWjtRQUNFLE9BQU87WUFDTCxJQUFJLEVBQUUsSUFBSSxDQUFDLGVBQWU7WUFDMUIsR0FBRyxFQUFFLElBQUksQ0FBQyxjQUFjO1NBQ3pCLENBQUM7SUFDSixDQUFDO0lBR0Q7Ozs7Ozs7OztPQVNHO0lBQ0gseUJBQU0sR0FBTixVQUFPLEtBQUssRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRO1FBQ3JELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDNUM7UUFFRCx5QkFBeUI7UUFDekIsSUFBSSxRQUFRLEVBQUU7WUFDWixJQUFJLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQztTQUNoQztRQUVELG9CQUFvQjtRQUNwQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixvREFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7U0FDL0I7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRWhDLDZEQUE2RDtRQUM3RCxJQUFJLFNBQVMsS0FBSyxTQUFTLEVBQUU7WUFDM0IsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDO1FBRUQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1lBQzFCLFFBQVEsR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQztTQUNwQztRQUVELHlDQUF5QztRQUN6QyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFOUUsMEVBQTBFO1FBQzFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUUvQixtRUFBbUU7UUFDbkUsa0VBQWtFO1FBQ2xFLG9EQUFvRDtRQUNwRCxxRUFBcUU7UUFDckUsWUFBWTtRQUNaLHNEQUFzRDtRQUN0RCxvREFBb0Q7UUFDcEQsbUNBQW1DO1FBQ25DLGlDQUFpQztRQUNqQyxFQUFFO1FBQ0YsdUJBQXVCO1FBQ3ZCLHFDQUFxQztRQUNyQyxxQ0FBcUM7UUFDckMsbUNBQW1DO1FBQ25DLEVBQUU7UUFDRixzREFBc0Q7UUFDdEQsZ0NBQWdDO1FBQ2hDLHlFQUF5RTtRQUN6RSxtREFBbUQ7UUFDbkQsbURBQW1EO1FBQ25ELCtEQUErRDtRQUMvRCxJQUFJLENBQUMsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQzNELElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDO1FBRXZELGVBQWU7UUFDZixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQy9CLElBQUksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1NBQzdCO2FBQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksR0FBRyxDQUFDLENBQUM7U0FDVjtRQUVELGVBQWU7UUFDZixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQzdCLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDVDtRQUVELGtCQUFrQjtRQUNsQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFHRDs7Ozs7Ozs7T0FRRztJQUNILHlCQUFNLEdBQU4sVUFBTyxNQUFNLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsUUFBUTtRQUN4RCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFHRDs7Ozs7OztPQU9HO0lBQ0gsMkJBQVEsR0FBUixVQUFTLElBQUksRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLElBQUk7UUFDbEMsb0JBQW9CO1FBQ3BCLElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLG9EQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDcEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLEtBQUssQ0FBQztTQUMvQjtRQUVELDhDQUE4QztRQUM5QyxJQUFJLElBQUksS0FBSyxTQUFTLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUN6QixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDNUM7WUFFRCxJQUFJLElBQUksSUFBSSxDQUFDO1lBQ2IsR0FBRyxJQUFJLElBQUksQ0FBQztZQUVaLDBFQUEwRTtZQUMxRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0I7YUFBTTtZQUNMLDZCQUE2QjtZQUM3QixJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUN6QjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtZQUM1QixJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUMxQjthQUFNO1lBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtnQkFDdkIsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO2FBQ25FO2lCQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzthQUMvRDtTQUNGO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO1lBQzVCLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO2dCQUN2QixHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7YUFDbkU7aUJBQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDaEMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQy9EO1NBQ0Y7UUFFRCwyQkFBMkI7UUFDM0IsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pELEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUV0RCx5RUFBeUU7UUFDekUsOERBQThEO1FBQzlELElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxZQUFZLElBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDMUQsVUFBVSxHQUFHLEtBQUssQ0FBQztTQUNwQjtRQUVELHFCQUFxQjtRQUNyQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFHRDs7Ozs7O09BTUc7SUFDSCwyQkFBUSxHQUFSLFVBQVMsSUFBSSxFQUFFLEdBQUcsRUFBRSxVQUFVO1FBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDOUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUUzRSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUdEOzs7O01BSUU7SUFFRjs7T0FFRztJQUNILDhCQUFXLEdBQVgsVUFBWSxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQzdDLElBQUksTUFBTSxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBRTFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1RyxDQUFDO0lBR0Q7O09BRUc7SUFDSCwrQkFBWSxHQUFaLFVBQWEsT0FBTyxFQUFFLFNBQVM7UUFDN0Isa0NBQWtDO1FBQ2xDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7WUFDaEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsR0FBRyxPQUFPLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksU0FBUyxZQUFZLElBQUksRUFBRTtZQUM3QixTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUU7WUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsR0FBRyxTQUFTLENBQUMsQ0FBQztTQUMxRDtRQUVELGtDQUFrQztRQUNsQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDO1FBRW5DLG9CQUFvQjtRQUNwQixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN6QixvREFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUNwQztRQUVELGlCQUFpQjtRQUNqQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsb0RBQVksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQztTQUNwQztRQUVELGlEQUFpRDtRQUNqRCxJQUFJLGdCQUFnQixFQUFFLGVBQWUsQ0FBQztRQUN0QyxJQUFJLGFBQWEsR0FBRyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUN6QyxJQUFJLGFBQWEsRUFBRTtZQUNqQixnQkFBZ0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQ3BDLGVBQWUsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ3BDO2FBQU07WUFDTCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNyRSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckU7UUFFRCwwQkFBMEI7UUFDMUIsSUFBSSxDQUFDLGtCQUFrQixHQUFHLGdCQUFnQixDQUFDO1FBQzNDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUM7UUFFekMsMkJBQTJCO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXpDLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLGdCQUFnQixDQUFDO1FBQ3hDLElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDO1FBRXRDLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUVqQyxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFFckIsc0JBQXNCO1FBQ3RCLElBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxhQUFhLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDakUsSUFBSSxDQUFDLGVBQWUsR0FBRyxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztRQUVqRSxzQkFBc0I7UUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFekIsbUNBQW1DO1FBQ25DLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7UUFFdkMsMkVBQTJFO1FBQzNFLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxhQUFhLENBQUM7UUFFbkMsc0RBQXNEO1FBQ3RELElBQUksQ0FBQyxlQUFlLEdBQUcsYUFBYSxDQUFDO1FBRXJDLDBCQUEwQjtRQUMxQixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBR0Q7OztPQUdHO0lBQ0gsOEJBQVcsR0FBWCxVQUFZLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSztRQUNuQyxrQ0FBa0M7UUFDbEMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLFNBQVMsRUFBRTtZQUNoQyxNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixHQUFHLE9BQU8sQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxTQUFTLFlBQVksSUFBSSxFQUFFO1lBQzdCLFNBQVMsR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDakM7UUFDRCxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNqQyxNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixHQUFHLFNBQVMsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsZ0ZBQWdGO1FBQ2hGLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUVELElBQUksZ0JBQWdCLEVBQUUsZUFBZSxDQUFDO1FBRXRDLGlEQUFpRDtRQUNqRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLGdCQUFnQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JFLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNyRTthQUFNO1lBQ0wsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUNwQyxlQUFlLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztTQUNwQztRQUVELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFakMsbUNBQW1DO1FBQ25DLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQix3QkFBd0I7WUFDeEIsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztZQUNwRCxJQUFJLEtBQUssR0FBRyxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztZQUVsRCw0Q0FBNEM7WUFDNUMsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNuQyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFN0Isb0JBQW9CO1lBQ3BCLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDL0MsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO2dCQUVyQix3REFBd0Q7Z0JBQ3hELEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7Z0JBRXpDLHlDQUF5QztnQkFDekMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUU5RSxpREFBaUQ7Z0JBQ2pELElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtvQkFDdEIsK0NBQStDO29CQUMvQyxJQUFJLG1CQUFtQixHQUFHLGdCQUFnQixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7b0JBQy9ELElBQUksa0JBQWtCLEdBQUcsZUFBZSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBRTVELDZEQUE2RDtvQkFDN0QsVUFBVSxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsR0FBRyxVQUFVLENBQUMsR0FBRyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsbUJBQW1CLENBQUM7b0JBQzNGLFNBQVMsR0FBRyxDQUFDLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLGtCQUFrQixDQUFDO29CQUV2Riw4QkFBOEI7b0JBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDaEM7YUFDRjtZQUVELElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtnQkFDeEIsVUFBVSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztnQkFDbkQsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztnQkFFekMsSUFBSSxVQUFVLEdBQUcsYUFBYSxJQUFJLFVBQVUsR0FBRyxDQUFDLEVBQUU7b0JBQ2hELHlCQUF5QjtvQkFDekIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRTt3QkFDekIsVUFBVSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUMxRDt5QkFBTSxJQUFJLFVBQVUsR0FBRyxhQUFhLEVBQUU7d0JBQ3JDLFVBQVUsR0FBRyxhQUFhLENBQUM7cUJBQzVCO3lCQUFNO3dCQUNMLFVBQVUsR0FBRyxDQUFDLENBQUM7cUJBQ2hCO2lCQUNGO2FBQ0Y7WUFFRCx1Q0FBdUM7WUFDdkMsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO2dCQUN4QixTQUFTLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO2dCQUNsRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO2dCQUV2QyxJQUFJLFNBQVMsR0FBRyxZQUFZLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtvQkFDN0MseUJBQXlCO29CQUN6QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO3dCQUN6QixTQUFTLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQ3pEO3lCQUFNLElBQUksU0FBUyxHQUFHLFlBQVksRUFBRTt3QkFDbkMsU0FBUyxHQUFHLFlBQVksQ0FBQztxQkFDMUI7eUJBQU07d0JBQ0wsU0FBUyxHQUFHLENBQUMsQ0FBQztxQkFDZjtpQkFDRjthQUNGO1lBRUQsNEVBQTRFO1lBQzVFLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7Z0JBQ3pCLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2FBQ3pCO1lBRUQsd0NBQXdDO1lBQ3hDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVqRCx1QkFBdUI7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRTdDLHdFQUF3RTtTQUN6RTthQUFNO1lBQ0wsSUFBSSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUQsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7WUFFL0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNyRSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUVuRSxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsSUFBSSx3QkFBd0IsQ0FBQztZQUN4RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJLFNBQVMsSUFBSSx3QkFBd0IsQ0FBQztZQUV4RixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUUvRCxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksc0JBQXNCLElBQUksU0FBUyxJQUFJLHNCQUFzQixDQUFDLENBQUM7WUFDbkosSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNyQixJQUFJLENBQUMsc0JBQXNCLEdBQUcsS0FBSyxDQUFDO2FBQ3JDO1NBQ0Y7UUFFRCw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxnQkFBZ0IsQ0FBQztRQUN4QyxJQUFJLENBQUMsY0FBYyxHQUFHLGVBQWUsQ0FBQztRQUN0QyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztRQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBR0Q7O09BRUc7SUFDSCw2QkFBVSxHQUFWLFVBQVcsU0FBUztRQUNsQixJQUFJLFNBQVMsWUFBWSxJQUFJLEVBQUU7WUFDN0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQztRQUNELElBQUksT0FBTyxTQUFTLEtBQUssUUFBUSxFQUFFO1lBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLEdBQUcsU0FBUyxDQUFDLENBQUM7U0FDMUQ7UUFFRCw2RUFBNkU7UUFDN0Usc0dBQXNHO1FBQ3RHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLE9BQU87U0FDUjtRQUVELHVGQUF1RjtRQUN2RixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUxQixzRUFBc0U7UUFDdEUsNEVBQTRFO1FBQzVFLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixzQkFBc0I7WUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7WUFFMUIscUJBQXFCO1lBQ3JCLHFFQUFxRTtZQUNyRSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsRUFBRTtnQkFDL0YsK0RBQStEO2dCQUMvRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO2dCQUNqQyxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDO2dCQUV0Qiw4Q0FBOEM7Z0JBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNqRixRQUFRLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO2dCQUVELGdFQUFnRTtnQkFDaEUsNkNBQTZDO2dCQUM3QyxJQUFJLFFBQVEsS0FBSyxNQUFNLEVBQUU7b0JBQ3ZCLHFEQUFxRDtvQkFDckQsSUFBSSxVQUFVLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDekQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUM1RCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRTFELG1FQUFtRTtvQkFDbkUsSUFBSSxDQUFDLHVCQUF1QixHQUFHLFNBQVMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7b0JBQ3BFLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxRQUFRLEdBQUcsVUFBVSxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO29CQUVuRSwwREFBMEQ7b0JBQzFELElBQUksOEJBQThCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUUxRiw0REFBNEQ7b0JBQzVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsR0FBRyw4QkFBOEIsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLDhCQUE4QixFQUFFO3dCQUN0SixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLENBQUM7cUJBQ3JDO2lCQUNGO3FCQUFNO29CQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztpQkFDbEM7YUFDRjtpQkFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxHQUFHLEVBQUU7Z0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUNsQztTQUNGO1FBRUQsd0VBQXdFO1FBQ3hFLHVFQUF1RTtRQUN2RSw0RUFBNEU7UUFDNUUsNEVBQTRFO1FBQzVFLDJFQUEyRTtRQUMzRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksSUFBSSxDQUFDLHNCQUFzQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3BELElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUNsQztZQUNELElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDNUU7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRDs7OztNQUlFO0lBRUY7Ozs7OztPQU1HO0lBQ0gsNEJBQVMsR0FBVCxVQUFVLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVU7UUFDbkMsZ0VBQWdFO1FBQ2hFLGlEQUFpRDtRQUNqRCxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3RDLElBQUksWUFBWSxFQUFFO1lBQ2hCLG9EQUFZLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0IsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDNUI7UUFFRCxJQUFJLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUN4Qyw4REFBOEQ7WUFDOUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxHQUFHLENBQUM7WUFDMUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFFNUIsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNoQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQzlCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7WUFFL0IsSUFBSSxRQUFRLEdBQUcsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUM5QixJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQzNCLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxPQUFPLENBQUM7WUFFOUIsSUFBSSxJQUFJLEdBQUcsVUFBVSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU07Z0JBQ3ZDLElBQUksTUFBTSxFQUFFO29CQUNWLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxHQUFHLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDO29CQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQztvQkFDaEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLEdBQUcsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUM7b0JBRWxELGtCQUFrQjtvQkFDbEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO3dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7cUJBQ3hFO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUViLElBQUksTUFBTSxHQUFHLFVBQVUsRUFBRTtnQkFDdkIsT0FBTyxJQUFJLENBQUMsYUFBYSxLQUFLLEVBQUUsQ0FBQztZQUNuQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWIsSUFBSSxTQUFTLEdBQUcsVUFBVSx1QkFBdUIsRUFBRSxXQUFXLEVBQUUsV0FBVztnQkFDekUsSUFBSSxXQUFXLEtBQUssSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7aUJBQzVCO2dCQUNELElBQUksSUFBSSxDQUFDLHlCQUF5QixJQUFJLFdBQVcsRUFBRTtvQkFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO2lCQUNsQztnQkFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFO29CQUN4QixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztvQkFDMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO3dCQUN2QixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7d0JBQ3RCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO3FCQUM1QjtpQkFDRjtZQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFYixxR0FBcUc7WUFDckcsSUFBSSxDQUFDLGFBQWEsR0FBRyxxREFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBRTNJO2FBQU07WUFDTCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQ2hELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7WUFDN0MsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUUvQyxrQkFBa0I7WUFDbEIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDbEM7WUFFRCx3QkFBd0I7WUFDeEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtnQkFDeEIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7Z0JBQzFCLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztpQkFDNUI7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUdEOztPQUVHO0lBQ0gscUNBQWtCLEdBQWxCLFVBQW1CLFNBQVM7UUFDMUIsSUFBSSxTQUFTLEtBQUssU0FBUyxFQUFFO1lBQzNCLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUYsQ0FBQztJQUlEOzs7O01BSUU7SUFFRjs7O09BR0c7SUFDSCxzQ0FBbUIsR0FBbkIsVUFBb0IsU0FBUztRQUMzQixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0UsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUNyQyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1lBRXZDLG9IQUFvSDtZQUNwSCw2REFBNkQ7WUFDN0QsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFdBQVcsQ0FBQyxHQUFHLFdBQVcsQ0FBQztZQUN0RixJQUFJLENBQUMsMEJBQTBCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLEdBQUcsWUFBWSxDQUFDO1lBQ3RGLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUMsR0FBRyxXQUFXLENBQUM7WUFDckYsSUFBSSxDQUFDLDBCQUEwQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxHQUFHLFlBQVksQ0FBQztTQUN0RjthQUFNO1lBQ0wsSUFBSSxDQUFDLDJCQUEyQixHQUFHLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsMEJBQTBCLEdBQUcsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO1lBQ3hELElBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO1NBQ3ZEO1FBRUQsb0JBQW9CO1FBQ3BCLElBQUksSUFBSSxHQUFHLFVBQVUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNO1lBQ3ZDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWIsaUVBQWlFO1FBQ2pFLElBQUksNkJBQTZCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBRXBFLDhEQUE4RDtRQUM5RCx1R0FBdUc7UUFDdkcsSUFBSSxNQUFNLEdBQUc7WUFDWCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLDZCQUE2QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksNkJBQTZCLENBQUM7WUFDeEssSUFBSSxDQUFDLGNBQWMsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQzthQUN2QztZQUNELE9BQU8sY0FBYyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFYixJQUFJLFNBQVMsR0FBRyxVQUFVLHVCQUF1QixFQUFFLFdBQVcsRUFBRSxXQUFXO1lBQ3pFLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFDOUIsSUFBSSxJQUFJLENBQUMseUJBQXlCLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzthQUNsQztZQUVELHdGQUF3RjtZQUN4RixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFYixxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLHFEQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBR0Q7Ozs7T0FJRztJQUNILDRDQUF5QixHQUF6QixVQUEwQixNQUFNO1FBRTlCLEVBQUU7UUFDRiwrQkFBK0I7UUFDL0IsRUFBRTtRQUVGLHNDQUFzQztRQUN0QyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUNsRSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQztRQUdoRSxFQUFFO1FBQ0YsbURBQW1EO1FBQ25ELEVBQUU7UUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDMUIsSUFBSSxlQUFlLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUN6SCxJQUFJLGVBQWUsS0FBSyxVQUFVLEVBQUU7Z0JBQ2xDLFVBQVUsR0FBRyxlQUFlLENBQUM7Z0JBQzdCLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxDQUFDLENBQUM7YUFDbEM7WUFFRCxJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLFNBQVMsQ0FBQyxFQUFFLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1lBQ3JILElBQUksY0FBYyxLQUFLLFNBQVMsRUFBRTtnQkFDaEMsU0FBUyxHQUFHLGNBQWMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLHVCQUF1QixHQUFHLENBQUMsQ0FBQzthQUNsQztTQUNGO1FBR0QsRUFBRTtRQUNGLHlCQUF5QjtRQUN6QixFQUFFO1FBRUYsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQztZQUMvQixJQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztTQUM5QjtRQUdELEVBQUU7UUFDRixZQUFZO1FBQ1osRUFBRTtRQUVGLHdDQUF3QztRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDeEIsaUVBQWlFO1lBQ2pFLHVFQUF1RTtZQUN2RSxrRUFBa0U7WUFDbEUsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDO1lBRTFCLElBQUksQ0FBQyx1QkFBdUIsSUFBSSxjQUFjLENBQUM7WUFDL0MsSUFBSSxDQUFDLHVCQUF1QixJQUFJLGNBQWMsQ0FBQztTQUNoRDtRQUdELEVBQUU7UUFDRixtQkFBbUI7UUFDbkIsRUFBRTtRQUVGLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7WUFDekIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztZQUV2QixxR0FBcUc7WUFDckcsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDO1lBQ25FLElBQUksdUJBQXVCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQztZQUVuRSxlQUFlO1lBQ2YsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixFQUFFO2dCQUNqRCxjQUFjLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixHQUFHLFVBQVUsQ0FBQzthQUNoRTtpQkFBTSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEVBQUU7Z0JBQ3hELGNBQWMsR0FBRyxJQUFJLENBQUMsMkJBQTJCLEdBQUcsVUFBVSxDQUFDO2FBQ2hFO1lBRUQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixFQUFFO2dCQUMvQyxjQUFjLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixHQUFHLFNBQVMsQ0FBQzthQUM5RDtpQkFBTSxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEVBQUU7Z0JBQ3RELGNBQWMsR0FBRyxJQUFJLENBQUMsMEJBQTBCLEdBQUcsU0FBUyxDQUFDO2FBQzlEO1lBRUQsK0RBQStEO1lBQy9ELElBQUksY0FBYyxLQUFLLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxDQUFDLHVCQUF1QixJQUFJLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztpQkFDMUU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLHVCQUF1QixHQUFHLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztpQkFDekU7YUFDRjtZQUVELElBQUksY0FBYyxLQUFLLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixJQUFJLENBQUMsRUFBRTtvQkFDdEQsSUFBSSxDQUFDLHVCQUF1QixJQUFJLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztpQkFDMUU7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLHVCQUF1QixHQUFHLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQztpQkFDekU7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDOzs7Ozs7OztVQzNtQ0Q7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ05lO0FBQzZCO0FBQ1g7QUFDTTtBQUNBO0FBQ3VDO0FBQ3hCO0FBQ1Q7QUFDRjtBQUNOO0FBQ3dGO0FBQzVGO0FBQ2dCO0FBQ2dDO0FBSWpGLFNBQVM7QUFDRixJQUFNLEVBQUUsR0FBRyxJQUFJLHFEQUFXLEVBQUUsQ0FBQztBQUNwQyxJQUFNLE9BQU8sR0FBRyxJQUFJLG9EQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxvREFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzFDLElBQU0sU0FBUyxHQUFHLElBQUkseURBQVMsRUFBRSxDQUFDO0FBaUNsQztJQUFxQiwwQkFBTztJQTZEMUIsZ0JBQVksRUFLWDtZQUpDLEtBQUs7UUFEUCxZQU1FLGtCQUFNO1lBQ0osS0FBSztZQUNMLEVBQUUsRUFBRSxDQUFDO1NBQ04sQ0FBQyxTQThCSDtRQW5HRDs7V0FFRztRQUNJLGFBQU8sR0FBRyxPQUFPLENBQUM7UUFFekI7O1dBRUc7UUFDSSxtQkFBYSxHQUFvQyxJQUFJLENBQUM7UUFDdEQsZ0JBQVUsR0FBYztZQUM3QixLQUFLLEVBQUUsQ0FBQztZQUNSLE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNLLGNBQVEsR0FBaUI7WUFDOUIsS0FBSyxFQUFFLENBQUM7WUFDUixNQUFNLEVBQUUsQ0FBQztZQUNULENBQUMsRUFBRSxDQUFDO1lBQ0osQ0FBQyxFQUFFLENBQUM7U0FDTCxDQUFDO1FBRUY7O1dBRUc7UUFDSSxtQkFBYSxHQUFHLENBQUMsQ0FBQztRQUN6Qjs7V0FFRztRQUNJLG9CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRTlCOztXQUVHO1FBQ0ksbUJBQWEsR0FHaEI7WUFDQSxLQUFLLEVBQUUsQ0FBQztZQUNSLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQztRQUVHLGlCQUFXLEdBQWlCLEVBQUUsQ0FBQztRQUMvQixjQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsV0FBSyxHQUFVLCtDQUFLLENBQUMsTUFBTSxDQUFDO1FBRW5DOzs7V0FHRztRQUNJLG1CQUFhLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLFlBQU0sR0FBVyxJQUFJLHNEQUFNLEVBQUUsQ0FBQztRQUM5QixnQkFBVSxHQUFHO1lBQ2xCLElBQUksS0FBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Y7aUJBQU0sSUFBSSxLQUFJLENBQUMsYUFBYSxFQUFFO2dCQUM3QixLQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDaEI7UUFDSCxDQUFDLENBQUM7UUE2UUYsa0JBQVksR0FBRyxVQUFDLFNBQWlCO1lBQy9CLE9BQU8sVUFBQyxDQUE4QjtnQkFDcEMsSUFBSSxLQUE2QixDQUFDO2dCQUVsQyxJQUFJLDhEQUFnQixDQUFDLENBQUMsQ0FBQyxFQUFFO29CQUN2QixLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsRjtxQkFBTTtvQkFDTCxLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUNYO2dCQUNELCtGQUErRjtnQkFDL0YsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFO29CQUMxQyxPQUFPO2lCQUNSO2dCQUVELElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFO29CQUNwQixhQUFhO29CQUNiLEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQztpQkFDL0I7Z0JBRUQsSUFBTSxJQUFJLEdBQXlCLEVBQUUsQ0FBQztnQkFDdEMsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUMxRDtnQkFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsQ0FBQztpQkFDakI7Z0JBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFaEMsSUFBSSxTQUFTLEtBQUssWUFBWSxJQUFJLFNBQVMsS0FBSyxVQUFVLEVBQUU7b0JBQzFELEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUNuRDtnQkFFRCxJQUFJLFNBQVMsS0FBSyxVQUFVLElBQUkscURBQU8sQ0FBQyxLQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3ZFLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDL0I7WUFDSCxDQUFDLENBQUM7UUFDSixDQUFDO1FBc0lEOztXQUVHO1FBQ0gsYUFBTyxHQUFHLDREQUFPLENBQUM7UUFDbEIsVUFBSSxHQUFHLDhDQUFJLENBQUM7UUFDWixVQUFJLEdBQUcsOENBQUksQ0FBQztRQUNaLFdBQUssR0FBRywrQ0FBSyxDQUFDO1FBQ2QsZ0JBQVUsR0FBRyxvREFBVSxDQUFDO1FBQ3hCLGdCQUFVLEdBQUcsb0RBQVUsQ0FBQztRQUN4QixZQUFNLEdBQUcsZ0RBQU0sQ0FBQztRQUVoQix1QkFBaUIsR0FBRywwREFBaUIsQ0FBQztRQXRicEMsS0FBSSxDQUFDLGdCQUFnQixHQUFHO1lBQ3RCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFFBQVEsRUFBRSxFQUFFO1lBQ1osUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQztnQkFDM0MsU0FBUyxFQUFFLEtBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO2dCQUN6QyxRQUFRLEVBQUUsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZDLFdBQVcsRUFBRSxLQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQzthQUM5QztTQUNGLENBQUM7UUFFRjs7OztXQUlHO1FBQ0gsS0FBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUU7WUFDakIsS0FBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7UUFFSDs7Ozs7V0FLRztRQUNILHNCQUFzQjtRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFhLEtBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQyxDQUFDOztJQUMzQyxDQUFDO0lBR0Qsc0JBQUksNkJBQVM7UUFEYixTQUFTO2FBQ1Q7WUFDRSxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFM0IsSUFBSSxJQUFJLHdCQUFpQixJQUFJLENBQUMsUUFBUSxPQUFJLENBQUM7WUFFM0MsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDOzs7T0FBQTtJQUVEOzs7Ozs7T0FNRztJQUNILCtCQUFjLEdBQWQsVUFBZSxHQUFpQjtRQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU3QixJQUFJLENBQUMsYUFBYSxHQUFHO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN2QixDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxRQUFnQixFQUFFLEtBQTZCLEVBQUUsa0JBQTRCO1FBQ2hGLFNBQVMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEIsSUFBTSxXQUFXLEdBQUc7WUFDbEIsbUJBQW1CLEVBQUUsRUFBRTtZQUN2QixZQUFZLEVBQUUsTUFBTTtZQUNwQixZQUFZLEVBQUUsT0FBTztZQUNyQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLHNCQUFzQixFQUFFLElBQUk7WUFDNUIsY0FBYyxFQUFFLEtBQUs7WUFDckIsbUJBQW1CLEVBQUUsS0FBSztZQUMxQixVQUFVLEVBQUUsSUFBSTtZQUNoQixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLG9CQUFvQixFQUFFLElBQUk7U0FDM0IsQ0FBQztRQUVGLElBQUksa0JBQWtCLElBQUksT0FBTyxrQkFBa0IsS0FBSyxVQUFVLEVBQUU7WUFDbEUsYUFBYTtZQUNiLFdBQVcsQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztTQUNyRDtRQUVELFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDakMsbUJBQW1CO1FBQ25CLElBQU0sT0FBTyxHQUFHLGtFQUFZLENBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUMxRCx1QkFBdUI7UUFDdkIsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUUvQixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXBDLFlBQVk7UUFDWixTQUFTLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDbkMsSUFBTSxVQUFVLEdBQUcsK0NBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNyRCxTQUFTLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyQixJQUFJLENBQUMsS0FBSyxHQUFHLCtDQUFLLENBQUMsTUFBTSxDQUFDO1FBRTFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVwQixTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCx1QkFBTSxHQUFOLFVBQU8sT0FBZTtRQUFmLHlDQUFlO1FBQ3BCLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDWixTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDbkI7UUFFRCxTQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ2pDOzs7O1dBSUc7UUFDSCxTQUFTLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN2QyxpREFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRS9CLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakMsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUyxFQUFFO1lBQzNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztTQUNqRjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDL0M7UUFFRCxvQkFBb0I7UUFDcEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QywyREFBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JCLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVoQyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1FBRWpFLHlEQUFXLENBQUMsSUFBSSxDQUFDLGFBQXlDLENBQUMsQ0FBQztRQUU1RCx3QkFBd0I7UUFDeEIsU0FBUyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QywyREFBYyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGFBQXlDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDckYsU0FBUyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWhDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLFNBQVMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFckIsMkNBQTJDO1FBQzNDLDRCQUE0QjtRQUM1QixNQUFNO1FBRU4sU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7T0FhRztJQUNILGFBQWE7SUFDYix1QkFBTSxHQUFOLFVBQU8sT0FBaUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLENBQUM7UUFFN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDeEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFDO1NBQ3hGO1FBRUQsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUxQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxCLFNBQVMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRWxCLFNBQVMsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckQsd0RBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFPLElBQUksY0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQTlCLENBQThCLENBQUMsQ0FBQztRQUN6RSxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLEtBQUssR0FBRywrQ0FBSyxDQUFDLFFBQVEsQ0FBQztRQUU1QixTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVEOztPQUVHO0lBQ0gsd0JBQU8sR0FBUDtRQUNFLHlEQUFXLENBQUMsSUFBSSxDQUFDLGFBQXlDLENBQUMsQ0FBQztRQUU1RCxJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztRQUMzQiw0REFBZSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQ7O09BRUc7SUFDSCx1Q0FBc0IsR0FBdEIsVUFBdUIsT0FBZ0I7UUFDL0IsU0FBbUMsSUFBSSxFQUFyQyxhQUFhLHFCQUFFLGFBQWEsbUJBQVMsQ0FBQztRQUN4QyxTQUtGLE9BQU8sQ0FBQyxTQUFTLEVBSm5CLFNBQVMsaUJBQ1QsU0FBUyxpQkFDVCxLQUFLLGFBQ0wsTUFBTSxZQUNhLENBQUM7UUFFdEIsSUFBTSxLQUFLLEdBQUcsU0FBUyxHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzlELElBQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxhQUFhLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUM5RCxJQUFNLFNBQVMsR0FBRyxLQUFLLEdBQUcsYUFBYSxDQUFDO1FBQ3hDLElBQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxhQUFhLENBQUM7UUFFMUMsT0FBTyxJQUFJLHFEQUFJLENBQ2IsS0FBSyxFQUNMLEtBQUssRUFDTCxTQUFTLEVBQ1QsVUFBVSxDQUNYLENBQUM7SUFDSixDQUFDO0lBRUQsOEJBQWEsR0FBYixVQUFjLElBQXNCLEVBQUUsQ0FBUyxFQUFFLENBQVMsRUFBRSxRQUE4QjtRQUExRixpQkF3QkM7UUF2QkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHO1lBQ2xCLFNBS0YsR0FBRyxDQUFDLFNBQVMsRUFKZixTQUFTLGlCQUNULFNBQVMsaUJBQ1QsS0FBSyxhQUNMLE1BQU0sWUFDUyxDQUFDO1lBQ2xCLElBQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3hFLElBQU0sS0FBSyxHQUFHLFNBQVMsR0FBRyxLQUFJLENBQUMsYUFBYSxHQUFHLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3hFLElBQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDO1lBQzdDLElBQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDO1lBRS9DLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDLEVBQUU7Z0JBQ3JGOzs7bUJBR0c7Z0JBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRTtvQkFDdkIsS0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDekM7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQTJDRDs7T0FFRztJQUNILDJCQUFVLEdBQVY7UUFDRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUU7WUFDdEMsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFFMUMsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7WUFDaEMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzlELEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUM1RCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTCxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQ2pFLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDaEUsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztZQUM3RCxRQUFRLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO1NBQ3BFO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsNkJBQVksR0FBWjtRQUNFLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO1lBQ2hDLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvRCxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDN0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNELEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNsRTthQUFNO1lBQ0wsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDNUIsUUFBUSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDNUIsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDMUIsUUFBUSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztJQUM3QyxDQUFDO0lBRUQscUJBQUksR0FBSixVQUFLLEtBQWEsRUFBRSxJQUFTO1FBQzNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxtQkFBRSxHQUFGLFVBQUcsS0FBYSxFQUFFLFFBQWtCO1FBQ2xDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxxQkFBSSxHQUFKLFVBQUssS0FBYSxFQUFFLFFBQWtCO1FBQ3BDLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRCxvQkFBRyxHQUFILFVBQUksS0FBYSxFQUFFLFFBQWtCO1FBQ25DLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCwyQkFBVSxHQUFWLFVBQVcsSUFBc0I7UUFBakMsaUJBVUM7UUFSRyxZQUFRLEdBQ04sSUFBSSxTQURFLENBQ0Q7UUFFVCxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUNyQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDaEIsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILHNCQUFLLEdBQUwsVUFBTSxPQUF3QztRQUF4QyxzQ0FBd0M7UUFDcEMsU0FBd0IsT0FBTyxhQUFaLEVBQW5CLFlBQVksbUJBQUcsSUFBSSxNQUFhO1FBRXhDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLDJCQUEyQjtRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLCtDQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLHlEQUFXLENBQUMsSUFBSSxDQUFDLGFBQXlDLENBQUMsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFcEIsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELDBCQUFTLEdBQVQ7UUFDRSxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVEOztPQUVHO0lBQ0gseUJBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUViLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gseUJBQVEsR0FBUixVQUFTLEdBQWtCO1FBQWxCLDhCQUFrQjtRQUN6QixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFHLElBQUksb0VBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsRUFBbEMsQ0FBa0MsQ0FBQyxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVEOztPQUVHO0lBQ0gsaUNBQWdCLEdBQWhCLFVBQWlCLElBQVksRUFBRSxHQUFXLEVBQUUsTUFBYztRQUN4RCxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN6QixJQUFNLElBQUksR0FBRyxJQUFJLDBEQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM1QixVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsMEJBQVMsR0FBVCxVQUFVLE9BQWdCLEVBQUUsSUFBVztRQUFYLGtDQUFXO1FBQ3JDLE9BQU8sa0RBQUssQ0FBUyxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFnQkQ7O09BRUc7SUFDSCxvQkFBRyxHQUFILFVBQUksTUFBdUI7UUFBRSxpQkFBaUI7YUFBakIsVUFBaUIsRUFBakIscUJBQWlCLEVBQWpCLElBQWlCO1lBQWpCLGdDQUFpQjs7UUFDNUMsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzVDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNqQyxPQUFPO1NBQ1I7UUFFRCxNQUFNLENBQUMsT0FBTyxPQUFkLE1BQU0saUJBQVMsSUFBSSxHQUFLLE9BQU8sVUFBRTtRQUNqQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXJDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWUsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLHdCQUFNLENBQUM7SUFDckQsQ0FBQztJQUVEOztPQUVHO0lBQ0gsc0JBQUssR0FBTCxVQUFNLE1BQXVCO1FBQUUsaUJBQWlCO2FBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQixnQ0FBaUI7O1FBQzlDLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUQsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQzlDLE9BQU87U0FDUjtRQUVELElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNwQixNQUFNLENBQUMsU0FBUyxPQUFoQixNQUFNLGlCQUFXLElBQUksR0FBSyxPQUFPLFVBQUU7U0FDcEM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFlLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSx3QkFBTSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFqQ2MsdUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztJQWtDMUQsYUFBQztDQUFBLENBbGlCb0IsNERBQU8sR0FraUIzQjtBQUVELGlFQUFlLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2VsZW1lbnRzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbWFnZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbHZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy90ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy92aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvZW52LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvbm9kZTJqc29uLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbE5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxzdHIyeG1sbm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kIGZvciByZWZlcmVuY2Vcbi8vXG4vLyBUaGlzIGZpbGUgdXNlcyB0aGUgZm9sbG93aW5nIHNwZWNpZmljIFVNRCBpbXBsZW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QuY29tcHV0ZUxheW91dCA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG52YXIgY29tcHV0ZUxheW91dCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ1NTX1VOREVGSU5FRDtcblxuICB2YXIgQ1NTX0RJUkVDVElPTl9JTkhFUklUID0gJ2luaGVyaXQnO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9MVFIgPSAnbHRyJztcbiAgdmFyIENTU19ESVJFQ1RJT05fUlRMID0gJ3J0bCc7XG5cbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1cgPSAncm93JztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSA9ICdyb3ctcmV2ZXJzZSc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OID0gJ2NvbHVtbic7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UgPSAnY29sdW1uLXJldmVyc2UnO1xuXG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0pVU1RJRllfQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOID0gJ3NwYWNlLWJldHdlZW4nO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EID0gJ3NwYWNlLWFyb3VuZCc7XG5cbiAgdmFyIENTU19BTElHTl9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0FMSUdOX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19BTElHTl9TVFJFVENIID0gJ3N0cmV0Y2gnO1xuXG4gIHZhciBDU1NfUE9TSVRJT05fUkVMQVRJVkUgPSAncmVsYXRpdmUnO1xuICB2YXIgQ1NTX1BPU0lUSU9OX0FCU09MVVRFID0gJ2Fic29sdXRlJztcblxuICB2YXIgbGVhZGluZyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciB0cmFpbGluZyA9IHtcbiAgICAncm93JzogJ3JpZ2h0JyxcbiAgICAncm93LXJldmVyc2UnOiAnbGVmdCcsXG4gICAgJ2NvbHVtbic6ICdib3R0b20nLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICd0b3AnXG4gIH07XG4gIHZhciBwb3MgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgZGltID0ge1xuICAgICdyb3cnOiAnd2lkdGgnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICd3aWR0aCcsXG4gICAgJ2NvbHVtbic6ICdoZWlnaHQnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdoZWlnaHQnXG4gIH07XG5cbiAgLy8gV2hlbiB0cmFuc3BpbGVkIHRvIEphdmEgLyBDIHRoZSBub2RlIHR5cGUgaGFzIGxheW91dCwgY2hpbGRyZW4gYW5kIHN0eWxlXG4gIC8vIHByb3BlcnRpZXMuIEZvciB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGVzZSBwcm9wZXJ0aWVzXG4gIC8vIGlmIHRoZXkgZG9uJ3QgYWxyZWFkeSBleGlzdC5cbiAgZnVuY3Rpb24gZmlsbE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUubGF5b3V0IHx8IG5vZGUuaXNEaXJ0eSkge1xuICAgICAgbm9kZS5sYXlvdXQgPSB7XG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLnN0eWxlKSB7XG4gICAgICBub2RlLnN0eWxlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmaWxsTm9kZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm93RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbkVuZCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5FbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdTdGFydCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ0VuZCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ0VuZCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSArXG4gICAgICAgIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEp1c3RpZnlDb250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmFsaWduQ29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25Db250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnN0eWxlLmFsaWduU2VsZikge1xuICAgICAgcmV0dXJuIGNoaWxkLnN0eWxlLmFsaWduU2VsZjtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25JdGVtcykge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25JdGVtcztcbiAgICB9XG4gICAgcmV0dXJuICdzdHJldGNoJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVBeGlzKGF4aXMsIGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fUlRMKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVykge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbikge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgaWYgKG5vZGUuc3R5bGUuZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gQ1NTX0RJUkVDVElPTl9JTkhFUklUO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fSU5IRVJJVCkge1xuICAgICAgZGlyZWN0aW9uID0gKHBhcmVudERpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gQ1NTX0RJUkVDVElPTl9MVFIgOiBwYXJlbnREaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGbGV4RGlyZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENyb3NzRmxleERpcmVjdGlvbihmbGV4RGlyZWN0aW9uLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvblR5cGUobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLnBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuICdyZWxhdGl2ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXgobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRQb3NpdGlvblR5cGUobm9kZSkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgbm9kZS5zdHlsZS5mbGV4ID4gMFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXhXcmFwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4V3JhcCA9PT0gJ3dyYXAnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGltV2l0aE1hcmdpbihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gKyBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZVtkaW1bYXhpc11dID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Bvc0RlZmluZWQobm9kZSwgcG9zKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZWFzdXJlRGVmaW5lZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUubWVhc3VyZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24obm9kZSwgcG9zKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvdW5kQXhpcyhub2RlLCBheGlzLCB2YWx1ZSkge1xuICAgIHZhciBtaW4gPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5taW5IZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbkhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgbWF4ID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWF4SGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhIZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIGJvdW5kVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgbWF4ID49IDAgJiYgYm91bmRWYWx1ZSA+IG1heCkge1xuICAgICAgYm91bmRWYWx1ZSA9IG1heDtcbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkICYmIG1pbiA+PSAwICYmIGJvdW5kVmFsdWUgPCBtaW4pIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtaW47XG4gICAgfVxuICAgIHJldHVybiBib3VuZFZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm1heGYoYSwgYikge1xuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzcGVjaWZpY2FsbHkgc2V0cyBhIHZhbHVlIGZvciB3aWR0aCBvciBoZWlnaHRcbiAgZnVuY3Rpb24gc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGF4aXMpIHtcbiAgICAvLyBUaGUgcGFyZW50IGFscmVhZHkgY29tcHV0ZWQgdXMgYSB3aWR0aCBvciBoZWlnaHQuIFdlIGp1c3Qgc2tpcCBpdFxuICAgIGlmIChub2RlLmxheW91dFtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV2Ugb25seSBydW4gaWYgdGhlcmUncyBhIHdpZHRoIG9yIGhlaWdodCBkZWZpbmVkXG4gICAgaWYgKCFpc0RpbURlZmluZWQobm9kZSwgYXhpcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGltZW5zaW9ucyBjYW4gbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJcbiAgICBub2RlLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICBib3VuZEF4aXMobm9kZSwgYXhpcywgbm9kZS5zdHlsZVtkaW1bYXhpc11dKSxcbiAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGF4aXMpIHtcbiAgICBjaGlsZC5sYXlvdXRbdHJhaWxpbmdbYXhpc11dID0gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dIC0gY2hpbGQubGF5b3V0W3Bvc1theGlzXV07XG4gIH1cblxuICAvLyBJZiBib3RoIGxlZnQgYW5kIHJpZ2h0IGFyZSBkZWZpbmVkLCB0aGVuIHVzZSBsZWZ0LiBPdGhlcndpc2UgcmV0dXJuXG4gIC8vICtsZWZ0IG9yIC1yaWdodCBkZXBlbmRpbmcgb24gd2hpY2ggaXMgZGVmaW5lZC5cbiAgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbbGVhZGluZ1theGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGdldFBvc2l0aW9uKG5vZGUsIGxlYWRpbmdbYXhpc10pO1xuICAgIH1cbiAgICByZXR1cm4gLWdldFBvc2l0aW9uKG5vZGUsIHRyYWlsaW5nW2F4aXNdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCAvKmNzc19kaXJlY3Rpb25fdCovcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyLypjc3NfZGlyZWN0aW9uX3QqLyBkaXJlY3Rpb24gPSByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIG1haW5BeGlzID0gcmVzb2x2ZUF4aXMoZ2V0RmxleERpcmVjdGlvbihub2RlKSwgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gY3Jvc3NBeGlzID0gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKG1haW5BeGlzLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyByZXNvbHZlZFJvd0F4aXMgPSByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuXG4gICAgLy8gSGFuZGxlIHdpZHRoIGFuZCBoZWlnaHQgc3R5bGUgYXR0cmlidXRlc1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBtYWluQXhpcyk7XG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBTZXQgdGhlIHJlc29sdmVkIHJlc29sdXRpb24gaW4gdGhlIG5vZGUncyBsYXlvdXRcbiAgICBub2RlLmxheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgc2V0IGJ5IHRoZSBwYXJlbnQsIGJ1dCB3ZSBuZWVkIHRvIGNvbXBsZXRlIGl0IHdpdGggYVxuICAgIC8vIGRlbHRhIGNvbXBvc2VkIG9mIHRoZSBtYXJnaW4gYW5kIGxlZnQvdG9wL3JpZ2h0L2JvdHRvbVxuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbbWFpbkF4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1ttYWluQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFtsZWFkaW5nW2Nyb3NzQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBJbmxpbmUgaW1tdXRhYmxlIHZhbHVlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZSB0byBhdm9pZCBleGNlc3NpdmUgbWV0aG9kXG4gICAgLy8gaW52b2NhdGlvbnMgZHVyaW5nIHRoZSBsYXlvdXQgY2FsY3VsYXRpb24uXG4gICAgdmFyLyppbnQqLyBjaGlsZENvdW50ID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3cgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuXG4gICAgaWYgKGlzTWVhc3VyZURlZmluZWQobm9kZSkpIHtcbiAgICAgIHZhci8qYm9vbCovIGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSk7XG5cbiAgICAgIHZhci8qZmxvYXQqLyB3aWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLnN0eWxlLndpZHRoO1xuICAgICAgfSBlbHNlIGlmIChpc1Jlc29sdmVkUm93RGltRGVmaW5lZCkge1xuICAgICAgICB3aWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoIC09IHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBnaXZlIGEgZGltZW5zaW9uIGZvciB0aGUgdGV4dCBpZiB3ZSBoYXZlbid0IGdvdCBhbnlcbiAgICAgIC8vIGZvciBpdCBjb21wdXRlZCB5ZXQuIEl0IGNhbiBlaXRoZXIgYmUgZnJvbSB0aGUgc3R5bGUgYXR0cmlidXRlIG9yIGJlY2F1c2VcbiAgICAgIC8vIHRoZSBlbGVtZW50IGlzIGZsZXhpYmxlLlxuICAgICAgdmFyLypib29sKi8gaXNSb3dVbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykgJiYgIWlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkO1xuICAgICAgdmFyLypib29sKi8gaXNDb2x1bW5VbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pICYmXG4gICAgICAgIGlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OXV0pO1xuXG4gICAgICAvLyBMZXQncyBub3QgbWVhc3VyZSB0aGUgdGV4dCBpZiB3ZSBhbHJlYWR5IGtub3cgYm90aCBkaW1lbnNpb25zXG4gICAgICBpZiAoaXNSb3dVbmRlZmluZWQgfHwgaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgdmFyLypjc3NfZGltX3QqLyBtZWFzdXJlRGltID0gbm9kZS5zdHlsZS5tZWFzdXJlKFxuICAgICAgICAgIC8qKGMpIW5vZGUtPmNvbnRleHQsKi9cbiAgICAgICAgICAvKihqYXZhKSFsYXlvdXRDb250ZXh0Lm1lYXN1cmVPdXRwdXQsKi9cbiAgICAgICAgICB3aWR0aFxuICAgICAgICApO1xuICAgICAgICBpZiAoaXNSb3dVbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC53aWR0aCA9IG1lYXN1cmVEaW0ud2lkdGggK1xuICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBtZWFzdXJlRGltLmhlaWdodCArXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIGlzTm9kZUZsZXhXcmFwID0gaXNGbGV4V3JhcChub2RlKTtcblxuICAgIHZhci8qY3NzX2p1c3RpZnlfdCovIGp1c3RpZnlDb250ZW50ID0gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSk7XG5cbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIHZhci8qYm9vbCovIGlzTWFpbkRpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzQ3Jvc3NEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNNYWluUm93RGlyZWN0aW9uID0gaXNSb3dEaXJlY3Rpb24obWFpbkF4aXMpO1xuXG4gICAgdmFyLyppbnQqLyBpO1xuICAgIHZhci8qaW50Ki8gaWk7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGNoaWxkO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBheGlzO1xuXG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcblxuICAgIHZhci8qZmxvYXQqLyBkZWZpbmVkTWFpbkRpbSA9IENTU19VTkRFRklORUQ7XG4gICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIGRlZmluZWRNYWluRGltID0gbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gLSBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW47XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBleGVjdXRlIHRoZSBuZXh0IHR3byBsb29wcyBvbmUgcGVyIGxpbmUgd2l0aCBmbGV4LXdyYXBcbiAgICB2YXIvKmludCovIHN0YXJ0TGluZSA9IDA7XG4gICAgdmFyLyppbnQqLyBlbmRMaW5lID0gMDtcbiAgICAvLyB2YXIvKmludCovIG5leHRPZmZzZXQgPSAwO1xuICAgIHZhci8qaW50Ki8gYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgLy8gV2UgYWdncmVnYXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZSBjb250YWluZXIgaW4gdGhvc2UgdHdvIHZhcmlhYmxlc1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc0Nyb3NzRGltID0gMDtcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNNYWluRGltID0gMDtcbiAgICB2YXIvKmludCovIGxpbmVzQ291bnQgPSAwO1xuICAgIHdoaWxlIChlbmRMaW5lIDwgY2hpbGRDb3VudCkge1xuICAgICAgLy8gPExvb3AgQT4gTGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgY291bnQgY2hpbGRyZW4gYnkgdHlwZVxuXG4gICAgICAvLyBtYWluQ29udGVudERpbSBpcyBhY2N1bXVsYXRpb24gb2YgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbiBvZiBhbGwgdGhlXG4gICAgICAvLyBub24gZmxleGlibGUgY2hpbGRyZW4uIFRoaXMgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGVpdGhlciBzZXQgdGhlXG4gICAgICAvLyBkaW1lbnNpb25zIG9mIHRoZSBub2RlIGlmIG5vbmUgYWxyZWFkeSBleGlzdCwgb3IgdG8gY29tcHV0ZSB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZSBsZWZ0IGZvciB0aGUgZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkNvbnRlbnREaW0gPSAwO1xuXG4gICAgICAvLyBUaGVyZSBhcmUgdGhyZWUga2luZCBvZiBjaGlsZHJlbiwgbm9uIGZsZXhpYmxlLCBmbGV4aWJsZSBhbmQgYWJzb2x1dGUuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGhlcmUgYXJlIGluIG9yZGVyIHRvIGRpc3RyaWJ1dGUgdGhlIHNwYWNlLlxuICAgICAgdmFyLyppbnQqLyBmbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIHRvdGFsRmxleGlibGUgPSAwO1xuICAgICAgdmFyLyppbnQqLyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuXG4gICAgICAvLyBVc2UgdGhlIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgbWFpbiBheGlzIGZvciBhcyBsb25nXG4gICAgICAvLyBhcyB0aGV5IGFyZSB1c2luZyBhIHNpbXBsZSBzdGFja2luZyBiZWhhdmlvdXIuIENoaWxkcmVuIHRoYXQgYXJlXG4gICAgICAvLyBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3Agd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpblxuICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrTWFpbiA9XG4gICAgICAgICAgKGlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgKCFpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9DRU5URVIpO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhNYWluID0gKGlzU2ltcGxlU3RhY2tNYWluID8gY2hpbGRDb3VudCA6IHN0YXJ0TGluZSk7XG5cbiAgICAgIC8vIFVzZSB0aGUgaW5pdGlhbCBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIGNyb3NzIGF4aXMgZm9yXG4gICAgICAvLyBhcyBsb25nIGFzIHRoZXkgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCB3aXRoIGFsaWdubWVudCBTVFJFVENIIG9yXG4gICAgICAvLyBGTEVYX1NUQVJULiBDaGlsZHJlbiB0aGF0IGFyZSBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3BcbiAgICAgIC8vIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW4gaW4gPExvb3AgRD4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSB0cnVlO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhDcm9zcyA9IGNoaWxkQ291bnQ7XG5cbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluO1xuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltID0gMDtcblxuICAgICAgdmFyLypmbG9hdCovIG1heFdpZHRoO1xuICAgICAgZm9yIChpID0gc3RhcnRMaW5lOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgY2hpbGQubGluZUluZGV4ID0gbGluZXNDb3VudDtcblxuICAgICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuXG4gICAgICAgIC8vIFByZS1maWxsIGNyb3NzIGF4aXMgZGltZW5zaW9ucyB3aGVuIHRoZSBjaGlsZCBpcyB1c2luZyBzdHJldGNoIGJlZm9yZVxuICAgICAgICAvLyB3ZSBjYWxsIHRoZSByZWN1cnNpdmUgbGF5b3V0IHBhc3NcbiAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiZcbiAgICAgICAgICAgIGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgICAgICAgaXNDcm9zc0RpbURlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGNyb3NzQXhpcykpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUpIHtcbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNoaWxkcmVuXG4gICAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RBYnNvbHV0ZUNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aFxuICAgICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSxcbiAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBheGlzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhci8qZmxvYXQqLyBuZXh0Q29udGVudERpbSA9IDA7XG5cbiAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBjb25zaWRlciBhIGNoaWxkIGZsZXhpYmxlIGlmIHdlIGhhdmUgYSBjb21wdXRlZFxuICAgICAgICAvLyBkaW1lbnNpb24gZm9yIHRoZSBub2RlLlxuICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCAmJiBpc0ZsZXgoY2hpbGQpKSB7XG4gICAgICAgICAgZmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgdG90YWxGbGV4aWJsZSArPSBjaGlsZC5zdHlsZS5mbGV4O1xuXG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGZsZXhpYmxlIGNoaWxkcmVuIHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RGbGV4Q2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBrbm93IGl0cyBleGFjdCBzaXplIHlldCwgd2UgYWxyZWFkeSBrbm93IHRoZSBwYWRkaW5nLFxuICAgICAgICAgIC8vIGJvcmRlciBhbmQgbWFyZ2luLiBXZSdsbCB1c2UgdGhpcyBwYXJ0aWFsIGluZm9ybWF0aW9uLCB3aGljaCByZXByZXNlbnRzXG4gICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNpemUgZm9yIHRoZSBjaGlsZCwgdG8gY29tcHV0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAgICAgLy8gYXZhaWxhYmxlIHNwYWNlLlxuICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBtYWluQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBtYWluIHJlY3Vyc2l2ZSBjYWxsLiBXZSBsYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgICAgIGlmIChhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID09PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFic29sdXRlIHBvc2l0aW9uZWQgZWxlbWVudHMgZG8gbm90IHRha2UgcGFydCBvZiB0aGUgbGF5b3V0LCBzbyB3ZVxuICAgICAgICAgIC8vIGRvbid0IHVzZSB0aGVtIHRvIGNvbXB1dGUgbWFpbkNvbnRlbnREaW1cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBhbmQgbWFyZ2luIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGVsZW1lbnQgd2UgYXJlIGFib3V0IHRvIGFkZCB3b3VsZCBtYWtlIHVzIGdvIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgICAgaWYgKGlzTm9kZUZsZXhXcmFwICYmXG4gICAgICAgICAgICBpc01haW5EaW1EZWZpbmVkICYmXG4gICAgICAgICAgICBtYWluQ29udGVudERpbSArIG5leHRDb250ZW50RGltID4gZGVmaW5lZE1haW5EaW0gJiZcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZWxlbWVudCwgdGhlbiBpdCdzIGJpZ2dlciB0aGFuIHRoZSBjb250ZW50XG4gICAgICAgICAgICAvLyBhbmQgbmVlZHMgaXRzIG93biBsaW5lXG4gICAgICAgICAgICBpICE9PSBzdGFydExpbmUpIHtcbiAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQtLTtcbiAgICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBtYWluIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4gJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHwgaXNGbGV4KGNoaWxkKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrTWFpbiA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleE1haW4gPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIGNyb3NzIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEQ+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8XG4gICAgICAgICAgICAgICAgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiYgYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAgICAgICBpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhDcm9zcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4pIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1haW5EaW0gKz0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgICAgIG1haW5Db250ZW50RGltICs9IG5leHRDb250ZW50RGltO1xuICAgICAgICBlbmRMaW5lID0gaSArIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEI+IExheW91dCBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgYWxsb2NhdGUgZW1wdHkgc3BhY2VcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gcG9zaXRpb24gdGhlIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMsIHdlIGhhdmUgdHdvXG4gICAgICAvLyBjb250cm9scy4gVGhlIHNwYWNlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIGFuZCB0aGUgc3BhY2UgYmV0d2VlbiBlYWNoIHR3byBlbGVtZW50cy5cbiAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nTWFpbkRpbSA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gYmV0d2Vlbk1haW5EaW0gPSAwO1xuXG4gICAgICAvLyBUaGUgcmVtYWluaW5nIGF2YWlsYWJsZSBzcGFjZSB0aGF0IG5lZWRzIHRvIGJlIGFsbG9jYXRlZFxuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ01haW5EaW0gPSAwO1xuICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGRlZmluZWRNYWluRGltIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYobWFpbkNvbnRlbnREaW0sIDApIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBmbGV4aWJsZSBjaGlsZHJlbiBpbiB0aGUgbWl4LCB0aGV5IGFyZSBnb2luZyB0byBmaWxsIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlXG4gICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICE9PSAwKSB7XG4gICAgICAgIHZhci8qZmxvYXQqLyBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJhc2VNYWluRGltO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYm91bmRNYWluRGltO1xuXG4gICAgICAgIC8vIElmIHRoZSBmbGV4IHNoYXJlIG9mIHJlbWFpbmluZyBzcGFjZSBkb2Vzbid0IG1lZXQgbWluL21heCBib3VuZHMsXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGNoaWxkIGZyb20gZmxleCBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICBiYXNlTWFpbkRpbSA9IGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBib3VuZE1haW5EaW0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsIGJhc2VNYWluRGltKTtcblxuICAgICAgICAgIGlmIChiYXNlTWFpbkRpbSAhPT0gYm91bmRNYWluRGltKSB7XG4gICAgICAgICAgICByZW1haW5pbmdNYWluRGltIC09IGJvdW5kTWFpbkRpbTtcbiAgICAgICAgICAgIHRvdGFsRmxleGlibGUgLT0gY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG5cbiAgICAgICAgLy8gVGhlIG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBjYW4gb3ZlcmZsb3cgdGhlIGNvbnRhaW5lciwgaW4gdGhpcyBjYXNlXG4gICAgICAgIC8vIHdlIHNob3VsZCBqdXN0IGFzc3VtZSB0aGF0IHRoZXJlIGlzIG5vIHNwYWNlIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGZsZXhpYmxlTWFpbkRpbSA8IDApIHtcbiAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbWFpblxuICAgICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubGF5b3V0W2RpbVttYWluQXhpc11dID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLFxuICAgICAgICAgICAgZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIHJlY3Vyc2l2ZWx5IGNhbGwgdGhlIGxheW91dCBhbGdvcml0aG0gZm9yIHRoaXMgY2hpbGRcbiAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY3VycmVudEZsZXhDaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICBjaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UganVzdGlmeUNvbnRlbnQgdG8gZmlndXJlIG91dCBob3cgdG8gYWxsb2NhdGUgdGhlIHJlbWFpbmluZ1xuICAgICAgLy8gc3BhY2UgYXZhaWxhYmxlXG4gICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB7XG4gICAgICAgIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfQ0VOVEVSKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9FTkQpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW07XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4pIHtcbiAgICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYocmVtYWluaW5nTWFpbkRpbSwgMCk7XG4gICAgICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEgIT09IDApIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EKSB7XG4gICAgICAgICAgLy8gU3BhY2Ugb24gdGhlIGVkZ2VzIGlzIGhhbGYgb2YgdGhlIHNwYWNlIGJldHdlZW4gZWxlbWVudHNcbiAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCk7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSBiZXR3ZWVuTWFpbkRpbSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQz4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcyBhbmQgY29tcHV0ZSBkaW1lbnNpb25zXG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIGFsbCB0aGUgY2hpbGRyZW4gaGF2ZSB0aGVpciBkaW1lbnNpb25zIHNldC4gV2UgbmVlZCB0b1xuICAgICAgLy8gZmluZCB0aGVpciBwb3NpdGlvbi4gSW4gb3JkZXIgdG8gZG8gdGhhdCwgd2UgYWNjdW11bGF0ZSBkYXRhIGluXG4gICAgICAvLyB2YXJpYWJsZXMgdGhhdCBhcmUgYWxzbyB1c2VmdWwgdG8gY29tcHV0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGVcbiAgICAgIC8vIGNvbnRhaW5lciFcbiAgICAgIG1haW5EaW0gKz0gbGVhZGluZ01haW5EaW07XG5cbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleE1haW47IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgYW5kIGhhcyBsZWZ0L3RvcCBiZWluZ1xuICAgICAgICAgIC8vIGRlZmluZWQsIHdlIG92ZXJyaWRlIHRoZSBwb3NpdGlvbiB0byB3aGF0ZXZlciB0aGUgdXNlciBzYWlkXG4gICAgICAgICAgLy8gKGFuZCBtYXJnaW4vYm9yZGVyKS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgKHdpdGhvdXQgdG9wL2xlZnQpIG9yIHJlbGF0aXZlLFxuICAgICAgICAgIC8vIHdlIHB1dCBpdCBhdCB0aGUgY3VycmVudCBhY2N1bXVsYXRlZCBvZmZzZXQuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UgcGxhY2VkIHRoZSBlbGVtZW50LCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFyaWFibGVzXG4gICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGRvIHRoYXQgZm9yIHJlbGF0aXZlIGVsZW1lbnRzLiBBYnNvbHV0ZSBlbGVtZW50c1xuICAgICAgICAgIC8vIGRvIG5vdCB0YWtlIHBhcnQgaW4gdGhhdCBwaGFzZS5cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvLyBUaGUgbWFpbiBkaW1lbnNpb24gaXMgdGhlIHN1bSBvZiBhbGwgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBwbHVzXG4gICAgICAgICAgICAvLyB0aGUgc3BhY2luZy5cbiAgICAgICAgICAgIG1haW5EaW0gKz0gYmV0d2Vlbk1haW5EaW0gKyBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgICAvLyBUaGUgY3Jvc3MgZGltZW5zaW9uIGlzIHRoZSBtYXggb2YgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBzaW5jZSB0aGVyZVxuICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIGVsZW1lbnQgaW4gdGhhdCBjcm9zcyBkaW1lbnNpb24uXG4gICAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmZsb2F0Ki8gY29udGFpbmVyQ3Jvc3NBeGlzID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICBjb250YWluZXJDcm9zc0F4aXMgPSBmbWF4ZihcbiAgICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGNyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBEPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4Q3Jvc3M7IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIGFic29sdXRlbHkgcG9zaXRpb25uZWQgYW5kIGhhcyBhXG4gICAgICAgICAgLy8gdG9wL2xlZnQvYm90dG9tL3JpZ2h0IGJlaW5nIHNldCwgd2Ugb3ZlcnJpZGUgYWxsIHRoZSBwcmV2aW91c2x5XG4gICAgICAgICAgLy8gY29tcHV0ZWQgcG9zaXRpb25zIHRvIHNldCBpdCBjb3JyZWN0bHkuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdDcm9zc0RpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgICAgICAvLyBGb3IgYSByZWxhdGl2ZSBjaGlsZHJlbiwgd2UncmUgZWl0aGVyIHVzaW5nIGFsaWduSXRlbXMgKHBhcmVudCkgb3JcbiAgICAgICAgICAvLyBhbGlnblNlbGYgKGNoaWxkKSBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIHBvc2l0aW9uIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgLy8gVGhpcyB2YXJpYWJsZSBpcyBpbnRlbnRpb25hbGx5IHJlLWRlZmluZWQgYXMgdGhlIGNvZGUgaXMgdHJhbnNwaWxlZCB0byBhIGJsb2NrIHNjb3BlIGxhbmd1YWdlXG4gICAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgLy8gWW91IGNhbiBvbmx5IHN0cmV0Y2ggaWYgdGhlIGRpbWVuc2lvbiBoYXMgbm90IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgICAgICAgICAgLy8gcHJldmlvdXNseS5cbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIHNwYWNlIGJldHdlZW4gdGhlIHBhcmVudCBkaW1lbnNpb25zK3BhZGRpbmcgYW5kIGNoaWxkXG4gICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnMrbWFyZ2luLlxuICAgICAgICAgICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQ3Jvc3NEaW0gPSBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW0gLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDU1NfQUxJR05fRkxFWF9FTkRcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgYXBwbHkgdGhlIHBvc2l0aW9uXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ0Nyb3NzRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmVzQ3Jvc3NEaW0gKz0gY3Jvc3NEaW07XG4gICAgICBsaW5lc01haW5EaW0gPSBmbWF4ZihsaW5lc01haW5EaW0sIG1haW5EaW0pO1xuICAgICAgbGluZXNDb3VudCArPSAxO1xuICAgICAgc3RhcnRMaW5lID0gZW5kTGluZTtcbiAgICB9XG5cbiAgICAvLyA8TG9vcCBFPlxuICAgIC8vXG4gICAgLy8gTm90ZShwcmVuYXV4KTogTW9yZSB0aGFuIG9uZSBsaW5lLCB3ZSBuZWVkIHRvIGxheW91dCB0aGUgY3Jvc3NBeGlzXG4gICAgLy8gYWNjb3JkaW5nIHRvIGFsaWduQ29udGVudC5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb3VsZCBwcm9iYWJseSByZW1vdmUgPExvb3AgRD4gYW5kIGhhbmRsZSB0aGUgb25lIGxpbmUgY2FzZVxuICAgIC8vIGhlcmUgdG9vLCBidXQgZm9yIHRoZSBtb21lbnQgdGhpcyBpcyBzYWZlciBzaW5jZSBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aFxuICAgIC8vIHByZXZpb3VzbHkgd29ya2luZyBjb2RlLlxuICAgIC8vXG4gICAgLy8gU2VlIHNwZWNzOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTIvQ1ItY3NzMy1mbGV4Ym94LTIwMTIwOTE4LyNsYXlvdXQtYWxnb3JpdGhtXG4gICAgLy8gc2VjdGlvbiA5LjRcbiAgICAvL1xuICAgIGlmIChsaW5lc0NvdW50ID4gMSAmJiBpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgdmFyLypmbG9hdCovIG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3M7XG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQWxpZ25Db250ZW50RGltID0gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSAtIGxpbmVzQ3Jvc3NEaW07XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbUxlYWQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGN1cnJlbnRMZWFkID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudCA9IGdldEFsaWduQ29udGVudChub2RlKTtcbiAgICAgIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyAyO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgIGlmIChub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID4gbGluZXNDcm9zc0RpbSkge1xuICAgICAgICAgIGNyb3NzRGltTGVhZCA9IChyZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyBsaW5lc0NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmludCovIGVuZEluZGV4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lc0NvdW50OyArK2kpIHtcbiAgICAgICAgdmFyLyppbnQqLyBzdGFydEluZGV4ID0gZW5kSW5kZXg7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbGluZSdzIGhlaWdodCBhbmQgZmluZCB0aGUgZW5kSW5kZXhcbiAgICAgICAgdmFyLypmbG9hdCovIGxpbmVIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBjaGlsZENvdW50OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoaWxkLmxpbmVJbmRleCAhPT0gaSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSBmbWF4ZihcbiAgICAgICAgICAgICAgbGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSArIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuZEluZGV4ID0gaWk7XG4gICAgICAgIGxpbmVIZWlnaHQgKz0gY3Jvc3NEaW1MZWFkO1xuXG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGVuZEluZGV4OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50QWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBsaW5lSGVpZ2h0IC0gZ2V0VHJhaWxpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykgLSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICB2YXIvKmZsb2F0Ki8gY2hpbGRIZWlnaHQgPSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgKGxpbmVIZWlnaHQgLSBjaGlsZEhlaWdodCkgLyAyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICAgIC8vIFRPRE8ocHJlbmF1eCk6IENvcnJlY3RseSBzZXQgdGhlIGhlaWdodCBvZiBpdGVtcyB3aXRoIHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGF1dG8pIGNyb3NzQXhpcyBkaW1lbnNpb24uXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExlYWQgKz0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBuZWVkc01haW5UcmFpbGluZ1BvcyA9IGZhbHNlO1xuICAgIHZhci8qYm9vbCovIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZnkgYSB3aWR0aCBvciBoZWlnaHQsIGFuZCBpdCBoYXMgbm90IGJlZW4gc2V0XG4gICAgLy8gYnkgdGhlIGNvbnRhaW5lciwgdGhlbiB3ZSBzZXQgaXQgdmlhIHRoZSBjaGlsZHJlbi5cbiAgICBpZiAoIWlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIFdlJ3JlIG1pc3NpbmcgdGhlIGxhc3QgcGFkZGluZyBhdCB0aGlzIHBvaW50IHRvIGdldCB0aGUgZmluYWxcbiAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBtYWluQXhpcywgbGluZXNNYWluRGltICsgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKSksXG4gICAgICAgIC8vIFdlIGNhbiBuZXZlciBhc3NpZ24gYSB3aWR0aCBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlcnNcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluXG4gICAgICApO1xuXG4gICAgICBpZiAobWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNNYWluVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGxpbmVzQ3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgKTtcblxuICAgICAgaWYgKGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBGPiBTZXQgdHJhaWxpbmcgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zIHx8IG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBHPiBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzXG4gICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBmaXJzdEFic29sdXRlQ2hpbGQ7XG4gICAgd2hpbGUgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3JcbiAgICAgIC8vIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aCBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgIWlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbbGVhZGluZ1theGlzXV0gPVxuICAgICAgICAgICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQ7XG4gICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGUobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbikge1xuICAgIG5vZGUuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblxuICAgIHZhciBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbiB8fCBDU1NfRElSRUNUSU9OX0xUUjtcbiAgICB2YXIgc2tpcExheW91dCA9XG4gICAgICAhbm9kZS5pc0RpcnR5ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPT09IG5vZGUubGF5b3V0LmhlaWdodCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID09PSBub2RlLmxheW91dC53aWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID09PSBwYXJlbnRNYXhXaWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uO1xuXG4gICAgaWYgKHNraXBMYXlvdXQpIHtcbiAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbm9kZS5sYXN0TGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXN0TGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGF5b3V0LnRvcCA9IG5vZGUubGFzdExheW91dC50b3A7XG4gICAgICBub2RlLmxheW91dC5sZWZ0ID0gbm9kZS5sYXN0TGF5b3V0LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbm9kZS5sYXN0TGF5b3V0KSB7XG4gICAgICAgIG5vZGUubGFzdExheW91dCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAgIC8vIFJlc2V0IGNoaWxkIGxheW91dHNcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBjaGlsZC5sYXlvdXQud2lkdGggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC5oZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC50b3AgPSAwO1xuICAgICAgICBjaGlsZC5sYXlvdXQubGVmdCA9IDA7XG4gICAgICB9KTtcblxuICAgICAgbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbik7XG5cbiAgICAgIG5vZGUubGFzdExheW91dC53aWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC50b3AgPSBub2RlLmxheW91dC50b3A7XG4gICAgICBub2RlLmxhc3RMYXlvdXQubGVmdCA9IG5vZGUubGF5b3V0LmxlZnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsYXlvdXROb2RlSW1wbDogbGF5b3V0Tm9kZUltcGwsXG4gICAgY29tcHV0ZUxheW91dDogbGF5b3V0Tm9kZSxcbiAgICBmaWxsTm9kZXM6IGZpbGxOb2Rlc1xuICB9O1xufSkoKTtcblxuLy8gVGhpcyBtb2R1bGUgZXhwb3J0IGlzIG9ubHkgdXNlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVuaXQgdGVzdGluZyB0aGlzIGZpbGUuIFdoZW5cbi8vIHRoZSBsaWJyYXJ5IGlzIHBhY2thZ2VkIHRoaXMgZmlsZSBpcyBpbmNsdWRlZCB3aXRoaW4gY3NzLWxheW91dC5qcyB3aGljaCBmb3Jtc1xuLy8gdGhlIHB1YmxpYyBBUEkuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcHV0ZUxheW91dDtcbn1cblxuXG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgIC8vIGRpc2FibGluZyBFU0xpbnQgYmVjYXVzZSB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBhYm92ZSBpbmNsdWRlXG4gICAgY29tcHV0ZUxheW91dC5maWxsTm9kZXMobm9kZSk7XG4gICAgY29tcHV0ZUxheW91dC5jb21wdXRlTGF5b3V0KG5vZGUpO1xuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9O1xufSkpO1xuIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG5tb2R1bGUuZXhwb3J0cy5UaW55RW1pdHRlciA9IEU7XG4iLCJpbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vaW1hZ2VNYW5hZ2VyJztcbmNvbnN0IEVtaXR0ZXIgPSByZXF1aXJlKCd0aW55LWVtaXR0ZXInKTtcblxuaW50ZXJmYWNlIENoYXJEYXRhIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG4gIHc6IG51bWJlcjtcbiAgaDogbnVtYmVyO1xuICBvZmZYOiBudW1iZXI7XG4gIG9mZlk6IG51bWJlcjtcbiAgeGFkdmFuY2U6IG51bWJlcjtcbiAga2VybmluZzogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfTtcbn1cblxuaW50ZXJmYWNlIENoYXJzIHtcbiAgW2tleTogc3RyaW5nXTogQ2hhckRhdGE7XG59XG5cbnR5cGUgQ29uZmlnTGluZURhdGEgPSB7XG4gIGxpbmU6IHN0cmluZ1tdO1xuICBpbmRleDogbnVtYmVyO1xufTtcblxuXG4vKipcbiAqIGh0dHA6Ly93d3cuYW5nZWxjb2RlLmNvbS9wcm9kdWN0cy9ibWZvbnQvZG9jL2ZpbGVfZm9ybWF0Lmh0bWxcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0TWFwRm9udCB7XG4gIHByaXZhdGUgY29uZmlnOiBzdHJpbmc7XG4gIHB1YmxpYyBldmVudDogYW55O1xuXG4gIHB1YmxpYyBjaGFyczogQ2hhcnM7XG5cbiAgcHVibGljIHJlYWR5ID0gZmFsc2U7XG4gIHB1YmxpYyB0ZXh0dXJlOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcbiAgcHVibGljIGxpbmVIZWlnaHQ/OiBudW1iZXI7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcblxuXG4gIC8vIHBvb2znmoTlrp7njrDmlL7liLDnsbvph4zpnaLlrp7njrDlubbkuI3kvJjpm4XvvIzlhYjljrvmjonkuoZcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLmNoYXJzID0gdGhpcy5wYXJzZUNvbmZpZyhjb25maWcpO1xuICAgIHRoaXMuZXZlbnQgPSBuZXcgRW1pdHRlcigpO1xuXG4gICAgdGhpcy50ZXh0dXJlID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZShzcmMsICh0ZXh0dXJlLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5ldmVudC5lbWl0KCd0ZXh0X19sb2FkX19kb25lJyk7XG4gICAgfSk7XG4gIH1cblxuICBwYXJzZUNvbmZpZyhmbnRUZXh0OiBzdHJpbmcpIHtcbiAgICBmbnRUZXh0ID0gZm50VGV4dC5zcGxpdCgnXFxyXFxuJykuam9pbignXFxuJyk7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gZm50VGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgbGluZXNQYXJzZWQ6IHN0cmluZ1tdW10gPSBsaW5lcy5tYXAobGluZSA9PiBsaW5lLnRyaW0oKS5zcGxpdCgnICcpKTtcblxuICAgIGNvbnN0IGNoYXJzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjaGFycycpO1xuICAgIGNvbnN0IGNoYXJzQ291bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhcnNMaW5lLmxpbmUsICdjb3VudCcpO1xuXG4gICAgY29uc3QgY29tbW9uTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjb21tb24nKTtcbiAgICB0aGlzLmxpbmVIZWlnaHQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbW1vbkxpbmUubGluZSwgJ2xpbmVIZWlnaHQnKTtcblxuICAgIGNvbnN0IGluZm9MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2luZm8nKTtcbiAgICB0aGlzLmZvbnRTaXplID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShpbmZvTGluZS5saW5lLCAnc2l6ZScpO1xuXG4gICAgLy8g5o6l5Y24IGtlcm5pbmdzXG4gICAgY29uc3Qga2VybmluZ3NMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2tlcm5pbmdzJyk7XG4gICAgbGV0IGtlcm5pbmdzQ291bnQgPSAwO1xuICAgIGxldCBrZXJuaW5nc1N0YXJ0ID0gLTE7XG4gICAgaWYgKGtlcm5pbmdzTGluZS5saW5lKSB7XG4gICAgICBrZXJuaW5nc0NvdW50ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShrZXJuaW5nc0xpbmUubGluZSwgJ2NvdW50Jyk7XG4gICAgICBrZXJuaW5nc1N0YXJ0ID0ga2VybmluZ3NMaW5lLmluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFyczogQ2hhcnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBjaGFyc0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXJUZXh0OiBzdHJpbmcgPSBsaW5lc1tpXTtcbiAgICAgIGNvbnN0IGxldHRlcjogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaWQnKSk7XG5cbiAgICAgIGNvbnN0IGM6IENoYXJEYXRhID0ge1xuICAgICAgICB4OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneCcpLFxuICAgICAgICB5OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneScpLFxuICAgICAgICB3OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnd2lkdGgnKSxcbiAgICAgICAgaDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2hlaWdodCcpLFxuICAgICAgICBvZmZYOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneG9mZnNldCcpLFxuICAgICAgICBvZmZZOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneW9mZnNldCcpLFxuICAgICAgICB4YWR2YW5jZTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hhZHZhbmNlJyksXG4gICAgICAgIGtlcm5pbmc6IHt9XG4gICAgICB9O1xuICAgICAgY2hhcnNbbGV0dGVyXSA9IGM7XG4gICAgfVxuXG4gICAgLy8gcGFyc2Uga2VybmluZ3NcbiAgICBpZiAoa2VybmluZ3NDb3VudCkge1xuICAgICAgZm9yIChsZXQgaSA9IGtlcm5pbmdzU3RhcnQ7IGkgPD0ga2VybmluZ3NTdGFydCArIGtlcm5pbmdzQ291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuICAgICAgICBjb25zdCBmaXJzdDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdmaXJzdCcpKTtcbiAgICAgICAgY29uc3Qgc2Vjb25kOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ3NlY29uZCcpKTtcbiAgICAgICAgY29uc3QgYW1vdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdhbW91bnQnKTtcblxuICAgICAgICBpZiAoY2hhcnNbc2Vjb25kXSkge1xuICAgICAgICAgIGNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH1cblxuICBnZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdLCBsaW5lTmFtZSA9ICcnKTogQ29uZmlnTGluZURhdGEge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsaW5lOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IGxpbmVzUGFyc2VkLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW06IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG5cbiAgICAgIGlmIChpdGVtWzBdID09PSBsaW5lTmFtZSkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGxpbmUgPSBpdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lLFxuICAgICAgaW5kZXgsXG4gICAgfTtcbiAgfVxuXG4gIGdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbmZpZ1RleHQ6IHN0cmluZ1tdIHwgc3RyaW5nLCBrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0TGlzdCA9IEFycmF5LmlzQXJyYXkoY29uZmlnVGV4dCkgPyBjb25maWdUZXh0IDogY29uZmlnVGV4dC5zcGxpdCgnICcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBpdGVtQ29uZmlnVGV4dExpc3Q7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbUNvbmZpZ1RleHQgPSBpdGVtQ29uZmlnVGV4dExpc3RbaV07XG4gICAgICBpZiAoa2V5ID09PSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoMCwga2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoa2V5Lmxlbmd0aCArIDEpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iLCJpbnRlcmZhY2UgRGVidWdJbmZvSXRlbSB7XG4gIHN0YXJ0OiBudW1iZXI7XG4gIGlzSW5uZXI6IGJvb2xlYW47XG4gIGVuZD86IG51bWJlcjtcbiAgY29zdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVidWdJbmZvIHtcbiAgcHVibGljIGluZm86IHsgW2tleTogc3RyaW5nXTogRGVidWdJbmZvSXRlbSB9ID0ge307XG4gIHB1YmxpYyB0b3RhbFN0YXJ0OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgdG90YWxDb3N0OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHN0YXJ0KG5hbWU6IHN0cmluZywgaXNJbm5lcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMudG90YWxTdGFydCA9PT0gMCkge1xuICAgICAgdGhpcy50b3RhbFN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICB0aGlzLmluZm9bbmFtZV0gPSB7XG4gICAgICBzdGFydDogRGF0ZS5ub3coKSxcbiAgICAgIGlzSW5uZXIsXG4gICAgfTtcbiAgfVxuXG4gIGVuZChuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pbmZvW25hbWVdKSB7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5jb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMuaW5mb1tuYW1lXS5zdGFydDtcbiAgICAgIHRoaXMudG90YWxDb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMudG90YWxTdGFydDtcbiAgICB9XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmluZm8gPSB7fTtcbiAgICB0aGlzLnRvdGFsU3RhcnQgPSAwO1xuICAgIHRoaXMudG90YWxDb3N0ID0gMDtcbiAgfVxuXG4gIGxvZyhuZWVkSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgbGV0IGxvZ0luZm8gPSAnTGF5b3V0IGRlYnVnIGluZm86IFxcbic7XG4gICAgbG9nSW5mbyArPSBPYmplY3Qua2V5cyh0aGlzLmluZm8pLnJlZHVjZSgoc3VtLCBjdXJyKSA9PiB7XG4gICAgICBpZiAodGhpcy5pbmZvW2N1cnJdLmlzSW5uZXIgJiYgIW5lZWRJbm5lcikge1xuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgICAgc3VtICs9IGAke2N1cnJ9OiAke3RoaXMuaW5mb1tjdXJyXS5jb3N0fVxcbmA7XG4gICAgICByZXR1cm4gc3VtO1xuICAgIH0sICcnKTtcblxuICAgIGxvZ0luZm8gKz0gYHRvdGFsQ29zdDogJHt0aGlzLnRvdGFsQ29zdH1cXG5gO1xuXG4gICAgcmV0dXJuIGxvZ0luZm87XG4gIH1cbn1cbiIsImltcG9ydCBQb29sIGZyb20gJy4vcG9vbCc7XG5pbXBvcnQgeyBub25lLCBjcmVhdGVJbWFnZSB9IGZyb20gJy4vdXRpbCc7XG5cbnR5cGUgQ2FsbGJhY2sgPSAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50LCBmcm9tQ2FjaGU6IGJvb2xlYW4pID0+IHZvaWQ7XG5pbnRlcmZhY2UgSW1hZ2VDYWNoZSB7XG4gIGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgbG9hZERvbmU6IGJvb2xlYW47XG4gIG9ubG9hZGNia3M6IENhbGxiYWNrW107XG4gIG9uZXJyb3JjYmtzOiBDYWxsYmFja1tdO1xufVxuXG5jbGFzcyBJbWFnZU1hbmFnZXIge1xuICBwcml2YXRlIGltZ1Bvb2wgPSBuZXcgUG9vbDxJbWFnZUNhY2hlPignaW1nUG9vbCcpO1xuICBcbiAgZ2V0UmVzKHNyYzogc3RyaW5nKTogSW1hZ2VDYWNoZSB7XG4gICAgcmV0dXJuIHRoaXMuaW1nUG9vbC5nZXQoc3JjKTtcbiAgfVxuXG4gIGxvYWRJbWFnZVByb21pc2Uoc3JjOiBzdHJpbmcpOiBQcm9taXNlPEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMubG9hZEltYWdlKHNyYywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGxvYWRJbWFnZShzcmM6IHN0cmluZywgc3VjY2VzczogQ2FsbGJhY2sgPSBub25lLCBmYWlsOiBDYWxsYmFjayA9IG5vbmUpOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbCB7XG4gICAgaWYgKCFzcmMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgY29uc3QgY2FjaGUgPSB0aGlzLmdldFJlcyhzcmMpO1xuXG4gICAgLy8g5Zu+54mH5bey57uP6KKr5Yqg6L296L+H77yM55u05o6l6L+U5Zue5Zu+54mH5bm25LiU5omn6KGM5Zue6LCDXG4gICAgaWYgKGNhY2hlICYmIGNhY2hlLmxvYWREb25lKSB7XG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG4gICAgICBzdWNjZXNzKGltZywgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChjYWNoZSAmJiAhY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIC8vIOWbvueJh+ato+WcqOWKoOi9vei/h+eoi+S4re+8jOi/lOWbnuWbvueJh+W5tuS4lOetieW+heWbvueJh+WKoOi9veWujOaIkOaJp+ihjOWbnuiwg1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuXG4gICAgICBjYWNoZS5vbmxvYWRjYmtzLnB1c2goc3VjY2Vzcyk7XG4gICAgICBjYWNoZS5vbmVycm9yY2Jrcy5wdXNoKGZhaWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDliJvlu7rlm77niYfvvIzlsIblm57osIPlh73mlbDmjqjlhaXlm57osIPlh73mlbDmoIhcbiAgICAgIGltZyA9IGNyZWF0ZUltYWdlKCkgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgIGNvbnN0IG5ld0NhY2hlID0ge1xuICAgICAgICBpbWcsXG4gICAgICAgIGxvYWREb25lOiBmYWxzZSxcbiAgICAgICAgb25sb2FkY2JrczogW3N1Y2Nlc3NdLFxuICAgICAgICBvbmVycm9yY2JrczogW2ZhaWxdLFxuICAgICAgfVxuICAgICBcbiAgICAgIHRoaXMuaW1nUG9vbC5zZXQoc3JjLCBuZXdDYWNoZSk7XG5cbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLmxvYWREb25lID0gdHJ1ZTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcuc3JjID0gc3JjO1xuICAgIH1cblxuICAgIHJldHVybiBpbWc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlTWFuYWdlcigpO1xuIiwiY29uc3QgcG9vbHM6IFBvb2w8YW55PltdID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvb2w8VD4ge1xuICBwdWJsaWMgbmFtZSA9ICdwb29sJ1xuICBwdWJsaWMgcG9vbDogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihuYW1lID0gJ3Bvb2wnKSB7XG4gICAgY29uc3QgY3VyciA9IHBvb2xzLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIHJldHVybiBjdXJyO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wb29sID0ge307XG5cbiAgICBwb29scy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKTogVCB7XG4gICAgcmV0dXJuIHRoaXMucG9vbFtrZXldO1xuICB9XG5cbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogVCkge1xuICAgIHRoaXMucG9vbFtrZXldID0gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgfVxuXG4gIGdldExpc3QoKTogVFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLnBvb2wpO1xuICB9XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3Qge1xuICBwdWJsaWMgd2lkdGggPSAwO1xuICBwdWJsaWMgaGVpZ2h0ID0gMDtcbiAgcHVibGljIGxlZnQgPSAwO1xuICBwdWJsaWMgcmlnaHQgPSAwO1xuICBwdWJsaWMgdG9wID0gMDtcbiAgcHVibGljIGJvdHRvbSA9IDA7XG5cbiAgY29uc3RydWN0b3IobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMuc2V0KGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBzZXQobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgdGhpcy5yaWdodCA9IHRoaXMubGVmdCArIHRoaXMud2lkdGg7XG4gICAgdGhpcy5ib3R0b20gPSB0aGlzLnRvcCArIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIOWIpOaWreS4pOS4quefqeW9ouaYr+WQpuebuOS6pFxuICAgKiDljp/nkIblj6/op4E6IGh0dHBzOi8vemh1YW5sYW4uemhpaHUuY29tL3AvMjk3MDQwNjRcbiAgICovXG4gIGludGVyc2VjdHMocmVjdDogUmVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKHRoaXMucmlnaHQgPCByZWN0LmxlZnQgfHwgcmVjdC5yaWdodCA8IHRoaXMubGVmdCB8fCB0aGlzLmJvdHRvbSA8IHJlY3QudG9wIHx8IHJlY3QuYm90dG9tIDwgdGhpcy50b3ApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrZXIge1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBhbmltYXRpb25JZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBjYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBuZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJDYnM6IENhbGxiYWNrW10gPSBbXTtcblxuICBwcml2YXRlIHVwZGF0ZSA9ICgpID0+IHtcbiAgICAvLyDkvJjlhYjmiafooYzkuJrliqHnmoR0aWNrZXLlm57osIPvvIzlm6DkuLrmnInlj6/og73kvJrop6blj5FyZWZsb3dcbiAgICB0aGlzLmNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlubmVyQ2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm5leHRDYnMuZm9yRWFjaChjYiA9PiBjYigpKTtcblxuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICB9XG5cbiAgY2FuY2VsSWZOZWVkKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbklkKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jYnMuaW5kZXhPZihjYikgPT09IC0xKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lckNicy5wdXNoKGNiKSA6ICB0aGlzLmNicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KGNiOiBDYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMubmV4dENicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoY2I/OiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKGNiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY2JzID0gW107XG4gICAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID4gLTEpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBpc0lubmVyID8gdGhpcy5pbm5lckNicyA6IHRoaXMuY2JzO1xuICAgICAgbGlzdC5zcGxpY2UodGhpcy5jYnMuaW5kZXhPZihjYiksIDEpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jYnMubGVuZ3RoICYmICF0aGlzLmlubmVyQ2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPT09IG51bGwgJiYgKHRoaXMuY2JzLmxlbmd0aCB8fCB0aGlzLmlubmVyQ2JzLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gbm9uZSgpIHsgfVxuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcygpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmKi9cbiAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1hZ2UoKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiovXG4gIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xufVxuXG5sZXQgX2RwcjogbnVtYmVyO1xuLy8gb25seSBCYWlkdSBwbGF0Zm9ybSBuZWVkIHRvIHJlY2lldmUgc3lzdGVtIGluZm8gZnJvbSBtYWluIGNvbnRleHRcbmlmICh0eXBlb2Ygc3dhbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgX19lbnYub25NZXNzYWdlKChyZXM6IGFueSkgPT4ge1xuICAgIGlmIChyZXMgJiYgcmVzLnR5cGUgPT09ICdlbmdpbmUnKSB7XG4gICAgICBpZiAocmVzLmV2ZW50ID09PSAnc3lzdGVtSW5mbycpIHtcbiAgICAgICAgX2RwciA9IHJlcy5zeXN0ZW1JbmZvLmRldmljZVBpeGVsUmF0aW87XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERwcigpIHtcbiAgLy8gcmV0dXJuIDM7XG4gIGlmICh0eXBlb2YgX2RwciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX2RwcjtcbiAgfVxuICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgIF9kcHIgPSBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYygpLmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcbiAgICBfZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSBmYWlsZWQgdG8gYWNjZXNzIGRldmljZSBwaXhlbCByYXRpbywgZmFsbGJhY2sgdG8gMScpO1xuICAgIF9kcHIgPSAxO1xuICB9XG4gIHJldHVybiBfZHByO1xufVxuXG5leHBvcnQgZW51bSBTVEFURSB7XG4gIFVOSU5JVCA9ICdVTklOSVQnLFxuICBJTklURUQgPSAnSU5JVEVEJyxcbiAgUkVOREVSRUQgPSAnUkVOREVSRUQnLFxuICBDTEVBUiA9ICdDTEVBUicsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDYW52YXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4ICYmIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvdWNoQXJyYXkodG91Y2hlczogR2FtZVRvdWNoW10pIHtcbiAgcmV0dXJuIHRvdWNoZXMubWFwKHRvdWNoID0+ICh7XG4gICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcbiAgICBwYWdlWDogdG91Y2gucGFnZVgsXG4gICAgcGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG4gICAgY2xpZW50WTogdG91Y2guY2xpZW50WSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lVG91Y2hFdmVudChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpOiBlIGlzIEdhbWVUb3VjaEV2ZW50IHtcbiAgcmV0dXJuICd0b3VjaGVzJyBpbiBlO1xufSIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBFbGVtZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IElMYXlvdXQsIElMYXlvdXRCb3ggfSBmcm9tICcuLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmludGVyZmFjZSBUcmVlTm9kZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXR0cjogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgY2hpbGRyZW46IFRyZWVOb2RlW107XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gaXNQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIC9cXGQrKD86XFwuXFxkKyk/JS8udGVzdChkYXRhKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNoYXJlZENhbnZhcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gc2hhcmVkQ2FudmFzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGFyZW50U3R5bGUgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3MpO1xuICBjb25zdCBlbGVtZW50ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICAvLyBAdHMtaWdub3JlXG4gIGVsZW1lbnQucm9vdCA9IHRoaXM7XG4gIGVsZW1lbnQudGFnTmFtZSA9IG5vZGUubmFtZTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGNyZWF0ZS5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgc3R5bGUsIGFyZ3MpO1xuXG4gICAgaWYgKGNoaWxkRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW46IEVsZW1lbnRbXSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyID0gdHJ1ZSkge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIC8vIGNoaWxkLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGNoaWxkLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjaGlsZC5pbnNlcnQoY29udGV4dCwgbmVlZFJlbmRlcik7XG5cbiAgICAvLyBTY3JvbGxWaWV355qE5a2Q6IqC54K55riy5p+T5Lqk57uZU2Nyb2xsVmlld+iHquW3se+8jOS4jeaUr+aMgeW1jOWll1Njcm9sbFZpZXdcbiAgICByZXR1cm4gcmVuZGVyQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGNvbnRleHQsICBjaGlsZC50eXBlID09PSAnU2Nyb2xsVmlldycgPyBmYWxzZSA6IG5lZWRSZW5kZXIpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dENoaWxkcmVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLmxheW91dEJveCA9IGNoaWxkLmxheW91dEJveCB8fCB7fTtcblxuICAgIFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZC5sYXlvdXRCb3hbcHJvcCBhcyBrZXlvZiBJTGF5b3V0Qm94XSA9IGNoaWxkLmxheW91dD8uW3Byb3AgYXMga2V5b2YgSUxheW91dF0gYXMgbnVtYmVyO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWCB8fCAwKSArIGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWSB8fCAwKSArIGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH1cblxuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVk7XG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWDtcblxuXG4gICAgbGF5b3V0Q2hpbGRyZW4oY2hpbGQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbm9uZSgpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVUcmVlKGVsZW1lbnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiBDYWxsYmFjayA9IG5vbmUpIHtcbiAgY2FsbGJhY2soZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGl0ZXJhdGVUcmVlKGNoaWxkLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcmVwYWludENoaWxkcmVuID0gKGNoaWxkcmVuOiBFbGVtZW50W10pID0+IHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1Njcm9sbFZpZXcnKSB7XG4gICAgICByZXBhaW50Q2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVwYWludFRyZWUgPSAodHJlZTogRWxlbWVudCkgPT4ge1xuICB0cmVlLnJlcGFpbnQoKTtcblxuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgcmVwYWludFRyZWUoY2hpbGQpO1xuICB9KTtcbn07XG5cbmludGVyZmFjZSBFbGVtZW50QXJncyB7XG4gIHN0eWxlOiBvYmplY3Q7XG4gIGlkTmFtZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgZGF0YXNldDogb2JqZWN0O1xuICBzcmM/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VCBleHRlbmRzIEVsZW1lbnQ+KHJvb3Q6IFQsIGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlLCBwYXJlbnQ/OiBFbGVtZW50KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbZWxlbWVudC50YWdOYW1lIGFzIHN0cmluZ107XG4gIC8vIEB0cy1pZ25vcmVcbiAgcm9vdC5lbGVDb3VudCArPSAxO1xuXG4gIGNvbnN0IGFyZ3M6IEVsZW1lbnRBcmdzID0ge1xuICAgIHN0eWxlOiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LnN0eWxlKSxcbiAgICBpZE5hbWU6IGVsZW1lbnQuaWROYW1lLFxuICAgIGNsYXNzTmFtZTogZWxlbWVudC5jbGFzc05hbWUsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlkOiByb290LmVsZUNvdW50LFxuICAgIGRhdGFzZXQ6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuZGF0YXNldCksXG4gIH07XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIGFyZ3Muc3JjID0gZWxlbWVudC5zcmM7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEJpdE1hcFRleHQpIHtcbiAgICBhcmdzLnZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld0VsZW1lbmV0ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICBuZXdFbGVtZW5ldC5yb290ID0gcm9vdDtcbiAgLy8gQHRzLWlnbm9yZVxuICBuZXdFbGVtZW5ldC5pbnNlcnQocm9vdC5yZW5kZXJDb250ZXh0LCBmYWxzZSk7XG4gIG5ld0VsZW1lbmV0Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGQobmV3RWxlbWVuZXQpO1xuICB9XG5cbiAgaWYgKGRlZXApIHtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjbG9uZShyb290LCBjaGlsZCwgZGVlcCwgbmV3RWxlbWVuZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld0VsZW1lbmV0O1xufVxuXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sPEJpdE1hcEZvbnQ+KCdiaXRNYXBQb29sJyk7XG5cbmludGVyZmFjZSBJQml0TWFwVGV4dE9wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbiAgZm9udD86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQml0TWFwVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdCaXRNYXBUZXh0JztcbiAgcHJpdmF0ZSB2YWx1ZXNyYzogc3RyaW5nO1xuICBwdWJsaWMgZm9udDogQml0TWFwRm9udDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQml0TWFwVGV4dE9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHZhbHVlID0gJycsXG4gICAgICBmb250ID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgIH0gPSBvcHRzO1xuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG5cbiAgICB0aGlzLmZvbnQgPSBiaXRNYXBQb29sLmdldChmb250KTtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgY29uc29sZS5lcnJvcihgTWlzc2luZyBCaXRtYXBGb250IFwiJHtmb250fVwiLCBwbGVhc2UgaW52b2tlIEFQSSBcInJlZ2lzdEJpdE1hcEZvbnRcIiBiZWZvcmUgdXNpbmcgXCJCaXRNYXBUZXh0XCJgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZW1pdCgncmVwYWludCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250LnJlYWR5KSB7XG4gICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb250LmV2ZW50Lm9uKCd0ZXh0X19sb2FkX19kb25lJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dEJvdW5kcygpIHtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgeyBsZXR0ZXJTcGFjaW5nID0gMCB9ID0gc3R5bGU7XG4gICAgbGV0IHdpZHRoID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgd2lkdGggKz0gY2ZnLnc7XG5cbiAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgd2lkdGggKz0gbGV0dGVyU3BhY2luZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQ6IHRoaXMuZm9udC5saW5lSGVpZ2h0IH07XG4gIH1cblxuICByZW5kZXJUZXh0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRUZXh0Qm91bmRzKCk7XG4gICAgY29uc3QgZGVmYXVsdExpbmVIZWlnaHQgPSB0aGlzLmZvbnQubGluZUhlaWdodCBhcyBudW1iZXI7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qge1xuICAgICAgd2lkdGggPSAwLCAvLyDmsqHmnInorr7nva7ph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIGhlaWdodCA9IDAsIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgLy8gbGluZUhlaWdodCA9IGRlZmF1bHRMaW5lSGVpZ2h0LCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICAgIHRleHRBbGlnbiwgLy8g5paH5a2X5bem5Y+z5a+56b2Q5pa55byPXG4gICAgICB2ZXJ0aWNhbEFsaWduLFxuICAgICAgbGV0dGVyU3BhY2luZyA9IDAsXG4gICAgfSA9IHN0eWxlO1xuICAgIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAoc3R5bGUubGluZUhlaWdodCB8fCBkZWZhdWx0TGluZUhlaWdodCkgYXMgbnVtYmVyXG5cbiAgICAvLyDlhYPntKDljIXlm7Tnm5LnmoTlt6bkuIrop5LlnZDmoIdcbiAgICBsZXQgeCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgbGV0IHkgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3Qgc2NhbGVZID0gbGluZUhlaWdodCAvIGRlZmF1bHRMaW5lSGVpZ2h0O1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHNjYWxlWSAqIGJvdW5kcy53aWR0aDtcblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCB4LCB5LCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8vIOWmguaenOaWh+Wtl+eahOa4suafk+WMuuWfn+mrmOW6puWwj+S6juebkuWtkOmrmOW6pu+8jOmHh+eUqOWvuem9kOaWueW8j1xuICAgIGlmIChsaW5lSGVpZ2h0IDwgaGVpZ2h0KSB7XG4gICAgICBpZiAodmVydGljYWxBbGlnbiA9PT0gJ21pZGRsZScpIHtcbiAgICAgICAgeSArPSAoaGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnYm90dG9tJykge1xuICAgICAgICB5ID0geSArIGhlaWdodCAtIGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoID4gcmVhbFdpZHRoKSB7XG4gICAgICBpZiAodGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgICB4ICs9ICh3aWR0aCAtIHJlYWxXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgeCArPSAod2lkdGggLSByZWFsV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOiusOW9leS4iuS4gOS4quWtl+espu+8jOaWueS+v+WkhOeQhiBrZXJuaW5nXG4gICAgbGV0IHByZXZDaGFyQ29kZSA9IG51bGw7XG5cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG5cbiAgICAgIGlmIChwcmV2Q2hhckNvZGUgJiYgY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXSkge1xuICAgICAgICB4ICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICB0aGlzLmZvbnQudGV4dHVyZSBhcyBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICAgIGNmZy54LFxuICAgICAgICAgIGNmZy55LFxuICAgICAgICAgIGNmZy53LFxuICAgICAgICAgIGNmZy5oLFxuICAgICAgICAgIHggKyBjZmcub2ZmWCAqIHNjYWxlWSxcbiAgICAgICAgICB5ICsgY2ZnLm9mZlkgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLncgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLmggKiBzY2FsZVksXG4gICAgICAgICk7XG5cbiAgICAgICAgeCArPSAoY2ZnLnhhZHZhbmNlICogc2NhbGVZICsgbGV0dGVyU3BhY2luZyk7XG5cbiAgICAgICAgcHJldkNoYXJDb2RlID0gY2hhcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgY3JlYXRlQ2FudmFzIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJQ2FudmFzT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIGF1dG9DcmVhdGVDYW52YXM/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXMgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBjYW52YXNJbnN0YW5jZTogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsID0gbnVsbFxuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElDYW52YXNPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgICAgd2lkdGggPSAxMDAsXG4gICAgICBoZWlnaHQgPSAxMDAsXG4gICAgICBhdXRvQ3JlYXRlQ2FudmFzID0gZmFsc2UsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiDlvq7kv6HlsI/muLjmiI/lnLrmma/kuIvvvIxzaGFyZWRDYW52YXMg5a6e5L6L5LiN5pa55L6/6Ieq5Yqo5Yib5bu677yM5o+Q5L6bIHNldHRlciDmiYvliqjorr7nva5cbiAgICAgKi9cbiAgICBpZiAoYXV0b0NyZWF0ZUNhbnZhcykge1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGNyZWF0ZUNhbnZhcygpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS53aWR0aCA9IE51bWJlcih3aWR0aCk7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLmhlaWdodCA9IE51bWJlcihoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjYW52YXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzSW5zdGFuY2U7XG4gIH1cblxuICBzZXQgY2FudmFzKGN2czogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsKSB7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGN2cztcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5jYW52YXNJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIGNvbnN0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCBkcmF3WSA9IGJveC5hYnNvbHV0ZVk7XG5cbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBjdHguZHJhd0ltYWdlKHRoaXMuY2FudmFzSW5zdGFuY2UsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIGFsbFN0eWxlcywgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgUmVjdCBmcm9tICcuLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzL2luZGV4J1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzL2luZGV4JztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlJZCh0cmVlOiBFbGVtZW50LCBsaXN0OiBFbGVtZW50W10gPSBbXSwgaWQ6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKGNoaWxkLmlkTmFtZSA9PT0gaWQpIHtcbiAgICAgIGxpc3QucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgZ2V0RWxlbWVudHNCeUlkKGNoaWxkLCBsaXN0LCBpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKHRyZWU6IEVsZW1lbnQsIGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgbGlzdCA9IGdldEVsZW1lbnRzQnlJZCh0cmVlLCBbXSwgaWQpO1xuXG4gIHJldHVybiBsaXN0Py5bMF0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoKGNoaWxkLmNsYXNzTmFtZUxpc3QgfHwgY2hpbGQuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLykpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2hpbGQsIGxpc3QsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuLyoqXG4gKiDlsIblvZPliY3oioLngrnnva7ohI/vvIxMYXlvdXQg55qEIHRpY2tlciDkvJrmoLnmja7ov5nkuKrmoIforrDkvY3miafooYwgcmVmbG93XG4gKi9cbmZ1bmN0aW9uIHNldERpcnR5KGVsZTogRWxlbWVudCkge1xuICBlbGUuaXNEaXJ0eSA9IHRydWU7XG4gIGxldCB7IHBhcmVudCB9ID0gZWxlO1xuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbn1cblxuLy8g5YWo5bGA5LqL5Lu2566h6YGTXG5jb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuXG5sZXQgdXVpZCA9IDA7XG5cbmZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICByZXR1cm4gcmVzdWx0XG4gICAgPyB7XG4gICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNiksXG4gICAgfVxuICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmdiYShoZXg6IHN0cmluZywgb3BhY2l0eTogbnVtYmVyKSB7XG4gIGNvbnN0IHJnYk9iaiA9IGhleFRvUmdiKGhleCk7XG5cbiAgaWYgKG9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wYWNpdHkgPSAxO1xuICB9XG5cbiAgaWYgKCFyZ2JPYmopIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBgcmdiYSgke3JnYk9iai5yfSwgJHtyZ2JPYmouZ30sICR7cmdiT2JqLmJ9LCAke29wYWNpdHl9KWA7XG59XG5cbmNvbnN0IHRvRXZlbnROYW1lID0gKGV2ZW50OiBzdHJpbmcsIGlkOiBudW1iZXIpID0+IHtcbiAgY29uc3QgZWxlbWVudEV2ZW50ID0gW1xuICAgICdjbGljaycsXG4gICAgJ3RvdWNoc3RhcnQnLFxuICAgICd0b3VjaG1vdmUnLFxuICAgICd0b3VjaGVuZCcsXG4gICAgJ3RvdWNoY2FuY2VsJyxcbiAgXTtcblxuICBpZiAoZWxlbWVudEV2ZW50LmluZGV4T2YoZXZlbnQpICE9PSAtMSkge1xuICAgIHJldHVybiBgZWxlbWVudC0ke2lkfS0ke2V2ZW50fWA7XG4gIH1cblxuICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0Qm94IHtcbiAgbGVmdDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGFic29sdXRlWDogbnVtYmVyO1xuICBhYnNvbHV0ZVk6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVg6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIHJpZ2h0OiBudW1iZXI7XG4gIGJvdHRvbTogbnVtYmVyO1xufTtcblxuY29uc3QgaXNWYWxpZFVybFByb3BSZWcgPSAvXFxzKnVybFxcKCguKj8pXFwpXFxzKi87XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQge1xuICAvKipcbiAgICog5a2Q6IqC54K55YiX6KGoXG4gICAqL1xuICBwdWJsaWMgY2hpbGRyZW46IEVsZW1lbnRbXSA9IFtdO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE54i26IqC54K5XG4gICAqL1xuICBwdWJsaWMgcGFyZW50OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLy8g5Ly85LmO5rKh5LuA5LmI55So77yM5YWI5rOo6YeKXG4gIC8vIHB1YmxpYyBwYXJlbnRJZCA9IDA7XG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoRpZO+8jOS4gOiIrOaYr+eUsSBMYXlvdXQg57uf5LiA5YiG6YWN55qE6Ieq5aKeIGlkXG4gICAqL1xuICBwdWJsaWMgaWQ6IG51bWJlcjtcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgaWQg5bGe5oCn77yM5LiA6Iis55So5LqO6IqC54K55p+l6K+iXG4gICAqL1xuICBwdWJsaWMgaWROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGNsYXNzIOWxnuaAp++8jOS4gOiIrOeUqOS6juaooeadv+aPkuS7tlxuICAgKi9cbiAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG4gIFxuICAvKipcbiAgICog6IqC54K555qE5qC35byP5YiX6KGo77yM5ZyoIExheW91dC5pbml0IOS8muS8oOWFpeagt+W8j+mbhuWQiO+8jOS8muiHquWKqOaMkemAieWHuui3n+iKgueCueacieWFs+eahOagt+W8j+e7n+S4gCBtZXJnZSDliLAgc3R5bGUg5a+56LGh5LiKXG4gICAqL1xuICBwdWJsaWMgc3R5bGU6IElTdHlsZTtcblxuICAvKipcbiAgICog5omn6KGMIGdldEJvdW5kaW5nQ2xpZW50UmVjdCDnmoTnu5PmnpznvJPlrZjvvIzlpoLmnpzkuJrliqHpq5jpopHosIPnlKjvvIzlj6/ku6Xlh4/lsJEgR0NcbiAgICovXG4gIHByaXZhdGUgcmVjdDogUmVjdCB8IG51bGw7XG4gIHB1YmxpYyBjbGFzc05hbWVMaXN0OiBzdHJpbmdbXSB8IG51bGw7XG4gIHB1YmxpYyBsYXlvdXRCb3g6IElMYXlvdXRCb3g7XG4gIHB1YmxpYyBiYWNrZ3JvdW5kSW1hZ2U6IGFueTtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGxcblxuICAvKipcbiAgICog572u6ISP5qCH6K6w5L2N77yM55uu5YmN5b2T5L+u5pS55Lya5b2x5ZON5biD5bGA5bGe5oCn55qE5pe25YCZ77yM5Lya6Ieq5Yqo572u6ISPXG4gICAqL1xuICBwdWJsaWMgaXNEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBjc3MtbGF5b3V0IOiKgueCueWxnuaAp++8jOS4muWKoeS+p+aXoOmcgOWFs+W/g1xuICAgKi9cbiAgcHJvdGVjdGVkIHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTlkI3np7DvvIzmr5TlpoJcIiBJbWFnZVxuICAgKi9cbiAgcHVibGljIHR5cGU/OiBzdHJpbmc7XG4gIC8vIHB1YmxpYyBsYXlvdXQ/OiBJTGF5b3V0O1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnlnKggeG1sIOeahOagh+etvuWQjeensO+8jOavlOWmgiBpbWFnZeOAgXZpZXdcbiAgICovXG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgb3JpZ2luU3R5bGU6IElTdHlsZTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBpZCA9IHV1aWQgKz0gMSxcbiAgICBkYXRhc2V0ID0ge30sXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmlkTmFtZSA9IGlkTmFtZTtcbiAgICB0aGlzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB0aGlzLmxheW91dEJveCA9IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGFic29sdXRlWDogMCxcbiAgICAgIGFic29sdXRlWTogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVYOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVk6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICBpZiAoXG4gICAgICBzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICYmIHN0eWxlLmNvbG9yXG4gICAgICAmJiBzdHlsZS5jb2xvci5pbmRleE9mKCcjJykgPiAtMVxuICAgICkge1xuICAgICAgLy8g6aKc6Imy6Kej5p6Q5aSx6LSl77yM6ZmN57qn5Li6IGhleFxuICAgICAgc3R5bGUuY29sb3IgPSBnZXRSZ2JhKHN0eWxlLmNvbG9yLCBzdHlsZS5vcGFjaXR5KSB8fCBzdHlsZS5jb2xvcjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICYmIHN0eWxlLmJhY2tncm91bmRDb2xvclxuICAgICAgJiYgc3R5bGUuYmFja2dyb3VuZENvbG9yLmluZGV4T2YoJyMnKSA+IC0xXG4gICAgKSB7XG4gICAgICAvLyDpopzoibLop6PmnpDlpLHotKXvvIzpmY3nuqfkuLogaGV4XG4gICAgICBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBnZXRSZ2JhKHN0eWxlLmJhY2tncm91bmRDb2xvciwgc3R5bGUub3BhY2l0eSkgfHwgc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3R5bGUuYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHN0eWxlLmJhY2tncm91bmRJbWFnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5TdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnJlY3QgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBiYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKGJhY2tncm91bmRJbWFnZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBiYWNrZ3JvdW5kSW1hZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBsaXN0ID0gYmFja2dyb3VuZEltYWdlLm1hdGNoKGlzVmFsaWRVcmxQcm9wUmVnKTtcbiAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGxpc3RbMV0ucmVwbGFjZSgvKCd8XCIpL2csICcnKTtcbiAgICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1nO1xuICAgICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgICB0aGlzLnJvb3QgJiYgdGhpcy5yb290LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7YmFja2dyb3VuZEltYWdlfSBpcyBub3QgYSB2YWxpZCBiYWNrZ3JvdW5kSW1hZ2VgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog55uR5ZCs5bGe5oCn55qE5Y+Y5YyW5Yik5pat5piv5ZCm6ZyA6KaB5omn6KGMIHJlZmxvd+OAgXJlcGFpbnQg5pON5L2cXG4gICAqIOe7j+i/h+a1i+ivle+8jE9iamVjdC5kZWZpbmVQcm9wZXJ0eSDmmK/kuIDkuKrmr5TovoPmhaLnmoTmlrnms5XvvIwg54m55Yir5piv5bGe5oCn5q+U6L6D5aSa55qE5pe25YCZXG4gICAqIOWboOatpOS8muWFiOWIpOaWreaYr+WQpuaUr+aMgSBQcm94ee+8jGlNYWMgKFJldGluYSA1SywgMjctaW5jaCwgMjAxNynmtYvor5Xnu5PmnpxcbiAgICog5oC75YWxIDMxMiDkuKroioLngrnvvIxvYnNlcnZlU3R5bGVBbmRFdmVudOaAu+iAl+aXtuS4uu+8mlxuICAgKiBQcm94eTogM21zXG4gICAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eTogMjBtc1xuICAgKi9cbiAgb2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiBQcm94eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgZWxlID0gdGhpcztcbiAgICAgIHRoaXMuc3R5bGUgPSBuZXcgUHJveHkodGhpcy5vcmlnaW5TdHlsZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcikge1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgc2V0RGlydHkoZWxlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICAgICAgICBlbGUucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICBlbGUuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlubmVyU3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0eWxlKSBhcyBJU3R5bGU7XG4gICAgICBhbGxTdHlsZXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnN0eWxlLCBrZXksIHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICgpID0+IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0sXG4gICAgICAgICAgc2V0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSkge1xuICAgICAgICAgICAgICBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdID0gdmFsdWU7XG4gICAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kSW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOS6i+S7tuWGkuazoemAu+i+kVxuICAgIFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hjYW5jZWwnLCAndG91Y2hlbmQnLCAnY2xpY2snXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub24oZXZlbnROYW1lLCAoZSwgdG91Y2hNc2cpID0+IHtcbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZW1pdChldmVudE5hbWUsIGUsIHRvdWNoTXNnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnph43nu5jmjqXlj6PvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlcGFpbnQoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55riy5p+T5o6l5Y+j5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZW5kZXIoKSB7IH1cblxuICAvKipcbiAgICog5Y+C54WnIFdlYiDop4TojIPvvJpodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICovXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOiBSZWN0IHtcbiAgICBpZiAoIXRoaXMucmVjdCkge1xuICAgICAgdGhpcy5yZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY3Quc2V0KFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzkvYbov5nph4zlj6rov5Tlm57nrKblkIjmnaHku7bnmoTnrKzkuIDkuKroioLngrkgXG4gICAqL1xuICBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiBnZXRFbGVtZW50QnlJZCh0aGlzLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzov5nph4zov5Tlm57nrKblkIjmnaHku7bnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlJZChpZDogc3RyaW5nKTogKEVsZW1lbnQgfCBudWxsKVtdIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudHNCeUlkKHRoaXMsIFtdLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMY2xhc3NOYW1lIOWMheWQq+e7meWumuWPguaVsOeahOeahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcywgW10sIGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICog5biD5bGA6K6h566X5a6M5oiQ77yM5YeG5aSH5omn6KGM5riy5p+T5LmL5YmN5omn6KGM55qE5pON5L2c77yM5LiN5ZCM55qE5a2Q57G75pyJ5LiN5ZCM55qE6KGM5Li6XG4gICAqIOavlOWmgiBTY3JvbGxWaWV3IOWcqOa4suafk+S5i+WJjei/mOmcgOimgeWIneWni+WMlua7muWKqOebuOWFs+eahOiDveWKm1xuICAgKiAgXG4gICAqL1xuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCueino+mZpOS6i+S7tue7keWumlxuICAgKi9cbiAgdW5CaW5kRXZlbnQoKSB7XG4gICAgW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICdjbGljaycsXG4gICAgICAncmVwYWludCcsXG4gICAgXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5bCG6IqC54K55LuO5b2T5YmN6IqC54K55qCR5Lit5Yig6ZmkXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcbiAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoaXMgZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkJyk7XG4gICAgfVxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuXG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG5cbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyB0aGlzLkVFID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuXG4gICAgLy8gZWxlbWVudCDlnKjnlLvluIPkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICAvLyB0aGlzLmxheW91dEJveCA9IG51bGw7XG4gICAgLy8gdGhpcy5zdHlsZSA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWUgPSAnJztcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYWRkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XG4gICAgLy8gZWxlbWVudC5wYXJlbnRJZCA9IHRoaXMuaWQ7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG5LiA5Liq6IqC54K55re75Yqg5L2c5Li65b2T5YmN6IqC54K555qE5a2Q6IqC54K5XG4gICAqL1xuICBhcHBlbmRDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5hZGQoZWxlbWVudCk7XG5cbiAgICBzZXREaXJ0eSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnp7vpmaTnu5nlrprnmoTlrZDoioLngrnvvIzlj6rmnInkuIDnuqfoioLngrnog73lpJ/np7vpmaQgXG4gICAqL1xuICByZW1vdmVDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyBlbGVtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi50aGVBcmdzOiBhbnlbXSkge1xuICAgIEVFLmVtaXQodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCAuLi50aGVBcmdzKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICog5riy5p+TIGJvcmRlciDnm7jlhbPog73lipvmir3osaHvvIzlrZDnsbvlj6/mjInpnIDosIPnlKhcbiAgICovXG4gIHJlbmRlckJvcmRlcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCByYWRpdXMgPSBzdHlsZS5ib3JkZXJSYWRpdXMgfHwgMDtcbiAgICBjb25zdCB7IGJvcmRlcldpZHRoID0gMCB9ID0gc3R5bGU7XG4gICAgY29uc3QgYm9yZGVyVG9wTGVmdFJhZGl1cyA9IHN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJvcmRlclRvcFJpZ2h0UmFkaXVzID0gc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJvcmRlckJvdHRvbUxlZnRSYWRpdXMgPSBzdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yID0gJycgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IHkgPSBib3guYWJzb2x1dGVZO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgY29uc3QgaGFzUmFkaXVzID0gcmFkaXVzXG4gICAgICB8fCBib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IGJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IGJvcmRlckJvdHRvbUxlZnRSYWRpdXMgfHwgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM7XG5cbiAgICAvLyBib3JkZXJXaWR0aCDlkowgcmFkaXVzIOmDveayoeacie+8jOS4jemcgOimgeaJp+ihjOWQjue7remAu+i+ke+8jOaPkOWNh+aAp+iDvVxuICAgIGlmICghYm9yZGVyV2lkdGggJiYgIWhhc1JhZGl1cykge1xuICAgICAgcmV0dXJuIHsgbmVlZENsaXA6IGZhbHNlLCBuZWVkU3Ryb2tlOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGN0eC5saW5lV2lkdGggPSBib3JkZXJXaWR0aDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBib3JkZXJDb2xvcjtcblxuICAgIGN0eC5tb3ZlVG8oeCArIGJvcmRlclRvcExlZnRSYWRpdXMsIHkpO1xuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gYm9yZGVyVG9wUmlnaHRSYWRpdXMsIHkpO1xuXG4gICAgLy8g5Y+z5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgYm9yZGVyVG9wUmlnaHRSYWRpdXMsIGJvcmRlclRvcFJpZ2h0UmFkaXVzKTtcblxuICAgIC8vIOWPs+S4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMpO1xuXG4gICAgLy8g5Y+z5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKFxuICAgICAgeCArIHdpZHRoLFxuICAgICAgeSArIGhlaWdodCxcbiAgICAgIHggKyB3aWR0aCAtIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICAgeSArIGhlaWdodCxcbiAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICk7XG5cbiAgICAvLyDlt6bkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyBib3JkZXJCb3R0b21MZWZ0UmFkaXVzLCB5ICsgaGVpZ2h0KTtcblxuICAgIC8vIOW3puS4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgYm9yZGVyQm90dG9tTGVmdFJhZGl1cyk7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHgsIHkgKyBib3JkZXJUb3BMZWZ0UmFkaXVzKTtcblxuICAgIC8vIOW3puS4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4LCB5LCB4ICsgYm9yZGVyVG9wTGVmdFJhZGl1cywgeSwgYm9yZGVyVG9wTGVmdFJhZGl1cyk7XG5cbiAgICByZXR1cm4geyBuZWVkQ2xpcDogISFoYXNSYWRpdXMsIG5lZWRTdHJva2U6ICEhYm9yZGVyV2lkdGggfTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBJSW1hZ2VPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc3JjPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZSBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGltZ3NyYzogc3RyaW5nO1xuICBwdWJsaWMgdHlwZSA9ICdJbWFnZSc7XG4gIHB1YmxpYyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElJbWFnZU9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHNyYyA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1nc3JjID0gc3JjO1xuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzcmMnLCB7XG4gICAgLy8gICBnZXQoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgICAvLyAgIH0sXG4gICAgLy8gICBzZXQobmV3VmFsdWUpIHtcbiAgICAvLyAgICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmltZ3NyYykge1xuICAgIC8vICAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgLy8gICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgIC8vICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgLy8gICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgIC8vICAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAvLyAgICAgICAgICAgdGhpcy5yb290LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSxcbiAgICAvLyAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgLy8gfSk7XG5cbiAgICB0aGlzLmltZyA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWcsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3JjKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW1nc3JjO1xuICB9XG5cbiAgc2V0IHNyYyhuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmltZ3NyYykge1xuICAgICAgdGhpcy5pbWdzcmMgPSBuZXdWYWx1ZTtcbiAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmltZyA9IG51bGw7XG5cbiAgICB0aGlzLnNyYyA9ICcnO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmltZyB8fCAhdGhpcy5pbWc/LmNvbXBsZXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgY29uc3QgZHJhd1ggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcblxuZXhwb3J0IHtcbiAgRWxlbWVudCxcbiAgVmlldyxcbiAgSW1hZ2UsXG4gIFRleHQsXG4gIFNjcm9sbFZpZXcsXG4gIEJpdE1hcFRleHQsXG4gIENhbnZhcyxcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBnZXREcHIsIGNvcHlUb3VjaEFycmF5IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IFNjcm9sbGVyIGZyb20gJy4uL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMnXG5pbXBvcnQgeyBpdGVyYXRlVHJlZSB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBkcHIgPSBnZXREcHIoKTtcblxuaW50ZXJmYWNlIElTY3JvbGxWaWV3T3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNjcm9sbFg/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBzY3JvbGxZPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbn1cblxuaW50ZXJmYWNlIElJbm5lclNjcm9sbGVyT3B0aW9uIHtcbiAgc2Nyb2xsaW5nWD86IGJvb2xlYW47XG4gIHNjcm9sbGluZ1k/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsVmlldyBleHRlbmRzIFZpZXcge1xuICBwdWJsaWMgc2Nyb2xsVG9wID0gMDtcbiAgcHVibGljIHNjcm9sbExlZnQgPSAwO1xuICBwdWJsaWMgaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIHB1YmxpYyBjdXJyZW50RXZlbnQgPSBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdTY3JvbGxWaWV3JztcbiAgXG4gIHByaXZhdGUgc2Nyb2xsWVByb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgaW5uZXJTY3JvbGxlck9wdGlvbjogSUlubmVyU2Nyb2xsZXJPcHRpb247XG5cbiAgcHJpdmF0ZSBzY3JvbGxlck9iaj86IFNjcm9sbGVyO1xuICBwcml2YXRlIGlzRmlyc3RTY3JvbGw/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHNjcm9sbFgsXG4gICAgc2Nyb2xsWSxcbiAgICBkYXRhc2V0LFxuICB9OiBJU2Nyb2xsVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBjbGFzc05hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjcm9sbFlQcm9wID0gc2Nyb2xsWTtcblxuICAgIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6ICEhc2Nyb2xsWCxcbiAgICAgIHNjcm9sbGluZ1k6ICEhc2Nyb2xsWSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlua7muWKqOWIl+ihqOWGheaJgOacieWFg+e0oOeahOmrmOW6puWSjFxuICAgKiDov5nph4zkuI3og73nroDljZXlsIbmiYDmnInlrZDlhYPntKDnmoTpq5jluqbntK/liqDvvIzlm6DkuLrmr4/kuKrlhYPntKDkuYvpl7Tlj6/og73mmK/mnInnqbrpmpnnmoRcbiAgICovXG4gIGdldCBzY3JvbGxIZWlnaHQoKSB7XG4gICAgLy8gc2Nyb2xsdmlld+S4uuepuueahOaDheWGtVxuICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICByZXR1cm4gbGFzdC5sYXlvdXRCb3gudG9wICsgbGFzdC5sYXlvdXRCb3guaGVpZ2h0O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgIC8vIHNjcm9sbHZpZXfkuLrnqbrnmoTmg4XlhrVcbiAgICBpZiAoIXRoaXMuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0ID0gdGhpcy5jaGlsZHJlblt0aGlzLmNoaWxkcmVuLmxlbmd0aCAtIDFdO1xuXG4gICAgcmV0dXJuIGxhc3QubGF5b3V0Qm94LmxlZnQgKyBsYXN0LmxheW91dEJveC53aWR0aDtcbiAgfVxuXG4gIGdldCBzY3JvbGxYKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWDtcbiAgfVxuXG4gIHNldCBzY3JvbGxYKHZhbHVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6IHZhbHVlLFxuICAgIH07XG4gIH1cblxuICBnZXQgc2Nyb2xsWSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1k7XG4gIH1cblxuICBzZXQgc2Nyb2xsWSh2YWx1ZSkge1xuICAgIHRoaXMuc2Nyb2xsZXJPcHRpb24gPSB7XG4gICAgICBzY3JvbGxpbmdZOiB2YWx1ZSxcbiAgICB9O1xuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgdHJlZS5yZW5kZXIoKTtcblxuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgdGhpcy5jdHghLmNsZWFyUmVjdChib3guYWJzb2x1dGVYLCBib3guYWJzb2x1dGVZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICB9XG5cbiAgc2Nyb2xsUmVuZGVyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IHN0YXJ0WCwgYWJzb2x1dGVZOiBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvLyDmoLnmja7mu5rliqjlgLzojrflj5boo4HliarljLrln59cbiAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgd2lkdGg7XG4gICAgY29uc3QgZW5kWSA9IHN0YXJ0WSArIGhlaWdodDtcblxuICAgIC8vIFNjcm9sbFZpZXcg5L2c5Li65a655Zmo5pys6Lqr55qE5riy5p+TXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIOW8gOWni+ijgeWJqu+8jOWPquacieS7lCBTY3JvbGxWaWV3IGxheW91dEJveCDljLrln5/lhoXnmoTlhYPntKDmiY3mmK/lj6/op4HnmoRcbiAgICAgKiDov5nmoLcgU2Nyb2xsVmlldyDkuI3nlKjljZXni6zljaDnlKjkuIDkuKogY2FudmFz77yM5YaF5a2Y5ZCI5riy5p+T6YO95Lya5b6X5Yiw5LyY5YyWXG4gICAgICovXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnJlY3Qoc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5jbGlwKCk7XG5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGFic29sdXRlWCwgYWJzb2x1dGVZIH0gPSBjaGlsZC5sYXlvdXRCb3g7XG5cbiAgICAgIC8vIOWIpOaWreWkhOS6juWPr+inhueql+WPo+WGheeahOWtkOiKgueCue+8jOmAkuW9kua4suafk+ivpeWtkOiKgueCuVxuICAgICAgaWYgKGFic29sdXRlWSArIGhlaWdodCA+PSBzdGFydFkgJiYgYWJzb2x1dGVZIDw9IGVuZFlcbiAgICAgICAgJiYgYWJzb2x1dGVYICsgd2lkdGggPj0gc3RhcnRYICYmIGFic29sdXRlWCA8PSBlbmRYKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0b3A7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVggPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYIC0gbGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIOi/memHjOimgeaKiua7muWKqOeKtuaAgeS/neWtmOi1t+adpe+8jOWboOS4uuWcqHJlZmxvd+eahOaXtuWAmemcgOimgeWBmumHjee9ru+8jOa4suafk+W5tuS4jeS+nei1lui/meS4pOS4quS/oeaBr1xuICAgICAgdGhpcy5zY3JvbGxUb3AgPSB0b3A7XG4gICAgICB0aGlzLnNjcm9sbExlZnQgPSBsZWZ0O1xuXG4gICAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcblxuICAgICAgaWYgKHRoaXMuY3VycmVudEV2ZW50KSB7XG4gICAgICAgIHRoaXMuZW1pdCgnc2Nyb2xsJywgdGhpcy5jdXJyZW50RXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsWSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXZlbnRCaW5kKSB7XG4gICAgICAvLyByZWZsb3cg6auY5bqm5Y+v6IO95Lya5Y+Y5YyW77yM5Zug5q2k6ZyA6KaB5omn6KGMIHNldERpbWVuc2lvbnMg5Yi35paw5Y+v5rua5Yqo5Yy65Z+fXG4gICAgICBpZiAodGhpcy5sYXlvdXRCb3gud2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudEhlaWdodFxuICAgICAgICB8fCB0aGlzLnNjcm9sbFdpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnMoXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGgsXG4gICAgICAgICAgdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxvdyDkuYvlkI7vvIzkvJrku44gY3NzbGF5b3V0IOWQjOatpeW4g+WxgOS/oeaBr++8jOWOn+WFiOeahOa7muWKqOS/oeaBr+S8muS4ouWkse+8jOi/memHjOmcgOimgeS4gOS4quWkjeS9jeeahOaTjeS9nFxuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdGhpcy5zY3JvbGxUb3A7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVggPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYIC0gdGhpcy5zY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcbiAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSB0cnVlO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuc2Nyb2xsZXJPYmogPSBuZXcgU2Nyb2xsZXIodGhpcy5zY3JvbGxIYW5kbGVyLmJpbmQodGhpcyksIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuXG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyh0aGlzLmxheW91dEJveC53aWR0aCwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodCk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hNb3ZlKHRvdWNoZXMsIGUudGltZVN0YW1wLCB1bmRlZmluZWQpO1xuICAgICAgdGhpcy5jdXJyZW50RXZlbnQgPSBlO1xuICAgIH0pO1xuXG4gICAgLy8g6L+Z6YeM5LiN5bqU6K+l5piv55uR5ZCsc2Nyb2xsdmlld+eahHRvdWNoZW5k5LqL5Lu26ICM5piv5bGP5bmV55qEdG91Y2hlbmTkuovku7ZcbiAgICB0aGlzLnJvb3QhLm9uKCd0b3VjaGVuZCcsIChlKSA9PiB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoRW5kKGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcbiAgfVxuXG4gIHNjcm9sbFRvKGxlZnQgPSAwLCB0b3AgPSAwLCBhbmltYXRlID0gdHJ1ZSkge1xuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNjcm9sbFRvKGxlZnQsIHRvcCwgYW5pbWF0ZSwgMSk7XG4gIH1cbn1cbiIsImNvbnN0IHJlZmxvd0FmZmVjdGVkU3R5bGVzID0gW1xuICAnd2lkdGgnLCAnaGVpZ2h0JyxcbiAgJ21pbldpZHRoJywgJ21pbkhlaWdodCcsXG4gICdtYXhXaWR0aCcsICdtYXhIZWlnaHQnLFxuICAnbGVmdCcsICdyaWdodCcsICd0b3AnLCAnYm90dG9tJyxcbiAgJ21hcmdpbicsICdtYXJnaW5MZWZ0JywgJ21hcmdpblJpZ2h0JywgJ21hcmdpblRvcCcsICdtYXJnaW5Cb3R0b20nLFxuICAncGFkZGluZycsICdwYWRkaW5nTGVmdCcsICdwYWRkaW5nUmlnaHQnLCAncGFkZGluZ1RvcCcsICdwYWRkaW5nQm90dG9tJyxcbiAgJ2JvcmRlcldpZHRoJywgJ2JvcmRlckxlZnRXaWR0aCcsICdib3JkZXJSaWdodFdpZHRoJywgJ2JvcmRlclRvcFdpZHRoJywgJ2JvcmRlckJvdHRvbVdpZHRoJyxcbiAgJ2ZsZXhEaXJlY3Rpb24nLFxuICAnZmxleFNocmluaycsXG4gICdmbGV4R3JvdycsXG4gICdqdXN0aWZ5Q29udGVudCcsXG4gICdhbGlnbkl0ZW1zJywgJ2FsaWduU2VsZicsXG4gICdmbGV4JyxcbiAgJ2ZsZXhXcmFwJyxcbiAgJ3Bvc2l0aW9uJyxcbiAgJ2ZvbnRXZWlnaHQnLFxuXTtcblxuY29uc3QgcmVwYWludEFmZmVjdGVkU3R5bGVzID0gW1xuICAnZm9udFNpemUnLFxuICAnbGluZUhlaWdodCcsXG4gICd0ZXh0QWxpZ24nLFxuICAndmVydGljYWxBbGlnbicsXG4gICdjb2xvcicsXG4gICdiYWNrZ3JvdW5kQ29sb3InLFxuICAndGV4dE92ZXJmbG93JyxcbiAgJ2xldHRlclNwYWNpbmcnLFxuICAnYm9yZGVyUmFkaXVzJyxcbiAgJ2JvcmRlckNvbG9yJyxcbl07XG5cbmNvbnN0IGFsbFN0eWxlcyA9IHJlZmxvd0FmZmVjdGVkU3R5bGVzLmNvbmNhdChyZXBhaW50QWZmZWN0ZWRTdHlsZXMpO1xuXG5pbnRlcmZhY2UgSVN0eWxlIHtcbiAgLy8gcmVmbG93QWZmZWN0ZWRTdHlsZXNcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgbWluV2lkdGg/OiBudW1iZXI7XG4gIG1pbkhlaWdodD86IG51bWJlcjtcbiAgbWF4V2lkdGg/OiBudW1iZXI7XG4gIG1heEhlaWdodD86IG51bWJlcjtcbiAgbGVmdD86IG51bWJlcjtcbiAgcmlnaHQ/OiBudW1iZXI7XG4gIHRvcD86IG51bWJlcjtcbiAgYm90dG9tPzogbnVtYmVyO1xuICBtYXJnaW4/OiBudW1iZXI7XG4gIG1hcmdpbkxlZnQ/OiBudW1iZXI7XG4gIG1hcmdpblJpZ2h0PzogbnVtYmVyO1xuICBtYXJnaW5Ub3A/OiBudW1iZXI7XG4gIG1hcmdpbkJvdHRvbT86IG51bWJlcjtcbiAgcGFkZGluZz86IG51bWJlcjtcbiAgcGFkZGluZ0xlZnQ/OiBudW1iZXI7XG4gIHBhZGRpbmdSaWdodD86IG51bWJlcjtcbiAgcGFkZGluZ1RvcD86IG51bWJlcjtcbiAgcGFkZGluZ0JvdHRvbT86IG51bWJlcjtcbiAgYm9yZGVyV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckxlZnRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyUmlnaHRXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyVG9wV2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVdpZHRoPzogbnVtYmVyO1xuXG4gIGJvcmRlclRvcExlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlclRvcFJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21SaWdodFJhZGl1cz86IG51bWJlcjtcblxuICBmbGV4RGlyZWN0aW9uPzogJ2NvbHVtbicgfCAncm93JztcbiAgZmxleFNocmluaz86IG51bWJlcjtcbiAgZmxleEdyb3c/OiBudW1iZXI7XG4gIGZsZXhXcmFwPzogJ3dyYXAnIHwgJ25vd3JhcCc7XG4gIGp1c3RpZnlDb250ZW50PzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3NwYWNlLWJldHdlZW4nIHwgJ3NwYWNlLWFyb3VuZCc7XG4gIGFsaWduSXRlbXM/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIGFsaWduU2VsZj86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgcG9zaXRpb24/OiAncmVsYXRpdmUnIHwgJ2Fic29sdXRlJztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcbn1cblxuZXhwb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfTtcbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgY3JlYXRlQ2FudmFzIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgREVGQVVMVF9GT05UX0ZBTUlMWSA9ICdQaW5nRmFuZ1NDLVJlZ3VsYXIsIHNhbnMtc2VyaWYnO1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuXG5jb25zdCBnZXRDb250ZXh0ID0gKCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9PiB7XG4gIGlmIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBjb25zdCBjYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IDE7XG4gIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuXG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCk7XG5cbiAgY29udGV4dC5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnbm9ybWFsJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuXG4gIHJldHVybiBjb250ZXh0Lm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCh2YWx1ZTogc3RyaW5nKSB7XG4gIHJldHVybiBnZXRDb250ZXh0KCkubWVhc3VyZVRleHQodmFsdWUpLndpZHRoIHx8IDA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGV4dChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXG4gIGxldCBtYXhXaWR0aCA9IHN0eWxlLndpZHRoIGFzIG51bWJlcjtcbiAgY29uc3Qgd29yZFdpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG5cbiAgLy8g5a+55paH5a2X5rqi5Ye655qE5aSE55CG77yM6buY6K6k55SoLi4uXG4gIGNvbnN0IHRleHRPdmVyZmxvdyA9IHN0eWxlLnRleHRPdmVyZmxvdyB8fCAnZWxsaXBzaXMnO1xuXG4gIC8vIOaWh+Wtl+acgOWkp+mVv+W6puS4jei2hemZkOWItlxuICBpZiAod29yZFdpZHRoIDw9IG1heFdpZHRoKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLy8g5a+55LqO55So54K554K554K55aSE55CG55qE5oOF5Ya177yM5YWI5bCG5pyA5aSn5a695bqm5YeP5Y67Li4u55qE5a695bqmXG4gIGlmICh0ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICBtYXhXaWR0aCAtPSBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCgnLi4uJyk7XG4gIH1cblxuICBsZXQgbGVuZ3RoID0gdmFsdWUubGVuZ3RoIC0gMTtcbiAgbGV0IHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuXG4gIHdoaWxlIChnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udChzdHIpID4gbWF4V2lkdGggJiYgbGVuZ3RoID4gMCkge1xuICAgIGxlbmd0aCAtPSAxO1xuICAgIHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIChsZW5ndGggJiYgdGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnXG4gICAgPyBgJHtzdHJ9Li4uYFxuICAgIDogc3RyKTtcbn1cblxuaW50ZXJmYWNlIElUZXh0UHJvcHMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIHZhbHVlc3JjID0gJyc7XG4gIHByaXZhdGUgb3JpZ2luU3R5bGVXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZSA9ICd0b3AnO1xuICBwdWJsaWMgZm9udCA9ICcnO1xuICBwdWJsaWMgdGV4dEFsaWduOiBDYW52YXNUZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHB1YmxpYyBmaWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVGV4dFByb3BzKSB7XG4gICAgbGV0IG9yaWdpblN0eWxlV2lkdGggPSBzdHlsZS53aWR0aDtcbiAgICAvLyDmsqHmnInorr7nva7lrr3luqbnmoTml7blgJnpgJrov4djYW52YXPorqHnrpflh7rmloflrZflrr3luqZcbiAgICBpZiAob3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlVGV4dChzdHlsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgfHwgc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdUZXh0JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuICAgIHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9IG9yaWdpblN0eWxlV2lkdGg7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWUpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIGlmICh0aGlzLm9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBwYXJzZVRleHQodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG4gICAgICBsZXQgeyBwYXJlbnQgfSA9IHRoaXM7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0NhbnZhc0RhdGEoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuXG4gICAgdGhpcy5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdGhpcy5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke0RFRkFVTFRfRk9OVF9GQU1JTFl9YDtcbiAgICB0aGlzLnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbiB8fCAnbGVmdCc7XG4gICAgdGhpcy5maWxsU3R5bGUgPSBzdHlsZS5jb2xvciB8fCAnIzAwMCc7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudG9DYW52YXNEYXRhKCk7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjdHgudGV4dEJhc2VsaW5lID0gdGhpcy50ZXh0QmFzZWxpbmU7XG4gICAgY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgY3R4LnRleHRBbGlnbiA9IHRoaXMudGV4dEFsaWduO1xuXG4gICAgbGV0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBsZXQgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG5cbiAgICBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBkcmF3WCArPSBib3gud2lkdGggLyAyO1xuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgIGRyYXdYICs9IGJveC53aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUubGluZUhlaWdodCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgZHJhd1kgKz0gKHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyKSAvIDI7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxUZXh0KFxuICAgICAgdGhpcy52YWx1ZSxcbiAgICAgIGRyYXdYLFxuICAgICAgZHJhd1ksXG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1ZpZXcnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgLy8g5pyJ5Lqb6IqC54K55LuF5LuF5L2c5Li65a655Zmo77yM5a6e6ZmF5LiK5LiN6ZyA6KaB5Lu75L2V5riy5p+T6YC76L6R77yM6L+Z6YeM5Yqg5Liq5Yik5pat5Y+v5Lul5o+Q6auY5oCn6IO9XG4gIGNoZWNrTmVlZFJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciB9ID0gc3R5bGU7XG5cbiAgICByZXR1cm4gISEoc3R5bGUuYmFja2dyb3VuZENvbG9yXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyV2lkdGggJiYgYm9yZGVyQ29sb3IpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyVG9wV2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlclRvcENvbG9yKSlcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyQm90dG9tQ29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlckxlZnRXaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyTGVmdENvbG9yKSlcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJSaWdodFdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJSaWdodENvbG9yKSkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICAvLyBjb25zdCB7IGN0eCB9ID0gdGhpcztcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBib3JkZXJXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG4gICAgY29uc3QgZHJhd1ggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IGJvcmRlckxlZnRXaWR0aCA9IHN0eWxlLmJvcmRlckxlZnRXaWR0aCB8fCBib3JkZXJXaWR0aDtcbiAgICBjb25zdCBib3JkZXJSaWdodFdpZHRoID0gc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCB8fCBib3JkZXJXaWR0aDtcbiAgICBjb25zdCBib3JkZXJUb3BXaWR0aCA9IHN0eWxlLmJvcmRlclRvcFdpZHRoIHx8IGJvcmRlcldpZHRoO1xuICAgIGNvbnN0IGJvcmRlckJvdHRvbVdpZHRoID0gc3R5bGUuYm9yZGVyQm90dG9tV2lkdGggfHwgYm9yZGVyV2lkdGg7XG5cbiAgICAvLyB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChcbiAgICAgICAgZHJhd1ggKyBib3JkZXJMZWZ0V2lkdGgsXG4gICAgICAgIGRyYXdZICsgYm9yZGVyUmlnaHRXaWR0aCxcbiAgICAgICAgYm94LndpZHRoIC0gKGJvcmRlckxlZnRXaWR0aCArIGJvcmRlclJpZ2h0V2lkdGgpLFxuICAgICAgICBib3guaGVpZ2h0IC0gKGJvcmRlclRvcFdpZHRoICsgYm9yZGVyQm90dG9tV2lkdGgpLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG59XG4iLCJpZiAodHlwZW9mIEdhbWVHbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gIEdhbWVHbG9iYWwuX19lbnYgPSBHYW1lR2xvYmFsLnd4IHx8IEdhbWVHbG9iYWwudHQgfHwgR2FtZUdsb2JhbC5zd2FuO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGNvbnZlcnRUb0pzb24gPSBmdW5jdGlvbihub2RlLCBvcHRpb25zKSB7XG4gIGNvbnN0IGpPYmogPSB7XG4gICAgbmFtZTogbm9kZS50YWduYW1lXG4gIH07XG5cbiAgLy93aGVuIG5vIGNoaWxkIG5vZGUgb3IgYXR0ciBpcyBwcmVzZW50XG4gIGlmICgoIW5vZGUuY2hpbGQgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuY2hpbGQpKSAmJiAoIW5vZGUuYXR0cnNNYXAgfHwgdXRpbC5pc0VtcHR5T2JqZWN0KG5vZGUuYXR0cnNNYXApKSkge1xuICAgIHJldHVybiB1dGlsLmlzRXhpc3Qobm9kZS52YWwpICYmICEhbm9kZS52YWwgPyBub2RlLnZhbCA6IGpPYmo7XG4gIH0gZWxzZSB7XG4gICAgLy9vdGhlcndpc2UgY3JlYXRlIGEgdGV4dG5vZGUgaWYgbm9kZSBoYXMgc29tZSB0ZXh0XG4gICAgaWYgKHV0aWwuaXNFeGlzdChub2RlLnZhbCkpIHtcbiAgICAgIGlmICghKHR5cGVvZiBub2RlLnZhbCA9PT0gJ3N0cmluZycgJiYgKG5vZGUudmFsID09PSAnJyB8fCBub2RlLnZhbCA9PT0gb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcikpKSB7XG4gICAgICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSBcInN0cmljdFwiKXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IFsgbm9kZS52YWwgXTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBub2RlLnZhbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgdXRpbC5tZXJnZShqT2JqLCBub2RlLmF0dHJzTWFwLCBvcHRpb25zLmFycmF5TW9kZSk7XG5cbiAgak9iai5jaGlsZHJlbiA9IFtdO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goIGNoaWxkID0+IHtcbiAgICBqT2JqLmNoaWxkcmVuLnB1c2goY29udmVydFRvSnNvbihjaGlsZCwgb3B0aW9ucykpXG4gIH0pO1xuXG4gIC8vIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhub2RlLmNoaWxkKTtcbiAgLy8gZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGtleXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gIC8vICAgdmFyIHRhZ25hbWUgPSBrZXlzW2luZGV4XTtcbiAgLy8gICBpZiAobm9kZS5jaGlsZFt0YWduYW1lXSAmJiBub2RlLmNoaWxkW3RhZ25hbWVdLmxlbmd0aCA+IDEpIHtcbiAgLy8gICAgIGpPYmpbdGFnbmFtZV0gPSBbXTtcbiAgLy8gICAgIGZvciAodmFyIHRhZyBpbiBub2RlLmNoaWxkW3RhZ25hbWVdKSB7XG4gIC8vICAgICAgIGpPYmpbdGFnbmFtZV0ucHVzaChjb252ZXJ0VG9Kc29uKG5vZGUuY2hpbGRbdGFnbmFtZV1bdGFnXSwgb3B0aW9ucykpO1xuICAvLyAgICAgfVxuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gdHJ1ZSl7XG4gIC8vICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRUb0pzb24obm9kZS5jaGlsZFt0YWduYW1lXVswXSwgb3B0aW9ucylcbiAgLy8gICAgICAgaWYodHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcpXG4gIC8vICAgICAgICAgak9ialt0YWduYW1lXSA9IFsgcmVzdWx0IF07XG4gIC8vICAgICAgIGVsc2VcbiAgLy8gICAgICAgICBqT2JqW3RhZ25hbWVdID0gcmVzdWx0O1xuICAvLyAgICAgfWVsc2UgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IFwic3RyaWN0XCIpe1xuICAvLyAgICAgICBqT2JqW3RhZ25hbWVdID0gW2NvbnZlcnRUb0pzb24obm9kZS5jaGlsZFt0YWduYW1lXVswXSwgb3B0aW9ucykgXTtcbiAgLy8gICAgIH1lbHNle1xuICAvLyAgICAgICBqT2JqW3RhZ25hbWVdID0gY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdWzBdLCBvcHRpb25zKTtcbiAgLy8gICAgIH1cbiAgLy8gICB9XG4gIC8vIH1cblxuICAvL2FkZCB2YWx1ZVxuICByZXR1cm4gak9iajtcbn07XG5cbmV4cG9ydHMuY29udmVydFRvSnNvbiA9IGNvbnZlcnRUb0pzb247XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5vZGVUb0pzb24gPSByZXF1aXJlKCcuL25vZGUyanNvbicpO1xuY29uc3QgeG1sVG9Ob2Rlb2JqID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgeDJ4bWxub2RlID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMsIHZhbGlkYXRpb25PcHRpb24pIHtcbiAgIGlmKCB2YWxpZGF0aW9uT3B0aW9uKXtcbiAgICAgaWYodmFsaWRhdGlvbk9wdGlvbiA9PT0gdHJ1ZSkgdmFsaWRhdGlvbk9wdGlvbiA9IHt9XG5cbiAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yLnZhbGlkYXRlKHhtbERhdGEsIHZhbGlkYXRpb25PcHRpb24pO1xuICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgdGhyb3cgRXJyb3IoIHJlc3VsdC5lcnIubXNnKVxuICAgICB9XG4gICB9XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgeDJ4bWxub2RlLmRlZmF1bHRPcHRpb25zLCB4MnhtbG5vZGUucHJvcHMpO1xuICByZXR1cm4gbm9kZVRvSnNvbi5jb252ZXJ0VG9Kc29uKHhtbFRvTm9kZW9iai5nZXRUcmF2ZXJzYWxPYmooeG1sRGF0YSwgb3B0aW9ucyksIG9wdGlvbnMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRBbGxNYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgd2hpbGUgKG1hdGNoKSB7XG4gICAgY29uc3QgYWxsbWF0Y2hlcyA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCsrKSB7XG4gICAgICBhbGxtYXRjaGVzLnB1c2gobWF0Y2hbaW5kZXhdKTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGFsbG1hdGNoZXMpO1xuICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB9XG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuY29uc3QgZG9lc01hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgcmV0dXJuICEobWF0Y2ggPT09IG51bGwgfHwgdHlwZW9mIG1hdGNoID09PSAndW5kZWZpbmVkJyk7XG59O1xuXG5jb25zdCBkb2VzTm90TWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIHJldHVybiAhZG9lc01hdGNoKHN0cmluZywgcmVnZXgpO1xufTtcblxuZXhwb3J0cy5pc0V4aXN0ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgIT09ICd1bmRlZmluZWQnO1xufTtcblxuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbi8qKlxuICogQ29weSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYSBpbnRvIGIuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHBhcmFtIHsqfSBhXG4gKi9cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIGEsIGFycmF5TW9kZSkge1xuICBpZiAoYSkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhKTsgLy8gd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Ygb3duIHByb3BlcnRpZXNcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmKGFycmF5TW9kZSA9PT0gJ3N0cmljdCcpe1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBbIGFba2V5c1tpXV0gXTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBhW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbi8qIGV4cG9ydHMubWVyZ2UgPWZ1bmN0aW9uIChiLGEpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihiLGEpO1xufSAqL1xuXG5leHBvcnRzLmdldFZhbHVlID0gZnVuY3Rpb24odikge1xuICBpZiAoZXhwb3J0cy5pc0V4aXN0KHYpKSB7XG4gICAgcmV0dXJuIHY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vLyBjb25zdCBmYWtlQ2FsbCA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gYTt9O1xuLy8gY29uc3QgZmFrZUNhbGxOb1JldHVybiA9IGZ1bmN0aW9uKCkge307XG5cbmV4cG9ydHMuYnVpbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKSB7XG4gIHZhciBuZXdPcHRpb25zID0ge307XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybiBkZWZhdWx0T3B0aW9uczsgLy9pZiB0aGVyZSBhcmUgbm90IG9wdGlvbnNcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1twcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBvcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBkZWZhdWx0T3B0aW9uc1twcm9wc1tpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdPcHRpb25zO1xufTtcblxuZXhwb3J0cy5kb2VzTWF0Y2ggPSBkb2VzTWF0Y2g7XG5leHBvcnRzLmRvZXNOb3RNYXRjaCA9IGRvZXNOb3RNYXRjaDtcbmV4cG9ydHMuZ2V0QWxsTWF0Y2hlcyA9IGdldEFsbE1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL0EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgbG9jYWxlUmFuZ2U6ICdhLXpBLVonLFxufTtcblxuY29uc3QgcHJvcHMgPSBbJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLCAnbG9jYWxlUmFuZ2UnXTtcblxuLy9jb25zdCB0YWdzUGF0dGVybiA9IG5ldyBSZWdFeHAoXCI8XFxcXC8/KFtcXFxcdzpcXFxcLV9cXC5dKylcXFxccypcXC8/PlwiLFwiZ1wiKTtcbmV4cG9ydHMudmFsaWRhdGUgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB1dGlsLmJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIlwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXlxccyo8XFw/eG1sLio/XFw/PikvZyxcIlwiKTsvL1JlbW92ZSBYTUwgc3RhcnRpbmcgdGFnXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKDwhRE9DVFlQRVtcXHNcXHdcXFwiXFwuXFwvXFwtXFw6XSsoXFxbLipcXF0pKlxccyo+KS9nLFwiXCIpOy8vUmVtb3ZlIERPQ1RZUEVcblxuICBjb25zdCB0YWdzID0gW107XG4gIGxldCB0YWdGb3VuZCA9IGZhbHNlO1xuICBpZiAoeG1sRGF0YVswXSA9PT0gJ1xcdWZlZmYnKSB7XG4gICAgLy8gY2hlY2sgZm9yIGJ5dGUgb3JkZXIgbWFyayAoQk9NKVxuICAgIHhtbERhdGEgPSB4bWxEYXRhLnN1YnN0cigxKTtcbiAgfVxuICBjb25zdCByZWd4QXR0ck5hbWUgPSBuZXcgUmVnRXhwKCdeW193XVtcXFxcd1xcXFwtLjpdKiQnLnJlcGxhY2UoJ193JywgJ18nICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBjb25zdCByZWd4VGFnTmFtZSA9IG5ldyBSZWdFeHAoJ14oW3ddfF8pW1xcXFx3LlxcXFwtXzpdKicucmVwbGFjZSgnKFt3JywgJyhbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgLy9zdGFydGluZyBvZiB0YWdcbiAgICAgIC8vcmVhZCB1bnRpbCB5b3UgcmVhY2ggdG8gJz4nIGF2b2lkaW5nIGFueSAnPicgaW4gYXR0cmlidXRlIHZhbHVlXG5cbiAgICAgIGkrKztcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPycpIHtcbiAgICAgICAgaSA9IHJlYWRQSSh4bWxEYXRhLCArK2kpO1xuICAgICAgICBpZiAoaS5lcnIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnIScpIHtcbiAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsb3NpbmdUYWcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcvJykge1xuICAgICAgICAgIC8vY2xvc2luZyB0YWdcbiAgICAgICAgICBjbG9zaW5nVGFnID0gdHJ1ZTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWFkIHRhZ25hbWVcbiAgICAgICAgbGV0IHRhZ05hbWUgPSAnJztcbiAgICAgICAgZm9yIChcbiAgICAgICAgICA7XG4gICAgICAgICAgaSA8IHhtbERhdGEubGVuZ3RoICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJz4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJyAnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcdCcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxuJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHInO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICB0YWdOYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUudHJpbSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRhZ05hbWUpO1xuXG4gICAgICAgIGlmICh0YWdOYW1lW3RhZ05hbWUubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZyB3aXRob3V0IGF0dHJpYnV0ZXNcbiAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHJpbmcoMCwgdGFnTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbGlkYXRlVGFnTmFtZSh0YWdOYW1lLCByZWd4VGFnTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnVGFnICcgKyB0YWdOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ0F0dHJpYnV0ZXMgZm9yIFwiJyArIHRhZ05hbWUgKyAnXCIgaGF2ZSBvcGVuIHF1b3RlLid9fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0clN0ciA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaSA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgICBpZiAoYXR0clN0clthdHRyU3RyLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICBhdHRyU3RyID0gYXR0clN0ci5zdWJzdHJpbmcoMCwgYXR0clN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgLy9jb250aW51ZTsgLy90ZXh0IG1heSBwcmVzZW50cyBhZnRlciBzZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjbG9zaW5nVGFnKSB7XG4gICAgICAgICAgaWYoIXJlc3VsdC50YWdDbG9zZWQpe1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGRvbid0IGhhdmUgcHJvcGVyIGNsb3NpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9ZWxzZSBpZiAoYXR0clN0ci50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGNhbid0IGhhdmUgYXR0cmlidXRlcyBvciBpbnZhbGlkIHN0YXJ0aW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG90ZyA9IHRhZ3MucG9wKCk7XG4gICAgICAgICAgICBpZiAodGFnTmFtZSAhPT0gb3RnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyAnICsgb3RnICsgJyBpcyBleHBlY3RlZCBpbnBsYWNlIG9mICcgKyB0YWdOYW1lICsgJy4nfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWdzLnB1c2godGFnTmFtZSk7XG4gICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9za2lwIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIC8vSXQgbWF5IGluY2x1ZGUgY29tbWVudHMgYW5kIENEQVRBIHZhbHVlXG4gICAgICAgIGZvciAoaSsrOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICAgIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgICAgIC8vY29tbWVudCBvciBDQURBVEFcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy9lbmQgb2YgcmVhZGluZyB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnICcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcdCcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcbicgfHwgeG1sRGF0YVtpXSA9PT0gJ1xccicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQ2hhcicsIG1zZzogJ2NoYXIgJyArIHhtbERhdGFbaV0gKyAnIGlzIG5vdCBleHBlY3RlZCAuJ319O1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGFnRm91bmQpIHtcbiAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnU3RhcnQgdGFnIGV4cGVjdGVkLid9fTtcbiAgfSBlbHNlIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdJbnZhbGlkICcgKyBKU09OLnN0cmluZ2lmeSh0YWdzLCBudWxsLCA0KS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKSArICcgZm91bmQuJ30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWFkIFByb2Nlc3NpbmcgaW5zc3RydWN0aW9ucyBhbmQgc2tpcFxuICogQHBhcmFtIHsqfSB4bWxEYXRhXG4gKiBAcGFyYW0geyp9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZFBJKHhtbERhdGEsIGkpIHtcbiAgdmFyIHN0YXJ0ID0gaTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT0gJz8nIHx8IHhtbERhdGFbaV0gPT0gJyAnKSB7XG4gICAgICAvL3RhZ25hbWVcbiAgICAgIHZhciB0YWduYW1lID0geG1sRGF0YS5zdWJzdHIoc3RhcnQsIGkgLSBzdGFydCk7XG4gICAgICBpZiAoaSA+IDUgJiYgdGFnbmFtZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1hNTCBkZWNsYXJhdGlvbiBhbGxvd2VkIG9ubHkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudC4nfX07XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT0gJz8nICYmIHhtbERhdGFbaSArIDFdID09ICc+Jykge1xuICAgICAgICAvL2NoZWNrIGlmIHZhbGlkIGF0dHJpYnV0IHN0cmluZ1xuICAgICAgICBpKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpO1xufVxuXG5mdW5jdGlvbiByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpIHtcbiAgaWYgKHhtbERhdGEubGVuZ3RoID4gaSArIDUgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJy0nKSB7XG4gICAgLy9jb21tZW50XG4gICAgZm9yIChpICs9IDM7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA4ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnTycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnWScgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ1AnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdFJ1xuICApIHtcbiAgICBsZXQgYW5nbGVCcmFja2V0c0NvdW50ID0gMTtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQtLTtcbiAgICAgICAgaWYgKGFuZ2xlQnJhY2tldHNDb3VudCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDkgJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ1snICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ1snXG4gICkge1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaTtcbn1cblxudmFyIGRvdWJsZVF1b3RlID0gJ1wiJztcbnZhciBzaW5nbGVRdW90ZSA9IFwiJ1wiO1xuXG4vKipcbiAqIEtlZXAgcmVhZGluZyB4bWxEYXRhIHVudGlsICc8JyBpcyBmb3VuZCBvdXRzaWRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30geG1sRGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKSB7XG4gIGxldCBhdHRyU3RyID0gJyc7XG4gIGxldCBzdGFydENoYXIgPSAnJztcbiAgbGV0IHRhZ0Nsb3NlZCA9IGZhbHNlO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gZG91YmxlUXVvdGUgfHwgeG1sRGF0YVtpXSA9PT0gc2luZ2xlUXVvdGUpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9IHhtbERhdGFbaV07XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0Q2hhciAhPT0geG1sRGF0YVtpXSkge1xuICAgICAgICAvL2lmIHZhdWUgaXMgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGUgdGhlbiBzaW5nbGUgcXVvdGVzIGFyZSBhbGxvd2VkIGluc2lkZSB0aGUgdmFsdWUgYW5kIHZpY2UgdmVyc2FcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydENoYXIgPSAnJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgdGFnQ2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGF0dHJTdHIgKz0geG1sRGF0YVtpXTtcbiAgfVxuICBpZiAoc3RhcnRDaGFyICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7dmFsdWU6IGF0dHJTdHIsIGluZGV4OiBpLCB0YWdDbG9zZWQ6IHRhZ0Nsb3NlZH07XG59XG5cbi8qKlxuICogU2VsZWN0IGFsbCB0aGUgYXR0cmlidXRlcyB3aGV0aGVyIHZhbGlkIG9yIGludmFsaWQuXG4gKi9cbmNvbnN0IHZhbGlkQXR0clN0clJlZ3hwID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoW15cXFxccz1dKykoXFxcXHMqPSk/KFxcXFxzKihbXFwnXCJdKSgoW1xcXFxzXFxcXFNdKSo/KVxcXFw1KT8nLCAnZycpO1xuXG4vL2F0dHIsID1cInNkXCIsIGE9XCJhbWl0J3NcIiwgYT1cInNkXCJiPVwic2FmXCIsIGFiICBjZD1cIlwiXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSkge1xuICAvL2NvbnNvbGUubG9nKFwic3RhcnQ6XCIrYXR0clN0citcIjplbmRcIik7XG5cbiAgLy9pZihhdHRyU3RyLnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlOyAvL2VtcHR5IHN0cmluZ1xuXG4gIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgdmFsaWRBdHRyU3RyUmVneHApO1xuICBjb25zdCBhdHRyTmFtZXMgPSB7fTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NvbnNvbGUubG9nKG1hdGNoZXNbaV0pO1xuXG4gICAgaWYgKG1hdGNoZXNbaV1bMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAvL25vc3BhY2UgYmVmb3JlIGF0dHJpYnV0ZSBuYW1lOiBhPVwic2RcImI9XCJzYWZcIlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGhhcyBubyBzcGFjZSBpbiBzdGFydGluZy4nfX07XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzW2ldWzNdID09PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgLy9pbmRlcGVuZGVudCBhdHRyaWJ1dGU6IGFiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2Jvb2xlYW4gYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBpcyBub3QgYWxsb3dlZC4nfX07XG4gICAgfVxuICAgIC8qIGVsc2UgaWYobWF0Y2hlc1tpXVs2XSA9PT0gdW5kZWZpbmVkKXsvL2F0dHJpYnV0ZSB3aXRob3V0IHZhbHVlOiBhYj1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiB7IGNvZGU6XCJJbnZhbGlkQXR0clwiLG1zZzpcImF0dHJpYnV0ZSBcIiArIG1hdGNoZXNbaV1bMl0gKyBcIiBoYXMgbm8gdmFsdWUgYXNzaWduZWQuXCJ9fTtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgY29uc3QgYXR0ck5hbWUgPSBtYXRjaGVzW2ldWzJdO1xuICAgIGlmICghdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSkge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgIH1cbiAgICAvKmlmICghYXR0ck5hbWVzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkgeyovXG4gICAgaWYgKCAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJOYW1lcywgYXR0ck5hbWUpKSB7XG4gICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGUgYXR0cmlidXRlLlxuICAgICAgYXR0ck5hbWVzW2F0dHJOYW1lXSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgcmVwZWF0ZWQuJ319O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IC9eW19hLXpBLVpdW1xcd1xcLS46XSokLztcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSB7XG4gIC8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gbmV3IFJlZ0V4cChyZWd4QXR0ck5hbWUpO1xuICByZXR1cm4gdXRpbC5kb2VzTWF0Y2goYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSk7XG59XG5cbi8vY29uc3Qgc3RhcnRzV2l0aFhNTCA9IG5ldyBSZWdFeHAoXCJeW1h4XVtNbV1bTGxdXCIpO1xuLy8gIHN0YXJ0c1dpdGggPSAvXihbYS16QS1aXXxfKVtcXHcuXFwtXzpdKi87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVGFnTmFtZSh0YWduYW1lLCByZWd4VGFnTmFtZSkge1xuICAvKmlmKHV0aWwuZG9lc01hdGNoKHRhZ25hbWUsc3RhcnRzV2l0aFhNTCkpIHJldHVybiBmYWxzZTtcbiAgICBlbHNlKi9cbiAgcmV0dXJuICF1dGlsLmRvZXNOb3RNYXRjaCh0YWduYW1lLCByZWd4VGFnTmFtZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFnbmFtZSwgcGFyZW50LCB2YWwpIHtcbiAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuY2hpbGQgPSB7fTsgLy9jaGlsZCB0YWdzXG4gIHRoaXMuYXR0cnNNYXAgPSB7fTsgLy9hdHRyaWJ1dGVzIG1hcFxuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMudmFsID0gdmFsOyAvL3RleHQgb25seVxuICB0aGlzLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0pKSB7XG4gICAgICAvL2FscmVhZHkgcHJlc2VudHNcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0gPSBbY2hpbGRdO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHhtbE5vZGUgPSByZXF1aXJlKCcuL3htbE5vZGUnKTtcbmNvbnN0IFRhZ1R5cGUgPSB7T1BFTklORzogMSwgQ0xPU0lORzogMiwgU0VMRjogMywgQ0RBVEE6IDR9O1xubGV0IHJlZ3ggPVxuICAnPCgoIVxcXFxbQ0RBVEFcXFxcWyhbXFxcXHNcXFxcU10qPykoXV0+KSl8KChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKShbXj5dKik+fCgoXFxcXC8pKChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKVxcXFxzKj4pKShbXjxdKiknO1xuXG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/W1xcXFx3OlxcXFwtXFwuX10rKShbXj5dKik+KFxcXFxzKlwiK2NkYXRhUmVneCtcIikqKFtePF0rKT9cIixcImdcIik7XG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/KSgoXFxcXHcqOik/KFtcXFxcdzpcXFxcLVxcLl9dKykpKFtePl0qKT4oW148XSopKFwiK2NkYXRhUmVneCtcIihbXjxdKikpKihbXjxdKyk/XCIsXCJnXCIpO1xuXG4vL3BvbHlmaWxsXG5pZiAoIU51bWJlci5wYXJzZUludCAmJiB3aW5kb3cucGFyc2VJbnQpIHtcbiAgTnVtYmVyLnBhcnNlSW50ID0gd2luZG93LnBhcnNlSW50O1xufVxuaWYgKCFOdW1iZXIucGFyc2VGbG9hdCAmJiB3aW5kb3cucGFyc2VGbG9hdCkge1xuICBOdW1iZXIucGFyc2VGbG9hdCA9IHdpbmRvdy5wYXJzZUZsb2F0O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYXR0cmlidXRlTmFtZVByZWZpeDogJ0BfJyxcbiAgYXR0ck5vZGVOYW1lOiBmYWxzZSxcbiAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICBpZ25vcmVBdHRyaWJ1dGVzOiB0cnVlLFxuICBpZ25vcmVOYW1lU3BhY2U6IGZhbHNlLFxuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9hIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIC8vaWdub3JlUm9vdEVsZW1lbnQgOiBmYWxzZSxcbiAgcGFyc2VOb2RlVmFsdWU6IHRydWUsXG4gIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICBhcnJheU1vZGU6IGZhbHNlLFxuICB0cmltVmFsdWVzOiB0cnVlLCAvL1RyaW0gc3RyaW5nIHZhbHVlcyBvZiB0YWcgYW5kIGF0dHJpYnV0ZXNcbiAgY2RhdGFUYWdOYW1lOiBmYWxzZSxcbiAgY2RhdGFQb3NpdGlvbkNoYXI6ICdcXFxcYycsXG4gIGxvY2FsZVJhbmdlOiAnJyxcbiAgdGFnVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgYXR0clZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIHN0b3BOb2RlczogW11cbiAgLy9kZWNvZGVTdHJpY3Q6IGZhbHNlLFxufTtcblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5jb25zdCBwcm9wcyA9IFtcbiAgJ2F0dHJpYnV0ZU5hbWVQcmVmaXgnLFxuICAnYXR0ck5vZGVOYW1lJyxcbiAgJ3RleHROb2RlTmFtZScsXG4gICdpZ25vcmVBdHRyaWJ1dGVzJyxcbiAgJ2lnbm9yZU5hbWVTcGFjZScsXG4gICdhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJyxcbiAgJ3BhcnNlTm9kZVZhbHVlJyxcbiAgJ3BhcnNlQXR0cmlidXRlVmFsdWUnLFxuICAnYXJyYXlNb2RlJyxcbiAgJ3RyaW1WYWx1ZXMnLFxuICAnY2RhdGFUYWdOYW1lJyxcbiAgJ2NkYXRhUG9zaXRpb25DaGFyJyxcbiAgJ2xvY2FsZVJhbmdlJyxcbiAgJ3RhZ1ZhbHVlUHJvY2Vzc29yJyxcbiAgJ2F0dHJWYWx1ZVByb2Nlc3NvcicsXG4gICdwYXJzZVRydWVOdW1iZXJPbmx5JyxcbiAgJ3N0b3BOb2Rlcydcbl07XG5leHBvcnRzLnByb3BzID0gcHJvcHM7XG5cbmNvbnN0IGdldFRyYXZlcnNhbE9iaiA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoL1xccj9cXG4vZywgXCIgXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICB4bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC88IS0tW1xcc1xcU10qPy0tPi9nLCAnJyk7IC8vUmVtb3ZlICBjb21tZW50c1xuXG4gIGNvbnN0IHhtbE9iaiA9IG5ldyB4bWxOb2RlKCcheG1sJyk7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHhtbE9iajtcblxuICByZWd4ID0gcmVneC5yZXBsYWNlKC9cXFtcXFxcdy9nLCAnWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlICsgJ1xcXFx3Jyk7XG4gIGNvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChyZWd4LCAnZycpO1xuICBsZXQgdGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgbGV0IG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB3aGlsZSAodGFnKSB7XG4gICAgY29uc3QgdGFnVHlwZSA9IGNoZWNrRm9yVGFnVHlwZSh0YWcpO1xuXG4gICAgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0xPU0lORykge1xuICAgICAgLy9hZGQgcGFyc2VkIGRhdGEgdG8gcGFyZW50IG5vZGVcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnQgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS5wYXJlbnQudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucywgY3VycmVudE5vZGUucGFyZW50LnRhZ25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjdXJyZW50Tm9kZS50YWduYW1lKSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5jaGlsZCA9IFtdXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5hdHRyc01hcCA9PSB1bmRlZmluZWQpIHsgY3VycmVudE5vZGUuYXR0cnNNYXAgPSB7fX1cbiAgICAgICAgY3VycmVudE5vZGUudmFsID0geG1sRGF0YS5zdWJzdHIoY3VycmVudE5vZGUuc3RhcnRJbmRleCArIDEsIHRhZy5pbmRleCAtIGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggLSAxKVxuICAgICAgfVxuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNEQVRBKSB7XG4gICAgICBpZiAob3B0aW9ucy5jZGF0YVRhZ05hbWUpIHtcbiAgICAgICAgLy9hZGQgY2RhdGEgbm9kZVxuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmNkYXRhVGFnTmFtZSwgY3VycmVudE5vZGUsIHRhZ1szXSk7XG4gICAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAvL2ZvciBiYWNrdHJhY2tpbmdcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcjtcbiAgICAgICAgLy9hZGQgcmVzdCB2YWx1ZSB0byBwYXJlbnQgbm9kZVxuICAgICAgICBpZiAodGFnWzE0XSkge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnZhbCArPSBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gKGN1cnJlbnROb2RlLnZhbCB8fCAnJykgKyAodGFnWzNdIHx8ICcnKSArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5TRUxGKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSwgY3VycmVudE5vZGUsICcnKTtcbiAgICAgIGlmICh0YWdbOF0gJiYgdGFnWzhdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFnWzhdID0gdGFnWzhdLnN1YnN0cigwLCB0YWdbOF0ubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVGFnVHlwZS5PUEVOSU5HXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShcbiAgICAgICAgb3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sXG4gICAgICAgIGN1cnJlbnROb2RlLFxuICAgICAgICBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY2hpbGROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGNoaWxkTm9kZS5zdGFydEluZGV4PXRhZy5pbmRleCArIHRhZ1sxXS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlID0gY2hpbGROb2RlO1xuICAgIH1cblxuICAgIHRhZyA9IG5leHRUYWc7XG4gICAgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIH1cblxuICByZXR1cm4geG1sT2JqO1xufTtcblxuZnVuY3Rpb24gcHJvY2Vzc1RhZ1ZhbHVlKHBhcnNlZFRhZ3MsIG9wdGlvbnMsIHBhcmVudFRhZ05hbWUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IHBhcnNlZFRhZ3NbN10gfHwgcGFyZW50VGFnTmFtZTtcbiAgbGV0IHZhbCA9IHBhcnNlZFRhZ3NbMTRdO1xuICBpZiAodmFsKSB7XG4gICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgdmFsID0gdmFsLnRyaW0oKTtcbiAgICB9XG4gICAgdmFsID0gb3B0aW9ucy50YWdWYWx1ZVByb2Nlc3Nvcih2YWwsIHRhZ05hbWUpO1xuICAgIHZhbCA9IHBhcnNlVmFsdWUodmFsLCBvcHRpb25zLnBhcnNlTm9kZVZhbHVlLCBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JUYWdUeXBlKG1hdGNoKSB7XG4gIGlmIChtYXRjaFs0XSA9PT0gJ11dPicpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DREFUQTtcbiAgfSBlbHNlIGlmIChtYXRjaFsxMF0gPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLkNMT1NJTkc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzhdICE9PSAndW5kZWZpbmVkJyAmJiBtYXRjaFs4XS5zdWJzdHIobWF0Y2hbOF0ubGVuZ3RoIC0gMSkgPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLlNFTEY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuT1BFTklORztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlTmFtZVNwYWNlKHRhZ25hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlKSB7XG4gICAgY29uc3QgdGFncyA9IHRhZ25hbWUuc3BsaXQoJzonKTtcbiAgICBjb25zdCBwcmVmaXggPSB0YWduYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgaWYgKHRhZ3NbMF0gPT09ICd4bWxucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICB0YWduYW1lID0gcHJlZml4ICsgdGFnc1sxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhZ25hbWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsLCBzaG91bGRQYXJzZSwgcGFyc2VUcnVlTnVtYmVyT25seSkge1xuICBpZiAoc2hvdWxkUGFyc2UgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBsZXQgcGFyc2VkO1xuICAgIGlmICh2YWwudHJpbSgpID09PSAnJyB8fCBpc05hTih2YWwpKSB7XG4gICAgICBwYXJzZWQgPSB2YWwgPT09ICd0cnVlJyA/IHRydWUgOiB2YWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbC5pbmRleE9mKCcweCcpICE9PSAtMSkge1xuICAgICAgICAvL3N1cHBvcnQgaGV4YSBkZWNpbWFsXG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDE2KTtcbiAgICAgIH0gZWxzZSBpZiAodmFsLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gICAgICAgIHBhcnNlZCA9IFN0cmluZyhwYXJzZWQpID09PSB2YWwgPyBwYXJzZWQgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHV0aWwuaXNFeGlzdCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59XG5cbi8vVE9ETzogY2hhbmdlIHJlZ2V4IHRvIGNhcHR1cmUgTlNcbi8vY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cChcIihbXFxcXHdcXFxcLVxcXFwuXFxcXDpdKylcXFxccyo9XFxcXHMqKFsnXFxcIl0pKCgufFxcbikqPylcXFxcMlwiLFwiZ21cIik7XG5jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKCcoW15cXFxccz1dKylcXFxccyooPVxcXFxzKihbXFwnXCJdKSguKj8pXFxcXDMpPycsICdnJyk7XG5cbmZ1bmN0aW9uIGJ1aWxkQXR0cmlidXRlc01hcChhdHRyU3RyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIHR5cGVvZiBhdHRyU3RyID09PSAnc3RyaW5nJykge1xuICAgIGF0dHJTdHIgPSBhdHRyU3RyLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICAvL2F0dHJTdHIgPSBhdHRyU3RyIHx8IGF0dHJTdHIudHJpbSgpO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCBhdHRyc1JlZ3gpO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoZXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgY29uc3QgYXR0cnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IHJlc29sdmVOYW1lU3BhY2UobWF0Y2hlc1tpXVsxXSwgb3B0aW9ucyk7XG4gICAgICBpZiAoYXR0ck5hbWUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldWzRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gbWF0Y2hlc1tpXVs0XS50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBvcHRpb25zLmF0dHJWYWx1ZVByb2Nlc3NvcihtYXRjaGVzW2ldWzRdLCBhdHRyTmFtZSk7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gcGFyc2VWYWx1ZShcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0sXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlQXR0cmlidXRlVmFsdWUsXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFPYmplY3Qua2V5cyhhdHRycykubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF0dHJOb2RlTmFtZSkge1xuICAgICAgY29uc3QgYXR0ckNvbGxlY3Rpb24gPSB7fTtcbiAgICAgIGF0dHJDb2xsZWN0aW9uW29wdGlvbnMuYXR0ck5vZGVOYW1lXSA9IGF0dHJzO1xuICAgICAgcmV0dXJuIGF0dHJDb2xsZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbn1cblxuZXhwb3J0cy5nZXRUcmF2ZXJzYWxPYmogPSBnZXRUcmF2ZXJzYWxPYmo7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuLyoqXG4gKiBHZW5lcmljIGFuaW1hdGlvbiBjbGFzcyB3aXRoIHN1cHBvcnQgZm9yIGRyb3BwZWQgZnJhbWVzIGJvdGggb3B0aW9uYWwgZWFzaW5nIGFuZCBkdXJhdGlvbi5cbiAqXG4gKiBPcHRpb25hbCBkdXJhdGlvbiBpcyB1c2VmdWwgd2hlbiB0aGUgbGlmZXRpbWUgaXMgZGVmaW5lZCBieSBhbm90aGVyIGNvbmRpdGlvbiB0aGFuIHRpbWVcbiAqIGUuZy4gc3BlZWQgb2YgYW4gYW5pbWF0aW5nIG9iamVjdCwgZXRjLlxuICpcbiAqIERyb3BwZWQgZnJhbWUgbG9naWMgYWxsb3dzIHRvIGtlZXAgdXNpbmcgdGhlIHNhbWUgdXBkYXRlciBsb2dpYyBpbmRlcGVuZGVudCBmcm9tIHRoZSBhY3R1YWxcbiAqIHJlbmRlcmluZy4gVGhpcyBlYXNlcyBhIGxvdCBvZiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBwcmV0dHkgY29tcGxleCB0byBicmVhayBkb3duIGEgc3RhdGVcbiAqIGJhc2VkIG9uIHRoZSBwdXJlIHRpbWUgZGlmZmVyZW5jZS5cbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSgocm9vdC5hbmltYXRlID0ge30pKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgdmFyIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvd1xuICAgIHZhciB0aW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gICAgfTtcbiAgICB2YXIgZGVzaXJlZEZyYW1lcyA9IDYwO1xuICAgIHZhciBtaWxsaXNlY29uZHNQZXJTZWNvbmQgPSAxMDAwO1xuICAgIHZhciBydW5uaW5nID0ge307XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGdpdmVuIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiB3YXMgc3RvcHBlZCAoYWthLCB3YXMgcnVubmluZyBiZWZvcmUpXG4gICAgICovXG4gICAgZXhwb3J0cy5zdG9wID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBjbGVhcmVkID0gKHJ1bm5pbmdbaWRdICE9PSBudWxsKTtcbiAgICAgICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGVhcmVkO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdpdmVuIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgKi9cbiAgICBleHBvcnRzLmlzUnVubmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gcnVubmluZ1tpZF0gIT09IG51bGw7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGVwQ2FsbGJhY2sge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkIG9uIGV2ZXJ5IHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQsIG5vdywgdmlydHVhbCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSB2ZXJpZnlDYWxsYmFjayB7RnVuY3Rpb259IEV4ZWN1dGVkIGJlZm9yZSBldmVyeSBhbmltYXRpb24gc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZENhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oZHJvcHBlZEZyYW1lcywgZmluaXNoZWRBbmltYXRpb24sIG9wdGlvbmFsIHdhc0ZpbmlzaGVkKSB7fWBcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24ge0ludGVnZXJ9IE1pbGxpc2Vjb25kcyB0byBydW4gdGhlIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmdNZXRob2Qge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGVhc2luZyBmdW5jdGlvblxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50KSB7IHJldHVybiBtb2RpZmllZFZhbHVlOyB9YFxuICAgICAqIEBwYXJhbSByb290IHtFbGVtZW50fSBSZW5kZXIgcm9vdC4gVXNlZCBmb3IgaW50ZXJuYWwgdXNhZ2Ugb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IElkZW50aWZpZXIgb2YgYW5pbWF0aW9uLiBDYW4gYmUgdXNlZCB0byBzdG9wIGl0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RhcnQgPSBmdW5jdGlvbiAoc3RlcENhbGxiYWNrLCB2ZXJpZnlDYWxsYmFjaywgY29tcGxldGVkQ2FsbGJhY2ssIGR1cmF0aW9uLCBlYXNpbmdNZXRob2QsIHJvb3QpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGltZSgpO1xuICAgICAgICB2YXIgbGFzdEZyYW1lID0gc3RhcnQ7XG4gICAgICAgIHZhciBwZXJjZW50ID0gMDtcbiAgICAgICAgdmFyIGRyb3BDb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGlkID0gY291bnRlcisrO1xuXG4gICAgICAgIC8vIENvbXBhY3RpbmcgcnVubmluZyBkYiBhdXRvbWF0aWNhbGx5IGV2ZXJ5IGZldyBuZXcgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaWQgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIG5ld1J1bm5pbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHVzZWRJZCBpbiBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3UnVubmluZ1t1c2VkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBuZXdSdW5uaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RlcCBtZXRob2Qgd2hpY2ggaXMgY2FsbGVkIGV2ZXJ5IGZldyBtaWxsaXNlY29uZHNcbiAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAodmlydHVhbCkge1xuXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgdmlydHVhbCB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IHZpcnR1YWwgIT09IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWVcbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lKCk7XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBpcyBleGVjdXRlZCBiZWZvcmUgbmV4dCBhbmltYXRpb24gc3RlcFxuICAgICAgICAgICAgaWYgKCFydW5uaW5nW2lkXSB8fCAodmVyaWZ5Q2FsbGJhY2sgJiYgIXZlcmlmeUNhbGxiYWNrKGlkKSkpIHtcblxuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBjdXJyZW50IHJlbmRlcmluZyB0byBhcHBseSBsZXQncyB1cGRhdGUgb21pdHRlZCBzdGVwcyBpbiBtZW1vcnkuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byBicmluZyBpbnRlcm5hbCBzdGF0ZSB2YXJpYWJsZXMgdXAtdG8tZGF0ZSB3aXRoIHByb2dyZXNzIGluIHRpbWUuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHJvcHBlZEZyYW1lcyA9IE1hdGgucm91bmQoKG5vdyAtIGxhc3RGcmFtZSkgLyAobWlsbGlzZWNvbmRzUGVyU2Vjb25kIC8gZGVzaXJlZEZyYW1lcykpIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGgubWluKGRyb3BwZWRGcmFtZXMsIDQpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBwZXJjZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKG5vdyAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgc3RlcCBjYWxsYmFjaywgdGhlbi4uLlxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWFzaW5nTWV0aG9kID8gZWFzaW5nTWV0aG9kKHBlcmNlbnQpIDogcGVyY2VudDtcbiAgICAgICAgICAgIGlmICgoc3RlcENhbGxiYWNrKHZhbHVlLCBub3csIHJlbmRlcikgPT09IGZhbHNlIHx8IHBlcmNlbnQgPT09IDEpICYmIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIHBlcmNlbnQgPT09IDEgfHwgZHVyYXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgIGxhc3RGcmFtZSA9IG5vdztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyayBhcyBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmdbaWRdID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbml0IGZpcnN0IHN0ZXBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuXG4gICAgICAgIC8vIFJldHVybiB1bmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5pbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xudmFyIE5PT1AgPSBmdW5jdGlvbiAoKSB7IH07XG5cbi8vIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcbiAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcbiAgfVxuXG4gIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLCAzKSArIDIpO1xufTtcblxuXG4vKipcbiAqIEEgcHVyZSBsb2dpYyAnY29tcG9uZW50JyBmb3IgJ3ZpcnR1YWwnIHNjcm9sbGluZy96b29taW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB4LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1g6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHktYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWTogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBhbmltYXRpb25zIGZvciBkZWNlbGVyYXRpb24sIHNuYXAgYmFjaywgem9vbWluZyBhbmQgc2Nyb2xsaW5nICovXG4gICAgICBhbmltYXRpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBkdXJhdGlvbiBmb3IgYW5pbWF0aW9ucyB0cmlnZ2VyZWQgYnkgc2Nyb2xsVG8vem9vbVRvICovXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogMjUwLFxuXG4gICAgICAvKiogRW5hYmxlIGJvdW5jaW5nIChjb250ZW50IGNhbiBiZSBzbG93bHkgbW92ZWQgb3V0c2lkZSBhbmQganVtcHMgYmFjayBhZnRlciByZWxlYXNpbmcpICovXG4gICAgICBib3VuY2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBsb2NraW5nIHRvIHRoZSBtYWluIGF4aXMgaWYgdXNlciBtb3ZlcyBvbmx5IHNsaWdodGx5IG9uIG9uZSBvZiB0aGVtIGF0IHN0YXJ0ICovXG4gICAgICBsb2NraW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHBhZ2luYXRpb24gbW9kZSAoc3dpdGNoaW5nIGJldHdlZW4gZnVsbCBwYWdlIGNvbnRlbnQgcGFuZXMpICovXG4gICAgICBwYWdpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHNuYXBwaW5nIG9mIGNvbnRlbnQgdG8gYSBjb25maWd1cmVkIHBpeGVsIGdyaWQgKi9cbiAgICAgIHNuYXBwaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSB6b29taW5nIG9mIGNvbnRlbnQgdmlhIEFQSSwgZmluZ2VycyBhbmQgbW91c2Ugd2hlZWwgKi9cbiAgICAgIHpvb21pbmc6IGZhbHNlLFxuXG4gICAgICAvKiogTWluaW11bSB6b29tIGxldmVsICovXG4gICAgICBtaW5ab29tOiAwLjUsXG5cbiAgICAgIC8qKiBNYXhpbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1heFpvb206IDMsXG5cbiAgICAgIC8qKiBNdWx0aXBseSBvciBkZWNyZWFzZSBzY3JvbGxpbmcgc3BlZWQgKiovXG4gICAgICBzcGVlZE11bHRpcGxpZXI6IDEsXG5cbiAgICAgIC8qKiBDYWxsYmFjayB0aGF0IGlzIGZpcmVkIG9uIHRoZSBsYXRlciBvZiB0b3VjaCBlbmQgb3IgZGVjZWxlcmF0aW9uIGVuZCxcbiAgICAgICAgICBwcm92aWRlZCB0aGF0IGFub3RoZXIgc2Nyb2xsaW5nIGFjdGlvbiBoYXMgbm90IGJlZ3VuLiBVc2VkIHRvIGtub3dcbiAgICAgICAgICB3aGVuIHRvIGZhZGUgb3V0IGEgc2Nyb2xsYmFyLiAqL1xuICAgICAgc2Nyb2xsaW5nQ29tcGxldGU6IE5PT1AsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uOiAwLjAzLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjogMC4wOFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgLypcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgSU5URVJOQUwgRklFTERTIDo6IFNUQVRVU1xuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgb25seSBhIHNpbmdsZSBmaW5nZXIgaXMgdXNlZCBpbiB0b3VjaCBoYW5kbGluZyAqL1xuICBfX2lzU2luZ2xlVG91Y2ggPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSB0b3VjaCBldmVudCBzZXF1ZW5jZSBpcyBpbiBwcm9ncmVzcyAqL1xuICBfX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uIHdlbnQgdG8gY29tcGxldGlvbi4gKi9cbiAgX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciBhIGdlc3R1cmUgem9vbS9yb3RhdGUgZXZlbnQgaXMgaW4gcHJvZ3Jlc3MuIEFjdGl2YXRlcyB3aGVuXG4gICAqIGEgZ2VzdHVyZXN0YXJ0IGV2ZW50IGhhcHBlbnMuIFRoaXMgaGFzIGhpZ2hlciBwcmlvcml0eSB0aGFuIGRyYWdnaW5nLlxuICAgKi9cbiAgX19pc0dlc3R1cmluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgdXNlciBoYXMgbW92ZWQgYnkgc3VjaCBhIGRpc3RhbmNlIHRoYXQgd2UgaGF2ZSBlbmFibGVkXG4gICAqIGRyYWdnaW5nIG1vZGUuIEhpbnQgPSBJdCdzIG9ubHkgZW5hYmxlZCBhZnRlciBzb21lIHBpeGVscyBvZiBtb3ZlbWVudCB0O1xuICAgKiBub3QgaW50ZXJydXB0IHdpdGggY2xpY2tzIGV0Yy5cbiAgICovXG4gIF9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gTm90IHRvdWNoaW5nIGFuZCBkcmFnZ2luZyBhbnltb3JlLCBhbmQgc21vb3RobHkgYW5pbWF0aW5nIHRoZVxuICAgKiB0b3VjaCBzZXF1ZW5jZSB1c2luZyBkZWNlbGVyYXRpb24uXG4gICAqL1xuICBfX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBTbW9vdGhseSBhbmltYXRpbmcgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIGNoYW5nZVxuICAgKi9cbiAgX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBESU1FTlNJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBsZWZ0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50TGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCByaWdodCBib3VuZGFyeSAqL1xuICBfX2NsaWVudFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCB3aWR0aCAqL1xuICBfX2NsaWVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodCAqL1xuICBfX2NsaWVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyB3aWR0aCAqL1xuICBfX2NvbnRlbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyBoZWlnaHQgKi9cbiAgX19jb250ZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoIGZvciBjb250ZW50ICovXG4gIF9fc25hcFdpZHRoID0gMTAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0IGZvciBjb250ZW50ICovXG4gIF9fc25hcEhlaWdodCA9IDEwMDtcblxuICAvKioge051bWJlcn0gWm9vbSBsZXZlbCAqL1xuICBfX3pvb21MZXZlbCA9IDE7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19zY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX21heFNjcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCBsZWZ0IHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRMZWZ0ID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgdG9wIHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB6b29tIGxldmVsIChmaW5hbCBzY2FsZSB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRab29tID0gMDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogTEFTVCBQT1NJVElPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge051bWJlcn0gTGVmdCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hMZWZ0ID0gbnVsbDtcblxuICAvKioge051bWJlcn0gVG9wIHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaFRvcCA9IG51bGw7XG5cbiAgLyoqIHtEYXRlfSBUaW1lc3RhbXAgb2YgbGFzdCBtb3ZlIG9mIGZpbmdlci4gVXNlZCB0byBsaW1pdCB0cmFja2luZyByYW5nZSBmb3IgZGVjZWxlcmF0aW9uIHNwZWVkLiAqL1xuICBfX2xhc3RUb3VjaE1vdmUgPSBudWxsO1xuXG4gIC8qKiB7QXJyYXl9IExpc3Qgb2YgcG9zaXRpb25zLCB1c2VzIHRocmVlIGluZGV4ZXMgZm9yIGVhY2ggc3RhdGUgPSBsZWZ0LCB0b3AsIHRpbWVzdGFtcCAqO1xuICBfX3Bvc2l0aW9ucyA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDogPSBERUNFTEVSQVRJT04gU1VQUE9SO1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IGhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQVUJMSUMgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNsaWVudCAob3V0ZXIpIGFuZCBjb250ZW50IChpbm5lcikgZWxlbWVudHMuXG4gICAqIFJlcXVpcmVzIHRoZSBhdmFpbGFibGUgc3BhY2UgZm9yIHRoZSBvdXRlciBlbGVtZW50IGFuZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICogQWxsIHZhbHVlcyB3aGljaCBhcmUgZmFsc3kgKG51bGwgb3IgemVybyBldGMuKSBhcmUgaWdub3JlZCBhbmQgdGhlIG9sZCB2YWx1ZSBpcyBrZXB0LlxuICAgKlxuICAgKiBAcGFyYW0gY2xpZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBJbm5lciB3aWR0aCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjbGllbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBJbm5lciBoZWlnaHQgb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgd2lkdGggb2YgaW5uZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IE91dGVyIGhlaWdodCBvZiBpbm5lciBlbGVtZW50XG4gICAqL1xuICBzZXREaW1lbnNpb25zKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHZhbHVlcyB3aGljaCBhcmUgZGVmaW5lZFxuICAgIGlmIChjbGllbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudFdpZHRoID0gY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNsaWVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudEhlaWdodCA9IGNsaWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudFdpZHRoID0gY29udGVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudEhlaWdodCA9IGNvbnRlbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gUmVmcmVzaCBtYXhpbXVtc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG5cbiAgICAvLyBSZWZyZXNoIHNjcm9sbCBwb3NpdGlvblxuICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUpO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqL1xuICBzZXRQb3NpdGlvbihsZWZ0LCB0b3ApIHtcbiAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICB0aGlzLl9fY2xpZW50VG9wID0gdG9wIHx8IDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAqXG4gICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAqL1xuICBzZXRTbmFwU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fX3NuYXBXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAqL1xuICBnZXRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fc2Nyb2xsVG9wLFxuICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoIC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIGJvdHRvbTogdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19jbGllbnRIZWlnaHQgLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFBvaW50KHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgIHRvcDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICovXG4gIGdldFNjcm9sbE1heCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAqXG4gICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbVRvKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjYWxsYmFjayBpZiBleGlzdHNcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICBpZiAoZml4ZWRMZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkVG9wID0gdGhpcy5fX2NsaWVudEhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBzY3JvbGwgcG9zaXRpb25zIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsLlxuICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAvLyAqIEZpeGVkIHBvaW50LCAkRiQsIHJlbWFpbnMgc3RhdGlvbmFyeSBpbiBjb250ZW50IHNwYWNlIGFuZCBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydC5cbiAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEZpbmFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfZiQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAvL1xuICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pL2tfZiA9IChTX2YgLSBGKSQuXG4gICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAvL1xuICAgIC8vIEZpeGVkIHBvaW50IGxvY2F0aW9uLCAkXFx2ZWN0b3J7Zn0gPSAoRiAtIFNfaSkga19pJC5cbiAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgLSBcXHZlY3RvcntmfS9rX2YkLlxuICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgdmFyIGsgPSBsZXZlbCAvIG9sZExldmVsO1xuICAgIHZhciBsZWZ0ID0gayAqICh0aGlzLl9fc2Nyb2xsTGVmdCArIGZpeGVkTGVmdCkgLSBmaXhlZExlZnQ7XG4gICAgdmFyIHRvcCA9IGsgKiAodGhpcy5fX3Njcm9sbFRvcCArIGZpeGVkVG9wKSAtIGZpeGVkVG9wO1xuXG4gICAgLy8gTGltaXQgeC1heGlzXG4gICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgIGxlZnQgPSAwO1xuICAgIH1cblxuICAgIC8vIExpbWl0IHktYXhpc1xuICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIGxldmVsLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbUJ5KGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICovXG4gIHNjcm9sbFRvKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgfVxuXG4gICAgICBsZWZ0ICo9IHpvb207XG4gICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19zbmFwSGVpZ2h0KSAqIHRoaXMuX19zbmFwSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgIHRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxUb3AsIHRvcCksIDApO1xuXG4gICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgaWYgKGxlZnQgPT09IHRoaXMuX19zY3JvbGxMZWZ0ICYmIHRvcCA9PT0gdGhpcy5fX3Njcm9sbFRvcCkge1xuICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICovXG4gIHNjcm9sbEJ5KGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIHZhciBzdGFydFRvcCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRUb3AgOiB0aGlzLl9fc2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBFVkVOVCBDQUxMQkFDS1NcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogTW91c2Ugd2hlZWwgaGFuZGxlciBmb3Igem9vbWluZyBzdXBwb3J0XG4gICAqL1xuICBkb01vdXNlWm9vbSh3aGVlbERlbHRhLCB0aW1lU3RhbXAsIHBhZ2VYLCBwYWdlWSkge1xuICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hTdGFydCh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaW50ZXJydXB0ZWRBbmltYXRpb24gZmxhZ1xuICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG4gICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHRvdWNoIHBvc2l0aW9uc1xuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBtb3ZlIHRpbWUgc3RhbXBcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gMTtcblxuICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1k7XG5cbiAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgLy8gUmVzZXQgZGVjZWxlcmF0aW9uIGNvbXBsZXRlIGZsYWdcbiAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgIHRoaXMuX19pc0RyYWdnaW5nID0gIWlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBDbGVhcmluZyBkYXRhIHN0cnVjdHVyZVxuICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIG1vdmUgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFsxLjBdIHNjYWxlIC0gLi4uLlxuICAgKi9cbiAgZG9Ub3VjaE1vdmUodG91Y2hlcywgdGltZVN0YW1wLCBzY2FsZSkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuXG4gICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAvLyBBcmUgd2UgYWxyZWFkeSBpcyBkcmFnZ2luZyBtb2RlP1xuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGRpc3RhbmNlXG4gICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAvLyBSZWFkIHByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZ1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIGxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdFJlbCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fY2xpZW50TGVmdDtcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICBzY3JvbGxMZWZ0ID0gKChjdXJyZW50VG91Y2hMZWZ0UmVsICsgc2Nyb2xsTGVmdCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaExlZnRSZWw7XG4gICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIHZhciBtYXhTY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3AgfHwgc2Nyb2xsVG9wIDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgKz0gKG1vdmVZIC8gMiAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSBtYXhTY3JvbGxUb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEtlZXAgbGlzdCBmcm9tIGdyb3dpbmcgaW5maW5pdGVseSAoaG9sZGluZyBtaW4gMTAsIG1heCAyMCBtZWFzdXJlIHBvaW50cylcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gNjApIHtcbiAgICAgICAgcG9zaXRpb25zLnNwbGljZSgwLCAzMCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRyYWNrIHNjcm9sbCBtb3ZlbWVudCBmb3IgZGVjbGVyYXRpb25cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgLy8gU3luYyBzY3JvbGwgcG9zaXRpb25cbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgbGV2ZWwpO1xuXG4gICAgICAvLyBPdGhlcndpc2UgZmlndXJlIG91dCB3aGV0aGVyIHdlIGFyZSBzd2l0Y2hpbmcgaW50byBkcmFnZ2luZyBtb2RlIG5vdy5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbCA9IHRoaXMub3B0aW9ucy5sb2NraW5nID8gMyA6IDA7XG4gICAgICB2YXIgbWluaW11bVRyYWNraW5nRm9yRHJhZyA9IDU7XG5cbiAgICAgIHZhciBkaXN0YW5jZVggPSBNYXRoLmFicyhjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2luaXRpYWxUb3VjaExlZnQpO1xuICAgICAgdmFyIGRpc3RhbmNlWSA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19pbml0aWFsVG91Y2hUb3ApO1xuXG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYICYmIGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZICYmIGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCB8fCB0aGlzLl9fZW5hYmxlU2Nyb2xsWSkgJiYgKGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnIHx8IGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnKTtcbiAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbGFzdCB0b3VjaCBwb3NpdGlvbnMgYW5kIHRpbWUgc3RhbXAgZm9yIG5leHQgZXZlbnRcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gc2NhbGU7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBlbmQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hFbmQodGltZVN0YW1wKSB7XG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChubyB0b3VjaHN0YXJ0IGV2ZW50IG9uIGVsZW1lbnQpXG4gICAgLy8gVGhpcyBpcyByZXF1aXJlZCBhcyB0aGlzIGxpc3RlbmVyICgndG91Y2htb3ZlJykgc2l0cyBvbiB0aGUgZG9jdW1lbnQgYW5kIG5vdCBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdCB0b3VjaGluZyBhbnltb3JlICh3aGVuIHR3byBmaW5nZXIgaGl0IHRoZSBzY3JlZW4gdGhlcmUgYXJlIHR3byB0b3VjaCBlbmQgZXZlbnRzKVxuICAgIHRoaXMuX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgICAvLyBCZSBzdXJlIHRvIHJlc2V0IHRoZSBkcmFnZ2luZyBmbGFnIG5vdy4gSGVyZSB3ZSBhbHNvIGRldGVjdCB3aGV0aGVyXG4gICAgLy8gdGhlIGZpbmdlciBoYXMgbW92ZWQgZmFzdCBlbm91Z2ggdG8gc3dpdGNoIGludG8gYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uLlxuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gUmVzZXQgZHJhZ2dpbmcgZmxhZ1xuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gU3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgbGFzdCBtb3ZlIGRldGVjdGVkIHdhcyBpbiBzb21lIHJlbGV2YW50IHRpbWUgZnJhbWVcbiAgICAgIGlmICh0aGlzLl9faXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nICYmICh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPD0gMTAwKSB7XG4gICAgICAgIC8vIFRoZW4gZmlndXJlIG91dCB3aGF0IHRoZSBzY3JvbGwgcG9zaXRpb24gd2FzIGFib3V0IDEwMG1zIGFnb1xuICAgICAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcbiAgICAgICAgdmFyIGVuZFBvcyA9IHBvc2l0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSBlbmRQb3M7XG5cbiAgICAgICAgLy8gTW92ZSBwb2ludGVyIHRvIHBvc2l0aW9uIG1lYXN1cmVkIDEwMG1zIGFnb1xuICAgICAgICBmb3IgKHZhciBpID0gZW5kUG9zOyBpID4gMCAmJiBwb3NpdGlvbnNbaV0gPiAodGhpcy5fX2xhc3RUb3VjaE1vdmUgLSAxMDApOyBpIC09IDMpIHtcbiAgICAgICAgICBzdGFydFBvcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBzdGFydCBhbmQgc3RvcCBwb3NpdGlvbiBpcyBpZGVudGljYWwgaW4gYSAxMDBtcyB0aW1lZnJhbWUsXG4gICAgICAgIC8vIHdlIGNhbm5vdCBjb21wdXRlIGFueSB1c2VmdWwgZGVjZWxlcmF0aW9uLlxuICAgICAgICBpZiAoc3RhcnRQb3MgIT09IGVuZFBvcykge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgbW92ZW1lbnQgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXG4gICAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBwb3NpdGlvbnNbZW5kUG9zXSAtIHBvc2l0aW9uc1tzdGFydFBvc107XG4gICAgICAgICAgdmFyIG1vdmVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0IC0gcG9zaXRpb25zW3N0YXJ0UG9zIC0gMl07XG4gICAgICAgICAgdmFyIG1vdmVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDFdO1xuXG4gICAgICAgICAgLy8gQmFzZWQgb24gNTBtcyBjb21wdXRlIHRoZSBtb3ZlbWVudCB0byBhcHBseSBmb3IgZWFjaCByZW5kZXIgc3RlcFxuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBtb3ZlZExlZnQgLyB0aW1lT2Zmc2V0ICogKDEwMDAgLyA2MCk7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG1vdmVkVG9wIC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuXG4gICAgICAgICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8gc3RhcnQgdGhlIGRlY2VsZXJhdGlvblxuICAgICAgICAgIHZhciBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGFnaW5nIHx8IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAxO1xuXG4gICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgd2UgaGF2ZSBlbm91Z2ggdmVsb2NpdHkgdG8gc3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA+IDEwMCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIHdhcyBhIHNsb3dlciBtb3ZlIGl0IGlzIHBlciBkZWZhdWx0IG5vbiBkZWNlbGVyYXRlZCwgYnV0IHRoaXNcbiAgICAvLyBzdGlsbCBtZWFucyB0aGF0IHdlIHdhbnQgc25hcCBiYWNrIHRvIHRoZSBib3VuZHMgd2hpY2ggaXMgZG9uZSBoZXJlLlxuICAgIC8vIFRoaXMgaXMgcGxhY2VkIG91dHNpZGUgdGhlIGNvbmRpdGlvbiBhYm92ZSB0byBpbXByb3ZlIGVkZ2UgY2FzZSBzdGFiaWxpdHlcbiAgICAvLyBlLmcuIHRvdWNoZW5kIGZpcmVkIHdpdGhvdXQgZW5hYmxlZCBkcmFnZ2luZy4gVGhpcyBzaG91bGQgbm9ybWFsbHkgZG8gbm90XG4gICAgLy8gaGF2ZSBtb2RpZmllZCB0aGUgc2Nyb2xsIHBvc2l0aW9ucyBvciBldmVuIHNob3dlZCB0aGUgc2Nyb2xsYmFycyB0aG91Z2guXG4gICAgaWYgKCF0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGlmICh0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gfHwgdGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0cnVlLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9XG5cbiAgICAvLyBGdWxseSBjbGVhbnVwIGxpc3RcbiAgICB0aGlzLl9fcG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBSSVZBVEUgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byB0aGUgY29udGVudCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXJ9IExlZnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB0b3Age051bWJlcn0gVG9wIHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciBhbmltYXRpb24gc2hvdWxkIGJlIHVzZWQgdG8gbW92ZSB0byB0aGUgbmV3IGNvb3JkaW5hdGVzXG4gICAqL1xuICBfX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKSB7XG4gICAgLy8gUmVtZW1iZXIgd2hldGhlciB3ZSBoYWQgYW4gYW5pbWF0aW9uLCB0aGVuIHdlIHRyeSB0byBjb250aW51ZVxuICAgIC8vIGJhc2VkIG9uIHRoZSBjdXJyZW50IFwiZHJpdmVcIiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgIHZhciB3YXNBbmltYXRpbmcgPSB0aGlzLl9faXNBbmltYXRpbmc7XG4gICAgaWYgKHdhc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHdhc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbmltYXRlZCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nKSB7XG4gICAgICAvLyBLZWVwIHNjaGVkdWxlZCBwb3NpdGlvbnMgZm9yIHNjcm9sbEJ5L3pvb21CeSBmdW5jdGlvbmFsaXR5LlxuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSBsZWZ0O1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gem9vbTtcblxuICAgICAgdmFyIG9sZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBvbGRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIG9sZFpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICB2YXIgZGlmZkxlZnQgPSBsZWZ0IC0gb2xkTGVmdDtcbiAgICAgIHZhciBkaWZmVG9wID0gdG9wIC0gb2xkVG9wO1xuICAgICAgdmFyIGRpZmZab29tID0gem9vbSAtIG9sZFpvb207XG5cbiAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICAgIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IG9sZExlZnQgKyAoZGlmZkxlZnQgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gb2xkVG9wICsgKGRpZmZUb3AgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fem9vbUxldmVsID0gb2xkWm9vbSArIChkaWZmWm9vbSAqIHBlcmNlbnQpO1xuXG4gICAgICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fX2NhbGxiYWNrKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2lzQW5pbWF0aW5nID09PSBpZDtcbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25JZCA9PT0gdGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSB8fCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIC8vIFdoZW4gY29udGludWluZyBiYXNlZCBvbiBwcmV2aW91cyBhbmltYXRpb24gd2UgY2hvb3NlIGFuIGVhc2Utb3V0IGFuaW1hdGlvbiBpbnN0ZWFkIG9mIGVhc2UtaW4tb3V0XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24sIHdhc0FuaW1hdGluZyA/IGVhc2VPdXRDdWJpYyA6IGVhc2VJbk91dEN1YmljKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB0aGlzLl9fem9vbUxldmVsID0gem9vbTtcblxuICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX19jYWxsYmFjayhsZWZ0LCB0b3AsIHpvb20pO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXggbWF4IHNjcm9sbCByYW5nZXNcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlY29tcHV0ZXMgc2Nyb2xsIG1pbmltdW0gdmFsdWVzIGJhc2VkIG9uIGNsaWVudCBkaW1lbnNpb25zIGFuZCBjb250ZW50IGRpbWVuc2lvbnMuXG4gICAqL1xuICBfX2NvbXB1dGVTY3JvbGxNYXgoem9vbUxldmVsKSB7XG4gICAgaWYgKHpvb21MZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB6b29tTGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIHRoaXMuX19tYXhTY3JvbGxMZWZ0ID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRXaWR0aCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRXaWR0aCwgMCk7XG4gICAgdGhpcy5fX21heFNjcm9sbFRvcCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50SGVpZ2h0ICogem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudEhlaWdodCwgMCk7XG4gIH1cblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBBTklNQVRJT04gKERFQ0VMRVJBVElPTikgU1VQUE9SVFxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIHRvdWNoIHNlcXVlbmNlIGVuZCBhbmQgdGhlIHNwZWVkIG9mIHRoZSBmaW5nZXIgd2FzIGhpZ2ggZW5vdWdoXG4gICAqIHRvIHN3aXRjaCBpbnRvIGRlY2VsZXJhdGlvbiBtb2RlLlxuICAgKi9cbiAgX19zdGFydERlY2VsZXJhdGlvbih0aW1lU3RhbXApIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX21heFNjcm9sbExlZnQpLCAwKTtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fbWF4U2Nyb2xsVG9wKSwgMCk7XG4gICAgICB2YXIgY2xpZW50V2lkdGggPSB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB2YXIgY2xpZW50SGVpZ2h0ID0gdGhpcy5fX2NsaWVudEhlaWdodDtcblxuICAgICAgLy8gV2UgbGltaXQgZGVjZWxlcmF0aW9uIG5vdCB0byB0aGUgbWluL21heCB2YWx1ZXMgb2YgdGhlIGFsbG93ZWQgcmFuZ2UsIGJ1dCB0byB0aGUgc2l6ZSBvZiB0aGUgdmlzaWJsZSBjbGllbnQgYXJlYS5cbiAgICAgIC8vIEVhY2ggcGFnZSBzaG91bGQgaGF2ZSBleGFjdGx5IHRoZSBzaXplIG9mIHRoZSBjbGllbnQgYXJlYS5cbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5mbG9vcihzY3JvbGxMZWZ0IC8gY2xpZW50V2lkdGgpICogY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5mbG9vcihzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmNlaWwoc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IDA7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gMDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGNsYXNzIG1ldGhvZFxuICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICB0aGlzLl9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBrZWVwIHRoZSBkZWNlbGVyYXRpb24gcnVubmluZ1xuICAgIHZhciBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyA9IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAwLjE7XG5cbiAgICAvLyBEZXRlY3Qgd2hldGhlciBpdCdzIHN0aWxsIHdvcnRoIHRvIGNvbnRpbnVlIGFuaW1hdGluZyBzdGVwc1xuICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IHNsb3cgZW5vdWdoIHRvIG5vdCBiZWluZyB1c2VyIHBlcmNlaXZhYmxlIGFueW1vcmUsIHdlIHN0b3AgdGhlIHdob2xlIHByb2Nlc3MgaGVyZS5cbiAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNob3VsZENvbnRpbnVlID0gTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmc7XG4gICAgICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgICAgIHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hvdWxkQ29udGludWU7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFuaW1hdGUgdG8gZ3JpZCB3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSwgb3RoZXJ3aXNlIGp1c3QgZml4IG91dC1vZi1ib3VuZGFyeSBwb3NpdGlvbnNcbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMub3B0aW9ucy5zbmFwcGluZyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gU3RhcnQgYW5pbWF0aW9uIGFuZCBzd2l0Y2ggb24gZmxhZ1xuICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2FsbGVkIG9uIGV2ZXJ5IHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxuICAgKlxuICAgKiBAcGFyYW0gaW5NZW1vcnkge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdG8gbm90IHJlbmRlciB0aGUgY3VycmVudCBzdGVwLCBidXQga2VlcCBpdCBpbiBtZW1vcnkgb25seS4gVXNlZCBpbnRlcm5hbGx5IG9ubHkhXG4gICAqL1xuICBfX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcikge1xuXG4gICAgLy9cbiAgICAvLyBDT01QVVRFIE5FWFQgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIC8vIEFkZCBkZWNlbGVyYXRpb24gdG8gc2Nyb2xsIHBvc2l0aW9uXG4gICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVg7XG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZO1xuXG5cbiAgICAvL1xuICAgIC8vIEhBUkQgTElNSVQgU0NST0xMIFBPU0lUSU9OIEZPUiBOT04gQk9VTkNJTkcgTU9ERVxuICAgIC8vXG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnRGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0LCBzY3JvbGxMZWZ0KSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpO1xuICAgICAgaWYgKHNjcm9sbExlZnRGaXhlZCAhPT0gc2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdEZpeGVkO1xuICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHNjcm9sbFRvcEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCwgc2Nyb2xsVG9wKSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCk7XG4gICAgICBpZiAoc2Nyb2xsVG9wRml4ZWQgIT09IHNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxUb3AgPSBzY3JvbGxUb3BGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFVQREFURSBTQ1JPTEwgUE9TSVRJT05cbiAgICAvL1xuXG4gICAgaWYgKHJlbmRlcikge1xuICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gU0xPVyBET1dOXG4gICAgLy9cblxuICAgIC8vIFNsb3cgZG93biB2ZWxvY2l0eSBvbiBldmVyeSBpdGVyYXRpb25cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZhY3RvciBhcHBsaWVkIHRvIGV2ZXJ5IGl0ZXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uXG4gICAgICAvLyB0byBzbG93IGRvd24gdGhlIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGVtdWxhdGUgbmF0dXJhbCBiZWhhdmlvciB3aGVyZVxuICAgICAgLy8gb2JqZWN0cyBzbG93IGRvd24gd2hlbiB0aGUgaW5pdGlhdG9yIG9mIHRoZSBtb3ZlbWVudCBpcyByZW1vdmVkXG4gICAgICB2YXIgZnJpY3Rpb25GYWN0b3IgPSAwLjk1O1xuXG4gICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gQk9VTkNJTkcgU1VQUE9SVFxuICAgIC8vXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsT3V0c2lkZVggPSAwO1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVZID0gMDtcblxuICAgICAgLy8gVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uL2FjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXNcbiAgICAgIHZhciBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgIHZhciBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcblxuICAgICAgLy8gQ2hlY2sgbGltaXRzXG4gICAgICBpZiAoc2Nyb2xsTGVmdCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxUb3AgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9XG5cbiAgICAgIC8vIFNsb3cgZG93biB1bnRpbCBzbG93IGVub3VnaCwgdGhlbiBmbGlwIGJhY2sgdG8gc25hcCBwb3NpdGlvblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKz0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgIT09IDApIHtcbiAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSArPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCAnLi9lbnYnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4vY29tbW9uL3Bvb2wnO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgY29tcHV0ZUxheW91dCBmcm9tICdjc3MtbGF5b3V0JztcbmltcG9ydCB7IGlzQ2xpY2ssIFNUQVRFLCBjbGVhckNhbnZhcywgaXNHYW1lVG91Y2hFdmVudCB9IGZyb20gJy4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyc7XG5pbXBvcnQgQml0TWFwRm9udCBmcm9tICcuL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCBEZWJ1Z0luZm8gZnJvbSAnLi9jb21tb24vZGVidWdJbmZvJztcbmltcG9ydCBUaWNrZXIgZnJvbSAnLi9jb21tb24vdGlja2VyJztcbmltcG9ydCB7IGNyZWF0ZSwgcmVuZGVyQ2hpbGRyZW4sIGxheW91dENoaWxkcmVuLCByZXBhaW50Q2hpbGRyZW4sIGl0ZXJhdGVUcmVlLCBjbG9uZSwgcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbW1vbi92ZCc7XG5pbXBvcnQgUmVjdCBmcm9tICcuL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMgfSBmcm9tICcuL2NvbXBvbmVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQsIENhbGxiYWNrIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuZXhwb3J0IGNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyKCk7XG5jb25zdCBpbWdQb29sID0gbmV3IFBvb2woJ2ltZ1Bvb2wnKTtcbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbCgnYml0TWFwUG9vbCcpO1xuY29uc3QgZGVidWdJbmZvID0gbmV3IERlYnVnSW5mbygpO1xuXG5pbnRlcmZhY2UgSVZpZXdQb3J0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJVmlld1BvcnRCb3gge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFdmVudEhhbmRsZXJEYXRhIHtcbiAgaGFzRXZlbnRCaW5kOiBib29sZWFuO1xuICB0b3VjaE1zZzoge1xuICAgIFtrZXk6IHN0cmluZ106IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIH07XG4gIGhhbmRsZXJzOiB7XG4gICAgdG91Y2hTdGFydDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaE1vdmU6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hFbmQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hDYW5jZWw6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gIH07XG59XG5cbmludGVyZmFjZSBJUGx1Z2luPFQ+IHtcbiAgbmFtZTogc3RyaW5nO1xuICBpbnN0YWxsOiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbiAgdW5pbnN0YWxsPzogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG59XG5cbmNsYXNzIExheW91dCBleHRlbmRzIEVsZW1lbnQge1xuICAvKipcbiAgICog5b2T5YmNIExheW91dCDniYjmnKzvvIzkuIDoiKzot5/lsI/muLjmiI/mj5Lku7bniYjmnKzlr7npvZBcbiAgICovXG4gIHB1YmxpYyB2ZXJzaW9uID0gJzEuMC4zJztcbiAgXG4gIC8qKlxuICAgKiBMYXlvdXQg5riy5p+T55qE55uu5qCH55S75biD5a+55bqU55qEIDJkIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyByZW5kZXJDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHJlbmRlcnBvcnQ6IElWaWV3UG9ydCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydDogSVZpZXdQb3J0Qm94ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gIH07XG5cbiAgLyoqXG4gICAqIOeUu+W4g+WwuuWvuOWSjOWunumZheiiq+a4suafk+WIsOWxj+W5leeahOeJqeeQhuWwuuWvuOavlFxuICAgKi9cbiAgcHVibGljIHZpZXdwb3J0U2NhbGUgPSAxO1xuICAvKipcbiAgICog55So5LqO5qCH6K+GdXBkYXRlVmlld1BvcnTmlrnms5XmmK/lkKbooqvosIPnlKjov4fkuobvvIzov5nlnKjlsI/muLjmiI/njq/looPpnZ7luLjph43opoFcbiAgICovXG4gIHB1YmxpYyBoYXNWaWV3UG9ydFNldCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDmnIDnu4jmuLLmn5PliLDlsY/luZXnmoTlt6bkuIrop5LniannkIblnZDmoIdcbiAgICovXG4gIHB1YmxpYyByZWFsTGF5b3V0Qm94OiB7XG4gICAgcmVhbFg6IG51bWJlcjtcbiAgICByZWFsWTogbnVtYmVyO1xuICB9ID0ge1xuICAgICAgcmVhbFg6IDAsXG4gICAgICByZWFsWTogMCxcbiAgICB9O1xuXG4gIHB1YmxpYyBiaXRNYXBGb250czogQml0TWFwRm9udFtdID0gW107XG4gIHB1YmxpYyBlbGVDb3VudCA9IDA7XG4gIHB1YmxpYyBzdGF0ZTogU1RBVEUgPSBTVEFURS5VTklOSVQ7XG5cbiAgLyoqXG4gICAqIOeUqOS6juWcqCB0aWNrZXIg55qE5b6q546v6YeM6Z2i5qCH6K+G5b2T5YmN5bin5piv5ZCm6ZyA6KaB6YeN57uYXG4gICAqIOmHjee7mOS4gOiIrOaYr+WbvueJh+WKoOi9veWujOaIkOOAgeaWh+Wtl+S/ruaUueetieWcuuaZr1xuICAgKi9cbiAgcHVibGljIGlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgcHVibGljIHRpY2tlcjogVGlja2VyID0gbmV3IFRpY2tlcigpO1xuICBwdWJsaWMgdGlja2VyRnVuYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc05lZWRSZXBhaW50KSB7XG4gICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJEYXRhOiBFdmVudEhhbmRsZXJEYXRhO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgaGFzRXZlbnRCaW5kOiBmYWxzZSxcbiAgICAgIHRvdWNoTXNnOiB7fSxcbiAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgIHRvdWNoU3RhcnQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaHN0YXJ0JyksXG4gICAgICAgIHRvdWNoTW92ZTogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNobW92ZScpLFxuICAgICAgICB0b3VjaEVuZDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoZW5kJyksXG4gICAgICAgIHRvdWNoQ2FuY2VsOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hjYW5jZWwnKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOWvueS6juS4jeS8muW9seWTjeW4g+WxgOeahOaUueWKqO+8jOavlOWmguWbvueJh+WPquaYr+aUueS4quWcsOWdgOOAgeWKoOS4quiDjOaZr+iJsuS5i+exu+eahOaUueWKqO+8jOS8muinpuWPkSBMYXlvdXQg55qEIHJlcGFpbnQg5pON5L2cXG4gICAgICog6Kem5Y+R55qE5pa55byP5piv57uZIExheW91dCDmipvkuKogYHJlcGFpbnRgIOeahOS6i+S7tu+8jOS4uuS6huaAp+iDve+8jOavj+asoeaOpeaUtuWIsCByZXBhaW50IOivt+axguS4jeS8muaJp+ihjOecn+ato+eahOa4suafk1xuICAgICAqIOiAjOaYr+aJp+ihjOS4gOS4que9ruiEj+aTjeS9nO+8jHRpY2tlciDmr4/kuIDmrKHmiafooYwgdXBkYXRlIOS8muajgOafpei/meS4quagh+iusOS9je+8jOi/m+iAjOaJp+ihjOecn+ato+eahOmHjee7mOaTjeS9nFxuICAgICAqL1xuICAgIHRoaXMub24oJ3JlcGFpbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5bCGIFR3ZWVuIOaMgui9veWIsCBMYXlvdXTvvIzlr7nkuo4gVHdlZW4g55qE5L2/55So5a6M5YWo6YG15b6qIFR3ZWVuLmpzIOeahOaWh+aho1xuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL1xuICAgICAqIOWPquS4jei/h+W9kyBUd2VlbiDmlLnliqjkuoboioLngrnkvJrop6blj5EgcmVwYWludOOAgXJlZmxvdyDnmoTlsZ7mgKfml7bvvIxMYXlvdXQg5Lya5omn6KGM55u45bqU55qE5pON5L2cXG4gICAgICog5Lia5Yqh5L6n5LiN55So5oSf55+l5YiwIHJlcGFpbnQg5ZKMIHJlZmxvd1xuICAgICAqL1xuICAgIC8vIHRoaXMuVFdFRU4gPSBUV0VFTjtcbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0gdiR7dGhpcy52ZXJzaW9ufWApO1xuICB9XG5cbiAgLy8g5LiO6ICB54mI5pys5YW85a65XG4gIGdldCBkZWJ1Z0luZm8oKSB7XG4gICAgbGV0IGluZm8gPSBkZWJ1Z0luZm8ubG9nKCk7XG5cbiAgICBpbmZvICs9IGBlbGVtZW50Q291bnQ6ICR7dGhpcy5lbGVDb3VudH1cXG5gO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICAvKipcbiAgICog5pu05paw6KKr57uY5Yi2Y2FudmFz55qE56qX5Y+j5L+h5oGv77yM5pys5riy5p+T5byV5pOO5bm25LiN5YWz5b+D5piv5ZCm5Lya5ZKM5YW25LuW5ri45oiP5byV5pOO5YWx5ZCM5L2/55SoXG4gICAqIOiAjOacrOi6q+WPiOmcgOimgeaUr+aMgeS6i+S7tuWkhOeQhu+8jOWboOatpO+8jOWmguaenOiiq+a4suafk+WGheWuueaYr+e7mOWItuWIsOemu+Wxj2NhbnZhc++8jOmcgOimgeWwhuacgOe7iOe7mOWItuWcqOWxj+W5leS4ilxuICAgKiDnmoTnu53lr7nlsLrlr7jlkozkvY3nva7kv6Hmga/mm7TmlrDliLDmnKzmuLLmn5PlvJXmk47jgIJcbiAgICog5YW25Lit77yMd2lkdGjkuLrniannkIblg4/ntKDlrr3luqbvvIxoZWlnaHTkuLrniannkIblg4/ntKDpq5jluqbvvIx45Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgeOWdkOagh++8jHnkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKBcbiAgICogeeWdkOagh1xuICAgKi9cbiAgdXBkYXRlVmlld1BvcnQoYm94OiBJVmlld1BvcnRCb3gpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gYm94LndpZHRoIHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBib3guaGVpZ2h0IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gYm94LnggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSBib3gueSB8fCAwO1xuXG4gICAgdGhpcy5yZWFsTGF5b3V0Qm94ID0ge1xuICAgICAgcmVhbFg6IHRoaXMudmlld3BvcnQueCxcbiAgICAgIHJlYWxZOiB0aGlzLnZpZXdwb3J0LnksXG4gICAgfTtcblxuICAgIHRoaXMuaGFzVmlld1BvcnRTZXQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yOiBDYWxsYmFjaykge1xuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdCcpO1xuICAgIGNvbnN0IHBhcnNlQ29uZmlnID0ge1xuICAgICAgYXR0cmlidXRlTmFtZVByZWZpeDogJycsXG4gICAgICBhdHRyTm9kZU5hbWU6ICdhdHRyJywgLy8gZGVmYXVsdCBpcyAnZmFsc2UnXG4gICAgICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgIGlnbm9yZU5hbWVTcGFjZTogdHJ1ZSxcbiAgICAgIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBwYXJzZU5vZGVWYWx1ZTogZmFsc2UsXG4gICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgIHRyaW1WYWx1ZXM6IHRydWUsXG4gICAgICBwYXJzZVRydWVOdW1iZXJPbmx5OiBmYWxzZSxcbiAgICAgIGFsd2F5c0NyZWF0ZVRleHROb2RlOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoYXR0clZhbHVlUHJvY2Vzc29yICYmIHR5cGVvZiBhdHRyVmFsdWVQcm9jZXNzb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBhcnNlQ29uZmlnLmF0dHJWYWx1ZVByb2Nlc3NvciA9IGF0dHJWYWx1ZVByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sUGFyc2UnKTtcbiAgICAvLyDlsIZ4bWzlrZfnrKbkuLLop6PmnpDmiJB4bWzoioLngrnmoJFcbiAgICBjb25zdCBqc29uT2JqID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBwYXJzZUNvbmZpZywgdHJ1ZSk7XG4gICAgLy8gY29uc29sZS5sb2coanNvbk9iailcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbFBhcnNlJyk7XG5cbiAgICBjb25zdCB4bWxUcmVlID0ganNvbk9iai5jaGlsZHJlblswXTtcblxuICAgIC8vIFhNTOagkeeUn+aIkOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWwyTGF5b3V0Jyk7XG4gICAgY29uc3QgbGF5b3V0VHJlZSA9IGNyZWF0ZS5jYWxsKHRoaXMsIHhtbFRyZWUsIHN0eWxlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbDJMYXlvdXQnKTtcblxuICAgIHRoaXMuYWRkKGxheW91dFRyZWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLklOSVRFRDtcblxuICAgIHRoaXMudGlja2VyLmFkZCh0aGlzLnRpY2tlckZ1bmMsIHRydWUpO1xuICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0Jyk7XG4gIH1cblxuICByZWZsb3coaXNGaXJzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0ZpcnN0KSB7XG4gICAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9yZWZsb3cnKTtcbiAgICAvKipcbiAgICAgKiDorqHnrpfluIPlsYDmoJFcbiAgICAgKiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr1xuICAgICAqIExheW91dOacrOi6q+W5tuS4jeS9nOS4uuW4g+WxgOiuoeeul++8jOWPquaYr+S9nOS4uuiKgueCueagkeeahOWuueWZqFxuICAgICAqL1xuICAgIGRlYnVnSW5mby5zdGFydCgnY29tcHV0ZUxheW91dCcsIHRydWUpO1xuICAgIGNvbXB1dGVMYXlvdXQodGhpcy5jaGlsZHJlblswXSk7XG4gICAgZGVidWdJbmZvLmVuZCgnY29tcHV0ZUxheW91dCcpO1xuXG4gICAgY29uc3Qgcm9vdEVsZSA9IHRoaXMuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAocm9vdEVsZS5zdHlsZS53aWR0aCA9PT0gdW5kZWZpbmVkIHx8IHJvb3RFbGUuc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBzZXQgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0eSBmb3Igcm9vdCBlbGVtZW50Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVycG9ydC53aWR0aCA9IHJvb3RFbGUuc3R5bGUud2lkdGg7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQuaGVpZ2h0ID0gcm9vdEVsZS5zdHlsZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8g5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRDaGlsZHJlbicsIHRydWUpO1xuICAgIGxheW91dENoaWxkcmVuKHRoaXMpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dENoaWxkcmVuJyk7XG5cbiAgICB0aGlzLnZpZXdwb3J0U2NhbGUgPSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gdGhpcy5yZW5kZXJwb3J0LndpZHRoO1xuXG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICAvLyDpgY3ljoboioLngrnmoJHvvIzkvp3mrKHosIPnlKjoioLngrnnmoTmuLLmn5PmjqXlj6Plrp7njrDmuLLmn5NcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlbmRlckNoaWxkcmVuJywgdHJ1ZSk7XG4gICAgcmVuZGVyQ2hpbGRyZW4odGhpcy5jaGlsZHJlbiwgdGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZmFsc2UpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlbmRlckNoaWxkcmVuJyk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlcGFpbnQnLCB0cnVlKTtcbiAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZXBhaW50Jyk7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCAoZWxlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbGUucHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X3JlZmxvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXTpmLbmrrXmoLjlv4Pku4Xku4XmmK/moLnmja54bWzlkoxjc3PliJvlu7rkuoboioLngrnmoJFcbiAgICog6KaB5a6e546w55yf5q2j55qE5riy5p+T77yM6ZyA6KaB6LCD55SoIGxheW91dCDlh73mlbDvvIzkuYvmiYDku6XlsIYgbGF5b3V0IOWNleeLrOaKveixoeS4uuS4gOS4quWHveaVsO+8jOaYr+WboOS4uiBsYXlvdXQg5bqU5b2T5piv5Y+v5Lul6YeN5aSN6LCD55So55qEXG4gICAqIOavlOWmguaUueWPmOS6huS4gOS4quWFg+e0oOeahOWwuuWvuO+8jOWunumZheS4iuiKgueCueagkeaYr+ayoeWPmOeahO+8jOS7heS7heaYr+mcgOimgemHjeaWsOiuoeeul+W4g+WxgO+8jOeEtuWQjua4suafk1xuICAgKiDkuIDkuKrlrozmlbTnmoQgbGF5b3V0IOWIhuaIkOS4i+mdoueahOWHoOatpe+8mlxuICAgKiAxLiDmiafooYznlLvluIPmuIXnkIbvvIzlm6DkuLrluIPlsYDlj5jljJbpobXpnaLpnIDopoHph43nu5jvvIzov5nph4zmsqHmnInlgZrlvojpq5jnuqfnmoTliZTpmaTnrYnmk43kvZzvvIzkuIDlvovmuIXpmaTph43nlLvvvIzlrp7pmYXkuIrmgKfog73lt7Lnu4/lvojlpb1cbiAgICogMi4g6IqC54K55qCR6YO95ZCr5pyJIHN0eWxlIOWxnuaAp++8jGNzcy1sYXlvdXQg6IO95aSf5qC55o2u6L+Z5Lqb5L+h5oGv6K6h566X5Ye65pyA57uI5biD5bGA77yM6K+m5oOF5Y+v6KeBIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Nzcy1sYXlvdXRcbiAgICogMy4g57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga/vvIzkvYbov5nkupvkv6Hmga/lubbkuI3mmK/og73lpJ/nm7TmjqXnlKjnmoRcbiAgICogICAg5q+U5aaCIGxheW91dC50b3Ag5piv5oyH5Zyo5LiA5Liq54i25a655Zmo5YaF55qEIHRvcO+8jOacgOe7iOimgeWunueOsOa4suafk++8jOWunumZheS4iuimgemAkuW9kuWKoOS4iuWkjeWuueWZqOeahCB0b3BcbiAgICogICAg6L+Z5qC35q+P5qyhIHJlcGFpbnQg55qE5pe25YCZ5Y+q6ZyA6KaB55u05o6l5L2/55So6K6h566X5aW955qE5YC85Y2z5Y+v77yM5LiN6ZyA6KaB5q+P5qyh6YO96YCS5b2S6K6h566XXG4gICAqICAgIOi/meS4gOatpeensOS4uiBsYXlvdXRDaGlsZHJlbu+8jOebrueahOWcqOS6juWwhiBjc3MtbGF5b3V0IOi/m+S4gOatpeWkhOeQhuS4uuWPr+S7pea4suafk+ebtOaOpeeUqOeahOW4g+WxgOS/oeaBr1xuICAgKiA0LiByZW5kZXJDaGlsZHJlbu+8muaJp+ihjOa4suafk1xuICAgKiA1LiBiaW5kRXZlbnRz77ya5omn6KGM5LqL5Lu257uR5a6aXG4gICAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGxheW91dChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKCF0aGlzLmhhc1ZpZXdQb3J0U2V0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2UgaW52b2tlIG1ldGhvZCBgdXBkYXRlVmlld1BvcnRgIGJlZm9yZSBtZXRob2QgYGxheW91dGAnKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dCcpO1xuXG4gICAgdGhpcy5yZWZsb3codHJ1ZSk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vdGhlcicpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnLCB0cnVlKTtcbiAgICBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCBlbGVtZW50ID0+IGVsZW1lbnQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50Jyk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuUkVOREVSRUQ7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXQnKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb3RoZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzoioLngrnmlbDnmoTph43nu5jliLbvvIzkuIDoiKzkuJrliqHkvqfml6DpnIDosIPnlKjor6Xmlrnms5VcbiAgICovXG4gIHJlcGFpbnQoKSB7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgICByZXBhaW50Q2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG4gIH1cblxuICAvKipcbiAgICog6L+U5Zue5LiA5Liq6IqC54K55Zyo5bGP5bmV5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGv77yM5YmN5o+Q5piv5q2j56Gu6LCD55SodXBkYXRlVmlld1BvcnTjgIJcbiAgICovXG4gIGdldEVsZW1lbnRWaWV3cG9ydFJlY3QoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IHsgcmVhbExheW91dEJveCwgdmlld3BvcnRTY2FsZSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBhYnNvbHV0ZVgsXG4gICAgICBhYnNvbHV0ZVksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gZWxlbWVudC5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB2aWV3cG9ydFNjYWxlO1xuICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB2aWV3cG9ydFNjYWxlO1xuXG4gICAgcmV0dXJuIG5ldyBSZWN0KFxuICAgICAgcmVhbFgsXG4gICAgICByZWFsWSxcbiAgICAgIHJlYWxXaWR0aCxcbiAgICAgIHJlYWxIZWlnaHQsXG4gICAgKTtcbiAgfVxuXG4gIGdldENoaWxkQnlQb3ModHJlZTogTGF5b3V0IHwgRWxlbWVudCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGl0ZW1MaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFic29sdXRlWCxcbiAgICAgICAgYWJzb2x1dGVZLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGVsZS5sYXlvdXRCb3g7XG4gICAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWDtcbiAgICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy52aWV3cG9ydFNjYWxlO1xuXG4gICAgICBpZiAoKHJlYWxYIDw9IHggJiYgeCA8PSByZWFsWCArIHJlYWxXaWR0aCkgJiYgKHJlYWxZIDw9IHkgJiYgeSA8PSByZWFsWSArIHJlYWxIZWlnaHQpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnm7jlhbNpc3N1Ze+8mmh0dHBzOi8vZ2l0aHViLmNvbS93ZWNoYXQtbWluaXByb2dyYW0vbWluaWdhbWUtY2FudmFzLWVuZ2luZS9pc3N1ZXMvMTdcbiAgICAgICAgICog6L+Z6YeM5Y+q6KaB5ruh6Laz5p2h5Lu255qE6YO96KaB6K6w5b2V77yM5ZCm5YiZ5Y+v6IO95Ye6546wIGlzc3VlIOmHjOmdouaPkOWIsOeahOmXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgaXRlbUxpc3QucHVzaChlbGUpO1xuICAgICAgICBpZiAoZWxlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyhlbGUsIHgsIHksIGl0ZW1MaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyID0gKGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCB0b3VjaDogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcblxuICAgICAgaWYgKGlzR2FtZVRvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3VjaCA9IGU7XG4gICAgICB9XG4gICAgICAvLyBjb25zdCB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB8fCBlO1xuICAgICAgaWYgKCF0b3VjaCB8fCAhdG91Y2gucGFnZVggfHwgIXRvdWNoLnBhZ2VZKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaC50aW1lU3RhbXApIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0b3VjaC50aW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdDogKExheW91dCB8IEVsZW1lbnQpW10gPSBbXTtcbiAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICB0aGlzLmdldENoaWxkQnlQb3ModGhpcywgdG91Y2gucGFnZVgsIHRvdWNoLnBhZ2VZLCBsaXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICBsaXN0LnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgICBpdGVtICYmIGl0ZW0uZW1pdChldmVudE5hbWUsIGUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnROYW1lID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZ1tldmVudE5hbWVdID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaGVuZCcgJiYgaXNDbGljayh0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2cpKSB7XG4gICAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KCdjbGljaycsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM5YWo5bGA55qE5LqL5Lu257uR5a6a6YC76L6RIFxuICAgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIF9fZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgICBfX2Vudi5vblRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQub25tb3VzZWRvd24gPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZTtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2VsZWF2ZSA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWo5bGA5LqL5Lu26Kej57uRIFxuICAgKi9cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlZG93biA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZWxlYXZlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIEVFLmVtaXQoZXZlbnQsIGRhdGEpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZShldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9mZihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveUFsbCh0cmVlOiBMYXlvdXQgfCBFbGVtZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgfSA9IHRyZWU7XG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5kZXN0cm95QWxsKGNoaWxkKTtcbiAgICAgIGNoaWxkLmRlc3Ryb3lTZWxmICYmIGNoaWxkLmRlc3Ryb3lTZWxmKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5riF55CG55S75biD77yM5LmL5YmN55qE6K6h566X5Ye65p2l55qE5riy5p+T5qCR5Lmf5Lya5LiA5bm25riF55CG77yM5q2k5pe25Y+v5Lul5YaN5qyh5omn6KGMaW5pdOWSjGxheW91dOaWueazlea4suafk+eVjOmdouOAglxuICAgKi9cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclBvb2woKSB7XG4gICAgaW1nUG9vbC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOavlOi1tyBMYXlvdXQuY2xlYXIg5pu05b275bqV55qE5riF55CG77yM5Lya5riF56m65Zu+54mH5a+56LGh5rGg77yM5YeP5bCR5YaF5a2Y5Y2g55So44CCXG4gICAqL1xuICBjbGVhckFsbCgpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNsZWFyUG9vbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWvueS6juWbvueJh+i1hOa6kO+8jOWmguaenOS4jeaPkOWJjeWKoOi9ve+8jOa4suafk+i/h+eoi+S4reWPr+iDveWHuueOsOaMqOS4quWHuueOsOWbvueJh+aViOaenO+8jOW9seWTjeS9k+mqjFxuICAgKiDpgJrov4dMYXlvdXQubG9hZEltZ3Plj6/ku6XpooTliqDovb3lm77niYfotYTmupDvvIzlnKjosIPnlKhMYXlvdXQubGF5b3V055qE5pe25YCZ5riy5p+T5oCn6IO95pu05aW977yM5L2T6aqM5pu05L2z44CCXG4gICAqL1xuICBsb2FkSW1ncyhhcnI6IHN0cmluZ1tdID0gW10pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXJyLm1hcChzcmMgPT4gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZVByb21pc2Uoc3JjKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOazqOWGjCBiaXRtYXB0ZXh0IOWPr+eUqOeahOWtl+S9k+OAgiBcbiAgICovXG4gIHJlZ2lzdEJpdE1hcEZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJpdE1hcFBvb2wuZ2V0KG5hbWUpKSB7XG4gICAgICBjb25zdCBmb250ID0gbmV3IEJpdE1hcEZvbnQobmFtZSwgc3JjLCBjb25maWcpO1xuICAgICAgdGhpcy5iaXRNYXBGb250cy5wdXNoKGZvbnQpO1xuICAgICAgYml0TWFwUG9vbC5zZXQobmFtZSwgZm9udClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWL6ZqG6IqC54K577yM5YWL6ZqG5ZCO55qE6IqC54K55Y+v5Lul5re75Yqg5YiwIExheW91dCDnmoTmn5DkuKroioLngrnkuK1cbiAgICog6K+l5pa55rOV5Y+v5Lul5Zyo5pWw5o2u5pyJ5Y+Y5YyW55qE5pe25YCZ6YG/5YWN6YeN5paw5omn6KGMIExheW91dC5pbml0IOa1geeoi+OAglxuICAgKi9cbiAgY2xvbmVOb2RlKGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNsb25lPExheW91dD4odGhpcywgZWxlbWVudCwgZGVlcCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG57uE5Lu25oyC5YiwTGF5b3V0XG4gICAqL1xuICBFbGVtZW50ID0gRWxlbWVudDtcbiAgVmlldyA9IFZpZXc7XG4gIFRleHQgPSBUZXh0O1xuICBJbWFnZSA9IEltYWdlO1xuICBTY3JvbGxWaWV3ID0gU2Nyb2xsVmlldztcbiAgQml0TWFwVGV4dCA9IEJpdE1hcFRleHQ7XG4gIENhbnZhcyA9IENhbnZhcztcblxuICByZWdpc3RlckNvbXBvbmVudCA9IHJlZ2lzdGVyQ29tcG9uZW50O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbGxlZFBsdWdpbnM6IElQbHVnaW48TGF5b3V0PltdID0gW107XG4gIC8qKlxuICAgKiDlronoo4Xnu5nlrprnmoTmj5Lku7YgXG4gICAqL1xuICB1c2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgaWYgKExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0g6K+l5o+S5Lu25bey5a6J6KOFLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5a6J6KOFYClcbiAgfVxuXG4gIC8qKlxuICAgKiDljbjovb3nu5nlrprmj5Lku7YgXG4gICAqL1xuICB1blVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBjb25zdCBwbHVnaW5JbmRleCA9IExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluZGV4T2YocGx1Z2luKTtcblxuICAgIGlmIChwbHVnaW5JbmRleCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignVGhpcyBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnVuaW5zdGFsbCkge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWNuOi9vWApXG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuc3BsaWNlKHBsdWdpbkluZGV4LCAxKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGF5b3V0KHtcbiAgc3R5bGU6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH0sXG4gIG5hbWU6ICdsYXlvdXQnLFxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
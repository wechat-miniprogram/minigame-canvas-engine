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

/***/ "./node_modules/scroller/index.js":
/*!****************************************!*\
  !*** ./node_modules/scroller/index.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(/*! ./lib/animate */ "./node_modules/scroller/lib/animate.js"), __webpack_require__(/*! ./lib/Scroller */ "./node_modules/scroller/lib/Scroller.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function (exports, animate, Scroller) {
    exports.animate = animate;
    exports.Scroller = Scroller;
}));


/***/ }),

/***/ "./node_modules/scroller/lib/Scroller.js":
/*!***********************************************!*\
  !*** ./node_modules/scroller/lib/Scroller.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
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

(function (root, factory) {
    if (true) {
        // AMD
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! ./animate */ "./node_modules/scroller/lib/animate.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(this, function (animate) {
    var NOOP = function () {};

    /**
     * A pure logic 'component' for 'virtual' scrolling/zooming.
     */
    var Scroller = function (callback, options) {
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
            penetrationDeceleration : 0.03,

            /** This configures the amount of change applied to acceleration when reaching boundaries  **/
            penetrationAcceleration : 0.08
        };

        for (var key in options) {
            this.options[key] = options[key];
        }
    };


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


    Scroller.prototype = {

        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: STATUS
          ---------------------------------------------------------------------------
        */

        /** {Boolean} Whether only a single finger is used in touch handling */
        __isSingleTouch: false,

        /** {Boolean} Whether a touch event sequence is in progress */
        __isTracking: false,

        /** {Boolean} Whether a deceleration animation went to completion. */
        __didDecelerationComplete: false,

        /**
         * {Boolean} Whether a gesture zoom/rotate event is in progress. Activates when
         * a gesturestart event happens. This has higher priority than dragging.
         */
        __isGesturing: false,

        /**
         * {Boolean} Whether the user has moved by such a distance that we have enabled
         * dragging mode. Hint: It's only enabled after some pixels of movement to
         * not interrupt with clicks etc.
         */
        __isDragging: false,

        /**
         * {Boolean} Not touching and dragging anymore, and smoothly animating the
         * touch sequence using deceleration.
         */
        __isDecelerating: false,

        /**
         * {Boolean} Smoothly animating the currently configured change
         */
        __isAnimating: false,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DIMENSIONS
          ---------------------------------------------------------------------------
        */

        /** {Integer} Viewport left boundary */
        __clientLeft: 0,

        /** {Integer} Viewport right boundary */
        __clientTop: 0,

        /** {Integer} Viewport width */
        __clientWidth: 0,

        /** {Integer} Viewport height */
        __clientHeight: 0,

        /** {Integer} Full content's width */
        __contentWidth: 0,

        /** {Integer} Full content's height */
        __contentHeight: 0,

        /** {Integer} Snapping width for content */
        __snapWidth: 100,

        /** {Integer} Snapping height for content */
        __snapHeight: 100,

        /** {Number} Zoom level */
        __zoomLevel: 1,

        /** {Number} Scroll position on x-axis */
        __scrollLeft: 0,

        /** {Number} Scroll position on y-axis */
        __scrollTop: 0,

        /** {Integer} Maximum allowed scroll position on x-axis */
        __maxScrollLeft: 0,

        /** {Integer} Maximum allowed scroll position on y-axis */
        __maxScrollTop: 0,

        /* {Number} Scheduled left position (final position when animating) */
        __scheduledLeft: 0,

        /* {Number} Scheduled top position (final position when animating) */
        __scheduledTop: 0,

        /* {Number} Scheduled zoom level (final scale when animating) */
        __scheduledZoom: 0,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: LAST POSITIONS
          ---------------------------------------------------------------------------
        */

        /** {Number} Left position of finger at start */
        __lastTouchLeft: null,

        /** {Number} Top position of finger at start */
        __lastTouchTop: null,

        /** {Date} Timestamp of last move of finger. Used to limit tracking range for deceleration speed. */
        __lastTouchMove: null,

        /** {Array} List of positions, uses three indexes for each state: left, top, timestamp */
        __positions: null,



        /*
          ---------------------------------------------------------------------------
          INTERNAL FIELDS :: DECELERATION SUPPORT
          ---------------------------------------------------------------------------
        */

        /** {Integer} Minimum left scroll position during deceleration */
        __minDecelerationScrollLeft: null,

        /** {Integer} Minimum top scroll position during deceleration */
        __minDecelerationScrollTop: null,

        /** {Integer} Maximum left scroll position during deceleration */
        __maxDecelerationScrollLeft: null,

        /** {Integer} Maximum top scroll position during deceleration */
        __maxDecelerationScrollTop: null,

        /** {Number} Current factor to modify horizontal scroll position with on every step */
        __decelerationVelocityX: null,

        /** {Number} Current factor to modify vertical scroll position with on every step */
        __decelerationVelocityY: null,



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
        setDimensions : function (clientWidth, clientHeight, contentWidth, contentHeight) {
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
        },


        /**
         * Sets the client coordinates in relation to the document.
         *
         * @param left {Integer ? 0} Left position of outer element
         * @param top {Integer ? 0} Top position of outer element
         */
        setPosition : function (left, top) {
            this.__clientLeft = left || 0;
            this.__clientTop = top || 0;
        },


        /**
         * Configures the snapping (when snapping is active)
         *
         * @param width {Integer} Snapping width
         * @param height {Integer} Snapping height
         */
        setSnapSize : function (width, height) {
            this.__snapWidth = width;
            this.__snapHeight = height;
        },


        /**
         * Returns the scroll position and zooming values
         *
         * @return {Map} `left` and `top` scroll position and `zoom` level
         */
        getValues : function () {
            return {
                left: this.__scrollLeft,
                top: this.__scrollTop,
                right: this.__scrollLeft + this.__clientWidth/this.__zoomLevel,
                bottom: this.__scrollTop + this.__clientHeight/this.__zoomLevel,
                zoom: this.__zoomLevel
            };
        },


        /**
         * Get point in in content space from scroll coordinates.
         */
        getPoint : function (scrollLeft, scrollTop) {
            var values = this.getValues();

            return {
                left : scrollLeft / values.zoom,
                top : scrollTop / values.zoom
            };
        },


        /**
         * Returns the maximum scroll values
         *
         * @return {Map} `left` and `top` maximum scroll values
         */
        getScrollMax : function () {
            return {
                left: this.__maxScrollLeft,
                top: this.__maxScrollTop
            };
        },


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
        zoomTo : function (level, isAnimated, fixedLeft, fixedTop, callback) {
            if (!this.options.zooming) {
                throw new Error("Zooming is not enabled!");
            }

            // Add callback if exists
            if(callback) {
                this.__zoomComplete = callback;
            }

            // Stop deceleration
            if (this.__isDecelerating) {
                animate.stop(this.__isDecelerating);
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
            var left = k*(this.__scrollLeft + fixedLeft) - fixedLeft;
            var top = k*(this.__scrollTop + fixedTop) - fixedTop;

            // Limit x-axis
            if (left > this.__maxScrollLeft) {
                left = this.__maxScrollLeft;
            } else if (left < 0) {
                left = 0;
            }

            // Limit y-axis
            if (top > this.__maxScrollTop) {
                top = this.__maxScrollTop;
            } else if (top < 0) {
                top = 0;
            }

            // Push values out
            this.__publish(left, top, level, isAnimated);
        },


        /**
         * Zooms the content by the given factor.
         *
         * @param factor {Number} Zoom by given factor
         * @param isAnimated {Boolean ? false} Whether to use animation
         * @param originLeft {Number ? 0} Zoom in at given left coordinate
         * @param originTop {Number ? 0} Zoom in at given top coordinate
         * @param callback {Function ? null} A callback that gets fired when the zoom is complete.
         */
        zoomBy : function (factor, isAnimated, originLeft, originTop, callback) {
            this.zoomTo(this.__zoomLevel * factor, isAnimated, originLeft, originTop, callback);
        },


        /**
         * Scrolls to the given position. Respect limitations and snapping automatically.
         *
         * @param left {Number?null} Horizontal scroll position, keeps current if value is <code>null</code>
         * @param top {Number?null} Vertical scroll position, keeps current if value is <code>null</code>
         * @param isAnimated {Boolean?false} Whether the scrolling should happen using an animation
         * @param zoom {Number} [1.0] Zoom level to go to
         */
        scrollTo : function (left, top, isAnimated, zoom) {
            // Stop deceleration
            if (this.__isDecelerating) {
                animate.stop(this.__isDecelerating);
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
            } else {
                // Keep zoom when not defined
                zoom = this.__zoomLevel;
            }

            if (!this.options.scrollingX) {
                left = this.__scrollLeft;
            } else {
                if (this.options.paging) {
                    left = Math.round(left / this.__clientWidth) * this.__clientWidth;
                } else if (this.options.snapping) {
                    left = Math.round(left / this.__snapWidth) * this.__snapWidth;
                }
            }

            if (!this.options.scrollingY) {
                top = this.__scrollTop;
            } else {
                if (this.options.paging) {
                    top = Math.round(top / this.__clientHeight) * this.__clientHeight;
                } else if (this.options.snapping) {
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
        },


        /**
         * Scroll by the given offset
         *
         * @param left {Number ? 0} Scroll x-axis by given offset
         * @param top {Number ? 0} Scroll x-axis by given offset
         * @param isAnimated {Boolean ? false} Whether to animate the given change
         */
        scrollBy : function (left, top, isAnimated) {
            var startLeft = this.__isAnimating ? this.__scheduledLeft : this.__scrollLeft;
            var startTop = this.__isAnimating ? this.__scheduledTop : this.__scrollTop;

            this.scrollTo(startLeft + (left || 0), startTop + (top || 0), isAnimated);
        },


        /*
          ---------------------------------------------------------------------------
          EVENT CALLBACKS
          ---------------------------------------------------------------------------
        */

        /**
         * Mouse wheel handler for zooming support
         */
        doMouseZoom : function (wheelDelta, timeStamp, pageX, pageY) {
            var change = wheelDelta > 0 ? 0.97 : 1.03;

            return this.zoomTo(this.__zoomLevel * change, false, pageX - this.__clientLeft, pageY - this.__clientTop);
        },


        /**
         * Touch start handler for scrolling support
         */
        doTouchStart : function (touches, timeStamp) {
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
                animate.stop(this.__isDecelerating);
                this.__isDecelerating = false;
                this.__interruptedAnimation = true;
            }

            // Stop animation
            if (this.__isAnimating) {
                animate.stop(this.__isAnimating);
                this.__isAnimating = false;
                this.__interruptedAnimation = true;
            }

            // Use center point when dealing with two fingers
            var currentTouchLeft, currentTouchTop;
            var isSingleTouch = touches.length === 1;
            if (isSingleTouch) {
                currentTouchLeft = touches[0].pageX;
                currentTouchTop = touches[0].pageY;
            } else {
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
        },


        /**
         * Touch move handler for scrolling support
         * @param {Number} [1.0] scale - ....
         */
        doTouchMove : function (touches, timeStamp, scale) {
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
            } else {
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
                            scrollLeft += (moveX / 2  * this.options.speedMultiplier);
                        } else if (scrollLeft > maxScrollLeft) {
                            scrollLeft = maxScrollLeft;
                        } else {
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
                        } else if (scrollTop > maxScrollTop) {
                            scrollTop = maxScrollTop;
                        } else {
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
            } else {
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
        },


        /**
         * Touch end handler for scrolling support
         */
        doTouchEnd : function (timeStamp) {
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
                    } else {
                        this.options.scrollingComplete();
                    }
                } else if ((timeStamp - this.__lastTouchMove) > 100) {
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
        },



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
        __publish : function (left, top, zoom, isAnimated) {
            // Remember whether we had an animation, then we try to continue
            // based on the current "drive" of the animation.
            var wasAnimating = this.__isAnimating;
            if (wasAnimating) {
                animate.stop(wasAnimating);
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
                this.__isAnimating = animate.start(step, verify, completed, this.options.animationDuration, wasAnimating ? easeOutCubic : easeInOutCubic);

            } else {
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
        },


        /**
         * Recomputes scroll minimum values based on client dimensions and content dimensions.
         */
        __computeScrollMax : function (zoomLevel) {
            if (zoomLevel === undefined) {
                zoomLevel = this.__zoomLevel;
            }

            this.__maxScrollLeft = Math.max(this.__contentWidth*zoomLevel - this.__clientWidth, 0);
            this.__maxScrollTop = Math.max(this.__contentHeight*zoomLevel - this.__clientHeight, 0);
        },



        /*
          ---------------------------------------------------------------------------
          ANIMATION (DECELERATION) SUPPORT
          ---------------------------------------------------------------------------
        */

        /**
         * Called when a touch sequence end and the speed of the finger was high enough
         * to switch into deceleration mode.
         */
        __startDeceleration : function (timeStamp) {
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
            } else {
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
            this.__isDecelerating = animate.start(step, verify, completed);
        },


        /**
         * Called on every step of the animation
         *
         * @param inMemory {Boolean?false} Whether to not render the current step, but keep it in memory only. Used internally only!
         */
        __stepThroughDeceleration : function (render) {

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
            } else {
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
                } else if (scrollLeft > this.__maxDecelerationScrollLeft) {
                    scrollOutsideX = this.__maxDecelerationScrollLeft - scrollLeft;
                }

                if (scrollTop < this.__minDecelerationScrollTop) {
                    scrollOutsideY = this.__minDecelerationScrollTop - scrollTop;
                } else if (scrollTop > this.__maxDecelerationScrollTop) {
                    scrollOutsideY = this.__maxDecelerationScrollTop - scrollTop;
                }

                // Slow down until slow enough, then flip back to snap position
                if (scrollOutsideX !== 0) {
                    if (scrollOutsideX * this.__decelerationVelocityX <= 0) {
                        this.__decelerationVelocityX += scrollOutsideX * penetrationDeceleration;
                    } else {
                        this.__decelerationVelocityX = scrollOutsideX * penetrationAcceleration;
                    }
                }

                if (scrollOutsideY !== 0) {
                    if (scrollOutsideY * this.__decelerationVelocityY <= 0) {
                        this.__decelerationVelocityY += scrollOutsideY * penetrationDeceleration;
                    } else {
                        this.__decelerationVelocityY = scrollOutsideY * penetrationAcceleration;
                    }
                }
            }
        }
    };

    return Scroller;
}));


/***/ }),

/***/ "./node_modules/scroller/lib/animate.js":
/*!**********************************************!*\
  !*** ./node_modules/scroller/lib/animate.js ***!
  \**********************************************/
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
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
    } else {}
}(this, function (exports) {
    var global = typeof window === 'undefined' ? this : window
    var time = Date.now || function () {
        return +new Date();
    };
    var desiredFrames = 60;
    var millisecondsPerSecond = 1000;
    var running = {};
    var counter = 1;

    /**
     * A requestAnimationFrame wrapper / polyfill.
     *
     * @param callback {Function} The callback to be invoked before the next repaint.
     * @param root {HTMLElement} The root element for the repaint
     */
    exports.requestAnimationFrame = (function () {
        // Check for request animation Frame support
        var requestFrame = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.mozRequestAnimationFrame || global.oRequestAnimationFrame;
        var isNative = !!requestFrame;

        if (requestFrame && !/requestAnimationFrame\(\)\s*\{\s*\[native code\]\s*\}/i.test(requestFrame.toString())) {
            isNative = false;
        }

        if (isNative) {
            return function (callback, root) {
                requestFrame(callback, root);
            };
        }

        var TARGET_FPS = 60;
        var requests = {};
        var requestCount = 0;
        var rafHandle = 1;
        var intervalHandle = null;
        var lastActive = +new Date();

        return function (callback, root) {
            var callbackHandle = rafHandle++;

            // Store callback
            requests[callbackHandle] = callback;
            requestCount++;

            // Create timeout at first request
            if (intervalHandle === null) {

                intervalHandle = setInterval(function () {

                    var time = +new Date();
                    var currentRequests = requests;

                    // Reset data structure before executing callbacks
                    requests = {};
                    requestCount = 0;

                    for(var key in currentRequests) {
                        if (currentRequests.hasOwnProperty(key)) {
                            currentRequests[key](time);
                            lastActive = time;
                        }
                    }

                    // Disable the timeout when nothing happens for a certain
                    // period of time
                    if (time - lastActive > 2500) {
                        clearInterval(intervalHandle);
                        intervalHandle = null;
                    }

                }, 1000 / TARGET_FPS);
            }

            return callbackHandle;
        };

    })();

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
            } else if (render) {
                lastFrame = now;
                exports.requestAnimationFrame(step, root);
            }
        };

        // Mark as running
        running[id] = true;

        // Init first step
        exports.requestAnimationFrame(step, root);

        // Return unique animation ID
        return id;
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
/* harmony import */ var scroller__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! scroller */ "./node_modules/scroller/index.js");
/* harmony import */ var scroller__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(scroller__WEBPACK_IMPORTED_MODULE_2__);
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
        this.scrollerObj = new scroller__WEBPACK_IMPORTED_MODULE_2__.Scroller(this.scrollHandler.bind(this), this.scrollerOption);
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
            _this.scrollerObj.doTouchMove(touches, e.timeStamp);
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
        this.scrollerObj.scrollTo(left, top, animate);
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
        // this.toCanvasData();
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
        _this.version = '1.0.2';
        _this.hasEventHandler = false;
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
        _this.viewportScale = 1;
        _this.hasViewPortSet = false;
        _this.realLayoutBox = {
            realX: 0,
            realY: 0,
        };
        _this.bitMapFonts = [];
        _this.eleCount = 0;
        _this.state = _common_util__WEBPACK_IMPORTED_MODULE_5__.STATE.UNINIT;
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
        // this.isNeedRepaint = false;
        _this.on('repaint', function () {
            _this.isNeedRepaint = true;
        });
        // this.ticker = new Ticker();
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
        debugInfo.start('observeStyleAndEvent', true);
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
        if (this.hasEventHandler) {
            return;
        }
        this.hasEventHandler = true;
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
        this.hasEventHandler = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vcGFja2FnZXMvcGx1Z2luL3BsdWdpbi9lbmdpbmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUEwQztBQUNoRDtBQUNBLElBQUksaUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLGtHQUFDO0FBQ3ZCLElBQUksS0FBSyxFQVFOO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGFBQWE7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsYUFBYTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxjQUFjO0FBQ2Q7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5Q0FBeUMsc0RBQXNEO0FBQy9GO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUzs7OztBQUlUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLFFBQVE7QUFDaEMsdUJBQXVCLFFBQVE7QUFDL0IsOEJBQThCLGVBQWU7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBOztBQUVBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7O0FBR1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7Ozs7QUFJVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7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QU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU1RCxJQUFJLFdBQVcsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUN0QixPQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDOUMsT0FBTztTQUNSO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLE9BQWhCLE1BQU0saUJBQVcsSUFBSSxHQUFLLE9BQU8sVUFBRTtTQUNwQztRQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0NBQWUsTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLHdCQUFNLENBQUM7UUFDbkQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQWpDYyx1QkFBZ0IsR0FBc0IsRUFBRSxDQUFDO0lBa0MxRCxhQUFDO0NBQUEsQ0EvZ0JvQiw0REFBTyxHQStnQjNCO0FBRUQsaUVBQWUsSUFBSSxNQUFNLENBQUM7SUFDeEIsS0FBSyxFQUFFO1FBQ0wsS0FBSyxFQUFFLENBQUM7UUFDUixNQUFNLEVBQUUsQ0FBQztLQUNWO0lBQ0QsSUFBSSxFQUFFLFFBQVE7Q0FDZixDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL2Nzcy1sYXlvdXQvZGlzdC9jc3MtbGF5b3V0LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvc2Nyb2xsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9zY3JvbGxlci9saWIvU2Nyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9zY3JvbGxlci9saWIvYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2VsZW1lbnRzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbWFnZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbHZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy90ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy92aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvZW52LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvbm9kZTJqc29uLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbE5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxzdHIyeG1sbm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQgZm9yIHJlZmVyZW5jZVxuLy9cbi8vIFRoaXMgZmlsZSB1c2VzIHRoZSBmb2xsb3dpbmcgc3BlY2lmaWMgVU1EIGltcGxlbWVudGF0aW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5jb21wdXRlTGF5b3V0ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbnZhciBjb21wdXRlTGF5b3V0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDU1NfVU5ERUZJTkVEO1xuXG4gIHZhciBDU1NfRElSRUNUSU9OX0lOSEVSSVQgPSAnaW5oZXJpdCc7XG4gIHZhciBDU1NfRElSRUNUSU9OX0xUUiA9ICdsdHInO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9SVEwgPSAncnRsJztcblxuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA9ICdyb3cnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFID0gJ3Jvdy1yZXZlcnNlJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gPSAnY29sdW1uJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSA9ICdjb2x1bW4tcmV2ZXJzZSc7XG5cbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfSlVTVElGWV9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4gPSAnc3BhY2UtYmV0d2Vlbic7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQgPSAnc3BhY2UtYXJvdW5kJztcblxuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfQUxJR05fQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfQUxJR05fRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0FMSUdOX1NUUkVUQ0ggPSAnc3RyZXRjaCc7XG5cbiAgdmFyIENTU19QT1NJVElPTl9SRUxBVElWRSA9ICdyZWxhdGl2ZSc7XG4gIHZhciBDU1NfUE9TSVRJT05fQUJTT0xVVEUgPSAnYWJzb2x1dGUnO1xuXG4gIHZhciBsZWFkaW5nID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIHRyYWlsaW5nID0ge1xuICAgICdyb3cnOiAncmlnaHQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdsZWZ0JyxcbiAgICAnY29sdW1uJzogJ2JvdHRvbScsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ3RvcCdcbiAgfTtcbiAgdmFyIHBvcyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciBkaW0gPSB7XG4gICAgJ3Jvdyc6ICd3aWR0aCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3dpZHRoJyxcbiAgICAnY29sdW1uJzogJ2hlaWdodCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2hlaWdodCdcbiAgfTtcblxuICAvLyBXaGVuIHRyYW5zcGlsZWQgdG8gSmF2YSAvIEMgdGhlIG5vZGUgdHlwZSBoYXMgbGF5b3V0LCBjaGlsZHJlbiBhbmQgc3R5bGVcbiAgLy8gcHJvcGVydGllcy4gRm9yIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZXNlIHByb3BlcnRpZXNcbiAgLy8gaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LlxuICBmdW5jdGlvbiBmaWxsTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5sYXlvdXQgfHwgbm9kZS5pc0RpcnR5KSB7XG4gICAgICBub2RlLmxheW91dCA9IHtcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuc3R5bGUpIHtcbiAgICAgIG5vZGUuc3R5bGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZpbGxOb2Rlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNSb3dEaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5TdGFydCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5TdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luRW5kICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbkVuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nRW5kICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nRW5kID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdFbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpICtcbiAgICAgICAgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduQ29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25Db250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQuc3R5bGUuYWxpZ25TZWxmKSB7XG4gICAgICByZXR1cm4gY2hpbGQuc3R5bGUuYWxpZ25TZWxmO1xuICAgIH1cbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkl0ZW1zKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkl0ZW1zO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmV0Y2gnO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUF4aXMoYXhpcywgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9SVEwpIHtcbiAgICAgIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gICAgICB9IGVsc2UgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSkge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICBpZiAobm9kZS5zdHlsZS5kaXJlY3Rpb24pIHtcbiAgICAgIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSBDU1NfRElSRUNUSU9OX0lOSEVSSVQ7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9JTkhFUklUKSB7XG4gICAgICBkaXJlY3Rpb24gPSAocGFyZW50RGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBDU1NfRElSRUNUSU9OX0xUUiA6IHBhcmVudERpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZsZXhEaXJlY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24sIGRpcmVjdGlvbikge1xuICAgIGlmIChpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uVHlwZShub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gJ3JlbGF0aXZlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleChub2RlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGdldFBvc2l0aW9uVHlwZShub2RlKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICBub2RlLnN0eWxlLmZsZXggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleFdyYXAobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhXcmFwID09PSAnd3JhcCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREaW1XaXRoTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSArIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0RpbURlZmluZWQobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlW2RpbVtheGlzXV0gPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUG9zRGVmaW5lZChub2RlLCBwb3MpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lYXN1cmVEZWZpbmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5tZWFzdXJlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbihub2RlLCBwb3MpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc107XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gYm91bmRBeGlzKG5vZGUsIGF4aXMsIHZhbHVlKSB7XG4gICAgdmFyIG1pbiA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1pbkhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluSGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBtYXggPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5tYXhIZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1heEhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgYm91bmRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCAmJiBtYXggPj0gMCAmJiBib3VuZFZhbHVlID4gbWF4KSB7XG4gICAgICBib3VuZFZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBpZiAobWluICE9PSB1bmRlZmluZWQgJiYgbWluID49IDAgJiYgYm91bmRWYWx1ZSA8IG1pbikge1xuICAgICAgYm91bmRWYWx1ZSA9IG1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmbWF4ZihhLCBiKSB7XG4gICAgaWYgKGEgPiBiKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB1c2VyIHNwZWNpZmljYWxseSBzZXRzIGEgdmFsdWUgZm9yIHdpZHRoIG9yIGhlaWdodFxuICBmdW5jdGlvbiBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgYXhpcykge1xuICAgIC8vIFRoZSBwYXJlbnQgYWxyZWFkeSBjb21wdXRlZCB1cyBhIHdpZHRoIG9yIGhlaWdodC4gV2UganVzdCBza2lwIGl0XG4gICAgaWYgKG5vZGUubGF5b3V0W2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXZSBvbmx5IHJ1biBpZiB0aGVyZSdzIGEgd2lkdGggb3IgaGVpZ2h0IGRlZmluZWRcbiAgICBpZiAoIWlzRGltRGVmaW5lZChub2RlLCBheGlzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBkaW1lbnNpb25zIGNhbiBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlclxuICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgIGJvdW5kQXhpcyhub2RlLCBheGlzLCBub2RlLnN0eWxlW2RpbVtheGlzXV0pLFxuICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcylcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgYXhpcykge1xuICAgIGNoaWxkLmxheW91dFt0cmFpbGluZ1theGlzXV0gPSBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLSBjaGlsZC5sYXlvdXRbcG9zW2F4aXNdXTtcbiAgfVxuXG4gIC8vIElmIGJvdGggbGVmdCBhbmQgcmlnaHQgYXJlIGRlZmluZWQsIHRoZW4gdXNlIGxlZnQuIE90aGVyd2lzZSByZXR1cm5cbiAgLy8gK2xlZnQgb3IgLXJpZ2h0IGRlcGVuZGluZyBvbiB3aGljaCBpcyBkZWZpbmVkLlxuICBmdW5jdGlvbiBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtsZWFkaW5nW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZ2V0UG9zaXRpb24obm9kZSwgbGVhZGluZ1theGlzXSk7XG4gICAgfVxuICAgIHJldHVybiAtZ2V0UG9zaXRpb24obm9kZSwgdHJhaWxpbmdbYXhpc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIC8qY3NzX2RpcmVjdGlvbl90Ki9wYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIvKmNzc19kaXJlY3Rpb25fdCovIGRpcmVjdGlvbiA9IHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gbWFpbkF4aXMgPSByZXNvbHZlQXhpcyhnZXRGbGV4RGlyZWN0aW9uKG5vZGUpLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBjcm9zc0F4aXMgPSBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24obWFpbkF4aXMsIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIHJlc29sdmVkUm93QXhpcyA9IHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG5cbiAgICAvLyBIYW5kbGUgd2lkdGggYW5kIGhlaWdodCBzdHlsZSBhdHRyaWJ1dGVzXG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIG1haW5BeGlzKTtcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIFNldCB0aGUgcmVzb2x2ZWQgcmVzb2x1dGlvbiBpbiB0aGUgbm9kZSdzIGxheW91dFxuICAgIG5vZGUubGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgIC8vIFRoZSBwb3NpdGlvbiBpcyBzZXQgYnkgdGhlIHBhcmVudCwgYnV0IHdlIG5lZWQgdG8gY29tcGxldGUgaXQgd2l0aCBhXG4gICAgLy8gZGVsdGEgY29tcG9zZWQgb2YgdGhlIG1hcmdpbiBhbmQgbGVmdC90b3AvcmlnaHQvYm90dG9tXG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1ttYWluQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW21haW5BeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1tjcm9zc0F4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIElubGluZSBpbW11dGFibGUgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBub2RlIHRvIGF2b2lkIGV4Y2Vzc2l2ZSBtZXRob2RcbiAgICAvLyBpbnZvY2F0aW9ucyBkdXJpbmcgdGhlIGxheW91dCBjYWxjdWxhdGlvbi5cbiAgICB2YXIvKmludCovIGNoaWxkQ291bnQgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG5cbiAgICBpZiAoaXNNZWFzdXJlRGVmaW5lZChub2RlKSkge1xuICAgICAgdmFyLypib29sKi8gaXNSZXNvbHZlZFJvd0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dKTtcblxuICAgICAgdmFyLypmbG9hdCovIHdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICB3aWR0aCA9IG5vZGUuc3R5bGUud2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuICAgICAgfVxuICAgICAgd2lkdGggLT0gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcblxuICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGdpdmUgYSBkaW1lbnNpb24gZm9yIHRoZSB0ZXh0IGlmIHdlIGhhdmVuJ3QgZ290IGFueVxuICAgICAgLy8gZm9yIGl0IGNvbXB1dGVkIHlldC4gSXQgY2FuIGVpdGhlciBiZSBmcm9tIHRoZSBzdHlsZSBhdHRyaWJ1dGUgb3IgYmVjYXVzZVxuICAgICAgLy8gdGhlIGVsZW1lbnQgaXMgZmxleGlibGUuXG4gICAgICB2YXIvKmJvb2wqLyBpc1Jvd1VuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAmJiAhaXNSZXNvbHZlZFJvd0RpbURlZmluZWQ7XG4gICAgICB2YXIvKmJvb2wqLyBpc0NvbHVtblVuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTikgJiZcbiAgICAgICAgaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW0NTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5dXSk7XG5cbiAgICAgIC8vIExldCdzIG5vdCBtZWFzdXJlIHRoZSB0ZXh0IGlmIHdlIGFscmVhZHkga25vdyBib3RoIGRpbWVuc2lvbnNcbiAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCB8fCBpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICB2YXIvKmNzc19kaW1fdCovIG1lYXN1cmVEaW0gPSBub2RlLnN0eWxlLm1lYXN1cmUoXG4gICAgICAgICAgLyooYykhbm9kZS0+Y29udGV4dCwqL1xuICAgICAgICAgIC8qKGphdmEpIWxheW91dENvbnRleHQubWVhc3VyZU91dHB1dCwqL1xuICAgICAgICAgIHdpZHRoXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbWVhc3VyZURpbS53aWR0aCArXG4gICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG1lYXN1cmVEaW0uaGVpZ2h0ICtcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gaXNOb2RlRmxleFdyYXAgPSBpc0ZsZXhXcmFwKG5vZGUpO1xuXG4gICAgdmFyLypjc3NfanVzdGlmeV90Ki8ganVzdGlmeUNvbnRlbnQgPSBnZXRKdXN0aWZ5Q29udGVudChub2RlKTtcblxuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW4gPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3MgPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBjcm9zc0F4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW4gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgdmFyLypib29sKi8gaXNNYWluRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNDcm9zc0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc01haW5Sb3dEaXJlY3Rpb24gPSBpc1Jvd0RpcmVjdGlvbihtYWluQXhpcyk7XG5cbiAgICB2YXIvKmludCovIGk7XG4gICAgdmFyLyppbnQqLyBpaTtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY2hpbGQ7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGF4aXM7XG5cbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEFic29sdXRlQ2hpbGQgPSBudWxsO1xuXG4gICAgdmFyLypmbG9hdCovIGRlZmluZWRNYWluRGltID0gQ1NTX1VOREVGSU5FRDtcbiAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgZGVmaW5lZE1haW5EaW0gPSBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSAtIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbjtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIGV4ZWN1dGUgdGhlIG5leHQgdHdvIGxvb3BzIG9uZSBwZXIgbGluZSB3aXRoIGZsZXgtd3JhcFxuICAgIHZhci8qaW50Ki8gc3RhcnRMaW5lID0gMDtcbiAgICB2YXIvKmludCovIGVuZExpbmUgPSAwO1xuICAgIC8vIHZhci8qaW50Ki8gbmV4dE9mZnNldCA9IDA7XG4gICAgdmFyLyppbnQqLyBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAvLyBXZSBhZ2dyZWdhdGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlIGNvbnRhaW5lciBpbiB0aG9zZSB0d28gdmFyaWFibGVzXG4gICAgdmFyLypmbG9hdCovIGxpbmVzQ3Jvc3NEaW0gPSAwO1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc01haW5EaW0gPSAwO1xuICAgIHZhci8qaW50Ki8gbGluZXNDb3VudCA9IDA7XG4gICAgd2hpbGUgKGVuZExpbmUgPCBjaGlsZENvdW50KSB7XG4gICAgICAvLyA8TG9vcCBBPiBMYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBjb3VudCBjaGlsZHJlbiBieSB0eXBlXG5cbiAgICAgIC8vIG1haW5Db250ZW50RGltIGlzIGFjY3VtdWxhdGlvbiBvZiB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2luIG9mIGFsbCB0aGVcbiAgICAgIC8vIG5vbiBmbGV4aWJsZSBjaGlsZHJlbi4gVGhpcyB3aWxsIGJlIHVzZWQgaW4gb3JkZXIgdG8gZWl0aGVyIHNldCB0aGVcbiAgICAgIC8vIGRpbWVuc2lvbnMgb2YgdGhlIG5vZGUgaWYgbm9uZSBhbHJlYWR5IGV4aXN0LCBvciB0byBjb21wdXRlIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlIGxlZnQgZm9yIHRoZSBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluQ29udGVudERpbSA9IDA7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSB0aHJlZSBraW5kIG9mIGNoaWxkcmVuLCBub24gZmxleGlibGUsIGZsZXhpYmxlIGFuZCBhYnNvbHV0ZS5cbiAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyBob3cgbWFueSB0aGVyZSBhcmUgaW4gb3JkZXIgdG8gZGlzdHJpYnV0ZSB0aGUgc3BhY2UuXG4gICAgICB2YXIvKmludCovIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gdG90YWxGbGV4aWJsZSA9IDA7XG4gICAgICB2YXIvKmludCovIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG5cbiAgICAgIC8vIFVzZSB0aGUgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBtYWluIGF4aXMgZm9yIGFzIGxvbmdcbiAgICAgIC8vIGFzIHRoZXkgYXJlIHVzaW5nIGEgc2ltcGxlIHN0YWNraW5nIGJlaGF2aW91ci4gQ2hpbGRyZW4gdGhhdCBhcmVcbiAgICAgIC8vIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcCB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluXG4gICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tNYWluID1cbiAgICAgICAgICAoaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAoIWlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0NFTlRFUik7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleE1haW4gPSAoaXNTaW1wbGVTdGFja01haW4gPyBjaGlsZENvdW50IDogc3RhcnRMaW5lKTtcblxuICAgICAgLy8gVXNlIHRoZSBpbml0aWFsIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgY3Jvc3MgYXhpcyBmb3JcbiAgICAgIC8vIGFzIGxvbmcgYXMgdGhleSBhcmUgcmVsYXRpdmVseSBwb3NpdGlvbmVkIHdpdGggYWxpZ25tZW50IFNUUkVUQ0ggb3JcbiAgICAgIC8vIEZMRVhfU1RBUlQuIENoaWxkcmVuIHRoYXQgYXJlIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcFxuICAgICAgLy8gd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpbiBpbiA8TG9vcCBEPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tDcm9zcyA9IHRydWU7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleENyb3NzID0gY2hpbGRDb3VudDtcblxuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0RmxleENoaWxkID0gbnVsbDtcbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgdmFyLypmbG9hdCovIG1haW5EaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW47XG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW0gPSAwO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWF4V2lkdGg7XG4gICAgICBmb3IgKGkgPSBzdGFydExpbmU7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZC5saW5lSW5kZXggPSBsaW5lc0NvdW50O1xuXG4gICAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG5cbiAgICAgICAgLy8gUHJlLWZpbGwgY3Jvc3MgYXhpcyBkaW1lbnNpb25zIHdoZW4gdGhlIGNoaWxkIGlzIHVzaW5nIHN0cmV0Y2ggYmVmb3JlXG4gICAgICAgIC8vIHdlIGNhbGwgdGhlIHJlY3Vyc2l2ZSBsYXlvdXQgcGFzc1xuICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCAmJlxuICAgICAgICAgICAgZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICAgICAgICBpc0Nyb3NzRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgY3Jvc3NBeGlzKSkge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSkge1xuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2hpbGRyZW5cbiAgICAgICAgICAvLyBzbyB0aGF0IHdlIGNhbiBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEFic29sdXRlQ2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3IgdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoXG4gICAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpLFxuICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGF4aXMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyLypmbG9hdCovIG5leHRDb250ZW50RGltID0gMDtcblxuICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGNvbnNpZGVyIGEgY2hpbGQgZmxleGlibGUgaWYgd2UgaGF2ZSBhIGNvbXB1dGVkXG4gICAgICAgIC8vIGRpbWVuc2lvbiBmb3IgdGhlIG5vZGUuXG4gICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkICYmIGlzRmxleChjaGlsZCkpIHtcbiAgICAgICAgICBmbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICB0b3RhbEZsZXhpYmxlICs9IGNoaWxkLnN0eWxlLmZsZXg7XG5cbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgZmxleGlibGUgY2hpbGRyZW4gc28gdGhhdCB3ZSBjYW5cbiAgICAgICAgICAvLyBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEZsZXhDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBFdmVuIGlmIHdlIGRvbid0IGtub3cgaXRzIGV4YWN0IHNpemUgeWV0LCB3ZSBhbHJlYWR5IGtub3cgdGhlIHBhZGRpbmcsXG4gICAgICAgICAgLy8gYm9yZGVyIGFuZCBtYXJnaW4uIFdlJ2xsIHVzZSB0aGlzIHBhcnRpYWwgaW5mb3JtYXRpb24sIHdoaWNoIHJlcHJlc2VudHNcbiAgICAgICAgICAvLyB0aGUgc21hbGxlc3QgcG9zc2libGUgc2l6ZSBmb3IgdGhlIGNoaWxkLCB0byBjb21wdXRlIHRoZSByZW1haW5pbmdcbiAgICAgICAgICAvLyBhdmFpbGFibGUgc3BhY2UuXG4gICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIG1haW5BeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gcmVjdXJzaXZlIGNhbGwuIFdlIGxheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICAgICAgaWYgKGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPT09IDApIHtcbiAgICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWJzb2x1dGUgcG9zaXRpb25lZCBlbGVtZW50cyBkbyBub3QgdGFrZSBwYXJ0IG9mIHRoZSBsYXlvdXQsIHNvIHdlXG4gICAgICAgICAgLy8gZG9uJ3QgdXNlIHRoZW0gdG8gY29tcHV0ZSBtYWluQ29udGVudERpbVxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIGFuZCBtYXJnaW4gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZWxlbWVudCB3ZSBhcmUgYWJvdXQgdG8gYWRkIHdvdWxkIG1ha2UgdXMgZ28gdG8gdGhlIG5leHQgbGluZVxuICAgICAgICBpZiAoaXNOb2RlRmxleFdyYXAgJiZcbiAgICAgICAgICAgIGlzTWFpbkRpbURlZmluZWQgJiZcbiAgICAgICAgICAgIG1haW5Db250ZW50RGltICsgbmV4dENvbnRlbnREaW0gPiBkZWZpbmVkTWFpbkRpbSAmJlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBvbmx5IG9uZSBlbGVtZW50LCB0aGVuIGl0J3MgYmlnZ2VyIHRoYW4gdGhlIGNvbnRlbnRcbiAgICAgICAgICAgIC8vIGFuZCBuZWVkcyBpdHMgb3duIGxpbmVcbiAgICAgICAgICAgIGkgIT09IHN0YXJ0TGluZSkge1xuICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudC0tO1xuICAgICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIG1haW4gYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbiAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fCBpc0ZsZXgoY2hpbGQpKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tNYWluID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4TWFpbiA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgY3Jvc3MgYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgRD4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MgJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHxcbiAgICAgICAgICAgICAgICAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fU1RSRVRDSCAmJiBhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICAgICAgIGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tDcm9zcyA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleENyb3NzID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbikge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWFpbkRpbSArPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAgICAgbWFpbkNvbnRlbnREaW0gKz0gbmV4dENvbnRlbnREaW07XG4gICAgICAgIGVuZExpbmUgPSBpICsgMTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQj4gTGF5b3V0IGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBhbGxvY2F0ZSBlbXB0eSBzcGFjZVxuXG4gICAgICAvLyBJbiBvcmRlciB0byBwb3NpdGlvbiB0aGUgZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcywgd2UgaGF2ZSB0d29cbiAgICAgIC8vIGNvbnRyb2xzLiBUaGUgc3BhY2UgYmV0d2VlbiB0aGUgYmVnaW5uaW5nIGFuZCB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gYW5kIHRoZSBzcGFjZSBiZXR3ZWVuIGVhY2ggdHdvIGVsZW1lbnRzLlxuICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdNYWluRGltID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBiZXR3ZWVuTWFpbkRpbSA9IDA7XG5cbiAgICAgIC8vIFRoZSByZW1haW5pbmcgYXZhaWxhYmxlIHNwYWNlIHRoYXQgbmVlZHMgdG8gYmUgYWxsb2NhdGVkXG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nTWFpbkRpbSA9IDA7XG4gICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZGVmaW5lZE1haW5EaW0gLSBtYWluQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihtYWluQ29udGVudERpbSwgMCkgLSBtYWluQ29udGVudERpbTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGZsZXhpYmxlIGNoaWxkcmVuIGluIHRoZSBtaXgsIHRoZXkgYXJlIGdvaW5nIHRvIGZpbGwgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2VcbiAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgIT09IDApIHtcbiAgICAgICAgdmFyLypmbG9hdCovIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYmFzZU1haW5EaW07XG4gICAgICAgIHZhci8qZmxvYXQqLyBib3VuZE1haW5EaW07XG5cbiAgICAgICAgLy8gSWYgdGhlIGZsZXggc2hhcmUgb2YgcmVtYWluaW5nIHNwYWNlIGRvZXNuJ3QgbWVldCBtaW4vbWF4IGJvdW5kcyxcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgY2hpbGQgZnJvbSBmbGV4IGNhbGN1bGF0aW9ucy5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGJhc2VNYWluRGltID0gZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGJvdW5kTWFpbkRpbSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcywgYmFzZU1haW5EaW0pO1xuXG4gICAgICAgICAgaWYgKGJhc2VNYWluRGltICE9PSBib3VuZE1haW5EaW0pIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gLT0gYm91bmRNYWluRGltO1xuICAgICAgICAgICAgdG90YWxGbGV4aWJsZSAtPSBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcblxuICAgICAgICAvLyBUaGUgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGNhbiBvdmVyZmxvdyB0aGUgY29udGFpbmVyLCBpbiB0aGlzIGNhc2VcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGp1c3QgYXNzdW1lIHRoYXQgdGhlcmUgaXMgbm8gc3BhY2UgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoZmxleGlibGVNYWluRGltIDwgMCkge1xuICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIG9mIHRoZSBlbGVtZW50IGluIHRoZSBtYWluXG4gICAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsXG4gICAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgbGF5b3V0IGFsZ29yaXRobSBmb3IgdGhpcyBjaGlsZFxuICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jdXJyZW50RmxleENoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgIGNoaWxkID0gY3VycmVudEZsZXhDaGlsZDtcbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFdlIHVzZSBqdXN0aWZ5Q29udGVudCB0byBmaWd1cmUgb3V0IGhvdyB0byBhbGxvY2F0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAvLyBzcGFjZSBhdmFpbGFibGVcbiAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9DRU5URVIpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX0VORCkge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbTtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTikge1xuICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihyZW1haW5pbmdNYWluRGltLCAwKTtcbiAgICAgICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSAhPT0gMCkge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQpIHtcbiAgICAgICAgICAvLyBTcGFjZSBvbiB0aGUgZWRnZXMgaXMgaGFsZiBvZiB0aGUgc3BhY2UgYmV0d2VlbiBlbGVtZW50c1xuICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50KTtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IGJldHdlZW5NYWluRGltIC8gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBDPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzIGFuZCBjb21wdXRlIGRpbWVuc2lvbnNcblxuICAgICAgLy8gQXQgdGhpcyBwb2ludCwgYWxsIHRoZSBjaGlsZHJlbiBoYXZlIHRoZWlyIGRpbWVuc2lvbnMgc2V0LiBXZSBuZWVkIHRvXG4gICAgICAvLyBmaW5kIHRoZWlyIHBvc2l0aW9uLiBJbiBvcmRlciB0byBkbyB0aGF0LCB3ZSBhY2N1bXVsYXRlIGRhdGEgaW5cbiAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGFyZSBhbHNvIHVzZWZ1bCB0byBjb21wdXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZVxuICAgICAgLy8gY29udGFpbmVyIVxuICAgICAgbWFpbkRpbSArPSBsZWFkaW5nTWFpbkRpbTtcblxuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4TWFpbjsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSBhbmQgaGFzIGxlZnQvdG9wIGJlaW5nXG4gICAgICAgICAgLy8gZGVmaW5lZCwgd2Ugb3ZlcnJpZGUgdGhlIHBvc2l0aW9uIHRvIHdoYXRldmVyIHRoZSB1c2VyIHNhaWRcbiAgICAgICAgICAvLyAoYW5kIG1hcmdpbi9ib3JkZXIpLlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSAod2l0aG91dCB0b3AvbGVmdCkgb3IgcmVsYXRpdmUsXG4gICAgICAgICAgLy8gd2UgcHV0IGl0IGF0IHRoZSBjdXJyZW50IGFjY3VtdWxhdGVkIG9mZnNldC5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSBwbGFjZWQgdGhlIGVsZW1lbnQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZG8gdGhhdCBmb3IgcmVsYXRpdmUgZWxlbWVudHMuIEFic29sdXRlIGVsZW1lbnRzXG4gICAgICAgICAgLy8gZG8gbm90IHRha2UgcGFydCBpbiB0aGF0IHBoYXNlLlxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBtYWluIGRpbWVuc2lvbiBpcyB0aGUgc3VtIG9mIGFsbCB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHBsdXNcbiAgICAgICAgICAgIC8vIHRoZSBzcGFjaW5nLlxuICAgICAgICAgICAgbWFpbkRpbSArPSBiZXR3ZWVuTWFpbkRpbSArIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICAgIC8vIFRoZSBjcm9zcyBkaW1lbnNpb24gaXMgdGhlIG1heCBvZiB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHNpbmNlIHRoZXJlXG4gICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgZWxlbWVudCBpbiB0aGF0IGNyb3NzIGRpbWVuc2lvbi5cbiAgICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjb250YWluZXJDcm9zc0F4aXMgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgIGNvbnRhaW5lckNyb3NzQXhpcyA9IGZtYXhmKFxuICAgICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgY3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEQ+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhDcm9zczsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgYWJzb2x1dGVseSBwb3NpdGlvbm5lZCBhbmQgaGFzIGFcbiAgICAgICAgICAvLyB0b3AvbGVmdC9ib3R0b20vcmlnaHQgYmVpbmcgc2V0LCB3ZSBvdmVycmlkZSBhbGwgdGhlIHByZXZpb3VzbHlcbiAgICAgICAgICAvLyBjb21wdXRlZCBwb3NpdGlvbnMgdG8gc2V0IGl0IGNvcnJlY3RseS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ0Nyb3NzRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgICAgIC8vIEZvciBhIHJlbGF0aXZlIGNoaWxkcmVuLCB3ZSdyZSBlaXRoZXIgdXNpbmcgYWxpZ25JdGVtcyAocGFyZW50KSBvclxuICAgICAgICAgIC8vIGFsaWduU2VsZiAoY2hpbGQpIGluIG9yZGVyIHRvIGRldGVybWluZSB0aGUgcG9zaXRpb24gaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAvLyBUaGlzIHZhcmlhYmxlIGlzIGludGVudGlvbmFsbHkgcmUtZGVmaW5lZCBhcyB0aGUgY29kZSBpcyB0cmFuc3BpbGVkIHRvIGEgYmxvY2sgc2NvcGUgbGFuZ3VhZ2VcbiAgICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgICAgLyplc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgICAvLyBZb3UgY2FuIG9ubHkgc3RyZXRjaCBpZiB0aGUgZGltZW5zaW9uIGhhcyBub3QgYWxyZWFkeSBiZWVuIHNldFxuICAgICAgICAgICAgICAvLyBwcmV2aW91c2x5LlxuICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSByZW1haW5pbmcgc3BhY2UgYmV0d2VlbiB0aGUgcGFyZW50IGRpbWVuc2lvbnMrcGFkZGluZyBhbmQgY2hpbGRcbiAgICAgICAgICAgICAgLy8gZGltZW5zaW9ucyttYXJnaW4uXG4gICAgICAgICAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdDcm9zc0RpbSA9IGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENTU19BTElHTl9GTEVYX0VORFxuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSBhcHBseSB0aGUgcG9zaXRpb25cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nQ3Jvc3NEaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZXNDcm9zc0RpbSArPSBjcm9zc0RpbTtcbiAgICAgIGxpbmVzTWFpbkRpbSA9IGZtYXhmKGxpbmVzTWFpbkRpbSwgbWFpbkRpbSk7XG4gICAgICBsaW5lc0NvdW50ICs9IDE7XG4gICAgICBzdGFydExpbmUgPSBlbmRMaW5lO1xuICAgIH1cblxuICAgIC8vIDxMb29wIEU+XG4gICAgLy9cbiAgICAvLyBOb3RlKHByZW5hdXgpOiBNb3JlIHRoYW4gb25lIGxpbmUsIHdlIG5lZWQgdG8gbGF5b3V0IHRoZSBjcm9zc0F4aXNcbiAgICAvLyBhY2NvcmRpbmcgdG8gYWxpZ25Db250ZW50LlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHdlIGNvdWxkIHByb2JhYmx5IHJlbW92ZSA8TG9vcCBEPiBhbmQgaGFuZGxlIHRoZSBvbmUgbGluZSBjYXNlXG4gICAgLy8gaGVyZSB0b28sIGJ1dCBmb3IgdGhlIG1vbWVudCB0aGlzIGlzIHNhZmVyIHNpbmNlIGl0IHdvbid0IGludGVyZmVyZSB3aXRoXG4gICAgLy8gcHJldmlvdXNseSB3b3JraW5nIGNvZGUuXG4gICAgLy9cbiAgICAvLyBTZWUgc3BlY3M6XG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMi9DUi1jc3MzLWZsZXhib3gtMjAxMjA5MTgvI2xheW91dC1hbGdvcml0aG1cbiAgICAvLyBzZWN0aW9uIDkuNFxuICAgIC8vXG4gICAgaWYgKGxpbmVzQ291bnQgPiAxICYmIGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICB2YXIvKmZsb2F0Ki8gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcztcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gPSBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplIC0gbGluZXNDcm9zc0RpbTtcblxuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltTGVhZCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gY3VycmVudExlYWQgPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50ID0gZ2V0QWxpZ25Db250ZW50KG5vZGUpO1xuICAgICAgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgaWYgKG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPiBsaW5lc0Nyb3NzRGltKSB7XG4gICAgICAgICAgY3Jvc3NEaW1MZWFkID0gKHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIGxpbmVzQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qaW50Ki8gZW5kSW5kZXggPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIvKmludCovIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcblxuICAgICAgICAvLyBjb21wdXRlIHRoZSBsaW5lJ3MgaGVpZ2h0IGFuZCBmaW5kIHRoZSBlbmRJbmRleFxuICAgICAgICB2YXIvKmZsb2F0Ki8gbGluZUhlaWdodCA9IDA7XG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGNoaWxkQ291bnQ7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQubGluZUluZGV4ICE9PSBpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgbGluZUhlaWdodCA9IGZtYXhmKFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dICsgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW5kSW5kZXggPSBpaTtcbiAgICAgICAgbGluZUhlaWdodCArPSBjcm9zc0RpbUxlYWQ7XG5cbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgZW5kSW5kZXg7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGxpbmVIZWlnaHQgLSBnZXRUcmFpbGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSAtIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgIHZhci8qZmxvYXQqLyBjaGlsZEhlaWdodCA9IGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyAobGluZUhlaWdodCAtIGNoaWxkSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgICAgLy8gVE9ETyhwcmVuYXV4KTogQ29ycmVjdGx5IHNldCB0aGUgaGVpZ2h0IG9mIGl0ZW1zIHdpdGggdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoYXV0bykgY3Jvc3NBeGlzIGRpbWVuc2lvbi5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50TGVhZCArPSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gZmFsc2U7XG4gICAgdmFyLypib29sKi8gbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gZmFsc2U7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhIHdpZHRoIG9yIGhlaWdodCwgYW5kIGl0IGhhcyBub3QgYmVlbiBzZXRcbiAgICAvLyBieSB0aGUgY29udGFpbmVyLCB0aGVuIHdlIHNldCBpdCB2aWEgdGhlIGNoaWxkcmVuLlxuICAgIGlmICghaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gV2UncmUgbWlzc2luZyB0aGUgbGFzdCBwYWRkaW5nIGF0IHRoaXMgcG9pbnQgdG8gZ2V0IHRoZSBmaW5hbFxuICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIG1haW5BeGlzLCBsaW5lc01haW5EaW0gKyBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpKSxcbiAgICAgICAgLy8gV2UgY2FuIG5ldmVyIGFzc2lnbiBhIHdpZHRoIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyc1xuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW5cbiAgICAgICk7XG5cbiAgICAgIGlmIChtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgbWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc01haW5UcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgbGluZXNDcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICApO1xuXG4gICAgICBpZiAoY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEY+IFNldCB0cmFpbGluZyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcbiAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MgfHwgbmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEc+IENhbGN1bGF0ZSBkaW1lbnNpb25zIGZvciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudHNcbiAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGZpcnN0QWJzb2x1dGVDaGlsZDtcbiAgICB3aGlsZSAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvclxuICAgICAgLy8gdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcblxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAhaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtsZWFkaW5nW2F4aXNdXSA9XG4gICAgICAgICAgICBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZDtcbiAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQ7XG4gICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZShub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgbm9kZS5zaG91bGRVcGRhdGUgPSB0cnVlO1xuXG4gICAgdmFyIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uIHx8IENTU19ESVJFQ1RJT05fTFRSO1xuICAgIHZhciBza2lwTGF5b3V0ID1cbiAgICAgICFub2RlLmlzRGlydHkgJiZcbiAgICAgIG5vZGUubGFzdExheW91dCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9PT0gbm9kZS5sYXlvdXQuaGVpZ2h0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPT09IG5vZGUubGF5b3V0LndpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPT09IHBhcmVudE1heFdpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID09PSBkaXJlY3Rpb247XG5cbiAgICBpZiAoc2tpcExheW91dCkge1xuICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBub2RlLmxhc3RMYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXlvdXQudG9wID0gbm9kZS5sYXN0TGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGF5b3V0LmxlZnQgPSBub2RlLmxhc3RMYXlvdXQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFub2RlLmxhc3RMYXlvdXQpIHtcbiAgICAgICAgbm9kZS5sYXN0TGF5b3V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgLy8gUmVzZXQgY2hpbGQgbGF5b3V0c1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLmxheW91dC53aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LnRvcCA9IDA7XG4gICAgICAgIGNoaWxkLmxheW91dC5sZWZ0ID0gMDtcbiAgICAgIH0pO1xuXG4gICAgICBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKTtcblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LndpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnRvcCA9IG5vZGUubGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGFzdExheW91dC5sZWZ0ID0gbm9kZS5sYXlvdXQubGVmdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxheW91dE5vZGVJbXBsOiBsYXlvdXROb2RlSW1wbCxcbiAgICBjb21wdXRlTGF5b3V0OiBsYXlvdXROb2RlLFxuICAgIGZpbGxOb2RlczogZmlsbE5vZGVzXG4gIH07XG59KSgpO1xuXG4vLyBUaGlzIG1vZHVsZSBleHBvcnQgaXMgb25seSB1c2VkIGZvciB0aGUgcHVycG9zZXMgb2YgdW5pdCB0ZXN0aW5nIHRoaXMgZmlsZS4gV2hlblxuLy8gdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQgdGhpcyBmaWxlIGlzIGluY2x1ZGVkIHdpdGhpbiBjc3MtbGF5b3V0LmpzIHdoaWNoIGZvcm1zXG4vLyB0aGUgcHVibGljIEFQSS5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlTGF5b3V0O1xufVxuXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgLy8gZGlzYWJsaW5nIEVTTGludCBiZWNhdXNlIHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGFib3ZlIGluY2x1ZGVcbiAgICBjb21wdXRlTGF5b3V0LmZpbGxOb2Rlcyhub2RlKTtcbiAgICBjb21wdXRlTGF5b3V0LmNvbXB1dGVMYXlvdXQobm9kZSk7XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH07XG59KSk7XG4iLCIoZnVuY3Rpb24gKHJvb3QsIGZhY3RvcnkpIHtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIC8vIEFNRFxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJywgJy4vbGliL2FuaW1hdGUnLCAnLi9saWIvU2Nyb2xsZXInXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzLCByZXF1aXJlKCcuL2xpYi9hbmltYXRlJyksIHJlcXVpcmUoJy4vbGliL1Njcm9sbGVyJykpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMsIGFuaW1hdGUsIFNjcm9sbGVyKSB7XG4gICAgZXhwb3J0cy5hbmltYXRlID0gYW5pbWF0ZTtcbiAgICBleHBvcnRzLlNjcm9sbGVyID0gU2Nyb2xsZXI7XG59KSk7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFsnLi9hbmltYXRlJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoJy4vYW5pbWF0ZScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgcm9vdC5TY3JvbGxlciA9IGZhY3Rvcnkocm9vdC5hbmltYXRlKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChhbmltYXRlKSB7XG4gICAgdmFyIE5PT1AgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgIC8qKlxuICAgICAqIEEgcHVyZSBsb2dpYyAnY29tcG9uZW50JyBmb3IgJ3ZpcnR1YWwnIHNjcm9sbGluZy96b29taW5nLlxuICAgICAqL1xuICAgIHZhciBTY3JvbGxlciA9IGZ1bmN0aW9uIChjYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sgPSBjYWxsYmFjaztcblxuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB4LWF4aXMgKi9cbiAgICAgICAgICAgIHNjcm9sbGluZ1g6IHRydWUsXG5cbiAgICAgICAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHktYXhpcyAqL1xuICAgICAgICAgICAgc2Nyb2xsaW5nWTogdHJ1ZSxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSBhbmltYXRpb25zIGZvciBkZWNlbGVyYXRpb24sIHNuYXAgYmFjaywgem9vbWluZyBhbmQgc2Nyb2xsaW5nICovXG4gICAgICAgICAgICBhbmltYXRpbmc6IHRydWUsXG5cbiAgICAgICAgICAgIC8qKiBkdXJhdGlvbiBmb3IgYW5pbWF0aW9ucyB0cmlnZ2VyZWQgYnkgc2Nyb2xsVG8vem9vbVRvICovXG4gICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogMjUwLFxuXG4gICAgICAgICAgICAvKiogRW5hYmxlIGJvdW5jaW5nIChjb250ZW50IGNhbiBiZSBzbG93bHkgbW92ZWQgb3V0c2lkZSBhbmQganVtcHMgYmFjayBhZnRlciByZWxlYXNpbmcpICovXG4gICAgICAgICAgICBib3VuY2luZzogdHJ1ZSxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSBsb2NraW5nIHRvIHRoZSBtYWluIGF4aXMgaWYgdXNlciBtb3ZlcyBvbmx5IHNsaWdodGx5IG9uIG9uZSBvZiB0aGVtIGF0IHN0YXJ0ICovXG4gICAgICAgICAgICBsb2NraW5nOiB0cnVlLFxuXG4gICAgICAgICAgICAvKiogRW5hYmxlIHBhZ2luYXRpb24gbW9kZSAoc3dpdGNoaW5nIGJldHdlZW4gZnVsbCBwYWdlIGNvbnRlbnQgcGFuZXMpICovXG4gICAgICAgICAgICBwYWdpbmc6IGZhbHNlLFxuXG4gICAgICAgICAgICAvKiogRW5hYmxlIHNuYXBwaW5nIG9mIGNvbnRlbnQgdG8gYSBjb25maWd1cmVkIHBpeGVsIGdyaWQgKi9cbiAgICAgICAgICAgIHNuYXBwaW5nOiBmYWxzZSxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSB6b29taW5nIG9mIGNvbnRlbnQgdmlhIEFQSSwgZmluZ2VycyBhbmQgbW91c2Ugd2hlZWwgKi9cbiAgICAgICAgICAgIHpvb21pbmc6IGZhbHNlLFxuXG4gICAgICAgICAgICAvKiogTWluaW11bSB6b29tIGxldmVsICovXG4gICAgICAgICAgICBtaW5ab29tOiAwLjUsXG5cbiAgICAgICAgICAgIC8qKiBNYXhpbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgICAgICAgIG1heFpvb206IDMsXG5cbiAgICAgICAgICAgIC8qKiBNdWx0aXBseSBvciBkZWNyZWFzZSBzY3JvbGxpbmcgc3BlZWQgKiovXG4gICAgICAgICAgICBzcGVlZE11bHRpcGxpZXI6IDEsXG5cbiAgICAgICAgICAgIC8qKiBDYWxsYmFjayB0aGF0IGlzIGZpcmVkIG9uIHRoZSBsYXRlciBvZiB0b3VjaCBlbmQgb3IgZGVjZWxlcmF0aW9uIGVuZCxcbiAgICAgICAgICAgICAgICBwcm92aWRlZCB0aGF0IGFub3RoZXIgc2Nyb2xsaW5nIGFjdGlvbiBoYXMgbm90IGJlZ3VuLiBVc2VkIHRvIGtub3dcbiAgICAgICAgICAgICAgICB3aGVuIHRvIGZhZGUgb3V0IGEgc2Nyb2xsYmFyLiAqL1xuICAgICAgICAgICAgc2Nyb2xsaW5nQ29tcGxldGU6IE5PT1AsXG5cbiAgICAgICAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgICAgICAgIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uIDogMC4wMyxcblxuICAgICAgICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGFjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgICAgICAgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gOiAwLjA4XG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgICAgICB9XG4gICAgfTtcblxuXG4gICAgLy8gRWFzaW5nIEVxdWF0aW9ucyAoYykgMjAwMyBSb2JlcnQgUGVubmVyLCBhbGwgcmlnaHRzIHJlc2VydmVkLlxuICAgIC8vIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICAgICAqKi9cbiAgICB2YXIgZWFzZU91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICAgICAgICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gICAgICoqL1xuICAgIHZhciBlYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwLjUgKiBNYXRoLnBvdyhwb3MsIDMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIDAuNSAqIChNYXRoLnBvdygocG9zIC0gMiksIDMpICsgMik7XG4gICAgfTtcblxuXG4gICAgU2Nyb2xsZXIucHJvdG90eXBlID0ge1xuXG4gICAgICAgIC8qXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgSU5URVJOQUwgRklFTERTIDo6IFNUQVRVU1xuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBvbmx5IGEgc2luZ2xlIGZpbmdlciBpcyB1c2VkIGluIHRvdWNoIGhhbmRsaW5nICovXG4gICAgICAgIF9faXNTaW5nbGVUb3VjaDogZmFsc2UsXG5cbiAgICAgICAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgdG91Y2ggZXZlbnQgc2VxdWVuY2UgaXMgaW4gcHJvZ3Jlc3MgKi9cbiAgICAgICAgX19pc1RyYWNraW5nOiBmYWxzZSxcblxuICAgICAgICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uIHdlbnQgdG8gY29tcGxldGlvbi4gKi9cbiAgICAgICAgX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZTogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHtCb29sZWFufSBXaGV0aGVyIGEgZ2VzdHVyZSB6b29tL3JvdGF0ZSBldmVudCBpcyBpbiBwcm9ncmVzcy4gQWN0aXZhdGVzIHdoZW5cbiAgICAgICAgICogYSBnZXN0dXJlc3RhcnQgZXZlbnQgaGFwcGVucy4gVGhpcyBoYXMgaGlnaGVyIHByaW9yaXR5IHRoYW4gZHJhZ2dpbmcuXG4gICAgICAgICAqL1xuICAgICAgICBfX2lzR2VzdHVyaW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICoge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHVzZXIgaGFzIG1vdmVkIGJ5IHN1Y2ggYSBkaXN0YW5jZSB0aGF0IHdlIGhhdmUgZW5hYmxlZFxuICAgICAgICAgKiBkcmFnZ2luZyBtb2RlLiBIaW50OiBJdCdzIG9ubHkgZW5hYmxlZCBhZnRlciBzb21lIHBpeGVscyBvZiBtb3ZlbWVudCB0b1xuICAgICAgICAgKiBub3QgaW50ZXJydXB0IHdpdGggY2xpY2tzIGV0Yy5cbiAgICAgICAgICovXG4gICAgICAgIF9faXNEcmFnZ2luZzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHtCb29sZWFufSBOb3QgdG91Y2hpbmcgYW5kIGRyYWdnaW5nIGFueW1vcmUsIGFuZCBzbW9vdGhseSBhbmltYXRpbmcgdGhlXG4gICAgICAgICAqIHRvdWNoIHNlcXVlbmNlIHVzaW5nIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIF9faXNEZWNlbGVyYXRpbmc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB7Qm9vbGVhbn0gU21vb3RobHkgYW5pbWF0aW5nIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBjaGFuZ2VcbiAgICAgICAgICovXG4gICAgICAgIF9faXNBbmltYXRpbmc6IGZhbHNlLFxuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIElOVEVSTkFMIEZJRUxEUyA6OiBESU1FTlNJT05TXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICovXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBsZWZ0IGJvdW5kYXJ5ICovXG4gICAgICAgIF9fY2xpZW50TGVmdDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHJpZ2h0IGJvdW5kYXJ5ICovXG4gICAgICAgIF9fY2xpZW50VG9wOiAwLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgd2lkdGggKi9cbiAgICAgICAgX19jbGllbnRXaWR0aDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodCAqL1xuICAgICAgICBfX2NsaWVudEhlaWdodDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIHdpZHRoICovXG4gICAgICAgIF9fY29udGVudFdpZHRoOiAwLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3MgaGVpZ2h0ICovXG4gICAgICAgIF9fY29udGVudEhlaWdodDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoIGZvciBjb250ZW50ICovXG4gICAgICAgIF9fc25hcFdpZHRoOiAxMDAsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHQgZm9yIGNvbnRlbnQgKi9cbiAgICAgICAgX19zbmFwSGVpZ2h0OiAxMDAsXG5cbiAgICAgICAgLyoqIHtOdW1iZXJ9IFpvb20gbGV2ZWwgKi9cbiAgICAgICAgX196b29tTGV2ZWw6IDEsXG5cbiAgICAgICAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgICAgICAgX19zY3JvbGxMZWZ0OiAwLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gICAgICAgIF9fc2Nyb2xsVG9wOiAwLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgICAgICAgX19tYXhTY3JvbGxMZWZ0OiAwLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgICAgICAgX19tYXhTY3JvbGxUb3A6IDAsXG5cbiAgICAgICAgLyoge051bWJlcn0gU2NoZWR1bGVkIGxlZnQgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICAgICAgICBfX3NjaGVkdWxlZExlZnQ6IDAsXG5cbiAgICAgICAgLyoge051bWJlcn0gU2NoZWR1bGVkIHRvcCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gICAgICAgIF9fc2NoZWR1bGVkVG9wOiAwLFxuXG4gICAgICAgIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB6b29tIGxldmVsIChmaW5hbCBzY2FsZSB3aGVuIGFuaW1hdGluZykgKi9cbiAgICAgICAgX19zY2hlZHVsZWRab29tOiAwLFxuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIElOVEVSTkFMIEZJRUxEUyA6OiBMQVNUIFBPU0lUSU9OU1xuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBMZWZ0IHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICAgICAgICBfX2xhc3RUb3VjaExlZnQ6IG51bGwsXG5cbiAgICAgICAgLyoqIHtOdW1iZXJ9IFRvcCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgICAgICAgX19sYXN0VG91Y2hUb3A6IG51bGwsXG5cbiAgICAgICAgLyoqIHtEYXRlfSBUaW1lc3RhbXAgb2YgbGFzdCBtb3ZlIG9mIGZpbmdlci4gVXNlZCB0byBsaW1pdCB0cmFja2luZyByYW5nZSBmb3IgZGVjZWxlcmF0aW9uIHNwZWVkLiAqL1xuICAgICAgICBfX2xhc3RUb3VjaE1vdmU6IG51bGwsXG5cbiAgICAgICAgLyoqIHtBcnJheX0gTGlzdCBvZiBwb3NpdGlvbnMsIHVzZXMgdGhyZWUgaW5kZXhlcyBmb3IgZWFjaCBzdGF0ZTogbGVmdCwgdG9wLCB0aW1lc3RhbXAgKi9cbiAgICAgICAgX19wb3NpdGlvbnM6IG51bGwsXG5cblxuXG4gICAgICAgIC8qXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgSU5URVJOQUwgRklFTERTIDo6IERFQ0VMRVJBVElPTiBTVVBQT1JUXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICovXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgICAgICAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0OiBudWxsLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWluaW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgICAgICAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3A6IG51bGwsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgICAgICAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0OiBudWxsLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWF4aW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgICAgICAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3A6IG51bGwsXG5cbiAgICAgICAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgICAgICAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVg6IG51bGwsXG5cbiAgICAgICAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gICAgICAgIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZOiBudWxsLFxuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIFBVQkxJQyBBUElcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ29uZmlndXJlcyB0aGUgZGltZW5zaW9ucyBvZiB0aGUgY2xpZW50IChvdXRlcikgYW5kIGNvbnRlbnQgKGlubmVyKSBlbGVtZW50cy5cbiAgICAgICAgICogUmVxdWlyZXMgdGhlIGF2YWlsYWJsZSBzcGFjZSBmb3IgdGhlIG91dGVyIGVsZW1lbnQgYW5kIHRoZSBvdXRlciBzaXplIG9mIHRoZSBpbm5lciBlbGVtZW50LlxuICAgICAgICAgKiBBbGwgdmFsdWVzIHdoaWNoIGFyZSBmYWxzeSAobnVsbCBvciB6ZXJvIGV0Yy4pIGFyZSBpZ25vcmVkIGFuZCB0aGUgb2xkIHZhbHVlIGlzIGtlcHQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBjbGllbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IElubmVyIHdpZHRoIG9mIG91dGVyIGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIGNsaWVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IElubmVyIGhlaWdodCBvZiBvdXRlciBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBjb250ZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBPdXRlciB3aWR0aCBvZiBpbm5lciBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBjb250ZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgaGVpZ2h0IG9mIGlubmVyIGVsZW1lbnRcbiAgICAgICAgICovXG4gICAgICAgIHNldERpbWVuc2lvbnMgOiBmdW5jdGlvbiAoY2xpZW50V2lkdGgsIGNsaWVudEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0KSB7XG4gICAgICAgICAgICAvLyBPbmx5IHVwZGF0ZSB2YWx1ZXMgd2hpY2ggYXJlIGRlZmluZWRcbiAgICAgICAgICAgIGlmIChjbGllbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jbGllbnRXaWR0aCA9IGNsaWVudFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY2xpZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2NsaWVudEhlaWdodCA9IGNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNvbnRlbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jb250ZW50V2lkdGggPSBjb250ZW50V2lkdGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb250ZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2NvbnRlbnRIZWlnaHQgPSBjb250ZW50SGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZWZyZXNoIG1heGltdW1zXG4gICAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuXG4gICAgICAgICAgICAvLyBSZWZyZXNoIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICAgICAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBzZXRQb3NpdGlvbiA6IGZ1bmN0aW9uIChsZWZ0LCB0b3ApIHtcbiAgICAgICAgICAgIHRoaXMuX19jbGllbnRMZWZ0ID0gbGVmdCB8fCAwO1xuICAgICAgICAgICAgdGhpcy5fX2NsaWVudFRvcCA9IHRvcCB8fCAwO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbmZpZ3VyZXMgdGhlIHNuYXBwaW5nICh3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSlcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHdpZHRoIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aFxuICAgICAgICAgKiBAcGFyYW0gaGVpZ2h0IHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHRcbiAgICAgICAgICovXG4gICAgICAgIHNldFNuYXBTaXplIDogZnVuY3Rpb24gKHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgICAgIHRoaXMuX19zbmFwV2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAgICAgICAqL1xuICAgICAgICBnZXRWYWx1ZXMgOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogdGhpcy5fX3Njcm9sbFRvcCxcbiAgICAgICAgICAgICAgICByaWdodDogdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fY2xpZW50V2lkdGgvdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgICAgICAgICAgICBib3R0b206IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fY2xpZW50SGVpZ2h0L3RoaXMuX196b29tTGV2ZWwsXG4gICAgICAgICAgICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICAgICAgICovXG4gICAgICAgIGdldFBvaW50IDogZnVuY3Rpb24gKHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdCA6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgICAgICAgICAgICB0b3AgOiBzY3JvbGxUb3AgLyB2YWx1ZXMuem9vbVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICpcbiAgICAgICAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgICAgICAgKi9cbiAgICAgICAgZ2V0U2Nyb2xsTWF4IDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAgICAgICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAgICAgICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgICAgICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAgICAgICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgem9vbVRvIDogZnVuY3Rpb24gKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgY2FsbGJhY2sgaWYgZXhpc3RzXG4gICAgICAgICAgICBpZihjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIGZpeGVkIHBvaW50IHRvIGNlbnRlciBvZiB2aWV3cG9ydCBpZiBub3QgZGVmaW5lZFxuICAgICAgICAgICAgaWYgKGZpeGVkTGVmdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZml4ZWRMZWZ0ID0gdGhpcy5fX2NsaWVudFdpZHRoIC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBmaXhlZFRvcCA9IHRoaXMuX19jbGllbnRIZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaW1pdCBsZXZlbCBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG5cbiAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3Agc2Nyb2xsIHBvc2l0aW9ucyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbC5cbiAgICAgICAgICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgICAgICAgICAgLy8gZml4ZWQsIHdlIGhhdmUgY2VudHJhbCBkaWxhdGlvbiBhYm91dCB0aGUgb3JpZ2luLlxuICAgICAgICAgICAgLy8gKiBGaXhlZCBwb2ludCwgJEYkLCByZW1haW5zIHN0YXRpb25hcnkgaW4gY29udGVudCBzcGFjZSBhbmQgaW4gdGhlXG4gICAgICAgICAgICAvLyB2aWV3cG9ydC5cbiAgICAgICAgICAgIC8vICogSW5pdGlhbCBzY3JvbGwgcG9zaXRpb24sICRTX2kkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgICAgICAgICAgLy8gKiBGaW5hbCBzY3JvbGwgcG9zaXRpb24sICRTX2YkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgICAgICAgICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAgICAgICAgIC8vICogRmluYWwgc2NhbGluZyBmYWN0b3IsICRrX2YkLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgICAgICAgICAgLy8gKiAkKFNfaSAtIEYpIGtfaSA9IChTX2YgLSBGKSBrX2YkLlxuICAgICAgICAgICAgLy8gKiAkKFNfaSAtIEYpIGtfaS9rX2YgPSAoU19mIC0gRikkLlxuICAgICAgICAgICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBGaXhlZCBwb2ludCBsb2NhdGlvbiwgJFxcdmVjdG9ye2Z9ID0gKEYgLSBTX2kpIGtfaSQuXG4gICAgICAgICAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAgICAgICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSArIChTX2kgLSBTX2kgLSBcXHZlY3RvcntmfS9rX2kpIGtfaS9rX2YkLlxuICAgICAgICAgICAgLy8gKiAkU19mID0gU19pICsgXFx2ZWN0b3J7Zn0va19pIC0gXFx2ZWN0b3J7Zn0va19mJC5cbiAgICAgICAgICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAgICAgICAgIC8vICogJFNfZiBrX2YgPSAoa19mL2tfaSkoU19pIGtfaSkgKyAoa19mL2tfaSAtIDEpIFxcdmVjdG9ye2Z9JC5cbiAgICAgICAgICAgIHZhciBrID0gbGV2ZWwgLyBvbGRMZXZlbDtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gayoodGhpcy5fX3Njcm9sbExlZnQgKyBmaXhlZExlZnQpIC0gZml4ZWRMZWZ0O1xuICAgICAgICAgICAgdmFyIHRvcCA9IGsqKHRoaXMuX19zY3JvbGxUb3AgKyBmaXhlZFRvcCkgLSBmaXhlZFRvcDtcblxuICAgICAgICAgICAgLy8gTGltaXQgeC1heGlzXG4gICAgICAgICAgICBpZiAobGVmdCA+IHRoaXMuX19tYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsZWZ0IDwgMCkge1xuICAgICAgICAgICAgICAgIGxlZnQgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaW1pdCB5LWF4aXNcbiAgICAgICAgICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgICAgICAgICAgIHRvcCA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCBsZXZlbCwgaXNBbmltYXRlZCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogWm9vbXMgdGhlIGNvbnRlbnQgYnkgdGhlIGdpdmVuIGZhY3Rvci5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGZhY3RvciB7TnVtYmVyfSBab29tIGJ5IGdpdmVuIGZhY3RvclxuICAgICAgICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICAgICAgICogQHBhcmFtIG9yaWdpbkxlZnQge051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gbGVmdCBjb29yZGluYXRlXG4gICAgICAgICAqIEBwYXJhbSBvcmlnaW5Ub3Age051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gdG9wIGNvb3JkaW5hdGVcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbiA/IG51bGx9IEEgY2FsbGJhY2sgdGhhdCBnZXRzIGZpcmVkIHdoZW4gdGhlIHpvb20gaXMgY29tcGxldGUuXG4gICAgICAgICAqL1xuICAgICAgICB6b29tQnkgOiBmdW5jdGlvbiAoZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLnpvb21Ubyh0aGlzLl9fem9vbUxldmVsICogZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTY3JvbGxzIHRvIHRoZSBnaXZlbiBwb3NpdGlvbi4gUmVzcGVjdCBsaW1pdGF0aW9ucyBhbmQgc25hcHBpbmcgYXV0b21hdGljYWxseS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGxlZnQge051bWJlcj9udWxsfSBIb3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgICAgICAgKiBAcGFyYW0gdG9wIHtOdW1iZXI/bnVsbH0gVmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAgICAgICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRoZSBzY3JvbGxpbmcgc2hvdWxkIGhhcHBlbiB1c2luZyBhbiBhbmltYXRpb25cbiAgICAgICAgICogQHBhcmFtIHpvb20ge051bWJlcn0gWzEuMF0gWm9vbSBsZXZlbCB0byBnbyB0b1xuICAgICAgICAgKi9cbiAgICAgICAgc2Nyb2xsVG8gOiBmdW5jdGlvbiAobGVmdCwgdG9wLCBpc0FuaW1hdGVkLCB6b29tKSB7XG4gICAgICAgICAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgICAgICAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkICYmIHpvb20gIT09IHRoaXMuX196b29tTGV2ZWwpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxlZnQgKj0gem9vbTtcbiAgICAgICAgICAgICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgICAgICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoem9vbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEtlZXAgem9vbSB3aGVuIG5vdCBkZWZpbmVkXG4gICAgICAgICAgICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnNjcm9sbGluZ1gpIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fY2xpZW50V2lkdGgpICogdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdZKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fc25hcEhlaWdodCkgKiB0aGlzLl9fc25hcEhlaWdodDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgICAgICAgICAgbGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxMZWZ0LCBsZWZ0KSwgMCk7XG4gICAgICAgICAgICB0b3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsVG9wLCB0b3ApLCAwKTtcblxuICAgICAgICAgICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgICAgICAgICAgLy8gdGhhdCByZW5kZXJlZCBwb3NpdGlvbiBpcyByZWFsbHkgaW4tc3luYyB3aXRoIGludGVybmFsIGRhdGFcbiAgICAgICAgICAgIGlmIChsZWZ0ID09PSB0aGlzLl9fc2Nyb2xsTGVmdCAmJiB0b3AgPT09IHRoaXMuX19zY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICBpc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgICAgICAgICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICAgICAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICAgICAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICAgICAgICovXG4gICAgICAgIHNjcm9sbEJ5IDogZnVuY3Rpb24gKGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0TGVmdCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRMZWZ0IDogdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICAgICAgICB2YXIgc3RhcnRUb3AgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkVG9wIDogdGhpcy5fX3Njcm9sbFRvcDtcblxuICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgRVZFTlQgQ0FMTEJBQ0tTXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vdXNlIHdoZWVsIGhhbmRsZXIgZm9yIHpvb21pbmcgc3VwcG9ydFxuICAgICAgICAgKi9cbiAgICAgICAgZG9Nb3VzZVpvb20gOiBmdW5jdGlvbiAod2hlZWxEZWx0YSwgdGltZVN0YW1wLCBwYWdlWCwgcGFnZVkpIHtcbiAgICAgICAgICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGNoYW5nZSwgZmFsc2UsIHBhZ2VYIC0gdGhpcy5fX2NsaWVudExlZnQsIHBhZ2VZIC0gdGhpcy5fX2NsaWVudFRvcCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICAgICAgICovXG4gICAgICAgIGRvVG91Y2hTdGFydCA6IGZ1bmN0aW9uICh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAgICAgICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICAgICAgICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IGludGVycnVwdGVkQW5pbWF0aW9uIGZsYWdcbiAgICAgICAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RvcCBhbmltYXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzQW5pbWF0aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVc2UgY2VudGVyIHBvaW50IHdoZW4gZGVhbGluZyB3aXRoIHR3byBmaW5nZXJzXG4gICAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuICAgICAgICAgICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICAgICAgICAgIGlmIChpc1NpbmdsZVRvdWNoKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICAgICAgICAgIHRoaXMuX19pbml0aWFsVG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgICAgICAgICAgdGhpcy5fX3pvb21MZXZlbFN0YXJ0ID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgICAgICAgLy8gU3RvcmUgaW5pdGlhbCB0b3VjaCBwb3NpdGlvbnNcbiAgICAgICAgICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICAgICAgICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGluaXRpYWwgbW92ZSB0aW1lIHN0YW1wXG4gICAgICAgICAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgICAgICAgICAgLy8gUmVzZXQgaW5pdGlhbCBzY2FsZVxuICAgICAgICAgICAgdGhpcy5fX2xhc3RTY2FsZSA9IDE7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICAgICAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1g7XG4gICAgICAgICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZO1xuXG4gICAgICAgICAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgICAgICAgICB0aGlzLl9faXNUcmFja2luZyA9IHRydWU7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IGRlY2VsZXJhdGlvbiBjb21wbGV0ZSBmbGFnXG4gICAgICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgLy8gRHJhZ2dpbmcgc3RhcnRzIGRpcmVjdGx5IHdpdGggdHdvIGZpbmdlcnMsIG90aGVyd2lzZSBsYXp5IHdpdGggYW4gb2Zmc2V0XG4gICAgICAgICAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICFpc1NpbmdsZVRvdWNoO1xuXG4gICAgICAgICAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICAgICAgICAgIHRoaXMuX19pc1NpbmdsZVRvdWNoID0gaXNTaW5nbGVUb3VjaDtcblxuICAgICAgICAgICAgLy8gQ2xlYXJpbmcgZGF0YSBzdHJ1Y3R1cmVcbiAgICAgICAgICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUb3VjaCBtb3ZlIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAgICAgICAqIEBwYXJhbSB7TnVtYmVyfSBbMS4wXSBzY2FsZSAtIC4uLi5cbiAgICAgICAgICovXG4gICAgICAgIGRvVG91Y2hNb3ZlIDogZnVuY3Rpb24gKHRvdWNoZXMsIHRpbWVTdGFtcCwgc2NhbGUpIHtcbiAgICAgICAgICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICAgICAgICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgICAgICAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChldmVudCBtaWdodCBiZSBvdXRzaWRlIG9mIGVsZW1lbnQpXG4gICAgICAgICAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgICAgICAgICAvLyBDb21wdXRlIG1vdmUgYmFzZWQgYXJvdW5kIG9mIGNlbnRlciBvZiBmaW5nZXJzXG4gICAgICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgICAgICAgICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcblxuICAgICAgICAgICAgLy8gQXJlIHdlIGFscmVhZHkgaXMgZHJhZ2dpbmcgbW9kZT9cbiAgICAgICAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgIC8vIENvbXB1dGUgbW92ZSBkaXN0YW5jZVxuICAgICAgICAgICAgICAgIHZhciBtb3ZlWCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fbGFzdFRvdWNoTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAgICAgICAgICAgLy8gUmVhZCBwcmV2aW91cyBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmdcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIHZhciBsZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgICAgICAgICAgICAvLyBXb3JrIHdpdGggc2NhbGluZ1xuICAgICAgICAgICAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgICAgICAgICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICAgICAgICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIGV2ZW50IHBvc2l0aW9uIHRvIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnRSZWwgPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2NsaWVudExlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdCA9ICgoY3VycmVudFRvdWNoTGVmdFJlbCArIHNjcm9sbExlZnQpICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hMZWZ0UmVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBtYXggc2Nyb2xsIHZhbHVlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgKz0gKG1vdmVYIC8gMiAgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDb21wdXRlIG5ldyB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2VuYWJsZVNjcm9sbFkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wIC09IG1vdmVZICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCB8fCBzY3JvbGxUb3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gS2VlcCBsaXN0IGZyb20gZ3Jvd2luZyBpbmZpbml0ZWx5IChob2xkaW5nIG1pbiAxMCwgbWF4IDIwIG1lYXN1cmUgcG9pbnRzKVxuICAgICAgICAgICAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gNjApIHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25zLnNwbGljZSgwLCAzMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gVHJhY2sgc2Nyb2xsIG1vdmVtZW50IGZvciBkZWNsZXJhdGlvblxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgICAgICAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCBsZXZlbCk7XG5cbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UgZmlndXJlIG91dCB3aGV0aGVyIHdlIGFyZSBzd2l0Y2hpbmcgaW50byBkcmFnZ2luZyBtb2RlIG5vdy5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbCA9IHRoaXMub3B0aW9ucy5sb2NraW5nID8gMyA6IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlWCA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCk7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlWSA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19pbml0aWFsVG91Y2hUb3ApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgICAgICAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1kgJiYgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcblxuICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgICAgICAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgICAgICAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuICAgICAgICAgICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgICAgICAgICB0aGlzLl9fbGFzdFNjYWxlID0gc2NhbGU7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAgICAgICAqL1xuICAgICAgICBkb1RvdWNoRW5kIDogZnVuY3Rpb24gKHRpbWVTdGFtcCkge1xuICAgICAgICAgICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgICAgICAgICAgLy8gVGhpcyBpcyByZXF1aXJlZCBhcyB0aGlzIGxpc3RlbmVyICgndG91Y2htb3ZlJykgc2l0cyBvbiB0aGUgZG9jdW1lbnQgYW5kIG5vdCBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgICAgICAgICBpZiAoIXRoaXMuX19pc1RyYWNraW5nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICAgICAgICAgIHRoaXMuX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEJlIHN1cmUgdG8gcmVzZXQgdGhlIGRyYWdnaW5nIGZsYWcgbm93LiBIZXJlIHdlIGFsc28gZGV0ZWN0IHdoZXRoZXJcbiAgICAgICAgICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICAgICAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19pc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5hbmltYXRpbmcgJiYgKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA8PSAxMDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlbiBmaWd1cmUgb3V0IHdoYXQgdGhlIHNjcm9sbCBwb3NpdGlvbiB3YXMgYWJvdXQgMTAwbXMgYWdvXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3NpdGlvbnMgPSB0aGlzLl9fcG9zaXRpb25zO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZW5kUG9zID0gcG9zaXRpb25zLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGFydFBvcyA9IGVuZFBvcztcblxuICAgICAgICAgICAgICAgICAgICAvLyBNb3ZlIHBvaW50ZXIgdG8gcG9zaXRpb24gbWVhc3VyZWQgMTAwbXMgYWdvXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSBlbmRQb3M7IGkgPiAwICYmIHBvc2l0aW9uc1tpXSA+ICh0aGlzLl9fbGFzdFRvdWNoTW92ZSAtIDEwMCk7IGkgLT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAgICAgICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgbW92ZW1lbnQgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZU9mZnNldCA9IHBvc2l0aW9uc1tlbmRQb3NdIC0gcG9zaXRpb25zW3N0YXJ0UG9zXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1vdmVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBCYXNlZCBvbiA1MG1zIGNvbXB1dGUgdGhlIG1vdmVtZW50IHRvIGFwcGx5IGZvciBlYWNoIHJlbmRlciBzdGVwXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG1vdmVkVG9wIC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBzdGFydCB0aGUgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgd2UgaGF2ZSBlbm91Z2ggdmVsb2NpdHkgdG8gc3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPiBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpID4gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgICAgICAgICAvLyBzdGlsbCBtZWFucyB0aGF0IHdlIHdhbnQgc25hcCBiYWNrIHRvIHRoZSBib3VuZHMgd2hpY2ggaXMgZG9uZSBoZXJlLlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBwbGFjZWQgb3V0c2lkZSB0aGUgY29uZGl0aW9uIGFib3ZlIHRvIGltcHJvdmUgZWRnZSBjYXNlIHN0YWJpbGl0eVxuICAgICAgICAgICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgICAgICAgICAgLy8gaGF2ZSBtb2RpZmllZCB0aGUgc2Nyb2xsIHBvc2l0aW9ucyBvciBldmVuIHNob3dlZCB0aGUgc2Nyb2xsYmFycyB0aG91Z2guXG4gICAgICAgICAgICBpZiAoIXRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gfHwgdGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGdWxseSBjbGVhbnVwIGxpc3RcbiAgICAgICAgICAgIHRoaXMuX19wb3NpdGlvbnMubGVuZ3RoID0gMDtcbiAgICAgICAgfSxcblxuXG5cbiAgICAgICAgLypcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICBQUklWQVRFIEFQSVxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgICAgICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgX19wdWJsaXNoIDogZnVuY3Rpb24gKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgICAgICAgICAgLy8gUmVtZW1iZXIgd2hldGhlciB3ZSBoYWQgYW4gYW5pbWF0aW9uLCB0aGVuIHdlIHRyeSB0byBjb250aW51ZVxuICAgICAgICAgICAgLy8gYmFzZWQgb24gdGhlIGN1cnJlbnQgXCJkcml2ZVwiIG9mIHRoZSBhbmltYXRpb24uXG4gICAgICAgICAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgICAgICAgICAgaWYgKHdhc0FuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaXNBbmltYXRlZCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRvcDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgICAgICAgICAgICB2YXIgb2xkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBvbGRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgICAgICAgICAgIHZhciBkaWZmTGVmdCA9IGxlZnQgLSBvbGRMZWZ0O1xuICAgICAgICAgICAgICAgIHZhciBkaWZmVG9wID0gdG9wIC0gb2xkVG9wO1xuICAgICAgICAgICAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICAgICAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gb2xkVG9wICsgKGRpZmZUb3AgKiBwZXJjZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX196b29tTGV2ZWwgPSBvbGRab29tICsgKGRpZmZab29tICogcGVyY2VudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9faXNBbmltYXRpbmcgPT09IGlkO1xuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSB8fCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIC8vIFdoZW4gY29udGludWluZyBiYXNlZCBvbiBwcmV2aW91cyBhbmltYXRpb24gd2UgY2hvb3NlIGFuIGVhc2Utb3V0IGFuaW1hdGlvbiBpbnN0ZWFkIG9mIGVhc2UtaW4tb3V0XG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgPSB0b3A7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB0aGlzLl9fem9vbUxldmVsID0gem9vbTtcblxuICAgICAgICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2NhbGxiYWNrKGxlZnQsIHRvcCwgem9vbSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fem9vbUNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgICAgICAgKi9cbiAgICAgICAgX19jb21wdXRlU2Nyb2xsTWF4IDogZnVuY3Rpb24gKHpvb21MZXZlbCkge1xuICAgICAgICAgICAgaWYgKHpvb21MZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5fX21heFNjcm9sbExlZnQgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudFdpZHRoKnpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRXaWR0aCwgMCk7XG4gICAgICAgICAgICB0aGlzLl9fbWF4U2Nyb2xsVG9wID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRIZWlnaHQqem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudEhlaWdodCwgMCk7XG4gICAgICAgIH0sXG5cblxuXG4gICAgICAgIC8qXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgICAgICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICAgICAgICovXG4gICAgICAgIF9fc3RhcnREZWNlbGVyYXRpb24gOiBmdW5jdGlvbiAodGltZVN0YW1wKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX19tYXhTY3JvbGxUb3ApLCAwKTtcbiAgICAgICAgICAgICAgICB2YXIgY2xpZW50V2lkdGggPSB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgICAgICAgICAgICAvLyBXZSBsaW1pdCBkZWNlbGVyYXRpb24gbm90IHRvIHRoZSBtaW4vbWF4IHZhbHVlcyBvZiB0aGUgYWxsb3dlZCByYW5nZSwgYnV0IHRvIHRoZSBzaXplIG9mIHRoZSB2aXNpYmxlIGNsaWVudCBhcmVhLlxuICAgICAgICAgICAgICAgIC8vIEVhY2ggcGFnZSBzaG91bGQgaGF2ZSBleGFjdGx5IHRoZSBzaXplIG9mIHRoZSBjbGllbnQgYXJlYS5cbiAgICAgICAgICAgICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmZsb29yKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmNlaWwoc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdyYXAgY2xhc3MgbWV0aG9kXG4gICAgICAgICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBrZWVwIHRoZSBkZWNlbGVyYXRpb24gcnVubmluZ1xuICAgICAgICAgICAgdmFyIG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nID0gdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDAuMTtcblxuICAgICAgICAgICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAgICAgICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IHNsb3cgZW5vdWdoIHRvIG5vdCBiZWluZyB1c2VyIHBlcmNlaXZhYmxlIGFueW1vcmUsIHdlIHN0b3AgdGhlIHdob2xlIHByb2Nlc3MgaGVyZS5cbiAgICAgICAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNob3VsZENvbnRpbnVlID0gTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmc7XG4gICAgICAgICAgICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gc2hvdWxkQ29udGludWU7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQW5pbWF0ZSB0byBncmlkIHdoZW4gc25hcHBpbmcgaXMgYWN0aXZlLCBvdGhlcndpc2UganVzdCBmaXggb3V0LW9mLWJvdW5kYXJ5IHBvc2l0aW9uc1xuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMub3B0aW9ucy5zbmFwcGluZyk7XG4gICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICAgICAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgICAgICAgKi9cbiAgICAgICAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbiA6IGZ1bmN0aW9uIChyZW5kZXIpIHtcblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIENPTVBVVEUgTkVYVCBTQ1JPTEwgUE9TSVRJT05cbiAgICAgICAgICAgIC8vXG5cbiAgICAgICAgICAgIC8vIEFkZCBkZWNlbGVyYXRpb24gdG8gc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WDtcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gSEFSRCBMSU1JVCBTQ1JPTEwgUE9TSVRJT04gRk9SIE5PTiBCT1VOQ0lORyBNT0RFXG4gICAgICAgICAgICAvL1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsTGVmdEZpeGVkICE9PSBzY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSBzY3JvbGxMZWZ0Rml4ZWQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3BGaXhlZCAhPT0gc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IHNjcm9sbFRvcEZpeGVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFVQREFURSBTQ1JPTEwgUE9TSVRJT05cbiAgICAgICAgICAgIC8vXG5cbiAgICAgICAgICAgIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gU0xPVyBET1dOXG4gICAgICAgICAgICAvL1xuXG4gICAgICAgICAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgICAgICAgICAgIC8vIHRvIHNsb3cgZG93biB0aGUgcHJvY2Vzcy4gVGhpcyBzaG91bGQgZW11bGF0ZSBuYXR1cmFsIGJlaGF2aW9yIHdoZXJlXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0cyBzbG93IGRvd24gd2hlbiB0aGUgaW5pdGlhdG9yIG9mIHRoZSBtb3ZlbWVudCBpcyByZW1vdmVkXG4gICAgICAgICAgICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gQk9VTkNJTkcgU1VQUE9SVFxuICAgICAgICAgICAgLy9cblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxPdXRzaWRlWCA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbE91dHNpZGVZID0gMDtcblxuICAgICAgICAgICAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICAgICAgICAgICAgdmFyIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICAgICAgICAgIHZhciBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxMZWZ0IDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbFRvcCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gU2xvdyBkb3duIHVudGlsIHNsb3cgZW5vdWdoLCB0aGVuIGZsaXAgYmFjayB0byBzbmFwIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCArPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZICs9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gU2Nyb2xsZXI7XG59KSk7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuLyoqXG4gKiBHZW5lcmljIGFuaW1hdGlvbiBjbGFzcyB3aXRoIHN1cHBvcnQgZm9yIGRyb3BwZWQgZnJhbWVzIGJvdGggb3B0aW9uYWwgZWFzaW5nIGFuZCBkdXJhdGlvbi5cbiAqXG4gKiBPcHRpb25hbCBkdXJhdGlvbiBpcyB1c2VmdWwgd2hlbiB0aGUgbGlmZXRpbWUgaXMgZGVmaW5lZCBieSBhbm90aGVyIGNvbmRpdGlvbiB0aGFuIHRpbWVcbiAqIGUuZy4gc3BlZWQgb2YgYW4gYW5pbWF0aW5nIG9iamVjdCwgZXRjLlxuICpcbiAqIERyb3BwZWQgZnJhbWUgbG9naWMgYWxsb3dzIHRvIGtlZXAgdXNpbmcgdGhlIHNhbWUgdXBkYXRlciBsb2dpYyBpbmRlcGVuZGVudCBmcm9tIHRoZSBhY3R1YWxcbiAqIHJlbmRlcmluZy4gVGhpcyBlYXNlcyBhIGxvdCBvZiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBwcmV0dHkgY29tcGxleCB0byBicmVhayBkb3duIGEgc3RhdGVcbiAqIGJhc2VkIG9uIHRoZSBwdXJlIHRpbWUgZGlmZmVyZW5jZS5cbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSgocm9vdC5hbmltYXRlID0ge30pKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgdmFyIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvd1xuICAgIHZhciB0aW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gICAgfTtcbiAgICB2YXIgZGVzaXJlZEZyYW1lcyA9IDYwO1xuICAgIHZhciBtaWxsaXNlY29uZHNQZXJTZWNvbmQgPSAxMDAwO1xuICAgIHZhciBydW5uaW5nID0ge307XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuXG4gICAgLyoqXG4gICAgICogQSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgd3JhcHBlciAvIHBvbHlmaWxsLlxuICAgICAqXG4gICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gVGhlIGNhbGxiYWNrIHRvIGJlIGludm9rZWQgYmVmb3JlIHRoZSBuZXh0IHJlcGFpbnQuXG4gICAgICogQHBhcmFtIHJvb3Qge0hUTUxFbGVtZW50fSBUaGUgcm9vdCBlbGVtZW50IGZvciB0aGUgcmVwYWludFxuICAgICAqL1xuICAgIGV4cG9ydHMucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIHJlcXVlc3QgYW5pbWF0aW9uIEZyYW1lIHN1cHBvcnRcbiAgICAgICAgdmFyIHJlcXVlc3RGcmFtZSA9IGdsb2JhbC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgZ2xvYmFsLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBnbG9iYWwubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGdsb2JhbC5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICB2YXIgaXNOYXRpdmUgPSAhIXJlcXVlc3RGcmFtZTtcblxuICAgICAgICBpZiAocmVxdWVzdEZyYW1lICYmICEvcmVxdWVzdEFuaW1hdGlvbkZyYW1lXFwoXFwpXFxzKlxce1xccypcXFtuYXRpdmUgY29kZVxcXVxccypcXH0vaS50ZXN0KHJlcXVlc3RGcmFtZS50b1N0cmluZygpKSkge1xuICAgICAgICAgICAgaXNOYXRpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc05hdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaywgcm9vdCkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3RGcmFtZShjYWxsYmFjaywgcm9vdCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIFRBUkdFVF9GUFMgPSA2MDtcbiAgICAgICAgdmFyIHJlcXVlc3RzID0ge307XG4gICAgICAgIHZhciByZXF1ZXN0Q291bnQgPSAwO1xuICAgICAgICB2YXIgcmFmSGFuZGxlID0gMTtcbiAgICAgICAgdmFyIGludGVydmFsSGFuZGxlID0gbnVsbDtcbiAgICAgICAgdmFyIGxhc3RBY3RpdmUgPSArbmV3IERhdGUoKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGNhbGxiYWNrLCByb290KSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tIYW5kbGUgPSByYWZIYW5kbGUrKztcblxuICAgICAgICAgICAgLy8gU3RvcmUgY2FsbGJhY2tcbiAgICAgICAgICAgIHJlcXVlc3RzW2NhbGxiYWNrSGFuZGxlXSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgcmVxdWVzdENvdW50Kys7XG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSB0aW1lb3V0IGF0IGZpcnN0IHJlcXVlc3RcbiAgICAgICAgICAgIGlmIChpbnRlcnZhbEhhbmRsZSA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgaW50ZXJ2YWxIYW5kbGUgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSArbmV3IERhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRSZXF1ZXN0cyA9IHJlcXVlc3RzO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IGRhdGEgc3RydWN0dXJlIGJlZm9yZSBleGVjdXRpbmcgY2FsbGJhY2tzXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RzID0ge307XG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RDb3VudCA9IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gY3VycmVudFJlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFJlcXVlc3RzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50UmVxdWVzdHNba2V5XSh0aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0QWN0aXZlID0gdGltZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIERpc2FibGUgdGhlIHRpbWVvdXQgd2hlbiBub3RoaW5nIGhhcHBlbnMgZm9yIGEgY2VydGFpblxuICAgICAgICAgICAgICAgICAgICAvLyBwZXJpb2Qgb2YgdGltZVxuICAgICAgICAgICAgICAgICAgICBpZiAodGltZSAtIGxhc3RBY3RpdmUgPiAyNTAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSGFuZGxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVydmFsSGFuZGxlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSwgMTAwMCAvIFRBUkdFVF9GUFMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2tIYW5kbGU7XG4gICAgICAgIH07XG5cbiAgICB9KSgpO1xuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGdpdmVuIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiB3YXMgc3RvcHBlZCAoYWthLCB3YXMgcnVubmluZyBiZWZvcmUpXG4gICAgICovXG4gICAgZXhwb3J0cy5zdG9wID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBjbGVhcmVkID0gKHJ1bm5pbmdbaWRdICE9PSBudWxsKTtcbiAgICAgICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGVhcmVkO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdpdmVuIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgKi9cbiAgICBleHBvcnRzLmlzUnVubmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gcnVubmluZ1tpZF0gIT09IG51bGw7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGVwQ2FsbGJhY2sge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkIG9uIGV2ZXJ5IHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQsIG5vdywgdmlydHVhbCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSB2ZXJpZnlDYWxsYmFjayB7RnVuY3Rpb259IEV4ZWN1dGVkIGJlZm9yZSBldmVyeSBhbmltYXRpb24gc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZENhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oZHJvcHBlZEZyYW1lcywgZmluaXNoZWRBbmltYXRpb24sIG9wdGlvbmFsIHdhc0ZpbmlzaGVkKSB7fWBcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24ge0ludGVnZXJ9IE1pbGxpc2Vjb25kcyB0byBydW4gdGhlIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmdNZXRob2Qge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGVhc2luZyBmdW5jdGlvblxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50KSB7IHJldHVybiBtb2RpZmllZFZhbHVlOyB9YFxuICAgICAqIEBwYXJhbSByb290IHtFbGVtZW50fSBSZW5kZXIgcm9vdC4gVXNlZCBmb3IgaW50ZXJuYWwgdXNhZ2Ugb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IElkZW50aWZpZXIgb2YgYW5pbWF0aW9uLiBDYW4gYmUgdXNlZCB0byBzdG9wIGl0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RhcnQgPSBmdW5jdGlvbiAoc3RlcENhbGxiYWNrLCB2ZXJpZnlDYWxsYmFjaywgY29tcGxldGVkQ2FsbGJhY2ssIGR1cmF0aW9uLCBlYXNpbmdNZXRob2QsIHJvb3QpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGltZSgpO1xuICAgICAgICB2YXIgbGFzdEZyYW1lID0gc3RhcnQ7XG4gICAgICAgIHZhciBwZXJjZW50ID0gMDtcbiAgICAgICAgdmFyIGRyb3BDb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGlkID0gY291bnRlcisrO1xuXG4gICAgICAgIC8vIENvbXBhY3RpbmcgcnVubmluZyBkYiBhdXRvbWF0aWNhbGx5IGV2ZXJ5IGZldyBuZXcgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaWQgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIG5ld1J1bm5pbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHVzZWRJZCBpbiBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3UnVubmluZ1t1c2VkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBuZXdSdW5uaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RlcCBtZXRob2Qgd2hpY2ggaXMgY2FsbGVkIGV2ZXJ5IGZldyBtaWxsaXNlY29uZHNcbiAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAodmlydHVhbCkge1xuXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgdmlydHVhbCB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IHZpcnR1YWwgIT09IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWVcbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lKCk7XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBpcyBleGVjdXRlZCBiZWZvcmUgbmV4dCBhbmltYXRpb24gc3RlcFxuICAgICAgICAgICAgaWYgKCFydW5uaW5nW2lkXSB8fCAodmVyaWZ5Q2FsbGJhY2sgJiYgIXZlcmlmeUNhbGxiYWNrKGlkKSkpIHtcblxuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBjdXJyZW50IHJlbmRlcmluZyB0byBhcHBseSBsZXQncyB1cGRhdGUgb21pdHRlZCBzdGVwcyBpbiBtZW1vcnkuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byBicmluZyBpbnRlcm5hbCBzdGF0ZSB2YXJpYWJsZXMgdXAtdG8tZGF0ZSB3aXRoIHByb2dyZXNzIGluIHRpbWUuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHJvcHBlZEZyYW1lcyA9IE1hdGgucm91bmQoKG5vdyAtIGxhc3RGcmFtZSkgLyAobWlsbGlzZWNvbmRzUGVyU2Vjb25kIC8gZGVzaXJlZEZyYW1lcykpIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGgubWluKGRyb3BwZWRGcmFtZXMsIDQpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBwZXJjZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKG5vdyAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgc3RlcCBjYWxsYmFjaywgdGhlbi4uLlxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWFzaW5nTWV0aG9kID8gZWFzaW5nTWV0aG9kKHBlcmNlbnQpIDogcGVyY2VudDtcbiAgICAgICAgICAgIGlmICgoc3RlcENhbGxiYWNrKHZhbHVlLCBub3csIHJlbmRlcikgPT09IGZhbHNlIHx8IHBlcmNlbnQgPT09IDEpICYmIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIHBlcmNlbnQgPT09IDEgfHwgZHVyYXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgIGxhc3RGcmFtZSA9IG5vdztcbiAgICAgICAgICAgICAgICBleHBvcnRzLnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXJrIGFzIHJ1bm5pbmdcbiAgICAgICAgcnVubmluZ1tpZF0gPSB0cnVlO1xuXG4gICAgICAgIC8vIEluaXQgZmlyc3Qgc3RlcFxuICAgICAgICBleHBvcnRzLnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcblxuICAgICAgICAvLyBSZXR1cm4gdW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn0pKTtcbiIsImZ1bmN0aW9uIEUgKCkge1xuICAvLyBLZWVwIHRoaXMgZW1wdHkgc28gaXQncyBlYXNpZXIgdG8gaW5oZXJpdCBmcm9tXG4gIC8vICh2aWEgaHR0cHM6Ly9naXRodWIuY29tL2xpcHNtYWNrIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9pc3N1ZXMvMylcbn1cblxuRS5wcm90b3R5cGUgPSB7XG4gIG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG5cbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XG4gICAgICBmbjogY2FsbGJhY2ssXG4gICAgICBjdHg6IGN0eFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb25jZTogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZnVuY3Rpb24gbGlzdGVuZXIgKCkge1xuICAgICAgc2VsZi5vZmYobmFtZSwgbGlzdGVuZXIpO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcbiAgICByZXR1cm4gdGhpcy5vbihuYW1lLCBsaXN0ZW5lciwgY3R4KTtcbiAgfSxcblxuICBlbWl0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciBkYXRhID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGxlbiA9IGV2dEFyci5sZW5ndGg7XG5cbiAgICBmb3IgKGk7IGkgPCBsZW47IGkrKykge1xuICAgICAgZXZ0QXJyW2ldLmZuLmFwcGx5KGV2dEFycltpXS5jdHgsIGRhdGEpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9mZjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcbiAgICB2YXIgZXZ0cyA9IGVbbmFtZV07XG4gICAgdmFyIGxpdmVFdmVudHMgPSBbXTtcblxuICAgIGlmIChldnRzICYmIGNhbGxiYWNrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZXZ0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcbiAgICAgICAgICBsaXZlRXZlbnRzLnB1c2goZXZ0c1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGV2ZW50IGZyb20gcXVldWUgdG8gcHJldmVudCBtZW1vcnkgbGVha1xuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxuICAgIC8vIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL3Njb3R0Y29yZ2FuL3RpbnktZW1pdHRlci9jb21taXQvYzZlYmZhYTliYzk3M2IzM2QxMTBhODRhMzA3NzQyYjdjZjk0Yzk1MyNjb21taXRjb21tZW50LTUwMjQ5MTBcblxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcbiAgICAgID8gZVtuYW1lXSA9IGxpdmVFdmVudHNcbiAgICAgIDogZGVsZXRlIGVbbmFtZV07XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFO1xubW9kdWxlLmV4cG9ydHMuVGlueUVtaXR0ZXIgPSBFO1xuIiwiaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuL2ltYWdlTWFuYWdlcic7XG5jb25zdCBFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XG5cbmludGVyZmFjZSBDaGFyRGF0YSB7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xuICB3OiBudW1iZXI7XG4gIGg6IG51bWJlcjtcbiAgb2ZmWDogbnVtYmVyO1xuICBvZmZZOiBudW1iZXI7XG4gIHhhZHZhbmNlOiBudW1iZXI7XG4gIGtlcm5pbmc6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH07XG59XG5cbmludGVyZmFjZSBDaGFycyB7XG4gIFtrZXk6IHN0cmluZ106IENoYXJEYXRhO1xufVxuXG50eXBlIENvbmZpZ0xpbmVEYXRhID0ge1xuICBsaW5lOiBzdHJpbmdbXTtcbiAgaW5kZXg6IG51bWJlcjtcbn07XG5cblxuLyoqXG4gKiBodHRwOi8vd3d3LmFuZ2VsY29kZS5jb20vcHJvZHVjdHMvYm1mb250L2RvYy9maWxlX2Zvcm1hdC5odG1sXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcEZvbnQge1xuICBwcml2YXRlIGNvbmZpZzogc3RyaW5nO1xuICBwdWJsaWMgZXZlbnQ6IGFueTtcblxuICBwdWJsaWMgY2hhcnM6IENoYXJzO1xuXG4gIHB1YmxpYyByZWFkeSA9IGZhbHNlO1xuICBwdWJsaWMgdGV4dHVyZTogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG4gIHB1YmxpYyBsaW5lSGVpZ2h0PzogbnVtYmVyO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG5cblxuICAvLyBwb29s55qE5a6e546w5pS+5Yiw57G76YeM6Z2i5a6e546w5bm25LiN5LyY6ZuF77yM5YWI5Y675o6J5LqGXG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgdGhpcy5jb25maWcgPSBjb25maWc7XG4gICAgdGhpcy5jaGFycyA9IHRoaXMucGFyc2VDb25maWcoY29uZmlnKTtcbiAgICB0aGlzLmV2ZW50ID0gbmV3IEVtaXR0ZXIoKTtcblxuICAgIHRoaXMudGV4dHVyZSA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2Uoc3JjLCAodGV4dHVyZSwgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG4gICAgICB9XG4gICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcbiAgICAgIHRoaXMuZXZlbnQuZW1pdCgndGV4dF9fbG9hZF9fZG9uZScpO1xuICAgIH0pO1xuICB9XG5cbiAgcGFyc2VDb25maWcoZm50VGV4dDogc3RyaW5nKSB7XG4gICAgZm50VGV4dCA9IGZudFRleHQuc3BsaXQoJ1xcclxcbicpLmpvaW4oJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IGZudFRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGNvbnN0IGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdID0gbGluZXMubWFwKGxpbmUgPT4gbGluZS50cmltKCkuc3BsaXQoJyAnKSk7XG5cbiAgICBjb25zdCBjaGFyc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY2hhcnMnKTtcbiAgICBjb25zdCBjaGFyc0NvdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJzTGluZS5saW5lLCAnY291bnQnKTtcblxuICAgIGNvbnN0IGNvbW1vbkxpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnY29tbW9uJyk7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjb21tb25MaW5lLmxpbmUsICdsaW5lSGVpZ2h0Jyk7XG5cbiAgICBjb25zdCBpbmZvTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdpbmZvJyk7XG4gICAgdGhpcy5mb250U2l6ZSA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoaW5mb0xpbmUubGluZSwgJ3NpemUnKTtcblxuICAgIC8vIOaOpeWNuCBrZXJuaW5nc1xuICAgIGNvbnN0IGtlcm5pbmdzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdrZXJuaW5ncycpO1xuICAgIGxldCBrZXJuaW5nc0NvdW50ID0gMDtcbiAgICBsZXQga2VybmluZ3NTdGFydCA9IC0xO1xuICAgIGlmIChrZXJuaW5nc0xpbmUubGluZSkge1xuICAgICAga2VybmluZ3NDb3VudCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoa2VybmluZ3NMaW5lLmxpbmUsICdjb3VudCcpO1xuICAgICAga2VybmluZ3NTdGFydCA9IGtlcm5pbmdzTGluZS5pbmRleCArIDE7XG4gICAgfVxuXG4gICAgY29uc3QgY2hhcnM6IENoYXJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDQ7IGkgPCA0ICsgY2hhcnNDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyVGV4dDogc3RyaW5nID0gbGluZXNbaV07XG4gICAgICBjb25zdCBsZXR0ZXI6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2lkJykpO1xuXG4gICAgICBjb25zdCBjOiBDaGFyRGF0YSA9IHtcbiAgICAgICAgeDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3gnKSxcbiAgICAgICAgeTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3knKSxcbiAgICAgICAgdzogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3dpZHRoJyksXG4gICAgICAgIGg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdoZWlnaHQnKSxcbiAgICAgICAgb2ZmWDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hvZmZzZXQnKSxcbiAgICAgICAgb2ZmWTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3lvZmZzZXQnKSxcbiAgICAgICAgeGFkdmFuY2U6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4YWR2YW5jZScpLFxuICAgICAgICBrZXJuaW5nOiB7fVxuICAgICAgfTtcbiAgICAgIGNoYXJzW2xldHRlcl0gPSBjO1xuICAgIH1cblxuICAgIC8vIHBhcnNlIGtlcm5pbmdzXG4gICAgaWYgKGtlcm5pbmdzQ291bnQpIHtcbiAgICAgIGZvciAobGV0IGkgPSBrZXJuaW5nc1N0YXJ0OyBpIDw9IGtlcm5pbmdzU3RhcnQgKyBrZXJuaW5nc0NvdW50OyBpKyspIHtcbiAgICAgICAgY29uc3QgbGluZTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcbiAgICAgICAgY29uc3QgZmlyc3Q6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnZmlyc3QnKSk7XG4gICAgICAgIGNvbnN0IHNlY29uZDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdzZWNvbmQnKSk7XG4gICAgICAgIGNvbnN0IGFtb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnYW1vdW50Jyk7XG5cbiAgICAgICAgaWYgKGNoYXJzW3NlY29uZF0pIHtcbiAgICAgICAgICBjaGFyc1tzZWNvbmRdLmtlcm5pbmdbZmlyc3RdID0gYW1vdW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNoYXJzO1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZDogc3RyaW5nW11bXSwgbGluZU5hbWUgPSAnJyk6IENvbmZpZ0xpbmVEYXRhIHtcbiAgICBsZXQgaW5kZXggPSAtMTtcbiAgICBsZXQgbGluZTogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBsZW4gPSBsaW5lc1BhcnNlZC5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuXG4gICAgICBpZiAoaXRlbVswXSA9PT0gbGluZU5hbWUpIHtcbiAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICBsaW5lID0gaXRlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGluZSxcbiAgICAgIGluZGV4LFxuICAgIH07XG4gIH1cblxuICBnZXRDb25maWdCeUtleUluT25lTGluZShjb25maWdUZXh0OiBzdHJpbmdbXSB8IHN0cmluZywga2V5OiBzdHJpbmcpIHtcbiAgICBjb25zdCBpdGVtQ29uZmlnVGV4dExpc3QgPSBBcnJheS5pc0FycmF5KGNvbmZpZ1RleHQpID8gY29uZmlnVGV4dCA6IGNvbmZpZ1RleHQuc3BsaXQoJyAnKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCB7IGxlbmd0aCB9ID0gaXRlbUNvbmZpZ1RleHRMaXN0OyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0ID0gaXRlbUNvbmZpZ1RleHRMaXN0W2ldO1xuICAgICAgaWYgKGtleSA9PT0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKDAsIGtleS5sZW5ndGgpKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaXRlbUNvbmZpZ1RleHQuc3Vic3RyaW5nKGtleS5sZW5ndGggKyAxKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxufVxuIiwiaW50ZXJmYWNlIERlYnVnSW5mb0l0ZW0ge1xuICBzdGFydDogbnVtYmVyO1xuICBpc0lubmVyOiBib29sZWFuO1xuICBlbmQ/OiBudW1iZXI7XG4gIGNvc3Q/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERlYnVnSW5mbyB7XG4gIHB1YmxpYyBpbmZvOiB7IFtrZXk6IHN0cmluZ106IERlYnVnSW5mb0l0ZW0gfSA9IHt9O1xuICBwdWJsaWMgdG90YWxTdGFydDogbnVtYmVyID0gMDtcbiAgcHVibGljIHRvdGFsQ29zdDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICBzdGFydChuYW1lOiBzdHJpbmcsIGlzSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLnRvdGFsU3RhcnQgPT09IDApIHtcbiAgICAgIHRoaXMudG90YWxTdGFydCA9IERhdGUubm93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5pbmZvW25hbWVdID0ge1xuICAgICAgc3RhcnQ6IERhdGUubm93KCksXG4gICAgICBpc0lubmVyLFxuICAgIH07XG4gIH1cblxuICBlbmQobmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuaW5mb1tuYW1lXSkge1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmVuZCA9IERhdGUubm93KCk7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uY29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLmluZm9bbmFtZV0uc3RhcnQ7XG4gICAgICB0aGlzLnRvdGFsQ29zdCA9ICh0aGlzLmluZm9bbmFtZV0uZW5kIGFzIG51bWJlcikgLSB0aGlzLnRvdGFsU3RhcnQ7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbmZvID0ge307XG4gICAgdGhpcy50b3RhbFN0YXJ0ID0gMDtcbiAgICB0aGlzLnRvdGFsQ29zdCA9IDA7XG4gIH1cblxuICBsb2cobmVlZElubmVyOiBib29sZWFuID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGxldCBsb2dJbmZvID0gJ0xheW91dCBkZWJ1ZyBpbmZvOiBcXG4nO1xuICAgIGxvZ0luZm8gKz0gT2JqZWN0LmtleXModGhpcy5pbmZvKS5yZWR1Y2UoKHN1bSwgY3VycikgPT4ge1xuICAgICAgaWYgKHRoaXMuaW5mb1tjdXJyXS5pc0lubmVyICYmICFuZWVkSW5uZXIpIHtcbiAgICAgICAgcmV0dXJuIHN1bTtcbiAgICAgIH1cbiAgICAgIHN1bSArPSBgJHtjdXJyfTogJHt0aGlzLmluZm9bY3Vycl0uY29zdH1cXG5gO1xuICAgICAgcmV0dXJuIHN1bTtcbiAgICB9LCAnJyk7XG5cbiAgICBsb2dJbmZvICs9IGB0b3RhbENvc3Q6ICR7dGhpcy50b3RhbENvc3R9XFxuYDtcblxuICAgIHJldHVybiBsb2dJbmZvO1xuICB9XG59XG4iLCJpbXBvcnQgUG9vbCBmcm9tICcuL3Bvb2wnO1xuaW1wb3J0IHsgbm9uZSwgY3JlYXRlSW1hZ2UgfSBmcm9tICcuL3V0aWwnO1xuXG50eXBlIENhbGxiYWNrID0gKGltZzogSFRNTEltYWdlRWxlbWVudCwgZnJvbUNhY2hlOiBib29sZWFuKSA9PiB2b2lkO1xuaW50ZXJmYWNlIEltYWdlQ2FjaGUge1xuICBpbWc6IEhUTUxJbWFnZUVsZW1lbnQ7XG4gIGxvYWREb25lOiBib29sZWFuO1xuICBvbmxvYWRjYmtzOiBDYWxsYmFja1tdO1xuICBvbmVycm9yY2JrczogQ2FsbGJhY2tbXTtcbn1cblxuY2xhc3MgSW1hZ2VNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBpbWdQb29sID0gbmV3IFBvb2w8SW1hZ2VDYWNoZT4oJ2ltZ1Bvb2wnKTtcbiAgXG4gIGdldFJlcyhzcmM6IHN0cmluZyk6IEltYWdlQ2FjaGUge1xuICAgIHJldHVybiB0aGlzLmltZ1Bvb2wuZ2V0KHNyYyk7XG4gIH1cblxuICBsb2FkSW1hZ2VQcm9taXNlKHNyYzogc3RyaW5nKTogUHJvbWlzZTxIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRJbWFnZShzcmMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG4gIH1cblxuICBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcsIHN1Y2Nlc3M6IENhbGxiYWNrID0gbm9uZSwgZmFpbDogQ2FsbGJhY2sgPSBub25lKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGlmICghc3JjKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICAgIGNvbnN0IGNhY2hlID0gdGhpcy5nZXRSZXMoc3JjKTtcblxuICAgIC8vIOWbvueJh+W3sue7j+iiq+WKoOi9vei/h++8jOebtOaOpei/lOWbnuWbvueJh+W5tuS4lOaJp+ihjOWbnuiwg1xuICAgIGlmIChjYWNoZSAmJiBjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgaW1nID0gY2FjaGUuaW1nO1xuICAgICAgc3VjY2VzcyhpbWcsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAoY2FjaGUgJiYgIWNhY2hlLmxvYWREb25lKSB7XG4gICAgICAvLyDlm77niYfmraPlnKjliqDovb3ov4fnqIvkuK3vvIzov5Tlm57lm77niYflubbkuJTnrYnlvoXlm77niYfliqDovb3lrozmiJDmiafooYzlm57osINcbiAgICAgIGltZyA9IGNhY2hlLmltZztcblxuICAgICAgY2FjaGUub25sb2FkY2Jrcy5wdXNoKHN1Y2Nlc3MpO1xuICAgICAgY2FjaGUub25lcnJvcmNia3MucHVzaChmYWlsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8g5Yib5bu65Zu+54mH77yM5bCG5Zue6LCD5Ye95pWw5o6o5YWl5Zue6LCD5Ye95pWw5qCIXG4gICAgICBpbWcgPSBjcmVhdGVJbWFnZSgpIGFzIEhUTUxJbWFnZUVsZW1lbnQ7XG4gICAgICBjb25zdCBuZXdDYWNoZSA9IHtcbiAgICAgICAgaW1nLFxuICAgICAgICBsb2FkRG9uZTogZmFsc2UsXG4gICAgICAgIG9ubG9hZGNia3M6IFtzdWNjZXNzXSxcbiAgICAgICAgb25lcnJvcmNia3M6IFtmYWlsXSxcbiAgICAgIH1cbiAgICAgXG4gICAgICB0aGlzLmltZ1Bvb2wuc2V0KHNyYywgbmV3Q2FjaGUpO1xuXG4gICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5sb2FkRG9uZSA9IHRydWU7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MgPSBbXTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICB9XG5cbiAgICByZXR1cm4gaW1nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBJbWFnZU1hbmFnZXIoKTtcbiIsImNvbnN0IHBvb2xzOiBQb29sPGFueT5bXSA9IFtdO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sPFQ+IHtcbiAgcHVibGljIG5hbWUgPSAncG9vbCdcbiAgcHVibGljIHBvb2w6IHsgW2tleTogc3RyaW5nXTogVCB9ID0ge307XG5cbiAgY29uc3RydWN0b3IobmFtZSA9ICdwb29sJykge1xuICAgIGNvbnN0IGN1cnIgPSBwb29scy5maW5kKGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcblxuICAgIGlmIChjdXJyKSB7XG4gICAgICByZXR1cm4gY3VycjtcbiAgICB9XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMucG9vbCA9IHt9O1xuXG4gICAgcG9vbHMucHVzaCh0aGlzKTtcbiAgfVxuXG4gIGdldChrZXk6IHN0cmluZyk6IFQge1xuICAgIHJldHVybiB0aGlzLnBvb2xba2V5XTtcbiAgfVxuXG4gIHNldChrZXk6IHN0cmluZywgdmFsdWU6IFQpIHtcbiAgICB0aGlzLnBvb2xba2V5XSA9IHZhbHVlO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5wb29sID0ge307XG4gIH1cblxuICBnZXRMaXN0KCk6IFRbXSB7XG4gICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5wb29sKTtcbiAgfVxufVxuIiwiXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IHtcbiAgcHVibGljIHdpZHRoID0gMDtcbiAgcHVibGljIGhlaWdodCA9IDA7XG4gIHB1YmxpYyBsZWZ0ID0gMDtcbiAgcHVibGljIHJpZ2h0ID0gMDtcbiAgcHVibGljIHRvcCA9IDA7XG4gIHB1YmxpYyBib3R0b20gPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLnNldChsZWZ0LCB0b3AsIHdpZHRoLCBoZWlnaHQpO1xuICB9XG5cbiAgc2V0KGxlZnQgPSAwLCB0b3AgPSAwLCB3aWR0aCA9IDAsIGhlaWdodCA9IDApIHtcbiAgICB0aGlzLmxlZnQgPSBsZWZ0O1xuICAgIHRoaXMudG9wID0gdG9wO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcblxuICAgIHRoaXMucmlnaHQgPSB0aGlzLmxlZnQgKyB0aGlzLndpZHRoO1xuICAgIHRoaXMuYm90dG9tID0gdGhpcy50b3AgKyB0aGlzLmhlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiDliKTmlq3kuKTkuKrnn6nlvaLmmK/lkKbnm7jkuqRcbiAgICog5Y6f55CG5Y+v6KeBOiBodHRwczovL3podWFubGFuLnpoaWh1LmNvbS9wLzI5NzA0MDY0XG4gICAqL1xuICBpbnRlcnNlY3RzKHJlY3Q6IFJlY3QpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISh0aGlzLnJpZ2h0IDwgcmVjdC5sZWZ0IHx8IHJlY3QucmlnaHQgPCB0aGlzLmxlZnQgfHwgdGhpcy5ib3R0b20gPCByZWN0LnRvcCB8fCByZWN0LmJvdHRvbSA8IHRoaXMudG9wKTtcbiAgfVxufVxuIiwiXG50eXBlIENhbGxiYWNrID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrZXIge1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBhbmltYXRpb25JZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBjYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBuZXh0Q2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgaW5uZXJDYnM6IENhbGxiYWNrW10gPSBbXTtcblxuICBwcml2YXRlIHVwZGF0ZSA9ICgpID0+IHtcbiAgICAvLyDkvJjlhYjmiafooYzkuJrliqHnmoR0aWNrZXLlm57osIPvvIzlm6DkuLrmnInlj6/og73kvJrop6blj5FyZWZsb3dcbiAgICB0aGlzLmNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmlubmVyQ2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoKTtcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLm5leHRDYnMubGVuZ3RoKSB7XG4gICAgICB0aGlzLm5leHRDYnMuZm9yRWFjaChjYiA9PiBjYigpKTtcblxuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICB9XG5cbiAgY2FuY2VsSWZOZWVkKCkge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbklkICE9PSBudWxsKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbklkKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGFkZChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5jYnMuaW5kZXhPZihjYikgPT09IC0xKSB7XG4gICAgICBpc0lubmVyID8gdGhpcy5pbm5lckNicy5wdXNoKGNiKSA6ICB0aGlzLmNicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICBuZXh0KGNiOiBDYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMubmV4dENicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmUoY2I/OiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKGNiID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuY2JzID0gW107XG4gICAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID4gLTEpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBpc0lubmVyID8gdGhpcy5pbm5lckNicyA6IHRoaXMuY2JzO1xuICAgICAgbGlzdC5zcGxpY2UodGhpcy5jYnMuaW5kZXhPZihjYiksIDEpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jYnMubGVuZ3RoICYmICF0aGlzLmlubmVyQ2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgPT09IG51bGwgJiYgKHRoaXMuY2JzLmxlbmd0aCB8fCB0aGlzLmlubmVyQ2JzLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBpZiAodGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5leHBvcnQgZnVuY3Rpb24gbm9uZSgpIHsgfVxuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcygpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmKi9cbiAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1hZ2UoKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiovXG4gIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xufVxuXG5sZXQgX2RwcjogbnVtYmVyO1xuLy8gb25seSBCYWlkdSBwbGF0Zm9ybSBuZWVkIHRvIHJlY2lldmUgc3lzdGVtIGluZm8gZnJvbSBtYWluIGNvbnRleHRcbmlmICh0eXBlb2Ygc3dhbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgX19lbnYub25NZXNzYWdlKChyZXM6IGFueSkgPT4ge1xuICAgIGlmIChyZXMgJiYgcmVzLnR5cGUgPT09ICdlbmdpbmUnKSB7XG4gICAgICBpZiAocmVzLmV2ZW50ID09PSAnc3lzdGVtSW5mbycpIHtcbiAgICAgICAgX2RwciA9IHJlcy5zeXN0ZW1JbmZvLmRldmljZVBpeGVsUmF0aW87XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERwcigpIHtcbiAgLy8gcmV0dXJuIDM7XG4gIGlmICh0eXBlb2YgX2RwciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX2RwcjtcbiAgfVxuICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgIF9kcHIgPSBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYygpLmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcbiAgICBfZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSBmYWlsZWQgdG8gYWNjZXNzIGRldmljZSBwaXhlbCByYXRpbywgZmFsbGJhY2sgdG8gMScpO1xuICAgIF9kcHIgPSAxO1xuICB9XG4gIHJldHVybiBfZHByO1xufVxuXG5leHBvcnQgZW51bSBTVEFURSB7XG4gIFVOSU5JVCA9ICdVTklOSVQnLFxuICBJTklURUQgPSAnSU5JVEVEJyxcbiAgUkVOREVSRUQgPSAnUkVOREVSRUQnLFxuICBDTEVBUiA9ICdDTEVBUicsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDYW52YXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4ICYmIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvdWNoQXJyYXkodG91Y2hlczogR2FtZVRvdWNoW10pIHtcbiAgcmV0dXJuIHRvdWNoZXMubWFwKHRvdWNoID0+ICh7XG4gICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcbiAgICBwYWdlWDogdG91Y2gucGFnZVgsXG4gICAgcGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG4gICAgY2xpZW50WTogdG91Y2guY2xpZW50WSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lVG91Y2hFdmVudChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpOiBlIGlzIEdhbWVUb3VjaEV2ZW50IHtcbiAgcmV0dXJuICd0b3VjaGVzJyBpbiBlO1xufSIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBFbGVtZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcblxuaW1wb3J0IHsgSUxheW91dCwgSUxheW91dEJveCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWxlbWVudHMnXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmludGVyZmFjZSBUcmVlTm9kZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXR0cjogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgY2hpbGRyZW46IFRyZWVOb2RlW107XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gaXNQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIC9cXGQrKD86XFwuXFxkKyk/JS8udGVzdChkYXRhKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNoYXJlZENhbnZhcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gc2hhcmVkQ2FudmFzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGFyZW50U3R5bGUgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3MpO1xuICBjb25zdCBlbGVtZW50ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICAvLyBAdHMtaWdub3JlXG4gIGVsZW1lbnQucm9vdCA9IHRoaXM7XG4gIGVsZW1lbnQudGFnTmFtZSA9IG5vZGUubmFtZTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGNyZWF0ZS5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgc3R5bGUsIGFyZ3MpO1xuXG4gICAgaWYgKGNoaWxkRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW46IEVsZW1lbnRbXSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyID0gdHJ1ZSkge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIC8vIGNoaWxkLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGNoaWxkLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjaGlsZC5pbnNlcnQoY29udGV4dCwgbmVlZFJlbmRlcik7XG5cbiAgICAvLyBTY3JvbGxWaWV355qE5a2Q6IqC54K55riy5p+T5Lqk57uZU2Nyb2xsVmlld+iHquW3se+8jOS4jeaUr+aMgeW1jOWll1Njcm9sbFZpZXdcbiAgICByZXR1cm4gcmVuZGVyQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGNvbnRleHQsICBjaGlsZC50eXBlID09PSAnU2Nyb2xsVmlldycgPyBmYWxzZSA6IG5lZWRSZW5kZXIpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dENoaWxkcmVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLmxheW91dEJveCA9IGNoaWxkLmxheW91dEJveCB8fCB7fTtcblxuICAgIFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZC5sYXlvdXRCb3hbcHJvcCBhcyBrZXlvZiBJTGF5b3V0Qm94XSA9IGNoaWxkLmxheW91dD8uW3Byb3AgYXMga2V5b2YgSUxheW91dF0gYXMgbnVtYmVyO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWCB8fCAwKSArIGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWSB8fCAwKSArIGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH1cblxuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVk7XG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWDtcblxuXG4gICAgbGF5b3V0Q2hpbGRyZW4oY2hpbGQpO1xuICB9KTtcbn1cblxudHlwZSBDYWxsYmFjayA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuZnVuY3Rpb24gbm9uZSgpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVUcmVlKGVsZW1lbnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiBDYWxsYmFjayA9IG5vbmUpIHtcbiAgY2FsbGJhY2soZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGl0ZXJhdGVUcmVlKGNoaWxkLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcmVwYWludENoaWxkcmVuID0gKGNoaWxkcmVuOiBFbGVtZW50W10pID0+IHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1Njcm9sbFZpZXcnKSB7XG4gICAgICByZXBhaW50Q2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVwYWludFRyZWUgPSAodHJlZTogRWxlbWVudCkgPT4ge1xuICB0cmVlLnJlcGFpbnQoKTtcblxuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgcmVwYWludFRyZWUoY2hpbGQpO1xuICB9KTtcbn07XG5cbmludGVyZmFjZSBFbGVtZW50QXJncyB7XG4gIHN0eWxlOiBvYmplY3Q7XG4gIGlkTmFtZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgZGF0YXNldDogb2JqZWN0O1xuICBzcmM/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VCBleHRlbmRzIEVsZW1lbnQ+KHJvb3Q6IFQsIGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlLCBwYXJlbnQ/OiBFbGVtZW50KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbZWxlbWVudC50YWdOYW1lIGFzIHN0cmluZ107XG4gIC8vIEB0cy1pZ25vcmVcbiAgcm9vdC5lbGVDb3VudCArPSAxO1xuXG4gIGNvbnN0IGFyZ3M6IEVsZW1lbnRBcmdzID0ge1xuICAgIHN0eWxlOiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LnN0eWxlKSxcbiAgICBpZE5hbWU6IGVsZW1lbnQuaWROYW1lLFxuICAgIGNsYXNzTmFtZTogZWxlbWVudC5jbGFzc05hbWUsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlkOiByb290LmVsZUNvdW50LFxuICAgIGRhdGFzZXQ6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuZGF0YXNldCksXG4gIH07XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIGFyZ3Muc3JjID0gZWxlbWVudC5zcmM7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEJpdE1hcFRleHQpIHtcbiAgICBhcmdzLnZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld0VsZW1lbmV0ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICBuZXdFbGVtZW5ldC5yb290ID0gcm9vdDtcbiAgLy8gQHRzLWlnbm9yZVxuICBuZXdFbGVtZW5ldC5pbnNlcnQocm9vdC5yZW5kZXJDb250ZXh0LCBmYWxzZSk7XG4gIG5ld0VsZW1lbmV0Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGQobmV3RWxlbWVuZXQpO1xuICB9XG5cbiAgaWYgKGRlZXApIHtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjbG9uZShyb290LCBjaGlsZCwgZGVlcCwgbmV3RWxlbWVuZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld0VsZW1lbmV0O1xufVxuXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgZm9udD86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ0JpdE1hcFRleHQnO1xuICBwcml2YXRlIHZhbHVlc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBmb250OiBCaXRNYXBGb250O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElCaXRNYXBUZXh0T3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgdmFsdWUgPSAnJyxcbiAgICAgIGZvbnQgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIHRoaXMuZm9udCA9IGJpdE1hcFBvb2wuZ2V0KGZvbnQpO1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBNaXNzaW5nIEJpdG1hcEZvbnQgXCIke2ZvbnR9XCIsIHBsZWFzZSBpbnZva2UgQVBJIFwicmVnaXN0Qml0TWFwRm9udFwiIGJlZm9yZSB1c2luZyBcIkJpdE1hcFRleHRcImApO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICB9XG5cbiAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5lbWl0KCdyZXBhaW50Jyk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmZvbnQucmVhZHkpIHtcbiAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmZvbnQuZXZlbnQub24oJ3RleHRfX2xvYWRfX2RvbmUnLCAoKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVGV4dCh0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBnZXRUZXh0Qm91bmRzKCkge1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7IGxldHRlclNwYWNpbmcgPSAwIH0gPSBzdHlsZTtcbiAgICBsZXQgd2lkdGggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMudmFsdWUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuICAgICAgaWYgKGNmZykge1xuICAgICAgICB3aWR0aCArPSBjZmcudztcblxuICAgICAgICBpZiAoaSA8IGxlbiAtIDEpIHtcbiAgICAgICAgICB3aWR0aCArPSBsZXR0ZXJTcGFjaW5nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgd2lkdGgsIGhlaWdodDogdGhpcy5mb250LmxpbmVIZWlnaHQgfTtcbiAgfVxuXG4gIHJlbmRlclRleHQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldFRleHRCb3VuZHMoKTtcbiAgICBjb25zdCBkZWZhdWx0TGluZUhlaWdodCA9IHRoaXMuZm9udC5saW5lSGVpZ2h0IGFzIG51bWJlcjtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjb25zdCB7XG4gICAgICB3aWR0aCA9IDAsIC8vIOayoeacieiuvue9rumHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgaGVpZ2h0ID0gMCwgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICAvLyBsaW5lSGVpZ2h0ID0gZGVmYXVsdExpbmVIZWlnaHQsIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgICAgdGV4dEFsaWduLCAvLyDmloflrZflt6blj7Plr7npvZDmlrnlvI9cbiAgICAgIHZlcnRpY2FsQWxpZ24sXG4gICAgICBsZXR0ZXJTcGFjaW5nID0gMCxcbiAgICB9ID0gc3R5bGU7XG4gICAgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE6auY5bqmXG4gICAgY29uc3QgbGluZUhlaWdodCA9IChzdHlsZS5saW5lSGVpZ2h0IHx8IGRlZmF1bHRMaW5lSGVpZ2h0KSBhcyBudW1iZXJcblxuICAgIC8vIOWFg+e0oOWMheWbtOebkueahOW3puS4iuinkuWdkOagh1xuICAgIGxldCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBsZXQgeSA9IGJveC5hYnNvbHV0ZVk7XG5cbiAgICBjb25zdCBzY2FsZVkgPSBsaW5lSGVpZ2h0IC8gZGVmYXVsdExpbmVIZWlnaHQ7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gc2NhbGVZICogYm91bmRzLndpZHRoO1xuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIHgsIHksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgLy8g5aaC5p6c5paH5a2X55qE5riy5p+T5Yy65Z+f6auY5bqm5bCP5LqO55uS5a2Q6auY5bqm77yM6YeH55So5a+56b2Q5pa55byPXG4gICAgaWYgKGxpbmVIZWlnaHQgPCBoZWlnaHQpIHtcbiAgICAgIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnbWlkZGxlJykge1xuICAgICAgICB5ICs9IChoZWlnaHQgLSBsaW5lSGVpZ2h0KSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdib3R0b20nKSB7XG4gICAgICAgIHkgPSB5ICsgaGVpZ2h0IC0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAod2lkdGggPiByZWFsV2lkdGgpIHtcbiAgICAgIGlmICh0ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgIHggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKHRleHRBbGlnbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICB4ICs9ICh3aWR0aCAtIHJlYWxXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g6K6w5b2V5LiK5LiA5Liq5a2X56ym77yM5pa55L6/5aSE55CGIGtlcm5pbmdcbiAgICBsZXQgcHJldkNoYXJDb2RlID0gbnVsbDtcblxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZhbHVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcblxuICAgICAgaWYgKHByZXZDaGFyQ29kZSAmJiBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdKSB7XG4gICAgICAgIHggKz0gY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNmZykge1xuICAgICAgICBjdHguZHJhd0ltYWdlKFxuICAgICAgICAgIHRoaXMuZm9udC50ZXh0dXJlIGFzIEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgICAgICAgY2ZnLngsXG4gICAgICAgICAgY2ZnLnksXG4gICAgICAgICAgY2ZnLncsXG4gICAgICAgICAgY2ZnLmgsXG4gICAgICAgICAgeCArIGNmZy5vZmZYICogc2NhbGVZLFxuICAgICAgICAgIHkgKyBjZmcub2ZmWSAqIHNjYWxlWSxcbiAgICAgICAgICBjZmcudyAqIHNjYWxlWSxcbiAgICAgICAgICBjZmcuaCAqIHNjYWxlWSxcbiAgICAgICAgKTtcblxuICAgICAgICB4ICs9IChjZmcueGFkdmFuY2UgKiBzY2FsZVkgKyBsZXR0ZXJTcGFjaW5nKTtcblxuICAgICAgICBwcmV2Q2hhckNvZGUgPSBjaGFyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBjcmVhdGVDYW52YXMgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUNhbnZhc09wdGlvbnMge1xuICBzdHlsZT86IElTdHlsZVxuICBpZE5hbWU/OiBzdHJpbmc7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBhdXRvQ3JlYXRlQ2FudmFzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgY2FudmFzSW5zdGFuY2U6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQ2FudmFzT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHdpZHRoID0gMTAwLFxuICAgICAgaGVpZ2h0ID0gMTAwLFxuICAgICAgYXV0b0NyZWF0ZUNhbnZhcyA9IGZhbHNlLFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5bCP5ri45oiP5Zy65pmv5LiL77yMc2hhcmVkQ2FudmFzIOWunuS+i+S4jeaWueS+v+iHquWKqOWIm+W7uu+8jOaPkOS+myBzZXR0ZXIg5omL5Yqo6K6+572uXG4gICAgICovXG4gICAgaWYgKGF1dG9DcmVhdGVDYW52YXMpIHtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGlmIChzdHlsZS5ib3JkZXJDb2xvcikge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG5cbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhc0luc3RhbmNlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlJZCh0cmVlOiBFbGVtZW50LCBsaXN0OiBFbGVtZW50W10gPSBbXSwgaWQ6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKGNoaWxkLmlkTmFtZSA9PT0gaWQpIHtcbiAgICAgIGxpc3QucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgZ2V0RWxlbWVudHNCeUlkKGNoaWxkLCBsaXN0LCBpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRCeUlkKHRyZWU6IEVsZW1lbnQsIGlkOiBzdHJpbmcpIHtcbiAgY29uc3QgbGlzdCA9IGdldEVsZW1lbnRzQnlJZCh0cmVlLCBbXSwgaWQpO1xuXG4gIHJldHVybiBsaXN0Py5bMF0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWUodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoKGNoaWxkLmNsYXNzTmFtZUxpc3QgfHwgY2hpbGQuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLykpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2hpbGQsIGxpc3QsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdDtcbn1cblxuLyoqXG4gKiDlsIblvZPliY3oioLngrnnva7ohI/vvIxMYXlvdXQg55qEIHRpY2tlciDkvJrmoLnmja7ov5nkuKrmoIforrDkvY3miafooYwgcmVmbG93XG4gKi9cbmZ1bmN0aW9uIHNldERpcnR5KGVsZTogRWxlbWVudCkge1xuICBlbGUuaXNEaXJ0eSA9IHRydWU7XG4gIGxldCB7IHBhcmVudCB9ID0gZWxlO1xuICB3aGlsZSAocGFyZW50KSB7XG4gICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbn1cblxuLy8g5YWo5bGA5LqL5Lu2566h6YGTXG5jb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuXG5sZXQgdXVpZCA9IDA7XG5cbmZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICByZXR1cm4gcmVzdWx0XG4gICAgPyB7XG4gICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNiksXG4gICAgfVxuICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZ2V0UmdiYShoZXg6IHN0cmluZywgb3BhY2l0eTogbnVtYmVyKSB7XG4gIGNvbnN0IHJnYk9iaiA9IGhleFRvUmdiKGhleCk7XG5cbiAgaWYgKG9wYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIG9wYWNpdHkgPSAxO1xuICB9XG5cbiAgaWYgKCFyZ2JPYmopIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBgcmdiYSgke3JnYk9iai5yfSwgJHtyZ2JPYmouZ30sICR7cmdiT2JqLmJ9LCAke29wYWNpdHl9KWA7XG59XG5cbmNvbnN0IHRvRXZlbnROYW1lID0gKGV2ZW50OiBzdHJpbmcsIGlkOiBudW1iZXIpID0+IHtcbiAgY29uc3QgZWxlbWVudEV2ZW50ID0gW1xuICAgICdjbGljaycsXG4gICAgJ3RvdWNoc3RhcnQnLFxuICAgICd0b3VjaG1vdmUnLFxuICAgICd0b3VjaGVuZCcsXG4gICAgJ3RvdWNoY2FuY2VsJyxcbiAgXTtcblxuICBpZiAoZWxlbWVudEV2ZW50LmluZGV4T2YoZXZlbnQpICE9PSAtMSkge1xuICAgIHJldHVybiBgZWxlbWVudC0ke2lkfS0ke2V2ZW50fWA7XG4gIH1cblxuICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xufTtcblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0Qm94IHtcbiAgbGVmdDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGFic29sdXRlWDogbnVtYmVyO1xuICBhYnNvbHV0ZVk6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVg6IG51bWJlcjtcbiAgb3JpZ2luYWxBYnNvbHV0ZVk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJTGF5b3V0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIHJpZ2h0OiBudW1iZXI7XG4gIGJvdHRvbTogbnVtYmVyO1xufTtcblxudHlwZSBDYWxsYmFjayA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuY29uc3QgaXNWYWxpZFVybFByb3BSZWcgPSAvXFxzKnVybFxcKCguKj8pXFwpXFxzKi87XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVsZW1lbnQge1xuICAvKipcbiAgICog5a2Q6IqC54K55YiX6KGoXG4gICAqL1xuICBwdWJsaWMgY2hpbGRyZW46IEVsZW1lbnRbXSA9IFtdO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE54i26IqC54K5XG4gICAqL1xuICBwdWJsaWMgcGFyZW50OiBFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLy8g5Ly85LmO5rKh5LuA5LmI55So77yM5YWI5rOo6YeKXG4gIC8vIHB1YmxpYyBwYXJlbnRJZCA9IDA7XG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoRpZO+8jOS4gOiIrOaYr+eUsSBMYXlvdXQg57uf5LiA5YiG6YWN55qE6Ieq5aKeIGlkXG4gICAqL1xuICBwdWJsaWMgaWQ6IG51bWJlcjtcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgaWQg5bGe5oCn77yM5LiA6Iis55So5LqO6IqC54K55p+l6K+iXG4gICAqL1xuICBwdWJsaWMgaWROYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGNsYXNzIOWxnuaAp++8jOS4gOiIrOeUqOS6juaooeadv+aPkuS7tlxuICAgKi9cbiAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG4gIFxuICAvKipcbiAgICog6IqC54K555qE5qC35byP5YiX6KGo77yM5ZyoIExheW91dC5pbml0IOS8muS8oOWFpeagt+W8j+mbhuWQiO+8jOS8muiHquWKqOaMkemAieWHuui3n+iKgueCueacieWFs+eahOagt+W8j+e7n+S4gCBtZXJnZSDliLAgc3R5bGUg5a+56LGh5LiKXG4gICAqL1xuICBwdWJsaWMgc3R5bGU6IElTdHlsZTtcblxuICAvKipcbiAgICog5omn6KGMIGdldEJvdW5kaW5nQ2xpZW50UmVjdCDnmoTnu5PmnpznvJPlrZjvvIzlpoLmnpzkuJrliqHpq5jpopHosIPnlKjvvIzlj6/ku6Xlh4/lsJEgR0NcbiAgICovXG4gIHByaXZhdGUgcmVjdDogUmVjdCB8IG51bGw7XG4gIHB1YmxpYyBjbGFzc05hbWVMaXN0OiBzdHJpbmdbXSB8IG51bGw7XG4gIHB1YmxpYyBsYXlvdXRCb3g6IElMYXlvdXRCb3g7XG4gIHB1YmxpYyBiYWNrZ3JvdW5kSW1hZ2U6IGFueTtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGxcblxuICAvKipcbiAgICog572u6ISP5qCH6K6w5L2N77yM55uu5YmN5b2T5L+u5pS55Lya5b2x5ZON5biD5bGA5bGe5oCn55qE5pe25YCZ77yM5Lya6Ieq5Yqo572u6ISPXG4gICAqL1xuICBwdWJsaWMgaXNEaXJ0eSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBjc3MtbGF5b3V0IOiKgueCueWxnuaAp++8jOS4muWKoeS+p+aXoOmcgOWFs+W/g1xuICAgKi9cbiAgcHJvdGVjdGVkIHNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnnmoTlkI3np7DvvIzmr5TlpoJcIiBJbWFnZVxuICAgKi9cbiAgcHVibGljIHR5cGU/OiBzdHJpbmc7XG4gIC8vIHB1YmxpYyBsYXlvdXQ/OiBJTGF5b3V0O1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnlnKggeG1sIOeahOagh+etvuWQjeensO+8jOavlOWmgiBpbWFnZeOAgXZpZXdcbiAgICovXG4gIHB1YmxpYyB0YWdOYW1lPzogc3RyaW5nO1xuXG4gIHByaXZhdGUgb3JpZ2luU3R5bGU6IElTdHlsZTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBpZCA9IHV1aWQgKz0gMSxcbiAgICBkYXRhc2V0ID0ge30sXG4gIH06IHtcbiAgICBzdHlsZT86IElTdHlsZTtcbiAgICBpZE5hbWU/OiBzdHJpbmc7XG4gICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgIGlkPzogbnVtYmVyO1xuICAgIGRhdGFzZXQ/OiBJRGF0YXNldDtcbiAgfSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmlkTmFtZSA9IGlkTmFtZTtcbiAgICB0aGlzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB0aGlzLmxheW91dEJveCA9IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGFic29sdXRlWDogMCxcbiAgICAgIGFic29sdXRlWTogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVYOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVk6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICBpZiAoXG4gICAgICBzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICYmIHN0eWxlLmNvbG9yXG4gICAgICAmJiBzdHlsZS5jb2xvci5pbmRleE9mKCcjJykgPiAtMVxuICAgICkge1xuICAgICAgLy8g6aKc6Imy6Kej5p6Q5aSx6LSl77yM6ZmN57qn5Li6IGhleFxuICAgICAgc3R5bGUuY29sb3IgPSBnZXRSZ2JhKHN0eWxlLmNvbG9yLCBzdHlsZS5vcGFjaXR5KSB8fCBzdHlsZS5jb2xvcjtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWRcbiAgICAgICYmIHN0eWxlLmJhY2tncm91bmRDb2xvclxuICAgICAgJiYgc3R5bGUuYmFja2dyb3VuZENvbG9yLmluZGV4T2YoJyMnKSA+IC0xXG4gICAgKSB7XG4gICAgICAvLyDpopzoibLop6PmnpDlpLHotKXvvIzpmY3nuqfkuLogaGV4XG4gICAgICBzdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBnZXRSZ2JhKHN0eWxlLmJhY2tncm91bmRDb2xvciwgc3R5bGUub3BhY2l0eSkgfHwgc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3R5bGUuYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHN0eWxlLmJhY2tncm91bmRJbWFnZSk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnaW5TdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnJlY3QgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IG51bGw7XG4gIH1cblxuICBiYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKGJhY2tncm91bmRJbWFnZTogc3RyaW5nKSB7XG4gICAgaWYgKHR5cGVvZiBiYWNrZ3JvdW5kSW1hZ2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb25zdCBsaXN0ID0gYmFja2dyb3VuZEltYWdlLm1hdGNoKGlzVmFsaWRVcmxQcm9wUmVnKTtcbiAgICAgIGlmIChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHVybCA9IGxpc3RbMV0ucmVwbGFjZSgvKCd8XCIpL2csICcnKTtcbiAgICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlID0gaW1nO1xuICAgICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgICB0aGlzLnJvb3QgJiYgdGhpcy5yb290LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7YmFja2dyb3VuZEltYWdlfSBpcyBub3QgYSB2YWxpZCBiYWNrZ3JvdW5kSW1hZ2VgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog55uR5ZCs5bGe5oCn55qE5Y+Y5YyW5Yik5pat5piv5ZCm6ZyA6KaB5omn6KGMIHJlZmxvd+OAgXJlcGFpbnQg5pON5L2cXG4gICAqIOe7j+i/h+a1i+ivle+8jE9iamVjdC5kZWZpbmVQcm9wZXJ0eSDmmK/kuIDkuKrmr5TovoPmhaLnmoTmlrnms5XvvIwg54m55Yir5piv5bGe5oCn5q+U6L6D5aSa55qE5pe25YCZXG4gICAqIOWboOatpOS8muWFiOWIpOaWreaYr+WQpuaUr+aMgSBQcm94ee+8jGlNYWMgKFJldGluYSA1SywgMjctaW5jaCwgMjAxNynmtYvor5Xnu5PmnpxcbiAgICog5oC75YWxIDMxMiDkuKroioLngrnvvIxvYnNlcnZlU3R5bGVBbmRFdmVudOaAu+iAl+aXtuS4uu+8mlxuICAgKiBQcm94eTogM21zXG4gICAqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eTogMjBtc1xuICAgKi9cbiAgb2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSB7XG4gICAgaWYgKHR5cGVvZiBQcm94eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3QgZWxlID0gdGhpcztcbiAgICAgIHRoaXMuc3R5bGUgPSBuZXcgUHJveHkodGhpcy5vcmlnaW5TdHlsZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcikge1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgc2V0RGlydHkoZWxlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuICAgICAgICAgICAgICBlbGUucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChwcm9wID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICBlbGUuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGlubmVyU3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnN0eWxlKSBhcyBJU3R5bGU7XG4gICAgICBhbGxTdHlsZXMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnN0eWxlLCBrZXksIHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6ICgpID0+IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0sXG4gICAgICAgICAgc2V0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSkge1xuICAgICAgICAgICAgICBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdID0gdmFsdWU7XG4gICAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kSW1hZ2UnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYWNrZ3JvdW5kSW1hZ2VTZXRIYW5kbGVyKHZhbHVlKTtcbiAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOS6i+S7tuWGkuazoemAu+i+kVxuICAgIFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hjYW5jZWwnLCAndG91Y2hlbmQnLCAnY2xpY2snXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub24oZXZlbnROYW1lLCAoZSwgdG91Y2hNc2cpID0+IHtcbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZW1pdChldmVudE5hbWUsIGUsIHRvdWNoTXNnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gdGhpcy5jbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnph43nu5jmjqXlj6PvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlcGFpbnQoKSB7IH1cblxuICAvKipcbiAgICog6IqC54K55riy5p+T5o6l5Y+j5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZW5kZXIoKSB7IH1cblxuICAvKipcbiAgICog5Y+C54WnIFdlYiDop4TojIPvvJpodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICovXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOiBSZWN0IHtcbiAgICBpZiAoIXRoaXMucmVjdCkge1xuICAgICAgdGhpcy5yZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY3Quc2V0KFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzkvYbov5nph4zlj6rov5Tlm57nrKblkIjmnaHku7bnmoTnrKzkuIDkuKroioLngrkgXG4gICAqL1xuICBnZXRFbGVtZW50QnlJZChpZDogc3RyaW5nKTogRWxlbWVudCB8IG51bGwge1xuICAgIHJldHVybiBnZXRFbGVtZW50QnlJZCh0aGlzLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzov5nph4zov5Tlm57nrKblkIjmnaHku7bnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlJZChpZDogc3RyaW5nKTogKEVsZW1lbnQgfCBudWxsKVtdIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudHNCeUlkKHRoaXMsIFtdLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMY2xhc3NOYW1lIOWMheWQq+e7meWumuWPguaVsOeahOeahOiKgueCuembhuWQiFxuICAgKi9cbiAgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlDbGFzc05hbWUodGhpcywgW10sIGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICog5biD5bGA6K6h566X5a6M5oiQ77yM5YeG5aSH5omn6KGM5riy5p+T5LmL5YmN5omn6KGM55qE5pON5L2c77yM5LiN5ZCM55qE5a2Q57G75pyJ5LiN5ZCM55qE6KGM5Li6XG4gICAqIOavlOWmgiBTY3JvbGxWaWV3IOWcqOa4suafk+S5i+WJjei/mOmcgOimgeWIneWni+WMlua7muWKqOebuOWFs+eahOiDveWKm1xuICAgKiAgXG4gICAqL1xuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCueino+mZpOS6i+S7tue7keWumlxuICAgKi9cbiAgdW5CaW5kRXZlbnQoKSB7XG4gICAgW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICdjbGljaycsXG4gICAgICAncmVwYWludCcsXG4gICAgXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5bCG6IqC54K55LuO5b2T5YmN6IqC54K55qCR5Lit5Yig6ZmkXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBwYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIHRoaXMudW5CaW5kRXZlbnQoKTtcbiAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgdGhpcy5jdHggPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoaXMgZWxlbWVudCBoYXMgYmVlbiByZW1vdmVkJyk7XG4gICAgfVxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuXG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG5cbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICAvLyB0aGlzLkVFID0gbnVsbDtcbiAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuXG4gICAgLy8gZWxlbWVudCDlnKjnlLvluIPkuK3nmoTkvY3nva7lkozlsLrlr7jkv6Hmga9cbiAgICAvLyB0aGlzLmxheW91dEJveCA9IG51bGw7XG4gICAgLy8gdGhpcy5zdHlsZSA9IG51bGw7XG4gICAgdGhpcy5jbGFzc05hbWUgPSAnJztcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYWRkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnBhcmVudCA9IHRoaXM7XG4gICAgLy8gZWxlbWVudC5wYXJlbnRJZCA9IHRoaXMuaWQ7XG5cbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG5LiA5Liq6IqC54K55re75Yqg5L2c5Li65b2T5YmN6IqC54K555qE5a2Q6IqC54K5XG4gICAqL1xuICBhcHBlbmRDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5hZGQoZWxlbWVudCk7XG5cbiAgICBzZXREaXJ0eSh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDnp7vpmaTnu5nlrprnmoTlrZDoioLngrnvvIzlj6rmnInkuIDnuqfoioLngrnog73lpJ/np7vpmaQgXG4gICAqL1xuICByZW1vdmVDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIHRoZSBlbGVtZW50IHRvIGJlIHJlbW92ZWQgaXMgbm90IGEgY2hpbGQgb2YgdGhpcyBlbGVtZW50Jyk7XG4gICAgfVxuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCAuLi50aGVBcmdzOiBhbnlbXSkge1xuICAgIEVFLmVtaXQodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCAuLi50aGVBcmdzKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb25jZShldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbmNlKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrPzogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICog5riy5p+TIGJvcmRlciDnm7jlhbPog73lipvmir3osaHvvIzlrZDnsbvlj6/mjInpnIDosIPnlKhcbiAgICovXG4gIHJlbmRlckJvcmRlcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCByYWRpdXMgPSBzdHlsZS5ib3JkZXJSYWRpdXMgfHwgMDtcbiAgICBjb25zdCB7IGJvcmRlcldpZHRoID0gMCB9ID0gc3R5bGU7XG4gICAgY29uc3QgYm9yZGVyVG9wTGVmdFJhZGl1cyA9IHN0eWxlLmJvcmRlclRvcExlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJvcmRlclRvcFJpZ2h0UmFkaXVzID0gc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJvcmRlckJvdHRvbUxlZnRSYWRpdXMgPSBzdHlsZS5ib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJCb3R0b21SaWdodFJhZGl1cyA9IHN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yID0gJycgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IHkgPSBib3guYWJzb2x1dGVZO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgY29uc3QgaGFzUmFkaXVzID0gcmFkaXVzXG4gICAgICB8fCBib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IGJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IGJvcmRlckJvdHRvbUxlZnRSYWRpdXMgfHwgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM7XG5cbiAgICAvLyBib3JkZXJXaWR0aCDlkowgcmFkaXVzIOmDveayoeacie+8jOS4jemcgOimgeaJp+ihjOWQjue7remAu+i+ke+8jOaPkOWNh+aAp+iDvVxuICAgIGlmICghYm9yZGVyV2lkdGggJiYgIWhhc1JhZGl1cykge1xuICAgICAgcmV0dXJuIHsgbmVlZENsaXA6IGZhbHNlLCBuZWVkU3Ryb2tlOiBmYWxzZSB9O1xuICAgIH1cblxuICAgIC8vIOW3puS4iuinkueahOeCuVxuICAgIGN0eC5iZWdpblBhdGgoKTtcblxuICAgIGN0eC5saW5lV2lkdGggPSBib3JkZXJXaWR0aDtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBib3JkZXJDb2xvcjtcblxuICAgIGN0eC5tb3ZlVG8oeCArIGJvcmRlclRvcExlZnRSYWRpdXMsIHkpO1xuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gYm9yZGVyVG9wUmlnaHRSYWRpdXMsIHkpO1xuXG4gICAgLy8g5Y+z5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggKyB3aWR0aCwgeSwgeCArIHdpZHRoLCB5ICsgYm9yZGVyVG9wUmlnaHRSYWRpdXMsIGJvcmRlclRvcFJpZ2h0UmFkaXVzKTtcblxuICAgIC8vIOWPs+S4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoLCB5ICsgaGVpZ2h0IC0gYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMpO1xuXG4gICAgLy8g5Y+z5LiL6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKFxuICAgICAgeCArIHdpZHRoLFxuICAgICAgeSArIGhlaWdodCxcbiAgICAgIHggKyB3aWR0aCAtIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICAgeSArIGhlaWdodCxcbiAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzLFxuICAgICk7XG5cbiAgICAvLyDlt6bkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyBib3JkZXJCb3R0b21MZWZ0UmFkaXVzLCB5ICsgaGVpZ2h0KTtcblxuICAgIC8vIOW3puS4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4LCB5ICsgaGVpZ2h0LCB4LCB5ICsgaGVpZ2h0IC0gYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgYm9yZGVyQm90dG9tTGVmdFJhZGl1cyk7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHgsIHkgKyBib3JkZXJUb3BMZWZ0UmFkaXVzKTtcblxuICAgIC8vIOW3puS4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4LCB5LCB4ICsgYm9yZGVyVG9wTGVmdFJhZGl1cywgeSwgYm9yZGVyVG9wTGVmdFJhZGl1cyk7XG5cbiAgICByZXR1cm4geyBuZWVkQ2xpcDogISFoYXNSYWRpdXMsIG5lZWRTdHJva2U6ICEhYm9yZGVyV2lkdGggfTtcbiAgfVxufVxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4uL2NvbW1vbi9pbWFnZU1hbmFnZXInO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIElJbWFnZU9wdGlvbnMge1xuICBzdHlsZT86IElTdHlsZTtcbiAgaWROYW1lPzogc3RyaW5nXG4gIGNsYXNzTmFtZT86IHN0cmluZztcbiAgc3JjPzogc3RyaW5nO1xuICBkYXRhc2V0PzogSURhdGFzZXQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgaW1nc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyB0eXBlID0gJ0ltYWdlJztcbiAgcHVibGljIGltZzogSFRNTEltYWdlRWxlbWVudCB8IG51bGw7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUltYWdlT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgc3JjID0gJycsXG4gICAgICBkYXRhc2V0LFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5pbWdzcmMgPSBzcmM7XG5cbiAgICAvLyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ3NyYycsIHtcbiAgICAvLyAgIGdldCgpIHtcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaW1nc3JjO1xuICAgIC8vICAgfSxcbiAgICAvLyAgIHNldChuZXdWYWx1ZSkge1xuICAgIC8vICAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgLy8gICAgICAgdGhpcy5pbWdzcmMgPSBuZXdWYWx1ZTtcbiAgICAvLyAgICAgICBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHRoaXMuc3JjLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgLy8gICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAvLyAgICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgLy8gICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgIC8vICAgICAgICAgICB0aGlzLnJvb3QuZW1pdCgncmVwYWludCcpO1xuICAgIC8vICAgICAgICAgfVxuICAgIC8vICAgICAgIH0pO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9LFxuICAgIC8vICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAvLyAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAvLyB9KTtcblxuICAgIHRoaXMuaW1nID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZywgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzcmMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gIH1cblxuICBzZXQgc3JjKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW1nID0gbnVsbDtcblxuICAgIHRoaXMuc3JjID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuaW1nIHx8ICF0aGlzLmltZz8uY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGlmIChzdHlsZS5ib3JkZXJDb2xvcikge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG5cbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgSW1hZ2UgZnJvbSAnLi9pbWFnZSc7XG5pbXBvcnQgVGV4dCBmcm9tICcuL3RleHQnO1xuaW1wb3J0IFNjcm9sbFZpZXcgZnJvbSAnLi9zY3JvbGx2aWV3JztcbmltcG9ydCBCaXRNYXBUZXh0IGZyb20gJy4vYml0bWFwdGV4dCc7XG5pbXBvcnQgQ2FudmFzIGZyb20gJy4vY2FudmFzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuXG5leHBvcnQge1xuICBFbGVtZW50LFxuICBWaWV3LFxuICBJbWFnZSxcbiAgVGV4dCxcbiAgU2Nyb2xsVmlldyxcbiAgQml0TWFwVGV4dCxcbiAgQ2FudmFzLFxufTtcbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXVuZGVyc2NvcmUtZGFuZ2xlICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IFZpZXcgZnJvbSAnLi92aWV3JztcbmltcG9ydCB7IGdldERwciwgY29weVRvdWNoQXJyYXkgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgeyBTY3JvbGxlciB9IGZyb20gJ3Njcm9sbGVyJztcbmltcG9ydCB7IGl0ZXJhdGVUcmVlIH0gZnJvbSAnLi4vY29tbW9uL3ZkJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzJztcblxuY29uc3QgZHByID0gZ2V0RHByKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMge1xuICBzdHlsZT86IElTdHlsZTtcbiAgaWROYW1lPzogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHNjcm9sbFg/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICBzY3JvbGxZPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5pbnRlcmZhY2UgSUlubmVyU2Nyb2xsZXJPcHRpb24ge1xuICBzY3JvbGxpbmdYPzogYm9vbGVhbjtcbiAgc2Nyb2xsaW5nWT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBzY3JvbGxUb3AgPSAwO1xuICBwdWJsaWMgc2Nyb2xsTGVmdCA9IDA7XG4gIHB1YmxpYyBoYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgcHVibGljIGN1cnJlbnRFdmVudCA9IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ1Njcm9sbFZpZXcnO1xuICBcbiAgcHJpdmF0ZSBzY3JvbGxZUHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbm5lclNjcm9sbGVyT3B0aW9uOiBJSW5uZXJTY3JvbGxlck9wdGlvbjtcblxuICBwcml2YXRlIHNjcm9sbGVyT2JqPzogU2Nyb2xsZXI7XG4gIHByaXZhdGUgaXNGaXJzdFNjcm9sbD86IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgc2Nyb2xsWCxcbiAgICBzY3JvbGxZLFxuICAgIGRhdGFzZXQsXG4gIH06IElTY3JvbGxWaWV3T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWROYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICAvLyBzY3JvbGx2aWV35Li656m655qE5oOF5Ya1XG4gICAgaWYgKCF0aGlzLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcblxuICAgIHJldHVybiBsYXN0LmxheW91dEJveC50b3AgKyBsYXN0LmxheW91dEJveC5oZWlnaHQ7XG4gIH1cblxuICBnZXQgc2Nyb2xsV2lkdGgoKSB7XG4gICAgLy8gc2Nyb2xsdmlld+S4uuepuueahOaDheWGtVxuICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICByZXR1cm4gbGFzdC5sYXlvdXRCb3gubGVmdCArIGxhc3QubGF5b3V0Qm94LndpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogdmFsdWUsXG4gICAgfTtcbiAgfVxuXG4gIGdldCBzY3JvbGxZKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWTtcbiAgfVxuXG4gIHNldCBzY3JvbGxZKHZhbHVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1k6IHZhbHVlLFxuICAgIH07XG4gIH1cblxuICBnZXQgc2Nyb2xsZXJPcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbjtcbiAgfVxuXG4gIHNldCBzY3JvbGxlck9wdGlvbih2YWx1ZTogSUlubmVyU2Nyb2xsZXJPcHRpb24pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiwgdmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsZXJPYmopIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5zY3JvbGxlck9iai5vcHRpb25zLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMuc2Nyb2xsUmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyB0aGlzLnRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290IS5vZmYoJ3RvdWNoZW5kJyk7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlclRyZWVXaXRoVG9wKHRyZWU6IEVsZW1lbnQpIHtcbiAgICB0cmVlLnJlbmRlcigpO1xuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgucmVjdChzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmNsaXAoKTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgYWJzb2x1dGVYLCBhYnNvbHV0ZVkgfSA9IGNoaWxkLmxheW91dEJveDtcblxuICAgICAgLy8g5Yik5pat5aSE5LqO5Y+v6KeG56qX5Y+j5YaF55qE5a2Q6IqC54K577yM6YCS5b2S5riy5p+T6K+l5a2Q6IqC54K5XG4gICAgICBpZiAoYWJzb2x1dGVZICsgaGVpZ2h0ID49IHN0YXJ0WSAmJiBhYnNvbHV0ZVkgPD0gZW5kWVxuICAgICAgICAmJiBhYnNvbHV0ZVggKyB3aWR0aCA+PSBzdGFydFggJiYgYWJzb2x1dGVYIDw9IGVuZFgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgc2Nyb2xsSGFuZGxlcihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgLy8g5Y+v6IO96KKr6ZSA5q+B5LqG5oiW6ICF6IqC54K55qCR6L+Y5rKh5YeG5aSH5aW9XG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkICYmICF0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcykge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6L+Z6YeM6KaB5oqK5rua5Yqo54q25oCB5L+d5a2Y6LW35p2l77yM5Zug5Li65ZyocmVmbG9355qE5pe25YCZ6ZyA6KaB5YGa6YeN572u77yM5riy5p+T5bm25LiN5L6d6LWW6L+Z5Lik5Liq5L+h5oGvXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IGxlZnQ7XG5cbiAgICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50RXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzY3JvbGwnLCB0aGlzLmN1cnJlbnRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGluc2VydChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY29udGV4dDtcblxuICAgIC8qKlxuICAgICAqIOi/memHjOacieS4qumdnuW4uOeJueauiueahOWFvOWuuemAu+i+ke+8jOWcqOS9jueJiOacrOayoeaciemHjeaehCBTY3JvbGxWaWV35LmL5YmN77yM5bm25rKh5pyJ5o+Q5L6b5Y2V54us55qEIFNjcm9sbFgg5ZKMIFNjcm9sbFkg5bGe5oCnXG4gICAgICog6ICM5piv5Yik5patIHNjcm9sbEhlaWh0IOWkp+S6juWuueWZqOmrmOW6pueahOaXtuWAmeiHquWKqOWunueOsOS6hue6teWQkea7muWKqO+8iOS4lOayoeacieaoquWQkea7muWKqOiDveWKm++8iVxuICAgICAqIOWboOatpOi/memHjOWBmuS4gOS4quWFvOWuuemAu+i+ke+8jOWmguaenCBzY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQg6Ieq5Yqo5byA5ZCv57q15ZCR5rua5YqoXG4gICAgICovXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICYmIHR5cGVvZiB0aGlzLnNjcm9sbFlQcm9wID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbG93IOS5i+WQju+8jOS8muS7jiBjc3NsYXlvdXQg5ZCM5q2l5biD5bGA5L+h5oGv77yM5Y6f5YWI55qE5rua5Yqo5L+h5oGv5Lya5Lii5aSx77yM6L+Z6YeM6ZyA6KaB5LiA5Liq5aSN5L2N55qE5pON5L2cXG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0aGlzLnNjcm9sbFRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSB0aGlzLnNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IHRydWU7XG5cbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmouc2V0RGltZW5zaW9ucyh0aGlzLmxheW91dEJveC53aWR0aCwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodCk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hNb3ZlKHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG5dO1xuXG5jb25zdCBhbGxTdHlsZXMgPSByZWZsb3dBZmZlY3RlZFN0eWxlcy5jb25jYXQocmVwYWludEFmZmVjdGVkU3R5bGVzKTtcblxuaW50ZXJmYWNlIElTdHlsZSB7XG4gIC8vIHJlZmxvd0FmZmVjdGVkU3R5bGVzXG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIG1pbldpZHRoPzogbnVtYmVyO1xuICBtaW5IZWlnaHQ/OiBudW1iZXI7XG4gIG1heFdpZHRoPzogbnVtYmVyO1xuICBtYXhIZWlnaHQ/OiBudW1iZXI7XG4gIGxlZnQ/OiBudW1iZXI7XG4gIHJpZ2h0PzogbnVtYmVyO1xuICB0b3A/OiBudW1iZXI7XG4gIGJvdHRvbT86IG51bWJlcjtcbiAgbWFyZ2luPzogbnVtYmVyO1xuICBtYXJnaW5MZWZ0PzogbnVtYmVyO1xuICBtYXJnaW5SaWdodD86IG51bWJlcjtcbiAgbWFyZ2luVG9wPzogbnVtYmVyO1xuICBtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmdMZWZ0PzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XG4gIHBhZGRpbmdCb3R0b20/OiBudW1iZXI7XG4gIGJvcmRlcldpZHRoPzogbnVtYmVyO1xuICBib3JkZXJMZWZ0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclJpZ2h0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclRvcFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21XaWR0aD86IG51bWJlcjtcblxuICBib3JkZXJUb3BMZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJUb3BSaWdodFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM/OiBudW1iZXI7XG5cbiAgZmxleERpcmVjdGlvbj86ICdjb2x1bW4nIHwgJ3Jvdyc7XG4gIGZsZXhTaHJpbms/OiBudW1iZXI7XG4gIGZsZXhHcm93PzogbnVtYmVyO1xuICBmbGV4V3JhcD86ICd3cmFwJyB8ICdub3dyYXAnO1xuICBqdXN0aWZ5Q29udGVudD86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzcGFjZS1iZXR3ZWVuJyB8ICdzcGFjZS1hcm91bmQnO1xuICBhbGlnbkl0ZW1zPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBhbGlnblNlbGY/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIHBvc2l0aW9uPzogJ3JlbGF0aXZlJyB8ICdhYnNvbHV0ZSc7XG5cbiAgLy8gcmVwYWludEFmZmVjdGVkU3R5bGVzXG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBsaW5lSGVpZ2h0PzogbnVtYmVyIHwgJ3N0cmluZyc7XG4gIHRleHRBbGlnbj86ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbiAgdmVydGljYWxBbGlnbj86ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgdGV4dE92ZXJmbG93PzogJ2VsbGlwc2lzJyB8ICdjbGlwJztcbiAgbGV0dGVyU3BhY2luZz86IG51bWJlcjtcbiAgYm9yZGVyUmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyVG9wQ29sb3I/OiBzdHJpbmc7XG5cbiAgYmFja2dyb3VuZEltYWdlPzogc3RyaW5nO1xuICBib3JkZXJCb3R0b21Db2xvcj86IHN0cmluZztcbiAgYm9yZGVyTGVmdENvbG9yPzogc3RyaW5nO1xuICBib3JkZXJSaWdodENvbG9yPzogc3RyaW5nO1xuXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIGFsbFN0eWxlcywgSVN0eWxlIH07XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZUNhbnZhcyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnUGluZ0ZhbmdTQy1SZWd1bGFyLCBzYW5zLXNlcmlmJztcbmxldCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcblxuY29uc3QgZ2V0Q29udGV4dCA9ICgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPT4ge1xuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gY3JlYXRlQ2FudmFzKCk7XG4gIGNhbnZhcy53aWR0aCA9IDE7XG4gIGNhbnZhcy5oZWlnaHQgPSAxO1xuICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmludGVyZmFjZSBJVGV4dFByb3BzIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgdmFsdWVzcmMgPSAnJztcbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZVdpZHRoOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcbiAgcHVibGljIHRleHRCYXNlbGluZTogQ2FudmFzVGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gIHB1YmxpYyBmb250ID0gJyc7XG4gIHB1YmxpYyB0ZXh0QWxpZ246IENhbnZhc1RleHRBbGlnbiA9ICdsZWZ0JztcbiAgcHVibGljIGZpbGxTdHlsZSA9ICcjMDAwMDAwJztcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICB2YWx1ZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElUZXh0UHJvcHMpIHtcbiAgICBsZXQgb3JpZ2luU3R5bGVXaWR0aCA9IHN0eWxlLndpZHRoO1xuICAgIC8vIOayoeacieiuvue9ruWuveW6pueahOaXtuWAmemAmui/h2NhbnZhc+iuoeeul+WHuuaWh+Wtl+WuveW6plxuICAgIGlmIChvcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VUZXh0KHN0eWxlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1RleHQnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG4gICAgdGhpcy5vcmlnaW5TdHlsZVdpZHRoID0gb3JpZ2luU3R5bGVXaWR0aDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgaWYgKHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgICBuZXdWYWx1ZSA9IHBhcnNlVGV4dCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIGxldCB7IHBhcmVudCB9ID0gdGhpcztcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvQ2FudmFzRGF0YSgpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG5cbiAgICB0aGlzLmZvbnRTaXplID0gc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB0aGlzLmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICcnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7REVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuICAgIHRoaXMudGV4dEFsaWduID0gc3R5bGUudGV4dEFsaWduIHx8ICdsZWZ0JztcbiAgICB0aGlzLmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yIHx8ICcjMDAwJztcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy50b0NhbnZhc0RhdGEoKTtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICAvLyB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IHRoaXMudGV4dEJhc2VsaW5lO1xuICAgIGN0eC5mb250ID0gdGhpcy5mb250O1xuICAgIGN0eC50ZXh0QWxpZ24gPSB0aGlzLnRleHRBbGlnbjtcblxuICAgIGxldCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgbGV0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuXG4gICAgaWYgKHRoaXMudGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgZHJhd1ggKz0gYm94LndpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICBkcmF3WCArPSBib3gud2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIGN0eC5maWxsVGV4dChcbiAgICAgIHRoaXMudmFsdWUsXG4gICAgICBkcmF3WCxcbiAgICAgIGRyYXdZLFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5cbmludGVyZmFjZSBJVmlld09wdGlvbnMge1xuICBzdHlsZT86IElTdHlsZTtcbiAgaWROYW1lPzogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGRhdGFzZXQ/OiBJRGF0YXNldDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVmlldyc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICAvLyDmnInkupvoioLngrnku4Xku4XkvZzkuLrlrrnlmajvvIzlrp7pmYXkuIrkuI3pnIDopoHku7vkvZXmuLLmn5PpgLvovpHvvIzov5nph4zliqDkuKrliKTmlq3lj6/ku6Xmj5Dpq5jmgKfog71cbiAgY2hlY2tOZWVkUmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yIH0gPSBzdHlsZTtcblxuICAgIHJldHVybiAhIShzdHlsZS5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJXaWR0aCAmJiBib3JkZXJDb2xvcilcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJUb3BXaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyVG9wQ29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJCb3R0b21Db2xvcikpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyTGVmdFdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJMZWZ0Q29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlclJpZ2h0V2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlclJpZ2h0Q29sb3IpKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIC8vIGNvbnN0IHsgY3R4IH0gPSB0aGlzO1xuXG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IGJvcmRlcldpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgYm9yZGVyTGVmdFdpZHRoID0gc3R5bGUuYm9yZGVyTGVmdFdpZHRoIHx8IGJvcmRlcldpZHRoO1xuICAgIGNvbnN0IGJvcmRlclJpZ2h0V2lkdGggPSBzdHlsZS5ib3JkZXJSaWdodFdpZHRoIHx8IGJvcmRlcldpZHRoO1xuICAgIGNvbnN0IGJvcmRlclRvcFdpZHRoID0gc3R5bGUuYm9yZGVyVG9wV2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyQm90dG9tV2lkdGggPSBzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCB8fCBib3JkZXJXaWR0aDtcblxuICAgIC8vIHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICBkcmF3WCArIGJvcmRlckxlZnRXaWR0aCxcbiAgICAgICAgZHJhd1kgKyBib3JkZXJSaWdodFdpZHRoLFxuICAgICAgICBib3gud2lkdGggLSAoYm9yZGVyTGVmdFdpZHRoICsgYm9yZGVyUmlnaHRXaWR0aCksXG4gICAgICAgIGJveC5oZWlnaHQgLSAoYm9yZGVyVG9wV2lkdGggKyBib3JkZXJCb3R0b21XaWR0aCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cbiIsImlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgR2FtZUdsb2JhbC5fX2VudiA9IEdhbWVHbG9iYWwud3ggfHwgR2FtZUdsb2JhbC50dCB8fCBHYW1lR2xvYmFsLnN3YW47XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgY29udmVydFRvSnNvbiA9IGZ1bmN0aW9uKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgak9iaiA9IHtcbiAgICBuYW1lOiBub2RlLnRhZ25hbWVcbiAgfTtcblxuICAvL3doZW4gbm8gY2hpbGQgbm9kZSBvciBhdHRyIGlzIHByZXNlbnRcbiAgaWYgKCghbm9kZS5jaGlsZCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5jaGlsZCkpICYmICghbm9kZS5hdHRyc01hcCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5hdHRyc01hcCkpKSB7XG4gICAgcmV0dXJuIHV0aWwuaXNFeGlzdChub2RlLnZhbCkgJiYgISFub2RlLnZhbCA/IG5vZGUudmFsIDogak9iajtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSBjcmVhdGUgYSB0ZXh0bm9kZSBpZiBub2RlIGhhcyBzb21lIHRleHRcbiAgICBpZiAodXRpbC5pc0V4aXN0KG5vZGUudmFsKSkge1xuICAgICAgaWYgKCEodHlwZW9mIG5vZGUudmFsID09PSAnc3RyaW5nJyAmJiAobm9kZS52YWwgPT09ICcnIHx8IG5vZGUudmFsID09PSBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyKSkpIHtcbiAgICAgICAgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IFwic3RyaWN0XCIpe1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gWyBub2RlLnZhbCBdO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IG5vZGUudmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICB1dGlsLm1lcmdlKGpPYmosIG5vZGUuYXR0cnNNYXAsIG9wdGlvbnMuYXJyYXlNb2RlKTtcblxuICBqT2JqLmNoaWxkcmVuID0gW107XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCggY2hpbGQgPT4ge1xuICAgIGpPYmouY2hpbGRyZW4ucHVzaChjb252ZXJ0VG9Kc29uKGNoaWxkLCBvcHRpb25zKSlcbiAgfSk7XG5cbiAgLy8gY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGQpO1xuICAvLyBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgLy8gICB2YXIgdGFnbmFtZSA9IGtleXNbaW5kZXhdO1xuICAvLyAgIGlmIChub2RlLmNoaWxkW3RhZ25hbWVdICYmIG5vZGUuY2hpbGRbdGFnbmFtZV0ubGVuZ3RoID4gMSkge1xuICAvLyAgICAgak9ialt0YWduYW1lXSA9IFtdO1xuICAvLyAgICAgZm9yICh2YXIgdGFnIGluIG5vZGUuY2hpbGRbdGFnbmFtZV0pIHtcbiAgLy8gICAgICAgak9ialt0YWduYW1lXS5wdXNoKGNvbnZlcnRUb0pzb24obm9kZS5jaGlsZFt0YWduYW1lXVt0YWddLCBvcHRpb25zKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSB0cnVlKXtcbiAgLy8gICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdWzBdLCBvcHRpb25zKVxuICAvLyAgICAgICBpZih0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JylcbiAgLy8gICAgICAgICBqT2JqW3RhZ25hbWVdID0gWyByZXN1bHQgXTtcbiAgLy8gICAgICAgZWxzZVxuICAvLyAgICAgICAgIGpPYmpbdGFnbmFtZV0gPSByZXN1bHQ7XG4gIC8vICAgICB9ZWxzZSBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gIC8vICAgICAgIGpPYmpbdGFnbmFtZV0gPSBbY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdWzBdLCBvcHRpb25zKSBdO1xuICAvLyAgICAgfWVsc2V7XG4gIC8vICAgICAgIGpPYmpbdGFnbmFtZV0gPSBjb252ZXJ0VG9Kc29uKG5vZGUuY2hpbGRbdGFnbmFtZV1bMF0sIG9wdGlvbnMpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vYWRkIHZhbHVlXG4gIHJldHVybiBqT2JqO1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9Kc29uID0gY29udmVydFRvSnNvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgbm9kZVRvSnNvbiA9IHJlcXVpcmUoJy4vbm9kZTJqc29uJyk7XG5jb25zdCB4bWxUb05vZGVvYmogPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCB4MnhtbG5vZGUgPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucywgdmFsaWRhdGlvbk9wdGlvbikge1xuICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICBpZih2YWxpZGF0aW9uT3B0aW9uID09PSB0cnVlKSB2YWxpZGF0aW9uT3B0aW9uID0ge31cblxuICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUoeG1sRGF0YSwgdmFsaWRhdGlvbk9wdGlvbik7XG4gICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICB0aHJvdyBFcnJvciggcmVzdWx0LmVyci5tc2cpXG4gICAgIH1cbiAgIH1cbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCB4MnhtbG5vZGUuZGVmYXVsdE9wdGlvbnMsIHgyeG1sbm9kZS5wcm9wcyk7XG4gIHJldHVybiBub2RlVG9Kc29uLmNvbnZlcnRUb0pzb24oeG1sVG9Ob2Rlb2JqLmdldFRyYXZlcnNhbE9iaih4bWxEYXRhLCBvcHRpb25zKSwgb3B0aW9ucyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxtYXRjaGVzID0gW107XG4gICAgY29uc3QgbGVuID0gbWF0Y2gubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIGFsbG1hdGNoZXMucHVzaChtYXRjaFtpbmRleF0pO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goYWxsbWF0Y2hlcyk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5jb25zdCBkb2VzTWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmNvbnN0IGRvZXNOb3RNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuICFkb2VzTWF0Y2goc3RyaW5nLCByZWdleCk7XG59O1xuXG5leHBvcnRzLmlzRXhpc3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBDb3B5IGFsbCB0aGUgcHJvcGVydGllcyBvZiBhIGludG8gYi5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0XG4gKiBAcGFyYW0geyp9IGFcbiAqL1xuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgYSwgYXJyYXlNb2RlKSB7XG4gIGlmIChhKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGEpOyAvLyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBvd24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYoYXJyYXlNb2RlID09PSAnc3RyaWN0Jyl7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IFsgYVtrZXlzW2ldXSBdO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IGFba2V5c1tpXV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuLyogZXhwb3J0cy5tZXJnZSA9ZnVuY3Rpb24gKGIsYSl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGIsYSk7XG59ICovXG5cbmV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbih2KSB7XG4gIGlmIChleHBvcnRzLmlzRXhpc3QodikpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8vIGNvbnN0IGZha2VDYWxsID0gZnVuY3Rpb24oYSkge3JldHVybiBhO307XG4vLyBjb25zdCBmYWtlQ2FsbE5vUmV0dXJuID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpIHtcbiAgdmFyIG5ld09wdGlvbnMgPSB7fTtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRpb25zOyAvL2lmIHRoZXJlIGFyZSBub3Qgb3B0aW9uc1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IG9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59O1xuXG5leHBvcnRzLmRvZXNNYXRjaCA9IGRvZXNNYXRjaDtcbmV4cG9ydHMuZG9lc05vdE1hdGNoID0gZG9lc05vdE1hdGNoO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICBsb2NhbGVSYW5nZTogJ2EtekEtWicsXG59O1xuXG5jb25zdCBwcm9wcyA9IFsnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsICdsb2NhbGVSYW5nZSddO1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHV0aWwuYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuXG4gIGNvbnN0IHRhZ3MgPSBbXTtcbiAgbGV0IHRhZ0ZvdW5kID0gZmFsc2U7XG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIGNvbnN0IHJlZ3hBdHRyTmFtZSA9IG5ldyBSZWdFeHAoJ15bX3ddW1xcXFx3XFxcXC0uOl0qJCcucmVwbGFjZSgnX3cnLCAnXycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGNvbnN0IHJlZ3hUYWdOYW1lID0gbmV3IFJlZ0V4cCgnXihbd118XylbXFxcXHcuXFxcXC1fOl0qJy5yZXBsYWNlKCcoW3cnLCAnKFsnICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAvL3N0YXJ0aW5nIG9mIHRhZ1xuICAgICAgLy9yZWFkIHVudGlsIHlvdSByZWFjaCB0byAnPicgYXZvaWRpbmcgYW55ICc+JyBpbiBhdHRyaWJ1dGUgdmFsdWVcblxuICAgICAgaSsrO1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc/Jykge1xuICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgIGlmIChpLmVycikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIDtcbiAgICAgICAgICBpIDwgeG1sRGF0YS5sZW5ndGggJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnPicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnICcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFx0JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXG4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xccic7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIHRhZ05hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50cmltKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGFnTmFtZSk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYXR0cmlidXRlc1xuICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cmluZygwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGVUYWdOYW1lKHRhZ05hbWUsIHJlZ3hUYWdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdUYWcgJyArIHRhZ05hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnQXR0cmlidXRlcyBmb3IgXCInICsgdGFnTmFtZSArICdcIiBoYXZlIG9wZW4gcXVvdGUuJ319O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyU3RyID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICAgIGlmIChhdHRyU3RyW2F0dHJTdHIubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGF0dHJTdHIgPSBhdHRyU3RyLnN1YnN0cmluZygwLCBhdHRyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsb3NpbmdUYWcpIHtcbiAgICAgICAgICBpZighcmVzdWx0LnRhZ0Nsb3NlZCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgZG9uJ3QgaGF2ZSBwcm9wZXIgY2xvc2luZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1lbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgY2FuJ3QgaGF2ZSBhdHRyaWJ1dGVzIG9yIGludmFsaWQgc3RhcnRpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3RnID0gdGFncy5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSBvdGcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnICcgKyBvdGcgKyAnIGlzIGV4cGVjdGVkIGlucGxhY2Ugb2YgJyArIHRhZ05hbWUgKyAnLid9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3MucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NraXAgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgLy9JdCBtYXkgaW5jbHVkZSBjb21tZW50cyBhbmQgQ0RBVEEgdmFsdWVcbiAgICAgICAgZm9yIChpKys7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaSArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgLy9jb21tZW50IG9yIENBREFUQVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcgJyB8fCB4bWxEYXRhW2ldID09PSAnXFx0JyB8fCB4bWxEYXRhW2ldID09PSAnXFxuJyB8fCB4bWxEYXRhW2ldID09PSAnXFxyJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRDaGFyJywgbXNnOiAnY2hhciAnICsgeG1sRGF0YVtpXSArICcgaXMgbm90IGV4cGVjdGVkIC4nfX07XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdTdGFydCB0YWcgZXhwZWN0ZWQuJ319O1xuICB9IGVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ0ludmFsaWQgJyArIEpTT04uc3RyaW5naWZ5KHRhZ3MsIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpICsgJyBmb3VuZC4nfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlYWQgUHJvY2Vzc2luZyBpbnNzdHJ1Y3Rpb25zIGFuZCBza2lwXG4gKiBAcGFyYW0geyp9IHhtbERhdGFcbiAqIEBwYXJhbSB7Kn0gaVxuICovXG5mdW5jdGlvbiByZWFkUEkoeG1sRGF0YSwgaSkge1xuICB2YXIgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgdmFyIHRhZ25hbWUgPSB4bWxEYXRhLnN1YnN0cihzdGFydCwgaSAtIHN0YXJ0KTtcbiAgICAgIGlmIChpID4gNSAmJiB0YWduYW1lID09PSAneG1sJykge1xuICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnWE1MIGRlY2xhcmF0aW9uIGFsbG93ZWQgb25seSBhdCB0aGUgc3RhcnQgb2YgdGhlIGRvY3VtZW50Lid9fTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG52YXIgZG91YmxlUXVvdGUgPSAnXCInO1xudmFyIHNpbmdsZVF1b3RlID0gXCInXCI7XG5cbi8qKlxuICogS2VlcCByZWFkaW5nIHhtbERhdGEgdW50aWwgJzwnIGlzIGZvdW5kIG91dHNpZGUgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5mdW5jdGlvbiByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpIHtcbiAgbGV0IGF0dHJTdHIgPSAnJztcbiAgbGV0IHN0YXJ0Q2hhciA9ICcnO1xuICBsZXQgdGFnQ2xvc2VkID0gZmFsc2U7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSBkb3VibGVRdW90ZSB8fCB4bWxEYXRhW2ldID09PSBzaW5nbGVRdW90ZSkge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgc3RhcnRDaGFyID0geG1sRGF0YVtpXTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnRDaGFyICE9PSB4bWxEYXRhW2ldKSB7XG4gICAgICAgIC8vaWYgdmF1ZSBpcyBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZSB0aGVuIHNpbmdsZSBxdW90ZXMgYXJlIGFsbG93ZWQgaW5zaWRlIHRoZSB2YWx1ZSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHt2YWx1ZTogYXR0clN0ciwgaW5kZXg6IGksIHRhZ0Nsb3NlZDogdGFnQ2xvc2VkfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgYWxsIHRoZSBhdHRyaWJ1dGVzIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZC5cbiAqL1xuY29uc3QgdmFsaWRBdHRyU3RyUmVneHAgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKShbXlxcXFxzPV0rKShcXFxccyo9KT8oXFxcXHMqKFtcXCdcIl0pKChbXFxcXHNcXFxcU10pKj8pXFxcXDUpPycsICdnJyk7XG5cbi8vYXR0ciwgPVwic2RcIiwgYT1cImFtaXQnc1wiLCBhPVwic2RcImI9XCJzYWZcIiwgYWIgIGNkPVwiXCJcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vY29uc29sZS5sb2cobWF0Y2hlc1tpXSk7XG5cbiAgICBpZiAobWF0Y2hlc1tpXVsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vbm9zcGFjZSBiZWZvcmUgYXR0cmlidXRlIG5hbWU6IGE9XCJzZFwiYj1cInNhZlwiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLid9fTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gPT09IHVuZGVmaW5lZCAmJiAhb3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAvL2luZGVwZW5kZW50IGF0dHJpYnV0ZTogYWJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYm9vbGVhbiBhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGlzIG5vdCBhbGxvd2VkLid9fTtcbiAgICB9XG4gICAgLyogZWxzZSBpZihtYXRjaGVzW2ldWzZdID09PSB1bmRlZmluZWQpey8vYXR0cmlidXRlIHdpdGhvdXQgdmFsdWU6IGFiPVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IHsgY29kZTpcIkludmFsaWRBdHRyXCIsbXNnOlwiYXR0cmlidXRlIFwiICsgbWF0Y2hlc1tpXVsyXSArIFwiIGhhcyBubyB2YWx1ZSBhc3NpZ25lZC5cIn19O1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICBjb25zdCBhdHRyTmFtZSA9IG1hdGNoZXNbaV1bMl07XG4gICAgaWYgKCF2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpKSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgfVxuICAgIC8qaWYgKCFhdHRyTmFtZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7Ki9cbiAgICBpZiAoICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck5hbWVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyByZXBlYXRlZC4nfX07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gL15bX2EtekEtWl1bXFx3XFwtLjpdKiQvO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpIHtcbiAgLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSBuZXcgUmVnRXhwKHJlZ3hBdHRyTmFtZSk7XG4gIHJldHVybiB1dGlsLmRvZXNNYXRjaChhdHRyTmFtZSwgcmVneEF0dHJOYW1lKTtcbn1cblxuLy9jb25zdCBzdGFydHNXaXRoWE1MID0gbmV3IFJlZ0V4cChcIl5bWHhdW01tXVtMbF1cIik7XG4vLyAgc3RhcnRzV2l0aCA9IC9eKFthLXpBLVpdfF8pW1xcdy5cXC1fOl0qLztcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKSB7XG4gIC8qaWYodXRpbC5kb2VzTWF0Y2godGFnbmFtZSxzdGFydHNXaXRoWE1MKSkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UqL1xuICByZXR1cm4gIXV0aWwuZG9lc05vdE1hdGNoKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YWduYW1lLCBwYXJlbnQsIHZhbCkge1xuICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5jaGlsZCA9IHt9OyAvL2NoaWxkIHRhZ3NcbiAgdGhpcy5hdHRyc01hcCA9IHt9OyAvL2F0dHJpYnV0ZXMgbWFwXG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy52YWwgPSB2YWw7IC8vdGV4dCBvbmx5XG4gIHRoaXMuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSkpIHtcbiAgICAgIC8vYWxyZWFkeSBwcmVzZW50c1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXS5wdXNoKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSA9IFtjaGlsZF07XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgeG1sTm9kZSA9IHJlcXVpcmUoJy4veG1sTm9kZScpO1xuY29uc3QgVGFnVHlwZSA9IHtPUEVOSU5HOiAxLCBDTE9TSU5HOiAyLCBTRUxGOiAzLCBDREFUQTogNH07XG5sZXQgcmVneCA9XG4gICc8KCghXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KShdXT4pKXwoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpKFtePl0qKT58KChcXFxcLykoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpXFxcXHMqPikpKFtePF0qKSc7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbi8vcG9seWZpbGxcbmlmICghTnVtYmVyLnBhcnNlSW50ICYmIHdpbmRvdy5wYXJzZUludCkge1xuICBOdW1iZXIucGFyc2VJbnQgPSB3aW5kb3cucGFyc2VJbnQ7XG59XG5pZiAoIU51bWJlci5wYXJzZUZsb2F0ICYmIHdpbmRvdy5wYXJzZUZsb2F0KSB7XG4gIE51bWJlci5wYXJzZUZsb2F0ID0gd2luZG93LnBhcnNlRmxvYXQ7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnQF8nLFxuICBhdHRyTm9kZU5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGlnbm9yZU5hbWVTcGFjZTogZmFsc2UsXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZU5vZGVWYWx1ZTogdHJ1ZSxcbiAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gIGFycmF5TW9kZTogZmFsc2UsXG4gIHRyaW1WYWx1ZXM6IHRydWUsIC8vVHJpbSBzdHJpbmcgdmFsdWVzIG9mIHRhZyBhbmQgYXR0cmlidXRlc1xuICBjZGF0YVRhZ05hbWU6IGZhbHNlLFxuICBjZGF0YVBvc2l0aW9uQ2hhcjogJ1xcXFxjJyxcbiAgbG9jYWxlUmFuZ2U6ICcnLFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgc3RvcE5vZGVzOiBbXVxuICAvL2RlY29kZVN0cmljdDogZmFsc2UsXG59O1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmNvbnN0IHByb3BzID0gW1xuICAnYXR0cmlidXRlTmFtZVByZWZpeCcsXG4gICdhdHRyTm9kZU5hbWUnLFxuICAndGV4dE5vZGVOYW1lJyxcbiAgJ2lnbm9yZUF0dHJpYnV0ZXMnLFxuICAnaWdub3JlTmFtZVNwYWNlJyxcbiAgJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLFxuICAncGFyc2VOb2RlVmFsdWUnLFxuICAncGFyc2VBdHRyaWJ1dGVWYWx1ZScsXG4gICdhcnJheU1vZGUnLFxuICAndHJpbVZhbHVlcycsXG4gICdjZGF0YVRhZ05hbWUnLFxuICAnY2RhdGFQb3NpdGlvbkNoYXInLFxuICAnbG9jYWxlUmFuZ2UnLFxuICAndGFnVmFsdWVQcm9jZXNzb3InLFxuICAnYXR0clZhbHVlUHJvY2Vzc29yJyxcbiAgJ3BhcnNlVHJ1ZU51bWJlck9ubHknLFxuICAnc3RvcE5vZGVzJ1xuXTtcbmV4cG9ydHMucHJvcHMgPSBwcm9wcztcblxuY29uc3QgZ2V0VHJhdmVyc2FsT2JqID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvXFxyP1xcbi9nLCBcIiBcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIHhtbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLzwhLS1bXFxzXFxTXSo/LS0+L2csICcnKTsgLy9SZW1vdmUgIGNvbW1lbnRzXG5cbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuXG4gIHJlZ3ggPSByZWd4LnJlcGxhY2UoL1xcW1xcXFx3L2csICdbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UgKyAnXFxcXHcnKTtcbiAgY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKHJlZ3gsICdnJyk7XG4gIGxldCB0YWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICBsZXQgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIHdoaWxlICh0YWcpIHtcbiAgICBjb25zdCB0YWdUeXBlID0gY2hlY2tGb3JUYWdUeXBlKHRhZyk7XG5cbiAgICBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DTE9TSU5HKSB7XG4gICAgICAvL2FkZCBwYXJzZWQgZGF0YSB0byBwYXJlbnQgbm9kZVxuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudCAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnBhcmVudC52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnBhcmVudC52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zLCBjdXJyZW50Tm9kZS5wYXJlbnQudGFnbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGN1cnJlbnROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmNoaWxkID0gW11cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmF0dHJzTWFwID09IHVuZGVmaW5lZCkgeyBjdXJyZW50Tm9kZS5hdHRyc01hcCA9IHt9fVxuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB4bWxEYXRhLnN1YnN0cihjdXJyZW50Tm9kZS5zdGFydEluZGV4ICsgMSwgdGFnLmluZGV4IC0gY3VycmVudE5vZGUuc3RhcnRJbmRleCAtIDEpXG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0RBVEEpIHtcbiAgICAgIGlmIChvcHRpb25zLmNkYXRhVGFnTmFtZSkge1xuICAgICAgICAvL2FkZCBjZGF0YSBub2RlXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuY2RhdGFUYWdOYW1lLCBjdXJyZW50Tm9kZSwgdGFnWzNdKTtcbiAgICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIC8vZm9yIGJhY2t0cmFja2luZ1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyO1xuICAgICAgICAvL2FkZCByZXN0IHZhbHVlIHRvIHBhcmVudCBub2RlXG4gICAgICAgIGlmICh0YWdbMTRdKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUudmFsICs9IHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSAoY3VycmVudE5vZGUudmFsIHx8ICcnKSArICh0YWdbM10gfHwgJycpICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLlNFTEYpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLCBjdXJyZW50Tm9kZSwgJycpO1xuICAgICAgaWYgKHRhZ1s4XSAmJiB0YWdbOF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdbOF0gPSB0YWdbOF0uc3Vic3RyKDAsIHRhZ1s4XS5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UYWdUeXBlLk9QRU5JTkdcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKFxuICAgICAgICBvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpXG4gICAgICApO1xuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjaGlsZE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY2hpbGROb2RlLnN0YXJ0SW5kZXg9dGFnLmluZGV4ICsgdGFnWzFdLmxlbmd0aFxuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjaGlsZE5vZGU7XG4gICAgfVxuXG4gICAgdGFnID0gbmV4dFRhZztcbiAgICBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgfVxuXG4gIHJldHVybiB4bWxPYmo7XG59O1xuXG5mdW5jdGlvbiBwcm9jZXNzVGFnVmFsdWUocGFyc2VkVGFncywgb3B0aW9ucywgcGFyZW50VGFnTmFtZSkge1xuICBjb25zdCB0YWdOYW1lID0gcGFyc2VkVGFnc1s3XSB8fCBwYXJlbnRUYWdOYW1lO1xuICBsZXQgdmFsID0gcGFyc2VkVGFnc1sxNF07XG4gIGlmICh2YWwpIHtcbiAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgIH1cbiAgICB2YWwgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHZhbCwgdGFnTmFtZSk7XG4gICAgdmFsID0gcGFyc2VWYWx1ZSh2YWwsIG9wdGlvbnMucGFyc2VOb2RlVmFsdWUsIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seSk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclRhZ1R5cGUobWF0Y2gpIHtcbiAgaWYgKG1hdGNoWzRdID09PSAnXV0+Jykge1xuICAgIHJldHVybiBUYWdUeXBlLkNEQVRBO1xuICB9IGVsc2UgaWYgKG1hdGNoWzEwXSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0xPU0lORztcbiAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbOF0gIT09ICd1bmRlZmluZWQnICYmIG1hdGNoWzhdLnN1YnN0cihtYXRjaFs4XS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuU0VMRjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVGFnVHlwZS5PUEVOSU5HO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYW1lU3BhY2UodGFnbmFtZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGxldCBwYXJzZWQ7XG4gICAgaWYgKHZhbC50cmltKCkgPT09ICcnIHx8IGlzTmFOKHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IHZhbCA9PT0gJ3RydWUnID8gdHJ1ZSA6IHZhbCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsLmluZGV4T2YoJzB4JykgIT09IC0xKSB7XG4gICAgICAgIC8vc3VwcG9ydCBoZXhhIGRlY2ltYWxcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTYpO1xuICAgICAgfSBlbHNlIGlmICh2YWwuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgICAgICAgcGFyc2VkID0gU3RyaW5nKHBhcnNlZCkgPT09IHZhbCA/IHBhcnNlZCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKC4qPylcXFxcMyk/JywgJ2cnKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMgJiYgdHlwZW9mIGF0dHJTdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgYXR0clN0ciA9IGF0dHJTdHIucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIC8vYXR0clN0ciA9IGF0dHJTdHIgfHwgYXR0clN0ci50cmltKCk7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIGF0dHJzUmVneCk7XG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gcmVzb2x2ZU5hbWVTcGFjZShtYXRjaGVzW2ldWzFdLCBvcHRpb25zKTtcbiAgICAgIGlmIChhdHRyTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1hdGNoZXNbaV1bNF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBtYXRjaGVzW2ldWzRdLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG9wdGlvbnMuYXR0clZhbHVlUHJvY2Vzc29yKG1hdGNoZXNbaV1bNF0sIGF0dHJOYW1lKTtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSBwYXJzZVZhbHVlKFxuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXR0ck5vZGVOYW1lKSB7XG4gICAgICBjb25zdCBhdHRyQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgYXR0ckNvbGxlY3Rpb25bb3B0aW9ucy5hdHRyTm9kZU5hbWVdID0gYXR0cnM7XG4gICAgICByZXR1cm4gYXR0ckNvbGxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxufVxuXG5leHBvcnRzLmdldFRyYXZlcnNhbE9iaiA9IGdldFRyYXZlcnNhbE9iajtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50LCBDYWxsYmFjayB9IGZyb20gJy4vdHlwZXMvaW5kZXgnO1xuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmV4cG9ydCBjb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuY29uc3QgaW1nUG9vbCA9IG5ldyBQb29sKCdpbWdQb29sJyk7XG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2woJ2JpdE1hcFBvb2wnKTtcbmNvbnN0IGRlYnVnSW5mbyA9IG5ldyBEZWJ1Z0luZm8oKTtcblxuaW50ZXJmYWNlIElWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVZpZXdQb3J0Qm94IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVyRGF0YSB7XG4gIHRvdWNoTXNnOiB7XG4gICAgW2tleTogc3RyaW5nXTogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgfTtcbiAgaGFuZGxlcnM6IHtcbiAgICB0b3VjaFN0YXJ0OiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoTW92ZTogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaEVuZDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaENhbmNlbDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIElQbHVnaW48VD4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGluc3RhbGw6IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xuICB1bmluc3RhbGw/OiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbn1cblxuY2xhc3MgTGF5b3V0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyB2ZXJzaW9uID0gJzEuMC4yJztcbiAgcHVibGljIGhhc0V2ZW50SGFuZGxlciA9IGZhbHNlO1xuICBwdWJsaWMgcmVuZGVyQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZW5kZXJwb3J0OiBJVmlld1BvcnQgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnQ6IElWaWV3UG9ydEJveCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnRTY2FsZSA9IDE7XG4gIHB1YmxpYyBoYXNWaWV3UG9ydFNldCA9IGZhbHNlO1xuICBwdWJsaWMgcmVhbExheW91dEJveDoge1xuICAgIHJlYWxYOiBudW1iZXI7XG4gICAgcmVhbFk6IG51bWJlcjtcbiAgfSA9IHtcbiAgICAgIHJlYWxYOiAwLFxuICAgICAgcmVhbFk6IDAsXG4gICAgfTtcblxuICBwdWJsaWMgYml0TWFwRm9udHM6IEJpdE1hcEZvbnRbXSA9IFtdO1xuICBwdWJsaWMgZWxlQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhdGU6IFNUQVRFID0gU1RBVEUuVU5JTklUO1xuICBwdWJsaWMgaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICBwdWJsaWMgdGlja2VyOiBUaWNrZXIgPSBuZXcgVGlja2VyKCk7XG4gIHB1YmxpYyB0aWNrZXJGdW5jID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmlzRGlydHkpIHtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTmVlZFJlcGFpbnQpIHtcbiAgICAgIHRoaXMucmVwYWludCgpO1xuICAgIH1cbiAgfTtcblxuICBwcml2YXRlIGV2ZW50SGFuZGxlckRhdGE6IEV2ZW50SGFuZGxlckRhdGE7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlLFxuICB9OiB7XG4gICAgc3R5bGU/OiBJU3R5bGU7XG4gICAgbmFtZT86IHN0cmluZztcbiAgfSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWQ6IDAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEgPSB7XG4gICAgICB0b3VjaE1zZzoge30sXG4gICAgICBoYW5kbGVyczoge1xuICAgICAgICB0b3VjaFN0YXJ0OiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hzdGFydCcpLFxuICAgICAgICB0b3VjaE1vdmU6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaG1vdmUnKSxcbiAgICAgICAgdG91Y2hFbmQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGVuZCcpLFxuICAgICAgICB0b3VjaENhbmNlbDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoY2FuY2VsJyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDlr7nkuo7kuI3kvJrlvbHlk43luIPlsYDnmoTmlLnliqjvvIzmr5TlpoLlm77niYflj6rmmK/mlLnkuKrlnLDlnYDjgIHliqDkuKrog4zmma/oibLkuYvnsbvnmoTmlLnliqjvvIzkvJrop6blj5EgTGF5b3V0IOeahCByZXBhaW50IOaTjeS9nFxuICAgICAqIOinpuWPkeeahOaWueW8j+aYr+e7mSBMYXlvdXQg5oqb5LiqIGByZXBhaW50YCDnmoTkuovku7bvvIzkuLrkuobmgKfog73vvIzmr4/mrKHmjqXmlLbliLAgcmVwYWludCDor7fmsYLkuI3kvJrmiafooYznnJ/mraPnmoTmuLLmn5NcbiAgICAgKiDogIzmmK/miafooYzkuIDkuKrnva7ohI/mk43kvZzvvIx0aWNrZXIg5q+P5LiA5qyh5omn6KGMIHVwZGF0ZSDkvJrmo4Dmn6Xov5nkuKrmoIforrDkvY3vvIzov5vogIzmiafooYznnJ/mraPnmoTph43nu5jmk43kvZxcbiAgICAgKi9cbiAgICAvLyB0aGlzLmlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcblxuICAgIHRoaXMub24oJ3JlcGFpbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy50aWNrZXIgPSBuZXcgVGlja2VyKCk7XG5cbiAgICAvKipcbiAgICAgKiDlsIYgVHdlZW4g5oyC6L295YiwIExheW91dO+8jOWvueS6jiBUd2VlbiDnmoTkvb/nlKjlrozlhajpgbXlvqogVHdlZW4uanMg55qE5paH5qGjXG4gICAgICogaHR0cHM6Ly9naXRodWIuY29tL3R3ZWVuanMvdHdlZW4uanMvXG4gICAgICog5Y+q5LiN6L+H5b2TIFR3ZWVuIOaUueWKqOS6huiKgueCueS8muinpuWPkSByZXBhaW5044CBcmVmbG93IOeahOWxnuaAp+aXtu+8jExheW91dCDkvJrmiafooYznm7jlupTnmoTmk43kvZxcbiAgICAgKiDkuJrliqHkvqfkuI3nlKjmhJ/nn6XliLAgcmVwYWludCDlkowgcmVmbG93XG4gICAgICovXG4gICAgLy8gdGhpcy5UV0VFTiA9IFRXRUVOO1xuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSB2JHt0aGlzLnZlcnNpb259YCk7XG4gIH1cblxuICAvLyDkuI7ogIHniYjmnKzlhbzlrrlcbiAgZ2V0IGRlYnVnSW5mbygpIHtcbiAgICBsZXQgaW5mbyA9IGRlYnVnSW5mby5sb2coKTtcblxuICAgIGluZm8gKz0gYGVsZW1lbnRDb3VudDogJHt0aGlzLmVsZUNvdW50fVxcbmA7XG5cbiAgICByZXR1cm4gaW5mbztcbiAgfVxuXG4gIC8qKlxuICAgKiDmm7TmlrDooqvnu5jliLZjYW52YXPnmoTnqpflj6Pkv6Hmga/vvIzmnKzmuLLmn5PlvJXmk47lubbkuI3lhbPlv4PmmK/lkKbkvJrlkozlhbbku5bmuLjmiI/lvJXmk47lhbHlkIzkvb/nlKhcbiAgICog6ICM5pys6Lqr5Y+I6ZyA6KaB5pSv5oyB5LqL5Lu25aSE55CG77yM5Zug5q2k77yM5aaC5p6c6KKr5riy5p+T5YaF5a655piv57uY5Yi25Yiw56a75bGPY2FudmFz77yM6ZyA6KaB5bCG5pyA57uI57uY5Yi25Zyo5bGP5bmV5LiKXG4gICAqIOeahOe7neWvueWwuuWvuOWSjOS9jee9ruS/oeaBr+abtOaWsOWIsOacrOa4suafk+W8leaTjuOAglxuICAgKiDlhbbkuK3vvIx3aWR0aOS4uueJqeeQhuWDj+e0oOWuveW6pu+8jGhlaWdodOS4uueJqeeQhuWDj+e0oOmrmOW6pu+8jHjkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKB45Z2Q5qCH77yMeeS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oFxuICAgKiB55Z2Q5qCHXG4gICAqL1xuICB1cGRhdGVWaWV3UG9ydChib3g6IElWaWV3UG9ydEJveCkge1xuICAgIHRoaXMudmlld3BvcnQud2lkdGggPSBib3gud2lkdGggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LmhlaWdodCA9IGJveC5oZWlnaHQgfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnggPSBib3gueCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueSA9IGJveC55IHx8IDA7XG5cbiAgICB0aGlzLnJlYWxMYXlvdXRCb3ggPSB7XG4gICAgICByZWFsWDogdGhpcy52aWV3cG9ydC54LFxuICAgICAgcmVhbFk6IHRoaXMudmlld3BvcnQueSxcbiAgICB9O1xuXG4gICAgdGhpcy5oYXNWaWV3UG9ydFNldCA9IHRydWU7XG4gIH1cblxuICBpbml0KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBhdHRyVmFsdWVQcm9jZXNzb3I6IENhbGxiYWNrKSB7XG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0Jyk7XG4gICAgY29uc3QgcGFyc2VDb25maWcgPSB7XG4gICAgICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnJyxcbiAgICAgIGF0dHJOb2RlTmFtZTogJ2F0dHInLCAvLyBkZWZhdWx0IGlzICdmYWxzZSdcbiAgICAgIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgICAgIGlnbm9yZUF0dHJpYnV0ZXM6IGZhbHNlLFxuICAgICAgaWdub3JlTmFtZVNwYWNlOiB0cnVlLFxuICAgICAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIHBhcnNlTm9kZVZhbHVlOiBmYWxzZSxcbiAgICAgIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICAgICAgdHJpbVZhbHVlczogdHJ1ZSxcbiAgICAgIHBhcnNlVHJ1ZU51bWJlck9ubHk6IGZhbHNlLFxuICAgICAgYWx3YXlzQ3JlYXRlVGV4dE5vZGU6IHRydWUsXG4gICAgfTtcblxuICAgIGlmIChhdHRyVmFsdWVQcm9jZXNzb3IgJiYgdHlwZW9mIGF0dHJWYWx1ZVByb2Nlc3NvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgcGFyc2VDb25maWcuYXR0clZhbHVlUHJvY2Vzc29yID0gYXR0clZhbHVlUHJvY2Vzc29yO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWxQYXJzZScpO1xuICAgIC8vIOWwhnhtbOWtl+espuS4suino+aekOaIkHhtbOiKgueCueagkVxuICAgIGNvbnN0IGpzb25PYmogPSBwYXJzZXIucGFyc2UodGVtcGxhdGUsIHBhcnNlQ29uZmlnLCB0cnVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyhqc29uT2JqKVxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sUGFyc2UnKTtcblxuICAgIGNvbnN0IHhtbFRyZWUgPSBqc29uT2JqLmNoaWxkcmVuWzBdO1xuXG4gICAgLy8gWE1M5qCR55Sf5oiQ5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0X3htbDJMYXlvdXQnKTtcbiAgICBjb25zdCBsYXlvdXRUcmVlID0gY3JlYXRlLmNhbGwodGhpcywgeG1sVHJlZSwgc3R5bGUpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2luaXRfeG1sMkxheW91dCcpO1xuXG4gICAgdGhpcy5hZGQobGF5b3V0VHJlZSk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuSU5JVEVEO1xuXG4gICAgdGhpcy50aWNrZXIuYWRkKHRoaXMudGlja2VyRnVuYywgdHJ1ZSk7XG4gICAgdGhpcy50aWNrZXIuc3RhcnQoKTtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2luaXQnKTtcbiAgfVxuXG4gIHJlZmxvdyhpc0ZpcnN0ID0gZmFsc2UpIHtcbiAgICBpZiAoIWlzRmlyc3QpIHtcbiAgICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X3JlZmxvdycpO1xuICAgIC8qKlxuICAgICAqIOiuoeeul+W4g+WxgOagkVxuICAgICAqIOe7j+i/hyBMYXlvdXQg6K6h566X77yM6IqC54K55qCR5bim5LiK5LqGIGxheW91dOOAgWxhc3RMYXlvdXTjgIFzaG91bGRVcGRhdGUg5biD5bGA5L+h5oGvXG4gICAgICogTGF5b3V05pys6Lqr5bm25LiN5L2c5Li65biD5bGA6K6h566X77yM5Y+q5piv5L2c5Li66IqC54K55qCR55qE5a655ZmoXG4gICAgICovXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdjb21wdXRlTGF5b3V0JywgdHJ1ZSk7XG4gICAgY29tcHV0ZUxheW91dCh0aGlzLmNoaWxkcmVuWzBdKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdjb21wdXRlTGF5b3V0Jyk7XG5cbiAgICBjb25zdCByb290RWxlID0gdGhpcy5jaGlsZHJlblswXTtcblxuICAgIGlmIChyb290RWxlLnN0eWxlLndpZHRoID09PSB1bmRlZmluZWQgfHwgcm9vdEVsZS5zdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS5lcnJvcignW0xheW91dF0gUGxlYXNlIHNldCB3aWR0aCBhbmQgaGVpZ2h0IHByb3BlcnR5IGZvciByb290IGVsZW1lbnQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJwb3J0LndpZHRoID0gcm9vdEVsZS5zdHlsZS53aWR0aDtcbiAgICAgIHRoaXMucmVuZGVycG9ydC5oZWlnaHQgPSByb290RWxlLnN0eWxlLmhlaWdodDtcbiAgICB9XG5cbiAgICAvLyDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dENoaWxkcmVuJywgdHJ1ZSk7XG4gICAgbGF5b3V0Q2hpbGRyZW4odGhpcyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Q2hpbGRyZW4nKTtcblxuICAgIHRoaXMudmlld3BvcnRTY2FsZSA9IHRoaXMudmlld3BvcnQud2lkdGggLyB0aGlzLnJlbmRlcnBvcnQud2lkdGg7XG5cbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIC8vIOmBjeWOhuiKgueCueagke+8jOS+neasoeiwg+eUqOiKgueCueeahOa4suafk+aOpeWPo+WunueOsOa4suafk1xuICAgIGRlYnVnSW5mby5zdGFydCgncmVuZGVyQ2hpbGRyZW4nLCB0cnVlKTtcbiAgICByZW5kZXJDaGlsZHJlbih0aGlzLmNoaWxkcmVuLCB0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBmYWxzZSk7XG4gICAgZGVidWdJbmZvLmVuZCgncmVuZGVyQ2hpbGRyZW4nKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgncmVwYWludCcsIHRydWUpO1xuICAgIHRoaXMucmVwYWludCgpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlcGFpbnQnKTtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcblxuICAgIC8vIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIChlbGUpID0+IHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGVsZS5wcm9wcyk7XG4gICAgLy8gfSk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfcmVmbG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogaW5pdOmYtuauteaguOW/g+S7heS7heaYr+agueaNrnhtbOWSjGNzc+WIm+W7uuS6huiKgueCueagkVxuICAgKiDopoHlrp7njrDnnJ/mraPnmoTmuLLmn5PvvIzpnIDopoHosIPnlKggbGF5b3V0IOWHveaVsO+8jOS5i+aJgOS7peWwhiBsYXlvdXQg5Y2V54us5oq96LGh5Li65LiA5Liq5Ye95pWw77yM5piv5Zug5Li6IGxheW91dCDlupTlvZPmmK/lj6/ku6Xph43lpI3osIPnlKjnmoRcbiAgICog5q+U5aaC5pS55Y+Y5LqG5LiA5Liq5YWD57Sg55qE5bC65a+477yM5a6e6ZmF5LiK6IqC54K55qCR5piv5rKh5Y+Y55qE77yM5LuF5LuF5piv6ZyA6KaB6YeN5paw6K6h566X5biD5bGA77yM54S25ZCO5riy5p+TXG4gICAqIOS4gOS4quWujOaVtOeahCBsYXlvdXQg5YiG5oiQ5LiL6Z2i55qE5Yeg5q2l77yaXG4gICAqIDEuIOaJp+ihjOeUu+W4g+a4heeQhu+8jOWboOS4uuW4g+WxgOWPmOWMlumhtemdoumcgOimgemHjee7mO+8jOi/memHjOayoeacieWBmuW+iOmrmOe6p+eahOWJlOmZpOetieaTjeS9nO+8jOS4gOW+i+a4hemZpOmHjeeUu++8jOWunumZheS4iuaAp+iDveW3sue7j+W+iOWlvVxuICAgKiAyLiDoioLngrnmoJHpg73lkKvmnIkgc3R5bGUg5bGe5oCn77yMY3NzLWxheW91dCDog73lpJ/moLnmja7ov5nkupvkv6Hmga/orqHnrpflh7rmnIDnu4jluIPlsYDvvIzor6bmg4Xlj6/op4EgaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvY3NzLWxheW91dFxuICAgKiAzLiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr++8jOS9hui/meS6m+S/oeaBr+W5tuS4jeaYr+iDveWkn+ebtOaOpeeUqOeahFxuICAgKiAgICDmr5TlpoIgbGF5b3V0LnRvcCDmmK/mjIflnKjkuIDkuKrniLblrrnlmajlhoXnmoQgdG9w77yM5pyA57uI6KaB5a6e546w5riy5p+T77yM5a6e6ZmF5LiK6KaB6YCS5b2S5Yqg5LiK5aSN5a655Zmo55qEIHRvcFxuICAgKiAgICDov5nmoLfmr4/mrKEgcmVwYWludCDnmoTml7blgJnlj6rpnIDopoHnm7TmjqXkvb/nlKjorqHnrpflpb3nmoTlgLzljbPlj6/vvIzkuI3pnIDopoHmr4/mrKHpg73pgJLlvZLorqHnrpdcbiAgICogICAg6L+Z5LiA5q2l56ew5Li6IGxheW91dENoaWxkcmVu77yM55uu55qE5Zyo5LqO5bCGIGNzcy1sYXlvdXQg6L+b5LiA5q2l5aSE55CG5Li65Y+v5Lul5riy5p+T55u05o6l55So55qE5biD5bGA5L+h5oGvXG4gICAqIDQuIHJlbmRlckNoaWxkcmVu77ya5omn6KGM5riy5p+TXG4gICAqIDUuIGJpbmRFdmVudHPvvJrmiafooYzkuovku7bnu5HlrppcbiAgICovXG4gIC8vIEB0cy1pZ25vcmVcbiAgbGF5b3V0KGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIHRoaXMucmVuZGVyQ29udGV4dCA9IGNvbnRleHQ7XG5cbiAgICBpZiAoIXRoaXMuaGFzVmlld1BvcnRTZXQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBpbnZva2UgbWV0aG9kIGB1cGRhdGVWaWV3UG9ydGAgYmVmb3JlIG1ldGhvZCBgbGF5b3V0YCcpO1xuICAgIH1cblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0Jyk7XG5cbiAgICB0aGlzLnJlZmxvdyh0cnVlKTtcblxuICAgIGRlYnVnSW5mby5zdGFydCgnbGF5b3V0X290aGVyJyk7XG4gICAgdGhpcy5iaW5kRXZlbnRzKCk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ29ic2VydmVTdHlsZUFuZEV2ZW50JywgdHJ1ZSk7XG4gICAgaXRlcmF0ZVRyZWUodGhpcy5jaGlsZHJlblswXSwgZWxlbWVudCA9PiBlbGVtZW50Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCkpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vYnNlcnZlU3R5bGVBbmRFdmVudCcpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLlJFTkRFUkVEO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0Jyk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X290aGVyJyk7XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM6IqC54K55pWw55qE6YeN57uY5Yi277yM5LiA6Iis5Lia5Yqh5L6n5peg6ZyA6LCD55So6K+l5pa55rOVXG4gICAqL1xuICByZXBhaW50KCkge1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuXG4gICAgdGhpcy5pc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gICAgcmVwYWludENoaWxkcmVuKHRoaXMuY2hpbGRyZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIOi/lOWbnuS4gOS4quiKgueCueWcqOWxj+W5leS4reeahOS9jee9ruWSjOWwuuWvuOS/oeaBr++8jOWJjeaPkOaYr+ato+ehruiwg+eUqHVwZGF0ZVZpZXdQb3J044CCXG4gICAqL1xuICBnZXRFbGVtZW50Vmlld3BvcnRSZWN0KGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICBjb25zdCB7IHJlYWxMYXlvdXRCb3gsIHZpZXdwb3J0U2NhbGUgfSA9IHRoaXM7XG4gICAgY29uc3Qge1xuICAgICAgYWJzb2x1dGVYLFxuICAgICAgYWJzb2x1dGVZLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgfSA9IGVsZW1lbnQubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB2aWV3cG9ydFNjYWxlICsgcmVhbExheW91dEJveC5yZWFsWDtcbiAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdmlld3BvcnRTY2FsZTtcbiAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdmlld3BvcnRTY2FsZTtcblxuICAgIHJldHVybiBuZXcgUmVjdChcbiAgICAgIHJlYWxYLFxuICAgICAgcmVhbFksXG4gICAgICByZWFsV2lkdGgsXG4gICAgICByZWFsSGVpZ2h0LFxuICAgICk7XG4gIH1cblxuICBnZXRDaGlsZEJ5UG9zKHRyZWU6IExheW91dCB8IEVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpdGVtTGlzdDogKExheW91dCB8IEVsZW1lbnQpW10pIHtcbiAgICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGVsZSkgPT4ge1xuICAgICAgY29uc3Qge1xuICAgICAgICBhYnNvbHV0ZVgsXG4gICAgICAgIGFic29sdXRlWSxcbiAgICAgICAgd2lkdGgsXG4gICAgICAgIGhlaWdodCxcbiAgICAgIH0gPSBlbGUubGF5b3V0Qm94O1xuICAgICAgY29uc3QgcmVhbFggPSBhYnNvbHV0ZVggKiB0aGlzLnZpZXdwb3J0U2NhbGUgKyB0aGlzLnJlYWxMYXlvdXRCb3gucmVhbFg7XG4gICAgICBjb25zdCByZWFsWSA9IGFic29sdXRlWSAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWTtcbiAgICAgIGNvbnN0IHJlYWxXaWR0aCA9IHdpZHRoICogdGhpcy52aWV3cG9ydFNjYWxlO1xuICAgICAgY29uc3QgcmVhbEhlaWdodCA9IGhlaWdodCAqIHRoaXMudmlld3BvcnRTY2FsZTtcblxuICAgICAgaWYgKChyZWFsWCA8PSB4ICYmIHggPD0gcmVhbFggKyByZWFsV2lkdGgpICYmIChyZWFsWSA8PSB5ICYmIHkgPD0gcmVhbFkgKyByZWFsSGVpZ2h0KSkge1xuICAgICAgICAvKipcbiAgICAgICAgICog55u45YWzaXNzdWXvvJpodHRwczovL2dpdGh1Yi5jb20vd2VjaGF0LW1pbmlwcm9ncmFtL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvaXNzdWVzLzE3XG4gICAgICAgICAqIOi/memHjOWPquimgea7oei2s+adoeS7tueahOmDveimgeiusOW9le+8jOWQpuWImeWPr+iDveWHuueOsCBpc3N1ZSDph4zpnaLmj5DliLDnmoTpl67pophcbiAgICAgICAgICovXG4gICAgICAgIGl0ZW1MaXN0LnB1c2goZWxlKTtcbiAgICAgICAgaWYgKGVsZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLmdldENoaWxkQnlQb3MoZWxlLCB4LCB5LCBpdGVtTGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGV2ZW50SGFuZGxlciA9IChldmVudE5hbWU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB7XG4gICAgICBsZXQgdG91Y2g6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG5cbiAgICAgIGlmIChpc0dhbWVUb3VjaEV2ZW50KGUpKSB7XG4gICAgICAgIHRvdWNoID0gKGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0pIHx8IChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG91Y2ggPSBlO1xuICAgICAgfVxuICAgICAgLy8gY29uc3QgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkgfHwgZTtcbiAgICAgIGlmICghdG91Y2ggfHwgIXRvdWNoLnBhZ2VYIHx8ICF0b3VjaC5wYWdlWSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghdG91Y2gudGltZVN0YW1wKSB7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdG91Y2gudGltZVN0YW1wID0gZS50aW1lU3RhbXA7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpc3Q6IChMYXlvdXQgfCBFbGVtZW50KVtdID0gW107XG4gICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgdGhpcy5nZXRDaGlsZEJ5UG9zKHRoaXMsIHRvdWNoLnBhZ2VYLCB0b3VjaC5wYWdlWSwgbGlzdCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgbGlzdC5wdXNoKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBpdGVtID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgaXRlbSAmJiBpdGVtLmVtaXQoZXZlbnROYW1lLCBlKTtcblxuICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gJ3RvdWNoc3RhcnQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoZW5kJykge1xuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2dbZXZlbnROYW1lXSA9IHRvdWNoO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnICYmIGlzQ2xpY2sodGhpcy5ldmVudEhhbmRsZXJEYXRhLnRvdWNoTXNnKSkge1xuICAgICAgICBpdGVtICYmIGl0ZW0uZW1pdCgnY2xpY2snLCBlKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOaJp+ihjOWFqOWxgOeahOS6i+S7tue7keWumumAu+i+kSBcbiAgICovXG4gIGJpbmRFdmVudHMoKSB7XG4gICAgaWYgKHRoaXMuaGFzRXZlbnRIYW5kbGVyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYXNFdmVudEhhbmRsZXIgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIF9fZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgICBfX2Vudi5vblRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQub25tb3VzZWRvd24gPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZTtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2VsZWF2ZSA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWo5bGA5LqL5Lu26Kej57uRIFxuICAgKi9cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlZG93biA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZWxlYXZlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50SGFuZGxlciA9IGZhbHNlO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBFRS5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3lBbGwodHJlZTogTGF5b3V0IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgIH0gPSB0cmVlO1xuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZGVzdHJveUFsbChjaGlsZCk7XG4gICAgICBjaGlsZC5kZXN0cm95U2VsZiAmJiBjaGlsZC5kZXN0cm95U2VsZigpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4heeQhueUu+W4g++8jOS5i+WJjeeahOiuoeeul+WHuuadpeeahOa4suafk+agkeS5n+S8muS4gOW5tua4heeQhu+8jOatpOaXtuWPr+S7peWGjeasoeaJp+ihjGluaXTlkoxsYXlvdXTmlrnms5XmuLLmn5PnlYzpnaLjgIJcbiAgICovXG4gIGNsZWFyKG9wdGlvbnM6IHsgcmVtb3ZlVGlja2VyPzogYm9vbGVhbiB9ID0ge30pIHtcbiAgICBjb25zdCB7IHJlbW92ZVRpY2tlciA9IHRydWUgfSA9IG9wdGlvbnM7XG5cbiAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB0aGlzLmRlc3Ryb3lBbGwodGhpcyk7XG4gICAgLy8gdGhpcy5lbGVtZW50VHJlZSA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5DTEVBUjtcbiAgICB0aGlzLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB0aGlzLmVsZUNvdW50ID0gMDtcbiAgICB0aGlzLnVuQmluZEV2ZW50cygpO1xuXG4gICAgaWYgKHJlbW92ZVRpY2tlcikge1xuICAgICAgdGhpcy50aWNrZXIucmVtb3ZlKCk7XG4gICAgICB0aGlzLnRpY2tlci5zdG9wKCk7XG4gICAgfVxuICB9XG5cbiAgY2xlYXJQb29sKCkge1xuICAgIGltZ1Bvb2wuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr5TotbcgTGF5b3V0LmNsZWFyIOabtOW9u+W6leeahOa4heeQhu+8jOS8mua4heepuuWbvueJh+WvueixoeaxoO+8jOWHj+WwkeWGheWtmOWNoOeUqOOAglxuICAgKi9cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlr7nkuo7lm77niYfotYTmupDvvIzlpoLmnpzkuI3mj5DliY3liqDovb3vvIzmuLLmn5Pov4fnqIvkuK3lj6/og73lh7rnjrDmjKjkuKrlh7rnjrDlm77niYfmlYjmnpzvvIzlvbHlk43kvZPpqoxcbiAgICog6YCa6L+HTGF5b3V0LmxvYWRJbWdz5Y+v5Lul6aKE5Yqg6L295Zu+54mH6LWE5rqQ77yM5Zyo6LCD55SoTGF5b3V0LmxheW91dOeahOaXtuWAmea4suafk+aAp+iDveabtOWlve+8jOS9k+mqjOabtOS9s+OAglxuICAgKi9cbiAgbG9hZEltZ3MoYXJyOiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDms6jlhowgYml0bWFwdGV4dCDlj6/nlKjnmoTlrZfkvZPjgIIgXG4gICAqL1xuICByZWdpc3RCaXRNYXBGb250KG5hbWU6IHN0cmluZywgc3JjOiBzdHJpbmcsIGNvbmZpZzogc3RyaW5nKSB7XG4gICAgaWYgKCFiaXRNYXBQb29sLmdldChuYW1lKSkge1xuICAgICAgY29uc3QgZm9udCA9IG5ldyBCaXRNYXBGb250KG5hbWUsIHNyYywgY29uZmlnKTtcbiAgICAgIHRoaXMuYml0TWFwRm9udHMucHVzaChmb250KTtcbiAgICAgIGJpdE1hcFBvb2wuc2V0KG5hbWUsIGZvbnQpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWFi+mahuiKgueCue+8jOWFi+mahuWQjueahOiKgueCueWPr+S7pea3u+WKoOWIsCBMYXlvdXQg55qE5p+Q5Liq6IqC54K55LitXG4gICAqIOivpeaWueazleWPr+S7peWcqOaVsOaNruacieWPmOWMlueahOaXtuWAmemBv+WFjemHjeaWsOaJp+ihjCBMYXlvdXQuaW5pdCDmtYHnqIvjgIJcbiAgICovXG4gIGNsb25lTm9kZShlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSkge1xuICAgIHJldHVybiBjbG9uZTxMYXlvdXQ+KHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhue7hOS7tuaMguWIsExheW91dFxuICAgKi9cbiAgRWxlbWVudCA9IEVsZW1lbnQ7XG4gIFZpZXcgPSBWaWV3O1xuICBUZXh0ID0gVGV4dDtcbiAgSW1hZ2UgPSBJbWFnZTtcbiAgU2Nyb2xsVmlldyA9IFNjcm9sbFZpZXc7XG4gIEJpdE1hcFRleHQgPSBCaXRNYXBUZXh0O1xuICBDYW52YXMgPSBDYW52YXM7XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQgPSByZWdpc3RlckNvbXBvbmVudDtcblxuICBwcml2YXRlIHN0YXRpYyBpbnN0YWxsZWRQbHVnaW5zOiBJUGx1Z2luPExheW91dD5bXSA9IFtdO1xuICAvKipcbiAgICog5a6J6KOF57uZ5a6a55qE5o+S5Lu2IFxuICAgKi9cbiAgdXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGlmIChMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmNsdWRlcyhwbHVnaW4pKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIOivpeaPkuS7tuW3suWuieijhS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBwbHVnaW4uaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5wdXNoKHBsdWdpbik7XG5cbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWuieijhWApXG4gIH1cblxuICAvKipcbiAgICog5Y246L2957uZ5a6a5o+S5Lu2IFxuICAgKi9cbiAgdW5Vc2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgY29uc3QgcGx1Z2luSW5kZXggPSBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5pbmRleE9mKHBsdWdpbik7XG5cbiAgICBpZiAocGx1Z2luSW5kZXggPT09IC0xKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RoaXMgcGx1Z2luIGlzIG5vdCBpbnN0YWxsZWQuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBsdWdpbi51bmluc3RhbGwpIHtcbiAgICAgIHBsdWdpbi51bmluc3RhbGwodGhpcywgLi4ub3B0aW9ucyk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYFtMYXlvdXRdIOaPkuS7tiAke3BsdWdpbi5uYW1lIHx8ICcnfSDlt7Lljbjovb1gKVxuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnNwbGljZShwbHVnaW5JbmRleCwgMSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IExheW91dCh7XG4gIHN0eWxlOiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9LFxuICBuYW1lOiAnbGF5b3V0Jyxcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
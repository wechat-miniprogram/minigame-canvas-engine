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
        // Object.defineProperty(this, 'value', {
        //   get() {
        //     return this.valuesrc;
        //   },
        //   set(newValue) {
        //     if (newValue !== this.valuesrc) {
        //       this.valuesrc = newValue;
        //       this.emit('repaint');
        //     }
        //   },
        //   enumerable: true,
        //   configurable: true,
        // });
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
            // TWEEN.update();
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
            console.error('Please invoke method `updateViewPort` before method `layout`');
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
    Layout.prototype.repaint = function () {
        (0,_common_util__WEBPACK_IMPORTED_MODULE_5__.clearCanvas)(this.renderContext);
        this.isNeedRepaint = false;
        (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.repaintChildren)(this.children);
    };
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
    Layout.prototype.clearAll = function () {
        this.clear();
        this.clearPool();
    };
    Layout.prototype.loadImgs = function (arr) {
        if (arr === void 0) { arr = []; }
        return Promise.all(arr.map(function (src) { return _common_imageManager__WEBPACK_IMPORTED_MODULE_12__["default"].loadImagePromise(src); }));
    };
    Layout.prototype.registBitMapFont = function (name, src, config) {
        if (!bitMapPool.get(name)) {
            var font = new _common_bitMapFont__WEBPACK_IMPORTED_MODULE_7__["default"](name, src, config);
            this.bitMapFonts.push(font);
            bitMapPool.set(name, font);
        }
    };
    Layout.prototype.cloneNode = function (element, deep) {
        if (deep === void 0) { deep = true; }
        return (0,_common_vd__WEBPACK_IMPORTED_MODULE_10__.clone)(this, element, deep);
    };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi5cXHBhY2thZ2VzXFxwbHVnaW5cXHBsdWdpblxcZW5naW5lLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sSUFBMEM7QUFDaEQ7QUFDQSxJQUFJLGlDQUFPLEVBQUUsb0NBQUUsT0FBTztBQUFBO0FBQUE7QUFBQSxrR0FBQztBQUN2QixJQUFJLEtBQUssRUFRTjtBQUNILENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLDBCQUEwQixnQkFBZ0I7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDQUFpQyxhQUFhO0FBQzlDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDLGFBQWE7QUFDL0M7O0FBRUE7QUFDQTtB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QUFBO0FBQUE7QUFBQSxrR0FBQztBQUN0QyxNQUFNLEtBQUssRUFNTjtBQUNMLENBQUM7QUFDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhLFNBQVM7QUFDdEI7O0FBRUEsYUFBYSxTQUFTO0FBQ3RCOztBQUVBLGFBQWEsU0FBUztBQUN0Qjs7QUFFQTtBQUNBLFlBQVksU0FBUztBQUNyQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLFNBQVM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZLFNBQVM7QUFDckI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWEsU0FBUztBQUN0Qjs7QUFFQSxhQUFhLFNBQVM7QUFDdEI7O0FBRUEsYUFBYSxTQUFTO0FBQ3RCOztBQUVBLGFBQWEsU0FBUztBQUN0Qjs7QUFFQSxhQUFhLFNBQVM7QUFDdEI7O0FBRUEsYUFBYSxTQUFTO0FBQ3RCOztBQUVBLGFBQWEsU0FBUztBQUN0Qjs7QUFFQSxhQUFhLFNBQVM7QUFDdEI7O0FBRUEsYUFBYSxRQUFRO0FBQ3JCOztBQUVBLGFBQWEsUUFBUTtBQUNyQjs7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O0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQSwwQkFBMEI7QUFDMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7OztBQUdUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUNBQXlDLHNEQUFzRDtBQUMvRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCO0FBQ3RCO0FB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QUFnQixHQUFoQixVQUFpQixJQUFZLEVBQUUsR0FBVyxFQUFFLE1BQWM7UUFDeEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBTSxJQUFJLEdBQUcsSUFBSSwwREFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUIsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELDBCQUFTLEdBQVQsVUFBVSxPQUFnQixFQUFFLElBQVc7UUFBWCxrQ0FBVztRQUNyQyxPQUFPLGtEQUFLLENBQVMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBV0gsYUFBQztBQUFELENBQUMsQ0E3Y29CLDREQUFPLEdBNmMzQjtBQUVELGlFQUFlLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3Njcm9sbGVyL2luZGV4LmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvc2Nyb2xsZXIvbGliL1Njcm9sbGVyLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvc2Nyb2xsZXIvbGliL2FuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vYml0TWFwRm9udC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9kZWJ1Z0luZm8udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vaW1hZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcmVjdC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi90aWNrZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdXRpbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi92ZC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYml0bWFwdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvY2FudmFzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9lbGVtZW50cy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW1hZ2UudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2luZGV4LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zY3JvbGx2aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9zdHlsZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2Vudi50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL25vZGUyanNvbi5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3V0aWwuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci92YWxpZGF0b3IuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxOb2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sc3RyMnhtbG5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kIGZvciByZWZlcmVuY2Vcbi8vXG4vLyBUaGlzIGZpbGUgdXNlcyB0aGUgZm9sbG93aW5nIHNwZWNpZmljIFVNRCBpbXBsZW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QuY29tcHV0ZUxheW91dCA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG52YXIgY29tcHV0ZUxheW91dCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ1NTX1VOREVGSU5FRDtcblxuICB2YXIgQ1NTX0RJUkVDVElPTl9JTkhFUklUID0gJ2luaGVyaXQnO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9MVFIgPSAnbHRyJztcbiAgdmFyIENTU19ESVJFQ1RJT05fUlRMID0gJ3J0bCc7XG5cbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1cgPSAncm93JztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSA9ICdyb3ctcmV2ZXJzZSc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OID0gJ2NvbHVtbic7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UgPSAnY29sdW1uLXJldmVyc2UnO1xuXG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0pVU1RJRllfQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOID0gJ3NwYWNlLWJldHdlZW4nO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EID0gJ3NwYWNlLWFyb3VuZCc7XG5cbiAgdmFyIENTU19BTElHTl9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0FMSUdOX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19BTElHTl9TVFJFVENIID0gJ3N0cmV0Y2gnO1xuXG4gIHZhciBDU1NfUE9TSVRJT05fUkVMQVRJVkUgPSAncmVsYXRpdmUnO1xuICB2YXIgQ1NTX1BPU0lUSU9OX0FCU09MVVRFID0gJ2Fic29sdXRlJztcblxuICB2YXIgbGVhZGluZyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciB0cmFpbGluZyA9IHtcbiAgICAncm93JzogJ3JpZ2h0JyxcbiAgICAncm93LXJldmVyc2UnOiAnbGVmdCcsXG4gICAgJ2NvbHVtbic6ICdib3R0b20nLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICd0b3AnXG4gIH07XG4gIHZhciBwb3MgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgZGltID0ge1xuICAgICdyb3cnOiAnd2lkdGgnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICd3aWR0aCcsXG4gICAgJ2NvbHVtbic6ICdoZWlnaHQnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdoZWlnaHQnXG4gIH07XG5cbiAgLy8gV2hlbiB0cmFuc3BpbGVkIHRvIEphdmEgLyBDIHRoZSBub2RlIHR5cGUgaGFzIGxheW91dCwgY2hpbGRyZW4gYW5kIHN0eWxlXG4gIC8vIHByb3BlcnRpZXMuIEZvciB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGVzZSBwcm9wZXJ0aWVzXG4gIC8vIGlmIHRoZXkgZG9uJ3QgYWxyZWFkeSBleGlzdC5cbiAgZnVuY3Rpb24gZmlsbE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUubGF5b3V0IHx8IG5vZGUuaXNEaXJ0eSkge1xuICAgICAgbm9kZS5sYXlvdXQgPSB7XG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLnN0eWxlKSB7XG4gICAgICBub2RlLnN0eWxlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmaWxsTm9kZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm93RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbkVuZCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5FbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdTdGFydCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ0VuZCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ0VuZCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSArXG4gICAgICAgIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEp1c3RpZnlDb250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmFsaWduQ29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25Db250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnN0eWxlLmFsaWduU2VsZikge1xuICAgICAgcmV0dXJuIGNoaWxkLnN0eWxlLmFsaWduU2VsZjtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25JdGVtcykge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25JdGVtcztcbiAgICB9XG4gICAgcmV0dXJuICdzdHJldGNoJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVBeGlzKGF4aXMsIGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fUlRMKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVykge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbikge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgaWYgKG5vZGUuc3R5bGUuZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gQ1NTX0RJUkVDVElPTl9JTkhFUklUO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fSU5IRVJJVCkge1xuICAgICAgZGlyZWN0aW9uID0gKHBhcmVudERpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gQ1NTX0RJUkVDVElPTl9MVFIgOiBwYXJlbnREaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGbGV4RGlyZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENyb3NzRmxleERpcmVjdGlvbihmbGV4RGlyZWN0aW9uLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvblR5cGUobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLnBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuICdyZWxhdGl2ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXgobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRQb3NpdGlvblR5cGUobm9kZSkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgbm9kZS5zdHlsZS5mbGV4ID4gMFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXhXcmFwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4V3JhcCA9PT0gJ3dyYXAnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGltV2l0aE1hcmdpbihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gKyBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZVtkaW1bYXhpc11dID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Bvc0RlZmluZWQobm9kZSwgcG9zKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZWFzdXJlRGVmaW5lZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUubWVhc3VyZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24obm9kZSwgcG9zKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvdW5kQXhpcyhub2RlLCBheGlzLCB2YWx1ZSkge1xuICAgIHZhciBtaW4gPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5taW5IZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbkhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgbWF4ID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWF4SGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhIZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIGJvdW5kVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgbWF4ID49IDAgJiYgYm91bmRWYWx1ZSA+IG1heCkge1xuICAgICAgYm91bmRWYWx1ZSA9IG1heDtcbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkICYmIG1pbiA+PSAwICYmIGJvdW5kVmFsdWUgPCBtaW4pIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtaW47XG4gICAgfVxuICAgIHJldHVybiBib3VuZFZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm1heGYoYSwgYikge1xuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzcGVjaWZpY2FsbHkgc2V0cyBhIHZhbHVlIGZvciB3aWR0aCBvciBoZWlnaHRcbiAgZnVuY3Rpb24gc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGF4aXMpIHtcbiAgICAvLyBUaGUgcGFyZW50IGFscmVhZHkgY29tcHV0ZWQgdXMgYSB3aWR0aCBvciBoZWlnaHQuIFdlIGp1c3Qgc2tpcCBpdFxuICAgIGlmIChub2RlLmxheW91dFtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV2Ugb25seSBydW4gaWYgdGhlcmUncyBhIHdpZHRoIG9yIGhlaWdodCBkZWZpbmVkXG4gICAgaWYgKCFpc0RpbURlZmluZWQobm9kZSwgYXhpcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGltZW5zaW9ucyBjYW4gbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJcbiAgICBub2RlLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICBib3VuZEF4aXMobm9kZSwgYXhpcywgbm9kZS5zdHlsZVtkaW1bYXhpc11dKSxcbiAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGF4aXMpIHtcbiAgICBjaGlsZC5sYXlvdXRbdHJhaWxpbmdbYXhpc11dID0gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dIC0gY2hpbGQubGF5b3V0W3Bvc1theGlzXV07XG4gIH1cblxuICAvLyBJZiBib3RoIGxlZnQgYW5kIHJpZ2h0IGFyZSBkZWZpbmVkLCB0aGVuIHVzZSBsZWZ0LiBPdGhlcndpc2UgcmV0dXJuXG4gIC8vICtsZWZ0IG9yIC1yaWdodCBkZXBlbmRpbmcgb24gd2hpY2ggaXMgZGVmaW5lZC5cbiAgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbbGVhZGluZ1theGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGdldFBvc2l0aW9uKG5vZGUsIGxlYWRpbmdbYXhpc10pO1xuICAgIH1cbiAgICByZXR1cm4gLWdldFBvc2l0aW9uKG5vZGUsIHRyYWlsaW5nW2F4aXNdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCAvKmNzc19kaXJlY3Rpb25fdCovcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyLypjc3NfZGlyZWN0aW9uX3QqLyBkaXJlY3Rpb24gPSByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIG1haW5BeGlzID0gcmVzb2x2ZUF4aXMoZ2V0RmxleERpcmVjdGlvbihub2RlKSwgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gY3Jvc3NBeGlzID0gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKG1haW5BeGlzLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyByZXNvbHZlZFJvd0F4aXMgPSByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuXG4gICAgLy8gSGFuZGxlIHdpZHRoIGFuZCBoZWlnaHQgc3R5bGUgYXR0cmlidXRlc1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBtYWluQXhpcyk7XG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBTZXQgdGhlIHJlc29sdmVkIHJlc29sdXRpb24gaW4gdGhlIG5vZGUncyBsYXlvdXRcbiAgICBub2RlLmxheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgc2V0IGJ5IHRoZSBwYXJlbnQsIGJ1dCB3ZSBuZWVkIHRvIGNvbXBsZXRlIGl0IHdpdGggYVxuICAgIC8vIGRlbHRhIGNvbXBvc2VkIG9mIHRoZSBtYXJnaW4gYW5kIGxlZnQvdG9wL3JpZ2h0L2JvdHRvbVxuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbbWFpbkF4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1ttYWluQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFtsZWFkaW5nW2Nyb3NzQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBJbmxpbmUgaW1tdXRhYmxlIHZhbHVlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZSB0byBhdm9pZCBleGNlc3NpdmUgbWV0aG9kXG4gICAgLy8gaW52b2NhdGlvbnMgZHVyaW5nIHRoZSBsYXlvdXQgY2FsY3VsYXRpb24uXG4gICAgdmFyLyppbnQqLyBjaGlsZENvdW50ID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3cgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuXG4gICAgaWYgKGlzTWVhc3VyZURlZmluZWQobm9kZSkpIHtcbiAgICAgIHZhci8qYm9vbCovIGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSk7XG5cbiAgICAgIHZhci8qZmxvYXQqLyB3aWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLnN0eWxlLndpZHRoO1xuICAgICAgfSBlbHNlIGlmIChpc1Jlc29sdmVkUm93RGltRGVmaW5lZCkge1xuICAgICAgICB3aWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoIC09IHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBnaXZlIGEgZGltZW5zaW9uIGZvciB0aGUgdGV4dCBpZiB3ZSBoYXZlbid0IGdvdCBhbnlcbiAgICAgIC8vIGZvciBpdCBjb21wdXRlZCB5ZXQuIEl0IGNhbiBlaXRoZXIgYmUgZnJvbSB0aGUgc3R5bGUgYXR0cmlidXRlIG9yIGJlY2F1c2VcbiAgICAgIC8vIHRoZSBlbGVtZW50IGlzIGZsZXhpYmxlLlxuICAgICAgdmFyLypib29sKi8gaXNSb3dVbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykgJiYgIWlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkO1xuICAgICAgdmFyLypib29sKi8gaXNDb2x1bW5VbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pICYmXG4gICAgICAgIGlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OXV0pO1xuXG4gICAgICAvLyBMZXQncyBub3QgbWVhc3VyZSB0aGUgdGV4dCBpZiB3ZSBhbHJlYWR5IGtub3cgYm90aCBkaW1lbnNpb25zXG4gICAgICBpZiAoaXNSb3dVbmRlZmluZWQgfHwgaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgdmFyLypjc3NfZGltX3QqLyBtZWFzdXJlRGltID0gbm9kZS5zdHlsZS5tZWFzdXJlKFxuICAgICAgICAgIC8qKGMpIW5vZGUtPmNvbnRleHQsKi9cbiAgICAgICAgICAvKihqYXZhKSFsYXlvdXRDb250ZXh0Lm1lYXN1cmVPdXRwdXQsKi9cbiAgICAgICAgICB3aWR0aFxuICAgICAgICApO1xuICAgICAgICBpZiAoaXNSb3dVbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC53aWR0aCA9IG1lYXN1cmVEaW0ud2lkdGggK1xuICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBtZWFzdXJlRGltLmhlaWdodCArXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIGlzTm9kZUZsZXhXcmFwID0gaXNGbGV4V3JhcChub2RlKTtcblxuICAgIHZhci8qY3NzX2p1c3RpZnlfdCovIGp1c3RpZnlDb250ZW50ID0gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSk7XG5cbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIHZhci8qYm9vbCovIGlzTWFpbkRpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzQ3Jvc3NEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNNYWluUm93RGlyZWN0aW9uID0gaXNSb3dEaXJlY3Rpb24obWFpbkF4aXMpO1xuXG4gICAgdmFyLyppbnQqLyBpO1xuICAgIHZhci8qaW50Ki8gaWk7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGNoaWxkO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBheGlzO1xuXG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcblxuICAgIHZhci8qZmxvYXQqLyBkZWZpbmVkTWFpbkRpbSA9IENTU19VTkRFRklORUQ7XG4gICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIGRlZmluZWRNYWluRGltID0gbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gLSBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW47XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBleGVjdXRlIHRoZSBuZXh0IHR3byBsb29wcyBvbmUgcGVyIGxpbmUgd2l0aCBmbGV4LXdyYXBcbiAgICB2YXIvKmludCovIHN0YXJ0TGluZSA9IDA7XG4gICAgdmFyLyppbnQqLyBlbmRMaW5lID0gMDtcbiAgICAvLyB2YXIvKmludCovIG5leHRPZmZzZXQgPSAwO1xuICAgIHZhci8qaW50Ki8gYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgLy8gV2UgYWdncmVnYXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZSBjb250YWluZXIgaW4gdGhvc2UgdHdvIHZhcmlhYmxlc1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc0Nyb3NzRGltID0gMDtcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNNYWluRGltID0gMDtcbiAgICB2YXIvKmludCovIGxpbmVzQ291bnQgPSAwO1xuICAgIHdoaWxlIChlbmRMaW5lIDwgY2hpbGRDb3VudCkge1xuICAgICAgLy8gPExvb3AgQT4gTGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgY291bnQgY2hpbGRyZW4gYnkgdHlwZVxuXG4gICAgICAvLyBtYWluQ29udGVudERpbSBpcyBhY2N1bXVsYXRpb24gb2YgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbiBvZiBhbGwgdGhlXG4gICAgICAvLyBub24gZmxleGlibGUgY2hpbGRyZW4uIFRoaXMgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGVpdGhlciBzZXQgdGhlXG4gICAgICAvLyBkaW1lbnNpb25zIG9mIHRoZSBub2RlIGlmIG5vbmUgYWxyZWFkeSBleGlzdCwgb3IgdG8gY29tcHV0ZSB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZSBsZWZ0IGZvciB0aGUgZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkNvbnRlbnREaW0gPSAwO1xuXG4gICAgICAvLyBUaGVyZSBhcmUgdGhyZWUga2luZCBvZiBjaGlsZHJlbiwgbm9uIGZsZXhpYmxlLCBmbGV4aWJsZSBhbmQgYWJzb2x1dGUuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGhlcmUgYXJlIGluIG9yZGVyIHRvIGRpc3RyaWJ1dGUgdGhlIHNwYWNlLlxuICAgICAgdmFyLyppbnQqLyBmbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIHRvdGFsRmxleGlibGUgPSAwO1xuICAgICAgdmFyLyppbnQqLyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuXG4gICAgICAvLyBVc2UgdGhlIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgbWFpbiBheGlzIGZvciBhcyBsb25nXG4gICAgICAvLyBhcyB0aGV5IGFyZSB1c2luZyBhIHNpbXBsZSBzdGFja2luZyBiZWhhdmlvdXIuIENoaWxkcmVuIHRoYXQgYXJlXG4gICAgICAvLyBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3Agd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpblxuICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrTWFpbiA9XG4gICAgICAgICAgKGlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgKCFpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9DRU5URVIpO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhNYWluID0gKGlzU2ltcGxlU3RhY2tNYWluID8gY2hpbGRDb3VudCA6IHN0YXJ0TGluZSk7XG5cbiAgICAgIC8vIFVzZSB0aGUgaW5pdGlhbCBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIGNyb3NzIGF4aXMgZm9yXG4gICAgICAvLyBhcyBsb25nIGFzIHRoZXkgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCB3aXRoIGFsaWdubWVudCBTVFJFVENIIG9yXG4gICAgICAvLyBGTEVYX1NUQVJULiBDaGlsZHJlbiB0aGF0IGFyZSBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3BcbiAgICAgIC8vIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW4gaW4gPExvb3AgRD4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSB0cnVlO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhDcm9zcyA9IGNoaWxkQ291bnQ7XG5cbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluO1xuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltID0gMDtcblxuICAgICAgdmFyLypmbG9hdCovIG1heFdpZHRoO1xuICAgICAgZm9yIChpID0gc3RhcnRMaW5lOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgY2hpbGQubGluZUluZGV4ID0gbGluZXNDb3VudDtcblxuICAgICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuXG4gICAgICAgIC8vIFByZS1maWxsIGNyb3NzIGF4aXMgZGltZW5zaW9ucyB3aGVuIHRoZSBjaGlsZCBpcyB1c2luZyBzdHJldGNoIGJlZm9yZVxuICAgICAgICAvLyB3ZSBjYWxsIHRoZSByZWN1cnNpdmUgbGF5b3V0IHBhc3NcbiAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiZcbiAgICAgICAgICAgIGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgICAgICAgaXNDcm9zc0RpbURlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGNyb3NzQXhpcykpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUpIHtcbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNoaWxkcmVuXG4gICAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RBYnNvbHV0ZUNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aFxuICAgICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSxcbiAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBheGlzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhci8qZmxvYXQqLyBuZXh0Q29udGVudERpbSA9IDA7XG5cbiAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBjb25zaWRlciBhIGNoaWxkIGZsZXhpYmxlIGlmIHdlIGhhdmUgYSBjb21wdXRlZFxuICAgICAgICAvLyBkaW1lbnNpb24gZm9yIHRoZSBub2RlLlxuICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCAmJiBpc0ZsZXgoY2hpbGQpKSB7XG4gICAgICAgICAgZmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgdG90YWxGbGV4aWJsZSArPSBjaGlsZC5zdHlsZS5mbGV4O1xuXG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGZsZXhpYmxlIGNoaWxkcmVuIHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RGbGV4Q2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBrbm93IGl0cyBleGFjdCBzaXplIHlldCwgd2UgYWxyZWFkeSBrbm93IHRoZSBwYWRkaW5nLFxuICAgICAgICAgIC8vIGJvcmRlciBhbmQgbWFyZ2luLiBXZSdsbCB1c2UgdGhpcyBwYXJ0aWFsIGluZm9ybWF0aW9uLCB3aGljaCByZXByZXNlbnRzXG4gICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNpemUgZm9yIHRoZSBjaGlsZCwgdG8gY29tcHV0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAgICAgLy8gYXZhaWxhYmxlIHNwYWNlLlxuICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBtYWluQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBtYWluIHJlY3Vyc2l2ZSBjYWxsLiBXZSBsYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgICAgIGlmIChhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID09PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFic29sdXRlIHBvc2l0aW9uZWQgZWxlbWVudHMgZG8gbm90IHRha2UgcGFydCBvZiB0aGUgbGF5b3V0LCBzbyB3ZVxuICAgICAgICAgIC8vIGRvbid0IHVzZSB0aGVtIHRvIGNvbXB1dGUgbWFpbkNvbnRlbnREaW1cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBhbmQgbWFyZ2luIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGVsZW1lbnQgd2UgYXJlIGFib3V0IHRvIGFkZCB3b3VsZCBtYWtlIHVzIGdvIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgICAgaWYgKGlzTm9kZUZsZXhXcmFwICYmXG4gICAgICAgICAgICBpc01haW5EaW1EZWZpbmVkICYmXG4gICAgICAgICAgICBtYWluQ29udGVudERpbSArIG5leHRDb250ZW50RGltID4gZGVmaW5lZE1haW5EaW0gJiZcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZWxlbWVudCwgdGhlbiBpdCdzIGJpZ2dlciB0aGFuIHRoZSBjb250ZW50XG4gICAgICAgICAgICAvLyBhbmQgbmVlZHMgaXRzIG93biBsaW5lXG4gICAgICAgICAgICBpICE9PSBzdGFydExpbmUpIHtcbiAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQtLTtcbiAgICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBtYWluIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4gJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHwgaXNGbGV4KGNoaWxkKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrTWFpbiA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleE1haW4gPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIGNyb3NzIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEQ+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8XG4gICAgICAgICAgICAgICAgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiYgYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAgICAgICBpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhDcm9zcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4pIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1haW5EaW0gKz0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgICAgIG1haW5Db250ZW50RGltICs9IG5leHRDb250ZW50RGltO1xuICAgICAgICBlbmRMaW5lID0gaSArIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEI+IExheW91dCBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgYWxsb2NhdGUgZW1wdHkgc3BhY2VcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gcG9zaXRpb24gdGhlIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMsIHdlIGhhdmUgdHdvXG4gICAgICAvLyBjb250cm9scy4gVGhlIHNwYWNlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIGFuZCB0aGUgc3BhY2UgYmV0d2VlbiBlYWNoIHR3byBlbGVtZW50cy5cbiAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nTWFpbkRpbSA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gYmV0d2Vlbk1haW5EaW0gPSAwO1xuXG4gICAgICAvLyBUaGUgcmVtYWluaW5nIGF2YWlsYWJsZSBzcGFjZSB0aGF0IG5lZWRzIHRvIGJlIGFsbG9jYXRlZFxuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ01haW5EaW0gPSAwO1xuICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGRlZmluZWRNYWluRGltIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYobWFpbkNvbnRlbnREaW0sIDApIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBmbGV4aWJsZSBjaGlsZHJlbiBpbiB0aGUgbWl4LCB0aGV5IGFyZSBnb2luZyB0byBmaWxsIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlXG4gICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICE9PSAwKSB7XG4gICAgICAgIHZhci8qZmxvYXQqLyBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJhc2VNYWluRGltO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYm91bmRNYWluRGltO1xuXG4gICAgICAgIC8vIElmIHRoZSBmbGV4IHNoYXJlIG9mIHJlbWFpbmluZyBzcGFjZSBkb2Vzbid0IG1lZXQgbWluL21heCBib3VuZHMsXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGNoaWxkIGZyb20gZmxleCBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICBiYXNlTWFpbkRpbSA9IGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBib3VuZE1haW5EaW0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsIGJhc2VNYWluRGltKTtcblxuICAgICAgICAgIGlmIChiYXNlTWFpbkRpbSAhPT0gYm91bmRNYWluRGltKSB7XG4gICAgICAgICAgICByZW1haW5pbmdNYWluRGltIC09IGJvdW5kTWFpbkRpbTtcbiAgICAgICAgICAgIHRvdGFsRmxleGlibGUgLT0gY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG5cbiAgICAgICAgLy8gVGhlIG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBjYW4gb3ZlcmZsb3cgdGhlIGNvbnRhaW5lciwgaW4gdGhpcyBjYXNlXG4gICAgICAgIC8vIHdlIHNob3VsZCBqdXN0IGFzc3VtZSB0aGF0IHRoZXJlIGlzIG5vIHNwYWNlIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGZsZXhpYmxlTWFpbkRpbSA8IDApIHtcbiAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbWFpblxuICAgICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubGF5b3V0W2RpbVttYWluQXhpc11dID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLFxuICAgICAgICAgICAgZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIHJlY3Vyc2l2ZWx5IGNhbGwgdGhlIGxheW91dCBhbGdvcml0aG0gZm9yIHRoaXMgY2hpbGRcbiAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY3VycmVudEZsZXhDaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICBjaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UganVzdGlmeUNvbnRlbnQgdG8gZmlndXJlIG91dCBob3cgdG8gYWxsb2NhdGUgdGhlIHJlbWFpbmluZ1xuICAgICAgLy8gc3BhY2UgYXZhaWxhYmxlXG4gICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB7XG4gICAgICAgIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfQ0VOVEVSKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9FTkQpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW07XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4pIHtcbiAgICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYocmVtYWluaW5nTWFpbkRpbSwgMCk7XG4gICAgICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEgIT09IDApIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EKSB7XG4gICAgICAgICAgLy8gU3BhY2Ugb24gdGhlIGVkZ2VzIGlzIGhhbGYgb2YgdGhlIHNwYWNlIGJldHdlZW4gZWxlbWVudHNcbiAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCk7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSBiZXR3ZWVuTWFpbkRpbSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQz4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcyBhbmQgY29tcHV0ZSBkaW1lbnNpb25zXG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIGFsbCB0aGUgY2hpbGRyZW4gaGF2ZSB0aGVpciBkaW1lbnNpb25zIHNldC4gV2UgbmVlZCB0b1xuICAgICAgLy8gZmluZCB0aGVpciBwb3NpdGlvbi4gSW4gb3JkZXIgdG8gZG8gdGhhdCwgd2UgYWNjdW11bGF0ZSBkYXRhIGluXG4gICAgICAvLyB2YXJpYWJsZXMgdGhhdCBhcmUgYWxzbyB1c2VmdWwgdG8gY29tcHV0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGVcbiAgICAgIC8vIGNvbnRhaW5lciFcbiAgICAgIG1haW5EaW0gKz0gbGVhZGluZ01haW5EaW07XG5cbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleE1haW47IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgYW5kIGhhcyBsZWZ0L3RvcCBiZWluZ1xuICAgICAgICAgIC8vIGRlZmluZWQsIHdlIG92ZXJyaWRlIHRoZSBwb3NpdGlvbiB0byB3aGF0ZXZlciB0aGUgdXNlciBzYWlkXG4gICAgICAgICAgLy8gKGFuZCBtYXJnaW4vYm9yZGVyKS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgKHdpdGhvdXQgdG9wL2xlZnQpIG9yIHJlbGF0aXZlLFxuICAgICAgICAgIC8vIHdlIHB1dCBpdCBhdCB0aGUgY3VycmVudCBhY2N1bXVsYXRlZCBvZmZzZXQuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UgcGxhY2VkIHRoZSBlbGVtZW50LCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFyaWFibGVzXG4gICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGRvIHRoYXQgZm9yIHJlbGF0aXZlIGVsZW1lbnRzLiBBYnNvbHV0ZSBlbGVtZW50c1xuICAgICAgICAgIC8vIGRvIG5vdCB0YWtlIHBhcnQgaW4gdGhhdCBwaGFzZS5cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvLyBUaGUgbWFpbiBkaW1lbnNpb24gaXMgdGhlIHN1bSBvZiBhbGwgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBwbHVzXG4gICAgICAgICAgICAvLyB0aGUgc3BhY2luZy5cbiAgICAgICAgICAgIG1haW5EaW0gKz0gYmV0d2Vlbk1haW5EaW0gKyBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgICAvLyBUaGUgY3Jvc3MgZGltZW5zaW9uIGlzIHRoZSBtYXggb2YgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBzaW5jZSB0aGVyZVxuICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIGVsZW1lbnQgaW4gdGhhdCBjcm9zcyBkaW1lbnNpb24uXG4gICAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmZsb2F0Ki8gY29udGFpbmVyQ3Jvc3NBeGlzID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICBjb250YWluZXJDcm9zc0F4aXMgPSBmbWF4ZihcbiAgICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGNyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBEPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4Q3Jvc3M7IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIGFic29sdXRlbHkgcG9zaXRpb25uZWQgYW5kIGhhcyBhXG4gICAgICAgICAgLy8gdG9wL2xlZnQvYm90dG9tL3JpZ2h0IGJlaW5nIHNldCwgd2Ugb3ZlcnJpZGUgYWxsIHRoZSBwcmV2aW91c2x5XG4gICAgICAgICAgLy8gY29tcHV0ZWQgcG9zaXRpb25zIHRvIHNldCBpdCBjb3JyZWN0bHkuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdDcm9zc0RpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgICAgICAvLyBGb3IgYSByZWxhdGl2ZSBjaGlsZHJlbiwgd2UncmUgZWl0aGVyIHVzaW5nIGFsaWduSXRlbXMgKHBhcmVudCkgb3JcbiAgICAgICAgICAvLyBhbGlnblNlbGYgKGNoaWxkKSBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIHBvc2l0aW9uIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgLy8gVGhpcyB2YXJpYWJsZSBpcyBpbnRlbnRpb25hbGx5IHJlLWRlZmluZWQgYXMgdGhlIGNvZGUgaXMgdHJhbnNwaWxlZCB0byBhIGJsb2NrIHNjb3BlIGxhbmd1YWdlXG4gICAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgLy8gWW91IGNhbiBvbmx5IHN0cmV0Y2ggaWYgdGhlIGRpbWVuc2lvbiBoYXMgbm90IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgICAgICAgICAgLy8gcHJldmlvdXNseS5cbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIHNwYWNlIGJldHdlZW4gdGhlIHBhcmVudCBkaW1lbnNpb25zK3BhZGRpbmcgYW5kIGNoaWxkXG4gICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnMrbWFyZ2luLlxuICAgICAgICAgICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQ3Jvc3NEaW0gPSBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW0gLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDU1NfQUxJR05fRkxFWF9FTkRcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgYXBwbHkgdGhlIHBvc2l0aW9uXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ0Nyb3NzRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmVzQ3Jvc3NEaW0gKz0gY3Jvc3NEaW07XG4gICAgICBsaW5lc01haW5EaW0gPSBmbWF4ZihsaW5lc01haW5EaW0sIG1haW5EaW0pO1xuICAgICAgbGluZXNDb3VudCArPSAxO1xuICAgICAgc3RhcnRMaW5lID0gZW5kTGluZTtcbiAgICB9XG5cbiAgICAvLyA8TG9vcCBFPlxuICAgIC8vXG4gICAgLy8gTm90ZShwcmVuYXV4KTogTW9yZSB0aGFuIG9uZSBsaW5lLCB3ZSBuZWVkIHRvIGxheW91dCB0aGUgY3Jvc3NBeGlzXG4gICAgLy8gYWNjb3JkaW5nIHRvIGFsaWduQ29udGVudC5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb3VsZCBwcm9iYWJseSByZW1vdmUgPExvb3AgRD4gYW5kIGhhbmRsZSB0aGUgb25lIGxpbmUgY2FzZVxuICAgIC8vIGhlcmUgdG9vLCBidXQgZm9yIHRoZSBtb21lbnQgdGhpcyBpcyBzYWZlciBzaW5jZSBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aFxuICAgIC8vIHByZXZpb3VzbHkgd29ya2luZyBjb2RlLlxuICAgIC8vXG4gICAgLy8gU2VlIHNwZWNzOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTIvQ1ItY3NzMy1mbGV4Ym94LTIwMTIwOTE4LyNsYXlvdXQtYWxnb3JpdGhtXG4gICAgLy8gc2VjdGlvbiA5LjRcbiAgICAvL1xuICAgIGlmIChsaW5lc0NvdW50ID4gMSAmJiBpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgdmFyLypmbG9hdCovIG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3M7XG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQWxpZ25Db250ZW50RGltID0gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSAtIGxpbmVzQ3Jvc3NEaW07XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbUxlYWQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGN1cnJlbnRMZWFkID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudCA9IGdldEFsaWduQ29udGVudChub2RlKTtcbiAgICAgIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyAyO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgIGlmIChub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID4gbGluZXNDcm9zc0RpbSkge1xuICAgICAgICAgIGNyb3NzRGltTGVhZCA9IChyZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyBsaW5lc0NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmludCovIGVuZEluZGV4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lc0NvdW50OyArK2kpIHtcbiAgICAgICAgdmFyLyppbnQqLyBzdGFydEluZGV4ID0gZW5kSW5kZXg7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbGluZSdzIGhlaWdodCBhbmQgZmluZCB0aGUgZW5kSW5kZXhcbiAgICAgICAgdmFyLypmbG9hdCovIGxpbmVIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBjaGlsZENvdW50OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoaWxkLmxpbmVJbmRleCAhPT0gaSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSBmbWF4ZihcbiAgICAgICAgICAgICAgbGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSArIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuZEluZGV4ID0gaWk7XG4gICAgICAgIGxpbmVIZWlnaHQgKz0gY3Jvc3NEaW1MZWFkO1xuXG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGVuZEluZGV4OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50QWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBsaW5lSGVpZ2h0IC0gZ2V0VHJhaWxpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykgLSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICB2YXIvKmZsb2F0Ki8gY2hpbGRIZWlnaHQgPSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgKGxpbmVIZWlnaHQgLSBjaGlsZEhlaWdodCkgLyAyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICAgIC8vIFRPRE8ocHJlbmF1eCk6IENvcnJlY3RseSBzZXQgdGhlIGhlaWdodCBvZiBpdGVtcyB3aXRoIHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGF1dG8pIGNyb3NzQXhpcyBkaW1lbnNpb24uXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExlYWQgKz0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBuZWVkc01haW5UcmFpbGluZ1BvcyA9IGZhbHNlO1xuICAgIHZhci8qYm9vbCovIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZnkgYSB3aWR0aCBvciBoZWlnaHQsIGFuZCBpdCBoYXMgbm90IGJlZW4gc2V0XG4gICAgLy8gYnkgdGhlIGNvbnRhaW5lciwgdGhlbiB3ZSBzZXQgaXQgdmlhIHRoZSBjaGlsZHJlbi5cbiAgICBpZiAoIWlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIFdlJ3JlIG1pc3NpbmcgdGhlIGxhc3QgcGFkZGluZyBhdCB0aGlzIHBvaW50IHRvIGdldCB0aGUgZmluYWxcbiAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBtYWluQXhpcywgbGluZXNNYWluRGltICsgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKSksXG4gICAgICAgIC8vIFdlIGNhbiBuZXZlciBhc3NpZ24gYSB3aWR0aCBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlcnNcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluXG4gICAgICApO1xuXG4gICAgICBpZiAobWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNNYWluVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGxpbmVzQ3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgKTtcblxuICAgICAgaWYgKGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBGPiBTZXQgdHJhaWxpbmcgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zIHx8IG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBHPiBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzXG4gICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBmaXJzdEFic29sdXRlQ2hpbGQ7XG4gICAgd2hpbGUgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3JcbiAgICAgIC8vIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aCBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgIWlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbbGVhZGluZ1theGlzXV0gPVxuICAgICAgICAgICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQ7XG4gICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGUobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbikge1xuICAgIG5vZGUuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblxuICAgIHZhciBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbiB8fCBDU1NfRElSRUNUSU9OX0xUUjtcbiAgICB2YXIgc2tpcExheW91dCA9XG4gICAgICAhbm9kZS5pc0RpcnR5ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPT09IG5vZGUubGF5b3V0LmhlaWdodCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID09PSBub2RlLmxheW91dC53aWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID09PSBwYXJlbnRNYXhXaWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uO1xuXG4gICAgaWYgKHNraXBMYXlvdXQpIHtcbiAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbm9kZS5sYXN0TGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXN0TGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGF5b3V0LnRvcCA9IG5vZGUubGFzdExheW91dC50b3A7XG4gICAgICBub2RlLmxheW91dC5sZWZ0ID0gbm9kZS5sYXN0TGF5b3V0LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbm9kZS5sYXN0TGF5b3V0KSB7XG4gICAgICAgIG5vZGUubGFzdExheW91dCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAgIC8vIFJlc2V0IGNoaWxkIGxheW91dHNcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBjaGlsZC5sYXlvdXQud2lkdGggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC5oZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC50b3AgPSAwO1xuICAgICAgICBjaGlsZC5sYXlvdXQubGVmdCA9IDA7XG4gICAgICB9KTtcblxuICAgICAgbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbik7XG5cbiAgICAgIG5vZGUubGFzdExheW91dC53aWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC50b3AgPSBub2RlLmxheW91dC50b3A7XG4gICAgICBub2RlLmxhc3RMYXlvdXQubGVmdCA9IG5vZGUubGF5b3V0LmxlZnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsYXlvdXROb2RlSW1wbDogbGF5b3V0Tm9kZUltcGwsXG4gICAgY29tcHV0ZUxheW91dDogbGF5b3V0Tm9kZSxcbiAgICBmaWxsTm9kZXM6IGZpbGxOb2Rlc1xuICB9O1xufSkoKTtcblxuLy8gVGhpcyBtb2R1bGUgZXhwb3J0IGlzIG9ubHkgdXNlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVuaXQgdGVzdGluZyB0aGlzIGZpbGUuIFdoZW5cbi8vIHRoZSBsaWJyYXJ5IGlzIHBhY2thZ2VkIHRoaXMgZmlsZSBpcyBpbmNsdWRlZCB3aXRoaW4gY3NzLWxheW91dC5qcyB3aGljaCBmb3Jtc1xuLy8gdGhlIHB1YmxpYyBBUEkuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcHV0ZUxheW91dDtcbn1cblxuXG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgIC8vIGRpc2FibGluZyBFU0xpbnQgYmVjYXVzZSB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBhYm92ZSBpbmNsdWRlXG4gICAgY29tcHV0ZUxheW91dC5maWxsTm9kZXMobm9kZSk7XG4gICAgY29tcHV0ZUxheW91dC5jb21wdXRlTGF5b3V0KG5vZGUpO1xuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9O1xufSkpO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTURcbiAgICAgICAgZGVmaW5lKFsnZXhwb3J0cycsICcuL2xpYi9hbmltYXRlJywgJy4vbGliL1Njcm9sbGVyJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkoZXhwb3J0cywgcmVxdWlyZSgnLi9saWIvYW5pbWF0ZScpLCByZXF1aXJlKCcuL2xpYi9TY3JvbGxlcicpKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzLCBhbmltYXRlLCBTY3JvbGxlcikge1xuICAgIGV4cG9ydHMuYW5pbWF0ZSA9IGFuaW1hdGU7XG4gICAgZXhwb3J0cy5TY3JvbGxlciA9IFNjcm9sbGVyO1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1EXG4gICAgICAgIGRlZmluZShbJy4vYW5pbWF0ZSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCcuL2FuaW1hdGUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIHJvb3QuU2Nyb2xsZXIgPSBmYWN0b3J5KHJvb3QuYW5pbWF0ZSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoYW5pbWF0ZSkge1xuICAgIHZhciBOT09QID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAvKipcbiAgICAgKiBBIHB1cmUgbG9naWMgJ2NvbXBvbmVudCcgZm9yICd2aXJ0dWFsJyBzY3JvbGxpbmcvem9vbWluZy5cbiAgICAgKi9cbiAgICB2YXIgU2Nyb2xsZXIgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geC1heGlzICovXG4gICAgICAgICAgICBzY3JvbGxpbmdYOiB0cnVlLFxuXG4gICAgICAgICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB5LWF4aXMgKi9cbiAgICAgICAgICAgIHNjcm9sbGluZ1k6IHRydWUsXG5cbiAgICAgICAgICAgIC8qKiBFbmFibGUgYW5pbWF0aW9ucyBmb3IgZGVjZWxlcmF0aW9uLCBzbmFwIGJhY2ssIHpvb21pbmcgYW5kIHNjcm9sbGluZyAqL1xuICAgICAgICAgICAgYW5pbWF0aW5nOiB0cnVlLFxuXG4gICAgICAgICAgICAvKiogZHVyYXRpb24gZm9yIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIGJ5IHNjcm9sbFRvL3pvb21UbyAqL1xuICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDI1MCxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSBib3VuY2luZyAoY29udGVudCBjYW4gYmUgc2xvd2x5IG1vdmVkIG91dHNpZGUgYW5kIGp1bXBzIGJhY2sgYWZ0ZXIgcmVsZWFzaW5nKSAqL1xuICAgICAgICAgICAgYm91bmNpbmc6IHRydWUsXG5cbiAgICAgICAgICAgIC8qKiBFbmFibGUgbG9ja2luZyB0byB0aGUgbWFpbiBheGlzIGlmIHVzZXIgbW92ZXMgb25seSBzbGlnaHRseSBvbiBvbmUgb2YgdGhlbSBhdCBzdGFydCAqL1xuICAgICAgICAgICAgbG9ja2luZzogdHJ1ZSxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSBwYWdpbmF0aW9uIG1vZGUgKHN3aXRjaGluZyBiZXR3ZWVuIGZ1bGwgcGFnZSBjb250ZW50IHBhbmVzKSAqL1xuICAgICAgICAgICAgcGFnaW5nOiBmYWxzZSxcblxuICAgICAgICAgICAgLyoqIEVuYWJsZSBzbmFwcGluZyBvZiBjb250ZW50IHRvIGEgY29uZmlndXJlZCBwaXhlbCBncmlkICovXG4gICAgICAgICAgICBzbmFwcGluZzogZmFsc2UsXG5cbiAgICAgICAgICAgIC8qKiBFbmFibGUgem9vbWluZyBvZiBjb250ZW50IHZpYSBBUEksIGZpbmdlcnMgYW5kIG1vdXNlIHdoZWVsICovXG4gICAgICAgICAgICB6b29taW5nOiBmYWxzZSxcblxuICAgICAgICAgICAgLyoqIE1pbmltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgICAgICAgbWluWm9vbTogMC41LFxuXG4gICAgICAgICAgICAvKiogTWF4aW11bSB6b29tIGxldmVsICovXG4gICAgICAgICAgICBtYXhab29tOiAzLFxuXG4gICAgICAgICAgICAvKiogTXVsdGlwbHkgb3IgZGVjcmVhc2Ugc2Nyb2xsaW5nIHNwZWVkICoqL1xuICAgICAgICAgICAgc3BlZWRNdWx0aXBsaWVyOiAxLFxuXG4gICAgICAgICAgICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBmaXJlZCBvbiB0aGUgbGF0ZXIgb2YgdG91Y2ggZW5kIG9yIGRlY2VsZXJhdGlvbiBlbmQsXG4gICAgICAgICAgICAgICAgcHJvdmlkZWQgdGhhdCBhbm90aGVyIHNjcm9sbGluZyBhY3Rpb24gaGFzIG5vdCBiZWd1bi4gVXNlZCB0byBrbm93XG4gICAgICAgICAgICAgICAgd2hlbiB0byBmYWRlIG91dCBhIHNjcm9sbGJhci4gKi9cbiAgICAgICAgICAgIHNjcm9sbGluZ0NvbXBsZXRlOiBOT09QLFxuXG4gICAgICAgICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICAgICAgICBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbiA6IDAuMDMsXG5cbiAgICAgICAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBhY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgICAgICAgIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uIDogMC4wOFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgICAgfVxuICAgIH07XG5cblxuICAgIC8vIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAgICAvLyBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAgICAgKiovXG4gICAgdmFyIGVhc2VPdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgcmV0dXJuIChNYXRoLnBvdygocG9zIC0gMSksIDMpICsgMSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBwb3Mge051bWJlcn0gcG9zaXRpb24gYmV0d2VlbiAwIChzdGFydCBvZiBlZmZlY3QpIGFuZCAxIChlbmQgb2YgZWZmZWN0KVxuICAgICAqKi9cbiAgICB2YXIgZWFzZUluT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIGlmICgocG9zIC89IDAuNSkgPCAxKSB7XG4gICAgICAgICAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLCAzKSArIDIpO1xuICAgIH07XG5cblxuICAgIFNjcm9sbGVyLnByb3RvdHlwZSA9IHtcblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIElOVEVSTkFMIEZJRUxEUyA6OiBTVEFUVVNcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cblxuICAgICAgICAvKioge0Jvb2xlYW59IFdoZXRoZXIgb25seSBhIHNpbmdsZSBmaW5nZXIgaXMgdXNlZCBpbiB0b3VjaCBoYW5kbGluZyAqL1xuICAgICAgICBfX2lzU2luZ2xlVG91Y2g6IGZhbHNlLFxuXG4gICAgICAgIC8qKiB7Qm9vbGVhbn0gV2hldGhlciBhIHRvdWNoIGV2ZW50IHNlcXVlbmNlIGlzIGluIHByb2dyZXNzICovXG4gICAgICAgIF9faXNUcmFja2luZzogZmFsc2UsXG5cbiAgICAgICAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbiB3ZW50IHRvIGNvbXBsZXRpb24uICovXG4gICAgICAgIF9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGU6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB7Qm9vbGVhbn0gV2hldGhlciBhIGdlc3R1cmUgem9vbS9yb3RhdGUgZXZlbnQgaXMgaW4gcHJvZ3Jlc3MuIEFjdGl2YXRlcyB3aGVuXG4gICAgICAgICAqIGEgZ2VzdHVyZXN0YXJ0IGV2ZW50IGhhcHBlbnMuIFRoaXMgaGFzIGhpZ2hlciBwcmlvcml0eSB0aGFuIGRyYWdnaW5nLlxuICAgICAgICAgKi9cbiAgICAgICAgX19pc0dlc3R1cmluZzogZmFsc2UsXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHtCb29sZWFufSBXaGV0aGVyIHRoZSB1c2VyIGhhcyBtb3ZlZCBieSBzdWNoIGEgZGlzdGFuY2UgdGhhdCB3ZSBoYXZlIGVuYWJsZWRcbiAgICAgICAgICogZHJhZ2dpbmcgbW9kZS4gSGludDogSXQncyBvbmx5IGVuYWJsZWQgYWZ0ZXIgc29tZSBwaXhlbHMgb2YgbW92ZW1lbnQgdG9cbiAgICAgICAgICogbm90IGludGVycnVwdCB3aXRoIGNsaWNrcyBldGMuXG4gICAgICAgICAqL1xuICAgICAgICBfX2lzRHJhZ2dpbmc6IGZhbHNlLFxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB7Qm9vbGVhbn0gTm90IHRvdWNoaW5nIGFuZCBkcmFnZ2luZyBhbnltb3JlLCBhbmQgc21vb3RobHkgYW5pbWF0aW5nIHRoZVxuICAgICAgICAgKiB0b3VjaCBzZXF1ZW5jZSB1c2luZyBkZWNlbGVyYXRpb24uXG4gICAgICAgICAqL1xuICAgICAgICBfX2lzRGVjZWxlcmF0aW5nOiBmYWxzZSxcblxuICAgICAgICAvKipcbiAgICAgICAgICoge0Jvb2xlYW59IFNtb290aGx5IGFuaW1hdGluZyB0aGUgY3VycmVudGx5IGNvbmZpZ3VyZWQgY2hhbmdlXG4gICAgICAgICAqL1xuICAgICAgICBfX2lzQW5pbWF0aW5nOiBmYWxzZSxcblxuXG5cbiAgICAgICAgLypcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICBJTlRFUk5BTCBGSUVMRFMgOjogRElNRU5TSU9OU1xuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgbGVmdCBib3VuZGFyeSAqL1xuICAgICAgICBfX2NsaWVudExlZnQ6IDAsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCByaWdodCBib3VuZGFyeSAqL1xuICAgICAgICBfX2NsaWVudFRvcDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IHdpZHRoICovXG4gICAgICAgIF9fY2xpZW50V2lkdGg6IDAsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBoZWlnaHQgKi9cbiAgICAgICAgX19jbGllbnRIZWlnaHQ6IDAsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyB3aWR0aCAqL1xuICAgICAgICBfX2NvbnRlbnRXaWR0aDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IEZ1bGwgY29udGVudCdzIGhlaWdodCAqL1xuICAgICAgICBfX2NvbnRlbnRIZWlnaHQ6IDAsXG5cbiAgICAgICAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aCBmb3IgY29udGVudCAqL1xuICAgICAgICBfX3NuYXBXaWR0aDogMTAwLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0IGZvciBjb250ZW50ICovXG4gICAgICAgIF9fc25hcEhlaWdodDogMTAwLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBab29tIGxldmVsICovXG4gICAgICAgIF9fem9vbUxldmVsOiAxLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gICAgICAgIF9fc2Nyb2xsTGVmdDogMCxcblxuICAgICAgICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICAgICAgICBfX3Njcm9sbFRvcDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gICAgICAgIF9fbWF4U2Nyb2xsTGVmdDogMCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gICAgICAgIF9fbWF4U2Nyb2xsVG9wOiAwLFxuXG4gICAgICAgIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCBsZWZ0IHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgICAgICAgX19zY2hlZHVsZWRMZWZ0OiAwLFxuXG4gICAgICAgIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB0b3AgcG9zaXRpb24gKGZpbmFsIHBvc2l0aW9uIHdoZW4gYW5pbWF0aW5nKSAqL1xuICAgICAgICBfX3NjaGVkdWxlZFRvcDogMCxcblxuICAgICAgICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgem9vbSBsZXZlbCAoZmluYWwgc2NhbGUgd2hlbiBhbmltYXRpbmcpICovXG4gICAgICAgIF9fc2NoZWR1bGVkWm9vbTogMCxcblxuXG5cbiAgICAgICAgLypcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICBJTlRFUk5BTCBGSUVMRFMgOjogTEFTVCBQT1NJVElPTlNcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cblxuICAgICAgICAvKioge051bWJlcn0gTGVmdCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgICAgICAgX19sYXN0VG91Y2hMZWZ0OiBudWxsLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBUb3AgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gICAgICAgIF9fbGFzdFRvdWNoVG9wOiBudWxsLFxuXG4gICAgICAgIC8qKiB7RGF0ZX0gVGltZXN0YW1wIG9mIGxhc3QgbW92ZSBvZiBmaW5nZXIuIFVzZWQgdG8gbGltaXQgdHJhY2tpbmcgcmFuZ2UgZm9yIGRlY2VsZXJhdGlvbiBzcGVlZC4gKi9cbiAgICAgICAgX19sYXN0VG91Y2hNb3ZlOiBudWxsLFxuXG4gICAgICAgIC8qKiB7QXJyYXl9IExpc3Qgb2YgcG9zaXRpb25zLCB1c2VzIHRocmVlIGluZGV4ZXMgZm9yIGVhY2ggc3RhdGU6IGxlZnQsIHRvcCwgdGltZXN0YW1wICovXG4gICAgICAgIF9fcG9zaXRpb25zOiBudWxsLFxuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIElOVEVSTkFMIEZJRUxEUyA6OiBERUNFTEVSQVRJT04gU1VQUE9SVFxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWluaW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gICAgICAgIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdDogbnVsbCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IE1pbmltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gICAgICAgIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wOiBudWxsLFxuXG4gICAgICAgIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gICAgICAgIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdDogbnVsbCxcblxuICAgICAgICAvKioge0ludGVnZXJ9IE1heGltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gICAgICAgIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wOiBudWxsLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgaG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gICAgICAgIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYOiBudWxsLFxuXG4gICAgICAgIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICAgICAgICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WTogbnVsbCxcblxuXG5cbiAgICAgICAgLypcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICBQVUJMSUMgQVBJXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENvbmZpZ3VyZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNsaWVudCAob3V0ZXIpIGFuZCBjb250ZW50IChpbm5lcikgZWxlbWVudHMuXG4gICAgICAgICAqIFJlcXVpcmVzIHRoZSBhdmFpbGFibGUgc3BhY2UgZm9yIHRoZSBvdXRlciBlbGVtZW50IGFuZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICAgICAgICogQWxsIHZhbHVlcyB3aGljaCBhcmUgZmFsc3kgKG51bGwgb3IgemVybyBldGMuKSBhcmUgaWdub3JlZCBhbmQgdGhlIG9sZCB2YWx1ZSBpcyBrZXB0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gY2xpZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBJbm5lciB3aWR0aCBvZiBvdXRlciBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSBjbGllbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBJbm5lciBoZWlnaHQgb2Ygb3V0ZXIgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gY29udGVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgd2lkdGggb2YgaW5uZXIgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0gY29udGVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IE91dGVyIGhlaWdodCBvZiBpbm5lciBlbGVtZW50XG4gICAgICAgICAqL1xuICAgICAgICBzZXREaW1lbnNpb25zIDogZnVuY3Rpb24gKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuICAgICAgICAgICAgLy8gT25seSB1cGRhdGUgdmFsdWVzIHdoaWNoIGFyZSBkZWZpbmVkXG4gICAgICAgICAgICBpZiAoY2xpZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fY2xpZW50V2lkdGggPSBjbGllbnRXaWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGNsaWVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jbGllbnRIZWlnaHQgPSBjbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChjb250ZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fY29udGVudFdpZHRoID0gY29udGVudFdpZHRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoY29udGVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX19jb250ZW50SGVpZ2h0ID0gY29udGVudEhlaWdodDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gUmVmcmVzaCBtYXhpbXVtc1xuICAgICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcblxuICAgICAgICAgICAgLy8gUmVmcmVzaCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFNldHMgdGhlIGNsaWVudCBjb29yZGluYXRlcyBpbiByZWxhdGlvbiB0byB0aGUgZG9jdW1lbnQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IHtJbnRlZ2VyID8gMH0gTGVmdCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAgICAgICAqIEBwYXJhbSB0b3Age0ludGVnZXIgPyAwfSBUb3AgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgICAgICAgKi9cbiAgICAgICAgc2V0UG9zaXRpb24gOiBmdW5jdGlvbiAobGVmdCwgdG9wKSB7XG4gICAgICAgICAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICAgICAgICAgIHRoaXMuX19jbGllbnRUb3AgPSB0b3AgfHwgMDtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICAgICAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICBzZXRTbmFwU2l6ZSA6IGZ1bmN0aW9uICh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgICAgICB0aGlzLl9fc25hcFdpZHRoID0gd2lkdGg7XG4gICAgICAgICAgICB0aGlzLl9fc25hcEhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZXR1cm5zIHRoZSBzY3JvbGwgcG9zaXRpb24gYW5kIHpvb21pbmcgdmFsdWVzXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBzY3JvbGwgcG9zaXRpb24gYW5kIGB6b29tYCBsZXZlbFxuICAgICAgICAgKi9cbiAgICAgICAgZ2V0VmFsdWVzIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLl9fc2Nyb2xsTGVmdCxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuX19zY3JvbGxUb3AsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoL3RoaXMuX196b29tTGV2ZWwsXG4gICAgICAgICAgICAgICAgYm90dG9tOiB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2NsaWVudEhlaWdodC90aGlzLl9fem9vbUxldmVsLFxuICAgICAgICAgICAgICAgIHpvb206IHRoaXMuX196b29tTGV2ZWxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogR2V0IHBvaW50IGluIGluIGNvbnRlbnQgc3BhY2UgZnJvbSBzY3JvbGwgY29vcmRpbmF0ZXMuXG4gICAgICAgICAqL1xuICAgICAgICBnZXRQb2ludCA6IGZ1bmN0aW9uIChzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGxlZnQgOiBzY3JvbGxMZWZ0IC8gdmFsdWVzLnpvb20sXG4gICAgICAgICAgICAgICAgdG9wIDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAgICAgICAqXG4gICAgICAgICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICovXG4gICAgICAgIGdldFNjcm9sbE1heCA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLl9fbWF4U2Nyb2xsVG9wXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFpvb21zIHRvIHRoZSBnaXZlbiBsZXZlbC4gU3VwcG9ydHMgb3B0aW9uYWwgYW5pbWF0aW9uLiBab29tc1xuICAgICAgICAgKiB0aGUgY2VudGVyIHdoZW4gbm8gY29vcmRpbmF0ZXMgYXJlIGdpdmVuLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gbGV2ZWwge051bWJlcn0gTGV2ZWwgdG8gem9vbSB0b1xuICAgICAgICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICAgICAgICogQHBhcmFtIGZpeGVkTGVmdCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgbGVmdCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgICAgICAgKiBAcGFyYW0gZml4ZWRUb3Age051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIHRvcCBjb29yZGluYXRlICh2ZWN0b3IgaW4gY2xpZW50IHNwYWNlKVxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9uID8gbnVsbH0gQSBjYWxsYmFjayB0aGF0IGdldHMgZmlyZWQgd2hlbiB0aGUgem9vbSBpcyBjb21wbGV0ZS5cbiAgICAgICAgICovXG4gICAgICAgIHpvb21UbyA6IGZ1bmN0aW9uIChsZXZlbCwgaXNBbmltYXRlZCwgZml4ZWRMZWZ0LCBmaXhlZFRvcCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIGNhbGxiYWNrIGlmIGV4aXN0c1xuICAgICAgICAgICAgaWYoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gY2FsbGJhY2s7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBvbGRMZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICAgICAgICAgIGlmIChmaXhlZExlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmaXhlZFRvcCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgZml4ZWRUb3AgPSB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgICAgICAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIHNjcm9sbCBwb3NpdGlvbnMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWwuXG4gICAgICAgICAgICAvLyBDaG9vc2luZyB0aGUgbmV3IHZpZXdwb3J0IHNvIHRoYXQgdGhlIG9yaWdpbidzIHBvc2l0aW9uIHJlbWFpbnNcbiAgICAgICAgICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAgICAgICAgIC8vICogRml4ZWQgcG9pbnQsICRGJCwgcmVtYWlucyBzdGF0aW9uYXJ5IGluIGNvbnRlbnQgc3BhY2UgYW5kIGluIHRoZVxuICAgICAgICAgICAgLy8gdmlld3BvcnQuXG4gICAgICAgICAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAgICAgICAgIC8vICogRmluYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19mJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAgICAgICAgIC8vICogSW5pdGlhbCBzY2FsaW5nIGZhY3RvciwgJGtfaSQuXG4gICAgICAgICAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAqICRTX2kgXFxtYXBzdG8gU19mJC5cbiAgICAgICAgICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAgICAgICAgIC8vICogJChTX2kgLSBGKSBrX2kva19mID0gKFNfZiAtIEYpJC5cbiAgICAgICAgICAgIC8vICogJFNfZiA9IEYgKyAoU19pIC0gRikga19pL2tfZiQuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gRml4ZWQgcG9pbnQgbG9jYXRpb24sICRcXHZlY3RvcntmfSA9IChGIC0gU19pKSBrX2kkLlxuICAgICAgICAgICAgLy8gKiAkRiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSQuXG4gICAgICAgICAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAgICAgICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSAtIFxcdmVjdG9ye2Z9L2tfZiQuXG4gICAgICAgICAgICAvLyAqICRTX2Yga19mID0gU19pIGtfZiArIChrX2Yva19pIC0gMSlcXHZlY3RvcntmfSQuXG4gICAgICAgICAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgICAgICAgICB2YXIgayA9IGxldmVsIC8gb2xkTGV2ZWw7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGsqKHRoaXMuX19zY3JvbGxMZWZ0ICsgZml4ZWRMZWZ0KSAtIGZpeGVkTGVmdDtcbiAgICAgICAgICAgIHZhciB0b3AgPSBrKih0aGlzLl9fc2Nyb2xsVG9wICsgZml4ZWRUb3ApIC0gZml4ZWRUb3A7XG5cbiAgICAgICAgICAgIC8vIExpbWl0IHgtYXhpc1xuICAgICAgICAgICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgICAgIGxlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTGltaXQgeS1heGlzXG4gICAgICAgICAgICBpZiAodG9wID4gdGhpcy5fX21heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgIHRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICB0b3AgPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgICAgICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgbGV2ZWwsIGlzQW5pbWF0ZWQpO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICAgICAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAgICAgICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgICAgICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgem9vbUJ5IDogZnVuY3Rpb24gKGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjayk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICAgICAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgICAgICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAgICAgICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICAgICAgICovXG4gICAgICAgIHNjcm9sbFRvIDogZnVuY3Rpb24gKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgICAgICAgICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICAgICAgICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29ycmVjdCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgICAgICAgICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJab29taW5nIGlzIG5vdCBlbmFibGVkIVwiKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZWZ0ICo9IHpvb207XG4gICAgICAgICAgICAgICAgdG9wICo9IHpvb207XG5cbiAgICAgICAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgICAgICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgICAgICAgICAgIHpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdYKSB7XG4gICAgICAgICAgICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICAgICAgICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX3NuYXBXaWR0aCkgKiB0aGlzLl9fc25hcFdpZHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgICAgICAgICAgIHRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX2NsaWVudEhlaWdodCkgKiB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX3NuYXBIZWlnaHQpICogdGhpcy5fX3NuYXBIZWlnaHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBMaW1pdCBmb3IgYWxsb3dlZCByYW5nZXNcbiAgICAgICAgICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgICAgICAgICAgdG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbFRvcCwgdG9wKSwgMCk7XG5cbiAgICAgICAgICAgIC8vIERvbid0IGFuaW1hdGUgd2hlbiBubyBjaGFuZ2UgZGV0ZWN0ZWQsIHN0aWxsIGNhbGwgcHVibGlzaCB0byBtYWtlIHN1cmVcbiAgICAgICAgICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgICAgICAgICBpZiAobGVmdCA9PT0gdGhpcy5fX3Njcm9sbExlZnQgJiYgdG9wID09PSB0aGlzLl9fc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBQdWJsaXNoIG5ldyB2YWx1ZXNcbiAgICAgICAgICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogU2Nyb2xsIGJ5IHRoZSBnaXZlbiBvZmZzZXRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGxlZnQge051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAgICAgICAqIEBwYXJhbSB0b3Age051bWJlciA/IDB9IFNjcm9sbCB4LWF4aXMgYnkgZ2l2ZW4gb2Zmc2V0XG4gICAgICAgICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gYW5pbWF0ZSB0aGUgZ2l2ZW4gY2hhbmdlXG4gICAgICAgICAqL1xuICAgICAgICBzY3JvbGxCeSA6IGZ1bmN0aW9uIChsZWZ0LCB0b3AsIGlzQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgdmFyIHN0YXJ0VG9wID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZFRvcCA6IHRoaXMuX19zY3JvbGxUb3A7XG5cbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oc3RhcnRMZWZ0ICsgKGxlZnQgfHwgMCksIHN0YXJ0VG9wICsgKHRvcCB8fCAwKSwgaXNBbmltYXRlZCk7XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIEVWRU5UIENBTExCQUNLU1xuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAqL1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBNb3VzZSB3aGVlbCBoYW5kbGVyIGZvciB6b29taW5nIHN1cHBvcnRcbiAgICAgICAgICovXG4gICAgICAgIGRvTW91c2Vab29tIDogZnVuY3Rpb24gKHdoZWVsRGVsdGEsIHRpbWVTdGFtcCwgcGFnZVgsIHBhZ2VZKSB7XG4gICAgICAgICAgICB2YXIgY2hhbmdlID0gd2hlZWxEZWx0YSA+IDAgPyAwLjk3IDogMS4wMztcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRvdWNoIHN0YXJ0IGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAgICAgICAqL1xuICAgICAgICBkb1RvdWNoU3RhcnQgOiBmdW5jdGlvbiAodG91Y2hlcywgdGltZVN0YW1wKSB7XG4gICAgICAgICAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBSZXNldCBpbnRlcnJ1cHRlZEFuaW1hdGlvbiBmbGFnXG4gICAgICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgICAgICAgICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgICAgICAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgICAgICAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcbiAgICAgICAgICAgIHZhciBpc1NpbmdsZVRvdWNoID0gdG91Y2hlcy5sZW5ndGggPT09IDE7XG4gICAgICAgICAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGluaXRpYWwgcG9zaXRpb25zXG4gICAgICAgICAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgICAgICAgICB0aGlzLl9faW5pdGlhbFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgICAgICAgICAvLyBTdG9yZSBjdXJyZW50IHpvb20gbGV2ZWxcbiAgICAgICAgICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGluaXRpYWwgdG91Y2ggcG9zaXRpb25zXG4gICAgICAgICAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgICAgICAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgICAgICAgICAvLyBTdG9yZSBpbml0aWFsIG1vdmUgdGltZSBzdGFtcFxuICAgICAgICAgICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG5cbiAgICAgICAgICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICAgICAgICAgIHRoaXMuX19sYXN0U2NhbGUgPSAxO1xuXG4gICAgICAgICAgICAvLyBSZXNldCBsb2NraW5nIGZsYWdzXG4gICAgICAgICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgICAgICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWTtcblxuICAgICAgICAgICAgLy8gUmVzZXQgdHJhY2tpbmcgZmxhZ1xuICAgICAgICAgICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBSZXNldCBkZWNlbGVyYXRpb24gY29tcGxldGUgZmxhZ1xuICAgICAgICAgICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgICAgICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAhaXNTaW5nbGVUb3VjaDtcblxuICAgICAgICAgICAgLy8gU29tZSBmZWF0dXJlcyBhcmUgZGlzYWJsZWQgaW4gbXVsdGkgdG91Y2ggc2NlbmFyaW9zXG4gICAgICAgICAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAgICAgICAgIC8vIENsZWFyaW5nIGRhdGEgc3RydWN0dXJlXG4gICAgICAgICAgICB0aGlzLl9fcG9zaXRpb25zID0gW107XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogVG91Y2ggbW92ZSBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgICAgICAgKiBAcGFyYW0ge051bWJlcn0gWzEuMF0gc2NhbGUgLSAuLi4uXG4gICAgICAgICAqL1xuICAgICAgICBkb1RvdWNoTW92ZSA6IGZ1bmN0aW9uICh0b3VjaGVzLCB0aW1lU3RhbXAsIHNjYWxlKSB7XG4gICAgICAgICAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgICAgICAgICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgICAgICAgICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAgICAgICAgIC8vIEFyZSB3ZSBhbHJlYWR5IGlzIGRyYWdnaW5nIG1vZGU/XG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBDb21wdXRlIG1vdmUgZGlzdGFuY2VcbiAgICAgICAgICAgICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICAgICAgICAgICAgdmFyIG1vdmVZID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2xhc3RUb3VjaFRvcDtcblxuICAgICAgICAgICAgICAgIC8vIFJlYWQgcHJldmlvdXMgc2Nyb2xsIHBvc2l0aW9uIGFuZCB6b29taW5nXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB2YXIgbGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICAgICAgICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgICAgICAgICAgICBpZiAoc2NhbGUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZWNvbXB1dGUgbGV2ZWwgYmFzZWQgb24gcHJldmlvdXMgc2NhbGUgYW5kIG5ldyBzY2FsZVxuICAgICAgICAgICAgICAgICAgICBsZXZlbCA9IGxldmVsIC8gdGhpcy5fX2xhc3RTY2FsZSAqIHNjYWxlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIExpbWl0IGxldmVsIGFjY29yZGluZyB0byBjb25maWd1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIE9ubHkgZG8gZnVydGhlciBjb21wdXRpb24gd2hlbiBjaGFuZ2UgaGFwcGVuZWRcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZExldmVsICE9PSBsZXZlbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0UmVsID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19jbGllbnRMZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRUb3VjaFRvcFJlbCA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19jbGllbnRUb3A7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSAoKGN1cnJlbnRUb3VjaExlZnRSZWwgKyBzY3JvbGxMZWZ0KSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoTGVmdFJlbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9ICgoY3VycmVudFRvdWNoVG9wUmVsICsgc2Nyb2xsVG9wKSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoVG9wUmVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0IC09IG1vdmVYICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1heFNjcm9sbExlZnQgPSB0aGlzLl9fbWF4U2Nyb2xsTGVmdDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQgfHwgc2Nyb2xsTGVmdCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IG1heFNjcm9sbExlZnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbExlZnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gQ29tcHV0ZSBuZXcgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXhTY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3AgfHwgc2Nyb2xsVG9wIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCArPSAobW92ZVkgLyAyICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcCA9IG1heFNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEtlZXAgbGlzdCBmcm9tIGdyb3dpbmcgaW5maW5pdGVseSAoaG9sZGluZyBtaW4gMTAsIG1heCAyMCBtZWFzdXJlIHBvaW50cylcbiAgICAgICAgICAgICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFRyYWNrIHNjcm9sbCBtb3ZlbWVudCBmb3IgZGVjbGVyYXRpb25cbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTeW5jIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICAgICAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgbGV2ZWwpO1xuXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgICAgICAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnID0gNTtcblxuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZVggPSBNYXRoLmFicyhjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2luaXRpYWxUb3VjaExlZnQpO1xuICAgICAgICAgICAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gdGhpcy5vcHRpb25zLnNjcm9sbGluZ1ggJiYgZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZICYmIGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG5cbiAgICAgICAgICAgICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gKHRoaXMuX19lbmFibGVTY3JvbGxYIHx8IHRoaXMuX19lbmFibGVTY3JvbGxZKSAmJiAoZGlzdGFuY2VYID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcgfHwgZGlzdGFuY2VZID49IG1pbmltdW1UcmFja2luZ0ZvckRyYWcpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBsYXN0IHRvdWNoIHBvc2l0aW9ucyBhbmQgdGltZSBzdGFtcCBmb3IgbmV4dCBldmVudFxuICAgICAgICAgICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgICAgICAgICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcbiAgICAgICAgICAgIHRoaXMuX19sYXN0VG91Y2hNb3ZlID0gdGltZVN0YW1wO1xuICAgICAgICAgICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICAgICAgICB9LFxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRvdWNoIGVuZCBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgICAgICAgKi9cbiAgICAgICAgZG9Ub3VjaEVuZCA6IGZ1bmN0aW9uICh0aW1lU3RhbXApIHtcbiAgICAgICAgICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgICAgICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWdub3JlIGV2ZW50IHdoZW4gdHJhY2tpbmcgaXMgbm90IGVuYWJsZWQgKG5vIHRvdWNoc3RhcnQgZXZlbnQgb24gZWxlbWVudClcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTm90IHRvdWNoaW5nIGFueW1vcmUgKHdoZW4gdHdvIGZpbmdlciBoaXQgdGhlIHNjcmVlbiB0aGVyZSBhcmUgdHdvIHRvdWNoIGVuZCBldmVudHMpXG4gICAgICAgICAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBCZSBzdXJlIHRvIHJlc2V0IHRoZSBkcmFnZ2luZyBmbGFnIG5vdy4gSGVyZSB3ZSBhbHNvIGRldGVjdCB3aGV0aGVyXG4gICAgICAgICAgICAvLyB0aGUgZmluZ2VyIGhhcyBtb3ZlZCBmYXN0IGVub3VnaCB0byBzd2l0Y2ggaW50byBhIGRlY2VsZXJhdGlvbiBhbmltYXRpb24uXG4gICAgICAgICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAvLyBSZXNldCBkcmFnZ2luZyBmbGFnXG4gICAgICAgICAgICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHRoZSBsYXN0IG1vdmUgZGV0ZWN0ZWQgd2FzIGluIHNvbWUgcmVsZXZhbnQgdGltZSBmcmFtZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9faXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nICYmICh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPD0gMTAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZW4gZmlndXJlIG91dCB3aGF0IHRoZSBzY3JvbGwgcG9zaXRpb24gd2FzIGFib3V0IDEwMG1zIGFnb1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVuZFBvcyA9IHBvc2l0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhcnRQb3MgPSBlbmRQb3M7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gTW92ZSBwb2ludGVyIHRvIHBvc2l0aW9uIG1lYXN1cmVkIDEwMG1zIGFnb1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gZW5kUG9zOyBpID4gMCAmJiBwb3NpdGlvbnNbaV0gPiAodGhpcy5fX2xhc3RUb3VjaE1vdmUgLSAxMDApOyBpIC09IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0UG9zID0gaTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0YXJ0IGFuZCBzdG9wIHBvc2l0aW9uIGlzIGlkZW50aWNhbCBpbiBhIDEwMG1zIHRpbWVmcmFtZSxcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgY2Fubm90IGNvbXB1dGUgYW55IHVzZWZ1bCBkZWNlbGVyYXRpb24uXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFBvcyAhPT0gZW5kUG9zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBwb3NpdGlvbnNbZW5kUG9zXSAtIHBvc2l0aW9uc1tzdGFydFBvc107XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbW92ZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQmFzZWQgb24gNTBtcyBjb21wdXRlIHRoZSBtb3ZlbWVudCB0byBhcHBseSBmb3IgZWFjaCByZW5kZXIgc3RlcFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG1vdmVkTGVmdCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8gc3RhcnQgdGhlIGRlY2VsZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wYWdpbmcgfHwgdGhpcy5vcHRpb25zLnNuYXBwaW5nID8gNCA6IDE7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA+IDEwMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoaXMgd2FzIGEgc2xvd2VyIG1vdmUgaXQgaXMgcGVyIGRlZmF1bHQgbm9uIGRlY2VsZXJhdGVkLCBidXQgdGhpc1xuICAgICAgICAgICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAgICAgICAgIC8vIFRoaXMgaXMgcGxhY2VkIG91dHNpZGUgdGhlIGNvbmRpdGlvbiBhYm92ZSB0byBpbXByb3ZlIGVkZ2UgY2FzZSBzdGFiaWxpdHlcbiAgICAgICAgICAgIC8vIGUuZy4gdG91Y2hlbmQgZmlyZWQgd2l0aG91dCBlbmFibGVkIGRyYWdnaW5nLiBUaGlzIHNob3VsZCBub3JtYWxseSBkbyBub3RcbiAgICAgICAgICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgICAgICAgICAgaWYgKCF0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0cnVlLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgICAgICAgICB0aGlzLl9fcG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gICAgICAgIH0sXG5cblxuXG4gICAgICAgIC8qXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgUFJJVkFURSBBUElcbiAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgKi9cblxuICAgICAgICAvKipcbiAgICAgICAgICogQXBwbGllcyB0aGUgc2Nyb2xsIHBvc2l0aW9uIHRvIHRoZSBjb250ZW50IGVsZW1lbnRcbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIGxlZnQge051bWJlcn0gTGVmdCBzY3JvbGwgcG9zaXRpb25cbiAgICAgICAgICogQHBhcmFtIHRvcCB7TnVtYmVyfSBUb3Agc2Nyb2xsIHBvc2l0aW9uXG4gICAgICAgICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIGFuaW1hdGlvbiBzaG91bGQgYmUgdXNlZCB0byBtb3ZlIHRvIHRoZSBuZXcgY29vcmRpbmF0ZXNcbiAgICAgICAgICovXG4gICAgICAgIF9fcHVibGlzaCA6IGZ1bmN0aW9uIChsZWZ0LCB0b3AsIHpvb20sIGlzQW5pbWF0ZWQpIHtcbiAgICAgICAgICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAgICAgICAgIC8vIGJhc2VkIG9uIHRoZSBjdXJyZW50IFwiZHJpdmVcIiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAgICAgICAgdmFyIHdhc0FuaW1hdGluZyA9IHRoaXMuX19pc0FuaW1hdGluZztcbiAgICAgICAgICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICBhbmltYXRlLnN0b3Aod2FzQW5pbWF0aW5nKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIC8vIEtlZXAgc2NoZWR1bGVkIHBvc2l0aW9ucyBmb3Igc2Nyb2xsQnkvem9vbUJ5IGZ1bmN0aW9uYWxpdHkuXG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSBsZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB6b29tO1xuXG4gICAgICAgICAgICAgICAgdmFyIG9sZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB2YXIgb2xkWm9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAgICAgICAgICAgICB2YXIgZGlmZkxlZnQgPSBsZWZ0IC0gb2xkTGVmdDtcbiAgICAgICAgICAgICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgICAgICAgICAgICB2YXIgZGlmZlpvb20gPSB6b29tIC0gb2xkWm9vbTtcblxuICAgICAgICAgICAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gb2xkTGVmdCArIChkaWZmTGVmdCAqIHBlcmNlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUxldmVsID0gb2xkWm9vbSArIChkaWZmWm9vbSAqIHBlcmNlbnQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY2FsbGJhY2sodGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMuX196b29tTGV2ZWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fX2lzQW5pbWF0aW5nID09PSBpZDtcbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFuaW1hdGlvbklkID09PSB0aGlzLl9faXNBbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQsIHRoaXMub3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbiwgd2FzQW5pbWF0aW5nID8gZWFzZU91dEN1YmljIDogZWFzZUluT3V0Q3ViaWMpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgPSBsZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgICAgICAgICAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayhsZWZ0LCB0b3AsIHpvb20pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEZpeCBtYXggc2Nyb2xsIHJhbmdlc1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVjb21wdXRlcyBzY3JvbGwgbWluaW11bSB2YWx1ZXMgYmFzZWQgb24gY2xpZW50IGRpbWVuc2lvbnMgYW5kIGNvbnRlbnQgZGltZW5zaW9ucy5cbiAgICAgICAgICovXG4gICAgICAgIF9fY29tcHV0ZVNjcm9sbE1heCA6IGZ1bmN0aW9uICh6b29tTGV2ZWwpIHtcbiAgICAgICAgICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHpvb21MZXZlbCA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX19tYXhTY3JvbGxMZWZ0ID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRXaWR0aCp6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgICAgICAgICAgdGhpcy5fX21heFNjcm9sbFRvcCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50SGVpZ2h0Knpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICAgICAgICB9LFxuXG5cblxuICAgICAgICAvKlxuICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgIEFOSU1BVElPTiAoREVDRUxFUkFUSU9OKSBTVVBQT1JUXG4gICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICovXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIENhbGxlZCB3aGVuIGEgdG91Y2ggc2VxdWVuY2UgZW5kIGFuZCB0aGUgc3BlZWQgb2YgdGhlIGZpbmdlciB3YXMgaGlnaCBlbm91Z2hcbiAgICAgICAgICogdG8gc3dpdGNoIGludG8gZGVjZWxlcmF0aW9uIG1vZGUuXG4gICAgICAgICAqL1xuICAgICAgICBfX3N0YXJ0RGVjZWxlcmF0aW9uIDogZnVuY3Rpb24gKHRpbWVTdGFtcCkge1xuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fbWF4U2Nyb2xsTGVmdCksIDApO1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fbWF4U2Nyb2xsVG9wKSwgMCk7XG4gICAgICAgICAgICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgICAgICAgICAgIHZhciBjbGllbnRIZWlnaHQgPSB0aGlzLl9fY2xpZW50SGVpZ2h0O1xuXG4gICAgICAgICAgICAgICAgLy8gV2UgbGltaXQgZGVjZWxlcmF0aW9uIG5vdCB0byB0aGUgbWluL21heCB2YWx1ZXMgb2YgdGhlIGFsbG93ZWQgcmFuZ2UsIGJ1dCB0byB0aGUgc2l6ZSBvZiB0aGUgdmlzaWJsZSBjbGllbnQgYXJlYS5cbiAgICAgICAgICAgICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICAgICAgICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmZsb29yKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5mbG9vcihzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5jZWlsKHNjcm9sbFRvcCAvIGNsaWVudEhlaWdodCkgKiBjbGllbnRIZWlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gMDtcbiAgICAgICAgICAgICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBXcmFwIGNsYXNzIG1ldGhvZFxuICAgICAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAocGVyY2VudCwgbm93LCByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICAgICAgICAgIHZhciBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyA9IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAwLjE7XG5cbiAgICAgICAgICAgIC8vIERldGVjdCB3aGV0aGVyIGl0J3Mgc3RpbGwgd29ydGggdG8gY29udGludWUgYW5pbWF0aW5nIHN0ZXBzXG4gICAgICAgICAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgICAgICAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgICAgICAgICAgIGlmICghc2hvdWxkQ29udGludWUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgY29tcGxldGVkID0gZnVuY3Rpb24gKHJlbmRlcmVkRnJhbWVzUGVyU2Vjb25kLCBhbmltYXRpb25JZCwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIEFuaW1hdGUgdG8gZ3JpZCB3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSwgb3RoZXJ3aXNlIGp1c3QgZml4IG91dC1vZi1ib3VuZGFyeSBwb3NpdGlvbnNcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAvLyBTdGFydCBhbmltYXRpb24gYW5kIHN3aXRjaCBvbiBmbGFnXG4gICAgICAgICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgICAgICAgfSxcblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWxsZWQgb24gZXZlcnkgc3RlcCBvZiB0aGUgYW5pbWF0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSBpbk1lbW9yeSB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0byBub3QgcmVuZGVyIHRoZSBjdXJyZW50IHN0ZXAsIGJ1dCBrZWVwIGl0IGluIG1lbW9yeSBvbmx5LiBVc2VkIGludGVybmFsbHkgb25seSFcbiAgICAgICAgICovXG4gICAgICAgIF9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24gOiBmdW5jdGlvbiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBDT01QVVRFIE5FWFQgU0NST0xMIFBPU0lUSU9OXG4gICAgICAgICAgICAvL1xuXG4gICAgICAgICAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgICAgICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVg7XG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVk7XG5cblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEhBUkQgTElNSVQgU0NST0xMIFBPU0lUSU9OIEZPUiBOT04gQk9VTkNJTkcgTU9ERVxuICAgICAgICAgICAgLy9cblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsTGVmdEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQsIHNjcm9sbExlZnQpLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCk7XG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbExlZnRGaXhlZCAhPT0gc2Nyb2xsTGVmdCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdEZpeGVkO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gMDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsVG9wRml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wLCBzY3JvbGxUb3ApLCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKTtcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsVG9wRml4ZWQgIT09IHNjcm9sbFRvcCkge1xuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3AgPSBzY3JvbGxUb3BGaXhlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgICAgICAgICAvL1xuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIFNMT1cgRE9XTlxuICAgICAgICAgICAgLy9cblxuICAgICAgICAgICAgLy8gU2xvdyBkb3duIHZlbG9jaXR5IG9uIGV2ZXJ5IGl0ZXJhdGlvblxuICAgICAgICAgICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgZmFjdG9yIGFwcGxpZWQgdG8gZXZlcnkgaXRlcmF0aW9uIG9mIHRoZSBhbmltYXRpb25cbiAgICAgICAgICAgICAgICAvLyB0byBzbG93IGRvd24gdGhlIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGVtdWxhdGUgbmF0dXJhbCBiZWhhdmlvciB3aGVyZVxuICAgICAgICAgICAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgICAgICAgICAgIHZhciBmcmljdGlvbkZhY3RvciA9IDAuOTU7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAgICAgICAgIC8vXG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsT3V0c2lkZVggPSAwO1xuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgICAgICAgICAgICAvLyBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24vYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllc1xuICAgICAgICAgICAgICAgIHZhciBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgICAgICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBsaW1pdHNcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsTGVmdCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxUb3AgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIFNsb3cgZG93biB1bnRpbCBzbG93IGVub3VnaCwgdGhlbiBmbGlwIGJhY2sgdG8gc25hcCBwb3NpdGlvblxuICAgICAgICAgICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKz0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBzY3JvbGxPdXRzaWRlWCAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSArPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IHNjcm9sbE91dHNpZGVZICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIFNjcm9sbGVyO1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5cbi8qKlxuICogR2VuZXJpYyBhbmltYXRpb24gY2xhc3Mgd2l0aCBzdXBwb3J0IGZvciBkcm9wcGVkIGZyYW1lcyBib3RoIG9wdGlvbmFsIGVhc2luZyBhbmQgZHVyYXRpb24uXG4gKlxuICogT3B0aW9uYWwgZHVyYXRpb24gaXMgdXNlZnVsIHdoZW4gdGhlIGxpZmV0aW1lIGlzIGRlZmluZWQgYnkgYW5vdGhlciBjb25kaXRpb24gdGhhbiB0aW1lXG4gKiBlLmcuIHNwZWVkIG9mIGFuIGFuaW1hdGluZyBvYmplY3QsIGV0Yy5cbiAqXG4gKiBEcm9wcGVkIGZyYW1lIGxvZ2ljIGFsbG93cyB0byBrZWVwIHVzaW5nIHRoZSBzYW1lIHVwZGF0ZXIgbG9naWMgaW5kZXBlbmRlbnQgZnJvbSB0aGUgYWN0dWFsXG4gKiByZW5kZXJpbmcuIFRoaXMgZWFzZXMgYSBsb3Qgb2YgY2FzZXMgd2hlcmUgaXQgbWlnaHQgYmUgcHJldHR5IGNvbXBsZXggdG8gYnJlYWsgZG93biBhIHN0YXRlXG4gKiBiYXNlZCBvbiB0aGUgcHVyZSB0aW1lIGRpZmZlcmVuY2UuXG4gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3RvcnkoKHJvb3QuYW5pbWF0ZSA9IHt9KSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3dcbiAgICB2YXIgdGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgdmFyIGRlc2lyZWRGcmFtZXMgPSA2MDtcbiAgICB2YXIgbWlsbGlzZWNvbmRzUGVyU2Vjb25kID0gMTAwMDtcbiAgICB2YXIgcnVubmluZyA9IHt9O1xuICAgIHZhciBjb3VudGVyID0gMTtcblxuICAgIC8qKlxuICAgICAqIEEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHdyYXBwZXIgLyBwb2x5ZmlsbC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259IFRoZSBjYWxsYmFjayB0byBiZSBpbnZva2VkIGJlZm9yZSB0aGUgbmV4dCByZXBhaW50LlxuICAgICAqIEBwYXJhbSByb290IHtIVE1MRWxlbWVudH0gVGhlIHJvb3QgZWxlbWVudCBmb3IgdGhlIHJlcGFpbnRcbiAgICAgKi9cbiAgICBleHBvcnRzLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIENoZWNrIGZvciByZXF1ZXN0IGFuaW1hdGlvbiBGcmFtZSBzdXBwb3J0XG4gICAgICAgIHZhciByZXF1ZXN0RnJhbWUgPSBnbG9iYWwucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IGdsb2JhbC53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgZ2xvYmFsLm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBnbG9iYWwub1JlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgdmFyIGlzTmF0aXZlID0gISFyZXF1ZXN0RnJhbWU7XG5cbiAgICAgICAgaWYgKHJlcXVlc3RGcmFtZSAmJiAhL3JlcXVlc3RBbmltYXRpb25GcmFtZVxcKFxcKVxccypcXHtcXHMqXFxbbmF0aXZlIGNvZGVcXF1cXHMqXFx9L2kudGVzdChyZXF1ZXN0RnJhbWUudG9TdHJpbmcoKSkpIHtcbiAgICAgICAgICAgIGlzTmF0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOYXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoY2FsbGJhY2ssIHJvb3QpIHtcbiAgICAgICAgICAgICAgICByZXF1ZXN0RnJhbWUoY2FsbGJhY2ssIHJvb3QpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBUQVJHRVRfRlBTID0gNjA7XG4gICAgICAgIHZhciByZXF1ZXN0cyA9IHt9O1xuICAgICAgICB2YXIgcmVxdWVzdENvdW50ID0gMDtcbiAgICAgICAgdmFyIHJhZkhhbmRsZSA9IDE7XG4gICAgICAgIHZhciBpbnRlcnZhbEhhbmRsZSA9IG51bGw7XG4gICAgICAgIHZhciBsYXN0QWN0aXZlID0gK25ldyBEYXRlKCk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChjYWxsYmFjaywgcm9vdCkge1xuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSGFuZGxlID0gcmFmSGFuZGxlKys7XG5cbiAgICAgICAgICAgIC8vIFN0b3JlIGNhbGxiYWNrXG4gICAgICAgICAgICByZXF1ZXN0c1tjYWxsYmFja0hhbmRsZV0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgIHJlcXVlc3RDb3VudCsrO1xuXG4gICAgICAgICAgICAvLyBDcmVhdGUgdGltZW91dCBhdCBmaXJzdCByZXF1ZXN0XG4gICAgICAgICAgICBpZiAoaW50ZXJ2YWxIYW5kbGUgPT09IG51bGwpIHtcblxuICAgICAgICAgICAgICAgIGludGVydmFsSGFuZGxlID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1lID0gK25ldyBEYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50UmVxdWVzdHMgPSByZXF1ZXN0cztcblxuICAgICAgICAgICAgICAgICAgICAvLyBSZXNldCBkYXRhIHN0cnVjdHVyZSBiZWZvcmUgZXhlY3V0aW5nIGNhbGxiYWNrc1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0cyA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0Q291bnQgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIGN1cnJlbnRSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRSZXF1ZXN0cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFJlcXVlc3RzW2tleV0odGltZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdEFjdGl2ZSA9IHRpbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIHRoZSB0aW1lb3V0IHdoZW4gbm90aGluZyBoYXBwZW5zIGZvciBhIGNlcnRhaW5cbiAgICAgICAgICAgICAgICAgICAgLy8gcGVyaW9kIG9mIHRpbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbWUgLSBsYXN0QWN0aXZlID4gMjUwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbEhhbmRsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnZhbEhhbmRsZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0sIDEwMDAgLyBUQVJHRVRfRlBTKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrSGFuZGxlO1xuICAgICAgICB9O1xuXG4gICAgfSkoKTtcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRoZSBnaXZlbiBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gd2FzIHN0b3BwZWQgKGFrYSwgd2FzIHJ1bm5pbmcgYmVmb3JlKVxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RvcCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgY2xlYXJlZCA9IChydW5uaW5nW2lkXSAhPT0gbnVsbCk7XG4gICAgICAgIGlmIChjbGVhcmVkKSB7XG4gICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xlYXJlZDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBnaXZlbiBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nXG4gICAgICovXG4gICAgZXhwb3J0cy5pc1J1bm5pbmcgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHJ1bm5pbmdbaWRdICE9PSBudWxsO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RlcENhbGxiYWNrIHtGdW5jdGlvbn0gUG9pbnRlciB0byBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZCBvbiBldmVyeSBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50LCBub3csIHZpcnR1YWwpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gdmVyaWZ5Q2FsbGJhY2sge0Z1bmN0aW9ufSBFeGVjdXRlZCBiZWZvcmUgZXZlcnkgYW5pbWF0aW9uIHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRDYWxsYmFjayB7RnVuY3Rpb259XG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKGRyb3BwZWRGcmFtZXMsIGZpbmlzaGVkQW5pbWF0aW9uLCBvcHRpb25hbCB3YXNGaW5pc2hlZCkge31gXG4gICAgICogQHBhcmFtIGR1cmF0aW9uIHtJbnRlZ2VyfSBNaWxsaXNlY29uZHMgdG8gcnVuIHRoZSBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0gZWFzaW5nTWV0aG9kIHtGdW5jdGlvbn0gUG9pbnRlciB0byBlYXNpbmcgZnVuY3Rpb25cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCkgeyByZXR1cm4gbW9kaWZpZWRWYWx1ZTsgfWBcbiAgICAgKiBAcGFyYW0gcm9vdCB7RWxlbWVudH0gUmVuZGVyIHJvb3QuIFVzZWQgZm9yIGludGVybmFsIHVzYWdlIG9mIHJlcXVlc3RBbmltYXRpb25GcmFtZS5cbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBJZGVudGlmaWVyIG9mIGFuaW1hdGlvbi4gQ2FuIGJlIHVzZWQgdG8gc3RvcCBpdCBhbnkgdGltZS5cbiAgICAgKi9cbiAgICBleHBvcnRzLnN0YXJ0ID0gZnVuY3Rpb24gKHN0ZXBDYWxsYmFjaywgdmVyaWZ5Q2FsbGJhY2ssIGNvbXBsZXRlZENhbGxiYWNrLCBkdXJhdGlvbiwgZWFzaW5nTWV0aG9kLCByb290KSB7XG4gICAgICAgIHZhciBzdGFydCA9IHRpbWUoKTtcbiAgICAgICAgdmFyIGxhc3RGcmFtZSA9IHN0YXJ0O1xuICAgICAgICB2YXIgcGVyY2VudCA9IDA7XG4gICAgICAgIHZhciBkcm9wQ291bnRlciA9IDA7XG4gICAgICAgIHZhciBpZCA9IGNvdW50ZXIrKztcblxuICAgICAgICAvLyBDb21wYWN0aW5nIHJ1bm5pbmcgZGIgYXV0b21hdGljYWxseSBldmVyeSBmZXcgbmV3IGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlkICUgMjAgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBuZXdSdW5uaW5nID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciB1c2VkSWQgaW4gcnVubmluZykge1xuICAgICAgICAgICAgICAgIG5ld1J1bm5pbmdbdXNlZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5uaW5nID0gbmV3UnVubmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGludGVybmFsIHN0ZXAgbWV0aG9kIHdoaWNoIGlzIGNhbGxlZCBldmVyeSBmZXcgbWlsbGlzZWNvbmRzXG4gICAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHZpcnR1YWwpIHtcblxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHZpcnR1YWwgdmFsdWVcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSB2aXJ0dWFsICE9PSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudCB0aW1lXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSgpO1xuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gaXMgZXhlY3V0ZWQgYmVmb3JlIG5leHQgYW5pbWF0aW9uIHN0ZXBcbiAgICAgICAgICAgIGlmICghcnVubmluZ1tpZF0gfHwgKHZlcmlmeUNhbGxiYWNrICYmICF2ZXJpZnlDYWxsYmFjayhpZCkpKSB7XG5cbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciB0aGUgY3VycmVudCByZW5kZXJpbmcgdG8gYXBwbHkgbGV0J3MgdXBkYXRlIG9taXR0ZWQgc3RlcHMgaW4gbWVtb3J5LlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gYnJpbmcgaW50ZXJuYWwgc3RhdGUgdmFyaWFibGVzIHVwLXRvLWRhdGUgd2l0aCBwcm9ncmVzcyBpbiB0aW1lLlxuICAgICAgICAgICAgaWYgKHJlbmRlcikge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRyb3BwZWRGcmFtZXMgPSBNYXRoLnJvdW5kKChub3cgLSBsYXN0RnJhbWUpIC8gKG1pbGxpc2Vjb25kc1BlclNlY29uZCAvIGRlc2lyZWRGcmFtZXMpKSAtIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNYXRoLm1pbihkcm9wcGVkRnJhbWVzLCA0KTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGRyb3BDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgcGVyY2VudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IChub3cgLSBzdGFydCkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHN0ZXAgY2FsbGJhY2ssIHRoZW4uLi5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVhc2luZ01ldGhvZCA/IGVhc2luZ01ldGhvZChwZXJjZW50KSA6IHBlcmNlbnQ7XG4gICAgICAgICAgICBpZiAoKHN0ZXBDYWxsYmFjayh2YWx1ZSwgbm93LCByZW5kZXIpID09PSBmYWxzZSB8fCBwZXJjZW50ID09PSAxKSAmJiByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBwZXJjZW50ID09PSAxIHx8IGR1cmF0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0RnJhbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgZXhwb3J0cy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyayBhcyBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmdbaWRdID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbml0IGZpcnN0IHN0ZXBcbiAgICAgICAgZXhwb3J0cy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG5cbiAgICAgICAgLy8gUmV0dXJuIHVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG59KSk7XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbm1vZHVsZS5leHBvcnRzLlRpbnlFbWl0dGVyID0gRTtcbiIsImltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9pbWFnZU1hbmFnZXInO1xuY29uc3QgRW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xuXG5pbnRlcmZhY2UgQ2hhckRhdGEge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdzogbnVtYmVyO1xuICBoOiBudW1iZXI7XG4gIG9mZlg6IG51bWJlcjtcbiAgb2ZmWTogbnVtYmVyO1xuICB4YWR2YW5jZTogbnVtYmVyO1xuICBrZXJuaW5nOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xufVxuXG5pbnRlcmZhY2UgQ2hhcnMge1xuICBba2V5OiBzdHJpbmddOiBDaGFyRGF0YTtcbn1cblxudHlwZSBDb25maWdMaW5lRGF0YSA9IHtcbiAgbGluZTogc3RyaW5nW107XG4gIGluZGV4OiBudW1iZXI7XG59O1xuXG5cbi8qKlxuICogaHR0cDovL3d3dy5hbmdlbGNvZGUuY29tL3Byb2R1Y3RzL2JtZm9udC9kb2MvZmlsZV9mb3JtYXQuaHRtbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBGb250IHtcbiAgcHJpdmF0ZSBjb25maWc6IHN0cmluZztcbiAgcHVibGljIGV2ZW50OiBhbnk7XG5cbiAgcHVibGljIGNoYXJzOiBDaGFycztcblxuICBwdWJsaWMgcmVhZHkgPSBmYWxzZTtcbiAgcHVibGljIHRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuICBwdWJsaWMgbGluZUhlaWdodD86IG51bWJlcjtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuXG5cbiAgLy8gcG9vbOeahOWunueOsOaUvuWIsOexu+mHjOmdouWunueOsOW5tuS4jeS8mOmbhe+8jOWFiOWOu+aOieS6hlxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY2hhcnMgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgdGhpcy5ldmVudCA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnRleHR1cmUgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHNyYywgKHRleHR1cmUsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmV2ZW50LmVtaXQoJ3RleHRfX2xvYWRfX2RvbmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ29uZmlnKGZudFRleHQ6IHN0cmluZykge1xuICAgIGZudFRleHQgPSBmbnRUZXh0LnNwbGl0KCdcXHJcXG4nKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBmbnRUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsaW5lc1BhcnNlZDogc3RyaW5nW11bXSA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUudHJpbSgpLnNwbGl0KCcgJykpO1xuXG4gICAgY29uc3QgY2hhcnNMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NoYXJzJyk7XG4gICAgY29uc3QgY2hhcnNDb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyc0xpbmUubGluZSwgJ2NvdW50Jyk7XG5cbiAgICBjb25zdCBjb21tb25MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NvbW1vbicpO1xuICAgIHRoaXMubGluZUhlaWdodCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29tbW9uTGluZS5saW5lLCAnbGluZUhlaWdodCcpO1xuXG4gICAgY29uc3QgaW5mb0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnaW5mbycpO1xuICAgIHRoaXMuZm9udFNpemUgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGluZm9MaW5lLmxpbmUsICdzaXplJyk7XG5cbiAgICAvLyDmjqXljbgga2VybmluZ3NcbiAgICBjb25zdCBrZXJuaW5nc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAna2VybmluZ3MnKTtcbiAgICBsZXQga2VybmluZ3NDb3VudCA9IDA7XG4gICAgbGV0IGtlcm5pbmdzU3RhcnQgPSAtMTtcbiAgICBpZiAoa2VybmluZ3NMaW5lLmxpbmUpIHtcbiAgICAgIGtlcm5pbmdzQ291bnQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGtlcm5pbmdzTGluZS5saW5lLCAnY291bnQnKTtcbiAgICAgIGtlcm5pbmdzU3RhcnQgPSBrZXJuaW5nc0xpbmUuaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJzOiBDaGFycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgNCArIGNoYXJzQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgY2hhclRleHQ6IHN0cmluZyA9IGxpbmVzW2ldO1xuICAgICAgY29uc3QgbGV0dGVyOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdpZCcpKTtcblxuICAgICAgY29uc3QgYzogQ2hhckRhdGEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4JyksXG4gICAgICAgIHk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5JyksXG4gICAgICAgIHc6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd3aWR0aCcpLFxuICAgICAgICBoOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaGVpZ2h0JyksXG4gICAgICAgIG9mZlg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4b2Zmc2V0JyksXG4gICAgICAgIG9mZlk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5b2Zmc2V0JyksXG4gICAgICAgIHhhZHZhbmNlOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneGFkdmFuY2UnKSxcbiAgICAgICAga2VybmluZzoge31cbiAgICAgIH07XG4gICAgICBjaGFyc1tsZXR0ZXJdID0gYztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBrZXJuaW5nc1xuICAgIGlmIChrZXJuaW5nc0NvdW50KSB7XG4gICAgICBmb3IgKGxldCBpID0ga2VybmluZ3NTdGFydDsgaSA8PSBrZXJuaW5nc1N0YXJ0ICsga2VybmluZ3NDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGZpcnN0OiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2ZpcnN0JykpO1xuICAgICAgICBjb25zdCBzZWNvbmQ6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnc2Vjb25kJykpO1xuICAgICAgICBjb25zdCBhbW91bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2Ftb3VudCcpO1xuXG4gICAgICAgIGlmIChjaGFyc1tzZWNvbmRdKSB7XG4gICAgICAgICAgY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQ6IHN0cmluZ1tdW10sIGxpbmVOYW1lID0gJycpOiBDb25maWdMaW5lRGF0YSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGVuID0gbGluZXNQYXJzZWQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcblxuICAgICAgaWYgKGl0ZW1bMF0gPT09IGxpbmVOYW1lKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgbGluZSA9IGl0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmUsXG4gICAgICBpbmRleCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29uZmlnVGV4dDogc3RyaW5nW10gfCBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbUNvbmZpZ1RleHRMaXN0ID0gQXJyYXkuaXNBcnJheShjb25maWdUZXh0KSA/IGNvbmZpZ1RleHQgOiBjb25maWdUZXh0LnNwbGl0KCcgJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGl0ZW1Db25maWdUZXh0TGlzdDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtQ29uZmlnVGV4dCA9IGl0ZW1Db25maWdUZXh0TGlzdFtpXTtcbiAgICAgIGlmIChrZXkgPT09IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZyhrZXkubGVuZ3RoICsgMSk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsImludGVyZmFjZSBEZWJ1Z0luZm9JdGVtIHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgaXNJbm5lcjogYm9vbGVhbjtcbiAgZW5kPzogbnVtYmVyO1xuICBjb3N0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z0luZm8ge1xuICBwdWJsaWMgaW5mbzogeyBba2V5OiBzdHJpbmddOiBEZWJ1Z0luZm9JdGVtIH0gPSB7fTtcbiAgcHVibGljIHRvdGFsU3RhcnQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0b3RhbENvc3Q6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RhcnQobmFtZTogc3RyaW5nLCBpc0lubmVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50b3RhbFN0YXJ0ID09PSAwKSB7XG4gICAgICB0aGlzLnRvdGFsU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5mb1tuYW1lXSA9IHtcbiAgICAgIHN0YXJ0OiBEYXRlLm5vdygpLFxuICAgICAgaXNJbm5lcixcbiAgICB9O1xuICB9XG5cbiAgZW5kKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmluZm9bbmFtZV0pIHtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5lbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmNvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy5pbmZvW25hbWVdLnN0YXJ0O1xuICAgICAgdGhpcy50b3RhbENvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy50b3RhbFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5mbyA9IHt9O1xuICAgIHRoaXMudG90YWxTdGFydCA9IDA7XG4gICAgdGhpcy50b3RhbENvc3QgPSAwO1xuICB9XG5cbiAgbG9nKG5lZWRJbm5lcjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgbG9nSW5mbyA9ICdMYXlvdXQgZGVidWcgaW5mbzogXFxuJztcbiAgICBsb2dJbmZvICs9IE9iamVjdC5rZXlzKHRoaXMuaW5mbykucmVkdWNlKChzdW0sIGN1cnIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluZm9bY3Vycl0uaXNJbm5lciAmJiAhbmVlZElubmVyKSB7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgICBzdW0gKz0gYCR7Y3Vycn06ICR7dGhpcy5pbmZvW2N1cnJdLmNvc3R9XFxuYDtcbiAgICAgIHJldHVybiBzdW07XG4gICAgfSwgJycpO1xuXG4gICAgbG9nSW5mbyArPSBgdG90YWxDb3N0OiAke3RoaXMudG90YWxDb3N0fVxcbmA7XG5cbiAgICByZXR1cm4gbG9nSW5mbztcbiAgfVxufVxuIiwiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcbmltcG9ydCB7IG5vbmUsIGNyZWF0ZUltYWdlIH0gZnJvbSAnLi91dGlsJztcblxudHlwZSBDYWxsYmFjayA9IChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIGZyb21DYWNoZTogYm9vbGVhbikgPT4gdm9pZDtcbmludGVyZmFjZSBJbWFnZUNhY2hlIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBsb2FkRG9uZTogYm9vbGVhbjtcbiAgb25sb2FkY2JrczogQ2FsbGJhY2tbXTtcbiAgb25lcnJvcmNia3M6IENhbGxiYWNrW107XG59XG5cbmNsYXNzIEltYWdlTWFuYWdlciB7XG4gIHByaXZhdGUgaW1nUG9vbCA9IG5ldyBQb29sPEltYWdlQ2FjaGU+KCdpbWdQb29sJyk7XG4gIFxuICBnZXRSZXMoc3JjOiBzdHJpbmcpOiBJbWFnZUNhY2hlIHtcbiAgICByZXR1cm4gdGhpcy5pbWdQb29sLmdldChzcmMpO1xuICB9XG5cbiAgbG9hZEltYWdlUHJvbWlzZShzcmM6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5sb2FkSW1hZ2Uoc3JjLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlKHNyYzogc3RyaW5nLCBzdWNjZXNzOiBDYWxsYmFjayA9IG5vbmUsIGZhaWw6IENhbGxiYWNrID0gbm9uZSk6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoIXNyYykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuZ2V0UmVzKHNyYyk7XG5cbiAgICAvLyDlm77niYflt7Lnu4/ooqvliqDovb3ov4fvvIznm7TmjqXov5Tlm57lm77niYflubbkuJTmiafooYzlm57osINcbiAgICBpZiAoY2FjaGUgJiYgY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIGltZyA9IGNhY2hlLmltZztcbiAgICAgIHN1Y2Nlc3MoaW1nLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGNhY2hlICYmICFjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgLy8g5Zu+54mH5q2j5Zyo5Yqg6L296L+H56iL5Lit77yM6L+U5Zue5Zu+54mH5bm25LiU562J5b6F5Zu+54mH5Yqg6L295a6M5oiQ5omn6KGM5Zue6LCDXG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG5cbiAgICAgIGNhY2hlLm9ubG9hZGNia3MucHVzaChzdWNjZXNzKTtcbiAgICAgIGNhY2hlLm9uZXJyb3JjYmtzLnB1c2goZmFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWIm+W7uuWbvueJh++8jOWwhuWbnuiwg+WHveaVsOaOqOWFpeWbnuiwg+WHveaVsOagiFxuICAgICAgaW1nID0gY3JlYXRlSW1hZ2UoKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7XG4gICAgICAgIGltZyxcbiAgICAgICAgbG9hZERvbmU6IGZhbHNlLFxuICAgICAgICBvbmxvYWRjYmtzOiBbc3VjY2Vzc10sXG4gICAgICAgIG9uZXJyb3JjYmtzOiBbZmFpbF0sXG4gICAgICB9XG4gICAgIFxuICAgICAgdGhpcy5pbWdQb29sLnNldChzcmMsIG5ld0NhY2hlKTtcblxuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUubG9hZERvbmUgPSB0cnVlO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW1hZ2VNYW5hZ2VyKCk7XG4iLCJjb25zdCBwb29sczogUG9vbDxhbnk+W10gPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbDxUPiB7XG4gIHB1YmxpYyBuYW1lID0gJ3Bvb2wnXG4gIHB1YmxpYyBwb29sOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUgPSAncG9vbCcpIHtcbiAgICBjb25zdCBjdXJyID0gcG9vbHMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG5cbiAgICBpZiAoY3Vycikge1xuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcblxuICAgIHBvb2xzLnB1c2godGhpcyk7XG4gIH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5wb29sW2tleV07XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5wb29sW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICB9XG5cbiAgZ2V0TGlzdCgpOiBUW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMucG9vbCk7XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyB3aWR0aCA9IDA7XG4gIHB1YmxpYyBoZWlnaHQgPSAwO1xuICBwdWJsaWMgbGVmdCA9IDA7XG4gIHB1YmxpYyByaWdodCA9IDA7XG4gIHB1YmxpYyB0b3AgPSAwO1xuICBwdWJsaWMgYm90dG9tID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5zZXQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNldChsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICB0aGlzLnJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm55u45LqkXG4gICAqIOWOn+eQhuWPr+ingTogaHR0cHM6Ly96aHVhbmxhbi56aGlodS5jb20vcC8yOTcwNDA2NFxuICAgKi9cbiAgaW50ZXJzZWN0cyhyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5yaWdodCA8IHJlY3QubGVmdCB8fCByZWN0LnJpZ2h0IDwgdGhpcy5sZWZ0IHx8IHRoaXMuYm90dG9tIDwgcmVjdC50b3AgfHwgcmVjdC5ib3R0b20gPCB0aGlzLnRvcCk7XG4gIH1cbn1cbiIsIlxudHlwZSBDYWxsYmFjayA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlja2VyIHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBzdGFydGVkOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgYW5pbWF0aW9uSWQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgY2JzOiBDYWxsYmFja1tdID0gW107XG4gIHByaXZhdGUgbmV4dENiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIGlubmVyQ2JzOiBDYWxsYmFja1tdID0gW107XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYigpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKCk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiAgdGhpcy5jYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgbmV4dChjYjogQ2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm5leHRDYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLmNicy5pbmRleE9mKGNiKSA+IC0xKSB7XG4gICAgICBjb25zdCBsaXN0ID0gaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMgOiB0aGlzLmNicztcbiAgICAgIGxpc3Quc3BsaWNlKHRoaXMuY2JzLmluZGV4T2YoY2IpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2JzLmxlbmd0aCAmJiAhdGhpcy5pbm5lckNicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbklkID09PSBudWxsICYmICh0aGlzLmNicy5sZW5ndGggfHwgdGhpcy5pbm5lckNicy5sZW5ndGgpKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vbmUoKSB7IH1cblxuZXhwb3J0IGludGVyZmFjZSBHYW1lVG91Y2gge1xuICB0aW1lU3RhbXA6IG51bWJlcjtcbiAgaWRlbnRpZmllcjogbnVtYmVyO1xuICBwYWdlWDogbnVtYmVyO1xuICBwYWdlWTogbnVtYmVyO1xuICBjbGllbnRYOiBudW1iZXI7XG4gIGNsaWVudFk6IG51bWJlcjtcbiAgZm9yY2U/OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2FtZVRvdWNoRXZlbnQge1xuICB0eXBlOiBzdHJpbmc7XG4gIHRpbWVTdGFtcDogbnVtYmVyO1xuICB0b3VjaGVzOiBHYW1lVG91Y2hbXTtcbiAgY2hhbmdlZFRvdWNoZXM6IEdhbWVUb3VjaFtdO1xufVxuXG5pbnRlcmZhY2UgVG91Y2hNc2cge1xuICB0b3VjaHN0YXJ0PzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgdG91Y2hlbmQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xufVxuXG4vKipcbiAqIOagueaNruinpuaRuOaXtumVv+WSjOinpuaRuOS9jee9ruWPmOWMluadpeWIpOaWreaYr+WQpuWxnuS6jueCueWHu+S6i+S7tlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNDbGljayh0b3VjaE1zZzogVG91Y2hNc2cpIHtcbiAgY29uc3Qgc3RhcnQgPSB0b3VjaE1zZy50b3VjaHN0YXJ0O1xuICBjb25zdCBlbmQgPSB0b3VjaE1zZy50b3VjaGVuZDtcblxuICBpZiAoIXN0YXJ0XG4gICAgfHwgIWVuZFxuICAgIHx8ICFzdGFydC50aW1lU3RhbXBcbiAgICB8fCAhZW5kLnRpbWVTdGFtcFxuICAgIHx8IHN0YXJ0LnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBzdGFydC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VYID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVkgPT09IHVuZGVmaW5lZFxuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBzdGFydFBvc1ggPSBzdGFydC5wYWdlWDtcbiAgY29uc3Qgc3RhcnRQb3NZID0gc3RhcnQucGFnZVk7XG5cbiAgY29uc3QgZW5kUG9zWCA9IGVuZC5wYWdlWDtcbiAgY29uc3QgZW5kUG9zWSA9IGVuZC5wYWdlWTtcblxuICBjb25zdCB0b3VjaFRpbWVzID0gZW5kLnRpbWVTdGFtcCAtIHN0YXJ0LnRpbWVTdGFtcDtcblxuICByZXR1cm4gISEoTWF0aC5hYnMoZW5kUG9zWSAtIHN0YXJ0UG9zWSkgPCAzMFxuICAgICYmIE1hdGguYWJzKGVuZFBvc1ggLSBzdGFydFBvc1gpIDwgMzBcbiAgICAmJiB0b3VjaFRpbWVzIDwgMzAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNhbnZhcygpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmKi9cbiAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX19lbnYuY3JlYXRlQ2FudmFzKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSW1hZ2UoKSB7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiovXG4gIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIF9fZW52LmNyZWF0ZUltYWdlKCk7XG4gIH1cbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xufVxuXG5sZXQgX2RwcjogbnVtYmVyO1xuLy8gb25seSBCYWlkdSBwbGF0Zm9ybSBuZWVkIHRvIHJlY2lldmUgc3lzdGVtIGluZm8gZnJvbSBtYWluIGNvbnRleHRcbmlmICh0eXBlb2Ygc3dhbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgX19lbnYub25NZXNzYWdlKChyZXM6IGFueSkgPT4ge1xuICAgIGlmIChyZXMgJiYgcmVzLnR5cGUgPT09ICdlbmdpbmUnKSB7XG4gICAgICBpZiAocmVzLmV2ZW50ID09PSAnc3lzdGVtSW5mbycpIHtcbiAgICAgICAgX2RwciA9IHJlcy5zeXN0ZW1JbmZvLmRldmljZVBpeGVsUmF0aW87XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldERwcigpIHtcbiAgLy8gcmV0dXJuIDM7XG4gIGlmICh0eXBlb2YgX2RwciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX2RwcjtcbiAgfVxuICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJyAmJiBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYykge1xuICAgIF9kcHIgPSBfX2Vudi5nZXRTeXN0ZW1JbmZvU3luYygpLmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcbiAgICBfZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSBmYWlsZWQgdG8gYWNjZXNzIGRldmljZSBwaXhlbCByYXRpbywgZmFsbGJhY2sgdG8gMScpO1xuICAgIF9kcHIgPSAxO1xuICB9XG4gIHJldHVybiBfZHByO1xufVxuXG5leHBvcnQgZW51bSBTVEFURSB7XG4gIFVOSU5JVCA9ICdVTklOSVQnLFxuICBJTklURUQgPSAnSU5JVEVEJyxcbiAgUkVOREVSRUQgPSAnUkVOREVSRUQnLFxuICBDTEVBUiA9ICdDTEVBUicsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJDYW52YXMoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4ICYmIGN0eC5jbGVhclJlY3QoMCwgMCwgY3R4LmNhbnZhcy53aWR0aCwgY3R4LmNhbnZhcy5oZWlnaHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29weVRvdWNoQXJyYXkodG91Y2hlczogR2FtZVRvdWNoW10pIHtcbiAgcmV0dXJuIHRvdWNoZXMubWFwKHRvdWNoID0+ICh7XG4gICAgaWRlbnRpZmllcjogdG91Y2guaWRlbnRpZmllcixcbiAgICBwYWdlWDogdG91Y2gucGFnZVgsXG4gICAgcGFnZVk6IHRvdWNoLnBhZ2VZLFxuICAgIGNsaWVudFg6IHRvdWNoLmNsaWVudFgsXG4gICAgY2xpZW50WTogdG91Y2guY2xpZW50WSxcbiAgfSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lVG91Y2hFdmVudChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpOiBlIGlzIEdhbWVUb3VjaEV2ZW50IHtcbiAgcmV0dXJuICd0b3VjaGVzJyBpbiBlO1xufSIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBFbGVtZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcblxuaW1wb3J0IHsgSUxheW91dCwgSUxheW91dEJveCB9IGZyb20gJy4uL2NvbXBvbmVudHMvZWxlbWVudHMnXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmludGVyZmFjZSBUcmVlTm9kZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXR0cjogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgY2hpbGRyZW46IFRyZWVOb2RlW107XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gaXNQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIC9cXGQrKD86XFwuXFxkKyk/JS8udGVzdChkYXRhKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNoYXJlZENhbnZhcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gc2hhcmVkQ2FudmFzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGFyZW50U3R5bGUgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNvbnNvbGUubG9nKGFyZ3MpO1xuICBjb25zdCBlbGVtZW50ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICAvLyBAdHMtaWdub3JlXG4gIGVsZW1lbnQucm9vdCA9IHRoaXM7XG4gIGVsZW1lbnQudGFnTmFtZSA9IG5vZGUubmFtZTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGNyZWF0ZS5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgc3R5bGUsIGFyZ3MpO1xuXG4gICAgaWYgKGNoaWxkRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW46IEVsZW1lbnRbXSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyID0gdHJ1ZSkge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIC8vIGNoaWxkLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGNoaWxkLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjaGlsZC5pbnNlcnQoY29udGV4dCwgbmVlZFJlbmRlcik7XG5cbiAgICAvLyBTY3JvbGxWaWV355qE5a2Q6IqC54K55riy5p+T5Lqk57uZU2Nyb2xsVmlld+iHquW3se+8jOS4jeaUr+aMgeW1jOWll1Njcm9sbFZpZXdcbiAgICByZXR1cm4gcmVuZGVyQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGNvbnRleHQsICBjaGlsZC50eXBlID09PSAnU2Nyb2xsVmlldycgPyBmYWxzZSA6IG5lZWRSZW5kZXIpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dENoaWxkcmVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLmxheW91dEJveCA9IGNoaWxkLmxheW91dEJveCB8fCB7fTtcblxuICAgIFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZC5sYXlvdXRCb3hbcHJvcCBhcyBrZXlvZiBJTGF5b3V0Qm94XSA9IGNoaWxkLmxheW91dD8uW3Byb3AgYXMga2V5b2YgSUxheW91dF0gYXMgbnVtYmVyO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWCB8fCAwKSArIGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWSB8fCAwKSArIGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH1cblxuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVk7XG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWDtcblxuXG4gICAgbGF5b3V0Q2hpbGRyZW4oY2hpbGQpO1xuICB9KTtcbn1cblxudHlwZSBDYWxsYmFjayA9ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZDtcblxuZnVuY3Rpb24gbm9uZSgpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVUcmVlKGVsZW1lbnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiBDYWxsYmFjayA9IG5vbmUpIHtcbiAgY2FsbGJhY2soZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGl0ZXJhdGVUcmVlKGNoaWxkLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcmVwYWludENoaWxkcmVuID0gKGNoaWxkcmVuOiBFbGVtZW50W10pID0+IHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1Njcm9sbFZpZXcnKSB7XG4gICAgICByZXBhaW50Q2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVwYWludFRyZWUgPSAodHJlZTogRWxlbWVudCkgPT4ge1xuICB0cmVlLnJlcGFpbnQoKTtcblxuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgcmVwYWludFRyZWUoY2hpbGQpO1xuICB9KTtcbn07XG5cbmludGVyZmFjZSBFbGVtZW50QXJncyB7XG4gIHN0eWxlOiBvYmplY3Q7XG4gIGlkTmFtZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgZGF0YXNldDogb2JqZWN0O1xuICBzcmM/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VCBleHRlbmRzIEVsZW1lbnQ+KHJvb3Q6IFQsIGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlLCBwYXJlbnQ/OiBFbGVtZW50KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbZWxlbWVudC50YWdOYW1lIGFzIHN0cmluZ107XG4gIC8vIEB0cy1pZ25vcmVcbiAgcm9vdC5lbGVDb3VudCArPSAxO1xuXG4gIGNvbnN0IGFyZ3M6IEVsZW1lbnRBcmdzID0ge1xuICAgIHN0eWxlOiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LnN0eWxlKSxcbiAgICBpZE5hbWU6IGVsZW1lbnQuaWROYW1lLFxuICAgIGNsYXNzTmFtZTogZWxlbWVudC5jbGFzc05hbWUsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlkOiByb290LmVsZUNvdW50LFxuICAgIGRhdGFzZXQ6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuZGF0YXNldCksXG4gIH07XG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBJbWFnZSkge1xuICAgIGFyZ3Muc3JjID0gZWxlbWVudC5zcmM7XG4gIH0gZWxzZSBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIFRleHQgfHwgZWxlbWVudCBpbnN0YW5jZW9mIEJpdE1hcFRleHQpIHtcbiAgICBhcmdzLnZhbHVlID0gZWxlbWVudC52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0IG5ld0VsZW1lbmV0ID0gbmV3IENvbnN0cnVjdG9yKGFyZ3MpO1xuICBuZXdFbGVtZW5ldC5yb290ID0gcm9vdDtcbiAgLy8gQHRzLWlnbm9yZVxuICBuZXdFbGVtZW5ldC5pbnNlcnQocm9vdC5yZW5kZXJDb250ZXh0LCBmYWxzZSk7XG4gIG5ld0VsZW1lbmV0Lm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG5cbiAgaWYgKHBhcmVudCkge1xuICAgIHBhcmVudC5hZGQobmV3RWxlbWVuZXQpO1xuICB9XG5cbiAgaWYgKGRlZXApIHtcbiAgICBlbGVtZW50LmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjbG9uZShyb290LCBjaGlsZCwgZGVlcCwgbmV3RWxlbWVuZXQpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ld0VsZW1lbmV0O1xufVxuXG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4uL2NvbW1vbi9wb29sJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgZm9udD86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ0JpdE1hcFRleHQnO1xuICBwcml2YXRlIHZhbHVlc3JjOiBzdHJpbmc7XG4gIHB1YmxpYyBmb250OiBCaXRNYXBGb250O1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElCaXRNYXBUZXh0T3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgdmFsdWUgPSAnJyxcbiAgICAgIGZvbnQgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndmFsdWUnLCB7XG4gICAgLy8gICBnZXQoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLnZhbHVlc3JjO1xuICAgIC8vICAgfSxcbiAgICAvLyAgIHNldChuZXdWYWx1ZSkge1xuICAgIC8vICAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAvLyAgICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAvLyAgICAgICB0aGlzLmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSxcbiAgICAvLyAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgLy8gfSk7XG5cbiAgICB0aGlzLmZvbnQgPSBiaXRNYXBQb29sLmdldChmb250KTtcbiAgICBpZiAoIXRoaXMuZm9udCkge1xuICAgICAgY29uc29sZS5lcnJvcihgTWlzc2luZyBCaXRtYXBGb250IFwiJHtmb250fVwiLCBwbGVhc2UgaW52b2tlIEFQSSBcInJlZ2lzdEJpdE1hcEZvbnRcIiBiZWZvcmUgdXNpbmcgXCJCaXRNYXBUZXh0XCJgKTtcbiAgICB9XG4gIH1cblxuICBnZXQgdmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLnZhbHVlc3JjKSB7XG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuZW1pdCgncmVwYWludCcpO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5mb250LnJlYWR5KSB7XG4gICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5mb250LmV2ZW50Lm9uKCd0ZXh0X19sb2FkX19kb25lJywgKCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRleHQodGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGV4dEJvdW5kcygpIHtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgeyBsZXR0ZXJTcGFjaW5nID0gMCB9ID0gc3R5bGU7XG4gICAgbGV0IHdpZHRoID0gMDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnZhbHVlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjaGFyID0gdGhpcy52YWx1ZVtpXTtcbiAgICAgIGNvbnN0IGNmZyA9IHRoaXMuZm9udC5jaGFyc1tjaGFyXTtcbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgd2lkdGggKz0gY2ZnLnc7XG5cbiAgICAgICAgaWYgKGkgPCBsZW4gLSAxKSB7XG4gICAgICAgICAgd2lkdGggKz0gbGV0dGVyU3BhY2luZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7IHdpZHRoLCBoZWlnaHQ6IHRoaXMuZm9udC5saW5lSGVpZ2h0IH07XG4gIH1cblxuICByZW5kZXJUZXh0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgY29uc3QgYm91bmRzID0gdGhpcy5nZXRUZXh0Qm91bmRzKCk7XG4gICAgY29uc3QgZGVmYXVsdExpbmVIZWlnaHQgPSB0aGlzLmZvbnQubGluZUhlaWdodCBhcyBudW1iZXI7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qge1xuICAgICAgd2lkdGggPSAwLCAvLyDmsqHmnInorr7nva7ph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIGhlaWdodCA9IDAsIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgLy8gbGluZUhlaWdodCA9IGRlZmF1bHRMaW5lSGVpZ2h0LCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICAgIHRleHRBbGlnbiwgLy8g5paH5a2X5bem5Y+z5a+56b2Q5pa55byPXG4gICAgICB2ZXJ0aWNhbEFsaWduLFxuICAgICAgbGV0dGVyU3BhY2luZyA9IDAsXG4gICAgfSA9IHN0eWxlO1xuICAgIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOmrmOW6plxuICAgIGNvbnN0IGxpbmVIZWlnaHQgPSAoc3R5bGUubGluZUhlaWdodCB8fCBkZWZhdWx0TGluZUhlaWdodCkgYXMgbnVtYmVyXG5cbiAgICAvLyDlhYPntKDljIXlm7Tnm5LnmoTlt6bkuIrop5LlnZDmoIdcbiAgICBsZXQgeCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgbGV0IHkgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3Qgc2NhbGVZID0gbGluZUhlaWdodCAvIGRlZmF1bHRMaW5lSGVpZ2h0O1xuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHNjYWxlWSAqIGJvdW5kcy53aWR0aDtcblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCB4LCB5LCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIC8vIOWmguaenOaWh+Wtl+eahOa4suafk+WMuuWfn+mrmOW6puWwj+S6juebkuWtkOmrmOW6pu+8jOmHh+eUqOWvuem9kOaWueW8j1xuICAgIGlmIChsaW5lSGVpZ2h0IDwgaGVpZ2h0KSB7XG4gICAgICBpZiAodmVydGljYWxBbGlnbiA9PT0gJ21pZGRsZScpIHtcbiAgICAgICAgeSArPSAoaGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh2ZXJ0aWNhbEFsaWduID09PSAnYm90dG9tJykge1xuICAgICAgICB5ID0geSArIGhlaWdodCAtIGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoID4gcmVhbFdpZHRoKSB7XG4gICAgICBpZiAodGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgICB4ICs9ICh3aWR0aCAtIHJlYWxXaWR0aCkgLyAyO1xuICAgICAgfSBlbHNlIGlmICh0ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgeCArPSAod2lkdGggLSByZWFsV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIOiusOW9leS4iuS4gOS4quWtl+espu+8jOaWueS+v+WkhOeQhiBrZXJuaW5nXG4gICAgbGV0IHByZXZDaGFyQ29kZSA9IG51bGw7XG5cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG5cbiAgICAgIGlmIChwcmV2Q2hhckNvZGUgJiYgY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXSkge1xuICAgICAgICB4ICs9IGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV07XG4gICAgICB9XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgY3R4LmRyYXdJbWFnZShcbiAgICAgICAgICB0aGlzLmZvbnQudGV4dHVyZSBhcyBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICAgIGNmZy54LFxuICAgICAgICAgIGNmZy55LFxuICAgICAgICAgIGNmZy53LFxuICAgICAgICAgIGNmZy5oLFxuICAgICAgICAgIHggKyBjZmcub2ZmWCAqIHNjYWxlWSxcbiAgICAgICAgICB5ICsgY2ZnLm9mZlkgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLncgKiBzY2FsZVksXG4gICAgICAgICAgY2ZnLmggKiBzY2FsZVksXG4gICAgICAgICk7XG5cbiAgICAgICAgeCArPSAoY2ZnLnhhZHZhbmNlICogc2NhbGVZICsgbGV0dGVyU3BhY2luZyk7XG5cbiAgICAgICAgcHJldkNoYXJDb2RlID0gY2hhcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgY3JlYXRlQ2FudmFzIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIElDYW52YXNPcHRpb25zIHtcbiAgc3R5bGU/OiBJU3R5bGVcbiAgaWROYW1lPzogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGRhdGFzZXQ/OiBJRGF0YXNldDtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgYXV0b0NyZWF0ZUNhbnZhcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGNhbnZhc0luc3RhbmNlOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iob3B0czogSUNhbnZhc09wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgICB3aWR0aCA9IDEwMCxcbiAgICAgIGhlaWdodCA9IDEwMCxcbiAgICAgIGF1dG9DcmVhdGVDYW52YXMgPSBmYWxzZSxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeWwj+a4uOaIj+WcuuaZr+S4i++8jHNoYXJlZENhbnZhcyDlrp7kvovkuI3mlrnkvr/oh6rliqjliJvlu7rvvIzmj5Dkvpsgc2V0dGVyIOaJi+WKqOiuvue9rlxuICAgICAqL1xuICAgIGlmIChhdXRvQ3JlYXRlQ2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gY3JlYXRlQ2FudmFzKCkgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLndpZHRoID0gTnVtYmVyKHdpZHRoKTtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UuaGVpZ2h0ID0gTnVtYmVyKGhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGNhbnZhcygpIHtcbiAgICByZXR1cm4gdGhpcy5jYW52YXNJbnN0YW5jZTtcbiAgfVxuXG4gIHNldCBjYW52YXMoY3ZzOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwpIHtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gY3ZzO1xuICB9XG5cbiAgdXBkYXRlKCkge1xuICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmNhbnZhc0luc3RhbmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgY29uc3QgZHJhd1ggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXNJbnN0YW5jZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wYXJhbS1yZWFzc2lnbiAqL1xuaW1wb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBSZWN0IGZyb20gJy4uL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgVGlueUVtaXR0ZXIgZnJvbSAndGlueS1lbWl0dGVyJztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQodHJlZTogRWxlbWVudCwgbGlzdDogRWxlbWVudFtdID0gW10sIGlkOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50QnlJZCh0cmVlOiBFbGVtZW50LCBpZDogc3RyaW5nKSB7XG4gIGNvbnN0IGxpc3QgPSBnZXRFbGVtZW50c0J5SWQodHJlZSwgW10sIGlkKTtcblxuICByZXR1cm4gbGlzdD8uWzBdIHx8IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZykge1xuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgaWYgKChjaGlsZC5jbGFzc05hbWVMaXN0IHx8IGNoaWxkLmNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNoaWxkLCBsaXN0LCBjbGFzc05hbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3Q7XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5mdW5jdGlvbiBzZXREaXJ0eShlbGU6IEVsZW1lbnQpIHtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5mdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZykge1xuICBjb25zdCByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgcmV0dXJuIHJlc3VsdFxuICAgID8ge1xuICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpLFxuICAgIH1cbiAgICA6IG51bGw7XG59XG5cbmZ1bmN0aW9uIGdldFJnYmEoaGV4OiBzdHJpbmcsIG9wYWNpdHk6IG51bWJlcikge1xuICBjb25zdCByZ2JPYmogPSBoZXhUb1JnYihoZXgpO1xuXG4gIGlmIChvcGFjaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfVxuXG4gIGlmICghcmdiT2JqKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYHJnYmEoJHtyZ2JPYmoucn0sICR7cmdiT2JqLmd9LCAke3JnYk9iai5ifSwgJHtvcGFjaXR5fSlgO1xufVxuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICByaWdodDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbn07XG5cbnR5cGUgQ2FsbGJhY2sgPSAoLi4uYXJnczogYW55W10pID0+IHZvaWQ7XG5cbmNvbnN0IGlzVmFsaWRVcmxQcm9wUmVnID0gL1xccyp1cmxcXCgoLio/KVxcKVxccyovO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBjbGFzcyDlsZ7mgKfvvIzkuIDoiKznlKjkuo7mqKHmnb/mj5Lku7ZcbiAgICovXG4gIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55omA5Zyo6IqC54K55qCR55qE5qC56IqC54K577yM5oyH5ZCRIExheW91dFxuICAgKi9cbiAgcHVibGljIHJvb3Q6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLy8gcHVibGljIEVFOiBhbnk7XG5cbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhuW9k+WJjeiKgueCueaYr+WQpuW3sue7j+aJp+ihjOmUgOavgemAu+i+ke+8jOmUgOavgeS5i+WQjuWOn+WFiOeahOWKn+iDvemDveS8muW8guW4uO+8jOS4gOiIrOS4muWKoeS+p+S4jeeUqOWFs+W/g+i/meS4qlxuICAgKi9cbiAgcHVibGljIGlzRGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOexu+S8vCBXZWIg56uv5a6e546w77yM57uZ6IqC54K55oyC5LiA5Lqb6IO95aSf6K+75YaZ55qE5bGe5oCn6ZuG5ZCIXG4gICAqIOWcqCB4bWwg5Y+v5Lul6L+Z5qC35aOw5piO5bGe5oCn77yaPHZpZXcgY2xhc3M9XCJ4eHhcIiBkYXRhLWZvbz1cImJhclwiPlxuICAgKiDlnKgganMg5L6n5Y+v5Lul6L+Z5LmI6K+75YaZ5bGe5oCn77yaXG4gICAqIGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YXNldC5mb28pOyAvLyDmjqfliLblj7DovpPlh7ogXCJiYXJcIjtcbiAgICogZWxlbWVudC5kYXRhc2V0LmZvbyA9IFwiYmFyMlwiO1xuICAgKi9cbiAgcHVibGljIGRhdGFzZXQ6IElEYXRhc2V0O1xuICBcbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwcml2YXRlIG9yaWdpblN0eWxlOiBJU3R5bGU7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgaWQgPSB1dWlkICs9IDEsXG4gICAgZGF0YXNldCA9IHt9LFxuICB9OiB7XG4gICAgc3R5bGU/OiBJU3R5bGU7XG4gICAgaWROYW1lPzogc3RyaW5nO1xuICAgIGNsYXNzTmFtZT86IHN0cmluZztcbiAgICBpZD86IG51bWJlcjtcbiAgICBkYXRhc2V0PzogSURhdGFzZXQ7XG4gIH0pIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5pZE5hbWUgPSBpZE5hbWU7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgdGhpcy5sYXlvdXRCb3ggPSB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBhYnNvbHV0ZVg6IDAsXG4gICAgICBhYnNvbHV0ZVk6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWDogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVZOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgaWYgKFxuICAgICAgc3R5bGUub3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAmJiBzdHlsZS5jb2xvclxuICAgICAgJiYgc3R5bGUuY29sb3IuaW5kZXhPZignIycpID4gLTFcbiAgICApIHtcbiAgICAgIC8vIOminOiJsuino+aekOWksei0pe+8jOmZjee6p+S4uiBoZXhcbiAgICAgIHN0eWxlLmNvbG9yID0gZ2V0UmdiYShzdHlsZS5jb2xvciwgc3R5bGUub3BhY2l0eSkgfHwgc3R5bGUuY29sb3I7XG4gICAgfVxuXG4gICAgaWYgKFxuICAgICAgc3R5bGUub3BhY2l0eSAhPT0gdW5kZWZpbmVkXG4gICAgICAmJiBzdHlsZS5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgICYmIHN0eWxlLmJhY2tncm91bmRDb2xvci5pbmRleE9mKCcjJykgPiAtMVxuICAgICkge1xuICAgICAgLy8g6aKc6Imy6Kej5p6Q5aSx6LSl77yM6ZmN57qn5Li6IGhleFxuICAgICAgc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZ2V0UmdiYShzdHlsZS5iYWNrZ3JvdW5kQ29sb3IsIHN0eWxlLm9wYWNpdHkpIHx8IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlLmJhY2tncm91bmRJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihiYWNrZ3JvdW5kSW1hZ2U6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgbGlzdCA9IGJhY2tncm91bmRJbWFnZS5tYXRjaChpc1ZhbGlkVXJsUHJvcFJlZyk7XG4gICAgICBpZiAobGlzdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBsaXN0WzFdLnJlcGxhY2UoLygnfFwiKS9nLCAnJyk7XG4gICAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodXJsLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltZztcbiAgICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgICAgdGhpcy5yb290ICYmIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke2JhY2tncm91bmRJbWFnZX0gaXMgbm90IGEgdmFsaWQgYmFja2dyb3VuZEltYWdlYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOebkeWQrOWxnuaAp+eahOWPmOWMluWIpOaWreaYr+WQpumcgOimgeaJp+ihjCByZWZsb3fjgIFyZXBhaW50IOaTjeS9nFxuICAgKiDnu4/ov4fmtYvor5XvvIxPYmplY3QuZGVmaW5lUHJvcGVydHkg5piv5LiA5Liq5q+U6L6D5oWi55qE5pa55rOV77yMIOeJueWIq+aYr+WxnuaAp+avlOi+g+WkmueahOaXtuWAmVxuICAgKiDlm6DmraTkvJrlhYjliKTmlq3mmK/lkKbmlK/mjIEgUHJveHnvvIxpTWFjIChSZXRpbmEgNUssIDI3LWluY2gsIDIwMTcp5rWL6K+V57uT5p6cXG4gICAqIOaAu+WFsSAzMTIg5Liq6IqC54K577yMb2JzZXJ2ZVN0eWxlQW5kRXZlbnTmgLvogJfml7bkuLrvvJpcbiAgICogUHJveHk6IDNtc1xuICAgKiBPYmplY3QuZGVmaW5lUHJvcGVydHk6IDIwbXNcbiAgICovXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICB0aGlzLnN0eWxlID0gbmV3IFByb3h5KHRoaXMub3JpZ2luU3R5bGUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHNldERpcnR5KGVsZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgZWxlLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdHlsZSkgYXMgSVN0eWxlO1xuICAgICAgYWxsU3R5bGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zdHlsZSwga2V5LCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdLFxuICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAgICAgaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSA9IHZhbHVlO1xuICAgICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihrZXkpID4gLTEpIHtcbiAgICAgICAgICAgICAgc2V0RGlydHkodGhpcyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVwYWludEFmZmVjdGVkU3R5bGVzLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09PSAnYmFja2dyb3VuZEltYWdlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcih2YWx1ZSk7XG4gICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuovku7blhpLms6HpgLvovpFcbiAgICBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoY2FuY2VsJywgJ3RvdWNoZW5kJywgJ2NsaWNrJ10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGUsIHRvdWNoTXNnKSA9PiB7XG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmVtaXQoZXZlbnROYW1lLCBlLCB0b3VjaE1zZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IHRoaXMuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56YeN57uY5o6l5Y+j77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZXBhaW50KCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCuea4suafk+aOpeWPo+WtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVuZGVyKCkgeyB9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQodGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQoaWQ6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlJZCh0aGlzLCBbXSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGNsYXNzTmFtZSDljIXlkKvnu5nlrprlj4LmlbDnmoTnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG4gICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gcmVtb3ZlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcblxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy51bkJpbmRFdmVudCgpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgLy8gdGhpcy5FRSA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcblxuICAgIC8vIGVsZW1lbnQg5Zyo55S75biD5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGvXG4gICAgLy8gdGhpcy5sYXlvdXRCb3ggPSBudWxsO1xuICAgIC8vIHRoaXMuc3R5bGUgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gJyc7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGFkZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xuICAgIC8vIGVsZW1lbnQucGFyZW50SWQgPSB0aGlzLmlkO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuS4gOS4quiKgueCuea3u+WKoOS9nOS4uuW9k+WJjeiKgueCueeahOWtkOiKgueCuVxuICAgKi9cbiAgYXBwZW5kQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuXG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkIFxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqL1xuICByZW5kZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgcmFkaXVzID0gc3R5bGUuYm9yZGVyUmFkaXVzIHx8IDA7XG4gICAgY29uc3QgeyBib3JkZXJXaWR0aCA9IDAgfSA9IHN0eWxlO1xuICAgIGNvbnN0IGJvcmRlclRvcExlZnRSYWRpdXMgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJUb3BSaWdodFJhZGl1cyA9IHN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSBzdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciA9ICcnIH0gPSBzdHlsZTtcbiAgICBjb25zdCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCB5ID0gYm94LmFic29sdXRlWTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGNvbnN0IGhhc1JhZGl1cyA9IHJhZGl1c1xuICAgICAgfHwgYm9yZGVyVG9wTGVmdFJhZGl1cyB8fCBib3JkZXJUb3BSaWdodFJhZGl1cyB8fCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICBjdHgubW92ZVRvKHggKyBib3JkZXJUb3BMZWZ0UmFkaXVzLCB5KTtcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCB5KTtcblxuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCBib3JkZXJUb3BSaWdodFJhZGl1cyk7XG5cbiAgICAvLyDlj7PkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzKTtcblxuICAgIC8vIOWPs+S4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyhcbiAgICAgIHggKyB3aWR0aCxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICB4ICsgd2lkdGggLSBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICApO1xuXG4gICAgLy8g5bem5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgeSArIGhlaWdodCk7XG5cbiAgICAvLyDlt6bkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMsIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMpO1xuXG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4LCB5ICsgYm9yZGVyVG9wTGVmdFJhZGl1cyk7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSwgeCArIGJvcmRlclRvcExlZnRSYWRpdXMsIHksIGJvcmRlclRvcExlZnRSYWRpdXMpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmludGVyZmFjZSBJSW1hZ2VPcHRpb25zIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZ1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIHNyYz86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWFnZSBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGltZ3NyYzogc3RyaW5nO1xuICBwdWJsaWMgdHlwZSA9ICdJbWFnZSc7XG4gIHB1YmxpYyBpbWc6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKG9wdHM6IElJbWFnZU9wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIHNyYyA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW1nc3JjID0gc3JjO1xuXG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdzcmMnLCB7XG4gICAgLy8gICBnZXQoKSB7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmltZ3NyYztcbiAgICAvLyAgIH0sXG4gICAgLy8gICBzZXQobmV3VmFsdWUpIHtcbiAgICAvLyAgICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmltZ3NyYykge1xuICAgIC8vICAgICAgIHRoaXMuaW1nc3JjID0gbmV3VmFsdWU7XG4gICAgLy8gICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgIC8vICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgLy8gICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgIC8vICAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAvLyAgICAgICAgICAgdGhpcy5yb290LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAvLyAgICAgICAgIH1cbiAgICAvLyAgICAgICB9KTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSxcbiAgICAvLyAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgLy8gICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgLy8gfSk7XG5cbiAgICB0aGlzLmltZyA9IGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWcsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCkge1xuICAgICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3JjKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW1nc3JjO1xuICB9XG5cbiAgc2V0IHNyYyhuZXdWYWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKG5ld1ZhbHVlICE9PSB0aGlzLmltZ3NyYykge1xuICAgICAgdGhpcy5pbWdzcmMgPSBuZXdWYWx1ZTtcbiAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodGhpcy5zcmMsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLmltZyA9IG51bGw7XG5cbiAgICB0aGlzLnNyYyA9ICcnO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLmltZyB8fCAhdGhpcy5pbWc/LmNvbXBsZXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgY29uc3QgZHJhd1ggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcblxuZXhwb3J0IHtcbiAgRWxlbWVudCxcbiAgVmlldyxcbiAgSW1hZ2UsXG4gIFRleHQsXG4gIFNjcm9sbFZpZXcsXG4gIEJpdE1hcFRleHQsXG4gIENhbnZhcyxcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBnZXREcHIsIGNvcHlUb3VjaEFycmF5IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgU2Nyb2xsZXIgfSBmcm9tICdzY3JvbGxlcic7XG5pbXBvcnQgeyBpdGVyYXRlVHJlZSB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IGRwciA9IGdldERwcigpO1xuXG5pbnRlcmZhY2UgSVNjcm9sbFZpZXdPcHRpb25zIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIGRhdGFzZXQ/OiBJRGF0YXNldDtcbn1cblxuaW50ZXJmYWNlIElJbm5lclNjcm9sbGVyT3B0aW9uIHtcbiAgc2Nyb2xsaW5nWD86IGJvb2xlYW47XG4gIHNjcm9sbGluZ1k/OiBib29sZWFuO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsVmlldyBleHRlbmRzIFZpZXcge1xuICBwdWJsaWMgc2Nyb2xsVG9wID0gMDtcbiAgcHVibGljIHNjcm9sbExlZnQgPSAwO1xuICBwdWJsaWMgaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIHB1YmxpYyBjdXJyZW50RXZlbnQgPSBudWxsO1xuICBwdWJsaWMgdHlwZSA9ICdTY3JvbGxWaWV3JztcbiAgXG4gIHByaXZhdGUgc2Nyb2xsWVByb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgaW5uZXJTY3JvbGxlck9wdGlvbjogSUlubmVyU2Nyb2xsZXJPcHRpb247XG5cbiAgcHJpdmF0ZSBzY3JvbGxlck9iaj86IFNjcm9sbGVyO1xuICBwcml2YXRlIGlzRmlyc3RTY3JvbGw/OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHNjcm9sbFgsXG4gICAgc2Nyb2xsWSxcbiAgICBkYXRhc2V0LFxuICB9OiBJU2Nyb2xsVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBjbGFzc05hbWUsXG4gICAgfSk7XG5cblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICAvLyBzY3JvbGx2aWV35Li656m655qE5oOF5Ya1XG4gICAgaWYgKCF0aGlzLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdCA9IHRoaXMuY2hpbGRyZW5bdGhpcy5jaGlsZHJlbi5sZW5ndGggLSAxXTtcblxuICAgIHJldHVybiBsYXN0LmxheW91dEJveC50b3AgKyBsYXN0LmxheW91dEJveC5oZWlnaHQ7XG4gIH1cblxuICBnZXQgc2Nyb2xsV2lkdGgoKSB7XG4gICAgLy8gc2Nyb2xsdmlld+S4uuepuueahOaDheWGtVxuICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3QgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICByZXR1cm4gbGFzdC5sYXlvdXRCb3gubGVmdCArIGxhc3QubGF5b3V0Qm94LndpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogdmFsdWUsXG4gICAgfTtcbiAgfVxuXG4gIGdldCBzY3JvbGxZKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24uc2Nyb2xsaW5nWTtcbiAgfVxuXG4gIHNldCBzY3JvbGxZKHZhbHVlKSB7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1k6IHZhbHVlLFxuICAgIH07XG4gIH1cblxuICBnZXQgc2Nyb2xsZXJPcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbjtcbiAgfVxuXG4gIHNldCBzY3JvbGxlck9wdGlvbih2YWx1ZTogSUlubmVyU2Nyb2xsZXJPcHRpb24pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiwgdmFsdWUpO1xuXG4gICAgaWYgKHRoaXMuc2Nyb2xsZXJPYmopIHtcbiAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5zY3JvbGxlck9iai5vcHRpb25zLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMuc2Nyb2xsUmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyB0aGlzLnRvdWNoID0gbnVsbDtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcblxuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5yb290IS5vZmYoJ3RvdWNoZW5kJyk7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlclRyZWVXaXRoVG9wKHRyZWU6IEVsZW1lbnQpIHtcbiAgICB0cmVlLnJlbmRlcigpO1xuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICBjdHgucmVjdChzdGFydFgsIHN0YXJ0WSwgd2lkdGgsIGhlaWdodCk7XG4gICAgY3R4LmNsaXAoKTtcblxuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCwgYWJzb2x1dGVYLCBhYnNvbHV0ZVkgfSA9IGNoaWxkLmxheW91dEJveDtcblxuICAgICAgLy8g5Yik5pat5aSE5LqO5Y+v6KeG56qX5Y+j5YaF55qE5a2Q6IqC54K577yM6YCS5b2S5riy5p+T6K+l5a2Q6IqC54K5XG4gICAgICBpZiAoYWJzb2x1dGVZICsgaGVpZ2h0ID49IHN0YXJ0WSAmJiBhYnNvbHV0ZVkgPD0gZW5kWVxuICAgICAgICAmJiBhYnNvbHV0ZVggKyB3aWR0aCA+PSBzdGFydFggJiYgYWJzb2x1dGVYIDw9IGVuZFgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG5cbiAgc2Nyb2xsSGFuZGxlcihsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgLy8g5Y+v6IO96KKr6ZSA5q+B5LqG5oiW6ICF6IqC54K55qCR6L+Y5rKh5YeG5aSH5aW9XG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkICYmICF0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIGl0ZXJhdGVUcmVlKHRoaXMsIChlbGUpID0+IHtcbiAgICAgICAgaWYgKGVsZSAhPT0gdGhpcykge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSBsZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8g6L+Z6YeM6KaB5oqK5rua5Yqo54q25oCB5L+d5a2Y6LW35p2l77yM5Zug5Li65ZyocmVmbG9355qE5pe25YCZ6ZyA6KaB5YGa6YeN572u77yM5riy5p+T5bm25LiN5L6d6LWW6L+Z5Lik5Liq5L+h5oGvXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuc2Nyb2xsTGVmdCA9IGxlZnQ7XG5cbiAgICAgIHRoaXMucm9vdCEuZW1pdCgncmVwYWludCcpO1xuXG4gICAgICBpZiAodGhpcy5jdXJyZW50RXZlbnQpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdzY3JvbGwnLCB0aGlzLmN1cnJlbnRFdmVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLmlzRmlyc3RTY3JvbGwpIHtcbiAgICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGluc2VydChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY29udGV4dDtcblxuICAgIC8qKlxuICAgICAqIOi/memHjOacieS4qumdnuW4uOeJueauiueahOWFvOWuuemAu+i+ke+8jOWcqOS9jueJiOacrOayoeaciemHjeaehCBTY3JvbGxWaWV35LmL5YmN77yM5bm25rKh5pyJ5o+Q5L6b5Y2V54us55qEIFNjcm9sbFgg5ZKMIFNjcm9sbFkg5bGe5oCnXG4gICAgICog6ICM5piv5Yik5patIHNjcm9sbEhlaWh0IOWkp+S6juWuueWZqOmrmOW6pueahOaXtuWAmeiHquWKqOWunueOsOS6hue6teWQkea7muWKqO+8iOS4lOayoeacieaoquWQkea7muWKqOiDveWKm++8iVxuICAgICAqIOWboOatpOi/memHjOWBmuS4gOS4quWFvOWuuemAu+i+ke+8jOWmguaenCBzY3JvbGxIZWlnaHQgPiB0aGlzLmxheW91dEJveC5oZWlnaHQg6Ieq5Yqo5byA5ZCv57q15ZCR5rua5YqoXG4gICAgICovXG4gICAgaWYgKHRoaXMuc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICYmIHR5cGVvZiB0aGlzLnNjcm9sbFlQcm9wID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbG93IOS5i+WQju+8jOS8muS7jiBjc3NsYXlvdXQg5ZCM5q2l5biD5bGA5L+h5oGv77yM5Y6f5YWI55qE5rua5Yqo5L+h5oGv5Lya5Lii5aSx77yM6L+Z6YeM6ZyA6KaB5LiA5Liq5aSN5L2N55qE5pON5L2cXG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMpIHtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWSA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgLSB0aGlzLnNjcm9sbFRvcDtcbiAgICAgICAgICBlbGUubGF5b3V0Qm94LmFic29sdXRlWCA9IGVsZS5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVggLSB0aGlzLnNjcm9sbExlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIHRoaXMuaXNGaXJzdFNjcm9sbCA9IHRydWU7XG5cbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmouc2V0RGltZW5zaW9ucyh0aGlzLmxheW91dEJveC53aWR0aCwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodCk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgIGlmICghZS50b3VjaGVzKSB7XG4gICAgICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGNvcHlUb3VjaEFycmF5KGUudG91Y2hlcyk7XG5cbiAgICAgIHRvdWNoZXMuZm9yRWFjaCgodG91Y2gpID0+IHtcbiAgICAgICAgaWYgKGRwciAhPT0gMSkge1xuICAgICAgICAgIHRvdWNoLnBhZ2VYICo9IGRwcjtcbiAgICAgICAgICB0b3VjaC5wYWdlWSAqPSBkcHI7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIHRoaXMub24oJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hNb3ZlKHRvdWNoZXMsIGUudGltZVN0YW1wKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG5dO1xuXG5jb25zdCBhbGxTdHlsZXMgPSByZWZsb3dBZmZlY3RlZFN0eWxlcy5jb25jYXQocmVwYWludEFmZmVjdGVkU3R5bGVzKTtcblxuaW50ZXJmYWNlIElTdHlsZSB7XG4gIC8vIHJlZmxvd0FmZmVjdGVkU3R5bGVzXG4gIHdpZHRoPzogbnVtYmVyO1xuICBoZWlnaHQ/OiBudW1iZXI7XG4gIG1pbldpZHRoPzogbnVtYmVyO1xuICBtaW5IZWlnaHQ/OiBudW1iZXI7XG4gIG1heFdpZHRoPzogbnVtYmVyO1xuICBtYXhIZWlnaHQ/OiBudW1iZXI7XG4gIGxlZnQ/OiBudW1iZXI7XG4gIHJpZ2h0PzogbnVtYmVyO1xuICB0b3A/OiBudW1iZXI7XG4gIGJvdHRvbT86IG51bWJlcjtcbiAgbWFyZ2luPzogbnVtYmVyO1xuICBtYXJnaW5MZWZ0PzogbnVtYmVyO1xuICBtYXJnaW5SaWdodD86IG51bWJlcjtcbiAgbWFyZ2luVG9wPzogbnVtYmVyO1xuICBtYXJnaW5Cb3R0b20/OiBudW1iZXI7XG4gIHBhZGRpbmc/OiBudW1iZXI7XG4gIHBhZGRpbmdMZWZ0PzogbnVtYmVyO1xuICBwYWRkaW5nUmlnaHQ/OiBudW1iZXI7XG4gIHBhZGRpbmdUb3A/OiBudW1iZXI7XG4gIHBhZGRpbmdCb3R0b20/OiBudW1iZXI7XG4gIGJvcmRlcldpZHRoPzogbnVtYmVyO1xuICBib3JkZXJMZWZ0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclJpZ2h0V2lkdGg/OiBudW1iZXI7XG4gIGJvcmRlclRvcFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJCb3R0b21XaWR0aD86IG51bWJlcjtcblxuICBib3JkZXJUb3BMZWZ0UmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJUb3BSaWdodFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM/OiBudW1iZXI7XG5cbiAgZmxleERpcmVjdGlvbj86ICdjb2x1bW4nIHwgJ3Jvdyc7XG4gIGZsZXhTaHJpbms/OiBudW1iZXI7XG4gIGZsZXhHcm93PzogbnVtYmVyO1xuICBmbGV4V3JhcD86ICd3cmFwJyB8ICdub3dyYXAnO1xuICBqdXN0aWZ5Q29udGVudD86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzcGFjZS1iZXR3ZWVuJyB8ICdzcGFjZS1hcm91bmQnO1xuICBhbGlnbkl0ZW1zPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBhbGlnblNlbGY/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3RyZXRjaCc7XG4gIHBvc2l0aW9uPzogJ3JlbGF0aXZlJyB8ICdhYnNvbHV0ZSc7XG5cbiAgLy8gcmVwYWludEFmZmVjdGVkU3R5bGVzXG4gIGZvbnRTaXplPzogbnVtYmVyO1xuICBsaW5lSGVpZ2h0PzogbnVtYmVyIHwgJ3N0cmluZyc7XG4gIHRleHRBbGlnbj86ICdsZWZ0JyB8ICdjZW50ZXInIHwgJ3JpZ2h0JztcbiAgdmVydGljYWxBbGlnbj86ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcbiAgY29sb3I/OiBzdHJpbmc7XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgdGV4dE92ZXJmbG93PzogJ2VsbGlwc2lzJyB8ICdjbGlwJztcbiAgbGV0dGVyU3BhY2luZz86IG51bWJlcjtcbiAgYm9yZGVyUmFkaXVzPzogbnVtYmVyO1xuICBib3JkZXJDb2xvcj86IHN0cmluZztcbiAgYm9yZGVyVG9wQ29sb3I/OiBzdHJpbmc7XG5cbiAgYmFja2dyb3VuZEltYWdlPzogc3RyaW5nO1xuICBib3JkZXJCb3R0b21Db2xvcj86IHN0cmluZztcbiAgYm9yZGVyTGVmdENvbG9yPzogc3RyaW5nO1xuICBib3JkZXJSaWdodENvbG9yPzogc3RyaW5nO1xuXG4gIG9wYWNpdHk/OiBudW1iZXI7XG4gIGZvbnRXZWlnaHQ/OiBzdHJpbmc7XG4gIGZvbnRGYW1pbHk/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB7IHJlcGFpbnRBZmZlY3RlZFN0eWxlcywgcmVmbG93QWZmZWN0ZWRTdHlsZXMsIGFsbFN0eWxlcywgSVN0eWxlIH07XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZUNhbnZhcyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmNvbnN0IERFRkFVTFRfRk9OVF9GQU1JTFkgPSAnUGluZ0ZhbmdTQy1SZWd1bGFyLCBzYW5zLXNlcmlmJztcbmxldCBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcblxuY29uc3QgZ2V0Q29udGV4dCA9ICgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPT4ge1xuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gY3JlYXRlQ2FudmFzKCk7XG4gIGNhbnZhcy53aWR0aCA9IDE7XG4gIGNhbnZhcy5oZWlnaHQgPSAxO1xuICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gIHJldHVybiBjb250ZXh0O1xufTtcblxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGgoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZykge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0Q29udGV4dCgpO1xuXG4gIGNvbnRleHQuZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7c3R5bGUuZm9udFNpemUgfHwgMTJ9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcblxuICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh2YWx1ZSkud2lkdGggfHwgMDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBwYXJzZVRleHQoc3R5bGU6IElTdHlsZSwgdmFsdWU6IHN0cmluZyk6IHN0cmluZyB7XG4gIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcblxuICBsZXQgbWF4V2lkdGggPSBzdHlsZS53aWR0aCBhcyBudW1iZXI7XG4gIGNvbnN0IHdvcmRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuXG4gIC8vIOWvueaWh+Wtl+a6ouWHuueahOWkhOeQhu+8jOm7mOiupOeUqC4uLlxuICBjb25zdCB0ZXh0T3ZlcmZsb3cgPSBzdHlsZS50ZXh0T3ZlcmZsb3cgfHwgJ2VsbGlwc2lzJztcblxuICAvLyDmloflrZfmnIDlpKfplb/luqbkuI3otoXpmZDliLZcbiAgaWYgKHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8vIOWvueS6jueUqOeCueeCueeCueWkhOeQhueahOaDheWGte+8jOWFiOWwhuacgOWkp+WuveW6puWHj+WOuy4uLueahOWuveW6plxuICBpZiAodGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICB9XG5cbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aCAtIDE7XG4gIGxldCBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcblxuICB3aGlsZSAoZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKSA+IG1heFdpZHRoICYmIGxlbmd0aCA+IDApIHtcbiAgICBsZW5ndGggLT0gMTtcbiAgICBzdHIgPSB2YWx1ZS5zdWJzdHJpbmcoMCwgbGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiAobGVuZ3RoICYmIHRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJ1xuICAgID8gYCR7c3RyfS4uLmBcbiAgICA6IHN0cik7XG59XG5cbmludGVyZmFjZSBJVGV4dFByb3BzIHtcbiAgc3R5bGU/OiBJU3R5bGU7XG4gIGlkTmFtZT86IHN0cmluZztcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbiAgZGF0YXNldD86IElEYXRhc2V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXh0IGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgdmFsdWVzcmMgPSAnJztcbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZVdpZHRoOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHB1YmxpYyBmb250U2l6ZT86IG51bWJlcjtcbiAgcHVibGljIHRleHRCYXNlbGluZTogQ2FudmFzVGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gIHB1YmxpYyBmb250ID0gJyc7XG4gIHB1YmxpYyB0ZXh0QWxpZ246IENhbnZhc1RleHRBbGlnbiA9ICdsZWZ0JztcbiAgcHVibGljIGZpbGxTdHlsZSA9ICcjMDAwMDAwJztcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICB2YWx1ZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElUZXh0UHJvcHMpIHtcbiAgICBsZXQgb3JpZ2luU3R5bGVXaWR0aCA9IHN0eWxlLndpZHRoO1xuICAgIC8vIOayoeacieiuvue9ruWuveW6pueahOaXtuWAmemAmui/h2NhbnZhc+iuoeeul+WHuuaWh+Wtl+WuveW6plxuICAgIGlmIChvcmlnaW5TdHlsZVdpZHRoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChzdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgIHZhbHVlID0gcGFyc2VUZXh0KHN0eWxlLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1RleHQnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLnZhbHVlc3JjID0gdmFsdWU7XG4gICAgdGhpcy5vcmlnaW5TdHlsZVdpZHRoID0gb3JpZ2luU3R5bGVXaWR0aDtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgaWYgKHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuc3R5bGUud2lkdGggPSBnZXRUZXh0V2lkdGgodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0eWxlLnRleHRPdmVyZmxvdyA9PT0gJ2VsbGlwc2lzJykge1xuICAgICAgICBuZXdWYWx1ZSA9IHBhcnNlVGV4dCh0aGlzLnN0eWxlLCBuZXdWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmFsdWVzcmMgPSBuZXdWYWx1ZTtcblxuICAgICAgdGhpcy5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgIGxldCB7IHBhcmVudCB9ID0gdGhpcztcbiAgICAgIHdoaWxlIChwYXJlbnQpIHtcbiAgICAgICAgcGFyZW50LmlzRGlydHkgPSB0cnVlO1xuICAgICAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvQ2FudmFzRGF0YSgpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG5cbiAgICB0aGlzLmZvbnRTaXplID0gc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgdGhpcy50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICB0aGlzLmZvbnQgPSBgJHtzdHlsZS5mb250V2VpZ2h0IHx8ICcnfSAke3N0eWxlLmZvbnRTaXplIHx8IDEyfXB4ICR7REVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuICAgIHRoaXMudGV4dEFsaWduID0gc3R5bGUudGV4dEFsaWduIHx8ICdsZWZ0JztcbiAgICB0aGlzLmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yIHx8ICcjMDAwJztcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy50b0NhbnZhc0RhdGEoKTtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICAvLyB0aGlzLnRvQ2FudmFzRGF0YSgpO1xuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IHRoaXMudGV4dEJhc2VsaW5lO1xuICAgIGN0eC5mb250ID0gdGhpcy5mb250O1xuICAgIGN0eC50ZXh0QWxpZ24gPSB0aGlzLnRleHRBbGlnbjtcblxuICAgIGxldCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgbGV0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuZmlsbFN0eWxlO1xuXG4gICAgaWYgKHRoaXMudGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgZHJhd1ggKz0gYm94LndpZHRoIC8gMjtcbiAgICB9IGVsc2UgaWYgKHRoaXMudGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICBkcmF3WCArPSBib3gud2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmxpbmVIZWlnaHQpIHtcbiAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgIGRyYXdZICs9IChzdHlsZS5saW5lSGVpZ2h0IGFzIG51bWJlcikgLyAyO1xuICAgIH1cblxuICAgIGN0eC5maWxsVGV4dChcbiAgICAgIHRoaXMudmFsdWUsXG4gICAgICBkcmF3WCxcbiAgICAgIGRyYXdZLFxuICAgICk7XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJRGF0YXNldCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5cbmludGVyZmFjZSBJVmlld09wdGlvbnMge1xuICBzdHlsZT86IElTdHlsZTtcbiAgaWROYW1lPzogc3RyaW5nO1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGRhdGFzZXQ/OiBJRGF0YXNldDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyBleHRlbmRzIEVsZW1lbnQge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVmlldyc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICAvLyDmnInkupvoioLngrnku4Xku4XkvZzkuLrlrrnlmajvvIzlrp7pmYXkuIrkuI3pnIDopoHku7vkvZXmuLLmn5PpgLvovpHvvIzov5nph4zliqDkuKrliKTmlq3lj6/ku6Xmj5Dpq5jmgKfog71cbiAgY2hlY2tOZWVkUmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yIH0gPSBzdHlsZTtcblxuICAgIHJldHVybiAhIShzdHlsZS5iYWNrZ3JvdW5kQ29sb3JcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJXaWR0aCAmJiBib3JkZXJDb2xvcilcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJUb3BXaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyVG9wQ29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJCb3R0b21Db2xvcikpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyTGVmdFdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJMZWZ0Q29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlclJpZ2h0V2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlclJpZ2h0Q29sb3IpKSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIC8vIGNvbnN0IHsgY3R4IH0gPSB0aGlzO1xuXG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IGJvcmRlcldpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgYm9yZGVyTGVmdFdpZHRoID0gc3R5bGUuYm9yZGVyTGVmdFdpZHRoIHx8IGJvcmRlcldpZHRoO1xuICAgIGNvbnN0IGJvcmRlclJpZ2h0V2lkdGggPSBzdHlsZS5ib3JkZXJSaWdodFdpZHRoIHx8IGJvcmRlcldpZHRoO1xuICAgIGNvbnN0IGJvcmRlclRvcFdpZHRoID0gc3R5bGUuYm9yZGVyVG9wV2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyQm90dG9tV2lkdGggPSBzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCB8fCBib3JkZXJXaWR0aDtcblxuICAgIC8vIHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KFxuICAgICAgICBkcmF3WCArIGJvcmRlckxlZnRXaWR0aCxcbiAgICAgICAgZHJhd1kgKyBib3JkZXJSaWdodFdpZHRoLFxuICAgICAgICBib3gud2lkdGggLSAoYm9yZGVyTGVmdFdpZHRoICsgYm9yZGVyUmlnaHRXaWR0aCksXG4gICAgICAgIGJveC5oZWlnaHQgLSAoYm9yZGVyVG9wV2lkdGggKyBib3JkZXJCb3R0b21XaWR0aCksXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgJiYgdGhpcy5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5iYWNrZ3JvdW5kSW1hZ2UsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cbiIsImlmICh0eXBlb2YgR2FtZUdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgR2FtZUdsb2JhbC5fX2VudiA9IEdhbWVHbG9iYWwud3ggfHwgR2FtZUdsb2JhbC50dCB8fCBHYW1lR2xvYmFsLnN3YW47XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgY29udmVydFRvSnNvbiA9IGZ1bmN0aW9uKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgak9iaiA9IHtcbiAgICBuYW1lOiBub2RlLnRhZ25hbWVcbiAgfTtcblxuICAvL3doZW4gbm8gY2hpbGQgbm9kZSBvciBhdHRyIGlzIHByZXNlbnRcbiAgaWYgKCghbm9kZS5jaGlsZCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5jaGlsZCkpICYmICghbm9kZS5hdHRyc01hcCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5hdHRyc01hcCkpKSB7XG4gICAgcmV0dXJuIHV0aWwuaXNFeGlzdChub2RlLnZhbCkgJiYgISFub2RlLnZhbCA/IG5vZGUudmFsIDogak9iajtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSBjcmVhdGUgYSB0ZXh0bm9kZSBpZiBub2RlIGhhcyBzb21lIHRleHRcbiAgICBpZiAodXRpbC5pc0V4aXN0KG5vZGUudmFsKSkge1xuICAgICAgaWYgKCEodHlwZW9mIG5vZGUudmFsID09PSAnc3RyaW5nJyAmJiAobm9kZS52YWwgPT09ICcnIHx8IG5vZGUudmFsID09PSBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyKSkpIHtcbiAgICAgICAgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IFwic3RyaWN0XCIpe1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gWyBub2RlLnZhbCBdO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IG5vZGUudmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICB1dGlsLm1lcmdlKGpPYmosIG5vZGUuYXR0cnNNYXAsIG9wdGlvbnMuYXJyYXlNb2RlKTtcblxuICBqT2JqLmNoaWxkcmVuID0gW107XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCggY2hpbGQgPT4ge1xuICAgIGpPYmouY2hpbGRyZW4ucHVzaChjb252ZXJ0VG9Kc29uKGNoaWxkLCBvcHRpb25zKSlcbiAgfSk7XG5cbiAgLy8gY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG5vZGUuY2hpbGQpO1xuICAvLyBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwga2V5cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgLy8gICB2YXIgdGFnbmFtZSA9IGtleXNbaW5kZXhdO1xuICAvLyAgIGlmIChub2RlLmNoaWxkW3RhZ25hbWVdICYmIG5vZGUuY2hpbGRbdGFnbmFtZV0ubGVuZ3RoID4gMSkge1xuICAvLyAgICAgak9ialt0YWduYW1lXSA9IFtdO1xuICAvLyAgICAgZm9yICh2YXIgdGFnIGluIG5vZGUuY2hpbGRbdGFnbmFtZV0pIHtcbiAgLy8gICAgICAgak9ialt0YWduYW1lXS5wdXNoKGNvbnZlcnRUb0pzb24obm9kZS5jaGlsZFt0YWduYW1lXVt0YWddLCBvcHRpb25zKSk7XG4gIC8vICAgICB9XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGlmKG9wdGlvbnMuYXJyYXlNb2RlID09PSB0cnVlKXtcbiAgLy8gICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdWzBdLCBvcHRpb25zKVxuICAvLyAgICAgICBpZih0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JylcbiAgLy8gICAgICAgICBqT2JqW3RhZ25hbWVdID0gWyByZXN1bHQgXTtcbiAgLy8gICAgICAgZWxzZVxuICAvLyAgICAgICAgIGpPYmpbdGFnbmFtZV0gPSByZXN1bHQ7XG4gIC8vICAgICB9ZWxzZSBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gIC8vICAgICAgIGpPYmpbdGFnbmFtZV0gPSBbY29udmVydFRvSnNvbihub2RlLmNoaWxkW3RhZ25hbWVdWzBdLCBvcHRpb25zKSBdO1xuICAvLyAgICAgfWVsc2V7XG4gIC8vICAgICAgIGpPYmpbdGFnbmFtZV0gPSBjb252ZXJ0VG9Kc29uKG5vZGUuY2hpbGRbdGFnbmFtZV1bMF0sIG9wdGlvbnMpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vYWRkIHZhbHVlXG4gIHJldHVybiBqT2JqO1xufTtcblxuZXhwb3J0cy5jb252ZXJ0VG9Kc29uID0gY29udmVydFRvSnNvbjtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3Qgbm9kZVRvSnNvbiA9IHJlcXVpcmUoJy4vbm9kZTJqc29uJyk7XG5jb25zdCB4bWxUb05vZGVvYmogPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCB4MnhtbG5vZGUgPSByZXF1aXJlKCcuL3htbHN0cjJ4bWxub2RlJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB2YWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpO1xuXG5leHBvcnRzLnBhcnNlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucywgdmFsaWRhdGlvbk9wdGlvbikge1xuICAgaWYoIHZhbGlkYXRpb25PcHRpb24pe1xuICAgICBpZih2YWxpZGF0aW9uT3B0aW9uID09PSB0cnVlKSB2YWxpZGF0aW9uT3B0aW9uID0ge31cblxuICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0b3IudmFsaWRhdGUoeG1sRGF0YSwgdmFsaWRhdGlvbk9wdGlvbik7XG4gICAgIGlmIChyZXN1bHQgIT09IHRydWUpIHtcbiAgICAgICB0aHJvdyBFcnJvciggcmVzdWx0LmVyci5tc2cpXG4gICAgIH1cbiAgIH1cbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCB4MnhtbG5vZGUuZGVmYXVsdE9wdGlvbnMsIHgyeG1sbm9kZS5wcm9wcyk7XG4gIHJldHVybiBub2RlVG9Kc29uLmNvbnZlcnRUb0pzb24oeG1sVG9Ob2Rlb2JqLmdldFRyYXZlcnNhbE9iaih4bWxEYXRhLCBvcHRpb25zKSwgb3B0aW9ucyk7XG59O1xuXG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGdldEFsbE1hdGNoZXMgPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoZXMgPSBbXTtcbiAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB3aGlsZSAobWF0Y2gpIHtcbiAgICBjb25zdCBhbGxtYXRjaGVzID0gW107XG4gICAgY29uc3QgbGVuID0gbWF0Y2gubGVuZ3RoO1xuICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBsZW47IGluZGV4KyspIHtcbiAgICAgIGFsbG1hdGNoZXMucHVzaChtYXRjaFtpbmRleF0pO1xuICAgIH1cbiAgICBtYXRjaGVzLnB1c2goYWxsbWF0Y2hlcyk7XG4gICAgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIH1cbiAgcmV0dXJuIG1hdGNoZXM7XG59O1xuXG5jb25zdCBkb2VzTWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICByZXR1cm4gIShtYXRjaCA9PT0gbnVsbCB8fCB0eXBlb2YgbWF0Y2ggPT09ICd1bmRlZmluZWQnKTtcbn07XG5cbmNvbnN0IGRvZXNOb3RNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgcmV0dXJuICFkb2VzTWF0Y2goc3RyaW5nLCByZWdleCk7XG59O1xuXG5leHBvcnRzLmlzRXhpc3QgPSBmdW5jdGlvbih2KSB7XG4gIHJldHVybiB0eXBlb2YgdiAhPT0gJ3VuZGVmaW5lZCc7XG59O1xuXG5leHBvcnRzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbihvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKG9iaikubGVuZ3RoID09PSAwO1xufTtcblxuLyoqXG4gKiBDb3B5IGFsbCB0aGUgcHJvcGVydGllcyBvZiBhIGludG8gYi5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0XG4gKiBAcGFyYW0geyp9IGFcbiAqL1xuZXhwb3J0cy5tZXJnZSA9IGZ1bmN0aW9uKHRhcmdldCwgYSwgYXJyYXlNb2RlKSB7XG4gIGlmIChhKSB7XG4gICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKGEpOyAvLyB3aWxsIHJldHVybiBhbiBhcnJheSBvZiBvd24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxlbiA9IGtleXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYoYXJyYXlNb2RlID09PSAnc3RyaWN0Jyl7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IFsgYVtrZXlzW2ldXSBdO1xuICAgICAgfWVsc2V7XG4gICAgICAgIHRhcmdldFtrZXlzW2ldXSA9IGFba2V5c1tpXV07XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuLyogZXhwb3J0cy5tZXJnZSA9ZnVuY3Rpb24gKGIsYSl7XG4gIHJldHVybiBPYmplY3QuYXNzaWduKGIsYSk7XG59ICovXG5cbmV4cG9ydHMuZ2V0VmFsdWUgPSBmdW5jdGlvbih2KSB7XG4gIGlmIChleHBvcnRzLmlzRXhpc3QodikpIHtcbiAgICByZXR1cm4gdjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn07XG5cbi8vIGNvbnN0IGZha2VDYWxsID0gZnVuY3Rpb24oYSkge3JldHVybiBhO307XG4vLyBjb25zdCBmYWtlQ2FsbE5vUmV0dXJuID0gZnVuY3Rpb24oKSB7fTtcblxuZXhwb3J0cy5idWlsZE9wdGlvbnMgPSBmdW5jdGlvbihvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpIHtcbiAgdmFyIG5ld09wdGlvbnMgPSB7fTtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRpb25zOyAvL2lmIHRoZXJlIGFyZSBub3Qgb3B0aW9uc1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChvcHRpb25zW3Byb3BzW2ldXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IG9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdPcHRpb25zW3Byb3BzW2ldXSA9IGRlZmF1bHRPcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld09wdGlvbnM7XG59O1xuXG5leHBvcnRzLmRvZXNNYXRjaCA9IGRvZXNNYXRjaDtcbmV4cG9ydHMuZG9lc05vdE1hdGNoID0gZG9lc05vdE1hdGNoO1xuZXhwb3J0cy5nZXRBbGxNYXRjaGVzID0gZ2V0QWxsTWF0Y2hlcztcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vQSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICBsb2NhbGVSYW5nZTogJ2EtekEtWicsXG59O1xuXG5jb25zdCBwcm9wcyA9IFsnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsICdsb2NhbGVSYW5nZSddO1xuXG4vL2NvbnN0IHRhZ3NQYXR0ZXJuID0gbmV3IFJlZ0V4cChcIjxcXFxcLz8oW1xcXFx3OlxcXFwtX1xcLl0rKVxcXFxzKlxcLz8+XCIsXCJnXCIpO1xuZXhwb3J0cy52YWxpZGF0ZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IHV0aWwuYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG5cbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLFwiXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyheXFxzKjxcXD94bWwuKj9cXD8+KS9nLFwiXCIpOy8vUmVtb3ZlIFhNTCBzdGFydGluZyB0YWdcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oPCFET0NUWVBFW1xcc1xcd1xcXCJcXC5cXC9cXC1cXDpdKyhcXFsuKlxcXSkqXFxzKj4pL2csXCJcIik7Ly9SZW1vdmUgRE9DVFlQRVxuXG4gIGNvbnN0IHRhZ3MgPSBbXTtcbiAgbGV0IHRhZ0ZvdW5kID0gZmFsc2U7XG4gIGlmICh4bWxEYXRhWzBdID09PSAnXFx1ZmVmZicpIHtcbiAgICAvLyBjaGVjayBmb3IgYnl0ZSBvcmRlciBtYXJrIChCT00pXG4gICAgeG1sRGF0YSA9IHhtbERhdGEuc3Vic3RyKDEpO1xuICB9XG4gIGNvbnN0IHJlZ3hBdHRyTmFtZSA9IG5ldyBSZWdFeHAoJ15bX3ddW1xcXFx3XFxcXC0uOl0qJCcucmVwbGFjZSgnX3cnLCAnXycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGNvbnN0IHJlZ3hUYWdOYW1lID0gbmV3IFJlZ0V4cCgnXihbd118XylbXFxcXHcuXFxcXC1fOl0qJy5yZXBsYWNlKCcoW3cnLCAnKFsnICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAvL3N0YXJ0aW5nIG9mIHRhZ1xuICAgICAgLy9yZWFkIHVudGlsIHlvdSByZWFjaCB0byAnPicgYXZvaWRpbmcgYW55ICc+JyBpbiBhdHRyaWJ1dGUgdmFsdWVcblxuICAgICAgaSsrO1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc/Jykge1xuICAgICAgICBpID0gcmVhZFBJKHhtbERhdGEsICsraSk7XG4gICAgICAgIGlmIChpLmVycikge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICchJykge1xuICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xvc2luZ1RhZyA9IGZhbHNlO1xuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9jbG9zaW5nIHRhZ1xuICAgICAgICAgIGNsb3NpbmdUYWcgPSB0cnVlO1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgICAvL3JlYWQgdGFnbmFtZVxuICAgICAgICBsZXQgdGFnTmFtZSA9ICcnO1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIDtcbiAgICAgICAgICBpIDwgeG1sRGF0YS5sZW5ndGggJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnPicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnICcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFx0JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXG4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xccic7XG4gICAgICAgICAgaSsrXG4gICAgICAgICkge1xuICAgICAgICAgIHRhZ05hbWUgKz0geG1sRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS50cmltKCk7XG4gICAgICAgIC8vY29uc29sZS5sb2codGFnTmFtZSk7XG5cbiAgICAgICAgaWYgKHRhZ05hbWVbdGFnTmFtZS5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnIHdpdGhvdXQgYXR0cmlidXRlc1xuICAgICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnN1YnN0cmluZygwLCB0YWdOYW1lLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmFsaWRhdGVUYWdOYW1lKHRhZ05hbWUsIHJlZ3hUYWdOYW1lKSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdUYWcgJyArIHRhZ05hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXN1bHQgPSByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnQXR0cmlidXRlcyBmb3IgXCInICsgdGFnTmFtZSArICdcIiBoYXZlIG9wZW4gcXVvdGUuJ319O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdHRyU3RyID0gcmVzdWx0LnZhbHVlO1xuICAgICAgICBpID0gcmVzdWx0LmluZGV4O1xuXG4gICAgICAgIGlmIChhdHRyU3RyW2F0dHJTdHIubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIGF0dHJTdHIgPSBhdHRyU3RyLnN1YnN0cmluZygwLCBhdHRyU3RyLmxlbmd0aCAtIDEpO1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAvL2NvbnRpbnVlOyAvL3RleHQgbWF5IHByZXNlbnRzIGFmdGVyIHNlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNsb3NpbmdUYWcpIHtcbiAgICAgICAgICBpZighcmVzdWx0LnRhZ0Nsb3NlZCl7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgZG9uJ3QgaGF2ZSBwcm9wZXIgY2xvc2luZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1lbHNlIGlmIChhdHRyU3RyLnRyaW0oKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnIFwiJyArIHRhZ05hbWUgKyBcIlxcXCIgY2FuJ3QgaGF2ZSBhdHRyaWJ1dGVzIG9yIGludmFsaWQgc3RhcnRpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgb3RnID0gdGFncy5wb3AoKTtcbiAgICAgICAgICAgIGlmICh0YWdOYW1lICE9PSBvdGcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ2Nsb3NpbmcgdGFnICcgKyBvdGcgKyAnIGlzIGV4cGVjdGVkIGlucGxhY2Ugb2YgJyArIHRhZ05hbWUgKyAnLid9LFxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRhZ3MucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICB0YWdGb3VuZCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvL3NraXAgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgLy9JdCBtYXkgaW5jbHVkZSBjb21tZW50cyBhbmQgQ0RBVEEgdmFsdWVcbiAgICAgICAgZm9yIChpKys7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgICAgaWYgKHhtbERhdGFbaSArIDFdID09PSAnIScpIHtcbiAgICAgICAgICAgICAgLy9jb21tZW50IG9yIENBREFUQVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSAvL2VuZCBvZiByZWFkaW5nIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICBpLS07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcgJyB8fCB4bWxEYXRhW2ldID09PSAnXFx0JyB8fCB4bWxEYXRhW2ldID09PSAnXFxuJyB8fCB4bWxEYXRhW2ldID09PSAnXFxyJykge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRDaGFyJywgbXNnOiAnY2hhciAnICsgeG1sRGF0YVtpXSArICcgaXMgbm90IGV4cGVjdGVkIC4nfX07XG4gICAgfVxuICB9XG5cbiAgaWYgKCF0YWdGb3VuZCkge1xuICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdTdGFydCB0YWcgZXhwZWN0ZWQuJ319O1xuICB9IGVsc2UgaWYgKHRhZ3MubGVuZ3RoID4gMCkge1xuICAgIHJldHVybiB7XG4gICAgICBlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ0ludmFsaWQgJyArIEpTT04uc3RyaW5naWZ5KHRhZ3MsIG51bGwsIDQpLnJlcGxhY2UoL1xccj9cXG4vZywgJycpICsgJyBmb3VuZC4nfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIFJlYWQgUHJvY2Vzc2luZyBpbnNzdHJ1Y3Rpb25zIGFuZCBza2lwXG4gKiBAcGFyYW0geyp9IHhtbERhdGFcbiAqIEBwYXJhbSB7Kn0gaVxuICovXG5mdW5jdGlvbiByZWFkUEkoeG1sRGF0YSwgaSkge1xuICB2YXIgc3RhcnQgPSBpO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PSAnPycgfHwgeG1sRGF0YVtpXSA9PSAnICcpIHtcbiAgICAgIC8vdGFnbmFtZVxuICAgICAgdmFyIHRhZ25hbWUgPSB4bWxEYXRhLnN1YnN0cihzdGFydCwgaSAtIHN0YXJ0KTtcbiAgICAgIGlmIChpID4gNSAmJiB0YWduYW1lID09PSAneG1sJykge1xuICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnWE1MIGRlY2xhcmF0aW9uIGFsbG93ZWQgb25seSBhdCB0aGUgc3RhcnQgb2YgdGhlIGRvY3VtZW50Lid9fTtcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PSAnPycgJiYgeG1sRGF0YVtpICsgMV0gPT0gJz4nKSB7XG4gICAgICAgIC8vY2hlY2sgaWYgdmFsaWQgYXR0cmlidXQgc3RyaW5nXG4gICAgICAgIGkrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGk7XG59XG5cbmZ1bmN0aW9uIHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSkge1xuICBpZiAoeG1sRGF0YS5sZW5ndGggPiBpICsgNSAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnLScpIHtcbiAgICAvL2NvbW1lbnRcbiAgICBmb3IgKGkgKz0gMzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDggJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdPJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdZJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnUCcgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ0UnXG4gICkge1xuICAgIGxldCBhbmdsZUJyYWNrZXRzQ291bnQgPSAxO1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQrKztcbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudC0tO1xuICAgICAgICBpZiAoYW5nbGVCcmFja2V0c0NvdW50ID09PSAwKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOSAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnWycgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1QnICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnWydcbiAgKSB7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDFdID09PSAnXScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBpO1xufVxuXG52YXIgZG91YmxlUXVvdGUgPSAnXCInO1xudmFyIHNpbmdsZVF1b3RlID0gXCInXCI7XG5cbi8qKlxuICogS2VlcCByZWFkaW5nIHhtbERhdGEgdW50aWwgJzwnIGlzIGZvdW5kIG91dHNpZGUgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB4bWxEYXRhXG4gKiBAcGFyYW0ge251bWJlcn0gaVxuICovXG5mdW5jdGlvbiByZWFkQXR0cmlidXRlU3RyKHhtbERhdGEsIGkpIHtcbiAgbGV0IGF0dHJTdHIgPSAnJztcbiAgbGV0IHN0YXJ0Q2hhciA9ICcnO1xuICBsZXQgdGFnQ2xvc2VkID0gZmFsc2U7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSBkb3VibGVRdW90ZSB8fCB4bWxEYXRhW2ldID09PSBzaW5nbGVRdW90ZSkge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgc3RhcnRDaGFyID0geG1sRGF0YVtpXTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhcnRDaGFyICE9PSB4bWxEYXRhW2ldKSB7XG4gICAgICAgIC8vaWYgdmF1ZSBpcyBlbmNsb3NlZCB3aXRoIGRvdWJsZSBxdW90ZSB0aGVuIHNpbmdsZSBxdW90ZXMgYXJlIGFsbG93ZWQgaW5zaWRlIHRoZSB2YWx1ZSBhbmQgdmljZSB2ZXJzYVxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9ICcnO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJz4nKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICB0YWdDbG9zZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgYXR0clN0ciArPSB4bWxEYXRhW2ldO1xuICB9XG4gIGlmIChzdGFydENoYXIgIT09ICcnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHt2YWx1ZTogYXR0clN0ciwgaW5kZXg6IGksIHRhZ0Nsb3NlZDogdGFnQ2xvc2VkfTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgYWxsIHRoZSBhdHRyaWJ1dGVzIHdoZXRoZXIgdmFsaWQgb3IgaW52YWxpZC5cbiAqL1xuY29uc3QgdmFsaWRBdHRyU3RyUmVneHAgPSBuZXcgUmVnRXhwKCcoXFxcXHMqKShbXlxcXFxzPV0rKShcXFxccyo9KT8oXFxcXHMqKFtcXCdcIl0pKChbXFxcXHNcXFxcU10pKj8pXFxcXDUpPycsICdnJyk7XG5cbi8vYXR0ciwgPVwic2RcIiwgYT1cImFtaXQnc1wiLCBhPVwic2RcImI9XCJzYWZcIiwgYWIgIGNkPVwiXCJcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKSB7XG4gIC8vY29uc29sZS5sb2coXCJzdGFydDpcIithdHRyU3RyK1wiOmVuZFwiKTtcblxuICAvL2lmKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7IC8vZW1wdHkgc3RyaW5nXG5cbiAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCB2YWxpZEF0dHJTdHJSZWd4cCk7XG4gIGNvbnN0IGF0dHJOYW1lcyA9IHt9O1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbWF0Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIC8vY29uc29sZS5sb2cobWF0Y2hlc1tpXSk7XG5cbiAgICBpZiAobWF0Y2hlc1tpXVsxXS5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vbm9zcGFjZSBiZWZvcmUgYXR0cmlidXRlIG5hbWU6IGE9XCJzZFwiYj1cInNhZlwiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaGFzIG5vIHNwYWNlIGluIHN0YXJ0aW5nLid9fTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXNbaV1bM10gPT09IHVuZGVmaW5lZCAmJiAhb3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAvL2luZGVwZW5kZW50IGF0dHJpYnV0ZTogYWJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYm9vbGVhbiBhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGlzIG5vdCBhbGxvd2VkLid9fTtcbiAgICB9XG4gICAgLyogZWxzZSBpZihtYXRjaGVzW2ldWzZdID09PSB1bmRlZmluZWQpey8vYXR0cmlidXRlIHdpdGhvdXQgdmFsdWU6IGFiPVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBlcnI6IHsgY29kZTpcIkludmFsaWRBdHRyXCIsbXNnOlwiYXR0cmlidXRlIFwiICsgbWF0Y2hlc1tpXVsyXSArIFwiIGhhcyBubyB2YWx1ZSBhc3NpZ25lZC5cIn19O1xuICAgICAgICAgICAgICAgIH0gKi9cbiAgICBjb25zdCBhdHRyTmFtZSA9IG1hdGNoZXNbaV1bMl07XG4gICAgaWYgKCF2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpKSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIGFuIGludmFsaWQgbmFtZS4nfX07XG4gICAgfVxuICAgIC8qaWYgKCFhdHRyTmFtZXMuaGFzT3duUHJvcGVydHkoYXR0ck5hbWUpKSB7Ki9cbiAgICBpZiAoICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYXR0ck5hbWVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIC8vY2hlY2sgZm9yIGR1cGxpY2F0ZSBhdHRyaWJ1dGUuXG4gICAgICBhdHRyTmFtZXNbYXR0ck5hbWVdID0gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyByZXBlYXRlZC4nfX07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gL15bX2EtekEtWl1bXFx3XFwtLjpdKiQvO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJOYW1lKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpIHtcbiAgLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSBuZXcgUmVnRXhwKHJlZ3hBdHRyTmFtZSk7XG4gIHJldHVybiB1dGlsLmRvZXNNYXRjaChhdHRyTmFtZSwgcmVneEF0dHJOYW1lKTtcbn1cblxuLy9jb25zdCBzdGFydHNXaXRoWE1MID0gbmV3IFJlZ0V4cChcIl5bWHhdW01tXVtMbF1cIik7XG4vLyAgc3RhcnRzV2l0aCA9IC9eKFthLXpBLVpdfF8pW1xcdy5cXC1fOl0qLztcblxuZnVuY3Rpb24gdmFsaWRhdGVUYWdOYW1lKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKSB7XG4gIC8qaWYodXRpbC5kb2VzTWF0Y2godGFnbmFtZSxzdGFydHNXaXRoWE1MKSkgcmV0dXJuIGZhbHNlO1xuICAgIGVsc2UqL1xuICByZXR1cm4gIXV0aWwuZG9lc05vdE1hdGNoKHRhZ25hbWUsIHJlZ3hUYWdOYW1lKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0YWduYW1lLCBwYXJlbnQsIHZhbCkge1xuICB0aGlzLnRhZ25hbWUgPSB0YWduYW1lO1xuICB0aGlzLnBhcmVudCA9IHBhcmVudDtcbiAgdGhpcy5jaGlsZCA9IHt9OyAvL2NoaWxkIHRhZ3NcbiAgdGhpcy5hdHRyc01hcCA9IHt9OyAvL2F0dHJpYnV0ZXMgbWFwXG4gIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgdGhpcy52YWwgPSB2YWw7IC8vdGV4dCBvbmx5XG4gIHRoaXMuYWRkQ2hpbGQgPSBmdW5jdGlvbihjaGlsZCkge1xuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChjaGlsZCk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSkpIHtcbiAgICAgIC8vYWxyZWFkeSBwcmVzZW50c1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXS5wdXNoKGNoaWxkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jaGlsZFtjaGlsZC50YWduYW1lXSA9IFtjaGlsZF07XG4gICAgfVxuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgeG1sTm9kZSA9IHJlcXVpcmUoJy4veG1sTm9kZScpO1xuY29uc3QgVGFnVHlwZSA9IHtPUEVOSU5HOiAxLCBDTE9TSU5HOiAyLCBTRUxGOiAzLCBDREFUQTogNH07XG5sZXQgcmVneCA9XG4gICc8KCghXFxcXFtDREFUQVxcXFxbKFtcXFxcc1xcXFxTXSo/KShdXT4pKXwoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpKFtePl0qKT58KChcXFxcLykoKFtcXFxcdzpcXFxcLS5fXSo6KT8oW1xcXFx3OlxcXFwtLl9dKykpXFxcXHMqPikpKFtePF0qKSc7XG5cbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz9bXFxcXHc6XFxcXC1cXC5fXSspKFtePl0qKT4oXFxcXHMqXCIrY2RhdGFSZWd4K1wiKSooW148XSspP1wiLFwiZ1wiKTtcbi8vY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKFwiPChcXFxcLz8pKChcXFxcdyo6KT8oW1xcXFx3OlxcXFwtXFwuX10rKSkoW14+XSopPihbXjxdKikoXCIrY2RhdGFSZWd4K1wiKFtePF0qKSkqKFtePF0rKT9cIixcImdcIik7XG5cbi8vcG9seWZpbGxcbmlmICghTnVtYmVyLnBhcnNlSW50ICYmIHdpbmRvdy5wYXJzZUludCkge1xuICBOdW1iZXIucGFyc2VJbnQgPSB3aW5kb3cucGFyc2VJbnQ7XG59XG5pZiAoIU51bWJlci5wYXJzZUZsb2F0ICYmIHdpbmRvdy5wYXJzZUZsb2F0KSB7XG4gIE51bWJlci5wYXJzZUZsb2F0ID0gd2luZG93LnBhcnNlRmxvYXQ7XG59XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhdHRyaWJ1dGVOYW1lUHJlZml4OiAnQF8nLFxuICBhdHRyTm9kZU5hbWU6IGZhbHNlLFxuICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gIGlnbm9yZUF0dHJpYnV0ZXM6IHRydWUsXG4gIGlnbm9yZU5hbWVTcGFjZTogZmFsc2UsXG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL2EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgLy9pZ25vcmVSb290RWxlbWVudCA6IGZhbHNlLFxuICBwYXJzZU5vZGVWYWx1ZTogdHJ1ZSxcbiAgcGFyc2VBdHRyaWJ1dGVWYWx1ZTogZmFsc2UsXG4gIGFycmF5TW9kZTogZmFsc2UsXG4gIHRyaW1WYWx1ZXM6IHRydWUsIC8vVHJpbSBzdHJpbmcgdmFsdWVzIG9mIHRhZyBhbmQgYXR0cmlidXRlc1xuICBjZGF0YVRhZ05hbWU6IGZhbHNlLFxuICBjZGF0YVBvc2l0aW9uQ2hhcjogJ1xcXFxjJyxcbiAgbG9jYWxlUmFuZ2U6ICcnLFxuICB0YWdWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBhdHRyVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgc3RvcE5vZGVzOiBbXVxuICAvL2RlY29kZVN0cmljdDogZmFsc2UsXG59O1xuXG5leHBvcnRzLmRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG5cbmNvbnN0IHByb3BzID0gW1xuICAnYXR0cmlidXRlTmFtZVByZWZpeCcsXG4gICdhdHRyTm9kZU5hbWUnLFxuICAndGV4dE5vZGVOYW1lJyxcbiAgJ2lnbm9yZUF0dHJpYnV0ZXMnLFxuICAnaWdub3JlTmFtZVNwYWNlJyxcbiAgJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLFxuICAncGFyc2VOb2RlVmFsdWUnLFxuICAncGFyc2VBdHRyaWJ1dGVWYWx1ZScsXG4gICdhcnJheU1vZGUnLFxuICAndHJpbVZhbHVlcycsXG4gICdjZGF0YVRhZ05hbWUnLFxuICAnY2RhdGFQb3NpdGlvbkNoYXInLFxuICAnbG9jYWxlUmFuZ2UnLFxuICAndGFnVmFsdWVQcm9jZXNzb3InLFxuICAnYXR0clZhbHVlUHJvY2Vzc29yJyxcbiAgJ3BhcnNlVHJ1ZU51bWJlck9ubHknLFxuICAnc3RvcE5vZGVzJ1xuXTtcbmV4cG9ydHMucHJvcHMgPSBwcm9wcztcblxuY29uc3QgZ2V0VHJhdmVyc2FsT2JqID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcyk7XG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvXFxyP1xcbi9nLCBcIiBcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIHhtbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLzwhLS1bXFxzXFxTXSo/LS0+L2csICcnKTsgLy9SZW1vdmUgIGNvbW1lbnRzXG5cbiAgY29uc3QgeG1sT2JqID0gbmV3IHhtbE5vZGUoJyF4bWwnKTtcbiAgbGV0IGN1cnJlbnROb2RlID0geG1sT2JqO1xuXG4gIHJlZ3ggPSByZWd4LnJlcGxhY2UoL1xcW1xcXFx3L2csICdbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UgKyAnXFxcXHcnKTtcbiAgY29uc3QgdGFnc1JlZ3ggPSBuZXcgUmVnRXhwKHJlZ3gsICdnJyk7XG4gIGxldCB0YWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICBsZXQgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIHdoaWxlICh0YWcpIHtcbiAgICBjb25zdCB0YWdUeXBlID0gY2hlY2tGb3JUYWdUeXBlKHRhZyk7XG5cbiAgICBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DTE9TSU5HKSB7XG4gICAgICAvL2FkZCBwYXJzZWQgZGF0YSB0byBwYXJlbnQgbm9kZVxuICAgICAgaWYgKGN1cnJlbnROb2RlLnBhcmVudCAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnBhcmVudC52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnBhcmVudC52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zLCBjdXJyZW50Tm9kZS5wYXJlbnQudGFnbmFtZSk7XG4gICAgICB9XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGN1cnJlbnROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLmNoaWxkID0gW11cbiAgICAgICAgaWYgKGN1cnJlbnROb2RlLmF0dHJzTWFwID09IHVuZGVmaW5lZCkgeyBjdXJyZW50Tm9kZS5hdHRyc01hcCA9IHt9fVxuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB4bWxEYXRhLnN1YnN0cihjdXJyZW50Tm9kZS5zdGFydEluZGV4ICsgMSwgdGFnLmluZGV4IC0gY3VycmVudE5vZGUuc3RhcnRJbmRleCAtIDEpXG4gICAgICB9XG4gICAgICBjdXJyZW50Tm9kZSA9IGN1cnJlbnROb2RlLnBhcmVudDtcbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0RBVEEpIHtcbiAgICAgIGlmIChvcHRpb25zLmNkYXRhVGFnTmFtZSkge1xuICAgICAgICAvL2FkZCBjZGF0YSBub2RlXG4gICAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuY2RhdGFUYWdOYW1lLCBjdXJyZW50Tm9kZSwgdGFnWzNdKTtcbiAgICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICAgIC8vZm9yIGJhY2t0cmFja2luZ1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyO1xuICAgICAgICAvL2FkZCByZXN0IHZhbHVlIHRvIHBhcmVudCBub2RlXG4gICAgICAgIGlmICh0YWdbMTRdKSB7XG4gICAgICAgICAgY3VycmVudE5vZGUudmFsICs9IHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSAoY3VycmVudE5vZGUudmFsIHx8ICcnKSArICh0YWdbM10gfHwgJycpICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLlNFTEYpIHtcbiAgICAgIGlmIChjdXJyZW50Tm9kZSAmJiB0YWdbMTRdKSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLCBjdXJyZW50Tm9kZSwgJycpO1xuICAgICAgaWYgKHRhZ1s4XSAmJiB0YWdbOF0ubGVuZ3RoID4gMCkge1xuICAgICAgICB0YWdbOF0gPSB0YWdbOF0uc3Vic3RyKDAsIHRhZ1s4XS5sZW5ndGggLSAxKTtcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy9UYWdUeXBlLk9QRU5JTkdcbiAgICAgIGNvbnN0IGNoaWxkTm9kZSA9IG5ldyB4bWxOb2RlKFxuICAgICAgICBvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSxcbiAgICAgICAgY3VycmVudE5vZGUsXG4gICAgICAgIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpXG4gICAgICApO1xuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjaGlsZE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY2hpbGROb2RlLnN0YXJ0SW5kZXg9dGFnLmluZGV4ICsgdGFnWzFdLmxlbmd0aFxuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgY3VycmVudE5vZGUgPSBjaGlsZE5vZGU7XG4gICAgfVxuXG4gICAgdGFnID0gbmV4dFRhZztcbiAgICBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgfVxuXG4gIHJldHVybiB4bWxPYmo7XG59O1xuXG5mdW5jdGlvbiBwcm9jZXNzVGFnVmFsdWUocGFyc2VkVGFncywgb3B0aW9ucywgcGFyZW50VGFnTmFtZSkge1xuICBjb25zdCB0YWdOYW1lID0gcGFyc2VkVGFnc1s3XSB8fCBwYXJlbnRUYWdOYW1lO1xuICBsZXQgdmFsID0gcGFyc2VkVGFnc1sxNF07XG4gIGlmICh2YWwpIHtcbiAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICB2YWwgPSB2YWwudHJpbSgpO1xuICAgIH1cbiAgICB2YWwgPSBvcHRpb25zLnRhZ1ZhbHVlUHJvY2Vzc29yKHZhbCwgdGFnTmFtZSk7XG4gICAgdmFsID0gcGFyc2VWYWx1ZSh2YWwsIG9wdGlvbnMucGFyc2VOb2RlVmFsdWUsIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seSk7XG4gIH1cblxuICByZXR1cm4gdmFsO1xufVxuXG5mdW5jdGlvbiBjaGVja0ZvclRhZ1R5cGUobWF0Y2gpIHtcbiAgaWYgKG1hdGNoWzRdID09PSAnXV0+Jykge1xuICAgIHJldHVybiBUYWdUeXBlLkNEQVRBO1xuICB9IGVsc2UgaWYgKG1hdGNoWzEwXSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0xPU0lORztcbiAgfSBlbHNlIGlmICh0eXBlb2YgbWF0Y2hbOF0gIT09ICd1bmRlZmluZWQnICYmIG1hdGNoWzhdLnN1YnN0cihtYXRjaFs4XS5sZW5ndGggLSAxKSA9PT0gJy8nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuU0VMRjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gVGFnVHlwZS5PUEVOSU5HO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVOYW1lU3BhY2UodGFnbmFtZSwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UpIHtcbiAgICBjb25zdCB0YWdzID0gdGFnbmFtZS5zcGxpdCgnOicpO1xuICAgIGNvbnN0IHByZWZpeCA9IHRhZ25hbWUuY2hhckF0KDApID09PSAnLycgPyAnLycgOiAnJztcbiAgICBpZiAodGFnc1swXSA9PT0gJ3htbG5zJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpZiAodGFncy5sZW5ndGggPT09IDIpIHtcbiAgICAgIHRhZ25hbWUgPSBwcmVmaXggKyB0YWdzWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFnbmFtZTtcbn1cblxuZnVuY3Rpb24gcGFyc2VWYWx1ZSh2YWwsIHNob3VsZFBhcnNlLCBwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gIGlmIChzaG91bGRQYXJzZSAmJiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGxldCBwYXJzZWQ7XG4gICAgaWYgKHZhbC50cmltKCkgPT09ICcnIHx8IGlzTmFOKHZhbCkpIHtcbiAgICAgIHBhcnNlZCA9IHZhbCA9PT0gJ3RydWUnID8gdHJ1ZSA6IHZhbCA9PT0gJ2ZhbHNlJyA/IGZhbHNlIDogdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmFsLmluZGV4T2YoJzB4JykgIT09IC0xKSB7XG4gICAgICAgIC8vc3VwcG9ydCBoZXhhIGRlY2ltYWxcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTYpO1xuICAgICAgfSBlbHNlIGlmICh2YWwuaW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgfVxuICAgICAgaWYgKHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgICAgICAgcGFyc2VkID0gU3RyaW5nKHBhcnNlZCkgPT09IHZhbCA/IHBhcnNlZCA6IHZhbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodXRpbC5pc0V4aXN0KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn1cblxuLy9UT0RPOiBjaGFuZ2UgcmVnZXggdG8gY2FwdHVyZSBOU1xuLy9jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKFwiKFtcXFxcd1xcXFwtXFxcXC5cXFxcOl0rKVxcXFxzKj1cXFxccyooWydcXFwiXSkoKC58XFxuKSo/KVxcXFwyXCIsXCJnbVwiKTtcbmNvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoJyhbXlxcXFxzPV0rKVxcXFxzKig9XFxcXHMqKFtcXCdcIl0pKC4qPylcXFxcMyk/JywgJ2cnKTtcblxuZnVuY3Rpb24gYnVpbGRBdHRyaWJ1dGVzTWFwKGF0dHJTdHIsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMgJiYgdHlwZW9mIGF0dHJTdHIgPT09ICdzdHJpbmcnKSB7XG4gICAgYXR0clN0ciA9IGF0dHJTdHIucmVwbGFjZSgvXFxyP1xcbi9nLCAnICcpO1xuICAgIC8vYXR0clN0ciA9IGF0dHJTdHIgfHwgYXR0clN0ci50cmltKCk7XG5cbiAgICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIGF0dHJzUmVneCk7XG4gICAgY29uc3QgbGVuID0gbWF0Y2hlcy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBjb25zdCBhdHRycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJOYW1lID0gcmVzb2x2ZU5hbWVTcGFjZShtYXRjaGVzW2ldWzFdLCBvcHRpb25zKTtcbiAgICAgIGlmIChhdHRyTmFtZS5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG1hdGNoZXNbaV1bNF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBtYXRjaGVzW2ldWzRdLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG9wdGlvbnMuYXR0clZhbHVlUHJvY2Vzc29yKG1hdGNoZXNbaV1bNF0sIGF0dHJOYW1lKTtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSBwYXJzZVZhbHVlKFxuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VBdHRyaWJ1dGVWYWx1ZSxcbiAgICAgICAgICAgIG9wdGlvbnMucGFyc2VUcnVlTnVtYmVyT25seVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAoIU9iamVjdC5rZXlzKGF0dHJzKS5sZW5ndGgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuYXR0ck5vZGVOYW1lKSB7XG4gICAgICBjb25zdCBhdHRyQ29sbGVjdGlvbiA9IHt9O1xuICAgICAgYXR0ckNvbGxlY3Rpb25bb3B0aW9ucy5hdHRyTm9kZU5hbWVdID0gYXR0cnM7XG4gICAgICByZXR1cm4gYXR0ckNvbGxlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBhdHRycztcbiAgfVxufVxuXG5leHBvcnRzLmdldFRyYXZlcnNhbE9iaiA9IGdldFRyYXZlcnNhbE9iajtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuZXhwb3J0IGNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyKCk7XG5jb25zdCBpbWdQb29sID0gbmV3IFBvb2woJ2ltZ1Bvb2wnKTtcbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbCgnYml0TWFwUG9vbCcpO1xuY29uc3QgZGVidWdJbmZvID0gbmV3IERlYnVnSW5mbygpO1xuXG5pbnRlcmZhY2UgSVZpZXdQb3J0IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJVmlld1BvcnRCb3gge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBFdmVudEhhbmRsZXJEYXRhIHtcbiAgdG91Y2hNc2c6IHtcbiAgICBba2V5OiBzdHJpbmddOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB9O1xuICBoYW5kbGVyczoge1xuICAgIHRvdWNoU3RhcnQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hNb3ZlOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoRW5kOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoQ2FuY2VsOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICB9O1xufVxuXG5jbGFzcyBMYXlvdXQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHVibGljIHZlcnNpb24gPSAnMS4wLjInO1xuICBwdWJsaWMgaGFzRXZlbnRIYW5kbGVyID0gZmFsc2U7XG4gIHB1YmxpYyByZW5kZXJDb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIHJlbmRlcnBvcnQ6IElWaWV3UG9ydCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydDogSVZpZXdQb3J0Qm94ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICB4OiAwLFxuICAgIHk6IDAsXG4gIH07XG4gIHB1YmxpYyB2aWV3cG9ydFNjYWxlID0gMTtcbiAgcHVibGljIGhhc1ZpZXdQb3J0U2V0ID0gZmFsc2U7XG4gIHB1YmxpYyByZWFsTGF5b3V0Qm94OiB7XG4gICAgcmVhbFg6IG51bWJlcjtcbiAgICByZWFsWTogbnVtYmVyO1xuICB9ID0ge1xuICAgIHJlYWxYOiAwLFxuICAgIHJlYWxZOiAwLFxuICB9O1xuXG4gIHB1YmxpYyBiaXRNYXBGb250czogQml0TWFwRm9udFtdID0gW107XG4gIHB1YmxpYyBlbGVDb3VudCA9IDA7XG4gIHB1YmxpYyBzdGF0ZTogU1RBVEUgPSBTVEFURS5VTklOSVQ7XG4gIHB1YmxpYyBpc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gIHB1YmxpYyB0aWNrZXI6IFRpY2tlciA9IG5ldyBUaWNrZXIoKTtcbiAgcHVibGljIHRpY2tlckZ1bmMgPSAoKSA9PiB7XG4gICAgLy8gVFdFRU4udXBkYXRlKCk7XG4gICAgaWYgKHRoaXMuaXNEaXJ0eSkge1xuICAgICAgdGhpcy5yZWZsb3coKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNOZWVkUmVwYWludCkge1xuICAgICAgdGhpcy5yZXBhaW50KCk7XG4gICAgfVxuICB9O1xuXG4gIHByaXZhdGUgZXZlbnRIYW5kbGVyRGF0YTogRXZlbnRIYW5kbGVyRGF0YTtcbiAgXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgdG91Y2hNc2c6IHt9LFxuICAgICAgaGFuZGxlcnM6IHtcbiAgICAgICAgdG91Y2hTdGFydDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoc3RhcnQnKSxcbiAgICAgICAgdG91Y2hNb3ZlOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2htb3ZlJyksXG4gICAgICAgIHRvdWNoRW5kOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hlbmQnKSxcbiAgICAgICAgdG91Y2hDYW5jZWw6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGNhbmNlbCcpLFxuICAgICAgfSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog5a+55LqO5LiN5Lya5b2x5ZON5biD5bGA55qE5pS55Yqo77yM5q+U5aaC5Zu+54mH5Y+q5piv5pS55Liq5Zyw5Z2A44CB5Yqg5Liq6IOM5pmv6Imy5LmL57G755qE5pS55Yqo77yM5Lya6Kem5Y+RIExheW91dCDnmoQgcmVwYWludCDmk43kvZxcbiAgICAgKiDop6blj5HnmoTmlrnlvI/mmK/nu5kgTGF5b3V0IOaKm+S4qiBgcmVwYWludGAg55qE5LqL5Lu277yM5Li65LqG5oCn6IO977yM5q+P5qyh5o6l5pS25YiwIHJlcGFpbnQg6K+35rGC5LiN5Lya5omn6KGM55yf5q2j55qE5riy5p+TXG4gICAgICog6ICM5piv5omn6KGM5LiA5Liq572u6ISP5pON5L2c77yMdGlja2VyIOavj+S4gOasoeaJp+ihjCB1cGRhdGUg5Lya5qOA5p+l6L+Z5Liq5qCH6K6w5L2N77yM6L+b6ICM5omn6KGM55yf5q2j55qE6YeN57uY5pON5L2cXG4gICAgICovXG4gICAgLy8gdGhpcy5pc05lZWRSZXBhaW50ID0gZmFsc2U7XG5cbiAgICB0aGlzLm9uKCdyZXBhaW50JywgKCkgPT4ge1xuICAgICAgdGhpcy5pc05lZWRSZXBhaW50ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8vIHRoaXMudGlja2VyID0gbmV3IFRpY2tlcigpO1xuXG4gICAgLyoqXG4gICAgICog5bCGIFR3ZWVuIOaMgui9veWIsCBMYXlvdXTvvIzlr7nkuo4gVHdlZW4g55qE5L2/55So5a6M5YWo6YG15b6qIFR3ZWVuLmpzIOeahOaWh+aho1xuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL1xuICAgICAqIOWPquS4jei/h+W9kyBUd2VlbiDmlLnliqjkuoboioLngrnkvJrop6blj5EgcmVwYWludOOAgXJlZmxvdyDnmoTlsZ7mgKfml7bvvIxMYXlvdXQg5Lya5omn6KGM55u45bqU55qE5pON5L2cXG4gICAgICog5Lia5Yqh5L6n5LiN55So5oSf55+l5YiwIHJlcGFpbnQg5ZKMIHJlZmxvd1xuICAgICAqL1xuICAgIC8vIHRoaXMuVFdFRU4gPSBUV0VFTjtcbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0gdiR7dGhpcy52ZXJzaW9ufWApO1xuICB9XG5cbiAgLy8g5LiO6ICB54mI5pys5YW85a65XG4gIGdldCBkZWJ1Z0luZm8oKSB7XG4gICAgbGV0IGluZm8gPSBkZWJ1Z0luZm8ubG9nKCk7XG5cbiAgICBpbmZvICs9IGBlbGVtZW50Q291bnQ6ICR7dGhpcy5lbGVDb3VudH1cXG5gO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICAvKipcbiAgICog5pu05paw6KKr57uY5Yi2Y2FudmFz55qE56qX5Y+j5L+h5oGv77yM5pys5riy5p+T5byV5pOO5bm25LiN5YWz5b+D5piv5ZCm5Lya5ZKM5YW25LuW5ri45oiP5byV5pOO5YWx5ZCM5L2/55SoXG4gICAqIOiAjOacrOi6q+WPiOmcgOimgeaUr+aMgeS6i+S7tuWkhOeQhu+8jOWboOatpO+8jOWmguaenOiiq+a4suafk+WGheWuueaYr+e7mOWItuWIsOemu+Wxj2NhbnZhc++8jOmcgOimgeWwhuacgOe7iOe7mOWItuWcqOWxj+W5leS4ilxuICAgKiDnmoTnu53lr7nlsLrlr7jlkozkvY3nva7kv6Hmga/mm7TmlrDliLDmnKzmuLLmn5PlvJXmk47jgIJcbiAgICog5YW25Lit77yMd2lkdGjkuLrniannkIblg4/ntKDlrr3luqbvvIxoZWlnaHTkuLrniannkIblg4/ntKDpq5jluqbvvIx45Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgeOWdkOagh++8jHnkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKBcbiAgICogeeWdkOagh1xuICAgKi9cbiAgdXBkYXRlVmlld1BvcnQoYm94OiBJVmlld1BvcnRCb3gpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gYm94LndpZHRoIHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBib3guaGVpZ2h0IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gYm94LnggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSBib3gueSB8fCAwO1xuXG4gICAgdGhpcy5yZWFsTGF5b3V0Qm94ID0ge1xuICAgICAgcmVhbFg6IHRoaXMudmlld3BvcnQueCxcbiAgICAgIHJlYWxZOiB0aGlzLnZpZXdwb3J0LnksXG4gICAgfTtcblxuICAgIHRoaXMuaGFzVmlld1BvcnRTZXQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yOiBDYWxsYmFjaykge1xuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdCcpO1xuICAgIGNvbnN0IHBhcnNlQ29uZmlnID0ge1xuICAgICAgYXR0cmlidXRlTmFtZVByZWZpeDogJycsXG4gICAgICBhdHRyTm9kZU5hbWU6ICdhdHRyJywgLy8gZGVmYXVsdCBpcyAnZmFsc2UnXG4gICAgICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgIGlnbm9yZU5hbWVTcGFjZTogdHJ1ZSxcbiAgICAgIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBwYXJzZU5vZGVWYWx1ZTogZmFsc2UsXG4gICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgIHRyaW1WYWx1ZXM6IHRydWUsXG4gICAgICBwYXJzZVRydWVOdW1iZXJPbmx5OiBmYWxzZSxcbiAgICAgIGFsd2F5c0NyZWF0ZVRleHROb2RlOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoYXR0clZhbHVlUHJvY2Vzc29yICYmIHR5cGVvZiBhdHRyVmFsdWVQcm9jZXNzb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBhcnNlQ29uZmlnLmF0dHJWYWx1ZVByb2Nlc3NvciA9IGF0dHJWYWx1ZVByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sUGFyc2UnKTtcbiAgICAvLyDlsIZ4bWzlrZfnrKbkuLLop6PmnpDmiJB4bWzoioLngrnmoJFcbiAgICBjb25zdCBqc29uT2JqID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBwYXJzZUNvbmZpZywgdHJ1ZSk7XG4gICAgLy8gY29uc29sZS5sb2coanNvbk9iailcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbFBhcnNlJyk7XG5cbiAgICBjb25zdCB4bWxUcmVlID0ganNvbk9iai5jaGlsZHJlblswXTtcblxuICAgIC8vIFhNTOagkeeUn+aIkOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWwyTGF5b3V0Jyk7XG4gICAgY29uc3QgbGF5b3V0VHJlZSA9IGNyZWF0ZS5jYWxsKHRoaXMsIHhtbFRyZWUsIHN0eWxlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbDJMYXlvdXQnKTtcblxuICAgIHRoaXMuYWRkKGxheW91dFRyZWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLklOSVRFRDtcblxuICAgIHRoaXMudGlja2VyLmFkZCh0aGlzLnRpY2tlckZ1bmMsIHRydWUpO1xuICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0Jyk7XG4gIH1cblxuICByZWZsb3coaXNGaXJzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0ZpcnN0KSB7XG4gICAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9yZWZsb3cnKTtcbiAgICAvKipcbiAgICAgKiDorqHnrpfluIPlsYDmoJFcbiAgICAgKiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr1xuICAgICAqIExheW91dOacrOi6q+W5tuS4jeS9nOS4uuW4g+WxgOiuoeeul++8jOWPquaYr+S9nOS4uuiKgueCueagkeeahOWuueWZqFxuICAgICAqL1xuICAgIGRlYnVnSW5mby5zdGFydCgnY29tcHV0ZUxheW91dCcsIHRydWUpO1xuICAgIGNvbXB1dGVMYXlvdXQodGhpcy5jaGlsZHJlblswXSk7XG4gICAgZGVidWdJbmZvLmVuZCgnY29tcHV0ZUxheW91dCcpO1xuXG4gICAgY29uc3Qgcm9vdEVsZSA9IHRoaXMuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAocm9vdEVsZS5zdHlsZS53aWR0aCA9PT0gdW5kZWZpbmVkIHx8IHJvb3RFbGUuc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBzZXQgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0eSBmb3Igcm9vdCBlbGVtZW50Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVycG9ydC53aWR0aCA9IHJvb3RFbGUuc3R5bGUud2lkdGg7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQuaGVpZ2h0ID0gcm9vdEVsZS5zdHlsZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8g5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRDaGlsZHJlbicsIHRydWUpO1xuICAgIGxheW91dENoaWxkcmVuKHRoaXMpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dENoaWxkcmVuJyk7XG5cbiAgICB0aGlzLnZpZXdwb3J0U2NhbGUgPSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gdGhpcy5yZW5kZXJwb3J0LndpZHRoO1xuXG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICAvLyDpgY3ljoboioLngrnmoJHvvIzkvp3mrKHosIPnlKjoioLngrnnmoTmuLLmn5PmjqXlj6Plrp7njrDmuLLmn5NcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlbmRlckNoaWxkcmVuJywgdHJ1ZSk7XG4gICAgcmVuZGVyQ2hpbGRyZW4odGhpcy5jaGlsZHJlbiwgdGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZmFsc2UpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlbmRlckNoaWxkcmVuJyk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlcGFpbnQnLCB0cnVlKTtcbiAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZXBhaW50Jyk7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCAoZWxlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbGUucHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X3JlZmxvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXTpmLbmrrXmoLjlv4Pku4Xku4XmmK/moLnmja54bWzlkoxjc3PliJvlu7rkuoboioLngrnmoJFcbiAgICog6KaB5a6e546w55yf5q2j55qE5riy5p+T77yM6ZyA6KaB6LCD55SoIGxheW91dCDlh73mlbDvvIzkuYvmiYDku6XlsIYgbGF5b3V0IOWNleeLrOaKveixoeS4uuS4gOS4quWHveaVsO+8jOaYr+WboOS4uiBsYXlvdXQg5bqU5b2T5piv5Y+v5Lul6YeN5aSN6LCD55So55qEXG4gICAqIOavlOWmguaUueWPmOS6huS4gOS4quWFg+e0oOeahOWwuuWvuO+8jOWunumZheS4iuiKgueCueagkeaYr+ayoeWPmOeahO+8jOS7heS7heaYr+mcgOimgemHjeaWsOiuoeeul+W4g+WxgO+8jOeEtuWQjua4suafk1xuICAgKiDkuIDkuKrlrozmlbTnmoQgbGF5b3V0IOWIhuaIkOS4i+mdoueahOWHoOatpe+8mlxuICAgKiAxLiDmiafooYznlLvluIPmuIXnkIbvvIzlm6DkuLrluIPlsYDlj5jljJbpobXpnaLpnIDopoHph43nu5jvvIzov5nph4zmsqHmnInlgZrlvojpq5jnuqfnmoTliZTpmaTnrYnmk43kvZzvvIzkuIDlvovmuIXpmaTph43nlLvvvIzlrp7pmYXkuIrmgKfog73lt7Lnu4/lvojlpb1cbiAgICogMi4g6IqC54K55qCR6YO95ZCr5pyJIHN0eWxlIOWxnuaAp++8jGNzcy1sYXlvdXQg6IO95aSf5qC55o2u6L+Z5Lqb5L+h5oGv6K6h566X5Ye65pyA57uI5biD5bGA77yM6K+m5oOF5Y+v6KeBIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Nzcy1sYXlvdXRcbiAgICogMy4g57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga/vvIzkvYbov5nkupvkv6Hmga/lubbkuI3mmK/og73lpJ/nm7TmjqXnlKjnmoRcbiAgICogICAg5q+U5aaCIGxheW91dC50b3Ag5piv5oyH5Zyo5LiA5Liq54i25a655Zmo5YaF55qEIHRvcO+8jOacgOe7iOimgeWunueOsOa4suafk++8jOWunumZheS4iuimgemAkuW9kuWKoOS4iuWkjeWuueWZqOeahCB0b3BcbiAgICogICAg6L+Z5qC35q+P5qyhIHJlcGFpbnQg55qE5pe25YCZ5Y+q6ZyA6KaB55u05o6l5L2/55So6K6h566X5aW955qE5YC85Y2z5Y+v77yM5LiN6ZyA6KaB5q+P5qyh6YO96YCS5b2S6K6h566XXG4gICAqICAgIOi/meS4gOatpeensOS4uiBsYXlvdXRDaGlsZHJlbu+8jOebrueahOWcqOS6juWwhiBjc3MtbGF5b3V0IOi/m+S4gOatpeWkhOeQhuS4uuWPr+S7pea4suafk+ebtOaOpeeUqOeahOW4g+WxgOS/oeaBr1xuICAgKiA0LiByZW5kZXJDaGlsZHJlbu+8muaJp+ihjOa4suafk1xuICAgKiA1LiBiaW5kRXZlbnRz77ya5omn6KGM5LqL5Lu257uR5a6aXG4gICAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGxheW91dChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKCF0aGlzLmhhc1ZpZXdQb3J0U2V0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdQbGVhc2UgaW52b2tlIG1ldGhvZCBgdXBkYXRlVmlld1BvcnRgIGJlZm9yZSBtZXRob2QgYGxheW91dGAnKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dCcpO1xuXG4gICAgdGhpcy5yZWZsb3codHJ1ZSk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vdGhlcicpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdvYnNlcnZlU3R5bGVBbmRFdmVudCcsIHRydWUpO1xuICAgIGl0ZXJhdGVUcmVlKHRoaXMuY2hpbGRyZW5bMF0sIGVsZW1lbnQgPT4gZWxlbWVudC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnKTtcblxuICAgIHRoaXMuc3RhdGUgPSBTVEFURS5SRU5ERVJFRDtcblxuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dCcpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dF9vdGhlcicpO1xuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICBjbGVhckNhbnZhcyh0aGlzLnJlbmRlckNvbnRleHQgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcblxuICAgIHRoaXMuaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICAgIHJlcGFpbnRDaGlsZHJlbih0aGlzLmNoaWxkcmVuKTtcbiAgfVxuXG4gIGdldEVsZW1lbnRWaWV3cG9ydFJlY3QoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IHsgcmVhbExheW91dEJveCwgdmlld3BvcnRTY2FsZSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBhYnNvbHV0ZVgsXG4gICAgICBhYnNvbHV0ZVksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gZWxlbWVudC5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB2aWV3cG9ydFNjYWxlO1xuICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB2aWV3cG9ydFNjYWxlO1xuXG4gICAgcmV0dXJuIG5ldyBSZWN0KFxuICAgICAgcmVhbFgsXG4gICAgICByZWFsWSxcbiAgICAgIHJlYWxXaWR0aCxcbiAgICAgIHJlYWxIZWlnaHQsXG4gICAgKTtcbiAgfVxuXG4gIGdldENoaWxkQnlQb3ModHJlZTogTGF5b3V0IHwgRWxlbWVudCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGl0ZW1MaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFic29sdXRlWCxcbiAgICAgICAgYWJzb2x1dGVZLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGVsZS5sYXlvdXRCb3g7XG4gICAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWDtcbiAgICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy52aWV3cG9ydFNjYWxlO1xuXG4gICAgICBpZiAoKHJlYWxYIDw9IHggJiYgeCA8PSByZWFsWCArIHJlYWxXaWR0aCkgJiYgKHJlYWxZIDw9IHkgJiYgeSA8PSByZWFsWSArIHJlYWxIZWlnaHQpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnm7jlhbNpc3N1Ze+8mmh0dHBzOi8vZ2l0aHViLmNvbS93ZWNoYXQtbWluaXByb2dyYW0vbWluaWdhbWUtY2FudmFzLWVuZ2luZS9pc3N1ZXMvMTdcbiAgICAgICAgICog6L+Z6YeM5Y+q6KaB5ruh6Laz5p2h5Lu255qE6YO96KaB6K6w5b2V77yM5ZCm5YiZ5Y+v6IO95Ye6546wIGlzc3VlIOmHjOmdouaPkOWIsOeahOmXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgaXRlbUxpc3QucHVzaChlbGUpO1xuICAgICAgICBpZiAoZWxlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyhlbGUsIHgsIHksIGl0ZW1MaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyID0gKGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCB0b3VjaDogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgICAgIFxuICAgICAgaWYgKGlzR2FtZVRvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3VjaCA9IGU7XG4gICAgICB9XG4gICAgICAvLyBjb25zdCB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB8fCBlO1xuICAgICAgaWYgKCF0b3VjaCB8fCAhdG91Y2gucGFnZVggfHwgIXRvdWNoLnBhZ2VZKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaC50aW1lU3RhbXApIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0b3VjaC50aW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdDogKExheW91dCB8IEVsZW1lbnQpW10gPSBbXTtcbiAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICB0aGlzLmdldENoaWxkQnlQb3ModGhpcywgdG91Y2gucGFnZVgsIHRvdWNoLnBhZ2VZLCBsaXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICBsaXN0LnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgICBpdGVtICYmIGl0ZW0uZW1pdChldmVudE5hbWUsIGUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnROYW1lID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZ1tldmVudE5hbWVdID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaGVuZCcgJiYgaXNDbGljayh0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2cpKSB7XG4gICAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KCdjbGljaycsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBiaW5kRXZlbnRzKCkge1xuICAgIGlmICh0aGlzLmhhc0V2ZW50SGFuZGxlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFzRXZlbnRIYW5kbGVyID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vblRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgICAgX19lbnYub25Ub3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgICBfX2Vudi5vblRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vblRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2Vkb3duID0gdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQ7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaE1vdmU7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQ7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbGVhdmUgPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWw7XG4gICAgfVxuICB9XG5cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlZG93biA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZWxlYXZlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50SGFuZGxlciA9IGZhbHNlO1xuICB9XG5cbiAgZW1pdChldmVudDogc3RyaW5nLCBkYXRhOiBhbnkpIHtcbiAgICBFRS5lbWl0KGV2ZW50LCBkYXRhKTtcbiAgfVxuXG4gIG9uKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uKGV2ZW50LCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vZmYoZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGRlc3Ryb3lBbGwodHJlZTogTGF5b3V0IHwgRWxlbWVudCkge1xuICAgIGNvbnN0IHtcbiAgICAgIGNoaWxkcmVuLFxuICAgIH0gPSB0cmVlO1xuXG4gICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuZGVzdHJveUFsbChjaGlsZCk7XG4gICAgICBjaGlsZC5kZXN0cm95U2VsZiAmJiBjaGlsZC5kZXN0cm95U2VsZigpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclBvb2woKSB7XG4gICAgaW1nUG9vbC5jbGVhcigpO1xuICB9XG5cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIGxvYWRJbWdzKGFyciA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIHJlZ2lzdEJpdE1hcEZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJpdE1hcFBvb2wuZ2V0KG5hbWUpKSB7XG4gICAgICBjb25zdCBmb250ID0gbmV3IEJpdE1hcEZvbnQobmFtZSwgc3JjLCBjb25maWcpO1xuICAgICAgdGhpcy5iaXRNYXBGb250cy5wdXNoKGZvbnQpO1xuICAgICAgYml0TWFwUG9vbC5zZXQobmFtZSwgZm9udClcbiAgICB9XG4gIH1cblxuICBjbG9uZU5vZGUoZWxlbWVudDogRWxlbWVudCwgZGVlcCA9IHRydWUpIHtcbiAgICByZXR1cm4gY2xvbmU8TGF5b3V0Pih0aGlzLCBlbGVtZW50LCBkZWVwKTtcbiAgfVxuXG4gIEVsZW1lbnQgPSBFbGVtZW50O1xuICBWaWV3ID0gVmlldztcbiAgVGV4dCA9IFRleHQ7XG4gIEltYWdlID0gSW1hZ2U7XG4gIFNjcm9sbFZpZXcgPSBTY3JvbGxWaWV3O1xuICBCaXRNYXBUZXh0ID0gQml0TWFwVGV4dDtcbiAgQ2FudmFzID0gQ2FudmFzO1xuXG4gIHJlZ2lzdGVyQ29tcG9uZW50ID0gcmVnaXN0ZXJDb21wb25lbnQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBMYXlvdXQoe1xuICBzdHlsZToge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfSxcbiAgbmFtZTogJ2xheW91dCcsXG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==
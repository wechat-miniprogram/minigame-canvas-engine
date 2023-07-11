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
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   sharedTicker: () => (/* binding */ sharedTicker)
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
var sharedTicker = new Ticker();


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
/* harmony export */   createCanvas: () => (/* binding */ createCanvas),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   getDpr: () => (/* binding */ getDpr),
/* harmony export */   getRgba: () => (/* binding */ getRgba),
/* harmony export */   hexToRgb: () => (/* binding */ hexToRgb),
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
/**
 * 取最小值和最大值之间的区间限定值
 * @param {number} number 需要被处理的数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}
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
        if (typeof style.backgroundImage === 'string') {
            this.backgroundImageSetHandler(style.backgroundImage);
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
                        ele_1.styleChangeHandler(prop, val);
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
        if (style.opacity !== 1) {
            ctx.globalAlpha = style.opacity;
        }
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
/* harmony import */ var _common_ticker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/ticker */ "./src/common/ticker.ts");
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
/**
 * 滚动组件的滚动条组件，滚动条本身也是Layout的一个节点
 */
var ScrollBar = /** @class */ (function (_super) {
    __extends(ScrollBar, _super);
    function ScrollBar(_a) {
        var direction = _a.direction, dimensions = _a.dimensions, _b = _a.backgroundColor, backgroundColor = _b === void 0 ? '#a2a2a2' : _b, _c = _a.width, width = _c === void 0 ? 16 : _c;
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
        _this.autoHideTime = 1000;
        _this.autoHideRemainingTime = 0;
        _this.innerWidth = 16;
        _this.isHide = false;
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
        _common_ticker__WEBPACK_IMPORTED_MODULE_2__.sharedTicker.add(_this.update, true);
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
    ScrollBar.prototype.hide = function () {
        this.isHide = true;
        this.style.opacity = 0;
    };
    ScrollBar.prototype.show = function () {
        this.isHide = false;
        this.style.opacity = 1;
    };
    ScrollBar.prototype.setDimensions = function (dimensions) {
        var style = updateStyleFromDimensions(this.width, this.direction, dimensions);
        Object.assign(this.style, style);
        this.dimensions = dimensions;
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
        var _a = this.calculteScrollValue(left, top), scrollLeft = _a.scrollLeft, scrollTop = _a.scrollTop;
        if (this.direction === ScrollBarDirection.Vertival) {
            this.layoutBox.absoluteY = this.parent.layoutBox.originalAbsoluteY + scrollTop;
        }
        else {
            this.layoutBox.absoluteX = this.parent.layoutBox.originalAbsoluteX + scrollLeft;
        }
        if (this.autoHide) {
            this.autoHideRemainingTime = this.autoHideTime;
        }
        this.style.opacity = 1;
    };
    ScrollBar.prototype.destroySelf = function () {
        _common_ticker__WEBPACK_IMPORTED_MODULE_2__.sharedTicker.remove(this.update, true);
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
/* harmony import */ var _scrollbar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./scrollbar */ "./src/components/scrollbar.ts");
/* harmony import */ var _common_ticker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/ticker */ "./src/common/ticker.ts");
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
            // scrollview为空的情况
            if (!this.children.length) {
                return 0;
            }
            var maxHeight = 0;
            this.children.forEach(function (item) {
                if (item.style.position !== 'absolute') {
                    maxHeight = Math.max(maxHeight, item.layoutBox.top + item.layoutBox.height);
                }
            });
            // const last = this.children[this.children.length - 1];
            // return last.layoutBox.top + last.layoutBox.height;
            return maxHeight;
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
            var maxWidth = 0;
            this.children.forEach(function (item) {
                if (item.style.position !== 'absolute') {
                    maxWidth = Math.max(maxWidth, item.layoutBox.left + item.layoutBox.width);
                }
            });
            return maxWidth;
            // const last = this.children[this.children.length - 1];
            // return last.layoutBox.left + last.layoutBox.width;
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
        var _a, _b;
        // 可能被销毁了或者节点树还没准备好
        if (!this.isDestroyed && !this.isFirstScroll) {
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this && ele.style.position !== 'absolute') {
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
    // styleChangeHandler(prop: string, val: any) {
    //   // console.log(prop, val);
    //   if (reflowAffectedStyles.indexOf(prop) > -1) {
    //   }
    // }
    ScrollView.prototype.updateScrollBar = function (scrollProp, scrollBarName) {
        var _this = this;
        var dimensions = {
            width: this.layoutBox.width,
            height: this.layoutBox.height,
            contentWidth: this.scrollerObj.__contentWidth,
            contentHeight: this.scrollerObj.__contentHeight,
            maxScrollLeft: this.scrollerObj.__maxScrollLeft,
            maxScrollTop: this.scrollerObj.__maxScrollTop,
        };
        if (this[scrollProp]) {
            if (this[scrollBarName]) {
                this[scrollBarName].setDimensions(dimensions);
            }
            else {
                var scrollBar = new _scrollbar__WEBPACK_IMPORTED_MODULE_4__["default"]({
                    dimensions: dimensions,
                    direction: scrollProp === 'scrollY' ? _scrollbar__WEBPACK_IMPORTED_MODULE_4__.ScrollBarDirection.Vertival : _scrollbar__WEBPACK_IMPORTED_MODULE_4__.ScrollBarDirection.Horizontal,
                });
                // this.appendChild(scrollbar);
                scrollBar.root = this.root;
                // @ts-ignore
                scrollBar.insert(this.root.renderContext, true);
                scrollBar.observeStyleAndEvent();
                this.add(scrollBar);
                scrollBar.setDirty();
                // @ts-ignore
                this[scrollBarName] = scrollBar;
                _common_ticker__WEBPACK_IMPORTED_MODULE_5__.sharedTicker.next(function () {
                    var _a, _b;
                    // @ts-ignore
                    (_a = _this[scrollBarName]) === null || _a === void 0 ? void 0 : _a.onScroll(_this.scrollerObj.__scrollLeft, _this.scrollerObj.__scheduledTop);
                    (_b = _this.root) === null || _b === void 0 ? void 0 : _b.emit('repaint');
                });
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
            this.scrollY = true;
        }
        if (this.hasEventBind) {
            // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
            if (this.layoutBox.width !== this.scrollerObj.__clientWidth
                || this.layoutBox.height !== this.scrollerObj.__clientHeight
                || this.scrollWidth !== this.scrollerObj.__contentWidth
                || this.scrollHeight !== this.scrollerObj.__contentHeight) {
                this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
                _common_ticker__WEBPACK_IMPORTED_MODULE_5__.sharedTicker.next(function () {
                    _this.updateScrollBar('scrollY', 'vertivalScrollbar');
                    _this.updateScrollBar('scrollX', 'horizontalScrollbar');
                });
            }
            // reflow 之后，会从 csslayout 同步布局信息，原先的滚动信息会丢失，这里需要一个复位的操作
            (0,_common_vd__WEBPACK_IMPORTED_MODULE_3__.iterateTree)(this, function (ele) {
                if (ele !== _this && ele.style.position !== 'absolute') {
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
        _common_ticker__WEBPACK_IMPORTED_MODULE_5__.sharedTicker.next(function () {
            _this.updateScrollBar('scrollY', 'vertivalScrollbar');
            _this.updateScrollBar('scrollX', 'horizontalScrollbar');
        });
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
    'opacity'
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
        var ctx = this.ctx;
        ctx.save();
        if (style.opacity !== 1) {
            ctx.globalAlpha = style.opacity;
        }
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
        // public ticker: Ticker = new Ticker();
        _this.ticker = _common_ticker__WEBPACK_IMPORTED_MODULE_9__.sharedTicker;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vcGFja2FnZXMvcGx1Z2luL3BsdWdpbi9lbmdpbmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUEwQztBQUNoRDtBQUNBLElBQUksaUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLGtHQUFDO0FBQ3ZCLElBQUksS0FBSyxFQVFOO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGFBQWE7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsYUFBYTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7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QWlCO2FBQWpCLFVBQWlCLEVBQWpCLHFCQUFpQixFQUFqQixJQUFpQjtZQUFqQixnQ0FBaUI7O1FBQzlDLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUQsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDdEIsT0FBTyxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1lBQzlDLE9BQU87U0FDUjtRQUVELElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtZQUNwQixNQUFNLENBQUMsU0FBUyxPQUFoQixNQUFNLGlCQUFXLElBQUksR0FBSyxPQUFPLFVBQUU7U0FDcEM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFlLE1BQU0sQ0FBQyxJQUFJLElBQUksRUFBRSx3QkFBTSxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFqQ2MsdUJBQWdCLEdBQXNCLEVBQUUsQ0FBQztJQWtDMUQsYUFBQztDQUFBLENBbmlCb0IsNERBQU8sR0FtaUIzQjtBQUVELGlFQUFlLElBQUksTUFBTSxDQUFDO0lBQ3hCLEtBQUssRUFBRTtRQUNMLEtBQUssRUFBRSxDQUFDO1FBQ1IsTUFBTSxFQUFFLENBQUM7S0FDVjtJQUNELElBQUksRUFBRSxRQUFRO0NBQ2YsQ0FBQyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy9jc3MtbGF5b3V0L2Rpc3QvY3NzLWxheW91dC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vbm9kZV9tb2R1bGVzL3RpbnktZW1pdHRlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9iaXRNYXBGb250LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL2RlYnVnSW5mby50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9pbWFnZU1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcG9vbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9yZWN0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3RpY2tlci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi91dGlsLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3ZkLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9iaXRtYXB0ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2VsZW1lbnRzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbWFnZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbGJhci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3RleHQudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3ZpZXcudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9lbnYudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9ub2RlMmpzb24uanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci91dGlsLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdmFsaWRhdG9yLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIveG1sTm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbHN0cjJ4bWxub2RlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9hbmltYXRlLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9zY3JvbGxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQgZm9yIHJlZmVyZW5jZVxuLy9cbi8vIFRoaXMgZmlsZSB1c2VzIHRoZSBmb2xsb3dpbmcgc3BlY2lmaWMgVU1EIGltcGxlbWVudGF0aW9uOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3VtZGpzL3VtZC9ibG9iL21hc3Rlci9yZXR1cm5FeHBvcnRzLmpzXG4oZnVuY3Rpb24ocm9vdCwgZmFjdG9yeSkge1xuICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgLy8gb25seSBDb21tb25KUy1saWtlIGVudmlyb25tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgLy8gbGlrZSBOb2RlLlxuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEJyb3dzZXIgZ2xvYmFscyAocm9vdCBpcyB3aW5kb3cpXG4gICAgcm9vdC5jb21wdXRlTGF5b3V0ID0gZmFjdG9yeSgpO1xuICB9XG59KHRoaXMsIGZ1bmN0aW9uKCkge1xuICAvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbnZhciBjb21wdXRlTGF5b3V0ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBDU1NfVU5ERUZJTkVEO1xuXG4gIHZhciBDU1NfRElSRUNUSU9OX0lOSEVSSVQgPSAnaW5oZXJpdCc7XG4gIHZhciBDU1NfRElSRUNUSU9OX0xUUiA9ICdsdHInO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9SVEwgPSAncnRsJztcblxuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA9ICdyb3cnO1xuICB2YXIgQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFID0gJ3Jvdy1yZXZlcnNlJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gPSAnY29sdW1uJztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSA9ICdjb2x1bW4tcmV2ZXJzZSc7XG5cbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfSlVTVElGWV9DRU5URVIgPSAnY2VudGVyJztcbiAgdmFyIENTU19KVVNUSUZZX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4gPSAnc3BhY2UtYmV0d2Vlbic7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQgPSAnc3BhY2UtYXJvdW5kJztcblxuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfU1RBUlQgPSAnZmxleC1zdGFydCc7XG4gIHZhciBDU1NfQUxJR05fQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfQUxJR05fRkxFWF9FTkQgPSAnZmxleC1lbmQnO1xuICB2YXIgQ1NTX0FMSUdOX1NUUkVUQ0ggPSAnc3RyZXRjaCc7XG5cbiAgdmFyIENTU19QT1NJVElPTl9SRUxBVElWRSA9ICdyZWxhdGl2ZSc7XG4gIHZhciBDU1NfUE9TSVRJT05fQUJTT0xVVEUgPSAnYWJzb2x1dGUnO1xuXG4gIHZhciBsZWFkaW5nID0ge1xuICAgICdyb3cnOiAnbGVmdCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3JpZ2h0JyxcbiAgICAnY29sdW1uJzogJ3RvcCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2JvdHRvbSdcbiAgfTtcbiAgdmFyIHRyYWlsaW5nID0ge1xuICAgICdyb3cnOiAncmlnaHQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdsZWZ0JyxcbiAgICAnY29sdW1uJzogJ2JvdHRvbScsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ3RvcCdcbiAgfTtcbiAgdmFyIHBvcyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciBkaW0gPSB7XG4gICAgJ3Jvdyc6ICd3aWR0aCcsXG4gICAgJ3Jvdy1yZXZlcnNlJzogJ3dpZHRoJyxcbiAgICAnY29sdW1uJzogJ2hlaWdodCcsXG4gICAgJ2NvbHVtbi1yZXZlcnNlJzogJ2hlaWdodCdcbiAgfTtcblxuICAvLyBXaGVuIHRyYW5zcGlsZWQgdG8gSmF2YSAvIEMgdGhlIG5vZGUgdHlwZSBoYXMgbGF5b3V0LCBjaGlsZHJlbiBhbmQgc3R5bGVcbiAgLy8gcHJvcGVydGllcy4gRm9yIHRoZSBKYXZhU2NyaXB0IHZlcnNpb24gdGhpcyBmdW5jdGlvbiBhZGRzIHRoZXNlIHByb3BlcnRpZXNcbiAgLy8gaWYgdGhleSBkb24ndCBhbHJlYWR5IGV4aXN0LlxuICBmdW5jdGlvbiBmaWxsTm9kZXMobm9kZSkge1xuICAgIGlmICghbm9kZS5sYXlvdXQgfHwgbm9kZS5pc0RpcnR5KSB7XG4gICAgICBub2RlLmxheW91dCA9IHtcbiAgICAgICAgd2lkdGg6IHVuZGVmaW5lZCxcbiAgICAgICAgaGVpZ2h0OiB1bmRlZmluZWQsXG4gICAgICAgIHRvcDogMCxcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgIGJvdHRvbTogMFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuc3R5bGUpIHtcbiAgICAgIG5vZGUuc3R5bGUgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoIW5vZGUuY2hpbGRyZW4pIHtcbiAgICAgIG5vZGUuY2hpbGRyZW4gPSBbXTtcbiAgICB9XG4gICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZpbGxOb2Rlcyk7XG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICBmdW5jdGlvbiBpc1VuZGVmaW5lZCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNSb3dEaXJlY3Rpb24oZmxleERpcmVjdGlvbikge1xuICAgIHJldHVybiBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIHx8XG4gICAgICAgICAgIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29sdW1uRGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTiB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW5TdGFydCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5TdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Ub3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luRW5kICE9PSB1bmRlZmluZWQgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLm1hcmdpbkVuZDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5Cb3R0b207IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW47XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nU3RhcnQgPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0O1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nTGVmdDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ1RvcDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdQYWRkaW5nKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nRW5kICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nRW5kID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdFbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdSaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5wYWRkaW5nICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5wYWRkaW5nID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmc7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlclN0YXJ0V2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlckVuZFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyUmlnaHRXaWR0aDsgIGJyZWFrO1xuICAgICAgY2FzZSAncm93LXJldmVyc2UnOiAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyTGVmdFdpZHRoOyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyQm90dG9tV2lkdGg7IGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUuYm9yZGVyVG9wV2lkdGg7ICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlID49IDApIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyV2lkdGg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nKG5vZGUsIGF4aXMpICsgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIGdldExlYWRpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpICtcbiAgICAgICAgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmp1c3RpZnlDb250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudDtcbiAgICB9XG4gICAgcmV0dXJuICdmbGV4LXN0YXJ0JztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFsaWduQ29udGVudChub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25Db250ZW50KSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpIHtcbiAgICBpZiAoY2hpbGQuc3R5bGUuYWxpZ25TZWxmKSB7XG4gICAgICByZXR1cm4gY2hpbGQuc3R5bGUuYWxpZ25TZWxmO1xuICAgIH1cbiAgICBpZiAobm9kZS5zdHlsZS5hbGlnbkl0ZW1zKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5hbGlnbkl0ZW1zO1xuICAgIH1cbiAgICByZXR1cm4gJ3N0cmV0Y2gnO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzb2x2ZUF4aXMoYXhpcywgZGlyZWN0aW9uKSB7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9SVEwpIHtcbiAgICAgIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XKSB7XG4gICAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gICAgICB9IGVsc2UgaWYgKGF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSkge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXhpcztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyIGRpcmVjdGlvbjtcbiAgICBpZiAobm9kZS5zdHlsZS5kaXJlY3Rpb24pIHtcbiAgICAgIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gPSBDU1NfRElSRUNUSU9OX0lOSEVSSVQ7XG4gICAgfVxuXG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gQ1NTX0RJUkVDVElPTl9JTkhFUklUKSB7XG4gICAgICBkaXJlY3Rpb24gPSAocGFyZW50RGlyZWN0aW9uID09PSB1bmRlZmluZWQgPyBDU1NfRElSRUNUSU9OX0xUUiA6IHBhcmVudERpcmVjdGlvbik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpcmVjdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEZsZXhEaXJlY3Rpb24obm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhEaXJlY3Rpb247XG4gICAgfVxuICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24sIGRpcmVjdGlvbikge1xuICAgIGlmIChpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBvc2l0aW9uVHlwZShub2RlKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucG9zaXRpb24pIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBvc2l0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gJ3JlbGF0aXZlJztcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleChub2RlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGdldFBvc2l0aW9uVHlwZShub2RlKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICBub2RlLnN0eWxlLmZsZXggPiAwXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRmxleFdyYXAobm9kZSkge1xuICAgIHJldHVybiBub2RlLnN0eWxlLmZsZXhXcmFwID09PSAnd3JhcCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXREaW1XaXRoTWFyZ2luKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSArIGdldE1hcmdpbkF4aXMobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0RpbURlZmluZWQobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBub2RlLnN0eWxlW2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlW2RpbVtheGlzXV0gPj0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUG9zRGVmaW5lZChub2RlLCBwb3MpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBpc01lYXN1cmVEZWZpbmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5tZWFzdXJlICE9PSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbihub2RlLCBwb3MpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtwb3NdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlW3Bvc107XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gYm91bmRBeGlzKG5vZGUsIGF4aXMsIHZhbHVlKSB7XG4gICAgdmFyIG1pbiA9IHtcbiAgICAgICdyb3cnOiBub2RlLnN0eWxlLm1pbldpZHRoLFxuICAgICAgJ3Jvdy1yZXZlcnNlJzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdjb2x1bW4nOiBub2RlLnN0eWxlLm1pbkhlaWdodCxcbiAgICAgICdjb2x1bW4tcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluSGVpZ2h0XG4gICAgfVtheGlzXTtcblxuICAgIHZhciBtYXggPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5tYXhXaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5tYXhIZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1heEhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgYm91bmRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmIChtYXggIT09IHVuZGVmaW5lZCAmJiBtYXggPj0gMCAmJiBib3VuZFZhbHVlID4gbWF4KSB7XG4gICAgICBib3VuZFZhbHVlID0gbWF4O1xuICAgIH1cbiAgICBpZiAobWluICE9PSB1bmRlZmluZWQgJiYgbWluID49IDAgJiYgYm91bmRWYWx1ZSA8IG1pbikge1xuICAgICAgYm91bmRWYWx1ZSA9IG1pbjtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kVmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmbWF4ZihhLCBiKSB7XG4gICAgaWYgKGEgPiBiKSB7XG4gICAgICByZXR1cm4gYTtcbiAgICB9XG4gICAgcmV0dXJuIGI7XG4gIH1cblxuICAvLyBXaGVuIHRoZSB1c2VyIHNwZWNpZmljYWxseSBzZXRzIGEgdmFsdWUgZm9yIHdpZHRoIG9yIGhlaWdodFxuICBmdW5jdGlvbiBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgYXhpcykge1xuICAgIC8vIFRoZSBwYXJlbnQgYWxyZWFkeSBjb21wdXRlZCB1cyBhIHdpZHRoIG9yIGhlaWdodC4gV2UganVzdCBza2lwIGl0XG4gICAgaWYgKG5vZGUubGF5b3V0W2RpbVtheGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBXZSBvbmx5IHJ1biBpZiB0aGVyZSdzIGEgd2lkdGggb3IgaGVpZ2h0IGRlZmluZWRcbiAgICBpZiAoIWlzRGltRGVmaW5lZChub2RlLCBheGlzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFRoZSBkaW1lbnNpb25zIGNhbiBuZXZlciBiZSBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlclxuICAgIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgIGJvdW5kQXhpcyhub2RlLCBheGlzLCBub2RlLnN0eWxlW2RpbVtheGlzXV0pLFxuICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcylcbiAgICApO1xuICB9XG5cbiAgZnVuY3Rpb24gc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgYXhpcykge1xuICAgIGNoaWxkLmxheW91dFt0cmFpbGluZ1theGlzXV0gPSBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gLSBjaGlsZC5sYXlvdXRbcG9zW2F4aXNdXTtcbiAgfVxuXG4gIC8vIElmIGJvdGggbGVmdCBhbmQgcmlnaHQgYXJlIGRlZmluZWQsIHRoZW4gdXNlIGxlZnQuIE90aGVyd2lzZSByZXR1cm5cbiAgLy8gK2xlZnQgb3IgLXJpZ2h0IGRlcGVuZGluZyBvbiB3aGljaCBpcyBkZWZpbmVkLlxuICBmdW5jdGlvbiBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZVtsZWFkaW5nW2F4aXNdXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZ2V0UG9zaXRpb24obm9kZSwgbGVhZGluZ1theGlzXSk7XG4gICAgfVxuICAgIHJldHVybiAtZ2V0UG9zaXRpb24obm9kZSwgdHJhaWxpbmdbYXhpc10pO1xuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIC8qY3NzX2RpcmVjdGlvbl90Ki9wYXJlbnREaXJlY3Rpb24pIHtcbiAgICB2YXIvKmNzc19kaXJlY3Rpb25fdCovIGRpcmVjdGlvbiA9IHJlc29sdmVEaXJlY3Rpb24obm9kZSwgcGFyZW50RGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gbWFpbkF4aXMgPSByZXNvbHZlQXhpcyhnZXRGbGV4RGlyZWN0aW9uKG5vZGUpLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBjcm9zc0F4aXMgPSBnZXRDcm9zc0ZsZXhEaXJlY3Rpb24obWFpbkF4aXMsIGRpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIHJlc29sdmVkUm93QXhpcyA9IHJlc29sdmVBeGlzKENTU19GTEVYX0RJUkVDVElPTl9ST1csIGRpcmVjdGlvbik7XG5cbiAgICAvLyBIYW5kbGUgd2lkdGggYW5kIGhlaWdodCBzdHlsZSBhdHRyaWJ1dGVzXG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIG1haW5BeGlzKTtcbiAgICBzZXREaW1lbnNpb25Gcm9tU3R5bGUobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIFNldCB0aGUgcmVzb2x2ZWQgcmVzb2x1dGlvbiBpbiB0aGUgbm9kZSdzIGxheW91dFxuICAgIG5vZGUubGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgIC8vIFRoZSBwb3NpdGlvbiBpcyBzZXQgYnkgdGhlIHBhcmVudCwgYnV0IHdlIG5lZWQgdG8gY29tcGxldGUgaXQgd2l0aCBhXG4gICAgLy8gZGVsdGEgY29tcG9zZWQgb2YgdGhlIG1hcmdpbiBhbmQgbGVmdC90b3AvcmlnaHQvYm90dG9tXG4gICAgbm9kZS5sYXlvdXRbbGVhZGluZ1ttYWluQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W3RyYWlsaW5nW21haW5BeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgbWFpbkF4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgbWFpbkF4aXMpO1xuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1tjcm9zc0F4aXNdXSArPSBnZXRUcmFpbGluZ01hcmdpbihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgIGdldFJlbGF0aXZlUG9zaXRpb24obm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIC8vIElubGluZSBpbW11dGFibGUgdmFsdWVzIGZyb20gdGhlIHRhcmdldCBub2RlIHRvIGF2b2lkIGV4Y2Vzc2l2ZSBtZXRob2RcbiAgICAvLyBpbnZvY2F0aW9ucyBkdXJpbmcgdGhlIGxheW91dCBjYWxjdWxhdGlvbi5cbiAgICB2YXIvKmludCovIGNoaWxkQ291bnQgPSBub2RlLmNoaWxkcmVuLmxlbmd0aDtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdyA9IGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIHJlc29sdmVkUm93QXhpcyk7XG5cbiAgICBpZiAoaXNNZWFzdXJlRGVmaW5lZChub2RlKSkge1xuICAgICAgdmFyLypib29sKi8gaXNSZXNvbHZlZFJvd0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dKTtcblxuICAgICAgdmFyLypmbG9hdCovIHdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICB3aWR0aCA9IG5vZGUuc3R5bGUud2lkdGg7XG4gICAgICB9IGVsc2UgaWYgKGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkKSB7XG4gICAgICAgIHdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuICAgICAgfVxuICAgICAgd2lkdGggLT0gcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcblxuICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGdpdmUgYSBkaW1lbnNpb24gZm9yIHRoZSB0ZXh0IGlmIHdlIGhhdmVuJ3QgZ290IGFueVxuICAgICAgLy8gZm9yIGl0IGNvbXB1dGVkIHlldC4gSXQgY2FuIGVpdGhlciBiZSBmcm9tIHRoZSBzdHlsZSBhdHRyaWJ1dGUgb3IgYmVjYXVzZVxuICAgICAgLy8gdGhlIGVsZW1lbnQgaXMgZmxleGlibGUuXG4gICAgICB2YXIvKmJvb2wqLyBpc1Jvd1VuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAmJiAhaXNSZXNvbHZlZFJvd0RpbURlZmluZWQ7XG4gICAgICB2YXIvKmJvb2wqLyBpc0NvbHVtblVuZGVmaW5lZCA9ICFpc0RpbURlZmluZWQobm9kZSwgQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTikgJiZcbiAgICAgICAgaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW0NTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5dXSk7XG5cbiAgICAgIC8vIExldCdzIG5vdCBtZWFzdXJlIHRoZSB0ZXh0IGlmIHdlIGFscmVhZHkga25vdyBib3RoIGRpbWVuc2lvbnNcbiAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCB8fCBpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICB2YXIvKmNzc19kaW1fdCovIG1lYXN1cmVEaW0gPSBub2RlLnN0eWxlLm1lYXN1cmUoXG4gICAgICAgICAgLyooYykhbm9kZS0+Y29udGV4dCwqL1xuICAgICAgICAgIC8qKGphdmEpIWxheW91dENvbnRleHQubWVhc3VyZU91dHB1dCwqL1xuICAgICAgICAgIHdpZHRoXG4gICAgICAgICk7XG4gICAgICAgIGlmIChpc1Jvd1VuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbWVhc3VyZURpbS53aWR0aCArXG4gICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0NvbHVtblVuZGVmaW5lZCkge1xuICAgICAgICAgIG5vZGUubGF5b3V0LmhlaWdodCA9IG1lYXN1cmVEaW0uaGVpZ2h0ICtcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoY2hpbGRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyLypib29sKi8gaXNOb2RlRmxleFdyYXAgPSBpc0ZsZXhXcmFwKG5vZGUpO1xuXG4gICAgdmFyLypjc3NfanVzdGlmeV90Ki8ganVzdGlmeUNvbnRlbnQgPSBnZXRKdXN0aWZ5Q29udGVudChub2RlKTtcblxuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW4gPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3MgPSBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBjcm9zc0F4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW4gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBtYWluQXhpcyk7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBjcm9zc0F4aXMpO1xuXG4gICAgdmFyLypib29sKi8gaXNNYWluRGltRGVmaW5lZCA9ICFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNDcm9zc0RpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKTtcbiAgICB2YXIvKmJvb2wqLyBpc01haW5Sb3dEaXJlY3Rpb24gPSBpc1Jvd0RpcmVjdGlvbihtYWluQXhpcyk7XG5cbiAgICB2YXIvKmludCovIGk7XG4gICAgdmFyLyppbnQqLyBpaTtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY2hpbGQ7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIGF4aXM7XG5cbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gZmlyc3RBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEFic29sdXRlQ2hpbGQgPSBudWxsO1xuXG4gICAgdmFyLypmbG9hdCovIGRlZmluZWRNYWluRGltID0gQ1NTX1VOREVGSU5FRDtcbiAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgZGVmaW5lZE1haW5EaW0gPSBub2RlLmxheW91dFtkaW1bbWFpbkF4aXNdXSAtIHBhZGRpbmdBbmRCb3JkZXJBeGlzTWFpbjtcbiAgICB9XG5cbiAgICAvLyBXZSB3YW50IHRvIGV4ZWN1dGUgdGhlIG5leHQgdHdvIGxvb3BzIG9uZSBwZXIgbGluZSB3aXRoIGZsZXgtd3JhcFxuICAgIHZhci8qaW50Ki8gc3RhcnRMaW5lID0gMDtcbiAgICB2YXIvKmludCovIGVuZExpbmUgPSAwO1xuICAgIC8vIHZhci8qaW50Ki8gbmV4dE9mZnNldCA9IDA7XG4gICAgdmFyLyppbnQqLyBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAvLyBXZSBhZ2dyZWdhdGUgdGhlIHRvdGFsIGRpbWVuc2lvbnMgb2YgdGhlIGNvbnRhaW5lciBpbiB0aG9zZSB0d28gdmFyaWFibGVzXG4gICAgdmFyLypmbG9hdCovIGxpbmVzQ3Jvc3NEaW0gPSAwO1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc01haW5EaW0gPSAwO1xuICAgIHZhci8qaW50Ki8gbGluZXNDb3VudCA9IDA7XG4gICAgd2hpbGUgKGVuZExpbmUgPCBjaGlsZENvdW50KSB7XG4gICAgICAvLyA8TG9vcCBBPiBMYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBjb3VudCBjaGlsZHJlbiBieSB0eXBlXG5cbiAgICAgIC8vIG1haW5Db250ZW50RGltIGlzIGFjY3VtdWxhdGlvbiBvZiB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2luIG9mIGFsbCB0aGVcbiAgICAgIC8vIG5vbiBmbGV4aWJsZSBjaGlsZHJlbi4gVGhpcyB3aWxsIGJlIHVzZWQgaW4gb3JkZXIgdG8gZWl0aGVyIHNldCB0aGVcbiAgICAgIC8vIGRpbWVuc2lvbnMgb2YgdGhlIG5vZGUgaWYgbm9uZSBhbHJlYWR5IGV4aXN0LCBvciB0byBjb21wdXRlIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlIGxlZnQgZm9yIHRoZSBmbGV4aWJsZSBjaGlsZHJlbi5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluQ29udGVudERpbSA9IDA7XG5cbiAgICAgIC8vIFRoZXJlIGFyZSB0aHJlZSBraW5kIG9mIGNoaWxkcmVuLCBub24gZmxleGlibGUsIGZsZXhpYmxlIGFuZCBhYnNvbHV0ZS5cbiAgICAgIC8vIFdlIG5lZWQgdG8ga25vdyBob3cgbWFueSB0aGVyZSBhcmUgaW4gb3JkZXIgdG8gZGlzdHJpYnV0ZSB0aGUgc3BhY2UuXG4gICAgICB2YXIvKmludCovIGZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gdG90YWxGbGV4aWJsZSA9IDA7XG4gICAgICB2YXIvKmludCovIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCA9IDA7XG5cbiAgICAgIC8vIFVzZSB0aGUgbGluZSBsb29wIHRvIHBvc2l0aW9uIGNoaWxkcmVuIGluIHRoZSBtYWluIGF4aXMgZm9yIGFzIGxvbmdcbiAgICAgIC8vIGFzIHRoZXkgYXJlIHVzaW5nIGEgc2ltcGxlIHN0YWNraW5nIGJlaGF2aW91ci4gQ2hpbGRyZW4gdGhhdCBhcmVcbiAgICAgIC8vIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcCB3aWxsIG5vdCBiZSB0b3VjaGVkIGFnYWluXG4gICAgICAvLyBpbiA8TG9vcCBDPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tNYWluID1cbiAgICAgICAgICAoaXNNYWluRGltRGVmaW5lZCAmJiBqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAoIWlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0NFTlRFUik7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleE1haW4gPSAoaXNTaW1wbGVTdGFja01haW4gPyBjaGlsZENvdW50IDogc3RhcnRMaW5lKTtcblxuICAgICAgLy8gVXNlIHRoZSBpbml0aWFsIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgY3Jvc3MgYXhpcyBmb3JcbiAgICAgIC8vIGFzIGxvbmcgYXMgdGhleSBhcmUgcmVsYXRpdmVseSBwb3NpdGlvbmVkIHdpdGggYWxpZ25tZW50IFNUUkVUQ0ggb3JcbiAgICAgIC8vIEZMRVhfU1RBUlQuIENoaWxkcmVuIHRoYXQgYXJlIGltbWVkaWF0ZWx5IHN0YWNrZWQgaW4gdGhlIGluaXRpYWwgbG9vcFxuICAgICAgLy8gd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpbiBpbiA8TG9vcCBEPi5cbiAgICAgIHZhci8qYm9vbCovIGlzU2ltcGxlU3RhY2tDcm9zcyA9IHRydWU7XG4gICAgICB2YXIvKmludCovIGZpcnN0Q29tcGxleENyb3NzID0gY2hpbGRDb3VudDtcblxuICAgICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0RmxleENoaWxkID0gbnVsbDtcbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBjdXJyZW50RmxleENoaWxkID0gbnVsbDtcblxuICAgICAgdmFyLypmbG9hdCovIG1haW5EaW0gPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlck1haW47XG4gICAgICB2YXIvKmZsb2F0Ki8gY3Jvc3NEaW0gPSAwO1xuXG4gICAgICB2YXIvKmZsb2F0Ki8gbWF4V2lkdGg7XG4gICAgICBmb3IgKGkgPSBzdGFydExpbmU7IGkgPCBjaGlsZENvdW50OyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuICAgICAgICBjaGlsZC5saW5lSW5kZXggPSBsaW5lc0NvdW50O1xuXG4gICAgICAgIGNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcbiAgICAgICAgY2hpbGQubmV4dEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduSXRlbSA9IGdldEFsaWduSXRlbShub2RlLCBjaGlsZCk7XG5cbiAgICAgICAgLy8gUHJlLWZpbGwgY3Jvc3MgYXhpcyBkaW1lbnNpb25zIHdoZW4gdGhlIGNoaWxkIGlzIHVzaW5nIHN0cmV0Y2ggYmVmb3JlXG4gICAgICAgIC8vIHdlIGNhbGwgdGhlIHJlY3Vyc2l2ZSBsYXlvdXQgcGFzc1xuICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCAmJlxuICAgICAgICAgICAgZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFICYmXG4gICAgICAgICAgICBpc0Nyb3NzRGltRGVmaW5lZCAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgY3Jvc3NBeGlzKSkge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzIC0gZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKSksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSkge1xuICAgICAgICAgIC8vIFN0b3JlIGEgcHJpdmF0ZSBsaW5rZWQgbGlzdCBvZiBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgY2hpbGRyZW5cbiAgICAgICAgICAvLyBzbyB0aGF0IHdlIGNhbiBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEFic29sdXRlQ2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3IgdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoXG4gICAgICAgICAgLy8gbGVmdCBhbmQgcmlnaHQgb3IgdG9wIGFuZCBib3R0b20pLlxuICAgICAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG4gICAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgICAgICBpc1Bvc0RlZmluZWQoY2hpbGQsIGxlYWRpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGF4aXMsIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gLVxuICAgICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgYXhpcykgLVxuICAgICAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCB0cmFpbGluZ1theGlzXSkpLFxuICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIGF4aXMpXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyLypmbG9hdCovIG5leHRDb250ZW50RGltID0gMDtcblxuICAgICAgICAvLyBJdCBvbmx5IG1ha2VzIHNlbnNlIHRvIGNvbnNpZGVyIGEgY2hpbGQgZmxleGlibGUgaWYgd2UgaGF2ZSBhIGNvbXB1dGVkXG4gICAgICAgIC8vIGRpbWVuc2lvbiBmb3IgdGhlIG5vZGUuXG4gICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkICYmIGlzRmxleChjaGlsZCkpIHtcbiAgICAgICAgICBmbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICB0b3RhbEZsZXhpYmxlICs9IGNoaWxkLnN0eWxlLmZsZXg7XG5cbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgZmxleGlibGUgY2hpbGRyZW4gc28gdGhhdCB3ZSBjYW5cbiAgICAgICAgICAvLyBlZmZpY2llbnRseSB0cmF2ZXJzZSB0aGVtIGxhdGVyLlxuICAgICAgICAgIGlmIChmaXJzdEZsZXhDaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgZmlyc3RGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY2hpbGQ7XG5cbiAgICAgICAgICAvLyBFdmVuIGlmIHdlIGRvbid0IGtub3cgaXRzIGV4YWN0IHNpemUgeWV0LCB3ZSBhbHJlYWR5IGtub3cgdGhlIHBhZGRpbmcsXG4gICAgICAgICAgLy8gYm9yZGVyIGFuZCBtYXJnaW4uIFdlJ2xsIHVzZSB0aGlzIHBhcnRpYWwgaW5mb3JtYXRpb24sIHdoaWNoIHJlcHJlc2VudHNcbiAgICAgICAgICAvLyB0aGUgc21hbGxlc3QgcG9zc2libGUgc2l6ZSBmb3IgdGhlIGNoaWxkLCB0byBjb21wdXRlIHRoZSByZW1haW5pbmdcbiAgICAgICAgICAvLyBhdmFpbGFibGUgc3BhY2UuXG4gICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIG1haW5BeGlzKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1heFdpZHRoID0gQ1NTX1VOREVGSU5FRDtcbiAgICAgICAgICBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gbm9kZS5sYXlvdXRbZGltW3Jlc29sdmVkUm93QXhpc11dIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIG1haW4gcmVjdXJzaXZlIGNhbGwuIFdlIGxheW91dCBub24gZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICAgICAgaWYgKGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPT09IDApIHtcbiAgICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQWJzb2x1dGUgcG9zaXRpb25lZCBlbGVtZW50cyBkbyBub3QgdGFrZSBwYXJ0IG9mIHRoZSBsYXlvdXQsIHNvIHdlXG4gICAgICAgICAgLy8gZG9uJ3QgdXNlIHRoZW0gdG8gY29tcHV0ZSBtYWluQ29udGVudERpbVxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCsrO1xuICAgICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIGFuZCBtYXJnaW4gb2YgdGhlIGVsZW1lbnQuXG4gICAgICAgICAgICBuZXh0Q29udGVudERpbSA9IGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgZWxlbWVudCB3ZSBhcmUgYWJvdXQgdG8gYWRkIHdvdWxkIG1ha2UgdXMgZ28gdG8gdGhlIG5leHQgbGluZVxuICAgICAgICBpZiAoaXNOb2RlRmxleFdyYXAgJiZcbiAgICAgICAgICAgIGlzTWFpbkRpbURlZmluZWQgJiZcbiAgICAgICAgICAgIG1haW5Db250ZW50RGltICsgbmV4dENvbnRlbnREaW0gPiBkZWZpbmVkTWFpbkRpbSAmJlxuICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBvbmx5IG9uZSBlbGVtZW50LCB0aGVuIGl0J3MgYmlnZ2VyIHRoYW4gdGhlIGNvbnRlbnRcbiAgICAgICAgICAgIC8vIGFuZCBuZWVkcyBpdHMgb3duIGxpbmVcbiAgICAgICAgICAgIGkgIT09IHN0YXJ0TGluZSkge1xuICAgICAgICAgIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudC0tO1xuICAgICAgICAgIGFscmVhZHlDb21wdXRlZE5leHRMYXlvdXQgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIG1haW4gYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbiAmJlxuICAgICAgICAgICAgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgIT09IENTU19QT1NJVElPTl9SRUxBVElWRSB8fCBpc0ZsZXgoY2hpbGQpKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tNYWluID0gZmFsc2U7XG4gICAgICAgICAgZmlyc3RDb21wbGV4TWFpbiA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEaXNhYmxlIHNpbXBsZSBzdGFja2luZyBpbiB0aGUgY3Jvc3MgYXhpcyBmb3IgdGhlIGN1cnJlbnQgbGluZSBhc1xuICAgICAgICAvLyB3ZSBmb3VuZCBhIG5vbi10cml2aWFsIGNoaWxkLiBUaGUgcmVtYWluaW5nIGNoaWxkcmVuIHdpbGwgYmUgbGFpZCBvdXRcbiAgICAgICAgLy8gaW4gPExvb3AgRD4uXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MgJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHxcbiAgICAgICAgICAgICAgICAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fU1RSRVRDSCAmJiBhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB8fFxuICAgICAgICAgICAgICAgIGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSkge1xuICAgICAgICAgIGlzU2ltcGxlU3RhY2tDcm9zcyA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleENyb3NzID0gaTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrTWFpbikge1xuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSArPSBtYWluRGltO1xuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWFpbkRpbSArPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgY3Jvc3NEaW0gPSBmbWF4Zihjcm9zc0RpbSwgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1NpbXBsZVN0YWNrQ3Jvc3MpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMDtcbiAgICAgICAgbWFpbkNvbnRlbnREaW0gKz0gbmV4dENvbnRlbnREaW07XG4gICAgICAgIGVuZExpbmUgPSBpICsgMTtcbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQj4gTGF5b3V0IGZsZXhpYmxlIGNoaWxkcmVuIGFuZCBhbGxvY2F0ZSBlbXB0eSBzcGFjZVxuXG4gICAgICAvLyBJbiBvcmRlciB0byBwb3NpdGlvbiB0aGUgZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcywgd2UgaGF2ZSB0d29cbiAgICAgIC8vIGNvbnRyb2xzLiBUaGUgc3BhY2UgYmV0d2VlbiB0aGUgYmVnaW5uaW5nIGFuZCB0aGUgZmlyc3QgZWxlbWVudFxuICAgICAgLy8gYW5kIHRoZSBzcGFjZSBiZXR3ZWVuIGVhY2ggdHdvIGVsZW1lbnRzLlxuICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdNYWluRGltID0gMDtcbiAgICAgIHZhci8qZmxvYXQqLyBiZXR3ZWVuTWFpbkRpbSA9IDA7XG5cbiAgICAgIC8vIFRoZSByZW1haW5pbmcgYXZhaWxhYmxlIHNwYWNlIHRoYXQgbmVlZHMgdG8gYmUgYWxsb2NhdGVkXG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nTWFpbkRpbSA9IDA7XG4gICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZGVmaW5lZE1haW5EaW0gLSBtYWluQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihtYWluQ29udGVudERpbSwgMCkgLSBtYWluQ29udGVudERpbTtcbiAgICAgIH1cblxuICAgICAgLy8gSWYgdGhlcmUgYXJlIGZsZXhpYmxlIGNoaWxkcmVuIGluIHRoZSBtaXgsIHRoZXkgYXJlIGdvaW5nIHRvIGZpbGwgdGhlXG4gICAgICAvLyByZW1haW5pbmcgc3BhY2VcbiAgICAgIGlmIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgIT09IDApIHtcbiAgICAgICAgdmFyLypmbG9hdCovIGZsZXhpYmxlTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyB0b3RhbEZsZXhpYmxlO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYmFzZU1haW5EaW07XG4gICAgICAgIHZhci8qZmxvYXQqLyBib3VuZE1haW5EaW07XG5cbiAgICAgICAgLy8gSWYgdGhlIGZsZXggc2hhcmUgb2YgcmVtYWluaW5nIHNwYWNlIGRvZXNuJ3QgbWVldCBtaW4vbWF4IGJvdW5kcyxcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgY2hpbGQgZnJvbSBmbGV4IGNhbGN1bGF0aW9ucy5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIGJhc2VNYWluRGltID0gZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGJvdW5kTWFpbkRpbSA9IGJvdW5kQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcywgYmFzZU1haW5EaW0pO1xuXG4gICAgICAgICAgaWYgKGJhc2VNYWluRGltICE9PSBib3VuZE1haW5EaW0pIHtcbiAgICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gLT0gYm91bmRNYWluRGltO1xuICAgICAgICAgICAgdG90YWxGbGV4aWJsZSAtPSBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgfVxuICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcblxuICAgICAgICAvLyBUaGUgbm9uIGZsZXhpYmxlIGNoaWxkcmVuIGNhbiBvdmVyZmxvdyB0aGUgY29udGFpbmVyLCBpbiB0aGlzIGNhc2VcbiAgICAgICAgLy8gd2Ugc2hvdWxkIGp1c3QgYXNzdW1lIHRoYXQgdGhlcmUgaXMgbm8gc3BhY2UgYXZhaWxhYmxlLlxuICAgICAgICBpZiAoZmxleGlibGVNYWluRGltIDwgMCkge1xuICAgICAgICAgIGZsZXhpYmxlTWFpbkRpbSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RmxleENoaWxkID0gZmlyc3RGbGV4Q2hpbGQ7XG4gICAgICAgIHdoaWxlIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBrbm93IHRoZSBmaW5hbCBzaXplIG9mIHRoZSBlbGVtZW50IGluIHRoZSBtYWluXG4gICAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZC5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsXG4gICAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gKiBjdXJyZW50RmxleENoaWxkLnN0eWxlLmZsZXggK1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKGlzRGltRGVmaW5lZChub2RlLCByZXNvbHZlZFJvd0F4aXMpKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfSBlbHNlIGlmICghaXNNYWluUm93RGlyZWN0aW9uKSB7XG4gICAgICAgICAgICBtYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoIC1cbiAgICAgICAgICAgICAgZ2V0TWFyZ2luQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgcmVjdXJzaXZlbHkgY2FsbCB0aGUgbGF5b3V0IGFsZ29yaXRobSBmb3IgdGhpcyBjaGlsZFxuICAgICAgICAgIGxheW91dE5vZGUoLyooamF2YSkhbGF5b3V0Q29udGV4dCwgKi9jdXJyZW50RmxleENoaWxkLCBtYXhXaWR0aCwgZGlyZWN0aW9uKTtcblxuICAgICAgICAgIGNoaWxkID0gY3VycmVudEZsZXhDaGlsZDtcbiAgICAgICAgICBjdXJyZW50RmxleENoaWxkID0gY3VycmVudEZsZXhDaGlsZC5uZXh0RmxleENoaWxkO1xuICAgICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgIC8vIFdlIHVzZSBqdXN0aWZ5Q29udGVudCB0byBmaWd1cmUgb3V0IGhvdyB0byBhbGxvY2F0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAvLyBzcGFjZSBhdmFpbGFibGVcbiAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgIT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHtcbiAgICAgICAgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9DRU5URVIpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gLyAyO1xuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9GTEVYX0VORCkge1xuICAgICAgICAgIGxlYWRpbmdNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbTtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQkVUV0VFTikge1xuICAgICAgICAgIHJlbWFpbmluZ01haW5EaW0gPSBmbWF4ZihyZW1haW5pbmdNYWluRGltLCAwKTtcbiAgICAgICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50IC0gMSAhPT0gMCkge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC9cbiAgICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ID09PSBDU1NfSlVTVElGWV9TUEFDRV9BUk9VTkQpIHtcbiAgICAgICAgICAvLyBTcGFjZSBvbiB0aGUgZWRnZXMgaXMgaGFsZiBvZiB0aGUgc3BhY2UgYmV0d2VlbiBlbGVtZW50c1xuICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAoZmxleGlibGVDaGlsZHJlbkNvdW50ICsgbm9uRmxleGlibGVDaGlsZHJlbkNvdW50KTtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IGJldHdlZW5NYWluRGltIC8gMjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBDPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgbWFpbiBheGlzIGFuZCBjb21wdXRlIGRpbWVuc2lvbnNcblxuICAgICAgLy8gQXQgdGhpcyBwb2ludCwgYWxsIHRoZSBjaGlsZHJlbiBoYXZlIHRoZWlyIGRpbWVuc2lvbnMgc2V0LiBXZSBuZWVkIHRvXG4gICAgICAvLyBmaW5kIHRoZWlyIHBvc2l0aW9uLiBJbiBvcmRlciB0byBkbyB0aGF0LCB3ZSBhY2N1bXVsYXRlIGRhdGEgaW5cbiAgICAgIC8vIHZhcmlhYmxlcyB0aGF0IGFyZSBhbHNvIHVzZWZ1bCB0byBjb21wdXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZVxuICAgICAgLy8gY29udGFpbmVyIVxuICAgICAgbWFpbkRpbSArPSBsZWFkaW5nTWFpbkRpbTtcblxuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4TWFpbjsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkpIHtcbiAgICAgICAgICAvLyBJbiBjYXNlIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSBhbmQgaGFzIGxlZnQvdG9wIGJlaW5nXG4gICAgICAgICAgLy8gZGVmaW5lZCwgd2Ugb3ZlcnJpZGUgdGhlIHBvc2l0aW9uIHRvIHdoYXRldmVyIHRoZSB1c2VyIHNhaWRcbiAgICAgICAgICAvLyAoYW5kIG1hcmdpbi9ib3JkZXIpLlxuICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbbWFpbkF4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW21haW5BeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBtYWluQXhpcykgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIElmIHRoZSBjaGlsZCBpcyBwb3NpdGlvbiBhYnNvbHV0ZSAod2l0aG91dCB0b3AvbGVmdCkgb3IgcmVsYXRpdmUsXG4gICAgICAgICAgLy8gd2UgcHV0IGl0IGF0IHRoZSBjdXJyZW50IGFjY3VtdWxhdGVkIG9mZnNldC5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcblxuICAgICAgICAgIC8vIERlZmluZSB0aGUgdHJhaWxpbmcgcG9zaXRpb24gYWNjb3JkaW5nbHkuXG4gICAgICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBOb3cgdGhhdCB3ZSBwbGFjZWQgdGhlIGVsZW1lbnQsIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSB2YXJpYWJsZXNcbiAgICAgICAgICAvLyBXZSBvbmx5IG5lZWQgdG8gZG8gdGhhdCBmb3IgcmVsYXRpdmUgZWxlbWVudHMuIEFic29sdXRlIGVsZW1lbnRzXG4gICAgICAgICAgLy8gZG8gbm90IHRha2UgcGFydCBpbiB0aGF0IHBoYXNlLlxuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBtYWluIGRpbWVuc2lvbiBpcyB0aGUgc3VtIG9mIGFsbCB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHBsdXNcbiAgICAgICAgICAgIC8vIHRoZSBzcGFjaW5nLlxuICAgICAgICAgICAgbWFpbkRpbSArPSBiZXR3ZWVuTWFpbkRpbSArIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICAgIC8vIFRoZSBjcm9zcyBkaW1lbnNpb24gaXMgdGhlIG1heCBvZiB0aGUgZWxlbWVudHMgZGltZW5zaW9uIHNpbmNlIHRoZXJlXG4gICAgICAgICAgICAvLyBjYW4gb25seSBiZSBvbmUgZWxlbWVudCBpbiB0aGF0IGNyb3NzIGRpbWVuc2lvbi5cbiAgICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjb250YWluZXJDcm9zc0F4aXMgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICBpZiAoIWlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICAgIGNvbnRhaW5lckNyb3NzQXhpcyA9IGZtYXhmKFxuICAgICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgICAgLy8gaXMgYWdncmVnYXRlIHZpYSBhIG1heCBmdW5jdGlvbi4gSW50ZXJtZWRpYXRlIG5lZ2F0aXZlIHZhbHVlc1xuICAgICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgY3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEQ+IFBvc2l0aW9uIGVsZW1lbnRzIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICBmb3IgKGkgPSBmaXJzdENvbXBsZXhDcm9zczsgaSA8IGVuZExpbmU7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9BQlNPTFVURSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgYWJzb2x1dGVseSBwb3NpdGlvbm5lZCBhbmQgaGFzIGFcbiAgICAgICAgICAvLyB0b3AvbGVmdC9ib3R0b20vcmlnaHQgYmVpbmcgc2V0LCB3ZSBvdmVycmlkZSBhbGwgdGhlIHByZXZpb3VzbHlcbiAgICAgICAgICAvLyBjb21wdXRlZCBwb3NpdGlvbnMgdG8gc2V0IGl0IGNvcnJlY3RseS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gZ2V0UG9zaXRpb24oY2hpbGQsIGxlYWRpbmdbY3Jvc3NBeGlzXSkgK1xuICAgICAgICAgICAgZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBjcm9zc0F4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ0Nyb3NzRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgICAgIC8vIEZvciBhIHJlbGF0aXZlIGNoaWxkcmVuLCB3ZSdyZSBlaXRoZXIgdXNpbmcgYWxpZ25JdGVtcyAocGFyZW50KSBvclxuICAgICAgICAgIC8vIGFsaWduU2VsZiAoY2hpbGQpIGluIG9yZGVyIHRvIGRldGVybWluZSB0aGUgcG9zaXRpb24gaW4gdGhlIGNyb3NzIGF4aXNcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICAvLyBUaGlzIHZhcmlhYmxlIGlzIGludGVudGlvbmFsbHkgcmUtZGVmaW5lZCBhcyB0aGUgY29kZSBpcyB0cmFuc3BpbGVkIHRvIGEgYmxvY2sgc2NvcGUgbGFuZ3VhZ2VcbiAgICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgICAgLyplc2xpbnQtZW5hYmxlICovXG4gICAgICAgICAgICBpZiAoYWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgICAvLyBZb3UgY2FuIG9ubHkgc3RyZXRjaCBpZiB0aGUgZGltZW5zaW9uIGhhcyBub3QgYWxyZWFkeSBiZWVuIHNldFxuICAgICAgICAgICAgICAvLyBwcmV2aW91c2x5LlxuICAgICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgY29udGFpbmVyQ3Jvc3NBeGlzIC1cbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkl0ZW0gIT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICAgIC8vIFRoZSByZW1haW5pbmcgc3BhY2UgYmV0d2VlbiB0aGUgcGFyZW50IGRpbWVuc2lvbnMrcGFkZGluZyBhbmQgY2hpbGRcbiAgICAgICAgICAgICAgLy8gZGltZW5zaW9ucyttYXJnaW4uXG4gICAgICAgICAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdDcm9zc0RpbSA9IGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldERpbVdpdGhNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcyk7XG5cbiAgICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbSAvIDI7XG4gICAgICAgICAgICAgIH0gZWxzZSB7IC8vIENTU19BTElHTl9GTEVYX0VORFxuICAgICAgICAgICAgICAgIGxlYWRpbmdDcm9zc0RpbSArPSByZW1haW5pbmdDcm9zc0RpbTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFuZCB3ZSBhcHBseSB0aGUgcG9zaXRpb25cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dICs9IGxpbmVzQ3Jvc3NEaW0gKyBsZWFkaW5nQ3Jvc3NEaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGluZXNDcm9zc0RpbSArPSBjcm9zc0RpbTtcbiAgICAgIGxpbmVzTWFpbkRpbSA9IGZtYXhmKGxpbmVzTWFpbkRpbSwgbWFpbkRpbSk7XG4gICAgICBsaW5lc0NvdW50ICs9IDE7XG4gICAgICBzdGFydExpbmUgPSBlbmRMaW5lO1xuICAgIH1cblxuICAgIC8vIDxMb29wIEU+XG4gICAgLy9cbiAgICAvLyBOb3RlKHByZW5hdXgpOiBNb3JlIHRoYW4gb25lIGxpbmUsIHdlIG5lZWQgdG8gbGF5b3V0IHRoZSBjcm9zc0F4aXNcbiAgICAvLyBhY2NvcmRpbmcgdG8gYWxpZ25Db250ZW50LlxuICAgIC8vXG4gICAgLy8gTm90ZSB0aGF0IHdlIGNvdWxkIHByb2JhYmx5IHJlbW92ZSA8TG9vcCBEPiBhbmQgaGFuZGxlIHRoZSBvbmUgbGluZSBjYXNlXG4gICAgLy8gaGVyZSB0b28sIGJ1dCBmb3IgdGhlIG1vbWVudCB0aGlzIGlzIHNhZmVyIHNpbmNlIGl0IHdvbid0IGludGVyZmVyZSB3aXRoXG4gICAgLy8gcHJldmlvdXNseSB3b3JraW5nIGNvZGUuXG4gICAgLy9cbiAgICAvLyBTZWUgc3BlY3M6XG4gICAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvMjAxMi9DUi1jc3MzLWZsZXhib3gtMjAxMjA5MTgvI2xheW91dC1hbGdvcml0aG1cbiAgICAvLyBzZWN0aW9uIDkuNFxuICAgIC8vXG4gICAgaWYgKGxpbmVzQ291bnQgPiAxICYmIGlzQ3Jvc3NEaW1EZWZpbmVkKSB7XG4gICAgICB2YXIvKmZsb2F0Ki8gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSA9IG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSAtXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcztcbiAgICAgIHZhci8qZmxvYXQqLyByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gPSBub2RlQ3Jvc3NBeGlzSW5uZXJTaXplIC0gbGluZXNDcm9zc0RpbTtcblxuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltTGVhZCA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gY3VycmVudExlYWQgPSBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzO1xuXG4gICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50ID0gZ2V0QWxpZ25Db250ZW50KG5vZGUpO1xuICAgICAgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbTtcbiAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50ID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgIGN1cnJlbnRMZWFkICs9IHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIDI7XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgaWYgKG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPiBsaW5lc0Nyb3NzRGltKSB7XG4gICAgICAgICAgY3Jvc3NEaW1MZWFkID0gKHJlbWFpbmluZ0FsaWduQ29udGVudERpbSAvIGxpbmVzQ291bnQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhci8qaW50Ki8gZW5kSW5kZXggPSAwO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGxpbmVzQ291bnQ7ICsraSkge1xuICAgICAgICB2YXIvKmludCovIHN0YXJ0SW5kZXggPSBlbmRJbmRleDtcblxuICAgICAgICAvLyBjb21wdXRlIHRoZSBsaW5lJ3MgaGVpZ2h0IGFuZCBmaW5kIHRoZSBlbmRJbmRleFxuICAgICAgICB2YXIvKmZsb2F0Ki8gbGluZUhlaWdodCA9IDA7XG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGNoaWxkQ291bnQ7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoY2hpbGQubGluZUluZGV4ICE9PSBpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkge1xuICAgICAgICAgICAgbGluZUhlaWdodCA9IGZtYXhmKFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0LFxuICAgICAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dICsgZ2V0TWFyZ2luQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZW5kSW5kZXggPSBpaTtcbiAgICAgICAgbGluZUhlaWdodCArPSBjcm9zc0RpbUxlYWQ7XG5cbiAgICAgICAgZm9yIChpaSA9IHN0YXJ0SW5kZXg7IGlpIDwgZW5kSW5kZXg7ICsraWkpIHtcbiAgICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baWldO1xuICAgICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuICAgICAgICAgIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9GTEVYX1NUQVJUKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9FTkQpIHtcbiAgICAgICAgICAgIGNoaWxkLmxheW91dFtwb3NbY3Jvc3NBeGlzXV0gPSBjdXJyZW50TGVhZCArIGxpbmVIZWlnaHQgLSBnZXRUcmFpbGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSAtIGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgIHZhci8qZmxvYXQqLyBjaGlsZEhlaWdodCA9IGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV07XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyAobGluZUhlaWdodCAtIGNoaWxkSGVpZ2h0KSAvIDI7XG4gICAgICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnRBbGlnbkl0ZW0gPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuICAgICAgICAgICAgLy8gVE9ETyhwcmVuYXV4KTogQ29ycmVjdGx5IHNldCB0aGUgaGVpZ2h0IG9mIGl0ZW1zIHdpdGggdW5kZWZpbmVkXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAoYXV0bykgY3Jvc3NBeGlzIGRpbWVuc2lvbi5cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50TGVhZCArPSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIG5lZWRzTWFpblRyYWlsaW5nUG9zID0gZmFsc2U7XG4gICAgdmFyLypib29sKi8gbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gZmFsc2U7XG5cbiAgICAvLyBJZiB0aGUgdXNlciBkaWRuJ3Qgc3BlY2lmeSBhIHdpZHRoIG9yIGhlaWdodCwgYW5kIGl0IGhhcyBub3QgYmVlbiBzZXRcbiAgICAvLyBieSB0aGUgY29udGFpbmVyLCB0aGVuIHdlIHNldCBpdCB2aWEgdGhlIGNoaWxkcmVuLlxuICAgIGlmICghaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gPSBmbWF4ZihcbiAgICAgICAgLy8gV2UncmUgbWlzc2luZyB0aGUgbGFzdCBwYWRkaW5nIGF0IHRoaXMgcG9pbnQgdG8gZ2V0IHRoZSBmaW5hbFxuICAgICAgICAvLyBkaW1lbnNpb25cbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIG1haW5BeGlzLCBsaW5lc01haW5EaW0gKyBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpKSxcbiAgICAgICAgLy8gV2UgY2FuIG5ldmVyIGFzc2lnbiBhIHdpZHRoIHNtYWxsZXIgdGhhbiB0aGUgcGFkZGluZyBhbmQgYm9yZGVyc1xuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW5cbiAgICAgICk7XG5cbiAgICAgIGlmIChtYWluQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgbWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc01haW5UcmFpbGluZ1BvcyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIEZvciB0aGUgY3Jvc3MgZGltLCB3ZSBhZGQgYm90aCBzaWRlcyBhdCB0aGUgZW5kIGJlY2F1c2UgdGhlIHZhbHVlXG4gICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgLy8gY2FuIG1lc3MgdGhpcyBjb21wdXRhdGlvbiBvdGhlcndpc2VcbiAgICAgICAgYm91bmRBeGlzKG5vZGUsIGNyb3NzQXhpcywgbGluZXNDcm9zc0RpbSArIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MpLFxuICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzXG4gICAgICApO1xuXG4gICAgICBpZiAoY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UgfHxcbiAgICAgICAgICBjcm9zc0F4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU5fUkVWRVJTRSkge1xuICAgICAgICBuZWVkc0Nyb3NzVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEY+IFNldCB0cmFpbGluZyBwb3NpdGlvbiBpZiBuZWNlc3NhcnlcbiAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MgfHwgbmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcblxuICAgICAgICBpZiAobmVlZHNNYWluVHJhaWxpbmdQb3MpIHtcbiAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobmVlZHNDcm9zc1RyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIDxMb29wIEc+IENhbGN1bGF0ZSBkaW1lbnNpb25zIGZvciBhYnNvbHV0ZWx5IHBvc2l0aW9uZWQgZWxlbWVudHNcbiAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGZpcnN0QWJzb2x1dGVDaGlsZDtcbiAgICB3aGlsZSAoY3VycmVudEFic29sdXRlQ2hpbGQgIT09IG51bGwpIHtcbiAgICAgIC8vIFByZS1maWxsIGRpbWVuc2lvbnMgd2hlbiB1c2luZyBhYnNvbHV0ZSBwb3NpdGlvbiBhbmQgYm90aCBvZmZzZXRzIGZvclxuICAgICAgLy8gdGhlIGF4aXMgYXJlIGRlZmluZWQgKGVpdGhlciBib3RoIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgIGZvciAoaWkgPSAwOyBpaSA8IDI7IGlpKyspIHtcbiAgICAgICAgYXhpcyA9IChpaSAhPT0gMCkgPyBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XIDogQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcblxuICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtheGlzXV0pICYmXG4gICAgICAgICAgICAhaXNEaW1EZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgYm91bmRBeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgZ2V0Qm9yZGVyQXhpcyhub2RlLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIGxlYWRpbmdbYXhpc10pIC1cbiAgICAgICAgICAgICAgZ2V0UG9zaXRpb24oY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcylcbiAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pICYmXG4gICAgICAgICAgICAhaXNQb3NEZWZpbmVkKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSkge1xuICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtsZWFkaW5nW2F4aXNdXSA9XG4gICAgICAgICAgICBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY2hpbGQgPSBjdXJyZW50QWJzb2x1dGVDaGlsZDtcbiAgICAgIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQubmV4dEFic29sdXRlQ2hpbGQ7XG4gICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGF5b3V0Tm9kZShub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgbm9kZS5zaG91bGRVcGRhdGUgPSB0cnVlO1xuXG4gICAgdmFyIGRpcmVjdGlvbiA9IG5vZGUuc3R5bGUuZGlyZWN0aW9uIHx8IENTU19ESVJFQ1RJT05fTFRSO1xuICAgIHZhciBza2lwTGF5b3V0ID1cbiAgICAgICFub2RlLmlzRGlydHkgJiZcbiAgICAgIG5vZGUubGFzdExheW91dCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9PT0gbm9kZS5sYXlvdXQuaGVpZ2h0ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPT09IG5vZGUubGF5b3V0LndpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPT09IHBhcmVudE1heFdpZHRoICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQuZGlyZWN0aW9uID09PSBkaXJlY3Rpb247XG5cbiAgICBpZiAoc2tpcExheW91dCkge1xuICAgICAgbm9kZS5sYXlvdXQud2lkdGggPSBub2RlLmxhc3RMYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXlvdXQudG9wID0gbm9kZS5sYXN0TGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGF5b3V0LmxlZnQgPSBub2RlLmxhc3RMYXlvdXQubGVmdDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFub2RlLmxhc3RMYXlvdXQpIHtcbiAgICAgICAgbm9kZS5sYXN0TGF5b3V0ID0ge307XG4gICAgICB9XG5cbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRXaWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZEhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC5wYXJlbnRNYXhXaWR0aCA9IHBhcmVudE1heFdpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgLy8gUmVzZXQgY2hpbGQgbGF5b3V0c1xuICAgICAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGNoaWxkLmxheW91dC53aWR0aCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LmhlaWdodCA9IHVuZGVmaW5lZDtcbiAgICAgICAgY2hpbGQubGF5b3V0LnRvcCA9IDA7XG4gICAgICAgIGNoaWxkLmxheW91dC5sZWZ0ID0gMDtcbiAgICAgIH0pO1xuXG4gICAgICBsYXlvdXROb2RlSW1wbChub2RlLCBwYXJlbnRNYXhXaWR0aCwgcGFyZW50RGlyZWN0aW9uKTtcblxuICAgICAgbm9kZS5sYXN0TGF5b3V0LndpZHRoID0gbm9kZS5sYXlvdXQud2lkdGg7XG4gICAgICBub2RlLmxhc3RMYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXlvdXQuaGVpZ2h0O1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LnRvcCA9IG5vZGUubGF5b3V0LnRvcDtcbiAgICAgIG5vZGUubGFzdExheW91dC5sZWZ0ID0gbm9kZS5sYXlvdXQubGVmdDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGxheW91dE5vZGVJbXBsOiBsYXlvdXROb2RlSW1wbCxcbiAgICBjb21wdXRlTGF5b3V0OiBsYXlvdXROb2RlLFxuICAgIGZpbGxOb2RlczogZmlsbE5vZGVzXG4gIH07XG59KSgpO1xuXG4vLyBUaGlzIG1vZHVsZSBleHBvcnQgaXMgb25seSB1c2VkIGZvciB0aGUgcHVycG9zZXMgb2YgdW5pdCB0ZXN0aW5nIHRoaXMgZmlsZS4gV2hlblxuLy8gdGhlIGxpYnJhcnkgaXMgcGFja2FnZWQgdGhpcyBmaWxlIGlzIGluY2x1ZGVkIHdpdGhpbiBjc3MtbGF5b3V0LmpzIHdoaWNoIGZvcm1zXG4vLyB0aGUgcHVibGljIEFQSS5cbmlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBjb21wdXRlTGF5b3V0O1xufVxuXG5cbiAgcmV0dXJuIGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAvKmVzbGludC1kaXNhYmxlICovXG4gICAgLy8gZGlzYWJsaW5nIEVTTGludCBiZWNhdXNlIHRoaXMgY29kZSByZWxpZXMgb24gdGhlIGFib3ZlIGluY2x1ZGVcbiAgICBjb21wdXRlTGF5b3V0LmZpbGxOb2Rlcyhub2RlKTtcbiAgICBjb21wdXRlTGF5b3V0LmNvbXB1dGVMYXlvdXQobm9kZSk7XG4gICAgLyplc2xpbnQtZW5hYmxlICovXG4gIH07XG59KSk7XG4iLCJmdW5jdGlvbiBFICgpIHtcbiAgLy8gS2VlcCB0aGlzIGVtcHR5IHNvIGl0J3MgZWFzaWVyIHRvIGluaGVyaXQgZnJvbVxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXG59XG5cbkUucHJvdG90eXBlID0ge1xuICBvbjogZnVuY3Rpb24gKG5hbWUsIGNhbGxiYWNrLCBjdHgpIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuXG4gICAgKGVbbmFtZV0gfHwgKGVbbmFtZV0gPSBbXSkpLnB1c2goe1xuICAgICAgZm46IGNhbGxiYWNrLFxuICAgICAgY3R4OiBjdHhcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGZ1bmN0aW9uIGxpc3RlbmVyICgpIHtcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGN0eCwgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgbGlzdGVuZXIuXyA9IGNhbGxiYWNrXG4gICAgcmV0dXJuIHRoaXMub24obmFtZSwgbGlzdGVuZXIsIGN0eCk7XG4gIH0sXG5cbiAgZW1pdDogZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgZXZ0QXJyID0gKCh0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KSlbbmFtZV0gfHwgW10pLnNsaWNlKCk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xuXG4gICAgZm9yIChpOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xuICAgIHZhciBlID0gdGhpcy5lIHx8ICh0aGlzLmUgPSB7fSk7XG4gICAgdmFyIGV2dHMgPSBlW25hbWVdO1xuICAgIHZhciBsaXZlRXZlbnRzID0gW107XG5cbiAgICBpZiAoZXZ0cyAmJiBjYWxsYmFjaykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgaWYgKGV2dHNbaV0uZm4gIT09IGNhbGxiYWNrICYmIGV2dHNbaV0uZm4uXyAhPT0gY2FsbGJhY2spXG4gICAgICAgICAgbGl2ZUV2ZW50cy5wdXNoKGV2dHNbaV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcbiAgICAvLyBTdWdnZXN0ZWQgYnkgaHR0cHM6Ly9naXRodWIuY29tL2xhemRcbiAgICAvLyBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvY29tbWl0L2M2ZWJmYWE5YmM5NzNiMzNkMTEwYTg0YTMwNzc0MmI3Y2Y5NGM5NTMjY29tbWl0Y29tbWVudC01MDI0OTEwXG5cbiAgICAobGl2ZUV2ZW50cy5sZW5ndGgpXG4gICAgICA/IGVbbmFtZV0gPSBsaXZlRXZlbnRzXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRTtcbm1vZHVsZS5leHBvcnRzLlRpbnlFbWl0dGVyID0gRTtcbiIsImltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9pbWFnZU1hbmFnZXInO1xuY29uc3QgRW1pdHRlciA9IHJlcXVpcmUoJ3RpbnktZW1pdHRlcicpO1xuXG5pbnRlcmZhY2UgQ2hhckRhdGEge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdzogbnVtYmVyO1xuICBoOiBudW1iZXI7XG4gIG9mZlg6IG51bWJlcjtcbiAgb2ZmWTogbnVtYmVyO1xuICB4YWR2YW5jZTogbnVtYmVyO1xuICBrZXJuaW5nOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xufVxuXG5pbnRlcmZhY2UgQ2hhcnMge1xuICBba2V5OiBzdHJpbmddOiBDaGFyRGF0YTtcbn1cblxudHlwZSBDb25maWdMaW5lRGF0YSA9IHtcbiAgbGluZTogc3RyaW5nW107XG4gIGluZGV4OiBudW1iZXI7XG59O1xuXG5cbi8qKlxuICogaHR0cDovL3d3dy5hbmdlbGNvZGUuY29tL3Byb2R1Y3RzL2JtZm9udC9kb2MvZmlsZV9mb3JtYXQuaHRtbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBGb250IHtcbiAgcHJpdmF0ZSBjb25maWc6IHN0cmluZztcbiAgcHVibGljIGV2ZW50OiBhbnk7XG5cbiAgcHVibGljIGNoYXJzOiBDaGFycztcblxuICBwdWJsaWMgcmVhZHkgPSBmYWxzZTtcbiAgcHVibGljIHRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuICBwdWJsaWMgbGluZUhlaWdodD86IG51bWJlcjtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuXG5cbiAgLy8gcG9vbOeahOWunueOsOaUvuWIsOexu+mHjOmdouWunueOsOW5tuS4jeS8mOmbhe+8jOWFiOWOu+aOieS6hlxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY2hhcnMgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgdGhpcy5ldmVudCA9IG5ldyBFbWl0dGVyKCk7XG5cbiAgICB0aGlzLnRleHR1cmUgPSBpbWFnZU1hbmFnZXIubG9hZEltYWdlKHNyYywgKHRleHR1cmUsIGZyb21DYWNoZSkgPT4ge1xuICAgICAgaWYgKGZyb21DYWNoZSkge1xuICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xuICAgICAgfVxuICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XG4gICAgICB0aGlzLmV2ZW50LmVtaXQoJ3RleHRfX2xvYWRfX2RvbmUnKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBhcnNlQ29uZmlnKGZudFRleHQ6IHN0cmluZykge1xuICAgIGZudFRleHQgPSBmbnRUZXh0LnNwbGl0KCdcXHJcXG4nKS5qb2luKCdcXG4nKTtcbiAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBmbnRUZXh0LnNwbGl0KCdcXG4nKTtcbiAgICBjb25zdCBsaW5lc1BhcnNlZDogc3RyaW5nW11bXSA9IGxpbmVzLm1hcChsaW5lID0+IGxpbmUudHJpbSgpLnNwbGl0KCcgJykpO1xuXG4gICAgY29uc3QgY2hhcnNMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NoYXJzJyk7XG4gICAgY29uc3QgY2hhcnNDb3VudDogbnVtYmVyID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyc0xpbmUubGluZSwgJ2NvdW50Jyk7XG5cbiAgICBjb25zdCBjb21tb25MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2NvbW1vbicpO1xuICAgIHRoaXMubGluZUhlaWdodCA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29tbW9uTGluZS5saW5lLCAnbGluZUhlaWdodCcpO1xuXG4gICAgY29uc3QgaW5mb0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAnaW5mbycpO1xuICAgIHRoaXMuZm9udFNpemUgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGluZm9MaW5lLmxpbmUsICdzaXplJyk7XG5cbiAgICAvLyDmjqXljbgga2VybmluZ3NcbiAgICBjb25zdCBrZXJuaW5nc0xpbmU6IENvbmZpZ0xpbmVEYXRhID0gdGhpcy5nZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkLCAna2VybmluZ3MnKTtcbiAgICBsZXQga2VybmluZ3NDb3VudCA9IDA7XG4gICAgbGV0IGtlcm5pbmdzU3RhcnQgPSAtMTtcbiAgICBpZiAoa2VybmluZ3NMaW5lLmxpbmUpIHtcbiAgICAgIGtlcm5pbmdzQ291bnQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGtlcm5pbmdzTGluZS5saW5lLCAnY291bnQnKTtcbiAgICAgIGtlcm5pbmdzU3RhcnQgPSBrZXJuaW5nc0xpbmUuaW5kZXggKyAxO1xuICAgIH1cblxuICAgIGNvbnN0IGNoYXJzOiBDaGFycyA9IHt9O1xuICAgIGZvciAobGV0IGkgPSA0OyBpIDwgNCArIGNoYXJzQ291bnQ7IGkrKykge1xuICAgICAgY29uc3QgY2hhclRleHQ6IHN0cmluZyA9IGxpbmVzW2ldO1xuICAgICAgY29uc3QgbGV0dGVyOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICdpZCcpKTtcblxuICAgICAgY29uc3QgYzogQ2hhckRhdGEgPSB7XG4gICAgICAgIHg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4JyksXG4gICAgICAgIHk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5JyksXG4gICAgICAgIHc6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd3aWR0aCcpLFxuICAgICAgICBoOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaGVpZ2h0JyksXG4gICAgICAgIG9mZlg6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd4b2Zmc2V0JyksXG4gICAgICAgIG9mZlk6IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhclRleHQsICd5b2Zmc2V0JyksXG4gICAgICAgIHhhZHZhbmNlOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneGFkdmFuY2UnKSxcbiAgICAgICAga2VybmluZzoge31cbiAgICAgIH07XG4gICAgICBjaGFyc1tsZXR0ZXJdID0gYztcbiAgICB9XG5cbiAgICAvLyBwYXJzZSBrZXJuaW5nc1xuICAgIGlmIChrZXJuaW5nc0NvdW50KSB7XG4gICAgICBmb3IgKGxldCBpID0ga2VybmluZ3NTdGFydDsgaSA8PSBrZXJuaW5nc1N0YXJ0ICsga2VybmluZ3NDb3VudDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGxpbmU6IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG4gICAgICAgIGNvbnN0IGZpcnN0OiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2ZpcnN0JykpO1xuICAgICAgICBjb25zdCBzZWNvbmQ6IHN0cmluZyA9IFN0cmluZy5mcm9tQ2hhckNvZGUodGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShsaW5lLCAnc2Vjb25kJykpO1xuICAgICAgICBjb25zdCBhbW91bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ2Ftb3VudCcpO1xuXG4gICAgICAgIGlmIChjaGFyc1tzZWNvbmRdKSB7XG4gICAgICAgICAgY2hhcnNbc2Vjb25kXS5rZXJuaW5nW2ZpcnN0XSA9IGFtb3VudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjaGFycztcbiAgfVxuXG4gIGdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQ6IHN0cmluZ1tdW10sIGxpbmVOYW1lID0gJycpOiBDb25maWdMaW5lRGF0YSB7XG4gICAgbGV0IGluZGV4ID0gLTE7XG4gICAgbGV0IGxpbmU6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgbGVuID0gbGluZXNQYXJzZWQubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgaXRlbTogc3RyaW5nW10gPSBsaW5lc1BhcnNlZFtpXTtcblxuICAgICAgaWYgKGl0ZW1bMF0gPT09IGxpbmVOYW1lKSB7XG4gICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgbGluZSA9IGl0ZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxpbmUsXG4gICAgICBpbmRleCxcbiAgICB9O1xuICB9XG5cbiAgZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY29uZmlnVGV4dDogc3RyaW5nW10gfCBzdHJpbmcsIGtleTogc3RyaW5nKSB7XG4gICAgY29uc3QgaXRlbUNvbmZpZ1RleHRMaXN0ID0gQXJyYXkuaXNBcnJheShjb25maWdUZXh0KSA/IGNvbmZpZ1RleHQgOiBjb25maWdUZXh0LnNwbGl0KCcgJyk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgeyBsZW5ndGggfSA9IGl0ZW1Db25maWdUZXh0TGlzdDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBpdGVtQ29uZmlnVGV4dCA9IGl0ZW1Db25maWdUZXh0TGlzdFtpXTtcbiAgICAgIGlmIChrZXkgPT09IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZygwLCBrZXkubGVuZ3RoKSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGl0ZW1Db25maWdUZXh0LnN1YnN0cmluZyhrZXkubGVuZ3RoICsgMSk7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiIsImludGVyZmFjZSBEZWJ1Z0luZm9JdGVtIHtcbiAgc3RhcnQ6IG51bWJlcjtcbiAgaXNJbm5lcjogYm9vbGVhbjtcbiAgZW5kPzogbnVtYmVyO1xuICBjb3N0PzogbnVtYmVyO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWJ1Z0luZm8ge1xuICBwdWJsaWMgaW5mbzogeyBba2V5OiBzdHJpbmddOiBEZWJ1Z0luZm9JdGVtIH0gPSB7fTtcbiAgcHVibGljIHRvdGFsU3RhcnQ6IG51bWJlciA9IDA7XG4gIHB1YmxpYyB0b3RhbENvc3Q6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgc3RhcnQobmFtZTogc3RyaW5nLCBpc0lubmVyOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy50b3RhbFN0YXJ0ID09PSAwKSB7XG4gICAgICB0aGlzLnRvdGFsU3RhcnQgPSBEYXRlLm5vdygpO1xuICAgIH1cblxuICAgIHRoaXMuaW5mb1tuYW1lXSA9IHtcbiAgICAgIHN0YXJ0OiBEYXRlLm5vdygpLFxuICAgICAgaXNJbm5lcixcbiAgICB9O1xuICB9XG5cbiAgZW5kKG5hbWU6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmluZm9bbmFtZV0pIHtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5lbmQgPSBEYXRlLm5vdygpO1xuICAgICAgdGhpcy5pbmZvW25hbWVdLmNvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy5pbmZvW25hbWVdLnN0YXJ0O1xuICAgICAgdGhpcy50b3RhbENvc3QgPSAodGhpcy5pbmZvW25hbWVdLmVuZCBhcyBudW1iZXIpIC0gdGhpcy50b3RhbFN0YXJ0O1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5mbyA9IHt9O1xuICAgIHRoaXMudG90YWxTdGFydCA9IDA7XG4gICAgdGhpcy50b3RhbENvc3QgPSAwO1xuICB9XG5cbiAgbG9nKG5lZWRJbm5lcjogYm9vbGVhbiA9IGZhbHNlKTogc3RyaW5nIHtcbiAgICBsZXQgbG9nSW5mbyA9ICdMYXlvdXQgZGVidWcgaW5mbzogXFxuJztcbiAgICBsb2dJbmZvICs9IE9iamVjdC5rZXlzKHRoaXMuaW5mbykucmVkdWNlKChzdW0sIGN1cnIpID0+IHtcbiAgICAgIGlmICh0aGlzLmluZm9bY3Vycl0uaXNJbm5lciAmJiAhbmVlZElubmVyKSB7XG4gICAgICAgIHJldHVybiBzdW07XG4gICAgICB9XG4gICAgICBzdW0gKz0gYCR7Y3Vycn06ICR7dGhpcy5pbmZvW2N1cnJdLmNvc3R9XFxuYDtcbiAgICAgIHJldHVybiBzdW07XG4gICAgfSwgJycpO1xuXG4gICAgbG9nSW5mbyArPSBgdG90YWxDb3N0OiAke3RoaXMudG90YWxDb3N0fVxcbmA7XG5cbiAgICByZXR1cm4gbG9nSW5mbztcbiAgfVxufVxuIiwiaW1wb3J0IFBvb2wgZnJvbSAnLi9wb29sJztcbmltcG9ydCB7IG5vbmUsIGNyZWF0ZUltYWdlIH0gZnJvbSAnLi91dGlsJztcblxudHlwZSBDYWxsYmFjayA9IChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIGZyb21DYWNoZTogYm9vbGVhbikgPT4gdm9pZDtcbmludGVyZmFjZSBJbWFnZUNhY2hlIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBsb2FkRG9uZTogYm9vbGVhbjtcbiAgb25sb2FkY2JrczogQ2FsbGJhY2tbXTtcbiAgb25lcnJvcmNia3M6IENhbGxiYWNrW107XG59XG5cbmNsYXNzIEltYWdlTWFuYWdlciB7XG4gIHByaXZhdGUgaW1nUG9vbCA9IG5ldyBQb29sPEltYWdlQ2FjaGU+KCdpbWdQb29sJyk7XG4gIFxuICBnZXRSZXMoc3JjOiBzdHJpbmcpOiBJbWFnZUNhY2hlIHtcbiAgICByZXR1cm4gdGhpcy5pbWdQb29sLmdldChzcmMpO1xuICB9XG5cbiAgbG9hZEltYWdlUHJvbWlzZShzcmM6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5sb2FkSW1hZ2Uoc3JjLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlKHNyYzogc3RyaW5nLCBzdWNjZXNzOiBDYWxsYmFjayA9IG5vbmUsIGZhaWw6IENhbGxiYWNrID0gbm9uZSk6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoIXNyYykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuZ2V0UmVzKHNyYyk7XG5cbiAgICAvLyDlm77niYflt7Lnu4/ooqvliqDovb3ov4fvvIznm7TmjqXov5Tlm57lm77niYflubbkuJTmiafooYzlm57osINcbiAgICBpZiAoY2FjaGUgJiYgY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIGltZyA9IGNhY2hlLmltZztcbiAgICAgIHN1Y2Nlc3MoaW1nLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGNhY2hlICYmICFjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgLy8g5Zu+54mH5q2j5Zyo5Yqg6L296L+H56iL5Lit77yM6L+U5Zue5Zu+54mH5bm25LiU562J5b6F5Zu+54mH5Yqg6L295a6M5oiQ5omn6KGM5Zue6LCDXG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG5cbiAgICAgIGNhY2hlLm9ubG9hZGNia3MucHVzaChzdWNjZXNzKTtcbiAgICAgIGNhY2hlLm9uZXJyb3JjYmtzLnB1c2goZmFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWIm+W7uuWbvueJh++8jOWwhuWbnuiwg+WHveaVsOaOqOWFpeWbnuiwg+WHveaVsOagiFxuICAgICAgaW1nID0gY3JlYXRlSW1hZ2UoKSBhcyBIVE1MSW1hZ2VFbGVtZW50O1xuICAgICAgY29uc3QgbmV3Q2FjaGUgPSB7XG4gICAgICAgIGltZyxcbiAgICAgICAgbG9hZERvbmU6IGZhbHNlLFxuICAgICAgICBvbmxvYWRjYmtzOiBbc3VjY2Vzc10sXG4gICAgICAgIG9uZXJyb3JjYmtzOiBbZmFpbF0sXG4gICAgICB9XG4gICAgIFxuICAgICAgdGhpcy5pbWdQb29sLnNldChzcmMsIG5ld0NhY2hlKTtcblxuICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUubG9hZERvbmUgPSB0cnVlO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgbmV3Q2FjaGUub25lcnJvcmNia3MuZm9yRWFjaChmbiA9PiBmbihpbWcsIGZhbHNlKSk7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzID0gW107XG4gICAgICAgIG5ld0NhY2hlLm9ubG9hZGNia3MgPSBbXTtcbiAgICAgIH07XG5cbiAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGltZztcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgSW1hZ2VNYW5hZ2VyKCk7XG4iLCJjb25zdCBwb29sczogUG9vbDxhbnk+W10gPSBbXTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9vbDxUPiB7XG4gIHB1YmxpYyBuYW1lID0gJ3Bvb2wnXG4gIHB1YmxpYyBwb29sOiB7IFtrZXk6IHN0cmluZ106IFQgfSA9IHt9O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUgPSAncG9vbCcpIHtcbiAgICBjb25zdCBjdXJyID0gcG9vbHMuZmluZChpdGVtID0+IGl0ZW0ubmFtZSA9PT0gbmFtZSk7XG5cbiAgICBpZiAoY3Vycikge1xuICAgICAgcmV0dXJuIGN1cnI7XG4gICAgfVxuXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLnBvb2wgPSB7fTtcblxuICAgIHBvb2xzLnB1c2godGhpcyk7XG4gIH1cblxuICBnZXQoa2V5OiBzdHJpbmcpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5wb29sW2tleV07XG4gIH1cblxuICBzZXQoa2V5OiBzdHJpbmcsIHZhbHVlOiBUKSB7XG4gICAgdGhpcy5wb29sW2tleV0gPSB2YWx1ZTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIHRoaXMucG9vbCA9IHt9O1xuICB9XG5cbiAgZ2V0TGlzdCgpOiBUW10ge1xuICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMucG9vbCk7XG4gIH1cbn1cbiIsIlxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdCB7XG4gIHB1YmxpYyB3aWR0aCA9IDA7XG4gIHB1YmxpYyBoZWlnaHQgPSAwO1xuICBwdWJsaWMgbGVmdCA9IDA7XG4gIHB1YmxpYyByaWdodCA9IDA7XG4gIHB1YmxpYyB0b3AgPSAwO1xuICBwdWJsaWMgYm90dG9tID0gMDtcblxuICBjb25zdHJ1Y3RvcihsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5zZXQobGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxuXG4gIHNldChsZWZ0ID0gMCwgdG9wID0gMCwgd2lkdGggPSAwLCBoZWlnaHQgPSAwKSB7XG4gICAgdGhpcy5sZWZ0ID0gbGVmdDtcbiAgICB0aGlzLnRvcCA9IHRvcDtcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICB0aGlzLnJpZ2h0ID0gdGhpcy5sZWZ0ICsgdGhpcy53aWR0aDtcbiAgICB0aGlzLmJvdHRvbSA9IHRoaXMudG9wICsgdGhpcy5oZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICog5Yik5pat5Lik5Liq55+p5b2i5piv5ZCm55u45LqkXG4gICAqIOWOn+eQhuWPr+ingTogaHR0cHM6Ly96aHVhbmxhbi56aGlodS5jb20vcC8yOTcwNDA2NFxuICAgKi9cbiAgaW50ZXJzZWN0cyhyZWN0OiBSZWN0KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5yaWdodCA8IHJlY3QubGVmdCB8fCByZWN0LnJpZ2h0IDwgdGhpcy5sZWZ0IHx8IHRoaXMuYm90dG9tIDwgcmVjdC50b3AgfHwgcmVjdC5ib3R0b20gPCB0aGlzLnRvcCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpY2tlciB7XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgc3RhcnRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGFuaW1hdGlvbklkOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIG5leHRDYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBpbm5lckNiczogQ2FsbGJhY2tbXSA9IFtdO1xuXG4gIHByaXZhdGUgbGFzdFRpbWUhOiBudW1iZXI7XG5cbiAgcHJpdmF0ZSB1cGRhdGUgPSAoKSA9PiB7XG4gICAgY29uc3QgdGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3QgZGVsdGFUaW1lID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgLy8gY29uc29sZS5sb2coZHQpXG4gICAgLy8g5LyY5YWI5omn6KGM5Lia5Yqh55qEdGlja2Vy5Zue6LCD77yM5Zug5Li65pyJ5Y+v6IO95Lya6Kem5Y+RcmVmbG93XG4gICAgdGhpcy5jYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbm5lckNicy5mb3JFYWNoKChjYjogQ2FsbGJhY2spID0+IHtcbiAgICAgIGNiKGRlbHRhVGltZSk7XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5uZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5uZXh0Q2JzLmZvckVhY2goY2IgPT4gY2IoZGVsdGFUaW1lKSk7XG5cbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMuY291bnQgKz0gMTtcbiAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgfVxuXG4gIGNhbmNlbElmTmVlZCgpIHtcbiAgICBpZiAodGhpcy5hbmltYXRpb25JZCAhPT0gbnVsbCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5hbmltYXRpb25JZCk7XG4gICAgICB0aGlzLmFuaW1hdGlvbklkID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBhZGQoY2I6IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmIHRoaXMuY2JzLmluZGV4T2YoY2IpID09PSAtMSkge1xuICAgICAgaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMucHVzaChjYikgOiAgdGhpcy5jYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgbmV4dChjYjogQ2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLm5leHRDYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGNiPzogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmIChjYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmNicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lckNicyA9IFtdO1xuICAgICAgdGhpcy5uZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiAodGhpcy5jYnMuaW5kZXhPZihjYikgPiAtMSB8fCB0aGlzLmlubmVyQ2JzLmluZGV4T2YoY2IpID4gLTEpKSB7XG4gICAgICBjb25zdCBsaXN0ID0gaXNJbm5lciA/IHRoaXMuaW5uZXJDYnMgOiB0aGlzLmNicztcbiAgICAgIGxpc3Quc3BsaWNlKHRoaXMuY2JzLmluZGV4T2YoY2IpLCAxKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2JzLmxlbmd0aCAmJiAhdGhpcy5pbm5lckNicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG5cbiAgICAgIHRoaXMubGFzdFRpbWUgPSBEYXRlLm5vdygpO1xuXG4gICAgICBpZiAodGhpcy5hbmltYXRpb25JZCA9PT0gbnVsbCAmJiAodGhpcy5jYnMubGVuZ3RoIHx8IHRoaXMuaW5uZXJDYnMubGVuZ3RoKSkge1xuICAgICAgICB0aGlzLmFuaW1hdGlvbklkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudXBkYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGlmICh0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLmNhbmNlbElmTmVlZCgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgc2hhcmVkVGlja2VyID0gbmV3IFRpY2tlcigpO1xuIiwiLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBmdW5jdGlvbiBub25lKCkgeyB9XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50IH0gZnJvbSBcIi4uL3R5cGVzXCI7XG5cbmludGVyZmFjZSBUb3VjaE1zZyB7XG4gIHRvdWNoc3RhcnQ/OiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB0b3VjaGVuZD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG59XG5cbi8qKlxuICog5qC55o2u6Kem5pG45pe26ZW/5ZKM6Kem5pG45L2N572u5Y+Y5YyW5p2l5Yik5pat5piv5ZCm5bGe5LqO54K55Ye75LqL5Lu2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0NsaWNrKHRvdWNoTXNnOiBUb3VjaE1zZykge1xuICBjb25zdCBzdGFydCA9IHRvdWNoTXNnLnRvdWNoc3RhcnQ7XG4gIGNvbnN0IGVuZCA9IHRvdWNoTXNnLnRvdWNoZW5kO1xuXG4gIGlmICghc3RhcnRcbiAgICB8fCAhZW5kXG4gICAgfHwgIXN0YXJ0LnRpbWVTdGFtcFxuICAgIHx8ICFlbmQudGltZVN0YW1wXG4gICAgfHwgc3RhcnQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IHN0YXJ0LnBhZ2VZID09PSB1bmRlZmluZWRcbiAgICB8fCBlbmQucGFnZVggPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWSA9PT0gdW5kZWZpbmVkXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IHN0YXJ0UG9zWCA9IHN0YXJ0LnBhZ2VYO1xuICBjb25zdCBzdGFydFBvc1kgPSBzdGFydC5wYWdlWTtcblxuICBjb25zdCBlbmRQb3NYID0gZW5kLnBhZ2VYO1xuICBjb25zdCBlbmRQb3NZID0gZW5kLnBhZ2VZO1xuXG4gIGNvbnN0IHRvdWNoVGltZXMgPSBlbmQudGltZVN0YW1wIC0gc3RhcnQudGltZVN0YW1wO1xuXG4gIHJldHVybiAhIShNYXRoLmFicyhlbmRQb3NZIC0gc3RhcnRQb3NZKSA8IDMwXG4gICAgJiYgTWF0aC5hYnMoZW5kUG9zWCAtIHN0YXJ0UG9zWCkgPCAzMFxuICAgICYmIHRvdWNoVGltZXMgPCAzMDApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FudmFzKCkge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYqL1xuICBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBfX2Vudi5jcmVhdGVDYW52YXMoKTtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJbWFnZSgpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmKi9cbiAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gX19lbnYuY3JlYXRlSW1hZ2UoKTtcbiAgfVxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG59XG5cbmxldCBfZHByOiBudW1iZXI7XG4vLyBvbmx5IEJhaWR1IHBsYXRmb3JtIG5lZWQgdG8gcmVjaWV2ZSBzeXN0ZW0gaW5mbyBmcm9tIG1haW4gY29udGV4dFxuaWYgKHR5cGVvZiBzd2FuICE9PSAndW5kZWZpbmVkJykge1xuICBfX2Vudi5vbk1lc3NhZ2UoKHJlczogYW55KSA9PiB7XG4gICAgaWYgKHJlcyAmJiByZXMudHlwZSA9PT0gJ2VuZ2luZScpIHtcbiAgICAgIGlmIChyZXMuZXZlbnQgPT09ICdzeXN0ZW1JbmZvJykge1xuICAgICAgICBfZHByID0gcmVzLnN5c3RlbUluZm8uZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHByKCkge1xuICAvLyByZXR1cm4gMztcbiAgaWYgKHR5cGVvZiBfZHByICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBfZHByO1xuICB9XG4gIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnICYmIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKSB7XG4gICAgX2RwciA9IF9fZW52LmdldFN5c3RlbUluZm9TeW5jKCkuZGV2aWNlUGl4ZWxSYXRpbztcbiAgfSBlbHNlIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbykge1xuICAgIF9kcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLndhcm4oJ1tMYXlvdXRdIGZhaWxlZCB0byBhY2Nlc3MgZGV2aWNlIHBpeGVsIHJhdGlvLCBmYWxsYmFjayB0byAxJyk7XG4gICAgX2RwciA9IDE7XG4gIH1cbiAgcmV0dXJuIF9kcHI7XG59XG5cbmV4cG9ydCBlbnVtIFNUQVRFIHtcbiAgVU5JTklUID0gJ1VOSU5JVCcsXG4gIElOSVRFRCA9ICdJTklURUQnLFxuICBSRU5ERVJFRCA9ICdSRU5ERVJFRCcsXG4gIENMRUFSID0gJ0NMRUFSJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNhbnZhcyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICBjdHggJiYgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VG91Y2hBcnJheSh0b3VjaGVzOiBHYW1lVG91Y2hbXSkge1xuICByZXR1cm4gdG91Y2hlcy5tYXAodG91Y2ggPT4gKHtcbiAgICBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLFxuICAgIHBhZ2VYOiB0b3VjaC5wYWdlWCxcbiAgICBwYWdlWTogdG91Y2gucGFnZVksXG4gICAgY2xpZW50WDogdG91Y2guY2xpZW50WCxcbiAgICBjbGllbnRZOiB0b3VjaC5jbGllbnRZLFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dhbWVUb3VjaEV2ZW50KGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCk6IGUgaXMgR2FtZVRvdWNoRXZlbnQge1xuICByZXR1cm4gJ3RvdWNoZXMnIGluIGU7XG59XG5cbi8qKlxuICog5Y+W5pyA5bCP5YC85ZKM5pyA5aSn5YC85LmL6Ze055qE5Yy66Ze06ZmQ5a6a5YC8XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIOmcgOimgeiiq+WkhOeQhueahOaVsOWtl1xuICogQHBhcmFtIHtudW1iZXJ9IG1pbiDmnIDlsI/lgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgg5pyA5aSn5YC8XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChudW1iZXI6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obnVtYmVyLCBtYXgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICByZXR1cm4gcmVzdWx0XG4gICAgPyB7XG4gICAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNiksXG4gICAgfVxuICAgIDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJnYmEoaGV4OiBzdHJpbmcsIG9wYWNpdHk6IG51bWJlcikge1xuICBjb25zdCByZ2JPYmogPSBoZXhUb1JnYihoZXgpO1xuXG4gIGlmIChvcGFjaXR5ID09PSB1bmRlZmluZWQpIHtcbiAgICBvcGFjaXR5ID0gMTtcbiAgfVxuXG4gIGlmICghcmdiT2JqKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gYHJnYmEoJHtyZ2JPYmoucn0sICR7cmdiT2JqLmd9LCAke3JnYk9iai5ifSwgJHtvcGFjaXR5fSlgO1xufSIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG4vLyBjb21wb25lbnRzXG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzLCBFbGVtZW50IH0gZnJvbSAnLi4vY29tcG9uZW50cy9pbmRleCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuLi9jb21wb25lbnRzL3N0eWxlJztcbmltcG9ydCB7IElMYXlvdXQsIElMYXlvdXRCb3ggfSBmcm9tICcuLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5cbmludGVyZmFjZSBDb25zdHJ1Y3RvciB7XG4gIG5ldyAoLi4uYXJnczogYW55W10pOiBhbnk7XG59XG5cbmludGVyZmFjZSBUcmVlTm9kZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgYXR0cjogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgY2hpbGRyZW46IFRyZWVOb2RlW107XG59XG5cbmNvbnN0IGNvbnN0cnVjdG9yTWFwOiB7IFtrZXk6IHN0cmluZ106IENvbnN0cnVjdG9yIH0gPSB7XG4gIHZpZXc6IFZpZXcsXG4gIHRleHQ6IFRleHQsXG4gIGltYWdlOiBJbWFnZSxcbiAgc2Nyb2xsdmlldzogU2Nyb2xsVmlldyxcbiAgYml0bWFwdGV4dDogQml0TWFwVGV4dCxcbiAgY2FudmFzOiBDYW52YXMsXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZnVuY3Rpb24gaXNQZXJjZW50KGRhdGE6IHN0cmluZyB8IG51bWJlcikge1xuICByZXR1cm4gdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIC9cXGQrKD86XFwuXFxkKyk/JS8udGVzdChkYXRhKTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUobm9kZTogVHJlZU5vZGUsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBwYXJlbnQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbbm9kZS5uYW1lXTtcblxuICBpZiAoIUNvbnN0cnVjdG9yKSB7XG4gICAgY29uc29sZS5lcnJvcihgW0xheW91dF0g5LiN5pSv5oyB57uE5Lu2ICR7bm9kZS5uYW1lfWApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmNoaWxkcmVuIHx8IFtdO1xuXG4gIGNvbnN0IGF0dHIgPSBub2RlLmF0dHIgfHwge307XG4gIGNvbnN0IGRhdGFzZXQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgY29uc3QgaWQgPSBhdHRyLmlkIHx8ICcnO1xuXG4gIGNvbnN0IGFyZ3M6IFJlY29yZDxzdHJpbmcsIGFueT4gPSBPYmplY3Qua2V5cyhhdHRyKS5yZWR1Y2UoKG9iaiwga2V5OiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gYXR0cltrZXldO1xuICAgICAgY29uc3QgYXR0cmlidXRlID0ga2V5O1xuXG4gICAgICBpZiAoa2V5ID09PSAnaWQnKSB7XG4gICAgICAgIG9iai5zdHlsZSA9IE9iamVjdC5hc3NpZ24ob2JqLnN0eWxlIHx8IHt9LCBzdHlsZVtpZF0gfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXkgPT09ICdjbGFzcycpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gdmFsdWUuc3BsaXQoL1xccysvKS5yZWR1Y2UoKHJlcywgb25lQ2xhc3MpID0+IE9iamVjdC5hc3NpZ24ocmVzLCBzdHlsZVtvbmVDbGFzc10pLCBvYmouc3R5bGUgfHwge30pO1xuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChhdHRyaWJ1dGUuc3RhcnRzV2l0aCgnZGF0YS0nKSkge1xuICAgICAgICBjb25zdCBkYXRhS2V5ID0gYXR0cmlidXRlLnN1YnN0cmluZyg1KTtcblxuICAgICAgICBkYXRhc2V0W2RhdGFLZXldID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIG9iai5kYXRhc2V0ID0gZGF0YXNldDtcblxuICAgICAgcmV0dXJuIG9iajtcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBhbnk+KTtcblxuICAvLyDnlKjkuo7lkI7nu63lhYPntKDmn6Xor6JcbiAgYXJncy5pZE5hbWUgPSBpZDtcbiAgLy8gQHRzLWlnbm9yZVxuICB0aGlzLmVsZUNvdW50ICs9IDE7XG4gIC8vIEB0cy1pZ25vcmVcbiAgYXJncy5pZCA9IHRoaXMuZWxlQ291bnQ7XG4gIGFyZ3MuY2xhc3NOYW1lID0gYXR0ci5jbGFzcyB8fCAnJztcblxuICBjb25zdCB0aGlzU3R5bGUgPSBhcmdzLnN0eWxlO1xuICBpZiAodGhpc1N0eWxlKSB7XG4gICAgbGV0IHBhcmVudFN0eWxlO1xuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gcGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNoYXJlZENhbnZhcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhcmVudFN0eWxlID0gc2hhcmVkQ2FudmFzO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIF9fZW52ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGFyZW50U3R5bGUgPSBfX2Vudi5nZXRTaGFyZWRDYW52YXMoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50U3R5bGUgPSB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfTtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUud2lkdGgpKSB7XG4gICAgICB0aGlzU3R5bGUud2lkdGggPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS53aWR0aCwgcGFyZW50U3R5bGUud2lkdGgpIDogMDtcbiAgICB9XG4gICAgaWYgKGlzUGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0KSkge1xuICAgICAgdGhpc1N0eWxlLmhlaWdodCA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KHRoaXNTdHlsZS5oZWlnaHQsIHBhcmVudFN0eWxlLmhlaWdodCkgOiAwO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpc1N0eWxlLm9wYWNpdHkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudFN0eWxlLm9wYWNpdHkgIT09IDEgJiYgdHlwZW9mIHBhcmVudFN0eWxlLm9wYWNpdHkgPT09ICdudW1iZXInKSB7XG4gICAgICB0aGlzU3R5bGUub3BhY2l0eSA9IHBhcmVudFN0eWxlLm9wYWNpdHkgKiB0aGlzU3R5bGUub3BhY2l0eTtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zb2xlLmxvZyhhcmdzKTtcbiAgY29uc3QgZWxlbWVudCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgLy8gQHRzLWlnbm9yZVxuICBlbGVtZW50LnJvb3QgPSB0aGlzO1xuICBlbGVtZW50LnRhZ05hbWUgPSBub2RlLm5hbWU7XG5cbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGROb2RlOiBUcmVlTm9kZSkgPT4ge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zdCBjaGlsZEVsZW1lbnQgPSBjcmVhdGUuY2FsbCh0aGlzLCBjaGlsZE5vZGUsIHN0eWxlLCBhcmdzKTtcblxuICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgIGVsZW1lbnQuYWRkKGNoaWxkRWxlbWVudCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZWxlbWVudDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNoaWxkcmVuKGNoaWxkcmVuOiBFbGVtZW50W10sIGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgbmVlZFJlbmRlciA9IHRydWUpIHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAvLyBjaGlsZC5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICBjaGlsZC5pc0RpcnR5ID0gZmFsc2U7XG4gICAgY2hpbGQuaW5zZXJ0KGNvbnRleHQsIG5lZWRSZW5kZXIpO1xuXG4gICAgLy8gU2Nyb2xsVmlld+eahOWtkOiKgueCuea4suafk+S6pOe7mVNjcm9sbFZpZXfoh6rlt7HvvIzkuI3mlK/mjIHltYzlpZdTY3JvbGxWaWV3XG4gICAgcmV0dXJuIHJlbmRlckNoaWxkcmVuKGNoaWxkLmNoaWxkcmVuLCBjb250ZXh0LCAgY2hpbGQudHlwZSA9PT0gJ1Njcm9sbFZpZXcnID8gZmFsc2UgOiBuZWVkUmVuZGVyKTtcbiAgfSk7XG59XG5cbi8qKlxuICog5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXlvdXRDaGlsZHJlbihlbGVtZW50OiBFbGVtZW50KSB7XG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5sYXlvdXRCb3ggPSBjaGlsZC5sYXlvdXRCb3ggfHwge307XG5cbiAgICBbJ2xlZnQnLCAndG9wJywgJ3dpZHRoJywgJ2hlaWdodCddLmZvckVhY2goKHByb3A6IHN0cmluZykgPT4ge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY2hpbGQubGF5b3V0Qm94W3Byb3AgYXMga2V5b2YgSUxheW91dEJveF0gPSBjaGlsZC5sYXlvdXQ/Lltwcm9wIGFzIGtleW9mIElMYXlvdXRdIGFzIG51bWJlcjtcbiAgICB9KTtcblxuICAgIGlmIChjaGlsZC5wYXJlbnQpIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVggfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSAoY2hpbGQucGFyZW50LmxheW91dEJveC5hYnNvbHV0ZVkgfHwgMCkgKyBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmxlZnQ7XG4gICAgICBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZID0gY2hpbGQubGF5b3V0Qm94LnRvcDtcbiAgICB9XG5cbiAgICBjaGlsZC5sYXlvdXRCb3gub3JpZ2luYWxBYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3guYWJzb2x1dGVZO1xuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVg7XG5cblxuICAgIGxheW91dENoaWxkcmVuKGNoaWxkKTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG5vbmUoKSB7IH1cbmV4cG9ydCBmdW5jdGlvbiBpdGVyYXRlVHJlZShlbGVtZW50OiBFbGVtZW50LCBjYWxsYmFjazogQ2FsbGJhY2sgPSBub25lKSB7XG4gIGNhbGxiYWNrKGVsZW1lbnQpO1xuXG4gIGVsZW1lbnQuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpdGVyYXRlVHJlZShjaGlsZCwgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRDaGlsZHJlbiA9IChjaGlsZHJlbjogRWxlbWVudFtdKSA9PiB7XG4gIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgaWYgKGNoaWxkLnR5cGUgIT09ICdTY3JvbGxWaWV3Jykge1xuICAgICAgcmVwYWludENoaWxkcmVuKGNoaWxkLmNoaWxkcmVuKTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0IGNvbnN0IHJlcGFpbnRUcmVlID0gKHRyZWU6IEVsZW1lbnQpID0+IHtcbiAgdHJlZS5yZXBhaW50KCk7XG5cbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLnJlcGFpbnQoKTtcblxuICAgIHJlcGFpbnRUcmVlKGNoaWxkKTtcbiAgfSk7XG59O1xuXG5pbnRlcmZhY2UgRWxlbWVudEFyZ3Mge1xuICBzdHlsZTogb2JqZWN0O1xuICBpZE5hbWU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIGlkOiBudW1iZXI7XG4gIGRhdGFzZXQ6IG9iamVjdDtcbiAgc3JjPzogc3RyaW5nO1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb25lPFQgZXh0ZW5kcyBFbGVtZW50Pihyb290OiBULCBlbGVtZW50OiBFbGVtZW50LCBkZWVwID0gdHJ1ZSwgcGFyZW50PzogRWxlbWVudCkge1xuICBjb25zdCBDb25zdHJ1Y3RvciA9IGNvbnN0cnVjdG9yTWFwW2VsZW1lbnQudGFnTmFtZSBhcyBzdHJpbmddO1xuICAvLyBAdHMtaWdub3JlXG4gIHJvb3QuZWxlQ291bnQgKz0gMTtcblxuICBjb25zdCBhcmdzOiBFbGVtZW50QXJncyA9IHtcbiAgICBzdHlsZTogT2JqZWN0LmFzc2lnbih7fSwgZWxlbWVudC5zdHlsZSksXG4gICAgaWROYW1lOiBlbGVtZW50LmlkTmFtZSxcbiAgICBjbGFzc05hbWU6IGVsZW1lbnQuY2xhc3NOYW1lLFxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBpZDogcm9vdC5lbGVDb3VudCxcbiAgICBkYXRhc2V0OiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LmRhdGFzZXQpLFxuICB9O1xuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICBhcmdzLnNyYyA9IGVsZW1lbnQuc3JjO1xuICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBUZXh0IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBCaXRNYXBUZXh0KSB7XG4gICAgYXJncy52YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBjb25zdCBuZXdFbGVtZW5ldCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgbmV3RWxlbWVuZXQucm9vdCA9IHJvb3Q7XG4gIC8vIEB0cy1pZ25vcmVcbiAgbmV3RWxlbWVuZXQuaW5zZXJ0KHJvb3QucmVuZGVyQ29udGV4dCwgZmFsc2UpO1xuICBuZXdFbGVtZW5ldC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuYWRkKG5ld0VsZW1lbmV0KTtcbiAgfVxuXG4gIGlmIChkZWVwKSB7XG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2xvbmUocm9vdCwgY2hpbGQsIGRlZXAsIG5ld0VsZW1lbmV0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXdFbGVtZW5ldDtcbn1cblxuIiwiaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuLi9jb21tb24vcG9vbCc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL3N0eWxlJztcbmltcG9ydCBCaXRNYXBGb250IGZyb20gJy4uL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCB7IElEYXRhc2V0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIGZvbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnQml0TWFwVGV4dCc7XG4gIHByaXZhdGUgdmFsdWVzcmM6IHN0cmluZztcbiAgcHVibGljIGZvbnQ6IEJpdE1hcEZvbnQ7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUJpdE1hcFRleHRPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICB2YWx1ZSA9ICcnLFxuICAgICAgZm9udCA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuXG4gICAgdGhpcy5mb250ID0gYml0TWFwUG9vbC5nZXQoZm9udCk7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE1pc3NpbmcgQml0bWFwRm9udCBcIiR7Zm9udH1cIiwgcGxlYXNlIGludm9rZSBBUEkgXCJyZWdpc3RCaXRNYXBGb250XCIgYmVmb3JlIHVzaW5nIFwiQml0TWFwVGV4dFwiYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JlcGFpbnQnKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9udC5yZWFkeSkge1xuICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9udC5ldmVudC5vbigndGV4dF9fbG9hZF9fZG9uZScsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFRleHRCb3VuZHMoKSB7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHsgbGV0dGVyU3BhY2luZyA9IDAgfSA9IHN0eWxlO1xuICAgIGxldCB3aWR0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIHdpZHRoICs9IGNmZy53O1xuXG4gICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgIHdpZHRoICs9IGxldHRlclNwYWNpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0OiB0aGlzLmZvbnQubGluZUhlaWdodCB9O1xuICB9XG5cbiAgcmVuZGVyVGV4dChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0VGV4dEJvdW5kcygpO1xuICAgIGNvbnN0IGRlZmF1bHRMaW5lSGVpZ2h0ID0gdGhpcy5mb250LmxpbmVIZWlnaHQgYXMgbnVtYmVyO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoID0gMCwgLy8g5rKh5pyJ6K6+572u6YeH55So6K6h566X5Ye65p2l55qE5a695bqmXG4gICAgICBoZWlnaHQgPSAwLCAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIC8vIGxpbmVIZWlnaHQgPSBkZWZhdWx0TGluZUhlaWdodCwgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE6auY5bqmXG4gICAgICB0ZXh0QWxpZ24sIC8vIOaWh+Wtl+W3puWPs+Wvuem9kOaWueW8j1xuICAgICAgdmVydGljYWxBbGlnbixcbiAgICAgIGxldHRlclNwYWNpbmcgPSAwLFxuICAgIH0gPSBzdHlsZTtcbiAgICAvLyDmsqHmnInorr7nva7liJnph4fnlKjorqHnrpflh7rmnaXnmoTpq5jluqZcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gKHN0eWxlLmxpbmVIZWlnaHQgfHwgZGVmYXVsdExpbmVIZWlnaHQpIGFzIG51bWJlclxuXG4gICAgLy8g5YWD57Sg5YyF5Zu055uS55qE5bem5LiK6KeS5Z2Q5qCHXG4gICAgbGV0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGxldCB5ID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHNjYWxlWSA9IGxpbmVIZWlnaHQgLyBkZWZhdWx0TGluZUhlaWdodDtcbiAgICBjb25zdCByZWFsV2lkdGggPSBzY2FsZVkgKiBib3VuZHMud2lkdGg7XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgeCwgeSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICAvLyDlpoLmnpzmloflrZfnmoTmuLLmn5PljLrln5/pq5jluqblsI/kuo7nm5LlrZDpq5jluqbvvIzph4fnlKjlr7npvZDmlrnlvI9cbiAgICBpZiAobGluZUhlaWdodCA8IGhlaWdodCkge1xuICAgICAgaWYgKHZlcnRpY2FsQWxpZ24gPT09ICdtaWRkbGUnKSB7XG4gICAgICAgIHkgKz0gKGhlaWdodCAtIGxpbmVIZWlnaHQpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodmVydGljYWxBbGlnbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgeSA9IHkgKyBoZWlnaHQgLSBsaW5lSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh3aWR0aCA+IHJlYWxXaWR0aCkge1xuICAgICAgaWYgKHRleHRBbGlnbiA9PT0gJ2NlbnRlcicpIHtcbiAgICAgICAgeCArPSAod2lkdGggLSByZWFsV2lkdGgpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICAgIHggKz0gKHdpZHRoIC0gcmVhbFdpZHRoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXIgPSB0aGlzLnZhbHVlW2ldO1xuICAgICAgY29uc3QgY2ZnID0gdGhpcy5mb250LmNoYXJzW2NoYXJdO1xuXG4gICAgICBpZiAocHJldkNoYXJDb2RlICYmIGNmZy5rZXJuaW5nW3ByZXZDaGFyQ29kZV0pIHtcbiAgICAgICAgeCArPSBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgdGhpcy5mb250LnRleHR1cmUgYXMgSFRNTEltYWdlRWxlbWVudCxcbiAgICAgICAgICBjZmcueCxcbiAgICAgICAgICBjZmcueSxcbiAgICAgICAgICBjZmcudyxcbiAgICAgICAgICBjZmcuaCxcbiAgICAgICAgICB4ICsgY2ZnLm9mZlggKiBzY2FsZVksXG4gICAgICAgICAgeSArIGNmZy5vZmZZICogc2NhbGVZLFxuICAgICAgICAgIGNmZy53ICogc2NhbGVZLFxuICAgICAgICAgIGNmZy5oICogc2NhbGVZLFxuICAgICAgICApO1xuXG4gICAgICAgIHggKz0gKGNmZy54YWR2YW5jZSAqIHNjYWxlWSArIGxldHRlclNwYWNpbmcpO1xuXG4gICAgICAgIHByZXZDaGFyQ29kZSA9IGNoYXI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHgucmVzdG9yZSgpO1xuICB9XG59XG4iLCJpbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IGNyZWF0ZUNhbnZhcyB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUNhbnZhc09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBhdXRvQ3JlYXRlQ2FudmFzPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzIGV4dGVuZHMgRWxlbWVudCB7XG4gIHByaXZhdGUgY2FudmFzSW5zdGFuY2U6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGxcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJQ2FudmFzT3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0eWxlID0ge30sXG4gICAgICBpZE5hbWUgPSAnJyxcbiAgICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHdpZHRoID0gMTAwLFxuICAgICAgaGVpZ2h0ID0gMTAwLFxuICAgICAgYXV0b0NyZWF0ZUNhbnZhcyA9IGZhbHNlLFxuICAgIH0gPSBvcHRzO1xuXG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIHN0eWxlLFxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5b6u5L+h5bCP5ri45oiP5Zy65pmv5LiL77yMc2hhcmVkQ2FudmFzIOWunuS+i+S4jeaWueS+v+iHquWKqOWIm+W7uu+8jOaPkOS+myBzZXR0ZXIg5omL5Yqo6K6+572uXG4gICAgICovXG4gICAgaWYgKGF1dG9DcmVhdGVDYW52YXMpIHtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjcmVhdGVDYW52YXMoKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgIHRoaXMuY2FudmFzSW5zdGFuY2Uud2lkdGggPSBOdW1iZXIod2lkdGgpO1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS5oZWlnaHQgPSBOdW1iZXIoaGVpZ2h0KTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2FudmFzKCkge1xuICAgIHJldHVybiB0aGlzLmNhbnZhc0luc3RhbmNlO1xuICB9XG5cbiAgc2V0IGNhbnZhcyhjdnM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCkge1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBjdnM7XG4gIH1cblxuICB1cGRhdGUoKSB7XG4gICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvLyDlrZDnsbvloavlhYXlrp7njrBcbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuY2FudmFzSW5zdGFuY2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGlmIChzdHlsZS5ib3JkZXJDb2xvcikge1xuICAgICAgY3R4LnN0cm9rZVN0eWxlID0gc3R5bGUuYm9yZGVyQ29sb3I7XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLmJvcmRlcldpZHRoIHx8IDA7XG5cbiAgICBjb25zdCBkcmF3WCA9IGJveC5hYnNvbHV0ZVg7XG4gICAgY29uc3QgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmNhbnZhc0luc3RhbmNlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCBhbGxTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQgfSBmcm9tICcuLi90eXBlcy9pbmRleCdcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcy9pbmRleCc7XG5pbXBvcnQgeyBnZXRSZ2JhIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUlkKHRyZWU6IEVsZW1lbnQsIGxpc3Q6IEVsZW1lbnRbXSA9IFtdLCBpZDogc3RyaW5nKSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoY2hpbGQuaWROYW1lID09PSBpZCkge1xuICAgICAgbGlzdC5wdXNoKGNoaWxkKTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGQuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgICBnZXRFbGVtZW50c0J5SWQoY2hpbGQsIGxpc3QsIGlkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBsaXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEJ5SWQodHJlZTogRWxlbWVudCwgaWQ6IHN0cmluZykge1xuICBjb25zdCBsaXN0ID0gZ2V0RWxlbWVudHNCeUlkKHRyZWUsIFtdLCBpZCk7XG5cbiAgcmV0dXJuIGxpc3Q/LlswXSB8fCBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0cmVlOiBFbGVtZW50LCBsaXN0OiBFbGVtZW50W10gPSBbXSwgY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmICgoY2hpbGQuY2xhc3NOYW1lTGlzdCB8fCBjaGlsZC5jbGFzc05hbWUuc3BsaXQoL1xccysvKSkuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcbiAgICAgIGxpc3QucHVzaChjaGlsZCk7XG4gICAgfVxuXG4gICAgaWYgKGNoaWxkLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjaGlsZCwgbGlzdCwgY2xhc3NOYW1lKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBsaXN0O1xufVxuXG4vKipcbiAqIOWwhuW9k+WJjeiKgueCuee9ruiEj++8jExheW91dCDnmoQgdGlja2VyIOS8muagueaNrui/meS4quagh+iusOS9jeaJp+ihjCByZWZsb3dcbiAqL1xuZnVuY3Rpb24gc2V0RGlydHkoZWxlOiBFbGVtZW50KSB7XG4gIGVsZS5pc0RpcnR5ID0gdHJ1ZTtcbiAgbGV0IHsgcGFyZW50IH0gPSBlbGU7XG4gIHdoaWxlIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuaXNEaXJ0eSA9IHRydWU7XG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgfVxufVxuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmNvbnN0IEVFID0gbmV3IFRpbnlFbWl0dGVyKCk7XG5cbmxldCB1dWlkID0gMDtcblxuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICByaWdodDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbn07XG5cbmNvbnN0IGlzVmFsaWRVcmxQcm9wUmVnID0gL1xccyp1cmxcXCgoLio/KVxcKVxccyovO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlnKggeG1sIOaooeadv+mHjOmdouWjsOaYjueahCBjbGFzcyDlsZ7mgKfvvIzkuIDoiKznlKjkuo7mqKHmnb/mj5Lku7ZcbiAgICovXG4gIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZztcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55omA5Zyo6IqC54K55qCR55qE5qC56IqC54K577yM5oyH5ZCRIExheW91dFxuICAgKi9cbiAgcHVibGljIHJvb3Q6IEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgLy8gcHVibGljIEVFOiBhbnk7XG5cbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhuW9k+WJjeiKgueCueaYr+WQpuW3sue7j+aJp+ihjOmUgOavgemAu+i+ke+8jOmUgOavgeS5i+WQjuWOn+WFiOeahOWKn+iDvemDveS8muW8guW4uO+8jOS4gOiIrOS4muWKoeS+p+S4jeeUqOWFs+W/g+i/meS4qlxuICAgKi9cbiAgcHVibGljIGlzRGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOexu+S8vCBXZWIg56uv5a6e546w77yM57uZ6IqC54K55oyC5LiA5Lqb6IO95aSf6K+75YaZ55qE5bGe5oCn6ZuG5ZCIXG4gICAqIOWcqCB4bWwg5Y+v5Lul6L+Z5qC35aOw5piO5bGe5oCn77yaPHZpZXcgY2xhc3M9XCJ4eHhcIiBkYXRhLWZvbz1cImJhclwiPlxuICAgKiDlnKgganMg5L6n5Y+v5Lul6L+Z5LmI6K+75YaZ5bGe5oCn77yaXG4gICAqIGNvbnNvbGUubG9nKGVsZW1lbnQuZGF0YXNldC5mb28pOyAvLyDmjqfliLblj7DovpPlh7ogXCJiYXJcIjtcbiAgICogZWxlbWVudC5kYXRhc2V0LmZvbyA9IFwiYmFyMlwiO1xuICAgKi9cbiAgcHVibGljIGRhdGFzZXQ6IElEYXRhc2V0O1xuXG4gIC8qKlxuICAgKiDoioLngrnnmoTmoLflvI/liJfooajvvIzlnKggTGF5b3V0LmluaXQg5Lya5Lyg5YWl5qC35byP6ZuG5ZCI77yM5Lya6Ieq5Yqo5oyR6YCJ5Ye66Lef6IqC54K55pyJ5YWz55qE5qC35byP57uf5LiAIG1lcmdlIOWIsCBzdHlsZSDlr7nosaHkuIpcbiAgICovXG4gIHB1YmxpYyBzdHlsZTogSVN0eWxlO1xuXG4gIC8qKlxuICAgKiDmiafooYwgZ2V0Qm91bmRpbmdDbGllbnRSZWN0IOeahOe7k+aenOe8k+WtmO+8jOWmguaenOS4muWKoemrmOmikeiwg+eUqO+8jOWPr+S7peWHj+WwkSBHQ1xuICAgKi9cbiAgcHJpdmF0ZSByZWN0OiBSZWN0IHwgbnVsbDtcbiAgcHVibGljIGNsYXNzTmFtZUxpc3Q6IHN0cmluZ1tdIHwgbnVsbDtcbiAgcHVibGljIGxheW91dEJveDogSUxheW91dEJveDtcbiAgcHVibGljIGJhY2tncm91bmRJbWFnZTogYW55O1xuICBwdWJsaWMgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsID0gbnVsbFxuXG4gIC8qKlxuICAgKiDnva7ohI/moIforrDkvY3vvIznm67liY3lvZPkv67mlLnkvJrlvbHlk43luIPlsYDlsZ7mgKfnmoTml7blgJnvvIzkvJroh6rliqjnva7ohI9cbiAgICovXG4gIHB1YmxpYyBpc0RpcnR5ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIGNzcy1sYXlvdXQg6IqC54K55bGe5oCn77yM5Lia5Yqh5L6n5peg6ZyA5YWz5b+DXG4gICAqL1xuICBwcm90ZWN0ZWQgc2hvdWxkVXBkYXRlID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOWQjeensO+8jOavlOWmglwiIEltYWdlXG4gICAqL1xuICBwdWJsaWMgdHlwZT86IHN0cmluZztcbiAgLy8gcHVibGljIGxheW91dD86IElMYXlvdXQ7XG5cbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueWcqCB4bWwg55qE5qCH562+5ZCN56ew77yM5q+U5aaCIGltYWdl44CBdmlld1xuICAgKi9cbiAgcHVibGljIHRhZ05hbWU/OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSBvcmlnaW5TdHlsZTogSVN0eWxlO1xuXG4gIHByb3RlY3RlZCBzdHlsZUNoYW5nZUhhbmRsZXIocHJvcDogc3RyaW5nLCB2YWw6IGFueSkge1xuXG4gIH1cblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICBpZCA9IHV1aWQgKz0gMSxcbiAgICBkYXRhc2V0ID0ge30sXG4gIH06IElFbGVtZW50T3B0aW9ucykge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLmlkTmFtZSA9IGlkTmFtZTtcbiAgICB0aGlzLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB0aGlzLmxheW91dEJveCA9IHtcbiAgICAgIGxlZnQ6IDAsXG4gICAgICB0b3A6IDAsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIGFic29sdXRlWDogMCxcbiAgICAgIGFic29sdXRlWTogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVYOiAwLFxuICAgICAgb3JpZ2luYWxBYnNvbHV0ZVk6IDAsXG4gICAgfTtcblxuICAgIHRoaXMuZGF0YXNldCA9IGRhdGFzZXQ7XG5cbiAgICBpZiAodHlwZW9mIHN0eWxlLmJhY2tncm91bmRJbWFnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihzdHlsZS5iYWNrZ3JvdW5kSW1hZ2UpO1xuICAgIH1cblxuICAgIHRoaXMub3JpZ2luU3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnN0eWxlID0gc3R5bGU7XG4gICAgdGhpcy5yZWN0ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTmFtZUxpc3QgPSBudWxsO1xuICB9XG5cbiAgYmFja2dyb3VuZEltYWdlU2V0SGFuZGxlcihiYWNrZ3JvdW5kSW1hZ2U6IHN0cmluZykge1xuICAgIGlmICh0eXBlb2YgYmFja2dyb3VuZEltYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgY29uc3QgbGlzdCA9IGJhY2tncm91bmRJbWFnZS5tYXRjaChpc1ZhbGlkVXJsUHJvcFJlZyk7XG4gICAgICBpZiAobGlzdCkge1xuICAgICAgICBjb25zdCB1cmwgPSBsaXN0WzFdLnJlcGxhY2UoLygnfFwiKS9nLCAnJyk7XG4gICAgICAgIGltYWdlTWFuYWdlci5sb2FkSW1hZ2UodXJsLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZSA9IGltZztcbiAgICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgICAgdGhpcy5yb290ICYmIHRoaXMucm9vdC5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYFtMYXlvdXRdOiAke2JhY2tncm91bmRJbWFnZX0gaXMgbm90IGEgdmFsaWQgYmFja2dyb3VuZEltYWdlYCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOebkeWQrOWxnuaAp+eahOWPmOWMluWIpOaWreaYr+WQpumcgOimgeaJp+ihjCByZWZsb3fjgIFyZXBhaW50IOaTjeS9nFxuICAgKiDnu4/ov4fmtYvor5XvvIxPYmplY3QuZGVmaW5lUHJvcGVydHkg5piv5LiA5Liq5q+U6L6D5oWi55qE5pa55rOV77yMIOeJueWIq+aYr+WxnuaAp+avlOi+g+WkmueahOaXtuWAmVxuICAgKiDlm6DmraTkvJrlhYjliKTmlq3mmK/lkKbmlK/mjIEgUHJveHnvvIxpTWFjIChSZXRpbmEgNUssIDI3LWluY2gsIDIwMTcp5rWL6K+V57uT5p6cXG4gICAqIOaAu+WFsSAzMTIg5Liq6IqC54K577yMb2JzZXJ2ZVN0eWxlQW5kRXZlbnTmgLvogJfml7bkuLrvvJpcbiAgICogUHJveHk6IDNtc1xuICAgKiBPYmplY3QuZGVmaW5lUHJvcGVydHk6IDIwbXNcbiAgICovXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICB0aGlzLnN0eWxlID0gbmV3IFByb3h5KHRoaXMub3JpZ2luU3R5bGUsIHtcbiAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBlbGUuc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3AsIHZhbCk7XG4gICAgICAgICAgICBpZiAocmVmbG93QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgICAgICAgIHNldERpcnR5KGVsZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgICAgICAgZWxlLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgZWxlLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gUmVmbGVjdC5zZXQodGFyZ2V0LCBwcm9wLCB2YWwsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdHlsZSkgYXMgSVN0eWxlO1xuICAgICAgYWxsU3R5bGVzLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy5zdHlsZSwga2V5LCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiAoKSA9PiBpbm5lclN0eWxlW2tleSBhcyBrZXlvZiBJU3R5bGVdLFxuICAgICAgICAgIHNldDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IGlubmVyU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV0pIHtcbiAgICAgICAgICAgICAgaW5uZXJTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSA9IHZhbHVlO1xuXG4gICAgICAgICAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcGFpbnRBZmZlY3RlZFN0eWxlcy5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gJ2JhY2tncm91bmRJbWFnZScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhY2tncm91bmRJbWFnZVNldEhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDkuovku7blhpLms6HpgLvovpFcbiAgICBbJ3RvdWNoc3RhcnQnLCAndG91Y2htb3ZlJywgJ3RvdWNoY2FuY2VsJywgJ3RvdWNoZW5kJywgJ2NsaWNrJ10uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9uKGV2ZW50TmFtZSwgKGUsIHRvdWNoTXNnKSA9PiB7XG4gICAgICAgIHRoaXMucGFyZW50ICYmIHRoaXMucGFyZW50LmVtaXQoZXZlbnROYW1lLCBlLCB0b3VjaE1zZyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuY2xhc3NOYW1lTGlzdCA9IHRoaXMuY2xhc3NOYW1lLnNwbGl0KC9cXHMrLyk7XG4gIH1cblxuICAvKipcbiAgICog6IqC54K56YeN57uY5o6l5Y+j77yM5a2Q57G75aGr5YWF5a6e546wXG4gICAqL1xuICByZXBhaW50KCkgeyB9XG5cbiAgLyoqXG4gICAqIOiKgueCuea4suafk+aOpeWPo+WtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVuZGVyKCkgeyB9XG5cbiAgLyoqXG4gICAqIOWPgueFpyBXZWIg6KeE6IyD77yaaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0VsZW1lbnQvZ2V0Qm91bmRpbmdDbGllbnRSZWN0XG4gICAqL1xuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogUmVjdCB7XG4gICAgaWYgKCF0aGlzLnJlY3QpIHtcbiAgICAgIHRoaXMucmVjdCA9IG5ldyBSZWN0KFxuICAgICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmhlaWdodCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5yZWN0LnNldChcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWSxcbiAgICAgIHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICk7XG5cbiAgICByZXR1cm4gdGhpcy5yZWN0O1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM5L2G6L+Z6YeM5Y+q6L+U5Zue56ym5ZCI5p2h5Lu255qE56ys5LiA5Liq6IqC54K5IFxuICAgKi9cbiAgZ2V0RWxlbWVudEJ5SWQoaWQ6IHN0cmluZyk6IEVsZW1lbnQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQodGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQoaWQ6IHN0cmluZyk6IChFbGVtZW50IHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlJZCh0aGlzLCBbXSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGNsYXNzTmFtZSDljIXlkKvnu5nlrprlj4LmlbDnmoTnmoToioLngrnpm4blkIhcbiAgICovXG4gIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiAoRWxlbWVudCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHRoaXMsIFtdLCBjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIOW4g+WxgOiuoeeul+WujOaIkO+8jOWHhuWkh+aJp+ihjOa4suafk+S5i+WJjeaJp+ihjOeahOaTjeS9nO+8jOS4jeWQjOeahOWtkOexu+acieS4jeWQjOeahOihjOS4ulxuICAgKiDmr5TlpoIgU2Nyb2xsVmlldyDlnKjmuLLmn5PkuYvliY3ov5jpnIDopoHliJ3lp4vljJbmu5rliqjnm7jlhbPnmoTog73liptcbiAgICogIFxuICAgKi9cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGN0eDtcblxuICAgIGlmIChuZWVkUmVuZGVyKSB7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiDoioLngrnop6PpmaTkuovku7bnu5HlrppcbiAgICovXG4gIHVuQmluZEV2ZW50KCkge1xuICAgIFtcbiAgICAgICd0b3VjaHN0YXJ0JyxcbiAgICAgICd0b3VjaG1vdmUnLFxuICAgICAgJ3RvdWNoY2FuY2VsJyxcbiAgICAgICd0b3VjaGVuZCcsXG4gICAgICAnY2xpY2snLFxuICAgICAgJ3JlcGFpbnQnLFxuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLm9mZihldmVudE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuiKgueCueS7juW9k+WJjeiKgueCueagkeS4reWIoOmZpFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIGNvbnN0IHsgcGFyZW50IH0gPSB0aGlzO1xuXG4gICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbmRleCA9IHBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgdGhpcy51bkJpbmRFdmVudCgpO1xuICAgICAgc2V0RGlydHkodGhpcyk7XG4gICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gdGhpcyBlbGVtZW50IGhhcyBiZWVuIHJlbW92ZWQnKTtcbiAgICB9XG4gIH1cblxuICBzZXREaXJ0eSgpIHtcbiAgICBzZXREaXJ0eSh0aGlzKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcblxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy51bkJpbmRFdmVudCgpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgLy8gdGhpcy5FRSA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcblxuICAgIC8vIGVsZW1lbnQg5Zyo55S75biD5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGvXG4gICAgLy8gdGhpcy5sYXlvdXRCb3ggPSBudWxsO1xuICAgIC8vIHRoaXMuc3R5bGUgPSBudWxsO1xuICAgIHRoaXMuY2xhc3NOYW1lID0gJyc7XG4gICAgdGhpcy5jbGFzc05hbWVMaXN0ID0gbnVsbDtcbiAgfVxuXG4gIGFkZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgZWxlbWVudC5wYXJlbnQgPSB0aGlzO1xuICAgIC8vIGVsZW1lbnQucGFyZW50SWQgPSB0aGlzLmlkO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWwhuS4gOS4quiKgueCuea3u+WKoOS9nOS4uuW9k+WJjeiKgueCueeahOWtkOiKgueCuVxuICAgKi9cbiAgYXBwZW5kQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIHRoaXMuYWRkKGVsZW1lbnQpO1xuXG4gICAgc2V0RGlydHkodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkIFxuICAgKi9cbiAgcmVtb3ZlQ2hpbGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGVsZW1lbnQpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKCk7XG4gICAgICBzZXREaXJ0eSh0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSB0aGUgZWxlbWVudCB0byBiZSByZW1vdmVkIGlzIG5vdCBhIGNoaWxkIG9mIHRoaXMgZWxlbWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGVtaXQoZXZlbnQ6IHN0cmluZywgLi4udGhlQXJnczogYW55W10pIHtcbiAgICBFRS5lbWl0KHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgLi4udGhlQXJncyk7XG4gIH1cblxuICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBFRS5vbih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZSh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9mZihldmVudDogc3RyaW5nLCBjYWxsYmFjaz86IENhbGxiYWNrKSB7XG4gICAgRUUub2ZmKHRvRXZlbnROYW1lKGV2ZW50LCB0aGlzLmlkKSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIOa4suafkyBib3JkZXIg55u45YWz6IO95Yqb5oq96LGh77yM5a2Q57G75Y+v5oyJ6ZyA6LCD55SoXG4gICAqL1xuICByZW5kZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgcmFkaXVzID0gc3R5bGUuYm9yZGVyUmFkaXVzIHx8IDA7XG4gICAgY29uc3QgeyBib3JkZXJXaWR0aCA9IDAgfSA9IHN0eWxlO1xuICAgIGNvbnN0IGJvcmRlclRvcExlZnRSYWRpdXMgPSBzdHlsZS5ib3JkZXJUb3BMZWZ0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJUb3BSaWdodFJhZGl1cyA9IHN0eWxlLmJvcmRlclRvcFJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzID0gc3R5bGUuYm9yZGVyQm90dG9tTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMgPSBzdHlsZS5ib3JkZXJCb3R0b21SaWdodFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciA9ICcnIH0gPSBzdHlsZTtcbiAgICBjb25zdCB4ID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCB5ID0gYm94LmFic29sdXRlWTtcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGNvbnN0IGhhc1JhZGl1cyA9IHJhZGl1c1xuICAgICAgfHwgYm9yZGVyVG9wTGVmdFJhZGl1cyB8fCBib3JkZXJUb3BSaWdodFJhZGl1cyB8fCBib3JkZXJCb3R0b21MZWZ0UmFkaXVzIHx8IGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzO1xuXG4gICAgLy8gYm9yZGVyV2lkdGgg5ZKMIHJhZGl1cyDpg73msqHmnInvvIzkuI3pnIDopoHmiafooYzlkI7nu63pgLvovpHvvIzmj5DljYfmgKfog71cbiAgICBpZiAoIWJvcmRlcldpZHRoICYmICFoYXNSYWRpdXMpIHtcbiAgICAgIHJldHVybiB7IG5lZWRDbGlwOiBmYWxzZSwgbmVlZFN0cm9rZTogZmFsc2UgfTtcbiAgICB9XG5cbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHguYmVnaW5QYXRoKCk7XG5cbiAgICBjdHgubGluZVdpZHRoID0gYm9yZGVyV2lkdGg7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gYm9yZGVyQ29sb3I7XG5cbiAgICBjdHgubW92ZVRvKHggKyBib3JkZXJUb3BMZWZ0UmFkaXVzLCB5KTtcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCB5KTtcblxuICAgIC8vIOWPs+S4iuinkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGgsIHksIHggKyB3aWR0aCwgeSArIGJvcmRlclRvcFJpZ2h0UmFkaXVzLCBib3JkZXJUb3BSaWdodFJhZGl1cyk7XG5cbiAgICAvLyDlj7PkuIvop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzKTtcblxuICAgIC8vIOWPs+S4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyhcbiAgICAgIHggKyB3aWR0aCxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICB4ICsgd2lkdGggLSBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICAgIHkgKyBoZWlnaHQsXG4gICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1cyxcbiAgICApO1xuXG4gICAgLy8g5bem5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgYm9yZGVyQm90dG9tTGVmdFJhZGl1cywgeSArIGhlaWdodCk7XG5cbiAgICAvLyDlt6bkuIvop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSArIGhlaWdodCwgeCwgeSArIGhlaWdodCAtIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMsIGJvcmRlckJvdHRvbUxlZnRSYWRpdXMpO1xuXG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4LCB5ICsgYm9yZGVyVG9wTGVmdFJhZGl1cyk7XG5cbiAgICAvLyDlt6bkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCwgeSwgeCArIGJvcmRlclRvcExlZnRSYWRpdXMsIHksIGJvcmRlclRvcExlZnRSYWRpdXMpO1xuXG4gICAgcmV0dXJuIHsgbmVlZENsaXA6ICEhaGFzUmFkaXVzLCBuZWVkU3Ryb2tlOiAhIWJvcmRlcldpZHRoIH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUltYWdlT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNyYz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBpbWdzcmM6IHN0cmluZztcbiAgcHVibGljIHR5cGUgPSAnSW1hZ2UnO1xuICBwdWJsaWMgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJSW1hZ2VPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBzcmMgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmltZ3NyYyA9IHNyYztcblxuICAgIHRoaXMuaW1nID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZywgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzcmMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gIH1cblxuICBzZXQgc3JjKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW1nID0gbnVsbDtcblxuICAgIHRoaXMuc3JjID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuaW1nIHx8ICF0aGlzLmltZz8uY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHggYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGlmIChzdHlsZS5vcGFjaXR5ICE9PSAxKSB7XG4gICAgICBjdHguZ2xvYmFsQWxwaGEgPSBzdHlsZS5vcGFjaXR5IGFzIG51bWJlcjtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYm9yZGVyQ29sb3IpIHtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLmJvcmRlckNvbG9yO1xuICAgIH1cblxuICAgIGN0eC5saW5lV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuXG4gICAgY29uc3QgZHJhd1ggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IGRyYXdZID0gYm94LmFic29sdXRlWTtcblxuICAgIGNvbnN0IHsgbmVlZENsaXAsIG5lZWRTdHJva2UgfSA9IHRoaXMucmVuZGVyQm9yZGVyKGN0eCk7XG5cbiAgICBpZiAobmVlZENsaXApIHtcbiAgICAgIGN0eC5jbGlwKCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRDb2xvcikge1xuICAgICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIGN0eC5maWxsUmVjdChkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5pbWcsIGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxufVxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcblxuZXhwb3J0IHtcbiAgRWxlbWVudCxcbiAgVmlldyxcbiAgSW1hZ2UsXG4gIFRleHQsXG4gIFNjcm9sbFZpZXcsXG4gIEJpdE1hcFRleHQsXG4gIENhbnZhcyxcbn07XG4iLCJcbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBjbGFtcCB9IGZyb20gJy4uL2NvbW1vbi91dGlsJztcbmltcG9ydCB7IHNoYXJlZFRpY2tlciB9IGZyb20gJy4uL2NvbW1vbi90aWNrZXInO1xuXG5leHBvcnQgZW51bSBTY3JvbGxCYXJEaXJlY3Rpb24ge1xuICBWZXJ0aXZhbCxcbiAgSG9yaXpvbnRhbCxcbn1cblxuaW50ZXJmYWNlIElEaW1lbnNpb25zIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGNvbnRlbnRXaWR0aDogbnVtYmVyO1xuICBjb250ZW50SGVpZ2h0OiBudW1iZXI7XG5cbiAgbWF4U2Nyb2xsTGVmdDogbnVtYmVyO1xuICBtYXhTY3JvbGxUb3A6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElTY3JvbGxCYXJPcHRpb25zIHtcbiAgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG4gIGJhY2tncm91bmRDb2xvcj86IHN0cmluZztcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xufVxuXG4vKipcbiAqIOagueaNrua7muWKqOadoeeahOWwuuWvuOOAgVNjcm9sbFZpZXcg6KeG5Y+j5ZKM5rua5Yqo56qX5Y+j5bC65a+444CB5rua5Yqo6Ziy57q/5L+h5oGv56Gu6K6k5rua5Yqo5p2h55qE5qC35byP5L+h5oGvXG4gKi9cbmZ1bmN0aW9uIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGg6IG51bWJlciwgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb24sIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zKSB7XG4gIGNvbnN0IGlzVmVydGljYWwgPSBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbDtcbiAgY29uc3QgeyB3aWR0aDogc2Nyb2xsV2lkdGgsIGhlaWdodDogc2Nyb2xsSGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQgfSA9IGRpbWVuc2lvbnM7XG5cbiAgcmV0dXJuIHtcbiAgICB3aWR0aDogaXNWZXJ0aWNhbCA/IHdpZHRoIDogc2Nyb2xsV2lkdGggKiAoc2Nyb2xsV2lkdGggLyBjb250ZW50V2lkdGgpLFxuICAgIGhlaWdodDogaXNWZXJ0aWNhbCA/IHNjcm9sbEhlaWdodCAqIChzY3JvbGxIZWlnaHQgLyBjb250ZW50SGVpZ2h0KSA6IHdpZHRoLFxuICAgIGxlZnQ6IGlzVmVydGljYWwgPyBzY3JvbGxXaWR0aCAtIHdpZHRoIDogMCxcbiAgICB0b3A6IGlzVmVydGljYWwgPyAwIDogc2Nyb2xsSGVpZ2h0IC0gd2lkdGgsXG4gIH07XG59XG5cblxuLyoqXG4gKiDmu5rliqjnu4Tku7bnmoTmu5rliqjmnaHnu4Tku7bvvIzmu5rliqjmnaHmnKzouqvkuZ/mmK9MYXlvdXTnmoTkuIDkuKroioLngrlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsQmFyIGV4dGVuZHMgVmlldyB7XG4gIC8vIOW9k+WJjea7muWKqOadoeaYr+WxnuS6juaoquWQkei/mOaYr+e6teWQkVxuICBwdWJsaWMgZGlyZWN0aW9uOiBTY3JvbGxCYXJEaXJlY3Rpb247XG5cbiAgcHVibGljIGRpbWVuc2lvbnM6IElEaW1lbnNpb25zO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuS4gOauteaXtumXtOWQjuiHquWKqOmakOiXj1xuICBwdWJsaWMgYXV0b0hpZGUgPSB0cnVlO1xuXG4gIC8vIOa7muWKqOWujOavleWQjuiHquWKqOmakOiXj+aXtumXtFxuICBwdWJsaWMgYXV0b0hpZGVUaW1lID0gMTAwMDtcblxuICBwcml2YXRlIGF1dG9IaWRlUmVtYWluaW5nVGltZSA9IDA7XG5cbiAgcHJpdmF0ZSBpbm5lcldpZHRoID0gMTY7XG5cbiAgcHJpdmF0ZSBpc0hpZGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgZGlyZWN0aW9uLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgYmFja2dyb3VuZENvbG9yID0gJyNhMmEyYTInLFxuICAgIHdpZHRoID0gMTYsXG4gIH06IElTY3JvbGxCYXJPcHRpb25zKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGJhY2tncm91bmRDb2xvcixcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYm9yZGVyUmFkaXVzOiB3aWR0aCAvIDIsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgIH0sIHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnMod2lkdGgsIGRpcmVjdGlvbiwgZGltZW5zaW9ucykpO1xuXG4gICAgc3VwZXIoe1xuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICAgIHRoaXMuaW5uZXJXaWR0aCA9IHdpZHRoO1xuXG4gICAgc2hhcmVkVGlja2VyLmFkZCh0aGlzLnVwZGF0ZSwgdHJ1ZSk7XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmu5rliqjmnaHnmoTnspfnu4bvvIzlm6DkuLropoHlhbzlrrnmqKrnq5bmu5rliqjvvIzmiYDku6Ugc3R5bGUud2lkdGgg5Zyo5LiN5ZCM5qih5byP5LiL5Luj6KGo55qE5oSP5oCd5LiN5LiA5qC3XG4gICAqIOWboOatpOmAmui/h+WNleeLrOeahCB3aWR0aCDlsZ7mgKfmnaXku6Pooajmu5rliqjmnaHnmoTnspfnu4ZcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyV2lkdGgpIHtcbiAgICAgIHRoaXMuaW5uZXJXaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gdGhpcy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLnNldERpbWVuc2lvbnModGhpcy5kaW1lbnNpb25zKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG4gICAgdGhpcy5pc0hpZGUgPSB0cnVlO1xuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDA7XG4gIH1cblxuICBzaG93KCkge1xuICAgIHRoaXMuaXNIaWRlID0gZmFsc2U7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgfVxuXG4gIHNldERpbWVuc2lvbnMoZGltZW5zaW9uczogSURpbWVuc2lvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IHVwZGF0ZVN0eWxlRnJvbURpbWVuc2lvbnModGhpcy53aWR0aCwgdGhpcy5kaXJlY3Rpb24sIGRpbWVuc2lvbnMpO1xuXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBzdHlsZSk7XG5cbiAgICB0aGlzLmRpbWVuc2lvbnMgPSBkaW1lbnNpb25zO1xuICB9XG5cbiAgY2FsY3VsdGVTY3JvbGxWYWx1ZShsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgbGV0IHNjcm9sbExlZnQgPSAwO1xuICAgIGxldCBzY3JvbGxUb3AgPSAwO1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudEhlaWdodDtcblxuICAgICAgLy8g5rua5Yqo5p2h5pyA5aSn5rua5Yqo6auY5bqmXG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgPSB0aGlzLmRpbWVuc2lvbnMuaGVpZ2h0ICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IHRvcCAvIHRoaXMuZGltZW5zaW9ucy5tYXhTY3JvbGxUb3A7XG4gICAgICBjb25zdCBwZXJjZW50VG9wID0gc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wICogcGVyY2VudDtcblxuICAgICAgc2Nyb2xsVG9wID0gY2xhbXAocGVyY2VudFRvcCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsVG9wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY2FuU2Nyb2xsUGVyY2VudCA9IDEgLSB0aGlzLmRpbWVuc2lvbnMud2lkdGggLyB0aGlzLmRpbWVuc2lvbnMuY29udGVudFdpZHRoO1xuICAgICAgY29uc3Qgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCA9IHRoaXMuZGltZW5zaW9ucy53aWR0aCAqIGNhblNjcm9sbFBlcmNlbnQ7XG5cbiAgICAgIGNvbnN0IHBlcmNlbnQgPSBsZWZ0IC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbExlZnQ7XG5cbiAgICAgIHNjcm9sbExlZnQgPSBjbGFtcChzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ICogcGVyY2VudCwgMCwgc2Nyb2xsQmFyTWF4U2Nyb2xsTGVmdCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH07XG4gIH1cblxuICBvblNjcm9sbChsZWZ0OiBudW1iZXIsIHRvcDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNIaWRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICBcbiAgICBjb25zdCB7IHNjcm9sbExlZnQsIHNjcm9sbFRvcCB9ID0gdGhpcy5jYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQsIHRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSArIHNjcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYID0gdGhpcy5wYXJlbnQhLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCArIHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGUpIHtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWU7XG4gICAgfVxuXG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHNoYXJlZFRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUsIHRydWUpO1xuICB9XG5cbiAgdXBkYXRlID0gKGR0OiBudW1iZXIpID0+IHtcbiAgICBpZiAoIXRoaXMuYXV0b0hpZGUgfHwgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPD0gMCB8fCB0aGlzLmlzSGlkZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC09IGR0O1xuXG4gICAgaWYgKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IHRoaXMuYXV0b0hpZGVUaW1lKSB7XG4gICAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA9IE1hdGgubWF4KDAsIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lKTtcbiAgICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IHRoaXMuc3R5bGUub3BhY2l0eSBhcyBudW1iZXIgKiAodGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgLyB0aGlzLmF1dG9IaWRlVGltZSk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlcnNjb3JlLWRhbmdsZSAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbmltcG9ydCBWaWV3IGZyb20gJy4vdmlldyc7XG5pbXBvcnQgeyBnZXREcHIsIGNvcHlUb3VjaEFycmF5IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IFNjcm9sbGVyIGZyb20gJy4uL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMnXG5pbXBvcnQgeyBpdGVyYXRlVHJlZSB9IGZyb20gJy4uL2NvbW1vbi92ZCc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IFNjcm9sbEJhciwgeyBTY3JvbGxCYXJEaXJlY3Rpb24gfSBmcm9tICcuL3Njcm9sbGJhcic7XG5pbXBvcnQgeyByZWZsb3dBZmZlY3RlZFN0eWxlcyB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IHsgc2hhcmVkVGlja2VyIH0gZnJvbSAnLi4vY29tbW9uL3RpY2tlcic7XG5cbmNvbnN0IGRwciA9IGdldERwcigpO1xuXG5pbnRlcmZhY2UgSVNjcm9sbFZpZXdPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgc2Nyb2xsWD86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHNjcm9sbFk/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xufVxuXG5pbnRlcmZhY2UgSUlubmVyU2Nyb2xsZXJPcHRpb24ge1xuICBzY3JvbGxpbmdYPzogYm9vbGVhbjtcbiAgc2Nyb2xsaW5nWT86IGJvb2xlYW47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxWaWV3IGV4dGVuZHMgVmlldyB7XG4gIHB1YmxpYyBzY3JvbGxUb3AgPSAwO1xuICBwdWJsaWMgc2Nyb2xsTGVmdCA9IDA7XG4gIHB1YmxpYyBoYXNFdmVudEJpbmQgPSBmYWxzZTtcbiAgcHVibGljIGN1cnJlbnRFdmVudCA9IG51bGw7XG4gIHB1YmxpYyB0eXBlID0gJ1Njcm9sbFZpZXcnO1xuXG4gIHByaXZhdGUgc2Nyb2xsWVByb3A6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgaW5uZXJTY3JvbGxlck9wdGlvbjogSUlubmVyU2Nyb2xsZXJPcHRpb247XG5cbiAgcHJpdmF0ZSBzY3JvbGxlck9iaj86IFNjcm9sbGVyO1xuICBwcml2YXRlIGlzRmlyc3RTY3JvbGw/OiBib29sZWFuO1xuXG4gIHByaXZhdGUgdmVydGl2YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGhvcml6b250YWxTY3JvbGxiYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSA9IHt9LFxuICAgIGlkTmFtZSA9ICcnLFxuICAgIGNsYXNzTmFtZSA9ICcnLFxuICAgIHNjcm9sbFgsXG4gICAgc2Nyb2xsWSxcbiAgICBkYXRhc2V0LFxuICB9OiBJU2Nyb2xsVmlld09wdGlvbnMpIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBjbGFzc05hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjcm9sbFlQcm9wID0gc2Nyb2xsWTtcblxuICAgIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6ICEhc2Nyb2xsWCxcbiAgICAgIHNjcm9sbGluZ1k6ICEhc2Nyb2xsWSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOiOt+WPlua7muWKqOWIl+ihqOWGheaJgOacieWFg+e0oOeahOmrmOW6puWSjFxuICAgKiDov5nph4zkuI3og73nroDljZXlsIbmiYDmnInlrZDlhYPntKDnmoTpq5jluqbntK/liqDvvIzlm6DkuLrmr4/kuKrlhYPntKDkuYvpl7Tlj6/og73mmK/mnInnqbrpmpnnmoRcbiAgICovXG4gIGdldCBzY3JvbGxIZWlnaHQoKSB7XG4gICAgLy8gc2Nyb2xsdmlld+S4uuepuueahOaDheWGtVxuICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGxldCBtYXhIZWlnaHQgPSAwO1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaCgoaXRlbTogRWxlbWVudCkgPT4ge1xuICAgICAgaWYgKGl0ZW0uc3R5bGUucG9zaXRpb24gIT09ICdhYnNvbHV0ZScpIHtcbiAgICAgICAgbWF4SGVpZ2h0ID0gTWF0aC5tYXgobWF4SGVpZ2h0LCBpdGVtLmxheW91dEJveC50b3AgKyBpdGVtLmxheW91dEJveC5oZWlnaHQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGNvbnN0IGxhc3QgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyByZXR1cm4gbGFzdC5sYXlvdXRCb3gudG9wICsgbGFzdC5sYXlvdXRCb3guaGVpZ2h0O1xuICAgIHJldHVybiBtYXhIZWlnaHQ7XG4gIH1cblxuICBnZXQgc2Nyb2xsV2lkdGgoKSB7XG4gICAgLy8gc2Nyb2xsdmlld+S4uuepuueahOaDheWGtVxuICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cblxuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoaXRlbS5zdHlsZS5wb3NpdGlvbiAhPT0gJ2Fic29sdXRlJykge1xuICAgICAgICBtYXhXaWR0aCA9IE1hdGgubWF4KG1heFdpZHRoLCBpdGVtLmxheW91dEJveC5sZWZ0ICsgaXRlbS5sYXlvdXRCb3gud2lkdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1heFdpZHRoO1xuICAgIC8vIGNvbnN0IGxhc3QgPSB0aGlzLmNoaWxkcmVuW3RoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyByZXR1cm4gbGFzdC5sYXlvdXRCb3gubGVmdCArIGxhc3QubGF5b3V0Qm94LndpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogdmFsdWUsXG4gICAgfTtcblxuICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcblxuICB9XG5cbiAgZ2V0IHNjcm9sbFkoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdZO1xuICB9XG5cbiAgc2V0IHNjcm9sbFkodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuc2Nyb2xsWSkge1xuICAgICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNjcm9sbGVyT2JqICYmIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgdHJlZS5yZW5kZXIoKTtcblxuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgIH0pO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG4gICAgdGhpcy5jdHghLmNsZWFyUmVjdChib3guYWJzb2x1dGVYLCBib3guYWJzb2x1dGVZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICB9XG5cbiAgc2Nyb2xsUmVuZGVyKCkge1xuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuXG4gICAgY29uc3QgeyBhYnNvbHV0ZVg6IHN0YXJ0WCwgYWJzb2x1dGVZOiBzdGFydFksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICAvLyDmoLnmja7mu5rliqjlgLzojrflj5boo4HliarljLrln59cbiAgICBjb25zdCBlbmRYID0gc3RhcnRYICsgd2lkdGg7XG4gICAgY29uc3QgZW5kWSA9IHN0YXJ0WSArIGhlaWdodDtcblxuICAgIC8vIFNjcm9sbFZpZXcg5L2c5Li65a655Zmo5pys6Lqr55qE5riy5p+TXG4gICAgdGhpcy5yZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIOW8gOWni+ijgeWJqu+8jOWPquacieS7lCBTY3JvbGxWaWV3IGxheW91dEJveCDljLrln5/lhoXnmoTlhYPntKDmiY3mmK/lj6/op4HnmoRcbiAgICAgKiDov5nmoLcgU2Nyb2xsVmlldyDkuI3nlKjljZXni6zljaDnlKjkuIDkuKogY2FudmFz77yM5YaF5a2Y5ZCI5riy5p+T6YO95Lya5b6X5Yiw5LyY5YyWXG4gICAgICovXG4gICAgY3R4LnNhdmUoKTtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LnJlY3Qoc3RhcnRYLCBzdGFydFksIHdpZHRoLCBoZWlnaHQpO1xuICAgIGN0eC5jbGlwKCk7XG5cbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQsIGFic29sdXRlWCwgYWJzb2x1dGVZIH0gPSBjaGlsZC5sYXlvdXRCb3g7XG5cbiAgICAgIC8vIOWIpOaWreWkhOS6juWPr+inhueql+WPo+WGheeahOWtkOiKgueCue+8jOmAkuW9kua4suafk+ivpeWtkOiKgueCuVxuICAgICAgaWYgKGFic29sdXRlWSArIGhlaWdodCA+PSBzdGFydFkgJiYgYWJzb2x1dGVZIDw9IGVuZFlcbiAgICAgICAgJiYgYWJzb2x1dGVYICsgd2lkdGggPj0gc3RhcnRYICYmIGFic29sdXRlWCA8PSBlbmRYKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVHJlZVdpdGhUb3AoY2hpbGQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgZWxlLnN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvLyBzdHlsZUNoYW5nZUhhbmRsZXIocHJvcDogc3RyaW5nLCB2YWw6IGFueSkge1xuICAvLyAgIC8vIGNvbnNvbGUubG9nKHByb3AsIHZhbCk7XG4gIC8vICAgaWYgKHJlZmxvd0FmZmVjdGVkU3R5bGVzLmluZGV4T2YocHJvcCkgPiAtMSkge1xuXG4gIC8vICAgfVxuICAvLyB9XG5cbiAgdXBkYXRlU2Nyb2xsQmFyKHNjcm9sbFByb3A6IHN0cmluZywgc2Nyb2xsQmFyTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHtcbiAgICAgIHdpZHRoOiB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgY29udGVudFdpZHRoOiB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aCxcbiAgICAgIGNvbnRlbnRIZWlnaHQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudEhlaWdodCxcbiAgICAgIG1heFNjcm9sbExlZnQ6IHRoaXMuc2Nyb2xsZXJPYmohLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgIG1heFNjcm9sbFRvcDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxUb3AsXG4gICAgfVxuXG4gICAgaWYgKHRoaXNbc2Nyb2xsUHJvcCBhcyBrZXlvZiBTY3JvbGxWaWV3XSkge1xuICAgICAgaWYgKHRoaXNbc2Nyb2xsQmFyTmFtZSBhcyBrZXlvZiBTY3JvbGxWaWV3XSkge1xuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10uc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNjcm9sbEJhciA9IG5ldyBTY3JvbGxCYXIoe1xuICAgICAgICAgIGRpbWVuc2lvbnMsXG4gICAgICAgICAgZGlyZWN0aW9uOiBzY3JvbGxQcm9wID09PSAnc2Nyb2xsWScgPyBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwgOiBTY3JvbGxCYXJEaXJlY3Rpb24uSG9yaXpvbnRhbCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gdGhpcy5hcHBlbmRDaGlsZChzY3JvbGxiYXIpO1xuICAgICAgICBzY3JvbGxCYXIucm9vdCA9IHRoaXMucm9vdDtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBzY3JvbGxCYXIuaW5zZXJ0KHRoaXMucm9vdC5yZW5kZXJDb250ZXh0LCB0cnVlKTtcbiAgICAgICAgc2Nyb2xsQmFyLm9ic2VydmVTdHlsZUFuZEV2ZW50KCk7XG4gICAgICAgIHRoaXMuYWRkKHNjcm9sbEJhcik7XG5cbiAgICAgICAgc2Nyb2xsQmFyLnNldERpcnR5KCk7XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdID0gc2Nyb2xsQmFyO1xuXG4gICAgICAgIHNoYXJlZFRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXT8ub25TY3JvbGwodGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LCB0aGlzLnNjcm9sbGVyT2JqIS5fX3NjaGVkdWxlZFRvcCk7XG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPkuI3lho3pnIDopoHnurXlkJHmu5rliqjnmoTml7blgJnplIDmr4HnurXlkJHmu5rliqjmnaFcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddO1xuICAgICAgICBzY3JvbGxCYXIucmVtb3ZlKCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95KCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95U2VsZigpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMuc2Nyb2xsWSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXZlbnRCaW5kKSB7XG4gICAgICAvLyByZWZsb3cg6auY5bqm5Y+v6IO95Lya5Y+Y5YyW77yM5Zug5q2k6ZyA6KaB5omn6KGMIHNldERpbWVuc2lvbnMg5Yi35paw5Y+v5rua5Yqo5Yy65Z+fXG4gICAgICBpZiAodGhpcy5sYXlvdXRCb3gud2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50V2lkdGhcbiAgICAgICAgfHwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NsaWVudEhlaWdodFxuICAgICAgICB8fCB0aGlzLnNjcm9sbFdpZHRoICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLnNjcm9sbEhlaWdodCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0KSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnMoXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgICAgIHRoaXMuc2Nyb2xsV2lkdGgsXG4gICAgICAgICAgdGhpcy5zY3JvbGxIZWlnaHQsXG4gICAgICAgICk7XG5cbiAgICAgICAgc2hhcmVkVGlja2VyLm5leHQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gcmVmbG93IOS5i+WQju+8jOS8muS7jiBjc3NsYXlvdXQg5ZCM5q2l5biD5bGA5L+h5oGv77yM5Y6f5YWI55qE5rua5Yqo5L+h5oGv5Lya5Lii5aSx77yM6L+Z6YeM6ZyA6KaB5LiA5Liq5aSN5L2N55qE5pON5L2cXG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgZWxlLnN0eWxlLnBvc2l0aW9uICE9PSAnYWJzb2x1dGUnKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdGhpcy5zY3JvbGxUb3A7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVggPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYIC0gdGhpcy5zY3JvbGxMZWZ0O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuaGFzRXZlbnRCaW5kID0gdHJ1ZTtcbiAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSB0cnVlO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMuc2Nyb2xsZXJPYmogPSBuZXcgU2Nyb2xsZXIodGhpcy5zY3JvbGxIYW5kbGVyLmJpbmQodGhpcyksIHRoaXMuc2Nyb2xsZXJPcHRpb24pO1xuXG4gICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyh0aGlzLmxheW91dEJveC53aWR0aCwgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LCB0aGlzLnNjcm9sbFdpZHRoLCB0aGlzLnNjcm9sbEhlaWdodCk7XG5cbiAgICBzaGFyZWRUaWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG4gICdvcGFjaXR5J1xuXTtcblxuY29uc3QgYWxsU3R5bGVzID0gcmVmbG93QWZmZWN0ZWRTdHlsZXMuY29uY2F0KHJlcGFpbnRBZmZlY3RlZFN0eWxlcyk7XG5cbmludGVyZmFjZSBJU3R5bGUge1xuICAvLyByZWZsb3dBZmZlY3RlZFN0eWxlc1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgbWluSGVpZ2h0PzogbnVtYmVyO1xuICBtYXhXaWR0aD86IG51bWJlcjtcbiAgbWF4SGVpZ2h0PzogbnVtYmVyO1xuICBsZWZ0PzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgdG9wPzogbnVtYmVyO1xuICBib3R0b20/OiBudW1iZXI7XG4gIG1hcmdpbj86IG51bWJlcjtcbiAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gIG1hcmdpblRvcD86IG51bWJlcjtcbiAgbWFyZ2luQm90dG9tPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nQm90dG9tPzogbnVtYmVyO1xuICBib3JkZXJXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyTGVmdFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJSaWdodFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJUb3BXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tV2lkdGg/OiBudW1iZXI7XG5cbiAgYm9yZGVyVG9wTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuXG4gIGZsZXhEaXJlY3Rpb24/OiAnY29sdW1uJyB8ICdyb3cnO1xuICBmbGV4U2hyaW5rPzogbnVtYmVyO1xuICBmbGV4R3Jvdz86IG51bWJlcjtcbiAgZmxleFdyYXA/OiAnd3JhcCcgfCAnbm93cmFwJztcbiAganVzdGlmeUNvbnRlbnQ/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3BhY2UtYmV0d2VlbicgfCAnc3BhY2UtYXJvdW5kJztcbiAgYWxpZ25JdGVtcz86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgYWxpZ25TZWxmPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBwb3NpdGlvbj86IHN0cmluZztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcbn1cblxuZXhwb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgYWxsU3R5bGVzLCBJU3R5bGUgfTtcbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgY3JlYXRlQ2FudmFzIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi9zdHlsZSc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgREVGQVVMVF9GT05UX0ZBTUlMWSA9ICdQaW5nRmFuZ1NDLVJlZ3VsYXIsIHNhbnMtc2VyaWYnO1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuXG5jb25zdCBnZXRDb250ZXh0ID0gKCk6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9PiB7XG4gIGlmIChjb250ZXh0KSB7XG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBjb25zdCBjYW52YXMgPSBjcmVhdGVDYW52YXMoKTtcbiAgY2FudmFzLndpZHRoID0gMTtcbiAgY2FudmFzLmhlaWdodCA9IDE7XG4gIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgcmV0dXJuIGNvbnRleHQ7XG59O1xuXG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCk7XG5cbiAgY29udGV4dC5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnbm9ybWFsJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuXG4gIHJldHVybiBjb250ZXh0Lm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG5mdW5jdGlvbiBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCh2YWx1ZTogc3RyaW5nKSB7XG4gIHJldHVybiBnZXRDb250ZXh0KCkubWVhc3VyZVRleHQodmFsdWUpLndpZHRoIHx8IDA7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVGV4dChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuXG4gIGxldCBtYXhXaWR0aCA9IHN0eWxlLndpZHRoIGFzIG51bWJlcjtcbiAgY29uc3Qgd29yZFdpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG5cbiAgLy8g5a+55paH5a2X5rqi5Ye655qE5aSE55CG77yM6buY6K6k55SoLi4uXG4gIGNvbnN0IHRleHRPdmVyZmxvdyA9IHN0eWxlLnRleHRPdmVyZmxvdyB8fCAnZWxsaXBzaXMnO1xuXG4gIC8vIOaWh+Wtl+acgOWkp+mVv+W6puS4jei2hemZkOWItlxuICBpZiAod29yZFdpZHRoIDw9IG1heFdpZHRoKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLy8g5a+55LqO55So54K554K554K55aSE55CG55qE5oOF5Ya177yM5YWI5bCG5pyA5aSn5a695bqm5YeP5Y67Li4u55qE5a695bqmXG4gIGlmICh0ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICBtYXhXaWR0aCAtPSBnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udCgnLi4uJyk7XG4gIH1cblxuICBsZXQgbGVuZ3RoID0gdmFsdWUubGVuZ3RoIC0gMTtcbiAgbGV0IHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuXG4gIHdoaWxlIChnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udChzdHIpID4gbWF4V2lkdGggJiYgbGVuZ3RoID4gMCkge1xuICAgIGxlbmd0aCAtPSAxO1xuICAgIHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIChsZW5ndGggJiYgdGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnXG4gICAgPyBgJHtzdHJ9Li4uYFxuICAgIDogc3RyKTtcbn1cblxuaW50ZXJmYWNlIElUZXh0UHJvcHMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIHZhbHVlc3JjID0gJyc7XG4gIHByaXZhdGUgb3JpZ2luU3R5bGVXaWR0aDogbnVtYmVyIHwgc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZSA9ICd0b3AnO1xuICBwdWJsaWMgZm9udCA9ICcnO1xuICBwdWJsaWMgdGV4dEFsaWduOiBDYW52YXNUZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHB1YmxpYyBmaWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgdmFsdWUgPSAnJyxcbiAgICBkYXRhc2V0LFxuICB9OiBJVGV4dFByb3BzKSB7XG4gICAgbGV0IG9yaWdpblN0eWxlV2lkdGggPSBzdHlsZS53aWR0aDtcbiAgICAvLyDmsqHmnInorr7nva7lrr3luqbnmoTml7blgJnpgJrov4djYW52YXPorqHnrpflh7rmloflrZflrr3luqZcbiAgICBpZiAob3JpZ2luU3R5bGVXaWR0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBzdHlsZS53aWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dE92ZXJmbG93ID09PSAnZWxsaXBzaXMnKSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlVGV4dChzdHlsZSwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5oZWlnaHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgfHwgc3R5bGUuZm9udFNpemUgfHwgMTI7XG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIHN0eWxlLFxuICAgICAgZGF0YXNldCxcbiAgICB9KTtcblxuICAgIHRoaXMudHlwZSA9ICdUZXh0JztcbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuICAgIHRoaXMub3JpZ2luU3R5bGVXaWR0aCA9IG9yaWdpblN0eWxlV2lkdGg7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWUpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMudmFsdWVzcmMpIHtcbiAgICAgIGlmICh0aGlzLm9yaWdpblN0eWxlV2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHRoaXMuc3R5bGUsIG5ld1ZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycpIHtcbiAgICAgICAgbmV3VmFsdWUgPSBwYXJzZVRleHQodGhpcy5zdHlsZSwgbmV3VmFsdWUpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZhbHVlc3JjID0gbmV3VmFsdWU7XG5cbiAgICAgIHRoaXMuaXNEaXJ0eSA9IHRydWU7XG4gICAgICBsZXQgeyBwYXJlbnQgfSA9IHRoaXM7XG4gICAgICB3aGlsZSAocGFyZW50KSB7XG4gICAgICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgcGFyZW50ID0gcGFyZW50LnBhcmVudDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0NhbnZhc0RhdGEoKSB7XG4gICAgY29uc3Qgc3R5bGUgPSB0aGlzLnN0eWxlIHx8IHt9O1xuXG4gICAgdGhpcy5mb250U2l6ZSA9IHN0eWxlLmZvbnRTaXplIHx8IDEyO1xuICAgIHRoaXMudGV4dEJhc2VsaW5lID0gJ3RvcCc7XG4gICAgdGhpcy5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke0RFRkFVTFRfRk9OVF9GQU1JTFl9YDtcbiAgICB0aGlzLnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbiB8fCAnbGVmdCc7XG4gICAgdGhpcy5maWxsU3R5bGUgPSBzdHlsZS5jb2xvciB8fCAnIzAwMCc7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAgIHRoaXMudG9DYW52YXNEYXRhKCk7XG5cbiAgICBpZiAobmVlZFJlbmRlcikge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IGJveCA9IHRoaXMubGF5b3V0Qm94O1xuICAgIGNvbnN0IHsgc3R5bGUgfSA9IHRoaXM7XG5cbiAgICBjdHgudGV4dEJhc2VsaW5lID0gdGhpcy50ZXh0QmFzZWxpbmU7XG4gICAgY3R4LmZvbnQgPSB0aGlzLmZvbnQ7XG4gICAgY3R4LnRleHRBbGlnbiA9IHRoaXMudGV4dEFsaWduO1xuXG4gICAgbGV0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBsZXQgZHJhd1kgPSBib3guYWJzb2x1dGVZO1xuXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYLCBkcmF3WSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZEltYWdlICYmIHRoaXMuYmFja2dyb3VuZEltYWdlKSB7XG4gICAgICBjdHguZHJhd0ltYWdlKHRoaXMuYmFja2dyb3VuZEltYWdlLCBkcmF3WCwgZHJhd1ksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gICAgfVxuXG4gICAgaWYgKG5lZWRTdHJva2UpIHtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5maWxsU3R5bGU7XG5cbiAgICBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBkcmF3WCArPSBib3gud2lkdGggLyAyO1xuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgIGRyYXdYICs9IGJveC53aWR0aDtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUubGluZUhlaWdodCkge1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgZHJhd1kgKz0gKHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyKSAvIDI7XG4gICAgfVxuXG4gICAgY3R4LmZpbGxUZXh0KFxuICAgICAgdGhpcy52YWx1ZSxcbiAgICAgIGRyYXdYLFxuICAgICAgZHJhd1ksXG4gICAgKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1ZpZXcnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgLy8g5pyJ5Lqb6IqC54K55LuF5LuF5L2c5Li65a655Zmo77yM5a6e6ZmF5LiK5LiN6ZyA6KaB5Lu75L2V5riy5p+T6YC76L6R77yM6L+Z6YeM5Yqg5Liq5Yik5pat5Y+v5Lul5o+Q6auY5oCn6IO9XG4gIGNoZWNrTmVlZFJlbmRlcigpIHtcbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGUgfHwge307XG4gICAgY29uc3QgeyBib3JkZXJDb2xvciB9ID0gc3R5bGU7XG5cbiAgICByZXR1cm4gISEoc3R5bGUuYmFja2dyb3VuZENvbG9yXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyV2lkdGggJiYgYm9yZGVyQ29sb3IpXG4gICAgICB8fCAoc3R5bGUuYm9yZGVyVG9wV2lkdGggJiYgKGJvcmRlckNvbG9yIHx8IHN0eWxlLmJvcmRlclRvcENvbG9yKSlcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJCb3R0b21XaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyQm90dG9tQ29sb3IpKVxuICAgICAgfHwgKHN0eWxlLmJvcmRlckxlZnRXaWR0aCAmJiAoYm9yZGVyQ29sb3IgfHwgc3R5bGUuYm9yZGVyTGVmdENvbG9yKSlcbiAgICAgIHx8IChzdHlsZS5ib3JkZXJSaWdodFdpZHRoICYmIChib3JkZXJDb2xvciB8fCBzdHlsZS5ib3JkZXJSaWdodENvbG9yKSkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIGN0eC5zYXZlKCk7XG5cbiAgICBpZiAoc3R5bGUub3BhY2l0eSAhPT0gMSkge1xuICAgICAgY3R4Lmdsb2JhbEFscGhhID0gc3R5bGUub3BhY2l0eSBhcyBudW1iZXI7XG4gICAgfVxuXG4gICAgY29uc3QgYm9yZGVyV2lkdGggPSBzdHlsZS5ib3JkZXJXaWR0aCB8fCAwO1xuICAgIGNvbnN0IGRyYXdYID0gYm94LmFic29sdXRlWDtcbiAgICBjb25zdCBkcmF3WSA9IGJveC5hYnNvbHV0ZVk7XG5cbiAgICBjb25zdCBib3JkZXJMZWZ0V2lkdGggPSBzdHlsZS5ib3JkZXJMZWZ0V2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyUmlnaHRXaWR0aCA9IHN0eWxlLmJvcmRlclJpZ2h0V2lkdGggfHwgYm9yZGVyV2lkdGg7XG4gICAgY29uc3QgYm9yZGVyVG9wV2lkdGggPSBzdHlsZS5ib3JkZXJUb3BXaWR0aCB8fCBib3JkZXJXaWR0aDtcbiAgICBjb25zdCBib3JkZXJCb3R0b21XaWR0aCA9IHN0eWxlLmJvcmRlckJvdHRvbVdpZHRoIHx8IGJvcmRlcldpZHRoO1xuXG4gICAgLy8gdGhpcy5yZW5kZXJCb3JkZXIoY3R4KTtcbiAgICBjb25zdCB7IG5lZWRDbGlwLCBuZWVkU3Ryb2tlIH0gPSB0aGlzLnJlbmRlckJvcmRlcihjdHgpO1xuXG4gICAgaWYgKG5lZWRDbGlwKSB7XG4gICAgICBjdHguY2xpcCgpO1xuICAgIH1cblxuICAgIGlmIChzdHlsZS5iYWNrZ3JvdW5kQ29sb3IpIHtcbiAgICAgIGN0eC5maWxsU3R5bGUgPSBzdHlsZS5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBjdHguZmlsbFJlY3QoXG4gICAgICAgIGRyYXdYICsgYm9yZGVyTGVmdFdpZHRoLFxuICAgICAgICBkcmF3WSArIGJvcmRlclJpZ2h0V2lkdGgsXG4gICAgICAgIGJveC53aWR0aCAtIChib3JkZXJMZWZ0V2lkdGggKyBib3JkZXJSaWdodFdpZHRoKSxcbiAgICAgICAgYm94LmhlaWdodCAtIChib3JkZXJUb3BXaWR0aCArIGJvcmRlckJvdHRvbVdpZHRoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJhY2tncm91bmRJbWFnZSAmJiB0aGlzLmJhY2tncm91bmRJbWFnZSkge1xuICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmJhY2tncm91bmRJbWFnZSwgZHJhd1gsIGRyYXdZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxufVxuIiwiaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBHYW1lR2xvYmFsLl9fZW52ID0gR2FtZUdsb2JhbC53eCB8fCBHYW1lR2xvYmFsLnR0IHx8IEdhbWVHbG9iYWwuc3dhbjtcbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgdXRpbCA9IHJlcXVpcmUoJy4vdXRpbCcpO1xuXG5jb25zdCBjb252ZXJ0VG9Kc29uID0gZnVuY3Rpb24obm9kZSwgb3B0aW9ucykge1xuICBjb25zdCBqT2JqID0ge1xuICAgIG5hbWU6IG5vZGUudGFnbmFtZVxuICB9O1xuXG4gIC8vd2hlbiBubyBjaGlsZCBub2RlIG9yIGF0dHIgaXMgcHJlc2VudFxuICBpZiAoKCFub2RlLmNoaWxkIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmNoaWxkKSkgJiYgKCFub2RlLmF0dHJzTWFwIHx8IHV0aWwuaXNFbXB0eU9iamVjdChub2RlLmF0dHJzTWFwKSkpIHtcbiAgICByZXR1cm4gdXRpbC5pc0V4aXN0KG5vZGUudmFsKSAmJiAhIW5vZGUudmFsID8gbm9kZS52YWwgOiBqT2JqO1xuICB9IGVsc2Uge1xuICAgIC8vb3RoZXJ3aXNlIGNyZWF0ZSBhIHRleHRub2RlIGlmIG5vZGUgaGFzIHNvbWUgdGV4dFxuICAgIGlmICh1dGlsLmlzRXhpc3Qobm9kZS52YWwpKSB7XG4gICAgICBpZiAoISh0eXBlb2Ygbm9kZS52YWwgPT09ICdzdHJpbmcnICYmIChub2RlLnZhbCA9PT0gJycgfHwgbm9kZS52YWwgPT09IG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXIpKSkge1xuICAgICAgICBpZihvcHRpb25zLmFycmF5TW9kZSA9PT0gXCJzdHJpY3RcIil7XG4gICAgICAgICAgak9ialtvcHRpb25zLnRleHROb2RlTmFtZV0gPSBbIG5vZGUudmFsIF07XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gbm9kZS52YWw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIHV0aWwubWVyZ2Uoak9iaiwgbm9kZS5hdHRyc01hcCwgb3B0aW9ucy5hcnJheU1vZGUpO1xuXG4gIGpPYmouY2hpbGRyZW4gPSBbXTtcbiAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKCBjaGlsZCA9PiB7XG4gICAgak9iai5jaGlsZHJlbi5wdXNoKGNvbnZlcnRUb0pzb24oY2hpbGQsIG9wdGlvbnMpKVxuICB9KTtcblxuICAvL2FkZCB2YWx1ZVxuICByZXR1cm4gak9iajtcbn07XG5cbmV4cG9ydHMuY29udmVydFRvSnNvbiA9IGNvbnZlcnRUb0pzb247XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IG5vZGVUb0pzb24gPSByZXF1aXJlKCcuL25vZGUyanNvbicpO1xuY29uc3QgeG1sVG9Ob2Rlb2JqID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgeDJ4bWxub2RlID0gcmVxdWlyZSgnLi94bWxzdHIyeG1sbm9kZScpO1xuY29uc3QgYnVpbGRPcHRpb25zID0gcmVxdWlyZSgnLi91dGlsJykuYnVpbGRPcHRpb25zO1xuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi92YWxpZGF0b3InKTtcblxuZXhwb3J0cy5wYXJzZSA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMsIHZhbGlkYXRpb25PcHRpb24pIHtcbiAgIGlmKCB2YWxpZGF0aW9uT3B0aW9uKXtcbiAgICAgaWYodmFsaWRhdGlvbk9wdGlvbiA9PT0gdHJ1ZSkgdmFsaWRhdGlvbk9wdGlvbiA9IHt9XG5cbiAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdG9yLnZhbGlkYXRlKHhtbERhdGEsIHZhbGlkYXRpb25PcHRpb24pO1xuICAgICBpZiAocmVzdWx0ICE9PSB0cnVlKSB7XG4gICAgICAgdGhyb3cgRXJyb3IoIHJlc3VsdC5lcnIubXNnKVxuICAgICB9XG4gICB9XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgeDJ4bWxub2RlLmRlZmF1bHRPcHRpb25zLCB4MnhtbG5vZGUucHJvcHMpO1xuICByZXR1cm4gbm9kZVRvSnNvbi5jb252ZXJ0VG9Kc29uKHhtbFRvTm9kZW9iai5nZXRUcmF2ZXJzYWxPYmooeG1sRGF0YSwgb3B0aW9ucyksIG9wdGlvbnMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBnZXRBbGxNYXRjaGVzID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaGVzID0gW107XG4gIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgd2hpbGUgKG1hdGNoKSB7XG4gICAgY29uc3QgYWxsbWF0Y2hlcyA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgbGVuOyBpbmRleCsrKSB7XG4gICAgICBhbGxtYXRjaGVzLnB1c2gobWF0Y2hbaW5kZXhdKTtcbiAgICB9XG4gICAgbWF0Y2hlcy5wdXNoKGFsbG1hdGNoZXMpO1xuICAgIG1hdGNoID0gcmVnZXguZXhlYyhzdHJpbmcpO1xuICB9XG4gIHJldHVybiBtYXRjaGVzO1xufTtcblxuY29uc3QgZG9lc01hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICBjb25zdCBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgcmV0dXJuICEobWF0Y2ggPT09IG51bGwgfHwgdHlwZW9mIG1hdGNoID09PSAndW5kZWZpbmVkJyk7XG59O1xuXG5jb25zdCBkb2VzTm90TWF0Y2ggPSBmdW5jdGlvbihzdHJpbmcsIHJlZ2V4KSB7XG4gIHJldHVybiAhZG9lc01hdGNoKHN0cmluZywgcmVnZXgpO1xufTtcblxuZXhwb3J0cy5pc0V4aXN0ID0gZnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgIT09ICd1bmRlZmluZWQnO1xufTtcblxuZXhwb3J0cy5pc0VtcHR5T2JqZWN0ID0gZnVuY3Rpb24ob2JqKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMDtcbn07XG5cbi8qKlxuICogQ29weSBhbGwgdGhlIHByb3BlcnRpZXMgb2YgYSBpbnRvIGIuXG4gKiBAcGFyYW0geyp9IHRhcmdldFxuICogQHBhcmFtIHsqfSBhXG4gKi9cbmV4cG9ydHMubWVyZ2UgPSBmdW5jdGlvbih0YXJnZXQsIGEsIGFycmF5TW9kZSkge1xuICBpZiAoYSkge1xuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhhKTsgLy8gd2lsbCByZXR1cm4gYW4gYXJyYXkgb2Ygb3duIHByb3BlcnRpZXNcbiAgICBjb25zdCBsZW4gPSBrZXlzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmKGFycmF5TW9kZSA9PT0gJ3N0cmljdCcpe1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBbIGFba2V5c1tpXV0gXTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0YXJnZXRba2V5c1tpXV0gPSBhW2tleXNbaV1dO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbi8qIGV4cG9ydHMubWVyZ2UgPWZ1bmN0aW9uIChiLGEpe1xuICByZXR1cm4gT2JqZWN0LmFzc2lnbihiLGEpO1xufSAqL1xuXG5leHBvcnRzLmdldFZhbHVlID0gZnVuY3Rpb24odikge1xuICBpZiAoZXhwb3J0cy5pc0V4aXN0KHYpKSB7XG4gICAgcmV0dXJuIHY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG59O1xuXG4vLyBjb25zdCBmYWtlQ2FsbCA9IGZ1bmN0aW9uKGEpIHtyZXR1cm4gYTt9O1xuLy8gY29uc3QgZmFrZUNhbGxOb1JldHVybiA9IGZ1bmN0aW9uKCkge307XG5cbmV4cG9ydHMuYnVpbGRPcHRpb25zID0gZnVuY3Rpb24ob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKSB7XG4gIHZhciBuZXdPcHRpb25zID0ge307XG4gIGlmICghb3B0aW9ucykge1xuICAgIHJldHVybiBkZWZhdWx0T3B0aW9uczsgLy9pZiB0aGVyZSBhcmUgbm90IG9wdGlvbnNcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAob3B0aW9uc1twcm9wc1tpXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBvcHRpb25zW3Byb3BzW2ldXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3T3B0aW9uc1twcm9wc1tpXV0gPSBkZWZhdWx0T3B0aW9uc1twcm9wc1tpXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdPcHRpb25zO1xufTtcblxuZXhwb3J0cy5kb2VzTWF0Y2ggPSBkb2VzTWF0Y2g7XG5leHBvcnRzLmRvZXNOb3RNYXRjaCA9IGRvZXNOb3RNYXRjaDtcbmV4cG9ydHMuZ2V0QWxsTWF0Y2hlcyA9IGdldEFsbE1hdGNoZXM7XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IGZhbHNlLCAvL0EgdGFnIGNhbiBoYXZlIGF0dHJpYnV0ZXMgd2l0aG91dCBhbnkgdmFsdWVcbiAgbG9jYWxlUmFuZ2U6ICdhLXpBLVonLFxufTtcblxuY29uc3QgcHJvcHMgPSBbJ2FsbG93Qm9vbGVhbkF0dHJpYnV0ZXMnLCAnbG9jYWxlUmFuZ2UnXTtcblxuLy9jb25zdCB0YWdzUGF0dGVybiA9IG5ldyBSZWdFeHAoXCI8XFxcXC8/KFtcXFxcdzpcXFxcLV9cXC5dKylcXFxccypcXC8/PlwiLFwiZ1wiKTtcbmV4cG9ydHMudmFsaWRhdGUgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB1dGlsLmJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSxcIlwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC8oXlxccyo8XFw/eG1sLio/XFw/PikvZyxcIlwiKTsvL1JlbW92ZSBYTUwgc3RhcnRpbmcgdGFnXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKDwhRE9DVFlQRVtcXHNcXHdcXFwiXFwuXFwvXFwtXFw6XSsoXFxbLipcXF0pKlxccyo+KS9nLFwiXCIpOy8vUmVtb3ZlIERPQ1RZUEVcblxuICBjb25zdCB0YWdzID0gW107XG4gIGxldCB0YWdGb3VuZCA9IGZhbHNlO1xuICBpZiAoeG1sRGF0YVswXSA9PT0gJ1xcdWZlZmYnKSB7XG4gICAgLy8gY2hlY2sgZm9yIGJ5dGUgb3JkZXIgbWFyayAoQk9NKVxuICAgIHhtbERhdGEgPSB4bWxEYXRhLnN1YnN0cigxKTtcbiAgfVxuICBjb25zdCByZWd4QXR0ck5hbWUgPSBuZXcgUmVnRXhwKCdeW193XVtcXFxcd1xcXFwtLjpdKiQnLnJlcGxhY2UoJ193JywgJ18nICsgb3B0aW9ucy5sb2NhbGVSYW5nZSkpO1xuICBjb25zdCByZWd4VGFnTmFtZSA9IG5ldyBSZWdFeHAoJ14oW3ddfF8pW1xcXFx3LlxcXFwtXzpdKicucmVwbGFjZSgnKFt3JywgJyhbJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgLy9zdGFydGluZyBvZiB0YWdcbiAgICAgIC8vcmVhZCB1bnRpbCB5b3UgcmVhY2ggdG8gJz4nIGF2b2lkaW5nIGFueSAnPicgaW4gYXR0cmlidXRlIHZhbHVlXG5cbiAgICAgIGkrKztcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPycpIHtcbiAgICAgICAgaSA9IHJlYWRQSSh4bWxEYXRhLCArK2kpO1xuICAgICAgICBpZiAoaS5lcnIpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnIScpIHtcbiAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGNsb3NpbmdUYWcgPSBmYWxzZTtcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICcvJykge1xuICAgICAgICAgIC8vY2xvc2luZyB0YWdcbiAgICAgICAgICBjbG9zaW5nVGFnID0gdHJ1ZTtcbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgICAgLy9yZWFkIHRhZ25hbWVcbiAgICAgICAgbGV0IHRhZ05hbWUgPSAnJztcbiAgICAgICAgZm9yIChcbiAgICAgICAgICA7XG4gICAgICAgICAgaSA8IHhtbERhdGEubGVuZ3RoICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJz4nICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJyAnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcdCcgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxuJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHInO1xuICAgICAgICAgIGkrK1xuICAgICAgICApIHtcbiAgICAgICAgICB0YWdOYW1lICs9IHhtbERhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUudHJpbSgpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHRhZ05hbWUpO1xuXG4gICAgICAgIGlmICh0YWdOYW1lW3RhZ05hbWUubGVuZ3RoIC0gMV0gPT09ICcvJykge1xuICAgICAgICAgIC8vc2VsZiBjbG9zaW5nIHRhZyB3aXRob3V0IGF0dHJpYnV0ZXNcbiAgICAgICAgICB0YWdOYW1lID0gdGFnTmFtZS5zdWJzdHJpbmcoMCwgdGFnTmFtZS5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXZhbGlkYXRlVGFnTmFtZSh0YWdOYW1lLCByZWd4VGFnTmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnVGFnICcgKyB0YWdOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ0F0dHJpYnV0ZXMgZm9yIFwiJyArIHRhZ05hbWUgKyAnXCIgaGF2ZSBvcGVuIHF1b3RlLid9fTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYXR0clN0ciA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaSA9IHJlc3VsdC5pbmRleDtcblxuICAgICAgICBpZiAoYXR0clN0clthdHRyU3RyLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWdcbiAgICAgICAgICBhdHRyU3RyID0gYXR0clN0ci5zdWJzdHJpbmcoMCwgYXR0clN0ci5sZW5ndGggLSAxKTtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gdmFsaWRhdGVBdHRyaWJ1dGVTdHJpbmcoYXR0clN0ciwgb3B0aW9ucywgcmVneEF0dHJOYW1lKTtcbiAgICAgICAgICBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgLy9jb250aW51ZTsgLy90ZXh0IG1heSBwcmVzZW50cyBhZnRlciBzZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjbG9zaW5nVGFnKSB7XG4gICAgICAgICAgaWYoIXJlc3VsdC50YWdDbG9zZWQpe1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGRvbid0IGhhdmUgcHJvcGVyIGNsb3NpbmcuXCJ9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9ZWxzZSBpZiAoYXR0clN0ci50cmltKCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyBcIicgKyB0YWdOYW1lICsgXCJcXFwiIGNhbid0IGhhdmUgYXR0cmlidXRlcyBvciBpbnZhbGlkIHN0YXJ0aW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IG90ZyA9IHRhZ3MucG9wKCk7XG4gICAgICAgICAgICBpZiAodGFnTmFtZSAhPT0gb3RnKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRUYWcnLCBtc2c6ICdjbG9zaW5nIHRhZyAnICsgb3RnICsgJyBpcyBleHBlY3RlZCBpbnBsYWNlIG9mICcgKyB0YWdOYW1lICsgJy4nfSxcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgIT09IHRydWUpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0YWdzLnB1c2godGFnTmFtZSk7XG4gICAgICAgICAgdGFnRm91bmQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9za2lwIHRhZyB0ZXh0IHZhbHVlXG4gICAgICAgIC8vSXQgbWF5IGluY2x1ZGUgY29tbWVudHMgYW5kIENEQVRBIHZhbHVlXG4gICAgICAgIGZvciAoaSsrOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgICAgIGlmICh4bWxEYXRhW2kgKyAxXSA9PT0gJyEnKSB7XG4gICAgICAgICAgICAgIC8vY29tbWVudCBvciBDQURBVEFcbiAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICBpID0gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gLy9lbmQgb2YgcmVhZGluZyB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgaS0tO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnICcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcdCcgfHwgeG1sRGF0YVtpXSA9PT0gJ1xcbicgfHwgeG1sRGF0YVtpXSA9PT0gJ1xccicpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQ2hhcicsIG1zZzogJ2NoYXIgJyArIHhtbERhdGFbaV0gKyAnIGlzIG5vdCBleHBlY3RlZCAuJ319O1xuICAgIH1cbiAgfVxuXG4gIGlmICghdGFnRm91bmQpIHtcbiAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnU3RhcnQgdGFnIGV4cGVjdGVkLid9fTtcbiAgfSBlbHNlIGlmICh0YWdzLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdJbnZhbGlkICcgKyBKU09OLnN0cmluZ2lmeSh0YWdzLCBudWxsLCA0KS5yZXBsYWNlKC9cXHI/XFxuL2csICcnKSArICcgZm91bmQuJ30sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuLyoqXG4gKiBSZWFkIFByb2Nlc3NpbmcgaW5zc3RydWN0aW9ucyBhbmQgc2tpcFxuICogQHBhcmFtIHsqfSB4bWxEYXRhXG4gKiBAcGFyYW0geyp9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZFBJKHhtbERhdGEsIGkpIHtcbiAgdmFyIHN0YXJ0ID0gaTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT0gJz8nIHx8IHhtbERhdGFbaV0gPT0gJyAnKSB7XG4gICAgICAvL3RhZ25hbWVcbiAgICAgIHZhciB0YWduYW1lID0geG1sRGF0YS5zdWJzdHIoc3RhcnQsIGkgLSBzdGFydCk7XG4gICAgICBpZiAoaSA+IDUgJiYgdGFnbmFtZSA9PT0gJ3htbCcpIHtcbiAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1hNTCBkZWNsYXJhdGlvbiBhbGxvd2VkIG9ubHkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBkb2N1bWVudC4nfX07XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT0gJz8nICYmIHhtbERhdGFbaSArIDFdID09ICc+Jykge1xuICAgICAgICAvL2NoZWNrIGlmIHZhbGlkIGF0dHJpYnV0IHN0cmluZ1xuICAgICAgICBpKys7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBpO1xufVxuXG5mdW5jdGlvbiByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpIHtcbiAgaWYgKHhtbERhdGEubGVuZ3RoID4gaSArIDUgJiYgeG1sRGF0YVtpICsgMV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJy0nKSB7XG4gICAgLy9jb21tZW50XG4gICAgZm9yIChpICs9IDM7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICc+Jykge1xuICAgICAgICBpICs9IDI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA4ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdEJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnTycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0MnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnWScgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ1AnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdFJ1xuICApIHtcbiAgICBsZXQgYW5nbGVCcmFja2V0c0NvdW50ID0gMTtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50Kys7XG4gICAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgICBhbmdsZUJyYWNrZXRzQ291bnQtLTtcbiAgICAgICAgaWYgKGFuZ2xlQnJhY2tldHNDb3VudCA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAgIHhtbERhdGEubGVuZ3RoID4gaSArIDkgJiZcbiAgICB4bWxEYXRhW2kgKyAxXSA9PT0gJ1snICYmXG4gICAgeG1sRGF0YVtpICsgMl0gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDNdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyA0XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgNV0gPT09ICdUJyAmJlxuICAgIHhtbERhdGFbaSArIDZdID09PSAnQScgJiZcbiAgICB4bWxEYXRhW2kgKyA3XSA9PT0gJ1snXG4gICkge1xuICAgIGZvciAoaSArPSA4OyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJ10nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gaTtcbn1cblxudmFyIGRvdWJsZVF1b3RlID0gJ1wiJztcbnZhciBzaW5nbGVRdW90ZSA9IFwiJ1wiO1xuXG4vKipcbiAqIEtlZXAgcmVhZGluZyB4bWxEYXRhIHVudGlsICc8JyBpcyBmb3VuZCBvdXRzaWRlIHRoZSBhdHRyaWJ1dGUgdmFsdWUuXG4gKiBAcGFyYW0ge3N0cmluZ30geG1sRGF0YVxuICogQHBhcmFtIHtudW1iZXJ9IGlcbiAqL1xuZnVuY3Rpb24gcmVhZEF0dHJpYnV0ZVN0cih4bWxEYXRhLCBpKSB7XG4gIGxldCBhdHRyU3RyID0gJyc7XG4gIGxldCBzdGFydENoYXIgPSAnJztcbiAgbGV0IHRhZ0Nsb3NlZCA9IGZhbHNlO1xuICBmb3IgKDsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoeG1sRGF0YVtpXSA9PT0gZG91YmxlUXVvdGUgfHwgeG1sRGF0YVtpXSA9PT0gc2luZ2xlUXVvdGUpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHN0YXJ0Q2hhciA9IHhtbERhdGFbaV07XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0Q2hhciAhPT0geG1sRGF0YVtpXSkge1xuICAgICAgICAvL2lmIHZhdWUgaXMgZW5jbG9zZWQgd2l0aCBkb3VibGUgcXVvdGUgdGhlbiBzaW5nbGUgcXVvdGVzIGFyZSBhbGxvd2VkIGluc2lkZSB0aGUgdmFsdWUgYW5kIHZpY2UgdmVyc2FcbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGFydENoYXIgPSAnJztcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHhtbERhdGFbaV0gPT09ICc+Jykge1xuICAgICAgaWYgKHN0YXJ0Q2hhciA9PT0gJycpIHtcbiAgICAgICAgdGFnQ2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGF0dHJTdHIgKz0geG1sRGF0YVtpXTtcbiAgfVxuICBpZiAoc3RhcnRDaGFyICE9PSAnJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiB7dmFsdWU6IGF0dHJTdHIsIGluZGV4OiBpLCB0YWdDbG9zZWQ6IHRhZ0Nsb3NlZH07XG59XG5cbi8qKlxuICogU2VsZWN0IGFsbCB0aGUgYXR0cmlidXRlcyB3aGV0aGVyIHZhbGlkIG9yIGludmFsaWQuXG4gKi9cbmNvbnN0IHZhbGlkQXR0clN0clJlZ3hwID0gbmV3IFJlZ0V4cCgnKFxcXFxzKikoW15cXFxccz1dKykoXFxcXHMqPSk/KFxcXFxzKihbXFwnXCJdKSgoW1xcXFxzXFxcXFNdKSo/KVxcXFw1KT8nLCAnZycpO1xuXG4vL2F0dHIsID1cInNkXCIsIGE9XCJhbWl0J3NcIiwgYT1cInNkXCJiPVwic2FmXCIsIGFiICBjZD1cIlwiXG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSkge1xuICAvL2NvbnNvbGUubG9nKFwic3RhcnQ6XCIrYXR0clN0citcIjplbmRcIik7XG5cbiAgLy9pZihhdHRyU3RyLnRyaW0oKS5sZW5ndGggPT09IDApIHJldHVybiB0cnVlOyAvL2VtcHR5IHN0cmluZ1xuXG4gIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgdmFsaWRBdHRyU3RyUmVneHApO1xuICBjb25zdCBhdHRyTmFtZXMgPSB7fTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1hdGNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvL2NvbnNvbGUubG9nKG1hdGNoZXNbaV0pO1xuXG4gICAgaWYgKG1hdGNoZXNbaV1bMV0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAvL25vc3BhY2UgYmVmb3JlIGF0dHJpYnV0ZSBuYW1lOiBhPVwic2RcImI9XCJzYWZcIlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIG1hdGNoZXNbaV1bMl0gKyAnIGhhcyBubyBzcGFjZSBpbiBzdGFydGluZy4nfX07XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzW2ldWzNdID09PSB1bmRlZmluZWQgJiYgIW9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgLy9pbmRlcGVuZGVudCBhdHRyaWJ1dGU6IGFiXG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2Jvb2xlYW4gYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBpcyBub3QgYWxsb3dlZC4nfX07XG4gICAgfVxuICAgIC8qIGVsc2UgaWYobWF0Y2hlc1tpXVs2XSA9PT0gdW5kZWZpbmVkKXsvL2F0dHJpYnV0ZSB3aXRob3V0IHZhbHVlOiBhYj1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZXJyOiB7IGNvZGU6XCJJbnZhbGlkQXR0clwiLG1zZzpcImF0dHJpYnV0ZSBcIiArIG1hdGNoZXNbaV1bMl0gKyBcIiBoYXMgbm8gdmFsdWUgYXNzaWduZWQuXCJ9fTtcbiAgICAgICAgICAgICAgICB9ICovXG4gICAgY29uc3QgYXR0ck5hbWUgPSBtYXRjaGVzW2ldWzJdO1xuICAgIGlmICghdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSkge1xuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdhdHRyaWJ1dGUgJyArIGF0dHJOYW1lICsgJyBpcyBhbiBpbnZhbGlkIG5hbWUuJ319O1xuICAgIH1cbiAgICAvKmlmICghYXR0ck5hbWVzLmhhc093blByb3BlcnR5KGF0dHJOYW1lKSkgeyovXG4gICAgaWYgKCAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGF0dHJOYW1lcywgYXR0ck5hbWUpKSB7XG4gICAgICAvL2NoZWNrIGZvciBkdXBsaWNhdGUgYXR0cmlidXRlLlxuICAgICAgYXR0ck5hbWVzW2F0dHJOYW1lXSA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgcmVwZWF0ZWQuJ319O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IC9eW19hLXpBLVpdW1xcd1xcLS46XSokLztcblxuZnVuY3Rpb24gdmFsaWRhdGVBdHRyTmFtZShhdHRyTmFtZSwgcmVneEF0dHJOYW1lKSB7XG4gIC8vIGNvbnN0IHZhbGlkQXR0clJlZ3hwID0gbmV3IFJlZ0V4cChyZWd4QXR0ck5hbWUpO1xuICByZXR1cm4gdXRpbC5kb2VzTWF0Y2goYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSk7XG59XG5cbi8vY29uc3Qgc3RhcnRzV2l0aFhNTCA9IG5ldyBSZWdFeHAoXCJeW1h4XVtNbV1bTGxdXCIpO1xuLy8gIHN0YXJ0c1dpdGggPSAvXihbYS16QS1aXXxfKVtcXHcuXFwtXzpdKi87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlVGFnTmFtZSh0YWduYW1lLCByZWd4VGFnTmFtZSkge1xuICAvKmlmKHV0aWwuZG9lc01hdGNoKHRhZ25hbWUsc3RhcnRzV2l0aFhNTCkpIHJldHVybiBmYWxzZTtcbiAgICBlbHNlKi9cbiAgcmV0dXJuICF1dGlsLmRvZXNOb3RNYXRjaCh0YWduYW1lLCByZWd4VGFnTmFtZSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFnbmFtZSwgcGFyZW50LCB2YWwpIHtcbiAgdGhpcy50YWduYW1lID0gdGFnbmFtZTtcbiAgdGhpcy5wYXJlbnQgPSBwYXJlbnQ7XG4gIHRoaXMuY2hpbGQgPSB7fTsgLy9jaGlsZCB0YWdzXG4gIHRoaXMuYXR0cnNNYXAgPSB7fTsgLy9hdHRyaWJ1dGVzIG1hcFxuICB0aGlzLmNoaWxkcmVuID0gW107XG4gIHRoaXMudmFsID0gdmFsOyAvL3RleHQgb25seVxuICB0aGlzLmFkZENoaWxkID0gZnVuY3Rpb24oY2hpbGQpIHtcbiAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0pKSB7XG4gICAgICAvL2FscmVhZHkgcHJlc2VudHNcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0ucHVzaChjaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2hpbGRbY2hpbGQudGFnbmFtZV0gPSBbY2hpbGRdO1xuICAgIH1cbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHhtbE5vZGUgPSByZXF1aXJlKCcuL3htbE5vZGUnKTtcbmNvbnN0IFRhZ1R5cGUgPSB7T1BFTklORzogMSwgQ0xPU0lORzogMiwgU0VMRjogMywgQ0RBVEE6IDR9O1xubGV0IHJlZ3ggPVxuICAnPCgoIVxcXFxbQ0RBVEFcXFxcWyhbXFxcXHNcXFxcU10qPykoXV0+KSl8KChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKShbXj5dKik+fCgoXFxcXC8pKChbXFxcXHc6XFxcXC0uX10qOik/KFtcXFxcdzpcXFxcLS5fXSspKVxcXFxzKj4pKShbXjxdKiknO1xuXG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/W1xcXFx3OlxcXFwtXFwuX10rKShbXj5dKik+KFxcXFxzKlwiK2NkYXRhUmVneCtcIikqKFtePF0rKT9cIixcImdcIik7XG4vL2NvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChcIjwoXFxcXC8/KSgoXFxcXHcqOik/KFtcXFxcdzpcXFxcLVxcLl9dKykpKFtePl0qKT4oW148XSopKFwiK2NkYXRhUmVneCtcIihbXjxdKikpKihbXjxdKyk/XCIsXCJnXCIpO1xuXG4vL3BvbHlmaWxsXG5pZiAoIU51bWJlci5wYXJzZUludCAmJiB3aW5kb3cucGFyc2VJbnQpIHtcbiAgTnVtYmVyLnBhcnNlSW50ID0gd2luZG93LnBhcnNlSW50O1xufVxuaWYgKCFOdW1iZXIucGFyc2VGbG9hdCAmJiB3aW5kb3cucGFyc2VGbG9hdCkge1xuICBOdW1iZXIucGFyc2VGbG9hdCA9IHdpbmRvdy5wYXJzZUZsb2F0O1xufVxuXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgYXR0cmlidXRlTmFtZVByZWZpeDogJ0BfJyxcbiAgYXR0ck5vZGVOYW1lOiBmYWxzZSxcbiAgdGV4dE5vZGVOYW1lOiAnI3RleHQnLFxuICBpZ25vcmVBdHRyaWJ1dGVzOiB0cnVlLFxuICBpZ25vcmVOYW1lU3BhY2U6IGZhbHNlLFxuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9hIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIC8vaWdub3JlUm9vdEVsZW1lbnQgOiBmYWxzZSxcbiAgcGFyc2VOb2RlVmFsdWU6IHRydWUsXG4gIHBhcnNlQXR0cmlidXRlVmFsdWU6IGZhbHNlLFxuICBhcnJheU1vZGU6IGZhbHNlLFxuICB0cmltVmFsdWVzOiB0cnVlLCAvL1RyaW0gc3RyaW5nIHZhbHVlcyBvZiB0YWcgYW5kIGF0dHJpYnV0ZXNcbiAgY2RhdGFUYWdOYW1lOiBmYWxzZSxcbiAgY2RhdGFQb3NpdGlvbkNoYXI6ICdcXFxcYycsXG4gIGxvY2FsZVJhbmdlOiAnJyxcbiAgdGFnVmFsdWVQcm9jZXNzb3I6IGZ1bmN0aW9uKGEpIHtcbiAgICByZXR1cm4gYTtcbiAgfSxcbiAgYXR0clZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIHN0b3BOb2RlczogW11cbiAgLy9kZWNvZGVTdHJpY3Q6IGZhbHNlLFxufTtcblxuZXhwb3J0cy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuXG5jb25zdCBwcm9wcyA9IFtcbiAgJ2F0dHJpYnV0ZU5hbWVQcmVmaXgnLFxuICAnYXR0ck5vZGVOYW1lJyxcbiAgJ3RleHROb2RlTmFtZScsXG4gICdpZ25vcmVBdHRyaWJ1dGVzJyxcbiAgJ2lnbm9yZU5hbWVTcGFjZScsXG4gICdhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJyxcbiAgJ3BhcnNlTm9kZVZhbHVlJyxcbiAgJ3BhcnNlQXR0cmlidXRlVmFsdWUnLFxuICAnYXJyYXlNb2RlJyxcbiAgJ3RyaW1WYWx1ZXMnLFxuICAnY2RhdGFUYWdOYW1lJyxcbiAgJ2NkYXRhUG9zaXRpb25DaGFyJyxcbiAgJ2xvY2FsZVJhbmdlJyxcbiAgJ3RhZ1ZhbHVlUHJvY2Vzc29yJyxcbiAgJ2F0dHJWYWx1ZVByb2Nlc3NvcicsXG4gICdwYXJzZVRydWVOdW1iZXJPbmx5JyxcbiAgJ3N0b3BOb2Rlcydcbl07XG5leHBvcnRzLnByb3BzID0gcHJvcHM7XG5cbmNvbnN0IGdldFRyYXZlcnNhbE9iaiA9IGZ1bmN0aW9uKHhtbERhdGEsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGJ1aWxkT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0T3B0aW9ucywgcHJvcHMpO1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoL1xccj9cXG4vZywgXCIgXCIpOy8vbWFrZSBpdCBzaW5nbGUgbGluZVxuICB4bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC88IS0tW1xcc1xcU10qPy0tPi9nLCAnJyk7IC8vUmVtb3ZlICBjb21tZW50c1xuXG4gIGNvbnN0IHhtbE9iaiA9IG5ldyB4bWxOb2RlKCcheG1sJyk7XG4gIGxldCBjdXJyZW50Tm9kZSA9IHhtbE9iajtcblxuICByZWd4ID0gcmVneC5yZXBsYWNlKC9cXFtcXFxcdy9nLCAnWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlICsgJ1xcXFx3Jyk7XG4gIGNvbnN0IHRhZ3NSZWd4ID0gbmV3IFJlZ0V4cChyZWd4LCAnZycpO1xuICBsZXQgdGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgbGV0IG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB3aGlsZSAodGFnKSB7XG4gICAgY29uc3QgdGFnVHlwZSA9IGNoZWNrRm9yVGFnVHlwZSh0YWcpO1xuXG4gICAgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuQ0xPU0lORykge1xuICAgICAgLy9hZGQgcGFyc2VkIGRhdGEgdG8gcGFyZW50IG5vZGVcbiAgICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnQgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5wYXJlbnQudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS5wYXJlbnQudmFsKSArICcnICsgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucywgY3VycmVudE5vZGUucGFyZW50LnRhZ25hbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG9wdGlvbnMuc3RvcE5vZGVzLmxlbmd0aCAmJiBvcHRpb25zLnN0b3BOb2Rlcy5pbmNsdWRlcyhjdXJyZW50Tm9kZS50YWduYW1lKSkge1xuICAgICAgICBjdXJyZW50Tm9kZS5jaGlsZCA9IFtdXG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5hdHRyc01hcCA9PSB1bmRlZmluZWQpIHsgY3VycmVudE5vZGUuYXR0cnNNYXAgPSB7fX1cbiAgICAgICAgY3VycmVudE5vZGUudmFsID0geG1sRGF0YS5zdWJzdHIoY3VycmVudE5vZGUuc3RhcnRJbmRleCArIDEsIHRhZy5pbmRleCAtIGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggLSAxKVxuICAgICAgfVxuICAgICAgY3VycmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnQ7XG4gICAgfSBlbHNlIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNEQVRBKSB7XG4gICAgICBpZiAob3B0aW9ucy5jZGF0YVRhZ05hbWUpIHtcbiAgICAgICAgLy9hZGQgY2RhdGEgbm9kZVxuICAgICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmNkYXRhVGFnTmFtZSwgY3VycmVudE5vZGUsIHRhZ1szXSk7XG4gICAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgICAgICAvL2ZvciBiYWNrdHJhY2tpbmdcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgb3B0aW9ucy5jZGF0YVBvc2l0aW9uQ2hhcjtcbiAgICAgICAgLy9hZGQgcmVzdCB2YWx1ZSB0byBwYXJlbnQgbm9kZVxuICAgICAgICBpZiAodGFnWzE0XSkge1xuICAgICAgICAgIGN1cnJlbnROb2RlLnZhbCArPSBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gKGN1cnJlbnROb2RlLnZhbCB8fCAnJykgKyAodGFnWzNdIHx8ICcnKSArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5TRUxGKSB7XG4gICAgICBpZiAoY3VycmVudE5vZGUgJiYgdGFnWzE0XSkge1xuICAgICAgICBjdXJyZW50Tm9kZS52YWwgPSB1dGlsLmdldFZhbHVlKGN1cnJlbnROb2RlLnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSA/IHRhZ1s3XSA6IHRhZ1s1XSwgY3VycmVudE5vZGUsICcnKTtcbiAgICAgIGlmICh0YWdbOF0gJiYgdGFnWzhdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGFnWzhdID0gdGFnWzhdLnN1YnN0cigwLCB0YWdbOF0ubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vVGFnVHlwZS5PUEVOSU5HXG4gICAgICBjb25zdCBjaGlsZE5vZGUgPSBuZXcgeG1sTm9kZShcbiAgICAgICAgb3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sXG4gICAgICAgIGN1cnJlbnROb2RlLFxuICAgICAgICBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKVxuICAgICAgKTtcbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY2hpbGROb2RlLnRhZ25hbWUpKSB7XG4gICAgICAgIGNoaWxkTm9kZS5zdGFydEluZGV4PXRhZy5pbmRleCArIHRhZ1sxXS5sZW5ndGhcbiAgICAgIH1cbiAgICAgIGNoaWxkTm9kZS5hdHRyc01hcCA9IGJ1aWxkQXR0cmlidXRlc01hcCh0YWdbOF0sIG9wdGlvbnMpO1xuICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgIGN1cnJlbnROb2RlID0gY2hpbGROb2RlO1xuICAgIH1cblxuICAgIHRhZyA9IG5leHRUYWc7XG4gICAgbmV4dFRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIH1cblxuICByZXR1cm4geG1sT2JqO1xufTtcblxuZnVuY3Rpb24gcHJvY2Vzc1RhZ1ZhbHVlKHBhcnNlZFRhZ3MsIG9wdGlvbnMsIHBhcmVudFRhZ05hbWUpIHtcbiAgY29uc3QgdGFnTmFtZSA9IHBhcnNlZFRhZ3NbN10gfHwgcGFyZW50VGFnTmFtZTtcbiAgbGV0IHZhbCA9IHBhcnNlZFRhZ3NbMTRdO1xuICBpZiAodmFsKSB7XG4gICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgdmFsID0gdmFsLnRyaW0oKTtcbiAgICB9XG4gICAgdmFsID0gb3B0aW9ucy50YWdWYWx1ZVByb2Nlc3Nvcih2YWwsIHRhZ05hbWUpO1xuICAgIHZhbCA9IHBhcnNlVmFsdWUodmFsLCBvcHRpb25zLnBhcnNlTm9kZVZhbHVlLCBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHkpO1xuICB9XG5cbiAgcmV0dXJuIHZhbDtcbn1cblxuZnVuY3Rpb24gY2hlY2tGb3JUYWdUeXBlKG1hdGNoKSB7XG4gIGlmIChtYXRjaFs0XSA9PT0gJ11dPicpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DREFUQTtcbiAgfSBlbHNlIGlmIChtYXRjaFsxMF0gPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLkNMT1NJTkc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIG1hdGNoWzhdICE9PSAndW5kZWZpbmVkJyAmJiBtYXRjaFs4XS5zdWJzdHIobWF0Y2hbOF0ubGVuZ3RoIC0gMSkgPT09ICcvJykge1xuICAgIHJldHVybiBUYWdUeXBlLlNFTEY7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuT1BFTklORztcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlTmFtZVNwYWNlKHRhZ25hbWUsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlKSB7XG4gICAgY29uc3QgdGFncyA9IHRhZ25hbWUuc3BsaXQoJzonKTtcbiAgICBjb25zdCBwcmVmaXggPSB0YWduYW1lLmNoYXJBdCgwKSA9PT0gJy8nID8gJy8nIDogJyc7XG4gICAgaWYgKHRhZ3NbMF0gPT09ICd4bWxucycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgaWYgKHRhZ3MubGVuZ3RoID09PSAyKSB7XG4gICAgICB0YWduYW1lID0gcHJlZml4ICsgdGFnc1sxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhZ25hbWU7XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUodmFsLCBzaG91bGRQYXJzZSwgcGFyc2VUcnVlTnVtYmVyT25seSkge1xuICBpZiAoc2hvdWxkUGFyc2UgJiYgdHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBsZXQgcGFyc2VkO1xuICAgIGlmICh2YWwudHJpbSgpID09PSAnJyB8fCBpc05hTih2YWwpKSB7XG4gICAgICBwYXJzZWQgPSB2YWwgPT09ICd0cnVlJyA/IHRydWUgOiB2YWwgPT09ICdmYWxzZScgPyBmYWxzZSA6IHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHZhbC5pbmRleE9mKCcweCcpICE9PSAtMSkge1xuICAgICAgICAvL3N1cHBvcnQgaGV4YSBkZWNpbWFsXG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDE2KTtcbiAgICAgIH0gZWxzZSBpZiAodmFsLmluZGV4T2YoJy4nKSAhPT0gLTEpIHtcbiAgICAgICAgcGFyc2VkID0gTnVtYmVyLnBhcnNlRmxvYXQodmFsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUludCh2YWwsIDEwKTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJzZVRydWVOdW1iZXJPbmx5KSB7XG4gICAgICAgIHBhcnNlZCA9IFN0cmluZyhwYXJzZWQpID09PSB2YWwgPyBwYXJzZWQgOiB2YWw7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHV0aWwuaXNFeGlzdCh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG59XG5cbi8vVE9ETzogY2hhbmdlIHJlZ2V4IHRvIGNhcHR1cmUgTlNcbi8vY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cChcIihbXFxcXHdcXFxcLVxcXFwuXFxcXDpdKylcXFxccyo9XFxcXHMqKFsnXFxcIl0pKCgufFxcbikqPylcXFxcMlwiLFwiZ21cIik7XG5jb25zdCBhdHRyc1JlZ3ggPSBuZXcgUmVnRXhwKCcoW15cXFxccz1dKylcXFxccyooPVxcXFxzKihbXFwnXCJdKSguKj8pXFxcXDMpPycsICdnJyk7XG5cbmZ1bmN0aW9uIGJ1aWxkQXR0cmlidXRlc01hcChhdHRyU3RyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIHR5cGVvZiBhdHRyU3RyID09PSAnc3RyaW5nJykge1xuICAgIGF0dHJTdHIgPSBhdHRyU3RyLnJlcGxhY2UoL1xccj9cXG4vZywgJyAnKTtcbiAgICAvL2F0dHJTdHIgPSBhdHRyU3RyIHx8IGF0dHJTdHIudHJpbSgpO1xuXG4gICAgY29uc3QgbWF0Y2hlcyA9IHV0aWwuZ2V0QWxsTWF0Y2hlcyhhdHRyU3RyLCBhdHRyc1JlZ3gpO1xuICAgIGNvbnN0IGxlbiA9IG1hdGNoZXMubGVuZ3RoOyAvL2Rvbid0IG1ha2UgaXQgaW5saW5lXG4gICAgY29uc3QgYXR0cnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyTmFtZSA9IHJlc29sdmVOYW1lU3BhY2UobWF0Y2hlc1tpXVsxXSwgb3B0aW9ucyk7XG4gICAgICBpZiAoYXR0ck5hbWUubGVuZ3RoKSB7XG4gICAgICAgIGlmIChtYXRjaGVzW2ldWzRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy50cmltVmFsdWVzKSB7XG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gbWF0Y2hlc1tpXVs0XS50cmltKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1hdGNoZXNbaV1bNF0gPSBvcHRpb25zLmF0dHJWYWx1ZVByb2Nlc3NvcihtYXRjaGVzW2ldWzRdLCBhdHRyTmFtZSk7XG4gICAgICAgICAgYXR0cnNbb3B0aW9ucy5hdHRyaWJ1dGVOYW1lUHJlZml4ICsgYXR0ck5hbWVdID0gcGFyc2VWYWx1ZShcbiAgICAgICAgICAgIG1hdGNoZXNbaV1bNF0sXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlQXR0cmlidXRlVmFsdWUsXG4gICAgICAgICAgICBvcHRpb25zLnBhcnNlVHJ1ZU51bWJlck9ubHlcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWxsb3dCb29sZWFuQXR0cmlidXRlcykge1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFPYmplY3Qua2V5cyhhdHRycykubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvcHRpb25zLmF0dHJOb2RlTmFtZSkge1xuICAgICAgY29uc3QgYXR0ckNvbGxlY3Rpb24gPSB7fTtcbiAgICAgIGF0dHJDb2xsZWN0aW9uW29wdGlvbnMuYXR0ck5vZGVOYW1lXSA9IGF0dHJzO1xuICAgICAgcmV0dXJuIGF0dHJDb2xsZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gYXR0cnM7XG4gIH1cbn1cblxuZXhwb3J0cy5nZXRUcmF2ZXJzYWxPYmogPSBnZXRUcmF2ZXJzYWxPYmo7XG4iLCIvKlxuICogU2Nyb2xsZXJcbiAqIGh0dHA6Ly9naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyXG4gKlxuICogQ29weXJpZ2h0IDIwMTEsIFp5bmdhIEluYy5cbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXIvbWFzdGVyL01JVC1MSUNFTlNFLnR4dFxuICpcbiAqIEJhc2VkIG9uIHRoZSB3b3JrIG9mOiBVbmlmeSBQcm9qZWN0ICh1bmlmeS1wcm9qZWN0Lm9yZylcbiAqIGh0dHA6Ly91bmlmeS1wcm9qZWN0Lm9yZ1xuICogQ29weXJpZ2h0IDIwMTEsIERldXRzY2hlIFRlbGVrb20gQUdcbiAqIExpY2Vuc2U6IE1JVCArIEFwYWNoZSAoVjIpXG4gKi9cblxuLyoqXG4gKiBHZW5lcmljIGFuaW1hdGlvbiBjbGFzcyB3aXRoIHN1cHBvcnQgZm9yIGRyb3BwZWQgZnJhbWVzIGJvdGggb3B0aW9uYWwgZWFzaW5nIGFuZCBkdXJhdGlvbi5cbiAqXG4gKiBPcHRpb25hbCBkdXJhdGlvbiBpcyB1c2VmdWwgd2hlbiB0aGUgbGlmZXRpbWUgaXMgZGVmaW5lZCBieSBhbm90aGVyIGNvbmRpdGlvbiB0aGFuIHRpbWVcbiAqIGUuZy4gc3BlZWQgb2YgYW4gYW5pbWF0aW5nIG9iamVjdCwgZXRjLlxuICpcbiAqIERyb3BwZWQgZnJhbWUgbG9naWMgYWxsb3dzIHRvIGtlZXAgdXNpbmcgdGhlIHNhbWUgdXBkYXRlciBsb2dpYyBpbmRlcGVuZGVudCBmcm9tIHRoZSBhY3R1YWxcbiAqIHJlbmRlcmluZy4gVGhpcyBlYXNlcyBhIGxvdCBvZiBjYXNlcyB3aGVyZSBpdCBtaWdodCBiZSBwcmV0dHkgY29tcGxleCB0byBicmVhayBkb3duIGEgc3RhdGVcbiAqIGJhc2VkIG9uIHRoZSBwdXJlIHRpbWUgZGlmZmVyZW5jZS5cbiAqL1xuKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICAvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG4gICAgICAgIGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ29tbW9uSlNcbiAgICAgICAgZmFjdG9yeShleHBvcnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBCcm93c2VyIGdsb2JhbHNcbiAgICAgICAgZmFjdG9yeSgocm9vdC5hbmltYXRlID0ge30pKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgdmFyIGdsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gdGhpcyA6IHdpbmRvd1xuICAgIHZhciB0aW1lID0gRGF0ZS5ub3cgfHwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gK25ldyBEYXRlKCk7XG4gICAgfTtcbiAgICB2YXIgZGVzaXJlZEZyYW1lcyA9IDYwO1xuICAgIHZhciBtaWxsaXNlY29uZHNQZXJTZWNvbmQgPSAxMDAwO1xuICAgIHZhciBydW5uaW5nID0ge307XG4gICAgdmFyIGNvdW50ZXIgPSAxO1xuXG4gICAgLyoqXG4gICAgICogU3RvcHMgdGhlIGdpdmVuIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiB3YXMgc3RvcHBlZCAoYWthLCB3YXMgcnVubmluZyBiZWZvcmUpXG4gICAgICovXG4gICAgZXhwb3J0cy5zdG9wID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgIHZhciBjbGVhcmVkID0gKHJ1bm5pbmdbaWRdICE9PSBudWxsKTtcbiAgICAgICAgaWYgKGNsZWFyZWQpIHtcbiAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjbGVhcmVkO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFdoZXRoZXIgdGhlIGdpdmVuIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIGlkIHtJbnRlZ2VyfSBVbmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgYW5pbWF0aW9uIGlzIHN0aWxsIHJ1bm5pbmdcbiAgICAgKi9cbiAgICBleHBvcnRzLmlzUnVubmluZyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gcnVubmluZ1tpZF0gIT09IG51bGw7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogU3RhcnQgdGhlIGFuaW1hdGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBzdGVwQ2FsbGJhY2sge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGZ1bmN0aW9uIHdoaWNoIGlzIGV4ZWN1dGVkIG9uIGV2ZXJ5IHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKHBlcmNlbnQsIG5vdywgdmlydHVhbCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSB2ZXJpZnlDYWxsYmFjayB7RnVuY3Rpb259IEV4ZWN1dGVkIGJlZm9yZSBldmVyeSBhbmltYXRpb24gc3RlcC5cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oKSB7IHJldHVybiBjb250aW51ZVdpdGhBbmltYXRpb247IH1gXG4gICAgICogQHBhcmFtIGNvbXBsZXRlZENhbGxiYWNrIHtGdW5jdGlvbn1cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24oZHJvcHBlZEZyYW1lcywgZmluaXNoZWRBbmltYXRpb24sIG9wdGlvbmFsIHdhc0ZpbmlzaGVkKSB7fWBcbiAgICAgKiBAcGFyYW0gZHVyYXRpb24ge0ludGVnZXJ9IE1pbGxpc2Vjb25kcyB0byBydW4gdGhlIGFuaW1hdGlvblxuICAgICAqIEBwYXJhbSBlYXNpbmdNZXRob2Qge0Z1bmN0aW9ufSBQb2ludGVyIHRvIGVhc2luZyBmdW5jdGlvblxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50KSB7IHJldHVybiBtb2RpZmllZFZhbHVlOyB9YFxuICAgICAqIEBwYXJhbSByb290IHtFbGVtZW50fSBSZW5kZXIgcm9vdC4gVXNlZCBmb3IgaW50ZXJuYWwgdXNhZ2Ugb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lLlxuICAgICAqIEByZXR1cm4ge0ludGVnZXJ9IElkZW50aWZpZXIgb2YgYW5pbWF0aW9uLiBDYW4gYmUgdXNlZCB0byBzdG9wIGl0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RhcnQgPSBmdW5jdGlvbiAoc3RlcENhbGxiYWNrLCB2ZXJpZnlDYWxsYmFjaywgY29tcGxldGVkQ2FsbGJhY2ssIGR1cmF0aW9uLCBlYXNpbmdNZXRob2QsIHJvb3QpIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGltZSgpO1xuICAgICAgICB2YXIgbGFzdEZyYW1lID0gc3RhcnQ7XG4gICAgICAgIHZhciBwZXJjZW50ID0gMDtcbiAgICAgICAgdmFyIGRyb3BDb3VudGVyID0gMDtcbiAgICAgICAgdmFyIGlkID0gY291bnRlcisrO1xuXG4gICAgICAgIC8vIENvbXBhY3RpbmcgcnVubmluZyBkYiBhdXRvbWF0aWNhbGx5IGV2ZXJ5IGZldyBuZXcgYW5pbWF0aW9uc1xuICAgICAgICBpZiAoaWQgJSAyMCA9PT0gMCkge1xuICAgICAgICAgICAgdmFyIG5ld1J1bm5pbmcgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIHVzZWRJZCBpbiBydW5uaW5nKSB7XG4gICAgICAgICAgICAgICAgbmV3UnVubmluZ1t1c2VkSWRdID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bm5pbmcgPSBuZXdSdW5uaW5nO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgaW50ZXJuYWwgc3RlcCBtZXRob2Qgd2hpY2ggaXMgY2FsbGVkIGV2ZXJ5IGZldyBtaWxsaXNlY29uZHNcbiAgICAgICAgdmFyIHN0ZXAgPSBmdW5jdGlvbiAodmlydHVhbCkge1xuXG4gICAgICAgICAgICAvLyBOb3JtYWxpemUgdmlydHVhbCB2YWx1ZVxuICAgICAgICAgICAgdmFyIHJlbmRlciA9IHZpcnR1YWwgIT09IHRydWU7XG5cbiAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IHRpbWVcbiAgICAgICAgICAgIHZhciBub3cgPSB0aW1lKCk7XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBpcyBleGVjdXRlZCBiZWZvcmUgbmV4dCBhbmltYXRpb24gc3RlcFxuICAgICAgICAgICAgaWYgKCFydW5uaW5nW2lkXSB8fCAodmVyaWZ5Q2FsbGJhY2sgJiYgIXZlcmlmeUNhbGxiYWNrKGlkKSkpIHtcblxuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRm9yIHRoZSBjdXJyZW50IHJlbmRlcmluZyB0byBhcHBseSBsZXQncyB1cGRhdGUgb21pdHRlZCBzdGVwcyBpbiBtZW1vcnkuXG4gICAgICAgICAgICAvLyBUaGlzIGlzIGltcG9ydGFudCB0byBicmluZyBpbnRlcm5hbCBzdGF0ZSB2YXJpYWJsZXMgdXAtdG8tZGF0ZSB3aXRoIHByb2dyZXNzIGluIHRpbWUuXG4gICAgICAgICAgICBpZiAocmVuZGVyKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgZHJvcHBlZEZyYW1lcyA9IE1hdGgucm91bmQoKG5vdyAtIGxhc3RGcmFtZSkgLyAobWlsbGlzZWNvbmRzUGVyU2Vjb25kIC8gZGVzaXJlZEZyYW1lcykpIC0gMTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IE1hdGgubWluKGRyb3BwZWRGcmFtZXMsIDQpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgc3RlcCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZHJvcENvdW50ZXIrKztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ29tcHV0ZSBwZXJjZW50IHZhbHVlXG4gICAgICAgICAgICBpZiAoZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwZXJjZW50ID0gKG5vdyAtIHN0YXJ0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgICAgIGlmIChwZXJjZW50ID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwZXJjZW50ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgc3RlcCBjYWxsYmFjaywgdGhlbi4uLlxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZWFzaW5nTWV0aG9kID8gZWFzaW5nTWV0aG9kKHBlcmNlbnQpIDogcGVyY2VudDtcbiAgICAgICAgICAgIGlmICgoc3RlcENhbGxiYWNrKHZhbHVlLCBub3csIHJlbmRlcikgPT09IGZhbHNlIHx8IHBlcmNlbnQgPT09IDEpICYmIHJlbmRlcikge1xuICAgICAgICAgICAgICAgIHJ1bm5pbmdbaWRdID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb21wbGV0ZWRDYWxsYmFjayhkZXNpcmVkRnJhbWVzIC0gKGRyb3BDb3VudGVyIC8gKChub3cgLSBzdGFydCkgLyBtaWxsaXNlY29uZHNQZXJTZWNvbmQpKSwgaWQsIHBlcmNlbnQgPT09IDEgfHwgZHVyYXRpb24gPT09IHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlbmRlcikge1xuICAgICAgICAgICAgICAgIGxhc3RGcmFtZSA9IG5vdztcbiAgICAgICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoc3RlcCwgcm9vdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFyayBhcyBydW5uaW5nXG4gICAgICAgIHJ1bm5pbmdbaWRdID0gdHJ1ZTtcblxuICAgICAgICAvLyBJbml0IGZpcnN0IHN0ZXBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuXG4gICAgICAgIC8vIFJldHVybiB1bmlxdWUgYW5pbWF0aW9uIElEXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xufSkpO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5pbXBvcnQgYW5pbWF0ZSBmcm9tICcuL2FuaW1hdGUnO1xudmFyIE5PT1AgPSBmdW5jdGlvbiAoKSB7IH07XG5cbi8vIEVhc2luZyBFcXVhdGlvbnMgKGMpIDIwMDMgUm9iZXJ0IFBlbm5lciwgYWxsIHJpZ2h0cyByZXNlcnZlZC5cbi8vIE9wZW4gc291cmNlIHVuZGVyIHRoZSBCU0QgTGljZW5zZS5cblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIHJldHVybiAoTWF0aC5wb3coKHBvcyAtIDEpLCAzKSArIDEpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IHBvc2l0aW9uIGJldHdlZW4gMCAoc3RhcnQgb2YgZWZmZWN0KSBhbmQgMSAoZW5kIG9mIGVmZmVjdClcbiAqKi9cbnZhciBlYXNlSW5PdXRDdWJpYyA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgaWYgKChwb3MgLz0gMC41KSA8IDEpIHtcbiAgICByZXR1cm4gMC41ICogTWF0aC5wb3cocG9zLCAzKTtcbiAgfVxuXG4gIHJldHVybiAwLjUgKiAoTWF0aC5wb3coKHBvcyAtIDIpLCAzKSArIDIpO1xufTtcblxuXG4vKipcbiAqIEEgcHVyZSBsb2dpYyAnY29tcG9uZW50JyBmb3IgJ3ZpcnR1YWwnIHNjcm9sbGluZy96b29taW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JvbGxlciB7XG4gIGNvbnN0cnVjdG9yKGNhbGxiYWNrLCBvcHRpb25zKSB7XG4gICAgdGhpcy5fX2NhbGxiYWNrID0gY2FsbGJhY2s7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB4LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1g6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgc2Nyb2xsaW5nIG9uIHktYXhpcyAqL1xuICAgICAgc2Nyb2xsaW5nWTogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBhbmltYXRpb25zIGZvciBkZWNlbGVyYXRpb24sIHNuYXAgYmFjaywgem9vbWluZyBhbmQgc2Nyb2xsaW5nICovXG4gICAgICBhbmltYXRpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBkdXJhdGlvbiBmb3IgYW5pbWF0aW9ucyB0cmlnZ2VyZWQgYnkgc2Nyb2xsVG8vem9vbVRvICovXG4gICAgICBhbmltYXRpb25EdXJhdGlvbjogMjUwLFxuXG4gICAgICAvKiogRW5hYmxlIGJvdW5jaW5nIChjb250ZW50IGNhbiBiZSBzbG93bHkgbW92ZWQgb3V0c2lkZSBhbmQganVtcHMgYmFjayBhZnRlciByZWxlYXNpbmcpICovXG4gICAgICBib3VuY2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBsb2NraW5nIHRvIHRoZSBtYWluIGF4aXMgaWYgdXNlciBtb3ZlcyBvbmx5IHNsaWdodGx5IG9uIG9uZSBvZiB0aGVtIGF0IHN0YXJ0ICovXG4gICAgICBsb2NraW5nOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHBhZ2luYXRpb24gbW9kZSAoc3dpdGNoaW5nIGJldHdlZW4gZnVsbCBwYWdlIGNvbnRlbnQgcGFuZXMpICovXG4gICAgICBwYWdpbmc6IGZhbHNlLFxuXG4gICAgICAvKiogRW5hYmxlIHNuYXBwaW5nIG9mIGNvbnRlbnQgdG8gYSBjb25maWd1cmVkIHBpeGVsIGdyaWQgKi9cbiAgICAgIHNuYXBwaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSB6b29taW5nIG9mIGNvbnRlbnQgdmlhIEFQSSwgZmluZ2VycyBhbmQgbW91c2Ugd2hlZWwgKi9cbiAgICAgIHpvb21pbmc6IGZhbHNlLFxuXG4gICAgICAvKiogTWluaW11bSB6b29tIGxldmVsICovXG4gICAgICBtaW5ab29tOiAwLjUsXG5cbiAgICAgIC8qKiBNYXhpbXVtIHpvb20gbGV2ZWwgKi9cbiAgICAgIG1heFpvb206IDMsXG5cbiAgICAgIC8qKiBNdWx0aXBseSBvciBkZWNyZWFzZSBzY3JvbGxpbmcgc3BlZWQgKiovXG4gICAgICBzcGVlZE11bHRpcGxpZXI6IDEsXG5cbiAgICAgIC8qKiBDYWxsYmFjayB0aGF0IGlzIGZpcmVkIG9uIHRoZSBsYXRlciBvZiB0b3VjaCBlbmQgb3IgZGVjZWxlcmF0aW9uIGVuZCxcbiAgICAgICAgICBwcm92aWRlZCB0aGF0IGFub3RoZXIgc2Nyb2xsaW5nIGFjdGlvbiBoYXMgbm90IGJlZ3VuLiBVc2VkIHRvIGtub3dcbiAgICAgICAgICB3aGVuIHRvIGZhZGUgb3V0IGEgc2Nyb2xsYmFyLiAqL1xuICAgICAgc2Nyb2xsaW5nQ29tcGxldGU6IE5PT1AsXG5cbiAgICAgIC8qKiBUaGlzIGNvbmZpZ3VyZXMgdGhlIGFtb3VudCBvZiBjaGFuZ2UgYXBwbGllZCB0byBkZWNlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzICAqKi9cbiAgICAgIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uOiAwLjAzLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gYWNjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjogMC4wOFxuICAgIH07XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV07XG4gICAgfVxuICB9XG5cbiAgLypcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgSU5URVJOQUwgRklFTERTIDo6IFNUQVRVU1xuICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgb25seSBhIHNpbmdsZSBmaW5nZXIgaXMgdXNlZCBpbiB0b3VjaCBoYW5kbGluZyAqL1xuICBfX2lzU2luZ2xlVG91Y2ggPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSB0b3VjaCBldmVudCBzZXF1ZW5jZSBpcyBpbiBwcm9ncmVzcyAqL1xuICBfX2lzVHJhY2tpbmcgPSBmYWxzZTtcblxuICAvKioge0Jvb2xlYW59IFdoZXRoZXIgYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uIHdlbnQgdG8gY29tcGxldGlvbi4gKi9cbiAgX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciBhIGdlc3R1cmUgem9vbS9yb3RhdGUgZXZlbnQgaXMgaW4gcHJvZ3Jlc3MuIEFjdGl2YXRlcyB3aGVuXG4gICAqIGEgZ2VzdHVyZXN0YXJ0IGV2ZW50IGhhcHBlbnMuIFRoaXMgaGFzIGhpZ2hlciBwcmlvcml0eSB0aGFuIGRyYWdnaW5nLlxuICAgKi9cbiAgX19pc0dlc3R1cmluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gV2hldGhlciB0aGUgdXNlciBoYXMgbW92ZWQgYnkgc3VjaCBhIGRpc3RhbmNlIHRoYXQgd2UgaGF2ZSBlbmFibGVkXG4gICAqIGRyYWdnaW5nIG1vZGUuIEhpbnQgPSBJdCdzIG9ubHkgZW5hYmxlZCBhZnRlciBzb21lIHBpeGVscyBvZiBtb3ZlbWVudCB0O1xuICAgKiBub3QgaW50ZXJydXB0IHdpdGggY2xpY2tzIGV0Yy5cbiAgICovXG4gIF9faXNEcmFnZ2luZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gTm90IHRvdWNoaW5nIGFuZCBkcmFnZ2luZyBhbnltb3JlLCBhbmQgc21vb3RobHkgYW5pbWF0aW5nIHRoZVxuICAgKiB0b3VjaCBzZXF1ZW5jZSB1c2luZyBkZWNlbGVyYXRpb24uXG4gICAqL1xuICBfX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIHtCb29sZWFufSBTbW9vdGhseSBhbmltYXRpbmcgdGhlIGN1cnJlbnRseSBjb25maWd1cmVkIGNoYW5nZVxuICAgKi9cbiAgX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6OiBESU1FTlNJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBsZWZ0IGJvdW5kYXJ5ICovXG4gIF9fY2xpZW50TGVmdCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCByaWdodCBib3VuZGFyeSAqL1xuICBfX2NsaWVudFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCB3aWR0aCAqL1xuICBfX2NsaWVudFdpZHRoID0gMDtcblxuICAvKioge0ludGVnZXJ9IFZpZXdwb3J0IGhlaWdodCAqL1xuICBfX2NsaWVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyB3aWR0aCAqL1xuICBfX2NvbnRlbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBGdWxsIGNvbnRlbnQncyBoZWlnaHQgKi9cbiAgX19jb250ZW50SGVpZ2h0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIHdpZHRoIGZvciBjb250ZW50ICovXG4gIF9fc25hcFdpZHRoID0gMTAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0IGZvciBjb250ZW50ICovXG4gIF9fc25hcEhlaWdodCA9IDEwMDtcblxuICAvKioge051bWJlcn0gWm9vbSBsZXZlbCAqL1xuICBfX3pvb21MZXZlbCA9IDE7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19zY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge051bWJlcn0gU2Nyb2xsIHBvc2l0aW9uIG9uIHktYXhpcyAqL1xuICBfX3Njcm9sbFRvcCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGFsbG93ZWQgc2Nyb2xsIHBvc2l0aW9uIG9uIHgtYXhpcyAqL1xuICBfX21heFNjcm9sbExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCBsZWZ0IHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRMZWZ0ID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgdG9wIHBvc2l0aW9uIChmaW5hbCBwb3NpdGlvbiB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRUb3AgPSAwO1xuXG4gIC8qIHtOdW1iZXJ9IFNjaGVkdWxlZCB6b29tIGxldmVsIChmaW5hbCBzY2FsZSB3aGVuIGFuaW1hdGluZykgKi9cbiAgX19zY2hlZHVsZWRab29tID0gMDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogTEFTVCBQT1NJVElPTlNcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge051bWJlcn0gTGVmdCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hMZWZ0ID0gbnVsbDtcblxuICAvKioge051bWJlcn0gVG9wIHBvc2l0aW9uIG9mIGZpbmdlciBhdCBzdGFydCAqL1xuICBfX2xhc3RUb3VjaFRvcCA9IG51bGw7XG5cbiAgLyoqIHtEYXRlfSBUaW1lc3RhbXAgb2YgbGFzdCBtb3ZlIG9mIGZpbmdlci4gVXNlZCB0byBsaW1pdCB0cmFja2luZyByYW5nZSBmb3IgZGVjZWxlcmF0aW9uIHNwZWVkLiAqL1xuICBfX2xhc3RUb3VjaE1vdmUgPSBudWxsO1xuXG4gIC8qKiB7QXJyYXl9IExpc3Qgb2YgcG9zaXRpb25zLCB1c2VzIHRocmVlIGluZGV4ZXMgZm9yIGVhY2ggc3RhdGUgPSBsZWZ0LCB0b3AsIHRpbWVzdGFtcCAqO1xuICBfX3Bvc2l0aW9ucyA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDogPSBERUNFTEVSQVRJT04gU1VQUE9SO1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNaW5pbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIGxlZnQgc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gbnVsbDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gdG9wIHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gbnVsbDtcblxuICAvKioge051bWJlcn0gQ3VycmVudCBmYWN0b3IgdG8gbW9kaWZ5IGhvcml6b250YWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSB2ZXJ0aWNhbCBzY3JvbGwgcG9zaXRpb24gd2l0aCBvbiBldmVyeSBzdGVwICovXG4gIF9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gbnVsbDtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQVUJMSUMgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGNsaWVudCAob3V0ZXIpIGFuZCBjb250ZW50IChpbm5lcikgZWxlbWVudHMuXG4gICAqIFJlcXVpcmVzIHRoZSBhdmFpbGFibGUgc3BhY2UgZm9yIHRoZSBvdXRlciBlbGVtZW50IGFuZCB0aGUgb3V0ZXIgc2l6ZSBvZiB0aGUgaW5uZXIgZWxlbWVudC5cbiAgICogQWxsIHZhbHVlcyB3aGljaCBhcmUgZmFsc3kgKG51bGwgb3IgemVybyBldGMuKSBhcmUgaWdub3JlZCBhbmQgdGhlIG9sZCB2YWx1ZSBpcyBrZXB0LlxuICAgKlxuICAgKiBAcGFyYW0gY2xpZW50V2lkdGgge0ludGVnZXIgPyBudWxsfSBJbm5lciB3aWR0aCBvZiBvdXRlciBlbGVtZW50XG4gICAqIEBwYXJhbSBjbGllbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBJbm5lciBoZWlnaHQgb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gT3V0ZXIgd2lkdGggb2YgaW5uZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY29udGVudEhlaWdodCB7SW50ZWdlciA/IG51bGx9IE91dGVyIGhlaWdodCBvZiBpbm5lciBlbGVtZW50XG4gICAqL1xuICBzZXREaW1lbnNpb25zKGNsaWVudFdpZHRoLCBjbGllbnRIZWlnaHQsIGNvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodCkge1xuICAgIC8vIE9ubHkgdXBkYXRlIHZhbHVlcyB3aGljaCBhcmUgZGVmaW5lZFxuICAgIGlmIChjbGllbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudFdpZHRoID0gY2xpZW50V2lkdGg7XG4gICAgfVxuXG4gICAgaWYgKGNsaWVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NsaWVudEhlaWdodCA9IGNsaWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFdpZHRoICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudFdpZHRoID0gY29udGVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50SGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9fY29udGVudEhlaWdodCA9IGNvbnRlbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8gUmVmcmVzaCBtYXhpbXVtc1xuICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG5cbiAgICAvLyBSZWZyZXNoIHNjcm9sbCBwb3NpdGlvblxuICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRydWUpO1xuICB9XG5cblxuICAvKipcbiAgICogU2V0cyB0aGUgY2xpZW50IGNvb3JkaW5hdGVzIGluIHJlbGF0aW9uIHRvIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge0ludGVnZXIgPyAwfSBMZWZ0IHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIHRvcCB7SW50ZWdlciA/IDB9IFRvcCBwb3NpdGlvbiBvZiBvdXRlciBlbGVtZW50XG4gICAqL1xuICBzZXRQb3NpdGlvbihsZWZ0LCB0b3ApIHtcbiAgICB0aGlzLl9fY2xpZW50TGVmdCA9IGxlZnQgfHwgMDtcbiAgICB0aGlzLl9fY2xpZW50VG9wID0gdG9wIHx8IDA7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBzbmFwcGluZyAod2hlbiBzbmFwcGluZyBpcyBhY3RpdmUpXG4gICAqXG4gICAqIEBwYXJhbSB3aWR0aCB7SW50ZWdlcn0gU25hcHBpbmcgd2lkdGhcbiAgICogQHBhcmFtIGhlaWdodCB7SW50ZWdlcn0gU25hcHBpbmcgaGVpZ2h0XG4gICAqL1xuICBzZXRTbmFwU2l6ZSh3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5fX3NuYXBXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuX19zbmFwSGVpZ2h0ID0gaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZyB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIHNjcm9sbCBwb3NpdGlvbiBhbmQgYHpvb21gIGxldmVsXG4gICAqL1xuICBnZXRWYWx1ZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuX19zY3JvbGxMZWZ0LFxuICAgICAgdG9wOiB0aGlzLl9fc2Nyb2xsVG9wLFxuICAgICAgcmlnaHQ6IHRoaXMuX19zY3JvbGxMZWZ0ICsgdGhpcy5fX2NsaWVudFdpZHRoIC8gdGhpcy5fX3pvb21MZXZlbCxcbiAgICAgIGJvdHRvbTogdGhpcy5fX3Njcm9sbFRvcCArIHRoaXMuX19jbGllbnRIZWlnaHQgLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgem9vbTogdGhpcy5fX3pvb21MZXZlbFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBHZXQgcG9pbnQgaW4gaW4gY29udGVudCBzcGFjZSBmcm9tIHNjcm9sbCBjb29yZGluYXRlcy5cbiAgICovXG4gIGdldFBvaW50KHNjcm9sbExlZnQsIHNjcm9sbFRvcCkge1xuICAgIHZhciB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHNjcm9sbExlZnQgLyB2YWx1ZXMuem9vbSxcbiAgICAgIHRvcDogc2Nyb2xsVG9wIC8gdmFsdWVzLnpvb21cbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWF4aW11bSBzY3JvbGwgdmFsdWVzXG4gICAqXG4gICAqIEByZXR1cm4ge01hcH0gYGxlZnRgIGFuZCBgdG9wYCBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICovXG4gIGdldFNjcm9sbE1heCgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX21heFNjcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19tYXhTY3JvbGxUb3BcbiAgICB9O1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdG8gdGhlIGdpdmVuIGxldmVsLiBTdXBwb3J0cyBvcHRpb25hbCBhbmltYXRpb24uIFpvb21zXG4gICAqIHRoZSBjZW50ZXIgd2hlbiBubyBjb29yZGluYXRlcyBhcmUgZ2l2ZW4uXG4gICAqXG4gICAqIEBwYXJhbSBsZXZlbCB7TnVtYmVyfSBMZXZlbCB0byB6b29tIHRvXG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuID8gZmFsc2V9IFdoZXRoZXIgdG8gdXNlIGFuaW1hdGlvblxuICAgKiBAcGFyYW0gZml4ZWRMZWZ0IHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyBsZWZ0IGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBmaXhlZFRvcCB7TnVtYmVyID8gdW5kZWZpbmVkfSBTdGF0aW9uYXJ5IHBvaW50J3MgdG9wIGNvb3JkaW5hdGUgKHZlY3RvciBpbiBjbGllbnQgc3BhY2UpXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbVRvKGxldmVsLCBpc0FuaW1hdGVkLCBmaXhlZExlZnQsIGZpeGVkVG9wLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgIH1cblxuICAgIC8vIEFkZCBjYWxsYmFjayBpZiBleGlzdHNcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBjYWxsYmFjaztcbiAgICB9XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIG9sZExldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIE5vcm1hbGl6ZSBmaXhlZCBwb2ludCB0byBjZW50ZXIgb2Ygdmlld3BvcnQgaWYgbm90IGRlZmluZWRcbiAgICBpZiAoZml4ZWRMZWZ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkTGVmdCA9IHRoaXMuX19jbGllbnRXaWR0aCAvIDI7XG4gICAgfVxuXG4gICAgaWYgKGZpeGVkVG9wID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGZpeGVkVG9wID0gdGhpcy5fX2NsaWVudEhlaWdodCAvIDI7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgIC8vIFJlY29tcHV0ZSBtYXhpbXVtIHZhbHVlcyB3aGlsZSB0ZW1wb3JhcnkgdHdlYWtpbmcgbWF4aW11bSBzY3JvbGwgcmFuZ2VzXG4gICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgobGV2ZWwpO1xuXG4gICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBzY3JvbGwgcG9zaXRpb25zIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsLlxuICAgIC8vIENob29zaW5nIHRoZSBuZXcgdmlld3BvcnQgc28gdGhhdCB0aGUgb3JpZ2luJ3MgcG9zaXRpb24gcmVtYWluc1xuICAgIC8vIGZpeGVkLCB3ZSBoYXZlIGNlbnRyYWwgZGlsYXRpb24gYWJvdXQgdGhlIG9yaWdpbi5cbiAgICAvLyAqIEZpeGVkIHBvaW50LCAkRiQsIHJlbWFpbnMgc3RhdGlvbmFyeSBpbiBjb250ZW50IHNwYWNlIGFuZCBpbiB0aGVcbiAgICAvLyB2aWV3cG9ydC5cbiAgICAvLyAqIEluaXRpYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19pJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEZpbmFsIHNjcm9sbCBwb3NpdGlvbiwgJFNfZiQsIGluIGNvbnRlbnQgc3BhY2UuXG4gICAgLy8gKiBJbml0aWFsIHNjYWxpbmcgZmFjdG9yLCAka19pJC5cbiAgICAvLyAqIEZpbmFsIHNjYWxpbmcgZmFjdG9yLCAka19mJC5cbiAgICAvL1xuICAgIC8vICogJFNfaSBcXG1hcHN0byBTX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kgPSAoU19mIC0gRikga19mJC5cbiAgICAvLyAqICQoU19pIC0gRikga19pL2tfZiA9IChTX2YgLSBGKSQuXG4gICAgLy8gKiAkU19mID0gRiArIChTX2kgLSBGKSBrX2kva19mJC5cbiAgICAvL1xuICAgIC8vIEZpeGVkIHBvaW50IGxvY2F0aW9uLCAkXFx2ZWN0b3J7Zn0gPSAoRiAtIFNfaSkga19pJC5cbiAgICAvLyAqICRGID0gU19pICsgXFx2ZWN0b3J7Zn0va19pJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgKyAoU19pIC0gU19pIC0gXFx2ZWN0b3J7Zn0va19pKSBrX2kva19mJC5cbiAgICAvLyAqICRTX2YgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kgLSBcXHZlY3RvcntmfS9rX2YkLlxuICAgIC8vICogJFNfZiBrX2YgPSBTX2kga19mICsgKGtfZi9rX2kgLSAxKVxcdmVjdG9ye2Z9JC5cbiAgICAvLyAqICRTX2Yga19mID0gKGtfZi9rX2kpKFNfaSBrX2kpICsgKGtfZi9rX2kgLSAxKSBcXHZlY3RvcntmfSQuXG4gICAgdmFyIGsgPSBsZXZlbCAvIG9sZExldmVsO1xuICAgIHZhciBsZWZ0ID0gayAqICh0aGlzLl9fc2Nyb2xsTGVmdCArIGZpeGVkTGVmdCkgLSBmaXhlZExlZnQ7XG4gICAgdmFyIHRvcCA9IGsgKiAodGhpcy5fX3Njcm9sbFRvcCArIGZpeGVkVG9wKSAtIGZpeGVkVG9wO1xuXG4gICAgLy8gTGltaXQgeC1heGlzXG4gICAgaWYgKGxlZnQgPiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSBpZiAobGVmdCA8IDApIHtcbiAgICAgIGxlZnQgPSAwO1xuICAgIH1cblxuICAgIC8vIExpbWl0IHktYXhpc1xuICAgIGlmICh0b3AgPiB0aGlzLl9fbWF4U2Nyb2xsVG9wKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9XG5cbiAgICAvLyBQdXNoIHZhbHVlcyBvdXRcbiAgICB0aGlzLl9fcHVibGlzaChsZWZ0LCB0b3AsIGxldmVsLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFpvb21zIHRoZSBjb250ZW50IGJ5IHRoZSBnaXZlbiBmYWN0b3IuXG4gICAqXG4gICAqIEBwYXJhbSBmYWN0b3Ige051bWJlcn0gWm9vbSBieSBnaXZlbiBmYWN0b3JcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBvcmlnaW5MZWZ0IHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIGxlZnQgY29vcmRpbmF0ZVxuICAgKiBAcGFyYW0gb3JpZ2luVG9wIHtOdW1iZXIgPyAwfSBab29tIGluIGF0IGdpdmVuIHRvcCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb24gPyBudWxsfSBBIGNhbGxiYWNrIHRoYXQgZ2V0cyBmaXJlZCB3aGVuIHRoZSB6b29tIGlzIGNvbXBsZXRlLlxuICAgKi9cbiAgem9vbUJ5KGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjaykge1xuICAgIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBmYWN0b3IsIGlzQW5pbWF0ZWQsIG9yaWdpbkxlZnQsIG9yaWdpblRvcCwgY2FsbGJhY2spO1xuICB9XG5cblxuICAvKipcbiAgICogU2Nyb2xscyB0byB0aGUgZ2l2ZW4gcG9zaXRpb24uIFJlc3BlY3QgbGltaXRhdGlvbnMgYW5kIHNuYXBwaW5nIGF1dG9tYXRpY2FsbHkuXG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXI/bnVsbH0gSG9yaXpvbnRhbCBzY3JvbGwgcG9zaXRpb24sIGtlZXBzIGN1cnJlbnQgaWYgdmFsdWUgaXMgPGNvZGU+bnVsbDwvY29kZT5cbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyP251bGx9IFZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciB0aGUgc2Nyb2xsaW5nIHNob3VsZCBoYXBwZW4gdXNpbmcgYW4gYW5pbWF0aW9uXG4gICAqIEBwYXJhbSB6b29tIHtOdW1iZXJ9IFsxLjBdIFpvb20gbGV2ZWwgdG8gZ28gdG9cbiAgICovXG4gIHNjcm9sbFRvKGxlZnQsIHRvcCwgaXNBbmltYXRlZCwgem9vbSkge1xuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBDb3JyZWN0IGNvb3JkaW5hdGVzIGJhc2VkIG9uIG5ldyB6b29tIGxldmVsXG4gICAgaWYgKHpvb20gIT09IHVuZGVmaW5lZCAmJiB6b29tICE9PSB0aGlzLl9fem9vbUxldmVsKSB7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlpvb21pbmcgaXMgbm90IGVuYWJsZWQhXCIpO1xuICAgICAgfVxuXG4gICAgICBsZWZ0ICo9IHpvb207XG4gICAgICB0b3AgKj0gem9vbTtcblxuICAgICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KHpvb20pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBLZWVwIHpvb20gd2hlbiBub3QgZGVmaW5lZFxuICAgICAgem9vbSA9IHRoaXMuX196b29tTGV2ZWw7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCkge1xuICAgICAgbGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICBsZWZ0ID0gTWF0aC5yb3VuZChsZWZ0IC8gdGhpcy5fX2NsaWVudFdpZHRoKSAqIHRoaXMuX19jbGllbnRXaWR0aDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fc25hcFdpZHRoKSAqIHRoaXMuX19zbmFwV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSkge1xuICAgICAgdG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgICAgdG9wID0gTWF0aC5yb3VuZCh0b3AgLyB0aGlzLl9fY2xpZW50SGVpZ2h0KSAqIHRoaXMuX19jbGllbnRIZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zbmFwcGluZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19zbmFwSGVpZ2h0KSAqIHRoaXMuX19zbmFwSGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIExpbWl0IGZvciBhbGxvd2VkIHJhbmdlc1xuICAgIGxlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4U2Nyb2xsTGVmdCwgbGVmdCksIDApO1xuICAgIHRvcCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxUb3AsIHRvcCksIDApO1xuXG4gICAgLy8gRG9uJ3QgYW5pbWF0ZSB3aGVuIG5vIGNoYW5nZSBkZXRlY3RlZCwgc3RpbGwgY2FsbCBwdWJsaXNoIHRvIG1ha2Ugc3VyZVxuICAgIC8vIHRoYXQgcmVuZGVyZWQgcG9zaXRpb24gaXMgcmVhbGx5IGluLXN5bmMgd2l0aCBpbnRlcm5hbCBkYXRhXG4gICAgaWYgKGxlZnQgPT09IHRoaXMuX19zY3JvbGxMZWZ0ICYmIHRvcCA9PT0gdGhpcy5fX3Njcm9sbFRvcCkge1xuICAgICAgaXNBbmltYXRlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFB1Ymxpc2ggbmV3IHZhbHVlc1xuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGwgYnkgdGhlIGdpdmVuIG9mZnNldFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIHRvcCB7TnVtYmVyID8gMH0gU2Nyb2xsIHgtYXhpcyBieSBnaXZlbiBvZmZzZXRcbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byBhbmltYXRlIHRoZSBnaXZlbiBjaGFuZ2VcbiAgICovXG4gIHNjcm9sbEJ5KGxlZnQsIHRvcCwgaXNBbmltYXRlZCkge1xuICAgIHZhciBzdGFydExlZnQgPSB0aGlzLl9faXNBbmltYXRpbmcgPyB0aGlzLl9fc2NoZWR1bGVkTGVmdCA6IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgIHZhciBzdGFydFRvcCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRUb3AgOiB0aGlzLl9fc2Nyb2xsVG9wO1xuXG4gICAgdGhpcy5zY3JvbGxUbyhzdGFydExlZnQgKyAobGVmdCB8fCAwKSwgc3RhcnRUb3AgKyAodG9wIHx8IDApLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBFVkVOVCBDQUxMQkFDS1NcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogTW91c2Ugd2hlZWwgaGFuZGxlciBmb3Igem9vbWluZyBzdXBwb3J0XG4gICAqL1xuICBkb01vdXNlWm9vbSh3aGVlbERlbHRhLCB0aW1lU3RhbXAsIHBhZ2VYLCBwYWdlWSkge1xuICAgIHZhciBjaGFuZ2UgPSB3aGVlbERlbHRhID4gMCA/IDAuOTcgOiAxLjAzO1xuXG4gICAgcmV0dXJuIHRoaXMuem9vbVRvKHRoaXMuX196b29tTGV2ZWwgKiBjaGFuZ2UsIGZhbHNlLCBwYWdlWCAtIHRoaXMuX19jbGllbnRMZWZ0LCBwYWdlWSAtIHRoaXMuX19jbGllbnRUb3ApO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggc3RhcnQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hTdGFydCh0b3VjaGVzLCB0aW1lU3RhbXApIHtcbiAgICAvLyBBcnJheS1saWtlIGNoZWNrIGlzIGVub3VnaCBoZXJlXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdG91Y2ggbGlzdDogXCIgKyB0b3VjaGVzKTtcbiAgICB9XG5cbiAgICBpZiAodGltZVN0YW1wIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgdGltZVN0YW1wID0gdGltZVN0YW1wLnZhbHVlT2YoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aW1lU3RhbXAgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdGltZXN0YW1wIHZhbHVlOiBcIiArIHRpbWVTdGFtcCk7XG4gICAgfVxuXG4gICAgLy8gUmVzZXQgaW50ZXJydXB0ZWRBbmltYXRpb24gZmxhZ1xuICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG5cbiAgICAvLyBTdG9wIGRlY2VsZXJhdGlvblxuICAgIGlmICh0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh0aGlzLl9faXNEZWNlbGVyYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIFN0b3AgYW5pbWF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gVXNlIGNlbnRlciBwb2ludCB3aGVuIGRlYWxpbmcgd2l0aCB0d28gZmluZ2Vyc1xuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG4gICAgdmFyIGlzU2luZ2xlVG91Y2ggPSB0b3VjaGVzLmxlbmd0aCA9PT0gMTtcbiAgICBpZiAoaXNTaW5nbGVUb3VjaCkge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IHRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSB0b3VjaGVzWzBdLnBhZ2VZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfVxuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBwb3NpdGlvbnNcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2luaXRpYWxUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcblxuICAgIC8vIFN0b3JlIGN1cnJlbnQgem9vbSBsZXZlbFxuICAgIHRoaXMuX196b29tTGV2ZWxTdGFydCA9IHRoaXMuX196b29tTGV2ZWw7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHRvdWNoIHBvc2l0aW9uc1xuICAgIHRoaXMuX19sYXN0VG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgaW5pdGlhbCBtb3ZlIHRpbWUgc3RhbXBcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcblxuICAgIC8vIFJlc2V0IGluaXRpYWwgc2NhbGVcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gMTtcblxuICAgIC8vIFJlc2V0IGxvY2tpbmcgZmxhZ3NcbiAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9ICFpc1NpbmdsZVRvdWNoICYmIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYO1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxZID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1k7XG5cbiAgICAvLyBSZXNldCB0cmFja2luZyBmbGFnXG4gICAgdGhpcy5fX2lzVHJhY2tpbmcgPSB0cnVlO1xuXG4gICAgLy8gUmVzZXQgZGVjZWxlcmF0aW9uIGNvbXBsZXRlIGZsYWdcbiAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAgIC8vIERyYWdnaW5nIHN0YXJ0cyBkaXJlY3RseSB3aXRoIHR3byBmaW5nZXJzLCBvdGhlcndpc2UgbGF6eSB3aXRoIGFuIG9mZnNldFxuICAgIHRoaXMuX19pc0RyYWdnaW5nID0gIWlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBTb21lIGZlYXR1cmVzIGFyZSBkaXNhYmxlZCBpbiBtdWx0aSB0b3VjaCBzY2VuYXJpb3NcbiAgICB0aGlzLl9faXNTaW5nbGVUb3VjaCA9IGlzU2luZ2xlVG91Y2g7XG5cbiAgICAvLyBDbGVhcmluZyBkYXRhIHN0cnVjdHVyZVxuICAgIHRoaXMuX19wb3NpdGlvbnMgPSBbXTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRvdWNoIG1vdmUgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFsxLjBdIHNjYWxlIC0gLi4uLlxuICAgKi9cbiAgZG9Ub3VjaE1vdmUodG91Y2hlcywgdGltZVN0YW1wLCBzY2FsZSkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAoZXZlbnQgbWlnaHQgYmUgb3V0c2lkZSBvZiBlbGVtZW50KVxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRvdWNoTGVmdCwgY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gQ29tcHV0ZSBtb3ZlIGJhc2VkIGFyb3VuZCBvZiBjZW50ZXIgb2YgZmluZ2Vyc1xuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgY3VycmVudFRvdWNoTGVmdCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVggKyB0b3VjaGVzWzFdLnBhZ2VYKSAvIDI7XG4gICAgICBjdXJyZW50VG91Y2hUb3AgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VZICsgdG91Y2hlc1sxXS5wYWdlWSkgLyAyO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfVxuXG4gICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG5cbiAgICAvLyBBcmUgd2UgYWxyZWFkeSBpcyBkcmFnZ2luZyBtb2RlP1xuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gQ29tcHV0ZSBtb3ZlIGRpc3RhbmNlXG4gICAgICB2YXIgbW92ZVggPSBjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2xhc3RUb3VjaExlZnQ7XG4gICAgICB2YXIgbW92ZVkgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fbGFzdFRvdWNoVG9wO1xuXG4gICAgICAvLyBSZWFkIHByZXZpb3VzIHNjcm9sbCBwb3NpdGlvbiBhbmQgem9vbWluZ1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIGxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgLy8gV29yayB3aXRoIHNjYWxpbmdcbiAgICAgIGlmIChzY2FsZSAhPT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgIHZhciBvbGRMZXZlbCA9IGxldmVsO1xuXG4gICAgICAgIC8vIFJlY29tcHV0ZSBsZXZlbCBiYXNlZCBvbiBwcmV2aW91cyBzY2FsZSBhbmQgbmV3IHNjYWxlXG4gICAgICAgIGxldmVsID0gbGV2ZWwgLyB0aGlzLl9fbGFzdFNjYWxlICogc2NhbGU7XG5cbiAgICAgICAgLy8gTGltaXQgbGV2ZWwgYWNjb3JkaW5nIHRvIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgbGV2ZWwgPSBNYXRoLm1heChNYXRoLm1pbihsZXZlbCwgdGhpcy5vcHRpb25zLm1heFpvb20pLCB0aGlzLm9wdGlvbnMubWluWm9vbSk7XG5cbiAgICAgICAgLy8gT25seSBkbyBmdXJ0aGVyIGNvbXB1dGlvbiB3aGVuIGNoYW5nZSBoYXBwZW5lZFxuICAgICAgICBpZiAob2xkTGV2ZWwgIT09IGxldmVsKSB7XG4gICAgICAgICAgLy8gQ29tcHV0ZSByZWxhdGl2ZSBldmVudCBwb3NpdGlvbiB0byBjb250YWluZXJcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoTGVmdFJlbCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fY2xpZW50TGVmdDtcbiAgICAgICAgICB2YXIgY3VycmVudFRvdWNoVG9wUmVsID0gY3VycmVudFRvdWNoVG9wIC0gdGhpcy5fX2NsaWVudFRvcDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBsZWZ0IGFuZCB0b3AgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICAgICAgICBzY3JvbGxMZWZ0ID0gKChjdXJyZW50VG91Y2hMZWZ0UmVsICsgc2Nyb2xsTGVmdCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaExlZnRSZWw7XG4gICAgICAgICAgc2Nyb2xsVG9wID0gKChjdXJyZW50VG91Y2hUb3BSZWwgKyBzY3JvbGxUb3ApICogbGV2ZWwgLyBvbGRMZXZlbCkgLSBjdXJyZW50VG91Y2hUb3BSZWw7XG5cbiAgICAgICAgICAvLyBSZWNvbXB1dGUgbWF4IHNjcm9sbCB2YWx1ZXNcbiAgICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxYKSB7XG4gICAgICAgIHNjcm9sbExlZnQgLT0gbW92ZVggKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyO1xuICAgICAgICB2YXIgbWF4U2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuXG4gICAgICAgIGlmIChzY3JvbGxMZWZ0ID4gbWF4U2Nyb2xsTGVmdCB8fCBzY3JvbGxMZWZ0IDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ICs9IChtb3ZlWCAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0KSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gbWF4U2Nyb2xsTGVmdDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2Nyb2xsTGVmdCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENvbXB1dGUgbmV3IHZlcnRpY2FsIHNjcm9sbCBwb3NpdGlvblxuICAgICAgaWYgKHRoaXMuX19lbmFibGVTY3JvbGxZKSB7XG4gICAgICAgIHNjcm9sbFRvcCAtPSBtb3ZlWSAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG1vdmVZKVxuICAgICAgICB2YXIgbWF4U2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcblxuICAgICAgICBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wIHx8IHNjcm9sbFRvcCA8IDApIHtcbiAgICAgICAgICAvLyBTbG93IGRvd24gb24gdGhlIGVkZ2VzXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgICAgICAgc2Nyb2xsVG9wICs9IChtb3ZlWSAvIDIgKiB0aGlzLm9wdGlvbnMuc3BlZWRNdWx0aXBsaWVyKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IG1heFNjcm9sbFRvcCkge1xuICAgICAgICAgICAgc2Nyb2xsVG9wID0gbWF4U2Nyb2xsVG9wO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBLZWVwIGxpc3QgZnJvbSBncm93aW5nIGluZmluaXRlbHkgKGhvbGRpbmcgbWluIDEwLCBtYXggMjAgbWVhc3VyZSBwb2ludHMpXG4gICAgICBpZiAocG9zaXRpb25zLmxlbmd0aCA+IDYwKSB7XG4gICAgICAgIHBvc2l0aW9ucy5zcGxpY2UoMCwgMzApO1xuICAgICAgfVxuXG4gICAgICAvLyBUcmFjayBzY3JvbGwgbW92ZW1lbnQgZm9yIGRlY2xlcmF0aW9uXG4gICAgICBwb3NpdGlvbnMucHVzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIHRpbWVTdGFtcCk7XG5cbiAgICAgIC8vIFN5bmMgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICB0aGlzLl9fcHVibGlzaChzY3JvbGxMZWZ0LCBzY3JvbGxUb3AsIGxldmVsKTtcblxuICAgICAgLy8gT3RoZXJ3aXNlIGZpZ3VyZSBvdXQgd2hldGhlciB3ZSBhcmUgc3dpdGNoaW5nIGludG8gZHJhZ2dpbmcgbW9kZSBub3cuXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGwgPSB0aGlzLm9wdGlvbnMubG9ja2luZyA/IDMgOiAwO1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvckRyYWcgPSA1O1xuXG4gICAgICB2YXIgZGlzdGFuY2VYID0gTWF0aC5hYnMoY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0KTtcbiAgICAgIHZhciBkaXN0YW5jZVkgPSBNYXRoLmFicyhjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9faW5pdGlhbFRvdWNoVG9wKTtcblxuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFggPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWCAmJiBkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuICAgICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWSAmJiBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yU2Nyb2xsO1xuXG4gICAgICBwb3NpdGlvbnMucHVzaCh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAodGhpcy5fX2VuYWJsZVNjcm9sbFggfHwgdGhpcy5fX2VuYWJsZVNjcm9sbFkpICYmIChkaXN0YW5jZVggPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyB8fCBkaXN0YW5jZVkgPj0gbWluaW11bVRyYWNraW5nRm9yRHJhZyk7XG4gICAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxhc3QgdG91Y2ggcG9zaXRpb25zIGFuZCB0aW1lIHN0YW1wIGZvciBuZXh0IGV2ZW50XG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG4gICAgdGhpcy5fX2xhc3RUb3VjaE1vdmUgPSB0aW1lU3RhbXA7XG4gICAgdGhpcy5fX2xhc3RTY2FsZSA9IHNjYWxlO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggZW5kIGhhbmRsZXIgZm9yIHNjcm9sbGluZyBzdXBwb3J0XG4gICAqL1xuICBkb1RvdWNoRW5kKHRpbWVTdGFtcCkge1xuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBJZ25vcmUgZXZlbnQgd2hlbiB0cmFja2luZyBpcyBub3QgZW5hYmxlZCAobm8gdG91Y2hzdGFydCBldmVudCBvbiBlbGVtZW50KVxuICAgIC8vIFRoaXMgaXMgcmVxdWlyZWQgYXMgdGhpcyBsaXN0ZW5lciAoJ3RvdWNobW92ZScpIHNpdHMgb24gdGhlIGRvY3VtZW50IGFuZCBub3Qgb24gdGhlIGVsZW1lbnQgaXRzZWxmLlxuICAgIGlmICghdGhpcy5fX2lzVHJhY2tpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBOb3QgdG91Y2hpbmcgYW55bW9yZSAod2hlbiB0d28gZmluZ2VyIGhpdCB0aGUgc2NyZWVuIHRoZXJlIGFyZSB0d28gdG91Y2ggZW5kIGV2ZW50cylcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IGZhbHNlO1xuXG4gICAgLy8gQmUgc3VyZSB0byByZXNldCB0aGUgZHJhZ2dpbmcgZmxhZyBub3cuIEhlcmUgd2UgYWxzbyBkZXRlY3Qgd2hldGhlclxuICAgIC8vIHRoZSBmaW5nZXIgaGFzIG1vdmVkIGZhc3QgZW5vdWdoIHRvIHN3aXRjaCBpbnRvIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbi5cbiAgICBpZiAodGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgIC8vIFJlc2V0IGRyYWdnaW5nIGZsYWdcbiAgICAgIHRoaXMuX19pc0RyYWdnaW5nID0gZmFsc2U7XG5cbiAgICAgIC8vIFN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgLy8gVmVyaWZ5IHRoYXQgdGhlIGxhc3QgbW92ZSBkZXRlY3RlZCB3YXMgaW4gc29tZSByZWxldmFudCB0aW1lIGZyYW1lXG4gICAgICBpZiAodGhpcy5fX2lzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZyAmJiAodGltZVN0YW1wIC0gdGhpcy5fX2xhc3RUb3VjaE1vdmUpIDw9IDEwMCkge1xuICAgICAgICAvLyBUaGVuIGZpZ3VyZSBvdXQgd2hhdCB0aGUgc2Nyb2xsIHBvc2l0aW9uIHdhcyBhYm91dCAxMDBtcyBhZ29cbiAgICAgICAgdmFyIHBvc2l0aW9ucyA9IHRoaXMuX19wb3NpdGlvbnM7XG4gICAgICAgIHZhciBlbmRQb3MgPSBwb3NpdGlvbnMubGVuZ3RoIC0gMTtcbiAgICAgICAgdmFyIHN0YXJ0UG9zID0gZW5kUG9zO1xuXG4gICAgICAgIC8vIE1vdmUgcG9pbnRlciB0byBwb3NpdGlvbiBtZWFzdXJlZCAxMDBtcyBhZ29cbiAgICAgICAgZm9yICh2YXIgaSA9IGVuZFBvczsgaSA+IDAgJiYgcG9zaXRpb25zW2ldID4gKHRoaXMuX19sYXN0VG91Y2hNb3ZlIC0gMTAwKTsgaSAtPSAzKSB7XG4gICAgICAgICAgc3RhcnRQb3MgPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgc3RhcnQgYW5kIHN0b3AgcG9zaXRpb24gaXMgaWRlbnRpY2FsIGluIGEgMTAwbXMgdGltZWZyYW1lLFxuICAgICAgICAvLyB3ZSBjYW5ub3QgY29tcHV0ZSBhbnkgdXNlZnVsIGRlY2VsZXJhdGlvbi5cbiAgICAgICAgaWYgKHN0YXJ0UG9zICE9PSBlbmRQb3MpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIG1vdmVtZW50IGJldHdlZW4gdGhlc2UgdHdvIHBvaW50c1xuICAgICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gcG9zaXRpb25zW2VuZFBvc10gLSBwb3NpdGlvbnNbc3RhcnRQb3NdO1xuICAgICAgICAgIHZhciBtb3ZlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDJdO1xuICAgICAgICAgIHZhciBtb3ZlZFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgLSBwb3NpdGlvbnNbc3RhcnRQb3MgLSAxXTtcblxuICAgICAgICAgIC8vIEJhc2VkIG9uIDUwbXMgY29tcHV0ZSB0aGUgbW92ZW1lbnQgdG8gYXBwbHkgZm9yIGVhY2ggcmVuZGVyIHN0ZXBcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gbW92ZWRMZWZ0IC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBtb3ZlZFRvcCAvIHRpbWVPZmZzZXQgKiAoMTAwMCAvIDYwKTtcblxuICAgICAgICAgIC8vIEhvdyBtdWNoIHZlbG9jaXR5IGlzIHJlcXVpcmVkIHRvIHN0YXJ0IHRoZSBkZWNlbGVyYXRpb25cbiAgICAgICAgICB2YXIgbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uID0gdGhpcy5vcHRpb25zLnBhZ2luZyB8fCB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMTtcblxuICAgICAgICAgIC8vIFZlcmlmeSB0aGF0IHdlIGhhdmUgZW5vdWdoIHZlbG9jaXR5IHRvIHN0YXJ0IGRlY2VsZXJhdGlvblxuICAgICAgICAgIGlmIChNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbiB8fCBNYXRoLmFicyh0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZKSA+IG1pblZlbG9jaXR5VG9TdGFydERlY2VsZXJhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5fX3N0YXJ0RGVjZWxlcmF0aW9uKHRpbWVTdGFtcCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPiAxMDApIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSWYgdGhpcyB3YXMgYSBzbG93ZXIgbW92ZSBpdCBpcyBwZXIgZGVmYXVsdCBub24gZGVjZWxlcmF0ZWQsIGJ1dCB0aGlzXG4gICAgLy8gc3RpbGwgbWVhbnMgdGhhdCB3ZSB3YW50IHNuYXAgYmFjayB0byB0aGUgYm91bmRzIHdoaWNoIGlzIGRvbmUgaGVyZS5cbiAgICAvLyBUaGlzIGlzIHBsYWNlZCBvdXRzaWRlIHRoZSBjb25kaXRpb24gYWJvdmUgdG8gaW1wcm92ZSBlZGdlIGNhc2Ugc3RhYmlsaXR5XG4gICAgLy8gZS5nLiB0b3VjaGVuZCBmaXJlZCB3aXRob3V0IGVuYWJsZWQgZHJhZ2dpbmcuIFRoaXMgc2hvdWxkIG5vcm1hbGx5IGRvIG5vdFxuICAgIC8vIGhhdmUgbW9kaWZpZWQgdGhlIHNjcm9sbCBwb3NpdGlvbnMgb3IgZXZlbiBzaG93ZWQgdGhlIHNjcm9sbGJhcnMgdGhvdWdoLlxuICAgIGlmICghdGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBpZiAodGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uIHx8IHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5zY3JvbGxUbyh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdHJ1ZSwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfVxuXG4gICAgLy8gRnVsbHkgY2xlYW51cCBsaXN0XG4gICAgdGhpcy5fX3Bvc2l0aW9ucy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBQUklWQVRFIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBzY3JvbGwgcG9zaXRpb24gdG8gdGhlIGNvbnRlbnQgZWxlbWVudFxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7TnVtYmVyfSBMZWZ0IHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXJ9IFRvcCBzY3JvbGwgcG9zaXRpb25cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgYW5pbWF0aW9uIHNob3VsZCBiZSB1c2VkIHRvIG1vdmUgdG8gdGhlIG5ldyBjb29yZGluYXRlc1xuICAgKi9cbiAgX19wdWJsaXNoKGxlZnQsIHRvcCwgem9vbSwgaXNBbmltYXRlZCkge1xuICAgIC8vIFJlbWVtYmVyIHdoZXRoZXIgd2UgaGFkIGFuIGFuaW1hdGlvbiwgdGhlbiB3ZSB0cnkgdG8gY29udGludWVcbiAgICAvLyBiYXNlZCBvbiB0aGUgY3VycmVudCBcImRyaXZlXCIgb2YgdGhlIGFuaW1hdGlvbi5cbiAgICB2YXIgd2FzQW5pbWF0aW5nID0gdGhpcy5fX2lzQW5pbWF0aW5nO1xuICAgIGlmICh3YXNBbmltYXRpbmcpIHtcbiAgICAgIGFuaW1hdGUuc3RvcCh3YXNBbmltYXRpbmcpO1xuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGlzQW5pbWF0ZWQgJiYgdGhpcy5vcHRpb25zLmFuaW1hdGluZykge1xuICAgICAgLy8gS2VlcCBzY2hlZHVsZWQgcG9zaXRpb25zIGZvciBzY3JvbGxCeS96b29tQnkgZnVuY3Rpb25hbGl0eS5cbiAgICAgIHRoaXMuX19zY2hlZHVsZWRMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0b3A7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkWm9vbSA9IHpvb207XG5cbiAgICAgIHZhciBvbGRMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgICB2YXIgb2xkVG9wID0gdGhpcy5fX3Njcm9sbFRvcDtcbiAgICAgIHZhciBvbGRab29tID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgICAgdmFyIGRpZmZMZWZ0ID0gbGVmdCAtIG9sZExlZnQ7XG4gICAgICB2YXIgZGlmZlRvcCA9IHRvcCAtIG9sZFRvcDtcbiAgICAgIHZhciBkaWZmWm9vbSA9IHpvb20gLSBvbGRab29tO1xuXG4gICAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgICBpZiAocmVuZGVyKSB7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBvbGRMZWZ0ICsgKGRpZmZMZWZ0ICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IG9sZFRvcCArIChkaWZmVG9wICogcGVyY2VudCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21MZXZlbCA9IG9sZFpvb20gKyAoZGlmZlpvb20gKiBwZXJjZW50KTtcblxuICAgICAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgICAgIGlmICh0aGlzLl9fY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuX19jYWxsYmFjayh0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciB2ZXJpZnkgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pc0FuaW1hdGluZyA9PT0gaWQ7XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgICBpZiAoYW5pbWF0aW9uSWQgPT09IHRoaXMuX19pc0FuaW1hdGluZykge1xuICAgICAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgfHwgd2FzRmluaXNoZWQpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KCk7XG4gICAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgICAvLyBXaGVuIGNvbnRpbnVpbmcgYmFzZWQgb24gcHJldmlvdXMgYW5pbWF0aW9uIHdlIGNob29zZSBhbiBlYXNlLW91dCBhbmltYXRpb24gaW5zdGVhZCBvZiBlYXNlLWluLW91dFxuICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gYW5pbWF0ZS5zdGFydChzdGVwLCB2ZXJpZnksIGNvbXBsZXRlZCwgdGhpcy5vcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uLCB3YXNBbmltYXRpbmcgPyBlYXNlT3V0Q3ViaWMgOiBlYXNlSW5PdXRDdWJpYyk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gdGhpcy5fX3pvb21MZXZlbCA9IHpvb207XG5cbiAgICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICB0aGlzLl9fY2FsbGJhY2sobGVmdCwgdG9wLCB6b29tKTtcbiAgICAgIH1cblxuICAgICAgLy8gRml4IG1heCBzY3JvbGwgcmFuZ2VzXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgaWYgKHRoaXMuX196b29tQ29tcGxldGUpIHtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlKCk7XG4gICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZWNvbXB1dGVzIHNjcm9sbCBtaW5pbXVtIHZhbHVlcyBiYXNlZCBvbiBjbGllbnQgZGltZW5zaW9ucyBhbmQgY29udGVudCBkaW1lbnNpb25zLlxuICAgKi9cbiAgX19jb21wdXRlU2Nyb2xsTWF4KHpvb21MZXZlbCkge1xuICAgIGlmICh6b29tTGV2ZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgem9vbUxldmVsID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICB0aGlzLl9fbWF4U2Nyb2xsTGVmdCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50V2lkdGggKiB6b29tTGV2ZWwgLSB0aGlzLl9fY2xpZW50V2lkdGgsIDApO1xuICAgIHRoaXMuX19tYXhTY3JvbGxUb3AgPSBNYXRoLm1heCh0aGlzLl9fY29udGVudEhlaWdodCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRIZWlnaHQsIDApO1xuICB9XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgQU5JTUFUSU9OIChERUNFTEVSQVRJT04pIFNVUFBPUlRcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gYSB0b3VjaCBzZXF1ZW5jZSBlbmQgYW5kIHRoZSBzcGVlZCBvZiB0aGUgZmluZ2VyIHdhcyBoaWdoIGVub3VnaFxuICAgKiB0byBzd2l0Y2ggaW50byBkZWNlbGVyYXRpb24gbW9kZS5cbiAgICovXG4gIF9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0ID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19tYXhTY3JvbGxMZWZ0KSwgMCk7XG4gICAgICB2YXIgc2Nyb2xsVG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX3Njcm9sbFRvcCwgdGhpcy5fX21heFNjcm9sbFRvcCksIDApO1xuICAgICAgdmFyIGNsaWVudFdpZHRoID0gdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgdmFyIGNsaWVudEhlaWdodCA9IHRoaXMuX19jbGllbnRIZWlnaHQ7XG5cbiAgICAgIC8vIFdlIGxpbWl0IGRlY2VsZXJhdGlvbiBub3QgdG8gdGhlIG1pbi9tYXggdmFsdWVzIG9mIHRoZSBhbGxvd2VkIHJhbmdlLCBidXQgdG8gdGhlIHNpemUgb2YgdGhlIHZpc2libGUgY2xpZW50IGFyZWEuXG4gICAgICAvLyBFYWNoIHBhZ2Ugc2hvdWxkIGhhdmUgZXhhY3RseSB0aGUgc2l6ZSBvZiB0aGUgY2xpZW50IGFyZWEuXG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IE1hdGguZmxvb3Ioc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguZmxvb3Ioc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5jZWlsKHNjcm9sbExlZnQgLyBjbGllbnRXaWR0aCkgKiBjbGllbnRXaWR0aDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBNYXRoLmNlaWwoc2Nyb2xsVG9wIC8gY2xpZW50SGVpZ2h0KSAqIGNsaWVudEhlaWdodDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSAwO1xuICAgICAgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCA9IDA7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IHRoaXMuX19tYXhTY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfVxuXG4gICAgLy8gV3JhcCBjbGFzcyBtZXRob2RcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uIChwZXJjZW50LCBub3csIHJlbmRlcikge1xuICAgICAgdGhpcy5fX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcik7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8ga2VlcCB0aGUgZGVjZWxlcmF0aW9uIHJ1bm5pbmdcbiAgICB2YXIgbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgPSB0aGlzLm9wdGlvbnMuc25hcHBpbmcgPyA0IDogMC4xO1xuXG4gICAgLy8gRGV0ZWN0IHdoZXRoZXIgaXQncyBzdGlsbCB3b3J0aCB0byBjb250aW51ZSBhbmltYXRpbmcgc3RlcHNcbiAgICAvLyBJZiB3ZSBhcmUgYWxyZWFkeSBzbG93IGVub3VnaCB0byBub3QgYmVpbmcgdXNlciBwZXJjZWl2YWJsZSBhbnltb3JlLCB3ZSBzdG9wIHRoZSB3aG9sZSBwcm9jZXNzIGhlcmUuXG4gICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzaG91bGRDb250aW51ZSA9IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID49IG1pblZlbG9jaXR5VG9LZWVwRGVjZWxlcmF0aW5nO1xuICAgICAgaWYgKCFzaG91bGRDb250aW51ZSkge1xuICAgICAgICB0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNob3VsZENvbnRpbnVlO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIHZhciBjb21wbGV0ZWQgPSBmdW5jdGlvbiAocmVuZGVyZWRGcmFtZXNQZXJTZWNvbmQsIGFuaW1hdGlvbklkLCB3YXNGaW5pc2hlZCkge1xuICAgICAgdGhpcy5fX2lzRGVjZWxlcmF0aW5nID0gZmFsc2U7XG4gICAgICBpZiAodGhpcy5fX2RpZERlY2VsZXJhdGlvbkNvbXBsZXRlKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBbmltYXRlIHRvIGdyaWQgd2hlbiBzbmFwcGluZyBpcyBhY3RpdmUsIG90aGVyd2lzZSBqdXN0IGZpeCBvdXQtb2YtYm91bmRhcnkgcG9zaXRpb25zXG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLm9wdGlvbnMuc25hcHBpbmcpO1xuICAgIH0uYmluZCh0aGlzKTtcblxuICAgIC8vIFN0YXJ0IGFuaW1hdGlvbiBhbmQgc3dpdGNoIG9uIGZsYWdcbiAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBldmVyeSBzdGVwIG9mIHRoZSBhbmltYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGluTWVtb3J5IHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRvIG5vdCByZW5kZXIgdGhlIGN1cnJlbnQgc3RlcCwgYnV0IGtlZXAgaXQgaW4gbWVtb3J5IG9ubHkuIFVzZWQgaW50ZXJuYWxseSBvbmx5IVxuICAgKi9cbiAgX19zdGVwVGhyb3VnaERlY2VsZXJhdGlvbihyZW5kZXIpIHtcblxuICAgIC8vXG4gICAgLy8gQ09NUFVURSBORVhUIFNDUk9MTCBQT1NJVElPTlxuICAgIC8vXG5cbiAgICAvLyBBZGQgZGVjZWxlcmF0aW9uIHRvIHNjcm9sbCBwb3NpdGlvblxuICAgIHZhciBzY3JvbGxMZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYO1xuICAgIHZhciBzY3JvbGxUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WTtcblxuXG4gICAgLy9cbiAgICAvLyBIQVJEIExJTUlUIFNDUk9MTCBQT1NJVElPTiBGT1IgTk9OIEJPVU5DSU5HIE1PREVcbiAgICAvL1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgIHZhciBzY3JvbGxMZWZ0Rml4ZWQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCwgc2Nyb2xsTGVmdCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KTtcbiAgICAgIGlmIChzY3JvbGxMZWZ0Rml4ZWQgIT09IHNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCA9IHNjcm9sbExlZnRGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IDA7XG4gICAgICB9XG5cbiAgICAgIHZhciBzY3JvbGxUb3BGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AsIHNjcm9sbFRvcCksIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3ApO1xuICAgICAgaWYgKHNjcm9sbFRvcEZpeGVkICE9PSBzY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsVG9wID0gc2Nyb2xsVG9wRml4ZWQ7XG4gICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSAwO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgLy9cbiAgICAvLyBVUERBVEUgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIGlmIChyZW5kZXIpIHtcbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGhpcy5fX3pvb21MZXZlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX19zY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgIHRoaXMuX19zY3JvbGxUb3AgPSBzY3JvbGxUb3A7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFNMT1cgRE9XTlxuICAgIC8vXG5cbiAgICAvLyBTbG93IGRvd24gdmVsb2NpdHkgb24gZXZlcnkgaXRlcmF0aW9uXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAvLyBUaGlzIGlzIHRoZSBmYWN0b3IgYXBwbGllZCB0byBldmVyeSBpdGVyYXRpb24gb2YgdGhlIGFuaW1hdGlvblxuICAgICAgLy8gdG8gc2xvdyBkb3duIHRoZSBwcm9jZXNzLiBUaGlzIHNob3VsZCBlbXVsYXRlIG5hdHVyYWwgYmVoYXZpb3Igd2hlcmVcbiAgICAgIC8vIG9iamVjdHMgc2xvdyBkb3duIHdoZW4gdGhlIGluaXRpYXRvciBvZiB0aGUgbW92ZW1lbnQgaXMgcmVtb3ZlZFxuICAgICAgdmFyIGZyaWN0aW9uRmFjdG9yID0gMC45NTtcblxuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKj0gZnJpY3Rpb25GYWN0b3I7XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIEJPVU5DSU5HIFNVUFBPUlRcbiAgICAvL1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVYID0gMDtcbiAgICAgIHZhciBzY3JvbGxPdXRzaWRlWSA9IDA7XG5cbiAgICAgIC8vIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGRlY2VsZXJhdGlvbi9hY2NlbGVyYXRpb24gd2hlbiByZWFjaGluZyBib3VuZGFyaWVzXG4gICAgICB2YXIgcGVuZXRyYXRpb25EZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICB2YXIgcGVuZXRyYXRpb25BY2NlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG5cbiAgICAgIC8vIENoZWNrIGxpbWl0c1xuICAgICAgaWYgKHNjcm9sbExlZnQgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWCA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0IC0gc2Nyb2xsTGVmdDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsVG9wIDwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9IGVsc2UgaWYgKHNjcm9sbFRvcCA+IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3ApIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVkgPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wIC0gc2Nyb2xsVG9wO1xuICAgICAgfVxuXG4gICAgICAvLyBTbG93IGRvd24gdW50aWwgc2xvdyBlbm91Z2gsIHRoZW4gZmxpcCBiYWNrIHRvIHNuYXAgcG9zaXRpb25cbiAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAhPT0gMCkge1xuICAgICAgICBpZiAoc2Nyb2xsT3V0c2lkZVggKiB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYIDw9IDApIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICs9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25EZWNlbGVyYXRpb247XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCA9IHNjcm9sbE91dHNpZGVYICogcGVuZXRyYXRpb25BY2NlbGVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWSAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgKz0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZID0gc2Nyb2xsT3V0c2lkZVkgKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgJy4vZW52JztcbmltcG9ydCBFbGVtZW50IGZyb20gJy4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgUG9vbCBmcm9tICcuL2NvbW1vbi9wb29sJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IGNvbXB1dGVMYXlvdXQgZnJvbSAnY3NzLWxheW91dCc7XG5pbXBvcnQgeyBpc0NsaWNrLCBTVEFURSwgY2xlYXJDYW52YXMsIGlzR2FtZVRvdWNoRXZlbnQgfSBmcm9tICcuL2NvbW1vbi91dGlsJztcbmltcG9ydCBwYXJzZXIgZnJvbSAnLi9saWJzL2Zhc3QteG1sLXBhcnNlci9wYXJzZXIuanMnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi9jb21tb24vYml0TWFwRm9udCc7XG5pbXBvcnQgRGVidWdJbmZvIGZyb20gJy4vY29tbW9uL2RlYnVnSW5mbyc7XG5pbXBvcnQgVGlja2VyLCB7IHNoYXJlZFRpY2tlciB9IGZyb20gJy4vY29tbW9uL3RpY2tlcic7XG5pbXBvcnQgeyBjcmVhdGUsIHJlbmRlckNoaWxkcmVuLCBsYXlvdXRDaGlsZHJlbiwgcmVwYWludENoaWxkcmVuLCBpdGVyYXRlVHJlZSwgY2xvbmUsIHJlZ2lzdGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21tb24vdmQnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi9jb21tb24vcmVjdCc7XG5pbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vY29tbW9uL2ltYWdlTWFuYWdlcic7XG5pbXBvcnQgeyBWaWV3LCBUZXh0LCBJbWFnZSwgU2Nyb2xsVmlldywgQml0TWFwVGV4dCwgQ2FudmFzIH0gZnJvbSAnLi9jb21wb25lbnRzJztcbmltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBHYW1lVG91Y2gsIEdhbWVUb3VjaEV2ZW50LCBDYWxsYmFjayB9IGZyb20gJy4vdHlwZXMvaW5kZXgnO1xuXG4vLyDlhajlsYDkuovku7bnrqHpgZNcbmV4cG9ydCBjb25zdCBFRSA9IG5ldyBUaW55RW1pdHRlcigpO1xuY29uc3QgaW1nUG9vbCA9IG5ldyBQb29sKCdpbWdQb29sJyk7XG5jb25zdCBiaXRNYXBQb29sID0gbmV3IFBvb2woJ2JpdE1hcFBvb2wnKTtcbmNvbnN0IGRlYnVnSW5mbyA9IG5ldyBEZWJ1Z0luZm8oKTtcblxuaW50ZXJmYWNlIElWaWV3UG9ydCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgSVZpZXdQb3J0Qm94IHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIHg6IG51bWJlcjtcbiAgeTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRIYW5kbGVyRGF0YSB7XG4gIGhhc0V2ZW50QmluZDogYm9vbGVhbjtcbiAgdG91Y2hNc2c6IHtcbiAgICBba2V5OiBzdHJpbmddOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoO1xuICB9O1xuICBoYW5kbGVyczoge1xuICAgIHRvdWNoU3RhcnQ6IChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHZvaWQ7XG4gICAgdG91Y2hNb3ZlOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoRW5kOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoQ2FuY2VsOiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgSVBsdWdpbjxUPiB7XG4gIG5hbWU6IHN0cmluZztcbiAgaW5zdGFsbDogKGFwcDogVCwgLi4ub3B0aW9uczogYW55W10pID0+IHZvaWQ7XG4gIHVuaW5zdGFsbD86IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xufVxuXG5jbGFzcyBMYXlvdXQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOW9k+WJjSBMYXlvdXQg54mI5pys77yM5LiA6Iis6Lef5bCP5ri45oiP5o+S5Lu254mI5pys5a+56b2QXG4gICAqL1xuICBwdWJsaWMgdmVyc2lvbiA9ICcxLjAuMyc7XG4gIFxuICAvKipcbiAgICogTGF5b3V0IOa4suafk+eahOebruagh+eUu+W4g+WvueW6lOeahCAyZCBjb250ZXh0XG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQ29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbCA9IG51bGw7XG4gIHB1YmxpYyByZW5kZXJwb3J0OiBJVmlld1BvcnQgPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICB9O1xuICBwdWJsaWMgdmlld3BvcnQ6IElWaWV3UG9ydEJveCA9IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gICAgeDogMCxcbiAgICB5OiAwLFxuICB9O1xuXG4gIC8qKlxuICAgKiDnlLvluIPlsLrlr7jlkozlrp7pmYXooqvmuLLmn5PliLDlsY/luZXnmoTniannkIblsLrlr7jmr5RcbiAgICovXG4gIHB1YmxpYyB2aWV3cG9ydFNjYWxlID0gMTtcbiAgLyoqXG4gICAqIOeUqOS6juagh+ivhnVwZGF0ZVZpZXdQb3J05pa55rOV5piv5ZCm6KKr6LCD55So6L+H5LqG77yM6L+Z5Zyo5bCP5ri45oiP546v5aKD6Z2e5bi46YeN6KaBXG4gICAqL1xuICBwdWJsaWMgaGFzVmlld1BvcnRTZXQgPSBmYWxzZTtcblxuICAvKipcbiAgICog5pyA57uI5riy5p+T5Yiw5bGP5bmV55qE5bem5LiK6KeS54mp55CG5Z2Q5qCHXG4gICAqL1xuICBwdWJsaWMgcmVhbExheW91dEJveDoge1xuICAgIHJlYWxYOiBudW1iZXI7XG4gICAgcmVhbFk6IG51bWJlcjtcbiAgfSA9IHtcbiAgICAgIHJlYWxYOiAwLFxuICAgICAgcmVhbFk6IDAsXG4gICAgfTtcblxuICBwdWJsaWMgYml0TWFwRm9udHM6IEJpdE1hcEZvbnRbXSA9IFtdO1xuICBwdWJsaWMgZWxlQ291bnQgPSAwO1xuICBwdWJsaWMgc3RhdGU6IFNUQVRFID0gU1RBVEUuVU5JTklUO1xuXG4gIC8qKlxuICAgKiDnlKjkuo7lnKggdGlja2VyIOeahOW+queOr+mHjOmdouagh+ivhuW9k+WJjeW4p+aYr+WQpumcgOimgemHjee7mFxuICAgKiDph43nu5jkuIDoiKzmmK/lm77niYfliqDovb3lrozmiJDjgIHmloflrZfkv67mlLnnrYnlnLrmma9cbiAgICovXG4gIHB1YmxpYyBpc05lZWRSZXBhaW50ID0gZmFsc2U7XG4gIC8vIHB1YmxpYyB0aWNrZXI6IFRpY2tlciA9IG5ldyBUaWNrZXIoKTtcbiAgcHVibGljIHRpY2tlcjogVGlja2VyID0gc2hhcmVkVGlja2VyO1xuICBwdWJsaWMgdGlja2VyRnVuYyA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5pc0RpcnR5KSB7XG4gICAgICB0aGlzLnJlZmxvdygpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc05lZWRSZXBhaW50KSB7XG4gICAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICB9XG4gIH07XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJEYXRhOiBFdmVudEhhbmRsZXJEYXRhO1xuXG4gIGNvbnN0cnVjdG9yKHtcbiAgICBzdHlsZSxcbiAgfToge1xuICAgIHN0eWxlPzogSVN0eWxlO1xuICAgIG5hbWU/OiBzdHJpbmc7XG4gIH0pIHtcbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICAgIGlkOiAwLFxuICAgIH0pO1xuXG4gICAgdGhpcy5ldmVudEhhbmRsZXJEYXRhID0ge1xuICAgICAgaGFzRXZlbnRCaW5kOiBmYWxzZSxcbiAgICAgIHRvdWNoTXNnOiB7fSxcbiAgICAgIGhhbmRsZXJzOiB7XG4gICAgICAgIHRvdWNoU3RhcnQ6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaHN0YXJ0JyksXG4gICAgICAgIHRvdWNoTW92ZTogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNobW92ZScpLFxuICAgICAgICB0b3VjaEVuZDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoZW5kJyksXG4gICAgICAgIHRvdWNoQ2FuY2VsOiB0aGlzLmV2ZW50SGFuZGxlcigndG91Y2hjYW5jZWwnKSxcbiAgICAgIH0sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOWvueS6juS4jeS8muW9seWTjeW4g+WxgOeahOaUueWKqO+8jOavlOWmguWbvueJh+WPquaYr+aUueS4quWcsOWdgOOAgeWKoOS4quiDjOaZr+iJsuS5i+exu+eahOaUueWKqO+8jOS8muinpuWPkSBMYXlvdXQg55qEIHJlcGFpbnQg5pON5L2cXG4gICAgICog6Kem5Y+R55qE5pa55byP5piv57uZIExheW91dCDmipvkuKogYHJlcGFpbnRgIOeahOS6i+S7tu+8jOS4uuS6huaAp+iDve+8jOavj+asoeaOpeaUtuWIsCByZXBhaW50IOivt+axguS4jeS8muaJp+ihjOecn+ato+eahOa4suafk1xuICAgICAqIOiAjOaYr+aJp+ihjOS4gOS4que9ruiEj+aTjeS9nO+8jHRpY2tlciDmr4/kuIDmrKHmiafooYwgdXBkYXRlIOS8muajgOafpei/meS4quagh+iusOS9je+8jOi/m+iAjOaJp+ihjOecn+ato+eahOmHjee7mOaTjeS9nFxuICAgICAqL1xuICAgIHRoaXMub24oJ3JlcGFpbnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSB0cnVlO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICog5bCGIFR3ZWVuIOaMgui9veWIsCBMYXlvdXTvvIzlr7nkuo4gVHdlZW4g55qE5L2/55So5a6M5YWo6YG15b6qIFR3ZWVuLmpzIOeahOaWh+aho1xuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS90d2VlbmpzL3R3ZWVuLmpzL1xuICAgICAqIOWPquS4jei/h+W9kyBUd2VlbiDmlLnliqjkuoboioLngrnkvJrop6blj5EgcmVwYWludOOAgXJlZmxvdyDnmoTlsZ7mgKfml7bvvIxMYXlvdXQg5Lya5omn6KGM55u45bqU55qE5pON5L2cXG4gICAgICog5Lia5Yqh5L6n5LiN55So5oSf55+l5YiwIHJlcGFpbnQg5ZKMIHJlZmxvd1xuICAgICAqL1xuICAgIC8vIHRoaXMuVFdFRU4gPSBUV0VFTjtcbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0gdiR7dGhpcy52ZXJzaW9ufWApO1xuICB9XG5cbiAgLy8g5LiO6ICB54mI5pys5YW85a65XG4gIGdldCBkZWJ1Z0luZm8oKSB7XG4gICAgbGV0IGluZm8gPSBkZWJ1Z0luZm8ubG9nKCk7XG5cbiAgICBpbmZvICs9IGBlbGVtZW50Q291bnQ6ICR7dGhpcy5lbGVDb3VudH1cXG5gO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH1cblxuICAvKipcbiAgICog5pu05paw6KKr57uY5Yi2Y2FudmFz55qE56qX5Y+j5L+h5oGv77yM5pys5riy5p+T5byV5pOO5bm25LiN5YWz5b+D5piv5ZCm5Lya5ZKM5YW25LuW5ri45oiP5byV5pOO5YWx5ZCM5L2/55SoXG4gICAqIOiAjOacrOi6q+WPiOmcgOimgeaUr+aMgeS6i+S7tuWkhOeQhu+8jOWboOatpO+8jOWmguaenOiiq+a4suafk+WGheWuueaYr+e7mOWItuWIsOemu+Wxj2NhbnZhc++8jOmcgOimgeWwhuacgOe7iOe7mOWItuWcqOWxj+W5leS4ilxuICAgKiDnmoTnu53lr7nlsLrlr7jlkozkvY3nva7kv6Hmga/mm7TmlrDliLDmnKzmuLLmn5PlvJXmk47jgIJcbiAgICog5YW25Lit77yMd2lkdGjkuLrniannkIblg4/ntKDlrr3luqbvvIxoZWlnaHTkuLrniannkIblg4/ntKDpq5jluqbvvIx45Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgeOWdkOagh++8jHnkuLrot53nprvlsY/luZXlt6bkuIrop5LnmoTniannkIblg4/ntKBcbiAgICogeeWdkOagh1xuICAgKi9cbiAgdXBkYXRlVmlld1BvcnQoYm94OiBJVmlld1BvcnRCb3gpIHtcbiAgICB0aGlzLnZpZXdwb3J0LndpZHRoID0gYm94LndpZHRoIHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC5oZWlnaHQgPSBib3guaGVpZ2h0IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC54ID0gYm94LnggfHwgMDtcbiAgICB0aGlzLnZpZXdwb3J0LnkgPSBib3gueSB8fCAwO1xuXG4gICAgdGhpcy5yZWFsTGF5b3V0Qm94ID0ge1xuICAgICAgcmVhbFg6IHRoaXMudmlld3BvcnQueCxcbiAgICAgIHJlYWxZOiB0aGlzLnZpZXdwb3J0LnksXG4gICAgfTtcblxuICAgIHRoaXMuaGFzVmlld1BvcnRTZXQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgYXR0clZhbHVlUHJvY2Vzc29yOiBDYWxsYmFjaykge1xuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdCcpO1xuICAgIGNvbnN0IHBhcnNlQ29uZmlnID0ge1xuICAgICAgYXR0cmlidXRlTmFtZVByZWZpeDogJycsXG4gICAgICBhdHRyTm9kZU5hbWU6ICdhdHRyJywgLy8gZGVmYXVsdCBpcyAnZmFsc2UnXG4gICAgICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgIGlnbm9yZU5hbWVTcGFjZTogdHJ1ZSxcbiAgICAgIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBwYXJzZU5vZGVWYWx1ZTogZmFsc2UsXG4gICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgIHRyaW1WYWx1ZXM6IHRydWUsXG4gICAgICBwYXJzZVRydWVOdW1iZXJPbmx5OiBmYWxzZSxcbiAgICAgIGFsd2F5c0NyZWF0ZVRleHROb2RlOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoYXR0clZhbHVlUHJvY2Vzc29yICYmIHR5cGVvZiBhdHRyVmFsdWVQcm9jZXNzb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBhcnNlQ29uZmlnLmF0dHJWYWx1ZVByb2Nlc3NvciA9IGF0dHJWYWx1ZVByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luaXRfeG1sUGFyc2UnKTtcbiAgICAvLyDlsIZ4bWzlrZfnrKbkuLLop6PmnpDmiJB4bWzoioLngrnmoJFcbiAgICBjb25zdCBqc29uT2JqID0gcGFyc2VyLnBhcnNlKHRlbXBsYXRlLCBwYXJzZUNvbmZpZywgdHJ1ZSk7XG4gICAgLy8gY29uc29sZS5sb2coanNvbk9iailcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbFBhcnNlJyk7XG5cbiAgICBjb25zdCB4bWxUcmVlID0ganNvbk9iai5jaGlsZHJlblswXTtcblxuICAgIC8vIFhNTOagkeeUn+aIkOa4suafk+agkVxuICAgIGRlYnVnSW5mby5zdGFydCgnaW5pdF94bWwyTGF5b3V0Jyk7XG4gICAgY29uc3QgbGF5b3V0VHJlZSA9IGNyZWF0ZS5jYWxsKHRoaXMsIHhtbFRyZWUsIHN0eWxlKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0X3htbDJMYXlvdXQnKTtcblxuICAgIHRoaXMuYWRkKGxheW91dFRyZWUpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLklOSVRFRDtcblxuICAgIHRoaXMudGlja2VyLmFkZCh0aGlzLnRpY2tlckZ1bmMsIHRydWUpO1xuICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0Jyk7XG4gIH1cblxuICByZWZsb3coaXNGaXJzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0ZpcnN0KSB7XG4gICAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9yZWZsb3cnKTtcbiAgICAvKipcbiAgICAgKiDorqHnrpfluIPlsYDmoJFcbiAgICAgKiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr1xuICAgICAqIExheW91dOacrOi6q+W5tuS4jeS9nOS4uuW4g+WxgOiuoeeul++8jOWPquaYr+S9nOS4uuiKgueCueagkeeahOWuueWZqFxuICAgICAqL1xuICAgIGRlYnVnSW5mby5zdGFydCgnY29tcHV0ZUxheW91dCcsIHRydWUpO1xuICAgIGNvbXB1dGVMYXlvdXQodGhpcy5jaGlsZHJlblswXSk7XG4gICAgZGVidWdJbmZvLmVuZCgnY29tcHV0ZUxheW91dCcpO1xuXG4gICAgY29uc3Qgcm9vdEVsZSA9IHRoaXMuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAocm9vdEVsZS5zdHlsZS53aWR0aCA9PT0gdW5kZWZpbmVkIHx8IHJvb3RFbGUuc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBzZXQgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0eSBmb3Igcm9vdCBlbGVtZW50Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVycG9ydC53aWR0aCA9IHJvb3RFbGUuc3R5bGUud2lkdGg7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQuaGVpZ2h0ID0gcm9vdEVsZS5zdHlsZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8g5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRDaGlsZHJlbicsIHRydWUpO1xuICAgIGxheW91dENoaWxkcmVuKHRoaXMpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dENoaWxkcmVuJyk7XG5cbiAgICB0aGlzLnZpZXdwb3J0U2NhbGUgPSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gdGhpcy5yZW5kZXJwb3J0LndpZHRoO1xuXG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICAvLyDpgY3ljoboioLngrnmoJHvvIzkvp3mrKHosIPnlKjoioLngrnnmoTmuLLmn5PmjqXlj6Plrp7njrDmuLLmn5NcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlbmRlckNoaWxkcmVuJywgdHJ1ZSk7XG4gICAgcmVuZGVyQ2hpbGRyZW4odGhpcy5jaGlsZHJlbiwgdGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZmFsc2UpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlbmRlckNoaWxkcmVuJyk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlcGFpbnQnLCB0cnVlKTtcbiAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZXBhaW50Jyk7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCAoZWxlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbGUucHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X3JlZmxvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXTpmLbmrrXmoLjlv4Pku4Xku4XmmK/moLnmja54bWzlkoxjc3PliJvlu7rkuoboioLngrnmoJFcbiAgICog6KaB5a6e546w55yf5q2j55qE5riy5p+T77yM6ZyA6KaB6LCD55SoIGxheW91dCDlh73mlbDvvIzkuYvmiYDku6XlsIYgbGF5b3V0IOWNleeLrOaKveixoeS4uuS4gOS4quWHveaVsO+8jOaYr+WboOS4uiBsYXlvdXQg5bqU5b2T5piv5Y+v5Lul6YeN5aSN6LCD55So55qEXG4gICAqIOavlOWmguaUueWPmOS6huS4gOS4quWFg+e0oOeahOWwuuWvuO+8jOWunumZheS4iuiKgueCueagkeaYr+ayoeWPmOeahO+8jOS7heS7heaYr+mcgOimgemHjeaWsOiuoeeul+W4g+WxgO+8jOeEtuWQjua4suafk1xuICAgKiDkuIDkuKrlrozmlbTnmoQgbGF5b3V0IOWIhuaIkOS4i+mdoueahOWHoOatpe+8mlxuICAgKiAxLiDmiafooYznlLvluIPmuIXnkIbvvIzlm6DkuLrluIPlsYDlj5jljJbpobXpnaLpnIDopoHph43nu5jvvIzov5nph4zmsqHmnInlgZrlvojpq5jnuqfnmoTliZTpmaTnrYnmk43kvZzvvIzkuIDlvovmuIXpmaTph43nlLvvvIzlrp7pmYXkuIrmgKfog73lt7Lnu4/lvojlpb1cbiAgICogMi4g6IqC54K55qCR6YO95ZCr5pyJIHN0eWxlIOWxnuaAp++8jGNzcy1sYXlvdXQg6IO95aSf5qC55o2u6L+Z5Lqb5L+h5oGv6K6h566X5Ye65pyA57uI5biD5bGA77yM6K+m5oOF5Y+v6KeBIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Nzcy1sYXlvdXRcbiAgICogMy4g57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga/vvIzkvYbov5nkupvkv6Hmga/lubbkuI3mmK/og73lpJ/nm7TmjqXnlKjnmoRcbiAgICogICAg5q+U5aaCIGxheW91dC50b3Ag5piv5oyH5Zyo5LiA5Liq54i25a655Zmo5YaF55qEIHRvcO+8jOacgOe7iOimgeWunueOsOa4suafk++8jOWunumZheS4iuimgemAkuW9kuWKoOS4iuWkjeWuueWZqOeahCB0b3BcbiAgICogICAg6L+Z5qC35q+P5qyhIHJlcGFpbnQg55qE5pe25YCZ5Y+q6ZyA6KaB55u05o6l5L2/55So6K6h566X5aW955qE5YC85Y2z5Y+v77yM5LiN6ZyA6KaB5q+P5qyh6YO96YCS5b2S6K6h566XXG4gICAqICAgIOi/meS4gOatpeensOS4uiBsYXlvdXRDaGlsZHJlbu+8jOebrueahOWcqOS6juWwhiBjc3MtbGF5b3V0IOi/m+S4gOatpeWkhOeQhuS4uuWPr+S7pea4suafk+ebtOaOpeeUqOeahOW4g+WxgOS/oeaBr1xuICAgKiA0LiByZW5kZXJDaGlsZHJlbu+8muaJp+ihjOa4suafk1xuICAgKiA1LiBiaW5kRXZlbnRz77ya5omn6KGM5LqL5Lu257uR5a6aXG4gICAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGxheW91dChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKCF0aGlzLmhhc1ZpZXdQb3J0U2V0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2UgaW52b2tlIG1ldGhvZCBgdXBkYXRlVmlld1BvcnRgIGJlZm9yZSBtZXRob2QgYGxheW91dGAnKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dCcpO1xuXG4gICAgdGhpcy5yZWZsb3codHJ1ZSk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vdGhlcicpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnLCB0cnVlKTtcbiAgICBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCBlbGVtZW50ID0+IGVsZW1lbnQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50Jyk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuUkVOREVSRUQ7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXQnKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb3RoZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzoioLngrnmlbDnmoTph43nu5jliLbvvIzkuIDoiKzkuJrliqHkvqfml6DpnIDosIPnlKjor6Xmlrnms5VcbiAgICovXG4gIHJlcGFpbnQoKSB7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgICByZXBhaW50Q2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG4gIH1cblxuICAvKipcbiAgICog6L+U5Zue5LiA5Liq6IqC54K55Zyo5bGP5bmV5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGv77yM5YmN5o+Q5piv5q2j56Gu6LCD55SodXBkYXRlVmlld1BvcnTjgIJcbiAgICovXG4gIGdldEVsZW1lbnRWaWV3cG9ydFJlY3QoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IHsgcmVhbExheW91dEJveCwgdmlld3BvcnRTY2FsZSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBhYnNvbHV0ZVgsXG4gICAgICBhYnNvbHV0ZVksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gZWxlbWVudC5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB2aWV3cG9ydFNjYWxlO1xuICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB2aWV3cG9ydFNjYWxlO1xuXG4gICAgcmV0dXJuIG5ldyBSZWN0KFxuICAgICAgcmVhbFgsXG4gICAgICByZWFsWSxcbiAgICAgIHJlYWxXaWR0aCxcbiAgICAgIHJlYWxIZWlnaHQsXG4gICAgKTtcbiAgfVxuXG4gIGdldENoaWxkQnlQb3ModHJlZTogTGF5b3V0IHwgRWxlbWVudCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGl0ZW1MaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFic29sdXRlWCxcbiAgICAgICAgYWJzb2x1dGVZLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGVsZS5sYXlvdXRCb3g7XG4gICAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWDtcbiAgICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy52aWV3cG9ydFNjYWxlO1xuXG4gICAgICBpZiAoKHJlYWxYIDw9IHggJiYgeCA8PSByZWFsWCArIHJlYWxXaWR0aCkgJiYgKHJlYWxZIDw9IHkgJiYgeSA8PSByZWFsWSArIHJlYWxIZWlnaHQpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnm7jlhbNpc3N1Ze+8mmh0dHBzOi8vZ2l0aHViLmNvbS93ZWNoYXQtbWluaXByb2dyYW0vbWluaWdhbWUtY2FudmFzLWVuZ2luZS9pc3N1ZXMvMTdcbiAgICAgICAgICog6L+Z6YeM5Y+q6KaB5ruh6Laz5p2h5Lu255qE6YO96KaB6K6w5b2V77yM5ZCm5YiZ5Y+v6IO95Ye6546wIGlzc3VlIOmHjOmdouaPkOWIsOeahOmXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgaXRlbUxpc3QucHVzaChlbGUpO1xuICAgICAgICBpZiAoZWxlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyhlbGUsIHgsIHksIGl0ZW1MaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyID0gKGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCB0b3VjaDogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcblxuICAgICAgaWYgKGlzR2FtZVRvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3VjaCA9IGU7XG4gICAgICB9XG4gICAgICAvLyBjb25zdCB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB8fCBlO1xuICAgICAgaWYgKCF0b3VjaCB8fCAhdG91Y2gucGFnZVggfHwgIXRvdWNoLnBhZ2VZKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaC50aW1lU3RhbXApIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0b3VjaC50aW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdDogKExheW91dCB8IEVsZW1lbnQpW10gPSBbXTtcbiAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICB0aGlzLmdldENoaWxkQnlQb3ModGhpcywgdG91Y2gucGFnZVgsIHRvdWNoLnBhZ2VZLCBsaXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICBsaXN0LnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgICBpdGVtICYmIGl0ZW0uZW1pdChldmVudE5hbWUsIGUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnROYW1lID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZ1tldmVudE5hbWVdID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaGVuZCcgJiYgaXNDbGljayh0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2cpKSB7XG4gICAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KCdjbGljaycsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog5omn6KGM5YWo5bGA55qE5LqL5Lu257uR5a6a6YC76L6RIFxuICAgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIF9fZW52Lm9uVG91Y2hTdGFydCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydCk7XG4gICAgICBfX2Vudi5vblRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hFbmQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoRW5kKTtcbiAgICAgIF9fZW52Lm9uVG91Y2hDYW5jZWwodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoQ2FuY2VsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9jdW1lbnQub25tb3VzZWRvd24gPSB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hTdGFydDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gdGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZTtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2V1cCA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZDtcbiAgICAgIGRvY3VtZW50Lm9ubW91c2VsZWF2ZSA9IHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWo5bGA5LqL5Lu26Kej57uRIFxuICAgKi9cbiAgdW5CaW5kRXZlbnRzKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBfX2Vudi5vZmZUb3VjaFN0YXJ0KHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaFN0YXJ0KTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICAgIF9fZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgICBfX2Vudi5vZmZUb3VjaENhbmNlbCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hDYW5jZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlZG93biA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNlbW92ZSA9IG51bGw7XG4gICAgICBkb2N1bWVudC5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgZG9jdW1lbnQub25tb3VzZWxlYXZlID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIEVFLmVtaXQoZXZlbnQsIGRhdGEpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZShldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9mZihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveUFsbCh0cmVlOiBMYXlvdXQgfCBFbGVtZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgfSA9IHRyZWU7XG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5kZXN0cm95QWxsKGNoaWxkKTtcbiAgICAgIGNoaWxkLmRlc3Ryb3lTZWxmICYmIGNoaWxkLmRlc3Ryb3lTZWxmKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5riF55CG55S75biD77yM5LmL5YmN55qE6K6h566X5Ye65p2l55qE5riy5p+T5qCR5Lmf5Lya5LiA5bm25riF55CG77yM5q2k5pe25Y+v5Lul5YaN5qyh5omn6KGMaW5pdOWSjGxheW91dOaWueazlea4suafk+eVjOmdouOAglxuICAgKi9cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclBvb2woKSB7XG4gICAgaW1nUG9vbC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIOavlOi1tyBMYXlvdXQuY2xlYXIg5pu05b275bqV55qE5riF55CG77yM5Lya5riF56m65Zu+54mH5a+56LGh5rGg77yM5YeP5bCR5YaF5a2Y5Y2g55So44CCXG4gICAqL1xuICBjbGVhckFsbCgpIHtcbiAgICB0aGlzLmNsZWFyKCk7XG5cbiAgICB0aGlzLmNsZWFyUG9vbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWvueS6juWbvueJh+i1hOa6kO+8jOWmguaenOS4jeaPkOWJjeWKoOi9ve+8jOa4suafk+i/h+eoi+S4reWPr+iDveWHuueOsOaMqOS4quWHuueOsOWbvueJh+aViOaenO+8jOW9seWTjeS9k+mqjFxuICAgKiDpgJrov4dMYXlvdXQubG9hZEltZ3Plj6/ku6XpooTliqDovb3lm77niYfotYTmupDvvIzlnKjosIPnlKhMYXlvdXQubGF5b3V055qE5pe25YCZ5riy5p+T5oCn6IO95pu05aW977yM5L2T6aqM5pu05L2z44CCXG4gICAqL1xuICBsb2FkSW1ncyhhcnI6IHN0cmluZ1tdID0gW10pIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoYXJyLm1hcChzcmMgPT4gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZVByb21pc2Uoc3JjKSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIOazqOWGjCBiaXRtYXB0ZXh0IOWPr+eUqOeahOWtl+S9k+OAgiBcbiAgICovXG4gIHJlZ2lzdEJpdE1hcEZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJpdE1hcFBvb2wuZ2V0KG5hbWUpKSB7XG4gICAgICBjb25zdCBmb250ID0gbmV3IEJpdE1hcEZvbnQobmFtZSwgc3JjLCBjb25maWcpO1xuICAgICAgdGhpcy5iaXRNYXBGb250cy5wdXNoKGZvbnQpO1xuICAgICAgYml0TWFwUG9vbC5zZXQobmFtZSwgZm9udClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5YWL6ZqG6IqC54K577yM5YWL6ZqG5ZCO55qE6IqC54K55Y+v5Lul5re75Yqg5YiwIExheW91dCDnmoTmn5DkuKroioLngrnkuK1cbiAgICog6K+l5pa55rOV5Y+v5Lul5Zyo5pWw5o2u5pyJ5Y+Y5YyW55qE5pe25YCZ6YG/5YWN6YeN5paw5omn6KGMIExheW91dC5pbml0IOa1geeoi+OAglxuICAgKi9cbiAgY2xvbmVOb2RlKGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlKSB7XG4gICAgcmV0dXJuIGNsb25lPExheW91dD4odGhpcywgZWxlbWVudCwgZGVlcCk7XG4gIH1cblxuICAvKipcbiAgICog5bCG57uE5Lu25oyC5YiwTGF5b3V0XG4gICAqL1xuICBFbGVtZW50ID0gRWxlbWVudDtcbiAgVmlldyA9IFZpZXc7XG4gIFRleHQgPSBUZXh0O1xuICBJbWFnZSA9IEltYWdlO1xuICBTY3JvbGxWaWV3ID0gU2Nyb2xsVmlldztcbiAgQml0TWFwVGV4dCA9IEJpdE1hcFRleHQ7XG4gIENhbnZhcyA9IENhbnZhcztcblxuICByZWdpc3RlckNvbXBvbmVudCA9IHJlZ2lzdGVyQ29tcG9uZW50O1xuXG4gIHByaXZhdGUgc3RhdGljIGluc3RhbGxlZFBsdWdpbnM6IElQbHVnaW48TGF5b3V0PltdID0gW107XG4gIC8qKlxuICAgKiDlronoo4Xnu5nlrprnmoTmj5Lku7YgXG4gICAqL1xuICB1c2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgaWYgKExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0g6K+l5o+S5Lu25bey5a6J6KOFLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5a6J6KOFYClcbiAgfVxuXG4gIC8qKlxuICAgKiDljbjovb3nu5nlrprmj5Lku7YgXG4gICAqL1xuICB1blVzZShwbHVnaW46IElQbHVnaW48TGF5b3V0PiwgLi4ub3B0aW9uczogYW55W10pIHtcbiAgICBjb25zdCBwbHVnaW5JbmRleCA9IExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluZGV4T2YocGx1Z2luKTtcblxuICAgIGlmIChwbHVnaW5JbmRleCA9PT0gLTEpIHtcbiAgICAgIGNvbnNvbGUud2FybignVGhpcyBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocGx1Z2luLnVuaW5zdGFsbCkge1xuICAgICAgcGx1Z2luLnVuaW5zdGFsbCh0aGlzLCAuLi5vcHRpb25zKTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZyhgW0xheW91dF0g5o+S5Lu2ICR7cGx1Z2luLm5hbWUgfHwgJyd9IOW3suWNuOi9vWApXG4gICAgTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuc3BsaWNlKHBsdWdpbkluZGV4LCAxKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgTGF5b3V0KHtcbiAgc3R5bGU6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH0sXG4gIG5hbWU6ICdsYXlvdXQnLFxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
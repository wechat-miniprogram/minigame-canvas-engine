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
    ElementClassList.prototype.add = function (className) {
        if (!this.contains(className)) {
            this.tokens.add(className);
            this.changeHandler();
        }
    };
    // 检查列表中是否存在指定的令牌
    ElementClassList.prototype.contains = function (className) {
        return this.tokens.has(className);
    };
    ElementClassList.prototype.remove = function (className) {
        if (this.contains(className)) {
            this.tokens.delete(className);
            this.changeHandler();
        }
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
        this.classList = null;
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
/* harmony import */ var _styleParser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./styleParser */ "./src/components/styleParser.ts");
/* harmony import */ var _textParser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./textParser */ "./src/components/textParser.ts");
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
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(_a) {
        var _b = _a.style, style = _b === void 0 ? {} : _b, _c = _a.idName, idName = _c === void 0 ? '' : _c, _d = _a.className, className = _d === void 0 ? '' : _d, _e = _a.value, value = _e === void 0 ? '' : _e, dataset = _a.dataset;
        var _this = _super.call(this, {
            idName: idName,
            className: className,
            style: style,
            dataset: dataset,
        }) || this;
        _this.valuesrc = '';
        _this.parsedValue = [];
        _this.textBaseline = 'bottom';
        _this.font = '';
        _this.textAlign = 'left';
        _this.fillStyle = '#000000';
        _this.renderForLayout = {};
        _this.type = 'Text';
        _this.ctx = null;
        _this.valuesrc = value;
        _this.originSomeStyleInfo = {
            width: style.width,
            height: style.height,
            lineHeight: style.lineHeight,
        };
        // 文本解析
        _this.parsedValue = (0,_textParser__WEBPACK_IMPORTED_MODULE_2__.parseText)(style, _this.originSomeStyleInfo, value);
        (0,_textParser__WEBPACK_IMPORTED_MODULE_2__.parseTextHeight)(style, _this.originSomeStyleInfo, _this.parsedValue);
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
        if (!(0,_styleParser__WEBPACK_IMPORTED_MODULE_1__.isValidTextShadow)(textShadow)) {
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
                this.valuesrc = newValue;
                this.parsedValue = (0,_textParser__WEBPACK_IMPORTED_MODULE_2__.parseText)(this.style, this.originSomeStyleInfo, newValue);
                (0,_textParser__WEBPACK_IMPORTED_MODULE_2__.parseTextHeight)(this.style, this.originSomeStyleInfo, this.parsedValue);
                (0,_elements__WEBPACK_IMPORTED_MODULE_0__.setDirty)(this, 'value change');
            }
        },
        enumerable: false,
        configurable: true
    });
    Text.prototype.repaint = function () {
        this.render();
    };
    Text.prototype.destroySelf = function () {
        this.root = null;
    };
    Text.prototype.insert = function (ctx, needRender) {
        this.ctx = ctx;
        this.shouldUpdate = false;
        if (needRender) {
            this.render();
        }
    };
    Text.prototype.render = function () {
        var _this = this;
        if (!this.ctx) {
            return;
        }
        var style = this.style;
        var ctx = this.ctx;
        ctx.save();
        // 调用基类的渲染方法
        var _a = this.baseRender(), needStroke = _a.needStroke, originX = _a.originX, originY = _a.originY, drawX = _a.drawX, drawY = _a.drawY, width = _a.width, height = _a.height;
        // 设置文字渲染属性
        var fontSize = style.fontSize || 12;
        var lineHeight = style.lineHeight || fontSize;
        ctx.font = "".concat(style.fontWeight || 'normal', " ").concat(fontSize, "px ").concat(style.fontFamily || DEFAULT_FONT_FAMILY);
        ctx.textBaseline = 'middle';
        ctx.textAlign = style.textAlign || 'left';
        ctx.fillStyle = style.color || '#000000';
        // 处理文字换行
        var lines = this.parsedValue;
        var y = drawY - originY;
        // 垂直对齐方式处理，totalHeight 代表文字实际占用的高度
        var totalHeight = lines.length * lineHeight;
        if (style.verticalAlign === 'middle') {
            y += height / 2; // 先移动到容器中心
            y -= (totalHeight - lineHeight) / 2; // 再减去多行文本的一半高度(不包括第一行)
        }
        else if (style.verticalAlign === 'bottom') {
            y += height; // 移动到容器底部
            y -= totalHeight - lineHeight / 2; // 减去文本总高度，但保留半行
        }
        else {
            // top alignment
            y += lineHeight / 2; // 只需要移动半个行高，因为使用了 middle 基线
        }
        // 渲染每一行文字
        lines.forEach(function (line, index) {
            var x = drawX - originX;
            // 水平对齐方式处理
            if (style.textAlign === 'center') {
                x += width / 2;
            }
            else if (style.textAlign === 'right') {
                x += width;
            }
            var currentY = y + lineHeight * index;
            // 渲染文字阴影
            if (_this.renderForLayout.textShadows) {
                _this.renderForLayout.textShadows.forEach(function (shadow) {
                    ctx.save();
                    ctx.shadowOffsetX = shadow.offsetX;
                    ctx.shadowOffsetY = shadow.offsetY;
                    ctx.shadowBlur = shadow.blurRadius;
                    ctx.shadowColor = shadow.color;
                    ctx.fillText(line, x, currentY);
                    ctx.restore();
                });
            }
            // 渲染文字描边
            if (style.textStrokeWidth && style.textStrokeColor) {
                ctx.strokeStyle = style.textStrokeColor;
                ctx.lineWidth = style.textStrokeWidth;
                ctx.strokeText(line, x, currentY);
            }
            // 渲染文字
            ctx.fillText(line, x, currentY);
        });
        if (needStroke) {
            ctx.stroke();
        }
        ctx.restore();
    };
    return Text;
}(_elements__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Text);


/***/ }),

/***/ "./src/components/textParser.ts":
/*!**************************************!*\
  !*** ./src/components/textParser.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseText: () => (/* binding */ parseText),
/* harmony export */   parseTextHeight: () => (/* binding */ parseTextHeight)
/* harmony export */ });
/* harmony import */ var _env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env */ "./src/env.ts");

var DEFAULT_FONT_FAMILY = 'sans-serif';
var context = null;
var getContext = function () {
    if (context) {
        return context;
    }
    var canvas = _env__WEBPACK_IMPORTED_MODULE_0__["default"].createCanvas();
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
// let count = 0;
function getTextWidthWithoutSetFont(value) {
    // console.log(count++)
    return getContext().measureText(value).width || 0;
}
/**
 * 使用线性查找进行文本截断
 */
function truncateTextByLinear(value, maxWidth) {
    var length = value.length;
    var str = value.substring(0, length);
    while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
        length -= 1;
        str = value.substring(0, length);
    }
    return str;
}
/**
 * 使用二分查找进行文本截断
 */
function truncateTextByBinary(value, maxWidth) {
    var left = 0;
    var right = value.length;
    var result = '';
    while (left <= right) {
        var mid = Math.floor((left + right) / 2);
        var str = value.substring(0, mid);
        var width = getTextWidthWithoutSetFont(str);
        if (width === maxWidth) {
            return str;
        }
        else if (width < maxWidth) {
            result = str;
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return result;
}
/**
 * 文字截断辅助函数
 * 根据文本长度选择合适的截断算法：
 * 1. 当文本较短时使用线性查找
 * 2. 当文本较长时使用二分查找
 */
function truncateTextPure(value, maxWidth) {
    // 估算每个字符的平均宽度（假设使用的是等宽字体）
    var avgCharWidth = maxWidth / value.length;
    // 如果平均每个字符的宽度大于等于 maxWidth 的 1/20，说明文本较短，使用线性查找
    // 这个阈值可以根据实际情况调整
    if (avgCharWidth >= maxWidth / 20 || value.length <= 20) {
        return truncateTextByLinear(value, maxWidth);
    }
    // 文本较长，使用二分查找
    return truncateTextByBinary(value, maxWidth);
}
function truncateText(value, maxWidth) {
    var isCJK = isCJKText(value);
    // CJK 文字可以单字切分
    if (isCJK) {
        return truncateTextPure(value, maxWidth);
    }
    // 非 CJK 文字尽量在单词边界或特殊字符处切分
    // 1. 首先尝试在空格处切分
    var spaceWords = value.split(/(\s+)/).filter(Boolean);
    var result = '';
    var currentWidth = 0;
    var spaceWidth = getTextWidthWithoutSetFont(' ');
    for (var i = 0; i < spaceWords.length; i++) {
        var word = spaceWords[i];
        var wordWidth = getTextWidthWithoutSetFont(word);
        if (currentWidth + wordWidth <= maxWidth) {
            result += i < spaceWords.length - 1 ? word + ' ' : word;
            currentWidth += i < spaceWords.length - 1 ? wordWidth + spaceWidth : wordWidth;
        }
        else {
            break;
        }
    }
    // 2. 如果一个完整单词都放不下，尝试在特殊字符处切分
    if (!result && spaceWords[0]) {
        var word = spaceWords[0];
        // 在URL常见的分隔符处切分
        var subWords = word.split(/([\/\-\._~:?#\[\]@!$&'()*+,;=])/g).filter(Boolean);
        result = '';
        currentWidth = 0;
        for (var _i = 0, subWords_1 = subWords; _i < subWords_1.length; _i++) {
            var subWord = subWords_1[_i];
            var subWordWidth = getTextWidthWithoutSetFont(subWord);
            if (currentWidth + subWordWidth <= maxWidth) {
                result += subWord;
                currentWidth += subWordWidth;
            }
            else {
                break;
            }
        }
        // 3. 如果在特殊字符处切分后还是放不下，则按字符切分
        if (!result) {
            return truncateTextPure(word, maxWidth);
        }
    }
    return result;
}
function truncateTextWithDots(style, value, maxWidth) {
    maxWidth -= getTextWidthWithoutSetFont('...');
    var str = truncateTextPure(value, maxWidth);
    return str === value ? str : "".concat(str, "...");
}
/**
 * 判断文本是否包含 CJK（中日韩）字符
 * @param text 要检查的文本
 * @returns 是否包含 CJK 字符
 */
var isCJKText = function (text) {
    // 匹配中文、日文、韩文的 Unicode 范围
    return /[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/.test(text);
};
function processTextWhiteSpace(value, whiteSpace) {
    // 根据 whiteSpace 处理空白符和换行符
    switch (whiteSpace) {
        case 'pre':
            /**
             * 连续的空白符会被保留。仅在遇到换行符时才会换行，这里统一换行符格式
             * 这里对字符的初步处理跟 pre-warp 是一样的，实际的分行处理上，pre 只有遇到分行符才会分行
             * 而 pre-wrap 除了换行符，正常的文本过长也能够自动进行换行
             */
            value = value.replace(/\r\n|\r/g, '\n');
            break;
        case 'pre-wrap':
            // 连续的空白符会被保留。在遇到换行符时根据填充行框盒子的需要换行。
            value = value.replace(/\r\n|\r/g, '\n');
            break;
        case 'pre-line':
            // 合并空白符，保留换行符
            value = value.replace(/[^\S\n]+/g, ' ') // 合并空白符（不包括换行符）
                .replace(/\r\n|\r/g, '\n') // 统一换行符
                .replace(/ \n/g, '\n') // 删除换行符前的空格
                .replace(/\n /g, '\n'); // 删除换行符后的空格
            break;
        case 'nowrap':
            // nowrap的空白符处理会在后面统一处理
            break;
        case 'normal':
        default:
            // 合并所有空白符
            value = value.replace(/\s+/g, ' ');
            break;
    }
    return value;
}
/**
 * 文字解析器
 * 一些知识点：
 * 1. \s 匹配一个空白字符，包括空格、制表符、换页符和换行符。
 * 2. \r 匹配一个回车符 (U+000D)。
 * 3. \n 匹配一个换行符 (U+000A)。
 * 4. \S 匹配一个非空白字符。
 */
function parseText(style, originSomeStyleInfo, value) {
    value = String(value);
    // 1. 首先处理空白符和换行符
    var whiteSpace = style.whiteSpace || 'normal';
    value = processTextWhiteSpace(value, whiteSpace);
    // 2. 如果没有设置宽度，直接返回处理后的文本
    if (originSomeStyleInfo.width === undefined) {
        style.width = getTextWidth(style, value);
        return [value];
    }
    var maxWidth = style.width;
    // 3. 如果设置了不换行，强制在一行显示
    if (whiteSpace === 'nowrap') {
        value = value.replace(/\s+/g, ' '); // 合并所有空白符
        if (style.textOverflow === 'ellipsis' && getTextWidth(style, value) > maxWidth) {
            return [truncateTextWithDots(style, value, maxWidth)];
        }
        return [value];
    }
    // 4. 处理需要换行的情况
    var lines = [];
    var wordBreak = style.wordBreak || 'normal';
    var overflowWrap = style.overflowWrap || 'normal';
    // 首先按照自然断点（空格、换行符等）分割文本
    var segments = value.split('\n').map(function (line) {
        if (whiteSpace === 'pre') {
            // pre 模式下保持整行不分割，保留所有空白符
            return [line];
        }
        else if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
            return [line];
        }
        return line.split(' ').filter(Boolean);
    });
    for (var _i = 0, segments_1 = segments; _i < segments_1.length; _i++) {
        var lineSegments = segments_1[_i];
        var currentLine = '';
        var currentWidth = 0;
        for (var i = 0; i < lineSegments.length; i++) {
            var segment = lineSegments[i];
            // 行内的最后一段不应该有空格
            var segmentWidth = i < lineSegments.length - 1 ? getTextWidth(style, segment + ' ') : getTextWidth(style, segment);
            // 处理单个片段超过最大宽度的情况
            if (segmentWidth + currentWidth > maxWidth) {
                // CJK 文字特殊处理
                var isCJK = isCJKText(segment);
                // 需要强制断行的情况
                if (wordBreak === 'break-all' ||
                    (overflowWrap === 'break-word' && !isCJK) ||
                    (wordBreak === 'normal' && isCJK)) {
                    var remainingText = segment;
                    while (remainingText) {
                        var remainingWidth = maxWidth - currentWidth;
                        // 这里要考虑当前行已经不是空的场景，所以可用长度要把当前用掉的长度减掉
                        var truncated = truncateText(remainingText, remainingWidth);
                        remainingText = remainingText.slice(truncated.length);
                        // 代表还没分割完，truncated 会完整占据一行
                        if (remainingText) {
                            if (currentLine) {
                                // 如果不是行内的最后一段，拼接的时候应该额外加一个空格
                                lines.push(i < lineSegments.length - 1 ? currentLine + ' ' + truncated : currentLine + truncated);
                            }
                            else {
                                lines.push(truncated);
                            }
                            // 当前行用完了，重置
                            currentLine = '';
                            // 换行之后重置当前已用长度
                            currentWidth = 0;
                        }
                        else {
                            // 分割完了，但是未必占满了一行，需要记录下，可能给后续的 segment 使用
                            // 也可能是刚好分割完
                            currentLine = i < lineSegments.length - 1 ? currentLine + ' ' + truncated : currentLine + truncated;
                            currentWidth = getTextWidth(style, currentLine);
                        }
                    }
                }
                else {
                    /**
                     * 这里有几种情况
                     * 1. 当前行内这一段会超长，但是按照规则不需要强制断行，作为一个整体
                     * 2. 不符合1的情况，而是会把 currentLine 消费完，因此需要把 currentLine push之后处理
                     */
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = segment;
                        currentWidth = getTextWidth(style, currentLine);
                    }
                    else {
                        lines.push(segment);
                    }
                }
            }
            else {
                // 正常的行处理
                if (currentWidth + segmentWidth <= maxWidth) {
                    currentLine += (currentLine ? ' ' : '') + segment;
                    currentWidth += segmentWidth;
                }
                else {
                    if (currentLine) {
                        lines.push(currentLine);
                    }
                    currentLine = segment;
                    currentWidth = getTextWidth(style, segment);
                }
            }
        }
        if (currentLine) {
            lines.push(currentLine);
        }
    }
    return lines;
}
function parseTextHeight(style, originSomeStyleInfo, parsedValue) {
    var fontSize = style.fontSize || 12;
    if (originSomeStyleInfo.lineHeight === undefined) {
        style.lineHeight = fontSize * 1.2;
    }
    else if (typeof style.lineHeight === 'string' && style.lineHeight.endsWith('%')) {
        style.lineHeight = fontSize * parseFloat(style.lineHeight);
    }
    // 如果没有强行指定高度，通过 lineHeight * 行高
    if (originSomeStyleInfo.height === undefined) {
        style.height = style.lineHeight * parsedValue.length;
    }
}


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
        _this.version = '1.0.15';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vcGFja2FnZXMvcGx1Z2luL3BsdWdpbi9lbmdpbmUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxJQUEwQztBQUNoRDtBQUNBLElBQUksaUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLGtHQUFDO0FBQ3ZCLElBQUksS0FBSyxFQVFOO0FBQ0gsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOERBQThEO0FBQzlELDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLCtEQUErRDtBQUMvRCwrREFBK0Q7QUFDL0QsK0RBQStEO0FBQy9ELCtEQUErRDtBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkUsbUVBQW1FO0FBQ25FLG1FQUFtRTtBQUNuRSxtRUFBbUU7QUFDbkU7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGdCQUFnQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLFFBQVE7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUNBQWlDLGFBQWE7QUFDOUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrQ0FBa0MsYUFBYTtBQUMvQzs7QUFFQTtBQUNBO0FBQ0E7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QUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztRQUNuRCxTQUFTO1FBQ1QsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3pGLFFBQVE7UUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQzVELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxFQUFFLENBQUMsR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMzRyxRQUFRO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELFNBQVM7UUFDVCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLEVBQUUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcsTUFBTSxHQUFHLEdBQUcsR0FBRyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDM0YsUUFBUTtRQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLEdBQUcs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Q0FBQztJQUNyQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQy9FLFNBQVM7UUFDVCxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUNyQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDM0UsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDUCxNQUFNO1lBQ1IsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO1NBQU0sSUFDTCxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRztRQUN0QixPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUc7UUFDdEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUN0QixDQUFDO1FBQ0QsSUFBSSxrQkFBa0IsR0FBRyxDQUFDLENBQUM7UUFDM0IsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FB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QixDQUFDO0lBaEZjLHVCQUFnQixHQUFzQixFQUFFLENBQUM7SUFpRjFELGFBQUM7Q0FBQSxDQXZsQm9CLDREQUFPLEdBdWxCM0I7QUFFRCxJQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztJQUN4QixLQUFLLEVBQUU7UUFDTCxLQUFLLEVBQUUsQ0FBQztRQUNSLE1BQU0sRUFBRSxDQUFDO0tBQ1Y7SUFDRCxJQUFJLEVBQUUsUUFBUTtDQUNmLENBQUMsQ0FBQztBQWdCRiIsInNvdXJjZXMiOlsid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9ub2RlX21vZHVsZXMvY3NzLWxheW91dC9kaXN0L2Nzcy1sYXlvdXQuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL25vZGVfbW9kdWxlcy90aW55LWVtaXR0ZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vYml0TWFwRm9udC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi9kZWJ1Z0luZm8udHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vaW1hZ2VNYW5hZ2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tbW9uL3Bvb2wudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vcmVjdC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi90aWNrZXIudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21tb24vdXRpbC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbW1vbi92ZC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYml0bWFwdGV4dC50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvYnV0dG9uLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9jYW52YXMudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL2VsZW1lbnRzLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy9pbWFnZS50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3Njcm9sbGJhci50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc2Nyb2xsdmlldy50cyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2NvbXBvbmVudHMvc3R5bGUudHMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9jb21wb25lbnRzL3N0eWxlUGFyc2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy90ZXh0LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy90ZXh0UGFyc2VyLnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvY29tcG9uZW50cy92aWV3LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvZW52LnRzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvbm9kZTJqc29uLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvcGFyc2VyLmpzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvLi9zcmMvbGlicy9mYXN0LXhtbC1wYXJzZXIvdXRpbC5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3ZhbGlkYXRvci5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvZmFzdC14bWwtcGFyc2VyL3htbE5vZGUuanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9saWJzL2Zhc3QteG1sLXBhcnNlci94bWxzdHIyeG1sbm9kZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvYW5pbWF0ZS5qcyIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lLy4vc3JjL2xpYnMvc2Nyb2xsZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL21pbmlnYW1lLWNhbnZhcy1lbmdpbmUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9taW5pZ2FtZS1jYW52YXMtZW5naW5lL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vbWluaWdhbWUtY2FudmFzLWVuZ2luZS8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVTUQgKFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbilcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdW1kanMvdW1kIGZvciByZWZlcmVuY2Vcbi8vXG4vLyBUaGlzIGZpbGUgdXNlcyB0aGUgZm9sbG93aW5nIHNwZWNpZmljIFVNRCBpbXBsZW1lbnRhdGlvbjpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvcmV0dXJuRXhwb3J0cy5qc1xuKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS5cbiAgICBkZWZpbmUoW10sIGZhY3RvcnkpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgIC8vIE5vZGUuIERvZXMgbm90IHdvcmsgd2l0aCBzdHJpY3QgQ29tbW9uSlMsIGJ1dFxuICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9ubWVudHMgdGhhdCBzdXBwb3J0IG1vZHVsZS5leHBvcnRzLFxuICAgIC8vIGxpa2UgTm9kZS5cbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBCcm93c2VyIGdsb2JhbHMgKHJvb3QgaXMgd2luZG93KVxuICAgIHJvb3QuY29tcHV0ZUxheW91dCA9IGZhY3RvcnkoKTtcbiAgfVxufSh0aGlzLCBmdW5jdGlvbigpIHtcbiAgLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG52YXIgY29tcHV0ZUxheW91dCA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgQ1NTX1VOREVGSU5FRDtcblxuICB2YXIgQ1NTX0RJUkVDVElPTl9JTkhFUklUID0gJ2luaGVyaXQnO1xuICB2YXIgQ1NTX0RJUkVDVElPTl9MVFIgPSAnbHRyJztcbiAgdmFyIENTU19ESVJFQ1RJT05fUlRMID0gJ3J0bCc7XG5cbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1cgPSAncm93JztcbiAgdmFyIENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSA9ICdyb3ctcmV2ZXJzZSc7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OID0gJ2NvbHVtbic7XG4gIHZhciBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UgPSAnY29sdW1uLXJldmVyc2UnO1xuXG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0pVU1RJRllfQ0VOVEVSID0gJ2NlbnRlcic7XG4gIHZhciBDU1NfSlVTVElGWV9GTEVYX0VORCA9ICdmbGV4LWVuZCc7XG4gIHZhciBDU1NfSlVTVElGWV9TUEFDRV9CRVRXRUVOID0gJ3NwYWNlLWJldHdlZW4nO1xuICB2YXIgQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EID0gJ3NwYWNlLWFyb3VuZCc7XG5cbiAgdmFyIENTU19BTElHTl9GTEVYX1NUQVJUID0gJ2ZsZXgtc3RhcnQnO1xuICB2YXIgQ1NTX0FMSUdOX0NFTlRFUiA9ICdjZW50ZXInO1xuICB2YXIgQ1NTX0FMSUdOX0ZMRVhfRU5EID0gJ2ZsZXgtZW5kJztcbiAgdmFyIENTU19BTElHTl9TVFJFVENIID0gJ3N0cmV0Y2gnO1xuXG4gIHZhciBDU1NfUE9TSVRJT05fUkVMQVRJVkUgPSAncmVsYXRpdmUnO1xuICB2YXIgQ1NTX1BPU0lUSU9OX0FCU09MVVRFID0gJ2Fic29sdXRlJztcblxuICB2YXIgbGVhZGluZyA9IHtcbiAgICAncm93JzogJ2xlZnQnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICdyaWdodCcsXG4gICAgJ2NvbHVtbic6ICd0b3AnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdib3R0b20nXG4gIH07XG4gIHZhciB0cmFpbGluZyA9IHtcbiAgICAncm93JzogJ3JpZ2h0JyxcbiAgICAncm93LXJldmVyc2UnOiAnbGVmdCcsXG4gICAgJ2NvbHVtbic6ICdib3R0b20nLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICd0b3AnXG4gIH07XG4gIHZhciBwb3MgPSB7XG4gICAgJ3Jvdyc6ICdsZWZ0JyxcbiAgICAncm93LXJldmVyc2UnOiAncmlnaHQnLFxuICAgICdjb2x1bW4nOiAndG9wJyxcbiAgICAnY29sdW1uLXJldmVyc2UnOiAnYm90dG9tJ1xuICB9O1xuICB2YXIgZGltID0ge1xuICAgICdyb3cnOiAnd2lkdGgnLFxuICAgICdyb3ctcmV2ZXJzZSc6ICd3aWR0aCcsXG4gICAgJ2NvbHVtbic6ICdoZWlnaHQnLFxuICAgICdjb2x1bW4tcmV2ZXJzZSc6ICdoZWlnaHQnXG4gIH07XG5cbiAgLy8gV2hlbiB0cmFuc3BpbGVkIHRvIEphdmEgLyBDIHRoZSBub2RlIHR5cGUgaGFzIGxheW91dCwgY2hpbGRyZW4gYW5kIHN0eWxlXG4gIC8vIHByb3BlcnRpZXMuIEZvciB0aGUgSmF2YVNjcmlwdCB2ZXJzaW9uIHRoaXMgZnVuY3Rpb24gYWRkcyB0aGVzZSBwcm9wZXJ0aWVzXG4gIC8vIGlmIHRoZXkgZG9uJ3QgYWxyZWFkeSBleGlzdC5cbiAgZnVuY3Rpb24gZmlsbE5vZGVzKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUubGF5b3V0IHx8IG5vZGUuaXNEaXJ0eSkge1xuICAgICAgbm9kZS5sYXlvdXQgPSB7XG4gICAgICAgIHdpZHRoOiB1bmRlZmluZWQsXG4gICAgICAgIGhlaWdodDogdW5kZWZpbmVkLFxuICAgICAgICB0b3A6IDAsXG4gICAgICAgIGxlZnQ6IDAsXG4gICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICBib3R0b206IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLnN0eWxlKSB7XG4gICAgICBub2RlLnN0eWxlID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFub2RlLmNoaWxkcmVuKSB7XG4gICAgICBub2RlLmNoaWxkcmVuID0gW107XG4gICAgfVxuICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmaWxsTm9kZXMpO1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNVbmRlZmluZWQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUm93RGlyZWN0aW9uKGZsZXhEaXJlY3Rpb24pIHtcbiAgICByZXR1cm4gZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyB8fFxuICAgICAgICAgICBmbGV4RGlyZWN0aW9uID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0U7XG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbHVtbkRpcmVjdGlvbihmbGV4RGlyZWN0aW9uKSB7XG4gICAgcmV0dXJuIGZsZXhEaXJlY3Rpb24gPT09IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4gfHxcbiAgICAgICAgICAgZmxleERpcmVjdGlvbiA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTl9SRVZFUlNFO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUubWFyZ2luU3RhcnQgIT09IHVuZGVmaW5lZCAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luU3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkxlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5SaWdodDsgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luVG9wOyAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpbkJvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLm1hcmdpbkVuZCAhPT0gdW5kZWZpbmVkICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5tYXJnaW5FbmQ7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblJpZ2h0OyAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5tYXJnaW5MZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUubWFyZ2luQm90dG9tOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLm1hcmdpblRvcDsgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICBpZiAobm9kZS5zdHlsZS5tYXJnaW4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUubWFyZ2luO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmcobm9kZSwgYXhpcykge1xuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmdTdGFydCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ1N0YXJ0ID49IDBcbiAgICAgICAgJiYgaXNSb3dEaXJlY3Rpb24oYXhpcykpIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLnBhZGRpbmdTdGFydDtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWUgPSBudWxsO1xuICAgIHN3aXRjaCAoYXhpcykge1xuICAgICAgY2FzZSAncm93JzogICAgICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0xlZnQ7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdUb3A7ICAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uLXJldmVyc2UnOiB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLnBhZGRpbmcgIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLnBhZGRpbmcgPj0gMCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUucGFkZGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nUGFkZGluZyhub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZ0VuZCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZ0VuZCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nRW5kO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nUmlnaHQ7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLnBhZGRpbmdMZWZ0OyAgIGJyZWFrO1xuICAgICAgY2FzZSAnY29sdW1uJzogICAgICAgICB2YWx1ZSA9IG5vZGUuc3R5bGUucGFkZGluZ0JvdHRvbTsgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5wYWRkaW5nVG9wOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUucGFkZGluZyAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUucGFkZGluZyA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wYWRkaW5nO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ0JvcmRlcihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyU3RhcnRXaWR0aCA+PSAwXG4gICAgICAgICYmIGlzUm93RGlyZWN0aW9uKGF4aXMpKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJTdGFydFdpZHRoO1xuICAgIH1cblxuICAgIHZhciB2YWx1ZSA9IG51bGw7XG4gICAgc3dpdGNoIChheGlzKSB7XG4gICAgICBjYXNlICdyb3cnOiAgICAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJMZWZ0V2lkdGg7ICAgYnJlYWs7XG4gICAgICBjYXNlICdyb3ctcmV2ZXJzZSc6ICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJSaWdodFdpZHRoOyAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4nOiAgICAgICAgIHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJUb3BXaWR0aDsgICAgYnJlYWs7XG4gICAgICBjYXNlICdjb2x1bW4tcmV2ZXJzZSc6IHZhbHVlID0gbm9kZS5zdHlsZS5ib3JkZXJCb3R0b21XaWR0aDsgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdmFsdWUgPj0gMCkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2RlLnN0eWxlLmJvcmRlcldpZHRoICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZS5ib3JkZXJXaWR0aCA+PSAwKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5ib3JkZXJXaWR0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFRyYWlsaW5nQm9yZGVyKG5vZGUsIGF4aXMpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5ib3JkZXJFbmRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGggPj0gMFxuICAgICAgICAmJiBpc1Jvd0RpcmVjdGlvbihheGlzKSkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYm9yZGVyRW5kV2lkdGg7XG4gICAgfVxuXG4gICAgdmFyIHZhbHVlID0gbnVsbDtcbiAgICBzd2l0Y2ggKGF4aXMpIHtcbiAgICAgIGNhc2UgJ3Jvdyc6ICAgICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclJpZ2h0V2lkdGg7ICBicmVhaztcbiAgICAgIGNhc2UgJ3Jvdy1yZXZlcnNlJzogICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckxlZnRXaWR0aDsgICBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbic6ICAgICAgICAgdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlckJvdHRvbVdpZHRoOyBicmVhaztcbiAgICAgIGNhc2UgJ2NvbHVtbi1yZXZlcnNlJzogdmFsdWUgPSBub2RlLnN0eWxlLmJvcmRlclRvcFdpZHRoOyAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2YWx1ZSA+PSAwKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUuc3R5bGUuYm9yZGVyV2lkdGggIT09IHVuZGVmaW5lZCAmJiBub2RlLnN0eWxlLmJvcmRlcldpZHRoID49IDApIHtcbiAgICAgIHJldHVybiBub2RlLnN0eWxlLmJvcmRlcldpZHRoO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZyhub2RlLCBheGlzKSArIGdldExlYWRpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRUcmFpbGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRUcmFpbGluZ1BhZGRpbmcobm9kZSwgYXhpcykgKyBnZXRUcmFpbGluZ0JvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nQm9yZGVyKG5vZGUsIGF4aXMpICsgZ2V0VHJhaWxpbmdCb3JkZXIobm9kZSwgYXhpcyk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gZ2V0TGVhZGluZ01hcmdpbihub2RlLCBheGlzKSArIGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgYXhpcykge1xuICAgIHJldHVybiBnZXRMZWFkaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKSArXG4gICAgICAgIGdldFRyYWlsaW5nUGFkZGluZ0FuZEJvcmRlcihub2RlLCBheGlzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEp1c3RpZnlDb250ZW50KG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5qdXN0aWZ5Q29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuanVzdGlmeUNvbnRlbnQ7XG4gICAgfVxuICAgIHJldHVybiAnZmxleC1zdGFydCc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBbGlnbkNvbnRlbnQobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLmFsaWduQ29udGVudCkge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25Db250ZW50O1xuICAgIH1cbiAgICByZXR1cm4gJ2ZsZXgtc3RhcnQnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKSB7XG4gICAgaWYgKGNoaWxkLnN0eWxlLmFsaWduU2VsZikge1xuICAgICAgcmV0dXJuIGNoaWxkLnN0eWxlLmFsaWduU2VsZjtcbiAgICB9XG4gICAgaWYgKG5vZGUuc3R5bGUuYWxpZ25JdGVtcykge1xuICAgICAgcmV0dXJuIG5vZGUuc3R5bGUuYWxpZ25JdGVtcztcbiAgICB9XG4gICAgcmV0dXJuICdzdHJldGNoJztcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVBeGlzKGF4aXMsIGRpcmVjdGlvbikge1xuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fUlRMKSB7XG4gICAgICBpZiAoYXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVykge1xuICAgICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFO1xuICAgICAgfSBlbHNlIGlmIChheGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fUk9XX1JFVkVSU0UpIHtcbiAgICAgICAgcmV0dXJuIENTU19GTEVYX0RJUkVDVElPTl9ST1c7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF4aXM7XG4gIH1cblxuICBmdW5jdGlvbiByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbikge1xuICAgIHZhciBkaXJlY3Rpb247XG4gICAgaWYgKG5vZGUuc3R5bGUuZGlyZWN0aW9uKSB7XG4gICAgICBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlyZWN0aW9uID0gQ1NTX0RJUkVDVElPTl9JTkhFUklUO1xuICAgIH1cblxuICAgIGlmIChkaXJlY3Rpb24gPT09IENTU19ESVJFQ1RJT05fSU5IRVJJVCkge1xuICAgICAgZGlyZWN0aW9uID0gKHBhcmVudERpcmVjdGlvbiA9PT0gdW5kZWZpbmVkID8gQ1NTX0RJUkVDVElPTl9MVFIgOiBwYXJlbnREaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIHJldHVybiBkaXJlY3Rpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRGbGV4RGlyZWN0aW9uKG5vZGUpIHtcbiAgICBpZiAobm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4RGlyZWN0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldENyb3NzRmxleERpcmVjdGlvbihmbGV4RGlyZWN0aW9uLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoaXNDb2x1bW5EaXJlY3Rpb24oZmxleERpcmVjdGlvbikpIHtcbiAgICAgIHJldHVybiByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gQ1NTX0ZMRVhfRElSRUNUSU9OX0NPTFVNTjtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvblR5cGUobm9kZSkge1xuICAgIGlmIChub2RlLnN0eWxlLnBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZS5wb3NpdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuICdyZWxhdGl2ZSc7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXgobm9kZSkge1xuICAgIHJldHVybiAoXG4gICAgICBnZXRQb3NpdGlvblR5cGUobm9kZSkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgbm9kZS5zdHlsZS5mbGV4ID4gMFxuICAgICk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0ZsZXhXcmFwKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZS5mbGV4V3JhcCA9PT0gJ3dyYXAnO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0RGltV2l0aE1hcmdpbihub2RlLCBheGlzKSB7XG4gICAgcmV0dXJuIG5vZGUubGF5b3V0W2RpbVtheGlzXV0gKyBnZXRNYXJnaW5BeGlzKG5vZGUsIGF4aXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNEaW1EZWZpbmVkKG5vZGUsIGF4aXMpIHtcbiAgICByZXR1cm4gbm9kZS5zdHlsZVtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQgJiYgbm9kZS5zdHlsZVtkaW1bYXhpc11dID49IDA7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Bvc0RlZmluZWQobm9kZSwgcG9zKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNNZWFzdXJlRGVmaW5lZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUuc3R5bGUubWVhc3VyZSAhPT0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UG9zaXRpb24obm9kZSwgcG9zKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbcG9zXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gbm9kZS5zdHlsZVtwb3NdO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGJvdW5kQXhpcyhub2RlLCBheGlzLCB2YWx1ZSkge1xuICAgIHZhciBtaW4gPSB7XG4gICAgICAncm93Jzogbm9kZS5zdHlsZS5taW5XaWR0aCxcbiAgICAgICdyb3ctcmV2ZXJzZSc6IG5vZGUuc3R5bGUubWluV2lkdGgsXG4gICAgICAnY29sdW1uJzogbm9kZS5zdHlsZS5taW5IZWlnaHQsXG4gICAgICAnY29sdW1uLXJldmVyc2UnOiBub2RlLnN0eWxlLm1pbkhlaWdodFxuICAgIH1bYXhpc107XG5cbiAgICB2YXIgbWF4ID0ge1xuICAgICAgJ3Jvdyc6IG5vZGUuc3R5bGUubWF4V2lkdGgsXG4gICAgICAncm93LXJldmVyc2UnOiBub2RlLnN0eWxlLm1heFdpZHRoLFxuICAgICAgJ2NvbHVtbic6IG5vZGUuc3R5bGUubWF4SGVpZ2h0LFxuICAgICAgJ2NvbHVtbi1yZXZlcnNlJzogbm9kZS5zdHlsZS5tYXhIZWlnaHRcbiAgICB9W2F4aXNdO1xuXG4gICAgdmFyIGJvdW5kVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAobWF4ICE9PSB1bmRlZmluZWQgJiYgbWF4ID49IDAgJiYgYm91bmRWYWx1ZSA+IG1heCkge1xuICAgICAgYm91bmRWYWx1ZSA9IG1heDtcbiAgICB9XG4gICAgaWYgKG1pbiAhPT0gdW5kZWZpbmVkICYmIG1pbiA+PSAwICYmIGJvdW5kVmFsdWUgPCBtaW4pIHtcbiAgICAgIGJvdW5kVmFsdWUgPSBtaW47XG4gICAgfVxuICAgIHJldHVybiBib3VuZFZhbHVlO1xuICB9XG5cbiAgZnVuY3Rpb24gZm1heGYoYSwgYikge1xuICAgIGlmIChhID4gYikge1xuICAgICAgcmV0dXJuIGE7XG4gICAgfVxuICAgIHJldHVybiBiO1xuICB9XG5cbiAgLy8gV2hlbiB0aGUgdXNlciBzcGVjaWZpY2FsbHkgc2V0cyBhIHZhbHVlIGZvciB3aWR0aCBvciBoZWlnaHRcbiAgZnVuY3Rpb24gc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGF4aXMpIHtcbiAgICAvLyBUaGUgcGFyZW50IGFscmVhZHkgY29tcHV0ZWQgdXMgYSB3aWR0aCBvciBoZWlnaHQuIFdlIGp1c3Qgc2tpcCBpdFxuICAgIGlmIChub2RlLmxheW91dFtkaW1bYXhpc11dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gV2Ugb25seSBydW4gaWYgdGhlcmUncyBhIHdpZHRoIG9yIGhlaWdodCBkZWZpbmVkXG4gICAgaWYgKCFpc0RpbURlZmluZWQobm9kZSwgYXhpcykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBUaGUgZGltZW5zaW9ucyBjYW4gbmV2ZXIgYmUgc21hbGxlciB0aGFuIHRoZSBwYWRkaW5nIGFuZCBib3JkZXJcbiAgICBub2RlLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICBib3VuZEF4aXMobm9kZSwgYXhpcywgbm9kZS5zdHlsZVtkaW1bYXhpc11dKSxcbiAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpXG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGF4aXMpIHtcbiAgICBjaGlsZC5sYXlvdXRbdHJhaWxpbmdbYXhpc11dID0gbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dIC0gY2hpbGQubGF5b3V0W3Bvc1theGlzXV07XG4gIH1cblxuICAvLyBJZiBib3RoIGxlZnQgYW5kIHJpZ2h0IGFyZSBkZWZpbmVkLCB0aGVuIHVzZSBsZWZ0LiBPdGhlcndpc2UgcmV0dXJuXG4gIC8vICtsZWZ0IG9yIC1yaWdodCBkZXBlbmRpbmcgb24gd2hpY2ggaXMgZGVmaW5lZC5cbiAgZnVuY3Rpb24gZ2V0UmVsYXRpdmVQb3NpdGlvbihub2RlLCBheGlzKSB7XG4gICAgaWYgKG5vZGUuc3R5bGVbbGVhZGluZ1theGlzXV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGdldFBvc2l0aW9uKG5vZGUsIGxlYWRpbmdbYXhpc10pO1xuICAgIH1cbiAgICByZXR1cm4gLWdldFBvc2l0aW9uKG5vZGUsIHRyYWlsaW5nW2F4aXNdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGVJbXBsKG5vZGUsIHBhcmVudE1heFdpZHRoLCAvKmNzc19kaXJlY3Rpb25fdCovcGFyZW50RGlyZWN0aW9uKSB7XG4gICAgdmFyLypjc3NfZGlyZWN0aW9uX3QqLyBkaXJlY3Rpb24gPSByZXNvbHZlRGlyZWN0aW9uKG5vZGUsIHBhcmVudERpcmVjdGlvbik7XG4gICAgdmFyLyooYykhY3NzX2ZsZXhfZGlyZWN0aW9uX3QqLy8qKGphdmEpIWludCovIG1haW5BeGlzID0gcmVzb2x2ZUF4aXMoZ2V0RmxleERpcmVjdGlvbihub2RlKSwgZGlyZWN0aW9uKTtcbiAgICB2YXIvKihjKSFjc3NfZmxleF9kaXJlY3Rpb25fdCovLyooamF2YSkhaW50Ki8gY3Jvc3NBeGlzID0gZ2V0Q3Jvc3NGbGV4RGlyZWN0aW9uKG1haW5BeGlzLCBkaXJlY3Rpb24pO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyByZXNvbHZlZFJvd0F4aXMgPSByZXNvbHZlQXhpcyhDU1NfRkxFWF9ESVJFQ1RJT05fUk9XLCBkaXJlY3Rpb24pO1xuXG4gICAgLy8gSGFuZGxlIHdpZHRoIGFuZCBoZWlnaHQgc3R5bGUgYXR0cmlidXRlc1xuICAgIHNldERpbWVuc2lvbkZyb21TdHlsZShub2RlLCBtYWluQXhpcyk7XG4gICAgc2V0RGltZW5zaW9uRnJvbVN0eWxlKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBTZXQgdGhlIHJlc29sdmVkIHJlc29sdXRpb24gaW4gdGhlIG5vZGUncyBsYXlvdXRcbiAgICBub2RlLmxheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAvLyBUaGUgcG9zaXRpb24gaXMgc2V0IGJ5IHRoZSBwYXJlbnQsIGJ1dCB3ZSBuZWVkIHRvIGNvbXBsZXRlIGl0IHdpdGggYVxuICAgIC8vIGRlbHRhIGNvbXBvc2VkIG9mIHRoZSBtYXJnaW4gYW5kIGxlZnQvdG9wL3JpZ2h0L2JvdHRvbVxuICAgIG5vZGUubGF5b3V0W2xlYWRpbmdbbWFpbkF4aXNdXSArPSBnZXRMZWFkaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFt0cmFpbGluZ1ttYWluQXhpc11dICs9IGdldFRyYWlsaW5nTWFyZ2luKG5vZGUsIG1haW5BeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIG1haW5BeGlzKTtcbiAgICBub2RlLmxheW91dFtsZWFkaW5nW2Nyb3NzQXhpc11dICs9IGdldExlYWRpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG4gICAgbm9kZS5sYXlvdXRbdHJhaWxpbmdbY3Jvc3NBeGlzXV0gKz0gZ2V0VHJhaWxpbmdNYXJnaW4obm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICBnZXRSZWxhdGl2ZVBvc2l0aW9uKG5vZGUsIGNyb3NzQXhpcyk7XG5cbiAgICAvLyBJbmxpbmUgaW1tdXRhYmxlIHZhbHVlcyBmcm9tIHRoZSB0YXJnZXQgbm9kZSB0byBhdm9pZCBleGNlc3NpdmUgbWV0aG9kXG4gICAgLy8gaW52b2NhdGlvbnMgZHVyaW5nIHRoZSBsYXlvdXQgY2FsY3VsYXRpb24uXG4gICAgdmFyLyppbnQqLyBjaGlsZENvdW50ID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XG4gICAgdmFyLypmbG9hdCovIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3cgPSBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCByZXNvbHZlZFJvd0F4aXMpO1xuXG4gICAgaWYgKGlzTWVhc3VyZURlZmluZWQobm9kZSkpIHtcbiAgICAgIHZhci8qYm9vbCovIGlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSk7XG5cbiAgICAgIHZhci8qZmxvYXQqLyB3aWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICBpZiAoaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykpIHtcbiAgICAgICAgd2lkdGggPSBub2RlLnN0eWxlLndpZHRoO1xuICAgICAgfSBlbHNlIGlmIChpc1Jlc29sdmVkUm93RGltRGVmaW5lZCkge1xuICAgICAgICB3aWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKTtcbiAgICAgIH1cbiAgICAgIHdpZHRoIC09IHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG5cbiAgICAgIC8vIFdlIG9ubHkgbmVlZCB0byBnaXZlIGEgZGltZW5zaW9uIGZvciB0aGUgdGV4dCBpZiB3ZSBoYXZlbid0IGdvdCBhbnlcbiAgICAgIC8vIGZvciBpdCBjb21wdXRlZCB5ZXQuIEl0IGNhbiBlaXRoZXIgYmUgZnJvbSB0aGUgc3R5bGUgYXR0cmlidXRlIG9yIGJlY2F1c2VcbiAgICAgIC8vIHRoZSBlbGVtZW50IGlzIGZsZXhpYmxlLlxuICAgICAgdmFyLypib29sKi8gaXNSb3dVbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIHJlc29sdmVkUm93QXhpcykgJiYgIWlzUmVzb2x2ZWRSb3dEaW1EZWZpbmVkO1xuICAgICAgdmFyLypib29sKi8gaXNDb2x1bW5VbmRlZmluZWQgPSAhaXNEaW1EZWZpbmVkKG5vZGUsIENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU4pICYmXG4gICAgICAgIGlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OXV0pO1xuXG4gICAgICAvLyBMZXQncyBub3QgbWVhc3VyZSB0aGUgdGV4dCBpZiB3ZSBhbHJlYWR5IGtub3cgYm90aCBkaW1lbnNpb25zXG4gICAgICBpZiAoaXNSb3dVbmRlZmluZWQgfHwgaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgdmFyLypjc3NfZGltX3QqLyBtZWFzdXJlRGltID0gbm9kZS5zdHlsZS5tZWFzdXJlKFxuICAgICAgICAgIC8qKGMpIW5vZGUtPmNvbnRleHQsKi9cbiAgICAgICAgICAvKihqYXZhKSFsYXlvdXRDb250ZXh0Lm1lYXN1cmVPdXRwdXQsKi9cbiAgICAgICAgICB3aWR0aFxuICAgICAgICApO1xuICAgICAgICBpZiAoaXNSb3dVbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC53aWR0aCA9IG1lYXN1cmVEaW0ud2lkdGggK1xuICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNDb2x1bW5VbmRlZmluZWQpIHtcbiAgICAgICAgICBub2RlLmxheW91dC5oZWlnaHQgPSBtZWFzdXJlRGltLmhlaWdodCArXG4gICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhub2RlLCBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGNoaWxkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhci8qYm9vbCovIGlzTm9kZUZsZXhXcmFwID0gaXNGbGV4V3JhcChub2RlKTtcblxuICAgIHZhci8qY3NzX2p1c3RpZnlfdCovIGp1c3RpZnlDb250ZW50ID0gZ2V0SnVzdGlmeUNvbnRlbnQobm9kZSk7XG5cbiAgICB2YXIvKmZsb2F0Ki8gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nUGFkZGluZ0FuZEJvcmRlckNyb3NzID0gZ2V0TGVhZGluZ1BhZGRpbmdBbmRCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKTtcbiAgICB2YXIvKmZsb2F0Ki8gcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgbWFpbkF4aXMpO1xuICAgIHZhci8qZmxvYXQqLyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMobm9kZSwgY3Jvc3NBeGlzKTtcblxuICAgIHZhci8qYm9vbCovIGlzTWFpbkRpbURlZmluZWQgPSAhaXNVbmRlZmluZWQobm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0pO1xuICAgIHZhci8qYm9vbCovIGlzQ3Jvc3NEaW1EZWZpbmVkID0gIWlzVW5kZWZpbmVkKG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSk7XG4gICAgdmFyLypib29sKi8gaXNNYWluUm93RGlyZWN0aW9uID0gaXNSb3dEaXJlY3Rpb24obWFpbkF4aXMpO1xuXG4gICAgdmFyLyppbnQqLyBpO1xuICAgIHZhci8qaW50Ki8gaWk7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGNoaWxkO1xuICAgIHZhci8qKGMpIWNzc19mbGV4X2RpcmVjdGlvbl90Ki8vKihqYXZhKSFpbnQqLyBheGlzO1xuXG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGZpcnN0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgdmFyLypjc3Nfbm9kZV90KiovIGN1cnJlbnRBYnNvbHV0ZUNoaWxkID0gbnVsbDtcblxuICAgIHZhci8qZmxvYXQqLyBkZWZpbmVkTWFpbkRpbSA9IENTU19VTkRFRklORUQ7XG4gICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIGRlZmluZWRNYWluRGltID0gbm9kZS5sYXlvdXRbZGltW21haW5BeGlzXV0gLSBwYWRkaW5nQW5kQm9yZGVyQXhpc01haW47XG4gICAgfVxuXG4gICAgLy8gV2Ugd2FudCB0byBleGVjdXRlIHRoZSBuZXh0IHR3byBsb29wcyBvbmUgcGVyIGxpbmUgd2l0aCBmbGV4LXdyYXBcbiAgICB2YXIvKmludCovIHN0YXJ0TGluZSA9IDA7XG4gICAgdmFyLyppbnQqLyBlbmRMaW5lID0gMDtcbiAgICAvLyB2YXIvKmludCovIG5leHRPZmZzZXQgPSAwO1xuICAgIHZhci8qaW50Ki8gYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgLy8gV2UgYWdncmVnYXRlIHRoZSB0b3RhbCBkaW1lbnNpb25zIG9mIHRoZSBjb250YWluZXIgaW4gdGhvc2UgdHdvIHZhcmlhYmxlc1xuICAgIHZhci8qZmxvYXQqLyBsaW5lc0Nyb3NzRGltID0gMDtcbiAgICB2YXIvKmZsb2F0Ki8gbGluZXNNYWluRGltID0gMDtcbiAgICB2YXIvKmludCovIGxpbmVzQ291bnQgPSAwO1xuICAgIHdoaWxlIChlbmRMaW5lIDwgY2hpbGRDb3VudCkge1xuICAgICAgLy8gPExvb3AgQT4gTGF5b3V0IG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgY291bnQgY2hpbGRyZW4gYnkgdHlwZVxuXG4gICAgICAvLyBtYWluQ29udGVudERpbSBpcyBhY2N1bXVsYXRpb24gb2YgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbiBvZiBhbGwgdGhlXG4gICAgICAvLyBub24gZmxleGlibGUgY2hpbGRyZW4uIFRoaXMgd2lsbCBiZSB1c2VkIGluIG9yZGVyIHRvIGVpdGhlciBzZXQgdGhlXG4gICAgICAvLyBkaW1lbnNpb25zIG9mIHRoZSBub2RlIGlmIG5vbmUgYWxyZWFkeSBleGlzdCwgb3IgdG8gY29tcHV0ZSB0aGVcbiAgICAgIC8vIHJlbWFpbmluZyBzcGFjZSBsZWZ0IGZvciB0aGUgZmxleGlibGUgY2hpbGRyZW4uXG4gICAgICB2YXIvKmZsb2F0Ki8gbWFpbkNvbnRlbnREaW0gPSAwO1xuXG4gICAgICAvLyBUaGVyZSBhcmUgdGhyZWUga2luZCBvZiBjaGlsZHJlbiwgbm9uIGZsZXhpYmxlLCBmbGV4aWJsZSBhbmQgYWJzb2x1dGUuXG4gICAgICAvLyBXZSBuZWVkIHRvIGtub3cgaG93IG1hbnkgdGhlcmUgYXJlIGluIG9yZGVyIHRvIGRpc3RyaWJ1dGUgdGhlIHNwYWNlLlxuICAgICAgdmFyLyppbnQqLyBmbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIHRvdGFsRmxleGlibGUgPSAwO1xuICAgICAgdmFyLyppbnQqLyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgPSAwO1xuXG4gICAgICAvLyBVc2UgdGhlIGxpbmUgbG9vcCB0byBwb3NpdGlvbiBjaGlsZHJlbiBpbiB0aGUgbWFpbiBheGlzIGZvciBhcyBsb25nXG4gICAgICAvLyBhcyB0aGV5IGFyZSB1c2luZyBhIHNpbXBsZSBzdGFja2luZyBiZWhhdmlvdXIuIENoaWxkcmVuIHRoYXQgYXJlXG4gICAgICAvLyBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3Agd2lsbCBub3QgYmUgdG91Y2hlZCBhZ2FpblxuICAgICAgLy8gaW4gPExvb3AgQz4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrTWFpbiA9XG4gICAgICAgICAgKGlzTWFpbkRpbURlZmluZWQgJiYganVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX0ZMRVhfU1RBUlQpIHx8XG4gICAgICAgICAgKCFpc01haW5EaW1EZWZpbmVkICYmIGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9DRU5URVIpO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhNYWluID0gKGlzU2ltcGxlU3RhY2tNYWluID8gY2hpbGRDb3VudCA6IHN0YXJ0TGluZSk7XG5cbiAgICAgIC8vIFVzZSB0aGUgaW5pdGlhbCBsaW5lIGxvb3AgdG8gcG9zaXRpb24gY2hpbGRyZW4gaW4gdGhlIGNyb3NzIGF4aXMgZm9yXG4gICAgICAvLyBhcyBsb25nIGFzIHRoZXkgYXJlIHJlbGF0aXZlbHkgcG9zaXRpb25lZCB3aXRoIGFsaWdubWVudCBTVFJFVENIIG9yXG4gICAgICAvLyBGTEVYX1NUQVJULiBDaGlsZHJlbiB0aGF0IGFyZSBpbW1lZGlhdGVseSBzdGFja2VkIGluIHRoZSBpbml0aWFsIGxvb3BcbiAgICAgIC8vIHdpbGwgbm90IGJlIHRvdWNoZWQgYWdhaW4gaW4gPExvb3AgRD4uXG4gICAgICB2YXIvKmJvb2wqLyBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSB0cnVlO1xuICAgICAgdmFyLyppbnQqLyBmaXJzdENvbXBsZXhDcm9zcyA9IGNoaWxkQ291bnQ7XG5cbiAgICAgIHZhci8qY3NzX25vZGVfdCoqLyBmaXJzdEZsZXhDaGlsZCA9IG51bGw7XG4gICAgICB2YXIvKmNzc19ub2RlX3QqKi8gY3VycmVudEZsZXhDaGlsZCA9IG51bGw7XG5cbiAgICAgIHZhci8qZmxvYXQqLyBtYWluRGltID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJNYWluO1xuICAgICAgdmFyLypmbG9hdCovIGNyb3NzRGltID0gMDtcblxuICAgICAgdmFyLypmbG9hdCovIG1heFdpZHRoO1xuICAgICAgZm9yIChpID0gc3RhcnRMaW5lOyBpIDwgY2hpbGRDb3VudDsgKytpKSB7XG4gICAgICAgIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXTtcbiAgICAgICAgY2hpbGQubGluZUluZGV4ID0gbGluZXNDb3VudDtcblxuICAgICAgICBjaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IG51bGw7XG4gICAgICAgIGNoaWxkLm5leHRGbGV4Q2hpbGQgPSBudWxsO1xuXG4gICAgICAgIHZhci8qY3NzX2FsaWduX3QqLyBhbGlnbkl0ZW0gPSBnZXRBbGlnbkl0ZW0obm9kZSwgY2hpbGQpO1xuXG4gICAgICAgIC8vIFByZS1maWxsIGNyb3NzIGF4aXMgZGltZW5zaW9ucyB3aGVuIHRoZSBjaGlsZCBpcyB1c2luZyBzdHJldGNoIGJlZm9yZVxuICAgICAgICAvLyB3ZSBjYWxsIHRoZSByZWN1cnNpdmUgbGF5b3V0IHBhc3NcbiAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiZcbiAgICAgICAgICAgIGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSAmJlxuICAgICAgICAgICAgaXNDcm9zc0RpbURlZmluZWQgJiZcbiAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGNyb3NzQXhpcykpIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dIC1cbiAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyAtIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcykpLFxuICAgICAgICAgICAgLy8gWW91IG5ldmVyIHdhbnQgdG8gZ28gc21hbGxlciB0aGFuIHBhZGRpbmdcbiAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBjcm9zc0F4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUpIHtcbiAgICAgICAgICAvLyBTdG9yZSBhIHByaXZhdGUgbGlua2VkIGxpc3Qgb2YgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGNoaWxkcmVuXG4gICAgICAgICAgLy8gc28gdGhhdCB3ZSBjYW4gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RBYnNvbHV0ZUNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICBmaXJzdEFic29sdXRlQ2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5uZXh0QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gUHJlLWZpbGwgZGltZW5zaW9ucyB3aGVuIHVzaW5nIGFic29sdXRlIHBvc2l0aW9uIGFuZCBib3RoIG9mZnNldHMgZm9yIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aFxuICAgICAgICAgIC8vIGxlZnQgYW5kIHJpZ2h0IG9yIHRvcCBhbmQgYm90dG9tKS5cbiAgICAgICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgICAgICBheGlzID0gKGlpICE9PSAwKSA/IENTU19GTEVYX0RJUkVDVElPTl9ST1cgOiBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OO1xuICAgICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgICAgICFpc0RpbURlZmluZWQoY2hpbGQsIGF4aXMpICYmXG4gICAgICAgICAgICAgICAgaXNQb3NEZWZpbmVkKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgICAgIGNoaWxkLmxheW91dFtkaW1bYXhpc11dID0gZm1heGYoXG4gICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBheGlzLCBub2RlLmxheW91dFtkaW1bYXhpc11dIC1cbiAgICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKG5vZGUsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMoY2hpbGQsIGF4aXMpIC1cbiAgICAgICAgICAgICAgICAgIGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgICAgICBnZXRQb3NpdGlvbihjaGlsZCwgdHJhaWxpbmdbYXhpc10pKSxcbiAgICAgICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGNoaWxkLCBheGlzKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhci8qZmxvYXQqLyBuZXh0Q29udGVudERpbSA9IDA7XG5cbiAgICAgICAgLy8gSXQgb25seSBtYWtlcyBzZW5zZSB0byBjb25zaWRlciBhIGNoaWxkIGZsZXhpYmxlIGlmIHdlIGhhdmUgYSBjb21wdXRlZFxuICAgICAgICAvLyBkaW1lbnNpb24gZm9yIHRoZSBub2RlLlxuICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCAmJiBpc0ZsZXgoY2hpbGQpKSB7XG4gICAgICAgICAgZmxleGlibGVDaGlsZHJlbkNvdW50Kys7XG4gICAgICAgICAgdG90YWxGbGV4aWJsZSArPSBjaGlsZC5zdHlsZS5mbGV4O1xuXG4gICAgICAgICAgLy8gU3RvcmUgYSBwcml2YXRlIGxpbmtlZCBsaXN0IG9mIGZsZXhpYmxlIGNoaWxkcmVuIHNvIHRoYXQgd2UgY2FuXG4gICAgICAgICAgLy8gZWZmaWNpZW50bHkgdHJhdmVyc2UgdGhlbSBsYXRlci5cbiAgICAgICAgICBpZiAoZmlyc3RGbGV4Q2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGZpcnN0RmxleENoaWxkID0gY2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjdXJyZW50RmxleENoaWxkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQgPSBjaGlsZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGNoaWxkO1xuXG4gICAgICAgICAgLy8gRXZlbiBpZiB3ZSBkb24ndCBrbm93IGl0cyBleGFjdCBzaXplIHlldCwgd2UgYWxyZWFkeSBrbm93IHRoZSBwYWRkaW5nLFxuICAgICAgICAgIC8vIGJvcmRlciBhbmQgbWFyZ2luLiBXZSdsbCB1c2UgdGhpcyBwYXJ0aWFsIGluZm9ybWF0aW9uLCB3aGljaCByZXByZXNlbnRzXG4gICAgICAgICAgLy8gdGhlIHNtYWxsZXN0IHBvc3NpYmxlIHNpemUgZm9yIHRoZSBjaGlsZCwgdG8gY29tcHV0ZSB0aGUgcmVtYWluaW5nXG4gICAgICAgICAgLy8gYXZhaWxhYmxlIHNwYWNlLlxuICAgICAgICAgIG5leHRDb250ZW50RGltID0gZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY2hpbGQsIG1haW5BeGlzKSArXG4gICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGNoaWxkLCBtYWluQXhpcyk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtYXhXaWR0aCA9IENTU19VTkRFRklORUQ7XG4gICAgICAgICAgaWYgKCFpc01haW5Sb3dEaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgICBtYXhXaWR0aCA9IG5vZGUubGF5b3V0W2RpbVtyZXNvbHZlZFJvd0F4aXNdXSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIG1heFdpZHRoID0gcGFyZW50TWF4V2lkdGggLVxuICAgICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNSZXNvbHZlZFJvdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBtYWluIHJlY3Vyc2l2ZSBjYWxsLiBXZSBsYXlvdXQgbm9uIGZsZXhpYmxlIGNoaWxkcmVuLlxuICAgICAgICAgIGlmIChhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID09PSAwKSB7XG4gICAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY2hpbGQsIG1heFdpZHRoLCBkaXJlY3Rpb24pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEFic29sdXRlIHBvc2l0aW9uZWQgZWxlbWVudHMgZG8gbm90IHRha2UgcGFydCBvZiB0aGUgbGF5b3V0LCBzbyB3ZVxuICAgICAgICAgIC8vIGRvbid0IHVzZSB0aGVtIHRvIGNvbXB1dGUgbWFpbkNvbnRlbnREaW1cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQrKztcbiAgICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBhbmQgbWFyZ2luIG9mIHRoZSBlbGVtZW50LlxuICAgICAgICAgICAgbmV4dENvbnRlbnREaW0gPSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIGVsZW1lbnQgd2UgYXJlIGFib3V0IHRvIGFkZCB3b3VsZCBtYWtlIHVzIGdvIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgICAgaWYgKGlzTm9kZUZsZXhXcmFwICYmXG4gICAgICAgICAgICBpc01haW5EaW1EZWZpbmVkICYmXG4gICAgICAgICAgICBtYWluQ29udGVudERpbSArIG5leHRDb250ZW50RGltID4gZGVmaW5lZE1haW5EaW0gJiZcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgb25seSBvbmUgZWxlbWVudCwgdGhlbiBpdCdzIGJpZ2dlciB0aGFuIHRoZSBjb250ZW50XG4gICAgICAgICAgICAvLyBhbmQgbmVlZHMgaXRzIG93biBsaW5lXG4gICAgICAgICAgICBpICE9PSBzdGFydExpbmUpIHtcbiAgICAgICAgICBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQtLTtcbiAgICAgICAgICBhbHJlYWR5Q29tcHV0ZWROZXh0TGF5b3V0ID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERpc2FibGUgc2ltcGxlIHN0YWNraW5nIGluIHRoZSBtYWluIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEM+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4gJiZcbiAgICAgICAgICAgIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpICE9PSBDU1NfUE9TSVRJT05fUkVMQVRJVkUgfHwgaXNGbGV4KGNoaWxkKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrTWFpbiA9IGZhbHNlO1xuICAgICAgICAgIGZpcnN0Q29tcGxleE1haW4gPSBpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGlzYWJsZSBzaW1wbGUgc3RhY2tpbmcgaW4gdGhlIGNyb3NzIGF4aXMgZm9yIHRoZSBjdXJyZW50IGxpbmUgYXNcbiAgICAgICAgLy8gd2UgZm91bmQgYSBub24tdHJpdmlhbCBjaGlsZC4gVGhlIHJlbWFpbmluZyBjaGlsZHJlbiB3aWxsIGJlIGxhaWQgb3V0XG4gICAgICAgIC8vIGluIDxMb29wIEQ+LlxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzICYmXG4gICAgICAgICAgICAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFIHx8XG4gICAgICAgICAgICAgICAgKGFsaWduSXRlbSAhPT0gQ1NTX0FMSUdOX1NUUkVUQ0ggJiYgYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkgfHxcbiAgICAgICAgICAgICAgICBpc1VuZGVmaW5lZChjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dKSkpIHtcbiAgICAgICAgICBpc1NpbXBsZVN0YWNrQ3Jvc3MgPSBmYWxzZTtcbiAgICAgICAgICBmaXJzdENvbXBsZXhDcm9zcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja01haW4pIHtcbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gKz0gbWFpbkRpbTtcbiAgICAgICAgICBpZiAoaXNNYWluRGltRGVmaW5lZCkge1xuICAgICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1haW5EaW0gKz0gZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICAgIGNyb3NzRGltID0gZm1heGYoY3Jvc3NEaW0sIGJvdW5kQXhpcyhjaGlsZCwgY3Jvc3NBeGlzLCBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNTaW1wbGVTdGFja0Nyb3NzKSB7XG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWxyZWFkeUNvbXB1dGVkTmV4dExheW91dCA9IDA7XG4gICAgICAgIG1haW5Db250ZW50RGltICs9IG5leHRDb250ZW50RGltO1xuICAgICAgICBlbmRMaW5lID0gaSArIDE7XG4gICAgICB9XG5cbiAgICAgIC8vIDxMb29wIEI+IExheW91dCBmbGV4aWJsZSBjaGlsZHJlbiBhbmQgYWxsb2NhdGUgZW1wdHkgc3BhY2VcblxuICAgICAgLy8gSW4gb3JkZXIgdG8gcG9zaXRpb24gdGhlIGVsZW1lbnRzIGluIHRoZSBtYWluIGF4aXMsIHdlIGhhdmUgdHdvXG4gICAgICAvLyBjb250cm9scy4gVGhlIHNwYWNlIGJldHdlZW4gdGhlIGJlZ2lubmluZyBhbmQgdGhlIGZpcnN0IGVsZW1lbnRcbiAgICAgIC8vIGFuZCB0aGUgc3BhY2UgYmV0d2VlbiBlYWNoIHR3byBlbGVtZW50cy5cbiAgICAgIHZhci8qZmxvYXQqLyBsZWFkaW5nTWFpbkRpbSA9IDA7XG4gICAgICB2YXIvKmZsb2F0Ki8gYmV0d2Vlbk1haW5EaW0gPSAwO1xuXG4gICAgICAvLyBUaGUgcmVtYWluaW5nIGF2YWlsYWJsZSBzcGFjZSB0aGF0IG5lZWRzIHRvIGJlIGFsbG9jYXRlZFxuICAgICAgdmFyLypmbG9hdCovIHJlbWFpbmluZ01haW5EaW0gPSAwO1xuICAgICAgaWYgKGlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgICAgcmVtYWluaW5nTWFpbkRpbSA9IGRlZmluZWRNYWluRGltIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYobWFpbkNvbnRlbnREaW0sIDApIC0gbWFpbkNvbnRlbnREaW07XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHRoZXJlIGFyZSBmbGV4aWJsZSBjaGlsZHJlbiBpbiB0aGUgbWl4LCB0aGV5IGFyZSBnb2luZyB0byBmaWxsIHRoZVxuICAgICAgLy8gcmVtYWluaW5nIHNwYWNlXG4gICAgICBpZiAoZmxleGlibGVDaGlsZHJlbkNvdW50ICE9PSAwKSB7XG4gICAgICAgIHZhci8qZmxvYXQqLyBmbGV4aWJsZU1haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gdG90YWxGbGV4aWJsZTtcbiAgICAgICAgdmFyLypmbG9hdCovIGJhc2VNYWluRGltO1xuICAgICAgICB2YXIvKmZsb2F0Ki8gYm91bmRNYWluRGltO1xuXG4gICAgICAgIC8vIElmIHRoZSBmbGV4IHNoYXJlIG9mIHJlbWFpbmluZyBzcGFjZSBkb2Vzbid0IG1lZXQgbWluL21heCBib3VuZHMsXG4gICAgICAgIC8vIHJlbW92ZSB0aGlzIGNoaWxkIGZyb20gZmxleCBjYWxjdWxhdGlvbnMuXG4gICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBmaXJzdEZsZXhDaGlsZDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnRGbGV4Q2hpbGQgIT09IG51bGwpIHtcbiAgICAgICAgICBiYXNlTWFpbkRpbSA9IGZsZXhpYmxlTWFpbkRpbSAqIGN1cnJlbnRGbGV4Q2hpbGQuc3R5bGUuZmxleCArXG4gICAgICAgICAgICAgIGdldFBhZGRpbmdBbmRCb3JkZXJBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgICBib3VuZE1haW5EaW0gPSBib3VuZEF4aXMoY3VycmVudEZsZXhDaGlsZCwgbWFpbkF4aXMsIGJhc2VNYWluRGltKTtcblxuICAgICAgICAgIGlmIChiYXNlTWFpbkRpbSAhPT0gYm91bmRNYWluRGltKSB7XG4gICAgICAgICAgICByZW1haW5pbmdNYWluRGltIC09IGJvdW5kTWFpbkRpbTtcbiAgICAgICAgICAgIHRvdGFsRmxleGlibGUgLT0gY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQgPSBjdXJyZW50RmxleENoaWxkLm5leHRGbGV4Q2hpbGQ7XG4gICAgICAgIH1cbiAgICAgICAgZmxleGlibGVNYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvIHRvdGFsRmxleGlibGU7XG5cbiAgICAgICAgLy8gVGhlIG5vbiBmbGV4aWJsZSBjaGlsZHJlbiBjYW4gb3ZlcmZsb3cgdGhlIGNvbnRhaW5lciwgaW4gdGhpcyBjYXNlXG4gICAgICAgIC8vIHdlIHNob3VsZCBqdXN0IGFzc3VtZSB0aGF0IHRoZXJlIGlzIG5vIHNwYWNlIGF2YWlsYWJsZS5cbiAgICAgICAgaWYgKGZsZXhpYmxlTWFpbkRpbSA8IDApIHtcbiAgICAgICAgICBmbGV4aWJsZU1haW5EaW0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGZpcnN0RmxleENoaWxkO1xuICAgICAgICB3aGlsZSAoY3VycmVudEZsZXhDaGlsZCAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIEF0IHRoaXMgcG9pbnQgd2Uga25vdyB0aGUgZmluYWwgc2l6ZSBvZiB0aGUgZWxlbWVudCBpbiB0aGUgbWFpblxuICAgICAgICAgIC8vIGRpbWVuc2lvblxuICAgICAgICAgIGN1cnJlbnRGbGV4Q2hpbGQubGF5b3V0W2RpbVttYWluQXhpc11dID0gYm91bmRBeGlzKGN1cnJlbnRGbGV4Q2hpbGQsIG1haW5BeGlzLFxuICAgICAgICAgICAgZmxleGlibGVNYWluRGltICogY3VycmVudEZsZXhDaGlsZC5zdHlsZS5mbGV4ICtcbiAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjdXJyZW50RmxleENoaWxkLCBtYWluQXhpcylcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbWF4V2lkdGggPSBDU1NfVU5ERUZJTkVEO1xuICAgICAgICAgIGlmIChpc0RpbURlZmluZWQobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBub2RlLmxheW91dFtkaW1bcmVzb2x2ZWRSb3dBeGlzXV0gLVxuICAgICAgICAgICAgICBwYWRkaW5nQW5kQm9yZGVyQXhpc1Jlc29sdmVkUm93O1xuICAgICAgICAgIH0gZWxzZSBpZiAoIWlzTWFpblJvd0RpcmVjdGlvbikge1xuICAgICAgICAgICAgbWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aCAtXG4gICAgICAgICAgICAgIGdldE1hcmdpbkF4aXMobm9kZSwgcmVzb2x2ZWRSb3dBeGlzKSAtXG4gICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzUmVzb2x2ZWRSb3c7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQW5kIHdlIHJlY3Vyc2l2ZWx5IGNhbGwgdGhlIGxheW91dCBhbGdvcml0aG0gZm9yIHRoaXMgY2hpbGRcbiAgICAgICAgICBsYXlvdXROb2RlKC8qKGphdmEpIWxheW91dENvbnRleHQsICovY3VycmVudEZsZXhDaGlsZCwgbWF4V2lkdGgsIGRpcmVjdGlvbik7XG5cbiAgICAgICAgICBjaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQ7XG4gICAgICAgICAgY3VycmVudEZsZXhDaGlsZCA9IGN1cnJlbnRGbGV4Q2hpbGQubmV4dEZsZXhDaGlsZDtcbiAgICAgICAgICBjaGlsZC5uZXh0RmxleENoaWxkID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAvLyBXZSB1c2UganVzdGlmeUNvbnRlbnQgdG8gZmlndXJlIG91dCBob3cgdG8gYWxsb2NhdGUgdGhlIHJlbWFpbmluZ1xuICAgICAgLy8gc3BhY2UgYXZhaWxhYmxlXG4gICAgICB9IGVsc2UgaWYgKGp1c3RpZnlDb250ZW50ICE9PSBDU1NfSlVTVElGWV9GTEVYX1NUQVJUKSB7XG4gICAgICAgIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfQ0VOVEVSKSB7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSByZW1haW5pbmdNYWluRGltIC8gMjtcbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfRkxFWF9FTkQpIHtcbiAgICAgICAgICBsZWFkaW5nTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW07XG4gICAgICAgIH0gZWxzZSBpZiAoanVzdGlmeUNvbnRlbnQgPT09IENTU19KVVNUSUZZX1NQQUNFX0JFVFdFRU4pIHtcbiAgICAgICAgICByZW1haW5pbmdNYWluRGltID0gZm1heGYocmVtYWluaW5nTWFpbkRpbSwgMCk7XG4gICAgICAgICAgaWYgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCAtIDEgIT09IDApIHtcbiAgICAgICAgICAgIGJldHdlZW5NYWluRGltID0gcmVtYWluaW5nTWFpbkRpbSAvXG4gICAgICAgICAgICAgIChmbGV4aWJsZUNoaWxkcmVuQ291bnQgKyBub25GbGV4aWJsZUNoaWxkcmVuQ291bnQgLSAxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmV0d2Vlbk1haW5EaW0gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChqdXN0aWZ5Q29udGVudCA9PT0gQ1NTX0pVU1RJRllfU1BBQ0VfQVJPVU5EKSB7XG4gICAgICAgICAgLy8gU3BhY2Ugb24gdGhlIGVkZ2VzIGlzIGhhbGYgb2YgdGhlIHNwYWNlIGJldHdlZW4gZWxlbWVudHNcbiAgICAgICAgICBiZXR3ZWVuTWFpbkRpbSA9IHJlbWFpbmluZ01haW5EaW0gL1xuICAgICAgICAgICAgKGZsZXhpYmxlQ2hpbGRyZW5Db3VudCArIG5vbkZsZXhpYmxlQ2hpbGRyZW5Db3VudCk7XG4gICAgICAgICAgbGVhZGluZ01haW5EaW0gPSBiZXR3ZWVuTWFpbkRpbSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gPExvb3AgQz4gUG9zaXRpb24gZWxlbWVudHMgaW4gdGhlIG1haW4gYXhpcyBhbmQgY29tcHV0ZSBkaW1lbnNpb25zXG5cbiAgICAgIC8vIEF0IHRoaXMgcG9pbnQsIGFsbCB0aGUgY2hpbGRyZW4gaGF2ZSB0aGVpciBkaW1lbnNpb25zIHNldC4gV2UgbmVlZCB0b1xuICAgICAgLy8gZmluZCB0aGVpciBwb3NpdGlvbi4gSW4gb3JkZXIgdG8gZG8gdGhhdCwgd2UgYWNjdW11bGF0ZSBkYXRhIGluXG4gICAgICAvLyB2YXJpYWJsZXMgdGhhdCBhcmUgYWxzbyB1c2VmdWwgdG8gY29tcHV0ZSB0aGUgdG90YWwgZGltZW5zaW9ucyBvZiB0aGVcbiAgICAgIC8vIGNvbnRhaW5lciFcbiAgICAgIG1haW5EaW0gKz0gbGVhZGluZ01haW5EaW07XG5cbiAgICAgIGZvciAoaSA9IGZpcnN0Q29tcGxleE1haW47IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pKSB7XG4gICAgICAgICAgLy8gSW4gY2FzZSB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgYW5kIGhhcyBsZWZ0L3RvcCBiZWluZ1xuICAgICAgICAgIC8vIGRlZmluZWQsIHdlIG92ZXJyaWRlIHRoZSBwb3NpdGlvbiB0byB3aGF0ZXZlciB0aGUgdXNlciBzYWlkXG4gICAgICAgICAgLy8gKGFuZCBtYXJnaW4vYm9yZGVyKS5cbiAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW21haW5BeGlzXV0gPSBnZXRQb3NpdGlvbihjaGlsZCwgbGVhZGluZ1ttYWluQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgbWFpbkF4aXMpICtcbiAgICAgICAgICAgIGdldExlYWRpbmdNYXJnaW4oY2hpbGQsIG1haW5BeGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiB0aGUgY2hpbGQgaXMgcG9zaXRpb24gYWJzb2x1dGUgKHdpdGhvdXQgdG9wL2xlZnQpIG9yIHJlbGF0aXZlLFxuICAgICAgICAgIC8vIHdlIHB1dCBpdCBhdCB0aGUgY3VycmVudCBhY2N1bXVsYXRlZCBvZmZzZXQuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1ttYWluQXhpc11dICs9IG1haW5EaW07XG5cbiAgICAgICAgICAvLyBEZWZpbmUgdGhlIHRyYWlsaW5nIHBvc2l0aW9uIGFjY29yZGluZ2x5LlxuICAgICAgICAgIGlmIChpc01haW5EaW1EZWZpbmVkKSB7XG4gICAgICAgICAgICBzZXRUcmFpbGluZ1Bvc2l0aW9uKG5vZGUsIGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gTm93IHRoYXQgd2UgcGxhY2VkIHRoZSBlbGVtZW50LCB3ZSBuZWVkIHRvIHVwZGF0ZSB0aGUgdmFyaWFibGVzXG4gICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIGRvIHRoYXQgZm9yIHJlbGF0aXZlIGVsZW1lbnRzLiBBYnNvbHV0ZSBlbGVtZW50c1xuICAgICAgICAgIC8vIGRvIG5vdCB0YWtlIHBhcnQgaW4gdGhhdCBwaGFzZS5cbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSA9PT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICAvLyBUaGUgbWFpbiBkaW1lbnNpb24gaXMgdGhlIHN1bSBvZiBhbGwgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBwbHVzXG4gICAgICAgICAgICAvLyB0aGUgc3BhY2luZy5cbiAgICAgICAgICAgIG1haW5EaW0gKz0gYmV0d2Vlbk1haW5EaW0gKyBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBtYWluQXhpcyk7XG4gICAgICAgICAgICAvLyBUaGUgY3Jvc3MgZGltZW5zaW9uIGlzIHRoZSBtYXggb2YgdGhlIGVsZW1lbnRzIGRpbWVuc2lvbiBzaW5jZSB0aGVyZVxuICAgICAgICAgICAgLy8gY2FuIG9ubHkgYmUgb25lIGVsZW1lbnQgaW4gdGhhdCBjcm9zcyBkaW1lbnNpb24uXG4gICAgICAgICAgICBjcm9zc0RpbSA9IGZtYXhmKGNyb3NzRGltLCBib3VuZEF4aXMoY2hpbGQsIGNyb3NzQXhpcywgZ2V0RGltV2l0aE1hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmZsb2F0Ki8gY29udGFpbmVyQ3Jvc3NBeGlzID0gbm9kZS5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgaWYgKCFpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgICBjb250YWluZXJDcm9zc0F4aXMgPSBmbWF4ZihcbiAgICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAgIC8vIGlzIGFnZ3JlZ2F0ZSB2aWEgYSBtYXggZnVuY3Rpb24uIEludGVybWVkaWF0ZSBuZWdhdGl2ZSB2YWx1ZXNcbiAgICAgICAgICAvLyBjYW4gbWVzcyB0aGlzIGNvbXB1dGF0aW9uIG90aGVyd2lzZVxuICAgICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGNyb3NzRGltICsgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zcyksXG4gICAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICAvLyA8TG9vcCBEPiBQb3NpdGlvbiBlbGVtZW50cyBpbiB0aGUgY3Jvc3MgYXhpc1xuICAgICAgZm9yIChpID0gZmlyc3RDb21wbGV4Q3Jvc3M7IGkgPCBlbmRMaW5lOyArK2kpIHtcbiAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldO1xuXG4gICAgICAgIGlmIChnZXRQb3NpdGlvblR5cGUoY2hpbGQpID09PSBDU1NfUE9TSVRJT05fQUJTT0xVVEUgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjaGlsZCwgbGVhZGluZ1tjcm9zc0F4aXNdKSkge1xuICAgICAgICAgIC8vIEluIGNhc2UgdGhlIGNoaWxkIGlzIGFic29sdXRlbHkgcG9zaXRpb25uZWQgYW5kIGhhcyBhXG4gICAgICAgICAgLy8gdG9wL2xlZnQvYm90dG9tL3JpZ2h0IGJlaW5nIHNldCwgd2Ugb3ZlcnJpZGUgYWxsIHRoZSBwcmV2aW91c2x5XG4gICAgICAgICAgLy8gY29tcHV0ZWQgcG9zaXRpb25zIHRvIHNldCBpdCBjb3JyZWN0bHkuXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGdldFBvc2l0aW9uKGNoaWxkLCBsZWFkaW5nW2Nyb3NzQXhpc10pICtcbiAgICAgICAgICAgIGdldExlYWRpbmdCb3JkZXIobm9kZSwgY3Jvc3NBeGlzKSArXG4gICAgICAgICAgICBnZXRMZWFkaW5nTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyLypmbG9hdCovIGxlYWRpbmdDcm9zc0RpbSA9IGxlYWRpbmdQYWRkaW5nQW5kQm9yZGVyQ3Jvc3M7XG5cbiAgICAgICAgICAvLyBGb3IgYSByZWxhdGl2ZSBjaGlsZHJlbiwgd2UncmUgZWl0aGVyIHVzaW5nIGFsaWduSXRlbXMgKHBhcmVudCkgb3JcbiAgICAgICAgICAvLyBhbGlnblNlbGYgKGNoaWxkKSBpbiBvcmRlciB0byBkZXRlcm1pbmUgdGhlIHBvc2l0aW9uIGluIHRoZSBjcm9zcyBheGlzXG4gICAgICAgICAgaWYgKGdldFBvc2l0aW9uVHlwZShjaGlsZCkgPT09IENTU19QT1NJVElPTl9SRUxBVElWRSkge1xuICAgICAgICAgICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgICAgICAgICAgLy8gVGhpcyB2YXJpYWJsZSBpcyBpbnRlbnRpb25hbGx5IHJlLWRlZmluZWQgYXMgdGhlIGNvZGUgaXMgdHJhbnNwaWxlZCB0byBhIGJsb2NrIHNjb3BlIGxhbmd1YWdlXG4gICAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICAgICAgICAgICAgaWYgKGFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX1NUUkVUQ0gpIHtcbiAgICAgICAgICAgICAgLy8gWW91IGNhbiBvbmx5IHN0cmV0Y2ggaWYgdGhlIGRpbWVuc2lvbiBoYXMgbm90IGFscmVhZHkgYmVlbiBzZXRcbiAgICAgICAgICAgICAgLy8gcHJldmlvdXNseS5cbiAgICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGNoaWxkLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0pKSB7XG4gICAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAgICAgICAgICAgYm91bmRBeGlzKGNoaWxkLCBjcm9zc0F4aXMsIGNvbnRhaW5lckNyb3NzQXhpcyAtXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXRNYXJnaW5BeGlzKGNoaWxkLCBjcm9zc0F4aXMpKSxcbiAgICAgICAgICAgICAgICAgIC8vIFlvdSBuZXZlciB3YW50IHRvIGdvIHNtYWxsZXIgdGhhbiBwYWRkaW5nXG4gICAgICAgICAgICAgICAgICBnZXRQYWRkaW5nQW5kQm9yZGVyQXhpcyhjaGlsZCwgY3Jvc3NBeGlzKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25JdGVtICE9PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgICAvLyBUaGUgcmVtYWluaW5nIHNwYWNlIGJldHdlZW4gdGhlIHBhcmVudCBkaW1lbnNpb25zK3BhZGRpbmcgYW5kIGNoaWxkXG4gICAgICAgICAgICAgIC8vIGRpbWVuc2lvbnMrbWFyZ2luLlxuICAgICAgICAgICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQ3Jvc3NEaW0gPSBjb250YWluZXJDcm9zc0F4aXMgLVxuICAgICAgICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3MgLSBnZXREaW1XaXRoTWFyZ2luKGNoaWxkLCBjcm9zc0F4aXMpO1xuXG4gICAgICAgICAgICAgIGlmIChhbGlnbkl0ZW0gPT09IENTU19BTElHTl9DRU5URVIpIHtcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW0gLyAyO1xuICAgICAgICAgICAgICB9IGVsc2UgeyAvLyBDU1NfQUxJR05fRkxFWF9FTkRcbiAgICAgICAgICAgICAgICBsZWFkaW5nQ3Jvc3NEaW0gKz0gcmVtYWluaW5nQ3Jvc3NEaW07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBBbmQgd2UgYXBwbHkgdGhlIHBvc2l0aW9uXG4gICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSArPSBsaW5lc0Nyb3NzRGltICsgbGVhZGluZ0Nyb3NzRGltO1xuXG4gICAgICAgICAgLy8gRGVmaW5lIHRoZSB0cmFpbGluZyBwb3NpdGlvbiBhY2NvcmRpbmdseS5cbiAgICAgICAgICBpZiAoaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxpbmVzQ3Jvc3NEaW0gKz0gY3Jvc3NEaW07XG4gICAgICBsaW5lc01haW5EaW0gPSBmbWF4ZihsaW5lc01haW5EaW0sIG1haW5EaW0pO1xuICAgICAgbGluZXNDb3VudCArPSAxO1xuICAgICAgc3RhcnRMaW5lID0gZW5kTGluZTtcbiAgICB9XG5cbiAgICAvLyA8TG9vcCBFPlxuICAgIC8vXG4gICAgLy8gTm90ZShwcmVuYXV4KTogTW9yZSB0aGFuIG9uZSBsaW5lLCB3ZSBuZWVkIHRvIGxheW91dCB0aGUgY3Jvc3NBeGlzXG4gICAgLy8gYWNjb3JkaW5nIHRvIGFsaWduQ29udGVudC5cbiAgICAvL1xuICAgIC8vIE5vdGUgdGhhdCB3ZSBjb3VsZCBwcm9iYWJseSByZW1vdmUgPExvb3AgRD4gYW5kIGhhbmRsZSB0aGUgb25lIGxpbmUgY2FzZVxuICAgIC8vIGhlcmUgdG9vLCBidXQgZm9yIHRoZSBtb21lbnQgdGhpcyBpcyBzYWZlciBzaW5jZSBpdCB3b24ndCBpbnRlcmZlcmUgd2l0aFxuICAgIC8vIHByZXZpb3VzbHkgd29ya2luZyBjb2RlLlxuICAgIC8vXG4gICAgLy8gU2VlIHNwZWNzOlxuICAgIC8vIGh0dHA6Ly93d3cudzMub3JnL1RSLzIwMTIvQ1ItY3NzMy1mbGV4Ym94LTIwMTIwOTE4LyNsYXlvdXQtYWxnb3JpdGhtXG4gICAgLy8gc2VjdGlvbiA5LjRcbiAgICAvL1xuICAgIGlmIChsaW5lc0NvdW50ID4gMSAmJiBpc0Nyb3NzRGltRGVmaW5lZCkge1xuICAgICAgdmFyLypmbG9hdCovIG5vZGVDcm9zc0F4aXNJbm5lclNpemUgPSBub2RlLmxheW91dFtkaW1bY3Jvc3NBeGlzXV0gLVxuICAgICAgICAgIHBhZGRpbmdBbmRCb3JkZXJBeGlzQ3Jvc3M7XG4gICAgICB2YXIvKmZsb2F0Ki8gcmVtYWluaW5nQWxpZ25Db250ZW50RGltID0gbm9kZUNyb3NzQXhpc0lubmVyU2l6ZSAtIGxpbmVzQ3Jvc3NEaW07XG5cbiAgICAgIHZhci8qZmxvYXQqLyBjcm9zc0RpbUxlYWQgPSAwO1xuICAgICAgdmFyLypmbG9hdCovIGN1cnJlbnRMZWFkID0gbGVhZGluZ1BhZGRpbmdBbmRCb3JkZXJDcm9zcztcblxuICAgICAgdmFyLypjc3NfYWxpZ25fdCovIGFsaWduQ29udGVudCA9IGdldEFsaWduQ29udGVudChub2RlKTtcbiAgICAgIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9GTEVYX0VORCkge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW07XG4gICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudCA9PT0gQ1NTX0FMSUdOX0NFTlRFUikge1xuICAgICAgICBjdXJyZW50TGVhZCArPSByZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyAyO1xuICAgICAgfSBlbHNlIGlmIChhbGlnbkNvbnRlbnQgPT09IENTU19BTElHTl9TVFJFVENIKSB7XG4gICAgICAgIGlmIChub2RlQ3Jvc3NBeGlzSW5uZXJTaXplID4gbGluZXNDcm9zc0RpbSkge1xuICAgICAgICAgIGNyb3NzRGltTGVhZCA9IChyZW1haW5pbmdBbGlnbkNvbnRlbnREaW0gLyBsaW5lc0NvdW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIvKmludCovIGVuZEluZGV4ID0gMDtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsaW5lc0NvdW50OyArK2kpIHtcbiAgICAgICAgdmFyLyppbnQqLyBzdGFydEluZGV4ID0gZW5kSW5kZXg7XG5cbiAgICAgICAgLy8gY29tcHV0ZSB0aGUgbGluZSdzIGhlaWdodCBhbmQgZmluZCB0aGUgZW5kSW5kZXhcbiAgICAgICAgdmFyLypmbG9hdCovIGxpbmVIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKGlpID0gc3RhcnRJbmRleDsgaWkgPCBjaGlsZENvdW50OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNoaWxkLmxpbmVJbmRleCAhPT0gaSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghaXNVbmRlZmluZWQoY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSkpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHQgPSBmbWF4ZihcbiAgICAgICAgICAgICAgbGluZUhlaWdodCxcbiAgICAgICAgICAgICAgY2hpbGQubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSArIGdldE1hcmdpbkF4aXMoY2hpbGQsIGNyb3NzQXhpcylcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVuZEluZGV4ID0gaWk7XG4gICAgICAgIGxpbmVIZWlnaHQgKz0gY3Jvc3NEaW1MZWFkO1xuXG4gICAgICAgIGZvciAoaWkgPSBzdGFydEluZGV4OyBpaSA8IGVuZEluZGV4OyArK2lpKSB7XG4gICAgICAgICAgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2lpXTtcbiAgICAgICAgICBpZiAoZ2V0UG9zaXRpb25UeXBlKGNoaWxkKSAhPT0gQ1NTX1BPU0lUSU9OX1JFTEFUSVZFKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIvKmNzc19hbGlnbl90Ki8gYWxpZ25Db250ZW50QWxpZ25JdGVtID0gZ2V0QWxpZ25JdGVtKG5vZGUsIGNoaWxkKTtcbiAgICAgICAgICBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fRkxFWF9TVEFSVCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFsaWduQ29udGVudEFsaWduSXRlbSA9PT0gQ1NTX0FMSUdOX0ZMRVhfRU5EKSB7XG4gICAgICAgICAgICBjaGlsZC5sYXlvdXRbcG9zW2Nyb3NzQXhpc11dID0gY3VycmVudExlYWQgKyBsaW5lSGVpZ2h0IC0gZ2V0VHJhaWxpbmdNYXJnaW4oY2hpbGQsIGNyb3NzQXhpcykgLSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fQ0VOVEVSKSB7XG4gICAgICAgICAgICB2YXIvKmZsb2F0Ki8gY2hpbGRIZWlnaHQgPSBjaGlsZC5sYXlvdXRbZGltW2Nyb3NzQXhpc11dO1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgKGxpbmVIZWlnaHQgLSBjaGlsZEhlaWdodCkgLyAyO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYWxpZ25Db250ZW50QWxpZ25JdGVtID09PSBDU1NfQUxJR05fU1RSRVRDSCkge1xuICAgICAgICAgICAgY2hpbGQubGF5b3V0W3Bvc1tjcm9zc0F4aXNdXSA9IGN1cnJlbnRMZWFkICsgZ2V0TGVhZGluZ01hcmdpbihjaGlsZCwgY3Jvc3NBeGlzKTtcbiAgICAgICAgICAgIC8vIFRPRE8ocHJlbmF1eCk6IENvcnJlY3RseSBzZXQgdGhlIGhlaWdodCBvZiBpdGVtcyB3aXRoIHVuZGVmaW5lZFxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgKGF1dG8pIGNyb3NzQXhpcyBkaW1lbnNpb24uXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudExlYWQgKz0gbGluZUhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIvKmJvb2wqLyBuZWVkc01haW5UcmFpbGluZ1BvcyA9IGZhbHNlO1xuICAgIHZhci8qYm9vbCovIG5lZWRzQ3Jvc3NUcmFpbGluZ1BvcyA9IGZhbHNlO1xuXG4gICAgLy8gSWYgdGhlIHVzZXIgZGlkbid0IHNwZWNpZnkgYSB3aWR0aCBvciBoZWlnaHQsIGFuZCBpdCBoYXMgbm90IGJlZW4gc2V0XG4gICAgLy8gYnkgdGhlIGNvbnRhaW5lciwgdGhlbiB3ZSBzZXQgaXQgdmlhIHRoZSBjaGlsZHJlbi5cbiAgICBpZiAoIWlzTWFpbkRpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVttYWluQXhpc11dID0gZm1heGYoXG4gICAgICAgIC8vIFdlJ3JlIG1pc3NpbmcgdGhlIGxhc3QgcGFkZGluZyBhdCB0aGlzIHBvaW50IHRvIGdldCB0aGUgZmluYWxcbiAgICAgICAgLy8gZGltZW5zaW9uXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBtYWluQXhpcywgbGluZXNNYWluRGltICsgZ2V0VHJhaWxpbmdQYWRkaW5nQW5kQm9yZGVyKG5vZGUsIG1haW5BeGlzKSksXG4gICAgICAgIC8vIFdlIGNhbiBuZXZlciBhc3NpZ24gYSB3aWR0aCBzbWFsbGVyIHRoYW4gdGhlIHBhZGRpbmcgYW5kIGJvcmRlcnNcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNNYWluXG4gICAgICApO1xuXG4gICAgICBpZiAobWFpbkF4aXMgPT09IENTU19GTEVYX0RJUkVDVElPTl9ST1dfUkVWRVJTRSB8fFxuICAgICAgICAgIG1haW5BeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNNYWluVHJhaWxpbmdQb3MgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghaXNDcm9zc0RpbURlZmluZWQpIHtcbiAgICAgIG5vZGUubGF5b3V0W2RpbVtjcm9zc0F4aXNdXSA9IGZtYXhmKFxuICAgICAgICAvLyBGb3IgdGhlIGNyb3NzIGRpbSwgd2UgYWRkIGJvdGggc2lkZXMgYXQgdGhlIGVuZCBiZWNhdXNlIHRoZSB2YWx1ZVxuICAgICAgICAvLyBpcyBhZ2dyZWdhdGUgdmlhIGEgbWF4IGZ1bmN0aW9uLiBJbnRlcm1lZGlhdGUgbmVnYXRpdmUgdmFsdWVzXG4gICAgICAgIC8vIGNhbiBtZXNzIHRoaXMgY29tcHV0YXRpb24gb3RoZXJ3aXNlXG4gICAgICAgIGJvdW5kQXhpcyhub2RlLCBjcm9zc0F4aXMsIGxpbmVzQ3Jvc3NEaW0gKyBwYWRkaW5nQW5kQm9yZGVyQXhpc0Nyb3NzKSxcbiAgICAgICAgcGFkZGluZ0FuZEJvcmRlckF4aXNDcm9zc1xuICAgICAgKTtcblxuICAgICAgaWYgKGNyb3NzQXhpcyA9PT0gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPV19SRVZFUlNFIHx8XG4gICAgICAgICAgY3Jvc3NBeGlzID09PSBDU1NfRkxFWF9ESVJFQ1RJT05fQ09MVU1OX1JFVkVSU0UpIHtcbiAgICAgICAgbmVlZHNDcm9zc1RyYWlsaW5nUG9zID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBGPiBTZXQgdHJhaWxpbmcgcG9zaXRpb24gaWYgbmVjZXNzYXJ5XG4gICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zIHx8IG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGNoaWxkQ291bnQ7ICsraSkge1xuICAgICAgICBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV07XG5cbiAgICAgICAgaWYgKG5lZWRzTWFpblRyYWlsaW5nUG9zKSB7XG4gICAgICAgICAgc2V0VHJhaWxpbmdQb3NpdGlvbihub2RlLCBjaGlsZCwgbWFpbkF4aXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5lZWRzQ3Jvc3NUcmFpbGluZ1Bvcykge1xuICAgICAgICAgIHNldFRyYWlsaW5nUG9zaXRpb24obm9kZSwgY2hpbGQsIGNyb3NzQXhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyA8TG9vcCBHPiBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgYWJzb2x1dGVseSBwb3NpdGlvbmVkIGVsZW1lbnRzXG4gICAgY3VycmVudEFic29sdXRlQ2hpbGQgPSBmaXJzdEFic29sdXRlQ2hpbGQ7XG4gICAgd2hpbGUgKGN1cnJlbnRBYnNvbHV0ZUNoaWxkICE9PSBudWxsKSB7XG4gICAgICAvLyBQcmUtZmlsbCBkaW1lbnNpb25zIHdoZW4gdXNpbmcgYWJzb2x1dGUgcG9zaXRpb24gYW5kIGJvdGggb2Zmc2V0cyBmb3JcbiAgICAgIC8vIHRoZSBheGlzIGFyZSBkZWZpbmVkIChlaXRoZXIgYm90aCBsZWZ0IGFuZCByaWdodCBvciB0b3AgYW5kIGJvdHRvbSkuXG4gICAgICBmb3IgKGlpID0gMDsgaWkgPCAyOyBpaSsrKSB7XG4gICAgICAgIGF4aXMgPSAoaWkgIT09IDApID8gQ1NTX0ZMRVhfRElSRUNUSU9OX1JPVyA6IENTU19GTEVYX0RJUkVDVElPTl9DT0xVTU47XG5cbiAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChub2RlLmxheW91dFtkaW1bYXhpc11dKSAmJlxuICAgICAgICAgICAgIWlzRGltRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcykgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkgJiZcbiAgICAgICAgICAgIGlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pKSB7XG4gICAgICAgICAgY3VycmVudEFic29sdXRlQ2hpbGQubGF5b3V0W2RpbVtheGlzXV0gPSBmbWF4ZihcbiAgICAgICAgICAgIGJvdW5kQXhpcyhjdXJyZW50QWJzb2x1dGVDaGlsZCwgYXhpcywgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICAgIGdldEJvcmRlckF4aXMobm9kZSwgYXhpcykgLVxuICAgICAgICAgICAgICBnZXRNYXJnaW5BeGlzKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBheGlzKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCBsZWFkaW5nW2F4aXNdKSAtXG4gICAgICAgICAgICAgIGdldFBvc2l0aW9uKGN1cnJlbnRBYnNvbHV0ZUNoaWxkLCB0cmFpbGluZ1theGlzXSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICAvLyBZb3UgbmV2ZXIgd2FudCB0byBnbyBzbWFsbGVyIHRoYW4gcGFkZGluZ1xuICAgICAgICAgICAgZ2V0UGFkZGluZ0FuZEJvcmRlckF4aXMoY3VycmVudEFic29sdXRlQ2hpbGQsIGF4aXMpXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc1Bvc0RlZmluZWQoY3VycmVudEFic29sdXRlQ2hpbGQsIHRyYWlsaW5nW2F4aXNdKSAmJlxuICAgICAgICAgICAgIWlzUG9zRGVmaW5lZChjdXJyZW50QWJzb2x1dGVDaGlsZCwgbGVhZGluZ1theGlzXSkpIHtcbiAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbbGVhZGluZ1theGlzXV0gPVxuICAgICAgICAgICAgbm9kZS5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZC5sYXlvdXRbZGltW2F4aXNdXSAtXG4gICAgICAgICAgICBnZXRQb3NpdGlvbihjdXJyZW50QWJzb2x1dGVDaGlsZCwgdHJhaWxpbmdbYXhpc10pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNoaWxkID0gY3VycmVudEFic29sdXRlQ2hpbGQ7XG4gICAgICBjdXJyZW50QWJzb2x1dGVDaGlsZCA9IGN1cnJlbnRBYnNvbHV0ZUNoaWxkLm5leHRBYnNvbHV0ZUNoaWxkO1xuICAgICAgY2hpbGQubmV4dEFic29sdXRlQ2hpbGQgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxheW91dE5vZGUobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbikge1xuICAgIG5vZGUuc2hvdWxkVXBkYXRlID0gdHJ1ZTtcblxuICAgIHZhciBkaXJlY3Rpb24gPSBub2RlLnN0eWxlLmRpcmVjdGlvbiB8fCBDU1NfRElSRUNUSU9OX0xUUjtcbiAgICB2YXIgc2tpcExheW91dCA9XG4gICAgICAhbm9kZS5pc0RpcnR5ICYmXG4gICAgICBub2RlLmxhc3RMYXlvdXQgJiZcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPT09IG5vZGUubGF5b3V0LmhlaWdodCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnJlcXVlc3RlZFdpZHRoID09PSBub2RlLmxheW91dC53aWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LnBhcmVudE1heFdpZHRoID09PSBwYXJlbnRNYXhXaWR0aCAmJlxuICAgICAgbm9kZS5sYXN0TGF5b3V0LmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9uO1xuXG4gICAgaWYgKHNraXBMYXlvdXQpIHtcbiAgICAgIG5vZGUubGF5b3V0LndpZHRoID0gbm9kZS5sYXN0TGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXlvdXQuaGVpZ2h0ID0gbm9kZS5sYXN0TGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGF5b3V0LnRvcCA9IG5vZGUubGFzdExheW91dC50b3A7XG4gICAgICBub2RlLmxheW91dC5sZWZ0ID0gbm9kZS5sYXN0TGF5b3V0LmxlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghbm9kZS5sYXN0TGF5b3V0KSB7XG4gICAgICAgIG5vZGUubGFzdExheW91dCA9IHt9O1xuICAgICAgfVxuXG4gICAgICBub2RlLmxhc3RMYXlvdXQucmVxdWVzdGVkV2lkdGggPSBub2RlLmxheW91dC53aWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5yZXF1ZXN0ZWRIZWlnaHQgPSBub2RlLmxheW91dC5oZWlnaHQ7XG4gICAgICBub2RlLmxhc3RMYXlvdXQucGFyZW50TWF4V2lkdGggPSBwYXJlbnRNYXhXaWR0aDtcbiAgICAgIG5vZGUubGFzdExheW91dC5kaXJlY3Rpb24gPSBkaXJlY3Rpb247XG5cbiAgICAgIC8vIFJlc2V0IGNoaWxkIGxheW91dHNcbiAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBjaGlsZC5sYXlvdXQud2lkdGggPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC5oZWlnaHQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNoaWxkLmxheW91dC50b3AgPSAwO1xuICAgICAgICBjaGlsZC5sYXlvdXQubGVmdCA9IDA7XG4gICAgICB9KTtcblxuICAgICAgbGF5b3V0Tm9kZUltcGwobm9kZSwgcGFyZW50TWF4V2lkdGgsIHBhcmVudERpcmVjdGlvbik7XG5cbiAgICAgIG5vZGUubGFzdExheW91dC53aWR0aCA9IG5vZGUubGF5b3V0LndpZHRoO1xuICAgICAgbm9kZS5sYXN0TGF5b3V0LmhlaWdodCA9IG5vZGUubGF5b3V0LmhlaWdodDtcbiAgICAgIG5vZGUubGFzdExheW91dC50b3AgPSBub2RlLmxheW91dC50b3A7XG4gICAgICBub2RlLmxhc3RMYXlvdXQubGVmdCA9IG5vZGUubGF5b3V0LmxlZnQ7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBsYXlvdXROb2RlSW1wbDogbGF5b3V0Tm9kZUltcGwsXG4gICAgY29tcHV0ZUxheW91dDogbGF5b3V0Tm9kZSxcbiAgICBmaWxsTm9kZXM6IGZpbGxOb2Rlc1xuICB9O1xufSkoKTtcblxuLy8gVGhpcyBtb2R1bGUgZXhwb3J0IGlzIG9ubHkgdXNlZCBmb3IgdGhlIHB1cnBvc2VzIG9mIHVuaXQgdGVzdGluZyB0aGlzIGZpbGUuIFdoZW5cbi8vIHRoZSBsaWJyYXJ5IGlzIHBhY2thZ2VkIHRoaXMgZmlsZSBpcyBpbmNsdWRlZCB3aXRoaW4gY3NzLWxheW91dC5qcyB3aGljaCBmb3Jtc1xuLy8gdGhlIHB1YmxpYyBBUEkuXG5pZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gIG1vZHVsZS5leHBvcnRzID0gY29tcHV0ZUxheW91dDtcbn1cblxuXG4gIHJldHVybiBmdW5jdGlvbihub2RlKSB7XG4gICAgLyplc2xpbnQtZGlzYWJsZSAqL1xuICAgIC8vIGRpc2FibGluZyBFU0xpbnQgYmVjYXVzZSB0aGlzIGNvZGUgcmVsaWVzIG9uIHRoZSBhYm92ZSBpbmNsdWRlXG4gICAgY29tcHV0ZUxheW91dC5maWxsTm9kZXMobm9kZSk7XG4gICAgY29tcHV0ZUxheW91dC5jb21wdXRlTGF5b3V0KG5vZGUpO1xuICAgIC8qZXNsaW50LWVuYWJsZSAqL1xuICB9O1xufSkpO1xuIiwiZnVuY3Rpb24gRSAoKSB7XG4gIC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cbiAgLy8gKHZpYSBodHRwczovL2dpdGh1Yi5jb20vbGlwc21hY2sgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2lzc3Vlcy8zKVxufVxuXG5FLnByb3RvdHlwZSA9IHtcbiAgb246IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcblxuICAgIChlW25hbWVdIHx8IChlW25hbWVdID0gW10pKS5wdXNoKHtcbiAgICAgIGZuOiBjYWxsYmFjayxcbiAgICAgIGN0eDogY3R4XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBvbmNlOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XG4gICAgICBzZWxmLm9mZihuYW1lLCBsaXN0ZW5lcik7XG4gICAgICBjYWxsYmFjay5hcHBseShjdHgsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIGxpc3RlbmVyLl8gPSBjYWxsYmFja1xuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xuICB9LFxuXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIGRhdGEgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgdmFyIGV2dEFyciA9ICgodGhpcy5lIHx8ICh0aGlzLmUgPSB7fSkpW25hbWVdIHx8IFtdKS5zbGljZSgpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgbGVuID0gZXZ0QXJyLmxlbmd0aDtcblxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBldnRBcnJbaV0uZm4uYXBwbHkoZXZ0QXJyW2ldLmN0eCwgZGF0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgb2ZmOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2spIHtcbiAgICB2YXIgZSA9IHRoaXMuZSB8fCAodGhpcy5lID0ge30pO1xuICAgIHZhciBldnRzID0gZVtuYW1lXTtcbiAgICB2YXIgbGl2ZUV2ZW50cyA9IFtdO1xuXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBldnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChldnRzW2ldLmZuICE9PSBjYWxsYmFjayAmJiBldnRzW2ldLmZuLl8gIT09IGNhbGxiYWNrKVxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgZXZlbnQgZnJvbSBxdWV1ZSB0byBwcmV2ZW50IG1lbW9yeSBsZWFrXG4gICAgLy8gU3VnZ2VzdGVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9sYXpkXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxuXG4gICAgKGxpdmVFdmVudHMubGVuZ3RoKVxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xuICAgICAgOiBkZWxldGUgZVtuYW1lXTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEU7XG5tb2R1bGUuZXhwb3J0cy5UaW55RW1pdHRlciA9IEU7XG4iLCJpbXBvcnQgaW1hZ2VNYW5hZ2VyIGZyb20gJy4vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuXG5pbnRlcmZhY2UgQ2hhckRhdGEge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbiAgdzogbnVtYmVyO1xuICBoOiBudW1iZXI7XG4gIG9mZlg6IG51bWJlcjtcbiAgb2ZmWTogbnVtYmVyO1xuICB4YWR2YW5jZTogbnVtYmVyO1xuICBrZXJuaW5nOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9O1xufVxuXG5pbnRlcmZhY2UgQ2hhcnMge1xuICBba2V5OiBzdHJpbmddOiBDaGFyRGF0YTtcbn1cblxudHlwZSBDb25maWdMaW5lRGF0YSA9IHtcbiAgbGluZTogc3RyaW5nW107XG4gIGluZGV4OiBudW1iZXI7XG59O1xuXG5cbi8qKlxuICogaHR0cDovL3d3dy5hbmdlbGNvZGUuY29tL3Byb2R1Y3RzL2JtZm9udC9kb2MvZmlsZV9mb3JtYXQuaHRtbFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCaXRNYXBGb250IHtcbiAgcHJpdmF0ZSBjb25maWc6IHN0cmluZztcbiAgcHVibGljIGV2ZW50OiBhbnk7XG5cbiAgcHVibGljIGNoYXJzOiBDaGFycztcblxuICBwdWJsaWMgcmVhZHkgPSBmYWxzZTtcbiAgcHVibGljIHRleHR1cmU6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsO1xuICBwdWJsaWMgbGluZUhlaWdodD86IG51bWJlcjtcbiAgcHVibGljIGZvbnRTaXplPzogbnVtYmVyO1xuXG5cbiAgLy8gcG9vbOeahOWunueOsOaUvuWIsOexu+mHjOmdouWunueOsOW5tuS4jeS8mOmbhe+8jOWFiOWOu+aOieS6hlxuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcsIHNyYzogc3RyaW5nLCBjb25maWc6IHN0cmluZykge1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMuY2hhcnMgPSB0aGlzLnBhcnNlQ29uZmlnKGNvbmZpZyk7XG4gICAgdGhpcy5ldmVudCA9IG5ldyBUaW55RW1pdHRlci5UaW55RW1pdHRlcigpO1xuXG4gICAgdGhpcy50ZXh0dXJlID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZShzcmMsICh0ZXh0dXJlLCBmcm9tQ2FjaGUpID0+IHtcbiAgICAgIGlmIChmcm9tQ2FjaGUpIHtcbiAgICAgICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcbiAgICAgIH1cbiAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuICAgICAgdGhpcy5ldmVudC5lbWl0KCd0ZXh0X19sb2FkX19kb25lJyk7XG4gICAgfSk7XG4gIH1cblxuICBwYXJzZUNvbmZpZyhmbnRUZXh0OiBzdHJpbmcpIHtcbiAgICBmbnRUZXh0ID0gZm50VGV4dC5zcGxpdCgnXFxyXFxuJykuam9pbignXFxuJyk7XG4gICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gZm50VGV4dC5zcGxpdCgnXFxuJyk7XG4gICAgY29uc3QgbGluZXNQYXJzZWQ6IHN0cmluZ1tdW10gPSBsaW5lcy5tYXAobGluZSA9PiBsaW5lLnRyaW0oKS5zcGxpdCgnICcpKTtcblxuICAgIGNvbnN0IGNoYXJzTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjaGFycycpO1xuICAgIGNvbnN0IGNoYXJzQ291bnQ6IG51bWJlciA9IHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUoY2hhcnNMaW5lLmxpbmUsICdjb3VudCcpO1xuXG4gICAgY29uc3QgY29tbW9uTGluZTogQ29uZmlnTGluZURhdGEgPSB0aGlzLmdldENvbmZpZ0J5TGluZU5hbWUobGluZXNQYXJzZWQsICdjb21tb24nKTtcbiAgICB0aGlzLmxpbmVIZWlnaHQgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbW1vbkxpbmUubGluZSwgJ2xpbmVIZWlnaHQnKTtcblxuICAgIGNvbnN0IGluZm9MaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2luZm8nKTtcbiAgICB0aGlzLmZvbnRTaXplID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShpbmZvTGluZS5saW5lLCAnc2l6ZScpO1xuXG4gICAgLy8g5o6l5Y24IGtlcm5pbmdzXG4gICAgY29uc3Qga2VybmluZ3NMaW5lOiBDb25maWdMaW5lRGF0YSA9IHRoaXMuZ2V0Q29uZmlnQnlMaW5lTmFtZShsaW5lc1BhcnNlZCwgJ2tlcm5pbmdzJyk7XG4gICAgbGV0IGtlcm5pbmdzQ291bnQgPSAwO1xuICAgIGxldCBrZXJuaW5nc1N0YXJ0ID0gLTE7XG4gICAgaWYgKGtlcm5pbmdzTGluZS5saW5lKSB7XG4gICAgICBrZXJuaW5nc0NvdW50ID0gdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShrZXJuaW5nc0xpbmUubGluZSwgJ2NvdW50Jyk7XG4gICAgICBrZXJuaW5nc1N0YXJ0ID0ga2VybmluZ3NMaW5lLmluZGV4ICsgMTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGFyczogQ2hhcnMgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gNDsgaSA8IDQgKyBjaGFyc0NvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IGNoYXJUZXh0OiBzdHJpbmcgPSBsaW5lc1tpXTtcbiAgICAgIGNvbnN0IGxldHRlcjogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnaWQnKSk7XG5cbiAgICAgIGNvbnN0IGM6IENoYXJEYXRhID0ge1xuICAgICAgICB4OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneCcpLFxuICAgICAgICB5OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneScpLFxuICAgICAgICB3OiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAnd2lkdGgnKSxcbiAgICAgICAgaDogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ2hlaWdodCcpLFxuICAgICAgICBvZmZYOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneG9mZnNldCcpLFxuICAgICAgICBvZmZZOiB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNoYXJUZXh0LCAneW9mZnNldCcpLFxuICAgICAgICB4YWR2YW5jZTogdGhpcy5nZXRDb25maWdCeUtleUluT25lTGluZShjaGFyVGV4dCwgJ3hhZHZhbmNlJyksXG4gICAgICAgIGtlcm5pbmc6IHt9XG4gICAgICB9O1xuICAgICAgY2hhcnNbbGV0dGVyXSA9IGM7XG4gICAgfVxuXG4gICAgLy8gcGFyc2Uga2VybmluZ3NcbiAgICBpZiAoa2VybmluZ3NDb3VudCkge1xuICAgICAgZm9yIChsZXQgaSA9IGtlcm5pbmdzU3RhcnQ7IGkgPD0ga2VybmluZ3NTdGFydCArIGtlcm5pbmdzQ291bnQ7IGkrKykge1xuICAgICAgICBjb25zdCBsaW5lOiBzdHJpbmdbXSA9IGxpbmVzUGFyc2VkW2ldO1xuICAgICAgICBjb25zdCBmaXJzdDogc3RyaW5nID0gU3RyaW5nLmZyb21DaGFyQ29kZSh0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdmaXJzdCcpKTtcbiAgICAgICAgY29uc3Qgc2Vjb25kOiBzdHJpbmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHRoaXMuZ2V0Q29uZmlnQnlLZXlJbk9uZUxpbmUobGluZSwgJ3NlY29uZCcpKTtcbiAgICAgICAgY29uc3QgYW1vdW50OiBudW1iZXIgPSB0aGlzLmdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGxpbmUsICdhbW91bnQnKTtcblxuICAgICAgICBpZiAoY2hhcnNbc2Vjb25kXSkge1xuICAgICAgICAgIGNoYXJzW3NlY29uZF0ua2VybmluZ1tmaXJzdF0gPSBhbW91bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hhcnM7XG4gIH1cblxuICBnZXRDb25maWdCeUxpbmVOYW1lKGxpbmVzUGFyc2VkOiBzdHJpbmdbXVtdLCBsaW5lTmFtZSA9ICcnKTogQ29uZmlnTGluZURhdGEge1xuICAgIGxldCBpbmRleCA9IC0xO1xuICAgIGxldCBsaW5lOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGxlbiA9IGxpbmVzUGFyc2VkLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW06IHN0cmluZ1tdID0gbGluZXNQYXJzZWRbaV07XG5cbiAgICAgIGlmIChpdGVtWzBdID09PSBsaW5lTmFtZSkge1xuICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgIGxpbmUgPSBpdGVtO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lLFxuICAgICAgaW5kZXgsXG4gICAgfTtcbiAgfVxuXG4gIGdldENvbmZpZ0J5S2V5SW5PbmVMaW5lKGNvbmZpZ1RleHQ6IHN0cmluZ1tdIHwgc3RyaW5nLCBrZXk6IHN0cmluZykge1xuICAgIGNvbnN0IGl0ZW1Db25maWdUZXh0TGlzdCA9IEFycmF5LmlzQXJyYXkoY29uZmlnVGV4dCkgPyBjb25maWdUZXh0IDogY29uZmlnVGV4dC5zcGxpdCgnICcpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIHsgbGVuZ3RoIH0gPSBpdGVtQ29uZmlnVGV4dExpc3Q7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaXRlbUNvbmZpZ1RleHQgPSBpdGVtQ29uZmlnVGV4dExpc3RbaV07XG4gICAgICBpZiAoa2V5ID09PSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoMCwga2V5Lmxlbmd0aCkpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpdGVtQ29uZmlnVGV4dC5zdWJzdHJpbmcoa2V5Lmxlbmd0aCArIDEpO1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG59XG4iLCJpbnRlcmZhY2UgRGVidWdJbmZvSXRlbSB7XG4gIHN0YXJ0OiBudW1iZXI7XG4gIGlzSW5uZXI6IGJvb2xlYW47XG4gIGVuZD86IG51bWJlcjtcbiAgY29zdD86IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGVidWdJbmZvIHtcbiAgcHVibGljIGluZm86IHsgW2tleTogc3RyaW5nXTogRGVidWdJbmZvSXRlbSB9ID0ge307XG4gIHB1YmxpYyB0b3RhbFN0YXJ0OiBudW1iZXIgPSAwO1xuICBwdWJsaWMgdG90YWxDb3N0OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHN0YXJ0KG5hbWU6IHN0cmluZywgaXNJbm5lcjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMudG90YWxTdGFydCA9PT0gMCkge1xuICAgICAgdGhpcy50b3RhbFN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB9XG5cbiAgICB0aGlzLmluZm9bbmFtZV0gPSB7XG4gICAgICBzdGFydDogRGF0ZS5ub3coKSxcbiAgICAgIGlzSW5uZXIsXG4gICAgfTtcbiAgfVxuXG4gIGVuZChuYW1lOiBzdHJpbmcpIHtcbiAgICBpZiAodGhpcy5pbmZvW25hbWVdKSB7XG4gICAgICB0aGlzLmluZm9bbmFtZV0uZW5kID0gRGF0ZS5ub3coKTtcbiAgICAgIHRoaXMuaW5mb1tuYW1lXS5jb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMuaW5mb1tuYW1lXS5zdGFydDtcbiAgICAgIHRoaXMudG90YWxDb3N0ID0gKHRoaXMuaW5mb1tuYW1lXS5lbmQgYXMgbnVtYmVyKSAtIHRoaXMudG90YWxTdGFydDtcbiAgICB9XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmluZm8gPSB7fTtcbiAgICB0aGlzLnRvdGFsU3RhcnQgPSAwO1xuICAgIHRoaXMudG90YWxDb3N0ID0gMDtcbiAgfVxuXG4gIGxvZyhuZWVkSW5uZXI6IGJvb2xlYW4gPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgbGV0IGxvZ0luZm8gPSAnTGF5b3V0IGRlYnVnIGluZm86IFxcbic7XG4gICAgbG9nSW5mbyArPSBPYmplY3Qua2V5cyh0aGlzLmluZm8pLnJlZHVjZSgoc3VtLCBjdXJyKSA9PiB7XG4gICAgICBpZiAodGhpcy5pbmZvW2N1cnJdLmlzSW5uZXIgJiYgIW5lZWRJbm5lcikge1xuICAgICAgICByZXR1cm4gc3VtO1xuICAgICAgfVxuICAgICAgc3VtICs9IGAke2N1cnJ9OiAke3RoaXMuaW5mb1tjdXJyXS5jb3N0fVxcbmA7XG4gICAgICByZXR1cm4gc3VtO1xuICAgIH0sICcnKTtcblxuICAgIGxvZ0luZm8gKz0gYHRvdGFsQ29zdDogJHt0aGlzLnRvdGFsQ29zdH1cXG5gO1xuXG4gICAgcmV0dXJuIGxvZ0luZm87XG4gIH1cbn1cbiIsImltcG9ydCBQb29sIGZyb20gJy4vcG9vbCc7XG5pbXBvcnQgeyBub25lIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52JztcblxudHlwZSBDYWxsYmFjayA9IChpbWc6IEhUTUxJbWFnZUVsZW1lbnQsIGZyb21DYWNoZTogYm9vbGVhbikgPT4gdm9pZDtcbmludGVyZmFjZSBJbWFnZUNhY2hlIHtcbiAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBsb2FkRG9uZTogYm9vbGVhbjtcbiAgb25sb2FkY2JrczogQ2FsbGJhY2tbXTtcbiAgb25lcnJvcmNia3M6IENhbGxiYWNrW107XG59XG5cbmNsYXNzIEltYWdlTWFuYWdlciB7XG4gIHByaXZhdGUgaW1nUG9vbCA9IG5ldyBQb29sPEltYWdlQ2FjaGU+KCdpbWdQb29sJyk7XG4gIFxuICBnZXRSZXMoc3JjOiBzdHJpbmcpOiBJbWFnZUNhY2hlIHtcbiAgICByZXR1cm4gdGhpcy5pbWdQb29sLmdldChzcmMpO1xuICB9XG5cbiAgbG9hZEltYWdlUHJvbWlzZShzcmM6IHN0cmluZyk6IFByb21pc2U8SFRNTEltYWdlRWxlbWVudCB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5sb2FkSW1hZ2Uoc3JjLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH0pO1xuICB9XG5cbiAgbG9hZEltYWdlKHNyYzogc3RyaW5nLCBzdWNjZXNzOiBDYWxsYmFjayA9IG5vbmUsIGZhaWw6IENhbGxiYWNrID0gbm9uZSk6IEhUTUxJbWFnZUVsZW1lbnQgfCBudWxsIHtcbiAgICBpZiAoIXNyYykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGltZzogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb25zdCBjYWNoZSA9IHRoaXMuZ2V0UmVzKHNyYyk7XG5cbiAgICAvLyDlm77niYflt7Lnu4/ooqvliqDovb3ov4fvvIznm7TmjqXov5Tlm57lm77niYflubbkuJTmiafooYzlm57osINcbiAgICBpZiAoY2FjaGUgJiYgY2FjaGUubG9hZERvbmUpIHtcbiAgICAgIGltZyA9IGNhY2hlLmltZztcbiAgICAgIHN1Y2Nlc3MoaW1nLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKGNhY2hlICYmICFjYWNoZS5sb2FkRG9uZSkge1xuICAgICAgLy8g5Zu+54mH5q2j5Zyo5Yqg6L296L+H56iL5Lit77yM6L+U5Zue5Zu+54mH5bm25LiU562J5b6F5Zu+54mH5Yqg6L295a6M5oiQ5omn6KGM5Zue6LCDXG4gICAgICBpbWcgPSBjYWNoZS5pbWc7XG5cbiAgICAgIGNhY2hlLm9ubG9hZGNia3MucHVzaChzdWNjZXNzKTtcbiAgICAgIGNhY2hlLm9uZXJyb3JjYmtzLnB1c2goZmFpbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIOWIm+W7uuWbvueJh++8jOWwhuWbnuiwg+WHveaVsOaOqOWFpeWbnuiwg+WHveaVsOagiFxuICAgICAgaW1nID0gZW52LmNyZWF0ZUltYWdlKCkgYXMgSFRNTEltYWdlRWxlbWVudDtcbiAgICAgIGNvbnN0IG5ld0NhY2hlID0ge1xuICAgICAgICBpbWcsXG4gICAgICAgIGxvYWREb25lOiBmYWxzZSxcbiAgICAgICAgb25sb2FkY2JrczogW3N1Y2Nlc3NdLFxuICAgICAgICBvbmVycm9yY2JrczogW2ZhaWxdLFxuICAgICAgfVxuICAgICBcbiAgICAgIHRoaXMuaW1nUG9vbC5zZXQoc3JjLCBuZXdDYWNoZSk7XG5cbiAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLmxvYWREb25lID0gdHJ1ZTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2Jrcy5mb3JFYWNoKGZuID0+IGZuKGltZywgZmFsc2UpKTtcbiAgICAgICAgbmV3Q2FjaGUub25sb2FkY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgfTtcblxuICAgICAgaW1nLm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgIG5ld0NhY2hlLm9uZXJyb3JjYmtzLmZvckVhY2goZm4gPT4gZm4oaW1nLCBmYWxzZSkpO1xuICAgICAgICBuZXdDYWNoZS5vbmVycm9yY2JrcyA9IFtdO1xuICAgICAgICBuZXdDYWNoZS5vbmxvYWRjYmtzID0gW107XG4gICAgICB9O1xuXG4gICAgICBpbWcuc3JjID0gc3JjO1xuICAgIH1cblxuICAgIHJldHVybiBpbWc7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlTWFuYWdlcigpO1xuIiwiY29uc3QgcG9vbHM6IFBvb2w8YW55PltdID0gW107XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvb2w8VD4ge1xuICBwdWJsaWMgbmFtZSA9ICdwb29sJ1xuICBwdWJsaWMgcG9vbDogeyBba2V5OiBzdHJpbmddOiBUIH0gPSB7fTtcblxuICBjb25zdHJ1Y3RvcihuYW1lID0gJ3Bvb2wnKSB7XG4gICAgY29uc3QgY3VyciA9IHBvb2xzLmZpbmQoaXRlbSA9PiBpdGVtLm5hbWUgPT09IG5hbWUpO1xuXG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIHJldHVybiBjdXJyO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5wb29sID0ge307XG5cbiAgICBwb29scy5wdXNoKHRoaXMpO1xuICB9XG5cbiAgZ2V0KGtleTogc3RyaW5nKTogVCB7XG4gICAgcmV0dXJuIHRoaXMucG9vbFtrZXldO1xuICB9XG5cbiAgc2V0KGtleTogc3RyaW5nLCB2YWx1ZTogVCkge1xuICAgIHRoaXMucG9vbFtrZXldID0gdmFsdWU7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICB0aGlzLnBvb2wgPSB7fTtcbiAgfVxuXG4gIGdldExpc3QoKTogVFtdIHtcbiAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLnBvb2wpO1xuICB9XG59XG4iLCJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3Qge1xuICBwdWJsaWMgd2lkdGggPSAwO1xuICBwdWJsaWMgaGVpZ2h0ID0gMDtcbiAgcHVibGljIGxlZnQgPSAwO1xuICBwdWJsaWMgcmlnaHQgPSAwO1xuICBwdWJsaWMgdG9wID0gMDtcbiAgcHVibGljIGJvdHRvbSA9IDA7XG5cbiAgY29uc3RydWN0b3IobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMuc2V0KGxlZnQsIHRvcCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cblxuICBzZXQobGVmdCA9IDAsIHRvcCA9IDAsIHdpZHRoID0gMCwgaGVpZ2h0ID0gMCkge1xuICAgIHRoaXMubGVmdCA9IGxlZnQ7XG4gICAgdGhpcy50b3AgPSB0b3A7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgdGhpcy5yaWdodCA9IHRoaXMubGVmdCArIHRoaXMud2lkdGg7XG4gICAgdGhpcy5ib3R0b20gPSB0aGlzLnRvcCArIHRoaXMuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIOWIpOaWreS4pOS4quefqeW9ouaYr+WQpuebuOS6pFxuICAgKiDljp/nkIblj6/op4E6IGh0dHBzOi8vemh1YW5sYW4uemhpaHUuY29tL3AvMjk3MDQwNjRcbiAgICovXG4gIGludGVyc2VjdHMocmVjdDogUmVjdCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhKHRoaXMucmlnaHQgPCByZWN0LmxlZnQgfHwgcmVjdC5yaWdodCA8IHRoaXMubGVmdCB8fCB0aGlzLmJvdHRvbSA8IHJlY3QudG9wIHx8IHJlY3QuYm90dG9tIDwgdGhpcy50b3ApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDYWxsYmFjayB9IGZyb20gXCIuLi90eXBlc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWNrZXIge1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIHN0YXJ0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBhbmltYXRpb25JZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBjYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBpbm5lckNiczogQ2FsbGJhY2tbXSA9IFtdO1xuICBwcml2YXRlIG5leHRDYnM6IENhbGxiYWNrW10gPSBbXTtcbiAgcHJpdmF0ZSBpbm5lck5leHRDYnM6IENhbGxiYWNrW10gPSBbXTtcblxuICBwcml2YXRlIGxhc3RUaW1lITogbnVtYmVyO1xuXG4gIHByaXZhdGUgdXBkYXRlID0gKCkgPT4ge1xuICAgIGNvbnN0IHRpbWUgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IGRlbHRhVGltZSA9IHRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgIHRoaXMubGFzdFRpbWUgPSB0aW1lO1xuICAgIC8vIGNvbnNvbGUubG9nKGR0KVxuICAgIC8vIOS8mOWFiOaJp+ihjOS4muWKoeeahHRpY2tlcuWbnuiwg++8jOWboOS4uuacieWPr+iDveS8muinpuWPkXJlZmxvd1xuICAgIHRoaXMuY2JzLmZvckVhY2goKGNiOiBDYWxsYmFjaykgPT4ge1xuICAgICAgY2IoZGVsdGFUaW1lKTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW5uZXJDYnMuZm9yRWFjaCgoY2I6IENhbGxiYWNrKSA9PiB7XG4gICAgICBjYihkZWx0YVRpbWUpO1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuaW5uZXJOZXh0Q2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMuZm9yRWFjaChjYiA9PiBjYihkZWx0YVRpbWUpKTtcbiAgICAgIHRoaXMuaW5uZXJOZXh0Q2JzID0gW107XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubmV4dENicy5sZW5ndGgpIHtcbiAgICAgIHRoaXMubmV4dENicy5mb3JFYWNoKGNiID0+IGNiKGRlbHRhVGltZSkpO1xuXG4gICAgICB0aGlzLm5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLmNvdW50ICs9IDE7XG4gICAgdGhpcy5hbmltYXRpb25JZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZSk7XG4gIH1cblxuICBjYW5jZWxJZk5lZWQoKSB7XG4gICAgaWYgKHRoaXMuYW5pbWF0aW9uSWQgIT09IG51bGwpIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uSWQpO1xuICAgICAgdGhpcy5hbmltYXRpb25JZCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgYWRkKGNiOiBDYWxsYmFjaywgaXNJbm5lciA9IGZhbHNlKSB7XG4gICAgaWYgKHR5cGVvZiBjYiA9PT0gJ2Z1bmN0aW9uJyAmJiB0aGlzLmNicy5pbmRleE9mKGNiKSA9PT0gLTEpIHtcbiAgICAgIGlzSW5uZXIgPyB0aGlzLmlubmVyQ2JzLnB1c2goY2IpIDogdGhpcy5jYnMucHVzaChjYik7XG4gICAgfVxuICB9XG5cbiAgbmV4dChjYjogQ2FsbGJhY2ssIGlzSW5uZXIgPSBmYWxzZSkge1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlzSW5uZXIgPyB0aGlzLmlubmVyTmV4dENicy5wdXNoKGNiKSA6IHRoaXMubmV4dENicy5wdXNoKGNiKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVJbm5lcigpIHtcbiAgICB0aGlzLmlubmVyQ2JzID0gW107XG4gICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgfVxuXG4gIHJlbW92ZShjYj86IENhbGxiYWNrLCBpc0lubmVyID0gZmFsc2UpIHtcbiAgICBpZiAoY2IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5jYnMgPSBbXTtcbiAgICAgIHRoaXMuaW5uZXJDYnMgPSBbXTtcbiAgICAgIHRoaXMubmV4dENicyA9IFtdO1xuICAgICAgdGhpcy5pbm5lck5leHRDYnMgPSBbXTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNiID09PSAnZnVuY3Rpb24nICYmICh0aGlzLmNicy5pbmRleE9mKGNiKSA+IC0xIHx8IHRoaXMuaW5uZXJDYnMuaW5kZXhPZihjYikgPiAtMSkpIHtcbiAgICAgIGNvbnN0IGxpc3QgPSBpc0lubmVyID8gdGhpcy5pbm5lckNicyA6IHRoaXMuY2JzO1xuICAgICAgbGlzdC5zcGxpY2UodGhpcy5jYnMuaW5kZXhPZihjYiksIDEpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jYnMubGVuZ3RoICYmICF0aGlzLmlubmVyQ2JzLmxlbmd0aCkge1xuICAgICAgdGhpcy5jYW5jZWxJZk5lZWQoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcblxuICAgICAgdGhpcy5sYXN0VGltZSA9IERhdGUubm93KCk7XG5cbiAgICAgIGlmICh0aGlzLmFuaW1hdGlvbklkID09PSBudWxsICYmICh0aGlzLmNicy5sZW5ndGggfHwgdGhpcy5pbm5lckNicy5sZW5ndGgpKSB7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy51cGRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuY2FuY2VsSWZOZWVkKCk7XG4gICAgfVxuICB9XG59XG4iLCIvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vbmUoKSB7IH1cbmltcG9ydCB7IEdhbWVUb3VjaCwgR2FtZVRvdWNoRXZlbnQgfSBmcm9tIFwiLi4vdHlwZXNcIjtcblxuaW50ZXJmYWNlIFRvdWNoTXNnIHtcbiAgdG91Y2hzdGFydD86IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2g7XG4gIHRvdWNoZW5kPzogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbn1cblxuLyoqXG4gKiDmoLnmja7op6bmkbjml7bplb/lkozop6bmkbjkvY3nva7lj5jljJbmnaXliKTmlq3mmK/lkKblsZ7kuo7ngrnlh7vkuovku7ZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQ2xpY2sodG91Y2hNc2c6IFRvdWNoTXNnKSB7XG4gIGNvbnN0IHN0YXJ0ID0gdG91Y2hNc2cudG91Y2hzdGFydDtcbiAgY29uc3QgZW5kID0gdG91Y2hNc2cudG91Y2hlbmQ7XG5cbiAgaWYgKCFzdGFydFxuICAgIHx8ICFlbmRcbiAgICB8fCAhc3RhcnQudGltZVN0YW1wXG4gICAgfHwgIWVuZC50aW1lU3RhbXBcbiAgICB8fCBzdGFydC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgc3RhcnQucGFnZVkgPT09IHVuZGVmaW5lZFxuICAgIHx8IGVuZC5wYWdlWCA9PT0gdW5kZWZpbmVkXG4gICAgfHwgZW5kLnBhZ2VZID09PSB1bmRlZmluZWRcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3RhcnRQb3NYID0gc3RhcnQucGFnZVg7XG4gIGNvbnN0IHN0YXJ0UG9zWSA9IHN0YXJ0LnBhZ2VZO1xuXG4gIGNvbnN0IGVuZFBvc1ggPSBlbmQucGFnZVg7XG4gIGNvbnN0IGVuZFBvc1kgPSBlbmQucGFnZVk7XG5cbiAgY29uc3QgdG91Y2hUaW1lcyA9IGVuZC50aW1lU3RhbXAgLSBzdGFydC50aW1lU3RhbXA7XG5cbiAgcmV0dXJuICEhKE1hdGguYWJzKGVuZFBvc1kgLSBzdGFydFBvc1kpIDwgMzBcbiAgICAmJiBNYXRoLmFicyhlbmRQb3NYIC0gc3RhcnRQb3NYKSA8IDMwXG4gICAgJiYgdG91Y2hUaW1lcyA8IDMwMCk7XG59XG5cbmV4cG9ydCBlbnVtIFNUQVRFIHtcbiAgVU5JTklUID0gJ1VOSU5JVCcsXG4gIElOSVRFRCA9ICdJTklURUQnLFxuICBSRU5ERVJFRCA9ICdSRU5ERVJFRCcsXG4gIENMRUFSID0gJ0NMRUFSJyxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckNhbnZhcyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICBjdHggJiYgY3R4LmNsZWFyUmVjdCgwLCAwLCBjdHguY2FudmFzLndpZHRoLCBjdHguY2FudmFzLmhlaWdodCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VG91Y2hBcnJheSh0b3VjaGVzOiBHYW1lVG91Y2hbXSkge1xuICByZXR1cm4gdG91Y2hlcy5tYXAodG91Y2ggPT4gKHtcbiAgICBpZGVudGlmaWVyOiB0b3VjaC5pZGVudGlmaWVyLFxuICAgIHBhZ2VYOiB0b3VjaC5wYWdlWCxcbiAgICBwYWdlWTogdG91Y2gucGFnZVksXG4gICAgY2xpZW50WDogdG91Y2guY2xpZW50WCxcbiAgICBjbGllbnRZOiB0b3VjaC5jbGllbnRZLFxuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dhbWVUb3VjaEV2ZW50KGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCk6IGUgaXMgR2FtZVRvdWNoRXZlbnQge1xuICByZXR1cm4gJ3RvdWNoZXMnIGluIGU7XG59XG5cbi8qKlxuICog5Y+W5pyA5bCP5YC85ZKM5pyA5aSn5YC85LmL6Ze055qE5Yy66Ze06ZmQ5a6a5YC8XG4gKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIOmcgOimgeiiq+WkhOeQhueahOaVsOWtl1xuICogQHBhcmFtIHtudW1iZXJ9IG1pbiDmnIDlsI/lgLxcbiAqIEBwYXJhbSB7bnVtYmVyfSBtYXgg5pyA5aSn5YC8XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGFtcChudW1iZXI6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obnVtYmVyLCBtYXgpKTtcbn1cblxuLyoqXG4gKiDkuKTkuKrmlbDkuYvpl7TnmoTnur/mgKfmj5LlgLzjgIJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlcnAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCByYXRpbzogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGZyb20gKyAodG8gLSBmcm9tKSAqIHJhdGlvO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFBlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyLCBwYXJlbnREYXRhOiBudW1iZXIpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyB8fCBkYXRhID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBjb25zdCBtYXRjaERhdGEgPSBkYXRhLm1hdGNoKC8oXFxkKyg/OlxcLlxcZCspPyklLyk7XG4gIGlmIChtYXRjaERhdGEgJiYgbWF0Y2hEYXRhWzFdKSB7XG4gICAgcmV0dXJuIHBhcmVudERhdGEgKiBwYXJzZUZsb2F0KG1hdGNoRGF0YVsxXSkgKiAwLjAxO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BlcmNlbnQoZGF0YTogc3RyaW5nIHwgbnVtYmVyKSB7XG4gIHJldHVybiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycgJiYgL1xcZCsoPzpcXC5cXGQrKT8lLy50ZXN0KGRhdGEpO1xufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tcGFyYW0tcmVhc3NpZ24gKi9cbi8vIGNvbXBvbmVudHNcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMsIEVsZW1lbnQsIEJ1dHRvbiB9IGZyb20gJy4uL2NvbXBvbmVudHMvaW5kZXgnO1xuaW1wb3J0IHsgSVN0eWxlIH0gZnJvbSAnLi4vY29tcG9uZW50cy9zdHlsZSc7XG5pbXBvcnQgeyBJTGF5b3V0LCBJTGF5b3V0Qm94IH0gZnJvbSAnLi4vY29tcG9uZW50cy9lbGVtZW50cyc7XG5pbXBvcnQgeyBDYWxsYmFjaywgVHJlZU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBjb252ZXJ0UGVyY2VudCwgaXNQZXJjZW50IH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCBlbnYgZnJvbSAnLi4vZW52JztcblxuaW50ZXJmYWNlIENvbnN0cnVjdG9yIHtcbiAgbmV3ICguLi5hcmdzOiBhbnlbXSk6IGFueTtcbn1cblxuY29uc3QgY29uc3RydWN0b3JNYXA6IHsgW2tleTogc3RyaW5nXTogQ29uc3RydWN0b3IgfSA9IHtcbiAgdmlldzogVmlldyxcbiAgdGV4dDogVGV4dCxcbiAgaW1hZ2U6IEltYWdlLFxuICBzY3JvbGx2aWV3OiBTY3JvbGxWaWV3LFxuICBiaXRtYXB0ZXh0OiBCaXRNYXBUZXh0LFxuICBjYW52YXM6IENhbnZhcyxcbiAgYnV0dG9uOiBCdXR0b24sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJDb21wb25lbnQobmFtZTogc3RyaW5nLCBDb25zdHJ1Y3RvcjogQ29uc3RydWN0b3IpIHtcbiAgY29uc3RydWN0b3JNYXBbbmFtZV0gPSBDb25zdHJ1Y3Rvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShub2RlOiBUcmVlTm9kZSwgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIHBhcmVudD86IFJlY29yZDxzdHJpbmcsIGFueT4pIHtcbiAgY29uc3QgQ29uc3RydWN0b3IgPSBjb25zdHJ1Y3Rvck1hcFtub2RlLm5hbWVdO1xuXG4gIGlmICghQ29uc3RydWN0b3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XSDkuI3mlK/mjIHnu4Tku7YgJHtub2RlLm5hbWV9YCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW4gfHwgW107XG5cbiAgY29uc3QgYXR0ciA9IG5vZGUuYXR0ciB8fCB7fTtcbiAgY29uc3QgZGF0YXNldDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBpZCA9IGF0dHIuaWQgfHwgJyc7XG5cbiAgY29uc3QgYXJnczogUmVjb3JkPHN0cmluZywgYW55PiA9IE9iamVjdC5rZXlzKGF0dHIpLnJlZHVjZSgob2JqLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBhdHRyW2tleV07XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBrZXk7XG5cbiAgICAgIGlmIChrZXkgPT09ICdpZCcpIHtcbiAgICAgICAgb2JqLnN0eWxlID0gT2JqZWN0LmFzc2lnbihvYmouc3R5bGUgfHwge30sIHN0eWxlW2lkXSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKGtleSA9PT0gJ2NsYXNzJykge1xuICAgICAgICBvYmouc3R5bGUgPSB2YWx1ZS5zcGxpdCgvXFxzKy8pLnJlZHVjZSgocmVzLCBvbmVDbGFzcykgPT4gT2JqZWN0LmFzc2lnbihyZXMsIHN0eWxlW29uZUNsYXNzXSksIG9iai5zdHlsZSB8fCB7fSk7XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICBvYmpbYXR0cmlidXRlXSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGF0dHJpYnV0ZS5zdGFydHNXaXRoKCdkYXRhLScpKSB7XG4gICAgICAgIGNvbnN0IGRhdGFLZXkgPSBhdHRyaWJ1dGUuc3Vic3RyaW5nKDUpO1xuXG4gICAgICAgIGRhdGFzZXRbZGF0YUtleV0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgb2JqLmRhdGFzZXQgPSBkYXRhc2V0O1xuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sIHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4pO1xuXG4gIC8vIOeUqOS6juWQjue7reWFg+e0oOafpeivolxuICBhcmdzLmlkTmFtZSA9IGlkO1xuICAvLyBAdHMtaWdub3JlXG4gIHRoaXMuZWxlQ291bnQgKz0gMTtcbiAgLy8gQHRzLWlnbm9yZVxuICBhcmdzLmlkID0gdGhpcy5lbGVDb3VudDtcbiAgYXJncy5jbGFzc05hbWUgPSBhdHRyLmNsYXNzIHx8ICcnO1xuXG4gIGNvbnN0IHRoaXNTdHlsZSA9IGFyZ3Muc3R5bGU7XG4gIGlmICh0aGlzU3R5bGUpIHtcbiAgICBsZXQgcGFyZW50U3R5bGU7XG4gICAgaWYgKHBhcmVudCkge1xuICAgICAgcGFyZW50U3R5bGUgPSBwYXJlbnQuc3R5bGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcmVudFN0eWxlID0gZW52LmdldFJvb3RDYW52YXNTaXplKCk7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLndpZHRoKSkge1xuICAgICAgdGhpc1N0eWxlLndpZHRoID0gcGFyZW50U3R5bGUud2lkdGggPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUud2lkdGgsIHBhcmVudFN0eWxlLndpZHRoKSA6IDA7XG4gICAgfVxuICAgIGlmIChpc1BlcmNlbnQodGhpc1N0eWxlLmhlaWdodCkpIHtcbiAgICAgIHRoaXNTdHlsZS5oZWlnaHQgPSBwYXJlbnRTdHlsZS5oZWlnaHQgPyBjb252ZXJ0UGVyY2VudCh0aGlzU3R5bGUuaGVpZ2h0LCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHRoaXNTdHlsZS5vcGFjaXR5ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIGlmIChwYXJlbnRTdHlsZSAmJiBwYXJlbnRTdHlsZS5vcGFjaXR5ICE9PSAxICYmIHR5cGVvZiBwYXJlbnRTdHlsZS5vcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgdGhpc1N0eWxlLm9wYWNpdHkgPSBwYXJlbnRTdHlsZS5vcGFjaXR5ICogdGhpc1N0eWxlLm9wYWNpdHk7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc29sZS5sb2coYXJncyk7XG4gIGNvbnN0IGVsZW1lbnQgPSBuZXcgQ29uc3RydWN0b3IoYXJncyk7XG4gIC8vIEB0cy1pZ25vcmVcbiAgZWxlbWVudC5yb290ID0gdGhpcztcbiAgZWxlbWVudC50YWdOYW1lID0gbm9kZS5uYW1lO1xuXG4gIGVsZW1lbnQuYWZ0ZXJDcmVhdGUoKTtcblxuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZE5vZGU6IFRyZWVOb2RlKSA9PiB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IGNoaWxkRWxlbWVudCA9IGNyZWF0ZS5jYWxsKHRoaXMsIGNoaWxkTm9kZSwgc3R5bGUsIGFyZ3MpO1xuXG4gICAgaWYgKGNoaWxkRWxlbWVudCkge1xuICAgICAgZWxlbWVudC5hZGQoY2hpbGRFbGVtZW50KTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hpbGRyZW4oY2hpbGRyZW46IEVsZW1lbnRbXSwgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyID0gdHJ1ZSkge1xuICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIC8vIGNoaWxkLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIGNoaWxkLmlzRGlydHkgPSBmYWxzZTtcbiAgICBjaGlsZC5pbnNlcnQoY29udGV4dCwgbmVlZFJlbmRlcik7XG5cbiAgICAvLyBTY3JvbGxWaWV355qE5a2Q6IqC54K55riy5p+T5Lqk57uZU2Nyb2xsVmlld+iHquW3se+8jOS4jeaUr+aMgeW1jOWll1Njcm9sbFZpZXdcbiAgICByZXR1cm4gcmVuZGVyQ2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4sIGNvbnRleHQsICBjaGlsZC50eXBlID09PSAnU2Nyb2xsVmlldycgPyBmYWxzZSA6IG5lZWRSZW5kZXIpO1xuICB9KTtcbn1cblxuLyoqXG4gKiDlsIbluIPlsYDmoJHnmoTluIPlsYDkv6Hmga/liqDlt6XotYvlgLzliLDmuLLmn5PmoJFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxheW91dENoaWxkcmVuKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGNoaWxkLmxheW91dEJveCA9IGNoaWxkLmxheW91dEJveCB8fCB7fTtcblxuICAgIFsnbGVmdCcsICd0b3AnLCAnd2lkdGgnLCAnaGVpZ2h0J10uZm9yRWFjaCgocHJvcDogc3RyaW5nKSA9PiB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBjaGlsZC5sYXlvdXRCb3hbcHJvcCBhcyBrZXlvZiBJTGF5b3V0Qm94XSA9IGNoaWxkLmxheW91dD8uW3Byb3AgYXMga2V5b2YgSUxheW91dF0gYXMgbnVtYmVyO1xuICAgIH0pO1xuXG4gICAgaWYgKGNoaWxkLnBhcmVudCkge1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWCA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWCB8fCAwKSArIGNoaWxkLmxheW91dEJveC5sZWZ0O1xuICAgICAgY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWSA9IChjaGlsZC5wYXJlbnQubGF5b3V0Qm94LmFic29sdXRlWSB8fCAwKSArIGNoaWxkLmxheW91dEJveC50b3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVggPSBjaGlsZC5sYXlvdXRCb3gubGVmdDtcbiAgICAgIGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVkgPSBjaGlsZC5sYXlvdXRCb3gudG9wO1xuICAgIH1cblxuICAgIGNoaWxkLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSA9IGNoaWxkLmxheW91dEJveC5hYnNvbHV0ZVk7XG4gICAgY2hpbGQubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYID0gY2hpbGQubGF5b3V0Qm94LmFic29sdXRlWDtcblxuXG4gICAgbGF5b3V0Q2hpbGRyZW4oY2hpbGQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbm9uZSgpIHsgfVxuZXhwb3J0IGZ1bmN0aW9uIGl0ZXJhdGVUcmVlKGVsZW1lbnQ6IEVsZW1lbnQsIGNhbGxiYWNrOiBDYWxsYmFjayA9IG5vbmUpIHtcbiAgY2FsbGJhY2soZWxlbWVudCk7XG5cbiAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGl0ZXJhdGVUcmVlKGNoaWxkLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5leHBvcnQgY29uc3QgcmVwYWludENoaWxkcmVuID0gKGNoaWxkcmVuOiBFbGVtZW50W10pID0+IHtcbiAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBjaGlsZC5yZXBhaW50KCk7XG5cbiAgICBpZiAoY2hpbGQudHlwZSAhPT0gJ1Njcm9sbFZpZXcnKSB7XG4gICAgICByZXBhaW50Q2hpbGRyZW4oY2hpbGQuY2hpbGRyZW4pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgY29uc3QgcmVwYWludFRyZWUgPSAodHJlZTogRWxlbWVudCkgPT4ge1xuICB0cmVlLnJlcGFpbnQoKTtcblxuICB0cmVlLmNoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBFbGVtZW50KSA9PiB7XG4gICAgY2hpbGQucmVwYWludCgpO1xuXG4gICAgcmVwYWludFRyZWUoY2hpbGQpO1xuICB9KTtcbn07XG5cbmludGVyZmFjZSBFbGVtZW50QXJncyB7XG4gIHN0eWxlOiBvYmplY3Q7XG4gIGlkTmFtZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgaWQ6IG51bWJlcjtcbiAgZGF0YXNldDogb2JqZWN0O1xuICBzcmM/OiBzdHJpbmc7XG4gIHZhbHVlPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xvbmU8VCBleHRlbmRzIEVsZW1lbnQ+KHJvb3Q6IFQsIGVsZW1lbnQ6IEVsZW1lbnQsIGRlZXAgPSB0cnVlLCBwYXJlbnQ/OiBFbGVtZW50KSB7XG4gIGNvbnN0IENvbnN0cnVjdG9yID0gY29uc3RydWN0b3JNYXBbZWxlbWVudC50YWdOYW1lIGFzIHN0cmluZ107XG4gIC8vIEB0cy1pZ25vcmVcbiAgcm9vdC5lbGVDb3VudCArPSAxO1xuXG4gIGNvbnN0IGFyZ3M6IEVsZW1lbnRBcmdzID0ge1xuICAgIHN0eWxlOiBPYmplY3QuYXNzaWduKHt9LCBlbGVtZW50LnN0eWxlKSxcbiAgICBpZE5hbWU6IGVsZW1lbnQuaWROYW1lLFxuICAgIGNsYXNzTmFtZTogZWxlbWVudC5jbGFzc05hbWUsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlkOiByb290LmVsZUNvdW50LFxuICAgIGRhdGFzZXQ6IE9iamVjdC5hc3NpZ24oe30sIGVsZW1lbnQuZGF0YXNldCksXG4gICAgbmFtZTogZWxlbWVudC50YWdOYW1lLFxuICB9O1xuXG4gIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSW1hZ2UpIHtcbiAgICBhcmdzLnNyYyA9IGVsZW1lbnQuc3JjO1xuICB9IGVsc2UgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBUZXh0IHx8IGVsZW1lbnQgaW5zdGFuY2VvZiBCaXRNYXBUZXh0KSB7XG4gICAgYXJncy52YWx1ZSA9IGVsZW1lbnQudmFsdWU7XG4gIH1cblxuICBjb25zdCBuZXdFbGVtZW5ldCA9IG5ldyBDb25zdHJ1Y3RvcihhcmdzKTtcbiAgbmV3RWxlbWVuZXQucm9vdCA9IHJvb3Q7XG4gIC8vIEB0cy1pZ25vcmVcbiAgbmV3RWxlbWVuZXQuaW5zZXJ0KHJvb3QucmVuZGVyQ29udGV4dCwgZmFsc2UpO1xuICBuZXdFbGVtZW5ldC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuXG4gIGlmIChwYXJlbnQpIHtcbiAgICBwYXJlbnQuYWRkKG5ld0VsZW1lbmV0KTtcbiAgfVxuXG4gIGlmIChkZWVwKSB7XG4gICAgZWxlbWVudC5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2xvbmUocm9vdCwgY2hpbGQsIGRlZXAsIG5ld0VsZW1lbmV0KTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXdFbGVtZW5ldDtcbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IFBvb2wgZnJvbSAnLi4vY29tbW9uL3Bvb2wnO1xuaW1wb3J0IEJpdE1hcEZvbnQgZnJvbSAnLi4vY29tbW9uL2JpdE1hcEZvbnQnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmNvbnN0IGJpdE1hcFBvb2wgPSBuZXcgUG9vbDxCaXRNYXBGb250PignYml0TWFwUG9vbCcpO1xuXG5pbnRlcmZhY2UgSUJpdE1hcFRleHRPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgdmFsdWU/OiBzdHJpbmc7XG4gIGZvbnQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJpdE1hcFRleHQgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnQml0TWFwVGV4dCc7XG4gIHByaXZhdGUgdmFsdWVzcmM6IHN0cmluZztcbiAgcHVibGljIGZvbnQ6IEJpdE1hcEZvbnQ7XG5cbiAgY29uc3RydWN0b3Iob3B0czogSUJpdE1hcFRleHRPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICB2YWx1ZSA9ICcnLFxuICAgICAgZm9udCA9ICcnLFxuICAgICAgZGF0YXNldCxcbiAgICB9ID0gb3B0cztcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy52YWx1ZXNyYyA9IHZhbHVlO1xuXG4gICAgdGhpcy5mb250ID0gYml0TWFwUG9vbC5nZXQoZm9udCk7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYE1pc3NpbmcgQml0bWFwRm9udCBcIiR7Zm9udH1cIiwgcGxlYXNlIGludm9rZSBBUEkgXCJyZWdpc3RCaXRNYXBGb250XCIgYmVmb3JlIHVzaW5nIFwiQml0TWFwVGV4dFwiYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWVzcmM7XG4gIH1cblxuICBzZXQgdmFsdWUobmV3VmFsdWU6IHN0cmluZykge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLmVtaXQoJ3JlcGFpbnQnKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5mb250KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZm9udC5yZWFkeSkge1xuICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZm9udC5ldmVudC5vbigndGV4dF9fbG9hZF9fZG9uZScsICgpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJUZXh0KHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldFRleHRCb3VuZHMoKSB7XG4gICAgY29uc3QgeyBzdHlsZSB9ID0gdGhpcztcblxuICAgIGNvbnN0IHsgbGV0dGVyU3BhY2luZyA9IDAgfSA9IHN0eWxlO1xuICAgIGxldCB3aWR0aCA9IDA7XG5cbiAgICAvLyDorrDlvZXkuIrkuIDkuKrlrZfnrKbvvIzmlrnkvr/lpITnkIYga2VybmluZ1xuICAgIGxldCBwcmV2Q2hhckNvZGUgPSBudWxsO1xuXG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gdGhpcy52YWx1ZS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG5cbiAgICAgIGlmIChjZmcpIHtcbiAgICAgICAgaWYgKHByZXZDaGFyQ29kZSAmJiBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdKSB7XG4gICAgICAgICAgd2lkdGggKz0gY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXTtcbiAgICAgICAgfVxuICBcbiAgICAgICAgd2lkdGggKz0gY2ZnLnhhZHZhbmNlO1xuXG4gICAgICAgIGlmIChpIDwgbGVuIC0gMSkge1xuICAgICAgICAgIHdpZHRoICs9IGxldHRlclNwYWNpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyB3aWR0aCwgaGVpZ2h0OiB0aGlzLmZvbnQubGluZUhlaWdodCB9O1xuICB9XG5cbiAgcmVuZGVyVGV4dChjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0VGV4dEJvdW5kcygpO1xuICAgIGNvbnN0IGRlZmF1bHRMaW5lSGVpZ2h0ID0gdGhpcy5mb250LmxpbmVIZWlnaHQgYXMgbnVtYmVyO1xuXG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGxldCB7IG5lZWRTdHJva2UsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICBjb25zdCB7IHN0eWxlIH0gPSB0aGlzO1xuXG4gICAgY29uc3Qge1xuICAgICAgd2lkdGggPSAwLCAvLyDmsqHmnInorr7nva7ph4fnlKjorqHnrpflh7rmnaXnmoTlrr3luqZcbiAgICAgIGhlaWdodCA9IDAsIC8vIOayoeacieiuvue9ruWImemHh+eUqOiuoeeul+WHuuadpeeahOWuveW6plxuICAgICAgdGV4dEFsaWduLCAvLyDmloflrZflt6blj7Plr7npvZDmlrnlvI9cbiAgICAgIHZlcnRpY2FsQWxpZ24sXG4gICAgICBsZXR0ZXJTcGFjaW5nID0gMCxcbiAgICB9ID0gc3R5bGU7XG4gICAgLy8g5rKh5pyJ6K6+572u5YiZ6YeH55So6K6h566X5Ye65p2l55qE6auY5bqmXG4gICAgY29uc3QgbGluZUhlaWdodCA9IChzdHlsZS5saW5lSGVpZ2h0IHx8IGRlZmF1bHRMaW5lSGVpZ2h0KSBhcyBudW1iZXJcblxuICAgIGNvbnN0IHNjYWxlWSA9IGxpbmVIZWlnaHQgLyBkZWZhdWx0TGluZUhlaWdodDtcblxuICAgIGNvbnN0IHJlYWxXaWR0aCA9IHNjYWxlWSAqIGJvdW5kcy53aWR0aDtcblxuICAgIC8vIOWmguaenOaWh+Wtl+eahOa4suafk+WMuuWfn+mrmOW6puWwj+S6juebkuWtkOmrmOW6pu+8jOmHh+eUqOWvuem9kOaWueW8j1xuICAgIGlmIChsaW5lSGVpZ2h0IDwgaGVpZ2h0KSB7XG4gICAgICBpZiAodmVydGljYWxBbGlnbiA9PT0gJ21pZGRsZScpIHtcbiAgICAgICAgZHJhd1kgKz0gKGhlaWdodCAtIGxpbmVIZWlnaHQpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodmVydGljYWxBbGlnbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgZHJhd1kgPSBkcmF3WSArIGhlaWdodCAtIGxpbmVIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHdpZHRoID4gcmVhbFdpZHRoKSB7XG4gICAgICBpZiAodGV4dEFsaWduID09PSAnY2VudGVyJykge1xuICAgICAgICBkcmF3WCArPSAod2lkdGggLSByZWFsV2lkdGgpIC8gMjtcbiAgICAgIH0gZWxzZSBpZiAodGV4dEFsaWduID09PSAncmlnaHQnKSB7XG4gICAgICAgIGRyYXdYICs9ICh3aWR0aCAtIHJlYWxXaWR0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8g6K6w5b2V5LiK5LiA5Liq5a2X56ym77yM5pa55L6/5aSE55CGIGtlcm5pbmdcbiAgICBsZXQgcHJldkNoYXJDb2RlID0gbnVsbDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgY2hhciA9IHRoaXMudmFsdWVbaV07XG4gICAgICBjb25zdCBjZmcgPSB0aGlzLmZvbnQuY2hhcnNbY2hhcl07XG5cbiAgICAgIGlmIChwcmV2Q2hhckNvZGUgJiYgY2ZnLmtlcm5pbmdbcHJldkNoYXJDb2RlXSkge1xuICAgICAgICBkcmF3WCArPSBjZmcua2VybmluZ1twcmV2Q2hhckNvZGVdO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2ZnKSB7XG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXG4gICAgICAgICAgdGhpcy5mb250LnRleHR1cmUgYXMgSFRNTEltYWdlRWxlbWVudCxcbiAgICAgICAgICBjZmcueCxcbiAgICAgICAgICBjZmcueSxcbiAgICAgICAgICBjZmcudyxcbiAgICAgICAgICBjZmcuaCxcbiAgICAgICAgICBkcmF3WCArIGNmZy5vZmZYICogc2NhbGVZIC0gb3JpZ2luWCxcbiAgICAgICAgICBkcmF3WSArIGNmZy5vZmZZICogc2NhbGVZIC0gb3JpZ2luWSxcbiAgICAgICAgICBjZmcudyAqIHNjYWxlWSxcbiAgICAgICAgICBjZmcuaCAqIHNjYWxlWSxcbiAgICAgICAgKTtcblxuICAgICAgICBkcmF3WCArPSAoY2ZnLnhhZHZhbmNlICogc2NhbGVZICsgbGV0dGVyU3BhY2luZyk7XG5cbiAgICAgICAgcHJldkNoYXJDb2RlID0gY2hhcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCBUZXh0LCB7IElUZXh0UHJvcHMgfSBmcm9tICcuL3RleHQnO1xyXG5pbXBvcnQgeyBsZXJwIH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24gZXh0ZW5kcyBUZXh0IHtcclxuICAvLyDnvKnmlL7liqjnlLvnmoTml7bplb9cclxuICBwdWJsaWMgc2NhbGVEdXJhdGlvbiA9IDEwMDtcclxuICAvLyDlvZPliY3nvKnmlL7liqjnlLvmmK/lkKbmkq3mlL7lrozmr5VcclxuICBwcml2YXRlIHNjYWxlRG9uZSA9IHRydWU7XHJcbiAgLy8g57yp5pS+5Yqo55S75byA5aeL55qE5pe26Ze0XHJcbiAgcHJpdmF0ZSB0aW1lQ2xpY2sgPSAwO1xyXG4gIC8vIOe8qeaUvuWKqOeUu+eahCBzY2FsZSDliJ3lp4vlgLzvvIzov5nlubbkuI3mmK/lm7rlrprkuI3lj5jnmoTvvIzlvZPngrnlh7vnu5PmnZ/vvIzlj6/og73pnIDopoHku47lpKfliLDlsI/lj5jmjaJcclxuICBwcml2YXRlIGZyb21TY2FsZSA9IDE7XHJcbiAgLy8g57yp5pS+5Yqo55S755qEIHNjYWxlIOebruagh+WAvFxyXG4gIHByaXZhdGUgdG9TY2FsZSA9IDE7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHtcclxuICAgIHN0eWxlID0ge30sXHJcbiAgICBpZE5hbWUgPSAnJyxcclxuICAgIGNsYXNzTmFtZSA9ICcnLFxyXG4gICAgdmFsdWUgPSAnJyxcclxuICAgIGRhdGFzZXQsXHJcbiAgfTogSVRleHRQcm9wcykge1xyXG4gICAgc3VwZXIoe1xyXG4gICAgICBpZE5hbWUsXHJcbiAgICAgIGNsYXNzTmFtZSxcclxuICAgICAgc3R5bGU6IHtcclxuICAgICAgICB3aWR0aDogMzAwLFxyXG4gICAgICAgIGhlaWdodDogNjAsXHJcbiAgICAgICAgbGluZUhlaWdodDogNjAsXHJcbiAgICAgICAgZm9udFNpemU6IDMwLFxyXG4gICAgICAgIGJvcmRlclJhZGl1czogMTAsXHJcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzM0YTEyMycsXHJcbiAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcclxuICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIC4uLnN0eWxlLFxyXG4gICAgICAgICc6YWN0aXZlJzoge1xyXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS4wNSwgMS4wNSknLFxyXG4gICAgICAgICAgLi4uc3R5bGVbJzphY3RpdmUnXSxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICB2YWx1ZSxcclxuICAgICAgZGF0YXNldCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgYWZ0ZXJDcmVhdGUoKSB7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICB0aGlzLnJvb3QudGlja2VyLmFkZCh0aGlzLnVwZGF0ZSk7XHJcbiAgfVxyXG5cclxuICBkZXN0cm95U2VsZigpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMucm9vdC50aWNrZXIucmVtb3ZlKHRoaXMudXBkYXRlKTtcclxuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5yb290ID0gbnVsbDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZSA9IChkdDogbnVtYmVyKSA9PiB7XHJcbiAgICBpZiAodGhpcy5zY2FsZURvbmUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy50aW1lQ2xpY2sgKz0gZHQ7XHJcblxyXG4gICAgbGV0IHJhdGlvID0gMTtcclxuXHJcbiAgICByYXRpbyA9IHRoaXMudGltZUNsaWNrIC8gdGhpcy5zY2FsZUR1cmF0aW9uO1xyXG5cclxuICAgIGlmIChyYXRpbyA+IDEpIHtcclxuICAgICAgcmF0aW8gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzY2FsZSA9IGxlcnAodGhpcy5mcm9tU2NhbGUsIHRoaXMudG9TY2FsZSwgcmF0aW8pO1xyXG4gICAgbGV0IHRyYW5zZm9ybSA9IGBzY2FsZSgke3NjYWxlfSwgJHtzY2FsZX0pYDtcclxuICAgIHRoaXMuc3R5bGUudHJhbnNmb3JtID0gdHJhbnNmb3JtO1xyXG5cclxuICAgIGlmIChyYXRpbyA9PT0gMSkge1xyXG4gICAgICB0aGlzLnNjYWxlRG9uZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcblxuaW50ZXJmYWNlIElDYW52YXNPcHRpb25zIGV4dGVuZHMgSUVsZW1lbnRPcHRpb25zIHtcbiAgd2lkdGg/OiBudW1iZXI7XG4gIGhlaWdodD86IG51bWJlcjtcbiAgYXV0b0NyZWF0ZUNhbnZhcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIGNhbnZhc0luc3RhbmNlOiBIVE1MQ2FudmFzRWxlbWVudCB8IG51bGwgPSBudWxsXG5cbiAgY29uc3RydWN0b3Iob3B0czogSUNhbnZhc09wdGlvbnMpIHtcbiAgICBjb25zdCB7XG4gICAgICBzdHlsZSA9IHt9LFxuICAgICAgaWROYW1lID0gJycsXG4gICAgICBjbGFzc05hbWUgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgICB3aWR0aCA9IDEwMCxcbiAgICAgIGhlaWdodCA9IDEwMCxcbiAgICAgIGF1dG9DcmVhdGVDYW52YXMgPSBmYWxzZSxcbiAgICB9ID0gb3B0cztcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkTmFtZSxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOW+ruS/oeWwj+a4uOaIj+WcuuaZr+S4i++8jHNoYXJlZENhbnZhcyDlrp7kvovkuI3mlrnkvr/oh6rliqjliJvlu7rvvIzmj5Dkvpsgc2V0dGVyIOaJi+WKqOiuvue9rlxuICAgICAqL1xuICAgIGlmIChhdXRvQ3JlYXRlQ2FudmFzKSB7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlID0gZW52LmNyZWF0ZUNhbnZhcygpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgdGhpcy5jYW52YXNJbnN0YW5jZS53aWR0aCA9IE51bWJlcih3aWR0aCk7XG4gICAgICB0aGlzLmNhbnZhc0luc3RhbmNlLmhlaWdodCA9IE51bWJlcihoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBjYW52YXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FudmFzSW5zdGFuY2U7XG4gIH1cblxuICBzZXQgY2FudmFzKGN2czogSFRNTENhbnZhc0VsZW1lbnQgfCBudWxsKSB7XG4gICAgdGhpcy5jYW52YXNJbnN0YW5jZSA9IGN2cztcbiAgfVxuXG4gIHVwZGF0ZSgpIHtcbiAgICB0aGlzLnJvb3QhLmVtaXQoJ3JlcGFpbnQnKTtcbiAgfVxuXG4gIHJlcGFpbnQoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzSW5zdGFuY2UgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5jYW52YXNJbnN0YW5jZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgLy8g6Ieq5a6a5LmJ5riy5p+T6YC76L6RIOW8gOWni1xuICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5jYW52YXNJbnN0YW5jZSwgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkU3Ryb2tlKSB7XG4gICAgICBjdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSkge1xuICAgICAgY3R4LnRyYW5zbGF0ZSgtb3JpZ2luWCwgLW9yaWdpblkpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgeyByZXBhaW50QWZmZWN0ZWRTdHlsZXMsIHJlZmxvd0FmZmVjdGVkU3R5bGVzLCByZW5kZXJBZmZlY3RTdHlsZXMsIElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IFJlY3QgZnJvbSAnLi4vY29tbW9uL3JlY3QnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCBUaW55RW1pdHRlciBmcm9tICd0aW55LWVtaXR0ZXInO1xuaW1wb3J0IHsgSURhdGFzZXQsIENhbGxiYWNrIH0gZnJvbSAnLi4vdHlwZXMvaW5kZXgnXG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IGJhY2tncm91bmRJbWFnZVBhcnNlciwgcGFyc2VUcmFuc2Zvcm0sIElSZW5kZXJGb3JMYXlvdXQgfSBmcm9tICcuL3N0eWxlUGFyc2VyJztcbmltcG9ydCB7IGNvbnZlcnRQZXJjZW50IH0gZnJvbSAnLi4vY29tbW9uL3V0aWwnXG5pbXBvcnQgZW52IGZyb20gJy4uL2Vudic7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRFbGVtZW50c0J5SWQ8VCBleHRlbmRzIEVsZW1lbnQ+KHRyZWU6IEVsZW1lbnQsIGxpc3Q6IChFbGVtZW50IHwgVClbXSA9IFtdLCBpZDogc3RyaW5nKTogVFtdIHtcbiAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgIGlmIChjaGlsZC5pZE5hbWUgPT09IGlkKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpO1xuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlJZChjaGlsZCwgbGlzdCwgaWQpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGxpc3QgYXMgVFtdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RWxlbWVudEJ5SWQ8VCBleHRlbmRzIEVsZW1lbnQ+KHRyZWU6IEVsZW1lbnQsIGlkOiBzdHJpbmcpOiBUIHtcbiAgY29uc3QgbGlzdCA9IGdldEVsZW1lbnRzQnlJZCh0cmVlLCBbXSwgaWQpO1xuXG4gIHJldHVybiBsaXN0Py5bMF0gfHwgbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWU8VCBleHRlbmRzIEVsZW1lbnQ+KHRyZWU6IEVsZW1lbnQsIGxpc3Q6IChFbGVtZW50IHwgVClbXSA9IFtdLCBjbGFzc05hbWU6IHN0cmluZyk6IFRbXSB7XG4gIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEVsZW1lbnQpID0+IHtcbiAgICBpZiAoY2hpbGQuY2xhc3NMaXN0IS5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICBsaXN0LnB1c2goY2hpbGQpOyAgICAgIFxuICAgIH1cblxuICAgIGlmIChjaGlsZC5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICAgIGdldEVsZW1lbnRzQnlDbGFzc05hbWUoY2hpbGQsIGxpc3QsIGNsYXNzTmFtZSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbGlzdCBhcyBUW107XG59XG5cbi8qKlxuICog5bCG5b2T5YmN6IqC54K5572u6ISP77yMTGF5b3V0IOeahCB0aWNrZXIg5Lya5qC55o2u6L+Z5Liq5qCH6K6w5L2N5omn6KGMIHJlZmxvd1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0RGlydHkoZWxlOiBFbGVtZW50LCByZWFzb24/OiBzdHJpbmcpIHtcbiAgLy8gZm9yIGRlYnVnXG4gIC8vIGNvbnNvbGUubG9nKCdbTGF5b3V0XSB0cmlnZ2VyIHJlZmxvdyBjYXVzZScsIGVsZSwgcmVhc29uKTtcbiAgZWxlLmlzRGlydHkgPSB0cnVlO1xuICBsZXQgeyBwYXJlbnQgfSA9IGVsZTtcbiAgd2hpbGUgKHBhcmVudCkge1xuICAgIHBhcmVudC5pc0RpcnR5ID0gdHJ1ZTtcbiAgICBwYXJlbnQgPSBwYXJlbnQucGFyZW50O1xuICB9XG59XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIuVGlueUVtaXR0ZXIoKTtcblxubGV0IHV1aWQgPSAwO1xuXG5jb25zdCB0b0V2ZW50TmFtZSA9IChldmVudDogc3RyaW5nLCBpZDogbnVtYmVyKSA9PiB7XG4gIGNvbnN0IGVsZW1lbnRFdmVudCA9IFtcbiAgICAnY2xpY2snLFxuICAgICd0b3VjaHN0YXJ0JyxcbiAgICAndG91Y2htb3ZlJyxcbiAgICAndG91Y2hlbmQnLFxuICAgICd0b3VjaGNhbmNlbCcsXG4gIF07XG5cbiAgaWYgKGVsZW1lbnRFdmVudC5pbmRleE9mKGV2ZW50KSAhPT0gLTEpIHtcbiAgICByZXR1cm4gYGVsZW1lbnQtJHtpZH0tJHtldmVudH1gO1xuICB9XG5cbiAgcmV0dXJuIGBlbGVtZW50LSR7aWR9LSR7ZXZlbnR9YDtcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dEJveCB7XG4gIGxlZnQ6IG51bWJlcjtcbiAgdG9wOiBudW1iZXI7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICBhYnNvbHV0ZVg6IG51bWJlcjtcbiAgYWJzb2x1dGVZOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVYOiBudW1iZXI7XG4gIG9yaWdpbmFsQWJzb2x1dGVZOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxheW91dCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB0b3A6IG51bWJlcjtcbiAgbGVmdDogbnVtYmVyO1xuICByaWdodDogbnVtYmVyO1xuICBib3R0b206IG51bWJlcjtcbn07XG5cbmV4cG9ydCBlbnVtIFN0eWxlT3BUeXBlIHtcbiAgU2V0LFxuICBEZWxldGUsXG59XG5cbmNsYXNzIEVsZW1lbnRDbGFzc0xpc3Qge1xuICBwdWJsaWMgdG9rZW5zOiBTZXQ8c3RyaW5nPlxuICBwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnQ7XG5cbiAgY29uc3RydWN0b3IoZWxlOiBFbGVtZW50LCBpbml0aWFsVG9rZW5zOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZTtcbiAgICB0aGlzLnRva2VucyA9IG5ldyBTZXQoaW5pdGlhbFRva2VucyB8fCBbXSlcbiAgfVxuXG4gIGdldCBsZW5ndGgoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zLnNpemU7XG4gIH1cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50b2tlbnMpLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hhbmdlSGFuZGxlcigpIHtcbiAgICBjb25zdCBlbGUgPSB0aGlzLmVsZW1lbnRcbiAgICBjb25zdCBvbGRTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIGVsZS5zdHlsZSk7XG4gICAgLy8g5qC55o2uIGNsYXNzTmFtZSDku47moLflvI/ooajkuK3nrpflh7rlvZPliY3lupTor6XkvZznlKjnmoTmoLflvI9cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc3QgbmV3U3R5bGU6IElTdHlsZSA9IEFycmF5LmZyb20odGhpcy50b2tlbnMpLnJlZHVjZSgocmVzLCBvbmVDbGFzcykgPT4gT2JqZWN0LmFzc2lnbihyZXMsIGVsZS5yb290LnN0eWxlU2hlZXQhW29uZUNsYXNzXSksIHt9KTtcblxuICAgIC8vIGNvbnNvbGUubG9nKCduZXdTdHlsZScsIG5ld1N0eWxlKVxuXG4gICAgbGV0IHBhcmVudFN0eWxlOiBJU3R5bGVcbiAgICBpZiAoZWxlLnBhcmVudCkge1xuICAgICAgcGFyZW50U3R5bGUgPSBlbGUucGFyZW50LnN0eWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJlbnRTdHlsZSA9IGVudi5nZXRSb290Q2FudmFzU2l6ZSgpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmV3U3R5bGUub3BhY2l0eSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIG5ld1N0eWxlLm9wYWNpdHkgPSAxO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKG5ld1N0eWxlKS5jb25jYXQoT2JqZWN0LmtleXMob2xkU3R5bGUpKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgIC8vIOaJi+WKqOmAmui/h3RoaXMuc3R5bGXorr7nva7ov4fnmoTmoLflvI/orqTkuLrmmK/lhoXogZTmoLflvI/vvIzkvJjlhYjnuqfmnIDpq5jvvIzkuZ/lsLHmmK8gY2xhc3NOYW1lIOeahOWxnuaAp+S4jeW9seWTjVxuICAgICAgaWYgKCFSZWZsZWN0LmhhcyhlbGUuaW5uZXJTdHlsZSwga2V5KSkge1xuICAgICAgICAvLyDmoLnmja4gY2xhc3NOYW1lIOiuoeeul+WHuuadpeeahOaWsOWinuaIluiAheS/ruaUueeahOagt+W8j1xuICAgICAgICBpZiAoUmVmbGVjdC5oYXMobmV3U3R5bGUsIGtleSkpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiDmlrDlop7nmoTmoLflvI/vvIzpnIDopoHljLrliIblh7rmmK8gY2xhc3NOYW1lIOWvvOiHtOeahOi/mOaYr+W8gOWPkeiAheaJi+WKqOS/ruaUueeahFxuICAgICAgICAgICAqIOS4tOaXtuWNoOS9je+8jOWboOS4uuWQjue7reeahCByZWZsb3cg5ZKMIHJlcGFpbnQg6YC76L6R5ZyoIHN0eWxlIFByb3h5IOWkhOeQhu+8jOi/meagt+WBmuWcqCBzdHlsZSBQcm94eSDkuZ/kuI3kvJrorqTkuLrmmK/lvIDlj5HogIXmiYvliqjorr7nva7nmoTmoLflvI9cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoIVJlZmxlY3QuaGFzKG9sZFN0eWxlLCBrZXkpKSB7XG4gICAgICAgICAgICBSZWZsZWN0LnNldChlbGUub3JpZ2luU3R5bGUsIGtleSwgdW5kZWZpbmVkKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICBsZXQgbmV3VmFsdWUgPSBuZXdTdHlsZVtrZXldXG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3dpZHRoJykge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBwYXJlbnRTdHlsZS53aWR0aCA/IGNvbnZlcnRQZXJjZW50KG5ld1ZhbHVlLCBwYXJlbnRTdHlsZS53aWR0aCkgOiAwO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChrZXkgPT09ICdoZWlnaHQnKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHBhcmVudFN0eWxlLmhlaWdodCA/IGNvbnZlcnRQZXJjZW50KG5ld1ZhbHVlLCBwYXJlbnRTdHlsZS5oZWlnaHQpIDogMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoa2V5ID09PSAnb3BhY2l0eScgJiYgcGFyZW50U3R5bGUgJiYgcGFyZW50U3R5bGUub3BhY2l0eSAhPT0gMSAmJiB0eXBlb2YgcGFyZW50U3R5bGUub3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gcGFyZW50U3R5bGUub3BhY2l0eSAqIG5ld1ZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAvLyDmoLnmja4gY2xhc3NOYW1lIOiuoeeul+WHuueahOagt+W8j+imhuebluW9k+WJjeagt+W8j1xuICAgICAgICAgIGVsZS5zdHlsZVtrZXldID0gbmV3VmFsdWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZGVsJywga2V5KVxuICAgICAgICAgIC8vIOS4jeWcqOWGheiBlOagt+W8j++8jOagueaNriBjbGFzc05hbWUg6K6h566X5Ye655qE5qC35byP5Y+I5rKh5pyJ77yM6K6k5Li66L+Z5Lqb5qC35byP6YO95bqU6K+l5Yig6Zmk5LqGXG4gICAgICAgICAgZGVsZXRlIGVsZS5zdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFkZChjbGFzc05hbWU6IHN0cmluZykge1xuICAgIGlmICghdGhpcy5jb250YWlucyhjbGFzc05hbWUpKSB7XG4gICAgICB0aGlzLnRva2Vucy5hZGQoY2xhc3NOYW1lKTtcbiAgICAgIHRoaXMuY2hhbmdlSGFuZGxlcigpOyAgXG4gICAgfVxuICB9XG5cbiAgLy8g5qOA5p+l5YiX6KGo5Lit5piv5ZCm5a2Y5Zyo5oyH5a6a55qE5Luk54mMXG4gIGNvbnRhaW5zKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMudG9rZW5zLmhhcyhjbGFzc05hbWUpO1xuICB9XG5cbiAgcmVtb3ZlKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuY29udGFpbnMoY2xhc3NOYW1lKSkge1xuICAgICAgdGhpcy50b2tlbnMuZGVsZXRlKGNsYXNzTmFtZSk7XG4gICAgICB0aGlzLmNoYW5nZUhhbmRsZXIoKTsgIFxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGVtZW50IHtcbiAgLyoqXG4gICAqIOWtkOiKgueCueWIl+ihqFxuICAgKi9cbiAgcHVibGljIGNoaWxkcmVuOiBFbGVtZW50W10gPSBbXTtcbiAgLyoqXG4gICAqIOW9k+WJjeiKgueCueeahOeItuiKgueCuVxuICAgKi9cbiAgcHVibGljIHBhcmVudDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gIC8vIOS8vOS5juayoeS7gOS5iOeUqO+8jOWFiOazqOmHilxuICAvLyBwdWJsaWMgcGFyZW50SWQgPSAwO1xuICAvKipcbiAgICog5b2T5YmN6IqC54K555qEaWTvvIzkuIDoiKzmmK/nlLEgTGF5b3V0IOe7n+S4gOWIhumFjeeahOiHquWiniBpZFxuICAgKi9cbiAgcHVibGljIGlkOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIOWcqCB4bWwg5qih5p2/6YeM6Z2i5aOw5piO55qEIGlkIOWxnuaAp++8jOS4gOiIrOeUqOS6juiKgueCueafpeivolxuICAgKi9cbiAgcHVibGljIGlkTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiDlvZPliY3oioLngrnmiYDlnKjoioLngrnmoJHnmoTmoLnoioLngrnvvIzmjIflkJEgTGF5b3V0XG4gICAqL1xuICBwdWJsaWMgcm9vdDogRWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAvLyBwdWJsaWMgRUU6IGFueTtcblxuICAvKipcbiAgICog55So5LqO5qCH6K+G5b2T5YmN6IqC54K55piv5ZCm5bey57uP5omn6KGM6ZSA5q+B6YC76L6R77yM6ZSA5q+B5LmL5ZCO5Y6f5YWI55qE5Yqf6IO96YO95Lya5byC5bi477yM5LiA6Iis5Lia5Yqh5L6n5LiN55So5YWz5b+D6L+Z5LiqXG4gICAqL1xuICBwdWJsaWMgaXNEZXN0cm95ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICog57G75Ly8IFdlYiDnq6/lrp7njrDvvIznu5noioLngrnmjILkuIDkupvog73lpJ/or7vlhpnnmoTlsZ7mgKfpm4blkIhcbiAgICog5ZyoIHhtbCDlj6/ku6Xov5nmoLflo7DmmI7lsZ7mgKfvvJo8dmlldyBjbGFzcz1cInh4eFwiIGRhdGEtZm9vPVwiYmFyXCI+XG4gICAqIOWcqCBqcyDkvqflj6/ku6Xov5nkuYjor7vlhpnlsZ7mgKfvvJpcbiAgICogY29uc29sZS5sb2coZWxlbWVudC5kYXRhc2V0LmZvbyk7IC8vIOaOp+WItuWPsOi+k+WHuiBcImJhclwiO1xuICAgKiBlbGVtZW50LmRhdGFzZXQuZm9vID0gXCJiYXIyXCI7XG4gICAqL1xuICBwdWJsaWMgZGF0YXNldDogSURhdGFzZXQ7XG5cbiAgLyoqXG4gICAqIOiKgueCueeahOagt+W8j+WIl+ihqO+8jOWcqCBMYXlvdXQuaW5pdCDkvJrkvKDlhaXmoLflvI/pm4blkIjvvIzkvJroh6rliqjmjJHpgInlh7rot5/oioLngrnmnInlhbPnmoTmoLflvI/nu5/kuIAgbWVyZ2Ug5YiwIHN0eWxlIOWvueixoeS4ilxuICAgKi9cbiAgcHVibGljIHN0eWxlOiBJU3R5bGU7XG5cbiAgLyoqXG4gICAqIOaJp+ihjCBnZXRCb3VuZGluZ0NsaWVudFJlY3Qg55qE57uT5p6c57yT5a2Y77yM5aaC5p6c5Lia5Yqh6auY6aKR6LCD55So77yM5Y+v5Lul5YeP5bCRIEdDXG4gICAqL1xuICBwcml2YXRlIHJlY3Q6IFJlY3QgfCBudWxsO1xuICAvLyBwdWJsaWMgY2xhc3NOYW1lTGlzdDogc3RyaW5nW10gfCBudWxsO1xuICBwdWJsaWMgbGF5b3V0Qm94OiBJTGF5b3V0Qm94O1xuICBwdWJsaWMgYmFja2dyb3VuZEltYWdlOiBhbnk7XG4gIHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsXG5cbiAgLyoqXG4gICAqIOe9ruiEj+agh+iusOS9je+8jOebruWJjeW9k+S/ruaUueS8muW9seWTjeW4g+WxgOWxnuaAp+eahOaXtuWAme+8jOS8muiHquWKqOe9ruiEj1xuICAgKi9cbiAgcHVibGljIGlzRGlydHkgPSBmYWxzZTtcblxuICAvKipcbiAgICogY3NzLWxheW91dCDoioLngrnlsZ7mgKfvvIzkuJrliqHkvqfml6DpnIDlhbPlv4NcbiAgICovXG4gIHByb3RlY3RlZCBzaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K555qE5ZCN56ew77yM5q+U5aaCXCIgSW1hZ2VcbiAgICovXG4gIHB1YmxpYyB0eXBlPzogc3RyaW5nO1xuICAvLyBwdWJsaWMgbGF5b3V0PzogSUxheW91dDtcblxuICAvKipcbiAgICog5b2T5YmN6IqC54K55ZyoIHhtbCDnmoTmoIfnrb7lkI3np7DvvIzmr5TlpoIgaW1hZ2XjgIF2aWV3XG4gICAqL1xuICBwdWJsaWMgdGFnTmFtZT86IHN0cmluZztcblxuICBwdWJsaWMgY2xhc3NMaXN0OiBFbGVtZW50Q2xhc3NMaXN0IHwgbnVsbDtcblxuICBwdWJsaWMgb3JpZ2luU3R5bGU6IElTdHlsZTtcblxuICAvKipcbiAgICog5ZyoIHhtbCDmqKHmnb/ph4zpnaLlo7DmmI7nmoQgY2xhc3Mg5bGe5oCn77yM5LiA6Iis55So5LqO5qih5p2/5o+S5Lu2XG4gICAqL1xuICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOacieS6myBzdHlsZSDlsZ7mgKflubbkuI3og73nm7TmjqXnlKjmnaXmuLLmn5PvvIzpnIDopoHnu4/ov4fop6PmnpDkuYvlkI7miY3og73ov5vooYzmuLLmn5PvvIzov5nkupvlgLzkuI3kvJrlrZjlgqjlnKggc3R5bGUg5LiKXG4gICAqIOavlOWmgiBzdHlsZS50cmFuc2Zvcm3vvIzlpoLmnpzmr4/mrKHpg73op6PmnpDmgKfog73lpKrlt67kuoZcbiAgICovXG4gIHByb3RlY3RlZCByZW5kZXJGb3JMYXlvdXQ6IElSZW5kZXJGb3JMYXlvdXQgPSB7fTtcblxuICBwcm90ZWN0ZWQgc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3A6IHN0cmluZywgc3R5bGVPcFR5cGU6IFN0eWxlT3BUeXBlLCB2YWw/OiBhbnkpIHtcblxuICB9XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgaWQgPSB1dWlkICs9IDEsXG4gICAgZGF0YXNldCA9IHt9LFxuICB9OiBJRWxlbWVudE9wdGlvbnMpIHtcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy5pZE5hbWUgPSBpZE5hbWU7XG4gICAgdGhpcy5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgdGhpcy5sYXlvdXRCb3ggPSB7XG4gICAgICBsZWZ0OiAwLFxuICAgICAgdG9wOiAwLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBhYnNvbHV0ZVg6IDAsXG4gICAgICBhYnNvbHV0ZVk6IDAsXG4gICAgICBvcmlnaW5hbEFic29sdXRlWDogMCxcbiAgICAgIG9yaWdpbmFsQWJzb2x1dGVZOiAwLFxuICAgIH07XG5cbiAgICB0aGlzLmRhdGFzZXQgPSBkYXRhc2V0O1xuICAgIFxuICAgIHJlbmRlckFmZmVjdFN0eWxlcy5mb3JFYWNoKChwcm9wOiBzdHJpbmcpID0+IHtcbiAgICAgIGxldCB2YWwgPSBzdHlsZVtwcm9wIGFzIGtleW9mIElTdHlsZV07XG4gICAgICBpZiAodHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5jYWxjdWxhdGVSZW5kZXJGb3JMYXlvdXQodHJ1ZSwgcHJvcCwgU3R5bGVPcFR5cGUuU2V0LCB2YWwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5vcmlnaW5TdHlsZSA9IHN0eWxlO1xuICAgIHRoaXMuc3R5bGUgPSBzdHlsZTtcbiAgICB0aGlzLnJlY3QgPSBudWxsO1xuXG4gICAgY29uc3QgaW5pdGlhbFRva2VucyA9IGNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pLmZpbHRlcihpdGVtID0+ICEhaXRlbSlcbiAgICBpbml0aWFsVG9rZW5zLnB1c2goaWROYW1lKVxuICAgIHRoaXMuY2xhc3NMaXN0ID0gbmV3IEVsZW1lbnRDbGFzc0xpc3QodGhpcywgaW5pdGlhbFRva2VucylcbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlUmVuZGVyRm9yTGF5b3V0KGluaXQ6IGJvb2xlYW4sIHByb3A6IHN0cmluZywgc3R5bGVPcFR5cGU6IFN0eWxlT3BUeXBlLCB2YWw/OiBhbnkpIHtcbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIHRoaXMuc3R5bGVDaGFuZ2VIYW5kbGVyKHByb3AsIHN0eWxlT3BUeXBlLCB2YWwpO1xuICAgIH1cbiAgXG4gICAgaWYgKHN0eWxlT3BUeXBlID09PSBTdHlsZU9wVHlwZS5TZXQpIHtcbiAgICAgIHN3aXRjaCAocHJvcCkge1xuICAgICAgICBjYXNlICdiYWNrZ3JvdW5kSW1hZ2UnOlxuICAgICAgICAgIGNvbnN0IHVybCA9IGJhY2tncm91bmRJbWFnZVBhcnNlcih2YWwpO1xuXG4gICAgICAgICAgaWYgKHVybCkge1xuICAgICAgICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh1cmwsIChpbWc6IEhUTUxJbWFnZUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlID0gaW1nO1xuICAgICAgICAgICAgICAgIC8vIOW9k+WbvueJh+WKoOi9veWujOaIkO+8jOWunuS+i+WPr+iDveW3sue7j+iiq+mUgOavgeS6hlxuICAgICAgICAgICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlICd0cmFuc2Zvcm0nOlxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVg7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWTtcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQucm90YXRlO1xuICAgICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5yZW5kZXJGb3JMYXlvdXQsIHBhcnNlVHJhbnNmb3JtKHZhbCkpO1xuICAgICAgICAgIGJyZWFrOyBcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3dpdGNoIChwcm9wKSB7XG4gICAgICAgIGNhc2UgJ2JhY2tncm91bmRJbWFnZSc6XG4gICAgICAgICAgdGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSAndHJhbnNmb3JtJzpcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVk7XG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyDliJ3lp4vljJbnmoTpgLvovpHkuI3pnIDopoHlgZrov5nkupvliKTmlq1cbiAgICBpZiAoIWluaXQpIHtcbiAgICAgIGlmIChyZWZsb3dBZmZlY3RlZFN0eWxlcy5pbmRleE9mKHByb3ApID4gLTEpIHtcbiAgICAgICAgLy8gc2V0RGlydHkodGhpcywgYGNoYW5nZSBwcm9wICR7cHJvcH0gZnJvbSAke29sZFZhbH0gdG8gJHt2YWx9YCk7XG4gICAgICAgIHNldERpcnR5KHRoaXMpO1xuICAgICAgfSBlbHNlIGlmIChyZXBhaW50QWZmZWN0ZWRTdHlsZXMuaW5kZXhPZihwcm9wKSA+IC0xKSB7XG4gICAgICAgIHRoaXMucm9vdD8uZW1pdCgncmVwYWludCcpO1xuICAgICAgfSAgXG4gICAgfVxuICB9XG5cbiAgcHVibGljIGlubmVyU3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4gPSB7fVxuXG4gIG9ic2VydmVTdHlsZUFuZEV2ZW50KCkge1xuICAgIGlmICh0eXBlb2YgUHJveHkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IGVsZSA9IHRoaXM7XG4gICAgICBjb25zdCBpbm5lclN0eWxlID0gdGhpcy5pbm5lclN0eWxlXG4gICAgICBcbiAgICAgIHRoaXMuc3R5bGUgPSBuZXcgUHJveHkodGhpcy5vcmlnaW5TdHlsZSwge1xuICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsLCByZWNlaXZlcikge1xuICAgICAgICAgIC8vIOWIpOaWreWIneWni+WMlueahGNsYXNzTmFtZeaYr+WQpuWMheWQq+ivpeWxnuaAp1xuICAgICAgICAgIGNvbnN0IGlzU2V0Rm9ySW5uZXJTdHlsZSA9ICFSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3ApXG4gICAgICAgICAgbGV0IG9sZFZhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycgJiYgb2xkVmFsICE9PSB2YWwpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZXQnLCBwcm9wLCBvbGRWYWwsIHZhbClcblxuICAgICAgICAgICAgZWxlLmNhbGN1bGF0ZVJlbmRlckZvckxheW91dChmYWxzZSwgcHJvcCwgU3R5bGVPcFR5cGUuU2V0LCB2YWwpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChpc1NldEZvcklubmVyU3R5bGUpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzZXQgaW5uZXJTdHlsZScsIHByb3AsIHZhbClcbiAgICAgICAgICAgIC8vIOWwhuengeacieWxnuaAp+WQjOatpeS4gOS7veWIsCBpbm5lclN0eWxlXG4gICAgICAgICAgICBSZWZsZWN0LnNldChpbm5lclN0eWxlLCBwcm9wLCB2YWwpOyAgIFxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBSZWZsZWN0LnNldCh0YXJnZXQsIHByb3AsIHZhbCwgcmVjZWl2ZXIpO1xuICAgICAgICB9LFxuICAgICAgICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3A6IHN0cmluZykge1xuICAgICAgICAgIGVsZS5jYWxjdWxhdGVSZW5kZXJGb3JMYXlvdXQoZmFsc2UsIHByb3AgYXMgc3RyaW5nLCBTdHlsZU9wVHlwZS5EZWxldGUpO1xuXG4gICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOS6i+S7tuWGkuazoemAu+i+kVxuICAgIFsndG91Y2hzdGFydCcsICd0b3VjaG1vdmUnLCAndG91Y2hjYW5jZWwnLCAndG91Y2hlbmQnLCAnY2xpY2snXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub24oZXZlbnROYW1lLCAoZSwgdG91Y2hNc2cpID0+IHtcbiAgICAgICAgLy8g5aSE55CG5Lyq57G76YC76L6RXG4gICAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaHN0YXJ0Jykge1xuICAgICAgICAgIHRoaXMuYWN0aXZlSGFuZGxlcihlKTtcbiAgICAgICAgICBpZiAodGhpcyAhPT0gdGhpcy5yb290KSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWN0aXZlRWxlbWVudHMucHVzaCh0aGlzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnROYW1lID09PSAndG91Y2hlbmQnIHx8IGV2ZW50TmFtZSA9PT0gJ3RvdWNoY2FuY2VsJykge1xuICAgICAgICAgIHRoaXMuZGVhY3RpdmVIYW5kbGVyKGUpO1xuXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucm9vdC5hY3RpdmVFbGVtZW50cy5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICB0aGlzLnJvb3QuYWN0aXZlRWxlbWVudHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYXJlbnQgJiYgdGhpcy5wYXJlbnQuZW1pdChldmVudE5hbWUsIGUsIHRvdWNoTXNnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGFzc05hbWVMaXN0ID0gdGhpcy5pbm5lckNsYXNzTmFtZS5zcGxpdCgvXFxzKy8pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNhY2hlU3R5bGUhOiBJU3R5bGU7XG5cbiAgYWN0aXZlSGFuZGxlcihlPzogYW55KSB7XG4gICAgY29uc3QgYWN0aXZlU3R5bGUgPSB0aGlzLnN0eWxlWyc6YWN0aXZlJ107XG5cbiAgICBpZiAoYWN0aXZlU3R5bGUpIHtcbiAgICAgIC8vIOWwhuW9k+WJjeeahHN0eWxl57yT5a2Y6LW35p2l77yM5ZyoIGFjdGl2ZSDlj5bmtojnmoTml7blgJnph43nva7lm57ljrtcbiAgICAgIHRoaXMuY2FjaGVTdHlsZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3R5bGUpO1xuICAgICAgXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIGFjdGl2ZVN0eWxlKTtcbiAgICB9XG4gIH1cbiAgXG4gIGRlYWN0aXZlSGFuZGxlcihlPzogYW55KSB7XG4gICAgY29uc3QgYWN0aXZlU3R5bGUgPSB0aGlzLnN0eWxlWyc6YWN0aXZlJ107XG5cbiAgICBpZiAoYWN0aXZlU3R5bGUpIHtcbiAgICAgIE9iamVjdC5rZXlzKGFjdGl2ZVN0eWxlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLmNhY2hlU3R5bGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY2FjaGVTdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXSkge1xuICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICB0aGlzLnN0eWxlW2tleV0gPSB0aGlzLmNhY2hlU3R5bGVba2V5IGFzIGtleW9mIElTdHlsZV1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5zdHlsZVtrZXkgYXMga2V5b2YgSVN0eWxlXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCuemHjee7mOaOpeWPo++8jOWtkOexu+Whq+WFheWunueOsFxuICAgKi9cbiAgcmVwYWludCgpIHsgfVxuXG4gIC8qKlxuICAgKiDoioLngrnmuLLmn5PmjqXlj6PlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIHJlbmRlcigpIHsgfVxuXG4gIC8qKlxuICAgKiDoioLngrnmnoTpgKDlh73mlbDliJ3lp4vljJblkI7osIPnlKjnmoTmlrnms5XvvIzlrZDnsbvloavlhYXlrp7njrBcbiAgICovXG4gIGFmdGVyQ3JlYXRlKCkge31cblxuICAvKipcbiAgICog5Y+C54WnIFdlYiDop4TojIPvvJpodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvRWxlbWVudC9nZXRCb3VuZGluZ0NsaWVudFJlY3RcbiAgICovXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOiBSZWN0IHtcbiAgICBpZiAoIXRoaXMucmVjdCkge1xuICAgICAgdGhpcy5yZWN0ID0gbmV3IFJlY3QoXG4gICAgICAgIHRoaXMubGF5b3V0Qm94LmFic29sdXRlWCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgdGhpcy5sYXlvdXRCb3guaGVpZ2h0LFxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlY3Quc2V0KFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVYLFxuICAgICAgdGhpcy5sYXlvdXRCb3guYWJzb2x1dGVZLFxuICAgICAgdGhpcy5sYXlvdXRCb3gud2lkdGgsXG4gICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgKTtcblxuICAgIHJldHVybiB0aGlzLnJlY3Q7XG4gIH1cblxuICAvKipcbiAgICog5p+l6K+i5b2T5YmN6IqC54K55qCR5LiL77yMaWROYW1lIOS4uue7meWumuWPguaVsOeahOeahOiKgueCuVxuICAgKiDoioLngrnnmoQgaWQg5ZSv5LiA5oCnIExheW91dCDlubbkuI3kv53or4HvvIzkvYbov5nph4zlj6rov5Tlm57nrKblkIjmnaHku7bnmoTnrKzkuIDkuKroioLngrkgXG4gICAqL1xuICBnZXRFbGVtZW50QnlJZDxUIGV4dGVuZHMgRWxlbWVudD4oaWQ6IHN0cmluZyk6IFQgfCBudWxsIHtcbiAgICByZXR1cm4gZ2V0RWxlbWVudEJ5SWQ8VD4odGhpcywgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIOafpeivouW9k+WJjeiKgueCueagkeS4i++8jGlkTmFtZSDkuLrnu5nlrprlj4LmlbDnmoTnmoToioLngrlcbiAgICog6IqC54K555qEIGlkIOWUr+S4gOaApyBMYXlvdXQg5bm25LiN5L+d6K+B77yM6L+Z6YeM6L+U5Zue56ym5ZCI5p2h5Lu255qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5SWQ8VCBleHRlbmRzIEVsZW1lbnQ+KGlkOiBzdHJpbmcpOiAoVCB8IG51bGwpW10ge1xuICAgIHJldHVybiBnZXRFbGVtZW50c0J5SWQ8VD4odGhpcywgW10sIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmn6Xor6LlvZPliY3oioLngrnmoJHkuIvvvIxjbGFzc05hbWUg5YyF5ZCr57uZ5a6a5Y+C5pWw55qE55qE6IqC54K56ZuG5ZCIXG4gICAqL1xuICBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lPFQgZXh0ZW5kcyBFbGVtZW50PihjbGFzc05hbWU6IHN0cmluZyk6IChUIHwgbnVsbClbXSB7XG4gICAgcmV0dXJuIGdldEVsZW1lbnRzQnlDbGFzc05hbWU8VD4odGhpcywgW10sIGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICog5biD5bGA6K6h566X5a6M5oiQ77yM5YeG5aSH5omn6KGM5riy5p+T5LmL5YmN5omn6KGM55qE5pON5L2c77yM5LiN5ZCM55qE5a2Q57G75pyJ5LiN5ZCM55qE6KGM5Li6XG4gICAqIOavlOWmgiBTY3JvbGxWaWV3IOWcqOa4suafk+S5i+WJjei/mOmcgOimgeWIneWni+WMlua7muWKqOebuOWFs+eahOiDveWKm1xuICAgKiAgXG4gICAqL1xuICBpbnNlcnQoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIG5lZWRSZW5kZXI6IGJvb2xlYW4pIHtcbiAgICB0aGlzLnNob3VsZFVwZGF0ZSA9IGZhbHNlO1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOiKgueCueino+mZpOS6i+S7tue7keWumlxuICAgKi9cbiAgdW5CaW5kRXZlbnQoKSB7XG4gICAgW1xuICAgICAgJ3RvdWNoc3RhcnQnLFxuICAgICAgJ3RvdWNobW92ZScsXG4gICAgICAndG91Y2hjYW5jZWwnLFxuICAgICAgJ3RvdWNoZW5kJyxcbiAgICAgICdjbGljaycsXG4gICAgICAncmVwYWludCcsXG4gICAgXS5mb3JFYWNoKChldmVudE5hbWUpID0+IHtcbiAgICAgIHRoaXMub2ZmKGV2ZW50TmFtZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5bCG6IqC54K55LuO5b2T5YmN6IqC54K55qCR5Lit5Yig6ZmkXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgY29uc3QgeyBwYXJlbnQgfSA9IHRoaXM7XG5cbiAgICBpZiAoIXBhcmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gcGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgcGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB0aGlzLnVuQmluZEV2ZW50KCk7XG4gICAgICBzZXREaXJ0eSh0aGlzLCBgcmVtb3ZlYCk7XG4gICAgICB0aGlzLnBhcmVudCA9IG51bGw7XG4gICAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gdGhpcyBlbGVtZW50IGhhcyBiZWVuIHJlbW92ZWQnKTtcbiAgICB9XG4gIH1cblxuICBzZXREaXJ0eSgpIHtcbiAgICBzZXREaXJ0eSh0aGlzKTtcbiAgfVxuXG4gIC8vIOWtkOexu+Whq+WFheWunueOsFxuICBkZXN0cm95U2VsZigpIHtcblxuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy51bkJpbmRFdmVudCgpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgLy8gdGhpcy5FRSA9IG51bGw7XG4gICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgICB0aGlzLmNsYXNzTGlzdCA9IG51bGw7XG4gIH1cblxuICBhZGQoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGVsZW1lbnQucGFyZW50ID0gdGhpcztcblxuICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbkuIDkuKroioLngrnmt7vliqDkvZzkuLrlvZPliY3oioLngrnnmoTlrZDoioLngrlcbiAgICovXG4gIGFwcGVuZENoaWxkKGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICB0aGlzLmFkZChlbGVtZW50KTtcblxuICAgIHNldERpcnR5KHRoaXMsIGBhcHBlbmRDaGlsZCAke2VsZW1lbnR9YCk7XG4gIH1cblxuICAvKipcbiAgICog56e76Zmk57uZ5a6a55qE5a2Q6IqC54K577yM5Y+q5pyJ5LiA57qn6IqC54K56IO95aSf56e76ZmkXG4gICAqL1xuICByZW1vdmVDaGlsZChlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNoaWxkcmVuLmluZGV4T2YoZWxlbWVudCk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKTtcbiAgICAgIHNldERpcnR5KHRoaXMsIGByZW1vdmVDaGlsZCAke2VsZW1lbnR9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0gdGhlIGVsZW1lbnQgdG8gYmUgcmVtb3ZlZCBpcyBub3QgYSBjaGlsZCBvZiB0aGlzIGVsZW1lbnQnKTtcbiAgICB9XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIC4uLnRoZUFyZ3M6IGFueVtdKSB7XG4gICAgRUUuZW1pdCh0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIC4uLnRoZUFyZ3MpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24odG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbmNlKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9uY2UodG9FdmVudE5hbWUoZXZlbnQsIHRoaXMuaWQpLCBjYWxsYmFjayk7XG4gIH1cblxuICBvZmYoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s/OiBDYWxsYmFjaykge1xuICAgIEVFLm9mZih0b0V2ZW50TmFtZShldmVudCwgdGhpcy5pZCksIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmuLLmn5MgYm9yZGVyIOebuOWFs+iDveWKm+aKveixoe+8jOWtkOexu+WPr+aMiemcgOiwg+eUqFxuICAgKiDnlLHkuo7mlK/mjIHkuoZyb3RhdGXnibnmgKfvvIzmiYDku6XmiYDmnInnmoTmuLLmn5Ppg73pnIDopoHmlrnlkJHlh4/ljrt0cmFuc2Zvcm3nmoTkuK3pl7TngrlcbiAgICovXG4gIHJlbmRlckJvcmRlcihjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgb3JpZ2luWDogbnVtYmVyID0gMCwgb3JpZ2luWTogbnVtYmVyID0gMCkge1xuICAgIGNvbnN0IHN0eWxlID0gdGhpcy5zdHlsZSB8fCB7fTtcbiAgICBjb25zdCByYWRpdXMgPSBzdHlsZS5ib3JkZXJSYWRpdXMgfHwgMDtcbiAgICBjb25zdCB7IGJvcmRlcldpZHRoID0gMCB9ID0gc3R5bGU7XG4gICAgY29uc3QgdGxyID0gc3R5bGUuYm9yZGVyVG9wTGVmdFJhZGl1cyB8fCByYWRpdXM7XG4gICAgY29uc3QgdHJyID0gc3R5bGUuYm9yZGVyVG9wUmlnaHRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJiciA9IHN0eWxlLmJvcmRlckJvdHRvbUxlZnRSYWRpdXMgfHwgcmFkaXVzO1xuICAgIGNvbnN0IGJyciA9IHN0eWxlLmJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIHx8IHJhZGl1cztcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICBjb25zdCB7IGJvcmRlckNvbG9yID0gJycgfSA9IHN0eWxlO1xuICAgIGNvbnN0IHggPSBib3guYWJzb2x1dGVYO1xuICAgIGNvbnN0IHkgPSBib3guYWJzb2x1dGVZO1xuICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuXG4gICAgY29uc3QgaGFzUmFkaXVzID0gcmFkaXVzIHx8IHRsciB8fCB0cnIgfHwgYmJyIHx8IGJycjtcblxuICAgIC8vIGJvcmRlcldpZHRoIOWSjCByYWRpdXMg6YO95rKh5pyJ77yM5LiN6ZyA6KaB5omn6KGM5ZCO57ut6YC76L6R77yM5o+Q5Y2H5oCn6IO9XG4gICAgaWYgKCFib3JkZXJXaWR0aCAmJiAhaGFzUmFkaXVzKSB7XG4gICAgICByZXR1cm4geyBuZWVkQ2xpcDogZmFsc2UsIG5lZWRTdHJva2U6IGZhbHNlIH07XG4gICAgfVxuXG4gICAgY3R4LmxpbmVXaWR0aCA9IGJvcmRlcldpZHRoO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IGJvcmRlckNvbG9yO1xuXG4gICAgLy8g5bem5LiK6KeS55qE54K5XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5tb3ZlVG8oeCArIHRsciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZKTtcbiAgICBjdHgubGluZVRvKHggKyB3aWR0aCAtIHRyciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZKTtcbiAgICAvLyDlj7PkuIrop5LnmoTlnIbop5JcbiAgICBjdHguYXJjVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSAtIG9yaWdpblksIHggKyB3aWR0aCAtIG9yaWdpblgsIHkgKyB0cnIgLSBvcmlnaW5ZLCB0cnIpO1xuICAgIC8vIOWPs+S4i+inkueahOeCuVxuICAgIGN0eC5saW5lVG8oeCArIHdpZHRoIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIGJyciAtIG9yaWdpblkpO1xuICAgIC8vIOWPs+S4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4ICsgd2lkdGggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gb3JpZ2luWSwgeCArIHdpZHRoIC0gYnJyIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIGJycik7XG4gICAgLy8g5bem5LiL6KeS55qE54K5XG4gICAgY3R4LmxpbmVUbyh4ICsgYmJyIC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblkpO1xuICAgIC8vIOW3puS4i+inkueahOWchuinklxuICAgIGN0eC5hcmNUbyh4IC0gb3JpZ2luWCwgeSArIGhlaWdodCAtIG9yaWdpblksIHggLSBvcmlnaW5YLCB5ICsgaGVpZ2h0IC0gYmJyIC0gb3JpZ2luWSwgYmJyKTtcbiAgICAvLyDlt6bkuIrop5LnmoTngrlcbiAgICBjdHgubGluZVRvKHggLSBvcmlnaW5YLCB5ICsgdGxyIC0gb3JpZ2luWSk7XG4gICAgLy8g5bem5LiK6KeS55qE5ZyG6KeSXG4gICAgY3R4LmFyY1RvKHggLSBvcmlnaW5YLCB5IC0gb3JpZ2luWSwgeCArIHRsciAtIG9yaWdpblgsIHkgLSBvcmlnaW5ZLCB0bHIpO1xuICAgIGN0eC5jbG9zZVBhdGgoKTtcblxuICAgIHJldHVybiB7IG5lZWRDbGlwOiAhIWhhc1JhZGl1cywgbmVlZFN0cm9rZTogISFib3JkZXJXaWR0aCB9O1xuICB9XG5cbiAgLyoqXG4gICAqIOavj+S4quWtkOexu+mDveS8muacieiHquW3seeahOa4suafk+mAu+i+ke+8jOS9huS7luS7rOmDveacieS6m+mAmueUqOeahOWkhOeQhu+8jOavlOWmgumAj+aYjuW6puOAgeaXi+i9rOWSjGJvcmRlcueahOWkhOeQhu+8jGJhc2VSZW5kZXIg55So5LqO5aSE55CG6YCa55So55qE5riy5p+T6YC76L6RXG4gICAqL1xuICBiYXNlUmVuZGVyKHR5cGU/OiBzdHJpbmcpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogZHJhd1gsIGFic29sdXRlWTogZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IGJveDtcblxuICAgIGlmIChzdHlsZS5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGN0eC5nbG9iYWxBbHBoYSA9IHN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyO1xuICAgIH1cblxuICAgIGxldCBvcmlnaW5YID0gMDtcbiAgICBsZXQgb3JpZ2luWSA9IDA7XG4gICAgaWYgKHRoaXMucmVuZGVyRm9yTGF5b3V0LnJvdGF0ZSAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkIHx8IHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcmlnaW5YID0gZHJhd1ggKyBib3gud2lkdGggLyAyO1xuICAgICAgb3JpZ2luWSA9IGRyYXdZICsgYm94LmhlaWdodCAvIDI7XG5cbiAgICAgIGN0eC50cmFuc2xhdGUob3JpZ2luWCwgb3JpZ2luWSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOivt+azqOaEj++8jOi/memHjOaaguaXtuS7heaUr+aMgeayoeacieWtkOiKgueCueeahOWFg+e0oOWPkeeUn+aXi+i9rO+8jOWmguaenOeItuiKgueCueaXi+i9rOS6huWtkOiKgueCueW5tuS4jeS8mui3n+edgOaXi+i9rFxuICAgICAqIOimgeWunueOsOeItuiKgueCueW4puWKqOWtkOiKgueCueaXi+i9rOeahOiDveWKm++8jOmcgOimgeW8leWFpeefqemYteW6k++8jOWvueS7o+eggeaUueWKqOS5n+avlOi+g+Wkp++8jOaaguaXtuS4jeWBmuaUuemAoOOAglxuICAgICAqL1xuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LnJvdGF0ZSh0aGlzLnJlbmRlckZvckxheW91dC5yb3RhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVggIT09IHVuZGVmaW5lZCB8fCB0aGlzLnJlbmRlckZvckxheW91dC5zY2FsZVkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY3R4LnNjYWxlKHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWCAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVYIDogMSAsIHRoaXMucmVuZGVyRm9yTGF5b3V0LnNjYWxlWSAhPT0gdW5kZWZpbmVkID8gdGhpcy5yZW5kZXJGb3JMYXlvdXQuc2NhbGVZIDogMSk7XG4gICAgfVxuXG4gICAgaWYgKHN0eWxlLmJvcmRlckNvbG9yKSB7XG4gICAgICBjdHguc3Ryb2tlU3R5bGUgPSBzdHlsZS5ib3JkZXJDb2xvcjtcbiAgICB9XG5cbiAgICBjdHgubGluZVdpZHRoID0gc3R5bGUuYm9yZGVyV2lkdGggfHwgMDtcblxuICAgIC8vIGZvciBjbGlwXG4gICAgY29uc3QgeyBuZWVkQ2xpcCwgbmVlZFN0cm9rZSB9ID0gdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgY3R4LmNsaXAoKTtcbiAgICB9XG5cbiAgICBpZiAoc3R5bGUuYmFja2dyb3VuZENvbG9yKSB7XG4gICAgICBjdHguZmlsbFN0eWxlID0gc3R5bGUuYmFja2dyb3VuZENvbG9yO1xuICAgICAgY3R4LmZpbGxSZWN0KGRyYXdYIC0gb3JpZ2luWCwgZHJhd1kgLSBvcmlnaW5ZLCBib3gud2lkdGgsIGJveC5oZWlnaHQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC5iYWNrZ3JvdW5kSW1hZ2UpIHtcbiAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5yZW5kZXJGb3JMYXlvdXQuYmFja2dyb3VuZEltYWdlLCBkcmF3WCAtIG9yaWdpblgsIGRyYXdZIC0gb3JpZ2luWSwgYm94LndpZHRoLCBib3guaGVpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSwgZHJhd1gsIGRyYXdZLCB3aWR0aCwgaGVpZ2h0IH07XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IGltYWdlTWFuYWdlciBmcm9tICcuLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgSUltYWdlT3B0aW9ucyBleHRlbmRzIElFbGVtZW50T3B0aW9ucyB7XG4gIHNyYz86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSW1hZ2UgZXh0ZW5kcyBFbGVtZW50IHtcbiAgcHJpdmF0ZSBpbWdzcmM6IHN0cmluZztcbiAgcHVibGljIHR5cGUgPSAnSW1hZ2UnO1xuICBwdWJsaWMgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbDtcblxuICBjb25zdHJ1Y3RvcihvcHRzOiBJSW1hZ2VPcHRpb25zKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3R5bGUgPSB7fSxcbiAgICAgIGlkTmFtZSA9ICcnLFxuICAgICAgY2xhc3NOYW1lID0gJycsXG4gICAgICBzcmMgPSAnJyxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSA9IG9wdHM7XG5cbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBkYXRhc2V0LFxuICAgICAgc3R5bGUsXG4gICAgfSk7XG5cbiAgICB0aGlzLmltZ3NyYyA9IHNyYztcblxuICAgIHRoaXMuaW1nID0gaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZywgZnJvbUNhY2hlKSA9PiB7XG4gICAgICBpZiAoZnJvbUNhY2hlKSB7XG4gICAgICAgIHRoaXMuaW1nID0gaW1nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICAgICAgdGhpcy5pbWcgPSBpbWc7XG4gICAgICAgICAgLy8g5b2T5Zu+54mH5Yqg6L295a6M5oiQ77yM5a6e5L6L5Y+v6IO95bey57uP6KKr6ZSA5q+B5LqGXG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzcmMoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pbWdzcmM7XG4gIH1cblxuICBzZXQgc3JjKG5ld1ZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuaW1nc3JjKSB7XG4gICAgICB0aGlzLmltZ3NyYyA9IG5ld1ZhbHVlO1xuICAgICAgaW1hZ2VNYW5hZ2VyLmxvYWRJbWFnZSh0aGlzLnNyYywgKGltZzogSFRNTEltYWdlRWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoIXRoaXMuaXNEZXN0cm95ZWQpIHtcbiAgICAgICAgICB0aGlzLmltZyA9IGltZztcbiAgICAgICAgICAvLyDlvZPlm77niYfliqDovb3lrozmiJDvvIzlrp7kvovlj6/og73lt7Lnu4/ooqvplIDmr4HkuoZcbiAgICAgICAgICB0aGlzLnJvb3Q/LmVtaXQoJ3JlcGFpbnQnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy8g5a2Q57G75aGr5YWF5a6e546wXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuaW1nID0gbnVsbDtcblxuICAgIHRoaXMuc3JjID0gJyc7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuaW1nIHx8ICF0aGlzLmltZz8uY29tcGxldGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG4gICAgY3R4LnNhdmUoKTtcblxuICAgIGNvbnN0IHsgbmVlZFN0cm9rZSwgbmVlZENsaXAsIG9yaWdpblgsIG9yaWdpblksIGRyYXdYLCBkcmF3WSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICAvLyDoh6rlrprkuYnmuLLmn5PpgLvovpEg5byA5aeLXG4gICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltZywgZHJhd1ggLSBvcmlnaW5YLCBkcmF3WSAtIG9yaWdpblksIHdpZHRoLCBoZWlnaHQpO1xuICAgIC8vIOiHquWumuS5iea4suafk+mAu+i+kSDnu5PmnZ9cblxuICAgIGlmIChuZWVkQ2xpcCkge1xuICAgICAgdGhpcy5yZW5kZXJCb3JkZXIoY3R4LCBvcmlnaW5YLCBvcmlnaW5ZKTtcbiAgICB9XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cblxuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IEltYWdlIGZyb20gJy4vaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi90ZXh0JztcbmltcG9ydCBTY3JvbGxWaWV3IGZyb20gJy4vc2Nyb2xsdmlldyc7XG5pbXBvcnQgQml0TWFwVGV4dCBmcm9tICcuL2JpdG1hcHRleHQnO1xuaW1wb3J0IENhbnZhcyBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQgRWxlbWVudCBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi9idXR0b24nO1xuXG5leHBvcnQge1xuICBFbGVtZW50LFxuICBWaWV3LFxuICBJbWFnZSxcbiAgVGV4dCxcbiAgU2Nyb2xsVmlldyxcbiAgQml0TWFwVGV4dCxcbiAgQ2FudmFzLFxuICBCdXR0b24sXG59O1xuIiwiXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY2xhbXAgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5cbmV4cG9ydCBlbnVtIFNjcm9sbEJhckRpcmVjdGlvbiB7XG4gIFZlcnRpdmFsLFxuICBIb3Jpem9udGFsLFxufVxuXG5pbnRlcmZhY2UgSURpbWVuc2lvbnMge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbiAgY29udGVudFdpZHRoOiBudW1iZXI7XG4gIGNvbnRlbnRIZWlnaHQ6IG51bWJlcjtcblxuICBtYXhTY3JvbGxMZWZ0OiBudW1iZXI7XG4gIG1heFNjcm9sbFRvcDogbnVtYmVyO1xuXG4gIHNjcm9sbExlZnQ6IG51bWJlcjtcbiAgc2Nyb2xsVG9wOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJU2Nyb2xsQmFyT3B0aW9ucyB7XG4gIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XG4gIHdpZHRoPzogbnVtYmVyO1xuICBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcbn1cblxuLyoqXG4gKiDmoLnmja7mu5rliqjmnaHnmoTlsLrlr7jjgIFTY3JvbGxWaWV3IOinhuWPo+WSjOa7muWKqOeql+WPo+WwuuWvuOOAgea7muWKqOmYsue6v+S/oeaBr+ehruiupOa7muWKqOadoeeahOagt+W8j+S/oeaBr1xuICovXG5mdW5jdGlvbiB1cGRhdGVTdHlsZUZyb21EaW1lbnNpb25zKHdpZHRoOiBudW1iZXIsIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICBjb25zdCBpc1ZlcnRpY2FsID0gZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWw7XG4gIGNvbnN0IHsgd2lkdGg6IHNjcm9sbFdpZHRoLCBoZWlnaHQ6IHNjcm9sbEhlaWdodCwgY29udGVudFdpZHRoLCBjb250ZW50SGVpZ2h0IH0gPSBkaW1lbnNpb25zO1xuXG4gIHJldHVybiB7XG4gICAgd2lkdGg6IGlzVmVydGljYWwgPyB3aWR0aCA6IHNjcm9sbFdpZHRoICogKHNjcm9sbFdpZHRoIC8gY29udGVudFdpZHRoKSxcbiAgICBoZWlnaHQ6IGlzVmVydGljYWwgPyBzY3JvbGxIZWlnaHQgKiAoc2Nyb2xsSGVpZ2h0IC8gY29udGVudEhlaWdodCkgOiB3aWR0aCxcbiAgICBsZWZ0OiBpc1ZlcnRpY2FsID8gc2Nyb2xsV2lkdGggLSB3aWR0aCA6IDAsXG4gICAgdG9wOiBpc1ZlcnRpY2FsID8gMCA6IHNjcm9sbEhlaWdodCAtIHdpZHRoLFxuICB9O1xufVxuXG5mdW5jdGlvbiBjaGVja05lZWRIaWRlU2Nyb2xsQmFyKGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uLCBkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICByZXR1cm4gISEoZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwgJiYgZGltZW5zaW9ucy5tYXhTY3JvbGxUb3AgPT09IDBcbiAgICB8fCBkaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5Ib3Jpem9udGFsICYmIGRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdCA9PT0gMCk7XG59XG5cbi8qKlxuICog5rua5Yqo57uE5Lu255qE5rua5Yqo5p2h57uE5Lu277yM5rua5Yqo5p2h5pys6Lqr5Lmf5pivTGF5b3V055qE5LiA5Liq6IqC54K5XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbEJhciBleHRlbmRzIFZpZXcge1xuICAvLyDlvZPliY3mu5rliqjmnaHmmK/lsZ7kuo7mqKrlkJHov5jmmK/nurXlkJFcbiAgcHVibGljIGRpcmVjdGlvbjogU2Nyb2xsQmFyRGlyZWN0aW9uO1xuXG4gIHB1YmxpYyBkaW1lbnNpb25zOiBJRGltZW5zaW9ucztcblxuICAvLyDmu5rliqjlrozmr5XlkI7kuIDmrrXml7bpl7TlkI7oh6rliqjpmpDol49cbiAgcHVibGljIGF1dG9IaWRlID0gdHJ1ZTtcblxuICAvLyDmu5rliqjlrozmr5XlkI7oh6rliqjpmpDol4/ml7bpl7RcbiAgcHVibGljIGF1dG9IaWRlVGltZSA9IDIwMDA7XG5cbiAgcHVibGljIGF1dG9IaWRlRGVsYXlUaW1lID0gMTUwMDtcblxuICBwcml2YXRlIGF1dG9IaWRlUmVtYWluaW5nVGltZSA9IDA7XG5cbiAgcHJpdmF0ZSBpbm5lcldpZHRoID0gMTA7XG5cbiAgcHJpdmF0ZSBpc0hpZGUgPSBmYWxzZTtcblxuICBwcml2YXRlIGN1cnJMZWZ0ID0gMDtcbiAgcHJpdmF0ZSBjdXJyVG9wID0gMDtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgZGlyZWN0aW9uLFxuICAgIGRpbWVuc2lvbnMsXG4gICAgYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoMTYyLCAxNjIsIDE2MiwgMC43KScsXG4gICAgd2lkdGggPSAxMCxcbiAgfTogSVNjcm9sbEJhck9wdGlvbnMpIHtcbiAgICBjb25zdCBzdHlsZSA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3JkZXJSYWRpdXM6IHdpZHRoIC8gMixcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgfSwgdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh3aWR0aCwgZGlyZWN0aW9uLCBkaW1lbnNpb25zKSk7XG5cbiAgICBzdXBlcih7XG4gICAgICBzdHlsZSxcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuZGltZW5zaW9ucyA9IGRpbWVuc2lvbnM7XG4gICAgdGhpcy5pbm5lcldpZHRoID0gd2lkdGg7XG5cbiAgICBpZiAoY2hlY2tOZWVkSGlkZVNjcm9sbEJhcihkaXJlY3Rpb24sIGRpbWVuc2lvbnMpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiDmu5rliqjmnaHnmoTnspfnu4bvvIzlm6DkuLropoHlhbzlrrnmqKrnq5bmu5rliqjvvIzmiYDku6Ugc3R5bGUud2lkdGgg5Zyo5LiN5ZCM5qih5byP5LiL5Luj6KGo55qE5oSP5oCd5LiN5LiA5qC3XG4gICAqIOWboOatpOmAmui/h+WNleeLrOeahCB3aWR0aCDlsZ7mgKfmnaXku6Pooajmu5rliqjmnaHnmoTnspfnu4ZcbiAgICovXG4gIHNldCB3aWR0aCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgaWYgKHZhbHVlICE9PSB0aGlzLmlubmVyV2lkdGgpIHtcbiAgICAgIHRoaXMuaW5uZXJXaWR0aCA9IHZhbHVlO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUuYm9yZGVyUmFkaXVzID0gdGhpcy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLnNldERpbWVuc2lvbnModGhpcy5kaW1lbnNpb25zKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF06IHBsZWFzZSBzZXQgcm9vdCBmb3Igc2Nyb2xsYmFyJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHRoaXMucm9vdC50aWNrZXIuYWRkKHRoaXMudXBkYXRlLCB0cnVlKTtcblxuICAgICAgdGhpcy5yb290Lm9uKCdiZWZvcmVfcmVmbG93JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnYmVmb3JlX3JlZmxvdycpXG4gICAgICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUodGhpcy5jdXJyTGVmdCwgdGhpcy5jdXJyVG9wKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLCBzY3JvbGxMZWZ0LCBzY3JvbGxUb3ApXG4gICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zdHlsZS5sZWZ0ID0gc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLmlzSGlkZSA9IHRydWU7XG4gICAgdGhpcy5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy5pc0hpZGUgPSBmYWxzZTtcbiAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgLyoqXG4gICAqIOagueaNriBTY3JvbGxWaWV3IOWuueWZqOWuvemrmOWSjOWunumZheWGheWuueWuvemrmOWGs+Wumua7muWKqOadoeeahOS9jee9ruWSjOWwuuWvuOS/oeaBr1xuICAgKiDkvYbmoLjlv4PpnIDopoHogIPomZHnmoTmg4XlhrXmmK/vvJpcbiAgICogMS4g5Zyo5LiN5pat5ZywIHJlZmxvdyDov4fnqIvkuK3vvIxTY3JvbGxCYXIg5Lmf5Lya5a2Y5Zyo6ZyA6KaB5YiH5o2i5bGV56S65ZKM6ZqQ6JeP55qE5oOF5Ya1XG4gICAqIDIuIHJlZmxvdyDkuYvlkI7vvIxTY3JvbGxCYXIg55qE5L2N572u5LiN5piv566A5Y2V55qE6K6+572u5Li6IFNjcm9sbFZpZXcg6aG26YOo5ZKM5bem6L6577yM6L+Y5Y+v6IO95piv5rua5Yqo5LqG5LiA5q616Led56a75ZCO5omn6KGM55qEIHJlZmxvd1xuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhkaW1lbnNpb25zOiBJRGltZW5zaW9ucykge1xuICAgIGNvbnN0IHN0eWxlID0gdXBkYXRlU3R5bGVGcm9tRGltZW5zaW9ucyh0aGlzLndpZHRoLCB0aGlzLmRpcmVjdGlvbiwgZGltZW5zaW9ucyk7XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHN0eWxlKTtcblxuICAgIGlmIChjaGVja05lZWRIaWRlU2Nyb2xsQmFyKHRoaXMuZGlyZWN0aW9uLCBkaW1lbnNpb25zKSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSGlkZSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gZGltZW5zaW9ucztcblxuICAgIC8vIOW3sue7j+a7muWKqOi/h+S4gOautei3neemu+eahOaDheWGte+8jOmHjeaWsOiuoeeul+aWsOeahOa7muWKqOS9jee9rlxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUoZGltZW5zaW9ucy5zY3JvbGxMZWZ0LCBkaW1lbnNpb25zLnNjcm9sbFRvcCk7XG5cbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFNjcm9sbEJhckRpcmVjdGlvbi5WZXJ0aXZhbCkge1xuICAgICAgdGhpcy5zdHlsZS50b3AgPSBzY3JvbGxUb3A7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3R5bGUubGVmdCA9IHNjcm9sbExlZnQ7XG4gICAgfVxuXG4gICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZSArIHRoaXMuYXV0b0hpZGVEZWxheVRpbWU7XG4gIH1cblxuICBjYWxjdWx0ZVNjcm9sbFZhbHVlKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBsZXQgc2Nyb2xsTGVmdCA9IDA7XG4gICAgbGV0IHNjcm9sbFRvcCA9IDA7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBTY3JvbGxCYXJEaXJlY3Rpb24uVmVydGl2YWwpIHtcbiAgICAgIGNvbnN0IGNhblNjcm9sbFBlcmNlbnQgPSAxIC0gdGhpcy5kaW1lbnNpb25zLmhlaWdodCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50SGVpZ2h0O1xuXG4gICAgICAvLyDmu5rliqjmnaHmnIDlpKfmu5rliqjpq5jluqZcbiAgICAgIGNvbnN0IHNjcm9sbEJhck1heFNjcm9sbFRvcCA9IHRoaXMuZGltZW5zaW9ucy5oZWlnaHQgKiBjYW5TY3JvbGxQZXJjZW50O1xuXG4gICAgICBjb25zdCBwZXJjZW50ID0gdG9wIC8gdGhpcy5kaW1lbnNpb25zLm1heFNjcm9sbFRvcDtcbiAgICAgIGNvbnN0IHBlcmNlbnRUb3AgPSBzY3JvbGxCYXJNYXhTY3JvbGxUb3AgKiBwZXJjZW50O1xuXG4gICAgICBzY3JvbGxUb3AgPSBjbGFtcChwZXJjZW50VG9wLCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxUb3ApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjYW5TY3JvbGxQZXJjZW50ID0gMSAtIHRoaXMuZGltZW5zaW9ucy53aWR0aCAvIHRoaXMuZGltZW5zaW9ucy5jb250ZW50V2lkdGg7XG4gICAgICBjb25zdCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0ID0gdGhpcy5kaW1lbnNpb25zLndpZHRoICogY2FuU2Nyb2xsUGVyY2VudDtcblxuICAgICAgY29uc3QgcGVyY2VudCA9IGxlZnQgLyB0aGlzLmRpbWVuc2lvbnMubWF4U2Nyb2xsTGVmdDtcblxuICAgICAgc2Nyb2xsTGVmdCA9IGNsYW1wKHNjcm9sbEJhck1heFNjcm9sbExlZnQgKiBwZXJjZW50LCAwLCBzY3JvbGxCYXJNYXhTY3JvbGxMZWZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBzY3JvbGxMZWZ0LCBzY3JvbGxUb3AgfTtcbiAgfVxuXG4gIG9uU2Nyb2xsKGxlZnQ6IG51bWJlciwgdG9wOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmN1cnJMZWZ0ID0gbGVmdDtcbiAgICB0aGlzLmN1cnJUb3AgPSB0b3A7XG4gIFxuICAgIGNvbnN0IHsgc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wIH0gPSB0aGlzLmNhbGN1bHRlU2Nyb2xsVmFsdWUobGVmdCwgdG9wKTtcblxuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsKSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVkgPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZICsgc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmxheW91dEJveC5hYnNvbHV0ZVggPSB0aGlzLnBhcmVudCEubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVYICsgc2Nyb2xsTGVmdDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5hdXRvSGlkZSkge1xuICAgICAgLy8gdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSB0aGlzLmF1dG9IaWRlVGltZTtcbiAgICAgIHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lID0gdGhpcy5hdXRvSGlkZVRpbWUgKyB0aGlzLmF1dG9IaWRlRGVsYXlUaW1lO1xuICAgIH1cblxuICAgIHRoaXMuc3R5bGUub3BhY2l0eSA9IDE7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgdGhpcy5yb290LnRpY2tlci5yZW1vdmUodGhpcy51cGRhdGUsIHRydWUpO1xuXG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgfVxuXG4gIHVwZGF0ZSA9IChkdDogbnVtYmVyKSA9PiB7XG4gICAgaWYgKCF0aGlzLmF1dG9IaWRlIHx8IHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIDw9IDAgfHwgdGhpcy5pc0hpZGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSAtPSBkdDtcblxuICAgIGlmICh0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSA8PSB0aGlzLmF1dG9IaWRlVGltZSkge1xuICAgICAgdGhpcy5hdXRvSGlkZVJlbWFpbmluZ1RpbWUgPSBNYXRoLm1heCgwLCB0aGlzLmF1dG9IaWRlUmVtYWluaW5nVGltZSk7XG4gICAgICB0aGlzLnN0eWxlLm9wYWNpdHkgPSB0aGlzLnN0eWxlLm9wYWNpdHkgYXMgbnVtYmVyICogKHRoaXMuYXV0b0hpZGVSZW1haW5pbmdUaW1lIC8gdGhpcy5hdXRvSGlkZVRpbWUpO1xuICAgIH1cbiAgfVxufVxuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW5kZXJzY29yZS1kYW5nbGUgKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXBhcmFtLXJlYXNzaWduICovXG5pbXBvcnQgVmlldyBmcm9tICcuL3ZpZXcnO1xuaW1wb3J0IHsgY29weVRvdWNoQXJyYXkgfSBmcm9tICcuLi9jb21tb24vdXRpbCc7XG5pbXBvcnQgU2Nyb2xsZXIgZnJvbSAnLi4vbGlicy9zY3JvbGxlci9pbmRleC5qcydcbmltcG9ydCB7IGl0ZXJhdGVUcmVlIH0gZnJvbSAnLi4vY29tbW9uL3ZkJztcbmltcG9ydCBFbGVtZW50LCB7IHNldERpcnR5IH0gZnJvbSAnLi9lbGVtZW50cyc7XG5pbXBvcnQgeyBJRWxlbWVudE9wdGlvbnMgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCBTY3JvbGxCYXIsIHsgU2Nyb2xsQmFyRGlyZWN0aW9uIH0gZnJvbSAnLi9zY3JvbGxiYXInO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnXG5cbmNvbnN0IGRwciA9IGVudi5nZXREZXZpY2VQaXhlbFJhdGlvKCk7XG5cbmludGVyZmFjZSBJU2Nyb2xsVmlld09wdGlvbnMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICBzY3JvbGxYPzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgc2Nyb2xsWT86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG59XG5cbmludGVyZmFjZSBJSW5uZXJTY3JvbGxlck9wdGlvbiB7XG4gIHNjcm9sbGluZ1g/OiBib29sZWFuO1xuICBzY3JvbGxpbmdZPzogYm9vbGVhbjtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjcm9sbFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgcHVibGljIHNjcm9sbFRvcCA9IDA7XG4gIHB1YmxpYyBzY3JvbGxMZWZ0ID0gMDtcbiAgcHVibGljIGhhc0V2ZW50QmluZCA9IGZhbHNlO1xuICBwdWJsaWMgY3VycmVudEV2ZW50ID0gbnVsbDtcbiAgcHVibGljIHR5cGUgPSAnU2Nyb2xsVmlldyc7XG5cbiAgcHJpdmF0ZSBzY3JvbGxZUHJvcDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbm5lclNjcm9sbGVyT3B0aW9uOiBJSW5uZXJTY3JvbGxlck9wdGlvbjtcblxuICBwcml2YXRlIHNjcm9sbGVyT2JqPzogU2Nyb2xsZXI7XG4gIHByaXZhdGUgaXNGaXJzdFNjcm9sbD86IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSB2ZXJ0aXZhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgaG9yaXpvbnRhbFNjcm9sbGJhcjogU2Nyb2xsQmFyIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgc2Nyb2xsWCxcbiAgICBzY3JvbGxZLFxuICAgIGRhdGFzZXQsXG4gIH06IElTY3JvbGxWaWV3T3B0aW9ucykge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWROYW1lLFxuICAgICAgZGF0YXNldCxcbiAgICAgIGNsYXNzTmFtZSxcbiAgICB9KTtcblxuICAgIHRoaXMuc2Nyb2xsWVByb3AgPSBzY3JvbGxZO1xuXG4gICAgdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uID0ge1xuICAgICAgc2Nyb2xsaW5nWDogISFzY3JvbGxYLFxuICAgICAgc2Nyb2xsaW5nWTogISFzY3JvbGxZLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICog6I635Y+W5rua5Yqo5YiX6KGo5YaF5omA5pyJ5YWD57Sg55qE6auY5bqm5ZKMXG4gICAqIOi/memHjOS4jeiDveeugOWNleWwhuaJgOacieWtkOWFg+e0oOeahOmrmOW6pue0r+WKoO+8jOWboOS4uuavj+S4quWFg+e0oOS5i+mXtOWPr+iDveaYr+acieepuumameeahFxuICAgKi9cbiAgZ2V0IHNjcm9sbEhlaWdodCgpIHtcbiAgICBsZXQgbWF4SGVpZ2h0ID0gMDtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goKGl0ZW06IEVsZW1lbnQpID0+IHtcbiAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgIG1heEhlaWdodCA9IE1hdGgubWF4KG1heEhlaWdodCwgaXRlbS5sYXlvdXRCb3gudG9wICsgaXRlbS5sYXlvdXRCb3guaGVpZ2h0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbWF4SGVpZ2h0O1xuICB9XG5cbiAgZ2V0IHNjcm9sbFdpZHRoKCkge1xuICAgIGxldCBtYXhXaWR0aCA9IDA7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChpdGVtOiBFbGVtZW50KSA9PiB7XG4gICAgICBpZiAoIShpdGVtIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICBtYXhXaWR0aCA9IE1hdGgubWF4KG1heFdpZHRoLCBpdGVtLmxheW91dEJveC5sZWZ0ICsgaXRlbS5sYXlvdXRCb3gud2lkdGgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1heFdpZHRoO1xuICB9XG5cbiAgZ2V0IHNjcm9sbFgoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJTY3JvbGxlck9wdGlvbi5zY3JvbGxpbmdYO1xuICB9XG5cbiAgc2V0IHNjcm9sbFgodmFsdWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbygwLCB0aGlzLnNjcm9sbFRvcCwgdHJ1ZSwgMSk7XG4gICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgIHNjcm9sbGluZ1g6IHZhbHVlLFxuICAgIH07XG5cbiAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWCcsICdob3Jpem9udGFsU2Nyb2xsYmFyJyk7XG4gIH1cblxuICBnZXQgc2Nyb2xsWSgpIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lclNjcm9sbGVyT3B0aW9uLnNjcm9sbGluZ1k7XG4gIH1cblxuICBzZXQgc2Nyb2xsWSh2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdGhpcy5zY3JvbGxZKSB7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyh0aGlzLnNjcm9sbExlZnQsIDAsIHRydWUsIDEpO1xuICAgICAgdGhpcy5zY3JvbGxlck9wdGlvbiA9IHtcbiAgICAgICAgc2Nyb2xsaW5nWTogdmFsdWUsXG4gICAgICB9O1xuXG4gICAgICB0aGlzLnNjcm9sbGVyT2JqICYmIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxZJywgJ3ZlcnRpdmFsU2Nyb2xsYmFyJyk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IHNjcm9sbGVyT3B0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb247XG4gIH1cblxuICBzZXQgc2Nyb2xsZXJPcHRpb24odmFsdWU6IElJbm5lclNjcm9sbGVyT3B0aW9uKSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmlubmVyU2Nyb2xsZXJPcHRpb24sIHZhbHVlKTtcblxuICAgIGlmICh0aGlzLnNjcm9sbGVyT2JqKSB7XG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMuc2Nyb2xsZXJPYmoub3B0aW9ucywgdGhpcy5zY3JvbGxlck9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVwYWludCgpIHtcbiAgICB0aGlzLnNjcm9sbFJlbmRlcigpO1xuICB9XG5cbiAgZGVzdHJveVNlbGYoKSB7XG4gICAgLy8gdGhpcy50b3VjaCA9IG51bGw7XG4gICAgdGhpcy5pc0Rlc3Ryb3llZCA9IHRydWU7XG5cbiAgICB0aGlzLmN0eCA9IG51bGw7XG4gICAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICAgIHRoaXMucm9vdCEub2ZmKCd0b3VjaGVuZCcpO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gIH1cblxuICByZW5kZXJUcmVlV2l0aFRvcCh0cmVlOiBFbGVtZW50KSB7XG4gICAgaWYgKCEodHJlZSBpbnN0YW5jZW9mIFNjcm9sbEJhcikpIHtcbiAgICAgIHRyZWUucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgdHJlZS5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogRWxlbWVudCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXJUcmVlV2l0aFRvcChjaGlsZCk7XG4gICAgfSk7XG4gIH1cblxuICBjbGVhcigpIHtcbiAgICBjb25zdCBib3ggPSB0aGlzLmxheW91dEJveDtcbiAgICB0aGlzLmN0eCEuY2xlYXJSZWN0KGJveC5hYnNvbHV0ZVgsIGJveC5hYnNvbHV0ZVksIGJveC53aWR0aCwgYm94LmhlaWdodCk7XG4gIH1cblxuICBzY3JvbGxSZW5kZXIoKSB7XG4gICAgY29uc3QgYm94ID0gdGhpcy5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCB7IGFic29sdXRlWDogc3RhcnRYLCBhYnNvbHV0ZVk6IHN0YXJ0WSwgd2lkdGgsIGhlaWdodCB9ID0gYm94O1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICAgIC8vIOagueaNrua7muWKqOWAvOiOt+WPluijgeWJquWMuuWfn1xuICAgIGNvbnN0IGVuZFggPSBzdGFydFggKyB3aWR0aDtcbiAgICBjb25zdCBlbmRZID0gc3RhcnRZICsgaGVpZ2h0O1xuXG4gICAgLy8gU2Nyb2xsVmlldyDkvZzkuLrlrrnlmajmnKzouqvnmoTmuLLmn5NcbiAgICB0aGlzLnJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICog5byA5aeL6KOB5Ymq77yM5Y+q5pyJ5LuUIFNjcm9sbFZpZXcgbGF5b3V0Qm94IOWMuuWfn+WGheeahOWFg+e0oOaJjeaYr+WPr+ingeeahFxuICAgICAqIOi/meagtyBTY3JvbGxWaWV3IOS4jeeUqOWNleeLrOWNoOeUqOS4gOS4qiBjYW52YXPvvIzlhoXlrZjlkIjmuLLmn5Ppg73kvJrlvpfliLDkvJjljJZcbiAgICAgKi9cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5yZWN0KHN0YXJ0WCwgc3RhcnRZLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICBjdHguY2xpcCgpO1xuXG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBhYnNvbHV0ZVgsIGFic29sdXRlWSB9ID0gY2hpbGQubGF5b3V0Qm94O1xuXG4gICAgICAvLyDliKTmlq3lpITkuo7lj6/op4bnqpflj6PlhoXnmoTlrZDoioLngrnvvIzpgJLlvZLmuLLmn5Por6XlrZDoioLngrlcbiAgICAgIGlmIChhYnNvbHV0ZVkgKyBoZWlnaHQgPj0gc3RhcnRZICYmIGFic29sdXRlWSA8PSBlbmRZXG4gICAgICAgICYmIGFic29sdXRlWCArIHdpZHRoID49IHN0YXJ0WCAmJiBhYnNvbHV0ZVggPD0gZW5kWCkge1xuICAgICAgICB0aGlzLnJlbmRlclRyZWVXaXRoVG9wKGNoaWxkKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIOS4iumdoueahOa4suafk+W6lOivpeWFiOi3s+i/h+a7muWKqOadoe+8jOWQpuWImeWPr+iDveWHuueOsOa4suafk+mhuuW6j+mXrumimO+8jFNjcm9sbFZpZXfnmoToioLngrnlj43ogIzmiormu5rliqjmnaHnm5bkvY/kuoZcbiAgICB0aGlzLnZlcnRpdmFsU2Nyb2xsYmFyPy5yZW5kZXIoKTtcbiAgICB0aGlzLmhvcml6b250YWxTY3JvbGxiYXI/LnJlbmRlcigpO1xuXG4gICAgY3R4LnJlc3RvcmUoKTtcbiAgfVxuXG4gIHNjcm9sbEhhbmRsZXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlcikge1xuICAgIC8vIOWPr+iDveiiq+mUgOavgeS6huaIluiAheiKgueCueagkei/mOayoeWHhuWkh+WlvVxuICAgIGlmICghdGhpcy5pc0Rlc3Ryb3llZCAmJiAhdGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICBpdGVyYXRlVHJlZSh0aGlzLCAoZWxlKSA9PiB7XG4gICAgICAgIGlmIChlbGUgIT09IHRoaXMgJiYgIShlbGUgaW5zdGFuY2VvZiBTY3JvbGxCYXIpKSB7XG4gICAgICAgICAgZWxlLmxheW91dEJveC5hYnNvbHV0ZVkgPSBlbGUubGF5b3V0Qm94Lm9yaWdpbmFsQWJzb2x1dGVZIC0gdG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIGxlZnQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyDov5nph4zopoHmiormu5rliqjnirbmgIHkv53lrZjotbfmnaXvvIzlm6DkuLrlnKhyZWZsb3fnmoTml7blgJnpnIDopoHlgZrph43nva7vvIzmuLLmn5PlubbkuI3kvp3otZbov5nkuKTkuKrkv6Hmga9cbiAgICAgIHRoaXMuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5zY3JvbGxMZWZ0ID0gbGVmdDtcblxuICAgICAgdGhpcy52ZXJ0aXZhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcbiAgICAgIHRoaXMuaG9yaXpvbnRhbFNjcm9sbGJhcj8ub25TY3JvbGwobGVmdCwgdG9wKTtcblxuICAgICAgdGhpcy5yb290IS5lbWl0KCdyZXBhaW50Jyk7XG5cbiAgICAgIGlmICh0aGlzLmN1cnJlbnRFdmVudCkge1xuICAgICAgICB0aGlzLmVtaXQoJ3Njcm9sbCcsIHRoaXMuY3VycmVudEV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc0ZpcnN0U2Nyb2xsKSB7XG4gICAgICB0aGlzLmlzRmlyc3RTY3JvbGwgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICog5b2T5omn6KGMcmVmbG935LmL5ZCO77yM5rua5Yqo5YiX6KGo55qE6auY5bqm5Y+v6IO95Y+R55Sf5LqG5Y+Y5YyW77yM5rua5Yqo5p2h5Lmf6ZyA6KaB5ZCM5q2l6L+b6KGM5pu05pawXG4gICAqL1xuICB1cGRhdGVTY3JvbGxCYXIoc2Nyb2xsUHJvcDogc3RyaW5nLCBzY3JvbGxCYXJOYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBkaW1lbnNpb25zID0ge1xuICAgICAgd2lkdGg6IHRoaXMubGF5b3V0Qm94LndpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICBjb250ZW50V2lkdGg6IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoLFxuICAgICAgY29udGVudEhlaWdodDogdGhpcy5zY3JvbGxlck9iaiEuX19jb250ZW50SGVpZ2h0LFxuICAgICAgbWF4U2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19tYXhTY3JvbGxMZWZ0LFxuICAgICAgbWF4U2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX21heFNjcm9sbFRvcCxcblxuICAgICAgc2Nyb2xsTGVmdDogdGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LFxuICAgICAgc2Nyb2xsVG9wOiB0aGlzLnNjcm9sbGVyT2JqIS5fX3Njcm9sbFRvcCxcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygndXBkYXRlU2Nyb2xsQmFyJywgSlNPTi5zdHJpbmdpZnkoZGltZW5zaW9ucykpXG5cbiAgICAvLyDpnZ7nrKzkuIDmrKHliJvlu7rnmoTmg4XlhrXvvIzkuIDoiKzmmK8gcmVmbG93IOaJp+ihjOWIsOi/memHjFxuICAgIGlmICh0aGlzW3Njcm9sbFByb3AgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddLnNldERpbWVuc2lvbnMoZGltZW5zaW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzY3JvbGxCYXIgPSBuZXcgU2Nyb2xsQmFyKHtcbiAgICAgICAgICBkaW1lbnNpb25zLFxuICAgICAgICAgIGRpcmVjdGlvbjogc2Nyb2xsUHJvcCA9PT0gJ3Njcm9sbFknID8gU2Nyb2xsQmFyRGlyZWN0aW9uLlZlcnRpdmFsIDogU2Nyb2xsQmFyRGlyZWN0aW9uLkhvcml6b250YWwsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuYXBwZW5kQ2hpbGQoc2Nyb2xsYmFyKTtcbiAgICAgICAgc2Nyb2xsQmFyLnJvb3QgPSB0aGlzLnJvb3Q7XG4gICAgICAgIHNjcm9sbEJhci5pbml0KCk7XG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgc2Nyb2xsQmFyLmluc2VydCh0aGlzLnJvb3QucmVuZGVyQ29udGV4dCwgdHJ1ZSk7XG4gICAgICAgIHNjcm9sbEJhci5vYnNlcnZlU3R5bGVBbmRFdmVudCgpO1xuICAgICAgICB0aGlzLmFkZChzY3JvbGxCYXIpO1xuXG4gICAgICAgIHNldERpcnR5KHNjcm9sbEJhciwgJ2FwcGVuZFRvU2Nyb2xsVmlldycpXG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0aGlzW3Njcm9sbEJhck5hbWVdID0gc2Nyb2xsQmFyO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lXT8ub25TY3JvbGwodGhpcy5zY3JvbGxlck9iaiEuX19zY3JvbGxMZWZ0LCB0aGlzLnNjcm9sbGVyT2JqIS5fX3NjaGVkdWxlZFRvcCk7XG4gICAgICAgICAgdGhpcy5yb290Py5lbWl0KCdyZXBhaW50Jyk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyDlvZPkuI3lho3pnIDopoHnurXlkJHmu5rliqjnmoTml7blgJnplIDmr4HnurXlkJHmu5rliqjmnaFcbiAgICAgIGlmICh0aGlzW3Njcm9sbEJhck5hbWUgYXMga2V5b2YgU2Nyb2xsVmlld10pIHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQmFyID0gdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddO1xuICAgICAgICBzY3JvbGxCYXIucmVtb3ZlKCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95KCk7XG4gICAgICAgIHNjcm9sbEJhci5kZXN0cm95U2VsZigpO1xuXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpc1tzY3JvbGxCYXJOYW1lIGFzIGtleW9mIFNjcm9sbFZpZXddID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpbnNlcnQoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcbiAgICB0aGlzLmN0eCA9IGNvbnRleHQ7XG5cbiAgICAvKipcbiAgICAgKiDov5nph4zmnInkuKrpnZ7luLjnibnmrornmoTlhbzlrrnpgLvovpHvvIzlnKjkvY7niYjmnKzmsqHmnInph43mnoQgU2Nyb2xsVmlld+S5i+WJje+8jOW5tuayoeacieaPkOS+m+WNleeLrOeahCBTY3JvbGxYIOWSjCBTY3JvbGxZIOWxnuaAp1xuICAgICAqIOiAjOaYr+WIpOaWrSBzY3JvbGxIZWlodCDlpKfkuo7lrrnlmajpq5jluqbnmoTml7blgJnoh6rliqjlrp7njrDkuobnurXlkJHmu5rliqjvvIjkuJTmsqHmnInmqKrlkJHmu5rliqjog73lipvvvIlcbiAgICAgKiDlm6DmraTov5nph4zlgZrkuIDkuKrlhbzlrrnpgLvovpHvvIzlpoLmnpwgc2Nyb2xsSGVpZ2h0ID4gdGhpcy5sYXlvdXRCb3guaGVpZ2h0IOiHquWKqOW8gOWQr+e6teWQkea7muWKqFxuICAgICAqL1xuICAgIGlmICh0aGlzLnNjcm9sbEhlaWdodCA+IHRoaXMubGF5b3V0Qm94LmhlaWdodCAmJiB0eXBlb2YgdGhpcy5zY3JvbGxZUHJvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDoh6rliqjlvIDlkK8gc2Nyb2xsWWApO1xuICAgICAgdGhpcy5zY3JvbGxZID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5oYXNFdmVudEJpbmQpIHtcbiAgICAgIC8vIHJlZmxvdyDpq5jluqblj6/og73kvJrlj5jljJbvvIzlm6DmraTpnIDopoHmiafooYwgc2V0RGltZW5zaW9ucyDliLfmlrDlj6/mu5rliqjljLrln59cbiAgICAgIGlmICh0aGlzLmxheW91dEJveC53aWR0aCAhPT0gdGhpcy5zY3JvbGxlck9iaiEuX19jbGllbnRXaWR0aFxuICAgICAgICB8fCB0aGlzLmxheW91dEJveC5oZWlnaHQgIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY2xpZW50SGVpZ2h0XG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsV2lkdGggIT09IHRoaXMuc2Nyb2xsZXJPYmohLl9fY29udGVudFdpZHRoXG4gICAgICAgIHx8IHRoaXMuc2Nyb2xsSGVpZ2h0ICE9PSB0aGlzLnNjcm9sbGVyT2JqIS5fX2NvbnRlbnRIZWlnaHQpIHtcbiAgICAgICAgdGhpcy5zY3JvbGxlck9iaiEuc2V0RGltZW5zaW9ucyhcbiAgICAgICAgICB0aGlzLmxheW91dEJveC53aWR0aCxcbiAgICAgICAgICB0aGlzLmxheW91dEJveC5oZWlnaHQsXG4gICAgICAgICAgdGhpcy5zY3JvbGxXaWR0aCxcbiAgICAgICAgICB0aGlzLnNjcm9sbEhlaWdodCxcbiAgICAgICAgKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog6L+Z6YeM5LmL5omA5Lul6KaB5bu26L+f5LiA5bin5piv5Zug5Li66L+Z6YeM55qE5Y+Y5Yqo5p2l6IeqIHJlZmxvdyDkuYvlkI7vvIzmraPlnKjlgZogcmVmbG93IOS5i+WQjueahOWQjue7reS6i+aDhVxuICAgICAgICAgKiDlpoLmnpznq4vljbPkv67mlLnmu5rliqjmnaHnmoTmoLflvI/vvIzlrp7pmYXkuIrlubbkuI3kvJrnlJ/mlYjjgIJcbiAgICAgICAgICovXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgdGhpcy5yb290LnRpY2tlci5uZXh0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsQmFyKCdzY3JvbGxYJywgJ2hvcml6b250YWxTY3JvbGxiYXInKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlZmxvdyDkuYvlkI7vvIzkvJrku44gY3NzbGF5b3V0IOWQjOatpeW4g+WxgOS/oeaBr++8jOWOn+WFiOeahOa7muWKqOS/oeaBr+S8muS4ouWkse+8jOi/memHjOmcgOimgeS4gOS4quWkjeS9jeeahOaTjeS9nFxuICAgICAgaXRlcmF0ZVRyZWUodGhpcywgKGVsZSkgPT4ge1xuICAgICAgICBpZiAoZWxlICE9PSB0aGlzICYmICEoZWxlIGluc3RhbmNlb2YgU2Nyb2xsQmFyKSkge1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVZID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWSAtIHRoaXMuc2Nyb2xsVG9wO1xuICAgICAgICAgIGVsZS5sYXlvdXRCb3guYWJzb2x1dGVYID0gZWxlLmxheW91dEJveC5vcmlnaW5hbEFic29sdXRlWCAtIHRoaXMuc2Nyb2xsTGVmdDtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmhhc0V2ZW50QmluZCA9IHRydWU7XG4gICAgdGhpcy5pc0ZpcnN0U2Nyb2xsID0gdHJ1ZTtcblxuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB0aGlzLnNjcm9sbGVyT2JqID0gbmV3IFNjcm9sbGVyKHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kKHRoaXMpLCB0aGlzLnNjcm9sbGVyT3B0aW9uKTtcblxuICAgIHRoaXMuc2Nyb2xsZXJPYmohLnNldERpbWVuc2lvbnModGhpcy5sYXlvdXRCb3gud2lkdGgsIHRoaXMubGF5b3V0Qm94LmhlaWdodCwgdGhpcy5zY3JvbGxXaWR0aCwgdGhpcy5zY3JvbGxIZWlnaHQpO1xuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHRoaXMucm9vdC50aWNrZXIubmV4dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbEJhcignc2Nyb2xsWScsICd2ZXJ0aXZhbFNjcm9sbGJhcicpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxCYXIoJ3Njcm9sbFgnLCAnaG9yaXpvbnRhbFNjcm9sbGJhcicpO1xuICAgIH0sIHRydWUpO1xuXG4gICAgdGhpcy5vbigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICBpZiAoIWUudG91Y2hlcykge1xuICAgICAgICBlLnRvdWNoZXMgPSBbZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBjb3B5VG91Y2hBcnJheShlLnRvdWNoZXMpO1xuXG4gICAgICB0b3VjaGVzLmZvckVhY2goKHRvdWNoKSA9PiB7XG4gICAgICAgIGlmIChkcHIgIT09IDEpIHtcbiAgICAgICAgICB0b3VjaC5wYWdlWCAqPSBkcHI7XG4gICAgICAgICAgdG91Y2gucGFnZVkgKj0gZHByO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2Nyb2xsZXJPYmohLmRvVG91Y2hTdGFydCh0b3VjaGVzLCBlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9uKCd0b3VjaG1vdmUnLCAoZSkgPT4ge1xuICAgICAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICAgICAgZS50b3VjaGVzID0gW2VdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCB0b3VjaGVzID0gY29weVRvdWNoQXJyYXkoZS50b3VjaGVzKTtcblxuICAgICAgdG91Y2hlcy5mb3JFYWNoKCh0b3VjaCkgPT4ge1xuICAgICAgICBpZiAoZHByICE9PSAxKSB7XG4gICAgICAgICAgdG91Y2gucGFnZVggKj0gZHByO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZICo9IGRwcjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0aGlzLnNjcm9sbGVyT2JqIS5kb1RvdWNoTW92ZSh0b3VjaGVzLCBlLnRpbWVTdGFtcCwgdW5kZWZpbmVkKTtcbiAgICAgIHRoaXMuY3VycmVudEV2ZW50ID0gZTtcbiAgICB9KTtcblxuICAgIC8vIOi/memHjOS4jeW6lOivpeaYr+ebkeWQrHNjcm9sbHZpZXfnmoR0b3VjaGVuZOS6i+S7tuiAjOaYr+Wxj+W5leeahHRvdWNoZW5k5LqL5Lu2XG4gICAgdGhpcy5yb290IS5vbigndG91Y2hlbmQnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5zY3JvbGxlck9iaiEuZG9Ub3VjaEVuZChlLnRpbWVTdGFtcCk7XG4gICAgICB0aGlzLmN1cnJlbnRFdmVudCA9IGU7XG4gICAgfSk7XG4gIH1cblxuICBzY3JvbGxUbyhsZWZ0ID0gMCwgdG9wID0gMCwgYW5pbWF0ZSA9IHRydWUpIHtcbiAgICB0aGlzLnNjcm9sbGVyT2JqIS5zY3JvbGxUbyhsZWZ0LCB0b3AsIGFuaW1hdGUsIDEpO1xuICB9XG59XG4iLCJjb25zdCByZWZsb3dBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ3dpZHRoJywgJ2hlaWdodCcsXG4gICdtaW5XaWR0aCcsICdtaW5IZWlnaHQnLFxuICAnbWF4V2lkdGgnLCAnbWF4SGVpZ2h0JyxcbiAgJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbScsXG4gICdtYXJnaW4nLCAnbWFyZ2luTGVmdCcsICdtYXJnaW5SaWdodCcsICdtYXJnaW5Ub3AnLCAnbWFyZ2luQm90dG9tJyxcbiAgJ3BhZGRpbmcnLCAncGFkZGluZ0xlZnQnLCAncGFkZGluZ1JpZ2h0JywgJ3BhZGRpbmdUb3AnLCAncGFkZGluZ0JvdHRvbScsXG4gICdib3JkZXJXaWR0aCcsICdib3JkZXJMZWZ0V2lkdGgnLCAnYm9yZGVyUmlnaHRXaWR0aCcsICdib3JkZXJUb3BXaWR0aCcsICdib3JkZXJCb3R0b21XaWR0aCcsXG4gICdmbGV4RGlyZWN0aW9uJyxcbiAgJ2ZsZXhTaHJpbmsnLFxuICAnZmxleEdyb3cnLFxuICAnanVzdGlmeUNvbnRlbnQnLFxuICAnYWxpZ25JdGVtcycsICdhbGlnblNlbGYnLFxuICAnZmxleCcsXG4gICdmbGV4V3JhcCcsXG4gICdwb3NpdGlvbicsXG4gICdmb250V2VpZ2h0Jyxcbl07XG5cbmNvbnN0IHJlcGFpbnRBZmZlY3RlZFN0eWxlcyA9IFtcbiAgJ2ZvbnRTaXplJyxcbiAgJ2xpbmVIZWlnaHQnLFxuICAndGV4dEFsaWduJyxcbiAgJ3ZlcnRpY2FsQWxpZ24nLFxuICAnY29sb3InLFxuICAnYmFja2dyb3VuZENvbG9yJyxcbiAgJ3RleHRPdmVyZmxvdycsXG4gICdsZXR0ZXJTcGFjaW5nJyxcbiAgJ2JvcmRlclJhZGl1cycsXG4gICdib3JkZXJDb2xvcicsXG4gICdvcGFjaXR5JyxcbiAgJ3RyYW5zZm9ybScsXG4gICd0ZXh0U3Ryb2tlQ29sb3InLFxuICAndGV4dFN0cm9rZVdpZHRoJyxcbiAgJ3RleHRTaGFkb3cnLFxuXTtcblxuZXhwb3J0IGNvbnN0IHJlbmRlckFmZmVjdFN0eWxlcyA9IFtcbiAgJ3RleHRTaGFkb3cnLFxuICAndHJhbnNmb3JtJyxcbiAgJ2JhY2tncm91bmRJbWFnZScsXG5dXG5cbmludGVyZmFjZSBJU3R5bGUge1xuICAvLyByZWZsb3dBZmZlY3RlZFN0eWxlc1xuICB3aWR0aD86IG51bWJlcjtcbiAgaGVpZ2h0PzogbnVtYmVyO1xuICBtaW5XaWR0aD86IG51bWJlcjtcbiAgbWluSGVpZ2h0PzogbnVtYmVyO1xuICBtYXhXaWR0aD86IG51bWJlcjtcbiAgbWF4SGVpZ2h0PzogbnVtYmVyO1xuICBsZWZ0PzogbnVtYmVyO1xuICByaWdodD86IG51bWJlcjtcbiAgdG9wPzogbnVtYmVyO1xuICBib3R0b20/OiBudW1iZXI7XG4gIG1hcmdpbj86IG51bWJlcjtcbiAgbWFyZ2luTGVmdD86IG51bWJlcjtcbiAgbWFyZ2luUmlnaHQ/OiBudW1iZXI7XG4gIG1hcmdpblRvcD86IG51bWJlcjtcbiAgbWFyZ2luQm90dG9tPzogbnVtYmVyO1xuICBwYWRkaW5nPzogbnVtYmVyO1xuICBwYWRkaW5nTGVmdD86IG51bWJlcjtcbiAgcGFkZGluZ1JpZ2h0PzogbnVtYmVyO1xuICBwYWRkaW5nVG9wPzogbnVtYmVyO1xuICBwYWRkaW5nQm90dG9tPzogbnVtYmVyO1xuICBib3JkZXJXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyTGVmdFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJSaWdodFdpZHRoPzogbnVtYmVyO1xuICBib3JkZXJUb3BXaWR0aD86IG51bWJlcjtcbiAgYm9yZGVyQm90dG9tV2lkdGg/OiBudW1iZXI7XG5cbiAgYm9yZGVyVG9wTGVmdFJhZGl1cz86IG51bWJlcjtcbiAgYm9yZGVyVG9wUmlnaHRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzPzogbnVtYmVyO1xuXG4gIGZsZXhEaXJlY3Rpb24/OiAnY29sdW1uJyB8ICdyb3cnO1xuICBmbGV4U2hyaW5rPzogbnVtYmVyO1xuICBmbGV4R3Jvdz86IG51bWJlcjtcbiAgZmxleFdyYXA/OiAnd3JhcCcgfCAnbm93cmFwJztcbiAganVzdGlmeUNvbnRlbnQ/OiAnZmxleC1zdGFydCcgfCAnY2VudGVyJyB8ICdmbGV4LWVuZCcgfCAnc3BhY2UtYmV0d2VlbicgfCAnc3BhY2UtYXJvdW5kJztcbiAgYWxpZ25JdGVtcz86ICdmbGV4LXN0YXJ0JyB8ICdjZW50ZXInIHwgJ2ZsZXgtZW5kJyB8ICdzdHJldGNoJztcbiAgYWxpZ25TZWxmPzogJ2ZsZXgtc3RhcnQnIHwgJ2NlbnRlcicgfCAnZmxleC1lbmQnIHwgJ3N0cmV0Y2gnO1xuICBwb3NpdGlvbj86IHN0cmluZztcblxuICAvLyByZXBhaW50QWZmZWN0ZWRTdHlsZXNcbiAgZm9udFNpemU/OiBudW1iZXI7XG4gIGxpbmVIZWlnaHQ/OiBudW1iZXIgfCAnc3RyaW5nJztcbiAgdGV4dEFsaWduPzogJ2xlZnQnIHwgJ2NlbnRlcicgfCAncmlnaHQnO1xuICB2ZXJ0aWNhbEFsaWduPzogJ3RvcCcgfCAnbWlkZGxlJyB8ICdib3R0b20nO1xuICBjb2xvcj86IHN0cmluZztcbiAgYmFja2dyb3VuZENvbG9yPzogc3RyaW5nO1xuICB0ZXh0T3ZlcmZsb3c/OiAnZWxsaXBzaXMnIHwgJ2NsaXAnO1xuICBsZXR0ZXJTcGFjaW5nPzogbnVtYmVyO1xuICBib3JkZXJSYWRpdXM/OiBudW1iZXI7XG4gIGJvcmRlckNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJUb3BDb2xvcj86IHN0cmluZztcblxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBzdHJpbmc7XG4gIGJvcmRlckJvdHRvbUNvbG9yPzogc3RyaW5nO1xuICBib3JkZXJMZWZ0Q29sb3I/OiBzdHJpbmc7XG4gIGJvcmRlclJpZ2h0Q29sb3I/OiBzdHJpbmc7XG5cbiAgb3BhY2l0eT86IG51bWJlcjtcbiAgZm9udFdlaWdodD86IHN0cmluZztcbiAgZm9udEZhbWlseT86IHN0cmluZztcblxuICB0cmFuc2Zvcm0/OiBzdHJpbmc7XG5cbiAgLy8g5paH5a2X5o+P6L6555qE5a695bqm77yM6buY6K6k5LiN5o+P6L65XG4gIHRleHRTdHJva2VXaWR0aD86IG51bWJlcjtcbiAgLy8g5paH5a2X5o+P6L6555qE6aKc6Imy77yM5aaC5p6c5oyH5a6a5LqG5o+P6L656aKc6Imy5L2G5piv5rKh5pyJ5oyH5a6a5o+P6L655a695bqm77yM5o+P6L655a695bqm6buY6K6k6K6+572u5Li6MVxuICB0ZXh0U3Ryb2tlQ29sb3I/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIOaWh+Wtl+mYtOW9seaViOaenO+8jHRleHRTaGFkb3fnmoTmoLzlvI/lubbkuI3mmK/kuKXmoLznmoRDU1PmoLzlvI/vvIzku4XmlK/mjIHkuKTnp43moLzlvI9cbiAgICogdGV4dFNoYWRvdzogMXB4IDFweCAycHggcGlua1xuICAgKiB0ZXh0U2hhZG93OiAxcHggMXB4IDJweCByZWQsIDAgMCAxcHggYmx1ZSwgMCAwIDFweCBibHVlLCAxcHggMXB4IDJweCByZWRcbiAgICog5Lmf5bCx5piv5pSv5oyB5Lu75oSP5pWw6YeP55qE6Zi05b2x5pWI5p6c77yM5q+P5Liq6Zi05b2x5pWI5p6c55Sx5Zub5Liq5YC85oyH5a6a77yM5YiG5Yir5pivIHNoYWRvd09mZnNldFgsIHNoYWRvd09mZnNldFksIHNoYWRvd0JsdXIsIHNoYWRvd0NvbG9yXG4gICAqL1xuICB0ZXh0U2hhZG93Pzogc3RyaW5nO1xuXG4gIC8vIOaWh+Wtl+aNouihjOebuOWFs+WxnuaAp1xuXG4gIC8qKlxuICAgKiDlsZ7mgKfnlKjkuo7orr7nva7lpoLkvZXlpITnkIblhYPntKDlhoXnmoTnqbrnmb3lrZfnrKbvvIzov5nkuKrlsZ7mgKfmjIflrprkuobkuKTku7bkuovvvJrnqbrnmb3lrZfnrKbmmK/lkKblkIjlubbvvIzku6Xlj4rlpoLkvZXlkIjlubbjgILmmK/lkKbmjaLooYzvvIzku6Xlj4rlpoLkvZXmjaLooYxcbiAgICog6K+m57uG55qE6KeE5YiZ5Y+v5Y+C6ICDOlxuICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy96aC1DTi9kb2NzL1dlYi9DU1Mvd2hpdGUtc3BhY2VcbiAgICogXG4gICAqIG5vcm1hbDog6L+e57ut55qE56m655m956ym5Lya6KKr5ZCI5bm244CC5rqQ56CB5Lit55qE5o2i6KGM56ym5Lya6KKr5b2T5L2c56m655m956ym5p2l5aSE55CG44CC5bm25qC55o2u5aGr5YWF6KGM5qGG55uS5a2Q55qE6ZyA6KaB5p2l5o2i6KGM44CCXG4gICAqIG5vd3JhcDog5ZKMIG5vcm1hbCDkuIDmoLflkIjlubbnqbrnmb3nrKbvvIzkvYbpmLvmraLmupDnoIHkuK3nmoTmlofmnKzmjaLooYzjgIJcbiAgICogcHJlOiDov57nu63nmoTnqbrnmb3nrKbkvJrooqvkv53nlZnjgILku4XlnKjpgYfliLDmjaLooYznrKbml7bmiY3kvJrmjaLooYzjgIJcbiAgICogcHJlLXdyYXA6IOi/nue7reeahOepuueZveespuS8muiiq+S/neeVmeOAguWcqOmBh+WIsOaNouihjOespuaXtuagueaNruWhq+WFheihjOahhuebkuWtkOeahOmcgOimgeaNouihjOOAglxuICAgKiBwcmUtbGluZTog6L+e57ut55qE56m655m956ym5Lya6KKr5ZCI5bm244CC5Zyo6YGH5Yiw5o2i6KGM56ym5pe25qC55o2u5aGr5YWF6KGM5qGG55uS5a2Q55qE6ZyA6KaB5o2i6KGM44CCXG4gICAqL1xuXG4gIC8qKlxuICAgKiB3aGl0ZS1zcGFjZSDlsZ7mgKflr7nnqbrnmb3nrKblkozmjaLooYznmoTlpITnkIbop4TliJnvvJpcbiAgICogXG4gICAqIHwg5bGe5oCn5YC8ICAgICAgfCDmjaLooYznrKYgIHwg56m65qC8L+WItuihqOespiAgIHwg5paH5pys5o2i6KGMIHwg6KGM5pyr56m65qC8IHwg5YW25LuW56m655m95YiG6ZqU56ymIHxcbiAgICogfC0tLS0tLS0tLS0tLXwtLS0tLS0tLXwtLS0tLS0tLS0tLS0gfC0tLS0tLS0tLXwtLS0tLS0tLS18LS0tLS0tLS0tLS0tLS18XG4gICAqIHwgbm9ybWFsICAgICB8IOWQiOW5tiAgICB8IOWQiOW5tiAgICAgICAgfCDmjaLooYwgICAgIHwg56e76ZmkICAgICB8IOaMgui1tyAgICAgICAgIHxcbiAgICogfCBub3dyYXAgICAgIHwg5ZCI5bm2ICAgIHwg5ZCI5bm2ICAgICAgICB8IOS4jeaNouihjCAgIHwg56e76ZmkICAgICB8IOaMgui1tyAgICAgICAgIHxcbiAgICogfCBwcmUgICAgICAgIHwg5L+d55WZICAgIHwg5L+d55WZICAgICAgICB8IOS4jeaNouihjCAgIHwg5L+d55WZICAgICB8IOS4jeaNouihjCAgICAgICB8XG4gICAqIHwgcHJlLXdyYXAgICB8IOS/neeVmSAgICB8IOS/neeVmSAgICAgICAgfCDmjaLooYwgICAgIHwg5oyC6LW3ICAgICB8IOaMgui1tyAgICAgICAgIHxcbiAgICogfCBwcmUtbGluZSAgIHwg5L+d55WZICAgIHwg5ZCI5bm2ICAgICAgICB8IOaNouihjCAgICAgfCDnp7vpmaQgICAgIHwg5oyC6LW3ICAgICAgICAgfFxuICAgKiBcbiAgICog5pyv6K+t6K+05piO77yaXG4gICAqIC0gXCLlkIjlubZcIu+8mui/nue7reepuueZveespuWQiOW5tuS4uuWNleS4quepuuagvFxuICAgKiAtIFwi5L+d55WZXCLvvJrkv53nlZnljp/lp4vnqbrnmb3nrKbvvIjljIXmi6zmjaLooYzlkoznqbrmoLzvvIlcbiAgICogLSBcIuaMgui1t1wi77ya5YWB6K645Zyo5Y2V6K+N5YaF5o2i6KGM77yI57G75Ly86Iux5paH55qEIHdvcmQtYnJlYWvvvIlcbiAgICogLSBcIuenu+mZpFwi77ya5Yig6Zmk6KGM5pyr55qE56m65qC8XG4gICAqIFxuICAgKiDor7fms6jmhI8gYnJlYWstc3BhY2VzIOS4jeaUr+aMgVxuICAqL1xuICB3aGl0ZVNwYWNlPzogJ25vcm1hbCcgfCAnbm93cmFwJyB8ICdwcmUnIHwgJ3ByZS13cmFwJyB8ICdwcmUtbGluZSc7XG5cbiAgLyoqXG4gICAqIHdvcmRCcmVhayDmjIflrprkuobmgI7moLflnKjljZXor43lhoXmlq3ooYxcbiAgICogbm9ybWFsOiDkvb/nlKjpu5jorqTnmoTmlq3ooYzop4TliJnjgIJcbiAgICogYnJlYWstYWxsOiDlr7nkuo4gbm9uLUNKSyAoQ0pLIOaMh+S4reaWhy/ml6Xmlocv6Z+p5paHKSDmlofmnKzvvIzlj6/lnKjku7vmhI/lrZfnrKbpl7Tmlq3ooYzjgIJcbiAgICovXG4gIHdvcmRCcmVhaz86ICdub3JtYWwnIHwgJ2JyZWFrLWFsbCc7XG5cbiAgLyoqXG4gICAqIOeUqOadpeiuvue9ruaYr+WQpuW6lOivpeWcqOS4gOS4quacrOadpeS4jeiDveaWreW8gOeahOWtl+espuS4suS4reaPkuWFpeaNouihjOespu+8jOS7pemYsuatouaWh+acrOa6ouWHuuWFtuihjOWQkeebkuOAglxuICAgKiBub3JtYWw6IOihjOWPquiDveWcqOato+W4uOeahOWNleivjeaWreeCue+8iOS+i+WmguS4pOS4quWNleivjeS5i+mXtOeahOepuuagvO+8ieWkhOaNouihjFxuICAgKiBicmVhay13b3JkOiDlpoLmnpzooYzkuK3msqHmnInlhbbku5blj6/mjqXlj5fnmoTmlq3ngrnvvIzliJnlhYHorrjlnKjku7vmhI/ngrnlsIbpgJrluLjkuI3lj6/mlq3nmoTljZXor43mjaLooYxcbiAgICovXG4gIG92ZXJmbG93V3JhcD86ICdub3JtYWwnIHwgJ2JyZWFrLXdvcmQnO1xuXG4gICc6YWN0aXZlJz86IElTdHlsZTtcbn1cblxuZXhwb3J0IHsgcmVwYWludEFmZmVjdGVkU3R5bGVzLCByZWZsb3dBZmZlY3RlZFN0eWxlcywgSVN0eWxlIH07XG4iLCJcbmZ1bmN0aW9uIGRlZ3JlZXNUb1JhZGlhbnMoZGVncmVlczogbnVtYmVyKSB7XG4gIHJldHVybiBkZWdyZWVzICogTWF0aC5QSSAvIDE4MDtcbn1cblxuLy8g6IOM5pmv5Zu+5q2j5YiZ6KGo6L6+5byPXG5jb25zdCBpc1ZhbGlkVXJsUHJvcFJlZyA9IC9cXHMqdXJsXFwoKC4qPylcXClcXHMqLztcblxuLy8g6Kej5p6Q6IOM5pmv5Zu+54mHXG5leHBvcnQgZnVuY3Rpb24gYmFja2dyb3VuZEltYWdlUGFyc2VyKHZhbDogc3RyaW5nKSB7XG4gIGlmICh0eXBlb2YgdmFsID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IGxpc3QgPSB2YWwubWF0Y2goaXNWYWxpZFVybFByb3BSZWcpO1xuXG4gICAgaWYgKGxpc3QpIHtcbiAgICAgIGNvbnN0IHVybCA9IGxpc3RbMV0ucmVwbGFjZSgvKCd8XCIpL2csICcnKTtcblxuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG4gIH1cblxuICBjb25zb2xlLmVycm9yKGBbTGF5b3V0XTogJHt2YWx9IGlzIG5vdCBhIHZhbGlkIGJhY2tncm91bmRJbWFnZWApO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5jb25zdCB0ZXh0U2hhZG93UmVnID0gL14oXFxkK3B4XFxzKXsyfVxcZCtweFxccyg/OlthLXpBLVpdK3wjWzAtOWEtZkEtRl17Myw2fSkoLFxccyooXFxkK3B4XFxzKXsyfVxcZCtweFxccyg/OlthLXpBLVpdK3wjWzAtOWEtZkEtRl17Myw2fSkpKiQvO1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRUZXh0U2hhZG93KHRleHRTaGFkb3c6IHN0cmluZykge1xuICByZXR1cm4gdGV4dFNoYWRvd1JlZy50ZXN0KHRleHRTaGFkb3cpO1xufVxuXG5mdW5jdGlvbiBpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAvLyDkvb/nlKjmraPliJnooajovr7lvI/pqozor4HmlbDlrZfmiJbpgJflj7fliIbpmpTnmoTmlbDlrZfvvIzlkI7pnaLlj6/ku6Xot5/lj6/pgInnmoTop5LluqbljZXkvY3vvIhkZWfvvIlcbiAgcmV0dXJuIC9eKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KCxcXHMqKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KSokLy50ZXN0KHZhbHVlKTtcbiAgLy8gcmV0dXJuIC9eKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KCxcXHMqKC0/XFxkKyhcXC5cXGQrKT8pKGRlZyk/KSooLFxccyoodHJ1ZXxmYWxzZSkpPyQvLnRlc3QodmFsdWUpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElSZW5kZXJGb3JMYXlvdXQge1xuICByb3RhdGU/OiBudW1iZXI7IC8vIHN0eWxlLnRyYW5zZm9ybSByb3RhdGXop6PmnpDkuYvlkI7lvpfliLDnmoTlvKfluqbliLZcbiAgc2NhbGVYPzogbnVtYmVyOyAvLyBzdHlsZS50cmFuc2Zvcm0g6Kej5p6Q5LmL5ZCO5b6X5Yiw55qE5qiq5ZCR57yp5pS+5YC8XG4gIHNjYWxlWT86IG51bWJlcjsgLy8gc3R5bGUudHJhbnNmb3JtIOino+aekOS5i+WQjuW+l+WIsOeahOe6teWQkee8qeaUvuWAvFxuICBiYWNrZ3JvdW5kSW1hZ2U/OiBIVE1MSW1hZ2VFbGVtZW50OyAvLyBzdHlsZS5iYWNrZ3JvdW5kSW1hZ2Ug6Kej5p6Q5bm25Yqg6L295LmL5ZCO5b6X5Yiw55qE5Zu+54mH5a6e5L6LXG59XG5cbmludGVyZmFjZSBJVGV4dFNoYWRvdyB7XG4gIG9mZnNldFg6IG51bWJlcjtcbiAgb2Zmc2V0WTogbnVtYmVyO1xuICBibHVyUmFkaXVzOiBudW1iZXI7XG4gIGNvbG9yOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVRleHRSZW5kZXJGb3JMYXlvdXQgZXh0ZW5kcyBJUmVuZGVyRm9yTGF5b3V0IHtcbiAgdGV4dFNoYWRvd3M/OiBudWxsIHwgSVRleHRTaGFkb3dbXTtcbn1cblxuY29uc3QgdHJhbnNmb3JtUmVnZXggPSAvKFxcdyspXFwoKFteKV0rKVxcKS9nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtKHRyYW5zZm9ybTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdDogSVJlbmRlckZvckxheW91dCA9IHt9O1xuXG4gIGxldCBtYXRjaDtcblxuICB3aGlsZSAoKG1hdGNoID0gdHJhbnNmb3JtUmVnZXguZXhlYyh0cmFuc2Zvcm0pKSkge1xuICAgIGNvbnN0IFssIG5hbWUsIHZhbHVlXSA9IG1hdGNoO1xuXG4gICAgaWYgKCFpc1ZhbGlkVHJhbnNmb3JtVmFsdWUodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFtMYXlvdXRdOiBpbnZhbGlkIHZhbHVlIGZvciAke25hbWV9OiAke3ZhbHVlfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlcyA9IHZhbHVlXG4gICAgICAuc3BsaXQoJywnKVxuICAgICAgLm1hcCgodmFsKSA9PiB2YWwudHJpbSgpLnJlcGxhY2UoJ2RlZycsICcnKSlcbiAgICAgIC5tYXAoTnVtYmVyKTtcblxuICAgIHN3aXRjaCAobmFtZSkge1xuICAgICAgY2FzZSAncm90YXRlJzpcbiAgICAgICAgcmVzdWx0LnJvdGF0ZSA9IGRlZ3JlZXNUb1JhZGlhbnModmFsdWVzWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdzY2FsZSc6XG4gICAgICAgIHJlc3VsdC5zY2FsZVggPSB2YWx1ZXNbMF07XG4gICAgICAgIHJlc3VsdC5zY2FsZVkgPSB2YWx1ZXNbMV0gfHwgdmFsdWVzWzBdO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJpbXBvcnQgRWxlbWVudCwgeyBTdHlsZU9wVHlwZSwgc2V0RGlydHkgfSBmcm9tICcuL2VsZW1lbnRzJztcbmltcG9ydCB7IElFbGVtZW50T3B0aW9ucyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgaXNWYWxpZFRleHRTaGFkb3csIElUZXh0UmVuZGVyRm9yTGF5b3V0IH0gZnJvbSAnLi9zdHlsZVBhcnNlcic7XG5pbXBvcnQgeyBwYXJzZVRleHQsIHBhcnNlVGV4dEhlaWdodCwgSU9yaWdpblNvbWVTdHlsZUluZm8gfSBmcm9tICcuL3RleHRQYXJzZXInO1xuXG5jb25zdCBERUZBVUxUX0ZPTlRfRkFNSUxZID0gJ3NhbnMtc2VyaWYnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElUZXh0UHJvcHMgZXh0ZW5kcyBJRWxlbWVudE9wdGlvbnMge1xuICB2YWx1ZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGV4dCBleHRlbmRzIEVsZW1lbnQge1xuICBwcml2YXRlIHZhbHVlc3JjID0gJyc7XG4gIHByaXZhdGUgcGFyc2VkVmFsdWU6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgb3JpZ2luU29tZVN0eWxlSW5mbzogSU9yaWdpblNvbWVTdHlsZUluZm87XG4gIFxuICBwdWJsaWMgZm9udFNpemU/OiBudW1iZXI7XG4gIHB1YmxpYyB0ZXh0QmFzZWxpbmU6IENhbnZhc1RleHRCYXNlbGluZSA9ICdib3R0b20nO1xuICBwdWJsaWMgZm9udCA9ICcnO1xuICBwdWJsaWMgdGV4dEFsaWduOiBDYW52YXNUZXh0QWxpZ24gPSAnbGVmdCc7XG4gIHB1YmxpYyBmaWxsU3R5bGUgPSAnIzAwMDAwMCc7XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvckxheW91dDogSVRleHRSZW5kZXJGb3JMYXlvdXQgPSB7fTtcblxuICBjb25zdHJ1Y3Rvcih7XG4gICAgc3R5bGUgPSB7fSxcbiAgICBpZE5hbWUgPSAnJyxcbiAgICBjbGFzc05hbWUgPSAnJyxcbiAgICB2YWx1ZSA9ICcnLFxuICAgIGRhdGFzZXQsXG4gIH06IElUZXh0UHJvcHMpIHtcbiAgICBzdXBlcih7XG4gICAgICBpZE5hbWUsXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzdHlsZSxcbiAgICAgIGRhdGFzZXQsXG4gICAgfSk7XG5cbiAgICB0aGlzLnR5cGUgPSAnVGV4dCc7XG4gICAgdGhpcy5jdHggPSBudWxsO1xuICAgIHRoaXMudmFsdWVzcmMgPSB2YWx1ZTtcblxuICAgIHRoaXMub3JpZ2luU29tZVN0eWxlSW5mbyA9IHtcbiAgICAgIHdpZHRoOiBzdHlsZS53aWR0aCxcbiAgICAgIGhlaWdodDogc3R5bGUuaGVpZ2h0LFxuICAgICAgbGluZUhlaWdodDogc3R5bGUubGluZUhlaWdodCxcbiAgICB9XG5cbiAgICAvLyDmlofmnKzop6PmnpBcbiAgICB0aGlzLnBhcnNlZFZhbHVlID0gcGFyc2VUZXh0KHN0eWxlLCB0aGlzLm9yaWdpblNvbWVTdHlsZUluZm8sIHZhbHVlKTtcbiAgICBwYXJzZVRleHRIZWlnaHQoc3R5bGUsIHRoaXMub3JpZ2luU29tZVN0eWxlSW5mbyx0aGlzLnBhcnNlZFZhbHVlKTtcblxuICAgIGlmIChzdHlsZS50ZXh0U2hhZG93KSB7XG4gICAgICB0aGlzLnBhcnNlVGV4dFNoYWRvdyhzdHlsZS50ZXh0U2hhZG93KTtcbiAgICB9XG4gIH1cblxuICBzdHlsZUNoYW5nZUhhbmRsZXIocHJvcDogc3RyaW5nLCBzdHlsZU9wVHlwZTogU3R5bGVPcFR5cGUsIHZhbD86IGFueSkge1xuICAgIGlmIChwcm9wID09PSAndGV4dFNoYWRvdycpIHtcbiAgICAgIGlmIChzdHlsZU9wVHlwZSA9PT0gU3R5bGVPcFR5cGUuU2V0KSB7XG4gICAgICAgIHRoaXMucGFyc2VUZXh0U2hhZG93KHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cyA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBwYXJzZVRleHRTaGFkb3codGV4dFNoYWRvdzogc3RyaW5nKSB7XG4gICAgaWYgKCFpc1ZhbGlkVGV4dFNoYWRvdyh0ZXh0U2hhZG93KSkge1xuICAgICAgY29uc29sZS5lcnJvcihgW0xheW91dF06ICR7dGV4dFNoYWRvd30gaXMgbm90IGEgdmFsaWQgdGV4dFNoYWRvd2ApO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyDop6PmnpAgdGV4dC1zaGFkb3cg5a2X56ym5LiyXG4gICAgICB0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cyA9IHRleHRTaGFkb3cuc3BsaXQoJywnKS5tYXAoc2hhZG93ID0+IHtcbiAgICAgICAgY29uc3QgcGFydHMgPSBzaGFkb3cudHJpbSgpLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGNvbnN0IG9mZnNldFggPSBwYXJzZUZsb2F0KHBhcnRzWzBdKTtcbiAgICAgICAgY29uc3Qgb2Zmc2V0WSA9IHBhcnNlRmxvYXQocGFydHNbMV0pO1xuICAgICAgICBjb25zdCBibHVyUmFkaXVzID0gcGFyc2VGbG9hdChwYXJ0c1syXSk7XG4gICAgICAgIGNvbnN0IGNvbG9yID0gcGFydHNbM107XG5cbiAgICAgICAgcmV0dXJuIHsgb2Zmc2V0WCwgb2Zmc2V0WSwgYmx1clJhZGl1cywgY29sb3IgfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldCB2YWx1ZSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZXNyYztcbiAgfVxuXG4gIHNldCB2YWx1ZShuZXdWYWx1ZSkge1xuICAgIGlmIChuZXdWYWx1ZSAhPT0gdGhpcy52YWx1ZXNyYykge1xuICAgICAgdGhpcy52YWx1ZXNyYyA9IG5ld1ZhbHVlO1xuXG4gICAgICB0aGlzLnBhcnNlZFZhbHVlID0gcGFyc2VUZXh0KHRoaXMuc3R5bGUsIHRoaXMub3JpZ2luU29tZVN0eWxlSW5mbywgbmV3VmFsdWUpO1xuICAgICAgcGFyc2VUZXh0SGVpZ2h0KHRoaXMuc3R5bGUsIHRoaXMub3JpZ2luU29tZVN0eWxlSW5mbywgdGhpcy5wYXJzZWRWYWx1ZSk7XG5cbiAgICAgIHNldERpcnR5KHRoaXMsICd2YWx1ZSBjaGFuZ2UnKTtcbiAgICB9XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBkZXN0cm95U2VsZigpIHtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgaW5zZXJ0KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBuZWVkUmVuZGVyOiBib29sZWFuKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5zaG91bGRVcGRhdGUgPSBmYWxzZTtcblxuXG4gICAgaWYgKG5lZWRSZW5kZXIpIHtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5jdHgpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdHlsZSA9IHRoaXMuc3R5bGU7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG5cbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgLy8g6LCD55So5Z+657G755qE5riy5p+T5pa55rOVXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBvcmlnaW5YLCBvcmlnaW5ZLCBkcmF3WCwgZHJhd1ksIHdpZHRoLCBoZWlnaHQgfSA9IHRoaXMuYmFzZVJlbmRlcigpO1xuXG4gICAgLy8g6K6+572u5paH5a2X5riy5p+T5bGe5oCnXG4gICAgY29uc3QgZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgICBjb25zdCBsaW5lSGVpZ2h0ID0gKHN0eWxlLmxpbmVIZWlnaHQgYXMgbnVtYmVyKSB8fCBmb250U2l6ZTtcbiAgICBjdHguZm9udCA9IGAke3N0eWxlLmZvbnRXZWlnaHQgfHwgJ25vcm1hbCd9ICR7Zm9udFNpemV9cHggJHtzdHlsZS5mb250RmFtaWx5IHx8IERFRkFVTFRfRk9OVF9GQU1JTFl9YDtcbiAgICBjdHgudGV4dEJhc2VsaW5lID0gJ21pZGRsZSc7XG4gICAgY3R4LnRleHRBbGlnbiA9IHN0eWxlLnRleHRBbGlnbiB8fCAnbGVmdCc7XG4gICAgY3R4LmZpbGxTdHlsZSA9IHN0eWxlLmNvbG9yIHx8ICcjMDAwMDAwJztcblxuICAgIC8vIOWkhOeQhuaWh+Wtl+aNouihjFxuICAgIGNvbnN0IGxpbmVzID0gdGhpcy5wYXJzZWRWYWx1ZTtcbiAgICBsZXQgeSA9IGRyYXdZIC0gb3JpZ2luWTtcblxuICAgIC8vIOWeguebtOWvuem9kOaWueW8j+WkhOeQhu+8jHRvdGFsSGVpZ2h0IOS7o+ihqOaWh+Wtl+WunumZheWNoOeUqOeahOmrmOW6plxuICAgIGNvbnN0IHRvdGFsSGVpZ2h0ID0gbGluZXMubGVuZ3RoICogbGluZUhlaWdodDtcblxuICAgIGlmIChzdHlsZS52ZXJ0aWNhbEFsaWduID09PSAnbWlkZGxlJykge1xuICAgICAgeSArPSBoZWlnaHQgLyAyOyAvLyDlhYjnp7vliqjliLDlrrnlmajkuK3lv4NcbiAgICAgIHkgLT0gKHRvdGFsSGVpZ2h0IC0gbGluZUhlaWdodCkgLyAyOyAvLyDlho3lh4/ljrvlpJrooYzmlofmnKznmoTkuIDljYrpq5jluqYo5LiN5YyF5ous56ys5LiA6KGMKVxuICAgIH0gZWxzZSBpZiAoc3R5bGUudmVydGljYWxBbGlnbiA9PT0gJ2JvdHRvbScpIHtcbiAgICAgIHkgKz0gaGVpZ2h0OyAvLyDnp7vliqjliLDlrrnlmajlupXpg6hcbiAgICAgIHkgLT0gdG90YWxIZWlnaHQgLSBsaW5lSGVpZ2h0IC8gMjsgLy8g5YeP5Y675paH5pys5oC76auY5bqm77yM5L2G5L+d55WZ5Y2K6KGMXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHRvcCBhbGlnbm1lbnRcbiAgICAgIHkgKz0gbGluZUhlaWdodCAvIDI7IC8vIOWPqumcgOimgeenu+WKqOWNiuS4quihjOmrmO+8jOWboOS4uuS9v+eUqOS6hiBtaWRkbGUg5Z+657q/XG4gICAgfVxuXG4gICAgLy8g5riy5p+T5q+P5LiA6KGM5paH5a2XXG4gICAgbGluZXMuZm9yRWFjaCgobGluZSwgaW5kZXgpID0+IHtcbiAgICAgIGxldCB4ID0gZHJhd1ggLSBvcmlnaW5YO1xuXG4gICAgICAvLyDmsLTlubPlr7npvZDmlrnlvI/lpITnkIZcbiAgICAgIGlmIChzdHlsZS50ZXh0QWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICAgIHggKz0gd2lkdGggLyAyO1xuICAgICAgfSBlbHNlIGlmIChzdHlsZS50ZXh0QWxpZ24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgeCArPSB3aWR0aDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudFkgPSB5ICsgbGluZUhlaWdodCAqIGluZGV4O1xuXG4gICAgICAvLyDmuLLmn5PmloflrZfpmLTlvbFcbiAgICAgIGlmICh0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cykge1xuICAgICAgICB0aGlzLnJlbmRlckZvckxheW91dC50ZXh0U2hhZG93cy5mb3JFYWNoKChzaGFkb3cpID0+IHtcbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5zaGFkb3dPZmZzZXRYID0gc2hhZG93Lm9mZnNldFg7XG4gICAgICAgICAgY3R4LnNoYWRvd09mZnNldFkgPSBzaGFkb3cub2Zmc2V0WTtcbiAgICAgICAgICBjdHguc2hhZG93Qmx1ciA9IHNoYWRvdy5ibHVyUmFkaXVzO1xuICAgICAgICAgIGN0eC5zaGFkb3dDb2xvciA9IHNoYWRvdy5jb2xvcjtcbiAgICAgICAgICBjdHguZmlsbFRleHQobGluZSwgeCwgY3VycmVudFkpO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyDmuLLmn5PmloflrZfmj4/ovrlcbiAgICAgIGlmIChzdHlsZS50ZXh0U3Ryb2tlV2lkdGggJiYgc3R5bGUudGV4dFN0cm9rZUNvbG9yKSB7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0eWxlLnRleHRTdHJva2VDb2xvcjtcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IHN0eWxlLnRleHRTdHJva2VXaWR0aDtcbiAgICAgICAgY3R4LnN0cm9rZVRleHQobGluZSwgeCwgY3VycmVudFkpO1xuICAgICAgfVxuXG4gICAgICAvLyDmuLLmn5PmloflrZdcbiAgICAgIGN0eC5maWxsVGV4dChsaW5lLCB4LCBjdXJyZW50WSk7XG4gICAgfSk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElTdHlsZSB9IGZyb20gJy4vc3R5bGUnO1xuaW1wb3J0IGVudiBmcm9tICcuLi9lbnYnO1xuXG5jb25zdCBERUZBVUxUX0ZPTlRfRkFNSUxZID0gJ3NhbnMtc2VyaWYnO1xubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgaW50ZXJmYWNlIElPcmlnaW5Tb21lU3R5bGVJbmZvIHtcbiAgd2lkdGg6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgaGVpZ2h0OiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGxpbmVIZWlnaHQ6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuY29uc3QgZ2V0Q29udGV4dCA9ICgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPT4ge1xuICBpZiAoY29udGV4dCkge1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY29uc3QgY2FudmFzID0gZW52LmNyZWF0ZUNhbnZhcygpO1xuICBjYW52YXMud2lkdGggPSAxO1xuICBjYW52YXMuaGVpZ2h0ID0gMTtcbiAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcblxuICByZXR1cm4gY29udGV4dDtcbn07XG5cbmZ1bmN0aW9uIGdldFRleHRXaWR0aChzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nKSB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRDb250ZXh0KCk7XG5cbiAgY29udGV4dC5mb250ID0gYCR7c3R5bGUuZm9udFdlaWdodCB8fCAnbm9ybWFsJ30gJHtzdHlsZS5mb250U2l6ZSB8fCAxMn1weCAke3N0eWxlLmZvbnRGYW1pbHkgfHwgREVGQVVMVF9GT05UX0ZBTUlMWX1gO1xuXG4gIHJldHVybiBjb250ZXh0Lm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG4vLyBsZXQgY291bnQgPSAwO1xuZnVuY3Rpb24gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQodmFsdWU6IHN0cmluZykge1xuICAvLyBjb25zb2xlLmxvZyhjb3VudCsrKVxuICByZXR1cm4gZ2V0Q29udGV4dCgpLm1lYXN1cmVUZXh0KHZhbHVlKS53aWR0aCB8fCAwO1xufVxuXG4vKipcbiAqIOS9v+eUqOe6v+aAp+afpeaJvui/m+ihjOaWh+acrOaIquaWrVxuICovXG5mdW5jdGlvbiB0cnVuY2F0ZVRleHRCeUxpbmVhcih2YWx1ZTogc3RyaW5nLCBtYXhXaWR0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgbGV0IGxlbmd0aCA9IHZhbHVlLmxlbmd0aDtcbiAgbGV0IHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuXG4gIHdoaWxlIChnZXRUZXh0V2lkdGhXaXRob3V0U2V0Rm9udChzdHIpID4gbWF4V2lkdGggJiYgbGVuZ3RoID4gMCkge1xuICAgIGxlbmd0aCAtPSAxO1xuICAgIHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBsZW5ndGgpO1xuICB9XG4gIHJldHVybiBzdHI7XG59XG5cbi8qKlxuICog5L2/55So5LqM5YiG5p+l5om+6L+b6KGM5paH5pys5oiq5patXG4gKi9cbmZ1bmN0aW9uIHRydW5jYXRlVGV4dEJ5QmluYXJ5KHZhbHVlOiBzdHJpbmcsIG1heFdpZHRoOiBudW1iZXIpOiBzdHJpbmcge1xuICBsZXQgbGVmdCA9IDA7XG4gIGxldCByaWdodCA9IHZhbHVlLmxlbmd0aDtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuXG4gIHdoaWxlIChsZWZ0IDw9IHJpZ2h0KSB7XG4gICAgY29uc3QgbWlkID0gTWF0aC5mbG9vcigobGVmdCArIHJpZ2h0KSAvIDIpO1xuICAgIGNvbnN0IHN0ciA9IHZhbHVlLnN1YnN0cmluZygwLCBtaWQpO1xuICAgIGNvbnN0IHdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3RyKTtcblxuICAgIGlmICh3aWR0aCA9PT0gbWF4V2lkdGgpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfSBlbHNlIGlmICh3aWR0aCA8IG1heFdpZHRoKSB7XG4gICAgICByZXN1bHQgPSBzdHI7XG4gICAgICBsZWZ0ID0gbWlkICsgMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmlnaHQgPSBtaWQgLSAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICog5paH5a2X5oiq5pat6L6F5Yqp5Ye95pWwXG4gKiDmoLnmja7mlofmnKzplb/luqbpgInmi6nlkIjpgILnmoTmiKrmlq3nrpfms5XvvJpcbiAqIDEuIOW9k+aWh+acrOi+g+efreaXtuS9v+eUqOe6v+aAp+afpeaJvlxuICogMi4g5b2T5paH5pys6L6D6ZW/5pe25L2/55So5LqM5YiG5p+l5om+XG4gKi9cbmZ1bmN0aW9uIHRydW5jYXRlVGV4dFB1cmUodmFsdWU6IHN0cmluZywgbWF4V2lkdGg6IG51bWJlcik6IHN0cmluZyB7XG4gIC8vIOS8sOeul+avj+S4quWtl+espueahOW5s+Wdh+WuveW6pu+8iOWBh+iuvuS9v+eUqOeahOaYr+etieWuveWtl+S9k++8iVxuICBjb25zdCBhdmdDaGFyV2lkdGggPSBtYXhXaWR0aCAvIHZhbHVlLmxlbmd0aDtcbiAgXG4gIC8vIOWmguaenOW5s+Wdh+avj+S4quWtl+espueahOWuveW6puWkp+S6juetieS6jiBtYXhXaWR0aCDnmoQgMS8yMO+8jOivtOaYjuaWh+acrOi+g+efre+8jOS9v+eUqOe6v+aAp+afpeaJvlxuICAvLyDov5nkuKrpmIjlgLzlj6/ku6XmoLnmja7lrp7pmYXmg4XlhrXosIPmlbRcbiAgaWYgKGF2Z0NoYXJXaWR0aCA+PSBtYXhXaWR0aCAvIDIwIHx8IHZhbHVlLmxlbmd0aCA8PSAyMCkge1xuICAgIHJldHVybiB0cnVuY2F0ZVRleHRCeUxpbmVhcih2YWx1ZSwgbWF4V2lkdGgpO1xuICB9XG4gIFxuICAvLyDmlofmnKzovoPplb/vvIzkvb/nlKjkuozliIbmn6Xmib5cbiAgcmV0dXJuIHRydW5jYXRlVGV4dEJ5QmluYXJ5KHZhbHVlLCBtYXhXaWR0aCk7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlVGV4dCh2YWx1ZTogc3RyaW5nLCBtYXhXaWR0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgaXNDSksgPSBpc0NKS1RleHQodmFsdWUpO1xuXG4gIC8vIENKSyDmloflrZflj6/ku6XljZXlrZfliIfliIZcbiAgaWYgKGlzQ0pLKSB7XG4gICAgcmV0dXJuIHRydW5jYXRlVGV4dFB1cmUodmFsdWUsIG1heFdpZHRoKTtcbiAgfVxuXG4gIC8vIOmdniBDSksg5paH5a2X5bC96YeP5Zyo5Y2V6K+N6L6555WM5oiW54m55q6K5a2X56ym5aSE5YiH5YiGXG4gIC8vIDEuIOmmluWFiOWwneivleWcqOepuuagvOWkhOWIh+WIhlxuICBjb25zdCBzcGFjZVdvcmRzID0gdmFsdWUuc3BsaXQoLyhcXHMrKS8pLmZpbHRlcihCb29sZWFuKTtcbiAgbGV0IHJlc3VsdCA9ICcnO1xuICBsZXQgY3VycmVudFdpZHRoID0gMDtcblxuICBjb25zdCBzcGFjZVdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJyAnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGFjZVdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3Qgd29yZCA9IHNwYWNlV29yZHNbaV07XG4gICAgY29uc3Qgd29yZFdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQod29yZCk7XG4gICAgaWYgKGN1cnJlbnRXaWR0aCArIHdvcmRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgICAgcmVzdWx0ICs9IGkgPCBzcGFjZVdvcmRzLmxlbmd0aCAtIDEgPyB3b3JkICsgJyAnIDogd29yZDtcbiAgICAgIGN1cnJlbnRXaWR0aCArPSBpIDwgc3BhY2VXb3Jkcy5sZW5ndGggLSAxID8gd29yZFdpZHRoICsgc3BhY2VXaWR0aCA6IHdvcmRXaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gMi4g5aaC5p6c5LiA5Liq5a6M5pW05Y2V6K+N6YO95pS+5LiN5LiL77yM5bCd6K+V5Zyo54m55q6K5a2X56ym5aSE5YiH5YiGXG4gIGlmICghcmVzdWx0ICYmIHNwYWNlV29yZHNbMF0pIHtcbiAgICBjb25zdCB3b3JkID0gc3BhY2VXb3Jkc1swXTtcbiAgICAvLyDlnKhVUkzluLjop4HnmoTliIbpmpTnrKblpITliIfliIZcbiAgICBjb25zdCBzdWJXb3JkcyA9IHdvcmQuc3BsaXQoLyhbXFwvXFwtXFwuX346PyNcXFtcXF1AISQmJygpKissOz1dKS9nKS5maWx0ZXIoQm9vbGVhbik7XG4gICAgXG4gICAgcmVzdWx0ID0gJyc7XG4gICAgY3VycmVudFdpZHRoID0gMDtcblxuICAgIGZvciAoY29uc3Qgc3ViV29yZCBvZiBzdWJXb3Jkcykge1xuICAgICAgY29uc3Qgc3ViV29yZFdpZHRoID0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoc3ViV29yZCk7XG4gICAgICBpZiAoY3VycmVudFdpZHRoICsgc3ViV29yZFdpZHRoIDw9IG1heFdpZHRoKSB7XG4gICAgICAgIHJlc3VsdCArPSBzdWJXb3JkO1xuICAgICAgICBjdXJyZW50V2lkdGggKz0gc3ViV29yZFdpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gMy4g5aaC5p6c5Zyo54m55q6K5a2X56ym5aSE5YiH5YiG5ZCO6L+Y5piv5pS+5LiN5LiL77yM5YiZ5oyJ5a2X56ym5YiH5YiGXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHJldHVybiB0cnVuY2F0ZVRleHRQdXJlKHdvcmQsIG1heFdpZHRoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiB0cnVuY2F0ZVRleHRXaXRoRG90cyhzdHlsZTogSVN0eWxlLCB2YWx1ZTogc3RyaW5nLCBtYXhXaWR0aDogbnVtYmVyKTogc3RyaW5nIHtcbiAgbWF4V2lkdGggLT0gZ2V0VGV4dFdpZHRoV2l0aG91dFNldEZvbnQoJy4uLicpO1xuICBsZXQgc3RyID0gdHJ1bmNhdGVUZXh0UHVyZSh2YWx1ZSwgbWF4V2lkdGgpO1xuICByZXR1cm4gc3RyID09PSB2YWx1ZSA/IHN0ciA6IGAke3N0cn0uLi5gO1xufVxuXG4vKipcbiAqIOWIpOaWreaWh+acrOaYr+WQpuWMheWQqyBDSkvvvIjkuK3ml6Xpn6nvvInlrZfnrKZcbiAqIEBwYXJhbSB0ZXh0IOimgeajgOafpeeahOaWh+acrFxuICogQHJldHVybnMg5piv5ZCm5YyF5ZCrIENKSyDlrZfnrKZcbiAqL1xuY29uc3QgaXNDSktUZXh0ID0gKHRleHQ6IHN0cmluZyk6IGJvb2xlYW4gPT4ge1xuICAvLyDljLnphY3kuK3mlofjgIHml6XmlofjgIHpn6nmlofnmoQgVW5pY29kZSDojIPlm7RcbiAgcmV0dXJuIC9bXFx1NGUwMC1cXHU5ZmE1XFx1MzA0MC1cXHUzMGZmXFx1MzQwMC1cXHU0ZGJmXS8udGVzdCh0ZXh0KTtcbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3NUZXh0V2hpdGVTcGFjZSh2YWx1ZTogc3RyaW5nLCB3aGl0ZVNwYWNlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyDmoLnmja4gd2hpdGVTcGFjZSDlpITnkIbnqbrnmb3nrKblkozmjaLooYznrKZcbiAgc3dpdGNoICh3aGl0ZVNwYWNlKSB7XG4gICAgY2FzZSAncHJlJzpcbiAgICAgIC8qKlxuICAgICAgICog6L+e57ut55qE56m655m956ym5Lya6KKr5L+d55WZ44CC5LuF5Zyo6YGH5Yiw5o2i6KGM56ym5pe25omN5Lya5o2i6KGM77yM6L+Z6YeM57uf5LiA5o2i6KGM56ym5qC85byPXG4gICAgICAgKiDov5nph4zlr7nlrZfnrKbnmoTliJ3mraXlpITnkIbot58gcHJlLXdhcnAg5piv5LiA5qC355qE77yM5a6e6ZmF55qE5YiG6KGM5aSE55CG5LiK77yMcHJlIOWPquaciemBh+WIsOWIhuihjOespuaJjeS8muWIhuihjFxuICAgICAgICog6ICMIHByZS13cmFwIOmZpOS6huaNouihjOespu+8jOato+W4uOeahOaWh+acrOi/h+mVv+S5n+iDveWkn+iHquWKqOi/m+ihjOaNouihjFxuICAgICAgICovXG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJlLXdyYXAnOlxuICAgICAgLy8g6L+e57ut55qE56m655m956ym5Lya6KKr5L+d55WZ44CC5Zyo6YGH5Yiw5o2i6KGM56ym5pe25qC55o2u5aGr5YWF6KGM5qGG55uS5a2Q55qE6ZyA6KaB5o2i6KGM44CCXG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJlLWxpbmUnOlxuICAgICAgLy8g5ZCI5bm256m655m956ym77yM5L+d55WZ5o2i6KGM56ymXG4gICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1teXFxTXFxuXSsvZywgJyAnKSAgLy8g5ZCI5bm256m655m956ym77yI5LiN5YyF5ous5o2i6KGM56ym77yJXG4gICAgICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKSAgIC8vIOe7n+S4gOaNouihjOesplxuICAgICAgICAucmVwbGFjZSgvIFxcbi9nLCAnXFxuJykgICAgICAgLy8g5Yig6Zmk5o2i6KGM56ym5YmN55qE56m65qC8XG4gICAgICAgIC5yZXBsYWNlKC9cXG4gL2csICdcXG4nKTsgICAgICAvLyDliKDpmaTmjaLooYznrKblkI7nmoTnqbrmoLxcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ25vd3JhcCc6XG4gICAgICAvLyBub3dyYXDnmoTnqbrnmb3nrKblpITnkIbkvJrlnKjlkI7pnaLnu5/kuIDlpITnkIZcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ25vcm1hbCc6XG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIOWQiOW5tuaJgOacieepuueZveesplxuICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICBicmVhaztcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiDmloflrZfop6PmnpDlmahcbiAqIOS4gOS6m+efpeivhueCue+8mlxuICogMS4gXFxzIOWMuemFjeS4gOS4quepuueZveWtl+espu+8jOWMheaLrOepuuagvOOAgeWItuihqOespuOAgeaNoumhteespuWSjOaNouihjOespuOAglxuICogMi4gXFxyIOWMuemFjeS4gOS4quWbnui9puespiAoVSswMDBEKeOAglxuICogMy4gXFxuIOWMuemFjeS4gOS4quaNouihjOespiAoVSswMDBBKeOAglxuICogNC4gXFxTIOWMuemFjeS4gOS4qumdnuepuueZveWtl+espuOAglxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZXh0KHN0eWxlOiBJU3R5bGUsIG9yaWdpblNvbWVTdHlsZUluZm86IElPcmlnaW5Tb21lU3R5bGVJbmZvLCB2YWx1ZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG5cbiAgLy8gMS4g6aaW5YWI5aSE55CG56m655m956ym5ZKM5o2i6KGM56ymXG4gIGNvbnN0IHdoaXRlU3BhY2UgPSBzdHlsZS53aGl0ZVNwYWNlIHx8ICdub3JtYWwnO1xuXG4gIHZhbHVlID0gcHJvY2Vzc1RleHRXaGl0ZVNwYWNlKHZhbHVlLCB3aGl0ZVNwYWNlKTtcblxuICAvLyAyLiDlpoLmnpzmsqHmnInorr7nva7lrr3luqbvvIznm7TmjqXov5Tlm57lpITnkIblkI7nmoTmlofmnKxcbiAgaWYgKG9yaWdpblNvbWVTdHlsZUluZm8ud2lkdGggPT09IHVuZGVmaW5lZCkge1xuICAgIHN0eWxlLndpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSk7XG4gICAgcmV0dXJuIFt2YWx1ZV07XG4gIH1cblxuICBjb25zdCBtYXhXaWR0aCA9IHN0eWxlLndpZHRoIGFzIG51bWJlcjtcblxuICAvLyAzLiDlpoLmnpzorr7nva7kuobkuI3mjaLooYzvvIzlvLrliLblnKjkuIDooYzmmL7npLpcbiAgaWYgKHdoaXRlU3BhY2UgPT09ICdub3dyYXAnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9cXHMrL2csICcgJyk7IC8vIOWQiOW5tuaJgOacieepuueZveesplxuICAgIGlmIChzdHlsZS50ZXh0T3ZlcmZsb3cgPT09ICdlbGxpcHNpcycgJiYgZ2V0VGV4dFdpZHRoKHN0eWxlLCB2YWx1ZSkgPiBtYXhXaWR0aCkge1xuICAgICAgcmV0dXJuIFt0cnVuY2F0ZVRleHRXaXRoRG90cyhzdHlsZSwgdmFsdWUsIG1heFdpZHRoKV07XG4gICAgfVxuICAgIHJldHVybiBbdmFsdWVdO1xuICB9XG5cbiAgLy8gNC4g5aSE55CG6ZyA6KaB5o2i6KGM55qE5oOF5Ya1XG4gIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBjb25zdCB3b3JkQnJlYWsgPSBzdHlsZS53b3JkQnJlYWsgfHwgJ25vcm1hbCc7XG4gIGNvbnN0IG92ZXJmbG93V3JhcCA9IHN0eWxlLm92ZXJmbG93V3JhcCB8fCAnbm9ybWFsJztcblxuICAvLyDpppblhYjmjInnhafoh6rnhLbmlq3ngrnvvIjnqbrmoLzjgIHmjaLooYznrKbnrYnvvInliIblibLmlofmnKxcbiAgY29uc3Qgc2VnbWVudHMgPSB2YWx1ZS5zcGxpdCgnXFxuJykubWFwKGxpbmUgPT4ge1xuICAgIGlmICh3aGl0ZVNwYWNlID09PSAncHJlJykge1xuICAgICAgLy8gcHJlIOaooeW8j+S4i+S/neaMgeaVtOihjOS4jeWIhuWJsu+8jOS/neeVmeaJgOacieepuueZveesplxuICAgICAgcmV0dXJuIFtsaW5lXTtcbiAgICB9IGVsc2UgaWYgKHdoaXRlU3BhY2UgPT09ICdwcmUtd3JhcCcgfHwgd2hpdGVTcGFjZSA9PT0gJ3ByZS1saW5lJykge1xuICAgICAgcmV0dXJuIFtsaW5lXTtcbiAgICB9XG4gICAgcmV0dXJuIGxpbmUuc3BsaXQoJyAnKS5maWx0ZXIoQm9vbGVhbik7XG4gIH0pO1xuXG4gIGZvciAoY29uc3QgbGluZVNlZ21lbnRzIG9mIHNlZ21lbnRzKSB7XG4gICAgbGV0IGN1cnJlbnRMaW5lID0gJyc7XG4gICAgbGV0IGN1cnJlbnRXaWR0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVTZWdtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgc2VnbWVudCA9IGxpbmVTZWdtZW50c1tpXTtcbiAgICAgIC8vIOihjOWGheeahOacgOWQjuS4gOauteS4jeW6lOivpeacieepuuagvFxuICAgICAgY29uc3Qgc2VnbWVudFdpZHRoID0gaSA8IGxpbmVTZWdtZW50cy5sZW5ndGggLSAxID8gZ2V0VGV4dFdpZHRoKHN0eWxlLCBzZWdtZW50ICsgJyAnKSA6IGdldFRleHRXaWR0aChzdHlsZSwgc2VnbWVudCk7XG5cbiAgICAgIC8vIOWkhOeQhuWNleS4queJh+autei2hei/h+acgOWkp+WuveW6pueahOaDheWGtVxuICAgICAgaWYgKHNlZ21lbnRXaWR0aCArIGN1cnJlbnRXaWR0aCA+IG1heFdpZHRoKSB7XG4gICAgICAgIC8vIENKSyDmloflrZfnibnmrorlpITnkIZcbiAgICAgICAgY29uc3QgaXNDSksgPSBpc0NKS1RleHQoc2VnbWVudCk7XG5cbiAgICAgICAgLy8g6ZyA6KaB5by65Yi25pat6KGM55qE5oOF5Ya1XG4gICAgICAgIGlmICh3b3JkQnJlYWsgPT09ICdicmVhay1hbGwnIHx8XG4gICAgICAgICAgKG92ZXJmbG93V3JhcCA9PT0gJ2JyZWFrLXdvcmQnICYmICFpc0NKSykgfHxcbiAgICAgICAgICAod29yZEJyZWFrID09PSAnbm9ybWFsJyAmJiBpc0NKSykpIHtcbiAgICAgICAgICBsZXQgcmVtYWluaW5nVGV4dCA9IHNlZ21lbnQ7XG5cbiAgICAgICAgICB3aGlsZSAocmVtYWluaW5nVGV4dCkge1xuICAgICAgICAgICAgY29uc3QgcmVtYWluaW5nV2lkdGggPSBtYXhXaWR0aCAtIGN1cnJlbnRXaWR0aDtcbiAgICAgICAgICAgIC8vIOi/memHjOimgeiAg+iZkeW9k+WJjeihjOW3sue7j+S4jeaYr+epuueahOWcuuaZr++8jOaJgOS7peWPr+eUqOmVv+W6puimgeaKiuW9k+WJjeeUqOaOieeahOmVv+W6puWHj+aOiVxuICAgICAgICAgICAgY29uc3QgdHJ1bmNhdGVkID0gdHJ1bmNhdGVUZXh0KHJlbWFpbmluZ1RleHQsIHJlbWFpbmluZ1dpZHRoKTtcblxuICAgICAgICAgICAgcmVtYWluaW5nVGV4dCA9IHJlbWFpbmluZ1RleHQuc2xpY2UodHJ1bmNhdGVkLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIC8vIOS7o+ihqOi/mOayoeWIhuWJsuWujO+8jHRydW5jYXRlZCDkvJrlrozmlbTljaDmja7kuIDooYxcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmdUZXh0KSB7XG4gICAgICAgICAgICAgIGlmIChjdXJyZW50TGluZSkge1xuICAgICAgICAgICAgICAgIC8vIOWmguaenOS4jeaYr+ihjOWGheeahOacgOWQjuS4gOaute+8jOaLvOaOpeeahOaXtuWAmeW6lOivpemineWkluWKoOS4gOS4quepuuagvFxuICAgICAgICAgICAgICAgIGxpbmVzLnB1c2goaSA8IGxpbmVTZWdtZW50cy5sZW5ndGggLSAxID8gY3VycmVudExpbmUgKyAnICcgKyB0cnVuY2F0ZWQgOiBjdXJyZW50TGluZSArIHRydW5jYXRlZCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGluZXMucHVzaCh0cnVuY2F0ZWQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgLy8g5b2T5YmN6KGM55So5a6M5LqG77yM6YeN572uXG4gICAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gJyc7XG4gICAgICAgICAgICAgIC8vIOaNouihjOS5i+WQjumHjee9ruW9k+WJjeW3sueUqOmVv+W6plxuICAgICAgICAgICAgICBjdXJyZW50V2lkdGggPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8g5YiG5Ymy5a6M5LqG77yM5L2G5piv5pyq5b+F5Y2g5ruh5LqG5LiA6KGM77yM6ZyA6KaB6K6w5b2V5LiL77yM5Y+v6IO957uZ5ZCO57ut55qEIHNlZ21lbnQg5L2/55SoXG4gICAgICAgICAgICAgIC8vIOS5n+WPr+iDveaYr+WImuWlveWIhuWJsuWujFxuICAgICAgICAgICAgICBjdXJyZW50TGluZSA9IGkgPCBsaW5lU2VnbWVudHMubGVuZ3RoIC0gMSA/IGN1cnJlbnRMaW5lICsgJyAnICsgdHJ1bmNhdGVkIDogY3VycmVudExpbmUgKyB0cnVuY2F0ZWQ7XG4gICAgICAgICAgICAgIGN1cnJlbnRXaWR0aCA9IGdldFRleHRXaWR0aChzdHlsZSwgY3VycmVudExpbmUpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIOi/memHjOacieWHoOenjeaDheWGtVxuICAgICAgICAgICAqIDEuIOW9k+WJjeihjOWGhei/meS4gOauteS8mui2hemVv++8jOS9huaYr+aMieeFp+inhOWImeS4jemcgOimgeW8uuWItuaWreihjO+8jOS9nOS4uuS4gOS4quaVtOS9k1xuICAgICAgICAgICAqIDIuIOS4jeespuWQiDHnmoTmg4XlhrXvvIzogIzmmK/kvJrmioogY3VycmVudExpbmUg5raI6LS55a6M77yM5Zug5q2k6ZyA6KaB5oqKIGN1cnJlbnRMaW5lIHB1c2jkuYvlkI7lpITnkIZcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoY3VycmVudExpbmUpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xuICAgICAgICAgICAgY3VycmVudExpbmUgPSBzZWdtZW50O1xuICAgICAgICAgICAgY3VycmVudFdpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCBjdXJyZW50TGluZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goc2VnbWVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyDmraPluLjnmoTooYzlpITnkIZcbiAgICAgICAgaWYgKGN1cnJlbnRXaWR0aCArIHNlZ21lbnRXaWR0aCA8PSBtYXhXaWR0aCkge1xuICAgICAgICAgIGN1cnJlbnRMaW5lICs9IChjdXJyZW50TGluZSA/ICcgJyA6ICcnKSArIHNlZ21lbnQ7XG4gICAgICAgICAgY3VycmVudFdpZHRoICs9IHNlZ21lbnRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoY3VycmVudExpbmUpIHtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goY3VycmVudExpbmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJyZW50TGluZSA9IHNlZ21lbnQ7XG4gICAgICAgICAgY3VycmVudFdpZHRoID0gZ2V0VGV4dFdpZHRoKHN0eWxlLCBzZWdtZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjdXJyZW50TGluZSkge1xuICAgICAgbGluZXMucHVzaChjdXJyZW50TGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUZXh0SGVpZ2h0KHN0eWxlOiBJU3R5bGUsIG9yaWdpblNvbWVTdHlsZUluZm86IElPcmlnaW5Tb21lU3R5bGVJbmZvLCBwYXJzZWRWYWx1ZTogc3RyaW5nW10pIHtcbiAgY29uc3QgZm9udFNpemUgPSBzdHlsZS5mb250U2l6ZSB8fCAxMjtcbiAgaWYgKG9yaWdpblNvbWVTdHlsZUluZm8ubGluZUhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUubGluZUhlaWdodCA9IGZvbnRTaXplICogMS4yO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBzdHlsZS5saW5lSGVpZ2h0ID09PSAnc3RyaW5nJyAmJiBzdHlsZS5saW5lSGVpZ2h0LmVuZHNXaXRoKCclJykpIHtcbiAgICBzdHlsZS5saW5lSGVpZ2h0ID0gZm9udFNpemUgKiBwYXJzZUZsb2F0KHN0eWxlLmxpbmVIZWlnaHQpOyBcbiAgfVxuXG4gIC8vIOWmguaenOayoeacieW8uuihjOaMh+WumumrmOW6pu+8jOmAmui/hyBsaW5lSGVpZ2h0ICog6KGM6auYXG4gIGlmIChvcmlnaW5Tb21lU3R5bGVJbmZvLmhlaWdodCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3R5bGUuaGVpZ2h0ID0gc3R5bGUubGluZUhlaWdodCBhcyBudW1iZXIgKiBwYXJzZWRWYWx1ZS5sZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCBFbGVtZW50IGZyb20gJy4vZWxlbWVudHMnO1xuaW1wb3J0IHsgSUVsZW1lbnRPcHRpb25zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcgZXh0ZW5kcyBFbGVtZW50IHtcbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlID0ge30sXG4gICAgaWROYW1lID0gJycsXG4gICAgY2xhc3NOYW1lID0gJycsXG4gICAgZGF0YXNldCxcbiAgfTogSUVsZW1lbnRPcHRpb25zKSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWROYW1lLFxuICAgICAgY2xhc3NOYW1lLFxuICAgICAgc3R5bGUsXG4gICAgICBkYXRhc2V0LFxuICAgIH0pO1xuXG4gICAgdGhpcy50eXBlID0gJ1ZpZXcnO1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGRlc3Ryb3lTZWxmKCkge1xuICAgIHRoaXMuaXNEZXN0cm95ZWQgPSB0cnVlO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBbXTtcbiAgICB0aGlzLnJvb3QgPSBudWxsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBjdHguc2F2ZSgpO1xuXG4gICAgY29uc3QgeyBuZWVkU3Ryb2tlLCBuZWVkQ2xpcCwgb3JpZ2luWCwgb3JpZ2luWSB9ID0gdGhpcy5iYXNlUmVuZGVyKCk7XG5cbiAgICBpZiAobmVlZFN0cm9rZSkge1xuICAgICAgY3R4LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIGN0eC50cmFuc2xhdGUoLW9yaWdpblgsIC1vcmlnaW5ZKTtcblxuICAgIGN0eC5yZXN0b3JlKCk7XG4gIH1cblxuICByZXBhaW50KCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENhbGxiYWNrIH0gZnJvbSBcIi4vdHlwZXNcIjtcblxuaWYgKHR5cGVvZiBHYW1lR2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xuICBHYW1lR2xvYmFsLl9fZW52ID0gR2FtZUdsb2JhbC53eCB8fCBHYW1lR2xvYmFsLnR0IHx8IEdhbWVHbG9iYWwuc3dhbjtcbn1cblxuY29uc3QgZG9tRXZlbnRNYXA6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIHRvdWNoc3RhcnQ6ICdtb3VzZWRvd24nLFxuICB0b3VjaG1vdmU6ICdtb3VzZW1vdmUnLFxuICB0b3VjaGVuZDogJ21vdXNldXAnLFxuICB0b3VjaGNhbmNlbDogJ21vdXNlbGVhdmUnLFxufVxuXG5lbnVtIGV2ZW50VHlwZSB7XG4gIG9uID0gJ29uJyxcbiAgb2ZmID0gJ29mZicsXG59XG5cbmZ1bmN0aW9uIGdlbkRvbVRvdWNoRXZlbnQoZXZlbnQ6IHN0cmluZywgdHlwZTogZXZlbnRUeXBlKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsaXN0ZW5lcjogQ2FsbGJhY2spIHtcbiAgICAgIHR5cGUgPT09IGV2ZW50VHlwZS5vbiA/XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyLCBmYWxzZSlcbiAgICAgICAgOiBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lciwgZmFsc2UpXG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldE9uVG91Y2hIYW5kbGVyKGV2ZW50OiBzdHJpbmcsIHR5cGU6IGV2ZW50VHlwZSkge1xuICBpZiAodHlwZW9mIEdhbWVHbG9iYWwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIEdhbWVHbG9iYWwuX19lbnZbYCR7dHlwZX0ke2V2ZW50fWBdXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGdlbkRvbVRvdWNoRXZlbnQoZG9tRXZlbnRNYXBbZXZlbnQudG9Mb3dlckNhc2UoKV0sIHR5cGUpO1xuICB9XG59XG5cbi8qKlxuICogTGF5b3V0IOWPr+iDveeUqOWcqOS4jeeUqOeahOW5s+WPsO+8jOiAjExheW91dOS8muS+nei1luW5s+WPsOS4i+mdoueahOS4gOS6m+aWueazleadpeWunueOsOWFt+S9k+eahOWKn+iDve+8jOavlOWmguWIm+W7uuWbvueJh1xuICog5Li65LqG5pu05aW95YGa5bmz5Y+w6YCC6YWN77yM57uf5LiA5bCB6KOFIGVudiDmqKHlnZfvvIzkuI3lkIzlubPlj7DopoHlgZrpgILphY3vvIzmm7/mjaIgZW52IOeahOWFt+S9k+aWueazleWNs+WPr1xuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8vIOebkeWQrOinpuaRuOebuOWFs+S6i+S7tlxuICBvblRvdWNoU3RhcnQ6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaFN0YXJ0JywgZXZlbnRUeXBlLm9uKSxcbiAgb25Ub3VjaE1vdmU6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaE1vdmUnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoRW5kOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hFbmQnLCBldmVudFR5cGUub24pLFxuICBvblRvdWNoQ2FuY2VsOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hDYW5jZWwnLCBldmVudFR5cGUub24pLFxuICAvLyDlj5bmtojnm5HlkKzop6bmkbjnm7jlhbPkuovku7ZcbiAgb2ZmVG91Y2hTdGFydDogZ2V0T25Ub3VjaEhhbmRsZXIoJ1RvdWNoU3RhcnQnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hNb3ZlOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hNb3ZlJywgZXZlbnRUeXBlLm9mZiksXG4gIG9mZlRvdWNoRW5kOiBnZXRPblRvdWNoSGFuZGxlcignVG91Y2hFbmQnLCBldmVudFR5cGUub2ZmKSxcbiAgb2ZmVG91Y2hDYW5jZWw6IGdldE9uVG91Y2hIYW5kbGVyKCdUb3VjaENhbmNlbCcsIGV2ZW50VHlwZS5vZmYpLFxuXG4gIC8vIExheW91dCDmlK/mjIHnmb7liIbmr5TmoLflvI/vvIzlpoLmnpzmoLnoioLngrnmoLflvI/orr7nva7kuLogMTAwJe+8jOebtOaOpeWPliBDYW52YXMg55qE5bC65a+477yM5LiN5ZCM5bmz5Y+w55qE5Y+W5rOV5LiN5LiA5qC377yM5Zug5q2k5Y2V54us5o+Q5L6b5Ye95pWwXG4gIGdldFJvb3RDYW52YXNTaXplKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnICYmIF9fZW52LmdldFNoYXJlZENhbnZhcykge1xuICAgICAgY29uc3QgY3ZzID0gX19lbnYuZ2V0U2hhcmVkQ2FudmFzKCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3aWR0aDogY3ZzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGN2cy5oZWlnaHQsXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiAzMDAsXG4gICAgICAgIGhlaWdodDogMTUwLFxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICAvLyDlj5blvZPliY3orr7lpIfnmoQgZGV2aWNlUGl4ZWxSYXRpb++8jOS4jeWQjOW5s+WPsOeahOWPluazleS4jeS4gOagt1xuICBnZXREZXZpY2VQaXhlbFJhdGlvKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnICYmIF9fZW52LmdldFN5c3RlbUluZm9TeW5jKSB7XG4gICAgICByZXR1cm4gX19lbnYuZ2V0U3lzdGVtSW5mb1N5bmMoKS5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIH0gZWxzZSBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8pIHtcbiAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfVxuICB9LFxuXG4gIC8vIOWIm+W7ukNhbnZhc1xuICBjcmVhdGVDYW52YXMoKSB7XG4gICAgaWYgKHR5cGVvZiBfX2VudiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiBfX2Vudi5jcmVhdGVDYW52YXMoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gIH0sXG5cbiAgLy8g5Yib5bu65Zu+54mHXG4gIGNyZWF0ZUltYWdlKCkge1xuICAgIGlmICh0eXBlb2YgX19lbnYgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gX19lbnYuY3JlYXRlSW1hZ2UoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV0aWwgPSByZXF1aXJlKCcuL3V0aWwnKTtcblxuY29uc3QgY29udmVydFRvSnNvbiA9IGZ1bmN0aW9uKG5vZGUsIG9wdGlvbnMpIHtcbiAgY29uc3Qgak9iaiA9IHtcbiAgICBuYW1lOiBub2RlLnRhZ25hbWVcbiAgfTtcblxuICAvL3doZW4gbm8gY2hpbGQgbm9kZSBvciBhdHRyIGlzIHByZXNlbnRcbiAgaWYgKCghbm9kZS5jaGlsZCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5jaGlsZCkpICYmICghbm9kZS5hdHRyc01hcCB8fCB1dGlsLmlzRW1wdHlPYmplY3Qobm9kZS5hdHRyc01hcCkpKSB7XG4gICAgcmV0dXJuIHV0aWwuaXNFeGlzdChub2RlLnZhbCkgJiYgISFub2RlLnZhbCA/IG5vZGUudmFsIDogak9iajtcbiAgfSBlbHNlIHtcbiAgICAvL290aGVyd2lzZSBjcmVhdGUgYSB0ZXh0bm9kZSBpZiBub2RlIGhhcyBzb21lIHRleHRcbiAgICBpZiAodXRpbC5pc0V4aXN0KG5vZGUudmFsKSkge1xuICAgICAgaWYgKCEodHlwZW9mIG5vZGUudmFsID09PSAnc3RyaW5nJyAmJiAobm9kZS52YWwgPT09ICcnIHx8IG5vZGUudmFsID09PSBvcHRpb25zLmNkYXRhUG9zaXRpb25DaGFyKSkpIHtcbiAgICAgICAgaWYob3B0aW9ucy5hcnJheU1vZGUgPT09IFwic3RyaWN0XCIpe1xuICAgICAgICAgIGpPYmpbb3B0aW9ucy50ZXh0Tm9kZU5hbWVdID0gWyBub2RlLnZhbCBdO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICBqT2JqW29wdGlvbnMudGV4dE5vZGVOYW1lXSA9IG5vZGUudmFsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICB1dGlsLm1lcmdlKGpPYmosIG5vZGUuYXR0cnNNYXAsIG9wdGlvbnMuYXJyYXlNb2RlKTtcblxuICBqT2JqLmNoaWxkcmVuID0gW107XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaCggY2hpbGQgPT4ge1xuICAgIGpPYmouY2hpbGRyZW4ucHVzaChjb252ZXJ0VG9Kc29uKGNoaWxkLCBvcHRpb25zKSlcbiAgfSk7XG5cbiAgLy9hZGQgdmFsdWVcbiAgcmV0dXJuIGpPYmo7XG59O1xuXG5leHBvcnRzLmNvbnZlcnRUb0pzb24gPSBjb252ZXJ0VG9Kc29uO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBub2RlVG9Kc29uID0gcmVxdWlyZSgnLi9ub2RlMmpzb24nKTtcbmNvbnN0IHhtbFRvTm9kZW9iaiA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IHgyeG1sbm9kZSA9IHJlcXVpcmUoJy4veG1sc3RyMnhtbG5vZGUnKTtcbmNvbnN0IGJ1aWxkT3B0aW9ucyA9IHJlcXVpcmUoJy4vdXRpbCcpLmJ1aWxkT3B0aW9ucztcbmNvbnN0IHZhbGlkYXRvciA9IHJlcXVpcmUoJy4vdmFsaWRhdG9yJyk7XG5cbmV4cG9ydHMucGFyc2UgPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zLCB2YWxpZGF0aW9uT3B0aW9uKSB7XG4gICBpZiggdmFsaWRhdGlvbk9wdGlvbil7XG4gICAgIGlmKHZhbGlkYXRpb25PcHRpb24gPT09IHRydWUpIHZhbGlkYXRpb25PcHRpb24gPSB7fVxuXG4gICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRvci52YWxpZGF0ZSh4bWxEYXRhLCB2YWxpZGF0aW9uT3B0aW9uKTtcbiAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgIHRocm93IEVycm9yKCByZXN1bHQuZXJyLm1zZylcbiAgICAgfVxuICAgfVxuICBvcHRpb25zID0gYnVpbGRPcHRpb25zKG9wdGlvbnMsIHgyeG1sbm9kZS5kZWZhdWx0T3B0aW9ucywgeDJ4bWxub2RlLnByb3BzKTtcbiAgcmV0dXJuIG5vZGVUb0pzb24uY29udmVydFRvSnNvbih4bWxUb05vZGVvYmouZ2V0VHJhdmVyc2FsT2JqKHhtbERhdGEsIG9wdGlvbnMpLCBvcHRpb25zKTtcbn07XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgZ2V0QWxsTWF0Y2hlcyA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IFtdO1xuICBsZXQgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHdoaWxlIChtYXRjaCkge1xuICAgIGNvbnN0IGFsbG1hdGNoZXMgPSBbXTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaC5sZW5ndGg7XG4gICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IGxlbjsgaW5kZXgrKykge1xuICAgICAgYWxsbWF0Y2hlcy5wdXNoKG1hdGNoW2luZGV4XSk7XG4gICAgfVxuICAgIG1hdGNoZXMucHVzaChhbGxtYXRjaGVzKTtcbiAgICBtYXRjaCA9IHJlZ2V4LmV4ZWMoc3RyaW5nKTtcbiAgfVxuICByZXR1cm4gbWF0Y2hlcztcbn07XG5cbmNvbnN0IGRvZXNNYXRjaCA9IGZ1bmN0aW9uKHN0cmluZywgcmVnZXgpIHtcbiAgY29uc3QgbWF0Y2ggPSByZWdleC5leGVjKHN0cmluZyk7XG4gIHJldHVybiAhKG1hdGNoID09PSBudWxsIHx8IHR5cGVvZiBtYXRjaCA9PT0gJ3VuZGVmaW5lZCcpO1xufTtcblxuY29uc3QgZG9lc05vdE1hdGNoID0gZnVuY3Rpb24oc3RyaW5nLCByZWdleCkge1xuICByZXR1cm4gIWRvZXNNYXRjaChzdHJpbmcsIHJlZ2V4KTtcbn07XG5cbmV4cG9ydHMuaXNFeGlzdCA9IGZ1bmN0aW9uKHYpIHtcbiAgcmV0dXJuIHR5cGVvZiB2ICE9PSAndW5kZWZpbmVkJztcbn07XG5cbmV4cG9ydHMuaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uKG9iaikge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5sZW5ndGggPT09IDA7XG59O1xuXG4vKipcbiAqIENvcHkgYWxsIHRoZSBwcm9wZXJ0aWVzIG9mIGEgaW50byBiLlxuICogQHBhcmFtIHsqfSB0YXJnZXRcbiAqIEBwYXJhbSB7Kn0gYVxuICovXG5leHBvcnRzLm1lcmdlID0gZnVuY3Rpb24odGFyZ2V0LCBhLCBhcnJheU1vZGUpIHtcbiAgaWYgKGEpIHtcbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoYSk7IC8vIHdpbGwgcmV0dXJuIGFuIGFycmF5IG9mIG93biBwcm9wZXJ0aWVzXG4gICAgY29uc3QgbGVuID0ga2V5cy5sZW5ndGg7IC8vZG9uJ3QgbWFrZSBpdCBpbmxpbmVcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZihhcnJheU1vZGUgPT09ICdzdHJpY3QnKXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gWyBhW2tleXNbaV1dIF07XG4gICAgICB9ZWxzZXtcbiAgICAgICAgdGFyZ2V0W2tleXNbaV1dID0gYVtrZXlzW2ldXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG4vKiBleHBvcnRzLm1lcmdlID1mdW5jdGlvbiAoYixhKXtcbiAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYixhKTtcbn0gKi9cblxuZXhwb3J0cy5nZXRWYWx1ZSA9IGZ1bmN0aW9uKHYpIHtcbiAgaWYgKGV4cG9ydHMuaXNFeGlzdCh2KSkge1xuICAgIHJldHVybiB2O1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAnJztcbiAgfVxufTtcblxuLy8gY29uc3QgZmFrZUNhbGwgPSBmdW5jdGlvbihhKSB7cmV0dXJuIGE7fTtcbi8vIGNvbnN0IGZha2VDYWxsTm9SZXR1cm4gPSBmdW5jdGlvbigpIHt9O1xuXG5leHBvcnRzLmJ1aWxkT3B0aW9ucyA9IGZ1bmN0aW9uKG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zLCBwcm9wcykge1xuICB2YXIgbmV3T3B0aW9ucyA9IHt9O1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICByZXR1cm4gZGVmYXVsdE9wdGlvbnM7IC8vaWYgdGhlcmUgYXJlIG5vdCBvcHRpb25zXG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG9wdGlvbnNbcHJvcHNbaV1dICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gb3B0aW9uc1twcm9wc1tpXV07XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld09wdGlvbnNbcHJvcHNbaV1dID0gZGVmYXVsdE9wdGlvbnNbcHJvcHNbaV1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3T3B0aW9ucztcbn07XG5cbmV4cG9ydHMuZG9lc01hdGNoID0gZG9lc01hdGNoO1xuZXhwb3J0cy5kb2VzTm90TWF0Y2ggPSBkb2VzTm90TWF0Y2g7XG5leHBvcnRzLmdldEFsbE1hdGNoZXMgPSBnZXRBbGxNYXRjaGVzO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5cbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICBhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzOiBmYWxzZSwgLy9BIHRhZyBjYW4gaGF2ZSBhdHRyaWJ1dGVzIHdpdGhvdXQgYW55IHZhbHVlXG4gIGxvY2FsZVJhbmdlOiAnYS16QS1aJyxcbn07XG5cbmNvbnN0IHByb3BzID0gWydhbGxvd0Jvb2xlYW5BdHRyaWJ1dGVzJywgJ2xvY2FsZVJhbmdlJ107XG5cbi8vY29uc3QgdGFnc1BhdHRlcm4gPSBuZXcgUmVnRXhwKFwiPFxcXFwvPyhbXFxcXHc6XFxcXC1fXFwuXSspXFxcXHMqXFwvPz5cIixcImdcIik7XG5leHBvcnRzLnZhbGlkYXRlID0gZnVuY3Rpb24oeG1sRGF0YSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gdXRpbC5idWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcblxuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sXCJcIik7Ly9tYWtlIGl0IHNpbmdsZSBsaW5lXG4gIC8veG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvKF5cXHMqPFxcP3htbC4qP1xcPz4pL2csXCJcIik7Ly9SZW1vdmUgWE1MIHN0YXJ0aW5nIHRhZ1xuICAvL3htbERhdGEgPSB4bWxEYXRhLnJlcGxhY2UoLyg8IURPQ1RZUEVbXFxzXFx3XFxcIlxcLlxcL1xcLVxcOl0rKFxcWy4qXFxdKSpcXHMqPikvZyxcIlwiKTsvL1JlbW92ZSBET0NUWVBFXG5cbiAgY29uc3QgdGFncyA9IFtdO1xuICBsZXQgdGFnRm91bmQgPSBmYWxzZTtcbiAgaWYgKHhtbERhdGFbMF0gPT09ICdcXHVmZWZmJykge1xuICAgIC8vIGNoZWNrIGZvciBieXRlIG9yZGVyIG1hcmsgKEJPTSlcbiAgICB4bWxEYXRhID0geG1sRGF0YS5zdWJzdHIoMSk7XG4gIH1cbiAgY29uc3QgcmVneEF0dHJOYW1lID0gbmV3IFJlZ0V4cCgnXltfd11bXFxcXHdcXFxcLS46XSokJy5yZXBsYWNlKCdfdycsICdfJyArIG9wdGlvbnMubG9jYWxlUmFuZ2UpKTtcbiAgY29uc3QgcmVneFRhZ05hbWUgPSBuZXcgUmVnRXhwKCdeKFt3XXxfKVtcXFxcdy5cXFxcLV86XSonLnJlcGxhY2UoJyhbdycsICcoWycgKyBvcHRpb25zLmxvY2FsZVJhbmdlKSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09PSAnPCcpIHtcbiAgICAgIC8vc3RhcnRpbmcgb2YgdGFnXG4gICAgICAvL3JlYWQgdW50aWwgeW91IHJlYWNoIHRvICc+JyBhdm9pZGluZyBhbnkgJz4nIGluIGF0dHJpYnV0ZSB2YWx1ZVxuXG4gICAgICBpKys7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJz8nKSB7XG4gICAgICAgIGkgPSByZWFkUEkoeG1sRGF0YSwgKytpKTtcbiAgICAgICAgaWYgKGkuZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoeG1sRGF0YVtpXSA9PT0gJyEnKSB7XG4gICAgICAgIGkgPSByZWFkQ29tbWVudEFuZENEQVRBKHhtbERhdGEsIGkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBjbG9zaW5nVGFnID0gZmFsc2U7XG4gICAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnLycpIHtcbiAgICAgICAgICAvL2Nsb3NpbmcgdGFnXG4gICAgICAgICAgY2xvc2luZ1RhZyA9IHRydWU7XG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIC8vcmVhZCB0YWduYW1lXG4gICAgICAgIGxldCB0YWdOYW1lID0gJyc7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgO1xuICAgICAgICAgIGkgPCB4bWxEYXRhLmxlbmd0aCAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICc+JyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICcgJyAmJlxuICAgICAgICAgIHhtbERhdGFbaV0gIT09ICdcXHQnICYmXG4gICAgICAgICAgeG1sRGF0YVtpXSAhPT0gJ1xcbicgJiZcbiAgICAgICAgICB4bWxEYXRhW2ldICE9PSAnXFxyJztcbiAgICAgICAgICBpKytcbiAgICAgICAgKSB7XG4gICAgICAgICAgdGFnTmFtZSArPSB4bWxEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRyaW0oKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0YWdOYW1lKTtcblxuICAgICAgICBpZiAodGFnTmFtZVt0YWdOYW1lLmxlbmd0aCAtIDFdID09PSAnLycpIHtcbiAgICAgICAgICAvL3NlbGYgY2xvc2luZyB0YWcgd2l0aG91dCBhdHRyaWJ1dGVzXG4gICAgICAgICAgdGFnTmFtZSA9IHRhZ05hbWUuc3Vic3RyaW5nKDAsIHRhZ05hbWUubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2YWxpZGF0ZVRhZ05hbWUodGFnTmFtZSwgcmVneFRhZ05hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFRhZycsIG1zZzogJ1RhZyAnICsgdGFnTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdBdHRyaWJ1dGVzIGZvciBcIicgKyB0YWdOYW1lICsgJ1wiIGhhdmUgb3BlbiBxdW90ZS4nfX07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGF0dHJTdHIgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGkgPSByZXN1bHQuaW5kZXg7XG5cbiAgICAgICAgaWYgKGF0dHJTdHJbYXR0clN0ci5sZW5ndGggLSAxXSA9PT0gJy8nKSB7XG4gICAgICAgICAgLy9zZWxmIGNsb3NpbmcgdGFnXG4gICAgICAgICAgYXR0clN0ciA9IGF0dHJTdHIuc3Vic3RyaW5nKDAsIGF0dHJTdHIubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgY29uc3QgaXNWYWxpZCA9IHZhbGlkYXRlQXR0cmlidXRlU3RyaW5nKGF0dHJTdHIsIG9wdGlvbnMsIHJlZ3hBdHRyTmFtZSk7XG4gICAgICAgICAgaWYgKGlzVmFsaWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vY29udGludWU7IC8vdGV4dCBtYXkgcHJlc2VudHMgYWZ0ZXIgc2VsZiBjbG9zaW5nIHRhZ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoY2xvc2luZ1RhZykge1xuICAgICAgICAgIGlmKCFyZXN1bHQudGFnQ2xvc2VkKXtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBkb24ndCBoYXZlIHByb3BlciBjbG9zaW5nLlwifSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfWVsc2UgaWYgKGF0dHJTdHIudHJpbSgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgXCInICsgdGFnTmFtZSArIFwiXFxcIiBjYW4ndCBoYXZlIGF0dHJpYnV0ZXMgb3IgaW52YWxpZCBzdGFydGluZy5cIn0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBvdGcgPSB0YWdzLnBvcCgpO1xuICAgICAgICAgICAgaWYgKHRhZ05hbWUgIT09IG90Zykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkVGFnJywgbXNnOiAnY2xvc2luZyB0YWcgJyArIG90ZyArICcgaXMgZXhwZWN0ZWQgaW5wbGFjZSBvZiAnICsgdGFnTmFtZSArICcuJ30sXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IGlzVmFsaWQgPSB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpO1xuICAgICAgICAgIGlmIChpc1ZhbGlkICE9PSB0cnVlKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNWYWxpZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGFncy5wdXNoKHRhZ05hbWUpO1xuICAgICAgICAgIHRhZ0ZvdW5kID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vc2tpcCB0YWcgdGV4dCB2YWx1ZVxuICAgICAgICAvL0l0IG1heSBpbmNsdWRlIGNvbW1lbnRzIGFuZCBDREFUQSB2YWx1ZVxuICAgICAgICBmb3IgKGkrKzsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgICAgICBpZiAoeG1sRGF0YVtpICsgMV0gPT09ICchJykge1xuICAgICAgICAgICAgICAvL2NvbW1lbnQgb3IgQ0FEQVRBXG4gICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgaSA9IHJlYWRDb21tZW50QW5kQ0RBVEEoeG1sRGF0YSwgaSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IC8vZW5kIG9mIHJlYWRpbmcgdGFnIHRleHQgdmFsdWVcbiAgICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICc8Jykge1xuICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJyAnIHx8IHhtbERhdGFbaV0gPT09ICdcXHQnIHx8IHhtbERhdGFbaV0gPT09ICdcXG4nIHx8IHhtbERhdGFbaV0gPT09ICdcXHInKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZENoYXInLCBtc2c6ICdjaGFyICcgKyB4bWxEYXRhW2ldICsgJyBpcyBub3QgZXhwZWN0ZWQgLid9fTtcbiAgICB9XG4gIH1cblxuICBpZiAoIXRhZ0ZvdW5kKSB7XG4gICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZFhtbCcsIG1zZzogJ1N0YXJ0IHRhZyBleHBlY3RlZC4nfX07XG4gIH0gZWxzZSBpZiAodGFncy5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVycjoge2NvZGU6ICdJbnZhbGlkWG1sJywgbXNnOiAnSW52YWxpZCAnICsgSlNPTi5zdHJpbmdpZnkodGFncywgbnVsbCwgNCkucmVwbGFjZSgvXFxyP1xcbi9nLCAnJykgKyAnIGZvdW5kLid9LFxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbi8qKlxuICogUmVhZCBQcm9jZXNzaW5nIGluc3N0cnVjdGlvbnMgYW5kIHNraXBcbiAqIEBwYXJhbSB7Kn0geG1sRGF0YVxuICogQHBhcmFtIHsqfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRQSSh4bWxEYXRhLCBpKSB7XG4gIHZhciBzdGFydCA9IGk7XG4gIGZvciAoOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgIGlmICh4bWxEYXRhW2ldID09ICc/JyB8fCB4bWxEYXRhW2ldID09ICcgJykge1xuICAgICAgLy90YWduYW1lXG4gICAgICB2YXIgdGFnbmFtZSA9IHhtbERhdGEuc3Vic3RyKHN0YXJ0LCBpIC0gc3RhcnQpO1xuICAgICAgaWYgKGkgPiA1ICYmIHRhZ25hbWUgPT09ICd4bWwnKSB7XG4gICAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRYbWwnLCBtc2c6ICdYTUwgZGVjbGFyYXRpb24gYWxsb3dlZCBvbmx5IGF0IHRoZSBzdGFydCBvZiB0aGUgZG9jdW1lbnQuJ319O1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09ICc/JyAmJiB4bWxEYXRhW2kgKyAxXSA9PSAnPicpIHtcbiAgICAgICAgLy9jaGVjayBpZiB2YWxpZCBhdHRyaWJ1dCBzdHJpbmdcbiAgICAgICAgaSsrO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gaTtcbn1cblxuZnVuY3Rpb24gcmVhZENvbW1lbnRBbmRDREFUQSh4bWxEYXRhLCBpKSB7XG4gIGlmICh4bWxEYXRhLmxlbmd0aCA+IGkgKyA1ICYmIHhtbERhdGFbaSArIDFdID09PSAnLScgJiYgeG1sRGF0YVtpICsgMl0gPT09ICctJykge1xuICAgIC8vY29tbWVudFxuICAgIGZvciAoaSArPSAzOyBpIDwgeG1sRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHhtbERhdGFbaV0gPT09ICctJyAmJiB4bWxEYXRhW2kgKyAxXSA9PT0gJy0nICYmIHhtbERhdGFbaSArIDJdID09PSAnPicpIHtcbiAgICAgICAgaSArPSAyO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoXG4gICAgeG1sRGF0YS5sZW5ndGggPiBpICsgOCAmJlxuICAgIHhtbERhdGFbaSArIDFdID09PSAnRCcgJiZcbiAgICB4bWxEYXRhW2kgKyAyXSA9PT0gJ08nICYmXG4gICAgeG1sRGF0YVtpICsgM10gPT09ICdDJyAmJlxuICAgIHhtbERhdGFbaSArIDRdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA1XSA9PT0gJ1knICYmXG4gICAgeG1sRGF0YVtpICsgNl0gPT09ICdQJyAmJlxuICAgIHhtbERhdGFbaSArIDddID09PSAnRSdcbiAgKSB7XG4gICAgbGV0IGFuZ2xlQnJhY2tldHNDb3VudCA9IDE7XG4gICAgZm9yIChpICs9IDg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoeG1sRGF0YVtpXSA9PT0gJzwnKSB7XG4gICAgICAgIGFuZ2xlQnJhY2tldHNDb3VudCsrO1xuICAgICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgICAgYW5nbGVCcmFja2V0c0NvdW50LS07XG4gICAgICAgIGlmIChhbmdsZUJyYWNrZXRzQ291bnQgPT09IDApIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChcbiAgICB4bWxEYXRhLmxlbmd0aCA+IGkgKyA5ICYmXG4gICAgeG1sRGF0YVtpICsgMV0gPT09ICdbJyAmJlxuICAgIHhtbERhdGFbaSArIDJdID09PSAnQycgJiZcbiAgICB4bWxEYXRhW2kgKyAzXSA9PT0gJ0QnICYmXG4gICAgeG1sRGF0YVtpICsgNF0gPT09ICdBJyAmJlxuICAgIHhtbERhdGFbaSArIDVdID09PSAnVCcgJiZcbiAgICB4bWxEYXRhW2kgKyA2XSA9PT0gJ0EnICYmXG4gICAgeG1sRGF0YVtpICsgN10gPT09ICdbJ1xuICApIHtcbiAgICBmb3IgKGkgKz0gODsgaSA8IHhtbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh4bWxEYXRhW2ldID09PSAnXScgJiYgeG1sRGF0YVtpICsgMV0gPT09ICddJyAmJiB4bWxEYXRhW2kgKyAyXSA9PT0gJz4nKSB7XG4gICAgICAgIGkgKz0gMjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGk7XG59XG5cbnZhciBkb3VibGVRdW90ZSA9ICdcIic7XG52YXIgc2luZ2xlUXVvdGUgPSBcIidcIjtcblxuLyoqXG4gKiBLZWVwIHJlYWRpbmcgeG1sRGF0YSB1bnRpbCAnPCcgaXMgZm91bmQgb3V0c2lkZSB0aGUgYXR0cmlidXRlIHZhbHVlLlxuICogQHBhcmFtIHtzdHJpbmd9IHhtbERhdGFcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKi9cbmZ1bmN0aW9uIHJlYWRBdHRyaWJ1dGVTdHIoeG1sRGF0YSwgaSkge1xuICBsZXQgYXR0clN0ciA9ICcnO1xuICBsZXQgc3RhcnRDaGFyID0gJyc7XG4gIGxldCB0YWdDbG9zZWQgPSBmYWxzZTtcbiAgZm9yICg7IGkgPCB4bWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHhtbERhdGFbaV0gPT09IGRvdWJsZVF1b3RlIHx8IHhtbERhdGFbaV0gPT09IHNpbmdsZVF1b3RlKSB7XG4gICAgICBpZiAoc3RhcnRDaGFyID09PSAnJykge1xuICAgICAgICBzdGFydENoYXIgPSB4bWxEYXRhW2ldO1xuICAgICAgfSBlbHNlIGlmIChzdGFydENoYXIgIT09IHhtbERhdGFbaV0pIHtcbiAgICAgICAgLy9pZiB2YXVlIGlzIGVuY2xvc2VkIHdpdGggZG91YmxlIHF1b3RlIHRoZW4gc2luZ2xlIHF1b3RlcyBhcmUgYWxsb3dlZCBpbnNpZGUgdGhlIHZhbHVlIGFuZCB2aWNlIHZlcnNhXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhcnRDaGFyID0gJyc7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh4bWxEYXRhW2ldID09PSAnPicpIHtcbiAgICAgIGlmIChzdGFydENoYXIgPT09ICcnKSB7XG4gICAgICAgIHRhZ0Nsb3NlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBhdHRyU3RyICs9IHhtbERhdGFbaV07XG4gIH1cbiAgaWYgKHN0YXJ0Q2hhciAhPT0gJycpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4ge3ZhbHVlOiBhdHRyU3RyLCBpbmRleDogaSwgdGFnQ2xvc2VkOiB0YWdDbG9zZWR9O1xufVxuXG4vKipcbiAqIFNlbGVjdCBhbGwgdGhlIGF0dHJpYnV0ZXMgd2hldGhlciB2YWxpZCBvciBpbnZhbGlkLlxuICovXG5jb25zdCB2YWxpZEF0dHJTdHJSZWd4cCA9IG5ldyBSZWdFeHAoJyhcXFxccyopKFteXFxcXHM9XSspKFxcXFxzKj0pPyhcXFxccyooW1xcJ1wiXSkoKFtcXFxcc1xcXFxTXSkqPylcXFxcNSk/JywgJ2cnKTtcblxuLy9hdHRyLCA9XCJzZFwiLCBhPVwiYW1pdCdzXCIsIGE9XCJzZFwiYj1cInNhZlwiLCBhYiAgY2Q9XCJcIlxuXG5mdW5jdGlvbiB2YWxpZGF0ZUF0dHJpYnV0ZVN0cmluZyhhdHRyU3RyLCBvcHRpb25zLCByZWd4QXR0ck5hbWUpIHtcbiAgLy9jb25zb2xlLmxvZyhcInN0YXJ0OlwiK2F0dHJTdHIrXCI6ZW5kXCIpO1xuXG4gIC8vaWYoYXR0clN0ci50cmltKCkubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTsgLy9lbXB0eSBzdHJpbmdcblxuICBjb25zdCBtYXRjaGVzID0gdXRpbC5nZXRBbGxNYXRjaGVzKGF0dHJTdHIsIHZhbGlkQXR0clN0clJlZ3hwKTtcbiAgY29uc3QgYXR0ck5hbWVzID0ge307XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9jb25zb2xlLmxvZyhtYXRjaGVzW2ldKTtcblxuICAgIGlmIChtYXRjaGVzW2ldWzFdLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy9ub3NwYWNlIGJlZm9yZSBhdHRyaWJ1dGUgbmFtZTogYT1cInNkXCJiPVwic2FmXCJcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBtYXRjaGVzW2ldWzJdICsgJyBoYXMgbm8gc3BhY2UgaW4gc3RhcnRpbmcuJ319O1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlc1tpXVszXSA9PT0gdW5kZWZpbmVkICYmICFvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgIC8vaW5kZXBlbmRlbnQgYXR0cmlidXRlOiBhYlxuICAgICAgcmV0dXJuIHtlcnI6IHtjb2RlOiAnSW52YWxpZEF0dHInLCBtc2c6ICdib29sZWFuIGF0dHJpYnV0ZSAnICsgbWF0Y2hlc1tpXVsyXSArICcgaXMgbm90IGFsbG93ZWQuJ319O1xuICAgIH1cbiAgICAvKiBlbHNlIGlmKG1hdGNoZXNbaV1bNl0gPT09IHVuZGVmaW5lZCl7Ly9hdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZTogYWI9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVycjogeyBjb2RlOlwiSW52YWxpZEF0dHJcIixtc2c6XCJhdHRyaWJ1dGUgXCIgKyBtYXRjaGVzW2ldWzJdICsgXCIgaGFzIG5vIHZhbHVlIGFzc2lnbmVkLlwifX07XG4gICAgICAgICAgICAgICAgfSAqL1xuICAgIGNvbnN0IGF0dHJOYW1lID0gbWF0Y2hlc1tpXVsyXTtcbiAgICBpZiAoIXZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkpIHtcbiAgICAgIHJldHVybiB7ZXJyOiB7Y29kZTogJ0ludmFsaWRBdHRyJywgbXNnOiAnYXR0cmlidXRlICcgKyBhdHRyTmFtZSArICcgaXMgYW4gaW52YWxpZCBuYW1lLid9fTtcbiAgICB9XG4gICAgLyppZiAoIWF0dHJOYW1lcy5oYXNPd25Qcm9wZXJ0eShhdHRyTmFtZSkpIHsqL1xuICAgIGlmICggIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhdHRyTmFtZXMsIGF0dHJOYW1lKSkge1xuICAgICAgLy9jaGVjayBmb3IgZHVwbGljYXRlIGF0dHJpYnV0ZS5cbiAgICAgIGF0dHJOYW1lc1thdHRyTmFtZV0gPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge2Vycjoge2NvZGU6ICdJbnZhbGlkQXR0cicsIG1zZzogJ2F0dHJpYnV0ZSAnICsgYXR0ck5hbWUgKyAnIGlzIHJlcGVhdGVkLid9fTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gY29uc3QgdmFsaWRBdHRyUmVneHAgPSAvXltfYS16QS1aXVtcXHdcXC0uOl0qJC87XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQXR0ck5hbWUoYXR0ck5hbWUsIHJlZ3hBdHRyTmFtZSkge1xuICAvLyBjb25zdCB2YWxpZEF0dHJSZWd4cCA9IG5ldyBSZWdFeHAocmVneEF0dHJOYW1lKTtcbiAgcmV0dXJuIHV0aWwuZG9lc01hdGNoKGF0dHJOYW1lLCByZWd4QXR0ck5hbWUpO1xufVxuXG4vL2NvbnN0IHN0YXJ0c1dpdGhYTUwgPSBuZXcgUmVnRXhwKFwiXltYeF1bTW1dW0xsXVwiKTtcbi8vICBzdGFydHNXaXRoID0gL14oW2EtekEtWl18XylbXFx3LlxcLV86XSovO1xuXG5mdW5jdGlvbiB2YWxpZGF0ZVRhZ05hbWUodGFnbmFtZSwgcmVneFRhZ05hbWUpIHtcbiAgLyppZih1dGlsLmRvZXNNYXRjaCh0YWduYW1lLHN0YXJ0c1dpdGhYTUwpKSByZXR1cm4gZmFsc2U7XG4gICAgZWxzZSovXG4gIHJldHVybiAhdXRpbC5kb2VzTm90TWF0Y2godGFnbmFtZSwgcmVneFRhZ05hbWUpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRhZ25hbWUsIHBhcmVudCwgdmFsKSB7XG4gIHRoaXMudGFnbmFtZSA9IHRhZ25hbWU7XG4gIHRoaXMucGFyZW50ID0gcGFyZW50O1xuICB0aGlzLmNoaWxkID0ge307IC8vY2hpbGQgdGFnc1xuICB0aGlzLmF0dHJzTWFwID0ge307IC8vYXR0cmlidXRlcyBtYXBcbiAgdGhpcy5jaGlsZHJlbiA9IFtdO1xuICB0aGlzLnZhbCA9IHZhbDsgLy90ZXh0IG9ubHlcbiAgdGhpcy5hZGRDaGlsZCA9IGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5wdXNoKGNoaWxkKTtcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdKSkge1xuICAgICAgLy9hbHJlYWR5IHByZXNlbnRzXG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdLnB1c2goY2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNoaWxkW2NoaWxkLnRhZ25hbWVdID0gW2NoaWxkXTtcbiAgICB9XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dGlsID0gcmVxdWlyZSgnLi91dGlsJyk7XG5jb25zdCBidWlsZE9wdGlvbnMgPSByZXF1aXJlKCcuL3V0aWwnKS5idWlsZE9wdGlvbnM7XG5jb25zdCB4bWxOb2RlID0gcmVxdWlyZSgnLi94bWxOb2RlJyk7XG5jb25zdCBUYWdUeXBlID0ge09QRU5JTkc6IDEsIENMT1NJTkc6IDIsIFNFTEY6IDMsIENEQVRBOiA0fTtcbmxldCByZWd4ID1cbiAgJzwoKCFcXFxcW0NEQVRBXFxcXFsoW1xcXFxzXFxcXFNdKj8pKF1dPikpfCgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSkoW14+XSopPnwoKFxcXFwvKSgoW1xcXFx3OlxcXFwtLl9dKjopPyhbXFxcXHc6XFxcXC0uX10rKSlcXFxccyo+KSkoW148XSopJztcblxuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvP1tcXFxcdzpcXFxcLVxcLl9dKykoW14+XSopPihcXFxccypcIitjZGF0YVJlZ3grXCIpKihbXjxdKyk/XCIsXCJnXCIpO1xuLy9jb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAoXCI8KFxcXFwvPykoKFxcXFx3KjopPyhbXFxcXHc6XFxcXC1cXC5fXSspKShbXj5dKik+KFtePF0qKShcIitjZGF0YVJlZ3grXCIoW148XSopKSooW148XSspP1wiLFwiZ1wiKTtcblxuLy9wb2x5ZmlsbFxuaWYgKCFOdW1iZXIucGFyc2VJbnQgJiYgd2luZG93LnBhcnNlSW50KSB7XG4gIE51bWJlci5wYXJzZUludCA9IHdpbmRvdy5wYXJzZUludDtcbn1cbmlmICghTnVtYmVyLnBhcnNlRmxvYXQgJiYgd2luZG93LnBhcnNlRmxvYXQpIHtcbiAgTnVtYmVyLnBhcnNlRmxvYXQgPSB3aW5kb3cucGFyc2VGbG9hdDtcbn1cblxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGF0dHJpYnV0ZU5hbWVQcmVmaXg6ICdAXycsXG4gIGF0dHJOb2RlTmFtZTogZmFsc2UsXG4gIHRleHROb2RlTmFtZTogJyN0ZXh0JyxcbiAgaWdub3JlQXR0cmlidXRlczogdHJ1ZSxcbiAgaWdub3JlTmFtZVNwYWNlOiBmYWxzZSxcbiAgYWxsb3dCb29sZWFuQXR0cmlidXRlczogZmFsc2UsIC8vYSB0YWcgY2FuIGhhdmUgYXR0cmlidXRlcyB3aXRob3V0IGFueSB2YWx1ZVxuICAvL2lnbm9yZVJvb3RFbGVtZW50IDogZmFsc2UsXG4gIHBhcnNlTm9kZVZhbHVlOiB0cnVlLFxuICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgYXJyYXlNb2RlOiBmYWxzZSxcbiAgdHJpbVZhbHVlczogdHJ1ZSwgLy9UcmltIHN0cmluZyB2YWx1ZXMgb2YgdGFnIGFuZCBhdHRyaWJ1dGVzXG4gIGNkYXRhVGFnTmFtZTogZmFsc2UsXG4gIGNkYXRhUG9zaXRpb25DaGFyOiAnXFxcXGMnLFxuICBsb2NhbGVSYW5nZTogJycsXG4gIHRhZ1ZhbHVlUHJvY2Vzc29yOiBmdW5jdGlvbihhKSB7XG4gICAgcmV0dXJuIGE7XG4gIH0sXG4gIGF0dHJWYWx1ZVByb2Nlc3NvcjogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBhO1xuICB9LFxuICBzdG9wTm9kZXM6IFtdXG4gIC8vZGVjb2RlU3RyaWN0OiBmYWxzZSxcbn07XG5cbmV4cG9ydHMuZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcblxuY29uc3QgcHJvcHMgPSBbXG4gICdhdHRyaWJ1dGVOYW1lUHJlZml4JyxcbiAgJ2F0dHJOb2RlTmFtZScsXG4gICd0ZXh0Tm9kZU5hbWUnLFxuICAnaWdub3JlQXR0cmlidXRlcycsXG4gICdpZ25vcmVOYW1lU3BhY2UnLFxuICAnYWxsb3dCb29sZWFuQXR0cmlidXRlcycsXG4gICdwYXJzZU5vZGVWYWx1ZScsXG4gICdwYXJzZUF0dHJpYnV0ZVZhbHVlJyxcbiAgJ2FycmF5TW9kZScsXG4gICd0cmltVmFsdWVzJyxcbiAgJ2NkYXRhVGFnTmFtZScsXG4gICdjZGF0YVBvc2l0aW9uQ2hhcicsXG4gICdsb2NhbGVSYW5nZScsXG4gICd0YWdWYWx1ZVByb2Nlc3NvcicsXG4gICdhdHRyVmFsdWVQcm9jZXNzb3InLFxuICAncGFyc2VUcnVlTnVtYmVyT25seScsXG4gICdzdG9wTm9kZXMnXG5dO1xuZXhwb3J0cy5wcm9wcyA9IHByb3BzO1xuXG5jb25zdCBnZXRUcmF2ZXJzYWxPYmogPSBmdW5jdGlvbih4bWxEYXRhLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBidWlsZE9wdGlvbnMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMsIHByb3BzKTtcbiAgLy94bWxEYXRhID0geG1sRGF0YS5yZXBsYWNlKC9cXHI/XFxuL2csIFwiIFwiKTsvL21ha2UgaXQgc2luZ2xlIGxpbmVcbiAgeG1sRGF0YSA9IHhtbERhdGEucmVwbGFjZSgvPCEtLVtcXHNcXFNdKj8tLT4vZywgJycpOyAvL1JlbW92ZSAgY29tbWVudHNcblxuICBjb25zdCB4bWxPYmogPSBuZXcgeG1sTm9kZSgnIXhtbCcpO1xuICBsZXQgY3VycmVudE5vZGUgPSB4bWxPYmo7XG5cbiAgcmVneCA9IHJlZ3gucmVwbGFjZSgvXFxbXFxcXHcvZywgJ1snICsgb3B0aW9ucy5sb2NhbGVSYW5nZSArICdcXFxcdycpO1xuICBjb25zdCB0YWdzUmVneCA9IG5ldyBSZWdFeHAocmVneCwgJ2cnKTtcbiAgbGV0IHRhZyA9IHRhZ3NSZWd4LmV4ZWMoeG1sRGF0YSk7XG4gIGxldCBuZXh0VGFnID0gdGFnc1JlZ3guZXhlYyh4bWxEYXRhKTtcbiAgd2hpbGUgKHRhZykge1xuICAgIGNvbnN0IHRhZ1R5cGUgPSBjaGVja0ZvclRhZ1R5cGUodGFnKTtcblxuICAgIGlmICh0YWdUeXBlID09PSBUYWdUeXBlLkNMT1NJTkcpIHtcbiAgICAgIC8vYWRkIHBhcnNlZCBkYXRhIHRvIHBhcmVudCBub2RlXG4gICAgICBpZiAoY3VycmVudE5vZGUucGFyZW50ICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUucGFyZW50LnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUucGFyZW50LnZhbCkgKyAnJyArIHByb2Nlc3NUYWdWYWx1ZSh0YWcsIG9wdGlvbnMsIGN1cnJlbnROb2RlLnBhcmVudC50YWduYW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChvcHRpb25zLnN0b3BOb2Rlcy5sZW5ndGggJiYgb3B0aW9ucy5zdG9wTm9kZXMuaW5jbHVkZXMoY3VycmVudE5vZGUudGFnbmFtZSkpIHtcbiAgICAgICAgY3VycmVudE5vZGUuY2hpbGQgPSBbXVxuICAgICAgICBpZiAoY3VycmVudE5vZGUuYXR0cnNNYXAgPT0gdW5kZWZpbmVkKSB7IGN1cnJlbnROb2RlLmF0dHJzTWFwID0ge319XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHhtbERhdGEuc3Vic3RyKGN1cnJlbnROb2RlLnN0YXJ0SW5kZXggKyAxLCB0YWcuaW5kZXggLSBjdXJyZW50Tm9kZS5zdGFydEluZGV4IC0gMSlcbiAgICAgIH1cbiAgICAgIGN1cnJlbnROb2RlID0gY3VycmVudE5vZGUucGFyZW50O1xuICAgIH0gZWxzZSBpZiAodGFnVHlwZSA9PT0gVGFnVHlwZS5DREFUQSkge1xuICAgICAgaWYgKG9wdGlvbnMuY2RhdGFUYWdOYW1lKSB7XG4gICAgICAgIC8vYWRkIGNkYXRhIG5vZGVcbiAgICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5jZGF0YVRhZ05hbWUsIGN1cnJlbnROb2RlLCB0YWdbM10pO1xuICAgICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgICAgY3VycmVudE5vZGUuYWRkQ2hpbGQoY2hpbGROb2RlKTtcbiAgICAgICAgLy9mb3IgYmFja3RyYWNraW5nXG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IHV0aWwuZ2V0VmFsdWUoY3VycmVudE5vZGUudmFsKSArIG9wdGlvbnMuY2RhdGFQb3NpdGlvbkNoYXI7XG4gICAgICAgIC8vYWRkIHJlc3QgdmFsdWUgdG8gcGFyZW50IG5vZGVcbiAgICAgICAgaWYgKHRhZ1sxNF0pIHtcbiAgICAgICAgICBjdXJyZW50Tm9kZS52YWwgKz0gcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnJlbnROb2RlLnZhbCA9IChjdXJyZW50Tm9kZS52YWwgfHwgJycpICsgKHRhZ1szXSB8fCAnJykgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRhZ1R5cGUgPT09IFRhZ1R5cGUuU0VMRikge1xuICAgICAgaWYgKGN1cnJlbnROb2RlICYmIHRhZ1sxNF0pIHtcbiAgICAgICAgY3VycmVudE5vZGUudmFsID0gdXRpbC5nZXRWYWx1ZShjdXJyZW50Tm9kZS52YWwpICsgJycgKyBwcm9jZXNzVGFnVmFsdWUodGFnLCBvcHRpb25zKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUob3B0aW9ucy5pZ25vcmVOYW1lU3BhY2UgPyB0YWdbN10gOiB0YWdbNV0sIGN1cnJlbnROb2RlLCAnJyk7XG4gICAgICBpZiAodGFnWzhdICYmIHRhZ1s4XS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRhZ1s4XSA9IHRhZ1s4XS5zdWJzdHIoMCwgdGFnWzhdLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgICAgY2hpbGROb2RlLmF0dHJzTWFwID0gYnVpbGRBdHRyaWJ1dGVzTWFwKHRhZ1s4XSwgb3B0aW9ucyk7XG4gICAgICBjdXJyZW50Tm9kZS5hZGRDaGlsZChjaGlsZE5vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL1RhZ1R5cGUuT1BFTklOR1xuICAgICAgY29uc3QgY2hpbGROb2RlID0gbmV3IHhtbE5vZGUoXG4gICAgICAgIG9wdGlvbnMuaWdub3JlTmFtZVNwYWNlID8gdGFnWzddIDogdGFnWzVdLFxuICAgICAgICBjdXJyZW50Tm9kZSxcbiAgICAgICAgcHJvY2Vzc1RhZ1ZhbHVlKHRhZywgb3B0aW9ucylcbiAgICAgICk7XG4gICAgICBpZiAob3B0aW9ucy5zdG9wTm9kZXMubGVuZ3RoICYmIG9wdGlvbnMuc3RvcE5vZGVzLmluY2x1ZGVzKGNoaWxkTm9kZS50YWduYW1lKSkge1xuICAgICAgICBjaGlsZE5vZGUuc3RhcnRJbmRleD10YWcuaW5kZXggKyB0YWdbMV0ubGVuZ3RoXG4gICAgICB9XG4gICAgICBjaGlsZE5vZGUuYXR0cnNNYXAgPSBidWlsZEF0dHJpYnV0ZXNNYXAodGFnWzhdLCBvcHRpb25zKTtcbiAgICAgIGN1cnJlbnROb2RlLmFkZENoaWxkKGNoaWxkTm9kZSk7XG4gICAgICBjdXJyZW50Tm9kZSA9IGNoaWxkTm9kZTtcbiAgICB9XG5cbiAgICB0YWcgPSBuZXh0VGFnO1xuICAgIG5leHRUYWcgPSB0YWdzUmVneC5leGVjKHhtbERhdGEpO1xuICB9XG5cbiAgcmV0dXJuIHhtbE9iajtcbn07XG5cbmZ1bmN0aW9uIHByb2Nlc3NUYWdWYWx1ZShwYXJzZWRUYWdzLCBvcHRpb25zLCBwYXJlbnRUYWdOYW1lKSB7XG4gIGNvbnN0IHRhZ05hbWUgPSBwYXJzZWRUYWdzWzddIHx8IHBhcmVudFRhZ05hbWU7XG4gIGxldCB2YWwgPSBwYXJzZWRUYWdzWzE0XTtcbiAgaWYgKHZhbCkge1xuICAgIGlmIChvcHRpb25zLnRyaW1WYWx1ZXMpIHtcbiAgICAgIHZhbCA9IHZhbC50cmltKCk7XG4gICAgfVxuICAgIHZhbCA9IG9wdGlvbnMudGFnVmFsdWVQcm9jZXNzb3IodmFsLCB0YWdOYW1lKTtcbiAgICB2YWwgPSBwYXJzZVZhbHVlKHZhbCwgb3B0aW9ucy5wYXJzZU5vZGVWYWx1ZSwgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5KTtcbiAgfVxuXG4gIHJldHVybiB2YWw7XG59XG5cbmZ1bmN0aW9uIGNoZWNrRm9yVGFnVHlwZShtYXRjaCkge1xuICBpZiAobWF0Y2hbNF0gPT09ICddXT4nKSB7XG4gICAgcmV0dXJuIFRhZ1R5cGUuQ0RBVEE7XG4gIH0gZWxzZSBpZiAobWF0Y2hbMTBdID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5DTE9TSU5HO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBtYXRjaFs4XSAhPT0gJ3VuZGVmaW5lZCcgJiYgbWF0Y2hbOF0uc3Vic3RyKG1hdGNoWzhdLmxlbmd0aCAtIDEpID09PSAnLycpIHtcbiAgICByZXR1cm4gVGFnVHlwZS5TRUxGO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBUYWdUeXBlLk9QRU5JTkc7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZU5hbWVTcGFjZSh0YWduYW1lLCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZU5hbWVTcGFjZSkge1xuICAgIGNvbnN0IHRhZ3MgPSB0YWduYW1lLnNwbGl0KCc6Jyk7XG4gICAgY29uc3QgcHJlZml4ID0gdGFnbmFtZS5jaGFyQXQoMCkgPT09ICcvJyA/ICcvJyA6ICcnO1xuICAgIGlmICh0YWdzWzBdID09PSAneG1sbnMnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmICh0YWdzLmxlbmd0aCA9PT0gMikge1xuICAgICAgdGFnbmFtZSA9IHByZWZpeCArIHRhZ3NbMV07XG4gICAgfVxuICB9XG4gIHJldHVybiB0YWduYW1lO1xufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbCwgc2hvdWxkUGFyc2UsIHBhcnNlVHJ1ZU51bWJlck9ubHkpIHtcbiAgaWYgKHNob3VsZFBhcnNlICYmIHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgbGV0IHBhcnNlZDtcbiAgICBpZiAodmFsLnRyaW0oKSA9PT0gJycgfHwgaXNOYU4odmFsKSkge1xuICAgICAgcGFyc2VkID0gdmFsID09PSAndHJ1ZScgPyB0cnVlIDogdmFsID09PSAnZmFsc2UnID8gZmFsc2UgOiB2YWw7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh2YWwuaW5kZXhPZignMHgnKSAhPT0gLTEpIHtcbiAgICAgICAgLy9zdXBwb3J0IGhleGEgZGVjaW1hbFxuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxNik7XG4gICAgICB9IGVsc2UgaWYgKHZhbC5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICAgIHBhcnNlZCA9IE51bWJlci5wYXJzZUZsb2F0KHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZWQgPSBOdW1iZXIucGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICB9XG4gICAgICBpZiAocGFyc2VUcnVlTnVtYmVyT25seSkge1xuICAgICAgICBwYXJzZWQgPSBTdHJpbmcocGFyc2VkKSA9PT0gdmFsID8gcGFyc2VkIDogdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkO1xuICB9IGVsc2Uge1xuICAgIGlmICh1dGlsLmlzRXhpc3QodmFsKSkge1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufVxuXG4vL1RPRE86IGNoYW5nZSByZWdleCB0byBjYXB0dXJlIE5TXG4vL2NvbnN0IGF0dHJzUmVneCA9IG5ldyBSZWdFeHAoXCIoW1xcXFx3XFxcXC1cXFxcLlxcXFw6XSspXFxcXHMqPVxcXFxzKihbJ1xcXCJdKSgoLnxcXG4pKj8pXFxcXDJcIixcImdtXCIpO1xuY29uc3QgYXR0cnNSZWd4ID0gbmV3IFJlZ0V4cCgnKFteXFxcXHM9XSspXFxcXHMqKD1cXFxccyooW1xcJ1wiXSkoLio/KVxcXFwzKT8nLCAnZycpO1xuXG5mdW5jdGlvbiBidWlsZEF0dHJpYnV0ZXNNYXAoYXR0clN0ciwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAmJiB0eXBlb2YgYXR0clN0ciA9PT0gJ3N0cmluZycpIHtcbiAgICBhdHRyU3RyID0gYXR0clN0ci5yZXBsYWNlKC9cXHI/XFxuL2csICcgJyk7XG4gICAgLy9hdHRyU3RyID0gYXR0clN0ciB8fCBhdHRyU3RyLnRyaW0oKTtcblxuICAgIGNvbnN0IG1hdGNoZXMgPSB1dGlsLmdldEFsbE1hdGNoZXMoYXR0clN0ciwgYXR0cnNSZWd4KTtcbiAgICBjb25zdCBsZW4gPSBtYXRjaGVzLmxlbmd0aDsgLy9kb24ndCBtYWtlIGl0IGlubGluZVxuICAgIGNvbnN0IGF0dHJzID0ge307XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYXR0ck5hbWUgPSByZXNvbHZlTmFtZVNwYWNlKG1hdGNoZXNbaV1bMV0sIG9wdGlvbnMpO1xuICAgICAgaWYgKGF0dHJOYW1lLmxlbmd0aCkge1xuICAgICAgICBpZiAobWF0Y2hlc1tpXVs0XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMudHJpbVZhbHVlcykge1xuICAgICAgICAgICAgbWF0Y2hlc1tpXVs0XSA9IG1hdGNoZXNbaV1bNF0udHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtYXRjaGVzW2ldWzRdID0gb3B0aW9ucy5hdHRyVmFsdWVQcm9jZXNzb3IobWF0Y2hlc1tpXVs0XSwgYXR0ck5hbWUpO1xuICAgICAgICAgIGF0dHJzW29wdGlvbnMuYXR0cmlidXRlTmFtZVByZWZpeCArIGF0dHJOYW1lXSA9IHBhcnNlVmFsdWUoXG4gICAgICAgICAgICBtYXRjaGVzW2ldWzRdLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZUF0dHJpYnV0ZVZhbHVlLFxuICAgICAgICAgICAgb3B0aW9ucy5wYXJzZVRydWVOdW1iZXJPbmx5XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFsbG93Qm9vbGVhbkF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICBhdHRyc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVQcmVmaXggKyBhdHRyTmFtZV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghT2JqZWN0LmtleXMoYXR0cnMpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5hdHRyTm9kZU5hbWUpIHtcbiAgICAgIGNvbnN0IGF0dHJDb2xsZWN0aW9uID0ge307XG4gICAgICBhdHRyQ29sbGVjdGlvbltvcHRpb25zLmF0dHJOb2RlTmFtZV0gPSBhdHRycztcbiAgICAgIHJldHVybiBhdHRyQ29sbGVjdGlvbjtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG59XG5cbmV4cG9ydHMuZ2V0VHJhdmVyc2FsT2JqID0gZ2V0VHJhdmVyc2FsT2JqO1xuIiwiLypcbiAqIFNjcm9sbGVyXG4gKiBodHRwOi8vZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlclxuICpcbiAqIENvcHlyaWdodCAyMDExLCBaeW5nYSBJbmMuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL3p5bmdhL3Njcm9sbGVyL21hc3Rlci9NSVQtTElDRU5TRS50eHRcbiAqXG4gKiBCYXNlZCBvbiB0aGUgd29yayBvZjogVW5pZnkgUHJvamVjdCAodW5pZnktcHJvamVjdC5vcmcpXG4gKiBodHRwOi8vdW5pZnktcHJvamVjdC5vcmdcbiAqIENvcHlyaWdodCAyMDExLCBEZXV0c2NoZSBUZWxla29tIEFHXG4gKiBMaWNlbnNlOiBNSVQgKyBBcGFjaGUgKFYyKVxuICovXG5cbi8qKlxuICogR2VuZXJpYyBhbmltYXRpb24gY2xhc3Mgd2l0aCBzdXBwb3J0IGZvciBkcm9wcGVkIGZyYW1lcyBib3RoIG9wdGlvbmFsIGVhc2luZyBhbmQgZHVyYXRpb24uXG4gKlxuICogT3B0aW9uYWwgZHVyYXRpb24gaXMgdXNlZnVsIHdoZW4gdGhlIGxpZmV0aW1lIGlzIGRlZmluZWQgYnkgYW5vdGhlciBjb25kaXRpb24gdGhhbiB0aW1lXG4gKiBlLmcuIHNwZWVkIG9mIGFuIGFuaW1hdGluZyBvYmplY3QsIGV0Yy5cbiAqXG4gKiBEcm9wcGVkIGZyYW1lIGxvZ2ljIGFsbG93cyB0byBrZWVwIHVzaW5nIHRoZSBzYW1lIHVwZGF0ZXIgbG9naWMgaW5kZXBlbmRlbnQgZnJvbSB0aGUgYWN0dWFsXG4gKiByZW5kZXJpbmcuIFRoaXMgZWFzZXMgYSBsb3Qgb2YgY2FzZXMgd2hlcmUgaXQgbWlnaHQgYmUgcHJldHR5IGNvbXBsZXggdG8gYnJlYWsgZG93biBhIHN0YXRlXG4gKiBiYXNlZCBvbiB0aGUgcHVyZSB0aW1lIGRpZmZlcmVuY2UuXG4gKi9cbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIENvbW1vbkpTXG4gICAgICAgIGZhY3RvcnkoZXhwb3J0cyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzXG4gICAgICAgIGZhY3RvcnkoKHJvb3QuYW5pbWF0ZSA9IHt9KSk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgIHZhciBnbG9iYWwgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IHRoaXMgOiB3aW5kb3dcbiAgICB2YXIgdGltZSA9IERhdGUubm93IHx8IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICtuZXcgRGF0ZSgpO1xuICAgIH07XG4gICAgdmFyIGRlc2lyZWRGcmFtZXMgPSA2MDtcbiAgICB2YXIgbWlsbGlzZWNvbmRzUGVyU2Vjb25kID0gMTAwMDtcbiAgICB2YXIgcnVubmluZyA9IHt9O1xuICAgIHZhciBjb3VudGVyID0gMTtcblxuICAgIC8qKlxuICAgICAqIFN0b3BzIHRoZSBnaXZlbiBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gaWQge0ludGVnZXJ9IFVuaXF1ZSBhbmltYXRpb24gSURcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufSBXaGV0aGVyIHRoZSBhbmltYXRpb24gd2FzIHN0b3BwZWQgKGFrYSwgd2FzIHJ1bm5pbmcgYmVmb3JlKVxuICAgICAqL1xuICAgIGV4cG9ydHMuc3RvcCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgY2xlYXJlZCA9IChydW5uaW5nW2lkXSAhPT0gbnVsbCk7XG4gICAgICAgIGlmIChjbGVhcmVkKSB7XG4gICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY2xlYXJlZDtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBnaXZlbiBhbmltYXRpb24gaXMgc3RpbGwgcnVubmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBpZCB7SW50ZWdlcn0gVW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIGFuaW1hdGlvbiBpcyBzdGlsbCBydW5uaW5nXG4gICAgICovXG4gICAgZXhwb3J0cy5pc1J1bm5pbmcgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgcmV0dXJuIHJ1bm5pbmdbaWRdICE9PSBudWxsO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIFN0YXJ0IHRoZSBhbmltYXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gc3RlcENhbGxiYWNrIHtGdW5jdGlvbn0gUG9pbnRlciB0byBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZCBvbiBldmVyeSBzdGVwLlxuICAgICAqICAgU2lnbmF0dXJlIG9mIHRoZSBtZXRob2Qgc2hvdWxkIGJlIGBmdW5jdGlvbihwZXJjZW50LCBub3csIHZpcnR1YWwpIHsgcmV0dXJuIGNvbnRpbnVlV2l0aEFuaW1hdGlvbjsgfWBcbiAgICAgKiBAcGFyYW0gdmVyaWZ5Q2FsbGJhY2sge0Z1bmN0aW9ufSBFeGVjdXRlZCBiZWZvcmUgZXZlcnkgYW5pbWF0aW9uIHN0ZXAuXG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKCkgeyByZXR1cm4gY29udGludWVXaXRoQW5pbWF0aW9uOyB9YFxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRDYWxsYmFjayB7RnVuY3Rpb259XG4gICAgICogICBTaWduYXR1cmUgb2YgdGhlIG1ldGhvZCBzaG91bGQgYmUgYGZ1bmN0aW9uKGRyb3BwZWRGcmFtZXMsIGZpbmlzaGVkQW5pbWF0aW9uLCBvcHRpb25hbCB3YXNGaW5pc2hlZCkge31gXG4gICAgICogQHBhcmFtIGR1cmF0aW9uIHtJbnRlZ2VyfSBNaWxsaXNlY29uZHMgdG8gcnVuIHRoZSBhbmltYXRpb25cbiAgICAgKiBAcGFyYW0gZWFzaW5nTWV0aG9kIHtGdW5jdGlvbn0gUG9pbnRlciB0byBlYXNpbmcgZnVuY3Rpb25cbiAgICAgKiAgIFNpZ25hdHVyZSBvZiB0aGUgbWV0aG9kIHNob3VsZCBiZSBgZnVuY3Rpb24ocGVyY2VudCkgeyByZXR1cm4gbW9kaWZpZWRWYWx1ZTsgfWBcbiAgICAgKiBAcGFyYW0gcm9vdCB7RWxlbWVudH0gUmVuZGVyIHJvb3QuIFVzZWQgZm9yIGludGVybmFsIHVzYWdlIG9mIHJlcXVlc3RBbmltYXRpb25GcmFtZS5cbiAgICAgKiBAcmV0dXJuIHtJbnRlZ2VyfSBJZGVudGlmaWVyIG9mIGFuaW1hdGlvbi4gQ2FuIGJlIHVzZWQgdG8gc3RvcCBpdCBhbnkgdGltZS5cbiAgICAgKi9cbiAgICBleHBvcnRzLnN0YXJ0ID0gZnVuY3Rpb24gKHN0ZXBDYWxsYmFjaywgdmVyaWZ5Q2FsbGJhY2ssIGNvbXBsZXRlZENhbGxiYWNrLCBkdXJhdGlvbiwgZWFzaW5nTWV0aG9kLCByb290KSB7XG4gICAgICAgIHZhciBzdGFydCA9IHRpbWUoKTtcbiAgICAgICAgdmFyIGxhc3RGcmFtZSA9IHN0YXJ0O1xuICAgICAgICB2YXIgcGVyY2VudCA9IDA7XG4gICAgICAgIHZhciBkcm9wQ291bnRlciA9IDA7XG4gICAgICAgIHZhciBpZCA9IGNvdW50ZXIrKztcblxuICAgICAgICAvLyBDb21wYWN0aW5nIHJ1bm5pbmcgZGIgYXV0b21hdGljYWxseSBldmVyeSBmZXcgbmV3IGFuaW1hdGlvbnNcbiAgICAgICAgaWYgKGlkICUgMjAgPT09IDApIHtcbiAgICAgICAgICAgIHZhciBuZXdSdW5uaW5nID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciB1c2VkSWQgaW4gcnVubmluZykge1xuICAgICAgICAgICAgICAgIG5ld1J1bm5pbmdbdXNlZElkXSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBydW5uaW5nID0gbmV3UnVubmluZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoaXMgaXMgdGhlIGludGVybmFsIHN0ZXAgbWV0aG9kIHdoaWNoIGlzIGNhbGxlZCBldmVyeSBmZXcgbWlsbGlzZWNvbmRzXG4gICAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHZpcnR1YWwpIHtcblxuICAgICAgICAgICAgLy8gTm9ybWFsaXplIHZpcnR1YWwgdmFsdWVcbiAgICAgICAgICAgIHZhciByZW5kZXIgPSB2aXJ0dWFsICE9PSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBHZXQgY3VycmVudCB0aW1lXG4gICAgICAgICAgICB2YXIgbm93ID0gdGltZSgpO1xuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gaXMgZXhlY3V0ZWQgYmVmb3JlIG5leHQgYW5pbWF0aW9uIHN0ZXBcbiAgICAgICAgICAgIGlmICghcnVubmluZ1tpZF0gfHwgKHZlcmlmeUNhbGxiYWNrICYmICF2ZXJpZnlDYWxsYmFjayhpZCkpKSB7XG5cbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEZvciB0aGUgY3VycmVudCByZW5kZXJpbmcgdG8gYXBwbHkgbGV0J3MgdXBkYXRlIG9taXR0ZWQgc3RlcHMgaW4gbWVtb3J5LlxuICAgICAgICAgICAgLy8gVGhpcyBpcyBpbXBvcnRhbnQgdG8gYnJpbmcgaW50ZXJuYWwgc3RhdGUgdmFyaWFibGVzIHVwLXRvLWRhdGUgd2l0aCBwcm9ncmVzcyBpbiB0aW1lLlxuICAgICAgICAgICAgaWYgKHJlbmRlcikge1xuXG4gICAgICAgICAgICAgICAgdmFyIGRyb3BwZWRGcmFtZXMgPSBNYXRoLnJvdW5kKChub3cgLSBsYXN0RnJhbWUpIC8gKG1pbGxpc2Vjb25kc1BlclNlY29uZCAvIGRlc2lyZWRGcmFtZXMpKSAtIDE7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBNYXRoLm1pbihkcm9wcGVkRnJhbWVzLCA0KTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0ZXAodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGRyb3BDb3VudGVyKys7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvbXB1dGUgcGVyY2VudCB2YWx1ZVxuICAgICAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGVyY2VudCA9IChub3cgLSBzdGFydCkgLyBkdXJhdGlvbjtcbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgcGVyY2VudCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBFeGVjdXRlIHN0ZXAgY2FsbGJhY2ssIHRoZW4uLi5cbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGVhc2luZ01ldGhvZCA/IGVhc2luZ01ldGhvZChwZXJjZW50KSA6IHBlcmNlbnQ7XG4gICAgICAgICAgICBpZiAoKHN0ZXBDYWxsYmFjayh2YWx1ZSwgbm93LCByZW5kZXIpID09PSBmYWxzZSB8fCBwZXJjZW50ID09PSAxKSAmJiByZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBydW5uaW5nW2lkXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgY29tcGxldGVkQ2FsbGJhY2soZGVzaXJlZEZyYW1lcyAtIChkcm9wQ291bnRlciAvICgobm93IC0gc3RhcnQpIC8gbWlsbGlzZWNvbmRzUGVyU2Vjb25kKSksIGlkLCBwZXJjZW50ID09PSAxIHx8IGR1cmF0aW9uID09PSB1bmRlZmluZWQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICAgICAgICBsYXN0RnJhbWUgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHN0ZXAsIHJvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcmsgYXMgcnVubmluZ1xuICAgICAgICBydW5uaW5nW2lkXSA9IHRydWU7XG5cbiAgICAgICAgLy8gSW5pdCBmaXJzdCBzdGVwXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwLCByb290KTtcblxuICAgICAgICAvLyBSZXR1cm4gdW5pcXVlIGFuaW1hdGlvbiBJRFxuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfTtcbn0pKTtcbiIsIi8qXG4gKiBTY3JvbGxlclxuICogaHR0cDovL2dpdGh1Yi5jb20venluZ2Evc2Nyb2xsZXJcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSwgWnluZ2EgSW5jLlxuICogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS96eW5nYS9zY3JvbGxlci9tYXN0ZXIvTUlULUxJQ0VOU0UudHh0XG4gKlxuICogQmFzZWQgb24gdGhlIHdvcmsgb2Y6IFVuaWZ5IFByb2plY3QgKHVuaWZ5LXByb2plY3Qub3JnKVxuICogaHR0cDovL3VuaWZ5LXByb2plY3Qub3JnXG4gKiBDb3B5cmlnaHQgMjAxMSwgRGV1dHNjaGUgVGVsZWtvbSBBR1xuICogTGljZW5zZTogTUlUICsgQXBhY2hlIChWMilcbiAqL1xuaW1wb3J0IGFuaW1hdGUgZnJvbSAnLi9hbmltYXRlJztcbnZhciBOT09QID0gZnVuY3Rpb24gKCkgeyB9O1xuXG4vLyBFYXNpbmcgRXF1YXRpb25zIChjKSAyMDAzIFJvYmVydCBQZW5uZXIsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4vLyBPcGVuIHNvdXJjZSB1bmRlciB0aGUgQlNEIExpY2Vuc2UuXG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZU91dEN1YmljID0gZnVuY3Rpb24gKHBvcykge1xuICByZXR1cm4gKE1hdGgucG93KChwb3MgLSAxKSwgMykgKyAxKTtcbn07XG5cbi8qKlxuICogQHBhcmFtIHBvcyB7TnVtYmVyfSBwb3NpdGlvbiBiZXR3ZWVuIDAgKHN0YXJ0IG9mIGVmZmVjdCkgYW5kIDEgKGVuZCBvZiBlZmZlY3QpXG4gKiovXG52YXIgZWFzZUluT3V0Q3ViaWMgPSBmdW5jdGlvbiAocG9zKSB7XG4gIGlmICgocG9zIC89IDAuNSkgPCAxKSB7XG4gICAgcmV0dXJuIDAuNSAqIE1hdGgucG93KHBvcywgMyk7XG4gIH1cblxuICByZXR1cm4gMC41ICogKE1hdGgucG93KChwb3MgLSAyKSwgMykgKyAyKTtcbn07XG5cblxuLyoqXG4gKiBBIHB1cmUgbG9naWMgJ2NvbXBvbmVudCcgZm9yICd2aXJ0dWFsJyBzY3JvbGxpbmcvem9vbWluZy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgb3B0aW9ucykge1xuICAgIHRoaXMuX19jYWxsYmFjayA9IGNhbGxiYWNrO1xuXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgLyoqIEVuYWJsZSBzY3JvbGxpbmcgb24geC1heGlzICovXG4gICAgICBzY3JvbGxpbmdYOiB0cnVlLFxuXG4gICAgICAvKiogRW5hYmxlIHNjcm9sbGluZyBvbiB5LWF4aXMgKi9cbiAgICAgIHNjcm9sbGluZ1k6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgYW5pbWF0aW9ucyBmb3IgZGVjZWxlcmF0aW9uLCBzbmFwIGJhY2ssIHpvb21pbmcgYW5kIHNjcm9sbGluZyAqL1xuICAgICAgYW5pbWF0aW5nOiB0cnVlLFxuXG4gICAgICAvKiogZHVyYXRpb24gZm9yIGFuaW1hdGlvbnMgdHJpZ2dlcmVkIGJ5IHNjcm9sbFRvL3pvb21UbyAqL1xuICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDI1MCxcblxuICAgICAgLyoqIEVuYWJsZSBib3VuY2luZyAoY29udGVudCBjYW4gYmUgc2xvd2x5IG1vdmVkIG91dHNpZGUgYW5kIGp1bXBzIGJhY2sgYWZ0ZXIgcmVsZWFzaW5nKSAqL1xuICAgICAgYm91bmNpbmc6IHRydWUsXG5cbiAgICAgIC8qKiBFbmFibGUgbG9ja2luZyB0byB0aGUgbWFpbiBheGlzIGlmIHVzZXIgbW92ZXMgb25seSBzbGlnaHRseSBvbiBvbmUgb2YgdGhlbSBhdCBzdGFydCAqL1xuICAgICAgbG9ja2luZzogdHJ1ZSxcblxuICAgICAgLyoqIEVuYWJsZSBwYWdpbmF0aW9uIG1vZGUgKHN3aXRjaGluZyBiZXR3ZWVuIGZ1bGwgcGFnZSBjb250ZW50IHBhbmVzKSAqL1xuICAgICAgcGFnaW5nOiBmYWxzZSxcblxuICAgICAgLyoqIEVuYWJsZSBzbmFwcGluZyBvZiBjb250ZW50IHRvIGEgY29uZmlndXJlZCBwaXhlbCBncmlkICovXG4gICAgICBzbmFwcGluZzogZmFsc2UsXG5cbiAgICAgIC8qKiBFbmFibGUgem9vbWluZyBvZiBjb250ZW50IHZpYSBBUEksIGZpbmdlcnMgYW5kIG1vdXNlIHdoZWVsICovXG4gICAgICB6b29taW5nOiBmYWxzZSxcblxuICAgICAgLyoqIE1pbmltdW0gem9vbSBsZXZlbCAqL1xuICAgICAgbWluWm9vbTogMC41LFxuXG4gICAgICAvKiogTWF4aW11bSB6b29tIGxldmVsICovXG4gICAgICBtYXhab29tOiAzLFxuXG4gICAgICAvKiogTXVsdGlwbHkgb3IgZGVjcmVhc2Ugc2Nyb2xsaW5nIHNwZWVkICoqL1xuICAgICAgc3BlZWRNdWx0aXBsaWVyOiAxLFxuXG4gICAgICAvKiogQ2FsbGJhY2sgdGhhdCBpcyBmaXJlZCBvbiB0aGUgbGF0ZXIgb2YgdG91Y2ggZW5kIG9yIGRlY2VsZXJhdGlvbiBlbmQsXG4gICAgICAgICAgcHJvdmlkZWQgdGhhdCBhbm90aGVyIHNjcm9sbGluZyBhY3Rpb24gaGFzIG5vdCBiZWd1bi4gVXNlZCB0byBrbm93XG4gICAgICAgICAgd2hlbiB0byBmYWRlIG91dCBhIHNjcm9sbGJhci4gKi9cbiAgICAgIHNjcm9sbGluZ0NvbXBsZXRlOiBOT09QLFxuXG4gICAgICAvKiogVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uIHdoZW4gcmVhY2hpbmcgYm91bmRhcmllcyAgKiovXG4gICAgICBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjogMC4wMyxcblxuICAgICAgLyoqIFRoaXMgY29uZmlndXJlcyB0aGUgYW1vdW50IG9mIGNoYW5nZSBhcHBsaWVkIHRvIGFjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXMgICoqL1xuICAgICAgcGVuZXRyYXRpb25BY2NlbGVyYXRpb246IDAuMDhcbiAgICB9O1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgIElOVEVSTkFMIEZJRUxEUyA6OiBTVEFUVVNcbiAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIG9ubHkgYSBzaW5nbGUgZmluZ2VyIGlzIHVzZWQgaW4gdG91Y2ggaGFuZGxpbmcgKi9cbiAgX19pc1NpbmdsZVRvdWNoID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgdG91Y2ggZXZlbnQgc2VxdWVuY2UgaXMgaW4gcHJvZ3Jlc3MgKi9cbiAgX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgLyoqIHtCb29sZWFufSBXaGV0aGVyIGEgZGVjZWxlcmF0aW9uIGFuaW1hdGlvbiB3ZW50IHRvIGNvbXBsZXRpb24uICovXG4gIF9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgYSBnZXN0dXJlIHpvb20vcm90YXRlIGV2ZW50IGlzIGluIHByb2dyZXNzLiBBY3RpdmF0ZXMgd2hlblxuICAgKiBhIGdlc3R1cmVzdGFydCBldmVudCBoYXBwZW5zLiBUaGlzIGhhcyBoaWdoZXIgcHJpb3JpdHkgdGhhbiBkcmFnZ2luZy5cbiAgICovXG4gIF9faXNHZXN0dXJpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHVzZXIgaGFzIG1vdmVkIGJ5IHN1Y2ggYSBkaXN0YW5jZSB0aGF0IHdlIGhhdmUgZW5hYmxlZFxuICAgKiBkcmFnZ2luZyBtb2RlLiBIaW50ID0gSXQncyBvbmx5IGVuYWJsZWQgYWZ0ZXIgc29tZSBwaXhlbHMgb2YgbW92ZW1lbnQgdDtcbiAgICogbm90IGludGVycnVwdCB3aXRoIGNsaWNrcyBldGMuXG4gICAqL1xuICBfX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAvKipcbiAgICoge0Jvb2xlYW59IE5vdCB0b3VjaGluZyBhbmQgZHJhZ2dpbmcgYW55bW9yZSwgYW5kIHNtb290aGx5IGFuaW1hdGluZyB0aGVcbiAgICogdG91Y2ggc2VxdWVuY2UgdXNpbmcgZGVjZWxlcmF0aW9uLlxuICAgKi9cbiAgX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7Qm9vbGVhbn0gU21vb3RobHkgYW5pbWF0aW5nIHRoZSBjdXJyZW50bHkgY29uZmlndXJlZCBjaGFuZ2VcbiAgICovXG4gIF9faXNBbmltYXRpbmcgPSBmYWxzZTtcblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBJTlRFUk5BTCBGSUVMRFMgOjogRElNRU5TSU9OU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgbGVmdCBib3VuZGFyeSAqL1xuICBfX2NsaWVudExlZnQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgcmlnaHQgYm91bmRhcnkgKi9cbiAgX19jbGllbnRUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gVmlld3BvcnQgd2lkdGggKi9cbiAgX19jbGllbnRXaWR0aCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBWaWV3cG9ydCBoZWlnaHQgKi9cbiAgX19jbGllbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3Mgd2lkdGggKi9cbiAgX19jb250ZW50V2lkdGggPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gRnVsbCBjb250ZW50J3MgaGVpZ2h0ICovXG4gIF9fY29udGVudEhlaWdodCA9IDA7XG5cbiAgLyoqIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBXaWR0aCA9IDEwMDtcblxuICAvKioge0ludGVnZXJ9IFNuYXBwaW5nIGhlaWdodCBmb3IgY29udGVudCAqL1xuICBfX3NuYXBIZWlnaHQgPSAxMDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFpvb20gbGV2ZWwgKi9cbiAgX196b29tTGV2ZWwgPSAxO1xuXG4gIC8qKiB7TnVtYmVyfSBTY3JvbGwgcG9zaXRpb24gb24geC1heGlzICovXG4gIF9fc2Nyb2xsTGVmdCA9IDA7XG5cbiAgLyoqIHtOdW1iZXJ9IFNjcm9sbCBwb3NpdGlvbiBvbiB5LWF4aXMgKi9cbiAgX19zY3JvbGxUb3AgPSAwO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBhbGxvd2VkIHNjcm9sbCBwb3NpdGlvbiBvbiB4LWF4aXMgKi9cbiAgX19tYXhTY3JvbGxMZWZ0ID0gMDtcblxuICAvKioge0ludGVnZXJ9IE1heGltdW0gYWxsb3dlZCBzY3JvbGwgcG9zaXRpb24gb24geS1heGlzICovXG4gIF9fbWF4U2Nyb2xsVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgbGVmdCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkTGVmdCA9IDA7XG5cbiAgLyoge051bWJlcn0gU2NoZWR1bGVkIHRvcCBwb3NpdGlvbiAoZmluYWwgcG9zaXRpb24gd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkVG9wID0gMDtcblxuICAvKiB7TnVtYmVyfSBTY2hlZHVsZWQgem9vbSBsZXZlbCAoZmluYWwgc2NhbGUgd2hlbiBhbmltYXRpbmcpICovXG4gIF9fc2NoZWR1bGVkWm9vbSA9IDA7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgSU5URVJOQUwgRklFTERTIDo6IExBU1QgUE9TSVRJT05TXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqIHtOdW1iZXJ9IExlZnQgcG9zaXRpb24gb2YgZmluZ2VyIGF0IHN0YXJ0ICovXG4gIF9fbGFzdFRvdWNoTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IFRvcCBwb3NpdGlvbiBvZiBmaW5nZXIgYXQgc3RhcnQgKi9cbiAgX19sYXN0VG91Y2hUb3AgPSBudWxsO1xuXG4gIC8qKiB7RGF0ZX0gVGltZXN0YW1wIG9mIGxhc3QgbW92ZSBvZiBmaW5nZXIuIFVzZWQgdG8gbGltaXQgdHJhY2tpbmcgcmFuZ2UgZm9yIGRlY2VsZXJhdGlvbiBzcGVlZC4gKi9cbiAgX19sYXN0VG91Y2hNb3ZlID0gbnVsbDtcblxuICAvKioge0FycmF5fSBMaXN0IG9mIHBvc2l0aW9ucywgdXNlcyB0aHJlZSBpbmRleGVzIGZvciBlYWNoIHN0YXRlID0gbGVmdCwgdG9wLCB0aW1lc3RhbXAgKjtcbiAgX19wb3NpdGlvbnMgPSBudWxsO1xuXG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIElOVEVSTkFMIEZJRUxEUyA6ID0gREVDRUxFUkFUSU9OIFNVUFBPUjtcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgKi9cblxuICAvKioge0ludGVnZXJ9IE1pbmltdW0gbGVmdCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWluaW11bSB0b3Agc2Nyb2xsIHBvc2l0aW9uIGR1cmluZyBkZWNlbGVyYXRpb24gKi9cbiAgX19taW5EZWNlbGVyYXRpb25TY3JvbGxUb3AgPSBudWxsO1xuXG4gIC8qKiB7SW50ZWdlcn0gTWF4aW11bSBsZWZ0IHNjcm9sbCBwb3NpdGlvbiBkdXJpbmcgZGVjZWxlcmF0aW9uICovXG4gIF9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IG51bGw7XG5cbiAgLyoqIHtJbnRlZ2VyfSBNYXhpbXVtIHRvcCBzY3JvbGwgcG9zaXRpb24gZHVyaW5nIGRlY2VsZXJhdGlvbiAqL1xuICBfX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IG51bGw7XG5cbiAgLyoqIHtOdW1iZXJ9IEN1cnJlbnQgZmFjdG9yIHRvIG1vZGlmeSBob3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiB3aXRoIG9uIGV2ZXJ5IHN0ZXAgKi9cbiAgX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBudWxsO1xuXG4gIC8qKiB7TnVtYmVyfSBDdXJyZW50IGZhY3RvciB0byBtb2RpZnkgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uIHdpdGggb24gZXZlcnkgc3RlcCAqL1xuICBfX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG51bGw7XG5cblxuXG4gIC8qXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgUFVCTElDIEFQSVxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDb25maWd1cmVzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBjbGllbnQgKG91dGVyKSBhbmQgY29udGVudCAoaW5uZXIpIGVsZW1lbnRzLlxuICAgKiBSZXF1aXJlcyB0aGUgYXZhaWxhYmxlIHNwYWNlIGZvciB0aGUgb3V0ZXIgZWxlbWVudCBhbmQgdGhlIG91dGVyIHNpemUgb2YgdGhlIGlubmVyIGVsZW1lbnQuXG4gICAqIEFsbCB2YWx1ZXMgd2hpY2ggYXJlIGZhbHN5IChudWxsIG9yIHplcm8gZXRjLikgYXJlIGlnbm9yZWQgYW5kIHRoZSBvbGQgdmFsdWUgaXMga2VwdC5cbiAgICpcbiAgICogQHBhcmFtIGNsaWVudFdpZHRoIHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgd2lkdGggb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gY2xpZW50SGVpZ2h0IHtJbnRlZ2VyID8gbnVsbH0gSW5uZXIgaGVpZ2h0IG9mIG91dGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRXaWR0aCB7SW50ZWdlciA/IG51bGx9IE91dGVyIHdpZHRoIG9mIGlubmVyIGVsZW1lbnRcbiAgICogQHBhcmFtIGNvbnRlbnRIZWlnaHQge0ludGVnZXIgPyBudWxsfSBPdXRlciBoZWlnaHQgb2YgaW5uZXIgZWxlbWVudFxuICAgKi9cbiAgc2V0RGltZW5zaW9ucyhjbGllbnRXaWR0aCwgY2xpZW50SGVpZ2h0LCBjb250ZW50V2lkdGgsIGNvbnRlbnRIZWlnaHQpIHtcbiAgICAvLyBPbmx5IHVwZGF0ZSB2YWx1ZXMgd2hpY2ggYXJlIGRlZmluZWRcbiAgICBpZiAoY2xpZW50V2lkdGggIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRXaWR0aCA9IGNsaWVudFdpZHRoO1xuICAgIH1cblxuICAgIGlmIChjbGllbnRIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX19jbGllbnRIZWlnaHQgPSBjbGllbnRIZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRXaWR0aCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRXaWR0aCA9IGNvbnRlbnRXaWR0aDtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudEhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fX2NvbnRlbnRIZWlnaHQgPSBjb250ZW50SGVpZ2h0O1xuICAgIH1cblxuICAgIC8vIFJlZnJlc2ggbWF4aW11bXNcbiAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuXG4gICAgLy8gUmVmcmVzaCBzY3JvbGwgcG9zaXRpb25cbiAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCBmYWxzZSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjbGllbnQgY29vcmRpbmF0ZXMgaW4gcmVsYXRpb24gdG8gdGhlIGRvY3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gbGVmdCB7SW50ZWdlciA/IDB9IExlZnQgcG9zaXRpb24gb2Ygb3V0ZXIgZWxlbWVudFxuICAgKiBAcGFyYW0gdG9wIHtJbnRlZ2VyID8gMH0gVG9wIHBvc2l0aW9uIG9mIG91dGVyIGVsZW1lbnRcbiAgICovXG4gIHNldFBvc2l0aW9uKGxlZnQsIHRvcCkge1xuICAgIHRoaXMuX19jbGllbnRMZWZ0ID0gbGVmdCB8fCAwO1xuICAgIHRoaXMuX19jbGllbnRUb3AgPSB0b3AgfHwgMDtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZXMgdGhlIHNuYXBwaW5nICh3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSlcbiAgICpcbiAgICogQHBhcmFtIHdpZHRoIHtJbnRlZ2VyfSBTbmFwcGluZyB3aWR0aFxuICAgKiBAcGFyYW0gaGVpZ2h0IHtJbnRlZ2VyfSBTbmFwcGluZyBoZWlnaHRcbiAgICovXG4gIHNldFNuYXBTaXplKHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLl9fc25hcFdpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5fX3NuYXBIZWlnaHQgPSBoZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2Nyb2xsIHBvc2l0aW9uIGFuZCB6b29taW5nIHZhbHVlc1xuICAgKlxuICAgKiBAcmV0dXJuIHtNYXB9IGBsZWZ0YCBhbmQgYHRvcGAgc2Nyb2xsIHBvc2l0aW9uIGFuZCBgem9vbWAgbGV2ZWxcbiAgICovXG4gIGdldFZhbHVlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5fX3Njcm9sbExlZnQsXG4gICAgICB0b3A6IHRoaXMuX19zY3JvbGxUb3AsXG4gICAgICByaWdodDogdGhpcy5fX3Njcm9sbExlZnQgKyB0aGlzLl9fY2xpZW50V2lkdGggLyB0aGlzLl9fem9vbUxldmVsLFxuICAgICAgYm90dG9tOiB0aGlzLl9fc2Nyb2xsVG9wICsgdGhpcy5fX2NsaWVudEhlaWdodCAvIHRoaXMuX196b29tTGV2ZWwsXG4gICAgICB6b29tOiB0aGlzLl9fem9vbUxldmVsXG4gICAgfTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEdldCBwb2ludCBpbiBpbiBjb250ZW50IHNwYWNlIGZyb20gc2Nyb2xsIGNvb3JkaW5hdGVzLlxuICAgKi9cbiAgZ2V0UG9pbnQoc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wKSB7XG4gICAgdmFyIHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogc2Nyb2xsTGVmdCAvIHZhbHVlcy56b29tLFxuICAgICAgdG9wOiBzY3JvbGxUb3AgLyB2YWx1ZXMuem9vbVxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtYXhpbXVtIHNjcm9sbCB2YWx1ZXNcbiAgICpcbiAgICogQHJldHVybiB7TWFwfSBgbGVmdGAgYW5kIGB0b3BgIG1heGltdW0gc2Nyb2xsIHZhbHVlc1xuICAgKi9cbiAgZ2V0U2Nyb2xsTWF4KCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLl9fbWF4U2Nyb2xsTGVmdCxcbiAgICAgIHRvcDogdGhpcy5fX21heFNjcm9sbFRvcFxuICAgIH07XG4gIH1cblxuXG4gIC8qKlxuICAgKiBab29tcyB0byB0aGUgZ2l2ZW4gbGV2ZWwuIFN1cHBvcnRzIG9wdGlvbmFsIGFuaW1hdGlvbi4gWm9vbXNcbiAgICogdGhlIGNlbnRlciB3aGVuIG5vIGNvb3JkaW5hdGVzIGFyZSBnaXZlbi5cbiAgICpcbiAgICogQHBhcmFtIGxldmVsIHtOdW1iZXJ9IExldmVsIHRvIHpvb20gdG9cbiAgICogQHBhcmFtIGlzQW5pbWF0ZWQge0Jvb2xlYW4gPyBmYWxzZX0gV2hldGhlciB0byB1c2UgYW5pbWF0aW9uXG4gICAqIEBwYXJhbSBmaXhlZExlZnQge051bWJlciA/IHVuZGVmaW5lZH0gU3RhdGlvbmFyeSBwb2ludCdzIGxlZnQgY29vcmRpbmF0ZSAodmVjdG9yIGluIGNsaWVudCBzcGFjZSlcbiAgICogQHBhcmFtIGZpeGVkVG9wIHtOdW1iZXIgPyB1bmRlZmluZWR9IFN0YXRpb25hcnkgcG9pbnQncyB0b3AgY29vcmRpbmF0ZSAodmVjdG9yIGluIGNsaWVudCBzcGFjZSlcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbiA/IG51bGx9IEEgY2FsbGJhY2sgdGhhdCBnZXRzIGZpcmVkIHdoZW4gdGhlIHpvb20gaXMgY29tcGxldGUuXG4gICAqL1xuICB6b29tVG8obGV2ZWwsIGlzQW5pbWF0ZWQsIGZpeGVkTGVmdCwgZml4ZWRUb3AsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWm9vbWluZyBpcyBub3QgZW5hYmxlZCFcIik7XG4gICAgfVxuXG4gICAgLy8gQWRkIGNhbGxiYWNrIGlmIGV4aXN0c1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgb2xkTGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgLy8gTm9ybWFsaXplIGZpeGVkIHBvaW50IHRvIGNlbnRlciBvZiB2aWV3cG9ydCBpZiBub3QgZGVmaW5lZFxuICAgIGlmIChmaXhlZExlZnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZml4ZWRMZWZ0ID0gdGhpcy5fX2NsaWVudFdpZHRoIC8gMjtcbiAgICB9XG5cbiAgICBpZiAoZml4ZWRUb3AgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZml4ZWRUb3AgPSB0aGlzLl9fY2xpZW50SGVpZ2h0IC8gMjtcbiAgICB9XG5cbiAgICAvLyBMaW1pdCBsZXZlbCBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgIGxldmVsID0gTWF0aC5tYXgoTWF0aC5taW4obGV2ZWwsIHRoaXMub3B0aW9ucy5tYXhab29tKSwgdGhpcy5vcHRpb25zLm1pblpvb20pO1xuXG4gICAgLy8gUmVjb21wdXRlIG1heGltdW0gdmFsdWVzIHdoaWxlIHRlbXBvcmFyeSB0d2Vha2luZyBtYXhpbXVtIHNjcm9sbCByYW5nZXNcbiAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heChsZXZlbCk7XG5cbiAgICAvLyBSZWNvbXB1dGUgbGVmdCBhbmQgdG9wIHNjcm9sbCBwb3NpdGlvbnMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWwuXG4gICAgLy8gQ2hvb3NpbmcgdGhlIG5ldyB2aWV3cG9ydCBzbyB0aGF0IHRoZSBvcmlnaW4ncyBwb3NpdGlvbiByZW1haW5zXG4gICAgLy8gZml4ZWQsIHdlIGhhdmUgY2VudHJhbCBkaWxhdGlvbiBhYm91dCB0aGUgb3JpZ2luLlxuICAgIC8vICogRml4ZWQgcG9pbnQsICRGJCwgcmVtYWlucyBzdGF0aW9uYXJ5IGluIGNvbnRlbnQgc3BhY2UgYW5kIGluIHRoZVxuICAgIC8vIHZpZXdwb3J0LlxuICAgIC8vICogSW5pdGlhbCBzY3JvbGwgcG9zaXRpb24sICRTX2kkLCBpbiBjb250ZW50IHNwYWNlLlxuICAgIC8vICogRmluYWwgc2Nyb2xsIHBvc2l0aW9uLCAkU19mJCwgaW4gY29udGVudCBzcGFjZS5cbiAgICAvLyAqIEluaXRpYWwgc2NhbGluZyBmYWN0b3IsICRrX2kkLlxuICAgIC8vICogRmluYWwgc2NhbGluZyBmYWN0b3IsICRrX2YkLlxuICAgIC8vXG4gICAgLy8gKiAkU19pIFxcbWFwc3RvIFNfZiQuXG4gICAgLy8gKiAkKFNfaSAtIEYpIGtfaSA9IChTX2YgLSBGKSBrX2YkLlxuICAgIC8vICogJChTX2kgLSBGKSBrX2kva19mID0gKFNfZiAtIEYpJC5cbiAgICAvLyAqICRTX2YgPSBGICsgKFNfaSAtIEYpIGtfaS9rX2YkLlxuICAgIC8vXG4gICAgLy8gRml4ZWQgcG9pbnQgbG9jYXRpb24sICRcXHZlY3RvcntmfSA9IChGIC0gU19pKSBrX2kkLlxuICAgIC8vICogJEYgPSBTX2kgKyBcXHZlY3RvcntmfS9rX2kkLlxuICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSArIChTX2kgLSBTX2kgLSBcXHZlY3RvcntmfS9rX2kpIGtfaS9rX2YkLlxuICAgIC8vICogJFNfZiA9IFNfaSArIFxcdmVjdG9ye2Z9L2tfaSAtIFxcdmVjdG9ye2Z9L2tfZiQuXG4gICAgLy8gKiAkU19mIGtfZiA9IFNfaSBrX2YgKyAoa19mL2tfaSAtIDEpXFx2ZWN0b3J7Zn0kLlxuICAgIC8vICogJFNfZiBrX2YgPSAoa19mL2tfaSkoU19pIGtfaSkgKyAoa19mL2tfaSAtIDEpIFxcdmVjdG9ye2Z9JC5cbiAgICB2YXIgayA9IGxldmVsIC8gb2xkTGV2ZWw7XG4gICAgdmFyIGxlZnQgPSBrICogKHRoaXMuX19zY3JvbGxMZWZ0ICsgZml4ZWRMZWZ0KSAtIGZpeGVkTGVmdDtcbiAgICB2YXIgdG9wID0gayAqICh0aGlzLl9fc2Nyb2xsVG9wICsgZml4ZWRUb3ApIC0gZml4ZWRUb3A7XG5cbiAgICAvLyBMaW1pdCB4LWF4aXNcbiAgICBpZiAobGVmdCA+IHRoaXMuX19tYXhTY3JvbGxMZWZ0KSB7XG4gICAgICBsZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgfSBlbHNlIGlmIChsZWZ0IDwgMCkge1xuICAgICAgbGVmdCA9IDA7XG4gICAgfVxuXG4gICAgLy8gTGltaXQgeS1heGlzXG4gICAgaWYgKHRvcCA+IHRoaXMuX19tYXhTY3JvbGxUb3ApIHtcbiAgICAgIHRvcCA9IHRoaXMuX19tYXhTY3JvbGxUb3A7XG4gICAgfSBlbHNlIGlmICh0b3AgPCAwKSB7XG4gICAgICB0b3AgPSAwO1xuICAgIH1cblxuICAgIC8vIFB1c2ggdmFsdWVzIG91dFxuICAgIHRoaXMuX19wdWJsaXNoKGxlZnQsIHRvcCwgbGV2ZWwsIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogWm9vbXMgdGhlIGNvbnRlbnQgYnkgdGhlIGdpdmVuIGZhY3Rvci5cbiAgICpcbiAgICogQHBhcmFtIGZhY3RvciB7TnVtYmVyfSBab29tIGJ5IGdpdmVuIGZhY3RvclxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIHVzZSBhbmltYXRpb25cbiAgICogQHBhcmFtIG9yaWdpbkxlZnQge051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gbGVmdCBjb29yZGluYXRlXG4gICAqIEBwYXJhbSBvcmlnaW5Ub3Age051bWJlciA/IDB9IFpvb20gaW4gYXQgZ2l2ZW4gdG9wIGNvb3JkaW5hdGVcbiAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbiA/IG51bGx9IEEgY2FsbGJhY2sgdGhhdCBnZXRzIGZpcmVkIHdoZW4gdGhlIHpvb20gaXMgY29tcGxldGUuXG4gICAqL1xuICB6b29tQnkoZmFjdG9yLCBpc0FuaW1hdGVkLCBvcmlnaW5MZWZ0LCBvcmlnaW5Ub3AsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGZhY3RvciwgaXNBbmltYXRlZCwgb3JpZ2luTGVmdCwgb3JpZ2luVG9wLCBjYWxsYmFjayk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBTY3JvbGxzIHRvIHRoZSBnaXZlbiBwb3NpdGlvbi4gUmVzcGVjdCBsaW1pdGF0aW9ucyBhbmQgc25hcHBpbmcgYXV0b21hdGljYWxseS5cbiAgICpcbiAgICogQHBhcmFtIGxlZnQge051bWJlcj9udWxsfSBIb3Jpem9udGFsIHNjcm9sbCBwb3NpdGlvbiwga2VlcHMgY3VycmVudCBpZiB2YWx1ZSBpcyA8Y29kZT5udWxsPC9jb2RlPlxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXI/bnVsbH0gVmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uLCBrZWVwcyBjdXJyZW50IGlmIHZhbHVlIGlzIDxjb2RlPm51bGw8L2NvZGU+XG4gICAqIEBwYXJhbSBpc0FuaW1hdGVkIHtCb29sZWFuP2ZhbHNlfSBXaGV0aGVyIHRoZSBzY3JvbGxpbmcgc2hvdWxkIGhhcHBlbiB1c2luZyBhbiBhbmltYXRpb25cbiAgICogQHBhcmFtIHpvb20ge051bWJlcn0gWzEuMF0gWm9vbSBsZXZlbCB0byBnbyB0b1xuICAgKi9cbiAgc2Nyb2xsVG8obGVmdCwgdG9wLCBpc0FuaW1hdGVkLCB6b29tKSB7XG4gICAgLy8gU3RvcCBkZWNlbGVyYXRpb25cbiAgICBpZiAodGhpcy5fX2lzRGVjZWxlcmF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzRGVjZWxlcmF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGZhbHNlO1xuICAgIH1cblxuICAgIC8vIENvcnJlY3QgY29vcmRpbmF0ZXMgYmFzZWQgb24gbmV3IHpvb20gbGV2ZWxcbiAgICBpZiAoem9vbSAhPT0gdW5kZWZpbmVkICYmIHpvb20gIT09IHRoaXMuX196b29tTGV2ZWwpIHtcbiAgICAgIGlmICghdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiWm9vbWluZyBpcyBub3QgZW5hYmxlZCFcIik7XG4gICAgICB9XG5cbiAgICAgIGxlZnQgKj0gem9vbTtcbiAgICAgIHRvcCAqPSB6b29tO1xuXG4gICAgICAvLyBSZWNvbXB1dGUgbWF4aW11bSB2YWx1ZXMgd2hpbGUgdGVtcG9yYXJ5IHR3ZWFraW5nIG1heGltdW0gc2Nyb2xsIHJhbmdlc1xuICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoem9vbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEtlZXAgem9vbSB3aGVuIG5vdCBkZWZpbmVkXG4gICAgICB6b29tID0gdGhpcy5fX3pvb21MZXZlbDtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdYKSB7XG4gICAgICBsZWZ0ID0gdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGFnaW5nKSB7XG4gICAgICAgIGxlZnQgPSBNYXRoLnJvdW5kKGxlZnQgLyB0aGlzLl9fY2xpZW50V2lkdGgpICogdGhpcy5fX2NsaWVudFdpZHRoO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc25hcHBpbmcpIHtcbiAgICAgICAgbGVmdCA9IE1hdGgucm91bmQobGVmdCAvIHRoaXMuX19zbmFwV2lkdGgpICogdGhpcy5fX3NuYXBXaWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zY3JvbGxpbmdZKSB7XG4gICAgICB0b3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgICB0b3AgPSBNYXRoLnJvdW5kKHRvcCAvIHRoaXMuX19jbGllbnRIZWlnaHQpICogdGhpcy5fX2NsaWVudEhlaWdodDtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNuYXBwaW5nKSB7XG4gICAgICAgIHRvcCA9IE1hdGgucm91bmQodG9wIC8gdGhpcy5fX3NuYXBIZWlnaHQpICogdGhpcy5fX3NuYXBIZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGltaXQgZm9yIGFsbG93ZWQgcmFuZ2VzXG4gICAgbGVmdCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhTY3JvbGxMZWZ0LCBsZWZ0KSwgMCk7XG4gICAgdG9wID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heFNjcm9sbFRvcCwgdG9wKSwgMCk7XG5cbiAgICAvLyBEb24ndCBhbmltYXRlIHdoZW4gbm8gY2hhbmdlIGRldGVjdGVkLCBzdGlsbCBjYWxsIHB1Ymxpc2ggdG8gbWFrZSBzdXJlXG4gICAgLy8gdGhhdCByZW5kZXJlZCBwb3NpdGlvbiBpcyByZWFsbHkgaW4tc3luYyB3aXRoIGludGVybmFsIGRhdGFcbiAgICBpZiAobGVmdCA9PT0gdGhpcy5fX3Njcm9sbExlZnQgJiYgdG9wID09PSB0aGlzLl9fc2Nyb2xsVG9wKSB7XG4gICAgICBpc0FuaW1hdGVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gUHVibGlzaCBuZXcgdmFsdWVzXG4gICAgdGhpcy5fX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFNjcm9sbCBieSB0aGUgZ2l2ZW4gb2Zmc2V0XG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXIgPyAwfSBTY3JvbGwgeC1heGlzIGJ5IGdpdmVuIG9mZnNldFxuICAgKiBAcGFyYW0gdG9wIHtOdW1iZXIgPyAwfSBTY3JvbGwgeC1heGlzIGJ5IGdpdmVuIG9mZnNldFxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbiA/IGZhbHNlfSBXaGV0aGVyIHRvIGFuaW1hdGUgdGhlIGdpdmVuIGNoYW5nZVxuICAgKi9cbiAgc2Nyb2xsQnkobGVmdCwgdG9wLCBpc0FuaW1hdGVkKSB7XG4gICAgdmFyIHN0YXJ0TGVmdCA9IHRoaXMuX19pc0FuaW1hdGluZyA/IHRoaXMuX19zY2hlZHVsZWRMZWZ0IDogdGhpcy5fX3Njcm9sbExlZnQ7XG4gICAgdmFyIHN0YXJ0VG9wID0gdGhpcy5fX2lzQW5pbWF0aW5nID8gdGhpcy5fX3NjaGVkdWxlZFRvcCA6IHRoaXMuX19zY3JvbGxUb3A7XG5cbiAgICB0aGlzLnNjcm9sbFRvKHN0YXJ0TGVmdCArIChsZWZ0IHx8IDApLCBzdGFydFRvcCArICh0b3AgfHwgMCksIGlzQW5pbWF0ZWQpO1xuICB9XG5cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIEVWRU5UIENBTExCQUNLU1xuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBNb3VzZSB3aGVlbCBoYW5kbGVyIGZvciB6b29taW5nIHN1cHBvcnRcbiAgICovXG4gIGRvTW91c2Vab29tKHdoZWVsRGVsdGEsIHRpbWVTdGFtcCwgcGFnZVgsIHBhZ2VZKSB7XG4gICAgdmFyIGNoYW5nZSA9IHdoZWVsRGVsdGEgPiAwID8gMC45NyA6IDEuMDM7XG5cbiAgICByZXR1cm4gdGhpcy56b29tVG8odGhpcy5fX3pvb21MZXZlbCAqIGNoYW5nZSwgZmFsc2UsIHBhZ2VYIC0gdGhpcy5fX2NsaWVudExlZnQsIHBhZ2VZIC0gdGhpcy5fX2NsaWVudFRvcCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBzdGFydCBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKi9cbiAgZG9Ub3VjaFN0YXJ0KHRvdWNoZXMsIHRpbWVTdGFtcCkge1xuICAgIC8vIEFycmF5LWxpa2UgY2hlY2sgaXMgZW5vdWdoIGhlcmVcbiAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0b3VjaCBsaXN0OiBcIiArIHRvdWNoZXMpO1xuICAgIH1cblxuICAgIGlmICh0aW1lU3RhbXAgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICB0aW1lU3RhbXAgPSB0aW1lU3RhbXAudmFsdWVPZigpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRpbWVTdGFtcCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB0aW1lc3RhbXAgdmFsdWU6IFwiICsgdGltZVN0YW1wKTtcbiAgICB9XG5cbiAgICAvLyBSZXNldCBpbnRlcnJ1cHRlZEFuaW1hdGlvbiBmbGFnXG4gICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcblxuICAgIC8vIFN0b3AgZGVjZWxlcmF0aW9uXG4gICAgaWYgKHRoaXMuX19pc0RlY2VsZXJhdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHRoaXMuX19pc0RlY2VsZXJhdGluZyk7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuX19pbnRlcnJ1cHRlZEFuaW1hdGlvbiA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gU3RvcCBhbmltYXRpb25cbiAgICBpZiAodGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICBhbmltYXRlLnN0b3AodGhpcy5fX2lzQW5pbWF0aW5nKTtcbiAgICAgIHRoaXMuX19pc0FuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5fX2ludGVycnVwdGVkQW5pbWF0aW9uID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBVc2UgY2VudGVyIHBvaW50IHdoZW4gZGVhbGluZyB3aXRoIHR3byBmaW5nZXJzXG4gICAgdmFyIGN1cnJlbnRUb3VjaExlZnQsIGN1cnJlbnRUb3VjaFRvcDtcbiAgICB2YXIgaXNTaW5nbGVUb3VjaCA9IHRvdWNoZXMubGVuZ3RoID09PSAxO1xuICAgIGlmIChpc1NpbmdsZVRvdWNoKSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSBNYXRoLmFicyh0b3VjaGVzWzBdLnBhZ2VYICsgdG91Y2hlc1sxXS5wYWdlWCkgLyAyO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWSArIHRvdWNoZXNbMV0ucGFnZVkpIC8gMjtcbiAgICB9XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIHBvc2l0aW9uc1xuICAgIHRoaXMuX19pbml0aWFsVG91Y2hMZWZ0ID0gY3VycmVudFRvdWNoTGVmdDtcbiAgICB0aGlzLl9faW5pdGlhbFRvdWNoVG9wID0gY3VycmVudFRvdWNoVG9wO1xuXG4gICAgLy8gU3RvcmUgY3VycmVudCB6b29tIGxldmVsXG4gICAgdGhpcy5fX3pvb21MZXZlbFN0YXJ0ID0gdGhpcy5fX3pvb21MZXZlbDtcblxuICAgIC8vIFN0b3JlIGluaXRpYWwgdG91Y2ggcG9zaXRpb25zXG4gICAgdGhpcy5fX2xhc3RUb3VjaExlZnQgPSBjdXJyZW50VG91Y2hMZWZ0O1xuICAgIHRoaXMuX19sYXN0VG91Y2hUb3AgPSBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBTdG9yZSBpbml0aWFsIG1vdmUgdGltZSBzdGFtcFxuICAgIHRoaXMuX19sYXN0VG91Y2hNb3ZlID0gdGltZVN0YW1wO1xuXG4gICAgLy8gUmVzZXQgaW5pdGlhbCBzY2FsZVxuICAgIHRoaXMuX19sYXN0U2NhbGUgPSAxO1xuXG4gICAgLy8gUmVzZXQgbG9ja2luZyBmbGFnc1xuICAgIHRoaXMuX19lbmFibGVTY3JvbGxYID0gIWlzU2luZ2xlVG91Y2ggJiYgdGhpcy5vcHRpb25zLnNjcm9sbGluZ1g7XG4gICAgdGhpcy5fX2VuYWJsZVNjcm9sbFkgPSAhaXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nWTtcblxuICAgIC8vIFJlc2V0IHRyYWNraW5nIGZsYWdcbiAgICB0aGlzLl9faXNUcmFja2luZyA9IHRydWU7XG5cbiAgICAvLyBSZXNldCBkZWNlbGVyYXRpb24gY29tcGxldGUgZmxhZ1xuICAgIHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gICAgLy8gRHJhZ2dpbmcgc3RhcnRzIGRpcmVjdGx5IHdpdGggdHdvIGZpbmdlcnMsIG90aGVyd2lzZSBsYXp5IHdpdGggYW4gb2Zmc2V0XG4gICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSAhaXNTaW5nbGVUb3VjaDtcblxuICAgIC8vIFNvbWUgZmVhdHVyZXMgYXJlIGRpc2FibGVkIGluIG11bHRpIHRvdWNoIHNjZW5hcmlvc1xuICAgIHRoaXMuX19pc1NpbmdsZVRvdWNoID0gaXNTaW5nbGVUb3VjaDtcblxuICAgIC8vIENsZWFyaW5nIGRhdGEgc3RydWN0dXJlXG4gICAgdGhpcy5fX3Bvc2l0aW9ucyA9IFtdO1xuICB9XG5cblxuICAvKipcbiAgICogVG91Y2ggbW92ZSBoYW5kbGVyIGZvciBzY3JvbGxpbmcgc3VwcG9ydFxuICAgKiBAcGFyYW0ge051bWJlcn0gWzEuMF0gc2NhbGUgLSAuLi4uXG4gICAqL1xuICBkb1RvdWNoTW92ZSh0b3VjaGVzLCB0aW1lU3RhbXAsIHNjYWxlKSB7XG4gICAgLy8gQXJyYXktbGlrZSBjaGVjayBpcyBlbm91Z2ggaGVyZVxuICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRvdWNoIGxpc3Q6IFwiICsgdG91Y2hlcyk7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChldmVudCBtaWdodCBiZSBvdXRzaWRlIG9mIGVsZW1lbnQpXG4gICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0LCBjdXJyZW50VG91Y2hUb3A7XG5cbiAgICAvLyBDb21wdXRlIG1vdmUgYmFzZWQgYXJvdW5kIG9mIGNlbnRlciBvZiBmaW5nZXJzXG4gICAgaWYgKHRvdWNoZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICBjdXJyZW50VG91Y2hMZWZ0ID0gTWF0aC5hYnModG91Y2hlc1swXS5wYWdlWCArIHRvdWNoZXNbMV0ucGFnZVgpIC8gMjtcbiAgICAgIGN1cnJlbnRUb3VjaFRvcCA9IE1hdGguYWJzKHRvdWNoZXNbMF0ucGFnZVkgKyB0b3VjaGVzWzFdLnBhZ2VZKSAvIDI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRUb3VjaExlZnQgPSB0b3VjaGVzWzBdLnBhZ2VYO1xuICAgICAgY3VycmVudFRvdWNoVG9wID0gdG91Y2hlc1swXS5wYWdlWTtcbiAgICB9XG5cbiAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcblxuICAgIC8vIEFyZSB3ZSBhbHJlYWR5IGlzIGRyYWdnaW5nIG1vZGU/XG4gICAgaWYgKHRoaXMuX19pc0RyYWdnaW5nKSB7XG4gICAgICAvLyBDb21wdXRlIG1vdmUgZGlzdGFuY2VcbiAgICAgIHZhciBtb3ZlWCA9IGN1cnJlbnRUb3VjaExlZnQgLSB0aGlzLl9fbGFzdFRvdWNoTGVmdDtcbiAgICAgIHZhciBtb3ZlWSA9IGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19sYXN0VG91Y2hUb3A7XG5cbiAgICAgIC8vIFJlYWQgcHJldmlvdXMgc2Nyb2xsIHBvc2l0aW9uIGFuZCB6b29taW5nXG4gICAgICB2YXIgc2Nyb2xsTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0O1xuICAgICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuX19zY3JvbGxUb3A7XG4gICAgICB2YXIgbGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICAvLyBXb3JrIHdpdGggc2NhbGluZ1xuICAgICAgaWYgKHNjYWxlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vcHRpb25zLnpvb21pbmcpIHtcbiAgICAgICAgdmFyIG9sZExldmVsID0gbGV2ZWw7XG5cbiAgICAgICAgLy8gUmVjb21wdXRlIGxldmVsIGJhc2VkIG9uIHByZXZpb3VzIHNjYWxlIGFuZCBuZXcgc2NhbGVcbiAgICAgICAgbGV2ZWwgPSBsZXZlbCAvIHRoaXMuX19sYXN0U2NhbGUgKiBzY2FsZTtcblxuICAgICAgICAvLyBMaW1pdCBsZXZlbCBhY2NvcmRpbmcgdG8gY29uZmlndXJhdGlvblxuICAgICAgICBsZXZlbCA9IE1hdGgubWF4KE1hdGgubWluKGxldmVsLCB0aGlzLm9wdGlvbnMubWF4Wm9vbSksIHRoaXMub3B0aW9ucy5taW5ab29tKTtcblxuICAgICAgICAvLyBPbmx5IGRvIGZ1cnRoZXIgY29tcHV0aW9uIHdoZW4gY2hhbmdlIGhhcHBlbmVkXG4gICAgICAgIGlmIChvbGRMZXZlbCAhPT0gbGV2ZWwpIHtcbiAgICAgICAgICAvLyBDb21wdXRlIHJlbGF0aXZlIGV2ZW50IHBvc2l0aW9uIHRvIGNvbnRhaW5lclxuICAgICAgICAgIHZhciBjdXJyZW50VG91Y2hMZWZ0UmVsID0gY3VycmVudFRvdWNoTGVmdCAtIHRoaXMuX19jbGllbnRMZWZ0O1xuICAgICAgICAgIHZhciBjdXJyZW50VG91Y2hUb3BSZWwgPSBjdXJyZW50VG91Y2hUb3AgLSB0aGlzLl9fY2xpZW50VG9wO1xuXG4gICAgICAgICAgLy8gUmVjb21wdXRlIGxlZnQgYW5kIHRvcCBjb29yZGluYXRlcyBiYXNlZCBvbiBuZXcgem9vbSBsZXZlbFxuICAgICAgICAgIHNjcm9sbExlZnQgPSAoKGN1cnJlbnRUb3VjaExlZnRSZWwgKyBzY3JvbGxMZWZ0KSAqIGxldmVsIC8gb2xkTGV2ZWwpIC0gY3VycmVudFRvdWNoTGVmdFJlbDtcbiAgICAgICAgICBzY3JvbGxUb3AgPSAoKGN1cnJlbnRUb3VjaFRvcFJlbCArIHNjcm9sbFRvcCkgKiBsZXZlbCAvIG9sZExldmVsKSAtIGN1cnJlbnRUb3VjaFRvcFJlbDtcblxuICAgICAgICAgIC8vIFJlY29tcHV0ZSBtYXggc2Nyb2xsIHZhbHVlc1xuICAgICAgICAgIHRoaXMuX19jb21wdXRlU2Nyb2xsTWF4KGxldmVsKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fX2VuYWJsZVNjcm9sbFgpIHtcbiAgICAgICAgc2Nyb2xsTGVmdCAtPSBtb3ZlWCAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXI7XG4gICAgICAgIHZhciBtYXhTY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG5cbiAgICAgICAgaWYgKHNjcm9sbExlZnQgPiBtYXhTY3JvbGxMZWZ0IHx8IHNjcm9sbExlZnQgPCAwKSB7XG4gICAgICAgICAgLy8gU2xvdyBkb3duIG9uIHRoZSBlZGdlc1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYm91bmNpbmcpIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgKz0gKG1vdmVYIC8gMiAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsTGVmdCA+IG1heFNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgIHNjcm9sbExlZnQgPSBtYXhTY3JvbGxMZWZ0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzY3JvbGxMZWZ0ID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ29tcHV0ZSBuZXcgdmVydGljYWwgc2Nyb2xsIHBvc2l0aW9uXG4gICAgICBpZiAodGhpcy5fX2VuYWJsZVNjcm9sbFkpIHtcbiAgICAgICAgc2Nyb2xsVG9wIC09IG1vdmVZICogdGhpcy5vcHRpb25zLnNwZWVkTXVsdGlwbGllcjtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW92ZVkpXG4gICAgICAgIHZhciBtYXhTY3JvbGxUb3AgPSB0aGlzLl9fbWF4U2Nyb2xsVG9wO1xuXG4gICAgICAgIGlmIChzY3JvbGxUb3AgPiBtYXhTY3JvbGxUb3AgfHwgc2Nyb2xsVG9wIDwgMCkge1xuICAgICAgICAgIC8vIFNsb3cgZG93biBvbiB0aGUgZWRnZXNcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgKz0gKG1vdmVZIC8gMiAqIHRoaXMub3B0aW9ucy5zcGVlZE11bHRpcGxpZXIpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gbWF4U2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICBzY3JvbGxUb3AgPSBtYXhTY3JvbGxUb3A7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEtlZXAgbGlzdCBmcm9tIGdyb3dpbmcgaW5maW5pdGVseSAoaG9sZGluZyBtaW4gMTAsIG1heCAyMCBtZWFzdXJlIHBvaW50cylcbiAgICAgIGlmIChwb3NpdGlvbnMubGVuZ3RoID4gNjApIHtcbiAgICAgICAgcG9zaXRpb25zLnNwbGljZSgwLCAzMCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRyYWNrIHNjcm9sbCBtb3ZlbWVudCBmb3IgZGVjbGVyYXRpb25cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgdGltZVN0YW1wKTtcblxuICAgICAgLy8gU3luYyBzY3JvbGwgcG9zaXRpb25cbiAgICAgIHRoaXMuX19wdWJsaXNoKHNjcm9sbExlZnQsIHNjcm9sbFRvcCwgbGV2ZWwpO1xuXG4gICAgICAvLyBPdGhlcndpc2UgZmlndXJlIG91dCB3aGV0aGVyIHdlIGFyZSBzd2l0Y2hpbmcgaW50byBkcmFnZ2luZyBtb2RlIG5vdy5cbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG1pbmltdW1UcmFja2luZ0ZvclNjcm9sbCA9IHRoaXMub3B0aW9ucy5sb2NraW5nID8gMyA6IDA7XG4gICAgICB2YXIgbWluaW11bVRyYWNraW5nRm9yRHJhZyA9IDU7XG5cbiAgICAgIHZhciBkaXN0YW5jZVggPSBNYXRoLmFicyhjdXJyZW50VG91Y2hMZWZ0IC0gdGhpcy5fX2luaXRpYWxUb3VjaExlZnQpO1xuICAgICAgdmFyIGRpc3RhbmNlWSA9IE1hdGguYWJzKGN1cnJlbnRUb3VjaFRvcCAtIHRoaXMuX19pbml0aWFsVG91Y2hUb3ApO1xuXG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWCA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdYICYmIGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG4gICAgICB0aGlzLl9fZW5hYmxlU2Nyb2xsWSA9IHRoaXMub3B0aW9ucy5zY3JvbGxpbmdZICYmIGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JTY3JvbGw7XG5cbiAgICAgIHBvc2l0aW9ucy5wdXNoKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aW1lU3RhbXApO1xuXG4gICAgICB0aGlzLl9faXNEcmFnZ2luZyA9ICh0aGlzLl9fZW5hYmxlU2Nyb2xsWCB8fCB0aGlzLl9fZW5hYmxlU2Nyb2xsWSkgJiYgKGRpc3RhbmNlWCA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnIHx8IGRpc3RhbmNlWSA+PSBtaW5pbXVtVHJhY2tpbmdGb3JEcmFnKTtcbiAgICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgICB0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBVcGRhdGUgbGFzdCB0b3VjaCBwb3NpdGlvbnMgYW5kIHRpbWUgc3RhbXAgZm9yIG5leHQgZXZlbnRcbiAgICB0aGlzLl9fbGFzdFRvdWNoTGVmdCA9IGN1cnJlbnRUb3VjaExlZnQ7XG4gICAgdGhpcy5fX2xhc3RUb3VjaFRvcCA9IGN1cnJlbnRUb3VjaFRvcDtcbiAgICB0aGlzLl9fbGFzdFRvdWNoTW92ZSA9IHRpbWVTdGFtcDtcbiAgICB0aGlzLl9fbGFzdFNjYWxlID0gc2NhbGU7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUb3VjaCBlbmQgaGFuZGxlciBmb3Igc2Nyb2xsaW5nIHN1cHBvcnRcbiAgICovXG4gIGRvVG91Y2hFbmQodGltZVN0YW1wKSB7XG4gICAgaWYgKHRpbWVTdGFtcCBpbnN0YW5jZW9mIERhdGUpIHtcbiAgICAgIHRpbWVTdGFtcCA9IHRpbWVTdGFtcC52YWx1ZU9mKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGltZVN0YW1wICE9PSBcIm51bWJlclwiKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHRpbWVzdGFtcCB2YWx1ZTogXCIgKyB0aW1lU3RhbXApO1xuICAgIH1cblxuICAgIC8vIElnbm9yZSBldmVudCB3aGVuIHRyYWNraW5nIGlzIG5vdCBlbmFibGVkIChubyB0b3VjaHN0YXJ0IGV2ZW50IG9uIGVsZW1lbnQpXG4gICAgLy8gVGhpcyBpcyByZXF1aXJlZCBhcyB0aGlzIGxpc3RlbmVyICgndG91Y2htb3ZlJykgc2l0cyBvbiB0aGUgZG9jdW1lbnQgYW5kIG5vdCBvbiB0aGUgZWxlbWVudCBpdHNlbGYuXG4gICAgaWYgKCF0aGlzLl9faXNUcmFja2luZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIE5vdCB0b3VjaGluZyBhbnltb3JlICh3aGVuIHR3byBmaW5nZXIgaGl0IHRoZSBzY3JlZW4gdGhlcmUgYXJlIHR3byB0b3VjaCBlbmQgZXZlbnRzKVxuICAgIHRoaXMuX19pc1RyYWNraW5nID0gZmFsc2U7XG5cbiAgICAvLyBCZSBzdXJlIHRvIHJlc2V0IHRoZSBkcmFnZ2luZyBmbGFnIG5vdy4gSGVyZSB3ZSBhbHNvIGRldGVjdCB3aGV0aGVyXG4gICAgLy8gdGhlIGZpbmdlciBoYXMgbW92ZWQgZmFzdCBlbm91Z2ggdG8gc3dpdGNoIGludG8gYSBkZWNlbGVyYXRpb24gYW5pbWF0aW9uLlxuICAgIGlmICh0aGlzLl9faXNEcmFnZ2luZykge1xuICAgICAgLy8gUmVzZXQgZHJhZ2dpbmcgZmxhZ1xuICAgICAgdGhpcy5fX2lzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gU3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgbGFzdCBtb3ZlIGRldGVjdGVkIHdhcyBpbiBzb21lIHJlbGV2YW50IHRpbWUgZnJhbWVcbiAgICAgIGlmICh0aGlzLl9faXNTaW5nbGVUb3VjaCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nICYmICh0aW1lU3RhbXAgLSB0aGlzLl9fbGFzdFRvdWNoTW92ZSkgPD0gMTAwKSB7XG4gICAgICAgIC8vIFRoZW4gZmlndXJlIG91dCB3aGF0IHRoZSBzY3JvbGwgcG9zaXRpb24gd2FzIGFib3V0IDEwMG1zIGFnb1xuICAgICAgICB2YXIgcG9zaXRpb25zID0gdGhpcy5fX3Bvc2l0aW9ucztcbiAgICAgICAgdmFyIGVuZFBvcyA9IHBvc2l0aW9ucy5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgc3RhcnRQb3MgPSBlbmRQb3M7XG5cbiAgICAgICAgLy8gTW92ZSBwb2ludGVyIHRvIHBvc2l0aW9uIG1lYXN1cmVkIDEwMG1zIGFnb1xuICAgICAgICBmb3IgKHZhciBpID0gZW5kUG9zOyBpID4gMCAmJiBwb3NpdGlvbnNbaV0gPiAodGhpcy5fX2xhc3RUb3VjaE1vdmUgLSAxMDApOyBpIC09IDMpIHtcbiAgICAgICAgICBzdGFydFBvcyA9IGk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBzdGFydCBhbmQgc3RvcCBwb3NpdGlvbiBpcyBpZGVudGljYWwgaW4gYSAxMDBtcyB0aW1lZnJhbWUsXG4gICAgICAgIC8vIHdlIGNhbm5vdCBjb21wdXRlIGFueSB1c2VmdWwgZGVjZWxlcmF0aW9uLlxuICAgICAgICBpZiAoc3RhcnRQb3MgIT09IGVuZFBvcykge1xuICAgICAgICAgIC8vIENvbXB1dGUgcmVsYXRpdmUgbW92ZW1lbnQgYmV0d2VlbiB0aGVzZSB0d28gcG9pbnRzXG4gICAgICAgICAgdmFyIHRpbWVPZmZzZXQgPSBwb3NpdGlvbnNbZW5kUG9zXSAtIHBvc2l0aW9uc1tzdGFydFBvc107XG4gICAgICAgICAgdmFyIG1vdmVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0IC0gcG9zaXRpb25zW3N0YXJ0UG9zIC0gMl07XG4gICAgICAgICAgdmFyIG1vdmVkVG9wID0gdGhpcy5fX3Njcm9sbFRvcCAtIHBvc2l0aW9uc1tzdGFydFBvcyAtIDFdO1xuXG4gICAgICAgICAgLy8gQmFzZWQgb24gNTBtcyBjb21wdXRlIHRoZSBtb3ZlbWVudCB0byBhcHBseSBmb3IgZWFjaCByZW5kZXIgc3RlcFxuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPSBtb3ZlZExlZnQgLyB0aW1lT2Zmc2V0ICogKDEwMDAgLyA2MCk7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IG1vdmVkVG9wIC8gdGltZU9mZnNldCAqICgxMDAwIC8gNjApO1xuXG4gICAgICAgICAgLy8gSG93IG11Y2ggdmVsb2NpdHkgaXMgcmVxdWlyZWQgdG8gc3RhcnQgdGhlIGRlY2VsZXJhdGlvblxuICAgICAgICAgIHZhciBtaW5WZWxvY2l0eVRvU3RhcnREZWNlbGVyYXRpb24gPSB0aGlzLm9wdGlvbnMucGFnaW5nIHx8IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAxO1xuXG4gICAgICAgICAgLy8gVmVyaWZ5IHRoYXQgd2UgaGF2ZSBlbm91Z2ggdmVsb2NpdHkgdG8gc3RhcnQgZGVjZWxlcmF0aW9uXG4gICAgICAgICAgaWYgKE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVgpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uIHx8IE1hdGguYWJzKHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkpID4gbWluVmVsb2NpdHlUb1N0YXJ0RGVjZWxlcmF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLl9fc3RhcnREZWNlbGVyYXRpb24odGltZVN0YW1wKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoKHRpbWVTdGFtcCAtIHRoaXMuX19sYXN0VG91Y2hNb3ZlKSA+IDEwMCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMuc2Nyb2xsaW5nQ29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIHdhcyBhIHNsb3dlciBtb3ZlIGl0IGlzIHBlciBkZWZhdWx0IG5vbiBkZWNlbGVyYXRlZCwgYnV0IHRoaXNcbiAgICAvLyBzdGlsbCBtZWFucyB0aGF0IHdlIHdhbnQgc25hcCBiYWNrIHRvIHRoZSBib3VuZHMgd2hpY2ggaXMgZG9uZSBoZXJlLlxuICAgIC8vIFRoaXMgaXMgcGxhY2VkIG91dHNpZGUgdGhlIGNvbmRpdGlvbiBhYm92ZSB0byBpbXByb3ZlIGVkZ2UgY2FzZSBzdGFiaWxpdHlcbiAgICAvLyBlLmcuIHRvdWNoZW5kIGZpcmVkIHdpdGhvdXQgZW5hYmxlZCBkcmFnZ2luZy4gVGhpcyBzaG91bGQgbm9ybWFsbHkgZG8gbm90XG4gICAgLy8gaGF2ZSBtb2RpZmllZCB0aGUgc2Nyb2xsIHBvc2l0aW9ucyBvciBldmVuIHNob3dlZCB0aGUgc2Nyb2xsYmFycyB0aG91Z2guXG4gICAgaWYgKCF0aGlzLl9faXNEZWNlbGVyYXRpbmcpIHtcbiAgICAgIGlmICh0aGlzLl9faW50ZXJydXB0ZWRBbmltYXRpb24gfHwgdGhpcy5fX2lzRHJhZ2dpbmcpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG4gICAgICB0aGlzLnNjcm9sbFRvKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0cnVlLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9XG5cbiAgICAvLyBGdWxseSBjbGVhbnVwIGxpc3RcbiAgICB0aGlzLl9fcG9zaXRpb25zLmxlbmd0aCA9IDA7XG4gIH1cblxuICAvKlxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIFBSSVZBVEUgQVBJXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICovXG5cbiAgLyoqXG4gICAqIEFwcGxpZXMgdGhlIHNjcm9sbCBwb3NpdGlvbiB0byB0aGUgY29udGVudCBlbGVtZW50XG4gICAqXG4gICAqIEBwYXJhbSBsZWZ0IHtOdW1iZXJ9IExlZnQgc2Nyb2xsIHBvc2l0aW9uXG4gICAqIEBwYXJhbSB0b3Age051bWJlcn0gVG9wIHNjcm9sbCBwb3NpdGlvblxuICAgKiBAcGFyYW0gaXNBbmltYXRlZCB7Qm9vbGVhbj9mYWxzZX0gV2hldGhlciBhbmltYXRpb24gc2hvdWxkIGJlIHVzZWQgdG8gbW92ZSB0byB0aGUgbmV3IGNvb3JkaW5hdGVzXG4gICAqL1xuICBfX3B1Ymxpc2gobGVmdCwgdG9wLCB6b29tLCBpc0FuaW1hdGVkKSB7XG4gICAgLy8gUmVtZW1iZXIgd2hldGhlciB3ZSBoYWQgYW4gYW5pbWF0aW9uLCB0aGVuIHdlIHRyeSB0byBjb250aW51ZVxuICAgIC8vIGJhc2VkIG9uIHRoZSBjdXJyZW50IFwiZHJpdmVcIiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgIHZhciB3YXNBbmltYXRpbmcgPSB0aGlzLl9faXNBbmltYXRpbmc7XG4gICAgaWYgKHdhc0FuaW1hdGluZykge1xuICAgICAgYW5pbWF0ZS5zdG9wKHdhc0FuaW1hdGluZyk7XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoaXNBbmltYXRlZCAmJiB0aGlzLm9wdGlvbnMuYW5pbWF0aW5nKSB7XG4gICAgICAvLyBLZWVwIHNjaGVkdWxlZCBwb3NpdGlvbnMgZm9yIHNjcm9sbEJ5L3pvb21CeSBmdW5jdGlvbmFsaXR5LlxuICAgICAgdGhpcy5fX3NjaGVkdWxlZExlZnQgPSBsZWZ0O1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFRvcCA9IHRvcDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRab29tID0gem9vbTtcblxuICAgICAgdmFyIG9sZExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdDtcbiAgICAgIHZhciBvbGRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wO1xuICAgICAgdmFyIG9sZFpvb20gPSB0aGlzLl9fem9vbUxldmVsO1xuXG4gICAgICB2YXIgZGlmZkxlZnQgPSBsZWZ0IC0gb2xkTGVmdDtcbiAgICAgIHZhciBkaWZmVG9wID0gdG9wIC0gb2xkVG9wO1xuICAgICAgdmFyIGRpZmZab29tID0gem9vbSAtIG9sZFpvb207XG5cbiAgICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICAgIGlmIChyZW5kZXIpIHtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsTGVmdCA9IG9sZExlZnQgKyAoZGlmZkxlZnQgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fc2Nyb2xsVG9wID0gb2xkVG9wICsgKGRpZmZUb3AgKiBwZXJjZW50KTtcbiAgICAgICAgICB0aGlzLl9fem9vbUxldmVsID0gb2xkWm9vbSArIChkaWZmWm9vbSAqIHBlcmNlbnQpO1xuXG4gICAgICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICAgICAgaWYgKHRoaXMuX19jYWxsYmFjaykge1xuICAgICAgICAgICAgdGhpcy5fX2NhbGxiYWNrKHRoaXMuX19zY3JvbGxMZWZ0LCB0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIHZlcmlmeSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2lzQW5pbWF0aW5nID09PSBpZDtcbiAgICAgIH0uYmluZCh0aGlzKTtcblxuICAgICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICAgIGlmIChhbmltYXRpb25JZCA9PT0gdGhpcy5fX2lzQW5pbWF0aW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2lzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSB8fCB3YXNGaW5pc2hlZCkge1xuICAgICAgICAgIHRoaXMub3B0aW9ucy5zY3JvbGxpbmdDb21wbGV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy56b29taW5nKSB7XG4gICAgICAgICAgdGhpcy5fX2NvbXB1dGVTY3JvbGxNYXgoKTtcbiAgICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSgpO1xuICAgICAgICAgICAgdGhpcy5fX3pvb21Db21wbGV0ZSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAgIC8vIFdoZW4gY29udGludWluZyBiYXNlZCBvbiBwcmV2aW91cyBhbmltYXRpb24gd2UgY2hvb3NlIGFuIGVhc2Utb3V0IGFuaW1hdGlvbiBpbnN0ZWFkIG9mIGVhc2UtaW4tb3V0XG4gICAgICB0aGlzLl9faXNBbmltYXRpbmcgPSBhbmltYXRlLnN0YXJ0KHN0ZXAsIHZlcmlmeSwgY29tcGxldGVkLCB0aGlzLm9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb24sIHdhc0FuaW1hdGluZyA/IGVhc2VPdXRDdWJpYyA6IGVhc2VJbk91dEN1YmljKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fc2NoZWR1bGVkTGVmdCA9IHRoaXMuX19zY3JvbGxMZWZ0ID0gbGVmdDtcbiAgICAgIHRoaXMuX19zY2hlZHVsZWRUb3AgPSB0aGlzLl9fc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgdGhpcy5fX3NjaGVkdWxlZFpvb20gPSB0aGlzLl9fem9vbUxldmVsID0gem9vbTtcblxuICAgICAgLy8gUHVzaCB2YWx1ZXMgb3V0XG4gICAgICBpZiAodGhpcy5fX2NhbGxiYWNrKSB7XG4gICAgICAgIHRoaXMuX19jYWxsYmFjayhsZWZ0LCB0b3AsIHpvb20pO1xuICAgICAgfVxuXG4gICAgICAvLyBGaXggbWF4IHNjcm9sbCByYW5nZXNcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuem9vbWluZykge1xuICAgICAgICB0aGlzLl9fY29tcHV0ZVNjcm9sbE1heCgpO1xuICAgICAgICBpZiAodGhpcy5fX3pvb21Db21wbGV0ZSkge1xuICAgICAgICAgIHRoaXMuX196b29tQ29tcGxldGUoKTtcbiAgICAgICAgICB0aGlzLl9fem9vbUNvbXBsZXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlY29tcHV0ZXMgc2Nyb2xsIG1pbmltdW0gdmFsdWVzIGJhc2VkIG9uIGNsaWVudCBkaW1lbnNpb25zIGFuZCBjb250ZW50IGRpbWVuc2lvbnMuXG4gICAqL1xuICBfX2NvbXB1dGVTY3JvbGxNYXgoem9vbUxldmVsKSB7XG4gICAgaWYgKHpvb21MZXZlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB6b29tTGV2ZWwgPSB0aGlzLl9fem9vbUxldmVsO1xuICAgIH1cblxuICAgIHRoaXMuX19tYXhTY3JvbGxMZWZ0ID0gTWF0aC5tYXgodGhpcy5fX2NvbnRlbnRXaWR0aCAqIHpvb21MZXZlbCAtIHRoaXMuX19jbGllbnRXaWR0aCwgMCk7XG4gICAgdGhpcy5fX21heFNjcm9sbFRvcCA9IE1hdGgubWF4KHRoaXMuX19jb250ZW50SGVpZ2h0ICogem9vbUxldmVsIC0gdGhpcy5fX2NsaWVudEhlaWdodCwgMCk7XG4gIH1cblxuXG5cbiAgLypcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBBTklNQVRJT04gKERFQ0VMRVJBVElPTikgU1VQUE9SVFxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAqL1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiBhIHRvdWNoIHNlcXVlbmNlIGVuZCBhbmQgdGhlIHNwZWVkIG9mIHRoZSBmaW5nZXIgd2FzIGhpZ2ggZW5vdWdoXG4gICAqIHRvIHN3aXRjaCBpbnRvIGRlY2VsZXJhdGlvbiBtb2RlLlxuICAgKi9cbiAgX19zdGFydERlY2VsZXJhdGlvbih0aW1lU3RhbXApIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnBhZ2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnQgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsTGVmdCwgdGhpcy5fX21heFNjcm9sbExlZnQpLCAwKTtcbiAgICAgIHZhciBzY3JvbGxUb3AgPSBNYXRoLm1heChNYXRoLm1pbih0aGlzLl9fc2Nyb2xsVG9wLCB0aGlzLl9fbWF4U2Nyb2xsVG9wKSwgMCk7XG4gICAgICB2YXIgY2xpZW50V2lkdGggPSB0aGlzLl9fY2xpZW50V2lkdGg7XG4gICAgICB2YXIgY2xpZW50SGVpZ2h0ID0gdGhpcy5fX2NsaWVudEhlaWdodDtcblxuICAgICAgLy8gV2UgbGltaXQgZGVjZWxlcmF0aW9uIG5vdCB0byB0aGUgbWluL21heCB2YWx1ZXMgb2YgdGhlIGFsbG93ZWQgcmFuZ2UsIGJ1dCB0byB0aGUgc2l6ZSBvZiB0aGUgdmlzaWJsZSBjbGllbnQgYXJlYS5cbiAgICAgIC8vIEVhY2ggcGFnZSBzaG91bGQgaGF2ZSBleGFjdGx5IHRoZSBzaXplIG9mIHRoZSBjbGllbnQgYXJlYS5cbiAgICAgIHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gTWF0aC5mbG9vcihzY3JvbGxMZWZ0IC8gY2xpZW50V2lkdGgpICogY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gTWF0aC5mbG9vcihzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQgPSBNYXRoLmNlaWwoc2Nyb2xsTGVmdCAvIGNsaWVudFdpZHRoKSAqIGNsaWVudFdpZHRoO1xuICAgICAgdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCA9IE1hdGguY2VpbChzY3JvbGxUb3AgLyBjbGllbnRIZWlnaHQpICogY2xpZW50SGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCA9IDA7XG4gICAgICB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gMDtcbiAgICAgIHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0ID0gdGhpcy5fX21heFNjcm9sbExlZnQ7XG4gICAgICB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsVG9wID0gdGhpcy5fX21heFNjcm9sbFRvcDtcbiAgICB9XG5cbiAgICAvLyBXcmFwIGNsYXNzIG1ldGhvZFxuICAgIHZhciBzdGVwID0gZnVuY3Rpb24gKHBlcmNlbnQsIG5vdywgcmVuZGVyKSB7XG4gICAgICB0aGlzLl9fc3RlcFRocm91Z2hEZWNlbGVyYXRpb24ocmVuZGVyKTtcbiAgICB9LmJpbmQodGhpcyk7XG5cbiAgICAvLyBIb3cgbXVjaCB2ZWxvY2l0eSBpcyByZXF1aXJlZCB0byBrZWVwIHRoZSBkZWNlbGVyYXRpb24gcnVubmluZ1xuICAgIHZhciBtaW5WZWxvY2l0eVRvS2VlcERlY2VsZXJhdGluZyA9IHRoaXMub3B0aW9ucy5zbmFwcGluZyA/IDQgOiAwLjE7XG5cbiAgICAvLyBEZXRlY3Qgd2hldGhlciBpdCdzIHN0aWxsIHdvcnRoIHRvIGNvbnRpbnVlIGFuaW1hdGluZyBzdGVwc1xuICAgIC8vIElmIHdlIGFyZSBhbHJlYWR5IHNsb3cgZW5vdWdoIHRvIG5vdCBiZWluZyB1c2VyIHBlcmNlaXZhYmxlIGFueW1vcmUsIHdlIHN0b3AgdGhlIHdob2xlIHByb2Nlc3MgaGVyZS5cbiAgICB2YXIgdmVyaWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHNob3VsZENvbnRpbnVlID0gTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WCkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmcgfHwgTWF0aC5hYnModGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSkgPj0gbWluVmVsb2NpdHlUb0tlZXBEZWNlbGVyYXRpbmc7XG4gICAgICBpZiAoIXNob3VsZENvbnRpbnVlKSB7XG4gICAgICAgIHRoaXMuX19kaWREZWNlbGVyYXRpb25Db21wbGV0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2hvdWxkQ29udGludWU7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgdmFyIGNvbXBsZXRlZCA9IGZ1bmN0aW9uIChyZW5kZXJlZEZyYW1lc1BlclNlY29uZCwgYW5pbWF0aW9uSWQsIHdhc0ZpbmlzaGVkKSB7XG4gICAgICB0aGlzLl9faXNEZWNlbGVyYXRpbmcgPSBmYWxzZTtcbiAgICAgIGlmICh0aGlzLl9fZGlkRGVjZWxlcmF0aW9uQ29tcGxldGUpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnNjcm9sbGluZ0NvbXBsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFuaW1hdGUgdG8gZ3JpZCB3aGVuIHNuYXBwaW5nIGlzIGFjdGl2ZSwgb3RoZXJ3aXNlIGp1c3QgZml4IG91dC1vZi1ib3VuZGFyeSBwb3NpdGlvbnNcbiAgICAgIHRoaXMuc2Nyb2xsVG8odGhpcy5fX3Njcm9sbExlZnQsIHRoaXMuX19zY3JvbGxUb3AsIHRoaXMub3B0aW9ucy5zbmFwcGluZyk7XG4gICAgfS5iaW5kKHRoaXMpO1xuXG4gICAgLy8gU3RhcnQgYW5pbWF0aW9uIGFuZCBzd2l0Y2ggb24gZmxhZ1xuICAgIHRoaXMuX19pc0RlY2VsZXJhdGluZyA9IGFuaW1hdGUuc3RhcnQoc3RlcCwgdmVyaWZ5LCBjb21wbGV0ZWQpO1xuICB9XG5cblxuICAvKipcbiAgICogQ2FsbGVkIG9uIGV2ZXJ5IHN0ZXAgb2YgdGhlIGFuaW1hdGlvblxuICAgKlxuICAgKiBAcGFyYW0gaW5NZW1vcnkge0Jvb2xlYW4/ZmFsc2V9IFdoZXRoZXIgdG8gbm90IHJlbmRlciB0aGUgY3VycmVudCBzdGVwLCBidXQga2VlcCBpdCBpbiBtZW1vcnkgb25seS4gVXNlZCBpbnRlcm5hbGx5IG9ubHkhXG4gICAqL1xuICBfX3N0ZXBUaHJvdWdoRGVjZWxlcmF0aW9uKHJlbmRlcikge1xuXG4gICAgLy9cbiAgICAvLyBDT01QVVRFIE5FWFQgU0NST0xMIFBPU0lUSU9OXG4gICAgLy9cblxuICAgIC8vIEFkZCBkZWNlbGVyYXRpb24gdG8gc2Nyb2xsIHBvc2l0aW9uXG4gICAgdmFyIHNjcm9sbExlZnQgPSB0aGlzLl9fc2Nyb2xsTGVmdCArIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVg7XG4gICAgdmFyIHNjcm9sbFRvcCA9IHRoaXMuX19zY3JvbGxUb3AgKyB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlZO1xuXG5cbiAgICAvL1xuICAgIC8vIEhBUkQgTElNSVQgU0NST0xMIFBPU0lUSU9OIEZPUiBOT04gQk9VTkNJTkcgTU9ERVxuICAgIC8vXG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5ib3VuY2luZykge1xuICAgICAgdmFyIHNjcm9sbExlZnRGaXhlZCA9IE1hdGgubWF4KE1hdGgubWluKHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxMZWZ0LCBzY3JvbGxMZWZ0KSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQpO1xuICAgICAgaWYgKHNjcm9sbExlZnRGaXhlZCAhPT0gc2Nyb2xsTGVmdCkge1xuICAgICAgICBzY3JvbGxMZWZ0ID0gc2Nyb2xsTGVmdEZpeGVkO1xuICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gMDtcbiAgICAgIH1cblxuICAgICAgdmFyIHNjcm9sbFRvcEZpeGVkID0gTWF0aC5tYXgoTWF0aC5taW4odGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCwgc2Nyb2xsVG9wKSwgdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCk7XG4gICAgICBpZiAoc2Nyb2xsVG9wRml4ZWQgIT09IHNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxUb3AgPSBzY3JvbGxUb3BGaXhlZDtcbiAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICAvL1xuICAgIC8vIFVQREFURSBTQ1JPTEwgUE9TSVRJT05cbiAgICAvL1xuXG4gICAgaWYgKHJlbmRlcikge1xuICAgICAgdGhpcy5fX3B1Ymxpc2goc2Nyb2xsTGVmdCwgc2Nyb2xsVG9wLCB0aGlzLl9fem9vbUxldmVsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fX3Njcm9sbExlZnQgPSBzY3JvbGxMZWZ0O1xuICAgICAgdGhpcy5fX3Njcm9sbFRvcCA9IHNjcm9sbFRvcDtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gU0xPVyBET1dOXG4gICAgLy9cblxuICAgIC8vIFNsb3cgZG93biB2ZWxvY2l0eSBvbiBldmVyeSBpdGVyYXRpb25cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5wYWdpbmcpIHtcbiAgICAgIC8vIFRoaXMgaXMgdGhlIGZhY3RvciBhcHBsaWVkIHRvIGV2ZXJ5IGl0ZXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uXG4gICAgICAvLyB0byBzbG93IGRvd24gdGhlIHByb2Nlc3MuIFRoaXMgc2hvdWxkIGVtdWxhdGUgbmF0dXJhbCBiZWhhdmlvciB3aGVyZVxuICAgICAgLy8gb2JqZWN0cyBzbG93IGRvd24gd2hlbiB0aGUgaW5pdGlhdG9yIG9mIHRoZSBtb3ZlbWVudCBpcyByZW1vdmVkXG4gICAgICB2YXIgZnJpY3Rpb25GYWN0b3IgPSAwLjk1O1xuXG4gICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYICo9IGZyaWN0aW9uRmFjdG9yO1xuICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSAqPSBmcmljdGlvbkZhY3RvcjtcbiAgICB9XG5cblxuICAgIC8vXG4gICAgLy8gQk9VTkNJTkcgU1VQUE9SVFxuICAgIC8vXG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmJvdW5jaW5nKSB7XG4gICAgICB2YXIgc2Nyb2xsT3V0c2lkZVggPSAwO1xuICAgICAgdmFyIHNjcm9sbE91dHNpZGVZID0gMDtcblxuICAgICAgLy8gVGhpcyBjb25maWd1cmVzIHRoZSBhbW91bnQgb2YgY2hhbmdlIGFwcGxpZWQgdG8gZGVjZWxlcmF0aW9uL2FjY2VsZXJhdGlvbiB3aGVuIHJlYWNoaW5nIGJvdW5kYXJpZXNcbiAgICAgIHZhciBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgIHZhciBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbiA9IHRoaXMub3B0aW9ucy5wZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcblxuICAgICAgLy8gQ2hlY2sgbGltaXRzXG4gICAgICBpZiAoc2Nyb2xsTGVmdCA8IHRoaXMuX19taW5EZWNlbGVyYXRpb25TY3JvbGxMZWZ0KSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVYID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbExlZnQgLSBzY3JvbGxMZWZ0O1xuICAgICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbExlZnQpIHtcbiAgICAgICAgc2Nyb2xsT3V0c2lkZVggPSB0aGlzLl9fbWF4RGVjZWxlcmF0aW9uU2Nyb2xsTGVmdCAtIHNjcm9sbExlZnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxUb3AgPCB0aGlzLl9fbWluRGVjZWxlcmF0aW9uU2Nyb2xsVG9wKSB7XG4gICAgICAgIHNjcm9sbE91dHNpZGVZID0gdGhpcy5fX21pbkRlY2VsZXJhdGlvblNjcm9sbFRvcCAtIHNjcm9sbFRvcDtcbiAgICAgIH0gZWxzZSBpZiAoc2Nyb2xsVG9wID4gdGhpcy5fX21heERlY2VsZXJhdGlvblNjcm9sbFRvcCkge1xuICAgICAgICBzY3JvbGxPdXRzaWRlWSA9IHRoaXMuX19tYXhEZWNlbGVyYXRpb25TY3JvbGxUb3AgLSBzY3JvbGxUb3A7XG4gICAgICB9XG5cbiAgICAgIC8vIFNsb3cgZG93biB1bnRpbCBzbG93IGVub3VnaCwgdGhlbiBmbGlwIGJhY2sgdG8gc25hcCBwb3NpdGlvblxuICAgICAgaWYgKHNjcm9sbE91dHNpZGVYICE9PSAwKSB7XG4gICAgICAgIGlmIChzY3JvbGxPdXRzaWRlWCAqIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggPD0gMCkge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVggKz0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkRlY2VsZXJhdGlvbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLl9fZGVjZWxlcmF0aW9uVmVsb2NpdHlYID0gc2Nyb2xsT3V0c2lkZVggKiBwZW5ldHJhdGlvbkFjY2VsZXJhdGlvbjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc2Nyb2xsT3V0c2lkZVkgIT09IDApIHtcbiAgICAgICAgaWYgKHNjcm9sbE91dHNpZGVZICogdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSA8PSAwKSB7XG4gICAgICAgICAgdGhpcy5fX2RlY2VsZXJhdGlvblZlbG9jaXR5WSArPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uRGVjZWxlcmF0aW9uO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX19kZWNlbGVyYXRpb25WZWxvY2l0eVkgPSBzY3JvbGxPdXRzaWRlWSAqIHBlbmV0cmF0aW9uQWNjZWxlcmF0aW9uO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBlbnYgZnJvbSAnLi9lbnYnO1xuaW1wb3J0IEVsZW1lbnQgZnJvbSAnLi9jb21wb25lbnRzL2VsZW1lbnRzJztcbmltcG9ydCBQb29sIGZyb20gJy4vY29tbW9uL3Bvb2wnO1xuaW1wb3J0IFRpbnlFbWl0dGVyIGZyb20gJ3RpbnktZW1pdHRlcic7XG5pbXBvcnQgY29tcHV0ZUxheW91dCBmcm9tICdjc3MtbGF5b3V0JztcbmltcG9ydCB7IGlzQ2xpY2ssIFNUQVRFLCBjbGVhckNhbnZhcywgaXNHYW1lVG91Y2hFdmVudCB9IGZyb20gJy4vY29tbW9uL3V0aWwnO1xuaW1wb3J0IHBhcnNlciBmcm9tICcuL2xpYnMvZmFzdC14bWwtcGFyc2VyL3BhcnNlci5qcyc7XG5pbXBvcnQgQml0TWFwRm9udCBmcm9tICcuL2NvbW1vbi9iaXRNYXBGb250JztcbmltcG9ydCBEZWJ1Z0luZm8gZnJvbSAnLi9jb21tb24vZGVidWdJbmZvJztcbmltcG9ydCBUaWNrZXIgZnJvbSAnLi9jb21tb24vdGlja2VyJztcbmltcG9ydCB7IGNyZWF0ZSwgcmVuZGVyQ2hpbGRyZW4sIGxheW91dENoaWxkcmVuLCByZXBhaW50Q2hpbGRyZW4sIGl0ZXJhdGVUcmVlLCBjbG9uZSwgcmVnaXN0ZXJDb21wb25lbnQgfSBmcm9tICcuL2NvbW1vbi92ZCc7XG5pbXBvcnQgUmVjdCBmcm9tICcuL2NvbW1vbi9yZWN0JztcbmltcG9ydCBpbWFnZU1hbmFnZXIgZnJvbSAnLi9jb21tb24vaW1hZ2VNYW5hZ2VyJztcbmltcG9ydCB7IFZpZXcsIFRleHQsIEltYWdlLCBTY3JvbGxWaWV3LCBCaXRNYXBUZXh0LCBDYW52YXMsIEJ1dHRvbiB9IGZyb20gJy4vY29tcG9uZW50cyc7XG5pbXBvcnQgeyBJU3R5bGUgfSBmcm9tICcuL2NvbXBvbmVudHMvc3R5bGUnO1xuaW1wb3J0IHsgR2FtZVRvdWNoLCBHYW1lVG91Y2hFdmVudCwgQ2FsbGJhY2ssIFRyZWVOb2RlIH0gZnJvbSAnLi90eXBlcy9pbmRleCc7XG5cbi8vIOWFqOWxgOS6i+S7tueuoemBk1xuY29uc3QgRUUgPSBuZXcgVGlueUVtaXR0ZXIuVGlueUVtaXR0ZXIoKTtcbmNvbnN0IGltZ1Bvb2wgPSBuZXcgUG9vbCgnaW1nUG9vbCcpO1xuY29uc3QgYml0TWFwUG9vbCA9IG5ldyBQb29sKCdiaXRNYXBQb29sJyk7XG5jb25zdCBkZWJ1Z0luZm8gPSBuZXcgRGVidWdJbmZvKCk7XG5cbmludGVyZmFjZSBJVmlld1BvcnQge1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElWaWV3UG9ydEJveCB7XG4gIHdpZHRoOiBudW1iZXI7XG4gIGhlaWdodDogbnVtYmVyO1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIEV2ZW50SGFuZGxlckRhdGEge1xuICBoYXNFdmVudEJpbmQ6IGJvb2xlYW47XG4gIHRvdWNoTXNnOiB7XG4gICAgW2tleTogc3RyaW5nXTogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcbiAgfTtcbiAgaGFuZGxlcnM6IHtcbiAgICB0b3VjaFN0YXJ0OiAoZTogTW91c2VFdmVudCB8IEdhbWVUb3VjaEV2ZW50KSA9PiB2b2lkO1xuICAgIHRvdWNoTW92ZTogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaEVuZDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgICB0b3VjaENhbmNlbDogKGU6IE1vdXNlRXZlbnQgfCBHYW1lVG91Y2hFdmVudCkgPT4gdm9pZDtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIElQbHVnaW48VD4ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGluc3RhbGw6IChhcHA6IFQsIC4uLm9wdGlvbnM6IGFueVtdKSA9PiB2b2lkO1xuICB1bmluc3RhbGw/OiAoYXBwOiBULCAuLi5vcHRpb25zOiBhbnlbXSkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiDpu5jorqTmmrTpnLIgTGF5b3V0IOeahOWunuS+i++8jOS9huWcqOafkOS6m+WcuuaZr+S4i++8jOWPr+iDvemcgOimgeWkmuS4qiBMYXlvdXQg5a6e5L6L77yM5Zug5q2kIExheW91dCDnsbvkuZ/mmrTpnLLlh7rljrtcbiAqIGNvbnN0IG15TGF5b3V0ID0gbmV3IExheW91dCh7XG4gKiAgIHN0eWxlOiB7XG4gKiAgICAgIHdpZHRoOiAwLFxuICogICAgICBoZWlnaHQ6IDAsXG4gKiAgIH0sXG4gKiAgbmFtZTogJ215TGF5b3V0TmFtZScsXG4gKiB9KTtcbiAqL1xuY2xhc3MgTGF5b3V0IGV4dGVuZHMgRWxlbWVudCB7XG4gIC8qKlxuICAgKiDlvZPliY0gTGF5b3V0IOeJiOacrO+8jOS4gOiIrOi3n+Wwj+a4uOaIj+aPkuS7tueJiOacrOWvuem9kFxuICAgKi9cbiAgcHVibGljIHZlcnNpb24gPSAnMS4wLjE1JztcblxuICBlbnYgPSBlbnY7XG5cbiAgLyoqXG4gICAqIExheW91dCDmuLLmn5PnmoTnm67moIfnlLvluIPlr7nlupTnmoQgMmQgY29udGV4dFxuICAgKi9cbiAgcHVibGljIHJlbmRlckNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGwgPSBudWxsO1xuICBwdWJsaWMgcmVuZGVycG9ydDogSVZpZXdQb3J0ID0ge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfTtcbiAgcHVibGljIHZpZXdwb3J0OiBJVmlld1BvcnRCb3ggPSB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIHg6IDAsXG4gICAgeTogMCxcbiAgfTtcblxuICAvKipcbiAgICog55S75biD5bC65a+45ZKM5a6e6ZmF6KKr5riy5p+T5Yiw5bGP5bmV55qE54mp55CG5bC65a+45q+UXG4gICAqL1xuICBwdWJsaWMgdmlld3BvcnRTY2FsZSA9IDE7XG4gIC8qKlxuICAgKiDnlKjkuo7moIfor4Z1cGRhdGVWaWV3UG9ydOaWueazleaYr+WQpuiiq+iwg+eUqOi/h+S6hu+8jOi/meWcqOWwj+a4uOaIj+eOr+Wig+mdnuW4uOmHjeimgVxuICAgKi9cbiAgcHVibGljIGhhc1ZpZXdQb3J0U2V0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIOacgOe7iOa4suafk+WIsOWxj+W5leeahOW3puS4iuinkueJqeeQhuWdkOagh1xuICAgKi9cbiAgcHVibGljIHJlYWxMYXlvdXRCb3g6IHtcbiAgICByZWFsWDogbnVtYmVyO1xuICAgIHJlYWxZOiBudW1iZXI7XG4gIH0gPSB7XG4gICAgICByZWFsWDogMCxcbiAgICAgIHJlYWxZOiAwLFxuICAgIH07XG5cbiAgcHVibGljIGJpdE1hcEZvbnRzOiBCaXRNYXBGb250W10gPSBbXTtcbiAgcHVibGljIGVsZUNvdW50ID0gMDtcbiAgcHVibGljIHN0YXRlOiBTVEFURSA9IFNUQVRFLlVOSU5JVDtcblxuICAvKipcbiAgICog55So5LqO5ZyoIHRpY2tlciDnmoTlvqrnjq/ph4zpnaLmoIfor4blvZPliY3luKfmmK/lkKbpnIDopoHph43nu5hcbiAgICog6YeN57uY5LiA6Iis5piv5Zu+54mH5Yqg6L295a6M5oiQ44CB5paH5a2X5L+u5pS5562J5Zy65pmvXG4gICAqL1xuICBwdWJsaWMgaXNOZWVkUmVwYWludCA9IGZhbHNlO1xuICBwdWJsaWMgdGlja2VyOiBUaWNrZXIgPSBuZXcgVGlja2VyKCk7XG4gIHB1YmxpYyB0aWNrZXJGdW5jID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmlzRGlydHkpIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdiZWZvcmVfcmVmbG93JylcbiAgICAgIHRoaXMuZW1pdCgnYmVmb3JlX3JlZmxvdycsICcnKTtcbiAgICAgIHRoaXMucmVmbG93KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzTmVlZFJlcGFpbnQpIHtcbiAgICAgIHRoaXMucmVwYWludCgpO1xuICAgIH1cbiAgfTtcblxuICBwdWJsaWMgc3R5bGVTaGVldDogUmVjb3JkPHN0cmluZywgSVN0eWxlPiA9IHt9XG5cbiAgcHJpdmF0ZSBldmVudEhhbmRsZXJEYXRhOiBFdmVudEhhbmRsZXJEYXRhO1xuXG4gIHByb3RlY3RlZCBhY3RpdmVFbGVtZW50czogRWxlbWVudFtdID0gW107XG5cbiAgY29uc3RydWN0b3Ioe1xuICAgIHN0eWxlLFxuICB9OiB7XG4gICAgc3R5bGU/OiBJU3R5bGU7XG4gICAgbmFtZT86IHN0cmluZztcbiAgfSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHN0eWxlLFxuICAgICAgaWQ6IDAsXG4gICAgfSk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEgPSB7XG4gICAgICBoYXNFdmVudEJpbmQ6IGZhbHNlLFxuICAgICAgdG91Y2hNc2c6IHt9LFxuICAgICAgaGFuZGxlcnM6IHtcbiAgICAgICAgdG91Y2hTdGFydDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoc3RhcnQnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaE1vdmU6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaG1vdmUnKS5iaW5kKHRoaXMpLFxuICAgICAgICB0b3VjaEVuZDogdGhpcy5ldmVudEhhbmRsZXIoJ3RvdWNoZW5kJykuYmluZCh0aGlzKSxcbiAgICAgICAgdG91Y2hDYW5jZWw6IHRoaXMuZXZlbnRIYW5kbGVyKCd0b3VjaGNhbmNlbCcpLmJpbmQodGhpcyksXG4gICAgICB9LFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDlr7nkuo7kuI3kvJrlvbHlk43luIPlsYDnmoTmlLnliqjvvIzmr5TlpoLlm77niYflj6rmmK/mlLnkuKrlnLDlnYDjgIHliqDkuKrog4zmma/oibLkuYvnsbvnmoTmlLnliqjvvIzkvJrop6blj5EgTGF5b3V0IOeahCByZXBhaW50IOaTjeS9nFxuICAgICAqIOinpuWPkeeahOaWueW8j+aYr+e7mSBMYXlvdXQg5oqb5LiqIGByZXBhaW50YCDnmoTkuovku7bvvIzkuLrkuobmgKfog73vvIzmr4/mrKHmjqXmlLbliLAgcmVwYWludCDor7fmsYLkuI3kvJrmiafooYznnJ/mraPnmoTmuLLmn5NcbiAgICAgKiDogIzmmK/miafooYzkuIDkuKrnva7ohI/mk43kvZzvvIx0aWNrZXIg5q+P5LiA5qyh5omn6KGMIHVwZGF0ZSDkvJrmo4Dmn6Xov5nkuKrmoIforrDkvY3vvIzov5vogIzmiafooYznnJ/mraPnmoTph43nu5jmk43kvZxcbiAgICAgKi9cbiAgICB0aGlzLm9uKCdyZXBhaW50JywgKCkgPT4ge1xuICAgICAgdGhpcy5pc05lZWRSZXBhaW50ID0gdHJ1ZTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIOWwhiBUd2VlbiDmjILovb3liLAgTGF5b3V077yM5a+55LqOIFR3ZWVuIOeahOS9v+eUqOWujOWFqOmBteW+qiBUd2Vlbi5qcyDnmoTmlofmoaNcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vdHdlZW5qcy90d2Vlbi5qcy9cbiAgICAgKiDlj6rkuI3ov4flvZMgVHdlZW4g5pS55Yqo5LqG6IqC54K55Lya6Kem5Y+RIHJlcGFpbnTjgIFyZWZsb3cg55qE5bGe5oCn5pe277yMTGF5b3V0IOS8muaJp+ihjOebuOW6lOeahOaTjeS9nFxuICAgICAqIOS4muWKoeS+p+S4jeeUqOaEn+efpeWIsCByZXBhaW50IOWSjCByZWZsb3dcbiAgICAgKi9cbiAgICAvLyB0aGlzLlRXRUVOID0gVFdFRU47XG4gICAgY29uc29sZS5sb2coYFtMYXlvdXRdIHYke3RoaXMudmVyc2lvbn1gKTtcbiAgfVxuXG4gIC8vIOS4juiAgeeJiOacrOWFvOWuuVxuICBnZXQgZGVidWdJbmZvKCkge1xuICAgIGxldCBpbmZvID0gZGVidWdJbmZvLmxvZygpO1xuXG4gICAgaW5mbyArPSBgZWxlbWVudENvdW50OiAke3RoaXMuZWxlQ291bnR9XFxuYDtcblxuICAgIHJldHVybiBpbmZvO1xuICB9XG5cbiAgLyoqXG4gICAqIOabtOaWsOiiq+e7mOWItmNhbnZhc+eahOeql+WPo+S/oeaBr++8jOacrOa4suafk+W8leaTjuW5tuS4jeWFs+W/g+aYr+WQpuS8muWSjOWFtuS7lua4uOaIj+W8leaTjuWFseWQjOS9v+eUqFxuICAgKiDogIzmnKzouqvlj4jpnIDopoHmlK/mjIHkuovku7blpITnkIbvvIzlm6DmraTvvIzlpoLmnpzooqvmuLLmn5PlhoXlrrnmmK/nu5jliLbliLDnprvlsY9jYW52YXPvvIzpnIDopoHlsIbmnIDnu4jnu5jliLblnKjlsY/luZXkuIpcbiAgICog55qE57ud5a+55bC65a+45ZKM5L2N572u5L+h5oGv5pu05paw5Yiw5pys5riy5p+T5byV5pOO44CCXG4gICAqIOWFtuS4re+8jHdpZHRo5Li654mp55CG5YOP57Sg5a695bqm77yMaGVpZ2h05Li654mp55CG5YOP57Sg6auY5bqm77yMeOS4uui3neemu+Wxj+W5leW3puS4iuinkueahOeJqeeQhuWDj+e0oHjlnZDmoIfvvIx55Li66Led56a75bGP5bmV5bem5LiK6KeS55qE54mp55CG5YOP57SgXG4gICAqIHnlnZDmoIdcbiAgICovXG4gIHVwZGF0ZVZpZXdQb3J0KGJveDogSVZpZXdQb3J0Qm94KSB7XG4gICAgdGhpcy52aWV3cG9ydC53aWR0aCA9IGJveC53aWR0aCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQuaGVpZ2h0ID0gYm94LmhlaWdodCB8fCAwO1xuICAgIHRoaXMudmlld3BvcnQueCA9IGJveC54IHx8IDA7XG4gICAgdGhpcy52aWV3cG9ydC55ID0gYm94LnkgfHwgMDtcblxuICAgIHRoaXMucmVhbExheW91dEJveCA9IHtcbiAgICAgIHJlYWxYOiB0aGlzLnZpZXdwb3J0LngsXG4gICAgICByZWFsWTogdGhpcy52aWV3cG9ydC55LFxuICAgIH07XG5cbiAgICB0aGlzLmhhc1ZpZXdQb3J0U2V0ID0gdHJ1ZTtcbiAgfVxuXG4gIGluaXQodGVtcGxhdGU6IHN0cmluZywgc3R5bGU6IFJlY29yZDxzdHJpbmcsIElTdHlsZT4sIGF0dHJWYWx1ZVByb2Nlc3Nvcj86IENhbGxiYWNrKSB7XG4gICAgZGVidWdJbmZvLnN0YXJ0KCdpbml0Jyk7XG5cbiAgICBjb25zdCBlbGVtZW50QXJyYXkgPSB0aGlzLmluc2VydEVsZW1lbnRBcnJheSh0ZW1wbGF0ZSwgc3R5bGUsIGF0dHJWYWx1ZVByb2Nlc3NvciwgdHJ1ZSk7XG5cbiAgICB0aGlzLmFkZChlbGVtZW50QXJyYXlbMF0pO1xuXG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLklOSVRFRDtcblxuICAgIHRoaXMudGlja2VyLmFkZCh0aGlzLnRpY2tlckZ1bmMsIHRydWUpO1xuICAgIHRoaXMudGlja2VyLnN0YXJ0KCk7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdpbml0Jyk7XG4gIH1cblxuICByZWZsb3coaXNGaXJzdCA9IGZhbHNlKSB7XG4gICAgaWYgKCFpc0ZpcnN0KSB7XG4gICAgICBkZWJ1Z0luZm8ucmVzZXQoKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9yZWZsb3cnKTtcbiAgICAvKipcbiAgICAgKiDorqHnrpfluIPlsYDmoJFcbiAgICAgKiDnu4/ov4cgTGF5b3V0IOiuoeeul++8jOiKgueCueagkeW4puS4iuS6hiBsYXlvdXTjgIFsYXN0TGF5b3V044CBc2hvdWxkVXBkYXRlIOW4g+WxgOS/oeaBr1xuICAgICAqIExheW91dOacrOi6q+W5tuS4jeS9nOS4uuW4g+WxgOiuoeeul++8jOWPquaYr+S9nOS4uuiKgueCueagkeeahOWuueWZqFxuICAgICAqL1xuICAgIGRlYnVnSW5mby5zdGFydCgnY29tcHV0ZUxheW91dCcsIHRydWUpO1xuICAgIGNvbXB1dGVMYXlvdXQodGhpcy5jaGlsZHJlblswXSk7XG4gICAgZGVidWdJbmZvLmVuZCgnY29tcHV0ZUxheW91dCcpO1xuXG4gICAgY29uc3Qgcm9vdEVsZSA9IHRoaXMuY2hpbGRyZW5bMF07XG5cbiAgICBpZiAocm9vdEVsZS5zdHlsZS53aWR0aCA9PT0gdW5kZWZpbmVkIHx8IHJvb3RFbGUuc3R5bGUuaGVpZ2h0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1tMYXlvdXRdIFBsZWFzZSBzZXQgd2lkdGggYW5kIGhlaWdodCBwcm9wZXJ0eSBmb3Igcm9vdCBlbGVtZW50Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVycG9ydC53aWR0aCA9IHJvb3RFbGUuc3R5bGUud2lkdGg7XG4gICAgICB0aGlzLnJlbmRlcnBvcnQuaGVpZ2h0ID0gcm9vdEVsZS5zdHlsZS5oZWlnaHQ7XG4gICAgfVxuXG4gICAgLy8g5bCG5biD5bGA5qCR55qE5biD5bGA5L+h5oGv5Yqg5bel6LWL5YC85Yiw5riy5p+T5qCRXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRDaGlsZHJlbicsIHRydWUpO1xuICAgIGxheW91dENoaWxkcmVuKHRoaXMpO1xuICAgIGRlYnVnSW5mby5lbmQoJ2xheW91dENoaWxkcmVuJyk7XG5cbiAgICB0aGlzLnZpZXdwb3J0U2NhbGUgPSB0aGlzLnZpZXdwb3J0LndpZHRoIC8gdGhpcy5yZW5kZXJwb3J0LndpZHRoO1xuXG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICAvLyDpgY3ljoboioLngrnmoJHvvIzkvp3mrKHosIPnlKjoioLngrnnmoTmuLLmn5PmjqXlj6Plrp7njrDmuLLmn5NcbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlbmRlckNoaWxkcmVuJywgdHJ1ZSk7XG4gICAgcmVuZGVyQ2hpbGRyZW4odGhpcy5jaGlsZHJlbiwgdGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgZmFsc2UpO1xuICAgIGRlYnVnSW5mby5lbmQoJ3JlbmRlckNoaWxkcmVuJyk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ3JlcGFpbnQnLCB0cnVlKTtcbiAgICB0aGlzLnJlcGFpbnQoKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdyZXBhaW50Jyk7XG4gICAgdGhpcy5pc0RpcnR5ID0gZmFsc2U7XG5cbiAgICAvLyBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCAoZWxlKSA9PiB7XG4gICAgLy8gICBjb25zb2xlLmxvZyhlbGUucHJvcHMpO1xuICAgIC8vIH0pO1xuXG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X3JlZmxvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIGluaXTpmLbmrrXmoLjlv4Pku4Xku4XmmK/moLnmja54bWzlkoxjc3PliJvlu7rkuoboioLngrnmoJFcbiAgICog6KaB5a6e546w55yf5q2j55qE5riy5p+T77yM6ZyA6KaB6LCD55SoIGxheW91dCDlh73mlbDvvIzkuYvmiYDku6XlsIYgbGF5b3V0IOWNleeLrOaKveixoeS4uuS4gOS4quWHveaVsO+8jOaYr+WboOS4uiBsYXlvdXQg5bqU5b2T5piv5Y+v5Lul6YeN5aSN6LCD55So55qEXG4gICAqIOavlOWmguaUueWPmOS6huS4gOS4quWFg+e0oOeahOWwuuWvuO+8jOWunumZheS4iuiKgueCueagkeaYr+ayoeWPmOeahO+8jOS7heS7heaYr+mcgOimgemHjeaWsOiuoeeul+W4g+WxgO+8jOeEtuWQjua4suafk1xuICAgKiDkuIDkuKrlrozmlbTnmoQgbGF5b3V0IOWIhuaIkOS4i+mdoueahOWHoOatpe+8mlxuICAgKiAxLiDmiafooYznlLvluIPmuIXnkIbvvIzlm6DkuLrluIPlsYDlj5jljJbpobXpnaLpnIDopoHph43nu5jvvIzov5nph4zmsqHmnInlgZrlvojpq5jnuqfnmoTliZTpmaTnrYnmk43kvZzvvIzkuIDlvovmuIXpmaTph43nlLvvvIzlrp7pmYXkuIrmgKfog73lt7Lnu4/lvojlpb1cbiAgICogMi4g6IqC54K55qCR6YO95ZCr5pyJIHN0eWxlIOWxnuaAp++8jGNzcy1sYXlvdXQg6IO95aSf5qC55o2u6L+Z5Lqb5L+h5oGv6K6h566X5Ye65pyA57uI5biD5bGA77yM6K+m5oOF5Y+v6KeBIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL2Nzcy1sYXlvdXRcbiAgICogMy4g57uP6L+HIExheW91dCDorqHnrpfvvIzoioLngrnmoJHluKbkuIrkuoYgbGF5b3V044CBbGFzdExheW91dOOAgXNob3VsZFVwZGF0ZSDluIPlsYDkv6Hmga/vvIzkvYbov5nkupvkv6Hmga/lubbkuI3mmK/og73lpJ/nm7TmjqXnlKjnmoRcbiAgICogICAg5q+U5aaCIGxheW91dC50b3Ag5piv5oyH5Zyo5LiA5Liq54i25a655Zmo5YaF55qEIHRvcO+8jOacgOe7iOimgeWunueOsOa4suafk++8jOWunumZheS4iuimgemAkuW9kuWKoOS4iuWkjeWuueWZqOeahCB0b3BcbiAgICogICAg6L+Z5qC35q+P5qyhIHJlcGFpbnQg55qE5pe25YCZ5Y+q6ZyA6KaB55u05o6l5L2/55So6K6h566X5aW955qE5YC85Y2z5Y+v77yM5LiN6ZyA6KaB5q+P5qyh6YO96YCS5b2S6K6h566XXG4gICAqICAgIOi/meS4gOatpeensOS4uiBsYXlvdXRDaGlsZHJlbu+8jOebrueahOWcqOS6juWwhiBjc3MtbGF5b3V0IOi/m+S4gOatpeWkhOeQhuS4uuWPr+S7pea4suafk+ebtOaOpeeUqOeahOW4g+WxgOS/oeaBr1xuICAgKiA0LiByZW5kZXJDaGlsZHJlbu+8muaJp+ihjOa4suafk1xuICAgKiA1LiBiaW5kRXZlbnRz77ya5omn6KGM5LqL5Lu257uR5a6aXG4gICAqL1xuICAvLyBAdHMtaWdub3JlXG4gIGxheW91dChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgICB0aGlzLnJlbmRlckNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgaWYgKCF0aGlzLmhhc1ZpZXdQb3J0U2V0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdbTGF5b3V0XSBQbGVhc2UgaW52b2tlIG1ldGhvZCBgdXBkYXRlVmlld1BvcnRgIGJlZm9yZSBtZXRob2QgYGxheW91dGAnKTtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dCcpO1xuXG4gICAgdGhpcy5yZWZsb3codHJ1ZSk7XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2xheW91dF9vdGhlcicpO1xuICAgIHRoaXMuYmluZEV2ZW50cygpO1xuXG4gICAgZGVidWdJbmZvLnN0YXJ0KCdsYXlvdXRfb2JzZXJ2ZVN0eWxlQW5kRXZlbnQnLCB0cnVlKTtcbiAgICBpdGVyYXRlVHJlZSh0aGlzLmNoaWxkcmVuWzBdLCBlbGVtZW50ID0+IGVsZW1lbnQub2JzZXJ2ZVN0eWxlQW5kRXZlbnQoKSk7XG4gICAgZGVidWdJbmZvLmVuZCgnbGF5b3V0X29ic2VydmVTdHlsZUFuZEV2ZW50Jyk7XG5cbiAgICB0aGlzLnN0YXRlID0gU1RBVEUuUkVOREVSRUQ7XG5cbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXQnKTtcbiAgICBkZWJ1Z0luZm8uZW5kKCdsYXlvdXRfb3RoZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmiafooYzoioLngrnmlbDnmoTph43nu5jliLbvvIzkuIDoiKzkuJrliqHkvqfml6DpnIDosIPnlKjor6Xmlrnms5VcbiAgICovXG4gIHJlcGFpbnQoKSB7XG4gICAgY2xlYXJDYW52YXModGhpcy5yZW5kZXJDb250ZXh0IGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG5cbiAgICB0aGlzLmlzTmVlZFJlcGFpbnQgPSBmYWxzZTtcbiAgICByZXBhaW50Q2hpbGRyZW4odGhpcy5jaGlsZHJlbik7XG4gIH1cblxuICAvKipcbiAgICog6L+U5Zue5LiA5Liq6IqC54K55Zyo5bGP5bmV5Lit55qE5L2N572u5ZKM5bC65a+45L+h5oGv77yM5YmN5o+Q5piv5q2j56Gu6LCD55SodXBkYXRlVmlld1BvcnTjgIJcbiAgICovXG4gIGdldEVsZW1lbnRWaWV3cG9ydFJlY3QoZWxlbWVudDogRWxlbWVudCkge1xuICAgIGNvbnN0IHsgcmVhbExheW91dEJveCwgdmlld3BvcnRTY2FsZSB9ID0gdGhpcztcbiAgICBjb25zdCB7XG4gICAgICBhYnNvbHV0ZVgsXG4gICAgICBhYnNvbHV0ZVksXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9ID0gZWxlbWVudC5sYXlvdXRCb3g7XG5cbiAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHZpZXdwb3J0U2NhbGUgKyByZWFsTGF5b3V0Qm94LnJlYWxYO1xuICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdmlld3BvcnRTY2FsZSArIHJlYWxMYXlvdXRCb3gucmVhbFk7XG4gICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB2aWV3cG9ydFNjYWxlO1xuICAgIGNvbnN0IHJlYWxIZWlnaHQgPSBoZWlnaHQgKiB2aWV3cG9ydFNjYWxlO1xuXG4gICAgcmV0dXJuIG5ldyBSZWN0KFxuICAgICAgcmVhbFgsXG4gICAgICByZWFsWSxcbiAgICAgIHJlYWxXaWR0aCxcbiAgICAgIHJlYWxIZWlnaHQsXG4gICAgKTtcbiAgfVxuXG4gIGdldENoaWxkQnlQb3ModHJlZTogTGF5b3V0IHwgRWxlbWVudCwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGl0ZW1MaXN0OiAoTGF5b3V0IHwgRWxlbWVudClbXSkge1xuICAgIHRyZWUuY2hpbGRyZW4uZm9yRWFjaCgoZWxlKSA9PiB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGFic29sdXRlWCxcbiAgICAgICAgYWJzb2x1dGVZLFxuICAgICAgICB3aWR0aCxcbiAgICAgICAgaGVpZ2h0LFxuICAgICAgfSA9IGVsZS5sYXlvdXRCb3g7XG4gICAgICBjb25zdCByZWFsWCA9IGFic29sdXRlWCAqIHRoaXMudmlld3BvcnRTY2FsZSArIHRoaXMucmVhbExheW91dEJveC5yZWFsWDtcbiAgICAgIGNvbnN0IHJlYWxZID0gYWJzb2x1dGVZICogdGhpcy52aWV3cG9ydFNjYWxlICsgdGhpcy5yZWFsTGF5b3V0Qm94LnJlYWxZO1xuICAgICAgY29uc3QgcmVhbFdpZHRoID0gd2lkdGggKiB0aGlzLnZpZXdwb3J0U2NhbGU7XG4gICAgICBjb25zdCByZWFsSGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy52aWV3cG9ydFNjYWxlO1xuXG4gICAgICBpZiAoKHJlYWxYIDw9IHggJiYgeCA8PSByZWFsWCArIHJlYWxXaWR0aCkgJiYgKHJlYWxZIDw9IHkgJiYgeSA8PSByZWFsWSArIHJlYWxIZWlnaHQpKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDnm7jlhbNpc3N1Ze+8mmh0dHBzOi8vZ2l0aHViLmNvbS93ZWNoYXQtbWluaXByb2dyYW0vbWluaWdhbWUtY2FudmFzLWVuZ2luZS9pc3N1ZXMvMTdcbiAgICAgICAgICog6L+Z6YeM5Y+q6KaB5ruh6Laz5p2h5Lu255qE6YO96KaB6K6w5b2V77yM5ZCm5YiZ5Y+v6IO95Ye6546wIGlzc3VlIOmHjOmdouaPkOWIsOeahOmXrumimFxuICAgICAgICAgKi9cbiAgICAgICAgaXRlbUxpc3QucHVzaChlbGUpO1xuICAgICAgICBpZiAoZWxlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMuZ2V0Q2hpbGRCeVBvcyhlbGUsIHgsIHksIGl0ZW1MaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZXZlbnRIYW5kbGVyID0gKGV2ZW50TmFtZTogc3RyaW5nKSA9PiB7XG4gICAgcmV0dXJuIChlOiBNb3VzZUV2ZW50IHwgR2FtZVRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGxldCB0b3VjaDogTW91c2VFdmVudCB8IEdhbWVUb3VjaDtcblxuICAgICAgaWYgKGlzR2FtZVRvdWNoRXZlbnQoZSkpIHtcbiAgICAgICAgdG91Y2ggPSAoZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSkgfHwgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3VjaCA9IGU7XG4gICAgICB9XG4gICAgICAvLyBjb25zdCB0b3VjaCA9IChlLnRvdWNoZXMgJiYgZS50b3VjaGVzWzBdKSB8fCAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB8fCBlO1xuICAgICAgaWYgKCF0b3VjaCB8fCAhdG91Y2gucGFnZVggfHwgIXRvdWNoLnBhZ2VZKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0b3VjaC50aW1lU3RhbXApIHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICB0b3VjaC50aW1lU3RhbXAgPSBlLnRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGlzdDogKExheW91dCB8IEVsZW1lbnQpW10gPSBbXTtcbiAgICAgIGlmICh0b3VjaCkge1xuICAgICAgICB0aGlzLmdldENoaWxkQnlQb3ModGhpcywgdG91Y2gucGFnZVgsIHRvdWNoLnBhZ2VZLCBsaXN0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFsaXN0Lmxlbmd0aCkge1xuICAgICAgICBsaXN0LnB1c2godGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG4gICAgICBpdGVtICYmIGl0ZW0uZW1pdChldmVudE5hbWUsIGUpO1xuXG4gICAgICBpZiAoZXZlbnROYW1lID09PSAndG91Y2hzdGFydCcgfHwgZXZlbnROYW1lID09PSAndG91Y2hlbmQnKSB7XG4gICAgICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS50b3VjaE1zZ1tldmVudE5hbWVdID0gdG91Y2g7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudE5hbWUgPT09ICd0b3VjaGVuZCcgJiYgaXNDbGljayh0aGlzLmV2ZW50SGFuZGxlckRhdGEudG91Y2hNc2cpKSB7XG4gICAgICAgIGl0ZW0gJiYgaXRlbS5lbWl0KCdjbGljaycsIGUpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIOaJp+ihjOWFqOWxgOeahOS6i+S7tue7keWumumAu+i+kVxuICAgKi9cbiAgYmluZEV2ZW50cygpIHtcbiAgICBpZiAodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhc0V2ZW50QmluZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYXNFdmVudEJpbmQgPSB0cnVlO1xuICAgIGVudi5vblRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgIGVudi5vblRvdWNoTW92ZSh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hNb3ZlKTtcbiAgICBlbnYub25Ub3VjaEVuZCh0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFuZGxlcnMudG91Y2hFbmQpO1xuICAgIGVudi5vblRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG5cbiAgICAvKipcbiAgICAgKiDlvZPop6blj5EgdG91Y2hzdGFydCDkuovku7bnmoTml7blgJnvvIzlpoLmnpzmiYvmjIfnp7vpmaTlhYPntKDlpJbvvIzkuI3kvJrop6blj5EgdG91Y2hlbmTvvIzov5nlsLHlr7zoh7QgZGVhY3RpdmVIYW5kbGVyIOS4jeiDveinpuWPkVxuICAgICAqIOimgeWBmuWIsOavlOi+g+WujOWWhO+8jOS6i+S7tuezu+e7n+imgeWBmui+g+Wkp+aUueeUqO+8jOebruWJjeavlOi+g+WlveeahOWBmuazleWwseaYr+agueiKgueCueWcqOebkeWQrOWIsCB0b3VjaGVuZCDlkowgdG91Y2hjYW5jZWwg55qE5pe25YCZ5YWc5bqVXG4gICAgICog6Kem5Y+R5LiLIGRlYWN0aXZlSGFuZGxlclxuICAgICAqL1xuICAgIHRoaXMub24oJ3RvdWNoZW5kJywgKCkgPT4ge1xuICAgICAgdGhpcy5hY3RpdmVFbGVtZW50cy5mb3JFYWNoKChlbGU6IEVsZW1lbnQpID0+IHtcbiAgICAgICAgZWxlLmRlYWN0aXZlSGFuZGxlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYWN0aXZlRWxlbWVudHMgPSBbXTtcbiAgICB9KTtcbiAgICB0aGlzLm9uKCd0b3VjaGNhbmNlbCcsICgpID0+IHtcbiAgICAgIHRoaXMuYWN0aXZlRWxlbWVudHMuZm9yRWFjaCgoZWxlOiBFbGVtZW50KSA9PiB7XG4gICAgICAgIGVsZS5kZWFjdGl2ZUhhbmRsZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFjdGl2ZUVsZW1lbnRzID0gW107XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5YWo5bGA5LqL5Lu26Kej57uRXG4gICAqL1xuICB1bkJpbmRFdmVudHMoKSB7XG4gICAgZW52Lm9mZlRvdWNoU3RhcnQodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoU3RhcnQpO1xuICAgIGVudi5vZmZUb3VjaE1vdmUodGhpcy5ldmVudEhhbmRsZXJEYXRhLmhhbmRsZXJzLnRvdWNoTW92ZSk7XG4gICAgZW52Lm9mZlRvdWNoRW5kKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaEVuZCk7XG4gICAgZW52Lm9mZlRvdWNoQ2FuY2VsKHRoaXMuZXZlbnRIYW5kbGVyRGF0YS5oYW5kbGVycy50b3VjaENhbmNlbCk7XG5cbiAgICB0aGlzLmV2ZW50SGFuZGxlckRhdGEuaGFzRXZlbnRCaW5kID0gZmFsc2U7XG4gIH1cblxuICBlbWl0KGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSkge1xuICAgIEVFLmVtaXQoZXZlbnQsIGRhdGEpO1xuICB9XG5cbiAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub24oZXZlbnQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uY2UoZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IENhbGxiYWNrKSB7XG4gICAgRUUub25jZShldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgb2ZmKGV2ZW50OiBzdHJpbmcsIGNhbGxiYWNrOiBDYWxsYmFjaykge1xuICAgIEVFLm9mZihldmVudCwgY2FsbGJhY2spO1xuICB9XG5cbiAgZGVzdHJveUFsbCh0cmVlOiBMYXlvdXQgfCBFbGVtZW50KSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgfSA9IHRyZWU7XG5cbiAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuZGVzdHJveSgpO1xuICAgICAgdGhpcy5kZXN0cm95QWxsKGNoaWxkKTtcbiAgICAgIGNoaWxkLmRlc3Ryb3lTZWxmICYmIGNoaWxkLmRlc3Ryb3lTZWxmKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICog5riF55CG55S75biD77yM5LmL5YmN55qE6K6h566X5Ye65p2l55qE5riy5p+T5qCR5Lmf5Lya5LiA5bm25riF55CG77yM5q2k5pe25Y+v5Lul5YaN5qyh5omn6KGMaW5pdOWSjGxheW91dOaWueazlea4suafk+eVjOmdouOAglxuICAgKi9cbiAgY2xlYXIob3B0aW9uczogeyByZW1vdmVUaWNrZXI/OiBib29sZWFuIH0gPSB7fSkge1xuICAgIGNvbnN0IHsgcmVtb3ZlVGlja2VyID0gdHJ1ZSB9ID0gb3B0aW9ucztcblxuICAgIGRlYnVnSW5mby5yZXNldCgpO1xuICAgIHRoaXMuZGVzdHJveUFsbCh0aGlzKTtcbiAgICAvLyB0aGlzLmVsZW1lbnRUcmVlID0gbnVsbDtcbiAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgdGhpcy5zdGF0ZSA9IFNUQVRFLkNMRUFSO1xuICAgIHRoaXMuaXNEaXJ0eSA9IGZhbHNlO1xuICAgIGNsZWFyQ2FudmFzKHRoaXMucmVuZGVyQ29udGV4dCBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIHRoaXMuZWxlQ291bnQgPSAwO1xuICAgIHRoaXMudW5CaW5kRXZlbnRzKCk7XG5cbiAgICBpZiAocmVtb3ZlVGlja2VyKSB7XG4gICAgICB0aGlzLnRpY2tlci5yZW1vdmUoKTtcbiAgICAgIHRoaXMudGlja2VyLnN0b3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW5uZXLnmoTlupTor6Xpu5jorqTpg73np7vpmaTvvIzlkKbliJnliY3lkI7kuKTmrKHliJ3lp4vljJbkvJrlr7zoh7TliY3lkI7nirbmgIHmnInpl67pophcbiAgICAgIHRoaXMudGlja2VyLnJlbW92ZUlubmVyKCk7XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmVFbGVtZW50cyA9IFtdO1xuICB9XG5cbiAgY2xlYXJQb29sKCkge1xuICAgIGltZ1Bvb2wuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDmr5TotbcgTGF5b3V0LmNsZWFyIOabtOW9u+W6leeahOa4heeQhu+8jOS8mua4heepuuWbvueJh+WvueixoeaxoO+8jOWHj+WwkeWGheWtmOWNoOeUqOOAglxuICAgKi9cbiAgY2xlYXJBbGwoKSB7XG4gICAgdGhpcy5jbGVhcigpO1xuXG4gICAgdGhpcy5jbGVhclBvb2woKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlr7nkuo7lm77niYfotYTmupDvvIzlpoLmnpzkuI3mj5DliY3liqDovb3vvIzmuLLmn5Pov4fnqIvkuK3lj6/og73lh7rnjrDmjKjkuKrlh7rnjrDlm77niYfmlYjmnpzvvIzlvbHlk43kvZPpqoxcbiAgICog6YCa6L+HTGF5b3V0LmxvYWRJbWdz5Y+v5Lul6aKE5Yqg6L295Zu+54mH6LWE5rqQ77yM5Zyo6LCD55SoTGF5b3V0LmxheW91dOeahOaXtuWAmea4suafk+aAp+iDveabtOWlve+8jOS9k+mqjOabtOS9s+OAglxuICAgKi9cbiAgbG9hZEltZ3MoYXJyOiBzdHJpbmdbXSA9IFtdKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGFyci5tYXAoc3JjID0+IGltYWdlTWFuYWdlci5sb2FkSW1hZ2VQcm9taXNlKHNyYykpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDms6jlhowgYml0bWFwdGV4dCDlj6/nlKjnmoTlrZfkvZPjgIJcbiAgICovXG4gIHJlZ2lzdEJpdE1hcEZvbnQobmFtZTogc3RyaW5nLCBzcmM6IHN0cmluZywgY29uZmlnOiBzdHJpbmcpIHtcbiAgICBpZiAoIWJpdE1hcFBvb2wuZ2V0KG5hbWUpKSB7XG4gICAgICBjb25zdCBmb250ID0gbmV3IEJpdE1hcEZvbnQobmFtZSwgc3JjLCBjb25maWcpO1xuICAgICAgdGhpcy5iaXRNYXBGb250cy5wdXNoKGZvbnQpO1xuICAgICAgYml0TWFwUG9vbC5zZXQobmFtZSwgZm9udCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIOWIm+W7uuiKgueCue+8jOWIm+W7uuS5i+WQjuS8mui/lOWbnkVsZW1lbnTliJfooajvvIzlj6/ku6XkvKDlhaVwYXJlbnTnq4vliLvmj5LlhaXoioLngrnvvIzkuZ/lj6/ku6XnqI3lkI7kuLvliqhhcHBlbmRDaGlsZOWIsOmcgOimgeeahOiKgueCueS4i1xuICAgKi9cbiAgaW5zZXJ0RWxlbWVudCh0ZW1wbGF0ZTogc3RyaW5nLCBzdHlsZTogUmVjb3JkPHN0cmluZywgSVN0eWxlPiwgcGFyZW50PzogRWxlbWVudCB8IG51bGwpOiBFbGVtZW50W10ge1xuICAgIGNvbnN0IGVsZW1lbnRBcnJheSA9IHRoaXMuaW5zZXJ0RWxlbWVudEFycmF5KHRlbXBsYXRlLCBzdHlsZSk7XG4gICAgZWxlbWVudEFycmF5LmZvckVhY2goaXQgPT4ge1xuICAgICAgaXRlcmF0ZVRyZWUoaXQsIGVsZW1lbnQgPT4gZWxlbWVudC5vYnNlcnZlU3R5bGVBbmRFdmVudCgpKTtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoaXQpO1xuICAgICAgfVxuICAgIH0pXG4gICAgXG4gICAgcmV0dXJuIGVsZW1lbnRBcnJheTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlhYvpmoboioLngrnvvIzlhYvpmoblkI7nmoToioLngrnlj6/ku6Xmt7vliqDliLAgTGF5b3V0IOeahOafkOS4quiKgueCueS4rVxuICAgKiDor6Xmlrnms5Xlj6/ku6XlnKjmlbDmja7mnInlj5jljJbnmoTml7blgJnpgb/lhY3ph43mlrDmiafooYwgTGF5b3V0LmluaXQg5rWB56iL44CCXG4gICAqL1xuICBjbG9uZU5vZGUoZWxlbWVudDogRWxlbWVudCwgZGVlcCA9IHRydWUpIHtcbiAgICByZXR1cm4gY2xvbmU8TGF5b3V0Pih0aGlzLCBlbGVtZW50LCBkZWVwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiDlsIbnu4Tku7bmjILliLBMYXlvdXRcbiAgICovXG4gIEVsZW1lbnQgPSBFbGVtZW50O1xuICBWaWV3ID0gVmlldztcbiAgVGV4dCA9IFRleHQ7XG4gIEltYWdlID0gSW1hZ2U7XG4gIFNjcm9sbFZpZXcgPSBTY3JvbGxWaWV3O1xuICBCaXRNYXBUZXh0ID0gQml0TWFwVGV4dDtcbiAgQ2FudmFzID0gQ2FudmFzO1xuICBCdXR0b24gPSBCdXR0b247XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQgPSByZWdpc3RlckNvbXBvbmVudDtcblxuICBwcml2YXRlIHN0YXRpYyBpbnN0YWxsZWRQbHVnaW5zOiBJUGx1Z2luPExheW91dD5bXSA9IFtdO1xuICAvKipcbiAgICog5a6J6KOF57uZ5a6a55qE5o+S5Lu2XG4gICAqL1xuICB1c2UocGx1Z2luOiBJUGx1Z2luPExheW91dD4sIC4uLm9wdGlvbnM6IGFueVtdKSB7XG4gICAgaWYgKExheW91dC5pbnN0YWxsZWRQbHVnaW5zLmluY2x1ZGVzKHBsdWdpbikpIHtcbiAgICAgIGNvbnNvbGUud2FybignW0xheW91dF0g6K+l5o+S5Lu25bey5a6J6KOFLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHBsdWdpbi5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIExheW91dC5pbnN0YWxsZWRQbHVnaW5zLnB1c2gocGx1Z2luKTtcblxuICAgIC8vIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5a6J6KOFYClcbiAgfVxuXG4gIC8qKlxuICAgKiDljbjovb3nu5nlrprmj5Lku7ZcbiAgICovXG4gIHVuVXNlKHBsdWdpbjogSVBsdWdpbjxMYXlvdXQ+LCAuLi5vcHRpb25zOiBhbnlbXSkge1xuICAgIGNvbnN0IHBsdWdpbkluZGV4ID0gTGF5b3V0Lmluc3RhbGxlZFBsdWdpbnMuaW5kZXhPZihwbHVnaW4pO1xuXG4gICAgaWYgKHBsdWdpbkluZGV4ID09PSAtMSkge1xuICAgICAgY29uc29sZS53YXJuKCdbTGF5b3V0XSBUaGlzIHBsdWdpbiBpcyBub3QgaW5zdGFsbGVkLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwbHVnaW4udW5pbnN0YWxsKSB7XG4gICAgICBwbHVnaW4udW5pbnN0YWxsKHRoaXMsIC4uLm9wdGlvbnMpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKGBbTGF5b3V0XSDmj5Lku7YgJHtwbHVnaW4ubmFtZSB8fCAnJ30g5bey5Y246L29YClcbiAgICBMYXlvdXQuaW5zdGFsbGVkUGx1Z2lucy5zcGxpY2UocGx1Z2luSW5kZXgsIDEpO1xuICB9XG5cbiAgLyoqXG4gICAqIOWIm+W7uuiKgueCue+8jOWIm+W7uuS5i+WQjuS8mui/lOWbnkVsZW1lbnTliJfooahcbiAgICovXG4gIHByaXZhdGUgaW5zZXJ0RWxlbWVudEFycmF5KHRlbXBsYXRlOiBzdHJpbmcsIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBJU3R5bGU+LCBhdHRyVmFsdWVQcm9jZXNzb3I/OiBDYWxsYmFjaywgb25seUZpcnN0PzogYm9vbGVhbik6IEVsZW1lbnRbXSB7XG4gICAgLy8g5qC35byP6KGo5a2Y5Yiw5YWo5bGAXG4gICAgdGhpcy5zdHlsZVNoZWV0ID0gT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlU2hlZXQsIHN0eWxlKTtcblxuICAgIGNvbnN0IHBhcnNlQ29uZmlnID0ge1xuICAgICAgYXR0cmlidXRlTmFtZVByZWZpeDogJycsXG4gICAgICBhdHRyTm9kZU5hbWU6ICdhdHRyJywgLy8gZGVmYXVsdCBpcyAnZmFsc2UnXG4gICAgICB0ZXh0Tm9kZU5hbWU6ICcjdGV4dCcsXG4gICAgICBpZ25vcmVBdHRyaWJ1dGVzOiBmYWxzZSxcbiAgICAgIGlnbm9yZU5hbWVTcGFjZTogdHJ1ZSxcbiAgICAgIGFsbG93Qm9vbGVhbkF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBwYXJzZU5vZGVWYWx1ZTogZmFsc2UsXG4gICAgICBwYXJzZUF0dHJpYnV0ZVZhbHVlOiBmYWxzZSxcbiAgICAgIHRyaW1WYWx1ZXM6IHRydWUsXG4gICAgICBwYXJzZVRydWVOdW1iZXJPbmx5OiBmYWxzZSxcbiAgICAgIGFsd2F5c0NyZWF0ZVRleHROb2RlOiB0cnVlLFxuICAgIH07XG5cbiAgICBpZiAoYXR0clZhbHVlUHJvY2Vzc29yICYmIHR5cGVvZiBhdHRyVmFsdWVQcm9jZXNzb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHBhcnNlQ29uZmlnLmF0dHJWYWx1ZVByb2Nlc3NvciA9IGF0dHJWYWx1ZVByb2Nlc3NvcjtcbiAgICB9XG5cbiAgICBkZWJ1Z0luZm8uc3RhcnQoJ2luc2VydF94bWxQYXJzZScpO1xuICAgIC8vIOWwhnhtbOWtl+espuS4suino+aekOaIkHhtbOiKgueCueagkVxuICAgIGNvbnN0IGpzb25PYmogPSBwYXJzZXIucGFyc2UodGVtcGxhdGUsIHBhcnNlQ29uZmlnLCB0cnVlKTtcbiAgICAvLyBjb25zb2xlLmxvZyhqc29uT2JqKVxuICAgIGRlYnVnSW5mby5lbmQoJ2luc2VydF94bWxQYXJzZScpO1xuXG4gICAgY29uc3QgZ2V0RWxlbWVudHM6IEVsZW1lbnRbXSA9IFtdO1xuICAgIGpzb25PYmouY2hpbGRyZW4uZm9yRWFjaCgoeG1sVHJlZTogVHJlZU5vZGUsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIGlmIChvbmx5Rmlyc3QgJiYgaW5kZXggPiAwKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIFhNTOagkeeUn+aIkOa4suafk+agkVxuICAgICAgZGVidWdJbmZvLnN0YXJ0KCdpbnNlcnRfeG1sMkxheW91dCcpO1xuICAgICAgY29uc3QgbGF5b3V0VHJlZSA9IGNyZWF0ZS5jYWxsKHRoaXMsIHhtbFRyZWUsIHRoaXMuc3R5bGVTaGVldCk7XG4gICAgICBkZWJ1Z0luZm8uZW5kKCdpbnNlcnRfeG1sMkxheW91dCcpO1xuICAgICAgZ2V0RWxlbWVudHMucHVzaChsYXlvdXRUcmVlKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRFbGVtZW50cztcbiAgfVxufVxuXG5jb25zdCBsYXlvdXQgPSBuZXcgTGF5b3V0KHtcbiAgc3R5bGU6IHtcbiAgICB3aWR0aDogMCxcbiAgICBoZWlnaHQ6IDAsXG4gIH0sXG4gIG5hbWU6ICdsYXlvdXQnLFxufSk7XG5cbmV4cG9ydCB7XG4gIGxheW91dCBhcyBkZWZhdWx0LFxuICBMYXlvdXQsXG4gIGVudixcbiAgRUUsXG4gIElTdHlsZSxcbiAgRWxlbWVudCxcbiAgVmlldyxcbiAgVGV4dCxcbiAgSW1hZ2UsXG4gIFNjcm9sbFZpZXcsXG4gIEJpdE1hcFRleHQsXG4gIENhbnZhcyxcbiAgQnV0dG9uXG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=
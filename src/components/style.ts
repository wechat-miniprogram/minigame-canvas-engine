const reflowAffectedStyles = [
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

const repaintAffectedStyles = [
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
  'imageType',
  'imageInset',
  'backgroundImageType',
  'backgroundImageInset',
];

export const renderAffectStyles = [
  'textShadow',
  'transform',
  'backgroundImage',
  'imageType',
  'imageInset',
  'backgroundImageType',
  'backgroundImageInset',
]

interface IStyle {
  // reflowAffectedStyles
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  margin?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  borderWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;

  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;

  flexDirection?: 'column' | 'row';
  flexShrink?: number;
  flexGrow?: number;
  flexWrap?: 'wrap' | 'nowrap';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  alignSelf?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  position?: string;

  // repaintAffectedStyles
  fontSize?: number;
  lineHeight?: number | 'string';
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  color?: string;
  backgroundColor?: string;
  textOverflow?: 'ellipsis' | 'clip';
  letterSpacing?: number;
  borderRadius?: number;
  borderColor?: string;
  borderTopColor?: string;

  backgroundImage?: string;
  /**
   * 背景图片的渲染模式
   * simple: 简单拉伸（默认）
   * sliced: 九宫格拉伸
   * tiled: 平铺模式
   */
  backgroundImageType?: 'simple' | 'sliced' | 'tiled';
  /**
   * 背景图片的九宫格参数，格式为 "left top right bottom"
   */
  backgroundImageInset?: string;
  
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;

  opacity?: number;
  fontWeight?: string;
  fontFamily?: string;

  transform?: string;

  /**
   * 图片渲染模式（用于Image组件）
   * simple: 简单拉伸（默认）
   * sliced: 九宫格拉伸
   * tiled: 平铺模式
   */
  imageType?: 'simple' | 'sliced' | 'tiled';
  /**
   * 图片的九宫格参数，格式为 "left top right bottom"
   */
  imageInset?: string;

  // 文字描边的宽度，默认不描边
  textStrokeWidth?: number;
  // 文字描边的颜色，如果指定了描边颜色但是没有指定描边宽度，描边宽度默认设置为1
  textStrokeColor?: string;

  /**
   * 文字阴影效果，textShadow的格式并不是严格的CSS格式，仅支持两种格式
   * textShadow: 1px 1px 2px pink
   * textShadow: 1px 1px 2px red, 0 0 1px blue, 0 0 1px blue, 1px 1px 2px red
   * 也就是支持任意数量的阴影效果，每个阴影效果由四个值指定，分别是 shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor
   */
  textShadow?: string;

  // 文字换行相关属性

  /**
   * 属性用于设置如何处理元素内的空白字符，这个属性指定了两件事：空白字符是否合并，以及如何合并。是否换行，以及如何换行
   * 详细的规则可参考:
   * https://developer.mozilla.org/zh-CN/docs/Web/CSS/white-space
   * 
   * normal: 连续的空白符会被合并。源码中的换行符会被当作空白符来处理。并根据填充行框盒子的需要来换行。
   * nowrap: 和 normal 一样合并空白符，但阻止源码中的文本换行。
   * pre: 连续的空白符会被保留。仅在遇到换行符时才会换行。
   * pre-wrap: 连续的空白符会被保留。在遇到换行符时根据填充行框盒子的需要换行。
   * pre-line: 连续的空白符会被合并。在遇到换行符时根据填充行框盒子的需要换行。
   */

  /**
   * white-space 属性对空白符和换行的处理规则：
   * 
   * | 属性值      | 换行符  | 空格/制表符   | 文本换行 | 行末空格 | 
   * |------------|--------|------------ |---------|---------|
   * | normal     | 合并    | 合并        | 换行     | 移除     | 
   * | nowrap     | 合并    | 合并        | 不换行   | 移除     | 
   * | pre        | 保留    | 保留        | 不换行   | 保留     | 
   * | pre-wrap   | 保留    | 保留        | 换行     | 挂起     | 
   * | pre-line   | 保留    | 合并        | 换行     | 移除     |
   * 
   * 术语说明：
   * - "合并"：连续空白符合并为单个空格
   * - "保留"：保留原始空白符（包括换行和空格）
   * - "移除"：删除行末的空格
   * 
   * 请注意 break-spaces 不支持
  */
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line';

  /**
   * wordBreak 指定了怎样在单词内断行
   * normal: 使用默认的断行规则。
   * break-all: 对于 non-CJK (CJK 指中文/日文/韩文) 文本，可在任意字符间断行。
   */
  wordBreak?: 'normal' | 'break-all';

  ':active'?: IStyle;
}

export { repaintAffectedStyles, reflowAffectedStyles, IStyle };

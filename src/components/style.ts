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
  'opacity'
];

const allStyles = reflowAffectedStyles.concat(repaintAffectedStyles);

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
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;

  opacity?: number;
  fontWeight?: string;
  fontFamily?: string;
}

export { repaintAffectedStyles, reflowAffectedStyles, allStyles, IStyle };

const reflowAffectedStyles = [
  'width', 'height',
  'minWidth', 'minHeight',
  'maxWidth', 'maxHeight',
  'left', 'right', 'top', 'bottom',
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'borderWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth',
  'flexDirection',
  'justifyContent',
  'alignItems', 'alignSelf',
  'flex',
  'flexWrap',
  'position',
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
  'backgroundColor',
  'borderRadius',
  'borderColor',
];

const allStyles = reflowAffectedStyles.concat(repaintAffectedStyles);

export { repaintAffectedStyles, reflowAffectedStyles, allStyles };

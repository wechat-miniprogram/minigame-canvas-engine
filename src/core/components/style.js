const textStyles = ['color', 'fontSize', 'textAlign', 'fontWeight', 'lineHeight', 'lineBreak']

const scalableStyles = ['left', 'top', 'right', 'bottom', 'width', 'height',
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'fontSize', 'lineHeight',
  'borderRadius', 'borderLeftTopRadius', 'borderRightTopRadius', 'borderLeftBottomRadius', 'borderRightBottomRadius', 'borderWidth',
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight'
  ]

const layoutAffectedStyles = [
  'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
  'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
  'width', 'height']

const reflowStyles = [
  'display',
  'fontSize', 'lineHeight', 'lineBreak',
  'left', 'top', 'right', 'bottom', 'width', 'height',
  'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom',
  'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom',
  'minWidth', 'maxWidth', 'minHeight', 'maxHeight'
]

export { scalableStyles, textStyles, layoutAffectedStyles, reflowStyles }

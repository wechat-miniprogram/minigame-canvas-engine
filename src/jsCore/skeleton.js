function hasBorderRadius(style) {
  return style.borderRadius
    || style.borderLeftTopRadius
    || style.borderRightTopRadius
    || style.borderLeftBottomRadius
    || style.borderRightBottomRadius;
}

function getDimension(style, box) {
  const borderWidth = style.borderWidth || 0;
  const borderLeftWidth = style.borderLeftWidth || borderWidth;
  const borderRightWidth = style.borderRightWidth || borderWidth;
  const borderTopWidth = style.borderTopWidth || borderWidth;
  const borderBottomWidth = style.borderBottomWidth || borderWidth;

  const baseX = box.absoluteX + borderLeftWidth;
  const baseY = box.absoluteY + borderTopWidth;
  const boxWidth = box.width - (borderLeftWidth + borderRightWidth);
  const boxHeight = box.height - (borderTopWidth + borderBottomWidth);

  return [baseX, baseY, boxWidth, boxHeight];
}

function clipRoundRect(ctx, style, box) {
  const w = box.width;
  const h = box.height;
  const x = box.absoluteX;
  const y = box.absoluteY;

  const {
    borderRadius,
    borderLeftTopRadius,
    borderRightTopRadius,
    borderLeftBottomRadius,
    borderRightBottomRadius
  } = style;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.moveTo(x, y);
  ctx.arcTo(x + w, y, x + w, y + h, borderRightTopRadius || borderRadius || 0); // right top
  ctx.arcTo(x + w, y + h, x, y + h, borderRightBottomRadius || borderRadius || 0); // right bottom
  ctx.arcTo(x, y + h, x, y, borderLeftBottomRadius || borderRadius || 0); // left bottom
  ctx.arcTo(x, y, x + w, y, borderLeftTopRadius || borderRadius || 0); // left top
}

function clipView(ctx, style, box) {
  ctx.save()
  if (hasBorderRadius(style)) {
    clipRoundRect(ctx, style, box)
  } else {
    ctx.beginPath();
    ctx.rect(...getDimension(style, box))
  }
  ctx.clip()
}

function drawChildNodes({ ctx, isDarkMode, getFontSize }, childs) {
  childs.forEach(child => {
    const type = child.type
    const style = !isDarkMode() ? child.styleInit : { ...child.styleInit, ...child.styleDarkInit }
    const box = child.layoutBox

    if (style.display === 'none') {
      return
    }

    if (type === 'View') {
      ctx.save()
      if (style.overflow === 'hidden') {
        clipView(ctx, style, box)
      }
      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor
        clipView(ctx, style, box)
        ctx.fillRect(...getDimension(style, box))
        ctx.restore()
      }
      drawChildNodes({ ctx, isDarkMode, getFontSize }, child.childNodes)
      if (style.overflow === 'hidden') {
        ctx.restore()
      }
      ctx.restore()
    }
    if (type === 'Image') {
      // 
    }
    if (type === 'Text') {
      ctx.save()
      ctx.font = `${style.fontWeight || ''} ${(style.fontSize || 12) * getFontSize()}px ${style.fontFamily || 'sans-serif'}`
      ctx.textBaseline = 'top'
      ctx.textAlign = style.textAlign || 'left'
      ctx.fillStyle = style.color || '#000'
      let drawX = box.absoluteX;
      let drawY = box.absoluteY;

      if (style.textAlign === 'center') {
        drawX += box.width / 2;
      } else if (style.textAlign === 'right') {
        drawX += box.width;
      }

      if (style.lineHeight) {
        ctx.textBaseline = 'middle';
        drawY += style.lineHeight / 2;
      }

      if (child.valueBreak && child.valueBreak.length) {
        for (let i = 0; i < child.valueBreak.length; i++) {
          const str = child.valueBreak[i];
          ctx.fillText(str, drawX, drawY);
          drawY += style.lineHeight || style.fontSize;
        }
      } else {
        ctx.fillText(
          child.value,
          drawX,
          drawY
        );
      }
      ctx.restore()
    }
  })
}

export default function drawLayoutByData(
  { canvasContext, isDarkMode = () => false, getFontSize = () => 1 },
  layoutData
) {
  // const now = Date.now()
  // const canvas = canvasContext.canvas
  // const layoutTree = layoutData.layoutBoxTree
  // const ctx = canvas.getContext('2d', {
  //   alpha: true
  // })
  // const { width, height } = layoutTree.layoutBox
  // canvas.width = width
  // canvas.height = height
  // drawChildNodes({ ctx, isDarkMode, getFontSize }, layoutTree.childNodes)
  // console.log('Skeleton drawed: ' + (Date.now() - now) + 'ms')
}

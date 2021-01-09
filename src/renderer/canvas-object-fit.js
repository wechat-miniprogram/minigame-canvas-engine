// 魔改https://github.com/mgcrea/js-canvas-object-fit/edit/master/src/index.js
//
//   1        2       3      4         5            6           7          8
//  888888  888888      88  88      8888888888  88                  88  8888888888
//  88          88      88  88      88  88      88  88          88  88      88  88
//  8888      8888    8888  8888    88          8888888888  8888888888          88
//  88          88      88  88
//  88          88  888888  888888
export const EXIF_ORIENTATIONS = [
  {op: 'none', radians: 0},
  {op: 'none', radians: 0},
  {op: 'flip-x', radians: 0},
  {op: 'none', radians: Math.PI},
  {op: 'flip-y', radians: 0},
  {op: 'flip-x', radians: Math.PI / 2},
  {op: 'none', radians: Math.PI / 2},
  {op: 'flip-x', radians: -Math.PI / 2},
  {op: 'none', radians: -Math.PI / 2}
];

export const isExifRotated = orientation => [5, 6, 7, 8].includes(orientation);

// Without rotation handling
export const getImageRect = (
  image,
  x,
  y,
  width,
  height,
  {objectFit = 'none', offsetX = 1 / 2, offsetY = 1 / 2} = {}
) => {
  const imageWidth = image.width;
  const imageHeight = image.height;
  // Resize values
  const resizeRatio = Math[objectFit === 'cover' ? 'max' : 'min'](width / imageWidth, height / imageHeight);
  const resizeWidth = imageWidth * resizeRatio;
  const resizeHeight = imageHeight * resizeRatio;
  // Cropping values
  const sWidth = imageWidth / (resizeWidth / width);
  const sHeight = imageHeight / (resizeHeight / height);
  const sX = (imageWidth - sWidth) * offsetX;
  const sY = (imageHeight - sHeight) * offsetY;
  // Draw image
  /*ctx.drawImage(image, sX, sY, sWidth, sHeight, x, y, width, height);*/

  return [sX, sY, sWidth, sHeight];
};


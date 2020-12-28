import { orthographic, translate, translation, scale, identity } from './m4.js';
import vertex from './roundedRect.vert';
import fragment from './roundedRect.frag';

// 创建纹理
function createTexture(gl) {
  const texId = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texId);

  // 设置参数，让我们可以绘制任何尺寸的图像
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  return texId;
}

const positions = new Float32Array([
  0, 0,
  0, 1,
  1, 0,
  1, 0,
  0, 1,
  1, 1,
]);
const textureMap = new WeakMap();

function createProgram(gl) {
  let program;
  let bufferId;
  let uResolution;
  let uRadius;
  let uBorderWidth;
  let uBorderColor;
  let uColor;
  let uMatrix;
  let uRect;
  let uTexRect;
  let uBitset;
  let uTex;
  let vPosition;
  let textureMatrixLocation;
  let uOpacity;

  {
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    // gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    // gl.blendEquation(gl.FUNC_ADD);
    // gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
  }
  { // program
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertex);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragment);
    gl.compileShader(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
  }
  { // 变量
    uRadius = gl.getUniformLocation(program, 'u_radius');
    uBorderWidth = gl.getUniformLocation(program, 'u_border_width');
    uBorderColor = gl.getUniformLocation(program, 'u_border_color');
    uOpacity = gl.getUniformLocation(program, 'u_opacity')
    uColor = gl.getUniformLocation(program, 'u_color');
    uMatrix = gl.getUniformLocation(program, 'u_matrix');
    uRect = gl.getUniformLocation(program, 'u_rect');

    uTexRect = gl.getUniformLocation(program, 'u_tex_rect');
    uBitset = gl.getUniformLocation(program, 'u_bitset');
    uResolution = gl.getUniformLocation(program, 'u_resolution');
    uTex = gl.getUniformLocation(program, 'u_texture');
    textureMatrixLocation = gl.getUniformLocation(program, 'u_textureMatrix');
    vPosition = gl.getAttribLocation(program, 'a_position');
  }
  { // VBO
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // vertexAttribPointer几个参数解释：
    // 每次迭代运行提取两个单位数据
    // 每个单位的数据类型是32位浮点型
    // 不需要归一化数据
    // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）
    // 每次迭代运行运动多少内存到下一个数据开始点
    // 从缓冲起始位置开始读取
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
  }

  gl.useProgram(program);

  return {
    program,
    bufferId,
    uResolution,
    uRadius,
    uBorderWidth,
    uBorderColor,
    uColor,
    uMatrix,
    uRect,
    uTexRect,
    uBitset,
    uTex,
    vPosition,
    textureMatrixLocation,
    textureMap,
    positions,
    uOpacity
  };
}

export class RoundRect {
  constructor(gl) {
    this.gl = gl;

    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.width = 1;
    this.height = 1;
    this.radius = [0, 0, 0, 0];
    this.backgroundColor = [0, 0, 0, 0];
    this.backgroundImage = undefined
    this.backgroundImageData = undefined;
    this.imageRect = [];
    this.imageSrcRect = [];
    this.borderWidth = 0;
    this.borderColor = [0, 0, 0, 0];
    this.imageWidth = 1;
    this.imageHeight = 1;
    this.texMatrix = translation(0, 0, 0);
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.matrix = identity();
    this.texMatrix = translation(0, 0, 0);
  }

  updateContours(dimension) {
    this.x = dimension[0];
    this.y = dimension[1];
    this.width = dimension[2];
    this.height = dimension[3];
  }

  updateViewPort() {
    let gl = this.gl;
    let canvasWidth = this.canvasWidth;
    let canvasHeight = this.canvasHeight;
    if (canvasWidth !== gl.canvas.width || canvasHeight !== gl.canvas.height) {
      canvasWidth !== gl.canvas.width && (canvasWidth = gl.canvas.width);
      canvasHeight !== gl.canvas.height && (canvasHeight = gl.canvas.height);
      orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1, this.matrix);
      translate(this.matrix, this.x, this.y, 0, this.matrix);
      scale(this.matrix, this.width, this.height, 1, this.matrix);
      /*this.canvasWidth = gl.canvas.width;
      this.canvasHeight = gl.canvas.height;*/
    }
  }

  setRadius(r) {
    if (typeof r === 'number') {
      this.radius = [r, r, r, r];
    } else {
      this.radius = r;
    }
  }

  setBorder(width, color) {
    this.borderWidth = width;
    this.borderColor = color;
  }
  setBackgroundColor(color) {
    this.backgroundColor = color;
  }

  setOpacity(value = 1) {
    this.opacity = value;
  }

  setTexture({ image, rect, srcRect } = {}) {
    if (!rect) {
      rect = [0, 0, this.width, this.height]
    }
    this.backgroundImage = image;
    this.imageWidth = image.width;
    this.imageHeight = image.height;
    this.imageRect = rect;
    this.imageSrcRect = srcRect || [0, 0, image.width, image.height];

    this.setTexMatrix();
  }

  setTextureData({ imageData, width: tWidth, height: tHeight, rect, srcRect } = {}) {
    if (!rect) {
      rect = [0, 0, this.width, this.height]
    }
    this.backgroundImageData = imageData;
    this.imageWidth = tWidth;
    this.imageHeight = tHeight;
    this.imageRect = rect;
    this.imageSrcRect = srcRect || [0, 0, tWidth, tHeight];

    this.setTexMatrix();
  }
  setTexMatrix() {
    const srcX = this.imageSrcRect[0] || 0;
    const srcY = this.imageSrcRect[1] || 0;
    const srcWidth = this.imageSrcRect[2] || this.imageWidth;
    const srcHeight = this.imageSrcRect[3] || this.imageHeight;
    translation(srcX / this.imageWidth, srcY / this.imageHeight, this.texMatrix);
    scale(this.texMatrix, srcWidth / this.imageWidth, srcHeight / this.imageHeight, 1, this.texMatrix);
  }

  draw() {
    let gl = this.gl;
    const dstX = (this.imageRect[0] || 0) + this.x + this.borderWidth;
    const dstY = (this.imageRect[1] || 0) + this.y + this.borderWidth;
    const dstWidth = this.imageRect[2] || this.width;
    const dstHeight = this.imageRect[3] || this.height;

    let hasTexture = false;
    if (typeof this.backgroundImage !== 'undefined') {
      let texId = textureMap.get(this.backgroundImage);
      if (!texId) {
        texId = createTexture(gl);

        // 将图像上传到纹理
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.backgroundImage);
        textureMap.set(this.backgroundImage, texId);
      }

      gl.bindTexture(gl.TEXTURE_2D, texId);

      hasTexture = true;
    } else if (typeof this.backgroundImageData !== 'undefined') {
      let texId = textureMap.get(this.backgroundImageData);
      if (!texId) {
        texId = createTexture(gl);
        textureMap.set(backgroundImageData, texId);
      }
      gl.bindTexture(gl.TEXTURE_2D, texId);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.imageWidth,
        this.imageHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        this.backgroundImageData,
      );
      hasTexture = true;
    }

    // 所有绘制共用一个就行
    gl.uniform2f(gl.program.uResolution, gl.canvas.width, gl.canvas.height);

    gl.uniformMatrix4fv(gl.program.uMatrix, false, this.matrix);
    // 设置矩形除去border左下角和右上角位置
    gl.uniform4f(gl.program.uTexRect, dstX, dstY + dstHeight, dstX + dstWidth, dstY);
    // 设置完整矩形的位置
    gl.uniform4f(gl.program.uRect, this.x, this.y + this.height, this.x + this.width, this.y);

    // 纹理设置
    gl.uniform4f(gl.program.uBitset, hasTexture ? 1 : 0, 0, 0, 0);
    gl.uniformMatrix4fv(gl.program.textureMatrixLocation, false, this.texMatrix);

    gl.uniform1i(gl.program.uTex, 0);
    gl.uniform4f(gl.program.uColor, this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);

    gl.uniform4f(gl.program.uRadius, this.radius[0], this.radius[1], this.radius[2], this.radius[3]);
    gl.uniform4f(gl.program.uBorderColor, this.borderColor[0], this.borderColor[1], this.borderColor[2], this.borderColor[3]);

    gl.uniform1f(gl.program.uOpacity, this.opacity);
    gl.uniform1f(gl.program.uBorderWidth, this.borderWidth);

    // 因为count = 6，所以顶点着色器将运行6次
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

export function setupGl(canvas) {
  if (!canvas.webgl) {
    const gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: true,
    });

    gl.program = createProgram(gl);

    canvas.webgl = gl; // eslint-disable-line
  }

  const gl = canvas.webgl;

  return gl;
}

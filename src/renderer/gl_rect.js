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

function createProgram(gl, needFlipY = true) {
  const textureMap = new WeakMap();
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
  // let blankTexId
  let uTex;
  let vPosition;
  let textureMatrixLocation;
  let uOpacity;

  {
    gl.enable(gl.BLEND);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, needFlipY)
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
    // blankTexId,
    uTex,
    vPosition,
    textureMatrixLocation,
    textureMap,
    positions,
    uOpacity
  };
}

function useProgram(gl, needFlipY = true) {
  let hasSetuResolution = false;
  if (!gl.program) {
    gl.program = createProgram(gl, needFlipY); // eslint-disable-line
  }
  const {
    // bufferId,
    uResolution,
    uRadius,
    uBorderWidth,
    uBorderColor,
    uColor,
    uMatrix,
    uRect,
    uTexRect,
    uBitset,
    // blankTexId,
    uTex,
    // vPosition,
    textureMatrixLocation,
    textureMap,
    uOpacity,
  } = gl.program;

  return function createRoundRect() {

    let x = 0;
    let y = 0;
    let width = 1;
    let height = 1;
    let radius = [0, 0, 0, 0];
    let backgroundColor = [0, 0, 0, 0];
    let backgroundImage;
    let backgroundImageData;
    let imageRect = [];
    let imageSrcRect = [];
    let borderWidth = 0;
    let borderColor = [0, 0, 0, 0];
    let imageWidth = 1;
    let imageHeight = 1;
    let opacity = 1;

    let canvasWidth;
    let canvasHeight;

    let matrix = identity();
    let texMatrix = translation(0, 0, 0);

    const result = {
      reset() {
        x = 0;
        y = 0;
        width = 1;
        height = 1;
        radius = [0, 0, 0, 0];
        backgroundColor = [0, 0, 0, 0];
        backgroundImage = undefined
        backgroundImageData = undefined;
        imageRect = [];
        imageSrcRect = [];
        borderWidth = 0;
        borderColor = [0, 0, 0, 0];
        imageWidth = 1;
        imageHeight = 1;
        texMatrix = translation(0, 0, 0);
      },

      updateContours(dimension) {
        [x, y, width, height] = dimension;
      },
      updateViewPort() {
        if (canvasWidth !== gl.canvas.width || canvasHeight !== gl.canvas.height) {
          canvasWidth !== gl.canvas.width && (canvasWidth = gl.canvas.width);
          canvasHeight !== gl.canvas.height && (canvasHeight = gl.canvas.height);
          orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1, matrix);
          translate(matrix, x, y, 0, matrix);
          scale(matrix, width, height, 1, matrix);
          canvasWidth = gl.canvas.width;
          canvasHeight = gl.canvas.height;
        }
      },
      setRadius(r) {
        if (typeof r === 'number') {
          radius = [r, r, r, r];
        } else {
          radius = r;
        }
      },
      setBorder(width, color) {
        borderWidth = width;
        borderColor = color;
      },
      setBackgroundColor(color) {
        backgroundColor = color;
      },

      setOpacity(value = 1) {
        opacity = value;
      },

      setTexture({ image, rect = [0, 0, width, height], srcRect } = {}) {
        backgroundImage = image;
        imageWidth = image.width;
        imageHeight = image.height;
        imageRect = rect;
        imageSrcRect = srcRect || [0, 0, image.width, image.height];
        result.setTexMatrix();
      },

      setTextureData({ imageData, width: tWidth, height: tHeight, rect = [0, 0, width, height], srcRect } = {}) {
        backgroundImageData = imageData;
        imageWidth = tWidth;
        imageHeight = tHeight;
        imageRect = rect;
        imageSrcRect = srcRect || [0, 0, tWidth, tHeight];

        result.setTexMatrix();
      },
      setTexMatrix() {
        const srcX = imageSrcRect[0] || 0;
        const srcY = imageSrcRect[1] || 0;
        const srcWidth = imageSrcRect[2] || imageWidth;
        const srcHeight = imageSrcRect[3] || imageHeight;
        translation(srcX / imageWidth, srcY / imageHeight, texMatrix);
        scale(texMatrix, srcWidth / imageWidth, srcHeight / imageHeight, 1, texMatrix);
      },
      draw(needUpdateTexture = false) {
        const dstX = (imageRect[0] || 0) + x + borderWidth;
        const dstY = (imageRect[1] || 0) + y + borderWidth;
        const dstWidth = imageRect[2] || width;
        const dstHeight = imageRect[3] || height;

        let hasTexture = false;
        if (typeof backgroundImage !== 'undefined') {
          let texId = textureMap.get(backgroundImage);
          if (!texId) {
            texId = createTexture(gl);

            // 将图像上传到纹理
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImage);
            textureMap.set(backgroundImage, texId);
          }

          gl.bindTexture(gl.TEXTURE_2D, texId);

          // // scrollview每次重绘都需要更新纹理
          // if(needUpdateTexture) {
          //   // 将图像上传到纹理
          //   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImage);

          //   gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, backgroundImage)
          // }

          hasTexture = true;
        } else if (typeof backgroundImageData !== 'undefined') {
          let texId = textureMap.get(ArrayBuffer);
          if (!texId) {
            texId = createTexture(gl);
            textureMap.set(ArrayBuffer, texId);
          }
          gl.bindTexture(gl.TEXTURE_2D, texId);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            imageWidth,
            imageHeight,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            backgroundImageData,
          );
          hasTexture = true;
        } else {
          // gl.bindTexture(gl.TEXTURE_2D, blankTexId);
        }

        // // needUpdateTexture代表为scrollview
        // if (needUpdateTexture) {
        //   // 清除模板缓存
        //   gl.clear(gl.STENCIL_BUFFER_BIT);
        //   // 开启模板测试
        //   gl.enable(gl.STENCIL_TEST);

        //   // 设置模板测试参数
        //   gl.stencilFunc(gl.ALWAYS, 1, 1);
        //   // 设置模板值操作
        //   gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);
        // } else {
        //   gl.stencilFunc(gl.EQUAL, 1, 1);
        //   //设置模板测试后的操作
        //   gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
        // }

        // 所有绘制共用一个就行
        if (!hasSetuResolution) {
          gl.uniform2f(uResolution, gl.canvas.width, gl.canvas.height);
          hasSetuResolution = true;
        }

        gl.uniformMatrix4fv(uMatrix, false, matrix);
        // 设置矩形除去border左下角和右上角位置
        gl.uniform4f(uTexRect, dstX, dstY + dstHeight, dstX + dstWidth, dstY);
        // 设置完整矩形的位置
        gl.uniform4f(uRect, x, y + height, x + width, y);

        // 纹理设置
        gl.uniform4f(uBitset, hasTexture ? 1 : 0, 0, 0, 0);
        gl.uniformMatrix4fv(textureMatrixLocation, false, texMatrix);

        gl.uniform1i(uTex, 0);
        // gl.uniform4f(uColor, ...backgroundColor);
        gl.uniform4f(uColor, backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);

        // gl.uniform4f(uRadius, ...radius);
        gl.uniform4f(uRadius, radius[0], radius[1], radius[2], radius[3]);
        // gl.uniform4f(uBorderColor, ...borderColor);
        gl.uniform4f(uBorderColor, borderColor[0], borderColor[1], borderColor[2], borderColor[3]);

        gl.uniform1f(uOpacity, opacity);
        gl.uniform1f(uBorderWidth, borderWidth);

        // 因为count = 6，所以顶点着色器将运行6次
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
    };

    return result;
  };
}

export function setupGl(canvas, needFlipY = true) {
  if (!canvas.webgl) {
    const gl = canvas.getContext('webgl', {
      preserveDrawingBuffer: true,
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      depth: false,
      stencil: true,
    });
    gl.createRoundRect = useProgram(gl, needFlipY);
    canvas.webgl = gl; // eslint-disable-line
  }
  const gl = canvas.webgl;
  return gl;
}

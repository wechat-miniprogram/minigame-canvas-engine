attribute vec4 a_position;
uniform vec2 u_resolution;
uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;
uniform vec4 u_tex_rect;
varying vec2 v_resolution;
varying vec2 v_texcoord;
varying vec4 v_tex_rect;

/**
 * 屏幕像素坐标转换成裁剪空间坐标并且将坐标系的原点定位左上角
 */
vec2 pixel2coord(vec2 a, vec2 resolution) {
    // 从像素坐标转换到 0.0 到 1.0
    vec2 zeroToOne = a / resolution;

     // 再把 0->1 转换 0->2
    vec2 zeroTwo = zeroToOne * 2.0;

    // 把 0->2 转换到 -1->+1 (裁剪空间)
    vec2 clipSpace = zeroTwo - 1.0;

    // WebGL认为左下角是 0，0 。 想要像传统二维API那样起点在左上角，我们只需翻转y轴即可。
    return clipSpace * vec2(1, -1);
}

void main() {
    gl_Position = u_matrix * a_position;

    // 矩形左下角位置
    vec2 texRectBl = pixel2coord(u_tex_rect.xy, u_resolution);
    // 矩形右上角位置
    vec2 texRectTr = pixel2coord(u_tex_rect.zw, u_resolution);

    // 计算矩形的宽度
    float texRectWidth = texRectTr.x - texRectBl.x;
    // 计算矩形的高度
    float texRectHeight = texRectTr.y - texRectBl.y;

    vec4 tex_position = vec4(vec2((gl_Position.x - texRectBl.x) / texRectWidth, (texRectTr.y - gl_Position.y) / texRectHeight), 0, 1);

    v_resolution = u_resolution;
    v_texcoord = (u_textureMatrix * tex_position).xy;
    v_tex_rect = u_tex_rect;
}
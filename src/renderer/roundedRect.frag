precision mediump float;
uniform sampler2D u_texture;
uniform vec4 u_rect;
uniform vec4 u_color;
uniform vec4 u_radius;
uniform vec4 u_border_color;
uniform float u_border_width;
uniform float u_opacity;
uniform vec4 u_bitset; //texture[, context, border, radius]
varying vec2 v_resolution;
varying vec2 v_texcoord;
varying vec4 v_tex_rect;

// https://www.shadertoy.com/view/4llXD7
/**
 * function length — calculate the length of a vector
 * function normalize — calculates the unit vector in the same direction as the original vector
 */
float sdfRoundedRect(vec2 uv, vec2 center, vec2 size, vec4 r) {
  vec2 p = uv - center;
  // r.xy = (p.x > 0.0) ? r.xy : r.zw;
  r.xy = mix(r.xy, r.zw, step(p.x, 0.0));
  // r.x  = (p.y > 0.0) ? r.x  : r.y;
  r.x  = mix(r.x, r.y, step(p.y, 0.0));

  vec2 d = abs(p) - size + r.x;
  // return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r.x;
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r.x;
}

/**
 * 屏幕像素坐标转换成裁剪空间坐标
 */
vec2 pixel2coord (vec2 p) {
  return (2.0 * vec2(p.x, v_resolution.y - p.y) - v_resolution) / v_resolution.y;
}

vec4 blend(vec4 cb, vec4 ca) {
  float alpha = ca.a + cb.a * (1.0 - ca.a);
  // return mix(vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha), vec4(0.0), step(abs(alpha), 0.0));
  return alpha == 0.0 ? vec4(0.0) : vec4(  (ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)  ) / alpha, alpha);
}

void main() {
    float anti = 0.003;
    // 归一化坐标
    vec2 p = (2.0 * gl_FragCoord.xy - v_resolution) / v_resolution.y;
    vec4 radius = u_radius * 2.0 / v_resolution.y;
    float borderWidth = u_border_width * 2.0 / v_resolution.y;

    // 矩形左上角
    vec2 lt = pixel2coord(u_rect.xw);
    // 矩形右下角
    vec2 rb = pixel2coord(u_rect.zy);
    // 矩形中心
    vec2 center = (rb + lt) / 2.;
    // 矩形尺寸
    vec2 size = abs(rb - lt) / 2.;
    // 矩形的radius
    vec4 corners = vec4(radius.y, radius.z, radius.x, radius.w);

    float border = sdfRoundedRect(p, center, size, corners);

    float content = sdfRoundedRect(p, center, size - borderWidth, corners - borderWidth);

    // 纹理左上角
    vec2 texLt = pixel2coord(v_tex_rect.xw);
    // 纹理右下角
    vec2 texRb = pixel2coord(v_tex_rect.zy);
    // 纹理中心
    vec2 texCenter = (texRb + texLt) / 2.;
    // 纹理尺寸
    vec2 texSize = abs(texRb - texLt) / 2.;

    float texContent = sdfRoundedRect(p, texCenter, texSize, vec4(0.));

    vec4 borderColor = u_border_color;
    borderColor.a *= smoothstep(-anti, anti, -max(border, -content));
    vec4 contentColor = u_color;
    contentColor.a *= smoothstep(-anti, anti, -content);
    vec4 textureColor = mix(texture2D(u_texture, v_texcoord), vec4(0.0), step(abs(u_bitset.x), 0.0));
    textureColor.rgb /= mix(textureColor.a, 1.0, step(textureColor.a, 0.0));
    textureColor.a *= sign(-texContent) * smoothstep(-anti, anti, -content);

    vec4 temp = blend(blend(contentColor, textureColor), borderColor);
    temp.a *= u_opacity;

    gl_FragColor = temp;
}

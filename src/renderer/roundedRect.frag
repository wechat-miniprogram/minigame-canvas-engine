precision mediump float;
uniform sampler2D u_texture;
uniform vec4 u_rect;
uniform vec4 u_color;
uniform vec4 u_radius;
uniform vec4 u_border_color;
uniform float u_border_width;
uniform vec4 u_bitset; //texture[, context, border, radius]
varying vec2 v_resolution;
varying vec2 v_texcoord;
varying vec4 v_tex_rect;

// float sdfBox(vec2 coord, vec2 center, vec2 rect) {
//   vec2 d = abs(coord - center) - rect;
//   return min(max(d.x,d.y),0.0) + length(max(d,0.0));
// }
// float sdfCircle(vec2 coord, vec2 center, float radius) {
//   return length(coord - center) - radius;
// }
// vec3 createCorner(vec2 dir, float raidus, float sign, float stroke) {
//   return vec3(dir + sign * raidus, raidus - stroke);
// }
// float getCorner(vec2 p, vec3 corner) {
//   return sdfCircle(p, corner.xy, corner.z);
// }
// float getCenter(vec2 p, vec3 from, vec3 to, vec2 r) {
//   return sdfBox(p, (from + to).xy / 2., r - abs(from + to).z/2.);
// }
// float getHEdge(vec2 p, vec3 from, vec3 to) {
//   return sdfBox(p,
//   vec2((from.x + to.x)/2., sign(from.y) * min(abs(from.y), abs(to.y))),
//   vec2(abs(from.x - to.x)/2., max(from.z, to.z)));
// }
// float getVEdge(vec2 p, vec3 from, vec3 to) {
//   return sdfBox(p,
//   vec2(sign(from.x) * min(abs(from.x), abs(to.x)), (from.y + to.y)/2.),
//   vec2(max(from.z, to.z), abs(from.y - to.y)/2.));
// }
// float drawRect(vec2 p, vec2 lt, vec2 rt, vec2 rb, vec2 lb, vec4 corners, float stroke) {
//   vec3 cLt = vec3(vec2(lt.x + corners.x, lt.y - corners.x), corners.x - stroke);
//   vec3 cRt = vec3(vec2(rt.x - corners.y, rt.y - corners.y), corners.y - stroke);
//   vec3 cRb = vec3(vec2(rb.x - corners.z, rb.y + corners.z), corners.z - stroke);
//   vec3 cLb = vec3(vec2(lb.x + corners.w, lb.y + corners.w), corners.w - stroke);

//   float circle = getCorner(p, cLt);
//   circle = min(circle, getCorner(p, cRt));
//   circle = min(circle, getCorner(p, cRb));
//   circle = min(circle, getCorner(p, cLb));

//   float box = getHEdge(p, cLt, cRt);
//   box = min(box, getHEdge(p, cLb, cRb));
//   box = min(box, getVEdge(p, cLt, cLb));
//   box = min(box, getVEdge(p, cRt, cRb));
//   float center = sdfBox(p, (cRt + cLb).xy / 2., vec2((cRt.x - cLb.x) / 2., (cRt.y - cLb.y) / 2.));
//   center = max(center, sdfBox(p, (cRb + cLt).xy / 2., vec2((cRb.x - cLt.x) / 2., (cLt.y - cRb.y) / 2.)));
//   box = min(box, center);

//   return min(circle, box);
// }

// https://www.shadertoy.com/view/4llXD7
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

vec2 pixel2coord (vec2 p) {
  return (2.0 * vec2(p.x, v_resolution.y - p.y) - v_resolution) / v_resolution.y;
}

vec4 blend(vec4 cb, vec4 ca) {
  float alpha = ca.a + cb.a * (1.0 - ca.a);
  return mix(vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha), vec4(0.0), step(abs(alpha), 0.0));
  // return alpha == 0.0 ? vec4(0.0) : vec4((ca.rgb * ca.a + cb.rgb * cb.a * (1.0 - ca.a)) / alpha, alpha);
}

void main() {
    float anti = 0.003;
    vec2 p = (2.0 * gl_FragCoord.xy - v_resolution) / v_resolution.y;
    vec4 radius = u_radius * 2.0 / v_resolution.y;
    float borderWidth = u_border_width * 2.0 / v_resolution.y;

    vec2 lt = pixel2coord(u_rect.xw);
    vec2 rb = pixel2coord(u_rect.zy);
    vec2 center = (rb + lt) / 2.;
    vec2 size = abs(rb - lt) / 2.;
    vec4 corners = vec4(radius.y, radius.z, radius.x, radius.w);
    float border = sdfRoundedRect(p, center, size, corners);
    float content = sdfRoundedRect(p, center, size - borderWidth, corners - borderWidth);

    vec2 texLt = pixel2coord(v_tex_rect.xw);
    vec2 texRb = pixel2coord(v_tex_rect.zy);
    vec2 texCenter = (texRb + texLt) / 2.;
    vec2 texSize = abs(texRb - texLt) / 2.;
    float texContent = sdfRoundedRect(p, texCenter, texSize, vec4(0.));

    vec4 borderColor = u_border_color;
    borderColor.a *= smoothstep(-anti, anti, -max(border, -content));
    vec4 contentColor = u_color;
    contentColor.a *= smoothstep(-anti, anti, -content);
    vec4 textureColor = mix(texture2D(u_texture, v_texcoord), vec4(0.0), step(abs(u_bitset.x), 0.0));
    textureColor.rgb /= mix(textureColor.a, 1.0, step(textureColor.a, 0.0));
    textureColor.a *= sign(-texContent) * smoothstep(-anti, anti, -content);
    gl_FragColor = blend(blend(contentColor, textureColor), borderColor);
}

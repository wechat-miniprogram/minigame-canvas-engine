attribute vec4 a_position;
uniform vec2 u_resolution;
uniform mat4 u_matrix;
uniform mat4 u_textureMatrix;
uniform vec4 u_tex_rect;
varying vec2 v_resolution;
varying vec2 v_texcoord;
varying vec4 v_tex_rect;

vec2 pixel2coord(vec2 a, vec2 resolution) {
    vec2 zeroToOne = a / resolution;
    vec2 zeroTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroTwo - 1.0;
    return clipSpace * vec2(1, -1);
}

void main() {
    gl_Position = u_matrix * a_position;

    vec2 texRectBl = pixel2coord(u_tex_rect.xy, u_resolution);
    vec2 texRectTr = pixel2coord(u_tex_rect.zw, u_resolution);
    float texRectWidth = texRectTr.x - texRectBl.x;
    float texRectHeight = texRectTr.y - texRectBl.y;

    vec4 tex_position = vec4(vec2((gl_Position.x - texRectBl.x) / texRectWidth, (texRectTr.y - gl_Position.y) / texRectHeight), 0, 1);

    v_resolution = u_resolution;
    v_texcoord = (u_textureMatrix * tex_position).xy;
    v_tex_rect = u_tex_rect;
}
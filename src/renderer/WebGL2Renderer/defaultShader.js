const vertex = `#version 300 es
  uniform float pointsize;
  in vec2 pos;

  out float size;
  void main() {
    size = pointsize;
    gl_PointSize = pointsize;
    gl_Position = vec4(pos, 1.0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;

  uniform sampler2D img;
  uniform vec2 frame;
  in float size;

  out vec4 col;
  void main() {
    vec2 ratio = size / vec2(textureSize(img, 0));
    vec4 tex = texture(img, gl_PointCoord * ratio + frame * ratio);
    col = tex;
    if (col.a == 0.0)
      discard;
  }
`;

export default {
  vertex,
  fragment
};

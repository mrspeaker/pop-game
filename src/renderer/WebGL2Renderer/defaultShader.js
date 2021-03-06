const vertex = `#version 300 es
  uniform vec2 resolution;

  in vec2 pos;
  in float pointsize;
  in vec2 frame;

  out float size;
  out vec2 uv;
  void main() {
    size = pointsize;
    uv = frame;

    gl_PointSize = pointsize;
    gl_Position = vec4((2.0 * ((pos + size / 2.0) / resolution) - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;

  uniform sampler2D img;
  in float size;
  in vec2 uv;

  out vec4 col;
  void main() {
    vec2 ratio = size / vec2(textureSize(img, 0));
    col = texture(img, gl_PointCoord * ratio + uv * ratio);
    if (col.a == 0.0) discard;
  }
`;

export default {
  vertex,
  fragment
};

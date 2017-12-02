const vertex = `#version 300 es
  in vec2 pos;
  in vec2 uv;

  out vec2 uvoff;
  void main() {
    uvoff = uv;
    gl_PointSize = 50.0;
    gl_Position = vec4(pos, 1.0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;
  uniform sampler2D img;

  out vec4 col;
  in vec2 uvoff;
  void main() {
    col = texture(img, gl_PointCoord.xy);
    if (col.a == 0.0)
      discard;
  }
`;

export default {
  vertex,
  fragment
};

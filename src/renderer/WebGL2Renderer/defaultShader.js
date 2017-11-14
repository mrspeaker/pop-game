const vertex = `#version 300 es
  void main() {
    gl_PointSize = 32.0;
    gl_Position = vec4(0, 0, 0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;

  out vec4 color;
  void main() {
    color = vec4(1.0, 0.5, 0.0, 1.0);
  }
`;

export default {
  vertex,
  fragment
};

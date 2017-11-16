const vertex = `#version 300 es

  in vec2 pos;

  void main() {
    gl_PointSize = 32.0;
    gl_Position = vec4(pos, 0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;
  uniform vec4 color;
  out vec4 c;
  void main() {
    if (distance(gl_PointCoord.xy, vec2(0.5, 0.5)) < 0.5) {
      c = color;
    } else {
      discard;
    }
  }
`;

export default {
  vertex,
  fragment
};

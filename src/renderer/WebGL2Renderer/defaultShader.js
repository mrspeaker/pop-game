const vertex = `#version 300 es
  in vec2 pos;
  in vec2 uv;

  out vec2 uvoff;
  out vec2 posoff;
  void main() {
    uvoff = uv;
    posoff = pos;
    gl_PointSize = 64.0;
    gl_Position = vec4(pos, 1.0, 1.0);
  }
`;

const fragment = `#version 300 es
  precision mediump float;
  uniform sampler2D img;

  in vec2 uvoff;
  in vec2 posoff;
  out vec4 col;
  void main() {
    vec4 tex = texture(img, gl_PointCoord.xy);
    vec4 hueShift = vec4(sin(posoff.x), sin(posoff.y) - 0.6, 0, 0);
    col = tex + hueShift;
    if (col.a == 0.0)
      discard;
  }
`;

export default {
  vertex,
  fragment
};

export const createProgram = (gl, vs_src, fs_src) => {
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vs_src);
  gl.compileShader(vs);
  if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    throw new Error("Vertex shader error: " + gl.getShaderInfoLog(vs));
  }

  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fs_src);
  gl.compileShader(fs);
  if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    throw new Error("Fragment shader error: " + gl.getShaderInfoLog(fs));
  }

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program));
  }

  gl.useProgram(program);

  return program;
};

let texId = 0;
const textures = {};
export function getTexture(gl, popTexture) {
  const { img } = popTexture;
  const { src } = img;
  if (textures[src]) {
    return textures[src];
  }
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + texId);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  textures[src] = {
    id: texId,
    tex
  };
  texId++;
  return tex;
}

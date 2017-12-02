import * as glutils from "./glutils";
import defaultShader from "./defaultShader";

const textures = {};
function getGLTexture(gl, popTexture) {
  const { img } = popTexture;
  const { src } = img;
  if (textures[src]) {
    return textures[src];
  }
  const texId = 0;
  const tex = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + texId);
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  textures[src] = tex;
  return tex;
}

class WebGL2Renderer {
  constructor(w, h) {
    const canvas = document.createElement("canvas");
    this.w = canvas.width = w;
    this.h = canvas.height = h;
    this.view = canvas;
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      throw new Error("WebGL2 not available");
    }
    this.ctx = gl;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.textures = {};
    const program = glutils.createProgram(
      gl,
      defaultShader.vertex,
      defaultShader.fragment
    );

    this.programs = {
      default: {
        program,
        attribs: {
          pos: gl.getAttribLocation(program, "pos"),
          uv: gl.getAttribLocation(program, "uv"),
        },
        uniforms: {
          color: gl.getUniformLocation(program, "img")
        }
      }
    };
    this.program = this.programs.default;
  }

  render(container, overwrite = false) {
    // Render the container
    const { ctx: gl, w, h, program } = this;

    function render(container) {
      // Render the container children
      container.children.forEach(child => {
        // Don't render self (or children) if not visible
        if (child.visible === false || child.alpha === 0) {
          return;
        }

        // Apply alpha
        // Apply pivot
        // Apply translate
        // Apply scale
        // Apply rotation

        if (child.text) {
          // Render text
        } else if (child.style && child.w && child.h) {
          // Render solid rectangle
        } else if (child.path) {
          // Render path
        } else if (child.texture) {
          const texture = getGLTexture(gl, child.texture);

          const img = child.texture.img;
          if (child.tileW) {
            // Render tile
          } else {
            // Render full texture
          }
          gl.vertexAttrib2f(
            program.attribs.pos,
            child.pos.x / w * 2 - 1,
            (1 - child.pos.y / h) * 2 - 1
          );
          //gl.uniform4f(program.uniforms.color, 1, 0.3, 0.3, 1);
          gl.drawArrays(gl.POINTS, 0, 1);
        }

        if (child.children) {
          render(child);
        }
      });
    }

    if (!overwrite) {
      // Clear background.
    }
    render(container);
  }
}

export default WebGL2Renderer;

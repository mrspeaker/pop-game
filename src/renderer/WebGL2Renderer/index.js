import * as glutils from "./glutils";
import defaultShader from "./defaultShader";

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

    gl.clearColor(0, 0, 0, 0);
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
          uv: gl.getAttribLocation(program, "uv")
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
        // Apply translate (use affine)
        //  Apply scale
        //  Apply rotation

        if (child.text) {
          // Render text... cache as bitmap?
        } else if (child.style && child.w && child.h) {
          // Render solid rectangle
        } else if (child.path) {
          // Render path
        } else if (child.texture) {
          glutils.getTexture(gl, child.texture);
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

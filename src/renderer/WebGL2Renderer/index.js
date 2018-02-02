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
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const program = glutils.createProgram(
      gl,
      defaultShader.vertex,
      defaultShader.fragment
    );

    this.programs = {
      default: {
        program,
        attribs: {
          pos: gl.getAttribLocation(program, "pos")
        },
        uniforms: {
          img: gl.getUniformLocation(program, "img"),
          pointsize: gl.getUniformLocation(program, "pointsize"),
          frame: gl.getUniformLocation(program, "frame")
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

        // TODO: Apply alpha
        // TODO: Apply pivot
        // TODO: Apply translate
        // TODO: Apply scale
        // TODO: Apply rotation

        if (child.text) {
          // TODO: Render text... cache as bitmap?
        } else if (child.style && child.w && child.h) {
          // TODO: Render solid rectangle
        } else if (child.path) {
          // TODO: Render path
        } else if (child.texture) {
          const tex = glutils.getTexture(gl, child.texture);
          if (child.tileW) {
            // Render tile
            gl.uniform1f(program.uniforms.pointsize, child.tileW);
            gl.uniform2f(program.uniforms.frame, child.frame.x, child.frame.y);
          } else {
            // Render full texture
            gl.uniform1f(program.uniforms.pointsize, child.w);
            gl.uniform2f(program.uniforms.frame, 0, 0);
          }
          gl.uniform1i(program.uniforms.img, tex.id);
          gl.vertexAttrib2f(
            program.attribs.pos,
            child.pos.x / w * 2 - 1,
            (1 - child.pos.y / h) * 2 - 1
          );
          // TODO: Use geom, not Point Sprites. for one thing - points must be squares! Sorry.
          gl.drawArrays(gl.POINTS, 0, 1);
        }

        if (child.children) {
          render(child);
        }
      });
    }

    if (!overwrite) {
      // TODO: Clear/don't clear background.
    }
    render(container);
  }
}

export default WebGL2Renderer;

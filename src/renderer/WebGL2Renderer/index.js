import * as glutils from "./glutils.js";
import defaultShader from "./defaultShader.js";

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
          pos: gl.getAttribLocation(program, "pos"),
          pointsize: gl.getAttribLocation(program, "pointsize"),
          frame: gl.getAttribLocation(program, "frame")
        },
        uniforms: {
          img: gl.getUniformLocation(program, "img"),
          res: gl.getUniformLocation(program, "resolution"),
        },
        buffers: {
          pos: gl.createBuffer()
        }
      }
    };
    this.program = this.programs.default;

    const p = this.program;
    gl.enableVertexAttribArray(p.attribs.pos);
    gl.enableVertexAttribArray(p.attribs.pointsize);
    gl.enableVertexAttribArray(p.attribs.frame);
  }

  render(container, overwrite = false) {
    // Render the container
    const { ctx: gl, w, h, program } = this;

    const sprites = [];
    let nbPoints = 0;
    function addSprite (pos, size, frameX = 0, frameY = 0) {
      sprites.push(pos.x, pos.y, size, frameX, frameY);
      nbPoints++;
    }

    function render(container) {
      // Render the container children
      container.children.forEach(child => {
        // Don't render self (or children) if not visible
        if (child.visible === false || child.alpha === 0) {
          return;
        }

        // TODO: Apply alpha
        // (transforms...)
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
            addSprite(child.pos, child.tileW, child.frame.x, child.frame.y, tex.id);
          } else {
            // Render full texture
            addSprite(child.pos, child.w);
          }
          //gl.uniform1i(program.uniforms.img, tex.id);
        }

        if (child.children) {
          render(child);
        }
      });

      gl.uniform1i(program.uniforms.img, 0);
      gl.uniform2f(program.uniforms.res, w, h);
      gl.bindBuffer(gl.ARRAY_BUFFER, program.buffers.pos);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sprites), gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(program.attribs.pos, 2, gl.FLOAT, false, 5 * 4, 0);
      gl.vertexAttribPointer(program.attribs.pointsize, 1, gl.FLOAT, false, 5 * 4, 8);
      gl.vertexAttribPointer(program.attribs.frame, 2, gl.FLOAT, false, 5 * 4, 12);

      gl.drawArrays(gl.POINTS, 0, nbPoints);
    }

    if (!overwrite) {
      // TODO: Clear/don't clear background.
    }
    render(container);
  }
}

export default WebGL2Renderer;

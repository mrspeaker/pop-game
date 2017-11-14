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

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    glutils.createProgram(gl, defaultShader.vertex, defaultShader.fragment);
  }

  render(container, overwrite = false) {
    // Render the container
    const { ctx:gl, h } = this;

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
          const img = child.texture.img;
          if (child.tileW) {
            // Render tile
          } else {
            // Render full texture
          }
          gl.drawArrays(gl.POINTS, 0, 1);
        }

        if (child.children) {
          render(child);
        }
      });
    }

    gl.enable(gl.SCISSOR_TEST);
    if (!overwrite) {
      // Clear background.
    }
    render(container);
    gl.disable(gl.SCISSOR_TEST);
  }
}

export default WebGL2Renderer;
class CanvasRenderer {
  constructor(w, h) {
    const canvas = document.createElement("canvas");
    this.w = canvas.width = w;
    this.h = canvas.height = h;
    this.view = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = "top";
  }

  render(container, clear = true) {
    if (container.visible === false) {
      return;
    }
    const { ctx } = this;

    function renderRec(container) {
      // Render the container children
      container.children.forEach(child => {
        // Don't render self (or children) if not visible
        if (child.visible === false || child.alpha === 0) {
          return;
        }

        ctx.save();
        if (child.alpha) {
          ctx.globalAlpha = child.alpha;
        }

        let px = child.pivot ? child.pivot.x : 0;
        let py = child.pivot ? child.pivot.y : 0;
        if (child.pos) {
          ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
        }
        if (child.scale) {
          ctx.scale(child.scale.x, child.scale.y);
        }
        if (child.rotation) {
          ctx.translate(px, py);
          ctx.rotate(child.rotation);
          ctx.translate(-px, -py);
          px = 0;
          py = 0;
        }

        if (child.text) {
          const { align, fill, font, stroke, lineWidth } = child.style;
          if (font) ctx.font = font;
          if (align) ctx.textAlign = align;
          if (fill) {
            ctx.fillStyle = fill;
            ctx.fillText(child.text, -px, -py);
          }
          if (stroke) {
            ctx.strokeStyle = stroke;
            ctx.lineWidth = lineWidth || 1;
            ctx.strokeText(child.text, -px, -py);
          }
        } else if (child.style && child.w && child.h) {
          ctx.fillStyle = child.style.fill;
          ctx.fillRect(-px, -py, child.w, child.h);
        } else if (child.path) {
          const [head, ...tail] = child.path;
          if (tail.length > 0) {
            ctx.fillStyle = child.style.fill || "#fff";
            ctx.beginPath();
            ctx.moveTo(head.x, head.y);
            tail.forEach(({ x, y }) => ctx.lineTo(x, y));
            ctx.closePath();
            ctx.fill();
          }
        } else if (child.texture) {
          const img = child.texture.img;
          if (child.tileW) {
            ctx.drawImage(
              img,
              child.frame.x * child.tileW,
              child.frame.y * child.tileH,
              child.tileW,
              child.tileH,
              -px,
              -py,
              child.tileW,
              child.tileH
            );
          } else {
            ctx.drawImage(img, -px, -py);
          }
        }

        // Handle the child types
        if (child.children) {
          renderRec(child);
        }

        ctx.restore();
      });
    }

    if (clear) {
      ctx.clearRect(0, 0, this.w, this.h);
    }
    renderRec(container);
  }
}

export default CanvasRenderer;

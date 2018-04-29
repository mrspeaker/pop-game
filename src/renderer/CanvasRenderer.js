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
    if (container.visible == false) {
      return;
    }
    const { ctx } = this;

    function renderRec(container) {
      if (container.visible === false || container.alpha === 0) {
        return;
      }
      if (container.alpha) {
        ctx.save();
        ctx.globalAlpha = container.alpha;
      }

      // Render the container children
      container.children.forEach(child => {
        if (child.visible == false || child.alpha === 0) {
          return;
        }
        ctx.save();
        if (child.alpha) {
          ctx.globalAlpha = child.alpha;
        }

        // Handle transforms
        if (child.pos) {
          ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
        }
        if (child.anchor) ctx.translate(child.anchor.x, child.anchor.y);
        if (child.scale) ctx.scale(child.scale.x, child.scale.y);
        if (child.rotation) {
          const px = child.pivot ? child.pivot.x : 0;
          const py = child.pivot ? child.pivot.y : 0;
          ctx.translate(px, py);
          ctx.rotate(child.rotation);
          ctx.translate(-px, -py);
        }

        // Draw the leaf nodes
        if (child.text) {
          const { font, fill, align } = child.style;
          if (font) ctx.font = font;
          if (fill) ctx.fillStyle = fill;
          if (align) ctx.textAlign = align;
          ctx.fillText(child.text, 0, 0);
        } else if (child.texture) {
          const img = child.texture.img;
          if (child.tileW) {
            ctx.drawImage(
              img,
              child.frame.x * child.tileW,
              child.frame.y * child.tileH,
              child.tileW,
              child.tileH,
              0,
              0,
              child.tileW,
              child.tileH
            );
          } else {
            ctx.drawImage(img, 0, 0);
          }
        } else if (child.style && child.w && child.h) {
          ctx.fillStyle = child.style.fill;
          ctx.fillRect(0, 0, child.w, child.h);
        } else if (child.path) {
          const [head, ...tail] = child.path;
          if (child.path.length > 1) {
            ctx.fillStyle = child.style.fill || "#fff";
            ctx.beginPath();
            ctx.moveTo(head.x, head.y);
            tail.forEach(({ x, y }) => ctx.lineTo(x, y));
            ctx.closePath();
            ctx.fill();
          }
        }

        // Render any child sub-nodes
        if (child.children) {
          renderRec(child);
        }
        ctx.restore();
      });

      if (container.alpha) {
        ctx.restore();
      }
    }

    if (clear) {
      ctx.clearRect(0, 0, this.w, this.h);
    }
    renderRec(container);
  }
}

export default CanvasRenderer;

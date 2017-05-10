class CanvasRenderer {
  constructor(w, h) {
    const canvas = document.createElement("canvas");
    this.w = (canvas.width = w);
    this.h = (canvas.height = h);
    this.view = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }

  render(container) {
    // Render the container
    const { ctx } = this;

    function render(container) {
      // Render the container children
      container.children.forEach(child => {
        // Don't render self (or children) if not visible
        if (child.visible == false) {
          ctx.restore();
          return;
        }
        ctx.save();

        let px = child.pivot ? child.pivot.x : 0;
        let py = child.pivot ? child.pivot.y : 0;
        if (child.pos) ctx.translate(child.pos.x, child.pos.y);
        if (child.scale) ctx.scale(child.scale.x, child.scale.y);
        if (child.rotation) {
          ctx.translate(px, py);
          ctx.rotate(child.rotation);
          ctx.translate(-px, -py);
          px = 0;
          py = 0;
        }

        if (child.text) {
          ctx.font = child.style.font;
          ctx.fillStyle = child.style.fill;
          ctx.fillText(child.text, -px, -py);
        } else if (child.style && child.w && child.h) {
          ctx.fillStyle = child.style.fill;
          ctx.fillRect(-px, -py, child.w, child.h);
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
          render(child);
        }

        ctx.restore();
      });
    }

    ctx.clearRect(0, 0, this.w, this.h);
    render(container);
  }
}

export default CanvasRenderer;
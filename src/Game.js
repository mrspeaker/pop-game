import Container from "./Container";
import Assets from "./Assets";
import CanvasRenderer from "./renderer/CanvasRenderer";
import screenCapture from "./utils/screenCapture";

class Game {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.renderer = new CanvasRenderer(w, h);
    document.querySelector("#board").appendChild(this.renderer.view);
    screenCapture(this.renderer.view);

    this.scene = new Container();
  }

  run(gameUpdate = () => {}) {
    Assets.addReadyListener(() => {
      let dt, last;

      const loopy = t => {
        requestAnimationFrame(loopy);

        if (!last) { last = t; }
        dt = Math.min(t - last, 166) / 1000;
        last = t;

        this.scene.update(dt, t);
        gameUpdate(dt, t);
        this.renderer.render(this.scene);
      };
      requestAnimationFrame(loopy);
    });
  }
}

export default Game;
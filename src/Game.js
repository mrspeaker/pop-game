import Assets from "./Assets";
import Container from "./Container";
import CanvasRenderer from "./renderer/CanvasRenderer";
import screenCapture from "./utils/screenCapture";

const STEP = 1 / 60;
const MULTIPLIER = 1;
const SPEED = STEP * MULTIPLIER;
const MAX_FRAME = SPEED * 5 * 1000;

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
    Assets.onReady(() => {
      let dt = 0;
      let last = 0;

      const loopy = t => {
        requestAnimationFrame(loopy);

        const elapsed = t - last;
        dt += Math.min(elapsed, MAX_FRAME) / 1000;
        last = t;

        while (dt >= SPEED) {
          this.scene.update(STEP, t);
          gameUpdate(STEP, t);
          dt -= SPEED;
        }
        this.renderer.render(this.scene, dt / SPEED);

      };
      requestAnimationFrame(loopy);
    });
  }
}

export default Game;

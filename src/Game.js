import Assets from "./Assets";
import Container from "./Container";
import CanvasRenderer from "./renderer/CanvasRenderer";
import WebGL2Renderer from "./renderer/WebGL2Renderer";
import screenCapture from "./utils/screenCapture";

const STEP = 1 / 60;
const MULTIPLIER = 1;
const SPEED = STEP * MULTIPLIER;
const MAX_FRAME = SPEED * 10;

class Game {
  constructor(w, h, parent = "#board", useWebGL) {
    this.w = w;
    this.h = h;
    this.renderer = useWebGL
      ? new WebGL2Renderer(w, h)
      : new CanvasRenderer(w, h);
    document.querySelector(parent).appendChild(this.renderer.view);
    screenCapture(this.renderer.view);

    this.scene = new Container();
  }

  run(gameUpdate = () => {}) {
    Assets.onReady(() => {
      let dt = 0;
      let last = 0;

      const loopy = ms => {
        requestAnimationFrame(loopy);

        const t = ms / 1000; // Let's work in seconds
        dt += Math.min(t - last, MAX_FRAME);
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

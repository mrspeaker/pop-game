import Assets from "./Assets.js";
import Container from "./Container.js";
import CanvasRenderer from "./renderer/CanvasRenderer.js";
import WebGL2Renderer from "./renderer/WebGL2Renderer/index.js";
import screenCapture from "./utils/screenCapture.js";

const STEP = 1 / 60;
let MULTIPLIER = 1;
let SPEED = STEP * MULTIPLIER;
const MAX_FRAME = SPEED * 5 * 1000;

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
    this.destination = null;

    this.wipeTime = 0;
    this.wipeDuration = 0;
  }

  setScene(scene, doWipe, duration = 0.5) {
    scene.startTime = this.t;
    if (!doWipe) {
      this.scene = scene;
      return;
    }
    this.destination = scene;
    this.wipeTime = duration;
    this.wipeDuration = duration;
  }

  run(gameUpdate = () => {}) {
    Assets.onReady(() => {
      let dt = 0;
      let last = 0;

      // loopy is now an arrow function to scope `this`.
      const loopy = ms => {
        const { scene, renderer, wipeTime } = this;

        const t = ms / 1000;
        dt += Math.min(t - last, MAX_FRAME);
        last = t;

        while (dt >= SPEED) {
          scene.update(STEP, t);
          gameUpdate(STEP, t);
          dt -= SPEED;
        }
        renderer.render(scene, dt / SPEED, false);

        // Screen transition
        if (wipeTime > 0) {
          const { wipeDuration, destination } = this;
          const ratio = wipeTime / wipeDuration;
          scene.alpha = ratio;
          destination.alpha = 1 - ratio;
          renderer.render(destination, dt / SPEED, true);
          if ((this.wipeTime -= STEP) <= 0) {
            this.scene = destination;
            this.destination = null;
          }
        }
        requestAnimationFrame(loopy);
      };

      // Initialize the timer
      const init = ms => {
        last = ms / 1000;
        requestAnimationFrame(loopy);
      };
      requestAnimationFrame(init);
    });
  }
  get speed() {
    return MULTIPLIER;
  }
  set speed(speed) {
    MULTIPLIER = speed;
    SPEED = STEP * MULTIPLIER;
  }
}

export default Game;

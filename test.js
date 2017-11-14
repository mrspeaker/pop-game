import pop from "./src";
const { Game, KeyControls } = pop;

const game = new Game(800, 600, Math.random() < 0.5);
const { scene, w, h } = game;

const controls = new KeyControls();

const sprite = scene.make.tileSprite("res/images/crabz.png", 71, 57);
const { pos, frame } = sprite;
pos.x = w / 2 - 50;
pos.y = h / 2 - 100;

game.run((dt, t) => {
  const { x } = controls;
  pos.x += 200 * dt * Math.sign(x);
  pos.y += Math.sin(t / 100) * 20 * dt;

  frame.x = t / 40 % 12 | 0;
});

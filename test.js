import pop from "./src";
const { Game, KeyControls } = pop;

const game = new Game(800, 600, true);
const { scene, w, h } = game;

const controls = new KeyControls();

const sprite = scene.make.tileSprite("res/images/crabz.png", 71, 57);
const { pos, frame } = sprite;
pos.x = w / 2 - 50;
pos.y = h / 2 - 100;

for (let i = 0; i < 20; i++) {
  scene.make
    .tileSprite("res/images/crabz.png", 71, 57)
    .pos.set((Math.random() * w) | 0, (Math.random() * h) | 0);
}

game.run((dt, t) => {
  const { x } = controls;
  pos.x += 200 * dt * Math.sign(x);
  pos.y += Math.sin(t / 100) * 20 * dt;

  frame.x = ((t / 40) % 12) | 0;
});

import pop from "./src";
const { Game, KeyControls } = pop;

const game = new Game(800, 600, true);
const { scene, w, h } = game;

const controls = new KeyControls();

const sprite = scene.make.sprite("/res/images/greona.png");
const { pos } = sprite;
pos.x = w / 2 - 50;
pos.y = h / 2 - 100;

for (let i = 0; i < 20; i++) {
  scene.make
    .sprite("res/images/greona.png")
    .pos.set((Math.random() * w) | 0, (Math.random() * h) | 0);
}

game.run((dt, t) => {
  const { x } = controls;
  pos.x += 200 * dt * Math.sign(x);
  pos.y += Math.sin(t / 100) * 20 * dt;
});

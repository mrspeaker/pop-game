import pop from "./src";
const { Game, KeyControls, math, Matrix } = pop;

const game = new Game(800, 600, "#board");
const { scene, w, h } = game;

const controls = new KeyControls();

const sprite = scene.make.sprite("/res/images/greona.png");
const { pos } = sprite;
pos.x = w / 2 - 50;
pos.y = h / 2 - 100;

//Affine Transformation Matrices
const m1 = new Matrix();
//m1.rotate(Math.PI);
m1.translate(200, 100);
m1.scale(2.5, 1.5);
console.log(m1.toString(), m1.getScale());
// https://math.stackexchange.com/questions/13150/extracting-rotation-scale-values-from-2d-transformation-matrix/13165#13165

sprite.pos.copy(m1.getPos());
sprite.scale = m1.getScale();

let last;
for (let i = 0; i < 20; i++) {
  last = scene.make
    .sprite("res/images/greona.png");
    last
    .pos.set(math.rand(0, w), math.rand(0, h));
}
last.pos.x = pos.x + 50;
last.pos.y = pos.y;
game.run((dt, t) => {
  const { x } = controls;
  pos.x += 200 * dt * Math.sign(x);
  //pos.x += Math.cos(t * 10) * 200 * dt;
  let y = Math.sin(t * 10) * 200;
  y += Math.sin(t * 11) * 200;
  pos.y += y * dt;

  last.pos.y += Math.sin(t * 10) * 200 * dt;
  last.pos.y += Math.sin(t * 11) * 200 * dt;

  m1.rotate(0.1);
  sprite.rotation = m1.getRotation();
});

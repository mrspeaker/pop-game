import pop from "../src/index.js";
const { Game, Text } = pop;

const game = new Game(480, 300, "#board");
const time = game.scene.add(new Text(""));

game.run((dt, t) => {
  time.text = `Current game time: ${t}`;
});

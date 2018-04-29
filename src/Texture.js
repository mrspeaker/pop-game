import Assets from "./Assets.js";

class Texture {
  constructor (url) {
    this.img = Assets.image(url);
  }
}

export default Texture;

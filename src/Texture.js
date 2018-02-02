import Assets from "./Assets";

class Texture {
  constructor(url) {
    this.img = Assets.image(url);
  }

  get w () {
    return this.img.width;
  }

  get h () {
    return this.img.height;
  }
}

export default Texture;

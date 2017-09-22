import Sound from "./Sound";

class SoundPool {
  constructor(src, options = {}, poolSize = 3) {
    this.count = 0;
    this.sounds = Array.from(
      Array(poolSize),
      () => new Sound(src, options));
  }

  // play one of audio instance of the pool
  play(options) {
    const { sounds } = this;
    const index = this.count++ % sounds.length;
    sounds[index].play(options);
  }

  // stop ALL audio instance of the pool
  stop() {
    this.sounds.forEach(sound => sound.stop());
  }
}

export default SoundPool;

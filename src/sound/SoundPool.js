import Sound from "./Sound";

class SoundPool {
  constructor(src, poolSize, soundOptions) {
    this.playCount = 0;
    this.sounds = Array.from(
      Array(poolSize),
      () => new Sound(src, soundOptions)
    );
  }

  // play one of audio instance of the pool
  play(opts) {
    const { sounds } = this;
    const index = this.playCount++ % sounds.length;
    sounds[index].play(opts);
  }

  // stop ALL audio instance of the pool
  stop() {
    this.sounds.forEach(sound => sound.stop());
  }
}

export default SoundPool;

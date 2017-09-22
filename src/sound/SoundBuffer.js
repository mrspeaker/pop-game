import Assets from "../Assets";
import webAudio from "./webAudio";

const { ctx, master } = webAudio;

/*
  options can include:
    volume (0 - 1)
    loop (boolean)
    speed (0.5 - 4)
    destination (default is ctx.master)
*/
class SoundBuffer {
  constructor(src, options = {}) {
    this.src = src;
    this.options = Object.assign(
      { volume: 1, output: master },
      options
    );

    // Configure audio element
    const audio = Assets.soundBuffer(src, ctx);
    if (options.loop) {
      audio.loop = true;
    }
    this.audio = audio;
  }

  play(overrides, cb) {
    const { audio, options } = this;
    const opts = Object.assign({ time: 0 }, options, overrides);

    audio.then(buffer => {
      const source = ctx.createBufferSource();
      if (cb) {
        source.addEventListener("ended", cb, false);
      }
      source.buffer = buffer;

      source.volume = opts.volume;
      if (opts.speed) {
        source.playbackRate.value = opts.speed;
      }
      source.connect(opts.output);
      source.start(0, opts.time);
    });
  }
}

export default SoundBuffer;

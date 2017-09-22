const hasWebAudio = !!window.AudioContext;
let ctx;
let master;

let volume = 1; // master volume
// isPlaying = true; ...

export default {
  hasWebAudio,
  get ctx() {
    if (!ctx && hasWebAudio) {
      ctx = new AudioContext();
      master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);
    }
    return ctx;
  },
  get master() {
    return master;
  },
  // Ideas for inclusion...
  fadeOut() {
    const volume = master.gain.value;
    master.gain.setValueAtTime(volume, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  },
  mute() {
    volume = 0;
    master.gain.setValueAtTime(volume, ctx.currentTime);
  }

};

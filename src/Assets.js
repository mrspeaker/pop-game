const cache = {};
const readyListeners = [];
const progressListeners = [];

let completed = false;
let remaining = 0;
let total = 0;

function done() {
  completed = true;
  readyListeners.forEach(cb => cb());
}

// Called when a queued asset is ready to use
function onAssetLoad(e) {
  if (completed) {
    console.warn("Warning: asset defined after preload.", e.target);
    return;
  }

  remaining--;
  progressListeners.forEach(cb => cb(total - remaining, total));
  if (remaining === 0) {
    // We're done loading
    done();
  }
}

// Helper function for queuing assets
function load(url, maker) {
  if (cache[url]) {
    console.log("cached", url);
    return cache[url];
  }
  console.log("load", url);
  const asset = maker(url, onAssetLoad);
  remaining++;
  total++;

  cache[url] = asset;
  return asset;
}

const Assets = {
  get completed() {
    return completed;
  },

  onReady(cb) {
    if (completed) {
      return cb();
    }

    readyListeners.push(cb);
    // No assets to load
    if (remaining === 0) {
      done();
    }
  },

  onProgress(cb) {
    progressListeners.push(cb);
  },

  image(url) {
    return load(url, (url, onAssetLoad) => {
      const img = new Image();
      img.src = url;
      img.addEventListener("load", onAssetLoad, false);
      return img;
    });
  },

  sound(url) {
    return load(url, (url, onAssetLoad) => {
      const audio = new Audio();
      audio.src = url;
      const onLoad = e => {
        audio.removeEventListener("canplay", onLoad);
        onAssetLoad(e);
      };
      audio.addEventListener("canplay", onLoad, false);
      return audio;
    });
  },

  json(url) {
    return load(url, (url, onAssetLoad) =>
      fetch(url).then(res => res.json()).then(json => onAssetLoad(json))
    );
  }
};

export default Assets;

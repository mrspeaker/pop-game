const dom = document.querySelector("#res");
const log = (...msg) => (dom.innerHTML += msg.join("&nbsp") + "<br />");

const assert = (test, ...args) => {
  if (!test) {
    console.warn("Failed:", ...args);
    log("🔴", [...args].map(a => JSON.stringify(a)));
  } else {
    console.log("Passed:", ...args);
    log("🌳", [...args].map(a => JSON.stringify(a)));
  }
};

export default {
  log,
  dom,
  assert
};

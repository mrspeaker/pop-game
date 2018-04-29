// import pop from "../src/index.js";
import utils from "./utils.js";
const { log, assert } = utils;

// TODO: test that both Containers and Children will exit early from the renderer
// if either `visible == false` OR `alpha == 0`.
// Also test the `==` vs `===`. I think on of the tests is intentionally testing a
// falsy value with `==`. If so, document it and test it.

log("<strong>Renderer Children</strong>");
log("<br/>--- Starting Renderer Children tests ---");
assert(
  true,
  "setup tests",
);
log("--- Done Renderer Children tests ---<br/>");

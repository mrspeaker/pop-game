class GamepadControls {
  constructor() {
    window.addEventListener(
      "gamepadconnected",
      e => this.handler(e, true),
      false
    );
    window.addEventListener(
      "gamepaddisconnected",
      e => this.handler(e, false),
      false
    );
    this.controller = null;
    this.controllers = {};

    this.threshold = 0.21;
    this.handler = this.handler.bind(this);
  }
  handler ({ gamepad }, connecting) {
    const { controllers } = this;
    if (connecting) {
      controllers[gamepad.index] = gamepad;
      this.controller = gamepad;
    } else {
      delete controllers[gamepad.index];
    }
  }

  action(...buttons) {
    const { controller } = this;
    if (!controller) return false;
    return buttons.some(b => controller.buttons[b].pressed);
  }

  axis(id) {
    const { controller, threshold } = this;
    if (!controller) return 0;
    if (controller.axes[id] < -threshold) return -1;
    if (controller.axes[id] > threshold) return 1;
    return 0;
  }

  get actionA() {
    return this.action(0, 11);
  }

  get actionB() {
    return this.action(1, 12);
  }

  get actionX() {
    return this.action(2, 13);
  }

  get actionY() {
    return this.action(3, 14);
  }

  get actionEsc() {
    return this.action(4);
  }

  get x() {
    return this.axis(0);
  }

  get y() {
    return this.axis(1);
  }
}

export default GamepadControls;

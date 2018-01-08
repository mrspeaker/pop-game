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
  }
  handler = ({ gamepad }, connecting) => {
    const { controllers } = this;
    if (connecting) {
      controllers[gamepad.index] = gamepad;
      this.controller = gamepad;
    } else {
      delete controllers[gamepad.index];
    }
    console.log(connecting ? "CONNECTED" : "DISCONNDECTED", controllers);
  };


}

export default GamepadControls;

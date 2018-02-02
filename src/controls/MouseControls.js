class MouseControls {

  constructor (container) {
    this.el = container || document.body;

    // Handlers
    document.addEventListener("mousedown", this.down.bind(this), false);
    document.addEventListener("mouseup", this.up.bind(this), false);
    document.addEventListener("mousemove", this.move.bind(this), false);

    this.pos = { x: 0, y: 0 };
    this.worldPos = { x: 0, y: 0 };

    this.left = {
      isDown: false,
      pressed: false,
      released: false,
      duration: 0
    };
  }

  mousePosFromEvent (e) {
    const rect = this.el.getBoundingClientRect();
    this.pos.x = e.clientX - rect.left;
    this.pos.y = e.clientY - rect.top;
  }

  down (e) {
    this.left.isDown = true;
    this.left.pressed = true;
    this.mousePosFromEvent(e);
  }

  up () {
    var left = this.left;
    left.isDown = false;
    left.released = true;
  }

  move (e) {
    this.mousePosFromEvent(e);
  }

  update (dt, t, camera) {
    const { left, pos, worldPos } = this;

    if (left.isDown) {
      left.duration += dt;
    }
    if (left.released) {
      left.released = false;
      left.duration = 0;
    }
    if (left.pressed) {
      left.pressed = false;
    }

    worldPos.x = pos.x - (camera ? camera.pos.x : 0);
    worldPos.y = pos.y - (camera ? camera.pos.y : 0);

  }

}

export default MouseControls;

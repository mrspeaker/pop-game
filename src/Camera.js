import Container from "./Container";
import math from "./utils/math";
import Vec from "./utils/Vec";
import Rect from "./Rect";

class Camera extends Container {
  constructor(subject, viewport, worldSize = viewport) {
    super();
    this.pos = new Vec();
    this.viewport = viewport;
    this.worldSize = worldSize;

    // Debugging tracking rectangle
    // this.deb = this.add(
    //   new Rect(0, 0, {
    //     fill: "rgba(255, 0, 0, 0.2)"
    //   })
    // );

    this.shakePower = 0;
    this.lastShake = new Vec();
    this.flashTime = 0;
    this.easing = 0.03;

    this.setTracking(64, 48);
    this.setSubject(subject);
  }

  setTracking(w, h) {
    const { deb } = this;
    this.tracking = new Vec(w, h);
    if (deb) {
      deb.w = w * 2;
      deb.h = h * 2;
    }
  }

  setSubject(e) {
    this.subject = e ? e.pos || e : this.pos;
    this.offset = { x: 0, y: 0 };

    // Center on the entity
    if (e && e.w) {
      this.offset.x += e.w / 2;
      this.offset.y += e.h / 2;
    }
    if (e && e.anchor) {
      this.offset.x -= e.anchor.x;
      this.offset.y -= e.anchor.y;
    }
    this.focus(1);
  }

  flash(length = 0.2, color = "#fff") {
    const { viewport } = this;
    this.remove(this.flashRect);
    this.flashRect = this.add(
      new Rect(viewport.w, viewport.h, { fill: color })
    );
    this.flashRect.pos = Vec.from(this.pos).multiply(-1);
    this.flashLength = length;
    this.flashTime = this.flashLength;
  }

  shake(power = 5) {
    this.shakePower = power;
  }

  _shake() {
    const { pos, shakePower, lastShake } = this;
    if (shakePower < 0) {
      lastShake.set(0, 0);
      return;
    }
    lastShake.set(
      math.randf(-shakePower, shakePower),
      math.randf(-shakePower, shakePower)
    );

    pos.add(lastShake);
    this.shakePower -= 0.2;
  }

  _unShake() {
    const { pos, lastShake } = this;
    pos.subtract(lastShake);
  }

  _flash(dt) {
    const { flashTime, flashRect } = this;
    if (flashTime < 0) {
      return;
    }

    if ((this.flashTime -= dt) <= 0) {
      this.remove(flashRect);
    } else {
      flashRect.opacity = this.flashTime / this.flashLength;
    }
  }

  focus(ease = 1) {
    const { pos, worldSize, viewport, subject, offset, tracking, deb } = this;

    const target = subject || pos;

    const centeredX = target.x + offset.x - viewport.w / 2;
    const maxX = worldSize.w - viewport.w;
    let x = -math.clamp(centeredX, 0, maxX);

    const centeredY = target.y + offset.y - viewport.h / 2;
    const maxY = worldSize.h - viewport.h;
    let y = -math.clamp(centeredY, 0, maxY);

    if (deb) {
      deb.pos.set(
        -pos.x + viewport.w / 2 - tracking.x,
        -pos.y + viewport.h / 2 - tracking.y
      );
    }

    if (tracking) {
      // Tracking box
      if (Math.abs(centeredX + pos.x) < tracking.x) {
        x = pos.x;
      }
      if (Math.abs(centeredY + pos.y) < tracking.y) {
        y = pos.y;
      }
    }

    pos.x = math.mix(pos.x, x, ease);
    pos.y = math.mix(pos.y, y, ease);
  }

  update(dt, t) {
    super.update(dt, t);
    this._unShake();
    if (this.subject) {
      this.focus(this.easing);
    }
    this._shake();
    this._flash(dt);
  }
}

export default Camera;

const tmp = [1, 0, 0, 0, 1, 0, 0, 0, 1];

class Matrix {
  constructor() {
    this.t = [];
    this.identity();
  }

  set(...els) {
    const { t } = this;
    els.forEach((c, i) => (t[i] = c));
  }

  identity() {
    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  compose(...m) {
    const a = this.t;
    const b = m[0].t || m;
    tmp[0] = a[0] * b[0] + a[1] * b[3] + a[2] * b[6];
    tmp[1] = a[0] * b[1] + a[1] * b[4] + a[2] * b[7];
    tmp[2] = a[0] * b[2] + a[1] * b[5] + a[2] * b[8];

    tmp[3] = a[3] * b[0] + a[4] * b[3] + a[5] * b[6];
    tmp[4] = a[3] * b[1] + a[4] * b[4] + a[5] * b[7];
    tmp[5] = a[3] * b[2] + a[4] * b[5] + a[5] * b[8];

    tmp[6] = a[6] * b[0] + a[7] * b[3] + a[8] * b[6];
    tmp[7] = a[6] * b[1] + a[7] * b[4] + a[8] * b[7];
    tmp[8] = a[6] * b[2] + a[7] * b[5] + a[8] * b[8];

    a[0] = tmp[0];
    a[1] = tmp[1];
    a[2] = tmp[2];
    a[3] = tmp[3];
    a[4] = tmp[4];
    a[5] = tmp[5];
    a[6] = tmp[6];
    a[7] = tmp[7];
    a[8] = tmp[8];
  }

  translate(x, y) {
    this.compose(1, 0, 0, 0, 1, 0, x, y, 1);
  }

  rotate(angle) {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    this.compose(c, -s, 0, s, c, 0, 0, 0, 1);
  }

  scale(x, y) {
    this.compose(x, 0, 0, 0, y, 0, 0, 0, 1);
  }

  getPos() {
    return { x: this.t[6], y: this.t[7] };
  }
  getScale() {
    const { t } = this;
    return {
      x: Math.sqrt(t[0] * t[0] + t[1] * t[1]),
      y: Math.sqrt(t[3] * t[3] + t[4] * t[4])
    };
  }
  getRotation() {
    const s = this.getScale();
    return Math.atan2(this.t[3] / s.y, this.t[0] / s.x);
  }

  toString() {
    const { t } = this;
    return `${t[0]}\t${t[1]}\t${t[2]}\n${t[3]}\t${t[4]}\t${t[5]}\n${t[6]}\t${
      t[7]
    }\t${t[8]}`;
  }
}

export default Matrix;

class State {
  constructor(state) {
    this.set(state);
  }

  set(state) {
    this.last = this.state;
    this.state = state;
    this.time = 0;
    this.first = true;
  }

  get() {
    return this.state;
  }

  update(dt) {
    this.first = false;
    this.time += dt;
  }

  is(state) {
    return this.state === state;
  }

  isIn(...states) {
    return states.some(s => this.is(s));
  }
}

export default State;

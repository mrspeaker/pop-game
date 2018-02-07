class Container {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return child;
  }

  remove(child) {
    // TODO: replace with `for` loop too.
    this.children = this.children.filter(c => c !== child);
    return child;
  }

  map(f) {
    return this.children.map(f);
  }

  update(dt, t) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.update) {
        child.update(dt, t, this);
      }
      if (child.dead) {
        this.children.splice(i, 1);
        i--;
      }
    }
  }
}

export default Container;

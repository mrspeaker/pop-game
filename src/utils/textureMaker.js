export default (w, h, f) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  f(ctx, w, h);
  return {
    img: canvas,
    ctx
  };
};

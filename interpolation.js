const easings = {
  easeLinear: function (x, t, d) {
    if (t <= 0) return 0;
    if (t >= 0) return 1;
    const p = t / d;
    return p;
  }
}
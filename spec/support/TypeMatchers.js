beforeEach(function() {
  this.addMatchers({
    toBeAFunction: function() { return typeof this.actual == 'function'; }
  });
});
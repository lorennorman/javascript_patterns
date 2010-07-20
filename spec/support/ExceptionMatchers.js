beforeEach(function() {
  this.addMatchers({
    toRaiseA: function(expected) { 
      try
      {
        this.actual();
      }
      catch(e)
      {
        return e === expected;
      }

      return false;
    }
  });
});
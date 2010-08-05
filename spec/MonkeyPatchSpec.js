describe('Scoped Monkey-patching', function()
{
  it('should be easy to add a monkey patch', function()
  {
    Monkey.patch( Object, 'functionName', function(arg1, arg2) {/* function body */} );
  });

  it('should be easy to remove a monkey patch', function()
  {
    Monkey.unpatch(Object, 'functionName');
  });

  describe('using a patch', function()
  {
    var upTo = function(countToNumber)
    {
      var toReturn = []
      for(var i = Number(this); i <= countToNumber; i++)
      {
        toReturn.push(i);
      }
      return toReturn;
    };

    beforeEach(function()
    {
      //           Target, FuncName, Function
      Monkey.patch(Number, 'upTo',   upTo);
    });

    it('should add the function to the target object', function()
    {
      expect((50).upTo).toBeDefined();
    });

    it('should be callable on an instance of the object', function()
    {
      expect((50).upTo(75)).toBeDefined();
    });

    it('should work as expected', function()
    {
      expect((1).upTo(5)).toEqual( [1,2,3,4,5] );
    });

    describe('clearing the patch', function()
    {
      beforeEach(function()
      {
        Monkey.unpatch(Number, 'upTo');
      });

      it('should be removed', function()
      {
        expect((50).upTo).not.toBeDefined();
      });
    });
  });

  describe('DSL creation', function()
  {
    it('should be a factory for patch-sets', function()
    {
      var myMonkeyPatch = Monkey.create();
      expect(myMonkeyPatch).toBeDefined();
    });

    describe('using a DSL', function()
    {
      var countingDSL;
      var timesFunction = function(iterateFunction)
      {
        for(var i = 0; i < Number(this); i++) { iterateFunction(i); }
      }
      beforeEach(function()
      {
        countingDSL = Monkey.create();
      });

      it('should allow registration of patches', function()
      {
        expect(countingDSL.registerPatch).toBeAFunction();
        countingDSL.registerPatch(Number, 'times', timesFunction);
        expect((50).times).not.toBeDefined(); // Registering does not apply it yet
      });

      it('should allow activation of patches', function()
      {
        countingDSL.registerPatch(Number, 'times', timesFunction);

        expect(countingDSL.activate).toBeAFunction();
        countingDSL.activate();
        expect((50).times).toBeDefined();

        countingDSL.deactivate();
      });

      it('should allow deactivation of patches', function()
      {
        countingDSL.registerPatch(Number, 'times', timesFunction);
        countingDSL.activate();

        expect(countingDSL.deactivate).toBeAFunction();
        countingDSL.deactivate();
        expect((50).times).not.toBeDefined();
      });

      it('should allow wrapping of functions where the patch is active', function()
      {
        countingDSL.registerPatch(Number, 'times', timesFunction);

        expect(countingDSL.wrap).toBeAFunction();

        var counter = 0;
        var incrementFunc = function() { counter++; };

        countingDSL.wrap(function()  // Inside this function our DSL is active
        {
          (10).times(incrementFunc); // Call the increment function 10 times
        });

        expect(counter).toEqual(10); // Ensure 10 increments happened
        expect((10).times).not.toBeDefined(); // Ensure the patch was removed
      });
    });
  });
});











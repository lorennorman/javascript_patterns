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
});
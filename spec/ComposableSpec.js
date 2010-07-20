describe('Mixins: patterns and tools for composable reuse and recombinant designs', function()
{
  describe('ComposableObject', function()
  {
    it('is constructor function', function()
    {
      expect(Composable).toBeDefined();
    });

    it('is a constructor function, like a class', function()
    {
      var myComposableObject = Composable();
      expect(myComposableObject).toBeDefined();
    });
    describe('using Behaviors', function()
    {
      // Test Data: Behaviors
      var Dog = {
          name: "Ludo",
          speak: function() { this.bark(); },
          bark: function() { console.log('Bark Bark!'); }
        },
        Cat = {
          name: "Nicodemus",
          speak: function() { this.meow(); },
          meow: function() { console.log('Mrawr.'); }
        };
      var aComposableObject;
      beforeEach(function()
      {
        aComposableObject = Composable();
      });

      it('can act as another class', function()
      {
        aComposableObject.actsLikeA(Dog);
        expect(aComposableObject.bark).toBeDefined();
      });

      it('can act as 2 other classes', function()
      {
        aComposableObject.actsLikeA(Dog);
        aComposableObject.actsLikeA(Cat);
        expect(aComposableObject.bark).toBeDefined();
        expect(aComposableObject.meow).toBeDefined();
        expect(aComposableObject.speak).toBeDefined();

        spyOn(aComposableObject, 'bark');
        spyOn(aComposableObject, 'meow');
        aComposableObject.speak(); // Both pets defined speak()
        expect(aComposableObject.bark).wasCalled();
        expect(aComposableObject.meow).wasCalled();
      });

      it('stores function properties as functions', function()
      {
        aComposableObject.actsLikeA(Dog);
        expect(aComposableObject.bark).toBeAFunction();
      });

      it('stores attributes properties as attributes', function()
      {
        aComposableObject.actsLikeA(Dog);
        expect(aComposableObject.name).not.toBeAFunction();
      });

      it('rejects assignment of an attribute to a name taken by a function', function()
      {
        var BarkAsAttribute = {
          bark: 'Woof Woof!' // Uh oh! bark is an attribute instead of a function!
        };

        aComposableObject.actsLikeA(Dog);
        expect(function()
        {
          aComposableObject.actsLikeA(BarkAsAttribute);
        }).toRaiseA(Composable.AttributeAssignedToFunctionError);
      });

      it('rejects assigment of a function to a name taken by an attribute', function()
      {
        var NameAsFunction = {
          name: function(){ 'I\'m supposed to be an attribute!'; }
        }

        aComposableObject.actsLikeA(Dog);
        expect(function()
        {
          aComposableObject.actsLikeA(NameAsFunction);
        }).toRaiseA(Composable.FunctionAssignedToAttributeError);
      });
    });
  });
});
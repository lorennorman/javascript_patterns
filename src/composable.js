// Enables the Mixin style of code reuse 
var Composable = function(klass)
{
  // And this is the factory code that cranks out new instances of this 
  // particular composable object
  var _composableObject = {};
  var _composedProperties = {};
  _composableObject.actsLikeA = function(behaviorObject)
  {
    // Walk through the behavior object's properties 
    // and push them into your composed properties table
    for (var property in behaviorObject)
    {
      if(typeof behaviorObject[property] == 'function')
      {
        // Check that the already-existing tenant of this property is
        // also a function
        if(_composableObject[property] && typeof _composableObject[property] != 'function')
        {
          throw Composable.FunctionAssignedToAttributeError;
        }
        // Add the function to the composed properties table
        if(_composedProperties[property])
        {
          _composedProperties[property].push(behaviorObject[property]);
        } else {
          // Create the entry if it doesn't exist
          _composedProperties[property] = [behaviorObject[property]];
          // And set the base property to be a proxy function
          _composableObject[property] = _runAllStrategiesFor(property);
        }
      } else {
        if(typeof _composableObject[property] == 'function')
        {
          throw Composable.AttributeAssignedToFunctionError;
        }
        _composableObject[property] = behaviorObject[property];
      }
    }
  };
  var _runAllStrategiesFor = function(functionProperty)
  {
    return function()
    {
      _composedProperties[functionProperty].forEach(function(nestedProperty)
      {
        nestedProperty.apply(_composableObject);
      });
    };
  };

  return _composableObject;
};

Composable.FunctionAssignedToAttributeError = "A mixin is implementing a property as a function that has already been defined as an attribute.";
Composable.AttributeAssignedToFunctionError = "A mixin is implementing a property as an attribute that has already been defined as a function.";

// Namespace
var Monkey = {};

// Naive, global patching functions. Dangerous to use directly.
Monkey.patch = function(targetClass, functionName, functionObject)
{
  targetClass.prototype[functionName] = functionObject;
};

Monkey.unpatch = function(targetClass, functionName)
{
  delete targetClass.prototype[functionName];
};

// A factory for objects that manage individual patch-sets
Monkey.create = function()
{
  var patchSet = [];

  var _registerPatch = function(klassToPatch, funcName, funcImp)
  {
    patchSet.push(
    { klass:        klassToPatch
    , functionName: funcName
    , functionImp:  funcImp
    });
  };

  var _activate = function()
  {
    patchSet.forEach(function(patch)
    {
      Monkey.patch(patch.klass, patch.functionName, patch.functionImp);
    });
  };

  var _deactivate = function()
  {
    patchSet.forEach(function(patch)
    {
      Monkey.unpatch(patch.klass, patch.functionName);
    });
  };

  // Secure Monkey-Patchery. Sweet, divine monkey-patchery...
  var _wrap = function(wrappedFunction)
  {
    _activate();
    wrappedFunction();
    _deactivate();
  };

  return { registerPatch: _registerPatch
         , activate:      _activate
         , deactivate:    _deactivate
         , wrap:          _wrap
         };
};
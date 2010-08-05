// Namespace
var Monkey = {};

Monkey.patch = function(targetClass, functionName, functionObject)
{
  targetClass.prototype[functionName] = functionObject;
};

Monkey.unpatch = function(targetClass, functionName)
{
  delete targetClass.prototype[functionName];
};
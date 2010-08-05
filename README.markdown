# A Javascript Pattern Library

by [Loren Norman](http://github.com/lorennorman)

## Why?

Javascript is a fantastically open language, and therein lies the entirety of its strength and weakness.

As developers we are left with almost no formal idioms for code reuse, which is the fundamental element of our craft. Further, many (most?) of the idioms we are given are broken or deceptive in some way.

### 'new' Considered Harmful

For example, the 'new' operator was thrown in as an afterthought in an attempt to make the language seem to support classical inheritance natively. In fact it does not, and 'new' doesn't do what most programmers expect it to, leading to no end to confusion.

Furthermore, the enlightened Javascript programmer does not typically seek to rigidly emulate classical inheritance at all, as Javascript's real, built-in mechanisms of code reuse are far more powerful, permissive, and even potentially performant. 'new' often amounts to nothing more than a red herring that damages the novice Javascript developer's ability to efficiently grok the language, this author included.

### What, Then?

Once we join the ranks of enlightened Javascript developers, however, we are faced with another issue: how to efficiently achieve code reuse? The issue is not really that it is hard to DO, per se, but rather that it is hard to do CONSISTENTLY.

Thoroughly understanding how Javascript works naturally leads to a kind of ad-hoc, 'cowboy coding' style. There is certainly something romantic about wielding a powerful language in this way, and indeed it can be very useful when used deliberately to explore a new problem space or evolve a new reuse pattern.

But by and large, this style of development should be minimized due to its myriad negatives:
* difficult to organize code
* not self-explanatory to another team member
* not self-explanatory to a future version of the original developer
* not (generally) amenable to auto-doc tools
* (probably) not very testable
* ignores the gains of code reuse from project to project

Indeed, coding 10 different projects in this style would likely beget 10 completely different application designs with only cursory similarities. Probably a good exercise for the novice working on their skills, but a terrible way to run an organization that has to maintain this code and continue to write more.

### Time For Patterns

Javascript's functional and open nature make it a great candidate for adding formal code reuse patterns directly to the language. One can extract a useful pattern for later reuse into a library, and then include it into a future project, immediately leveraging past gains and applying common idioms.

Further, the patterns can themselves be tested and documented in isolation (they are just code, after all), allowing the including developer to go forth using them confidently.

For instance, polluting the global namespace is considered a bad practice. If one were to recreate a given pattern on-the-fly 10 times on 10 different projects, namespace pollution would be a concern on 10 separate occasions. Extracting the pattern and testing it as a separate project lends clarity, consistency, and confidence, all things which are generally in short supply in the Javascript community.

This project represents a repository of Javascript reuse patterns that the author has found useful.

## Using a Pattern

Just copy down the files for the patterns you need and include them in your source before you need to use them.

## The Patterns

### Composable Inheritance

Basically these are Ruby-style mixins and they support composable designs (somewhat like multiple inheritance, but more elegant).

Define the behaviors you want in separate objects. Declare that a Composable object actsLikeA given behavior object. Now the Composable has those behaviors (ie: attributes and functions). Add as many actsLikeA declarations as needed to a single Composable, and behavior objects can rely on each other. Behavior objects can also be used by multiple Composable objects, they can be thought of as simple containers for the behaviors themselves, not actual instances.

    // A Behavior
    var Positionable = {
      x: 0,
      y: 0
    };
    
    // Another Behavior, relies on the first
    var Movable = {
      moveLeft:  function() { this.x -= 5; },
      moveRight: function() { this.x += 5; },
      moveUp:    function() { this.y -= 5; },
      moveDown:  function() { this.y += 5; }
    };
    
    // A Composable object
    var sprite = Composable(); // No 'new', no need!
    
    // Get the x and y attributes
    sprite.actsLikeA(Positionable);
    sprite.x = 75;
    sprite.y = 50;
    
    // Get the movement functions that use the x and y attributes
    sprite.actsLikeA(Movable);
    sprite.moveUp();
    sprite.moveLeft();
    sprite.moveDown();
    
    // Reuse the same Behavior objects many times
    var sprite2 = Composable();
    sprite2.actsLikeA(Positionable);
    var sprite3 = Composable();
    sprite3.actsLikeA(Movable);
    var sprite4 = Composable();
    sprite4.actsLikeA(Positionable);
    sprite4.actsLikeA(Movable);

### Scoped Monkey-Patching or DSL Tools

[Monkey-Patching](http://en.wikipedia.org/wiki/Monkey_patch) has a bad name, but we're bad people. We like to walk on the wild side. We like our code to flirt with danger and push the envelope every now and then.

So I took a swing at pulling the teeth off the monkey and making it safe to patch objects you don't own, even built-in objects and primitives. Because dammit, this is elegant:

    // Count to 50 without a 'for' loop
    (50).times(function(count)
    {
      console.log(count);
    });

To implement it, just patch Number:

    // Define the function we want to add to Number
    var timesFunction = function(countFunction)
    {
      // Ah, there's the 'for' loop! Hidden away, never to be seen again (I hope).
      for(var i = 1; i <= Number(this); i++)
      {
        countFunction(i);
      }
    };
    
    // Add it!
    Monkey.patch(Number, 'times', timesFunction);

So what's the problem? Cleaning up after yourself, that's what. Well we can do that, too:

    Monkey.unpatch(Number, 'times'); // ::poof:: All gone!
    (50).times;                      // undefined

So go ahead, go crazy adding your favorite iterators to arrays, interpolation to strings, and your own personal inspection methods to... well, everything! Just patch Object. Getting kind of wild, yeah? Let's go further.

Instead of registering and unregistering your patches individually, why don't we make patch sets? Easy, use Monkey like a factory and give yourself an instance to manage a set of patches:

    // Create and populate a patchset
    var numberPatchset = Monkey.create();
    numberPatchset.registerPatch(Number, 'times',   timesFunction);     // Same as before
    numberPatchset.registerPatch(Number, 'minutes', minutesFunction);   // Whatever else...
    numberPatchset.registerPatch(Number, 'add7',    add7Function);      // ...you want.
    
    (50).times                    // undefined, nothing applied yet
    numberPatchset.activate();    // Guess what this does?
    (50).times                    // function...
    (10).minutes                  // function...
    (18).add7                     // function...
    
    numberPatchset.deactivate();  // I didn't do it, nobody saw me do it, can't prove anything...
    (50).times                    // undefined, my hands are clean!

Cleaning up after ourselves was never so fun, I'm sure we'll always remember to do it from now on. And ponies and rainbows.

Wait, no we won't, we're humans! Remembering details in the heat of development is what we're bad at! Why don't we see if our computer can help us here as well. Javascript is a functional language, so let's leverage that to automate the cleanup portion:

    // Using numberPatchset from above...
    
    (50).times // undefined, patch is inactive
    
    numberPatchset.wrap(function()
    {
      (50).times // function... patch is active
    });
    
    (50).times // undefined, patch is inactive again. Delicious!

I'm currently using this mechanism to create scoped-DSLs and add beauty and elegance to complex domains:

    // Imagine we want to configure the ticker for a videogame loop:
    myTicker.configure(function()
    {
      (100).timesPerSecond(checkForCollisions) // Frequently for integrity
      (32).timesPerSecond(render);             // Basically our framerate
      (.2).timesPerSecond(aiTick);             // AI is expensive, do it rarely
    });

Powerful stuff! And the code looks like what it does, the value of which is hard to overestimate.

## More To Come...

I'm just adding patterns as I write them, since I find it easier to test and talk about them in isolation rather than in-situ in the larger project I'm working on. Plus, it helps keep the larger project small as I continually refactor and extract things. They change over time and hopefully become better and more stable. Your comments are welcome.

I don't consider any of the patterns to be complete or necessarily even correct. Javascript is a formidable beast, and the only chance we have at leveraging its power is to learn it via experimentation at the boundaries. I just hope someone enjoys or learns from my experiments!

## License

MIT. Take 'em and go!

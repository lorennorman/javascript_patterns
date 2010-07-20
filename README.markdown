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

### Composition

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
    var Sprite = Composable(); // No 'new', no need!
    
    // Get the x and y attributes
    Sprite.actsLikeA(Positionable);
    Sprite.x = 75;
    Sprite.y = 50;
    
    // Get the movement functions that use the x and y attributes
    Sprite.actsLikeA(Movable);
    Sprite.moveUp();
    Sprite.moveLeft();
    Sprite.moveDown();
    
    // Reuse the same Behavior objects many times
    var Sprite2 = Composable();
    Sprite2.actsLikeA(Positionable);
    var Sprite3 = Composable();
    Sprite3.actsLikeA(Positionable);
    var Sprite4 = Composable();
    Sprite4.actsLikeA(Positionable);
    Sprite4.actsLikeA(Movable);









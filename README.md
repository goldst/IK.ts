# IK.ts – Inverse Kinematics Library

Inverse Kinematics library for use in browsers and node. Based on the Fabrik algorithm. IK.ts is a [port of existing IK libraries](#license-and-credits)

## Setup
Installation:
```
> npm i ikts
```

You can either add the library using html:
```html
<script src="node_modules/ikts/build/IK-browser.js"></script>
```
and then access the classes using the global object `IK`.

Or you can include it as a module:
```js
import * as IK from 'ikts';
```

## Basics
The smallest entity in inverse kinematics are **bones** of fixed length. A sequence of bones is called **chain**. Inverse kinematics answers the question: *Given chains and target positions that these chain should end at, at which position are the bones?*

IK.ts organizes multiple chains in so-called **structures**. Structures can contain multiple chains, which can even be connected to form more complex skeletons.

To start with IK.ts, create chains:
```js
const leg = new IK.Chain3D(); // or Chain2D
```

For each chain, add a first bone. The initial direction of the bone is necessary to give the algorithm an idea of where the bones should roughly end up at the end, but don't worry, even if you use made up values, the IK.ts is likely to figure it out anyways.
```js
// with start and end positions:
const baseBoneA = new IK.Bone3D( // or Bone2D
    new IK.V3(1, 2, 3), // start position. Use IK.V2 if you are using Chain2D.
    new IK.V3(4, 5, 6)  // end position. Use IK.V2 if you are using Chain2D.
);

// with start position, direction and length:
const baseBoneB = new IK.Bone3D( // or Bone2D
    new IK.V3(1, 2, 3), // start position. Use IK.V2 if you are using Chain2D.
    undefined,          // no end position given
    new IK.V3(7, 8, 9), // direction. Use IK.V2 if you are using Chain2D.
    2                   // length
);
```

Then add the first bone to their respective chains:
```js
leg.addBone(baseBoneA);
```

After the first bone is added, adding additional bones is much easier:
```js
leg.addConsecutiveBone(
    IK.V3(2, 3, 4), // direction. Use IK.V2 if you are using Chain2D.
    3               // length
);
```

Each chain needs a target position. In the next step you will need to supply a target position – if you don't know yours yet, it is ok to initialize it with a position of (0|0|0).
```js
const legTarget = new IK.V3(0, 0, 0); // or IK.V2
```

When all your chains are done, create a structure and add your chains:
create a structure:
```js
const structure = new IK.Structure3D(); // or Structure2D

structure.add(leg, legTarget);
```

After this, you are ready to go! Just run `update` (and re-run it whenever you change your targets):
```js
structure.update();
```

To obtain the position of a certain bone, you can do something like this:
```js
leg.bones[1].start
leg.bones[1].end
```

That's it! You can have a look at the classes to see all of your options, including bone constraints. I'm planing to add documentation very soon.

## Development status and contributing
This project is work in progress. Let me know if you have any issues! Currently I'm not taking code contributions, because it is part of an university project. I am planing to open it up in June.

<!-- TODO replace section once bachelors thesis is finished>

Don't expect me to update this project that much once it's done :upside_down_face: but your code and documentation contributions are warmly welcomed. Make sure to create an issue first if you want to work on something and let me know there.
<-->

## License and credits
[MIT](LICENSE)

This library is a TypeScript port of and based on
- [Fullik](https://github.com/lo-th/fullik) by [lo-th](https://github.com/lo-th), which is a JavaScript port of
- [Caliko](https://github.com/FedUni/caliko) by Alastair Lansley et al at the Federation University Australia, which is an implementation of the
- [FABRIK algorithm](http://andreasaristidou.com/publications/papers/FABRIK.pdf) by Andreas Aristidou and Joan Lasenby

This library differs from Fullik:
- IK.ts is written TypeScript, Fullik is JavaScript. You can use IK.ts with JavaScript nevertheless!
- Fullik is not in the npm registry and doesn't provide you documentation for installation and usage. It does, however, contain demos, from which the correct usage can be deduced. I added some usage information to this document and plan to add more detailed documentation for IK.ts for each method and class based on the caliko documentation.
- IK.ts doesn't have the three.js dependency. If you are developing a three.js project, consider using Fullik instead – both projects work, but the latter is made specifically for usage with three.js

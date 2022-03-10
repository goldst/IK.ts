# IK.ts – TypeScript Inverse Kinematics Library – Work in Progress

This library is a TypeScript port of
- [Fullik](https://github.com/lo-th/fullik) by [lo-th](https://github.com/lo-th), which is a JavaScript port of
- [Calico](https://github.com/FedUni/caliko) by Alastair Lansley and the Federation University Australia, which is a implementation of the
- [FABRIK algorithm](http://andreasaristidou.com/publications/papers/FABRIK.pdf) by Andreas Aristidou and Joan Lasenby

## Setup and usage
Installation:
```
> npm i ik.ts
```

You can either add the library using html:
```html
<script src="node_modules/ik.ts/build/IK-browser.js"></script>
```
and then access the classes using the global object `IK`.

Or you can include the unbundled source as a module:
```ts
import * as IK from 'ik.ts/build/IK';
```

Documentation is planned, for now just have a look at `index.html` and the `demos` folder for usage examples.

## License
[MIT](LICENSE)
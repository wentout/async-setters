# awaited assignment

ECMAScript proposal and some parts of implementation for Awaited Assignment operation.

**Author:** Viktor (wentout) Vershanskiy

**Stage:** 0


## Overview and motivation

Let consider the following JavaScript code piece we may use on modern engines right now (Nov 8, 2024):

```js

'use strict';

const myObj = {};
let field = 123;

Object.defineProperty( myObj, 'field', {
	async get () {
		return new Promise( ( resolve, reject ) => {
			setTimeout( () => {
				resolve( field );
			}, 1000 );
		} );
	},
	async set ( value ) {
		new Promise( ( resolve, reject ) => {
			setTimeout( () => {
				field = value;
				resolve( field );
			}, 100 );
		} );
	}
} );

```

This code example above is fully functional and working at least via V8 runtime. Having Async Getters for today we allowed do consder that Setter is also asynchronous, but, unfortunately while being asynchronous indeed we are not allowed to track this operation. So having this code piece below is a scenario when we lack of instrumentation:


```js

( async () => {
	console.log( 'initial : ', await myObj.field );
	console.log( 'the moment of assignment invocation : ', myObj.field = 321 );
	console.log( 'real value during changes happening : ', field );
	console.log( 'reading assigned value after change : ', await myObj.field );
	console.log( 'real value when changes indeed made : ', field );
} )();

```

Here we see the moment between assignment operator invocation and real value change today is unpredictable. 

Thus let assume we may use the following construct to keep eye on this somehow:

```js

await myObj.field = value;

```

This means Assignment Operation may have Asynchronous Behaviour for consistency with Async Getter


## Real-world scenarios

Let assume given setter produces System of a Record change, and/or may be writes some data to File System or DataBase or produces some other IO operation ...

And moreover we allowed to use the following construct for compatibilyty, but this doesn't mean we track something for assignment, cause Setter is not allowed to return any value, but at least we may track Getter is OK:

```js

await ((myObj.field = value) && myObj.field);

```

Though anyway, this does mean something for that simple scenario, for more complicated code pieces we should save state of work with Assignment somewhere in between and block other assignments and bypass field read process somehow and etc... it is more and more complicated unless we may track Asynchronous Assignment is fulfilled or rejected.



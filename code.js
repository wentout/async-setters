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


( async () => {
	console.log( 'initial : ', await myObj.field );
	console.log( 'the moment of assignment invocation : ', myObj.field = 321 );
	console.log( 'real value during changes happening : ', field );
	console.log( 'reading assigned value after change : ', await myObj.field );
	console.log( 'real value when changes indeed made : ', field );
} )();
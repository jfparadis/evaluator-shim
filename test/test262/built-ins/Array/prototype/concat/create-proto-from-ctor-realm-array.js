// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
es6id: 22.1.3.1
esid: sec-array.prototype.concat
description: Prefer Array constructor of current realm record
info: |
    1. Let O be ? ToObject(this value).
    2. Let A be ? ArraySpeciesCreate(O, 0).
    [...]

    9.4.2.3 ArraySpeciesCreate

    [...]
    5. Let C be ? Get(originalArray, "constructor").
    6. If IsConstructor(C) is true, then
       a. Let thisRealm be the current Realm Record.
       b. Let realmC be ? GetFunctionRealm(C).
       c. If thisRealm and realmC are not the same Realm Record, then
          i. If SameValue(C, realmC.[[Intrinsics]].[[%Array%]]) is true, let C
             be undefined.
    [...]
features: [cross-realm, Symbol.species]
---*/

import test from 'tape';
import Evaluator from '../../../../../../src/evaluator';

test('test262/built-ins/Array/prototype/concat/create-proto-from-ctor-realm-array.js', t => {
  t.plan(2);

  const test = () => {
    const array = [];
    const OArray = new Evaluator().global.Array;
    let callCount = 0;
    const speciesDesc = {
      get() {
        callCount += 1;
      }
    };

    array.constructor = OArray;

    Object.defineProperty(Array, Symbol.species, speciesDesc);
    Object.defineProperty(OArray, Symbol.species, speciesDesc);

    const result = array.concat();

    t.equal(Object.getPrototypeOf(result), Array.prototype);
    t.equal(callCount, 1, 'Species constructor is referenced');
  };

  const realm = new Evaluator();
  realm.global.t = t;
  realm.global.eval(`(${test})()`);
});

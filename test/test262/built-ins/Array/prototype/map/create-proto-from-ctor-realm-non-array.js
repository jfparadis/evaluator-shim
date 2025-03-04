// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
es6id: 22.1.3.15
esid: sec-array.prototype.map
description: Prefer Array constructor of current realm record
info: |
    1. Let O be ? ToObject(this value).
    [...]
    5. Let A be ? ArraySpeciesCreate(O, len).
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

test('esid: sec-array.prototype.slice', t => {
  t.plan(2);

  const test = () => {
    const array = [];
    let callCount = 0;
    const CustomCtor = function() {};
    const OObject = new Evaluator().global.Object;
    const speciesDesc = {
      get() {
        callCount += 1;
      }
    };
    array.constructor = OObject;
    OObject[Symbol.species] = CustomCtor;

    Object.defineProperty(Array, Symbol.species, speciesDesc);

    const result = array.map(() => undefined);

    t.equal(Object.getPrototypeOf(result), CustomCtor.prototype);
    t.equal(callCount, 0, 'Array species constructor is not referenced');
  };

  const realm = new Evaluator();
  realm.global.t = t;
  realm.global.eval(`(${test})()`);
});

// Copyright (C) 2016 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
esid: sec-array.of
es6id: 22.1.2.3
description: Default [[Prototype]] value derived from realm of the constructor
info: |
    [...]
    4. If IsConstructor(C) is true, then
       a. Let A be ? Construct(C, « len »).
    [...]

    9.1.14 GetPrototypeFromConstructor

    [...]
    3. Let proto be ? Get(constructor, "prototype").
    4. If Type(proto) is not Object, then
       a. Let realm be ? GetFunctionRealm(constructor).
       b. Let proto be realm's intrinsic object named intrinsicDefaultProto.
    [...]
features: [cross-realm]
---*/

import test from 'tape';
import Evaluator from '../../../../../src/evaluator';

test('test262/built-ins/Array/of/proto-from-ctor-realm.js', t => {
  t.plan(1);

  const test = () => {
    const other = new Evaluator().global;
    const C = new other.Function();
    C.prototype = null;

    const a = Array.of.call(C, 1, 2, 3);

    t.equal(Object.getPrototypeOf(a), other.Object.prototype);
  };

  const realm = new Evaluator();
  realm.global.t = t;
  realm.global.eval(`(${test})()`);
});

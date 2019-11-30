/* globals document */
Promise.all([
  import('./repairLegacyAccessors.js'),
  import('./repairFunctionConstructors.js'),
  import('../dist/evaluator-shim.esm.js'),
]).then(
  ([
    { default: repairLegacyAccessors },
    { default: repairFunctionConstructors },
    { default: Evaluator },
  ]) => {
    repairLegacyAccessors();
    repairFunctionConstructors();

    const $ = selector => document.querySelector(selector);

    const run = $('#run');
    const reset = $('#reset');
    const input = $('#input');
    const output = $('#output');

    const evaluator = new Evaluator();

    run.addEventListener('click', () => {
      const sourceText = input.value;
      let result;
      let outputText;
      try {
        result = evaluator.evaluateScript(sourceText);
        switch (typeof result) {
          case 'function':
            outputText = result.toString();
            break;
          case 'object':
            outputText = JSON.stringify(result);
            break;
          default:
            outputText = `${result}`;
        }
      } catch (e) {
        outputText = `${e}`;
      }

      console.log(result);
      output.value = outputText;
    });

    reset.addEventListener('click', () => {
      input.value = '';
      output.value = '';
    });
  },
);

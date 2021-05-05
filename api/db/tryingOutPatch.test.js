const tap = require('tap');
const { convertToMongoose } = require('./tryingOutPatch');

tap.test('database wrappers / states', async patchTests => {
  // patchTests.test('gets a state profile', async () => {
  //   const results = patch();
  //   console.log({ results });
  // });

  // patchTests.test('creates a mongo update', async () => {
  //   update();
  // });

  patchTests.test('convertsToMongoose', () => {
    convertToMongoose();
  });
});

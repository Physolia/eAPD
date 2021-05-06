const tap = require('tap');
const { convertToMongoose } = require('./tryingOutPatch');

tap.test('database wrappers / states', async patchTests => {
  patchTests.test('convertsToMongoose', async () => {
    await convertToMongoose();
  });
});

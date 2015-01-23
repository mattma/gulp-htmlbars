var Code = require('code');
var lab = require('lab').script();

module.exports = {
  lab: lab,
  describe: lab.describe,
  it: lab.it,
  expect: Code.expect,
  before: lab.before,
  beforeEach: lab.beforeEach,
  after: lab.after,
  afterEach: lab.afterEach
};

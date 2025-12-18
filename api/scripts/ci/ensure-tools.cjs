// Wrapper CommonJS para permitir require() en tests
require('ts-node/register');
module.exports = require('./ensure-tools.ts');

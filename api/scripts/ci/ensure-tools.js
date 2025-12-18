// Wrapper CommonJS para permitir require() en tests (JS)
require('ts-node/register');
module.exports = require('./ensure-tools.ts');

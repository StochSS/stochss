//models
var State = require('ampersand-state');

module.exports = State.extend({
  props: {
    compID: 'number',
    name: 'string',
    function: 'string',
    expression: 'string',
    variables: 'string',
    signature: 'string',
    annotation: 'string',
  }
});
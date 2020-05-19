//models
var State = require("ampersand-state");

module.exports = State.extend({
  props: {
    mapper: "string",
    reducer: "string",
    outputs: "object"
  },
});
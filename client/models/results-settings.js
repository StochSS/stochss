//models
var State = require("ampersand-state");

module.exports = State.extend({
  props: {
    mapper: "string",
    reducer: "string",
    outputs: "object"
  },
  session: {
    speciesOfInterest: "string",
    type: "string",
    status: "string",
    realizations: "number"
  }
});
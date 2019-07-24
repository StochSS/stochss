var _ = require('underscore');
//models
var Parameter = require('./parameter');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Parameter,
  addParameter: function () {
    var name = this.getDefaultName();
    var parameter = this.add({
      name: name,
      value: 0.0
    });
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'k' + i;
    var names = this.map(function (parameter) {return parameter.name; });
    while(_.contains(names, name)) {
      i += 1;
      name = 'k' + i;
    }
    return name;
  },
  removeParameter: function (parameter) {
    this.remove(parameter);
  },
});
var _ = require('underscore');
//models
var Parameter = require('./parameter');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Parameter,
  addParameter: function () {
    var id = this.parent.getDefaultID();
    var name = this.getDefaultName();
    var parameter = this.add({
      compID: id,
      name: name,
      expression: '0.0',
      annotation: "",
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
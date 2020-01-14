var _ = require('underscore');
//models
var Rule = require('./rule');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  model: Rule,
  addRule: function (type) {
    var name = this.getDefaultName();
    var variable = this.getDefaultVariable();
    var rule = new Rule({
      name: name,
      type: type,
      expression: '',
      annotation: '',
    });
    rule.variable = variable;
    this.add(rule);
  },
  removeRule: function (rule) {
    this.remove(rule);
  },
  getDefaultName: function () {
    var i = this.length + 1;
    var name = 'rr' + i;
    var names = this.map(function (rule) {return rule.name; });
    while(_.contains(names, name)){
      i += 1;
      name = 'rr' + i;
    }
    return name;
  },
  getDefaultVariable: function () {
    var species = this.parent.species
    if(species.length > 0){
      return species.at(0);
    }else{
      return this.parent.parameters.at(0)
    }
  },
});
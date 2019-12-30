//models
var EventAssignment = require('./event-assignment');
//collections
var Collection = require('ampersand-collection');

module.exports = Collection.extend({
  addEventAssignment: function () {
    var variable = this.getDefaultVariable();
    var eventAssignment = this.add({
      variable: variable,
      expression: "",
    });
  },
  getDefaultVariable: function () {
    var species = this.parent.parent.parent.species
    if(species.length > 0){
      return species.at(0);
    }else{
      return this.parent.parent.parent.parameters.at(0)
    }
  },
  removeEventAssignment: function (eventAssignment) {
    this.remove(eventAssignment);
  },
});
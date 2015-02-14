var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
//<div>Model type: <div data-hook='type'></div><div data-hook='specie'></div><div data-hook='parameter'></div><div data-hook='reaction'></div><div data-hook='convertToPopulation'></div></div>
module.exports = View.extend({
    template: '<tr> \
  <td> \
    <input type="radio" name="model" /> \
  </td> \
  <td data-hook="name"> \
  </td> \
  <td data-hook="type"> \
  </td> \
  <td> \
    <button type="button" class="btn btn-default" data-hook="delete"> \
      <i class="icon-remove"></i></span> \
    </button> \
  </td> \
</tr>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings: {
        'model.name' : {
            type : 'text',
            hook: 'name'
        },
        'model.type' : {
            type : 'text',
            hook: 'type'
        }
    },
    events: {
        //"click [data-hook='delete']" : "deleteModel"
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        var model = this.model;

        return this;
    }
});

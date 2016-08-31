var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');

module.exports = View.extend({
    template: '<tr> \
  <td> \
    <button type="button" class="btn btn-default" data-hook="delete"> \
      x \
    </button> \
  </td> \
  <td> \
    <input type="radio" name="mesh" /> \
  </td> \
  <td data-hook="name"> \
  </td> \
</tr>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings: {
        'model.name' : {
            type : 'text',
            hook: 'name'
        },
        'model.description' : {
            type : 'text',
            hook: 'description'
        },
        'model.deletable' : {
            type : 'toggle',
            hook: 'delete'
        }
    },
    events: {
        "click input" : "selectSelf",
        "click button" : "removeModel"
    },
    selectSelf: function()
    {
        // There is a CollectionView parent here that must be navigated
        this.parent.select(this.model);
    },
    select : function()
    {
	$( this.el ).find('button').prop('disabled', true);
        $( this.el ).find( "input[type='radio']" ).prop('checked', true);
    },
    deSelect : function()
    {
	$( this.el ).find('button').prop('disabled', false);
    },
    removeModel: function()
    {
        //this.model.collection.remove(this.model);
        this.model.destroy();
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        var model = this.model;

        return this;
    }
});

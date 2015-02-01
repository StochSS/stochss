var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');
var Tests = require('../forms/tests');
//<div>Model type: <div data-hook='type'></div><div data-hook='specie'></div><div data-hook='parameter'></div><div data-hook='reaction'></div><div data-hook='convertToPopulation'></div></div>
//<i class="icon-remove"></i></span>
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
      x \
    </button> \
  </td> \
</tr>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings: {
        'textType' : {
            type : 'text',
            hook: 'type'
        }
    },
    derived: {
        textType : {
            deps : ['model.units', 'model.type', 'model.isSpatial'],
            fn : function() {
                var base = '';
                if(this.model.type == 'massaction')
                    base += 'Mass action, ';
                else
                    base += 'Non mass action, ';

                if(this.model.units == 'concentration')
                {
                    base += 'concentration, non-spatial';
                }
                else if(this.model.isSpatial)
                {
                    base += 'population, spatial';
                }
                else
                {
                    base += 'population, non-spatial';
                }

                return base;
            }
        }
    },
    events: {
        "click input" : "selectSelf",
        "click button" : "removeModel"
    },
    selectSelf: function()
    {
        // There is a CollectionView parent here that must be navigated
        this.parent.parent.selectModel(this.model);
    },
    removeModel: function()
    {
        //this.model.collection.remove(this.model);
        this.model.destroy();
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        this.renderSubview(
            new ModifyingInputView({
                template: '<span><span data-hook="label"></span><input><span data-hook="message-container"><span data-hook="message-text"></span></span></span>',
                label: '',
                name: 'name',
                value: this.model.name,
                required: false,
                placeholder: 'Name',
                model : this.model,
                tests: [].concat(Tests.naming(this.model.collection, this.model))
            }), this.el.querySelector("[data-hook='name']"));

        var model = this.model;

        return this;
    }
});

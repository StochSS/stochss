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
</tr>',
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings: {
        'model.name' : {
            type : 'text',
            hook : 'name'
        },
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
    },
    selectSelf: function()
    {
        // There is a CollectionView parent here that must be navigated
        this.parent.parent.selectModel(this.model);
    },
    render: function()
    {
        View.prototype.render.apply(this, arguments);

        return this;
    }
});

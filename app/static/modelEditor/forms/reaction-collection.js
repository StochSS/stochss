var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var ReactionFormView = require('./reaction');

var Tests = require('./tests');
var AddNewReactionForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        var validSubdomains = this.baseModel.mesh.uniqueSubdomains.map( function(model) { return model.name; } );

        if(obj.type == 'massaction')
        {
            this.collection.addMassActionReaction(obj.name, obj.parameter, [], [], validSubdomains);
        } else {
            this.collection.addCustomReaction(obj.name, obj.equation, [], [], validSubdomains);
        }
    },
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    update: function (obj) {
        AmpersandFormView.prototype.update.apply(this, arguments);

        if(obj.name == 'type')
        {
            if(obj.value == 'massaction')
            {
                $( this.fields[3].el ).hide();
                $( this.fields[2].el ).show();
            } else {
                $( this.fields[2].el ).hide();
                $( this.fields[3].el ).show();
            }
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;

        this.baseModel = this.collection.parent;

        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: false,
                placeholder: 'NewReaction',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new SelectView({
                label: 'Type',
                name: 'type',
                value: 'massaction',
                options: [['massaction', 'Mass action'], ['custom', 'Custom']],
                required: true,
            }),
            new SelectView({
                label: 'Parameter',
                name: 'parameter',
                options: this.baseModel.parameters,
                unselectedText: 'Pick one',
                required: true,
                idAttribute: 'cid',
                textAttribute: 'name',
                yieldModel: true
            }),
            new InputView({
                label: 'Equation',
                name: 'equation',
                value: '',
                required: false,
                placeholder: '',
                tests: []
            })
        ];

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.update({ name : 'type', value : 'massaction' });

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<input type="submit" value="Add"/>').appendTo( $( this.el ) );
    }
});

var ReactionCollectionFormView = AmpersandView.extend({
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        this.baseModel = this.collection.parent;

        if(this.baseModel.isSpatial)
        {
            this.template = "<div>\
  <h4>Reactions editor</h4>\
  <table data-hook='reactionTable'>\
    <thead>\
      <th></th><th>Name</th><th>Type</th><th>Parameter</th><th>Custom Propensity</th><th>Subdomains</th><th>Latex</th><th></th>\
    </thead>\
  </table>\
  <h4>Add Reaction</h4>\
  <form data-hook='addReactionForm'></form>\
</div>";
        }
        else
        {
            this.template = "<div>\
  <h4>Reactions editor</h4>\
  <table data-hook='reactionTable'>\
    <thead>\
      <th></th><th>Name</th><th>Type</th><th>Parameter</th><th>Custom Propensity</th><th>Latex</th><th></th>\
    </thead>\
  </table>\
  <h4>Add Reaction</h4>\
  <form data-hook='addReactionForm'></form>\
</div>";
        }

        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, ReactionFormView, this.el.querySelector('[data-hook=reactionTable]'));

        this.addForm = new AddNewReactionForm(
            { 
                el : this.el.querySelector('[data-hook=addReactionForm]')
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ReactionCollectionFormView
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var InitialConditionFormView = require('./initial-condition');

var Tests = require('./tests');
var AddNewInitialConditionForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        if(obj.type == 'scatter')
        {
            this.collection.addScatterInitialCondition(this.baseModel.species.at(0), 0, this.baseModel.mesh.uniqueSubdomains.at(0));
        }
        else if(obj.type == 'place')
        {
            this.collection.addPlaceInitialCondition(this.baseModel.species.at(0), 0, 0, 0, 0);
        }
        else if(obj.type == 'distribute')
        {
            this.collection.addDistributeUniformlyInitialCondition(this.baseModel.species.at(0), 0, this.baseModel.mesh.uniqueSubdomains.at(0));
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;

        this.baseModel = this.collection.parent;

        this.fields = [
            new SelectView({
                label: 'Type: ',
                name: 'type',
                value: 'scatter',
                options: [['scatter', 'Scatter'], ['place', 'Place'], ['distribute', 'Distribute Uniformly']],
                required: true,
            })
        ];

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        this.button = $('<input type="submit" value="Add"/>').appendTo( $( this.el ) );
    }
});

var InitialConditionCollectionFormView = AmpersandView.extend({
    template : "<div>\
  <h4>Initial Conditions editor</h4>\
  <table data-hook='initialConditionsTable'>\
    <thead>\
      <th></th><th>Type</th><th>Specie</th><th>Details</th>\
    </thead>\
  </table>\
  <h4>Add Reaction</h4>\
  <form data-hook='addInitialConditionForm'></form>\
</div>",

    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);
    },
    render: function()
    {
        this.baseModel = this.collection.parent;

        AmpersandView.prototype.render.apply(this, arguments);

        this.renderCollection(this.collection, InitialConditionFormView, this.el.querySelector('[data-hook=initialConditionsTable]'));

        this.addForm = new AddNewInitialConditionForm(
            { 
                el : this.el.querySelector('[data-hook=addInitialConditionForm]')
            },
            {
                collection : this.collection
            }
        );

        //this.addForm.render();

        return this;
    }
});

module.exports = InitialConditionCollectionFormView
var $ = require('jquery');
var AmpersandView = require('ampersand-view');
var AmpersandFormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var ParameterFormView = require('./parameter');
var SubCollection = require('ampersand-subcollection');

var Tests = require('./tests');
var AddNewParameterForm = AmpersandFormView.extend({
    submitCallback: function (obj) {
        this.collection.addParameter(obj.name, obj.value);

        this.fields.forEach( function(field) { $( field.el ).find('input').val(''); } );
    },
            // this valid callback gets called (if it exists)
            // when the form first loads and any time the form
            // changes from valid to invalid or vice versa.
            // You might use this to disable the "submit" button
            // any time the form is invalid, for exmaple.
    validCallback: function (valid) {
        if (valid) {
            this.button.prop('disabled', false);
        } else {
            this.button.prop('disabled', true);
        }
    },
    initialize: function(attr, options) {
        this.collection = options.collection;

        this.fields = [
            new InputView({
                label: 'Name',
                name: 'name',
                value: '',
                required: true,
                placeholder: 'NewParameters',
                tests: [].concat(Tests.naming(this.collection))
            }),
            new InputView({
                label: 'Value',
                name: 'value',
                value: '0',
                required: true,
                placeholder: '0',
                tests: []
            })
        ];

    },
    render: function()
    {
        AmpersandFormView.prototype.render.apply(this, arguments);

        $( this.el ).find('input').prop('autocomplete', 'off');

        this.button = $('<input type="submit" value="Add" />').appendTo( $( this.el ) );
    }
});

var ParameterCollectionFormView = AmpersandView.extend({
    template: "<div><table data-hook='parametersTable' class='table table-bordered'><thead><th></th><th>Name</th><th>Value</th></thead><tbody data-hook='parametersTBody'></tbody></table><div><button data-hook='previous'>Previous 10</button><span data-hook='position'></span><button data-hook='next'>Next 10</button></div>Add Parameter: <form data-hook='addParametersForm'></form></div>",
    initialize: function(attr, options)
    {
        AmpersandView.prototype.initialize.call(this, attr, options);

        this.listenToAndRun(this.collection, 'add remove change', _.bind(this.updateHasModels, this))

        this.subCollection = new SubCollection(this.collection, { limit : 10, offset : 0 });

        this.offset = 0;
    },
    setSelectRange : function(index) {
        this.subCollection.configure( { limit : 10, offset : index } );

        $( this.queryByHook('position') ).text( ' [ ' + index + ' / ' + this.collection.models.length + ' ] ' );
    },
    shift10Plus : function()
    {
        if(this.offset + 10 < this.collection.models.length)
            this.offset = this.offset + 10;

        this.setSelectRange(this.offset);
    },
    shift10Minus : function()
    {
        if(this.offset - 10 >= 0)
            this.offset = this.offset - 10;

        this.setSelectRange(this.offset);
    },
    events : {
        "click [data-hook='next']" : "shift10Plus",
        "click [data-hook='previous']" : "shift10Minus"
    },
    props: {
        selected : 'object',
        hasModels : 'boolean'
    },
    bindings : {
        'hasModels' : {
            type : 'toggle',
            hook : 'parametersTable'
        }
    },
    updateHasModels: function()
    {
        this.hasModels = this.collection.models.length > 0;
    },
    render: function()
    {
        AmpersandView.prototype.render.apply(this, arguments);

        this.setSelectRange(this.offset);

        this.renderCollection(this.subCollection, ParameterFormView, this.el.querySelector('[data-hook=parametersTBody]'));

        this.addForm = new AddNewParameterForm(
            { 
                el : this.el.querySelector('[data-hook=addParametersForm]')
            },
            {
                collection : this.collection
            }
        );
        
        return this;
    }
});

module.exports = ParameterCollectionFormView
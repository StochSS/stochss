var $ = require('jquery');
var _ = require('underscore');
var InputView = require('ampersand-input-view');

ModifyingInputView = InputView.extend({
    initialize : function(attr, options)
    {
        InputView.prototype.initialize.call(this, attr, options);

        this._derived.valid.cache = false;

        this.on('change:value', _.bind(this.setModelVariable, this));
    },
    render : function()
    {
        InputView.prototype.render.call(this);

        $(this.el).find('input').prop('autocomplete', 'off');
    },
    setModelVariable: function(model, value, options)
    {
        if(this.valid)
            this.model[this.name] = this.value;
    }
});

module.exports = ModifyingInputView
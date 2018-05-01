var $ = require('jquery');
var _ = require('underscore');
var ModifyingInputView = require('./modifying-input-view');

ModifyingNumberInputView = ModifyingInputView.extend({
    setModelVariable: function(model, value, options)
    {
        if(this.valid)
            this.model[this.name] = Number(this.value);
    }
});

module.exports = ModifyingNumberInputView
var $ = require('jquery');
var _ = require('underscore');
var SelectView = require('ampersand-select-view');

var ModifyingSelectView = _.extend(SelectView, {
    initialize : function(attr, options)
    {
        InputView.prototype.initialize.call(this, attr, options);

        this.on('change:value', _.bind(this.setModelVariable, this));
    },
    setModelVariable: function(model, value, options)
    {
        if(this.valid)
            this.model[this.name] = this.value;
    }
});

module.exports = ModifyingSelectView
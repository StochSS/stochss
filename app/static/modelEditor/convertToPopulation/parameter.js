var _ = require('underscore');
var $ = require('jquery');
var View = require('ampersand-view');

module.exports = View.extend({
    template: "<tr><td data-hook='name'></td><td data-hook='value'></td></tr>",
    // Gotta have a few of these functions just so this works as a form view
    // This gets called when things update
    bindings : {
        'model.name' : {
            type : 'text',
            hook : 'name'
        },
        'model.value' : {
            type : 'text',
            hook : 'value'
        }
    }
});

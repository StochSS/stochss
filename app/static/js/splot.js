var Splot = Splot || {}

Splot.Plot = Backbone.View.extend(
    {
        initialize : function(attributes)
        {
            this.attributes = attributes;

            this.$el = this.attributes.selector;

            this.renderDiv = $( "<div />" ).appendTo( this.$el );
            this.flotDiv = $( "<div style='width : 100% ; height : 400pt;'/>" ).appendTo( this.$el );
            this.controlDiv = $( "<div />" ).appendTo( this.$el );

            var checkboxTemplate = _.template("<input type='checkbox' checked /><%= name %><br />");

            this.selected = [];
            this.plot = undefined;

            for(var k = 0; k < this.attributes.data.length; k++)
            {
                var label = this.attributes.data[k].label;
                var checkbox = $( checkboxTemplate( { name : label } ) ).appendTo( this.controlDiv ).eq(0);

                checkbox.change(_.partial(function(plot, storage, key) {
                    storage[key] = $( event.target ).prop('checked');
                    plot.render();
                }, this, this.selected, this.selected.length));

                this.selected.push( checkbox.prop("checked") );                   
            }
            
            this.render();
        },

        render : function()
        {
            var prunedData = [];

            for(var i = 0; i < this.attributes.data.length; i++)
            {
                if(this.selected[i])
                    prunedData.push( this.attributes.data[i] );
            }
            
            this.plot = $.plot( this.flotDiv, prunedData, { legend : { type : "canvas" } } );
            var imageDiv = $( Canvas2Image.saveAsPNG( this.plot.getCanvas(), true ) );
            this.flotDiv.empty();
            this.flotDiv.append( imageDiv );
        }
    }
);

Splot.plot = function( selector, data )
{
    var plot = new Splot.Plot( { selector : selector, data : data } );
}

var Splot = Splot || {}


Splot.Plot = Backbone.View.extend(
    {
        initialize : function(attributes)
        {
            this.attributes = attributes;

            if(typeof(this.attributes.xlabel) == "undefined")
                this.attributes.xlabel = "Time";

            this.$el = this.attributes.selector;

            $("<hr />" + this.attributes.title + ":<br />").appendTo( this.$el );
            this.controlDiv = $( "<div />" ).appendTo( this.$el );
            this.renderDiv = $( "<div />" ).appendTo( this.$el );
            this.hiddenDiv = $( "<div />" ).appendTo( this.$el );
            //this.flotDiv = $( "<div />" ).appendTo( this.$el );

            var checkboxTemplate = _.template("<input type='checkbox' /><span>&nbsp;<%= name %>&nbsp;<span />");

            this.selected = [];
            this.plot = undefined;

            var initialCheckbox = undefined;

            this.attributes.data = _.sortBy(this.attributes.data, function(e) { return e.label }); 

            for(var k = 0; k < this.attributes.data.length; k++)
            {
                var label = this.attributes.data[k].label;
                var checkbox = $( checkboxTemplate( { name : label + ((k == this.attributes.data.length - 1) ? '' : ', ') } ) ).appendTo( this.controlDiv ).eq(0);

                if(!initialCheckbox && !label.match('/'))
                {
                    initialCheckbox = checkbox;
                }

                if((k + 1) % 20 == 0)
                {
                    $( "<br>" ).appendTo(this.pc);
                }

                checkbox.change(_.partial(function(plot, storage, key, event) {
                    storage[key] = $( event.target ).prop('checked');
                    plot.render();
                }, this, this.selected, this.selected.length));

                this.selected.push( checkbox.prop("checked") );                   
            }

            var selectAllClearAllDiv = $( '<div class="btn-group"> \
                  <button class="btn btn-small selectAll">Select All</button> \
                  <button class="btn btn-small clearAll">Clear All</button> \
              </div>' ).appendTo( this.controlDiv );

            selectAllClearAllDiv.find( '.selectAll' ).click( _.bind(function() {
                this.controlDiv.find('input').each(function() {
                    if(!this.checked)
                        this.click();
                });
            }, this));

            selectAllClearAllDiv.find( '.clearAll' ).click( _.bind(function() {
                this.controlDiv.find('input').each(function() {
                    if(this.checked)
                        this.click();
                });
            }, this));

            //$( '#plotButton' ).click( _.partial( function(t) { t.getImage(); }, this) );

            if(initialCheckbox)
            {
                initialCheckbox.trigger("click");
            }

            //this.render();
        },
        render : function()
        {
            this.hiddenDiv.empty();

            this.svg = d3.select( this.hiddenDiv[0] ).append( "svg" )
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("width", '500pt')
                .attr("height", '300pt');

            var labels = [];
            var prunedData = [];

            for(var i = 0; i < this.attributes.data.length; i++)
            {
                if(this.selected[i])
                {
                    //labels.push( this.attributes.data[i].label );
                    prunedData.push( { key : this.attributes.data[i].label,
                                       values : this.attributes.data[i].data } );
                }
            }
            
            var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                //.useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                //.transitionDuration(0)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)//Show the x-axis
 
            chart.xAxis     //Chart x-axis settings
                .axisLabel( this.attributes.xlabel )
                .tickFormat(d3.format(',r'));
 
            chart.yAxis     //Chart y-axis settings
                .axisLabel( this.attributes.ylabel )
                .tickFormat(d3.format('.2e'));
 
            this.svg    //Select the <svg> element you want to render the chart in.   
                .datum(prunedData)         //Populate the <svg> element with chart data...
                .call(chart);
        }
    }
);

Splot.plot = function( title, selector, data, ylabel, xlabel )
{
    var plot = new Splot.Plot( { title : title, selector : selector, data : data, ylabel : ylabel, xlabel : xlabel } );

    return plot;
}

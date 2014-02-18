var Splot = Splot || {}
function sinAndCos() {
    var sin = [],sin2 = [],
    cos = [];
 
  //Data is represented as an array of {x,y} pairs.
    for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: Math.sin(i/10)});
        sin2.push({x: i, y: Math.sin(i/10) *0.25 + 0.5});
        cos.push({x: i, y: .5 * Math.cos(i/10)});
    }
 
  //Line chart data should be sent as an array of series objects.
  return [
      {
          values: sin,      //values - represents the array of {x,y} data points
          key: 'Sine Wave', //key  - the name of the series.
          color: '#ff7f0e'  //color - optional: choose your own line color.
      },
      {
          values: cos,
          key: 'Cosine Wave',
          color: '#2ca02c'
      },
      {
          values: sin2,
          key: 'Another sine wave',
          color: '#7777ff',
          area: true      //area - set to true if you want this line to turn into a filled area chart.
      }
  ];
}

Splot.Plot = Backbone.View.extend(
    {
        initialize : function(attributes)
        {
            this.attributes = attributes;

            this.$el = this.attributes.selector;

            this.renderDiv = $( "<div />" ).appendTo( this.$el );
            this.hiddenDiv = $( "<div />" ).appendTo( this.$el );
            //this.flotDiv = $( "<div />" ).appendTo( this.$el );
            $("<hr />Trajectory select:<br />").appendTo( this.$el );
            this.controlDiv = $( "<div />" ).appendTo( this.$el );

            var checkboxTemplate = _.template("<input type='checkbox' checked /><span>&nbsp;<%= name %>,&nbsp;<span />");

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
            this.hiddenDiv.empty();

            this.svg = d3.select( this.hiddenDiv[0] ).append( "svg" )
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .attr("width", '100%')
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
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(350)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                //.showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
 
            chart.xAxis     //Chart x-axis settings
                .axisLabel('Time')
                .tickFormat(d3.format(',r'));
 
            //chart.yAxis     //Chart y-axis settings
            //    .axisLabel( this.attributes.ylabel )
            //    .tickFormat(d3.format('.02e'));
 
            this.svg    //Select the <svg> element you want to render the chart in.   
                .datum(prunedData)         //Populate the <svg> element with chart data...
                .call(chart);

            //var imageDiv = $( '<img />' );
            //var imagesrc = 'data:image/svg+xml;base64,'+ btoa(this.svg.node().parentNode.innerHTML);
            
            //this.flotDiv.empty();
            //$( "<img />" ).appendTo( this.flotDiv ).prop('src', imagesrc);
            //this.flotDiv.append( imageDiv );
        }
    }
);

Splot.plot = function( selector, data )
{
    var plot = new Splot.Plot( { selector : selector, data : data } );
}
            //imageDiv.prop('src', $( '#pizza' ).jqplotToImageStr({}))
            
            /*this.plot = $.jqplot( 'pizza', prunedData, {
                series : [{showMarker:false}],
                axes : {
                    xaxis : {
                        label:'Time',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    },
                    yaxis : {
                        label:'Concentration',
                        labelRenderer: $.jqplot.CanvasAxisLabelRenderer
                    }
                },
                legend : {
                    labels : labels
                }
            } );
            var imageDiv = $( '<img />' );
            imageDiv.prop('src', $( '#pizza' ).jqplotToImageStr({}))*/
            //var imageDiv = $( Canvas2Image.saveAsPNG( this.plot.getCanvas(), true ) );

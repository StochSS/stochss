var TablePlot = TablePlot || {}

TablePlot.TablePlot = Backbone.View.extend(
    {
        initialize : function(attributes)
        {
            this.show = false;

            this.attributes = attributes;

            this.$el = this.attributes.selector;

            this.textData = this.attributes.textData;
            this.data = this.attributes.data;
            this.displayType = this.attributes.displayType;
            this.interpolated = this.attributes.interpolated;

            if(typeof this.displayType == 'undefined')
            {
                this.displayType = 'graphic';
            }

            var storage = sessionStorage.getItem( $.url().attr('path') + 'displayType' );

            if(storage == null)
            {
                sessionStorage.setItem( $.url().attr('path') + 'displayType' , this.displayType );
            }
            else
            {
                this.displayType = storage;
            }

            if(this.interpolated)
            {
                $("<div id='interpolateWarning' class='alert alert-block alert-info'>Note: The lines on this graph have been downsampled and interpolated to improve rendering performance.</div>").appendTo( this.$el );
            }
            
            $("<span>Display as: <span /><input type='radio' name='viewType' value='graphic'>Graphic, </input><input type='radio' name='viewType' value='text'>Text</input>").appendTo( this.$el );
            this.controlDiv = $( "<div />" ).appendTo( this.$el );
            this.hiddenDiv = $( "<div />" ).appendTo( this.$el );

            this.radioButtons = this.$el.find('input:radio');

            this.radioButtons.eq(0).prop('checked', (this.displayType != 'text'));
            this.radioButtons.eq(1).prop('checked', (this.displayType == 'text'));

            this.radioButtons.change( _.partial(function(tablePlot) {
                tablePlot.changeDisplayType($( this ).val());
            }, this));

            var checkboxTemplate = _.template("<input type='checkbox' value='<%= val %>'/><span>&nbsp;<%= name %>&nbsp;<span />");

            /*this.errorCheckbox = $( checkboxTemplate( { name : "Show error bars",
                                                        val : 0 } ) ).appendTo( this.controlDiv ).eq(0);

            this.errorCheckbox.change( _.partial(function(tablePlot) {
                tablePlot.showErrorBars($( this ).prop('checked'));
            }, this));*/

            $( "<br>" ).appendTo( this.controlDiv );

            this.selected = [];
            this.plot = undefined;

            //<select id="trajectorySelect">
            //<option value="mean">the mean</option>
            //</select>

            /*$( "#xSelect" ).change( _.partial(function(tablePlot) {
                tablePlot.selectX(parseInt($( this ).val()));
            }, this));*/

            var checkboxes = [];

            for(var k = 0; k < this.data.length; k++)
            {
                var label = this.data[k].label;
                var checkbox = $( checkboxTemplate( { name : label + ((k == this.attributes.data.length - 1) ? '' : ', '),
                                                      val : k } ) ).appendTo( this.controlDiv ).eq(0);

                if((k + 1) % 20 == 0)
                {
                    $( "<br>" ).appendTo(this.pc);
                }

                checkbox.change(_.partial(function(tablePlot) {
                    tablePlot.showTrajectory(parseInt($( this ).val()), $( this ).prop('checked'));
                }, this));

                this.selected.push( checkbox.prop("checked") );

                checkboxes.push(checkbox);
            }

            var storage = sessionStorage.getItem( $.url().attr('path') );

            if(storage == null)
            {
                sessionStorage.setItem( $.url().attr('path'), JSON.stringify( this.selected ) );

                checkboxes[0].trigger("click");
            }
            else
            {
                var selected = $.parseJSON(storage);

                for(var s in selected)
                {
                    if(selected[s])
                    {
                        checkboxes[s].trigger("click");
                    }
                }
            }

            //$( '#plotButton' ).click( _.partial( function(t) { t.getImage(); }, this) );

            // This will also trigger the render!
            // I don't think it makes sense that initialCheckbox would not be defined ever ~~

            this.render();
        },

        changeDisplayType : function(displayType)
        {
            this.displayType = displayType;

            sessionStorage.setItem( $.url().attr('path') + 'displayType' , this.displayType );

            this.render();
        },

        showErrorBars : function(show)
        {
            this.showErrorBarsV = show;

            this.render();
        },

        /*selectX : function(id)
        {
            
        },*/

        showTrajectory : function(id, show)
        {
            this.selected[id] = show;

            sessionStorage.setItem( $.url().attr('path'), JSON.stringify( this.selected ) );

            this.render();
        },

        render : function()
        {
            this.hiddenDiv.empty();

            if(this.displayType == 'text')
            {
                this.controlDiv.hide();
                this.hiddenDiv.html('<pre>' + this.textData + '</pre>');
            }
            else
            {
                this.controlDiv.show();
                this.svg = d3.select( this.hiddenDiv[0] ).append( "svg" )
                    .attr("version", 1.1)
                    .attr("xmlns", "http://www.w3.org/2000/svg")
                    .attr("width", '400pt')
                    .attr("height", '200pt');

                var labels = [];
                var prunedData = [];

                // This is a badly defined little zip function
                var zipNoNaN = function(arg1, arg2)
                {
                    output = [];

                    for(var i in arg1)
                    {
                        if(!isNaN(arg2[i]))
                        {
                            output.push([arg1[i], arg2[i]]);
                        }
                    }

                    return output;
                }

                var errorBars = [];

                for(var i = 0; i < this.data.length; i++)
                {
                    if(this.selected[i])
                    {
                        var values = undefined;

                        if(this.data[i].hasXY)
                        {
                            values = this.data[i].data;
                        }
                        else
                        {
                            values = _.map(zipNoNaN(this.data[0].data, this.data[i].data),
                                           function(x) { return { x : x[0], y : x[1] }; } )
                        }

                        //labels.push( this.attributes.data[i].label );
                        prunedData.push( { key : this.data[i].label,
                                           values : values } );
                        //this.showErrorBarsV && 
                        /*if(typeof this.data[i].upperBound != 'undefined' && typeof this.data[i].lowerBound != 'undefined')
                        {
                            errorBars.push(prunedData.length - 1);
                            
                            prunedData.push( { key : this.data[i].label + " upper",
                                               values : _.map(zipNoNaN(this.data[0].data, this.data[i].upperBound),
                                                              function(x) { return { x : x[0], y : x[1] }; } ) } );

                            prunedData.push( { key : this.data[i].label + " lower",
                                               values : _.map(zipNoNaN(this.data[0].data, this.data[i].lowerBound),
                                                              function(x) { return { x : x[0], y : x[1] }; } ) } );
                        }*/
                    }
                }
                
                var chart = nv.models.lineChart()
                    .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                    .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                    .transitionDuration(0)  //how fast do you want the lines to transition?
                    .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                    .showYAxis(true)        //Show the y-axis
                    .showXAxis(true)//Show the x-axis
                
                chart.xAxis     //Chart x-axis settings
                    .axisLabel(this.attributes.xlabel)
                    .tickFormat(d3.format(',r'));
                
                chart.yAxis     //Chart y-axis settings
                    .axisLabel( this.attributes.ylabel )
                    .tickFormat(d3.format('.2e'));
                
                var chart = this.svg    //Select the <svg> element you want to render the chart in.   
                    .datum(prunedData)         //Populate the <svg> element with chart data...
                    .call(chart);

                /*for(var i in errorBars)
                {
                    console.log(i);
                    var color = chart.select('.nv-series-' + i).style("fill");
                    chart.select('.nv-series-' + (i + 1))
                        .style("stroke-dasharray", ("3, 3"))
                        .style("fill", color);
                    chart.select('.nv-series-' + (i + 2))
                        .style("stroke-dasharray", ("3, 3"))
                        .style("fill", color);
                }*/
            }
        }
    }
);

/* Format of input:
  select -- jquery selector of the div in which to insert the plot/table combo thing
  data -- list of 'data' structures that represent time series
          If there is only one element to the list, then this element will be the y-values
          If there is more than one element to the list, then the first element will be the x-values, and the others will be the ys,
          but only element one of those will be plotted initially

          So the input looks like:
          [x, y0, y1, y2, ...]

          Where all the y's are optional, and y0 is the only y plotted.
          If there is only x, then it is plotted as y vs. a series of 1 ... lenght(x) in steps of 1

          The elements themselves are fancy !

          x = { data : [ array length N of values ],
          upperBound : [array length N of upper bounds],
          lowerBound : [array length N of lower bounds],
          label : "string name of sequence" }

          *ALL THE ARRAYS OF ALL x, y0, y1, y2, ... NEED TO BE THE SAME LENGTH*
  */

TablePlot.plot = function( selector, data, rawData, displayType, xlabel )
{
    // If this is true, then data is CSV input, and will be converted to the format above!

    var text = undefined;

    var interpolated = false;

    if(typeof data == "string")
    {
        textData = data;

        output = [];

        csv = $.csv.toArrays(data, { separator : '\t' });

        for(var i = 0; i < csv[0].length; i++)
        {
            output.push({ data : [], upperBound : undefined, lowerBound : undefined, label : csv[0][i] });
        }

        for(var j = 1; j < csv.length; j++)
        {
            console.log(j);
            for(var i = 0; i < csv[j].length; i++)
            {
                output[i].data.push(parseFloat(csv[j][i]));
            }
        }
        
        data = output;
    }
    
    
    var dataInterpolated = [];
    
    for(var i = 0; i < data.length; i++)
    {
        dataInterpolated.push({ data : [], upperBound : undefined, lowerBound : undefined, label : data[i].label, hasXY : data[i].hasXY} )

        if(typeof data[i].upperBound != 'undefined')
        {
            dataInterpolated[i].upperBound = [];
        }

        if(typeof data[i].lowerBound != 'undefined')
        {
            dataInterpolated[i].lowerBound = [];
        }
        
        var ptsPerSpecie = Math.min(data[i].data.length, 250)
        var pts = data[i].data.length;
        var mult = 1;

        //interpolate to 500 pts
        if(data[i].data.length > ptsPerSpecie)
        {
            interpolated = true;
            mult = data[i].data.length / ptsPerSpecie;
            pts = ptsPerSpecie;
        }
        else
        {
            interpolated = false;
            mult = 1;
        }
        
        for(var j = 0; j < pts; j++)
        {
            var id = Math.floor(mult * j);
            dataInterpolated[i].data.push(data[i].data[id]);
            if(typeof data[i].upperBound != 'undefined')
            {
                dataInterpolated[i].upperBound.push(data[i].upperBound[id]);
            }

            if(typeof data[i].lowerBound != 'undefined')
            {
                dataInterpolated[i].lowerBound.push(data[i].lowerBound[id]);
            }
        }
    }

    data = dataInterpolated;

    var plot = new TablePlot.TablePlot( { selector : selector, data : data, textData : rawData, displayType : displayType, interpolated : interpolated, xlabel : xlabel } );

    return plot;
}

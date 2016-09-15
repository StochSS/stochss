function generate_datestr() {
    var temp = new Date();
    //var dateStr = padStr(temp.getFullYear()) +
    var dateStr = padStr(temp.getYear()-100) +
                  padStr(1 + temp.getMonth()) +
                  padStr(temp.getDate()) + '_' +
                  padStr(temp.getHours()) +
                  padStr(temp.getMinutes()) +
                  padStr(temp.getSeconds());
    //console.log(dateStr );
    return dateStr
}

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}

var updateMsg = function(data, msg)
{
    if(typeof msg == 'undefined')
    {
        msg = "#msg";
    }

    if(!_.has(data, 'status'))
    {
        $( msg ).text('').prop('class', '');

        return;
    }

    var text = data.msg;

    if(typeof text != 'string')
    {
        text = text.join('<br>')
    }

    $( msg ).html(text);
    if(data.status)
        $( msg ).prop('class', 'alert alert-success');
    else
        $( msg ).prop('class', 'alert alert-error');
    $( msg ).show();
};

var ParameterSweepVisualization = ParameterSweepVisualization || {}

ParameterSweepVisualization.Controller = Backbone.View.extend(
    {
        events : {
        },

        initialize : function(attributes)
        {
            this.data = JSON.parse($( '#initialData' ).text());
        },

        selectAllSpecies : function()
        {
            $( this.el ).find( "#speciesCheckboxes input" ).prop('checked', true);

            this.updateGraphs();
        },

        clearAllSpecies : function()
        {
            $( this.el ).find( "#speciesCheckboxes input" ).prop('checked', false);

            this.updateGraphs();
        },

        render : function()
        {
            this.el = $("#stochoptim")[0];
            this.$el = $( this.el );

            var visualizationTemplate = _.template( $( "#visualizationTemplate" ).html() );
            
            $( this.el ).html( visualizationTemplate(this.data) );

            if(this.data.status == 'Finished')
            {
                var template = _.template('<option><%= type %></option>');

                var mappers = _.sortBy(_.keys(this.data.data[0].result), function(x) { return x; });
                var species = _.sortBy(_.keys(this.data.data[0].result[mappers[0]]), function(x) { return x; });
                var reducers = _.sortBy(_.keys(this.data.data[0].result[mappers[0]][species[0]]), function(x) { return x; });

                for(var i in reducers)
                {
                    $( template( { type : reducers[i] } ) ).appendTo( this.$el.find( "#reducerSelect" ) );
                }                

                for(var i in mappers)
                {
                    $( template( { type : mappers[i] } ) ).appendTo( this.$el.find( "#mapperSelect" ) );
                }
                
                this.$el.find( "#mapperSelect" ).change(_.bind(this.updateGraphs, this));
                this.$el.find( "#reducerSelect" ).change(_.bind(this.updateGraphs, this));

                if(this.data.inData.variableCount == 2) {
                    for(var i in species)
                    {
                        $( template( { type : species[i] } ) ).appendTo( this.$el.find( "#speciesSelect" ) );
                    }
                    
                    this.$el.find( "#speciesSelect" ).change(_.bind(this.updateGraphs, this));

                    this.$el.find( "#speciesSelectDiv" ).show();
                } else {
                    var checkboxTemplate = _.template('<span><input type="checkbox" name="species" value="<%= name %>" checked><%= name %><% if(!last) { %>, <% } else { %><% } %></span>');

                    this.speciesSelectCheckboxes = {};

                    for(var p in species)
                    {
                        var checkbox = $( checkboxTemplate({ name : species[p], last : p == species.length - 1 }) ).appendTo( "#speciesCheckboxes" );
                        
                        checkbox.change(_.bind(this.updateGraphs, this));
                    }

                    this.$el.find( ".selectAll" ).click(_.bind(this.selectAllSpecies, this));
                    this.$el.find( ".clearAll" ).click(_.bind(this.clearAllSpecies, this));
                    
                    this.$el.find( "#speciesCheckboxDiv" ).show();
                }

                $( window ).resize(_.bind(this.updateGraphs, this));
                
                this.updateGraphs();

                this.$el.find( "#graphs" ).show();
            }
            else
            {
                this.$el.find( "#stdout" ).show();
            }

            $( "#accessOutput" ).show();
            // Add event handler to access button
            if (this.data['resource'] == 'molns' && !this.data.output_stored)
            {
                $( "#access" ).html('<i class="icon-download-alt"></i> Fetch Data from Cloud');
                $( "#access" ).click(_.bind(this.handleDownloadDataButton, this));
            }
            else
            {
                $( "#access" ).html('<i class="icon-download-alt"></i> Access Local Data');
                $( "#access" ).click(_.bind(this.handleAccessDataButton, this));
            }
        },

        handleDownloadDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Downloading data from cloud... (will refresh page when ready)" } );

            $.ajax( { type : "POST",
                      url : "/parametersweep",
                      data : { reqType : "getDataCloud",
                               id : this.data.id },
                      success : function(data) {
                          updateMsg(data);
                          
                          if(data.status)
                              location.reload();
                      },                      
                      error: function(data)
                      {
                          updateMsg( { status : false,
                                       msg : "Server error downloading cloud data" } );
                      },
                      dataType : 'json'
                    });
        },

        handleAccessDataButton : function(event)
        {
            updateMsg( { status : true,
                         msg : "Packing up data... (will forward you to file when ready)" } );

            $.ajax( { type : "POST",
                      url : "/parametersweep",
                      data : { reqType : "getDataLocal",
                               id : this.data.id },
                      success : function(data) {
                          updateMsg(data);
                          
                          if(data.status == true)
                          {
                              window.location = data.url;
                          }
                      },                      
                      error: function(data)
                      {
                          updateMsg( { status : false,
                                       msg : "Server error packaging up job data" } );
                      },
                      dataType : 'json'
                    });
        },
        
        updateGraphs : _.debounce(function()
        {
            if(this.data.inData.variableCount == 1)
            {
                this.updateLineGraph();
            }
            else
            {
                this.updateHeatmap();
            }
        }, 200),

        updateLineGraph : function()
        {
            var mapperKey = this.$el.find( "#mapperSelect" ).val().trim();
            var reducerKey = this.$el.find( "#reducerSelect" ).val().trim();

            var species = []
            var checkboxes = this.$el.find( "#speciesCheckboxes input" );

            for(var i = 0; i < checkboxes.length; i++)
            {
                if(checkboxes.eq(i).prop('checked'))
                    species.push(checkboxes.eq(i).val());
            }

            var plotData = [];

            this.$el.find( '#chart' ).empty();
            this.$el.find( "#graphs" ).show();

            var width = $(".metadata").width();
            var height = width * 1 / 2;

            d3.select('#chart').append('svg')
                .attr('width', width + 'px')
                .attr('height', height + 'px');

            var data = this.data.data;

            var parameterKey = _.keys(data[0].parameters)[0];

            for(var i in species)
            {
                var specie = species[i];

                var series = []
                for(var j = 0; j < data.length; j++)
                {
                    var xval = data[j].parameters[parameterKey];

                    if(this.data.inData.logA == true) {
                        xval = Math.log10(xval);
                    }

                    series.push( { x : xval, y : data[j].result[mapperKey][specie][reducerKey] } );
                }

                series = _.sortBy(series, function(v) { return v.x; })

                plotData.push( { key : specie,
                                 values : series } );
            }
            
            var chart = nv.models.lineChart()
                .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis
            ;

            var d3Format = d3.format('.2e');
            
            if(this.data.inData.logA) {
                formatter = function(x) {
                    return d3Format(Math.pow(10.0, x));
                }
            } else {
                formatter = d3Format;
            }
            
            chart.xAxis     //Chart x-axis settings
                .axisLabel(this.data.inData["parameterA"])
                .tickFormat(formatter);
            
            chart.yAxis     //Chart y-axis settings
                .axisLabel('Value of reducer')
                .tickFormat(d3Format);
            
            d3.select('#chart svg')    //Select the <svg> element you want to render the chart in.   
                .datum(plotData)         //Populate the <svg> element with chart data...
                .call(chart);          //Finally, render the chart!
            
            //Update the chart when window resizes.
            nv.utils.windowResize(function() { chart.update() });
        },

        updateHeatmap : function()
        {
            var mapperKey = this.$el.find( "#mapperSelect" ).val().trim();
            var speciesKey = this.$el.find( "#speciesSelect" ).val().trim();
            var reducerKey = this.$el.find( "#reducerSelect" ).val().trim();

            var data = this.data.data;

            var sortedParameters = {}
            var parameterKeys = []

            for(var key in data[0].parameters)
            {
                sortedParameters[key] = [];
                parameterKeys.push(key);
            }

            for(var key in sortedParameters) {
                for(var i in data)
                {
                    sortedParameters[key].push(data[i].parameters[key]);
                }

                sortedParameters[key] = _.uniq(sortedParameters[key]);
            }

            var yCount = sortedParameters[parameterKeys[1]].length;
            var xCount = sortedParameters[parameterKeys[0]].length;

            for(var key in sortedParameters) {
                sortedParameters[key] = _.sortBy(sortedParameters[key], function(x) { return x; });

                var tmp = {};

                for(var i in sortedParameters[key])
                {
                    tmp[sortedParameters[key][i]] = i;
                }

                sortedParameters[key] = tmp;
            }

            var margin = { top: 50, right: 100, bottom: 100, left: 75 };
            var width = $(".metadata").width() - margin.left - margin.right - 75;
            var height = width;
            var gridSizeY = Math.floor(height / yCount);
            var gridSizeX = Math.floor(width / xCount);

            var numberBoxes = 20;

            this.listData = [];
            var colors = [];
            
            for(var d in data)
            {
                var i = sortedParameters[parameterKeys[1]][data[d].parameters[parameterKeys[1]]];
                var j = sortedParameters[parameterKeys[0]][data[d].parameters[parameterKeys[0]]];

                this.listData.push([i, j, data[d].result[mapperKey][speciesKey][reducerKey]]);
            }

            /*for(var i = 0; i < matrix.length; i++)
            {
                for(var j = 0; j < matrix[0].length; j++)
                {
                    this.listData.push([i, j, matrix[i][j]]);
                }
            }*/

            d3.select("#chart svg").remove();
            
            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("float", "left")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var legend = svg.append('g')
                .attr('class', 'colorlegend')
                .attr('x', width)
                .attr('y', margin.top);

            //Draw title
            svg.append("text")
                .attr("class", "title")
                .text("Mapper: " + mapperKey + ", Reducer: " + reducerKey + ", Species: " + speciesKey)
                .style("text-anchor", "middle")
                .style("dominant-baseline", "central")
                .attr("x", width / 2)
                .attr("y", "0")
                .attr("dy", "-1em");
            
            //Draw xlabel
            svg.append("text")
                .attr("class", "label")
                .text(this.data.inData["parameterA"])
                .style("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height)
                .attr("dy", '2em');

            //Draw ylabel
            svg.append("text")
                .attr("class", "label")
                .text(this.data.inData["parameterB"])
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", 0)
                .attr("dy", '-1.4em');

            //Draw y axis numbers
            var yAxisValues = [];
            var useExponential = false;

            for(var i = 0; i < yCount; i++)
            {
                var val = this.data.inData.minValueB + i * (this.data.inData.maxValueB - this.data.inData.minValueB) / (yCount - 1);

                yAxisValues.push(val);

                if((Math.abs(val) < 0.1 && Math.abs(val) > 1e-15) || Math.abs(val) >= 10.0)
                    useExponential = true;
            }

            if(useExponential)
            {
                formatter = function(val) { return val.toExponential(2); };
            }
            else
            {
                formatter = function(val) { return val.toFixed(2); };
            }

            svg.selectAll(".yAxis")
                .data(yAxisValues.map( formatter ))
                .enter().append("text")
                .attr("class", "ticks")
                .attr("transform", "rotate(-90)")
                .text(function (d) { return d; })
                .attr("x", function (d, i) { return -i * gridSizeY - gridSizeY / 2; })
                .attr("y", "-0.25em");

            //Draw x axis number
            var xAxisValues = [];
            var useExponential = false;

            for(var i = 0; i < xCount; i++)
            {
                var val = this.data.inData.minValueA + i * (this.data.inData.maxValueA - this.data.inData.minValueA) / (xCount - 1);

                xAxisValues.push(val);

                if((Math.abs(val) < 0.1 && Math.abs(val) > 1e-15) || Math.abs(val) >= 10.0)
                    useExponential = true;
            }

            if(useExponential)
            {
                formatter = function(val) { return val.toExponential(2); };
            }
            else
            {
                formatter = function(val) { return val.toFixed(2); };
            }

            svg.selectAll(".xAxis")
                .data(xAxisValues.map( formatter ))
                .enter().append("text")
                .attr("class", "ticks")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return gridSizeX / 2 + i * gridSizeX; })
                .attr("y", height)
                .attr("dy", "1.0em");

            /*d3.select("#legend")
                .style("width", "50px")
                .style("height", height + 'px')
                .style("float", "left")
                .style("margin-top", margin.top + 'px');*/

            var colorScale = d3.scale
                .linear()
                .domain([d3.min(this.listData, function (d) { return d[2]; }), d3.max(this.listData, function (d) { return d[2]; })])
                .range(["blue", "red"]);
            
            //Draw legend
            var min = colorScale.domain()[0];
            var max = colorScale.domain()[1];

            // This code for the legends is adapted from https://github.com/jgoodall/d3-colorlegend
            for (var i = 0; i < numberBoxes ; i++) {
                colors[i] = colorScale(max + i * ((min - max) / numberBoxes));
            }

            var boxHeight = height / numberBoxes;
            var boxWidth = 25;

            // set up the legend graphics context
            var legendSel = legend.selectAll('g.legend')
                .data(colors);
            
            var legendBoxes = legendSel.enter().append('g');
            legendSel.exit().remove();

            // value labels
            legend.selectAll('text.colorlegend-labels').remove();

            var minLabel = legend.append('text')
                .attr('class', 'colorlegend-labels')
                .attr('x', width + boxWidth)
                .attr('y', height)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('pointer-events', 'none')
                .text(formatter( colorScale.domain()[0] ));

            var maxLabel = legend.append('text')
                .attr('class', 'colorlegend-labels')
                .attr('x', width + boxWidth)
                .attr('dy', '-0.25em')
                .style('text-anchor', 'middle')
                .style('pointer-events', 'none')
                .text(formatter( colorScale.domain()[1] ));
            
            legendBoxes.append('rect')
                .attr('x', width + boxWidth / 2)
                .attr('y', function(d, i) {
                    return i * (boxHeight);
                })
                .attr('width', boxWidth)
                .attr('height', boxHeight)
                .style('fill', function (d, i) { return colors[i]; });

            //Draw the heatmap. This code is based directly on http://bl.ocks.org/tjdecke/5558084
            var heatMapJoin = svg.selectAll(".rect")
                .data(this.listData);

            heatMapJoin.enter().append("svg")
                .attr("x", function(d) { return (d[0]) * gridSizeX; })
                .attr("y", function(d) { return (d[1]) * gridSizeY; })
                .on('mouseover', function(d) {
                    d3.select(this).select("text").attr('visibility', 'visible');
                })
                .on('mouseout', function(d) {
                    d3.select(this).select("text").attr('visibility', 'hidden');
                });

            heatMapJoin.exit().remove();

            heatMapJoin.append("rect")
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "rect bordered")
                .attr("width", gridSizeX)
                .attr("height", gridSizeY)
                .style("fill", function(d) { return colorScale(d[2]); });

            heatMapJoin.append("text")
                .text(function(d) { return formatter(d[2]); })
                .style("text-anchor", "middle")
                .style("font-size", 16)
                .attr("fill", "#FFFFFF")
                .attr("x", gridSizeX / 2)
                .attr("y", gridSizeY / 2)
                .attr('visibility', 'hidden');
        }
    }
);

$( document ).ready( function() {
    var cont = new ParameterSweepVisualization.Controller();

    cont.render();
});

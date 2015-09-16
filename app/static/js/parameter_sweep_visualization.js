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

var ParameterSweepVisualization = ParameterSweepVisualization || {}

ParameterSweepVisualization.Controller = Backbone.View.extend(
    {
        el : $("#stochoptim"),

        events : {
        },

        initialize : function(attributes)
        {
            this.data = JSON.parse($( '#initialData' ).text());

            this.render();

            $( window ).resize(_.bind(this.render, this));
        },
        
        render : function()
        {
            var visualizationTemplate = _.template( $( "#visualizationTemplate" ).html() );
            
            $( this.el ).html( visualizationTemplate({ name : "hihi",
                                                       resource : "hihi",
                                                       jobStatus : "test",
                                                       modelName : "haha",
                                                       model : this.model }) );

            var margin = { top: 50, right: 50, bottom: 100, left: 75 },
            width = $("#chart").width() - margin.left - margin.right - 75,
            height = width * 3 / 4,//300 - margin.top - margin.bottom,
            gridSizeY = Math.floor(height / this.data.length),
            gridSizeX = Math.floor(width / this.data[0].length);

            this.listData = [];

            for(var i = 0; i < this.data.length; i++)
            {
                for(var j = 0; j < this.data[0].length; j++)
                {
                    this.listData.push([i, j, this.data[i][j]]);
                }
            }

            var colorScale = d3.scale
                .linear()
                .domain([0, d3.max(this.listData, function (d) { return d[2]; })])
                .range(["red", "blue"]);

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("float", "left")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            //Draw legend
            var min = colorScale.domain()[0];
            var max = colorScale.domain()[1];

            // This code for the legends is adapted from https://github.com/jgoodall/d3-colorlegend
            var colors = [];

            var numberBoxes = 20;
            for (i = 0; i < numberBoxes ; i++) {
                colors.push(colorScale(max + i * ((min - max) / numberBoxes)));
            }

            var boxHeight = height / numberBoxes;
            var boxWidth = 25;

            // set up the legend graphics context
            var legend = svg.append('g')
                .attr('class', 'colorlegend')
                .attr('x', width)
                .attr('y', margin.top);
            
            var legendBoxes = legend.selectAll('g.legend')
                .data(colors)
                .enter().append('g');

            // value labels
            var minLabel = legend.append('text')
                .attr('class', 'colorlegend-labels')
                .attr('x', width + boxWidth / 2)
                .attr('dy', '-0.25em')
                .style('text-anchor', 'middle')
                .style('pointer-events', 'none')
                .text(colorScale.domain()[0]);

            var maxLabel = legend.append('text')
                .attr('class', 'colorlegend-labels')
                .attr('x', width + boxWidth / 2)
                .attr('y', height)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('pointer-events', 'none')
                .text(colorScale.domain()[1]);
            
            legendBoxes.append('rect')
                .attr('x', width)
                .attr('y', function(d, i) {
                    return i * (boxHeight);
                })
                .attr('width', boxWidth)
                .attr('height', boxHeight)
                .style('fill', function (d, i) { return colors[i]; });

            d3.select("#legend")
                .style("width", "50px")
                .style("height", height + 'px')
                .style("float", "left")
                .style("margin-top", margin.top + 'px');

            //Draw the heatmap. This code is based directly on http://bl.ocks.org/tjdecke/5558084

            var yAxis = svg.selectAll(".yAxis")
                .data(d3.range(this.data.length))
                .enter().append("text")
                .text(function (d) { return d; })
                .attr("x", "-0.25em")
                .attr("y", function (d, i) { return i * gridSizeY + gridSizeY / 2.0; })
                .style("text-anchor", "end")
                .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

            var xAxis = svg.selectAll(".xAxis")
                .data(d3.range(this.data[0].length))
                .enter().append("text")
                .text(function(d) { return d; })
                .attr("x", function(d, i) { return gridSizeX / 2 + i * gridSizeX; })
                .attr("y", height)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

            var xlabel = svg.append("text")
                .attr("class", "title")
                .text("Output Metric")
                .style("text-anchor", "middle")
                .style("dominant-baseline", "central")
                .attr("x", width / 2)
                .attr("y", "0")
                .attr("dy", "-1em");

            var xlabel = svg.append("text")
                .attr("class", "title")
                .text("Parameter B")
                .style("text-anchor", "middle")
                .attr("x", width / 2)
                .attr("y", height + margin.top);

            var ylabel = svg.append("text")
                .attr("class", "title")
                .text("Parameter A")
                .style("text-anchor", "middle")
                .attr("transform", "rotate(-90)")
                .attr("x", -height / 2)
                .attr("y", 0)
                .attr("dy", '-1em');
            
            var heatMap = svg.selectAll(".hour")
                .data(this.listData)
                .enter().append("rect")
                .attr("x", function(d) { return (d[1]) * gridSizeX; })
                .attr("y", function(d) { return (d[0]) * gridSizeY; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSizeX)
                .attr("height", gridSizeY)
                .style("fill", function(d) { return colorScale(d[2]); });

            heatMap.append("title").text(function(d) { return d[2]; });
        }
    }
);

$( document ).ready( function() {
    var cont = new ParameterSweepVisualization.Controller();
});

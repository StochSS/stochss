var Splot = Splot || {}


Splot.Plot = Backbone.View.extend(
    {
        initialize : function(attributes)
        {
            this.attributes = attributes;

            this.$el = this.attributes.selector;

            $("<hr />Trajectory select:<br />").appendTo( this.$el );
            this.controlDiv = $( "<div />" ).appendTo( this.$el );
            this.renderDiv = $( "<div />" ).appendTo( this.$el );
            this.hiddenDiv = $( "<div />" ).appendTo( this.$el );
            //this.flotDiv = $( "<div />" ).appendTo( this.$el );

            var checkboxTemplate = _.template("<input type='checkbox' /><span>&nbsp;<%= name %>&nbsp;<span />");

            this.selected = [];
            this.plot = undefined;

            var initialCheckbox = undefined;

            this.attributes.data = _.sortByNat(this.attributes.data, function(e) { return e.label }); 

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

            //$( '#plotButton' ).click( _.partial( function(t) { t.getImage(); }, this) );

            if(initialCheckbox)
            {
                initialCheckbox.trigger("click");
            }

            this.render();
        },
        
        //DON'T USE THIS. IT IS JUST REFERENCE CODE
        getImage : function()
        {
            var imageDiv = $( '<img />' );
            var imgsrc = 'data:image/svg+xml;base64,'+ btoa(this.svg.node().parentNode.innerHTML);


            csss = $.get('/static/css/nv.d3.css', success = _.partial(function(t, data)
                         {
                             var byteString = t.svg.node().parentNode.innerHTML;
                             var byteString = t.svg.node().parentNode.innerHTML;

                             csstext = data;
                             svgthing = $.parseXML(byteString);
                             whereweappend = $( svgthing ).find('defs').eq(0);
                             cssobj = $( '<style type="text/css"><![CDATA['+csstext+']]></style>');
                             t = cssobj.appendTo( whereweappend );
                             byteString = (new XMLSerializer()).serializeToString(svgthing);
                             
                             imgsrc = 'data:image/svg+xml;base64,'+ btoa(byteString)

            var img = '<img src="'+imgsrc+'">'; 
            d3.select("#working").html(img);

            var canvas = document.querySelector("canvas");

            var image = new Image;
                             image.src = $('#working').find('img').attr('src');//imgsrc
            image.onload = function() {
                context = canvas.getContext("2d");
                context.drawImage(image, 0, 0);

                /*var a = document.createElement("a");
                a.download = "sample.png";
                a.href = canvas.toDataURL("image/png");
                a.click();*/

                var byteString = atob(document.querySelector("canvas").toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/, ""));
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                var dataView = new DataView(ab);
                var blob = new Blob([dataView], {type: "image/png"});
                var DOMURL = self.URL || self.webkitURL || self;
                var newurl = DOMURL.createObjectURL(blob)
                
                console.log(newurl)
                             console.log(newurl)
            }
                             
                         }, this));


            //this.flotDiv.empty();
            //$( "<img />" ).appendTo( this.flotDiv ).prop('src', imagesrc);
            //this.flotDiv.append( imageDiv );
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
                .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
                .transitionDuration(0)  //how fast do you want the lines to transition?
                .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)//Show the x-axis
 
            chart.xAxis     //Chart x-axis settings
                .axisLabel('Time')
                .tickFormat(d3.format(',r'));
 
            chart.yAxis     //Chart y-axis settings
                .axisLabel( this.attributes.ylabel )
                .tickFormat(d3.format('.2e'));
 
            this.svg    //Select the <svg> element you want to render the chart in.   
                .datum(prunedData)         //Populate the <svg> element with chart data...
                .call(chart);

            /*csss = $.get('/static/css/nv.d3.css', success = _.partial(function(t, data)
                         {
                             var byteString = t.svg.node().parentNode.innerHTML;
                             
                             csstext = data;
                             svgthing = $.parseXML(byteString);
                             whereweappend = $( svgthing ).find('defs').eq(0);
                             cssobj = $( '<style type="text/css"><![CDATA['+csstext+']]></style>');
                             cssobj.appendTo( whereweappend );
                             byteString = (new XMLSerializer()).serializeToString(svgthing);
                             
                             imgsrc = 'data:image/svg+xml;base64,'+ btoa(byteString)
                             
                             var img = '<img src="'+imgsrc+'">'; 
                             t.renderDiv.html(img);
                         }, this));*/
        }
    }
);

Splot.plot = function( selector, data, ylabel )
{
    var plot = new Splot.Plot( { selector : selector, data : data, ylabel : ylabel } );

    return plot;
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

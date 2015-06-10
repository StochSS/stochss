var Volume = Volume || {}

Volume.Controller = Backbone.View.extend(
    {
        el : $("#jobInfo"),

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            // We gotta fetch this also!!
            this.jobInfo = undefined;
            this.meshData = undefined;

            // These are our control states
            this.timeIdx = 0;
            this.selectedSpecies = undefined;
            this.trajectory = 0;

            // Draw a screen so folks have something to see
            this.render();

            // Go get the csvFiles we have hosted
            this.refreshData();
        },

        refreshData : function()
        {
            $.ajax( { url : '/spatial',
            type : 'GET',
            reqType : 'json',
            data : { 'reqType' : 'getJobInfo',
            'id' : this.attributes.id },
            success : _.bind(this.getMesh, this) } );
        },

        getMesh : function() {
            $.when($.ajax( { type : "GET",
                      url : "/spatial",
                      data : { reqType : "timeData", 
                               id : this.attributes.id, 
                               data : JSON.stringify( {
                                   trajectory : 0,
                                   timeIdx : 0 })
                             } 
                           }
                         ),
                   $.ajax( { type : "GET",
                             url : "/spatial",
                             data : { reqType : "onlyColorRange",
                                      id : this.attributes.id,
                                      data : JSON.stringify( {
                                          showPopulation : true,
                                          trajectory : 0,
                                          timeStart : 0,
                                          timeEnd: 0 } )
                                    }
                           }
                         )
                  ).done( _.bind( this.doStuff, this ) );
        },

        doStuff : function(a1, a2) {
            var mesh = a1[0].mesh;
            var voxelTuples = a1[0].voxelTuples;
            var species = a1[0].species;
            var colors = a2[0].colors[0];

            var loader = new THREE.JSONLoader();

            this.threeJsMesh = loader.parse(mesh);
            
        },

        render : function(data)
        {
            if(typeof data != 'undefined')
            {
            }
        }
    }
);

var run = function()
{
    var id = $.url().param("id");
    var cont = new Volume.Controller( { id : id } );
}

$( document ).ready( run );

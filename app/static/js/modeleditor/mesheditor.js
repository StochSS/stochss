$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

var getNewMemberName = function(dict, baseName)
{
    var i = 0;

    var tmpName = baseName + i.toString();

    while(_.has(dict, tmpName))
    {
        i += 1;
        tmpName = baseName + i.toString();
    }

    return tmpName;
};

var updateMsg = function(data, msg)
{
    if(typeof msg == 'undefined')
    {
        msg = "#meshMsg";
    }

    if(!_.has(data, 'status'))
    {
        $( msg ).text('').prop('class', '');

        return;
    }

    var text = data.msg;

    $( msg ).html(text);
    if(data.status)
        $( msg ).prop('class', 'alert alert-success');
    else
        $( msg ).prop('class', 'alert alert-error');
    $( msg ).show();
};

var MeshEditor = MeshEditor || {}

MeshEditor.Controller = Backbone.View.extend(
    {
        el : $("#meshEditorDiv"),

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            // We gotta fetch this as well!
            this.meshInfo = undefined;

            // Draw a screen so folks have something to see
            this.render();

            // Go get the csvFiles we have hosted
            //this.meshFiles = new meshserver.FileList();
            this.refreshData();

            //this.processedMeshFiles = new fileserver.FileList( [], { key : 'processedMeshFiles' } );

            // When finished, queue up another render
            //this.processedMeshFiles.fetch( { success : _.bind(this.render, this) } );
        },

        refreshData : function()
        {
            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'GET',
                      reqType : 'json',
                      data : { 'reqType' : 'getMeshInfo' },
                      success : _.bind(this.render, this) } );
        },
        
        // This event gets fired when the user selects a csv data file
        meshDataPreview : function(pyurdmeMeshJsonData)
        {
            var dom = $( "#meshPreview" ).empty();
            var scene = new THREE.Scene();
            var width = dom.width();//
            var height = 0.75 * width;
            var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize( width, height);
            renderer.setClearColor( 0xffffff, 1);
            
            var rendererDom = $( renderer.domElement ).appendTo(dom);
            
            var loader = new THREE.JSONLoader();
            function load_geometry(model){
                var material = new THREE.MeshLambertMaterial({color: "back", wireframe:true});
	        
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(model.geometry,material);
                scene.add(mesh);
            }


            var model = loader.parse($.parseJSON(pyurdmeMeshJsonData));
            load_geometry(model);

            var controls = new THREE.OrbitControls( camera, renderer.domElement );
            // var controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );

            camera.position.z = 1.5;
            
            
            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000000);
            scene.add(ambientLight);
            hemiLight = new THREE.HemisphereLight( 0x000000, 0x00ff00, 0.6 );
            scene.add(hemiLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);


            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
                controls.update();
            }
            render();
        },

        drawInitialConditionsDom : function()
        {
            $( "#initialConditionsTableBody" ).empty();

            /*var data = { initialConditions : { ic0 : { type : "place", x : 5.0, y : 10.0, z : 1.0, count : 5000 },
                                               ic1 : { type : "scatter", subdomain : 1, count : 100 },
                                               ic2 : { type : "distribute", subdomain : 2, count : 100 } },
                         species : ['S1', 'S2'] };*/

            // Build the header for reaction/species selection table
            var element = $( "<th>" ).appendTo( this.$el.find( ".reactionSubdomainSelectTableHeader" ) );

            // Add in a row for every initial condition
            for(var initialConditionKey in this.data.initialConditions)
            {
                this.addInitialConditionDom(initialConditionKey);
            }

            // Add a new initial condition when this button gets pressed
            $( '.addInitialConditionsButton' ).off('click').on('click', _.bind(function(event) { console.log('a'); this.handleAddInitialConditionButtonPress(event); }, this));
        },
        
        handleAddInitialConditionButtonPress : function(event)
        {
            var icName = getNewMemberName(this.data.initialConditions, 'ic');

            var species = _.keys(this.data.speciesSubdomainAssignments);

            if(species.length > 0)
            {
                this.data.initialConditions[icName] = { type : "place", species : species[0], x : 0.0, y : 0.0, z : 0.0, count : 0 };

                $.ajax( { url : '/modeleditor/mesheditor',
                          type : 'POST',
                          data : { reqType : 'setInitialConditions',
                                   data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                          dataType : 'json',
                          success : updateMsg } );

                this.addInitialConditionDom(icName);
            }
            else
            {
                updateMsg( { status : false, msg : "Model must have a species to have initial conditions!" } );
            }
        },

        addInitialConditionDom : function(initialConditionKey)
        {
            var data = this.data;

            var initialConditionsTableBodyTemplate = "<tr> \
<td> \
<button type=\"button\" class=\"btn btn-default btn-lg delete\"> \
<i class=\"icon-remove\"></i> \
</button> \
</td> \
<td><select class=\"type input-small\"></select></td> \
<td><select class=\"species input-small\"></select></td> \
<td class=\"custom\"></td> \
</tr>";

            var possibleTypes = ["place", "scatter", "distribute"];

            var row = $( initialConditionsTableBodyTemplate ).appendTo( this.$el.find( "#initialConditionsTableBody" ) );

            var typeSelect = row.find( '.type' );
            var speciesSelect = row.find( '.species' );
            var custom = row.find( '.custom' );
            var deleteButton = row.find('.delete');

            // Event handle for delete
            deleteButton.on('click', _.bind(_.partial(function(initialConditionKey, doms, event) {
                delete this.data.initialConditions[initialConditionKey];
                
                for(var i in doms)
                {
                    doms[i].remove();
                }

                $.ajax( { url : '/modeleditor/mesheditor',
                          type : 'POST',
                          data : { reqType : 'setInitialConditions',
                                   data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                          dataType : 'json',
                          success : function() { updateMsg( true, "Initial condition deleted" ); } } );
            }, initialConditionKey, [typeSelect, speciesSelect, custom, row]), this));

            for(var i in possibleTypes)
            {
                var option = $( '<option value="' + possibleTypes[i] + '">' + possibleTypes[i] + '</option>' ).appendTo( typeSelect );

                if(data.initialConditions[initialConditionKey].type == possibleTypes[i])
                {
                    option.prop('selected', true);
                }
            }
            
            typeSelect.on('change', _.bind(_.partial(this.handleInitialConditionsTypeChange, initialConditionKey), this));

            var species = _.keys(this.data.speciesSubdomainAssignments);

            // Write in species in drop down menu
            for(var i in species)
            {
                var specie = species[i];

                var option = $( '<option value="' + specie + '">' + specie + '</option>' ).appendTo( speciesSelect );

                if(data.initialConditions[initialConditionKey].species == specie)
                {
                    option.prop('selected', true);
                }
            }
            
            speciesSelect.on('change', _.bind(_.partial(this.handleInitialConditionsSpeciesChange, initialConditionKey), this));

            // Write in the custom stuff
            if(data.initialConditions[initialConditionKey].type == "place")
            {
                var extraOptionsTemplate = '<table class="table"> \
<thead> \
<tr> \
<td>Count</td><td>X</td><td>Y</td><td>Z</td> \
</tr> \
</thead> \
<tbody> \
<tr> \
<td> \
<input class="count input-small" val="0" /> \
</td> \
<td> \
<input class="x input-small" val="0" /> \
</td> \
<td> \
<input class="y input-small" val="0" /> \
</td> \
<td> \
<input class="z input-small" val="0" /> \
</td> \
</tr> \
</tbody> \
</table>';

                custom.html( extraOptionsTemplate );

                var xBox = custom.find( '.x' );
                var yBox = custom.find( '.y' );
                var zBox = custom.find( '.z' );

                xBox.val(data.initialConditions[initialConditionKey].x);
                yBox.val(data.initialConditions[initialConditionKey].y);
                zBox.val(data.initialConditions[initialConditionKey].z);

                var countBox = custom.find( '.count' );

                countBox.val(data.initialConditions[initialConditionKey].count);

                xBox.on('change', _.bind(_.partial(this.handlePlaceValuesChange, 'x', initialConditionKey), this));
                yBox.on('change', _.bind(_.partial(this.handlePlaceValuesChange, 'y', initialConditionKey), this));
                zBox.on('change', _.bind(_.partial(this.handlePlaceValuesChange, 'z', initialConditionKey), this));
                countBox.on('change', _.bind(_.partial(this.handlePlaceValuesChange, 'count', initialConditionKey), this));
            }
            else if(data.initialConditions[initialConditionKey].type == "scatter")
            {
                var extraOptionsTemplate = '<table class="table"> \
<thead> \
<tr> \
<td> \
Subdomain \
</td> \
<td> \
Count \
</td> \
</tr> \
</thead> \
<tbody> \
<tr> \
<td> \
<select class="subdomain input-small" /> \
</td> \
<td> \
<input class="count input-small" val="0" /> \
</td> \
</tr> \
</tbody> \
</table>';

                custom.html(extraOptionsTemplate);

                var subdomainSelect = custom.find( '.subdomain' );
                var countBox = custom.find( '.count' );

                for(var i in data.subdomains)
                {
                    var subdomainCheckboxTemplate = '<option val="' + data.subdomains[i] + '">' + data.subdomains[i] + '</option>';
                    
                    var menuItem = $( subdomainCheckboxTemplate ).appendTo( subdomainSelect );
                    
                    if(data.initialConditions[initialConditionKey].subdomain == data.subdomains[i])
                    {
                        menuItem.prop('selected', true);
                    }
                }
                
                countBox.val(data.initialConditions[initialConditionKey].count);

                subdomainSelect.on('change', _.bind(_.partial(this.handleScatterSubdomainSelectChange, initialConditionKey), this));
                countBox.on('change', _.bind(_.partial(this.handleScatterCountChange, initialConditionKey), this));
            }
            else if(data.initialConditions[initialConditionKey].type == "distribute")
            {
                //ic2 : { type : "population", subdomain : 2, population : 100 }
                var extraOptionsTemplate = '<table class="table"> \
<thead> \
<tr> \
<td> \
Subdomain \
</td> \
<td> \
Count in each voxel \
</td> \
</tr> \
</thead> \
<tbody> \
<tr> \
<td> \
<select class="subdomain input-small" /> \
</td> \
<td> \
<input class="count input-small" val="0" /> \
</td> \
</tr> \
</tbody> \
</table>';

                custom.html(extraOptionsTemplate);

                var subdomainSelect = custom.find( '.subdomain' );
                var countBox = custom.find( '.count' );

                for(var i in data.subdomains)
                {
                    var subdomainCheckboxTemplate = '<option val="' + data.subdomains[i] + '">' + data.subdomains[i] + '</option>';
                    
                    var menuItem = $( subdomainCheckboxTemplate ).appendTo( subdomainSelect );
                    
                    if(data.initialConditions[initialConditionKey].subdomain == data.subdomains[i])
                    {
                        menuItem.prop('selected', true);
                    }
                }
                
                countBox.val(data.initialConditions[initialConditionKey].count);

                subdomainSelect.on('change', _.bind(_.partial(this.handleDistributeSubdomainSelectChange, initialConditionKey), this));
                countBox.on('change', _.bind(_.partial(this.handleDistributeCountChange, initialConditionKey), this));
            }
        },

        handleInitialConditionsTypeChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            // If somehow these are the same do nothing
            if(this.data.initialConditions[initialConditionsKey].type == val)
            {
                return;
            }

            this.data.initialConditions[initialConditionsKey].type = val;

            // Clear out the old type settings (saving count -- cause that is in all initial conditions)
            var count = this.data.initialConditions[initialConditionsKey].count;

            // Insert default new ones
            if(val == 'place')
            {
                var species = this.data.initialConditions[initialConditionsKey]['species'];
                this.data.initialConditions[initialConditionsKey] = { species : species,
                                                                      type : 'place',
                                                                      x : 0.0,
                                                                      y : 0.0,
                                                                      z : 0.0,
                                                                      count : count };
            }
            else // scatter and distribute use the same variables
            {
                var subdomain = undefined;

                if(_.has(this.data.initialConditions[initialConditionsKey], 'subdomain'))
                {
                    subdomain = this.data.initialConditions[initialConditionsKey]['subdomain'];
                }
                
                if(typeof subdomain === 'undefined')
                {
                    subdomain = this.data.subdomains[0];
                }

                var species = this.data.initialConditions[initialConditionsKey]['species'];
                this.data.initialConditions[initialConditionsKey] = { species : species,
                                                                      subdomain : subdomain,
                                                                      type : val,
                                                                      count : count };
            }
            
            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : _.bind(_.partial(function(returnData) {
                          // Redraw
                          this.drawInitialConditionsDom();
                          updateMsg(returnData);
                      }), this) } );
        },

        handleInitialConditionsSpeciesChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();
            
            this.data.initialConditions[initialConditionsKey].species = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );
        },

        handlePlaceValuesChange : function(name, initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            this.data.initialConditions[initialConditionsKey][name] = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );
        },

        handleScatterSubdomainSelectChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            this.data.initialConditions[initialConditionsKey].subdomain = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );

        },

        handleScatterCountChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            this.data.initialConditions[initialConditionsKey].count = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );

        },

        handleDistributeSubdomainSelectChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            this.data.initialConditions[initialConditionsKey].subdomain = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );

        },

        handleDistributeCountChange : function(initialConditionsKey, event)
        {
            var val = $( event.target ).val().trim();

            this.data.initialConditions[initialConditionsKey].count = val;

            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg } );
        },

        render : function(data)
        {
            $( this.el ).find('#progresses').empty();
            
            if(typeof data != 'undefined')
            {
                this.data = data;
            }

            if(typeof this.data != 'undefined')
            {
                //Add initial conditions dom!!
                this.drawInitialConditionsDom();

                // Build the reactions subdomains selection table
                var reactionsSubdomainTableTitle = $( "#reactionsSubdomainsTableTitle" );
                var reactionsSubdomainTableHeader = $( "#reactionsSubdomainsTableHeader" );
                var reactionsSubdomainTableBody = $( "#reactionsSubdomainsTableBody" );
                var reactionsSubdomainTable = $( "#reactionsSubdomainsTable" );

                // It's possible the page does not have these elements, so check before we try
                //    to do anything with them
                if(reactionsSubdomainTableHeader.length > 0)
                {
                    reactionsSubdomainTableHeader.empty();
                    reactionsSubdomainTableBody.empty();

                    var subdomains = this.data['subdomains'];
                    var reactionsSubdomainAssignments = this.data['reactionsSubdomainAssignments'];
                    
                    $( "<th></th>" ).appendTo( reactionsSubdomainsTableHeader );

                    //Insert the col. header elements (the subdomain columns)
                    for(var subdomainIdx in subdomains)
                    {
                        $( "<th>" + subdomains[subdomainIdx] + "</th>" ).appendTo( reactionsSubdomainsTableHeader );
                    }

                    //Set the width of the table title appropriatelike
                    reactionsSubdomainTableTitle.prop('colspan', subdomains.length + 1);

                    //Insert a row for every reactions
                    for(var reactionId in reactionsSubdomainAssignments)
                    {
                        var row = $( "<tr></tr>" ).appendTo( reactionsSubdomainsTableBody );

                        $( "<td>" + reactionId + "</td>" ).appendTo( row );

                        for(var subdomainIndex in subdomains)
                        {
                            var subdomainId = subdomains[subdomainIndex]

                            var checked = false;

                            if(_.indexOf(reactionsSubdomainAssignments[reactionId], subdomainId) >= 0)
                            {
                                checked = true;
                            }

                            var checkbox = $( "<td><input type=\"checkbox\"></td>" ).appendTo( row ).find(' input ');

                            checkbox.prop('checked', checked);

                            checkbox.on('click', _.bind(_.partial(this.setReactionsSubdomainAssignment, reactionId, subdomainId), this));
                        }
                    }
                    
                    //reactionsSubdomainTable.dataTable();
                }

                // Build the species subdomains selection table
                var speciesSubdomainTableTitle = $( "#speciesSubdomainsTableTitle" );
                var speciesSubdomainTableHeader = $( "#speciesSubdomainsTableHeader" );
                var speciesSubdomainTableBody = $( "#speciesSubdomainsTableBody" );
                var speciesSubdomainTable = $( "#speciesSubdomainsTable" );

                // It's possible the page does not have these elements, so check before we try
                //    to do anything with them
                if(speciesSubdomainTableHeader.length > 0)
                {
                    var subdomains = this.data['subdomains'];
                    var speciesSubdomainAssignments = this.data['speciesSubdomainAssignments'];

                    speciesSubdomainTableHeader.empty();
                    speciesSubdomainTableBody.empty();

                    $( "<th></th>" ).appendTo( speciesSubdomainTableHeader );

                    //Insert the col. header elements (the subdomain columns)
                    for(var subdomainIdx in subdomains)
                    {
                        $( "<th>" + subdomains[subdomainIdx] + "</th>" ).appendTo( speciesSubdomainTableHeader );
                    }

                    //Set the width of the table title appropriatelike
                    speciesSubdomainTableTitle.prop('colspan', subdomains.length + 1);

                    //Insert a row for every species
                    for(var speciesId in speciesSubdomainAssignments)
                    {
                        
                        var row = $( "<tr></tr>" ).appendTo( speciesSubdomainTableBody );

                        $( "<td>" + speciesId + "</td>" ).appendTo( row );

                        for(var subdomainIndex in subdomains)
                        {
                            var subdomainId = subdomains[subdomainIndex]

                            var checked = false;

                            if(_.indexOf(speciesSubdomainAssignments[speciesId], subdomainId) >= 0)
                            {
                                checked = true;
                            }

                            var checkbox = $( "<td><input type=\"checkbox\"></td>" ).appendTo( row ).find(' input ');

                            checkbox.prop('checked', checked)

                            checkbox.on('click', _.bind(_.partial(this.setSpeciesSubdomainAssignment, speciesId, subdomainId), this));
                        }
                    }

                    //speciesSubdomainTable.dataTable();
                }

                //$( '#meshTable' ).dataTable();
                $( '.meshTable' ).show();

                var meshTableBody = $( this.el ).find('#meshTableBody');

                meshTableBody.empty();

                var exampleMeshes = data['meshes'];

                // Draw all the available examples meshes in the selection table
                for(var i = 0; i < exampleMeshes.length; i++)
                {
                    //this.descriptionTemp = _.template('')

	            this.optionTemp = _.template('<tr> \
<td><input type="radio" name="processedMeshFiles"></td><td><%= name %></td><td><a data-toggle=\"modal\" href=\"#descriptionModal" + exampleMeshes[i].id + "\" style=\"text-decoration: none;\">Description <i class=\"icon-question-sign\"></i></a></td>\
</tr>');
                        ""                 
                    var newOption = $( this.optionTemp( exampleMeshes[i]) ).appendTo( meshTableBody );

                    if(data['meshWrapperId'] == exampleMeshes[i].id)
                    {
                        newOption.find('input').click();

                        $.ajax( { url: '/FileServer/large/processedMeshFiles/' + exampleMeshes[i].processedMeshFileId + '/file.dat',
                                  success : _.bind( this.meshDataPreview, this) });
                    }
                    // When the initialDataFiles gets selected, fill the preview box with a preview of the mesh
                    newOption.find('input').on('click', _.bind(_.partial( function(data) {
                        //this.mesh = mesh;
                        this.setMeshSelect(data.id);

                        $.ajax( { url: '/FileServer/large/processedMeshFiles/' + data.processedMeshFileId + '/file.dat',
                                  success : _.bind( this.meshDataPreview, this) });
                    }, exampleMeshes[i]), this));
                }

                if(!data['meshWrapperId'])
                {
                    // Have something selected
                    meshTableBody.find('input').eq(0).click();
                }
            }
        },

        // The three following functions are all responsible for pinging the main server when something changes
        //    I encode all the data as JSON to keep the variable types encoded properly (Bools, ints, strings) and just cause I do it a lot elsewhere

        setMeshSelect : function(meshWrapperId)
        {
            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setMesh',
                               data : JSON.stringify( { meshWrapperId : meshWrapperId } ) },
                      dataType : 'json',
                      success : _.bind(this.render, this) } );
        },

        setSpeciesSubdomainAssignment : function(speciesId, subdomainId, event)
        {
            $.ajax( { url : '/modeleditor/specieseditor',
                      type : 'POST',
                      data : { reqType : 'setSpeciesSubdomainAssignment',
                               data : JSON.stringify( { speciesId : speciesId,
                                                        subdomainId : subdomainId,
                                                        value : $( event.target ).prop('checked') } ) },
                      dataType : 'json',
                      success : updateMsg } );
        },

        setReactionsSubdomainAssignment : function(reactionId, subdomainId, event)
        {
            $.ajax( { url : '/modeleditor/reactioneditor',
                      type : 'POST',
                      data : { reqType : 'setReactionSubdomainAssignment',
                               data : JSON.stringify( { reactionId : reactionId, // I encode this object as JSON to keep the variable types encoded properly (Bools, ints, strings) and just cause I do it a lot elsewhere
                                                        subdomainId : subdomainId,
                                                        value : $( event.target ).prop('checked') } ) },
                      dataType : 'json',
                      success : updateMsg } );
        }
    }
);

var run = function()
{
    //var id = $.url().param("id");

    var cont = new MeshEditor.Controller();
}

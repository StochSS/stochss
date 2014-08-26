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
    if(msg == 'success')
    {
        msg = undefined;
    }

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

        renderFrame : function() {
            this.renderer.render(this.scene, this.camera);
            requestAnimationFrame(_.bind(this.renderFrame, this));
            this.controls.update();
        },
        
        drawMesh : function(pyurdmeMeshJsonData)
        {
            if(!this.renderer)
            {
                var dom = $( "#meshPreview" ).empty();
                var width = dom.width();//
                var height = 0.75 * width;
                var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
                var renderer = new THREE.WebGLRenderer();
                renderer.setSize( width, height);
                renderer.setClearColor( 0xffffff, 1);
            
                var rendererDom = $( renderer.domElement ).appendTo(dom);
                
                var controls = new THREE.OrbitControls( camera, renderer.domElement );
                // var controls = new THREE.OrbitControls( camera );
                //controls.addEventListener( 'change', render );
                
                camera.position.z = 1.5;

                this.camera = camera;
                this.renderer = renderer;
                this.controls = controls;
            }
            else
            {
                delete this.scene;
            }
            
            var scene = new THREE.Scene();
            var loader = new THREE.JSONLoader();
            function load_geometry(model){
                var material=new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors, wireframe:true,transparent:false,opacity: 1} );
                //var material = new THREE.MeshLambertMaterial({color: "back", wireframe:true});
	        
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(model.geometry,material);
                scene.add(mesh);
            }
            
            var model = loader.parse(pyurdmeMeshJsonData);
            delete loader;
            load_geometry(model);
            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000000);
            scene.add(ambientLight);
            hemiLight = new THREE.HemisphereLight( 0x000000, 0x00ff00, 0.6 );
            scene.add(hemiLight);

            // directional lighting
            var directionalLight = new THREE.DirectionalLight(0xffffff);
            directionalLight.position.set(1, 1, 1).normalize();
            scene.add(directionalLight);

            this.scene = scene;

            this.renderFrame();
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

                this.drawInitialCondition(icName);
            }
            else
            {
                updateMsg( { status : false, msg : "Model must have a species to have initial conditions!" } );
            }
        },

        drawInitialConditions : function()
        {
            if(!this.initialConditionInitialized)
            {
                // Add a new initial condition when this button gets pressed
                $( '.addInitialConditionsButton' ).on('click', _.bind( this.handleAddInitialConditionButtonPress , this));

                this.initialConditionInitialized = true;
            }

            $( "#initialConditionsTableBody" ).empty();

            // Build the header for reaction/species selection table
            var element = $( "<th>" ).appendTo( this.$el.find( ".reactionSubdomainSelectTableHeader" ) );

            // Add in a row for every initial condition
            for(var initialConditionKey in this.data.initialConditions)
            {
                this.drawInitialCondition(initialConditionKey);
            }
        },
        
        handleInitialConditionsTypeChange : function(initialConditionsKey, element, event)
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

            this.drawInitialCondition(initialConditionsKey, element);
            
            $.ajax( { url : '/modeleditor/mesheditor',
                      type : 'POST',
                      data : { reqType : 'setInitialConditions',
                               data : JSON.stringify( { initialConditions : this.data['initialConditions'] } ) },
                      dataType : 'json',
                      success : updateMsg} );
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

        handleDeleteInitialCondition : function(initialConditionKey, doms, event) {
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
        },

        drawInitialCondition : function(initialConditionKey, element)
        {
            if(!element)
            {
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

                element = $( initialConditionsTableBodyTemplate ).appendTo( this.$el.find( "#initialConditionsTableBody" ) );
            }

            var data = this.data;

            var possibleTypes = ["place", "scatter", "distribute"];

            var typeSelect = element.find( '.type' ).empty();
            var speciesSelect = element.find( '.species' ).empty();
            var custom = element.find( '.custom' ).empty();
            var deleteButton = element.find('.delete');

            // Event handle for delete
            deleteButton.on('click', _.bind(_.partial(this.handleDeleteInitialCondition, initialConditionKey, [typeSelect, speciesSelect, custom, element]), this));

            for(var i in possibleTypes)
            {
                var option = $( '<option value="' + possibleTypes[i] + '">' + possibleTypes[i] + '</option>' ).appendTo( typeSelect );

                if(data.initialConditions[initialConditionKey].type == possibleTypes[i])
                {
                    option.prop('selected', true);
                }
            }
            
            typeSelect.on('change', _.bind(_.partial(this.handleInitialConditionsTypeChange, initialConditionKey, element), this));

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
                var extraOptionsTemplate = '<table style="width: 1pt;" class="table"> \
<tbody> \
<tr> \
<td style="width: 1pt;">Count</td><td> \
<input class="count input-small" val="0" /> \
</td> \
</tr> \
<tr> \
<td>X</td><td> \
<input class="x input-small" val="0" /> \
</td> \
</tr> \
<tr> \
<td>Y</td><td> \
<input class="y input-small" val="0" /> \
</td> \
</tr> \
<tr> \
<td>Z</td><td> \
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
                var extraOptionsTemplate = '<table style="width: 1pt;" class="table"> \
<tbody> \
<tr style="width: 1pt;"> \
<td> \
Subdomain \
</td> \
<td> \
<select class="subdomain input-small" /> \
</td> \
</tr> \
<tr> \
<td> \
Count \
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
                var extraOptionsTemplate = '<table style="width: 1pt;" class="table"> \
<tbody> \
<tr style="width: 1pt;"> \
<td> \
Subdomain \
</td> \
<td> \
<select class="subdomain input-small" /> \
</td> \
</tr> \
<tr> \
<td> \
Count in each voxel \
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

        handleMeshDataAdd : function(event, data)
        {
            if(this.uploaderState.meshFileData)
            {
                delete this.uploaderState.meshFileData;
                delete this.uploaderState.meshSubmitted;
                delete this.uploaderState.meshFileId;
            }

            var textArray = data.files[0].name.split('.');

            var ext = textArray[textArray.length - 1];

            if(ext.toLowerCase() != 'xml')
            {
                updateMsg( { status : false,
                             msg : 'Mesh file must be a .xml' },
                           '#meshDataUploadStatus');
                
                return;
            }

            $( event.target ).prop('title', data.files[0].name);
            updateMsg( { status : true,
                         msg : data.files[0].name + " selected" },
                       '#meshDataUploadStatus');

            var nameBox = $( '.uploadMeshDiv' ).find('.name');

            var baseName;

            if(nameBox.val().trim() == '')
            {
                baseName = data.files[0].name.split('.')[0];
            }
            else
            {
                baseName = nameBox.val().trim();
            }

            var newName;
            var i = 0;
            
            var nameUnique = true;
            do
            {
                nameUnique = true;
                
                newName = baseName + i;
                
                for(var i in this.data.meshes)
                {
                    if(this.data.meshes[i].name == newName)
                    {
                        nameUnique = false;
                        break;
                    }
                }
            } while(!nameUnique);

            nameBox.val(newName);

            this.uploaderState.meshFileData = data;

            $( "#meshUploadButton" ).prop('disabled', false);
        },

        handleSubdomainsDataAdd : function(event, data)
        {
            if(this.uploaderState.subdomainFileData)
            {
                delete this.uploaderState.subdomainsFileData;
                delete this.uploaderState.subdomainsSubmitted;
                delete this.uploaderState.subdomainsFileId;
            }

            var textArray = data.files[0].name.split('.');

            var ext = textArray[textArray.length - 1];

            if(ext.toLowerCase() != 'txt')
            {
                updateMsg( { status : false,
                             msg : 'Subdomain file must be a .txt' },
                           '#meshDataUploadStatus');
                
                return;
            }

            $( event.target ).prop('title', data.files[0].name);
            updateMsg( { status : true,
                         msg : data.files[0].name + " selected" },
                       '#subdomainDataUploadStatus');

            this.uploaderState.subdomainsFileData = data;
        },

        handleMeshUploadButton : function(event)
        {
            if(this.uploaderState.meshFileData)
            {
                this.uploaderState.meshFileData.submit();
                this.uploaderState.meshSubmitted = true;

                updateMsg( { status : true,
                             msg : 'Uploading mesh...' },
                           '#meshDataUploadStatus');
            }

            if(this.uploaderState.subdomainsFileData)
            {
                this.uploaderState.subdomainsFileData.submit();
                this.uploaderState.subdomainsSubmitted = true;

                updateMsg( { status : true,
                             msg : 'Uploading subdomain...' },
                           '#subdomainDataUploadStatus');
            }

            this.uploaderState.name = $( '.uploadMeshDiv' ).find( '.name' ).val();
            this.uploaderState.description = $( '.uploadMeshDiv' ).find( '.descriptionText' ).val();
        },

        handleMeshUploadFinish : function(event, data)
        {
            this.uploaderState.meshFileId = data.result[0].id;

            updateMsg( { status : true,
                         msg : 'Mesh uploaded' },
                       '#meshDataUploadStatus');
            
            this.createMeshWrapper();
        },

        handleSubdomainsUploadFinish : function(event, data)
        {
            this.uploaderState.subdomainsFileId = data.result[0].id;
                        
            updateMsg( { status : true,
                         msg : 'Subdomains uploaded' },
                       '#subdomainDataUploadStatus');
            
            this.createMeshWrapper();
        },

        createMeshWrapper : function()
        {
            var data = {};

            if(this.uploaderState.meshSubmitted && this.uploaderState.meshFileId)
            {
                data['meshFileId'] = this.uploaderState.meshFileId;
                data['name'] = this.uploaderState.name;
                data['description'] = this.uploaderState.description;

                if(this.uploaderState.subdomainsSubmitted && this.uploaderState.subdomainsFileId)
                {
                    data['subdomainsFileId'] = this.uploaderState.subdomainsFileId;
                }

                if(!this.uploaderState.subdomainsSubmitted || (this.uploaderState.meshFileId && this.uploaderState.subdomainsFileId))
                {
                    $.ajax( { type : 'POST',
                              url: '/modeleditor/mesheditor',
                              data: { reqType : 'addMeshWrapper',
                                      data : JSON.stringify( data ) },
                              success : _.bind(this.handleMeshWrapperCreated, this) });
                }
            }
        },

        handleMeshWrapperCreated : function(data)
        {
            this.data.meshes.push(data);

            updateMsg( { status : true,
                         msg : 'Mesh created'} );

            this.drawMeshSelect();
        },

        handleMeshSelect : function(mesh)
        {
            if(this.data.meshWrapperId != mesh.id)
            {
                // Send a message to the server to change the selected mesh
                //   Server will respond with new data object (that needs passed to render -- everything will get redrawn)
                $.ajax( { url : '/modeleditor/mesheditor',
                          type : 'POST',
                          data : { reqType : 'setMesh',
                                   data : JSON.stringify( { meshWrapperId : mesh.id } ) },
                          dataType : 'json',
                          success : _.bind(this.render, this) } );
            }
            
            $( '.mesh' ).show();
            $( '.meshInfoDiv' ).find( '.name' ).text(mesh.name);
            $( '.meshInfoDiv, .uploadMeshDiv' ).find( '.description' ).text(mesh.description);
    
            $.ajax( { type : 'POST',
                      url: '/modeleditor/mesheditor',
                      data: { reqType : 'getMesh',
                              data : JSON.stringify( { id : mesh.id,
                                                       selectedSubdomains : [] } ) }, // Initially, no subdomains should be selected, so send empty array
                      success : _.bind( this.drawMesh, this) });
        },

        handleMeshDelete : function(mesh, element)
        {
            if(this.data.meshWrapperId != mesh.id)
            {
                $.ajax( { type : 'POST',
                          url: '/modeleditor/mesheditor',
                          data: { reqType : 'deleteMesh',
                                  data: JSON.stringify( { id : mesh.id } ) }, // Initially, no subdomains should be selected, so send empty array
                          success : _.bind( this.drawMesh, this) });
                
                element.remove();
            }
            else
            {
                updateMsg({ status : false, msg : 'Can\'t delete currently selected mesh' });
            }
        },

        handleMeshNameChange : function(newOption, i, event)
        {
            var selected = newOption.find('.meshSelect').prop('checked');
            var newName = $( event.target ).val().trim();

            if(selected)
            {
                $( '.meshInfoDiv' ).find( '.name' ).text(newName);
            }

            $.ajax( { type : 'POST',
                      url: '/modeleditor/mesheditor',
                      data: { reqType : 'setName',
                              data: JSON.stringify( { id : this.data.meshes[i].id,
                                                      newName : newName } ) },
                      success : updateMsg });

            this.data.meshes[i].name = newName;
        },

        drawMeshSelect : function()
        {
            // Run the one-time things
            if(!this.meshSelectInitialized)
            {
                this.meshSelectInitialized = true;

                $( '.meshTable' ).show();
                // When a user uploads a file, draw a status bar, and after the upload is finished request the refreshes
                this.uploaderState = {};
            
                $( "#meshUploadButton" ).click(_.bind(this.handleMeshUploadButton, this));
            
                $( this.el ).find('#meshDataUpload').fileupload({
                    url: '/FileServer/large/meshFiles',
                    dataType: 'json',
                    add : _.bind(this.handleMeshDataAdd, this),
                    done : _.bind(this.handleMeshUploadFinish, this)
                });
                
                $( this.el ).find('#subdomainDataUpload').fileupload({
                    url: '/FileServer/large/subdomainFiles',
                    dataType: 'json',
                    add : _.bind(this.handleSubdomainsDataAdd, this),
                    done : _.bind(this.handleSubdomainsUploadFinish, this)
                });
            }
            
            var meshTableBody = $( this.el ).find('#meshTableBody');
            
            meshTableBody.empty();

            this.data.meshes = _.sortBy(this.data.meshes, function(data) { return data['name']; } );
            
            // Draw all the available examples meshes in the selection table
            for(var i = 0; i < this.data.meshes.length; i++)
            {
	        var optionTemp = _.template('<tr> \
<td> \
<button type=\"button\" class=\"btn btn-default btn-lg delete\"> \
<i class=\"icon-remove\"></i> \
</button> \
</td> \
<td> \
<input class="meshSelect" type="radio" name="processedMeshFiles"> \
</td> \
<td> \
<input class="meshName" type="text" value="<%= name %>"> \
</td> \
</tr>');
                ""                 

                //Don't draw ghosts
                if(this.data.meshes[i].ghost)
                    continue

                var newOption = $( optionTemp( this.data.meshes[i] ) ).appendTo( meshTableBody );

                // If there is already a mesh selected, click the option
                if(this.data.meshWrapperId == this.data.meshes[i].id)
                {
                    newOption.find('.meshSelect').click();
                }

                newOption.find('.meshName').on('change', _.bind(_.partial( this.handleMeshNameChange, newOption, i ), this));                
                newOption.find('.meshSelect').on('click', _.bind(_.partial( this.handleMeshSelect, this.data.meshes[i]), this));
                newOption.find('.delete').on('click', _.bind(_.partial( this.handleMeshDelete, this.data.meshes[i], newOption), this));
            }

            if( this.data.selectedMesh )
            {
                this.handleMeshSelect( this.data.selectedMesh );
            }
            else
            {
                $( '.meshLibrary' ).click();
            }
        },

        handleSubdomainSelect : function(subdomain, event)
        {
            var idx = _.indexOf(this.selectedSubdomains, subdomain);
            
            var checked = $( event.target ).prop('checked');
            
            if(checked && idx < 0)
            {
                this.selectedSubdomains.push(subdomain);
            }
            
            if(!checked && idx >= 0)
            {
                this.selectedSubdomains.splice(idx, 1);
            }
                    
            $.ajax( { type : 'POST',
                      url: '/modeleditor/mesheditor',
                      data: { reqType : 'getMesh',
                              data : JSON.stringify( { id : this.data.meshWrapperId,
                                                       selectedSubdomains : this.selectedSubdomains } ) },
                      success : _.bind( this.drawMesh, this) });
        },

        drawSubdomainSelector : function()
        {
            //Draw the subdomain selector stuff and hook up event handlers
            this.selectedSubdomains = [];

            $( '#subdomainSelect' ).empty();

            for(var i in this.data.subdomains)
            {
                var checkbox = $( '<div><input type="checkbox">Subdomain ' + this.data.subdomains[i] + '</div>' ).appendTo(  $( '#subdomainSelect' ) ).find( 'input' );
                
                checkbox.change(_.bind(_.partial(this.handleSubdomainSelect, this.data.subdomains[i]), this));
            }
        },

        handleSpeciesSubdomainAssignment : function(speciesId, subdomainId, event)
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

        drawSpeciesSubdomainAssignments : function()
        {
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

                        checkbox.on('click', _.bind(_.partial(this.handleSpeciesSubdomainAssignment, speciesId, subdomainId), this));
                    }
                }
            }
        },

        handleReactionsSubdomainAssignment : function(reactionId, subdomainId, event)
        {
            $.ajax( { url : '/modeleditor/reactioneditor',
                      type : 'POST',
                      data : { reqType : 'setReactionSubdomainAssignment',
                               data : JSON.stringify( { reactionId : reactionId, // I encode this object as JSON to keep the variable types encoded properly (Bools, ints, strings) and just cause I do it a lot elsewhere
                                                        subdomainId : subdomainId,
                                                        value : $( event.target ).prop('checked') } ) },
                      dataType : 'json',
                      success : updateMsg } );
        },

        drawReactionsSubdomainAssignments : function()
        {
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

                        checkbox.on('click', _.bind(_.partial(this.handleReactionsSubdomainAssignment, reactionId, subdomainId), this));
                    }
                }
            }
        },

        render : function(data)
        {
            if(typeof data != 'undefined')
            {
                this.data = data;
            }

            if(typeof this.data != 'undefined')
            {
                // Set up the subdomain selector (for mesh preview)
                this.drawSubdomainSelector();

                // Set up the mesh selector
                this.drawMeshSelect();

                //Add initial conditions dom!!
                this.drawInitialConditions();

                // Set up the species/subdomain assignment thing
                this.drawSpeciesSubdomainAssignments();

                // Set up the reactions/subdomain assignment thing
                this.drawReactionsSubdomainAssignments();
            }
        }
    }
);

var run = function()
{
    //var id = $.url().param("id");

    var cont = new MeshEditor.Controller();
}

$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

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
        
        render : function(data)
        {
            $( this.el ).find('#progresses').empty();
            
            if(typeof data != 'undefined')
            {
                this.data = data;
            }

            if(typeof this.data != 'undefined')
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
                    for(var subdomainId in subdomains)
                    {
                        $( "<th>" + subdomainId + "</th>" ).appendTo( reactionsSubdomainsTableHeader );
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

                    reactionsSubdomainTable.dataTable();
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
                    for(var subdomainId in subdomains)
                    {
                        $( "<th>" + subdomainId + "</th>" ).appendTo( speciesSubdomainTableHeader );
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

                    speciesSubdomainTable.dataTable();
                }

                $( '#meshTable' ).dataTable();
                $( '.meshTable' ).show();

                var meshTableBody = $( this.el ).find('#meshTableBody');

                meshTableBody.empty();

                var exampleMeshes = data['meshes'];

                // Draw all the available examples meshes in the selection table
                for(var i = 0; i < exampleMeshes.length; i++)
                {
	            this.optionTemp = _.template('<tr> \
<td><input type="radio" name="processedMeshFiles"></td><td><%= path %></td><td></td>\
</tr>');
                    
                    var newOption = $( this.optionTemp( exampleMeshes[i]) ).appendTo( meshTableBody );

                    if(data['meshWrapperId'] == exampleMeshes[i].meshWrapperId)
                    {
                        newOption.find('input').click();

                        $.ajax( { url: '/FileServer/large/processedMeshFiles/' + exampleMeshes[i].processedMeshFileId + '/file.dat',
                                  success : _.bind( this.meshDataPreview, this) });
                    }
                    // When the initialDataFiles gets selected, fill the preview box with a preview of the mesh
                    newOption.find('input').on('click', _.bind(_.partial( function(data) {
                        //this.mesh = mesh;
                        this.setMeshSelect(data.meshWrapperId);

                        $.ajax( { url: '/FileServer/large/processedMeshFiles/' + data.processedMeshFileId + '/file.dat',
                                  success : _.bind( this.meshDataPreview, this) });
                    }, exampleMeshes[i]), this));
                }

                // Have something selected
                //meshTableBody.find('input').eq(0).click();
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

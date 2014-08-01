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
            this.processedMeshFiles = undefined;

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
                      data : { 'reqType' : 'getMeshes' },
                      success : _.bind(this.render, this) } );
        },
        
        // This event gets fired when the user selects a csv data file
        meshDataPreview : function(pyurdmeMeshJsonData)
        {
            var dom = $( "#meshPreview" ).empty();
            var scene = new THREE.Scene();
            var width = dom.width();//
            var height = width;
            var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            var renderer = new THREE.WebGLRenderer();
            renderer.setSize( width, height);
            
            var rendererDom = $( renderer.domElement ).appendTo(dom);
            
            var loader = new THREE.JSONLoader();
            function load_geometry(model){
                var material = new THREE.MeshLambertMaterial({color: "blue", wireframe:true});
	        
                material.side = THREE.DoubleSide;
                mesh = new THREE.Mesh(model.geometry,material);
                scene.add(mesh);
            }


            var model = loader.parse($.parseJSON(pyurdmeMeshJsonData));
            load_geometry(model);

            var controls = new THREE.OrbitControls( camera, renderer.domElement );
            // var controls = new THREE.OrbitControls( camera );
            //controls.addEventListener( 'change', render );

            camera.position.z = 1;
            
            
            // add subtle blue ambient lighting
            var ambientLight = new THREE.AmbientLight(0x000044);
            scene.add(ambientLight);
            hemiLight = new THREE.HemisphereLight( 0x0000ff, 0x00ff00, 0.6 );
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
            $( '.meshTable' ).hide();

            $( this.el ).find('#progresses').empty();
            
            if(typeof data != 'undefined')
            {
                this.data = data;
            }

            if(typeof this.data != 'undefined')
            {
                $( '.meshTable' ).show();

                var meshTableBody = $( this.el ).find('#meshTableBody');

                meshTableBody.empty();

                if(this.data.length == 0)
                {
                    var dom = $( "#meshPreview" ).empty();

                    dom.text('No mesh uploaded');
                }

                // Draw all the available CSVFiles in the CSV Select box
                for(var i = 0; i < this.data.length; i++)
                {
	            this.optionTemp = _.template('<tr> \
<td><input type="radio" name="processedMeshFiles"></td><td><%= path %></td><td><a href="javascript:preventDefault();">Delete</a></td>\
</tr>');
                    
                    var newOption = $( this.optionTemp( this.data[i]) ).appendTo( meshTableBody );

                    // When the initialDataFiles gets selected, fill the preview box with a preview of the mesh
                    newOption.find('input').on('click', _.bind(_.partial( function(data) {
                        //this.mesh = mesh;
                        $.ajax( { url: '/FileServer/large/processedMeshFiles/' + data.processedMeshId + '/file.dat',
                                  success : _.bind( this.meshDataPreview, this) });
                    }, this.data[i]), this));

                    // When the delete button gets clicked, use the backbone service to destroy the file
                    newOption.find('a').click( _.bind(_.partial(function(data, event) {
                        $.ajax( { url : '/modeleditor/mesheditor',
                                  data :  { reqType : 'delete',
                                            id : data['meshWrapperId']},
                                  dataType : 'json',
                                  type : 'POST',
                                  success : _.bind(function(data) {
                                      updateMsg( data );
                                      this.refreshData();
                                  }, this) } )

                        event.preventDefault();
                        this.render();
                    }, this.data[i]), this));
                }

                // When a user uploads a file, draw a status bar, and after the upload is finished request the refreshes
                $( this.el ).find('#meshDataUpload').fileupload({
                    url: '/FileServer/large/' + 'meshFiles',
                    dataType: 'json',
                    send: _.bind(function (e, data) {
                        names = "";
                        
                        for(var i in data.files)
                        {
                            names += data.files[i].name + " ";
                        }
                        
                        var progressbar = _.template('<span><%= name %> :<div class="progress"> \
<div class="bar" style="width:0%;"> \
</div> \
</div> \
</span>');

                        progressHandle = $( this.el ).find( '#progresses' );

                        progressHandle.empty();
                        $( progressbar({ name : names }) ).appendTo( progressHandle );
                    }, this),

                    done: _.bind(function (e, data) {
                        //Make ajax call to process new mesh files
                        updateMsg( { status : true, msg : 'Processing uploaded data file' } );
                        $.ajax( { url : '/modeleditor/mesheditor?reqType=process',
                                  dataType : 'json',
                                  type : 'POST',
                                  success : _.bind(function(data) {
                                      updateMsg( data );
                                      this.refreshData();
                                  }, this) } )
                    }, this),

                    progressall: _.bind(function (e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $( this.el ).find( '#progresses' ).find( '.bar' ).css('width', progress + '%');
                        $( this.el ).find( '#progresses' ).find( '.bar' ).text(progress + '%');
                    }, this),

                    error : function(data) {
                        updateMsg( { status : false,
                                     msg : "Server error uploading file" }, "#csvMsg" );
                    }
                }).prop('disabled', !$.support.fileInput)
                    .parent().addClass($.support.fileInput ? undefined : 'disabled');

                // Have something selected
                meshTableBody.find('input').eq(0).click();
            }
        }
    }
);

var run = function()
{
    //var id = $.url().param("id");

    var cont = new MeshEditor.Controller();
}

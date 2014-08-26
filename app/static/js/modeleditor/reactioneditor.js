var isReactionEditor = true; // This variable is checked in the update function found in the modeleditor template and nowhere else. It just indicates to the JS included there that we're on the reaction editor page

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

var ReactionsEditor = ReactionsEditor || {}

ReactionsEditor.Controller = Backbone.View.extend(
    {
        el : $("#reactionEditorDiv"),

        initialize : function(attributes)
        {
            // Set up room for the model select stuff
            // Pull in all the models from the internets
            // Build the simulationConf page (don't need external info to make that happen)
            this.attributes = attributes;

            // Draw a screen so folks have something to see
            this.render();

            // Send a request to the server to get the reactionsSubdomainAssignments
            this.refreshData();

            $( 'body' ).on( 'asdf', _.bind(this.refreshData, this) );
        },

        refreshData : function()
        {
            $.ajax( { url : '/modeleditor/reactioneditor',
                      type : 'GET',
                      data : { reqType : 'reactionsSubdomainAssignments' },
                      dataType : 'json',
                      success : _.bind(this.render, this) } );
        },
        
        render : function(data)
        {
            if(typeof data != 'undefined')
            {
                var subdomainsTableHeader = $( "#subdomainsTableHeader" );
                var subdomainsTableBody = $( "#subdomainsTableBody" );

                // It's possible the page does not have these elements, so check before we try
                //    to do anything with them
                if(subdomainsTableHeader.length > 0)
                {
                    subdomainsTableHeader.empty();
                    subdomainsTableBody.empty();

                    subdomains = data['subdomains'];
                    reactionsSubdomainAssignments = data['reactionsSubdomainAssignments'];
                    
                    $( "<th></th>" ).appendTo( subdomainsTableHeader );

                    //Insert the col. header elements (the subdomain columns)
                    for(var subdomainId in subdomains)
                    {
                        $( "<th>" + subdomainId + "</th>" ).appendTo( subdomainsTableHeader );
                    }

                    //Insert a row for every reactions
                    for(var reactionId in reactionsSubdomainAssignments)
                    {
                        var row = $( "<tr></tr>" ).appendTo( subdomainsTableBody );

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
                }
            }
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

    var cont = new ReactionsEditor.Controller();
}

var updateMsg = function(data)
{
    $( "#msg" ).text(data.msg);
    if(data.status)
    $( "#msg" ).prop('class', 'alert alert-success');
    else{
    	if(data.msg.indexOf('?') === -1)
    		$( "#msg" ).prop('class', 'alert alert-danger');
    	else{
    		$( "#msg" ).text(data.msg.substring(0, data.msg.indexOf('*')));
    		$( "#msg" ).prop('class', 'alert alert-danger');
    		
    		var msg = document.getElementById('msg');
    		var a = document.createElement('a');
			var linkText = document.createTextNode(data.msg.substring(data.msg.indexOf('*')+1));
			a.appendChild(linkText);
			a.href = "/credentials";
			msg.appendChild(a);
    	}
    }
    $( "#msg" ).show();
};

function rerun(path, type, relocation)
{
    if (type == "delete"){
        msg = "Deleting output in cloud...";
    }else if(type == "rerun"){
        msg = "Rerunning job in cloud...";
        var menu = document.getElementById("instance_type");
        var x = menu.selectedIndex;
        var y = menu.options;
        var instance_type = y[x].text;
        path = path+'&instance_type='+instance_type;
        
    }else{
        msg = "Unknown requested type.";
    }
    updateMsg( { status: true,
              msg: msg } );
              
              $.ajax({ url : path,
                     type : 'POST',
                     success : function(data)
                     {
                     updateMsg(data);
                     if(data.status)
                     window.location = relocation;
                     },
                     error : function(data)
                     {
                     location.reload();
                     }});
                     
                     return false;
}

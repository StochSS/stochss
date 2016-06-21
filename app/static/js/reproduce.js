

var updateMsg = function(data)
{
    $( "#msg" ).text(data.msg);
    if(data.status)
        $( "#msg" ).prop('class', 'alert alert-success');
    else
        $( "#msg" ).prop('class', 'alert alert-danger');
    $( "#msg" ).show();
};

function rerun(path)
{
    updateMsg( { status: true,
              msg: "Rerunning job in cloud..." } );
    
    $.ajax({ url : path,
           type : 'POST',
           success : function(data)
           {
           updateMsg(data);
           if(data.status)
                window.location = '/status';
           },
           error : function(data)
           {
           location.reload();
           }});
    
    return false;
}

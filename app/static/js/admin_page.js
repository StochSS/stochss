var form = $('#approve-user-form');
var emailInput = $('#email-input')[0];

$('#grant-access-button').on('click', function(e) {
    e.preventDefault();
    
    $.ajax(form.action,{
        type: 'POST',
        dataType: 'json',
        data: { 'email': emailInput.value },
        success: function(response) {
            var errorMessage = $('p.alert.alert-error');
            if (errorMessage.is(':visible')) {
                errorMessage.remove();
            }
            if (response["success"]) {
                var tableBody = $('table.approved-usr-table tbody');
                var nextRowNumber = tableBody.find("tr").length + 1;
                html = '<tr>' + 
                        '<td>' + nextRowNumber + '</td>' +
                        '<td>' + response["email"] + '</td>' +
                        '<td><button class="btn btn-danger">Revoke</button></td>' +
                       '</tr>';
                tableBody.append(html);
                $('#email-input').val("");
            } else {
                var tabDiv = $('#admin-table-tabs-div');
                tabDiv.prepend('<p class="alert alert-error">User is already approved!<button type="button" class="close" data-dismiss="alert">&times;</button></p>');
                $('#email-input').val("");
            }
        },
        error: function(response) {
            alert('There was an error while trying to grant access');
        }
    });
});
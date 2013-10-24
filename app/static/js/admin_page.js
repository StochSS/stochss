var form = $('#approve-user-form');
var emailInput = $('#email-input')[0];

$('#grant-access-button').on('click', function(e) {
    e.preventDefault();
    
    $.ajax(form.action,{
        type: 'POST',
        dataType: 'json',
        data: { 'email': emailInput.value },
        success: function(response) {
            var tableBody = $('table.approved-usr-table tbody');
            var nextRowNumber = tableBody.find("tr").length + 1;
            html = '<tr>' + 
                    '<td>' + nextRowNumber + '</td>' +
                    '<td>' + response["name"] + '</td>' +
                    '<td>' + response["email"] + '</td>' +
                   '</tr>';
            tableBody.append(html);
        },
        error: function(response) {
            alert('There was an error while trying to grant access');
        }
    });
});
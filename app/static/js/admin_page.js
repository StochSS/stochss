var form = $('#approve-user-form');
var emailInput = $('#email-input')[0];
function appendRowToApprovedUserTable(email) {
    var tableBody = $('table.approved-usr-table tbody');
    var nextRowNumber = tableBody.find("tr").length + 1;
    html = '<tr>' + 
            '<td>' + nextRowNumber + '</td>' +
            '<td>' + email + '</td>' +
            '<td><button class="btn btn-danger">Revoke</button></td>' +
           '</tr>';
   tableBody.append(html);
}

$('#grant-access-button').on('click', function(e) {
    e.preventDefault();
    var ajaxData = {
        'action': 'approve',
        'email': emailInput.value
    }
    
    $.ajax(form.action, {
        type: 'POST',
        dataType: 'json',
        data: ajaxData,
        success: function(response) {
            var errorMessage = $('p.alert.alert-error');
            if (errorMessage.is(':visible')) {
                errorMessage.remove();
            }
            if (response["success"]) {
                appendRowToApprovedUserTable(response["email"]);
                $('#email-input').val("");
            } else {
                var tabDiv = $('#admin-table-tabs-div');
                tabDiv.prepend('<p class="alert alert-error">User is already approved!<button type="button" class="close" data-dismiss="alert">&times;</button></p>');
                $('#email-input').val("");
            }
        },
        error: function(response) {
            alert('There was an error while trying to grant access.');
        }
    });
});

$('.table-action-button').on('click', function(e) {
    e.preventDefault();
    
    var clickedButton = $(this);
    var tableRow = clickedButton.closest("tr");
    var tableColumns = tableRow.find("td");
    
    var action = clickedButton.data('action');
    var email = '';
    if (tableColumns.size() == 4) {
        email = tableColumns[2].innerText;
    } else if (tableColumns.size() == 3) {
        email = tableColumns[1].innerText;
    } else {
        return;
    }
    
    var ajaxData = {
        'action': action,
        'email': email
    }
        
    $.ajax(form.action, {
        type: 'POST',
        dataType: 'json',
        data: ajaxData,
        success: function(response) {
            var tableBody = clickedButton.closest('tbody');            
            if (response["success"]) {
                if (action == "approve1") {
                    tableRow.remove();
                    if (tableBody.find("tr").length == 0) {
                        tableBody.closest("table").replaceWith('<p class="empty-table-message">There are no users currently awaiting approval.</p>');
                    }
                    appendRowToApprovedUserTable(email);
                } else if (action == "approve") {
                    appendRowToApprovedUserTable(email);
                } else if (action == "delete") {
                    tableRow.remove();
                } else if (action == "revoke") {
                    tableRow.remove();
                }
            } else {
                alert('There was an error while processing the action for ' + email + '.');
            }
        },
        error: function(response) {
            alert('There was an error while processing the action for ' + email + ' .');
        }
    });
});
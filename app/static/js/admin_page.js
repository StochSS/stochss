var form = $('#approve-user-form');
var emailInput = $('#email-input')[0];
function appendRowToApprovedUserTable(email) {
    // First check to see if the empty-table-message is there
    var approvedUserTab = $('#tab2');
    if (approvedUserTab.find('p.empty-table-message').length == 1) {
        // Make the table
        approvedUserTab.find('div.well').html(
            '<table class="table table-bordered approved-usr-table">'+
            '<thead><tr><th>#</th><th>Email</th><th>Actions</th></tr></thead>'+
            '<tbody></tbody></table>'
        );
    }
    var tableBody = approvedUserTab.find('table.approved-usr-table tbody');
    var nextRowNumber = tableBody.find("tr").length + 1;
    var html = '<tr>' + 
            '<td>' + nextRowNumber + '</td>' +
            '<td>' + email + '</td>' +
            '<td><button class="btn btn-danger table-action-button" data-action="revoke">Revoke</button></td>' +
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

$('#admin-table-tabs-div').on('click', 'button.table-action-button', function(e) {
    e.preventDefault();
    
    var clickedButton = $(this);
    var tableRow = clickedButton.closest("tr");
    var tableColumns = tableRow.find("td");
    
    var action = clickedButton.data('action');
    var email = '';
    if (tableColumns.size() == 4) {
        email = tableColumns[2].innerHTML;
    } else if (tableColumns.size() == 3) {
        email = tableColumns[1].innerHTML;
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
                } else if (action == "deny") {
                    tableRow.remove();
                    if (tableBody.find("tr").length == 0) {
                        tableBody.closest("table").replaceWith('<p class="empty-table-message">There are no users currently awaiting approval.</p>');
                    }
                } else if (action == "approve") {
                    appendRowToApprovedUserTable(email);
                } else if (action == "revoke") {
                    tableRow.remove();
                    if (tableBody.find("tr").length == 0) {
                        tableBody.closest("table").replaceWith('<p class="empty-table-message">There are no approved users who have not logged in.</p>');
                    }
                } else if (action == "delete") {
                    tableRow.remove();
                } else if (action == "reset") {
                    alert('The user\'s password has been reset to:\n' + response["password"]);
                }
            } else {
                if (response["message"]) {
                    alert(response["message"]);
                } else {
                    alert('There was an error while processing the action for ' + email + '.');
                }
            }
        },
        error: function(response) {
            alert('There was an error while processing the action for ' + email + ' .');
        }
    });
});
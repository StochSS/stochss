var form = $('#approve-user-form');
var emailInput = $('#email-input')[0];

$('.users').on('click', 'button.table-action-button', function(e) {
    e.preventDefault();
    
    var clickedButton = $(this);
    var tableRow = clickedButton.closest("tr");
    var tableColumns = tableRow.find("td");
    
    var action = clickedButton.data('action');
    var email = '';
    if (tableColumns.size() == 4) {
        email = tableColumns[2].innerText.trim();
    } else if (tableColumns.size() == 3) {
        email = tableColumns[1].innerText.trim();
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
                if (action == "approve") {
                    clickedButton.data('action', 'revoke');
                    clickedButton.text('Revoke Account');
                    clickedButton.removeClass('btn-success');
                    clickedButton.addClass('btn-danger');
                } else if (action == "revoke") {
                    clickedButton.data('action', 'approve');
                    clickedButton.text('Approve Account');
                    clickedButton.removeClass('btn-danger');
                    clickedButton.addClass('btn-success');
                } else if (action == "delete" || action == "revoke_preapproved") {
                    location.reload();
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

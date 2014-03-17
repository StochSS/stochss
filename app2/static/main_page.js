$('#export').on('click', function(e) {
    var button = $(this)[0];
    button.disabled = true;
    button.innerHTML = "Starting Export Process...";
    e.preventDefault();
    var selectedModels = [];
    var checkboxes = document.getElementsByName('select_model');
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedModels.push(checkboxes[i].value);
        }
    }
    var ajaxData = {
        'modelsToExport': selectedModels
    };
    
    $.ajax('/', {
        type: 'POST',
        dataType: 'json',
        data: JSON.stringify(ajaxData),
        success: function(response) {
            button.innerHTML = "Export";
            button.disabled = false;
            if (response["status"]) {
                $('.ajax-success-msg').text("Successfully exported models to zip archive");
                window.location = response["zipLocation"]
            } else {
                alert(response["msg"]);
            }
        },
        error: function(response) {
            alert('There was an error while trying to export your data.');
            button.innerHTML = "Export";
            button.disabled = false;
        }
    });
});
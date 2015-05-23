if(typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}
function set_basic() {
    var compute_power = document.getElementsByName("compute_power");
    if (!$('#advanced-settings').hasClass("in")) {
        for (i = 0; i < compute_power.length; i++) {
            compute_power[i].removeAttribute('checked');
            compute_power[i].setAttribute('disabled', true);
        }
    } else {

        for (i = 0; i < compute_power.length; i++) {
            compute_power[i].removeAttribute('disabled');
        }
        compute_power[0].setAttribute('checked', true);
    }
}

function show_follow_ups() {
    var follow_ups = document.getElementById("follow_ups");
    follow_ups.removeAttribute('hidden');
}

function get_flex_cloud_info_input() {
    var form = document.forms.flex_cloud_machine_info_form;
    var inputs = form.getElementsByTagName("input");

    var flex_cloud_machine_info = [];

    var flex_cloud_machine = {};
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].name == 'ip') {
            flex_cloud_machine['ip'] = inputs[i].value.trim();
            if (flex_cloud_machine['ip'] == '') {
                alert('Please provide valid IP Address!');
                return null
            }
        }

        if (inputs[i].name == 'username') {
            flex_cloud_machine['username'] = inputs[i].value.trim();
            if (flex_cloud_machine['ip'] == '') {
                alert('Please provide valid username!');
                return null
            }
        }

        if (inputs[i].name == 'queue_head') {
            flex_cloud_machine['queue_head'] = false;
            if (inputs[i].checked) {
                flex_cloud_machine['queue_head'] = true
            }
        }

        if (Object.keys(flex_cloud_machine).length == 3) {
            flex_cloud_machine_info.push(flex_cloud_machine);
            flex_cloud_machine = {};
        }
    }

    var selects = form.getElementsByTagName("select");
    for (i = 0; i < selects.length; i++) {
        flex_cloud_machine_info[i]['keyname'] = selects[i].options[selects[i].selectedIndex].value
    }

    var queue_head = null;
    for (var i = 0; i < flex_cloud_machine_info.length; i++) {
        if (flex_cloud_machine_info[i]['queue_head'] == true) {
            if (queue_head != null) {
                alert('Please select only 1 queue head!');
                return null
            }
            else {
                queue_head = flex_cloud_machine_info[i];
            }
        }
    }

    if (queue_head == null || flex_cloud_machine_info.length == 0) {
        alert('Please select 1 machine as queue head!');
        return null
    }

    return flex_cloud_machine_info
}


function refresh_flex_cloud_info() {
    $.ajax({
        type: "GET",
        url: "/credentials#flex_cloud",
        success: function () {
        },
        error: function (x,e) {
        },
        complete: function(){
            document.location.reload();
        }
    });
}

function delete_keyfile(keyname){
    var jsonDataToBeSent = {};
    jsonDataToBeSent['action'] = 'flex_delete_keyfile';
    jsonDataToBeSent['keyname'] = keyname;


    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function(){},
        error: function(x,e){
            alert('Could not delete flex ssh key, ' + keyname + '!');
        },
        complete: function() {
            refresh_flex_cloud_info()
        }
    });
}

function deregister_flex_cloud(){
    var jsonDataToBeSent = {};
    jsonDataToBeSent['action'] = 'deregister_flex_cloud';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function(){},
        error: function(x,e){},
        complete: function() {
            refresh_flex_cloud_info()
        }
    });
}

function prepare_flex_cloud() {
    var flex_cloud_machine_info = get_flex_cloud_info_input();
    if (flex_cloud_machine_info == null) {
        return
    }

    var jsonDataToBeSent = {};
    jsonDataToBeSent['flex_cloud_machine_info'] = flex_cloud_machine_info;
    jsonDataToBeSent['action'] = 'prepare_flex_cloud';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function(){},
        error: function(x,e){},
        complete: function() {
            refresh_flex_cloud_info()
        }
    });
}

function send_keyfile_to_stochss(keyname, contents) {
    var jsonDataToBeSent = {
        'keyname': keyname,
        'contents': contents
    };
    jsonDataToBeSent['action'] = 'flex_save_keyfile';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function(){},
        error: function(x,e){
            alert(e + ": Failed to upload keyfile!");
        },
        complete: function() {}
    });
}

function uncheck_other_queue_head_checkboxes(obj) {
    var form = document.forms.flex_cloud_machine_info_form;
    var inputs = form.getElementsByTagName("input");
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].name == 'queue_head' && inputs[i].checked) {
            inputs[i].checked = false
        }
    }
    obj.checked = true
}

$(document).ready(function () {
    $("#append_flex_cloud_machine").click(function () {
        var new_row = $('#flex_cloud_machine_info_table tr:last').clone(true);
        new_row.find('input').val("");
        new_row.find("input[name='queue_head']").attr('checked', false);
        $('#flex_cloud_machine_info_table tr:last').after(new_row);

        return false;
    });

    $("#delete_flex_cloud_machine").click(function () {
        if ($('#flex_cloud_machine_info_table tr').length > 1) {
            $('#flex_cloud_machine_info_table tr:last').remove();
        }
        else {
            $('#flex_cloud_machine_info_table tr:last').find('input').val("");
            $("#flex_cloud_machine_info_table tr:last input[name='queue_head']").attr('checked', false);
        }
        return false;
    });
});

function add_key_file_upload_listener() {
    var keyfile_to_upload = document.getElementById('keyfile_to_upload');
    keyfile_to_upload.addEventListener('change', function(event){
            var first_file = event.target.files[0];
            if (first_file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var contents = e.target.result;
                    send_keyfile_to_stochss(first_file.name, contents);
                };
                reader.readAsBinaryString(first_file);
            }
            else {
                alert("Failed to upload keyfile!");
            }
        },
     false);
}

window.onload = function () {
    add_key_file_upload_listener();
};


/* START: remember opened tab pane */
$('#cred_tabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
});

// store the currently selected tab in the hash value
$("ul.nav-tabs > li > a").on("shown.bs.tab", function (e) {
    var id = $(e.target).attr("href").substr(1);
    window.location.hash = id;
});

// on load of the page: switch to the currently selected tab
var hash = window.location.hash;
$('#cred_tabs a[href="' + hash + '"]').tab('show');
/* END: remember opened tab pane */
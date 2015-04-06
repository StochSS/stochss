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

function save_flex_cloud_info() {
    var form = document.forms.flex_cloud_machine_info_form;
    var inputs = form.getElementsByTagName("input");

    var jsonData = [];
    var info = {};
    for (i = 0; i < inputs.length; i++) {
        if (inputs[i].name == 'ip') {
            info['ip'] = inputs[i].value
        }
        if (inputs[i].name == 'username') {
            info['username'] = inputs[i].value
        }
        if (inputs[i].name == 'keyfile') {
            info['keyfile'] = inputs[i].value
        }
        if (inputs[i].name == 'queue_head') {
            info['queue_head'] = false;
            if (inputs[i].checked) {
                info['queue_head'] = true
            }
        }
        if (Object.keys(info).length == 4) {
            jsonData.push(info);
            info = {};
        }
    }

    var jsonDataToBeSent = {}
    jsonDataToBeSent['flex_cloud_machine_info'] = jsonData
    jsonDataToBeSent['action'] = 'save_flex_cloud_info'

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        data: jsonDataToBeSent,
        success: function () {
        },
        dataType: "json",
        contentType: "application/json"
    });
}

function prepare_flex_cloud() {
    var jsonDataToBeSent = {}
    jsonDataToBeSent['action'] = 'prepare_flex_cloud'

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    $.ajax({
        type: "POST",
        url: "/credentials",
        data: jsonDataToBeSent,
        success: function () {
        },
        dataType: "json",
        contentType: "application/json"
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
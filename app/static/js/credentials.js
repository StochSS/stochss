console.log('starting ' + performance.now());
if (typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function () {
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
    var flex_cloud_machine_info = [];
    var flex_cloud_machine = {};

    var tbody = $('#flex_cloud_machine_info_table');
    var rows = tbody.find('tr');
    for (i = 0; i < rows.length; i++) {
        var row = $(rows[i]);

        flex_cloud_machine = {};

        flex_cloud_machine['ip'] = row.find('input[name="ip"]').val().trim();
        if (flex_cloud_machine['ip'] == '') {
            updateMsg({ status: false, msg: 'Please provide valid IP Address!' }, '#flexCloudInfoMsg');
            return null
        }

        flex_cloud_machine['username'] = row.find('input[name="username"]').val().trim();
        if (flex_cloud_machine['username'] == '') {
            updateMsg({ status: false, msg: 'Please provide valid username!' }, '#flexCloudInfoMsg');
            return null
        }

        if(i == 0)
        {
            flex_cloud_machine['queue_head'] = true;
        }
        else
        {
            flex_cloud_machine['queue_head'] = false;
        }
        
        flex_cloud_machine['key_file_id'] = parseInt(row.find('select').val());
        if (!flex_cloud_machine['key_file_id']) {
            updateMsg({ status: false, msg: 'Please select a key file' }, '#flexCloudInfoMsg');
            return null;
        }

        flex_cloud_machine_info.push(flex_cloud_machine);
    }

    var queue_head = null;
    for (var i = 0; i < flex_cloud_machine_info.length; i++) {
        if (flex_cloud_machine_info[i]['queue_head'] == true) {
            if (queue_head != null) {
                updateMsg({ status: false, msg: 'Please select only 1 queue head!' }, '#flexCloudInfoMsg');
                return null
            }
            else {
                queue_head = flex_cloud_machine_info[i];
            }
        }
    }

    if (queue_head == null || flex_cloud_machine_info.length == 0) {
        updateMsg({ status: false, msg: 'Please select 1 machine as queue head!' }, '#flexCloudInfoMsg');
        return null
    }

    return flex_cloud_machine_info
}


function deregister_flex_cloud() {
    var jsonDataToBeSent = {};
    jsonDataToBeSent['action'] = 'deregister_flex_cloud';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);

    updateMsg( { status : true, msg : "Stopping Flex Cloud..." }, '#flexCloudInfoMsg' );

    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function () {
        },
        error: function (x, e) {
        },
        complete: function () {
            document.location.reload();
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
    updateMsg( { status : true, msg : "Requesting Flex Cloud deploy..." }, '#flexCloudInfoMsg');

    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function () {
        },
        error: function (x, e) {
        },
        complete: function () {
            document.location.reload();
        }
    });
}

function refresh_flex_cloud() {
    var flex_cloud_machine_info = get_flex_cloud_info_input();
    if (flex_cloud_machine_info == null) {
        return
    }

    var jsonDataToBeSent = {};
    jsonDataToBeSent['action'] = 'refresh_flex_cloud';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);
    updateMsg( { status : true, msg : "Updating Flex Cloud status..." }, '#flexCloudInfoMsg');

    $.ajax({
        type: "POST",
        url: "/credentials",
        contentType: "application/json",
        dataType: "json",
        data: jsonDataToBeSent,
        success: function () {
        },
        error: function (x, e) {
        },
        complete: function () {
            document.location.reload();
        }
    });
}

$(document).ready(function () {
    $("#append_flex_cloud_machine").click(function () {
        var prior_row = $('#flex_cloud_machine_info_table tr:last');
        var new_row = prior_row.clone(true);
        new_row.find('input[name="ip"]').val("");
        new_row.find('input[name="username"]').val(prior_row.find('input[name="username"]').val());
        new_row.find('i').remove();
        new_row.find('select').val(prior_row.find('select').val());
        prior_row.after(new_row);

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

var FlexCloud = FlexCloud || {}

var updateMsg = function (data, msg) {
    if (!_.has(data, 'status')) {
        $(msg).text('').prop('class', '');

        return;
    }

    var text = data.msg;

    if (typeof text != 'string') {
        text = text.join('<br>')
    }

    $(msg).html(text);
    if (data.status)
        $(msg).prop('class', 'alert alert-success');
    else
        $(msg).prop('class', 'alert alert-error');
    $(msg).show();
};

FlexCloud.Controller = Backbone.View.extend({
    el: $("#flex_cloud"),

    initialize: function (attributes) {
        this.attributes = attributes;
        this.flexKeyFiles = undefined;

        this.flexIsRunning = $( "#prepare_flex_button" ).prop('disabled');

        this.loaded = 0;

        this.flexKeyFiles = new fileserver.FileList([], { key: 'flexKeyFiles' });
        this.flexKeyFiles.fetch({ success: _.bind(_.partial(this.update_loaded, undefined), this) });
    },

    update_loaded: function (data) {
        if ($.isReady) {
            this.render();
        }
    },

    render: function () {
        $(this.el).find("flex_ssh_key_table").empty();

        $(this.el).find('#keyfile_to_upload').fileupload({
            url: '/FileServer/large/flexKeyFiles',
            dataType: 'json',

            add: _.partial(function (controller, e, data) {
                var inUse = false;

                for (var i = 0; i < controller.flexKeyFiles.models.length; i++) {
                    if (controller.flexKeyFiles.models[i].attributes.path == data.files[0].name) {
                        inUse = true;
                        break;
                    }
                }

                if (!inUse) {
                    if (data.autoUpload || (data.autoUpload !== false && $(this).fileupload('option', 'autoUpload'))) {
                        data.process().done(function () {
                            updateMsg({ status: true, msg: 'Uploading private key...' }, '#flexKeyMsg');
                            data.submit();
                        });
                    }
                }
                else {
                    updateMsg({ status: false,
                                msg: "Key by name '" + data.files[0].name + "' already exists" },
                        "#flexKeyMsg");
                    return false;
                }
            }, this),

            done: _.bind(function (e, data) {
                updateMsg({ status: true, msg: 'Key uploaded. Page reloading' }, '#flexKeyMsg');
                location.reload();
            }, this),

            error: function (data) {
                updateMsg({ status: false,
                    msg: "Server error uploading file" }, "#csvMsg");
            }
        }).prop('disabled', !$.support.fileInput)
            .parent().addClass($.support.fileInput ? undefined : 'disabled');

        this.renderFiles();
    },

    deleteKeyFile: function (flexKeyFileId, event) {
        var result = confirm("Are you sure you want to delete this key?");

        if (result) {
            var flexKeyFile = this.flexKeyFiles.get(flexKeyFileId);

            updateMsg({ status: true, msg: "Key '" + flexKeyFile.attributes.path + "' deleted" }, "#flexKeyMsg");

            $(this.el).find('option[value="' + flexKeyFile.attributes.id + '"]').remove();

            flexKeyFile.destroy();
            this.renderFiles();
        }

        event.preventDefault();
    },

    renderFiles: function () {
        $(this.el).find('#progresses').empty();
        $(this.el).find("#flex_ssh_key_table").empty();

        if (typeof this.flexKeyFiles != 'undefined') {
            var row_template = _.template("<tr> \
<td> \
<%= keyname %> \
</td> \
<td width='100px'> \
<% if(is_deletable) { %> \
<button><i class='icon-trash'></i> Delete</button> \
<% } else { %> \
In Use \
<% } %> \
</td> \
</tr>");

            if(this.flexKeyFiles.length > 0)
            {
                for (var i = 0; i < this.flexKeyFiles.models.length; i++) {
                    var keyFile = this.flexKeyFiles.models[i];

                    var keyRow = $(row_template({ keyname: keyFile.attributes.path, is_deletable: !this.flexIsRunning })).appendTo("#flex_ssh_key_table");

                    if (keyRow.find('button').length) {
                        var button = keyRow.find('button');

                        button.click(_.bind(_.partial(this.deleteKeyFile, keyFile.id), this));
                    }
                }

                $( "#flex_ssh_key_table_div" ).show();
                $( "#flex_ssh_key_table_div_loading" ).hide();
            }
            else
            {
                $( "#flex_ssh_key_table_div" ).hide();
                $( "#flex_ssh_key_table_div_loading" ).hide();
            }
        }
    }
});

console.log("Initializing controller" + performance.now());
var cont = new FlexCloud.Controller();

window.onload = function () {
    console.log(performance.now());
    $('#flex_ssh_key_table_table').DataTable({ "bSort": false, "bLengthChange": false, "bFilter": false, "bPaginate": false, "bInfo": false });
    $('#flex_ssh_key_table_table').css('border-bottom', '1px solid #ddd');
    $('#flex_ssh_key_table_table thead th').css('border-bottom', '1px solid #ddd');

    $( '#prepare_flex_button' ).click( prepare_flex_cloud );
    $( '#deregister_flex_button' ).click( deregister_flex_cloud );

    $( '#refresh_flex_button' ).click( function() {
        document.location.reload();
    } );

    console.log("rendering", performance.now());
    cont.render();
    console.log(performance.now());
};

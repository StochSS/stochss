if (typeof(String.prototype.trim) === "undefined") {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function update_cloud_info(status, msg)
{
    var el = $( '.flex_cloud_info' );

    el.text(msg);

    if(status)
    {
        el.css('color', 'green');
    }
    else
    {
        el.css('color', 'red');
    }
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


function refresh_flex_cloud_info() {
    $.ajax({
        type: "GET",
        url: "/credentials#flex_cloud",
        success: function () {
        },
        error: function (x, e) {
        },
        complete: function () {
            document.location.reload();
        }
    });
}

function deregister_flex_cloud() {
    var jsonDataToBeSent = {};
    jsonDataToBeSent['action'] = 'deregister_flex_cloud';

    jsonDataToBeSent = JSON.stringify(jsonDataToBeSent);

    update_cloud_info( true, "Stopping Flex Cloud..." );
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
            update_cloud_info( true, "Stop request sent, refreshing page" );

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
    update_cloud_info( true, "Requesting Flex Cloud deploy..." );

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
            update_cloud_info( true, "Deploy request sent, refreshing page" );

            refresh_flex_cloud_info()
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

        this.loaded = 0;

        this.flexKeyFiles = new fileserver.FileList([], { key: 'flexKeyFiles' });
        this.flexKeyFiles.fetch({ success: _.bind(_.partial(this.update_loaded, undefined), this) });

        $.ajax({ url: '/credentials/flexIsDeletable',
            type: 'GET',
            success: _.bind(this.update_loaded, this) }
        );
    },

    update_loaded: function (data) {
        if (typeof(data) != "undefined") {
            this.isDeletable = data;
        }

        this.loaded += 1;

        if (this.loaded == 2) {
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

            send: _.bind(function (e, data) {
                names = "";

                for (var i in data.files) {
                    names += data.files[i].name + " ";
                }

                var progressbar = _.template('<span><%= name %> :<div class="progress"> \
<div class="bar" style="width:0%;"> \
</div> \
</div> \
</span>');

                progressHandle = $(this.el).find('#progresses');

                progressHandle.empty();
                $(progressbar({ name: names })).appendTo(progressHandle);
            }, this),

            done: _.bind(function (e, data) {
                location.reload();
            }, this),

            progressall: _.bind(function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(this.el).find('#progresses').find('.bar').css('width', progress + '%');
                $(this.el).find('#progresses').find('.bar').text(progress + '%');
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
                $( "#flex_ssh_key_table_div" ).show();
                $( "#flex_ssh_key_table_div_loading" ).hide();

                for (var i = 0; i < this.flexKeyFiles.models.length; i++) {
                    var keyFile = this.flexKeyFiles.models[i];

                    var keyRow = $(row_template({ keyname: keyFile.attributes.path, is_deletable: this.isDeletable[keyFile.id]["is_deletable"] })).appendTo("#flex_ssh_key_table");

                    if (keyRow.find('button').length) {
                        var button = keyRow.find('button');

                        button.click(_.bind(_.partial(this.deleteKeyFile, keyFile.id), this));
                    }
                }
            }
            else
            {
                $( "#flex_ssh_key_table_div" ).hide();
                $( "#flex_ssh_key_table_div_loading" ).hide();
            }
        }
    }
});

window.onload = function () {
    $('#flex_ssh_key_table_table').DataTable({ "bSort": false, "bLengthChange": false, "bFilter": false, "bPaginate": false, "bInfo": false });
    $('#flex_ssh_key_table_table').css('border-bottom', '1px solid #ddd');
    $('#flex_ssh_key_table_table thead th').css('border-bottom', '1px solid #ddd');

    $( '#prepare_flex_button' ).click( prepare_flex_cloud );
    $( '#deregister_flex_button' ).click( deregister_flex_cloud );

    $( '#refresh_flex_button' ).click( refresh_flex_cloud_info );

    var cont = new FlexCloud.Controller();
};

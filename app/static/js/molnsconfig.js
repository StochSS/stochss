$( function() {
    var AppView = Backbone.View.extend({
        el : $(".content")[0],

        // Delegated events for creating new items, and clearing completed ones.
        events : {
            "click .startCluster" :  "startCluster",
            "click .stopCluster" : "stopCluster"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
        },

        updateStateMessage : function (data) {
            if (typeof(data) == 'undefined' || !_.has(data, 'status')) {
                $('#stateMessage').hide();//text('').prop('class', '');
                
                return;
            }

            $('#stateMessage').html(data.msg);

            if (data.status)
                $('#stateMessage').prop('class', 'alert alert-success');
            else
                $('#stateMessage').prop('class', 'alert alert-error');

            $('#stateMessage').show();
        },

        pollSystemState : _.once(function() {
            var inner = _.bind(function() {
                $.ajax( { url : '/molnsconfig/pollSystemState',
                          data : {},
                          success : _.bind(_.partial(function(inner, data) {
                              this.updateUI(data);
                           
                              setTimeout(_.bind(inner, this), 1000);
                          }, arguments.callee), this),
                          error : _.bind(_.partial(function(inner, data) {
                              setTimeout(_.bind(inner, this), 1000);
                          }, arguments.callee), this),
                          method : 'POST',
                          dataType : 'json'
                        });
            }, this);
            
            inner();
        }),

        updateInputs : function(state) {
            this.state = state;

            // Retrieve all values for the UI manually
            for(var i = 0; i < this.state["EC2"]["controller"].length; i++)
            {
                if(this.state["EC2"]["controller"][i]["key"] == "instance_type")
                {
                    $('input[name=headNode][value="' + this.state["EC2"]["controller"][i]["value"] + '"]').prop('checked', true);
                    break;
                }
            }

            for(var i = 0; i < this.state["EC2"]["worker"].length; i++)
            {
                if(this.state["EC2"]["worker"][i]["key"] == "instance_type")
                    $('input[name=workerNode][value="' + this.state["EC2"]["worker"][i]["value"] + '"]').prop('checked', true);

                if(this.state["EC2"]["worker"][i]["key"] == "num_vms")
                    $('input[name=workerCount]').val(this.state["EC2"]["worker"][i]["value"]);
            }

            for(var i = 0; i < this.state["EC2"]["provider"].length; i++)
            {
                if(this.state["EC2"]["provider"][i]["key"] == "aws_secret_key")
                    $('input[name=aws_secret_key]').val(this.state["EC2"]["provider"][i]["value"]);
                
                if(this.state["EC2"]["provider"][i]["key"] == "aws_access_key")
                    $('input[name=aws_access_key]').val(this.state["EC2"]["provider"][i]["value"]);
            }
        },

        updateUI : function(data) {
            var molnsRunning = false;

            instanceStatus = data['instanceStatus'];
                    
            var statusColumn = undefined;
            for(var i = 0; i < instanceStatus['column_names'].length; i++)
            {
                if(instanceStatus['column_names'][i].toLowerCase() == 'status')
                {
                    statusColumn = i;
                    break;
                }
            }

            for(var i = 0; i < instanceStatus['data'].length; i++)
            {
                var status = instanceStatus['data'][i][statusColumn].toLowerCase();

                if(!_.contains(['stopped', 'terminated'], status))
                {
                    molnsRunning = true;
                    break;
                }
            }

            var stateChange = false;
            var firstRun = typeof(this.processRunning) == 'undefined';
            var newProcessRunning = false;

            if(typeof data['process']['name'] != 'string')
            {
                $( '.processStatus' ).text( 'No process running' );

                newProcessRunning = false;
            }
            else if(data['process']['status'])
            {
                $( '.processStatus' ).text( 'Function \'' + data['process']['name'] + '\' running' );

                newProcessRunning = true;
            }
            else
            {
                $( '.processStatus' ).text( 'Function \'' + data['process']['name'] + '\' finished' )

                newProcessRunning = false;
            }

            if(this.processRunning != newProcessRunning)
            {
                stateChange = true;
                this.processRunning = newProcessRunning;
            }

            if((this.processRunning || stateChange) && !firstRun)
            {
                this.updateInputs(data['molns']);

                $( 'input, button, select' ).prop('disabled', true);

                this.updateStateMessage({ status : 'true', msg : 'Processing command, check Debug Terminal for details' });
            }
            else if(molnsRunning)
            {
                this.updateInputs(data['molns']);

                $( 'input, button, select' ).prop('disabled', true);
                $( '.stopCluster' ).prop('disabled', false);

                this.updateStateMessage({ status : 'true', msg : 'Cluster running' });
            }
            else
            {
                if(firstRun)
                    this.updateInputs(data['molns']);

                $( 'input, button, select' ).prop('disabled', false);

                this.updateStateMessage({ status : 'true', msg : 'Cluster stopped' });
            }

            if(molnsRunning)
            {
                //Build a table to show status of instances
                if(_.has(instanceStatus, 'msg'))
                {
                    $( '.statusDiv' ).hide();
                }
                else
                {
                    var table = $( '.statusDiv table' );

                    $( '.statusDiv' ).show();
                    
                    var rowTemplate = _.template("<tr> \
<% for(var i = 0; i < row.length; i++) { %> \
    <<%= tag %>><%= row[i] %></<%= tag %>> \
<% } %> \
</tr>");

                    table.empty();
                    
                    table.append(rowTemplate({ tag : 'th', row : instanceStatus['column_names'] }));
                    
                    for(var i = 0; i < instanceStatus['data'].length; i++)
                    {
                        if(instanceStatus['data'][i][statusColumn].toLowerCase() != 'terminated')
                            table.append(rowTemplate({ tag : 'td', row : instanceStatus['data'][i]}));
                    }
                }
            }
            else
            {
                $( '.statusDiv' ).hide();
            }
            
            for(var i = 0; i < data['messages'].length; i++)
            {
                var msg = '';
                
                for(var c in data['messages'][i].msg)
                {
                    if(data['messages'][i].msg[c] == '\n')
                    {
                        if(msg.length > 0)
                            this.handleMessage({ status : data['messages'][i].status, msg : msg });

                        msg = ''

                        this.createMessage();
                    }
                    else
                    {
                        msg += data['messages'][i].msg[c];
                    }
                }
                
                if(msg.length > 0)
                    this.handleMessage({ status : data['messages'][i].status, msg : msg });
            }
        },

        extractStateFromUI : function() {
            var state = {};

            // Copy the default values that we last received from the server
            for(var key1 in this.state)
            {
                state[key1] = {};

                for(var key2 in this.state[key1])
                {
                    state[key1][key2] = [];

                    for(var i = 0; i < this.state[key1][key2].length; i++)
                    {
                        state[key1][key2].push(_.clone(this.state[key1][key2][i]));
                    }
                }
            }
            
            // Set all the fields from the UI manually
            for(var i = 0; i < state["EC2"]["controller"].length; i++)
            {
                if(this.state["EC2"]["controller"][i]["key"] == "instance_type")
                    state["EC2"]["controller"][i] = { "value" : $('input[name=headNode]:checked').val() };
            }

            for(var i = 0; i < state["EC2"]["worker"].length; i++)
            {
                if(this.state["EC2"]["worker"][i]["key"] == "instance_type")
                    state["EC2"]["worker"][i]["value"] = $('input[name=workerNode]:checked').val();

                if(this.state["EC2"]["worker"][i]["key"] == "num_vms")
                    state["EC2"]["worker"][i]["value"] = $('input[name=workerCount]').val();
            }

            for(var i = 0; i < state["EC2"]["provider"].length; i++)
            {
                if(this.state["EC2"]["provider"][i]["key"] == "aws_secret_key")
                    state["EC2"]["provider"][i]["value"] = $('input[name=aws_secret_key]').val();

                if(this.state["EC2"]["provider"][i]["key"] == "aws_access_key")
                    state["EC2"]["provider"][i]["value"] = $('input[name=aws_access_key]').val();
            }

            return state;
        },
                            
        startCluster : function() {
            this.updateStateMessage({ status : 'true', msg : 'Processing command, check Debug Terminal for details' });
            this.createMessage({ status : 2, msg : 'Sending molns cluster start request' });
            $( '.startCluster' ).prop('disabled', true);

            $.ajax( { url : '/molnsconfig/startMolns',
                      data : {
                          state : JSON.stringify(this.extractStateFromUI()),
                          pw : $( 'input[name=password]' ).val(),
                          workerCount : $( 'input[name=workerCount]' ).val(),
                          providerType : 'EC2'
                      },
                      success : _.bind(function(data) {
                          if(typeof(data['molns']) != 'undefined')
                          {
                              this.createMessage({ status : 2, msg : 'Molns cluster start request sent succesfully' });

                              this.updateUI(data);
                          }
                          else
                          {
                              this.createMessage(data);
                          }
                      }, this),
                      error : _.bind(function(data) {
                          this.createMessage(JSON.parse(data.resultText));
                      }, this),
                      method : 'POST',
                      dataType : 'json'
                    } );
        },

        stopCluster : function() {
            this.updateStateMessage({ status : 'true', msg : 'Processing command, check Debug Terminal for details' });
            this.createMessage({ status : 2, msg : 'Sending molns cluster stop request' });
            $( '.stopCluster' ).prop('disabled', true);

            $.post( '/molnsconfig/stopMolns',
                    {
                        providerType : 'EC2'
                    },
                    _.bind(function(data) {
                        if(typeof(data['molns']) != 'undefined')
                        {
                            this.createMessage({ status : 2, msg : 'Molns cluster stop request sent successfully' });

                            this.updateUI(data);
                        }
                        else
                        {
                            this.createMessage(data);
                        }
                    }, this),
                    "json"
                  );
        },
        
        createMessage : function(data) {
            var dateString = '';

            var date = new Date();
            var dateString = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

            if(typeof data != "undefined")
                this.handleMessage(data);

            var messages = $( '.messages' );

            messages.append( '<div style="display: none;" class="line"><span class="time">' + dateString + '</span>: <pre style="all : initial; white-space: pre-wrap; font-family: monospace; display : inline;" class="content"></pre></div>' );

            if(messages.length)
                messages.scrollTop(messages[0].scrollHeight - messages.height());
        },

        handleMessage : function(data) {
            var line = $( '.messages>div.line' ).last();

            line.show();

            var element = line.find( 'pre.content' );
            var time = line.find( 'span.time' );

            var date = new Date();

            time.text(date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds());

            if(data.status)
            {
                if(data.status == 2)
                {
                    element.append( '<span><font color="blue">' + data.msg + '</font></span>' );
                }
                else
                {
                    element.append( '<span><font color="green">' + data.msg + '</font></span>' );
                }
            } else {
                element.append( '<span><font color="red">' + data.msg + '</font></span>' );
            }

            var messages = $( '.messages' );

            if(messages.length)
                messages.scrollTop(messages[0].scrollHeight - messages.height());
        },

        // Re-rendering the App just means refreshing the statistics -- the rest
        // of the app doesn't change.
        render : function() {
            var data = JSON.parse($( '.jsonData' ).text());

            $( '.loading' ).hide();

            this.createMessage();

            if(typeof(data['molns']) != 'undefined')
            {
                this.updateUI(data);
                
                this.delegateEvents();
                
                this.pollSystemState();
            }
            else
            {
                this.createMessage(data);
            }

            this.$el.show();
        }
    });

    var App = new AppView();

    App.render();
} );

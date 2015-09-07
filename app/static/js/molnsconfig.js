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

        pollSystemState : _.once(function() {
            var inner = _.bind(function() {
                $.ajax( { url : '/molnsconfig/pollSystemState',
                          data : {},
                          success : _.bind(_.partial(function(inner, data) {
                              var processRunning = false;

                              if(typeof data['process']['name'] != 'string')
                              {
                                  $( '.processStatus' ).text( 'No process running' );

                                  processRunning = false;
                              }
                              else if(data['process']['status'])
                              {
                                  $( '.processStatus' ).text( 'Function \'' + data['process']['name'] + '\' running' );

                                  processRunning = true;
                              }
                              else
                              {
                                  $( '.processStatus' ).text( 'Function \'' + data['process']['name'] + '\' finished' )

                                  processRunning = false;
                              }

                              if(processRunning)
                              {
                                  this.updateUI(data['molns']);

                                  $( 'input, button, select' ).prop('disabled', true);
                              }
                              else
                              {
                                  $( 'input, button, select' ).prop('disabled', false);
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

        updateUI : function(state) {
            this.state = state;

            // Retrieve all values for the UI manually
            for(var i = 0; i < state["EC2"]["controller"].length; i++)
            {
                if(this.state["EC2"]["controller"][i]["key"] == "instance_type")
                {
                    $('input[name=headNode][value="' + this.state["EC2"]["controller"][i]["value"] + '"]').prop('checked', true);
                    break;
                }
            }

            for(var i = 0; i < state["EC2"]["worker"].length; i++)
            {
                if(this.state["EC2"]["worker"][i]["key"] == "instance_type")
                    $('input[name=workerNode][value="' + this.state["EC2"]["worker"][i]["value"] + '"]').prop('checked', true);

                if(this.state["EC2"]["worker"][i]["key"] == "num_vms")
                    $('input[name=workerCount]').val(this.state["EC2"]["worker"][i]["value"]);
            }

            for(var i = 0; i < state["EC2"]["provider"].length; i++)
            {
                if(this.state["EC2"]["provider"][i]["key"] == "aws_secret_key")
                    $('input[name=aws_secret_key]').val(this.state["EC2"]["provider"][i]["value"]);
                
                if(this.state["EC2"]["provider"][i]["key"] == "aws_access_key")
                    $('input[name=aws_access_key]').val(this.state["EC2"]["provider"][i]["value"]);
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
                              this.updateUI(data['molns']);
                              
                              this.createMessage({ status : 2, msg : 'Molns cluster start request sent succesfully' });
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
            $.post( '/molnsconfig/stopMolns',
                    {
                        providerType : 'EC2'
                    },
                    _.bind(function(data) {
                        if(typeof(data['molns']) != 'undefined')
                        {
                            this.updateUI(data['molns']);
                        
                            this.createMessage({ status : 2, msg : 'Molns cluster stop request sent successfully' });
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
                this.updateUI(data['molns']);
                
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

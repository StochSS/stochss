$( function() {
    var AppView = Backbone.View.extend({
        el : $(".content")[0],

        // Delegated events for creating new items, and clearing completed ones.
        events : {
            "click .startCluster" :  "startCluster",
            "click .stopCluster" : "stopCluster",
            "click .addWorkers" :  "addWorkers",
            "change .providerType" : "changeProvider"
        },

        // At initialization we bind to the relevant events on the `Todos`
        // collection, when items are added or changed. Kick things off by
        // loading any preexisting todos that might be saved in *localStorage*.
        initialize : function() {
        },

        changeProvider : function() {
            for(var providerType in this.ui)
            {
                this.ui[providerType]['providerBase'].hide();
                this.ui[providerType]['controllerBase'].hide();
                this.ui[providerType]['workerBase'].hide();
            }

            var providerType = $( '.providerType' ).val();

            this.ui[providerType]['providerBase'].show();
            this.ui[providerType]['controllerBase'].show();
            this.ui[providerType]['workerBase'].show();
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

        buildUI : function(state) {
            var providerDiv = $( '.provider' );
            var controllerDiv = $( '.controller' );
            var workerDiv = $( '.worker' );

            this.ui = {};

            for(var providerType in state)
            {
                $( '.providerType' ).append( '<option value="' + providerType + '">' + providerType + '</option>' );

                this.ui[providerType] = {};

                this.ui[providerType]['provider'] = {};
                this.ui[providerType]['controller'] = {};
                this.ui[providerType]['worker'] = {};
                
                var providerBase = $( '<tbody></tbody>' );
                this.ui[providerType]['providerBase'] = providerBase;
                providerDiv.after( providerBase );
                
                var controllerBase = $( '<tbody></tbody>' );
                this.ui[providerType]['controllerBase'] = controllerBase;
                controllerDiv.after( controllerBase );
                
                var workerBase = $( '<tbody></tbody>' );
                this.ui[providerType]['workerBase'] = workerBase;
                workerDiv.after( workerBase );

                template = _.template( '<tr><td><%= question %></td><td><input value="<%= value %>"></td></tr>' );

                for(var key in state[providerType]['provider'])
                {
                    var newElement = template( state[providerType]['provider'][key] );
                    
                    this.ui[providerType]['provider'][key] = $( newElement ).appendTo( providerBase ).find('input');
                }

                for(var key in state[providerType]['controller'])
                {
                    var newElement = template( state[providerType]['controller'][key] );

                    this.ui[providerType]['controller'][key] = $( newElement ).appendTo( controllerBase ).find('input');
                }

                for(var key in state[providerType]['worker'])
                {
                    var newElement = template( state[providerType]['worker'][key] );

                    this.ui[providerType]['worker'][key] = $( newElement ).appendTo( workerBase ).find('input');
                }
            }
        },

        updateUI : function(state) {
            for(var providerType in state)
            {
                for(var key1 in {'provider' : 1, 'controller' : 1})
                {
                    for(var key2 in state[providerType][key1])
                    {
                        var element = this.ui[providerType][key1][key2];
                        
                        var newVal = state[providerType][key1][key2]['value'];
                        
                        if(element.val().trim() != newVal && newVal != "********")
                            element.val(newVal);
                    }
                }
            }
        },

        extractStateFromUI : function() {
            state = {};

            for(var providerType in this.ui)
            {
                state[providerType] = {};

                for(var key1 in {'provider' : 1, 'controller' : 1, 'worker' : 1})
                {
                    state[providerType][key1] = [];
                    
                    for(var key2 in this.ui[providerType][key1])
                    {
                        var element = this.ui[providerType][key1][key2];
                        
                        state[providerType][key1][key2] = {};
                        
                        state[providerType][key1][key2]['value'] = element.val().trim();
                    }
                }
            }

            return state;
        },
                            
        startCluster : function() {
            $.ajax( { url : '/molnsconfig/startMolns',
                      data : {
                          state : JSON.stringify(this.extractStateFromUI()),
                          pw : $( 'input[name=password]' ).val(),
                          providerType : $( '.providerType' ).val()
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
                        providerType : $( '.providerType' ).val()
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
        
        addWorkers : function() {
            $.post( '/molnsconfig/addWorkers',
                    {
                        number : $( 'input[name=number]' ).val(),
                        providerType : $( '.providerType' ).val()
                    },
                    _.bind(function(data) {
                        if(typeof(data['molns']) != 'undefined')
                        {
                            this.updateUI(data['molns']);

                            this.createMessage({ status : 2, msg : 'Add worker request successfully sent to Molns cluster' });
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
                this.buildUI(data['molns']);
                this.updateUI(data['molns']);
                this.changeProvider();
                
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

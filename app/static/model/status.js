$( document ).ready(
    function() {
        console.log( "document loaded" );

        var jobs = new stochkit.SimulationCollection();

        var StatusPage = Backbone.View.extend(
            {
                el : $( "body" ),
                
                events : { "click #refresh" : "updateJobs" },

                simulationViews : [],
                
                initialize: function()
                {
                    this.listenTo(jobs, 'add', this.addOne);
                    this.listenTo(jobs, 'reset', this.addOne);

                    jobs.fetch();
                },
                
                updateJobs: function()
                {
                    jobs.fetch();
                },
                
                addOne: function(simulation)
                {
                    var status_view = new stochkit.StatusView( { model: simulation } );
                    var technical_output_view = new stochkit.TechnicalOutputView( { model: simulation } );
                    var output_view = new stochkit.OutputView( { model: simulation } );

                    status_table = this.$el.find( '#jobs' );
                    status_table.append(status_view.render().el);

                    this.listenTo( simulation, 'select', _.partial(function(technical_output_view, output_view) {
                        stage = $( '#main_stage' );
                        stage.children().detach();
                        
                        if(output_view.model.attributes.status != 'finished')
                        {
                            output_view.model.fetch();
                        }
                        
                        stage.append(output_view.el);
                        stage.append(technical_output_view.el);

                        //It's a damn shame I have to do this. Flot gets its plotting wrong if I don't
                        output_view.render()
                    },
                                                                   technical_output_view, output_view));

                }
            }
        );
        
        var control = new StatusPage();
    }
);

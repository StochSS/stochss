var Convert = Convert || {}

Convert.VolumeChoose = Backbone.View.extend(
    {
        initialize: function()
        {
            this.$el = $( '#volumeChoose' ).hide();

	    this.rowTemplate = _.template('<tr>\
<td><a class="select" href="#"><%= model.attributes.name %> (Model <%= model.attributes.id %>)</a></td>\
<td><%= model.type %></td>\
</tr>');

            this.table = this.$el.find( 'tbody' )
            this.volume = this.$el.find( '.volume' )
            this.msgbox = this.$el.find( '.msgbox' )

            this.render();
        },

        attach: function(model)
        {
            if(!_.isEmpty(this.model))
            {
                this.detach();
            }

            this.$el.show();

            this.model = model;

            var species = this.model.SpeciesList.children();

            var minConcentration = null;
            
            for(var i = 0; i < species.length; i++) {
                var specie = species.eq(i);
                    
                var name = specie.find('Id').text();
                var initialPopulation = specie.find('InitialPopulation').text();

                if(initialPopulation > 0)
                {
                    if(minConcentration != null)
                    {
                        minConcentration = Math.min(minConcentration, initialPopulation);
                    } else {
                        minConcentration = initialPopulation;
                    }
                }
            }

            if(minConcentration > 0 && minConcentration != null)
            {
                var vol = 100 / minConcentration;
            } else {
                var vol = 1;
            }

            this.volume.val(vol);

            this.volume.on('keyup', _.debounce(_.partial(function(model, msgbox, volume) {
                model.trigger('volumeChange');
                
                number = Number(volume.val());

                if(isNaN(number) || !isFinite(number))
                {
                    msgbox.text('This is not a valid number (parsed as: ' + number.toString() + ')')
                }
                else
                {
                    msgbox.text('')
                }

            }, this.model, this.msgbox, this.volume), 400 ));

            this.volume.forceNumeric();

            this.listenTo(model, 'volumeChange', this.render);
            this.listenTo(model, 'destroy', this.detach);           

            this.render();
        },

        detach: function()
        {
            this.stopListening(this.model);

            this.volume.off();

            delete this.model;

            this.render();
        },

        render: function()
        {
            this.table.empty();

            vol = Number(this.volume.val());

            if(_.has(this, 'model')) {
                var species = this.model.SpeciesList.children();

                var template = '<tr> \
<td class="id"></td> \
<td class="conc"></td> \
<td class="pop"></td> \
</tr>';

                for(var i = 0; i < species.length; i++) {
                    specie = species.eq(i);
                    
                    name = specie.find('Id').text();
                    expr = specie.find('InitialPopulation').text();

                    var row = $( template ).appendTo( this.table );
                    
                    var id = row.find( '.id' );
                    var concentration = row.find( '.conc' );
                    var population = row.find( '.pop' );
                    
                    id.text(name);
                    concentration.text(expr);
                    population.text(Math.round(Number(expr) * vol));
                }
            }

            return this;
        }
    });

Convert.ReactionVerify = Backbone.View.extend(
    {
        initialize: function(attributes, options)
        {
            this.$el = $( '#reactionVerify' ).hide();

	    this.rowTemplate = _.template('<tr>\
<td class="id"></td>\
<td class="expression"></td>\
<td class="propensity"></td>\
<td><font color="green" class="result"></font></td>\
</tr>');

            this.table = this.$el.find( 'tbody' );

            this.volume = options.volume; // exptract volume selector from other view

            this.render();
        },

        attach: function(model)
        {
            if(!_.isEmpty(this.model))
            {
                this.detach();
            }

            this.$el.show();

            this.listenTo(model, 'volumeChange', this.render);
            this.listenTo(model, 'destroy', this.detach);           

            this.model = model;

            this.render();
        },

        detach: function()
        {
            this.stopListening(this.model);

            delete this.model;

            this.render();
        },

        render: function()
        {
            this.table.empty();

            var vol = Number(this.volume.val());
            
            if(_.has(this, 'model')) {
                var reactions = this.model.ReactionsList.children();
                
                for(var i = 0; i < reactions.length; i++) {
                    var reaction = reactions.eq(i);
                    
                    var name = reaction.find('Id').text();
                    var type = reaction.find('Type').text();

                    //Count number of reactions
                    //The model very well could lie about being mass action, we gotta check
                    var reactants = reaction.find('Reactants').children();
                    var reactantCount = reaction.find('Reactants').children().length;
                    var stoichiometries = reaction.find('Reactants').children().map( function(idex, item) { return $( item ).attr('stoichiometry'); } );
                    var reactantParticleCount = 0;

                    var allTheSame = true;
                    var last = null;
                    
                    for(var j = 0; j < reactants.length; j++) {
                        thisId = reactants.eq(j).attr('id');
                        if(last != null && last != thisId)
                        {
                            allTheSame = false;
                        }
                        
                        reactantParticleCount += Number(reactants.eq(j).attr('stoichiometry'));
                        last = thisId;
                    }

                    var prettyReaction = stochkit.PrettyPrint.Reaction(reaction);

                    var row = $( this.rowTemplate() ).appendTo( this.table );
                    
                    var id = row.find( '.id' );
                    var expression = row.find( '.expression' );
                    var propensity = row.find( '.propensity' );
                    var result = row.find( '.result' );

                    id.text(name);

                    if(type.toLowerCase() == 'mass-action')
                    {
                        expression.text(prettyReaction.expression);
                        if((reactantCount == 1 && reactantParticleCount == 1) || reactantCount == 0) {
                            propensity.text(prettyReaction.propensity);

                            result.prop('color', 'green');
                            result.text('Successful, Mass Action');
                        } else if((reactantCount == 1 || reactantCount == 2) && reactantParticleCount == 2) {
                            if(allTheSame == true && reactantParticleCount == 2) {
                                propensity.text(prettyReaction.propensity + '*2/' + vol);
                            } else {
                                propensity.text(prettyReaction.propensity + '/' + vol);
                            }
                            result.prop('color', 'green');
                            result.text('Successful, Mass Action');
                        } else {
                            propensity.text(prettyReaction.propensity);

                            result.prop('color', 'red');
                            result.text('Failed, Valid Mass Action, but Invalid under SSA assumptions');
                        }
                    }
                    else
                    {
                        expression.text(prettyReaction.expression);
                        propensity.text(prettyReaction.propensity);

                        result.prop('color', 'red');
                        result.text('Failed, Custom Propensity');
                    }
                }
            }

            return this;
        }
    });

$( document ).ready( function() {
    //loadTemplate("speciesEditorTemplate", "/model/speciesEditor.html");
    //loadTemplate("parameterEditorTemplate", "/model/parameterEditor.html");
    //loadTemplate("reactionEditorTemplate", "/model/reactionEditor.html");

    waitForTemplates(run);
});

var run = function()
{
    var modelCollection = new stochkit.ModelCollection();

    var volumeChoose = new Convert.VolumeChoose();
    //Gotta make this link manually, dunno if this is the right way to do it, but I'm doing it
    var reactionVerify = new Convert.ReactionVerify({}, { volume: volumeChoose.volume });

    var Control = Backbone.View.extend(
        {
            events : {"click .createModel" : "createModel" },

            initialize: function() {
                this.$el = $( 'body' );
                this.$el.find( '#createModel' ).hide();
                
                this.listenTo(modelCollection, 'add', this.instrumentModel);
                this.listenTo(modelCollection, 'destroy', this.unInstrumentModel);
            },

            instrumentModel: function(addedModel) {
                this.listenTo(addedModel, 'select', _.partial( function(model) { this.selectModel(model); }, addedModel) );
                
                //Sometimes this isn't set on adding... I think it's a bug?
                addedModel.collection = modelCollection;
           },

            unInstrumentModel: function(model) {
                this.stopListening(model);

                volumeChoose.detach(model);
                reactionVerify.detach(model);
            },

            selectModel: function(model)
            {
                this.$el.find( '#createModel' ).show();

                volumeChoose.attach(model);
                reactionVerify.attach(model);

                this.model = model;

                this.$el.find(' .modelName ').val(model.attributes.name + "_pop");
            },

            createModel: function()
            {
                var vol = Number(volumeChoose.volume.val())

                if(_.has(this, 'model'))
                {
                    name = this.$el.find(' .modelName ').val();
                    var newModel = new stochkit.Model({name : name, type : "population"});
                    newModel.fromModel(this.model);

                    newModel.attributes.type = "population";
                    newModel.attributes.name = name;

                    var reactions = newModel.ReactionsList.children();
                    
                    for(var i = 0; i < reactions.length; i++) {
                        var reaction = reactions.eq(i);
                        
                        var name = reaction.find('Id').text();
                        var type = reaction.find('Type').text();

                        //Count number of reactions
                        var reactants = reaction.find('Reactants').children();
                        var reactantCount = reaction.find('Reactants').children().length;
                        var stoichiometries = reaction.find('Reactants').children().map( function(idx, item) { return $( item ).attr('stoichiometry'); } );
                        var reactantParticleCount = 0;

                        var allTheSame = true;
                        var last = null;

                        for(var j = 0; j < reactants.length; j++) {
                            thisId = reactants.eq(j).attr('id');
                            if(last != null && last != thisId)
                            {
                                allTheSame = false;
                            }

                            reactantParticleCount += Number(reactants.eq(j).attr('stoichiometry'));
                            last = thisId;
                        }

                        if(type.toLowerCase() == 'mass-action')
                        {
			    var newname = ""
                            var reacObj = newModel.getReaction(name);
			    do
			    {
				newname = reacObj.prop + '_' + randString(3);
			    } while(newModel.getParameter(newname) != null);

                            if(reactantParticleCount == 2 && allTheSame) {
				newModel.addParameter(newname, reacObj.prop + ' * 2 / ' + vol);
				newModel.setReaction(name, reacObj.reactants, reacObj.products, newname, true);
                            } else if(reactantParticleCount == 2 && !allTheSame) {
				newModel.addParameter(newname, reacObj.prop + ' / ' + vol);
				newModel.setReaction(name, reacObj.reactants, reacObj.products, newname, true);
                            }
                        }
                    }

                    var species = this.model.SpeciesList.children();

                    for(var i = 0; i < species.length; i++) {
                        specie = species.eq(i);
                        
                        name = specie.find('Id').text();
                        expr = specie.find('InitialPopulation').text();

                        newModel.setSpecies(name, Math.round(Number(expr) * vol));
                    }
                    
                    modelCollection.add(newModel);
                    newModel.save({}, { success: _.partial(function(elem) { elem.html('<font color="green">Model successfully created</font>'); }, this.$el.find( '#msg' )),
                                        error: _.partial(function(elem) { elem.html('<font color="red">Failed</font>'); }, this.$el.find( '#msg' )) });
                }
            }
        });

    // This is where most of the miscellaneous junk should go
    var control = new Control();

    // Insert the render widgets/views
    //$( '#modelSelect' ).append(modelSelect.render().$el);
    $( '#volumeChoose' ).append(volumeChoose.render().$el);
    $( '#reactionVerify' ).append(reactionVerify.render().$el);

    // Get the modelId that the GUI injected here. Sigh, the GUI...
    var modelName = $.trim($( '#modelSelect' ).text());

    // Get the ball rolling
    modelCollection.fetch( { success : function(collection) {

        modelName = $.trim(modelName);
        for(var i = 0; i < collection.length; i++)
        {
            if(collection.at(i).attributes.name == modelName)
            {
                collection.at(i).trigger( 'select' );
                break;
            }
        }
    } });
}


module.exports = {
  speciesEditor: {
    name: "Names for species, parameters, reactions, events, and rules must be unique.",

    initialValue: "Initial population of a species.",

    annotation: "An optional note about the species.",

    remove: "A species may only be removed if it is not a part of any reaction, event assignment, or rule.",
    
    speciesMode: "Concentration - Species will only be represented using continuous (floating point) values.<br>Population - Species will only be represented "+
        "using discrete (integer count) values.<br>Hybrid Concentration/Population - Allows a species to be represented using continuous and/or discrete values.",

    mode: "Concentration - Species will only be represented using continuous (floating point) values.<br>Population - Species will only be represented "+
        "using discrete (integer count) values.<br>Hybrid Concentration/Population - Allows a species to be represented using continuous and/or discrete values.",

    switchValue: "Switching Tolerance - Tolerance level for considering a dynamic species deterministically, value is compared to an estimated sd/mean population "+
        "of a species after a given time step. This value will be used if a 'Minimum Value' not provided.<br>Minimum Value For Switching - Minimum population value "+
        "at which species will be represented as Concentration."
  },
  parametersEditor: {
    name: "Names for species, parameters, reactions, events, and rules must be unique.",
    
    expression: "A parameter value or a mathematical expression calculating the parameter value.",
    
    annotation: "An optional note about a parameter.",
    
    remove: "A parameter may only be removed if it is not used in any reaction, event assignment, or rule."
  },
  reactionsEditor: {
    name: "Names for species, parameters, reactions, events, and rules must be unique.",
    
    annotation: "An optional note about the reaction.",
    
    rate: "The rate of the mass-action reaction.",
    
    propensity: "The custom propensity expression for the reaction.",
    
    reactant: "The reactants that are consumed in the reaction, with stoichiometry.",
    
    product: "The species that are created by the reaction event, with stoichiometry.",
  },
  eventsEditor: {
    name: "Names for species, parameters, reactions, events, and rules must be unique.",
    
    annotation: "An optional note about an event.",
    
    triggerExpression: "The trigger expression can be any mathematical expression which evaluates to a boolean value in a python environment (i.e. t==50).  This "+
        "expression is evaluable within the model namespace, and any variable (Species, Parameters, etc.) can be referenced in the expression.  Time is represented "+
        "with the lower case variable 't'. An event will begin execution of assignments (or delay, if any) once this expression changes from 'False' to 'True.'",
    
    delay: "contains math expression evaluable within model namespace. This expression designates a delay between the trigger of an event and the execution of its assignments.",
    
    priority: "Typically a number: 1, 2, etc. that designates the execution order for events which are executed simultaneously.  Can be a math expression evaluable "+
        "within the model namespace.",
    
    initialValue: "If true, the trigger expression will be evaluated as 'True' at start of simulation.  This can be useful for some models, since an event is only "+
        "executed when the trigger expression state changes from 'False' to 'True'.",
    
    persistent: "If persistent, an event assignment will always be executed when the event's trigger expression evaluates to true.  If not persistent, the event "+
        "assignment will not be executed if the trigger expression evaluates to false between the time the event is triggered and the time the assignment is executed.",
    
    useValuesFromTriggerTime: "If set to true, assignment execution will be based off of the model state at trigger time. If false (default), the assignment will be "+
        "made using values at assignment time.",
    
    assignments: "An Event Assignment describes a change to be performed to the current model simulation.  This assignment can either be fired at the time its associated "+
        "trigger changes from false to true, or after a specified delay, depending on the Event configuration. An event may contain one or more assignments.",
    
    variable: "The target Species or Parameter to be modified by the event.",
    
    assignmentExpression: "Can be any mathematical statement which resolves to an integer or float value.  This value will be assigned to the assignment's target variable "+
        "upon event execution."
  },
  rulesEditor: {
    name: "Names for species, parameters, reactions, events, and rules must be unique.",
    
    type: "Assignment Rules: An assignment rule describes a change to a Species or Parameter as a function whose left-hand side is a scalar (i.e. x = f(V), where V is a "+
        "vector of symbols, not including x).<br>  Rate Rules: A rate rule describes a change to a Species or Parameter as a function whose left-hand side is a rate of "+
        "change (i.e. dx/dt = f(W), where W is a vector of symbols which may include x).",
    
    variable: "Target variable to be modified by the Rule's formula.",
    
    expression: "A Python evaluable mathematical expression representing the right hand side of a rule function.<br>  For Assignment Rules, this represents the right hand "+
        "side of a scalar equation.<br>  For Rate Rules, this represents the right hand side of a rate-of-change equation.",
    
    annotation: "An optional note about a rule."
  },
  sbmlComponentsEditor: {
    annotation: "An optional note about the SBML Component."
  },
  modelSettings: {
    previewSettings: "Preview Settings are applied to the model and are used for the model preview and all workflows.",
    
    previewTime: "End time of simulation.",
    
    timeUnits: "Save point increment for recording data.",
    
    volume: "The volume of the system matters when converting to from population to concentration form. This will also set a parameter 'vol' for use in custom (i.e. "+
        "non-mass-action) propensity functions."
  },
  simulationSettings: {
    rtol: "Relative tolerance for ode solutions, controls a relative accuracy (number of correct digits).  The solver keeps the local error estimates less than atol + "+
        "rtol * abs(y).  Value must be greater than 0.0.",

    atol: "Absolute tolerance for ode solutions, if a component of y is approximately below atol, the error only needs to fall within the same atol threshold, and the "+
        "number of correct digits is not guaranteed.  The solver keeps the local error estimates less than atol + rtol * abs(y).  Value must be greater than 0.0.",

    ttol: "A relative error tolerance value governing tau-leaping tau selections.  Based on Cao, Y.; Gillespie, D. T.; Petzold, L. R. (2006). 'Efficient step size "+
        "selection for the tau-leaping simulation method' (PDF). The Journal of Chemical Physics. 124 (4): 044109. Bibcode:2006JChPh.124d4109C. doi:10.1063/1.2159468. "+
        "PMID 16460151  Value must be between 0.0 and 1.0.",

    seed: "The seed for the simulation.  Set to -1 for a random seed.",

    realizations: "The number of simulation realizations to be executed. A time-series trajectory for each realization will be returned upon completion of all "+
        "realizations.",

    algorithm:"The solver by which to simulate the model.",

    ode: "This algorithm produces a 'continuous-deterministic' solution in the style of Ordinary Differential Equations (ODE).",

    ssa: "This algorithm produces a 'discrete-stochastic' solution using the Stochastic Simulation Algorithm (SSA, also know as the Gillespie algorithm).",

    tauLeaping: "This algorithm produces a 'discrete-stochastic' solution using a variant of the SSA that is more efficient, but less accurate.",

    hybrid: "This hybrid deterministic-stochastic will produce a solution that is 'discrete-stochastic' for small population sizes and 'continuous-deterministic' "+
        "for large population sizes.",

    chooseForMe: "Hybrid will be selected based on Event, Rules, and other SBML model components or if the model is represented as Concentration or Hybrid "+
        "Concentration/Population.  If the model is represented as population, the SSA will be selected.  This can be modified to a Tau-Leaping algorithm by "+
        "changing the au-tolerance value from the default of 0.03."
  },
  parameterSweepSettings: {
    sweepType: "The number of parameters to sweep through.",

    species: "The initial species to view sweep data for.",

    variable: "The parameter(s) to sweep through.",
    
    value: "The current value for the parameter you with to sweep through.",
    
    min: "The initial value of the sweep range.  Defaults to half of the current value.",
    
    max: "The final value of the sweep range.  Defaults to 1.5 times the current value.",
    
    steps: "The number of steps used to determine the sweep values across the sweep range."
  },
  parameterSweepResults: {
    species: "The species to view sweep data for",

    mapper: "The 'feature extractor' which calculates a single value from the species population/concentration data of each simulated trajectory.",
    
    reducer: "The statistical function applied to the ensemble of values extracted by the 'feature extractor' from each simulation trajectory."
  },
  workflowSelection: {
    ensembleSimulation: "Produce a time-series result for one or more simulation(s) of the model.",

    parameterSweep: "Produced and compare results from model simulations by varying parameters over a range."
  }
}
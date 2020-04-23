module.exports = {
    'file-browser' : `
        <p><b>Open/Edit a File</b>: Double-click on a file or right-click on a file and click Open/Edit.  
        <b>Note</b>: Some files will open in a new tab so you may want to turn off the pop-up blocker.</p>
        <p><b>Open Directory</b>: Click on the arrow next to the directory or double-click on the directory.</p>
        <p><b>Create a Directory/Model</b>: Right-click on a directory, click New Directory/New Model, and enter the name of directory/model or path.  
        For models you will need to click on the type of model you wish to create before entering the name or path.</p>
        <p><b>Create a Workflow</b>: Right-click on a model and click New Workflow, this takes you to the workflow selection page.  
        From the workflow selection page, click on one of the listed workflows.</p>
        <p><b>Convert a File</b>: Right-click on a Model/SBML, click Convert, and click on the desired Convert to option.  
        Model files can be converted to Spatial Models, Notebooks, or SBML files.  
        Spatial Models and SBML file can be converted to Models.  
        <b>Note</b>: Notebooks will open in a new tab so you may want to turn off the pop-up blocker.</p>
        <p><b>Move File or Directory</b>: Click and drag the file or directory to the new location.  
        You can only move an item to a directory if there isn't a file or directory with the same name in that location.</p>
        <p><b>Download a Model/Notebook/SBML File</b>: Right-click on the file and click download.</p>
        <p><b>Rename File/Directory</b>: Right-click on a file/directory, click rename, and enter the new name.</p>
        <p><b>Duplicate/Delete A File/Directory</b>: Right-click on the file/directory and click Duplicate/Delete.</p>
    `,
    'model-editor' : `
        <p><b>Species</b>: A species refers to a pool of entities that are considered 
          indistinguishable from each other for the purposes of the model and may participate 
          in reactions.</p>
        <p><b>Parameter</b>: A Parameter is used to define a symbol associated with 
          a value; this symbol can then be used in mathematical formulas in a model.</p>
        <p><b>Reaction</b>: A reaction in SBML represents any kind of process that can change 
          the quantity of one or more species in a model.  At least one species is required to 
          add a reaction and at least one parameter is required to add a mass action reaction.</p>
        <p><b>Event</b>: Events describe the time and form of instantaneous, discontinuous state 
          changes in the model.  An Event object defines when the event can occur, the variables 
          that are affected by it, how the variables are affected, and the event’s relationship 
          to other events.  At least one species or parameter is required to add an event.</p>
        <p><b>Rule</b>: Rules provide additional ways to define the values of variables 
          in a model, their relationships, and the dynamical behaviors of those variables.  The 
          rule type Assignment Rule is used to express equations that set the values of variables.  
          The rule type Rate Rule is used to express equations that determine the rates of change 
          of variables.  At least one species or parameter is required to add a rule.</p>
        <p><b>Preview</b>: A preview of the model shows the results of the first five seconds of a 
          single trajectory of the model simulation.  At least one species and one reaction, event, 
          or rule is required to run a preview.</p>
        <p><b>Workflow</b>: A workflow allows you to run a full model with multiple trajectories with 
          settings the will help refine the simulation.  At least one species and one reaction, event, 
          or rule is required to create a new workflow.</p>
    `
}
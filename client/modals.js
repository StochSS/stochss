/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2020 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

let help = require('./page-help')

let templates = {
        input : (modalID, inputID, title, label, value) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for=${inputID}>${label}</label>
                        <input type="text" id=${inputID} name=${inputID} size="30" autofocus value="${value}">
                        <li class="invalid-feedback" id="${inputID}SpecCharError">Names can only include the following characters: 
                                                                                  (0-9), (a-z), (A-Z) and (., -, _, (, or ))</li>
                        <li class="invalid-feedback" id="${inputID}EndCharError">Names cannot end with a '/'</li>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok-model-btn box-shadow" disabled>OK</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        input_long : (modalID, inputID, title, label, value) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for=${inputID}>${label}</label>
                        <textarea id=${inputID} name=${inputID} rows="5" style="width: 100%;" autofocus>${value}</textarea>
                        </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok-model-btn box-shadow">OK</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        message : (modalID, title, message) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title"> ${title} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <p> ${message} </p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary box-shadow close-btn" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        confirmation : (modalID, title) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title"> ${title} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary yes-modal-btn box-shadow">Yes</button>
                        <button type="button" class="btn btn-secondary no-modal-btn box-shadow" data-dismiss="modal">No</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        confirmation_with_message : (modalID, title, message) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title"> ${title} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <p> ${message} </p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary yes-modal-btn box-shadow">Yes</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">No</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        upload : (modalID, title, accept, withName=true) => {
            let displayNameField = withName ? "" : " style='display: none'"
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content info">
                      <div class="modal-header">
                        <h5 class="modal-title"> ${title} </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="verticle-space">
                          <span class="inline" for="datafile">Please specify a file to import: </span>
                          <input id="fileForUpload" type="file" id="datafile" name="datafile" size="30" ${accept} required>
                          <li class="invalid-feedback" id="fileSpecCharError">Names can only include the following characters: 
                                                                                  (0-9), (a-z), (A-Z) and (., -, _, (, or ))</li>
                        </div>
                        <div class="verticle-space"${displayNameField}>
                          <span class="inline" for="fileNameInput">New file name (optional): </span>
                          <input type="text" id="fileNameInput" name="fileNameInput" size="30">
                          <li class="invalid-feedback warning" id="fileNameUsageMessage">Names that contain errors will not be used to rename the file.</li>
                          <li class="invalid-feedback" id="fileNameInputSpecCharError">Names can only include the following characters: 
                                                                                  (0-9), (a-z), (A-Z) and (., -, _, (, or ))</li>
                          <li class="invalid-feedback" id="fileNameInputEndCharError">Names cannot end with a '/'</li>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary box-shadow upload-modal-btn" disabled>Upload</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        select : (modalID, selectID, title, label, options) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for=${selectID}>${label}</label>
                        <select id=${selectID} name=${selectID} autofocus>
                          ${options}
                        </select>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok-model-btn box-shadow">OK</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        fileSelect : (modalID, fileID, locationID, title, label, files) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div>
                          <label for=${fileID}>${label}</label>
                          <select id=${fileID} name=${fileID} autofocus>
                            ${files}
                          </select>
                        </div>
                        <div id="location-container" style="display: none;">
                          <div class="text-info">This model was found in multiple locations</div>
                          <label for=${locationID}>Location: </label>
                          <select id=${locationID} name=${locationID} autofocus>
                          </select>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok-model-btn box-shadow" disabled>OK</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>`
        }
    }

module.exports = {
    deleteFileHtml : (fileType) => {
        let modalID = "deleteFileModal"
        let title = `Permanently delete this ${fileType}?`

        return templates.confirmation(modalID, title)
    },
    moveToTrashConfirmHtml : (fileType, newProjectFormat=false) => {
        let modalID = "moveToTrashConfirmModal"
        let title = `Move this ${fileType} to trash?`

        if(newProjectFormat) {
          let message = "The workflows for this model will be archived"
          return templates.confirmation_with_message(modalID, title, message);
        }
        return templates.confirmation(modalID, title)
    },
    emptyTrashConfirmHtml : () => {
      let modalID = "emptyTrashConfirmModal"
      let title = "Are you sure you want to permanently erase the items in the Trash?"

      return templates.confirmation(modalID, title)
    },
    operationInfoModalHtml : (page) => {
        let modalID = "operationInfoModal"
        let title = "Help"
        let message = help[page]
          
        return templates.message(modalID, title, message)
    },
    newProjectModalHtml : () => {
      let modalID = "newProjectModal"
      let inputID = "projectNameInput"
      let title = "New Project"
      let label = "Project Name"
      let value = ""

      return templates.input(modalID, inputID, title, label, value)
    },
    newWorkflowGroupModalHtml : () => {
      let modalID = "newWorkflowGroupModal"
      let inputID = "workflowGroupNameInput"
      let title = "New Workflow Group"
      let label = "Workflow Group Name"
      let value = ""

      return templates.input(modalID, inputID, title, label, value)
    },
    newProjectModelHtml : (files) => {
      let modalID = "newProjectModelModal"
      let fileID = "modelFileInput"
      let locationID = "modelPathInput"
      let title = "Add Existing Model to Project"
      let label = "Models: "
      files = files.map(function (file) {
        return `<option value="${file[0]}">${file[1]}</option>`
      })
      files.unshift(`<option value="">-- Select a model --</option>`)
      files = files.join(" ")

      return templates.fileSelect(modalID, fileID, locationID, title, label, files)
    },
    newProjectModelSuccessHtml : (message) => {
      let modalID = "newProjectModelSuccessModal"
      let title = "Success!"

      return templates.message(modalID, title, message)
    },
    newProjectModelErrorHtml : (title, message) => {
      let modalID = "newProjectModelErrorModal"

      return templates.message(modalID, title, message)
    },
    newProjectOrWorkflowGroupErrorHtml : (title, error) => {
      let modalID = "newProjectOrWorkflowGroupModal"

      return templates.message(modalID, title, error)
    },
    newWorkflowGroupSuccessHtml: (message) => {
      let modalID = "newWorkflowGroupSuccessModal"
      let title = "Success!"

      return templates.message(modalID, title, message)
    },
    newProjectModelWarningHtml : (message) => {
      let modalID = "newProjectModelWarningModal"
      let title = "Warnings"
      
      return templates.confirmation_with_message(modalID, title, message)
    },
    renderCreateModalHtml : (isModel, isSpatial) => {
        var title = 'Directory';
        if(isModel){
            title = isSpatial ? 'Spatial Model' : 'Model';
        }
        title = "New " + title
        let modalID = "newModalModel"
        let inputID = "modelNameInput"
        let label = "Name:"
        let value = ""
        
        return templates.input(modalID, inputID, title, label, value)
    },
    sbmlToModelHtml : (title, errors) => {
        let modalID = "sbmlToModelModal"
        for(var i = 0; i < errors.length; i++) {
            if(errors[i].startsWith("SBML Error") || errors[i].startsWith("Error")){
                errors[i] = "<b>Error</b>: " + errors[i]
            }else{
                errors[i] = "<b>Warning</b>: " + errors[i]
            }
        }
        let message = errors.join("<br>")

        return templates.message(modalID, title, message)
    },
    uploadFileErrorsHtml : (file, type, statusMessage, errors) => {
        let modalID = "sbmlToModelModal"
        let types = {"mdl":"model file", "sbml":"sbml file", "smdl":"spatial model file", "zip":"zip archive"}
        if(type === "file") {
          type = types[file.split('.').pop()]
        }else{
          type += " file"
        }
        let title = `Errors uploading ${file} as a ${type}`
        for(var i = 0; i < errors.length; i++) {
            errors[i] = "<b>Error</b>: " + errors[i]
        }
        let message = `<p>${errors.join("<br>")}</p><p><b>Upload status</b>: ${statusMessage}</p>`

        return templates.message(modalID, title, message)
    },
    uploadFileHtml : (type, isSafariV14Plus) => {
        let modalID = "uploadFileModal"
        let title = `Upload a ${type}`
        var accept = "";
        if(type === "model") {
          accept = 'accept=".json, .mdl, .smdl"'
        }else if(type === "sbml") {
          accept = 'accept=".xml, .sbml"'
        }else if(type === "file" && isSafariV14Plus){
          // only used if using Safari v14+ and only needed to fix upload issue
          accept = 'accept=".json, .mdl, .smdl, .xml, .sbml, .ipynb, .zip, .md, .csv, .p, .omex, .domn, .txt, .pdf, audio/*, video/*, image/*"'
        }
        
        return templates.upload(modalID, title, accept)
    },
    duplicateWorkflowHtml : (wkflFile, body) => {
        let modalID = "duplicateWorkflowModal"
        let title = `Model for ${wkflFile}`

        return templates.message(modalID, title, body)
    },
    modelNotFoundHtml : (title, errorMessage) => {
        let modalID = "modelNotFoundModal"
        let message = `<p>${errorMessage}</p><p>Please correct the model path and press enter to reset the workflow.</p>`

        return templates.message(modalID, title, message)
    },
    wkflModelPathErrorHtml : () => {
        let modalID = "wkflModelPathErrorModal"
        let title = "Premission Denied"
        let message = "Models for workflow in a project must also be in the same project."

        return templates.message(modalID, title, message)
    },
    annotationModalHtml : (type, name, annotation) => {
        let modalID = `${type}AnnotationModal`
        let inputID = `${type}AnnotationInput`
        let title = `Annotation for ${name}`
        let label = "Annotation:"
        if(!annotation) {
          annotation = ""
        }

        return templates.input_long(modalID, inputID, title, label, annotation)
    },
    modelSaveErrorHtml : (title, error) => {
        let modalID = "modelSaveErrorModal"

        return templates.message(modalID, title, error)
    },
    newDirectoryErrorHtml : (title, error) => {
        let modalID = "newDirectoryErrorModal"

        return templates.message(modalID, title, error)
    },
    newProjectWorkflowHtml : (label, options) => {
        let modalID = "newProjectWorkflowModal"
        let selectID = "select"
        let title = "New Workflow"
        options = options.map(function (name) {
          return `<option value="${name}">${name}</option>`
        })
        options = options.join(" ")

        return templates.select(modalID, selectID, title, label, options)
    },
    selectPreviewTargetHTML : (species) => {
      let modalID = "previewTargetSelectModal";
      let selectID = "previewTargetSelectList";
      let title = "Preview Target Selection";
      let label = "Select a variable or property to preview: ";
      var options = species.map(function (name) {
        return `<option value="${name}">${name}</option>`
      });
      options = `<optgroup label='Variables'>
                     ${options.join(" ")}
                 </optgroup>
                 <optgroup label='Properties'>
                     <option value='type'>Type</option>
                     <option value='v1'>X Velocity</option>
                     <option value='v2'>Y Velocity</option>
                     <option value='v3'>Z Velocity</option>
                     <option value='rho'>Density</option>
                     <option value='mass'>Mass</option>
                     <option value='nu'>Viscosity</option>
                 </optgroup>`;

      return templates.select(modalID, selectID, title, label, options)
    },
    projectExportSuccessHtml : (fileType, message) => {
      let modalID = "projectExportSuccessModal"
      let title = `Successfully Exported the ${fileType}`

      return templates.message(modalID, title, message)
    },
    projectExportErrorHtml : (title, message) => {
      let modalID = "projectExportErrorModal"
      
      return templates.message(modalID, title, message)
    },
    existingCreatorConfirmationHtml : (title) => {
      let modalID = "existingCreatorConfirmationModal"

      return templates.confirmation(modalID, title)
    },
    addMetaDataHtml: (title) => {
      let modalID = "addMetaDataModal"

      return templates.confirmation(modalID, title)
    },
    noModelsMessageHtml: (title, message) => {
      let modalID = "noModelsMessageModal"

      return templates.message(modalID, title, message)
    },
    noWorkflowGroupMessageHtml: (title, message) => {
      let modalID = "noWorkflowGroupMessageModal"

      return templates.message(modalID, title, message)
    },
    newWorkflowHtml: (name, type) => {
      let modalID = "newWorkflowModal"
      let inputID = "workflowNameInput"
      let title = `New ${type} Workflow`
      let label = "Name:"
      let value = name

      return templates.input(modalID, inputID, title, label, value);
    },
    updateFormatHtml: (fileType) => {
      let modalID = `update${fileType}FormatModal`
      let title = `Update ${fileType} Format`
      if(fileType === "Project") {
        fileType += "s and Workflow";
        var target = "project and its workflows";
      }else{
        var target = "workflow";
      }
      let message = `StochSS ${fileType}s have a new format.  Would you like to update this ${target} to the new format?`

      return templates.confirmation_with_message(modalID, title, message);
    },
    renderDefaultModeModalHtml : () => {
        let concentrationDesciption = `Variables will only be represented using continuous (floating point) values.`;
        let populationDescription = `Population - Variables will only be represented using discrete (integer count) values.`;
        let hybridDescription = `Allows a variable to be represented using continuous and/or discrete values.`;

        return `
            <div id="defaultModeModal" class="modal" tabindex="-1" role="dialog">
              <div class="modal-dialog" role="document">
                <div class="modal-content info">
                  <div class="modal-header">
                    <h5 class="modal-title">Default Variable Mode (required)</h5>
                    <button type="button" class="close close-modal" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div>
                      <p>
                        The default mode is used to set the mode of all variables added to the model.  
                        The mode of a variable is used to determine how it will be represented in a simulation.
                      </p>
                      <p>Select one of the following: </p>
                    </div>
                    <div class="default-mode">
                      <button type="button" class="btn btn-primary concentration-btn box-shadow">Concentration</button>
                      <p style="margin-top: 5px;">${concentrationDesciption}</p>
                    </div>
                    <div class="default-mode">
                      <button type="button" class="btn btn-primary population-btn box-shadow">Population</button>
                      <p style="margin-top: 5px;">${populationDescription}</p>
                    </div>
                    <div class="default-mode">
                      <button type="button" class="btn btn-primary hybrid-btn box-shadow">Hybrid Concentration/Population</button>
                      <p style="margin-top: 5px;">${hybridDescription}</p>
                    </div>
                  </div>
                  <div class="modal-footer">
                  </div>
                </div>
              </div>
            </div>`
    }
}
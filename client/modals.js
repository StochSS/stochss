let help = require('./page-help')

let templates = {
        input : (modalID, inputID, title) => {
            return `
                <div id=${modalID} class="modal" tabindex="-1" role="dialog">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">New ${title}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <label for=${inputID}>Name:</label>
                        <input type="text" id=${inputID} name=${inputID} size="30" autofocus>
                        </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary ok-model-btn box-shadow">OK</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
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
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Close</button>
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
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">No</button>
                      </div>
                    </div>
                  </div>
                </div>`
        },
        upload : (modalID, title) => {
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
                          <input id="fileForUpload" type="file" id="datafile" name="datafile" size="30" required>
                        </div>
                        <div class="verticle-space">
                          <span class="inline" for="fileNameInput">New file name (optional): </span>
                          <input type="text" id="fileNameInput" name="fileNameInput" size="30">
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-primary box-shadow upload-modal-btn" disabled>Upload</button>
                        <button type="button" class="btn btn-secondary box-shadow" data-dismiss="modal">Cancel</button>
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
    operationInfoModalHtml : (page) => {
        let modalID = "operationInfoModal"
        let title = "Help"
        let message = help[page]
          
        return templates.message(modalID, title, message)
    },
    renderCreateModalHtml : (isModel, isSpatial) => {
        var title = 'Directory';
        if(isModel){
            title = isSpatial ? 'Spatial Model' : 'Non-Spatial Model';
        }
        let modalID = "newModalModel"
        let inputID = "modelNameInput"
        
        return templates.input(modalID, inputID, title)
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
        let title = `Errors uploading ${file} as a ${type} file`
        for(var i = 0; i < errors.length; i++) {
            errors[i] = "<b>Error</b>: " + errors[i]
        }
        let message = `<p>${errors.join("<br>")}</p><p><b>Upload status</b>: ${statusMessage}</p>`

        return templates.message(modalID, title, message)
    },
    uploadFileHtml : (type) => {
        let modalID = "uploadFileModal"
        let title = `Upload a ${type}`

        return templates.upload(modalID, title)
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
    
}
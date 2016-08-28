// Jackrabbitleave at least 2 line with only a star on it below, or doc generation fails
/**
 *
 *
 * Placeholder for custom user javascript
 * mainly to be overridden in profile/static/custom/custom.js
 * This will always be an empty file in IPython
 *
 * User could add any javascript in the `profile/static/custom/custom.js` file
 * (and should create it if it does not exist).
 * It will be executed by the ipython notebook at load time.
 *
 * Same thing with `profile/static/custom/custom.css` to inject custom css into the notebook.
 *
 * Example :
 *
 * Create a custom button in toolbar that execute `%qtconsole` in kernel
 * and hence open a qtconsole attached to the same kernel as the current notebook
 *
 *    $([IPython.events]).on('app_initialized.NotebookApp', function(){
 *        IPython.toolbar.add_buttons_group([
 *            {
 *                 'label'   : 'run qtconsole',
 *                 'icon'    : 'icon-terminal', // select your icon from http://fortawesome.github.io/Font-Awesome/icons
 *                 'callback': function () {
 *                     IPython.notebook.kernel.execute('%qtconsole')
 *                 }
 *            }
 *            // add more button here if needed.
 *            ]);
 *    });
 *
 * Example :
 *
 *  Use `jQuery.getScript(url [, success(script, textStatus, jqXHR)] );`
 *  to load custom script into the notebook.
 *
 *    // to load the metadata ui extension example.
 *    $.getScript('/static/notebook/js/celltoolbarpresets/example.js');
 *    // or
 *    // to load the metadata ui extension to control slideshow mode / reveal js for nbconvert
 *    $.getScript('/static/notebook/js/celltoolbarpresets/slideshow.js');
 *
 *
 * @module IPython
 * @namespace IPython
 * @class customjs
 * @static
 */

// Function taken from http://stackoverflow.com/questions/690781/debugging-scripts-added-via-jquery-getscript-function -- Allows us to load scripts in a way that can be debugged
var loadScript = function (path, callback) {
    var result = $.Deferred(),
    script = document.createElement("script");
    script.async = "async";
    script.type = "text/javascript";
    script.src = path;
    script.onload = script.onreadystatechange = function (_, isAbort) {
	if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            if (isAbort)
		result.reject();
            else
		result.resolve();
	}
    };
    script.onerror = function () { result.reject(); };
    $("head")[0].appendChild(script);
    if(callback)
	result.then( callback );
    return result.promise();
};

// Function taken from http://stackoverflow.com/questions/7083550/jquery-getscript
function loadOrdered(files, callback) {
    loadScript(files.shift(), files.length
	       ? loadOrdered.bind(null, files, callback)
	       : callback
	      );
}

loadOrdered(['/static/custom/three.js', '/static/custom/OrbitControls.js', '/static/custom/render.js']);

var CUSTOMLOADED = true;

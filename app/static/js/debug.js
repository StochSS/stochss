// Function taken from http://stackoverflow.com/questions/690781/debugging-scripts-added-via-jquery-getscript-function -- Allows us to load scripts in a way that can be debugged
/*var loadScript = function (path, callback) {
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

loadOrdered(['/static/js/three.js', '/static/js/OrbitControls.js']);

CUSTOMLOADED = true;*/
function get_default_values(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return null;
}

function set_default_values(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (30*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    var path = window.location.pathname;
    //console.log("setting default value cookie: name="+cname+" value="+cvalue+"  current path="+path);
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path="+path;
}

// Any element with attribute 'save-default-values' will be processed, values will be saved via cookie
function startup_default_values() {
    var default_elements = document.getElementsByTagName('input');
    //console.log("startup_default_values() default_elements.length="+default_elements.length);
    //console.log('document.cookie = '+document.cookie)
    //var default_elements = default_elements1.concat(document.getElementsByTagName('select'));
    for(var i=0;i<default_elements.length; i++){
        if(default_elements[i].getAttribute('save-default-values') == null){ continue; }
        //console.log('Found save-default-values element id='+default_elements[i].id)
        if(default_elements[i].type == 'radio'){
            input_name = default_elements[i].name
            element_id = default_elements[i].id
            set_val = get_default_values("DEFAULT_VALUE::"+input_name);
            if(set_val != null && set_val == element_id){
                default_elements[i].checked = true;
            }
            // use a closure here: https://www.w3schools.com/js/js_function_closures.asp
            default_elements[i].onchange = (function(){ 
                var name = input_name;
                var value = element_id;
                return function(){ set_default_values("DEFAULT_VALUE::"+name, value); }
            })();
        }else{
            input_name = default_elements[i].id
            element_id = default_elements[i].id
            set_val = get_default_values("DEFAULT_VALUE::"+input_name);
            if(set_val != null){
                default_elements[i].value = set_val;
                //console.log("startup_default_values() setting value of "+element_id+" to "+set_val);
            }
            // use a closure here: https://www.w3schools.com/js/js_function_closures.asp
            default_elements[i].onchange = (function(){
                var name = input_name;
                var elem = document.getElementById(element_id);
                if(elem == null){
                     alert("startup_default_values() Error: could not find element '"+element_id+"' on page");
                     return;
                }
                return function(){ set_default_values("DEFAULT_VALUE::"+name, elem.value); }
            })();
            
        }
    }
}


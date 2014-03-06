$('#submit-btn').on('click', function(e) {
  /**
   * Need to check for presence of name, email, password, password_conf.
   * Need to check that the password and password confirmation matches.
   * TODO: SSL or encrypt password before sending to server
  **/
  var formInputs = [$('#name'), $('#email'), $('#password'), $('#password_conf')];
  var invalid = false;
  for (var i = 0; i < 4; i++)
  {
    var formInput = formInputs[i];
    if (formInput.val() == '')
    {
      // All inputs are required
      invalid = true;
      // Use bootstraps form control states, which need to be placed on outer div
      var enclosingDiv = formInput.closest('div.control-group');
      // Only need to add this stuff if its not already there
      if (!enclosingDiv.hasClass('error'))
      {
        var errorMessageHTML = '<span class="help-inline">This field is required.</span>';
        enclosingDiv.addClass('error');
        formInput.after(errorMessageHTML);
      }
    }
    else
    {
      // Need to make sure we remove any errors that we might have placed on it
      var enclosingDiv = formInput.closest('div.control-group');
      if (enclosingDiv.hasClass('error'))
      {
        enclosingDiv.removeClass('error');
        // Here we use the fact that the span.help-inline element will be placed as the next sibling in the DOM
        formInput.next().remove();
      }
    }
  }
  if (invalid) {
    // Dont send the POST
    e.preventDefault();
    return;
  }
  // Now we know all the inputs are filled in with at least one character
  var password = formInputs[2];
  var passwordConfirmation = formInputs[3];
  if (password.val() == passwordConfirmation.val()) {
    console.log('Password match!')
  } else {
    // Password mismatch, need to re-enter
    e.preventDefault();
    // Use bootstraps form control states, which need to be placed on outer div
    var errorMessageHTML = '<span class="help-inline">Password and password confirmation do not match.</span>';
    password.closest('div.control-group').addClass('error');
    passwordConfirmation.closest('div.control-group').addClass('error');
    password.after(errorMessageHTML);
    passwordConfirmation.after(errorMessageHTML);
  }
});
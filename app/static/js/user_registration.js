$('#submit-btn').on('click', function(e) {
  /**
   * Need to check that the password and password confirmation matches
   * TODO: SSL or encrypt password before sending to server
  **/
  var password = $('#password');
  var passwordConfirmation = $('#password_conf');
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
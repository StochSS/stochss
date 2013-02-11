$(document).ready(function() {

  $('#cloud').click(function() {
    runStochKit('cloud');
  });

  $('#local').click(function() {
    runStochKit('local');
  });

  $('#view').click(function() {
    var result_name = $("input[name=result_name]:checked", '#form').val()

    disableButtons();

    $.ajax({
      type: 'GET',
      async: true,
      url: '/result',
      data: {'name':result_name},
      success: function(data) {
        var result = JSON.parse(data);
        if (result['success'] == true) {
          $('#result').text(result['result']);
        } else {
          var reason = "There was a problem getting the results of your job: " +
            result['reason'];
          $('#result').text(reason);
        }
        enableButtons();
      }
    });

  });

}); // end document/ready


function runStochKit(whereToRun) {
  // TODO(cgb): validate these params first, and if they're good...

  // required params
  var model = $("input[name=model_name]:checked", '#form').val()
  var time = $('#time').val();
  var realizations = $('#realizations').val();
  var output = $('#output').val();

  // optional params
  var keep_trajectories = get_checked_for('#keep-trajectories');
  var keep_histograms = get_checked_for('#keep-histograms');
  var label = get_checked_for('#label');
  var seed = $('#seed').val();
  var epsilon = $('#epsilon').val();
  var threshold = $('#threshold').val();

  // TODO(cgb): whereToRun

  var params = {
    'model':model,
    'time':time,
    'realizations':realizations,
    'output':output,
    'keep-trajectories':keep_trajectories,
    'keep-histograms':keep_histograms,
    'label':label,
    'seed':seed,
    'epsilon':epsilon,
    'threshold':threshold,
    'where_to_run':whereToRun
  }

  disableButtons();

  $.ajax({
    type: 'POST',
    async: true,
    url: '/run',
    data: {'parameters':JSON.stringify(params)},
    success: function(data) {
      var result = JSON.parse(data);
      if (result['success'] == true) {
        alert("Job started successfully!");
      } else {
        $('#errors').text("Job was not started successfully.");
      }
      enableButtons();
    }
  });
}


function get_checked_for(id) {
  if ($(id).is(':checked')) {
    return true;
  } else {
    return false;
  }
}


function enableButtons() {
  $('#local').removeAttr('disabled');
  $('#cloud').removeAttr('disabled');
  $('#view').removeAttr('disabled');
}


function disableButtons() {
  $("#local").attr("disabled", "disabled");
  $("#cloud").attr("disabled", "disabled");
  $("#view").attr("disabled", "disabled");
}

var $ = require('jquery');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/workflowStatus.pug');


module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    var localDate = new Date(attrs.startTime)
    console.log(localDate, typeof localDate)
    var localStartTime = this.getFormattedDate(localDate)
    console.log(localStartTime, typeof localStartTime)
    this.startTime = localStartTime;
    this.status = attrs.status;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.status !== 'ready' && this.status !== 'new'){
      this.expandContainer()
    }
    if(this.status !== 'running') {
      $(this.queryByHook('running-spinner')).css('display', "none")
    }
  },
  expandContainer: function () {
    $(this.queryByHook('workflow-status')).collapse('show');
    let collapseBtn = $(this.queryByHook('collapse'))
    collapseBtn.prop('disabled', false);
    collapseBtn.trigger('click')
  },
  changeCollapseButtonText: function (e) {
    let source = e.target.dataset.hook
    let collapseContainer = $(this.queryByHook(source).dataset.target)
    if(!collapseContainer.length || !collapseContainer.attr("class").includes("collapsing")) {
      let collapseBtn = $(this.queryByHook(source))
      let text = collapseBtn.text();
      text === '+' ? collapseBtn.text('-') : collapseBtn.text('+');
    }
  },
  getFormattedDate: function (date) {
    var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
    var month = months[date.getMonth()]; // get the abriviated month
    var year = date.getFullYear();
    var day = date.getDate();
    var hours = date.getHours();
    var ampm = hours >= 12 ? 'PM' : 'AM'; // get AM or PM based on hours
    hours = hours%12; // format hours to 12 hour time format
    hours = hours ? hours : 12; // replace 0 with 12
    var minutes = date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes; // format minutes to always have two chars
    var timeZone = date.toString().split('(').pop().split(')').shift() // get the timezone from the date
    if(timeZone.includes(" ")){
      tzparts = timeZone.split(" ")
      tzparts = tzparts.map(function (element) {
        return element.charAt(0)
      })
      timeZone = tzparts.join("")
    }
    // timeZone = timeZone.replace('(', '').replace(')', '') // remove the '()' from the timezone
    return  month + " " + day + ", " + year + "  " + hours + ":" + minutes + " " + ampm + " " + timeZone;
  },
});
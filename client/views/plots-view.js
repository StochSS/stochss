var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
//support files
var Plotly = require('../lib/plotly');
var app = require('../app');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/plotsView.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-plot]' : 'changeCollapseButtonText',
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments)
    this.path = attrs.path ? attrs.path : this.parent.model.path
    this.heading = attrs.heading ? attrs.heading + " - " + this.model.key : this.model.key
  },
  render: function (attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.getPlot()
  },
  getPlot: function () {
    var self = this;
    var plotArgs = {"title":this.model.title,"xaxis":this.model.xaxis,"yaxis":this.model.yaxis}
    var data = {"plt_key":this.model.key, "plt_data":plotArgs, "plt_species":this.model.species}
    var endpoint = path.join(app.getApiPath(), 'workflow/plot-results')+"?path="+this.path+"&data="+JSON.stringify(data);
    xhr({uri: endpoint, json: true}, function (err, response, body) {
      if(response.statusCode >= 400) {
        $(self.queryByHook(self.model.key+self.model.stamp)).html(body.Message)
      }else{
        self.plotFigure(body)
      }
    });
  },
  plotFigure: function (figure) {
    var self = this;
    var el = this.queryByHook(this.model.key+this.model.stamp);
    figure['config']['staticPlot'] = true
    // figure['config']['modeBarButtonsToRemove'] = ["toggleSpikelines", "toImage", "sendDataToCloud", "autoScale2d"]
    Plotly.newPlot(el, figure);
    el.on('plotly_legendclick', function () {return false})
    el.on('plotly_legenddoubleclick', function () {return false})
  },
  changeCollapseButtonText: function (e) {
    var source = e.target.dataset.hook;
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  }
})
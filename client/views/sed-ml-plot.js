var $ = require('jquery');
var path = require('path');
var xhr = require('xhr');
//support files
var Plotly = require('../lib/plotly');
var app = require('../app');
//views
var View = require('ampersand-view');
//templates
var template = require('../templates/includes/sedMLPlot.pug');

module.exports = View.extend({
  template: template,
  events: {
    'click [data-hook=collapse-sedml-plot]' : 'changeCollapseButtonText',
    'click [data-hook=sedml-plot]' : function (e) {
      $(this.parent.queryByHook("edit-plot-args")).collapse("show");
      var offset = this.parent.queryByHook("edit-plot-args").offsetTop
      window.scroll(0, offset+350)
    },
    'click [data-hook=sedml-download-png-custom]' : function (e) {
      var type = e.target.id;
      this.parent.clickDownloadPNGButton(type)
    },
    'click [data-hook=sedml-download-json]' : function (e) {
      var type = e.target.id;
      this.parent.exportToJsonFile(this.parent.plots[type], type)
    },
  },
  initialize: function(attrs, options) {
    View.prototype.initialize.apply(this, arguments)
  },
  render: function(attrs, options) {
    View.prototype.render.apply(this, arguments)
    this.getPlot(this.model.name)
  },
  update: function() {
  },
  updateValid: function() {
  },
  changeCollapseButtonText: function (e) {
    var source = e.target.dataset.hook
    var text = $(this.queryByHook(source)).text();
    text === '+' ? $(this.queryByHook(source)).text('-') : $(this.queryByHook(source)).text('+');
  },
  getPlot: function (type) {
    var self = this;
    var el = this.queryByHook(type)
    Plotly.purge(el)
    var data = {}
    data['plt_key'] = type;
    if(Object.keys(this.parent.plotArgs).length){
      data['plt_data'] = this.parent.plotArgs
    }else{
      data['plt_data'] = "None"
    }
    var endpoint = path.join(app.getApiPath(), "workflow/plot-results")+"?path="+this.parent.parent.wkflPath+"&data="+JSON.stringify(data);
    xhr({url: endpoint, json: true}, function (err, response, body){
      if(response.statusCode >= 400){
        $(self.queryByHook(type)).html(body.Message)
      }else{
        self.parent.plots[type] = body
        self.plotFigure(body, type);
      }
    });
  },
  plotFigure: function (figure, type) {
    var self = this;
    var el = this.queryByHook(type)
    Plotly.newPlot(el, figure)
    this.queryAll("#" + type).forEach(function (el) {
      if(el.disabled){
        el.disabled = false;
      }
    });
  },
});
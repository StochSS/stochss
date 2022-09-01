/*
StochSS is a platform for simulating biochemical systems
Copyright (C) 2019-2022 StochSS developers.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

module.exports = View.extend({
  template: template,
  events: {
  },
  initialize: function (attrs, options) {
    View.prototype.initialize.apply(this, arguments);
    this.readOnly = attrs.readOnly ? attrs.readOnly : false;
    this.tooltips = Tooltips.simulationSettings;
    this.algorithm = this.model.isAutomatic ? "The algorithm was chosen based on your model." : this.model.algorithm;
  },
  render: function () {
    View.prototype.render.apply(this, arguments);
    if(this.readOnly) {
      $(this.queryByHook(this.model.elementID + '-sim-settings-edit-tab')).addClass("disabled");
      $(".nav .disabled>a").on("click", function(e) {
        e.preventDefault();
        return false;
      });
      $(this.queryByHook(this.model.elementID + '-sim-settings-view-tab')).tab('show');
      $(this.queryByHook(this.model.elementID + '-edit-sim-settings')).removeClass('active');
      $(this.queryByHook(this.model.elementID + '-view-sim-settings')).addClass('active');
    }else {
      app.tooltipSetup();
    }
    this.updateViewer();
  },
  updateViewer: function () {
  }
});
/**
 * Created by gkarak on 22/12/2016.
 */

angular
  .module('gaDashboardGraphChart')
  .component('gaDashboardGraphChart', {
    templateUrl: 'ng-gentelella/gentelella/ga-dashboard-graph-chart/ga-dashboard-graph-chart.template.html',
    bindings: {
      graphTitle: '@',
      graphSubTitle: '@',
      graphHeading: '@',
      graphId: '@',
      graphType: '@',
      graphMaxValues: '@',
      graphMaxEllipsis: '@',
      graphColours: '<',
      graphData: '<'
    },
    transclude: true,
    controller: [
      function GaGraphChartController() {
        var self = this;

        // helper function to convert hex/rgb colour to rgba
        var rgba = function (colour, a) {
          // first check if colour is rgb
          var rgb = /^rgb\(([0-9]*),\s?([0-9]*),\s?([0-9]*)\)$/.exec(colour);
          // or check if it is hex
          if (!rgb) rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colour);
          if (!rgb) return colour;
          for (var i = 0; i <= 3; i++) {
            rgb[i] = parseInt(rgb[i], 16);
          }
          return 'rgba(' + rgb[1] + ', ' + rgb[2] + ', ' + rgb[3] + ', ' + a + ')';
        };

        // Initialise
        self.$onInit = function () {
          if (!self.graphColours) self.graphColours = ['#3498DB', '#26B99A', '#9B59B6', '#BDC3C7', '#E74C3C'];
          self.graphHoverColours = [];
          for (var i = 0; i < self.graphColours.length; i++) {
            self.graphHoverColours.push(rgba(self.graphColours[i], 0.8))
          }
        };

        // Reset plotted
        self.onChanges = function () {
          self.plotted = false;
        };

        // The only suitable event, because the id in template is set
        // after any other event including onChanges
        // This is why we call plot only once with self.plotted
        self.$doCheck = function () {
          var canvas = $('.' + self.graphId);
          if (self.plotted || !self.graphData || !canvas.length) return;

          // Transform data
          var labels = [];
          var data = [];
          var maxValues = parseInt(self.graphMaxValues) || 1;

          for (var i = 0; i < self.graphData.length; i++) {
            var item = self.graphData[i];
            if (i < maxValues || maxValues <= 0) {
              if (!item.label) item.label = '?';
              labels.push(item.label);
              data.push(item.value);
            }
            else {
              labels[maxValues - 1] = self.graphMaxEllipsis || 'All other';
              data[maxValues - 1] += item.value;
            }
          }

          new Chart(canvas[0], {
            type: self.graphType,
            tooltipFillColor: 'rgba(51, 51, 51, 0.55)',
            data: {
              labels: labels,
              datasets: [{
                data: data,
                backgroundColor: self.graphColours,
                hoverBackgroundColor: self.graphHoverColours
              }]
            },
            options: {
              legend: false,
              responsive: false
            }
          });
          self.plotted = true;
        }
      }
    ]
  });

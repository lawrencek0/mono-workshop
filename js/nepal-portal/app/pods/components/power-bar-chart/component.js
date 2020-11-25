import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce("afterRender", function() {
      var chart;
      chart = c3.generate({
        bindto: "#power-bar-chart",
        data: {
          columns: [
            ['Power Consumption', 1292, 1500, 1589, 1844],
            ['Power Generation', 762, 327, 1583, 542]
          ],
          type: 'bar'
        },
        zoom: {
          enabled: true
        },
        axis: {
          y: {
            label: {
              text: 'in MW',
              position: 'outer-middle'
            }
          },
          x: {
            show: false
          }
        }
      });
    });
  }
});

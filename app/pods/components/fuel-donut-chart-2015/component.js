import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce("afterRender", function () {
      var chart;
      chart = c3.generate({
        bindto: '#fuel-donut-chart-2015',
        data: {
          columns: [
            ['Kerosene', 1350],
            ['Traditional Fuel: Wood (Rural)', 780],
            ['Liquefied Petroleum Gas (LPG)', 990],
            ['Electric Hotplates', 960],
            ['Biogas', 1120]
          ],
          type: 'donut'
        },
        donut: {
          label: {
            format: function (value) {
              return (value);
            }
          }
        }
      });

    });
  }
});

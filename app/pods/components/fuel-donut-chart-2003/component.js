import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce("afterRender", function () {
      var chart;
      chart = c3.generate({
        bindto: '#fuel-donut-chart-2003',
        data: {
          columns: [
            ['Kerosene', 340],
            ['Traditional Fuel: Wood (Rural)', 400],
            ['Liquefied Petroleum Gas (LPG)', 510],
            ['Electric Hotplates', 790],
            ['Biogas', 320]
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

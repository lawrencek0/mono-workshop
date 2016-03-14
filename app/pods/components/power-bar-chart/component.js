import Ember from 'ember';

export default Ember.Component.extend({
  data: {
    columns: [
      ['Power Consumption', 1292, 1500, 1589, 1844],
      ['Power Generation', 762, 327, 1583, 542]
    ],
    type: 'bar'
  },
  axis: {
    y: {
      label: {
        text: 'in MW',
        position: 'outer-middle'
      }
    },
    x: {
      show: false // ADD
    }
  },
  bar: {
    title: "I will give one soon"
  }
});

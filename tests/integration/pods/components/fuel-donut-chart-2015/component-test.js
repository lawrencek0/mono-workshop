import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('fuel-donut-chart-2015', 'Integration | Component | fuel donut chart 2015', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{fuel-donut-chart-2015}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#fuel-donut-chart-2015}}
      template block text
    {{/fuel-donut-chart-2015}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

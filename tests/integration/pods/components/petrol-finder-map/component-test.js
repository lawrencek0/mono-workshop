import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('petrol-finder-map', 'Integration | Component | petrol finder map', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{petrol-finder-map}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#petrol-finder-map}}
      template block text
    {{/petrol-finder-map}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

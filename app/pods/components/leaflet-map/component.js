import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', function () {
      L.mapbox.accessToken = 'pk.eyJ1IjoibGtoYWRrYSIsImEiOiJjaWxzdTFlZ3MwMDdodTlrcjR6N3lwdTFtIn0._4d4rk09nzc6A-6MAY26Ew';
      var map = L.mapbox.map('map', 'mapbox.streets')
        .setView([40, -74.50], 9);
    });
  }
});

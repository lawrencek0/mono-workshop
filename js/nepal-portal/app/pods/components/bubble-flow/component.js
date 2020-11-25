import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', function() {
      var $ = Ember.$;
      $("div#bubble-flow").html("<hr/><svg id='bubble' xmlns='http://www.w3.org/2000/svg' width='100%' height= '200px'></svg><hr/>");
      var svg = d3.select('svg');
      var w = $("svg").parent().width();
      var h = 200;
      var circle = svg.selectAll("circle")
        .data(d3.range(70).map(function(datum,interval) {
          return {
            x: interval*30,
            y: 0,
            dx: 3,
            dy: -3 * (Math.random()+1),
            mu: Math.random()*2
          };
        }))
        .enter().append("svg:circle")
        .attr("r", 4)
        .attr("fill","SkyBlue");

      d3.timer(function()
      {
        circle.attr("cx", function(d) {
          d.x += Math.random()*4*Math.sin(Math.random()*4*d.x + Math.random()*10);
          if (d.x > w) {
            d.x -= w;
          } else if (d.x < 0) {
            d.x += w;
            return d.x;
          } else {
            return d.x;
          }
        })
          .attr("cy", function(d) {
            d.y += d.dy ;
            if (d.y > h) {
              d.y -= h;
            } else if (d.y < 0) {
              d.y += h;
              return d.y;
            } else {
              return d.y;
            }})
          .attr("r",function(d)
          {
            return (d.y < 100) ? d3.select(this).attr("r") : d.mu*500/d.y;
          });
      });

    });
  }
});

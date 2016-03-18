import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    Ember.run.scheduleOnce('afterRender', function(){
      var w = 1000;
      var h = 500;
      var colors = d3.scale.category20();
      var svg = d3.select("#vis")
        .append("svg")
        .attr('width', '100%')
        .attr('height', '100%')
        .attr("viewBox", "0 0 " + w + " " + h )
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("pointer-events", "all")
        .call(d3.behavior.zoom().on("zoom", redraw))
        .append('g');
      function redraw() {
        svg.attr("transform",
          "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
      }
      var dataset = {
        nodes: [
          { name: 'Lawrence'},
          { name: 'Ishan'},
          { name: 'Sugam'},
          { name: 'Bipin'},
          { name: 'Dipankar'},
          { name: 'Lawrisha'},
          { name: 'Pawan'},
          { name: 'Jagdish'},
          { name: 'Shraddha'},
          { name: 'Sarad'},
          { name: 'Milan'},
          { name: 'Amrita'},
          { name: 'Punti'},
          { name: 'Gaurab'},
          { name: 'Abhisekh'},
          { name: 'Jay Dev'}
        ],
        edges: [
          { source: 0, target: 1},
          { source: 0, target: 2},
          { source: 0, target: 3},
          { source: 0, target: 4},
          { source: 1, target: 4},
          { source: 2, target: 7},
          { source: 3, target: 9},
          { source: 3, target: 10},
          { source: 7, target: 11},
          { source: 14, target: 12},
          { source: 7, target: 14},
          { source: 5, target: 15},
          { source: 8, target: 6},
          { source: 8, target: 10},
          { source: 10, target: 5},
          { source: 11, target: 13}
        ]
      };
      var force = d3.layout.force()
        .nodes(dataset.nodes)
        .links(dataset.edges)
        .size([w, h])
        .linkDistance([100])
        .charge([-150])
        .start();
      var edges = svg.selectAll("line")
        .data(dataset.edges)
        .enter()
        .append("line")
        .style("stroke", "#ccc")
        .style("stroke-width", 1);
      var drag = force.drag()
        .on("dragstart", function() {
          d3.event.sourceEvent.stopPropagation();
        });
      var nodes = svg.selectAll(".node")
        .data(dataset.nodes)
        .enter()
        .append("g")
        .attr("class","node")
        .call(drag);
      var circle = nodes.append("circle")
        .attr("r", 12)
        .style("fill", function(d, i) {
          return colors(i);
        });
       var label = nodes.append("text")
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });
      force.on("tick", function() {
        edges
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
        circle
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
        nodes
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y;});
        label
          .attr("x", function(d) { return d.x + 8; })
          .attr("y", function(d) { return d.y; });
      });
    });
  }
});

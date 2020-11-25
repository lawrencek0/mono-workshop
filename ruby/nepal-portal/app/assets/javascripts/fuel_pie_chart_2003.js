var w = 300;
var h = 300;
var dataset = [790, 510, 400, 340, 320];
var outerRadius = w / 2;
var innerRadius = w/4;
var arc = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);
var pie = d3.layout.pie();
var color = d3.scale.category20();
var svg = d3.select("#pie1")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("viewBox", "0 0 " + w + " " + h )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("pointer-events", "all");
var arcs = svg.selectAll("g.arc")
    .data(pie(dataset))
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")")
    .on("mouseover", function (d) {
        d3.select("#tooltip2")
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY + "px")
            .style("display", "block")
            .select("#value")
            .text(d.value);
    })
    .on("mouseout", function () {
        d3.select("#tooltip2")
            .style("display", "none");
    });
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i);
    })
    .attr("d", arc);
arcs.append("text")
    .attr("transform", function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.value;
    });
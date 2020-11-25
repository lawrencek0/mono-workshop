var w = 300;
var h = 150;
var barGap = 2;
var dataset = [762, 1292, 327, 1500, 1583, 1589, 542, 1844];
var xScale = d3.scale.ordinal()
    .domain(d3.range(dataset.length))
    .rangeRoundBands([0,w], 0.05);
var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset)])
    .range([0, h]);
var colors = d3.scale.category20();
var svg =d3.select("#viz")
    .append("svg")
    .attr("width", '100%')
    .attr("height", '100%')
    .attr("viewBox", "0 0 " + w + " " + h )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("pointer-events", "all");
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("fill", function(d, i) {
        return colors(i);
    })
    .attr("x", function(d,i) { return xScale(i); })
    .attr("y", function(d) { return h - yScale(d); })
    .attr("width", w / dataset.length - barGap)
    .attr("height", function(d) { return d })
    .on("mouseover", function(d) {
        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand() / 2;
        var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;
        d3.select("#tooltip1")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#value")
            .text(d);
        d3.select("#tooltip1").classed("hidden", false);
    })
    .on("mouseout", function() {
        d3.select("#tooltip1").classed("hidden", true);
    });
svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d + "MW";
    })
    .attr("text-anchor", "middle")
    .attr("x", function(d, i) {
        return xScale(i) + xScale.rangeBand() / 2;
    })
    .attr("y", function(d) {
        return h - yScale(d) + 13;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "8px")
    .attr("fill", "#4D4343");
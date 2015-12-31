var app = angular.module('nepal');
app.directive('petrolFinder', function() {
    function link(scope) {
        var map = L.map('map_20151106').setView([27.7005574, 85.3497986], 11);
        var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink,
            maxZoom: 18
        }).addTo(map);
        map._initPathRoot();
        var svg = d3.select("#map_20151106").select("svg");
        var g = svg.append("g");
        d3.json('data_20151106.json', function (collection) {
            collection.objects.forEach(function(d){
                d.LatLng = new L.LatLng(d.circle.coordinates[0],
                    d.circle.coordinates[1])
            });
            var feature = g.selectAll("circle")
                .data(collection.objects)
                .enter()
                .append("circle")
                .style("stroke","black")
                .style("fill", "#90C3D4")
                .attr('fill-opacity', 1)
                .attr('class', 'circles')
                .on("mouseover", function(){
                    d3.select(this).transition().attr('r', 18)
                })
                .on("click", function(d) {
                    window.open(d.url,'_blank');
                })
                .on("mouseout", function() {
                    d3.select(this).transition().attr('r', 10).attr('fill', '#90C3D4')
                })
                .attr("r", 10);

            map.on("viewreset", update);
            update();

            function update() {
                feature.attr("transform",
                    function(d) {
                        return "translate("+
                            map.latLngToLayerPoint(d.LatLng).x +","+
                            map.latLngToLayerPoint(d.LatLng).y +")";
                    }
                )
            }
        });
    }
    return {
        link: link,
        restrict: 'E'
    }
});

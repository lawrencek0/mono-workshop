var app =angular.module('nepal');
app.directive('costPieChartOne', function() {
    function link(scope) {
        var pie = new d3pie("pieChart", {
            "header": {
                "title": {
                    "text": "Average Monthly Spending of Every Household of 5 to Cook in 2003",
                    "fontSize": 22,
                    "font": "cinzel"
                },
                "subtitle": {
                    "text": "In Nepali Rupee",
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "open sans"
                },
                "titleSubtitlePadding": 12
            },
            "footer": {
                "text": "Source: Amrit M Nakarmi, Professor, Tribhuvan University",
                "color": "#999999",
                "fontSize": 11,
                "font": "open sans",
                "location": "bottom-center"
            },
            "size": {
                "canvasHeight": 400,
                "canvasWidth": 650,
                "pieInnerRadius": "50%",
                "pieOuterRadius": "93%"
            },
            "data": {
                "sortOrder": "random",
                "content": [
                    {
                        "label": "Kerosene",
                        "value": 340,
                        "color": "#0066cc"
                    },
                    {
                        "label": "Liquefied Petroleum Gas (LPG) ",
                        "value": 510,
                        "color": "#003366"
                    },
                    {
                        "label": "Electric Hotplates",
                        "value": 790,
                        "color": "#336600"
                    },
                    {
                        "label": "Biogas",
                        "value": 320,
                        "color": "#669966"
                    },
                    {
                        "label": "Traditional Fuel: Wood (Rural)",
                        "value": 400,
                        "color": "#990000"
                    }
                ]
            },
            "labels": {
                "outer": {
                    "pieDistance": 32
                },
                "inner": {
                    "format": "value"
                },
                "mainLabel": {
                    "font": "verdana"
                },
                "percentage": {
                    "color": "#e1e1e1",
                    "font": "verdana",
                    "decimalPlaces": 0
                },
                "value": {
                    "color": "#e1e1e1",
                    "font": "verdana"
                },
                "lines": {
                    "enabled": true,
                    "color": "#cccccc"
                },
                "truncation": {
                    "enabled": true
                }
            },
            "tooltips": {
                "enabled": true,
                "type": "placeholder",
                "string": "{label}: NRS {value}",
                "styles": {
                    "fadeInSpeed": 73
                }
            },
            "effects": {
                "pullOutSegmentOnClick": {
                    "effect": "linear",
                    "speed": 400,
                    "size": 8
                }
            }
        });
    }
    return {
    link: link,
    restrict: 'A'
    }
});
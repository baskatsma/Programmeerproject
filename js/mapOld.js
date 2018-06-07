/*
 *  mapOld.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: http://blog.robertjesionek.com/d3js-geo/

// Define global variables, dimensions and settings
var width = 770;
var height = 580;
var center = [16, 71.4];
var scale = 500;
var titleMargin = 85;

// Define scale colors
var lowColor = "#cccccc";
var highColor = "#993333";

// Set-up scale values
var minVal = 0;
var maxVal = 15000000;
var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);

// Creates a projection
var projection = d3.geoMercator()
    .scale(scale)
    .translate([width / 2.1, 0])
    .center(center);

// Initializes the path generator
var path = d3.geoPath()
    .projection(projection);

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Load a default map
    var selectedYear = "2016";
    makeMap(selectedYear);

    // Add an event listener for the year selector button
    $('.dropdown-item').on('click', function(event) {
        var selectedYear = $(this).text();
        console.log(selectedYear);
        makeMap(selectedYear);
    });

});

function makeMap(selectedYear) {

    d3.json("data/nrg_100a_Simplified_energy_balances_TJ.json", function(error, energyUsage) {

        // Log any errors
        if (error) throw error;

        // Extract the EUROSTAT data
        data = {};
        year = selectedYear;
        energyUsage.forEach(function(d) {
            data[d.GEO] = d[year];
        });

        d3.json("data/europe.json", function(error, europe) {

            // Log any errors
            if (error) throw error;

            // Append measurements to the map
            var svg = d3.select("#mapDiv")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g");

            // Initialize map tooltip
            var mapTip = d3.tip()
                .attr("class", "d3-tip")
                .attr("id", "mapTooltip")
                .offset([-5, 0])
                .html(function(d) {
                    var formatThousand = d3.format(",");
                    return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + formatThousand(data[d.id]);
                });

            svg.call(mapTip);

            // Append countries to the map using topoJSON
            svg.selectAll(".country")
                .data(topojson.feature(europe, europe.objects.europe).features)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d", path)
                .style("fill",function(d){
                    var value = data[d.id];

                    if (isNaN(value)){
                      return "slategrey";
                    }

                    return ramp(value);
                })
                .on("mouseover", mapTip.show)
                .on("mouseout", mapTip.hide);

            // Add a title
            svg.append("text")
                .attr("x", 0)
                .attr("y", titleMargin)
                .attr("text-anchor", "left")
                .text(year);

        });


    });

}

/*
 *  map.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: http://blog.robertjesionek.com/d3js-geo/

// Define global variables, dimensions and settings
var formatThousand = d3.format(",")

var europe;
var energyUsage;

var mapWidth = 770;
var mapHeight = 580;
var center = [16, 71.4];
var scale = 450;
var titleMargin = 85;

// Creates a projection
var projection = d3.geoMercator()
    .scale(scale)
    .translate([mapWidth / 2.1, 0])
    .center(center);

// Initializes the path generator
var path = d3.geoPath()
    .projection(projection);

// Initialize map tooltip
var mapTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "mapTooltip")
    .offset([-5, 0]);

// Set default map
var mapSelectedYear = "2016";

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    console.log("DOMContentLoaded");

    // // Add an event listener for the year selector button
    // $(".dropdown-item").on("click", function(event) {
    //     mapSelectedYear = $(this).text();
    //     updateMap(mapSelectedYear);
    // });

    // Load default map
    makeMap(mapSelectedYear);

    // $( "#interactiveButton" ).hide();
    // $( "#mapDiv" ).hide();

});

window.onload = function() {

    // $( "#mapDiv" ).fadeIn(800);
    console.log("window.onload");
    // $( "#interactiveButton" ).fadeIn(1300);
}

function makeMap(mapSelectedYear) {

    d3.json("data/nrg_100a_Simplified_energy_balances_TJ.json", function(error, energyUsageData) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;
        energyUsage = energyUsageData;

        // Extract the EUROSTAT data
        data = {};
        year = mapSelectedYear;
        energyUsage.forEach(function(d) {
            data[d.GEO] = d[year];
        });

        d3.json("data/europe.json", function(error, europeData) {

            // Log any errors, and save file for usage outside of this function
            if (error) throw error;
            europe = europeData;

            // Update map tooltip
            mapTip.html(function(d) {
                return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + formatThousand(data[d.id]);
            });

            // Append measurements to the map
            var map = d3.select(".map")
                .append("svg")
                .attr("height", mapHeight)
                .attr("width", mapWidth)
                .append("g");

            // Call map tooltip
            map.call(mapTip);

            // Append countries to the map using topoJSON
            appendCountries(map, mapTip);

            // Add a title
            addTitle(map);

            // Set-up color scale for legend
            var colorScale = d3.scaleQuantize()
                .range(colorbrewer.YlOrRd[6])
                .domain([0, 15]);

            var colorLegend = d3.legendColor()
              .labelFormat(formatThousand)
              .scale(colorScale)
              .shapePadding(0)
              .shapeHeight(6)
              .shapeWidth(90)
              .orient("horizontal");

            map.append("g")
              .attr("transform", "translate(80, 553)")
              .call(colorLegend);

            // Add a description to the legend
            var distance = 560;
            map.append("text")
                .attr("x", 0)
                .attr("y", distance)
                .attr("text-anchor", "left")
                .attr("class", "legendText")
                .text("In millions");

        });

    });

}
//
// function updateMap(mapSelectedYear) {
//
//     // Select the current map
//     var map = d3.select(".map").select("svg").select("g");
//
//     // Remove all paths
//     d3.select("g")
//         .selectAll("path")
//         .remove();
//
//     // Remove title
//     d3.select("text")
//         .remove();
//
//     // Select new parts of the EUROSTAT data
//     data = {};
//     year = mapSelectedYear;
//     energyUsage.forEach(function(d) {
//         data[d.GEO] = d[year];
//     });
//
//     // Update and call map tooltip
//     mapTip.html(function(d) {
//             var formatThousand = d3.format(",");
//             return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + formatThousand(data[d.id]);
//         });
//
//     map.call(mapTip);
//
//     // Append countries to the map using topoJSON
//     appendCountries(map, mapTip);
//
//     // Add a title
//     addTitle(map);
//
// }

function addTitle(map) {

    // Add a title
    map.append("text")
        .attr("x", 0)
        .attr("y", titleMargin)
        .attr("text-anchor", "left")
        .attr("class", "titleText")
        .text(year);
}

function appendCountries(map, mapTip) {

    // Set-up color scale
    var colorScale = d3.scaleQuantize()
        .range(colorbrewer.YlOrRd[9])
        .domain([0, 15000000]);

    // Append countries to the map using topoJSON
    countries = map.selectAll(".country")
        .data(topojson.feature(europe, europe.objects.europe).features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)

        // Color-code countries based on their energy consumption
        .style("fill", function(d) {
            var value = data[d.id];

            if (isNaN(value)){
              return "slategrey";
            }

            return colorScale(value);
        })

        // Add d3-tip functionality
        .on("mouseover", mapTip.show)
        .on("mouseout", mapTip.hide);

}

/*
 *  map.js
 *
 *  Name: Bas Katsma
 *  Student 10787690
 *
 */

// Inspired by: http://blog.robertjesionek.com/d3js-geo/

// Define global variables, dimensions and settings
var europe;
var energyUsage;

var width = 770;
var height = 580;
var center = [16, 71.4];
var scale = 500;
var titleMargin = 85;

// Set-up color
var colorSwitch;

// Creates a projection
var projection = d3.geoMercator()
    .scale(scale)
    .translate([width / 2.1, 0])
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
var selectedYear = "2016";

// Execute main code after loading the DOM
document.addEventListener("DOMContentLoaded", function() {

    // Add an event listener for the year selector button
    $('.dropdown-item').on('click', function(event) {
        selectedYear = $(this).text();
        console.log(selectedYear);
        updateMap(selectedYear);
    });

    // Load default map
    makeMap(selectedYear);

});

function makeMap(selectedYear) {

    d3.json("data/nrg_100a_Simplified_energy_balances_TJ.json", function(error, energyUsageData) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;
        energyUsage = energyUsageData;

        // Extract the EUROSTAT data
        data = {};
        year = selectedYear;
        energyUsage.forEach(function(d) {
            data[d.GEO] = d[year];
        });

        d3.json("data/europe.json", function(error, europeData) {

            // Log any errors, and save file for usage outside of this function
            if (error) throw error;
            europe = europeData;

            // Update map tooltip
            mapTip.html(function(d) {
                    var formatThousand = d3.format(",");
                    return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + formatThousand(data[d.id]);
                });

            // Append measurements to the map
            var map = d3.select(".map")
                .append("svg")
                .attr("height", height)
                .attr("width", width)
                .append("g");

            // Call map tooltip
            map.call(mapTip);

            // Append countries to the map using topoJSON
            appendCountries(map, mapTip);

            // Add a title
            addTitle(map);

        });


    });

}

function updateMap(selectedYear) {

    // Select the current map
    var map = d3.select(".map").select("svg").select("g");

    // Remove all paths
    d3.select("g")
        .selectAll("path")
        .remove();

    // Remove title
    d3.select("text")
        .remove();

    // Select new parts of the EUROSTAT data
    data = {};
    year = selectedYear;
    energyUsage.forEach(function(d) {
        data[d.GEO] = d[year];
    });

    // Update and call map tooltip
    mapTip.html(function(d) {
            var formatThousand = d3.format(",");
            return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + formatThousand(data[d.id]);
        });

    map.call(mapTip);

    // Append countries to the map using topoJSON
    appendCountries(map, mapTip);

    // Add a title
    addTitle(map);

}

function addTitle(map) {

    // Add a title
    map.append("text")
        .attr("x", 0)
        .attr("y", titleMargin)
        .attr("text-anchor", "left")
        .text(year);
}

function appendCountries(map, mapTip) {

    if (selectedYear == "2008") {
        colorSwitch = colorbrewer.YlOrRd[9]
    }

    if (selectedYear == "2010") {
        colorSwitch = colorbrewer.BuGn[9]
    }

    if (selectedYear == "2012") {
        colorSwitch = colorbrewer.PuRd[9]
    }

    if (selectedYear == "2014") {
        colorSwitch = colorbrewer.PuBu[9]
    }

    if (selectedYear == "2016") {
        colorSwitch = colorbrewer.YlGnBu[9]
    }

    console.log(selectedYear, colorSwitch);

    var colorScale = d3.scaleQuantize()
        .range(colorSwitch)
        .domain([0, 15000000]);

    // Append countries to the map using topoJSON
    countries = map.selectAll(".country")
        .data(topojson.feature(europe, europe.objects.europe).features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path)

        // Color-code countries based on their energy consumption
        .style("fill",function(d){
            var value = data[d.id];

            if (isNaN(value)){
              return "slategrey";
            }

            return colorScale(value);
        })
        .on("mouseover", mapTip.show)
        .on("mouseout", mapTip.hide);
}

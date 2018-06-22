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

var mapWidth = 625;
var mapHeight = 565;
var mapCenter = [16, 71.4];
var mapScale = 455;
var mapTitleMargin = 90;

// Creates a projection
var projection = d3.geoMercator()
    .scale(mapScale)
    .translate([mapWidth / 2.1, 0])
    .center(mapCenter);

// Initializes the path generator
var path = d3.geoPath()
    .projection(projection);

// Initialize map tooltip
var mapTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "mapTooltip")
    .offset([-5, 0]);

function makeMap(mapSelectedYear) {

    d3.json("../data/nrg_100a_Simplified_energy_balances_TJ.json", function(error, energyUsageData) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        energyUsage = energyUsageData;

        // Extract the EUROSTAT data
        storeData = {};
        mapYear = mapSelectedYear;
        energyUsage.forEach(function(d) {
            d[mapYear] = +d[mapYear];
            storeData[d.GEO] = d[mapYear];
        });

        d3.json("../data/europe.json", function(error, europeData) {

            // Log any errors, and save file for usage outside of this function
            if (error) throw error;
            europe = europeData;

            // Update map tooltip
            mapTip.html(function(d) {
                let mapTooltipText = formatThousand(storeData[d.id]);
                if (typeof storeData[d.id] != "number") {
                    mapTooltipText = "unknown";
                }
                return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + mapTooltipText;
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
            var colorScaleMap = d3.scaleQuantize()
                .range(colorbrewer.YlOrRd[6])
                .domain([0, 15]);

            var colorLegend = d3.legendColor()
              .labelFormat(formatThousand)
              .scale(colorScaleMap)
              .shapePadding(0)
              .shapeHeight(6)
              .shapeWidth(90)
              .orient("horizontal");

            // Position the legend and add it to the map
            var xDistance = 548;
            map.append("g")
              .attr("transform", "translate(80," + (xDistance - 7) + ")")
              .call(colorLegend);

            // Add a description to the legend
            map.append("text")
                .attr("x", 0)
                .attr("y", xDistance)
                .attr("text-anchor", "left")
                .attr("class", "legendText")
                .text("In millions");
        });
    });
}

function addTitle(map) {

    // Add a title
    map.append("text")
        .attr("x", 0)
        .attr("y", mapTitleMargin)
        .attr("text-anchor", "left")
        .attr("class", "titleText")
        .text(mapYear);
}

function appendCountries(map, mapTip) {

    // Set-up color scale
    var colorScaleMap = d3.scaleQuantize()
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
            var value = storeData[d.id];

            if (isNaN(value)){
              return "slategrey";
            }

            return colorScaleMap(value);
        })

        // Add d3-tip functionality
        .on("mouseover", mapTip.show)
        .on("mouseout", mapTip.hide)
        .on("click", function(d) {
            var mapSelectedCountry = d.id;
            updateLines(lineSelectedSector, mapSelectedCountry);
        });

}

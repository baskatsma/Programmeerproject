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

var mapCenter = [11, 71.2];
var mapTitleMargin = 90;
var mapMargin = {top: 0, right: 0, bottom: 0, left: 30};

// Creates a projection
var projection = d3.geoMercator()
    .center(mapCenter);

// Initializes the path generator
var path = d3.geoPath();

var map;

// Initialize map tooltip
var mapTip = d3.tip()
    .attr("class", "d3-tip")
    .attr("id", "mapTooltip")
    .offset([-5, 0]);

var colorScaleMap = d3.scaleQuantize();

function makeMap(mapSelectedYear) {

    // Update chart based on screen width/height
    mapWidth = w * 0.475;
    mapHeight = h * 0.745;
    mapScale = 0.785 * mapHeight;

    projection
      .scale(mapScale)
      .translate([mapWidth / 2.1, 0]);

    path
      .projection(projection);

    d3.json("../data/nrg_100a_Simplified_energy_balances_TJ.json", function(error, energyUsageData) {

        // Log any errors, and save results for usage outside of this function
        if (error) throw error;

        energyUsage = energyUsageData;

        // Extract the EUROSTAT data
        storeData = {};
        mapYear = mapSelectedYear;
        energyUsage.forEach(function(d) {
            storeData[d.GEO] = +d[mapYear];
        });

        d3.json("../data/europe.json", function(error, europeData) {

            // Log any errors, and save file for usage outside of this function
            if (error) throw error;
            europe = europeData;

            // Update map tooltip
            mapTip.html(function(d) {
                let mapTooltipText = formatThousand(storeData[d.id]);

                // If the country has no valid values, report unknown
                if (!isNumber(storeData[d.id])) {
                    mapTooltipText = "unknown";
                }

                return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + mapTooltipText;
            });

            // Append measurements to the map
            map = d3.select(".map")
                .append("svg")
                .attr("height", mapHeight)
                .attr("width", mapWidth)
                .append("g")
                  .attr("transform", "translate(" + mapMargin.left + "," + mapMargin.top + ")");;

            // Call map tooltip
            map.call(mapTip);

            // Append countries to the map using topoJSON
            appendCountries();

            // Add a title
            addTitle(mapYear);

            // Set-up color scale for legend
            colorScaleMap
                .range(colorbrewer.PuBuGn[6])
                .domain([0, 15]);

            var colorLegend = d3.legendColor()
              .labelFormat(formatThousand)
              .scale(colorScaleMap)
              .shapePadding(0)
              .shapeHeight(6)
              .shapeWidth(90)
              .orient("horizontal");

            // Position the legend and add it to the map
            let yDistance = mapHeight - 30;
            map.append("g")
              .attr("transform", "translate(80," + yDistance + ")")
              .call(colorLegend);

            // Add a description to the legend
            map.append("text")
                .attr("x", 0)
                .attr("y", yDistance + 7)
                .attr("text-anchor", "left")
                .attr("class", "legendText")
                .text("In millions");
        });
    });
}

function updateMap(mapSelectedYear) {

    // Select new parts of the EUROSTAT data
    let newMapData = {};
    let newMapYear = mapSelectedYear;
    energyUsage.forEach(function(d) {
        newMapData[d.GEO] = parseFloat(d[newMapYear]);
    });

      console.log(newMapData);

    // Update scale
    colorScaleMap
        .range(colorbrewer.PuBuGn[9])
        .domain([0, 15000000]);

    // Update map tooltip using the new data
    mapTip.html(function(d) {
        let mapTooltipText = formatThousand(newMapData[d.id]);
        if (typeof newMapData[d.id] != "number") {
            mapTooltipText = "unknown";
        }
        return "<strong>Country:</strong> " + d.properties.NAME + "<br>" + "<strong>Energy usage (TJ):</strong> " + mapTooltipText;
    });

    // Update map data and color
    map.selectAll(".country")
        .transition().duration(400)
        .style("fill", function(d) {
            if (isNaN(newMapData[d.id])) {
                return "slategrey";
            } else {
                return colorScaleMap(newMapData[d.id])
            };
    })

    // Update title
    updateTitle(newMapYear);

}

function appendCountries() {

    // Set-up color scale
    colorScaleMap
        .range(colorbrewer.PuBuGn[9])
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
            if (isNaN(storeData[d.id])) {
                return "slategrey";
            } else {
                return colorScaleMap(storeData[d.id])
            };
        })

        // Add d3-tip functionality
        .on("mouseover", function(d) {
            d3.select(this)
              .style("stroke", "teal")
              .style("stroke-width", 0.25)
            mapTip.show(d);
        })
        .on("mouseout", function(d) {
            d3.select(this)
              .style("stroke", "lightgrey")
              .style("stroke-width", 0.25)
            mapTip.hide(d);
        })
        .on("click", function(d) {
            var mapSelectedCountry = d.id;

            console.log("country selected from map", mapSelectedCountry, lineSelectedSector);

            updateLines(lineSelectedSector, mapSelectedCountry);
        });

}

function addTitle(year) {

    // Add a title
    map.append("text")
        .attr("x", 0)
        .attr("y", mapTitleMargin)
        .attr("text-anchor", "left")
        .attr("class", "titleText")
        .text(year);
}

function updateTitle(year) {

    map.select(".titleText")
      .text(year);

}

var isNumber = function isNumber(value) {
   return typeof value === 'number' &&
   isFinite(value);
}
